import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker, CreateOrderParams } from './types';

export type AccountListener = (snapshot: AsterAccountSnapshot) => void;

export type OrderListener = (orders: AsterOrder[]) => void;

export type DepthListener = (depth: AsterDepth) => void;

export type TickerListener = (ticker: AsterTicker) => void;

export type KlineListener = (klines: AsterKline[]) => void;

export interface ExchangeAdapter {
   readonly id: string;
   supportsTrailingStops(): boolean;
   watchAccount(cb: AccountListener): void;
   watchOrders(cb: OrderListener): void;
   watchDepth(symbol: string, cb: DepthListener): void;
   watchTicker(symbol: string, cb: TickerListener): void;
   watchKlines(symbol: string, interval: string, cb: KlineListener): void;
   createOrder(params: CreateOrderParams): Promise<AsterOrder>;
   cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void>;
   cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void>;
   cancelAllOrders(params: { symbol: string }): Promise<void>;
}
