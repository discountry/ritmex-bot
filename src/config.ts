/**
 * Trading Configuration
 * 
 */

import { resolveExchangeId, type SupportedExchangeId } from "./exchanges/create-adapter";
import { language, type Language } from "./i18n";

export interface StandxTokenConfig {
  expiryTimestamp: number | null;
}

function parseTokenExpiry(): number | null {
  // Method 1: Use creation date + validity days (recommended for official API tokens)
  const createDate = process.env.STANDX_TOKEN_CREATE_DATE?.trim();
  const validityDays = process.env.STANDX_TOKEN_VALIDITY_DAYS?.trim();

  if (createDate && validityDays) {
    // Parse date in YYYY-MM-DD format
    const dateMatch = createDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      const createTimestamp = Date.UTC(
        Number(year),
        Number(month) - 1, // Month is 0-indexed
        Number(day),
        0, 0, 0, 0
      );
      const days = Number(validityDays);
      if (Number.isFinite(createTimestamp) && Number.isFinite(days) && days > 0) {
        return createTimestamp + days * 24 * 60 * 60 * 1000;
      }
    }
  }

  // Method 2: Use legacy STANDX_TOKEN_EXPIRY (timestamp or ISO date string)
  const legacyExpiry = process.env.STANDX_TOKEN_EXPIRY?.trim();
  if (legacyExpiry) {
    const asNumber = Number(legacyExpiry);
    if (Number.isFinite(asNumber) && asNumber > 0) {
      return asNumber < 1e12 ? asNumber * 1000 : asNumber;
    }
    const asDate = Date.parse(legacyExpiry);
    if (Number.isFinite(asDate) && asDate > 0) {
      return asDate;
    }
  }

  return null;
}

export const standxTokenConfig: StandxTokenConfig = {
  expiryTimestamp: parseTokenExpiry(),
};

export function isStandxTokenExpired(): boolean {
  const expiry = standxTokenConfig.expiryTimestamp;
  if (expiry == null) return false;
  return Date.now() >= expiry;
}

export function getStandxTokenExpiryInfo(): { expired: boolean; expiryTimestamp: number | null; remainingMs: number | null } {
  const expiry = standxTokenConfig.expiryTimestamp;
  if (expiry == null) {
    return { expired: false, expiryTimestamp: null, remainingMs: null };
  }
  const now = Date.now();
  const expired = now >= expiry;
  const remainingMs = expired ? 0 : expiry - now;
  return { expired, expiryTimestamp: expiry, remainingMs };
}

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
  nado: { envKeys: ["NADO_SYMBOL", "TRADE_SYMBOL"], fallback: "BTC-PERP" },
  standx: { envKeys: ["STANDX_SYMBOL", "TRADE_SYMBOL"], fallback: "BTC-USD" },
};

export function resolveSymbolFromEnv(explicitExchangeId?: SupportedExchangeId | string | null): string {
  const exchangeId = explicitExchangeId
    ? resolveExchangeId(explicitExchangeId)
    : resolveExchangeId();
  const { envKeys, fallback } = SYMBOL_PRIORITY_BY_EXCHANGE[exchangeId];
  for (const key of envKeys) {
    const value = normalizeEnvValue(process.env[key]);
    if (value) {
      return value;
    }
  }
  return fallback;
}

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const quote = trimmed[0];
  if ((quote === "'" || quote === "\"") && trimmed.endsWith(quote)) {
    const unquoted = trimmed.slice(1, -1).trim();
    return unquoted ? unquoted : undefined;
  }

  // Allow shell-style inline comments: KEY=value # comment
  const commentIndexHash = trimmed.search(/\s#/);
  const commentIndexSemi = trimmed.search(/\s;/);
  const commentIndex =
    commentIndexHash === -1
      ? commentIndexSemi
      : commentIndexSemi === -1
        ? commentIndexHash
        : Math.min(commentIndexHash, commentIndexSemi);
  if (commentIndex !== -1) {
    const withoutComment = trimmed.slice(0, commentIndex).trim();
    return withoutComment ? withoutComment : undefined;
  }

  return trimmed;
}

