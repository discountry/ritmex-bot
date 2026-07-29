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
  context: string
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
      `${context} 保护触发：side=${side} price=${priceStr} mark=${markStr} 超过 ${(guard.maxPct! * 100).toFixed(2)}%`
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
    log("info", `${type} 操作超时自动解锁`);
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
    log("order", `去重撤销重复 ${type} 单: ${orderIdList.join(",")}`);
  } catch (err) {
    if (isUnknownOrderError(err)) {
      log("order", "去重时发现订单已不存在，跳过删除");
    } else {
      log("error", `去重撤单失败: ${String(err)}`);
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
  if (!enforceMarkPriceGuard(side, priceNum, guard, log, "限价单")) return;
  const quantity = normalizeQuantity(request.amount, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (quantity <= 0) {
    log("error", "限价单数量无效，跳过下单");
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
    log("order", `挂限价单: ${side} @ ${priceNum} 数量 ${quantity} reduceOnly=${reduceOnly}${request.slPrice ? ` sl=${request.slPrice}` : ""}`);
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "订单已成交或被撤销，跳过新单");
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
  if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, "市价单")) return;
  const quantity = normalizeQuantity(request.amount, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (quantity <= 0) {
    log("error", "市价单数量无效，跳过下单");
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
    log("order", `市价单: ${side} 数量 ${quantity} reduceOnly=${reduceOnly}`);
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "市价单失败但订单已不存在，忽略");
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
  if (!enforceMarkPriceGuard(side, stopPrice, guard, log, "止损单")) return;
  if (lastPrice != null) {
    if (side === "SELL" && stopPrice >= lastPrice) {
      log("error", `止损价 ${stopPrice} 高于或等于当前价 ${lastPrice}，取消挂单`);
      return;
    }
    if (side === "BUY" && stopPrice <= lastPrice) {
      log("error", `止损价 ${stopPrice} 低于或等于当前价 ${lastPrice}，取消挂单`);
      return;
    }
  }
  const normalizedStop = roundDownToTick(stopPrice, request.priceTick ?? DEFAULT_PRICE_TICK);
  const normalizedQty = normalizeQuantity(request.quantity, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (normalizedQty <= 0) {
    log("error", "止损单数量无效，跳过下单");
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
    log("stop", `挂止损单: ${side} STOP_MARKET @ ${normalizedStop}`);
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "止损单已失效，跳过");
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
    log("error", "当前交易所不支持动态止盈单");
    return;
  }
  if (!enforceMarkPriceGuard(side, activationPrice, guard, log, "动态止盈单")) return;
  const normalizedActivation = roundDownToTick(activationPrice, request.priceTick ?? DEFAULT_PRICE_TICK);
  const normalizedQty = normalizeQuantity(request.quantity, request.qtyStep ?? DEFAULT_QTY_STEP);
  if (normalizedQty <= 0) {
    log("error", "动态止盈单数量无效，跳过下单");
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
      `挂动态止盈单: ${side} activation=${normalizedActivation} callbackRate=${callbackRate}`
    );
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "动态止盈单已失效，跳过");
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
  if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, "市价平仓")) return;

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
    log("error", "市价平仓数量无效，跳过下单");
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
    log("close", `市价平仓: ${side}`);
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "市场平仓时订单已不存在");
      return;
    }
    throw err;
  }
}
