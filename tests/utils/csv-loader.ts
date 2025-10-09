import { readFileSync } from 'node:fs';

export interface Kline {
   timestamp: number;
   open: number;
   high: number;
   low: number;
   close: number;
   volume: number;
}

export interface PriceRange {
   low: number;
   high: number;
   mean: number;
}

/**
 * 加载 CSV 格式的K线数据
 *
 * 支持的 CSV 格式:
 * timestamp,open,high,low,close,volume
 * 1609459200000,29000.5,29500.0,28800.0,29200.0,1234.56
 */
export function loadCsvData(filePath: string): Kline[] {
   const fileContent = readFileSync(filePath, 'utf-8');
   const lines = fileContent.trim().split('\n');

   // 跳过标题行
   const dataLines = lines[0]?.toLowerCase().includes('timestamp') ? lines.slice(1) : lines;

   return dataLines.filter(line => line.trim().length > 0).map(line => {
      const [timestamp, open, high, low, close, volume] = line.split(',').map(s => s.trim());
      return { timestamp: Number(timestamp), open: Number(open), high: Number(high), low: Number(low), close: Number(close), volume: Number(volume || 0) };
   }).filter(kline => Number.isFinite(kline.timestamp) && Number.isFinite(kline.open) && Number.isFinite(kline.high) && Number.isFinite(kline.low) && Number.isFinite(kline.close));
}

/**
 * 计算K线数据的价格范围
 */
export function calculatePriceRange(klines: Kline[]): PriceRange {
   if (klines.length === 0) {
      return { low: 0, high: 0, mean: 0 };
   }

   const lows = klines.map(k => k.low);
   const highs = klines.map(k => k.high);
   const closes = klines.map(k => k.close);

   const low = Math.min(...lows);
   const high = Math.max(...highs);
   const mean = closes.reduce((sum, c) => sum + c, 0) / closes.length;

   return { low, high, mean };
}

/**
 * 计算价格波动率（标准差）
 */
export function calculateVolatility(klines: Kline[]): number {
   if (klines.length < 2) { return 0; }

   const returns = [];
   for (let i = 1; i < klines.length; i++) {
      const ret = (klines[i]!.close - klines[i - 1]!.close) / klines[i - 1]!.close;
      returns.push(ret);
   }

   const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
   const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;

   return Math.sqrt(variance);
}

/**
 * 检测市场状态（趋势/震荡）
 */
export function detectMarketState(klines: Kline[]): 'trending' | 'ranging' | 'unknown' {
   if (klines.length < 2) { return 'unknown'; }

   const firstPrice = klines[0]!.close;
   const lastPrice = klines[klines.length - 1]!.close;
   const priceChange = Math.abs(lastPrice - firstPrice) / firstPrice;

   // 价格变化超过10%认为是趋势
   if (priceChange > 0.1) { return 'trending'; }

   // 否则认为是震荡
   return 'ranging';
}

/**
 * 生成时间范围描述
 */
export function getTimeRangeDescription(klines: Kline[]): string {
   if (klines.length === 0) { return 'No data'; }

   const startTime = new Date(klines[0]!.timestamp);
   const endTime = new Date(klines[klines.length - 1]!.timestamp);
   const durationMs = endTime.getTime() - startTime.getTime();
   const durationHours = durationMs / (1000 * 60 * 60);
   const durationDays = durationHours / 24;

   if (durationDays >= 1) {
      return `${durationDays.toFixed(1)} days (${startTime.toISOString().slice(0, 10)} to ${endTime.toISOString().slice(0, 10)})`;
   }
   return `${durationHours.toFixed(1)} hours`;
}

/**
 * 数据质量检查
 */
export function validateKlines(klines: Kline[]): { valid: boolean; errors: string[] } {
   const errors: string[] = [];

   if (klines.length === 0) {
      errors.push('No data points');
      return { valid: false, errors };
   }

   // 检查时间序列
   for (let i = 1; i < klines.length; i++) {
      if (klines[i]!.timestamp <= klines[i - 1]!.timestamp) {
         errors.push(`Timestamp not increasing at index ${i}`);
      }
   }

   // 检查价格合理性
   for (let i = 0; i < klines.length; i++) {
      const k = klines[i]!;
      if (k.high < k.low) {
         errors.push(`High < Low at index ${i}`);
      }
      if (k.close > k.high || k.close < k.low) {
         errors.push(`Close outside [Low, High] at index ${i}`);
      }
      if (k.open > k.high || k.open < k.low) {
         errors.push(`Open outside [Low, High] at index ${i}`);
      }
   }

   return { valid: errors.length === 0, errors };
}
