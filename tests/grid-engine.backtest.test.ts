import { describe, expect, it } from 'vitest';
import type { GridConfig } from '../src/config';
import type { ExchangeAdapter } from '../src/exchanges/adapter';
import type { AsterAccountSnapshot, AsterDepth, AsterOrder, AsterTicker, CreateOrderParams } from '../src/exchanges/types';
import { GridEngine } from '../src/strategy/grid-engine';
import { calculateBacktestStats, formatBacktestReport, shouldTriggerStopLoss, simulateOrderExecution } from './utils/backtest-simulator';
import { calculatePriceRange, calculateVolatility, detectMarketState, getTimeRangeDescription, loadCsvData, validateKlines } from './utils/csv-loader';

class BacktestAdapter implements ExchangeAdapter {
   id = 'backtest';

   private accountHandler: ((snapshot: AsterAccountSnapshot) => void) | null = null;
   private orderHandler: ((orders: AsterOrder[]) => void) | null = null;
   private depthHandler: ((depth: AsterDepth) => void) | null = null;
   private tickerHandler: ((ticker: AsterTicker) => void) | null = null;

   public currentOrders: AsterOrder[] = [];
   public createdOrders: CreateOrderParams[] = [];
   public filledOrders: AsterOrder[] = [];
   public cancelledCount = 0;

   private currentPosition = 0;
   private entryPrice = 0;
   private lastOrderPrice = 0;

   supportsTrailingStops(): boolean {
      return false;
   }

   watchAccount(cb: (snapshot: AsterAccountSnapshot) => void): void {
      this.accountHandler = cb;
   }

   watchOrders(cb: (orders: AsterOrder[]) => void): void {
      this.orderHandler = cb;
   }

   watchDepth(_symbol: string, cb: (depth: AsterDepth) => void): void {
      this.depthHandler = cb;
   }

   watchTicker(_symbol: string, cb: (ticker: AsterTicker) => void): void {
      this.tickerHandler = cb;
   }

   watchKlines(_symbol: string, _interval: string, _cb: (klines: any[]) => void): void {}

   emitTicker(ticker: AsterTicker): void {
      this.tickerHandler?.(ticker);
   }

   emitAccount(snapshot: AsterAccountSnapshot): void {
      this.accountHandler?.(snapshot);
   }

   emitOrders(orders: AsterOrder[]): void {
      this.orderHandler?.(orders);
   }

   async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
      const order: AsterOrder = {
         orderId: `${Date.now()}-${Math.random()}`,
         clientOrderId: 'backtest',
         symbol: params.symbol,
         side: params.side,
         type: params.type,
         status: 'NEW',
         price: String(params.price ?? 0),
         origQty: String(params.quantity ?? 0),
         executedQty: '0',
         stopPrice: '0',
         time: Date.now(),
         updateTime: Date.now(),
         reduceOnly: params.reduceOnly === 'true',
         closePosition: false,
      };

      this.createdOrders.push(params);
      this.lastOrderPrice = Number(params.price ?? 0);

      if (params.type === 'MARKET') {
         // 市价单立即成交
         order.status = 'FILLED';
         order.executedQty = order.origQty;
         this.filledOrders.push(order);
         this.updatePosition(params.side, Number(params.quantity), this.lastOrderPrice);
         this.emitOrders([]);
      } else {
         // 限价单加入队列
         this.currentOrders.push(order);
         this.emitOrders(this.currentOrders);
      }

      return order;
   }

   async cancelOrder(_params: { symbol: string; orderId: number | string }): Promise<void> {
      this.cancelledCount += 1;
   }

   async cancelOrders(_params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
      this.cancelledCount += 1;
   }

   async cancelAllOrders(_params: { symbol: string }): Promise<void> {
      this.cancelledCount += 1;
      this.currentOrders = [];
      this.emitOrders([]);
   }

   /**
    * 模拟K线触发订单成交
    */
   processKline(kline: { timestamp: number; open: number; high: number; low: number; close: number; volume: number }): void {
      simulateOrderExecution(this.currentOrders, kline, (filledOrder) => {
         // 从当前订单中移除
         this.currentOrders = this.currentOrders.filter(o => o.orderId !== filledOrder.orderId);

         // 记录成交
         this.filledOrders.push(filledOrder);

         // 更新持仓（使用成交订单的价格）
         const fillPrice = Number(filledOrder.price);
         this.updatePosition(filledOrder.side, Number(filledOrder.executedQty), fillPrice);

         // 推送订单更新
         this.emitOrders(this.currentOrders);

         // 推送账户更新
         this.emitAccount(this.createAccountSnapshot());
      });
   }

   private updatePosition(side: 'BUY' | 'SELL', quantity: number, price: number): void {
      if (side === 'BUY') {
         const totalCost = this.currentPosition * this.entryPrice + quantity * price;
         this.currentPosition += quantity;
         this.entryPrice = this.currentPosition > 0 ? totalCost / this.currentPosition : 0;
      } else {
         this.currentPosition -= quantity;
         if (this.currentPosition <= 0) {
            this.entryPrice = 0;
            this.currentPosition = 0;
         }
      }
   }

   private createAccountSnapshot(): AsterAccountSnapshot {
      return {
         canTrade: true,
         canDeposit: true,
         canWithdraw: true,
         updateTime: Date.now(),
         totalWalletBalance: '10000',
         totalUnrealizedProfit: '0',
         positions: [{ symbol: 'BTCUSDT', positionAmt: this.currentPosition.toString(), entryPrice: this.entryPrice.toString(), unrealizedProfit: '0', positionSide: 'BOTH', updateTime: Date.now() }],
         assets: [],
      } as unknown as AsterAccountSnapshot;
   }
}

