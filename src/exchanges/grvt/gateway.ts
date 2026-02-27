import { setInterval, clearInterval } from "timers";
import { randomInt } from "crypto";
import axios, { AxiosHeaders } from "axios";
import { TDG, MDG } from "@grvt/client";
import { WS, EStream, type TWSRequest } from "@grvt/client/ws";
import { ECandlestickInterval } from "@grvt/client/interfaces/codegen/enums/candlestick-interval";
import { ECandlestickType } from "@grvt/client/interfaces/codegen/enums/candlestick-type";
import { ETimeInForce } from "@grvt/client/interfaces/codegen/enums/time-in-force";
import { ETriggerType } from "@grvt/client/interfaces/codegen/enums/trigger-type";
import { ETriggerBy } from "@grvt/client/interfaces/codegen/enums/trigger-by";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from "ethereum-cryptography/utils";
import { extractMessage } from "../../utils/errors";
import type {
  IApiSubAccountSummaryResponse,
  IApiPositionsResponse,
  IApiOpenOrdersResponse,
  IApiOrderbookLevelsResponse,
  IApiTickerResponse,
  IApiCandlestickResponse,
  IApiCreateOrderResponse,
  IOrder,
} from "@grvt/client/interfaces";
import type {
  AsterAccountSnapshot,
  AsterAccountPosition,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
  OrderSide,
  GrvtSignedOrder,
  GrvtSignature,
  GrvtUnsignedOrder,
  GrvtTimeInForce,
  GrvtOrderMetadataInput,
  GrvtTriggerMetadata,
} from "../types";

const DEFAULT_ACCOUNT_POLL_INTERVAL_MS = 5000;
const DEFAULT_ORDERS_POLL_INTERVAL_MS = 2500;
const DEFAULT_DEPTH_POLL_INTERVAL_MS = 400;
const DEFAULT_TICKER_POLL_INTERVAL_MS = 1000;
const DEFAULT_KLINE_POLL_INTERVAL_MS = 15000;

const ENVIRONMENT_HOSTS = {
  prod: {
    trades: "https://trades.grvt.io",
    market: "https://market-data.grvt.io",
    edge: "https://edge.grvt.io",
  },
  testnet: {
    trades: "https://trades.testnet.grvt.io",
    market: "https://market-data.testnet.grvt.io",
    edge: "https://edge.testnet.grvt.io",
  },
  staging: {
    trades: "https://trades.staging.gravitymarkets.io",
    market: "https://market-data.staging.gravitymarkets.io",
    edge: "https://edge.staging.gravitymarkets.io",
  },
  dev: {
    trades: "https://trades.dev.gravitymarkets.io",
    market: "https://market-data.dev.gravitymarkets.io",
    edge: "https://edge.dev.gravitymarkets.io",
  },
} as const;

const ENVIRONMENT_ALIASES: Record<string, keyof typeof ENVIRONMENT_HOSTS> = {
  mainnet: "prod",
  production: "prod",
};

const DEFAULT_MARK_PRICE_TRIGGER = "LAST";
const DEFAULT_TIME_IN_FORCE: GrvtTimeInForce = "GOOD_TILL_TIME";
const TRAILING_NOT_SUPPORTED_ERROR =
  "GRVT exchange adapter does not yet support trailing stop orders";

const CHAIN_IDS: Record<keyof typeof ENVIRONMENT_HOSTS, number> = {
  prod: 325,
  testnet: 326,
  staging: 327,
  dev: 327,
};

const DEFAULT_ORDER_EXPIRY_NS = BigInt(5 * 60) * 1_000_000_000n;

type EIP712Types = Record<string, Array<{ name: string; type: string }>>;

const EIP712_ORDER_TYPES = {
  Order: [
    { name: "subAccountID", type: "uint64" },
    { name: "isMarket", type: "bool" },
    { name: "timeInForce", type: "uint8" },
    { name: "postOnly", type: "bool" },
    { name: "reduceOnly", type: "bool" },
    { name: "legs", type: "OrderLeg[]" },
    { name: "nonce", type: "uint32" },
    { name: "expiration", type: "int64" },
  ],
  OrderLeg: [
    { name: "assetID", type: "uint256" },
    { name: "contractSize", type: "uint64" },
    { name: "limitPrice", type: "uint64" },
    { name: "isBuyingContract", type: "bool" },
  ],
} as const;

const EIP712_DOMAIN_FIELDS = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
] as const;

type BaseEnvironment = keyof typeof ENVIRONMENT_HOSTS;
export type GrvtEnvironment = BaseEnvironment | keyof typeof ENVIRONMENT_ALIASES;

interface GrvtSignContext {
  order: GrvtUnsignedOrder;
  quantity: number;
  price?: number;
  side: OrderSide;
  isMarket: boolean;
  timeInForce: string;
  postOnly: boolean;
  reduceOnly: boolean;
  nonce: number;
  expirationNs: bigint;
  instrument: InstrumentInfo;
  chainId: number;
  subAccountId: string;
}

export interface GrvtSignatureProvider {
  (context: GrvtSignContext): Promise<GrvtSignature>;
}

export interface GrvtHostsOverride {
  trades?: string;
  market?: string;
  edge?: string;
}

export interface GrvtGatewayOptions {
  cookie?: string;
  accountId?: string;
  apiKey?: string;
  apiSecret?: string;
  subAccountId: string;
  instrument: string;
  symbol: string;
  env?: GrvtEnvironment;
  hosts?: GrvtHostsOverride;
  signatureProvider?: GrvtSignatureProvider;
  pollIntervals?: Partial<{
    account: number;
    orders: number;
    depth: number;
    ticker: number;
    klines: number;
  }>;
  logger?: (context: string, error: unknown) => void;
}

interface HostsConfig {
  trades: string;
  market: string;
  edge: string;
}

interface KlineCache {
  interval: string;
  values: AsterKline[];
}

interface InstrumentInfo {
  instrument: string;
  instrumentHash: string;
  baseDecimals: number;
  quoteDecimals: number;
}

interface SessionInfo {
  cookie: string;
  accountId: string;
  expiresAt?: number;
}

const ONE_MILLISECOND_IN_NANOSECONDS = 1_000_000;
const ONE_SECOND_IN_NANOSECONDS = 1_000_000_000;

export class GrvtGateway {
  private readonly tdg: TDG;
  private readonly mdg: MDG;
  private readonly signatureProvider?: GrvtSignatureProvider;
  private readonly logger: (context: string, error: unknown) => void;
  private readonly instrument: string;
  private readonly symbol: string;
  private readonly subAccountId: string;
  private readonly pollIntervals: {
    account: number;
    orders: number;
    depth: number;
    ticker: number;
    klines: number;
  };
  private readonly hosts: HostsConfig;
  private readonly chainId: number;
  private headers: Record<string, string> = {};
  private apiKey?: string;
  private apiSecret?: string;
  private sessionInfo: SessionInfo | null = null;
  private instrumentInfo: InstrumentInfo | null = null;
  private sessionPromise: Promise<void> | null = null;

