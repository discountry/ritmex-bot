import { describe, expect, it } from "vitest";
import { CommandParseError, parseCommandArgv } from "../src/cli/command-parser";

describe("command parser", () => {
  it("returns null for legacy flag-only argv", () => {
    expect(parseCommandArgv(["--strategy", "trend"])).toBeNull();
  });

  it("parses doctor command with global options", () => {
    const command = parseCommandArgv(["doctor", "--json", "--dry-run", "--timeout", "1000"]);
    expect(command).toMatchObject({
      kind: "doctor",
      json: true,
      dryRun: true,
      timeoutMs: 1000,
    });
  });

  it("parses market kline command", () => {
    const command = parseCommandArgv([
      "market",
      "kline",
      "--exchange",
      "binance",
      "--symbol",
      "BTCUSDT_PERP",
      "--interval",
      "1m",
      "--limit",
      "10",
    ]);
    expect(command).toMatchObject({
      kind: "market-kline",
      exchange: "binance",
      symbol: "BTCUSDT_PERP",
      interval: "1m",
      limit: 10,
    });
  });

  it("parses order create trailing-stop command", () => {
    const command = parseCommandArgv([
      "order",
      "create",
      "--exchange",
      "grv",
      "--symbol",
      "BTCUSDT",
      "--side",
      "sell",
      "--type",
      "trailing-stop",
      "--qty",
      "0.01",
      "--activation-price",
      "101000",
      "--callback-rate",
      "0.2",
      "--dry-run",
    ]);
    expect(command).toMatchObject({
      kind: "order-create",
      exchange: "grvt",
      symbol: "BTCUSDT",
      dryRun: true,
      payload: {
        side: "SELL",
        type: "trailing-stop",
        quantity: 0.01,
        activationPrice: 101000,
        callbackRate: 0.2,
      },
    });
  });

  it("parses strategy run command with alias strategy", () => {
    const command = parseCommandArgv(["strategy", "run", "--strategy", "offset"]);
    expect(command).toMatchObject({
      kind: "strategy-run",
      strategy: "offset-maker",
    });
  });

  it("throws for unsupported option", () => {
    expect(() => parseCommandArgv(["doctor", "--unknown"])).toThrow(CommandParseError);
  });
});
