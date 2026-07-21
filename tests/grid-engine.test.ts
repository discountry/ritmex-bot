import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { ConnectionEventListener, ExchangeAdapter } from "../src/exchanges/adapter";
import type {
  AccountSnapshot,
  CreateOrderParams,
  Order,
  Ticker,
} from "../src/exchanges/types";
import type { GridConfig } from "../src/config";
import { GridEngine } from "../src/strategy/grid-engine";
import { saveGridState } from "../src/strategy/common/grid-storage";
import { createInitialState, toStored, type GridLogicSettings } from "../src/strategy/grid-logic";

let orderCounter = 0;

class FakeAdapter implements ExchangeAdapter {
  id = "aster";
  triggerOrders = false;

  private accountHandler: ((snapshot: AccountSnapshot) => void) | null = null;
  private orderHandler: ((orders: Order[]) => void) | null = null;
  private tickerHandler: ((ticker: Ticker) => void) | null = null;
  private depthHandler: ((depth: any) => void) | null = null;
  private connectionListeners: ConnectionEventListener[] = [];
  private lastAccount: AccountSnapshot | null = null;

  currentOrders: Order[] = [];
  createdOrders: CreateOrderParams[] = [];
  limitOrders: CreateOrderParams[] = [];
  marketOrders: CreateOrderParams[] = [];
  stopOrders: CreateOrderParams[] = [];
  cancelledIds: string[] = [];
  cancelAllCount = 0;

  supportsTrailingStops(): boolean {
    return false;
  }

  supportsTriggerOrders(): boolean {
    return this.triggerOrders;
  }

  watchAccount(cb: (snapshot: AccountSnapshot) => void): void {
    this.accountHandler = cb;
  }

  watchOrders(cb: (orders: Order[]) => void): void {
    this.orderHandler = cb;
  }

  watchDepth(_symbol: string, cb: (depth: any) => void): void {
    this.depthHandler = cb;
  }

  watchTicker(_symbol: string, cb: (ticker: Ticker) => void): void {
    this.tickerHandler = cb;
  }

  watchKlines(): void {
    // not used
  }

  onConnectionEvent(listener: ConnectionEventListener): void {
    this.connectionListeners.push(listener);
  }

  async queryOpenOrders(): Promise<Order[]> {
    return [...this.currentOrders];
  }

  async queryAccountSnapshot(): Promise<AccountSnapshot | null> {
    return this.lastAccount;
  }

  emitConnection(event: "disconnected" | "reconnected", symbol = "BTCUSDT"): void {
    for (const listener of this.connectionListeners) listener(event, symbol);
  }

  emitAccount(snapshot: AccountSnapshot): void {
    this.lastAccount = snapshot;
    this.accountHandler?.(snapshot);
  }

  emitOrders(orders?: Order[]): void {
    this.orderHandler?.(orders ?? [...this.currentOrders]);
  }

  emitDepth(depth: any): void {
    this.depthHandler?.(depth);
  }

  emitTicker(ticker: Ticker): void {
    this.tickerHandler?.(ticker);
  }

  async createOrder(params: CreateOrderParams): Promise<Order> {
    orderCounter += 1;
    const orderId = `srv-${orderCounter}`;
    const order: Order = {
      orderId,
      clientOrderId: params.clientOrderId ?? orderId,
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      status: params.type === "MARKET" ? "FILLED" : "NEW",
      price: Number(params.price ?? 0).toString(),
      origQty: Number(params.quantity ?? 0).toString(),
      executedQty: "0",
      stopPrice: Number(params.stopPrice ?? 0).toString(),
      time: 0,
      updateTime: 0,
      reduceOnly: params.reduceOnly === "true",
      closePosition: params.closePosition === "true",
    };
    this.createdOrders.push(params);
    if (params.type === "MARKET") {
      this.marketOrders.push(params);
      this.emitOrders();
    } else if (params.type === "STOP_MARKET") {
      this.stopOrders.push(params);
      this.currentOrders.push(order);
      this.emitOrders();
    } else {
      this.limitOrders.push(params);
      this.currentOrders.push(order);
      this.emitOrders();
    }
    return order;
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    this.cancelledIds.push(String(params.orderId));
    this.currentOrders = this.currentOrders.filter((o) => String(o.orderId) !== String(params.orderId));
    this.emitOrders();
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    const ids = new Set(params.orderIdList.map(String));
    this.cancelledIds.push(...params.orderIdList.map(String));
    this.currentOrders = this.currentOrders.filter((o) => !ids.has(String(o.orderId)));
    this.emitOrders();
  }

