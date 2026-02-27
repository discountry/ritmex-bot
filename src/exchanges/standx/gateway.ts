import NodeWebSocket from "ws";
import crypto from "crypto";
import { sign, utils as edUtils, hashes as edHashes } from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import type {
  AccountListener,
  DepthListener,
  FundingRateListener,
  KlineListener,
  OrderListener,
  RestHealthInfo,
  RestHealthListener,
  RestHealthState,
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
  OrderSide,
  OrderType,
  TimeInForce,
} from "../types";
import type {
  StandxBalance,
  StandxBalanceSnapshot,
  StandxDepthBook,
  StandxKlineHistory,
  StandxOrder,
  StandxPosition,
  StandxPrice,
  StandxSymbolInfo,
  StandxSymbolMarket,
} from "./types";

const WebSocketCtor: typeof globalThis.WebSocket =
  typeof globalThis.WebSocket !== "undefined"
    ? globalThis.WebSocket
    : ((NodeWebSocket as unknown) as typeof globalThis.WebSocket);

(edUtils as any).sha512 = sha512;
(edHashes as any).sha512 = sha512;

const DEFAULT_BASE_URL = "https://perps.standx.com";
const DEFAULT_WS_URL = "wss://perps.standx.com/ws-stream/v1";
const DEFAULT_KLINE_LIMIT = 200;
const KLINE_REFRESH_MS = 30_000;
const FUNDING_REFRESH_MS = 60_000;

// ========== WebSocket 连接管理常量 ==========
// 基础重连延迟（毫秒）
const WS_RECONNECT_DELAY_BASE = 2000;
// 最大重连延迟（毫秒）- 指数退避上限
const WS_RECONNECT_DELAY_MAX = 30_000;
// 心跳超时（毫秒）- StandX 服务器 5 分钟无 pong 会断连，我们设置 2 分钟作为安全阈值
const WS_HEARTBEAT_TIMEOUT = 120_000;
// 心跳检查间隔（毫秒）- 每 30 秒检查一次是否收到消息
const WS_HEARTBEAT_CHECK_INTERVAL = 30_000;
// 数据过时阈值（毫秒）- 超过此时间未收到行情/仓位数据，启动 REST 主动拉取
const WS_DATA_STALE_THRESHOLD = 3000;
// REST 轮询间隔（毫秒）- WS 断连或数据过时时的 REST 拉取间隔
const REST_POLL_INTERVAL = 2000;
const REST_ERROR_DEFENSE_THRESHOLD = 3;

const SUPPORTED_QUOTES = ["USD", "USDT", "USDC", "DUSD"];

type PollTimer = ReturnType<typeof setInterval> | null;

type FundingState = {
  rate: number;
  updatedAt: number;
};

type VirtualStop = {
  order: AsterOrder;
  stopPrice: number;
  side: OrderSide;
  symbol: string;
  quantity: number;
  reduceOnly: boolean;
};

export interface StandxGatewayOptions {
  token?: string;
  symbol: string;
  baseUrl?: string;
  wsUrl?: string;
  sessionId?: string;
  signingKey?: string;
  debugWs?: boolean;
  debugWsRaw?: boolean;
  logger?: (context: string, error: unknown) => void;
}

export type ConnectionEventType = "disconnected" | "reconnected";
export type ConnectionEventListener = (event: ConnectionEventType, symbol: string) => void;

class StandxRequestSigner {
  private readonly privateKey: Uint8Array | null;

  constructor(privateKeyRaw?: string) {
    this.privateKey = parseSigningKey(privateKeyRaw);
  }

  hasKey(): boolean {
    return Boolean(this.privateKey);
  }

  async signPayload(payload: string): Promise<Record<string, string> | null> {
    if (!this.privateKey) return null;
    const version = "v1";
    const requestId = crypto.randomUUID();
    const timestamp = Date.now();
    const signMessage = `${version},${requestId},${timestamp},${payload}`;
    const signatureBytes = sign(Buffer.from(signMessage, "utf-8"), this.privateKey);
    return {
      "x-request-sign-version": version,
      "x-request-id": requestId,
      "x-request-timestamp": String(timestamp),
      "x-request-signature": Buffer.from(signatureBytes).toString("base64"),
    };
  }
}

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function decodeBase58(input: string): Uint8Array | null {
  try {
    const bytes: number[] = [];
    for (const char of input) {
      const value = BASE58_ALPHABET.indexOf(char);
      if (value === -1) return null;
      let carry = value;
      for (let i = 0; i < bytes.length; i += 1) {
        const current = bytes[i] ?? 0;
        carry += current * 58;
        bytes[i] = carry & 0xff;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }
    // Handle leading zeros
    for (const char of input) {
      if (char !== "1") break;
      bytes.push(0);
    }
    return Uint8Array.from(bytes.reverse());
  } catch {
    return null;
  }
}

function parseSigningKey(value?: string): Uint8Array | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // 0x-prefixed hex
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    return Uint8Array.from(Buffer.from(trimmed.slice(2), "hex"));
  }
  // Pure hex (64 chars = 32 bytes for ed25519 private key)
  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    return Uint8Array.from(Buffer.from(trimmed, "hex"));
  }
  // Base58 (official StandX API format)
  if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
    const decoded = decodeBase58(trimmed);
    if (decoded && decoded.length === 32) {
      return decoded;
    }
  }
  // Base64 fallback
  try {
    const decoded = Uint8Array.from(Buffer.from(trimmed, "base64"));
    if (decoded.length === 32) {
      return decoded;
    }
  } catch {
    // ignore
  }
  return null;
}

function normalizeSymbol(raw: string): string {
  const upper = raw.trim().toUpperCase();
  if (!upper) return upper;
  if (upper.includes("/")) return upper.replace("/", "-");
  if (upper.includes("-")) {
    return upper.endsWith("-DUSD") ? upper.replace("-DUSD", "-USD") : upper;
  }
  for (const quote of SUPPORTED_QUOTES) {
    if (upper.endsWith(quote) && upper.length > quote.length) {
      const base = upper.slice(0, -quote.length);
      const symbol = `${base}-${quote}`;
      return symbol.endsWith("-DUSD") ? symbol.replace("-DUSD", "-USD") : symbol;
    }
  }
  return upper;
}

function toDecimalString(value: number | string | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return undefined;
  return String(value);
}

