import type { ExchangeAdapter } from "./adapter";
import type { OrderSide, TimeInForce } from "./types";

export interface BaseOrderIntent {
  adapter: ExchangeAdapter;
  symbol: string;
  side: OrderSide;
  quantity: number;
  reduceOnly?: boolean;
  closePosition?: boolean;
  timeInForce?: TimeInForce | "GTX";
}

export interface LimitOrderIntent extends BaseOrderIntent {
  price: number;
  // StandX TPSL parameters
  slPrice?: number; // stop-loss price
  tpPrice?: number; // take-profit price
}

export interface MarketOrderIntent extends BaseOrderIntent {
  expectedPrice?: number | null;
}

export interface StopOrderIntent extends BaseOrderIntent {
  stopPrice: number;
  triggerType?: "UNSPECIFIED" | "TAKE_PROFIT" | "STOP_LOSS";
}

export interface TrailingStopOrderIntent extends BaseOrderIntent {
  activationPrice: number;
  callbackRate: number;
}

export interface ClosePositionIntent extends BaseOrderIntent {
  expectedPrice?: number | null;
}

export type ExchangeOrderType = "limit" | "market" | "stop" | "trailingStop" | "close";

export function toStringBoolean(value: boolean | undefined): "true" | "false" | undefined {
  if (value === undefined) return undefined;
  return value ? "true" : "false";
}

