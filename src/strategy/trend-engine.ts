import crypto from "crypto";
import type { TradingConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterOrder,
  AsterTicker,
  AsterDepth,
  AsterKline,
} from "../exchanges/types";
import {
  calcStopLossPrice,
  calcTrailingActivationPrice,
  computeBollingerBandwidth,
  getPosition,
  getSMA,
  type PositionSnapshot,
} from "../utils/strategy";
import { computePositionPnl } from "../utils/pnl";
import { getMidOrLast } from "../utils/price";
import {
  marketClose,
  placeMarketOrder,
  placeStopLossOrder,
  placeTrailingStopOrder,
  unlockOperating,
} from "../core/order-coordinator";
import type { OrderLockMap, OrderPendingMap, OrderTimerMap } from "../core/order-coordinator";
import { extractMessage, isUnknownOrderError } from "../utils/errors";
import { formatPriceToString } from "../utils/math";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { decryptCopyright } from "../utils/copyright";
import { isRateLimitError } from "../utils/errors";
import { RateLimitController } from "../core/lib/rate-limit";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { SessionVolumeTracker } from "./common/session-volume";
import { t } from "../i18n";

export interface TrendEngineSnapshot {
  ready: boolean;
  symbol: string;
  lastPrice: number | null;
  sma30: number | null;
  bollingerBandwidth: number | null;
  trend: "long" | "short" | "none";
  position: PositionSnapshot;
  pnl: number;
  unrealized: number;
  totalProfit: number;
  totalTrades: number;
  sessionVolume: number;
  tradeLog: TradeLogEntry[];
  openOrders: AsterOrder[];
  depth: AsterDepth | null;
  ticker: AsterTicker | null;
  lastUpdated: number | null;
  lastOpenSignal: OpenOrderPlan;
}

export interface OpenOrderPlan {
  side: "BUY" | "SELL" | null;
  price: number | null;
}

type TrendEngineEvent = "update";

type TrendEngineListener = (snapshot: TrendEngineSnapshot) => void;

export class TrendEngine {
  private accountSnapshot: AsterAccountSnapshot | null = null;
  private openOrders: AsterOrder[] = [];
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private klineSnapshot: AsterKline[] = [];

  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pending: OrderPendingMap = {};

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<TrendEngineEvent, TrendEngineSnapshot>();
  private readonly sessionVolume = new SessionVolumeTracker();

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private lastPrice: number | null = null;
  private lastSma30: number | null = null;
  private lastBollingerBandwidth: number | null = null;
  private totalProfit = 0;
  private totalTrades = 0;
  private lastOpenPlan: OpenOrderPlan = { side: null, price: null };
  private cancelAllRequested = false;
  private readonly pendingCancelOrders = new Set<string>();
  private readonly rateLimit: RateLimitController;
  private lastAccountPosition: PositionSnapshot = {
    positionAmt: 0,
    entryPrice: 0,
    unrealizedProfit: 0,
    markPrice: null,
  };
  private pendingRealized: { pnl: number; timestamp: number } | null = null;
  private klineInsufficientLogged = false;
  private klineReadyLogged = false;

  // Entry frequency guard: at most once per minute.
  private lastEntryMinute: number | null = null;
  // Cooldown after stop loss: ignore SMA entry for 60s.
  private lastStopLossAt: number | null = null;
  private lastBollingerBlockLogged = 0;

  private ordersSnapshotReady = false;
  private startupLogged = false;
  private entryPricePendingLogged = false;
  // Track latest stop placement attempt to suppress duplicate submits.
  private lastStopAttempt: { side: "BUY" | "SELL" | null; price: number | null; at: number } = {
    side: null,
    price: null,
    at: 0,
  };
  private readonly copyrightFingerprint = crypto
    .createHash("sha256")
    .update(decryptCopyright())
    .digest("hex");

  private readonly listeners = new Map<TrendEngineEvent, Set<TrendEngineListener>>();
  private precisionSync: Promise<void> | null = null;

  constructor(private readonly config: TradingConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.rateLimit = new RateLimitController(this.config.pollIntervalMs, (type, detail) =>
      this.tradeLog.push(type, detail)
    );
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
  }

  on(event: TrendEngineEvent, handler: TrendEngineListener): void {
    this.events.on(event, handler);
  }

