import { setInterval, clearInterval, setTimeout, clearTimeout } from "timers";
import WebSocket from "ws";
import type {
  AccountListener,
  DepthListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterKline, AsterOrder, AsterTicker, CreateOrderParams } from "../types";
import { extractMessage } from "../../utils/errors";
import type { OrderSide, OrderType } from "../types";
import { LighterHttpClient } from "./http-client";
import { HttpNonceManager } from "./nonce-manager";
import { LighterSigner, type CreateOrderSignParams } from "./signer";
import { bytesToHex } from "./bytes";
import type {
  LighterAccountDetails,
  LighterKline,
  LighterMarketStats,
  LighterOrder,
  LighterOrderBookLevel,
  LighterOrderBookSnapshot,
  LighterPosition,
} from "./types";
import {
  DEFAULT_AUTH_TOKEN_BUFFER_MS,
  DEFAULT_LIGHTER_ENVIRONMENT,
  LIGHTER_HOSTS,
  LIGHTER_ORDER_TYPE,
  LIGHTER_TIME_IN_FORCE,
  DEFAULT_ORDER_EXPIRY_PLACEHOLDER,
  IMMEDIATE_OR_CANCEL_EXPIRY_PLACEHOLDER,
  type LighterEnvironment,
} from "./constants";
import { decimalToScaled, scaledToDecimalString } from "./decimal";
import { lighterOrderToAster, toAccountSnapshot, toDepth, toKlines, toOrders, toTicker } from "./mappers";

interface SimpleEvent<T> {
  add(handler: (value: T) => void): void;
  remove(handler: (value: T) => void): void;
  emit(value: T): void;
  listenerCount(): number;
}

function createEvent<T>(): SimpleEvent<T> {
  const listeners = new Set<(value: T) => void>();
  return {
    add(handler) {
      listeners.add(handler);
    },
    remove(handler) {
      listeners.delete(handler);
    },
    emit(value) {
      for (const handler of Array.from(listeners)) {
        try {
          handler(value);
        } catch (error) {
          console.error("[LighterGateway] listener error", error);
        }
      }
    },
    listenerCount() {
      return listeners.size;
    },
  };
}

function isLighterEnvironment(value: string | undefined | null): value is LighterEnvironment {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(LIGHTER_HOSTS, value);
}

function detectEnvironmentFromUrl(baseUrl: string | undefined | null): LighterEnvironment | null {
  if (!baseUrl) return null;
  const matchHost = (host: string): LighterEnvironment | null => {
    for (const [env, config] of Object.entries(LIGHTER_HOSTS)) {
      try {
        const restHost = new URL(config.rest).hostname.toLowerCase();
        if (restHost === host) {
          return env as LighterEnvironment;
        }
      } catch {
        // ignore invalid config URLs
      }
    }
    if (host.includes("mainnet")) return "mainnet";
    if (host.includes("testnet")) return "testnet";
    if (host.includes("staging")) return "staging";
    if (host.includes("dev")) return "dev";
    return null;
  };

  try {
    const parsed = new URL(baseUrl);
    return matchHost(parsed.hostname.toLowerCase());
  } catch {
    return matchHost(baseUrl.toLowerCase());
  }
}

function inferEnvironment(envOption: string | undefined, baseUrl?: string | null): LighterEnvironment {
  if (isLighterEnvironment(envOption)) {
    return envOption;
  }
  const detected = detectEnvironmentFromUrl(baseUrl ?? undefined);
  return detected ?? DEFAULT_LIGHTER_ENVIRONMENT;
}

interface Pollers {
  ticker?: ReturnType<typeof setInterval>;
  klines: Map<string, ReturnType<typeof setInterval>>;
}

const KLINE_DEFAULT_COUNT = 120;
const DEFAULT_TICKER_POLL_MS = 3000;
const DEFAULT_KLINE_POLL_MS = 15000;

const RESOLUTION_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "1h": 3_600_000,
  "4h": 14_400_000,
  "1d": 86_400_000,
};

