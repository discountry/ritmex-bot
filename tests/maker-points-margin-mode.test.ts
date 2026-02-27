import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker } from "../src/exchanges/types";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

class StandxStubAdapter implements ExchangeAdapter {
  id = "standx";
  marginMode: "cross" | "isolated" = "cross";
  changeCalls: Array<{ symbol: string; marginMode: "isolated" | "cross" }> = [];

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

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Date.now(),
      totalWalletBalance: "0",
      totalUnrealizedProfit: "0",
      marketType: "perp",
      positions: [
        {
          symbol: "BTC-USD",
          positionAmt: "0",
          entryPrice: "0",
          unrealizedProfit: "0",
          positionSide: "BOTH",
          updateTime: Date.now(),
          marginType: this.marginMode,
        },
      ],
      assets: [],
    };
  }

  async changeMarginMode(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void> {
    this.changeCalls.push(params);
    this.marginMode = params.marginMode;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe("MakerPointsEngine StandX isolated margin guard", () => {
  it("switches to isolated before placing orders", async () => {
    vi.useFakeTimers();
    const adapter = new StandxStubAdapter();

    const engine = new MakerPointsEngine(
      {
        symbol: "BTC-USD",
        perOrderAmount: 0.01,
        closeThreshold: 0,
        stopLossUsd: 1,
        refreshIntervalMs: 500,
        maxLogEntries: 10,
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
        filterMinDepth: 0,
      },
      adapter
    );

    // Seed engine state to pass readiness checks without WS.
    (engine as any).feedStatus = { account: true, depth: true, ticker: true, orders: true, binance: true };
    (engine as any).initialOrderSnapshotReady = true;
    (engine as any).accountSnapshot = await adapter.queryAccountSnapshot();
    (engine as any).depthSnapshot = {
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "1"]],
      eventTime: Date.now(),
      symbol: "BTC-USD",
    } as AsterDepth;
    (engine as any).tickerSnapshot = {
      symbol: "BTC-USD",
      lastPrice: "100",
      openPrice: "0",
      highPrice: "0",
      lowPrice: "0",
      volume: "0",
      quoteVolume: "0",
      eventTime: Date.now(),
    } as AsterTicker;

    const syncSpy = vi.fn().mockResolvedValue(undefined);
    (engine as any).syncOrders = syncSpy;

    // First tick should force margin mode to isolated and then proceed to sync orders.
    await (engine as any).tick();

    expect(adapter.changeCalls).toEqual([{ symbol: "BTC-USD", marginMode: "isolated" }]);
    expect(syncSpy).toHaveBeenCalledTimes(1);

    engine.stop();
  });

  it("enters defense mode if it cannot switch to isolated", async () => {
    vi.useFakeTimers();
    const adapter = new StandxStubAdapter();
    adapter.changeMarginMode = vi.fn(async () => {
      throw new Error("change failed");
    }) as any;

    const engine = new MakerPointsEngine(
      {
        symbol: "BTC-USD",
        perOrderAmount: 0.01,
        closeThreshold: 0,
        stopLossUsd: 1,
        refreshIntervalMs: 500,
        maxLogEntries: 10,
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
        filterMinDepth: 0,
      },
      adapter
    );

    (engine as any).feedStatus = { account: true, depth: true, ticker: true, orders: true, binance: true };
    (engine as any).initialOrderSnapshotReady = true;
    (engine as any).accountSnapshot = await adapter.queryAccountSnapshot();
    (engine as any).depthSnapshot = {
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "1"]],
      eventTime: Date.now(),
      symbol: "BTC-USD",
    } as AsterDepth;
    (engine as any).tickerSnapshot = {
      symbol: "BTC-USD",
      lastPrice: "100",
      openPrice: "0",
      highPrice: "0",
      lowPrice: "0",
      volume: "0",
      quoteVolume: "0",
      eventTime: Date.now(),
    } as AsterTicker;

    const syncSpy = vi.fn().mockResolvedValue(undefined);
    (engine as any).syncOrders = syncSpy;

    await (engine as any).tick();

    expect(syncSpy).not.toHaveBeenCalled();
    expect((engine as any).defenseMode).toBe(true);

    engine.stop();
  });
});