function toBooleanFlag(value: string | boolean | undefined): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function toTimestamp(value: string | number | undefined): number {
  if (value == null) return Date.now();
  if (typeof value === "number") return value;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function mapOrderSide(value: string | undefined): OrderSide {
  if (!value) return "BUY";
  return value.toUpperCase() === "SELL" ? "SELL" : "BUY";
}

function mapOrderType(value: string | undefined): OrderType {
  const upper = (value ?? "").toUpperCase();
  if (upper === "MARKET") return "MARKET";
  if (upper.includes("TRAIL")) return "TRAILING_STOP_MARKET";
  if (upper.includes("STOP")) return "STOP_MARKET";
  return "LIMIT";
}

function mapTimeInForce(value: TimeInForce | undefined, orderType: OrderType): string {
  const normalized = value ?? (orderType === "MARKET" ? "IOC" : "GTX");
  switch (normalized) {
    case "IOC":
      return "ioc";
    case "FOK":
      return "ioc";
    case "GTX":
      return "alo";
    case "GTC":
    default:
      return "gtc";
  }
}

function resolutionFromInterval(interval: string): { resolution: string; seconds: number } {
  const normalized = interval.trim().toLowerCase();
  if (normalized === "1m" || normalized === "1") return { resolution: "1", seconds: 60 };
  if (normalized === "5m" || normalized === "5") return { resolution: "5", seconds: 300 };
  if (normalized === "15m" || normalized === "15") return { resolution: "15", seconds: 900 };
  if (normalized === "1h" || normalized === "60") return { resolution: "60", seconds: 3600 };
  if (normalized === "1d") return { resolution: "1D", seconds: 86400 };
  if (normalized === "1w") return { resolution: "1W", seconds: 604800 };
  const match = normalized.match(/^(\d+)(m|h)$/);
  if (match) {
    const amount = Number(match[1]);
    const unit = match[2];
    if (unit === "m" && Number.isFinite(amount) && amount > 0) {
      return { resolution: String(amount), seconds: amount * 60 };
    }
    if (unit === "h" && Number.isFinite(amount) && amount > 0) {
      return { resolution: String(amount * 60), seconds: amount * 3600 };
    }
  }
  return { resolution: "1", seconds: 60 };
}

function mergeOrderSnapshot(map: Map<string, AsterOrder>, order: AsterOrder): void {
  const key = String(order.orderId);
  const existing = map.get(key);
  if (!existing) {
    map.set(key, order);
    return;
  }
  map.set(key, { ...existing, ...order });
}

function extractOrders(payload: unknown): StandxOrder[] {
  if (Array.isArray(payload)) return payload as StandxOrder[];
  if (payload && typeof payload === "object") {
    const result = (payload as { result?: StandxOrder[] }).result;
    if (Array.isArray(result)) return result;
  }
  return [];
}

function normalizeDepthLevels(levels: [string, string][], side: "bid" | "ask"): [string, string][] {
  const sorted = [...levels].sort((a, b) => {
    const priceA = Number(a?.[0] ?? 0);
    const priceB = Number(b?.[0] ?? 0);
    if (!Number.isFinite(priceA) || !Number.isFinite(priceB)) return 0;
    return side === "bid" ? priceB - priceA : priceA - priceB;
  });
  return sorted;
}

function decrossDepthBook(
  bids: [string, string][],
  asks: [string, string][]
): { bids: [string, string][]; asks: [string, string][]; crossed: boolean; mode: "dropAsks" | "dropBids" | "none" } {
  const bestBid = Number(bids[0]?.[0]);
  const bestAsk = Number(asks[0]?.[0]);
  if (!Number.isFinite(bestBid) || !Number.isFinite(bestAsk) || bestBid < bestAsk) {
    return { bids, asks, crossed: false, mode: "none" };
  }

  const asksAboveBid = asks.filter(([price]) => Number(price) > bestBid);
  if (asksAboveBid.length) {
    return { bids, asks: asksAboveBid, crossed: true, mode: "dropAsks" };
  }

  const bidsBelowAsk = bids.filter(([price]) => Number(price) < bestAsk);
  if (bidsBelowAsk.length) {
    return { bids: bidsBelowAsk, asks, crossed: true, mode: "dropBids" };
  }

  return { bids, asks, crossed: true, mode: "none" };
}

function parseJsonPayloads(raw: unknown): any[] {
  if (raw == null) return [];
  if (typeof raw === "object" && !Buffer.isBuffer(raw) && !(raw instanceof ArrayBuffer)) {
    return [raw];
  }
  let text: string;
  if (typeof raw === "string") {
    text = raw;
  } else if (Buffer.isBuffer(raw)) {
    text = raw.toString("utf-8");
  } else if (raw instanceof ArrayBuffer) {
    text = Buffer.from(raw).toString("utf-8");
  } else {
    text = String(raw);
  }
  const trimmed = text.trim();
  if (!trimmed) return [];
  try {
    return [JSON.parse(trimmed)];
  } catch {
    // fall through to multi-payload parsing
  }

  const payloads: any[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < trimmed.length; i += 1) {
    const char = trimmed[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{" || char === "[") {
      if (depth === 0) start = i;
      depth += 1;
      continue;
    }
    if (char === "}" || char === "]") {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && start >= 0) {
        const slice = trimmed.slice(start, i + 1);
        try {
          payloads.push(JSON.parse(slice));
        } catch {
          // ignore malformed chunk
        }
        start = -1;
      }
    }
  }
  return payloads;
}

export class StandxGateway {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly wsUrl: string;
  private readonly sessionId: string;
  private readonly logger: (context: string, error: unknown) => void;
  private readonly signer: StandxRequestSigner;
  private readonly debugWs: boolean;
  private readonly debugWsRaw: boolean;
  private signatureWarningLogged = false;

  private initialized = false;
  private initializing: Promise<void> | null = null;

  private readonly accountListeners = new Set<AccountListener>();
  private readonly orderListeners = new Set<OrderListener>();
  private readonly depthListeners = new Map<string, Set<DepthListener>>();
  private readonly tickerListeners = new Map<string, Set<TickerListener>>();
  private readonly klineListeners = new Map<string, Set<KlineListener>>();
  private readonly fundingListeners = new Map<string, Set<FundingRateListener>>();
  private readonly connectionListeners = new Set<ConnectionEventListener>();

  private readonly openOrders = new Map<string, AsterOrder>();
  private readonly positions = new Map<string, AsterAccountPosition>();
  private readonly balances = new Map<string, AsterAccountAsset>();
  private readonly virtualStops = new Map<string, VirtualStop>();

  private accountSnapshot: AsterAccountSnapshot | null = null;
  private readonly restHealthListeners = new Set<RestHealthListener>();
  private restConsecutiveErrors = 0;
  private restUnhealthy = false;
  private restLastError: string | null = null;
  private fundingState = new Map<string, FundingState>();

  private marketWs: WebSocket | null = null;
  private marketWsReady = false;
  private marketWsAuthed = false;
  private marketWsAuthRequested = false;
  private marketReconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly subscriptions = new Set<string>();

  // ========== 心跳与连接管理 ==========
  // 上次收到消息的时间戳
  private lastMessageTime = 0;
  // 心跳检查定时器
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  // 重连次数（用于指数退避）
  private reconnectAttempts = 0;

  // ========== 数据过时检测与 REST 备用 ==========
  // 上次收到行情数据（price/depth）的时间戳
  private lastMarketDataTime = 0;
  // 上次收到账户数据（position/balance）的时间戳
  private lastAccountDataTime = 0;
  // 数据过时检查定时器
  private dataStaleCheckTimer: ReturnType<typeof setInterval> | null = null;
  // REST 轮询定时器（WS 断连时启用）
  private restPollTimer: ReturnType<typeof setInterval> | null = null;
  // REST 轮询是否激活
  private restPollActive = false;

  private readonly klineTimers = new Map<string, PollTimer>();
  private readonly fundingTimers = new Map<string, PollTimer>();

  private lastPriceBySymbol = new Map<string, number>();

  // 断连保护相关
  private disconnectCancelRetryTimer: ReturnType<typeof setTimeout> | null = null;
  private disconnectCancelRetryActive = false;
  private lastKnownOpenOrders: Array<{ orderId: string; clOrdId?: string }> = [];
  private disconnectedSymbol: string | null = null;

  constructor(options: StandxGatewayOptions) {
    this.token = options.token ?? process.env.STANDX_TOKEN ?? "";
    if (!this.token) {
      throw new Error("Missing STANDX_TOKEN environment variable");
    }
    this.baseUrl = options.baseUrl ?? process.env.STANDX_BASE_URL ?? DEFAULT_BASE_URL;
    this.wsUrl = options.wsUrl ?? process.env.STANDX_WS_URL ?? DEFAULT_WS_URL;
    this.sessionId = options.sessionId ?? process.env.STANDX_SESSION_ID ?? crypto.randomUUID();
    this.logger = options.logger ?? ((context, error) => console.error(`[StandxGateway] ${context}:`, error));
    const signingKey = options.signingKey ?? process.env.STANDX_REQUEST_PRIVATE_KEY;
    this.signer = new StandxRequestSigner(signingKey);
    this.debugWs = toBooleanFlag(options.debugWs ?? process.env.STANDX_WS_DEBUG);
    this.debugWsRaw = toBooleanFlag(options.debugWsRaw ?? process.env.STANDX_WS_DEBUG_RAW);
  }

  async ensureInitialized(symbol: string): Promise<void> {
    if (this.initialized) return;
    if (this.initializing) return this.initializing;
    const normalized = normalizeSymbol(symbol);
    this.initializing = (async () => {
      await this.refreshAccountSnapshot();
      await this.refreshOpenOrders(normalized);
      this.connectMarketWs();
      this.initialized = true;
    })().catch((error) => {
      this.initializing = null;
      throw error;
    });
    return this.initializing;
  }

  onAccount(listener: AccountListener): void {
    this.accountListeners.add(listener);
    if (this.accountSnapshot) {
      listener(this.accountSnapshot);
    }
    this.subscribeStream({ channel: "position" });
    this.subscribeStream({ channel: "balance" });
    this.sendAuthIfNeeded();
  }

  onOrders(listener: OrderListener): void {
    this.orderListeners.add(listener);
    this.emitOrders();
    this.subscribeStream({ channel: "order" });
    this.sendAuthIfNeeded();
  }

  onDepth(symbol: string, listener: DepthListener): void {
    const key = normalizeSymbol(symbol);
    let listeners = this.depthListeners.get(key);
    if (!listeners) {
      listeners = new Set();
      this.depthListeners.set(key, listeners);
    }
    listeners.add(listener);
    this.subscribeStream({ channel: "depth_book", symbol: key });
    void this.fetchDepthSnapshot(key).catch((error) => this.logger("depthSnapshot", error));
  }

  onTicker(symbol: string, listener: TickerListener): void {
    const key = normalizeSymbol(symbol);
    let listeners = this.tickerListeners.get(key);
    if (!listeners) {
      listeners = new Set();
      this.tickerListeners.set(key, listeners);
    }
    listeners.add(listener);
    this.subscribeStream({ channel: "price", symbol: key });
    void this.fetchTickerSnapshot(key).catch((error) => this.logger("tickerSnapshot", error));
  }

  onKlines(symbol: string, interval: string, listener: KlineListener): void {
    const key = `${normalizeSymbol(symbol)}:${interval}`;
    let listeners = this.klineListeners.get(key);
    if (!listeners) {
      listeners = new Set();
      this.klineListeners.set(key, listeners);
    }
    listeners.add(listener);
    this.startKlinePolling(symbol, interval);
  }

  onFundingRate(symbol: string, listener: FundingRateListener): void {
    const key = normalizeSymbol(symbol);
    let listeners = this.fundingListeners.get(key);
    if (!listeners) {
      listeners = new Set();
      this.fundingListeners.set(key, listeners);
    }
    listeners.add(listener);
    this.startFundingPolling(key);
  }

  onConnectionEvent(listener: ConnectionEventListener): void {
    this.connectionListeners.add(listener);
  }

  onRestHealthEvent(listener: RestHealthListener): void {
    this.restHealthListeners.add(listener);
  }

  offRestHealthEvent(listener: RestHealthListener): void {
    this.restHealthListeners.delete(listener);
  }

  offConnectionEvent(listener: ConnectionEventListener): void {
    this.connectionListeners.delete(listener);
  }

  /**
   * 查询当前真实的挂单状态（通过 HTTP API）
   * 用于在网络恢复后验证实际挂单情况
   */
  async queryOpenOrders(symbol: string): Promise<AsterOrder[]> {
    const normalized = normalizeSymbol(symbol);
    const ordersPayload = await this.requestJson<unknown>("/api/query_open_orders", {
      method: "GET",
      params: { symbol: normalized },
    });
    const orders = extractOrders(ordersPayload);
    const result: AsterOrder[] = [];
    for (const raw of orders) {
      const order = this.mapOrder(raw);
      result.push(order);
    }
    return result;
  }

  /**
   * 强制取消所有挂单（用于断连保护）
   * 会不断重试直到成功或确认没有挂单
   */
  async forceCancelAllOrders(symbol: string): Promise<boolean> {
    const normalized = normalizeSymbol(symbol);
    try {
      const currentOrders = await this.queryOpenOrders(normalized);
      if (currentOrders.length === 0) {
        return true;
      }
      await this.cancelAllOrders({ symbol: normalized });
      // 再次查询确认
      const afterCancel = await this.queryOpenOrders(normalized);
      return afterCancel.length === 0;
    } catch (error) {
      this.logger("forceCancelAllOrders", error);
      return false;
    }
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    const normalizedSymbol = normalizeSymbol(params.symbol);
    if (params.type === "STOP_MARKET") {
      return this.createVirtualStopOrder(normalizedSymbol, params);
    }
    if (params.type === "TRAILING_STOP_MARKET") {
      throw new Error("StandX does not support trailing stop orders");
    }
    return this.submitOrder(normalizedSymbol, params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    const orderKey = String(params.orderId);
    if (this.virtualStops.has(orderKey)) {
      const virtual = this.virtualStops.get(orderKey);
      if (virtual) {
        virtual.order.status = "CANCELED";
        virtual.order.updateTime = Date.now();
        this.virtualStops.delete(orderKey);
        this.emitOrders();
      }
      return;
    }
    const payload: Record<string, unknown> = {};
    const numeric = Number(orderKey);
    if (Number.isFinite(numeric) && `${numeric}` === orderKey) {
      payload.order_id = numeric;
    } else {
      payload.cl_ord_id = orderKey;
    }
    await this.requestJson("/api/cancel_order", {
      method: "POST",
      body: payload,
      signed: true,
      extraHeaders: {
        "x-session-id": this.sessionId,
      },
    });
    const existing = this.openOrders.get(orderKey);
    if (existing) {
      existing.status = "CANCELED";
      existing.updateTime = Date.now();
      mergeOrderSnapshot(this.openOrders, existing);
      this.emitOrders();
    }
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    const orderIds = params.orderIdList.map((value) => String(value));
    const clOrdIdList: string[] = [];
    const orderIdList: number[] = [];
    for (const id of orderIds) {
      if (this.virtualStops.has(id)) {
        const virtual = this.virtualStops.get(id);
        if (virtual) {
          virtual.order.status = "CANCELED";
          virtual.order.updateTime = Date.now();
          this.virtualStops.delete(id);
        }
        continue;
      }
      const numeric = Number(id);
      if (Number.isFinite(numeric) && `${numeric}` === id) {
        orderIdList.push(numeric);
      } else {
        clOrdIdList.push(id);
      }
    }
    if (orderIdList.length === 0 && clOrdIdList.length === 0) {
      this.emitOrders();
      return;
    }
    await this.requestJson("/api/cancel_orders", {
      method: "POST",
      body: {
        ...(orderIdList.length ? { order_id_list: orderIdList } : {}),
        ...(clOrdIdList.length ? { cl_ord_id_list: clOrdIdList } : {}),
      },
      signed: true,
      extraHeaders: {
        "x-session-id": this.sessionId,
      },
    });
    const now = Date.now();
    for (const id of orderIds) {
      const existing = this.openOrders.get(id);
      if (existing) {
        existing.status = "CANCELED";
        existing.updateTime = now;
        mergeOrderSnapshot(this.openOrders, existing);
      }
    }
    this.emitOrders();
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    this.virtualStops.clear();
    const symbol = normalizeSymbol(params.symbol);
    const openOrdersPayload = await this.requestJson<unknown>("/api/query_open_orders", {
      method: "GET",
      params: { symbol },
    });
    const openOrders = extractOrders(openOrdersPayload);
    const orderIdList: number[] = [];
    const clOrdIdList: string[] = [];
    for (const order of openOrders) {
      const clOrdId = order.cl_ord_id;
      if (clOrdId) {
        clOrdIdList.push(clOrdId);
        continue;
      }
      if (order.id != null) {
        orderIdList.push(Number(order.id));
      }
    }
    if (orderIdList.length || clOrdIdList.length) {
      await this.requestJson("/api/cancel_orders", {
        method: "POST",
        body: {
          ...(orderIdList.length ? { order_id_list: orderIdList } : {}),
          ...(clOrdIdList.length ? { cl_ord_id_list: clOrdIdList } : {}),
        },
        signed: true,
        extraHeaders: {
          "x-session-id": this.sessionId,
        },
      });
    }
    this.openOrders.clear();
    this.emitOrders();
  }

  async getPrecision(symbol: string): Promise<{
    priceTick: number;
    qtyStep: number;
    priceDecimals?: number;
    sizeDecimals?: number;
    minBaseAmount?: number;
  } | null> {
    const normalized = normalizeSymbol(symbol);
    const info = await this.requestJson<StandxSymbolInfo[]>("/api/query_symbol_info", {
      method: "GET",
      params: { symbol: normalized },
    });
    const found = Array.isArray(info) ? info[0] : null;
    if (!found) return null;
    const priceDecimals = Number(found.price_tick_decimals);
    const sizeDecimals = Number(found.qty_tick_decimals);
    let priceTick = Number.isFinite(priceDecimals) ? Math.pow(10, -priceDecimals) : Number.NaN;
    const qtyStep = Number.isFinite(sizeDecimals) ? Math.pow(10, -sizeDecimals) : Number.NaN;
    if (!Number.isFinite(priceTick) && found.depth_ticks) {
      const firstTick = found.depth_ticks.split(",")[0];
      const parsed = Number(firstTick);
      if (Number.isFinite(parsed) && parsed > 0) {
        priceTick = parsed;
      }
    }
    const minBaseAmount = found.min_order_qty ? Number(found.min_order_qty) : undefined;
    return {
      priceTick: Number.isFinite(priceTick) ? priceTick : 0.01,
      qtyStep: Number.isFinite(qtyStep) ? qtyStep : 0.001,
      priceDecimals: Number.isFinite(priceDecimals) ? priceDecimals : undefined,
      sizeDecimals: Number.isFinite(sizeDecimals) ? sizeDecimals : undefined,
      minBaseAmount: Number.isFinite(minBaseAmount) ? minBaseAmount : undefined,
    };
  }

  private async createVirtualStopOrder(symbol: string, params: CreateOrderParams): Promise<AsterOrder> {
    const stopPrice = Number(params.stopPrice);
    if (!Number.isFinite(stopPrice)) {
      throw new Error("STOP_MARKET requires stopPrice for StandX");
    }
    const quantity = Number(params.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("STOP_MARKET requires quantity for StandX");
    }
    const now = Date.now();
    const clientOrderId = crypto.randomUUID();
    const order: AsterOrder = {
      orderId: clientOrderId,
      clientOrderId,
      symbol,
      side: params.side,
      type: "STOP_MARKET",
      status: "NEW",
      price: "0",
      origQty: String(quantity),
      executedQty: "0",
      stopPrice: String(stopPrice),
      time: now,
      updateTime: now,
      reduceOnly: toBooleanFlag(params.reduceOnly),
      closePosition: toBooleanFlag(params.closePosition),
      timeInForce: params.timeInForce,
    };
    this.virtualStops.set(clientOrderId, {
      order,
      stopPrice,
      side: params.side,
      symbol,
      quantity,
      reduceOnly: toBooleanFlag(params.reduceOnly),
    });
    this.emitOrders();
    return order;
  }

  private async submitOrder(symbol: string, params: CreateOrderParams): Promise<AsterOrder> {
    const orderType = params.type === "MARKET" ? "market" : "limit";
    const clientOrderId = crypto.randomUUID();
    const qty = toDecimalString(params.quantity);
    if (!qty) {
      throw new Error("Order requires quantity for StandX");
    }
    const payload: Record<string, unknown> = {
      symbol,
      side: params.side.toLowerCase(),
      order_type: orderType,
      qty,
      time_in_force: mapTimeInForce(params.timeInForce, params.type),
      reduce_only: toBooleanFlag(params.reduceOnly),
      cl_ord_id: clientOrderId,
    };
    if (orderType === "limit") {
      const price = toDecimalString(params.price);
      if (!price) {
        throw new Error("LIMIT order requires price for StandX");
      }
      payload.price = price;
    }
    // StandX TPSL 参数
    if (params.slPrice != null && Number.isFinite(params.slPrice)) {
      payload.sl_price = toDecimalString(params.slPrice);
    }
    if (params.tpPrice != null && Number.isFinite(params.tpPrice)) {
      payload.tp_price = toDecimalString(params.tpPrice);
    }
    const response = await this.requestJson<{ code?: number; message?: string; request_id?: string }>(
      "/api/new_order",
      {
        method: "POST",
        body: payload,
        signed: true,
        extraHeaders: {
          "x-session-id": this.sessionId,
        },
      }
    );
    if (response && typeof response.code === "number" && response.code !== 0) {
      throw new Error(response.message ?? "StandX order rejected");
    }
    const now = Date.now();
    const order: AsterOrder = {
      orderId: clientOrderId,
      clientOrderId,
      symbol,
      side: params.side,
      type: params.type,
      status: "NEW",
      price: String(params.price ?? 0),
      origQty: String(params.quantity ?? 0),
      executedQty: "0",
      stopPrice: String(params.stopPrice ?? 0),
      time: now,
      updateTime: now,
      reduceOnly: toBooleanFlag(params.reduceOnly),
      closePosition: toBooleanFlag(params.closePosition),
      timeInForce: params.timeInForce,
    };
    mergeOrderSnapshot(this.openOrders, order);
    this.emitOrders();
    return order;
  }

  private connectMarketWs(): void {
    if (this.marketWs || this.marketReconnectTimer) return;
    this.marketWs = new WebSocketCtor(this.wsUrl);
    this.marketWsReady = false;
    this.marketWsAuthed = false;
    this.marketWsAuthRequested = false;
    const handleOpen = () => {
      this.marketWsReady = true;
      this.marketWsAuthed = false;
      // 重置重连计数和时间戳
      this.reconnectAttempts = 0;
      this.lastMessageTime = Date.now();
      this.lastMarketDataTime = Date.now();
      this.lastAccountDataTime = Date.now();
      this.logDebug("ws open");
      // 启动心跳监控
      this.startHeartbeatMonitor();
      // 启动数据过时检测
      this.startDataStaleCheck();
      // 停止 REST 轮询（WS 恢复后不再需要）
      this.stopRestPoll();
      this.sendAuthIfNeeded();
    };
    const handleClose = () => {
      const wasReady = this.marketWsReady;
      this.marketWsReady = false;
      this.marketWsAuthed = false;
      this.marketWsAuthRequested = false;
      this.marketWs = null;
      // 停止心跳监控和数据过时检测
      this.stopHeartbeatMonitor();
      this.stopDataStaleCheck();
      this.logDebug("ws close");
      // 触发断连事件，启动断连保护
      if (wasReady) {
        this.onDisconnect();
      }
      this.scheduleReconnect();
    };
    const handleError = (error: unknown) => {
      this.logger("marketWs", error);
      // 如果连接从未成功建立（握手失败），需要清理并重连
      // 因为某些 WebSocket 实现在握手失败时可能不触发 close 事件
      if (this.marketWs && !this.marketWsReady) {
        this.marketWs = null;
        this.scheduleReconnect();
      }
    };

    if ("addEventListener" in this.marketWs && typeof this.marketWs.addEventListener === "function") {
      this.marketWs.addEventListener("open", handleOpen);
      this.marketWs.addEventListener("message", (event) => this.handleMarketMessage(event));
      this.marketWs.addEventListener("close", handleClose);
      this.marketWs.addEventListener("error", handleError as any);
    } else if ("on" in this.marketWs && typeof (this.marketWs as any).on === "function") {
      const nodeSocket = this.marketWs as any;
      nodeSocket.on("open", handleOpen);
      nodeSocket.on("message", (data: any) => this.handleMarketMessage({ data }));
      nodeSocket.on("close", handleClose);
      nodeSocket.on("error", handleError);
    } else {
      (this.marketWs as any).onopen = handleOpen;
      (this.marketWs as any).onmessage = (event: { data: any }) => this.handleMarketMessage(event);
      (this.marketWs as any).onclose = handleClose;
      (this.marketWs as any).onerror = handleError;
    }
  }

  private scheduleReconnect(): void {
    if (this.marketReconnectTimer) return;
    // 指数退避：delay = min(base * 2^attempts, max)
    const delay = Math.min(
      WS_RECONNECT_DELAY_BASE * Math.pow(2, this.reconnectAttempts),
      WS_RECONNECT_DELAY_MAX
    );
    this.reconnectAttempts += 1;
    this.logDebug(`scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.marketReconnectTimer = setTimeout(() => {
      this.marketReconnectTimer = null;
      this.logDebug("attempting reconnect");
      this.connectMarketWs();
    }, delay);
  }

  private handleMarketMessage(event: { data: any }): void {
    // 更新最后收到消息的时间（心跳监控）
    this.lastMessageTime = Date.now();
    this.logRawPayload(event.data);
    const payloads = parseJsonPayloads(event.data);
    if (payloads.length === 0) return;
    for (const message of payloads) {
      this.handleMarketPayload(message);
    }
  }

  private handleMarketPayload(message: any): void {
    const channel = message?.channel;
    if (!channel) return;
    if (this.debugWs) {
      const seq = message?.seq ?? message?.data?.seq;
      const symbol = message?.symbol ?? message?.data?.symbol;
      this.logDebug(`ws ${channel}`, { seq, symbol });
    }
    if (channel === "auth") {
      const code = message?.data?.code;
      const msg = message?.data?.msg ?? message?.data?.message;
      this.logDebug("ws auth", { code, msg });
      if (code === 200 || code === 0) {
        this.marketWsAuthed = true;
        this.marketWsAuthRequested = false;
        this.flushSubscriptions();
        // 触发重连事件
        this.onReconnect();
      }
      return;
    }
    if (channel === "depth_book") {
      // 更新行情数据时间戳
      this.lastMarketDataTime = Date.now();
      const data = message.data as StandxDepthBook | undefined;
      const rawSymbol = data?.symbol ?? message?.symbol;
      if (!rawSymbol || !data) return;
      const bids = normalizeDepthLevels((data.bids ?? []).map(([price, qty]) => [String(price), String(qty)]), "bid");
      const asks = normalizeDepthLevels((data.asks ?? []).map(([price, qty]) => [String(price), String(qty)]), "ask");
      const decrossed = decrossDepthBook(bids, asks);
      const finalBids = decrossed.bids;
      const finalAsks = decrossed.asks;
      if (this.debugWs) {
        const topBid = finalBids[0]?.[0];
        const topAsk = finalAsks[0]?.[0];
        const spread = topBid != null && topAsk != null ? Number(topAsk) - Number(topBid) : null;
        const detail: Record<string, unknown> = {
          topBid,
          topAsk,
          spread,
          bidCount: finalBids.length,
          askCount: finalAsks.length,
          decrossed: decrossed.crossed,
          mode: decrossed.mode,
        };
        if (this.debugWsRaw) {
          detail.bidTop = finalBids.slice(0, 3);
          detail.askTop = finalAsks.slice(0, 3);
        }
        this.logDebug("ws depth stats", detail);
      }
      const depth: AsterDepth = {
        lastUpdateId: Number(message.seq ?? Date.now()),
        bids: finalBids,
        asks: finalAsks,
        eventTime: Date.now(),
        symbol: rawSymbol,
      };
      this.emitDepth(rawSymbol, depth);
      return;
    }
    if (channel === "price") {
      // 更新行情数据时间戳
      this.lastMarketDataTime = Date.now();
      const data = message.data as StandxPrice | undefined;
      if (!data?.symbol) return;
      const ticker = this.mapTicker(data);
      this.emitTicker(data.symbol, ticker);
      return;
    }
    if (channel === "order") {
      // 更新账户数据时间戳
      this.lastAccountDataTime = Date.now();
      const payload = message.data as StandxOrder | StandxOrder[] | undefined;
      if (!payload) return;
      const items = Array.isArray(payload) ? payload : [payload];
      for (const item of items) {
        const order = this.mapOrder(item);
        mergeOrderSnapshot(this.openOrders, order);
      }
      this.emitOrders();
      return;
    }
    if (channel === "position") {
      // 更新账户数据时间戳
      this.lastAccountDataTime = Date.now();
      const payload = message.data as StandxPosition | StandxPosition[] | undefined;
      if (!payload) return;
      const items = Array.isArray(payload) ? payload : [payload];
      for (const item of items) {
        if (!item?.symbol) continue;
        const position = this.mapPosition(item);
        this.positions.set(position.symbol, position);
      }
      this.emitAccountSnapshot();
      return;
    }
    if (channel === "balance") {
      // 更新账户数据时间戳
      this.lastAccountDataTime = Date.now();
      const payload = message.data as StandxBalance | StandxBalance[] | undefined;
      if (!payload) return;
      const items = Array.isArray(payload) ? payload : [payload];
      for (const item of items) {
        if (!item?.token) continue;
        const asset = this.mapBalance(item);
        this.balances.set(asset.asset, asset);
      }
      this.emitAccountSnapshot();
      return;
    }
  }

  private subscribeStream(stream: { channel: string; symbol?: string }): void {
    const key = `${stream.channel}:${stream.symbol ?? ""}`;
    if (this.subscriptions.has(key)) return;
    this.subscriptions.add(key);
    if (!this.marketWsReady) return;
    if (!this.marketWsAuthed) {
      this.logDebug("ws subscribe queued", stream);
      this.sendAuthIfNeeded();
      return;
    }
    this.sendSubscribe(stream);
  }

  private sendAuthIfNeeded(): void {
    if (!this.marketWsReady || this.marketWsAuthed || this.marketWsAuthRequested) return;
    this.marketWsAuthRequested = true;
    this.logDebug("ws auth send");
    const payload = {
      auth: {
        token: this.token,
      },
    };
    this.marketWs?.send(JSON.stringify(payload));
  }

  private flushSubscriptions(): void {
    if (!this.marketWsAuthed) return;
    for (const entry of this.subscriptions) {
      const [channel, symbol] = entry.split(":");
      if (!channel) continue;
      this.sendSubscribe({ channel, ...(symbol ? { symbol } : {}) });
    }
  }

  private sendSubscribe(stream: { channel: string; symbol?: string }): void {
    this.logDebug("ws subscribe send", stream);
    this.marketWs?.send(JSON.stringify({ subscribe: stream }));
  }

  // ========== 心跳监控 ==========
  /**
   * 启动心跳监控
   * 定期检查是否收到消息，如果超时则主动触发重连
   */
  private startHeartbeatMonitor(): void {
    this.stopHeartbeatMonitor();
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastMessageTime;
      if (elapsed > WS_HEARTBEAT_TIMEOUT) {
        this.logDebug(`heartbeat timeout (${elapsed}ms since last message), forcing reconnect`);
        this.forceReconnect("heartbeat_timeout");
      }
    }, WS_HEARTBEAT_CHECK_INTERVAL);
  }

  /**
   * 停止心跳监控
   */
  private stopHeartbeatMonitor(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // ========== 数据过时检测与 REST 备用拉取 ==========
  /**
   * 启动数据过时检测
   * 即使 WS 连接正常，如果超过 3 秒未收到行情/账户数据，也主动通过 REST 拉取
   */
  private startDataStaleCheck(): void {
    this.stopDataStaleCheck();
    this.dataStaleCheckTimer = setInterval(() => {
      const now = Date.now();
      const marketStale = now - this.lastMarketDataTime > WS_DATA_STALE_THRESHOLD;
      const accountStale = now - this.lastAccountDataTime > WS_DATA_STALE_THRESHOLD;

      if (marketStale || accountStale) {
        this.logDebug("data stale detected", {
          marketStaleMs: now - this.lastMarketDataTime,
          accountStaleMs: now - this.lastAccountDataTime,
          marketStale,
          accountStale,
        });
        // 主动通过 REST 拉取数据
        this.fetchStaleData(marketStale, accountStale);
      }
    }, 1000); // 每秒检查一次
  }

  /**
   * 停止数据过时检测
   */
  private stopDataStaleCheck(): void {
    if (this.dataStaleCheckTimer) {
      clearInterval(this.dataStaleCheckTimer);
      this.dataStaleCheckTimer = null;
    }
  }

  /**
   * 主动拉取过时的数据
   */
  private fetchStaleData(marketStale: boolean, accountStale: boolean): void {
    // 获取当前订阅的 symbols
    const symbols = new Set<string>();
    for (const key of this.subscriptions) {
      const [, symbol] = key.split(":");
      if (symbol) symbols.add(symbol);
    }

    if (marketStale) {
      for (const symbol of symbols) {
        void this.fetchTickerSnapshot(symbol).catch((e) => this.logger("staleTickerFetch", e));
        void this.fetchDepthSnapshot(symbol).catch((e) => this.logger("staleDepthFetch", e));
      }
      // 更新时间戳避免重复拉取
      this.lastMarketDataTime = Date.now();
    }

    if (accountStale) {
      void this.refreshAccountSnapshot().catch((e) => this.logger("staleAccountFetch", e));
      for (const symbol of symbols) {
        void this.refreshOpenOrders(symbol).catch((e) => this.logger("staleOrdersFetch", e));
      }
      // 更新时间戳避免重复拉取
      this.lastAccountDataTime = Date.now();
    }
  }

  /**
   * 启动 REST 轮询（WS 断连时使用）
   * 持续通过 REST API 拉取行情和账户数据，确保止损等逻辑能正常工作
   */
  private startRestPoll(): void {
    if (this.restPollActive) return;
    this.restPollActive = true;
    this.logDebug("REST poll started (WS disconnected)");

    const poll = async () => {
      if (!this.restPollActive) return;

      // 获取当前订阅的 symbols
      const symbols = new Set<string>();
      for (const key of this.subscriptions) {
        const [, symbol] = key.split(":");
        if (symbol) symbols.add(symbol);
      }

      // 拉取行情数据
      for (const symbol of symbols) {
        try {
          await this.fetchTickerSnapshot(symbol);
          this.lastMarketDataTime = Date.now();
        } catch (e) {
          this.logger("restPollTicker", e);
        }
        try {
          await this.fetchDepthSnapshot(symbol);
        } catch (e) {
          this.logger("restPollDepth", e);
        }
      }

      // 拉取账户数据
      try {
        await this.refreshAccountSnapshot();
        this.lastAccountDataTime = Date.now();
      } catch (e) {
        this.logger("restPollAccount", e);
      }

      // 继续下一次轮询
      if (this.restPollActive) {
        this.restPollTimer = setTimeout(() => void poll(), REST_POLL_INTERVAL);
      }
    };

    void poll();
  }

  /**
   * 停止 REST 轮询
   */
  private stopRestPoll(): void {
    if (!this.restPollActive) return;
    this.restPollActive = false;
    if (this.restPollTimer) {
      clearTimeout(this.restPollTimer);
      this.restPollTimer = null;
    }
    this.logDebug("REST poll stopped (WS restored)");
  }

  /**
   * 强制重连（用于心跳超时）
   * 与普通断连不同，这里不增加重连计数（因为是主动行为）
   */
  private forceReconnect(reason: string): void {
    this.logDebug(`force reconnect: ${reason}`);
    // 停止监控
    this.stopHeartbeatMonitor();
    this.stopDataStaleCheck();
    // 关闭现有连接
    if (this.marketWs) {
      try {
        this.marketWs.close();
      } catch {
        // ignore close errors
      }
      this.marketWs = null;
    }
    // 重置状态
    const wasReady = this.marketWsReady;
    this.marketWsReady = false;
    this.marketWsAuthed = false;
    this.marketWsAuthRequested = false;
    // 触发断连事件
    if (wasReady) {
      this.onDisconnect();
    }
    // 立即重连（不使用指数退避，因为是主动行为）
    this.reconnectAttempts = 0;
    this.scheduleReconnect();
  }

  private logDebug(context: string, detail?: unknown): void {
    if (!this.debugWs) return;
    if (detail === undefined) {
      console.log(`[StandxGateway] ${context}`);
    } else {
      console.log(`[StandxGateway] ${context}`, detail);
    }
  }

  private logRawPayload(raw: unknown): void {
    if (!this.debugWsRaw) return;
    let text = "";
    if (typeof raw === "string") {
      text = raw;
    } else if (Buffer.isBuffer(raw)) {
      text = raw.toString("utf-8");
    } else if (raw instanceof ArrayBuffer) {
      text = Buffer.from(raw).toString("utf-8");
    } else {
      text = String(raw);
    }
    const trimmed = text.trim();
    if (!trimmed) return;
    const limit = 2000;
    const output = trimmed.length > limit ? `${trimmed.slice(0, limit)}…(truncated)` : trimmed;
    console.log(`[StandxGateway] ws raw`, output);
  }

  private emitDepth(symbol: string, depth: AsterDepth): void {
    const listeners = this.depthListeners.get(normalizeSymbol(symbol));
    if (!listeners) return;
    for (const listener of listeners) {
      try {
        listener(depth);
      } catch (error) {
        this.logger("depthListener", error);
      }
    }
  }

  private emitTicker(symbol: string, ticker: AsterTicker): void {
    const listeners = this.tickerListeners.get(normalizeSymbol(symbol));
    if (!listeners) return;
    const price = Number(ticker.lastPrice);
    if (Number.isFinite(price)) {
      this.lastPriceBySymbol.set(normalizeSymbol(symbol), price);
      this.checkVirtualStops(symbol, price);
    }
    for (const listener of listeners) {
      try {
        listener(ticker);
      } catch (error) {
        this.logger("tickerListener", error);
      }
    }
  }

  private emitOrders(): void {
    const orders = Array.from(this.openOrders.values());
    for (const virtual of this.virtualStops.values()) {
      orders.push({ ...virtual.order });
    }
    for (const listener of this.orderListeners) {
      try {
        listener(orders);
      } catch (error) {
        this.logger("ordersListener", error);
      }
    }
  }

  private emitAccountSnapshot(updateTime?: number): void {
    const positions = Array.from(this.positions.values());
    const assets = Array.from(this.balances.values());
    const totalWalletBalance = assets.reduce((sum, asset) => sum + Number(asset.walletBalance ?? 0), 0);
    const totalUnrealizedProfit = positions.reduce(
      (sum, position) => sum + Number(position.unrealizedProfit ?? 0),
      0
    );
    const snapshot: AsterAccountSnapshot = {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: typeof updateTime === "number" && Number.isFinite(updateTime) && updateTime > 0 ? updateTime : Date.now(),
      totalWalletBalance: String(totalWalletBalance || 0),
      totalUnrealizedProfit: String(totalUnrealizedProfit || 0),
      positions,
      assets,
      marketType: "perp",
    };
    this.accountSnapshot = snapshot;
    for (const listener of this.accountListeners) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("accountListener", error);
      }
    }
  }

  private async refreshAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    try {
      const [balance, positions] = await Promise.all([
        this.requestJson<StandxBalanceSnapshot>("/api/query_balance", { method: "GET" }),
        this.requestJson<StandxPosition[]>("/api/query_positions", { method: "GET" }),
      ]);
      let restSnapshotTime = 0;
      if (Array.isArray(positions)) {
        for (const position of positions) {
          const mapped = this.mapPosition(position);
          this.positions.set(mapped.symbol, mapped);
          const positionTime = toTimestamp(position.time ?? position.updated_at);
          restSnapshotTime = Math.max(restSnapshotTime, positionTime);
        }
      }
      if (balance) {
        const token = "DUSD";
        const asset: AsterAccountAsset = {
          asset: token,
          walletBalance: String(balance.balance ?? "0"),
          availableBalance: String(balance.cross_available ?? balance.balance ?? "0"),
          updateTime: restSnapshotTime > 0 ? restSnapshotTime : Date.now(),
          unrealizedProfit: String(balance.upnl ?? "0"),
        };
        this.balances.set(token, asset);
      }
      this.emitAccountSnapshot(restSnapshotTime > 0 ? restSnapshotTime : undefined);
      return this.accountSnapshot;
    } catch (error) {
      this.logger("accountSnapshot", error);
      return null;
    }
  }

  async queryAccountSnapshot(): Promise<AsterAccountSnapshot | null> {
    return await this.refreshAccountSnapshot();
  }

  async changeMarginMode(symbol: string, marginMode: "isolated" | "cross"): Promise<void> {
    if (!this.signer.hasKey()) {
      throw new Error("StandX change_margin_mode requires STANDX_REQUEST_PRIVATE_KEY for signed requests");
    }
    const normalized = normalizeSymbol(symbol);
    const response = await this.requestJson<{ code?: number; message?: string; request_id?: string }>(
      "/api/change_margin_mode",
      {
        method: "POST",
        body: {
          symbol: normalized,
          margin_mode: marginMode,
        },
        signed: true,
        extraHeaders: {
          "x-session-id": this.sessionId,
        },
      }
    );
    if (response && typeof response.code === "number" && response.code !== 0) {
      throw new Error(response.message ?? "StandX change margin mode rejected");
    }
  }

  private async refreshOpenOrders(symbol: string): Promise<void> {
    try {
      const ordersPayload = await this.requestJson<unknown>("/api/query_open_orders", {
        method: "GET",
        params: { symbol },
      });
      const orders = extractOrders(ordersPayload);
      for (const raw of orders) {
        const order = this.mapOrder(raw);
        mergeOrderSnapshot(this.openOrders, order);
      }
      // 无论是否有挂单都触发推送，确保上层状态更新
      this.emitOrders();
    } catch (error) {
      this.logger("openOrders", error);
    }
  }

  private async fetchDepthSnapshot(symbol: string): Promise<void> {
    const data = await this.requestJson<StandxDepthBook>("/api/query_depth_book", {
      method: "GET",
      params: { symbol },
    });
    if (!data?.symbol) return;
    const bids = normalizeDepthLevels((data.bids ?? []).map(([price, qty]) => [String(price), String(qty)]), "bid");
    const asks = normalizeDepthLevels((data.asks ?? []).map(([price, qty]) => [String(price), String(qty)]), "ask");
    const depth: AsterDepth = {
      lastUpdateId: Date.now(),
      bids,
      asks,
      eventTime: Date.now(),
      symbol: data.symbol,
    };
    this.emitDepth(data.symbol, depth);
  }

  private async fetchTickerSnapshot(symbol: string): Promise<void> {
    const data = await this.requestJson<StandxPrice>("/api/query_symbol_price", {
      method: "GET",
      params: { symbol },
    });
    if (!data?.symbol) return;
    const ticker = this.mapTicker(data);
    this.emitTicker(data.symbol, ticker);
  }

  private startKlinePolling(symbol: string, interval: string): void {
    const key = `${normalizeSymbol(symbol)}:${interval}`;
    if (this.klineTimers.has(key)) return;
    const poll = async () => {
      try {
        const { resolution, seconds } = resolutionFromInterval(interval);
        const to = Math.floor(Date.now() / 1000);
        const from = to - seconds * DEFAULT_KLINE_LIMIT;
        const response = await this.requestJson<StandxKlineHistory>("/api/kline/history", {
          method: "GET",
          params: {
            symbol: normalizeSymbol(symbol),
            resolution,
            from,
            to,
            countBack: DEFAULT_KLINE_LIMIT,
          },
        });
        if (!response || response.s !== "ok" || !Array.isArray(response.t)) return;
        const klines: AsterKline[] = response.t.map((openTime, index) => {
          const o = response.o?.[index];
          const h = response.h?.[index];
          const l = response.l?.[index];
          const c = response.c?.[index];
          const v = response.v?.[index];
          const openMs = openTime * 1000;
          return {
            openTime: openMs,
            closeTime: openMs + seconds * 1000,
            open: String(o ?? "0"),
            high: String(h ?? "0"),
            low: String(l ?? "0"),
            close: String(c ?? "0"),
            volume: String(v ?? "0"),
            numberOfTrades: 0,
          };
        });
        const listeners = this.klineListeners.get(key);
        if (!listeners) return;
        for (const listener of listeners) {
          try {
            listener(klines);
          } catch (error) {
            this.logger("klineListener", error);
          }
        }
      } catch (error) {
        this.logger("klinePoll", error);
      }
    };
    const timer = setInterval(() => void poll(), KLINE_REFRESH_MS);
    this.klineTimers.set(key, timer);
    void poll();
  }

  private startFundingPolling(symbol: string): void {
    if (this.fundingTimers.has(symbol)) return;
    const poll = async () => {
      try {
        const response = await this.requestJson<StandxSymbolMarket>("/api/query_symbol_market", {
          method: "GET",
          params: { symbol },
        });
        const rate = Number(response?.funding_rate ?? "0");
        if (!Number.isFinite(rate)) return;
        const snapshot: FundingState = { rate, updatedAt: Date.now() };
        this.fundingState.set(symbol, snapshot);
        const listeners = this.fundingListeners.get(symbol);
        if (!listeners) return;
        for (const listener of listeners) {
          try {
            listener({ symbol, fundingRate: rate, updateTime: snapshot.updatedAt });
          } catch (error) {
            this.logger("fundingListener", error);
          }
        }
      } catch (error) {
        this.logger("fundingPoll", error);
      }
    };
    const timer = setInterval(() => void poll(), FUNDING_REFRESH_MS);
    this.fundingTimers.set(symbol, timer);
    void poll();
  }

  private checkVirtualStops(symbol: string, price: number): void {
    if (!Number.isFinite(price)) return;
    const now = Date.now();
    for (const [id, stop] of Array.from(this.virtualStops.entries())) {
      const normalizedSymbol = normalizeSymbol(symbol);
      if (normalizeSymbol(stop.symbol) !== normalizedSymbol) continue;
      if (stop.side === "SELL" && price > stop.stopPrice) continue;
      if (stop.side === "BUY" && price < stop.stopPrice) continue;
      this.virtualStops.delete(id);
      stop.order.status = "FILLED";
      stop.order.updateTime = now;
      this.emitOrders();
      void this.submitOrder(normalizedSymbol, {
        symbol: normalizedSymbol,
        side: stop.side,
        type: "MARKET",
        quantity: stop.quantity,
        reduceOnly: stop.reduceOnly ? "true" : "false",
      }).catch((error) => {
        stop.order.status = "REJECTED";
        stop.order.updateTime = Date.now();
        this.emitOrders();
        this.logger("virtualStop", error);
      });
    }
  }

  private mapOrder(data: StandxOrder): AsterOrder {
    const clientOrderId = data.cl_ord_id ? String(data.cl_ord_id) : data.id != null ? String(data.id) : "";
    const orderId = clientOrderId || (data.id != null ? String(data.id) : "") || crypto.randomUUID();
    const normalizedClientId = clientOrderId || orderId;
    let timeInForce: TimeInForce | undefined;
    const tifRaw = data.time_in_force?.toLowerCase();
    if (tifRaw === "gtc") timeInForce = "GTC";
    if (tifRaw === "ioc") timeInForce = "IOC";
    if (tifRaw === "alo") timeInForce = "GTX";
    return {
      orderId,
      clientOrderId: normalizedClientId,
      symbol: data.symbol,
      side: mapOrderSide(data.side),
      type: mapOrderType(data.order_type),
      status: (data.status ?? "NEW").toUpperCase(),
      price: String(data.price ?? "0"),
      origQty: String(data.qty ?? "0"),
      executedQty: String(data.fill_qty ?? "0"),
      stopPrice: "0",
      time: toTimestamp(data.created_at),
      updateTime: toTimestamp(data.updated_at),
      reduceOnly: Boolean(data.reduce_only),
      closePosition: Boolean(data.reduce_only),
      timeInForce,
    };
  }

  private mapPosition(data: StandxPosition): AsterAccountPosition {
    return {
      symbol: data.symbol,
      positionAmt: String(data.qty ?? "0"),
      entryPrice: String(data.entry_price ?? "0"),
      unrealizedProfit: String(data.upnl ?? "0"),
      positionSide: "BOTH",
      updateTime: toTimestamp(data.time ?? data.updated_at),
      leverage: data.leverage ? String(data.leverage) : undefined,
      marginType: data.margin_mode,
      liquidationPrice: data.liq_price ? String(data.liq_price) : undefined,
      markPrice: data.mark_price ? String(data.mark_price) : undefined,
    };
  }

  private mapBalance(data: StandxBalance): AsterAccountAsset {
    const walletBalance = data.total ?? data.free ?? "0";
    const availableBalance = data.free ?? walletBalance;
    return {
      asset: data.token,
      walletBalance: String(walletBalance ?? "0"),
      availableBalance: String(availableBalance ?? "0"),
      updateTime: toTimestamp(data.updated_at),
    };
  }

  private mapTicker(data: StandxPrice): AsterTicker {
    const spread = data.spread ?? [data.spread_bid ?? "0", data.spread_ask ?? "0"];
    const lastPrice = data.last_price ?? data.mark_price ?? data.index_price ?? data.mid_price ?? "0";
    return {
      symbol: data.symbol,
      lastPrice: String(lastPrice),
      openPrice: "0",
      highPrice: "0",
      lowPrice: "0",
      volume: "0",
      quoteVolume: "0",
      bidPrice: String(spread?.[0] ?? "0"),
      askPrice: String(spread?.[1] ?? "0"),
      markPrice: String(data.mark_price ?? "0"),
      eventTime: toTimestamp(data.time),
    };
  }

  private async requestJson<T>(
    path: string,
    options: {
      method: "GET" | "POST";
      params?: Record<string, unknown>;
      body?: Record<string, unknown>;
      signed?: boolean;
      extraHeaders?: Record<string, string>;
    }
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ...options.extraHeaders,
    };
    let body: string | undefined;
    if (options.body) {
      const payload = Object.fromEntries(
        Object.entries(options.body).filter(([, value]) => value !== undefined && value !== null)
      );
      body = JSON.stringify(payload);
      if (options.signed) {
        const signedHeaders = await this.signer.signPayload(body);
        if (signedHeaders) {
          Object.assign(headers, signedHeaders);
        } else if (!this.signatureWarningLogged) {
          this.signatureWarningLogged = true;
          this.logger("signature", "Request signature skipped: STANDX_REQUEST_PRIVATE_KEY missing");
        }
      }
    }
    try {
      const response = await fetch(url.toString(), {
        method: options.method,
        headers,
        body: options.method === "GET" ? undefined : body,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${options.method} ${path} failed (${response.status}): ${text}`);
      }
      if (!text) {
        this.recordRestSuccess();
        return {} as T;
      }
      try {
        const parsed = JSON.parse(text) as T;
        this.recordRestSuccess();
        return parsed;
      } catch {
        this.recordRestSuccess();
        return text as unknown as T;
      }
    } catch (error) {
      this.recordRestError({
        consecutiveErrors: this.restConsecutiveErrors + 1,
        method: options.method,
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private recordRestSuccess(): void {
    if (this.restConsecutiveErrors === 0 && !this.restUnhealthy) return;
    this.restConsecutiveErrors = 0;
    this.restLastError = null;
    if (!this.restUnhealthy) return;
    this.restUnhealthy = false;
    this.emitRestHealth("healthy", { consecutiveErrors: 0 });
  }

  private recordRestError(info: RestHealthInfo): void {
    this.restConsecutiveErrors = Math.max(0, Number(info.consecutiveErrors) || 0);
    this.restLastError = info.error ?? this.restLastError;

    if (!this.restUnhealthy && this.restConsecutiveErrors >= REST_ERROR_DEFENSE_THRESHOLD) {
      this.restUnhealthy = true;
      this.emitRestHealth("unhealthy", {
        consecutiveErrors: this.restConsecutiveErrors,
        method: info.method,
        path: info.path,
        error: info.error ?? this.restLastError ?? undefined,
      });
    }
  }

  private emitRestHealth(state: RestHealthState, info: RestHealthInfo): void {
    for (const listener of this.restHealthListeners) {
      try {
        listener(state, info);
      } catch (error) {
        this.logger("restHealthListener", error);
      }
    }
  }

  /**
   * 断连时触发，记录当前挂单状态并启动持久重试取消
   */
  private onDisconnect(): void {
    // 记录最后已知的挂单状态
    this.lastKnownOpenOrders = Array.from(this.openOrders.values()).map((order) => ({
      orderId: String(order.orderId),
      clOrdId: order.clientOrderId,
    }));

    // 获取当前订阅的 symbol
    const symbols = new Set<string>();
    for (const key of this.subscriptions) {
      const [, symbol] = key.split(":");
      if (symbol) symbols.add(symbol);
    }
    this.disconnectedSymbol = symbols.size > 0 ? Array.from(symbols)[0] ?? null : null;

    this.logDebug("disconnect protection", {
      openOrderCount: this.lastKnownOpenOrders.length,
      symbol: this.disconnectedSymbol,
    });

    // 触发断连事件
    for (const listener of this.connectionListeners) {
      try {
        listener("disconnected", this.disconnectedSymbol ?? "");
      } catch (error) {
        this.logger("connectionListener", error);
      }
    }

    // 启动断连保护：持续重试取消所有挂单
    if (this.lastKnownOpenOrders.length > 0 && this.disconnectedSymbol) {
      this.startDisconnectCancelRetry(this.disconnectedSymbol);
    }

    // 启动 REST 轮询，确保断连期间仍能获取行情和账户数据（用于止损等逻辑）
    this.startRestPoll();
  }

  /**
   * 重连成功时触发，停止断连保护并通知监听器
   */
  private onReconnect(): void {
    this.logDebug("reconnect protection", {
      wasRetrying: this.disconnectCancelRetryActive,
      symbol: this.disconnectedSymbol,
    });

    // 停止断连保护重试
    this.stopDisconnectCancelRetry();

    // 清空本地挂单状态（重连后需要重新同步）
    this.openOrders.clear();

    // 主动触发一次数据推送，确保上层 feedStatus 能更新
    this.emitOrders();
    this.emitAccountSnapshot();

    // 主动刷新账户和挂单数据
    void this.refreshAccountSnapshot();

    // 获取当前订阅的 symbols 并刷新数据
    const subscribedSymbols = new Set<string>();
    for (const key of this.subscriptions) {
      const [, symbol] = key.split(":");
      if (symbol) subscribedSymbols.add(symbol);
    }
    if (this.disconnectedSymbol) {
      subscribedSymbols.add(this.disconnectedSymbol);
    }

    // 刷新每个 symbol 的数据
    for (const symbol of subscribedSymbols) {
      void this.refreshOpenOrders(symbol);
      void this.fetchDepthSnapshot(symbol).catch((e) => this.logger("depthSnapshot", e));
      void this.fetchTickerSnapshot(symbol).catch((e) => this.logger("tickerSnapshot", e));
    }

    // 触发重连事件
    for (const listener of this.connectionListeners) {
      try {
        listener("reconnected", this.disconnectedSymbol ?? "");
      } catch (error) {
        this.logger("connectionListener", error);
      }
    }

    this.disconnectedSymbol = null;
    this.lastKnownOpenOrders = [];
  }

  /**
   * 启动断连保护：持续重试取消所有挂单
   * 即使网络不通也不停止重试
   */
  private startDisconnectCancelRetry(symbol: string): void {
    if (this.disconnectCancelRetryActive) return;
    this.disconnectCancelRetryActive = true;

    const retryCancel = async () => {
      if (!this.disconnectCancelRetryActive) return;

      this.logDebug("disconnect cancel retry attempt", { symbol });

      try {
        const success = await this.forceCancelAllOrders(symbol);
        if (success) {
          this.logDebug("disconnect cancel retry success");
          this.stopDisconnectCancelRetry();
          return;
        }
      } catch (error) {
        this.logger("disconnectCancelRetry", error);
      }

      // 如果仍在重试状态，继续下一次重试
      if (this.disconnectCancelRetryActive) {
        this.disconnectCancelRetryTimer = setTimeout(() => {
          void retryCancel();
        }, 2000); // 每 2 秒重试一次
      }
    };

    void retryCancel();
  }

  /**
   * 停止断连保护重试
   */
  private stopDisconnectCancelRetry(): void {
    this.disconnectCancelRetryActive = false;
    if (this.disconnectCancelRetryTimer) {
      clearTimeout(this.disconnectCancelRetryTimer);
      this.disconnectCancelRetryTimer = null;
    }
  }
}
