import { createHmac } from "node:crypto";
import type {
  AccountListener,
  ConnectionEventListener,
  DepthListener,
  ExchangePrecision,
  FundingRateListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type {
  AccountPosition,
  AccountSnapshot,
  CreateOrderParams,
  Depth,
  Kline,
  Order,
  OrderType,
  Ticker,
  TimeInForce,
} from "../types";
import type {
  OndoperpsApiResponse,
  OndoperpsBalance,
  OndoperpsBookLevel,
  OndoperpsBookSnapshot,
  OndoperpsCandle,
  OndoperpsContract,
  OndoperpsFundingRate,
  OndoperpsMarketsResult,
  OndoperpsMarkPrice,
  OndoperpsOrder,
  OndoperpsPosition,
  OndoperpsStopOrders,
  OndoperpsWsKline,
  OndoperpsWsMessage,
} from "./types";

const DEFAULT_BASE_URL = "https://api.ondoperps.xyz";
const DEFAULT_WS_URL = "wss://api.ondoperps.xyz/ws";
const DEFAULT_SYMBOL = "BTC-USD.P";
const REQUEST_TIMEOUT_MS = 15_000;
const WS_HEARTBEAT_MS = 30_000;
const WS_RECONNECT_MAX_MS = 30_000;

type Timer = ReturnType<typeof setInterval>;
type Timeout = ReturnType<typeof setTimeout>;

export interface OndoperpsGatewayOptions {
  apiKeyId: string;
  apiSecret: string;
  symbol?: string;
  baseUrl?: string;
  wsUrl?: string;
  builderCode?: string;
  builderFeeRateBps?: number;
  fetchFn?: typeof fetch;
  webSocketFactory?: (url: string) => WebSocket;
  now?: () => number;
  logger?: (context: string, error: unknown) => void;
}

export interface OndoperpsAuthInput {
  apiKeyId: string;
  apiSecret: string;
  timestamp: string;
  method: string;
  requestPath: string;
  body: string;
}

export function createOndoperpsRestSignature(input: Omit<OndoperpsAuthInput, "apiKeyId">): string {
  const message = `${input.timestamp}${input.method.toUpperCase()}${input.requestPath}${input.body}`;
  return createHmac("sha256", input.apiSecret).update(message).digest("hex");
}

export function buildOndoperpsAuthHeaders(input: OndoperpsAuthInput): Record<string, string> {
  return {
    "ONDO-KEY-ID": input.apiKeyId,
    "ONDO-TIMESTAMP": input.timestamp,
    "ONDO-SIGN": createOndoperpsRestSignature(input),
  };
}

export function createOndoperpsWsSignature(
  apiSecret: string,
  timestamp: string,
  prefixFirst = false,
): string {
  const message = prefixFirst
    ? `ondo_perps_ws_login${timestamp}`
    : `${timestamp}ondo_perps_ws_login`;
  return createHmac("sha256", apiSecret)
    .update(message)
    .digest("hex");
}

export function normalizeOndoperpsSymbol(value: string): string {
  const normalized = value.trim().toUpperCase().replaceAll("/", "-");
  if (!normalized) return DEFAULT_SYMBOL;
  if (normalized.endsWith(".P")) return normalized;
  if (normalized.includes("-")) {
    const [base] = normalized.split("-", 1);
    return `${base ?? normalized}-USD.P`;
  }
  for (const quote of ["USDT", "USDC", "USD"]) {
    if (normalized.endsWith(quote) && normalized.length > quote.length) {
      return `${normalized.slice(0, -quote.length)}-USD.P`;
    }
  }
  return `${normalized}-USD.P`;
}

export function mapOndoperpsOrder(raw: OndoperpsOrder, displaySymbol?: string): Order {
  const createdAt = parseTimestamp(raw.createdAt);
  const updateTime = parseTimestamp(raw.filledAt ?? raw.canceledAt ?? raw.createdAt);
  const executedQty = raw.filledSize ?? "0";
  return {
    orderId: raw.orderId,
    clientOrderId: raw.clientOrderId ?? "",
    symbol: displaySymbol ?? raw.market,
    side: raw.side === "sell" ? "SELL" : "BUY",
    type: mapOrderType(raw.type),
    status: mapOrderStatus(raw.status),
    price: raw.price ?? "0",
    origQty: raw.size,
    executedQty,
    stopPrice: raw.triggerPrice ?? "0",
    time: createdAt,
    updateTime,
    reduceOnly: raw.reduceOnly ?? false,
    closePosition: raw.closePosition ?? false,
    avgPrice: calculateAveragePrice(raw.filledCost, executedQty),
    cumQuote: raw.filledCost ?? "0",
    positionSide: "BOTH",
    timeInForce: normalizeTimeInForce(raw.timeInForce),
    workingType: raw.triggerPrice ? "MARK_PRICE" : undefined,
  };
}

export function mapOndoperpsAccountSnapshot(
  balance: OndoperpsBalance,
  positions: OndoperpsPosition[],
  displaySymbol: string,
  marketSymbol: string,
  now = Date.now(),
): AccountSnapshot {
  const mappedPositions = positions.map((position) =>
    mapOndoperpsPosition(
      position,
      position.market === marketSymbol ? displaySymbol : position.market,
      now,
    ),
  );
  const baseAsset = marketSymbol.split("-")[0] ?? marketSymbol;
  return {
    canTrade: !balance.underLiquidation,
    canDeposit: true,
    canWithdraw: !balance.underLiquidation,
    updateTime: now,
    totalWalletBalance: balance.walletBalance,
    totalUnrealizedProfit: balance.unrealizedPnl,
    totalMarginBalance: balance.marginBalance,
    totalInitialMargin: balance.usedMargin,
    totalMaintMargin: balance.totalMaintenanceMargin,
    totalPositionInitialMargin: balance.usedMargin,
    totalOpenOrderInitialMargin: "0",
    availableBalance: balance.availableMargin,
    maxWithdrawAmount: balance.withdrawableMargin,
    positions: mappedPositions,
    assets: [
      {
        asset: "USDC",
        walletBalance: balance.walletBalance,
        availableBalance: balance.availableMargin,
        updateTime: now,
        unrealizedProfit: balance.unrealizedPnl,
        marginBalance: balance.marginBalance,
        maintMargin: balance.totalMaintenanceMargin,
        initialMargin: balance.usedMargin,
        positionInitialMargin: balance.usedMargin,
        openOrderInitialMargin: "0",
        maxWithdrawAmount: balance.withdrawableMargin,
        marginAvailable: !balance.underLiquidation,
      },
    ],
    marketType: "perp",
    baseAsset,
    quoteAsset: "USDC",
  };
}

export class OndoperpsGateway {
  private readonly apiKeyId: string;
  private readonly apiSecret: string;
  private readonly displaySymbol: string;
  private readonly marketSymbol: string;
  private readonly baseUrl: string;
  private readonly wsUrl: string;
  private readonly builderCode?: string;
  private readonly builderFeeRateBps?: number;
  private readonly fetchFn: typeof fetch;
  private readonly webSocketFactory: (url: string) => WebSocket;
  private readonly now: () => number;
  private readonly logger: (context: string, error: unknown) => void;

  private initPromise: Promise<void> | null = null;
  private ws: WebSocket | null = null;
  private wsAuthenticated = false;
  private wsLoginInFlight = false;
  private wsLoginFallbackAttempted = false;
  private wsEverOpened = false;
  private wsReconnectDelayMs = 1_000;
  private wsReconnectTimer: Timeout | null = null;
  private heartbeatTimer: Timer | null = null;
  private readonly sentSubscriptions = new Set<string>();

  private readonly accountListeners = new Set<AccountListener>();
  private readonly orderListeners = new Set<OrderListener>();
  private readonly depthListeners = new Map<string, Set<DepthListener>>();
  private readonly tickerListeners = new Map<string, Set<TickerListener>>();
  private readonly klineListeners = new Map<string, Map<string, Set<KlineListener>>>();
  private readonly fundingListeners = new Map<string, Set<FundingRateListener>>();
  private readonly connectionListeners = new Set<ConnectionEventListener>();

  private balance: OndoperpsBalance | null = null;
  private positions: OndoperpsPosition[] = [];
  private readonly orders = new Map<string, Order>();
  private readonly contracts = new Map<string, OndoperpsContract>();
  private readonly markPrices = new Map<string, OndoperpsMarkPrice>();
  private readonly precisions = new Map<string, ExchangePrecision>();
  private readonly klineHistory = new Map<string, Kline[]>();

  private accountPollTimer: Timer | null = null;
  private orderPollTimer: Timer | null = null;
  private readonly depthPollTimers = new Map<string, Timer>();
  private readonly tickerPollTimers = new Map<string, Timer>();
  private readonly klinePollTimers = new Map<string, Timer>();
  private readonly fundingPollTimers = new Map<string, Timer>();

  constructor(options: OndoperpsGatewayOptions) {
    this.apiKeyId = options.apiKeyId;
    this.apiSecret = options.apiSecret;
    this.displaySymbol = options.symbol?.trim() || DEFAULT_SYMBOL;
    this.marketSymbol = normalizeOndoperpsSymbol(this.displaySymbol);
    this.baseUrl = trimTrailingSlash(options.baseUrl ?? DEFAULT_BASE_URL);
    this.wsUrl = options.wsUrl ?? DEFAULT_WS_URL;
    this.builderCode = options.builderCode?.trim() || undefined;
    this.builderFeeRateBps = normalizeBuilderFee(options.builderFeeRateBps);
    this.fetchFn = options.fetchFn ?? fetch;
    this.webSocketFactory = options.webSocketFactory ?? ((url) => new WebSocket(url));
    this.now = options.now ?? (() => Date.now());
    this.logger = options.logger ?? ((context, error) => console.error(`[OndoperpsGateway] ${context}`, error));
  }

  async ensureInitialized(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          await this.loadPrecisions();
        } catch (error) {
          this.logger("loadPrecisions", error);
        }
        this.connectWebSocket();
      })();
    }
    return this.initPromise;
  }

  onAccount(listener: AccountListener): void {
    this.accountListeners.add(listener);
    void this.ensureInitialized();
    this.startAccountPolling();
    this.sendActiveSubscriptions();
  }

  onOrders(listener: OrderListener): void {
    this.orderListeners.add(listener);
    void this.ensureInitialized();
    this.startOrderPolling();
    this.sendActiveSubscriptions();
  }

  onDepth(symbol: string, listener: DepthListener): void {
    addMapListener(this.depthListeners, symbol, listener);
    void this.ensureInitialized();
    this.startDepthPolling(symbol);
    this.sendActiveSubscriptions();
  }

  onTicker(symbol: string, listener: TickerListener): void {
    addMapListener(this.tickerListeners, symbol, listener);
    void this.ensureInitialized();
    this.startTickerPolling(symbol);
    this.sendActiveSubscriptions();
  }

  onKlines(symbol: string, interval: string, listener: KlineListener): void {
    let intervals = this.klineListeners.get(symbol);
    if (!intervals) {
      intervals = new Map();
      this.klineListeners.set(symbol, intervals);
    }
    addMapListener(intervals, interval, listener);
    void this.ensureInitialized();
    this.startKlinePolling(symbol, interval);
    this.sendActiveSubscriptions();
  }

  onFundingRate(symbol: string, listener: FundingRateListener): void {
    addMapListener(this.fundingListeners, symbol, listener);
    void this.ensureInitialized();
    this.startFundingPolling(symbol);
    this.sendActiveSubscriptions();
  }

  onConnectionEvent(listener: ConnectionEventListener): void {
    this.connectionListeners.add(listener);
  }

  offConnectionEvent(listener: ConnectionEventListener): void {
    this.connectionListeners.delete(listener);
  }

  async createOrder(params: CreateOrderParams): Promise<Order> {
    await this.ensureInitialized();
    if (params.type === "TRAILING_STOP_MARKET") {
      throw new Error("Ondo Perps does not support trailing stop orders");
    }
    if (isStopOrderType(params.type)) {
      return this.createStopOrder(params);
    }

    const market = normalizeOndoperpsSymbol(params.symbol);
    if (params.quantity == null || !Number.isFinite(params.quantity) || params.quantity <= 0) {
      throw new Error("Ondo Perps order quantity must be a positive number");
    }
    const type = params.type === "MARKET" ? "market" : "limit";
    if (type === "limit" && (params.price == null || !Number.isFinite(params.price))) {
      throw new Error("Ondo Perps limit orders require a valid price");
    }

    const body: Record<string, unknown> = {
      market,
      type,
      side: params.side.toLowerCase(),
      size: String(params.quantity),
    };
    if (type === "limit") {
      body.price = String(params.price);
      const tif = params.timeInForce ?? "GTC";
      body.timeInForce = tif === "IOC" || tif === "FOK" ? "IOC" : "GTC";
      if (tif === "GTX") body.postOnly = true;
    }
    if (params.reduceOnly != null) body.reduceOnly = params.reduceOnly === "true";
    if (params.clientOrderId) body.clientOrderId = params.clientOrderId;
    if (params.slPrice != null) body.stopLoss = { triggerPrice: String(params.slPrice) };
    if (params.tpPrice != null) body.takeProfit = { triggerPrice: String(params.tpPrice) };
    const builderCode = this.createBuilderCodePayload();
    if (builderCode) body.builderCode = builderCode;

    const raw = await this.request<OndoperpsOrder>("POST", "/v1/perps/orders", { body });
    const order = mapOndoperpsOrder(raw, this.displayForMarket(raw.market, params.symbol));
    if (isActiveOrder(order)) this.orders.set(String(order.orderId), order);
    this.emitOrders();
    return order;
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.ensureInitialized();
    const stop = parseSyntheticStopId(String(params.orderId));
    if (stop) {
      await this.request<OndoperpsStopOrders>("DELETE", "/v1/perps/stop_order", {
        query: { market: stop.market, type: stop.type },
      });
    } else {
      await this.request<OndoperpsOrder>(
        "DELETE",
        `/v1/perps/orders/${encodeURIComponent(String(params.orderId))}`,
      );
    }
    this.orders.delete(String(params.orderId));
    this.emitOrders();
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized();
    const regularIds: string[] = [];
    const stopOrders: Array<{ id: string; market: string; type: "stopLoss" | "takeProfit" }> = [];
    for (const orderId of params.orderIdList) {
      const id = String(orderId);
      const stop = parseSyntheticStopId(id);
      if (stop) stopOrders.push({ id, ...stop });
      else regularIds.push(id);
    }

    await Promise.all([
      regularIds.length
        ? this.request("DELETE", "/v1/perps/orders/batch", {
            query: { orderIDs: regularIds.join(",") },
          })
        : Promise.resolve(),
      ...stopOrders.map((stop) =>
        this.request("DELETE", "/v1/perps/stop_order", {
          query: { market: stop.market, type: stop.type },
        }),
      ),
    ]);
    for (const orderId of params.orderIdList) this.orders.delete(String(orderId));
    this.emitOrders();
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.ensureInitialized();
    const market = normalizeOndoperpsSymbol(params.symbol);
    await this.request("DELETE", "/v1/perps/orders", { query: { market } });
    for (const [id, order] of this.orders) {
      if (normalizeOndoperpsSymbol(order.symbol) === market && !isProtectiveOrder(order)) {
        this.orders.delete(id);
      }
    }
    this.emitOrders();
  }

  async getPrecision(symbol: string): Promise<ExchangePrecision | null> {
    await this.ensureInitialized();
    const market = normalizeOndoperpsSymbol(symbol);
    const cached = this.precisions.get(market);
    if (cached) return cached;
    await this.loadPrecisions();
    return this.precisions.get(market) ?? null;
  }

  async queryOpenOrders(): Promise<Order[]> {
    await this.ensureInitialized();
    const [rawOrders, rawStops, positions] = await Promise.all([
      this.request<OndoperpsOrder[]>("GET", "/v1/perps/orders", {
        query: { market: this.marketSymbol, status: "open", limit: 1000 },
      }),
      this.request<OndoperpsStopOrders[]>("GET", "/v1/perps/stop_order"),
      this.request<OndoperpsPosition[]>("GET", "/v1/perps/positions"),
    ]);
    this.positions = positions;
    this.orders.clear();
    for (const raw of rawOrders) {
      const order = mapOndoperpsOrder(raw, this.displayForMarket(raw.market));
      if (isActiveOrder(order)) this.orders.set(String(order.orderId), order);
    }
    for (const stop of rawStops) {
      if (stop.market !== this.marketSymbol) continue;
      for (const order of mapStopOrders(stop, positions, this.displaySymbol, this.now())) {
        this.orders.set(String(order.orderId), order);
      }
    }
    const result = this.currentOrders();
    this.emitOrders();
    return result;
  }

  async queryAccountSnapshot(): Promise<AccountSnapshot> {
    await this.ensureInitialized();
    const [balance, positions] = await Promise.all([
      this.request<OndoperpsBalance>("GET", "/v1/perps/balance"),
      this.request<OndoperpsPosition[]>("GET", "/v1/perps/positions"),
    ]);
    this.balance = balance;
    this.positions = positions;
    return mapOndoperpsAccountSnapshot(
      balance,
      positions,
      this.displaySymbol,
      this.marketSymbol,
      this.now(),
    );
  }

  async forceCancelAllOrders(): Promise<boolean> {
    await this.cancelAllOrders({ symbol: this.displaySymbol });
    const remaining = await this.queryOpenOrders();
    return remaining.every((order) => isProtectiveOrder(order));
  }

  private async createStopOrder(params: CreateOrderParams): Promise<Order> {
    if (params.stopPrice == null || !Number.isFinite(params.stopPrice)) {
      throw new Error("Ondo Perps stop orders require a valid stop price");
    }
    const market = normalizeOndoperpsSymbol(params.symbol);
    const type = resolveStopType(params);
    const positionDirection = params.side === "SELL" ? "long" : "short";
    const raw = await this.request<OndoperpsStopOrders>("POST", "/v1/perps/stop_order", {
      body: {
        market,
        positionDirection,
        type,
        triggerPrice: String(params.stopPrice),
      },
    });
    const mappedOrders = mapStopOrders(raw, this.positions, params.symbol, this.now());
    for (const mappedOrder of mappedOrders) {
      this.orders.set(String(mappedOrder.orderId), mappedOrder);
    }
    const mapped = mappedOrders
      .find((order) => order.stopPrice === String(params.stopPrice) && order.type === mapStopType(type));
    const order = mapped ?? createSyntheticStopOrder({
      market,
      displaySymbol: params.symbol,
      positionDirection,
      type,
      triggerPrice: String(params.stopPrice),
      quantity: params.quantity == null ? "0" : String(params.quantity),
      now: this.now(),
    });
    this.orders.set(String(order.orderId), order);
    this.emitOrders();
    return order;
  }

  private async request<T = unknown>(
    method: string,
    path: string,
    options: {
      query?: Record<string, string | number | boolean | undefined>;
      body?: unknown;
      authenticated?: boolean;
    } = {},
  ): Promise<T> {
    const requestPath = buildRequestPath(path, options.query);
    const body = options.body == null ? "" : JSON.stringify(options.body);
    const timestamp = String(this.now());
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body) headers["Content-Type"] = "application/json";
    if (options.authenticated !== false) {
      Object.assign(headers, buildOndoperpsAuthHeaders({
        apiKeyId: this.apiKeyId,
        apiSecret: this.apiSecret,
        timestamp,
        method,
        requestPath,
        body,
      }));
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await this.fetchFn(`${this.baseUrl}${requestPath}`, {
        method,
        headers,
        body: body || undefined,
        signal: controller.signal,
      });
      const text = await response.text();
      let payload: OndoperpsApiResponse<T> | null = null;
      if (text) {
        try {
          payload = JSON.parse(text) as OndoperpsApiResponse<T>;
        } catch {
          throw new Error(`Ondo Perps returned invalid JSON for ${method} ${requestPath}`);
        }
      }
      if (!response.ok || payload?.success === false) {
        const detail = payload?.error_code ?? payload?.error ?? response.statusText;
        throw new Error(`Ondo Perps ${method} ${requestPath} failed (${response.status}): ${detail}`);
      }
      return payload?.result as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async loadPrecisions(): Promise<void> {
    const result = await this.request<OndoperpsMarketsResult>("GET", "/v1/markets", {
      authenticated: false,
    });
    for (const pair of result.perps?.tradingPairs ?? []) {
      const priceTick = Number(pair.quoteIncrement);
      const qtyStep = Number(pair.baseIncrement);
      if (!Number.isFinite(priceTick) || priceTick <= 0 || !Number.isFinite(qtyStep) || qtyStep <= 0) {
        continue;
      }
      this.precisions.set(pair.market, {
        priceTick,
        qtyStep,
        priceDecimals: decimalPlaces(pair.quoteIncrement),
        sizeDecimals: decimalPlaces(pair.baseIncrement),
      });
    }
  }

  private connectWebSocket(): void {
    if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1)) return;
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
    try {
      const ws = this.webSocketFactory(this.wsUrl);
      this.ws = ws;
      ws.addEventListener("open", () => this.handleWsOpen(ws));
      ws.addEventListener("message", (event) => {
        void this.handleWsMessage(event.data);
      });
      ws.addEventListener("close", () => this.handleWsClose(ws));
      ws.addEventListener("error", (event) => this.logger("websocket", event));
    } catch (error) {
      this.logger("connectWebSocket", error);
      this.scheduleReconnect();
    }
  }

  private handleWsOpen(ws: WebSocket): void {
    if (this.ws !== ws) return;
    const reconnected = this.wsEverOpened;
    this.wsEverOpened = true;
    this.wsReconnectDelayMs = 1_000;
    this.wsAuthenticated = false;
    this.wsLoginInFlight = false;
    this.wsLoginFallbackAttempted = false;
    this.sentSubscriptions.clear();
    this.startHeartbeat();
    this.sendActiveSubscriptions();
    if (reconnected) this.emitConnection("reconnected");
  }

  private handleWsClose(ws: WebSocket): void {
    if (this.ws !== ws) return;
    this.ws = null;
    this.wsAuthenticated = false;
    this.wsLoginInFlight = false;
    this.stopHeartbeat();
    this.emitConnection("disconnected");
    this.scheduleReconnect();
  }

  private async handleWsMessage(raw: unknown): Promise<void> {
    const message = await parseWsMessage(raw);
    if (!message) return;
    if (message.type === "loggedIn") {
      this.wsAuthenticated = true;
      this.wsLoginInFlight = false;
      this.sendActiveSubscriptions();
      return;
    }
    if (message.type === "error") {
      if (
        !this.wsAuthenticated &&
        !this.wsLoginFallbackAttempted &&
        /signature|sign|auth|credential|timestamp/i.test(message.msg ?? "")
      ) {
        this.wsLoginFallbackAttempted = true;
        this.sendWsLogin(true);
        return;
      }
      if (!this.wsAuthenticated) this.wsLoginInFlight = false;
      this.logger(`websocket:${message.channel ?? "general"}`, message.msg ?? message.code ?? message);
      return;
    }
    if (message.type !== "update" || !message.channel) return;

    switch (message.channel) {
      case "depthBooksPerps":
      case "topOfBooksPerps":
        this.handleDepthUpdate(message.data);
        break;
      case "markPricesPerps":
        this.handleMarkPriceUpdate(message.data);
        break;
      case "kLinePerps":
        this.handleKlineUpdate(message.data);
        break;
      case "fundingRatesPerps":
        this.handleFundingUpdate(message.data);
        break;
      case "ordersPerps":
        this.handleOrderUpdate(message.data);
        break;
      case "positionsPerps":
        if (Array.isArray(message.data)) {
          this.positions = message.data as OndoperpsPosition[];
          this.emitAccount();
        }
        break;
      case "balancePerps":
        if (message.data && typeof message.data === "object") {
          this.balance = message.data as OndoperpsBalance;
          this.emitAccount();
        }
        break;
    }
  }

  private sendActiveSubscriptions(): void {
    if (!this.ws || this.ws.readyState !== 1) return;
    for (const symbol of this.depthListeners.keys()) {
      this.subscribe({
        channel: "depthBooksPerps",
        markets: [normalizeOndoperpsSymbol(symbol)],
        limit: 100,
      });
    }
    for (const symbol of this.tickerListeners.keys()) {
      this.subscribe({ channel: "markPricesPerps", markets: [normalizeOndoperpsSymbol(symbol)] });
    }
    for (const [symbol, intervals] of this.klineListeners) {
      for (const interval of intervals.keys()) {
        const resolution = wsResolution(interval);
        if (resolution) {
          this.subscribe({
            channel: "kLinePerps",
            markets: [normalizeOndoperpsSymbol(symbol)],
            resolution,
          });
        }
      }
    }
    for (const symbol of this.fundingListeners.keys()) {
      this.subscribe({ channel: "fundingRatesPerps", markets: [normalizeOndoperpsSymbol(symbol)] });
    }
    const needsPrivateChannels = this.accountListeners.size > 0 || this.orderListeners.size > 0;
    if (!needsPrivateChannels) return;
    if (!this.wsAuthenticated) {
      if (!this.wsLoginInFlight) this.sendWsLogin(false);
      return;
    }
    if (this.accountListeners.size) {
      this.subscribe({ channel: "positionsPerps" });
      this.subscribe({ channel: "balancePerps" });
    }
    if (this.orderListeners.size) {
      this.subscribe({ channel: "ordersPerps", markets: [this.marketSymbol] });
    }
  }

  private subscribe(payload: Record<string, unknown>): void {
    const key = JSON.stringify(payload);
    if (this.sentSubscriptions.has(key)) return;
    this.sendWs({ op: "subscribe", ...payload });
    this.sentSubscriptions.add(key);
  }

  private sendWs(payload: unknown): void {
    if (!this.ws || this.ws.readyState !== 1) return;
    try {
      this.ws.send(JSON.stringify(payload));
    } catch (error) {
      this.logger("sendWebSocket", error);
    }
  }

  private sendWsLogin(prefixFirst: boolean): void {
    const timestamp = String(this.now());
    this.wsLoginInFlight = true;
    this.sendWs({
      op: "login",
      args: {
        key: this.apiKeyId,
        time: timestamp,
        sign: createOndoperpsWsSignature(this.apiSecret, timestamp, prefixFirst),
      },
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => this.sendWs({ op: "ping" }), WS_HEARTBEAT_MS);
  }

  private stopHeartbeat(): void {
    if (!this.heartbeatTimer) return;
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  private scheduleReconnect(): void {
    if (this.wsReconnectTimer) return;
    const delay = this.wsReconnectDelayMs;
    this.wsReconnectDelayMs = Math.min(this.wsReconnectDelayMs * 2, WS_RECONNECT_MAX_MS);
    this.wsReconnectTimer = setTimeout(() => {
      this.wsReconnectTimer = null;
      this.connectWebSocket();
    }, delay);
  }

  private startAccountPolling(): void {
    if (this.accountPollTimer) return;
    const poll = async () => {
      try {
        const snapshot = await this.queryAccountSnapshot();
        for (const listener of this.accountListeners) listener(snapshot);
      } catch (error) {
        this.logger("pollAccount", error);
      }
    };
    void poll();
    this.accountPollTimer = setInterval(poll, 5_000);
  }

  private startOrderPolling(): void {
    if (this.orderPollTimer) return;
    const poll = async () => {
      try {
        await this.queryOpenOrders();
      } catch (error) {
        this.logger("pollOrders", error);
      }
    };
    void poll();
    this.orderPollTimer = setInterval(poll, 3_000);
  }

  private startDepthPolling(symbol: string): void {
    const market = normalizeOndoperpsSymbol(symbol);
    if (this.depthPollTimers.has(market)) return;
    const poll = async () => {
      try {
        const raw = await this.request<OndoperpsBookSnapshot>("GET", "/v1/perps/depth", {
          query: { market, depth: 100 },
          authenticated: false,
        });
        this.emitDepth(raw, symbol);
      } catch (error) {
        this.logger(`pollDepth:${market}`, error);
      }
    };
    void poll();
    this.depthPollTimers.set(market, setInterval(poll, 5_000));
  }

  private startTickerPolling(symbol: string): void {
    const market = normalizeOndoperpsSymbol(symbol);
    if (this.tickerPollTimers.has(market)) return;
    const poll = async () => {
      try {
        const [contracts, markPrices] = await Promise.all([
          this.request<OndoperpsContract[]>("GET", "/v1/perps/contracts", {
            query: { sparkline: false },
            authenticated: false,
          }),
          this.request<Record<string, OndoperpsMarkPrice>>("GET", "/v1/perps/mark_prices", {
            authenticated: false,
          }),
        ]);
        for (const contract of contracts) this.contracts.set(contract.market, contract);
        for (const [key, mark] of Object.entries(markPrices)) {
          this.markPrices.set(mark.market || key, mark);
        }
        this.emitTicker(market, symbol);
      } catch (error) {
        this.logger(`pollTicker:${market}`, error);
      }
    };
    void poll();
    this.tickerPollTimers.set(market, setInterval(poll, 5_000));
  }

  private startKlinePolling(symbol: string, interval: string): void {
    const market = normalizeOndoperpsSymbol(symbol);
    const key = `${market}|${interval}`;
    if (this.klinePollTimers.has(key)) return;
    const poll = async () => {
      try {
        const { resolution, seconds } = restResolution(interval);
        const to = Math.floor(this.now() / 1000);
        const from = to - seconds * 200;
        const candles = await this.request<OndoperpsCandle[]>("GET", "/v1/perps/candles", {
          query: { market, resolution, from, to },
        });
        const klines = candles.map((candle) => mapRestCandle(candle, symbol, interval, seconds));
        this.klineHistory.set(key, klines);
        this.emitKlines(symbol, interval, klines);
      } catch (error) {
        this.logger(`pollKlines:${key}`, error);
      }
    };
    void poll();
    this.klinePollTimers.set(key, setInterval(poll, 15_000));
  }

  private startFundingPolling(symbol: string): void {
    const market = normalizeOndoperpsSymbol(symbol);
    if (this.fundingPollTimers.has(market)) return;
    const poll = async () => {
      try {
        const rate = await this.request<OndoperpsFundingRate>("GET", "/v1/perps/funding_rates", {
          query: { market },
          authenticated: false,
        });
        this.emitFunding(rate, symbol);
      } catch (error) {
        this.logger(`pollFunding:${market}`, error);
      }
    };
    void poll();
    this.fundingPollTimers.set(market, setInterval(poll, 60_000));
  }

  private handleDepthUpdate(data: unknown): void {
    const snapshots = Array.isArray(data) ? data : data ? [data] : [];
    for (const snapshot of snapshots as OndoperpsBookSnapshot[]) {
      const symbol = this.listenerSymbolForMarket(this.depthListeners, snapshot.market);
      if (symbol) this.emitDepth(snapshot, symbol);
    }
  }

  private handleMarkPriceUpdate(data: unknown): void {
    const prices = Array.isArray(data) ? data : data ? [data] : [];
    for (const price of prices as OndoperpsMarkPrice[]) {
      this.markPrices.set(price.market, price);
      const symbol = this.listenerSymbolForMarket(this.tickerListeners, price.market);
      if (symbol) this.emitTicker(price.market, symbol);
    }
  }

  private handleKlineUpdate(data: unknown): void {
    const entries = Array.isArray(data) ? data : data ? [data] : [];
    for (const raw of entries as OndoperpsWsKline[]) {
      const symbol = this.listenerSymbolForMarket(this.klineListeners, raw.m);
      if (!symbol) continue;
      const intervals = this.klineListeners.get(symbol);
      if (!intervals) continue;
      const durationSeconds = Math.max(1, raw.e - raw.s);
      for (const interval of intervals.keys()) {
        if (wsResolution(interval) == null) continue;
        if (Math.abs(restResolution(interval).seconds - durationSeconds) > 1) continue;
        const key = `${raw.m}|${interval}`;
        const next = mapWsKline(raw, symbol, interval);
        const history = mergeKline(this.klineHistory.get(key) ?? [], next);
        this.klineHistory.set(key, history);
        this.emitKlines(symbol, interval, history);
      }
    }
  }

  private handleFundingUpdate(data: unknown): void {
    const entries = Array.isArray(data) ? data : data ? [data] : [];
    for (const raw of entries as OndoperpsFundingRate[]) {
      const symbol = this.listenerSymbolForMarket(this.fundingListeners, raw.market);
      if (symbol) this.emitFunding(raw, symbol);
    }
  }

  private handleOrderUpdate(data: unknown): void {
    const entries = Array.isArray(data) ? data : data ? [data] : [];
    for (const raw of entries as OndoperpsOrder[]) {
      const order = mapOndoperpsOrder(raw, this.displayForMarket(raw.market));
      const id = String(order.orderId);
      if (isActiveOrder(order)) this.orders.set(id, order);
      else this.orders.delete(id);
    }
    this.emitOrders();
  }

  private emitAccount(): void {
    if (!this.balance) return;
    const snapshot = mapOndoperpsAccountSnapshot(
      this.balance,
      this.positions,
      this.displaySymbol,
      this.marketSymbol,
      this.now(),
    );
    for (const listener of this.accountListeners) listener(snapshot);
  }

  private emitOrders(): void {
    const orders = this.currentOrders();
    for (const listener of this.orderListeners) listener(orders);
  }

  private emitDepth(raw: OndoperpsBookSnapshot, symbol: string): void {
    const depth: Depth = {
      lastUpdateId: parseTimestamp(raw.time),
      bids: normalizeBook(raw.bids, "bid"),
      asks: normalizeBook(raw.asks, "ask"),
      eventTime: parseTimestamp(raw.time),
      symbol,
    };
    for (const listener of this.depthListeners.get(symbol) ?? []) listener(depth);
  }

  private emitTicker(market: string, symbol: string): void {
    const contract = this.contracts.get(market);
    const mark = this.markPrices.get(market);
    if (!contract && !mark) return;
    const ticker = mapTicker(contract, mark, symbol, this.now());
    for (const listener of this.tickerListeners.get(symbol) ?? []) listener(ticker);
  }

  private emitKlines(symbol: string, interval: string, klines: Kline[]): void {
    for (const listener of this.klineListeners.get(symbol)?.get(interval) ?? []) listener(klines);
  }

  private emitFunding(raw: OndoperpsFundingRate, symbol: string): void {
    const fundingRate = Number(raw.rate);
    if (!Number.isFinite(fundingRate)) return;
    const updateTime = this.now();
    for (const listener of this.fundingListeners.get(symbol) ?? []) {
      listener({ symbol, fundingRate, updateTime });
    }
  }

  private emitConnection(event: "disconnected" | "reconnected"): void {
    for (const listener of this.connectionListeners) listener(event, this.displaySymbol);
  }

  private currentOrders(): Order[] {
    return [...this.orders.values()].sort((a, b) => a.time - b.time);
  }

  private displayForMarket(market: string, fallback?: string): string {
    return market === this.marketSymbol ? (fallback ?? this.displaySymbol) : market;
  }

  private listenerSymbolForMarket<T>(listeners: Map<string, T>, market: string): string | undefined {
    for (const symbol of listeners.keys()) {
      if (normalizeOndoperpsSymbol(symbol) === market) return symbol;
    }
    return undefined;
  }

  private createBuilderCodePayload(): Record<string, unknown> | undefined {
    if (!this.builderCode && this.builderFeeRateBps == null) return undefined;
    const payload: Record<string, unknown> = {};
    if (this.builderCode) payload.code = this.builderCode;
    if (this.builderFeeRateBps != null) payload.feeRateBps = this.builderFeeRateBps;
    return payload;
  }
}

function mapOndoperpsPosition(raw: OndoperpsPosition, symbol: string, now: number): AccountPosition {
  const absoluteQuantity = Math.abs(Number(raw.netQuantity));
  const positionAmt = raw.direction === "short"
    ? -absoluteQuantity
    : raw.direction === "long"
      ? absoluteQuantity
      : 0;
  return {
    symbol,
    positionAmt: Number.isFinite(positionAmt) ? String(positionAmt) : "0",
    entryPrice: raw.averageEntryPrice,
    unrealizedProfit: raw.unrealizedPnl,
    positionSide: "BOTH",
    updateTime: now,
    initialMargin: raw.usedMargin,
    maintMargin: raw.maintenanceMargin,
    positionInitialMargin: raw.usedMargin,
    openOrderInitialMargin: "0",
    leverage: raw.leverage,
    isolated: false,
    marginType: "cross",
    liquidationPrice: raw.liquidationPrice,
    markPrice: raw.markPrice,
  };
}

function mapTicker(
  contract: OndoperpsContract | undefined,
  mark: OndoperpsMarkPrice | undefined,
  symbol: string,
  now: number,
): Ticker {
  const bid = contract?.bid ?? "0";
  const ask = contract?.ask ?? "0";
  const midpoint = averageStrings(bid, ask);
  const lastPrice = contract?.lastPrice ?? mark?.markPrice ?? mark?.price ?? midpoint ?? contract?.indexPrice ?? "0";
  const changePercent = contract?.priceChangePercent ?? "0";
  const last = Number(lastPrice);
  const pct = Number(changePercent);
  const derivedOpen = Number.isFinite(last) && Number.isFinite(pct) && pct > -100
    ? String(last / (1 + pct / 100))
    : lastPrice;
  return {
    symbol,
    lastPrice,
    openPrice: derivedOpen,
    highPrice: contract?.high ?? lastPrice,
    lowPrice: contract?.low ?? lastPrice,
    volume: contract?.baseVolume ?? "0",
    quoteVolume: contract?.quoteVolume ?? contract?.usdVolume ?? "0",
    eventTime: mark?.lastUpdatedTime ? parseTimestamp(mark.lastUpdatedTime) : now,
    priceChangePercent: changePercent,
    bidPrice: bid,
    askPrice: ask,
    markPrice: mark?.markPrice ?? mark?.price ?? contract?.indexPrice,
  };
}

function mapRestCandle(raw: OndoperpsCandle, symbol: string, interval: string, seconds: number): Kline {
  const openTime = parseTimestamp(raw.startTime);
  return {
    symbol,
    interval,
    openTime,
    open: raw.open,
    high: raw.high,
    low: raw.low,
    close: raw.close,
    volume: raw.volume,
    closeTime: openTime + seconds * 1000 - 1,
    numberOfTrades: 0,
    isClosed: true,
  };
}

function mapWsKline(raw: OndoperpsWsKline, symbol: string, interval: string): Kline {
  return {
    symbol,
    interval,
    openTime: raw.s * 1000,
    open: String(raw.o),
    high: String(raw.h),
    low: String(raw.l),
    close: String(raw.c),
    volume: String(raw.v),
    closeTime: raw.e * 1000,
    numberOfTrades: 0,
    isClosed: raw.x ?? false,
  };
}

function mapStopOrders(
  raw: OndoperpsStopOrders,
  positions: OndoperpsPosition[],
  displaySymbol: string,
  now: number,
): Order[] {
  if (raw.positionDirection === "neutral") return [];
  const position = positions.find((entry) => entry.market === raw.market);
  const quantity = position?.netQuantity ?? "0";
  const result: Order[] = [];
  if (raw.stopLoss) {
    result.push(createSyntheticStopOrder({
      market: raw.market,
      displaySymbol,
      positionDirection: raw.positionDirection,
      type: "stopLoss",
      triggerPrice: raw.stopLoss,
      quantity,
      now,
    }));
  }
  if (raw.takeProfit) {
    result.push(createSyntheticStopOrder({
      market: raw.market,
      displaySymbol,
      positionDirection: raw.positionDirection,
      type: "takeProfit",
      triggerPrice: raw.takeProfit,
      quantity,
      now,
    }));
  }
  return result;
}

function createSyntheticStopOrder(input: {
  market: string;
  displaySymbol: string;
  positionDirection: "long" | "short";
  type: "stopLoss" | "takeProfit";
  triggerPrice: string;
  quantity: string;
  now: number;
}): Order {
  const orderId = syntheticStopId(input.market, input.positionDirection, input.type);
  return {
    orderId,
    clientOrderId: orderId,
    symbol: input.displaySymbol,
    side: input.positionDirection === "long" ? "SELL" : "BUY",
    type: mapStopType(input.type),
    status: "NEW",
    price: "0",
    origQty: input.quantity,
    executedQty: "0",
    stopPrice: input.triggerPrice,
    time: input.now,
    updateTime: input.now,
    reduceOnly: true,
    closePosition: true,
    positionSide: "BOTH",
    workingType: "MARK_PRICE",
  };
}

function syntheticStopId(
  market: string,
  positionDirection: "long" | "short",
  type: "stopLoss" | "takeProfit",
): string {
  return `ondoperps-stop:${encodeURIComponent(market)}:${positionDirection}:${type}`;
}

function parseSyntheticStopId(value: string): {
  market: string;
  positionDirection: "long" | "short";
  type: "stopLoss" | "takeProfit";
} | null {
  const match = value.match(/^ondoperps?-stop:([^:]+):(long|short):(stopLoss|takeProfit)$/);
  if (!match) return null;
  return {
    market: decodeURIComponent(match[1] ?? ""),
    positionDirection: match[2] as "long" | "short",
    type: match[3] as "stopLoss" | "takeProfit",
  };
}

function mapOrderType(value: string): OrderType {
  switch (value) {
    case "market":
      return "MARKET";
    case "stopMarket":
      return "STOP_MARKET";
    case "takeProfitMarket":
      return "TAKE_PROFIT_MARKET";
    default:
      return "LIMIT";
  }
}

function mapStopType(value: "stopLoss" | "takeProfit"): OrderType {
  return value === "takeProfit" ? "TAKE_PROFIT_MARKET" : "STOP_MARKET";
}

function mapOrderStatus(value: string): string {
  switch (value.toLowerCase()) {
    case "fullyfilled":
      return "FILLED";
    case "canceled":
    case "cancelled":
      return "CANCELED";
    case "open":
    case "pending":
    case "untriggered":
      return "NEW";
    default:
      return value.toUpperCase();
  }
}

function normalizeTimeInForce(value: string | undefined): TimeInForce | undefined {
  return value === "GTC" || value === "IOC" || value === "FOK" ? value : undefined;
}

function isStopOrderType(value: OrderType): boolean {
  return value === "STOP" || value === "STOP_MARKET" || value === "TAKE_PROFIT" || value === "TAKE_PROFIT_MARKET";
}

function resolveStopType(params: CreateOrderParams): "stopLoss" | "takeProfit" {
  if (params.type === "TAKE_PROFIT" || params.type === "TAKE_PROFIT_MARKET") return "takeProfit";
  return params.triggerType === "TAKE_PROFIT" ? "takeProfit" : "stopLoss";
}

function isActiveOrder(order: Order): boolean {
  const status = order.status.toUpperCase();
  return status !== "FILLED" && status !== "CANCELED" && status !== "CANCELLED" && status !== "REJECTED";
}

function isProtectiveOrder(order: Order): boolean {
  return order.type === "STOP_MARKET" || order.type === "TAKE_PROFIT_MARKET";
}

function calculateAveragePrice(filledCost: string | undefined, filledSize: string): string | undefined {
  const cost = Number(filledCost);
  const size = Number(filledSize);
  if (!Number.isFinite(cost) || !Number.isFinite(size) || size <= 0) return undefined;
  return String(cost / size);
}

function averageStrings(left: string, right: string): string | undefined {
  const a = Number(left);
  const b = Number(right);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) return undefined;
  return String((a + b) / 2);
}

