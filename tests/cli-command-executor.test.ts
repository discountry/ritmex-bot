import { describe, expect, it, vi } from "vitest";
import { executeCliCommand } from "../src/cli/command-executor";
import type { ParsedCliCommand } from "../src/cli/command-types";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
} from "../src/exchanges/types";

class FakeAdapter implements ExchangeAdapter {
  readonly id = "aster";
  createOrderCalls = 0;
  cancelOrderCalls = 0;
  cancelOrdersCalls = 0;
  cancelAllOrdersCalls = 0;

  supportsTrailingStops(): boolean {
    return true;
  }

  watchAccount(cb: (snapshot: AsterAccountSnapshot) => void): void {
    cb({
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Date.now(),
      totalWalletBalance: "100",
      totalUnrealizedProfit: "0",
      positions: [],
      assets: [],
    });
  }

  watchOrders(cb: (orders: AsterOrder[]) => void): void {
    cb([]);
  }

  watchDepth(_symbol: string, cb: (depth: AsterDepth) => void): void {
    cb({
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "1"]],
    });
  }

  watchTicker(symbol: string, cb: (ticker: AsterTicker) => void): void {
    cb({
      symbol,
      lastPrice: "100",
      openPrice: "99",
      highPrice: "102",
      lowPrice: "98",
      volume: "10",
      quoteVolume: "1000",
      eventTime: Date.now(),
    } as AsterTicker);
  }

  watchKlines(_symbol: string, _interval: string, cb: (klines: AsterKline[]) => void): void {
    cb([
      {
        openTime: 1,
        open: "100",
        high: "101",
        low: "99",
        close: "100",
        volume: "1",
        closeTime: 2,
        numberOfTrades: 1,
      },
    ]);
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    this.createOrderCalls += 1;
    return {
      orderId: "1",
      clientOrderId: "1",
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      status: "NEW",
      price: String(params.price ?? 0),
      origQty: String(params.quantity ?? 0),
      executedQty: "0",
      stopPrice: String(params.stopPrice ?? 0),
      time: Date.now(),
      updateTime: Date.now(),
      reduceOnly: params.reduceOnly === "true",
      closePosition: params.closePosition === "true",
    };
  }

  async cancelOrder(): Promise<void> {
    this.cancelOrderCalls += 1;
  }

  async cancelOrders(): Promise<void> {
    this.cancelOrdersCalls += 1;
  }

  async cancelAllOrders(): Promise<void> {
    this.cancelAllOrdersCalls += 1;
  }
}

function common(overrides: Partial<ParsedCliCommand> = {}): any {
  return {
    json: true,
    dryRun: false,
    timeoutMs: 1000,
    ...overrides,
  };
}

describe("command executor", () => {
  it("executes market ticker command", async () => {
    const adapter = new FakeAdapter();
    const command: ParsedCliCommand = {
      kind: "market-ticker",
      ...common({
        exchange: "aster",
        symbol: "BTCUSDT",
      }),
    };

    const result = await executeCliCommand(command, {
      buildAdapterFromEnvFn: () => adapter,
    });

    expect(result.exitCode).toBe(0);
    expect(result.payload.success).toBe(true);
    if (result.payload.success) {
      expect((result.payload.data as any).ticker.symbol).toBe("BTCUSDT");
    }
  });

  it("uses dry-run wrapper for order create", async () => {
    const adapter = new FakeAdapter();
    const command: ParsedCliCommand = {
      kind: "order-create",
      ...common({
        exchange: "aster",
        symbol: "BTCUSDT",
        dryRun: true,
      }),
      payload: {
        side: "BUY",
        type: "limit",
        quantity: 0.01,
        price: 100000,
      },
    };

    const result = await executeCliCommand(command, {
      buildAdapterFromEnvFn: () => adapter,
    });

    expect(result.exitCode).toBe(0);
    expect(adapter.createOrderCalls).toBe(0);
    expect(result.payload.success).toBe(true);
    if (result.payload.success) {
      const data = result.payload.data as any;
      expect(Array.isArray(data.dryRunActions)).toBe(true);
      expect(data.dryRunActions.length).toBeGreaterThan(0);
    }
  });

  it("uses dry-run wrapper for order cancel", async () => {
    const adapter = new FakeAdapter();
    const command: ParsedCliCommand = {
      kind: "order-cancel",
      ...common({
        exchange: "aster",
        symbol: "BTCUSDT",
        dryRun: true,
      }),
      orderId: "abc",
    };

    const result = await executeCliCommand(command, {
      buildAdapterFromEnvFn: () => adapter,
    });

    expect(result.exitCode).toBe(0);
    expect(adapter.cancelOrderCalls).toBe(0);
    expect(result.payload.success).toBe(true);
  });

  it("returns unsupported for order-open when queryOpenOrders is unavailable", async () => {
    const adapter = new FakeAdapter();
    const command: ParsedCliCommand = {
      kind: "order-open",
      ...common({
        exchange: "aster",
      }),
    };

    const result = await executeCliCommand(command, {
      buildAdapterFromEnvFn: () => adapter,
    });

    expect(result.exitCode).toBe(5);
    expect(result.payload.success).toBe(false);
    if (!result.payload.success) {
      expect(result.payload.error.code).toBe("UNSUPPORTED");
    }
  });

  it("passes dryRun to strategy runner", async () => {
    const startStrategyFn = vi.fn(async () => undefined);
    const command: ParsedCliCommand = {
      kind: "strategy-run",
      ...common({
        exchange: "aster",
        dryRun: true,
      }),
      strategy: "trend",
      silent: true,
    };

    const result = await executeCliCommand(command, {
      startStrategyFn,
    });

    expect(result.exitCode).toBe(0);
    expect(startStrategyFn).toHaveBeenCalledWith("trend", { silent: true, dryRun: true });
  });

  it("falls back to static capabilities when adapter creation fails", async () => {
    const command: ParsedCliCommand = {
      kind: "exchange-capabilities",
      ...common({
        exchange: "binance",
      }),
    };

    const result = await executeCliCommand(command, {
      buildAdapterFromEnvFn: () => {
        throw new Error("Missing BINANCE_API_KEY environment variable");
      },
    });

    expect(result.exitCode).toBe(0);
    expect(result.payload.success).toBe(true);
    if (result.payload.success) {
      expect((result.payload.data as any).source).toBe("static");
    }
  });
});
