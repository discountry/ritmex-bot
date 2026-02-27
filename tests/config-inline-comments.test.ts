import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

async function loadConfig() {
  vi.resetModules();
  return await import("../src/config");
}

describe("config env parsing", () => {
  it("strips shell-style inline comments from symbol values", async () => {
    process.env.EXCHANGE = "standx";
    process.env.STANDX_SYMBOL = "BTC-USD # comment";

    const { resolveSymbolFromEnv } = await loadConfig();
    expect(resolveSymbolFromEnv()).toBe("BTC-USD");
  });

  it("parses numeric maker-points env values with inline comments", async () => {
    process.env.EXCHANGE = "standx";
    process.env.MAKER_POINTS_STOP_LOSS_USD = "1 # comment";
    process.env.MAKER_POINTS_CLOSE_THRESHOLD = "2 ; comment";
    process.env.MAKER_POINTS_BINANCE_DEPTH_WINDOW_BPS = "6 # comment";
    process.env.MAKER_POINTS_BINANCE_DEPTH_IMBALANCE_RATIO = "9 ; comment";

    const { makerPointsConfig } = await loadConfig();
    expect(makerPointsConfig.stopLossUsd).toBe(1);
    expect(makerPointsConfig.closeThreshold).toBe(2);
    expect(makerPointsConfig.binanceDepthWindowBps).toBe(6);
    expect(makerPointsConfig.binanceDepthImbalanceRatio).toBe(9);
  });

  it("parses boolean maker-points env values with inline comments", async () => {
    process.env.EXCHANGE = "standx";
    process.env.MAKER_POINTS_BAND_10_30 = "false # comment";

    const { makerPointsConfig } = await loadConfig();
    expect(makerPointsConfig.enableBand10To30).toBe(false);
  });
});
