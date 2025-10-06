import { TrendStrategy } from '../strategy/trend-strategy';
import type { OHLCV, Timeframe, TrendStrategyConfig } from '../types';
import { type BacktestParams, type BacktestResult, Simulator } from './simulator';

export function tfToMs(tf: Timeframe): number {
   switch (tf) {
      case '15m':
         return 15 * 60 * 1000;
      case '30m':
         return 30 * 60 * 1000;
      case '1h':
         return 60 * 60 * 1000;
      case '4h':
         return 4 * 60 * 60 * 1000;
      default:
         return 0;
   }
}

export function runBacktest(tf: string, auxSeries: Record<string, OHLCV[]>, stratCfg: TrendStrategyConfig, bt: BacktestParams, atrArr: (number | null)[]): BacktestResult {
   const strat = new TrendStrategy();
   strat.init(stratCfg);
   const sim = new Simulator(bt);
   const series: OHLCV[] = auxSeries[tf] ?? [];
   const trades: BacktestResult['trades'] = [];
   const curve: BacktestResult['equityCurve'] = [];
   for (let i = 0; i < series.length; i++) {
      const bar = series[i]!;
      const ctx = { auxSeries: auxSeries, auxSmaPeriod: stratCfg.auxSmaPeriod, requireAllAgree: stratCfg.requireAllAgree };
      const sig = strat.next(bar, series.slice(0, i + 1), ctx);
      const { trade, snapshot } = sim.step(bar, sig, atrArr[i] ?? null);
      if (trade) { trades.push(trade); }
      curve.push(snapshot);
   }
   return { trades, equityCurve: curve };
}
