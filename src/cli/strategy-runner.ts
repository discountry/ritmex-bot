import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import type { ExchangeAdapter } from "../exchanges/adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import { DryRunExchangeAdapter } from "../exchanges/dry-run-adapter";
import {
  getStrategyDefinition,
  strategyUnavailableReason,
  STRATEGY_DEFINITIONS,
  type StrategyEngine,
  type StrategySnapshot,
} from "../strategy/registry";
import { extractMessage } from "../utils/errors";
import type { StrategyId } from "../strategy/strategy-ids";

interface RunnerOptions {
  silent?: boolean;
  dryRun?: boolean;
}

export const STRATEGY_LABELS = Object.fromEntries(
  STRATEGY_DEFINITIONS.map((definition) => [definition.id, definition.consoleLabel])
) as Record<StrategyId, string>;

export async function startStrategy(strategyId: StrategyId, options: RunnerOptions = {}): Promise<void> {
  const definition = getStrategyDefinition(strategyId);
  if (!definition) {
    throw new Error(`Unsupported strategy: ${strategyId}`);
  }
  const exchangeId = resolveExchangeId();
  const blocked = strategyUnavailableReason(strategyId, exchangeId);
  if (blocked) {
    throw new Error(blocked);
  }

  const adapter = createAdapterOrThrow(definition.symbol(), options.dryRun);
  const engine = definition.createEngine(adapter);
  await runEngine(engine, definition.consoleLabel, options);
}

/**
 * Streams an engine's trade log to the console until SIGINT/SIGTERM, then stops it.
 * Depends only on the StrategyEngine contract, so a new strategy needs no change here.
 */
async function runEngine(
  engine: StrategyEngine,
  label: string,
  options: RunnerOptions
): Promise<void> {
  const exchangeName = getExchangeDisplayName(resolveExchangeId());

  const initial = engine.getSnapshot();
  let lastLogKey = lastKeyOf(initial.tradeLog);
  let readyLogged = initial.ready === true;

  const emitter = (snapshot: StrategySnapshot) => {
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
    lastLogKey = lastKeyOf(pending) ?? lastLogKey;
  };

  engine.on("update", emitter);
  engine.start();

  const modeLabel = `${options.silent ? "silent" : "interactive"}${options.dryRun ? "+dry-run" : ""}`;
  console.info(`[${label}] Starting on ${exchangeName}. Mode: ${modeLabel}. Press Ctrl+C to exit.`);

  await new Promise<void>((resolve) => {
    const wrapper = (signal: NodeJS.Signals) => {
      try {
        console.info(`[${label}] Received ${signal}. Shutting down…`);
        engine.stop();
        engine.off("update", emitter);
      } catch (error) {
        console.error(`[${label}] Error during shutdown: ${extractMessage(error)}`);
      }
      process.off("SIGINT", wrapper);
      process.off("SIGTERM", wrapper);
      resolve();
    };

    process.on("SIGINT", wrapper);
    process.on("SIGTERM", wrapper);
  });
}

function createAdapterOrThrow(symbol: string, dryRun?: boolean): ExchangeAdapter {
  const adapter = buildAdapterFromEnv({ exchangeId: resolveExchangeId(), symbol });
  return dryRun ? new DryRunExchangeAdapter(adapter) : adapter;
}

type TradeLogEntry = { time: string; type: string; detail: string };

function diffTradeLog(tradeLog: TradeLogEntry[], lastKey: string | undefined): TradeLogEntry[] {
  if (!tradeLog.length) return [];
  if (!lastKey) return tradeLog;
  const lastIndex = tradeLog.findIndex((entry) => createLogKey(entry) === lastKey);
  if (lastIndex === -1) return tradeLog;
  if (lastIndex === tradeLog.length - 1) return [];
  return tradeLog.slice(lastIndex + 1);
}

function lastKeyOf(entries: TradeLogEntry[] | undefined): string | undefined {
  if (!Array.isArray(entries) || entries.length === 0) return undefined;
  const last = entries[entries.length - 1];
  return last ? createLogKey(last) : undefined;
}

function createLogKey(entry: TradeLogEntry): string {
  return `${entry.time}|${entry.type}|${entry.detail}`;
}
