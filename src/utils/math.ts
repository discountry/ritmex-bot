const MAX_SCALE_DECIMALS = 12;
const STEP_TOLERANCE = 1e-9;

function resolveStepScale(step: number): { scale: number; stepInt: number; decimals: number } {
  if (!Number.isFinite(step) || step <= 0) {
    return { scale: 1, stepInt: 1, decimals: 0 };
  }
  let decimals = Math.min(MAX_SCALE_DECIMALS, Math.max(0, decimalsOf(step)));
  let scale = Math.pow(10, decimals);
  let scaledStep = step * scale;
  while (decimals < MAX_SCALE_DECIMALS && Math.abs(Math.round(scaledStep) - scaledStep) > STEP_TOLERANCE) {
    decimals += 1;
    scale *= 10;
    scaledStep = step * scale;
  }
  const stepInt = Math.max(1, Math.round(scaledStep));
  return { scale, stepInt, decimals };
}

export function roundDownToTick(value: number, tick: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(tick) || tick <= 0) return value;
  const sign = value < 0 ? -1 : 1;
  const absValue = Math.abs(value);
  const { scale, stepInt, decimals } = resolveStepScale(tick);
  const scaledValue = Math.floor(absValue * scale + STEP_TOLERANCE);
  const resultInt = Math.floor(scaledValue / stepInt) * stepInt;
  const rounded = resultInt / scale;
  return sign * Number(rounded.toFixed(decimals));
}

export function roundQtyDownToStep(value: number, step: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
  const sign = value < 0 ? -1 : 1;
  const absValue = Math.abs(value);
  const { scale, stepInt, decimals } = resolveStepScale(step);
  const scaledValue = Math.floor(absValue * scale + STEP_TOLERANCE);
  const resultInt = Math.floor(scaledValue / stepInt) * stepInt;
  const rounded = resultInt / scale;
  return sign * Number(rounded.toFixed(decimals));
}

export function decimalsOf(step: number): number {
  if (!Number.isFinite(step)) return 0;
  if (Number.isInteger(step)) return 0;
  let decimals = 0;
  let scaled = step;
  while (decimals < MAX_SCALE_DECIMALS && Math.abs(Math.round(scaled) - scaled) > STEP_TOLERANCE) {
    scaled *= 10;
    decimals += 1;
  }
  return decimals;
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
  if (!Number.isFinite(price)) return "0";
  return price.toFixed(decimals);
}
