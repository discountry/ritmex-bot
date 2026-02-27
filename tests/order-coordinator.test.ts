import { describe, expect, it, vi, beforeEach, afterAll } from "vitest";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type { AsterOrder } from "../src/exchanges/types";
import type { OrderLockMap, OrderTimerMap, OrderPendingMap } from "../src/core/order-coordinator";
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

const baseOrder: AsterOrder = {
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

  it("deduplicates orders by type and side", async () => {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    const openOrders: AsterOrder[] = [
      { ...baseOrder, orderId: 1 },
      { ...baseOrder, orderId: 2 },
    ];
    await deduplicateOrders(adapter, "BTCUSDT", openOrders, locks, timers, pending, "LIMIT", "BUY", log);
    expect(adapter.cancelOrders).toHaveBeenCalledWith({ symbol: "BTCUSDT", orderIdList: [2] });
    expect(log).toHaveBeenCalledWith("order", expect.stringContaining("去重撤销重复"));
  });

  it("places limit orders and records pending id", async () => {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    await placeOrder(
      adapter,
      "BTCUSDT",
      [],
      locks,
      timers,
      pending,
      "BUY",
      100,
      1,
      log,
      false
    );
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(pending.MARKET).toBeUndefined();
    expect(pending.LIMIT).toBe(String(baseOrder.orderId));
  });

  it("places market order and unlocks after completion", async () => {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    await placeMarketOrder(
      adapter,
      "BTCUSDT",
      [],
      locks,
      timers,
      pending,
      "SELL",
      1,
      log,
      true
    );
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(pending.MARKET).toBe(String(baseOrder.orderId));
  });

  it("places stop loss order only when valid", async () => {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    await placeStopLossOrder(
      adapter,
      "BTCUSDT",
      [],
      locks,
      timers,
      pending,
      "SELL",
      99,
      1,
      100,
      log
    );
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("stop", expect.stringContaining("STOP_MARKET"));
  });

  it("places trailing stop order", async () => {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    await placeTrailingStopOrder(
      adapter,
      "BTCUSDT",
      [],
      locks,
      timers,
      pending,
      "SELL",
      101,
      1,
      0.2,
      log
    );
    expect(adapter.createOrder).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("order", expect.stringContaining("挂动态止盈单"));
  });

  it("market close cancels open orders before placing close order", async () => {
    const adapter = createMockExchange();
    const locks: OrderLockMap = {};
    const timers: OrderTimerMap = {};
    const pending: OrderPendingMap = {};
    const log = vi.fn();
    await marketClose(
      adapter,
      "BTCUSDT",
      [{ ...baseOrder, orderId: 2 }],
      locks,
      timers,
      pending,
      "SELL",
      1,
      log
    );
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
