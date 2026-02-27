export interface StandxOrder {
  id?: number;
  cl_ord_id?: string;
  symbol: string;
  side: string;
  order_type: string;
  qty: string;
  price?: string;
  fill_qty?: string;
  fill_avg_price?: string;
  reduce_only?: boolean;
  time_in_force?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StandxPosition {
  symbol: string;
  qty: string;
  entry_price?: string;
  mark_price?: string;
  upnl?: string;
  leverage?: string;
  liq_price?: string;
  margin_mode?: string;
  time?: string;
  updated_at?: string;
}

export interface StandxBalance {
  token: string;
  free?: string;
  locked?: string;
  total?: string;
  updated_at?: string;
}

export interface StandxDepthBook {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
}

export interface StandxPrice {
  symbol: string;
  last_price?: string;
  mark_price?: string;
  index_price?: string;
  mid_price?: string;
  spread_bid?: string;
  spread_ask?: string;
  spread?: [string, string];
  time?: string;
}

export interface StandxSymbolInfo {
  symbol: string;
  price_tick_decimals?: number;
  qty_tick_decimals?: number;
  min_order_qty?: string;
  max_order_qty?: string;
  depth_ticks?: string;
}

export interface StandxSymbolMarket {
  symbol: string;
  funding_rate?: string;
  next_funding_time?: string;
}

export interface StandxBalanceSnapshot {
  balance?: string;
  upnl?: string;
  cross_available?: string;
  cross_balance?: string;
  isolated_balance?: string;
  cross_upnl?: string;
  isolated_upnl?: string;
  locked?: string;
}

export interface StandxKlineHistory {
  s?: string;
  t?: number[];
  o?: number[];
  h?: number[];
  l?: number[];
  c?: number[];
  v?: number[];
}