  private accountSnapshot: AsterAccountSnapshot | null = null;
  private openOrders: AsterOrder[] = [];
  private positions: AsterAccountPosition[] = [];
  private lastPositionsUpdateAt: number = 0;
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private klineCache: KlineCache | null = null;

  // WebSocket state
  private ws: WS | null = null;
  private wsConnected = false;
  private positionsRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  private accountListeners = new Set<(snapshot: AsterAccountSnapshot) => void>();
  private ordersListeners = new Set<(orders: AsterOrder[]) => void>();
  private depthListeners = new Set<(depth: AsterDepth) => void>();
  private tickerListeners = new Set<(ticker: AsterTicker) => void>();
  private klineListeners = new Set<(klines: AsterKline[]) => void>();

  private accountTimer: ReturnType<typeof setInterval> | null = null;
  private ordersTimer: ReturnType<typeof setInterval> | null = null;
  private depthTimer: ReturnType<typeof setInterval> | null = null;
  private tickerTimer: ReturnType<typeof setInterval> | null = null;
  private klineTimer: ReturnType<typeof setInterval> | null = null;

  private initialized = false;
  private klineInterval: ECandlestickInterval = ECandlestickInterval.CI_1_M;

  constructor(options: GrvtGatewayOptions) {
    const envKey = normalizeEnvironment(options.env);
    this.hosts = resolveHosts(envKey, options.hosts);
    this.chainId = CHAIN_IDS[envKey];
    this.tdg = new TDG({ host: this.hosts.trades });
    this.mdg = new MDG({ host: this.hosts.market });
    this.subAccountId = options.subAccountId;
    this.instrument = options.instrument;
    this.symbol = options.symbol;
    this.signatureProvider = options.signatureProvider;
    this.logger = options.logger ?? defaultLogger;
    this.pollIntervals = {
      account: options.pollIntervals?.account ?? DEFAULT_ACCOUNT_POLL_INTERVAL_MS,
      orders: options.pollIntervals?.orders ?? DEFAULT_ORDERS_POLL_INTERVAL_MS,
      depth: options.pollIntervals?.depth ?? DEFAULT_DEPTH_POLL_INTERVAL_MS,
      ticker: options.pollIntervals?.ticker ?? DEFAULT_TICKER_POLL_INTERVAL_MS,
      klines: options.pollIntervals?.klines ?? DEFAULT_KLINE_POLL_INTERVAL_MS,
    };
    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret ?? undefined;

    if (options.cookie && options.accountId) {
      const normalizedCookie = normalizeCookieValue(options.cookie);
      this.sessionInfo = {
        cookie: normalizedCookie,
        accountId: options.accountId,
      };
      this.updateHeaders();
    }

    this.tdg.axios.interceptors.request.use(async (config) => {
      await this.ensureSession();
      const existing =
        config.headers instanceof AxiosHeaders ? config.headers.toJSON() : config.headers ?? {};
      const merged = AxiosHeaders.from(existing);
      for (const [key, value] of Object.entries(this.headers)) {
        merged.set(key, value);
      }
      config.headers = merged;
      return config;
    });

    this.mdg.axios.interceptors.request.use(async (config) => {
      await this.ensureSession();
      const existing =
        config.headers instanceof AxiosHeaders ? config.headers.toJSON() : config.headers ?? {};
      const merged = AxiosHeaders.from(existing);
      for (const [key, value] of Object.entries(this.headers)) {
        merged.set(key, value);
      }
      config.headers = merged;
      return config;
    });
  }

  async ensureInitialized(klineInterval: string): Promise<void> {
    if (this.initialized) return;
    this.klineInterval = mapIntervalToGrvt(klineInterval);
    await this.ensureSession();
    await this.loadInstrumentInfo();
    await Promise.all([
      this.refreshAccountSnapshot(),
      this.refreshOpenOrders(),
      this.refreshPositions(),
      this.refreshDepth(),
      this.refreshTicker(),
      this.refreshKlines(),
    ]);
    this.startPolling();
    this.startWebsocket();
    this.initialized = true;
  }

  onAccount(listener: (snapshot: AsterAccountSnapshot) => void): () => void {
    this.accountListeners.add(listener);
    if (this.accountSnapshot) listener(cloneAccount(this.accountSnapshot));
    return () => {
      this.accountListeners.delete(listener);
    };
  }

  onOrders(listener: (orders: AsterOrder[]) => void): () => void {
    this.ordersListeners.add(listener);
    if (this.openOrders.length) listener(cloneOrders(this.openOrders));
    return () => {
      this.ordersListeners.delete(listener);
    };
  }

  onDepth(listener: (depth: AsterDepth) => void): () => void {
    this.depthListeners.add(listener);
    if (this.depthSnapshot) listener(cloneDepth(this.depthSnapshot));
    return () => {
      this.depthListeners.delete(listener);
    };
  }

  onTicker(listener: (ticker: AsterTicker) => void): () => void {
    this.tickerListeners.add(listener);
    if (this.tickerSnapshot) listener(cloneTicker(this.tickerSnapshot));
    return () => {
      this.tickerListeners.delete(listener);
    };
  }

  onKlines(listener: (klines: AsterKline[]) => void): () => void {
    this.klineListeners.add(listener);
    if (this.klineCache) listener(cloneKlines(this.klineCache.values));
    return () => {
      this.klineListeners.delete(listener);
    };
  }

  getAccountSnapshot(): AsterAccountSnapshot | null {
    return this.accountSnapshot ? cloneAccount(this.accountSnapshot) : null;
  }

  getOpenOrders(): AsterOrder[] {
    return cloneOrders(this.openOrders);
  }

