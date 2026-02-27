import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveSymbolFromEnv } from "../src/config";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("resolveSymbolFromEnv", () => {
  it("prefers exchange-specific symbol when available", () => {
    process.env.EXCHANGE = "backpack";
    process.env.BACKPACK_SYMBOL = "ETHUSDC";
    process.env.TRADE_SYMBOL = "BTCUSDT";

    expect(resolveSymbolFromEnv()).toBe("ETHUSDC");
  });

  it("falls back to TRADE_SYMBOL when exchange symbol is missing", () => {
    process.env.EXCHANGE = "paradex";
    process.env.TRADE_SYMBOL = "ETH/USDC";
    delete process.env.PARADEX_SYMBOL;

    expect(resolveSymbolFromEnv()).toBe("ETH/USDC");
  });

  it("uses exchange-specific fallback when no env is defined", () => {
    process.env.EXCHANGE = "paradex";
    delete process.env.PARADEX_SYMBOL;
    delete process.env.TRADE_SYMBOL;

    expect(resolveSymbolFromEnv()).toBe("BTC/USDC");
  });

  it("supports resolving symbol for an explicit exchange id", () => {
    delete process.env.EXCHANGE;
    process.env.GRVT_SYMBOL = "ETHUSDT";

    expect(resolveSymbolFromEnv("grvt")).toBe("ETHUSDT");
  });

  it("supports standx symbol defaults when explicit exchange id is provided", () => {
    delete process.env.EXCHANGE;
    process.env.STANDX_SYMBOL = "ETH-USD";

    expect(resolveSymbolFromEnv("standx")).toBe("ETH-USD");
  });
});
