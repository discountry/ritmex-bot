import { setTimeout, clearTimeout } from "timers";
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
import { ParadexGateway, type ParadexGatewayOptions } from "./gateway";

export interface ParadexCredentials {
  privateKey?: string;
  walletAddress?: string;
  sandbox?: boolean;
  pollIntervals?: ParadexGatewayOptions["pollIntervals"];
  watchReconnectDelayMs?: number;
  usePro?: boolean;
  symbol?: string;
}

export class ParadexExchangeAdapter implements ExchangeAdapter {
  readonly id = "paradex";

  private readonly gateway: ParadexGateway;
  private readonly symbol: string;
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;

  constructor(credentials: ParadexCredentials = {}) {
    const privateKey = credentials.privateKey ?? process.env.PARADEX_PRIVATE_KEY;
    const walletAddress = credentials.walletAddress ?? process.env.PARADEX_WALLET_ADDRESS;
    const sandbox = credentials.sandbox ?? (process.env.PARADEX_SANDBOX === "true");
    const symbol = credentials.symbol ?? process.env.PARADEX_SYMBOL ?? process.env.TRADE_SYMBOL ?? "BTC/USDC";
    const usePro = credentials.usePro ?? this.parseBooleanEnv(process.env.PARADEX_USE_PRO);
    const watchReconnectDelayMs =
      credentials.watchReconnectDelayMs ?? this.parseNumberEnv(process.env.PARADEX_RECONNECT_DELAY_MS);

    this.gateway = new ParadexGateway({
      symbol,
      displaySymbol: symbol,
      privateKey,
      walletAddress,
      sandbox,
      pollIntervals: credentials.pollIntervals,
      watchReconnectDelayMs,
      usePro,
      logger: (context, error) => this.logError(context, error),
    });

    this.symbol = symbol;
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

  watchDepth(symbol: string, cb: DepthListener): void {
    void this.ensureInitialized(`watchDepth:${symbol}`);
    this.gateway.onDepth(this.safeInvoke("watchDepth", cb));
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    void this.ensureInitialized(`watchTicker:${symbol}`);
    this.gateway.onTicker(this.safeInvoke("watchTicker", cb));
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    void this.ensureInitialized(`watchKlines:${symbol}:${interval}`);
    this.gateway.watchKlines(interval, this.safeInvoke("watchKlines", cb));
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

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        console.error(`[ParadexExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
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
    console.error(`[ParadexExchangeAdapter] ${context} failed`, error);
  }

  private logError(context: string, error: unknown): void {
    const detail = extractMessage(error);
    if (context === "initialize" && typeof error === "string" && /initialized/i.test(error)) {
      if (process.env.PARADEX_DEBUG === "1" || process.env.PARADEX_DEBUG === "true") {
        console.info(`[ParadexExchangeAdapter] ${error}`);
      }
      return;
    }
    const message = `[ParadexExchangeAdapter] ${context} failed: ${detail}`;
    const criticalContexts = [
      "initialize",
      "accountPoll",
      "watchBalanceLoop",
      "orderPoll",
      "orderPollOpen",
      "orderPollClosed",
    ];
    if (
      criticalContexts.some((prefix) => context.startsWith(prefix)) ||
      process.env.PARADEX_DEBUG === "1" ||
      process.env.PARADEX_DEBUG === "true"
    ) {
      console.error(message);
    }
  }

  private parseBooleanEnv(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    const normalized = value.trim().toLowerCase();
    if (["false", "0", "no", "off", ""].includes(normalized)) return false;
    return true;
  }

  private parseNumberEnv(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}
