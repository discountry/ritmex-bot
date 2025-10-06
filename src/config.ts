/**
 * Trading Configuration
 * 
 * Environment Variables for Backpack Exchange:
 * - BACKPACK_API_KEY: Required API key for Backpack
 * - BACKPACK_API_SECRET: Required API secret for Backpack  
 * - BACKPACK_PASSWORD: Optional password for Backpack (if required)
 * - BACKPACK_SUBACCOUNT: Optional subaccount name
 * - BACKPACK_SYMBOL: Override symbol (defaults to TRADE_SYMBOL)
 * - BACKPACK_SANDBOX: Set to "true" for sandbox mode
 * - BACKPACK_DEBUG: Set to "true" for debug logging
 * 
 * Environment Variables for Paradex Exchange:
 * - PARADEX_PRIVATE_KEY: Required EVM private key for REST/WS authentication
 * - PARADEX_WALLET_ADDRESS: Required wallet address matching the private key
 * - PARADEX_SYMBOL: Override symbol (defaults to TRADE_SYMBOL)
 * - PARADEX_SANDBOX: Set to "true" to use testnet endpoints
 * - PARADEX_USE_PRO: Set to "false" to disable ccxt.pro websocket feeds
 * - PARADEX_RECONNECT_DELAY_MS: Optional websocket reconnect delay in ms (default 2000)
 * - PARADEX_DEBUG: Set to "true" for verbose Paradex adapter logging
 *
 * Usage: Set EXCHANGE=backpack to use Backpack exchange
 *        Set EXCHANGE=paradex to use Paradex exchange
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