  getPositions(): AsterAccountPosition[] {
    return this.positions.map((position) => ({ ...position }));
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    if (params.type === "TRAILING_STOP_MARKET") {
      throw new Error(TRAILING_NOT_SUPPORTED_ERROR);
    }

    await this.ensureSession();
    await this.loadInstrumentInfo();

    const { order: unsignedOrder, signing } = buildUnsignedOrder({
      params,
      instrument: this.instrument,
      subAccountId: this.subAccountId,
    });

    const nonce = randomInt(0, 2 ** 32);
    const expirationNs = this.computeExpirationNs();
    const instrumentInfo = this.instrumentInfo;
    if (!instrumentInfo) {
      throw new Error("GRVT instrument metadata not available");
    }

    const signContext: GrvtSignContext = {
      order: unsignedOrder,
      quantity: signing.quantity,
      price: signing.price,
      side: signing.side,
      isMarket: signing.isMarket,
      timeInForce: signing.timeInForce,
      postOnly: signing.postOnly,
      reduceOnly: signing.reduceOnly,
      nonce,
      expirationNs,
      instrument: instrumentInfo,
      chainId: this.chainId,
      subAccountId: this.subAccountId,
    };

    const signature = this.signatureProvider
      ? await this.signatureProvider(signContext)
      : await this.signWithPrivateKey(signContext);

    if (!signature.expiration) {
      signature.expiration = expirationNs.toString();
    }
    if (signature.nonce == null) {
      signature.nonce = nonce;
    }
    if (!signature.r || !signature.s || typeof signature.v !== "number") {
      throw new Error("Invalid signature returned for GRVT order");
    }

    const signedOrder: GrvtSignedOrder = { ...unsignedOrder, signature };

    try {
      const response = await this.tdg.createOrder({ order: toApiOrderPayload(signedOrder) });
      const order = mapCreateOrderResponse(response, this.symbol);
      this.mergeOrder(order);
      if (signedOrder.reduce_only) {
        void this.refreshPositions().catch((error) => this.logger("postOrderPositionRefresh", error));
      }
      return order;
    } catch (error) {
      const payload = {
        code: (error as any)?.response?.data?.code,
        message: (error as any)?.response?.data?.message,
      };
      this.logger("createOrder", { error: extractMessage(error), payload });
      const detail = [payload.code, payload.message].filter(Boolean).join(": ");
      throw new Error(detail || extractMessage(error));
    }
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    const orderId = String(params.orderId);
    await this.tdg.cancelOrder({ sub_account_id: this.subAccountId, order_id: orderId });
    this.removeOrder(orderId);
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await Promise.all(
      params.orderIdList.map((orderId) =>
        this.tdg
          .cancelOrder({ sub_account_id: this.subAccountId, order_id: String(orderId) })
          .catch((error) => {
            this.logger("cancelOrders", error);
          })
      )
    );
    params.orderIdList.forEach((orderId) => this.removeOrder(String(orderId)));
  }

  async cancelAllOrders(): Promise<void> {
    const current = [...this.openOrders];
    await this.cancelOrders({ symbol: this.symbol, orderIdList: current.map((o) => o.orderId) });
  }

  private startPolling(): void {
    this.stopPolling();
    this.accountTimer = setInterval(() => {
      void this.refreshAccountSnapshot().catch((error) => this.logger("accountPoll", error));
      void this.refreshPositions().catch((error) => this.logger("positionPoll", error));
    }, this.pollIntervals.account);

    this.ordersTimer = setInterval(() => {
      void this.refreshOpenOrders().catch((error) => this.logger("ordersPoll", error));
    }, this.pollIntervals.orders);

    this.depthTimer = setInterval(() => {
      void this.refreshDepth().catch((error) => this.logger("depthPoll", error));
    }, this.pollIntervals.depth);

    this.tickerTimer = setInterval(() => {
      void this.refreshTicker().catch((error) => this.logger("tickerPoll", error));
    }, this.pollIntervals.ticker);

    this.klineTimer = setInterval(() => {
      void this.refreshKlines().catch((error) => this.logger("klinePoll", error));
    }, this.pollIntervals.klines);
  }

  private stopPolling(): void {
    if (this.accountTimer) {
      clearInterval(this.accountTimer);
      this.accountTimer = null;
    }
    if (this.ordersTimer) {
      clearInterval(this.ordersTimer);
      this.ordersTimer = null;
    }
    if (this.depthTimer) {
      clearInterval(this.depthTimer);
      this.depthTimer = null;
    }
    if (this.tickerTimer) {
      clearInterval(this.tickerTimer);
      this.tickerTimer = null;
    }
    if (this.klineTimer) {
      clearInterval(this.klineTimer);
      this.klineTimer = null;
    }
  }

  private startWebsocket(): void {
    try {
      if (this.ws) {
        this.ws.disconnect();
        this.ws = null;
      }
      const base = this.hosts.trades.replace(/\/?$/g, "");
      const url = new URL(base.replace(/^http/, "ws") + "/ws/lite");
      // Pass auth as query params (server reads headers/cookies from params per client implementation)
      const params: Record<string, string> = {};
      for (const [key, value] of Object.entries(this.headers)) {
        params[key] = value;
      }
      const ws = new WS({
        url: url.toString(),
        timeout: 10000,
        reconnectStrategy: (retries: number) => {
          const attempt = Math.max(0, retries);
          const base = 1000 * Math.pow(2, Math.min(8, attempt));
          const jitter = Math.floor(Math.random() * 250);
          return Math.min(30000, base + jitter);
        },
      });
      ws.setParams(params);
      ws.onConnect(() => {
        this.wsConnected = true;
        // Prefer WS: pause HTTP position polling when connected
        if (this.accountTimer) {
          clearInterval(this.accountTimer);
          this.accountTimer = null;
        }
        // Subscribe to position/order/state feeds
        const subs: TWSRequest[] = [
          {
            stream: EStream.POSITION,
            params: { sub_account_id: this.subAccountId, instrument: this.instrument },
            onData: () => this.schedulePositionsRefresh(150),
          } as any,
          {
            stream: EStream.ORDER,
            params: { sub_account_id: this.subAccountId, instrument: this.instrument },
            onData: () => this.schedulePositionsRefresh(100),
          } as any,
          {
            stream: EStream.STATE,
            params: { sub_account_id: this.subAccountId, instrument: this.instrument },
            onData: () => this.schedulePositionsRefresh(100),
          } as any,
        ];
        ws.subscribes(...subs);
      });
      ws.onClose(() => {
        this.wsConnected = false;
        // Resume HTTP position polling when WS closes
        if (!this.accountTimer) {
          this.accountTimer = setInterval(() => {
            void this.refreshAccountSnapshot().catch((error) => this.logger("accountPoll", error));
            void this.refreshPositions().catch((error) => this.logger("positionPoll", error));
          }, this.pollIntervals.account);
        }
      });
      ws.onError((e) => {
        this.logger("ws", e);
      });
      ws.connect();
      this.ws = ws;
    } catch (error) {
      this.logger("startWebsocket", error);
    }
  }

  private schedulePositionsRefresh(delayMs: number): void {
    if (this.positionsRefreshTimer) {
      clearTimeout(this.positionsRefreshTimer);
    }
    this.positionsRefreshTimer = setTimeout(() => {
      this.positionsRefreshTimer = null;
      void this.refreshPositions().catch((error) => this.logger("wsPositionsRefresh", error));
    }, Math.max(0, delayMs));
  }

