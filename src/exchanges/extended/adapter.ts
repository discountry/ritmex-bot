import { setTimeout, clearTimeout } from "timers";
import type {
  AccountListener,
  DepthListener,
  ExchangeAdapter,
  ExchangePrecision,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type { AsterOrder, CreateOrderParams } from "../types";
import { ExtendedGateway, type ExtendedGatewayOptions } from "./gateway";

export interface ExtendedCredentials {
  apiKey?: string;
  starkPrivateKey?: string;
  vaultId?: string;
  market?: string;
  apiHost?: string;
  streamHost?: string;
  privateStreamHost?: string;
  userAgent?: string;
}

export class ExtendedExchangeAdapter implements ExchangeAdapter {
  readonly id = "extended";
  private readonly gateway: ExtendedGateway;
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;

  constructor(credentials: ExtendedCredentials = {}) {
    const apiKey = credentials.apiKey ?? process.env.EXTENDED_API_KEY;
    const starkPrivateKey = credentials.starkPrivateKey ?? process.env.EXTENDED_STARK_PRIVATE_KEY;
    const vaultId = credentials.vaultId ?? process.env.EXTENDED_VAULT_ID;
    const market = credentials.market ?? process.env.EXTENDED_MARKET ?? process.env.TRADE_SYMBOL ?? "BTC-USD";
    if (!apiKey) throw new Error("Missing EXTENDED_API_KEY");
    if (!starkPrivateKey) throw new Error("Missing EXTENDED_STARK_PRIVATE_KEY");
    if (!vaultId) throw new Error("Missing EXTENDED_VAULT_ID");
    const options: ExtendedGatewayOptions = {
      apiKey,
      starkPrivateKey,
      vaultId,
      market,
      apiHost: credentials.apiHost ?? process.env.EXTENDED_API_HOST,
      streamHost: credentials.streamHost ?? process.env.EXTENDED_STREAM_HOST,
      privateStreamHost: credentials.privateStreamHost ?? process.env.EXTENDED_PRIVATE_STREAM_HOST,
      userAgent: credentials.userAgent ?? process.env.EXTENDED_USER_AGENT,
      logger: (context, error) => this.log(context, error),
    };
    this.gateway = new ExtendedGateway(options);
  }

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(cb: AccountListener): void {
    void this.ensureInitialized("watchAccount");
    this.gateway.onAccount(this.safeInvoke("watchAccount", cb));
  }

  watchOrders(cb: OrderListener): void {
    void this.ensureInitialized("watchOrders");
    this.gateway.onOrders(this.safeInvoke("watchOrders", cb));
  }

  watchDepth(_symbol: string, cb: DepthListener): void {
    void this.ensureInitialized("watchDepth");
    this.gateway.onDepth(this.safeInvoke("watchDepth", cb));
  }

  watchTicker(_symbol: string, cb: TickerListener): void {
    void this.ensureInitialized("watchTicker");
    this.gateway.onTicker(this.safeInvoke("watchTicker", cb));
  }

  watchKlines(_symbol: string, interval: string, cb: KlineListener): void {
    void this.ensureInitialized(`watchKlines:${interval}`);
    this.gateway.watchKlines(interval, this.safeInvoke("watchKlines", cb));
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized("createOrder");
    return this.gateway.createOrder(params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.ensureInitialized("cancelOrder");
    await this.gateway.cancelOrder({ orderId: params.orderId });
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized("cancelOrders");
    await this.gateway.cancelOrders({ orderIdList: params.orderIdList });
  }

  async cancelAllOrders(_params: { symbol: string }): Promise<void> {
    await this.ensureInitialized("cancelAllOrders");
    await this.gateway.cancelAllOrders();
  }

  async getPrecision(): Promise<ExchangePrecision | null> {
    try {
      const precision = await this.gateway.getPrecision();
      if (!precision) return null;
      return {
        priceTick: precision.priceTick,
        qtyStep: precision.qtyStep,
      };
    } catch (error) {
      this.log("getPrecision", error);
      return null;
    }
  }

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        this.log(`${context} handler`, error);
      }
    }) as T;
    return wrapped;
  }

  private ensureInitialized(context?: string): Promise<void> {
    if (!this.initPromise) {
      this.initContexts.clear();
      this.initPromise = this.gateway.ensureInitialized().catch((error) => {
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

  private handleInitError(context: string, error: unknown): void {
    const now = Date.now();
    if (now - this.lastInitErrorAt < 5000) return;
    this.lastInitErrorAt = now;
    this.log(context, error);
  }

  private log(context: string, error: unknown): void {
    if (process.env.EXTENDED_DEBUG === "1" || process.env.EXTENDED_DEBUG === "true") {
      console.error(`[ExtendedExchangeAdapter] ${context}`, error);
    }
  }
}
