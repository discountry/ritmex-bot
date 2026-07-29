import { describe, expect, it, vi, afterEach } from "vitest";
import { standxTokenConfig } from "../src/config";
import { t } from "../src/i18n";
import { TokenExpiryGuard } from "../src/strategy/common/token-expiry-guard";

const HOUR_MS = 3_600_000;
const original = standxTokenConfig.expiryTimestamp;

/** The config field is read on every call, so tests set it directly. */
function setExpiry(atMs: number | null): void {
  standxTokenConfig.expiryTimestamp = atMs;
}

function makeGuard() {
  const logs: Array<[string, string]> = [];
  const notifications: unknown[] = [];
  const cancelAllOrders = vi.fn(async () => {});
  const onOrdersCancelled = vi.fn();
  const guard = new TokenExpiryGuard({
    log: (type, detail) => logs.push([type, detail]),
    notify: (n) => notifications.push(n),
    cancelAllOrders,
    onOrdersCancelled,
  });
  return { guard, logs, notifications, cancelAllOrders, onOrdersCancelled };
}

describe("TokenExpiryGuard", () => {
  afterEach(() => {
    standxTokenConfig.expiryTimestamp = original;
  });

  it("stays out of the way when no expiry is configured", async () => {
    setExpiry(null);
    const { guard, cancelAllOrders } = makeGuard();
    const decision = await guard.evaluate({ positionAmt: 1, openOrderCount: 3 });
    expect(decision).toEqual({ halt: false, closeOnly: false });
    expect(cancelAllOrders).not.toHaveBeenCalled();
  });

  it("does nothing while the token is still valid", async () => {
    setExpiry(Date.now() + HOUR_MS * 24);
    const { guard, cancelAllOrders, notifications } = makeGuard();
    const decision = await guard.evaluate({ positionAmt: 0, openOrderCount: 0 });
    expect(decision).toEqual({ halt: false, closeOnly: false });
    expect(cancelAllOrders).not.toHaveBeenCalled();
    expect(notifications).toHaveLength(0);
  });

  it("cancels once and keeps ticking while a position is still open", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard, cancelAllOrders, onOrdersCancelled } = makeGuard();

    const first = await guard.evaluate({ positionAmt: 2, openOrderCount: 4 });
    expect(first).toEqual({ halt: false, closeOnly: true });
    expect(cancelAllOrders).toHaveBeenCalledTimes(1);
    expect(onOrdersCancelled).toHaveBeenCalledTimes(1);

    await guard.evaluate({ positionAmt: 2, openOrderCount: 4 });
    expect(cancelAllOrders).toHaveBeenCalledTimes(1);
  });

  it("logs and notifies exactly once per episode", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard, logs, notifications } = makeGuard();

    await guard.evaluate({ positionAmt: 2, openOrderCount: 1 });
    await guard.evaluate({ positionAmt: 2, openOrderCount: 1 });
    await guard.evaluate({ positionAmt: 2, openOrderCount: 1 });

    expect(notifications).toHaveLength(1);
    expect(logs.filter(([type]) => type === "warn")).toHaveLength(1);
  });

  it("halts the tick once nothing is left to manage", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard } = makeGuard();
    expect((await guard.evaluate({ positionAmt: 0, openOrderCount: 0 })).halt).toBe(true);
  });

  it("announces the silent mode only on entry", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard, logs } = makeGuard();
    await guard.evaluate({ positionAmt: 0, openOrderCount: 0 });
    await guard.evaluate({ positionAmt: 0, openOrderCount: 0 });
    const entryLogs = logs.filter(
      ([type, detail]) => type === "info" && detail === t("log.token.silentEntered")
    );
    expect(entryLogs).toHaveLength(1);
  });

  it("retries the cancel on the next tick when it fails", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard, cancelAllOrders, logs } = makeGuard();
    cancelAllOrders.mockRejectedValueOnce(new Error("network down"));

    await guard.evaluate({ positionAmt: 1, openOrderCount: 2 });
    expect(logs.some(([type]) => type === "error")).toBe(true);

    await guard.evaluate({ positionAmt: 1, openOrderCount: 2 });
    expect(cancelAllOrders).toHaveBeenCalledTimes(2);
  });

  it("treats an already-gone order as a successful cancel", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard, cancelAllOrders } = makeGuard();
    cancelAllOrders.mockRejectedValueOnce(new Error("Unknown order sent."));

    await guard.evaluate({ positionAmt: 1, openOrderCount: 2 });
    await guard.evaluate({ positionAmt: 1, openOrderCount: 2 });
    expect(cancelAllOrders).toHaveBeenCalledTimes(1);
  });

  it("skips the cancel when there is nothing resting", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard, cancelAllOrders } = makeGuard();
    await guard.evaluate({ positionAmt: 1, openOrderCount: 0 });
    expect(cancelAllOrders).not.toHaveBeenCalled();
  });

  it("exposes closeOnlyMode for the engine's close-reason label", async () => {
    setExpiry(Date.now() - HOUR_MS);
    const { guard } = makeGuard();
    expect(guard.closeOnlyMode).toBe(false);
    await guard.evaluate({ positionAmt: 3, openOrderCount: 0 });
    expect(guard.closeOnlyMode).toBe(true);
  });

  it("re-arms every latch once a fresh token arrives", async () => {
    // The five latches must reset together; a stale one would silently suppress
    // the log, alert, or cancel for the next expiry.
    setExpiry(Date.now() - HOUR_MS);
    const { guard, notifications, cancelAllOrders, logs } = makeGuard();

    await guard.evaluate({ positionAmt: 5, openOrderCount: 1 });
    expect(guard.closeOnlyMode).toBe(true);
    expect(notifications).toHaveLength(1);

    setExpiry(Date.now() + HOUR_MS * 24);
    await guard.evaluate({ positionAmt: 5, openOrderCount: 1 });
    expect(guard.closeOnlyMode).toBe(false);
    expect(guard.currentState).toBe("active");

    setExpiry(Date.now() - HOUR_MS);
    await guard.evaluate({ positionAmt: 5, openOrderCount: 1 });
    expect(notifications).toHaveLength(2);
    expect(cancelAllOrders).toHaveBeenCalledTimes(2);
    expect(logs.filter(([type]) => type === "warn")).toHaveLength(2);
  });
});
