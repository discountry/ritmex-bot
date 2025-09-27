import { makerConfig, tradingConfig } from "../config";
import {
  createExchangeAdapter,
  getExchangeDisplayName,
  resolveExchangeId,
} from "../exchanges/create-adapter";
import type { ExchangeAdapter } from "../exchanges/adapter";
import {
  MakerEngine,
  type MakerEngineSnapshot,
} from "../strategy/maker-engine";
import { OffsetMakerEngine, type OffsetMakerEngineSnapshot } from "../strategy/offset-maker-engine";
import { TrendEngine, type TrendEngineSnapshot } from "../strategy/trend-engine";
import { extractMessage } from "../utils/errors";
import type { StrategyId } from "./args";

interface RunnerOptions {
  silent?: boolean;
}

type StrategyRunner = (options: RunnerOptions) => Promise<void>;

export const STRATEGY_LABELS: Record<StrategyId, string> = {
  trend: "Trend Following",
  maker: "Maker",
  "offset-maker": "Offset Maker",
};

export async function startStrategy(strategyId: StrategyId, options: RunnerOptions = {}): Promise<void> {
  const runner = STRATEGY_FACTORIES[strategyId];
  if (!runner) {
    throw new Error(`Unsupported strategy: ${strategyId}`);
  }
  await runner(options);
}

const STRATEGY_FACTORIES: Record<StrategyId, StrategyRunner> = {
  trend: async (opts) => {
    const config = tradingConfig;
    const adapter = createAdapterOrThrow(config.symbol);
    const engine = new TrendEngine(config, adapter);
    await runEngine({
      engine,
      strategy: "trend",
      silent: opts.silent,
      getSnapshot: () => engine.getSnapshot(),
      onUpdate: (emitter) => engine.on("update", emitter),
      offUpdate: (emitter) => engine.off("update", emitter),
    });
  },
  maker: async (opts) => {
    const config = makerConfig;
    const adapter = createAdapterOrThrow(config.symbol);
    const engine = new MakerEngine(config, adapter);
    await runEngine({
      engine,
      strategy: "maker",
      silent: opts.silent,
      getSnapshot: () => engine.getSnapshot(),
      onUpdate: (emitter) => engine.on("update", emitter),
      offUpdate: (emitter) => engine.off("update", emitter),
    });
  },
  "offset-maker": async (opts) => {
    const config = makerConfig;
    const adapter = createAdapterOrThrow(config.symbol);
    const engine = new OffsetMakerEngine(config, adapter);
    await runEngine({
      engine,
      strategy: "offset-maker",
      silent: opts.silent,
      getSnapshot: () => engine.getSnapshot(),
      onUpdate: (emitter) => engine.on("update", emitter),
      offUpdate: (emitter) => engine.off("update", emitter),
    });
  },
};

interface EngineHarness<TSnapshot> {
  engine: { start(): void; stop(): void };
  strategy: StrategyId;
  silent?: boolean;
  getSnapshot: () => TSnapshot;
  onUpdate: (handler: (snapshot: TSnapshot) => void) => void;
  offUpdate: (handler: (snapshot: TSnapshot) => void) => void;
}

async function runEngine<TSnapshot extends TrendEngineSnapshot | MakerEngineSnapshot | OffsetMakerEngineSnapshot>(
  harness: EngineHarness<TSnapshot>
): Promise<void> {
  const { engine, strategy, silent, getSnapshot, onUpdate, offUpdate } = harness;
  const exchangeId = resolveExchangeId();
  const exchangeName = getExchangeDisplayName(exchangeId);
  const label = STRATEGY_LABELS[strategy];

  const initial = getSnapshot();
  let lastLogKey: string | undefined;
  if (Array.isArray(initial.tradeLog) && initial.tradeLog.length > 0) {
    const lastEntry = initial.tradeLog[initial.tradeLog.length - 1]!;
    lastLogKey = createLogKey(lastEntry);
  }
  let readyLogged = initial.ready === true;

  const emitter = (snapshot: TSnapshot) => {
    if (!Array.isArray(snapshot.tradeLog)) return;
    if (!readyLogged && snapshot.ready) {
      readyLogged = true;
      console.info(`[${label}] Strategy ready. Listening for market data…`);
    }
    const pending = diffTradeLog(snapshot.tradeLog, lastLogKey);
    if (!pending.length) return;
    for (const entry of pending) {
      console.info(`[${label}] [${entry.time}] [${entry.type}] ${entry.detail}`);
    }
    const lastEntry = pending[pending.length - 1]!;
    if (lastEntry) {
      lastLogKey = createLogKey(lastEntry);
    }
  };

  onUpdate(emitter);
  engine.start();

  console.info(`[${label}] Starting on ${exchangeName}. Mode: ${silent ? "silent" : "interactive"}. Press Ctrl+C to exit.`);

  const shutdown = (signal: NodeJS.Signals) => {
    try {
      console.info(`[${label}] Received ${signal}. Shutting down…`);
      engine.stop();
      offUpdate(emitter);
    } catch (error) {
      console.error(`[${label}] Error during shutdown: ${extractMessage(error)}`);
    }
  };

  await new Promise<void>((resolve) => {
    const wrapper = (signal: NodeJS.Signals) => {
      shutdown(signal);
      process.off("SIGINT", wrapper);
      process.off("SIGTERM", wrapper);
      resolve();
    };

    process.on("SIGINT", wrapper);
    process.on("SIGTERM", wrapper);
  });
}

function createAdapterOrThrow(symbol: string): ExchangeAdapter {
  const exchangeId = resolveExchangeId();
  if (exchangeId === "aster") {
    const apiKey = process.env.ASTER_API_KEY;
    const apiSecret = process.env.ASTER_API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error("Missing ASTER_API_KEY or ASTER_API_SECRET environment variables");
    }
    return createExchangeAdapter({
      exchange: exchangeId,
      symbol,
      aster: { apiKey, apiSecret },
    });
  }

  return createExchangeAdapter({
    exchange: exchangeId,
    symbol,
    grvt: { symbol },
  });
}

type TradeLogEntry = { time: string; type: string; detail: string };

function diffTradeLog(tradeLog: TradeLogEntry[], lastKey: string | undefined): TradeLogEntry[] {
  if (!tradeLog.length) return [];
  if (!lastKey) return tradeLog;
  const lastIndex = tradeLog.findIndex((entry) => createLogKey(entry) === lastKey);
  if (lastIndex === -1) {
    return tradeLog;
  }
  if (lastIndex === tradeLog.length - 1) return [];
  return tradeLog.slice(lastIndex + 1);
}

function createLogKey(entry: TradeLogEntry): string {
  return `${entry.time}|${entry.type}|${entry.detail}`;
}
