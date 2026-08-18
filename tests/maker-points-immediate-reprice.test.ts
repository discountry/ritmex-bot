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

function buildEngine(adapter: StubAdapter, restingBuyPrice: string): MakerPointsEngine {
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
      filterMinDepth: 0,
    },
    adapter
  );

  (engine as any).feedStatus = { account: true, depth: true, ticker: true, orders: true, binance: true };
  (engine as any).initialOrderSnapshotReady = true;
  (engine as any).defenseMode = false;
  (engine as any).reconnectResetPending = false;
  (engine as any).stopLossProcessing = false;
  (engine as any).openOrders = [
    {
      orderId: 1,
      clientOrderId: "entry-order",
      symbol: "BTC-USD",
      side: "BUY",
      type: "LIMIT",
      status: "NEW",
      price: restingBuyPrice,
      origQty: "0.01",
      executedQty: "0",
      stopPrice: "0",
      time: Date.now(),
      updateTime: Date.now(),
      reduceOnly: false,
      closePosition: false,
    },
  ];
  return engine;
}

// bid1 99.9 / ask1 100.9 → 中值 100.4；0-10 档目标 9 bps，容差 max(3, 9×0.15)=3
// 所以保留窗口是距中值 6–12 bps，即 100.28–100.34
const DEPTH = {
  lastUpdateId: 1,
  bids: [["99.9", "1"]] as Array<[string, string]>,
  asks: [["100.9", "1"]] as Array<[string, string]>,
  eventTime: Date.now(),
  symbol: "BTC-USD",
};

describe("MakerPointsEngine immediate reprice", () => {
  it("leaves a quote alone while it is still inside its band tolerance", () => {
    vi.useFakeTimers();
    const adapter = new StubAdapter();
    // 100.31 距中值 8.96 bps，仍在 9±3 内 —— 不该撤挂，订单得以跨过 3 秒计分门槛
    const engine = buildEngine(adapter, "100.31");
    const tickSpy = vi.spyOn(engine as any, "tick").mockResolvedValue(undefined);

    adapter.emitDepth(DEPTH);

    expect(tickSpy).not.toHaveBeenCalled();
    engine.stop();
  });

  it("triggers an immediate tick once the quote drifts out of every band", () => {
    vi.useFakeTimers();
    const adapter = new StubAdapter();
    // 100.25 距中值 14.94 bps，已经掉出 9±3
    const engine = buildEngine(adapter, "100.25");
    const tickSpy = vi.spyOn(engine as any, "tick").mockResolvedValue(undefined);

    adapter.emitDepth(DEPTH);

    expect(tickSpy).toHaveBeenCalledTimes(1);
    engine.stop();
  });

  it("measures drift against mark price rather than the book mid", () => {
    vi.useFakeTimers();
    const adapter = new StubAdapter();
    // 同一张单：按中值 100.4 算是安全的，但 mark 已经跌到 100.0，
    // 买单实际挂在 mark 上方 31 bps，随时会被吃 —— 必须立即重挂
    const engine = buildEngine(adapter, "100.31");
    (engine as any).tickerSnapshot = { symbol: "BTC-USD", markPrice: "100.0" };
    const tickSpy = vi.spyOn(engine as any, "tick").mockResolvedValue(undefined);

    adapter.emitDepth(DEPTH);

    expect(tickSpy).toHaveBeenCalledTimes(1);
    engine.stop();
  });
});
