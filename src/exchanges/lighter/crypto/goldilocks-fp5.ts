import { Fp, GOLDILOCKS_MODULUS, addMany, powers as fpPowers } from "./goldilocks";

export type Fp5Tuple = [Fp, Fp, Fp, Fp, Fp];

function expectLength(bytes: Uint8Array, expected: number): void {
  if (bytes.length !== expected) {
    throw new Error(`Expected ${expected} bytes, got ${bytes.length}`);
  }
}

const BYTE_LENGTH = 5 * 8;

export const FP5_W = new Fp(3n);
export const FP5_DTH_ROOT = new Fp(1041288259238279555n);
const THREE = new Fp(3n);

export class Fp5 {
  readonly c0: Fp;
  readonly c1: Fp;
  readonly c2: Fp;
  readonly c3: Fp;
  readonly c4: Fp;

  constructor(coeffs: Fp5Tuple) {
    [this.c0, this.c1, this.c2, this.c3, this.c4] = coeffs;
  }

  static ZERO = new Fp5([Fp.ZERO, Fp.ZERO, Fp.ZERO, Fp.ZERO, Fp.ZERO]);
  static ONE = new Fp5([Fp.ONE, Fp.ZERO, Fp.ZERO, Fp.ZERO, Fp.ZERO]);

  static fromFp(value: Fp): Fp5 {
    return new Fp5([value.clone(), Fp.ZERO, Fp.ZERO, Fp.ZERO, Fp.ZERO]);
  }

  static fromUint64Array(values: ArrayLike<bigint | number>): Fp5 {
    if (values.length !== 5) {
      throw new Error("Fp5.fromUint64Array expects 5 values");
    }
    const get = (index: number): bigint | number => {
      const value = values[index];
      if (value === undefined) {
        throw new Error("Fp5.fromUint64Array missing value");
      }
      return value;
    };
    const arr: [bigint | number, bigint | number, bigint | number, bigint | number, bigint | number] = [
      get(0),
      get(1),
      get(2),
      get(3),
      get(4),
    ];
    return new Fp5([
      new Fp(arr[0]),
      new Fp(arr[1]),
      new Fp(arr[2]),
      new Fp(arr[3]),
      new Fp(arr[4]),
    ]);
  }

  toTuple(): Fp5Tuple {
    return [this.c0, this.c1, this.c2, this.c3, this.c4];
  }

  toBytes(): Uint8Array {
    const out = new Uint8Array(BYTE_LENGTH);
    out.set(this.c0.toBytesLE(), 0);
    out.set(this.c1.toBytesLE(), 8);
    out.set(this.c2.toBytesLE(), 16);
    out.set(this.c3.toBytesLE(), 24);
    out.set(this.c4.toBytesLE(), 32);
    return out;
  }

  static fromBytes(bytes: Uint8Array): Fp5 {
    expectLength(bytes, BYTE_LENGTH);
    return new Fp5([
      Fp.fromBytesLE(bytes.subarray(0, 8)),
      Fp.fromBytesLE(bytes.subarray(8, 16)),
      Fp.fromBytesLE(bytes.subarray(16, 24)),
      Fp.fromBytesLE(bytes.subarray(24, 32)),
      Fp.fromBytesLE(bytes.subarray(32, 40)),
    ]);
  }

  equals(other: Fp5): boolean {
    return (
      this.c0.equals(other.c0) &&
      this.c1.equals(other.c1) &&
      this.c2.equals(other.c2) &&
      this.c3.equals(other.c3) &&
      this.c4.equals(other.c4)
    );
  }

  isZero(): boolean {
    return this.equals(Fp5.ZERO);
  }

  clone(): Fp5 {
    return new Fp5([
      this.c0.clone(),
      this.c1.clone(),
      this.c2.clone(),
      this.c3.clone(),
      this.c4.clone(),
    ]);
  }

  add(other: Fp5): Fp5 {
    return new Fp5([
      this.c0.add(other.c0),
      this.c1.add(other.c1),
      this.c2.add(other.c2),
      this.c3.add(other.c3),
      this.c4.add(other.c4),
    ]);
  }

