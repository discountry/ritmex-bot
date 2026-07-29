/**
 * Defense-mode decision logic for the Maker Points engine.
 *
 * Pure by design (mirrors maker-points-logic.ts / grid-logic.ts): it reads a
 * snapshot of feed ages and health flags and returns a verdict. Acting on the
 * verdict — cancelling orders, starting REST polling — stays in the engine,
 * so the rule that decides "is our market data trustworthy" can be tested
 * without a live adapter.
 */
import { t } from "../i18n";

/** A feed older than this is considered stale. */
export const DATA_STALE_THRESHOLD_MS = 5_000;
/**
 * Account pushes can legitimately be sparse, so age alone does not trigger
 * defense — it only triggers a REST probe. Defense follows a failed probe.
 */
export const ACCOUNT_DATA_STALE_THRESHOLD_MS = 20_000;
/** Consecutive REST failures before the venue is treated as down. */
export const REST_ERROR_DEFENSE_THRESHOLD = 3;

export interface DefenseInputs {
  now: number;
  /** Epoch ms of the last venue depth update; 0 when none has arrived yet. */
  lastDepthTime: number;
  /** Epoch ms of the last venue account update; 0 when none has arrived yet. */
  lastAccountTime: number;
  /** Epoch ms of the last Binance depth update; 0 when none has arrived yet. */
  lastBinanceDepthTime: number;
  binanceHealth: { healthy: boolean; reason?: string | null };
  /** Result of validating the current account snapshot for the traded symbol. */
  accountHealth: { ok: boolean; issues?: string[] };
  hasAccountSnapshot: boolean;
  /** Consecutive failures of the REST fallback that refreshes a stale account. */
  accountProbeFailures: number;
  accountProbeInFlight: boolean;
  restUnhealthy: boolean;
  restConsecutiveErrors: number;
  restLastError: string | null;
  /** Current margin mode as the venue reports it, or null when unknown. */
  marginMode: string | null;
  /** Margin mode is only enforced on StandX. */
  enforceIsolatedMargin: boolean;
}

/**
 * Why defense mode was entered; carried into the log line and the notification.
 * A type alias rather than an interface so it satisfies the notification
 * payload's index signature without a cast.
 */
export type DefenseReasons = {
  depthStale: boolean;
  binanceStale: boolean;
  binanceUnhealthy: boolean;
  binanceHealthReason: string | null;
  accountStale: boolean;
  accountInvalid: boolean;
  restUnhealthy: boolean;
  restConsecutiveErrors: number;
  restLastError: string | null;
  marginModeNotIsolated: boolean;
  marginMode: string | null;
  depthAge: number;
  binanceAge: number;
  accountAge: number;
  accountIssues: string[];
};

export interface DefenseVerdict {
  shouldDefend: boolean;
  /** The account feed is old enough that the engine should refresh it over REST. */
  needsAccountProbe: boolean;
  reasons: DefenseReasons;
}

/** Age of a feed that has produced at least one update; 0 for one that has not. */
function feedAge(now: number, lastUpdate: number): number {
  return lastUpdate > 0 ? now - lastUpdate : 0;
}

function isStale(now: number, lastUpdate: number, threshold: number): boolean {
  return lastUpdate > 0 && now - lastUpdate > threshold;
}

export function evaluateDefense(inputs: DefenseInputs): DefenseVerdict {
  const { now } = inputs;

  const depthStale = isStale(now, inputs.lastDepthTime, DATA_STALE_THRESHOLD_MS);
  const binanceStale = isStale(now, inputs.lastBinanceDepthTime, DATA_STALE_THRESHOLD_MS);
  const binanceUnhealthy = !inputs.binanceHealth.healthy;

  const accountAge = feedAge(now, inputs.lastAccountTime);
  const accountStaleByAge = isStale(now, inputs.lastAccountTime, ACCOUNT_DATA_STALE_THRESHOLD_MS);
  // Defense waits for the REST fallback to have been tried and failed.
  const accountStale =
    accountStaleByAge && inputs.accountProbeFailures > 0 && !inputs.accountProbeInFlight;

  const accountInvalid = inputs.hasAccountSnapshot && !inputs.accountHealth.ok;
  const restUnhealthy =
    inputs.restUnhealthy && inputs.restConsecutiveErrors >= REST_ERROR_DEFENSE_THRESHOLD;
  const marginModeNotIsolated =
    inputs.enforceIsolatedMargin && inputs.marginMode != null && inputs.marginMode !== "isolated";

  const shouldDefend =
    depthStale ||
    binanceStale ||
    binanceUnhealthy ||
    accountStale ||
    accountInvalid ||
    restUnhealthy ||
    marginModeNotIsolated;

  return {
    shouldDefend,
    needsAccountProbe: accountStaleByAge,
    reasons: {
      depthStale,
      binanceStale,
      binanceUnhealthy,
      binanceHealthReason: inputs.binanceHealth.reason ?? null,
      accountStale,
      accountInvalid,
      restUnhealthy,
      restConsecutiveErrors: inputs.restConsecutiveErrors,
      restLastError: inputs.restLastError,
      marginModeNotIsolated,
      marginMode: inputs.marginMode,
      depthAge: feedAge(now, inputs.lastDepthTime),
      binanceAge: feedAge(now, inputs.lastBinanceDepthTime),
      accountAge,
      accountIssues: accountInvalid ? inputs.accountHealth.issues ?? [] : [],
    },
  };
}

/** Nothing wrong; the baseline every single-cause reason set starts from. */
const NO_REASONS: DefenseReasons = {
  depthStale: false,
  binanceStale: false,
  binanceUnhealthy: false,
  binanceHealthReason: null,
  accountStale: false,
  accountInvalid: false,
  restUnhealthy: false,
  restConsecutiveErrors: 0,
  restLastError: null,
  marginModeNotIsolated: false,
  marginMode: null,
  depthAge: 0,
  binanceAge: 0,
  accountAge: 0,
  accountIssues: [],
};

/**
 * Reason set for a defense trigger that fires outside the periodic check — a REST
 * health event, a rejected margin mode — where only one or two causes are known.
 */
export function defenseReasonsFor(known: Partial<DefenseReasons>): DefenseReasons {
  return { ...NO_REASONS, ...known };
}

/** Human-readable summary of what went stale, for the log and the alert. */
export function describeDefenseReasons(reasons: DefenseReasons): string {
  const items: string[] = [];
  const seconds = (ms: number) => Math.round(ms / 1000);

  if (reasons.depthStale) items.push(t("defense.reason.depth", { seconds: seconds(reasons.depthAge) }));
  if (reasons.accountStale) {
    items.push(t("defense.reason.account", { seconds: seconds(reasons.accountAge) }));
  }
  if (reasons.accountInvalid) {
    items.push(
      t("defense.reason.accountInvalid", {
        issues: reasons.accountIssues.join(",") || t("defense.reason.unknown"),
      })
    );
  }
  if (reasons.restUnhealthy) {
    items.push(t("defense.reason.rest", { count: reasons.restConsecutiveErrors }));
  }
  if (reasons.marginModeNotIsolated) {
    items.push(
      t("defense.reason.marginMode", { mode: reasons.marginMode ?? t("defense.reason.unknown") })
    );
  }
  if (reasons.binanceStale) {
    items.push(t("defense.reason.binanceDepth", { seconds: seconds(reasons.binanceAge) }));
  }
  if (reasons.binanceUnhealthy && reasons.binanceHealthReason) {
    items.push(t("defense.reason.binanceBook", { reason: reasons.binanceHealthReason }));
  }

  return items.length > 0 ? items.join(", ") : t("defense.reason.unknown");
}
