import { randomBytes } from "crypto";

const TWO_POW_32 = 1n << 32n;
const TWO_POW_64 = 1n << 64n;
export const GOLDILOCKS_MODULUS = TWO_POW_64 - TWO_POW_32 + 1n;
const BYTE_LENGTH = 8;

function mod(value: bigint): bigint {
  let v = value % GOLDILOCKS_MODULUS;
  if (v < 0n) v += GOLDILOCKS_MODULUS;
  return v;
}

export class Fp {
  readonly value: bigint;

  constructor(value: bigint | number) {
    this.value = mod(typeof value === "number" ? BigInt(value) : value);
  }

  static readonly ZERO = new Fp(0n);
  static readonly ONE = new Fp(1n);

  static fromBytesLE(bytes: Uint8Array): Fp {
    if (bytes.length !== BYTE_LENGTH) {
      throw new Error(`Goldilocks element expects 8 bytes, got ${bytes.length}`);
    }
    let acc = 0n;
    for (let i = 0; i < BYTE_LENGTH; i++) {
      const byte = bytes[i];
      if (byte === undefined) throw new Error("Unexpected undefined byte when reading Goldilocks element");
      acc |= BigInt(byte) << BigInt(8 * i);
    }
    return new Fp(acc);
  }

  toBytesLE(): Uint8Array {
    let v = this.value;
    const out = new Uint8Array(BYTE_LENGTH);
    for (let i = 0; i < BYTE_LENGTH; i++) {
      out[i] = Number(v & 0xffn);
      v >>= 8n;
    }
    return out;
  }

  toBigInt(): bigint {
    return this.value;
  }

  toNumber(): number {
    return Number(this.value);
  }

  add(...others: Fp[]): Fp {
    let acc = this.value;
    for (const other of others) acc += other.value;
    return new Fp(acc);
  }

  sub(other: Fp): Fp {
    return new Fp(this.value - other.value);
  }

  neg(): Fp {
    return new Fp(this.value === 0n ? 0n : GOLDILOCKS_MODULUS - this.value);
  }

  mul(...others: Fp[]): Fp {
    let acc = this.value;
    for (const other of others) acc = mod(acc * other.value);
    return new Fp(acc);
  }

  square(): Fp {
    return new Fp(mod(this.value * this.value));
  }

  double(): Fp {
    return new Fp(this.value << 1n);
  }

  inverse(): Fp {
    if (this.isZero()) {
      throw new Error("Cannot invert zero in Goldilocks field");
    }
    return this.pow(GOLDILOCKS_MODULUS - 2n);
  }

  pow(exponent: bigint): Fp {
    let result = 1n;
    let base = this.value;
    let exp = exponent;
    while (exp > 0n) {
      if (exp & 1n) result = mod(result * base);
      base = mod(base * base);
      exp >>= 1n;
    }
    return new Fp(result);
  }

  isZero(): boolean {
    return this.value === 0n;
  }

  isOne(): boolean {
    return this.value === 1n;
  }

  equals(other: Fp): boolean {
    return this.value === other.value;
  }

  clone(): Fp {
    return new Fp(this.value);
  }

  static random(): Fp {
    while (true) {
      const buf = randomBytes(BYTE_LENGTH);
      let acc = 0n;
      for (let i = 0; i < BYTE_LENGTH; i++) {
        const byte = buf[i];
        if (byte === undefined) throw new Error("Unexpected undefined byte when sampling Goldilocks element");
        acc |= BigInt(byte) << BigInt(8 * i);
      }
      if (acc < GOLDILOCKS_MODULUS) {
        return new Fp(acc);
      }
    }
  }

  static fromUint32(value: number): Fp {
    return new Fp(BigInt(value >>> 0));
  }

  static fromUint64(value: bigint | number): Fp {
    return new Fp(value);
  }
}

export function addMany(elements: readonly Fp[]): Fp {
  let acc = 0n;
  for (const el of elements) acc += el.value;
  return new Fp(acc);
}

export function arrayToBytesLE(elements: readonly Fp[]): Uint8Array {
  const out = new Uint8Array(elements.length * BYTE_LENGTH);
  elements.forEach((elem, idx) => {
    out.set(elem.toBytesLE(), idx * BYTE_LENGTH);
  });
  return out;
}

export function arrayFromBytesLE(bytes: Uint8Array): Fp[] {
  if (bytes.length % BYTE_LENGTH !== 0) {
    throw new Error("Goldilocks array bytes length must be multiple of 8");
  }
  const out: Fp[] = [];
  for (let i = 0; i < bytes.length; i += BYTE_LENGTH) {
    out.push(Fp.fromBytesLE(bytes.subarray(i, i + BYTE_LENGTH)));
  }
  return out;
}

export function powers(base: Fp, count: number): Fp[] {
  if (count <= 0) return [];
  const result = new Array<Fp>(count);
  result[0] = Fp.ONE;
  for (let i = 1; i < count; i++) {
    const prev = result[i - 1];
    if (!prev) throw new Error("unexpected undefined in goldilocks powers");
    result[i] = prev.mul(base);
  }
  return result;
}

export const GOLDILOCKS_BYTE_LENGTH = BYTE_LENGTH;