function normalizeBook(levels: OndoperpsBookLevel[], side: "bid" | "ask"): OndoperpsBookLevel[] {
  return [...levels]
    .filter(([price, size]) => Number.isFinite(Number(price)) && Number.isFinite(Number(size)))
    .sort((a, b) => side === "bid" ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0]));
}

function buildRequestPath(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value != null) params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `${path}?${encoded}` : path;
}

function restResolution(interval: string): { resolution: string; seconds: number } {
  const normalized = interval.trim().toLowerCase();
  const minuteMatch = normalized.match(/^(\d+)m?$/);
  if (minuteMatch) {
    const minutes = Math.max(1, Number(minuteMatch[1]));
    return { resolution: String(minutes), seconds: minutes * 60 };
  }
  const hourMatch = normalized.match(/^(\d+)h$/);
  if (hourMatch) {
    const hours = Math.max(1, Number(hourMatch[1]));
    return { resolution: String(hours * 60), seconds: hours * 3600 };
  }
  if (normalized === "1d") return { resolution: "1D", seconds: 86_400 };
  if (normalized === "1w") return { resolution: "1W", seconds: 604_800 };
  if (normalized === "1mo" || normalized === "1mth") return { resolution: "1M", seconds: 2_592_000 };
  return { resolution: "1", seconds: 60 };
}

