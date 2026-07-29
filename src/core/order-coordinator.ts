import type { ExchangeAdapter } from "../exchanges/adapter";
import type { Order } from "../exchanges/types";
import {
  routeCloseOrder,
  routeLimitOrder,
  routeMarketOrder,
  routeStopOrder,
  routeTrailingStopOrder,
} from "../exchanges/order-router";
import { roundDownToTick, roundQtyDownToStep } from "../utils/math";
import { isUnknownOrderError } from "../utils/errors";
import { isOrderPriceAllowedByMark } from "../utils/strategy";
import { t } from "../i18n";

export type OrderLockMap = Record<string, boolean>;
export type OrderTimerMap = Record<string, ReturnType<typeof setTimeout> | null>;
export type OrderPendingMap = Record<string, string | null>;
export type LogHandler = (type: string, detail: string) => void;

type OrderGuardOptions = {
  markPrice?: number | null;
  expectedPrice?: number | null;
  maxPct?: number;
};

/**
 * Everything about *where* an order goes, fixed for an engine's lifetime.
 * These six values always travelled together as the leading positional
 * parameters of every order function; bundling them keeps call sites readable
 * and makes an argument-order mistake impossible.
 */
export interface OrderContext {
  adapter: ExchangeAdapter;
  symbol: string;
  locks: OrderLockMap;
  timers: OrderTimerMap;
  pendings: OrderPendingMap;
  log: LogHandler;
}

interface OrderRequestBase {
  /** Live orders, used to cancel same-type duplicates before placing. */
  openOrders: Order[];
  side: "BUY" | "SELL";
  /** Rejects the order when its price strays too far from the mark price. */
  guard?: OrderGuardOptions;
  qtyStep?: number;
}

export interface LimitOrderRequest extends OrderRequestBase {
  /** String to preserve the exact tick the caller computed. */
  price: string;
  amount: number;
  reduceOnly?: boolean;
  skipDedupe?: boolean;
  slPrice?: number;
  tpPrice?: number;
  clientOrderId?: string;
}

export interface MarketOrderRequest extends OrderRequestBase {
  amount: number;
  reduceOnly?: boolean;
}

export interface StopLossOrderRequest extends OrderRequestBase {
  stopPrice: number;
  quantity: number;
  /** Latest traded price; the stop is rejected when it is already through it. */
  lastPrice: number | null;
  priceTick?: number;
}

export interface TrailingStopOrderRequest extends OrderRequestBase {
  activationPrice: number;
  quantity: number;
  callbackRate: number;
  priceTick?: number;
}

export interface MarketCloseRequest extends OrderRequestBase {
  quantity: number;
}

/** Step assumed when the caller does not know the venue's own. */
const DEFAULT_QTY_STEP = 0.001;
const DEFAULT_PRICE_TICK = 0.1;

function enforceMarkPriceGuard(
  side: "BUY" | "SELL",
  toCheckPrice: number | null | undefined,
  guard: OrderGuardOptions | undefined,
  log: LogHandler,
  kind: string
): boolean {
  if (!guard || guard.maxPct == null) return true;
  const allowed = isOrderPriceAllowedByMark({
    side,
    orderPrice: toCheckPrice,
    markPrice: guard.markPrice,
    maxPct: guard.maxPct,
  });
  if (!allowed) {
    const priceStr = Number.isFinite(Number(toCheckPrice)) ? Number(toCheckPrice).toFixed(2) : String(toCheckPrice);
    const markStr = Number.isFinite(Number(guard.markPrice)) ? Number(guard.markPrice).toFixed(2) : String(guard.markPrice);
    log(
      "info",
      t("log.order.markGuardBlocked", {
        kind,
        side,
        price: priceStr,
        mark: markStr,
        pct: (guard.maxPct! * 100).toFixed(2),
      })
    );
    return false;
  }
  return true;
}

/** Rounds down to the venue's step, but never to zero — a sub-step size is kept as-is. */
function normalizeQuantity(amount: number, qtyStep: number): number {
  const raw = Math.abs(amount);
  const rounded = roundQtyDownToStep(raw, qtyStep);
  return rounded > 0 ? rounded : raw;
}

export function isOperating(locks: OrderLockMap, type: string): boolean {
  return Boolean(locks[type]);
}

export function lockOperating(
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  type: string,
  log: LogHandler,
  timeout = 3000
): void {
  locks[type] = true;
  if (timers[type]) {
    clearTimeout(timers[type]!);
  }
  timers[type] = setTimeout(() => {
    locks[type] = false;
    pendings[type] = null;
    log("info", t("log.order.lockTimeout", { type }));
  }, timeout);
}

