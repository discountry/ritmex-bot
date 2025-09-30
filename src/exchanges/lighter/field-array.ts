import { Fp, GOLDILOCKS_BYTE_LENGTH } from "./crypto/goldilocks";

const CHUNK_SIZE = GOLDILOCKS_BYTE_LENGTH;

export function arrayFromCanonicalLittleEndianBytes(bytes: Uint8Array): Fp[] {
  if (!bytes.length) return [];
  const remainder = bytes.length % CHUNK_SIZE;
  const paddedLength = remainder === 0 ? bytes.length : bytes.length + (CHUNK_SIZE - remainder);
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes, 0);
  const result: Fp[] = [];
  for (let offset = 0; offset < padded.length; offset += CHUNK_SIZE) {
    const chunk = padded.subarray(offset, offset + CHUNK_SIZE);
    result.push(Fp.fromBytesLE(chunk));
  }
  return result;
}
