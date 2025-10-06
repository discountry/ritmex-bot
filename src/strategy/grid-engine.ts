import type { GridConfig, GridDirection } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type { AsterAccountSnapshot, AsterDepth, AsterOrder, AsterTicker } from "../exchanges/types";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { decimalsOf } from "../utils/math";
import { extractMessage } from "../utils/errors";
import { getMidOrLast } from "../utils/price";
import { getPosition, type PositionSnapshot } from "../utils/strategy";
import {
  placeMarketOrder,
  placeOrder,
  unlockOperating,
  type OrderLockMap,
  type OrderPendingMap,
  type OrderTimerMap,
} from "../core/order-coordinator";
import { safeCancelOrder } from "../core/lib/orders";
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";

interface DesiredGridOrder {
  level: number;
  side: "BUY" | "SELL";
  price: string;
  amount: number;
  reduceOnly: boolean;
}

interface GridLineSnapshot {
  level: number;
  price: number;
  side: "BUY" | "SELL";
  active: boolean;
  hasOrder: boolean;
  reduceOnly: boolean;
}

export interface GridEngineSnapshot {
  ready: boolean;
  symbol: string;
  lowerPrice: number;
  upperPrice: number;
  lastPrice: number | null;
  midPrice: number | null;
  gridLines: GridLineSnapshot[];
  desiredOrders: DesiredGridOrder[];
  openOrders: AsterOrder[];
  position: PositionSnapshot;
  running: boolean;
  stopReason: string | null;
  direction: GridDirection;
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

const EPSILON = 1e-8;

export class GridEngine {
  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<GridEvent, GridEngineSnapshot>();
  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pendings: OrderPendingMap = {};
  private readonly priceDecimals: number;
  private readonly now: () => number;
  private readonly configValid: boolean;
  private readonly gridLevels: number[];
  private readonly levelExposure = new Map<number, number>();
  private readonly lastOrderBook = new Map<string, { side: "BUY" | "SELL"; level: number; quantity: number }>();
  private readonly pendingCancelKeys = new Set<string>();
  private readonly buyLevelIndices: number[];
  private readonly sellLevelIndices: number[];

  private accountSnapshot: AsterAccountSnapshot | null = null;
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private openOrders: AsterOrder[] = [];

  private position: PositionSnapshot = { positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null };
  private desiredOrders: DesiredGridOrder[] = [];

  private readonly feedArrived = {
    account: false,
    orders: false,
    depth: false,
    ticker: false,
  };

  private readonly feedStatus = {
    account: false,
    orders: false,
    depth: false,
    ticker: false,
  };

  private readonly log: LogHandler;

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private running: boolean;
  private stopReason: string | null = null;
  private lastUpdated: number | null = null;

  constructor(private readonly config: GridConfig, private readonly exchange: ExchangeAdapter, options: EngineOptions = {}) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.log = (type, detail) => this.tradeLog.push(type, detail);
    this.priceDecimals = decimalsOf(this.config.priceTick);
    this.now = options.now ?? Date.now;
    this.configValid = this.validateConfig();
    this.gridLevels = this.computeGridLevels();
    const pivotIndex = Math.floor(Math.max(this.gridLevels.length - 1, 0) / 2);
    this.buyLevelIndices = [];
    this.sellLevelIndices = [];
    for (let i = 0; i < this.gridLevels.length; i += 1) {
      if (i <= pivotIndex) {
        this.buyLevelIndices.push(i);
      }
      if (i >= pivotIndex + 1) {
        this.sellLevelIndices.push(i);
      }
    }
    if (!this.sellLevelIndices.length && this.gridLevels.length > 1) {
      const highest = this.gridLevels.length - 1;
      if (!this.sellLevelIndices.includes(highest)) {
        this.sellLevelIndices.push(highest);
      }
    }
    this.running = this.configValid;
    if (!this.configValid) {
      this.stopReason = "配置无效，已暂停网格";
      this.log("error", this.stopReason);
    }
    this.bootstrap();
  }

