/**
 * Helpers for working with Lighter order identifiers without losing precision.
 */

/**
 * Normalizes any order identifier into a trimmed string representation.
 * Accepts string, number, or bigint inputs; returns null when the value
 * cannot be represented as a meaningful identifier.
 */
export function normalizeOrderIdentity(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return null;
    }
    return Math.trunc(value).toString(10);
  }
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  return null;
}

/**
 * Compares two identifier-like values without casting through Number(),
 * which would drop precision for large (>2^53) indices.
 */
export function orderIdentityEquals(a: unknown, b: unknown): boolean {
  const left = normalizeOrderIdentity(a);
  const right = normalizeOrderIdentity(b);
  return left != null && right != null && left === right;
}
