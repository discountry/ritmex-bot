import type { AccountSnapshot } from "../../exchanges/types";
import { extractMessage } from "../../utils/errors";
import { t } from "../../i18n";
import type { LogHandler } from "./subscriptions";

/** Snapshot refreshes to wait through before giving up on the switch (~5s total). */
const MAX_CONFIRM_ATTEMPTS = 10;
const CONFIRM_INTERVAL_MS = 500;

export interface IsolatedMarginGuardDeps {
  symbol: string;
  /** False on venues that do not expose a per-symbol margin mode; the guard is then inert. */
  enabled: boolean;
  log: LogHandler;
  /** Latest account snapshot the engine holds. */
  currentSnapshot: () => AccountSnapshot | null;
  changeMarginMode?: (params: { symbol: string; marginMode: "isolated" | "cross" }) => Promise<void>;
  queryAccountSnapshot?: () => Promise<AccountSnapshot | null>;
  /** Feeds a freshly polled snapshot back into the engine before re-reading the mode. */
  applySnapshot: (snapshot: AccountSnapshot) => void;
  sleep?: (ms: number) => Promise<void>;
}

/**
 * Keeps the traded symbol on isolated margin.
 *
 * The switch is asynchronous at the venue: the REST call returns before the
 * account reflects it, so the guard polls until the new mode shows up. A single
 * in-flight promise makes concurrent ticks share one attempt instead of firing
 * the change repeatedly.
 */
export class IsolatedMarginGuard {
  private ensuring: Promise<boolean> | null = null;

  constructor(private readonly deps: IsolatedMarginGuardDeps) {}

  /** The venue's margin mode for this symbol, lowercased, or null when unknown. */
  currentMode(snapshot: AccountSnapshot | null = this.deps.currentSnapshot()): string | null {
    if (!this.deps.enabled) return null;
    const positions = snapshot?.positions ?? [];
    const match = positions.find((pos) => pos.symbol === this.deps.symbol);
    const raw = (match as { marginType?: unknown; margin_mode?: unknown } | undefined)?.marginType ??
      (match as { margin_mode?: unknown } | undefined)?.margin_mode;
    const mode = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    return mode ? mode : null;
  }

  /**
   * @returns true when the symbol is on isolated margin. A false result means the
   *   caller should hold off trading — either a switch is under way or it failed.
   */
  async ensureIsolated(): Promise<boolean> {
    if (!this.deps.enabled) return true;
    if (this.currentMode() === "isolated") return true;

    const { changeMarginMode, queryAccountSnapshot } = this.deps;
    if (!changeMarginMode || !queryAccountSnapshot) return false;
    // Another tick is already switching; do not stack a second request.
    if (this.ensuring) return false;

    this.ensuring = this.performSwitch(changeMarginMode, queryAccountSnapshot);
    return await this.ensuring;
  }

  private async performSwitch(
    changeMarginMode: NonNullable<IsolatedMarginGuardDeps["changeMarginMode"]>,
    queryAccountSnapshot: NonNullable<IsolatedMarginGuardDeps["queryAccountSnapshot"]>
  ): Promise<boolean> {
    const sleep = this.deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
    try {
      await changeMarginMode({ symbol: this.deps.symbol, marginMode: "isolated" });
      for (let attempt = 0; attempt < MAX_CONFIRM_ATTEMPTS; attempt += 1) {
        const next = await queryAccountSnapshot();
        if (next) {
          this.deps.applySnapshot(next);
        }
        if (this.currentMode() === "isolated") {
          this.deps.log("info", t("log.margin.switched"));
          return true;
        }
        await sleep(CONFIRM_INTERVAL_MS);
      }
      this.deps.log("warn", t("log.margin.switchUnconfirmed", { mode: this.currentMode() ?? "unknown" }));
      return false;
    } catch (error) {
      this.deps.log("error", t("log.margin.switchFailed", { error: extractMessage(error) }));
      return false;
    } finally {
      this.ensuring = null;
    }
  }
}
