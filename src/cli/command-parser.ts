import { isSupportedExchangeId, type SupportedExchangeId } from "../exchanges/create-adapter";
import type { StrategyId } from "./args";
import type { CommandCommonOptions, OrderCreatePayload, OrderCreateType, ParsedCliCommand } from "./command-types";

const DEFAULT_TIMEOUT_MS = 25_000;
const ROOT_COMMANDS = new Set([
  "help",
  "doctor",
  "exchange",
  "market",
  "account",
  "position",
  "order",
  "strategy",
]);

const GLOBAL_OPTION_NAMES = new Set([
  "exchange",
  "symbol",
  "json",
  "dry-run",
  "timeout",
  "help",
]);

const SHORT_OPTION_ALIAS: Record<string, string> = {
  d: "dry-run",
  e: "exchange",
  h: "help",
  j: "json",
  q: "silent",
  s: "strategy",
  t: "timeout",
};

const STRATEGY_VALUES = new Set<StrategyId>([
  "trend",
  "swing",
  "guardian",
  "maker",
  "maker-points",
  "offset-maker",
  "liquidity-maker",
  "basis",
  "grid",
]);

export class CommandParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandParseError";
  }
}

interface ParsedOptionBag {
  options: Record<string, string | boolean>;
  positionals: string[];
}

export function parseCommandArgv(argv: string[]): ParsedCliCommand | null {
  if (!argv.length) return null;
  const root = (argv[0] ?? "").trim().toLowerCase();
  if (!root || root.startsWith("-")) return null;
  if (!ROOT_COMMANDS.has(root)) return null;

  if (root === "help") {
    return parseHelpCommand(argv.slice(1));
  }
  if (root === "doctor") {
    const bag = parseOptionBag(argv.slice(1));
    assertAllowedOptions(bag.options, GLOBAL_OPTION_NAMES);
    const common = parseCommonOptions(bag.options);
    return { kind: "doctor", ...common };
  }

  if (argv.length < 2) {
    throw new CommandParseError(`Missing action for command '${root}'`);
  }
  const action = (argv[1] ?? "").trim().toLowerCase();
  const bag = parseOptionBag(argv.slice(2));
  const common = parseCommonOptions(bag.options);

  if (common.help) {
    return {
      kind: "help",
      topic: `${root} ${action}`.trim(),
      ...common,
    };
  }

  switch (root) {
    case "exchange":
      return parseExchangeCommand(action, bag.options, common);
    case "market":
      return parseMarketCommand(action, bag.options, common);
    case "account":
      return parseAccountCommand(action, bag.options, common);
    case "position":
      return parsePositionCommand(action, bag.options, common);
    case "order":
      return parseOrderCommand(action, bag.options, common);
    case "strategy":
      return parseStrategyCommand(action, bag, common);
    default:
      throw new CommandParseError(`Unsupported root command '${root}'`);
  }
}

export function printCommandHelp(topic?: string): void {
  if (!topic) {
    // eslint-disable-next-line no-console
    console.log([
      "ritmex-bot command mode:",
      "  ritmex-bot doctor",
      "  ritmex-bot exchange list",
      "  ritmex-bot exchange capabilities [--exchange <id>]",
      "  ritmex-bot market ticker [--exchange <id>] [--symbol <symbol>]",
      "  ritmex-bot market depth [--exchange <id>] [--symbol <symbol>] [--levels <n>]",
      "  ritmex-bot market kline --interval <interval> [--limit <n>] [--exchange <id>] [--symbol <symbol>]",
      "  ritmex-bot account snapshot [--exchange <id>]",
      "  ritmex-bot position list [--exchange <id>] [--symbol <symbol>]",
      "  ritmex-bot order open [--exchange <id>] [--symbol <symbol>]",
      "  ritmex-bot order create --side <buy|sell> --type <limit|market|stop|trailing-stop|close> --quantity <n> [options]",
      "  ritmex-bot order cancel --order-id <id> [--exchange <id>] [--symbol <symbol>]",
      "  ritmex-bot order cancel-all [--exchange <id>] [--symbol <symbol>]",
      "  ritmex-bot strategy run --strategy <id> [--exchange <id>] [--silent] [--dry-run]",
      "",
      "Global options:",
      "  --exchange, -e   Exchange id",
      "  --symbol         Trading symbol (passed through without normalization)",
      "  --json, -j       JSON output",
      "  --dry-run, -d    Simulate write operations",
      "  --timeout, -t    Timeout in milliseconds (default 25000)",
      "  --help, -h       Show command help",
      "",
      "Legacy mode remains available: bun run index.ts [--strategy ...] [--exchange ...]",
    ].join("\n"));
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`ritmex-bot help: ${topic}`);
}

