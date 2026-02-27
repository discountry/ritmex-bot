import { describe, expect, it } from "vitest";
import { shouldResetMarketOrders } from "../../src/exchanges/lighter/order-feed";

describe("shouldResetMarketOrders", () => {
  it("always resets on snapshots", () => {
    expect(shouldResetMarketOrders([{ id: 1 }], true)).toBe(true);
    expect(shouldResetMarketOrders([], true)).toBe(true);
    expect(shouldResetMarketOrders(null, true)).toBe(true);
  });

  it("resets when array bucket is empty", () => {
    expect(shouldResetMarketOrders([], false)).toBe(true);
    expect(shouldResetMarketOrders([{}], false)).toBe(false);
  });

  it("resets when object bucket has no keys", () => {
    expect(shouldResetMarketOrders({}, false)).toBe(true);
    expect(shouldResetMarketOrders({ a: 1 }, false)).toBe(false);
  });

  it("does not reset for non-empty updates", () => {
    expect(shouldResetMarketOrders([{ order_index: "1" }], false)).toBe(false);
    expect(shouldResetMarketOrders(null, false)).toBe(false);
    expect(shouldResetMarketOrders(undefined, false)).toBe(false);
  });
});
