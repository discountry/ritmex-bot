import { describe, expect, it, vi } from "vitest";
import { ParadexGateway } from "../src/exchanges/paradex/gateway";

describe("ParadexGateway createOrder", () => {
  it("sets `size` for closePosition MARKET orders even when amount is omitted", async () => {
    const createOrder = vi.fn(async (symbol, type, side, amount, price, params) => ({
      id: "1",
      symbol,
      type,
      side,
      status: "open",
      price: price ?? 0,
      amount: amount ?? Number(params?.size ?? 0),
      filled: 0,
      stopPrice: undefined,
      timestamp: Date.now(),
      lastUpdateTimestamp: Date.now(),
      info: {
        reduceOnly: params?.reduceOnly,
        closePosition: params?.closePosition,
      },
    }));

    const gateway = new ParadexGateway({
      symbol: "BTC/USDC",
      displaySymbol: "BTC/USDC",
      privateKey: "test",
      walletAddress: "test",
      logger: () => {},
      usePro: false,
    }) as any;

    gateway.exchange = { createOrder, markets: {}, symbols: [] };
    gateway.initialized = true;
    gateway.marketSymbol = "BTC/USDC";

    await gateway.createOrder({
      symbol: "BTC/USDC",
      side: "SELL",
      type: "MARKET",
      quantity: 1.23,
      reduceOnly: "true",
      closePosition: "true",
    });

    expect(createOrder).toHaveBeenCalledTimes(1);
    const [_symbol, _type, _side, amountArg, _price, extraParams] = createOrder.mock.calls[0]!;
    expect(amountArg).toBeUndefined();
    expect(extraParams).toMatchObject({
      closePosition: true,
      reduceOnly: true,
      size: "1.23",
    });
  });
});