function parseHelpCommand(argv: string[]): ParsedCliCommand {
  const bag = parseOptionBag(argv);
  assertAllowedOptions(bag.options, GLOBAL_OPTION_NAMES);
  const common = parseCommonOptions(bag.options);
  const topic = bag.positionals.length > 0 ? bag.positionals.join(" ") : undefined;
  return { kind: "help", topic, ...common };
}

function parseExchangeCommand(
  action: string,
  options: Record<string, string | boolean>,
  common: CommandCommonOptions & { help?: boolean }
): ParsedCliCommand {
  assertAllowedOptions(options, new Set([...GLOBAL_OPTION_NAMES]));
  if (action === "list") return { kind: "exchange-list", ...common };
  if (action === "capabilities") return { kind: "exchange-capabilities", ...common };
  throw new CommandParseError(`Unsupported exchange action '${action}'`);
}

function parseMarketCommand(
  action: string,
  options: Record<string, string | boolean>,
  common: CommandCommonOptions & { help?: boolean }
): ParsedCliCommand {
  assertAllowedOptions(options, new Set([...GLOBAL_OPTION_NAMES, "levels", "interval", "limit"]));
  if (action === "ticker") return { kind: "market-ticker", ...common };
  if (action === "depth") {
    const levels = readNumberOption(options, ["levels"]);
    return { kind: "market-depth", levels, ...common };
  }
  if (action === "kline") {
    const interval = requireStringOption(options, ["interval"], "Missing required option --interval");
    const limit = readNumberOption(options, ["limit"]);
    return { kind: "market-kline", interval, limit, ...common };
  }
  throw new CommandParseError(`Unsupported market action '${action}'`);
}

function parseAccountCommand(
  action: string,
  options: Record<string, string | boolean>,
  common: CommandCommonOptions & { help?: boolean }
): ParsedCliCommand {
  assertAllowedOptions(options, GLOBAL_OPTION_NAMES);
  if (action === "snapshot" || action === "summary") {
    return { kind: "account-snapshot", ...common };
  }
  throw new CommandParseError(`Unsupported account action '${action}'`);
}

function parsePositionCommand(
  action: string,
  options: Record<string, string | boolean>,
  common: CommandCommonOptions & { help?: boolean }
): ParsedCliCommand {
  assertAllowedOptions(options, GLOBAL_OPTION_NAMES);
  if (action === "list") {
    return { kind: "position-list", ...common };
  }
  throw new CommandParseError(`Unsupported position action '${action}'`);
}

function parseOrderCommand(
  action: string,
  options: Record<string, string | boolean>,
  common: CommandCommonOptions & { help?: boolean }
): ParsedCliCommand {
  if (action === "open") {
    assertAllowedOptions(options, GLOBAL_OPTION_NAMES);
    return { kind: "order-open", ...common };
  }
  if (action === "cancel") {
    assertAllowedOptions(options, new Set([...GLOBAL_OPTION_NAMES, "order-id"]));
    const orderId = requireStringOption(options, ["order-id"], "Missing required option --order-id");
    return { kind: "order-cancel", orderId, ...common };
  }
  if (action === "cancel-all") {
    assertAllowedOptions(options, GLOBAL_OPTION_NAMES);
    return { kind: "order-cancel-all", ...common };
  }
  if (action === "create") {
    assertAllowedOptions(
      options,
      new Set([
        ...GLOBAL_OPTION_NAMES,
        "side",
        "type",
        "quantity",
        "qty",
        "price",
        "stop-price",
        "activation-price",
        "callback-rate",
        "time-in-force",
        "reduce-only",
        "close-position",
        "trigger-type",
        "sl-price",
        "tp-price",
      ])
    );

    const payload = parseOrderCreatePayload(options);
    return { kind: "order-create", payload, ...common };
  }
  throw new CommandParseError(`Unsupported order action '${action}'`);
}

function parseStrategyCommand(
  action: string,
  bag: ParsedOptionBag,
  common: CommandCommonOptions & { help?: boolean }
): ParsedCliCommand {
  if (action !== "run") {
    throw new CommandParseError(`Unsupported strategy action '${action}'`);
  }
  assertAllowedOptions(bag.options, new Set([...GLOBAL_OPTION_NAMES, "strategy", "silent"]));
  const strategyInput = readStringOption(bag.options, ["strategy"]) ?? bag.positionals[0];
  if (!strategyInput) {
    throw new CommandParseError("Missing required option --strategy for strategy run");
  }
  const strategy = normalizeStrategy(strategyInput);
  const silent = readBooleanOption(bag.options, ["silent"], false);
  return { kind: "strategy-run", strategy, silent, ...common };
}