  async cancelAllOrders(): Promise<void> {
    this.cancelAllCount += 1;
    this.currentOrders = [];
    this.emitOrders();
  }

  /** 模拟成交：先在订单流里出现 FILLED 终态，再从活跃单移除 */
  fillOrder(orderId: string): Order | null {
    const order = this.currentOrders.find((o) => String(o.orderId) === orderId);
    if (!order) return null;
    const filled: Order = { ...order, status: "FILLED", executedQty: order.origQty };
    this.currentOrders = this.currentOrders.filter((o) => String(o.orderId) !== orderId);
    this.emitOrders([...this.currentOrders, filled]);
    return filled;
  }

  findOrders(predicate: (o: Order) => boolean): Order[] {
    return this.currentOrders.filter(predicate);
  }
}

function accountSnapshot(
  symbol: string,
  positionAmt: number,
  entryPrice = 150,
  markPrice?: number
): AccountSnapshot {
  return {
    canTrade: true,
    canDeposit: true,
    canWithdraw: true,
    updateTime: 0,
    totalWalletBalance: "1000",
    totalUnrealizedProfit: "0",
    positions: [
      {
        symbol,
        positionAmt: positionAmt.toString(),
        entryPrice: entryPrice.toString(),
        unrealizedProfit: "0",
        positionSide: "BOTH",
        updateTime: 0,
        ...(markPrice != null ? { markPrice: markPrice.toString() } : {}),
      },
    ],
    assets: [],
  } as unknown as AccountSnapshot;
}

function ticker(symbol: string, price: number): Ticker {
  return {
    symbol,
    lastPrice: price.toString(),
    openPrice: price.toString(),
    highPrice: price.toString(),
    lowPrice: price.toString(),
    volume: "0",
    quoteVolume: "0",
  };
}

function makeConfig(overrides: Partial<GridConfig> = {}): GridConfig {
  return {
    symbol: "BTCUSDT",
    lowerPrice: 100,
    upperPrice: 200,
    gridLevels: 5,
    orderSize: 0.1,
    maxPositionSize: 0.4,
    refreshIntervalMs: 10,
    maxLogEntries: 200,
    priceTick: 0.1,
    qtyStep: 0.001,
    direction: "both",
    stopLossPct: 0.01,
    restartTriggerPct: 0.01,
    autoRestart: true,
    gridMode: "geometric",
    maxCloseSlippagePct: 0.05,
    gridShiftEnabled: false,
    gridShiftTriggerPct: 0.05,
    gridShiftRangePct: 0.05,
    gridShiftConfirmMs: 3000,
    useReduceOnlyForExit: false,
    exchangeStopEnabled: false,
    reconcileIntervalMs: 30_000,
    uncoveredGraceMs: 5000,
    ...overrides,
  };
}

const clock = { t: 1_000_000 };

function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function releaseLimitLock(engine: GridEngine): void {
  const anyEngine = engine as any;
  for (const type of ["LIMIT", "STOP_MARKET"]) {
    anyEngine.locks[type] = false;
    anyEngine.pendings[type] = null;
    if (anyEngine.timers[type]) {
      clearTimeout(anyEngine.timers[type]);
      anyEngine.timers[type] = null;
    }
  }
}

async function drive(engine: GridEngine, ticks: number, stepMs = 100): Promise<void> {
  for (let i = 0; i < ticks; i += 1) {
    clock.t += stepMs;
    await (engine as any).tick();
    releaseLimitLock(engine);
    await settle();
  }
}

function bootFeeds(
  adapter: FakeAdapter,
  config: GridConfig,
  options: { positionAmt?: number; entryPrice?: number; markPrice?: number; price?: number } = {}
): void {
  adapter.emitAccount(
    accountSnapshot(
      config.symbol,
      options.positionAmt ?? 0,
      options.entryPrice ?? 150,
      options.markPrice
    )
  );
  adapter.emitTicker(ticker(config.symbol, options.price ?? 150));
  adapter.emitOrders();
}

