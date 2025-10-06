import { describe, expect, it, vi } from 'vitest';
import type { ExchangeAdapter } from '../src/exchanges/adapter';
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker } from '../src/exchanges/types';
import { BasisArbEngine } from '../src/strategy/basis-arb-engine';

class StubAdapter implements ExchangeAdapter {
   id = 'aster';
   private depthHandler: ((depth: AsterDepth) => void) | null = null;

   supportsTrailingStops(): boolean {
      return false;
   }

   watchAccount(_cb: (snapshot: AsterAccountSnapshot) => void): void {
      // not required for this test
   }

   watchOrders(_cb: (orders: AsterOrder[]) => void): void {
      // not required for this test
   }

   watchDepth(_symbol: string, cb: (depth: AsterDepth) => void): void {
      this.depthHandler = cb;
   }

   emitDepth(depth: AsterDepth): void {
      this.depthHandler?.(depth);
   }

   watchTicker(_symbol: string, _cb: (ticker: AsterTicker) => void): void {
      // not required for this test
   }

   watchKlines(_symbol: string, _interval: string, _cb: (klines: AsterKline[]) => void): void {
      // not required for this test
   }

   createOrder(): Promise<AsterOrder> {
      throw new Error('not implemented');
   }

   cancelOrder(_params: { symbol: string; orderId: number | string }): Promise<void> {
      return Promise.resolve();
   }

   cancelOrders(_params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
      return Promise.resolve();
   }

   cancelAllOrders(_params: { symbol: string }): Promise<void> {
      return Promise.resolve();
   }
}

describe('BasisArbEngine', () => {
   it('computes spreads after receiving futures depth and spot quotes', async () => {
      const adapter = new StubAdapter();
      const spotClient = { getBookTicker: vi.fn().mockResolvedValue({ symbol: 'ASTERUSDT', bidPrice: '1.0000', bidQty: '1', askPrice: '1.0500', askQty: '1', time: 2_000 }) };

      const engine = new BasisArbEngine({ futuresSymbol: 'ASTERUSDT', spotSymbol: 'ASTERUSDT', refreshIntervalMs: 1_000, maxLogEntries: 10, takerFeeRate: 0.0004 }, adapter, { spotClient, now: () => 1_000 });

      engine.start();

      adapter.emitDepth({ lastUpdateId: 1, bids: [['1.0400', '1']], asks: [['1.0600', '1']], eventTime: 1_500 });

      await vi.waitFor(() => {
         expect(spotClient.getBookTicker).toHaveBeenCalled();
         const snap = engine.getSnapshot();
         expect(snap.spotBid).not.toBeNull();
         expect(snap.futuresBid).not.toBeNull();
      });

      const snapshot = engine.getSnapshot();
      expect(snapshot.spread).toBeCloseTo(1.04 - 1.05, 6);
      expect(snapshot.spreadBps).toBeCloseTo(((1.04 - 1.05) / 1.05) * 10_000, 6);
      const fee = 0.0004;
      const effectiveFee = fee * 2;
      const expectedNet = 1.04 * (1 - effectiveFee) - 1.05 * (1 + effectiveFee);
      expect(snapshot.netSpread).toBeCloseTo(expectedNet, 6);
      expect(snapshot.netSpreadBps).toBeCloseTo((expectedNet / 1.05) * 10_000, 6);
      expect(snapshot.feedStatus).toEqual({ futures: true, spot: true });
      expect(snapshot.opportunity).toBe(expectedNet >= 0);

      engine.stop();
   });
});
