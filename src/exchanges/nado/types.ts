export type NadoProductType = "spot" | "perp";

export interface NadoContractsResponse {
  status: "success" | "failure";
  data?: {
    chain_id: string;
    endpoint_addr: string;
  };
  error?: string;
  error_code?: number;
  request_type?: string;
}

export interface NadoSymbolsResponse {
  status: "success" | "failure";
  data?: {
    symbols: Record<
      string,
      {
        type: NadoProductType;
        product_id: number;
        symbol: string;
        price_increment_x18: string;
        size_increment: string;
        min_size: string;
        maker_fee_rate_x18?: string;
        taker_fee_rate_x18?: string;
      }
    >;
  };
  error?: string;
  error_code?: number;
  request_type?: string;
}

export interface NadoSubaccountOrdersResponse {
  status: "success" | "failure";
  data?: {
    sender: string;
    product_id: number;
    orders: Array<{
      product_id: number;
      sender: string;
      price_x18: string;
      amount: string;
      expiration: string;
      nonce: string;
      unfilled_amount: string;
      digest: string;
      placed_at: number;
      appendix?: string;
      order_type?: string;
    }>;
  };
  error?: string;
  error_code?: number;
  request_type?: string;
}

export interface NadoSubaccountInfoResponse {
  status: "success" | "failure";
  data?: {
    subaccount: string;
    exists: boolean;
    healths: Array<{ assets: string; liabilities: string; health: string }>;
    spot_balances: Array<{ product_id: number; balance: { amount: string } }>;
    perp_balances: Array<{
      product_id: number;
      balance: {
        amount: string;
        v_quote_balance: string;
        last_cumulative_funding_x18?: string;
      };
    }>;
    spot_products: Array<{
      product_id: number;
      oracle_price_x18: string;
      book_info?: {
        size_increment: string;
        price_increment_x18: string;
        min_size: string;
      };
    }>;
    perp_products: Array<{
      product_id: number;
      oracle_price_x18: string;
      book_info?: {
        size_increment: string;
        price_increment_x18: string;
        min_size: string;
      };
    }>;
  };
  error?: string;
  error_code?: number;
  request_type?: string;
}

export interface NadoSubscriptionAck {
  result: unknown;
  id: number;
}

export interface NadoOrderUpdateEvent {
  type: "order_update";
  timestamp: string;
  product_id: number;
  digest: string;
  amount: string;
  reason: "filled" | "cancelled" | "placed";
  id?: number;
}

export interface NadoPositionChangeEvent {
  type: "position_change";
  timestamp: string;
  product_id: number;
  subaccount: string;
  isolated: boolean;
  amount: string;
  v_quote_amount: string;
  reason: string;
}

export interface NadoBestBidOfferEvent {
  type: "best_bid_offer";
  timestamp: string;
  product_id: number;
  bid_price: string;
  bid_qty: string;
  ask_price: string;
  ask_qty: string;
}

export interface NadoTradeEvent {
  type: "trade";
  timestamp: string;
  product_id: number;
  price: string;
  taker_qty: string;
  maker_qty: string;
  is_taker_buyer: boolean;
}

export interface NadoLatestCandlestickEvent {
  type: "latest_candlestick";
  timestamp: number;
  product_id: number;
  granularity: number;
  open_x18: string;
  high_x18: string;
  low_x18: string;
  close_x18: string;
  volume: string;
}

export interface NadoFundingRateEvent {
  type: "funding_rate";
  // timestamp when the event was generated, in nanoseconds
  timestamp: string;
  product_id: number;
  // latest 24hr funding rate, multiplied by 1e18
  funding_rate_x18: string;
  // epoch time in seconds when the funding rate was updated
  update_time: string;
}
