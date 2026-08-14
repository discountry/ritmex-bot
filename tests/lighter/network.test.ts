import { describe, expect, it } from "vitest";
import {
  deriveWebSocketUrl,
  detectEnvironmentFromUrl,
  normalizeEnvironmentName,
  resolveLighterNetwork,
} from "../../src/exchanges/lighter/network";

describe("normalizeEnvironmentName", () => {
  it("accepts canonical names and aliases regardless of case", () => {
    expect(normalizeEnvironmentName("rh")).toBe("rh");
    expect(normalizeEnvironmentName("RH")).toBe("rh");
    expect(normalizeEnvironmentName(" Robinhood ")).toBe("rh");
    expect(normalizeEnvironmentName("robinhoodchain")).toBe("rh");
    expect(normalizeEnvironmentName("rh-testnet")).toBe("rh-testnet");
    expect(normalizeEnvironmentName("prod")).toBe("mainnet");
  });

  it("returns null for empty input", () => {
    expect(normalizeEnvironmentName(undefined)).toBeNull();
    expect(normalizeEnvironmentName("")).toBeNull();
  });

  it("throws instead of silently falling back on a typo", () => {
    expect(() => normalizeEnvironmentName("rhh")).toThrow(/Unknown Lighter environment/);
  });
});

describe("detectEnvironmentFromUrl", () => {
  it("matches the Robinhood hosts before the testnet substring rule", () => {
    expect(detectEnvironmentFromUrl("https://api.rh.lighter.xyz")).toBe("rh");
    // Contains "testnet" but must not resolve to the zklighter testnet.
    expect(detectEnvironmentFromUrl("https://api.rh-testnet.lighter.xyz")).toBe("rh-testnet");
  });

  it("matches the zklighter hosts", () => {
    expect(detectEnvironmentFromUrl("https://mainnet.zklighter.elliot.ai")).toBe("mainnet");
    expect(detectEnvironmentFromUrl("https://testnet.zklighter.elliot.ai")).toBe("testnet");
  });

  it("returns null for an unrelated host", () => {
    expect(detectEnvironmentFromUrl("https://proxy.internal.example")).toBeNull();
  });
});

describe("deriveWebSocketUrl", () => {
  it("swaps the scheme and appends the stream path", () => {
    expect(deriveWebSocketUrl("https://proxy.example")).toBe("wss://proxy.example/stream");
    expect(deriveWebSocketUrl("http://localhost:8080/")).toBe("ws://localhost:8080/stream");
    expect(deriveWebSocketUrl("https://proxy.example/stream")).toBe("wss://proxy.example/stream");
  });
});

describe("resolveLighterNetwork", () => {
  it("binds rest, websocket and chain id together for Robinhood Chain", () => {
    const resolved = resolveLighterNetwork({ environment: "rh" });
    expect(resolved.restUrl).toBe("https://api.rh.lighter.xyz");
    expect(resolved.wsUrl).toBe("wss://api.rh.lighter.xyz/stream");
    expect(resolved.chainId).toBe(466324);
    expect(resolved.expectedL1ChainId).toBe(4663);
    expect(resolved.defaultQuoteAsset).toBe("USDG");
  });

  it("keeps mainnet on its own chain id", () => {
    const resolved = resolveLighterNetwork({ environment: "mainnet" });
    expect(resolved.chainId).toBe(304);
    expect(resolved.wsUrl).toBe("wss://mainnet.zklighter.elliot.ai/stream");
    expect(resolved.defaultQuoteAsset).toBe("USDC");
  });

  it("derives the websocket from a base url instead of falling back to the default env", () => {
    const resolved = resolveLighterNetwork({ baseUrl: "https://api.rh.lighter.xyz" });
    expect(resolved.environment).toBe("rh");
    expect(resolved.wsUrl).toBe("wss://api.rh.lighter.xyz/stream");
    expect(resolved.chainId).toBe(466324);
  });

  it("does not mistake the rh testnet host for the zklighter testnet", () => {
    const resolved = resolveLighterNetwork({ baseUrl: "https://api.rh-testnet.lighter.xyz" });
    expect(resolved.environment).toBe("rh-testnet");
    expect(resolved.wsUrl).toBe("wss://api.rh-testnet.lighter.xyz/stream");
  });

  it("defaults to testnet when nothing is configured", () => {
    const resolved = resolveLighterNetwork({});
    expect(resolved.environment).toBe("testnet");
    expect(resolved.chainId).toBe(300);
  });

  it("remaps a web app hostname onto the matching API host", () => {
    const rh = resolveLighterNetwork({ baseUrl: "https://robinhoodchain.lighter.xyz" });
    expect(rh.environment).toBe("rh");
    expect(rh.restUrl).toBe("https://api.rh.lighter.xyz");

    const main = resolveLighterNetwork({ baseUrl: "https://app.lighter.xyz/" });
    expect(main.environment).toBe("mainnet");
    expect(main.restUrl).toBe("https://mainnet.zklighter.elliot.ai");
  });

  it("refuses an unknown host without an explicit chain id", () => {
    expect(() => resolveLighterNetwork({ baseUrl: "https://proxy.internal.example" })).toThrow(
      /chain id/i
    );
  });

  it("accepts an unknown host once the chain id is supplied", () => {
    const resolved = resolveLighterNetwork({ baseUrl: "https://proxy.internal.example", chainId: 466324 });
    expect(resolved.environment).toBeNull();
    expect(resolved.wsUrl).toBe("wss://proxy.internal.example/stream");
    expect(resolved.chainId).toBe(466324);
    expect(resolved.expectedL1ChainId).toBeNull();
  });

  it("keeps the environment chain id when the venue is reached through a proxy", () => {
    const resolved = resolveLighterNetwork({ environment: "rh", baseUrl: "https://proxy.internal.example" });
    expect(resolved.restUrl).toBe("https://proxy.internal.example");
    expect(resolved.wsUrl).toBe("wss://proxy.internal.example/stream");
    expect(resolved.chainId).toBe(466324);
  });

  it("lets an explicit websocket url win", () => {
    const resolved = resolveLighterNetwork({ environment: "rh", wsUrl: "wss://custom.example/stream" });
    expect(resolved.wsUrl).toBe("wss://custom.example/stream");
    expect(resolved.restUrl).toBe("https://api.rh.lighter.xyz");
  });

  it("lets an explicit chain id override the table", () => {
    const resolved = resolveLighterNetwork({ environment: "rh", chainId: 999 });
    expect(resolved.chainId).toBe(999);
  });
});
