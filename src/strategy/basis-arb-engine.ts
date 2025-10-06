import type { BasisArbConfig } from '../config';
import type { ExchangeAdapter } from '../exchanges/adapter';
import { AsterSpotRestClient } from '../exchanges/aster/client';
import type { AsterDepth, AsterSpotBookTicker } from '../exchanges/types';
import { createTradeLog, type TradeLogEntry } from '../logging/trade-log';
import { StrategyEventEmitter } from './common/event-emitter';
import { type LogHandler, safeSubscribe } from './common/subscriptions';

export interface BasisArbSnapshot {
   ready: boolean;
   futuresSymbol: string;
   spotSymbol: string;
   futuresBid: number | null;
   futuresAsk: number | null;
   spotBid: number | null;
   spotAsk: number | null;
   futuresLastUpdate: number | null;
   spotLastUpdate: number | null;
   spread: number | null;
   spreadBps: number | null;
   netSpread: number | null;
   netSpreadBps: number | null;
   lastUpdated: number | null;
   tradeLog: TradeLogEntry[];
   feedStatus: { futures: boolean; spot: boolean };
   opportunity: boolean;
}

type BasisArbEvent = 'update';
type BasisArbListener = (snapshot: BasisArbSnapshot) => void;

interface BasisArbDependencies {
   spotClient?: Pick<AsterSpotRestClient, 'getBookTicker'>;
   now?: () => number;
}

interface DepthState {
   bid: number | null;
   ask: number | null;
   updatedAt: number | null;
}

interface SpotState {
   bid: number | null;
   ask: number | null;
   updatedAt: number | null;
}

export class BasisArbEngine {
   private readonly events = new StrategyEventEmitter<BasisArbEvent, BasisArbSnapshot>();
   private readonly tradeLog: ReturnType<typeof createTradeLog>;
   private readonly spotClient: Pick<AsterSpotRestClient, 'getBookTicker'>;
   private readonly now: () => number;
   private readonly config: BasisArbConfig;
   private readonly exchange: ExchangeAdapter;

   private readonly futures: DepthState = { bid: null, ask: null, updatedAt: null };
   private readonly spot: SpotState = { bid: null, ask: null, updatedAt: null };

   private readonly feedReady = { futures: false, spot: false };

   private timer: ReturnType<typeof setInterval> | null = null;
   private spotInFlight = false;
   private stopped = false;

   constructor(config: BasisArbConfig, exchange: ExchangeAdapter, deps: BasisArbDependencies = {}) {
      this.config = config;
      this.exchange = exchange;
      this.spotClient = deps.spotClient ?? new AsterSpotRestClient();
      this.now = deps.now ?? (() => Date.now());
      this.tradeLog = createTradeLog(this.config.maxLogEntries);
      this.bootstrap();
   }

   start(): void {
      if (this.timer) { return; }
      this.timer = setInterval(() => {
         void this.pollSpot();
      }, Math.max(this.config.refreshIntervalMs, 200));
      void this.pollSpot();
   }

   stop(): void {
      this.stopped = true;
      if (this.timer) {
         clearInterval(this.timer);
         this.timer = null;
      }
   }

   on(event: BasisArbEvent, handler: BasisArbListener): void {
      this.events.on(event, handler);
   }

   off(event: BasisArbEvent, handler: BasisArbListener): void {
      this.events.off(event, handler);
   }

   getSnapshot(): BasisArbSnapshot {
      return this.buildSnapshot();
   }

   private bootstrap(): void {
      const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

      safeSubscribe<AsterDepth>(
         this.exchange.watchDepth.bind(this.exchange, this.config.futuresSymbol),
         (depth) => {
            this.applyFuturesDepth(depth);
         },
         log,
         { subscribeFail: (error) => `订阅期货深度失败: ${String(error)}`, processFail: (error) => `处理期货深度异常: ${String(error)}` },
      );
   }

   private applyFuturesDepth(depth: AsterDepth): void {
      if (!depth?.bids?.length || !depth?.asks?.length) {
         return;
      }
      const topBid = Number(depth.bids[0]?.[0]);
      const topAsk = Number(depth.asks[0]?.[0]);
      if (!Number.isFinite(topBid) || !Number.isFinite(topAsk)) {
         return;
      }
      this.futures.bid = topBid;
      this.futures.ask = topAsk;
      this.futures.updatedAt = depth.eventTime ?? depth.tradeTime ?? this.now();
      if (!this.feedReady.futures) {
         this.feedReady.futures = true;
         this.tradeLog.push('info', `期货深度已就绪 (${this.config.futuresSymbol})`);
      }
      this.emitUpdate();
   }

