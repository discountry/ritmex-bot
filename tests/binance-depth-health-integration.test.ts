import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker } from "../src/exchanges/types";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

const ORIGINAL_FETCH = globalThis.fetch;

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

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    return {
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
  }
}

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("MakerPointsEngine Binance depth health defense", () => {
  it("enters defense mode when Binance depth tracker is unhealthy", () => {
    vi.useFakeTimers();
    globalThis.fetch = vi.fn(async () => {
      throw new Error("network blocked in test");
    }) as any;

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

    const now = Date.now();
    (engine as any).lastStandxDepthTime = now;
    (engine as any).lastStandxAccountTime = now;
    (engine as any).lastBinanceDepthTime = now;

    (engine as any).binanceDepth = {
      getHealth: () => ({
        started: true,
        connected: true,
        orderBookReady: false,
        restHealthy: false,
        healthy: false,
        reason: "orderbook_not_ready",
        lastEventAt: now,
        lastSnapshotAt: 0,
        lastRestSyncAt: 0,
        localLastUpdateId: 0,
      }),
      stop: () => {},
    };

    (engine as any).checkDataStaleAndDefense();
    expect((engine as any).defenseMode).toBe(true);

    const logs = ((engine as any).tradeLog.all() as Array<{ detail: string }>).map((entry) => entry.detail);
    expect(logs.some((detail) => detail.includes("Binance簿记异常(orderbook_not_ready)"))).toBe(true);

    engine.stop();
  });

  it("exits defense mode after Binance depth health recovers", () => {
    vi.useFakeTimers();
    globalThis.fetch = vi.fn(async () => {
      throw new Error("network blocked in test");
    }) as any;

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

    const now = Date.now();
    (engine as any).lastStandxDepthTime = now;
    (engine as any).lastStandxAccountTime = now;
    (engine as any).lastBinanceDepthTime = now;

    let unhealthy = true;
    (engine as any).binanceDepth = {
      getHealth: () => ({
        started: true,
        connected: true,
        orderBookReady: !unhealthy,
        restHealthy: !unhealthy,
        healthy: !unhealthy,
        reason: unhealthy ? "orderbook_not_ready" : null,
        lastEventAt: now,
        lastSnapshotAt: now,
        lastRestSyncAt: now,
        localLastUpdateId: unhealthy ? 0 : 100,
      }),
      stop: () => {},
    };

    (engine as any).checkDataStaleAndDefense();
    expect((engine as any).defenseMode).toBe(true);

    unhealthy = false;
    (engine as any).checkDataStaleAndDefense();
    expect((engine as any).defenseMode).toBe(false);

    engine.stop();
  });
});
