function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

/**
 * Determines whether a per-market websocket payload should reset the cached
 * orders before applying its contents.
 */
export function shouldResetMarketOrders(bucket: unknown, snapshot: boolean): boolean {
  if (snapshot) return true;
  if (bucket == null) return false;
  if (Array.isArray(bucket)) {
    return bucket.length === 0;
  }
  if (isPlainObject(bucket)) {
    return Object.keys(bucket).length === 0;
  }
  return false;
}
