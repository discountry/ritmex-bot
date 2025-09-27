export type StringBoolean = "true" | "false";

export type OrderSide = "BUY" | "SELL";
export type OrderType =
  | "LIMIT"
  | "MARKET"
  | "STOP_MARKET"
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
  lastQty?: string;
  openTime?: number;
  closeTime?: number;
  firstId?: number;
  lastId?: number;
  count?: number;
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
