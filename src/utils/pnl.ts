import type { PositionSnapshot } from './strategy';

export function computePositionPnl(position: PositionSnapshot, bestBid?: number | null, bestAsk?: number | null): number {
   const priceForPnl = position.positionAmt > 0 ? bestBid : bestAsk;
   if (!Number.isFinite(priceForPnl as number)) { return 0; }
   const absAmt = Math.abs(position.positionAmt);
   return position.positionAmt > 0 ? ((priceForPnl as number) - position.entryPrice) * absAmt : (position.entryPrice - (priceForPnl as number)) * absAmt;
}