function parseNumber(value: string | undefined, fallback: number): number {
  const normalized = normalizeEnvValue(value);
  if (!normalized) return fallback;
  const next = Number(normalized);
  return Number.isFinite(next) ? next : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  const normalized = normalizeEnvValue(value)?.toLowerCase();
  if (!normalized) return fallback;
  if (normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on") return true;
  if (normalized === "0" || normalized === "false" || normalized === "no" || normalized === "off") return false;
  return fallback;
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
  /** 开仓挂单档位：1=买1/卖1，2=买2/卖2，以此类推。仅影响无仓位时的开仓挂单，平仓逻辑不受影响。默认1 */
  entryDepthLevel: number;
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
  entryDepthLevel: Math.max(1, Math.floor(parseNumber(process.env.MAKER_ENTRY_DEPTH_LEVEL, 1))),
};

export interface MakerPointsConfig {
  symbol: string;
  perOrderAmount: number;
  closeThreshold: number;
  stopLossUsd: number;
  refreshIntervalMs: number;
  maxLogEntries: number;
  maxCloseSlippagePct: number;
  priceTick: number;
  qtyStep: number;
  enableBand0To10: boolean;
  enableBand10To30: boolean;
  enableBand30To100: boolean;
  /** 0-10 bps 档位挂单数量，未配置时使用 perOrderAmount */
  band0To10Amount: number;
  /** 10-30 bps 档位挂单数量，未配置时使用 perOrderAmount */
  band10To30Amount: number;
  /** 30-100 bps 档位挂单数量，未配置时使用 perOrderAmount */
  band30To100Amount: number;
  minRepriceBps: number;
  /** 是否根据 Binance 盘口深度失衡自动取消单边挂单，默认 true */
  enableBinanceDepthCancel: boolean;
  /** Binance 深度监控窗口（bps），默认 3 */
  binanceDepthWindowBps?: number;
  /** Binance 深度失衡比例阈值，默认 9 */
  binanceDepthImbalanceRatio?: number;
  /** 各档位最小深度阈值 (BTC)，盘口到目标价之间的挂单量低于此值则跳过该档位，默认 10 */
  filterMinDepth: number;
}

const defaultMakerPointsAmount = parseNumber(process.env.MAKER_POINTS_ORDER_AMOUNT, parseNumber(process.env.TRADE_AMOUNT, 0.001));

export const makerPointsConfig: MakerPointsConfig = {
  symbol: resolveSymbolFromEnv("standx"),
  perOrderAmount: defaultMakerPointsAmount,
  closeThreshold: parseNumber(process.env.MAKER_POINTS_CLOSE_THRESHOLD, 0),
  stopLossUsd: parseNumber(process.env.MAKER_POINTS_STOP_LOSS_USD, 0),
  refreshIntervalMs: parseNumber(process.env.MAKER_POINTS_REFRESH_INTERVAL_MS, 500),
  maxLogEntries: parseNumber(process.env.MAKER_POINTS_MAX_LOG_ENTRIES, 200),
  maxCloseSlippagePct: parseNumber(
    process.env.MAKER_POINTS_MAX_CLOSE_SLIPPAGE_PCT ?? process.env.MAX_CLOSE_SLIPPAGE_PCT,
    0.05
  ),
  priceTick: parseNumber(process.env.MAKER_POINTS_PRICE_TICK ?? process.env.PRICE_TICK, 0.1),
  qtyStep: parseNumber(process.env.MAKER_POINTS_QTY_STEP ?? process.env.QTY_STEP, 0.001),
  enableBand0To10: parseBoolean(process.env.MAKER_POINTS_BAND_0_10, true),
  enableBand10To30: parseBoolean(process.env.MAKER_POINTS_BAND_10_30, true),
  enableBand30To100: parseBoolean(process.env.MAKER_POINTS_BAND_30_100, true),
  band0To10Amount: parseNumber(process.env.MAKER_POINTS_BAND_0_10_AMOUNT, defaultMakerPointsAmount),
  band10To30Amount: parseNumber(process.env.MAKER_POINTS_BAND_10_30_AMOUNT, defaultMakerPointsAmount),
  band30To100Amount: parseNumber(process.env.MAKER_POINTS_BAND_30_100_AMOUNT, defaultMakerPointsAmount),
  minRepriceBps: parseNumber(process.env.MAKER_POINTS_MIN_REPRICE_BPS, 3),
  enableBinanceDepthCancel: parseBoolean(process.env.MAKER_POINTS_BINANCE_DEPTH_CANCEL, true),
  binanceDepthWindowBps: parseNumber(process.env.MAKER_POINTS_BINANCE_DEPTH_WINDOW_BPS, 3),
  binanceDepthImbalanceRatio: parseNumber(process.env.MAKER_POINTS_BINANCE_DEPTH_IMBALANCE_RATIO, 9),
  filterMinDepth: parseNumber(process.env.MAKER_POINTS_FILTER_MIN_DEPTH, 10),
};

export interface BasisArbConfig {
  futuresSymbol: string;
  spotSymbol: string;
  refreshIntervalMs: number;
  maxLogEntries: number;
  takerFeeRate: number;
  arbAmount: number; // base asset amount to arb (e.g., ASTER amount when ASTERUSDT)
}

export type GridDirection = "both" | "long" | "short";

export interface GridConfig {
  symbol: string;
  lowerPrice: number;
  upperPrice: number;
  gridLevels: number;
  orderSize: number;
  maxPositionSize: number;
  refreshIntervalMs: number;
  maxLogEntries: number;
  priceTick: number;
  qtyStep: number;
  direction: GridDirection;
  stopLossPct: number;
  restartTriggerPct: number;
  autoRestart: boolean;
  gridMode: "geometric";
  maxCloseSlippagePct: number;
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
  // Default symbols depend on venue: Nado uses product symbols (e.g. BTC-PERP / KBTC), while Aster uses pair symbols.
  // Users can always override via BASIS_* env vars.
  futuresSymbol: resolveBasisSymbol(
    ["BASIS_FUTURES_SYMBOL", "ASTER_FUTURES_SYMBOL", "ASTER_SYMBOL", "TRADE_SYMBOL"],
    (() => {
      const exchange = (process.env.EXCHANGE ?? "").trim().toLowerCase();
      if (exchange === "nado") return "BTC-PERP";
      if (exchange === "standx") return "BTC-USD";
      return "ASTERUSDT";
    })()
  ),
  spotSymbol: resolveBasisSymbol(
    ["BASIS_SPOT_SYMBOL", "ASTER_SPOT_SYMBOL", "ASTER_SYMBOL", "TRADE_SYMBOL"],
    (() => {
      const exchange = (process.env.EXCHANGE ?? "").trim().toLowerCase();
      if (exchange === "nado") return "KBTC";
      if (exchange === "standx") return "BTC-USD";
      return "ASTERUSDT";
    })()
  ),
  refreshIntervalMs: parseNumber(process.env.BASIS_REFRESH_INTERVAL_MS, 1000),
  maxLogEntries: parseNumber(process.env.BASIS_MAX_LOG_ENTRIES, 200),
  takerFeeRate: parseNumber(process.env.BASIS_TAKER_FEE_RATE, 0.0004),
  arbAmount: parseNumber(process.env.ARB_AMOUNT, parseNumber(process.env.TRADE_AMOUNT, 0)),
};

const resolveGridDirection = (raw: string | undefined, fallback: GridDirection): GridDirection => {
  if (!raw) return fallback;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "long" || normalized === "long-only") return "long";
  if (normalized === "short" || normalized === "short-only") return "short";
  if (normalized === "both" || normalized === "dual" || normalized === "bi" || normalized === "two-way") return "both";
  return fallback;
};

