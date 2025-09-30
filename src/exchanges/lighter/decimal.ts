function normalizeDecimalInput(value: number | string | bigint): { sign: 1 | -1; digits: string; fractionLength: number } {
  if (typeof value === "bigint") {
    const sign = value < 0n ? -1 : 1;
    const digits = (sign === -1 ? -value : value).toString();
    return { sign, digits, fractionLength: 0 };
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Invalid decimal input: ${value}`);
    }
    value = value.toString();
  }
  const trimmed = value.trim();
  if (!trimmed.length) throw new Error("Decimal input cannot be empty");
  const sign: 1 | -1 = trimmed[0] === "-" ? -1 : 1;
  const unsigned = sign === -1 ? trimmed.slice(1) : trimmed;
  if (!/^\d*(?:\.\d*)?$/.test(unsigned)) {
    throw new Error(`Invalid decimal format: ${value}`);
  }
  if (unsigned === "" || unsigned === ".") {
    return { sign: 1, digits: "0", fractionLength: 0 };
  }
  const parts = unsigned.split(".");
  const integerPartRaw = parts[0] ?? "";
  const fractionRaw = parts[1] ?? "";
  const integerPart = integerPartRaw.replace(/^0+(?=\d)/, "");
  const fractionPart = fractionRaw.replace(/0+$/, "");
  if (!integerPart && !fractionPart) {
    return { sign: 1, digits: "0", fractionLength: 0 };
  }
  const digits = `${integerPart || "0"}${fractionPart}`;
  return { sign, digits, fractionLength: fractionPart.length };
}

export function decimalToScaled(value: number | string | bigint, decimals: number): bigint {
  if (decimals < 0) throw new Error("Decimals must be non-negative");
  const { sign, digits, fractionLength } = normalizeDecimalInput(value);
  if (fractionLength > decimals) {
    const trimLength = fractionLength - decimals;
    const truncated = digits.slice(0, digits.length - trimLength) || "0";
    const result = BigInt(truncated);
    return sign === -1 ? -result : result;
  }
  const padded = digits.padEnd(digits.length + (decimals - fractionLength), "0");
  const result = BigInt(padded);
  return sign === -1 ? -result : result;
}

export function scaledToDecimalString(value: bigint | number | string, decimals: number): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`Invalid scaled number: ${value}`);
    value = BigInt(Math.trunc(value));
  } else if (typeof value === "string") {
    if (!/^[-]?\d+$/.test(value.trim())) {
      throw new Error(`Invalid scaled string: ${value}`);
    }
    value = BigInt(value.trim());
  }
  const negative = value < 0n;
  let abs = negative ? -value : value;
  let digits = abs.toString();
  if (decimals === 0) {
    return negative ? `-${digits}` : digits;
  }
  if (digits.length <= decimals) {
    digits = digits.padStart(decimals + 1, "0");
  }
  const splitIndex = digits.length - decimals;
  const integerPart = digits.slice(0, splitIndex) || "0";
  const fractionPart = digits.slice(splitIndex);
  const result = `${integerPart}.${fractionPart}`.replace(/\.0+$/, "").replace(/\.$/, "");
  return negative ? `-${result}` : result;
}

export function clampToInt64(value: bigint): bigint {
  const max = (1n << 63n) - 1n;
  const min = -(1n << 63n);
  if (value > max || value < min) {
    throw new Error("Value exceeds int64 bounds");
  }
  return value;
}

export function toInt64(value: bigint): number {
  const bounded = clampToInt64(value);
  return Number(bounded);
}

export function safeNumberToUint32(value: number | bigint): number {
  const val = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isFinite(val) || val < 0 || val > 0xffffffff) {
    throw new Error(`Value ${value} is out of uint32 range`);
  }
  return Math.trunc(val);
}

export function toSafeNumber(value: bigint | number): number {
  const numeric = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isSafeInteger(numeric)) {
    throw new Error(`Value ${value.toString()} exceeds safe integer range`);
  }
  return numeric;
}
