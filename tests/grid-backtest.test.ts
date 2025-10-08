import { describe, expect, it, vi } from 'vitest';
import type { GridConfig } from '../src/config';
import { loadCsvOHLCV } from '../src/data/csv-loader';
import type { ExchangeAdapter } from '../src/exchanges/adapter';
import type { AsterAccountSnapshot, AsterDepth, AsterOrder, AsterTicker, CreateOrderParams } from '../src/exchanges/types';
import { GridEngine } from '../src/strategy/grid-engine';

class StubAdapter implements ExchangeAdapter {
   id = 'grvt';

   private accountHandler: ((snapshot: AsterAccountSnapshot) => void) | null = null;
   private orderHandler: ((orders: AsterOrder[]) => void) | null = null;
   private depthHandler: ((depth: AsterDepth) => void) | null = null;
   private tickerHandler: ((ticker: AsterTicker) => void) | null = null;
   private currentOrders: AsterOrder[] = [];

   public createdOrders: CreateOrderParams[] = [];
   public marketOrders: CreateOrderParams[] = [];
   public cancelAllCount = 0;

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

   watchKlines(): void {
      // not used in tests
   }

   emitAccount(snapshot: AsterAccountSnapshot): void {
      this.accountHandler?.(snapshot);
   }

   emitOrders(orders: AsterOrder[]): void {
      this.orderHandler?.(orders);
   }

   emitDepth(depth: AsterDepth): void {
      this.depthHandler?.(depth);
   }

   emitTicker(ticker: AsterTicker): void {
      this.tickerHandler?.(ticker);
   }

   async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
      const order: AsterOrder = {
         orderId: `${Date.now()}-${Math.random()}`,
         clientOrderId: 'test',
         symbol: params.symbol,
         side: params.side,
         type: params.type,
         status: params.type === 'MARKET' ? 'FILLED' : 'NEW',
         price: Number(params.price ?? 0).toString(),
         origQty: Number(params.quantity ?? 0).toString(),
         executedQty: '0',
         stopPrice: '0',
         time: Date.now(),
         updateTime: Date.now(),
         reduceOnly: params.reduceOnly === 'true',
         closePosition: false,
      };
      this.createdOrders.push(params);
      if (params.type === 'MARKET') {
         this.marketOrders.push(params);
         this.orderHandler?.([]);
      } else {
         this.currentOrders = [order];
         this.orderHandler?.(this.currentOrders);
      }
      return order;
   }

   async cancelOrder(): Promise<void> {
      // no-op
   }

   async cancelOrders(): Promise<void> {
      // no-op
   }

   async cancelAllOrders(): Promise<void> {
      this.cancelAllCount += 1;
      this.currentOrders = [];
      this.orderHandler?.([]);
   }
}

function createAccountSnapshot(symbol: string, positionAmt: number): AsterAccountSnapshot {
   return { canTrade: true, canDeposit: true, canWithdraw: true, updateTime: Date.now(), totalWalletBalance: '0', totalUnrealizedProfit: '0', positions: [], assets: [] } as unknown as AsterAccountSnapshot;
}

describe('GridEngine backtest', () => {
   const baseConfig: GridConfig = {
      symbol: 'BTCUSDT',
      lowerPrice: 121400,
      upperPrice: 125400,
      gridLevels: 20,
      orderSize: 0.002,
      maxPositionSize: 0.01,
      refreshIntervalMs: 10,
      maxLogEntries: 5000,
      priceTick: 0.1,
      qtyStep: 0.001,
      direction: 'both',
      stopLossPct: 0.03,
      restartTriggerPct: 0.03,
      autoRestart: true,
      gridMode: 'geometric',
      maxCloseSlippagePct: 0.05,
   };

   it('backtest by BTC-1m.csv', async () => {
      const adapter = new StubAdapter();
      const engine = new GridEngine(baseConfig, adapter, { now: () => 0 });

      const symbol = baseConfig.symbol;
      const symbol0 = symbol.replaceAll('USDT', '');
      const tf = '1m';
      let accountSnapshot = createAccountSnapshot(baseConfig.symbol, 100);
      console.log(accountSnapshot);
      adapter.emitAccount(accountSnapshot);
      adapter.emitOrders([]);

      const targetSeries = loadCsvOHLCV(`tests/data/${symbol0}-${tf}.csv`, {
         symbol: symbol,
         expectHeader: true,
         columns: {
            time: 'time', //
            open: 'open',
            high: 'high',
            low: 'low',
            close: 'close',
            volume: 'volume',
         },
      });
      for (let s of targetSeries) {
         adapter.emitTicker({
            symbol,
            lastPrice: s.close.toString(), //
            openPrice: s.open.toString(),
            highPrice: s.high.toString(),
            lowPrice: s.low.toString(),
            volume: s.volume.toString(),
            quoteVolume: '0',
         });
         const gridSnapshot = engine.getSnapshot();
         // console.log(gridSnapshot.feedStatus);
         if (gridSnapshot.openOrders.length > 0) { console.log(gridSnapshot.openOrders); }
         if (gridSnapshot.desiredOrders.length > 0) { console.log(gridSnapshot.desiredOrders); }
      }
      const gridSnapshot = engine.getSnapshot();
      console.log(Object.keys(gridSnapshot), gridSnapshot.position);

      // use internal syncGrid to generate orders without waiting for timers
      const desired = (engine as any).computeDesiredOrders(150) as Array<{ side: string; price: string }>;
      // console.log(desired);

      engine.stop();
   });
});