  sub(other: Fp5): Fp5 {
    return new Fp5([
      this.c0.sub(other.c0),
      this.c1.sub(other.c1),
      this.c2.sub(other.c2),
      this.c3.sub(other.c3),
      this.c4.sub(other.c4),
    ]);
  }

  neg(): Fp5 {
    return new Fp5([
      this.c0.neg(),
      this.c1.neg(),
      this.c2.neg(),
      this.c3.neg(),
      this.c4.neg(),
    ]);
  }

  mul(other: Fp5): Fp5 {
    const w = FP5_W;

    const a0b0 = this.c0.mul(other.c0);
    const a1b4 = this.c1.mul(other.c4);
    const a2b3 = this.c2.mul(other.c3);
    const a3b2 = this.c3.mul(other.c2);
    const a4b1 = this.c4.mul(other.c1);
    const added0 = addMany([a1b4, a2b3, a3b2, a4b1]);
    const muld0 = added0.mul(w);
    const c0 = a0b0.add(muld0);

    const a0b1 = this.c0.mul(other.c1);
    const a1b0 = this.c1.mul(other.c0);
    const a2b4 = this.c2.mul(other.c4);
    const a3b3 = this.c3.mul(other.c3);
    const a4b2 = this.c4.mul(other.c2);
    const added1 = addMany([a2b4, a3b3, a4b2]);
    const muld1 = added1.mul(w);
    const c1 = addMany([a0b1, a1b0, muld1]);

    const a0b2 = this.c0.mul(other.c2);
    const a1b1 = this.c1.mul(other.c1);
    const a2b0 = this.c2.mul(other.c0);
    const a3b4 = this.c3.mul(other.c4);
    const a4b3 = this.c4.mul(other.c3);
    const added2 = addMany([a3b4, a4b3]);
    const muld2 = added2.mul(w);
    const c2 = addMany([a0b2, a1b1, a2b0, muld2]);

    const a0b3 = this.c0.mul(other.c3);
    const a1b2 = this.c1.mul(other.c2);
    const a2b1 = this.c2.mul(other.c1);
    const a3b0 = this.c3.mul(other.c0);
    const a4b4 = this.c4.mul(other.c4);
    const muld3 = a4b4.mul(w);
    const c3 = addMany([a0b3, a1b2, a2b1, a3b0, muld3]);

    const a0b4 = this.c0.mul(other.c4);
    const a1b3 = this.c1.mul(other.c3);
    const a2b2 = this.c2.mul(other.c2);
    const a3b1 = this.c3.mul(other.c1);
    const a4b0 = this.c4.mul(other.c0);
    const c4 = addMany([a0b4, a1b3, a2b2, a3b1, a4b0]);

    return new Fp5([c0, c1, c2, c3, c4]);
  }

  square(): Fp5 {
    const w = FP5_W;
    const doubleW = FP5_W.add(FP5_W);

    const a0s = this.c0.mul(this.c0);
    const a1a4 = this.c1.mul(this.c4);
    const a2a3 = this.c2.mul(this.c3);
    const added0 = addMany([a1a4, a2a3]);
    const muld0 = added0.mul(doubleW);
    const c0 = a0s.add(muld0);

    const a0Double = this.c0.add(this.c0);
    const a0Doublea1 = a0Double.mul(this.c1);
    const a2a4DoubleW = this.c2.mul(this.c4).mul(doubleW);
    const a3a3w = this.c3.mul(this.c3).mul(w);
    const c1 = addMany([a0Doublea1, a2a4DoubleW, a3a3w]);

    const a0Doublea2 = a0Double.mul(this.c2);
    const a1Square = this.c1.mul(this.c1);
    const a4a3DoubleW = this.c4.mul(this.c3).mul(doubleW);
    const c2 = addMany([a0Doublea2, a1Square, a4a3DoubleW]);

    const a1Double = this.c1.add(this.c1);
    const a0Doublea3 = a0Double.mul(this.c3);
    const a1Doublea2 = a1Double.mul(this.c2);
    const a4SquareW = this.c4.mul(this.c4).mul(w);
    const c3 = addMany([a0Doublea3, a1Doublea2, a4SquareW]);

    const a0Doublea4 = a0Double.mul(this.c4);
    const a1Doublea3 = a1Double.mul(this.c3);
    const a2Square = this.c2.mul(this.c2);
    const c4 = addMany([a0Doublea4, a1Doublea3, a2Square]);

    return new Fp5([c0, c1, c2, c3, c4]);
  }