export function unlockOperating(
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  type: string
): void {
  locks[type] = false;
  pendings[type] = null;
  if (timers[type]) {
    clearTimeout(timers[type]!);
  }
  timers[type] = null;
}

export async function deduplicateOrders(
  ctx: OrderContext,
  openOrders: Order[],
  type: string,
  side: string
): Promise<void> {
  const { adapter, symbol, locks, timers, pendings, log } = ctx;
  // Treat STOP orders on some exchanges (e.g., Lighter) as LIMIT with stopPrice populated.
  const sameTypeOrders = openOrders.filter((o) => {
    const normalizedType = String(o.type).toUpperCase();
    const isStopLike = Number.isFinite(Number(o.stopPrice)) && Number(o.stopPrice) > 0;
    const matchesStop = type === "STOP_MARKET" && isStopLike && o.side === side;
    const exactMatch = normalizedType === type && o.side === side;
    return exactMatch || matchesStop;
  });
  if (sameTypeOrders.length <= 1) return;
  sameTypeOrders.sort((a, b) => {
    const ta = b.updateTime || b.time || 0;
    const tb = a.updateTime || a.time || 0;
    return ta - tb;
  });
  const toCancel = sameTypeOrders.slice(1);
  const orderIdList = toCancel.map((o) => o.orderId);
  if (!orderIdList.length) return;
  try {
    lockOperating(locks, timers, pendings, type, log);
    await adapter.cancelOrders({ symbol, orderIdList });
    log("order", t("log.order.dedupeCancelled", { type, ids: orderIdList.join(",") }));
  } catch (err) {
    if (isUnknownOrderError(err)) {
      log("order", t("log.order.dedupeGone"));
    } else {
      log("error", t("log.order.dedupeFailed", { error: String(err) }));
    }
  } finally {
    unlockOperating(locks, timers, pendings, type);
  }
}

export async function placeOrder(
  ctx: OrderContext,
  request: LimitOrderRequest
): Promise<Order | undefined> {
  const { locks, timers, pendings, log } = ctx;
  const { side, openOrders, guard, reduceOnly = false } = request;
  const type = "LIMIT";
  if (isOperating(locks, type)) return;
  const priceNum = Number(request.price);
  if (!enforceMarkPriceGuard(side, priceNum, guard, log, t("order.kind.limit"))) return;
  const quantity = normalizeQuantity(request.amount, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (quantity <= 0) {
    log("error", t("log.order.invalidQuantity", { kind: t("order.kind.limit") }));
    return;
  }
  if (!request.skipDedupe) {
    await deduplicateOrders(ctx, openOrders, type, side);
  }
  lockOperating(locks, timers, pendings, type, log);
  try {
    const closePosition = reduceOnly ? true : undefined;
    const order = await routeLimitOrder({
      adapter: ctx.adapter,
      symbol: ctx.symbol,
      side,
      quantity,
      price: priceNum,
      timeInForce: reduceOnly ? "GTC" : "GTX",
      reduceOnly: reduceOnly ? true : undefined,
      closePosition,
      slPrice: request.slPrice,
      tpPrice: request.tpPrice,
      clientOrderId: request.clientOrderId,
    });
    pendings[type] = String(order.orderId);
    log(
      "order",
      t("log.order.limitPlaced", {
        side,
        price: priceNum,
        quantity,
        reduceOnly,
        sl: request.slPrice ? ` sl=${request.slPrice}` : "",
      })
    );
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", t("log.order.limitGone"));
      return undefined;
    }
    throw err;
  }
}

export async function placeMarketOrder(
  ctx: OrderContext,
  request: MarketOrderRequest
): Promise<Order | undefined> {
  const { locks, timers, pendings, log } = ctx;
  const { side, openOrders, guard, reduceOnly = false } = request;
  const type = "MARKET";
  if (isOperating(locks, type)) return;
  if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, t("order.kind.market"))) return;
  const quantity = normalizeQuantity(request.amount, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (quantity <= 0) {
    log("error", t("log.order.invalidQuantity", { kind: t("order.kind.market") }));
    return;
  }
  await deduplicateOrders(ctx, openOrders, type, side);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const closePosition = reduceOnly ? true : undefined;
    const order = await routeMarketOrder({
      adapter: ctx.adapter,
      symbol: ctx.symbol,
      side,
      quantity,
      reduceOnly: reduceOnly ? true : undefined,
      closePosition,
    });
    pendings[type] = String(order.orderId);
    log("order", t("log.order.marketPlaced", { side, quantity, reduceOnly }));
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", t("log.order.marketGone"));
      return undefined;
    }
    throw err;
  }
}