  private async refreshAccountSnapshot(): Promise<void> {
    const response = await this.tdg.subAccountSummary({ sub_account_id: this.subAccountId });
    const snapshot = mapAccountSnapshot(response, this.symbol, this.instrument);
    this.accountSnapshot = snapshot;
    this.emitAccount(snapshot);
  }

  private async refreshPositions(): Promise<void> {
    const response = await this.tdg.positions({ sub_account_id: this.subAccountId });
    const mapped = mapPositions(response, this.symbol, this.instrument);
    const newestEventTime = getNewestPositionEventTime(mapped);
    if (newestEventTime < this.lastPositionsUpdateAt) {
      return;
    }
    this.positions = mapped;
    this.lastPositionsUpdateAt = newestEventTime;
    const snapshot = this.accountSnapshot;
    if (snapshot) {
      snapshot.positions = this.positions.map((position) => ({ ...position }));
      snapshot.totalUnrealizedProfit = sumUnrealized(snapshot.positions).toString();
      this.emitAccount(snapshot);
    }
  }

  private async refreshOpenOrders(): Promise<void> {
    const response = await this.tdg.openOrders({ sub_account_id: this.subAccountId });
    this.openOrders = mapOpenOrders(response, this.symbol);
    this.emitOrders(this.openOrders);
  }

  private async refreshDepth(): Promise<void> {
    try {
      const response = await this.mdg.orderBook({
        instrument: this.instrument,
        depth: 50,
      });
      this.depthSnapshot = mapDepth(response, this.symbol);
    } catch (error) {
      this.logger("depthPoll", error);
      try {
        const fallback = await this.mdg.orderBook({ instrument: this.instrument, depth: 10 });
        this.depthSnapshot = mapDepth(fallback, this.symbol);
      } catch (fallbackError) {
        this.logger("depthPollFallback", fallbackError);
        return;
      }
    }
    if (this.depthSnapshot) this.emitDepth(this.depthSnapshot);
  }

  private async refreshTicker(): Promise<void> {
    const response = await this.mdg.ticker({ instrument: this.instrument });
    this.tickerSnapshot = mapTicker(response, this.symbol);
    if (this.tickerSnapshot) this.emitTicker(this.tickerSnapshot);
  }

  private async refreshKlines(): Promise<void> {
    const response = await this.mdg.candlestick({
      instrument: this.instrument,
      interval: this.klineInterval,
      type: ECandlestickType.TRADE,
      limit: 500,
    });
    const klines = mapKlines(response, this.symbol);
    this.klineCache = { interval: this.klineInterval, values: klines };
    this.emitKlines(klines);
  }

  private mergeOrder(order: AsterOrder): void {
    const index = this.openOrders.findIndex((item) => String(item.orderId) === String(order.orderId));
    if (index >= 0) {
      this.openOrders[index] = order;
    } else {
      this.openOrders.push(order);
    }
    this.emitOrders(this.openOrders);
  }

  private removeOrder(orderId: string): void {
    const before = this.openOrders.length;
    this.openOrders = this.openOrders.filter((item) => String(item.orderId) !== orderId);
    if (this.openOrders.length !== before) {
      this.emitOrders(this.openOrders);
    }
  }

  private emitAccount(snapshot: AsterAccountSnapshot): void {
    const cloned = cloneAccount(snapshot);
    this.accountListeners.forEach((listener) => {
      try {
        listener(cloned);
      } catch (error) {
        this.logger("accountListener", error);
      }
    });
  }

  private emitOrders(orders: AsterOrder[]): void {
    const cloned = cloneOrders(orders);
    this.ordersListeners.forEach((listener) => {
      try {
        listener(cloned);
      } catch (error) {
        this.logger("ordersListener", error);
      }
    });
  }

  private emitDepth(depth: AsterDepth): void {
    const cloned = cloneDepth(depth);
    this.depthListeners.forEach((listener) => {
      try {
        listener(cloned);
      } catch (error) {
        this.logger("depthListener", error);
      }
    });
  }

  private emitTicker(ticker: AsterTicker): void {
    const cloned = cloneTicker(ticker);
    this.tickerListeners.forEach((listener) => {
      try {
        listener(cloned);
      } catch (error) {
        this.logger("tickerListener", error);
      }
    });
  }

  private emitKlines(klines: AsterKline[]): void {
    const cloned = cloneKlines(klines);
    this.klineListeners.forEach((listener) => {
      try {
        listener(cloned);
      } catch (error) {
        this.logger("klinesListener", error);
      }
    });
  }

  private computeExpirationNs(): bigint {
    return BigInt(Date.now()) * 1_000_000n + DEFAULT_ORDER_EXPIRY_NS;
  }

  private isSessionExpired(): boolean {
    if (!this.sessionInfo) return true;
    if (!this.sessionInfo.expiresAt) return false;
    return Date.now() > this.sessionInfo.expiresAt - 5000;
  }

  private async ensureSession(): Promise<void> {
    if (this.sessionInfo && !this.isSessionExpired()) {
      this.updateHeaders();
      return;
    }

    if (this.sessionPromise) {
      await this.sessionPromise;
      return;
    }

    if (!this.apiKey) {
      if (!this.sessionInfo) {
        throw new Error(
          "GRVT authentication requires GRVT_API_KEY or an existing session cookie"
        );
      }
      this.updateHeaders();
      return;
    }

    const promise = this.authenticate();
    this.sessionPromise = promise.finally(() => {
      this.sessionPromise = null;
    });
    await promise;
  }

  private async authenticate(): Promise<void> {
    if (!this.apiKey) {
      throw new Error("GRVT_API_KEY is not configured");
    }
    try {
      const response = await axios.post(
        `${this.hosts.edge}/auth/api_key/login`,
        { api_key: this.apiKey },
        {
          headers: { "Content-Type": "application/json", Cookie: "rm=true;" },
          timeout: 5000,
        }
      );
      const cookieInfo = parseSetCookieHeader(response.headers["set-cookie"]);
      const accountIdHeader =
        (response.headers["x-grvt-account-id"] ?? response.headers["X-Grvt-Account-Id"]) ?? "";
      const accountId = Array.isArray(accountIdHeader)
        ? accountIdHeader[0]?.toString().trim()
        : accountIdHeader?.toString().trim();
      if (!cookieInfo?.cookie || !accountId) {
        throw new Error("GRVT authentication response missing session cookie or account id");
      }
      this.sessionInfo = {
        cookie: cookieInfo.cookie,
        accountId,
        expiresAt: cookieInfo.expiresAt,
      };
      this.updateHeaders();
    } catch (error) {
      this.logger("authenticate", error);
      throw new Error("Failed to authenticate with GRVT using API key");
    }
  }

