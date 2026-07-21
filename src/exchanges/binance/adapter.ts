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
import type { Order, CreateOrderParams } from "../types";
import { BinanceGateway, type BinanceGatewayOptions } from "./gateway";
import { createSafeInvoke, createInitManager } from "../adapter-utils";

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
  private readonly safeInvoke = createSafeInvoke("BinanceExchangeAdapter");
  private readonly init: ReturnType<typeof createInitManager>;

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
    this.init = createInitManager("BinanceExchangeAdapter", () =>
      this.gateway.ensureInitialized(this.symbol),
    );
  }

  supportsTrailingStops(): boolean {
    return this.marketType !== "spot";
  }

  supportsTriggerOrders(): boolean {
    return this.marketType !== "spot";
  }

  watchAccount(cb: AccountListener): void {
    const safe = this.safeInvoke("watchAccount", cb);
    void this.init.ensureInitialized("watchAccount")
      .then(() => {
        this.gateway.onAccount(safe);
      });
  }

  watchOrders(cb: OrderListener): void {
    const safe = this.safeInvoke("watchOrders", cb);
    void this.init.ensureInitialized("watchOrders")
      .then(() => {
        this.gateway.onOrders(safe);
      });
  }

  watchDepth(symbol: string, cb: DepthListener): void {
    const safe = this.safeInvoke("watchDepth", cb);
    void this.init.ensureInitialized(`watchDepth:${symbol}`)
      .then(() => {
        this.gateway.onDepth(symbol, safe);
      });
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    const safe = this.safeInvoke("watchTicker", cb);
    void this.init.ensureInitialized(`watchTicker:${symbol}`)
      .then(() => {
        this.gateway.onTicker(symbol, safe);
      });
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    const safe = this.safeInvoke("watchKlines", cb);
    void this.init.ensureInitialized(`watchKlines:${symbol}:${interval}`)
      .then(() => {
        this.gateway.onKlines(symbol, interval, safe);
      });
  }

  watchFundingRate(symbol: string, cb: FundingRateListener): void {
    const safe = this.safeInvoke("watchFundingRate", cb);
    void this.init.ensureInitialized(`watchFundingRate:${symbol}`)
      .then(() => {
        this.gateway.onFundingRate(symbol, safe);
      });
  }

  async createOrder(params: CreateOrderParams): Promise<Order> {
    await this.init.ensureInitialized("createOrder");
    return this.gateway.createOrder(params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.init.ensureInitialized("cancelOrder");
    await this.gateway.cancelOrder(params);
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.init.ensureInitialized("cancelOrders");
    await this.gateway.cancelOrders(params);
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.init.ensureInitialized("cancelAllOrders");
    await this.gateway.cancelAllOrders(params);
  }

  async getPrecision(): Promise<ExchangePrecision | null> {
    await this.init.ensureInitialized("getPrecision");
    return this.gateway.getPrecision(this.symbol);
  }

  async queryOpenOrders(): Promise<Order[]> {
    await this.init.ensureInitialized("queryOpenOrders");
    return this.gateway.queryOpenOrders();
  }

  async queryAccountSnapshot() {
    await this.init.ensureInitialized("queryAccountSnapshot");
    return this.gateway.queryAccountSnapshot();
  }

  async changeMarginMode(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void> {
    await this.init.ensureInitialized("changeMarginMode");
    await this.gateway.changeMarginMode(params.symbol, params.marginMode);
  }

  async forceCancelAllOrders(): Promise<boolean> {
    await this.init.ensureInitialized("forceCancelAllOrders");
    return this.gateway.forceCancelAllOrders();
  }
}
