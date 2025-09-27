import { setTimeout, clearTimeout } from "timers";
import path from "path";
import { createRequire } from "module";
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
import {
  GrvtGateway,
  type GrvtEnvironment,
  type GrvtGatewayOptions,
  type GrvtHostsOverride,
  type GrvtSignatureProvider,
} from "./gateway";

export interface GrvtCredentials {
  cookie?: string;
  accountId?: string;
  apiKey?: string;
  apiSecret?: string;
  subAccountId?: string;
  instrument?: string;
  symbol?: string;
  env?: GrvtEnvironment;
  hosts?: GrvtHostsOverride;
  signatureProvider?: GrvtSignatureProvider;
  pollIntervals?: GrvtGatewayOptions["pollIntervals"];
  logger?: GrvtGatewayOptions["logger"];
}

export class GrvtExchangeAdapter implements ExchangeAdapter {
  readonly id = "grvt";

  private readonly gateway: GrvtGateway;
  private readonly symbol: string;
  private readonly instrument: string;
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;
  private klineInterval = "1m";

  constructor(credentials: GrvtCredentials = {}) {
    const apiKey = credentials.apiKey ?? process.env.GRVT_API_KEY;
    const apiSecret = credentials.apiSecret ?? process.env.GRVT_API_SECRET;
    const cookie = credentials.cookie ?? process.env.GRVT_COOKIE;
    const accountId = credentials.accountId ?? process.env.GRVT_ACCOUNT_ID;
    if (!cookie || !accountId) {
      if (!apiKey) {
        throw new Error("Missing GRVT_API_KEY environment variable for authentication");
      }
    }

    const subAccountId = requireValue(
      credentials.subAccountId ?? process.env.GRVT_SUB_ACCOUNT_ID,
      "GRVT_SUB_ACCOUNT_ID"
    );
    const instrument = requireValue(
      credentials.instrument ?? process.env.GRVT_INSTRUMENT,
      "GRVT_INSTRUMENT"
    );
    const symbol = normalizeSymbol(credentials.symbol ?? process.env.GRVT_SYMBOL, instrument);
    this.symbol = symbol;
    this.instrument = instrument;
    const signatureProvider =
      credentials.signatureProvider ?? loadSignatureProviderFromEnv(credentials.logger);
    if (!signatureProvider && !apiSecret) {
      throw new Error(
        "GRVT_API_SECRET is required when no external signature provider is configured"
      );
    }

    this.gateway = new GrvtGateway({
      apiKey: apiKey ?? undefined,
      apiSecret: apiSecret ?? undefined,
      cookie: cookie ?? undefined,
      accountId: accountId ?? undefined,
      subAccountId,
      instrument,
      symbol,
      env: (credentials.env ?? process.env.GRVT_ENV) as GrvtEnvironment | undefined,
      hosts: credentials.hosts,
      signatureProvider,
      pollIntervals: credentials.pollIntervals,
      logger: credentials.logger,
    });
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
    this.klineInterval = interval ?? this.klineInterval;
    void this.ensureInitialized("watchKlines", this.klineInterval);
    this.gateway.onKlines(this.safeInvoke("watchKlines", cb));
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

  async cancelAllOrders(_params: { symbol: string }): Promise<void> {
    await this.ensureInitialized("cancelAllOrders");
    await this.gateway.cancelAllOrders();
  }

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        console.error(`[GrvtExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
      }
    }) as T;
    return wrapped;
  }

  private ensureInitialized(context?: string, interval?: string): Promise<void> {
    if (interval) {
      this.klineInterval = interval;
    }
    if (!this.initPromise) {
      this.initContexts.clear();
      this.initPromise = this.gateway
        .ensureInitialized(this.klineInterval)
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
    console.error(`[GrvtExchangeAdapter] ${context} failed`, error);
  }
}

function requireValue<T>(value: T | undefined | null, key: string): T {
  if (value == null || value === "") {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
}

function normalizeSymbol(symbol: string | undefined, instrument: string): string {
  if (symbol) return symbol.toUpperCase();
  return instrument.replace(/[_-]/g, "").toUpperCase();
}

function loadSignatureProviderFromEnv(
  logger?: GrvtGatewayOptions["logger"]
): GrvtSignatureProvider | undefined {
  const signerModule = process.env.GRVT_SIGNER_PATH;
  if (!signerModule) return undefined;
  try {
    const require = createRequire(import.meta.url);
    const resolved = signerModule.startsWith(".") || signerModule.startsWith("/")
      ? path.resolve(process.cwd(), signerModule)
      : signerModule;
    const loaded = require(resolved);
    if (typeof loaded === "function") {
      return loaded as GrvtSignatureProvider;
    }
    if (loaded && typeof loaded.default === "function") {
      return loaded.default as GrvtSignatureProvider;
    }
    console.warn(
      `[GrvtExchangeAdapter] 模块 ${resolved} 未导出签名函数 (function default export)`
    );
  } catch (error) {
    const log = logger ?? ((ctx, err) => console.error(`[GrvtExchangeAdapter] ${ctx}`, err));
    log("loadSignatureProvider", error);
  }
  return undefined;
}
