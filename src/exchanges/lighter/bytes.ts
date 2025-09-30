export function normalizeHex(input: string): string {
  const trimmed = input.trim();
  return trimmed.startsWith("0x") || trimmed.startsWith("0X") ? trimmed.slice(2) : trimmed;
}

export function hexToBytes(hex: string): Uint8Array {
  const normalized = normalizeHex(hex);
  if (normalized.length % 2 !== 0) {
    throw new Error("Hex string must have even length");
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    const byte = normalized.slice(i, i + 2);
    const value = Number.parseInt(byte, 16);
    if (Number.isNaN(value)) {
      throw new Error(`Invalid hex byte: ${byte}`);
    }
    out[i / 2] = value;
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array, withPrefix = false): string {
  const hex = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return withPrefix ? `0x${hex}` : hex;
}
