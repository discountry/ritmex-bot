import type { PositionSnapshot } from "./strategy";

export function computePositionPnl(
  position: PositionSnapshot,
  bestBid?: number | null,
  bestAsk?: number | null
): number {
  const priceForPnl = position.positionAmt > 0 ? bestBid : bestAsk;
  if (!Number.isFinite(priceForPnl as number)) return 0;
  const absAmt = Math.abs(position.positionAmt);
  return position.positionAmt > 0
    ? ((priceForPnl as number) - position.entryPrice) * absAmt
    : (position.entryPrice - (priceForPnl as number)) * absAmt;
}

export function computeStopLossPnl(
  position: PositionSnapshot,
  bestBid?: number | null,
  bestAsk?: number | null
): number | null {
  const absAmt = Math.abs(position.positionAmt);
  if (!Number.isFinite(absAmt) || absAmt <= 0) return 0;

  // If entry price is missing, prefer the exchange-provided unrealized PnL.
  if (!Number.isFinite(position.entryPrice) || position.entryPrice <= 0) {
    return Number.isFinite(position.unrealizedProfit) ? position.unrealizedProfit : null;
  }

  const priceForPnl = position.positionAmt > 0 ? bestBid : bestAsk;
  if (!Number.isFinite(priceForPnl as number) || (priceForPnl as number) <= 0) {
    return Number.isFinite(position.unrealizedProfit) ? position.unrealizedProfit : null;
  }

  return computePositionPnl(position, bestBid, bestAsk);
}

