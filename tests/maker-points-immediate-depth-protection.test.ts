import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker } from "../src/exchanges/types";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

class StubAdapter implements ExchangeAdapter {
  id = "standx";

  private depthListeners: Array<(depth: AsterDepth) => void> = [];

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(_cb: (snapshot: AsterAccountSnapshot) => void): void {}
  watchOrders(_cb: (orders: AsterOrder[]) => void): void {}
  watchTicker(_symbol: string, _cb: (ticker: AsterTicker) => void): void {}
  watchKlines(_symbol: string, _interval: string, _cb: (klines: AsterKline[]) => void): void {}

  watchDepth(_symbol: string, cb: (depth: AsterDepth) => void): void {
    this.depthListeners.push(cb);
  }

  emitDepth(depth: AsterDepth): void {
    for (const listener of this.depthListeners) {
      listener(depth);
    }
  }

  async createOrder(): Promise<AsterOrder> {
    throw new Error("not implemented");
  }

  async cancelOrder(): Promise<void> {}
  async cancelOrders(): Promise<void> {}
  async cancelAllOrders(): Promise<void> {}

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    return null;
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("MakerPointsEngine immediate depth protection", () => {
  it("triggers an immediate tick when depth drops below threshold", () => {
    vi.useFakeTimers();
    const adapter = new StubAdapter();

    const engine = new MakerPointsEngine(
      {
        symbol: "BTC-USD",
        perOrderAmount: 0.01,
        closeThreshold: 0,
        stopLossUsd: 1,
        refreshIntervalMs: 10_000,
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
        enableBinanceDepthCancel: false,
        filterMinDepth: 10,
      },
      adapter
    );

    (engine as any).feedStatus = { account: true, depth: true, ticker: true, orders: true, binance: true };
    (engine as any).initialOrderSnapshotReady = true;
    (engine as any).defenseMode = false;
    (engine as any).reconnectResetPending = false;
    (engine as any).stopLossProcessing = false;
    (engine as any).lastDepthOkStatus[9] = { buy: true, sell: true };

    const tickSpy = vi.spyOn(engine as any, "tick").mockResolvedValue(undefined);

    adapter.emitDepth({
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "1"]],
      eventTime: Date.now(),
      symbol: "BTC-USD",
    });

    expect(tickSpy).toHaveBeenCalledTimes(1);
    engine.stop();
  });
});
