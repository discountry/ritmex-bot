import { randomBytes } from "crypto";
import { Fp } from "./goldilocks";
import { Fp5 } from "./goldilocks-fp5";
import { hashToQuinticExtension } from "./poseidon2";
import { Scalar } from "./scalar";
import { ECPoint } from "./curve";

export interface SchnorrSignature {
  s: Scalar;
  e: Scalar;
}

export class LighterPrivateKey {
  readonly scalar: Scalar;

  constructor(scalar: Scalar) {
    this.scalar = scalar;
  }

  static fromBytes(bytes: Uint8Array): LighterPrivateKey {
    if (bytes.length !== 40) {
      throw new Error("Lighter private key must be 40 bytes");
    }
    return new LighterPrivateKey(Scalar.fromBytesLE(bytes));
  }

  static fromHex(hex: string): LighterPrivateKey {
    const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (normalized.length !== 80) {
      throw new Error("Lighter private key hex must encode 40 bytes");
    }
    const bytes = Buffer.from(normalized, "hex");
    return LighterPrivateKey.fromBytes(bytes);
  }

  toBytes(): Uint8Array {
    return this.scalar.toBytesLE();
  }

  publicKey(): Fp5 {
    const point = ECPoint.generator().mul(this.scalar);
    return point.encode();
  }

  signHashedMessage(hashed: Fp5): SchnorrSignature {
    const k = Scalar.random();
    const rPoint = ECPoint.generator().mul(k);
    const rEncoded = rPoint.encode();
    const preimage: Fp[] = [...rEncoded.toTuple(), ...hashed.toTuple()];
    const hash = hashToQuinticExtension(preimage);
    const e = Scalar.fromFp5(hash);
    const s = k.sub(e.mul(this.scalar));
    return { s, e };
  }
}

export function signatureToBytes(sig: SchnorrSignature): Uint8Array {
  const sBytes = sig.s.toBytesLE();
  const eBytes = sig.e.toBytesLE();
  const out = new Uint8Array(80);
  out.set(sBytes, 0);
  out.set(eBytes, 40);
  return out;
}
