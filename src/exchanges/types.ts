export type StringBoolean = "true" | "false";

export type OrderSide = "BUY" | "SELL";
export type OrderType =
  | "LIMIT"
  | "MARKET"
  | "STOP"
  | "STOP_MARKET"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_MARKET"
  | "TRAILING_STOP_MARKET";
export type PositionSide = "BOTH" | "LONG" | "SHORT";
export type TimeInForce = "GTC" | "IOC" | "FOK" | "GTX";

export interface CreateOrderParams {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity?: number;
  price?: number;
  stopPrice?: number;
  activationPrice?: number;
  callbackRate?: number;
  timeInForce?: TimeInForce;
  reduceOnly?: StringBoolean;
  closePosition?: StringBoolean;
  triggerType?: "UNSPECIFIED" | "TAKE_PROFIT" | "STOP_LOSS";
  // StandX TPSL 参数
  slPrice?: number; // 止损价格
  tpPrice?: number; // 止盈价格
}

export interface AsterAccountPosition {
  symbol: string;
  positionAmt: string;
  entryPrice: string;
  unrealizedProfit: string;
  positionSide: PositionSide;
  updateTime: number;
  initialMargin?: string;
  maintMargin?: string;
  positionInitialMargin?: string;
  openOrderInitialMargin?: string;
  leverage?: string;
  isolated?: boolean;
  maxNotional?: string;
  marginType?: string;
  isolatedMargin?: string;
  isAutoAddMargin?: string;
  liquidationPrice?: string;
  markPrice?: string;
}

export interface GrvtOrderLeg {
  instrument: string;
  size: string;
  limit_price?: string;
  is_buying_asset?: boolean;
}

export type GrvtTimeInForce =
  | "GOOD_TILL_TIME"
  | "ALL_OR_NONE"
  | "IMMEDIATE_OR_CANCEL"
  | "FILL_OR_KILL";

export interface GrvtOrderMetadata {
  client_order_id?: string;
  create_time?: string;
  broker?: string | null;
  trigger?: GrvtTriggerMetadata;
}

export interface GrvtOrderState {
  status?: string;
  reject_reason?: string | null;
  book_size?: string[];
  traded_size?: string[];
  update_time?: string;
  avg_fill_price?: string[];
}

export interface GrvtOrder {
  order_id: string;
  client_order_id?: string;
  sub_account_id?: string;
  is_market?: boolean;
  time_in_force?: GrvtTimeInForce;
  post_only?: boolean;
  reduce_only?: boolean;
  legs?: GrvtOrderLeg[];
  metadata?: GrvtOrderMetadata;
  state?: GrvtOrderState;
  instrument?: string;
}

export interface GrvtTrade {
  price: string;
  size: string;
  taker_side: "BUY" | "SELL";
  timestamp: string;
}

export interface GrvtTradeHistoryResponse {
  result?: GrvtTrade[];
}

export interface GrvtWebsocketMessage<T> {
  stream: string;
  selector: string;
  sequence_number?: string;
  feed: T;
}

export interface GrvtOrderUpdateFeed {
  order_id: string;
  client_order_id?: string;
  sub_account_id?: string;
  state?: GrvtOrderState;
  traded_size?: string[];
  update_time?: string;
}

export interface GrvtPositionUpdateFeed {
  instrument: string;
  size: string;
  entry_price?: string;
  mark_price?: string;
  unrealized_pnl?: string;
  sub_account_id?: string;
  update_time?: string;
}

export interface GrvtDepthUpdateFeed {
  instrument: string;
  bids: GrvtDepthLevel[];
  asks: GrvtDepthLevel[];
  event_time?: string;
}

export interface GrvtTickerUpdateFeed {
  instrument: string;
  mark_price?: string;
  last_trade_price?: string;
  best_bid_price?: string;
  best_ask_price?: string;
  volume_24h?: string;
}

export interface GrvtOpenOrdersResponse {
  result?: GrvtOrder[];
}

export interface GrvtPositionsResponse {
  result?: GrvtPosition[];
}

export interface GrvtPosition {
  instrument: string;
  size: string;
  entry_price?: string;
  mark_price?: string;
  unrealized_pnl?: string;
}

export interface GrvtAccountSnapshot {
  total_unrealized_pnl?: string;
  positions: GrvtPosition[];
  settle_currency?: string;
  available_balance?: string;
}

