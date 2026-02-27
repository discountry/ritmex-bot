export function isOrderActiveStatus(status: string | undefined): boolean {
  if (!status) return true;
  const normalized = status.trim().toUpperCase();
  if (!normalized) return true;
  if (normalized.includes("CLOSED")) return false;
  if (normalized === "FILLED") return false;
  if (normalized === "CANCELED" || normalized === "CANCELLED") return false;
  if (normalized === "REJECTED" || normalized === "EXPIRED") return false;
  if (normalized === "TRIGGERED") return false;
  return true;
}
