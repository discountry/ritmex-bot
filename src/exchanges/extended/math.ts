import BigNumber from "bignumber.js";

export const Decimal = BigNumber;
export type Decimal = BigNumber;
export type Long = BigNumber;
export type RoundingMode = BigNumber.RoundingMode;

export function toDecimal(value: string | number | BigNumber): Decimal {
  return new Decimal(value);
}

export function toLong(value: string | number | BigNumber): Long {
  return new Decimal(value);
}

export function roundToStep(value: Decimal, step: Decimal, mode: RoundingMode = Decimal.ROUND_DOWN): Decimal {
  if (step.lte(0)) return value;
  return value
    .div(step)
    .decimalPlaces(0, mode)
    .times(step)
    .decimalPlaces(step.decimalPlaces());
}

export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
