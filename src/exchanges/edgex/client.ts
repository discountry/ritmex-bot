import * as crypto from "crypto";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { extractMessage } from "../../utils/errors";
import { EdgeXSignature, buildQueryString } from "./signature";

export interface EdgeXHttpClientOptions {
  baseUrl: string;
  privateKey: string;
  timeout?: number;
}

export interface EdgeXResponse<T = any> {
  code: string;
  data: T;
  msg?: string | null;
  errorParam?: unknown;
}

export class EdgeXHttpClient {
  private readonly axios: AxiosInstance;
  private readonly signer: EdgeXSignature;

  constructor(options: EdgeXHttpClientOptions) {
    this.axios = axios.create({
      baseURL: options.baseUrl,
      timeout: options.timeout ?? 30_000,
    });
    this.signer = new EdgeXSignature(options.privateKey);
  }

  getSigner(): EdgeXSignature {
    return this.signer;
  }

  async get<T = any>(path: string, query?: Record<string, unknown>): Promise<EdgeXResponse<T>> {
    return this.request<T>({ method: "GET", path, params: query });
  }

  async post<T = any>(path: string, body?: unknown): Promise<EdgeXResponse<T>> {
    return this.request<T>({ method: "POST", path, data: body });
  }

  private buildHeaders(signature: string, timestamp: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-edgeX-Api-Timestamp": timestamp,
      "X-edgeX-Api-Signature": signature,
    };
  }

  private async request<T = any>(input: {
    method: string;
    path: string;
    data?: unknown;
    params?: Record<string, unknown>;
  }): Promise<EdgeXResponse<T>> {
    const normalizedParams = normalizeParams(input.params);
    const signature = this.signer.createHttpSignature({
      method: input.method,
      path: input.path,
      body: input.data,
      query: normalizedParams,
    });
    const serializedQuery = normalizedParams ? buildQueryString(normalizedParams) : "";
    const url = serializedQuery ? appendQueryString(input.path, serializedQuery) : input.path;
    const config: AxiosRequestConfig = {
      method: input.method,
      url,
      data: input.data,
      headers: this.buildHeaders(signature.signature, signature.timestamp),
    };
    try {
      const response = await this.axios.request<EdgeXResponse<T>>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        let detail: string | undefined;
        if (error.response?.data != null) {
          try {
            detail = typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data);
          } catch {
            detail = undefined;
          }
        }
        const statusLabel = status ? ` (${status})` : "";
        const message = detail ?? extractMessage(error);
        throw new Error(`EdgeX request failed${statusLabel}: ${message}`);
      }
      throw new Error(extractMessage(error));
    }
  }
}

function appendQueryString(path: string, query: string): string {
  if (!query) return path;
  const separator = path.includes("?")
    ? path.endsWith("?") || path.endsWith("&") ? "" : "&"
    : "?";
  return `${path}${separator}${query}`;
}

export function computeNonceFromClientOrderId(clientOrderId: string): number {
  const hash = crypto.createHash("sha256").update(clientOrderId).digest("hex");
  return parseInt(hash.slice(0, 8), 16);
}

function normalizeParams(params?: Record<string, unknown>): Record<string, string> | undefined {
  if (!params) return undefined;
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      normalized[key] = value.map(stringifyPrimitive).join(",");
      continue;
    }
    normalized[key] = stringifyPrimitive(value);
  }
  return normalized;
}

function stringifyPrimitive(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? value.toString() : "";
  return String(value);
}
