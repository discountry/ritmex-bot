export interface OndoperpsApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  error_code?: string;
}

export interface OndoperpsOrder {
  orderId: string;
  clientOrderId?: string;
  parentOrderId?: string;
  side: "buy" | "sell";
  price?: string;
  size: string;
  market: string;
  filledSize?: string;
  lastFillSize?: string;
  filledCost?: string;
  realizedPnl?: string;
  fee?: string;
  feeRebate?: string;
  status: "open" | "fullyfilled" | "canceled" | "pending" | "untriggered" | string;
  createdAt: string;
  filledAt?: string;
  canceledAt?: string;
  cancelReason?: string;
  type: "limit" | "market" | "stopMarket" | "takeProfitMarket" | string;
  timeInForce?: "GTC" | "IOC" | "FOK";
  reduceOnly?: boolean;
  closePosition?: boolean;
  stopOrderType?: "stopLoss" | "takeProfit";
  triggerPrice?: string;
}

export interface OndoperpsPosition {
  market: string;
  direction: "long" | "short" | "neutral";
  netQuantity: string;
  averageEntryPrice: string;
  usedMargin: string;
  unrealizedPnl: string;
  markPrice: string;
  liquidationPrice: string;
  bankruptcyPrice: string;
  maintenanceMargin: string;
  notionalValue: string;
  leverage: string;
  netFundingSinceNeutral: string;
  returnOnEquity: string;
  stopLossTriggerPrice?: string;
  takeProfitTriggerPrice?: string;
}

export interface OndoperpsBalance {
  walletBalance: string;
  realizedPnl: string;
  unrealizedPnl: string;
  marginBalance: string;
  usedMargin: string;
  availableMargin: string;
  withdrawableMargin: string;
  maintenanceMarginRequirement: string;
  totalMaintenanceMargin: string;
  marginRatio: string;
  leverage: string;
  underLiquidation: boolean;
  totalFundingPayments: string;
  totalTradingFees: string;
  totalPnL: string;
  netInvested?: string;
}

export interface OndoperpsStopOrders {
  market: string;
  positionDirection: "long" | "short" | "neutral";
  stopLoss?: string | null;
  takeProfit?: string | null;
}

export type OndoperpsBookLevel = [string, string];

export interface OndoperpsBookSnapshot {
  market: string;
  time: string;
  bids: OndoperpsBookLevel[];
  asks: OndoperpsBookLevel[];
  depthLevels?: string;
}

export interface OndoperpsCandle {
  startTime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface OndoperpsWsKline {
  m: string;
  t: number;
  s: number;
  e: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  x?: boolean;
}

export interface OndoperpsContract {
  market: string;
  displayName?: string;
  productType: string;
  contractType: string;
  baseCurrency: string;
  quoteCurrency: string;
  disabled: boolean;
  lastPrice?: string;
  baseVolume?: string;
  quoteVolume?: string;
  usdVolume?: string;
  bid?: string;
  ask?: string;
  high?: string;
  low?: string;
  openInterest?: string;
  openInterestUsd?: string;
  indexPrice?: string;
  fundingRate?: string;
  nextFundingRate?: string;
  nextFundingRateTimestamp?: string;
  makerFee?: string;
  takerFee?: string;
  priceChangePercent?: string;
  isClosed?: boolean;
}

export interface OndoperpsMarkPrice {
  market: string;
  price: string;
  markPrice: string;
  oraclePrice?: string;
  lastExternalPrice?: string;
  lastUpdatedTime?: string;
}

export interface OndoperpsFundingRate {
  market: string;
  rate: string;
  intervalEnds?: string;
}

export interface OndoperpsTradingPair {
  market: string;
  baseIncrement: string;
  quoteIncrement: string;
}

export interface OndoperpsMarketsResult {
  perps?: {
    tradingPairs?: OndoperpsTradingPair[];
  };
}

export interface OndoperpsWsMessage {
  type: "pong" | "loggedIn" | "subscribed" | "unsubscribed" | "update" | "error" | string;
  channel?: string;
  code?: number;
  msg?: string;
  data?: unknown;
}
