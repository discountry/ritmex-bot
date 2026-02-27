import type { BasisArbConfig } from "../config";
import type { ExchangeAdapter, FundingRateSnapshot } from "../exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterSpotBookTicker } from "../exchanges/types";
import { AsterSpotRestClient, AsterRestClient } from "../exchanges/aster/client";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { t } from "../i18n";

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
  fundingRate: number | null;
  nextFundingTime: number | null;
  fundingLastUpdate: number | null;
  fundingIncomePerFunding: number | null; // USDT per funding event
  fundingIncomePerDay: number | null; // USDT per day (assuming 3 fundings/day)
  takerFeesPerRoundTrip: number | null; // USDT cost to open both legs
  fundingCountToBreakeven: number | null; // number of fundings to cover fees
  spread: number | null;
  spreadBps: number | null;
  netSpread: number | null;
  netSpreadBps: number | null;
  lastUpdated: number | null;
  tradeLog: TradeLogEntry[];
  feedStatus: {
    futures: boolean;
    spot: boolean;
    funding: boolean;
  };
  spotBalances: Array<{ asset: string; free: number; locked: number }>;
  futuresBalances: Array<{ asset: string; wallet: number; available: number }>;
  opportunity: boolean;
}

type BasisArbEvent = "update";
type BasisArbListener = (snapshot: BasisArbSnapshot) => void;

interface BasisArbDependencies {
  spotClient?: Pick<AsterSpotRestClient, "getBookTicker">;
  futuresClient?: Pick<AsterRestClient, "getPremiumIndex">;
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

interface FundingState {
  rate: number | null;
  nextFundingTime: number | null;
  updatedAt: number | null;
}

interface SpotBalanceStateEntry {
  asset: string;
  free: number;
  locked: number;
}

interface FuturesBalanceStateEntry {
  asset: string;
  wallet: number;
  available: number;
}

export class BasisArbEngine {
  private readonly events = new StrategyEventEmitter<BasisArbEvent, BasisArbSnapshot>();
  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly spotClient: Pick<AsterSpotRestClient, "getBookTicker"> | null;
  private readonly futuresClient: Pick<AsterRestClient, "getPremiumIndex"> | null;
  private readonly now: () => number;
  private readonly config: BasisArbConfig;
  private readonly exchange: ExchangeAdapter;

  private readonly futures: DepthState = { bid: null, ask: null, updatedAt: null };
  private readonly spot: SpotState = { bid: null, ask: null, updatedAt: null };
  private readonly funding: FundingState = { rate: null, nextFundingTime: null, updatedAt: null };
  private spotBalances: SpotBalanceStateEntry[] = [];
  private futuresBalances: FuturesBalanceStateEntry[] = [];

  private readonly feedReady = { futures: false, spot: false, funding: false };

  private timer: ReturnType<typeof setInterval> | null = null;
  private spotInFlight = false;
  private fundingInFlight = false;
  private spotAccountInFlight = false;
  private futuresAccountInFlight = false;
  private stopped = false;
  private lastEntrySignalAt = 0;
  private lastExitSignalAt = 0;
  private marketReadyAt: number | null = null;

  constructor(config: BasisArbConfig, exchange: ExchangeAdapter, deps: BasisArbDependencies = {}) {
    this.config = config;
    this.exchange = exchange;
    const isAster = exchange.id === "aster";
    this.spotClient = deps.spotClient ?? (isAster ? new AsterSpotRestClient() : null);
    this.futuresClient = deps.futuresClient ?? (isAster ? new AsterRestClient() : null);
    this.now = deps.now ?? (() => Date.now());
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    if (this.exchange.id !== "aster") return;
    this.timer = setInterval(() => {
      void this.pollSpot();
      void this.pollFunding();
      void this.pollSpotAccount();
      void this.pollFuturesAccount();
    }, Math.max(this.config.refreshIntervalMs, 200));
    void this.pollSpot();
    void this.pollFunding();
    void this.pollSpotAccount();
    void this.pollFuturesAccount();
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
      {
        subscribeFail: (error) => t("log.basis.subscribeFuturesDepthFail", { error: String(error) }),
        processFail: (error) => t("log.basis.processFuturesDepthError", { error: String(error) }),
      }
    );

