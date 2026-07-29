import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  ReconnectScheduler,
  exponentialBackoff,
  fixedBackoff,
  linearBackoff,
} from "../src/exchanges/reconnect-scheduler";

describe("backoff policies", () => {
  it("fixed returns the same delay every attempt", () => {
    const policy = fixedBackoff(3000);
    expect([1, 2, 5].map(policy)).toEqual([3000, 3000, 3000]);
  });

  it("exponential doubles from the base and caps", () => {
    const policy = exponentialBackoff(1000, 8000);
    expect([1, 2, 3, 4, 5].map(policy)).toEqual([1000, 2000, 4000, 8000, 8000]);
  });

  it("linear grows by the base and caps", () => {
    const policy = linearBackoff(2000, 30_000);
    expect([1, 2, 3, 20].map(policy)).toEqual([2000, 4000, 6000, 30_000]);
  });
});

describe("ReconnectScheduler", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("reconnects after the backoff delay", async () => {
    const connect = vi.fn();
    const scheduler = new ReconnectScheduler({ connect, backoff: fixedBackoff(1000) });

    scheduler.schedule();
    expect(connect).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1000);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("collapses repeated schedule() calls into one pending attempt", async () => {
    const connect = vi.fn();
    const scheduler = new ReconnectScheduler({ connect, backoff: fixedBackoff(1000) });

    scheduler.schedule();
    scheduler.schedule();
    scheduler.schedule();
    expect(scheduler.pending).toBe(true);
    await vi.advanceTimersByTimeAsync(1000);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("grows the delay across consecutive failures", async () => {
    const delays: number[] = [];
    const scheduler = new ReconnectScheduler({
      connect: async () => {
        throw new Error("refused");
      },
      backoff: exponentialBackoff(1000, 60_000),
      onSchedule: (delay) => delays.push(delay),
    });

    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(4000);
    expect(delays.slice(0, 3)).toEqual([1000, 2000, 4000]);
  });

  it("resets the backoff once the socket opens", async () => {
    const delays: number[] = [];
    let failing = true;
    const scheduler = new ReconnectScheduler({
      connect: async () => {
        if (failing) throw new Error("refused");
      },
      backoff: exponentialBackoff(1000, 60_000),
      onSchedule: (delay) => delays.push(delay),
    });

    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);
    expect(scheduler.attemptCount).toBe(2);

    // A successful open must clear the counter, or the next transient blip
    // would wait as long as the last outage did.
    failing = false;
    scheduler.onConnected();
    expect(scheduler.attemptCount).toBe(0);

    delays.length = 0;
    scheduler.schedule();
    expect(delays[0]).toBe(1000);
  });

  it("reports a synchronous connect failure and retries", async () => {
    const errors: unknown[] = [];
    let calls = 0;
    const scheduler = new ReconnectScheduler({
      connect: () => {
        calls += 1;
        if (calls === 1) throw new Error("boom");
      },
      backoff: fixedBackoff(500),
      onError: (error) => errors.push(error),
    });

    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(500);
    expect(errors).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(500);
    expect(calls).toBe(2);
  });

  it("honours shouldReconnect", async () => {
    const connect = vi.fn();
    let running = false;
    const scheduler = new ReconnectScheduler({
      connect,
      backoff: fixedBackoff(100),
      shouldReconnect: () => running,
    });

    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(100);
    expect(connect).not.toHaveBeenCalled();

    running = true;
    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(100);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("cancel() drops the pending attempt but keeps the scheduler usable", async () => {
    const connect = vi.fn();
    const scheduler = new ReconnectScheduler({ connect, backoff: fixedBackoff(100) });

    scheduler.schedule();
    scheduler.cancel();
    await vi.advanceTimersByTimeAsync(1000);
    expect(connect).not.toHaveBeenCalled();

    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(100);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("stop() is permanent", async () => {
    const connect = vi.fn();
    const scheduler = new ReconnectScheduler({ connect, backoff: fixedBackoff(100) });

    scheduler.schedule();
    scheduler.stop();
    await vi.advanceTimersByTimeAsync(1000);
    scheduler.schedule();
    await vi.advanceTimersByTimeAsync(1000);
    expect(connect).not.toHaveBeenCalled();
  });

  it("does not reconnect when the timer fires after stop()", async () => {
    const connect = vi.fn();
    const scheduler = new ReconnectScheduler({ connect, backoff: fixedBackoff(100) });

    scheduler.schedule();
    scheduler.stop();
    await vi.advanceTimersByTimeAsync(500);
    expect(connect).not.toHaveBeenCalled();
  });
});
