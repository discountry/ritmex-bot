import { describe, expect, it } from "vitest";
import type { LighterOrderBookMetadata } from "../../src/exchanges/lighter/types";
import { LighterGateway } from "../../src/exchanges/lighter/gateway";

const pickBestOrderBook = (books: LighterOrderBookMetadata[], desiredSymbol: string) =>
  (LighterGateway.prototype as any).pickBestOrderBook.call({}, books, desiredSymbol);

describe("pickBestOrderBook", () => {
  const spotBook = {
    market_id: 2048,
    symbol: "ETH/USDC",
    market_type: "spot",
    supported_price_decimals: 2,
    supported_size_decimals: 4,
    min_base_amount: "0.0001",
    min_quote_amount: "5",
  } as LighterOrderBookMetadata;

  const perpBook = {
    market_id: 3048,
    symbol: "ETH-PERP",
    market_type: "perp",
    supported_price_decimals: 2,
    supported_size_decimals: 3,
    min_base_amount: "0.001",
    min_quote_amount: "5",
  } as LighterOrderBookMetadata;

  it("prefers perp when desired symbol does not explicitly request spot", () => {
    const picked = pickBestOrderBook([spotBook, perpBook], "ETH");
    expect(picked?.market_type).toBe("perp");
    expect(picked?.market_id).toBe(3048);
  });

  it("still prefers spot when symbol clearly indicates spot", () => {
    const picked = pickBestOrderBook([spotBook, perpBook], "ETH/USDC");
    expect(picked?.market_type).toBe("spot");
    expect(picked?.market_id).toBe(2048);
  });
});