  expPowerOf2(power: number): Fp5 {
    let result = this.clone();
    for (let i = 0; i < power; i++) {
      result = result.square();
    }
    return result;
  }

  double(): Fp5 {
    return this.add(this);
  }

  triple(): Fp5 {
    return new Fp5([
      this.c0.mul(THREE),
      this.c1.mul(THREE),
      this.c2.mul(THREE),
      this.c3.mul(THREE),
      this.c4.mul(THREE),
    ]);
  }

  scalarMul(scalar: Fp): Fp5 {
    return new Fp5([
      this.c0.mul(scalar),
      this.c1.mul(scalar),
      this.c2.mul(scalar),
      this.c3.mul(scalar),
      this.c4.mul(scalar),
    ]);
  }

  inverseOrZero(): Fp5 {
    if (this.isZero()) return Fp5.ZERO;

    const d = this.frobenius();
    const e = this.mul(d.frobenius());
    const f = e.mul(e.repeatedFrobenius(2));

    const a0b0 = this.c0.mul(f.c0);
    const a1b4 = this.c1.mul(f.c4);
    const a2b3 = this.c2.mul(f.c3);
    const a3b2 = this.c3.mul(f.c2);
    const a4b1 = this.c4.mul(f.c1);
    const added = addMany([a1b4, a2b3, a3b2, a4b1]);
    const muld = added.mul(FP5_W);
    const g = a0b0.add(muld);

    const gInv = g.inverse();
    return f.scalarMul(gInv);
  }

  div(other: Fp5): Fp5 {
    const inv = other.inverseOrZero();
    if (inv.isZero()) {
      throw new Error("Division by zero in Fp5");
    }
    return this.mul(inv);
  }

  frobenius(): Fp5 {
    return this.repeatedFrobenius(1);
  }

  repeatedFrobenius(count: number): Fp5 {
    if (count === 0) return this;
    const reduced = count % 5;
    if (reduced === 0) return this;

    let z0 = FP5_DTH_ROOT;
    for (let i = 1; i < reduced; i++) {
      z0 = z0.mul(FP5_DTH_ROOT);
    }

    const powerArray = fpPowers(z0, 5) as [Fp, Fp, Fp, Fp, Fp];
    const [p0, p1, p2, p3, p4] = powerArray;
    return new Fp5([
      this.c0.mul(p0),
      this.c1.mul(p1),
      this.c2.mul(p2),
      this.c3.mul(p3),
      this.c4.mul(p4),
    ]);
  }

  legendre(): Fp {
    const frob1 = this.frobenius();
    const frob2 = frob1.frobenius();
    const frob1TimesFrob2 = frob1.mul(frob2);
    const frob2Frob1TimesFrob2 = frob1TimesFrob2.repeatedFrobenius(2);
    const xrExt = this.mul(frob1TimesFrob2).mul(frob2Frob1TimesFrob2);
    const xr = new Fp(xrExt.c0.toBigInt());
    const xr31 = xr.pow(1n << 31n);
    const xr31Inv = xr31.isZero() ? Fp.ZERO : xr31.inverse();
    const xr63 = xr31.pow(1n << 32n);
    return xr63.mul(xr31Inv);
  }

