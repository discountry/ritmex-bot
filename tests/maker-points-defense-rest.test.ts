import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker } from "../src/exchanges/types";
import { MakerPointsEngine } from "../src/strategy/maker-points-engine";

class StubAdapter implements ExchangeAdapter {
  id = "standx";
  cancelAllCount = 0;
  openOrders: AsterOrder[] | Error = [];
  accountSnapshot: AsterAccountSnapshot | null = null;

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

  async cancelAllOrders(): Promise<void> {
    this.cancelAllCount += 1;
    this.openOrders = [];
  }

  async queryOpenOrders(): Promise<AsterOrder[]> {
    if (this.openOrders instanceof Error) throw this.openOrders;
    return this.openOrders;
  }

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    return this.accountSnapshot;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe("MakerPointsEngine defense-mode REST polling", () => {
  it("keeps trying to fetch open orders and cancel all when open orders exist", async () => {
    vi.useFakeTimers();
    const adapter = new StubAdapter();
    adapter.openOrders = [
      {
        orderId: "1",
        clientOrderId: "c1",
        symbol: "BTC-USD",
        side: "BUY",
        type: "LIMIT",
        status: "NEW",
        price: "100",
        origQty: "1",
        executedQty: "0",
        time: Date.now(),
        updateTime: Date.now(),
        reduceOnly: "false",
        closePosition: "false",
      },
    ];

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

    (engine as any).enterDefenseMode({
      standxDepthStale: true,
      binanceStale: false,
      binanceUnhealthy: false,
      binanceHealthReason: null,
      standxAccountStale: false,
      accountInvalid: false,
      standxRestUnhealthy: false,
      standxRestConsecutiveErrors: 0,
      standxRestLastError: null,
      marginModeNotIsolated: false,
      marginMode: "isolated",
      standxDepthAge: 6000,
      binanceAge: 0,
      standxAccountAge: 0,
      accountIssues: [],
    });

    await vi.waitFor(() => {
      expect(adapter.cancelAllCount).toBeGreaterThanOrEqual(1);
    });

    engine.stop();
  });

  it("attempts cancel-all even if open-order query fails", async () => {
    vi.useFakeTimers();
    const adapter = new StubAdapter();
    adapter.openOrders = new Error("boom");

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

    (engine as any).enterDefenseMode({
      standxDepthStale: true,
      binanceStale: false,
      binanceUnhealthy: false,
      binanceHealthReason: null,
      standxAccountStale: false,
      accountInvalid: false,
      standxRestUnhealthy: false,
      standxRestConsecutiveErrors: 0,
      standxRestLastError: null,
      marginModeNotIsolated: false,
      marginMode: "isolated",
      standxDepthAge: 6000,
      binanceAge: 0,
      standxAccountAge: 0,
      accountIssues: [],
    });

    await vi.waitFor(() => {
      expect(adapter.cancelAllCount).toBeGreaterThanOrEqual(1);
    });

    engine.stop();
  });
});
