import type { MakerPointsConfig } from "../config";
import type { ExchangeAdapter, ConnectionEventType } from "../exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterOrder,
  AsterTicker,
} from "../exchanges/types";
import { formatPriceToString } from "../utils/math";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { extractMessage, isInsufficientBalanceError, isPrecisionError, isRateLimitError, isUnknownOrderError } from "../utils/errors";
import { isOrderActiveStatus } from "../utils/order-status";
import { getPosition, parseSymbolParts } from "../utils/strategy";
import type { PositionSnapshot } from "../utils/strategy";
import { computePositionPnl } from "../utils/pnl";
import { getMidOrLast, getTopPrices } from "../utils/price";
import {
  marketClose,
  placeOrder,
  unlockOperating,
} from "../core/order-coordinator";
import type { OrderLockMap, OrderPendingMap, OrderTimerMap } from "../core/order-coordinator";
import { makeOrderPlan } from "../core/lib/order-plan";
import { safeCancelOrder } from "../core/lib/orders";
import { RateLimitController } from "../core/lib/rate-limit";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { SessionVolumeTracker } from "./common/session-volume";
import { HourlyStatsTracker } from "./common/hourly-stats";
import { BinanceDepthTracker, type BinanceDepthSnapshot } from "./common/binance-depth";
import { buildBpsTargets } from "./maker-points-logic";
import { t } from "../i18n";
import {
  checkStandxTokenExpiry,
  formatTokenExpiryMessage,
  isTokenExpiryConfigured,
  type TokenExpiryState,
} from "../utils/standx-token-expiry";
import {
  createTelegramNotifier,
  type NotificationSender,
  type TradeNotification,
} from "../notifications";

interface DesiredOrder {
  side: "BUY" | "SELL";
  price: string;
  amount: number;
  reduceOnly: boolean;
}

export interface MakerPointsSnapshot {
  ready: boolean;
  symbol: string;
  topBid: number | null;
  topAsk: number | null;
  spread: number | null;
  priceDecimals: number;
  position: PositionSnapshot;
  pnl: number;
  accountUnrealized: number;
  sessionVolume: number;
  openOrders: AsterOrder[];
  desiredOrders: DesiredOrder[];
  tradeLog: TradeLogEntry[];
  lastUpdated: number | null;
  feedStatus: {
    account: boolean;
    orders: boolean;
    depth: boolean;
    ticker: boolean;
    binance: boolean;
  };
  binanceDepth: BinanceDepthSnapshot | null;
  quoteStatus: {
    closeOnly: boolean;
    skipBuy: boolean;
    skipSell: boolean;
  };
}

type MakerPointsEvent = "update";
type MakerPointsListener = (snapshot: MakerPointsSnapshot) => void;

const EPS = 1e-5;
const INSUFFICIENT_BALANCE_COOLDOWN_MS = 15_000;
const STOP_LOSS_COOLDOWN_MS = 10_000;

export class MakerPointsEngine {
  private accountSnapshot: AsterAccountSnapshot | null = null;
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private openOrders: AsterOrder[] = [];

  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pending: OrderPendingMap = {};
  private readonly pendingCancelOrders = new Set<string>();

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<MakerPointsEvent, MakerPointsSnapshot>();
  private readonly sessionVolume = new SessionVolumeTracker();
  private readonly hourlyStats = new HourlyStatsTracker();
  private readonly rateLimit: RateLimitController;
  private readonly binanceDepth: BinanceDepthTracker;
  private readonly notifier: NotificationSender;

  private priceTick: number = 0.1;
  private qtyStep: number = 0.001;
  private precisionSync: Promise<void> | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;
  private stopLossTimer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private stopLossProcessing = false;
  private stopLossCooldownUntil = 0;
  private desiredOrders: DesiredOrder[] = [];
  private accountUnrealized = 0;
  private initialOrderSnapshotReady = false;
  private initialOrderResetDone = false;
  private lastDesiredSummary: string | null = null;
  private lastCloseOnly = false;
  private lastSkipBuy = false;
  private lastSkipSell = false;
  private lastQuoteBid1: number | null = null;
  private lastQuoteAsk1: number | null = null;

  private readinessLogged = {
    account: false,
    depth: false,
    ticker: false,
    orders: false,
  };
  private feedStatus = {
    account: false,
    depth: false,
    ticker: false,
    orders: false,
    binance: false,
  };
  private insufficientBalanceCooldownUntil = 0;
  private insufficientBalanceNotified = false;
  private lastInsufficientMessage: string | null = null;

  private tokenExpiryState: TokenExpiryState = "active";
  private tokenExpiryLogged = false;
  private tokenExpiryCancelDone = false;
  private tokenExpiredCloseOnlyMode = false;
  private tokenExpiryNotified = false;

