import type { ExchangeAdapter } from "../exchanges/adapter";
import type { AsterOrder } from "../exchanges/types";
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
      `${context} guard triggered: side=${side} price=${priceStr} mark=${markStr} exceeds ${(guard.maxPct! * 100).toFixed(2)}%`
    );
    return false;
  }
  return true;
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
    log("info", `${type} operation timed out, auto-unlocked`);
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
  adapter: ExchangeAdapter,
  symbol: string,
  openOrders: AsterOrder[],
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  type: string,
  side: string,
  log: LogHandler
): Promise<void> {
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
    log("order", `Dedup: cancelled duplicate ${type} orders: ${orderIdList.join(",")}`);
  } catch (err) {
    if (isUnknownOrderError(err)) {
      log("order", "Dedup: order already missing, skip removal");
    } else {
      log("error", `Dedup cancel failed: ${String(err)}`);
    }
  } finally {
    unlockOperating(locks, timers, pendings, type);
  }
}

type PlaceOrderOptions = {
  priceTick: number;
  qtyStep: number;
  skipDedupe?: boolean;
  slPrice?: number;
  tpPrice?: number;
};

export async function placeOrder(
  adapter: ExchangeAdapter,
  symbol: string,
  openOrders: AsterOrder[],
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  side: "BUY" | "SELL",
  price: string, // Use string price to avoid precision loss.
  amount: number,
  log: LogHandler,
  reduceOnly = false,
  guard?: OrderGuardOptions,
  opts?: PlaceOrderOptions
): Promise<AsterOrder | undefined> {
  const type = "LIMIT";
  if (isOperating(locks, type)) return;
  const priceNum = Number(price);
  if (!enforceMarkPriceGuard(side, priceNum, guard, log, "Limit order")) return;
  const qtyStep = opts?.qtyStep ?? 0.001;
  const rawQuantity = Math.abs(amount);
  const roundedQuantity = roundQtyDownToStep(rawQuantity, qtyStep);
  const quantity = roundedQuantity > 0 ? roundedQuantity : rawQuantity;
  if (quantity <= 0) {
    log("error", "Invalid limit order quantity, skipping");
    return;
  }
  if (!opts?.skipDedupe) {
    await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
  }
  lockOperating(locks, timers, pendings, type, log);
  try {
    const closePosition = reduceOnly ? true : undefined;
    const order = await routeLimitOrder({
      adapter,
      symbol,
      side,
      quantity,
      price: priceNum,
      timeInForce: reduceOnly ? "GTC" : "GTX",
      reduceOnly: reduceOnly ? true : undefined,
      closePosition,
      slPrice: opts?.slPrice,
      tpPrice: opts?.tpPrice,
    });
    pendings[type] = String(order.orderId);
    log("order", `Placed limit: ${side} @ ${priceNum} qty ${quantity} reduceOnly=${reduceOnly}${opts?.slPrice ? ` sl=${opts.slPrice}` : ""}`);
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "Order already filled/cancelled, skip new order");
      return undefined;
    }
    throw err;
  }
}

export async function placeMarketOrder(
  adapter: ExchangeAdapter,
  symbol: string,
  openOrders: AsterOrder[],
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  side: "BUY" | "SELL",
  amount: number,
  log: LogHandler,
  reduceOnly = false,
  guard?: OrderGuardOptions,
  opts?: { qtyStep: number }
): Promise<AsterOrder | undefined> {
  const type = "MARKET";
  if (isOperating(locks, type)) return;
  if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, "Market order")) return;
  const qtyStep = opts?.qtyStep ?? 0.001;
  const rawQuantity = Math.abs(amount);
  const roundedQuantity = roundQtyDownToStep(rawQuantity, qtyStep);
  const quantity = roundedQuantity > 0 ? roundedQuantity : rawQuantity;
  if (quantity <= 0) {
    log("error", "Invalid market order quantity, skipping");
    return;
  }
  await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const closePosition = reduceOnly ? true : undefined;
    const order = await routeMarketOrder({
      adapter,
      symbol,
      side,
      quantity,
      reduceOnly: reduceOnly ? true : undefined,
      closePosition,
    });
    pendings[type] = String(order.orderId);
    log("order", `Placed market: ${side} qty ${quantity} reduceOnly=${reduceOnly}`);
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "Market order failed but order already missing, ignoring");
      return undefined;
    }
    throw err;
  }
}

