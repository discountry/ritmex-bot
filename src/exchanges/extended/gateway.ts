import axios, { AxiosInstance } from "axios";
import NodeWebSocket from "ws";
import { setTimeout, clearTimeout, setInterval, clearInterval } from "timers";
import type {
  AccountListener,
  DepthListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type {
  AsterAccountAsset,
  AsterAccountPosition,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
} from "../types";
import { toDecimal } from "./math";
import { ExtendedOrderBuilder, type ExtendedOrderContext } from "./order-builder";
import { tryInitExtendedWasm } from "./signing";
import type {
  ExtendedBalance,
  ExtendedCandle,
  ExtendedDepthMessage,
  ExtendedFees,
  ExtendedMarket,
  ExtendedOrder,
  ExtendedPosition,
  ExtendedStarknetDomain,
  ExtendedTrade,
} from "./types";

const WebSocketCtor: typeof globalThis.WebSocket =
  typeof globalThis.WebSocket !== "undefined" ? globalThis.WebSocket : ((NodeWebSocket as unknown) as typeof globalThis.WebSocket);
type WebSocket = typeof WebSocketCtor extends { new (...args: any[]): infer R } ? R : NodeWebSocket;

const RECONNECT_DELAY_MS = 3000;

export interface ExtendedGatewayOptions {
  apiKey: string;
  starkPrivateKey: string;
  vaultId: string;
  market: string;
  apiHost?: string;
  streamHost?: string;
  privateStreamHost?: string;
  userAgent?: string;
  logger?: (context: string, error: unknown) => void;
}

interface AccountState {
  balance: ExtendedBalance | null;
  positions: ExtendedPosition[];
  orders: ExtendedOrder[];
}

interface DepthState {
  bids: [string, string][];
  asks: [string, string][];
  seq: number;
  ts: number;
}

export class ExtendedGateway {
  private readonly options: ExtendedGatewayOptions;
  private readonly logger: (context: string, error: unknown) => void;
  private readonly axios: AxiosInstance;
  private marketInfo: ExtendedMarket | null = null;
  private fees: ExtendedFees | null = null;
  private domain: ExtendedStarknetDomain | null = null;
  private orderBuilder: ExtendedOrderBuilder | null = null;
  private initialized = false;

  private accountState: AccountState = { balance: null, positions: [], orders: [] };
  private readonly accountListeners = new Set<AccountListener>();
  private readonly orderListeners = new Set<OrderListener>();
  private readonly depthListeners = new Set<DepthListener>();
  private readonly tickerListeners = new Set<TickerListener>();
  private readonly klineListeners = new Map<string, Set<KlineListener>>();

  private accountWs: WebSocket | null = null;
  private depthWs: WebSocket | null = null;
  private tradesWs: WebSocket | null = null;
  private candleWs = new Map<string, WebSocket>();
  private reconnectTimers: Array<ReturnType<typeof setTimeout>> = [];
  private lastDepth: DepthState | null = null;
  private lastTrade: ExtendedTrade | null = null;

  constructor(options: ExtendedGatewayOptions) {
    this.options = options;
    this.logger =
      options.logger ??
      ((context, error) => {
        console.error(`[ExtendedGateway] ${context}`, error);
      });
    const baseURL = `https://${options.apiHost ?? "api.starknet.extended.exchange"}`;
    this.axios = axios.create({
      baseURL,
      headers: {
        "X-Api-Key": options.apiKey,
        "User-Agent": options.userAgent ?? "ritmex-bot",
      },
    });
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    this.logInfo("init", `Initializing Extended for ${this.options.market}`);
    await tryInitExtendedWasm();
    await Promise.all([this.loadMarket(), this.loadFees(), this.loadDomain()]);
    this.orderBuilder = new ExtendedOrderBuilder(this.buildOrderContext());
    await this.loadInitialAccount();
    this.startAccountStream();
    this.startDepthStream();
    this.startTradesStream();
    this.initialized = true;
    this.logInfo("init", "Extended gateway ready");
  }

  destroy(): void {
    this.closeSocket(this.accountWs);
    this.closeSocket(this.depthWs);
    this.closeSocket(this.tradesWs);
    for (const ws of this.candleWs.values()) {
      this.closeSocket(ws);
    }
    this.candleWs.clear();
    this.reconnectTimers.forEach((timer) => clearTimeout(timer));
    this.reconnectTimers = [];
  }

  onAccount(listener: AccountListener): void {
    this.accountListeners.add(listener);
    const snapshot = this.buildAccountSnapshot();
    if (snapshot) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("accountReplay", error);
      }
    }
  }

  onOrders(listener: OrderListener): void {
    this.orderListeners.add(listener);
    if (this.accountState.orders.length) {
      try {
        listener(this.accountState.orders.map((order) => this.mapOrder(order)));
      } catch (error) {
        this.logger("ordersReplay", error);
      }
    }
  }

  onDepth(listener: DepthListener): void {
    this.depthListeners.add(listener);
    if (this.lastDepth) {
      listener(this.mapDepth(this.lastDepth));
    }
  }

  onTicker(listener: TickerListener): void {
    this.tickerListeners.add(listener);
    const ticker = this.buildTicker();
    if (ticker) {
      listener(ticker);
    }
  }

  watchKlines(interval: string, listener: KlineListener): void {
    const set = this.klineListeners.get(interval) ?? new Set<KlineListener>();
    set.add(listener);
    this.klineListeners.set(interval, set);
    this.ensureCandleStream(interval);
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    if (!this.orderBuilder) {
      await this.ensureInitialized();
    }
    const builder = this.orderBuilder!;
    const marketPrice = this.estimateMarketPrice(params.side);
    const built = builder.build({ ...params, marketPrice });
    const { data } = await this.axios.post<{ data?: ExtendedOrder; status?: string }>("/api/v1/user/order", built.payload);
    // Some responses only return status; fallback to local mapping using request params.
    const order = data?.data ?? null;
    if (order) {
      return this.mapOrder(order);
    }
    // Fallback: return lightweight order reflecting submission.
    return this.mapOrder({
      id: built.orderId,
      market: this.options.market,
      type: this.normalizeOrderType(params.type),
      side: params.side,
      status: "NEW",
      price: built.payload.price as string,
      qty: built.payload.qty as string,
      filledQty: "0",
      reduceOnly: built.payload.reduceOnly as boolean,
      postOnly: built.payload.postOnly as boolean,
      createdTime: Date.now(),
      updatedTime: Date.now(),
      trigger: built.payload.trigger as any,
    });
  }

  async cancelOrder(params: { orderId: number | string }): Promise<void> {
    await this.axios.delete(`/api/v1/user/order/${params.orderId}`);
  }

  async cancelOrders(params: { orderIdList: Array<number | string> }): Promise<void> {
    await this.axios.post("/api/v1/user/order/massCancel", { orderIds: params.orderIdList });
  }

  async cancelAllOrders(): Promise<void> {
    await this.axios.post("/api/v1/user/order/massCancel", { markets: [this.options.market] });
  }

  async getPrecision(): Promise<{ priceTick: number; qtyStep: number } | null> {
    if (!this.marketInfo) return null;
    const { tradingConfig } = this.marketInfo;
    return {
      priceTick: Number(tradingConfig.minPriceChange),
      qtyStep: Number(tradingConfig.minOrderSizeChange),
    };
  }

  // ---- Internal fetchers --------------------------------------------------

  private async loadMarket(): Promise<void> {
    const { data } = await this.axios.get<{ data: ExtendedMarket[] }>("/api/v1/info/markets", {
      params: { market: [this.options.market] },
    });
    const market = (data?.data ?? [])[0];
    if (!market) {
      throw new Error(`Extended market not found: ${this.options.market}`);
    }
    this.marketInfo = market;
  }

  private async loadFees(): Promise<void> {
    const { data } = await this.axios.get<{ data: ExtendedFees[] }>("/api/v1/user/fees", {
      params: { market: [this.options.market] },
    });
    const fees = (data?.data ?? [])[0];
    if (!fees) {
      throw new Error("Unable to fetch Extended fee configuration");
    }
    this.fees = fees;
  }

  private async loadDomain(): Promise<void> {
    const { data } = await this.axios.get<{ data: ExtendedStarknetDomain }>("/api/v1/info/starknet");
    if (!data?.data) {
      throw new Error("Failed to load Extended Starknet domain");
    }
    this.domain = data.data;
  }

  private async loadInitialAccount(): Promise<void> {
    try {
      const [balanceRes, positionsRes, ordersRes] = await Promise.all([
        this.axios.get<{ data: ExtendedBalance }>("/api/v1/user/balance"),
        this.axios.get<{ data: ExtendedPosition[] }>("/api/v1/user/positions", {
          params: { market: [this.options.market] },
        }),
        this.axios.get<{ data: ExtendedOrder[] }>("/api/v1/user/orders", {
          params: { market: [this.options.market] },
        }),
      ]);
      this.accountState.balance = balanceRes.data?.data ?? null;
      this.accountState.positions = positionsRes.data?.data ?? [];
      this.accountState.orders = ordersRes.data?.data ?? [];
      this.emitAccount();
      this.emitOrders();
    } catch (error) {
      this.logger("loadInitialAccount", error);
    }
  }

  private buildOrderContext(): ExtendedOrderContext {
    if (!this.marketInfo || !this.fees || !this.domain) {
      throw new Error("Extended gateway not ready");
    }
    return {
      market: this.marketInfo,
      fees: this.fees,
      domain: this.domain,
      vaultId: this.options.vaultId,
      starkPrivateKey: this.options.starkPrivateKey,
      builderFeeRate: this.fees.builderFeeRate,
    };
  }

  // ---- WebSocket handling -------------------------------------------------

  private startAccountStream(): void {
    const host = this.options.privateStreamHost ?? this.options.streamHost ?? "api.starknet.extended.exchange";
    const url = `wss://${host}/stream.extended.exchange/v1/account`;
    this.accountWs = this.createSocket(
      url,
      { headers: { "X-Api-Key": this.options.apiKey, "User-Agent": this.options.userAgent ?? "ritmex-bot" } },
      "account",
      (payload) => {
        this.handleAccountMessage(payload);
      },
      (socket) => {
        this.accountWs = socket;
      }
    );
  }

  private startDepthStream(): void {
    const host = this.options.streamHost ?? "api.starknet.extended.exchange";
    const url = `wss://${host}/stream.extended.exchange/v1/orderbooks/${encodeURIComponent(this.options.market)}?depth=1`;
    this.depthWs = this.createSocket(
      url,
      undefined,
      "depth",
      (payload) => {
        this.handleDepthMessage(payload as ExtendedDepthMessage);
      },
      (socket) => {
        this.depthWs = socket;
      }
    );
  }

  private startTradesStream(): void {
    const host = this.options.streamHost ?? "api.starknet.extended.exchange";
    const url = `wss://${host}/stream.extended.exchange/v1/publicTrades/${encodeURIComponent(this.options.market)}`;
    this.tradesWs = this.createSocket(
      url,
      undefined,
      "trades",
      (payload) => {
        this.handleTradesMessage(payload as { data?: ExtendedTrade[]; ts?: number; seq?: number });
      },
      (socket) => {
        this.tradesWs = socket;
      }
    );
  }

  private ensureCandleStream(interval: string): void {
    if (this.candleWs.has(interval)) return;
    const host = this.options.streamHost ?? "api.starknet.extended.exchange";
    const url = `wss://${host}/stream.extended.exchange/v1/candles/${encodeURIComponent(this.options.market)}/trades?interval=${encodeURIComponent(interval)}`;
    const ws = this.createSocket(
      url,
      undefined,
      `candle:${interval}`,
      (payload) => {
        this.handleCandleMessage(interval, payload as { data?: ExtendedCandle[] });
      },
      (socket) => {
        this.candleWs.set(interval, socket);
      }
    );
    this.candleWs.set(interval, ws);
  }

  private createSocket(
    url: string,
    options: NodeWebSocket.ClientOptions | undefined,
    context: string,
    handler: (data: any) => void,
    onCreate?: (socket: WebSocket) => void
  ): WebSocket {
    const ws = new WebSocketCtor(url, options as any);
    if (onCreate) {
      onCreate(ws as any);
    }
    let pingTimer: ReturnType<typeof setInterval> | null = null;
    ws.onopen = () => {
      if (pingTimer) clearInterval(pingTimer);
      pingTimer = setInterval(() => {
        try {
          ws.send(JSON.stringify({ type: "ping" }));
        } catch (_error) {
          /* ignore */
        }
      }, 15_000);
      this.logInfo(`${context}:open`, url);
    };
    ws.onmessage = (event) => {
      try {
        const data = typeof event.data === "string" ? event.data : event.data.toString();
        if (data === "ping") {
          ws.send("pong");
          return;
        }
        handler(JSON.parse(data));
      } catch (error) {
        this.logger(`${context}:message`, error);
      }
    };
    ws.onerror = (error) => {
      this.logError(`${context}:error`, error);
    };
    ws.onclose = () => {
      if (pingTimer) clearInterval(pingTimer);
      const timer = setTimeout(() => {
        this.logInfo(`${context}:reconnect`, `reconnecting to ${url}`);
        this.reconnectTimers = this.reconnectTimers.filter((t) => t !== timer);
        this.createSocket(url, options, context, handler, onCreate);
      }, RECONNECT_DELAY_MS);
      this.reconnectTimers.push(timer);
      this.logInfo(`${context}:close`, `closed ${url}`);
    };
    return ws;
  }

  private closeSocket(socket: WebSocket | null): void {
    if (socket && socket.readyState === socket.OPEN) {
      socket.close();
    }
  }

  // ---- WS handlers -------------------------------------------------------

  private handleAccountMessage(message: any): void {
    if (!message || typeof message !== "object") return;
    const type = message.type;
    const data = message.data ?? {};
    if (type === "BALANCE" && data.balance) {
      this.accountState.balance = data.balance as ExtendedBalance;
      this.emitAccount();
      this.logInfo("account:balance", "updated");
      return;
    }
    if (type === "POSITION" && Array.isArray(data.positions)) {
      this.accountState.positions = data.positions as ExtendedPosition[];
      this.emitAccount();
      this.logInfo("account:positions", `positions=${data.positions.length}`);
      return;
    }
    if (type === "ORDER" && Array.isArray(data.orders)) {
      this.accountState.orders = data.orders as ExtendedOrder[];
      this.emitOrders();
      this.logInfo("account:orders", `orders=${data.orders.length}`);
      return;
    }
    if (type === "TRADE" && Array.isArray(data.trades)) {
      // Trades can update fills; refresh orders if present.
      if (Array.isArray(data.orders)) {
        this.accountState.orders = data.orders as ExtendedOrder[];
        this.emitOrders();
      }
      return;
    }
    // Fallback: handle messages where data is nested without type
    const payload = message.data ?? message;
    if (payload?.balance) {
      this.accountState.balance = payload.balance as ExtendedBalance;
      this.emitAccount();
      this.logInfo("account:balance", "snapshot");
    }
    if (payload?.positions) {
      this.accountState.positions = payload.positions as ExtendedPosition[];
      this.emitAccount();
      this.logInfo("account:positions", `positions=${(payload.positions as ExtendedPosition[]).length}`);
    }
    if (payload?.orders) {
      this.accountState.orders = payload.orders as ExtendedOrder[];
      this.emitOrders();
      this.logInfo("account:orders", `orders=${(payload.orders as ExtendedOrder[]).length}`);
    }
  }

  private handleDepthMessage(message: ExtendedDepthMessage): void {
    if (!message?.data) return;
    const bids = (message.data.b ?? []).map((level) => [String(level.p), String(level.q)] as [string, string]);
    const asks = (message.data.a ?? []).map((level) => [String(level.p), String(level.q)] as [string, string]);
    this.lastDepth = { bids, asks, seq: message.seq ?? Date.now(), ts: message.ts ?? Date.now() };
    this.emitDepth();
    this.emitTicker();
    if (bids.length || asks.length) {
      this.logDebug("depth", `bids=${bids[0]?.[0] ?? "-"} asks=${asks[0]?.[0] ?? "-"}`);
    }
  }

  private handleTradesMessage(message: { data?: ExtendedTrade[]; ts?: number }): void {
    const trades = message?.data ?? [];
    if (!trades.length) return;
    this.lastTrade = trades[trades.length - 1];
    this.emitTicker();
    this.logDebug("trades", `last=${this.lastTrade.p} side=${this.lastTrade.S}`);
  }

  private handleCandleMessage(interval: string, payload: { data?: ExtendedCandle[] }): void {
    const candles = payload?.data ?? [];
    if (!candles.length) return;
    const mapped = candles.map((candle) => this.mapKline(candle));
    const listeners = this.klineListeners.get(interval);
    if (!listeners) return;
    listeners.forEach((listener) => {
      try {
        listener(mapped);
      } catch (error) {
        this.logger(`kline:${interval}`, error);
      }
    });
  }

  // ---- Emitters ----------------------------------------------------------

  private emitAccount(): void {
    const snapshot = this.buildAccountSnapshot();
    if (!snapshot) return;
    for (const listener of this.accountListeners) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logError("accountListener", error);
      }
    }
  }

  private emitOrders(): void {
    const mapped = this.accountState.orders.map((order) => this.mapOrder(order));
    for (const listener of this.orderListeners) {
      try {
        listener(mapped);
      } catch (error) {
        this.logError("orderListener", error);
      }
    }
  }

  private emitDepth(): void {
    if (!this.lastDepth) return;
    const depth = this.mapDepth(this.lastDepth);
    for (const listener of this.depthListeners) {
      try {
        listener(depth);
      } catch (error) {
        this.logError("depthListener", error);
      }
    }
  }

  private emitTicker(): void {
    const ticker = this.buildTicker();
    if (!ticker) return;
    for (const listener of this.tickerListeners) {
      try {
        listener(ticker);
      } catch (error) {
        this.logError("tickerListener", error);
      }
    }
  }

  // ---- Mapping helpers ---------------------------------------------------

  private buildAccountSnapshot(): AsterAccountSnapshot | null {
    const balance = this.accountState.balance;
    if (!balance) return null;
    const positions = (this.accountState.positions ?? []).map((position) => this.mapPosition(position));
    const totalUnrealized = positions.reduce((acc, pos) => acc + (Number(pos.unrealizedProfit) || 0), 0);
    const assets: AsterAccountAsset[] = [
      {
        asset: balance.collateralName ?? "USDC",
        walletBalance: balance.balance ?? "0",
        availableBalance: balance.availableForTrade ?? balance.balance ?? "0",
        updateTime: balance.updatedTime ?? Date.now(),
        unrealizedProfit: balance.unrealisedPnl,
        marginBalance: balance.equity,
        maxWithdrawAmount: balance.availableForWithdrawal,
      },
    ];
    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: balance.updatedTime ?? Date.now(),
      totalWalletBalance: balance.balance ?? "0",
      totalUnrealizedProfit: Number.isFinite(totalUnrealized) ? String(totalUnrealized) : "0",
      availableBalance: balance.availableForTrade ?? balance.balance ?? "0",
      maxWithdrawAmount: balance.availableForWithdrawal,
      positions,
      assets,
    };
  }

  private mapPosition(position: ExtendedPosition): AsterAccountPosition {
    const size = toDecimal(position.size);
    const signed = position.side === "SHORT" ? size.negated() : size;
    return {
      symbol: position.market,
      positionAmt: signed.toString(10),
      entryPrice: position.openPrice ?? "0",
      unrealizedProfit: position.unrealisedPnl ?? "0",
      positionSide: position.side === "SHORT" ? "SHORT" : "LONG",
      updateTime: position.updatedAt ?? Date.now(),
      markPrice: position.markPrice,
      leverage: position.leverage,
      liquidationPrice: position.liquidationPrice,
      marginType: "cross",
    };
  }

  private mapOrder(order: ExtendedOrder): AsterOrder {
    const stopPrice =
      order.trigger?.triggerPrice ??
      order.takeProfit?.triggerPrice ??
      order.stopLoss?.triggerPrice ??
      null;
    return {
      orderId: order.id,
      clientOrderId: order.externalId ?? String(order.id),
      symbol: order.market,
      side: order.side,
      type: this.normalizeOrderType(order.type),
      status: order.status,
      price: order.price ?? "0",
      origQty: order.qty ?? "0",
      executedQty: order.filledQty ?? "0",
      stopPrice: stopPrice ? String(stopPrice) : "0",
      time: order.createdTime ?? Date.now(),
      updateTime: order.updatedTime ?? order.createdTime ?? Date.now(),
      reduceOnly: Boolean(order.reduceOnly),
      closePosition: Boolean(order.reduceOnly),
      workingType: order.trigger?.triggerPriceType,
      activationPrice: stopPrice ? String(stopPrice) : undefined,
      avgPrice: order.averagePrice ?? undefined,
      cumQuote: order.payedFee,
      timeInForce: order.type === "MARKET" ? "IOC" : "GTC",
    };
  }

  private mapDepth(state: DepthState): AsterDepth {
    return {
      lastUpdateId: state.seq,
      bids: state.bids,
      asks: state.asks,
      eventTime: state.ts,
      tradeTime: state.ts,
    };
  }

  private mapKline(candle: ExtendedCandle): AsterKline {
    return {
      eventType: "kline",
      eventTime: candle.T,
      openTime: candle.T,
      closeTime: candle.T,
      interval: "stream",
      open: candle.o,
      high: candle.h,
      low: candle.l,
      close: candle.c,
      volume: candle.v ?? "0",
      numberOfTrades: 0,
      isClosed: true,
    };
  }

  private buildTicker(): AsterTicker | null {
    const lastPrice = this.lastTrade?.p ?? this.marketInfo?.marketStats?.lastPrice;
    if (!lastPrice && !this.lastDepth) return null;
    return {
      symbol: this.options.market,
      lastPrice: lastPrice ?? "0",
      openPrice: this.marketInfo?.marketStats?.indexPrice ?? lastPrice ?? "0",
      highPrice: this.marketInfo?.marketStats?.markPrice ?? lastPrice ?? "0",
      lowPrice: this.marketInfo?.marketStats?.markPrice ?? lastPrice ?? "0",
      volume: "0",
      quoteVolume: "0",
      bidPrice: this.lastDepth?.bids?.[0]?.[0],
      askPrice: this.lastDepth?.asks?.[0]?.[0],
      eventTime: Date.now(),
    };
  }

  private estimateMarketPrice(side: "BUY" | "SELL", fallback?: number): number | undefined {
    const bestBid = Number(this.lastDepth?.bids?.[0]?.[0]);
    const bestAsk = Number(this.lastDepth?.asks?.[0]?.[0]);
    if (side === "BUY" && Number.isFinite(bestAsk)) return bestAsk;
    if (side === "SELL" && Number.isFinite(bestBid)) return bestBid;
    if (Number.isFinite(fallback)) return fallback;
    const last = Number(this.lastTrade?.p ?? this.marketInfo?.marketStats?.lastPrice);
    return Number.isFinite(last) ? last : undefined;
  }

  private normalizeOrderType(type: string): AsterOrder["type"] {
    const normalized = type.toUpperCase();
    if (normalized === "LIMIT" || normalized === "MARKET") return normalized as any;
    return "STOP_MARKET";
  }

  private logInfo(context: string, message: unknown): void {
    console.info(`[ExtendedGateway] ${context}: ${message as string}`);
  }

  private logDebug(context: string, message: unknown): void {
    if (process.env.EXTENDED_DEBUG === "1" || process.env.EXTENDED_DEBUG === "true") {
      console.debug(`[ExtendedGateway] ${context}: ${message as string}`);
    }
  }

  private logError(context: string, error: unknown): void {
    this.logger(context, error);
    if (process.env.EXTENDED_DEBUG === "1" || process.env.EXTENDED_DEBUG === "true") {
      console.error(`[ExtendedGateway] ${context}`, error);
    }
  }
}