export interface LighterGatewayOptions {
  symbol: string; // display symbol used by strategy logging
  marketSymbol?: string; // actual Lighter order book symbol (e.g., BTC)
  accountIndex: number;
  apiKeys: Record<number, string>;
  baseUrl?: string;
  environment?: keyof typeof LIGHTER_HOSTS;
  marketId?: number;
  priceDecimals?: number;
  sizeDecimals?: number;
  chainId?: number;
  apiKeyIndices?: number[];
  tickerPollMs?: number;
  klinePollMs?: number;
  logger?: (context: string, error: unknown) => void;
  l1Address?: string;
}

export class LighterGateway {
  private readonly displaySymbol: string;
  private readonly marketSymbol: string;
  private readonly http: LighterHttpClient;
  private readonly signer: LighterSigner;
  private readonly nonceManager: HttpNonceManager;
  private readonly logger: (context: string, error: unknown) => void;
  private readonly apiKeyIndices: number[];
  private readonly environment: keyof typeof LIGHTER_HOSTS;
  private readonly pollers: Pollers = { ticker: undefined, klines: new Map() };
  private readonly klineCache = new Map<string, AsterKline[]>();
  private readonly accountEvent = createEvent<AsterAccountSnapshot>();
  private readonly ordersEvent = createEvent<AsterOrder[]>();
  private readonly depthEvent = createEvent<AsterDepth>();
  private readonly tickerEvent = createEvent<AsterTicker>();
  private readonly klinesEvent = createEvent<AsterKline[]>();
  private readonly auth = { token: null as string | null, expiresAt: 0 };
  private readonly l1Address: string | null;
  private loggedCreateOrderPayload = false;

  private marketId: number | null = null;
  private priceDecimals: number | null = null;
  private sizeDecimals: number | null = null;

  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly wsUrl: string;
  private connectPromise: Promise<void> | null = null;

  private accountDetails: LighterAccountDetails | null = null;
  private positions: LighterPosition[] = [];
  private orders: LighterOrder[] = [];
  private readonly orderMap = new Map<string, LighterOrder>();
  private orderBook: LighterOrderBookSnapshot | null = null;
  private ticker: LighterMarketStats | null = null;
  private initialized = false;

  private readonly tickerPollMs: number;
  private readonly klinePollMs: number;

  // Track last applied order book sequence to drop stale WS messages
  private lastOrderBookOffset: number = 0;
  private lastOrderBookTimestamp: number = 0;

  constructor(options: LighterGatewayOptions) {
    this.displaySymbol = options.symbol;
    this.marketSymbol = (options.marketSymbol ?? options.symbol).toUpperCase();
    this.environment = inferEnvironment(options.environment, options.baseUrl);
    const host = options.baseUrl ?? LIGHTER_HOSTS[this.environment]?.rest;
    if (!host) {
      throw new Error(`Unknown Lighter environment ${this.environment}`);
    }
    const wsHost = LIGHTER_HOSTS[this.environment]?.ws;
    if (!wsHost) {
      throw new Error(`WebSocket endpoint not configured for env ${this.environment}`);
    }
    this.wsUrl = wsHost;
    this.http = new LighterHttpClient({ baseUrl: host });
    this.signer = new LighterSigner({
      accountIndex: options.accountIndex,
      chainId: options.chainId ?? (this.environment === "mainnet" ? 304 : 300),
      apiKeys: options.apiKeys,
      baseUrl: host,
    });
    this.apiKeyIndices = options.apiKeyIndices ?? Object.keys(options.apiKeys).map(Number);
    this.nonceManager = new HttpNonceManager({
      accountIndex: options.accountIndex,
      apiKeyIndices: this.apiKeyIndices,
      http: this.http,
    });
    const debugEnabled = process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true";
    this.logger = options.logger ?? ((context, error) => {
      if (debugEnabled) {
        // eslint-disable-next-line no-console
        console.error(`[LighterGateway] ${context}`, error);
      }
    });
    this.marketId = options.marketId != null ? Number(options.marketId) : null;
    this.priceDecimals = options.priceDecimals ?? null;
    this.sizeDecimals = options.sizeDecimals ?? null;
    this.tickerPollMs = options.tickerPollMs ?? DEFAULT_TICKER_POLL_MS;
    this.klinePollMs = options.klinePollMs ?? DEFAULT_KLINE_POLL_MS;
    this.l1Address = options.l1Address ?? null;
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    if (!this.connectPromise) {
      this.connectPromise = this.initialize().catch((error) => {
        this.connectPromise = null;
        throw error;
      });
    }
    await this.connectPromise;
    this.initialized = true;
  }

