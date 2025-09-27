export interface TradeLogEntry {
  time: string;
  type: string;
  detail: string;
}

export function createTradeLog(maxEntries: number, seed: TradeLogEntry[] = []) {
  const entries: TradeLogEntry[] = seed.slice(-maxEntries);
  function push(type: string, detail: string) {
    entries.push({ time: new Date().toLocaleString(), type, detail });
    if (entries.length > maxEntries) {
      entries.shift();
    }
  }
  function all() {
    return entries;
  }
  function replace(next: TradeLogEntry[]) {
    entries.splice(0, entries.length, ...next.slice(-maxEntries));
  }
  return { push, all, replace };
}
