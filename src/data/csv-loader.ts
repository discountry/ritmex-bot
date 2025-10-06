import * as fs from 'node:fs';
import * as path from 'node:path';
import type { LoadOptions, OHLCV } from '../types';
import { parseTimeToMs } from '../types';

export function loadCsvOHLCV(filePath: string, opts?: LoadOptions): OHLCV[] {
   const full = path.resolve(filePath);
   const raw = fs.readFileSync(full, 'utf-8');
   const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
   if (lines.length === 0) { return []; }
   let start = 0;
   const header = lines[0]!.split(',').map((h) => h.trim());
   const hasHeader = opts?.expectHeader !== false ? isHeader(header) : false;
   const idx = indexMap(header, opts);
   if (hasHeader) { start = 1; }

   const result: OHLCV[] = [];
   for (let i = start; i < lines.length; i++) {
      const cols = lines[i]!.split(',').map((c) => c.trim());
      const ts = parseTimeToMs(cols[idx.time] as string);
      const open = Number(cols[idx.open] as string);
      const high = Number(cols[idx.high] as string);
      const low = Number(cols[idx.low] as string);
      const close = Number(cols[idx.close] as string);
      const volume = Number(cols[idx.volume] as string);
      if (![open, high, low, close, volume, ts].every((v) => Number.isFinite(v))) { continue; }
      result.push({ ts, open, high, low, close, volume, symbol: opts?.symbol });
   }
   // sort by ts ascending
   result.sort((a, b) => a.ts - b.ts);
   return result;
}

function isHeader(header: string[]): boolean {
   const norm = header.map((h) => h.toLowerCase());
   return ['time', 'open', 'close', 'low', 'high', 'volume'].every((k) => norm.includes(k));
}

function indexMap(header: string[], opts?: LoadOptions): Record<'time' | 'open' | 'high' | 'low' | 'close' | 'volume', number> {
   const defaultCols = opts?.columns ?? { time: 'time', open: 'open', high: 'high', low: 'low', close: 'close', volume: 'volume' };
   const toIdx = (name: string) => {
      const idx = header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
      return idx >= 0 ? idx : -1;
   };
   const map = { time: toIdx(defaultCols.time), open: toIdx(defaultCols.open), high: toIdx(defaultCols.high), low: toIdx(defaultCols.low), close: toIdx(defaultCols.close), volume: toIdx(defaultCols.volume) };
   // if no header, assume fixed order: time,open,close,low,high,volume per user
   if (Object.values(map).some((v) => v < 0)) {
      return { time: 0, open: 1, close: 2, low: 3, high: 4, volume: 5 } as any;
   }
   return map;
}