const resolveGridMaxPosition = (orderSize: number, levels: number): number => {
  const fallback = Math.max(orderSize * Math.max(levels - 1, 1), orderSize);
  const raw = process.env.GRID_MAX_POSITION_SIZE ?? process.env.GRID_MAX_POSITION ?? process.env.GRID_POSITION_CAP;
  const parsed = parseNumber(raw, fallback);
  return parsed > 0 ? parsed : fallback;
};

export const gridConfig: GridConfig = {
  symbol: resolveSymbolFromEnv(),
  lowerPrice: parseNumber(process.env.GRID_LOWER_PRICE ?? process.env.GRID_LOWER_BOUND, 0),
  upperPrice: parseNumber(process.env.GRID_UPPER_PRICE ?? process.env.GRID_UPPER_BOUND, 0),
  gridLevels: Math.max(2, Math.floor(parseNumber(process.env.GRID_LEVELS, 10))),
  orderSize: parseNumber(process.env.GRID_ORDER_SIZE, parseNumber(process.env.TRADE_AMOUNT, 0.001)),
  maxPositionSize: 0, // placeholder, replaced below
  refreshIntervalMs: parseNumber(process.env.GRID_REFRESH_INTERVAL_MS, 1_000),
  maxLogEntries: parseNumber(process.env.GRID_MAX_LOG_ENTRIES, 200),
  priceTick: parseNumber(process.env.GRID_PRICE_TICK ?? process.env.PRICE_TICK, 0.1),
  qtyStep: parseNumber(process.env.GRID_QTY_STEP ?? process.env.QTY_STEP, 0.001),
  direction: resolveGridDirection(process.env.GRID_DIRECTION, "both"),
  stopLossPct: Math.max(0, parseNumber(process.env.GRID_STOP_LOSS_PCT, 0.01)),
  restartTriggerPct: Math.max(0, parseNumber(process.env.GRID_RESTART_TRIGGER_PCT, 0.01)),
  autoRestart: parseBoolean(process.env.GRID_AUTO_RESTART_ENABLED ?? process.env.GRID_ENABLE_AUTO_RESTART, true),
  gridMode: "geometric",
  maxCloseSlippagePct: Math.max(
    0,
    parseNumber(
      process.env.GRID_MAX_CLOSE_SLIPPAGE_PCT ?? process.env.MAX_CLOSE_SLIPPAGE_PCT,
      0.05
    )
  ),
};

