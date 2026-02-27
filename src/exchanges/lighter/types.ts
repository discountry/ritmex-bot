export type LighterSide = "buy" | "sell" | "ask" | "bid" | string;
export type LighterOrderType =
  | "limit"
  | "market"
  | "stop_loss"
  | "stop_loss_limit"
  | "take_profit"
  | "take_profit_limit"
  | string;

type StrOrNum = string | number;

export interface LighterOrder {
  order_index: StrOrNum;
  client_order_index: StrOrNum;
  order_id?: string | null;
  client_order_id?: string | null;
  market_index: StrOrNum;
  owner_account_index?: number;
  initial_base_amount: string;
  remaining_base_amount: string;
  filled_base_amount?: string;
  filled_quote_amount?: string;
  price: string;
  nonce?: number;
  is_ask?: boolean;
  side?: LighterSide;
  type?: LighterOrderType;
  time_in_force?: string;
  trigger_price?: string;
  reduce_only?: boolean;
  status?: string | number;
  trigger_status?: string | number;
  trigger_time?: number;
  updated_at?: number;
  created_at?: number;
}

export interface LighterPosition {
  market_id: number;
  symbol: string;
  sign: number;
  position: string;
  avg_entry_price: string;
  position_value: string;
  unrealized_pnl: string;
  realized_pnl: string;
  liquidation_price?: string;
  initial_margin_fraction?: string;
  margin_mode?: number;
  allocated_margin?: string;
}

export interface LighterAccountDetails {
  collateral: string;
  available_balance?: string;
  total_asset_value?: string;
  cross_asset_value?: string;
  total_order_count?: number;
  assets?: LighterAccountAsset[];
  positions?: LighterPosition[];
  status?: number;
  account_index: number;
  l1_address?: string;
  name?: string;
  description?: string;
  pending_order_count?: number;
}

export interface LighterAccountAsset {
  symbol: string;
  asset_id?: number;
  balance: string | number;
  locked_balance?: string | number;
}

export interface LighterAuthToken {
  token: string;
  expiresAt: number;
}

export interface LighterOrderBookLevel {
  price: string;
  size: string;
}

export interface LighterOrderBookSnapshot {
  market_id: number;
  symbol?: string;
  offset?: number;
  bids: LighterOrderBookLevel[];
  asks: LighterOrderBookLevel[];
}

export interface LighterMarketStats {
  market_id: number;
  index_price: string;
  mark_price?: string;
  mid_price?: string;
  open_interest?: string;
  last_trade_price: string;
  symbol?: string;
  market_type?: "perp" | "spot" | string;
  current_funding_rate?: string;
  funding_rate?: string;
  funding_timestamp?: number;
  daily_base_token_volume?: number;
  daily_quote_token_volume?: number;
  daily_price_low?: number;
  daily_price_high?: number;
  daily_price_change?: number;
}

export interface LighterKline {
  start_timestamp: number;
  end_timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  base_token_volume: string;
  quote_token_volume: string;
  trades?: number;
}

export interface LighterOrderBookMetadata {
  symbol: string;
  market_id: number;
  market_type?: "perp" | "spot" | string;
  base_asset_id?: number;
  quote_asset_id?: number;
  maker_fee: string;
  taker_fee: string;
  min_base_amount: string;
  min_quote_amount: string;
  supported_size_decimals: number;
  supported_price_decimals: number;
  supported_quote_decimals: number;
  status: "inactive" | "frozen" | "active" | string;
}

export interface LighterAccountMarketUpdate {
  account: number;
  orders?: LighterOrder[];
  position?: LighterPosition;
  trades?: Array<Record<string, unknown>>;
  funding_history?: Array<Record<string, unknown>>;
  channel: string;
}

export interface LighterClientOptions {
  baseUrl: string;
  accountIndex: number;
  apiKeyIndex: number;
  apiPrivateKey: string;
  maxApiKeyIndex?: number;
  orderMarketId?: number;
  symbol: string;
  signerLibraryPath?: string;
  signerOverrides?: Partial<LighterSignerBinding>;
  priceDecimals?: number;
  sizeDecimals?: number;
  authExpiryBufferMs?: number;
}

export interface LighterSignerBinding {
  createClient(
    url: string,
    apiPrivateKey: string,
    chainId: number,
    apiKeyIndex: number,
    accountIndex: number
  ): string | null;
  switchApiKey(apiKeyIndex: number): string | null;
  createAuthToken(deadlineSeconds: number): StrOrErr;
  signCreateOrder(params: {
    marketIndex: number;
    clientOrderIndex: number;
    baseAmount: bigint;
    price: bigint;
    isAsk: number;
    orderType: number;
    timeInForce: number;
    reduceOnly: number;
    triggerPrice: bigint;
    orderExpiry: bigint;
    nonce: bigint;
  }): StrOrErr;
  signCancelOrder(params: {
    marketIndex: number;
    orderIndex: bigint;
    nonce: bigint;
  }): StrOrErr;
  signCancelAllOrders(params: {
    timeInForce: number;
    time: bigint;
    nonce: bigint;
  }): StrOrErr;
}

export interface StrOrErr {
  value: string | null;
  error?: string | null;
}

export interface LighterNonceManager {
  init(force?: boolean): Promise<void>;
  next(): { apiKeyIndex: number; nonce: bigint };
  acknowledgeFailure(apiKeyIndex: number): void;
  refresh(apiKeyIndex: number): Promise<void>;
}
