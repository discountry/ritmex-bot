import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AccountSnapshot, Depth, Kline, Order, Ticker } from "../src/exchanges/types";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

class StubAdapter implements ExchangeAdapter {
  id = "standx";

  private depthListeners: Array<(depth: Depth) => void> = [];

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(_cb: (snapshot: AccountSnapshot) => void): void {}
  watchOrders(_cb: (orders: Order[]) => void): void {}
  watchTicker(_symbol: string, _cb: (ticker: Ticker) => void): void {}
  watchKlines(_symbol: string, _interval: string, _cb: (klines: Kline[]) => void): void {}

  watchDepth(_symbol: string, cb: (depth: Depth) => void): void {
    this.depthListeners.push(cb);
  }

  emitDepth(depth: Depth): void {
    for (const listener of this.depthListeners) {
      listener(depth);
    }
  }

  async createOrder(): Promise<Order> {
    throw new Error("not implemented");
  }

  async cancelOrder(): Promise<void> {}
  async cancelOrders(): Promise<void> {}
  async cancelAllOrders(): Promise<void> {}

  async queryAccountSnapshot(): Promise<AccountSnapshot | null> {
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
        band0To10Bps: 9,
        band10To30Bps: 29,
        band30To100Bps: 40,
        maxDistanceBps: 95,
        minRepriceBps: 3,
        bandRepriceRatio: 0.15,
        slOffsetBps: 2,
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