export interface GrvtBalancesResponse {
  result?: {
    total_unrealized_pnl?: string;
    positions?: GrvtPosition[];
  };
}

export interface GrvtDepthLevel {
  price: string;
  size: string;
}

export interface GrvtDepth {
  instrument: string;
  event_time?: string;
  bids: GrvtDepthLevel[];
  asks: GrvtDepthLevel[];
}

export interface GrvtTicker {
  instrument: string;
  mark_price?: string;
  last_trade_price?: string;
  best_bid_price?: string;
  best_ask_price?: string;
  volume_24h?: string;
}

export interface GrvtKline {
  open_time: number;
  close_time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  number_of_trades?: number;
}

export interface GrvtSignature {
  signer: string;
  r: string;
  s: string;
  v: number;
  expiration: string;
  nonce: number;
}

export interface GrvtUnsignedOrderLeg {
  instrument: string;
  size: string;
  limit_price?: string;
  is_buying_asset: boolean;
}

export interface GrvtTriggerMetadata {
  trigger_type: "UNSPECIFIED" | "TAKE_PROFIT" | "STOP_LOSS";
  tpsl: {
    trigger_by: "UNSPECIFIED" | "INDEX" | "LAST" | "MID" | "MARK";
    trigger_price: string;
    close_position: boolean;
  };
}

export interface GrvtOrderMetadataInput {
  client_order_id: string;
  trigger?: GrvtTriggerMetadata;
  broker?: string | null;
}

export interface GrvtUnsignedOrder {
  sub_account_id: string;
  is_market: boolean;
  time_in_force: GrvtTimeInForce;
  post_only: boolean;
  reduce_only: boolean;
  legs: GrvtUnsignedOrderLeg[];
  metadata: GrvtOrderMetadataInput;
}

export interface GrvtSignedOrder extends GrvtUnsignedOrder {
  signature: GrvtSignature;
}

export interface AsterAccountAsset {
  asset: string;
  walletBalance: string;
  availableBalance: string;
  updateTime: number;
  assetId?: number;
  unrealizedProfit?: string;
  marginBalance?: string;
  maintMargin?: string;
  initialMargin?: string;
  positionInitialMargin?: string;
  openOrderInitialMargin?: string;
  crossWalletBalance?: string;
  crossUnPnl?: string;
  maxWithdrawAmount?: string;
  marginAvailable?: boolean;
}

export interface AsterAccountSnapshot {
  canTrade: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
  updateTime: number;
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  totalMarginBalance?: string;
  totalInitialMargin?: string;
  totalMaintMargin?: string;
  totalPositionInitialMargin?: string;
  totalOpenOrderInitialMargin?: string;
  totalCrossWalletBalance?: string;
  totalCrossUnPnl?: string;
  availableBalance?: string;
  maxWithdrawAmount?: string;
  positions: AsterAccountPosition[];
  assets: AsterAccountAsset[];
  marketType?: "perp" | "spot";
  baseAsset?: string;
  quoteAsset?: string;
  baseAssetId?: number;
  quoteAssetId?: number;
}

export interface AsterDepthLevel extends Array<string> {
  0: string; // price
  1: string; // quantity
}

export interface AsterDepth {
  lastUpdateId: number;
  bids: AsterDepthLevel[];
  asks: AsterDepthLevel[];
  eventTime?: number;
  eventType?: string;
  tradeTime?: number;
  symbol?: string;
}

export interface AsterTicker {
  symbol: string;
  lastPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  eventTime?: number;
  eventType?: string;
  priceChange?: string;
  priceChangePercent?: string;
  weightedAvgPrice?: string;
  bidPrice?: string;
  askPrice?: string;
  markPrice?: string;
  lastQty?: string;
  openTime?: number;
  closeTime?: number;
  firstId?: number;
  lastId?: number;
  count?: number;
}

export interface AsterSpotRateLimit {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
}

