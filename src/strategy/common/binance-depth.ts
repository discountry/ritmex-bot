import NodeWebSocket from "ws";
import type { AsterDepthLevel } from "../../exchanges/types";
import type { DepthImbalance } from "../../utils/depth";

const WebSocketCtor: typeof globalThis.WebSocket =
  typeof globalThis.WebSocket !== "undefined"
    ? globalThis.WebSocket
    : ((NodeWebSocket as unknown) as typeof globalThis.WebSocket);

const DEFAULT_WS_BASE_URL = "wss://stream.binance.com:9443/ws";
const DEFAULT_REST_BASE_URL = "https://api.binance.com";

const HEARTBEAT_TIMEOUT_MS = 5 * 60 * 1000;
const HEARTBEAT_CHECK_INTERVAL_MS = 30_000;
const MAX_CONNECTION_DURATION_MS = 23 * 60 * 60 * 1000;
const DATA_STALE_THRESHOLD_MS = 5_000;
const RECONNECT_DELAY_BASE_MS = 3000;
const RECONNECT_DELAY_MAX_MS = 60_000;

const DEFAULT_REFRESH_SYNC_INTERVAL_MS = 30_000;
const DEFAULT_DEPTH_WINDOW_BPS = 9;
const DEFAULT_IMBALANCE_RATIO = 2;
const MAX_BUFFER_SIZE = 5000;
const SYNC_SNAPSHOT_MAX_RETRIES = 5;
const REST_FAILURE_DEFENSE_THRESHOLD = 1;

export type BinanceConnectionState = "connected" | "disconnected" | "stale";

export interface BinanceDepthSnapshot {
  symbol: string;
  buySum: number;
  sellSum: number;
  skipBuySide: boolean;
  skipSellSide: boolean;
  imbalance: DepthImbalance;
  updatedAt: number;
  windowBps: number;
  localLastUpdateId: number;
}

export interface BinanceDepthHealth {
  started: boolean;
  connected: boolean;
  orderBookReady: boolean;
  restHealthy: boolean;
  healthy: boolean;
  reason: string | null;
  lastEventAt: number;
  lastSnapshotAt: number;
  lastRestSyncAt: number;
  localLastUpdateId: number;
}

export type BinanceConnectionListener = (state: BinanceConnectionState) => void;

interface DepthUpdateEvent {
  U: number;
  u: number;
  bids: AsterDepthLevel[];
  asks: AsterDepthLevel[];
}

interface DepthSnapshotResponse {
  lastUpdateId: number;
  bids: AsterDepthLevel[];
  asks: AsterDepthLevel[];
}

export class BinanceDepthTracker {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelayMs = RECONNECT_DELAY_BASE_MS;
  private stopped = false;
  private started = false;

  private snapshot: BinanceDepthSnapshot | null = null;
  private listeners = new Set<(snapshot: BinanceDepthSnapshot) => void>();
  private connectionListeners = new Set<BinanceConnectionListener>();

  private lastMessageTime = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshSyncTimer: ReturnType<typeof setInterval> | null = null;
  private connectionState: BinanceConnectionState = "disconnected";

  private bidBook = new Map<string, number>();
  private askBook = new Map<string, number>();
  private localLastUpdateId = 0;
  private orderBookReady = false;
  private eventBuffer: DepthUpdateEvent[] = [];
  private syncInFlight: Promise<void> | null = null;

  private lastEventAt = 0;
  private lastSnapshotAt = 0;
  private lastRestSyncAt = 0;
  private restConsecutiveFailures = 0;
  private restLastError: string | null = null;

  constructor(
    private readonly symbol: string,
    private readonly options?: {
      baseUrl?: string;
      restBaseUrl?: string;
      levels?: number;
      ratio?: number;
      speedMs?: number;
      depthWindowBps?: number;
      refreshSyncMs?: number;
      logger?: (context: string, error: unknown) => void;
    }
  ) {}

  start(): void {
    this.started = true;
    this.stopped = false;
    this.connect();
    this.startRefreshSyncTimer();
  }

  stop(): void {
    this.started = false;
    this.stopped = true;
    this.cleanup();
  }

  onUpdate(handler: (snapshot: BinanceDepthSnapshot) => void): void {
    this.listeners.add(handler);
  }

  offUpdate(handler: (snapshot: BinanceDepthSnapshot) => void): void {
    this.listeners.delete(handler);
  }

  onConnectionChange(handler: BinanceConnectionListener): void {
    this.connectionListeners.add(handler);
  }

