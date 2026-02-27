import NodeWebSocket from "ws";
import { RSI } from "trading-signals";

const WebSocketCtor: typeof globalThis.WebSocket =
  typeof globalThis.WebSocket !== "undefined"
    ? globalThis.WebSocket
    : ((NodeWebSocket as unknown) as typeof globalThis.WebSocket);

const DEFAULT_REST_BASE_URL = "https://api.binance.com";
const DEFAULT_WS_BASE_URL = "wss://stream.binance.com:9443/ws";

// Binance sends frequent kline updates (typically 2s). We treat longer silence as stale.
const DATA_STALE_THRESHOLD_MS = 10_000;
const HEARTBEAT_TIMEOUT_MS = 5 * 60 * 1000;
const HEARTBEAT_CHECK_INTERVAL_MS = 30_000;
const MAX_CONNECTION_DURATION_MS = 23 * 60 * 60 * 1000;

const RECONNECT_DELAY_BASE_MS = 2000;
const RECONNECT_DELAY_MAX_MS = 60_000;

export type BinanceConnectionState = "connected" | "disconnected" | "stale";

export interface BinanceRsiSnapshot {
  symbol: string;
  interval: string;
  rsiPeriod: number;
  rsi: number | null;
  isStable: boolean;
  lastClose: number | null;
  candleOpenTime: number | null;
  candleClosed: boolean | null;
  updatedAt: number | null;
  connectionState: BinanceConnectionState;
}

type BinanceRsiListener = (snapshot: BinanceRsiSnapshot) => void;

export class BinanceRsiTracker {
  private ws: WebSocket | null = null;
  private stopped = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelayMs = RECONNECT_DELAY_BASE_MS;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
  private lastMessageTime = 0;
  private connectionState: BinanceConnectionState = "disconnected";

  private rsi: RSI;
  private candleOpenTime: number | null = null;
  private candleClosed: boolean | null = null;
  private lastClose: number | null = null;
  private updatedAt: number | null = null;

  private listeners = new Set<BinanceRsiListener>();

  constructor(
    private readonly symbol: string,
    private readonly interval: string,
    private readonly rsiPeriod: number,
    private readonly options?: {
      restBaseUrl?: string;
      wsBaseUrl?: string;
      limit?: number;
      logger?: (context: string, error: unknown) => void;
    }
  ) {
    this.rsi = new RSI(this.rsiPeriod);
  }

  start(): void {
    this.stopped = false;
    void this.seedAndConnect("startup");
  }

  stop(): void {
    this.stopped = true;
    this.cleanup();
  }

  onUpdate(handler: BinanceRsiListener): void {
    this.listeners.add(handler);
  }

  offUpdate(handler: BinanceRsiListener): void {
    this.listeners.delete(handler);
  }

  getSnapshot(): BinanceRsiSnapshot {
    return this.buildSnapshot();
  }

  private buildSnapshot(): BinanceRsiSnapshot {
    const rsiValue = this.rsi.getResult();
    const rsi = typeof rsiValue === "number" && Number.isFinite(rsiValue) ? rsiValue : null;
    return {
      symbol: this.symbol,
      interval: this.interval,
      rsiPeriod: this.rsiPeriod,
      rsi,
      isStable: this.rsi.isStable === true,
      lastClose: this.lastClose,
      candleOpenTime: this.candleOpenTime,
      candleClosed: this.candleClosed,
      updatedAt: this.updatedAt,
      connectionState: this.connectionState,
    };
  }

