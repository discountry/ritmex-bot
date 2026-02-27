import type { ExchangeAdapter } from "./adapter";
import { AsterExchangeAdapter, type AsterCredentials } from "./aster-adapter";
import { GrvtExchangeAdapter, type GrvtCredentials } from "./grvt/adapter";
import { LighterExchangeAdapter, type LighterCredentials } from "./lighter/adapter";
import { BackpackExchangeAdapter, type BackpackCredentials } from "./backpack/adapter";
import { ParadexExchangeAdapter, type ParadexCredentials } from "./paradex/adapter";
import { NadoExchangeAdapter, type NadoCredentials } from "./nado/adapter";
import { StandxExchangeAdapter, type StandxCredentials } from "./standx/adapter";
import { BinanceExchangeAdapter, type BinanceCredentials } from "./binance/adapter";

export const SUPPORTED_EXCHANGE_IDS = [
  "aster",
  "grvt",
  "lighter",
  "backpack",
  "paradex",
  "nado",
  "standx",
  "binance",
] as const;

export const BASIS_SUPPORTED_EXCHANGE_IDS = [
  "aster",
  "nado",
  "standx",
  "binance",
] as const;

export interface ExchangeFactoryOptions {
  symbol: string;
  exchange?: string;
  aster?: AsterCredentials;
  grvt?: GrvtCredentials;
  lighter?: LighterCredentials;
  backpack?: BackpackCredentials;
  paradex?: ParadexCredentials;
  nado?: NadoCredentials;
  standx?: StandxCredentials;
  binance?: BinanceCredentials;
}

export type SupportedExchangeId = (typeof SUPPORTED_EXCHANGE_IDS)[number];
export type BasisSupportedExchangeId = (typeof BASIS_SUPPORTED_EXCHANGE_IDS)[number];

const EXCHANGE_DISPLAY_NAME: Record<SupportedExchangeId, string> = {
  aster: "AsterDex",
  grvt: "GRVT",
  lighter: "Lighter",
  backpack: "Backpack",
  paradex: "Paradex",
  nado: "Nado",
  standx: "StandX",
  binance: "Binance",
};

const EXCHANGE_ALIAS_MAP: Record<string, SupportedExchangeId> = {
  aster: "aster",
  grvt: "grvt",
  lighter: "lighter",
  backpack: "backpack",
  paradex: "paradex",
  nado: "nado",
  standx: "standx",
  binance: "binance",
  bnb: "binance",
};

export function isSupportedExchangeId(value: string): value is SupportedExchangeId {
  return SUPPORTED_EXCHANGE_IDS.includes(value as SupportedExchangeId);
}

export function isBasisSupportedExchangeId(value: string): value is BasisSupportedExchangeId {
  return BASIS_SUPPORTED_EXCHANGE_IDS.includes(value as BasisSupportedExchangeId);
}

export function resolveExchangeId(value?: string | null): SupportedExchangeId {
  const fallback = (value ?? process.env.EXCHANGE ?? process.env.TRADE_EXCHANGE ?? "aster")
    .toString()
    .trim()
    .toLowerCase();
  return EXCHANGE_ALIAS_MAP[fallback] ?? "aster";
}

export function getExchangeDisplayName(id: SupportedExchangeId): string {
  return EXCHANGE_DISPLAY_NAME[id];
}

export function createExchangeAdapter(options: ExchangeFactoryOptions): ExchangeAdapter {
  const id = resolveExchangeId(options.exchange);
  switch (id) {
    case "aster":
      return new AsterExchangeAdapter({ ...options.aster, symbol: options.symbol });
    case "grvt":
      return new GrvtExchangeAdapter({ ...options.grvt, symbol: options.symbol });
    case "lighter":
      return new LighterExchangeAdapter({ ...options.lighter, displaySymbol: options.symbol });
    case "backpack":
      return new BackpackExchangeAdapter({ ...options.backpack, symbol: options.symbol });
    case "paradex":
      return new ParadexExchangeAdapter({ ...options.paradex, symbol: options.symbol });
    case "nado":
      return new NadoExchangeAdapter({ ...options.nado, symbol: options.symbol });
    case "standx":
      return new StandxExchangeAdapter({ ...options.standx, symbol: options.symbol });
    case "binance":
      return new BinanceExchangeAdapter({ ...options.binance, symbol: options.symbol });
  }
}