  off(event: TrendEngineEvent, handler: TrendEngineListener): void {
    this.events.off(event, handler);
  }

  getSnapshot(): TrendEngineSnapshot {
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
        this.trackPositionLifecycle(position, reference);
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
        const isActive = (status: string | undefined) => {
          if (!status) return true;
          const normalized = status.toLowerCase();
          return normalized !== "filled" && normalized !== "canceled" && normalized !== "cancelled";
        };
        this.openOrders = Array.isArray(orders)
          ? orders.filter(
              (order) =>
                order.type !== "MARKET" && order.symbol === this.config.symbol && isActive(order.status)
            )
          : [];
        const currentIds = new Set(this.openOrders.map((order) => String(order.orderId)));
        for (const id of Array.from(this.pendingCancelOrders)) {
          if (!currentIds.has(id)) {
            this.pendingCancelOrders.delete(id);
          }
        }
        if (this.openOrders.length === 0 || this.pendingCancelOrders.size === 0) {
          this.cancelAllRequested = false;
        }
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

    safeSubscribe<AsterKline[]>(
      this.exchange.watchKlines.bind(this.exchange, this.config.symbol, this.config.klineInterval),
      (klines) => {
        this.klineSnapshot = Array.isArray(klines) ? klines : [];
        const latestSma = getSMA(this.klineSnapshot, 30);
        this.lastSma30 = latestSma;
        this.logKlineSnapshot();
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => t("log.kline.subscribeFail", { error: String(error) }),
        processFail: (error) => t("log.kline.processError", { error: extractMessage(error) }),
      }
    );
  }

  private synchronizeLocks(orders: AsterOrder[] | null | undefined): void {
    const list = Array.isArray(orders) ? orders : [];
    Object.keys(this.pending).forEach((type) => {
      const pendingId = this.pending[type];
      if (!pendingId) return;
      const match = list.find((order) => String(order.orderId) === pendingId);
      if (!match || (match.status && match.status !== "NEW")) {
        unlockOperating(this.locks, this.timers, this.pending, type);
      }
    });
  }

  private isReady(): boolean {
    const minKlines = Math.max(30, this.config.bollingerLength);
    return Boolean(
      this.accountSnapshot &&
        this.tickerSnapshot &&
        this.depthSnapshot &&
        this.klineSnapshot.length >= minKlines
    );
  }

