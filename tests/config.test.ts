import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

  it("supports binance symbol defaults when explicit exchange id is provided", () => {
    delete process.env.EXCHANGE;
    process.env.BINANCE_SYMBOL = "ETHUSDT";

    expect(resolveSymbolFromEnv("binance")).toBe("ETHUSDT");
  });

  it("supports Ondo Perps symbol defaults when explicit exchange id is provided", () => {
    delete process.env.EXCHANGE;
    process.env.ONDOPERPS_SYMBOL = "NVDA-USD.P";

    expect(resolveSymbolFromEnv("ondoperps")).toBe("NVDA-USD.P");
  });

  it("supports the legacy Ondo Perps exchange id and symbol prefix", () => {
    delete process.env.EXCHANGE;
    delete process.env.ONDOPERPS_SYMBOL;
    process.env.ONDOPERP_SYMBOL = "ETH-USD.P";

    expect(resolveSymbolFromEnv("ondoperp")).toBe("ETH-USD.P");
  });
});

describe("makerPointsConfig defaults", () => {
  async function loadConfig(env: Record<string, string> = {}) {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("MAKER_POINTS_")) delete process.env[key];
    }
    process.env.EXCHANGE = "standx";
    Object.assign(process.env, env);
    vi.resetModules();
    return (await import("../src/config")).makerPointsConfig;
  }

  it("runs on sane defaults when none of the new vars are set", async () => {
    const config = await loadConfig();

    expect(config.band0To10Bps).toBe(9);
    expect(config.band10To30Bps).toBe(29);
    expect(config.band30To100Bps).toBe(40);
    expect(config.maxDistanceBps).toBe(95);
    expect(config.minRepriceBps).toBe(3);
    expect(config.bandRepriceRatio).toBe(0.15);
    expect(config.slOffsetBps).toBe(2);
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === "number") {
        expect(Number.isFinite(value), `${key} must be finite`).toBe(true);
      }
    }
  });

  it("falls back to defaults for unparseable values", async () => {
    const config = await loadConfig({
      MAKER_POINTS_BAND_0_10_BPS: "abc",
      MAKER_POINTS_BAND_REPRICE_RATIO: "",
      MAKER_POINTS_SL_OFFSET_BPS: "not-a-number",
    });

    expect(config.band0To10Bps).toBe(9);
    expect(config.bandRepriceRatio).toBe(0.15);
    expect(config.slOffsetBps).toBe(2);
  });

  it("never lets the distance cap sit inside an enabled band", async () => {
    // 否则夹回会把挂单推向盘口，正好是最容易成交的方向
    const config = await loadConfig({
      MAKER_POINTS_MAX_DISTANCE_BPS: "20",
      MAKER_POINTS_BAND_30_100_BPS: "60",
    });

    expect(config.maxDistanceBps).toBe(60);
  });

  it("ignores a disabled band when widening the cap", async () => {
    const config = await loadConfig({
      MAKER_POINTS_MAX_DISTANCE_BPS: "20",
      MAKER_POINTS_BAND_30_100: "false",
      MAKER_POINTS_BAND_30_100_BPS: "60",
    });

    expect(config.maxDistanceBps).toBe(29);
  });

  it("caps the distance at the zero-points cliff", async () => {
    const config = await loadConfig({ MAKER_POINTS_MAX_DISTANCE_BPS: "500" });

    expect(config.maxDistanceBps).toBe(100);
  });
});
