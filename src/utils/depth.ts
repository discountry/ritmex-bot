import type { AsterDepth } from '../exchanges/types';

export type DepthImbalance = 'balanced' | 'buy_dominant' | 'sell_dominant';

export function computeDepthStats(depth: AsterDepth, levels = 10, ratio = 3): { buySum: number; sellSum: number; skipBuySide: boolean; skipSellSide: boolean; imbalance: DepthImbalance } {
   const topBids = (depth.bids ?? []).slice(0, levels);
   const topAsks = (depth.asks ?? []).slice(0, levels);

   const buySum = topBids.reduce((total, level) => {
      const qty = Number(level?.[1]);
      return Number.isFinite(qty) ? total + qty : total;
   }, 0);

   const sellSum = topAsks.reduce((total, level) => {
      const qty = Number(level?.[1]);
      return Number.isFinite(qty) ? total + qty : total;
   }, 0);

   const skipSellSide = sellSum === 0 || sellSum * ratio < buySum;
   const skipBuySide = buySum === 0 || buySum * ratio < sellSum;

   let imbalance: DepthImbalance = 'balanced';
   if (buySum > sellSum * ratio) {
      imbalance = 'buy_dominant';
   } else if (sellSum > buySum * ratio) {
      imbalance = 'sell_dominant';
   }

   return { buySum, sellSum, skipBuySide, skipSellSide, imbalance };
}
