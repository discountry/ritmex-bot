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
import { clearGridState, loadGridState, saveGridState, type StoredGridState } from "./common/grid-storage";

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
  private readonly longExposure = new Map<number, number>();
  private readonly shortExposure = new Map<number, number>();
  private readonly lastOrderBook = new Map<
    string,
    { side: "BUY" | "SELL"; level: number; quantity: number; reduceOnly: boolean }
  >();
  private readonly pendingCancelKeys = new Set<string>();
  private statePersistTimer: ReturnType<typeof setTimeout> | null = null;
  private protectExistingOrdersUntil = 0;

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
  private freshStartActive = false;
  private pendingInitialSideAssignment = false;
  private positionAlignHoldUntil = 0;

  constructor(private readonly config: GridConfig, private readonly exchange: ExchangeAdapter, options: EngineOptions = {}) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.log = (type, detail) => this.tradeLog.push(type, detail);
    this.priceDecimals = decimalsOf(this.config.priceTick);
    this.now = options.now ?? Date.now;
    this.configValid = this.validateConfig();
    this.gridLevels = this.computeGridLevels();
    this.buildLevelMeta();
    void this.restoreState();
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
        this.evaluateFreshStart();
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
          const bufferMs = Math.max(this.config.refreshIntervalMs * 2, 2000);
          this.protectExistingOrdersUntil = Math.max(this.protectExistingOrdersUntil, this.now() + bufferMs);
        }
        if (!this.feedArrived.orders) {
          this.feedArrived.orders = true;
          log("info", "订单快照已同步");
        }
        this.feedStatus.orders = true;
        this.evaluateFreshStart();
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
        this.tryAssignInitialSidesFromPrice();
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
        this.tryAssignInitialSidesFromPrice();
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
      this.tryAssignInitialSidesFromPrice();
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
      await this.enforceExposureSafety(price);
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

  private evaluateFreshStart(): void {
    if (!this.feedStatus.account || !this.feedStatus.orders) return;
    const hasPosition = Math.abs(this.position.positionAmt) > EPSILON;
    const hasOrders = this.hasActiveOrders();
    if (!hasPosition && !hasOrders) {
      if (!this.freshStartActive) {
        this.freshStartActive = true;
        this.handleFreshStart();
      }
      return;
    }
    this.freshStartActive = false;
    this.pendingInitialSideAssignment = false;
  }

  private handleFreshStart(): void {
    this.log("info", "检测到无持仓且无挂单，重置本地网格状态");
    this.longExposure.clear();
    this.shortExposure.clear();
    this.lastOrderBook.clear();
    this.pendingCancelKeys.clear();
    this.desiredOrders = [];
    this.positionAlignHoldUntil = 0;
    if (this.statePersistTimer) {
      clearTimeout(this.statePersistTimer);
      this.statePersistTimer = null;
    }
    void this.clearPersistedGridState();
    const assigned = this.assignInitialSidesFromPrice();
    this.pendingInitialSideAssignment = !assigned;
    if (!assigned) {
      this.log("info", "等待行情价格以完成网格方向初始化");
    }
    this.emitUpdate();
  }

  private assignInitialSidesFromPrice(): boolean {
    const reference = this.getReferencePrice();
    if (!Number.isFinite(reference) || reference == null) {
      return false;
    }
    const price = this.clampReferencePrice(Number(reference));
    this.buildLevelMeta(price);
    return true;
  }

  private tryAssignInitialSidesFromPrice(): void {
    if (!this.pendingInitialSideAssignment) return;
    if (!this.freshStartActive) return;
    if (this.assignInitialSidesFromPrice()) {
      this.pendingInitialSideAssignment = false;
      this.emitUpdate();
    }
  }

  private clampReferencePrice(price: number): number {
    if (!this.gridLevels.length) return price;
    const minLevel = this.gridLevels[0]!;
    const maxLevel = this.gridLevels[this.gridLevels.length - 1]!;
    return Math.min(Math.max(price, minLevel), maxLevel);
  }

  private async clearPersistedGridState(): Promise<void> {
    try {
      await clearGridState(this.config.symbol);
    } catch (error) {
      this.log("error", `清理本地网格状态失败: ${extractMessage(error)}`);
    }
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

  private deferPositionAlignment(): void {
    const buffer = Math.max(this.config.refreshIntervalMs * 2, 1000);
    const deadline = this.now() + buffer;
    this.positionAlignHoldUntil = Math.max(this.positionAlignHoldUntil, deadline);
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
    this.longExposure.clear();
    this.shortExposure.clear();
    this.lastOrderBook.clear();
    this.pendingCancelKeys.clear();
    this.schedulePersist();
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
    const activeOrders = this.openOrders.filter((order) => order.symbol === this.config.symbol && order.type === "LIMIT");

    // Keep level side assignment consistent with currently open orders to avoid churn on restart
    this.buildLevelMeta(price);

    this.backfillExposureFromOpenOrders(activeOrders);

    const desired = this.computeDesiredOrders(price);
    this.desiredOrders = desired;

    const desiredKeys = new Set(desired.map((order) => this.getOrderKey(order.side, order.price, order.reduceOnly)));
    const orderMap = new Map<string, AsterOrder>();
    const orderBookEntries = new Map<
      string,
      { side: "BUY" | "SELL"; level: number; quantity: number; reduceOnly: boolean }
    >();
    for (const order of activeOrders) {
      const key = this.getOrderKey(order.side, this.normalizePrice(order.price), order.reduceOnly === true);
      orderMap.set(key, order);
      const level = this.resolveLevelIndex(Number(order.price));
      if (level != null) {
        const quantity = Math.max(0, Number(order.origQty) - Number(order.executedQty ?? 0));
        orderBookEntries.set(key, {
          side: order.side,
          level,
          quantity,
          reduceOnly: order.reduceOnly === true,
        });
      }
    }

    this.updateLevelExposure(orderBookEntries);

    // During protection window, treat existing orders as desired to ensure no cancellations
    if (this.now() < this.protectExistingOrdersUntil) {
      for (const key of orderBookEntries.keys()) {
        desiredKeys.add(key);
      }
    }

    for (const order of activeOrders) {
      const key = this.getOrderKey(order.side, this.normalizePrice(order.price), order.reduceOnly === true);
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
      const key = this.getOrderKey(desiredOrder.side, desiredOrder.price, desiredOrder.reduceOnly);
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
    const totalLongExposure = this.sumExposure(this.longExposure);
    const totalShortExposure = this.sumExposure(this.shortExposure);
    let remainingLongHeadroom = Math.max(this.config.maxPositionSize - totalLongExposure, 0);
    let remainingShortHeadroom = Math.max(this.config.maxPositionSize - totalShortExposure, 0);

    const halfTick = this.config.priceTick / 2;
    const belowPrice = this.buyLevelIndices
      .map((level) => ({ level, levelPrice: this.gridLevels[level]! }))
      .filter(({ levelPrice }) => levelPrice < price - halfTick)
      .sort((a, b) => b.levelPrice - a.levelPrice);
    const abovePrice = this.sellLevelIndices
      .map((level) => ({ level, levelPrice: this.gridLevels[level]! }))
      .filter(({ levelPrice }) => levelPrice > price + halfTick)
      .sort((a, b) => a.levelPrice - b.levelPrice);

    const longCloseRequirements = new Map<number, number>();
    for (const [level, exposure] of this.longExposure) {
      if (exposure <= EPSILON) continue;
      const targetIndex = this.levelMeta[level]?.closeTarget;
      if (targetIndex == null) continue;
      longCloseRequirements.set(targetIndex, (longCloseRequirements.get(targetIndex) ?? 0) + exposure);
    }

    const shortCloseRequirements = new Map<number, number>();
    for (const [level, exposure] of this.shortExposure) {
      if (exposure <= EPSILON) continue;
      const targetIndex = this.levelMeta[level]?.closeTarget;
      if (targetIndex == null) continue;
      shortCloseRequirements.set(targetIndex, (shortCloseRequirements.get(targetIndex) ?? 0) + exposure);
    }

    if (this.config.direction !== "short") {
      for (const { level, levelPrice } of belowPrice) {
        // 平仓档位和开仓档位独立：检查是否有减仓订单占用此档位
        const hasCloseOrder = longCloseRequirements.has(level);
        if (hasCloseOrder) continue;
        
        const exposure = this.longExposure.get(level) ?? 0;
        if (exposure >= this.config.orderSize - EPSILON) continue;
        if (remainingLongHeadroom < this.config.orderSize - EPSILON) continue;
        desired.push({
          level,
          side: "BUY",
          price: this.formatPrice(levelPrice),
          amount: this.config.orderSize,
          reduceOnly: false,
        });
        remainingLongHeadroom -= this.config.orderSize;
      }
    }

    if (this.config.direction !== "long") {
      for (const { level, levelPrice } of abovePrice) {
        // 平仓档位和开仓档位独立：检查是否有减仓订单占用此档位
        const hasCloseOrder = shortCloseRequirements.has(level);
        if (hasCloseOrder) continue;
        
        const exposure = this.shortExposure.get(level) ?? 0;
        if (exposure >= this.config.orderSize - EPSILON) continue;
        if (remainingShortHeadroom < this.config.orderSize - EPSILON) continue;
        desired.push({
          level,
          side: "SELL",
          price: this.formatPrice(levelPrice),
          amount: this.config.orderSize,
          reduceOnly: false,
        });
        remainingShortHeadroom -= this.config.orderSize;
      }
    }

    for (const [level, quantity] of longCloseRequirements) {
      const rawPrice = this.gridLevels[level]!;
      const clamped = this.clampClosePrice({ side: "SELL", rawPrice });
      desired.push({
        level,
        side: "SELL",
        price: this.formatPrice(clamped),
        amount: quantity,
        reduceOnly: true,
      });
    }

    for (const [level, quantity] of shortCloseRequirements) {
      const rawPrice = this.gridLevels[level]!;
      const clamped = this.clampClosePrice({ side: "BUY", rawPrice });
      desired.push({
        level,
        side: "BUY",
        price: this.formatPrice(clamped),
        amount: quantity,
        reduceOnly: true,
      });
    }

    return desired;
  }

  private clampClosePrice(params: { side: "BUY" | "SELL"; rawPrice: number }): number {
    const slippage = Math.max(0, this.config.maxCloseSlippagePct);
    if (slippage <= 0) return params.rawPrice;
    const referenceCandidates = [
      Number.isFinite(this.position.markPrice) ? this.position.markPrice : null,
      this.getReferencePrice(),
    ];
    const mark = referenceCandidates.find((value) => Number.isFinite(value) && Number(value) > 0);
    if (!Number.isFinite(mark) || Number(mark) <= 0) {
      return params.rawPrice;
    }
    const markNumber = Number(mark);
    if (params.side === "SELL") {
      const floor = markNumber * (1 - slippage);
      return Math.max(params.rawPrice, floor);
    }
    const ceiling = markNumber * (1 + slippage);
    return Math.min(params.rawPrice, ceiling);
  }

  private async enforceExposureSafety(referencePrice: number): Promise<void> {
    const toCloseLongLevels: Array<{ level: number; quantity: number }> = [];
    for (const [level, quantity] of this.longExposure) {
      if (quantity <= EPSILON) continue;
      const target = this.levelMeta[level]?.closeTarget;
      if (target == null) continue;
      const closePrice = this.gridLevels[target]!;
      if (referencePrice >= closePrice - this.config.priceTick / 2) {
        toCloseLongLevels.push({ level, quantity });
      }
    }

    const toCloseShortLevels: Array<{ level: number; quantity: number }> = [];
    for (const [level, quantity] of this.shortExposure) {
      if (quantity <= EPSILON) continue;
      const target = this.levelMeta[level]?.closeTarget;
      if (target == null) continue;
      const closePrice = this.gridLevels[target]!;
      if (referencePrice <= closePrice + this.config.priceTick / 2) {
        toCloseShortLevels.push({ level, quantity });
      }
    }

    const totalLongClose = toCloseLongLevels.reduce((acc, item) => acc + item.quantity, 0);
    const totalShortClose = toCloseShortLevels.reduce((acc, item) => acc + item.quantity, 0);

    const actualLong = Math.max(this.position.positionAmt, 0);
    const actualShort = Math.max(-this.position.positionAmt, 0);

    if (actualLong <= EPSILON && totalLongClose > EPSILON) {
      this.resyncLongExposure(actualLong);
    }

    if (actualShort <= EPSILON && totalShortClose > EPSILON) {
      this.resyncShortExposure(actualShort);
    }

    const safeLongClose = Math.min(totalLongClose, Math.max(actualLong - EPSILON, 0));
    if (safeLongClose > EPSILON) {
      try {
        await placeMarketOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pendings,
          "SELL",
          safeLongClose,
          this.log,
          true,
          { expectedPrice: referencePrice },
          { qtyStep: this.config.qtyStep }
        );
        for (const { level } of toCloseLongLevels) {
          this.longExposure.delete(level);
        }
        this.deferPositionAlignment();
        this.schedulePersist();
      } catch (error) {
        this.log("error", `市价平仓多单失败: ${extractMessage(error)}`);
      }
    }

    const safeShortClose = Math.min(totalShortClose, Math.max(actualShort - EPSILON, 0));
    if (safeShortClose > EPSILON) {
      try {
        await placeMarketOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pendings,
          "BUY",
          safeShortClose,
          this.log,
          true,
          { expectedPrice: referencePrice },
          { qtyStep: this.config.qtyStep }
        );
        for (const { level } of toCloseShortLevels) {
          this.shortExposure.delete(level);
        }
        this.deferPositionAlignment();
        this.schedulePersist();
      } catch (error) {
        this.log("error", `市价平仓空单失败: ${extractMessage(error)}`);
      }
    }
  }

  private schedulePersist(): void {
    if (this.statePersistTimer) return;
    this.statePersistTimer = setTimeout(() => {
      this.statePersistTimer = null;
      void this.persistState();
    }, 200);
  }

  private async persistState(): Promise<void> {
    if (!this.configValid) return;
    const snapshot: StoredGridState = {
      symbol: this.config.symbol,
      lowerPrice: this.config.lowerPrice,
      upperPrice: this.config.upperPrice,
      gridLevels: this.config.gridLevels,
      orderSize: this.config.orderSize,
      maxPositionSize: this.config.maxPositionSize,
      direction: this.config.direction,
      longExposure: Object.fromEntries([...this.longExposure.entries()].map(([level, qty]) => [String(level), qty])),
      shortExposure: Object.fromEntries([...this.shortExposure.entries()].map(([level, qty]) => [String(level), qty])),
      updatedAt: Date.now(),
    };
    try {
      await saveGridState(snapshot);
    } catch (error) {
      this.log("error", `保存网格状态失败: ${extractMessage(error)}`);
    }
  }

  private async restoreState(): Promise<void> {
    try {
      const snapshot = await loadGridState(this.config.symbol);
      if (!snapshot) return;
      if (!this.isSnapshotCompatible(snapshot)) return;
      this.longExposure.clear();
      this.shortExposure.clear();
      for (const [key, value] of Object.entries(snapshot.longExposure ?? {})) {
        const level = Number(key);
        if (!Number.isInteger(level)) continue;
        if (!this.buyLevelIndices.includes(level)) continue;
        if (value > EPSILON) this.longExposure.set(level, value);
      }
      for (const [key, value] of Object.entries(snapshot.shortExposure ?? {})) {
        const level = Number(key);
        if (!Number.isInteger(level)) continue;
        if (!this.sellLevelIndices.includes(level)) continue;
        if (value > EPSILON) this.shortExposure.set(level, value);
      }
      const bufferMs = Math.max(this.config.refreshIntervalMs * 2, 2000);
      this.protectExistingOrdersUntil = Math.max(this.protectExistingOrdersUntil, this.now() + bufferMs);
    } catch (error) {
      this.log("error", `读取网格状态失败: ${extractMessage(error)}`);
    }
  }

  private isSnapshotCompatible(snapshot: StoredGridState): boolean {
    const sameSymbol = snapshot.symbol === this.config.symbol;
    const sameLevels = snapshot.gridLevels === this.config.gridLevels;
    const sameRange =
      Math.abs(snapshot.lowerPrice - this.config.lowerPrice) <= this.config.priceTick &&
      Math.abs(snapshot.upperPrice - this.config.upperPrice) <= this.config.priceTick;
    const sameOrder = Math.abs(snapshot.orderSize - this.config.orderSize) <= this.config.qtyStep;
    return sameSymbol && sameLevels && sameRange && sameOrder;
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
    if (Array.isArray(this.openOrders) && this.openOrders.length) {
      for (const order of this.openOrders) {
        if (order.symbol !== this.config.symbol || order.type !== "LIMIT") continue;
        const level = this.resolveLevelIndex(Number(order.price));
        if (level == null) continue;
        if (!anchorByLevel.has(level)) {
          anchorByLevel.set(level, { side: order.side });
        }
      }
    }
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
    // 为每个买入档位分配独立的卖出档位，实现一对一映射
    const sellLevels = this.levelMeta.filter(meta => meta.side === "SELL").sort((a, b) => a.index - b.index);
    let sellLevelIndex = 0;
    
    for (const meta of this.levelMeta) {
      if (meta.side === "BUY") {
        // 为每个买入档位分配下一个可用的卖出档位
        if (sellLevelIndex < sellLevels.length) {
          const targetSellLevel = sellLevels[sellLevelIndex]!;
          meta.closeTarget = targetSellLevel.index;
          targetSellLevel.closeSources.push(meta.index);
          sellLevelIndex++;
        } else {
          // 如果没有足够的卖出档位，使用最后一个卖出档位
          const lastSellLevel = sellLevels[sellLevels.length - 1];
          if (lastSellLevel) {
            meta.closeTarget = lastSellLevel.index;
            lastSellLevel.closeSources.push(meta.index);
          } else {
            meta.closeTarget = null;
          }
        }
      } else {
        // 卖出档位：找到对应的买入档位（用于空单平仓）
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

  private updateLevelExposure(
    currentOrders: Map<string, { side: "BUY" | "SELL"; level: number; quantity: number; reduceOnly: boolean }>
  ): void {
    for (const [key, previous] of this.lastOrderBook) {
      const current = currentOrders.get(key);
      if (current) {
        const delta = previous.quantity - current.quantity;
        if (Math.abs(delta) > EPSILON) {
          this.applyFillDelta(previous, delta);
        }
        continue;
      }
      if (this.pendingCancelKeys.has(key)) {
        this.pendingCancelKeys.delete(key);
        continue;
      }
      this.applyFillDelta(previous, previous.quantity);
    }
    this.lastOrderBook.clear();
    for (const [key, entry] of currentOrders) {
      this.lastOrderBook.set(key, entry);
    }
  }

  private backfillExposureFromOpenOrders(activeOrders: AsterOrder[]): void {
    if (!activeOrders.length) return;
    const reduceSellByLevel = new Map<number, number>();
    const reduceBuyByLevel = new Map<number, number>();

    for (const order of activeOrders) {
      if (order.reduceOnly !== true) continue;
      const level = this.resolveLevelIndex(Number(order.price));
      if (level == null) continue;
      const remaining = Math.max(
        0,
        Number(order.origQty ?? 0) - Number(order.executedQty ?? 0)
      );
      if (remaining <= EPSILON) continue;
      if (order.side === "SELL") {
        reduceSellByLevel.set(level, (reduceSellByLevel.get(level) ?? 0) + remaining);
      } else if (order.side === "BUY") {
        reduceBuyByLevel.set(level, (reduceBuyByLevel.get(level) ?? 0) + remaining);
      }
    }

    const longChanged = this.rebuildLongExposureFromReduceOrders(reduceSellByLevel);
    const shortChanged = this.rebuildShortExposureFromReduceOrders(reduceBuyByLevel);

    if (longChanged || shortChanged) {
      this.schedulePersist();
    }
  }

  private rebuildLongExposureFromReduceOrders(reduceOrders: Map<number, number>): boolean {
    const actualLong = Math.max(this.position.positionAmt, 0);
    if (actualLong <= EPSILON && !reduceOrders.size) {
      if (this.longExposure.size) {
        this.longExposure.clear();
        return true;
      }
      return false;
    }

    const computed = new Map<number, number>();
    let remaining = actualLong;

    if (reduceOrders.size) {
      const ordered = [...reduceOrders.entries()].sort((a, b) => a[0] - b[0]);
      for (const [closeLevel, quantity] of ordered) {
        if (remaining <= EPSILON) break;
        const meta = this.levelMeta[closeLevel];
        if (!meta || meta.side !== "SELL" || !meta.closeSources.length) continue;
        const sources = [...meta.closeSources]
          .filter((source) => this.buyLevelIndices.includes(source))
          .sort((a, b) => b - a);
        if (!sources.length) continue;
        const toAllocate = Math.min(quantity, remaining);
        if (toAllocate <= EPSILON) continue;
        const allocated = this.distributeExposure(computed, sources, toAllocate);
        remaining -= allocated;
      }
    }

    if (remaining > EPSILON) {
      const fallbackSources = [...this.buyLevelIndices].sort((a, b) => b - a);
      const assigned = this.distributeExposure(computed, fallbackSources, remaining);
      remaining -= assigned;
    }

    for (const [level, amount] of computed) {
      if (amount <= EPSILON) {
        computed.delete(level);
      }
    }

    return this.replaceExposureMap(this.longExposure, computed);
  }

  private rebuildShortExposureFromReduceOrders(reduceOrders: Map<number, number>): boolean {
    const actualShort = Math.max(-this.position.positionAmt, 0);
    if (actualShort <= EPSILON && !reduceOrders.size) {
      if (this.shortExposure.size) {
        this.shortExposure.clear();
        return true;
      }
      return false;
    }

    const computed = new Map<number, number>();
    let remaining = actualShort;

    if (reduceOrders.size) {
      const ordered = [...reduceOrders.entries()].sort((a, b) => a[0] - b[0]);
      for (const [closeLevel, quantity] of ordered) {
        if (remaining <= EPSILON) break;
        const meta = this.levelMeta[closeLevel];
        if (!meta || meta.side !== "BUY" || !meta.closeSources.length) continue;
        const sources = [...meta.closeSources]
          .filter((source) => this.sellLevelIndices.includes(source))
          .sort((a, b) => a - b);
        if (!sources.length) continue;
        const toAllocate = Math.min(quantity, remaining);
        if (toAllocate <= EPSILON) continue;
        const allocated = this.distributeExposure(computed, sources, toAllocate);
        remaining -= allocated;
      }
    }

    if (remaining > EPSILON) {
      const fallbackSources = [...this.sellLevelIndices].sort((a, b) => a - b);
      const assigned = this.distributeExposure(computed, fallbackSources, remaining);
      remaining -= assigned;
    }

    for (const [level, amount] of computed) {
      if (amount <= EPSILON) {
        computed.delete(level);
      }
    }

    return this.replaceExposureMap(this.shortExposure, computed);
  }

  private distributeExposure(target: Map<number, number>, sources: number[], amount: number): number {
    if (amount <= EPSILON) return 0;
    let remaining = amount;
    let assigned = 0;
    for (const level of sources) {
      if (remaining <= EPSILON) break;
      const current = target.get(level) ?? 0;
      const capacity = Math.max(this.config.orderSize - current, 0);
      if (capacity <= EPSILON) continue;
      const toAssign = Math.min(capacity, remaining);
      if (toAssign <= EPSILON) continue;
      target.set(level, current + toAssign);
      remaining -= toAssign;
      assigned += toAssign;
    }
    return assigned;
  }

  private replaceExposureMap(target: Map<number, number>, source: Map<number, number>): boolean {
    let changed = false;
    for (const key of [...target.keys()]) {
      if (!source.has(key)) {
        target.delete(key);
        changed = true;
      }
    }
    for (const [key, value] of source) {
      const current = target.get(key) ?? 0;
      if (Math.abs(current - value) > EPSILON) {
        target.set(key, value);
        changed = true;
      }
    }
    return changed;
  }

  private applyFillDelta(
    entry: { side: "BUY" | "SELL"; level: number; quantity: number; reduceOnly: boolean },
    filled: number
  ): void {
    if (filled <= EPSILON) return;
    if (entry.reduceOnly) {
      if (entry.side === "SELL") {
        this.consumeLongExposure(entry.level, filled);
      } else {
        this.consumeShortExposure(entry.level, filled);
      }
      return;
    }
    if (entry.side === "BUY") {
      this.incrementLongExposure(entry.level, filled);
    } else {
      this.incrementShortExposure(entry.level, filled);
    }
  }

  private alignExposureWithPosition(): void {
    const actualLong = Math.max(this.position.positionAmt, 0);
    const trackedLong = this.sumExposure(this.longExposure);
    const actualShort = Math.max(-this.position.positionAmt, 0);
    const trackedShort = this.sumExposure(this.shortExposure);
    const tolerance = Math.max(this.config.qtyStep * 0.25, EPSILON);
    const now = this.now();

    const longDiff = actualLong - trackedLong;
    if (longDiff > tolerance || (longDiff < -tolerance && now >= this.positionAlignHoldUntil)) {
      this.resyncLongExposure(actualLong);
    }

    const shortDiff = actualShort - trackedShort;
    if (shortDiff > tolerance || (shortDiff < -tolerance && now >= this.positionAlignHoldUntil)) {
      this.resyncShortExposure(actualShort);
    }
  }

  private resyncLongExposure(total: number): void {
    this.longExposure.clear();
    let remaining = total;
    for (const level of [...this.buyLevelIndices].sort((a, b) => b - a)) {
      if (remaining <= EPSILON) break;
      const qty = Math.min(this.config.orderSize, remaining);
      if (qty > EPSILON) {
        this.longExposure.set(level, qty);
        remaining -= qty;
      }
    }
    this.schedulePersist();
  }

  private resyncShortExposure(total: number): void {
    this.shortExposure.clear();
    let remaining = total;
    for (const level of [...this.sellLevelIndices].sort((a, b) => a - b)) {
      if (remaining <= EPSILON) break;
      const qty = Math.min(this.config.orderSize, remaining);
      if (qty > EPSILON) {
        this.shortExposure.set(level, qty);
        remaining -= qty;
      }
    }
    this.schedulePersist();
  }

  private incrementLongExposure(level: number, quantity: number): void {
    if (quantity <= EPSILON) return;
    const current = this.longExposure.get(level) ?? 0;
    const next = Math.min(this.config.orderSize, current + quantity);
    if (next <= EPSILON) {
      if (this.longExposure.has(level)) {
        this.longExposure.delete(level);
        this.deferPositionAlignment();
        this.schedulePersist();
      }
      return;
    }
    if (Math.abs(next - current) <= EPSILON) return;
    this.longExposure.set(level, next);
    this.deferPositionAlignment();
    this.schedulePersist();
  }

  private incrementShortExposure(level: number, quantity: number): void {
    if (quantity <= EPSILON) return;
    const current = this.shortExposure.get(level) ?? 0;
    const next = Math.min(this.config.orderSize, current + quantity);
    if (next <= EPSILON) {
      if (this.shortExposure.has(level)) {
        this.shortExposure.delete(level);
        this.deferPositionAlignment();
        this.schedulePersist();
      }
      return;
    }
    if (Math.abs(next - current) <= EPSILON) return;
    this.shortExposure.set(level, next);
    this.deferPositionAlignment();
    this.schedulePersist();
  }

  private consumeLongExposure(closeLevel: number, quantity: number): void {
    if (quantity <= EPSILON) return;
    const sources = this.levelMeta[closeLevel]?.closeSources ?? [];
    let remaining = quantity;
    let consumedAny = false;
    for (const source of [...sources].sort((a, b) => b - a)) {
      if (remaining <= EPSILON) break;
      const current = this.longExposure.get(source) ?? 0;
      if (current <= EPSILON) continue;
      const consumed = Math.min(current, remaining);
      const next = current - consumed;
      if (next <= EPSILON) this.longExposure.delete(source);
      else this.longExposure.set(source, next);
      remaining -= consumed;
      if (consumed > EPSILON) consumedAny = true;
      this.schedulePersist();
    }
    if (consumedAny) {
      this.deferPositionAlignment();
    }
  }

  private consumeShortExposure(closeLevel: number, quantity: number): void {
    if (quantity <= EPSILON) return;
    const sources = this.levelMeta[closeLevel]?.closeSources ?? [];
    let remaining = quantity;
    let consumedAny = false;
    for (const source of [...sources].sort((a, b) => a - b)) {
      if (remaining <= EPSILON) break;
      const current = this.shortExposure.get(source) ?? 0;
      if (current <= EPSILON) continue;
      const consumed = Math.min(current, remaining);
      const next = current - consumed;
      if (next <= EPSILON) this.shortExposure.delete(source);
      else this.shortExposure.set(source, next);
      remaining -= consumed;
      if (consumed > EPSILON) consumedAny = true;
      this.schedulePersist();
    }
    if (consumedAny) {
      this.deferPositionAlignment();
    }
  }

  private sumExposure(storage: Map<number, number>): number {
    let total = 0;
    for (const value of storage.values()) {
      total += value;
    }
    return total;
  }
}