  private updateHeaders(): void {
    if (!this.sessionInfo) return;
    this.headers = {
      Cookie: this.sessionInfo.cookie,
      "X-Grvt-Account-Id": this.sessionInfo.accountId,
    };
  }

  private async loadInstrumentInfo(): Promise<void> {
    if (this.instrumentInfo) return;
    try {
      const response = await this.mdg.instrument({ instrument: this.instrument });
      const result: any = response?.result;
      if (!result) {
        throw new Error("Empty instrument response");
      }
      const instrumentHashRaw =
        result.instrument_hash ?? result.ih ?? result.instrumentHash ?? result.instrumenthash;
      if (!instrumentHashRaw) {
        throw new Error("Instrument hash not found in response");
      }
      const baseDecimals = Number(result.base_decimals ?? result.bd ?? result.baseDecimals ?? 0);
      const quoteDecimals = Number(result.quote_decimals ?? result.qd ?? result.quoteDecimals ?? 0);
      this.instrumentInfo = {
        instrument: this.instrument,
        instrumentHash: normalizeHex(instrumentHashRaw),
        baseDecimals,
        quoteDecimals,
      };
    } catch (error) {
      this.logger("loadInstrumentInfo", error);
      throw new Error("Unable to load GRVT instrument metadata");
    }
  }

  private async signWithPrivateKey(context: GrvtSignContext): Promise<GrvtSignature> {
    if (!this.apiSecret) {
      throw new Error("GRVT_API_SECRET is not configured for local signing");
    }
    if (context.order.legs.length !== 1) {
      throw new Error("GRVT adapter currently supports only single-leg orders");
    }
    const privateKeyBytes = hexToBytes(padPrivateKey(this.apiSecret));
    const leg = context.order.legs[0];
    if (!leg) {
      throw new Error("GRVT order leg missing for signing");
    }
    const contractSize = scaleDecimal(leg.size, context.instrument.baseDecimals);
    const limitPriceSource =
      leg.limit_price ?? (context.isMarket ? "0" : context.price?.toString() ?? "0");
    const limitPrice = scaleDecimal(limitPriceSource, 9);
    const types: EIP712Types = {
      EIP712Domain: EIP712_DOMAIN_FIELDS.map((field) => ({ ...field })),
      Order: EIP712_ORDER_TYPES.Order.map((field) => ({ ...field })),
      OrderLeg: EIP712_ORDER_TYPES.OrderLeg.map((field) => ({ ...field })),
    };
    const message = {
      subAccountID: BigInt(context.subAccountId),
      isMarket: context.isMarket,
      timeInForce: mapTimeInForceToNumeric(context.timeInForce),
      postOnly: context.postOnly,
      reduceOnly: context.reduceOnly,
      legs: [
        {
          assetID: BigInt(normalizeHex(context.instrument.instrumentHash)),
          contractSize,
          limitPrice,
          isBuyingContract: context.side === "BUY",
        },
      ],
      nonce: BigInt(context.nonce),
      expiration: context.expirationNs,
    };
    const domain = {
      name: "GRVT Exchange",
      version: "0",
      chainId: BigInt(context.chainId),
    };
    const domainHash = hashStruct("EIP712Domain", domain, types);
    const messageHash = hashStruct("Order", message, types);
    const digest = keccak256(
      concatBytes(new Uint8Array([0x19, 0x01]), domainHash, messageHash)
    );
    const signature = secp256k1.sign(digest, privateKeyBytes);
    const compact = signature.toCompactRawBytes();
    const r = `0x${bytesToHex(compact.slice(0, 32))}`;
    const s = `0x${bytesToHex(compact.slice(32, 64))}`;
    const v = 27 + (signature.recovery ?? 0);
    const publicKey = secp256k1.getPublicKey(privateKeyBytes, false).slice(1);
    const signer = `0x${bytesToHex(keccak256(publicKey).slice(-20))}`;
    return {
      signer,
      r,
      s,
      v,
      expiration: context.expirationNs.toString(),
      nonce: context.nonce,
    };
  }
}

function normalizeEnvironment(env: GrvtEnvironment | undefined): BaseEnvironment {
  if (!env) return "testnet";
  const normalized = env.toString().toLowerCase();
  if (normalized in ENVIRONMENT_HOSTS) {
    return normalized as BaseEnvironment;
  }
  if (normalized in ENVIRONMENT_ALIASES) {
    const alias = ENVIRONMENT_ALIASES[normalized as keyof typeof ENVIRONMENT_ALIASES];
    if (alias) {
      return alias;
    }
  }
  return "testnet";
}

function resolveHosts(env: BaseEnvironment, override?: GrvtHostsOverride): HostsConfig {
  const base = ENVIRONMENT_HOSTS[env];
  return {
    trades: override?.trades ?? base.trades,
    market: override?.market ?? base.market,
    edge: override?.edge ?? base.edge,
  };
}

function normalizeCookieValue(value: string): string {
  const parsed = parseSetCookieHeader(value);
  if (parsed?.cookie) return parsed.cookie;
  const [cookie] = value.split(";");
  return (cookie ?? value).trim();
}

function defaultLogger(context: string, error: unknown): void {
  // Suppress direct console output from GRVT gateway. Strategy layers already
  // record failures into the recent events trade log as warnings.
  // Intentionally no-op to avoid noisy CLI logs.
  void context;
  void error;
}

function parseSetCookieHeader(
  header?: string | string[]
): { cookie: string; expiresAt?: number } | null {
  if (!header) return null;
  const entries = Array.isArray(header) ? header : [header];
  for (const entry of entries) {
    if (!entry) continue;
    const segments = entry.split(";").map((part) => part.trim()).filter(Boolean);
    if (!segments.length) continue;
    const cookieSegment = segments.find((segment) => segment.toLowerCase().startsWith("gravity")) ?? segments[0];
    if (!cookieSegment) continue;
    const expiresSegment = segments.find((segment) => segment.toLowerCase().startsWith("expires="));
    const expiresAt = expiresSegment ? Date.parse(expiresSegment.slice("expires=".length)) : undefined;
    return {
      cookie: cookieSegment,
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : undefined,
    };
  }
  return null;
}

function normalizeHex(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) {
    return `0x${trimmed.slice(2).toLowerCase()}`;
  }
  return `0x${trimmed.toLowerCase()}`;
}

function cloneAccount(snapshot: AsterAccountSnapshot): AsterAccountSnapshot {
  return JSON.parse(JSON.stringify(snapshot));
}

function cloneOrders(orders: AsterOrder[]): AsterOrder[] {
  return orders.map((order) => ({ ...order }));
}

