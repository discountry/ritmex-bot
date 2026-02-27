import { clearTimeout, setTimeout } from "timers";
import type {
  AccountListener,
  DepthListener,
  ExchangeAdapter,
  ExchangePrecision,
  FundingRateListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type { AsterOrder, CreateOrderParams } from "../types";
import { extractMessage } from "../../utils/errors";
import { BinanceGateway, type BinanceGatewayOptions } from "./gateway";

export interface BinanceCredentials {
  apiKey?: string;
  apiSecret?: string;
  symbol?: string;
  marketType?: "spot" | "perp" | "auto";
  sandbox?: boolean;
  spotRestUrl?: string;
  futuresRestUrl?: string;
  spotWsUrl?: string;
  futuresWsUrl?: string;
  logger?: BinanceGatewayOptions["logger"];
}

export class BinanceExchangeAdapter implements ExchangeAdapter {
  readonly id = "binance";

  private readonly gateway: BinanceGateway;
  private readonly symbol: string;
  private readonly marketType: "spot" | "perp" | "auto";
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;

  constructor(credentials: BinanceCredentials = {}) {
    const apiKey = credentials.apiKey ?? process.env.BINANCE_API_KEY;
    const apiSecret = credentials.apiSecret ?? process.env.BINANCE_API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error("Missing BINANCE_API_KEY or BINANCE_API_SECRET environment variable");
    }

    this.symbol = (credentials.symbol ?? process.env.BINANCE_SYMBOL ?? process.env.TRADE_SYMBOL ?? "BTCUSDT").trim().toUpperCase();
    const modeRaw = (credentials.marketType ?? process.env.BINANCE_MARKET_TYPE ?? "perp").trim().toLowerCase();
    this.marketType = modeRaw === "spot" ? "spot" : modeRaw === "auto" ? "auto" : "perp";

    this.gateway = new BinanceGateway({
      apiKey,
      apiSecret,
      symbol: this.symbol,
      marketType: this.marketType,
      sandbox: credentials.sandbox,
      spotRestUrl: credentials.spotRestUrl,
      futuresRestUrl: credentials.futuresRestUrl,
      spotWsUrl: credentials.spotWsUrl,
      futuresWsUrl: credentials.futuresWsUrl,
      logger: credentials.logger,
    });
  }

  supportsTrailingStops(): boolean {
    return this.marketType !== "spot";
  }

  watchAccount(cb: AccountListener): void {
    const safe = this.safeInvoke("watchAccount", cb);
    void this.ensureInitialized("watchAccount")
      .then(() => {
        this.gateway.onAccount(safe);
      })
      .catch((error) => this.handleInitError("watchAccount", error));
  }

  watchOrders(cb: OrderListener): void {
    const safe = this.safeInvoke("watchOrders", cb);
    void this.ensureInitialized("watchOrders")
      .then(() => {
        this.gateway.onOrders(safe);
      })
      .catch((error) => this.handleInitError("watchOrders", error));
  }

  watchDepth(symbol: string, cb: DepthListener): void {
    const safe = this.safeInvoke("watchDepth", cb);
    void this.ensureInitialized(`watchDepth:${symbol}`)
      .then(() => {
        this.gateway.onDepth(symbol, safe);
      })
      .catch((error) => this.handleInitError("watchDepth", error));
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    const safe = this.safeInvoke("watchTicker", cb);
    void this.ensureInitialized(`watchTicker:${symbol}`)
      .then(() => {
        this.gateway.onTicker(symbol, safe);
      })
      .catch((error) => this.handleInitError("watchTicker", error));
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    const safe = this.safeInvoke("watchKlines", cb);
    void this.ensureInitialized(`watchKlines:${symbol}:${interval}`)
      .then(() => {
        this.gateway.onKlines(symbol, interval, safe);
      })
      .catch((error) => this.handleInitError("watchKlines", error));
  }

  watchFundingRate(symbol: string, cb: FundingRateListener): void {
    const safe = this.safeInvoke("watchFundingRate", cb);
    void this.ensureInitialized(`watchFundingRate:${symbol}`)
      .then(() => {
        this.gateway.onFundingRate(symbol, safe);
      })
      .catch((error) => this.handleInitError("watchFundingRate", error));
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized("createOrder");
    return this.gateway.createOrder(params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.ensureInitialized("cancelOrder");
    await this.gateway.cancelOrder(params);
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized("cancelOrders");
    await this.gateway.cancelOrders(params);
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.ensureInitialized("cancelAllOrders");
    await this.gateway.cancelAllOrders(params);
  }

  async getPrecision(): Promise<ExchangePrecision | null> {
    await this.ensureInitialized("getPrecision");
    return this.gateway.getPrecision(this.symbol);
  }

  async queryOpenOrders(): Promise<AsterOrder[]> {
    await this.ensureInitialized("queryOpenOrders");
    return this.gateway.queryOpenOrders();
  }

  async queryAccountSnapshot() {
    await this.ensureInitialized("queryAccountSnapshot");
    return this.gateway.queryAccountSnapshot();
  }

  async changeMarginMode(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void> {
    await this.ensureInitialized("changeMarginMode");
    await this.gateway.changeMarginMode(params.symbol, params.marginMode);
  }

  async forceCancelAllOrders(): Promise<boolean> {
    await this.ensureInitialized("forceCancelAllOrders");
    return this.gateway.forceCancelAllOrders();
  }

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        console.error(`[BinanceExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
      }
    }) as T;
    return wrapped;
  }

  private ensureInitialized(context?: string): Promise<void> {
    if (!this.initPromise) {
      this.initContexts.clear();
      this.initPromise = this.gateway
        .ensureInitialized(this.symbol)
        .then((value) => {
          this.clearRetry();
          return value;
        })
        .catch((error) => {
          this.handleInitError("initialize", error);
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
    if (this.retryTimer) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      if (this.initPromise) return;
      this.retryDelayMs = Math.min(this.retryDelayMs * 2, 60_000);
      void this.ensureInitialized("retry");
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
    if (now - this.lastInitErrorAt < 5000) return;
    this.lastInitErrorAt = now;
    console.error(`[BinanceExchangeAdapter] ${context} failed`, error);
  }
}
