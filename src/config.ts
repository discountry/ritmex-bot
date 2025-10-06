/**
 * Trading Configuration
 * 
 */

import { resolveExchangeId, type SupportedExchangeId } from "./exchanges/create-adapter";

export interface TradingConfig {
  symbol: string;
  tradeAmount: number;
  lossLimit: number;
  trailingProfit: number;
  trailingCallbackRate: number;
  profitLockTriggerUsd: number;
  profitLockOffsetUsd: number;
  pollIntervalMs: number;
  maxLogEntries: number;
  klineInterval: string;
  maxCloseSlippagePct: number;
  priceTick: number; // price tick size, e.g. 0.1 for BTCUSDT
  qtyStep: number;   // quantity step size, e.g. 0.001 BTC
  bollingerLength: number;
  bollingerStdMultiplier: number;
  minBollingerBandwidth: number;
}

const SYMBOL_PRIORITY_BY_EXCHANGE: Record<SupportedExchangeId, { envKeys: string[]; fallback: string }> = {
  aster: { envKeys: ["ASTER_SYMBOL", "TRADE_SYMBOL"], fallback: "BTCUSDT" },
  grvt: { envKeys: ["GRVT_SYMBOL", "TRADE_SYMBOL"], fallback: "BTCUSDT" },
  lighter: { envKeys: ["LIGHTER_SYMBOL", "TRADE_SYMBOL"], fallback: "BTCUSDT" },
  backpack: { envKeys: ["BACKPACK_SYMBOL", "TRADE_SYMBOL"], fallback: "BTCUSDC" },
  paradex: { envKeys: ["PARADEX_SYMBOL", "TRADE_SYMBOL"], fallback: "BTC/USDC" },
};

export function resolveSymbolFromEnv(explicitExchangeId?: SupportedExchangeId | string | null): string {
  const exchangeId = explicitExchangeId
    ? resolveExchangeId(explicitExchangeId)
    : resolveExchangeId();
  const { envKeys, fallback } = SYMBOL_PRIORITY_BY_EXCHANGE[exchangeId];
  for (const key of envKeys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export const tradingConfig: TradingConfig = {
  symbol: resolveSymbolFromEnv(),
  tradeAmount: parseNumber(process.env.TRADE_AMOUNT, 0.001),
  lossLimit: parseNumber(process.env.LOSS_LIMIT, 0.03),
  trailingProfit: parseNumber(process.env.TRAILING_PROFIT, 0.2),
  trailingCallbackRate: parseNumber(process.env.TRAILING_CALLBACK_RATE, 0.2),
  profitLockTriggerUsd: parseNumber(process.env.PROFIT_LOCK_TRIGGER_USD, 0.1),
  profitLockOffsetUsd: parseNumber(process.env.PROFIT_LOCK_OFFSET_USD, 0.05),
  pollIntervalMs: parseNumber(process.env.POLL_INTERVAL_MS, 500),
  maxLogEntries: parseNumber(process.env.MAX_LOG_ENTRIES, 200),
  klineInterval: process.env.KLINE_INTERVAL ?? "1m",
  maxCloseSlippagePct: parseNumber(process.env.MAX_CLOSE_SLIPPAGE_PCT, 0.05),
  priceTick: parseNumber(process.env.PRICE_TICK, 0.1),
  qtyStep: parseNumber(process.env.QTY_STEP, 0.001),
  bollingerLength: parseNumber(process.env.BOLLINGER_LENGTH, 20),
  bollingerStdMultiplier: parseNumber(process.env.BOLLINGER_STD_MULTIPLIER, 2),
  minBollingerBandwidth: parseNumber(process.env.MIN_BOLLINGER_BANDWIDTH, 0.001),
};

export interface MakerConfig {
  symbol: string;
  tradeAmount: number;
  lossLimit: number;
  bidOffset: number;
  askOffset: number;
  refreshIntervalMs: number;
  maxLogEntries: number;
  maxCloseSlippagePct: number;
  priceTick: number;
}

export const makerConfig: MakerConfig = {
  symbol: resolveSymbolFromEnv(),
  tradeAmount: parseNumber(process.env.TRADE_AMOUNT, 0.001),
  lossLimit: parseNumber(process.env.MAKER_LOSS_LIMIT, parseNumber(process.env.LOSS_LIMIT, 0.03)),
  bidOffset: parseNumber(process.env.MAKER_BID_OFFSET, 0),
  askOffset: parseNumber(process.env.MAKER_ASK_OFFSET, 0),
  refreshIntervalMs: parseNumber(process.env.MAKER_REFRESH_INTERVAL_MS, 500),
  maxLogEntries: parseNumber(process.env.MAKER_MAX_LOG_ENTRIES, 200),
  maxCloseSlippagePct: parseNumber(
    process.env.MAKER_MAX_CLOSE_SLIPPAGE_PCT ?? process.env.MAX_CLOSE_SLIPPAGE_PCT,
    0.05
  ),
  priceTick: parseNumber(process.env.MAKER_PRICE_TICK ?? process.env.PRICE_TICK, 0.1),
};

export interface BasisArbConfig {
  futuresSymbol: string;
  spotSymbol: string;
  refreshIntervalMs: number;
  maxLogEntries: number;
  takerFeeRate: number;
}

const resolveBasisSymbol = (envKeys: string[], fallback: string): string => {
  for (const key of envKeys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim().toUpperCase();
    }
  }
  return fallback.toUpperCase();
};

export const basisConfig: BasisArbConfig = {
  futuresSymbol: resolveBasisSymbol(
    ["BASIS_FUTURES_SYMBOL", "ASTER_FUTURES_SYMBOL", "ASTER_SYMBOL", "TRADE_SYMBOL"],
    "ASTERUSDT"
  ),
  spotSymbol: resolveBasisSymbol(
    ["BASIS_SPOT_SYMBOL", "ASTER_SPOT_SYMBOL", "ASTER_SYMBOL", "TRADE_SYMBOL"],
    "ASTERUSDT"
  ),
  refreshIntervalMs: parseNumber(process.env.BASIS_REFRESH_INTERVAL_MS, 1000),
  maxLogEntries: parseNumber(process.env.BASIS_MAX_LOG_ENTRIES, 200),
  takerFeeRate: parseNumber(process.env.BASIS_TAKER_FEE_RATE, 0.0004),
};

export function isBasisStrategyEnabled(): boolean {
  const raw = process.env.ENABLE_BASIS_STRATEGY;
  if (!raw) return false;
  const normalized = raw.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
