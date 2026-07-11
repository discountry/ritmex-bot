import type {
  AccountListener,
  ConnectionEventListener,
  DepthListener,
  ExchangeAdapter,
  ExchangePrecision,
  FundingRateListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import { createInitManager, createSafeInvoke } from "../adapter-utils";
import type { CreateOrderParams, Order } from "../types";
import { OndoperpsGateway, type OndoperpsGatewayOptions } from "./gateway";

export interface OndoperpsCredentials {
  apiKeyId?: string;
  apiSecret?: string;
  symbol?: string;
  baseUrl?: string;
  wsUrl?: string;
  builderCode?: string;
  builderFeeRateBps?: number;
  logger?: OndoperpsGatewayOptions["logger"];
}

export class OndoperpsExchangeAdapter implements ExchangeAdapter {
  readonly id = "ondoperps";

  private readonly gateway: OndoperpsGateway;
  private readonly symbol: string;
  private readonly safeInvoke = createSafeInvoke("OndoperpsExchangeAdapter");
  private readonly init: ReturnType<typeof createInitManager>;

  constructor(credentials: OndoperpsCredentials = {}) {
    const apiKeyId = credentials.apiKeyId ?? process.env.ONDOPERPS_API_KEY_ID ?? process.env.ONDOPERP_API_KEY_ID ?? process.env.ONDO_KEY_ID;
    const apiSecret = credentials.apiSecret ?? process.env.ONDOPERPS_API_SECRET ?? process.env.ONDOPERP_API_SECRET ?? process.env.ONDO_API_SECRET;
    if (!apiKeyId || !apiSecret) {
      throw new Error("Missing ONDOPERPS_API_KEY_ID or ONDOPERPS_API_SECRET environment variable");
    }
    this.symbol = credentials.symbol ?? process.env.ONDOPERPS_SYMBOL ?? process.env.ONDOPERP_SYMBOL ?? process.env.TRADE_SYMBOL ?? "BTC-USD.P";
    const sandbox = parseBoolean(process.env.ONDOPERPS_SANDBOX ?? process.env.ONDOPERP_SANDBOX);
    this.gateway = new OndoperpsGateway({
      apiKeyId,
      apiSecret,
      symbol: this.symbol,
      baseUrl: credentials.baseUrl ?? process.env.ONDOPERPS_BASE_URL ?? process.env.ONDOPERP_BASE_URL ?? (sandbox ? "https://api.ondoperps-sandbox.xyz" : undefined),
      wsUrl: credentials.wsUrl ?? process.env.ONDOPERPS_WS_URL ?? process.env.ONDOPERP_WS_URL ?? (sandbox ? "wss://api.ondoperps-sandbox.xyz/ws" : undefined),
      builderCode: credentials.builderCode ?? process.env.ONDOPERPS_BUILDER_CODE ?? process.env.ONDOPERP_BUILDER_CODE,
      builderFeeRateBps: credentials.builderFeeRateBps ?? parseNumber(
        process.env.ONDOPERPS_BUILDER_FEE_RATE_BPS ?? process.env.ONDOPERP_BUILDER_FEE_RATE_BPS,
      ),
      logger: credentials.logger,
    });
    this.init = createInitManager("OndoperpsExchangeAdapter", () => this.gateway.ensureInitialized());
  }

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(cb: AccountListener): void {
    void this.init.ensureInitialized("watchAccount");
    this.gateway.onAccount(this.safeInvoke("watchAccount", cb));
  }

  watchOrders(cb: OrderListener): void {
    void this.init.ensureInitialized("watchOrders");
    this.gateway.onOrders(this.safeInvoke("watchOrders", cb));
  }

  watchDepth(symbol: string, cb: DepthListener): void {
    void this.init.ensureInitialized("watchDepth");
    this.gateway.onDepth(symbol, this.safeInvoke("watchDepth", cb));
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    void this.init.ensureInitialized("watchTicker");
    this.gateway.onTicker(symbol, this.safeInvoke("watchTicker", cb));
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    void this.init.ensureInitialized("watchKlines");
    this.gateway.onKlines(symbol, interval, this.safeInvoke("watchKlines", cb));
  }

  watchFundingRate(symbol: string, cb: FundingRateListener): void {
    void this.init.ensureInitialized("watchFundingRate");
    this.gateway.onFundingRate(symbol, this.safeInvoke("watchFundingRate", cb));
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

  onConnectionEvent(listener: ConnectionEventListener): void {
    this.gateway.onConnectionEvent(listener);
  }

  offConnectionEvent(listener: ConnectionEventListener): void {
    this.gateway.offConnectionEvent(listener);
  }

  async queryOpenOrders(): Promise<Order[]> {
    await this.init.ensureInitialized("queryOpenOrders");
    return this.gateway.queryOpenOrders();
  }

  async queryAccountSnapshot() {
    await this.init.ensureInitialized("queryAccountSnapshot");
    return this.gateway.queryAccountSnapshot();
  }

  async forceCancelAllOrders(): Promise<boolean> {
    await this.init.ensureInitialized("forceCancelAllOrders");
    return this.gateway.forceCancelAllOrders();
  }
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
