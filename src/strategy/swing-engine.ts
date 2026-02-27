import type { ExchangeAdapter } from "../exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterOrder, AsterTicker } from "../exchanges/types";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { marketClose, placeMarketOrder, placeStopLossOrder, unlockOperating } from "../core/order-coordinator";
import type { OrderLockMap, OrderPendingMap, OrderTimerMap } from "../core/order-coordinator";
import { extractMessage, isRateLimitError, isUnknownOrderError } from "../utils/errors";
import { getPosition, type PositionSnapshot } from "../utils/strategy";
import { computePositionPnl } from "../utils/pnl";
import { getMidOrLast, getTopPrices } from "../utils/price";
import { RateLimitController } from "../core/lib/rate-limit";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { SessionVolumeTracker } from "./common/session-volume";
import { t } from "../i18n";
import { BinanceRsiTracker, type BinanceRsiSnapshot } from "./common/binance-rsi";
import { createInitialSwingState, stepSwing, type SwingState } from "./swing-logic";
import { isOrderActiveStatus } from "../utils/order-status";
import type { SwingConfig } from "../config";

export type SwingRsiZone = "overbought" | "oversold" | "neutral" | "unknown";
export type SwingPhase =
  | "disabled"
  | "initializing"
  | "observing"
  | "waiting_open_short"
  | "waiting_open_long"
  | "waiting_close_short"
  | "waiting_close_long";

export interface SwingEngineSnapshot {
  ready: boolean;
  disabled: boolean;
  symbol: string;
  direction: SwingConfig["direction"];

  lastPrice: number | null;
  phase: SwingPhase;
  binancePrice: number | null;
  rsi: number | null;
  rsiStable: boolean;
  rsiZone: SwingRsiZone;
  binanceConnection: BinanceRsiSnapshot["connectionState"];
  binanceUpdatedAt: number | null;

  armed: Pick<
    SwingState,
    "armedShortEntry" | "armedShortExit" | "armedLongEntry" | "armedLongExit"
  >;

  position: PositionSnapshot;
  pnl: number;
  unrealized: number;
  sessionVolume: number;

  stopLossTarget: number | null;
  stopLossKillSwitch: boolean;

  openOrders: AsterOrder[];
  depth: AsterDepth | null;
  ticker: AsterTicker | null;

  tradeLog: TradeLogEntry[];
  lastUpdated: number | null;
  error: string | null;
}

type SwingEvent = "update";
type SwingListener = (snapshot: SwingEngineSnapshot) => void;

const EPS = 1e-5;

export class SwingEngine {
  private accountSnapshot: AsterAccountSnapshot | null = null;
  private openOrders: AsterOrder[] = [];
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;

  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pending: OrderPendingMap = {};

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<SwingEvent, SwingEngineSnapshot>();
  private readonly sessionVolume = new SessionVolumeTracker();
  private readonly rateLimit: RateLimitController;

  private readonly binanceRsi: BinanceRsiTracker;
  private binanceSnapshot: BinanceRsiSnapshot;

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private disabled = false;
  private lastError: string | null = null;

  private ordersSnapshotReady = false;
  private precisionSync: Promise<void> | null = null;
  private swingState: SwingState = createInitialSwingState();

  // Stop-loss placement de-bounce
  private lastStopAttempt: { side: "BUY" | "SELL" | null; price: number | null; at: number } = {
    side: null,
    price: null,
    at: 0,
  };

  constructor(private readonly config: SwingConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.pollIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );

    this.binanceRsi = new BinanceRsiTracker(
      this.config.signalSymbol,
      this.config.signalInterval,
      this.config.rsiPeriod,
      {
        limit: 500,
        logger: (context, error) => {
          // Keep Binance errors visible but non-fatal.
          this.tradeLog.push("warn", `[Binance] ${context}: ${String(error)}`);
        },
      }
    );
    this.binanceSnapshot = this.binanceRsi.getSnapshot();
    this.binanceRsi.onUpdate((snapshot) => {
      this.binanceSnapshot = snapshot;
      this.emitUpdate();
    });
    this.binanceRsi.start();