  private logKlineSnapshot(): void {
    const minKlines = Math.max(30, this.config.bollingerLength);
    const count = this.klineSnapshot.length;
    if (count < minKlines) {
      if (!this.klineInsufficientLogged) {
        const closes = this.klineSnapshot.slice(-5).map((k) => Number(k.close).toFixed(2));
        this.tradeLog.push(
          "info",
          t("log.trend.klineInsufficient", {
            count,
            min: minKlines,
            recentCount: closes.length,
            recent: closes.join(", "),
          })
        );
        this.klineInsufficientLogged = true;
      }
      return;
    }
    if (!this.klineReadyLogged) {
      const closes = this.klineSnapshot.slice(-5).map((k) => Number(k.close).toFixed(2));
      this.tradeLog.push(
        "info",
        t("log.trend.klineReady", { count, recent: closes.join(", ") })
      );
      this.klineReadyLogged = true;
    }
    this.klineInsufficientLogged = false;
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
      if (!this.ordersSnapshotReady) {
        this.emitUpdate();
        return;
      }
      if (!this.isReady()) {
        this.emitUpdate();
        return;
      }
      this.logStartupState();
      const sma30 = getSMA(this.klineSnapshot, 30);
      if (sma30 == null) {
        return;
      }
      const bollingerBandwidth = computeBollingerBandwidth(
        this.klineSnapshot,
        this.config.bollingerLength,
        this.config.bollingerStdMultiplier
      );
      this.lastBollingerBandwidth = bollingerBandwidth;
      const ticker = this.tickerSnapshot!;
      const price = Number(ticker.lastPrice);
      const position = getPosition(this.accountSnapshot, this.config.symbol);

      if (Math.abs(position.positionAmt) < 1e-5) {
        if (!this.rateLimit.shouldBlockEntries()) {
          await this.handleOpenPosition(price, sma30, bollingerBandwidth);
        }
      } else {
        const result = await this.handlePositionManagement(position, price);
        if (result.closed) {
          this.pendingRealized = { pnl: result.pnl, timestamp: Date.now() };
        }
      }

      this.sessionVolume.update(position, price);
      this.trackPositionLifecycle(position, price);
      this.lastSma30 = sma30;
      this.lastPrice = price;
      this.emitUpdate();
    } catch (error) {
      if (isRateLimitError(error)) {
        hadRateLimit = true;
        this.rateLimit.registerRateLimit("trend");
        await this.enforceRateLimitStop();
        this.tradeLog.push("warn", t("log.trend.rateLimit429", { error: String(error) }));
      } else {
        this.tradeLog.push("error", t("log.trend.loopError", { error: String(error) }));
      }
      this.emitUpdate();
    } finally {
      try {
        this.rateLimit.onCycleComplete(hadRateLimit);
      } catch (rateLimitError) {
        this.tradeLog.push("error", t("log.trend.rateLimitUpdateError", { error: String(rateLimitError) }));
      } finally {
        this.processing = false;
      }
    }
  }

  private async enforceRateLimitStop(): Promise<void> {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    if (Math.abs(position.positionAmt) < 1e-5) return;
    const price = this.getReferencePrice();
    if (!Number.isFinite(price) || price == null) return;
    const result = await this.handlePositionManagement(position, Number(price));
    if (result.closed) {
      this.pendingRealized = { pnl: result.pnl, timestamp: Date.now() };
    }
  }

  private logStartupState(): void {
    if (this.startupLogged) return;
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const hasPosition = Math.abs(position.positionAmt) > 1e-5;
    if (hasPosition) {
      this.tradeLog.push(
        "info",
        t("log.trend.detectPosition", {
          direction: position.positionAmt > 0 ? t("common.direction.long") : t("common.direction.short"),
          amount: Math.abs(position.positionAmt).toFixed(4),
          price: position.entryPrice.toFixed(2),
        })
      );
    }
    if (this.openOrders.length > 0) {
      this.tradeLog.push("info", t("log.trend.detectOrders", { count: this.openOrders.length }));
    }
    this.startupLogged = true;
  }

  private async handleOpenPosition(
    currentPrice: number,
    currentSma: number,
    currentBandwidth: number | null
  ): Promise<void> {
    this.entryPricePendingLogged = false;
    const now = Date.now();
    const currentMinute = Math.floor(now / 60_000);
    // Stop-loss cooldown: block SMA cross entries for 60s.
    if (this.lastStopLossAt != null && now - this.lastStopLossAt < 60_000) {
      const remaining = Math.max(0, 60_000 - (now - this.lastStopLossAt));
      this.tradeLog.push("info", t("log.trend.stopCooldown", { seconds: (remaining / 1000).toFixed(0) }));
      return;
    }
    // Allow only one entry in the same minute.
    if (this.lastEntryMinute != null && this.lastEntryMinute === currentMinute) {
      this.tradeLog.push("info", t("log.trend.alreadyEntered"));
      return;
    }
    if (
      Number.isFinite(currentBandwidth) &&
      this.config.minBollingerBandwidth > 0 &&
      Number(currentBandwidth) < this.config.minBollingerBandwidth
    ) {
      if (now - this.lastBollingerBlockLogged > 15_000) {
        this.tradeLog.push(
          "info",
          t("log.trend.bandwidthBlocked", {
            bandwidth: Number(currentBandwidth).toFixed(4),
            minBandwidth: this.config.minBollingerBandwidth,
          })
        );
        this.lastBollingerBlockLogged = now;
      }
      return;
    }
    if (this.lastPrice == null) {
      this.lastPrice = currentPrice;
      return;
    }
    if (this.openOrders.length > 0 && !this.cancelAllRequested) {
      try {
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        this.cancelAllRequested = true;
        // Clear local order/cancel queues to avoid acting on stale snapshots.
        this.pendingCancelOrders.clear();
        this.openOrders = [];
      } catch (err) {
        if (isUnknownOrderError(err)) {
          this.tradeLog.push("order", t("log.trend.cancelMissing"));
          this.cancelAllRequested = true;
          // Keep behavior aligned with successful cancel path: clear local cache immediately.
          this.pendingCancelOrders.clear();
          this.openOrders = [];
        } else {
          this.tradeLog.push("error", t("log.trend.cancelFail", { error: String(err) }));
          this.cancelAllRequested = false;
        }
      }
    }
    if (this.lastPrice > currentSma && currentPrice < currentSma) {
      await this.submitMarketOrder("SELL", currentPrice, t("log.trend.crossDown"));
      this.lastEntryMinute = currentMinute;
    } else if (this.lastPrice < currentSma && currentPrice > currentSma) {
      await this.submitMarketOrder("BUY", currentPrice, t("log.trend.crossUp"));
      this.lastEntryMinute = currentMinute;
    }
  }

  private async submitMarketOrder(side: "BUY" | "SELL", price: number, reason: string): Promise<void> {
    try {
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
          markPrice: getPosition(this.accountSnapshot, this.config.symbol).markPrice,
          expectedPrice: Number(this.tickerSnapshot?.lastPrice) || null,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { qtyStep: this.config.qtyStep }
      );
      this.tradeLog.push("open", `${reason}: ${side} @ ${price}`);
      this.lastOpenPlan = { side, price };
    } catch (err) {
      this.tradeLog.push("error", t("log.trend.marketOrderFail", { error: String(err) }));
    }
  }

  private async handlePositionManagement(
    position: PositionSnapshot,
    price: number
  ): Promise<{ closed: boolean; pnl: number }> {
    const hasEntryPrice = Number.isFinite(position.entryPrice) && Math.abs(position.entryPrice) > 1e-8;
    if (!hasEntryPrice) {
      if (!this.entryPricePendingLogged) {
        this.tradeLog.push("info", t("log.trend.entryPricePending"));
        this.entryPricePendingLogged = true;
      }
      return { closed: false, pnl: position.unrealizedProfit };
    }
    this.entryPricePendingLogged = false;
    const direction = position.positionAmt > 0 ? "long" : "short";
    const qtyAbs = Math.abs(position.positionAmt);
    const depthBid = Number(this.depthSnapshot?.bids?.[0]?.[0]);
    const depthAsk = Number(this.depthSnapshot?.asks?.[0]?.[0]);
    const closeSidePriceRaw = direction === "long" ? depthBid : depthAsk;
    const effectiveClosePrice = Number.isFinite(closeSidePriceRaw)
      ? closeSidePriceRaw
      : Number.isFinite(price)
        ? price
        : position.entryPrice;
    const pnl =
      qtyAbs > 0
        ? (direction === "long"
            ? effectiveClosePrice - position.entryPrice
            : position.entryPrice - effectiveClosePrice) * qtyAbs
        : 0;
    const unrealized = Number.isFinite(position.unrealizedProfit)
      ? position.unrealizedProfit
      : null;
    const stopSide = direction === "long" ? "SELL" : "BUY";
    const stopPrice = calcStopLossPrice(
      position.entryPrice,
      Math.abs(position.positionAmt),
      direction,
      this.config.lossLimit
    );
    const activationPrice = calcTrailingActivationPrice(
      position.entryPrice,
      Math.abs(position.positionAmt),
      direction,
      this.config.trailingProfit
    );

    // On some venues (e.g. Lighter), trigger orders may appear as LIMIT with stopPrice.
    // Treat same-side orders with valid stopPrice as the active stop order.
    const currentStop = this.openOrders.find((o) => {
      const hasStopPrice = Number.isFinite(Number(o.stopPrice)) && Number(o.stopPrice) > 0;
      return o.side === stopSide && (o.type === "STOP_MARKET" || hasStopPrice);
    });
    const currentTrailing = this.openOrders.find(
      (o) => o.type === "TRAILING_STOP_MARKET" && o.side === stopSide
    );

    // Stepwise profit lock: move stop each time profit increases by profitLockOffsetUsd.
    {
      const tick = Math.max(1e-9, this.config.priceTick);
      const qtyAbs = Math.abs(position.positionAmt);
      const stepUsd = Math.max(0, this.config.profitLockOffsetUsd);
      const triggerUsd = Math.max(0, this.config.profitLockTriggerUsd);
      const trailingActivateFromOrderRaw = currentTrailing?.activatePrice ?? (currentTrailing as any)?.activationPrice;
      const trailingActivateFromOrder = Number(trailingActivateFromOrderRaw);
      const trailingActivate = Number.isFinite(trailingActivateFromOrder)
        ? trailingActivateFromOrder
        : activationPrice;

      // Check trailing activation: long price >= activate; short price <= activate.
      const trailingActivated =
        direction === "long"
          ? Number.isFinite(trailingActivate) && price >= trailingActivate - tick
          : Number.isFinite(trailingActivate) && price <= trailingActivate + tick;

      // Apply stepwise stop movement only before trailing stop is active.
      if (!trailingActivated && qtyAbs > 0 && stepUsd > 0) {
        const basisProfit = Number.isFinite(unrealized ?? pnl) ? Math.max(pnl, unrealized ?? pnl) : pnl;
        if (basisProfit >= triggerUsd) {
          const over = basisProfit - triggerUsd;
          const steps = 1 + Math.floor(over / stepUsd);
          const stepPx = stepUsd / qtyAbs;
          const rawTarget = direction === "long"
            ? position.entryPrice + steps * stepPx
            : position.entryPrice - steps * stepPx;
          let targetStop = Number(formatPriceToString(rawTarget, Math.max(0, Math.floor(Math.log10(1 / this.config.priceTick)))));

          // Do not move beyond trailing activation price.
          if (Number.isFinite(trailingActivate)) {
            if (stopSide === "SELL" && targetStop >= trailingActivate - tick) {
              // Reached activation boundary; stop moving further.
              targetStop = Math.min(targetStop, trailingActivate - tick);
              // Skip if no further improvement is possible.
              const existingRaw = Number(currentStop?.stopPrice);
              const existingPrice = Number.isFinite(existingRaw) ? existingRaw : NaN;
              const canImprove =
                !Number.isFinite(existingPrice) ||
                (stopSide === "SELL" && targetStop >= existingPrice + tick);
              if (!canImprove) {
                // Skip directly.
                // no-op
              } else if (currentStop) {
                await this.tryReplaceStop(stopSide, currentStop, targetStop, price);
              } else {
                await this.tryPlaceStopLoss(stopSide, targetStop, price);
              }
            } else if (stopSide === "BUY" && targetStop <= trailingActivate + tick) {
              targetStop = Math.max(targetStop, trailingActivate + tick);
              const existingRaw = Number(currentStop?.stopPrice);
              const existingPrice = Number.isFinite(existingRaw) ? existingRaw : NaN;
              const canImprove =
                !Number.isFinite(existingPrice) ||
                (stopSide === "BUY" && targetStop <= existingPrice - tick);
              if (!canImprove) {
                // no-op
              } else if (currentStop) {
                await this.tryReplaceStop(stopSide, currentStop, targetStop, price);
              } else {
                await this.tryPlaceStopLoss(stopSide, targetStop, price);
              }
            } else {
              // Normal range; must not conflict with current price direction.
              const validForSide =
                (stopSide === "SELL" && targetStop <= price - tick) ||
                (stopSide === "BUY" && targetStop >= price + tick);
              if (validForSide) {
                if (!currentStop) {
                  await this.tryPlaceStopLoss(stopSide, targetStop, price);
                } else {
                  const existingRaw = Number(currentStop.stopPrice);
                  const existingPrice = Number.isFinite(existingRaw) ? existingRaw : NaN;
                  const improves =
                    !Number.isFinite(existingPrice) ||
                    (stopSide === "SELL" && targetStop >= existingPrice + tick) ||
                    (stopSide === "BUY" && targetStop <= existingPrice - tick);
                  if (improves) {
                    await this.tryReplaceStop(stopSide, currentStop, targetStop, price);
                  }
                }
              }
            }
          } else {
            // If trailing activation is unavailable, use normal step logic only.
            const validForSide =
              (stopSide === "SELL" && targetStop <= price - tick) ||
              (stopSide === "BUY" && targetStop >= price + tick);
            if (validForSide) {
              if (!currentStop) {
                await this.tryPlaceStopLoss(stopSide, targetStop, price);
              } else {
                const existingRaw = Number(currentStop.stopPrice);
                const existingPrice = Number.isFinite(existingRaw) ? existingRaw : NaN;
                const improves =
                  !Number.isFinite(existingPrice) ||
                  (stopSide === "SELL" && targetStop >= existingPrice + tick) ||
                  (stopSide === "BUY" && targetStop <= existingPrice - tick);
                if (improves) {
                  await this.tryReplaceStop(stopSide, currentStop, targetStop, price);
                }
              }
            }
          }
        }
      }
    }

    if (!currentStop) {
      await this.tryPlaceStopLoss(
        stopSide,
        Number(
          formatPriceToString(
            stopPrice,
            Math.max(0, Math.floor(Math.log10(1 / this.config.priceTick)))
          )
        ),
        price
      );
    }

    if (!currentTrailing && this.exchange.supportsTrailingStops()) {
      await this.tryPlaceTrailingStop(
        stopSide,
        Number(formatPriceToString(activationPrice, Math.max(0, Math.floor(Math.log10(1 / this.config.priceTick))))),
        Math.abs(position.positionAmt)
      );
    }

    const derivedLoss = pnl < -this.config.lossLimit;
    const snapshotLoss = derivedLoss;

    if (derivedLoss || snapshotLoss) {
      const result = { closed: false, pnl };
      try {
        if (this.openOrders.length > 0) {
          const orderIdList = this.openOrders.map((order) => order.orderId);
          const orderIdSet = new Set(orderIdList.map(String));
          try {
            await this.exchange.cancelOrders({ symbol: this.config.symbol, orderIdList });
            orderIdSet.forEach((id) => this.pendingCancelOrders.add(id));
          } catch (err) {
            if (isUnknownOrderError(err)) {
              this.tradeLog.push("order", t("log.trend.stopPreCancelMissing"));
                // Clean local cache to avoid repeated cancel attempts.
                for (const id of orderIdSet) {
                  this.pendingCancelOrders.delete(id);
                }
                this.openOrders = this.openOrders.filter((o) => !orderIdSet.has(String(o.orderId)));
            } else {
              throw err;
            }
          }
        }
        // Price-deviation guard: only market-close within configured mark deviation.
        const mark = getPosition(this.accountSnapshot, this.config.symbol).markPrice;
        const limitPct = this.config.maxCloseSlippagePct;
        const sideIsSell = direction === "long";
        const depthBid = Number(this.depthSnapshot?.bids?.[0]?.[0]);
        const depthAsk = Number(this.depthSnapshot?.asks?.[0]?.[0]);
        const closeSidePrice = sideIsSell ? depthBid : depthAsk;
        if (mark != null && Number.isFinite(mark) && mark > 0 && Number.isFinite(closeSidePrice)) {
          const pctDiff = Math.abs(closeSidePrice - mark) / mark;
          if (pctDiff > limitPct) {
            this.tradeLog.push(
              "info",
              t("log.trend.marketCloseGuard", {
                closePx: Number(closeSidePrice).toFixed(2),
                mark: mark.toFixed(2),
                pctDiff: (pctDiff * 100).toFixed(2),
                limitPct: (limitPct * 100).toFixed(2),
              })
            );
            return { closed: false, pnl };
          }
        }
        await marketClose(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pending,
          direction === "long" ? "SELL" : "BUY",
          Math.abs(position.positionAmt),
          (type, detail) => this.tradeLog.push(type, detail),
          {
            markPrice: getPosition(this.accountSnapshot, this.config.symbol).markPrice,
            expectedPrice: Number(
              direction === "long"
                ? this.depthSnapshot?.bids?.[0]?.[0]
                : this.depthSnapshot?.asks?.[0]?.[0]
            ) || null,
            maxPct: this.config.maxCloseSlippagePct,
          },
          { qtyStep: this.config.qtyStep }
        );
        result.closed = true;
        this.tradeLog.push("close", t("log.trend.stopClose", { side: direction === "long" ? "SELL" : "BUY" }));
        // Record stop-loss timestamp to suppress immediate re-entry.
        this.lastStopLossAt = Date.now();
      } catch (err) {
        if (isUnknownOrderError(err)) {
          this.tradeLog.push("order", t("log.trend.targetStopMissing"));
        } else {
          this.tradeLog.push("error", t("log.trend.stopCloseFail", { error: String(err) }));
        }
        return result;
      }
      return result;
    }

    return { closed: false, pnl };
  }

  private async tryPlaceStopLoss(
    side: "BUY" | "SELL",
    stopPrice: number,
    lastPrice: number
  ): Promise<void> {
    // Short debounce: avoid duplicate same-price/same-side stop submits.
    const tick = Math.max(1e-9, this.config.priceTick);
    const now = Date.now();
    if (
      this.lastStopAttempt.side === side &&
      this.lastStopAttempt.price != null &&
      Math.abs(stopPrice - Number(this.lastStopAttempt.price)) < tick &&
      now - this.lastStopAttempt.at < 5000
    ) {
      // Skip duplicate same-side/same-price attempt within 5 seconds.
      return;
    }
    try {
      const position = getPosition(this.accountSnapshot, this.config.symbol);
      const quantity = Math.abs(position.positionAmt);
      const minQty = this.config.qtyStep > 0 ? this.config.qtyStep / 2 : 1e-12;
      if (quantity <= minQty) {
        return;
      }
      await placeStopLossOrder(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        side,
        stopPrice,
        quantity,
        lastPrice,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep }
      );
      this.lastStopAttempt = { side, price: stopPrice, at: Date.now() };
    } catch (err) {
      this.tradeLog.push("error", t("log.trend.placeStopFail", { error: String(err) }));
      // Record attempt to prevent immediate retrigger after error.
      this.lastStopAttempt = { side, price: stopPrice, at: Date.now() };
    }
  }

  private async tryReplaceStop(
    side: "BUY" | "SELL",
    currentOrder: AsterOrder,
    nextStopPrice: number,
    lastPrice: number
  ): Promise<void> {
    // Pre-check: SELL stop must be below current price; BUY stop must be above.
    const invalidForSide =
      (side === "SELL" && nextStopPrice >= lastPrice) ||
      (side === "BUY" && nextStopPrice <= lastPrice);
    if (invalidForSide) {
      // Skip when target stop conflicts with market to avoid cancel/recreate loops.
      return;
    }
    const existingStopPrice = Number(currentOrder.stopPrice);
    try {
      await this.exchange.cancelOrder({ symbol: this.config.symbol, orderId: currentOrder.orderId });
    } catch (err) {
      if (isUnknownOrderError(err)) {
        this.tradeLog.push("order", t("log.trend.stopMissingSkip"));
        // Order no longer exists; remove local record to avoid repeated matches.
        this.openOrders = this.openOrders.filter((o) => o.orderId !== currentOrder.orderId);
      } else {
        this.tradeLog.push("error", t("log.trend.cancelStopFail", { error: String(err) }));
      }
    }
    // Log stop movement only after new stop order is placed successfully.
    try {
      const position = getPosition(this.accountSnapshot, this.config.symbol);
      const quantity = Math.abs(position.positionAmt);
      const minQty = this.config.qtyStep > 0 ? this.config.qtyStep / 2 : 1e-12;
      if (quantity <= minQty) {
        return;
      }
      const order = await placeStopLossOrder(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        side,
        nextStopPrice,
        quantity,
        lastPrice,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: position.markPrice,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep }
      );
      if (order) {
        this.tradeLog.push(
          "stop",
          t("log.trend.moveStop", {
            price: formatPriceToString(
              nextStopPrice,
              Math.max(0, Math.floor(Math.log10(1 / this.config.priceTick)))
            ),
          })
        );
      }
    } catch (err) {
      this.tradeLog.push("error", t("log.trend.moveStopFail", { error: String(err) }));
      // Rollback strategy: restore original stop to avoid unprotected gap.
      try {
        const position = getPosition(this.accountSnapshot, this.config.symbol);
        const quantity = Math.abs(position.positionAmt);
        const minQty = this.config.qtyStep > 0 ? this.config.qtyStep / 2 : 1e-12;
        if (quantity <= minQty) {
          return;
        }
        const restoreInvalid =
          (side === "SELL" && existingStopPrice >= lastPrice) ||
          (side === "BUY" && existingStopPrice <= lastPrice);
        if (!restoreInvalid) {
          const restored = await placeStopLossOrder(
            this.exchange,
            this.config.symbol,
            this.openOrders,
            this.locks,
            this.timers,
            this.pending,
            side,
            existingStopPrice,
            quantity,
            lastPrice,
            (t, d) => this.tradeLog.push(t, d),
            {
              markPrice: position.markPrice,
              maxPct: this.config.maxCloseSlippagePct,
            },
            { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep }
          );
          if (restored) {
            this.tradeLog.push(
              "order",
              t("log.trend.restoreStop", {
                price: formatPriceToString(
                  existingStopPrice,
                  Math.max(0, Math.floor(Math.log10(1 / this.config.priceTick)))
                ),
              })
            );
          }
        }
      } catch (recoverErr) {
        this.tradeLog.push("error", t("log.trend.restoreStopFail", { error: String(recoverErr) }));
      }
    }
  }

  private async tryPlaceTrailingStop(
    side: "BUY" | "SELL",
    activationPrice: number,
    quantity: number
  ): Promise<void> {
    if (!this.exchange.supportsTrailingStops()) {
      return;
    }
    try {
      await placeTrailingStopOrder(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pending,
        side,
        activationPrice,
        quantity,
        this.config.trailingCallbackRate,
        (type, detail) => this.tradeLog.push(type, detail),
        {
          markPrice: getPosition(this.accountSnapshot, this.config.symbol).markPrice,
          maxPct: this.config.maxCloseSlippagePct,
        },
        { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep }
      );
    } catch (err) {
      this.tradeLog.push("error", t("log.trend.trailingFail", { error: String(err) }));
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
            t("log.trend.precisionSynced", { priceTick: precision.priceTick, qtyStep: precision.qtyStep })
          );
        }
      })
      .catch((error) => {
        this.tradeLog.push("error", t("log.trend.precisionFailed", { error: extractMessage(error) }));
        this.precisionSync = null;
        setTimeout(() => this.syncPrecision(), 2000);
      });
  }

  private emitUpdate(): void {
    try {
      const snapshot = this.buildSnapshot();
      this.events.emit("update", snapshot, (error) => {
        this.tradeLog.push("error", t("log.trend.updateHandlerError", { error: String(error) }));
      });
    } catch (err) {
      this.tradeLog.push("error", t("log.trend.snapshotDispatchError", { error: String(err) }));
    }
  }

  private buildSnapshot(): TrendEngineSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const price = this.tickerSnapshot ? Number(this.tickerSnapshot.lastPrice) : null;
    const sma30 = this.lastSma30;
    const trend = price == null || sma30 == null
      ? "none"
      : price > sma30
      ? "long"
      : price < sma30
      ? "short"
      : "none";
    const pnl = price != null ? computePositionPnl(position, price, price) : 0;
    return {
      ready: this.isReady(),
      symbol: this.config.symbol,
      lastPrice: price,
      sma30,
      bollingerBandwidth: this.lastBollingerBandwidth,
      trend,
      position,
      pnl,
      unrealized: position.unrealizedProfit,
      totalProfit: this.totalProfit,
      totalTrades: this.totalTrades,
      sessionVolume: this.sessionVolume.value,
      tradeLog: this.tradeLog.all(),
      openOrders: this.openOrders,
      depth: this.depthSnapshot,
      ticker: this.tickerSnapshot,
      lastUpdated: Date.now(),
      lastOpenSignal: this.lastOpenPlan,
    };
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot) ?? (this.lastPrice != null && Number.isFinite(this.lastPrice) ? this.lastPrice : null);
  }

  private trackPositionLifecycle(position: PositionSnapshot, referencePrice: number | null): void {
    const prev = this.lastAccountPosition;
    const prevExposure = Math.abs(prev.positionAmt) > 1e-5;
    const currentExposure = Math.abs(position.positionAmt) > 1e-5;
    const signChanged =
      prevExposure && currentExposure && Math.sign(prev.positionAmt) !== Math.sign(position.positionAmt);

    if (prevExposure && (!currentExposure || signChanged)) {
      let realized: number | null = this.pendingRealized?.pnl ?? null;
      if (!Number.isFinite(realized)) {
        realized = this.estimateRealizedPnl(prev, referencePrice);
      }
      if (Number.isFinite(realized)) {
        this.totalTrades += 1;
        this.totalProfit += realized ?? 0;
      }
      this.pendingRealized = null;
    }

    if (!prevExposure && currentExposure) {
      this.pendingRealized = null;
    }

    this.lastAccountPosition = {
      positionAmt: position.positionAmt,
      entryPrice: position.entryPrice,
      unrealizedProfit: position.unrealizedProfit,
      markPrice: position.markPrice,
    };
  }

  private estimateRealizedPnl(position: PositionSnapshot, referencePrice: number | null): number {
    const fallbackPrice =
      referencePrice ??
      this.getReferencePrice() ??
      (this.lastPrice != null && Number.isFinite(this.lastPrice) ? this.lastPrice : position.entryPrice);
    if (!Number.isFinite(fallbackPrice)) {
      return 0;
    }
    return computePositionPnl(position, fallbackPrice, fallbackPrice);
  }

}
