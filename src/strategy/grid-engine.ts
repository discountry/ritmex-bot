import type { GridConfig } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterOrder, AsterTicker } from "../exchanges/types";
import { routeLimitOrder, routeMarketOrder } from "../exchanges/order-router";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { decimalsOf, formatPriceToString, roundDownToTick, roundQtyDownToStep } from "../utils/math";
import { extractMessage } from "../utils/errors";
import { getMidOrLast } from "../utils/price";
import { getPosition, type PositionSnapshot } from "../utils/strategy";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";

interface GridLevelState {
  index: number;
  price: number;
  side: "BUY" | "SELL";
  status: "idle" | "entry-working" | "position-open" | "exit-working";
  entryOrderId?: string;
  exitOrderId?: string;
  blockedUntil?: number;
  entryClientId?: string;
  exitClientId?: string;
}

interface DesiredGridOrder {
  level: number;
  side: "BUY" | "SELL";
  price: string;
  amount: number;
  intent: "ENTRY" | "EXIT";
}

interface GridLineSnapshot {
  level: number;
  price: number;
  side: "BUY" | "SELL";
  active: boolean;
  hasOrder: boolean;
}

export interface GridEngineSnapshot {
  ready: boolean;
  symbol: string;
  centerPrice: number | null;
  lowerPrice: number | null;
  upperPrice: number | null;
  lastPrice: number | null;
  gridLines: GridLineSnapshot[];
  desiredOrders: DesiredGridOrder[];
  openOrders: AsterOrder[];
  position: PositionSnapshot;
  running: boolean;
  stopReason: string | null;
  tradeLog: TradeLogEntry[];
  feedStatus: {
    account: boolean;
    orders: boolean;
    depth: boolean;
    ticker: boolean;
  };
  lastUpdated: number | null;
}

type GridEvent = "update";
type GridListener = (snapshot: GridEngineSnapshot) => void;

interface EngineOptions {
  now?: () => number;
}

const FINAL_STATUSES = new Set(["FILLED", "CANCELED", "CANCELLED", "REJECTED", "EXPIRED"]);
const EPSILON = 1e-8;

export class GridEngine {
  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<GridEvent, GridEngineSnapshot>();
  private readonly priceDecimals: number;
  private readonly now: () => number;

  private accountSnapshot: AsterAccountSnapshot | null = null;
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private openOrders: AsterOrder[] = [];

  private position: PositionSnapshot = { positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null };
  private desiredOrders: DesiredGridOrder[] = [];
  private levels: GridLevelState[] = [];
  private readonly orderIntentById = new Map<string, { level: number; intent: "ENTRY" | "EXIT"; side: "BUY" | "SELL"; price: string; clientId?: string }>();
  private readonly orderIntentByClientId = new Map<string, { level: number; intent: "ENTRY" | "EXIT"; side: "BUY" | "SELL"; price: string; clientId?: string }>();
  private readonly pendingCancels = new Set<string>();

  private gridReady = false;
  private running = true;
  private stopReason: string | null = null;
  private centerPrice: number | null = null;
  private lowerPrice: number | null = null;
  private upperPrice: number | null = null;
  private gridSpacing: number | null = null;
  private lastPrice: number | null = null;
  private lastUpdated: number | null = null;

  private feedStatus = {
    account: false,
    orders: false,
    depth: false,
    ticker: false,
  };

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private maxOpenOrderHitUntil: number | null = null;

  constructor(private readonly config: GridConfig, private readonly exchange: ExchangeAdapter, options: EngineOptions = {}) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.priceDecimals = Math.max(0, decimalsOf(this.config.priceTick));
    this.now = options.now ?? Date.now;
    this.bootstrap();
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => void this.tick(), this.config.refreshIntervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  on(event: GridEvent, listener: GridListener): void {
    this.events.on(event, listener);
  }

  off(event: GridEvent, listener: GridListener): void {
    this.events.off(event, listener);
  }

  getSnapshot(): GridEngineSnapshot {
    return this.buildSnapshot();
  }

