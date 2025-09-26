import { GrvtClient, GrvtWsClient, EGrvtEnvironment } from "@grvt/sdk";
import { TDG } from "@grvt/client";

import type {
  GrvtAccountSnapshot,
  GrvtOrder,
  GrvtOrderUpdateFeed,
  GrvtPosition,
  GrvtPositionUpdateFeed,
} from "../types";

export interface GrvtGatewayOptions {
  apiKey: string;
  apiSecret: string;
  subAccountId: string;
  instrument: string;
  env?: EGrvtEnvironment;
}

export class GrvtGateway {
  private readonly client: GrvtClient;
  private readonly ws: GrvtWsClient;
  private readonly tdg: TDG;

  private accountSnapshot: GrvtAccountSnapshot | null = null;
  private openOrders: GrvtOrder[] = [];
  private positions: GrvtPosition[] = [];
  private readonly instrument: string;
  private snapshotListeners = new Set<(snapshot: GrvtAccountSnapshot) => void>();
  private ordersListeners = new Set<(orders: GrvtOrder[]) => void>();
  private positionsListeners = new Set<(positions: GrvtPosition[]) => void>();

  constructor(private readonly options: GrvtGatewayOptions) {
    const environment = options.env ?? (process.env.GRVT_ENV as EGrvtEnvironment) ?? EGrvtEnvironment.TESTNET;
    this.client = new GrvtClient({
      apiKey: options.apiKey,
      apiSecret: options.apiSecret,
      env: environment,
    });
    this.ws = new GrvtWsClient({ apiKey: options.apiKey, env: environment });
    this.tdg = new TDG({ host: `https://trades.${this.client["domain"]}/lite/v1` });
    this.tdg = new TDG({ host: `https://trades.${this.client["domain"]}` });
    this.instrument = options.instrument;
  }

  async initialize(): Promise<void> {
    await this.refreshAccountSnapshot();
    await this.refreshOpenOrders();
    await this.refreshPositions();
    await this.ws.connect();
    this.subscribeStreams();
  }

  onAccount(listener: (snapshot: GrvtAccountSnapshot) => void): () => void {
    this.snapshotListeners.add(listener);
    if (this.accountSnapshot) listener(this.accountSnapshot);
    return () => {
      this.snapshotListeners.delete(listener);
    };
  }

  onOrders(listener: (orders: GrvtOrder[]) => void): () => void {
    this.ordersListeners.add(listener);
    if (this.openOrders.length) listener([...this.openOrders]);
    return () => {
      this.ordersListeners.delete(listener);
    };
  }

  onPositions(listener: (positions: GrvtPosition[]) => void): () => void {
    this.positionsListeners.add(listener);
    if (this.positions.length) listener([...this.positions]);
    return () => {
      this.positionsListeners.delete(listener);
    };
  }

  getAccountSnapshot(): GrvtAccountSnapshot | null {
    return this.accountSnapshot ? { ...this.accountSnapshot } : null;
  }

  getOpenOrders(): GrvtOrder[] {
    return [...this.openOrders];
  }

  getPositions(): GrvtPosition[] {
    return [...this.positions];
  }

  private async refreshAccountSnapshot(): Promise<void> {
    const response = await this.client.getSubAccountSummary({ sub_account_id: this.options.subAccountId });
    const snapshot = mapAccountSnapshot(response);
    this.accountSnapshot = snapshot;
    this.emitAccount(snapshot);
  }

  private async refreshOpenOrders(): Promise<void> {
    const response = await this.client.tdgClient.openOrders({ sub_account_id: this.options.subAccountId });
    const orders = mapOpenOrders(response);
    this.openOrders = orders;
    this.emitOrders(orders);
  }

  private async refreshPositions(): Promise<void> {
    const response = await this.client.tdgClient.positions({ sub_account_id: this.options.subAccountId });
    const positions = mapPositions(response);
    this.positions = positions.filter((position) => position.instrument === this.instrument);
    this.emitPositions(this.positions);
  }

