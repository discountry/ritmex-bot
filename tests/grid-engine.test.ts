import { describe, expect, it, vi } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
} from "../src/exchanges/types";
import type { GridConfig } from "../src/config";
import { GridEngine } from "../src/strategy/grid-engine";

class StubAdapter implements ExchangeAdapter {
  id = "aster";

  private accountHandler: ((snapshot: AsterAccountSnapshot) => void) | null = null;
  private orderHandler: ((orders: AsterOrder[]) => void) | null = null;
  private depthHandler: ((depth: AsterDepth) => void) | null = null;
  private tickerHandler: ((ticker: AsterTicker) => void) | null = null;
  private currentOrders: AsterOrder[] = [];

  public createdOrders: CreateOrderParams[] = [];
  public marketOrders: CreateOrderParams[] = [];
  public cancelAllCount = 0;

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(cb: (snapshot: AsterAccountSnapshot) => void): void {
    this.accountHandler = cb;
  }

  watchOrders(cb: (orders: AsterOrder[]) => void): void {
    this.orderHandler = cb;
  }

  watchDepth(_symbol: string, cb: (depth: AsterDepth) => void): void {
    this.depthHandler = cb;
  }

  watchTicker(_symbol: string, cb: (ticker: AsterTicker) => void): void {
    this.tickerHandler = cb;
  }

  watchKlines(): void {
    // not used in tests
  }

  emitAccount(snapshot: AsterAccountSnapshot): void {
    this.accountHandler?.(snapshot);
  }

  emitOrders(orders: AsterOrder[]): void {
    this.orderHandler?.(orders);
  }

  emitDepth(depth: AsterDepth): void {
    this.depthHandler?.(depth);
  }

  emitTicker(ticker: AsterTicker): void {
    this.tickerHandler?.(ticker);
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    const order: AsterOrder = {
      orderId: `${Date.now()}-${Math.random()}`,
      clientOrderId: "test",
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      status: params.type === "MARKET" ? "FILLED" : "NEW",
      price: Number(params.price ?? 0).toString(),
      origQty: Number(params.quantity ?? 0).toString(),
      executedQty: "0",
      stopPrice: "0",
      time: Date.now(),
      updateTime: Date.now(),
      reduceOnly: params.reduceOnly === "true",
      closePosition: false,
    };
    this.createdOrders.push(params);
    if (params.type === "MARKET") {
      this.marketOrders.push(params);
      this.orderHandler?.([]);
    } else {
      this.currentOrders = [order];
      this.orderHandler?.(this.currentOrders);
    }
    return order;
  }

  async cancelOrder(): Promise<void> {
    // no-op
  }

  async cancelOrders(): Promise<void> {
    // no-op
  }

  async cancelAllOrders(): Promise<void> {
    this.cancelAllCount += 1;
    this.currentOrders = [];
    this.orderHandler?.([]);
  }
}

function createAccountSnapshot(symbol: string, positionAmt: number): AsterAccountSnapshot {
  return {
    canTrade: true,
    canDeposit: true,
    canWithdraw: true,
    updateTime: Date.now(),
    totalWalletBalance: "0",
    totalUnrealizedProfit: "0",
    positions: [
      {
        symbol,
        positionAmt: positionAmt.toString(),
        entryPrice: "150",
        unrealizedProfit: "0",
        positionSide: "BOTH",
        updateTime: Date.now(),
      },
    ],
    assets: [],
  } as unknown as AsterAccountSnapshot;
}

