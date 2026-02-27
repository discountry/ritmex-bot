import { describe, expect, it } from "vitest";
import { normalizeOrderIdentity, orderIdentityEquals } from "../../src/exchanges/lighter/order-identity";

describe("order identity helpers", () => {
  it("treats large numeric strings as distinct values", () => {
    const first = "27584547724798440";
    const second = "27584547724798442";
    expect(orderIdentityEquals(first, second)).toBe(false);
    expect(orderIdentityEquals(first, first)).toBe(true);
  });

  it("considers numeric inputs equal to their string counterparts", () => {
    expect(orderIdentityEquals(123456789, "123456789")).toBe(true);
  });

  it("normalizes whitespace-only identifiers to null", () => {
    expect(normalizeOrderIdentity("   ")).toBeNull();
  });

  it("falls back to truncated integers for floating inputs", () => {
    expect(normalizeOrderIdentity(42.9)).toBe("42");
  });
});