async function bootEngine(
  config: GridConfig,
  adapter: FakeAdapter,
  options: { positionAmt?: number; entryPrice?: number; markPrice?: number; price?: number; skipPersistence?: boolean } = {}
): Promise<GridEngine> {
  const engine = new GridEngine(config, adapter, {
    now: () => clock.t,
    skipPersistence: options.skipPersistence ?? true,
  });
  bootFeeds(adapter, config, options);
  await settle();
  await drive(engine, 1);
  return engine;
}

let tmpDir: string | null = null;
let prevDataDir: string | undefined;

beforeEach(() => {
  clock.t = 1_000_000;
  prevDataDir = process.env.GRID_DATA_DIR;
});

afterEach(async () => {
  if (prevDataDir == null) delete process.env.GRID_DATA_DIR;
  else process.env.GRID_DATA_DIR = prevDataDir;
  if (tmpDir) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
});

async function useTmpStorage(): Promise<string> {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "grid-engine-test-"));
  process.env.GRID_DATA_DIR = tmpDir;
  return tmpDir;
}

// ---------------------------------------------------------------------------
// 三模式建格
// ---------------------------------------------------------------------------

describe("GridEngine modes", () => {
  it("neutral splits entries at the anchor: BUY below, SELL above", async () => {
    const adapter = new FakeAdapter();
    const engine = await bootEngine(makeConfig(), adapter);
    await drive(engine, 8);

    expect(adapter.limitOrders.length).toBeGreaterThan(1);
    for (const params of adapter.limitOrders) {
      if (params.side === "BUY") expect(Number(params.price)).toBeLessThan(150);
      else expect(Number(params.price)).toBeGreaterThan(150);
    }
    expect(adapter.limitOrders.some((p) => p.side === "BUY")).toBe(true);
    expect(adapter.limitOrders.some((p) => p.side === "SELL")).toBe(true);

    const snapshot = engine.getSnapshot();
    expect(snapshot.gridVersion).toBe(1);
    expect(snapshot.anchorPrice).toBeCloseTo(150, 6);
    expect(snapshot.direction).toBe("both");
    engine.stop();
  });

  it("long mode only places BUY entries", async () => {
    const adapter = new FakeAdapter();
    const engine = await bootEngine(makeConfig({ direction: "long" }), adapter);
    await drive(engine, 8);
    expect(adapter.limitOrders.length).toBeGreaterThan(0);
    expect(adapter.limitOrders.every((p) => p.side === "BUY")).toBe(true);
    engine.stop();
  });

  it("short mode only places SELL entries", async () => {
    const adapter = new FakeAdapter();
    const engine = await bootEngine(makeConfig({ direction: "short" }), adapter);
    await drive(engine, 8);
    expect(adapter.limitOrders.length).toBeGreaterThan(0);
    expect(adapter.limitOrders.every((p) => p.side === "SELL")).toBe(true);
    engine.stop();
  });
});

// ---------------------------------------------------------------------------
// 生命周期：ENTRY 成交 → EXIT → 释放
// ---------------------------------------------------------------------------

