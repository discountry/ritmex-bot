import { promises as fs } from "fs";
import path from "path";
import type { GridDirection } from "../../config";

const DATA_DIR = process.env.GRID_DATA_DIR?.trim() || path.resolve("data");
const GRID_FILE = path.resolve(DATA_DIR, "grid-record.json");

export interface StoredGridState {
  symbol: string;
  lowerPrice: number;
  upperPrice: number;
  gridLevels: number;
  orderSize: number;
  maxPositionSize: number;
  direction: GridDirection;
  longExposure: Record<string, number>;
  shortExposure: Record<string, number>;
  updatedAt: number;
}

type GridStateMap = Record<string, StoredGridState>;

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readStateFile(): Promise<GridStateMap> {
  try {
    const content = await fs.readFile(GRID_FILE, "utf8");
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

export async function loadGridState(symbol: string): Promise<StoredGridState | null> {
  const map = await readStateFile();
  const snapshot = map[symbol];
  return snapshot ?? null;
}

export async function saveGridState(snapshot: StoredGridState): Promise<void> {
  await ensureDataDir();
  const map = await readStateFile();
  map[snapshot.symbol] = snapshot;
  await fs.writeFile(GRID_FILE, JSON.stringify(map, null, 2), "utf8");
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
      await fs.unlink(GRID_FILE);
    } catch (error: any) {
      if (!error || (error.code !== "ENOENT" && error.code !== "ENOTDIR")) {
        throw error;
      }
    }
    return;
  }
  await ensureDataDir();
  await fs.writeFile(GRID_FILE, JSON.stringify(map, null, 2), "utf8");
}