  onAccount(handler: AccountListener): void {
    this.accountEvent.add(handler);
  }

  onOrders(handler: OrderListener): void {
    this.ordersEvent.add(handler);
  }

  onDepth(handler: DepthListener): void {
    this.depthEvent.add(handler);
  }

  onTicker(handler: TickerListener): void {
    this.tickerEvent.add(handler);
  }

  onKlines(handler: KlineListener): void {
    this.klinesEvent.add(handler);
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized();
    const conversion = this.mapCreateOrderParams(params);
    const { baseAmountScaledString, priceScaledString, triggerPriceScaledString, ...signParams } = conversion;
    const { apiKeyIndex, nonce } = this.nonceManager.next();
    try {
      const signed = await this.signer.signCreateOrder({
        ...signParams,
        apiKeyIndex,
        nonce,
      });
      if (!this.loggedCreateOrderPayload) {
        if (process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true") {
          this.logger("createOrder.txInfo", signed.txInfo);
        }
        this.loggedCreateOrderPayload = true;
      }
      const auth = await this.ensureAuthToken();
      const response = await this.http.sendTransaction(signed.txType, signed.txInfo, {
        authToken: auth,
        priceProtection: false,
      });
      if (process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true") {
        this.logger("createOrder.sendTx.response", response);
      }
      return lighterOrderToAster(this.displaySymbol, {
        order_index: Number(signParams.clientOrderIndex % 1_000_000_000n),
        client_order_index: Number(signParams.clientOrderIndex),
        market_index: signParams.marketIndex,
        initial_base_amount: baseAmountScaledString,
        remaining_base_amount: baseAmountScaledString,
        price: priceScaledString,
        trigger_price: triggerPriceScaledString,
        is_ask: signParams.isAsk === 1,
        side: signParams.isAsk === 1 ? "sell" : "buy",
        type: params.type?.toLowerCase(),
        reduce_only: signParams.reduceOnly === 1,
        status: "NEW",
        created_at: Date.now(),
      } as LighterOrder);
    } catch (error) {
      this.nonceManager.acknowledgeFailure(apiKeyIndex);
      this.logger("createOrder", error);
      throw error;
    }
  }

  async cancelOrder(params: { marketIndex?: number; orderId: number | string; apiKeyIndex?: number }): Promise<void> {
    await this.ensureInitialized();
    const marketIndex = params.marketIndex ?? this.marketId;
    if (marketIndex == null) throw new Error("Market index unknown");
    const indexValue = BigInt(typeof params.orderId === "string" ? Number(params.orderId) : params.orderId);
    const { apiKeyIndex, nonce } = this.nonceManager.next();
    try {
      const signed = await this.signer.signCancelOrder({
        marketIndex,
        orderIndex: indexValue,
        nonce,
        apiKeyIndex,
      });
      const auth = await this.ensureAuthToken();
      await this.http.sendTransaction(signed.txType, signed.txInfo, { authToken: auth });
    } catch (error) {
      this.nonceManager.acknowledgeFailure(apiKeyIndex);
      throw error;
    }
  }

  async cancelAllOrders(params?: { timeInForce?: number; scheduleMs?: number; apiKeyIndex?: number }): Promise<void> {
    await this.ensureInitialized();
    const timeInForce = params?.timeInForce ?? 0;
    const time = params?.scheduleMs != null ? BigInt(params.scheduleMs) : 0n;
    const { apiKeyIndex, nonce } = this.nonceManager.next();
    try {
      const signed = await this.signer.signCancelAll({
        timeInForce,
        scheduledTime: time,
        nonce,
        apiKeyIndex,
      });
      const auth = await this.ensureAuthToken();
      await this.http.sendTransaction(signed.txType, signed.txInfo, { authToken: auth });
    } catch (error) {
      this.nonceManager.acknowledgeFailure(apiKeyIndex);
      throw error;
    }
  }

  private async initialize(): Promise<void> {
    await this.loadMetadata();
    await this.nonceManager.init(true);
    await this.refreshAccountSnapshot();
    await this.openWebSocket();
    // Emit an initial empty orders snapshot so strategies depending on an order
    // snapshot at startup can proceed even if the websocket does not publish
    // orders until there is activity.
    this.emitOrders();
    this.startPolling();
  }

