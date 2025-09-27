export function roundDownToTick(value: number, tick: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(tick) || tick <= 0) return value;
  const scaled = Math.floor(value / tick) * tick;
  // Avoid floating residuals
  return Number(scaled.toFixed(Math.max(0, decimalsOf(tick))));
}

export function roundQtyDownToStep(value: number, step: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
  const scaled = Math.floor(value / step) * step;
  return Number(scaled.toFixed(Math.max(0, decimalsOf(step))));
}

export function decimalsOf(step: number): number {
  const s = step.toString();
  if (!s.includes(".")) return 0;
  const fraction = s.split(".")[1];
  return fraction ? fraction.length : 0;
}

export function isNearlyZero(value: number, epsilon = 1e-5): boolean {
  return Math.abs(value) < epsilon;
}
