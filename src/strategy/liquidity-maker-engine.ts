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

/** Fill record used to track close pricing. */
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
  /** Most recent fill record. */
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

  // Fill tracking and close-price logic
  /** Previous tick's order-id snapshot for fill detection. */
  private lastOrderIds: Set<string> = new Set();
  /** Most recent fill record. */
  private lastFill: FillRecord | null = null;
  /** Current entry price, used for non-loss close calculation. */
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
        subscribeFail: (error) => `Account subscription failed: ${String(error)}`,
        processFail: (error) => `Account stream processing error: ${String(error)}`,
      }
    );

    safeSubscribe<AsterOrder[]>(
      this.exchange.watchOrders.bind(this.exchange),
      (orders) => {
        this.syncLocksWithOrders(orders);
        this.feedStatus.orders = true;

        // Detect fills by comparing with previous tick order IDs.
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

        // Detect filled orders (present previously, missing now).
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
        subscribeFail: (error) => `Order subscription failed: ${String(error)}`,
        processFail: (error) => `Order stream processing error: ${String(error)}`,
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
        subscribeFail: (error) => `Depth subscription failed: ${String(error)}`,
        processFail: (error) => `Depth stream processing error: ${String(error)}`,
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
        subscribeFail: (error) => `Ticker subscription failed: ${String(error)}`,
        processFail: (error) => `Price stream processing error: ${String(error)}`,
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
        subscribeFail: (error) => `Kline subscription failed: ${String(error)}`,
        processFail: (error) => `Kline stream processing error: ${String(error)}`,
      }
    );
  }

  /** Detect filled orders. */
  private detectFills(orders: AsterOrder[] | null | undefined): void {
    if (!Array.isArray(orders)) return;

    // Find fully or partially filled orders.
    for (const order of orders) {
      if (order.symbol !== this.config.symbol) continue;

      const orderId = String(order.orderId);
      const wasActive = this.lastOrderIds.has(orderId);
      const isFilled = order.status === "FILLED" || order.status === "PARTIALLY_FILLED";

      // If order was active before and now filled.
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

          // Update entry price.
          if ((order.side === "BUY" && !order.reduceOnly) ||
              (order.side === "SELL" && !order.reduceOnly)) {
            this.positionEntryPrice = avgPrice;
          }

          this.tradeLog.push(
            "order",
            `Fill detected: ${order.side} ${filledQty.toFixed(6)} @ ${avgPrice.toFixed(this.getPriceDecimals())}`
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

      // Ensure latest depth snapshot is used.
      const depth = this.depthSnapshot!;
      const { topBid, topAsk } = getTopPrices(depth);
      if (topBid == null || topAsk == null) {
        this.emitUpdate();
        return;
      }

      // Use more sensitive imbalance detection (2x threshold).
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

      // Re-read latest depth before pricing to keep quotes in sync.
      const latestDepth = this.depthSnapshot!;
      const { topBid: latestBid, topAsk: latestAsk } = getTopPrices(latestDepth);
      const finalBid = latestBid ?? topBid!;
      const finalAsk = latestAsk ?? topAsk!;

      // Use orderbook prices directly; stringify to avoid precision issues.
      const priceDecimals = this.getPriceDecimals();
      // Close prices always use best bid/ask.
      const closeBidPrice = formatPriceToString(finalBid, priceDecimals);
      const closeAskPrice = formatPriceToString(finalAsk, priceDecimals);

      // Entry prices use configured `entryDepthLevel`.
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
          // Cannot sell yet; skip sell and allow buy accumulation.
          this.lastSellPriceViable = false;
          if (!skipSellSide) {
            this.tradeLog.push("info", "Spot position is below minimum sell size, skipping sell quote");
          }
        }
        if (!skipBuySide && canEnter) {
          if (!allowSpotBuy) {
            if (this.lastBuyPriceViable) {
              this.tradeLog.push("info", "Spot buy is allowed only on 1m bullish candle, skipping buy");
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
                  ? "Insufficient spot quote balance, skipping buy"
                  : "Skipping buy: spread is too narrow to build maker price";
              this.tradeLog.push("info", reason);
            }
          }
        }
        if (!skipSellSide && canEnter) {
          const baseAvail = balancesForSpot?.baseAvailable ?? 0;
          const baseWallet = balancesForSpot?.baseWallet ?? baseAvail;
          const maxBase = Math.max(baseAvail, baseWallet);
          if (isSpotMarket && minSell > 0 && maxBase + EPS < minSell) {
            // Position below minimum sell size; skip sell and keep accumulating.
            if (this.lastSellPriceViable) {
              this.lastSellPriceViable = false;
              this.tradeLog.push("info", "Spot position is below minimum sell size, skipping sell");
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
                  ? "Insufficient spot base balance, skipping sell"
                  : "Skipping sell: spread is too narrow to build maker price";
              this.tradeLog.push("info", reason);
            }
          }
        }
      } else if (absPosition < EPS) {
        // No perpetual position.
        this.entryPricePendingLogged = false;
        if (!skipBuySide && canEnter) {
          if (isSpotMarket && !allowSpotBuy) {
            if (this.lastBuyPriceViable) {
              this.tradeLog.push("info", "Spot buy is allowed only on 1m bullish candle, skipping buy");
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
              this.tradeLog.push("info", "Spot position is below minimum sell size, skipping sell");
            }
          }
          if (askPrice != null) {
            desired.push({ side: "SELL", price: askPrice, amount: this.config.tradeAmount, reduceOnly: false });
          }
        }
      } else {
        // Position exists: use improved close logic.
        const closeSide: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";

        // Compute close price from fill/entry while avoiding loss.
        const closePrice = this.computeClosePrice(
          closeSide,
          position,
          finalBid,
          finalAsk,
          priceDecimals
        );

        if (isSpotMarket && minSell > 0 && rawAbsPosition + EPS < minSell) {
          // Position has not reached minimum sell size; wait and do not place order.
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
        this.tradeLog.push("error", `Liquidity-maker loop error: ${String(error)}`);
      }
      this.emitUpdate();
    } finally {
      this.rateLimit.onCycleComplete(hadRateLimit);
      this.processing = false;
    }
  }

  /**
   * Compute close price:
   * 1) If recent fill exists, offset from fill by configured ticks.
   * 2) Ensure non-loss close (long close >= entry, short close <= entry).
   * 3) Return null when no profitable/valid maker close price exists.
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

    // Build target from recent fill or entry, then apply closeTickOffset.
    if (this.lastFill && Date.now() - this.lastFill.timestamp < 60000) {
      // Recent fill within one minute: base on fill price.
      if (closeSide === "SELL") {
        targetPrice = this.lastFill.price + tickOffset;
      } else {
        targetPrice = this.lastFill.price - tickOffset;
      }
    } else if (entryPrice && Number.isFinite(entryPrice) && entryPrice > 0) {
      // No recent fill but has entry: base on entry price.
      if (closeSide === "SELL") {
        targetPrice = entryPrice + tickOffset;
      } else {
        targetPrice = entryPrice - tickOffset;
      }
    } else {
      // No fill and no entry: fallback to orderbook price.
      if (closeSide === "SELL") {
        targetPrice = topAsk;
      } else {
        targetPrice = topBid;
      }
    }

    // Ensure non-loss close (adjust only when target is worse than entry).
    if (entryPrice && Number.isFinite(entryPrice) && entryPrice > 0) {
      if (closeSide === "SELL") {
        // Long close: sell price must be >= entry.
        if (targetPrice < entryPrice) {
          targetPrice = entryPrice + this.priceTick;
          this.tradeLog.push("info", `Adjusted close price to entry+1tick to avoid loss: ${targetPrice.toFixed(priceDecimals)}`);
        }
      } else {
        // Short close: buy price must be <= entry.
        if (targetPrice > entryPrice) {
          targetPrice = entryPrice - this.priceTick;
          this.tradeLog.push("info", `Adjusted close price to entry-1tick to avoid loss: ${targetPrice.toFixed(priceDecimals)}`);
        }
      }
    }

    // Ensure the result is still a valid maker price.
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
        this.tradeLog.push("order", "Order already missing during rate-limit forced close");
      } else {
        this.tradeLog.push("error", `Rate-limit forced close failed: ${String(error)}`);
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
      this.tradeLog.push("order", "Startup: cleaned historical open orders");
      this.initialOrderResetDone = true;
      return true;
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "Historical orders already gone, skipping startup cleanup");
        this.initialOrderResetDone = true;
        this.openOrders = [];
        this.emitUpdate();
        return true;
      }
      this.tradeLog.push("error", `Startup cancel failed: ${String(error)}`);
      return false;
    }
  }

  /**
   * More sensitive imbalance logic: when one side exceeds the other by
   * `depthImbalanceRatio`, cancel orders on the thinner side.
   */
  private evaluateDepth(depth: AsterDepth): {
    buySum: number;
    sellSum: number;
    skipBuySide: boolean;
    skipSellSide: boolean;
    imbalance: "balanced" | "buy_dominant" | "sell_dominant";
  } {
    const levels = 10;
    const ratio = this.config.depthImbalanceRatio; // Configured threshold (default 2x).

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

    // Sensitive rule: if one side exceeds the other by 2x, skip thinner side.
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
   * Liquidity maker disables market-close on extreme depth imbalance.
   * It only uses `skipBuySide`/`skipSellSide` from `evaluateDepth`.
   */
  private async handleImbalanceExit(
    _position: PositionSnapshot,
    _buySum: number,
    _sellSum: number
  ): Promise<boolean> {
    // Liquidity maker does not do market-close on imbalance; always return false.
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
            `Cancelled mismatched order ${order.side} @ ${order.price} reduceOnly=${order.reduceOnly}`
          );
          // Keep previous behavior: do not mutate local openOrders until stream rebuilds.
        },
        () => {
          this.tradeLog.push("order", "Order already filled/cancelled during cancel, ignoring");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `Cancel order failed: ${String(error)}`);
          this.pendingCancelOrders.delete(String(order.orderId));
          // Remove failed local order to avoid repeated operations in same cycle.
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
          this.tradeLog.push("info", "Spot sell order is below minimum trade size, waiting to accumulate");
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
          target.price, // Price is already normalized as string.
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
          this.tradeLog.push("error", `Dust market close failed: ${String(dustError)}`);
        }
        if (dustClosed) continue;
        this.tradeLog.push("error", `Place order failed (${target.side} ${target.price}): ${String(error)}`);
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
          this.tradeLog.push("info", "Spot position is below minimum close size, skipping stop-loss check");
          this.lastSpotStopSkipped = true;
        }
        return;
      }
      this.lastSpotStopSkipped = false;
      const pnl = computePositionPnl(position, bidPrice, askPrice);
      const triggerStop = shouldStopLoss(position, bidPrice, askPrice, this.config.lossLimit);
      if (!triggerStop) return;
      this.tradeLog.push("stop", `Spot stop-loss triggered, position=${absPosition.toFixed(6)} PnL=${pnl.toFixed(4)} USDT`);
      try {
        // Best-effort cancel all pending orders to unlock balances before close.
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
          this.tradeLog.push("order", "Order already missing during stop-loss close");
        } else {
          this.tradeLog.push("error", `Spot stop-loss close failed: ${String(error)}`);
        }
      }
      return;
    }
    const absPosition = Math.abs(position.positionAmt);
    if (absPosition < EPS) return;

    const hasEntryPrice = Number.isFinite(position.entryPrice) && Math.abs(position.entryPrice) > 1e-8;
    if (!hasEntryPrice) {
      if (!this.entryPricePendingLogged) {
        this.tradeLog.push("info", "Maker position average entry not synced yet, waiting for account snapshot");
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
        `Stop-loss triggered, side=${position.positionAmt > 0 ? "LONG" : "SHORT"} current loss=${pnl.toFixed(4)} USDT`
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
          this.tradeLog.push("order", "Order already missing during stop-loss close");
        } else {
          this.tradeLog.push("error", `Stop-loss close failed: ${String(error)}`);
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
          // Keep previous behavior: no log and no local mutation on successful cancel.
        },
        () => {
          this.tradeLog.push("order", "Order no longer exists, skip cancel");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `Cancel order failed: ${String(error)}`);
          this.pendingCancelOrders.delete(String(order.orderId));
          // Keep consistent with sync-cancel path: remove bad local order and wait for stream rebuild.
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
            `Synced exchange precision: priceTick=${precision.priceTick} qtyStep=${precision.qtyStep}`
          );
        }
      })
      .catch((error) => {
        this.tradeLog.push("error", `Precision sync failed: ${String(error)}`);
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
        this.tradeLog.push("error", `Update callback handler error: ${String(error)}`);
      });
    } catch (err) {
      this.tradeLog.push("error", `Snapshot/update dispatch error: ${String(err)}`);
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
      this.tradeLog.push("order", `Using market close for dust position: ${target.side} qty ${absQty.toFixed(6)}`);
      return true;
    } catch (closeError) {
      if (isRateLimitError(closeError)) {
        throw closeError;
      }
      this.tradeLog.push("error", `Dust market close failed: ${String(closeError)}`);
      return false;
    }
  }
}
