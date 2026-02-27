const TRUE_VALUES = new Set(["1", "true", "yes", "y", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "n", "off"]);

export function normalizeBooleanFlag(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
    return null;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (TRUE_VALUES.has(normalized)) return true;
    if (FALSE_VALUES.has(normalized)) return false;
    return null;
  }
  if (typeof value === "bigint") {
    if (value === 1n) return true;
    if (value === 0n) return false;
    return null;
  }
  return null;
}

export function coerceBooleanFlag(value: unknown, fallback = false): boolean {
  const normalized = normalizeBooleanFlag(value);
  if (normalized == null) return fallback;
  return normalized;
}