function cloneDepth(depth: AsterDepth): AsterDepth {
  return {
    ...depth,
    bids: depth.bids.map((level) => [...level] as [string, string]),
    asks: depth.asks.map((level) => [...level] as [string, string]),
  };
}

function cloneTicker(ticker: AsterTicker): AsterTicker {
  return { ...ticker };
}

function cloneKlines(klines: AsterKline[]): AsterKline[] {
  return klines.map((kline) => ({ ...kline }));
}

function nsToMs(input: string | number | undefined): number {
  if (input == null) return Date.now();
  const value = typeof input === "string" ? Number(input) : input;
  if (!Number.isFinite(value)) return Date.now();
  return Math.floor(value / ONE_MILLISECOND_IN_NANOSECONDS);
}

function scaleDecimal(value: string | number | undefined, decimals: number): bigint {
  if (value == null) return 0n;
  const strValue = typeof value === "number" ? value.toString() : value;
  if (!strValue.includes("e") && !strValue.includes("E")) {
    const [intPartRaw, fracRaw = ""] = strValue.split(".");
    const sanitizedIntPart = (intPartRaw ?? "").replace(/^\+/, "");
    const intPart = sanitizedIntPart === "" ? "0" : sanitizedIntPart;
    const fraction = fracRaw.padEnd(decimals, "0").slice(0, decimals);
    const combined = `${intPart}${fraction}`;
    return BigInt(combined || "0");
  }
  const fixed = Number(strValue);
  if (!Number.isFinite(fixed)) {
    throw new Error(`Unable to scale decimal value: ${value}`);
  }
  return scaleDecimal(fixed.toFixed(decimals), decimals);
}

function sumUnrealized(positions: AsterAccountPosition[]): number {
  return positions.reduce((total, position) => total + Number(position.unrealizedProfit ?? 0), 0);
}

function getNewestPositionEventTime(positions: AsterAccountPosition[]): number {
  if (!positions.length) return Date.now();
  return positions.reduce((max, p) => Math.max(max, Number(p.updateTime) || 0), 0);
}

function mapAccountSnapshot(
  response: IApiSubAccountSummaryResponse,
  symbol: string,
  instrument: string
): AsterAccountSnapshot {
  const result = response.result;
  if (!result) {
    return emptyAccount(symbol);
  }
  const updateTime = nsToMs(result.event_time);
  const assets = (result.spot_balances ?? []).map((balance) => ({
    asset: balance.currency ?? symbol.slice(-4),
    walletBalance: balance.balance ?? "0",
    availableBalance: balance.balance ?? "0",
    updateTime,
  }));
  return {
    canTrade: true,
    canDeposit: true,
    canWithdraw: true,
    updateTime,
    totalWalletBalance: result.total_equity ?? "0",
    totalUnrealizedProfit: result.unrealized_pnl ?? "0",
    totalMarginBalance: result.total_equity,
    totalInitialMargin: result.initial_margin,
    totalMaintMargin: result.maintenance_margin,
    availableBalance: result.available_balance,
    positions: mapPositions({ result: result.positions ?? [] }, symbol, instrument),
    assets,
  };
}

function mapPositions(
  response: IApiPositionsResponse,
  symbol: string,
  instrument: string
): AsterAccountPosition[] {
  return (response.result ?? [])
    .filter((entry) => !entry.instrument || entry.instrument === instrument)
    .map((entry) => ({
      symbol,
      positionAmt: entry.size ?? "0",
      entryPrice: entry.entry_price ?? "0",
      unrealizedProfit: entry.unrealized_pnl ?? "0",
      positionSide: "BOTH",
      updateTime: nsToMs(entry.event_time),
      markPrice: entry.mark_price,
      liquidationPrice: entry.est_liquidation_price,
      leverage: entry.leverage,
    }));
}

function mapOpenOrders(response: IApiOpenOrdersResponse, symbol: string): AsterOrder[] {
  return (response.result ?? []).map((order) => mapOrder(order, symbol));
}

function mapOrder(order: IOrder, symbol: string): AsterOrder {
  const leg = order.legs?.[0];
  const state = order.state;
  const metadata = order.metadata;
  const trigger = metadata?.trigger;
  const executedQty = Array.isArray(state?.traded_size) ? state?.traded_size?.[0] ?? "0" : state?.traded_size ?? "0";
  const avgFillPrice = Array.isArray(state?.avg_fill_price)
    ? state?.avg_fill_price?.[0] ?? undefined
    : state?.avg_fill_price ?? undefined;
  const hasTrigger = Boolean(trigger?.tpsl?.trigger_price);
  const derivedType = hasTrigger
    ? (order.is_market ? "STOP_MARKET" : "LIMIT")
    : (order.is_market ? "MARKET" : "LIMIT");
  return {
    orderId: order.order_id ?? metadata?.client_order_id ?? cryptoRandomId(),
    clientOrderId: metadata?.client_order_id ?? "",
    symbol,
    side: leg?.is_buying_asset ? "BUY" : "SELL",
    type: derivedType,
    status: state?.status ?? "NEW",
    price: leg?.limit_price ?? "0",
    origQty: leg?.size ?? "0",
    executedQty,
    stopPrice: trigger?.tpsl?.trigger_price ?? "0",
    time: nsToMs(metadata?.create_time),
    updateTime: nsToMs(state?.update_time),
    reduceOnly: Boolean(order.reduce_only),
    closePosition: Boolean(trigger?.tpsl?.close_position),
    timeInForce: mapTimeInForceFromGrvt(order.time_in_force),
    avgPrice: avgFillPrice,
    cumQuote: undefined,
    workingType: undefined,
    activationPrice: undefined,
    priceRate: undefined,
    priceProtect: false,
  };
}

function mapDepth(response: IApiOrderbookLevelsResponse, symbol: string): AsterDepth | null {
  const result = response.result;
  if (!result) return null;
  const toLevel = (entries: Array<{ price?: string; size?: string }> | undefined) =>
    (entries ?? []).map((entry) => [entry.price ?? "0", entry.size ?? "0"] as [string, string]);
  return {
    lastUpdateId: Number(result.event_time ?? Date.now()),
    eventTime: nsToMs(result.event_time),
    symbol,
    bids: toLevel(result.bids as any),
    asks: toLevel(result.asks as any),
  };
}

