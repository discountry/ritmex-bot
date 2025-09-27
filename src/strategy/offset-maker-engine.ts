import type { MakerConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
} from "../exchanges/types";
import { roundDownToTick } from "../utils/math";
import { createTradeLog } from "../logging/trade-log";
import { isUnknownOrderError, isRateLimitError } from "../utils/errors";
import { getPosition } from "../utils/strategy";
import type { PositionSnapshot } from "../utils/strategy";
import { computeDepthStats } from "../utils/depth";
import { computePositionPnl } from "../utils/pnl";
import { getTopPrices, getMidOrLast } from "../utils/price";
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
  price: number;
  amount: number;
  reduceOnly: boolean;
}

export interface OffsetMakerEngineSnapshot extends MakerEngineSnapshot {
  buyDepthSum10: number;
  sellDepthSum10: number;
  depthImbalance: "balanced" | "buy_dominant" | "sell_dominant";
  skipBuySide: boolean;
  skipSellSide: boolean;
}

type MakerEvent = "update";
type MakerListener = (snapshot: OffsetMakerEngineSnapshot) => void;

const EPS = 1e-5;

export class OffsetMakerEngine {
  private accountSnapshot: AsterAccountSnapshot | null = null;
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private openOrders: AsterOrder[] = [];

  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pending: OrderPendingMap = {};
  private readonly pendingCancelOrders = new Set<string>();

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<MakerEvent, OffsetMakerEngineSnapshot>();
  private readonly sessionVolume = new SessionVolumeTracker();

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

