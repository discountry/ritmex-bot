import { describe, expect, it } from "vitest";
import { computeStopLossPnl } from "../src/utils/pnl";

describe("computeStopLossPnl", () => {
  it("falls back to exchange-provided unrealized PnL when entryPrice is missing", () => {
    const pnl = computeStopLossPnl(
      { positionAmt: 1, entryPrice: 0, unrealizedProfit: -2000, markPrice: null },
      40000,
      40010
    );
    expect(pnl).toBe(-2000);
  });

  it("uses best bid/ask when entryPrice is available", () => {
    const longPnl = computeStopLossPnl(
      { positionAmt: 1, entryPrice: 100, unrealizedProfit: -5, markPrice: null },
      90,
      91
    );
    expect(longPnl).toBe(-10);

    const shortPnl = computeStopLossPnl(
      { positionAmt: -2, entryPrice: 100, unrealizedProfit: -5, markPrice: null },
      95,
      105
    );
    expect(shortPnl).toBe(-10);
  });

  it("falls back to exchange-provided unrealized PnL when best prices are unavailable", () => {
    const pnl = computeStopLossPnl(
      { positionAmt: 1, entryPrice: 100, unrealizedProfit: -123, markPrice: null },
      null,
      null
    );
    expect(pnl).toBe(-123);
  });
});

