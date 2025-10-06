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
    const orderMap = new Map<string, AsterOrder>(
      activeOrders.map((order) => [this.getOrderKey(order.side, this.normalizePrice(order.price)), order])
    );

    for (const order of activeOrders) {
      const key = this.getOrderKey(order.side, this.normalizePrice(order.price));
      if (desiredKeys.has(key)) continue;
      await safeCancelOrder(
        this.exchange,
        this.config.symbol,
        order,
        (orderId) => {
          this.log("order", `撤销网格单 #${orderId}: ${order.side} @ ${order.price}`);
          orderMap.delete(key);
        },
        () => {
          this.log("order", `撤销时订单已完成: ${order.orderId}`);
          orderMap.delete(key);
        },
        (error) => {
          this.log("error", `撤销订单失败: ${extractMessage(error)}`);
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
    const desired: DesiredGridOrder[] = [];
    const maxLongExposure = Math.max(this.config.maxPositionSize - Math.max(this.position.positionAmt, 0), 0);
    const maxShortExposure = Math.max(this.config.maxPositionSize - Math.max(-this.position.positionAmt, 0), 0);
    let remainingLongHeadroom = maxLongExposure;
    let remainingShortHeadroom = maxShortExposure;
    let availableToSell = Math.max(this.position.positionAmt, 0);
    let availableToBuy = Math.max(-this.position.positionAmt, 0);

    const halfTick = this.config.priceTick / 2;
    const belowPrice = this.gridLevels
      .map((levelPrice, level) => ({ level, levelPrice }))
      .filter(({ levelPrice }) => levelPrice < price - halfTick)
      .sort((a, b) => b.levelPrice - a.levelPrice);
    const abovePrice = this.gridLevels
      .map((levelPrice, level) => ({ level, levelPrice }))
      .filter(({ levelPrice }) => levelPrice > price + halfTick)
      .sort((a, b) => a.levelPrice - b.levelPrice);

    for (const { level, levelPrice } of belowPrice) {
      const amount = this.config.orderSize;
      const reduceOnly = this.config.direction === "short";
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
      const side = desired?.side ?? (price < (lastPrice ?? price) ? "BUY" : "SELL");
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
}