  constructor(private readonly config: MakerConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.refreshIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
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

  getSnapshot(): OffsetMakerEngineSnapshot {
    return this.buildSnapshot();
  }

  private bootstrap(): void {
    const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.accountSnapshot = snapshot;
        const totalUnrealized = Number(snapshot.totalUnrealizedProfit ?? "0");
        if (Number.isFinite(totalUnrealized)) {
          this.accountUnrealized = totalUnrealized;
        }
        const position = getPosition(snapshot, this.config.symbol);
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
        this.openOrders = Array.isArray(orders)
          ? orders.filter((order) => order.type !== "MARKET" && order.symbol === this.config.symbol)
          : [];
        const currentIds = new Set(this.openOrders.map((order) => String(order.orderId)));
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
      (_klines) => {
        /* no-op */
      },
      log,
      {
        subscribeFail: (error) => `订阅K线失败: ${String(error)}`,
        processFail: (error) => `K线推送处理异常: ${String(error)}`,
      }
    );
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

      const depth = this.depthSnapshot!;
      const { topBid, topAsk } = getTopPrices(depth);
      if (topBid == null || topAsk == null) {
        this.emitUpdate();
        return;
      }

      const { buySum, sellSum, skipBuySide, skipSellSide, imbalance } = this.evaluateDepth(depth);
      this.lastBuyDepthSum10 = buySum;
      this.lastSellDepthSum10 = sellSum;
      this.lastSkipBuy = skipBuySide;
      this.lastSkipSell = skipSellSide;
      this.lastImbalance = imbalance;

      const position = getPosition(this.accountSnapshot, this.config.symbol);
      const handledImbalance = await this.handleImbalanceExit(position, buySum, sellSum);
      if (handledImbalance) {
        this.emitUpdate();
        return;
      }

      const closeBidPrice = roundDownToTick(topBid!, this.config.priceTick);
      const closeAskPrice = roundDownToTick(topAsk!, this.config.priceTick);
      const bidPrice = roundDownToTick(topBid! - this.config.bidOffset, this.config.priceTick);
      const askPrice = roundDownToTick(topAsk! + this.config.askOffset, this.config.priceTick);
      const absPosition = Math.abs(position.positionAmt);
      const desired: DesiredOrder[] = [];
      const canEnter = !this.rateLimit.shouldBlockEntries();

      if (absPosition < EPS) {
        this.entryPricePendingLogged = false;
        if (!skipBuySide && canEnter) {
          desired.push({ side: "BUY", price: bidPrice, amount: this.config.tradeAmount, reduceOnly: false });
        }
        if (!skipSellSide && canEnter) {
          desired.push({ side: "SELL", price: askPrice, amount: this.config.tradeAmount, reduceOnly: false });
        }
      } else {
        const closeSide: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";
        const closePrice = closeSide === "SELL" ? closeAskPrice : closeBidPrice;
        desired.push({ side: closeSide, price: closePrice, amount: absPosition, reduceOnly: true });
      }

      this.desiredOrders = desired;
      this.sessionVolume.update(position, this.getReferencePrice());
      await this.syncOrders(desired);
      await this.checkRisk(position, closeBidPrice, closeAskPrice);
      this.emitUpdate();
    } catch (error) {
      if (isRateLimitError(error)) {
        hadRateLimit = true;
        this.rateLimit.registerRateLimit("offset-maker");
        await this.enforceRateLimitStop();
        this.tradeLog.push("warn", `OffsetMakerEngine 429: ${String(error)}`);
      } else {
        this.tradeLog.push("error", `偏移做市循环异常: ${String(error)}`);
      }
      this.emitUpdate();
    } finally {
      this.rateLimit.onCycleComplete(hadRateLimit);
      this.processing = false;
    }
  }

  private async enforceRateLimitStop(): Promise<void> {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    if (Math.abs(position.positionAmt) < EPS) return;
    await this.flushOrders();
    const absPosition = Math.abs(position.positionAmt);
    const side: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const closeBidPrice = topBid != null ? roundDownToTick(topBid, this.config.priceTick) : null;
    const closeAskPrice = topAsk != null ? roundDownToTick(topAsk, this.config.priceTick) : null;
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
        }
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

  private evaluateDepth(depth: AsterDepth): {
    buySum: number;
    sellSum: number;
    skipBuySide: boolean;
    skipSellSide: boolean;
    imbalance: "balanced" | "buy_dominant" | "sell_dominant";
  } {
    // Keep existing behavior: 10 levels, ratio threshold 3x
    return computeDepthStats(depth, 10, 3);
  }

  private async handleImbalanceExit(
    position: PositionSnapshot,
    buySum: number,
    sellSum: number
  ): Promise<boolean> {
    const absPosition = Math.abs(position.positionAmt);
    if (absPosition < EPS) return false;

    const longExitRequired = position.positionAmt > 0 && (buySum === 0 || buySum * 6 < sellSum);
    const shortExitRequired = position.positionAmt < 0 && (sellSum === 0 || sellSum * 6 < buySum);

    if (!longExitRequired && !shortExitRequired) return false;

    const side: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";
    const bid = Number(this.depthSnapshot?.bids?.[0]?.[0]);
    const ask = Number(this.depthSnapshot?.asks?.[0]?.[0]);
    const closeSidePrice = side === "SELL" ? bid : ask;
    this.tradeLog.push(
      "stop",
      `深度极端不平衡(${buySum.toFixed(4)} vs ${sellSum.toFixed(4)}), 市价平仓 ${side}`
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
        side,
        absPosition,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          expectedPrice: Number(closeSidePrice) || null,
          maxPct: this.config.maxCloseSlippagePct,
        }
      );
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "深度不平衡平仓时订单已不存在");
      } else {
        this.tradeLog.push("error", `深度不平衡平仓失败: ${String(error)}`);
      }
    }
    return true;
  }

  private async syncOrders(targets: DesiredOrder[]): Promise<void> {
    const tolerance = this.config.priceChaseThreshold;
    const availableOrders = this.openOrders.filter((o) => !this.pendingCancelOrders.has(String(o.orderId)));
    const { toCancel, toPlace } = makeOrderPlan(availableOrders, targets, tolerance);

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
      try {
        await placeOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pending,
          target.side,
          target.price,
          target.amount,
          (type, detail) => this.tradeLog.push(type, detail),
          target.reduceOnly,
          {
            markPrice: getPosition(this.accountSnapshot, this.config.symbol).markPrice,
            maxPct: this.config.maxCloseSlippagePct,
          }
        );
      } catch (error) {
        this.tradeLog.push("error", `挂单失败(${target.side} ${target.price}): ${String(error)}`);
      }
    }
  }

  private async checkRisk(position: PositionSnapshot, bidPrice: number, askPrice: number): Promise<void> {
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
          }
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

  private buildSnapshot(): OffsetMakerEngineSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const spread = topBid != null && topAsk != null ? topAsk - topBid : null;
    const pnl = computePositionPnl(position, topBid, topAsk);

    return {
      ready: this.isReady(),
      symbol: this.config.symbol,
      topBid: topBid,
      topAsk: topAsk,
      spread,
      position,
      pnl,
      accountUnrealized: this.accountUnrealized,
      sessionVolume: this.sessionVolume.value,
      openOrders: this.openOrders,
      desiredOrders: this.desiredOrders,
      tradeLog: this.tradeLog.all(),
      lastUpdated: Date.now(),
      buyDepthSum10: this.lastBuyDepthSum10,
      sellDepthSum10: this.lastSellDepthSum10,
      depthImbalance: this.lastImbalance,
      skipBuySide: this.lastSkipBuy,
      skipSellSide: this.lastSkipSell,
    };
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot);
  }
}
