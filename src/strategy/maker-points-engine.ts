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
const STOP_LOSS_CHECK_INTERVAL_MS = 250; // Max stop-loss check interval
const STOP_LOSS_RETRY_INTERVAL_MS = 500; // Retry interval after stop-loss failure
const DATA_STALE_THRESHOLD_MS = 5_000; // Data staleness threshold (5s)
const DEFENSE_MODE_CHECK_INTERVAL_MS = 1000; // Defense-mode check interval
const ACCOUNT_DATA_STALE_THRESHOLD_MS = 20_000; // Account-data stale threshold (REST probe first, no immediate defense mode)
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
  // Track whether depth is sufficient per band (indexed by bps).
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

  // Connection-protection state (for disconnect/reconnect handling).
  private _standxConnectionState: "connected" | "disconnected" = "connected";
  private reconnectResetPending = false;
  private lastRepriceQueryTime = 0;
  private readonly repriceQueryIntervalMs = 3000; // Minimum query interval.

  // ========== Data-staleness defense mode ==========
  // Last update timestamp per data source
  private lastStandxDepthTime = 0;
  private lastStandxAccountTime = 0;
  private lastBinanceDepthTime = 0;
  private accountStaleRestProbeInFlight: Promise<void> | null = null;
  private accountStaleRestProbeLastAttempt = 0;
  private accountStaleRestProbeConsecutiveFailures = 0;
  // Defense-mode state
  private defenseMode = false;
  private defenseModeNotified = false;
  private defenseModeTimer: ReturnType<typeof setInterval> | null = null;
  // REST polling timer during defense mode
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
        this.tradeLog.push("warn", `Binance ${context} error: ${extractMessage(error)}`);
      },
    });
    this.binanceDepth.onUpdate(() => {
      this.feedStatus.binance = true;
      this.lastBinanceDepthTime = Date.now();
      this.emitUpdate();
    });
    // Listen for Binance connection status changes.
    this.binanceDepth.onConnectionChange((state) => {
      if (state === "disconnected") {
        this.feedStatus.binance = false;
        this.tradeLog.push("warn", "Binance depth connection disconnected");
      } else if (state === "stale") {
        this.feedStatus.binance = false;
        this.tradeLog.push("warn", "Binance depth data is stale");
      } else if (state === "connected") {
        this.feedStatus.binance = true;
        this.tradeLog.push("info", "Binance depth connection restored");
      }
      this.emitUpdate();
    });
    this.syncPrecision();
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    // Initialize data timestamps.
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
    // Start defense-mode detection timer.
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

    // Register connection-event listener (if exchange supports it).
    this.setupConnectionProtection();
  }

  private applyAccountSnapshot(snapshot: AsterAccountSnapshot): void {
    this.accountSnapshot = snapshot;
    // StandX: WS updates use local receive timestamp; REST snapshots map `time` to `snapshot.updateTime`.
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
   * Configure connection protection.
   * Listen to disconnect/reconnect events and apply protection logic.
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
   * Handle disconnect events.
   */
  private handleDisconnect(symbol: string): void {
    this._standxConnectionState = "disconnected";
    this.tradeLog.push("warn", `WebSocket disconnected (${symbol}), starting disconnect protection`);
    this.notify({
      type: "token_expired",
      level: "warn",
      symbol: this.config.symbol,
      title: "Connection lost",
      message: "WebSocket disconnected, attempting to cancel all open orders",
      details: { symbol },
    });
  }

  /**
   * Handle reconnect events.
   * After reconnect, re-query open orders and cancel all of them.
   */
  private async handleReconnect(symbol: string): Promise<void> {
    this._standxConnectionState = "connected";
    this.reconnectResetPending = true;
    this.tradeLog.push("info", `WebSocket reconnected (${symbol}), starting reconnect protection flow`);

    try {
      // Query real open-order state.
      if (this.exchange.queryOpenOrders) {
        const realOrders = await this.exchange.queryOpenOrders();
        this.tradeLog.push("info", `Found ${realOrders.length} open orders after reconnect`);

        if (realOrders.length > 0) {
          // Cancel all open orders.
          if (this.exchange.forceCancelAllOrders) {
            const success = await this.exchange.forceCancelAllOrders();
            if (success) {
              this.tradeLog.push("order", "Reconnect protection: cancelled all open orders");
            } else {
              this.tradeLog.push("warn", "Reconnect protection: cancel-all incomplete, will retry next cycle");
            }
          } else {
            await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
            this.tradeLog.push("order", "Reconnect protection: cancelled all open orders");
          }
        }
      }

      // Reset local open-order state.
      this.openOrders = [];
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");

      // Reset reprice baseline and force next recomputation.
      this.lastQuoteBid1 = null;
      this.lastQuoteAsk1 = null;
      this.desiredOrders = [];
      this.lastDesiredSummary = null;

      // Mark startup reset to run again.
      this.initialOrderResetDone = false;

      this.notify({
        type: "position_opened",
        level: "info",
        symbol: this.config.symbol,
        title: "Reconnect complete",
        message: "WebSocket reconnected and order state cleaned up",
        details: { symbol },
      });
    } catch (error) {
      this.tradeLog.push("error", `Reconnect protection flow failed: ${extractMessage(error)}`);
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
    // Skip main loop during reconnect handling to avoid state races.
    if (this.reconnectResetPending) return;
    // Skip main loop while stop-loss execution is running to avoid order conflicts.
    if (this.stopLossProcessing) return;
    // Do not run normal quoting logic in defense mode.
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
        this.tradeLog.push("info", closeOnly ? "Entering close-only mode, reduce-only orders only" : "Exiting close-only mode");
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
          this.tradeLog.push("info", `Binance depth imbalance, pausing ${summary} quotes`);
        } else {
          this.tradeLog.push("info", "Binance depth recovered, resuming quotes");
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
        this.tradeLog.push("warn", `Rate limit triggered, pausing quotes: ${extractMessage(error)}`);
      } else {
        this.tradeLog.push("error", `MakerPoints main loop error: ${extractMessage(error)}`);
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

      // Check depth for all bands.
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
   * Check whether depth sufficiency changed across bands.
   * Recompute when depth flips between sufficient and insufficient.
   */
  private checkDepthStatusChanged(
    depth: AsterDepth | null,
    bid1: number,
    ask1: number
  ): boolean {
    const minDepth = this.config.filterMinDepth;
    if (minDepth <= 0) return false;
    const priceDecimals = this.getPriceDecimals();

    // Get all enabled bands.
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
   * When depth flips from above-threshold to below-threshold, trigger an immediate cycle
   * to cancel now-unsafe quotes first.
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
   * When book movement exceeds `minRepriceBps` versus last quote baseline,
   * trigger an immediate cycle to cancel stale quotes.
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

  private async syncOrders(targets: DesiredOrder[], _closeOnly: boolean): Promise<void> {
    // Skip quoting while stop-loss execution runs to avoid conflicts.
    if (this.stopLossProcessing) return;
    // Skip quoting during reconnect handling.
    if (this.reconnectResetPending) return;

    // Price-change protection: if reprice is needed and query interval elapsed, verify real open orders first.
    const shouldVerifyOrders = await this.verifyOrdersIfNeeded();
    if (shouldVerifyOrders) {
      // If unexpected open orders are found, cancel all first.
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
            `Cancelled mismatched order ${order.side} @ ${order.price} reduceOnly=${order.reduceOnly}`
          );
        },
        () => {
          this.tradeLog.push("order", "Order already filled/cancelled during cancel, ignoring");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `Cancel order failed: ${String(error)}`);
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
        // Reduce-only orders cannot set tp/sl; only entry orders set stop-loss.
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
          this.tradeLog.push("warn", `Precision error detected, resyncing: ${extractMessage(error)}`);
          this.syncPrecision(true);
        }
        this.tradeLog.push(
          "error",
          `Place order failed ${target.side} @ ${target.price}: ${extractMessage(error)}`
        );
      }
    }
  }

  /**
   * Verify real open-order state to guard against missed cancel requests.
   * Query real orders on each reprice and cancel-all if unexpected orders exist.
   * @returns true when an issue is found and cancel action executed; caller should skip placement this cycle
   */
  private async verifyOrdersIfNeeded(): Promise<boolean> {
    // Skip verification if exchange cannot query open orders.
    if (!this.exchange.queryOpenOrders) return false;

    // Rate-limit verification queries.
    const now = Date.now();
    if (now - this.lastRepriceQueryTime < this.repriceQueryIntervalMs) {
      return false;
    }

    try {
      const realOrders = await this.exchange.queryOpenOrders();
      this.lastRepriceQueryTime = now;

      // Compare real open orders with local records.
      const realOrderIds = new Set(realOrders.map((o) => String(o.orderId)));
      const localOrderIds = new Set(this.openOrders.map((o) => String(o.orderId)));

      // Find orders thought cancelled locally but still live remotely.
      const unexpectedOrders = realOrders.filter((order) => {
        const orderId = String(order.orderId);
        // Missing in local state means we assumed it was cancelled.
        if (!localOrderIds.has(orderId)) {
          return true;
        }
        // Local state says pending cancel but remote still has it.
        if (this.pendingCancelOrders.has(orderId)) {
          return true;
        }
        return false;
      });

      if (unexpectedOrders.length > 0) {
        this.tradeLog.push(
          "warn",
          `Found ${unexpectedOrders.length} unexpected open orders, forcing cancel-all`
        );

        // Force-cancel all open orders.
        if (this.exchange.forceCancelAllOrders) {
          await this.exchange.forceCancelAllOrders();
        } else {
          await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        }

        // Reset local state.
        this.openOrders = [];
        this.pendingCancelOrders.clear();
        this.tradeLog.push("order", "Force-cancelled all open orders and reset local state");
        return true;
      }

      // Sync local order state with remote truth.
      if (realOrders.length !== this.openOrders.length) {
        // Remove local entries that no longer exist remotely.
        this.openOrders = this.openOrders.filter((o) => realOrderIds.has(String(o.orderId)));
      }
    } catch (error) {
      this.tradeLog.push("error", `Open-order state verification failed: ${extractMessage(error)}`);
    }

    return false;
  }

  /**
   * Compute unrealized PnL from real-time depth data.
   * Prefer real-time values and fall back to account snapshot data.
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

    // Use real-time computed PnL.
    const realtimePnl = this.computeRealtimePnl(position);
    if (realtimePnl == null) return;

    const now = Date.now();
    if (now < this.stopLossCooldownUntil) return;
    if (realtimePnl > -lossLimit) return;

    this.stopLossProcessing = true;
    // Do not set cooldown here; only set after successful close.
    this.tradeLog.push(
      "stop",
      `Stop-loss triggered: real-time unrealized loss ${realtimePnl.toFixed(4)} USDT`
    );
    this.notify({
      type: "stop_loss",
      level: "error",
      symbol: this.config.symbol,
      title: "Stop-loss triggered",
      message: `Real-time unrealized loss ${realtimePnl.toFixed(4)} USDT, forcing close`,
      details: {
        side: position.positionAmt > 0 ? "LONG" : "SHORT",
        size: absPosition,
        unrealizedPnl: realtimePnl,
        lossLimit: -lossLimit,
      },
    });

    // Retry stop-loss in a loop until position is zero.
    await this.executeStopLossWithRetry(position.positionAmt > 0 ? "SELL" : "BUY");
  }

  /**
   * Execute stop-loss close; auto-retry on failure until position is zero.
   */
  private async executeStopLossWithRetry(side: "BUY" | "SELL"): Promise<void> {
    const maxRetries = 10;
    let retryCount = 0;

    try {
      while (retryCount < maxRetries) {
        // Re-check position before each retry.
        const currentPosition = getPosition(this.accountSnapshot, this.config.symbol);
        const currentAbsPosition = Math.abs(currentPosition.positionAmt);

        // Position is zero, stop-loss succeeded.
        if (currentAbsPosition < EPS) {
          this.tradeLog.push("stop", "Stop-loss successful: position is zero");
          this.stopLossCooldownUntil = Date.now() + STOP_LOSS_COOLDOWN_MS;
          break;
        }

        try {
          // Force-unlock MARKET type to prevent prior-operation blocking.
          unlockOperating(this.locks, this.timers, this.pending, "MARKET");

          // Cancel all open orders first.
          await this.flushOrders();

          // Execute market close.
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

          // Wait briefly for account data refresh.
          await this.sleep(STOP_LOSS_RETRY_INTERVAL_MS);

        } catch (error) {
          retryCount++;
          if (isUnknownOrderError(error)) {
            this.tradeLog.push("order", "Order missing during stop-loss close, continue checking position");
          } else if (isPrecisionError(error)) {
            this.tradeLog.push("warn", `Stop-loss close precision error, resyncing: ${extractMessage(error)}`);
            this.syncPrecision(true);
          } else {
            this.tradeLog.push("error", `Stop-loss close failed (retry ${retryCount}/${maxRetries}): ${extractMessage(error)}`);
          }

          // Wait briefly before next retry on failure.
          if (retryCount < maxRetries) {
            await this.sleep(STOP_LOSS_RETRY_INTERVAL_MS);
          }
        }
      }

      if (retryCount >= maxRetries) {
        this.tradeLog.push("error", `Stop-loss retries reached limit (${maxRetries}), please check position manually`);
        // Set cooldown once max retries reached to avoid continuous retries.
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
          this.tradeLog.push("order", "Order already filled/cancelled during cancel, ignoring");
          this.pendingCancelOrders.delete(String(order.orderId));
          this.openOrders = this.openOrders.filter((existing) => existing.orderId !== order.orderId);
        },
        (error) => {
          this.tradeLog.push("error", `Cancel order failed: ${String(error)}`);
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
        this.tradeLog.push("error", `Update listener error: ${String(error)}`);
      });
    } catch (err) {
      this.tradeLog.push("error", `Snapshot generation error: ${String(err)}`);
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
        this.tradeLog.push("info", "No target orders currently");
        this.lastDesiredSummary = "none";
      }
      return;
    }
    const summary = desired
      .map((order) => `${order.side}@${order.price}${order.reduceOnly ? "(RO)" : ""}`)
      .join(" | ");
    if (summary !== this.lastDesiredSummary) {
      this.tradeLog.push("info", `Target orders: ${summary}`);
      this.lastDesiredSummary = summary;
    }
  }

  // Track depth-skip state per band (indexed by bps and side).
  private thinDepthSkipStatus: Record<string, boolean> = {};

  /**
   * Log when order placement is skipped due to insufficient depth.
   * Uses state tracking to avoid duplicate logs.
   */
  private logThinDepthSkip(side: "BUY" | "SELL", bps: number, depthQty: number, minDepth: number): void {
    const key = `${side}_${bps}`;
    const alreadySkipped = this.thinDepthSkipStatus[key];

    if (!alreadySkipped) {
      this.tradeLog.push(
        "info",
        `Skip ${side} ${bps}bps order: depth ${depthQty.toFixed(4)} BTC < ${minDepth} BTC`
      );
      this.thinDepthSkipStatus[key] = true;
    }
  }

  /**
   * Reset skip state when depth recovers so future skips can be logged again.
   */
  private resetThinDepthSkip(side: "BUY" | "SELL", bps: number): void {
    const key = `${side}_${bps}`;
    if (this.thinDepthSkipStatus[key]) {
      this.tradeLog.push("info", `${side} ${bps}bps depth recovered, resuming placement`);
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
    this.tradeLog.push("warn", `Insufficient balance, pause quoting for ${seconds}s: ${detail}`);
    this.insufficientBalanceNotified = true;
  }

  private applyInsufficientBalanceState(now: number): boolean {
    const active = now < this.insufficientBalanceCooldownUntil;
    if (!active && this.insufficientBalanceNotified) {
      this.tradeLog.push("info", "Balance recovered, resuming quoting");
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
        title: "Open position",
        message: `${currentSide === "LONG" ? "Long" : "Short"} ${Math.abs(currentAmt).toFixed(6)}`,
        details: {
          side: currentSide,
          size: Math.abs(currentAmt),
          price: reference > 0 ? reference : null,
        },
      });
    } else if (currentSide === "FLAT" && prevSide !== "FLAT") {
      const pnl = position.unrealizedProfit;
      const closeType = this.tokenExpiredCloseOnlyMode ? "Token-expired close" : "Close";
      this.notify({
        type: "position_closed",
        level: "success",
        symbol: this.config.symbol,
        title: closeType,
        message: `Closed ${Math.abs(prevAmt).toFixed(6)} (${prevSide === "LONG" ? "LONG" : "SHORT"})`,
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
          title: "Increase position",
          message: `${currentSide === "LONG" ? "Long" : "Short"} +${absChange.toFixed(6)} -> ${Math.abs(currentAmt).toFixed(6)}`,
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
          title: "Reduce position",
          message: `${currentSide === "LONG" ? "LONG" : "SHORT"} -${absChange.toFixed(6)} -> ${Math.abs(currentAmt).toFixed(6)}`,
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
        title: "Reverse position",
        message: `${prevSide === "LONG" ? "LONG->SHORT" : "SHORT->LONG"} ${Math.abs(currentAmt).toFixed(6)}`,
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
        title: "Token expired",
        message: expiryStatus.hasPosition
          ? "Token expired, entering close-only mode and no new entries"
          : "Token expired, strategy enters silent mode",
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
        this.tradeLog.push("order", "Token expired, cancelled all open orders");
        this.openOrders = [];
        this.tokenExpiryCancelDone = true;
      } catch (error) {
        if (isUnknownOrderError(error)) {
          this.tradeLog.push("order", "Order already missing during token-expired cancel");
          this.tokenExpiryCancelDone = true;
        } else {
          this.tradeLog.push("error", `Token-expired cancel failed: ${extractMessage(error)}`);
        }
      }
    }

    if (expiryStatus.state === "expired_with_position") {
      if (!this.tokenExpiredCloseOnlyMode) {
        this.tokenExpiredCloseOnlyMode = true;
        this.tradeLog.push("info", "Token expired, forcing close-only mode with reduce-only orders");
      }
      return false;
    }

    if (expiryStatus.state === "silent") {
      if (prevState !== "silent") {
        this.tradeLog.push("info", "Entering silent data-receive mode with no trading operations");
      }
      return true;
    }

    return true;
  }

  // ========== Data-staleness defense methods ==========

  /**
   * Check whether data is stale and enter/exit defense mode.
   * StandX account data may recover via REST when WS stream is abnormal; prolonged inactivity usually
   * means both WS/REST are problematic and should trigger defense mode.
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
      // WS update gaps can be long; give REST one recovery attempt before entering defense mode.
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
      // Enter defense mode.
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
      // Exit defense mode.
      this.exitDefenseMode();
    }
  }

  /**
   * Enter defense mode.
   * Cancel all open orders and start REST polling to protect positions.
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

    // Build stale-data summary.
    const staleItems: string[] = [];
    if (staleInfo.standxDepthStale) {
      staleItems.push(`StandX depth (${Math.round(staleInfo.standxDepthAge / 1000)}s)`);
    }
    if (staleInfo.standxAccountStale) {
      staleItems.push(`StandX account (${Math.round(staleInfo.standxAccountAge / 1000)}s)`);
    }
    if (staleInfo.accountInvalid) {
      staleItems.push(`StandX position data abnormal (${staleInfo.accountIssues.join(",") || "unknown"})`);
    }
    if (staleInfo.standxRestUnhealthy) {
      staleItems.push(`StandX REST errors (${staleInfo.standxRestConsecutiveErrors})`);
    }
    if (staleInfo.marginModeNotIsolated) {
      staleItems.push(`Margin mode (${staleInfo.marginMode ?? "unknown"})`);
    }
    if (staleInfo.binanceStale) {
      staleItems.push(`Binance depth (${Math.round(staleInfo.binanceAge / 1000)}s)`);
    }
    if (staleInfo.binanceUnhealthy && staleInfo.binanceHealthReason) {
      staleItems.push(`Binance book health abnormal (${staleInfo.binanceHealthReason})`);
    }

    const staleSummary = staleItems.length > 0 ? staleItems.join(", ") : "unknown";

    this.tradeLog.push("warn", `Data staleness detected: ${staleSummary}, entering defense mode`);

    // Send notification.
    if (!this.defenseModeNotified) {
      this.notify({
        type: "token_expired",
        level: "warn",
        symbol: this.config.symbol,
        title: "Defense mode",
        message: `Data stream interrupted: ${staleSummary}, all open orders cancelled`,
        details: staleInfo,
      });
      this.defenseModeNotified = true;
    }

    // Cancel all open orders immediately.
    void this.defenseCancelAllOrders();

    // Start REST polling to protect position handling.
    this.startDefenseRestPoll();
  }

  /**
   * Exit defense mode.
   */
  private exitDefenseMode(): void {
    this.defenseMode = false;
    this.defenseModeNotified = false;

    this.tradeLog.push("info", "Data stream recovered, exiting defense mode");

    this.notify({
      type: "position_opened",
      level: "info",
      symbol: this.config.symbol,
      title: "Defense mode cleared",
      message: "Data stream recovered, resuming normal trading",
      details: {},
    });

    // Stop REST polling.
    this.stopDefenseRestPoll();

    // Reset local state and force quote recomputation next cycle.
    this.desiredOrders = [];
    this.lastDesiredSummary = null;
    this.lastQuoteBid1 = null;
    this.lastQuoteAsk1 = null;
  }

  /**
   * Cancel all open orders during defense mode.
   */
  private async defenseCancelAllOrders(): Promise<void> {
    try {
      if (this.exchange.forceCancelAllOrders) {
        const success = await this.exchange.forceCancelAllOrders();
        if (success) {
          this.tradeLog.push("order", "Defense mode: force-cancelled all open orders");
        } else {
          this.tradeLog.push("warn", "Defense mode: cancel-all incomplete, will keep retrying");
        }
      } else {
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        this.tradeLog.push("order", "Defense mode: cancelled all open orders");
      }

      // Reset local open-order state.
      this.openOrders = [];
      this.pendingCancelOrders.clear();
      unlockOperating(this.locks, this.timers, this.pending, "LIMIT");
    } catch (error) {
      if (isUnknownOrderError(error)) {
        this.tradeLog.push("order", "Defense mode: open orders already absent");
        this.openOrders = [];
        this.pendingCancelOrders.clear();
      } else {
        this.tradeLog.push("error", `Defense mode cancel-all failed: ${extractMessage(error)}`);
      }
    }
  }

  /**
   * Start REST polling while in defense mode.
   * Pull data via REST API so stop-loss logic can continue working.
   */
  private startDefenseRestPoll(): void {
    if (this.defenseRestPollActive) return;
    this.defenseRestPollActive = true;

    this.tradeLog.push("info", "Defense mode: start REST data polling");

    const poll = async () => {
      if (!this.defenseRestPollActive || !this.defenseMode) return;

      try {
        if (this.exchange.queryAccountSnapshot) {
          const nextAccount = await this.exchange.queryAccountSnapshot();
          if (nextAccount) {
            this.applyAccountSnapshot(nextAccount);
            const health = validateAccountSnapshotForSymbol(nextAccount, this.config.symbol);
            if (!health.ok) {
              this.tradeLog.push("warn", `Defense mode: position data still abnormal: ${health.issues.join(",")}`);
            }
          } else {
            this.tradeLog.push("warn", "Defense mode: REST returned empty account snapshot");
          }
        }

        // Also attempt margin-mode repair in defense mode (StandX).
        if (this.exchange.id === "standx") {
          await this.ensureStandxIsolatedMarginMode();
        }

        // Continuously refresh orders via REST and best-effort cancel all to avoid orphaned orders.
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
              this.tradeLog.push("warn", `Defense mode: found ${realOrders.length} open orders, cancelling`);
              await this.defenseCancelAllOrders();
            }
          } catch (error) {
            this.tradeLog.push("error", `Defense mode query-open-orders failed: ${extractMessage(error)}`);
            // Still attempt cancel-all on query failure (prefer over-cancel to orphaned orders).
            await this.defenseCancelAllOrders();
          }
        } else {
          await this.defenseCancelAllOrders();
        }

        // Check stop-loss conditions using latest available account snapshot data.
        // `checkStopLoss` keeps running with the most recently received data.
      } catch (error) {
        this.tradeLog.push("error", `Defense mode REST polling failed: ${extractMessage(error)}`);
      }

      // Continue to next polling cycle.
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
            this.tradeLog.push("info", "Switched to isolated margin mode, resuming strategy");
            return true;
          }
          await this.sleep(STANDX_MARGIN_MODE_CHECK_INTERVAL_MS);
        }
        this.tradeLog.push("warn", `Isolated-mode switch not confirmed, current mode: ${this.getStandxMarginMode(this.accountSnapshot) ?? "unknown"}`);
        return false;
      } catch (error) {
        this.tradeLog.push("error", `Failed to switch to isolated mode: ${extractMessage(error)}`);
        return false;
      } finally {
        this.marginModeEnsuring = null;
      }
    })();

    return await this.marginModeEnsuring;
  }

  /**
   * Stop REST polling in defense mode.
   */
  private stopDefenseRestPoll(): void {
    if (!this.defenseRestPollActive) return;
    this.defenseRestPollActive = false;
    if (this.defenseRestPollTimer) {
      clearTimeout(this.defenseRestPollTimer);
      this.defenseRestPollTimer = null;
    }
    this.tradeLog.push("info", "Defense mode: stop REST data polling");
  }
}

function resolveBinanceSymbol(symbol: string): string {
  const parts = parseSymbolParts(symbol);
  const base = (parts.base ?? symbol).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return base ? `${base}USDT` : "BTCUSDT";
}
