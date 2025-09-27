import type { ExchangeAdapter } from "./adapter";
import { AsterExchangeAdapter, type AsterCredentials } from "./aster-adapter";
import { GrvtExchangeAdapter, type GrvtCredentials } from "./grvt/adapter";

export interface ExchangeFactoryOptions {
  symbol: string;
  exchange?: string;
  aster?: AsterCredentials;
  grvt?: GrvtCredentials;
}

export type SupportedExchangeId = "aster" | "grvt";

export function resolveExchangeId(value?: string | null): SupportedExchangeId {
  const fallback = (value ?? process.env.EXCHANGE ?? process.env.TRADE_EXCHANGE ?? "aster")
    .toString()
    .trim()
    .toLowerCase();
  if (fallback === "grvt") return "grvt";
  return "aster";
}

export function getExchangeDisplayName(id: SupportedExchangeId): string {
  return id === "grvt" ? "GRVT" : "AsterDex";
}

export function createExchangeAdapter(options: ExchangeFactoryOptions): ExchangeAdapter {
  const id = resolveExchangeId(options.exchange);
  if (id === "grvt") {
    return new GrvtExchangeAdapter({ ...options.grvt, symbol: options.symbol });
  }
  return new AsterExchangeAdapter({ ...options.aster, symbol: options.symbol });
}
