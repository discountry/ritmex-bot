import { describe, expect, it } from "vitest";
import { toAccountSnapshot } from "../../src/exchanges/lighter/mappers";
import type { LighterAccountDetails, LighterPosition } from "../../src/exchanges/lighter/types";

const baseDetails: LighterAccountDetails = {
  account_index: 1,
  collateral: "1000",
};

function createPosition(overrides: Partial<LighterPosition> = {}): LighterPosition {
  return {
    market_id: 101,
    symbol: "BTC/USDC:USDC",
    sign: 1,
    position: "0.5",
    avg_entry_price: "100",
    position_value: "50",
    unrealized_pnl: "0",
    realized_pnl: "0",
    ...overrides,
  } as LighterPosition;
}

describe("toAccountSnapshot", () => {
  it("includes positions that match the configured market id regardless of reported symbol format", () => {
    const snapshot = toAccountSnapshot(
      "BTC",
      baseDetails,
      [
        createPosition({ market_id: 101, symbol: "BTC/USDC:USDC" }),
        createPosition({ market_id: 202, symbol: "ETH/USDC:USDC", sign: -1 }),
      ],
      [],
      { marketSymbol: "BTC", marketId: 101 }
    );

    expect(snapshot.positions).toHaveLength(1);
    expect(snapshot.positions[0]).toMatchObject({ symbol: "BTC", positionAmt: "0.5" });
  });

  it("falls back to fuzzy symbol matching when market id is unavailable", () => {
    const snapshot = toAccountSnapshot(
      "BTC",
      baseDetails,
      [
        createPosition({ market_id: Number.NaN as number, symbol: "BTC/USDC:USDC" }),
        createPosition({ market_id: Number.NaN as number, symbol: "ETH/USDC:USDC" }),
      ],
      [],
      { marketSymbol: "BTC" }
    );

    expect(snapshot.positions).toHaveLength(1);
    expect(snapshot.positions[0]).toMatchObject({ symbol: "BTC", positionAmt: "0.5" });
  });
});