  private async loadMetadata(): Promise<void> {
    if (this.marketId != null && this.priceDecimals != null && this.sizeDecimals != null) return;
    const books = await this.http.getOrderBooks();
    const desiredSymbol = this.marketSymbol;
    let target = books.find((book) => (book.symbol ? String(book.symbol).toUpperCase() : "") === desiredSymbol);
    if (!target && this.marketId != null) {
      target = books.find((book) => Number(book.market_id) === Number(this.marketId));
    }
    if (!target) {
      if (this.marketId != null && this.priceDecimals != null && this.sizeDecimals != null) {
        return;
      }
      throw new Error(`Symbol ${desiredSymbol} not listed on Lighter order books`);
    }
    this.marketId = Number(target.market_id);
    if (this.priceDecimals == null) {
      this.priceDecimals = target.supported_price_decimals;
    }
    if (this.sizeDecimals == null) {
      this.sizeDecimals = target.supported_size_decimals;
    }
  }

  private async refreshAccountSnapshot(): Promise<void> {
    try {
      const auth = await this.ensureAuthToken();
      let details: LighterAccountDetails | null = null;
      if (this.l1Address) {
        details = await this.http.getAccountDetails(Number(this.signer.accountIndex), auth, {
          by: "l1_address",
          value: this.l1Address,
        });
      }
      if (!details) {
        details = await this.http.getAccountDetails(Number(this.signer.accountIndex), auth, {
          by: "index",
          value: Number(this.signer.accountIndex),
        });
      }
      if (details) {
        this.accountDetails = details;
        this.emitAccount();
      } else {
        // Fallback: emit an empty account snapshot so strategies can proceed
        this.accountDetails = {
          account_index: Number(this.signer.accountIndex),
          status: 1,
          collateral: "0",
          available_balance: "0",
        } as LighterAccountDetails;
        this.positions = [];
        this.emitAccount();
      }
    } catch (error) {
      this.logger("refreshAccount", error);
    }
  }

