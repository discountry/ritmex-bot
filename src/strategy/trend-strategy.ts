import { lastBandwidth } from '../indicators/bbands';
import { lastEMA } from '../indicators/ema';
import { lastSma } from '../indicators/sma';
import type { IStrategy, OHLCV, Signal, TrendStrategyConfig } from '../types';

export class TrendStrategy implements IStrategy<TrendStrategyConfig> {
   private cfg!: TrendStrategyConfig;
   private lastPrice: number | null = null;

   init(config: TrendStrategyConfig): void {
      this.cfg = config;
      this.lastPrice = null;
   }

   next(bar: OHLCV, series: OHLCV[], ctx?: any): Signal {
      const closes = series.map((r) => r.close);
      const smaVal = lastSma(closes, this.cfg.smaPeriod);
      const bandwidth = lastBandwidth(closes, this.cfg.bollingerLength, this.cfg.bollingerStdMultiplier);
      const price = bar.close;

      // 布林带宽度过滤
      if (bandwidth !== null && this.cfg.minBollingerBandwidth && this.cfg.minBollingerBandwidth !== null && bandwidth < this.cfg.minBollingerBandwidth) {
         this.lastPrice = price;
         return { action: 'HOLD', reason: 'Band too narrow', price, sma: smaVal, bandwidth };
      }

      let action: Signal['action'] = 'HOLD';
      if (this.lastPrice !== null && smaVal !== null) {
         if (this.lastPrice > smaVal && price < smaVal) { action = 'SELL'; }
         else if (this.lastPrice < smaVal && price > smaVal) { action = 'BUY'; }
      }

      // EMA trend filter (optional)
      if (action !== 'HOLD' && this.cfg.emaFastPeriod && this.cfg.emaSlowPeriod) {
         const emaFast = lastEMA(closes, this.cfg.emaFastPeriod);
         const emaSlow = lastEMA(closes, this.cfg.emaSlowPeriod);
         if (emaFast !== null && emaSlow !== null) {
            const needUp = action === 'BUY';
            const pass = needUp ? (emaFast > emaSlow) : (emaFast < emaSlow);
            if (!pass) {
               this.lastPrice = price;
               return { action: 'HOLD', reason: 'EMA trend filter blocked', price, sma: smaVal, bandwidth };
            }
         }
      }

      // multi-timeframe filter: require aux frames agree with direction
      if (action !== 'HOLD' && ctx && ctx.auxSeries && Array.isArray(this.cfg.auxTimeframes) && this.cfg.auxTimeframes.length > 0) {
         const agreeAll = this.cfg.requireAllAgree ?? true;
         const auxSmaP = ctx.auxSmaPeriod ?? this.cfg.auxSmaPeriod ?? this.cfg.smaPeriod;
         const wantUp = action === 'BUY';
         const checks: boolean[] = [];
         for (const tf of this.cfg.auxTimeframes) {
            const aux = ctx.auxSeries[tf];
            if (!aux || aux.length === 0) {
               checks.push(false);
               continue;
            }
            const auxCloses = aux.map((r: OHLCV) => r.close);
            const s = lastSma(auxCloses, auxSmaP);
            const lastAuxPrice = aux[aux.length - 1]!.close;
            if (s === null) {
               checks.push(false);
               continue;
            }
            // require aux trend alignment: price vs SMA
            checks.push(wantUp ? lastAuxPrice > s : lastAuxPrice < s);
         }
         const pass = agreeAll ? checks.every(Boolean) : checks.some(Boolean);
         if (!pass) {
            this.lastPrice = price;
            return { action: 'HOLD', reason: 'Aux TF filter blocked', price, sma: smaVal, bandwidth };
         }
      }

      this.lastPrice = price;

      if (action === 'HOLD') { return { action, price, sma: smaVal, bandwidth }; }
      return { action, reason: action === 'BUY' ? 'Cross above SMA' : 'Cross below SMA', price, sma: smaVal, bandwidth };
   }
}