  private subscribeStreams(): void {
    const orderSubscription: IWSTdgOrderRequest = {
      stream: `${EStream.ORDER}`,
      params: {
        sub_account_id: this.options.subAccountId,
        instrument: this.instrument,
      },
      onData: (message) => this.handleOrderFeed(message),
    };

    const orderStateSubscription: IWSTdgOrderStateRequest = {
      stream: `${EStream.STATE}`,
      params: {
        sub_account_id: this.options.subAccountId,
        instrument: this.instrument,
      },
      onData: (message) => this.handleOrderStateFeed(message),
    };

    const positionSubscription: IWSTdgPositionRequest = {
      stream: `${EStream.POSITION}`,
      params: {
        sub_account_id: this.options.subAccountId,
        instrument: this.instrument,
      },
      onData: (message) => this.handlePositionFeed(message),
    };

    this.ws.subscribe(orderSubscription);
    this.ws.subscribe(orderStateSubscription);
    this.ws.subscribe(positionSubscription);
  }

  private handleOrderFeed(feed: GrvtOrder): void {
    this.mergeOrder(feed);
  }

  private handleOrderStateFeed(feed: GrvtOrderUpdateFeed): void {
    this.mergeOrderState(feed);
  }

  private handlePositionFeed(feed: GrvtPositionUpdateFeed): void {
    this.mergePosition(feed);
  }

  private mergeOrder(order: GrvtOrder): void {
    const existingIndex = this.openOrders.findIndex((item) => item.order_id === order.order_id);
    if (existingIndex >= 0) {
      this.openOrders[existingIndex] = { ...this.openOrders[existingIndex], ...order };
    } else {
      this.openOrders.push(order);
    }
    this.emitOrders([...this.openOrders]);
  }

  private mergeOrderState(update: GrvtOrderUpdateFeed): void {
    const existing = this.openOrders.find((item) => item.order_id === update.order_id);
    if (existing) {
      existing.state = update.state;
      this.emitOrders([...this.openOrders]);
    }
  }

  private mergePosition(update: GrvtPositionUpdateFeed): void {
    const idx = this.positions.findIndex((item) => item.instrument === update.instrument);
    if (idx >= 0) {
      this.positions[idx] = {
        ...this.positions[idx],
        ...update,
      };
    } else {
      this.positions.push(update);
    }
    this.emitPositions([...this.positions]);
  }

  private emitAccount(snapshot: GrvtAccountSnapshot): void {
    this.snapshotListeners.forEach((listener) => {
      try {
        listener({ ...snapshot });
      } catch (error) {
        console.error("[GrvtGateway] account listener failed", error);
      }
    });
  }

  private emitOrders(orders: GrvtOrder[]): void {
    this.ordersListeners.forEach((listener) => {
      try {
        listener([...orders]);
      } catch (error) {
        console.error("[GrvtGateway] orders listener failed", error);
      }
    });
  }

  private emitPositions(positions: GrvtPosition[]): void {
    this.positionsListeners.forEach((listener) => {
      try {
        listener([...positions]);
      } catch (error) {
        console.error("[GrvtGateway] positions listener failed", error);
      }
    });
  }
}

function mapAccountSnapshot(response: IApiSubAccountSummaryResponse): GrvtAccountSnapshot {
  const result = response.result;
  if (!result) {
    return {
      total_unrealized_pnl: "0",
      positions: [],
    };
  }
  return {
    total_unrealized_pnl: result.unrealized_pnl,
    positions: (result.positions ?? []).map(mapPositionEntry),
    settle_currency: result.settle_currency,
    available_balance: result.available_balance,
  };
}

function mapOpenOrders(response: IApiOpenOrdersResponse): GrvtOrder[] {
  return (response.result ?? []).map((order) => ({
    order_id: order.order_id ?? "",
    client_order_id: order.metadata?.client_order_id,
    sub_account_id: order.sub_account_id,
    is_market: order.is_market,
    time_in_force: order.time_in_force,
    post_only: order.post_only,
    reduce_only: order.reduce_only,
    legs: order.legs?.map((leg) => ({
      instrument: leg.instrument ?? "",
      size: leg.size ?? "0",
      limit_price: leg.limit_price ?? undefined,
      is_buying_asset: leg.is_buying_asset,
    })),
    metadata: order.metadata,
    state: order.state,
  }));
}

function mapPositions(response: IApiPositionsResponse): GrvtPosition[] {
  return (response.result ?? []).map(mapPositionEntry);
}

function mapPositionEntry(entry: any): GrvtPosition {
  return {
    instrument: entry.instrument ?? "",
    size: entry.size ?? "0",
    entry_price: entry.entry_price,
    mark_price: entry.mark_price,
    unrealized_pnl: entry.unrealized_pnl,
    sub_account_id: entry.sub_account_id,
    update_time: entry.event_time,
  };
}