   private async pollSpot(): Promise<void> {
      if (this.spotInFlight || this.stopped) { return; }
      this.spotInFlight = true;
      try {
         const result = await this.spotClient.getBookTicker(this.config.spotSymbol);
         const ticker = Array.isArray(result) ? result[0] : result;
         if (!ticker) { return; }
         this.applySpotTicker(ticker);
      } catch (error) {
         this.feedReady.spot = false;
         this.tradeLog.push('error', `获取现货盘口失败: ${String(error instanceof Error ? error.message : error)}`);
      } finally {
         this.spotInFlight = false;
      }
   }

   private applySpotTicker(ticker: AsterSpotBookTicker): void {
      const bid = Number(ticker.bidPrice);
      const ask = Number(ticker.askPrice);
      if (!Number.isFinite(bid) || !Number.isFinite(ask)) {
         return;
      }
      this.spot.bid = bid;
      this.spot.ask = ask;
      this.spot.updatedAt = ticker.time ?? this.now();
      if (!this.feedReady.spot) {
         this.feedReady.spot = true;
         this.tradeLog.push('info', `现货盘口已就绪 (${this.config.spotSymbol})`);
      }
      this.emitUpdate();
   }

   private emitUpdate(): void {
      this.events.emit('update', this.buildSnapshot(), (error) => {
         this.tradeLog.push('error', `推送订阅失败: ${String(error)}`);
      });
   }

   private buildSnapshot(): BasisArbSnapshot {
      const futuresBid = this.futures.bid;
      const futuresAsk = this.futures.ask;
      const spotBid = this.spot.bid;
      const spotAsk = this.spot.ask;
      const spread = this.computeSpread(futuresBid, spotAsk);
      const spreadBps = this.computeSpreadBps(spread, spotAsk);
      const netSpread = this.computeNetSpread(futuresBid, spotAsk);
      const netSpreadBps = this.computeSpreadBps(netSpread, spotAsk);
      const opportunity = netSpread !== null && netSpread >= 0;
      const lastUpdated = Math.max(futuresBid !== null && this.futures.updatedAt ? this.futures.updatedAt : 0, spotBid !== null && this.spot.updatedAt ? this.spot.updatedAt : 0);

      return {
         ready: this.feedReady.futures && this.feedReady.spot,
         futuresSymbol: this.config.futuresSymbol,
         spotSymbol: this.config.spotSymbol,
         futuresBid,
         futuresAsk,
         spotBid,
         spotAsk,
         futuresLastUpdate: this.futures.updatedAt,
         spotLastUpdate: this.spot.updatedAt,
         spread,
         spreadBps,
         netSpread,
         netSpreadBps,
         lastUpdated: lastUpdated > 0 ? lastUpdated : null,
         tradeLog: this.tradeLog.all(),
         feedStatus: { ...this.feedReady },
         opportunity,
      };
   }

   private computeSpread(futuresPrice: number | null, spotPrice: number | null): number | null {
      if (!Number.isFinite(futuresPrice ?? Number.NaN) || !Number.isFinite(spotPrice ?? Number.NaN)) { return null; }
      return Number(futuresPrice) - Number(spotPrice);
   }

   private computeSpreadBps(spread: number | null, spotAsk: number | null): number | null {
      if (!Number.isFinite(spread ?? Number.NaN) || !Number.isFinite(spotAsk ?? Number.NaN)) { return null; }
      if (!spotAsk) { return null; }
      return (Number(spread) / Number(spotAsk)) * 10_000;
   }

   private computeNetSpread(futuresBid: number | null, spotAsk: number | null): number | null {
      if (!Number.isFinite(futuresBid ?? Number.NaN) || !Number.isFinite(spotAsk ?? Number.NaN)) {
         return null;
      }
      const perSideFee = this.config.takerFeeRate ?? 0;
      const effectiveFee = perSideFee * 2;
      const sellFuturesNet = Number(futuresBid) * (1 - effectiveFee);
      const buySpotNet = Number(spotAsk) * (1 + effectiveFee);
      return sellFuturesNet - buySpotNet;
   }
}
