import type {
  AsterAccountSnapshot,
  AsterOrder,
  AsterDepth,
  AsterTicker,
  AsterKline,
  CreateOrderParams,
} from "./types";

export interface AccountListener {
  (snapshot: AsterAccountSnapshot): void;
}

export interface OrderListener {
  (orders: AsterOrder[]): void;
}

export interface DepthListener {
  (depth: AsterDepth): void;
}

export interface TickerListener {
  (ticker: AsterTicker): void;
}

export interface KlineListener {
  (klines: AsterKline[]): void;
}

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
