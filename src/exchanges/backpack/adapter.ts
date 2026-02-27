import type {
  AccountListener,
  DepthListener,
  ExchangeAdapter,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type { AsterOrder, CreateOrderParams } from "../types";
import { extractMessage } from "../../utils/errors";
import { BackpackGateway, type BackpackGatewayOptions } from "./gateway";

export interface BackpackCredentials {
  apiKey?: string;
  apiSecret?: string;
  password?: string;
  subaccount?: string;
  symbol?: string;
  sandbox?: boolean;
}

export class BackpackExchangeAdapter implements ExchangeAdapter {
  readonly id = "backpack";
  private readonly gateway: BackpackGateway;
  private readonly symbol: string;
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;

  constructor(credentials: BackpackCredentials = {}) {
    const apiKey = credentials.apiKey ?? process.env.BACKPACK_API_KEY;
    const apiSecret = credentials.apiSecret ?? process.env.BACKPACK_API_SECRET;
    const password = credentials.password ?? process.env.BACKPACK_PASSWORD;
    const subaccount = credentials.subaccount ?? process.env.BACKPACK_SUBACCOUNT;
    const sandbox = credentials.sandbox ?? (process.env.BACKPACK_SANDBOX === "true");
    
    const symbol = credentials.symbol ?? process.env.BACKPACK_SYMBOL ?? process.env.TRADE_SYMBOL ?? "BTCUSDC";
    
    if (!apiKey || !apiSecret) {
      throw new Error("BACKPACK_API_KEY and BACKPACK_API_SECRET environment variables are required");
    }

    const gatewayOptions: BackpackGatewayOptions = {
      apiKey,
      apiSecret,
      password,
      subaccount,
      symbol,
      sandbox,
      logger: (context, error) => this.logError(context, error),
    };
    
    this.gateway = new BackpackGateway(gatewayOptions);
    this.symbol = symbol;
  }

  supportsTrailingStops(): boolean {
    return false; // TODO: Check if Backpack supports trailing stops via ccxt
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

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        console.error(`[BackpackExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
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
      if (process.env.BACKPACK_DEBUG === "1") {
        console.error(`[BackpackExchangeAdapter] initialize succeeded`);
      }
      if (process.env.BACKPACK_DEBUG === "1") {
        console.error(`[BackpackExchangeAdapter] initialize succeeded`);
      }
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
    console.error(`[BackpackExchangeAdapter] ${context} failed`, error);
  }

  private logError(context: string, error: unknown): void {
    if (process.env.BACKPACK_DEBUG === "1" || process.env.BACKPACK_DEBUG === "true") {
      console.error(`[BackpackExchangeAdapter] ${context} failed: ${extractMessage(error)}`);
    }
  }
}
