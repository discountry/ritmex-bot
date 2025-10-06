/**
 * Exponential Moving Average (EMA)
 * ema[i] = alpha * price[i] + (1 - alpha) * ema[i-1], alpha = 2/(n+1)
 * Returns array of (number|null), null until enough samples (i < 0 allowed to start at first)
 */
export function computeEMA(values: number[], period: number): (number | null)[] {
   const n = Math.max(1, period | 0);
   const out: (number | null)[] = Array.from<number | null>({ length: n }).fill(null);
   if (values.length === 0) { return out; }
   const alpha = 2 / (n + 1);
   let emaPrev: number | null = null;
   for (let i = 0; i < values.length; i++) {
      const v = values[i]!;
      if (emaPrev === null) {
         emaPrev = v;
         if (i >= n - 1) { out[i] = emaPrev; }
         else { out[i] = null; }
      } else {
         const ema: number = alpha * v + (1 - alpha) * emaPrev;
         emaPrev = ema;
         out[i] = i >= n - 1 ? ema : null;
      }
   }
   return out;
}

export function lastEMA(values: number[], period: number): number | null {
   const arr = computeEMA(values, period);
   for (let i = arr.length - 1; i >= 0; i--) {
      const v = arr[i];
      if (v && v !== null) { return v; }
   }
   return null;
}
