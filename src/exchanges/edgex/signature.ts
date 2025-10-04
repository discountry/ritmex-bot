import * as crypto from "crypto";
import { keccak256 } from "ethereum-cryptography/keccak";
import { ec as starkEc } from "@starkware-industries/starkware-crypto-utils";

export interface HttpSignatureInput {
  method: string;
  path: string;
  query?: Record<string, unknown> | URLSearchParams | null;
  body?: unknown;
  timestamp?: number;
}

export interface HttpSignatureResult {
  signature: string;
  timestamp: string;
  message: string;
}

export interface EdgeXWsHeaders {
  timestamp: string;
  signature: string;
}

export class EdgeXSignature {
  private readonly privateKey: string;
  private readonly keyPair:
    | ReturnType<typeof starkEc.keyFromPrivate>
    | null;

  constructor(privateKey: string) {
    this.privateKey = stripHexPrefix(privateKey);
    this.keyPair = starkEc.keyFromPrivate(this.privateKey, "hex");
  }

  createHttpSignature(input: HttpSignatureInput): HttpSignatureResult {
    const timestamp = input.timestamp ?? Date.now();
    const content = buildSignatureContent({
      timestamp,
      method: input.method,
      path: input.path,
      body: input.body,
      query: input.query,
    });
    const { r, s } = this.sign(content);
    return {
      signature: `${r}${s}`,
      timestamp: timestamp.toString(),
      message: content,
    };
  }

  createWebsocketHeaders(accountId: string): EdgeXWsHeaders {
    const timestamp = Date.now();
    const path = `/api/v1/private/wsaccountId=${accountId}`;
    const content = `${timestamp}GET${path}`;
    const { r, s } = this.sign(content);
    return {
      timestamp: timestamp.toString(),
      signature: `${r}${s}`,
    };
  }

  signRaw(message: string | Buffer): { r: string; s: string } {
    const buffer = typeof message === "string" ? Buffer.from(message, "utf8") : message;
    return this.sign(buffer);
  }

  randomNonce(max: number = 0xffffffff): number {
    return crypto.randomInt(0, max + 1);
  }

  private sign(message: string | Buffer): { r: string; s: string } {
    if (!this.keyPair) throw new Error("EdgeX signer not initialized");
    const buffer = typeof message === "string" ? Buffer.from(message, "utf8") : message;
    const hash = keccak256(buffer);
    const msgHex = Buffer.from(hash).toString("hex");
    const signature = this.keyPair.sign(msgHex, { canonical: true });
    const r = signature.r.toString(16).padStart(64, "0");
    const s = signature.s.toString(16).padStart(64, "0");
    return { r, s };
  }
}

export function buildSignatureContent(input: {
  timestamp: number;
  method: string;
  path: string;
  body?: unknown;
  query?: Record<string, unknown> | URLSearchParams | null;
}): string {
  const { timestamp, method } = input;
  const upperMethod = method.toUpperCase();
  const normalizedPath = ensureLeadingSlash(input.path);
  if (input.body != null && input.body !== "") {
    const bodyString = stringifyForSignature(input.body);
    return `${timestamp}${upperMethod}${normalizedPath}${bodyString}`;
  }
  const queryString = buildQueryString(input.query);
  if (queryString) {
    return `${timestamp}${upperMethod}${normalizedPath}${queryString}`;
  }
  return `${timestamp}${upperMethod}${normalizedPath}`;
}

export function buildQueryString(query?: Record<string, unknown> | URLSearchParams | null): string {
  if (!query) return "";
  const entries: Array<[string, string]> = [];
  if (query instanceof URLSearchParams) {
    query.forEach((value, key) => {
      entries.push([key, value]);
    });
  } else {
    for (const [key, value] of Object.entries(query)) {
      if (value == null) continue;
      entries.push([key, stringifyPrimitive(value)]);
    }
  }
  if (entries.length === 0) return "";
  entries.sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([key, value]) => `${key}=${value}`).join("&");
}

function stringifyPrimitive(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value.toString().toLowerCase();
  if (typeof value === "number") return Number.isFinite(value) ? value.toString() : "";
  return String(value);
}

export function stringifyForSignature(data: unknown): string {
  if (data == null) return "";
  if (typeof data === "string") return data;
  if (typeof data === "number") return Number.isFinite(data) ? data.toString() : "";
  if (typeof data === "boolean") return data.toString().toLowerCase();
  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    return data.map((item) => stringifyForSignature(item)).join("&");
  }
  if (typeof data === "object") {
    const map = new Map<string, string>();
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      map.set(key, stringifyForSignature(value));
    }
    const keys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
    return keys.map((key) => `${key}=${map.get(key) ?? ""}`).join("&");
  }
  return String(data);
}

function ensureLeadingSlash(path: string): string {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

function stripHexPrefix(input: string): string {
  return input.startsWith("0x") || input.startsWith("0X") ? input.slice(2) : input;
}
