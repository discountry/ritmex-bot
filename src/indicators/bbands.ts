export interface BollingerBands {
   middle: number;
   upper: number;
   lower: number;
}

export function bollinger(values: number[], length: number, stdMult: number): (BollingerBands | null)[] {
   if (length <= 0) { throw new Error('Bollinger length must be > 0'); }
   const out: (BollingerBands | null)[] = new Array(values.length).fill(null);
   let sum = 0;
   let sumSq = 0;
   for (let i = 0; i < values.length; i++) {
      const v = values[i]!;
      sum += v;
      sumSq += v * v;
      if (i >= length) {
         const old = values[i - length]!;
         sum -= old;
         sumSq -= old * old;
      }
      if (i >= length - 1) {
         const mean = sum / length;
         const variance = Math.max(0, sumSq / length - mean * mean);
         const std = Math.sqrt(variance);
         const upper = mean + stdMult * std;
         const lower = mean - stdMult * std;
         out[i] = { middle: mean, upper, lower };
      }
   }
   return out;
}

export function lastBandwidth(values: number[], length: number, stdMult: number): number | null {
   const arr = bollinger(values, length, stdMult);
   const last = arr.length ? arr[arr.length - 1] : null;
   if (!last) { return null; }
   const width = last.upper - last.lower;
   return last.middle !== 0 ? width / Math.abs(last.middle) : width;
}