  private lastPositionAmt = 0;
  private lastPositionSide: "LONG" | "SHORT" | "FLAT" = "FLAT";
  private lastWalletBalance: number | null = null;

  // 连接保护相关状态
  private connectionState: "connected" | "disconnected" = "connected";
  private reconnectResetPending = false;
  private lastRepriceQueryTime = 0;
  private readonly repriceQueryIntervalMs = 3000; // 最小查询间隔

  constructor(private readonly config: MakerPointsConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.refreshIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
    this.notifier = createTelegramNotifier();
    this.priceTick = Math.max(1e-9, this.config.priceTick);
    this.qtyStep = Math.max(1e-9, this.config.qtyStep);
    this.binanceDepth = new BinanceDepthTracker(resolveBinanceSymbol(this.config.symbol), {
      baseUrl: process.env.BINANCE_WS_URL,
      levels: 10,
      ratio: 3,
      logger: (context, error) => {
        this.tradeLog.push("warn", `Binance ${context} 异常: ${extractMessage(error)}`);
      },
    });
    this.binanceDepth.onUpdate(() => {
      this.feedStatus.binance = true;
      this.emitUpdate();
    });
    this.syncPrecision();
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.tick();
      void this.checkHourlyReport();
    }, this.config.refreshIntervalMs);
    if (!this.stopLossTimer) {
      this.stopLossTimer = setInterval(() => {
        void this.checkStopLoss();
      }, Math.max(500, this.config.refreshIntervalMs));
    }
    this.binanceDepth.start();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.stopLossTimer) {
      clearInterval(this.stopLossTimer);
      this.stopLossTimer = null;
    }
    this.binanceDepth.stop();
  }

  on(event: MakerPointsEvent, handler: MakerPointsListener): void {
    this.events.on(event, handler);
  }

  off(event: MakerPointsEvent, handler: MakerPointsListener): void {
    this.events.off(event, handler);
  }

  getSnapshot(): MakerPointsSnapshot {
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

        // 统计盈亏变动
        const currentWalletBalance = Number(snapshot.totalWalletBalance ?? 0);
        if (this.lastWalletBalance !== null && currentWalletBalance !== this.lastWalletBalance) {
          this.hourlyStats.addPnl(currentWalletBalance - this.lastWalletBalance);
        }
        this.lastWalletBalance = currentWalletBalance;

        const position = getPosition(snapshot, this.config.symbol);
        this.sessionVolume.update(position, this.getReferencePrice());
        this.detectPositionChange(position);
        this.feedStatus.account = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => t("log.subscribe.accountFail", { error: String(error) }),
        processFail: (error) => t("log.process.accountError", { error: String(error) }),
      }
    );

    safeSubscribe<AsterOrder[]>(
      this.exchange.watchOrders.bind(this.exchange),
      (orders) => {
        this.syncLocksWithOrders(orders);
        if (Array.isArray(orders)) {
          this.hourlyStats.updateOrders(orders);
        }
        this.openOrders = Array.isArray(orders)
          ? orders.filter(
              (order) =>
                order.type !== "MARKET" &&
                order.symbol === this.config.symbol &&
                isOrderActiveStatus(order.status)
            )
          : [];
        const currentIds = new Set(this.openOrders.map((order) => String(order.orderId)));
        for (const id of Array.from(this.pendingCancelOrders)) {
          if (!currentIds.has(id)) {
            this.pendingCancelOrders.delete(id);
          }
        }
        this.initialOrderSnapshotReady = true;
        this.feedStatus.orders = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => t("log.subscribe.orderFail", { error: String(error) }),
        processFail: (error) => t("log.process.orderError", { error: String(error) }),
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
        subscribeFail: (error) => t("log.subscribe.depthFail", { error: String(error) }),
        processFail: (error) => t("log.process.depthError", { error: String(error) }),
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
        subscribeFail: (error) => t("log.subscribe.tickerFail", { error: String(error) }),
        processFail: (error) => t("log.process.tickerError", { error: String(error) }),
      }
    );

    // 注册连接事件监听（如果交易所支持）
    this.setupConnectionProtection();
  }

  /**
   * 设置连接保护机制
   * 监听断连/重连事件，实现保护逻辑
   */
  private setupConnectionProtection(): void {
    if (!this.exchange.onConnectionEvent) return;

    this.exchange.onConnectionEvent((event, symbol) => {
      if (event === "disconnected") {
        this.handleDisconnect(symbol);
      } else if (event === "reconnected") {
        this.handleReconnect(symbol);
      }
    });
  }

  /**
   * 处理断连事件
   */
  private handleDisconnect(symbol: string): void {
    this.connectionState = "disconnected";
    this.tradeLog.push("warn", `WebSocket 断连 (${symbol})，启动断连保护`);
    this.notify({
      type: "token_expired",
      level: "warn",
      symbol: this.config.symbol,
      title: "连接断开",
      message: "WebSocket 断连，正在尝试取消所有挂单",
      details: { symbol },
    });
  }

  /**
   * 处理重连事件
   * 重连后需要重新查询挂单并取消所有挂单
   */
  private async handleReconnect(symbol: string): Promise<void> {
    this.connectionState = "connected";
    this.reconnectResetPending = true;
    this.tradeLog.push("info", `WebSocket 重连成功 (${symbol})，开始重连保护流程`);

    try {
      // 查询真实挂单状态
      if (this.exchange.queryOpenOrders) {
        const realOrders = await this.exchange.queryOpenOrders();
        this.tradeLog.push("info", `重连后查询到 ${realOrders.length} 个挂单`);

        if (realOrders.length > 0) {
          // 取消所有挂单
          if (this.exchange.forceCancelAllOrders) {
            const success = await this.exchange.forceCancelAllOrders();
            if (success) {
              this.tradeLog.push("order", "重连保护：已取消所有挂单");
            } else {
              this.tradeLog.push("warn", "重连保护：取消挂单未完全成功，将在下次循环重试");
            }
          } else {
            await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
            this.tradeLog.push("order", "重连保护：已取消所有挂单");
          }
        }
      }

      // 重置本地挂单状态
      this.openOrders = [];
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");

      // 重置 reprice 基准，强制下一次重新计算
      this.lastQuoteBid1 = null;
      this.lastQuoteAsk1 = null;
      this.desiredOrders = [];
      this.lastDesiredSummary = null;

      // 标记启动重置需要重新执行
      this.initialOrderResetDone = false;

      this.notify({
        type: "position_opened",
        level: "info",
        symbol: this.config.symbol,
        title: "重连完成",
        message: "WebSocket 重连成功，已清理挂单状态",
        details: { symbol },
      });
    } catch (error) {
      this.tradeLog.push("error", `重连保护流程失败: ${extractMessage(error)}`);
    } finally {
      this.reconnectResetPending = false;
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
    return Boolean(
      this.feedStatus.account &&
        this.feedStatus.depth &&
        this.feedStatus.ticker &&
        this.feedStatus.orders
    );
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
        this.logReadinessBlockers();
        this.emitUpdate();
        return;
      }
      this.resetReadinessFlags();
      if (!(await this.ensureStartupOrderReset())) {
        this.emitUpdate();
        return;
      }

      const position = getPosition(this.accountSnapshot, this.config.symbol);
      const absPosition = Math.abs(position.positionAmt);

      if (await this.handleTokenExpiry(position, absPosition)) {
        this.emitUpdate();
        return;
      }

      const depth = this.depthSnapshot!;
      const { topBid, topAsk } = getTopPrices(depth);
      if (topBid == null || topAsk == null) {
        this.emitUpdate();
        return;
      }

      const closeThreshold = Number(this.config.closeThreshold);
      const closeOnly =
        this.tokenExpiredCloseOnlyMode ||
        (Number.isFinite(closeThreshold) &&
        closeThreshold > 0 &&
        absPosition >= closeThreshold - EPS);
      const prevCloseOnly = this.lastCloseOnly;
      if (closeOnly !== prevCloseOnly) {
        this.tradeLog.push("info", closeOnly ? "进入平仓模式，仅挂 reduce-only" : "退出平仓模式");
        this.lastCloseOnly = closeOnly;
      }


      const binanceSnapshot = this.binanceDepth.getSnapshot();
      const rawSkipBuy = Boolean(binanceSnapshot?.skipBuySide);
      const rawSkipSell = Boolean(binanceSnapshot?.skipSellSide);
      const skipBuy = closeOnly ? false : rawSkipBuy;
      const skipSell = closeOnly ? false : rawSkipSell;
      const prevSkipBuy = this.lastSkipBuy;
      const prevSkipSell = this.lastSkipSell;
      if (skipBuy !== prevSkipBuy || skipSell !== prevSkipSell) {
        if (skipBuy || skipSell) {
          const summary = `${skipBuy ? "BUY" : ""}${skipBuy && skipSell ? "/" : ""}${skipSell ? "SELL" : ""}`;
          this.tradeLog.push("info", `Binance 深度失衡，暂停 ${summary} 挂单`);
        } else {
          this.tradeLog.push("info", "Binance 深度恢复，继续挂单");
        }
        this.lastSkipBuy = skipBuy;
        this.lastSkipSell = skipSell;
      }

      const closeOnlyChanged = closeOnly !== prevCloseOnly;
      const skipChanged = skipBuy !== prevSkipBuy || skipSell !== prevSkipSell;
      const repriceNeeded = closeOnly ? true : this.shouldReprice(topBid, topAsk);
      const shouldRecompute =
        closeOnly ||
        repriceNeeded ||
        closeOnlyChanged ||
        skipChanged ||
        this.desiredOrders.length === 0;

      const desired = shouldRecompute
        ? closeOnly
          ? this.buildCloseOnlyOrders(position, topBid, topAsk)
          : this.buildDesiredOrders({
              bid1: topBid,
              ask1: topAsk,
              skipBuy,
              skipSell,
            })
        : this.desiredOrders;

      if (shouldRecompute) {
        if (closeOnly) {
          this.lastQuoteBid1 = null;
          this.lastQuoteAsk1 = null;
        } else {
          this.lastQuoteBid1 = topBid;
          this.lastQuoteAsk1 = topAsk;
        }
      }

      this.desiredOrders = desired;
      this.logDesiredOrders(desired);
      this.sessionVolume.update(position, this.getReferencePrice());
      await this.syncOrders(desired, closeOnly);
      this.emitUpdate();
    } catch (error) {
      if (isRateLimitError(error)) {
        hadRateLimit = true;
        this.rateLimit.registerRateLimit("maker-points");
        this.tradeLog.push("warn", `限频触发，暂停挂单: ${extractMessage(error)}`);
      } else {
        this.tradeLog.push("error", `MakerPoints 主循环异常: ${extractMessage(error)}`);
      }
      this.emitUpdate();
    } finally {
      this.rateLimit.onCycleComplete(hadRateLimit);
      this.processing = false;
    }
  }

  private buildDesiredOrders(params: {
    bid1: number;
    ask1: number;
    skipBuy: boolean;
    skipSell: boolean;
  }): DesiredOrder[] {
    const { bid1, ask1, skipBuy, skipSell } = params;
    const amount = Number(this.config.perOrderAmount);
    if (!Number.isFinite(amount) || amount <= 0) return [];

    const targets = buildBpsTargets({
      band0To10: this.config.enableBand0To10,
      band10To30: this.config.enableBand10To30,
      band30To100: this.config.enableBand30To100,
    }).sort((a, b) => b - a);

    if (!targets.length) return [];

    const priceDecimals = this.getPriceDecimals();
    const desired: DesiredOrder[] = [];

    for (const bps of targets) {
      if (!skipBuy) {
        const price = bid1 * (1 - bps / 10000);
        if (Number.isFinite(price) && price > 0) {
          desired.push({
            side: "BUY",
            price: formatPriceToString(price, priceDecimals),
            amount,
            reduceOnly: false,
          });
        }
      }
      if (!skipSell) {
        const price = ask1 * (1 + bps / 10000);
        if (Number.isFinite(price) && price > 0) {
          desired.push({
            side: "SELL",
            price: formatPriceToString(price, priceDecimals),
            amount,
            reduceOnly: false,
          });
        }
      }
    }

    return desired;
  }

  private buildCloseOnlyOrders(
    position: PositionSnapshot,
    bid1: number,
    ask1: number
  ): DesiredOrder[] {
    const absPosition = Math.abs(position.positionAmt);
    if (absPosition < EPS) return [];
    const priceDecimals = this.getPriceDecimals();
    if (position.positionAmt > 0) {
      return [
        {
          side: "SELL",
          price: formatPriceToString(bid1, priceDecimals),
          amount: absPosition,
          reduceOnly: true,
        },
      ];
    }
    return [
      {
        side: "BUY",
        price: formatPriceToString(ask1, priceDecimals),
        amount: absPosition,
        reduceOnly: true,
      },
    ];
  }

  private shouldReprice(bid1: number, ask1: number): boolean {
    const threshold = Number(this.config.minRepriceBps);
    if (!Number.isFinite(threshold) || threshold <= 0) return true;
    if (!Number.isFinite(bid1) || !Number.isFinite(ask1)) return false;
    if (!Number.isFinite(this.lastQuoteBid1 ?? NaN) || !Number.isFinite(this.lastQuoteAsk1 ?? NaN)) {
      return true;
    }
    if ((this.lastQuoteBid1 ?? 0) <= 0 || (this.lastQuoteAsk1 ?? 0) <= 0) return true;
    const bidMove = Math.abs(bid1 - (this.lastQuoteBid1 ?? bid1)) / (this.lastQuoteBid1 ?? bid1) * 10000;
    const askMove = Math.abs(ask1 - (this.lastQuoteAsk1 ?? ask1)) / (this.lastQuoteAsk1 ?? ask1) * 10000;
    return bidMove >= threshold || askMove >= threshold;
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

  private async syncOrders(targets: DesiredOrder[], _closeOnly: boolean): Promise<void> {
    // 价格变化保护：如果需要 reprice 且距上次查询已过足够时间，先查询真实挂单
    const shouldVerifyOrders = await this.verifyOrdersIfNeeded();
    if (shouldVerifyOrders) {
      // 如果发现有未预期的挂单，先取消所有挂单
      return;
    }

    const availableOrders = this.openOrders.filter((o) => !this.pendingCancelOrders.has(String(o.orderId)));
    const openOrders = availableOrders.filter((order) => isOrderActiveStatus(order.status));
    const { toCancel, toPlace } = makeOrderPlan(openOrders, targets);

    for (const order of toCancel) {
      if (this.pendingCancelOrders.has(String(order.orderId))) continue;
      this.pendingCancelOrders.add(String(order.orderId));
      this.hourlyStats.recordCancel();
      await safeCancelOrder(
        this.exchange,
        this.config.symbol,
        order,
        () => {
          this.tradeLog.push(
            "order",
            `撤销不匹配订单 ${order.side} @ ${order.price} reduceOnly=${order.reduceOnly}`
          );
        },
        () => {
          this.tradeLog.push("order", "撤销时发现订单已被成交/取消，忽略");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `撤销订单失败: ${String(error)}`);
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        }
      );
    }

    const insufficientActive = this.applyInsufficientBalanceState(Date.now());
    if (this.rateLimit.shouldBlockEntries() || insufficientActive) {
      return;
    }

    for (const target of toPlace) {
      if (!target) continue;
      if (target.amount < EPS) continue;
      try {
        // reduce-only 订单不能设置 tp/sl，仅开仓单设置止损
        const priceNum = Number(target.price);
        const slPrice = target.reduceOnly
          ? undefined
          : target.side === "BUY"
            ? priceNum - 1
            : priceNum + 1;
        this.hourlyStats.recordPlace();
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
          undefined,
          {
            priceTick: this.priceTick,
            qtyStep: this.qtyStep,
            skipDedupe: true,
            slPrice,
          }
        );
      } catch (error) {
        if (isInsufficientBalanceError(error)) {
          this.registerInsufficientBalance(error);
          break;
        }
        if (isPrecisionError(error)) {
          this.tradeLog.push("warn", `检测到精度错误，重新同步: ${extractMessage(error)}`);
          this.syncPrecision(true);
        }
        this.tradeLog.push(
          "error",
          `挂单失败 ${target.side} @ ${target.price}: ${extractMessage(error)}`
        );
      }
    }
  }

  /**
   * 验证真实挂单状态，防止取消请求丢失
   * 在每次 reprice 时查询真实挂单，发现未预期的挂单时取消所有挂单
   * @returns true 表示发现问题并执行了取消操作，调用方应跳过本轮挂单
   */
  private lastReportedHour: number = new Date().getHours();
  private hourCounter: number = 0;

  private async checkHourlyReport(): Promise<void> {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour !== this.lastReportedHour) {
      this.hourCounter++;
      const interval = Number(process.env.MAKER_POINTS_REPORT_INTERVAL_HOURS) || 1;
      
      if (this.hourCounter < interval) {
        this.lastReportedHour = currentHour;
        return;
      }
      
      this.hourCounter = 0;
      const stats = this.hourlyStats.getSnapshot();
      const durationMin = Math.round((Date.now() - stats.startTime) / 60000);
      
      const message = [
        `📊 *STANDX 运行统计播报*`,
        ``,
        `🕒 时间段: ${new Date(stats.startTime).toLocaleTimeString()} - ${now.toLocaleTimeString()}`,
        `⏱ 持续时长: ${durationMin} 分钟`,
        ``,
        `📝 挂单次数: ${stats.placeCount}`,
        `🚫 撤单次数: ${stats.cancelCount}`,
        `✅ 成交次数: ${stats.fillCount}`,
        `💰 周期盈亏: ${stats.realizedPnl.toFixed(4)} USD`,
        ``,
        `📈 当前仓位: ${this.lastPositionAmt.toFixed(4)} ${this.config.symbol}`,
        `💵 账户余额: ${this.lastWalletBalance?.toFixed(2) ?? "0.00"} USD`
      ].join("\n");

      await this.notifier.send({
        type: "custom",
        level: "info",
        symbol: this.config.symbol,
        title: "每小时运行统计",
        message,
        timestamp: Date.now(),
      });

      this.tradeLog.push("info", `已发送每小时统计播报: 成交 ${stats.fillCount} 次`);
      this.hourlyStats.reset();
      this.lastReportedHour = currentHour;
    }
  }

  private async verifyOrdersIfNeeded(): Promise<boolean> {
    // 如果交易所不支持查询挂单，跳过验证
    if (!this.exchange.queryOpenOrders) return false;

    // 限制查询频率
    const now = Date.now();
    if (now - this.lastRepriceQueryTime < this.repriceQueryIntervalMs) {
      return false;
    }

    try {
      const realOrders = await this.exchange.queryOpenOrders();
      this.lastRepriceQueryTime = now;

      // 比较真实挂单与本地记录
      const realOrderIds = new Set(realOrders.map((o) => String(o.orderId)));
      const localOrderIds = new Set(this.openOrders.map((o) => String(o.orderId)));

      // 查找本地以为已取消但实际还存在的订单
      const unexpectedOrders = realOrders.filter((order) => {
        const orderId = String(order.orderId);
        // 如果本地没有这个订单，说明我们以为它已经被取消了
        if (!localOrderIds.has(orderId)) {
          return true;
        }
        // 如果本地记录这个订单在等待取消，但实际还存在
        if (this.pendingCancelOrders.has(orderId)) {
          return true;
        }
        return false;
      });

      if (unexpectedOrders.length > 0) {
        this.tradeLog.push(
          "warn",
          `发现 ${unexpectedOrders.length} 个未预期挂单，执行强制取消`
        );

        // 强制取消所有挂单
        if (this.exchange.forceCancelAllOrders) {
          await this.exchange.forceCancelAllOrders();
        } else {
          await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        }

        // 重置本地状态
        this.openOrders = [];
        this.pendingCancelOrders.clear();
        this.tradeLog.push("order", "已强制取消所有挂单，重置本地状态");
        return true;
      }

      // 更新本地挂单状态以匹配真实状态
      if (realOrders.length !== this.openOrders.length) {
        // 移除本地记录中不存在于服务器的订单
        this.openOrders = this.openOrders.filter((o) => realOrderIds.has(String(o.orderId)));
      }
    } catch (error) {
      this.tradeLog.push("error", `验证挂单状态失败: ${extractMessage(error)}`);
    }

    return false;
  }

  private async checkStopLoss(): Promise<void> {
    if (this.stopLossProcessing) return;
    const lossLimit = Number(this.config.stopLossUsd);
    if (!Number.isFinite(lossLimit) || lossLimit <= 0) return;
    if (!this.accountSnapshot) return;
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const absPosition = Math.abs(position.positionAmt);
    if (absPosition < EPS) return;
    if (!Number.isFinite(position.unrealizedProfit)) return;

    const now = Date.now();
    if (now < this.stopLossCooldownUntil) return;
    if (position.unrealizedProfit > -lossLimit) return;

    this.stopLossProcessing = true;
    this.stopLossCooldownUntil = now + STOP_LOSS_COOLDOWN_MS;
    this.tradeLog.push(
      "stop",
      `触发止损: 未实现亏损 ${position.unrealizedProfit.toFixed(4)} USDT`
    );
    this.notify({
      type: "stop_loss",
      level: "error",
      symbol: this.config.symbol,
      title: "止损触发",
      message: `未实现亏损 ${position.unrealizedProfit.toFixed(4)} USDT，强制平仓`,
      details: {
        side: position.positionAmt > 0 ? "LONG" : "SHORT",
        size: absPosition,
        unrealizedPnl: position.unrealizedProfit,
        lossLimit: -lossLimit,
      },
    });
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
        undefined,
        { qtyStep: this.qtyStep }
      );
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "止损平仓时订单已不存在");
      } else if (isPrecisionError(error)) {
        this.tradeLog.push("warn", `止损平仓精度错误，重新同步: ${extractMessage(error)}`);
        this.syncPrecision(true);
      } else {
        this.tradeLog.push("error", `止损平仓失败: ${extractMessage(error)}`);
      }
    } finally {
      this.stopLossProcessing = false;
      this.emitUpdate();
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
          // No log on successful cancel
        },
        () => {
          this.tradeLog.push("order", "撤销时发现订单已被成交/取消，忽略");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `撤销订单失败: ${String(error)}`);
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        }
      );
    }
  }

  private syncPrecision(force = false): void {
    if (this.precisionSync && !force) return;
    const getPrecision = this.exchange.getPrecision?.bind(this.exchange);
    if (!getPrecision) return;
    this.precisionSync = getPrecision()
      .then((precision) => {
        this.precisionSync = null;
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
        if (updated) {
          this.tradeLog.push(
            "info",
            t("log.common.precisionSynced", {
              priceTick: precision.priceTick,
              qtyStep: precision.qtyStep,
            })
          );
        }
      })
      .catch((error) => {
        this.tradeLog.push("error", t("log.common.precisionFailed", { error: extractMessage(error) }));
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
        this.tradeLog.push("error", `更新监听异常: ${String(error)}`);
      });
    } catch (err) {
      this.tradeLog.push("error", `快照生成异常: ${String(err)}`);
    }
  }

  private buildSnapshot(): MakerPointsSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const spread = topBid != null && topAsk != null ? topAsk - topBid : null;
    const pnl = computePositionPnl(position, topBid, topAsk);

    return {
      ready: this.isReady(),
      symbol: this.config.symbol,
      topBid,
      topAsk,
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
      binanceDepth: this.binanceDepth.getSnapshot(),
      quoteStatus: {
        closeOnly: this.lastCloseOnly,
        skipBuy: this.lastSkipBuy,
        skipSell: this.lastSkipSell,
      },
    };
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot);
  }

  private notify(notification: TradeNotification): void {
    this.notifier.send(notification);
  }

  private logReadinessBlockers(): void {
    if (!this.feedStatus.account && !this.readinessLogged.account) {
      this.tradeLog.push("info", t("log.maker.waitAccount"));
      this.readinessLogged.account = true;
    }
    if (!this.feedStatus.depth && !this.readinessLogged.depth) {
      this.tradeLog.push("info", t("log.maker.waitDepth"));
      this.readinessLogged.depth = true;
    }
    if (!this.feedStatus.ticker && !this.readinessLogged.ticker) {
      this.tradeLog.push("info", t("log.maker.waitTicker"));
      this.readinessLogged.ticker = true;
    }
    if (!this.feedStatus.orders && !this.readinessLogged.orders) {
      this.tradeLog.push("info", t("log.maker.waitOrders"));
      this.readinessLogged.orders = true;
    }
  }

  private resetReadinessFlags(): void {
    this.readinessLogged = {
      account: false,
      depth: false,
      ticker: false,
      orders: false,
    };
  }

  private logDesiredOrders(desired: DesiredOrder[]): void {
    if (!desired.length) {
      if (this.lastDesiredSummary !== "none") {
        this.tradeLog.push("info", "暂无目标挂单");
        this.lastDesiredSummary = "none";
      }
      return;
    }
    const summary = desired
      .map((order) => `${order.side}@${order.price}${order.reduceOnly ? "(RO)" : ""}`)
      .join(" | ");
    if (summary !== this.lastDesiredSummary) {
      this.tradeLog.push("info", `目标挂单: ${summary}`);
      this.lastDesiredSummary = summary;
    }
  }

  private registerInsufficientBalance(error: unknown): void {
    const now = Date.now();
    const detail = extractMessage(error);
    const alreadyActive = now < this.insufficientBalanceCooldownUntil;
    if (alreadyActive && detail === this.lastInsufficientMessage) {
      this.insufficientBalanceCooldownUntil = now + INSUFFICIENT_BALANCE_COOLDOWN_MS;
      return;
    }
    this.insufficientBalanceCooldownUntil = now + INSUFFICIENT_BALANCE_COOLDOWN_MS;
    this.lastInsufficientMessage = detail;
    const seconds = Math.ceil(INSUFFICIENT_BALANCE_COOLDOWN_MS / 1000);
    this.tradeLog.push("warn", `余额不足，暂停挂单 ${seconds}s: ${detail}`);
    this.insufficientBalanceNotified = true;
  }

  private applyInsufficientBalanceState(now: number): boolean {
    const active = now < this.insufficientBalanceCooldownUntil;
    if (!active && this.insufficientBalanceNotified) {
      this.tradeLog.push("info", "余额恢复，继续挂单");
      this.insufficientBalanceNotified = false;
      this.lastInsufficientMessage = null;
    }
    return active;
  }

  private detectPositionChange(position: PositionSnapshot): void {
    const currentAmt = position.positionAmt;
    const currentSide: "LONG" | "SHORT" | "FLAT" =
      currentAmt > EPS ? "LONG" : currentAmt < -EPS ? "SHORT" : "FLAT";
    const prevAmt = this.lastPositionAmt;
    const prevSide = this.lastPositionSide;

    if (Math.abs(currentAmt - prevAmt) < EPS && currentSide === prevSide) {
      return;
    }

    const absChange = Math.abs(currentAmt - prevAmt);
    const reference = this.getReferencePrice() ?? 0;

    if (prevSide === "FLAT" && currentSide !== "FLAT") {
      this.notify({
        type: "position_opened",
        level: "info",
        symbol: this.config.symbol,
        title: "开仓",
        message: `${currentSide === "LONG" ? "做多" : "做空"} ${Math.abs(currentAmt).toFixed(6)}`,
        details: {
          side: currentSide,
          size: Math.abs(currentAmt),
          price: reference > 0 ? reference : null,
        },
      });
    } else if (currentSide === "FLAT" && prevSide !== "FLAT") {
      const pnl = position.unrealizedProfit;
      const closeType = this.tokenExpiredCloseOnlyMode ? "Token过期平仓" : "平仓";
      this.notify({
        type: "position_closed",
        level: "success",
        symbol: this.config.symbol,
        title: closeType,
        message: `已平仓 ${Math.abs(prevAmt).toFixed(6)} (${prevSide === "LONG" ? "多" : "空"})`,
        details: {
          prevSide,
          closedSize: Math.abs(prevAmt),
          pnl: Number.isFinite(pnl) ? pnl : null,
        },
      });
    } else if (currentSide === prevSide && absChange > EPS) {
      const isIncrease = Math.abs(currentAmt) > Math.abs(prevAmt);
      if (isIncrease) {
        this.notify({
          type: "order_filled",
          level: "info",
          symbol: this.config.symbol,
          title: "加仓",
          message: `${currentSide === "LONG" ? "做多" : "做空"} +${absChange.toFixed(6)} → ${Math.abs(currentAmt).toFixed(6)}`,
          details: {
            side: currentSide,
            added: absChange,
            totalSize: Math.abs(currentAmt),
          },
        });
      } else {
        this.notify({
          type: "order_filled",
          level: "info",
          symbol: this.config.symbol,
          title: "减仓",
          message: `${currentSide === "LONG" ? "多" : "空"} -${absChange.toFixed(6)} → ${Math.abs(currentAmt).toFixed(6)}`,
          details: {
            side: currentSide,
            reduced: absChange,
            totalSize: Math.abs(currentAmt),
          },
        });
      }
    } else if (currentSide !== prevSide && currentSide !== "FLAT" && prevSide !== "FLAT") {
      this.notify({
        type: "position_opened",
        level: "info",
        symbol: this.config.symbol,
        title: "反向开仓",
        message: `${prevSide === "LONG" ? "多→空" : "空→多"} ${Math.abs(currentAmt).toFixed(6)}`,
        details: {
          prevSide,
          newSide: currentSide,
          size: Math.abs(currentAmt),
        },
      });
    }

    this.lastPositionAmt = currentAmt;
    this.lastPositionSide = currentSide;
  }

  private async handleTokenExpiry(position: PositionSnapshot, absPosition: number): Promise<boolean> {
    if (!isTokenExpiryConfigured()) {
      return false;
    }

    const expiryStatus = checkStandxTokenExpiry({
      positionAmt: position.positionAmt,
      openOrderCount: this.openOrders.length,
    });

    if (!expiryStatus.expired) {
      if (this.tokenExpiryState !== "active") {
        this.tokenExpiryState = "active";
        this.tokenExpiryLogged = false;
        this.tokenExpiryCancelDone = false;
        this.tokenExpiredCloseOnlyMode = false;
        this.tokenExpiryNotified = false;
      }
      return false;
    }

    const prevState = this.tokenExpiryState;
    this.tokenExpiryState = expiryStatus.state;

    if (!this.tokenExpiryLogged) {
      const message = formatTokenExpiryMessage(expiryStatus);
      if (message) {
        this.tradeLog.push("warn", message);
      }
      this.tokenExpiryLogged = true;
    }

    if (!this.tokenExpiryNotified) {
      this.notify({
        type: "token_expired",
        level: "warn",
        symbol: this.config.symbol,
        title: "Token 已过期",
        message: expiryStatus.hasPosition
          ? "Token 已过期，进入平仓模式，不再开新仓"
          : "Token 已过期，策略进入静默模式",
        details: {
          hasPosition: expiryStatus.hasPosition,
          hasOpenOrders: expiryStatus.hasOpenOrders,
          state: expiryStatus.state,
        },
      });
      this.tokenExpiryNotified = true;
    }

    if (!this.tokenExpiryCancelDone && this.openOrders.length > 0) {
      try {
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        this.tradeLog.push("order", "Token 过期，已撤销所有挂单");
        this.openOrders = [];
        this.tokenExpiryCancelDone = true;
      } catch (error) {
        if (isUnknownOrderError(error)) {
          this.tradeLog.push("order", "Token 过期撤单时订单已不存在");
          this.tokenExpiryCancelDone = true;
        } else {
          this.tradeLog.push("error", `Token 过期撤单失败: ${extractMessage(error)}`);
        }
      }
    }

    if (expiryStatus.state === "expired_with_position") {
      if (!this.tokenExpiredCloseOnlyMode) {
        this.tokenExpiredCloseOnlyMode = true;
        this.tradeLog.push("info", "Token 过期，强制进入平仓模式，仅允许 reduce-only 订单");
      }
      return false;
    }

    if (expiryStatus.state === "silent") {
      if (prevState !== "silent") {
        this.tradeLog.push("info", "进入静默数据接收模式，不再进行任何交易操作");
      }
      return true;
    }

    return true;
  }
}

function resolveBinanceSymbol(symbol: string): string {
  const parts = parseSymbolParts(symbol);
  const base = (parts.base ?? symbol).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return base ? `${base}USDT` : "BTCUSDT";
}