export async function placeStopLossOrder(
  ctx: OrderContext,
  request: StopLossOrderRequest
): Promise<Order | undefined> {
  const { locks, timers, pendings, log } = ctx;
  const { side, openOrders, guard, stopPrice, lastPrice } = request;
  const type = "STOP_MARKET";
  if (isOperating(locks, type)) return;
  if (!enforceMarkPriceGuard(side, stopPrice, guard, log, t("order.kind.stop"))) return;
  if (lastPrice != null) {
    if (side === "SELL" && stopPrice >= lastPrice) {
      log("error", t("log.order.stopAboveLast", { stopPrice, lastPrice }));
      return;
    }
    if (side === "BUY" && stopPrice <= lastPrice) {
      log("error", t("log.order.stopBelowLast", { stopPrice, lastPrice }));
      return;
    }
  }
  const normalizedStop = roundDownToTick(stopPrice, request.priceTick ?? DEFAULT_PRICE_TICK);
  const normalizedQty = normalizeQuantity(request.quantity, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (normalizedQty <= 0) {
    log("error", t("log.order.invalidQuantity", { kind: t("order.kind.stop") }));
    return;
  }

  // Avoid forcing price for STOP_MARKET globally; keep this exchange-specific in gateways
  await deduplicateOrders(ctx, openOrders, type, side);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const order = await routeStopOrder({
      adapter: ctx.adapter,
      symbol: ctx.symbol,
      side,
      quantity: normalizedQty,
      stopPrice: normalizedStop,
      timeInForce: "GTC",
      reduceOnly: true,
      closePosition: true,
      triggerType: "STOP_LOSS",
    });
    pendings[type] = String(order.orderId);
    log("stop", t("log.order.stopPlaced", { side, stopPrice: normalizedStop }));
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", t("log.order.stopGone"));
      return undefined;
    }
    throw err;
  }
}

export async function placeTrailingStopOrder(
  ctx: OrderContext,
  request: TrailingStopOrderRequest
): Promise<Order | undefined> {
  const { adapter, locks, timers, pendings, log } = ctx;
  const { side, openOrders, guard, activationPrice, callbackRate } = request;
  const type = "TRAILING_STOP_MARKET";
  if (isOperating(locks, type)) return;
  if (!adapter.supportsTrailingStops()) {
    log("error", t("log.order.trailingUnsupported"));
    return;
  }
  if (!enforceMarkPriceGuard(side, activationPrice, guard, log, t("order.kind.trailing"))) return;
  const normalizedActivation = roundDownToTick(activationPrice, request.priceTick ?? DEFAULT_PRICE_TICK);
  const normalizedQty = normalizeQuantity(request.quantity, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (normalizedQty <= 0) {
    log("error", t("log.order.invalidQuantity", { kind: t("order.kind.trailing") }));
    return;
  }
  await deduplicateOrders(ctx, openOrders, type, side);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const order = await routeTrailingStopOrder({
      adapter,
      symbol: ctx.symbol,
      side,
      quantity: normalizedQty,
      activationPrice: normalizedActivation,
      callbackRate,
      timeInForce: "GTC",
      reduceOnly: true,
    });
    pendings[type] = String(order.orderId);
    log(
      "order",
      t("log.order.trailingPlaced", {
        side,
        activation: normalizedActivation,
        callbackRate,
      })
    );
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", t("log.order.trailingGone"));
      return undefined;
    }
    throw err;
  }
}

export async function marketClose(ctx: OrderContext, request: MarketCloseRequest): Promise<void> {
  const { locks, timers, pendings, log } = ctx;
  const { side, openOrders, guard, qtyStep } = request;
  const type = "MARKET";
  if (isOperating(locks, type)) return;
  if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, t("order.kind.close"))) return;

  const rawQuantity = Math.abs(request.quantity);
  let normalizedQty = qtyStep != null ? normalizeQuantity(rawQuantity, qtyStep) : rawQuantity;
  if (qtyStep != null) {
    // A step-rounded close that is within rounding noise of the real position
    // would leave dust behind; close the exact amount instead.
    const epsilon = Math.max(qtyStep * 1e-4, 1e-10);
    if (Math.abs(rawQuantity - normalizedQty) <= epsilon) {
      normalizedQty = rawQuantity;
    }
  }
  if (normalizedQty <= 0) {
    log("error", t("log.order.invalidQuantity", { kind: t("order.kind.close") }));
    return;
  }

  await deduplicateOrders(ctx, openOrders, type, side);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const order = await routeCloseOrder({
      adapter: ctx.adapter,
      symbol: ctx.symbol,
      side,
      quantity: normalizedQty,
      reduceOnly: true,
      closePosition: true,
    });
    pendings[type] = String(order.orderId);
    log("close", t("log.order.closePlaced", { side }));
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", t("log.order.closeGone"));
      return;
    }
    throw err;
  }
}
