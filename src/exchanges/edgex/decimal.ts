import { strict as assert } from "assert";

export function countBase10Scale(resolution: bigint): number {
  let scale = 0;
  let value = resolution;
  while (value % 10n === 0n) {
    value /= 10n;
    scale += 1;
  }
  if (value !== 1n) {
    throw new Error(`Resolution ${resolution.toString()} is not a power of 10`);
  }
  return scale;
}

export function decimalToBigInt(value: number | string, scale: number): bigint {
  const normalized = normalizeDecimal(typeof value === "number" ? value.toString() : value);
  const [intPart, fracPart = ""] = normalized.split(".");
  assert(fracPart.length <= scale, `Value ${value} exceeds scale ${scale}`);
  const paddedFraction = (fracPart + "0".repeat(scale)).slice(0, scale);
  const digits = stripLeadingZeros(intPart + paddedFraction);
  return digits.length === 0 ? 0n : BigInt(digits);
}

export function bigIntToDecimal(value: bigint, scale: number): string {
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const factor = 10n ** BigInt(scale);
  const intPart = abs / factor;
  const fracPart = abs % factor;
  if (scale === 0) {
    return `${negative ? "-" : ""}${intPart.toString()}`;
  }
  const fracStr = fracPart.toString().padStart(scale, "0").replace(/0+$/, "");
  if (fracStr.length === 0) {
    return `${negative ? "-" : ""}${intPart.toString()}`;
  }
  return `${negative ? "-" : ""}${intPart.toString()}.${fracStr}`;
}

export function multiplyByDecimal(value: bigint, rate: string, roundUp = false): bigint {
  const { numerator, denominator } = decimalToFraction(rate);
  const product = value * numerator;
  if (!roundUp) {
    return product / denominator;
  }
  return (product + denominator - 1n) / denominator;
}

export function decimalToFraction(value: string): { numerator: bigint; denominator: bigint } {
  const normalized = normalizeDecimal(value);
  if (!normalized.includes(".")) {
    return { numerator: BigInt(normalized), denominator: 1n };
  }
  const negative = normalized.startsWith("-");
  const unsigned = negative ? normalized.slice(1) : normalized;
  const parts = unsigned.split(".");
  const intPart = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";
  const denominator = 10n ** BigInt(fracPart.length);
  const magnitude = BigInt(stripLeadingZeros(intPart + fracPart));
  const numerator = negative ? -magnitude : magnitude;
  return { numerator, denominator };
}

export function getScaleFromDenominator(denominator: bigint): number {
  let scale = 0;
  let value = denominator;
  while (value > 1n) {
    if (value % 10n !== 0n) {
      throw new Error(`Denominator ${denominator.toString()} is not a power of 10`);
    }
    value /= 10n;
    scale += 1;
  }
  return scale;
}

export function formatDecimal(numerator: bigint, scale: number): string {
  const negative = numerator < 0n;
  let absValue = negative ? -numerator : numerator;
  if (scale === 0) {
    return `${negative ? "-" : ""}${absValue.toString()}`;
  }
  const factor = 10n ** BigInt(scale);
  const intPart = absValue / factor;
  let fracPart = (absValue % factor).toString().padStart(scale, "0");
  fracPart = fracPart.replace(/0+$/, "");
  if (fracPart.length === 0) {
    return `${negative ? "-" : ""}${intPart.toString()}`;
  }
  return `${negative ? "-" : ""}${intPart.toString()}.${fracPart}`;
}

function normalizeDecimal(input: string): string {
  const trimmed = input.trim();
  if (!/^[-+]?((\d+\.?\d*)|(\.\d+))$/.test(trimmed)) {
    throw new Error(`Invalid decimal value: ${input}`);
  }
  const negative = trimmed.startsWith("-");
  const unsigned = trimmed.replace(/^[-+]/, "");
  const [rawInt = "0", rawFrac = ""] = unsigned.split(".");
  const intDigits = stripLeadingZeros(rawInt);
  const fracDigits = rawFrac.replace(/0+$/, "");
  const magnitude = fracDigits.length > 0 ? `${intDigits}.${fracDigits}` : intDigits;
  if (magnitude === "0") {
    return "0";
  }
  return negative ? `-${magnitude}` : magnitude;
}

function stripLeadingZeros(value: string): string {
  const stripped = value.replace(/^0+/, "");
  return stripped.length === 0 ? "0" : stripped;
}
