import type { OHLCV } from '../types';

/**
 * Compute ATR (Average True Range)
 * TR_t = max(high - low, |high - prevClose|, |low - prevClose|)
 * ATR = SMA(TR, period)
 */
export function computeATR(series: OHLCV[], period: number): (number | null)[] {
   const n = Math.max(1, period | 0);
   const out: (number | null)[] = new Array(series.length).fill(null);
   if (series.length === 0) { return out; }

   const tr: number[] = new Array(series.length).fill(0);
   for (let i = 0; i < series.length; i++) {
      const cur = series[i]!;
      const prevClose = i > 0 ? series[i - 1]!.close : cur.close;
      const a = cur.high - cur.low;
      const b = Math.abs(cur.high - prevClose);
      const c = Math.abs(cur.low - prevClose);
      tr[i] = Math.max(a, b, c);
   }

   let sum = 0;
   for (let i = 0; i < series.length; i++) {
      sum += tr[i]!;
      if (i >= n) { sum -= tr[i - n]!; }
      out[i] = i >= n - 1 ? sum / n : null;
   }

   return out;
}
