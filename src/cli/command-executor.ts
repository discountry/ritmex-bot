import { resolveSymbolFromEnv } from "../config";
import { type ExchangeAdapter } from "../exchanges/adapter";
import { DryRunExchangeAdapter } from "../exchanges/dry-run-adapter";
import {
  SUPPORTED_EXCHANGE_IDS,
  getExchangeDisplayName,
  resolveExchangeId,
  type SupportedExchangeId,
} from "../exchanges/create-adapter";
import {
  routeCloseOrder,
  routeLimitOrder,
  routeMarketOrder,
  routeStopOrder,
  routeTrailingStopOrder,
} from "../exchanges/order-router";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import type { AsterDepth, AsterKline, AsterOrder, AsterTicker } from "../exchanges/types";
import { startStrategy } from "./strategy-runner";
import type {
  CommandErrorPayload,
  CommandExecutionResult,
  CommandFailurePayload,
  CommandPayload,
  CommandSuccessPayload,
  ParsedCliCommand,
} from "./command-types";

const EXIT_CODE_SUCCESS = 0;
const EXIT_CODE_INVALID_ARGS = 2;
const EXIT_CODE_MISSING_ENV = 3;
const EXIT_CODE_UNSUPPORTED = 5;
const EXIT_CODE_EXCHANGE_ERROR = 6;
const EXIT_CODE_TIMEOUT = 7;

const STATIC_CAPABILITIES: Record<
  SupportedExchangeId,
  {
    trailingStops: boolean | "conditional";
    fundingRate: boolean;
    precision: boolean;
    queryOpenOrders: boolean;
    queryAccountSnapshot: boolean;
    changeMarginMode: boolean;
    forceCancelAllOrders: boolean;
  }
> = {
  aster: {
    trailingStops: true,
    fundingRate: false,
    precision: true,
    queryOpenOrders: false,
    queryAccountSnapshot: false,
    changeMarginMode: false,
    forceCancelAllOrders: false,
  },
  grvt: {
    trailingStops: false,
    fundingRate: false,
    precision: false,
    queryOpenOrders: false,
    queryAccountSnapshot: false,
    changeMarginMode: false,
    forceCancelAllOrders: false,
  },
  lighter: {
    trailingStops: false,
    fundingRate: false,
    precision: true,
    queryOpenOrders: false,
    queryAccountSnapshot: false,
    changeMarginMode: false,
    forceCancelAllOrders: false,
  },
  backpack: {
    trailingStops: false,
    fundingRate: false,
    precision: false,
    queryOpenOrders: false,
    queryAccountSnapshot: false,
    changeMarginMode: false,
    forceCancelAllOrders: false,
  },
  paradex: {
    trailingStops: false,
    fundingRate: false,
    precision: false,
    queryOpenOrders: false,
    queryAccountSnapshot: false,
    changeMarginMode: false,
    forceCancelAllOrders: false,
  },
  nado: {
    trailingStops: false,
    fundingRate: true,
    precision: true,
    queryOpenOrders: false,
    queryAccountSnapshot: false,
    changeMarginMode: false,
    forceCancelAllOrders: false,
  },
  standx: {
    trailingStops: false,
    fundingRate: true,
    precision: true,
    queryOpenOrders: true,
    queryAccountSnapshot: true,
    changeMarginMode: true,
    forceCancelAllOrders: true,
  },
  binance: {
    trailingStops: "conditional",
    fundingRate: true,
    precision: true,
    queryOpenOrders: true,
    queryAccountSnapshot: true,
    changeMarginMode: true,
    forceCancelAllOrders: true,
  },
};

export interface CommandExecutorDependencies {
  buildAdapterFromEnvFn?: typeof buildAdapterFromEnv;
  startStrategyFn?: typeof startStrategy;
  now?: () => number;
}

class CommandExecutionError extends Error {
  constructor(
    readonly code: CommandErrorPayload["code"],
    readonly exitCode: number,
    message: string,
    readonly retryable: boolean = false,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "CommandExecutionError";
  }
}

