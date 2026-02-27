import { setTimeout, clearTimeout } from "timers";
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
import { NadoGateway, type NadoGatewayOptions } from "./gateway";
import type { ChainEnv } from "@nadohq/shared";
import type { Address } from "viem";

export interface NadoCredentials {
  env?: ChainEnv;
  symbol?: string;
  subaccountOwner?: Address;
  subaccountName?: string;
  signerPrivateKey?: string;
  gatewayWsUrl?: string;
  subscriptionsWsUrl?: string;
  archiveUrl?: string;
  triggerUrl?: string;
  pollIntervals?: NadoGatewayOptions["pollIntervals"];
  marketSlippagePct?: number;
  stopTriggerSource?: NadoGatewayOptions["stopTriggerSource"];
}

export class NadoExchangeAdapter implements ExchangeAdapter {
  readonly id = "nado";

  private readonly gateway: NadoGateway;
  private readonly symbol: string;
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;

  constructor(credentials: NadoCredentials = {}) {
    const signerPrivateKey = credentials.signerPrivateKey ?? process.env.NADO_SIGNER_PRIVATE_KEY;
    const subaccountOwner = (credentials.subaccountOwner ??
      (process.env.NADO_SUBACCOUNT_OWNER as Address | undefined) ??
      (process.env.NADO_EVM_ADDRESS as Address | undefined)) as Address | undefined;
    const symbol =
      credentials.symbol ??
      process.env.NADO_SYMBOL ??
      process.env.TRADE_SYMBOL ??
      "BTC-PERP";

    if (!signerPrivateKey) {
      throw new Error("Missing NADO_SIGNER_PRIVATE_KEY environment variable");
    }
    if (!subaccountOwner) {
      throw new Error("Missing NADO_SUBACCOUNT_OWNER (or NADO_EVM_ADDRESS) environment variable");
    }

    this.symbol = symbol;
    this.gateway = new NadoGateway({
      env: credentials.env,
      symbol,
      subaccountOwner,
      subaccountName: credentials.subaccountName ?? process.env.NADO_SUBACCOUNT_NAME ?? "default",
      signerPrivateKey,
      gatewayWsUrl: credentials.gatewayWsUrl ?? process.env.NADO_GATEWAY_WS_URL,
      subscriptionsWsUrl: credentials.subscriptionsWsUrl ?? process.env.NADO_SUBSCRIPTIONS_WS_URL,
      archiveUrl: credentials.archiveUrl ?? process.env.NADO_ARCHIVE_URL,
      triggerUrl: credentials.triggerUrl ?? process.env.NADO_TRIGGER_URL,
      pollIntervals: credentials.pollIntervals,
      marketSlippagePct:
        credentials.marketSlippagePct ??
        (process.env.NADO_MARKET_SLIPPAGE_PCT ? Number(process.env.NADO_MARKET_SLIPPAGE_PCT) : undefined),
      stopTriggerSource:
        credentials.stopTriggerSource ??
        (process.env.NADO_STOP_TRIGGER_SOURCE as NadoGatewayOptions["stopTriggerSource"] | undefined),
      logger: (context, error) => this.logError(context, error),
    });
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
    this.gateway.onDepth(symbol, this.safeInvoke("watchDepth", cb));
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    void this.ensureInitialized(`watchTicker:${symbol}`);
    this.gateway.onTicker(symbol, this.safeInvoke("watchTicker", cb));
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    void this.ensureInitialized(`watchKlines:${symbol}:${interval}`);
    this.gateway.onKlines(symbol, interval, this.safeInvoke("watchKlines", cb));
  }

  watchFundingRate(symbol: string, cb: FundingRateListener): void {
    void this.ensureInitialized(`watchFundingRate:${symbol}`);
    this.gateway.onFundingRate(symbol, this.safeInvoke("watchFundingRate", cb));
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
    try {
      return await this.gateway.getPrecision(this.symbol);
    } catch (error) {
      this.logError("getPrecision", error);
      return null;
    }
  }

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        console.error(`[NadoExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
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
    console.error(`[NadoExchangeAdapter] ${context} failed`, error);
  }

  private logError(context: string, error: unknown): void {
    const detail = extractMessage(error);
    const message = `[NadoExchangeAdapter] ${context} failed: ${detail}`;
    const criticalContexts = ["initialize", "accountPoll", "ordersPoll", "triggerOrdersPoll"];
    if (criticalContexts.some((prefix) => context.startsWith(prefix)) || process.env.NADO_DEBUG === "1") {
      console.error(message);
    }
  }
}
