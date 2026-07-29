import { describe, expect, it } from "vitest";
import {
  STRATEGY_DEFINITIONS,
  availableStrategies,
  getStrategyDefinition,
  strategyUnavailableReason,
} from "../src/strategy/registry";
import { STRATEGY_IDS, isStrategyId, parseStrategyId } from "../src/strategy/strategy-ids";

describe("strategy ids", () => {
  it("resolves canonical ids and documented aliases", () => {
    expect(parseStrategyId("trend")).toBe("trend");
    expect(parseStrategyId("  GRID  ")).toBe("grid");
    expect(parseStrategyId("offset")).toBe("offset-maker");
    expect(parseStrategyId("offsetmaker")).toBe("offset-maker");
    expect(parseStrategyId("makerpoints")).toBe("maker-points");
    expect(parseStrategyId("maker_points")).toBe("maker-points");
    expect(parseStrategyId("liquidity")).toBe("liquidity-maker");
    expect(parseStrategyId("liquidity_maker")).toBe("liquidity-maker");
  });

  it("rejects unknown names", () => {
    expect(parseStrategyId("nope")).toBeNull();
    expect(parseStrategyId("")).toBeNull();
    expect(isStrategyId("nope")).toBe(false);
  });
});

describe("strategy registry", () => {
  it("defines every id exactly once, in menu order", () => {
    expect(STRATEGY_DEFINITIONS.map((d) => d.id)).toEqual([...STRATEGY_IDS]);
    expect(new Set(STRATEGY_DEFINITIONS.map((d) => d.id)).size).toBe(STRATEGY_IDS.length);
  });

  it("gives every strategy a console label and i18n keys", () => {
    for (const definition of STRATEGY_DEFINITIONS) {
      expect(definition.consoleLabel).toBeTruthy();
      expect(definition.labelKey).toMatch(/^app\.strategy\./);
      expect(definition.descriptionKey).toMatch(/^app\.strategy\./);
      expect(typeof definition.symbol()).toBe("string");
    }
  });

  it("gates maker-points to StandX", () => {
    expect(strategyUnavailableReason("maker-points", "standx")).toBeNull();
    expect(strategyUnavailableReason("maker-points", "aster")).toContain("StandX");
  });

  it("keeps the menu and the CLI on one availability rule", () => {
    // The menu shows exactly what startStrategy would accept — the two used to
    // disagree, so basis appeared on exchanges where the runner then threw.
    for (const exchangeId of ["aster", "standx", "backpack"] as const) {
      const shown = availableStrategies(exchangeId).map((d) => d.id);
      const runnable = STRATEGY_IDS.filter((id) => strategyUnavailableReason(id, exchangeId) == null);
      expect(shown).toEqual(runnable);
    }
  });

  it("hides strategies whose environment gate is closed", () => {
    const shown = availableStrategies("backpack").map((d) => d.id);
    expect(shown).not.toContain("maker-points");
  });

  it("exposes an engine factory per strategy", () => {
    for (const id of STRATEGY_IDS) {
      expect(typeof getStrategyDefinition(id).createEngine).toBe("function");
    }
  });
});