  private async openWebSocket(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;
      const cleanup = () => {
        ws.removeAllListeners();
      };
      ws.on("open", async () => {
        try {
          await this.subscribeChannels();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      ws.on("message", (data) => this.handleMessage(data));
      ws.on("close", (code, reason) => {
        cleanup();
        this.scheduleReconnect();
      });
      ws.on("error", (error) => {
        cleanup();
        this.logger("ws:error", error);
      });
    });
  }

  private async subscribeChannels(): Promise<void> {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const marketId = this.marketId;
    if (marketId == null) throw new Error("Market ID unknown");
    ws.send(JSON.stringify({ type: "subscribe", channel: `order_book/${marketId}` }));
    ws.send(JSON.stringify({ type: "subscribe", channel: `account_all/${Number(this.signer.accountIndex)}` }));
    const auth = await this.ensureAuthToken();
    // Subscribe to per-market account updates to receive timely position changes
    ws.send(
      JSON.stringify({
        type: "subscribe",
        channel: `account_market/${Number(marketId)}/${Number(this.signer.accountIndex)}`,
        auth,
      })
    );
    ws.send(
      JSON.stringify({
        type: "subscribe",
        channel: `account_all_orders/${Number(this.signer.accountIndex)}`,
        auth,
      })
    );
  }

  private async ensureAuthToken(): Promise<string> {
    const now = Date.now();
    if (this.auth.token && now < this.auth.expiresAt - DEFAULT_AUTH_TOKEN_BUFFER_MS) {
      return this.auth.token;
    }
    const deadline = now + 10 * 60 * 1000; // 10 minutes horizon
    const token = await this.signer.createAuthToken(deadline);
    this.auth.token = token;
    this.auth.expiresAt = deadline;
    return token;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.openWebSocket().catch((error) => this.logger("reconnect", error));
    }, 2000);
  }

  private handleMessage(data: WebSocket.RawData): void {
    try {
      const text = typeof data === "string" ? data : data.toString("utf8");
      const message = JSON.parse(text);
      const type = message?.type;
      switch (type) {
        case "connected":
          break;
        case "subscribed/order_book":
          this.handleOrderBookSnapshot(message);
          break;
        case "update/order_book":
          this.handleOrderBookUpdate(message);
          break;
        case "subscribed/account_all":
        case "update/account_all":
          this.handleAccountAll(message);
          break;
        case "subscribed/account_market":
        case "update/account_market":
          this.handleAccountMarket(message);
          break;
        case "subscribed/account_all_orders":
        case "update/account_all_orders":
          this.handleAccountOrders(message);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger("ws:message", error);
    }
  }

  private handleOrderBookSnapshot(message: any): void {
    if (!message?.order_book) return;
    const incomingOffset = Number(message.offset ?? message.order_book?.offset ?? 0);
    const incomingTs = Number(message.timestamp ?? 0);
    if (this.lastOrderBookOffset && incomingOffset && incomingOffset < this.lastOrderBookOffset) {
      return;
    }
    if (incomingOffset === this.lastOrderBookOffset && incomingTs && incomingTs <= this.lastOrderBookTimestamp) {
      return;
    }
    const snapshot: LighterOrderBookSnapshot = {
      market_id: this.marketId ?? 0,
      offset: message.order_book.offset ?? Date.now(),
      bids: sortAndTrimLevels(normalizeLevels(message.order_book.bids ?? []), "bid"),
      asks: sortAndTrimLevels(normalizeLevels(message.order_book.asks ?? []), "ask"),
    };
    this.orderBook = snapshot;
    this.lastOrderBookOffset = snapshot.offset ?? incomingOffset ?? this.lastOrderBookOffset;
    this.lastOrderBookTimestamp = incomingTs || Date.now();
    this.emitDepth();
  }

  private handleOrderBookUpdate(message: any): void {
    if (!this.orderBook) return;
    const incomingOffset = Number(message.offset ?? message.order_book?.offset ?? 0);
    const incomingTs = Number(message.timestamp ?? 0);
    if (this.lastOrderBookOffset && incomingOffset && incomingOffset < this.lastOrderBookOffset) {
      return;
    }
    if (incomingOffset === this.lastOrderBookOffset && incomingTs && incomingTs <= this.lastOrderBookTimestamp) {
      return;
    }
    const update = message?.order_book;
    if (!update) return;
    if (Array.isArray(update.asks)) {
      const asks = normalizeLevels(update.asks);
      this.orderBook.asks = sortAndTrimLevels(mergeLevels(this.orderBook.asks ?? [], asks), "ask");
    }
    if (Array.isArray(update.bids)) {
      const bids = normalizeLevels(update.bids);
      this.orderBook.bids = sortAndTrimLevels(mergeLevels(this.orderBook.bids ?? [], bids), "bid");
    }
    this.orderBook.offset = update.offset ?? this.orderBook.offset;
    this.lastOrderBookOffset = Number(this.orderBook.offset ?? incomingOffset ?? this.lastOrderBookOffset);
    this.lastOrderBookTimestamp = incomingTs || Date.now();
    this.emitDepth();
  }

  private handleAccountAll(message: any): void {
    if (!message) return;
    // account_all may be partial; merge provided markets into existing positions
    if (Object.prototype.hasOwnProperty.call(message, "positions")) {
      const positionsObject = message.positions ?? {};
      const incoming: LighterPosition[] = (Array.isArray(positionsObject)
        ? (positionsObject as LighterPosition[])
        : (Object.values(positionsObject) as LighterPosition[])) as LighterPosition[];

      const byMarket = new Map<number, LighterPosition>();
      for (const p of this.positions ?? []) {
        const mid = Number(p.market_id);
        if (Number.isFinite(mid)) byMarket.set(mid, p);
      }
      for (const p of incoming) {
        const mid = Number(p.market_id);
        if (!Number.isFinite(mid)) continue;
        const sign = Number(p.sign ?? 0);
        const size = Number(p.position ?? 0);
        if (sign === 0 || Math.abs(size) < 1e-12) {
          byMarket.delete(mid);
        } else {
          byMarket.set(mid, p);
        }
      }
      this.positions = Array.from(byMarket.values());
    }
    this.emitAccount();
  }

  private handleAccountMarket(message: any): void {
    if (!message) return;
    const position: LighterPosition | undefined = message.position as LighterPosition | undefined;
    if (!position || !Number.isFinite(Number(position.market_id))) return;
    const marketId = Number(position.market_id);
    const sign = Number(position.sign ?? 0);
    const size = Number(position.position ?? 0);
    const shouldRemove = sign === 0 || Math.abs(size) < 1e-12;
    if (shouldRemove) {
      this.positions = (this.positions ?? []).filter((p) => Number(p.market_id) !== marketId);
    } else {
      let updated = false;
      this.positions = (this.positions ?? []).map((p) => {
        if (Number(p.market_id) === marketId) {
          updated = true;
          return position;
        }
        return p;
      });
      if (!updated) this.positions.push(position);
    }
    this.emitAccount();
  }

  private handleAccountOrders(message: any): void {
    if (!message) return;
    const ordersObject = message.orders ?? {};
    const buckets = Object.values(ordersObject) as unknown[];
    const allOrders: LighterOrder[] = buckets.flatMap((entry) => Array.isArray(entry) ? (entry as LighterOrder[]) : []);
    const terminalStatuses = new Set(["filled", "canceled", "cancelled", "expired"]);
    for (const order of allOrders) {
      const key = String(order.order_index ?? order.order_id ?? order.client_order_index ?? "");
      const status = (order.status ?? "").toLowerCase();
      if (!key) continue;
      if (terminalStatuses.has(status)) {
        this.orderMap.delete(key);
      } else {
        this.orderMap.set(key, order);
      }
    }
    this.orders = Array.from(this.orderMap.values());
    const mapped = toOrders(this.displaySymbol, this.orders);
    this.ordersEvent.emit(mapped);
  }

  private emitDepth(): void {
    if (!this.orderBook || this.marketId == null) return;
    const depth = toDepth(this.displaySymbol, this.orderBook);
    this.depthEvent.emit(depth);
    this.emitSyntheticTicker();
  }

  private emitAccount(): void {
    if (!this.accountDetails) return;
    const snapshot = toAccountSnapshot(
      this.displaySymbol,
      this.accountDetails,
      this.positions,
      [],
      { marketSymbol: this.marketSymbol, marketId: this.marketId }
    );
    this.accountEvent.emit(snapshot);
  }

  private emitOrders(): void {
    const mapped = toOrders(this.displaySymbol, this.orders ?? []);
    this.ordersEvent.emit(mapped);
  }

  private startPolling(): void {
    if (!this.pollers.ticker) {
      this.pollers.ticker = setInterval(() => {
        this.refreshTicker().catch((error) => this.logger("ticker", error));
      }, this.tickerPollMs);
      void this.refreshTicker();
    }
  }

  private async refreshTicker(): Promise<void> {
    try {
      const stats = await this.http.getExchangeStats();
      const marketId = this.marketId;
      if (marketId == null) return;
      const match = stats.find(
        (entry) => Number(entry.market_id) === marketId || (entry.symbol ? entry.symbol.toUpperCase() : "") === this.marketSymbol
      );
      if (!match) return;
      const ticker = toTicker(this.displaySymbol, match);
      this.tickerEvent.emit(ticker);
      this.loggedCreateOrderPayload = false;
    } catch (error) {
      this.logger("refreshTicker", error);
    }
  }

  watchKlines(interval: string, handler: KlineListener): void {
    this.klinesEvent.add(handler);
    const cached = this.klineCache.get(interval);
    if (cached) {
      handler(cloneKlines(cached));
    }
    const existing = this.pollers.klines.get(interval);
    if (!existing) {
      const poll = () => {
        void this.refreshKlines(interval).catch((error) => this.logger("klines", error));
      };
      const timer = setInterval(poll, this.klinePollMs);
      this.pollers.klines.set(interval, timer);
      poll();
    }
  }

  private async refreshKlines(interval: string): Promise<void> {
    await this.ensureInitialized();
    const marketId = this.marketId;
    if (marketId == null) return;
    const resolutionMs = RESOLUTION_MS[interval];
    if (!resolutionMs) return;
    const end = Date.now();
    const count = Math.max(KLINE_DEFAULT_COUNT, 200);
    const start = end - resolutionMs * count;
    const startTs = Math.max(0, Math.floor(start));
    const endTs = Math.max(startTs + resolutionMs, Math.floor(end));
    const raw = await this.http.getCandlesticks({
      marketId,
      resolution: interval,
      countBack: count,
      endTimestamp: endTs,
      startTimestamp: startTs,
      setTimestampToEnd: true,
    });
    const sorted = (raw as LighterKline[]).slice().sort((a, b) => a.start_timestamp - b.start_timestamp);
    const mapped = toKlines(this.displaySymbol, interval, sorted);
    this.klineCache.set(interval, mapped);
    this.klinesEvent.emit(cloneKlines(mapped));
    this.emitSyntheticTicker();
  }

  private emitSyntheticTicker(): void {
    if (!this.orderBook) return;
    const bestBid = getBestPrice(this.orderBook.bids, "bid");
    const bestAsk = getBestPrice(this.orderBook.asks, "ask");
    if (bestBid == null && bestAsk == null) return;
    const last = bestBid != null && bestAsk != null ? (bestBid + bestAsk) / 2 : (bestBid ?? bestAsk ?? 0);
    const ticker: AsterTicker = {
      symbol: this.displaySymbol,
      eventType: "lighterSyntheticTicker",
      eventTime: Date.now(),
      lastPrice: last.toString(),
      openPrice: (bestBid ?? last).toString(),
      highPrice: (bestAsk ?? last).toString(),
      lowPrice: (bestBid ?? last).toString(),
      volume: "0",
      quoteVolume: "0",
      priceChange: undefined,
      priceChangePercent: undefined,
      weightedAvgPrice: undefined,
      lastQty: undefined,
      openTime: Date.now(),
      closeTime: Date.now(),
      firstId: undefined,
      lastId: undefined,
      count: undefined,
    };
    this.tickerEvent.emit(ticker);
  }

  private mapCreateOrderParams(params: CreateOrderParams): Omit<CreateOrderSignParams, "nonce"> & {
    baseAmountScaledString: string;
    priceScaledString: string;
    triggerPriceScaledString: string;
    clientOrderIndex: bigint;
  } {
    if (this.marketId == null || this.priceDecimals == null || this.sizeDecimals == null) {
      throw new Error("Lighter market metadata not initialized");
    }
    if (params.quantity == null || !Number.isFinite(params.quantity)) {
      throw new Error("Lighter orders require quantity");
    }
    const side = params.side;
    const isAsk = side === "SELL" ? 1 : 0;
    const baseAmount = decimalToScaled(params.quantity, this.sizeDecimals);
    const baseAmountScaledString = scaledToDecimalString(baseAmount, this.sizeDecimals);
    const clientOrderIndex = BigInt(Date.now() % Number.MAX_SAFE_INTEGER);
    let priceScaled = params.price != null ? decimalToScaled(params.price, this.priceDecimals) : null;
    if ((params.type === "MARKET" || params.type === "STOP_MARKET") && priceScaled == null) {
      priceScaled = decimalToScaled(this.estimateMarketPrice(side), this.priceDecimals);
    }
    if (priceScaled == null) {
      throw new Error("Lighter order requires price");
    }
    const reduceOnly = params.reduceOnly === "true" || params.closePosition === "true" ? 1 : 0;
    const resultType = mapOrderType(params.type ?? "LIMIT");
    const resultTimeInForce = mapTimeInForce(params.timeInForce, params.type ?? "LIMIT");
    let triggerPriceScaled = 0n;
    if (params.stopPrice != null) {
      triggerPriceScaled = decimalToScaled(params.stopPrice, this.priceDecimals);
    }
    // Align with chain expectations:
    // - Pure MARKET orders use immediate expiry (0)
    // - STOP orders rest until trigger, so they require an absolute future expiry
    // - All other orders use absolute future timestamp (ms) for ~28 days
    const TWENTY_EIGHT_DAYS_MS = 28 * 24 * 60 * 60 * 1000;
    const isImmediate = resultType === LIGHTER_ORDER_TYPE.MARKET;
    const orderExpiry = isImmediate
      ? BigInt(IMMEDIATE_OR_CANCEL_EXPIRY_PLACEHOLDER)
      : BigInt(Date.now() + TWENTY_EIGHT_DAYS_MS);

    return {
      marketIndex: this.marketId,
      clientOrderIndex,
      baseAmount,
      baseAmountScaledString,
      price: Number(priceScaled),
      priceScaledString: scaledToDecimalString(priceScaled, this.priceDecimals),
      isAsk,
      orderType: resultType,
      timeInForce: resultTimeInForce,
      reduceOnly,
      triggerPrice: Number(triggerPriceScaled),
      triggerPriceScaledString: scaledToDecimalString(triggerPriceScaled, this.priceDecimals),
      orderExpiry,
      expiredAt: BigInt(Date.now() + 10 * 60 * 1000),
    };
  }

  private estimateMarketPrice(side: OrderSide): number {
    if (this.orderBook) {
      const levels = side === "SELL" ? this.orderBook.bids : this.orderBook.asks;
      if (levels && levels.length) {
        const sorted = [...levels].sort((a, b) => {
          const aPrice = Number(a.price);
          const bPrice = Number(b.price);
          return side === "SELL" ? bPrice - aPrice : aPrice - bPrice;
        });
        const level = sorted[0];
        if (level) return Number(level.price);
      }
    }
    if (this.ticker) {
      return Number(this.ticker.last_trade_price);
    }
    throw new Error("Unable to determine market price for order");
  }
}

