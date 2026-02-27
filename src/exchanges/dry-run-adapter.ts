import type {
  AccountListener,
  ConnectionEventListener,
  DepthListener,
  ExchangeAdapter,
  ExchangePrecision,
  FundingRateListener,
  KlineListener,
  OrderListener,
  RestHealthListener,
  TickerListener,
} from "./adapter";
import type {
  AsterAccountSnapshot,
  AsterOrder,
  CreateOrderParams,
} from "./types";

export interface DryRunAction {
  method:
    | "createOrder"
    | "cancelOrder"
    | "cancelOrders"
    | "cancelAllOrders"
    | "changeMarginMode"
    | "forceCancelAllOrders";
  params: unknown;
  at: number;
}

export class DryRunExchangeAdapter implements ExchangeAdapter {
  readonly id: string;
  readonly actions: DryRunAction[] = [];
  private syntheticCounter = 0;

  constructor(private readonly inner: ExchangeAdapter) {
    this.id = inner.id;
  }

  supportsTrailingStops(): boolean {
    return this.inner.supportsTrailingStops();
  }

  watchAccount(cb: AccountListener): void {
    this.inner.watchAccount(cb);
  }

  watchOrders(cb: OrderListener): void {
    this.inner.watchOrders(cb);
  }

  watchDepth(symbol: string, cb: DepthListener): void {
    this.inner.watchDepth(symbol, cb);
  }

  watchTicker(symbol: string, cb: TickerListener): void {
    this.inner.watchTicker(symbol, cb);
  }

  watchKlines(symbol: string, interval: string, cb: KlineListener): void {
    this.inner.watchKlines(symbol, interval, cb);
  }

  watchFundingRate(symbol: string, cb: FundingRateListener): void {
    if (!this.inner.watchFundingRate) return;
    this.inner.watchFundingRate(symbol, cb);
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    this.record("createOrder", params);
    return createSyntheticOrder(params, ++this.syntheticCounter);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    this.record("cancelOrder", params);
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    this.record("cancelOrders", params);
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    this.record("cancelAllOrders", params);
  }

  async getPrecision(): Promise<ExchangePrecision | null> {
    if (!this.inner.getPrecision) return null;
    return this.inner.getPrecision();
  }

  onConnectionEvent(listener: ConnectionEventListener): void {
    this.inner.onConnectionEvent?.(listener);
  }

  offConnectionEvent(listener: ConnectionEventListener): void {
    this.inner.offConnectionEvent?.(listener);
  }

  onRestHealthEvent(listener: RestHealthListener): void {
    this.inner.onRestHealthEvent?.(listener);
  }

  offRestHealthEvent(listener: RestHealthListener): void {
    this.inner.offRestHealthEvent?.(listener);
  }

  async queryOpenOrders(): Promise<AsterOrder[]> {
    if (!this.inner.queryOpenOrders) return [];
    return this.inner.queryOpenOrders();
  }

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    if (!this.inner.queryAccountSnapshot) return null;
    return this.inner.queryAccountSnapshot();
  }

  async changeMarginMode(params: { symbol: string; marginMode: "isolated" | "cross" }): Promise<void> {
    this.record("changeMarginMode", params);
  }

  async forceCancelAllOrders(): Promise<boolean> {
    this.record("forceCancelAllOrders", {});
    return true;
  }

  private record(method: DryRunAction["method"], params: unknown): void {
    this.actions.push({ method, params, at: Date.now() });
  }
}

function createSyntheticOrder(params: CreateOrderParams, counter: number): AsterOrder {
  const now = Date.now();
  const orderId = `dry-run-${now}-${counter}`;
  return {
    orderId,
    clientOrderId: orderId,
    symbol: params.symbol,
    side: params.side,
    type: params.type,
    status: "NEW",
    price: toStringNumber(params.price),
    origQty: toStringNumber(params.quantity),
    executedQty: "0",
    stopPrice: toStringNumber(params.stopPrice),
    time: now,
    updateTime: now,
    reduceOnly: params.reduceOnly === "true",
    closePosition: params.closePosition === "true",
    activationPrice: toOptionalString(params.activationPrice),
    timeInForce: params.timeInForce,
    workingType: "MARK_PRICE",
  };
}

function toStringNumber(value: number | undefined): string {
  if (value == null) return "0";
  return String(value);
}

function toOptionalString(value: number | undefined): string | undefined {
  if (value == null) return undefined;
  return String(value);
}