describe("GridEngine", () => {
  const baseConfig: GridConfig = {
    symbol: "BTCUSDT",
    lowerPrice: 100,
    upperPrice: 200,
    gridLevels: 3,
    orderSize: 0.1,
    maxPositionSize: 0.2,
    refreshIntervalMs: 10,
    maxLogEntries: 50,
    priceTick: 0.1,
    qtyStep: 0.01,
    direction: "both",
    stopLossPct: 0.01,
    restartTriggerPct: 0.01,
    autoRestart: true,
    gridMode: "geometric",
  };

  it("creates geometric desired orders when running in both directions", async () => {
    const adapter = new StubAdapter();
    const engine = new GridEngine(baseConfig, adapter, { now: () => 0 });

    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, 0));
    adapter.emitOrders([]);
    adapter.emitTicker({
      symbol: baseConfig.symbol,
      lastPrice: "150",
      openPrice: "150",
      highPrice: "150",
      lowPrice: "150",
      volume: "0",
      quoteVolume: "0",
    });

    // use internal syncGrid to generate orders without waiting for timers
    const desired = (engine as any).computeDesiredOrders(150) as Array<{ side: string; price: string }>;
    expect(desired).toHaveLength(3);
    const buyOrders = desired.filter((order) => order.side === "BUY");
    const sellOrders = desired.filter((order) => order.side === "SELL");
    expect(buyOrders).toHaveLength(2);
    expect(sellOrders).toHaveLength(1);
    expect(Number(buyOrders[0]?.price)).toBeCloseTo(141.4, 1);
    expect(Number(buyOrders[1]?.price)).toBeCloseTo(100, 6);
    expect(Number(sellOrders[0]?.price)).toBeCloseTo(200, 6);

    engine.stop();
  });

  it("limits sell orders for long-only direction when no position is available", () => {
    const adapter = new StubAdapter();
    const engine = new GridEngine({ ...baseConfig, direction: "long" }, adapter, { now: () => 0 });

    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, 0));
    adapter.emitOrders([]);

    const desired = (engine as any).computeDesiredOrders(150) as Array<{ side: string; reduceOnly: boolean }>;
    const sells = desired.filter((order) => order.side === "SELL");
    const buys = desired.filter((order) => order.side === "BUY");

    expect(buys.length).toBeGreaterThan(0);
    expect(sells).toHaveLength(0);

    engine.stop();
  });

  it("does not repopulate the same buy level until exposure is released", () => {
    const adapter = new StubAdapter();
    const engine = new GridEngine(baseConfig, adapter, { now: () => 0 });

    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, 0));
    adapter.emitOrders([]);

    const desiredInitial = (engine as any).computeDesiredOrders(150) as Array<{ level: number; side: string }>;
    const nearestBuy = desiredInitial.find((order) => order.side === "BUY");
    expect(nearestBuy).toBeTruthy();
    const targetLevel = nearestBuy!.level;

    (engine as any).levelExposure.set(targetLevel, baseConfig.orderSize);
    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, baseConfig.orderSize));

    const desiredAfterFill = (engine as any).computeDesiredOrders(150) as Array<{ level: number; side: string }>;
    expect(desiredAfterFill.some((order) => order.level === targetLevel && order.side === "BUY")).toBe(false);

    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, 0));
    const desiredAfterExit = (engine as any).computeDesiredOrders(150) as Array<{ level: number; side: string }>;
    expect(desiredAfterExit.some((order) => order.level === targetLevel && order.side === "BUY")).toBe(true);

    engine.stop();
  });

  it("keeps level side assignments stable regardless of price", () => {
    const adapter = new StubAdapter();
    const engine = new GridEngine(baseConfig, adapter, { now: () => 0 });

    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, 0));
    adapter.emitOrders([]);

    const desiredHigh = (engine as any).computeDesiredOrders(2.45) as Array<{ level: number; side: string }>;
    expect(desiredHigh.every((order) => {
      const isBuyLevel = order.level <= Math.floor((baseConfig.gridLevels - 1) / 2);
      return isBuyLevel ? order.side === "BUY" : order.side === "SELL";
    })).toBe(true);

    const desiredLow = (engine as any).computeDesiredOrders(1.55) as Array<{ level: number; side: string }>;
    expect(desiredLow.every((order) => {
      const isBuyLevel = order.level <= Math.floor((baseConfig.gridLevels - 1) / 2);
      return isBuyLevel ? order.side === "BUY" : order.side === "SELL";
    })).toBe(true);

    engine.stop();
  });

  it("halts the grid and closes positions when stop loss triggers", async () => {
    const adapter = new StubAdapter();
    const engine = new GridEngine(baseConfig, adapter, { now: () => 0 });

    adapter.emitAccount(createAccountSnapshot(baseConfig.symbol, 0.2));
    adapter.emitOrders([]);
    adapter.emitTicker({
      symbol: baseConfig.symbol,
      lastPrice: "150",
      openPrice: "150",
      highPrice: "150",
      lowPrice: "150",
      volume: "0",
      quoteVolume: "0",
    });

    (engine as any).stopReason = "test stop";
    await (engine as any).haltGrid(90);

    expect(adapter.cancelAllCount).toBe(1);
    expect(adapter.marketOrders).toHaveLength(1);
    expect(engine.getSnapshot().running).toBe(false);

    engine.stop();
  });
});
