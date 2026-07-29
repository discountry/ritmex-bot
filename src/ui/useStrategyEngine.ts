import { useEffect, useMemo, useRef, useState } from "react";
import { useInput } from "ink";
import { getExchangeDisplayName, resolveExchangeId } from "../exchanges/create-adapter";
import { buildAdapterFromEnv } from "../exchanges/resolve-from-env";
import {
  getStrategyDefinition,
  strategyUnavailableReason,
  type StrategyEngine,
  type StrategySnapshot,
} from "../strategy/registry";
import type { StrategyId } from "../strategy/strategy-ids";

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export interface UseStrategyEngineOptions<TSnapshot extends StrategySnapshot> {
  /** Called when the user presses Escape, after the engine is stopped. */
  onExit: () => void;
  /**
   * Copies the mutable parts of a snapshot so React sees a new value. Defaults to
   * a shallow copy with a fresh tradeLog; screens that render other engine-owned
   * arrays must copy those too.
   */
  cloneSnapshot?: (snapshot: TSnapshot) => TSnapshot;
}

export interface UseStrategyEngineResult<TSnapshot extends StrategySnapshot> {
  snapshot: TSnapshot | null;
  error: Error | null;
  exchangeName: string;
}

function defaultClone<TSnapshot extends StrategySnapshot>(snapshot: TSnapshot): TSnapshot {
  return { ...snapshot, tradeLog: [...snapshot.tradeLog] };
}

/**
 * Owns a strategy engine for the lifetime of a screen: builds the adapter, wires
 * the update subscription into React state, stops the engine on unmount or Escape.
 *
 * Availability is read from the registry, so a screen cannot disagree with the
 * menu or the CLI about where its strategy may run.
 */
export function useStrategyEngine<TSnapshot extends StrategySnapshot>(
  strategyId: StrategyId,
  options: UseStrategyEngineOptions<TSnapshot>
): UseStrategyEngineResult<TSnapshot> {
  const { onExit, cloneSnapshot } = options;
  const [snapshot, setSnapshot] = useState<TSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<StrategyEngine<TSnapshot> | null>(null);
  const exchangeId = useMemo(() => resolveExchangeId(), []);
  const exchangeName = useMemo(() => getExchangeDisplayName(exchangeId), [exchangeId]);

  const cloneRef = useRef(cloneSnapshot);
  cloneRef.current = cloneSnapshot;

  useInput(
    (_input, key) => {
      if (key.escape) {
        engineRef.current?.stop();
        onExit();
      }
    },
    { isActive: inputSupported }
  );

  useEffect(() => {
    const blocked = strategyUnavailableReason(strategyId, exchangeId);
    if (blocked) {
      setError(new Error(blocked));
      return;
    }
    try {
      const definition = getStrategyDefinition(strategyId);
      const adapter = buildAdapterFromEnv({ exchangeId, symbol: definition.symbol() });
      const engine = definition.createEngine(adapter) as StrategyEngine<TSnapshot>;
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());

      const handler = (next: TSnapshot) => {
        setSnapshot((cloneRef.current ?? defaultClone)(next));
      };
      engine.on("update", handler);
      engine.start();
      return () => {
        engine.off("update", handler);
        engine.stop();
        engineRef.current = null;
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return;
    }
  }, [exchangeId, strategyId]);

  return { snapshot, error, exchangeName };
}
