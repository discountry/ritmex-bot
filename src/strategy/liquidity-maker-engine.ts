import type { LiquidityMakerConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
} from "../exchanges/types";
import { formatPriceToString } from "../utils/math";
import { createTradeLog } from "../logging/trade-log";
import { isUnknownOrderError, isRateLimitError } from "../utils/errors";
import { isOrderActiveStatus } from "../utils/order-status";
import { getPosition, parseSymbolParts } from "../utils/strategy";
import type { PositionSnapshot } from "../utils/strategy";
import { computePositionPnl } from "../utils/pnl";
import { getTopPrices, getPricesAtLevel, getMidOrLast } from "../utils/price";
import { shouldStopLoss } from "../utils/risk";
import {
  marketClose,
  placeOrder,
  unlockOperating,
} from "../core/order-coordinator";
import type { OrderLockMap, OrderPendingMap, OrderTimerMap } from "../core/order-coordinator";
import type { MakerEngineSnapshot } from "./maker-engine";
import { makeOrderPlan } from "../core/lib/order-plan";
import { safeCancelOrder } from "../core/lib/orders";
import { RateLimitController } from "../core/lib/rate-limit";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { SessionVolumeTracker } from "./common/session-volume";

interface DesiredOrder {
  side: "BUY" | "SELL";
  price: string;
  amount: number;
  reduceOnly: boolean;
}

/** 成交记录，用于追踪平仓价格 */
interface FillRecord {
  side: "BUY" | "SELL";
  price: number;
  amount: number;
  timestamp: number;
}

export interface LiquidityMakerEngineSnapshot extends MakerEngineSnapshot {
  buyDepthSum10: number;
  sellDepthSum10: number;
  depthImbalance: "balanced" | "buy_dominant" | "sell_dominant";
  skipBuySide: boolean;
  skipSellSide: boolean;
  marketType?: "perp" | "spot";
  baseAsset?: string | null;
  quoteAsset?: string | null;
  spotBalances?: { baseAvailable: number; quoteAvailable: number; baseWallet?: number } | null;
  /** 最近一次成交记录 */
  lastFill?: FillRecord | null;
}

type MakerEvent = "update";
type MakerListener = (snapshot: LiquidityMakerEngineSnapshot) => void;

const EPS = 1e-5;

export class LiquidityMakerEngine {
  private accountSnapshot: AsterAccountSnapshot | null = null;
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private lastKline: AsterKline | null = null;
  private liveCandle: { startMs: number; open: number; close: number } | null = null;
  private openOrders: AsterOrder[] = [];

  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pending: OrderPendingMap = {};
  private readonly pendingCancelOrders = new Set<string>();

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<MakerEvent, LiquidityMakerEngineSnapshot>();
  private readonly sessionVolume = new SessionVolumeTracker();
  private priceTick: number = 0.1;
  private qtyStep: number = 0.001;
  private minBaseAmount: number | null = null;
  private minQuoteAmount: number | null = null;
  private precisionSync: Promise<void> | null = null;
  private marketType: "perp" | "spot" = "perp";
  private baseAsset: string | null = null;
  private quoteAsset: string | null = null;
  private baseAssetId: number | null = null;
  private quoteAssetId: number | null = null;
  private spotEntryPrice: number | null = null;
  private lastSpotWallet = 0;
  private spotKlineUp: boolean | null = null;
  private lastSpotBuyGuardLogged = false;
  private lastSpotStopSkipped = false;

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private desiredOrders: DesiredOrder[] = [];
  private accountUnrealized = 0;
  private initialOrderSnapshotReady = false;
  private initialOrderResetDone = false;
  private entryPricePendingLogged = false;
  private readonly rateLimit: RateLimitController;

  private lastBuyDepthSum10 = 0;
  private lastSellDepthSum10 = 0;
  private lastSkipBuy = false;
  private lastSkipSell = false;
  private lastImbalance: "balanced" | "buy_dominant" | "sell_dominant" = "balanced";
  private lastBuyPriceViable = true;
  private lastSellPriceViable = true;
  private feedStatus = {
    account: false,
    depth: false,
    ticker: false,
    orders: false,
  };

  // Reprice suppression for fast-ticking Lighter order book
  private readonly repriceDwellMs: number;
  private readonly minRepriceTicks: number = 2;
  private lastEntryOrderBySide: Record<"BUY" | "SELL", { price: string; ts: number } | null> = {
    BUY: null,
    SELL: null,
  };

  // ====== 新增: 成交追踪和平仓逻辑 ======
  /** 上一轮的订单ID快照，用于检测成交 */
  private lastOrderIds: Set<string> = new Set();
  /** 最近成交记录 */
  private lastFill: FillRecord | null = null;
  /** 当前持仓的入场价（用于不亏本平仓计算） */
  private positionEntryPrice: number | null = null;

  constructor(private readonly config: LiquidityMakerConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.refreshIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
    this.priceTick = Math.max(1e-9, this.config.priceTick);
    this.qtyStep = Math.max(1e-9, this.qtyStep);
    const parsedSymbols = parseSymbolParts(this.config.symbol);
    this.baseAsset = parsedSymbols.base ?? null;
    this.quoteAsset = parsedSymbols.quote ?? null;
    this.syncPrecision();
    // Debounce window defaults to 3x refresh interval, min 1s
    this.repriceDwellMs = Math.max(1000, this.config.refreshIntervalMs * 3);
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.tick();
    }, this.config.refreshIntervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  on(event: MakerEvent, handler: MakerListener): void {
    this.events.on(event, handler);
  }

  off(event: MakerEvent, handler: MakerListener): void {
    this.events.off(event, handler);
  }

  getSnapshot(): LiquidityMakerEngineSnapshot {
    return this.buildSnapshot();
  }

