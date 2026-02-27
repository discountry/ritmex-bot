import { setTimeout, clearTimeout } from "timers";
import type {
  AccountListener,
  DepthListener,
  ExchangeAdapter,
  ExchangePrecision,
  FundingRateListener,
  KlineListener,
  OrderListener,
  RestHealthListener,
  TickerListener,
} from "../adapter";
import type { AsterOrder, CreateOrderParams } from "../types";
import { extractMessage } from "../../utils/errors";
import { StandxGateway, type StandxGatewayOptions, type ConnectionEventListener, type ConnectionEventType } from "./gateway";

export type { ConnectionEventListener, ConnectionEventType };

export interface StandxCredentials {
  token?: string;
  symbol?: string;
  baseUrl?: string;
  wsUrl?: string;
  sessionId?: string;
  signingKey?: string;
  logger?: StandxGatewayOptions["logger"];
}

export class StandxExchangeAdapter implements ExchangeAdapter {
  readonly id = "standx";

  private readonly gateway: StandxGateway;
  private readonly symbol: string;
  private initPromise: Promise<void> | null = null;
  private readonly initContexts = new Set<string>();
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryDelayMs = 3000;
  private lastInitErrorAt = 0;

  constructor(credentials: StandxCredentials = {}) {
    const token = credentials.token ?? process.env.STANDX_TOKEN;
    if (!token) {
      throw new Error("Missing STANDX_TOKEN environment variable");
    }
    this.symbol = credentials.symbol ?? process.env.STANDX_SYMBOL ?? process.env.TRADE_SYMBOL ?? "BTC-USD";
    this.gateway = new StandxGateway({
      token,
      symbol: this.symbol,
      baseUrl: credentials.baseUrl,
      wsUrl: credentials.wsUrl,
      sessionId: credentials.sessionId,
      signingKey: credentials.signingKey,
      logger: credentials.logger,
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
    void this.ensureInitialized("watchDepth");
    this.gateway.onDepth(symbol, this.safeInvoke("watchDepth", cb));
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    void this.ensureInitialized("watchTicker");
    this.gateway.onTicker(symbol, this.safeInvoke("watchTicker", cb));
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    void this.ensureInitialized("watchKlines");
    this.gateway.onKlines(symbol, interval, this.safeInvoke("watchKlines", cb));
  }

  watchFundingRate(symbol: string, cb: FundingRateListener): void {
    void this.ensureInitialized("watchFundingRate");
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
      const precision = await this.gateway.getPrecision(this.symbol);
      if (!precision) return null;
      return {
        priceTick: precision.priceTick,
        qtyStep: precision.qtyStep,
        priceDecimals: precision.priceDecimals,
        sizeDecimals: precision.sizeDecimals,
        minBaseAmount: precision.minBaseAmount,
      };
    } catch (error) {
      console.error("[StandxExchangeAdapter] getPrecision failed", error);
      return null;
    }
  }

  /**
   * 监听连接事件（断连/重连）
   */
  onConnectionEvent(listener: ConnectionEventListener): void {
    this.gateway.onConnectionEvent(listener);
  }

  /**
   * 取消连接事件监听
   */
  offConnectionEvent(listener: ConnectionEventListener): void {
    this.gateway.offConnectionEvent(listener);
  }

  onRestHealthEvent(listener: RestHealthListener): void {
    this.gateway.onRestHealthEvent(listener);
  }

  offRestHealthEvent(listener: RestHealthListener): void {
    this.gateway.offRestHealthEvent(listener);
  }

  /**
   * 查询当前真实的挂单状态（通过 HTTP API）
   * 用于验证实际挂单情况，防止取消请求丢失
   */
  async queryOpenOrders(): Promise<AsterOrder[]> {
    await this.ensureInitialized("queryOpenOrders");
    return this.gateway.queryOpenOrders(this.symbol);
  }

  async queryAccountSnapshot() {
    await this.ensureInitialized("queryAccountSnapshot");
    return this.gateway.queryAccountSnapshot();
  }

  async changeMarginMode(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void> {
    await this.ensureInitialized("changeMarginMode");
    await this.gateway.changeMarginMode(params.symbol, params.marginMode);
  }

  /**
   * 强制取消所有挂单
   * 会查询当前挂单然后取消，并验证取消成功
   */
  async forceCancelAllOrders(): Promise<boolean> {
    await this.ensureInitialized("forceCancelAllOrders");
    return this.gateway.forceCancelAllOrders(this.symbol);
  }

  private safeInvoke<T extends (...args: any[]) => void>(context: string, cb: T): T {
    const wrapped = ((...args: any[]) => {
      try {
        cb(...args);
      } catch (error) {
        console.error(`[StandxExchangeAdapter] ${context} handler failed: ${extractMessage(error)}`);
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
    console.error(`[StandxExchangeAdapter] ${context} failed`, error);
  }
}