function mergeLevels(existing: LighterOrderBookLevel[], updates: LighterOrderBookLevel[]): LighterOrderBookLevel[] {
  const map = new Map<string, string>();
  for (const level of existing) {
    map.set(level.price, level.size);
  }
  for (const update of updates) {
    if (Number(update.size) <= 0) {
      map.delete(update.price);
    } else {
      map.set(update.price, update.size);
    }
  }
  return Array.from(map.entries()).map(([price, size]) => ({ price, size } as LighterOrderBookLevel));
}

function cloneKlines(klines: AsterKline[]): AsterKline[] {
  return klines.map((kline) => ({ ...kline }));
}

function getBestPrice(levels: LighterOrderBookLevel[] | Array<any> | undefined, side: "bid" | "ask"): number | null {
  if (!levels || !levels.length) return null;
  const sorted = levels
    .map((level) => {
      if (Array.isArray(level)) return Number(level[0]);
      return Number((level as LighterOrderBookLevel).price);
    })
    .filter((price) => Number.isFinite(price));
  if (!sorted.length) return null;
  return side === "bid" ? Math.max(...sorted) : Math.min(...sorted);
}

function normalizeLevels(raw: Array<LighterOrderBookLevel | [string | number, string | number]>): LighterOrderBookLevel[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (Array.isArray(entry)) {
        const price = String(entry[0]);
        const size = String(entry[1]);
        return { price, size } as LighterOrderBookLevel;
      }
      const obj = entry as LighterOrderBookLevel;
      return { price: String(obj.price), size: String(obj.size) } as LighterOrderBookLevel;
    })
    .filter((lvl) => lvl.price != null && lvl.size != null);
}

