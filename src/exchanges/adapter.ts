import type {
  AccountSnapshot,
  Order,
  Depth,
  Ticker,
  Kline,
  CreateOrderParams,
} from "./types";

export interface AccountListener {
  (snapshot: AccountSnapshot): void;
}

export interface OrderListener {
  (orders: Order[]): void;
}

export interface DepthListener {
  (depth: Depth): void;
}

export interface TickerListener {
  (ticker: Ticker): void;
}

export interface KlineListener {
  (klines: Kline[]): void;
}

export interface FundingRateSnapshot {
  symbol: string;
  fundingRate: number;
  updateTime: number;
}

export interface FundingRateListener {
  (snapshot: FundingRateSnapshot): void;
}

export type RestHealthState = "healthy" | "unhealthy";
export interface RestHealthInfo {
  consecutiveErrors: number;
  method?: string;
  path?: string;
  error?: string;
}
export interface RestHealthListener {
  (state: RestHealthState, info: RestHealthInfo): void;
}

export interface ExchangePrecision {
  priceTick: number;
  qtyStep: number;
  priceDecimals?: number;
  sizeDecimals?: number;
  marketId?: number;
  minBaseAmount?: number;
  minQuoteAmount?: number;
}

export type ConnectionEventType = "disconnected" | "reconnected";
export interface ConnectionEventListener {
  (event: ConnectionEventType, symbol: string): void;
}

export interface ExchangeAdapter {
  readonly id: string;
  supportsTrailingStops(): boolean;
  /** 是否支持交易所侧触发单（STOP_MARKET 兜底止损），缺省视为 false */
  supportsTriggerOrders?(): boolean;
  watchAccount(cb: AccountListener): void;
  watchOrders(cb: OrderListener): void;
  watchDepth(symbol: string, cb: DepthListener): void;
  watchTicker(symbol: string, cb: TickerListener): void;
  watchKlines(symbol: string, interval: string, cb: KlineListener): void;
  watchFundingRate?(symbol: string, cb: FundingRateListener): void;
  createOrder(params: CreateOrderParams): Promise<Order>;
  cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void>;
  cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void>;
  cancelAllOrders(params: { symbol: string }): Promise<void>;
  getPrecision?(): Promise<ExchangePrecision | null>;
  // Connection protection methods (optional)
  onConnectionEvent?(listener: ConnectionEventListener): void;
  offConnectionEvent?(listener: ConnectionEventListener): void;
  onRestHealthEvent?(listener: RestHealthListener): void;
  offRestHealthEvent?(listener: RestHealthListener): void;
  queryOpenOrders?(): Promise<Order[]>;
  queryAccountSnapshot?(): Promise<AccountSnapshot | null>;
  changeMarginMode?(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void>;
  forceCancelAllOrders?(): Promise<boolean>;
}