  private bootstrap(): void {
    const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.accountSnapshot = snapshot;
        this.feedStatus.account = true;
        if (snapshot.marketType) {
          this.marketType = snapshot.marketType;
        }
        const parsed = parseSymbolParts(this.config.symbol);
        this.baseAsset = snapshot.baseAsset ?? this.baseAsset ?? parsed.base ?? null;
        this.quoteAsset = snapshot.quoteAsset ?? this.quoteAsset ?? parsed.quote ?? null;
        this.baseAssetId = snapshot.baseAssetId ?? this.baseAssetId;
        this.quoteAssetId = snapshot.quoteAssetId ?? this.quoteAssetId;
        const totalUnrealized = Number(snapshot.totalUnrealizedProfit ?? "0");
        if (Number.isFinite(totalUnrealized)) {
          this.accountUnrealized = totalUnrealized;
        }
        const balances = this.getSpotBalances(snapshot);
        if (snapshot.marketType === "spot" || this.marketType === "spot") {
          const baseWallet = balances?.baseWallet ?? 0;
          if (baseWallet < EPS) {
            this.spotEntryPrice = null;
          } else if (baseWallet > this.lastSpotWallet + EPS) {
            const ref = this.getReferencePrice();
            if (Number.isFinite(ref)) {
              this.spotEntryPrice = Number(ref);
            }
          }
          this.lastSpotWallet = baseWallet;
        }
        const position = getPosition(snapshot, this.config.symbol);
        if (this.marketType === "spot" && this.spotEntryPrice != null) {
          position.entryPrice = this.spotEntryPrice;
        }
        this.sessionVolume.update(position, this.getReferencePrice());
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅账户失败: ${String(error)}`,
        processFail: (error) => `账户推送处理异常: ${String(error)}`,
      }
    );

    safeSubscribe<AsterOrder[]>(
      this.exchange.watchOrders.bind(this.exchange),
      (orders) => {
        this.syncLocksWithOrders(orders);
        this.feedStatus.orders = true;

        // 检测成交：对比上一轮的订单ID
        const currentIds = new Set<string>();
        const activeOrders: AsterOrder[] = [];

        if (Array.isArray(orders)) {
          for (const order of orders) {
            if (
              order.type !== "MARKET" &&
              order.symbol === this.config.symbol &&
              isOrderActiveStatus(order.status)
            ) {
              activeOrders.push(order);
              currentIds.add(String(order.orderId));
            }
          }
        }

        // 检测被成交的订单（上一轮存在但这一轮消失的订单）
        this.detectFills(orders);

        this.openOrders = activeOrders;
        this.lastOrderIds = currentIds;

        for (const id of Array.from(this.pendingCancelOrders)) {
          if (!currentIds.has(id)) {
            this.pendingCancelOrders.delete(id);
          }
        }
        this.initialOrderSnapshotReady = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅订单失败: ${String(error)}`,
        processFail: (error) => `订单推送处理异常: ${String(error)}`,
      }
    );

    safeSubscribe<AsterDepth>(
      this.exchange.watchDepth.bind(this.exchange, this.config.symbol),
      (depth) => {
        this.depthSnapshot = depth;
        this.feedStatus.depth = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅深度失败: ${String(error)}`,
        processFail: (error) => `深度推送处理异常: ${String(error)}`,
      }
    );

    safeSubscribe<AsterTicker>(
      this.exchange.watchTicker.bind(this.exchange, this.config.symbol),
      (ticker) => {
        this.tickerSnapshot = ticker;
        this.feedStatus.ticker = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅Ticker失败: ${String(error)}`,
        processFail: (error) => `价格推送处理异常: ${String(error)}`,
      }
    );

    safeSubscribe<AsterKline[]>(
      this.exchange.watchKlines.bind(this.exchange, this.config.symbol, "1m"),
      (klines) => {
        if (!Array.isArray(klines) || !klines.length) return;
        const latest = klines[klines.length - 1];
        if (!latest) return;
        this.lastKline = latest;
        const open = Number(latest.open);
        const close = Number(latest.close);
        if (Number.isFinite(open) && Number.isFinite(close)) {
          this.spotKlineUp = close > open;
        }
      },
      log,
      {
        subscribeFail: (error) => `订阅K线失败: ${String(error)}`,
        processFail: (error) => `K线推送处理异常: ${String(error)}`,
      }
    );
  }

  /** 检测成交订单 */
  private detectFills(orders: AsterOrder[] | null | undefined): void {
    if (!Array.isArray(orders)) return;

    // 查找已成交或部分成交的订单
    for (const order of orders) {
      if (order.symbol !== this.config.symbol) continue;

      const orderId = String(order.orderId);
      const wasActive = this.lastOrderIds.has(orderId);
      const isFilled = order.status === "FILLED" || order.status === "PARTIALLY_FILLED";

      // 如果订单之前是活跃的，现在已成交
      if (wasActive && isFilled) {
        const filledQty = Number(order.executedQty ?? 0);
        const avgPrice = Number(order.avgPrice ?? order.price);

        if (filledQty > EPS && Number.isFinite(avgPrice) && avgPrice > 0) {
          this.lastFill = {
            side: order.side as "BUY" | "SELL",
            price: avgPrice,
            amount: filledQty,
            timestamp: Date.now(),
          };

          // 更新入场价
          if ((order.side === "BUY" && !order.reduceOnly) ||
              (order.side === "SELL" && !order.reduceOnly)) {
            this.positionEntryPrice = avgPrice;
          }

          this.tradeLog.push(
            "order",
            `检测到成交: ${order.side} ${filledQty.toFixed(6)} @ ${avgPrice.toFixed(this.getPriceDecimals())}`
          );
        }
      }
    }
  }

  private syncLocksWithOrders(orders: AsterOrder[] | null | undefined): void {
    const list = Array.isArray(orders) ? orders : [];
    Object.keys(this.pending).forEach((type) => {
      const pendingId = this.pending[type];
      if (!pendingId) return;
      const match = list.find((order) => String(order.orderId) === pendingId);
      if (!match || (match.status && match.status !== "NEW" && match.status !== "PARTIALLY_FILLED")) {
        unlockOperating(this.locks, this.timers, this.pending, type);
      }
    });
  }

  private isReady(): boolean {
    return Boolean(this.accountSnapshot && this.depthSnapshot);
  }

  private async tick(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    let hadRateLimit = false;
    try {
      const decision = this.rateLimit.beforeCycle();
      if (decision === "paused") {
        this.emitUpdate();
        return;
      }
      if (decision === "skip") {
        return;
      }
      if (!this.isReady()) {
        this.emitUpdate();
        return;
      }
      if (!(await this.ensureStartupOrderReset())) {
        this.emitUpdate();
        return;
      }

      // 确保使用最新的深度数据
      const depth = this.depthSnapshot!;
      const { topBid, topAsk } = getTopPrices(depth);
      if (topBid == null || topAsk == null) {
        this.emitUpdate();
        return;
      }

      // 使用更敏感的偏移判断（2倍阈值）
      const { buySum, sellSum, skipBuySide, skipSellSide, imbalance } = this.evaluateDepth(depth);
      this.lastBuyDepthSum10 = buySum;
      this.lastSellDepthSum10 = sellSum;
      this.lastSkipBuy = skipBuySide;
      this.lastSkipSell = skipSellSide;
      this.lastImbalance = imbalance;

      const position = this.getPositionSnapshot();
      const isSpotMarket = this.marketType === "spot";
      const spotBalances = isSpotMarket ? this.getSpotBalances() : null;
      const balancesForSpot = isSpotMarket ? spotBalances ?? { baseAvailable: 0, quoteAvailable: 0, baseWallet: 0 } : spotBalances;
      this.updateLiveCandle();
      const handledImbalance = await this.handleImbalanceExit(position, buySum, sellSum);
      if (handledImbalance) {
        this.emitUpdate();
        return;
      }

      // 在计算挂单价格前，重新获取最新的深度数据以确保价格同步
      const latestDepth = this.depthSnapshot!;
      const { topBid: latestBid, topAsk: latestAsk } = getTopPrices(latestDepth);
      const finalBid = latestBid ?? topBid!;
      const finalAsk = latestAsk ?? topAsk!;

      // 直接使用orderbook价格，格式化为字符串避免精度问题
      const priceDecimals = this.getPriceDecimals();
      // 平仓价格始终使用买1/卖1
      const closeBidPrice = formatPriceToString(finalBid, priceDecimals);
      const closeAskPrice = formatPriceToString(finalAsk, priceDecimals);

      // 开仓价格根据 entryDepthLevel 使用指定档位
      const entryLevel = this.config.entryDepthLevel ?? 1;
      const { bidAtLevel: entryBid, askAtLevel: entryAsk } = getPricesAtLevel(latestDepth, entryLevel);
      const entryBidBase = entryBid ?? finalBid;
      const entryAskBase = entryAsk ?? finalAsk;

      const rawBidPrice = entryBidBase - this.config.bidOffset;
      const rawAskPrice = entryAskBase + this.config.askOffset;
      const safeBid = this.ensureMakerPrice("BUY", rawBidPrice, finalBid, finalAsk);
      const safeAsk = this.ensureMakerPrice("SELL", rawAskPrice, finalBid, finalAsk);
      const bidPrice = safeBid != null ? formatPriceToString(safeBid, priceDecimals) : null;
      const askPrice = safeAsk != null ? formatPriceToString(safeAsk, priceDecimals) : null;
      const rawAbsPosition = Math.abs(position.positionAmt);
      const minSell =
        Number.isFinite(this.minBaseAmount) && this.minBaseAmount! > 0
          ? this.minBaseAmount!
          : Math.max(this.config.tradeAmount, this.qtyStep);
      let absPosition = rawAbsPosition;
      const tinySpotPosition =
        isSpotMarket &&
        minSell > 0 &&
        rawAbsPosition > EPS &&
        rawAbsPosition + EPS < minSell;
      if (tinySpotPosition) {
        absPosition = 0; // treat as flat to allow buys to accumulate until reaching minimum sell size
      }
      const desired: DesiredOrder[] = [];
      const canEnter = !this.rateLimit.shouldBlockEntries();
      const allowSpotBuy = !isSpotMarket || this.isSpotKlineUp();

      if (absPosition < EPS && isSpotMarket) {
        this.entryPricePendingLogged = false;
        const baseAvail = balancesForSpot?.baseAvailable ?? 0;
        const baseWallet = balancesForSpot?.baseWallet ?? baseAvail;
        const maxBase = Math.max(baseAvail, baseWallet);
        if (isSpotMarket && minSell > 0 && maxBase + EPS < minSell) {
          // 无法卖出，跳过卖单，允许买单累计
          this.lastSellPriceViable = false;
          if (!skipSellSide) {
            this.tradeLog.push("info", "现货持仓低于最小卖单量，暂不挂卖单");
          }
        }
        if (!skipBuySide && canEnter) {
          if (!allowSpotBuy) {
            if (this.lastBuyPriceViable) {
              this.tradeLog.push("info", "现货买入仅在1m阳线，当前跳过买单");
              this.lastBuyPriceViable = false;
            }
          } else {
            const buyAmount = this.computeSpotOrderSize({
              side: "BUY",
              desiredAmount: this.config.tradeAmount,
              price: bidPrice != null ? Number(bidPrice) : null,
              balances: balancesForSpot,
            });
            if (bidPrice != null && buyAmount >= EPS) {
              this.lastBuyPriceViable = true;
              desired.push({ side: "BUY", price: bidPrice, amount: buyAmount, reduceOnly: false });
            } else if (this.lastBuyPriceViable) {
              this.lastBuyPriceViable = false;
              const reason =
                buyAmount < EPS && isSpotMarket
                  ? "现货可用报价资产不足，跳过买单"
                  : "跳过买单：价差不足以构造maker价格";
              this.tradeLog.push("info", reason);
            }
          }
        }
        if (!skipSellSide && canEnter) {
          const baseAvail = balancesForSpot?.baseAvailable ?? 0;
          const baseWallet = balancesForSpot?.baseWallet ?? baseAvail;
          const maxBase = Math.max(baseAvail, baseWallet);
          if (isSpotMarket && minSell > 0 && maxBase + EPS < minSell) {
            // 持仓低于最小卖单量，跳过卖单，等待累积
            if (this.lastSellPriceViable) {
              this.lastSellPriceViable = false;
              this.tradeLog.push("info", "现货持仓低于最小卖单量，跳过卖单");
            }
          } else {
            const desiredSellAmount =
              isSpotMarket && balancesForSpot ? balancesForSpot.baseAvailable : this.config.tradeAmount;
            const sellAmount = this.computeSpotOrderSize({
              side: "SELL",
              desiredAmount: desiredSellAmount,
              price: askPrice != null ? Number(askPrice) : null,
              balances: balancesForSpot,
            });
            if (askPrice != null && sellAmount >= EPS) {
              this.lastSellPriceViable = true;
              desired.push({ side: "SELL", price: askPrice, amount: sellAmount, reduceOnly: false });
            } else if (this.lastSellPriceViable) {
              this.lastSellPriceViable = false;
              const reason =
                sellAmount < EPS && isSpotMarket
                  ? "现货可用基础资产不足，跳过卖单"
                  : "跳过卖单：价差不足以构造maker价格";
              this.tradeLog.push("info", reason);
            }
          }
        }
      } else if (absPosition < EPS) {
        // 永续合约无持仓
        this.entryPricePendingLogged = false;
        if (!skipBuySide && canEnter) {
          if (isSpotMarket && !allowSpotBuy) {
            if (this.lastBuyPriceViable) {
              this.tradeLog.push("info", "现货买入仅在1m阳线，当前跳过买单");
              this.lastBuyPriceViable = false;
            }
          } else if (bidPrice != null) {
            desired.push({ side: "BUY", price: bidPrice, amount: this.config.tradeAmount, reduceOnly: false });
          }
        }
        if (!skipSellSide && canEnter) {
          if (isSpotMarket && minSell > 0 && this.minBaseAmount != null) {
            const baseAvail = balancesForSpot?.baseAvailable ?? 0;
            const baseWallet = balancesForSpot?.baseWallet ?? baseAvail;
            if (Math.max(baseAvail, baseWallet) + EPS < minSell) {
              this.lastSellPriceViable = false;
              this.tradeLog.push("info", "现货持仓低于最小卖单量，跳过卖单");
            }
          }
          if (askPrice != null) {
            desired.push({ side: "SELL", price: askPrice, amount: this.config.tradeAmount, reduceOnly: false });
          }
        }
      } else {
        // ====== 有持仓：使用改进的平仓逻辑 ======
        const closeSide: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";

        // 计算平仓价格：基于成交价或入场价，确保不亏本
        const closePrice = this.computeClosePrice(
          closeSide,
          position,
          finalBid,
          finalAsk,
          priceDecimals
        );

        if (isSpotMarket && minSell > 0 && rawAbsPosition + EPS < minSell) {
          // 持仓未达最小卖出量，等待累积，不下单
          this.lastSellPriceViable = false;
          this.lastBuyPriceViable = false;
          this.desiredOrders = [];
          this.sessionVolume.update(position, this.getReferencePrice());
          this.emitUpdate();
          return;
        }
        const closeQty =
          isSpotMarket && balancesForSpot
            ? this.computeSpotOrderSize({
                side: "SELL",
                desiredAmount: rawAbsPosition,
                price: closePrice != null ? Number(closePrice) : null,
                balances: balancesForSpot,
              })
            : rawAbsPosition;
        if (closePrice != null && closeQty >= EPS) {
          desired.push({ side: closeSide, price: closePrice, amount: closeQty, reduceOnly: false });
        }
      }

      this.desiredOrders = desired;
      this.sessionVolume.update(position, this.getReferencePrice());
      await this.syncOrders(desired);
      await this.checkRisk(position, Number(closeBidPrice), Number(closeAskPrice));
      this.emitUpdate();
    } catch (error) {
      if (isRateLimitError(error)) {
        hadRateLimit = true;
        this.rateLimit.registerRateLimit("liquidity-maker");
        await this.enforceRateLimitStop();
        this.tradeLog.push("warn", `LiquidityMakerEngine 429: ${String(error)}`);
      } else {
        this.tradeLog.push("error", `流动性做市循环异常: ${String(error)}`);
      }
      this.emitUpdate();
    } finally {
      this.rateLimit.onCycleComplete(hadRateLimit);
      this.processing = false;
    }
  }

  /**
   * 计算平仓价格：
   * 1. 如果有最近成交，在成交价基础上偏移指定档位
   * 2. 确保不亏本（多头平仓价 >= 入场价，空头平仓价 <= 入场价）
   * 3. 如果计算的价格无法盈利，返回null（等待市价平仓或重新计算）
   */
  private computeClosePrice(
    closeSide: "BUY" | "SELL",
    position: PositionSnapshot,
    topBid: number,
    topAsk: number,
    priceDecimals: number
  ): string | null {
    const tickOffset = this.config.closeTickOffset * this.priceTick;
    const entryPrice = position.entryPrice || this.positionEntryPrice;

    let targetPrice: number;

    // 基于最近成交或入场价计算目标价，应用 closeTickOffset
    if (this.lastFill && Date.now() - this.lastFill.timestamp < 60000) {
      // 最近1分钟内有成交，基于成交价计算
      if (closeSide === "SELL") {
        targetPrice = this.lastFill.price + tickOffset;
      } else {
        targetPrice = this.lastFill.price - tickOffset;
      }
    } else if (entryPrice && Number.isFinite(entryPrice) && entryPrice > 0) {
      // 没有最近成交但有入场价，基于入场价计算
      if (closeSide === "SELL") {
        targetPrice = entryPrice + tickOffset;
      } else {
        targetPrice = entryPrice - tickOffset;
      }
    } else {
      // 没有成交也没有入场价，使用orderbook价格
      if (closeSide === "SELL") {
        targetPrice = topAsk;
      } else {
        targetPrice = topBid;
      }
    }

    // 确保不亏本（仅当目标价低于入场价时调整）
    if (entryPrice && Number.isFinite(entryPrice) && entryPrice > 0) {
      if (closeSide === "SELL") {
        // 多头平仓：卖价必须 >= 入场价
        if (targetPrice < entryPrice) {
          targetPrice = entryPrice + this.priceTick;
          this.tradeLog.push("info", `平仓价调整为入场价+1tick以确保不亏本: ${targetPrice.toFixed(priceDecimals)}`);
        }
      } else {
        // 空头平仓：买价必须 <= 入场价
        if (targetPrice > entryPrice) {
          targetPrice = entryPrice - this.priceTick;
          this.tradeLog.push("info", `平仓价调整为入场价-1tick以确保不亏本: ${targetPrice.toFixed(priceDecimals)}`);
        }
      }
    }

    // 确保是有效的maker价格
    const safePrice = this.ensureMakerPrice(closeSide, targetPrice, topBid, topAsk);
    if (safePrice == null || safePrice <= 0) {
      return null;
    }

    return formatPriceToString(safePrice, priceDecimals);
  }

  private async enforceRateLimitStop(): Promise<void> {
    if (this.marketType === "spot") return;
    const position = this.getPositionSnapshot();
    if (Math.abs(position.positionAmt) < EPS) return;
    await this.flushOrders();
    const absPosition = Math.abs(position.positionAmt);
    const side: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const priceDecimals = this.getPriceDecimals();
    const closeBidPrice = topBid != null ? formatPriceToString(topBid, priceDecimals) : null;
    const closeAskPrice = topAsk != null ? formatPriceToString(topAsk, priceDecimals) : null;
    try {
      await marketClose(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        side,
        absPosition,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          expectedPrice:
            side === "SELL"
              ? (closeAskPrice != null ? Number(closeAskPrice) : null)
              : (closeBidPrice != null ? Number(closeBidPrice) : null),
          maxPct: this.config.maxCloseSlippagePct,
        },
        { qtyStep: this.qtyStep }
      );
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "限频强制平仓时订单已不存在");
      } else {
        this.tradeLog.push("error", `限频强制平仓失败: ${String(error)}`);
      }
    }
  }

  private async ensureStartupOrderReset(): Promise<boolean> {
    if (this.initialOrderResetDone) return true;
    if (!this.initialOrderSnapshotReady) return false;
    if (!this.openOrders.length) {
      this.initialOrderResetDone = true;
      return true;
    }
    try {
      await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");
      this.openOrders = [];
      this.emitUpdate();
      this.tradeLog.push("order", "启动时清理历史挂单");
      this.initialOrderResetDone = true;
      return true;
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "历史挂单已消失，跳过启动清理");
        this.initialOrderResetDone = true;
        this.openOrders = [];
        this.emitUpdate();
        return true;
      }
      this.tradeLog.push("error", `启动撤单失败: ${String(error)}`);
      return false;
    }
  }

  /**
   * 更敏感的偏移判断：当一侧深度超出另一侧 depthImbalanceRatio 倍时，
   * 取消订单簿较薄一端的订单
   */
  private evaluateDepth(depth: AsterDepth): {
    buySum: number;
    sellSum: number;
    skipBuySide: boolean;
    skipSellSide: boolean;
    imbalance: "balanced" | "buy_dominant" | "sell_dominant";
  } {
    const levels = 10;
    const ratio = this.config.depthImbalanceRatio; // 使用配置的阈值（默认2倍）

    const topBids = (depth.bids ?? []).slice(0, levels);
    const topAsks = (depth.asks ?? []).slice(0, levels);

    const buySum = topBids.reduce((total, level) => {
      const qty = Number(level?.[1]);
      return Number.isFinite(qty) ? total + qty : total;
    }, 0);

    const sellSum = topAsks.reduce((total, level) => {
      const qty = Number(level?.[1]);
      return Number.isFinite(qty) ? total + qty : total;
    }, 0);

    // 更敏感的判断：只要一侧超出另一侧2倍，就取消薄端
    const skipSellSide = sellSum === 0 || sellSum * ratio < buySum;
    const skipBuySide = buySum === 0 || buySum * ratio < sellSum;

    let imbalance: "balanced" | "buy_dominant" | "sell_dominant" = "balanced";
    if (buySum > sellSum * ratio) {
      imbalance = "buy_dominant";
    } else if (sellSum > buySum * ratio) {
      imbalance = "sell_dominant";
    }

    return { buySum, sellSum, skipBuySide, skipSellSide, imbalance };
  }

  /**
   * 流动性做市商禁用深度极端不平衡市价平仓逻辑
   * 仅依赖 evaluateDepth 中的 skipBuySide/skipSellSide 来取消薄端挂单
   */
  private async handleImbalanceExit(
    _position: PositionSnapshot,
    _buySum: number,
    _sellSum: number
  ): Promise<boolean> {
    // 流动性做市商不执行深度不平衡市价平仓，始终返回 false
    return false;
  }

  private async syncOrders(targets: DesiredOrder[]): Promise<void> {
    const availableOrders = this.openOrders.filter((o) => !this.pendingCancelOrders.has(String(o.orderId)));
    const openOrders = availableOrders.filter((order) => isOrderActiveStatus(order.status));

    // Coalesce reprices for entry orders: if within tick threshold or within dwell window, keep existing order
    const adjustedTargets: DesiredOrder[] = targets.map((t) => ({ ...t }));
    for (let i = 0; i < adjustedTargets.length; i++) {
      const t = adjustedTargets[i];
      if (!t || t.reduceOnly) continue; // only suppress entry orders
      const existing = availableOrders.find((o) => o.side === t.side && o.reduceOnly !== true);
      if (!existing) continue;
      const newPrice = Number(t.price);
      const oldPrice = Number(existing.price);
      if (!Number.isFinite(newPrice) || !Number.isFinite(oldPrice)) continue;
      const ticksDiff = Math.abs(newPrice - oldPrice) / this.priceTick;
      const recentPlaced = this.lastEntryOrderBySide[t.side]?.ts ?? 0;
      const withinDwell = Date.now() - recentPlaced < this.repriceDwellMs;
      if (ticksDiff < this.minRepriceTicks || withinDwell) {
        // Keep the existing resting order to avoid cancel/place churn
        adjustedTargets[i] = {
          side: t.side,
          price: String(existing.price),
          amount: t.amount,
          reduceOnly: false,
        };
      }
    }

    const { toCancel, toPlace } = makeOrderPlan(openOrders, adjustedTargets);

    for (const order of toCancel) {
      if (this.pendingCancelOrders.has(String(order.orderId))) continue;
      this.pendingCancelOrders.add(String(order.orderId));
      await safeCancelOrder(
        this.exchange,
        this.config.symbol,
        order,
        () => {
          this.tradeLog.push(
            "order",
            `撤销不匹配订单 ${order.side} @ ${order.price} reduceOnly=${order.reduceOnly}`
          );
          // 保持与原逻辑一致：成功撤销不立即修改本地 openOrders，等待订单流重建
        },
        () => {
          this.tradeLog.push("order", "撤销时发现订单已被成交/取消，忽略");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `撤销订单失败: ${String(error)}`);
          this.pendingCancelOrders.delete(String(order.orderId));
          // 避免同一轮内重复操作同一张已出错的本地挂单，直接从本地缓存移除，等待下一次订单推送重建
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        }
      );
    }

    for (const target of toPlace) {
      if (!target) continue;
      if (target.amount < EPS) continue;
      if (
        this.marketType === "spot" &&
        this.minBaseAmount != null &&
        target.side === "SELL" &&
        target.amount + EPS < this.minBaseAmount
      ) {
        // Skip placing sells that would be bumped by venue minimums
        if (this.lastSellPriceViable) {
          this.lastSellPriceViable = false;
          this.tradeLog.push("info", "现货卖单低于最小成交量，跳过挂单等待累积");
        }
        continue;
      }
      try {
        const reduceOnlyFlag = this.marketType === "spot" ? false : target.reduceOnly;
        await placeOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pending,
          target.side,
          target.price, // 已经是字符串价格
          target.amount,
          (type, detail) => this.tradeLog.push(type, detail),
          reduceOnlyFlag,
          {
            markPrice: this.getPositionSnapshot().markPrice,
            maxPct: this.config.maxCloseSlippagePct,
          },
          {
            priceTick: this.priceTick,
            qtyStep: this.qtyStep,
          }
        );
        // Record last placed entry order timing and price
        if (!target.reduceOnly) {
          this.lastEntryOrderBySide[target.side] = { price: target.price, ts: Date.now() };
        }
      } catch (error) {
        if (isRateLimitError(error)) {
          throw error;
        }
        let dustClosed = false;
        try {
          dustClosed = await this.tryDustMarketClose(target, error);
        } catch (dustError) {
          if (isRateLimitError(dustError)) {
            throw dustError;
          }
          this.tradeLog.push("error", `小额市价平仓失败: ${String(dustError)}`);
        }
        if (dustClosed) continue;
        this.tradeLog.push("error", `挂单失败(${target.side} ${target.price}): ${String(error)}`);
      }
    }
  }

  private async checkRisk(position: PositionSnapshot, bidPrice: number, askPrice: number): Promise<void> {
    // For spot: use balance-derived size; if loss exceeds threshold, market sell to exit.
    if (this.marketType === "spot") {
      const absPosition = Math.abs(position.positionAmt);
      if (absPosition < EPS) {
        this.lastSpotStopSkipped = false;
        return;
      }
      const minStopQty = Number.isFinite(this.minBaseAmount) ? this.minBaseAmount! : null;
      if (minStopQty != null && minStopQty > 0 && absPosition + EPS < minStopQty) {
        if (!this.lastSpotStopSkipped) {
          this.tradeLog.push("info", "现货持仓低于最小平仓数量，跳过止损检查");
          this.lastSpotStopSkipped = true;
        }
        return;
      }
      this.lastSpotStopSkipped = false;
      const pnl = computePositionPnl(position, bidPrice, askPrice);
      const triggerStop = shouldStopLoss(position, bidPrice, askPrice, this.config.lossLimit);
      if (!triggerStop) return;
      this.tradeLog.push("stop", `现货止损，当前仓位=${absPosition.toFixed(6)} PnL=${pnl.toFixed(4)} USDT`);
      try {
        // 尽力撤销所有未完成挂单，避免锁定基础资产导致余额不足
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol }).catch(() => {});
        await this.flushOrders();
        await marketClose(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pending,
          "SELL",
          absPosition,
          (type, detail) => this.tradeLog.push(type, detail),
          {
            markPrice: position.markPrice,
            expectedPrice: bidPrice || null,
            maxPct: this.config.maxCloseSlippagePct,
          },
          { qtyStep: this.qtyStep }
        );
      } catch (error) {
        if (isRateLimitError(error)) throw error;
        if (isUnknownOrderError(error)) {
          this.tradeLog.push("order", "止损平仓时订单已不存在");
        } else {
          this.tradeLog.push("error", `现货止损失败: ${String(error)}`);
        }
      }
      return;
    }
    const absPosition = Math.abs(position.positionAmt);
    if (absPosition < EPS) return;

    const hasEntryPrice = Number.isFinite(position.entryPrice) && Math.abs(position.entryPrice) > 1e-8;
    if (!hasEntryPrice) {
      if (!this.entryPricePendingLogged) {
        this.tradeLog.push("info", "做市持仓均价未同步，等待账户快照刷新后再执行止损判断");
        this.entryPricePendingLogged = true;
      }
      return;
    }
    this.entryPricePendingLogged = false;

    const pnl = computePositionPnl(position, bidPrice, askPrice);
    const triggerStop = shouldStopLoss(position, bidPrice, askPrice, this.config.lossLimit);

    if (triggerStop) {
      this.tradeLog.push(
        "stop",
        `触发止损，方向=${position.positionAmt > 0 ? "多" : "空"} 当前亏损=${pnl.toFixed(4)} USDT`
      );
      try {
        await this.flushOrders();
        await marketClose(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pending,
          position.positionAmt > 0 ? "SELL" : "BUY",
          absPosition,
          (type, detail) => this.tradeLog.push(type, detail),
          {
            markPrice: position.markPrice,
            expectedPrice: Number(position.positionAmt > 0 ? bidPrice : askPrice) || null,
            maxPct: this.config.maxCloseSlippagePct,
          },
          { qtyStep: this.qtyStep }
        );
      } catch (error) {
        if (isUnknownOrderError(error)) {
          this.tradeLog.push("order", "止损平仓时订单已不存在");
        } else {
          this.tradeLog.push("error", `止损平仓失败: ${String(error)}`);
        }
      }
    }
  }

  private async flushOrders(): Promise<void> {
    if (!this.openOrders.length) return;
    for (const order of this.openOrders) {
      if (this.pendingCancelOrders.has(String(order.orderId))) continue;
      this.pendingCancelOrders.add(String(order.orderId));
      await safeCancelOrder(
        this.exchange,
        this.config.symbol,
        order,
        () => {
          // 与原逻辑保持一致：成功撤销不记录日志且不修改本地 openOrders
        },
        () => {
          this.tradeLog.push("order", "订单已不存在，撤销跳过");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `撤销订单失败: ${String(error)}`);
          this.pendingCancelOrders.delete(String(order.orderId));
          // 与同步撤单路径保持一致，移除本地异常订单，等待订单流重建
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        }
      );
    }
  }

  private syncPrecision(): void {
    if (this.precisionSync) return;
    const getPrecision = this.exchange.getPrecision?.bind(this.exchange);
    if (!getPrecision) return;
    this.precisionSync = getPrecision()
      .then((precision) => {
        if (!precision) return;
        let updated = false;
        if (Number.isFinite(precision.priceTick) && precision.priceTick > 0) {
          if (Math.abs(precision.priceTick - this.priceTick) > 1e-12) {
            this.priceTick = precision.priceTick;
            this.config.priceTick = precision.priceTick;
            updated = true;
          }
        }
        if (Number.isFinite(precision.qtyStep) && precision.qtyStep > 0) {
          if (Math.abs(precision.qtyStep - this.qtyStep) > 1e-12) {
            this.qtyStep = precision.qtyStep;
            updated = true;
          }
        }
        if (Number.isFinite(precision.minBaseAmount)) {
          this.minBaseAmount = precision.minBaseAmount!;
        }
        if (Number.isFinite(precision.minQuoteAmount)) {
          this.minQuoteAmount = precision.minQuoteAmount!;
        }
        if (updated) {
          this.tradeLog.push(
            "info",
            `已同步交易精度: priceTick=${precision.priceTick} qtyStep=${precision.qtyStep}`
          );
        }
      })
      .catch((error) => {
        this.tradeLog.push("error", `同步精度失败: ${String(error)}`);
        this.precisionSync = null;
        setTimeout(() => this.syncPrecision(), 2000);
      });
  }

  private getPriceDecimals(): number {
    const tick = Math.max(1e-9, this.priceTick);
    const raw = Math.log10(1 / tick);
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.floor(raw + 1e-9));
  }

  private emitUpdate(): void {
    try {
      const snapshot = this.buildSnapshot();
      this.events.emit("update", snapshot, (error) => {
        this.tradeLog.push("error", `更新回调处理异常: ${String(error)}`);
      });
    } catch (err) {
      this.tradeLog.push("error", `快照或更新分发异常: ${String(err)}`);
    }
  }

  private buildSnapshot(): LiquidityMakerEngineSnapshot {
    const position = this.getPositionSnapshot();
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const spread = topBid != null && topAsk != null ? topAsk - topBid : null;
    const pnl = computePositionPnl(position, topBid, topAsk);

    return {
      ready: this.isReady(),
      symbol: this.config.symbol,
      topBid: topBid,
      topAsk: topAsk,
      spread,
      priceDecimals: this.getPriceDecimals(),
      position,
      pnl,
      accountUnrealized: this.accountUnrealized,
      sessionVolume: this.sessionVolume.value,
      openOrders: this.openOrders,
      desiredOrders: this.desiredOrders,
      tradeLog: this.tradeLog.all(),
      lastUpdated: Date.now(),
      feedStatus: { ...this.feedStatus },
      buyDepthSum10: this.lastBuyDepthSum10,
      sellDepthSum10: this.lastSellDepthSum10,
      depthImbalance: this.lastImbalance,
      skipBuySide: this.lastSkipBuy,
      skipSellSide: this.lastSkipSell,
      marketType: this.marketType,
      baseAsset: this.baseAsset,
      quoteAsset: this.quoteAsset,
      spotBalances: this.marketType === "spot" ? this.getSpotBalances() : null,
      lastFill: this.lastFill,
    };
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot);
  }

  private isSpotKlineUp(): boolean {
    return this.spotKlineUp === true || this.isLiveCandleUp();
  }

  private isLiveCandleUp(): boolean {
    if (!this.liveCandle) return false;
    return this.liveCandle.close > this.liveCandle.open;
  }

  private updateLiveCandle(): void {
    const price = this.getReferencePrice();
    if (!Number.isFinite(price)) return;
    const now = Date.now();
    const minuteStart = now - (now % 60000);
    if (!this.liveCandle || this.liveCandle.startMs !== minuteStart) {
      this.liveCandle = { startMs: minuteStart, open: price as number, close: price as number };
    } else {
      this.liveCandle.close = price as number;
    }
    this.spotKlineUp = this.isLiveCandleUp();
  }

  private getPositionSnapshot(): PositionSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    if (this.marketType === "spot" && this.spotEntryPrice != null && Math.abs(position.positionAmt) > EPS) {
      return { ...position, entryPrice: this.spotEntryPrice };
    }
    return position;
  }

  private getSpotBalances(snapshot: AsterAccountSnapshot | null = this.accountSnapshot): { baseAvailable: number; quoteAvailable: number; baseWallet: number } | null {
    const assets = snapshot?.assets ?? [];
    if (!assets.length) return null;
    const parsed = parseSymbolParts(this.config.symbol);
    const baseSymbol = (this.baseAsset ?? snapshot?.baseAsset ?? parsed.base ?? "").toUpperCase();
    const quoteSymbol = (this.quoteAsset ?? snapshot?.quoteAsset ?? parsed.quote ?? "").toUpperCase();
    const baseId = snapshot?.baseAssetId ?? this.baseAssetId ?? null;
    const quoteId = snapshot?.quoteAssetId ?? this.quoteAssetId ?? null;
    const normalize = (asset?: string) => (asset ? asset.toUpperCase() : "");
    const pickAvailable = (asset?: { availableBalance?: string; walletBalance: string }) => {
      const available = Number(asset?.availableBalance ?? asset?.walletBalance ?? 0);
      return Number.isFinite(available) ? available : 0;
    };
    const pickWallet = (asset?: { walletBalance: string }) => {
      const wallet = Number(asset?.walletBalance ?? 0);
      return Number.isFinite(wallet) ? wallet : 0;
    };
    const baseAssetEntry = assets.find(
      (asset) =>
        (Number.isFinite(baseId) && Number(asset.assetId) === Number(baseId)) ||
        normalize(asset.asset) === baseSymbol
    );
    const quoteAssetEntry = assets.find(
      (asset) =>
        (Number.isFinite(quoteId) && Number(asset.assetId) === Number(quoteId)) ||
        normalize(asset.asset) === quoteSymbol
    );
    return {
      baseAvailable: pickAvailable(baseAssetEntry),
      quoteAvailable: pickAvailable(quoteAssetEntry),
      baseWallet: pickWallet(baseAssetEntry),
    };
  }

  private computeSpotOrderSize(params: {
    side: "BUY" | "SELL";
    desiredAmount: number;
    price: number | null;
    balances: { baseAvailable: number; quoteAvailable: number; baseWallet?: number } | null;
  }): number {
    const desired = Number(params.desiredAmount);
    if (!Number.isFinite(desired) || desired <= 0) return 0;
    if (!params.balances) return desired;
    if (params.side === "SELL") {
      const cap = Math.max(0, params.balances.baseAvailable, params.balances.baseWallet ?? 0);
      if (this.minBaseAmount != null && cap + EPS < this.minBaseAmount) {
        return 0; // below venue min trade size; skip sell until enough balance
      }
      return this.roundToStep(Math.max(0, Math.min(desired, cap)));
    }
    const price = Number(params.price);
    const quoteAvailable = Math.max(0, params.balances.quoteAvailable ?? 0);
    if (!Number.isFinite(price) || price <= 0) return desired;
    const maxByQuote = quoteAvailable / price;
    return this.roundToStep(Math.max(0, Math.min(desired, maxByQuote)));
  }

  private roundToStep(amount: number): number {
    const step = Math.max(1e-9, this.qtyStep);
    return Math.floor(amount / step) * step;
  }

  private ensureMakerPrice(
    side: "BUY" | "SELL",
    rawPrice: number,
    topBid: number | null,
    topAsk: number | null
  ): number | null {
    if (!Number.isFinite(rawPrice) || rawPrice <= 0) return null;
    const tick = Math.max(this.priceTick, 1e-9);
    if (side === "BUY") {
      if (topAsk == null || !Number.isFinite(topAsk)) return rawPrice;
      const maxPrice = Number(topAsk) - tick;
      if (!Number.isFinite(maxPrice) || maxPrice <= 0) return null;
      const adjusted = Math.min(rawPrice, maxPrice);
      return adjusted > 0 ? adjusted : null;
    }
    if (side === "SELL") {
      if (topBid == null || !Number.isFinite(topBid)) return rawPrice;
      const minPrice = Number(topBid) + tick;
      if (!Number.isFinite(minPrice) || minPrice <= 0) return null;
      const adjusted = Math.max(rawPrice, minPrice);
      return adjusted > 0 ? adjusted : null;
    }
    return rawPrice;
  }

  private isInvalidAmountError(error: unknown): boolean {
    const message =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : JSON.stringify(error);
    if (!message) return false;
    if (message.includes("\"code\":21706")) return true;
    return message.toLowerCase().includes("invalid order base or quote amount");
  }

  private async tryDustMarketClose(target: DesiredOrder, error: unknown): Promise<boolean> {
    if (!target.reduceOnly) return false;
    if (!this.isInvalidAmountError(error)) return false;
    const position = this.getPositionSnapshot();
    const absQty = Math.abs(target.amount);
    if (absQty < EPS) return false;
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    try {
      await marketClose(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        target.side,
        absQty,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          expectedPrice:
            target.side === "SELL"
              ? (topBid != null ? Number(topBid) : null)
              : (topAsk != null ? Number(topAsk) : null),
          maxPct: this.config.maxCloseSlippagePct,
        },
        { qtyStep: this.qtyStep }
      );
      this.tradeLog.push("order", `小额仓位使用市价平仓 ${target.side} 数量 ${absQty.toFixed(6)}`);
      return true;
    } catch (closeError) {
      if (isRateLimitError(closeError)) {
        throw closeError;
      }
      this.tradeLog.push("error", `小额市价平仓失败: ${String(closeError)}`);
      return false;
    }
  }
}
