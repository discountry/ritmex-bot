import type { PortfolioSnapshot, Trade } from './simulator';

export interface Metrics {
   totalReturn: number;
   annualizedReturn: number;
   maxDrawdown: number;
   sharpe: number;
   volatility: number;
   trades: number;
   winRate: number;
   avgPnL: number;
   avgWin: number;
   avgLoss: number;
   exposurePct: number;
}

export function computeMetrics(curve: PortfolioSnapshot[], trades: Trade[], initialEquity: number, timeframeMs: number): Metrics {
   if (curve.length === 0) {
      return { totalReturn: 0, annualizedReturn: 0, maxDrawdown: 0, sharpe: 0, volatility: 0, trades: 0, winRate: 0, avgPnL: 0, avgWin: 0, avgLoss: 0, exposurePct: 0 };
   }
   const lastEquity = curve[curve.length - 1]!.equity;
   const totalReturn = (lastEquity - initialEquity) / initialEquity;

   const maxDrawdown = curve.reduce((m, s) => Math.max(m, s.drawdown), 0);

   // simple step returns for volatility/sharpe
   const rets: number[] = [];
   for (let i = 1; i < curve.length; i++) {
      const prev = curve[i - 1]!.equity;
      const curr = curve[i]!.equity;
      if (prev > 0) { rets.push((curr - prev) / prev); }
   }
   const avgStep = mean(rets);
   const sdStep = stddev(rets, avgStep);
   const stepsPerYear = Math.floor((365 * 24 * 60 * 60 * 1000) / timeframeMs);
   const annualizedReturn = (1 + avgStep) ** stepsPerYear - 1;
   const volatility = sdStep * Math.sqrt(stepsPerYear);
   const sharpe = sdStep > 0 ? (avgStep * stepsPerYear) / (sdStep * Math.sqrt(stepsPerYear)) : 0;

   // exposure: fraction of bars with non-zero position
   const exposurePct = curve.length > 0 ? (curve.filter(s => s.qty !== 0).length / curve.length) : 0;

   // realized PnL stats from trades
   const closes = trades.filter(t => t.realized && typeof t.pnl === 'number');
   const pnlList = closes.map(t => t.pnl as number);
   const wins = pnlList.filter(x => x > 0);
   const losses = pnlList.filter(x => x < 0);
   const tradesCount = pnlList.length;
   const winRate = tradesCount > 0 ? wins.length / tradesCount : 0;
   const avgPnL = tradesCount > 0 ? mean(pnlList) : 0;
   const avgWin = wins.length > 0 ? mean(wins) : 0;
   const avgLoss = losses.length > 0 ? mean(losses) : 0;

   return { totalReturn, annualizedReturn, maxDrawdown, sharpe, volatility, trades: tradesCount, winRate, avgPnL, avgWin, avgLoss, exposurePct };
}

function mean(arr: number[]): number {
   if (arr.length === 0) { return 0; }
   return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr: number[], avg: number): number {
   if (arr.length === 0) { return 0; }
   const v = arr.reduce((s, x) => s + (x - avg) * (x - avg), 0) / arr.length;
   return Math.sqrt(v);
}
