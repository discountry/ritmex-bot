import { promises as fs } from "fs";
import path from "path";
import type { LevelPhase, StoredGridStateV2, StoredLevelV2 } from "../grid-logic";

export type { LevelPhase, StoredGridStateV2, StoredLevelV2 };

// 惰性解析，测试可通过 GRID_DATA_DIR 切换目录
function dataDir(): string {
  return process.env.GRID_DATA_DIR?.trim() || path.resolve("data");
}

function gridFile(): string {
  return path.resolve(dataDir(), "grid-record.json");
}

/** v1 遗留格式（无 schemaVersion 字段） */
interface StoredGridStateV1 {
  symbol: string;
  lowerPrice: number;
  upperPrice: number;
  gridLevels: number;
  orderSize: number;
  maxPositionSize: number;
  direction: string;
  levels: Record<
    string,
    { state: "idle" | "filled" | "exit_placed"; sourceLevel: number; targetLevel: number | null; exitOrderId?: string }
  >;
  updatedAt: number;
}

type StoredGridStateAny = StoredGridStateV1 | StoredGridStateV2;
type GridStateMap = Record<string, StoredGridStateAny>;

function isV2(entry: StoredGridStateAny): entry is StoredGridStateV2 {
  return (entry as StoredGridStateV2).schemaVersion === 2;
}

/** v1 → v2：filled→holding、exit_placed→exit_placed，holdQty 取 orderSize，锚定价缺失由引擎补齐 */
export function migrateV1ToV2(v1: StoredGridStateV1): StoredGridStateV2 {
  const levels: Record<string, StoredLevelV2> = {};
  for (const [key, info] of Object.entries(v1.levels ?? {})) {
    if (!info || info.state === "idle") continue;
    const phase: LevelPhase = info.state === "filled" ? "holding" : "exit_placed";
    const entry: StoredLevelV2 = {
      phase,
      exitTarget: info.targetLevel ?? null,
      holdQty: Number.isFinite(v1.orderSize) ? v1.orderSize : 0,
    };
    if (info.exitOrderId) entry.exitOrderId = info.exitOrderId;
    levels[key] = entry;
  }
  return {
    schemaVersion: 2,
    symbol: v1.symbol,
    exchangeId: "",
    gridVersion: 1,
    anchorPrice: null,
    lowerPrice: v1.lowerPrice,
    upperPrice: v1.upperPrice,
    gridLevels: v1.gridLevels,
    orderSize: v1.orderSize,
    maxPositionSize: v1.maxPositionSize,
    direction: v1.direction,
    gridMode: "geometric",
    levels,
    intents: [],
    inflight: null,
    shift: null,
    exchangeStop: null,
    updatedAt: v1.updatedAt ?? 0,
  };
}

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(dataDir(), { recursive: true });
  } catch {
    // ignore
  }
}

async function readStateFile(): Promise<GridStateMap> {
  try {
    const content = await fs.readFile(gridFile(), "utf8");
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object") {
      return parsed as GridStateMap;
    }
    return {};
  } catch (error: any) {
    if (error && (error.code === "ENOENT" || error.code === "ENOTDIR")) {
      return {};
    }
    throw error;
  }
}

export async function loadGridState(symbol: string): Promise<StoredGridStateV2 | null> {
  const map = await readStateFile();
  const snapshot = map[symbol];
  if (!snapshot) return null;
  if (isV2(snapshot)) return snapshot;
  return migrateV1ToV2(snapshot);
}

export async function saveGridState(snapshot: StoredGridStateV2): Promise<void> {
  await ensureDataDir();
  const map = await readStateFile();
  map[snapshot.symbol] = snapshot;
  await fs.writeFile(gridFile(), JSON.stringify(map, null, 2), "utf8");
}

export async function clearGridState(symbol: string): Promise<void> {
  const map = await readStateFile();
  if (!Object.prototype.hasOwnProperty.call(map, symbol)) {
    return;
  }
  delete map[symbol];
  const entries = Object.keys(map);
  if (!entries.length) {
    try {
      await fs.unlink(gridFile());
    } catch (error: any) {
      if (!error || (error.code !== "ENOENT" && error.code !== "ENOTDIR")) {
        throw error;
      }
    }
    return;
  }
  await ensureDataDir();
  await fs.writeFile(gridFile(), JSON.stringify(map, null, 2), "utf8");
}