gridConfig.maxPositionSize = resolveGridMaxPosition(gridConfig.orderSize, gridConfig.gridLevels);

export interface LiquidityMakerConfig {
  symbol: string;
  tradeAmount: number;
  lossLimit: number;
  bidOffset: number;
  askOffset: number;
  refreshIntervalMs: number;
  maxLogEntries: number;
  maxCloseSlippagePct: number;
  priceTick: number;
  /** 平仓挂单距成交价的档位数，默认1档 */
  closeTickOffset: number;
  /** 偏移判断阈值倍数，当一侧深度超出另一侧此倍数时取消薄端订单，默认2 */
  depthImbalanceRatio: number;
  /** 开仓挂单档位：1=买1/卖1，2=买2/卖2，以此类推。仅影响无仓位时的开仓挂单，平仓逻辑不受影响。默认1 */
  entryDepthLevel: number;
}

export const liquidityMakerConfig: LiquidityMakerConfig = {
  symbol: resolveSymbolFromEnv(),
  tradeAmount: parseNumber(process.env.TRADE_AMOUNT, 0.001),
  lossLimit: parseNumber(process.env.LIQUIDITY_MAKER_LOSS_LIMIT, parseNumber(process.env.MAKER_LOSS_LIMIT, parseNumber(process.env.LOSS_LIMIT, 0.03))),
  bidOffset: parseNumber(process.env.LIQUIDITY_MAKER_BID_OFFSET, parseNumber(process.env.MAKER_BID_OFFSET, 0)),
  askOffset: parseNumber(process.env.LIQUIDITY_MAKER_ASK_OFFSET, parseNumber(process.env.MAKER_ASK_OFFSET, 0)),
  refreshIntervalMs: parseNumber(process.env.LIQUIDITY_MAKER_REFRESH_INTERVAL_MS, parseNumber(process.env.MAKER_REFRESH_INTERVAL_MS, 500)),
  maxLogEntries: parseNumber(process.env.LIQUIDITY_MAKER_MAX_LOG_ENTRIES, parseNumber(process.env.MAKER_MAX_LOG_ENTRIES, 200)),
  maxCloseSlippagePct: parseNumber(
    process.env.LIQUIDITY_MAKER_MAX_CLOSE_SLIPPAGE_PCT ?? process.env.MAKER_MAX_CLOSE_SLIPPAGE_PCT ?? process.env.MAX_CLOSE_SLIPPAGE_PCT,
    0.05
  ),
  priceTick: parseNumber(process.env.LIQUIDITY_MAKER_PRICE_TICK ?? process.env.MAKER_PRICE_TICK ?? process.env.PRICE_TICK, 0.1),
  closeTickOffset: Math.max(1, Math.floor(parseNumber(process.env.LIQUIDITY_MAKER_CLOSE_TICK_OFFSET, 1))),
  depthImbalanceRatio: Math.max(1.1, parseNumber(process.env.LIQUIDITY_MAKER_DEPTH_IMBALANCE_RATIO, 2)),
  entryDepthLevel: Math.max(1, Math.floor(parseNumber(process.env.MAKER_ENTRY_DEPTH_LEVEL, 1))),
};