describe("GridEngine lifecycle", () => {
  it("fills ENTRY, places EXIT at adjacent line, releases level after EXIT fills", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engine = await bootEngine(config, adapter);
    await drive(engine, 4);

    // 找到 141.4 的 BUY ENTRY（最近的买线）并成交
    const entry = adapter.findOrders((o) => o.side === "BUY" && Number(o.price) === 141.4)[0];
    expect(entry).toBeTruthy();
    adapter.fillOrder(String(entry!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0.1, 141.4));
    await drive(engine, 3);

    // 相邻线 168.2 出现 SELL EXIT
    const exitParams = adapter.limitOrders.filter(
      (p) =>
        p.side === "SELL" &&
        Math.abs(Number(p.price) - 168.2) < 0.2 &&
        p.clientOrderId?.includes("-X-")
    );
    expect(exitParams.length).toBe(1);

    const line = engine.getSnapshot().gridLines.find((l) => Math.abs(l.price - 141.4) < 0.2);
    expect(line?.state).toBe("exit_placed");

    // EXIT 成交 → 线释放 → 重新可开仓
    const exitOrder = adapter.findOrders(
      (o) =>
        o.side === "SELL" &&
        Math.abs(Number(o.price) - 168.2) < 0.2 &&
        o.clientOrderId.includes("-X-")
    )[0];
    adapter.fillOrder(String(exitOrder!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0, 0));
    await drive(engine, 3);

    const lineAfter = engine.getSnapshot().gridLines.find((l) => Math.abs(l.price - 141.4) < 0.2);
    expect(lineAfter?.state === "idle" || lineAfter?.state === "entry_placed").toBe(true);
    await drive(engine, 4);
    const buyEntriesAtLevel = adapter.limitOrders.filter(
      (p) => p.side === "BUY" && Math.abs(Number(p.price) - 141.4) < 0.2
    );
    expect(buyEntriesAtLevel.length).toBe(2); // 首次 + 释放后重挂
    engine.stop();
  });

  it("does not duplicate ENTRY while the level is holding across price crossings", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engine = await bootEngine(config, adapter);
    await drive(engine, 4);

    const entry = adapter.findOrders((o) => o.side === "BUY" && Number(o.price) === 141.4)[0];
    adapter.fillOrder(String(entry!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0.1, 141.4));
    await drive(engine, 2);

    // 价格在该线两侧来回穿越
    for (const price of [130, 155, 130, 155, 130]) {
      adapter.emitTicker(ticker(config.symbol, price));
      await drive(engine, 2);
    }

    const buyEntriesAtLevel = adapter.limitOrders.filter(
      (p) => p.side === "BUY" && Math.abs(Number(p.price) - 141.4) < 0.2
    );
    expect(buyEntriesAtLevel.length).toBe(1);
    const exitsAtTarget = adapter.limitOrders.filter(
      (p) =>
        p.side === "SELL" &&
        Math.abs(Number(p.price) - 168.2) < 0.2 &&
        p.clientOrderId?.includes("-X-")
    );
    expect(exitsAtTarget.length).toBe(1);
    const entriesAtTarget = adapter.limitOrders.filter(
      (p) =>
        p.side === "SELL" &&
        Math.abs(Number(p.price) - 168.2) < 0.2 &&
        p.clientOrderId?.includes("-E-")
    );
    expect(entriesAtTarget.length).toBe(1); // 线 3 自身的空头开仓单可并存但不重复
    engine.stop();
  });

  it("EXIT orders honor the reduce-only switch", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig({ useReduceOnlyForExit: true });
    const engine = await bootEngine(config, adapter);
    await drive(engine, 4);
    const entry = adapter.findOrders((o) => o.side === "BUY" && Number(o.price) === 141.4)[0];
    adapter.fillOrder(String(entry!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0.1, 141.4));
    await drive(engine, 3);
    const exitParams = adapter.limitOrders.find((p) => p.clientOrderId?.includes("-X-"));
    expect(exitParams).toBeTruthy();
    expect(exitParams!.reduceOnly).toBe("true");
    engine.stop();
  });

  it("EXIT orders default to no reduce-only flag", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engine = await bootEngine(config, adapter);
    await drive(engine, 4);
    const entry = adapter.findOrders((o) => o.side === "BUY" && Number(o.price) === 141.4)[0];
    adapter.fillOrder(String(entry!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0.1, 141.4));
    await drive(engine, 3);
    const exitParams = adapter.limitOrders.find((p) => p.clientOrderId?.includes("-X-"));
    expect(exitParams).toBeTruthy();
    expect(exitParams!.reduceOnly).not.toBe("true");
    engine.stop();
  });
});

// ---------------------------------------------------------------------------
// 恢复与对账
// ---------------------------------------------------------------------------

