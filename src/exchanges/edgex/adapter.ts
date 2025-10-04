import type {
  AccountListener,
  DepthListener,
  ExchangeAdapter,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type { AsterAccountSnapshot, AsterOrder, AsterDepth, AsterTicker, AsterKline, CreateOrderParams } from "../types";
import { EdgeXGateway } from "./gateway";

export interface EdgeXCredentials {
  accountId?: string;
  privateKey?: string;
  positionId?: bigint;
  baseUrl?: string;
  wsPublicUrl?: string;
  wsPrivateUrl?: string;
  orderExpirationMs?: number;
  logger?: (context: string, error: unknown) => void;
}

export class EdgeXExchangeAdapter implements ExchangeAdapter {
  readonly id = "edgex";

  private readonly gateway: EdgeXGateway;
  private initialized = false;

  constructor(symbol: string, credentials: EdgeXCredentials = {}) {
    const accountId = credentials.accountId ?? process.env.EDGEX_ACCOUNT_ID;
    const privateKey = credentials.privateKey ?? process.env.EDGEX_PRIVATE_KEY;
    const positionIdValue = credentials.positionId ?? parseOptionalBigInt(process.env.EDGEX_POSITION_ID);

    if (!accountId) throw new Error("Missing EDGEX_ACCOUNT_ID environment variable");
    if (!privateKey) throw new Error("Missing EDGEX_PRIVATE_KEY environment variable");

    this.gateway = new EdgeXGateway({
      accountId,
      privateKey,
      symbol,
      positionId: positionIdValue,
      baseUrl: credentials.baseUrl ?? process.env.EDGEX_BASE_URL,
      wsPublicUrl: credentials.wsPublicUrl ?? process.env.EDGEX_WS_PUBLIC_URL,
      wsPrivateUrl: credentials.wsPrivateUrl ?? process.env.EDGEX_WS_PRIVATE_URL,
      orderExpirationMs:
        credentials.orderExpirationMs ?? parseOptionalInt(process.env.EDGEX_ORDER_TTL_MS) ?? undefined,
      logger: credentials.logger,
    });
  }

  supportsTrailingStops(): boolean {
    return false;
  }

  watchAccount(cb: AccountListener): void {
    void this.ensureInitialized();
    this.gateway.onAccount((snapshot: AsterAccountSnapshot) => cb(snapshot));
  }

  watchOrders(cb: OrderListener): void {
    void this.ensureInitialized();
    this.gateway.onOrders((orders: AsterOrder[]) => cb(orders));
  }

  watchDepth(_symbol: string, cb: DepthListener): void {
    void this.ensureInitialized();
    this.gateway.onDepth(_symbol, (depth: AsterDepth) => cb(depth));
  }

  watchTicker(_symbol: string, cb: TickerListener): void {
    void this.ensureInitialized();
    this.gateway.onTicker(_symbol, (ticker: AsterTicker) => cb(ticker));
  }

  watchKlines(_symbol: string, interval: string, cb: KlineListener): void {
    void this.ensureInitialized();
    this.gateway.onKlines(interval, (klines: AsterKline[]) => cb(klines));
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized();
    return this.gateway.createOrder(params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.ensureInitialized();
    await this.gateway.cancelOrder(String(params.orderId));
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized();
    await this.gateway.cancelOrders(params.orderIdList.map(String));
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.ensureInitialized();
    await this.gateway.cancelAllOrders();
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await this.gateway.ensureInitialized();
    this.initialized = true;
  }
}

function parseOptionalInt(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalBigInt(value?: string): bigint | undefined {
  if (!value) return undefined;
  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
}
