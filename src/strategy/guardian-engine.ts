import type { TradingConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type { AsterAccountSnapshot, AsterOrder, AsterTicker } from "../exchanges/types";
import {
  calcStopLossPrice,
  calcTrailingActivationPrice,
  getPosition,
  type PositionSnapshot,
} from "../utils/strategy";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import {
  placeStopLossOrder,
  placeTrailingStopOrder,
  unlockOperating,
} from "../core/order-coordinator";
import type { OrderLockMap, OrderPendingMap, OrderTimerMap } from "../core/order-coordinator";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { extractMessage, isUnknownOrderError } from "../utils/errors";
import { formatPriceToString } from "../utils/math";
import { computePositionPnl } from "../utils/pnl";
import { t } from "../i18n";

export interface GuardianEngineSnapshot {
  ready: boolean;
  symbol: string;
  lastPrice: number | null;
  position: PositionSnapshot;
  pnl: number;
  unrealized: number;
  targetStopPrice: number | null;
  trailingActivationPrice: number | null;
  stopOrder: AsterOrder | null;
  trailingOrder: AsterOrder | null;
  requiresStop: boolean;
  tradeLog: TradeLogEntry[];
  openOrders: AsterOrder[];
  lastUpdated: number | null;
  guardStatus: "idle" | "protecting" | "pending";
}

type GuardianEngineEvent = "update";
type GuardianEngineListener = (snapshot: GuardianEngineSnapshot) => void;

export class GuardianEngine {
  private accountSnapshot: AsterAccountSnapshot | null = null;
  private openOrders: AsterOrder[] = [];
  private tickerSnapshot: AsterTicker | null = null;

  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pending: OrderPendingMap = {};

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<GuardianEngineEvent, GuardianEngineSnapshot>();

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private ordersSnapshotReady = false;
  private entryPricePendingLogged = false;
  private priceUnavailableLogged = false;
  private readonly lastStopAttempt: { side: "BUY" | "SELL" | null; price: number | null; at: number } = {
    side: null,
    price: null,
    at: 0,
  };
  private precisionSync: Promise<void> | null = null;

  constructor(private readonly config: TradingConfig, private readonly exchange: ExchangeAdapter) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
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

  on(event: GuardianEngineEvent, handler: GuardianEngineListener): void {
    this.events.on(event, handler);
  }

  off(event: GuardianEngineEvent, handler: GuardianEngineListener): void {
    this.events.off(event, handler);
  }

  getSnapshot(): GuardianEngineSnapshot {
    return this.buildSnapshot();
  }

  private bootstrap(): void {
    const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.accountSnapshot = snapshot;
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
                order.symbol === this.config.symbol &&
                order.type !== "MARKET" &&
                isActive(order.status)
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
      if (!match || (match.status && match.status !== "NEW")) {
        unlockOperating(this.locks, this.timers, this.pending, type);
      }
    });
  }

  private isReady(): boolean {
    return Boolean(this.accountSnapshot && this.tickerSnapshot);
  }

  private async tick(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      if (!this.ordersSnapshotReady || !this.isReady()) {
        return;
      }
      await this.ensureProtection();
    } catch (error) {
      this.tradeLog.push("error", t("log.guardian.executeError", { error: extractMessage(error) }));
    } finally {
      this.processing = false;
      this.emitUpdate();
    }
  }

  private async ensureProtection(): Promise<void> {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const qtyAbs = Math.abs(position.positionAmt);
    const minQty = this.config.qtyStep > 0 ? this.config.qtyStep / 10 : 1e-8;
    if (qtyAbs <= minQty) {
      this.entryPricePendingLogged = false;
      this.priceUnavailableLogged = false;
      await this.cancelProtectiveOrders();
      return;
    }

    const hasEntryPrice = Number.isFinite(position.entryPrice) && Math.abs(position.entryPrice) > 1e-8;
    if (!hasEntryPrice) {
      if (!this.entryPricePendingLogged) {
        this.tradeLog.push("info", t("log.guardian.entryPricePending"));
        this.entryPricePendingLogged = true;
      }
      return;
    }
    this.entryPricePendingLogged = false;

    const price = this.getLastPrice();
    if (!Number.isFinite(price)) {
      if (!this.priceUnavailableLogged) {
        this.tradeLog.push("info", t("log.guardian.pricePending"));
        this.priceUnavailableLogged = true;
      }
      return;
    }
    this.priceUnavailableLogged = false;

    const direction = position.positionAmt > 0 ? "long" : "short";
    const stopSide = direction === "long" ? "SELL" : "BUY";
    const stopPriceRaw = calcStopLossPrice(
      position.entryPrice,
      qtyAbs,
      direction,
      this.config.lossLimit
    );
    const activationPriceRaw = calcTrailingActivationPrice(
      position.entryPrice,
      qtyAbs,
      direction,
      this.config.trailingProfit
    );
    if (!Number.isFinite(stopPriceRaw) || !Number.isFinite(activationPriceRaw)) {
      return;
    }
    const decimals = this.resolvePriceDecimals();
    const stopPrice = Number(formatPriceToString(stopPriceRaw, decimals));
    const activationPrice = Number(formatPriceToString(activationPriceRaw, decimals));

    const currentStop = this.findStopOrder(stopSide);
    const currentTrailing = this.findTrailingOrder(stopSide);

    await this.maintainProtection({
      position,
      direction,
      stopSide,
      price: Number(price),
      stopPrice,
      activationPrice,
      currentStop: currentStop ?? undefined,
      currentTrailing: currentTrailing ?? undefined,
    });
  }

  private async maintainProtection(params: {
    position: PositionSnapshot;
    direction: "long" | "short";
    stopSide: "BUY" | "SELL";
    price: number;
    stopPrice: number;
    activationPrice: number;
    currentStop?: AsterOrder;
    currentTrailing?: AsterOrder;
  }): Promise<void> {
    const { position, direction, stopSide, price, stopPrice, activationPrice, currentStop, currentTrailing } = params;

    const qtyAbs = Math.abs(position.positionAmt);
    const depthPrice = price;
    const pnl = qtyAbs > 0
      ? (direction === "long" ? depthPrice - position.entryPrice : position.entryPrice - depthPrice) * qtyAbs
      : 0;
    const unrealized = Number.isFinite(position.unrealizedProfit)
      ? position.unrealizedProfit
      : pnl;

    {
      const tick = Math.max(1e-9, this.config.priceTick);
      const stepUsd = Math.max(0, this.config.profitLockOffsetUsd);
      const triggerUsd = Math.max(0, this.config.profitLockTriggerUsd);
      const trailingActivateFromOrderRaw = currentTrailing?.activatePrice ?? (currentTrailing as any)?.activationPrice;
      const trailingActivateFromOrder = Number(trailingActivateFromOrderRaw);
      const trailingActivate = Number.isFinite(trailingActivateFromOrder)
        ? trailingActivateFromOrder
        : activationPrice;

      const trailingActivated =
        direction === "long"
          ? Number.isFinite(trailingActivate) && price >= trailingActivate - tick
          : Number.isFinite(trailingActivate) && price <= trailingActivate + tick;

      if (!trailingActivated && qtyAbs > 0 && stepUsd > 0) {
        const basisProfit = Number.isFinite(unrealized ?? pnl) ? Math.max(pnl, unrealized ?? pnl) : pnl;
        if (basisProfit >= triggerUsd) {
          const over = basisProfit - triggerUsd;
          const steps = 1 + Math.floor(over / stepUsd);
          const stepPx = stepUsd / qtyAbs;
          const rawTarget = direction === "long"
            ? position.entryPrice + steps * stepPx
            : position.entryPrice - steps * stepPx;
          let targetStop = Number(formatPriceToString(rawTarget, this.resolvePriceDecimals()));

          if (Number.isFinite(trailingActivate)) {
            if (stopSide === "SELL" && targetStop >= trailingActivate - tick) {
              targetStop = Math.min(targetStop, trailingActivate - tick);
              const existingRaw = Number(currentStop?.stopPrice);
              const existingPrice = Number.isFinite(existingRaw) ? existingRaw : NaN;
              const canImprove =
                !Number.isFinite(existingPrice) ||
                (stopSide === "SELL" && targetStop >= existingPrice + tick);
              if (!canImprove) {
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
            }
          } else {
            const existingRaw = Number(currentStop?.stopPrice);
            const existingPrice = Number.isFinite(existingRaw) ? existingRaw : NaN;
            const canImprove =
              !Number.isFinite(existingPrice) ||
              (stopSide === "SELL" && targetStop >= existingPrice + tick) ||
              (stopSide === "BUY" && targetStop <= existingPrice - tick);
            if (!canImprove) {
              // no-op
            } else if (currentStop) {
              await this.tryReplaceStop(stopSide, currentStop, targetStop, price);
            } else {
              await this.tryPlaceStopLoss(stopSide, targetStop, price);
            }
          }
        }
      }
    }

    if (!currentStop) {
      await this.tryPlaceStopLoss(
        stopSide,
        Number(formatPriceToString(stopPrice, this.resolvePriceDecimals())),
        price
      );
    }

    if (!currentTrailing && this.exchange.supportsTrailingStops()) {
      await this.tryPlaceTrailingStop(
        stopSide,
        Number(formatPriceToString(activationPrice, this.resolvePriceDecimals())),
        Math.abs(position.positionAmt)
      );
    }
  }

  private async tryPlaceStopLoss(side: "BUY" | "SELL", stopPrice: number, lastPrice: number): Promise<void> {
    const tick = Math.max(1e-9, this.config.priceTick);
    const now = Date.now();
    if (
      this.lastStopAttempt.side === side &&
      this.lastStopAttempt.price != null &&
      Math.abs(stopPrice - Number(this.lastStopAttempt.price)) < tick &&
      now - this.lastStopAttempt.at < 5000
    ) {
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
      this.lastStopAttempt.side = side;
      this.lastStopAttempt.price = stopPrice;
      this.lastStopAttempt.at = now;
    } catch (err) {
      this.tradeLog.push("error", t("log.guardian.placeStopFail", { error: String(err) }));
      this.lastStopAttempt.side = side;
      this.lastStopAttempt.price = stopPrice;
      this.lastStopAttempt.at = now;
    }
  }

  private async tryReplaceStop(
    side: "BUY" | "SELL",
    currentOrder: AsterOrder,
    nextStopPrice: number,
    lastPrice: number
  ): Promise<void> {
    const invalidForSide =
      (side === "SELL" && nextStopPrice >= lastPrice) ||
      (side === "BUY" && nextStopPrice <= lastPrice);
    if (invalidForSide) {
      return;
    }
    const existingStopPrice = Number(currentOrder.stopPrice);
    try {
      await this.exchange.cancelOrder({ symbol: this.config.symbol, orderId: currentOrder.orderId });
    } catch (err) {
      if (isUnknownOrderError(err)) {
        this.tradeLog.push("order", t("log.guardian.stopMissingSkip"));
        this.openOrders = this.openOrders.filter((o) => o.orderId !== currentOrder.orderId);
      } else {
        this.tradeLog.push("error", t("log.guardian.cancelStopFail", { error: String(err) }));
      }
    }
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
          t("log.guardian.moveStop", {
            price: formatPriceToString(nextStopPrice, this.resolvePriceDecimals()),
          })
        );
      }
    } catch (err) {
      this.tradeLog.push("error", t("log.guardian.moveStopFail", { error: String(err) }));
      try {
        const position = getPosition(this.accountSnapshot, this.config.symbol);
        const quantity = Math.abs(position.positionAmt);
        const minQty = this.config.qtyStep > 0 ? this.config.qtyStep / 2 : 1e-12;
        if (quantity <= minQty) {
          return;
        }
        const restored = await placeStopLossOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pending,
          side,
          Number.isFinite(existingStopPrice) ? existingStopPrice : nextStopPrice,
          quantity,
          lastPrice,
          (type, detail) => this.tradeLog.push(type, detail),
          {
            markPrice: position.markPrice,
            maxPct: this.config.maxCloseSlippagePct,
          },
          { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep }
        );
        if (restored && Number.isFinite(existingStopPrice)) {
          this.tradeLog.push(
            "order",
            t("log.guardian.restoreStop", {
              price: formatPriceToString(existingStopPrice, this.resolvePriceDecimals()),
            })
          );
        }
      } catch (recoverErr) {
        this.tradeLog.push("error", t("log.guardian.restoreStopFail", { error: String(recoverErr) }));
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
      this.tradeLog.push("error", t("log.guardian.trailingFail", { error: String(err) }));
    }
  }

  private async cancelProtectiveOrders(): Promise<void> {
    const protectiveOrders = this.openOrders.filter((order) => this.isProtectiveOrder(order));
    if (!protectiveOrders.length) return;
    const orderIdList = protectiveOrders.map((order) => order.orderId);
    try {
      await this.exchange.cancelOrders({ symbol: this.config.symbol, orderIdList });
      this.tradeLog.push("order", t("log.guardian.cleanupOrders", { ids: orderIdList.join(",") }));
    } catch (err) {
      if (isUnknownOrderError(err)) {
        this.tradeLog.push("order", t("log.guardian.protectiveMissing"));
      } else {
        this.tradeLog.push("error", t("log.guardian.cleanupFail", { error: String(err) }));
      }
    }
  }

  private isProtectiveOrder(order: AsterOrder): boolean {
    if (order.symbol !== this.config.symbol) {
      return false;
    }
    const type = String(order.type ?? "").toUpperCase();
    const hasStopPrice = Number.isFinite(Number(order.stopPrice)) && Number(order.stopPrice) > 0;
    if (type === "TRAILING_STOP_MARKET") {
      return true;
    }
    return type === "STOP_MARKET" || hasStopPrice;
  }

  private findStopOrder(side: "BUY" | "SELL"): AsterOrder | undefined {
    return this.openOrders.find((order) => {
      const hasStopPrice = Number.isFinite(Number(order.stopPrice)) && Number(order.stopPrice) > 0;
      return order.side === side && (order.type === "STOP_MARKET" || hasStopPrice);
    });
  }

  private findTrailingOrder(side: "BUY" | "SELL"): AsterOrder | undefined {
    return this.openOrders.find((order) => order.type === "TRAILING_STOP_MARKET" && order.side === side);
  }

  private getLastPrice(): number | null {
    const price = this.tickerSnapshot ? Number(this.tickerSnapshot.lastPrice) : null;
    return Number.isFinite(price) ? (price as number) : null;
  }

  private buildSnapshot(): GuardianEngineSnapshot {
    const position = getPosition(this.accountSnapshot, this.config.symbol);
    const price = this.getLastPrice();
    const stopSide = position.positionAmt > 0 ? "SELL" : "BUY";
    const stopOrder = Math.abs(position.positionAmt) > 1e-8 ? this.findStopOrder(stopSide) ?? null : null;
    const trailingOrder = Math.abs(position.positionAmt) > 1e-8 ? this.findTrailingOrder(stopSide) ?? null : null;
    const qtyAbs = Math.abs(position.positionAmt);
    const minQty = this.config.qtyStep > 0 ? this.config.qtyStep / 10 : 1e-8;
    const hasPosition = qtyAbs > minQty;
    const targetStopPrice = hasPosition && Number.isFinite(position.entryPrice)
      ? calcStopLossPrice(position.entryPrice, qtyAbs, position.positionAmt > 0 ? "long" : "short", this.config.lossLimit)
      : null;
    const trailingActivationPrice = hasPosition && Number.isFinite(position.entryPrice)
      ? calcTrailingActivationPrice(position.entryPrice, qtyAbs, position.positionAmt > 0 ? "long" : "short", this.config.trailingProfit)
      : null;
    const pnl = price != null ? computePositionPnl(position, price, price) : 0;
    const requiresStop = hasPosition && !stopOrder;
    const guardStatus: GuardianEngineSnapshot["guardStatus"] = hasPosition
      ? requiresStop
        ? "pending"
        : "protecting"
      : "idle";

    return {
      ready: this.isReady() && this.ordersSnapshotReady,
      symbol: this.config.symbol,
      lastPrice: price,
      position,
      pnl,
      unrealized: position.unrealizedProfit,
      targetStopPrice,
      trailingActivationPrice,
      stopOrder,
      trailingOrder,
      requiresStop,
      tradeLog: this.tradeLog.all(),
      openOrders: this.openOrders,
      lastUpdated: Date.now(),
      guardStatus,
    };
  }

  private emitUpdate(): void {
    try {
      const snapshot = this.buildSnapshot();
      this.events.emit("update", snapshot, (error) => {
        this.tradeLog.push("error", t("log.guardian.dispatchError", { error: String(error) }));
      });
    } catch (err) {
      this.tradeLog.push("error", t("log.guardian.snapshotFail", { error: String(err) }));
    }
  }

  private resolvePriceDecimals(): number {
    if (!Number.isFinite(this.config.priceTick) || this.config.priceTick <= 0) {
      return 4;
    }
    const digits = Math.log10(1 / this.config.priceTick);
    if (!Number.isFinite(digits)) {
      return 4;
    }
    return Math.max(0, Math.min(12, Math.floor(digits)));
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
            t("log.guardian.precisionSynced", {
              priceTick: precision.priceTick,
              qtyStep: precision.qtyStep,
            })
          );
        }
      })
      .catch((error) => {
        this.tradeLog.push("error", t("log.guardian.precisionFailed", { error: extractMessage(error) }));
        this.precisionSync = null;
        setTimeout(() => this.syncPrecision(), 2000);
      });
  }
}
