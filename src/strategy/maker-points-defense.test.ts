import { describe, expect, it } from "vitest";
import {
  ACCOUNT_DATA_STALE_THRESHOLD_MS,
  DATA_STALE_THRESHOLD_MS,
  REST_ERROR_DEFENSE_THRESHOLD,
  defenseReasonsFor,
  describeDefenseReasons,
  evaluateDefense,
  type DefenseInputs,
} from "./maker-points-defense";

const NOW = 1_700_000_000_000;

function inputs(overrides: Partial<DefenseInputs> = {}): DefenseInputs {
  return {
    now: NOW,
    lastDepthTime: NOW,
    lastAccountTime: NOW,
    lastBinanceDepthTime: NOW,
    binanceHealth: { healthy: true },
    accountHealth: { ok: true },
    hasAccountSnapshot: true,
    accountProbeFailures: 0,
    accountProbeInFlight: false,
    restUnhealthy: false,
    restConsecutiveErrors: 0,
    restLastError: null,
    marginMode: "isolated",
    enforceIsolatedMargin: true,
    ...overrides,
  };
}

describe("evaluateDefense", () => {
  it("stays out of defense when every feed is fresh", () => {
    expect(evaluateDefense(inputs()).shouldDefend).toBe(false);
  });

  it("treats a feed that has never reported as fresh, not stale", () => {
    // Startup: age 0 must not be read as "infinitely old".
    const verdict = evaluateDefense(
      inputs({ lastDepthTime: 0, lastAccountTime: 0, lastBinanceDepthTime: 0 })
    );
    expect(verdict.shouldDefend).toBe(false);
    expect(verdict.reasons.depthAge).toBe(0);
  });

  it("defends on a stale venue depth feed", () => {
    const verdict = evaluateDefense(
      inputs({ lastDepthTime: NOW - DATA_STALE_THRESHOLD_MS - 1 })
    );
    expect(verdict.shouldDefend).toBe(true);
    expect(verdict.reasons.depthStale).toBe(true);
  });

  it("does not defend exactly at the staleness threshold", () => {
    expect(evaluateDefense(inputs({ lastDepthTime: NOW - DATA_STALE_THRESHOLD_MS })).shouldDefend).toBe(
      false
    );
  });

  it("defends on a stale Binance depth feed or an unhealthy book", () => {
    expect(
      evaluateDefense(inputs({ lastBinanceDepthTime: NOW - DATA_STALE_THRESHOLD_MS - 1 })).shouldDefend
    ).toBe(true);
    expect(
      evaluateDefense(inputs({ binanceHealth: { healthy: false, reason: "gap" } })).shouldDefend
    ).toBe(true);
  });

  it("probes but does not defend when the account feed first goes quiet", () => {
    const verdict = evaluateDefense(
      inputs({ lastAccountTime: NOW - ACCOUNT_DATA_STALE_THRESHOLD_MS - 1 })
    );
    expect(verdict.needsAccountProbe).toBe(true);
    expect(verdict.shouldDefend).toBe(false);
  });

  it("holds off while the account REST probe is still in flight", () => {
    const verdict = evaluateDefense(
      inputs({
        lastAccountTime: NOW - ACCOUNT_DATA_STALE_THRESHOLD_MS - 1,
        accountProbeFailures: 2,
        accountProbeInFlight: true,
      })
    );
    expect(verdict.shouldDefend).toBe(false);
  });

  it("defends once the account REST probe has failed", () => {
    const verdict = evaluateDefense(
      inputs({
        lastAccountTime: NOW - ACCOUNT_DATA_STALE_THRESHOLD_MS - 1,
        accountProbeFailures: 1,
        accountProbeInFlight: false,
      })
    );
    expect(verdict.shouldDefend).toBe(true);
    expect(verdict.reasons.accountStale).toBe(true);
  });

  it("defends on an invalid account snapshot and carries its issues", () => {
    const verdict = evaluateDefense(
      inputs({ accountHealth: { ok: false, issues: ["missing position"] } })
    );
    expect(verdict.shouldDefend).toBe(true);
    expect(verdict.reasons.accountIssues).toEqual(["missing position"]);
  });

  it("ignores account validity before any snapshot has arrived", () => {
    const verdict = evaluateDefense(
      inputs({ hasAccountSnapshot: false, accountHealth: { ok: false, issues: ["x"] } })
    );
    expect(verdict.shouldDefend).toBe(false);
  });

  it("defends only after REST failures reach the threshold", () => {
    const below = evaluateDefense(
      inputs({ restUnhealthy: true, restConsecutiveErrors: REST_ERROR_DEFENSE_THRESHOLD - 1 })
    );
    expect(below.shouldDefend).toBe(false);

    const at = evaluateDefense(
      inputs({ restUnhealthy: true, restConsecutiveErrors: REST_ERROR_DEFENSE_THRESHOLD })
    );
    expect(at.shouldDefend).toBe(true);
    expect(at.reasons.restUnhealthy).toBe(true);
  });

  it("defends on a non-isolated margin mode only where it is enforced", () => {
    expect(evaluateDefense(inputs({ marginMode: "cross" })).shouldDefend).toBe(true);
    expect(
      evaluateDefense(inputs({ marginMode: "cross", enforceIsolatedMargin: false })).shouldDefend
    ).toBe(false);
  });

  it("does not defend on an unknown margin mode", () => {
    expect(evaluateDefense(inputs({ marginMode: null })).shouldDefend).toBe(false);
  });
});

describe("describeDefenseReasons", () => {
  it("names every active cause", () => {
    const summary = describeDefenseReasons(
      defenseReasonsFor({
        depthStale: true,
        depthAge: 7_000,
        restUnhealthy: true,
        restConsecutiveErrors: 4,
      })
    );
    expect(summary).toContain("StandX深度(7s)");
    expect(summary).toContain("StandX REST错误(4次)");
  });

  it("falls back to unknown when nothing is flagged", () => {
    expect(describeDefenseReasons(defenseReasonsFor({}))).toBe("unknown");
  });

  it("omits the Binance book reason when there is none", () => {
    const summary = describeDefenseReasons(
      defenseReasonsFor({ binanceUnhealthy: true, binanceHealthReason: null })
    );
    expect(summary).toBe("unknown");
  });
});
