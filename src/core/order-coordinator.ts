import type { ExchangeAdapter } from '../exchanges/adapter';
import type { AsterOrder, CreateOrderParams } from '../exchanges/types';
import { isUnknownOrderError } from '../utils/errors';
import { formatPriceToString, roundDownToTick, roundQtyDownToStep } from '../utils/math';
import { isOrderPriceAllowedByMark } from '../utils/strategy';

export type OrderLockMap = Record<string, boolean>;
export type OrderTimerMap = Record<string, ReturnType<typeof setTimeout> | null>;
export type OrderPendingMap = Record<string, string | null>;
export type LogHandler = (type: string, detail: string) => void;

type OrderGuardOptions = { markPrice?: number | null; expectedPrice?: number | null; maxPct?: number };

function enforceMarkPriceGuard(side: 'BUY' | 'SELL', toCheckPrice: number | null | undefined, guard: OrderGuardOptions | undefined, log: LogHandler, context: string): boolean {
   if (!guard || !guard.maxPct || guard.maxPct === null) { return true; }
   const allowed = isOrderPriceAllowedByMark({ side, orderPrice: toCheckPrice, markPrice: guard.markPrice, maxPct: guard.maxPct });
   if (!allowed) {
      const priceStr = Number.isFinite(Number(toCheckPrice)) ? Number(toCheckPrice).toFixed(2) : String(toCheckPrice);
      const markStr = Number.isFinite(Number(guard.markPrice)) ? Number(guard.markPrice).toFixed(2) : String(guard.markPrice);
      log('info', `${context} 保护触发：side=${side} price=${priceStr} mark=${markStr} 超过 ${(guard.maxPct! * 100).toFixed(2)}%`);
      return false;
   }
   return true;
}

export function isOperating(locks: OrderLockMap, type: string): boolean {
   return Boolean(locks[type]);
}

export function lockOperating(locks: OrderLockMap, timers: OrderTimerMap, pendings: OrderPendingMap, type: string, log: LogHandler, timeout = 3000): void {
   locks[type] = true;
   if (timers[type]) {
      clearTimeout(timers[type]!);
   }
   timers[type] = setTimeout(() => {
      locks[type] = false;
      pendings[type] = null;
      log('info', `${type} 操作超时自动解锁`);
   }, timeout);
}

export function unlockOperating(locks: OrderLockMap, timers: OrderTimerMap, pendings: OrderPendingMap, type: string): void {
   locks[type] = false;
   pendings[type] = null;
   if (timers[type]) {
      clearTimeout(timers[type]!);
   }
   timers[type] = null;
}

export async function deduplicateOrders(adapter: ExchangeAdapter, symbol: string, openOrders: AsterOrder[], locks: OrderLockMap, timers: OrderTimerMap, pendings: OrderPendingMap, type: string, side: string, log: LogHandler): Promise<void> {
   const sameTypeOrders = openOrders.filter((o) => o.type === type && o.side === side);
   if (sameTypeOrders.length <= 1) { return; }
   sameTypeOrders.sort((a, b) => {
      const ta = b.updateTime || b.time || 0;
      const tb = a.updateTime || a.time || 0;
      return ta - tb;
   });
   const toCancel = sameTypeOrders.slice(1);
   const orderIdList = toCancel.map((o) => o.orderId);
   if (!orderIdList.length) { return; }
   try {
      lockOperating(locks, timers, pendings, type, log);
      await adapter.cancelOrders({ symbol, orderIdList });
      log('order', `去重撤销重复 ${type} 单: ${orderIdList.join(',')}`);
   } catch (err) {
      if (isUnknownOrderError(err)) {
         log('order', '去重时发现订单已不存在，跳过删除');
      } else {
         log('error', `去重撤单失败: ${String(err)}`);
      }
   } finally {
      unlockOperating(locks, timers, pendings, type);
   }
}

type PlaceOrderOptions = { priceTick: number; qtyStep: number; skipDedupe?: boolean };

