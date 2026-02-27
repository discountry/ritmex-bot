export function isUnknownOrderError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = Number((error as { code?: unknown }).code);
    // Nado: 2020: Order with the provided digest ... could not be found.
    if (Number.isFinite(code) && code === 2020) return true;
  }
  const message = extractMessage(error);
  if (!message) return false;
  const upper = message.toUpperCase();
  return (
    upper.includes("UNKNOWN ORDER") ||
    upper.includes("CODE\":-2011") ||
    upper.includes("ORDER_ID_NOT_FOUND") ||
    upper.includes("ORDER_IS_CLOSED") ||
    upper.includes("COULD NOT FIND ORDER") ||
    upper.includes("ORDER WITH THE PROVIDED DIGEST") ||
    (upper.includes("COULD NOT BE FOUND") && upper.includes("ORDER"))
  );
}

export function extractMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function isRateLimitError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "object" && "status" in error) {
    const status = Number((error as { status?: unknown }).status);
    if (Number.isFinite(status) && status === 429) {
      return true;
    }
  }
  if (typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === 429 || code === "429") {
      return true;
    }
  }
  const message = extractMessage(error).toLowerCase();
  return (
    message.includes("429") ||
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    message.includes("request rate")
  );
}

export function isInsufficientBalanceError(error: unknown): boolean {
  const message = extractMessage(error).toUpperCase();
  return (
    message.includes("INSUFFICIENT") ||
    message.includes("NOT_ENOUGH_BALANCE") ||
    message.includes("INSUFFICIENT_BALANCE") ||
    message.includes("NOT ENOUGH")
  );
}

export function isPrecisionError(error: unknown): boolean {
  const message = extractMessage(error).toUpperCase();
  return (
    message.includes("PRECISION") ||
    message.includes("TICK_SIZE") ||
    message.includes("TICKSIZE") ||
    message.includes("STEP_SIZE") ||
    message.includes("STEPSIZE") ||
    message.includes("LOT_SIZE") ||
    message.includes("LOTSIZE") ||
    message.includes("INVALID_QUANTITY") ||
    message.includes("INVALID QUANTITY") ||
    message.includes("QUANTITY_INVALID") ||
    message.includes("INVALID_PRICE") ||
    message.includes("INVALID PRICE") ||
    message.includes("PRICE_INVALID") ||
    message.includes("QTY_STEP") ||
    message.includes("PRICE_TICK") ||
    message.includes("DECIMAL") ||
    message.includes("FILTER_FAILURE") ||
    message.includes("NOTIONAL")
  );
}
