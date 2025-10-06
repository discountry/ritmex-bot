import * as path from 'node:path';
import { runBacktest, tfToMs } from '../backtest/engine';
import { computeMetrics } from '../backtest/metrics';
import { loadCsvOHLCV } from '../data/csv-loader';
import { computeATR } from '../indicators/atr';
import type { OHLCV, Timeframe } from '../types';

function main() {
   const symbol = 'HYPE'; // 交易品种符号
   const tfList = ['15m', '30m', '1h', '4h']; // 回测使用的时间周期列表
   const bestCrit: 'sharpe' | 'maxRet' | 'minDD' = 'sharpe'; // 最优选择指标：sharpe|maxRet|minDD（夏普/最大收益/最小回撤）

   const stratCfg = {
      smaPeriod: 30, // 简单移动平均线周期（主周期）
      bollingerLength: 20, // 布林带长度（周期数）
      bollingerStdMultiplier: 2, // 布林带标准差倍数
      minBollingerBandwidth: 0.01, // 最小布林带带宽阈值（过滤震荡/低波动）
      auxTimeframes: tfList, // 辅助时间周期列表（用于多周期共振）
      auxSmaPeriod: undefined, // 辅助周期SMA周期（未设置则不使用）
      requireAllAgree: undefined, // 是否要求各辅助周期一致同向（true/false，未设置则按策略默认）
      emaFastPeriod: undefined, // 快速EMA周期（若定义则可用于金叉/死叉类逻辑）
      emaSlowPeriod: undefined, // 慢速EMA周期
   };

   type GridParamKeys = 'gridSma' | 'gridStop' | 'gridMinBw' | 'gridBbLen' | 'gridBbStd' | 'gridQty' | 'gridFee' | 'gridSlip' | 'gridTrail';
   type GridParams = Record<GridParamKeys, number[]>;
   const gridParams: GridParams = {
      gridSma: [20, 30, 50], // SMA参数网格（主SMA周期）
      gridStop: [0.005, 0.01, 0.02], // 止损百分比网格（0.5%、1%、2%）
      gridMinBw: [0.01, 0.02], // 最小布林带带宽网格
      gridBbLen: [20, 30], // 布林带长度网格
      gridBbStd: [1.5, 2, 2.5], // 布林带标准差倍数网格
      gridQty: [0.5, 1, 2], // 交易数量网格（单位与策略设置有关）
      gridFee: [0.0005, 0.001], // 手续费比例网格（0.05%、0.1%）
      gridSlip: [0.0002, 0.0005], // 滑点比例网格（0.02%、0.05%）
      gridTrail: [0.01, 0.02], // 移动止盈比例网格（1%、2%）
   };
   // 仅使用每个参数数组的第一个元素（用于快速测试）
   for (const f of Object.keys(gridParams) as GridParamKeys[]) {
      const arr: number[] = gridParams[f] ?? [];
      gridParams[f] = [arr[0] ?? 0]; // 将网格收缩为单值，减少组合数量
   }
   const bt = {
      initialEquity: 10000, // 初始资金
      tradeQty: 1, // 每笔交易数量（可与 gridQty 配合）
      feePct: 0.001, // 手续费比例（0.1%）
      slippagePct: 0.0005, // 滑点比例（0.05%）
      lossLimitPct: undefined, // 固定止损百分比（未设置则按策略/ATR等逻辑）
      trailingProfitPct: undefined, // 移动止盈百分比（未设置则不启用）
      atrLen: 14, // ATR计算长度
      atrStopMult: 2, // ATR止损倍数
      atrTrailMult: 3, // ATR移动止盈倍数
      riskPct: 0.01, // 每笔交易风险占比（资金管理）
   };

   // logging and batch loop
   const logger = console;
   logger.info('Backtest start', { symbol: symbol ?? 'UNKNOWN', bt });

   const outputs: any[] = [];

   const auxSeries: Record<string, OHLCV[]> = {};
   for (const tfStr of tfList) {
      const tf = tfStr as Timeframe;
      const tfCsv = `tests/data/${symbol}-${tf}.csv`;
      const tfPath = path.resolve(tfCsv);
      const targetSeries = loadCsvOHLCV(tfPath, { symbol: symbol, expectHeader: true, columns: { time: 'time', open: 'open', high: 'high', low: 'low', close: 'close', volume: 'volume' } });
      auxSeries[tf] = targetSeries;
   }

   for (const tf of tfList) {
      const rows: any[] = [];
      const targetSeries = auxSeries[tf] ?? [];

      const atrLen = bt.atrLen ?? 14;
      const series: OHLCV[] = auxSeries[tf] ?? [];
      const atrArr = computeATR(series, atrLen);
      for (const smaP of gridParams.gridSma) {
         for (const stopP of gridParams.gridStop) {
            for (const bw of gridParams.gridMinBw) {
               for (const bbLen of gridParams.gridBbLen) {
                  for (const bbStd of gridParams.gridBbStd) {
                     for (const qty of gridParams.gridQty) {
                        for (const fee of gridParams.gridFee) {
                           for (const slip of gridParams.gridSlip) {
                              for (const trail of gridParams.gridTrail) {
                                 const localStrat = { ...stratCfg, smaPeriod: smaP, minBollingerBandwidth: Number.isNaN(bw) ? undefined : bw, bollingerLength: bbLen, bollingerStdMultiplier: bbStd };
                                 const localBt = { ...bt, tradeQty: qty, feePct: fee, slippagePct: slip, lossLimitPct: Number.isNaN(stopP) ? undefined : stopP, trailingProfitPct: Number.isNaN(trail) ? undefined : trail };
                                 let startTime = Date.now();
                                 const result = runBacktest(tf, auxSeries, localStrat, localBt, atrArr);
                                 console.log(`runBacktest cost: ${Date.now() - startTime}ms`);
                                 const tfMs = tfToMs(tf as Timeframe);
                                 const metrics = computeMetrics(result.equityCurve, result.trades, localBt.initialEquity, tfMs);
                                 console.log(`Running ${tf} ${smaP} ${stopP} ${bw} ${bbLen} ${bbStd} ${qty} ${fee} ${slip} ${trail}`, metrics);

                                 rows.push({
                                    tf,
                                    smaPeriod: smaP,
                                    bollingerLength: bbLen,
                                    bollingerStdMultiplier: bbStd,
                                    minBollingerBandwidth: Number.isNaN(bw) ? null : bw,
                                    lossLimitPct: Number.isNaN(stopP) ? null : stopP,
                                    trailingProfitPct: Number.isNaN(trail) ? null : trail,
                                    qty,
                                    feePct: fee,
                                    slippagePct: slip,
                                    points: targetSeries.length,
                                    totalReturn: metrics.totalReturn,
                                    annualizedReturn: metrics.annualizedReturn,
                                    maxDrawdown: metrics.maxDrawdown,
                                    sharpe: metrics.sharpe,
                                    volatility: metrics.volatility,
                                    winRate: metrics.winRate,
                                    avgPnL: metrics.avgPnL,
                                    avgWin: metrics.avgWin,
                                    avgLoss: metrics.avgLoss,
                                    exposurePct: metrics.exposurePct,
                                    trades: metrics.trades,
                                 });
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      }

      const pick = (crit: string | undefined) => {
         const bySharpe = [...rows].sort((a, b) => {
            if (b.sharpe !== a.sharpe) { return b.sharpe - a.sharpe; }
            if (b.totalReturn !== a.totalReturn) { return b.totalReturn - a.totalReturn; }
            return a.maxDrawdown - b.maxDrawdown;
         })[0];
         if (!crit || crit.toLowerCase() === 'sharpe') { return bySharpe; }
         if (crit.toLowerCase() === 'maxret') {
            return [...rows].sort((a, b) => {
               if (b.totalReturn !== a.totalReturn) { return b.totalReturn - a.totalReturn; }
               if (b.sharpe !== a.sharpe) { return b.sharpe - a.sharpe; }
               return a.maxDrawdown - b.maxDrawdown;
            })[0];
         }
         if (crit.toLowerCase() === 'mindd') {
            return [...rows].sort((a, b) => {
               if (a.maxDrawdown !== b.maxDrawdown) { return a.maxDrawdown - b.maxDrawdown; }
               if (b.sharpe !== a.sharpe) { return b.sharpe - a.sharpe; }
               return b.totalReturn - a.totalReturn;
            })[0];
         }
         return bySharpe;
      };
      const best = rows.length ? pick(bestCrit) : null;
      outputs.push({ tf, rows: rows.length, best });
   }

   logger.info('Backtest end');

   // final aggregation to stdout
   console.table(outputs);
}

if (require.main === module) {
   main();
}
