import { setInterval, clearInterval, setTimeout, clearTimeout } from "timers";
import WebSocket from "ws";
import type {
  AccountListener,
  DepthListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type {
  AsterAccountAsset,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
} from "../types";
import { extractMessage } from "../../utils/errors";
import type { OrderSide, OrderType } from "../types";
import { LighterHttpClient } from "./http-client";
import { HttpNonceManager } from "./nonce-manager";
import { LighterSigner, type CreateOrderSignParams } from "./signer";
import { bytesToHex } from "./bytes";
import type {
  LighterAccountDetails,
  LighterAccountAsset,
  LighterKline,
  LighterMarketStats,
  LighterOrder,
  LighterOrderBookLevel,
  LighterOrderBookMetadata,
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
import { decimalToScaled, scaledToDecimalString, scaleQuantityWithMinimum } from "./decimal";
import { lighterOrderToAster, toAccountSnapshot, toDepth, toKlines, toOrders, toTicker } from "./mappers";
import { normalizeOrderIdentity, orderIdentityEquals } from "./order-identity";
import { shouldResetMarketOrders } from "./order-feed";

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
const WS_HEARTBEAT_INTERVAL_MS = 5_000;
const CLIENT_PING_INTERVAL_MS = 2_000;
const WS_STALE_TIMEOUT_MS = 20_000;
const FEED_STALE_TIMEOUT_MS = 8_000;
const STALE_CHECK_INTERVAL_MS = 2_000;
const POSITION_HTTP_MAX_STALE_MS = 60_000;
const ACCOUNT_POLL_INTERVAL_MS = 5_000;
const ORDER_RESYNC_INTERVAL_MS = 10_000;
const POSITION_EPSILON = 1e-12;

const RESOLUTION_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "1h": 3_600_000,
  "4h": 14_400_000,
  "1d": 86_400_000,
};

const TERMINAL_ORDER_STATUSES = new Set([
  "filled",
  "canceled",
  "cancelled",
  "expired",
  "canceled-post-only",
  "canceled-reduce-only",
]);

const KNOWN_SPOT_MARKETS: Record<string, { marketId: number; base: string; quote: string; priceDecimals?: number; sizeDecimals?: number }> = {
  ETHUSDC: { marketId: 2048, base: "ETH", quote: "USDC", priceDecimals: 2, sizeDecimals: 4 },
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
  private accountPoller: ReturnType<typeof setInterval> | null = null;
  private accountPollInFlight = false;
  private ordersResyncTimer: ReturnType<typeof setInterval> | null = null;
  private ordersResyncInFlight = false;
  private readonly klineCache = new Map<string, AsterKline[]>();
  private readonly accountEvent = createEvent<AsterAccountSnapshot>();
  private readonly ordersEvent = createEvent<AsterOrder[]>();
  private readonly depthEvent = createEvent<AsterDepth>();
  private readonly tickerEvent = createEvent<AsterTicker>();
  private readonly klinesEvent = createEvent<AsterKline[]>();
  private readonly auth = { token: null as string | null, expiresAt: 0 };
  private readonly l1Address: string | null;
  private loggedCreateOrderPayload = false;
  private readonly logTxInfo: boolean;
  private readonly primaryApiKeyIndex: number;
  private lastNonceRefreshAt = 0;
  private orderChain: Promise<void> = Promise.resolve();
  private lastWsPositionUpdateAt = 0;
  private readonly lastWsPositionByMarket = new Map<number, number>();
  private httpPositionsEmptyLogged = false;
  private forcedSpotPreset = false;

  private marketId: number | null = null;
  private marketType: "perp" | "spot" | null = null;
  private priceDecimals: number | null = null;
  private sizeDecimals: number | null = null;
  private baseAssetId: number | null = null;
  private quoteAssetId: number | null = null;
  private baseAssetSymbol: string | null = null;
  private quoteAssetSymbol: string | null = null;
  private readonly assets = new Map<string, LighterAccountAsset>();
  private minBaseAmount: number | null = null;
  private minQuoteAmount: number | null = null;
  private readonly orderIndexByClientId = new Map<string, string>();

  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly wsUrl: string;
  private connectPromise: Promise<void> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private lastMessageAt = 0;

  private accountDetails: LighterAccountDetails | null = null;
  private positions: LighterPosition[] = [];
  private orders: LighterOrder[] = [];
  private readonly orderMap = new Map<string, LighterOrder>();
  private orderBook: LighterOrderBookSnapshot | null = null;
  private ticker: LighterMarketStats | null = null;
  private initialized = false;
  private readonly pendingJsonRequests = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (error: unknown) => void }
  >();

  private readonly tickerPollMs: number;
  private readonly klinePollMs: number;
  private lastDepthUpdateAt = Date.now();
  private lastOrdersUpdateAt = Date.now();
  private lastAccountUpdateAt = Date.now();
  private lastTickerUpdateAt = Date.now();
  private staleReason: string | null = null;
  private staleMonitor: ReturnType<typeof setInterval> | null = null;

  // Track last applied order book sequence to drop stale WS messages
  private lastOrderBookOffset: number = 0;
  private lastOrderBookTimestamp: number = 0;

  constructor(options: LighterGatewayOptions) {
    this.displaySymbol = options.symbol;
    this.marketSymbol = (options.marketSymbol ?? options.symbol).toUpperCase();
    this.marketType = guessMarketType(this.marketSymbol);
    const parsedSymbols = parseBaseQuote(this.marketSymbol);
    this.baseAssetSymbol = parsedSymbols.base ?? null;
    this.quoteAssetSymbol = parsedSymbols.quote ?? null;
    this.applyPresetMarket();
    if (process.env.LIGHTER_MARKET_ID) {
      this.marketId = Number(process.env.LIGHTER_MARKET_ID);
    }
    if (process.env.LIGHTER_MARKET_TYPE) {
      this.marketType = normalizeMarketType(process.env.LIGHTER_MARKET_TYPE) ?? this.marketType;
    }
    const envPreference =
      options.environment ??
      process.env.LIGHTER_ENV ??
      (this.forcedSpotPreset && !options.baseUrl ? "mainnet" : undefined);
    this.environment = inferEnvironment(envPreference, options.baseUrl);
    const host = options.baseUrl ?? LIGHTER_HOSTS[this.environment]?.rest;
    if (!host) {
      throw new Error(`Unknown Lighter environment ${this.environment}`);
    }
    if (process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true") {
      // eslint-disable-next-line no-console
      console.error(
        "[LighterGateway] init",
        JSON.stringify({ env: this.environment, host, marketId: this.marketId, marketType: this.marketType })
      );
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
    if (this.forcedSpotPreset && this.apiKeyIndices.length > 1) {
      this.apiKeyIndices.splice(1); // stick to the first key to avoid nonce drift
    }
    this.primaryApiKeyIndex = this.apiKeyIndices[0]!;
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
    this.logTxInfo = process.env.LIGHTER_LOG_TX === "1" || process.env.LIGHTER_LOG_TX === "true";
    const now = Date.now();
    this.lastDepthUpdateAt = now;
    this.lastOrdersUpdateAt = now;
    this.lastAccountUpdateAt = now;
    this.lastTickerUpdateAt = now;
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
    const run = async (): Promise<AsterOrder> => {
      await this.ensureInitialized();
      const conversion = this.mapCreateOrderParams(params);
      const { baseAmountScaledString, priceScaledString, triggerPriceScaledString, ...signParams } = conversion;

      const apiKeyIndex =
        this.primaryApiKeyIndex != null ? this.primaryApiKeyIndex : this.apiKeyIndices[0] ?? 0;
      await this.refreshNonceForOrder(apiKeyIndex);
      const { nonce } =
        this.primaryApiKeyIndex != null ? this.nonceManager.nextFor(this.primaryApiKeyIndex) : this.nonceManager.next();
      try {
        const signed = await this.signer.signCreateOrder({
          ...signParams,
          apiKeyIndex,
          nonce,
        });
        const debugEnabled = process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true";
        if (this.logTxInfo || debugEnabled) {
          // eslint-disable-next-line no-console
          console.error(
            "[LighterGateway] createOrder.tx",
            JSON.stringify({ txType: signed.txType, txInfo: signed.txInfo })
          );
        }
        const response = await this.dispatchTransaction(signed.txType, signed.txInfo, { priceProtection: false });
        if (debugEnabled && (response as { code?: number })?.code && (response as { code?: number }).code !== 200) {
          this.logger("createOrder.sendTx.response", response);
        }
        const clientOrderIndexStr = signParams.clientOrderIndex.toString();
        return lighterOrderToAster(this.displaySymbol, {
          order_index: clientOrderIndexStr,
          client_order_index: clientOrderIndexStr,
          order_id: clientOrderIndexStr,
          client_order_id: clientOrderIndexStr,
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
        if (isInvalidNonce(error)) {
          await this.refreshNonceThrottle(apiKeyIndex);
        }
        this.logger("createOrder", error);
        throw error;
      }
    };

    // serialize order creation to avoid concurrent nonce consumption
    const chain = this.orderChain.then(run, run);
    this.orderChain = chain.then(
      () => undefined,
      () => undefined
    );
    return chain;
  }

  async cancelOrder(params: { marketIndex?: number; orderId: number | string; apiKeyIndex?: number }): Promise<void> {
    await this.ensureInitialized();
    const marketIndex = params.marketIndex ?? this.marketId;
    if (marketIndex == null) throw new Error("Market index unknown");
    const resolvedOrderId = this.resolveOrderIndex(String(params.orderId));
    const indexValue = BigInt(resolvedOrderId);
    const { apiKeyIndex, nonce } = this.nonceManager.next();
    try {
      const signed = await this.signer.signCancelOrder({
        marketIndex,
        orderIndex: indexValue,
        nonce,
        apiKeyIndex,
      });
      await this.dispatchTransaction(signed.txType, signed.txInfo);
      // Optimistically remove the order locally to avoid stale duplicates until WS confirms
      this.removeOrderLocally(String(params.orderId));
    } catch (error) {
      this.nonceManager.acknowledgeFailure(apiKeyIndex);
      if (isInvalidNonce(error)) {
        await this.nonceManager.refresh(apiKeyIndex).catch((err) => this.logger("nonce.refresh", err));
      }
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
      await this.dispatchTransaction(signed.txType, signed.txInfo);
    } catch (error) {
      this.nonceManager.acknowledgeFailure(apiKeyIndex);
      if (isInvalidNonce(error)) {
        await this.nonceManager.refresh(apiKeyIndex).catch((err) => this.logger("nonce.refresh", err));
      }
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
    this.startStaleMonitor();
  }

  private async loadMetadata(): Promise<void> {
    const books = await this.http.getOrderBooks();
    const desiredSymbol = this.marketSymbol;
    const wantsSpot = guessMarketType(desiredSymbol) === "spot" || this.marketType === "spot";
    this.logger("loadMetadata", { desiredSymbol, wantsSpot, presetMarketId: this.marketId, bookCount: books.length });
    let target: LighterOrderBookMetadata | null = null;

    if (!this.marketId && wantsSpot) {
      const normalized = desiredSymbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const preset = KNOWN_SPOT_MARKETS[normalized];
      if (preset) {
        this.marketId = preset.marketId;
        this.baseAssetSymbol = this.baseAssetSymbol ?? preset.base;
        this.quoteAssetSymbol = this.quoteAssetSymbol ?? preset.quote;
        this.marketType = "spot";
      }
    }

    // If marketId is explicitly set (env/preset), force-match by ID first
    if (this.marketId != null) {
      target = books.find((book) => Number(book.market_id) === Number(this.marketId)) ?? null;
      if (wantsSpot && target && normalizeMarketType(target.market_type) !== "spot") {
        // Do not silently switch to perp; enforce spot
        const spotById = books.find(
          (book) =>
            normalizeMarketType(book.market_type) === "spot" && Number(book.market_id) === Number(this.marketId)
        );
        target = spotById ?? null;
      }
      if (!target) {
        throw new Error(
          `Configured market id ${this.marketId} not found in Lighter order books. Check LIGHTER_ENV/baseUrl matches the venue that lists spot ETH/USDC (e.g., mainnet).`
        );
      }
    }

    if (!target) {
      target = this.pickBestOrderBook(books, desiredSymbol, this.marketId);
      if (wantsSpot && (!target || normalizeMarketType(target.market_type) !== "spot")) {
        const spotAlt = this.findSpotSibling(books, desiredSymbol, this.marketId);
        if (spotAlt) target = spotAlt;
      }
    }
    if (!target) {
      if (this.marketId != null && this.priceDecimals != null && this.sizeDecimals != null) {
        return;
      }
      throw new Error(`Symbol ${desiredSymbol} not listed on Lighter order books`);
    }
    if (wantsSpot && normalizeMarketType(target.market_type) !== "spot") {
      throw new Error(
        `Expected spot market for ${desiredSymbol}, but resolved to market_id=${target.market_id} type=${target.market_type ?? "unknown"}`
      );
    }
    this.marketId = Number(target.market_id);
    this.marketType = normalizeMarketType(target.market_type) ?? this.marketType ?? guessMarketType(target.symbol);
    this.baseAssetId = target.base_asset_id ?? this.baseAssetId;
    this.quoteAssetId = target.quote_asset_id ?? this.quoteAssetId;
    this.minBaseAmount = Number(target.min_base_amount ?? target.min_base_amount);
    this.minQuoteAmount = Number(target.min_quote_amount ?? target.min_quote_amount);
    if (this.priceDecimals == null) {
      this.priceDecimals = target.supported_price_decimals;
    }
    if (this.sizeDecimals == null) {
      this.sizeDecimals = target.supported_size_decimals;
    }
    if (!this.baseAssetSymbol || !this.quoteAssetSymbol) {
      const parsed = parseBaseQuote(target.symbol ?? this.marketSymbol);
      if (!this.baseAssetSymbol) this.baseAssetSymbol = parsed.base ?? null;
      if (!this.quoteAssetSymbol) this.quoteAssetSymbol = parsed.quote ?? null;
    }
    if (wantsSpot && this.marketType !== "spot") {
      throw new Error(`Expected spot market for ${desiredSymbol}, but resolved to ${target.market_type ?? "unknown"}`);
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
    if (!details) {
      if (!this.accountDetails) {
        this.accountDetails = {
          account_index: Number(this.signer.accountIndex),
          status: 1,
          collateral: "0",
          available_balance: "0",
        } as LighterAccountDetails;
        this.positions = [];
        this.emitAccount();
      }
      return;
    }
    this.accountDetails = details;
    this.applyHttpPositions(details);
    this.applyAccountAssets(details.assets);
    this.emitAccount();
    } catch (error) {
      this.logger("refreshAccount", error);
    }
  }

  private applyHttpPositions(details: LighterAccountDetails): void {
    if (!Object.prototype.hasOwnProperty.call(details, "positions")) {
      return;
    }
    const normalized = this.normalizePositions(details.positions);
    if (normalized.length) {
      this.replacePositions(normalized);
      this.httpPositionsEmptyLogged = false;
      return;
    }
    if (this.isEmptyPositionsPayload(details.positions)) {
      if (this.positions.length && !this.httpPositionsEmptyLogged) {
        this.logger("accountPoll", "HTTP positions payload empty, retaining existing positions until WS confirms");
        this.httpPositionsEmptyLogged = true;
      }
      this.pruneStalePositionsFromHttp();
    }
  }

  private applyAccountAssets(assets?: LighterAccountAsset[] | Record<string, LighterAccountAsset> | null): void {
    const payloadProvided = assets !== undefined && assets !== null;
    const hasRawEntries =
      Array.isArray(assets) ? assets.length > 0 : isPlainObject(assets) ? Object.keys(assets).length > 0 : false;
    const normalized = this.normalizeAssets(assets);
    if (!normalized.length) {
      // Explicitly clear cached balances when the venue returns an empty payload,
      // so closed spot positions don't linger as phantom holdings.
      if (payloadProvided && !hasRawEntries) {
        this.assets.clear();
      }
      return;
    }
    for (const asset of normalized) {
      const key = this.normalizeAssetKey(asset);
      if (!key) continue;
      this.assets.set(key, asset);
      const assetId = Number(asset.asset_id);
      if (Number.isFinite(assetId)) {
        if (this.baseAssetId != null && assetId === this.baseAssetId && asset.symbol) {
          this.baseAssetSymbol = asset.symbol.toUpperCase();
        }
        if (this.quoteAssetId != null && assetId === this.quoteAssetId && asset.symbol) {
          this.quoteAssetSymbol = asset.symbol.toUpperCase();
        }
      }
    }
  }

  private recordWsPositionUpdate(): void {
    this.lastWsPositionUpdateAt = Date.now();
    this.httpPositionsEmptyLogged = false;
  }

  private markWsPositionForMarket(marketId: number): void {
    if (!Number.isFinite(marketId)) return;
    this.lastWsPositionByMarket.set(marketId, Date.now());
  }

  private pruneStalePositionsFromHttp(): void {
    if (!this.positions.length) return;
    const now = Date.now();
    const remaining: LighterPosition[] = [];
    let removed = false;
    for (const pos of this.positions) {
      const marketId = Number(pos.market_id);
      const lastWs = this.lastWsPositionByMarket.get(marketId) ?? 0;
      if (Number.isFinite(marketId) && lastWs && now - lastWs > POSITION_HTTP_MAX_STALE_MS) {
        this.lastWsPositionByMarket.delete(marketId);
        removed = true;
        continue;
      }
      remaining.push(pos);
    }
    if (removed) {
      this.logger("accountPoll", "Pruned stale positions based on HTTP inactivity");
      this.positions = remaining;
      this.recordWsPositionUpdate();
    }
  }

  private async openWebSocket(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;
      let settled = false;
      const cleanup = () => {
        ws.removeAllListeners();
        this.stopHeartbeat();
        this.stopClientPing();
        this.rejectPendingJsonRequests(new Error("WebSocket closed"));
        if (this.ws === ws) {
          this.ws = null;
        }
      };
      const fail = (error: unknown) => {
        if (settled) return;
        settled = true;
        reject(error instanceof Error ? error : new Error(String(error)));
      };
      ws.on("open", async () => {
        try {
          this.lastMessageAt = Date.now();
          this.lastDepthUpdateAt = this.lastMessageAt;
          this.staleReason = null;
          this.startHeartbeat();
          this.startClientPing();
          await this.subscribeChannels();
          this.startStaleMonitor();
          settled = true;
          resolve();
        } catch (error) {
          cleanup();
          fail(error);
          return;
        }
      });
      ws.on("message", (data) => {
        this.lastMessageAt = Date.now();
        this.handleMessage(data);
      });
      ws.on("pong", () => {
        this.lastMessageAt = Date.now();
      });
      ws.on("close", (code, reason) => {
        cleanup();
        const normalizedReason = Buffer.isBuffer(reason) && reason.length > 0 ? reason.toString("utf8") : undefined;
        if (!settled) {
          fail(new Error(`WebSocket closed before ready (code=${code}${normalizedReason ? `, reason=${normalizedReason}` : ""})`));
          return;
        }
        this.stopStaleMonitor();
        this.scheduleReconnect();
      });
      ws.on("error", (error) => {
        this.logger("ws:error", error);
        cleanup();
        if (!settled) {
          fail(error);
          return;
        }
        this.stopStaleMonitor();
        this.scheduleReconnect();
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
    ws.send(
      JSON.stringify({
        type: "subscribe",
        channel: `account_all_assets/${Number(this.signer.accountIndex)}`,
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

  private async refreshNonceForOrder(apiKeyIndex: number): Promise<void> {
    try {
      await this.nonceManager.refresh(apiKeyIndex);
      this.lastNonceRefreshAt = Date.now();
    } catch (error) {
      // Swallow refresh errors to avoid blocking order flow; real send will surface issues
      this.logger("nonce.refresh.order", error);
    }
  }

  private async refreshNonceThrottle(apiKeyIndex: number): Promise<void> {
    const now = Date.now();
    if (now - this.lastNonceRefreshAt < 1500) {
      return; // avoid spamming nextNonce; let next cycle try again
    }
    this.lastNonceRefreshAt = now;
    await this.nonceManager.refresh(apiKeyIndex);
  }

  private async dispatchTransaction(
    txType: number,
    txInfo: string,
    options: { priceProtection?: boolean } = {}
  ): Promise<unknown> {
    const auth = await this.ensureAuthToken();
    try {
      return await this.http.sendTransaction(txType, txInfo, {
        authToken: auth,
        priceProtection: options.priceProtection,
      });
    } catch (error) {
      this.logger("http:sendTx", error);
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return this.sendTransactionViaWs(txType, txInfo);
      }
      throw error;
    }
  }

  private async sendTransactionViaWs(txType: number, txInfo: string): Promise<unknown> {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected for tx dispatch");
    }
    const id = `tx-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const payload = {
      type: "jsonapi/sendtx",
      data: {
        id,
        tx_type: txType,
        tx_info: tryParseTxInfo(txInfo),
      },
    };
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingJsonRequests.delete(id);
        reject(new Error("WebSocket sendtx timeout"));
      }, 3000);
      this.pendingJsonRequests.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      try {
        ws.send(JSON.stringify(payload));
      } catch (error) {
        clearTimeout(timer);
        this.pendingJsonRequests.delete(id);
        reject(error);
      }
    });
  }

  private pickBestOrderBook(
    books: LighterOrderBookMetadata[],
    desiredSymbol: string,
    desiredMarketId?: number | null
  ): LighterOrderBookMetadata | null {
    const desiredForms = normalizeSymbolForms(desiredSymbol);
    let candidates = books.filter((book) => {
      const symbolForms = normalizeSymbolForms(book.symbol);
      const idMatch = desiredMarketId != null && Number(book.market_id) === Number(desiredMarketId);
      const symbolMatch = desiredForms.some((form) => symbolForms.includes(form));
      return idMatch || symbolMatch;
    });
    if (!candidates.length && desiredMarketId != null) {
      candidates = books.filter((book) => Number(book.market_id) === Number(desiredMarketId));
    }
    if (!candidates.length) return null;

    const normalizedDesired = desiredSymbol.toUpperCase();
    const wantsSpot =
      desiredSymbol.includes("/") ||
      desiredSymbol.includes("-") ||
      desiredSymbol.includes(":") ||
      normalizedDesired.includes("USDC") ||
      normalizedDesired.endsWith("USD");
    const preferred = candidates.filter((book) =>
      wantsSpot ? normalizeMarketType(book.market_type) === "spot" : true
    );
    if (wantsSpot && preferred.length) {
      candidates = preferred;
    }

    const preferSpot = wantsSpot;
    candidates.sort((a, b) => {
      const aExact = normalizeSymbolForms(a.symbol).includes(desiredSymbol.toUpperCase()) ? 1 : 0;
      const bExact = normalizeSymbolForms(b.symbol).includes(desiredSymbol.toUpperCase()) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      const aSpot = normalizeMarketType(a.market_type) === "spot" ? 1 : 0;
      const bSpot = normalizeMarketType(b.market_type) === "spot" ? 1 : 0;
      if (aSpot !== bSpot) {
        const aScore = preferSpot ? aSpot : 1 - aSpot; // prefer perp when not explicitly spot
        const bScore = preferSpot ? bSpot : 1 - bSpot;
        return bScore - aScore;
      }
      return 0;
    });

    return candidates[0];
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    const attempt = this.reconnectAttempts + 1;
    const delay = Math.min(2000 * attempt, 30_000);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.openWebSocket()
        .then(() => {
          this.reconnectAttempts = 0;
        })
        .catch((error) => {
          this.logger("reconnect", error);
          this.reconnectAttempts = attempt;
          this.scheduleReconnect();
        });
    }, delay);
  }

  private forceReconnect(reason: string): void {
    const now = Date.now();
    if (this.staleReason && now - this.lastDepthUpdateAt < FEED_STALE_TIMEOUT_MS / 2) {
      this.staleReason = null;
    }
    if (this.staleReason) return;
    this.staleReason = reason;
    this.logger("ws:stale", reason);
    try {
      this.ws?.terminate();
    } catch (error) {
      this.logger("ws:terminate", error);
    }
    this.stopHeartbeat();
    this.stopClientPing();
    this.scheduleReconnect();
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) return;
    this.heartbeatTimer = setInterval(() => {
      const ws = this.ws;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const now = Date.now();
      if (now - this.lastMessageAt > WS_STALE_TIMEOUT_MS) {
        try {
          ws.terminate();
        } catch (error) {
          this.logger("ws:terminate", error);
        } finally {
          this.stopHeartbeat();
          this.stopClientPing();
          this.scheduleReconnect();
        }
        return;
      }
      try {
        ws.ping();
      } catch (error) {
        this.logger("ws:ping", error);
      }
    }, WS_HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startClientPing(): void {
    if (this.pingTimer) return;
    this.pingTimer = setInterval(() => {
      const ws = this.ws;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try {
        ws.send(JSON.stringify({ type: "ping" }));
      } catch (error) {
        this.logger("ws:clientPing", error);
      }
    }, CLIENT_PING_INTERVAL_MS);
  }

  private stopClientPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private handleMessage(data: WebSocket.RawData): void {
    try {
      const text = typeof data === "string" ? data : data.toString("utf8");
      const message = JSON.parse(text);
      const type = message?.type;
      switch (type) {
        case "connected":
          break;
        case "ping":
          this.handlePing(message);
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
        case "subscribed/account_all_assets":
        case "update/account_all_assets":
          this.handleAccountAssets(message);
          break;
        default:
          break;
      }
      this.maybeResolveJsonRequest(message);
    } catch (error) {
      this.logger("ws:message", error);
    }
  }

  private handlePing(message: Record<string, unknown> | null | undefined): void {
    const extraPayload: Record<string, unknown> = {};
    if (message && typeof message === "object") {
      for (const [key, value] of Object.entries(message)) {
        if (key === "type") continue;
        extraPayload[key] = value;
      }
    }
    this.sendPong(extraPayload);
  }

  private sendPong(extra: Record<string, unknown> = {}): void {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const payload = Object.keys(extra).length ? { ...extra, type: "pong" } : { type: "pong" };
    try {
      ws.send(JSON.stringify(payload));
    } catch (error) {
      this.logger("ws:pong", error);
    }
  }

  private maybeResolveJsonRequest(message: any): void {
    const id = extractJsonRequestId(message);
    if (!id) return;
    const pending = this.pendingJsonRequests.get(id);
    if (!pending) return;
    this.pendingJsonRequests.delete(id);
    pending.resolve(message);
  }

  private rejectPendingJsonRequests(reason: unknown): void {
    for (const [id, pending] of Array.from(this.pendingJsonRequests.entries())) {
      try {
        pending.reject(reason);
      } catch (error) {
        this.logger(`ws:pending:${id}`, error);
      } finally {
        this.pendingJsonRequests.delete(id);
      }
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
    this.markDepthUpdate();
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
    this.markDepthUpdate();
  }

  private handleAccountAll(message: any): void {
    if (!message) return;
    if (Object.prototype.hasOwnProperty.call(message, "positions")) {
      const positionsObject = message.positions ?? {};
      const incoming = this.normalizePositions(positionsObject);
      if (incoming.length) {
        this.mergePositions(incoming);
        this.recordWsPositionUpdate();
      }
    }
    this.emitAccount();
  }

  private handleAccountMarket(message: any): void {
    if (!message) return;
    const type = typeof message.type === "string" ? message.type : "";
    const position: LighterPosition | undefined = message.position as LighterPosition | undefined;
    const channelMarketId = this.extractMarketIdFromChannel(message.channel);
    if (position && Number.isFinite(Number(position.market_id))) {
      this.mergePositions([position]);
      this.markWsPositionForMarket(Number(position.market_id));
      this.recordWsPositionUpdate();
    }
    if (Array.isArray(message.orders) && message.orders.length) {
      const marketId = Number(position?.market_id ?? channelMarketId ?? this.marketId ?? NaN);
      this.applyOrderList(message.orders, Number.isFinite(marketId) ? Number(marketId) : null, type === "subscribed/account_market");
    } else if (type === "subscribed/account_market" && channelMarketId != null) {
      this.clearOrdersForMarket(channelMarketId);
      this.emitOrders();
    }
    if (position && this.shouldRemovePosition(position)) {
      const target = Number(position.market_id ?? channelMarketId);
      if (Number.isFinite(target)) {
        this.positions = this.positions.filter((entry) => Number(entry.market_id) !== target);
        this.lastWsPositionByMarket.delete(target);
        this.recordWsPositionUpdate();
      }
    }
    this.emitAccount();
  }

  private handleAccountOrders(message: any): void {
    if (!message) return;
    const snapshot = message.type === "subscribed/account_all_orders";
    const ordersObject = message.orders ?? {};
    this.applyOrderBuckets(ordersObject, snapshot);
  }

  private handleAccountAssets(message: any): void {
    if (!message) return;
    const assets = this.normalizeAssets(message.assets);
    if (!assets.length) return;
    this.applyAccountAssets(assets);
    this.emitAccount();
  }

  private normalizePositions(source: unknown): LighterPosition[] {
    if (!source) return [];
    if (Array.isArray(source)) {
      return source.filter((entry): entry is LighterPosition => this.isPosition(entry));
    }
    if (isPlainObject(source)) {
      return Object.values(source).filter((entry): entry is LighterPosition => this.isPosition(entry));
    }
    if (this.isPosition(source)) return [source];
    return [];
  }

  private isPosition(value: unknown): value is LighterPosition {
    return typeof value === "object" && value != null && Number.isFinite(Number((value as LighterPosition).market_id));
  }

  private mergePositions(updates: LighterPosition[]): void {
    if (!updates.length) return;
    const byMarket = new Map<number, LighterPosition>();
    for (const existing of this.positions ?? []) {
      const mid = Number(existing.market_id);
      if (Number.isFinite(mid)) {
        byMarket.set(mid, existing);
      }
    }
    for (const update of updates) {
      const marketId = Number(update.market_id);
      if (!Number.isFinite(marketId)) continue;
      if (this.shouldRemovePosition(update)) {
        byMarket.delete(marketId);
        this.lastWsPositionByMarket.delete(marketId);
      } else {
        byMarket.set(marketId, update);
        this.markWsPositionForMarket(marketId);
      }
    }
    this.positions = Array.from(byMarket.values());
  }

  private replacePositions(positions: LighterPosition[]): void {
    if (!positions.length) {
      this.positions = [];
      this.lastWsPositionByMarket.clear();
      return;
    }
    const filtered = this.filterPositions(positions);
    this.positions = filtered;
    const now = Date.now();
    this.lastWsPositionByMarket.clear();
    for (const pos of filtered) {
      const marketId = Number(pos.market_id);
      if (Number.isFinite(marketId)) {
        this.lastWsPositionByMarket.set(marketId, now);
      }
    }
  }

  private filterPositions(positions: LighterPosition[]): LighterPosition[] {
    const byMarket = new Map<number, LighterPosition>();
    for (const entry of positions) {
      const marketId = Number(entry.market_id);
      if (!Number.isFinite(marketId)) continue;
      if (this.shouldRemovePosition(entry)) {
        byMarket.delete(marketId);
      } else {
        byMarket.set(marketId, entry);
      }
    }
    return Array.from(byMarket.values());
  }

  private shouldRemovePosition(position: LighterPosition): boolean {
    const size = Number(position.position ?? 0);
    return !Number.isFinite(size) || Math.abs(size) < POSITION_EPSILON;
  }

  private removePositionsForMarkets(markets: number[]): void {
    if (!markets.length) return;
    const targets = new Set(markets.filter((value) => Number.isFinite(value)).map((value) => Number(value)));
    if (!targets.size) return;
    this.positions = (this.positions ?? []).filter((position) => !targets.has(Number(position.market_id)));
  }

  private applyOrderBuckets(rawOrders: unknown, snapshot: boolean): void {
    const ordersObject = isPlainObject(rawOrders) ? (rawOrders as Record<string, unknown>) : {};
    const marketKeys = Object.keys(ordersObject);
    if (snapshot && marketKeys.length === 0) {
      this.orderMap.clear();
      this.orderIndexByClientId.clear();
      this.orders = [];
      this.emitOrders();
      return;
    }
    if (snapshot) {
      this.orderMap.clear();
      this.orderIndexByClientId.clear();
    }
    for (const [market, bucket] of Object.entries(ordersObject)) {
      const marketId = Number(market);
      const shouldReset = shouldResetMarketOrders(bucket, snapshot);
      if (shouldReset && Number.isFinite(marketId)) {
        this.clearOrdersForMarket(marketId);
      }
      const normalized = this.normalizeOrders(bucket);
      if (!normalized.length) continue;
      for (const order of normalized) {
        this.applyOrderUpdate(order);
      }
    }
    this.orders = Array.from(this.orderMap.values());
    this.emitOrders();
  }

  private normalizeOrders(source: unknown): LighterOrder[] {
    if (!source) return [];
    if (Array.isArray(source)) {
      return (source as unknown[]).filter((entry): entry is LighterOrder => this.isOrder(entry));
    }
    if (isPlainObject(source) && this.isOrder(source)) {
      return [source];
    }
    return [];
  }

  private isOrder(value: unknown): value is LighterOrder {
    return typeof value === "object" && value != null;
  }

  private normalizeAssets(source: unknown): LighterAccountAsset[] {
    if (!source) return [];
    const coerce = (entry: unknown): LighterAccountAsset | null => {
      if (!this.isAsset(entry)) return null;
      const balance =
        typeof entry.balance === "number" ? entry.balance.toString() : entry.balance ?? "0";
      const locked =
        typeof entry.locked_balance === "number"
          ? entry.locked_balance.toString()
          : entry.locked_balance;
      const rawSymbol =
        (entry.symbol ?? (entry.asset_id != null ? String(entry.asset_id) : undefined)) ?? undefined;
      const symbol = rawSymbol ? rawSymbol.toUpperCase() : undefined;
      return { ...entry, balance, locked_balance: locked, symbol };
    };
    if (Array.isArray(source)) {
      return (source as unknown[])
        .map(coerce)
        .filter((entry): entry is LighterAccountAsset => Boolean(entry));
    }
    if (isPlainObject(source)) {
      return Object.values(source)
        .map(coerce)
        .filter((entry): entry is LighterAccountAsset => Boolean(entry));
    }
    if (this.isAsset(source)) {
      const coerced = coerce(source);
      return coerced ? [coerced] : [];
    }
    return [];
  }

  private normalizeAssetKey(asset: LighterAccountAsset): string | null {
    if (asset.asset_id != null && Number.isFinite(Number(asset.asset_id))) {
      return `id:${Number(asset.asset_id)}`;
    }
    if (asset.symbol) {
      return `symbol:${asset.symbol.toUpperCase()}`;
    }
    return null;
  }

  private isAsset(value: unknown): value is LighterAccountAsset {
    if (typeof value !== "object" || value == null) return false;
    const balance = (value as LighterAccountAsset).balance as unknown;
    return typeof balance === "string" || typeof balance === "number";
  }

  private applyOrderList(rawOrders: unknown, marketId: number | null, snapshot: boolean): void {
    const orders = this.normalizeOrders(rawOrders);
    if (snapshot) {
      if (marketId != null) {
        this.clearOrdersForMarket(marketId);
      } else {
        this.orderMap.clear();
        this.orderIndexByClientId.clear();
      }
    }
    for (const order of orders) {
      this.applyOrderUpdate(order);
    }
    this.orders = Array.from(this.orderMap.values());
    this.emitOrders();
  }

  private applyOrderUpdate(order: LighterOrder): void {
    const orderIndex = this.extractOrderIndex(order);
    const clientIndex = this.extractClientIndex(order);
    if (orderIndex && clientIndex) {
      this.orderIndexByClientId.set(clientIndex, orderIndex);
    }
    if (orderIndex) {
      this.orderIndexByClientId.set(orderIndex, orderIndex);
    }
    const key = orderIndex ?? clientIndex;
    if (!key) return;
    const status = String(order.status ?? "").toLowerCase();
    if (TERMINAL_ORDER_STATUSES.has(status)) {
      const existing = this.orderMap.get(key);
      this.orderMap.delete(key);
      if (existing) {
        this.forgetOrderIdentity(existing);
      }
      return;
    }
    if (
      order.client_order_index != null ||
      order.order_index != null ||
      order.client_order_id != null ||
      order.order_id != null
    ) {
      for (const [existingKey, existingOrder] of Array.from(this.orderMap.entries())) {
        if (existingKey === key) continue;
        const sameOrderIndex =
          orderIdentityEquals(order.order_index, existingOrder.order_index) ||
          orderIdentityEquals(order.order_id, existingOrder.order_id);
        const sameClientIndex =
          orderIdentityEquals(order.client_order_index, existingOrder.client_order_index) ||
          orderIdentityEquals(order.client_order_id, existingOrder.client_order_id);
        if (sameOrderIndex || sameClientIndex) {
          const removed = this.orderMap.get(existingKey);
          this.orderMap.delete(existingKey);
          if (removed) {
            this.forgetOrderIdentity(removed);
          }
        }
      }
    }
    this.orderMap.set(key, order);
  }

  private clearOrdersForMarket(marketId: number): void {
    const normalized = Number(marketId);
    if (!Number.isFinite(normalized)) return;
    for (const [key, existing] of Array.from(this.orderMap.entries())) {
      const existingMarket =
        (existing as { market_index?: number | string; market_id?: number | string }).market_index ??
        (existing as { market_id?: number | string }).market_id;
      if (Number(existingMarket) === normalized) {
        this.orderMap.delete(key);
        this.forgetOrderIdentity(existing);
      }
    }
  }

  private extractMarketIdFromChannel(channel: unknown): number | null {
    if (typeof channel !== "string") return null;
    const match = channel.match(/account_market:(\d+)/);
    if (match && match[1]) {
      const value = Number(match[1]);
      return Number.isFinite(value) ? value : null;
    }
    return null;
  }

  private isEmptyPositionsPayload(value: unknown): boolean {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (isPlainObject(value)) return Object.keys(value).length === 0;
    return false;
  }

  private emitDepth(): void {
    if (!this.orderBook || this.marketId == null) return;
    const depth = toDepth(this.displaySymbol, this.orderBook);
    this.depthEvent.emit(depth);
    this.emitSyntheticTicker();
  }

  private markDepthUpdate(): void {
    this.lastDepthUpdateAt = Date.now();
    if (this.staleReason && this.staleReason.startsWith("depth")) {
      this.logger("ws:stale:recovered", this.staleReason);
      this.staleReason = null;
    }
  }

  private emitAccount(): void {
    if (!this.accountDetails) return;
    const snapshot = toAccountSnapshot(
      this.displaySymbol,
      this.accountDetails,
      this.positions,
      this.buildAccountAssets(),
      {
        marketSymbol: this.marketSymbol,
        marketId: this.marketId,
        marketType: this.marketType ?? guessMarketType(this.marketSymbol),
        baseAssetSymbol: this.baseAssetSymbol,
        quoteAssetSymbol: this.quoteAssetSymbol,
        baseAssetId: this.baseAssetId,
        quoteAssetId: this.quoteAssetId,
      }
    );
    this.accountEvent.emit(snapshot);
    this.lastAccountUpdateAt = Date.now();
    if (this.staleReason && this.staleReason.startsWith("account")) {
      this.staleReason = null;
    }
  }

  private emitOrders(): void {
    const mapped = toOrders(this.displaySymbol, this.orders ?? []);
    this.ordersEvent.emit(mapped);
    this.lastOrdersUpdateAt = Date.now();
    if (this.staleReason && this.staleReason.startsWith("orders")) {
      this.staleReason = null;
    }
  }

  private resolveOrderIndex(orderId: string): string {
    const normalized = normalizeOrderIdentity(orderId);
    if (!normalized) {
      throw new Error(`Invalid order id: ${orderId}`);
    }
    return this.orderIndexByClientId.get(normalized) ?? normalized;
  }

  private removeOrderLocally(orderId: string): void {
    const key = normalizeOrderIdentity(orderId);
    if (!key) return;
    const existing = this.orderMap.get(key);
    this.orderMap.delete(key);
    this.orderIndexByClientId.delete(key);
    if (existing) {
      this.forgetOrderIdentity(existing);
    }
    this.orders = Array.from(this.orderMap.values());
    this.emitOrders();
  }

  private extractOrderIndex(order: LighterOrder): string | null {
    return (
      normalizeOrderIdentity(order.order_id) ??
      normalizeOrderIdentity(order.order_index) ??
      null
    );
  }

  private extractClientIndex(order: LighterOrder): string | null {
    return (
      normalizeOrderIdentity(order.client_order_id) ??
      normalizeOrderIdentity(order.client_order_index) ??
      null
    );
  }

  private forgetOrderIdentity(order: LighterOrder): void {
    const orderIndex = this.extractOrderIndex(order);
    const clientIndex = this.extractClientIndex(order);
    if (orderIndex) {
      this.orderIndexByClientId.delete(orderIndex);
    }
    if (clientIndex) {
      this.orderIndexByClientId.delete(clientIndex);
    }
  }

  private startPolling(): void {
    if (!this.pollers.ticker) {
      this.pollers.ticker = setInterval(() => {
        this.refreshTicker().catch((error) => this.logger("ticker", error));
      }, this.tickerPollMs);
      void this.refreshTicker();
    }

    if (!this.accountPoller) {
      const pollAccount = () => {
        if (this.accountPollInFlight) return;
        this.accountPollInFlight = true;
        this.refreshAccountSnapshot()
          .catch((error) => this.logger("accountPoll", error))
          .finally(() => {
            this.accountPollInFlight = false;
          });
      };
      this.accountPoller = setInterval(pollAccount, ACCOUNT_POLL_INTERVAL_MS);
      pollAccount();
    }

    if (!this.ordersResyncTimer) {
      const resyncOrders = () => {
        const now = Date.now();
        if (now - this.lastOrdersUpdateAt < ORDER_RESYNC_INTERVAL_MS - 500) return;
        if (this.ordersResyncInFlight) return;
        this.ordersResyncInFlight = true;
        this.requestOrdersSnapshot()
          .catch((error) => this.logger("ordersResync", error))
          .finally(() => {
            this.ordersResyncInFlight = false;
          });
      };
      this.ordersResyncTimer = setInterval(resyncOrders, ORDER_RESYNC_INTERVAL_MS);
    }
  }

  private async requestOrdersSnapshot(): Promise<void> {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      const auth = await this.ensureAuthToken();
      ws.send(
        JSON.stringify({
          type: "subscribe",
          channel: `account_all_orders/${Number(this.signer.accountIndex)}`,
          auth,
        })
      );
    } catch (error) {
      this.logger("ordersResyncSnapshot", error);
    }
  }

  private startStaleMonitor(): void {
    if (this.staleMonitor) return;
    this.staleMonitor = setInterval(() => this.checkFeedStaleness(), STALE_CHECK_INTERVAL_MS);
  }

  private stopStaleMonitor(): void {
    if (!this.staleMonitor) return;
    clearInterval(this.staleMonitor);
    this.staleMonitor = null;
  }

  private checkFeedStaleness(): void {
    if (this.staleReason) return;
    const now = Date.now();
    if (now - this.lastDepthUpdateAt > FEED_STALE_TIMEOUT_MS) {
      this.forceReconnect("depth stale");
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
      this.lastTickerUpdateAt = Date.now();
      if (this.staleReason && this.staleReason.startsWith("ticker")) {
        this.staleReason = null;
      }
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
      bidPrice: bestBid != null ? bestBid.toString() : undefined,
      askPrice: bestAsk != null ? bestAsk.toString() : undefined,
      priceChange: bestBid != null && bestAsk != null ? (bestAsk - bestBid).toString() : undefined,
      markPrice: last.toString(),
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

  private buildAccountAssets(): AsterAccountAsset[] {
    if (!this.assets.size) return [];
    const now = Date.now();
    const list: AsterAccountAsset[] = [];
    for (const asset of this.assets.values()) {
      const balanceNum = parseNumber(asset.balance);
      const lockedNum = parseNumber(asset.locked_balance ?? 0);
      const availableRaw = balanceNum != null && lockedNum != null ? balanceNum - lockedNum : null;
      const available = availableRaw != null ? Math.max(0, availableRaw) : null;
      const assetId = Number(asset.asset_id);
      const matchSymbol =
        Number.isFinite(assetId) && this.baseAssetId != null && assetId === this.baseAssetId
          ? this.baseAssetSymbol
          : Number.isFinite(assetId) && this.quoteAssetId != null && assetId === this.quoteAssetId
            ? this.quoteAssetSymbol
            : null;
      const assetSymbol =
        (matchSymbol ?? asset.symbol ?? (asset.asset_id != null ? String(asset.asset_id) : "ASSET")).toUpperCase();
      list.push({
        asset: assetSymbol,
        walletBalance: asset.balance ?? "0",
        availableBalance: available != null && Number.isFinite(available) ? available.toString() : asset.balance ?? "0",
        updateTime: now,
        assetId: Number.isFinite(assetId) ? assetId : undefined,
      });
    }
    return list.sort((a, b) => a.asset.localeCompare(b.asset));
  }

  private applyPresetMarket(): void {
    const normalized = (this.marketSymbol ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const preset = KNOWN_SPOT_MARKETS[normalized];
    if (!preset) return;
    if (this.marketId == null) this.marketId = preset.marketId;
    if (!this.baseAssetSymbol) this.baseAssetSymbol = preset.base;
    if (!this.quoteAssetSymbol) this.quoteAssetSymbol = preset.quote;
    if (!this.marketType) this.marketType = "spot";
    if (preset.priceDecimals != null) this.priceDecimals = this.priceDecimals ?? preset.priceDecimals;
    if (preset.sizeDecimals != null) this.sizeDecimals = this.sizeDecimals ?? preset.sizeDecimals;
    this.forcedSpotPreset = true;
  }

  private findSpotSibling(
    books: LighterOrderBookMetadata[],
    desiredSymbol: string,
    desiredMarketId?: number | null
  ): LighterOrderBookMetadata | null {
    const parsed = parseBaseQuote(desiredSymbol);
    const base = parsed.base;
    const quote = parsed.quote;
    if (!base || !quote) return null;
    const matches = books.filter((book) => {
      if (normalizeMarketType(book.market_type) !== "spot") return false;
      const forms = normalizeSymbolForms(book.symbol);
      const hasBase = forms.includes(base) || forms.includes(`${base}${quote}`) || forms.includes(`${base}-${quote}`);
      const hasQuote = forms.includes(quote) || forms.includes(`${base}${quote}`) || forms.includes(`${base}-${quote}`);
      const idMatch = desiredMarketId != null && Number(book.market_id) === Number(desiredMarketId);
      return (hasBase && hasQuote) || idMatch;
    });
    if (!matches.length) return null;
    return matches[0];
  }

  async getPrecision(): Promise<{
    priceTick: number;
    qtyStep: number;
    priceDecimals: number;
    sizeDecimals: number;
    marketId: number | null;
    minBaseAmount: number | null;
    minQuoteAmount: number | null;
  }> {
    await this.loadMetadata();
    if (this.priceDecimals == null || this.sizeDecimals == null) {
      throw new Error("Lighter market metadata not initialized");
    }
    const priceTick = decimalsToStep(this.priceDecimals);
    const qtyStep = decimalsToStep(this.sizeDecimals);
    return {
      priceTick,
      qtyStep,
      priceDecimals: this.priceDecimals,
      sizeDecimals: this.sizeDecimals,
      marketId: this.marketId ?? null,
      minBaseAmount: this.minBaseAmount ?? null,
      minQuoteAmount: this.minQuoteAmount ?? null,
    };
  }

  private isSpotMarket(): boolean {
    return (this.marketType ?? "").toLowerCase() === "spot";
  }

  private enforceMinimums(quantity: number, price: number | null | undefined): number {
    let qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("Lighter order requires positive quantity");
    }
    if (this.minBaseAmount != null && Number.isFinite(this.minBaseAmount)) {
      qty = Math.max(qty, this.minBaseAmount);
    }
    if (this.minQuoteAmount != null && Number.isFinite(this.minQuoteAmount) && Number.isFinite(price)) {
      const minByQuote = this.minQuoteAmount / Number(price);
      if (Number.isFinite(minByQuote) && minByQuote > 0) {
        qty = Math.max(qty, minByQuote);
      }
    }
    return qty;
  }

  private getAvailableAssetAmount(assetId?: number | null, symbol?: string | null): { available: number | null; wallet: number | null } {
    if (!this.assets.size) return null;
    const normalizedSymbol = symbol ? symbol.toUpperCase() : null;
    for (const asset of this.assets.values()) {
      const idMatches = assetId != null && Number.isFinite(Number(asset.asset_id)) && Number(asset.asset_id) === assetId;
      const symbolMatches = normalizedSymbol && asset.symbol && asset.symbol.toUpperCase() === normalizedSymbol;
      if (!idMatches && !symbolMatches) continue;
      const balance = parseNumber(asset.balance);
      const locked = parseNumber(asset.locked_balance ?? 0);
      if (balance == null) continue;
      const available = locked != null ? balance - locked : balance;
      return {
        available: Number.isFinite(available) ? available : null,
        wallet: Number.isFinite(balance) ? balance : null,
      };
    }
    return { available: null, wallet: null };
  }

  private assertSpotBalance(params: { isAsk: boolean; quantity: number | null | undefined; price: number | null }): void {
    const qty = Number(params.quantity);
    if (!Number.isFinite(qty) || qty <= 0) return;
    if (params.isAsk) {
      const baseAmounts = this.getAvailableAssetAmount(this.baseAssetId, this.baseAssetSymbol);
      const availableBase = baseAmounts?.available ?? null;
      const walletBase = baseAmounts?.wallet ?? null;
      const effective = Math.max(
        availableBase != null && Number.isFinite(availableBase) ? availableBase : 0,
        walletBase != null && Number.isFinite(walletBase) ? walletBase : 0
      );
      if (effective + 1e-9 < qty) {
        throw new Error(
          `Insufficient base asset (${this.baseAssetSymbol ?? "BASE"} available ${availableBase ?? 0}${
            walletBase != null ? ` wallet ${walletBase}` : ""
          }) for spot sell ${qty}`
        );
      }
      return;
    }
    const price = Number(params.price);
    if (!Number.isFinite(price) || price <= 0) return;
    const requiredQuote = qty * price;
    const availableQuote = this.getAvailableAssetAmount(this.quoteAssetId, this.quoteAssetSymbol);
    if (availableQuote != null && availableQuote + 1e-9 < requiredQuote) {
      throw new Error(
        `Insufficient quote asset (${this.quoteAssetSymbol ?? "QUOTE"} available ${availableQuote}) for spot buy requiring ${requiredQuote}`
      );
    }
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
    const wantsSpot = guessMarketType(this.marketSymbol) === "spot" || this.marketType === "spot";
    if (wantsSpot && this.marketType !== "spot") {
      throw new Error(
        `Refusing to place order on non-spot market (marketId=${this.marketId}, type=${this.marketType ?? "unknown"}) for symbol=${this.marketSymbol}`
      );
    }
    if (params.quantity == null || !Number.isFinite(params.quantity)) {
      throw new Error("Lighter orders require quantity");
    }
    if (process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true") {
      // eslint-disable-next-line no-console
      console.error(
        "[LighterGateway] createOrder.inputs",
        JSON.stringify({
          marketId: this.marketId,
          marketType: this.marketType,
          priceDecimals: this.priceDecimals,
          sizeDecimals: this.sizeDecimals,
          symbol: this.marketSymbol,
          wantsSpot,
        })
      );
    }
    const side = params.side;
    const isAsk = side === "SELL" ? 1 : 0;
    const enforcedQty = this.enforceMinimums(params.quantity, params.price ?? null);
    if (this.isSpotMarket() && isAsk === 1) {
      const availableBase = this.getAvailableAssetAmount(this.baseAssetId, this.baseAssetSymbol);
      if (availableBase != null && availableBase + 1e-9 < enforcedQty) {
        throw new Error(
          `Spot sell quantity ${enforcedQty} exceeds available base ${availableBase} (min trade size may be higher than balance)`
        );
      }
    }
    const baseAmount = scaleQuantityWithMinimum(enforcedQty, this.sizeDecimals);
    const baseAmountScaledString = scaledToDecimalString(baseAmount, this.sizeDecimals);
    const clientOrderIndex = BigInt(Date.now() % Number.MAX_SAFE_INTEGER);
    let priceScaled = params.price != null ? decimalToScaled(params.price, this.priceDecimals) : null;
    if ((params.type === "MARKET" || params.type === "STOP_MARKET") && priceScaled == null) {
      priceScaled = decimalToScaled(this.estimateMarketPrice(side), this.priceDecimals);
    }
    if (priceScaled == null) {
      throw new Error("Lighter order requires price");
    }
    const reduceOnly =
      this.isSpotMarket() ? 0 : params.reduceOnly === "true" || params.closePosition === "true" ? 1 : 0;
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

    const resolvedPrice =
      params.price ??
      (() => {
        try {
          return Number(scaledToDecimalString(priceScaled, this.priceDecimals));
        } catch {
          return null;
        }
      })();
    if (this.isSpotMarket()) {
      this.assertSpotBalance({
        isAsk: isAsk === 1,
        quantity: params.quantity,
        price: resolvedPrice,
      });
    }

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
    const key = normalizePriceKey(level.price);
    map.set(key, normalizeSizeValue(level.size));
  }
  for (const update of updates) {
    const key = normalizePriceKey(update.price);
    if (Number(update.size) <= 0) {
      map.delete(key);
    } else {
      map.set(key, normalizeSizeValue(update.size));
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
        const price = normalizePriceKey(entry[0] as string | number);
        const size = normalizeSizeValue(entry[1]);
        return { price, size } as LighterOrderBookLevel;
      }
      const obj = entry as LighterOrderBookLevel;
      return {
        price: normalizePriceKey(obj.price),
        size: normalizeSizeValue(obj.size),
      } as LighterOrderBookLevel;
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

function normalizePriceKey(value: string | number | undefined): string {
  if (value == null) return "0";
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return String(value).trim();
  }
  const fixed = num.toFixed(12);
  return fixed.replace(/\.?0+$/, "") || "0";
}

function normalizeSizeValue(value: string | number | undefined): string {
  if (value == null) return "0";
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return String(value).trim();
  }
  if (Math.abs(num) < 1e-12) return "0";
  return num.toString();
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

function decimalsToStep(decimals: number): number {
  if (!Number.isFinite(decimals) || decimals <= 0) {
    return 1;
  }
  const step = Number(`1e-${decimals}`);
  return Number.isFinite(step) ? step : Math.pow(10, -decimals);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function parseNumber(value: string | number): number | null {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
}

function parseBaseQuote(symbol: string | null | undefined): { base?: string; quote?: string } {
  if (!symbol) return {};
  const sanitized = symbol.toUpperCase();
  const delimiters = ["/", "-", ":"];
  for (const delimiter of delimiters) {
    if (sanitized.includes(delimiter)) {
      const [base, quote] = sanitized.split(delimiter);
      return { base: base || undefined, quote: quote || undefined };
    }
  }
  if (sanitized.length >= 6) {
    // Fall back to first 3/remaining split for compact symbols like ETHUSDC
    return { base: sanitized.slice(0, 3), quote: sanitized.slice(3) };
  }
  return { base: sanitized };
}

function normalizeMarketType(value: string | null | undefined): "perp" | "spot" | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (normalized === "spot") return "spot";
  if (normalized === "perp" || normalized === "perpetual" || normalized === "futures") return "perp";
  return undefined;
}

function guessMarketType(symbol: string | null | undefined): "perp" | "spot" | null {
  if (!symbol) return null;
  const upper = symbol.toUpperCase();
  if (upper.includes("/") || upper.includes("-") || upper.includes(":") || upper.endsWith("USDC")) {
    return "spot";
  }
  return null;
}

function isInvalidNonce(error: unknown): boolean {
  const message = typeof error === "string" ? error : error instanceof Error ? error.message : String(error);
  return message.includes("invalid nonce") || message.includes("\"code\":21104") || message.includes("21104");
}

function extractJsonRequestId(message: any): string | null {
  if (!message || typeof message !== "object") return null;
  const direct = (message as { id?: unknown }).id;
  const nested = (message as { data?: { id?: unknown } }).data?.id;
  const value = direct ?? nested;
  if (value === undefined || value === null) return null;
  const str = String(value);
  return str ? str : null;
}

function tryParseTxInfo(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
}

function normalizeSymbolForms(value: string | null | undefined): string[] {
  if (!value) return [];
  const upper = value.toUpperCase();
  const sanitized = upper.replace(/[^A-Z0-9]/g, "");
  const parts = upper.split(/[-:/]/).filter(Boolean);
  const base = parts.length ? parts[0] : "";
  const forms = new Set<string>();
  if (upper) forms.add(upper);
  if (sanitized) forms.add(sanitized);
  if (base) forms.add(base);
  return Array.from(forms);
}