describe("GridEngine recovery", () => {
  it("cancels stranger orders during startup reconcile", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    // 预置一张与任何档位不对齐的陌生单
    adapter.currentOrders.push({
      orderId: "stranger-1",
      clientOrderId: "someone-else",
      symbol: config.symbol,
      side: "BUY",
      type: "LIMIT",
      status: "NEW",
      price: "133.3",
      origQty: "0.1",
      executedQty: "0",
      stopPrice: "0",
      time: 0,
      updateTime: 0,
      reduceOnly: false,
      closePosition: false,
    });
    const engine = await bootEngine(config, adapter);
    await drive(engine, 2);
    expect(adapter.cancelledIds).toContain("stranger-1");
    engine.stop();
  });

  it("restores state from disk and does not duplicate orders after restart", async () => {
    await useTmpStorage();
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engineA = await bootEngine(config, adapter, { skipPersistence: false });
    await drive(engineA, 4);

    const entry = adapter.findOrders((o) => o.side === "BUY" && Number(o.price) === 141.4)[0];
    expect(entry).toBeTruthy();
    adapter.fillOrder(String(entry!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0.1, 141.4));
    await drive(engineA, 3);
    engineA.stop();

    const exitCountBefore = adapter.limitOrders.filter((p) => p.clientOrderId?.includes("-X-")).length;
    expect(exitCountBefore).toBe(1);
    const exitOrder = adapter.findOrders((o) => o.clientOrderId.includes("-X-"))[0];
    expect(exitOrder).toBeTruthy();

    // “重启”：新引擎实例，同一存储目录与交易所现场
    const engineB = new GridEngine(config, adapter, { now: () => clock.t, skipPersistence: false });
    bootFeeds(adapter, config, { positionAmt: 0.1, entryPrice: 141.4 });
    await settle();
    await drive(engineB, 3);

    // 已有 EXIT 挂单被继承：没有撤销、没有重复 EXIT
    expect(adapter.cancelledIds).toHaveLength(0);
    const exitCount = adapter.limitOrders.filter((p) => p.clientOrderId?.includes("-X-")).length;
    expect(exitCount).toBe(1);
    const heldLine = engineB.getSnapshot().gridLines.find((l) => Math.abs(l.price - 141.4) < 0.2);
    expect(heldLine?.state).toBe("exit_placed");
    // 已持仓线不再重复挂 ENTRY
    const buyAtHeld = adapter.limitOrders.filter(
      (p) => p.side === "BUY" && Math.abs(Number(p.price) - 141.4) < 0.2
    );
    expect(buyAtHeld.length).toBe(1);
    engineB.stop();
  });

  it("freezes on disconnect and reconciles via REST after reconnect", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engine = await bootEngine(config, adapter);
    await drive(engine, 3);
    const placedBefore = adapter.limitOrders.length;
    expect(placedBefore).toBeGreaterThan(0);

    // 断连：冻结，不再下新单
    adapter.emitConnection("disconnected");
    await drive(engine, 4);
    expect(adapter.limitOrders.length).toBe(placedBefore);

    // 断连期间某 ENTRY 在服务端成交（订单流不可用，直接改现场）
    const entry = adapter.currentOrders.find((o) => o.side === "BUY" && Number(o.price) === 141.4);
    expect(entry).toBeTruthy();
    adapter.currentOrders = adapter.currentOrders.filter((o) => o.orderId !== entry!.orderId);
    (adapter as any).lastAccount = accountSnapshot(config.symbol, 0.1, 141.4);

    // 重连：REST 对账把成交归位到线 → 补挂 EXIT
    adapter.emitConnection("reconnected");
    await drive(engine, 4);
    const heldLine = engine.getSnapshot().gridLines.find((l) => Math.abs(l.price - 141.4) < 0.2);
    expect(heldLine?.state === "holding" || heldLine?.state === "exit_placed").toBe(true);
    const exits = adapter.limitOrders.filter((p) => p.side === "SELL" && p.clientOrderId?.includes("-X-"));
    expect(exits.length).toBeGreaterThanOrEqual(1);
    engine.stop();
  });
});

// ---------------------------------------------------------------------------
// 多重止损
// ---------------------------------------------------------------------------

