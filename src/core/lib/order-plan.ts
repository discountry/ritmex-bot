import type { AsterOrder } from "../../exchanges/types";

export interface OrderTarget {
  side: "BUY" | "SELL";
  price: number;
  amount: number;
  reduceOnly: boolean;
}

export function makeOrderPlan(
  openOrders: AsterOrder[],
  targets: OrderTarget[]
): { toCancel: AsterOrder[]; toPlace: OrderTarget[] } {
  const unmatched = new Set(targets.map((_, idx) => idx));
  const toCancel: AsterOrder[] = [];

  for (const order of openOrders) {
    const price = Number(order.price);
    if (!Number.isFinite(price)) {
      toCancel.push(order);
      continue;
    }
    const reduceOnly = order.reduceOnly === true;
    const matchedIndex = targets.findIndex((target, index) => {
      return (
        unmatched.has(index) &&
        target.side === order.side &&
        target.reduceOnly === reduceOnly &&
        price === target.price
      );
    });
    if (matchedIndex >= 0) {
      unmatched.delete(matchedIndex);
    } else {
      toCancel.push(order);
    }
  }

  const toPlace = [...unmatched]
    .map((idx) => targets[idx])
    .filter((t): t is OrderTarget => t !== undefined && t.amount > 1e-5);

  return { toCancel, toPlace };
}


