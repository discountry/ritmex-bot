import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BASIS_SUPPORTED_EXCHANGE_IDS,
  SUPPORTED_EXCHANGE_IDS,
  getExchangeDisplayName,
  resolveExchangeId,
  type SupportedExchangeId,
} from "../src/exchanges/create-adapter";
import { parseCliArgs, printCliHelp } from "../src/cli/args";
import { resolveSymbolFromEnv } from "../src/config";
import {
  routeCloseOrder,
  routeLimitOrder,
  routeMarketOrder,
  routeStopOrder,
  routeTrailingStopOrder,
} from "../src/exchanges/order-router";
import { buildAdapterFromEnv } from "../src/exchanges/resolve-from-env";
import type { ExchangeAdapter } from "../src/exchanges/adapter";
import type {
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
} from "../src/exchanges/types";

const ORIGINAL_ENV = { ...process.env };

const REQUIRED_ENV_BY_EXCHANGE: Record<SupportedExchangeId, Record<string, string>> = {
  aster: {
    ASTER_API_KEY: "aster-key",
    ASTER_API_SECRET: "aster-secret",
  },
  grvt: {
    GRVT_API_KEY: "grvt-key",
    GRVT_API_SECRET: `0x${"1".repeat(64)}`,
    GRVT_SUB_ACCOUNT_ID: "sub-account",
    GRVT_INSTRUMENT: "BTC_USDT_Perp",
    GRVT_SYMBOL: "BTCUSDT",
  },
  lighter: {
    LIGHTER_ACCOUNT_INDEX: "1",
    LIGHTER_API_PRIVATE_KEY: "lighter-private-key",
    LIGHTER_API_KEY_INDEX: "0",
  },
  backpack: {
    BACKPACK_API_KEY: "backpack-key",
    BACKPACK_API_SECRET: "backpack-secret",
  },
  paradex: {
    PARADEX_PRIVATE_KEY: `0x${"2".repeat(64)}`,
    PARADEX_WALLET_ADDRESS: `0x${"3".repeat(40)}`,
  },
  nado: {
    NADO_SIGNER_PRIVATE_KEY: `0x${"4".repeat(64)}`,
    NADO_SUBACCOUNT_OWNER: `0x${"5".repeat(40)}`,
  },
  standx: {
    STANDX_TOKEN: "standx-token",
  },
  binance: {
    BINANCE_API_KEY: "binance-key",
    BINANCE_API_SECRET: "binance-secret",
  },
};

class RecorderAdapter implements ExchangeAdapter {
  readonly id: SupportedExchangeId;
  public lastCreateOrderParams: CreateOrderParams | null = null;

  constructor(id: SupportedExchangeId) {
    this.id = id;
  }

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(_cb: (snapshot: AsterAccountSnapshot) => void): void {}

  watchOrders(_cb: (orders: AsterOrder[]) => void): void {}

  watchDepth(_symbol: string, _cb: (depth: AsterDepth) => void): void {}

  watchTicker(_symbol: string, _cb: (ticker: AsterTicker) => void): void {}