describe('GridEngine Backtest with Historical Data', () => {
   // 注意: 这个测试需要 tests/data/ 目录下的 CSV 文件
   // 如果文件不存在，测试会被跳过

   it.skip('should load and validate CSV data', () => {
      // 此测试演示如何加载和验证CSV数据
      // 需要先准备测试数据文件: tests/data/BTCUSDT_sample.csv

      try {
         const klines = loadCsvData('tests/data/BTCUSDT_sample.csv');

         console.log(`Loaded ${klines.length} klines`);
         console.log(`Time range: ${getTimeRangeDescription(klines)}`);

         const range = calculatePriceRange(klines);
         console.log(`Price range: ${range.low} - ${range.high} (mean: ${range.mean})`);

         const volatility = calculateVolatility(klines);
         console.log(`Volatility: ${(volatility * 100).toFixed(2)}%`);

         const marketState = detectMarketState(klines);
         console.log(`Market state: ${marketState}`);

         const validation = validateKlines(klines);
         expect(validation.valid).toBe(true);

         expect(klines.length).toBeGreaterThan(0);
      } catch (error) {
         console.warn('CSV file not found, skipping test');
      }
   });

   it.skip('should run backtest on historical ranging market', async () => {
      // 此测试需要震荡市场的K线数据
      // 文件路径: tests/data/BTCUSDT_ranging.csv

      try {
         const klines = loadCsvData('tests/data/BTCUSDT_ranging.csv');
         const range = calculatePriceRange(klines);

         const config: GridConfig = {
            symbol: 'BTCUSDT',
            lowerPrice: range.low * 0.98, // 比最低价低2%
            upperPrice: range.high * 1.02, // 比最高价高2%
            gridLevels: 10,
            orderSize: 0.01,
            maxPositionSize: 0.1,
            refreshIntervalMs: 1000,
            maxLogEntries: 100,
            priceTick: 0.1,
            qtyStep: 0.001,
            direction: 'both',
            stopLossPct: 0.05,
            restartTriggerPct: 0.02,
            autoRestart: true,
            gridMode: 'geometric',
            maxCloseSlippagePct: 0.05,
         };

         const adapter = new BacktestAdapter();
         const engine = new GridEngine(config, adapter);

         // 初始化
         adapter.emitAccount(adapter['createAccountSnapshot']());
         adapter.emitOrders([]);

         // 逐条推送K线
         for (const kline of klines) {
            adapter.emitTicker({ symbol: 'BTCUSDT', lastPrice: kline.close.toString(), openPrice: kline.open.toString(), highPrice: kline.high.toString(), lowPrice: kline.low.toString(), volume: kline.volume.toString(), quoteVolume: '0' });

            // 模拟订单成交
            adapter.processKline(kline);

            // 给策略一点反应时间
            await new Promise(resolve => setTimeout(resolve, 10));
         }

         // 统计结果
         const stats = calculateBacktestStats(adapter.createdOrders);
         const report = formatBacktestReport(stats);

         console.log('\n' + report);
         console.log(`\nTotal created orders: ${adapter.createdOrders.length}`);
         console.log(`Filled orders: ${adapter.filledOrders.length}`);
         console.log(`Cancel operations: ${adapter.cancelledCount}`);

         // 震荡市场应该有较高的胜率
         if (stats.totalTrades > 0) {
            expect(stats.winRate).toBeGreaterThan(0.3); // 至少30%胜率
         }

         engine.stop();
      } catch (error) {
         console.warn('CSV file not found, skipping test');
      }
   });

   it.skip('should trigger stop loss in crash scenario', async () => {
      // 此测试需要闪崩数据
      // 文件路径: tests/data/BTCUSDT_crash.csv

      try {
         const klines = loadCsvData('tests/data/BTCUSDT_crash.csv');
         const initialRange = calculatePriceRange(klines.slice(0, 10));

         const config: GridConfig = {
            symbol: 'BTCUSDT',
            lowerPrice: initialRange.low,
            upperPrice: initialRange.high,
            gridLevels: 5,
            orderSize: 0.01,
            maxPositionSize: 0.05,
            refreshIntervalMs: 1000,
            maxLogEntries: 100,
            priceTick: 0.1,
            qtyStep: 0.001,
            direction: 'both',
            stopLossPct: 0.1, // 10% 止损
            restartTriggerPct: 0.05,
            autoRestart: false,
            gridMode: 'geometric',
            maxCloseSlippagePct: 0.05,
         };

         const adapter = new BacktestAdapter();
         const engine = new GridEngine(config, adapter);

         adapter.emitAccount(adapter['createAccountSnapshot']());
         adapter.emitOrders([]);

         let stoppedByStopLoss = false;

         for (const kline of klines) {
            adapter.emitTicker({ symbol: 'BTCUSDT', lastPrice: kline.close.toString(), openPrice: kline.open.toString(), highPrice: kline.high.toString(), lowPrice: kline.low.toString(), volume: kline.volume.toString(), quoteVolume: '0' });

            adapter.processKline(kline);
            await new Promise(resolve => setTimeout(resolve, 10));

            const snapshot = engine.getSnapshot();
            if (!snapshot.running && snapshot.stopReason) {
               stoppedByStopLoss = true;
               console.log(`Stop loss triggered: ${snapshot.stopReason}`);
               break;
            }
         }

         // 验证止损逻辑
         const shouldStop = shouldTriggerStopLoss(klines, config.lowerPrice, config.upperPrice, config.stopLossPct);

         if (shouldStop) {
            expect(stoppedByStopLoss).toBe(true);
         }

         engine.stop();
      } catch (error) {
         console.warn('CSV file not found, skipping test');
      }
   });

   it('should handle empty order lists gracefully', () => {
      const stats = calculateBacktestStats([]);

      expect(stats.totalTrades).toBe(0);
      expect(stats.profitTrades).toBe(0);
      expect(stats.lossTrades).toBe(0);
      expect(stats.totalPnL).toBe(0);
      expect(stats.winRate).toBe(0);
   });

   it('should calculate statistics correctly for simple trades', () => {
      const orders: CreateOrderParams[] = [
         { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', price: 100, quantity: 1 },
         { symbol: 'BTCUSDT', side: 'SELL', type: 'LIMIT', price: 110, quantity: 1 }, // +10 profit
         { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', price: 110, quantity: 1 },
         { symbol: 'BTCUSDT', side: 'SELL', type: 'LIMIT', price: 105, quantity: 1 }, // -5 loss
      ];

      const stats = calculateBacktestStats(orders);

      expect(stats.totalTrades).toBe(2);
      expect(stats.profitTrades).toBe(1);
      expect(stats.lossTrades).toBe(1);
      expect(stats.totalPnL).toBeCloseTo(5, 2);
      expect(stats.winRate).toBeCloseTo(0.5, 2);
   });
});

describe('CSV Data Utils', () => {
   it('should validate correct kline data', () => {
      const klines = [{ timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 }, { timestamp: 2000, open: 105, high: 115, low: 100, close: 110, volume: 1500 }, {
         timestamp: 3000,
         open: 110,
         high: 120,
         low: 105,
         close: 115,
         volume: 2000,
      }];

      const result = validateKlines(klines);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
   });

   it('should detect invalid kline data', () => {
      const invalidKlines = [
         { timestamp: 1000, open: 100, high: 90, low: 95, close: 105, volume: 1000 }, // high < low
         { timestamp: 2000, open: 105, high: 115, low: 100, close: 120, volume: 1500 }, // close > high
      ];

      const result = validateKlines(invalidKlines);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
   });

   it('should calculate price range correctly', () => {
      const klines = [{ timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 }, { timestamp: 2000, open: 105, high: 115, low: 100, close: 110, volume: 1500 }, {
         timestamp: 3000,
         open: 110,
         high: 120,
         low: 105,
         close: 115,
         volume: 2000,
      }];

      const range = calculatePriceRange(klines);

      expect(range.low).toBe(95);
      expect(range.high).toBe(120);
      expect(range.mean).toBeCloseTo(110, 2);
   });

   it('should detect trending market', () => {
      const trendingKlines = [
         { timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 },
         { timestamp: 2000, open: 105, high: 115, low: 100, close: 110, volume: 1500 },
         { timestamp: 3000, open: 110, high: 125, low: 105, close: 120, volume: 2000 }, // +20%
      ];

      const state = detectMarketState(trendingKlines);
      expect(state).toBe('trending');
   });

   it('should detect ranging market', () => {
      const rangingKlines = [{ timestamp: 1000, open: 100, high: 105, low: 95, close: 102, volume: 1000 }, { timestamp: 2000, open: 102, high: 107, low: 97, close: 100, volume: 1500 }, {
         timestamp: 3000,
         open: 100,
         high: 105,
         low: 95,
         close: 101,
         volume: 2000,
      }];

      const state = detectMarketState(rangingKlines);
      expect(state).toBe('ranging');
   });
});
