import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import {
  loadGridState,
  saveGridState,
  clearGridState,
  migrateV1ToV2,
  type StoredGridStateV2,
} from "../src/strategy/common/grid-storage";

let tmpDir: string;
let prevDataDir: string | undefined;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "grid-storage-test-"));
  prevDataDir = process.env.GRID_DATA_DIR;
  process.env.GRID_DATA_DIR = tmpDir;
});

afterEach(async () => {
  if (prevDataDir == null) delete process.env.GRID_DATA_DIR;
  else process.env.GRID_DATA_DIR = prevDataDir;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

function makeV2(symbol: string): StoredGridStateV2 {
  return {
    schemaVersion: 2,
    symbol,
    exchangeId: "aster",
    gridVersion: 3,
    anchorPrice: 150,
    lowerPrice: 100,
    upperPrice: 200,
    gridLevels: 5,
    orderSize: 0.1,
    maxPositionSize: 0.4,
    direction: "neutral",
    gridMode: "geometric",
    levels: {
      "1": { phase: "holding", exitTarget: 2, holdQty: 0.1 },
      "3": { phase: "exit_placed", exitTarget: 2, holdQty: 0.1, exitOrderId: "o-9" },
    },
    intents: [
      {
        orderId: "o-9",
        clientOrderId: "grid-3-X-3-2-abc",
        intent: "EXIT",
        side: "BUY",
        price: "141.4",
        qty: 0.1,
        level: 3,
        target: 2,
        gridVersion: 3,
        createdAt: 1000,
      },
    ],
    inflight: null,
    shift: { phase: "closing", targetAnchor: 210, startedAt: 2000 },
    exchangeStop: { orderId: "stop-1", side: "SELL", stopPrice: 99 },
    updatedAt: 3000,
  };
}

describe("grid-storage v2", () => {
  it("round-trips a v2 snapshot", async () => {
    const snapshot = makeV2("BTCUSDT");
    await saveGridState(snapshot);
    const loaded = await loadGridState("BTCUSDT");
    expect(loaded).toEqual(snapshot);
  });

  it("returns null for unknown symbols", async () => {
    expect(await loadGridState("NONE")).toBeNull();
  });

  it("keeps entries for other symbols on clear", async () => {
    await saveGridState(makeV2("BTCUSDT"));
    await saveGridState(makeV2("ETHUSDT"));
    await clearGridState("BTCUSDT");
    expect(await loadGridState("BTCUSDT")).toBeNull();
    expect(await loadGridState("ETHUSDT")).not.toBeNull();
  });

  it("removes the file when the last symbol is cleared", async () => {
    await saveGridState(makeV2("BTCUSDT"));
    await clearGridState("BTCUSDT");
    await expect(fs.stat(path.join(tmpDir, "grid-record.json"))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });
});

describe("grid-storage v1 migration", () => {
  const v1Entry = {
    symbol: "BTCUSDT",
    lowerPrice: 100,
    upperPrice: 200,
    gridLevels: 5,
    orderSize: 0.1,
    maxPositionSize: 0.4,
    direction: "both",
    levels: {
      "0": { state: "filled", sourceLevel: 0, targetLevel: 1 },
      "1": { state: "exit_placed", sourceLevel: 1, targetLevel: 2, exitOrderId: "legacy-1" },
      "2": { state: "idle", sourceLevel: 2, targetLevel: null },
    },
    updatedAt: 1234,
  };

  it("loads v1 entries as migrated v2", async () => {
    await fs.writeFile(
      path.join(tmpDir, "grid-record.json"),
      JSON.stringify({ BTCUSDT: v1Entry }),
      "utf8"
    );
    const loaded = await loadGridState("BTCUSDT");
    expect(loaded).not.toBeNull();
    expect(loaded!.schemaVersion).toBe(2);
    expect(loaded!.gridVersion).toBe(1);
    expect(loaded!.anchorPrice).toBeNull();
    expect(loaded!.levels["0"]).toEqual({ phase: "holding", exitTarget: 1, holdQty: 0.1 });
    expect(loaded!.levels["1"]).toEqual({
      phase: "exit_placed",
      exitTarget: 2,
      holdQty: 0.1,
      exitOrderId: "legacy-1",
    });
    expect(loaded!.levels["2"]).toBeUndefined();
    expect(loaded!.intents).toEqual([]);
  });

  it("migrateV1ToV2 preserves config fingerprint fields", () => {
    const migrated = migrateV1ToV2(v1Entry as any);
    expect(migrated.symbol).toBe("BTCUSDT");
    expect(migrated.direction).toBe("both");
    expect(migrated.orderSize).toBe(0.1);
    expect(migrated.gridLevels).toBe(5);
    expect(migrated.gridMode).toBe("geometric");
    expect(migrated.lowerPrice).toBe(100);
    expect(migrated.upperPrice).toBe(200);
  });
});
