/**
 * The canonical list of strategies. Dependency-free on purpose: CLI argument
 * parsing imports this without dragging in every engine and its config.
 *
 * Adding a strategy starts here; `strategy/registry.ts` then fails to compile
 * until the new id has a definition.
 */
/** Order is the interactive menu's order. */
export const STRATEGY_IDS = [
  "trend",
  "swing",
  "guardian",
  "maker",
  "maker-points",
  "grid",
  "offset-maker",
  "liquidity-maker",
  "basis",
] as const;

export type StrategyId = (typeof STRATEGY_IDS)[number];

/** Spellings accepted on the command line beyond the canonical ids. */
const STRATEGY_ALIASES: Record<string, StrategyId> = {
  offset: "offset-maker",
  offsetmaker: "offset-maker",
  makerpoints: "maker-points",
  maker_points: "maker-points",
  liquidity: "liquidity-maker",
  liquiditymaker: "liquidity-maker",
  liquidity_maker: "liquidity-maker",
};

export function isStrategyId(value: string): value is StrategyId {
  return (STRATEGY_IDS as readonly string[]).includes(value);
}

/** @returns the strategy the input names, or null when it names none. */
export function parseStrategyId(raw: string): StrategyId | null {
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return null;
  if (isStrategyId(normalized)) return normalized;
  return STRATEGY_ALIASES[normalized] ?? null;
}
