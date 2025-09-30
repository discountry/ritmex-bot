import { Fp } from "./goldilocks";
import {
  Fp5,
  FP5_ZERO,
  FP5_ONE,
  FP5_TWO,
  FP5_W,
  fp5Add,
  fp5Mul,
  fp5ScalarMul,
  fp5Double,
  fp5InverseOrZero,
} from "./goldilocks-fp5";
import { Scalar } from "./scalar";

const B1 = 263n;
const B = Fp5.fromUint64Array([0n, B1, 0n, 0n, 0n]);
const B_MUL2 = Fp5.fromUint64Array([0n, 2n * B1, 0n, 0n, 0n]);
const B_MUL4 = Fp5.fromUint64Array([0n, 4n * B1, 0n, 0n, 0n]);
const B_MUL16 = Fp5.fromUint64Array([0n, 16n * B1, 0n, 0n, 0n]);
const A = Fp5.fromUint64Array([2n, 0n, 0n, 0n, 0n]);
const FOUR_CONST = Fp5.fromUint64Array([4n, 0n, 0n, 0n, 0n]);

export class ECPoint {
  constructor(
    readonly x: Fp5,
    readonly z: Fp5,
    readonly u: Fp5,
    readonly t: Fp5,
  ) {}

  clone(): ECPoint {
    return new ECPoint(this.x.clone(), this.z.clone(), this.u.clone(), this.t.clone());
  }

  static neutral(): ECPoint {
    return new ECPoint(FP5_ZERO, FP5_ONE, FP5_ZERO, FP5_ONE);
  }

  static generator(): ECPoint {
    return new ECPoint(
      Fp5.fromUint64Array([
        12883135586176881569n,
        4356519642755055268n,
        5248930565894896907n,
        2165973894480315022n,
        2448410071095648785n,
      ]),
      FP5_ONE,
      FP5_ONE,
      Fp5.fromUint64Array([4n, 0n, 0n, 0n, 0n]),
    );
  }

  isNeutral(): boolean {
    return this.u.equals(FP5_ZERO);
  }

  encode(): Fp5 {
    return fp5Mul(this.t, fp5InverseOrZero(this.u));
  }

  add(other: ECPoint): ECPoint {
    if (this.isNeutral()) return other.clone();
    if (other.isNeutral()) return this.clone();

    const x1 = this.x;
    const z1 = this.z;
    const u1 = this.u;
    const t1 = this.t;

    const x2 = other.x;
    const z2 = other.z;
    const u2 = other.u;
    const t2 = other.t;

    const t1_ = fp5Mul(x1, x2);
    const t2_ = fp5Mul(z1, z2);
    const t3 = fp5Mul(u1, u2);
    const t4 = fp5Mul(t1, t2);
    const t5 = fp5SubMul(fp5Add(x1, z1), fp5Add(x2, z2), fp5Add(t1_, t2_));
    const t6 = fp5SubMul(fp5Add(u1, t1), fp5Add(u2, t2), fp5Add(t3, t4));
    const t7 = fp5Add(t1_, fp5Mul(t2_, B));
    const t8 = fp5Mul(t4, t7);
    const t9 = fp5Mul(t3, fp5Add(fp5Mul(t5, B_MUL2), fp5Double(t7)));
    const t10 = fp5Mul(fp5Add(t4, fp5Double(t3)), fp5Add(t5, t7));

    const xNew = fp5Mul(fp5Sub(t10, t8), B);
    const zNew = fp5Sub(t8, t9);
    const uNew = fp5Mul(t6, fp5Sub(fp5Mul(t2_, B), t1_));
    const tNew = fp5Add(t8, t9);

    return new ECPoint(xNew, zNew, uNew, tNew);
  }

  double(): ECPoint {
    if (this.isNeutral()) return this.clone();

    const x = this.x;
    const z = this.z;
    const u = this.u;
    const t = this.t;

    const t1 = fp5Mul(z, t);
    const t2 = fp5Mul(t1, t);
    const x1 = fp5Mul(t2, t2);
    const z1 = fp5Mul(t1, u);
    const t3 = fp5Mul(u, u);
    const w1 = fp5Sub(t2, fp5Mul(fp5Double(fp5Add(x, z)), t3));
    const t4 = fp5Mul(z1, z1);

    const xNew = fp5Mul(t4, B_MUL4);
    const zNew = fp5Mul(w1, w1);
    const uNew = fp5Sub(fp5Mul(fp5Add(w1, z1), fp5Add(w1, z1)), fp5Add(t4, zNew));
    const tNew = fp5Sub(
      fp5Double(x1),
      fp5Add(fp5Mul(t4, FOUR_CONST), zNew),
    );

    return new ECPoint(xNew, zNew, uNew, tNew);
  }

  mul(scalar: Scalar): ECPoint {
    let result = ECPoint.neutral();
    let addend = this.clone();
    let k = scalar.toBigInt();
    while (k > 0n) {
      if (k & 1n) {
        result = result.add(addend);
      }
      addend = addend.double();
      k >>= 1n;
    }
    return result;
  }
}

function fp5Sub(a: Fp5, b: Fp5): Fp5 {
  return a.sub(b);
}

function fp5SubMul(a: Fp5, b: Fp5, subtract: Fp5): Fp5 {
  return fp5Mul(a, b).sub(subtract);
}
