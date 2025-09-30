import { randomBytes } from "crypto";
import { Fp } from "./goldilocks";
import { Fp5 } from "./goldilocks-fp5";

const ORDER = BigInt("1067993516717146951041484916571792702745057740581727230159139685185762082554198619328292418486241");
const BYTE_LENGTH = 40;
const FOUR_BIT_LIMBS = 80;
const BIT_LENGTH = 319;

function modOrder(value: bigint): bigint {
  let v = value % ORDER;
  if (v < 0n) v += ORDER;
  return v;
}

export class Scalar {
  readonly value: bigint;

  constructor(value: bigint | number) {
    this.value = modOrder(typeof value === "number" ? BigInt(value) : value);
  }

  static readonly ZERO = new Scalar(0n);
  static readonly ONE = new Scalar(1n);

  static fromBytesLE(bytes: Uint8Array): Scalar {
    if (bytes.length !== BYTE_LENGTH) {
      throw new Error(`Scalar expects ${BYTE_LENGTH} bytes, got ${bytes.length}`);
    }
    let acc = 0n;
    for (let i = 0; i < BYTE_LENGTH; i++) {
      const byte = bytes[i];
      if (byte === undefined) throw new Error("Unexpected undefined byte when reading scalar");
      acc |= BigInt(byte) << BigInt(8 * i);
    }
    return new Scalar(acc);
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

  add(other: Scalar): Scalar {
    return new Scalar(this.value + other.value);
  }

  sub(other: Scalar): Scalar {
    return new Scalar(this.value - other.value);
  }

  neg(): Scalar {
    return new Scalar(this.value === 0n ? 0n : ORDER - this.value);
  }

  mul(other: Scalar): Scalar {
    return new Scalar(this.value * other.value);
  }

  square(): Scalar {
    return this.mul(this);
  }

  pow(exponent: bigint): Scalar {
    let result = 1n;
    let base = this.value;
    let exp = exponent;
    while (exp > 0n) {
      if (exp & 1n) result = modOrder(result * base);
      base = modOrder(base * base);
      exp >>= 1n;
    }
    return new Scalar(result);
  }

  isZero(): boolean {
    return this.value === 0n;
  }

  equals(other: Scalar): boolean {
    return this.value === other.value;
  }

  clone(): Scalar {
    return new Scalar(this.value);
  }

  splitTo4BitLimbs(): Uint8Array {
    const limbs = new Uint8Array(FOUR_BIT_LIMBS);
    let tmp = this.value;
    for (let i = 0; i < FOUR_BIT_LIMBS; i++) {
      limbs[i] = Number(tmp & 0xfn);
      tmp >>= 4n;
    }
    return limbs;
  }

  recodeSigned(window: number): Int32Array {
    const length = Math.ceil(BIT_LENGTH / window);
    const digits = new Int32Array(length);
    const twoPowW = 1n << BigInt(window);
    const twoPowWMinus1 = 1n << BigInt(window - 1);
    let k = this.value;
    let i = 0;
    while (k > 0n && i < length) {
      if (k & 1n) {
        let remainder = Number(k % twoPowW);
        if (remainder >= Number(twoPowWMinus1)) {
          remainder -= Number(twoPowW);
        }
        digits[i] = remainder;
        k -= BigInt(remainder);
      }
      k >>= 1n;
      i++;
    }
    // remaining digits already zero
    return digits;
  }

  static random(): Scalar {
    while (true) {
      const buf = randomBytes(BYTE_LENGTH);
      let acc = 0n;
      for (let i = 0; i < BYTE_LENGTH; i++) {
        const byte = buf[i];
        if (byte === undefined) throw new Error("Unexpected undefined byte when sampling scalar");
        acc |= BigInt(byte) << BigInt(8 * i);
      }
      if (acc < ORDER) {
        return new Scalar(acc);
      }
    }
  }

  static fromFp5(element: Fp5): Scalar {
    const coeffs = element.toTuple();
    const entries = [coeffs[0], coeffs[1], coeffs[2], coeffs[3], coeffs[4]];
    let acc = 0n;
    for (let i = entries.length - 1; i >= 0; i--) {
      const limb = entries[i];
      if (!limb) throw new Error("Fp5 tuple missing limb");
      acc <<= 64n;
      acc |= limb.toBigInt();
    }
    return new Scalar(acc);
  }
}

export const SCALAR_ORDER = ORDER;
