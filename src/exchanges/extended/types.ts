export interface ExtendedMarket {
  name: string;
  assetName?: string;
  collateralAssetName?: string;
  marketStats?: {
    lastPrice?: string;
    askPrice?: string;
    bidPrice?: string;
    markPrice?: string;
    indexPrice?: string;
  };
  tradingConfig: {
    minOrderSize: string;
    minOrderSizeChange: string;
    minPriceChange: string;
    maxPositionValue: string;
  };
  l2Config: {
    collateralId: string;
    collateralResolution: number;
    syntheticId: string;
    syntheticResolution: number;
  };
}

export interface ExtendedFees {
  market: string;
  makerFeeRate: string;
  takerFeeRate: string;
  builderFeeRate?: string;
}

export interface ExtendedBalance {
  collateralName?: string;
  balance: string;
  equity?: string;
  availableForTrade?: string;
  availableForWithdrawal?: string;
  unrealisedPnl?: string;
  initialMargin?: string;
  marginRatio?: string;
  updatedTime?: number;
  exposure?: string;
  leverage?: string;
}

export interface ExtendedPosition {
  id?: number | string;
  accountId?: number | string;
  market: string;
  side: "LONG" | "SHORT";
  leverage?: string;
  size: string;
  value?: string;
  openPrice?: string;
  markPrice?: string;
  liquidationPrice?: string;
  margin?: string;
  unrealisedPnl?: string;
  realisedPnl?: string;
  tpTriggerPrice?: string;
  tpLimitPrice?: string;
  slTriggerPrice?: string;
  slLimitPrice?: string;
  adl?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ExtendedTrigger {
  triggerPrice?: string;
  triggerPriceType?: "LAST" | "MARK" | "INDEX";
  triggerPriceDirection?: "UP" | "DOWN";
  direction?: "UP" | "DOWN";
  executionPriceType?: "LIMIT" | "MARKET";
}

export interface ExtendedOrder {
  id: string | number;
  externalId?: string;
  accountId?: string | number;
  market: string;
  type: "LIMIT" | "MARKET" | "CONDITIONAL" | "TPSL" | string;
  side: "BUY" | "SELL";
  status: string;
  price?: string;
  averagePrice?: string;
  qty: string;
  filledQty?: string;
  payedFee?: string;
  reduceOnly?: boolean;
  postOnly?: boolean;
  trigger?: ExtendedTrigger;
  takeProfit?: {
    triggerPrice?: string;
    triggerPriceType?: ExtendedTrigger["triggerPriceType"];
    price?: string;
    priceType?: "LIMIT" | "MARKET";
  };
  stopLoss?: {
    triggerPrice?: string;
    triggerPriceType?: ExtendedTrigger["triggerPriceType"];
    price?: string;
    priceType?: "LIMIT" | "MARKET";
  };
  tpSlType?: "ORDER" | "POSITION";
  createdTime: number;
  updatedTime?: number;
  expireTime?: number;
}

export interface ExtendedTrade {
  m: string; // market
  S: "BUY" | "SELL";
  tT: string;
  T: number;
  p: string;
  q: string;
  i: number;
}

export interface ExtendedCandle {
  T: number;
  o: string;
  h: string;
  l: string;
  c: string;
  v?: string;
}

export interface ExtendedStarknetDomain {
  name: string;
  version: string;
  chainId: string;
  revision: number;
}

export interface ExtendedDepthLevel {
  p: string;
  q: string;
}

export interface ExtendedDepthMessage {
  ts: number;
  type?: "SNAPSHOT" | "DELTA";
  data: {
    m: string;
    b?: ExtendedDepthLevel[];
    a?: ExtendedDepthLevel[];
  };
  seq?: number;
}