  offConnectionChange(handler: BinanceConnectionListener): void {
    this.connectionListeners.delete(handler);
  }

  getSnapshot(): BinanceDepthSnapshot | null {
    return this.snapshot ? { ...this.snapshot } : null;
  }

  getConnectionState(): BinanceConnectionState {
    return this.connectionState;
  }

  isDataStale(): boolean {
    if (!this.snapshot) return true;
    return Date.now() - this.snapshot.updatedAt > DATA_STALE_THRESHOLD_MS;
  }

  isHealthy(): boolean {
    return this.getHealth().healthy;
  }

  getHealth(): BinanceDepthHealth {
    if (!this.started) {
      return {
        started: false,
        connected: false,
        orderBookReady: false,
        restHealthy: true,
        healthy: true,
        reason: null,
        lastEventAt: this.lastEventAt,
        lastSnapshotAt: this.lastSnapshotAt,
        lastRestSyncAt: this.lastRestSyncAt,
        localLastUpdateId: this.localLastUpdateId,
      };
    }

    const restHealthy = this.restConsecutiveFailures < REST_FAILURE_DEFENSE_THRESHOLD;
    let reason: string | null = null;

    if (this.connectionState !== "connected") {
      reason = `ws_${this.connectionState}`;
    } else if (!this.orderBookReady) {
      reason = "orderbook_not_ready";
    } else if (this.isDataStale()) {
      reason = "orderbook_stale";
    } else if (!restHealthy) {
      reason = this.restLastError ? `rest_sync_failed:${this.restLastError}` : "rest_sync_failed";
    }

    return {
      started: true,
      connected: this.connectionState === "connected",
      orderBookReady: this.orderBookReady,
      restHealthy,
      healthy: reason == null,
      reason,
      lastEventAt: this.lastEventAt,
      lastSnapshotAt: this.lastSnapshotAt,
      lastRestSyncAt: this.lastRestSyncAt,
      localLastUpdateId: this.localLastUpdateId,
    };
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
    if (this.refreshSyncTimer) {
      clearInterval(this.refreshSyncTimer);
      this.refreshSyncTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore close errors
      }
      this.ws = null;
    }
    this.updateConnectionState("disconnected");
  }

  private connect(): void {
    if (this.ws || this.stopped) return;
    const url = this.buildWsUrl();
    this.ws = new WebSocketCtor(url);

    const handleOpen = () => {
      this.reconnectDelayMs = RECONNECT_DELAY_BASE_MS;
      this.lastMessageTime = Date.now();
      this.lastEventAt = Date.now();
      this.orderBookReady = false;
      this.eventBuffer = [];
      this.updateConnectionState("connected");
      this.startHeartbeatMonitor();
      this.startMaxDurationTimer();
      this.options?.logger?.("binanceDepth", "WebSocket connected");
    };

    const handleClose = () => {
      this.ws = null;
      this.orderBookReady = false;
      this.eventBuffer = [];
      this.stopHeartbeatMonitor();
      this.stopMaxDurationTimer();
      this.updateConnectionState("disconnected");

      if (!this.stopped) {
        this.options?.logger?.("binanceDepth", "WebSocket closed, scheduling reconnect");
        this.scheduleReconnect();
      }
    };

    const handleError = (error: unknown) => {
      this.options?.logger?.("binanceDepth", error);
      if (this.ws && this.connectionState === "disconnected") {
        this.ws = null;
        this.scheduleReconnect();
      }
    };

    const handleMessage = (event: { data: unknown }) => {
      this.lastMessageTime = Date.now();
      this.lastEventAt = Date.now();
      if (this.connectionState === "stale") {
        this.updateConnectionState("connected");
      }
      this.handlePayload(event.data);
    };

    const handlePing = (data: unknown) => {
      this.lastMessageTime = Date.now();
      if (this.ws && "pong" in this.ws && typeof this.ws.pong === "function") {
        try {
          this.ws.pong(data as never);
        } catch (error) {
          this.options?.logger?.("binanceDepth pong", error);
        }
      }
    };

    if ("addEventListener" in this.ws && typeof this.ws.addEventListener === "function") {
      this.ws.addEventListener("open", handleOpen);
      this.ws.addEventListener("message", handleMessage as never);
      this.ws.addEventListener("close", handleClose);
      this.ws.addEventListener("error", handleError as never);
      this.ws.addEventListener("ping", handlePing as never);
    } else if ("on" in this.ws && typeof (this.ws as { on?: unknown }).on === "function") {
      const nodeSocket = this.ws as { on: (event: string, listener: (...args: unknown[]) => void) => void };
      nodeSocket.on("open", handleOpen);
      nodeSocket.on("message", (data: unknown) => handleMessage({ data }));
      nodeSocket.on("close", handleClose);
      nodeSocket.on("error", handleError);
      nodeSocket.on("ping", handlePing);
    } else {
      const genericSocket = this.ws as any;
      genericSocket.onopen = handleOpen;
      genericSocket.onmessage = handleMessage;
      genericSocket.onclose = handleClose;
      genericSocket.onerror = handleError;
    }
  }

  private buildWsUrl(): string {
    const baseRaw = (this.options?.baseUrl ?? DEFAULT_WS_BASE_URL).replace(/\/+$/, "");
    const base = baseRaw.endsWith("/ws") || baseRaw.includes("/stream") ? baseRaw : `${baseRaw}/ws`;
    const speed = this.options?.speedMs ?? 100;
    const stream = `${this.symbol.toLowerCase()}@depth@${speed}ms`;
    return `${base}/${stream}`;
  }

  private buildRestDepthUrl(): string {
    const base = (this.options?.restBaseUrl ?? process.env.BINANCE_REST_URL ?? DEFAULT_REST_BASE_URL).replace(/\/+$/, "");
    const symbol = this.symbol.toUpperCase();
    return `${base}/api/v3/depth?symbol=${encodeURIComponent(symbol)}&limit=5000`;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || this.stopped) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, RECONNECT_DELAY_MAX_MS);
      this.connect();
    }, this.reconnectDelayMs);
  }

  private startHeartbeatMonitor(): void {
    this.stopHeartbeatMonitor();
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastMessageTime;

      if (elapsed > DATA_STALE_THRESHOLD_MS && this.connectionState === "connected") {
        this.updateConnectionState("stale");
        this.options?.logger?.("binanceDepth", `Data stale: ${elapsed}ms since last message`);
      }

      if (elapsed > HEARTBEAT_TIMEOUT_MS) {
        this.options?.logger?.("binanceDepth", `Heartbeat timeout: ${elapsed}ms, forcing reconnect`);
        this.forceReconnect("heartbeat_timeout");
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
    this.stopMaxDurationTimer();
    this.maxDurationTimer = setTimeout(() => {
      this.options?.logger?.("binanceDepth", "Max connection duration reached (23h), reconnecting");
      this.forceReconnect("max_duration");
    }, MAX_CONNECTION_DURATION_MS);
  }

  private stopMaxDurationTimer(): void {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
  }

  private startRefreshSyncTimer(): void {
    if (this.refreshSyncTimer) return;
    const refreshSyncMs = Math.max(5000, this.options?.refreshSyncMs ?? DEFAULT_REFRESH_SYNC_INTERVAL_MS);
    this.refreshSyncTimer = setInterval(() => {
      if (!this.started || this.stopped || !this.orderBookReady) return;
      this.ensureSynced("periodic_refresh");
    }, refreshSyncMs);
  }

  private forceReconnect(reason: string): void {
    this.options?.logger?.("binanceDepth", `Force reconnect: ${reason}`);
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

    this.orderBookReady = false;
    this.eventBuffer = [];
    this.updateConnectionState("disconnected");
    this.reconnectDelayMs = RECONNECT_DELAY_BASE_MS;
    this.scheduleReconnect();
  }

  private updateConnectionState(state: BinanceConnectionState): void {
    if (this.connectionState === state) return;
    this.connectionState = state;
    for (const listener of this.connectionListeners) {
      try {
        listener(state);
      } catch (error) {
        this.options?.logger?.("binanceDepth connectionListener", error);
      }
    }
  }

  private handlePayload(data: unknown): void {
    const event = this.parseDepthEvent(data);
    if (!event) return;

    if (!this.orderBookReady) {
      this.eventBuffer.push(event);
      if (this.eventBuffer.length > MAX_BUFFER_SIZE) {
        this.eventBuffer.splice(0, this.eventBuffer.length - MAX_BUFFER_SIZE);
      }
      this.ensureSynced("bootstrap");
      return;
    }

    const applied = this.applyDepthEvent(event);
    if (!applied) {
      this.options?.logger?.(
        "binanceDepth",
        `Detected update gap: local=${this.localLastUpdateId}, event=[${event.U},${event.u}], resyncing`
      );
      this.orderBookReady = false;
      this.eventBuffer = [event];
      this.ensureSynced("sequence_gap");
      return;
    }

    this.emitDepthSnapshot();
  }

  private ensureSynced(reason: string): void {
    if (this.syncInFlight || this.stopped || !this.started) return;
    this.syncInFlight = (async () => {
      try {
        if (!this.orderBookReady) {
          await this.bootstrapOrderBookFromSnapshot(reason);
          return;
        }
        await this.refreshOrderBookFromSnapshot(reason);
      } finally {
        this.syncInFlight = null;
      }
    })();
  }

  private async bootstrapOrderBookFromSnapshot(reason: string): Promise<void> {
    if (this.eventBuffer.length === 0) {
      return;
    }

    for (let attempt = 0; attempt < SYNC_SNAPSHOT_MAX_RETRIES; attempt += 1) {
      const firstBuffered = this.eventBuffer[0];
      if (!firstBuffered) return;

      const snapshot = await this.fetchDepthSnapshot(reason);
      if (!snapshot) return;

      if (snapshot.lastUpdateId < firstBuffered.U) {
        continue;
      }

      this.resetOrderBook(snapshot);

      const buffered = this.eventBuffer.filter((event) => event.u > snapshot.lastUpdateId);
      if (buffered.length > 0) {
        const nextEvent = buffered[0];
        if (!nextEvent) return;
        const nextUpdateId = snapshot.lastUpdateId + 1;
        if (nextEvent.U > nextUpdateId || nextEvent.u < nextUpdateId) {
          continue;
        }

        let failed = false;
        for (const event of buffered) {
          if (!this.applyDepthEvent(event)) {
            failed = true;
            break;
          }
        }
        if (failed) {
          continue;
        }
      }

      this.orderBookReady = true;
      this.eventBuffer = [];
      this.emitDepthSnapshot();
      return;
    }

    this.options?.logger?.("binanceDepth", "Bootstrap orderbook failed after retries");
  }

  private async refreshOrderBookFromSnapshot(reason: string): Promise<void> {
    const snapshot = await this.fetchDepthSnapshot(reason);
    if (!snapshot) return;
    if (snapshot.lastUpdateId < this.localLastUpdateId) {
      return;
    }
    this.resetOrderBook(snapshot);
    this.orderBookReady = true;
    this.emitDepthSnapshot();
  }

  private resetOrderBook(snapshot: DepthSnapshotResponse): void {
    this.bidBook.clear();
    this.askBook.clear();
    this.applyLevels(this.bidBook, snapshot.bids);
    this.applyLevels(this.askBook, snapshot.asks);
    this.localLastUpdateId = snapshot.lastUpdateId;
    this.lastSnapshotAt = Date.now();
  }

  private applyDepthEvent(event: DepthUpdateEvent): boolean {
    if (!this.localLastUpdateId) return false;

    if (event.u < this.localLastUpdateId) {
      return true;
    }
    if (event.U > this.localLastUpdateId + 1) {
      return false;
    }

    this.applyLevels(this.bidBook, event.bids);
    this.applyLevels(this.askBook, event.asks);
    this.localLastUpdateId = event.u;
    return true;
  }

  private applyLevels(book: Map<string, number>, levels: AsterDepthLevel[]): void {
    for (const level of levels) {
      const priceRaw = level?.[0];
      const qtyRaw = level?.[1];
      const price = Number(priceRaw);
      const qty = Number(qtyRaw);
      if (!priceRaw || !Number.isFinite(price) || price <= 0) continue;
      if (!Number.isFinite(qty) || qty < 0) continue;

      if (qty === 0) {
        book.delete(priceRaw);
      } else {
        book.set(priceRaw, qty);
      }
    }
  }

  private emitDepthSnapshot(): void {
    const bestBid = this.findBestPrice(this.bidBook, "bid");
    const bestAsk = this.findBestPrice(this.askBook, "ask");
    if (bestBid == null || bestAsk == null || bestBid <= 0 || bestAsk <= 0 || bestAsk < bestBid) {
      return;
    }

    const windowBps = Math.max(1, this.options?.depthWindowBps ?? DEFAULT_DEPTH_WINDOW_BPS);
    const ratio = Math.max(1.01, this.options?.ratio ?? DEFAULT_IMBALANCE_RATIO);
    const bidWindowMin = bestBid * (1 - windowBps / 10_000);
    const askWindowMax = bestAsk * (1 + windowBps / 10_000);

    let buySum = 0;
    let sellSum = 0;

    for (const [priceRaw, qty] of this.bidBook.entries()) {
      const price = Number(priceRaw);
      if (!Number.isFinite(price) || price < bidWindowMin) continue;
      buySum += qty;
    }
    for (const [priceRaw, qty] of this.askBook.entries()) {
      const price = Number(priceRaw);
      if (!Number.isFinite(price) || price > askWindowMax) continue;
      sellSum += qty;
    }

    const skipSellSide = sellSum === 0 || buySum > sellSum * ratio;
    const skipBuySide = buySum === 0 || sellSum > buySum * ratio;

    let imbalance: DepthImbalance = "balanced";
    if (buySum > sellSum * ratio) {
      imbalance = "buy_dominant";
    } else if (sellSum > buySum * ratio) {
      imbalance = "sell_dominant";
    }

    this.snapshot = {
      symbol: this.symbol,
      buySum,
      sellSum,
      skipBuySide,
      skipSellSide,
      imbalance,
      updatedAt: Date.now(),
      windowBps,
      localLastUpdateId: this.localLastUpdateId,
    };

    for (const listener of this.listeners) {
      try {
        listener({ ...this.snapshot });
      } catch (error) {
        this.options?.logger?.("binanceDepth listener", error);
      }
    }
  }

  private findBestPrice(book: Map<string, number>, side: "bid" | "ask"): number | null {
    let best: number | null = null;

    for (const [priceRaw, qty] of book.entries()) {
      if (!Number.isFinite(qty) || qty <= 0) continue;
      const price = Number(priceRaw);
      if (!Number.isFinite(price) || price <= 0) continue;

      if (best == null) {
        best = price;
        continue;
      }
      if (side === "bid") {
        if (price > best) best = price;
      } else if (price < best) {
        best = price;
      }
    }

    return best;
  }

  private async fetchDepthSnapshot(reason: string): Promise<DepthSnapshotResponse | null> {
    try {
      const response = await fetch(this.buildRestDepthUrl(), {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = (await response.json()) as {
        lastUpdateId?: number;
        bids?: Array<[string, string]>;
        asks?: Array<[string, string]>;
      };

      const lastUpdateId = Number(json.lastUpdateId);
      if (!Number.isFinite(lastUpdateId) || lastUpdateId <= 0) {
        throw new Error("invalid lastUpdateId");
      }

      const bids = Array.isArray(json.bids) ? (json.bids as AsterDepthLevel[]) : [];
      const asks = Array.isArray(json.asks) ? (json.asks as AsterDepthLevel[]) : [];
      this.lastRestSyncAt = Date.now();
      this.restConsecutiveFailures = 0;
      this.restLastError = null;
      return { lastUpdateId, bids, asks };
    } catch (error) {
      this.restConsecutiveFailures += 1;
      this.restLastError = this.extractMessage(error);
      this.options?.logger?.("binanceDepth", `REST sync failed (${reason}): ${this.restLastError}`);
      return null;
    }
  }

  private parseDepthEvent(data: unknown): DepthUpdateEvent | null {
    try {
      const text = typeof data === "string" ? data : Buffer.isBuffer(data) ? data.toString("utf-8") : null;
      if (!text) return null;
      const parsed = JSON.parse(text) as unknown;
      if (!parsed || typeof parsed !== "object") return null;

      const maybeCombined = parsed as { data?: unknown };
      const payload =
        maybeCombined.data && typeof maybeCombined.data === "object"
          ? (maybeCombined.data as Record<string, unknown>)
          : (parsed as Record<string, unknown>);

      const eventType = typeof payload.e === "string" ? payload.e : "";
      if (eventType && eventType !== "depthUpdate") {
        return null;
      }

      const U = Number(payload.U);
      const u = Number(payload.u);
      if (!Number.isFinite(U) || !Number.isFinite(u)) {
        return null;
      }

      const bidsRaw = Array.isArray(payload.b) ? payload.b : [];
      const asksRaw = Array.isArray(payload.a) ? payload.a : [];
      const bids = bidsRaw.filter((level): level is AsterDepthLevel => Array.isArray(level)) as AsterDepthLevel[];
      const asks = asksRaw.filter((level): level is AsterDepthLevel => Array.isArray(level)) as AsterDepthLevel[];

      return { U, u, bids, asks };
    } catch {
      return null;
    }
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