export type SwingDirection = "both" | "long" | "short";

export interface SwingConfig {
  symbol: string;
  tradeAmount: number;
  pollIntervalMs: number;
  maxLogEntries: number;
  maxCloseSlippagePct: number;
  priceTick: number;
  qtyStep: number;
  direction: SwingDirection;
  rsiPeriod: number;
  rsiHigh: number;
  rsiLow: number;
  stopLossPct: number;
  signalSymbol: string;
  signalInterval: string;
}

const resolveSwingDirection = (raw: string | undefined, fallback: SwingDirection): SwingDirection => {
  if (!raw) return fallback;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "long" || normalized === "long-only") return "long";
  if (normalized === "short" || normalized === "short-only") return "short";
  if (normalized === "both" || normalized === "dual" || normalized === "bi" || normalized === "two-way") return "both";
  return fallback;
};

export const swingConfig: SwingConfig = {
  symbol: resolveSymbolFromEnv(),
  tradeAmount: parseNumber(process.env.SWING_TRADE_AMOUNT ?? process.env.TRADE_AMOUNT, 0.001),
  pollIntervalMs: parseNumber(process.env.SWING_POLL_INTERVAL_MS, parseNumber(process.env.POLL_INTERVAL_MS, 500)),
  maxLogEntries: parseNumber(process.env.SWING_MAX_LOG_ENTRIES, parseNumber(process.env.MAX_LOG_ENTRIES, 200)),
  maxCloseSlippagePct: parseNumber(
    process.env.SWING_MAX_CLOSE_SLIPPAGE_PCT ?? process.env.MAX_CLOSE_SLIPPAGE_PCT,
    0.05
  ),
  priceTick: parseNumber(process.env.SWING_PRICE_TICK ?? process.env.PRICE_TICK, 0.1),
  qtyStep: parseNumber(process.env.SWING_QTY_STEP ?? process.env.QTY_STEP, 0.001),
  direction: resolveSwingDirection(process.env.SWING_DIRECTION, "short"),
  rsiPeriod: Math.max(1, Math.floor(parseNumber(process.env.SWING_RSI_PERIOD, 14))),
  rsiHigh: parseNumber(process.env.SWING_RSI_HIGH, 70),
  rsiLow: parseNumber(process.env.SWING_RSI_LOW, 30),
  stopLossPct: Math.max(0, parseNumber(process.env.SWING_STOP_LOSS_PCT, 0.05)),
  signalSymbol: (process.env.SWING_SIGNAL_SYMBOL ?? "ETHBTC").trim().toUpperCase(),
  signalInterval: (process.env.SWING_SIGNAL_INTERVAL ?? "4h").trim(),
};

export function isBasisStrategyEnabled(): boolean {
  const raw = process.env.ENABLE_BASIS_STRATEGY;
  if (!raw) return false;
  const normalized = raw.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export const uiLanguage: Language = language;
