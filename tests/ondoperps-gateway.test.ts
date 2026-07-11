import { describe, expect, it, vi } from "vitest";
import {
  buildOndoperpsAuthHeaders,
  createOndoperpsWsSignature,
  mapOndoperpsAccountSnapshot,
  mapOndoperpsOrder,
  normalizeOndoperpsSymbol,
  OndoperpsGateway,
} from "../src/exchanges/ondoperps/gateway";

describe("Ondo Perps gateway", () => {
  it("normalizes common symbols to the official market format", () => {
    expect(normalizeOndoperpsSymbol("")).toBe("BTC-USD.P");
    expect(normalizeOndoperpsSymbol("xau")).toBe("XAU-USD.P");
    expect(normalizeOndoperpsSymbol("NVDA/USD")).toBe("NVDA-USD.P");
    expect(normalizeOndoperpsSymbol("AAPL-USD.P")).toBe("AAPL-USD.P");
  });

  it("builds REST and WebSocket HMAC signatures from the documented payload", () => {
    const body = JSON.stringify({ market: "XAU-USD.P", side: "buy", size: "1" });
    const headers = buildOndoperpsAuthHeaders({
      apiKeyId: "ondoKeyId_test",
      apiSecret: "ondoApiSecret_secret",
      timestamp: "1700000000000",
      method: "POST",
      requestPath: "/v1/perps/orders?market=XAU-USD.P",
      body,
    });

    expect(headers).toEqual({
      "ONDO-KEY-ID": "ondoKeyId_test",
      "ONDO-TIMESTAMP": "1700000000000",
      "ONDO-SIGN": "3cf0628da79a19225d79fd17ab4767ee1ecae0219a52e1b1fc1b0c1a8bc7a880",
    });
    expect(createOndoperpsWsSignature("ondoApiSecret_secret", "1700000000000")).toBe(
      "eb87f259c41c7cba728b1ce5baf0a385e6e5c1b1031424d73206cacbaebea742",
    );
    expect(createOndoperpsWsSignature("ondoApiSecret_secret", "1700000000000", true)).toBe(
      "46ca7822ee8444eccd96feaa596e30072c8428aa8ec2cedbe0fdc6744bc21ec7",
    );
  });

  it("maps Ondo order fields into the shared exchange contract", () => {
    const order = mapOndoperpsOrder(
      {
        orderId: "order-1",
        clientOrderId: "client-1",
        side: "sell",
        price: "201.25",
        size: "2",
        market: "NVDA-USD.P",
        filledSize: "0.5",
        filledCost: "100.625",
        status: "open",
        createdAt: "2026-07-11T00:00:00Z",
        type: "limit",
        timeInForce: "GTC",
        reduceOnly: true,
      },
      "NVDA-USD.P",
    );

    expect(order).toMatchObject({
      orderId: "order-1",
      clientOrderId: "client-1",
      symbol: "NVDA-USD.P",
      side: "SELL",
      type: "LIMIT",
      status: "NEW",
      origQty: "2",
      executedQty: "0.5",
      avgPrice: "201.25",
      reduceOnly: true,
    });
  });

  it("creates post-only orders with signed REST headers", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetchFn = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      requests.push({ url, init });
      if (url.endsWith("/v1/markets")) {
        return new Response(JSON.stringify({
          success: true,
          result: {
            perps: {
              tradingPairs: [
                { market: "XAU-USD.P", baseIncrement: "0.01", quoteIncrement: "0.1" },
              ],
            },
          },
        }));
      }
      return new Response(JSON.stringify({
        success: true,
        result: {
          orderId: "order-2",
          clientOrderId: "client-2",
          side: "buy",
          price: "2500",
          size: "0.5",
          market: "XAU-USD.P",
          filledSize: "0",
          status: "open",
          createdAt: "2026-07-11T00:00:00Z",
          type: "limit",
          timeInForce: "GTC",
          reduceOnly: false,
        },
      }));
    });
    const fakeWebSocket = {
      readyState: 0,
      addEventListener: vi.fn(),
      send: vi.fn(),
    } as unknown as WebSocket;
    const gateway = new OndoperpsGateway({
      apiKeyId: "ondoKeyId_test",
      apiSecret: "ondoApiSecret_secret",
      symbol: "XAU-USD.P",
      fetchFn: fetchFn as unknown as typeof fetch,
      webSocketFactory: () => fakeWebSocket,
      now: () => 1_700_000_000_000,
    });

    const order = await gateway.createOrder({
      symbol: "XAU-USD.P",
      side: "BUY",
      type: "LIMIT",
      quantity: 0.5,
      price: 2500,
      timeInForce: "GTX",
      clientOrderId: "client-2",
    });

    const request = requests[1];
    expect(request?.url).toBe("https://api.ondoperps.xyz/v1/perps/orders");
    expect(JSON.parse(String(request?.init?.body))).toMatchObject({
      market: "XAU-USD.P",
      type: "limit",
      side: "buy",
      size: "0.5",
      price: "2500",
      timeInForce: "GTC",
      postOnly: true,
      clientOrderId: "client-2",
    });
    expect(request?.init?.headers).toMatchObject({
      "ONDO-KEY-ID": "ondoKeyId_test",
      "ONDO-TIMESTAMP": "1700000000000",
    });
    expect(order).toMatchObject({ orderId: "order-2", status: "NEW", type: "LIMIT" });
  });

  it("maps short positions and USDC margin fields into an account snapshot", () => {
    const snapshot = mapOndoperpsAccountSnapshot(
      {
        walletBalance: "5000",
        realizedPnl: "10",
        unrealizedPnl: "-25",
        marginBalance: "4975",
        usedMargin: "1000",
        availableMargin: "3975",
        withdrawableMargin: "3975",
        maintenanceMarginRequirement: "50",
        totalMaintenanceMargin: "80",
        marginRatio: "0.016",
        leverage: "1.5",
        underLiquidation: false,
        totalFundingPayments: "-1",
        totalTradingFees: "2",
        totalPnL: "-18",
      },
      [
        {
          market: "NVDA-USD.P",
          direction: "short",
          netQuantity: "3",
          averageEntryPrice: "200",
          usedMargin: "1000",
          unrealizedPnl: "-25",
          markPrice: "208.33",
          liquidationPrice: "260",
          bankruptcyPrice: "275",
          maintenanceMargin: "50",
          notionalValue: "625",
          leverage: "1.5",
          netFundingSinceNeutral: "-1",
          returnOnEquity: "-0.025",
        },
      ],
      "NVDA-USD.P",
      "NVDA-USD.P",
      1234,
    );

    expect(snapshot.totalWalletBalance).toBe("5000");
    expect(snapshot.availableBalance).toBe("3975");
    expect(snapshot.assets[0]?.asset).toBe("USDC");
    expect(snapshot.positions[0]).toMatchObject({
      symbol: "NVDA-USD.P",
      positionAmt: "-3",
      entryPrice: "200",
      markPrice: "208.33",
      positionSide: "BOTH",
    });
  });
});
