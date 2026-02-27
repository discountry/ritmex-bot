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
  intent?: "ENTRY" | "EXIT";
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
  private priceDecimals: number;
  private readonly now: () => number;
  private readonly configValid: boolean;
  private readonly gridLevels: number[];
  private readonly levelMeta: LevelMeta[] = [];
  private readonly buyLevelIndices: number[] = [];
  private readonly sellLevelIndices: number[] = [];
  
  private readonly pendingLongLevels = new Set<number>();
  private readonly pendingShortLevels = new Set<number>();
  private readonly closeKeyBySourceLevel = new Map<number, string>();
  
  private prevActiveIds: Set<string> = new Set<string>();
  private orderIntentById = new Map<string, { side: "BUY" | "SELL"; price: string; level: number; intent: "ENTRY" | "EXIT"; sourceLevel?: number }>();
  // When an order at a level disappears but account delta hasn't arrived yet,
  // temporarily block re-opening at that level to avoid immediate re-placement.
  
  // Track levels awaiting classification after disappearance until next account snapshot confirms
  
  // Key-level suppression for (side:price:intent) to bridge WS latency windows
  private readonly pendingKeyUntil = new Map<string, number>();
  static readonly PENDING_TTL_MS = 10_000;

  private sidesLocked = false;
  private startupCleaned = false;
  private startupCancelDone = false;
  private startupCancelPromise: Promise<void> | null = null;
  private initialCloseHandled = false;
  private lastAbsPositionAmt = 0;
  private immediateCloseToPlace: Array<{ sourceLevel: number; targetLevel: number; side: "BUY" | "SELL"; price: string }> = [];

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
  private precisionSync: Promise<void> | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private running: boolean;
  private stopReason: string | null = null;
  private lastUpdated: number | null = null;
  private accountVersion = 0;
  private ordersVersion = 0;
  private awaitingByLevel = new Map<number, { accountVerAtStart: number; absAtStart: number; ts: number }>();
  private lastPlacementOrdersVersion = -1;
  private lastLimitAttemptAt = 0;
  static readonly LIMIT_COOLDOWN_MS = 3000;

  constructor(private readonly config: GridConfig, private readonly exchange: ExchangeAdapter, options: EngineOptions = {}) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.log = (type, detail) => this.tradeLog.push(type, detail);
    this.priceDecimals = decimalsOf(this.config.priceTick);
    this.now = options.now ?? Date.now;
    this.configValid = this.validateConfig();
    this.gridLevels = this.computeGridLevels();
    this.buildLevelMeta();
    this.syncPrecision();
    this.running = this.configValid;
    if (!this.configValid) {
      this.stopReason = "配置无效，已暂停网格";
      this.log("error", this.stopReason);
    }
    if (this.gridLevels.length === 0) {
      this.running = false;
      this.stopReason = `网格价位计算失败，模式不支持或参数无效: ${String(this.config.gridMode)}`;
      this.log("error", this.stopReason);
      this.emitUpdate();
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

  private syncPrecision(): void {
    if (this.precisionSync) return;
    const getPrecision = this.exchange.getPrecision?.bind(this.exchange);
    if (!getPrecision) return;
    this.precisionSync = getPrecision()
      .then((precision) => {
        if (!precision) return;
        let updated = false;
        if (Number.isFinite(precision.priceTick) && precision.priceTick > 0) {
          if (Math.abs(precision.priceTick - this.config.priceTick) > 1e-12) {
            this.config.priceTick = precision.priceTick;
            this.priceDecimals = decimalsOf(precision.priceTick);
            updated = true;
          }
        }
        if (Number.isFinite(precision.qtyStep) && precision.qtyStep > 0) {
          if (Math.abs(precision.qtyStep - this.config.qtyStep) > 1e-12) {
            this.config.qtyStep = precision.qtyStep;
            updated = true;
          }
        }
        if (updated) {
          this.log(
            "info",
            `已同步交易精度: priceTick=${precision.priceTick} qtyStep=${precision.qtyStep}`
          );
          this.rebuildGridAfterPrecisionUpdate();
        }
      })
      .catch((error) => {
        this.log("error", `同步精度失败: ${extractMessage(error)}`);
        this.precisionSync = null;
        setTimeout(() => this.syncPrecision(), 2000);
      });
  }

  private rebuildGridAfterPrecisionUpdate(): void {
    if (!this.configValid) return;
    const reference = this.getReferencePrice();
    const newLevels = this.computeGridLevels();
    this.gridLevels.length = 0;
    this.gridLevels.push(...newLevels);
    this.buildLevelMeta(reference);
    this.emitUpdate();
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
    if (!Number.isFinite(this.config.refreshIntervalMs) || this.config.refreshIntervalMs < 100) {
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
        this.accountVersion += 1;
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
        this.ordersVersion += 1;
        if (!this.feedArrived.orders) {
          this.feedArrived.orders = true;
          log("info", "订单快照已同步");
          // cancel all existing orders at startup per simplified rules
          this.startupCancelPromise = this.cancelAllExistingOrdersOnStartup();
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
    const FINAL = new Set(["FILLED", "CANCELED", "CANCELLED", "REJECTED", "EXPIRED"]);
    Object.keys(this.pendings).forEach((type) => {
      const pendingId = this.pendings[type];
      if (!pendingId) return;
      const match = list.find((order) => String(order.orderId) === pendingId);
      if (!match) {
        unlockOperating(this.locks, this.timers, this.pendings, type);
        return;
      }
      const status = String(match.status || "").toUpperCase();
      if (FINAL.has(status)) {
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


  // removed unused hasActiveOrders

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
    this.awaitingByLevel.clear();
    this.closeKeyBySourceLevel.clear();
    this.immediateCloseToPlace = [];
    // 仅在不需要自动重启时停止轮询定时器
    if (!this.config.autoRestart) {
      this.stop();
    }
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
        false,
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
    // 重新锚定买卖侧（可选：根据当前价格）
    this.sidesLocked = false;
    this.tryLockSidesOnce();
    this.start();
  }

  private async syncGridSimple(price: number): Promise<void> {
    // 启动撤单未完成前，禁止铺网/下单，避免新单被启动撤单冲掉造成“消失待判定”
    if (!this.startupCancelDone) {
      this.log("info", "启动撤单未完成，等待后再部网");
      this.lastUpdated = this.now();
      return;
    }
    // --- 0) If there is an existing net position, enforce "exit-first" before any ENTRY ---
    const hasNetLong = this.position.positionAmt > EPSILON;
    const hasNetShort = this.position.positionAmt < -EPSILON;

    const hasActiveExit = (side: "BUY" | "SELL"): boolean => {
      for (const o of this.openOrders) {
        if (!this.isActiveLimitOrder(o)) continue;
        if (o.side !== side) continue;
        const meta = this.orderIntentById.get(String(o.orderId));
        if (meta && meta.intent === "EXIT") return true;
      }
      return false;
    };

    const ensureSingleExitForExistingPosition = async (): Promise<boolean> => {
      const qty = this.position.positionAmt;
      if (!Number.isFinite(qty) || Math.abs(qty) <= EPSILON) return false;
      const entry = this.position.entryPrice;
      if (!Number.isFinite(entry)) return false;
      const dir: "long" | "short" = qty > 0 ? "long" : "short";
      const nearest = this.findNearestProfitableCloseLevel(dir, Number(entry));
      if (nearest == null) return false;
      const exitSide: "BUY" | "SELL" = qty > 0 ? "SELL" : "BUY";
      const priceStr = this.formatPrice(this.gridLevels[nearest]!);
      const key = this.getOrderKey(exitSide, priceStr, "EXIT");
      const activeAlready = hasActiveExit(exitSide);
      const until = this.pendingKeyUntil.get(key);
      if (activeAlready || (until && until > this.now())) return activeAlready;
      try {
        const placed = await placeOrder(
          this.exchange,
          this.config.symbol,
          this.openOrders,
          this.locks,
          this.timers,
          this.pendings,
          exitSide,
          priceStr,
          Math.abs(qty),
          this.log,
          false,
          undefined,
          { priceTick: this.config.priceTick, qtyStep: this.config.qtyStep, skipDedupe: true }
        );
        this.pendingKeyUntil.set(key, this.now() + GridEngine.PENDING_TTL_MS);
        if (placed?.orderId != null) {
          const source = this.findSourceForInitialPosition(exitSide);
          if (exitSide === "SELL") this.pendingLongLevels.add(source);
          else this.pendingShortLevels.add(source);
          this.closeKeyBySourceLevel.set(source, key);
          this.orderIntentById.set(String(placed.orderId), {
            side: exitSide,
            price: priceStr,
            level: nearest,
            intent: "EXIT",
            sourceLevel: source,
          });
          this.log("order", `兜底：为已有仓位挂平仓单 ${exitSide} @ ${priceStr}`);
        }
        return true;
      } catch (err) {
        this.log("error", `兜底平仓单下单失败: ${extractMessage(err)}`);
        return false;
      }
    };

    if (hasNetLong || hasNetShort) {
      const needExitSide: "BUY" | "SELL" = hasNetLong ? "SELL" : "BUY";
      if (!hasActiveExit(needExitSide)) {
        await ensureSingleExitForExistingPosition();
        this.lastUpdated = this.now();
        this.prevActiveIds = new Set(this.openOrders.filter(o => this.isActiveLimitOrder(o)).map(o => String(o.orderId)));
        return;
      }
    }

    const activeOrders = this.openOrders.filter((o) => this.isActiveLimitOrder(o));
    // Build lookup for all recent orders by id (including non-active) to read final statuses
    const allOrdersById = new Map<string, AsterOrder>();
    for (const o of this.openOrders) {
      if (o.symbol !== this.config.symbol) continue;
      allOrdersById.set(String(o.orderId), o);
    }

    // Build active order key counts with intent awareness
    const activeKeyCounts = new Map<string, number>();
    const currIds = new Set<string>();
    for (const o of activeOrders) {
      const id = String(o.orderId);
      currIds.add(id);
      const meta = this.orderIntentById.get(id);
      const priceStr = this.normalizePrice(o.price);
      if (meta) {
        const k = this.getOrderKey(o.side, priceStr, meta.intent);
        activeKeyCounts.set(k, (activeKeyCounts.get(k) ?? 0) + 1);
      } else {
        // Conservative: count both ENTRY and EXIT to avoid duplicate placements when intent is unknown
        const kEntry = this.getOrderKey(o.side, priceStr, "ENTRY");
        const kExit = this.getOrderKey(o.side, priceStr, "EXIT");
        activeKeyCounts.set(kEntry, (activeKeyCounts.get(kEntry) ?? 0) + 1);
        activeKeyCounts.set(kExit, (activeKeyCounts.get(kExit) ?? 0) + 1);
      }
    }

    // Any key that is already visible as active should clear local suppression
    for (const [k, cnt] of activeKeyCounts.entries()) {
      if ((cnt ?? 0) > 0) this.pendingKeyUntil.delete(k);
    }

    // Detect disappeared orders by id
    const disappeared: string[] = [];
    for (const id of this.prevActiveIds) {
      if (!currIds.has(id)) disappeared.push(id);
    }

    // Handle disappeared orders classification and reactions
    for (const id of disappeared) {
      const meta = this.orderIntentById.get(id);
      if (!meta) continue;
      // Classify by final observable status or position delta (direction-aware)
      let classified: "filled" | "canceled" | "unknown" = "unknown";
      const rec = allOrdersById.get(id);
      if (rec) {
        const status = String(rec.status || "").toUpperCase();
        const executed = Number(rec.executedQty || 0);
        if (status === "FILLED" || executed > EPSILON) {
          classified = "filled";
        } else if (["CANCELED", "CANCELLED", "EXPIRED", "REJECTED"].includes(status)) {
          classified = "canceled";
        }
      }
      if (classified === "unknown") {
        // Defer classification until next account snapshot; block ENTRY on that level in the meantime
        const level = meta.intent === "EXIT"
          ? (meta.sourceLevel ?? this.findSourceForCloseTarget(meta.level, meta.side))
          : meta.level;
        this.awaitingByLevel.set(level, { accountVerAtStart: this.accountVersion, absAtStart: this.lastAbsPositionAmt, ts: this.now() });
        // skip side effects for this disappeared id in this tick
        this.orderIntentById.delete(id);
        continue;
      }
      if (classified === "filled") {
        if (meta.intent === "ENTRY") {
          if (meta.side === "BUY") this.pendingLongLevels.add(meta.level);
          else this.pendingShortLevels.add(meta.level);
          // Immediately plan EXIT for the mapped target
          const target0 = this.levelMeta[meta.level]?.closeTarget;
          if (target0 != null) {
            const priceStr0 = this.formatPrice(this.gridLevels[target0]!);
            const side0: "BUY" | "SELL" = meta.side === "BUY" ? "SELL" : "BUY";
            const exitKey = this.getOrderKey(side0, priceStr0, "EXIT");
            const count = activeKeyCounts.get(exitKey) ?? 0;
            if (count < 1) {
              this.immediateCloseToPlace.push({ sourceLevel: meta.level, targetLevel: target0, side: side0, price: priceStr0 });
            }
            this.closeKeyBySourceLevel.set(meta.level, exitKey);
          }
        } else {
          // EXIT filled -> clear using sourceLevel
          const src = meta.sourceLevel ?? this.findSourceForCloseTarget(meta.level, meta.side);
          this.pendingLongLevels.delete(src);
          this.pendingShortLevels.delete(src);
          this.closeKeyBySourceLevel.delete(src);
        }
        // Clear suppression for this key on fill
        const filledKey = this.getOrderKey(meta.side, meta.price, meta.intent);
        this.pendingKeyUntil.delete(filledKey);
      } else if (classified === "canceled") {
        // if it was EXIT we also drop mapping by source
        if (meta.intent === "EXIT") {
          const src = meta.sourceLevel ?? this.findSourceForCloseTarget(meta.level, meta.side);
          this.closeKeyBySourceLevel.delete(src);
        }
        // Clear suppression for this key on cancel
        const canceledKey = this.getOrderKey(meta.side, meta.price, meta.intent);
        this.pendingKeyUntil.delete(canceledKey);
      }
      // cleanup intent map for this disappeared id to avoid leaks
      this.orderIntentById.delete(id);
    }
    // Update prevActiveIds for next tick
    this.prevActiveIds = currIds;

    // Resolve deferred unknown classifications after a new account snapshot
    if (this.awaitingByLevel.size) {
      for (const [level, info] of Array.from(this.awaitingByLevel.entries())) {
        // timeout fallback: if no account delta for long time, treat as canceled/no-op
        if (this.now() - info.ts > 8000) {
          this.awaitingByLevel.delete(level);
          continue;
        }
        if (this.accountVersion <= info.accountVerAtStart) continue;
        const absNow = Math.abs(this.position.positionAmt);
        if (absNow > info.absAtStart + EPSILON) {
          // infer ENTRY filled -> mark level pending
          const sideAtLevel = this.levelMeta[level]?.side === "BUY" ? "BUY" : "SELL";
          if (sideAtLevel === "BUY") this.pendingLongLevels.add(level);
          else this.pendingShortLevels.add(level);
          this.awaitingByLevel.delete(level);
          continue;
        }
        if (absNow + EPSILON < info.absAtStart) {
          // infer EXIT filled -> clear pending and close key for source level
          this.pendingLongLevels.delete(level);
          this.pendingShortLevels.delete(level);
          this.closeKeyBySourceLevel.delete(level);
          this.awaitingByLevel.delete(level);
          continue;
        }
        // no abs change after new account snapshot -> treat as canceled/no-op
        this.awaitingByLevel.delete(level);
      }
    }

    // Desired open orders according to locked sides
    const desired: DesiredGridOrder[] = [];
    const desiredKeySet = new Set<string>();
    const plannedKeyCounts = new Map<string, number>(activeKeyCounts);
    const halfTick = this.config.priceTick / 2;

    // First, place any immediate close (EXIT) orders queued by fresh fills
    if (this.immediateCloseToPlace.length) {
      for (const item of this.immediateCloseToPlace) {
        const key = this.getOrderKey(item.side, item.price, "EXIT");
        const until = this.pendingKeyUntil.get(key);
        const nowTs = this.now();
        if (until && until > nowTs) {
          continue;
        }
        const count = plannedKeyCounts.get(key) ?? 0;
        if (count < 1 && !desiredKeySet.has(key)) {
          desired.push({ level: item.targetLevel, side: item.side, price: item.price, amount: this.config.orderSize, intent: "EXIT" });
          desiredKeySet.add(key);
          plannedKeyCounts.set(key, count + 1);
        }
        if (!this.closeKeyBySourceLevel.has(item.sourceLevel)) {
          this.closeKeyBySourceLevel.set(item.sourceLevel, key);
        }
      }
      // clear queue regardless to avoid duplicates next tick
      this.immediateCloseToPlace = [];
    }

    // hasNetLong/hasNetShort already computed above for exit-first

    // ENTRY opens below price (BUY)
    for (const level of this.buyLevelIndices) {
      if (hasNetLong || hasNetShort) {
        // During exit-first, do not place any ENTRY orders
        continue;
      }
      const levelPrice = this.gridLevels[level]!;
      if (levelPrice >= price - halfTick) continue;
      if (this.awaitingByLevel.has(level)) {
        this.log("info", `跳过 BUY @ ${this.formatPrice(levelPrice)}：等待上一笔消失判定`);
        continue;
      }
      if (this.pendingLongLevels.has(level)) {
        this.log("info", `跳过 BUY @ ${this.formatPrice(levelPrice)}：等待对应平仓成交`);
        continue; // wait until close filled
      }
      const priceStr = this.formatPrice(levelPrice);
      const key = this.getOrderKey("BUY", priceStr, "ENTRY");
      // If an EXIT at the same side+price is planned/active, skip ENTRY to avoid intent conflict
      const exitKeySame = this.getOrderKey("BUY", priceStr, "EXIT");
      if ((plannedKeyCounts.get(exitKeySame) ?? 0) >= 1 || desiredKeySet.has(exitKeySame)) {
        continue;
      }
      const until = this.pendingKeyUntil.get(key);
      const nowTs = this.now();
      if (until && until > nowTs) {
        continue;
      }
      if ((plannedKeyCounts.get(key) ?? 0) >= 1) continue;
      if (!desiredKeySet.has(key)) {
        desired.push({ level, side: "BUY", price: priceStr, amount: this.config.orderSize, intent: "ENTRY" });
        desiredKeySet.add(key);
        plannedKeyCounts.set(key, (plannedKeyCounts.get(key) ?? 0) + 1);
      }
    }

    // ENTRY opens above price (SELL)
    for (const level of this.sellLevelIndices) {
      if (hasNetLong || hasNetShort) {
        // During exit-first, do not place any ENTRY orders
        continue;
      }
      const levelPrice = this.gridLevels[level]!;
      if (levelPrice <= price + halfTick) continue;
      if (this.awaitingByLevel.has(level)) {
        this.log("info", `跳过 SELL @ ${this.formatPrice(levelPrice)}：等待上一笔消失判定`);
        continue;
      }
      if (this.pendingShortLevels.has(level)) {
        this.log("info", `跳过 SELL @ ${this.formatPrice(levelPrice)}：等待对应平仓成交`);
        continue;
      }
      const priceStr = this.formatPrice(levelPrice);
      const key = this.getOrderKey("SELL", priceStr, "ENTRY");
      // If an EXIT at the same side+price is planned/active, skip ENTRY to avoid intent conflict
      const exitKeySame = this.getOrderKey("SELL", priceStr, "EXIT");
      if ((plannedKeyCounts.get(exitKeySame) ?? 0) >= 1 || desiredKeySet.has(exitKeySame)) {
        continue;
      }
      const until = this.pendingKeyUntil.get(key);
      const nowTs = this.now();
      if (until && until > nowTs) {
        continue;
      }
      if ((plannedKeyCounts.get(key) ?? 0) >= 1) continue;
      if (!desiredKeySet.has(key)) {
        desired.push({ level, side: "SELL", price: priceStr, amount: this.config.orderSize, intent: "ENTRY" });
        desiredKeySet.add(key);
        plannedKeyCounts.set(key, (plannedKeyCounts.get(key) ?? 0) + 1);
      }
    }

    // EXIT close orders for pending levels
    for (const source of this.pendingLongLevels) {
      const target = this.levelMeta[source]?.closeTarget;
      if (target == null) continue;
      const priceStr = this.formatPrice(this.gridLevels[target]!);
      const closeKey = this.getOrderKey("SELL", priceStr, "EXIT");
      const until = this.pendingKeyUntil.get(closeKey);
      const nowTs = this.now();
      if (until && until > nowTs) {
        continue;
      }
      if ((plannedKeyCounts.get(closeKey) ?? 0) < 1 && !desiredKeySet.has(closeKey)) {
        desired.push({ level: target, side: "SELL", price: priceStr, amount: this.config.orderSize, intent: "EXIT" });
        desiredKeySet.add(closeKey);
        plannedKeyCounts.set(closeKey, (plannedKeyCounts.get(closeKey) ?? 0) + 1);
      }
      if (!this.closeKeyBySourceLevel.has(source)) {
        this.closeKeyBySourceLevel.set(source, closeKey);
      }
    }
    for (const source of this.pendingShortLevels) {
      const target = this.levelMeta[source]?.closeTarget;
      if (target == null) continue;
      const priceStr = this.formatPrice(this.gridLevels[target]!);
      const closeKey = this.getOrderKey("BUY", priceStr, "EXIT");
      const until = this.pendingKeyUntil.get(closeKey);
      const nowTs = this.now();
      if (until && until > nowTs) {
        continue;
      }
      if ((plannedKeyCounts.get(closeKey) ?? 0) < 1 && !desiredKeySet.has(closeKey)) {
        desired.push({ level: target, side: "BUY", price: priceStr, amount: this.config.orderSize, intent: "EXIT" });
        desiredKeySet.add(closeKey);
        plannedKeyCounts.set(closeKey, (plannedKeyCounts.get(closeKey) ?? 0) + 1);
      }
      if (!this.closeKeyBySourceLevel.has(source)) {
        this.closeKeyBySourceLevel.set(source, closeKey);
      }
    }

    // Place desired orders (rate-limited per tick to avoid dedupe race)
    this.desiredOrders = desired;
    let newOrdersPlaced = 0;
    const MAX_NEW_ORDERS_PER_TICK = 1;
    for (const d of desired) {
      if (newOrdersPlaced >= MAX_NEW_ORDERS_PER_TICK) break;
      // Gate: avoid overlapping with coordinator pending LIMIT
      if (this.pendings["LIMIT"]) {
        this.log("info", "存在未完成的 LIMIT 操作，本轮不再下新单");
        break;
      }
      // Gate: require either a new orders snapshot OR cooldown elapsed
      const nowTs2 = this.now();
      const needSnapshotUpdated = this.lastPlacementOrdersVersion === this.ordersVersion;
      const inCooldown = nowTs2 - this.lastLimitAttemptAt < GridEngine.LIMIT_COOLDOWN_MS;
      if (needSnapshotUpdated && inCooldown) {
        // both conditions unmet: still waiting for either snapshot or cooldown
        this.log("info", "等待订单快照或冷却结束再下单");
        break;
      }
      // If a LIMIT operation is already pending (coordinator lock), skip issuing more this tick
      if (this.pendings["LIMIT"]) {
        this.log("info", "存在未完成的 LIMIT 操作，本轮不再下新单");
        break;
      }
      const isClose = d.intent === "EXIT" || (d.side === "SELL" && this.isTargetOfPendingLong(d.level)) || (d.side === "BUY" && this.isTargetOfPendingShort(d.level));
      const intent: "ENTRY" | "EXIT" = isClose ? "EXIT" : "ENTRY";
      // Cap quantities: EXIT by remaining position; ENTRY by maxPositionSize guard
      if (intent === "EXIT") {
        const capped = this.capExitQty(d.amount, d.side);
        if (capped <= EPSILON) continue;
        d.amount = capped;
      } else {
        const capped = this.capEntryQty(d.amount, d.side);
        if (capped <= EPSILON) {
          const absPos = Math.abs(this.position.positionAmt);
          const pendingEntrySameSide = this.estimatePendingEntryQty(d.side);
          this.log(
            "info",
            `跳过开仓 ${d.side} @ ${d.price}：仓位容量已满 (abs=${absPos}, pending=${pendingEntrySameSide}, max=${this.config.maxPositionSize})`
          );
          continue;
        }
        d.amount = capped;
      }
      const key = this.getOrderKey(d.side, d.price, intent);
      // Strong local dedupe: skip if any active LIMIT exists with same side+price
      const hasSameSidePrice = this.openOrders.some(o => this.isActiveLimitOrder(o) && o.side === d.side && this.normalizePrice(o.price) === d.price);
      if (hasSameSidePrice || (activeKeyCounts.get(key) ?? 0) >= 1) {
        this.log("info", `已存在挂单，跳过 ${intent} ${d.side} @ ${d.price}`);
        continue;
      }
      try {
        // record attempt time to avoid rapid retries even if placement fails
        this.lastLimitAttemptAt = nowTs2;
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
          this.lastPlacementOrdersVersion = this.ordersVersion;
          newOrdersPlaced += 1;
          plannedKeyCounts.set(key, (plannedKeyCounts.get(key) ?? 0) + 1);
          activeKeyCounts.set(key, (activeKeyCounts.get(key) ?? 0) + 1);
          // ensure suppression window persists after success
          this.pendingKeyUntil.set(key, this.now() + GridEngine.PENDING_TTL_MS);
          if (placed.orderId != null) {
            const record: { side: "BUY" | "SELL"; price: string; level: number; intent: "ENTRY" | "EXIT"; sourceLevel?: number } = {
              side: d.side,
              price: d.price,
              level: d.level,
              intent,
            };
            if (intent === "EXIT") {
              record.sourceLevel = this.findSourceForCloseTarget(d.level, d.side);
            }
            this.orderIntentById.set(String(placed.orderId), record);
          }
        }
        // optimistic suppression even if not placed to avoid rapid retries during WS lag/dedupe
        if (!this.pendingKeyUntil.has(key)) {
          this.pendingKeyUntil.set(key, this.now() + GridEngine.PENDING_TTL_MS);
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

  private capExitQty(desiredQty: number, side: "BUY" | "SELL"): number {
    const absPos = Math.abs(this.position.positionAmt);
    if (absPos <= EPSILON) return 0;
    let pendingExitQty = 0;
    for (const o of this.openOrders) {
      if (!this.isActiveLimitOrder(o)) continue;
      if (o.side !== side) continue; // same side as this EXIT order
      const meta = this.orderIntentById.get(String(o.orderId));
      if (!meta || meta.intent !== "EXIT") continue;
      const orig = Number(o.origQty || 0);
      const exec = Number(o.executedQty || 0);
      const remaining = Math.max(orig - exec, 0);
      pendingExitQty += remaining;
    }
    const remain = Math.max(absPos - pendingExitQty, 0);
    return Math.min(desiredQty, remain);
  }

  private estimatePendingEntryQty(side: "BUY" | "SELL"): number {
    let sum = 0;
    for (const o of this.openOrders) {
      if (!this.isActiveLimitOrder(o)) continue;
      if (o.side !== side) continue;
      const meta = this.orderIntentById.get(String(o.orderId));
      if (!meta || meta.intent !== "ENTRY") continue;
      const orig = Number(o.origQty || 0);
      const exec = Number(o.executedQty || 0);
      sum += Math.max(orig - exec, 0);
    }
    return sum;
  }

  private capEntryQty(desiredQty: number, _side: "BUY" | "SELL"): number {
    // Relaxed policy: cap only by current absolute position, not by outstanding open entries
    // This matches expectation to place the full grid even before any fills occur.
    const absPos = Math.abs(this.position.positionAmt);
    const remain = Math.max(this.config.maxPositionSize - absPos, 0);
    return Math.min(desiredQty, remain);
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
      // snap endpoints to exact bounds to avoid drift
      if (levels.length) {
        levels[0] = Number(lowerPrice.toFixed(this.priceDecimals));
        levels[levels.length - 1] = Number(upperPrice.toFixed(this.priceDecimals));
      }
      return levels;
    }
    this.log("error", `不支持的网格模式: ${String(this.config.gridMode)}`);
    return [];
  }

  private buildSnapshot(): GridEngineSnapshot {
    const reference = this.getReferencePrice();
    const tickerLast = Number(this.tickerSnapshot?.lastPrice);
    const lastPrice = Number.isFinite(tickerLast) ? tickerLast : reference;
    const midPrice = reference;
    const desiredKeys = new Set(
      this.desiredOrders.map((order) => this.getOrderKey(order.side, order.price, order.intent ?? "ENTRY"))
    );
    const openOrderKeys = new Set(
      this.openOrders
        .filter((order) => this.isActiveLimitOrder(order))
        .map((order) => {
          const id = String(order.orderId);
          const meta = this.orderIntentById.get(id);
          const intent: "ENTRY" | "EXIT" = meta?.intent ?? "ENTRY";
          return this.getOrderKey(order.side, this.normalizePrice(order.price), intent);
        })
    );

    const gridLines: GridLineSnapshot[] = this.gridLevels.map((price, level) => {
      const desired = this.desiredOrders.find((order) => order.level === level);
      const defaultSide = this.buyLevelIndices.includes(level) ? "BUY" : "SELL";
      const side = desired?.side ?? defaultSide;
      const key = desired ? this.getOrderKey(desired.side, desired.price, desired.intent ?? "ENTRY") : null;
      const hasOrder = key ? openOrderKeys.has(key) : false;
      const active = Boolean(desired && key && desiredKeys.has(key));
      return {
        level,
        price,
        side,
        active,
        hasOrder,
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
      openOrders: this.openOrders.filter((order) => this.isActiveLimitOrder(order)),
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

  private getOrderKey(side: "BUY" | "SELL", price: string, intent: "ENTRY" | "EXIT" = "ENTRY"): string {
    return `${side}:${price}:${intent}`;
  }

  private isActiveLimitOrder(o: AsterOrder): boolean {
    if (o.symbol !== this.config.symbol) return false;
    if (o.type !== "LIMIT") return false;
    const s = String(o.status || "").toUpperCase();
    return !["FILLED", "CANCELED", "CANCELLED", "REJECTED", "EXPIRED"].includes(s);
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
    const hasReference = Number.isFinite(referencePrice ?? NaN);
    const pivotPrice = hasReference ? this.clampReferencePrice(Number(referencePrice)) : null;
    for (let i = 0; i < this.gridLevels.length; i += 1) {
      let side: "BUY" | "SELL";
      if (pivotPrice != null) {
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
    } finally {
      this.startupCancelDone = true;
      // 清理本地判定/抑制状态，避免被启动撤单冲掉的新单在本地留下“待判定”残留
      this.prevActiveIds.clear();
      this.orderIntentById.clear();
      this.awaitingByLevel.clear();
      this.pendingKeyUntil.clear();
      this.pendingLongLevels.clear();
      this.pendingShortLevels.clear();
      this.closeKeyBySourceLevel.clear();
      this.immediateCloseToPlace = [];
    }
  }

  private async tryHandleInitialClose(): Promise<void> {
    if (this.initialCloseHandled) return;
    if (!(this.feedStatus.account && this.feedStatus.orders && (this.feedStatus.ticker || this.feedStatus.depth))) return;
    // Wait for startup cancel barrier to avoid racing with initial close
    if (!this.startupCancelDone) {
      if (this.startupCancelPromise) {
        try { await this.startupCancelPromise; } catch {}
      }
      if (!this.startupCancelDone) return;
    }
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
        // optimistic suppression for initial close key
        const exitKey = this.getOrderKey(side, priceStr, "EXIT");
        this.pendingKeyUntil.set(exitKey, this.now() + GridEngine.PENDING_TTL_MS);
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
          this.closeKeyBySourceLevel.set(source, exitKey);
          if (placed.orderId != null) {
            this.orderIntentById.set(String(placed.orderId), { side, price: priceStr, level: nearest, intent: "EXIT", sourceLevel: source });
          }
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
