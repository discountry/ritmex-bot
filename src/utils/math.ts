export function roundDownToTick(value: number, tick: number): number {
   if (!Number.isFinite(value) || !Number.isFinite(tick) || tick <= 0) { return value; }
   const scaled = Math.floor(value / tick) * tick;
   // Avoid floating residuals
   return Number(scaled.toFixed(Math.max(0, decimalsOf(tick))));
}

export function roundQtyDownToStep(value: number, step: number): number {
   if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) { return value; }
   const scaled = Math.floor(value / step) * step;
   return Number(scaled.toFixed(Math.max(0, decimalsOf(step))));
}

export function decimalsOf(step: number): number {
   const s = step.toString();
   if (!s.includes('.')) { return 0; }
   const fraction = s.split('.')[1];
   return fraction ? fraction.length : 0;
}

export function isNearlyZero(value: number, epsilon = 1e-5): boolean {
   return Math.abs(value) < epsilon;
}

/**
 * 将价格格式化为指定小数位数的字符串
 * @param price 原始价格
 * @param decimals 小数位数
 * @returns 格式化后的价格字符串
 */
export function formatPriceToString(price: number, decimals: number): string {
   if (!Number.isFinite(price)) { return '0'; }
   return price.toFixed(decimals);
}
