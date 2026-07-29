import { extractMessage, isUnknownOrderError } from "../../utils/errors";
import {
  checkStandxTokenExpiry,
  formatTokenExpiryMessage,
  isTokenExpiryConfigured,
  type TokenExpiryState,
  type TokenExpiryStatus,
} from "../../utils/standx-token-expiry";
import { t } from "../../i18n";
import type { LogHandler } from "./subscriptions";

/** What the engine should do for the rest of this tick. */
export type TokenExpiryDecision =
  /** Token is live, or expired but a position still needs managing — keep ticking. */
  | { halt: false; closeOnly: boolean }
  /** Expired with nothing left to manage — skip the rest of the tick. */
  | { halt: true; closeOnly: boolean };

export interface TokenExpiryGuardDeps {
  log: LogHandler;
  notify: (notification: {
    hasPosition: boolean;
    hasOpenOrders: boolean;
    state: TokenExpiryState;
  }) => void;
  /** Cancels every resting order; resolves once the venue has accepted. */
  cancelAllOrders: () => Promise<void>;
  /** Called after a successful cancel so the engine can drop its local copy. */
  onOrdersCancelled: () => void;
}

/**
 * Drives the StandX token-expiry episode.
 *
 * The venue's token expires on a wall clock, and each consequence — the warning
 * log, the alert, the cancel-everything sweep — must happen exactly once per
 * episode and reset when a fresh token arrives. That is five latches whose only
 * correctness property is that they move together, so they live in one class
 * rather than loose beside forty other engine fields.
 */
export class TokenExpiryGuard {
  private state: TokenExpiryState = "active";
  private logged = false;
  private notified = false;
  private cancelDone = false;
  private closeOnly = false;

  constructor(private readonly deps: TokenExpiryGuardDeps) {}

  /** True once expiry has forced the engine into reduce-only quoting. */
  get closeOnlyMode(): boolean {
    return this.closeOnly;
  }

  get currentState(): TokenExpiryState {
    return this.state;
  }

  async evaluate(params: { positionAmt: number; openOrderCount: number }): Promise<TokenExpiryDecision> {
    if (!isTokenExpiryConfigured()) {
      return { halt: false, closeOnly: false };
    }

    const status = checkStandxTokenExpiry(params);
    if (!status.expired) {
      this.reset();
      return { halt: false, closeOnly: false };
    }

    const previousState = this.state;
    this.state = status.state;

    this.logOnce(status);
    this.notifyOnce(status);
    await this.cancelOnce(params.openOrderCount);

    if (status.state === "expired_with_position") {
      if (!this.closeOnly) {
        this.closeOnly = true;
        this.deps.log("info", t("log.token.closeOnlyForced"));
      }
      return { halt: false, closeOnly: true };
    }

    if (status.state === "silent" && previousState !== "silent") {
      this.deps.log("info", t("log.token.silentEntered"));
    }
    return { halt: true, closeOnly: this.closeOnly };
  }

  /** A fresh token clears every latch so the next episode reports itself again. */
  private reset(): void {
    if (this.state === "active") return;
    this.state = "active";
    this.logged = false;
    this.notified = false;
    this.cancelDone = false;
    this.closeOnly = false;
  }

  private logOnce(status: TokenExpiryStatus): void {
    if (this.logged) return;
    const message = formatTokenExpiryMessage(status);
    if (message) {
      this.deps.log("warn", message);
    }
    this.logged = true;
  }

  private notifyOnce(status: TokenExpiryStatus): void {
    if (this.notified) return;
    this.deps.notify({
      hasPosition: status.hasPosition,
      hasOpenOrders: status.hasOpenOrders,
      state: status.state,
    });
    this.notified = true;
  }

  private async cancelOnce(openOrderCount: number): Promise<void> {
    if (this.cancelDone || openOrderCount === 0) return;
    try {
      await this.deps.cancelAllOrders();
      this.deps.log("order", t("log.token.ordersCancelled"));
      this.deps.onOrdersCancelled();
      this.cancelDone = true;
    } catch (error) {
      if (isUnknownOrderError(error)) {
        // Nothing left to cancel is the outcome we wanted.
        this.deps.log("order", t("log.token.cancelOrderMissing"));
        this.cancelDone = true;
        return;
      }
      // Leave cancelDone false so the next tick retries.
      this.deps.log("error", t("log.token.cancelFailed", { error: extractMessage(error) }));
    }
  }
}
