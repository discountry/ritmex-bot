import {
  basisConfig,
  gridConfig,
  isBasisStrategyEnabled,
  liquidityMakerConfig,
  makerConfig,
  makerPointsConfig,
  swingConfig,
  tradingConfig,
} from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import { isBasisSupportedExchangeId, type SupportedExchangeId } from "../exchanges/create-adapter";
import type { TradeLogEntry } from "../logging/trade-log";
import { BasisArbEngine } from "./basis-arb-engine";
import { GridEngine } from "./grid-engine";
import { GuardianEngine } from "./guardian-engine";
import { LiquidityMakerEngine } from "./liquidity-maker-engine";
import { MakerEngine } from "./maker-engine";
import { MakerPointsEngine } from "./maker-points-engine";
import { OffsetMakerEngine } from "./offset-maker-engine";
import { SwingEngine } from "./swing-engine";
import { TrendEngine } from "./trend-engine";
import { STRATEGY_IDS, type StrategyId } from "./strategy-ids";

/** The slice of every engine snapshot that generic consumers (CLI, UI) rely on. */
export interface StrategySnapshot {
  ready: boolean;
  tradeLog: TradeLogEntry[];
}

/**
 * What every strategy engine offers its host. Consumers depend on this instead of
 * the nine concrete classes, so neither the runner nor the UI needs a union of
 * snapshot types that grows with each new strategy.
 */
export interface StrategyEngine<TSnapshot extends StrategySnapshot = StrategySnapshot> {
  start(): void;
  stop(): void;
  getSnapshot(): TSnapshot;
  on(event: "update", handler: (snapshot: TSnapshot) => void): void;
  off(event: "update", handler: (snapshot: TSnapshot) => void): void;
}

export interface StrategyDefinition {
  id: StrategyId;
  /** Prefix for non-interactive console output; not translated. */
  consoleLabel: string;
  labelKey: string;
  descriptionKey: string;
  /** Market the adapter must be built for before the engine is constructed. */
  symbol(): string;
  createEngine(adapter: ExchangeAdapter): StrategyEngine;
  /**
   * Why this strategy cannot run in the current environment, or null when it can.
   * The menu hides strategies with a reason; the CLI reports it. One predicate
   * keeps those two surfaces from disagreeing.
   */
  unavailableReason?(exchangeId: SupportedExchangeId): string | null;
}

/**
 * Keyed by StrategyId so a new id in strategy-ids.ts is a compile error here
 * until it gets a definition.
 */
const DEFINITIONS: Record<StrategyId, StrategyDefinition> = {
  trend: {
    id: "trend",
    consoleLabel: "Trend Following",
    labelKey: "app.strategy.trend.label",
    descriptionKey: "app.strategy.trend.desc",
    symbol: () => tradingConfig.symbol,
    createEngine: (adapter) => new TrendEngine(tradingConfig, adapter),
  },
  swing: {
    id: "swing",
    consoleLabel: "Swing",
    labelKey: "app.strategy.swing.label",
    descriptionKey: "app.strategy.swing.desc",
    symbol: () => swingConfig.symbol,
    createEngine: (adapter) => new SwingEngine(swingConfig, adapter),
  },
  guardian: {
    id: "guardian",
    consoleLabel: "Guardian",
    labelKey: "app.strategy.guardian.label",
    descriptionKey: "app.strategy.guardian.desc",
    symbol: () => tradingConfig.symbol,
    createEngine: (adapter) => new GuardianEngine(tradingConfig, adapter),
  },
  maker: {
    id: "maker",
    consoleLabel: "Maker",
    labelKey: "app.strategy.maker.label",
    descriptionKey: "app.strategy.maker.desc",
    symbol: () => makerConfig.symbol,
    createEngine: (adapter) => new MakerEngine(makerConfig, adapter),
  },
  grid: {
    id: "grid",
    consoleLabel: "Grid",
    labelKey: "app.strategy.grid.label",
    descriptionKey: "app.strategy.grid.desc",
    symbol: () => gridConfig.symbol,
    createEngine: (adapter) => new GridEngine(gridConfig, adapter),
  },
  "maker-points": {
    id: "maker-points",
    consoleLabel: "Maker Points",
    labelKey: "app.strategy.makerPoints.label",
    descriptionKey: "app.strategy.makerPoints.desc",
    symbol: () => makerPointsConfig.symbol,
    createEngine: (adapter) => new MakerPointsEngine(makerPointsConfig, adapter),
    unavailableReason: (exchangeId) =>
      exchangeId === "standx" ? null : "Maker Points strategy only supports the StandX exchange.",
  },
  "offset-maker": {
    id: "offset-maker",
    consoleLabel: "Offset Maker",
    labelKey: "app.strategy.offset.label",
    descriptionKey: "app.strategy.offset.desc",
    symbol: () => makerConfig.symbol,
    createEngine: (adapter) => new OffsetMakerEngine(makerConfig, adapter),
  },
  "liquidity-maker": {
    id: "liquidity-maker",
    consoleLabel: "Liquidity Maker",
    labelKey: "app.strategy.liquidityMaker.label",
    descriptionKey: "app.strategy.liquidityMaker.desc",
    symbol: () => liquidityMakerConfig.symbol,
    createEngine: (adapter) => new LiquidityMakerEngine(liquidityMakerConfig, adapter),
  },
  basis: {
    id: "basis",
    consoleLabel: "Basis Arbitrage",
    labelKey: "app.strategy.basis.label",
    descriptionKey: "app.strategy.basis.desc",
    symbol: () => basisConfig.futuresSymbol,
    createEngine: (adapter) => new BasisArbEngine(basisConfig, adapter),
    unavailableReason: (exchangeId) => {
      if (!isBasisStrategyEnabled()) {
        return "Basis arbitrage strategy is disabled. Set ENABLE_BASIS_STRATEGY=true to enable it.";
      }
      if (!isBasisSupportedExchangeId(exchangeId)) {
        return "Basis arbitrage strategy currently only supports the Aster, Nado, StandX, and Binance exchanges";
      }
      return null;
    },
  },
};

/** Menu order. */
export const STRATEGY_DEFINITIONS: readonly StrategyDefinition[] = STRATEGY_IDS.map((id) => DEFINITIONS[id]);

export function getStrategyDefinition(id: StrategyId): StrategyDefinition {
  return DEFINITIONS[id];
}

export function strategyUnavailableReason(id: StrategyId, exchangeId: SupportedExchangeId): string | null {
  return DEFINITIONS[id].unavailableReason?.(exchangeId) ?? null;
}

/** Strategies runnable on this exchange, in menu order. */
export function availableStrategies(exchangeId: SupportedExchangeId): StrategyDefinition[] {
  return STRATEGY_DEFINITIONS.filter((definition) => definition.unavailableReason?.(exchangeId) == null);
}
