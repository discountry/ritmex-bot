import ccxt, {
  type Balances,
  type Order as CcxtOrder,
  type OrderBook as CcxtOrderBook,
  type OHLCV as CcxtOhlcv,
  type Ticker as CcxtTicker,
} from "ccxt";
import axios from "axios";
import { createHash } from "crypto";
import NodeWebSocket from "ws";
import type {
  AsterAccountAsset,
  AsterAccountPosition,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
  OrderType,
  PositionSide,
  TimeInForce,
} from "../types";
import type {
  AccountListener,
  DepthListener,
  ExchangePrecision,
  FundingRateListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import { extractMessage } from "../../utils/errors";

const WebSocketCtor: typeof globalThis.WebSocket =
  typeof globalThis.WebSocket !== "undefined"
    ? globalThis.WebSocket
    : ((NodeWebSocket as unknown) as typeof globalThis.WebSocket);

const DEFAULT_SPOT_REST_URL = "https://api.binance.com";
const DEFAULT_FUTURES_REST_URL = "https://fapi.binance.com";
const DEFAULT_SPOT_WS_URL = "wss://stream.binance.com:9443/ws";
const DEFAULT_FUTURES_WS_URL = "wss://fstream.binance.com/ws";

const RECONNECT_BASE_DELAY_MS = 3000;
const RECONNECT_MAX_DELAY_MS = 60_000;
const LISTEN_KEY_KEEPALIVE_MS = 25 * 60 * 1000;

type MarketKind = "spot" | "perp";

interface BinanceMarketRef {
  kind: MarketKind;
  symbol: string;
  id: string;
  base?: string;
  quote?: string;
}

interface PublicSubscription<T> {
  kind: MarketKind;
  stream: string;
  listeners: Set<(payload: T) => void>;
  transform: (payload: unknown) => T | null;
  ws: WebSocket | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectDelayMs: number;
}

interface UserStreamState {
  kind: MarketKind;
  active: boolean;
  listenKey: string | null;
  ws: WebSocket | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectDelayMs: number;
  keepaliveTimer: ReturnType<typeof setInterval> | null;
}

export interface BinanceGatewayOptions {
  apiKey: string;
  apiSecret: string;
  symbol: string;
  marketType?: "spot" | "perp" | "auto";
  sandbox?: boolean;
  spotRestUrl?: string;
  futuresRestUrl?: string;
  spotWsUrl?: string;
  futuresWsUrl?: string;
  logger?: (context: string, error: unknown) => void;
  pollIntervals?: {
    account?: number;
    orders?: number;
  };
}

interface ParsedSymbolHint {
  normalized: string;
  forcedKind?: MarketKind;
}

const FUTURES_SUFFIX = /(?:[_-]?PERP|[_-]?USDM)$/i;
const SPOT_SUFFIX = /(?:[_-]?SPOT)$/i;

function normalizeMode(value: string | undefined): "spot" | "perp" | "auto" {
  const raw = (value ?? "").trim().toLowerCase();
  if (raw === "spot") return "spot";
  if (raw === "auto") return "auto";
  return "perp";
}

function normalizeSymbolKey(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function parseSymbolHint(raw: string): ParsedSymbolHint {
  const source = (raw ?? "").trim().toUpperCase();
  if (!source) return { normalized: "" };

  if (source.includes(":") || source.includes("PERP")) {
    return {
      normalized: source.replace(FUTURES_SUFFIX, ""),
      forcedKind: "perp",
    };
  }

  if (SPOT_SUFFIX.test(source)) {
    return {
      normalized: source.replace(SPOT_SUFFIX, ""),
      forcedKind: "spot",
    };
  }

  if (FUTURES_SUFFIX.test(source)) {
    return {
      normalized: source.replace(FUTURES_SUFFIX, ""),
      forcedKind: "perp",
    };
  }

  return { normalized: source };
}

function normalizeTimeInForce(value: unknown): TimeInForce | undefined {
  const upper = String(value ?? "").toUpperCase();
  if (upper === "GTC" || upper === "IOC" || upper === "FOK" || upper === "GTX") {
    return upper;
  }
  return undefined;
}

function normalizePositionSide(value: unknown): PositionSide {
  const upper = String(value ?? "").toUpperCase();
  if (upper === "LONG") return "LONG";
  if (upper === "SHORT") return "SHORT";
  return "BOTH";
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function hashOrderKey(kind: MarketKind, symbol: string, orderId: string): string {
  const digest = createHash("sha1")
    .update(`${kind}:${symbol}:${orderId}`)
    .digest("hex");
  return `${kind}:${digest}`;
}

function decodeWsData(data: unknown): unknown {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (data instanceof ArrayBuffer) {
    try {
      return JSON.parse(Buffer.from(data).toString("utf8"));
    } catch {
      return null;
    }
  }
  if (ArrayBuffer.isView(data)) {
    try {
      return JSON.parse(Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8"));
    } catch {
      return null;
    }
  }
  if (data && typeof data === "object") {
    return data;
  }
  return null;
}

export class BinanceGateway {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly defaultSymbol: string;
  private readonly requestedMode: "spot" | "perp" | "auto";
  private readonly logger: (context: string, error: unknown) => void;
  private readonly pollIntervals: { account: number; orders: number };

  private readonly spotRestUrl: string;
  private readonly futuresRestUrl: string;
  private readonly spotWsUrl: string;
  private readonly futuresWsUrl: string;

  private readonly spotExchange: any;
  private readonly perpExchange: any;

  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private destroyed = false;

  private defaultKind: MarketKind = "perp";
  private defaultMarket: BinanceMarketRef | null = null;

  private readonly marketIndex: Record<MarketKind, Map<string, BinanceMarketRef>> = {
    spot: new Map(),
    perp: new Map(),
  };

  private readonly symbolAliasByKey = new Map<string, string>();
  private readonly activeKinds = new Set<MarketKind>();

  private readonly accountListeners = new Set<AccountListener>();
  private readonly orderListeners = new Set<OrderListener>();
  private readonly depthSubs = new Map<string, PublicSubscription<AsterDepth>>();
  private readonly tickerSubs = new Map<string, PublicSubscription<AsterTicker>>();
  private readonly klineSubs = new Map<string, PublicSubscription<AsterKline[]>>();
  private readonly fundingSubs = new Map<string, PublicSubscription<{ symbol: string; fundingRate: number; updateTime: number }>>();

  private accountPollTimer: ReturnType<typeof setInterval> | null = null;
  private orderPollTimer: ReturnType<typeof setInterval> | null = null;

  private readonly userStreams: Record<MarketKind, UserStreamState> = {
    spot: {
      kind: "spot",
      active: false,
      listenKey: null,
      ws: null,
      reconnectTimer: null,
      reconnectDelayMs: RECONNECT_BASE_DELAY_MS,
      keepaliveTimer: null,
    },
    perp: {
      kind: "perp",
      active: false,
      listenKey: null,
      ws: null,
      reconnectTimer: null,
      reconnectDelayMs: RECONNECT_BASE_DELAY_MS,
      keepaliveTimer: null,
    },
  };

  private readonly localOrders = new Map<string, AsterOrder>();

  private readonly spotBalances = new Map<string, { free: number; locked: number }>();
  private readonly perpBalances = new Map<string, { wallet: number; available: number }>();
  private readonly perpPositions = new Map<string, AsterAccountPosition>();
  private readonly lastMarkPriceBySymbol = new Map<string, number>();

  private lastSpotSnapshot: AsterAccountSnapshot | null = null;
  private lastPerpSnapshot: AsterAccountSnapshot | null = null;

  constructor(options: BinanceGatewayOptions) {
    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret;
    this.defaultSymbol = (options.symbol ?? process.env.BINANCE_SYMBOL ?? process.env.TRADE_SYMBOL ?? "BTCUSDT").trim().toUpperCase();
    this.requestedMode = normalizeMode(options.marketType ?? process.env.BINANCE_MARKET_TYPE);
    this.logger = options.logger ?? ((context, error) => console.error(`[BinanceGateway] ${context}:`, error));
    this.pollIntervals = {
      account: Math.max(1000, Number(options.pollIntervals?.account ?? process.env.BINANCE_ACCOUNT_POLL_MS ?? 5000)),
      orders: Math.max(1000, Number(options.pollIntervals?.orders ?? process.env.BINANCE_ORDERS_POLL_MS ?? 3000)),
    };

    this.spotRestUrl = (options.spotRestUrl ?? process.env.BINANCE_SPOT_REST_URL ?? DEFAULT_SPOT_REST_URL).replace(/\/+$/, "");
    this.futuresRestUrl = (options.futuresRestUrl ?? process.env.BINANCE_FUTURES_REST_URL ?? DEFAULT_FUTURES_REST_URL).replace(/\/+$/, "");
    this.spotWsUrl = (options.spotWsUrl ?? process.env.BINANCE_SPOT_WS_URL ?? DEFAULT_SPOT_WS_URL).replace(/\/+$/, "");
    this.futuresWsUrl = (options.futuresWsUrl ?? process.env.BINANCE_FUTURES_WS_URL ?? DEFAULT_FUTURES_WS_URL).replace(/\/+$/, "");

    this.spotExchange = new (ccxt as any).binance({
      apiKey: this.apiKey,
      secret: this.apiSecret,
      enableRateLimit: true,
      timeout: 30_000,
      options: { defaultType: "spot" },
    });
    this.perpExchange = new (ccxt as any).binanceusdm({
      apiKey: this.apiKey,
      secret: this.apiSecret,
      enableRateLimit: true,
      timeout: 30_000,
      options: { defaultType: "future" },
    });

    const sandboxRaw = String(options.sandbox ?? process.env.BINANCE_SANDBOX ?? "false").trim().toLowerCase();
    if (sandboxRaw === "1" || sandboxRaw === "true" || sandboxRaw === "yes" || sandboxRaw === "on") {
      try {
        this.spotExchange.setSandboxMode(true);
      } catch (error) {
        this.logger("spotSandbox", error);
      }
      try {
        this.perpExchange.setSandboxMode(true);
      } catch (error) {
        this.logger("perpSandbox", error);
      }
    }
  }

  async ensureInitialized(symbol?: string): Promise<void> {
    if (this.destroyed) {
      throw new Error("Binance gateway destroyed");
    }
    if (this.initialized) {
      if (symbol) this.resolveMarket(symbol);
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      if (symbol) this.resolveMarket(symbol);
      return;
    }
    this.initPromise = this.doInitialize()
      .then(() => {
        this.initialized = true;
      })
      .catch((error) => {
        this.initPromise = null;
        throw error;
      });
    await this.initPromise;
    if (symbol) this.resolveMarket(symbol);
  }

  private async doInitialize(): Promise<void> {
    try {
      await Promise.all([this.spotExchange.loadMarkets(), this.perpExchange.loadMarkets()]);
      this.rebuildMarketIndex("spot");
      this.rebuildMarketIndex("perp");

      const preferredKind = this.requestedMode === "auto" ? undefined : this.requestedMode;
      const resolved = this.resolveMarket(this.defaultSymbol, preferredKind);
      this.defaultKind = resolved.kind;
      this.defaultMarket = resolved;
      this.activeKinds.add(resolved.kind);
      this.registerAlias(resolved.kind, resolved.id, this.defaultSymbol);
    } catch (error) {
      this.logger("initialize", error);
      throw error;
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.stopPolling();
    this.closeAllSubscriptions(this.depthSubs);
    this.closeAllSubscriptions(this.tickerSubs);
    this.closeAllSubscriptions(this.klineSubs);
    this.closeAllSubscriptions(this.fundingSubs);
    for (const kind of ["spot", "perp"] as const) {
      this.stopUserStream(kind);
    }
    for (const client of [this.spotExchange, this.perpExchange]) {
      if (typeof client.close === "function") {
        try {
          void client.close();
        } catch (error) {
          this.logger("destroy", error);
        }
      }
    }
  }

  private closeAllSubscriptions<T>(map: Map<string, PublicSubscription<T>>): void {
    for (const sub of map.values()) {
      this.closeSubscription(sub);
    }
    map.clear();
  }

  onAccount(cb: AccountListener): void {
    this.accountListeners.add(cb);
    const snapshot = this.buildCombinedAccountSnapshot();
    if (snapshot) {
      try {
        cb(snapshot);
      } catch (error) {
        this.logger("accountReplay", error);
      }
    }
    this.ensurePrivateStreaming();
    this.startAccountPolling();
  }

  onOrders(cb: OrderListener): void {
    this.orderListeners.add(cb);
    this.emitOrders();
    this.ensurePrivateStreaming();
    this.startOrderPolling();
  }

  onDepth(symbol: string, cb: DepthListener): void {
    const market = this.resolveMarket(symbol);
    this.activateKind(market.kind);
    const key = `${market.kind}:${market.id}:depth`;
    const stream = `${market.id.toLowerCase()}@depth@100ms`;
    const sub = this.ensureSubscription(
      this.depthSubs,
      key,
      market.kind,
      stream,
      (payload) => this.mapDepthPayload(payload, market)
    );
    sub.listeners.add(cb);
  }

  onTicker(symbol: string, cb: TickerListener): void {
    const market = this.resolveMarket(symbol);
    this.activateKind(market.kind);
    const key = `${market.kind}:${market.id}:ticker`;
    const stream = `${market.id.toLowerCase()}@ticker`;
    const sub = this.ensureSubscription(
      this.tickerSubs,
      key,
      market.kind,
      stream,
      (payload) => this.mapTickerPayload(payload, market)
    );
    sub.listeners.add(cb);
  }

  onKlines(symbol: string, interval: string, cb: KlineListener): void {
    const market = this.resolveMarket(symbol);
    this.activateKind(market.kind);
    const normalizedInterval = (interval ?? "1m").trim();
    const key = `${market.kind}:${market.id}:kline:${normalizedInterval}`;
    const stream = `${market.id.toLowerCase()}@kline_${normalizedInterval}`;
    const sub = this.ensureSubscription(
      this.klineSubs,
      key,
      market.kind,
      stream,
      (payload) => this.mapKlinePayload(payload, normalizedInterval)
    );
    sub.listeners.add(cb);
  }

  onFundingRate(symbol: string, cb: FundingRateListener): void {
    const market = this.resolveMarket(symbol, "perp");
    this.activateKind(market.kind);
    const key = `${market.kind}:${market.id}:funding`;
    const stream = `${market.id.toLowerCase()}@markPrice@1s`;
    const sub = this.ensureSubscription(
      this.fundingSubs,
      key,
      market.kind,
      stream,
      (payload) => this.mapFundingPayload(payload, market)
    );
    sub.listeners.add((snapshot) => {
      cb(snapshot);
    });
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized(params.symbol);
    const market = this.resolveMarket(params.symbol);
    const exchange = this.getExchange(market.kind);
    let type = this.mapOrderTypeToCcxt(params.type, market.kind);
    const side = params.side.toLowerCase();
    const amount = params.quantity;
    const price = params.price;
    const extra: Record<string, unknown> = {};

    if (params.timeInForce) {
      extra.timeInForce = params.timeInForce;
    }
    if (params.stopPrice != null) {
      extra.stopPrice = params.stopPrice;
    }
    if (params.activationPrice != null) {
      extra.activationPrice = params.activationPrice;
    }
    if (params.callbackRate != null) {
      extra.callbackRate = params.callbackRate;
    }

    if (market.kind === "perp") {
      if (params.reduceOnly != null) {
        extra.reduceOnly = params.reduceOnly === "true";
      }
      if (params.closePosition != null) {
        extra.closePosition = params.closePosition === "true";
      }
      if (params.triggerType === "STOP_LOSS") {
        extra.workingType = "MARK_PRICE";
      }
    } else {
      if (type === "limit" && params.timeInForce === "GTX") {
        type = "limit_maker";
        delete extra.timeInForce;
      }
    }

    try {
      const raw = (await exchange.createOrder(market.symbol, type, side, amount, price, extra)) as CcxtOrder;
      const mapped = this.mapCcxtOrder(raw, market.kind, market.id);
      this.upsertOrder(mapped, market.kind, market.id);
      return mapped;
    } catch (error) {
      throw new Error(`Binance createOrder failed: ${extractMessage(error)}`);
    }
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    const market = this.resolveMarket(params.symbol);
    const exchange = this.getExchange(market.kind);
    try {
      await exchange.cancelOrder(params.orderId, market.symbol);
      this.removeOrder(market.kind, market.id, String(params.orderId));
    } catch (error) {
      throw new Error(`Binance cancelOrder failed: ${extractMessage(error)}`);
    }
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    const market = this.resolveMarket(params.symbol);
    const exchange = this.getExchange(market.kind);
    const errors: Array<{ orderId: number | string; error: unknown }> = [];
    await Promise.all(
      params.orderIdList.map(async (orderId) => {
        try {
          await exchange.cancelOrder(orderId, market.symbol);
          this.removeOrder(market.kind, market.id, String(orderId));
        } catch (error) {
          errors.push({ orderId, error });
        }
      })
    );
    if (errors.length) {
      const detail = errors.map((entry) => `${entry.orderId}: ${extractMessage(entry.error)}`).join("; ");
      throw new Error(`Binance cancelOrders failed: ${detail}`);
    }
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    const market = this.resolveMarket(params.symbol);
    const exchange = this.getExchange(market.kind);
    try {
      if (typeof exchange.cancelAllOrders === "function") {
        await exchange.cancelAllOrders(market.symbol);
      } else {
        const openOrders = (await exchange.fetchOpenOrders(market.symbol)) as CcxtOrder[];
        await Promise.all(openOrders.map((order) => exchange.cancelOrder(order.id, market.symbol)));
      }
      this.removeOrdersByMarket(market.kind, market.id);
    } catch (error) {
      throw new Error(`Binance cancelAllOrders failed: ${extractMessage(error)}`);
    }
  }

  async getPrecision(symbol?: string): Promise<ExchangePrecision | null> {
    await this.ensureInitialized(symbol ?? this.defaultSymbol);
    const market = this.resolveMarket(symbol ?? this.defaultSymbol);
    const exchange = this.getExchange(market.kind);
    const marketInfo = exchange.markets?.[market.symbol] ?? null;
    if (!marketInfo) return null;

    const filters = Array.isArray(marketInfo?.info?.filters) ? marketInfo.info.filters : [];
    const priceFilter = filters.find((f: any) => String(f?.filterType ?? "").toUpperCase() === "PRICE_FILTER");
    const lotFilter = filters.find((f: any) => String(f?.filterType ?? "").toUpperCase() === "LOT_SIZE");
    const notionalFilter = filters.find((f: any) =>
      ["MIN_NOTIONAL", "NOTIONAL"].includes(String(f?.filterType ?? "").toUpperCase())
    );

    const tickSize = Number(priceFilter?.tickSize ?? 0);
    const qtyStep = Number(lotFilter?.stepSize ?? 0);
    const minBase = Number(lotFilter?.minQty ?? 0);
    const minQuote = Number(notionalFilter?.minNotional ?? 0);

    const priceTick = Number.isFinite(tickSize) && tickSize > 0
      ? tickSize
      : Math.pow(10, -(Number(marketInfo.precision?.price ?? 1)));
    const step = Number.isFinite(qtyStep) && qtyStep > 0
      ? qtyStep
      : Math.pow(10, -(Number(marketInfo.precision?.amount ?? 1)));

    return {
      priceTick,
      qtyStep: step,
      priceDecimals: Number.isFinite(Number(marketInfo.precision?.price)) ? Number(marketInfo.precision.price) : undefined,
      sizeDecimals: Number.isFinite(Number(marketInfo.precision?.amount)) ? Number(marketInfo.precision.amount) : undefined,
      minBaseAmount: Number.isFinite(minBase) && minBase > 0 ? minBase : undefined,
      minQuoteAmount: Number.isFinite(minQuote) && minQuote > 0 ? minQuote : undefined,
    };
  }

  async queryOpenOrders(): Promise<AsterOrder[]> {
    await this.ensureInitialized(this.defaultSymbol);
    const kinds = this.getPrivateKinds();
    const result: AsterOrder[] = [];
    for (const kind of kinds) {
      const exchange = this.getExchange(kind);
      const openOrders = (await exchange.fetchOpenOrders()) as CcxtOrder[];
      for (const order of openOrders) {
        const market = this.resolveMarketByCcxtSymbol(kind, String(order.symbol ?? ""));
        const mapped = this.mapCcxtOrder(order, kind, market?.id ?? String(order.symbol ?? ""));
        if (this.isOrderActive(mapped)) {
          result.push(mapped);
        }
      }
    }
    return result;
  }

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    await this.ensureInitialized(this.defaultSymbol);
    const kinds = this.getPrivateKinds();
    for (const kind of kinds) {
      await this.fetchAndUpdateAccount(kind);
    }
    return this.buildCombinedAccountSnapshot();
  }

  async changeMarginMode(symbol: string, marginMode: "isolated" | "cross"): Promise<void> {
    await this.ensureInitialized(symbol);
    const market = this.resolveMarket(symbol, "perp");
    const exchange = this.getExchange("perp");
    if (typeof exchange.setMarginMode !== "function") {
      throw new Error("Binance setMarginMode is not supported by current ccxt build");
    }
    await exchange.setMarginMode(marginMode, market.symbol);
  }

  async forceCancelAllOrders(): Promise<boolean> {
    await this.ensureInitialized(this.defaultSymbol);
    const market = this.defaultMarket ?? this.resolveMarket(this.defaultSymbol);
    await this.cancelAllOrders({ symbol: this.resolveDisplaySymbol(market.kind, market.id) });
    const open = await this.queryOpenOrders();
    return open.length === 0;
  }

  private activateKind(kind: MarketKind): void {
    if (!this.activeKinds.has(kind)) {
      this.activeKinds.add(kind);
    }
    if (this.accountListeners.size || this.orderListeners.size) {
      this.ensureUserStream(kind);
    }
  }

  private ensurePrivateStreaming(): void {
    for (const kind of this.getPrivateKinds()) {
      this.ensureUserStream(kind);
    }
  }

  private ensureUserStream(kind: MarketKind): void {
    const state = this.userStreams[kind];
    if (state.active) return;
    state.active = true;
    state.reconnectDelayMs = RECONNECT_BASE_DELAY_MS;
    void this.bootstrapUserStream(state);
  }

  private stopUserStream(kind: MarketKind): void {
    const state = this.userStreams[kind];
    state.active = false;
    if (state.keepaliveTimer) {
      clearInterval(state.keepaliveTimer);
      state.keepaliveTimer = null;
    }
    if (state.reconnectTimer) {
      clearTimeout(state.reconnectTimer);
      state.reconnectTimer = null;
    }
    if (state.ws) {
      try {
        state.ws.close();
      } catch {
        // ignore
      }
      state.ws = null;
    }
    state.listenKey = null;
  }

  private async bootstrapUserStream(state: UserStreamState): Promise<void> {
    if (!state.active || this.destroyed) return;
    try {
      const listenKey = await this.createListenKey(state.kind);
      state.listenKey = listenKey;
      this.startListenKeyKeepAlive(state);
      this.connectUserSocket(state);
    } catch (error) {
      this.logger(`userStream:${state.kind}:bootstrap`, error);
      this.scheduleUserReconnect(state);
    }
  }

  private connectUserSocket(state: UserStreamState): void {
    if (!state.active || !state.listenKey || this.destroyed) return;
    if (state.ws && (state.ws.readyState === WebSocketCtor.OPEN || state.ws.readyState === WebSocketCtor.CONNECTING)) {
      return;
    }
    const url = this.buildWsUrl(state.kind, state.listenKey);
    const ws = new WebSocketCtor(url);
    state.ws = ws;

    const handleOpen = () => {
      state.reconnectDelayMs = RECONNECT_BASE_DELAY_MS;
    };

    const handleClose = () => {
      if (state.ws === ws) {
        state.ws = null;
      }
      if (!state.active || this.destroyed) return;
      this.scheduleUserReconnect(state);
    };

    const handleError = (error: unknown) => {
      this.logger(`userStream:${state.kind}:error`, error);
    };

    const handleMessage = (payload: unknown) => {
      this.handleUserPayload(state.kind, payload);
    };

    this.bindWsListeners(ws, handleOpen, handleMessage, handleClose, handleError);
  }

  private scheduleUserReconnect(state: UserStreamState): void {
    if (!state.active || this.destroyed) return;
    if (state.reconnectTimer) return;
    state.reconnectTimer = setTimeout(() => {
      state.reconnectTimer = null;
      state.reconnectDelayMs = Math.min(state.reconnectDelayMs * 2, RECONNECT_MAX_DELAY_MS);
      void this.bootstrapUserStream(state);
    }, state.reconnectDelayMs);
  }

  private startListenKeyKeepAlive(state: UserStreamState): void {
    if (state.keepaliveTimer) {
      clearInterval(state.keepaliveTimer);
    }
    state.keepaliveTimer = setInterval(() => {
      void this.keepAliveListenKey(state);
    }, LISTEN_KEY_KEEPALIVE_MS);
  }

  private async keepAliveListenKey(state: UserStreamState): Promise<void> {
    if (!state.active || !state.listenKey) return;
    try {
      await this.callListenKeyEndpoint(state.kind, "PUT", state.listenKey);
    } catch (error) {
      this.logger(`listenKeyKeepalive:${state.kind}`, error);
    }
  }

  private async createListenKey(kind: MarketKind): Promise<string> {
    const data = await this.callListenKeyEndpoint(kind, "POST");
    const listenKey = String(data?.listenKey ?? "");
    if (!listenKey) {
      throw new Error(`Binance ${kind} listenKey is missing`);
    }
    return listenKey;
  }

  private async callListenKeyEndpoint(kind: MarketKind, method: "POST" | "PUT", listenKey?: string): Promise<any> {
    const endpoint = kind === "spot" ? "/api/v3/userDataStream" : "/fapi/v1/listenKey";
    const base = kind === "spot" ? this.spotRestUrl : this.futuresRestUrl;
    const url = `${base}${endpoint}`;
    const payload = new URLSearchParams();
    if (listenKey) payload.set("listenKey", listenKey);
    const response = await axios.request({
      method,
      url,
      headers: { "X-MBX-APIKEY": this.apiKey },
      data: payload.toString(),
      timeout: 15_000,
    });
    return response.data;
  }

  private handleUserPayload(kind: MarketKind, rawPayload: unknown): void {
    const decoded = decodeWsData(rawPayload);
    const payload = decoded && typeof decoded === "object" && "data" in (decoded as any)
      ? (decoded as any).data
      : decoded;
    if (!payload || typeof payload !== "object") return;

    const eventType = String((payload as any).e ?? "").toUpperCase();
    if (!eventType) return;

    if (kind === "spot") {
      if (eventType === "EXECUTIONREPORT") {
        const order = this.mapSpotExecutionReport(payload);
        if (order) {
          this.upsertOrder(order, "spot", order.symbol);
        }
        return;
      }
      if (eventType === "OUTBOUNDACCOUNTPOSITION") {
        this.applySpotAccountPositionEvent(payload);
        this.emitAccount();
        return;
      }
      if (eventType === "BALANCEUPDATE") {
        this.applySpotBalanceUpdateEvent(payload);
        this.emitAccount();
        return;
      }
      return;
    }

    if (eventType === "ORDER_TRADE_UPDATE") {
      const order = this.mapPerpOrderTradeUpdate(payload);
      if (order) {
        this.upsertOrder(order, "perp", order.symbol);
      }
      return;
    }
    if (eventType === "ACCOUNT_UPDATE") {
      this.applyPerpAccountUpdateEvent(payload);
      this.emitAccount();
      return;
    }
  }

  private applySpotAccountPositionEvent(payload: any): void {
    const balances = Array.isArray(payload?.B) ? payload.B : [];
    for (const entry of balances) {
      const asset = String(entry?.a ?? "").toUpperCase();
      if (!asset) continue;
      const free = toNumber(entry?.f);
      const locked = toNumber(entry?.l);
      if (Math.abs(free) < 1e-12 && Math.abs(locked) < 1e-12) {
        this.spotBalances.delete(asset);
      } else {
        this.spotBalances.set(asset, { free, locked });
      }
    }
    this.lastSpotSnapshot = this.buildSpotSnapshot();
  }

  private applySpotBalanceUpdateEvent(payload: any): void {
    const asset = String(payload?.a ?? "").toUpperCase();
    if (!asset) return;
    const delta = toNumber(payload?.d);
    const prev = this.spotBalances.get(asset) ?? { free: 0, locked: 0 };
    const next = { ...prev, free: prev.free + delta };
    if (Math.abs(next.free) < 1e-12 && Math.abs(next.locked) < 1e-12) {
      this.spotBalances.delete(asset);
    } else {
      this.spotBalances.set(asset, next);
    }
    this.lastSpotSnapshot = this.buildSpotSnapshot();
  }

  private applyPerpAccountUpdateEvent(payload: any): void {
    const account = payload?.a;
    const balances = Array.isArray(account?.B) ? account.B : [];
    const positions = Array.isArray(account?.P) ? account.P : [];
    const updateTime = Number(payload?.E ?? payload?.T ?? Date.now());

    for (const entry of balances) {
      const asset = String(entry?.a ?? "").toUpperCase();
      if (!asset) continue;
      const wallet = toNumber(entry?.wb);
      const available = toNumber(entry?.cw ?? entry?.wb);
      if (Math.abs(wallet) < 1e-12 && Math.abs(available) < 1e-12) {
        this.perpBalances.delete(asset);
      } else {
        this.perpBalances.set(asset, { wallet, available });
      }
    }

    for (const position of positions) {
      const symbolRaw = String(position?.s ?? "").toUpperCase();
      if (!symbolRaw) continue;
      const amount = toNumber(position?.pa);
      const symbol = this.resolveDisplaySymbol("perp", symbolRaw);
      const key = symbol;
      if (Math.abs(amount) < 1e-12) {
        this.perpPositions.delete(key);
        continue;
      }

      const mark = this.lastMarkPriceBySymbol.get(symbolRaw);
      this.perpPositions.set(key, {
        symbol,
        positionAmt: String(amount),
        entryPrice: String(toNumber(position?.ep)),
        unrealizedProfit: String(toNumber(position?.up)),
        positionSide: normalizePositionSide(position?.ps),
        updateTime: Number.isFinite(updateTime) ? updateTime : Date.now(),
        marginType: position?.mt != null ? String(position.mt) : undefined,
        isolatedMargin: position?.iw != null ? String(position.iw) : undefined,
        markPrice: mark != null ? String(mark) : undefined,
      });
    }

    this.lastPerpSnapshot = this.buildPerpSnapshot();
  }

  private mapSpotExecutionReport(payload: any): AsterOrder | null {
    const order = payload;
    const symbolRaw = String(order?.s ?? "").toUpperCase();
    if (!symbolRaw) return null;
    const symbol = this.resolveDisplaySymbol("spot", symbolRaw);
    const executedQty = toNumber(order?.z);
    const cumQuote = toNumber(order?.Z);
    const avgPrice = executedQty > 0 ? cumQuote / executedQty : 0;

    return {
      orderId: String(order?.i ?? ""),
      clientOrderId: String(order?.c ?? ""),
      symbol,
      side: String(order?.S ?? "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY",
      type: this.mapBinanceOrderTypeToAster(order?.o, "spot"),
      status: String(order?.X ?? ""),
      price: String(order?.p ?? "0"),
      origQty: String(order?.q ?? "0"),
      executedQty: String(order?.z ?? "0"),
      stopPrice: String(order?.P ?? "0"),
      time: Number(order?.O ?? order?.T ?? Date.now()),
      updateTime: Number(order?.E ?? order?.T ?? Date.now()),
      reduceOnly: false,
      closePosition: false,
      avgPrice: Number.isFinite(avgPrice) ? String(avgPrice) : undefined,
      cumQuote: String(order?.Z ?? "0"),
      timeInForce: normalizeTimeInForce(order?.f),
    };
  }

  private mapPerpOrderTradeUpdate(payload: any): AsterOrder | null {
    const order = payload?.o;
    if (!order) return null;
    const symbolRaw = String(order?.s ?? "").toUpperCase();
    if (!symbolRaw) return null;
    const symbol = this.resolveDisplaySymbol("perp", symbolRaw);
    return {
      orderId: String(order?.i ?? ""),
      clientOrderId: String(order?.c ?? ""),
      symbol,
      side: String(order?.S ?? "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY",
      type: this.mapBinanceOrderTypeToAster(order?.o, "perp"),
      status: String(order?.X ?? ""),
      price: String(order?.p ?? "0"),
      origQty: String(order?.q ?? "0"),
      executedQty: String(order?.z ?? "0"),
      stopPrice: String(order?.sp ?? "0"),
      time: Number(order?.T ?? payload?.E ?? Date.now()),
      updateTime: Number(payload?.E ?? order?.T ?? Date.now()),
      reduceOnly: Boolean(order?.R),
      closePosition: Boolean(order?.cp),
      workingType: order?.wt != null ? String(order.wt) : undefined,
      activationPrice: order?.AP != null ? String(order.AP) : undefined,
      avgPrice: order?.ap != null ? String(order.ap) : undefined,
      cumQuote: order?.Z != null ? String(order.Z) : undefined,
      positionSide: normalizePositionSide(order?.ps),
      timeInForce: normalizeTimeInForce(order?.f),
    };
  }

  private ensureSubscription<T>(
    map: Map<string, PublicSubscription<T>>,
    key: string,
    kind: MarketKind,
    stream: string,
    transform: (payload: unknown) => T | null
  ): PublicSubscription<T> {
    const existing = map.get(key);
    if (existing) return existing;

    const subscription: PublicSubscription<T> = {
      kind,
      stream,
      listeners: new Set(),
      transform,
      ws: null,
      reconnectTimer: null,
      reconnectDelayMs: RECONNECT_BASE_DELAY_MS,
    };
    map.set(key, subscription);
    this.connectSubscription(map, key, subscription);
    return subscription;
  }

  private connectSubscription<T>(
    map: Map<string, PublicSubscription<T>>,
    key: string,
    subscription: PublicSubscription<T>
  ): void {
    if (this.destroyed) return;
    const url = this.buildWsUrl(subscription.kind, subscription.stream);
    const ws = new WebSocketCtor(url);
    subscription.ws = ws;

    const handleOpen = () => {
      subscription.reconnectDelayMs = RECONNECT_BASE_DELAY_MS;
    };

    const handleClose = () => {
      if (subscription.ws === ws) {
        subscription.ws = null;
      }
      if (this.destroyed) return;
      this.scheduleSubscriptionReconnect(map, key, subscription);
    };

    const handleError = (error: unknown) => {
      this.logger(`publicWs:${key}`, error);
    };

    const handleMessage = (rawPayload: unknown) => {
      const decoded = decodeWsData(rawPayload);
      const payload = decoded && typeof decoded === "object" && "data" in (decoded as any)
        ? (decoded as any).data
        : decoded;
      if (!payload) return;
      const mapped = subscription.transform(payload);
      if (!mapped) return;
      for (const listener of subscription.listeners) {
        try {
          listener(mapped);
        } catch (error) {
          this.logger(`publicListener:${key}`, error);
        }
      }
    };

    this.bindWsListeners(ws, handleOpen, handleMessage, handleClose, handleError);
  }

  private scheduleSubscriptionReconnect<T>(
    map: Map<string, PublicSubscription<T>>,
    key: string,
    subscription: PublicSubscription<T>
  ): void {
    if (this.destroyed) return;
    if (subscription.reconnectTimer) return;
    subscription.reconnectTimer = setTimeout(() => {
      subscription.reconnectTimer = null;
      subscription.reconnectDelayMs = Math.min(subscription.reconnectDelayMs * 2, RECONNECT_MAX_DELAY_MS);
      this.connectSubscription(map, key, subscription);
    }, subscription.reconnectDelayMs);
  }

  private closeSubscription<T>(subscription: PublicSubscription<T>): void {
    if (subscription.reconnectTimer) {
      clearTimeout(subscription.reconnectTimer);
      subscription.reconnectTimer = null;
    }
    if (subscription.ws) {
      try {
        subscription.ws.close();
      } catch {
        // ignore
      }
      subscription.ws = null;
    }
  }

  private bindWsListeners(
    ws: WebSocket,
    onOpen: () => void,
    onMessage: (data: unknown) => void,
    onClose: () => void,
    onError: (error: unknown) => void
  ): void {
    const handlePing = (data: unknown) => {
      if (ws && "pong" in ws && typeof (ws as any).pong === "function") {
        try {
          (ws as any).pong(data as any);
        } catch (error) {
          this.logger("wsPong", error);
        }
      }
    };

    if ("addEventListener" in ws && typeof ws.addEventListener === "function") {
      ws.addEventListener("open", onOpen as any);
      ws.addEventListener("message", ((event: MessageEvent) => onMessage(event.data)) as any);
      ws.addEventListener("close", onClose as any);
      ws.addEventListener("error", ((event: Event) => onError((event as any)?.error ?? event)) as any);
      ws.addEventListener("ping", (handlePing as any));
      return;
    }

    if ("on" in ws && typeof (ws as any).on === "function") {
      const socket = ws as any;
      socket.on("open", onOpen);
      socket.on("message", onMessage);
      socket.on("close", onClose);
      socket.on("error", onError);
      socket.on("ping", handlePing);
      return;
    }

    (ws as any).onopen = onOpen;
    (ws as any).onmessage = (event: any) => onMessage(event?.data);
    (ws as any).onclose = onClose;
    (ws as any).onerror = (event: any) => onError(event?.error ?? event);
  }

  private mapDepthPayload(payload: unknown, market: BinanceMarketRef): AsterDepth | null {
    const data = payload as any;
    const bids = Array.isArray(data?.b) ? data.b : [];
    const asks = Array.isArray(data?.a) ? data.a : [];
    if (!bids.length || !asks.length) return null;
    return {
      lastUpdateId: Number(data?.u ?? data?.lastUpdateId ?? Date.now()),
      bids: bids
        .filter((entry: any) => Array.isArray(entry) && entry.length >= 2)
        .map((entry: any) => [String(entry[0]), String(entry[1])]),
      asks: asks
        .filter((entry: any) => Array.isArray(entry) && entry.length >= 2)
        .map((entry: any) => [String(entry[0]), String(entry[1])]),
      eventTime: Number(data?.E ?? Date.now()),
      symbol: this.resolveDisplaySymbol(market.kind, market.id),
    };
  }

  private mapTickerPayload(payload: unknown, market: BinanceMarketRef): AsterTicker | null {
    const data = payload as any;
    const lastPrice = String(data?.c ?? "");
    if (!lastPrice) return null;
    const displaySymbol = this.resolveDisplaySymbol(market.kind, market.id);
    const mark = toNumber(data?.w);
    if (Number.isFinite(mark) && mark > 0) {
      this.lastMarkPriceBySymbol.set(market.id, mark);
    }
    return {
      symbol: displaySymbol,
      lastPrice,
      openPrice: String(data?.o ?? "0"),
      highPrice: String(data?.h ?? "0"),
      lowPrice: String(data?.l ?? "0"),
      volume: String(data?.v ?? "0"),
      quoteVolume: String(data?.q ?? "0"),
      eventTime: Number(data?.E ?? Date.now()),
      priceChange: data?.p != null ? String(data.p) : undefined,
      priceChangePercent: data?.P != null ? String(data.P) : undefined,
      weightedAvgPrice: data?.w != null ? String(data.w) : undefined,
      bidPrice: data?.b != null ? String(data.b) : undefined,
      askPrice: data?.a != null ? String(data.a) : undefined,
      markPrice: data?.w != null ? String(data.w) : undefined,
    };
  }

  private mapKlinePayload(payload: unknown, interval: string): AsterKline[] | null {
    const data = payload as any;
    const kline = data?.k;
    if (!kline) return null;
    return [
      {
        eventType: String(data?.e ?? "kline"),
        eventTime: Number(data?.E ?? Date.now()),
        symbol: String(data?.s ?? ""),
        interval,
        openTime: Number(kline?.t ?? Date.now()),
        closeTime: Number(kline?.T ?? Date.now()),
        open: String(kline?.o ?? "0"),
        close: String(kline?.c ?? "0"),
        high: String(kline?.h ?? "0"),
        low: String(kline?.l ?? "0"),
        volume: String(kline?.v ?? "0"),
        numberOfTrades: Number(kline?.n ?? 0),
        quoteAssetVolume: kline?.q != null ? String(kline.q) : undefined,
        takerBuyBaseAssetVolume: kline?.V != null ? String(kline.V) : undefined,
        takerBuyQuoteAssetVolume: kline?.Q != null ? String(kline.Q) : undefined,
        isClosed: Boolean(kline?.x),
      },
    ];
  }

  private mapFundingPayload(
    payload: unknown,
    market: BinanceMarketRef
  ): { symbol: string; fundingRate: number; updateTime: number } | null {
    const data = payload as any;
    const rate = Number(data?.r);
    if (!Number.isFinite(rate)) return null;
    const markPrice = Number(data?.p);
    if (Number.isFinite(markPrice) && markPrice > 0) {
      this.lastMarkPriceBySymbol.set(market.id, markPrice);
    }
    return {
      symbol: this.resolveDisplaySymbol(market.kind, market.id),
      fundingRate: rate,
      updateTime: Number(data?.E ?? Date.now()),
    };
  }

  private startAccountPolling(): void {
    if (this.accountPollTimer) return;
    const poll = async () => {
      if (!this.accountListeners.size) return;
      try {
        for (const kind of this.getPrivateKinds()) {
          await this.fetchAndUpdateAccount(kind);
        }
        this.emitAccount();
      } catch (error) {
        this.logger("accountPoll", error);
      }
    };
    void poll();
    this.accountPollTimer = setInterval(() => {
      void poll();
    }, this.pollIntervals.account);
  }

  private startOrderPolling(): void {
    if (this.orderPollTimer) return;
    const poll = async () => {
      if (!this.orderListeners.size) return;
      try {
        for (const kind of this.getPrivateKinds()) {
          await this.fetchAndUpdateOrders(kind);
        }
        this.emitOrders();
      } catch (error) {
        this.logger("ordersPoll", error);
      }
    };
    void poll();
    this.orderPollTimer = setInterval(() => {
      void poll();
    }, this.pollIntervals.orders);
  }

  private stopPolling(): void {
    if (this.accountPollTimer) {
      clearInterval(this.accountPollTimer);
      this.accountPollTimer = null;
    }
    if (this.orderPollTimer) {
      clearInterval(this.orderPollTimer);
      this.orderPollTimer = null;
    }
  }

  private async fetchAndUpdateAccount(kind: MarketKind): Promise<void> {
    if (kind === "spot") {
      const balance = (await this.spotExchange.fetchBalance()) as Balances;
      this.applySpotBalanceSnapshot(balance);
      this.lastSpotSnapshot = this.buildSpotSnapshot();
      return;
    }
    const balance = (await this.perpExchange.fetchBalance()) as Balances;
    this.applyPerpBalanceSnapshot(balance);
    await this.attachPerpPositions();
    this.lastPerpSnapshot = this.buildPerpSnapshot();
  }

  private applySpotBalanceSnapshot(balance: Balances): void {
    const freeMap = (balance.free ?? {}) as Record<string, number>;
    const usedMap = (balance.used ?? {}) as Record<string, number>;
    const keys = new Set<string>([...Object.keys(freeMap), ...Object.keys(usedMap)]);
    this.spotBalances.clear();
    for (const asset of keys) {
      const free = toNumber(freeMap[asset]);
      const locked = toNumber(usedMap[asset]);
      if (Math.abs(free) < 1e-12 && Math.abs(locked) < 1e-12) continue;
      this.spotBalances.set(asset.toUpperCase(), { free, locked });
    }
  }

  private applyPerpBalanceSnapshot(balance: Balances): void {
    const total = (balance.total ?? {}) as Record<string, number>;
    const free = (balance.free ?? {}) as Record<string, number>;
    this.perpBalances.clear();
    for (const asset of Object.keys(total)) {
      const wallet = toNumber(total[asset]);
      const available = toNumber(free[asset] ?? wallet);
      if (Math.abs(wallet) < 1e-12 && Math.abs(available) < 1e-12) continue;
      this.perpBalances.set(asset.toUpperCase(), { wallet, available });
    }
  }

  private async attachPerpPositions(): Promise<void> {
    const next = new Map<string, AsterAccountPosition>();
    try {
      const raw = (await this.perpExchange.fetchPositions()) as any[];
      for (const row of raw ?? []) {
        const amount = toNumber(row?.contracts ?? row?.positionAmt ?? row?.info?.positionAmt);
        if (Math.abs(amount) < 1e-12) continue;
        const id = String(row?.id ?? row?.symbol ?? row?.info?.symbol ?? "").toUpperCase();
        if (!id) continue;
        const market = this.resolveMarketByCcxtSymbol("perp", String(row?.symbol ?? ""));
        const symbol = this.resolveDisplaySymbol("perp", market?.id ?? id);
        const markFromTicker = this.lastMarkPriceBySymbol.get(market?.id ?? id);
        next.set(symbol, {
          symbol,
          positionAmt: String(amount),
          entryPrice: String(toNumber(row?.entryPrice ?? row?.info?.entryPrice)),
          unrealizedProfit: String(toNumber(row?.unrealizedPnl ?? row?.info?.unrealizedProfit)),
          positionSide: normalizePositionSide(row?.side ?? row?.info?.positionSide),
          updateTime: Date.now(),
          markPrice: Number.isFinite(toNumber(row?.markPrice))
            ? String(toNumber(row?.markPrice))
            : markFromTicker != null
              ? String(markFromTicker)
              : undefined,
        });
      }
    } catch (error) {
      this.logger("fetchPositions", error);
    }
    this.perpPositions.clear();
    for (const [key, value] of next.entries()) {
      this.perpPositions.set(key, value);
    }
  }

  private async fetchAndUpdateOrders(kind: MarketKind): Promise<void> {
    const exchange = this.getExchange(kind);
    const openOrders = (await exchange.fetchOpenOrders()) as CcxtOrder[];
    const remote = new Map<string, AsterOrder>();
    for (const order of openOrders) {
      const market = this.resolveMarketByCcxtSymbol(kind, String(order?.symbol ?? ""));
      const mapped = this.mapCcxtOrder(order, kind, market?.id ?? String(order?.symbol ?? ""));
      if (!this.isOrderActive(mapped)) continue;
      remote.set(hashOrderKey(kind, mapped.symbol, String(mapped.orderId)), mapped);
    }

    for (const key of Array.from(this.localOrders.keys())) {
      if (!key.startsWith(`${kind}:`)) continue;
      if (!remote.has(key)) this.localOrders.delete(key);
    }
    for (const [key, value] of remote.entries()) {
      this.localOrders.set(key, value);
    }
  }

  private emitAccount(): void {
    if (!this.accountListeners.size) return;
    const snapshot = this.buildCombinedAccountSnapshot();
    if (!snapshot) return;
    for (const listener of this.accountListeners) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("emitAccount", error);
      }
    }
  }

  private emitOrders(): void {
    if (!this.orderListeners.size) return;
    const orders = Array.from(this.localOrders.values()).filter((order) => this.isOrderActive(order));
    for (const listener of this.orderListeners) {
      try {
        listener(orders);
      } catch (error) {
        this.logger("emitOrders", error);
      }
    }
  }

  private upsertOrder(order: AsterOrder, kind: MarketKind, marketId: string): void {
    const id = String(order.orderId);
    const symbol = this.resolveDisplaySymbol(kind, marketId);
    const normalized = { ...order, symbol };
    const key = hashOrderKey(kind, symbol, id);
    if (!this.isOrderActive(normalized)) {
      this.localOrders.delete(key);
      this.emitOrders();
      return;
    }
    this.localOrders.set(key, normalized);
    this.emitOrders();
  }

  private removeOrder(kind: MarketKind, marketId: string, orderId: string): void {
    const symbol = this.resolveDisplaySymbol(kind, marketId);
    const key = hashOrderKey(kind, symbol, orderId);
    if (this.localOrders.delete(key)) {
      this.emitOrders();
    }
  }

  private removeOrdersByMarket(kind: MarketKind, marketId: string): void {
    const symbol = this.resolveDisplaySymbol(kind, marketId);
    const prefix = `${kind}:`;
    let changed = false;
    for (const [key, order] of this.localOrders.entries()) {
      if (!key.startsWith(prefix)) continue;
      if (order.symbol !== symbol) continue;
      this.localOrders.delete(key);
      changed = true;
    }
    if (changed) this.emitOrders();
  }

  private isOrderActive(order: AsterOrder): boolean {
    const status = String(order.status ?? "").toUpperCase();
    if (!status) return true;
    if (status === "FILLED" || status === "CANCELED" || status === "CANCELLED" || status === "REJECTED" || status === "EXPIRED") {
      return false;
    }
    if (status.includes("CLOSE")) return false;
    return true;
  }

  private buildCombinedAccountSnapshot(): AsterAccountSnapshot | null {
    const kinds = this.getPrivateKinds();
    if (kinds.length === 0) return null;
    if (kinds.length === 1) {
      return kinds[0] === "spot" ? this.buildSpotSnapshot() : this.buildPerpSnapshot();
    }

    const spot = this.buildSpotSnapshot();
    const perp = this.buildPerpSnapshot();
    const perpAssetsTagged: AsterAccountAsset[] = perp.assets.map((asset) => ({
      ...asset,
      asset: `${asset.asset}0`,
    }));
    const assets = [...spot.assets, ...perpAssetsTagged];
    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Math.max(spot.updateTime, perp.updateTime),
      totalWalletBalance: String(toNumber(spot.totalWalletBalance) + toNumber(perp.totalWalletBalance)),
      totalUnrealizedProfit: perp.totalUnrealizedProfit,
      positions: perp.positions,
      assets,
      marketType: "perp",
      baseAsset: perp.baseAsset,
      quoteAsset: perp.quoteAsset,
    };
  }

  private buildSpotSnapshot(): AsterAccountSnapshot {
    const assets: AsterAccountAsset[] = [];
    let totalWallet = 0;
    const now = Date.now();
    for (const [asset, balance] of this.spotBalances.entries()) {
      const wallet = balance.free + balance.locked;
      totalWallet += wallet;
      assets.push({
        asset,
        walletBalance: String(wallet),
        availableBalance: String(balance.free),
        updateTime: now,
      });
    }
    const market = this.defaultKind === "spot" ? this.defaultMarket : null;
    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: now,
      totalWalletBalance: String(totalWallet),
      totalUnrealizedProfit: "0",
      positions: [],
      assets,
      marketType: "spot",
      baseAsset: market?.base,
      quoteAsset: market?.quote,
    };
  }

  private buildPerpSnapshot(): AsterAccountSnapshot {
    const now = Date.now();
    const assets: AsterAccountAsset[] = [];
    let totalWallet = 0;
    for (const [asset, balance] of this.perpBalances.entries()) {
      totalWallet += balance.wallet;
      assets.push({
        asset,
        walletBalance: String(balance.wallet),
        availableBalance: String(balance.available),
        updateTime: now,
      });
    }

    const positions = Array.from(this.perpPositions.values());
    let totalUnrealized = 0;
    for (const position of positions) {
      totalUnrealized += toNumber(position.unrealizedProfit);
    }
    const market = this.defaultKind === "perp" ? this.defaultMarket : null;
    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: now,
      totalWalletBalance: String(totalWallet),
      totalUnrealizedProfit: String(totalUnrealized),
      positions,
      assets,
      marketType: "perp",
      baseAsset: market?.base,
      quoteAsset: market?.quote,
    };
  }

  private mapCcxtOrder(order: CcxtOrder, kind: MarketKind, marketId: string): AsterOrder {
    const symbol = this.resolveDisplaySymbol(kind, marketId);
    const side = String(order.side ?? "buy").toUpperCase() === "SELL" ? "SELL" : "BUY";
    return {
      orderId: String(order.id ?? ""),
      clientOrderId: String(order.clientOrderId ?? ""),
      symbol,
      side,
      type: this.mapCcxtOrderTypeToAster(order.type, kind),
      status: String(order.status ?? ""),
      price: String(order.price ?? 0),
      origQty: String(order.amount ?? 0),
      executedQty: String(order.filled ?? 0),
      stopPrice: String(order.stopPrice ?? 0),
      time: Number(order.timestamp ?? Date.now()),
      updateTime: Number(order.lastUpdateTimestamp ?? order.timestamp ?? Date.now()),
      reduceOnly: Boolean((order.info as any)?.reduceOnly ?? false),
      closePosition: Boolean((order.info as any)?.closePosition ?? false),
      avgPrice: order.average != null ? String(order.average) : undefined,
      cumQuote: order.cost != null ? String(order.cost) : undefined,
      timeInForce: normalizeTimeInForce(order.timeInForce),
      positionSide: normalizePositionSide((order.info as any)?.positionSide),
    };
  }

  private mapOrderTypeToCcxt(type: OrderType, kind: MarketKind): string {
    if (kind === "spot") {
      if (type === "STOP_MARKET") return "stop_loss";
      if (type === "TAKE_PROFIT_MARKET") return "take_profit";
      return type.toLowerCase();
    }
    const map: Record<OrderType, string> = {
      LIMIT: "limit",
      MARKET: "market",
      STOP: "stop",
      STOP_MARKET: "stop_market",
      TAKE_PROFIT: "take_profit",
      TAKE_PROFIT_MARKET: "take_profit_market",
      TRAILING_STOP_MARKET: "trailing_stop_market",
    };
    return map[type] ?? "limit";
  }

  private mapCcxtOrderTypeToAster(type: string | undefined, kind: MarketKind): OrderType {
    const normalized = String(type ?? "").toLowerCase();
    if (kind === "spot") {
      if (normalized.includes("stop")) return "STOP_MARKET";
      if (normalized.includes("take_profit")) return "TAKE_PROFIT_MARKET";
      if (normalized.includes("market")) return "MARKET";
      return "LIMIT";
    }
    if (normalized === "market") return "MARKET";
    if (normalized === "stop" || normalized === "stop_market") return "STOP_MARKET";
    if (normalized === "trailing_stop_market" || normalized === "trailing-stop") return "TRAILING_STOP_MARKET";
    if (normalized === "take_profit_market") return "TAKE_PROFIT_MARKET";
    if (normalized === "take_profit") return "TAKE_PROFIT";
    return "LIMIT";
  }

  private mapBinanceOrderTypeToAster(type: unknown, kind: MarketKind): OrderType {
    const upper = String(type ?? "").toUpperCase();
    if (upper === "MARKET") return "MARKET";
    if (upper === "TRAILING_STOP_MARKET") return "TRAILING_STOP_MARKET";
    if (upper.includes("STOP")) return "STOP_MARKET";
    if (upper.includes("TAKE_PROFIT")) return "TAKE_PROFIT_MARKET";
    if (kind === "spot" && upper === "STOP_LOSS_LIMIT") return "STOP_MARKET";
    return "LIMIT";
  }

  private getExchange(kind: MarketKind): any {
    return kind === "spot" ? this.spotExchange : this.perpExchange;
  }

  private getPrivateKinds(): MarketKind[] {
    if (this.activeKinds.size > 0) {
      return Array.from(this.activeKinds.values());
    }
    return [this.defaultKind];
  }

  private rebuildMarketIndex(kind: MarketKind): void {
    const index = this.marketIndex[kind];
    index.clear();
    const exchange = this.getExchange(kind);
    const markets = exchange.markets ?? {};
    for (const market of Object.values(markets) as any[]) {
      const symbol = String(market?.symbol ?? "").trim();
      if (!symbol) continue;
      const id = String(market?.id ?? symbol).trim().toUpperCase();
      const ref: BinanceMarketRef = {
        kind,
        symbol,
        id,
        base: market?.base != null ? String(market.base).toUpperCase() : undefined,
        quote: market?.quote != null ? String(market.quote).toUpperCase() : undefined,
      };

      const keys = new Set<string>([
        symbol.toUpperCase(),
        id,
        normalizeSymbolKey(symbol),
        normalizeSymbolKey(id),
      ]);
      if (ref.base && ref.quote) {
        keys.add(`${ref.base}${ref.quote}`);
      }
      for (const key of keys) {
        if (!key) continue;
        if (!index.has(key)) index.set(key, ref);
      }
    }
  }

  private resolveMarket(symbol: string, preferredKind?: MarketKind): BinanceMarketRef {
    const parsed = parseSymbolHint(symbol);
    const normalized = parsed.normalized;
    if (!normalized) {
      throw new Error("Binance symbol is required");
    }

    const keys = [normalized.toUpperCase(), normalizeSymbolKey(normalized)];
    const tryResolveIn = (kind: MarketKind): BinanceMarketRef | null => {
      const index = this.marketIndex[kind];
      for (const key of keys) {
        const found = index.get(key);
        if (found) return found;
      }
      return null;
    };

    const forced = parsed.forcedKind;
    if (forced) {
      const target = tryResolveIn(forced);
      if (!target) {
        throw new Error(`Binance symbol ${symbol} is not available on ${forced}`);
      }
      this.registerAlias(forced, target.id, symbol);
      return target;
    }

    if (preferredKind) {
      const target = tryResolveIn(preferredKind);
      if (target) {
        this.registerAlias(preferredKind, target.id, symbol);
        return target;
      }
    }

    const spot = tryResolveIn("spot");
    const perp = tryResolveIn("perp");
    if (spot && !perp) {
      this.registerAlias("spot", spot.id, symbol);
      return spot;
    }
    if (perp && !spot) {
      this.registerAlias("perp", perp.id, symbol);
      return perp;
    }
    if (spot && perp) {
      const target = this.defaultKind === "spot" ? spot : perp;
      this.registerAlias(target.kind, target.id, symbol);
      return target;
    }

    throw new Error(`Binance symbol not found: ${symbol}`);
  }

  private resolveMarketByCcxtSymbol(kind: MarketKind, ccxtSymbol: string): BinanceMarketRef | null {
    const index = this.marketIndex[kind];
    const keyA = ccxtSymbol.toUpperCase();
    const keyB = normalizeSymbolKey(ccxtSymbol);
    return index.get(keyA) ?? index.get(keyB) ?? null;
  }

  private registerAlias(kind: MarketKind, marketId: string, requestedSymbol: string): void {
    const normalized = (requestedSymbol ?? "").trim().toUpperCase();
    if (!normalized) return;
    this.symbolAliasByKey.set(`${kind}:${marketId.toUpperCase()}`, normalized);
  }

  private resolveDisplaySymbol(kind: MarketKind, marketId: string): string {
    const key = `${kind}:${marketId.toUpperCase()}`;
    return this.symbolAliasByKey.get(key) ?? marketId.toUpperCase();
  }

  private buildWsUrl(kind: MarketKind, stream: string): string {
    const base = kind === "spot" ? this.spotWsUrl : this.futuresWsUrl;
    if (base.endsWith("/ws")) return `${base}/${stream}`;
    if (base.includes("/stream")) return `${base}?streams=${encodeURIComponent(stream)}`;
    return `${base}/ws/${stream}`;
  }
}
