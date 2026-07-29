import { describe, expect, it, vi, beforeEach, afterAll } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { Order } from "../src/exchanges/types";
import type {
  OrderContext,
  OrderLockMap,
  OrderPendingMap,
  OrderTimerMap,
} from "../src/core/order-coordinator";
import {
  deduplicateOrders,
  placeOrder,
  placeMarketOrder,
  placeStopLossOrder,
  placeTrailingStopOrder,
  marketClose,
  unlockOperating,
} from "../src/core/order-coordinator";

const originalTradeExchange = process.env.TRADE_EXCHANGE;
const originalExchange = process.env.EXCHANGE;

const baseOrder: Order = {
  orderId: 1,
  clientOrderId: "client",
  symbol: "BTCUSDT",
  side: "BUY",
  type: "LIMIT",
  status: "NEW",
  price: "100",
  origQty: "1",
  executedQty: "0",
  stopPrice: "0",
  time: Date.now(),
  updateTime: Date.now(),
  reduceOnly: false,
  closePosition: false,
};

function createMockExchange(overrides: Partial<ExchangeAdapter> = {}): ExchangeAdapter {
  return {
    id: "mock",
    supportsTrailingStops: () => true,
    watchAccount: () => undefined,
    watchOrders: () => undefined,
    watchDepth: () => undefined,
    watchTicker: () => undefined,
    watchKlines: () => undefined,
    createOrder: vi.fn(async () => baseOrder),
    cancelOrder: vi.fn(async () => undefined),
    cancelOrders: vi.fn(async () => undefined),
    cancelAllOrders: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe("order-coordinator", () => {
  beforeEach(() => {
    process.env.TRADE_EXCHANGE = "aster";
    process.env.EXCHANGE = undefined;
  });

  afterAll(() => {
    process.env.TRADE_EXCHANGE = originalTradeExchange;
    process.env.EXCHANGE = originalExchange;
  });

  /** One order context plus handles on the pieces the assertions poke at. */
  function createContext() {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    const ctx: OrderContext = { adapter, symbol: "BTCUSDT", locks, timers, pendings: pending, log };
    return { ctx, adapter, locks, timers, pending, log };
  }

  it("deduplicates orders by type and side", async () => {
    const { ctx, adapter, log } = createContext();
    const openOrders: Order[] = [
      { ...baseOrder, orderId: 1 },
      { ...baseOrder, orderId: 2 },
    ];
    await deduplicateOrders(ctx, openOrders, "LIMIT", "BUY");
    expect(adapter.cancelOrders).toHaveBeenCalledWith({ symbol: "BTCUSDT", orderIdList: [2] });
    expect(log).toHaveBeenCalledWith("order", expect.stringContaining("去重撤销重复"));
  });

  it("places limit orders and records pending id", async () => {
    const { ctx, adapter, pending } = createContext();
    await placeOrder(ctx, { openOrders: [], side: "BUY", price: "100", amount: 1, reduceOnly: false });
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(pending.MARKET).toBeUndefined();
    expect(pending.LIMIT).toBe(String(baseOrder.orderId));
  });

  it("places market order and unlocks after completion", async () => {
    const { ctx, adapter, pending } = createContext();
    await placeMarketOrder(ctx, { openOrders: [], side: "SELL", amount: 1, reduceOnly: true });
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(pending.MARKET).toBe(String(baseOrder.orderId));
  });

  it("places stop loss order only when valid", async () => {
    const { ctx, adapter, log } = createContext();
    await placeStopLossOrder(ctx, {
      openOrders: [],
      side: "SELL",
      stopPrice: 99,
      quantity: 1,
      lastPrice: 100,
    });
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("stop", expect.stringContaining("STOP_MARKET"));
  });

  it("places trailing stop order", async () => {
    const { ctx, adapter, log } = createContext();
    await placeTrailingStopOrder(ctx, {
      openOrders: [],
      side: "SELL",
      activationPrice: 101,
      quantity: 1,
      callbackRate: 0.2,
    });
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("order", expect.stringContaining("挂动态止盈单"));
  });

  it("market close cancels open orders before placing close order", async () => {
    const { ctx, adapter, log } = createContext();
    await marketClose(ctx, {
      openOrders: [{ ...baseOrder, orderId: 2 }],
      side: "SELL",
      quantity: 1,
    });
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("close", expect.stringContaining("市价平仓"));
  });

  it("unlockOperating clears timers and pending", () => {
    const locks: OrderLockMap = { LIMIT: true };
    const fakeTimer = {} as ReturnType<typeof setTimeout>;
    const timers: OrderTimerMap = { LIMIT: fakeTimer };
    const pending: OrderPendingMap = { LIMIT: "123" };
    unlockOperating(locks, timers, pending, "LIMIT");
    expect(locks.LIMIT).toBe(false);
    expect(pending.LIMIT).toBeNull();
    expect(timers.LIMIT).toBeNull();
  });
});
