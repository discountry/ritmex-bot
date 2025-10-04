export interface EdgeXMetaResponse {
  code: string;
  data: {
    global: EdgeXGlobalMeta;
    coinList: EdgeXCoinMeta[];
    contractList: EdgeXContractMeta[];
  };
}

export interface EdgeXGlobalMeta {
  appEnv: string;
  starkExCollateralCoin: EdgeXCoinMeta;
}

export interface EdgeXCoinMeta {
  coinId: string;
  coinName: string;
  stepSize?: string;
  starkExAssetId: string;
  starkExResolution: string;
}

export interface EdgeXContractMeta {
  contractId: string;
  contractName: string;
  baseCoinId: string;
  quoteCoinId: string;
  tickSize: string;
  stepSize: string;
  minOrderSize: string;
  maxOrderSize: string;
  defaultTakerFeeRate: string;
  defaultMakerFeeRate: string;
  displayDigitMerge?: string;
  displayMaxLeverage?: string;
  displayMinLeverage?: string;
  starkExSyntheticAssetId: string;
  starkExResolution: string;
}

export interface EdgeXAccountSnapshotResponse<T> {
  code: string;
  data: T;
}

export interface EdgeXOrderRequest {
  accountId: string;
  contractId: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET" | "STOP_MARKET" | "TAKE_PROFIT" | string;
  timeInForce: string;
  price?: string;
  size: string;
  triggerPrice?: string;
  triggerPriceType?: string;
  reduceOnly?: boolean;
  isPositionTpsl?: boolean;
  isSetOpenTp?: boolean;
  isSetOpenSl?: boolean;
  clientOrderId: string;
  expireTime: string;
  l2Nonce: string;
  l2Value: string;
  l2Size: string;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: string;
  extraType?: string;
  extraDataJson?: string;
}

export interface EdgeXCancelOrderRequest {
  accountId: string;
  orderId: string;
}

export interface EdgeXCancelAllRequest {
  accountId: string;
  contractId?: string;
}

export interface EdgeXOpenOrder {
  orderId: string;
  clientOrderId: string;
  contractId: string;
  accountId: string;
  side: "BUY" | "SELL";
  type: string;
  price: string;
  size: string;
  filledSize?: string;
  status: string;
  createTime: string;
  updateTime?: string;
  l2Nonce?: string;
}

export interface EdgeXPrivateWsMessage<T = unknown> {
  type: string;
  content?: {
    event: string;
    version?: string;
    data?: T;
  };
}

export interface EdgeXTradeEvent {
  account?: EdgeXAccountUpdate[];
  order?: EdgeXOrderUpdate[];
  position?: EdgeXPositionUpdate[];
  collateral?: EdgeXCollateralUpdate[];
  orderFillTransaction?: EdgeXOrderFillUpdate[];
}

export interface EdgeXAccountUpdate {
  accountId: string;
  totalEquity?: string;
  availableBalance?: string;
  totalMaintenanceMargin?: string;
}

export interface EdgeXCollateralUpdate {
  coinId: string;
  balance: string;
  availableBalance: string;
}

export interface EdgeXPositionUpdate {
  contractId: string;
  size: string;
  averageEntryPrice?: string;
  unrealizedPnl?: string;
  leverage?: string;
  maintenanceMargin?: string;
  markPrice?: string;
}

export interface EdgeXOrderUpdate {
  orderId: string;
  clientOrderId: string;
  contractId: string;
  accountId: string;
  status: string;
  price: string;
  size: string;
  filledSize?: string;
  side: "BUY" | "SELL";
  type: string;
  updateTime?: string;
  createTime?: string;
}

export interface EdgeXOrderFillUpdate {
  orderId: string;
  fillPrice: string;
  fillSize: string;
  fee: string;
  side: "BUY" | "SELL";
  timestamp: string;
}

export interface EdgeXDepthMessage {
  type: string;
  channel: string;
  content?: {
    dataType: "Snapshot" | "Changed" | string;
    data: Array<{
      bids: Array<[string, string]>;
      asks: Array<[string, string]>;
      depthType?: string;
      startVersion?: string;
      endVersion?: string;
      contractId: string;
    }>;
  };
}

export interface EdgeXTickerMessage {
  type: string;
  channel: string;
  content?: {
    dataType: "Snapshot" | "Changed" | string;
    data: Array<{
      contractId: string;
      lastPrice?: string;
      high?: string;
      low?: string;
      open?: string;
      close?: string;
      size?: string;
      value?: string;
      trades?: string;
    }>;
  };
}

export interface EdgeXKlineMessage {
  type: string;
  channel: string;
  content?: {
    dataType: "Snapshot" | "Changed" | string;
    data: Array<{
      contractId: string;
      klineType: string;
      klineTime: string;
      open: string;
      high: string;
      low: string;
      close: string;
      size: string;
      value: string;
      trades: string;
    }>;
  };
}
