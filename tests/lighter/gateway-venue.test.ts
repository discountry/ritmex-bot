import { afterEach, describe, expect, it } from "vitest";
import { LighterGateway } from "../../src/exchanges/lighter/gateway";
import type { LighterMarketStats, LighterOrderBookMetadata } from "../../src/exchanges/lighter/types";

/**
 * The gateway constructor spawns the signer bridge, so these exercise the individual methods
 * against a stub `this` — the same approach as order-book-choice.test.ts.
 */
const callOn = <T>(method: string, context: Record<string, unknown>, ...args: unknown[]): T =>
  (LighterGateway.prototype as any)[method].apply(context, args);

const book = (overrides: Partial<LighterOrderBookMetadata>): LighterOrderBookMetadata =>
  ({
    symbol: "ETH/USDG",
    market_id: 2048,
    market_type: "spot",
    supported_price_decimals: 2,
    supported_size_decimals: 4,
    ...overrides,
  }) as LighterOrderBookMetadata;

describe("assertUnitMultiplier", () => {
  const context = () => ({ logger: () => {} });

  it("accepts a missing or unit multiplier", () => {
    expect(() => callOn("assertUnitMultiplier", context(), book({}))).not.toThrow();
    expect(() =>
      callOn("assertUnitMultiplier", context(), book({ multiplier: "1.000000000000000000" }))
    ).not.toThrow();
  });

  it("refuses a market whose multiplier would skew order sizing", () => {
    expect(() =>
      callOn("assertUnitMultiplier", context(), book({ symbol: "SGOV/USDG", multiplier: "1.002981519346766532" }))
    ).toThrow(/multiplier/);
  });

  afterEach(() => {
    delete process.env.LIGHTER_ALLOW_NON_UNIT_MULTIPLIER;
  });

  it("can be overridden explicitly", () => {
    process.env.LIGHTER_ALLOW_NON_UNIT_MULTIPLIER = "1";
    const warnings: unknown[] = [];
    const ctx = { logger: (_: string, message: unknown) => warnings.push(message) };
    expect(() =>
      callOn("assertUnitMultiplier", ctx, book({ symbol: "SGOV/USDG", multiplier: "1.0029" }))
    ).not.toThrow();
    expect(warnings).toHaveLength(1);
  });
});

describe("refreshTicker symbol matching", () => {
  // Robinhood Chain omits market_id from exchangeStats, so matching falls back to the symbol.
  const stats: LighterMarketStats[] = [
    { symbol: "ETH", last_trade_price: "3000", index_price: "3000" } as LighterMarketStats,
    { symbol: "ETH/USDG", last_trade_price: "3001", index_price: "3001" } as LighterMarketStats,
  ];

  const makeContext = (overrides: Record<string, unknown>) => {
    const emitted: unknown[] = [];
    const context = {
      http: { getExchangeStats: async () => stats },
      tickerEvent: { emit: (value: unknown) => emitted.push(value) },
      logger: () => {},
      displaySymbol: "ETHUSDG",
      marketId: 2048,
      ticker: null as LighterMarketStats | null,
      staleReason: null,
      ...overrides,
    };
    return { context, emitted };
  };

  it("matches the spot market by its exact venue symbol, not by base asset", async () => {
    const { context, emitted } = makeContext({
      resolvedMarketSymbol: "ETH/USDG",
      marketSymbol: "ETHUSDG",
    });
    await callOn<Promise<void>>("refreshTicker", context);
    expect(emitted).toHaveLength(1);
    expect((emitted[0] as { lastPrice: string }).lastPrice).toBe("3001");
    expect(context.ticker?.symbol).toBe("ETH/USDG");
  });

  it("matches the perp when that is the resolved market", async () => {
    const { context, emitted } = makeContext({
      resolvedMarketSymbol: "ETH",
      marketSymbol: "ETH",
    });
    await callOn<Promise<void>>("refreshTicker", context);
    expect((emitted[0] as { lastPrice: string }).lastPrice).toBe("3000");
  });

  it("still matches by market_id when the venue provides one", async () => {
    const withIds: LighterMarketStats[] = [
      { symbol: "SOMETHING-ELSE", market_id: 2048, last_trade_price: "42", index_price: "42" } as LighterMarketStats,
    ];
    const { context, emitted } = makeContext({
      http: { getExchangeStats: async () => withIds },
      resolvedMarketSymbol: "ETH/USDG",
      marketSymbol: "ETHUSDG",
    });
    await callOn<Promise<void>>("refreshTicker", context);
    expect((emitted[0] as { lastPrice: string }).lastPrice).toBe("42");
  });
});

describe("verifyNetworkIdentity", () => {
  const rhInfo = {
    code: 200,
    l1_providers: [{ chainId: 4663 }],
    contract_addresses: [{ name: "ZkLighterContract", address: "0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d" }],
  };

  const makeContext = (network: Record<string, unknown>, info: unknown = rhInfo) => ({
    networkVerified: false,
    logger: () => {},
    environment: "rh",
    http: { getLayer1BasicInfo: async () => info },
    network: {
      restUrl: "https://api.rh.lighter.xyz",
      chainId: 466324,
      expectedL1ChainId: 4663,
      expectedZkLighterContract: "0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d",
      ...network,
    },
  });

  it("passes when the deployment fingerprint matches", async () => {
    const context = makeContext({});
    await callOn<Promise<void>>("verifyNetworkIdentity", context);
    expect(context.networkVerified).toBe(true);
  });

  it("fails closed when the host belongs to another deployment", async () => {
    const context = makeContext({ expectedL1ChainId: 1, expectedZkLighterContract: null });
    await expect(callOn<Promise<void>>("verifyNetworkIdentity", context)).rejects.toThrow(
      /network mismatch/i
    );
  });

  it("catches a contract mismatch even when the L1 chain id collides", async () => {
    // rh-testnet and zklighter testnet both report L1 chain id 123456.
    const info = {
      code: 200,
      l1_providers: [{ chainId: 123456 }],
      contract_addresses: [{ name: "ZkLighterContract", address: "0xe034801BC49cCDC79FB683022dA0591C86077261" }],
    };
    const context = makeContext(
      {
        expectedL1ChainId: 123456,
        expectedZkLighterContract: "0x8413Cd5B9856B6D156A8A1066D778885FeaE38F8",
      },
      info
    );
    await expect(callOn<Promise<void>>("verifyNetworkIdentity", context)).rejects.toThrow(
      /ZkLighter contract/
    );
  });

  it("tolerates the endpoint being unavailable", async () => {
    const context = makeContext({});
    context.http = {
      getLayer1BasicInfo: async () => {
        throw new Error("offline");
      },
    };
    await expect(callOn<Promise<void>>("verifyNetworkIdentity", context)).resolves.toBeUndefined();
    expect(context.networkVerified).toBe(false);
  });
});
