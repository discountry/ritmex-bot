const TERMINAL_STATUS_MAP: Record<string, string> = {
  filled: "FILLED",
  canceled: "CANCELED",
  cancelled: "CANCELED",
  expired: "EXPIRED",
  "canceled-post-only": "CANCELED",
  "canceled-reduce-only": "CANCELED",
};

export function normalizeOrderStatus(raw: string): string {
  if (!raw) return "UNKNOWN";
  const normalized = raw.toLowerCase();
  return TERMINAL_STATUS_MAP[normalized] ?? raw.toUpperCase();
}
