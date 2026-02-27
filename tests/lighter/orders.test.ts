import { describe, expect, it } from "vitest";
import { lighterOrderToAster } from "../../src/exchanges/lighter/mappers";
import type { LighterOrder } from "../../src/exchanges/lighter/types";

function createOrder(overrides: Partial<LighterOrder> = {}): LighterOrder {
  return {
    order_index: 1,
    client_order_index: 1,
    market_index: 99,
    initial_base_amount: "0.1",
    remaining_base_amount: "0.1",
    price: "154.86",
    type: "limit",
    reduce_only: "No",
    side: "buy",
    ...overrides,
  } as LighterOrder;
}

describe("lighterOrderToAster", () => {
  it("treats textual reduce_only flags correctly", () => {
    const nonReduce = lighterOrderToAster("USDJPY", createOrder({ reduce_only: "No" }));
    expect(nonReduce.reduceOnly).toBe(false);

    const reduce = lighterOrderToAster("USDJPY", createOrder({ reduce_only: "Yes" }));
    expect(reduce.reduceOnly).toBe(true);
  });

  it("uses numeric is_ask flag for side inference", () => {
    const sell = lighterOrderToAster("USDJPY", createOrder({ is_ask: 1 }));
    expect(sell.side).toBe("SELL");

    const buy = lighterOrderToAster("USDJPY", createOrder({ is_ask: 0 }));
    expect(buy.side).toBe("BUY");
  });
});