  private emitUpdate(): void {
    const snapshot = this.buildSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (error) {
        this.options?.logger?.("binanceRsi listener", error);
      }
    }
  }

  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.updateConnectionState("disconnected");
  }

  private updateConnectionState(next: BinanceConnectionState): void {
    if (this.connectionState === next) return;
    this.connectionState = next;
    this.emitUpdate();
  }

  private scheduleReconnect(reason: string): void {
    if (this.reconnectTimer || this.stopped) return;
    this.options?.logger?.("binanceRsi", `Scheduling reconnect: ${reason}`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, RECONNECT_DELAY_MAX_MS);
      void this.seedAndConnect(`reconnect:${reason}`);
    }, this.reconnectDelayMs);
  }

  private forceReconnect(reason: string): void {
    if (this.stopped) return;
    this.options?.logger?.("binanceRsi", `Force reconnect: ${reason}`);
    // Stop timers and close WS; keep RSI state (we will reseed on reconnect).
    this.stopHeartbeatMonitor();
    this.stopMaxDurationTimer();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.updateConnectionState("disconnected");
    this.reconnectDelayMs = RECONNECT_DELAY_BASE_MS;
    this.scheduleReconnect(reason);
  }

  private startHeartbeatMonitor(): void {
    if (this.heartbeatTimer) return;
    this.heartbeatTimer = setInterval(() => {
      const elapsed = Date.now() - this.lastMessageTime;
      if (elapsed > DATA_STALE_THRESHOLD_MS && this.connectionState === "connected") {
        this.updateConnectionState("stale");
      }
      if (elapsed > HEARTBEAT_TIMEOUT_MS) {
        this.forceReconnect(`heartbeat_timeout:${elapsed}`);
      }
    }, HEARTBEAT_CHECK_INTERVAL_MS);
  }

  private stopHeartbeatMonitor(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startMaxDurationTimer(): void {
    if (this.maxDurationTimer) return;
    this.maxDurationTimer = setTimeout(() => {
      this.forceReconnect("max_duration");
    }, MAX_CONNECTION_DURATION_MS);
  }

  private stopMaxDurationTimer(): void {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }

  private buildRestUrl(): string {
    const base = this.options?.restBaseUrl ?? DEFAULT_REST_BASE_URL;
    return base;
  }

  private buildWsUrl(): string {
    const base = this.options?.wsBaseUrl ?? DEFAULT_WS_BASE_URL;
    const stream = `${this.symbol.toLowerCase()}@kline_${this.interval}`;
    return `${base}/${stream}`;
  }

  private async seedAndConnect(reason: string): Promise<void> {
    if (this.stopped) return;
    try {
      await this.seedFromRest();
    } catch (error) {
      this.options?.logger?.(`binanceRsi seed (${reason})`, error);
      this.scheduleReconnect(`seed_failed:${reason}`);
      return;
    }
    this.connectWs(reason);
  }

  private async seedFromRest(): Promise<void> {
    const limit = Math.max(10, Math.floor(this.options?.limit ?? 500));
    const base = this.buildRestUrl();
    const url = new URL("/api/v3/klines", base);
    url.searchParams.set("symbol", this.symbol.toUpperCase());
    url.searchParams.set("interval", this.interval);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Binance klines HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) {
      throw new Error("Binance klines response is not an array");
    }

    // Reset RSI from scratch for determinism.
    this.rsi = new RSI(this.rsiPeriod);
    this.candleOpenTime = null;
    this.candleClosed = null;
    this.lastClose = null;
    this.updatedAt = null;

    // Binance kline array format:
    // [ openTime, open, high, low, close, volume, closeTime, ... ]
    const rows = data
      .map((row) => (Array.isArray(row) ? row : null))
      .filter((row): row is any[] => Array.isArray(row) && row.length >= 7)
      .map((row) => ({
        openTime: Number(row[0]),
        close: Number(row[4]),
        closeTime: Number(row[6]),
      }))
      .filter((k) => Number.isFinite(k.openTime) && Number.isFinite(k.close) && Number.isFinite(k.closeTime))
      .sort((a, b) => a.openTime - b.openTime);

    for (const k of rows) {
      this.rsi.add(k.close);
      this.candleOpenTime = k.openTime;
      this.candleClosed = true;
      this.lastClose = k.close;
      this.updatedAt = Date.now();
    }

    // Last bar may still be forming; we treat it as replaceable.
    if (rows.length > 0) {
      this.candleClosed = false;
    }

    this.emitUpdate();
  }

  private connectWs(reason: string): void {
    if (this.ws || this.stopped) return;
    const url = this.buildWsUrl();
    this.ws = new WebSocketCtor(url);

    const handleOpen = () => {
      this.reconnectDelayMs = RECONNECT_DELAY_BASE_MS;
      this.lastMessageTime = Date.now();
      this.updateConnectionState("connected");
      this.startHeartbeatMonitor();
      this.startMaxDurationTimer();
      this.options?.logger?.("binanceRsi", `WebSocket connected (${reason})`);
    };

    const handleClose = () => {
      this.ws = null;
      this.stopHeartbeatMonitor();
      this.stopMaxDurationTimer();
      if (!this.stopped) {
        this.updateConnectionState("disconnected");
        this.scheduleReconnect("ws_close");
      }
    };

    const handleError = (error: unknown) => {
      this.options?.logger?.("binanceRsi", error);
    };

    const handlePing = (data: unknown) => {
      this.lastMessageTime = Date.now();
      if (this.ws && "pong" in this.ws && typeof this.ws.pong === "function") {
        try {
          this.ws.pong(data as any);
        } catch (error) {
          this.options?.logger?.("binanceRsi pong", error);
        }
      }
    };

    const handleMessage = (event: { data: unknown }) => {
      this.lastMessageTime = Date.now();
      if (this.connectionState === "stale") {
        this.updateConnectionState("connected");
      }
      this.handlePayload(event.data);
    };

    if ("addEventListener" in this.ws && typeof this.ws.addEventListener === "function") {
      this.ws.addEventListener("open", handleOpen);
      this.ws.addEventListener("message", handleMessage as any);
      this.ws.addEventListener("close", handleClose);
      this.ws.addEventListener("error", handleError as any);
      this.ws.addEventListener("ping", handlePing as any);
    } else if ("on" in this.ws && typeof (this.ws as any).on === "function") {
      const nodeSocket = this.ws as any;
      nodeSocket.on("open", handleOpen);
      nodeSocket.on("message", (data: unknown) => handleMessage({ data }));
      nodeSocket.on("close", handleClose);
      nodeSocket.on("error", handleError);
      nodeSocket.on("ping", handlePing);
    } else {
      (this.ws as any).onopen = handleOpen;
      (this.ws as any).onmessage = handleMessage;
      (this.ws as any).onclose = handleClose;
      (this.ws as any).onerror = handleError;
    }
  }

  private handlePayload(data: unknown): void {
    const parsed = this.parsePayload(data);
    if (!parsed) return;
    const openTime = Number(parsed.openTime);
    const close = Number(parsed.close);
    const isClosed = Boolean(parsed.isClosed);
    if (!Number.isFinite(openTime) || !Number.isFinite(close)) return;

    this.applyCandleUpdate({ openTime, close, isClosed });
  }

  private applyCandleUpdate(params: { openTime: number; close: number; isClosed: boolean }): void {
    const { openTime, close, isClosed } = params;

    if (this.candleOpenTime == null) {
      this.rsi.add(close);
      this.candleOpenTime = openTime;
      this.candleClosed = isClosed;
      this.lastClose = close;
      this.updatedAt = Date.now();
      this.emitUpdate();
      return;
    }

    if (openTime < this.candleOpenTime) {
      // Out-of-order update; ignore.
      return;
    }

    if (openTime === this.candleOpenTime) {
      // Same candle: replace last close.
      this.rsi.replace(close);
      this.candleClosed = isClosed;
      this.lastClose = close;
      this.updatedAt = Date.now();
      this.emitUpdate();
      return;
    }

    // New candle started.
    this.rsi.add(close);
    this.candleOpenTime = openTime;
    this.candleClosed = isClosed;
    this.lastClose = close;
    this.updatedAt = Date.now();
    this.emitUpdate();
  }

  private parsePayload(
    data: unknown
  ): { openTime?: number; close?: number; isClosed?: boolean } | null {
    try {
      const text = typeof data === "string" ? data : Buffer.isBuffer(data) ? data.toString("utf-8") : null;
      if (!text) return null;
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object") return null;
      // Raw stream payload shape:
      // { e: "kline", s: "ETHBTC", k: { t: <openTime>, c: <close>, x: <isClosed> } }
      const k = (parsed as any).k;
      if (!k || typeof k !== "object") return null;
      return {
        openTime: Number(k.t),
        close: Number(k.c),
        isClosed: Boolean(k.x),
      };
    } catch {
      return null;
    }
  }
}

