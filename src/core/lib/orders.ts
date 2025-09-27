import type { ExchangeAdapter } from "../../exchanges/adapter";
import type { AsterOrder } from "../../exchanges/types";
import { isUnknownOrderError } from "../../utils/errors";

export async function safeCancelOrder(
  exchange: ExchangeAdapter,
  symbol: string,
  order: AsterOrder,
  onResolved: (orderId: number | string) => void,
  onUnknown: () => void,
  onError: (err: unknown) => void
): Promise<void> {
  try {
    await exchange.cancelOrder({ symbol, orderId: order.orderId });
    onResolved(order.orderId);
  } catch (error) {
    if (isUnknownOrderError(error)) onUnknown();
    else onError(error);
  }
}