function mapTicker(response: IApiTickerResponse, symbol: string): AsterTicker | null {
  const result = response.result;
  if (!result) return null;
  const buyVolume = Number(result.buy_volume_24h_b ?? 0);
  const sellVolume = Number(result.sell_volume_24h_b ?? 0);
  const buyQuote = Number(result.buy_volume_24h_q ?? 0);
  const sellQuote = Number(result.sell_volume_24h_q ?? 0);
  return {
    symbol,
    lastPrice: result.last_price ?? "0",
    openPrice: result.open_price ?? "0",
    highPrice: result.high_price ?? "0",
    lowPrice: result.low_price ?? "0",
    volume: (buyVolume + sellVolume).toString(),
    quoteVolume: (buyQuote + sellQuote).toString(),
    eventTime: nsToMs(result.event_time),
    lastQty: result.last_size,
    count: undefined,
  };
}

function mapKlines(response: IApiCandlestickResponse, symbol: string): AsterKline[] {
  return (response.result ?? []).reverse().map((entry) => ({
    openTime: nsToMs(entry.open_time ?? Date.now() * ONE_SECOND_IN_NANOSECONDS),
    closeTime: nsToMs(entry.close_time ?? Date.now() * ONE_SECOND_IN_NANOSECONDS),
    open: entry.open ?? "0",
    high: entry.high ?? "0",
    low: entry.low ?? "0",
    close: entry.close ?? "0",
    volume: entry.volume_b ?? "0",
    numberOfTrades: entry.trades ?? 0,
  }));
}

function mapCreateOrderResponse(response: IApiCreateOrderResponse, symbol: string): AsterOrder {
  const order = response.result ?? (response as unknown as { order?: IOrder }).order;
  if (!order) {
    return {
      orderId: cryptoRandomId(),
      clientOrderId: "",
      symbol,
      side: "BUY",
      type: "LIMIT",
      status: "NEW",
      price: "0",
      origQty: "0",
      executedQty: "0",
      stopPrice: "0",
      time: Date.now(),
      updateTime: Date.now(),
      reduceOnly: false,
      closePosition: false,
    };
  }
  return mapOrder(order as IOrder, symbol);
}

function toApiOrderPayload(order: GrvtSignedOrder): IOrder {
  const metadata = order.metadata ? toApiOrderMetadata(order.metadata) : undefined;
  return {
    ...order,
    time_in_force: toApiTimeInForce(order.time_in_force),
    metadata,
  };
}

function toApiOrderMetadata(metadata: GrvtOrderMetadataInput): IOrder["metadata"] {
  const trigger = metadata.trigger;
  return {
    client_order_id: metadata.client_order_id,
    trigger: trigger
      ? {
          trigger_type: toApiTriggerType(trigger.trigger_type),
          tpsl: {
            trigger_by: toApiTriggerBy(trigger.tpsl.trigger_by),
            trigger_price: trigger.tpsl.trigger_price,
            close_position: trigger.tpsl.close_position,
          },
        }
      : undefined,
  };
}

function toApiTimeInForce(timeInForce: GrvtTimeInForce): ETimeInForce {
  switch (timeInForce) {
    case "ALL_OR_NONE":
      return ETimeInForce.ALL_OR_NONE;
    case "IMMEDIATE_OR_CANCEL":
      return ETimeInForce.IMMEDIATE_OR_CANCEL;
    case "FILL_OR_KILL":
      return ETimeInForce.FILL_OR_KILL;
    case "GOOD_TILL_TIME":
    default:
      return ETimeInForce.GOOD_TILL_TIME;
  }
}

function toApiTriggerType(triggerType: GrvtTriggerMetadata["trigger_type"] | undefined): ETriggerType {
  switch (triggerType) {
    case "TAKE_PROFIT":
      return ETriggerType.TAKE_PROFIT;
    case "STOP_LOSS":
      return ETriggerType.STOP_LOSS;
    case "UNSPECIFIED":
    default:
      return ETriggerType.UNSPECIFIED;
  }
}

function toApiTriggerBy(triggerBy: GrvtTriggerMetadata["tpsl"]["trigger_by"] | undefined): ETriggerBy {
  switch (triggerBy) {
    case "INDEX":
      return ETriggerBy.INDEX;
    case "LAST":
      return ETriggerBy.LAST;
    case "MID":
      return ETriggerBy.MID;
    case "MARK":
      return ETriggerBy.MARK;
    case "UNSPECIFIED":
    default:
      return ETriggerBy.UNSPECIFIED;
  }
}

function buildUnsignedOrder(params: {
  params: CreateOrderParams;
  instrument: string;
  subAccountId: string;
}): {
  order: GrvtUnsignedOrder;
  signing: {
    quantity: number;
    price?: number;
    side: OrderSide;
    isMarket: boolean;
    timeInForce: string;
    postOnly: boolean;
    reduceOnly: boolean;
  };
} {
  const { params: orderParams, instrument, subAccountId } = params;
  const quantity = Number(orderParams.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("GRVT requires a positive quantity when creating orders");
  }

  const isMarketOrder = orderParams.type === "MARKET" || orderParams.type === "STOP_MARKET";
  const timeInForce = mapTimeInForceToGrvt(orderParams.timeInForce);
  const postOnly = Boolean(
    orderParams.timeInForce && orderParams.timeInForce.toUpperCase() === "GTX"
  );
  const reduceOnly = normalizeBoolean(orderParams.reduceOnly);
  const priceValue = isMarketOrder ? undefined : orderParams.price;
  if (!isMarketOrder && (priceValue == null || !Number.isFinite(Number(priceValue)))) {
    throw new Error("GRVT limit orders require a valid price");
  }

  const trigger = buildTriggerMetadata(orderParams);
  const metadata = {
    client_order_id: generateClientOrderId(),
    ...(trigger ? { trigger } : {}),
  };

  const order: GrvtUnsignedOrder = {
    sub_account_id: subAccountId,
    is_market: isMarketOrder,
    time_in_force: timeInForce,
    post_only: postOnly,
    reduce_only: reduceOnly,
    legs: [
      {
        instrument,
        size: toDecimalString(quantity),
        limit_price: isMarketOrder ? undefined : toDecimalString(priceValue),
        is_buying_asset: orderParams.side === "BUY",
      },
    ],
    metadata,
  };

  return {
    order,
    signing: {
      quantity,
      price: priceValue == null ? undefined : Number(priceValue),
      side: orderParams.side,
      isMarket: isMarketOrder,
      timeInForce,
      postOnly,
      reduceOnly,
    },
  };
}

function buildTriggerMetadata(params: CreateOrderParams): GrvtUnsignedOrder["metadata"]["trigger"] | undefined {
  if (params.type === "STOP_MARKET") {
    const triggerType = params.triggerType ?? "STOP_LOSS";
    const stopPrice = params.stopPrice ?? params.activationPrice;
    if (!stopPrice) {
      throw new Error("GRVT stop orders require a stopPrice or activationPrice");
    }
    return {
      trigger_type: triggerType,
      tpsl: {
        trigger_by: DEFAULT_MARK_PRICE_TRIGGER,
        trigger_price: toDecimalString(stopPrice),
        close_position: normalizeBoolean(params.closePosition),
      },
    };
  }
  return undefined;
}

