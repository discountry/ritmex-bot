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
  watchAccount(cb: AccountListener): void;
  watchOrders(cb: OrderListener): void;
  watchDepth(symbol: string, cb: DepthListener): void;
  watchTicker(symbol: string, cb: TickerListener): void;
  watchKlines(symbol: string, interval: string, cb: KlineListener): void;
  watchFundingRate?(symbol: string, cb: FundingRateListener): void;
  createOrder(params: CreateOrderParams): Promise<AsterOrder>;
  cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void>;
  cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void>;
  cancelAllOrders(params: { symbol: string }): Promise<void>;
  getPrecision?(): Promise<ExchangePrecision | null>;
  // 连接保护相关方法（可选，仅 StandX 支持）
  onConnectionEvent?(listener: ConnectionEventListener): void;
  offConnectionEvent?(listener: ConnectionEventListener): void;
  onRestHealthEvent?(listener: RestHealthListener): void;
  offRestHealthEvent?(listener: RestHealthListener): void;
  queryOpenOrders?(): Promise<AsterOrder[]>;
  queryAccountSnapshot?(): Promise<AsterAccountSnapshot | null>;
  changeMarginMode?(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void>;
  forceCancelAllOrders?(): Promise<boolean>;
}
