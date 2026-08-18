import type { MakerPointsConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type {
  AccountSnapshot,
  Depth,
  Order,
  Ticker,
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
import type { OrderContext, OrderLockMap, OrderPendingMap, OrderTimerMap } from "../core/order-coordinator";
import { makeOrderPlan } from "../core/lib/order-plan";
import { safeCancelOrder } from "../core/lib/orders";
import { RateLimitController } from "../core/lib/rate-limit";
import { StrategyEventEmitter } from "./common/event-emitter";
import {
  REST_ERROR_DEFENSE_THRESHOLD as STANDX_REST_ERROR_DEFENSE_THRESHOLD,
  defenseReasonsFor,
  describeDefenseReasons,
  evaluateDefense,
  type DefenseReasons,
} from "./maker-points-defense";
import { createPrecisionSyncer, type PrecisionSyncer } from "./common/precision-syncer";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { SessionVolumeTracker } from "./common/session-volume";
import { BinanceDepthTracker, type BinanceDepthSnapshot } from "./common/binance-depth";
import {
  bandRepriceToleranceBps,
  buildBandTargets,
  makerPointsMultiplier,
  resolveSafeQuotePrice,
  shouldKeepQuote,
  signedDistanceBps,
  type BandTarget,
  type MakerPointsBand,
} from "./maker-points-logic";
import { t } from "../i18n";
import { IsolatedMarginGuard } from "./common/isolated-margin-guard";
import { TokenExpiryGuard } from "./common/token-expiry-guard";
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

export interface BandStatus {
  band: MakerPointsBand;
  /** 该档位配置的目标距离（bps，距 mark price）。 */
  bps: number;
  enabled: boolean;
  /** 盘口一档到目标价之间的挂单量，用于判断被吃穿的风险。 */
  buyDepth: number | null;
  sellDepth: number | null;
  /** 实际在场挂单距 mark 的距离；无挂单时为 null。 */
  buyDistanceBps: number | null;
  sellDistanceBps: number | null;
  /** 上述实际距离对应的 Maker Points 倍率。 */
  buyMultiplier: number | null;
  sellMultiplier: number | null;
}

export interface MakerPointsSnapshot {
  ready: boolean;
  symbol: string;
  topBid: number | null;
  topAsk: number | null;
  markPrice: number | null;
  spread: number | null;
  priceDecimals: number;
  position: PositionSnapshot;
  pnl: number;
  accountUnrealized: number;
  sessionVolume: number;
  openOrders: Order[];
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
  /** 配置的最大挂单距离（bps），用于仪表盘提示与 100bps 悬崖的安全边际。 */
  maxDistanceBps: number;
  bandDepths: BandStatus[];
  /** 每个在场挂单已在盘口停留的毫秒数；Maker Points 要求超过 3 秒才计分。 */
  orderRestingMs: Record<string, number>;
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
const DEFENSE_MODE_CHECK_INTERVAL_MS = 1000; // 防御模式检查间隔
const ACCOUNT_STALE_REST_PROBE_MIN_INTERVAL_MS = 5_000;

export class MakerPointsEngine {
  private accountSnapshot: AccountSnapshot | null = null;
  private depthSnapshot: Depth | null = null;
  private tickerSnapshot: Ticker | null = null;
  private openOrders: Order[] = [];

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

  private readonly precision: PrecisionSyncer;

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
  // 跟踪各档位深度是否足够的状态 (按 bps 值索引)
  private lastDepthOkStatus: Record<number, { buy: boolean; sell: boolean }> = {};
  /** 最近一轮实际下发的报价距 mark 的距离，用于仪表盘展示倍率。 */
  private lastQuoteDistanceBps: Partial<Record<MakerPointsBand, { buy: number | null; sell: number | null }>> = {};

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

  private readonly tokenExpiry: TokenExpiryGuard;

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
  private readonly marginGuard: IsolatedMarginGuard;

  constructor(private readonly config: MakerPointsConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.refreshIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
    this.notifier = createTelegramNotifier();
    this.precision = createPrecisionSyncer(this.exchange, this.config, this.config.qtyStep, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
    this.marginGuard = new IsolatedMarginGuard({
      symbol: this.config.symbol,
      enabled: this.exchange.id === "standx",
      log: (type, detail) => this.tradeLog.push(type, detail),
      currentSnapshot: () => this.accountSnapshot,
      changeMarginMode: this.exchange.changeMarginMode?.bind(this.exchange),
      queryAccountSnapshot: this.exchange.queryAccountSnapshot?.bind(this.exchange),
      applySnapshot: (snapshot) => this.applyAccountSnapshot(snapshot),
      sleep: (ms) => this.sleep(ms),
    });
    this.tokenExpiry = new TokenExpiryGuard({
      log: (type, detail) => this.tradeLog.push(type, detail),
      notify: ({ hasPosition, hasOpenOrders, state }) =>
        this.notify({
          type: "token_expired",
          level: "warn",
          symbol: this.config.symbol,
          title: t("notify.token.title"),
          message: hasPosition ? t("notify.token.closeOnly") : t("notify.token.silent"),
          details: { hasPosition, hasOpenOrders, state },
        }),
      cancelAllOrders: () => this.exchange.cancelAllOrders({ symbol: this.config.symbol }),
      onOrdersCancelled: () => {
        this.openOrders = [];
      },
    });
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
        this.tradeLog.push("warn", t("log.mp.binanceError", { context, error: extractMessage(error) }));
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
        this.tradeLog.push("warn", t("log.mp.binanceDisconnected"));
      } else if (state === "stale") {
        this.feedStatus.binance = false;
        this.tradeLog.push("warn", t("log.mp.binanceStale"));
      } else if (state === "connected") {
        this.feedStatus.binance = true;
        this.tradeLog.push("info", t("log.mp.binanceRecovered"));
      }
      this.emitUpdate();
    });
    this.precision.start();
    this.bootstrap();
  }

  /** Bundles the fixed order-routing state; rebuilt lazily on first use. */
  private get orderContext(): OrderContext {
    return (this.orderContextCache ??= {
      adapter: this.exchange,
      symbol: this.config.symbol,
      locks: this.locks,
      timers: this.timers,
      pendings: this.pending,
      log: (type, detail) => this.tradeLog.push(type, detail),
    });
  }
  private orderContextCache: OrderContext | null = null;

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
    this.precision.stop();
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

    safeSubscribe<AccountSnapshot>(
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

    safeSubscribe<Order[]>(
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

    safeSubscribe<Depth>(
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

    safeSubscribe<Ticker>(
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

  private applyAccountSnapshot(snapshot: AccountSnapshot): void {
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
          this.enterDefenseMode(
            defenseReasonsFor({
              restUnhealthy: true,
              restConsecutiveErrors: this.standxRestConsecutiveErrors,
              restLastError: this.standxRestLastError,
              marginMode: this.marginGuard.currentMode(),
            })
          );
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
    this.tradeLog.push("warn", t("log.mp.wsDisconnected", { symbol }));
    this.notify({
      type: "token_expired",
      level: "warn",
      symbol: this.config.symbol,
      title: t("notify.mp.disconnectTitle"),
      message: t("notify.mp.disconnectBody"),
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
    this.tradeLog.push("info", t("log.mp.wsReconnected", { symbol }));

    try {
      // 查询真实挂单状态
      if (this.exchange.queryOpenOrders) {
        const realOrders = await this.exchange.queryOpenOrders();
        this.tradeLog.push("info", t("log.mp.reconnectFoundOrders", { count: realOrders.length }));

        if (realOrders.length > 0) {
          // 取消所有挂单
          if (this.exchange.forceCancelAllOrders) {
            const success = await this.exchange.forceCancelAllOrders();
            if (success) {
              this.tradeLog.push("order", t("log.mp.reconnectCancelled"));
            } else {
              this.tradeLog.push("warn", t("log.mp.reconnectCancelPartial"));
            }
          } else {
            await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
            this.tradeLog.push("order", t("log.mp.reconnectCancelled"));
          }
        }
      }

      // 重置本地挂单状态
      this.openOrders = [];
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");

      // 重置 reprice 基准，强制下一次重新计算
      this.lastQuoteDistanceBps = {};
      this.desiredOrders = [];
      this.lastDesiredSummary = null;

      // 标记启动重置需要重新执行
      this.initialOrderResetDone = false;

      this.notify({
        type: "position_opened",
        level: "info",
        symbol: this.config.symbol,
        title: t("notify.mp.reconnectTitle"),
        message: t("notify.mp.reconnectBody"),
        details: { symbol },
      });
    } catch (error) {
      this.tradeLog.push("error", t("log.mp.reconnectFailed", { error: extractMessage(error) }));
    } finally {
      this.reconnectResetPending = false;
    }
  }

  private syncLocksWithOrders(orders: Order[] | null | undefined): void {
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

      if (!(await this.marginGuard.ensureIsolated())) {
        const current = this.marginGuard.currentMode();
        this.enterDefenseMode(
          defenseReasonsFor({
            marginModeNotIsolated: true,
            marginMode: current,
            restConsecutiveErrors: this.standxRestConsecutiveErrors,
            restLastError: this.standxRestLastError,
          })
        );
        this.emitUpdate();
        return;
      }

      const accountHealth = validateAccountSnapshotForSymbol(this.accountSnapshot, this.config.symbol);
      if (!accountHealth.ok && !this.defenseMode) {
        this.enterDefenseMode(
          defenseReasonsFor({
            accountInvalid: true,
            accountIssues: accountHealth.issues,
            restConsecutiveErrors: this.standxRestConsecutiveErrors,
            restLastError: this.standxRestLastError,
            marginMode: this.marginGuard.currentMode(),
          })
        );
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

      const expiry = await this.tokenExpiry.evaluate({
        positionAmt: position.positionAmt,
        openOrderCount: this.openOrders.length,
      });
      if (expiry.halt) {
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
        expiry.closeOnly ||
        (Number.isFinite(closeThreshold) &&
        closeThreshold > 0 &&
        absPosition >= closeThreshold - EPS);
      const prevCloseOnly = this.lastCloseOnly;
      if (closeOnly !== prevCloseOnly) {
        this.tradeLog.push("info", closeOnly ? t("log.mp.closeOnlyEntered") : t("log.mp.closeOnlyExited"));
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
          this.tradeLog.push("info", t("log.mp.depthImbalancePause", { summary }));
        } else {
          this.tradeLog.push("info", t("log.mp.depthImbalanceResume"));
        }
        this.lastSkipBuy = skipBuy;
        this.lastSkipSell = skipSell;
      }

      // 每轮都重算：报价是否真的变动由各档位的 sticky 判定决定，
      // 价格没漂出档位容差时会复用现有挂单价，makeOrderPlan 也就不会撤单。
      const desired = closeOnly
        ? this.buildCloseOnlyOrders(position, topBid, topAsk)
        : this.buildDesiredOrders({
            bid1: topBid,
            ask1: topAsk,
            anchor: this.getQuoteAnchor(depth),
            skipBuy,
            skipSell,
            depth,
          });

      this.desiredOrders = desired;
      this.logDesiredOrders(desired);
      this.sessionVolume.update(position, this.getReferencePrice());
      await this.syncOrders(desired, closeOnly);
      this.emitUpdate();
    } catch (error) {
      if (isRateLimitError(error)) {
        hadRateLimit = true;
        this.rateLimit.registerRateLimit("maker-points");
        this.tradeLog.push("warn", t("log.mp.rateLimited", { error: extractMessage(error) }));
      } else {
        this.tradeLog.push("error", t("log.mp.tickFailed", { error: extractMessage(error) }));
      }
      this.emitUpdate();
    } finally {
      this.rateLimit.onCycleComplete(hadRateLimit);
      this.processing = false;
    }
  }

  /** 当前启用的档位及其目标距离，按距离升序。 */
  private bandTargets(): BandTarget[] {
    return buildBandTargets({
      band0To10: this.config.enableBand0To10,
      band10To30: this.config.enableBand10To30,
      band30To100: this.config.enableBand30To100,
      band0To10Bps: this.config.band0To10Bps,
      band10To30Bps: this.config.band10To30Bps,
      band30To100Bps: this.config.band30To100Bps,
    });
  }

  private amountForBand(band: MakerPointsBand): number {
    if (band === "0-10") return Number(this.config.band0To10Amount);
    if (band === "10-30") return Number(this.config.band10To30Amount);
    return Number(this.config.band30To100Amount);
  }

  private toleranceFor(targetBps: number): number {
    return bandRepriceToleranceBps(targetBps, this.config.minRepriceBps, this.config.bandRepriceRatio);
  }

  /**
   * 距离计算的基准价：活动按 mark price 计分，所以优先用交易所 mark price，
   * 拿不到时退回盘口中值。
   */
  private getQuoteAnchor(depth: Depth | null): number | null {
    const mark = Number(this.tickerSnapshot?.markPrice);
    if (Number.isFinite(mark) && mark > 0) return mark;
    const { topBid, topAsk } = getTopPrices(depth ?? this.depthSnapshot);
    if (topBid == null || topAsk == null) return null;
    return (topBid + topAsk) / 2;
  }

  /** 可以被 sticky 复用的在场开仓挂单。 */
  private activeEntryOrders(): Order[] {
    return this.openOrders.filter(
      (order) =>
        order.symbol === this.config.symbol &&
        !order.reduceOnly &&
        isOrderActiveStatus(order.status) &&
        !this.pendingCancelOrders.has(String(order.orderId))
    );
  }

  /**
   * 在现有挂单中找出还能留在原地的那一张：距离仍在本档容差内、数量一致、
   * 且没有被其它档位认领。找到就复用它的价格，这一轮该档位不撤不挂。
   */
  private pickStickyPrice(params: {
    side: "BUY" | "SELL";
    targetBps: number;
    anchor: number;
    amount: number;
    pool: Order[];
    claimed: Set<string>;
  }): number | null {
    const { side, targetBps, anchor, amount, pool, claimed } = params;
    const tolerance = this.toleranceFor(targetBps);
    const qtyTolerance = Math.max(this.precision.qtyStep, EPS);
    let best: { id: string; price: number; delta: number } | null = null;

    for (const order of pool) {
      if (order.side !== side) continue;
      const id = String(order.orderId);
      if (claimed.has(id)) continue;
      const price = Number(order.price);
      if (!Number.isFinite(price) || price <= 0) continue;
      const origQty = Number(order.origQty);
      if (Number.isFinite(origQty) && Math.abs(origQty - amount) > qtyTolerance) continue;
      const keep = shouldKeepQuote({
        side,
        existingPrice: price,
        anchor,
        targetBps,
        toleranceBps: tolerance,
        maxDistanceBps: this.config.maxDistanceBps,
      });
      if (!keep) continue;
      const delta = Math.abs(signedDistanceBps(side, price, anchor) - targetBps);
      if (!best || delta < best.delta) {
        best = { id, price, delta };
      }
    }

    if (!best) return null;
    claimed.add(best.id);
    return best.price;
  }

  private buildDesiredOrders(params: {
    bid1: number;
    ask1: number;
    anchor: number | null;
    skipBuy: boolean;
    skipSell: boolean;
    depth: Depth | null;
  }): DesiredOrder[] {
    const { bid1, ask1, anchor, skipBuy, skipSell, depth } = params;

    // 远档先算，让它优先认领距离最匹配的在场挂单
    const targets = this.bandTargets().sort((a, b) => b.bps - a.bps);
    if (!targets.length) return [];

    const priceDecimals = this.getPriceDecimals();
    const minDepth = this.config.filterMinDepth;
    const desired: DesiredOrder[] = [];
    const pool = this.activeEntryOrders();
    const claimed = new Set<string>();
    const distances: Partial<Record<MakerPointsBand, { buy: number | null; sell: number | null }>> = {};

    for (const target of targets) {
      const amount = this.amountForBand(target.band);
      const record: { buy: number | null; sell: number | null } = { buy: null, sell: null };
      distances[target.band] = record;
      if (!Number.isFinite(amount) || amount <= 0) continue;

      for (const side of ["BUY", "SELL"] as const) {
        if (side === "BUY" ? skipBuy : skipSell) continue;

        const raw = resolveSafeQuotePrice({
          side,
          targetBps: target.bps,
          markPrice: anchor,
          bookPrice: side === "BUY" ? bid1 : ask1,
          maxDistanceBps: this.config.maxDistanceBps,
        });
        const ideal = raw == null ? null : this.normalizeDepthTargetPrice(raw, priceDecimals);
        if (ideal == null) continue;

        // 深度保护先于价格复用：目标价前方挂单太薄就整档不挂
        if (minDepth > 0) {
          const depthQty = getDepthBetweenPrices(depth, side, ideal);
          if (depthQty < minDepth) {
            this.logThinDepthSkip(side, target.bps, depthQty, minDepth);
            continue;
          }
          this.resetThinDepthSkip(side, target.bps);
        }

        const sticky =
          anchor == null
            ? null
            : this.pickStickyPrice({ side, targetBps: target.bps, anchor, amount, pool, claimed });
        const price = sticky ?? ideal;

        if (anchor != null) {
          const distance = signedDistanceBps(side, price, anchor);
          record[side === "BUY" ? "buy" : "sell"] = Number.isFinite(distance) ? distance : null;
        }

        desired.push({
          side,
          price: formatPriceToString(price, priceDecimals),
          amount,
          reduceOnly: false,
        });
      }
    }

    this.lastQuoteDistanceBps = distances;
    return desired;
  }

  /**
   * 深度从“满足阈值”切换到“不满足阈值”时立即触发一次主循环，抢在被吃穿前撤单。
   * 同时维护 lastDepthOkStatus，供下一次比较使用。
   */
  private shouldTriggerImmediateDepthProtection(depth: Depth | null): boolean {
    if (!depth) return false;
    if (this.defenseMode || this.reconnectResetPending || this.stopLossProcessing) return false;

    const minDepth = this.config.filterMinDepth;
    if (minDepth <= 0) return false;

    const { topBid, topAsk } = getTopPrices(depth);
    if (topBid == null || topAsk == null) return false;

    const anchor = this.getQuoteAnchor(depth);
    const priceDecimals = this.getPriceDecimals();
    let degraded = false;

    for (const target of this.bandTargets()) {
      const buyPrice = this.normalizeSafeQuote("BUY", target.bps, anchor, topBid, priceDecimals);
      const sellPrice = this.normalizeSafeQuote("SELL", target.bps, anchor, topAsk, priceDecimals);
      const currentBuyOk = getDepthBetweenPrices(depth, "BUY", buyPrice ?? 0) >= minDepth;
      const currentSellOk = getDepthBetweenPrices(depth, "SELL", sellPrice ?? 0) >= minDepth;

      const lastStatus = this.lastDepthOkStatus[target.bps];
      if (lastStatus && ((lastStatus.buy && !currentBuyOk) || (lastStatus.sell && !currentSellOk))) {
        degraded = true;
      }
      this.lastDepthOkStatus[target.bps] = { buy: currentBuyOk, sell: currentSellOk };
    }

    return degraded;
  }

  private normalizeSafeQuote(
    side: "BUY" | "SELL",
    targetBps: number,
    anchor: number | null,
    bookPrice: number,
    priceDecimals: number
  ): number | null {
    const raw = resolveSafeQuotePrice({
      side,
      targetBps,
      markPrice: anchor,
      bookPrice,
      maxDistanceBps: this.config.maxDistanceBps,
    });
    return raw == null ? null : this.normalizeDepthTargetPrice(raw, priceDecimals);
  }

  /**
   * 任一在场挂单已经漂出所有启用档位的容差（或穿过 mark、掉出积分范围）时，
   * 立即触发一次主循环，不等 500ms 定时器。
   */
  private shouldTriggerImmediateReprice(depth: Depth | null): boolean {
    if (!depth) return false;
    if (this.defenseMode || this.reconnectResetPending || this.stopLossProcessing) return false;

    const pool = this.activeEntryOrders();
    if (!pool.length) return false;

    const anchor = this.getQuoteAnchor(depth);
    if (anchor == null) return false;

    const targets = this.bandTargets();
    if (!targets.length) return true;

    for (const order of pool) {
      const price = Number(order.price);
      if (!Number.isFinite(price) || price <= 0) return true;
      const side = order.side === "BUY" ? "BUY" : "SELL";
      const keepable = targets.some((target) =>
        shouldKeepQuote({
          side,
          existingPrice: price,
          anchor,
          targetBps: target.bps,
          toleranceBps: this.toleranceFor(target.bps),
          maxDistanceBps: this.config.maxDistanceBps,
        })
      );
      if (!keepable) return true;
    }

    return false;
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
      this.tradeLog.push("order", t("log.spotMaker.startupCleanup"));
      this.initialOrderResetDone = true;
      return true;
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", t("log.spotMaker.startupCleanupGone"));
        this.initialOrderResetDone = true;
        this.openOrders = [];
        this.emitUpdate();
        return true;
      }
      this.tradeLog.push("error", t("log.spotMaker.startupCancelFailed", { error: String(error) }));
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
            t("log.spotMaker.cancelMismatched", {
              side: order.side,
              price: order.price,
              reduceOnly: order.reduceOnly,
            })
          );
        },
        () => {
          this.tradeLog.push("order", t("log.spotMaker.cancelAlreadySettled"));
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", t("log.spotMaker.cancelFailed", { error: String(error) }));
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
        const slPrice = target.reduceOnly ? undefined : this.computeStopLossTrigger(target.side, Number(target.price));
        await placeOrder(this.orderContext, {
          openOrders: this.openOrders,
          side: target.side,
          price: target.price,
          amount: target.amount,
          reduceOnly: target.reduceOnly,
          guard: undefined,
          qtyStep: this.precision.qtyStep,
          skipDedupe: true,
          slPrice
        });
      } catch (error) {
        if (isInsufficientBalanceError(error)) {
          this.registerInsufficientBalance(error);
          break;
        }
        if (isPrecisionError(error)) {
          this.tradeLog.push("warn", t("log.mp.precisionErrorResync", { error: extractMessage(error) }));
          this.precision.refresh();
        }
        this.tradeLog.push(
          "error",
          t("log.mp.placeFailed", { side: target.side, price: target.price, error: extractMessage(error) })
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
          t("log.mp.unexpectedOrders", { count: unexpectedOrders.length })
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
        this.tradeLog.push("order", t("log.mp.forceCancelled"));
        return true;
      }

      // 更新本地挂单状态以匹配真实状态
      if (realOrders.length !== this.openOrders.length) {
        // 移除本地记录中不存在于服务器的订单
        this.openOrders = this.openOrders.filter((o) => realOrderIds.has(String(o.orderId)));
      }
    } catch (error) {
      this.tradeLog.push("error", t("log.mp.verifyOrdersFailed", { error: extractMessage(error) }));
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
      t("log.mp.stopTriggered", { pnl: realtimePnl.toFixed(4) })
    );
    this.notify({
      type: "stop_loss",
      level: "error",
      symbol: this.config.symbol,
      title: t("notify.mp.stopTitle"),
      message: t("notify.mp.stopBody", { pnl: realtimePnl.toFixed(4) }),
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
          this.tradeLog.push("stop", t("log.mp.stopSucceeded"));
          this.stopLossCooldownUntil = Date.now() + STOP_LOSS_COOLDOWN_MS;
          break;
        }

        try {
          // 强制解锁 MARKET 类型，确保不被之前的操作阻塞
          unlockOperating(this.locks, this.timers, this.pending, "MARKET");

          // 先取消所有挂单
          await this.flushOrders();

          // 执行市价平仓
          await marketClose(this.orderContext, {
            openOrders: this.openOrders,
            side: side,
            quantity: currentAbsPosition,
            guard: undefined,
            qtyStep: this.precision.qtyStep
          });

          // 等待一小段时间让账户数据更新
          await this.sleep(STOP_LOSS_RETRY_INTERVAL_MS);

        } catch (error) {
          retryCount++;
          if (isUnknownOrderError(error)) {
            this.tradeLog.push("order", t("log.mp.stopOrderMissing"));
          } else if (isPrecisionError(error)) {
            this.tradeLog.push("warn", t("log.mp.stopPrecisionResync", { error: extractMessage(error) }));
            this.precision.refresh();
          } else {
            this.tradeLog.push("error", t("log.mp.stopRetry", { attempt: retryCount, max: maxRetries, error: extractMessage(error) }));
          }

          // 失败后等待一段时间再重试
          if (retryCount < maxRetries) {
            await this.sleep(STOP_LOSS_RETRY_INTERVAL_MS);
          }
        }
      }

      if (retryCount >= maxRetries) {
        this.tradeLog.push("error", t("log.mp.stopRetriesExhausted", { max: maxRetries }));
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
          this.tradeLog.push("order", t("log.spotMaker.cancelAlreadySettled"));
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", t("log.spotMaker.cancelFailed", { error: String(error) }));
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        }
      );
    }
  }

  /**
   * 开仓单附带的止损触发价：一旦挂单被吃就立刻市价止血。
   * 按 bps 计算而非固定金额，换标的时不会退化成几百 bps 或落到 tick 之内被交易所拒单。
   */
  private computeStopLossTrigger(side: "BUY" | "SELL", price: number): number | undefined {
    if (!Number.isFinite(price) || price <= 0) return undefined;
    const bps = Number(this.config.slOffsetBps);
    if (!Number.isFinite(bps) || bps <= 0) return undefined;
    const tick = Math.max(this.precision.priceTick, 1e-9);
    const offset = Math.max((price * bps) / 10000, tick * 2);
    const trigger = side === "BUY" ? price - offset : price + offset;
    if (!Number.isFinite(trigger) || trigger <= 0) return undefined;
    return Number(formatPriceToString(trigger, this.getPriceDecimals()));
  }

  private getPriceDecimals(): number {
    const tick = Math.max(1e-9, this.precision.priceTick);
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
        this.tradeLog.push("error", t("log.mp.updateHandlerError", { error: String(error) }));
      });
    } catch (err) {
      this.tradeLog.push("error", t("log.mp.snapshotError", { error: String(err) }));
    }
  }

  private buildSnapshot(): MakerPointsSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const spread = topBid != null && topAsk != null ? topAsk - topBid : null;
    const pnl = computePositionPnl(position, topBid, topAsk);
    const anchor = this.getQuoteAnchor(this.depthSnapshot);
    const bandDepths = this.computeBandDepths(topBid, topAsk, anchor);
    const markRaw = Number(this.tickerSnapshot?.markPrice);
    const now = Date.now();
    const orderRestingMs: Record<string, number> = {};
    for (const order of this.openOrders) {
      const placed = Number(order.time);
      if (Number.isFinite(placed) && placed > 0) {
        orderRestingMs[String(order.orderId)] = Math.max(0, now - placed);
      }
    }

    return {
      ready: this.isReady(),
      symbol: this.config.symbol,
      topBid,
      topAsk,
      markPrice: Number.isFinite(markRaw) && markRaw > 0 ? markRaw : null,
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
      maxDistanceBps: this.config.maxDistanceBps,
      bandDepths,
      orderRestingMs,
      quoteStatus: {
        closeOnly: this.lastCloseOnly,
        skipBuy: this.lastSkipBuy,
        skipSell: this.lastSkipSell,
      },
    };
  }

  private computeBandDepths(
    topBid: number | null,
    topAsk: number | null,
    anchor: number | null
  ): BandStatus[] {
    const enabled: Record<MakerPointsBand, boolean> = {
      "0-10": this.config.enableBand0To10,
      "10-30": this.config.enableBand10To30,
      "30-100": this.config.enableBand30To100,
    };
    // 展开全部三档（含未启用的），仪表盘要能看到被关掉的档位
    const all = buildBandTargets({
      band0To10: true,
      band10To30: true,
      band30To100: true,
      band0To10Bps: this.config.band0To10Bps,
      band10To30Bps: this.config.band10To30Bps,
      band30To100Bps: this.config.band30To100Bps,
    });
    const priceDecimals = this.getPriceDecimals();

    return all.map(({ band, bps }) => {
      const quoted = this.lastQuoteDistanceBps[band];
      const buyDistanceBps = quoted?.buy ?? null;
      const sellDistanceBps = quoted?.sell ?? null;
      const base: BandStatus = {
        band,
        bps,
        enabled: enabled[band],
        buyDepth: null,
        sellDepth: null,
        buyDistanceBps,
        sellDistanceBps,
        buyMultiplier: buyDistanceBps == null ? null : makerPointsMultiplier(buyDistanceBps),
        sellMultiplier: sellDistanceBps == null ? null : makerPointsMultiplier(sellDistanceBps),
      };
      if (!this.depthSnapshot || topBid == null || topAsk == null) return base;

      const buyPrice = this.normalizeSafeQuote("BUY", bps, anchor, topBid, priceDecimals);
      const sellPrice = this.normalizeSafeQuote("SELL", bps, anchor, topAsk, priceDecimals);
      return {
        ...base,
        buyDepth: getDepthBetweenPrices(this.depthSnapshot, "BUY", buyPrice ?? 0),
        sellDepth: getDepthBetweenPrices(this.depthSnapshot, "SELL", sellPrice ?? 0),
      };
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
        this.tradeLog.push("info", t("log.mp.noTargets"));
        this.lastDesiredSummary = "none";
      }
      return;
    }
    const summary = desired
      .map((order) => `${order.side}@${order.price}${order.reduceOnly ? "(RO)" : ""}`)
      .join(" | ");
    if (summary !== this.lastDesiredSummary) {
      this.tradeLog.push("info", t("log.mp.targets", { summary }));
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
        t("log.mp.skipThinDepth", { side, bps, depth: depthQty.toFixed(4), min: minDepth })
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
      this.tradeLog.push("info", t("log.mp.depthRecovered", { side, bps }));
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
    this.tradeLog.push("warn", t("log.mp.insufficientBalance", { seconds, detail }));
    this.insufficientBalanceNotified = true;
  }

  private applyInsufficientBalanceState(now: number): boolean {
    const active = now < this.insufficientBalanceCooldownUntil;
    if (!active && this.insufficientBalanceNotified) {
      this.tradeLog.push("info", t("log.mp.balanceRecovered"));
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
        title: t("notify.mp.openTitle"),
        message: t("notify.mp.openBody", {
          direction: currentSide === "LONG" ? t("trend.label.long") : t("trend.label.short"),
          qty: Math.abs(currentAmt).toFixed(6),
        }),
        details: {
          side: currentSide,
          size: Math.abs(currentAmt),
          price: reference > 0 ? reference : null,
        },
      });
    } else if (currentSide === "FLAT" && prevSide !== "FLAT") {
      const pnl = position.unrealizedProfit;
      const closeType = this.tokenExpiry.closeOnlyMode
        ? t("notify.mp.closeTitleTokenExpired")
        : t("notify.mp.closeTitle");
      this.notify({
        type: "position_closed",
        level: "success",
        symbol: this.config.symbol,
        title: closeType,
        message: t("notify.mp.closeBody", {
          qty: Math.abs(prevAmt).toFixed(6),
          direction: prevSide === "LONG" ? t("common.direction.long") : t("common.direction.short"),
        }),
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
          title: t("notify.mp.increaseTitle"),
          message: t("notify.mp.increaseBody", {
            direction: currentSide === "LONG" ? t("trend.label.long") : t("trend.label.short"),
            delta: absChange.toFixed(6),
            qty: Math.abs(currentAmt).toFixed(6),
          }),
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
          title: t("notify.mp.reduceTitle"),
          message: t("notify.mp.reduceBody", {
            direction: currentSide === "LONG" ? t("common.direction.long") : t("common.direction.short"),
            delta: absChange.toFixed(6),
            qty: Math.abs(currentAmt).toFixed(6),
          }),
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
        title: t("notify.mp.reverseTitle"),
        message: t("notify.mp.reverseBody", {
          transition:
            prevSide === "LONG"
              ? t("common.direction.longToShort")
              : t("common.direction.shortToLong"),
          qty: Math.abs(currentAmt).toFixed(6),
        }),
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

  // ========== 数据过时防御模式方法 ==========

  /**
   * 检查数据是否过时，进入或退出防御模式
   * StandX 账户数据在 WS 推送异常时会通过 REST 补拉；长期无更新通常意味着 WS/REST 均异常，应进入防御模式
   */
  private checkDataStaleAndDefense(): void {
    const now = Date.now();
    const verdict = evaluateDefense({
      now,
      lastDepthTime: this.lastStandxDepthTime,
      lastAccountTime: this.lastStandxAccountTime,
      lastBinanceDepthTime: this.lastBinanceDepthTime,
      binanceHealth: this.binanceDepth.getHealth(),
      accountHealth: validateAccountSnapshotForSymbol(this.accountSnapshot, this.config.symbol),
      hasAccountSnapshot: this.accountSnapshot != null,
      accountProbeFailures: this.accountStaleRestProbeConsecutiveFailures,
      accountProbeInFlight: this.accountStaleRestProbeInFlight != null,
      restUnhealthy: this.standxRestUnhealthy,
      restConsecutiveErrors: this.standxRestConsecutiveErrors,
      restLastError: this.standxRestLastError,
      marginMode: this.marginGuard.currentMode(),
      enforceIsolatedMargin: this.exchange.id === "standx",
    });

    if (verdict.needsAccountProbe) {
      this.maybeProbeStandxAccountSnapshot(now);
    }
    if (verdict.shouldDefend && !this.defenseMode) {
      this.enterDefenseMode(verdict.reasons);
    } else if (!verdict.shouldDefend && this.defenseMode) {
      this.exitDefenseMode();
    }
  }

  /**
   * 进入防御模式
   * 取消所有挂单，启动 REST 轮询保护仓位
   */
  private enterDefenseMode(reasons: DefenseReasons): void {
    this.defenseMode = true;
    const staleSummary = describeDefenseReasons(reasons);

    this.tradeLog.push("warn", t("log.mp.defenseEntered", { summary: staleSummary }));

    // 发送通知
    if (!this.defenseModeNotified) {
      this.notify({
        type: "token_expired",
        level: "warn",
        symbol: this.config.symbol,
        title: t("notify.mp.defenseTitle"),
        message: t("notify.mp.defenseBody", { summary: staleSummary }),
        details: reasons,
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

    this.tradeLog.push("info", t("log.mp.defenseExited"));

    this.notify({
      type: "position_opened",
      level: "info",
      symbol: this.config.symbol,
      title: t("notify.mp.defenseClearedTitle"),
      message: t("notify.mp.defenseClearedBody"),
      details: {},
    });

    // 停止 REST 轮询
    this.stopDefenseRestPoll();

    // 重置本地状态，强制下一轮重新计算挂单
    this.desiredOrders = [];
    this.lastDesiredSummary = null;
    this.lastQuoteDistanceBps = {};
  }

  /**
   * 防御模式下取消所有挂单
   */
  private async defenseCancelAllOrders(): Promise<void> {
    try {
      if (this.exchange.forceCancelAllOrders) {
        const success = await this.exchange.forceCancelAllOrders();
        if (success) {
          this.tradeLog.push("order", t("log.mp.defenseForceCancelled"));
        } else {
          this.tradeLog.push("warn", t("log.mp.defenseCancelPartial"));
        }
      } else {
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        this.tradeLog.push("order", t("log.mp.defenseCancelled"));
      }

      // 重置本地挂单状态
      this.openOrders = [];
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", t("log.mp.defenseOrdersGone"));
        this.openOrders = [];
        this.pendingCancelOrders.clear();
      } else {
        this.tradeLog.push("error", t("log.mp.defenseCancelFailed", { error: extractMessage(error) }));
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

    this.tradeLog.push("info", t("log.mp.defensePollStarted"));

    const poll = async () => {
      if (!this.defenseRestPollActive || !this.defenseMode) return;

      try {
        if (this.exchange.queryAccountSnapshot) {
          const nextAccount = await this.exchange.queryAccountSnapshot();
          if (nextAccount) {
            this.applyAccountSnapshot(nextAccount);
            const health = validateAccountSnapshotForSymbol(nextAccount, this.config.symbol);
            if (!health.ok) {
              this.tradeLog.push("warn", t("log.mp.defensePositionStillBad", { issues: health.issues.join(",") }));
            }
          } else {
            this.tradeLog.push("warn", t("log.mp.defenseEmptySnapshot"));
          }
        }

        // 防御模式下也尝试修复保证金模式（StandX）
        if (this.exchange.id === "standx") {
          await this.marginGuard.ensureIsolated();
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
              this.tradeLog.push("warn", t("log.mp.defenseFoundOrders", { count: realOrders.length }));
              await this.defenseCancelAllOrders();
            }
          } catch (error) {
            this.tradeLog.push("error", t("log.mp.defenseQueryFailed", { error: extractMessage(error) }));
            // 查询失败时仍然尝试撤销所有挂单（宁可多撤，也不遗留）
            await this.defenseCancelAllOrders();
          }
        } else {
          await this.defenseCancelAllOrders();
        }

        // 检查止损条件（使用当前账户快照中的数据）
        // checkStopLoss 会继续运行，使用最后收到的数据进行止损判断
      } catch (error) {
        this.tradeLog.push("error", t("log.mp.defensePollFailed", { error: extractMessage(error) }));
      }

      // 继续下一次轮询
      if (this.defenseRestPollActive && this.defenseMode) {
        this.defenseRestPollTimer = setTimeout(() => void poll(), 2000);
      }
    };

    void poll();
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
    this.tradeLog.push("info", t("log.mp.defensePollStopped"));
  }
}

function resolveBinanceSymbol(symbol: string): string {
  const parts = parseSymbolParts(symbol);
  const base = (parts.base ?? symbol).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return base ? `${base}USDT` : "BTCUSDT";
}
