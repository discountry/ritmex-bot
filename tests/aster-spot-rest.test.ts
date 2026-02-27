import crypto from "crypto";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AsterSpotRestClient } from "../src/exchanges/aster/client";

describe("AsterSpotRestClient", () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    fetchMock = vi.fn();
    // @ts-expect-error override for tests
    globalThis.fetch = fetchMock;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls ping without credentials", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const client = new AsterSpotRestClient({ apiKey: "key", apiSecret: "secret" });

    await client.ping();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://sapi.asterdex.com/api/v1/ping");
    expect(init.method).toBe("GET");
    expect(init.headers).toEqual({});
  });

  it("signs market order requests", async () => {
    const orderResponse = {
      orderId: 1,
      clientOrderId: "abc",
      symbol: "BTCUSDT",
      side: "BUY",
      type: "MARKET",
      status: "FILLED",
      price: "0",
      origQty: "1",
      executedQty: "1",
      stopPrice: "0",
      time: 1000,
      updateTime: 1000,
      reduceOnly: false,
      closePosition: false,
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(orderResponse), { status: 200 }));
    const client = new AsterSpotRestClient({ apiKey: "key", apiSecret: "secret" });
    vi.spyOn(Date, "now").mockReturnValue(1000);

    await client.createOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", quoteOrderQty: "100" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://sapi.asterdex.com/api/v1/order");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "X-MBX-APIKEY": "key",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    const payload = "quoteOrderQty=100&recvWindow=5000&side=BUY&symbol=BTCUSDT&timestamp=1000&type=MARKET";
    const expectedSignature = crypto.createHmac("sha256", "secret").update(payload).digest("hex");
    expect(init.body).toBe(`${payload}&signature=${expectedSignature}`);
  });

  it("attaches api key for historical trades without signing", async () => {
    const trades = [
      { id: 1, price: "1", qty: "1", time: 1000, isBuyerMaker: false },
    ];
    fetchMock.mockResolvedValue(new Response(JSON.stringify(trades), { status: 200 }));
    const client = new AsterSpotRestClient({ apiKey: "key", apiSecret: "secret" });

    await client.getHistoricalTrades({ symbol: "BTCUSDT" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://sapi.asterdex.com/api/v1/historicalTrades?symbol=BTCUSDT");
    expect(init.method).toBe("GET");
    expect(init.headers).toEqual({ "X-MBX-APIKEY": "key" });
  });
});

