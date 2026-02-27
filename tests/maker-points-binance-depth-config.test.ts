import { describe, expect, it } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker } from "../src/exchanges/types";
import { t } from "../src/i18n";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

class StubAdapter implements ExchangeAdapter {
  id = "standx";

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(_cb: (snapshot: AsterAccountSnapshot) => void): void {}
  watchOrders(_cb: (orders: AsterOrder[]) => void): void {}
  watchDepth(_symbol: string, _cb: (depth: AsterDepth) => void): void {}
  watchTicker(_symbol: string, _cb: (ticker: AsterTicker) => void): void {}
  watchKlines(_symbol: string, _interval: string, _cb: (klines: AsterKline[]) => void): void {}

  async createOrder(): Promise<AsterOrder> {
    throw new Error("not implemented");
  }

  async cancelOrder(): Promise<void> {}
  async cancelOrders(): Promise<void> {}
  async cancelAllOrders(): Promise<void> {}
}

describe("MakerPointsEngine Binance depth monitor config", () => {
  it("uses default 3bps window and ratio 9", () => {
    const engine = new MakerPointsEngine(
      {
        symbol: "BTC-USD",
        perOrderAmount: 0.01,
        closeThreshold: 0,
        stopLossUsd: 1,
        refreshIntervalMs: 500,
        maxLogEntries: 20,
        maxCloseSlippagePct: 0.05,
        priceTick: 0.1,
        qtyStep: 0.001,
        enableBand0To10: true,
        enableBand10To30: false,
        enableBand30To100: false,
        band0To10Amount: 0.01,
        band10To30Amount: 0.01,
        band30To100Amount: 0.01,
        minRepriceBps: 3,
        enableBinanceDepthCancel: true,
        filterMinDepth: 0,
      },
      new StubAdapter()
    );

    const trackerOptions = ((engine as any).binanceDepth as { options?: { depthWindowBps?: number; ratio?: number } })
      .options;

    expect(trackerOptions?.depthWindowBps).toBe(3);
    expect(trackerOptions?.ratio).toBe(9);

    engine.stop();
  });

  it("uses configured window and ratio", () => {
    const engine = new MakerPointsEngine(
      {
        symbol: "BTC-USD",
        perOrderAmount: 0.01,
        closeThreshold: 0,
        stopLossUsd: 1,
        refreshIntervalMs: 500,
        maxLogEntries: 20,
        maxCloseSlippagePct: 0.05,
        priceTick: 0.1,
        qtyStep: 0.001,
        enableBand0To10: true,
        enableBand10To30: false,
        enableBand30To100: false,
        band0To10Amount: 0.01,
        band10To30Amount: 0.01,
        band30To100Amount: 0.01,
        minRepriceBps: 3,
        enableBinanceDepthCancel: true,
        binanceDepthWindowBps: 7,
        binanceDepthImbalanceRatio: 11,
        filterMinDepth: 0,
      },
      new StubAdapter()
    );

    const trackerOptions = ((engine as any).binanceDepth as { options?: { depthWindowBps?: number; ratio?: number } })
      .options;

    expect(trackerOptions?.depthWindowBps).toBe(7);
    expect(trackerOptions?.ratio).toBe(11);

    engine.stop();
  });

  it("renders binance depth line with dynamic window bps", () => {
    const line = t(
      "makerPoints.binanceLine",
      { windowBps: 5, buy: "1.23", sell: "1.11", status: "Balanced" },
      "en"
    );

    expect(line).toContain("±5bps");
  });
});