describe("GridEngine stop-loss layers", () => {
  it("layer 1: halts, cancels and closes when price breaks the band", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engine = await bootEngine(config, adapter, { positionAmt: 0.2, entryPrice: 150 });
    await drive(engine, 2);

    adapter.emitTicker(ticker(config.symbol, 95));
    await drive(engine, 2);

    expect(adapter.cancelAllCount).toBeGreaterThanOrEqual(1);
    expect(adapter.marketOrders.length).toBe(1);
    expect(adapter.marketOrders[0]!.side).toBe("SELL");
    expect(engine.getSnapshot().running).toBe(false);
    engine.stop();
  });

  it("layer 1: slippage guard defers the close and keeps retrying", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    const engine = await bootEngine(config, adapter, {
      positionAmt: 0.2,
      entryPrice: 150,
      markPrice: 95,
    });
    await drive(engine, 2);
    // 深度显示卖一/买一严重偏离标记价 → 守卫拦截
    adapter.emitDepth({ lastUpdateId: 1, bids: [["80", "5"]], asks: [["80.5", "5"]] });
    adapter.emitTicker(ticker(config.symbol, 95));
    await drive(engine, 2);
    expect(adapter.marketOrders.length).toBe(0);
    expect(engine.getSnapshot().running).toBe(true); // 未完成止损，保持重试

    // 深度恢复正常 → 完成平仓与停机
    adapter.emitDepth({ lastUpdateId: 2, bids: [["95", "5"]], asks: [["95.1", "5"]] });
    await drive(engine, 2);
    expect(adapter.marketOrders.length).toBe(1);
    expect(engine.getSnapshot().running).toBe(false);
    engine.stop();
  });

  it("layer 2/3: orphan position beyond line capacity gets a protective exit", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    // BUY 线容量 0.3（3 线 × 0.1），净多 0.35 → 0.05 无法归档
    const engine = await bootEngine(config, adapter, { positionAmt: 0.35, entryPrice: 141 });
    await drive(engine, 2);

    const orphanExit = adapter.limitOrders.find(
      (p) => p.side === "SELL" && Math.abs(Number(p.quantity ?? 0) - 0.05) < 1e-9
    );
    expect(orphanExit).toBeTruthy();
    expect(Number(orphanExit!.price)).toBeGreaterThan(141);
    engine.stop();
  });

  it("layer 2: deep floating loss closes the uncovered part at market", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig();
    // 入场价 160、现价 150 → 浮亏 6.25% > stopLossPct 1% → 未覆盖部分直接市价平
    const engine = await bootEngine(config, adapter, { positionAmt: 0.35, entryPrice: 160 });
    await drive(engine, 2);

    const close = adapter.marketOrders.find(
      (p) => p.side === "SELL" && Math.abs(Number(p.quantity ?? 0) - 0.05) < 1e-9
    );
    expect(close).toBeTruthy();
    engine.stop();
  });

  it("layer 4: maintains an exchange STOP_MARKET backstop when supported", async () => {
    const adapter = new FakeAdapter();
    adapter.triggerOrders = true;
    const config = makeConfig({ exchangeStopEnabled: true });
    const engine = await bootEngine(config, adapter, { positionAmt: 0.2, entryPrice: 141 });
    await drive(engine, 2);

    expect(adapter.stopOrders.length).toBe(1);
    expect(adapter.stopOrders[0]!.side).toBe("SELL");
    expect(Number(adapter.stopOrders[0]!.stopPrice)).toBeCloseTo(99, 6);
    const snapshot = engine.getSnapshot();
    expect(snapshot.stopProtection.exchangeStop?.side).toBe("SELL");

    // 仓位归零 → 撤销兜底单
    const stopId = snapshot.stopProtection.exchangeStop!.orderId;
    adapter.emitAccount(accountSnapshot(config.symbol, 0, 0));
    clock.t += 6000;
    await drive(engine, 2);
    expect(adapter.cancelledIds).toContain(stopId);
    expect(engine.getSnapshot().stopProtection.exchangeStop).toBeNull();
    engine.stop();
  });

  it("layer 4: no exchange stop when the capability is missing", async () => {
    const adapter = new FakeAdapter();
    adapter.triggerOrders = false;
    const config = makeConfig({ exchangeStopEnabled: true });
    const engine = await bootEngine(config, adapter, { positionAmt: 0.2, entryPrice: 141 });
    await drive(engine, 3);
    expect(adapter.stopOrders.length).toBe(0);
    engine.stop();
  });
});

// ---------------------------------------------------------------------------
// 智能移格
// ---------------------------------------------------------------------------

