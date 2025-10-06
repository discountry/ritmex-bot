import crypto from "crypto";
import { setInterval, clearInterval, setTimeout, clearTimeout } from "timers";
import type {
  AsterAccountPosition,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterSpotAccount,
  AsterSpotAggTrade,
  AsterSpotBookTicker,
  AsterSpotCommissionRate,
  AsterSpotDepth,
  AsterSpotExchangeInfo,
  AsterSpotHistoricalTrade,
  AsterSpotKline,
  AsterSpotPriceTicker,
  AsterSpotTicker24h,
  AsterSpotTrade,
  AsterSpotUserTrade,
  AsterTicker,
  CancelSpotOrderParams,
  CreateOrderParams,
  CreateSpotOrderParams,
  PositionSide,
  QuerySpotOrderParams,
  SpotAllOrdersParams,
  SpotOpenOrdersParams,
  SpotUserTradesParams,
} from "../types";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const FUTURES_REST_BASE = "https://fapi.asterdex.com";
const SPOT_REST_BASE = "https://sapi.asterdex.com";
const WS_PUBLIC_URL = "wss://fstream.asterdex.com/ws";
const WS_LISTEN_KEY_URL = "wss://fstream.asterdex.com/ws/";

const FINAL_ORDER_STATUSES = new Set(["FILLED", "CANCELED", "REJECTED", "EXPIRED"]);
const DEFAULT_DEPTH_LEVEL = 20;
const DEFAULT_DEPTH_SPEED = "100ms";
const DEFAULT_KLINE_LIMIT = 120;
const KLINE_REFRESH_INTERVAL_MS = 60_000;
const LISTEN_KEY_KEEPALIVE_MS = 30 * 60 * 1000;
const RECONNECT_DELAY_MS = 2000;
const POSITION_SYNC_INTERVAL_MS = 5000;

function requireEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
}

function serialize(params: Record<string, unknown>): string {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
    .join("&");
}

export class AsterSpotRestClient {
  private readonly apiKey?: string;
  private readonly apiSecret?: string;

  constructor(options: { apiKey?: string; apiSecret?: string } = {}) {
    this.apiKey = options.apiKey ?? process.env.ASTER_API_KEY;
    this.apiSecret = options.apiSecret ?? process.env.ASTER_API_SECRET;
  }

  async ping(): Promise<void> {
    await this.request<void>({ path: "/api/v1/ping", method: "GET" });
  }

  async getServerTime(): Promise<{ serverTime: number }> {
    return this.request<{ serverTime: number }>({ path: "/api/v1/time", method: "GET" });
  }

  async getExchangeInfo(): Promise<AsterSpotExchangeInfo> {
    return this.request<AsterSpotExchangeInfo>({ path: "/api/v1/exchangeInfo", method: "GET" });
  }

  async getDepth(symbol: string, limit?: number): Promise<AsterSpotDepth> {
    const payload = await this.request<AsterSpotDepth>({
      path: "/api/v1/depth",
      method: "GET",
      params: { symbol: symbol.toUpperCase(), limit },
    });
    return {
      lastUpdateId: Number(payload.lastUpdateId),
      E: payload.E,
      T: payload.T,
      bids: (payload.bids ?? []).map(([price, qty]) => [String(price), String(qty)]) as AsterSpotDepth["bids"],
      asks: (payload.asks ?? []).map(([price, qty]) => [String(price), String(qty)]) as AsterSpotDepth["asks"],
    };
  }

  async getTrades(symbol: string, limit?: number): Promise<AsterSpotTrade[]> {
    const payload = await this.request<any[]>({
      path: "/api/v1/trades",
      method: "GET",
      params: { symbol: symbol.toUpperCase(), limit },
    });
    return payload.map((item) => ({
      id: Number(item.id),
      price: String(item.price),
      qty: String(item.qty),
      baseQty: item.baseQty !== undefined ? String(item.baseQty) : undefined,
      quoteQty: item.quoteQty !== undefined ? String(item.quoteQty) : undefined,
      time: Number(item.time ?? Date.now()),
      isBuyerMaker: Boolean(item.isBuyerMaker),
    }));
  }

  async getHistoricalTrades(params: { symbol: string; limit?: number; fromId?: number }): Promise<AsterSpotHistoricalTrade[]> {
    const payload = await this.request<any[]>({
      path: "/api/v1/historicalTrades",
      method: "GET",
      params: {
        symbol: params.symbol.toUpperCase(),
        limit: params.limit,
        fromId: params.fromId,
      },
      requiresApiKey: true,
    });
    return payload.map((item) => ({
      id: Number(item.id),
      price: String(item.price),
      qty: String(item.qty),
      baseQty: item.baseQty !== undefined ? String(item.baseQty) : undefined,
      quoteQty: item.quoteQty !== undefined ? String(item.quoteQty) : undefined,
      time: Number(item.time ?? Date.now()),
      isBuyerMaker: Boolean(item.isBuyerMaker),
      isBestMatch: item.isBestMatch !== undefined ? Boolean(item.isBestMatch) : undefined,
    }));
  }

