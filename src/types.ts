export type Timeframe = '15m' | '30m' | '1h' | '4h';

export interface OHLCV {
   ts: number; // epoch ms
   open: number;
   high: number;
   low: number;
   close: number;
   volume: number;
   symbol?: string;
}

export interface LoadOptions {
   symbol?: string;
   tz?: string; // reserved
   expectHeader?: boolean;
   columns?: { time: string; open: string; high: string; low: string; close: string; volume: string };
}

export interface ResampleOptions {
   targetTf: Timeframe;
   alignMode?: 'close' | 'open'; // bucket close/open timestamp
}

export function parseTimeToMs(value: string): number {
   const trimmed = value.trim();
   // numeric epoch (ms or s)
   if (/^\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      // heuristics: >= 10^12 -> ms, else s
      return num >= 1_000_000_000_000 ? num : num * 1000;
   }
   const d = new Date(trimmed);
   const ms = d.getTime();
   if (!Number.isFinite(ms)) { throw new Error('Invalid time: ' + value); }
   return ms;
}

export type SignalAction = 'BUY' | 'SELL' | 'HOLD';

export interface Signal {
   action: SignalAction;
   reason?: string;
   price?: number;
   sma?: number | null;
   bandwidth?: number | null;
}

export interface StrategyContext {
   // multi-timeframe inputs
   auxSeries?: Record<string, OHLCV[]>; // key: timeframe string ("30m","1h","4h")
   auxSmaPeriod?: number; // SMA period for aux frames
   requireAllAgree?: boolean; // if true, all aux must agree with main trend
}

export interface StrategyConfig {
   smaPeriod: number; // e.g., 30
   bollingerLength: number;
   bollingerStdMultiplier: number;
   minBollingerBandwidth?: number; // ratio threshold
   // multi-timeframe filters
   auxTimeframes?: string[]; // e.g., ["30m","1h"]
   auxSmaPeriod?: number; // e.g., 30
   requireAllAgree?: boolean; // default true
   // EMA trend enhancement
   emaFastPeriod?: number;
   emaSlowPeriod?: number;
}

export interface IStrategy {
   init(config: StrategyConfig): void;
   next(bar: OHLCV, series: OHLCV[], ctx?: StrategyContext): Signal;
}
