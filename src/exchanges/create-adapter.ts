import type { ExchangeAdapter } from "./adapter";
import { AsterExchangeAdapter, type AsterCredentials } from "./aster-adapter";
import { GrvtExchangeAdapter, type GrvtCredentials } from "./grvt/adapter";
import { LighterExchangeAdapter, type LighterCredentials } from "./lighter/adapter";

export interface ExchangeFactoryOptions {
  symbol: string;
  exchange?: string;
  aster?: AsterCredentials;
  grvt?: GrvtCredentials;
  lighter?: LighterCredentials;
}

export type SupportedExchangeId = "aster" | "grvt" | "lighter";

export function resolveExchangeId(value?: string | null): SupportedExchangeId {
  const fallback = (value ?? process.env.EXCHANGE ?? process.env.TRADE_EXCHANGE ?? "aster")
    .toString()
    .trim()
    .toLowerCase();
  if (fallback === "grvt") return "grvt";
  if (fallback === "lighter") return "lighter";
  return "aster";
}

export function getExchangeDisplayName(id: SupportedExchangeId): string {
  if (id === "grvt") return "GRVT";
  if (id === "lighter") return "Lighter";
  return "AsterDex";
}

export function createExchangeAdapter(options: ExchangeFactoryOptions): ExchangeAdapter {
  const id = resolveExchangeId(options.exchange);
  if (id === "grvt") {
    return new GrvtExchangeAdapter({ ...options.grvt, symbol: options.symbol });
  }
  if (id === "lighter") {
    return new LighterExchangeAdapter({ ...options.lighter, displaySymbol: options.symbol });
  }
  return new AsterExchangeAdapter({ ...options.aster, symbol: options.symbol });
}