export async function placeOrder(
   adapter: ExchangeAdapter,
   symbol: string,
   openOrders: AsterOrder[],
   locks: OrderLockMap,
   timers: OrderTimerMap,
   pendings: OrderPendingMap,
   side: 'BUY' | 'SELL',
   price: string, // 改为字符串价格
   amount: number,
   log: LogHandler,
   reduceOnly = false,
   guard?: OrderGuardOptions,
   opts?: PlaceOrderOptions,
): Promise<AsterOrder | undefined> {
   const type = 'LIMIT';
   if (isOperating(locks, type)) { return; }
   const priceNum = Number(price);
   if (!enforceMarkPriceGuard(side, priceNum, guard, log, '限价单')) { return; }
   const priceTick = opts?.priceTick ?? 0.1;
   const qtyStep = opts?.qtyStep ?? 0.001;
   const params: CreateOrderParams = {
      symbol,
      side,
      type,
      quantity: roundQtyDownToStep(amount, qtyStep),
      price: priceNum, // 直接使用字符串转换的数字，不再格式化
      timeInForce: 'GTX',
   };
   if (reduceOnly) { params.reduceOnly = 'true'; }
   if (!opts?.skipDedupe) {
      await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
   }
   lockOperating(locks, timers, pendings, type, log);
   try {
      const order = await adapter.createOrder(params);
      pendings[type] = String(order.orderId);
      log('order', `挂限价单: ${side} @ ${params.price} 数量 ${params.quantity} reduceOnly=${reduceOnly}`);
      return order;
   } catch (err) {
      unlockOperating(locks, timers, pendings, type);
      if (isUnknownOrderError(err)) {
         log('order', '订单已成交或被撤销，跳过新单');
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
   side: 'BUY' | 'SELL',
   amount: number,
   log: LogHandler,
   reduceOnly = false,
   guard?: OrderGuardOptions,
   opts?: { qtyStep: number },
): Promise<AsterOrder | undefined> {
   const type = 'MARKET';
   if (isOperating(locks, type)) { return; }
   if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, '市价单')) { return; }
   const qtyStep = opts?.qtyStep ?? 0.001;
   const params: CreateOrderParams = { symbol, side, type, quantity: roundQtyDownToStep(amount, qtyStep) };
   if (reduceOnly) { params.reduceOnly = 'true'; }
   await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
   lockOperating(locks, timers, pendings, type, log);
   try {
      const order = await adapter.createOrder(params);
      pendings[type] = String(order.orderId);
      log('order', `市价单: ${side} 数量 ${params.quantity} reduceOnly=${reduceOnly}`);
      return order;
   } catch (err) {
      unlockOperating(locks, timers, pendings, type);
      if (isUnknownOrderError(err)) {
         log('order', '市价单失败但订单已不存在，忽略');
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
   side: 'BUY' | 'SELL',
   stopPrice: number,
   quantity: number,
   lastPrice: number | null,
   log: LogHandler,
   guard?: OrderGuardOptions,
   opts?: { priceTick: number; qtyStep: number },
): Promise<AsterOrder | undefined> {
   const type = 'STOP_MARKET';
   if (isOperating(locks, type)) { return; }
   if (!enforceMarkPriceGuard(side, stopPrice, guard, log, '止损单')) { return; }
   if (lastPrice !== null) {
      if (side === 'SELL' && stopPrice >= lastPrice) {
         log('error', `止损价 ${stopPrice} 高于或等于当前价 ${lastPrice}，取消挂单`);
         return;
      }
      if (side === 'BUY' && stopPrice <= lastPrice) {
         log('error', `止损价 ${stopPrice} 低于或等于当前价 ${lastPrice}，取消挂单`);
         return;
      }
   }
   const priceTick = opts?.priceTick ?? 0.1;
   const qtyStep = opts?.qtyStep ?? 0.001;
   const params: CreateOrderParams = {
      symbol,
      side,
      type,
      stopPrice: roundDownToTick(stopPrice, priceTick),
      reduceOnly: 'true',
      closePosition: 'true',
      timeInForce: 'GTC',
      // Do not round down stop quantity here to avoid underflow to exchange min; gateway will quantize precisely
      quantity,
      triggerType: 'STOP_LOSS',
   };
   // Avoid forcing price for STOP_MARKET globally; keep this exchange-specific in gateways
   await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
   lockOperating(locks, timers, pendings, type, log);
   try {
      const order = await adapter.createOrder(params);
      pendings[type] = String(order.orderId);
      log('stop', `挂止损单: ${side} STOP_MARKET @ ${params.stopPrice}`);
      return order;
   } catch (err) {
      unlockOperating(locks, timers, pendings, type);
      if (isUnknownOrderError(err)) {
         log('order', '止损单已失效，跳过');
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
   side: 'BUY' | 'SELL',
   activationPrice: number,
   quantity: number,
   callbackRate: number,
   log: LogHandler,
   guard?: OrderGuardOptions,
   opts?: { priceTick: number; qtyStep: number },
): Promise<AsterOrder | undefined> {
   const type = 'TRAILING_STOP_MARKET';
   if (isOperating(locks, type)) { return; }
   if (!enforceMarkPriceGuard(side, activationPrice, guard, log, '动态止盈单')) { return; }
   const priceTick = opts?.priceTick ?? 0.1;
   const qtyStep = opts?.qtyStep ?? 0.001;
   const params: CreateOrderParams = {
      symbol,
      side,
      type,
      // Do not round down trailing-stop quantity to avoid underflowing small positions to zero;
      // let the exchange adapter handle precise quantization.
      quantity,
      reduceOnly: 'true',
      activationPrice: roundDownToTick(activationPrice, priceTick),
      callbackRate,
      timeInForce: 'GTC',
   };
   await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
   lockOperating(locks, timers, pendings, type, log);
   try {
      const order = await adapter.createOrder(params);
      pendings[type] = String(order.orderId);
      log('order', `挂动态止盈单: ${side} activation=${params.activationPrice} callbackRate=${callbackRate}`);
      return order;
   } catch (err) {
      unlockOperating(locks, timers, pendings, type);
      if (isUnknownOrderError(err)) {
         log('order', '动态止盈单已失效，跳过');
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
   side: 'BUY' | 'SELL',
   quantity: number,
   log: LogHandler,
   guard?: OrderGuardOptions,
   opts?: { qtyStep: number },
): Promise<void> {
   const type = 'MARKET';
   if (isOperating(locks, type)) { return; }
   if (!enforceMarkPriceGuard(side, guard?.expectedPrice ?? null, guard, log, '市价平仓')) { return; }
   const qtyStep = opts?.qtyStep ?? 0.001;
   const roundedQty = roundQtyDownToStep(quantity, qtyStep);
   const safeQty = roundedQty > 0 ? roundedQty : quantity;
   const params: CreateOrderParams = {
      symbol,
      side,
      type,
      quantity: safeQty,
      reduceOnly: 'true',
      // Hint exchanges (like Paradex) to close the whole position and tolerate omitted size
      closePosition: 'true',
   };
   await deduplicateOrders(adapter, symbol, openOrders, locks, timers, pendings, type, side, log);
   lockOperating(locks, timers, pendings, type, log);
   try {
      const order = await adapter.createOrder(params);
      pendings[type] = String(order.orderId);
      log('close', `市价平仓: ${side}`);
   } catch (err) {
      unlockOperating(locks, timers, pendings, type);
      if (isUnknownOrderError(err)) {
         log('order', '市场平仓时订单已不存在');
         return;
      }
      throw err;
   }
}
