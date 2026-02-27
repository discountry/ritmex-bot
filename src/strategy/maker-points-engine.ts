import type { MakerPointsConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
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
import { getPosition, parseSymbolParts, validateAccountSnapshotForSymbol } from "../utils/strategy";
import type { PositionSnapshot } from "../utils/strategy";
import { computePositionPnl, computeStopLossPnl } from "../utils/pnl";
import { getDepthBetweenPrices, getMidOrLast, getTopPrices } from "../utils/price";
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
  bandDepths: Array<{
    band: "0-10" | "10-30" | "30-100";
    bps: number;
    buyDepth: number | null;
    sellDepth: number | null;
    enabled: boolean;
  }>;
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
const STOP_LOSS_COOLDOWN_MS = 5_000;
const STOP_LOSS_CHECK_INTERVAL_MS = 250; // 止损检查最大间隔
const STOP_LOSS_RETRY_INTERVAL_MS = 500; // 止损失败后重试间隔
const DATA_STALE_THRESHOLD_MS = 5_000; // 数据过时阈值（5秒）
const DEFENSE_MODE_CHECK_INTERVAL_MS = 1000; // 防御模式检查间隔
const ACCOUNT_DATA_STALE_THRESHOLD_MS = 20_000; // 账户数据长期无更新阈值（会先尝试通过 REST 补拉验证，不直接进入防御模式）
const STANDX_REST_ERROR_DEFENSE_THRESHOLD = 3;
const STANDX_MARGIN_MODE_CHECK_INTERVAL_MS = 500;
const STANDX_MARGIN_MODE_MAX_ATTEMPTS = 10;
const ACCOUNT_STALE_REST_PROBE_MIN_INTERVAL_MS = 5_000;

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
  private forceTickRequested = false;
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
  // 跟踪各档位深度是否足够的状态 (按 bps 值索引)
  private lastDepthOkStatus: Record<number, { buy: boolean; sell: boolean }> = {};

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

  // 连接保护相关状态（用于断连/重连事件处理）
  private _standxConnectionState: "connected" | "disconnected" = "connected";
  private reconnectResetPending = false;
  private lastRepriceQueryTime = 0;
  private readonly repriceQueryIntervalMs = 3000; // 最小查询间隔

  // ========== 数据过时防御模式 ==========
  // 各数据源最后更新时间
  private lastStandxDepthTime = 0;
  private lastStandxAccountTime = 0;
  private lastBinanceDepthTime = 0;
  private accountStaleRestProbeInFlight: Promise<void> | null = null;
  private accountStaleRestProbeLastAttempt = 0;
  private accountStaleRestProbeConsecutiveFailures = 0;
  // 防御模式状态
  private defenseMode = false;
  private defenseModeNotified = false;
  private defenseModeTimer: ReturnType<typeof setInterval> | null = null;
  // 防御模式下的 REST 轮询定时器
  private defenseRestPollTimer: ReturnType<typeof setTimeout> | null = null;
  private defenseRestPollActive = false;
  private standxRestConsecutiveErrors = 0;
  private standxRestUnhealthy = false;
  private standxRestLastError: string | null = null;
  private marginModeEnsuring: Promise<boolean> | null = null;

  constructor(private readonly config: MakerPointsConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.refreshIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
    this.notifier = createTelegramNotifier();
    this.priceTick = Math.max(1e-9, this.config.priceTick);
    this.qtyStep = Math.max(1e-9, this.config.qtyStep);
    this.binanceDepth = new BinanceDepthTracker(resolveBinanceSymbol(this.config.symbol), {
      baseUrl: process.env.BINANCE_SPOT_WS_URL ?? process.env.BINANCE_WS_URL,
      restBaseUrl: process.env.BINANCE_REST_URL,
      levels: 20,
      ratio: Number.isFinite(this.config.binanceDepthImbalanceRatio)
        ? Math.max(1.01, Number(this.config.binanceDepthImbalanceRatio))
        : 9,
      depthWindowBps: Number.isFinite(this.config.binanceDepthWindowBps)
        ? Math.max(1, Number(this.config.binanceDepthWindowBps))
        : 3,
      speedMs: 100,
      logger: (context, error) => {
        this.tradeLog.push("warn", `Binance ${context} 异常: ${extractMessage(error)}`);
      },
    });
    this.binanceDepth.onUpdate(() => {
      this.feedStatus.binance = true;
      this.lastBinanceDepthTime = Date.now();
      this.emitUpdate();
    });
    // 监听 Binance 连接状态变化
    this.binanceDepth.onConnectionChange((state) => {
      if (state === "disconnected") {
        this.feedStatus.binance = false;
        this.tradeLog.push("warn", "Binance 深度连接断开");
      } else if (state === "stale") {
        this.feedStatus.binance = false;
        this.tradeLog.push("warn", "Binance 深度数据过时");
      } else if (state === "connected") {
        this.feedStatus.binance = true;
        this.tradeLog.push("info", "Binance 深度连接恢复");
      }
      this.emitUpdate();
    });
    this.syncPrecision();
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    // 初始化数据时间戳
    const now = Date.now();
    this.lastStandxDepthTime = now;
    this.lastStandxAccountTime = now;
    this.lastBinanceDepthTime = now;

    this.timer = setInterval(() => {
      void this.tick();
    }, this.config.refreshIntervalMs);
    if (!this.stopLossTimer) {
      this.stopLossTimer = setInterval(() => {
        void this.checkStopLoss();
      }, Math.min(STOP_LOSS_CHECK_INTERVAL_MS, this.config.refreshIntervalMs));
    }
    // 启动防御模式检测定时器
    if (!this.defenseModeTimer) {
      this.defenseModeTimer = setInterval(() => {
        this.checkDataStaleAndDefense();
      }, DEFENSE_MODE_CHECK_INTERVAL_MS);
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
    if (this.defenseModeTimer) {
      clearInterval(this.defenseModeTimer);
      this.defenseModeTimer = null;
    }
    this.stopDefenseRestPoll();
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
    this.setupRestHealthProtection();

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.applyAccountSnapshot(snapshot);
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
        this.lastStandxDepthTime = Date.now();
        this.feedStatus.depth = true;
        this.emitUpdate();
        if (this.shouldTriggerImmediateDepthProtection(depth) || this.shouldTriggerImmediateReprice(depth)) {
          this.forceTickRequested = true;
          void this.tick();
        }
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

  private applyAccountSnapshot(snapshot: AsterAccountSnapshot): void {
    this.accountSnapshot = snapshot;
    // StandX: WS 推送使用本地接收时间戳；REST 快照使用响应里的 time 字段映射到 snapshot.updateTime
    this.lastStandxAccountTime =
      this.exchange.id === "standx" && Number.isFinite(snapshot.updateTime) && snapshot.updateTime > 0
        ? snapshot.updateTime
        : Date.now();
    this.accountStaleRestProbeConsecutiveFailures = 0;
    const totalUnrealized = Number(snapshot.totalUnrealizedProfit ?? "0");
    if (Number.isFinite(totalUnrealized)) {
      this.accountUnrealized = totalUnrealized;
    }
    const position = getPosition(snapshot, this.config.symbol);
    this.sessionVolume.update(position, this.getReferencePrice());
    this.detectPositionChange(position);
    this.feedStatus.account = true;
    this.emitUpdate();
  }

  private maybeProbeStandxAccountSnapshot(now: number): void {
    if (this.exchange.id !== "standx") return;
    if (!this.exchange.queryAccountSnapshot) return;
    if (this.defenseMode) return;
    if (this.accountStaleRestProbeInFlight) return;
    if (this.accountStaleRestProbeLastAttempt > 0 && now - this.accountStaleRestProbeLastAttempt < ACCOUNT_STALE_REST_PROBE_MIN_INTERVAL_MS) {
      return;
    }
    this.accountStaleRestProbeLastAttempt = now;

    this.accountStaleRestProbeInFlight = (async () => {
      try {
        const next = await this.exchange.queryAccountSnapshot?.();
        if (next) {
          this.applyAccountSnapshot(next);
        } else {
          this.accountStaleRestProbeConsecutiveFailures += 1;
        }
      } catch {
        this.accountStaleRestProbeConsecutiveFailures += 1;
      } finally {
        this.accountStaleRestProbeInFlight = null;
      }
    })();
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

  private setupRestHealthProtection(): void {
    if (!this.exchange.onRestHealthEvent) return;
    this.exchange.onRestHealthEvent((state, info) => {
      if (state === "unhealthy") {
        this.standxRestUnhealthy = true;
        this.standxRestConsecutiveErrors = Math.max(this.standxRestConsecutiveErrors, info.consecutiveErrors);
        this.standxRestLastError = info.error ?? this.standxRestLastError;
        if (!this.defenseMode && this.standxRestConsecutiveErrors >= STANDX_REST_ERROR_DEFENSE_THRESHOLD) {
          this.enterDefenseMode({
            standxDepthStale: false,
            binanceStale: false,
            standxAccountStale: false,
            accountInvalid: false,
            standxRestUnhealthy: true,
            standxRestConsecutiveErrors: this.standxRestConsecutiveErrors,
            standxRestLastError: this.standxRestLastError,
            marginModeNotIsolated: false,
            marginMode: this.getStandxMarginMode(this.accountSnapshot),
            standxDepthAge: 0,
            binanceAge: 0,
            standxAccountAge: 0,
            accountIssues: [],
          });
        }
      } else if (state === "healthy") {
        this.standxRestUnhealthy = false;
        this.standxRestConsecutiveErrors = 0;
        this.standxRestLastError = null;
      }
    });
  }

  /**
   * 处理断连事件
   */
  private handleDisconnect(symbol: string): void {
    this._standxConnectionState = "disconnected";
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
    this._standxConnectionState = "connected";
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
    // 重连处理期间不执行主循环，避免状态竞争
    if (this.reconnectResetPending) return;
    // 止损执行期间不执行主循环，避免订单冲突
    if (this.stopLossProcessing) return;
    // 防御模式下不执行正常挂单逻辑
    if (this.defenseMode) return;
    this.processing = true;
    let hadRateLimit = false;
    try {
      const forceRun = this.forceTickRequested;
      this.forceTickRequested = false;
      const decision = forceRun ? "run" : this.rateLimit.beforeCycle();
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

      if (!(await this.ensureStandxIsolatedMarginMode())) {
        const current = this.getStandxMarginMode(this.accountSnapshot);
        this.enterDefenseMode({
          standxDepthStale: false,
          binanceStale: false,
          standxAccountStale: false,
          accountInvalid: false,
          standxRestUnhealthy: false,
          standxRestConsecutiveErrors: this.standxRestConsecutiveErrors,
          standxRestLastError: this.standxRestLastError,
          marginModeNotIsolated: true,
          marginMode: current,
          standxDepthAge: 0,
          binanceAge: 0,
          standxAccountAge: 0,
          accountIssues: [],
        });
        this.emitUpdate();
        return;
      }

      const accountHealth = validateAccountSnapshotForSymbol(this.accountSnapshot, this.config.symbol);
      if (!accountHealth.ok && !this.defenseMode) {
        this.enterDefenseMode({
          standxDepthStale: false,
          binanceStale: false,
          standxAccountStale: false,
          accountInvalid: true,
          standxRestUnhealthy: false,
          standxRestConsecutiveErrors: this.standxRestConsecutiveErrors,
          standxRestLastError: this.standxRestLastError,
          marginModeNotIsolated: false,
          marginMode: this.getStandxMarginMode(this.accountSnapshot),
          standxDepthAge: 0,
          binanceAge: 0,
          standxAccountAge: 0,
          accountIssues: accountHealth.issues,
        });
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
      const rawSkipBuy = this.config.enableBinanceDepthCancel && Boolean(binanceSnapshot?.skipBuySide);
      const rawSkipSell = this.config.enableBinanceDepthCancel && Boolean(binanceSnapshot?.skipSellSide);
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
      const depthStatusChanged = this.checkDepthStatusChanged(depth, topBid, topAsk);
      const shouldRecompute =
        closeOnly ||
        repriceNeeded ||
        closeOnlyChanged ||
        skipChanged ||
        depthStatusChanged ||
        this.desiredOrders.length === 0;

      const desired = shouldRecompute
        ? closeOnly
          ? this.buildCloseOnlyOrders(position, topBid, topAsk)
          : this.buildDesiredOrders({
              bid1: topBid,
              ask1: topAsk,
              skipBuy,
              skipSell,
              depth,
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
    depth: AsterDepth | null;
  }): DesiredOrder[] {
    const { bid1, ask1, skipBuy, skipSell, depth } = params;

    const targets = buildBpsTargets({
      band0To10: this.config.enableBand0To10,
      band10To30: this.config.enableBand10To30,
      band30To100: this.config.enableBand30To100,
    }).sort((a, b) => b - a);

    if (!targets.length) return [];

    const priceDecimals = this.getPriceDecimals();
    const desired: DesiredOrder[] = [];
    const minDepth = this.config.filterMinDepth;

    const getAmountForBps = (bps: number): number => {
      if (bps <= 10) return Number(this.config.band0To10Amount);
      if (bps <= 30) return Number(this.config.band10To30Amount);
      return Number(this.config.band30To100Amount);
    };

    for (const bps of targets) {
      const amount = getAmountForBps(bps);
      if (!Number.isFinite(amount) || amount <= 0) continue;

      // 所有档位都检查深度
      const shouldCheckDepth = minDepth > 0;

      if (!skipBuy) {
        const targetPrice = this.normalizeDepthTargetPrice(bid1 * (1 - bps / 10000), priceDecimals);
        if (targetPrice != null) {
          if (shouldCheckDepth) {
            const depthQty = getDepthBetweenPrices(depth, "BUY", targetPrice);
            if (depthQty < minDepth) {
              this.logThinDepthSkip("BUY", bps, depthQty, minDepth);
            } else {
              this.resetThinDepthSkip("BUY", bps);
              desired.push({
                side: "BUY",
                price: formatPriceToString(targetPrice, priceDecimals),
                amount,
                reduceOnly: false,
              });
            }
          } else {
            desired.push({
              side: "BUY",
              price: formatPriceToString(targetPrice, priceDecimals),
              amount,
              reduceOnly: false,
            });
          }
        }
      }
      if (!skipSell) {
        const targetPrice = this.normalizeDepthTargetPrice(ask1 * (1 + bps / 10000), priceDecimals);
        if (targetPrice != null) {
          if (shouldCheckDepth) {
            const depthQty = getDepthBetweenPrices(depth, "SELL", targetPrice);
            if (depthQty < minDepth) {
              this.logThinDepthSkip("SELL", bps, depthQty, minDepth);
            } else {
              this.resetThinDepthSkip("SELL", bps);
              desired.push({
                side: "SELL",
                price: formatPriceToString(targetPrice, priceDecimals),
                amount,
                reduceOnly: false,
              });
            }
          } else {
            desired.push({
              side: "SELL",
              price: formatPriceToString(targetPrice, priceDecimals),
              amount,
              reduceOnly: false,
            });
          }
        }
      }
    }

    return desired;
  }

  /**
   * 检查各档位的深度状态是否发生变化
   * 当深度从足够变为不足，或从不足变为足够时，需要触发重新计算
   */
  private checkDepthStatusChanged(
    depth: AsterDepth | null,
    bid1: number,
    ask1: number
  ): boolean {
    const minDepth = this.config.filterMinDepth;
    if (minDepth <= 0) return false;
    const priceDecimals = this.getPriceDecimals();

    // 获取启用的所有档位
    const targets = buildBpsTargets({
      band0To10: this.config.enableBand0To10,
      band10To30: this.config.enableBand10To30,
      band30To100: this.config.enableBand30To100,
    });

    let changed = false;

    for (const bps of targets) {
      const buyTargetPrice = this.normalizeDepthTargetPrice(bid1 * (1 - bps / 10000), priceDecimals);
      const sellTargetPrice = this.normalizeDepthTargetPrice(ask1 * (1 + bps / 10000), priceDecimals);

      const buyDepthQty = getDepthBetweenPrices(depth, "BUY", buyTargetPrice ?? 0);
      const sellDepthQty = getDepthBetweenPrices(depth, "SELL", sellTargetPrice ?? 0);
      const currentBuyOk = buyDepthQty >= minDepth;
      const currentSellOk = sellDepthQty >= minDepth;

      const lastStatus = this.lastDepthOkStatus[bps];
      if (lastStatus) {
        if (lastStatus.buy !== currentBuyOk || lastStatus.sell !== currentSellOk) {
          changed = true;
        }
      }

      this.lastDepthOkStatus[bps] = { buy: currentBuyOk, sell: currentSellOk };
    }

    return changed;
  }

  /**
   * 当深度从“满足阈值”切换到“不满足阈值”时，立即触发一次主循环，优先撤销不再安全的挂单。
   */
  private shouldTriggerImmediateDepthProtection(depth: AsterDepth | null): boolean {
    if (!depth) return false;
    if (this.defenseMode || this.reconnectResetPending || this.stopLossProcessing) return false;

    const minDepth = this.config.filterMinDepth;
    if (minDepth <= 0) return false;

    const { topBid, topAsk } = getTopPrices(depth);
    if (topBid == null || topAsk == null) return false;

    const targets = buildBpsTargets({
      band0To10: this.config.enableBand0To10,
      band10To30: this.config.enableBand10To30,
      band30To100: this.config.enableBand30To100,
    });
    const priceDecimals = this.getPriceDecimals();

    for (const bps of targets) {
      const lastStatus = this.lastDepthOkStatus[bps];
      if (!lastStatus) continue;

      const buyTargetPrice = this.normalizeDepthTargetPrice(topBid * (1 - bps / 10000), priceDecimals);
      const sellTargetPrice = this.normalizeDepthTargetPrice(topAsk * (1 + bps / 10000), priceDecimals);
      const buyDepthQty = getDepthBetweenPrices(depth, "BUY", buyTargetPrice ?? 0);
      const sellDepthQty = getDepthBetweenPrices(depth, "SELL", sellTargetPrice ?? 0);
      const currentBuyOk = buyDepthQty >= minDepth;
      const currentSellOk = sellDepthQty >= minDepth;

      if (lastStatus.buy && !currentBuyOk) return true;
      if (lastStatus.sell && !currentSellOk) return true;
    }

    return false;
  }

  /**
   * 当盘口相对上次报价偏移超过 minRepriceBps 时，立即触发一次主循环，优先撤销旧报价。
   */
  private shouldTriggerImmediateReprice(depth: AsterDepth | null): boolean {
    if (!depth) return false;
    if (this.defenseMode || this.reconnectResetPending || this.stopLossProcessing) return false;

    const hasActiveEntryOrders = this.openOrders.some(
      (order) => order.symbol === this.config.symbol && !order.reduceOnly && isOrderActiveStatus(order.status)
    );
    if (!hasActiveEntryOrders) return false;

    const { topBid, topAsk } = getTopPrices(depth);
    if (topBid == null || topAsk == null) return false;

    return this.shouldReprice(topBid, topAsk);
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
    // 止损执行期间不进行挂单操作，避免订单冲突
    if (this.stopLossProcessing) return;
    // 重连处理期间不进行挂单操作
    if (this.reconnectResetPending) return;

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

  /**
   * 使用实时深度数据计算仓位的未实现盈亏
   * 优先使用实时数据，回退到账户快照数据
   */
  private computeRealtimePnl(position: PositionSnapshot): number | null {
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    return computeStopLossPnl(position, topBid, topAsk);
  }

  private async checkStopLoss(): Promise<void> {
    if (this.stopLossProcessing) return;
    const lossLimit = Number(this.config.stopLossUsd);
    if (!Number.isFinite(lossLimit) || lossLimit <= 0) return;
    if (!this.accountSnapshot) return;

    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const absPosition = Math.abs(position.positionAmt);
    if (absPosition < EPS) return;

    // 使用实时计算的 PnL
    const realtimePnl = this.computeRealtimePnl(position);
    if (realtimePnl == null) return;

    const now = Date.now();
    if (now < this.stopLossCooldownUntil) return;
    if (realtimePnl > -lossLimit) return;

    this.stopLossProcessing = true;
    // 不在这里设置冷却期，只有成功平仓后才设置
    this.tradeLog.push(
      "stop",
      `触发止损: 实时未实现亏损 ${realtimePnl.toFixed(4)} USDT`
    );
    this.notify({
      type: "stop_loss",
      level: "error",
      symbol: this.config.symbol,
      title: "止损触发",
      message: `实时未实现亏损 ${realtimePnl.toFixed(4)} USDT，强制平仓`,
      details: {
        side: position.positionAmt > 0 ? "LONG" : "SHORT",
        size: absPosition,
        unrealizedPnl: realtimePnl,
        lossLimit: -lossLimit,
      },
    });

    // 循环重试止损，直到仓位为0
    await this.executeStopLossWithRetry(position.positionAmt > 0 ? "SELL" : "BUY");
  }

  /**
   * 执行止损平仓，失败后自动重试直到仓位为0
   */
  private async executeStopLossWithRetry(side: "BUY" | "SELL"): Promise<void> {
    const maxRetries = 10;
    let retryCount = 0;

    try {
      while (retryCount < maxRetries) {
        // 每次重试前重新检查仓位
        const currentPosition = getPosition(this.accountSnapshot, this.config.symbol);
        const currentAbsPosition = Math.abs(currentPosition.positionAmt);

        // 仓位已清零，止损成功
        if (currentAbsPosition < EPS) {
          this.tradeLog.push("stop", "止损成功: 仓位已清零");
          this.stopLossCooldownUntil = Date.now() + STOP_LOSS_COOLDOWN_MS;
          break;
        }

        try {
          // 强制解锁 MARKET 类型，确保不被之前的操作阻塞
          unlockOperating(this.locks, this.timers, this.pending, "MARKET");

          // 先取消所有挂单
          await this.flushOrders();

          // 执行市价平仓
          await marketClose(
            this.exchange,
            this.config.symbol,
            this.openOrders,
            this.locks,
            this.timers,
            this.pending,
            side,
            currentAbsPosition,
            (type, detail) => this.tradeLog.push(type, detail),
            undefined,
            { qtyStep: this.qtyStep }
          );

          // 等待一小段时间让账户数据更新
          await this.sleep(STOP_LOSS_RETRY_INTERVAL_MS);

        } catch (error) {
          retryCount++;
          if (isUnknownOrderError(error)) {
            this.tradeLog.push("order", "止损平仓时订单已不存在，继续检查仓位");
          } else if (isPrecisionError(error)) {
            this.tradeLog.push("warn", `止损平仓精度错误，重新同步: ${extractMessage(error)}`);
            this.syncPrecision(true);
          } else {
            this.tradeLog.push("error", `止损平仓失败 (重试 ${retryCount}/${maxRetries}): ${extractMessage(error)}`);
          }

          // 失败后等待一段时间再重试
          if (retryCount < maxRetries) {
            await this.sleep(STOP_LOSS_RETRY_INTERVAL_MS);
          }
        }
      }

      if (retryCount >= maxRetries) {
        this.tradeLog.push("error", `止损重试已达上限 (${maxRetries} 次)，请手动检查仓位`);
        // 达到重试上限后设置冷却期，避免持续重试
        this.stopLossCooldownUntil = Date.now() + STOP_LOSS_COOLDOWN_MS;
      }
    } finally {
      this.stopLossProcessing = false;
      this.emitUpdate();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  private normalizeDepthTargetPrice(price: number, priceDecimals: number): number | null {
    if (!Number.isFinite(price) || price <= 0) return null;
    const normalized = Number(formatPriceToString(price, priceDecimals));
    if (!Number.isFinite(normalized) || normalized <= 0) return null;
    return normalized;
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
    const bandDepths = this.computeBandDepths(topBid, topAsk);

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
      bandDepths,
      quoteStatus: {
        closeOnly: this.lastCloseOnly,
        skipBuy: this.lastSkipBuy,
        skipSell: this.lastSkipSell,
      },
    };
  }

  private computeBandDepths(topBid: number | null, topAsk: number | null): MakerPointsSnapshot["bandDepths"] {
    const bands: MakerPointsSnapshot["bandDepths"] = [
      { band: "0-10", bps: 9, buyDepth: null, sellDepth: null, enabled: this.config.enableBand0To10 },
      { band: "10-30", bps: 29, buyDepth: null, sellDepth: null, enabled: this.config.enableBand10To30 },
      { band: "30-100", bps: 99, buyDepth: null, sellDepth: null, enabled: this.config.enableBand30To100 },
    ];

    if (!this.depthSnapshot || topBid == null || topAsk == null) {
      return bands;
    }
    const priceDecimals = this.getPriceDecimals();

    return bands.map((band) => {
      const buyTargetPrice = this.normalizeDepthTargetPrice(topBid * (1 - band.bps / 10000), priceDecimals);
      const sellTargetPrice = this.normalizeDepthTargetPrice(topAsk * (1 + band.bps / 10000), priceDecimals);
      const buyDepth = getDepthBetweenPrices(this.depthSnapshot, "BUY", buyTargetPrice ?? 0);
      const sellDepth = getDepthBetweenPrices(this.depthSnapshot, "SELL", sellTargetPrice ?? 0);
      return { ...band, buyDepth, sellDepth };
    });
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

  // 跟踪各档位的深度跳过状态 (按 bps 和 side 索引)
  private thinDepthSkipStatus: Record<string, boolean> = {};

  /**
   * 记录因深度不足而跳过挂单的日志
   * 使用状态跟踪避免重复日志
   */
  private logThinDepthSkip(side: "BUY" | "SELL", bps: number, depthQty: number, minDepth: number): void {
    const key = `${side}_${bps}`;
    const alreadySkipped = this.thinDepthSkipStatus[key];

    if (!alreadySkipped) {
      this.tradeLog.push(
        "info",
        `跳过 ${side} ${bps}bps 挂单: 深度 ${depthQty.toFixed(4)} BTC < ${minDepth} BTC`
      );
      this.thinDepthSkipStatus[key] = true;
    }
  }

  /**
   * 当深度恢复时重置跳过状态，允许下次再次记录
   */
  private resetThinDepthSkip(side: "BUY" | "SELL", bps: number): void {
    const key = `${side}_${bps}`;
    if (this.thinDepthSkipStatus[key]) {
      this.tradeLog.push("info", `${side} ${bps}bps 深度恢复，继续挂单`);
      this.thinDepthSkipStatus[key] = false;
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

  private async handleTokenExpiry(position: PositionSnapshot, _absPosition: number): Promise<boolean> {
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

  // ========== 数据过时防御模式方法 ==========

  /**
   * 检查数据是否过时，进入或退出防御模式
   * StandX 账户数据在 WS 推送异常时会通过 REST 补拉；长期无更新通常意味着 WS/REST 均异常，应进入防御模式
   */
  private checkDataStaleAndDefense(): void {
    const now = Date.now();
    const standxDepthStale = this.lastStandxDepthTime > 0 && (now - this.lastStandxDepthTime) > DATA_STALE_THRESHOLD_MS;
    const binanceStale = this.lastBinanceDepthTime > 0 && (now - this.lastBinanceDepthTime) > DATA_STALE_THRESHOLD_MS;
    const binanceHealth = this.binanceDepth.getHealth();
    const binanceUnhealthy = !binanceHealth.healthy;

    const standxAccountAge = this.lastStandxAccountTime > 0 ? now - this.lastStandxAccountTime : 0;
    const standxAccountStaleByAge = this.lastStandxAccountTime > 0 && standxAccountAge > ACCOUNT_DATA_STALE_THRESHOLD_MS;
    if (standxAccountStaleByAge) {
      this.maybeProbeStandxAccountSnapshot(now);
    }
    const standxAccountStale =
      standxAccountStaleByAge &&
      // WS 推送间隔可能较长，先给 REST 补拉一次机会；只有补拉失败后才进入防御模式
      this.accountStaleRestProbeConsecutiveFailures > 0 &&
      this.accountStaleRestProbeInFlight == null;
    const accountHealth = validateAccountSnapshotForSymbol(this.accountSnapshot, this.config.symbol);
    const accountInvalid = this.accountSnapshot != null && !accountHealth.ok;
    const standxRestUnhealthy =
      this.standxRestUnhealthy && this.standxRestConsecutiveErrors >= STANDX_REST_ERROR_DEFENSE_THRESHOLD;
    const marginMode = this.getStandxMarginMode(this.accountSnapshot);
    const marginModeNotIsolated = this.exchange.id === "standx" && marginMode != null && marginMode !== "isolated";

    const shouldDefend =
      standxDepthStale ||
      binanceStale ||
      binanceUnhealthy ||
      standxAccountStale ||
      accountInvalid ||
      standxRestUnhealthy ||
      marginModeNotIsolated;

    if (shouldDefend && !this.defenseMode) {
      // 进入防御模式
      this.enterDefenseMode({
        standxDepthStale,
        binanceStale,
        standxAccountStale,
        accountInvalid,
        standxRestUnhealthy,
        standxRestConsecutiveErrors: this.standxRestConsecutiveErrors,
        standxRestLastError: this.standxRestLastError,
        marginModeNotIsolated,
        marginMode,
        binanceUnhealthy,
        binanceHealthReason: binanceHealth.reason,
        standxDepthAge: this.lastStandxDepthTime > 0 ? now - this.lastStandxDepthTime : 0,
        binanceAge: this.lastBinanceDepthTime > 0 ? now - this.lastBinanceDepthTime : 0,
        standxAccountAge,
        accountIssues: accountInvalid ? accountHealth.issues : [],
      });
    } else if (!shouldDefend && this.defenseMode) {
      // 退出防御模式
      this.exitDefenseMode();
    }
  }

  /**
   * 进入防御模式
   * 取消所有挂单，启动 REST 轮询保护仓位
   */
  private enterDefenseMode(staleInfo: {
    standxDepthStale: boolean;
    binanceStale: boolean;
    binanceUnhealthy?: boolean;
    binanceHealthReason?: string | null;
    standxAccountStale: boolean;
    accountInvalid: boolean;
    standxRestUnhealthy: boolean;
    standxRestConsecutiveErrors: number;
    standxRestLastError: string | null;
    marginModeNotIsolated: boolean;
    marginMode: string | null;
    standxDepthAge: number;
    binanceAge: number;
    standxAccountAge: number;
    accountIssues: string[];
  }): void {
    this.defenseMode = true;

    // 构建过时信息描述
    const staleItems: string[] = [];
    if (staleInfo.standxDepthStale) {
      staleItems.push(`StandX深度(${Math.round(staleInfo.standxDepthAge / 1000)}s)`);
    }
    if (staleInfo.standxAccountStale) {
      staleItems.push(`StandX账户(${Math.round(staleInfo.standxAccountAge / 1000)}s)`);
    }
    if (staleInfo.accountInvalid) {
      staleItems.push(`StandX仓位数据异常(${staleInfo.accountIssues.join(",") || "unknown"})`);
    }
    if (staleInfo.standxRestUnhealthy) {
      staleItems.push(`StandX REST错误(${staleInfo.standxRestConsecutiveErrors}次)`);
    }
    if (staleInfo.marginModeNotIsolated) {
      staleItems.push(`保证金模式(${staleInfo.marginMode ?? "unknown"})`);
    }
    if (staleInfo.binanceStale) {
      staleItems.push(`Binance深度(${Math.round(staleInfo.binanceAge / 1000)}s)`);
    }
    if (staleInfo.binanceUnhealthy && staleInfo.binanceHealthReason) {
      staleItems.push(`Binance簿记异常(${staleInfo.binanceHealthReason})`);
    }

    const staleSummary = staleItems.length > 0 ? staleItems.join(", ") : "unknown";

    this.tradeLog.push("warn", `数据过时检测: ${staleSummary}，进入防御模式`);

    // 发送通知
    if (!this.defenseModeNotified) {
      this.notify({
        type: "token_expired",
        level: "warn",
        symbol: this.config.symbol,
        title: "防御模式",
        message: `数据推送中断: ${staleSummary}，已取消所有挂单`,
        details: staleInfo,
      });
      this.defenseModeNotified = true;
    }

    // 立即取消所有挂单
    void this.defenseCancelAllOrders();

    // 启动 REST 轮询保护仓位
    this.startDefenseRestPoll();
  }

  /**
   * 退出防御模式
   */
  private exitDefenseMode(): void {
    this.defenseMode = false;
    this.defenseModeNotified = false;

    this.tradeLog.push("info", "数据推送恢复正常，退出防御模式");

    this.notify({
      type: "position_opened",
      level: "info",
      symbol: this.config.symbol,
      title: "防御模式解除",
      message: "数据推送恢复正常，恢复正常交易",
      details: {},
    });

    // 停止 REST 轮询
    this.stopDefenseRestPoll();

    // 重置本地状态，强制下一轮重新计算挂单
    this.desiredOrders = [];
    this.lastDesiredSummary = null;
    this.lastQuoteBid1 = null;
    this.lastQuoteAsk1 = null;
  }

  /**
   * 防御模式下取消所有挂单
   */
  private async defenseCancelAllOrders(): Promise<void> {
    try {
      if (this.exchange.forceCancelAllOrders) {
        const success = await this.exchange.forceCancelAllOrders();
        if (success) {
          this.tradeLog.push("order", "防御模式: 已强制取消所有挂单");
        } else {
          this.tradeLog.push("warn", "防御模式: 取消挂单未完全成功，将继续重试");
        }
      } else {
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        this.tradeLog.push("order", "防御模式: 已取消所有挂单");
      }

      // 重置本地挂单状态
      this.openOrders = [];
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "防御模式: 挂单已不存在");
        this.openOrders = [];
        this.pendingCancelOrders.clear();
      } else {
        this.tradeLog.push("error", `防御模式取消挂单失败: ${extractMessage(error)}`);
      }
    }
  }

  /**
   * 启动防御模式下的 REST 轮询
   * 使用 REST API 拉取数据，确保止损逻辑能正常工作
   */
  private startDefenseRestPoll(): void {
    if (this.defenseRestPollActive) return;
    this.defenseRestPollActive = true;

    this.tradeLog.push("info", "防御模式: 启动 REST 数据轮询");

    const poll = async () => {
      if (!this.defenseRestPollActive || !this.defenseMode) return;

      try {
        if (this.exchange.queryAccountSnapshot) {
          const nextAccount = await this.exchange.queryAccountSnapshot();
          if (nextAccount) {
            this.applyAccountSnapshot(nextAccount);
            const health = validateAccountSnapshotForSymbol(nextAccount, this.config.symbol);
            if (!health.ok) {
              this.tradeLog.push("warn", `防御模式: 仓位数据仍异常: ${health.issues.join(",")}`);
            }
          } else {
            this.tradeLog.push("warn", "防御模式: REST 获取账户快照为空");
          }
        }

        // 防御模式下也尝试修复保证金模式（StandX）
        if (this.exchange.id === "standx") {
          await this.ensureStandxIsolatedMarginMode();
        }

        // 防御模式下持续通过 REST 刷新挂单，并尽力撤销所有挂单（避免本地状态/WS 丢失导致遗留挂单）
        if (this.exchange.queryOpenOrders) {
          try {
            const realOrders = await this.exchange.queryOpenOrders();
            this.openOrders = Array.isArray(realOrders)
              ? realOrders.filter(
                  (order) =>
                    order.type !== "MARKET" &&
                    order.symbol === this.config.symbol &&
                    isOrderActiveStatus(order.status)
                )
              : [];
            this.pendingCancelOrders.clear();
            this.feedStatus.orders = true;

            if (realOrders.length > 0) {
              this.tradeLog.push("warn", `防御模式: 发现 ${realOrders.length} 个挂单，执行取消`);
              await this.defenseCancelAllOrders();
            }
          } catch (error) {
            this.tradeLog.push("error", `防御模式查询挂单失败: ${extractMessage(error)}`);
            // 查询失败时仍然尝试撤销所有挂单（宁可多撤，也不遗留）
            await this.defenseCancelAllOrders();
          }
        } else {
          await this.defenseCancelAllOrders();
        }

        // 检查止损条件（使用当前账户快照中的数据）
        // checkStopLoss 会继续运行，使用最后收到的数据进行止损判断
      } catch (error) {
        this.tradeLog.push("error", `防御模式 REST 轮询失败: ${extractMessage(error)}`);
      }

      // 继续下一次轮询
      if (this.defenseRestPollActive && this.defenseMode) {
        this.defenseRestPollTimer = setTimeout(() => void poll(), 2000);
      }
    };

    void poll();
  }

  private getStandxMarginMode(snapshot: AsterAccountSnapshot | null): string | null {
    if (this.exchange.id !== "standx") return null;
    const positions = snapshot?.positions ?? [];
    const match = positions.find((pos) => pos.symbol === this.config.symbol);
    const raw = (match as any)?.marginType ?? (match as any)?.margin_mode;
    const mode = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    return mode ? mode : null;
  }

  private async ensureStandxIsolatedMarginMode(): Promise<boolean> {
    if (this.exchange.id !== "standx") return true;
    const currentMode = this.getStandxMarginMode(this.accountSnapshot);
    if (currentMode === "isolated") return true;
    const change = this.exchange.changeMarginMode?.bind(this.exchange);
    const queryAccount = this.exchange.queryAccountSnapshot?.bind(this.exchange);
    if (!change || !queryAccount) return false;

    if (this.marginModeEnsuring) {
      return false;
    }

    this.marginModeEnsuring = (async () => {
      try {
        await change({ symbol: this.config.symbol, marginMode: "isolated" });
        for (let attempt = 0; attempt < STANDX_MARGIN_MODE_MAX_ATTEMPTS; attempt++) {
          const next = await queryAccount();
          if (next) {
            this.applyAccountSnapshot(next);
          }
          const mode = this.getStandxMarginMode(this.accountSnapshot);
          if (mode === "isolated") {
            this.tradeLog.push("info", "已切换为逐仓模式 (isolated)，恢复策略运行");
            return true;
          }
          await this.sleep(STANDX_MARGIN_MODE_CHECK_INTERVAL_MS);
        }
        this.tradeLog.push("warn", `逐仓模式切换未确认，当前模式: ${this.getStandxMarginMode(this.accountSnapshot) ?? "unknown"}`);
        return false;
      } catch (error) {
        this.tradeLog.push("error", `切换逐仓模式失败: ${extractMessage(error)}`);
        return false;
      } finally {
        this.marginModeEnsuring = null;
      }
    })();

    return await this.marginModeEnsuring;
  }

  /**
   * 停止防御模式下的 REST 轮询
   */
  private stopDefenseRestPoll(): void {
    if (!this.defenseRestPollActive) return;
    this.defenseRestPollActive = false;
    if (this.defenseRestPollTimer) {
      clearTimeout(this.defenseRestPollTimer);
      this.defenseRestPollTimer = null;
    }
    this.tradeLog.push("info", "防御模式: 停止 REST 数据轮询");
  }
}

function resolveBinanceSymbol(symbol: string): string {
  const parts = parseSymbolParts(symbol);
  const base = (parts.base ?? symbol).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return base ? `${base}USDT` : "BTCUSDT";
}
