import { describe, expect, it, vi } from "vitest";
import { IsolatedMarginGuard } from "../src/strategy/common/isolated-margin-guard";
import type { AccountSnapshot } from "../src/exchanges/types";
import { t } from "../src/i18n";

const SYMBOL = "BTC-USD";

function snapshotWithMode(mode: string | null): AccountSnapshot {
  return {
    positions: [{ symbol: SYMBOL, ...(mode ? { marginType: mode } : {}) }],
  } as unknown as AccountSnapshot;
}

function makeGuard(options: {
  enabled?: boolean;
  initialMode?: string | null;
  /** Modes the account reports on successive polls. */
  polledModes?: Array<string | null>;
  changeMarginMode?: (params: { symbol: string; marginMode: "isolated" | "cross" }) => Promise<void>;
  omitCapabilities?: boolean;
} = {}) {
  const logs: Array<[string, string]> = [];
  let current = snapshotWithMode("initialMode" in options ? options.initialMode! : "cross");
  const polled = [...(options.polledModes ?? [])];
  const queryAccountSnapshot = vi.fn(async () => snapshotWithMode(polled.shift() ?? "cross"));
  const changeMarginMode = vi.fn(options.changeMarginMode ?? (async () => {}));

  const guard = new IsolatedMarginGuard({
    symbol: SYMBOL,
    enabled: options.enabled ?? true,
    log: (type, detail) => logs.push([type, detail]),
    currentSnapshot: () => current,
    changeMarginMode: options.omitCapabilities ? undefined : changeMarginMode,
    queryAccountSnapshot: options.omitCapabilities ? undefined : queryAccountSnapshot,
    applySnapshot: (next) => {
      current = next;
    },
    // No real waiting in tests.
    sleep: async () => {},
  });
  return { guard, logs, changeMarginMode, queryAccountSnapshot };
}

describe("IsolatedMarginGuard", () => {
  it("is inert on venues without a per-symbol margin mode", async () => {
    const { guard, changeMarginMode } = makeGuard({ enabled: false });
    expect(await guard.ensureIsolated()).toBe(true);
    expect(guard.currentMode()).toBeNull();
    expect(changeMarginMode).not.toHaveBeenCalled();
  });

  it("does nothing when already isolated", async () => {
    const { guard, changeMarginMode } = makeGuard({ initialMode: "isolated" });
    expect(await guard.ensureIsolated()).toBe(true);
    expect(changeMarginMode).not.toHaveBeenCalled();
  });

  it("normalises the reported mode", async () => {
    const { guard } = makeGuard({ initialMode: "  ISOLATED  " });
    expect(guard.currentMode()).toBe("isolated");
  });

  it("reports an unknown mode as null", async () => {
    const { guard } = makeGuard({ initialMode: null });
    expect(guard.currentMode()).toBeNull();
  });

  it("switches and confirms through a snapshot poll", async () => {
    const { guard, logs, changeMarginMode } = makeGuard({
      initialMode: "cross",
      polledModes: ["cross", "isolated"],
    });
    expect(await guard.ensureIsolated()).toBe(true);
    expect(changeMarginMode).toHaveBeenCalledWith({ symbol: SYMBOL, marginMode: "isolated" });
    expect(logs.some(([, detail]) => detail === t("log.margin.switched"))).toBe(true);
  });

  it("gives up after the confirm attempts run out", async () => {
    const { guard, logs, queryAccountSnapshot } = makeGuard({ polledModes: [] });
    expect(await guard.ensureIsolated()).toBe(false);
    expect(queryAccountSnapshot).toHaveBeenCalledTimes(10);
    expect(logs.some(([type]) => type === "warn")).toBe(true);
  });

  it("reports failure when the venue rejects the change", async () => {
    const { guard, logs } = makeGuard({
      changeMarginMode: async () => {
        throw new Error("rejected");
      },
    });
    expect(await guard.ensureIsolated()).toBe(false);
    expect(logs.some(([type]) => type === "error")).toBe(true);
  });

  it("returns false when the adapter cannot change margin mode", async () => {
    const { guard } = makeGuard({ omitCapabilities: true });
    expect(await guard.ensureIsolated()).toBe(false);
  });

  it("shares one in-flight switch across concurrent ticks", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const { guard, changeMarginMode } = makeGuard({
      polledModes: ["isolated"],
      changeMarginMode: async () => {
        await gate;
      },
    });

    const first = guard.ensureIsolated();
    // A tick arriving mid-switch must not fire a second change request.
    const second = await guard.ensureIsolated();
    expect(second).toBe(false);
    release();
    expect(await first).toBe(true);
    expect(changeMarginMode).toHaveBeenCalledTimes(1);
  });

  it("allows a fresh attempt after the previous one settles", async () => {
    const { guard, changeMarginMode } = makeGuard({ polledModes: [] });
    expect(await guard.ensureIsolated()).toBe(false);
    expect(await guard.ensureIsolated()).toBe(false);
    expect(changeMarginMode).toHaveBeenCalledTimes(2);
  });
});