export async function executeCliCommand(
  command: ParsedCliCommand,
  deps: CommandExecutorDependencies = {}
): Promise<CommandExecutionResult> {
  const buildAdapterFromEnvFn = deps.buildAdapterFromEnvFn ?? buildAdapterFromEnv;
  const startStrategyFn = deps.startStrategyFn ?? startStrategy;
  const now = deps.now ?? (() => Date.now());

  try {
    const data = await withExchangeOverride(command.exchange, async () => {
      switch (command.kind) {
        case "help":
          return { topic: command.topic ?? null };
        case "doctor":
          return handleDoctor(command, buildAdapterFromEnvFn);
        case "exchange-list":
          return {
            exchanges: SUPPORTED_EXCHANGE_IDS.map((id) => ({
              id,
              name: getExchangeDisplayName(id),
            })),
          };
        case "exchange-capabilities":
          return handleExchangeCapabilities(command, buildAdapterFromEnvFn);
        case "market-ticker":
          return handleMarketTicker(command, buildAdapterFromEnvFn);
        case "market-depth":
          return handleMarketDepth(command, buildAdapterFromEnvFn);
        case "market-kline":
          return handleMarketKline(command, buildAdapterFromEnvFn);
        case "account-snapshot":
          return handleAccountSnapshot(command, buildAdapterFromEnvFn);
        case "position-list":
          return handlePositionList(command, buildAdapterFromEnvFn);
        case "order-open":
          return handleOrderOpen(command, buildAdapterFromEnvFn);
        case "order-create":
          return handleOrderCreate(command, buildAdapterFromEnvFn);
        case "order-cancel":
          return handleOrderCancel(command, buildAdapterFromEnvFn);
        case "order-cancel-all":
          return handleOrderCancelAll(command, buildAdapterFromEnvFn);
        case "strategy-run":
          await startStrategyFn(command.strategy, { silent: command.silent, dryRun: command.dryRun });
          return {
            strategy: command.strategy,
            status: "stopped",
          };
      }
    });

    const payload = successPayload(command, now(), data);
    return {
      exitCode: EXIT_CODE_SUCCESS,
      payload,
      forceExit: command.kind !== "strategy-run",
    };
  } catch (error) {
    const mapped = mapToCommandExecutionError(error);
    const payload = failurePayload(command, now(), mapped);
    return {
      exitCode: mapped.exitCode,
      payload,
      forceExit: true,
    };
  }
}

export function renderCommandPayload(payload: CommandPayload, json: boolean): string {
  if (json) {
    return JSON.stringify(payload, null, 2);
  }
  if (payload.success) {
    return formatHumanSuccess(payload);
  }
  return formatHumanError(payload);
}