    if (this.exchange.id === "nado" || this.exchange.id === "standx") {
      safeSubscribe<AsterDepth>(
        this.exchange.watchDepth.bind(this.exchange, this.config.spotSymbol),
        (depth) => {
          this.applySpotDepth(depth);
        },
        log,
        {
          subscribeFail: (error) => t("log.basis.subscribeSpotDepthFail", { error: String(error) }),
          processFail: (error) => t("log.basis.processSpotDepthError", { error: String(error) }),
        }
      );

      if (typeof this.exchange.watchFundingRate === "function") {
        safeSubscribe<FundingRateSnapshot>(
          (cb) => {
            this.exchange.watchFundingRate?.(this.config.futuresSymbol, cb);
          },
          (snapshot) => {
            this.applyFundingRateSnapshot(snapshot);
          },
          log,
          {
            subscribeFail: (error) => t("log.basis.subscribeFundingRateFail", { error: String(error) }),
            processFail: (error) => t("log.basis.processFundingRateError", { error: String(error) }),
          }
        );
      }

      safeSubscribe<AsterAccountSnapshot>(
        this.exchange.watchAccount.bind(this.exchange),
        (snapshot) => {
          this.applyAccountSnapshot(snapshot);
        },
        log,
        {
          subscribeFail: (error) => t("log.basis.subscribeAccountFail", { error: String(error) }),
          processFail: (error) => t("log.basis.processAccountError", { error: String(error) }),
        }
      );
    }
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
      this.tradeLog.push("info", t("log.basis.futuresReady", { symbol: this.config.futuresSymbol }));
    }
    if (this.feedReady.futures && this.feedReady.spot && this.marketReadyAt == null) {
      this.marketReadyAt = this.now();
    }
    this.emitUpdate();
  }

  private async pollSpot(): Promise<void> {
    if (!this.spotClient || this.spotInFlight || this.stopped) return;
    this.spotInFlight = true;
    try {
      const result = await this.spotClient.getBookTicker(this.config.spotSymbol);
      const ticker = Array.isArray(result) ? result[0] : result;
      if (!ticker) return;
      this.applySpotTicker(ticker);
    } catch (error) {
      this.feedReady.spot = false;
      this.tradeLog.push(
        "error",
        t("log.basis.spotDepthError", { error: String(error instanceof Error ? error.message : error) })
      );
    } finally {
      this.spotInFlight = false;
    }
  }

  private async pollFunding(): Promise<void> {
    if (!this.futuresClient || this.fundingInFlight || this.stopped) return;
    this.fundingInFlight = true;
    try {
      const data = await this.futuresClient.getPremiumIndex(this.config.futuresSymbol);
      const rateRaw = (data.lastFundingRate ?? data.fundingRate) as string | undefined;
      const rate = rateRaw !== undefined ? Number(rateRaw) : NaN;
      const ts = (data.time ?? data.nextFundingTime ?? this.now()) as number | undefined;
      if (Number.isFinite(rate)) {
        this.funding.rate = Number(rateRaw);
        this.funding.nextFundingTime = typeof data.nextFundingTime === "number" ? data.nextFundingTime : null;
        this.funding.updatedAt = typeof ts === "number" ? ts : this.now();
        if (!this.feedReady.funding) {
          this.feedReady.funding = true;
          this.tradeLog.push("info", t("log.basis.fundingReady", { symbol: this.config.futuresSymbol }));
        }
        this.emitUpdate();
      }
    } catch (error) {
      this.feedReady.funding = false;
      this.tradeLog.push(
        "error",
        t("log.basis.fundingError", { error: String(error instanceof Error ? error.message : error) })
      );
    } finally {
      this.fundingInFlight = false;
    }
  }

  private async pollSpotAccount(): Promise<void> {
    if (!this.spotClient || this.spotAccountInFlight || this.stopped) return;
    this.spotAccountInFlight = true;
    try {
      // Spot balances via spot REST
      const account: any = await (this.spotClient as any).getAccount?.();
      const balances = Array.isArray(account?.balances) ? account.balances : [];
      const next: SpotBalanceStateEntry[] = [];
      for (const b of balances) {
        const asset = String(b.asset ?? "");
        const free = Number(b.free ?? 0);
        const locked = Number(b.locked ?? 0);
        if (!asset) continue;
        if (Math.abs(free) > 0 || Math.abs(locked) > 0) {
          next.push({ asset, free, locked });
        }
      }
      next.sort((a, b) => a.asset.localeCompare(b.asset));
      this.spotBalances = next;
      this.emitUpdate();
    } catch (error) {
      this.tradeLog.push(
        "error",
        t("log.basis.spotBalanceError", { error: String(error instanceof Error ? error.message : error) })
      );
    } finally {
      this.spotAccountInFlight = false;
    }
  }

  private async pollFuturesAccount(): Promise<void> {
    if (this.exchange.id !== "aster" || this.futuresAccountInFlight || this.stopped) return;
    this.futuresAccountInFlight = true;
    try {
      // Futures balances via futures REST
      const rest = new AsterRestClient();
      const account: any = await rest.getAccount();
      const assets = Array.isArray(account?.assets) ? account.assets : [];
      const next: FuturesBalanceStateEntry[] = [];
      for (const a of assets) {
        const asset = String(a.asset ?? "");
        const wallet = Number(a.walletBalance ?? a.wb ?? 0);
        const available = Number(a.availableBalance ?? a.bc ?? 0);
        if (!asset) continue;
        if (Math.abs(wallet) > 0 || Math.abs(available) > 0) {
          next.push({ asset, wallet, available });
        }
      }
      next.sort((a, b) => a.asset.localeCompare(b.asset));
      this.futuresBalances = next;
      this.emitUpdate();
    } catch (error) {
      this.tradeLog.push(
        "error",
        t("log.basis.futuresBalanceError", { error: String(error instanceof Error ? error.message : error) })
      );
    } finally {
      this.futuresAccountInFlight = false;
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
      this.tradeLog.push("info", t("log.basis.spotReady", { symbol: this.config.spotSymbol }));
    }
    if (this.feedReady.futures && this.feedReady.spot && this.marketReadyAt == null) {
      this.marketReadyAt = this.now();
    }
    this.emitUpdate();
  }

  private applySpotDepth(depth: AsterDepth): void {
    if (!depth?.bids?.length || !depth?.asks?.length) {
      return;
    }
    const topBid = Number(depth.bids[0]?.[0]);
    const topAsk = Number(depth.asks[0]?.[0]);
    if (!Number.isFinite(topBid) || !Number.isFinite(topAsk)) {
      return;
    }
    this.spot.bid = topBid;
    this.spot.ask = topAsk;
    this.spot.updatedAt = depth.eventTime ?? depth.tradeTime ?? this.now();
    if (!this.feedReady.spot) {
      this.feedReady.spot = true;
      this.tradeLog.push("info", t("log.basis.spotReady", { symbol: this.config.spotSymbol }));
    }
    if (this.feedReady.futures && this.feedReady.spot && this.marketReadyAt == null) {
      this.marketReadyAt = this.now();
    }
    this.emitUpdate();
  }

  private applyFundingRateSnapshot(snapshot: FundingRateSnapshot): void {
    const rate = snapshot.fundingRate;
    if (!Number.isFinite(rate)) return;
    this.funding.rate = rate;
    this.funding.nextFundingTime = null;
    this.funding.updatedAt = Number.isFinite(snapshot.updateTime) ? snapshot.updateTime : this.now();
    if (!this.feedReady.funding) {
      this.feedReady.funding = true;
      this.tradeLog.push("info", t("log.basis.fundingReady", { symbol: this.config.futuresSymbol }));
    }
    this.emitUpdate();
  }

  private applyAccountSnapshot(snapshot: AsterAccountSnapshot): void {
    const assets = Array.isArray(snapshot.assets) ? snapshot.assets : [];

    const spotBalances: SpotBalanceStateEntry[] = [];
    const futuresBalances: FuturesBalanceStateEntry[] = [];

    for (const asset of assets) {
      const name = String(asset.asset ?? "");
      const wallet = Number(asset.walletBalance ?? 0);
      const available = Number(asset.availableBalance ?? 0);
      if (!name) continue;
      if (!Number.isFinite(wallet) || !Number.isFinite(available)) continue;
      if (Math.abs(wallet) === 0 && Math.abs(available) === 0) continue;

      if (name === "USDT0") {
        futuresBalances.push({ asset: name, wallet, available });
        continue;
      }
      const locked = Math.max(wallet - available, 0);
      spotBalances.push({ asset: name, free: available, locked });
    }

    spotBalances.sort((a, b) => a.asset.localeCompare(b.asset));
    futuresBalances.sort((a, b) => a.asset.localeCompare(b.asset));
    this.spotBalances = spotBalances;
    this.futuresBalances = futuresBalances;
    this.emitUpdate();
  }

  private emitUpdate(): void {
    // Build a single snapshot, evaluate signals against EXACTLY the same data, then emit that snapshot
    const snapshot = this.buildSnapshot();
    this.evaluateSignals(snapshot);
    this.events.emit("update", snapshot, (error) => {
      this.tradeLog.push("error", t("log.basis.pushError", { error: String(error) }));
    });
  }

  private buildSnapshot(): BasisArbSnapshot {
    const futuresBid = this.futures.bid;
    const futuresAsk = this.futures.ask;
    const spotBid = this.spot.bid;
    const spotAsk = this.spot.ask;
    const fundingRate = this.funding.rate;
    const nextFundingTime = this.funding.nextFundingTime;
    const spread = this.computeSpread(futuresBid, spotAsk);
    const spreadBps = this.computeSpreadBps(spread, spotAsk);
    const netSpread = this.computeNetSpread(futuresBid, spotAsk);
    const netSpreadBps = this.computeSpreadBps(netSpread, spotAsk);
    const perFundingIncome = this.computeFundingIncomeUSDT(fundingRate, spotAsk);
    const perDayIncome = perFundingIncome != null ? perFundingIncome * 3 : null; // 3 times/day typical
    const takerFeesPerRoundTrip = this.computeRoundTripFeesUSDT(spotAsk);
    const fundingCountToBreakeven = perFundingIncome && perFundingIncome > 0 && takerFeesPerRoundTrip != null
      ? takerFeesPerRoundTrip / perFundingIncome
      : null;
    const opportunity = netSpread != null && netSpread >= 0;
    const lastUpdated = Math.max(
      futuresBid != null && this.futures.updatedAt ? this.futures.updatedAt : 0,
      spotBid != null && this.spot.updatedAt ? this.spot.updatedAt : 0,
      fundingRate != null && this.funding.updatedAt ? this.funding.updatedAt : 0
    );

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
      fundingRate,
      nextFundingTime,
      fundingLastUpdate: this.funding.updatedAt,
      fundingIncomePerFunding: perFundingIncome,
      fundingIncomePerDay: perDayIncome,
      takerFeesPerRoundTrip,
      fundingCountToBreakeven,
      spread,
      spreadBps,
      netSpread,
      netSpreadBps,
      lastUpdated: lastUpdated > 0 ? lastUpdated : null,
      tradeLog: this.tradeLog.all(),
      feedStatus: { ...this.feedReady },
      spotBalances: [...this.spotBalances],
      futuresBalances: [...this.futuresBalances],
      opportunity,
    };
  }

  private computeSpread(futuresPrice: number | null, spotPrice: number | null): number | null {
    if (!Number.isFinite(futuresPrice ?? NaN) || !Number.isFinite(spotPrice ?? NaN)) return null;
    return Number(futuresPrice) - Number(spotPrice);
  }

  private computeSpreadBps(spread: number | null, spotAsk: number | null): number | null {
    if (!Number.isFinite(spread ?? NaN) || !Number.isFinite(spotAsk ?? NaN)) return null;
    if (!spotAsk) return null;
    return (Number(spread) / Number(spotAsk)) * 10_000;
  }

  private computeNetSpread(futuresBid: number | null, spotAsk: number | null): number | null {
    if (!Number.isFinite(futuresBid ?? NaN) || !Number.isFinite(spotAsk ?? NaN)) {
      return null;
    }
    const perSideFee = this.config.takerFeeRate ?? 0;
    const effectiveFee = perSideFee * 2;
    const sellFuturesNet = Number(futuresBid) * (1 - effectiveFee);
    const buySpotNet = Number(spotAsk) * (1 + effectiveFee);
    return sellFuturesNet - buySpotNet;
  }

  private evaluateSignals(snapshot: BasisArbSnapshot): void {
    // Require futures, spot, and funding feeds ready
    if (!snapshot.feedStatus.futures || !snapshot.feedStatus.spot || !snapshot.feedStatus.funding) return;
    // Require at least one refresh of both futures and spot AFTER initial readiness to avoid startup triggers
    const readyAt = this.marketReadyAt;
    if (readyAt == null) return;
    const futTs = snapshot.futuresLastUpdate ?? 0;
    const spotTs = snapshot.spotLastUpdate ?? 0;
    if (futTs <= readyAt || spotTs <= readyAt) return;
    const now = this.now();
    // Use net spread after taker fees to match UI's "扣除 taker 手续费" bp
    const spreadBps = snapshot.netSpreadBps;
    const fundingRate = snapshot.fundingRate;
    const nextFundingTime = snapshot.nextFundingTime;
    const msUntilFunding = typeof nextFundingTime === "number" ? nextFundingTime - now : null;

    // Entry signal: positive bp and next funding >= 10 minutes away
    if (Number.isFinite(spreadBps ?? NaN) && (spreadBps as number) > 0 && Number.isFinite(msUntilFunding ?? NaN) && (msUntilFunding as number) >= 10 * 60 * 1000) {
      if (now - this.lastEntrySignalAt >= 60 * 1000) { // debounce 60s
        this.lastEntrySignalAt = now;
        const bpTxt = (spreadBps as number).toFixed(2);
        const minutes = Math.floor(((msUntilFunding as number) / 60000));
        this.tradeLog.push("entry", t("log.basis.entryOpportunity", { bp: bpTxt, minutes }));
      }
    }

    // Exit signal: funding rate negative and within 10 minutes before collection
    if (Number.isFinite(fundingRate ?? NaN) && (fundingRate as number) < 0 && Number.isFinite(msUntilFunding ?? NaN) && (msUntilFunding as number) > 0 && (msUntilFunding as number) <= 10 * 60 * 1000) {
      if (now - this.lastExitSignalAt >= 60 * 1000) { // debounce 60s
        this.lastExitSignalAt = now;
        const minutes = Math.max(0, Math.floor(((msUntilFunding as number) / 60000)));
        this.tradeLog.push("exit", t("log.basis.exitOpportunity", { minutes }));
      }
    }
  }

  private computeFundingIncomeUSDT(fundingRate: number | null, spotAsk: number | null): number | null {
    if (!Number.isFinite(fundingRate ?? NaN)) return null;
    const price = Number.isFinite(spotAsk ?? NaN) ? Number(spotAsk) : null;
    const amount = Number.isFinite(this.config.arbAmount ?? NaN) ? Number(this.config.arbAmount) : null;
    if (price == null || amount == null) return null;
    // Funding income per event for a delta-neutral hedge ~ rate * notional
    // Notional in USDT = amount * price
    const notional = amount * price;
    const rate = Number(fundingRate);
    return notional * rate;
  }

  private computeRoundTripFeesUSDT(spotAsk: number | null): number | null {
    const price = Number.isFinite(spotAsk ?? NaN) ? Number(spotAsk) : null;
    const amount = Number.isFinite(this.config.arbAmount ?? NaN) ? Number(this.config.arbAmount) : null;
    if (price == null || amount == null) return null;
    const notional = amount * price;
    // Two taker trades (sell futures, buy spot) → fees on both legs
    const perSide = (this.config.takerFeeRate ?? 0) * notional;
    return perSide * 2;
  }
}