function parseOrderCreatePayload(options: Record<string, string | boolean>): OrderCreatePayload {
  const side = normalizeSide(requireStringOption(options, ["side"], "Missing required option --side"));
  const type = normalizeOrderType(requireStringOption(options, ["type"], "Missing required option --type"));
  const quantity = requireNumberOption(options, ["quantity", "qty"], "Missing required option --quantity/--qty");
  const payload: OrderCreatePayload = { side, type, quantity };

  if (type === "limit") {
    payload.price = requireNumberOption(options, ["price"], "Missing required option --price for limit orders");
  }
  if (type === "stop") {
    payload.stopPrice = requireNumberOption(options, ["stop-price"], "Missing required option --stop-price for stop orders");
  }
  if (type === "trailing-stop") {
    payload.activationPrice = requireNumberOption(
      options,
      ["activation-price"],
      "Missing required option --activation-price for trailing-stop orders"
    );
    payload.callbackRate = requireNumberOption(
      options,
      ["callback-rate"],
      "Missing required option --callback-rate for trailing-stop orders"
    );
  }

  payload.timeInForce = normalizeTimeInForce(readStringOption(options, ["time-in-force"]));
  payload.reduceOnly = readOptionalBooleanOption(options, ["reduce-only"]);
  payload.closePosition = readOptionalBooleanOption(options, ["close-position"]);
  payload.triggerType = normalizeTriggerType(readStringOption(options, ["trigger-type"]));
  payload.slPrice = readNumberOption(options, ["sl-price"]);
  payload.tpPrice = readNumberOption(options, ["tp-price"]);
  payload.price = payload.price ?? readNumberOption(options, ["price"]);
  payload.stopPrice = payload.stopPrice ?? readNumberOption(options, ["stop-price"]);
  payload.activationPrice = payload.activationPrice ?? readNumberOption(options, ["activation-price"]);
  payload.callbackRate = payload.callbackRate ?? readNumberOption(options, ["callback-rate"]);
  return payload;
}

function parseCommonOptions(options: Record<string, string | boolean>): CommandCommonOptions & { help?: boolean } {
  const exchangeRaw = readStringOption(options, ["exchange"]);
  const symbol = readStringOption(options, ["symbol"]);
  const json = readBooleanOption(options, ["json"], false);
  const dryRun = readBooleanOption(options, ["dry-run"], false);
  const timeoutMs = readNumberOption(options, ["timeout"]) ?? DEFAULT_TIMEOUT_MS;
  const help = readBooleanOption(options, ["help"], false);
  return {
    exchange: normalizeExchange(exchangeRaw),
    symbol: symbol?.trim() || undefined,
    json,
    dryRun,
    timeoutMs,
    help,
  };
}

function parseOptionBag(args: string[]): ParsedOptionBag {
  const options: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token) continue;
    if (token === "--") {
      positionals.push(...args.slice(i + 1));
      break;
    }
    if (token.startsWith("--")) {
      const withoutPrefix = token.slice(2);
      if (!withoutPrefix) throw new CommandParseError("Invalid option '--'");
      const eqIndex = withoutPrefix.indexOf("=");
      const rawKey = eqIndex === -1 ? withoutPrefix : withoutPrefix.slice(0, eqIndex);
      const key = rawKey.trim().toLowerCase();
      if (!key) throw new CommandParseError(`Invalid option '${token}'`);
      if (eqIndex !== -1) {
        options[key] = withoutPrefix.slice(eqIndex + 1);
        continue;
      }
      const next = args[i + 1];
      if (next && !next.startsWith("-")) {
        options[key] = next;
        i += 1;
      } else {
        options[key] = true;
      }
      continue;
    }
    if (token.startsWith("-")) {
      const short = token.slice(1);
      if (short.length !== 1) {
        throw new CommandParseError(`Unsupported short option '${token}'`);
      }
      const alias = SHORT_OPTION_ALIAS[short];
      if (!alias) {
        throw new CommandParseError(`Unsupported short option '${token}'`);
      }
      const next = args[i + 1];
      if (next && !next.startsWith("-") && expectsValue(alias)) {
        options[alias] = next;
        i += 1;
      } else {
        options[alias] = true;
      }
      continue;
    }
    positionals.push(token);
  }

  return { options, positionals };
}

function expectsValue(optionName: string): boolean {
  return optionName === "exchange" || optionName === "strategy" || optionName === "timeout";
}

