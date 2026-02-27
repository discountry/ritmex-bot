import { describe, expect, it } from "vitest";
import type { AsterAccountSnapshot } from "../src/exchanges/types";
import { validateAccountSnapshotForSymbol } from "../src/utils/strategy";

function baseSnapshot(positions: AsterAccountSnapshot["positions"]): AsterAccountSnapshot {
  return {
    canTrade: true,
    canDeposit: true,
    canWithdraw: true,
    updateTime: Date.now(),
    totalWalletBalance: "0",
    totalUnrealizedProfit: "0",
    positions,
    assets: [],
    marketType: "perp",
  };
}

describe("validateAccountSnapshotForSymbol", () => {
  it("accepts empty positions", () => {
    const result = validateAccountSnapshotForSymbol(baseSnapshot([]), "BTC-USD");
    expect(result.ok).toBe(true);
  });

  it("accepts zero-sized positions even if entry price is zero", () => {
    const result = validateAccountSnapshotForSymbol(
      baseSnapshot([
        {
          symbol: "BTC-USD",
          positionAmt: "0",
          entryPrice: "0",
          unrealizedProfit: "0",
          positionSide: "BOTH",
          updateTime: Date.now(),
          markPrice: "0",
        },
      ]),
      "BTC-USD"
    );
    expect(result.ok).toBe(true);
  });

  it("flags invalid numeric fields for non-zero positions", () => {
    const result = validateAccountSnapshotForSymbol(
      baseSnapshot([
        {
          symbol: "BTC-USD",
          positionAmt: "1",
          entryPrice: "NaN",
          unrealizedProfit: "oops",
          positionSide: "BOTH",
          updateTime: Date.now(),
          markPrice: "-1",
        },
      ]),
      "BTC-USD"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual(
        expect.arrayContaining(["invalid_entryPrice", "invalid_unrealizedProfit", "invalid_markPrice"])
      );
    }
  });

  it("flags invalid positionAmt", () => {
    const result = validateAccountSnapshotForSymbol(
      baseSnapshot([
        {
          symbol: "BTC-USD",
          positionAmt: "abc",
          entryPrice: "100",
          unrealizedProfit: "0",
          positionSide: "BOTH",
          updateTime: Date.now(),
          markPrice: "101",
        },
      ]),
      "BTC-USD"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContain("invalid_positionAmt");
    }
  });
});