  start(): void {
    if (this.timer || !this.running) {
      if (!this.timer && !this.running) {
        this.emitUpdate();
      }
      return;
    }
    this.timer = setInterval(() => {
      void this.tick();
    }, this.config.refreshIntervalMs);
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

  private validateConfig(): boolean {
    if (this.config.lowerPrice <= 0 || this.config.upperPrice <= 0) {
      return false;
    }
    if (this.config.upperPrice <= this.config.lowerPrice) {
      return false;
    }
    if (!Number.isFinite(this.config.gridLevels) || this.config.gridLevels < 2) {
      return false;
    }
    if (!Number.isFinite(this.config.orderSize) || this.config.orderSize <= 0) {
      return false;
    }
    if (!Number.isFinite(this.config.maxPositionSize) || this.config.maxPositionSize <= 0) {
      return false;
    }
    return true;
  }

  private bootstrap(): void {
    const log: LogHandler = (type, detail) => this.tradeLog.push(type, detail);

    safeSubscribe<AsterAccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.accountSnapshot = snapshot;
        this.position = getPosition(snapshot, this.config.symbol);
        if (!this.feedArrived.account) {
          this.feedArrived.account = true;
          log("info", "账户快照已同步");
        }
        this.feedStatus.account = true;
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
        this.openOrders = Array.isArray(orders)
          ? orders.filter((order) => order.symbol === this.config.symbol)
          : [];
        this.synchronizeLocks(orders);
        if (!this.feedArrived.orders) {
          this.feedArrived.orders = true;
          log("info", "订单快照已同步");
        }
        this.feedStatus.orders = true;
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
        if (!this.feedArrived.depth) {
          this.feedArrived.depth = true;
          log("info", "盘口深度已同步");
        }
        this.feedStatus.depth = true;
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
        if (!this.feedArrived.ticker) {
          this.feedArrived.ticker = true;
          log("info", "行情推送已同步");
        }
        this.feedStatus.ticker = true;
        this.emitUpdate();
      },
      log,
      {
        subscribeFail: (error) => `订阅行情失败: ${extractMessage(error)}`,
        processFail: (error) => `行情推送处理异常: ${extractMessage(error)}`,
      }
    );
  }

  private synchronizeLocks(orders: AsterOrder[] | null | undefined): void {
    const list = Array.isArray(orders) ? orders : [];
    Object.keys(this.pendings).forEach((type) => {
      const pendingId = this.pendings[type];
      if (!pendingId) return;
      const match = list.find((order) => String(order.orderId) === pendingId);
      if (!match || (match.status && match.status !== "NEW")) {
        unlockOperating(this.locks, this.timers, this.pendings, type);
      }
    });
  }

  private async tick(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      if (!this.running) {
        await this.tryRestart();
        return;
      }
      if (!this.isReady()) {
        return;
      }
      const price = this.getReferencePrice();
      if (!Number.isFinite(price) || price === null) {
        return;
      }
      if (this.shouldStop(price)) {
        await this.haltGrid(price);
        return;
      }
      await this.syncGrid(price);
    } catch (error) {
      this.log("error", `网格轮询异常: ${extractMessage(error)}`);
    } finally {
      this.processing = false;
      this.emitUpdate();
    }
  }

  private isReady(): boolean {
    return this.feedStatus.account && this.feedStatus.orders && this.feedStatus.ticker;
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot);
  }

  private shouldStop(price: number): boolean {
    if (this.config.stopLossPct <= 0) return false;
    const lowerTrigger = this.config.lowerPrice * (1 - this.config.stopLossPct);
    const upperTrigger = this.config.upperPrice * (1 + this.config.stopLossPct);
    if (price <= lowerTrigger) {
      this.stopReason = `价格跌破网格下边界 ${((1 - price / this.config.lowerPrice) * 100).toFixed(2)}%`;
      return true;
    }
    if (price >= upperTrigger) {
      this.stopReason = `价格突破网格上边界 ${((price / this.config.upperPrice - 1) * 100).toFixed(2)}%`;
      return true;
    }
    return false;
  }

  private async haltGrid(price: number): Promise<void> {
    if (!this.running) return;
    const reason = this.stopReason ?? "触发网格止损";
    this.log("warn", `${reason}，开始执行平仓与撤单`);
    try {
      await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
      this.log("order", "已撤销全部网格挂单");
    } catch (error) {
      this.log("error", `撤销网格挂单失败: ${extractMessage(error)}`);
    }
    await this.closePosition();
    this.desiredOrders = [];
    this.lastUpdated = this.now();
    this.running = false;
    this.levelExposure.clear();
    this.lastOrderBook.clear();
    this.pendingCancelKeys.clear();
  }

  private async closePosition(): Promise<void> {
    const qty = this.position.positionAmt;
    if (!Number.isFinite(qty) || Math.abs(qty) < EPSILON) return;
    const side = qty > 0 ? "SELL" : "BUY";
    const amount = Math.abs(qty);
    try {
      await placeMarketOrder(
        this.exchange,
        this.config.symbol,
        this.openOrders,
        this.locks,
        this.timers,
        this.pendings,
        side,
        amount,
        this.log,
        true,
        undefined,
        { qtyStep: this.config.qtyStep }
      );
      this.log("order", `市价平仓 ${side} ${amount}`);
    } catch (error) {
      this.log("error", `平仓失败: ${extractMessage(error)}`);
    } finally {
      unlockOperating(this.locks, this.timers, this.pendings, "MARKET");
    }
  }

  private async tryRestart(): Promise<void> {
    if (!this.config.autoRestart || !this.configValid) return;
    if (!this.isReady()) return;
    if (this.config.restartTriggerPct <= 0) return;
    const price = this.getReferencePrice();
    if (!Number.isFinite(price) || price === null) return;
    const lowerGuard = this.config.lowerPrice * (1 + this.config.restartTriggerPct);
    const upperGuard = this.config.upperPrice * (1 - this.config.restartTriggerPct);
    if (price < lowerGuard || price > upperGuard) {
      return;
    }
    this.log("info", "价格重新回到网格区间，恢复网格运行");
    this.running = true;
    this.stopReason = null;
    this.start();
  }

  private async syncGrid(price: number): Promise<void> {
    const desired = this.computeDesiredOrders(price);
    this.desiredOrders = desired;

    const desiredKeys = new Set(desired.map((order) => this.getOrderKey(order.side, order.price)));
    const activeOrders = this.openOrders.filter((order) => order.symbol === this.config.symbol && order.type === "LIMIT");
    const orderMap = new Map<string, AsterOrder>();
    const orderBookEntries = new Map<string, { side: "BUY" | "SELL"; level: number; quantity: number }>();
    for (const order of activeOrders) {
      const key = this.getOrderKey(order.side, this.normalizePrice(order.price));
      orderMap.set(key, order);
      const level = this.resolveLevelIndex(Number(order.price));
      if (level != null) {
        const quantity = Math.max(0, Number(order.origQty) - Number(order.executedQty ?? 0));
        orderBookEntries.set(key, { side: order.side, level, quantity });
      }
    }

    this.updateLevelExposure(orderBookEntries);

    for (const order of activeOrders) {
      const key = this.getOrderKey(order.side, this.normalizePrice(order.price));
      if (desiredKeys.has(key)) continue;
      this.pendingCancelKeys.add(key);
      await safeCancelOrder(
        this.exchange,
        this.config.symbol,
        order,
        (orderId) => {
          this.log("order", `撤销网格单 #${orderId}: ${order.side} @ ${order.price}`);
          orderMap.delete(key);
          this.pendingCancelKeys.delete(key);
        },
        () => {
          this.log("order", `撤销时订单已完成: ${order.orderId}`);
          orderMap.delete(key);
          this.pendingCancelKeys.delete(key);
        },
        (error) => {
          this.log("error", `撤销订单失败: ${extractMessage(error)}`);
          this.pendingCancelKeys.delete(key);
        }
      );
    }

    for (const desiredOrder of desired) {
      const key = this.getOrderKey(desiredOrder.side, desiredOrder.price);
      if (orderMap.has(key)) continue;
      try {
        const placed = await placeOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pendings,
          desiredOrder.side,
          desiredOrder.price,
          desiredOrder.amount,
          this.log,
          desiredOrder.reduceOnly,
          undefined,
          { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep, skipDedupe: true }
        );
        if (placed) {
          orderMap.set(key, placed);
        }
      } catch (error) {
        this.log("error", `挂单失败 (${desiredOrder.side} @ ${desiredOrder.price}): ${extractMessage(error)}`);
      }
    }

    this.lastUpdated = this.now();
  }

  private computeDesiredOrders(price: number): DesiredGridOrder[] {
    if (!this.running || !this.gridLevels.length || !this.configValid) return [];
    this.alignExposureWithPosition();
    const desired: DesiredGridOrder[] = [];
    const maxLongExposure = Math.max(this.config.maxPositionSize - Math.max(this.position.positionAmt, 0), 0);
    const maxShortExposure = Math.max(this.config.maxPositionSize - Math.max(-this.position.positionAmt, 0), 0);
    let remainingLongHeadroom = maxLongExposure;
    let remainingShortHeadroom = maxShortExposure;
    let availableToSell = Math.max(this.position.positionAmt, 0);
    let availableToBuy = Math.max(-this.position.positionAmt, 0);

    const halfTick = this.config.priceTick / 2;
    const belowPrice = this.buyLevelIndices
      .map((level) => ({ level, levelPrice: this.gridLevels[level]! }))
      .filter(({ levelPrice }) => levelPrice < price - halfTick)
      .sort((a, b) => b.levelPrice - a.levelPrice);
    const abovePrice = this.sellLevelIndices
      .map((level) => ({ level, levelPrice: this.gridLevels[level]! }))
      .filter(({ levelPrice }) => levelPrice > price + halfTick)
      .sort((a, b) => a.levelPrice - b.levelPrice);

    for (const { level, levelPrice } of belowPrice) {
      const amount = this.config.orderSize;
      const reduceOnly = this.config.direction === "short";
      const held = this.levelExposure.get(level) ?? 0;
      if (held >= amount - EPSILON) {
        continue;
      }
      if (!reduceOnly) {
        if (remainingLongHeadroom < amount - EPSILON) break;
        remainingLongHeadroom -= amount;
      } else {
        if (availableToBuy < amount - EPSILON) continue;
        availableToBuy -= amount;
      }
      desired.push({
        level,
        side: "BUY",
        price: this.formatPrice(levelPrice),
        amount,
        reduceOnly,
      });
    }

    for (const { level, levelPrice } of abovePrice) {
      const amount = this.config.orderSize;
      const reduceOnly = this.config.direction === "long";
      const heldLong = this.levelExposure.get(level) ?? 0;
      if (!reduceOnly && heldLong > EPSILON) {
        continue;
      }
      if (!reduceOnly) {
        if (remainingShortHeadroom < amount - EPSILON) break;
        remainingShortHeadroom -= amount;
      } else {
        if (availableToSell < amount - EPSILON) continue;
        availableToSell -= amount;
      }
      desired.push({
        level,
        side: "SELL",
        price: this.formatPrice(levelPrice),
        amount,
        reduceOnly,
      });
    }

    return desired;
  }

  private computeGridLevels(): number[] {
    if (!this.configValid) return [];
    const { lowerPrice, upperPrice, gridLevels } = this.config;
    if (gridLevels <= 1) return [Number(lowerPrice.toFixed(this.priceDecimals)), Number(upperPrice.toFixed(this.priceDecimals))];
    if (this.config.gridMode === "geometric") {
      const ratio = Math.pow(upperPrice / lowerPrice, 1 / (gridLevels - 1));
      const levels: number[] = [];
      for (let i = 0; i < gridLevels; i += 1) {
        const price = lowerPrice * Math.pow(ratio, i);
        levels.push(Number(price.toFixed(this.priceDecimals)));
      }
      return levels;
    }
    return [];
  }

  private buildSnapshot(): GridEngineSnapshot {
    const reference = this.getReferencePrice();
    const tickerLast = Number(this.tickerSnapshot?.lastPrice);
    const lastPrice = Number.isFinite(tickerLast) ? tickerLast : reference;
    const midPrice = reference;
    const desiredKeys = new Set(this.desiredOrders.map((order) => this.getOrderKey(order.side, order.price)));
    const openOrderKeys = new Set(
      this.openOrders
        .filter((order) => order.symbol === this.config.symbol && order.type === "LIMIT")
        .map((order) => this.getOrderKey(order.side, this.normalizePrice(order.price)))
    );

    const gridLines: GridLineSnapshot[] = this.gridLevels.map((price, level) => {
      const desired = this.desiredOrders.find((order) => order.level === level);
      const defaultSide = this.buyLevelIndices.includes(level) ? "BUY" : "SELL";
      const side = desired?.side ?? defaultSide;
      const key = desired ? this.getOrderKey(desired.side, desired.price) : null;
      const hasOrder = key ? openOrderKeys.has(key) : false;
      const active = Boolean(desired && key && desiredKeys.has(key));
      return {
        level,
        price,
        side,
        active,
        hasOrder,
        reduceOnly: desired?.reduceOnly ?? false,
      };
    });

    return {
      ready: this.isReady() && this.running,
      symbol: this.config.symbol,
      lowerPrice: this.config.lowerPrice,
      upperPrice: this.config.upperPrice,
      lastPrice,
      midPrice,
      gridLines,
      desiredOrders: this.desiredOrders.slice(),
      openOrders: this.openOrders.filter((order) => order.symbol === this.config.symbol),
      position: this.position,
      running: this.running,
      stopReason: this.running ? null : this.stopReason,
      direction: this.config.direction,
      tradeLog: this.tradeLog.all().slice(),
      feedStatus: { ...this.feedStatus },
      lastUpdated: this.lastUpdated,
    };
  }

  private emitUpdate(): void {
    this.events.emit("update", this.buildSnapshot());
  }

  private getOrderKey(side: "BUY" | "SELL", price: string): string {
    return `${side}:${price}`;
  }

  private normalizePrice(price: string | number): string {
    const numeric = Number(price);
    if (!Number.isFinite(numeric)) return "0";
    return numeric.toFixed(this.priceDecimals);
  }

  private formatPrice(price: number): string {
    if (!Number.isFinite(price)) return "0";
    return Number(price).toFixed(this.priceDecimals);
  }

  private resolveLevelIndex(price: number): number | null {
    for (let i = 0; i < this.gridLevels.length; i += 1) {
      if (Math.abs(this.gridLevels[i]! - price) <= this.config.priceTick * 0.5 + EPSILON) {
        return i;
      }
    }
    return null;
  }

  private updateLevelExposure(currentOrders: Map<string, { side: "BUY" | "SELL"; level: number; quantity: number }>): void {
    const previousEntries = new Map(this.lastOrderBook);
    for (const [key, previous] of previousEntries) {
      const current = currentOrders.get(key);
      if (current) {
        const delta = previous.quantity - current.quantity;
        if (Math.abs(delta) > EPSILON) {
          if (previous.side === "BUY") {
            const held = this.levelExposure.get(previous.level) ?? 0;
            this.levelExposure.set(previous.level, held + Math.max(0, delta));
          } else {
            const held = this.levelExposure.get(previous.level) ?? 0;
            const next = held - Math.max(0, delta);
            if (next <= EPSILON) this.levelExposure.delete(previous.level);
            else this.levelExposure.set(previous.level, next);
          }
        }
        continue;
      }
      if (this.pendingCancelKeys.has(key)) {
        this.pendingCancelKeys.delete(key);
        continue;
      }
      if (previous.quantity <= 0) {
        continue;
      }
      if (previous.side === "BUY") {
        const held = this.levelExposure.get(previous.level) ?? 0;
        this.levelExposure.set(previous.level, held + previous.quantity);
      } else {
        const held = this.levelExposure.get(previous.level) ?? 0;
        const next = held - previous.quantity;
        if (next <= EPSILON) this.levelExposure.delete(previous.level);
        else this.levelExposure.set(previous.level, next);
      }
    }
    this.lastOrderBook.clear();
    for (const [key, entry] of currentOrders) {
      this.lastOrderBook.set(key, entry);
    }
  }

  private alignExposureWithPosition(): void {
    const totalHeld = Array.from(this.levelExposure.values()).reduce((acc, qty) => acc + qty, 0);
    const actualLong = Math.max(this.position.positionAmt, 0);
    if (Math.abs(totalHeld - actualLong) <= EPSILON) return;
    if (actualLong <= EPSILON) {
      this.levelExposure.clear();
      return;
    }
    let remaining = actualLong;
    const levels = Array.from(this.levelExposure.keys()).sort((a, b) => a - b);
    for (const level of levels) {
      if (remaining <= EPSILON) {
        this.levelExposure.delete(level);
        continue;
      }
      const current = this.levelExposure.get(level) ?? 0;
      if (current <= remaining + EPSILON) {
        this.levelExposure.set(level, current);
        remaining -= current;
      } else {
        this.levelExposure.set(level, remaining);
        remaining = 0;
      }
    }
    for (const [level, qty] of this.levelExposure) {
      if (qty <= EPSILON) {
        this.levelExposure.delete(level);
      }
    }
  }
}
