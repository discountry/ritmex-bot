import type { AsterOrder, CreateOrderParams } from "../types";
import type {
  BaseOrderIntent,
  ClosePositionIntent,
  LimitOrderIntent,
  MarketOrderIntent,
  StopOrderIntent,
  TrailingStopOrderIntent,
} from "../order-schema";
import { toStringBoolean } from "../order-schema";

function applyCommonFields(params: CreateOrderParams, intent: BaseOrderIntent): CreateOrderParams {
  if (params.quantity === undefined) {
    params.quantity = intent.quantity;
  }
  if (params.timeInForce === undefined && intent.timeInForce) {
    params.timeInForce = intent.timeInForce;
  }
  if (intent.reduceOnly !== undefined) {
    params.reduceOnly = toStringBoolean(intent.reduceOnly);
  }
  if (intent.closePosition !== undefined) {
    params.closePosition = toStringBoolean(intent.closePosition);
  }
  return params;
}

export async function createLimitOrder(intent: LimitOrderIntent): Promise<AsterOrder> {
  const params: CreateOrderParams = applyCommonFields(
    {
      symbol: intent.symbol,
      side: intent.side,
      type: "LIMIT",
      quantity: intent.quantity,
      price: intent.price,
      timeInForce: intent.timeInForce ?? "GTX",
    },
    intent
  );
  return intent.adapter.createOrder(params);
}

export async function createMarketOrder(intent: MarketOrderIntent): Promise<AsterOrder> {
  const params: CreateOrderParams = applyCommonFields(
    {
      symbol: intent.symbol,
      side: intent.side,
      type: "MARKET",
      quantity: intent.quantity,
    },
    intent
  );
  return intent.adapter.createOrder(params);
}

export async function createStopOrder(intent: StopOrderIntent): Promise<AsterOrder> {
  const params: CreateOrderParams = applyCommonFields(
    {
      symbol: intent.symbol,
      side: intent.side,
      type: "STOP_MARKET",
      quantity: intent.quantity,
      stopPrice: intent.stopPrice,
      timeInForce: intent.timeInForce ?? "GTC",
      triggerType: intent.triggerType,
    },
    intent
  );
  return intent.adapter.createOrder(params);
}

export async function createTrailingStopOrder(intent: TrailingStopOrderIntent): Promise<AsterOrder> {
  const params: CreateOrderParams = applyCommonFields(
    {
      symbol: intent.symbol,
      side: intent.side,
      type: "TRAILING_STOP_MARKET",
      quantity: intent.quantity,
      activationPrice: intent.activationPrice,
      callbackRate: intent.callbackRate,
      timeInForce: intent.timeInForce ?? "GTC",
    },
    intent
  );
  return intent.adapter.createOrder(params);
}

export async function createClosePositionOrder(intent: ClosePositionIntent): Promise<AsterOrder> {
  const params: CreateOrderParams = applyCommonFields(
    {
      symbol: intent.symbol,
      side: intent.side,
      type: "MARKET",
      quantity: intent.quantity,
      reduceOnly: "true",
    },
    intent
  );
  return intent.adapter.createOrder(params);
}