export interface AsterSpotExchangeFilter {
  filterType: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AsterFuturesSymbolFilter {
  filterType: string;
  tickSize?: string;
  stepSize?: string;
  minPrice?: string;
  maxPrice?: string;
  minQty?: string;
  maxQty?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AsterFuturesSymbolInfo {
  symbol: string;
  pair?: string;
  contractType?: string;
  pricePrecision?: number;
  quantityPrecision?: number;
  baseAssetPrecision?: number;
  quotePrecision?: number;
  underlyingType?: string;
  filters?: AsterFuturesSymbolFilter[];
}

export interface AsterFuturesExchangeInfo {
  timezone?: string;
  serverTime?: number;
  symbols?: AsterFuturesSymbolInfo[];
}

export interface AsterSpotAssetInfo {
  asset: string;
}

export interface AsterSpotSymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  baseAssetPrecision?: number;
  quotePrecision?: number;
  pricePrecision?: number;
  quantityPrecision?: number;
  orderTypes: string[];
  timeInForce: string[];
  ocoAllowed: boolean;
  filters: AsterSpotExchangeFilter[];
}

export interface AsterSpotExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: AsterSpotRateLimit[];
  exchangeFilters: AsterSpotExchangeFilter[];
  assets?: AsterSpotAssetInfo[];
  symbols: AsterSpotSymbolInfo[];
}

export interface AsterSpotDepth {
  lastUpdateId: number;
  E?: number;
  T?: number;
  bids: AsterDepthLevel[];
  asks: AsterDepthLevel[];
}

export interface AsterSpotTrade {
  id: number;
  price: string;
  qty: string;
  baseQty?: string;
  quoteQty?: string;
  time: number;
  isBuyerMaker: boolean;
}

export interface AsterSpotHistoricalTrade extends AsterSpotTrade {
  isBestMatch?: boolean;
}

export interface AsterSpotAggTrade {
  a: number;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
  M?: boolean;
}

export interface AsterSpotKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface AsterSpotTicker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
  baseAsset?: string;
  quoteAsset?: string;
}

export interface AsterSpotPriceTicker {
  symbol: string;
  price: string;
  time?: number;
}

export interface AsterSpotBookTicker {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  time?: number;
}

export interface AsterSpotCommissionRate {
  symbol: string;
  makerCommissionRate: string;
  takerCommissionRate: string;
}

export interface CreateSpotOrderParams {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  timeInForce?: TimeInForce;
  quantity?: number | string;
  quoteOrderQty?: number | string;
  price?: number | string;
  newClientOrderId?: string;
  stopPrice?: number | string;
  recvWindow?: number;
}

export interface CancelSpotOrderParams {
  symbol: string;
  orderId?: number | string;
  origClientOrderId?: string;
  recvWindow?: number;
}

export interface QuerySpotOrderParams extends CancelSpotOrderParams {}

export interface SpotOpenOrdersParams {
  symbol?: string;
  recvWindow?: number;
  orderIdList?: Array<number | string>;
  origClientOrderIdList?: string[];
}

export interface SpotAllOrdersParams {
  symbol: string;
  orderId?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
  recvWindow?: number;
}

export interface AsterSpotAccountBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface AsterSpotAccount {
  feeTier: number;
  canTrade: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
  canBurnAsset?: boolean;
  updateTime: number;
  makerCommission?: string;
  takerCommission?: string;
  buyerCommission?: string;
  sellerCommission?: string;
  balances: AsterSpotAccountBalance[];
}

export interface SpotUserTradesParams {
  symbol?: string;
  orderId?: number;
  startTime?: number;
  endTime?: number;
  fromId?: number;
  limit?: number;
  recvWindow?: number;
}

export interface AsterSpotUserTrade {
  symbol: string;
  id: number;
  orderId: number;
  side: OrderSide;
  price: string;
  qty: string;
  quoteQty?: string;
  commission: string;
  commissionAsset: string;
  time: number;
  counterpartyId?: number;
  maker: boolean;
  buyer: boolean;
}

export interface AsterKline {
  eventType?: string;
  eventTime?: number;
  symbol?: string;
  interval?: string;
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  firstTradeId?: number;
  lastTradeId?: number;
  quoteAssetVolume?: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume?: string;
  takerBuyQuoteAssetVolume?: string;
  isClosed?: boolean;
}

export interface AsterOrder {
  orderId: number | string;
  clientOrderId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  status: string;
  price: string;
  origQty: string;
  executedQty: string;
  stopPrice: string;
  time: number;
  updateTime: number;
  reduceOnly: boolean;
  closePosition: boolean;
  workingType?: string;
  activationPrice?: string;
  avgPrice?: string;
  cumQuote?: string;
  origType?: string;
  positionSide?: PositionSide;
  timeInForce?: TimeInForce;
  activatePrice?: string;
  priceRate?: string;
  priceProtect?: boolean;
}