  private bootstrap(): void {
    const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.accountSnapshot = snapshot;
        this.position = getPosition(snapshot, this.config.symbol);
        if (!this.feedStatus.account) {
          this.feedStatus.account = true;
          log("info", "账户快照已同步");
        }
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅账户失败: ${extractMessage(error)}`,
        processFail: (error) => `账户推送处理异常: ${extractMessage(error)}`,
      }
    );

    safeSubscribe<AsterOrder[]>(
      this.exchange.watchOrders.bind(this.exchange),
      (orders) => {
        this.syncOrdersFromFeed(orders);
        if (!this.feedStatus.orders) {
          this.feedStatus.orders = true;
          log("info", "订单快照已同步");
        }
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅订单失败: ${extractMessage(error)}`,
        processFail: (error) => `订单推送处理异常: ${extractMessage(error)}`,
      }
    );

    safeSubscribe<AsterDepth>(
      this.exchange.watchDepth.bind(this.exchange, this.config.symbol),
      (depth) => {
        this.depthSnapshot = depth;
        if (!this.feedStatus.depth) {
          this.feedStatus.depth = true;
          log("info", "盘口深度已同步");
        }
      },
      log,
      {
        subscribeFail: (error) => `订阅深度失败: ${extractMessage(error)}`,
        processFail: (error) => `深度推送处理异常: ${extractMessage(error)}`,
      }
    );

    safeSubscribe<AsterTicker>(
      this.exchange.watchTicker.bind(this.exchange, this.config.symbol),
      (ticker) => {
        this.tickerSnapshot = ticker;
        this.lastPrice = this.getReferencePrice();
        if (!this.feedStatus.ticker) {
          this.feedStatus.ticker = true;
          log("info", "行情推送已同步");
        }
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅行情失败: ${extractMessage(error)}`,
        processFail: (error) => `行情推送处理异常: ${extractMessage(error)}`,
      }
    );
  }

  private syncOrdersFromFeed(orders: AsterOrder[] | null | undefined): void {
    const list = Array.isArray(orders) ? orders.filter((o) => o.symbol === this.config.symbol) : [];
    this.openOrders = list;
    const currentIds = new Set(list.map((o) => String(o.orderId)));

    for (const order of list) {
      const status = String(order.status ?? "").toUpperCase();
      if (FINAL_STATUSES.has(status)) {
        this.handleOrderResolution(String(order.orderId), status, order);
      }
    }

    for (const [orderId, meta] of [...this.orderIntentById.entries()]) {
      if (currentIds.has(orderId)) continue;
      const assumedStatus = this.pendingCancels.has(orderId) ? "CANCELED" : "FILLED";
      this.handleOrderResolution(orderId, assumedStatus, undefined, meta);
    }

    for (const [clientId, meta] of [...this.orderIntentByClientId.entries()]) {
      const exists = list.some((o) => o.clientOrderId && String(o.clientOrderId) === clientId);
      if (exists) continue;
      const assumedStatus = this.pendingCancels.has(clientId) ? "CANCELED" : "FILLED";
      this.handleOrderResolution(clientId, assumedStatus, undefined, meta);
    }

    this.rebuildLevelAssignmentsFromOrders();
  }

  private async tick(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      if (!this.running) {
        this.emitUpdate();
        return;
      }
      if (!this.isReady()) {
        this.emitUpdate();
        return;
      }
      const price = this.getReferencePrice();
      this.lastPrice = price;
      if (!Number.isFinite(price) || price === null) {
        this.emitUpdate();
        return;
      }
      if (!this.gridReady) {
        this.buildGrid(price);
      }

      if (this.lowerPrice != null && this.upperPrice != null && this.shouldStop(price)) {
        await this.stopAndFlatten(price);
        this.emitUpdate();
        return;
      }

      this.desiredOrders = this.buildDesiredOrders();
      await this.syncOpenOrders();
      this.lastUpdated = this.now();
      this.emitUpdate();
    } catch (error) {
      this.tradeLog.push("error", `网格轮询异常: ${extractMessage(error)}`);
    } finally {
      this.processing = false;
    }
  }

  private isReady(): boolean {
    return this.feedStatus.account && this.feedStatus.orders && this.feedStatus.ticker;
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot);
  }

  private buildGrid(referencePrice: number): void {
    const spacingRaw = Math.max(this.config.priceTick, referencePrice * this.config.spacingPct);
    const spacing = Math.max(this.config.priceTick, Number(formatPriceToString(spacingRaw, this.priceDecimals)));
    const center = Number(formatPriceToString(referencePrice, this.priceDecimals));
    const lower = Number(formatPriceToString(center - spacing * this.config.levelsPerSide, this.priceDecimals));
    const upper = Number(formatPriceToString(center + spacing * this.config.levelsPerSide, this.priceDecimals));

    this.gridSpacing = spacing;
    this.centerPrice = center;
    this.lowerPrice = lower;
    this.upperPrice = upper;
    this.levels = [];

    for (let i = -this.config.levelsPerSide; i <= this.config.levelsPerSide; i += 1) {
      if (i === 0) continue; // skip center to avoid immediate self-cross
      const price = this.clampPrice(center + spacing * i);
      const side: "BUY" | "SELL" = i < 0 ? "BUY" : "SELL";
      this.levels.push({ index: i, price, side, status: "idle" });
    }

    this.gridReady = true;
    this.tradeLog.push("info", `网格已基于 ${center} 初始化，步长 ${spacing}，每侧 ${this.config.levelsPerSide} 格`);

    // 生成完网格后，让现有挂单映射到网格，避免重复补单
    this.rebuildLevelAssignmentsFromOrders();
  }

  private clampPrice(value: number): number {
    const rounded = roundDownToTick(value, this.config.priceTick);
    return Number(formatPriceToString(rounded, this.priceDecimals));
  }

  private shouldStop(price: number): boolean {
    if (this.lowerPrice == null || this.upperPrice == null) return false;
    const lowerGuard = this.lowerPrice * (1 - this.config.stopLossBufferPct);
    const upperGuard = this.upperPrice * (1 + this.config.stopLossBufferPct);
    if (price <= lowerGuard) {
      this.stopReason = `价格跌破网格下界 ${(100 * (1 - price / this.lowerPrice)).toFixed(2)}%`;
      return true;
    }
    if (price >= upperGuard) {
      this.stopReason = `价格突破网格上界 ${(100 * (price / this.upperPrice - 1)).toFixed(2)}%`;
      return true;
    }
    return false;
  }

  private async stopAndFlatten(_price: number): Promise<void> {
    if (!this.running) return;
    this.running = false;
    const reason = this.stopReason ?? "触发止损";
    this.tradeLog.push("warn", `${reason}，开始撤单并平仓`);
    try {
      await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
      this.tradeLog.push("order", "已撤销全部网格挂单");
    } catch (error) {
      this.tradeLog.push("error", `撤销挂单失败: ${extractMessage(error)}`);
    }
    await this.closePosition();
    this.orderIntentById.clear();
    this.pendingCancels.clear();
    for (const level of this.levels) {
      level.entryOrderId = undefined;
      level.exitOrderId = undefined;
      level.status = "idle";
    }
  }

  private async closePosition(): Promise<void> {
    const qty = this.position.positionAmt;
    if (!Number.isFinite(qty) || Math.abs(qty) < EPSILON) return;
    const side: "BUY" | "SELL" = qty > 0 ? "SELL" : "BUY";
    const quantity = roundQtyDownToStep(Math.abs(qty), this.config.qtyStep);
    if (quantity <= 0) return;
    try {
      await routeMarketOrder({
        adapter: this.exchange,
        symbol: this.config.symbol,
        side,
        quantity,
        reduceOnly: true,
        closePosition: true,
      });
      this.tradeLog.push("order", `市价止损平仓 ${side} ${quantity}`);
    } catch (error) {
      this.tradeLog.push("error", `平仓失败: ${extractMessage(error)}`);
    }
  }

  private buildDesiredOrders(): DesiredGridOrder[] {
    if (!this.gridReady || this.gridSpacing == null) return [];
    const desired: DesiredGridOrder[] = [];
    for (const level of this.levels) {
      if (level.blockedUntil && this.now() < level.blockedUntil) {
        continue;
      }
      if (level.status === "position-open" || level.status === "exit-working") {
        const exitPrice = this.computeExitPrice(level);
        const priceStr = formatPriceToString(exitPrice, this.priceDecimals);
        desired.push({
          level: level.index,
          side: level.side === "BUY" ? "SELL" : "BUY",
          price: priceStr,
          amount: this.config.tradeAmount,
          intent: "EXIT",
        });
      } else {
        const entryPrice = formatPriceToString(level.price, this.priceDecimals);
        desired.push({
          level: level.index,
          side: level.side,
          price: entryPrice,
          amount: this.config.tradeAmount,
          intent: "ENTRY",
        });
      }
    }
    return desired;
  }

  private computeExitPrice(level: GridLevelState): number {
    if (this.gridSpacing == null) return level.price;
    const delta = Math.max(this.config.priceTick, this.gridSpacing);
    const raw = level.side === "BUY" ? level.price + delta : level.price - delta;
    const bumped = level.side === "BUY" ? Math.max(raw, level.price + this.config.priceTick) : Math.min(raw, level.price - this.config.priceTick);
    return this.clampPrice(bumped);
  }

  private async syncOpenOrders(): Promise<void> {
    const nowTs = this.now();
    if (this.maxOpenOrderHitUntil && nowTs < this.maxOpenOrderHitUntil) {
      this.tradeLog.push("info", "命中交易所挂单上限冷却，暂不补单");
      return;
    }
    const desiredKeys = new Map<string, DesiredGridOrder>();
    for (const order of this.desiredOrders) {
      const normalizedPrice = this.clampPrice(Number(order.price));
      const normalizedOrder = { ...order, price: formatPriceToString(normalizedPrice, this.priceDecimals) };
      desiredKeys.set(this.orderKey(normalizedOrder), normalizedOrder);
    }

    const activeKeys = new Set<string>();
    for (const order of this.openOrders) {
      if (order.symbol !== this.config.symbol) continue;
      const status = String(order.status ?? "").toUpperCase();
      if (FINAL_STATUSES.has(status)) continue;
      const priceStr = formatPriceToString(this.clampPrice(Number(order.price ?? 0)), this.priceDecimals);
      const meta = this.orderIntentById.get(String(order.orderId))
        ?? (order.clientOrderId ? this.orderIntentByClientId.get(String(order.clientOrderId)) : undefined);
      let intent = meta?.intent;
      let levelIdx = meta?.level;
      if (!intent || levelIdx == null) {
        const parsedFromClient = order.clientOrderId ? this.parseClientOrderId(String(order.clientOrderId)) : null;
        if (parsedFromClient) {
          intent = parsedFromClient.intent;
          levelIdx = parsedFromClient.level;
        }
        const match = this.matchLevelForOrder(Number(order.price ?? 0), order.side === "SELL" ? "SELL" : "BUY", (a, b) => Math.abs(a - b) <= Math.max(this.config.priceTick * 0.5, 1e-9));
        if (match) {
          intent = match.intent;
          levelIdx = match.level.index;
        }
      }
      const side = order.side === "SELL" ? "SELL" : "BUY";
      const key = this.orderKey({ intent: intent ?? "ENTRY", price: priceStr, side, level: levelIdx ?? 0, amount: 0 });
      if (desiredKeys.has(key)) {
        activeKeys.add(key);
      } else {
        await this.cancelOrder(order);
      }
    }

    for (const order of this.desiredOrders) {
      const normalizedPrice = this.clampPrice(Number(order.price));
      const normalizedOrder = { ...order, price: formatPriceToString(normalizedPrice, this.priceDecimals) };
      const key = this.orderKey(normalizedOrder);
      if (activeKeys.has(key)) continue;
      await this.placeGridOrder(normalizedOrder);
    }
  }

  private async cancelOrder(order: AsterOrder): Promise<void> {
    if (!order || order.orderId == null) return;
    const orderId = String(order.orderId);
    if (this.pendingCancels.has(orderId)) return;
    try {
      this.pendingCancels.add(orderId);
      await this.exchange.cancelOrder({ symbol: this.config.symbol, orderId });
      this.tradeLog.push("order", `撤销多余挂单 #${orderId}`);
    } catch (error) {
      this.tradeLog.push("error", `撤单失败 #${orderId}: ${extractMessage(error)}`);
    }
  }

  private async placeGridOrder(target: DesiredGridOrder): Promise<void> {
    const quantity = roundQtyDownToStep(Math.abs(target.amount), this.config.qtyStep);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      this.tradeLog.push("error", "下单数量无效，跳过网格单");
      return;
    }
    const priceNum = Number(target.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) return;
    const clientId = this.buildClientOrderId(target);
    try {
      const placed = await routeLimitOrder({
        adapter: this.exchange,
        symbol: this.config.symbol,
        side: target.side,
        price: priceNum,
        quantity,
        timeInForce: "GTX",
        clientOrderId: clientId,
      });
      if (placed && placed.orderId != null) {
        const orderId = String(placed.orderId);
        this.orderIntentById.set(orderId, {
          level: target.level,
          intent: target.intent,
          side: target.side,
          price: target.price,
          clientId,
        });
        const returnedClientId = (placed as any).clientOrderId || (placed as any).client_order_id;
        if (returnedClientId) {
          this.orderIntentByClientId.set(String(returnedClientId), {
            level: target.level,
            intent: target.intent,
            side: target.side,
            price: target.price,
            clientId: String(returnedClientId),
          });
        }
        const level = this.levels.find((lv) => lv.index === target.level);
        if (level) {
          if (target.intent === "ENTRY") {
            level.status = "entry-working";
            level.entryOrderId = orderId;
            level.entryClientId = String(returnedClientId ?? clientId);
          } else {
            level.status = "exit-working";
            level.exitOrderId = orderId;
            level.exitClientId = String(returnedClientId ?? clientId);
          }
        }
        this.tradeLog.push("order", `${target.intent === "ENTRY" ? "挂开仓" : "挂平仓"} ${target.side} @ ${target.price}`);
      }
    } catch (error) {
      this.tradeLog.push("error", `挂单失败 (${target.side} @ ${target.price}): ${extractMessage(error)}`);
      const level = this.levels.find((lv) => lv.index === target.level);
      const message = String(error ?? "").toLowerCase();
      const isOpenLimit = message.includes("max open order") || message.includes("open orders exceeded");
      const backoff = isOpenLimit ? 30_000 : 5_000;
      if (level) {
        level.blockedUntil = this.now() + backoff;
      }
      if (isOpenLimit) {
        this.maxOpenOrderHitUntil = this.now() + backoff;
      }
    }
  }

  private handleOrderResolution(orderId: string, status: string, order?: AsterOrder, fallbackMeta?: {
    level: number;
    intent: "ENTRY" | "EXIT";
    side: "BUY" | "SELL";
    price: string;
  }): void {
    const meta = fallbackMeta ?? this.orderIntentById.get(orderId) ?? this.orderIntentByClientId.get(orderId);
    if (!meta) return;
    const level = this.levels.find((lv) => lv.index === meta.level);
    if (!level) return;
    const priceStr = meta.price ?? formatPriceToString(Number(order?.price ?? 0), this.priceDecimals);
    if (meta.intent === "ENTRY") {
      level.entryOrderId = undefined;
      if (level.entryClientId === orderId) level.entryClientId = undefined;
      if (status === "FILLED") {
        level.status = "position-open";
        this.tradeLog.push("fill", `网格开仓成交 ${meta.side} @ ${priceStr} (#${meta.level})`);
      } else {
        level.status = "idle";
      }
    } else {
      level.exitOrderId = undefined;
      if (level.exitClientId === orderId) level.exitClientId = undefined;
      if (status === "FILLED") {
        level.status = "idle";
        this.tradeLog.push("fill", `网格平仓成交 ${meta.side} @ ${priceStr} (#${meta.level})`);
      } else {
        level.status = "position-open";
      }
    }
    this.orderIntentById.delete(orderId);
    this.orderIntentByClientId.delete(orderId);
    if (meta.clientId) {
      this.orderIntentByClientId.delete(meta.clientId);
      this.orderIntentById.delete(meta.clientId);
    }
    this.pendingCancels.delete(orderId);
  }

  private orderKey(order: Pick<DesiredGridOrder, "intent" | "side" | "price" | "level">): string {
    return `${order.intent}:${order.side}:${order.price}:${order.level}`;
  }

  private rebuildLevelAssignmentsFromOrders(): void {
    if (!this.gridReady || !this.levels.length) return;
    // Reset derived state
    for (const level of this.levels) {
      level.entryOrderId = undefined;
      level.exitOrderId = undefined;
      level.entryClientId = undefined;
      level.exitClientId = undefined;
      if (level.status === "entry-working" || level.status === "exit-working") {
        level.status = "idle";
      }
    }

    const priceMatch = (a: number, b: number): boolean => {
      const tolerance = Math.max(this.config.priceTick * 0.55, 1e-8);
      return Math.abs(a - b) <= tolerance;
    };

    let unmatched = 0;
    for (const order of this.openOrders) {
      const status = String(order.status ?? "").toUpperCase();
      if (FINAL_STATUSES.has(status)) continue;
      const price = Number(order.price ?? 0);
      if (!Number.isFinite(price)) {
        unmatched += 1;
        continue;
      }
      const orderSide = order.side === "SELL" ? "SELL" : "BUY";
      const match = this.matchLevelForOrder(price, orderSide, priceMatch);
      if (!match) {
        unmatched += 1;
        continue;
      }
      const { level, intent } = match;
      const orderId = String(order.orderId ?? "");
      const clientId = order.clientOrderId ? String(order.clientOrderId) : undefined;
      const keyMeta = {
        level: level.index,
        intent,
        side: order.side === "SELL" ? "SELL" : "BUY",
        price: formatPriceToString(price, this.priceDecimals),
        clientId,
      };
      this.orderIntentById.set(orderId, keyMeta);
      if (clientId) {
        this.orderIntentByClientId.set(clientId, keyMeta);
      }
      if (intent === "ENTRY") {
        level.status = "entry-working";
        level.entryOrderId = orderId;
        if (clientId) level.entryClientId = clientId;
      } else {
        level.status = "exit-working";
        level.exitOrderId = orderId;
        if (clientId) level.exitClientId = clientId;
      }
    }

    if (unmatched > 0) {
      this.tradeLog.push("info", `存在 ${unmatched} 笔挂单未能映射到网格价位，已跳过重复补单`);
    }
  }

  private buildClientOrderId(order: DesiredGridOrder): string {
    const intentFlag = order.intent === "ENTRY" ? "1" : "2";
    const sideFlag = order.side === "BUY" ? "1" : "2";
    const signFlag = order.level < 0 ? "0" : "1";
    const levelCode = Math.abs(order.level).toString().padStart(3, "0");
    const ts = Date.now().toString().slice(-8); // tail 8 digits for brevity
    // Digits-only clientId to satisfy exchanges that reject non-numeric IDs
    return `${intentFlag}${sideFlag}${signFlag}${levelCode}${ts}`;
  }

  private parseClientOrderId(clientId: string): { intent: "ENTRY" | "EXIT"; level: number } | null {
    // Expect digits-only string: [intent][side][sign][level(3)][ts...]
    if (!/^[0-9]{5,}$/.test(clientId)) return null;
    const intentBit = clientId[0];
    const signBit = clientId[2];
    const levelCode = clientId.slice(3, 6);
    const intent = intentBit === "1" ? "ENTRY" : intentBit === "2" ? "EXIT" : null;
    const levelAbs = Number(levelCode);
    if (!intent || !Number.isFinite(levelAbs)) return null;
    const level = signBit === "0" ? -levelAbs : levelAbs;
    return { intent, level };
  }

  private matchLevelForOrder(
    price: number,
    side: "BUY" | "SELL",
    matcher: (a: number, b: number) => boolean
  ): { level: GridLevelState; intent: "ENTRY" | "EXIT" } | null {
    const normalizedPrice = this.clampPrice(price);
    // Quick exact match by index map to avoid O(n^2) under high density
    const primary = this.levels.find((lv) => matcher(this.clampPrice(lv.price), normalizedPrice));
    if (primary && primary.side === side) {
      return { level: primary, intent: "ENTRY" };
    }
    if (primary && primary.side !== side && matcher(this.clampPrice(this.computeExitPrice(primary)), normalizedPrice)) {
      return { level: primary, intent: "EXIT" };
    }
    for (const level of this.levels) {
      // entry-side match: same side, price == level price
      const levelPrice = this.clampPrice(level.price);
      if (side === level.side && matcher(levelPrice, normalizedPrice)) {
        return { level, intent: "ENTRY" };
      }
      // exit-side match: opposite side, price == computed exit price
      if (side !== level.side) {
        const exitPrice = this.clampPrice(this.computeExitPrice(level));
        if (matcher(exitPrice, normalizedPrice)) {
          return { level, intent: "EXIT" };
        }
      }
    }
    return null;
  }

  private buildSnapshot(): GridEngineSnapshot {
    const gridLines: GridLineSnapshot[] = this.levels.map((level) => ({
      level: level.index,
      price: level.price,
      side: level.side,
      active: this.running,
      hasOrder: level.status === "entry-working" || level.status === "exit-working",
    }));

    return {
      ready: this.gridReady && this.isReady(),
      symbol: this.config.symbol,
      centerPrice: this.centerPrice,
      lowerPrice: this.lowerPrice,
      upperPrice: this.upperPrice,
      lastPrice: this.lastPrice,
      gridLines,
      desiredOrders: this.desiredOrders,
      openOrders: this.openOrders,
      position: this.position,
      running: this.running,
      stopReason: this.stopReason,
      tradeLog: this.tradeLog.all(),
      feedStatus: { ...this.feedStatus },
      lastUpdated: this.lastUpdated,
    };
  }

  private emitUpdate(): void {
    this.events.emit("update", this.buildSnapshot());
  }
}
