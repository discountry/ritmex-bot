import type { PositionSnapshot } from "./strategy";

export function shouldStopLoss(
  position: PositionSnapshot,
  bestBid: number,
  bestAsk: number,
  lossLimit: number
): boolean {
  const absPosition = Math.abs(position.positionAmt);
  if (absPosition < 1e-5) return false;

  if (!Number.isFinite(position.entryPrice) || Math.abs(position.entryPrice) < 1e-8) {
    return false;
  }

  const closePrice = position.positionAmt > 0 ? bestBid : bestAsk;
  if (!Number.isFinite(closePrice)) return false;

  const pnl = position.positionAmt > 0
    ? (closePrice - position.entryPrice) * absPosition
    : (position.entryPrice - closePrice) * absPosition;

  if (!Number.isFinite(pnl)) return false;

  return pnl < -lossLimit;
}
