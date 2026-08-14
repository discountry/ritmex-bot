import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signerConfigs: Array<{ chainId: number; baseUrl?: string; accountIndex: number | bigint }> = [];

// Keeps the real signer (and its python bridge subprocess) out of these wiring tests.
vi.mock("../../src/exchanges/lighter/signer", () => ({
  LighterSigner: class {
    readonly accountIndex: bigint;
    readonly chainId: number;
    readonly defaultKeyIndex = 0;
    constructor(config: { chainId: number; baseUrl?: string; accountIndex: number | bigint }) {
      signerConfigs.push(config);
      this.accountIndex = BigInt(config.accountIndex);
      this.chainId = config.chainId;
    }
  },
}));

const { LighterGateway } = await import("../../src/exchanges/lighter/gateway");

const LIGHTER_ENV_KEYS = [
  "LIGHTER_ENV",
  "LIGHTER_BASE_URL",
  "LIGHTER_WS_URL",
  "LIGHTER_MARKET_ID",
  "LIGHTER_MARKET_TYPE",
] as const;

let savedEnv: Record<string, string | undefined> = {};

const build = (options: Record<string, unknown> = {}) =>
  new LighterGateway({
    symbol: "BTCUSDT",
    marketSymbol: "BTC",
    accountIndex: 7,
    apiKeys: { 0: "0xdeadbeef" },
    ...options,
  } as any);

const lastSigner = () => signerConfigs[signerConfigs.length - 1]!;

describe("LighterGateway venue wiring", () => {
  beforeEach(() => {
    savedEnv = Object.fromEntries(LIGHTER_ENV_KEYS.map((key) => [key, process.env[key]]));
    for (const key of LIGHTER_ENV_KEYS) delete process.env[key];
    signerConfigs.length = 0;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    vi.restoreAllMocks();
  });

  it("wires rest, websocket and chain id from a single environment name", () => {
    const gateway = build({ environment: "rh" }) as any;
    expect(gateway.wsUrl).toBe("wss://api.rh.lighter.xyz/stream");
    expect(gateway.network.restUrl).toBe("https://api.rh.lighter.xyz");
    expect(lastSigner().chainId).toBe(466324);
    expect(lastSigner().baseUrl).toBe("https://api.rh.lighter.xyz");
  });

  it("accepts an alias from LIGHTER_ENV", () => {
    process.env.LIGHTER_ENV = "robinhood";
    const gateway = build() as any;
    expect(gateway.environment).toBe("rh");
    expect(lastSigner().chainId).toBe(466324);
  });

  it("follows the base url instead of defaulting the websocket to testnet", () => {
    const gateway = build({ baseUrl: "https://api.rh.lighter.xyz" }) as any;
    expect(gateway.wsUrl).toBe("wss://api.rh.lighter.xyz/stream");
    expect(lastSigner().chainId).toBe(466324);
  });

  it("keeps mainnet unaffected", () => {
    const gateway = build({ environment: "mainnet" }) as any;
    expect(gateway.wsUrl).toBe("wss://mainnet.zklighter.elliot.ai/stream");
    expect(lastSigner().chainId).toBe(304);
  });

  it("honours an explicit websocket override", () => {
    process.env.LIGHTER_WS_URL = "wss://custom.example/stream";
    const gateway = build({ environment: "rh" }) as any;
    expect(gateway.wsUrl).toBe("wss://custom.example/stream");
  });

  it("does not discard an explicit market id or decimals", () => {
    const gateway = build({ environment: "rh", marketId: 16, priceDecimals: 2, sizeDecimals: 4 }) as any;
    expect(gateway.marketId).toBe(16);
    expect(gateway.priceDecimals).toBe(2);
    expect(gateway.sizeDecimals).toBe(4);
  });

  it("reads a market id from the environment when none is passed", () => {
    process.env.LIGHTER_MARKET_ID = "21";
    const gateway = build({ environment: "rh" }) as any;
    expect(gateway.marketId).toBe(21);
  });

  it("applies the spot preset of the resolved venue only", () => {
    const rh = build({ environment: "rh", marketSymbol: "ETH/USDG" }) as any;
    expect(rh.marketId).toBe(2048);
    expect(rh.quoteAssetSymbol).toBe("USDG");
    expect(rh.marketType).toBe("spot");

    // The mainnet preset key must not leak into the rh venue.
    const rhWithMainnetSymbol = build({ environment: "rh", marketSymbol: "ETHUSDC" }) as any;
    expect(rhWithMainnetSymbol.marketId).toBeNull();
  });

  it("infers the venue from a spot-only symbol when nothing else is configured", () => {
    const mainnet = build({ marketSymbol: "ETHUSDC" }) as any;
    expect(mainnet.environment).toBe("mainnet");
    expect(mainnet.marketId).toBe(2048);
    expect(lastSigner().chainId).toBe(304);

    const rh = build({ marketSymbol: "ETHUSDG" }) as any;
    expect(rh.environment).toBe("rh");
    expect(lastSigner().chainId).toBe(466324);
  });

  it("announces the resolved venue once", () => {
    build({ environment: "rh" });
    const banner = (console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls
      .map((args) => String(args[0]))
      .find((line) => line.startsWith("[Lighter] env="));
    expect(banner).toContain("env=rh");
    expect(banner).toContain("rest=https://api.rh.lighter.xyz");
    expect(banner).toContain("ws=wss://api.rh.lighter.xyz/stream");
    expect(banner).toContain("chainId=466324");
  });
});
