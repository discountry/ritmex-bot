import { describe, expect, it } from "vitest";
import { getDepthBetweenPrices } from "../src/utils/price";
import type { AsterDepth } from "../src/exchanges/types";

describe("getDepthBetweenPrices boundary", () => {
  it("SELL side excludes quantity exactly at target price", () => {
    const depth: AsterDepth = {
      lastUpdateId: 1,
      bids: [],
      asks: [
        ["69345", "1"],
        ["69349", "2"],
        ["69350", "999"],
        ["69351", "3"],
      ],
    };

    const total = getDepthBetweenPrices(depth, "SELL", 69350);
    expect(total).toBe(3); // 仅 69345 + 69349
  });

  it("BUY side excludes quantity exactly at target price", () => {
    const depth: AsterDepth = {
      lastUpdateId: 1,
     bids: [
        ["69355", "1"],
        ["69351", "2"],
        ["69350", "999"],
        ["69349", "3"],
      ],
      asks: [],
    };

    const total = getDepthBetweenPrices(depth, "BUY", 69350);
    expect(total).toBe(3); // 仅 69355 + 69351
  });
});
