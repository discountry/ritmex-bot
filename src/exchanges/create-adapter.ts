import type { ExchangeAdapter } from "./adapter";
import { AsterExchangeAdapter, type AsterCredentials } from "./aster-adapter";
import { GrvtExchangeAdapter, type GrvtCredentials } from "./grvt/adapter";
import { LighterExchangeAdapter, type LighterCredentials } from "./lighter/adapter";
import { BackpackExchangeAdapter, type BackpackCredentials } from "./backpack/adapter";
import { ParadexExchangeAdapter, type ParadexCredentials } from "./paradex/adapter";

export interface ExchangeFactoryOptions {
  symbol: string;
  exchange?: string;
  aster?: AsterCredentials;
  grvt?: GrvtCredentials;
  lighter?: LighterCredentials;
  backpack?: BackpackCredentials;
  paradex?: ParadexCredentials;
}

export type SupportedExchangeId = "aster" | "grvt" | "lighter" | "backpack" | "paradex";

export function resolveExchangeId(value?: string | null): SupportedExchangeId {
  const fallback = (value ?? process.env.EXCHANGE ?? process.env.TRADE_EXCHANGE ?? "aster")
    .toString()
    .trim()
    .toLowerCase();
  if (fallback === "grvt") return "grvt";
  if (fallback === "lighter") return "lighter";
  if (fallback === "backpack") return "backpack";
  if (fallback === "paradex") return "paradex";
  return "aster";
}

export function getExchangeDisplayName(id: SupportedExchangeId): string {
  if (id === "grvt") return "GRVT";
  if (id === "lighter") return "Lighter";
  if (id === "backpack") return "Backpack";
  if (id === "paradex") return "Paradex";
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
  if (id === "backpack") {
    return new BackpackExchangeAdapter({ ...options.backpack, symbol: options.symbol });
  }
  if (id === "paradex") {
    return new ParadexExchangeAdapter({ ...options.paradex, symbol: options.symbol });
  }
  return new AsterExchangeAdapter({ ...options.aster, symbol: options.symbol });
}