// Ensure correct side ordering and limit depth size
function sortAndTrimLevels(
  levels: LighterOrderBookLevel[] | undefined,
  side: "bid" | "ask",
  limit: number = 200
): LighterOrderBookLevel[] {
  const list = Array.isArray(levels) ? levels.slice() : [];
  list.sort((a, b) => {
    const pa = Number(a.price);
    const pb = Number(b.price);
    if (!Number.isFinite(pa) || !Number.isFinite(pb)) return 0;
    return side === "bid" ? pb - pa : pa - pb;
  });
  return list.slice(0, Math.max(1, limit));
}

function mapOrderType(type: OrderType): number {
  switch (type) {
    case "MARKET":
      return LIGHTER_ORDER_TYPE.MARKET;
    case "STOP_MARKET":
      return LIGHTER_ORDER_TYPE.STOP_LOSS;
    default:
      return LIGHTER_ORDER_TYPE.LIMIT;
  }
}

function mapTimeInForce(timeInForce: string | undefined, type: OrderType): number {
  // Lighter expects STOP orders to be immediate-or-cancel at trigger time.
  // Force IOC for MARKET and STOP_MARKET to satisfy chain validation.
  if (type === "MARKET" || type === "STOP_MARKET") {
    return LIGHTER_TIME_IN_FORCE.IMMEDIATE_OR_CANCEL;
  }
  const value = (timeInForce ?? "GTC").toUpperCase();
  switch (value) {
    case "IOC":
      return LIGHTER_TIME_IN_FORCE.IMMEDIATE_OR_CANCEL;
    case "GTX":
      return LIGHTER_TIME_IN_FORCE.POST_ONLY;
    default:
      return LIGHTER_TIME_IN_FORCE.GOOD_TILL_TIME;
  }
}