function mapIntervalToGrvt(interval: string): ECandlestickInterval {
  const normalized = interval.trim().toLowerCase();
  switch (normalized) {
    case "1m":
      return ECandlestickInterval.CI_1_M;
    case "3m":
      return ECandlestickInterval.CI_3_M;
    case "5m":
      return ECandlestickInterval.CI_5_M;
    case "15m":
      return ECandlestickInterval.CI_15_M;
    case "30m":
      return ECandlestickInterval.CI_30_M;
    case "1h":
      return ECandlestickInterval.CI_1_H;
    case "2h":
      return ECandlestickInterval.CI_2_H;
    case "4h":
      return ECandlestickInterval.CI_4_H;
    case "6h":
      return ECandlestickInterval.CI_6_H;
    case "8h":
      return ECandlestickInterval.CI_8_H;
    case "12h":
      return ECandlestickInterval.CI_12_H;
    case "1d":
      return ECandlestickInterval.CI_1_D;
    case "1w":
      return ECandlestickInterval.CI_1_W;
    default:
      return ECandlestickInterval.CI_1_M;
  }
}

function mapTimeInForceToGrvt(timeInForce: string | undefined): GrvtTimeInForce {
  switch ((timeInForce ?? "GTC").toUpperCase()) {
    case "IOC":
      return "IMMEDIATE_OR_CANCEL";
    case "FOK":
      return "FILL_OR_KILL";
    case "GTX":
      return "GOOD_TILL_TIME";
    default:
      return DEFAULT_TIME_IN_FORCE;
  }
}

function mapTimeInForceToNumeric(timeInForce: string): number {
  switch (timeInForce) {
    case "ALL_OR_NONE":
      return 2;
    case "IMMEDIATE_OR_CANCEL":
      return 3;
    case "FILL_OR_KILL":
      return 4;
    case "GOOD_TILL_TIME":
    default:
      return 1;
  }
}

function hashStruct(type: string, value: Record<string, any>, types: EIP712Types): Uint8Array {
  const typeHashBytes = typeHash(type, types);
  const fields = types[type];
  if (!fields) {
    throw new Error(`Unknown EIP712 type: ${type}`);
  }
  const buffers = [typeHashBytes];
  for (const field of fields) {
    const fieldValue = value[field.name];
    buffers.push(encodeField(field.type, fieldValue, types));
  }
  return keccak256(concatBytes(...buffers));
}

function encodeField(type: string, value: any, types: EIP712Types): Uint8Array {
  if (type.endsWith("[]")) {
    const baseType = type.slice(0, type.indexOf("["));
    const arrayValue = Array.isArray(value) ? value : [];
    const hashes = arrayValue.map((item) => hashStruct(baseType, item, types));
    return keccak256(hashes.length ? concatBytes(...hashes) : new Uint8Array());
  }
  if (types[type]) {
    return hashStruct(type, value, types);
  }
  return encodePrimitive(type, value);
}

function encodePrimitive(type: string, value: any): Uint8Array {
  switch (type) {
    case "string":
      return keccak256(utf8ToBytes(value ?? ""));
    case "bool":
      return bigIntToUint8Array(value ? 1n : 0n);
    case "uint8":
    case "uint32":
    case "uint64":
    case "uint256":
    case "int64":
      return bigIntToUint8Array(BigInt(value ?? 0));
    case "bytes":
      return keccak256(typeof value === "string" ? hexToBytes(stripHexPrefix(value)) : value ?? new Uint8Array());
    default:
      throw new Error(`Unsupported EIP712 field type: ${type}`);
  }
}

function typeHash(primaryType: string, types: EIP712Types): Uint8Array {
  return keccak256(utf8ToBytes(encodeType(primaryType, types)));
}

function encodeType(primaryType: string, types: EIP712Types): string {
  const deps = Array.from(findTypeDependencies(primaryType, types));
  deps.splice(deps.indexOf(primaryType), 1);
  deps.sort();
  deps.unshift(primaryType);
  return deps
    .map((type) => {
      const fields = types[type];
      if (!fields) throw new Error(`Type ${type} not defined in EIP712 types`);
      const fieldStr = fields.map((field) => `${field.type} ${field.name}`).join(",");
      return `${type}(${fieldStr})`;
    })
    .join("");
}

function findTypeDependencies(primaryType: string, types: EIP712Types, results = new Set<string>()): Set<string> {
  if (results.has(primaryType)) return results;
  const fields = types[primaryType];
  if (!fields) return results;
  results.add(primaryType);
  for (const field of fields) {
    const baseType = field.type.replace(/\[[^\]]*\]/g, "");
    findTypeDependencies(baseType, types, results);
  }
  return results;
}

function mapTimeInForceFromGrvt(value: string | undefined): "GTC" | "IOC" | "FOK" | undefined {
  switch (value) {
    case "IMMEDIATE_OR_CANCEL":
      return "IOC";
    case "FILL_OR_KILL":
      return "FOK";
    case "GOOD_TILL_TIME":
      return "GTC";
    case "RETAIL_PRICE_IMPROVEMENT":
      return "GTC";
    default:
      return undefined;
  }
}

function normalizeBoolean(value: string | boolean | undefined): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

function toDecimalString(value: number | string | undefined): string {
  if (value == null) return "0";
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "0";
  return value.toString();
}

function generateClientOrderId(): string {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${Date.now()}${random}`;
}

function cryptoRandomId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function bigIntToUint8Array(value: bigint): Uint8Array {
  if (value < 0n) {
    throw new Error("Negative values are not supported in EIP712 encoding");
  }
  const hex = value.toString(16).padStart(64, "0");
  return hexToBytes(hex);
}

function stripHexPrefix(value: string): string {
  return value.startsWith("0x") || value.startsWith("0X") ? value.slice(2) : value;
}

function padPrivateKey(value: string): string {
  const hex = stripHexPrefix(value).padStart(64, "0");
  if (hex.length !== 64) {
    throw new Error("GRVT_API_SECRET must be a 32-byte hex string");
  }
  return hex;
}

function emptyAccount(symbol: string): AsterAccountSnapshot {
  return {
    canTrade: true,
    canDeposit: true,
    canWithdraw: true,
    updateTime: Date.now(),
    totalWalletBalance: "0",
    totalUnrealizedProfit: "0",
    positions: [],
    assets: [
      {
        asset: symbol.slice(-4),
        walletBalance: "0",
        availableBalance: "0",
        updateTime: Date.now(),
      },
    ],
  } as AsterAccountSnapshot;
}