function assertAllowedOptions(
  options: Record<string, string | boolean>,
  allowed: ReadonlySet<string>
): void {
  for (const key of Object.keys(options)) {
    if (!allowed.has(key)) {
      throw new CommandParseError(`Unsupported option '--${key}'`);
    }
  }
}

function readStringOption(options: Record<string, string | boolean>, names: string[]): string | undefined {
  for (const name of names) {
    const raw = options[name];
    if (raw == null) continue;
    if (typeof raw !== "string") {
      throw new CommandParseError(`Option --${name} requires a value`);
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new CommandParseError(`Option --${name} cannot be empty`);
    }
    return trimmed;
  }
  return undefined;
}

function requireStringOption(
  options: Record<string, string | boolean>,
  names: string[],
  errorMessage: string
): string {
  const value = readStringOption(options, names);
  if (!value) {
    throw new CommandParseError(errorMessage);
  }
  return value;
}

function readBooleanOption(options: Record<string, string | boolean>, names: string[], fallback: boolean): boolean {
  const value = readOptionalBooleanOption(options, names);
  return value == null ? fallback : value;
}

function readOptionalBooleanOption(options: Record<string, string | boolean>, names: string[]): boolean | undefined {
  for (const name of names) {
    const raw = options[name];
    if (raw == null) continue;
    if (raw === true) return true;
    if (typeof raw !== "string") {
      throw new CommandParseError(`Option --${name} expects a boolean value`);
    }
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return true;
    if (normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on") return true;
    if (normalized === "0" || normalized === "false" || normalized === "no" || normalized === "off") return false;
    throw new CommandParseError(`Option --${name} expects a boolean value`);
  }
  return undefined;
}

function readNumberOption(options: Record<string, string | boolean>, names: string[]): number | undefined {
  const value = readStringOption(options, names);
  if (!value) return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new CommandParseError(`Option --${names[0]} expects a numeric value`);
  }
  return number;
}

function requireNumberOption(
  options: Record<string, string | boolean>,
  names: string[],
  errorMessage: string
): number {
  const number = readNumberOption(options, names);
  if (number == null) {
    throw new CommandParseError(errorMessage);
  }
  return number;
}

function normalizeExchange(value: string | undefined): SupportedExchangeId | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "gravity" || normalized === "grav" || normalized === "grv") return "grvt";
  if (normalized === "bnb") return "binance";
  if (isSupportedExchangeId(normalized)) return normalized;
  throw new CommandParseError(`Unsupported exchange '${value}'`);
}

function normalizeStrategy(value: string): StrategyId {
  const normalized = value.trim().toLowerCase();
  if (STRATEGY_VALUES.has(normalized as StrategyId)) {
    return normalized as StrategyId;
  }
  if (normalized === "offset" || normalized === "offsetmaker" || normalized === "offset-maker") return "offset-maker";
  if (normalized === "makerpoints" || normalized === "maker_points") return "maker-points";
  if (normalized === "liquidity" || normalized === "liquiditymaker" || normalized === "liquidity_maker") {
    return "liquidity-maker";
  }
  throw new CommandParseError(`Unsupported strategy '${value}'`);
}

function normalizeSide(value: string): "BUY" | "SELL" {
  const normalized = value.trim().toUpperCase();
  if (normalized === "BUY" || normalized === "SELL") return normalized;
  throw new CommandParseError(`Unsupported side '${value}', expected BUY or SELL`);
}

function normalizeOrderType(value: string): OrderCreateType {
  const normalized = value.trim().toLowerCase();
  if (normalized === "limit" || normalized === "market" || normalized === "stop" || normalized === "close") {
    return normalized;
  }
  if (normalized === "trailing-stop" || normalized === "trailing_stop" || normalized === "trailingstop") {
    return "trailing-stop";
  }
  throw new CommandParseError(
    `Unsupported order type '${value}', expected limit|market|stop|trailing-stop|close`
  );
}

function normalizeTimeInForce(value: string | undefined): "GTC" | "IOC" | "FOK" | "GTX" | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  if (normalized === "GTC" || normalized === "IOC" || normalized === "FOK" || normalized === "GTX") {
    return normalized;
  }
  throw new CommandParseError(`Unsupported time in force '${value}'`);
}

function normalizeTriggerType(
  value: string | undefined
): "UNSPECIFIED" | "TAKE_PROFIT" | "STOP_LOSS" | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  if (normalized === "UNSPECIFIED" || normalized === "TAKE_PROFIT" || normalized === "STOP_LOSS") {
    return normalized;
  }
  throw new CommandParseError(`Unsupported trigger type '${value}'`);
}