  watchKlines(_symbol: string, _interval: string, _cb: (klines: AsterKline[]) => void): void {}

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    this.lastCreateOrderParams = params;
    return {
      orderId: 1,
      clientOrderId: "test-client-order",
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
      timeInForce: params.timeInForce,
    };
  }

  async cancelOrder(_params: { symbol: string; orderId: number | string }): Promise<void> {}

  async cancelOrders(_params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {}

  async cancelAllOrders(_params: { symbol: string }): Promise<void> {}
}

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("exchange contract suite", () => {
  it("keeps exchange registry consistent and case-insensitive", () => {
    expect(new Set(SUPPORTED_EXCHANGE_IDS).size).toBe(SUPPORTED_EXCHANGE_IDS.length);
    expect(new Set(BASIS_SUPPORTED_EXCHANGE_IDS).size).toBe(BASIS_SUPPORTED_EXCHANGE_IDS.length);

    for (const id of BASIS_SUPPORTED_EXCHANGE_IDS) {
      expect(SUPPORTED_EXCHANGE_IDS).toContain(id);
    }

    for (const id of SUPPORTED_EXCHANGE_IDS) {
      expect(resolveExchangeId(id.toUpperCase())).toBe(id);
      expect(getExchangeDisplayName(id)).toBeTruthy();
    }
  });

  it("accepts every supported exchange from CLI and documents them in help output", () => {
    for (const id of SUPPORTED_EXCHANGE_IDS) {
      expect(parseCliArgs(["--exchange", id]).exchange).toBe(id);
      expect(parseCliArgs(["--exchange", id.toUpperCase()]).exchange).toBe(id);
    }

    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    printCliHelp();
    const output = spy.mock.calls.map((entry) => String(entry[0] ?? "")).join("\n");
    for (const id of SUPPORTED_EXCHANGE_IDS) {
      expect(output).toContain(id);
    }
    spy.mockRestore();
  });

  it("provides a default symbol fallback for every supported exchange", () => {
    for (const id of SUPPORTED_EXCHANGE_IDS) {
      const symbol = resolveSymbolFromEnv(id);
      expect(typeof symbol).toBe("string");
      expect(symbol.length).toBeGreaterThan(0);
    }
  });

  it("builds the requested adapter id for every supported exchange", () => {
    for (const id of SUPPORTED_EXCHANGE_IDS) {
      process.env = { ...ORIGINAL_ENV, ...REQUIRED_ENV_BY_EXCHANGE[id] };
      const adapter = buildAdapterFromEnv({ exchangeId: id, symbol: "BTCUSDT" });
      expect(adapter.id).toBe(id);
      expect(typeof adapter.supportsTrailingStops()).toBe("boolean");
      expect(typeof adapter.watchAccount).toBe("function");
      expect(typeof adapter.watchOrders).toBe("function");
      expect(typeof adapter.watchDepth).toBe("function");
      expect(typeof adapter.watchTicker).toBe("function");
      expect(typeof adapter.watchKlines).toBe("function");
      expect(typeof adapter.createOrder).toBe("function");
      expect(typeof adapter.cancelOrder).toBe("function");
      expect(typeof adapter.cancelOrders).toBe("function");
      expect(typeof adapter.cancelAllOrders).toBe("function");
    }
  });

  it("fails fast when required credentials are missing", () => {
    for (const id of SUPPORTED_EXCHANGE_IDS) {
      process.env = { ...ORIGINAL_ENV };
      expect(() => buildAdapterFromEnv({ exchangeId: id, symbol: "BTCUSDT" })).toThrow();
    }
  });

  it("routes core order intents for every supported exchange", async () => {
    delete process.env.EXCHANGE;
    delete process.env.TRADE_EXCHANGE;

    for (const id of SUPPORTED_EXCHANGE_IDS) {
      const adapter = new RecorderAdapter(id);

      await routeLimitOrder({
        adapter,
        symbol: "BTCUSDT",
        side: "BUY",
        quantity: 0.01,
        price: 100_000,
      });
      expect(adapter.lastCreateOrderParams?.type).toBe("LIMIT");

      await routeMarketOrder({
        adapter,
        symbol: "BTCUSDT",
        side: "SELL",
        quantity: 0.01,
      });
      expect(adapter.lastCreateOrderParams?.type).toBe("MARKET");

      await routeStopOrder({
        adapter,
        symbol: "BTCUSDT",
        side: "SELL",
        quantity: 0.01,
        stopPrice: 99_000,
      });
      expect(adapter.lastCreateOrderParams?.type).toBe("STOP_MARKET");

      await routeCloseOrder({
        adapter,
        symbol: "BTCUSDT",
        side: "SELL",
        quantity: 0.01,
        reduceOnly: true,
        closePosition: true,
      });
      expect(adapter.lastCreateOrderParams?.type).toBe("MARKET");
      expect(adapter.lastCreateOrderParams?.reduceOnly).toBe("true");
    }
  });

  it("routes trailing-stop intent by exchange capability (supported or explicit rejection)", async () => {
    delete process.env.EXCHANGE;
    delete process.env.TRADE_EXCHANGE;

    for (const id of SUPPORTED_EXCHANGE_IDS) {
      const adapter = new RecorderAdapter(id);
      const intent = {
        adapter,
        symbol: "BTCUSDT",
        side: "SELL" as const,
        quantity: 0.01,
        activationPrice: 101_000,
        callbackRate: 0.2,
      };

      try {
        const order = await routeTrailingStopOrder(intent);
        expect(order.type).toBe("TRAILING_STOP_MARKET");
        expect(adapter.lastCreateOrderParams?.type).toBe("TRAILING_STOP_MARKET");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        expect(message).toMatch(/does not support trailing stop/i);
      }
    }
  });
});
