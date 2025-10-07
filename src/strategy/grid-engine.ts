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
import { StrategyEventEmitter } from "./common/event-emitter";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";

interface DesiredGridOrder {
  level: number;
  side: "BUY" | "SELL";
  price: string;
  amount: number;
  reduceOnly: boolean;
}

interface LevelMeta {
  index: number;
  price: number;
  side: "BUY" | "SELL";
  closeTarget: number | null;
  closeSources: number[];
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
  private readonly levelMeta: LevelMeta[] = [];
  private readonly buyLevelIndices: number[] = [];
  private readonly sellLevelIndices: number[] = [];
  private lastOpenOrderKeys = new Set<string>();
  private readonly pendingLongLevels = new Set<number>();
  private readonly pendingShortLevels = new Set<number>();
  private readonly closeKeyBySourceLevel = new Map<number, string>();
  private lastKeyMeta = new Map<string, { side: "BUY" | "SELL"; level: number; reduceOnly: boolean }>();
  private sidesLocked = false;
  private startupCleaned = false;
  private initialCloseHandled = false;
  private lastAbsPositionAmt = 0;

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
    this.buildLevelMeta();
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
        this.lastAbsPositionAmt = Math.abs(this.position.positionAmt);
        if (!this.feedArrived.account) {
          this.feedArrived.account = true;
          log("info", "账户快照已同步");
        }
        this.feedStatus.account = true;
        this.tryLockSidesOnce();
        this.tryHandleInitialClose();
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
          // cancel all existing orders at startup per simplified rules
          void this.cancelAllExistingOrdersOnStartup();
        }
        this.feedStatus.orders = true;
        this.tryLockSidesOnce();
        this.tryHandleInitialClose();
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
        this.tryLockSidesOnce();
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
        this.tryLockSidesOnce();
        this.tryHandleInitialClose();
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
      this.tryLockSidesOnce();
      this.tryHandleInitialClose();
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
      await this.syncGridSimple(price);
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


  private tryLockSidesOnce(): void {
    if (this.sidesLocked) return;
    if (!this.feedStatus.ticker && !this.feedStatus.depth) return;
    const anchor = this.chooseAnchoringPrice();
    if (!Number.isFinite(anchor) || anchor == null) return;
    const price = this.clampReferencePrice(Number(anchor));
    this.buildLevelMeta(price);
    this.sidesLocked = true;
    this.log("info", "已根据锚定价一次性划分买卖档位");
  }

  private clampReferencePrice(price: number): number {
    if (!this.gridLevels.length) return price;
    const minLevel = this.gridLevels[0]!;
    const maxLevel = this.gridLevels[this.gridLevels.length - 1]!;
    return Math.min(Math.max(price, minLevel), maxLevel);
  }


  private hasActiveOrders(): boolean {
    return this.openOrders.some((order) => {
      if (order.symbol !== this.config.symbol) return false;
      if (order.type && order.type !== "LIMIT") return false;
      const status = typeof order.status === "string" ? order.status.toUpperCase() : null;
      if (!status) return true;
      return !["FILLED", "CANCELED", "CANCELLED", "REJECTED", "EXPIRED"].includes(status);
    });
  }

  private deferPositionAlignment(): void {}

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
    this.pendingLongLevels.clear();
    this.pendingShortLevels.clear();
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

  private async syncGridSimple(price: number): Promise<void> {
    const activeOrders = this.openOrders.filter((o) => o.symbol === this.config.symbol && o.type === "LIMIT");

    // Detect fills by comparing previous keys vs current snapshot
    const prevKeys = this.lastOpenOrderKeys;
    const prevMeta = this.lastKeyMeta;

    const currentKeys = new Set<string>();
    const keyToMeta = new Map<string, { side: "BUY" | "SELL"; level: number; reduceOnly: boolean }>();
    for (const o of activeOrders) {
      const key = this.getOrderKey(o.side, this.normalizePrice(o.price), o.reduceOnly === true);
      currentKeys.add(key);
      const level = this.resolveLevelIndex(Number(o.price));
      if (level != null) {
        keyToMeta.set(key, { side: o.side, level, reduceOnly: o.reduceOnly === true });
      }
    }

    for (const prevKey of prevKeys) {
      if (currentKeys.has(prevKey)) continue;
      const meta = prevMeta.get(prevKey);
      // First, check if this missing key corresponds to a tracked close order
      let handledByCloseTracking = false;
      for (const [source, closeKey] of this.closeKeyBySourceLevel.entries()) {
        if (closeKey === prevKey) {
          handledByCloseTracking = true;
          const absNow = Math.abs(this.position.positionAmt);
          if (absNow + EPSILON < this.lastAbsPositionAmt) {
            // filled: clear pending mapping
            this.pendingLongLevels.delete(source);
            this.pendingShortLevels.delete(source);
            this.closeKeyBySourceLevel.delete(source);
          } else {
            // canceled: keep pending mapping so desired will re-place close order
          }
          break;
        }
      }
      if (handledByCloseTracking) continue;
      // Otherwise, treat disappearance as potential open fill: confirm by position delta increase
      if (meta) {
        const absNow = Math.abs(this.position.positionAmt);
        if (absNow > this.lastAbsPositionAmt + EPSILON) {
          if (meta.side === "BUY") this.pendingLongLevels.add(meta.level);
          else this.pendingShortLevels.add(meta.level);
        } else {
          // Likely canceled or expired; do not mark pending
        }
      }
    }
    this.lastOpenOrderKeys = currentKeys;
    // persist metadata for next tick to detect fills
    this.lastKeyMeta = keyToMeta;

    // Desired open orders according to locked sides
    const desired: DesiredGridOrder[] = [];
    const halfTick = this.config.priceTick / 2;
    const activeKeySet = new Set(
      activeOrders.map((o) => this.getOrderKey(o.side, this.normalizePrice(o.price), o.reduceOnly === true))
    );
    const activeKeyCounts = new Map<string, number>();
    for (const o of activeOrders) {
      const k = this.getOrderKey(o.side, this.normalizePrice(o.price), false);
      activeKeyCounts.set(k, (activeKeyCounts.get(k) ?? 0) + 1);
    }

    // opens below price (BUY)
    for (const level of this.buyLevelIndices) {
      const levelPrice = this.gridLevels[level]!;
      if (levelPrice >= price - halfTick) continue;
      if (this.pendingLongLevels.has(level)) continue; // wait until close filled
      const key = this.getOrderKey("BUY", this.formatPrice(levelPrice), false);
      const targetMax = this.isCloseDesiredForSideAtLevel("BUY", level) ? 2 : 1;
      if ((activeKeyCounts.get(key) ?? 0) >= targetMax) continue;
      desired.push({ level, side: "BUY", price: this.formatPrice(levelPrice), amount: this.config.orderSize, reduceOnly: false });
    }

    // opens above price (SELL)
    for (const level of this.sellLevelIndices) {
      const levelPrice = this.gridLevels[level]!;
      if (levelPrice <= price + halfTick) continue;
      if (this.pendingShortLevels.has(level)) continue;
      const key = this.getOrderKey("SELL", this.formatPrice(levelPrice), false);
      const targetMax = this.isCloseDesiredForSideAtLevel("SELL", level) ? 2 : 1;
      if ((activeKeyCounts.get(key) ?? 0) >= targetMax) continue;
      desired.push({ level, side: "SELL", price: this.formatPrice(levelPrice), amount: this.config.orderSize, reduceOnly: false });
    }

    // close orders for pending levels (now non-reduce-only)
    for (const source of this.pendingLongLevels) {
      const target = this.levelMeta[source]?.closeTarget;
      if (target == null) continue;
      const priceStr = this.formatPrice(this.gridLevels[target]!);
      const closeKey = this.getOrderKey("SELL", priceStr, false);
      if ((activeKeyCounts.get(closeKey) ?? 0) < 2) {
        desired.push({ level: target, side: "SELL", price: priceStr, amount: this.config.orderSize, reduceOnly: false });
      } else {
        // Map existing identical open as the close so disappearance clears pending
        if (!this.closeKeyBySourceLevel.has(source)) {
          this.closeKeyBySourceLevel.set(source, closeKey);
        }
      }
    }
    for (const source of this.pendingShortLevels) {
      const target = this.levelMeta[source]?.closeTarget;
      if (target == null) continue;
      const priceStr = this.formatPrice(this.gridLevels[target]!);
      const closeKey = this.getOrderKey("BUY", priceStr, false);
      if ((activeKeyCounts.get(closeKey) ?? 0) < 2) {
        desired.push({ level: target, side: "BUY", price: priceStr, amount: this.config.orderSize, reduceOnly: false });
      } else {
        if (!this.closeKeyBySourceLevel.has(source)) {
          this.closeKeyBySourceLevel.set(source, closeKey);
        }
      }
    }

    // Place desired orders
    this.desiredOrders = desired;
    for (const d of desired) {
      const key = this.getOrderKey(d.side, d.price, d.reduceOnly);
      const isClose = (d.side === "SELL" && this.isTargetOfPendingLong(d.level)) || (d.side === "BUY" && this.isTargetOfPendingShort(d.level));
      const maxAllowed = isClose ? 2 : 1;
      if ((activeKeyCounts.get(key) ?? 0) >= maxAllowed) continue;
      try {
        const placed = await placeOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pendings,
          d.side,
          d.price,
          d.amount,
          this.log,
          false,
          undefined,
          { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep, skipDedupe: true }
        );
        if (placed) {
          activeKeyCounts.set(key, (activeKeyCounts.get(key) ?? 0) + 1);
        }
        if (placed && isClose) {
          this.closeKeyBySourceLevel.set(
            this.findSourceForCloseTarget(d.level, d.side),
            key
          );
        }
      } catch (error) {
        this.log("error", `挂单失败 (${d.side} @ ${d.price}): ${extractMessage(error)}`);
      }
    }

    this.lastUpdated = this.now();
    // Update last observed absolute position amount for next disappearance classification
    this.lastAbsPositionAmt = Math.abs(this.position.positionAmt);
  }

  private findSourceForCloseTarget(targetLevel: number, side: "BUY" | "SELL"): number {
    // side here is reduce-only side at target level; source is opposite side level which maps to this target
    if (side === "SELL") {
      // closing long: find a BUY source that maps to targetLevel
      for (const meta of this.levelMeta) {
        if (meta.side === "BUY" && meta.closeTarget === targetLevel && this.pendingLongLevels.has(meta.index)) {
          return meta.index;
        }
      }
    } else {
      for (const meta of this.levelMeta) {
        if (meta.side === "SELL" && meta.closeTarget === targetLevel && this.pendingShortLevels.has(meta.index)) {
          return meta.index;
        }
      }
    }
    return targetLevel; // fallback
  }

  private isTargetOfPendingLong(targetLevel: number): boolean {
    for (const source of this.pendingLongLevels) {
      if (this.levelMeta[source]?.closeTarget === targetLevel) return true;
    }
    return false;
  }

  private isTargetOfPendingShort(targetLevel: number): boolean {
    for (const source of this.pendingShortLevels) {
      if (this.levelMeta[source]?.closeTarget === targetLevel) return true;
    }
    return false;
  }

  private isCloseDesiredForSideAtLevel(side: "BUY" | "SELL", level: number): boolean {
    if (side === "SELL") {
      return this.isTargetOfPendingLong(level);
    }
    return this.isTargetOfPendingShort(level);
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
    const desiredKeys = new Set(
      this.desiredOrders.map((order) => this.getOrderKey(order.side, order.price, order.reduceOnly))
    );
    const openOrderKeys = new Set(
      this.openOrders
        .filter((order) => order.symbol === this.config.symbol && order.type === "LIMIT")
        .map((order) => this.getOrderKey(order.side, this.normalizePrice(order.price), order.reduceOnly === true))
    );

    const gridLines: GridLineSnapshot[] = this.gridLevels.map((price, level) => {
      const desired = this.desiredOrders.find((order) => order.level === level);
      const defaultSide = this.buyLevelIndices.includes(level) ? "BUY" : "SELL";
      const side = desired?.side ?? defaultSide;
      const key = desired ? this.getOrderKey(desired.side, desired.price, desired.reduceOnly) : null;
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

  private getOrderKey(side: "BUY" | "SELL", price: string, reduceOnly = false): string {
    return `${side}:${price}:${reduceOnly ? "RO" : "OPEN"}`;
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

  private buildLevelMeta(referencePrice?: number | null): void {
    this.levelMeta.length = 0;
    this.buyLevelIndices.length = 0;
    this.sellLevelIndices.length = 0;
    if (!this.gridLevels.length) return;
    const pivotIndex = Math.floor(Math.max(this.gridLevels.length - 1, 0) / 2);
    const anchorByLevel = new Map<number, { side: "BUY" | "SELL" }>();
    const hasReference = Number.isFinite(referencePrice ?? NaN);
    const pivotPrice = hasReference ? this.clampReferencePrice(Number(referencePrice)) : null;
    for (let i = 0; i < this.gridLevels.length; i += 1) {
      let side: "BUY" | "SELL";
      const anchor = anchorByLevel.get(i);
      if (anchor) {
        side = anchor.side;
      } else if (pivotPrice != null) {
        side = this.gridLevels[i]! <= pivotPrice + EPSILON ? "BUY" : "SELL";
      } else {
        side = i <= pivotIndex ? "BUY" : "SELL";
      }
      const meta: LevelMeta = {
        index: i,
        price: this.gridLevels[i]!,
        side,
        closeTarget: null,
        closeSources: [],
      };
      this.levelMeta.push(meta);
      if (side === "BUY") this.buyLevelIndices.push(i);
      else this.sellLevelIndices.push(i);
    }
    // 简化映射：
    // - BUY 关单目标为其上方最近的 SELL 档
    // - SELL 关单目标为其下方最近的 BUY 档
    for (const meta of this.levelMeta) {
      if (meta.side === "BUY") {
        for (let j = meta.index + 1; j < this.levelMeta.length; j += 1) {
          if (this.levelMeta[j]!.side === "SELL") {
            meta.closeTarget = this.levelMeta[j]!.index;
            this.levelMeta[j]!.closeSources.push(meta.index);
            break;
          }
        }
      } else {
        for (let j = meta.index - 1; j >= 0; j -= 1) {
          if (this.levelMeta[j]!.side === "BUY") {
            meta.closeTarget = this.levelMeta[j]!.index;
            this.levelMeta[j]!.closeSources.push(meta.index);
            break;
          }
        }
      }
    }
  }

  private chooseAnchoringPrice(): number | null {
    const reference = this.getReferencePrice();
    if (!Number.isFinite(reference) || reference == null) return null;
    const ref = Number(reference);
    const qty = this.position.positionAmt;
    const entry = this.position.entryPrice;
    const hasEntry = Number.isFinite(entry) && Math.abs(entry) > EPSILON;
    if (!hasEntry || Math.abs(qty) <= EPSILON) return ref;
    // If long and market below cost, anchor at entry to avoid shorting below cost
    if (qty > 0 && ref < Number(entry) - EPSILON) return Number(entry);
    // If short and market above cost, anchor at entry to avoid longing above cost
    if (qty < 0 && ref > Number(entry) + EPSILON) return Number(entry);
    return ref;
  }


  private async cancelAllExistingOrdersOnStartup(): Promise<void> {
    if (this.startupCleaned) return;
    this.startupCleaned = true;
    try {
      await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
      this.log("order", "启动阶段：已撤销全部历史挂单");
    } catch (error) {
      this.log("error", `启动撤单失败: ${extractMessage(error)}`);
    }
  }

  private tryHandleInitialClose(): void {
    if (this.initialCloseHandled) return;
    if (!(this.feedStatus.account && this.feedStatus.orders && (this.feedStatus.ticker || this.feedStatus.depth))) return;
    this.initialCloseHandled = true;
    const qty = this.position.positionAmt;
    if (!Number.isFinite(qty) || Math.abs(qty) <= EPSILON) return;
    const entry = this.position.entryPrice;
    const priceRef = this.getReferencePrice();
    if (!Number.isFinite(entry) || !Number.isFinite(priceRef)) return;
    const nearest = this.findNearestProfitableCloseLevel(qty > 0 ? "long" : "short", Number(entry));
    if (nearest == null) return;
    const side = qty > 0 ? "SELL" : "BUY";
    const priceStr = this.formatPrice(this.gridLevels[nearest]!);
    void (async () => {
      try {
        const placed = await placeOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pendings,
          side,
          priceStr,
          Math.abs(qty),
          this.log,
          false,
          undefined,
          { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep, skipDedupe: true }
        );
        if (placed) {
          // mark pending exposure broadly so we don't re-open immediately on that source level (choose closest source side)
          const source = this.findSourceForInitialPosition(side);
          if (side === "SELL") this.pendingLongLevels.add(source);
          else this.pendingShortLevels.add(source);
          this.closeKeyBySourceLevel.set(source, this.getOrderKey(side, priceStr, false));
          this.log("order", `为已有仓位挂出一次性平仓单 ${side} @ ${priceStr}`);
        }
      } catch (error) {
        this.log("error", `启动阶段挂减仓单失败: ${extractMessage(error)}`);
      }
    })();
  }

  private findNearestProfitableCloseLevel(direction: "long" | "short", entryPrice: number): number | null {
    if (!this.levelMeta.length) return null;
    if (direction === "long") {
      for (const idx of this.sellLevelIndices) {
        if (this.gridLevels[idx]! > entryPrice + this.config.priceTick / 2) return idx;
      }
      return this.sellLevelIndices.length ? this.sellLevelIndices[0]! : null;
    }
    for (const idx of this.buyLevelIndices.slice().reverse()) {
      if (this.gridLevels[idx]! < entryPrice - this.config.priceTick / 2) return idx;
    }
    return this.buyLevelIndices.length ? this.buyLevelIndices[this.buyLevelIndices.length - 1]! : null;
  }

  private findSourceForInitialPosition(closeSide: "BUY" | "SELL"): number {
    // choose the closest open side level to current price as source marker
    const price = this.getReferencePrice();
    if (!Number.isFinite(price)) return 0;
    const p = Number(price);
    if (closeSide === "SELL") {
      // long position: mark nearest BUY level below price
      let best = 0;
      let bestDiff = Number.POSITIVE_INFINITY;
      for (const idx of this.buyLevelIndices) {
        const lv = this.gridLevels[idx]!;
        const diff = p - lv;
        if (diff >= 0 && diff < bestDiff) {
          bestDiff = diff;
          best = idx;
        }
      }
      return best;
    }
    let best = 0;
    let bestDiff = Number.POSITIVE_INFINITY;
    for (const idx of this.sellLevelIndices) {
      const lv = this.gridLevels[idx]!;
      const diff = lv - p;
      if (diff >= 0 && diff < bestDiff) {
        bestDiff = diff;
        best = idx;
      }
    }
    return best;
  }
}