  sqrt(): { value: Fp5; exists: boolean } {
    const v = this.expPowerOf2(31);
    const d = this.mul(v.expPowerOf2(32)).mul(v.inverseOrZero());
    const e = d.mul(d.repeatedFrobenius(2)).frobenius();
    const f = e.square();

    const x1f4 = this.c1.mul(f.c4);
    const x2f3 = this.c2.mul(f.c3);
    const x3f2 = this.c3.mul(f.c2);
    const x4f1 = this.c4.mul(f.c1);
    const added = addMany([x1f4, x2f3, x3f2, x4f1]);
    const muld = added.mul(THREE);
    const x0f0 = this.c0.mul(f.c0);
    const g = x0f0.add(muld);
    const s = sqrtFp(g);
    if (!s) {
      return { value: Fp5.ZERO, exists: false };
    }
    const eInv = e.inverseOrZero();
    const sFp5 = Fp5.fromFp(s);
    return { value: sFp5.mul(eInv), exists: true };
  }

  canonicalSqrt(): { value: Fp5; exists: boolean } {
    const { value, exists } = this.sqrt();
    if (!exists) return { value: Fp5.ZERO, exists: false };
    return { value: sgn0(value) ? value.neg() : value, exists: true };
  }
}

function sgn0(x: Fp5): boolean {
  let sign = false;
  let zero = true;
  for (const limb of [x.c0, x.c1, x.c2, x.c3, x.c4]) {
    const limbSign = (limb.toBigInt() & 1n) === 0n;
    const limbZero = limb.isZero();
    sign = sign || (zero && limbSign);
    zero = zero && limbZero;
  }
  return sign;
}

function sqrtFp(value: Fp): Fp | null {
  if (value.isZero()) return Fp.ZERO;
  const p = GOLDILOCKS_MODULUS;
  const leg = value.pow((p - 1n) / 2n);
  if (leg.isZero()) return Fp.ZERO;
  const legVal = leg.toBigInt();
  if (legVal === p - 1n) return null;

  let q = p - 1n;
  let s = 0n;
  while ((q & 1n) === 0n) {
    q >>= 1n;
    s += 1n;
  }

  let z = 2n;
  while (true) {
    const zLeg = new Fp(z).pow((p - 1n) / 2n).toBigInt();
    if (zLeg === p - 1n) break;
    z += 1n;
  }

  let c = new Fp(z).pow(q);
  let x = value.pow((q + 1n) >> 1n);
  let t = value.pow(q);
  let m = s;

  while (t.toBigInt() !== 1n) {
    let i = 1n;
    let t2i = t.mul(t);
    while (t2i.toBigInt() !== 1n) {
      t2i = t2i.mul(t2i);
      i += 1n;
      if (i === m) return null;
    }
    const b = c.pow(1n << (m - i - 1n));
    x = x.mul(b);
    c = b.mul(b);
    t = t.mul(c);
    m = i;
  }

  return x;
}

export const FP5_ZERO = Fp5.ZERO;
export const FP5_ONE = Fp5.ONE;
export const FP5_TWO = Fp5.fromFp(new Fp(2n));

export function fp5Add(a: Fp5, ...others: Fp5[]): Fp5 {
  let acc = a;
  for (const other of others) {
    acc = acc.add(other);
  }
  return acc;
}

export function fp5Sub(a: Fp5, b: Fp5): Fp5 {
  return a.sub(b);
}

export function fp5Mul(a: Fp5, b: Fp5): Fp5 {
  return a.mul(b);
}

export function fp5Square(a: Fp5): Fp5 {
  return a.square();
}

export function fp5Double(a: Fp5): Fp5 {
  return a.double();
}

export function fp5ScalarMul(a: Fp5, scalar: Fp): Fp5 {
  return a.scalarMul(scalar);
}

export function fp5InverseOrZero(a: Fp5): Fp5 {
  return a.inverseOrZero();
}

export function fp5Frobenius(a: Fp5): Fp5 {
  return a.frobenius();
}

export function fp5RepeatedFrobenius(a: Fp5, count: number): Fp5 {
  return a.repeatedFrobenius(count);
}

export function fp5Legendre(a: Fp5): Fp {
  return a.legendre();
}

export function fp5CanonicalSqrt(a: Fp5): { value: Fp5; exists: boolean } {
  return a.canonicalSqrt();
}