  async getAggTrades(params: {
    symbol: string;
    fromId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<AsterSpotAggTrade[]> {
    const payload = await this.request<any[]>({
      path: "/api/v1/aggTrades",
      method: "GET",
      params: {
        symbol: params.symbol.toUpperCase(),
        fromId: params.fromId,
        startTime: params.startTime,
        endTime: params.endTime,
        limit: params.limit,
      },
    });
    return payload.map((item) => ({
      a: Number(item.a),
      p: String(item.p),
      q: String(item.q),
      f: Number(item.f),
      l: Number(item.l),
      T: Number(item.T),
      m: Boolean(item.m),
      M: item.M !== undefined ? Boolean(item.M) : undefined,
    }));
  }

  async getKlines(params: {
    symbol: string;
    interval: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<AsterSpotKline[]> {
    const payload = await this.request<any[]>({
      path: "/api/v1/klines",
      method: "GET",
      params: {
        symbol: params.symbol.toUpperCase(),
        interval: params.interval,
        startTime: params.startTime,
        endTime: params.endTime,
        limit: params.limit,
      },
    });
    return payload.map((entry) => ({
      openTime: Number(entry[0]),
      open: String(entry[1]),
      high: String(entry[2]),
      low: String(entry[3]),
      close: String(entry[4]),
      volume: String(entry[5]),
      closeTime: Number(entry[6]),
      quoteAssetVolume: String(entry[7]),
      numberOfTrades: Number(entry[8] ?? 0),
      takerBuyBaseAssetVolume: String(entry[9] ?? "0"),
      takerBuyQuoteAssetVolume: String(entry[10] ?? "0"),
    }));
  }

  async getTicker24h(symbol?: string): Promise<AsterSpotTicker24h | AsterSpotTicker24h[]> {
    const payload = await this.request<any>({
      path: "/api/v1/ticker/24hr",
      method: "GET",
      params: symbol ? { symbol: symbol.toUpperCase() } : undefined,
    });
    return this.normalizeTicker24h(payload);
  }

  async getTickerPrice(symbol?: string): Promise<AsterSpotPriceTicker | AsterSpotPriceTicker[]> {
    const payload = await this.request<any>({
      path: "/api/v1/ticker/price",
      method: "GET",
      params: symbol ? { symbol: symbol.toUpperCase() } : undefined,
    });
    return Array.isArray(payload) ? payload.map((item) => this.normalizePriceTicker(item)) : this.normalizePriceTicker(payload);
  }

  async getBookTicker(symbol?: string): Promise<AsterSpotBookTicker | AsterSpotBookTicker[]> {
    const payload = await this.request<any>({
      path: "/api/v1/ticker/bookTicker",
      method: "GET",
      params: symbol ? { symbol: symbol.toUpperCase() } : undefined,
    });
    return Array.isArray(payload) ? payload.map((item) => this.normalizeBookTicker(item)) : this.normalizeBookTicker(payload);
  }

  async getCommissionRate(symbol: string, params: { recvWindow?: number } = {}): Promise<AsterSpotCommissionRate> {
    const payload = await this.request<AsterSpotCommissionRate>({
      path: "/api/v1/commissionRate",
      method: "GET",
      params: { symbol: symbol.toUpperCase(), recvWindow: params.recvWindow },
      signed: true,
    });
    return {
      symbol: payload.symbol,
      makerCommissionRate: String(payload.makerCommissionRate),
      takerCommissionRate: String(payload.takerCommissionRate),
    };
  }

  async createOrder(params: CreateSpotOrderParams): Promise<AsterOrder> {
    const response = await this.request<any>({
      path: "/api/v1/order",
      method: "POST",
      params: this.normalizeSpotOrderParams(params),
      signed: true,
      sendInBody: true,
    });
    return toOrderFromRest(response);
  }

  async cancelOrder(params: CancelSpotOrderParams): Promise<AsterOrder> {
    const response = await this.request<any>({
      path: "/api/v1/order",
      method: "DELETE",
      params: {
        symbol: params.symbol.toUpperCase(),
        orderId: params.orderId,
        origClientOrderId: params.origClientOrderId,
        recvWindow: params.recvWindow,
      },
      signed: true,
    });
    return toOrderFromRest(response);
  }

  async getOrder(params: QuerySpotOrderParams): Promise<AsterOrder> {
    const response = await this.request<any>({
      path: "/api/v1/order",
      method: "GET",
      params: {
        symbol: params.symbol.toUpperCase(),
        orderId: params.orderId,
        origClientOrderId: params.origClientOrderId,
        recvWindow: params.recvWindow,
      },
      signed: true,
    });
    return toOrderFromRest(response);
  }

  async getOpenOrders(params: SpotOpenOrdersParams = {}): Promise<AsterOrder[]> {
    const response = await this.request<any[]>({
      path: "/api/v1/openOrders",
      method: "GET",
      params: {
        symbol: params.symbol ? params.symbol.toUpperCase() : undefined,
        recvWindow: params.recvWindow,
      },
      signed: true,
    });
    return response.map(toOrderFromRest);
  }

  async cancelAllOpenOrders(params: SpotOpenOrdersParams & { symbol: string }): Promise<{ code: number; msg: string }> {
    const payload: Record<string, unknown> = {
      symbol: params.symbol.toUpperCase(),
      recvWindow: params.recvWindow,
    };
    if (params.orderIdList && params.orderIdList.length) {
      payload.orderIdList = `[${params.orderIdList
        .map((id) => (typeof id === "string" ? id.trim() : String(id)))
        .join(",")}]`;
    }
    if (params.origClientOrderIdList && params.origClientOrderIdList.length) {
      payload.origClientOrderIdList = JSON.stringify(params.origClientOrderIdList);
    }
    return this.request<{ code: number; msg: string }>({
      path: "/api/v1/allOpenOrders",
      method: "DELETE",
      params: payload,
      signed: true,
    });
  }

  async getAllOrders(params: SpotAllOrdersParams): Promise<AsterOrder[]> {
    const response = await this.request<any[]>({
      path: "/api/v1/allOrders",
      method: "GET",
      params: {
        symbol: params.symbol.toUpperCase(),
        orderId: params.orderId,
        startTime: params.startTime,
        endTime: params.endTime,
        limit: params.limit,
        recvWindow: params.recvWindow,
      },
      signed: true,
    });
    return response.map(toOrderFromRest);
  }

  async getAccount(params: { recvWindow?: number } = {}): Promise<AsterSpotAccount> {
    const payload = await this.request<AsterSpotAccount>({
      path: "/api/v1/account",
      method: "GET",
      params: { recvWindow: params.recvWindow },
      signed: true,
    });
    return {
      ...payload,
      balances: (payload.balances ?? []).map((balance) => ({
        asset: balance.asset,
        free: String(balance.free ?? "0"),
        locked: String(balance.locked ?? "0"),
      })),
    };
  }

  async getUserTrades(params: SpotUserTradesParams = {}): Promise<AsterSpotUserTrade[]> {
    const response = await this.request<any[]>({
      path: "/api/v1/userTrades",
      method: "GET",
      params: {
        symbol: params.symbol ? params.symbol.toUpperCase() : undefined,
        orderId: params.orderId,
        startTime: params.startTime,
        endTime: params.endTime,
        fromId: params.fromId,
        limit: params.limit,
        recvWindow: params.recvWindow,
      },
      signed: true,
    });
    return response.map((item) => ({
      symbol: item.symbol,
      id: Number(item.id),
      orderId: Number(item.orderId),
      side: item.side,
      price: String(item.price),
      qty: String(item.qty),
      quoteQty: item.quoteQty !== undefined ? String(item.quoteQty) : undefined,
      commission: String(item.commission ?? "0"),
      commissionAsset: String(item.commissionAsset ?? ""),
      time: Number(item.time ?? Date.now()),
      counterpartyId: item.counterpartyId !== undefined ? Number(item.counterpartyId) : undefined,
      maker: Boolean(item.maker),
      buyer: Boolean(item.buyer),
    }));
  }

  private normalizeTicker24h(payload: any): AsterSpotTicker24h | AsterSpotTicker24h[] {
    const mapOne = (entry: any): AsterSpotTicker24h => ({
      symbol: entry.symbol,
      priceChange: String(entry.priceChange),
      priceChangePercent: String(entry.priceChangePercent),
      weightedAvgPrice: String(entry.weightedAvgPrice),
      prevClosePrice: String(entry.prevClosePrice),
      lastPrice: String(entry.lastPrice),
      lastQty: String(entry.lastQty),
      bidPrice: String(entry.bidPrice),
      bidQty: String(entry.bidQty),
      askPrice: String(entry.askPrice),
      askQty: String(entry.askQty),
      openPrice: String(entry.openPrice),
      highPrice: String(entry.highPrice),
      lowPrice: String(entry.lowPrice),
      volume: String(entry.volume),
      quoteVolume: String(entry.quoteVolume),
      openTime: Number(entry.openTime ?? 0),
      closeTime: Number(entry.closeTime ?? 0),
      firstId: Number(entry.firstId ?? 0),
      lastId: Number(entry.lastId ?? 0),
      count: Number(entry.count ?? 0),
      baseAsset: entry.baseAsset,
      quoteAsset: entry.quoteAsset,
    });
    return Array.isArray(payload) ? payload.map((entry) => mapOne(entry)) : mapOne(payload);
  }

  private normalizePriceTicker(entry: any): AsterSpotPriceTicker {
    return {
      symbol: entry.symbol,
      price: String(entry.price),
      time: entry.time !== undefined ? Number(entry.time) : undefined,
    };
  }

  private normalizeBookTicker(entry: any): AsterSpotBookTicker {
    return {
      symbol: entry.symbol,
      bidPrice: String(entry.bidPrice),
      bidQty: String(entry.bidQty),
      askPrice: String(entry.askPrice),
      askQty: String(entry.askQty),
      time: entry.time !== undefined ? Number(entry.time) : undefined,
    };
  }

  private normalizeSpotOrderParams(params: CreateSpotOrderParams): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      symbol: params.symbol.toUpperCase(),
      side: params.side,
      type: params.type,
      timeInForce: params.timeInForce,
      quantity: params.quantity !== undefined ? params.quantity : undefined,
      quoteOrderQty: params.quoteOrderQty !== undefined ? params.quoteOrderQty : undefined,
      price: params.price !== undefined ? params.price : undefined,
      newClientOrderId: params.newClientOrderId,
      stopPrice: params.stopPrice !== undefined ? params.stopPrice : undefined,
      recvWindow: params.recvWindow,
    };
    return payload;
  }

  private ensureApiKey(): string {
    if (!this.apiKey) {
      throw new Error("[AsterSpotRestClient] Missing API key");
    }
    return this.apiKey;
  }

  private ensureCredentials(): { apiKey: string; apiSecret: string } {
    const apiKey = this.ensureApiKey();
    const apiSecret = this.apiSecret;
    if (!apiSecret) {
      throw new Error("[AsterSpotRestClient] Missing API secret");
    }
    return { apiKey, apiSecret };
  }

  private cleanParams(params: Record<string, unknown> | undefined): Record<string, unknown> {
    const source = params ?? {};
    const cleaned: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      const value = (source as Record<string, unknown>)[key];
      if (value === undefined || value === null) continue;
      cleaned[key] = value;
    }
    return cleaned;
  }

  private async request<T>({
    path,
    method,
    params,
    signed = false,
    sendInBody,
    requiresApiKey = false,
  }: {
    path: string;
    method: "GET" | "POST" | "DELETE" | "PUT";
    params?: Record<string, unknown>;
    signed?: boolean;
    sendInBody?: boolean;
    requiresApiKey?: boolean;
  }): Promise<T> {
    const cleaned = this.cleanParams(params);
    const headers: Record<string, string> = {};
    let url = `${SPOT_REST_BASE}${path}`;
    const useBody = sendInBody ?? (method !== "GET" && method !== "DELETE");
    let body: string | undefined;
    if (requiresApiKey || signed) {
      headers["X-MBX-APIKEY"] = this.ensureApiKey();
    }
    if (signed) {
      if (cleaned.timestamp === undefined) cleaned.timestamp = Date.now();
      if (cleaned.recvWindow === undefined) cleaned.recvWindow = 5000;
      const { apiSecret } = this.ensureCredentials();
      const serialized = serialize(cleaned);
      const signature = crypto.createHmac("sha256", apiSecret).update(serialized).digest("hex");
      if (useBody) {
        body = serialized ? `${serialized}&signature=${signature}` : `signature=${signature}`;
      } else {
        const query = serialized ? `${serialized}&signature=${signature}` : `signature=${signature}`;
        url += url.includes("?") ? `&${query}` : `?${query}`;
      }
    } else {
      const query = serialize(cleaned);
      if (query) {
        if (useBody) {
          body = query;
        } else {
          url += url.includes("?") ? `&${query}` : `?${query}`;
        }
      }
    }

    const init: RequestInit = { method, headers };
    if (useBody) {
      init.body = body ?? "";
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      throw new Error(`[AsterSpotRestClient] 请求失败 ${String(error)}`);
    }
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${text}`);
    }
    if (!text) {
      return undefined as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`[AsterSpotRestClient] 无法解析响应: ${text.slice(0, 200)}`);
    }
  }
}

function toDepth(streamSymbol: string, data: any): AsterDepth {
  return {
    eventType: data.e,
    eventTime: data.E,
    tradeTime: data.T,
    symbol: streamSymbol,
    lastUpdateId: data.u,
    bids: (data.b ?? []).map(([price, qty]: [string, string]) => [price, qty]),
    asks: (data.a ?? []).map(([price, qty]: [string, string]) => [price, qty]),
  };
}

function toTicker(data: any): AsterTicker {
  return {
    eventType: data.e,
    eventTime: data.E,
    symbol: data.s,
    lastPrice: data.c,
    openPrice: data.o,
    highPrice: data.h,
    lowPrice: data.l,
    volume: data.q ?? data.v ?? "0",
    quoteVolume: data.Q ?? data.V ?? "0",
    priceChange: data.p,
    priceChangePercent: data.P,
    weightedAvgPrice: data.w,
    lastQty: data.l ?? data.L,
    openTime: data.O,
    closeTime: data.C,
    firstId: data.F,
    lastId: data.L,
    count: data.n,
  };
}

function toKline(data: any): AsterKline {
  return {
    eventType: data.e,
    eventTime: data.E,
    symbol: data.s,
    interval: data.k.i,
    openTime: data.k.t,
    closeTime: data.k.T,
    firstTradeId: data.k.f,
    lastTradeId: data.k.L,
    open: data.k.o,
    high: data.k.h,
    low: data.k.l,
    close: data.k.c,
    volume: data.k.v,
    numberOfTrades: data.k.n,
    quoteAssetVolume: data.k.q,
    takerBuyBaseAssetVolume: data.k.V,
    takerBuyQuoteAssetVolume: data.k.Q,
    isClosed: Boolean(data.k.x),
  };
}

function fromRestKline(entry: any[], interval: string, symbol: string): AsterKline {
  return {
    eventType: undefined,
    eventTime: undefined,
    symbol,
    interval,
    openTime: entry[0],
    open: String(entry[1]),
    high: String(entry[2]),
    low: String(entry[3]),
    close: String(entry[4]),
    volume: String(entry[5]),
    closeTime: entry[6],
    quoteAssetVolume: String(entry[7]),
    numberOfTrades: Number(entry[8] ?? 0),
    takerBuyBaseAssetVolume: String(entry[9] ?? "0"),
    takerBuyQuoteAssetVolume: String(entry[10] ?? "0"),
    isClosed: Boolean(entry[11]),
  };
}

function toOrderFromRest(raw: any): AsterOrder {
  return {
    avgPrice: raw.avgPrice ?? "0",
    clientOrderId: raw.clientOrderId ?? "",
    cumQuote: raw.cumQuote ?? "0",
    executedQty: raw.executedQty ?? "0",
    orderId: raw.orderId,
    origQty: raw.origQty ?? raw.quantity ?? "0",
    origType: raw.origType ?? raw.type ?? "",
    price: raw.price ?? "0",
    reduceOnly: Boolean(raw.reduceOnly),
    side: raw.side ?? "",
    positionSide: raw.positionSide ?? "BOTH",
    status: raw.status ?? "NEW",
    stopPrice: raw.stopPrice ?? raw.triggerPrice ?? "0",
    closePosition: Boolean(raw.closePosition),
    symbol: raw.symbol ?? "",
    time: raw.time ?? raw.updateTime ?? Date.now(),
    timeInForce: raw.timeInForce ?? "GTC",
    type: raw.type ?? "LIMIT",
    activatePrice: raw.activatePrice,
    priceRate: raw.priceRate,
    updateTime: raw.updateTime ?? Date.now(),
    workingType: raw.workingType ?? "CONTRACT_PRICE",
    priceProtect: Boolean(raw.priceProtect),
  };
}

function toOrderFromEvent(event: any): AsterOrder {
  return {
    avgPrice: event.ap ?? "0",
    clientOrderId: event.c ?? "",
    cumQuote: event.z ?? "0",
    executedQty: event.z ?? "0",
    orderId: event.i,
    origQty: event.q ?? "0",
    origType: event.ot ?? event.o ?? "",
    price: event.p ?? "0",
    reduceOnly: Boolean(event.R),
    side: event.S,
    positionSide: event.ps ?? "BOTH",
    status: event.X,
    stopPrice: event.sp ?? "0",
    closePosition: Boolean(event.cp),
    symbol: event.s,
    time: event.T ?? Date.now(),
    timeInForce: event.f ?? "GTC",
    type: event.o ?? "LIMIT",
    activatePrice: event.AP,
    priceRate: event.cr,
    updateTime: event.T ?? Date.now(),
    workingType: event.wt ?? "CONTRACT_PRICE",
    priceProtect: Boolean(event.PP),
  };
}

function toPositionFromRisk(raw: any): AsterAccountPosition {
  const positionSide = String(raw.positionSide ?? raw.ps ?? "BOTH").toUpperCase() as PositionSide;
  return {
    symbol: raw.symbol ?? raw.s ?? "",
    positionAmt: raw.positionAmt ?? raw.pa ?? "0",
    entryPrice: raw.entryPrice ?? raw.ep ?? "0",
    unrealizedProfit: raw.unRealizedProfit ?? raw.unrealizedProfit ?? raw.up ?? "0",
    positionSide,
    updateTime: raw.updateTime ?? Date.now(),
    initialMargin: raw.initialMargin ?? raw.positionInitialMargin,
    maintMargin: raw.maintMargin,
    positionInitialMargin: raw.positionInitialMargin,
    openOrderInitialMargin: raw.openOrderInitialMargin,
    leverage: raw.leverage,
    isolated: typeof raw.isolated === "boolean" ? raw.isolated : undefined,
    maxNotional: raw.maxNotionalValue ?? raw.maxNotional,
    marginType: raw.marginType,
    isolatedMargin: raw.isolatedMargin,
    isAutoAddMargin: raw.isAutoAddMargin,
    liquidationPrice: raw.liquidationPrice,
    markPrice: raw.markPrice,
  };
}

function deepCloneAccount(snapshot: AsterAccountSnapshot | null): AsterAccountSnapshot | null {
  return snapshot ? JSON.parse(JSON.stringify(snapshot)) : null;
}

function sumUnrealizedProfit(positions: AsterAccountPosition[]): string {
  const total = positions.reduce((acc, position) => acc + Number(position.unrealizedProfit ?? 0), 0);
  return total.toFixed(8);
}

function clonePositions(positions: AsterAccountPosition[]): AsterAccountPosition[] {
  return positions.map((position) => ({
    ...position,
    updateTime: position.updateTime ?? Date.now(),
  }));
}

class SimpleEvent<T> {
  private readonly listeners = new Set<(payload: T) => void>();

  add(listener: (payload: T) => void): void {
    this.listeners.add(listener);
  }

  remove(listener: (payload: T) => void): void {
    this.listeners.delete(listener);
  }

  emit(payload: T): void {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener(payload);
      } catch (error) {
        console.error("[SimpleEvent] listener failure", error);
      }
    }
  }

  listenerCount(): number {
    return this.listeners.size;
  }
}

export interface ListenKeyResponse {
  listenKey: string;
}

export class AsterRestClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(options: { apiKey?: string; apiSecret?: string } = {}) {
    this.apiKey = requireEnv(options.apiKey ?? process.env.ASTER_API_KEY, "ASTER_API_KEY");
    this.apiSecret = requireEnv(options.apiSecret ?? process.env.ASTER_API_SECRET, "ASTER_API_SECRET");
  }

  async getAccount(): Promise<AsterAccountSnapshot> {
    return this.signedRequest<AsterAccountSnapshot>({ path: "/fapi/v2/account", method: "GET", params: {} });
  }

  async getOpenOrders(symbol?: string): Promise<AsterOrder[]> {
    const params: Record<string, unknown> = {};
    if (symbol) params.symbol = symbol;
    const raw = await this.signedRequest<any[]>({ path: "/fapi/v1/openOrders", method: "GET", params });
    return raw.map(toOrderFromRest);
  }

  async getPositions(symbol?: string): Promise<AsterAccountPosition[]> {
    const params: Record<string, unknown> = {};
    if (symbol) params.symbol = symbol.toUpperCase();
    const raw = await this.signedRequest<any[]>({ path: "/fapi/v2/positionRisk", method: "GET", params });
    return raw.map(toPositionFromRisk);
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    const payload: Record<string, unknown> = { ...params };
    const response = await this.signedRequest<any>({ path: "/fapi/v1/order", method: "POST", params: payload });
    return toOrderFromRest(response);
  }

  async cancelOrder(params: { symbol: string; orderId?: number; origClientOrderId?: string }): Promise<AsterOrder> {
    const response = await this.signedRequest<any>({ path: "/fapi/v1/order", method: "DELETE", params });
    return toOrderFromRest(response);
  }

  async cancelOrders(params: { symbol: string; orderIdList?: Array<number | string>; origClientOrderIdList?: string[] }): Promise<AsterOrder[]> {
    const payload: Record<string, unknown> = { symbol: params.symbol };
    if (params.orderIdList?.length) {
      payload.orderIdList = `[${params.orderIdList
        .map((id) => (typeof id === "string" ? id.trim() : String(id)))
        .join(",")}]`;
    }
    if (params.origClientOrderIdList?.length) {
      payload.origClientOrderIdList = JSON.stringify(params.origClientOrderIdList);
    }
    const response = await this.signedRequest<any[]>({ path: "/fapi/v1/batchOrders", method: "DELETE", params: payload });
    return response.map(toOrderFromRest);
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.signedRequest({ path: "/fapi/v1/allOpenOrders", method: "DELETE", params });
  }

  async getKlines(symbol: string, interval: string, limit = DEFAULT_KLINE_LIMIT): Promise<AsterKline[]> {
    const upper = symbol.toUpperCase();
    const url = `${FUTURES_REST_BASE}/fapi/v1/continuousKlines?pair=${upper}&contractType=PERPETUAL&interval=${encodeURIComponent(interval)}&limit=${limit}`;
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      throw new Error(`[AsterRestClient] 获取K线失败 ${String(error)}`);
    }
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${text}`);
    }
    try {
      const payload = JSON.parse(text) as any[];
      return payload.map((entry) => fromRestKline(entry, interval, upper));
    } catch (error) {
      throw new Error(`[AsterRestClient] 无法解析K线响应: ${text.slice(0, 200)}`);
    }
  }

  async getListenKey(): Promise<string> {
    const response = await this.signedRequest<ListenKeyResponse>({ path: "/fapi/v1/listenKey", method: "POST", params: {} });
    return response.listenKey;
  }

  async keepAliveListenKey(listenKey: string): Promise<void> {
    await this.signedRequest({ path: "/fapi/v1/listenKey", method: "PUT", params: { listenKey } });
  }

  async closeListenKey(listenKey: string): Promise<void> {
    await this.signedRequest({ path: "/fapi/v1/listenKey", method: "DELETE", params: { listenKey } });
  }

  private async signedRequest<T>({ path, method, params }: { path: string; method: string; params: Record<string, unknown> }): Promise<T> {
    const timestamp = Date.now();
    const payload = { ...params, timestamp, recvWindow: 5000 };
    const query = serialize(payload);
    const signature = crypto.createHmac("sha256", this.apiSecret).update(query).digest("hex");
    const url = `${FUTURES_REST_BASE}${path}?${query}&signature=${signature}`;
    const init: RequestInit = {
      method,
      headers: {
        "X-MBX-APIKEY": this.apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      throw new Error(`[AsterRestClient] 请求失败 ${String(error)}`);
    }
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${text}`);
    }
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`[AsterRestClient] 无法解析响应: ${text.slice(0, 200)}`);
    }
  }

}

type DepthHandler = (depth: AsterDepth) => void;
type TickerHandler = (ticker: AsterTicker) => void;
type KlineHandler = (kline: AsterKline) => void;

type StreamKind = "depth" | "ticker" | "kline";

interface StreamState {
  stream: string;
  kind: StreamKind;
  symbol: string;
  interval?: string;
}

export class AsterPublicStreams {
  private ws: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly streams = new Map<string, StreamState>();
  private readonly depthHandlers = new Map<string, Set<DepthHandler>>();
  private readonly tickerHandlers = new Map<string, Set<TickerHandler>>();
  private readonly klineHandlers = new Map<string, Set<KlineHandler>>();
  private nextRequestId = 1;

  subscribeDepth(symbol: string, handler: DepthHandler): void {
    const upper = symbol.toUpperCase();
    const stream = `${upper.toLowerCase()}@depth${DEFAULT_DEPTH_LEVEL}@${DEFAULT_DEPTH_SPEED}`;
    this.addHandler(this.depthHandlers, upper, handler);
    this.registerStream(stream, { stream, kind: "depth", symbol: upper });
  }

  subscribeTicker(symbol: string, handler: TickerHandler): void {
    const upper = symbol.toUpperCase();
    const stream = `${upper.toLowerCase()}@miniTicker`;
    this.addHandler(this.tickerHandlers, upper, handler);
    this.registerStream(stream, { stream, kind: "ticker", symbol: upper });
  }

  subscribeKline(symbol: string, interval: string, handler: KlineHandler): void {
    const upper = symbol.toUpperCase();
    const stream = `${upper.toLowerCase()}@kline_${interval}`;
    this.addHandler(this.klineHandlers, `${upper}:${interval}`, handler);
    this.registerStream(stream, { stream, kind: "kline", symbol: upper, interval });
  }

  private addHandler<T>(map: Map<string, Set<T>>, key: string, handler: T): void {
    let set = map.get(key);
    if (!set) {
      set = new Set();
      map.set(key, set);
    }
    set.add(handler);
    this.ensureConnection();
  }

  private registerStream(stream: string, state: StreamState): void {
    if (!this.streams.has(stream)) {
      this.streams.set(stream, state);
      this.send({ method: "SUBSCRIBE", params: [stream], id: this.nextRequestId++ });
    }
  }

  private ensureConnection(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.connect();
  }

  private connect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.ws = new WebSocket(WS_PUBLIC_URL);
    this.ws.onopen = () => {
      const streams = Array.from(this.streams.keys());
      if (streams.length) {
        this.send({ method: "SUBSCRIBE", params: streams, id: this.nextRequestId++ });
      }
    };
    this.ws.onmessage = (event) => {
      let payload: any;
      if (typeof event.data === "string") {
        try {
          payload = JSON.parse(event.data);
        } catch (error) {
          console.error("[AsterPublicStreams] 无法解析消息", error, event.data);
          return;
        }
      } else {
        payload = event.data;
      }
      if (!payload) return;
      if (payload.result !== undefined) return; // subscription ack
      const data = payload.data ?? payload;
      if (!data.e) return;
      switch (data.e) {
        case "depthUpdate":
          this.dispatchDepth(data);
          break;
        case "24hrMiniTicker":
          this.dispatchTicker(data);
          break;
        case "kline":
          this.dispatchKline(data);
          break;
        default:
          break;
      }
    };
    this.ws.onclose = () => {
      this.scheduleReconnect();
    };
    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, RECONNECT_DELAY_MS);
  }

  private send(message: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private dispatchDepth(data: any): void {
    const symbol = String(data.s ?? "").toUpperCase();
    const handlers = this.depthHandlers.get(symbol);
    if (!handlers || !handlers.size) return;
    const depth = toDepth(symbol, data);
    handlers.forEach((handler) => handler(depth));
  }

  private dispatchTicker(data: any): void {
    const symbol = String(data.s ?? "").toUpperCase();
    const handlers = this.tickerHandlers.get(symbol);
    if (!handlers || !handlers.size) return;
    const ticker = toTicker(data);
    handlers.forEach((handler) => handler(ticker));
  }

  private dispatchKline(data: any): void {
    const symbol = String(data.s ?? "").toUpperCase();
    const interval = data.k?.i ?? "";
    const key = `${symbol}:${interval}`;
    const handlers = this.klineHandlers.get(key);
    if (!handlers || !handlers.size) return;
    const kline = toKline(data);
    handlers.forEach((handler) => handler(kline));
  }
}

interface AccountUpdatePayload {
  B: Array<{ a: string; wb: string; cw: string; bc: string; wbBalance?: string; } & Record<string, string>>;
  P: Array<{ s: string; pa: string; ep: string; cr: string; up: string; mt: string; iw?: string; ps: string; pc?: string; } & Record<string, string>>;
}

interface OrderUpdatePayload extends Record<string, any> {}

export class AsterUserStream {
  private readonly rest: AsterRestClient;
  private listenKey: string | null = null;
  private ws: WebSocket | null = null;
  private keepAliveTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly accountEvent = new SimpleEvent<{ eventTime: number; payload: AccountUpdatePayload }>();
  private readonly orderEvent = new SimpleEvent<{ eventTime: number; payload: OrderUpdatePayload }>();
  private readonly connectEvent = new SimpleEvent<void>();
  private isRunning = false;

  constructor(rest: AsterRestClient) {
    this.rest = rest;
  }

  onAccount(listener: (payload: { eventTime: number; payload: AccountUpdatePayload }) => void): void {
    this.accountEvent.add(listener);
  }

  onOrder(listener: (payload: { eventTime: number; payload: OrderUpdatePayload }) => void): void {
    this.orderEvent.add(listener);
  }

  onConnect(listener: () => void): void {
    this.connectEvent.add(listener);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    await this.ensureListenKey();
    this.openSocket();
    this.scheduleKeepAlive();
  }

  stop(): void {
    this.isRunning = false;
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.listenKey) {
      void this.rest.closeListenKey(this.listenKey).catch(() => undefined);
      this.listenKey = null;
    }
  }

  private async ensureListenKey(): Promise<void> {
    if (this.listenKey) return;
    this.listenKey = await this.rest.getListenKey();
  }

  private scheduleKeepAlive(): void {
    if (this.keepAliveTimer) return;
    this.keepAliveTimer = setInterval(() => {
      if (!this.listenKey) return;
      void this.rest.keepAliveListenKey(this.listenKey).catch((error) => {
        console.error("[AsterUserStream] keepAlive error", error);
      });
    }, LISTEN_KEY_KEEPALIVE_MS / 2);
  }

  private openSocket(): void {
    if (!this.listenKey) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    const url = `${WS_LISTEN_KEY_URL}${this.listenKey}`;
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.connectEvent.emit();
    };
    this.ws.onmessage = (event) => {
      let payload: any;
      if (typeof event.data === "string") {
        try {
          payload = JSON.parse(event.data);
        } catch (error) {
          console.error("[AsterUserStream] 无法解析消息", error, event.data);
          return;
        }
      } else {
        payload = event.data;
      }
      if (!payload) return;
      if (payload === "ping") {
        this.ws?.send("pong");
        return;
      }
      switch (payload.e) {
        case "ACCOUNT_UPDATE":
          this.accountEvent.emit({ eventTime: payload.E, payload: payload.a });
          break;
        case "ORDER_TRADE_UPDATE":
          this.orderEvent.emit({ eventTime: payload.E, payload: payload.o });
          break;
        case "listenKeyExpired":
          this.handleListenKeyExpired();
          break;
        default:
          break;
      }
    };
    this.ws.onclose = () => {
      this.scheduleReconnect();
    };
    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private async handleListenKeyExpired(): Promise<void> {
    this.listenKey = null;
    await this.ensureListenKey();
    this.openSocket();
  }

  private scheduleReconnect(): void {
    if (!this.isRunning) return;
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.openSocket();
    }, RECONNECT_DELAY_MS);
  }
}

function updateAccountSnapshot(snapshot: AsterAccountSnapshot | null, event: { eventTime: number; payload: AccountUpdatePayload }): AsterAccountSnapshot | null {
  if (!snapshot) return snapshot;
  const next = deepCloneAccount(snapshot);
  if (!next) return snapshot;
  next.updateTime = event.eventTime;
  const balances = event.payload.B ?? [];
  for (const balance of balances) {
    const asset = balance.a;
    let assetEntry = next.assets.find((item) => item.asset === asset);
    if (!assetEntry) {
      assetEntry = {
        asset,
        walletBalance: "0",
        availableBalance: "0",
        updateTime: event.eventTime,
      };
      next.assets.push(assetEntry);
    }
    if (balance.wb !== undefined) assetEntry.walletBalance = balance.wb;
    if (balance.cw !== undefined) assetEntry.crossWalletBalance = balance.cw;
    if (balance.bc !== undefined) assetEntry.availableBalance = balance.bc;
    assetEntry.updateTime = event.eventTime;
  }

  const positions = event.payload.P ?? [];
  const unrealizedTotals = positions.reduce((acc, item) => acc + parseFloat(item.up ?? "0"), 0);
  next.totalUnrealizedProfit = unrealizedTotals.toFixed(8);

  for (const position of positions) {
    const symbol = position.s;
    let positionEntry = next.positions.find((item) => item.symbol === symbol && item.positionSide === (position.ps as PositionSide));
    if (!positionEntry) {
      positionEntry = {
        symbol,
        positionAmt: "0",
        entryPrice: "0",
        unrealizedProfit: "0",
        positionSide: position.ps as PositionSide,
        updateTime: event.eventTime,
      };
      next.positions.push(positionEntry);
    }
    positionEntry.positionAmt = position.pa ?? positionEntry.positionAmt;
    positionEntry.entryPrice = position.ep ?? positionEntry.entryPrice;
    positionEntry.unrealizedProfit = position.up ?? positionEntry.unrealizedProfit;
    positionEntry.updateTime = event.eventTime;
  }
  return next;
}

function mergeOrderSnapshot(map: Map<string, AsterOrder>, order: AsterOrder): void {
  const rawId = order.orderId;
  if (rawId === undefined || rawId === null) return;
  const key = String(rawId);
  if (!key) return;
  if (FINAL_ORDER_STATUSES.has(order.status)) {
    map.delete(key);
  } else {
    map.set(key, { ...order, orderId: key });
  }
}

export class AsterGateway {
  private readonly rest: AsterRestClient;
  private readonly publicStreams: AsterPublicStreams;
  private readonly userStream: AsterUserStream;

  private accountSnapshot: AsterAccountSnapshot | null = null;
  private readonly openOrders = new Map<string, AsterOrder>();
  private positionSyncTimer: ReturnType<typeof setInterval> | null = null;
  private positionSyncInFlight = false;

  private readonly accountEvent = new SimpleEvent<AsterAccountSnapshot>();
  private readonly ordersEvent = new SimpleEvent<AsterOrder[]>();
  private readonly depthEvents = new Map<string, SimpleEvent<AsterDepth>>();
  private readonly tickerEvents = new Map<string, SimpleEvent<AsterTicker>>();
  private readonly klineEvents = new Map<string, SimpleEvent<AsterKline[]>>();

  private readonly klineStores = new Map<string, AsterKline[]>();
  private readonly klineRefreshTimers = new Map<string, ReturnType<typeof setInterval>>();
  private readonly klineInitialFetches = new Map<string, Promise<void>>();
  private initialized = false;
  private initializing: Promise<void> | null = null;

  constructor(options: { apiKey?: string; apiSecret?: string } = {}) {
    this.rest = new AsterRestClient(options);
    this.publicStreams = new AsterPublicStreams();
    this.userStream = new AsterUserStream(this.rest);
    this.userStream.onAccount((event) => {
      const updated = updateAccountSnapshot(this.accountSnapshot, event);
      if (updated) {
        this.accountSnapshot = updated;
        this.accountEvent.emit(updated);
      }
    });
    this.userStream.onOrder((event) => {
      const order = toOrderFromEvent(event.payload);
      mergeOrderSnapshot(this.openOrders, order);
      this.ordersEvent.emit(Array.from(this.openOrders.values()));
      const execType = typeof event.payload?.x === "string" ? event.payload.x.toUpperCase() : "";
      const status = typeof event.payload?.X === "string" ? event.payload.X.toUpperCase() : "";
      if (execType === "TRADE" || status === "FILLED" || status === "PARTIALLY_FILLED") {
        void this.refreshPositions();
      }
    });
    this.userStream.onConnect(() => {
      void this.refreshSnapshots();
    });
  }

  async ensureInitialized(symbol: string): Promise<void> {
    if (this.initialized) return;
    if (this.initializing) return this.initializing;
    this.initializing = (async () => {
      await this.refreshSnapshots();
      this.initialized = true;
      await this.userStream.start();
      this.startPositionSync();
    })().catch((error) => {
      this.initializing = null;
      throw error;
    });
    return this.initializing;
  }

  onAccount(listener: (snapshot: AsterAccountSnapshot) => void): void {
    this.accountEvent.add(listener);
    if (this.accountSnapshot) listener(this.accountSnapshot);
  }

  onOrders(listener: (orders: AsterOrder[]) => void): void {
    this.ordersEvent.add(listener);
    listener(Array.from(this.openOrders.values()));
  }

  onDepth(symbol: string, listener: (depth: AsterDepth) => void): void {
    const upper = symbol.toUpperCase();
    let event = this.depthEvents.get(upper);
    if (!event) {
      event = new SimpleEvent<AsterDepth>();
      this.depthEvents.set(upper, event);
      this.publicStreams.subscribeDepth(upper, (depth) => {
        event?.emit(depth);
      });
    }
    event.add(listener);
  }

  onTicker(symbol: string, listener: (ticker: AsterTicker) => void): void {
    const upper = symbol.toUpperCase();
    let event = this.tickerEvents.get(upper);
    if (!event) {
      event = new SimpleEvent<AsterTicker>();
      this.tickerEvents.set(upper, event);
      this.publicStreams.subscribeTicker(upper, (ticker) => {
        event?.emit(ticker);
      });
    }
    event.add(listener);
  }

  onKlines(symbol: string, interval: string, listener: (klines: AsterKline[]) => void): void {
    const upper = symbol.toUpperCase();
    const key = `${upper}:${interval}`;
    let event = this.klineEvents.get(key);
    if (!event) {
      event = new SimpleEvent<AsterKline[]>();
      this.klineEvents.set(key, event);
      this.publicStreams.subscribeKline(symbol, interval, (kline) => {
        const storeKey = `${upper}:${interval}`;
        let store = this.klineStores.get(storeKey);
        if (!store) {
          store = [];
          this.klineStores.set(storeKey, store);
        }
        const index = store.findIndex((item) => item.openTime === kline.openTime);
        if (index >= 0) {
          store[index] = kline;
        } else {
          store.push(kline);
          store.sort((a, b) => a.openTime - b.openTime);
          if (store.length > DEFAULT_KLINE_LIMIT) {
            store.shift();
          }
        }
        event?.emit([...store]);
      });
      void this.ensureKlineSeed(upper, interval);
    }
    event.add(listener);
    const existing = this.klineStores.get(key);
    if (existing && existing.length) {
      listener([...existing]);
    } else {
      void this.ensureKlineSeed(upper, interval);
    }
  }

  private ensureKlineSeed(symbol: string, interval: string): Promise<void> {
    const key = `${symbol}:${interval}`;
    const existing = this.klineInitialFetches.get(key);
    if (existing) return existing;
    const task = (async () => {
      try {
        const klines = await this.rest.getKlines(symbol, interval, DEFAULT_KLINE_LIMIT);
        klines.sort((a, b) => a.openTime - b.openTime);
        this.klineStores.set(key, klines);
        const event = this.klineEvents.get(key);
        if (event) {
          event.emit([...klines]);
        }
      } catch (error) {
        console.error("[AsterGateway] seed klines failed", error);
      } finally {
        this.startKlineRefresh(symbol, interval);
      }
    })();
    this.klineInitialFetches.set(key, task);
    return task;
  }

  private startKlineRefresh(symbol: string, interval: string): void {
    const key = `${symbol}:${interval}`;
    if (this.klineRefreshTimers.has(key)) return;
    const timer = setInterval(async () => {
      try {
        const klines = await this.rest.getKlines(symbol, interval, DEFAULT_KLINE_LIMIT);
        klines.sort((a, b) => a.openTime - b.openTime);
        this.klineStores.set(key, klines);
        const event = this.klineEvents.get(key);
        if (event) {
          event.emit([...klines]);
        }
      } catch (error) {
        console.error("[AsterGateway] refresh klines failed", error);
      }
    }, KLINE_REFRESH_INTERVAL_MS);
    this.klineRefreshTimers.set(key, timer);
  }

  private async refreshSnapshots(): Promise<void> {
    try {
      const account = await this.rest.getAccount();
      let positions = account.positions ?? [];
      try {
        const latestPositions = await this.rest.getPositions();
        if (Array.isArray(latestPositions) && latestPositions.length) {
          positions = latestPositions;
        }
      } catch (positionError) {
        console.error("[AsterGateway] 刷新持仓失败", positionError);
      }
      const normalizedPositions = clonePositions(positions);
      const snapshot: AsterAccountSnapshot = {
        ...account,
        positions: normalizedPositions,
        totalUnrealizedProfit: sumUnrealizedProfit(normalizedPositions),
        updateTime: Date.now(),
      };
      this.accountSnapshot = snapshot;
      this.accountEvent.emit(snapshot);
    } catch (error) {
      console.error("[AsterGateway] 刷新账户信息失败", error);
    }
    try {
      const orders = await this.rest.getOpenOrders();
      this.openOrders.clear();
      orders.forEach((order) => mergeOrderSnapshot(this.openOrders, order));
      this.ordersEvent.emit(Array.from(this.openOrders.values()));
    } catch (error) {
      console.error("[AsterGateway] 刷新挂单失败", error);
    }
  }

  private startPositionSync(): void {
    if (this.positionSyncTimer) return;
    const tick = () => {
      void this.refreshPositions();
    };
    void this.refreshPositions();
    this.positionSyncTimer = setInterval(tick, POSITION_SYNC_INTERVAL_MS);
  }

  private async refreshPositions(): Promise<void> {
    if (this.positionSyncInFlight) return;
    this.positionSyncInFlight = true;
    try {
      const positions = await this.rest.getPositions();
      if (!Array.isArray(positions)) return;
      const normalizedPositions = clonePositions(positions);
      if (!this.accountSnapshot) {
        const snapshot: AsterAccountSnapshot = {
          canTrade: true,
          canDeposit: true,
          canWithdraw: true,
          updateTime: Date.now(),
          totalWalletBalance: "0",
          totalUnrealizedProfit: sumUnrealizedProfit(normalizedPositions),
          positions: normalizedPositions,
          assets: [],
        };
        this.accountSnapshot = snapshot;
        this.accountEvent.emit(snapshot);
        return;
      }
      const nextSnapshot: AsterAccountSnapshot = {
        ...this.accountSnapshot,
        positions: normalizedPositions,
        totalUnrealizedProfit: sumUnrealizedProfit(normalizedPositions),
        updateTime: Date.now(),
      };
      this.accountSnapshot = nextSnapshot;
      this.accountEvent.emit(nextSnapshot);
    } catch (error) {
      console.error("[AsterGateway] 同步持仓失败", error);
    } finally {
      this.positionSyncInFlight = false;
    }
  }

  getAccountSnapshot(): AsterAccountSnapshot | null {
    return this.accountSnapshot;
  }

  getOpenOrdersSnapshot(): AsterOrder[] {
    return Array.from(this.openOrders.values());
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    const order = await this.rest.createOrder(params);
    mergeOrderSnapshot(this.openOrders, order);
    this.ordersEvent.emit(Array.from(this.openOrders.values()));
    return order;
  }

  async cancelOrder(params: { symbol: string; orderId?: number; origClientOrderId?: string }): Promise<void> {
    const result = await this.rest.cancelOrder(params);
    mergeOrderSnapshot(this.openOrders, result);
    this.ordersEvent.emit(Array.from(this.openOrders.values()));
  }

  async cancelOrders(params: { symbol: string; orderIdList?: Array<number | string>; origClientOrderIdList?: string[] }): Promise<void> {
    const results = await this.rest.cancelOrders(params);
    results.forEach((order) => mergeOrderSnapshot(this.openOrders, order));
    this.ordersEvent.emit(Array.from(this.openOrders.values()));
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.rest.cancelAllOrders(params);
    for (const [key, order] of Array.from(this.openOrders.entries())) {
      if (order.symbol === params.symbol) {
        this.openOrders.delete(key);
      }
    }
    this.ordersEvent.emit(Array.from(this.openOrders.values()));
  }
}
