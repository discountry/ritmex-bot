import { extractMessage } from '../utils/errors';
import type { AccountListener, DepthListener, ExchangeAdapter, KlineListener, OrderListener, TickerListener } from './adapter';
import { AsterGateway } from './aster/client';
import type { AsterDepth, AsterKline, AsterOrder, AsterTicker, CreateOrderParams } from './types';

export interface AsterCredentials {
   apiKey?: string;
   apiSecret?: string;
   symbol?: string;
}

export class AsterExchangeAdapter implements ExchangeAdapter {
   readonly id = 'aster';
   private readonly gateway: AsterGateway;
   private readonly symbol: string;
   private initPromise: Promise<void> | null = null;
   private lastInitErrorAt = 0;
   private readonly initContexts = new Set<string>();
   private retryTimer: ReturnType<typeof setTimeout> | null = null;
   private retryDelayMs = 3000;

   constructor(credentials: AsterCredentials = {}) {
      this.gateway = new AsterGateway({ apiKey: credentials.apiKey, apiSecret: credentials.apiSecret });
      this.symbol = (credentials.symbol ?? process.env.TRADE_SYMBOL ?? 'BTCUSDT').toUpperCase();
   }

   supportsTrailingStops(): boolean {
      return true;
   }

   private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
      const wrapped = ((...args: any[]) => {
         try {
            cb(...args);
         } catch (error) {
            console.error(`[AsterExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
         }
      }) as T;
      return wrapped;
   }

   private ensureInitialized(context?: string): Promise<void> {
      if (!this.initPromise) {
         this.initContexts.clear();
         this.initPromise = this.gateway.ensureInitialized(this.symbol).then((value) => {
            this.clearRetry();
            return value;
         }).catch((error) => {
            this.handleInitError('initialize', error);
            this.initPromise = null;
            this.scheduleRetry();
            throw error;
         });
      }
      if (context && !this.initContexts.has(context)) {
         this.initContexts.add(context);
         this.initPromise.catch((error) => {
            this.handleInitError(context, error);
            this.scheduleRetry();
         });
      }
      return this.initPromise;
   }

   private scheduleRetry(): void {
      if (this.retryTimer) { return; }
      this.retryTimer = setTimeout(() => {
         this.retryTimer = null;
         if (this.initPromise) { return; }
         this.retryDelayMs = Math.min(this.retryDelayMs * 2, 60_000);
         void this.ensureInitialized('retry');
      }, this.retryDelayMs);
   }

   private clearRetry(): void {
      if (this.retryTimer) {
         clearTimeout(this.retryTimer);
         this.retryTimer = null;
      }
      this.retryDelayMs = 3000;
   }

   private handleInitError(context: string, error: unknown): void {
      const now = Date.now();
      if (now - this.lastInitErrorAt < 5000) { return; }
      this.lastInitErrorAt = now;
      console.error(`[AsterExchangeAdapter] ${context} failed`, error);
   }

   watchAccount(cb: AccountListener): void {
      void this.ensureInitialized('watchAccount');
      this.gateway.onAccount(this.safeInvoke('watchAccount', (snapshot) => {
         cb(snapshot);
      }));
   }

   watchOrders(cb: OrderListener): void {
      void this.ensureInitialized('watchOrders');
      this.gateway.onOrders(this.safeInvoke('watchOrders', (orders) => {
         cb(orders);
      }));
   }

   watchDepth(symbol: string, cb: DepthListener): void {
      void this.ensureInitialized('watchDepth');
      this.gateway.onDepth(
         symbol,
         this.safeInvoke('watchDepth', (depth: AsterDepth) => {
            cb(depth);
         }),
      );
   }

   watchTicker(symbol: string, cb: TickerListener): void {
      void this.ensureInitialized('watchTicker');
      this.gateway.onTicker(
         symbol,
         this.safeInvoke('watchTicker', (ticker: AsterTicker) => {
            cb(ticker);
         }),
      );
   }

   watchKlines(symbol: string, interval: string, cb: KlineListener): void {
      void this.ensureInitialized('watchKlines');
      this.gateway.onKlines(
         symbol,
         interval,
         this.safeInvoke('watchKlines', (klines: AsterKline[]) => {
            cb(klines);
         }),
      );
   }

   async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
      await this.ensureInitialized('createOrder');
      return this.gateway.createOrder(params);
   }

   async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
      await this.ensureInitialized('cancelOrder');
      await this.gateway.cancelOrder({ symbol: params.symbol, orderId: Number(params.orderId) });
   }

   async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
      await this.ensureInitialized('cancelOrders');
      await this.gateway.cancelOrders({ symbol: params.symbol, orderIdList: params.orderIdList });
   }

   async cancelAllOrders(params: { symbol: string }): Promise<void> {
      await this.ensureInitialized('cancelAllOrders');
      await this.gateway.cancelAllOrders(params);
   }
}
