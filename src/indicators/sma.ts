export function sma(values: number[], period: number): (number | null)[] {
   if (period <= 0) { throw new Error('SMA period must be > 0'); }
   const out: (number | null)[] = new Array(values.length).fill(null);
   let sum = 0;
   for (let i = 0; i < values.length; i++) {
      const v = values[i]!;
      sum += v;
      if (i >= period) { sum -= values[i - period]!; }
      if (i >= period - 1) { out[i] = sum / period; }
   }
   return out;
}

export function lastSma(values: number[], period: number): number | null {
   const arr = sma(values, period);
   const last = arr.length ? arr[arr.length - 1] : null;
   return last ?? null;
}
