/**
 * 简化的回测测试 - 用于快速验证功能
 */

import { describe, expect, it } from 'vitest';
import type { CreateOrderParams } from '../src/exchanges/types';
import { calculateBacktestStats } from './utils/backtest-simulator';
import { calculatePriceRange, validateKlines } from './utils/csv-loader';

describe('Simple Backtest Utils Test', () => {
   it('should validate empty kline array', () => {
      const klines: Array<{ timestamp: number; open: number; high: number; low: number; close: number; volume: number }> = [];
      const range = calculatePriceRange(klines);

      expect(range.low).toBe(0);
      expect(range.high).toBe(0);
      expect(range.mean).toBe(0);
   });

   it('should validate correct kline data structure', () => {
      const klines = [{ timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 }, { timestamp: 2000, open: 105, high: 115, low: 100, close: 110, volume: 1500 }];

      const validation = validateKlines(klines);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
   });

   it('should calculate correct price range', () => {
      const klines = [{ timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 }, { timestamp: 2000, open: 105, high: 115, low: 100, close: 110, volume: 1500 }];

      const range = calculatePriceRange(klines);

      expect(range.low).toBe(95);
      expect(range.high).toBe(115);
   });

   it('should detect invalid kline where high < low', () => {
      const invalidKlines = [{ timestamp: 1000, open: 100, high: 90, low: 95, close: 92, volume: 1000 }];

      const validation = validateKlines(invalidKlines);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
   });

   it('should calculate backtest stats for simple trades', () => {
      const orders: CreateOrderParams[] = [
         { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', price: 100, quantity: 1 }, //
         { symbol: 'BTCUSDT', side: 'SELL', type: 'LIMIT', price: 110, quantity: 1 },
      ];

      const stats = calculateBacktestStats(orders);

      expect(stats.totalTrades).toBe(1);
      expect(stats.profitTrades).toBe(1);
      expect(stats.lossTrades).toBe(0);
      expect(stats.totalPnL).toBe(10);
   });

   it('should handle empty order list', () => {
      const orders: CreateOrderParams[] = [];
      const stats = calculateBacktestStats(orders);

      expect(stats.totalTrades).toBe(0);
      expect(stats.totalPnL).toBe(0);
      expect(stats.winRate).toBe(0);
   });
});
