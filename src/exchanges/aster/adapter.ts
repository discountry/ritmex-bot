import type {
  AccountListener,
  DepthListener,
  ExchangeAdapter,
  ExchangePrecision,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type { Order, CreateOrderParams, Depth, Ticker, Kline } from "../types";
import { createSafeInvoke, createInitManager } from "../adapter-utils";
import { AsterGateway } from "./gateway";

export interface AsterCredentials {
  apiKey?: string;
  apiSecret?: string;
  symbol?: string;
}

export class AsterExchangeAdapter implements ExchangeAdapter {
  readonly id = "aster";
  private readonly gateway: AsterGateway;
  private readonly symbol: string;
  private readonly safeInvoke = createSafeInvoke("AsterExchangeAdapter");
  private readonly init: ReturnType<typeof createInitManager>;

  constructor(credentials: AsterCredentials = {}) {
    this.gateway = new AsterGateway({ apiKey: credentials.apiKey, apiSecret: credentials.apiSecret });
    this.symbol = (credentials.symbol ?? process.env.TRADE_SYMBOL ?? "BTCUSDT").toUpperCase();
    this.init = createInitManager("AsterExchangeAdapter", () =>
      this.gateway.ensureInitialized(this.symbol),
    );
  }

  supportsTrailingStops(): boolean {
    return true;
  }

  supportsTriggerOrders(): boolean {
    return true;
  }

  watchAccount(cb: AccountListener): void {
    void this.init.ensureInitialized("watchAccount");
    this.gateway.onAccount(this.safeInvoke("watchAccount", (snapshot) => {
      cb(snapshot);
    }));
  }

  watchOrders(cb: OrderListener): void {
    void this.init.ensureInitialized("watchOrders");
    this.gateway.onOrders(this.safeInvoke("watchOrders", (orders) => {
      cb(orders);
    }));
  }

  watchDepth(symbol: string, cb: DepthListener): void {
    void this.init.ensureInitialized("watchDepth");
    this.gateway.onDepth(symbol, this.safeInvoke("watchDepth", (depth: Depth) => {
      cb(depth);
    }));
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    void this.init.ensureInitialized("watchTicker");
    this.gateway.onTicker(symbol, this.safeInvoke("watchTicker", (ticker: Ticker) => {
      cb(ticker);
    }));
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    void this.init.ensureInitialized("watchKlines");
    this.gateway.onKlines(symbol, interval, this.safeInvoke("watchKlines", (klines: Kline[]) => {
      cb(klines);
    }));
  }

  async createOrder(params: CreateOrderParams): Promise<Order> {
    await this.init.ensureInitialized("createOrder");
    return this.gateway.createOrder(params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.init.ensureInitialized("cancelOrder");
    await this.gateway.cancelOrder({ symbol: params.symbol, orderId: Number(params.orderId) });
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.init.ensureInitialized("cancelOrders");
    await this.gateway.cancelOrders({ symbol: params.symbol, orderIdList: params.orderIdList });
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.init.ensureInitialized("cancelAllOrders");
    await this.gateway.cancelAllOrders(params);
  }

  async getPrecision(): Promise<ExchangePrecision | null> {
    try {
      const precision = await this.gateway.getPrecision(this.symbol);
      if (!precision) return null;
      return {
        priceTick: precision.priceTick,
        qtyStep: precision.qtyStep,
        priceDecimals: precision.priceDecimals,
        sizeDecimals: precision.sizeDecimals,
      };
    } catch (error) {
      console.error("[AsterExchangeAdapter] getPrecision failed", error);
      return null;
    }
  }
}