    this.syncPrecision();
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.tick();
    }, this.config.pollIntervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Binance tracker is external IO; stop it too.
    this.binanceRsi.stop();
  }

  on(event: SwingEvent, handler: SwingListener): void {
    this.events.on(event, handler);
  }

  off(event: SwingEvent, handler: SwingListener): void {
    this.events.off(event, handler);
  }

  getSnapshot(): SwingEngineSnapshot {
    return this.buildSnapshot();
  }

  private bootstrap(): void {
    const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.accountSnapshot = snapshot;
        const position = getPosition(snapshot, this.config.symbol);
        const reference = this.getReferencePrice();
        this.sessionVolume.update(position, reference);

        // Safe-by-default: refuse short mode on spot accounts.
        if (
          snapshot.marketType === "spot" &&
          (this.config.direction === "short" || this.config.direction === "both")
        ) {
          if (!this.disabled) {
            this.disabled = true;
            this.lastError = "Swing strategy requires perp/margin for shorting; spot accounts cannot short.";
            this.tradeLog.push("error", this.lastError);
          }
        }

        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => t("log.subscribe.accountFail", { error: String(error) }),
        processFail: (error) => t("log.process.accountError", { error: extractMessage(error) }),
      }
    );

    safeSubscribe<AsterOrder[]>(
      this.exchange.watchOrders.bind(this.exchange),
      (orders) => {
        this.synchronizeLocks(orders);
        this.openOrders = Array.isArray(orders)
          ? orders.filter(
              (order) =>
                order.type !== "MARKET" &&
                order.symbol === this.config.symbol &&
                isOrderActiveStatus(order.status)
            )
          : [];
        this.ordersSnapshotReady = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => t("log.subscribe.orderFail", { error: String(error) }),
        processFail: (error) => t("log.process.orderError", { error: extractMessage(error) }),
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
        subscribeFail: (error) => t("log.subscribe.depthFail", { error: String(error) }),
        processFail: (error) => t("log.process.depthError", { error: extractMessage(error) }),
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
        subscribeFail: (error) => t("log.subscribe.tickerFail", { error: String(error) }),
        processFail: (error) => t("log.process.tickerError", { error: extractMessage(error) }),
      }
    );
  }

  private synchronizeLocks(orders: AsterOrder[] | null | undefined): void {
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
      this.accountSnapshot &&
        this.tickerSnapshot &&
        this.depthSnapshot &&
        this.ordersSnapshotReady &&
        this.binanceSnapshot.isStable &&
        this.binanceSnapshot.rsi != null
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
      if (this.disabled) {
        this.emitUpdate();
        return;
      }
      if (!this.isReady()) {
        this.emitUpdate();
        return;
      }

      const account = this.accountSnapshot!;
      const position = getPosition(account, this.config.symbol);
      const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
      const bid = topBid ?? Number(this.tickerSnapshot?.lastPrice);
      const ask = topAsk ?? Number(this.tickerSnapshot?.lastPrice);
      const pnl = computePositionPnl(position, bid, ask);
      const price = this.getReferencePrice();

      const decisionOut = stepSwing(
        this.swingState,
        { direction: this.config.direction, rsiHigh: this.config.rsiHigh, rsiLow: this.config.rsiLow },
        { rsi: this.binanceSnapshot.rsi, positionAmt: position.positionAmt, pnl }
      );
      this.swingState = decisionOut.nextState;

      for (const action of decisionOut.actions) {
        if (action.type === "OPEN_SHORT") {
          await this.tryOpen("SELL", action.reason);
        } else if (action.type === "OPEN_LONG") {
          await this.tryOpen("BUY", action.reason);
        } else if (action.type === "CLOSE_POSITION") {
          await this.tryClose(position, action.reason);
        }
      }

      // Stop-loss management / kill-switch for any open position.
      await this.handleStopLoss(position, price);

      this.sessionVolume.update(position, price);
      this.emitUpdate();
    } catch (error) {
      if (isRateLimitError(error)) {
        hadRateLimit = true;
        this.rateLimit.registerRateLimit("swing");
        this.tradeLog.push("warn", `SwingEngine 429: ${String(error)}`);
      } else {
        this.lastError = extractMessage(error);
        this.tradeLog.push("error", `SwingEngine error: ${this.lastError}`);
      }
      this.emitUpdate();
    } finally {
      try {
        this.rateLimit.onCycleComplete(hadRateLimit);
      } finally {
        this.processing = false;
      }
    }
  }

  private async tryOpen(side: "BUY" | "SELL", reason: string): Promise<void> {
    try {
      // Ensure flat before opening.
      const position = getPosition(this.accountSnapshot, this.config.symbol);
      if (Math.abs(position.positionAmt) > EPS) {
        return;
      }
      await placeMarketOrder(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        side,
        this.config.tradeAmount,
        (type, detail) => this.tradeLog.push(type, detail),
        false,
        {
          markPrice: position.markPrice,
          expectedPrice: Number(this.tickerSnapshot?.lastPrice) || null,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { qtyStep: this.config.qtyStep }
      );
      this.tradeLog.push("open", `${reason}: ${side} (market)`);
    } catch (err) {
      this.tradeLog.push("error", `Open failed: ${extractMessage(err)}`);
    }
  }

  private async tryClose(position: PositionSnapshot, reason: string): Promise<void> {
    try {
      if (Math.abs(position.positionAmt) <= EPS) return;
      const side: "BUY" | "SELL" = position.positionAmt > 0 ? "SELL" : "BUY";
      const expected =
        side === "SELL"
          ? Number(this.depthSnapshot?.bids?.[0]?.[0])
          : Number(this.depthSnapshot?.asks?.[0]?.[0]);
      await marketClose(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        side,
        Math.abs(position.positionAmt),
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          expectedPrice: Number.isFinite(expected) ? expected : Number(this.tickerSnapshot?.lastPrice) || null,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { qtyStep: this.config.qtyStep }
      );
      this.tradeLog.push("close", `${reason}: ${side} (market close)`);
    } catch (err) {
      if (isUnknownOrderError(err)) {
        this.tradeLog.push("order", "Close skipped: order missing");
      } else {
        this.tradeLog.push("error", `Close failed: ${extractMessage(err)}`);
      }
    }
  }

  private async handleStopLoss(position: PositionSnapshot, referencePrice: number | null): Promise<void> {
    const hasPosition = Math.abs(position.positionAmt) > EPS;
    if (!hasPosition) {
      this.lastStopAttempt = { side: null, price: null, at: 0 };
      return;
    }

    const hasEntryPrice = Number.isFinite(position.entryPrice) && Math.abs(position.entryPrice) > 1e-8;
    if (!hasEntryPrice) {
      return;
    }

    const direction = position.positionAmt > 0 ? "long" : "short";
    const stopSide: "BUY" | "SELL" = direction === "long" ? "SELL" : "BUY";
    const stopPrice =
      direction === "long"
        ? position.entryPrice * (1 - Math.max(0, this.config.stopLossPct))
        : position.entryPrice * (1 + Math.max(0, this.config.stopLossPct));

    const tick = Math.max(1e-9, this.config.priceTick);
    const lastPrice = referencePrice ?? Number(this.tickerSnapshot?.lastPrice) ?? null;

    // Kill-switch (always-on).
    const triggerKill =
      direction === "long"
        ? lastPrice != null && Number.isFinite(lastPrice) && lastPrice <= stopPrice + tick
        : lastPrice != null && Number.isFinite(lastPrice) && lastPrice >= stopPrice - tick;
    if (triggerKill) {
      await this.tryClose(position, "Stop-loss kill-switch");
      return;
    }

    // If exchange supports stop orders, keep one active.
    const currentStop = this.openOrders.find((o) => {
      const hasStopPrice = Number.isFinite(Number(o.stopPrice)) && Number(o.stopPrice) > 0;
      return o.side === stopSide && (o.type === "STOP_MARKET" || hasStopPrice);
    });
    if (currentStop) return;

    // De-bounce: avoid repeated submissions of same stop.
    const now = Date.now();
    if (
      this.lastStopAttempt.side === stopSide &&
      this.lastStopAttempt.price != null &&
      Math.abs(stopPrice - Number(this.lastStopAttempt.price)) < tick &&
      now - this.lastStopAttempt.at < 5000
    ) {
      return;
    }

    try {
      const qty = Math.abs(position.positionAmt);
      await placeStopLossOrder(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        stopSide,
        stopPrice,
        qty,
        lastPrice,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep }
      );
      this.lastStopAttempt = { side: stopSide, price: stopPrice, at: Date.now() };
    } catch (err) {
      this.lastStopAttempt = { side: stopSide, price: stopPrice, at: Date.now() };
      this.tradeLog.push("error", `Failed to place stop-loss order: ${extractMessage(err)}`);
    }
  }

  private emitUpdate(): void {
    try {
      const snapshot = this.buildSnapshot();
      this.events.emit("update", snapshot, (error) => {
        this.tradeLog.push("error", `SwingEngine update handler error: ${String(error)}`);
      });
    } catch (err) {
      this.tradeLog.push("error", `SwingEngine snapshot error: ${String(err)}`);
    }
  }

  private buildSnapshot(): SwingEngineSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const price = this.tickerSnapshot ? Number(this.tickerSnapshot.lastPrice) : null;
    const { topBid, topAsk } = getTopPrices(this.depthSnapshot);
    const pnl = computePositionPnl(position, topBid ?? price, topAsk ?? price);
    const reference = this.getReferencePrice();

    const hasPosition = Math.abs(position.positionAmt) > EPS;
    const hasEntryPrice = Number.isFinite(position.entryPrice) && Math.abs(position.entryPrice) > 1e-8;
    const stopLossTarget = hasPosition && hasEntryPrice
      ? (position.positionAmt > 0
          ? position.entryPrice * (1 - Math.max(0, this.config.stopLossPct))
          : position.entryPrice * (1 + Math.max(0, this.config.stopLossPct)))
      : null;
    const tick = Math.max(1e-9, this.config.priceTick);
    const stopLossKillSwitch =
      stopLossTarget != null && reference != null && Number.isFinite(reference)
        ? (position.positionAmt > 0 ? reference <= stopLossTarget + tick : reference >= stopLossTarget - tick)
        : false;

    const zone: SwingRsiZone =
      this.binanceSnapshot.rsi == null || !Number.isFinite(this.binanceSnapshot.rsi)
        ? "unknown"
        : this.binanceSnapshot.rsi > this.config.rsiHigh
          ? "overbought"
          : this.binanceSnapshot.rsi < this.config.rsiLow
            ? "oversold"
            : "neutral";

    const posAmt = Number(position.positionAmt);
    const phase: SwingPhase = this.disabled
      ? "disabled"
      : !this.isReady()
        ? "initializing"
        : Math.abs(posAmt) <= EPS
          ? this.swingState.armedShortEntry
            ? "waiting_open_short"
            : this.swingState.armedLongEntry
              ? "waiting_open_long"
              : "observing"
          : posAmt < -EPS
            ? this.swingState.armedShortExit
              ? "waiting_close_short"
              : "observing"
            : this.swingState.armedLongExit
              ? "waiting_close_long"
              : "observing";

    return {
      ready: this.isReady() && !this.disabled,
      disabled: this.disabled,
      symbol: this.config.symbol,
      direction: this.config.direction,

      lastPrice: reference,
      phase,
      binancePrice: this.binanceSnapshot.lastClose,
      rsi: this.binanceSnapshot.rsi,
      rsiStable: this.binanceSnapshot.isStable,
      rsiZone: zone,
      binanceConnection: this.binanceSnapshot.connectionState,
      binanceUpdatedAt: this.binanceSnapshot.updatedAt,

      armed: {
        armedShortEntry: this.swingState.armedShortEntry,
        armedShortExit: this.swingState.armedShortExit,
        armedLongEntry: this.swingState.armedLongEntry,
        armedLongExit: this.swingState.armedLongExit,
      },

      position,
      pnl,
      unrealized: position.unrealizedProfit,
      sessionVolume: this.sessionVolume.value,

      stopLossTarget,
      stopLossKillSwitch,

      openOrders: this.openOrders,
      depth: this.depthSnapshot,
      ticker: this.tickerSnapshot,

      tradeLog: this.tradeLog.all(),
      lastUpdated: Date.now(),
      error: this.lastError,
    };
  }

  private getReferencePrice(): number | null {
    return (
      getMidOrLast(this.depthSnapshot, this.tickerSnapshot) ??
      (this.tickerSnapshot ? Number(this.tickerSnapshot.lastPrice) : null)
    );
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
          const delta = Math.abs(precision.priceTick - this.config.priceTick);
          if (delta > 1e-12) {
            this.config.priceTick = precision.priceTick;
            updated = true;
          }
        }
        if (Number.isFinite(precision.qtyStep) && precision.qtyStep > 0) {
          const delta = Math.abs(precision.qtyStep - this.config.qtyStep);
          if (delta > 1e-12) {
            this.config.qtyStep = precision.qtyStep;
            updated = true;
          }
        }
        if (updated) {
          this.tradeLog.push(
            "info",
            `Synced precision: priceTick=${precision.priceTick} qtyStep=${precision.qtyStep}`
          );
        }
      })
      .catch((error) => {
        this.tradeLog.push("error", `Precision sync failed: ${extractMessage(error)}`);
        this.precisionSync = null;
        setTimeout(() => this.syncPrecision(), 2000);
      });
  }
}