function wsResolution(interval: string): string | null {
  const normalized = interval.trim().toLowerCase();
  if (normalized === "1" || normalized === "1m") return "1";
  if (normalized === "5" || normalized === "5m") return "5";
  if (normalized === "15" || normalized === "15m") return "15";
  if (normalized === "1h" || normalized === "60") return "1H";
  if (normalized === "4h" || normalized === "240") return "4H";
  if (normalized === "1d") return "1D";
  if (normalized === "1w") return "1W";
  return null;
}

function mergeKline(history: Kline[], next: Kline): Kline[] {
  const merged = [...history];
  const index = merged.findIndex((entry) => entry.openTime === next.openTime);
  if (index >= 0) merged[index] = next;
  else merged.push(next);
  merged.sort((a, b) => a.openTime - b.openTime);
  return merged.slice(-500);
}

async function parseWsMessage(raw: unknown): Promise<OndoperpsWsMessage | null> {
  try {
    let text: string;
    if (typeof raw === "string") text = raw;
    else if (raw instanceof ArrayBuffer) text = Buffer.from(raw).toString("utf8");
    else if (ArrayBuffer.isView(raw)) text = Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength).toString("utf8");
    else if (typeof Blob !== "undefined" && raw instanceof Blob) text = await raw.text();
    else text = String(raw);
    return JSON.parse(text) as OndoperpsWsMessage;
  } catch {
    return null;
  }
}

function decimalPlaces(value: string): number {
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("e-")) {
    const exponent = Number(normalized.split("e-")[1]);
    return Number.isFinite(exponent) ? exponent : 0;
  }
  const decimal = normalized.split(".")[1]?.replace(/0+$/, "") ?? "";
  return decimal.length;
}

function parseTimestamp(value: string | number | undefined): number {
  if (typeof value === "number") return value > 1e12 ? value : value * 1000;
  if (!value) return Date.now();
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric > 1e12 ? numeric : numeric * 1000;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function normalizeBuilderFee(value: number | undefined): number | undefined {
  if (value == null || !Number.isInteger(value) || value <= 0) return undefined;
  return Math.min(value, 10);
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function addMapListener<T>(map: Map<string, Set<T>>, key: string, listener: T): void {
  let listeners = map.get(key);
  if (!listeners) {
    listeners = new Set();
    map.set(key, listeners);
  }
  listeners.add(listener);
}