export async function placeStopLossOrder(
  adapter: ExchangeAdapter,
  symbol: string,
  openOrders: AsterOrder[],
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  side: "BUY" | "SELL",
  stopPrice: number,
  quantity: number,
  lastPrice: number | null,
  log: LogHandler,
  guard?: OrderGuardOptions,
  opts?: { priceTick: number; qtyStep: number }
): Promise<AsterOrder | undefined> {
  const type = "STOP_MARKET";
  if (isOperating(locks, type)) return;
  if (!enforceMarkPriceGuard(side, stopPrice, guard, log, "Stop-loss order")) return;
  if (lastPrice != null) {
    if (side === "SELL" && stopPrice >= lastPrice) {
      log("error", `Stop price ${stopPrice} is >= last price ${lastPrice}, skip placing`);
      return;
    }
    if (side === "BUY" && stopPrice <= lastPrice) {
      log("error", `Stop price ${stopPrice} is <= last price ${lastPrice}, skip placing`);
      return;
    }
  }
  const priceTick = opts?.priceTick ?? 0.1;
  const qtyStep = opts?.qtyStep ?? 0.001;
  const normalizedStop = roundDownToTick(stopPrice, priceTick);
  const rawQuantity = Math.abs(quantity);
  const roundedQuantity = roundQtyDownToStep(rawQuantity, qtyStep);
  const normalizedQty = roundedQuantity > 0 ? roundedQuantity : rawQuantity;
  if (normalizedQty <= 0) {
    log("error", "Invalid stop-loss quantity, skipping");
    return;
  }

  // Avoid forcing price for STOP_MARKET globally; keep this exchange-specific in gateways
  await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const order = await routeStopOrder({
      adapter,
      symbol,
      side,
      quantity: normalizedQty,
      stopPrice: normalizedStop,
      timeInForce: "GTC",
      reduceOnly: true,
      closePosition: true,
      triggerType: "STOP_LOSS",
    });
    pendings[type] = String(order.orderId);
    log("stop", `Placed stop-loss: ${side} STOP_MARKET @ ${normalizedStop}`);
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "Stop-loss order is no longer valid, skipped");
      return undefined;
    }
    throw err;
  }
}

export async function placeTrailingStopOrder(
  adapter: ExchangeAdapter,
  symbol: string,
  openOrders: AsterOrder[],
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  side: "BUY" | "SELL",
  activationPrice: number,
  quantity: number,
  callbackRate: number,
  log: LogHandler,
  guard?: OrderGuardOptions,
  opts?: { priceTick: number; qtyStep: number }
): Promise<AsterOrder | undefined> {
  const type = "TRAILING_STOP_MARKET";
  if (isOperating(locks, type)) return;
  if (!adapter.supportsTrailingStops()) {
    log("error", "Current exchange does not support trailing stop");
    return;
  }
  if (!enforceMarkPriceGuard(side, activationPrice, guard, log, "Trailing-stop order")) return;
  const priceTick = opts?.priceTick ?? 0.1;
  const qtyStep = opts?.qtyStep ?? 0.001;
  const normalizedActivation = roundDownToTick(activationPrice, priceTick);
  const rawQuantity = Math.abs(quantity);
  const roundedQuantity = roundQtyDownToStep(rawQuantity, qtyStep);
  const normalizedQty = roundedQuantity > 0 ? roundedQuantity : rawQuantity;
  if (normalizedQty <= 0) {
    log("error", "Invalid trailing-stop quantity, skipping");
    return;
  }
  await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const order = await routeTrailingStopOrder({
      adapter,
      symbol,
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
      `Placed trailing stop: ${side} activation=${normalizedActivation} callbackRate=${callbackRate}`
    );
    return order;
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "Trailing-stop order is no longer valid, skipped");
      return undefined;
    }
    throw err;
  }
}

export async function marketClose(
  adapter: ExchangeAdapter,
  symbol: string,
  openOrders: AsterOrder[],
  locks: OrderLockMap,
  timers: OrderTimerMap,
  pendings: OrderPendingMap,
  side: "BUY" | "SELL",
  quantity: number,
  log: LogHandler,
  guard?: OrderGuardOptions,
  opts?: { qtyStep: number }
): Promise<void> {
  const type = "MARKET";
  if (isOperating(locks, type)) return;
  if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, "Market close")) return;

  const qtyStep = opts?.qtyStep;
  const rawQuantity = Math.abs(quantity);
  const normalizedQtyRaw = qtyStep != null ? roundQtyDownToStep(rawQuantity, qtyStep) : rawQuantity;
  let normalizedQty = normalizedQtyRaw > 0 ? normalizedQtyRaw : rawQuantity;
  if (qtyStep != null) {
    const epsilon = Math.max(qtyStep * 1e-4, 1e-10);
    if (Math.abs(rawQuantity - normalizedQty) <= epsilon) {
      normalizedQty = rawQuantity;
    }
  }
  if (normalizedQty <= 0) {
    log("error", "Invalid market-close quantity, skipping");
    return;
  }

  await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
  lockOperating(locks, timers, pendings, type, log);
  try {
    const order = await routeCloseOrder({
      adapter,
      symbol,
      side,
      quantity: normalizedQty,
      reduceOnly: true,
      closePosition: true,
    });
    pendings[type] = String(order.orderId);
    log("close", `Market close: ${side}`);
  } catch (err) {
    unlockOperating(locks, timers, pendings, type);
    if (isUnknownOrderError(err)) {
      log("order", "Order already missing during market close");
      return;
    }
    throw err;
  }
}
