import type { AsterOrder } from "../../exchanges/types";

export interface OrderTarget {
  side: "BUY" | "SELL";
  price: string; // 改为字符串避免精度问题
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
    const orderPrice = String(order.price);
    const reduceOnly = order.reduceOnly === true;
    const matchedIndex = targets.findIndex((target, index) => {
      const targetPrice = String(target.price);
      const orderPriceValue = Number(orderPrice);
      const targetPriceValue = Number(targetPrice);
      const priceMatches =
        Number.isFinite(orderPriceValue) && Number.isFinite(targetPriceValue)
          ? Math.abs(orderPriceValue - targetPriceValue) <= 1e-8
          : orderPrice === targetPrice;
      return (
        unmatched.has(index) &&
        target.side === order.side &&
        target.reduceOnly === reduceOnly &&
        priceMatches
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