describe("GridEngine shift", () => {
  it("full flow: debounce → cancel all → close position → rebuild around new anchor", async () => {
    const adapter = new FakeAdapter();
    const config = makeConfig({ gridShiftEnabled: true });
    const engine = await bootEngine(config, adapter);
    await drive(engine, 4);
    expect(adapter.limitOrders.length).toBeGreaterThan(0);

    // 让引擎有持仓
    const entry = adapter.findOrders((o) => o.side === "BUY" && Number(o.price) === 141.4)[0];
    adapter.fillOrder(String(entry!.orderId));
    adapter.emitAccount(accountSnapshot(config.symbol, 0.1, 141.4));
    await drive(engine, 2);

    // 偏离锚定价 >5%，去抖 3s
    adapter.emitTicker(ticker(config.symbol, 158));
    await drive(engine, 1); // 开始计时
    expect(engine.getSnapshot().shiftPhase).toBeNull();
    clock.t += 3500;
    await drive(engine, 1); // 触发 BEGIN_SHIFT
    expect(engine.getSnapshot().shiftPhase).toBe("cancelling");

    await drive(engine, 2); // cancelAll
    expect(adapter.cancelAllCount).toBeGreaterThanOrEqual(1);
    await drive(engine, 2); // closing → 市价平仓
    expect(adapter.marketOrders.length).toBe(1);
    adapter.emitAccount(accountSnapshot(config.symbol, 0, 0));
    await drive(engine, 3); // rebuilding → rebuild

    const snapshot = engine.getSnapshot();
    expect(snapshot.shiftPhase).toBeNull();
    expect(snapshot.gridVersion).toBe(2);
    expect(snapshot.anchorPrice).toBeCloseTo(158, 0);
    expect(snapshot.lowerPrice).toBeCloseTo(158 * 0.95, 1);
    expect(snapshot.upperPrice).toBeCloseTo(158 * 1.05, 1);
    engine.stop();
  });

  it("resumes an interrupted shift from the persisted phase", async () => {
    await useTmpStorage();
    const adapter = new FakeAdapter();
    const config = makeConfig({ gridShiftEnabled: true });
    // 预写移格中断现场：closing 阶段 + 残留空头仓位
    const settings: GridLogicSettings = {
      direction: "neutral",
      lowerPrice: config.lowerPrice,
      upperPrice: config.upperPrice,
      gridLevels: config.gridLevels,
      orderSize: config.orderSize,
      maxPositionSize: config.maxPositionSize,
      priceTick: config.priceTick,
      qtyStep: config.qtyStep,
      stopLossPct: config.stopLossPct,
      uncoveredGraceMs: config.uncoveredGraceMs,
      shiftEnabled: true,
      shiftTriggerPct: config.gridShiftTriggerPct,
      shiftRangePct: config.gridShiftRangePct,
      shiftConfirmMs: config.gridShiftConfirmMs,
    };
    const state = createInitialState(settings, 150);
    state.shift = { phase: "closing", targetAnchor: 158, startedAt: clock.t };
    await saveGridState(
      toStored(
        state,
        {
          symbol: config.symbol,
          exchangeId: "aster",
          direction: "neutral",
          orderSize: config.orderSize,
          maxPositionSize: config.maxPositionSize,
          gridLevels: config.gridLevels,
          gridMode: "geometric",
        },
        clock.t
      )
    );

    const engine = new GridEngine(config, adapter, { now: () => clock.t, skipPersistence: false });
    bootFeeds(adapter, config, { positionAmt: -0.2, entryPrice: 150, price: 158 });
    await settle();
    await drive(engine, 2);
    expect(engine.getSnapshot().shiftPhase).not.toBeNull();
    // closing 续跑：市价买回空头
    expect(adapter.marketOrders.length).toBe(1);
    expect(adapter.marketOrders[0]!.side).toBe("BUY");

    adapter.emitAccount(accountSnapshot(config.symbol, 0, 0));
    await drive(engine, 3);
    const snapshot = engine.getSnapshot();
    expect(snapshot.shiftPhase).toBeNull();
    expect(snapshot.gridVersion).toBe(2);
    expect(snapshot.anchorPrice).toBeCloseTo(158, 0);
    engine.stop();
  });
});
