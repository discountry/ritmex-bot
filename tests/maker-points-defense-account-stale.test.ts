import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AccountSnapshot, Depth, Kline, Order, Ticker } from "../src/exchanges/types";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

class StubAdapter implements ExchangeAdapter {
  id = "standx";
  accountSnapshot: AccountSnapshot | null = null;

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(_cb: (snapshot: AccountSnapshot) => void): void {}
  watchOrders(_cb: (orders: Order[]) => void): void {}
  watchDepth(_symbol: string, _cb: (depth: Depth) => void): void {}
  watchTicker(_symbol: string, _cb: (ticker: Ticker) => void): void {}
  watchKlines(_symbol: string, _interval: string, _cb: (klines: Kline[]) => void): void {}

  async createOrder(): Promise<Order> {
    throw new Error("not implemented");
  }

  async cancelOrder(): Promise<void> {}
  async cancelOrders(): Promise<void> {}
  async cancelAllOrders(): Promise<void> {}

  async queryAccountSnapshot(): Promise<AccountSnapshot | null> {
    return this.accountSnapshot;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe("MakerPointsEngine defense-mode account staleness", () => {
  it("does not enter defense mode for ~21s StandX account gap (REST probe succeeds)", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-24T15:20:00.000Z"));
    const adapter = new StubAdapter();
    adapter.accountSnapshot = {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Date.now(),
      totalWalletBalance: "0",
      totalUnrealizedProfit: "0",
      positions: [],
      assets: [],
      marketType: "perp",
    };
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
        band0To10Bps: 9,
        band10To30Bps: 29,
        band30To100Bps: 40,
        maxDistanceBps: 95,
        minRepriceBps: 3,
        bandRepriceRatio: 0.15,
        slOffsetBps: 2,
        enableBinanceDepthCancel: false,
        filterMinDepth: 0,
      },
      adapter
    );

    const now = Date.now();
    (engine as any).lastStandxDepthTime = now;
    (engine as any).lastBinanceDepthTime = now;
    (engine as any).lastStandxAccountTime = now - 21_000;

    (engine as any).checkDataStaleAndDefense();
    expect((engine as any).defenseMode).toBe(false);
    await vi.runAllTimersAsync();
    engine.stop();
  });

  it("enters defense mode if StandX account REST probe fails", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-24T15:20:00.000Z"));
    const adapter = new StubAdapter();
    adapter.accountSnapshot = null;
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
        band0To10Bps: 9,
        band10To30Bps: 29,
        band30To100Bps: 40,
        maxDistanceBps: 95,
        minRepriceBps: 3,
        bandRepriceRatio: 0.15,
        slOffsetBps: 2,
        enableBinanceDepthCancel: false,
        filterMinDepth: 0,
      },
      adapter
    );

    const now = Date.now();
    (engine as any).lastStandxDepthTime = now;
    (engine as any).lastBinanceDepthTime = now;
    (engine as any).lastStandxAccountTime = now - 121_000;

    (engine as any).checkDataStaleAndDefense();
    expect((engine as any).defenseMode).toBe(false);

    await vi.runAllTimersAsync();
    vi.advanceTimersByTime(1000);
    (engine as any).checkDataStaleAndDefense();
    expect((engine as any).defenseMode).toBe(true);
    engine.stop();
  });
});
