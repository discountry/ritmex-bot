import { describe, expect, it } from "vitest";
import { DryRunExchangeAdapter } from "../src/exchanges/dry-run-adapter";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
} from "../src/exchanges/types";

class BaseAdapter implements ExchangeAdapter {
  readonly id = "aster";
  createCalls = 0;

  supportsTrailingStops(): boolean {
    return true;
  }

  watchAccount(_cb: (snapshot: AsterAccountSnapshot) => void): void {}
  watchOrders(_cb: (orders: AsterOrder[]) => void): void {}
  watchDepth(_symbol: string, _cb: (depth: AsterDepth) => void): void {}
  watchTicker(_symbol: string, _cb: (ticker: AsterTicker) => void): void {}
  watchKlines(_symbol: string, _interval: string, _cb: (klines: AsterKline[]) => void): void {}

  async createOrder(_params: CreateOrderParams): Promise<AsterOrder> {
    this.createCalls += 1;
    throw new Error("should not be called in dry-run");
  }

  async cancelOrder(): Promise<void> {}
  async cancelOrders(): Promise<void> {}
  async cancelAllOrders(): Promise<void> {}
}

describe("DryRunExchangeAdapter", () => {
  it("simulates create order and records actions", async () => {
    const base = new BaseAdapter();
    const dry = new DryRunExchangeAdapter(base);

    const order = await dry.createOrder({
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      quantity: 0.01,
      price: 100000,
    });

    expect(base.createCalls).toBe(0);
    expect(order.orderId).toMatch(/^dry-run-/);
    expect(dry.actions.length).toBe(1);
    expect(dry.actions[0]?.method).toBe("createOrder");
  });
});
