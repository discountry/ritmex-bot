import type { LogHandler } from "../order-coordinator";
import { t } from "../../i18n";

type RateLimitState = "normal" | "degraded" | "paused";

export type RateLimitDecision = "run" | "skip" | "paused";

const DEFAULT_PAUSE_MS = 30_000;
const DEFAULT_RECOVERY_MS = 60_000;

export class RateLimitController {
  private state: RateLimitState = "normal";
  private pausedUntil: number | null = null;
  private lastCycleAt = 0;
  private lastRateLimitAt = 0;
  private readonly pauseMs: number;
  private readonly recoveryMs: number;
  private entriesSuppressed = false;

  constructor(
    private readonly baseInterval: number,
    private readonly log: LogHandler,
    options?: { pauseMs?: number; recoveryMs?: number }
  ) {
    this.pauseMs = options?.pauseMs ?? DEFAULT_PAUSE_MS;
    this.recoveryMs = options?.recoveryMs ?? DEFAULT_RECOVERY_MS;
  }

  shouldBlockEntries(): boolean {
    return this.entriesSuppressed || this.state === "paused";
  }

  private suppressEntries(source?: string): void {
    if (this.entriesSuppressed) return;
    this.entriesSuppressed = true;
    this.log("info", t("rate.limit.suppress", { source: source ? `${source} ` : "" }));
  }

  private allowEntries(): void {
    if (!this.entriesSuppressed) return;
    this.entriesSuppressed = false;
    this.log("info", t("rate.limit.resumeEntries"));
  }

  beforeCycle(): RateLimitDecision {
    const now = Date.now();
    if (this.state === "paused") {
      if (this.pausedUntil != null && now >= this.pausedUntil) {
        this.state = "degraded";
        this.pausedUntil = null;
        this.log("info", t("rate.limit.pausedEnd"));
      } else {
        this.lastCycleAt = now;
        return "paused";
      }
    }

    const interval = this.currentInterval();
    if (now - this.lastCycleAt < interval) {
      return "skip";
    }
    this.lastCycleAt = now;
    return "run";
  }

  registerRateLimit(source?: string): void {
    const now = Date.now();
    this.lastRateLimitAt = now;
    if (this.state === "normal") {
      this.state = "degraded";
      this.log(
        "warn",
        t("rate.limit.hit", { source: source ? `${source} ` : "", interval: (this.currentInterval() / 1000).toFixed(2) })
      );
      this.lastCycleAt = now;
      this.suppressEntries(source);
      return;
    }
    if (this.state === "degraded") {
      this.state = "paused";
      this.pausedUntil = now + this.pauseMs;
      this.log(
        "warn",
        t("rate.limit.consecutive", { source: source ? `${source} ` : "", seconds: (this.pauseMs / 1000).toFixed(0) })
      );
      this.suppressEntries(source);
      return;
    }
    this.pausedUntil = now + this.pauseMs;
    this.log(
      "warn",
      t("rate.limit.still", { source: source ? `${source} ` : "", seconds: (this.pauseMs / 1000).toFixed(0) })
    );
    this.suppressEntries(source);
  }

  onCycleComplete(hadRateLimit: boolean): void {
    if (hadRateLimit) return;
    if (this.state === "degraded" && this.lastRateLimitAt > 0) {
      const now = Date.now();
      if (now - this.lastRateLimitAt >= this.recoveryMs) {
        this.state = "normal";
        this.log("info", t("rate.limit.reset"));
        this.allowEntries();
        this.lastRateLimitAt = 0;
      }
    }
    if (this.state === "normal" && this.entriesSuppressed && this.lastRateLimitAt === 0) {
      this.allowEntries();
    }
  }

  private currentInterval(): number {
    if (this.state === "degraded") {
      return this.baseInterval * 2;
    }
    if (this.state === "paused") {
      return this.baseInterval * 2;
    }
    return this.baseInterval;
  }
}
