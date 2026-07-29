import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { PrecisionSyncer } from "../src/strategy/common/precision-syncer";
import type { ExchangeAdapter, ExchangePrecision } from "../src/exchanges/adapter";

function makeExchange(getPrecision?: () => Promise<ExchangePrecision | null>): ExchangeAdapter {
  return { id: "stub", getPrecision } as unknown as ExchangeAdapter;
}

const MESSAGES = {
  synced: (p: ExchangePrecision) => `synced ${p.priceTick}/${p.qtyStep}`,
  failed: (error: unknown) => `failed ${String(error)}`,
};

describe("PrecisionSyncer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("seeds from config and writes exchange precision through to config", async () => {
    const config = { priceTick: 0.1, qtyStep: 0.001 };
    const syncer = new PrecisionSyncer(
      makeExchange(async () => ({ priceTick: 0.01, qtyStep: 0.1 })),
      config,
      { priceTick: config.priceTick, qtyStep: config.qtyStep },
      () => {},
      MESSAGES
    );

    expect(syncer.priceTick).toBe(0.1);
    syncer.start();
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.01));

    expect(syncer.qtyStep).toBe(0.1);
    expect(config.priceTick).toBe(0.01);
    expect(config.qtyStep).toBe(0.1);
  });

  it("logs only when an increment actually moves", async () => {
    const logs: string[] = [];
    const syncer = new PrecisionSyncer(
      makeExchange(async () => ({ priceTick: 0.1, qtyStep: 0.001 })),
      { priceTick: 0.1, qtyStep: 0.001 },
      { priceTick: 0.1, qtyStep: 0.001 },
      (_type, detail) => logs.push(detail),
      MESSAGES
    );

    syncer.start();
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.1));
    expect(logs).toEqual([]);
  });

  it("ignores non-positive increments from the exchange", async () => {
    const syncer = new PrecisionSyncer(
      makeExchange(async () => ({ priceTick: 0, qtyStep: Number.NaN })),
      { priceTick: 0.5, qtyStep: 0.25 },
      { priceTick: 0.5, qtyStep: 0.25 },
      () => {},
      MESSAGES
    );

    syncer.start();
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.5));
    expect(syncer.qtyStep).toBe(0.25);
  });

  it("retries after a failure until the exchange answers", async () => {
    let attempts = 0;
    const syncer = new PrecisionSyncer(
      makeExchange(async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("boom");
        return { priceTick: 0.05, qtyStep: 0.5 };
      }),
      { priceTick: 1, qtyStep: 1 },
      { priceTick: 1, qtyStep: 1 },
      () => {},
      MESSAGES
    );

    syncer.start();
    await vi.waitFor(() => expect(attempts).toBe(1));
    await vi.advanceTimersByTimeAsync(2000);
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.05));
  });

  it("stop() cancels the pending retry so a dead engine stops polling", async () => {
    let attempts = 0;
    const syncer = new PrecisionSyncer(
      makeExchange(async () => {
        attempts += 1;
        throw new Error("boom");
      }),
      { priceTick: 1, qtyStep: 1 },
      { priceTick: 1, qtyStep: 1 },
      () => {},
      MESSAGES
    );

    syncer.start();
    await vi.waitFor(() => expect(attempts).toBe(1));
    syncer.stop();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(attempts).toBe(1);
  });

  it("start() is idempotent while a sync is in flight", async () => {
    let attempts = 0;
    const syncer = new PrecisionSyncer(
      makeExchange(async () => {
        attempts += 1;
        return { priceTick: 0.2, qtyStep: 0.2 };
      }),
      { priceTick: 1, qtyStep: 1 },
      { priceTick: 1, qtyStep: 1 },
      () => {},
      MESSAGES
    );

    syncer.start();
    syncer.start();
    syncer.start();
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.2));
    expect(attempts).toBe(1);
  });

  it("refresh() refetches after a completed sync", async () => {
    let tick = 0.2;
    let attempts = 0;
    const syncer = new PrecisionSyncer(
      makeExchange(async () => {
        attempts += 1;
        return { priceTick: tick, qtyStep: 1 };
      }),
      { priceTick: 1, qtyStep: 1 },
      { priceTick: 1, qtyStep: 1 },
      () => {},
      MESSAGES
    );

    syncer.start();
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.2));
    tick = 0.4;
    syncer.refresh();
    await vi.waitFor(() => expect(syncer.priceTick).toBe(0.4));
    expect(attempts).toBe(2);
  });

  it("is inert when the adapter cannot report precision", async () => {
    const syncer = new PrecisionSyncer(
      makeExchange(undefined),
      { priceTick: 0.3, qtyStep: 0.3 },
      { priceTick: 0.3, qtyStep: 0.3 },
      () => {},
      MESSAGES
    );

    syncer.start();
    await vi.advanceTimersByTimeAsync(5000);
    expect(syncer.priceTick).toBe(0.3);
  });
});