async function handleDoctor(
  command: Extract<ParsedCliCommand, { kind: "doctor" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const exchange = resolveEffectiveExchange(command.exchange);
  const symbol = resolveEffectiveSymbol(command.symbol, exchange);
  const adapter = createAdapter(buildAdapterFromEnvFn, exchange, symbol);
  return {
    exchange,
    exchangeName: getExchangeDisplayName(exchange),
    symbol,
    adapterId: adapter.id,
    capabilities: runtimeCapabilities(adapter),
  };
}

async function handleExchangeCapabilities(
  command: Extract<ParsedCliCommand, { kind: "exchange-capabilities" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const exchange = resolveEffectiveExchange(command.exchange);
  const symbol = resolveEffectiveSymbol(command.symbol, exchange);
  const staticCapabilities = STATIC_CAPABILITIES[exchange];

  try {
    const adapter = createAdapter(buildAdapterFromEnvFn, exchange, symbol);
    return {
      exchange,
      exchangeName: getExchangeDisplayName(exchange),
      symbol,
      capabilities: runtimeCapabilities(adapter),
      source: "runtime",
    };
  } catch (error) {
    return {
      exchange,
      exchangeName: getExchangeDisplayName(exchange),
      symbol,
      capabilities: staticCapabilities,
      source: "static",
      warning: extractMessage(error),
    };
  }
}

async function handleMarketTicker(
  command: Extract<ParsedCliCommand, { kind: "market-ticker" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol } = createAdapterContext(command, buildAdapterFromEnvFn);
  const ticker = await waitForFirst<AsterTicker>(
    (cb) => adapter.watchTicker(symbol, cb),
    command.timeoutMs,
    "market ticker"
  );
  return { exchange, symbol, ticker };
}

async function handleMarketDepth(
  command: Extract<ParsedCliCommand, { kind: "market-depth" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol } = createAdapterContext(command, buildAdapterFromEnvFn);
  const depth = await waitForFirst<AsterDepth>(
    (cb) => adapter.watchDepth(symbol, cb),
    command.timeoutMs,
    "market depth"
  );
  const levels = command.levels && command.levels > 0 ? Math.floor(command.levels) : undefined;
  const boundedDepth = levels
    ? {
        ...depth,
        bids: depth.bids.slice(0, levels),
        asks: depth.asks.slice(0, levels),
      }
    : depth;
  return { exchange, symbol, levels: levels ?? null, depth: boundedDepth };
}

async function handleMarketKline(
  command: Extract<ParsedCliCommand, { kind: "market-kline" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol } = createAdapterContext(command, buildAdapterFromEnvFn);
  const klines = await waitForFirst<AsterKline[]>(
    (cb) => adapter.watchKlines(symbol, command.interval, cb),
    command.timeoutMs,
    "market kline"
  );
  const limit = command.limit && command.limit > 0 ? Math.floor(command.limit) : undefined;
  const data = limit ? klines.slice(-limit) : klines;
  return { exchange, symbol, interval: command.interval, limit: limit ?? null, klines: data };
}

async function handleAccountSnapshot(
  command: Extract<ParsedCliCommand, { kind: "account-snapshot" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol } = createAdapterContext(command, buildAdapterFromEnvFn);
  if (!adapter.queryAccountSnapshot) {
    throw new CommandExecutionError(
      "UNSUPPORTED",
      EXIT_CODE_UNSUPPORTED,
      `queryAccountSnapshot is not supported on exchange '${exchange}'`
    );
  }
  const snapshot = await adapter.queryAccountSnapshot();
  return { exchange, symbol, snapshot };
}

async function handlePositionList(
  command: Extract<ParsedCliCommand, { kind: "position-list" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol } = createAdapterContext(command, buildAdapterFromEnvFn);
  if (!adapter.queryAccountSnapshot) {
    throw new CommandExecutionError(
      "UNSUPPORTED",
      EXIT_CODE_UNSUPPORTED,
      `queryAccountSnapshot is not supported on exchange '${exchange}'`
    );
  }
  const snapshot = await adapter.queryAccountSnapshot();
  const positions = snapshot?.positions ?? [];
  const filtered = symbol ? positions.filter((position) => position.symbol === symbol) : positions;
  return { exchange, symbol, positions: filtered };
}

async function handleOrderOpen(
  command: Extract<ParsedCliCommand, { kind: "order-open" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol } = createAdapterContext(command, buildAdapterFromEnvFn);
  if (!adapter.queryOpenOrders) {
    throw new CommandExecutionError(
      "UNSUPPORTED",
      EXIT_CODE_UNSUPPORTED,
      `queryOpenOrders is not supported on exchange '${exchange}'`
    );
  }
  const orders = await adapter.queryOpenOrders();
  const filtered = symbol ? orders.filter((order) => order.symbol === symbol) : orders;
  return { exchange, symbol, orders: filtered };
}

async function handleOrderCreate(
  command: Extract<ParsedCliCommand, { kind: "order-create" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol, dryRunAdapter } = createAdapterContext(command, buildAdapterFromEnvFn);
  const execAdapter = dryRunAdapter ?? adapter;
  const payload = command.payload;

  const baseIntent = {
    adapter: execAdapter,
    symbol,
    side: payload.side,
    quantity: payload.quantity,
    reduceOnly: payload.reduceOnly,
    closePosition: payload.closePosition,
    timeInForce: payload.timeInForce,
  };

  let order: AsterOrder;
  switch (payload.type) {
    case "limit":
      order = await routeLimitOrder({
        ...baseIntent,
        price: payload.price!,
        slPrice: payload.slPrice,
        tpPrice: payload.tpPrice,
      });
      break;
    case "market":
      order = await routeMarketOrder(baseIntent);
      break;
    case "stop":
      order = await routeStopOrder({
        ...baseIntent,
        stopPrice: payload.stopPrice!,
        triggerType: payload.triggerType,
      });
      break;
    case "trailing-stop":
      order = await routeTrailingStopOrder({
        ...baseIntent,
        activationPrice: payload.activationPrice!,
        callbackRate: payload.callbackRate!,
      });
      break;
    case "close":
      order = await routeCloseOrder({
        ...baseIntent,
        reduceOnly: payload.reduceOnly ?? true,
        closePosition: payload.closePosition ?? true,
      });
      break;
    default:
      throw new CommandExecutionError("INVALID_ARGS", EXIT_CODE_INVALID_ARGS, "Unsupported order type");
  }

  return {
    exchange,
    symbol,
    payload,
    order,
    dryRunActions: dryRunAdapter?.actions ?? [],
  };
}

async function handleOrderCancel(
  command: Extract<ParsedCliCommand, { kind: "order-cancel" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol, dryRunAdapter } = createAdapterContext(command, buildAdapterFromEnvFn);
  const execAdapter = dryRunAdapter ?? adapter;
  await execAdapter.cancelOrder({ symbol, orderId: command.orderId });
  return {
    exchange,
    symbol,
    orderId: command.orderId,
    dryRunActions: dryRunAdapter?.actions ?? [],
  };
}

async function handleOrderCancelAll(
  command: Extract<ParsedCliCommand, { kind: "order-cancel-all" }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): Promise<unknown> {
  const { adapter, exchange, symbol, dryRunAdapter } = createAdapterContext(command, buildAdapterFromEnvFn);
  const execAdapter = dryRunAdapter ?? adapter;
  let forced = false;
  let forceResult: boolean | null = null;

  if (execAdapter.forceCancelAllOrders) {
    forced = true;
    forceResult = await execAdapter.forceCancelAllOrders();
  } else {
    await execAdapter.cancelAllOrders({ symbol });
  }

  return {
    exchange,
    symbol,
    forced,
    forceResult,
    dryRunActions: dryRunAdapter?.actions ?? [],
  };
}

function createAdapterContext(
  command: Extract<ParsedCliCommand, { kind: Exclude<ParsedCliCommand["kind"], "help" | "exchange-list"> }>,
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv
): {
  exchange: SupportedExchangeId;
  symbol: string;
  adapter: ExchangeAdapter;
  dryRunAdapter?: DryRunExchangeAdapter;
} {
  const exchange = resolveEffectiveExchange(command.exchange);
  const symbol = resolveEffectiveSymbol(command.symbol, exchange);
  const adapter = createAdapter(buildAdapterFromEnvFn, exchange, symbol);
  if (!command.dryRun) {
    return { exchange, symbol, adapter };
  }
  const dryRunAdapter = new DryRunExchangeAdapter(adapter);
  return { exchange, symbol, adapter, dryRunAdapter };
}

function createAdapter(
  buildAdapterFromEnvFn: typeof buildAdapterFromEnv,
  exchange: SupportedExchangeId,
  symbol: string
): ExchangeAdapter {
  return buildAdapterFromEnvFn({
    exchangeId: exchange,
    symbol,
  });
}

function resolveEffectiveExchange(explicit?: SupportedExchangeId): SupportedExchangeId {
  if (explicit) return explicit;
  return resolveExchangeId();
}

function resolveEffectiveSymbol(explicit: string | undefined, exchange: SupportedExchangeId): string {
  if (explicit && explicit.trim()) {
    return explicit.trim();
  }
  return resolveSymbolFromEnv(exchange);
}

function runtimeCapabilities(adapter: ExchangeAdapter): unknown {
  return {
    trailingStops: adapter.supportsTrailingStops(),
    fundingRate: typeof adapter.watchFundingRate === "function",
    precision: typeof adapter.getPrecision === "function",
    queryOpenOrders: typeof adapter.queryOpenOrders === "function",
    queryAccountSnapshot: typeof adapter.queryAccountSnapshot === "function",
    changeMarginMode: typeof adapter.changeMarginMode === "function",
    forceCancelAllOrders: typeof adapter.forceCancelAllOrders === "function",
  };
}

function successPayload(command: ParsedCliCommand, nowMs: number, data: unknown): CommandSuccessPayload {
  return {
    success: true,
    command: command.kind,
    exchange: command.exchange,
    symbol: command.symbol,
    dryRun: command.dryRun,
    ts: new Date(nowMs).toISOString(),
    data,
  };
}

function failurePayload(
  command: ParsedCliCommand,
  nowMs: number,
  error: CommandExecutionError
): CommandFailurePayload {
  return {
    success: false,
    command: command.kind,
    exchange: command.exchange,
    symbol: command.symbol,
    dryRun: command.dryRun,
    ts: new Date(nowMs).toISOString(),
    error: {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
      details: error.details,
    },
  };
}

function mapToCommandExecutionError(error: unknown): CommandExecutionError {
  if (error instanceof CommandExecutionError) {
    return error;
  }
  const message = extractMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes("timeout")) {
    return new CommandExecutionError("TIMEOUT", EXIT_CODE_TIMEOUT, message, true);
  }
  if (lower.includes("unsupported") || lower.includes("not supported")) {
    return new CommandExecutionError("UNSUPPORTED", EXIT_CODE_UNSUPPORTED, message);
  }
  if (lower.includes("missing") && lower.includes("environment")) {
    return new CommandExecutionError("MISSING_ENV", EXIT_CODE_MISSING_ENV, message);
  }
  if (lower.includes("missing ") || lower.includes("required option")) {
    return new CommandExecutionError("INVALID_ARGS", EXIT_CODE_INVALID_ARGS, message);
  }
  return new CommandExecutionError("EXCHANGE_ERROR", EXIT_CODE_EXCHANGE_ERROR, message, true);
}

function formatHumanSuccess(payload: CommandSuccessPayload): string {
  const lines = [
    `[OK] ${payload.command}`,
    `time: ${payload.ts}`,
    payload.exchange ? `exchange: ${payload.exchange}` : null,
    payload.symbol ? `symbol: ${payload.symbol}` : null,
    `dryRun: ${payload.dryRun ? "true" : "false"}`,
    "",
    safeJsonStringify(payload.data),
  ].filter(Boolean) as string[];
  return lines.join("\n");
}

function formatHumanError(payload: CommandFailurePayload): string {
  return [
    `[ERROR] ${payload.command}`,
    `time: ${payload.ts}`,
    `code: ${payload.error.code}`,
    `message: ${payload.error.message}`,
    payload.error.retryable != null ? `retryable: ${payload.error.retryable ? "true" : "false"}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function waitForFirst<T>(
  subscribe: (cb: (value: T) => void) => void,
  timeoutMs: number,
  context: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new CommandExecutionError(
          "TIMEOUT",
          EXIT_CODE_TIMEOUT,
          `${context} timed out after ${timeoutMs}ms`,
          true
        )
      );
    }, timeoutMs);

    try {
      subscribe((value) => {
        clearTimeout(timeout);
        resolve(value);
      });
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

async function withExchangeOverride<T>(
  explicitExchange: SupportedExchangeId | undefined,
  task: () => Promise<T>
): Promise<T> {
  if (!explicitExchange) {
    return task();
  }
  const prevExchange = process.env.EXCHANGE;
  const prevTradeExchange = process.env.TRADE_EXCHANGE;
  process.env.EXCHANGE = explicitExchange;
  process.env.TRADE_EXCHANGE = explicitExchange;
  try {
    return await task();
  } finally {
    if (prevExchange == null) {
      delete process.env.EXCHANGE;
    } else {
      process.env.EXCHANGE = prevExchange;
    }
    if (prevTradeExchange == null) {
      delete process.env.TRADE_EXCHANGE;
    } else {
      process.env.TRADE_EXCHANGE = prevTradeExchange;
    }
  }
}

function extractMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
