import { afterEach, describe, expect, it, vi } from "vitest";
import { StandxGateway } from "../src/exchanges/standx/gateway";

const ORIGINAL_FETCH = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe("StandxGateway REST health", () => {
  it("emits unhealthy after 3 consecutive REST failures, then healthy after a success", async () => {
    const gateway = new StandxGateway({
      token: "test-token",
      symbol: "BTC-USD",
      baseUrl: "https://example.com",
      wsUrl: "wss://example.com/ws",
      logger: () => {},
    });

    const events: Array<{ state: string; consecutiveErrors: number }> = [];
    gateway.onRestHealthEvent((state, info) => {
      events.push({ state, consecutiveErrors: info.consecutiveErrors });
    });

    globalThis.fetch = vi.fn(async () => {
      return {
        ok: false,
        status: 500,
        text: async () => "server error",
      } as any;
    }) as any;

    await expect(gateway.queryOpenOrders("BTC-USD")).rejects.toThrow();
    await expect(gateway.queryOpenOrders("BTC-USD")).rejects.toThrow();
    await expect(gateway.queryOpenOrders("BTC-USD")).rejects.toThrow();

    expect(events).toEqual([{ state: "unhealthy", consecutiveErrors: 3 }]);

    globalThis.fetch = vi.fn(async () => {
      return {
        ok: true,
        status: 200,
        text: async () => "[]",
      } as any;
    }) as any;

    await expect(gateway.queryOpenOrders("BTC-USD")).resolves.toEqual([]);
    expect(events).toEqual([
      { state: "unhealthy", consecutiveErrors: 3 },
      { state: "healthy", consecutiveErrors: 0 },
    ]);
  });
});

