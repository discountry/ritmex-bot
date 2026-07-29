import type { GridConfig, GridDirection } from "../config";
import type { ExchangeAdapter } from "../exchanges/adapter";
import type { AccountSnapshot, Depth, Order, Ticker } from "../exchanges/types";
import { createTradeLog, type TradeLogEntry } from "../logging/trade-log";
import { extractMessage, isUnknownOrderError } from "../utils/errors";
import { getMidOrLast } from "../utils/price";
import { getPosition, type PositionSnapshot } from "../utils/strategy";
import {
  marketClose,
  placeOrder,
  placeStopLossOrder,
  unlockOperating,
  type OrderContext,
  type OrderLockMap,
  type OrderPendingMap,
  type OrderTimerMap,
} from "../core/order-coordinator";
import { t } from "../i18n";
import { StrategyEventEmitter } from "./common/event-emitter";
import { createPrecisionSyncer, type PrecisionSyncer } from "./common/precision-syncer";
import { safeSubscribe, type LogHandler } from "./common/subscriptions";
import { clearGridState, loadGridState, saveGridState } from "./common/grid-storage";
import {
  ORPHAN_LEVEL,
  applyRebuild,
  createInitialState,
  desiredExchangeStop,
  fromStored,
  isCompatibleStoredState,
  makeEntryClientOrderId,
  makeExitClientOrderId,
  planShiftStep,
  planTick,
  qtyEpsilon,
  reconcile,
  toStored,
  type ExchangeStopState,
  type GridLogicSettings,
  type GridLogicState,
  type GridPlanAction,
  type GridTradeMode,
  type LevelPhase,
  type OrderIntentRecord,
  type OrderView,
  type ShiftPhase,
  type Side,
  type StateMeta,
} from "./grid-logic";

// ---------------------------------------------------------------------------
// Snapshot types
// ---------------------------------------------------------------------------

export interface DesiredGridOrder {
  level: number;
  side: Side;
  price: string;
  amount: number;
  intent: "ENTRY" | "EXIT";
}

export interface GridLineSnapshot {
  level: number;
  price: number;
  side: Side | "-";
  role: "entry-buy" | "entry-sell" | "none";
  state: LevelPhase;
  hasOrder: boolean;
  holdQty: number;
}

export interface GridEngineSnapshot {
  ready: boolean;
  symbol: string;
  lowerPrice: number;
  upperPrice: number;
  gridVersion: number;
  anchorPrice: number | null;
  shiftPhase: ShiftPhase | null;
  lastPrice: number | null;
  midPrice: number | null;
  gridLines: GridLineSnapshot[];
  desiredOrders: DesiredGridOrder[];
  openOrders: Order[];
  position: PositionSnapshot;
  running: boolean;
  stopReason: string | null;
  direction: GridDirection;
  stopProtection: {
    uncoveredQty: number;
    exchangeStop: ExchangeStopState | null;
  };
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
  /** Skip disk persistence (for tests) */
  skipPersistence?: boolean;
}

const EPSILON = 1e-8;
const FINAL_STATUSES = new Set(["FILLED", "CANCELED", "CANCELLED", "REJECTED", "EXPIRED"]);

// ---------------------------------------------------------------------------
// GridEngine：I/O 编排层。所有网格决策在 grid-logic.ts 的纯函数中完成。
// ---------------------------------------------------------------------------

export class GridEngine {
  static readonly LIMIT_COOLDOWN_MS = 3000;
  static readonly STOP_SYNC_INTERVAL_MS = 5000;
  static readonly STALE_PLACEMENT_MS = 20_000;

  private readonly tradeLog: ReturnType<typeof createTradeLog>;
  private readonly events = new StrategyEventEmitter<GridEvent, GridEngineSnapshot>();
  private readonly locks: OrderLockMap = {};
  private readonly timers: OrderTimerMap = {};
  private readonly pendings: OrderPendingMap = {};
  private readonly now: () => number;
  private readonly skipPersistence: boolean;
  private readonly configValid: boolean;
  private readonly log: LogHandler;

  private state: GridLogicState | null = null;
  private initStarted = false;
  private initDone = false;

  private depthSnapshot: Depth | null = null;
  private tickerSnapshot: Ticker | null = null;
  private openOrders: Order[] = [];
  private position: PositionSnapshot = {
    positionAmt: 0,
    entryPrice: 0,
    unrealizedProfit: 0,
    markPrice: null,
  };

  private readonly feedStatus = { account: false, orders: false, depth: false, ticker: false };
  private readonly feedArrived = { account: false, orders: false, depth: false, ticker: false };

  private accountVersion = 0;
  private ordersVersion = 0;
  private ordersFeedLastAt = 0;
  private tickerLastAt = 0;

  private frozen = false;
  private restReconcilePending = false;
  private lastReconcileAt = 0;
  private lastStopSyncAt = 0;
  private stopPlacedAt = 0;
  private lastPlacementAt = 0;
  private lastPlacementOrdersVersion = -1;
  private lastLimitAttemptAt = 0;
  private lastStalenessLogAt = 0;
  private shiftCloseAccountVersion = -1;
  private shiftCloseAt = 0;

  private timer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private running: boolean;
  private stopReason: string | null = null;
  private lastUpdated: number | null = null;
  private savePending = false;
  private uncoveredQty = 0;
  private desiredOrders: DesiredGridOrder[] = [];
  private readonly precision: PrecisionSyncer;

  constructor(
    private readonly config: GridConfig,
    private readonly exchange: ExchangeAdapter,
    options: EngineOptions = {}
  ) {
    this.tradeLog = createTradeLog(this.config.maxLogEntries);
    this.log = (type, detail) => this.tradeLog.push(type, detail);
    this.now = options.now ?? Date.now;
    this.skipPersistence = options.skipPersistence ?? false;
    this.configValid = this.validateConfig();
    this.running = this.configValid;
    if (!this.configValid) {
      this.stopReason = t("log.gridEngine.configInvalid");
      this.log("error", this.stopReason);
    }
    this.precision = createPrecisionSyncer(this.exchange, this.config, this.config.qtyStep, this.log);
    this.precision.start();
    this.bootstrap();
    this.setupConnectionProtection();
  }

  /** Bundles the fixed order-routing state; rebuilt lazily on first use. */
  private get orderContext(): OrderContext {
    return (this.orderContextCache ??= {
      adapter: this.exchange,
      symbol: this.config.symbol,
      locks: this.locks,
      timers: this.timers,
      pendings: this.pendings,
      log: (type, detail) => this.tradeLog.push(type, detail),
    });
  }
  private orderContextCache: OrderContext | null = null;

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
    this.precision.stop();
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

  // -----------------------------------------------------------------------
  // Settings / validation
  // -----------------------------------------------------------------------

  private validateConfig(): boolean {
    if (this.config.lowerPrice <= 0 || this.config.upperPrice <= 0) return false;
    if (this.config.upperPrice <= this.config.lowerPrice) return false;
    if (!Number.isFinite(this.config.gridLevels) || this.config.gridLevels < 2) return false;
    if (!Number.isFinite(this.config.orderSize) || this.config.orderSize <= 0) return false;
    if (!Number.isFinite(this.config.maxPositionSize) || this.config.maxPositionSize <= 0) return false;
    if (!Number.isFinite(this.config.refreshIntervalMs) || this.config.refreshIntervalMs < 1) return false;
    if (this.config.gridMode !== "geometric") return false;
    return true;
  }

  private get tradeMode(): GridTradeMode {
    return this.config.direction === "both" ? "neutral" : this.config.direction;
  }

  private logicSettings(): GridLogicSettings {
    return {
      direction: this.tradeMode,
      lowerPrice: this.state?.lowerPrice ?? this.config.lowerPrice,
      upperPrice: this.state?.upperPrice ?? this.config.upperPrice,
      gridLevels: this.config.gridLevels,
      orderSize: this.config.orderSize,
      maxPositionSize: this.config.maxPositionSize,
      priceTick: this.config.priceTick,
      qtyStep: this.config.qtyStep,
      stopLossPct: this.config.stopLossPct,
      uncoveredGraceMs: this.config.uncoveredGraceMs,
      shiftEnabled: this.config.gridShiftEnabled,
      shiftTriggerPct: this.config.gridShiftTriggerPct,
      shiftRangePct: this.config.gridShiftRangePct,
      shiftConfirmMs: this.config.gridShiftConfirmMs,
    };
  }

  private stateMeta(): StateMeta {
    return {
      symbol: this.config.symbol,
      exchangeId: this.exchange.id,
      direction: this.tradeMode,
      orderSize: this.config.orderSize,
      maxPositionSize: this.config.maxPositionSize,
      gridLevels: this.config.gridLevels,
      gridMode: this.config.gridMode,
    };
  }

  // -----------------------------------------------------------------------
  // Precision sync
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // Feed subscriptions / connection events
  // -----------------------------------------------------------------------

  private bootstrap(): void {
    safeSubscribe<AccountSnapshot>(
      this.exchange.watchAccount.bind(this.exchange),
      (snapshot) => {
        this.position = getPosition(snapshot, this.config.symbol);
        this.accountVersion += 1;
        if (!this.feedArrived.account) {
          this.feedArrived.account = true;
          this.log("info", t("log.account.snapshotSynced"));
        }
        this.feedStatus.account = true;
        this.emitUpdate();
      },
      this.log,
      {
        subscribeFail: (error) => t("log.subscribe.accountFail", { error: extractMessage(error) }),
        processFail: (error) => t("log.process.accountError", { error: extractMessage(error) }),
      }
    );

    safeSubscribe<Order[]>(
      this.exchange.watchOrders.bind(this.exchange),
      (orders) => {
        this.openOrders = Array.isArray(orders)
          ? orders.filter((order) => order.symbol === this.config.symbol)
          : [];
        this.synchronizeLocks(this.openOrders);
        this.ordersVersion += 1;
        this.ordersFeedLastAt = this.now();
        if (!this.feedArrived.orders) {
          this.feedArrived.orders = true;
          this.log("info", t("log.order.snapshotReturned"));
        }
        this.feedStatus.orders = true;
        void this.attemptInit();
        this.emitUpdate();
      },
      this.log,
      {
        subscribeFail: (error) => t("log.subscribe.orderFail", { error: extractMessage(error) }),
        processFail: (error) => t("log.process.orderError", { error: extractMessage(error) }),
      }
    );

    safeSubscribe<Depth>(
      this.exchange.watchDepth.bind(this.exchange, this.config.symbol),
      (depth) => {
        this.depthSnapshot = depth;
        if (!this.feedArrived.depth) {
          this.feedArrived.depth = true;
          this.log("info", t("log.depth.ready"));
        }
        this.feedStatus.depth = true;
      },
      this.log,
      {
        subscribeFail: (error) => t("log.subscribe.depthFail", { error: extractMessage(error) }),
        processFail: (error) => t("log.process.depthError", { error: extractMessage(error) }),
      }
    );

    safeSubscribe<Ticker>(
      this.exchange.watchTicker.bind(this.exchange, this.config.symbol),
      (ticker) => {
        this.tickerSnapshot = ticker;
        this.tickerLastAt = this.now();
        if (!this.feedArrived.ticker) {
          this.feedArrived.ticker = true;
          this.log("info", t("log.ticker.ready"));
        }
        this.feedStatus.ticker = true;
        void this.attemptInit();
        this.emitUpdate();
      },
      this.log,
      {
        subscribeFail: (error) => t("log.subscribe.tickerFail", { error: extractMessage(error) }),
        processFail: (error) => t("log.process.tickerError", { error: extractMessage(error) }),
      }
    );
  }

  private setupConnectionProtection(): void {
    if (!this.exchange.onConnectionEvent) return;
    this.exchange.onConnectionEvent((event, symbol) => {
      if (event === "disconnected") {
        this.frozen = true;
        this.log("warn", t("log.gridEngine.wsDisconnected", { symbol }));
      } else if (event === "reconnected") {
        this.frozen = false;
        this.restReconcilePending = true;
        this.log("info", t("log.gridEngine.wsReconnected", { symbol }));
      }
      this.emitUpdate();
    });
  }

  private synchronizeLocks(orders: Order[] | null | undefined): void {
    const list = Array.isArray(orders) ? orders : [];
    Object.keys(this.pendings).forEach((type) => {
      const pendingId = this.pendings[type];
      if (!pendingId) return;
      const match = list.find((order) => String(order.orderId) === pendingId);
      if (!match) {
        unlockOperating(this.locks, this.timers, this.pendings, type);
        return;
      }
      const status = String(match.status || "").toUpperCase();
      if (FINAL_STATUSES.has(status)) {
        unlockOperating(this.locks, this.timers, this.pendings, type);
      }
    });
  }

  // -----------------------------------------------------------------------
  // Order helpers
  // -----------------------------------------------------------------------

  private isExchangeStopOrder(order: Order): boolean {
    if (order.symbol !== this.config.symbol) return false;
    const type = String(order.type || "").toUpperCase();
    if (type.includes("STOP")) return true;
    const stopPrice = Number(order.stopPrice);
    return Number.isFinite(stopPrice) && stopPrice > 0;
  }

  private isActiveGridLimitOrder(order: Order): boolean {
    if (order.symbol !== this.config.symbol) return false;
    if (order.type !== "LIMIT") return false;
    if (this.isExchangeStopOrder(order)) return false;
    if (this.state?.exchangeStop && String(order.orderId) === this.state.exchangeStop.orderId) {
      return false;
    }
    const status = String(order.status || "").toUpperCase();
    return !FINAL_STATUSES.has(status);
  }

  private activeGridLimitOrders(source?: Order[]): Order[] {
    return (source ?? this.openOrders).filter((order) => this.isActiveGridLimitOrder(order));
  }

  private toOrderView(order: Order): OrderView {
    return {
      orderId: String(order.orderId),
      clientOrderId: order.clientOrderId || undefined,
      side: order.side,
      price: Number(order.price),
      status: String(order.status || ""),
      executedQty: Number(order.executedQty || 0),
      origQty: Number(order.origQty || 0),
      type: String(order.type || ""),
    };
  }

  private symbolOrderViews(source?: Order[]): OrderView[] {
    return (source ?? this.openOrders)
      .filter((order) => order.symbol === this.config.symbol && !this.isExchangeStopOrder(order))
      .map((order) => this.toOrderView(order));
  }

  private getReferencePrice(): number | null {
    return getMidOrLast(this.depthSnapshot, this.tickerSnapshot);
  }

  private isReady(): boolean {
    return this.feedStatus.account && this.feedStatus.orders && this.feedStatus.ticker;
  }

  // -----------------------------------------------------------------------
  // 初始化：磁盘恢复 + 启动对账
  // -----------------------------------------------------------------------

  private async attemptInit(): Promise<void> {
    if (this.state || this.initStarted || !this.configValid) return;
    if (!this.feedStatus.orders || !this.feedStatus.account) return;
    const price = this.getReferencePrice();
    if (price == null || !Number.isFinite(price)) return;
    this.initStarted = true;
    try {
      let stored = null;
      if (!this.skipPersistence) {
        try {
          stored = await loadGridState(this.config.symbol);
        } catch (err) {
          this.log("error", t("log.gridEngine.loadStateFailed", { error: extractMessage(err) }));
        }
      }
      const meta = this.stateMeta();
      if (stored && isCompatibleStoredState(stored, meta)) {
        this.state = fromStored(stored, this.logicSettings(), price);
        this.log(
          "info",
          t("log.gridEngine.stateRestored", {
            gridVersion: this.state.gridVersion,
            anchor: this.state.anchorPrice,
            lower: this.state.lowerPrice,
            upper: this.state.upperPrice,
            shift: this.state.shift
              ? t("log.gridEngine.stateRestoredShift", { phase: this.state.shift.phase })
              : "",
          })
        );
      } else {
        if (stored) {
          this.log("warn", t("log.gridEngine.fingerprintMismatch"));
        }
        this.state = createInitialState(this.logicSettings(), price);
        this.log("info", t("log.gridEngine.gridCreated", { anchor: this.state.anchorPrice, mode: this.tradeMode }));
      }
      await this.applyReconcile(this.openOrders, "startup");
      this.initDone = true;
    } catch (err) {
      this.log("error", t("log.gridEngine.initFailed", { error: extractMessage(err) }));
      this.initStarted = false;
    }
    this.emitUpdate();
  }

  // -----------------------------------------------------------------------
  // 对账（重启 / 重连 / 周期 REST）
  // -----------------------------------------------------------------------

  private async applyReconcile(orders: Order[], source: string): Promise<void> {
    const state = this.state;
    if (!state) return;
    const result = reconcile(state, this.logicSettings(), {
      activeOrders: this.activeGridLimitOrders(orders).map((o) => this.toOrderView(o)),
      positionAmt: this.position.positionAmt,
      price: this.getReferencePrice(),
      now: this.now(),
    });
    for (const event of result.events) {
      this.log("info", t("log.gridEngine.reconcileEvent", { source, event }));
    }
    if (result.cancelOrderIds.length > 0) {
      try {
        await this.exchange.cancelOrders({
          symbol: this.config.symbol,
          orderIdList: result.cancelOrderIds,
        });
        this.log("order", t("log.gridEngine.reconcileCancelled", { source, count: result.cancelOrderIds.length }));
      } catch (err) {
        if (!isUnknownOrderError(err)) {
          this.log("error", t("log.gridEngine.reconcileCancelFailed", { source, error: extractMessage(err) }));
        }
      }
    }
    this.lastReconcileAt = this.now();
    await this.persistNow();
  }

  private async runRestReconcile(source: string): Promise<void> {
    if (!this.state) return;
    let orders: Order[] | null = null;
    if (this.exchange.queryOpenOrders) {
      try {
        const fetched = await this.exchange.queryOpenOrders();
        orders = fetched.filter((order) => order.symbol === this.config.symbol);
      } catch (err) {
        this.log("error", t("log.gridEngine.reconcileOrdersFailed", { source, error: extractMessage(err) }));
      }
    }
    if (this.exchange.queryAccountSnapshot) {
      try {
        const snapshot = await this.exchange.queryAccountSnapshot();
        if (snapshot) {
          this.position = getPosition(snapshot, this.config.symbol);
          this.accountVersion += 1;
        }
      } catch (err) {
        this.log("error", t("log.gridEngine.reconcileAccountFailed", { source, error: extractMessage(err) }));
      }
    }
    if (orders) {
      this.openOrders = orders;
      this.ordersVersion += 1;
      this.ordersFeedLastAt = this.now();
    }
    await this.applyReconcile(orders ?? this.openOrders, source);
  }

  // -----------------------------------------------------------------------
  // Tick loop
  // -----------------------------------------------------------------------

  private async tick(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      if (!this.running) {
        await this.tryRestart();
        return;
      }
      if (!this.isReady()) return;
      if (!this.initDone) {
        await this.attemptInit();
        if (!this.initDone) return;
      }
      if (!this.state) return;
      if (this.frozen) return;

      if (this.restReconcilePending) {
        this.restReconcilePending = false;
        await this.runRestReconcile("reconnect");
      } else if (
        this.exchange.queryOpenOrders &&
        this.now() - this.lastReconcileAt >= this.config.reconcileIntervalMs
      ) {
        await this.runRestReconcile("periodic");
      }

      const price = this.getReferencePrice();
      if (price == null || !Number.isFinite(price)) return;

      if (this.state.shift) {
        await this.runShiftStep(price);
        return;
      }

      const input = {
        now: this.now(),
        price,
        positionAmt: this.position.positionAmt,
        entryPrice: Number(this.position.entryPrice) || 0,
        accountVersion: this.accountVersion,
        activeOrders: this.activeGridLimitOrders().map((o) => this.toOrderView(o)),
        allOrders: this.symbolOrderViews(),
      };
      const plan = planTick(this.state, this.logicSettings(), input);
      for (const event of plan.events) {
        this.log("info", event);
      }
      this.uncoveredQty = plan.uncoveredQty;
      this.desiredOrders = plan.actions
        .filter((a): a is Extract<GridPlanAction, { kind: "PLACE_ENTRY" | "PLACE_EXIT" }> =>
          a.kind === "PLACE_ENTRY" || a.kind === "PLACE_EXIT"
        )
        .map((a) =>
          a.kind === "PLACE_ENTRY"
            ? { level: a.level, side: a.side, price: a.price, amount: a.qty, intent: "ENTRY" as const }
            : { level: a.target ?? ORPHAN_LEVEL, side: a.side, price: a.price, amount: a.qty, intent: "EXIT" as const }
        );

      await this.executeActions(plan.actions);
      // halt / 移格启动后不再执行后续挂单与持久化（halt 已清盘）
      if (!this.state || !this.running || this.state.shift) return;

      await this.syncExchangeStop(price);

      this.lastUpdated = this.now();
      if (plan.stateChanged) {
        this.schedulePersist();
      }
    } catch (error) {
      this.log("error", t("log.gridEngine.tickFailed", { error: extractMessage(error) }));
    } finally {
      this.processing = false;
      this.emitUpdate();
    }
  }

  private async executeActions(actions: GridPlanAction[]): Promise<void> {
    let limitPlaced = false;
    for (const action of actions) {
      if (action.kind === "HALT") {
        await this.haltGrid(action.reason);
        return;
      }
      if (action.kind === "BEGIN_SHIFT") {
        // 移格标记已由 planTick 写入 state，落盘后由下个 tick 开始执行
        this.log("warn", t("log.gridEngine.shiftStarting", { anchor: action.targetAnchor }));
        await this.persistNow();
        return;
      }
      if (action.kind === "MARKET_CLOSE") {
        await this.guardedMarketClose(action.side, action.qty, action.reason);
        continue;
      }
      // PLACE_ENTRY / PLACE_EXIT：每 tick 最多 1 单
      if (limitPlaced) continue;
      if (!this.canPlaceLimitNow()) continue;
      const placed = await this.placeGridOrder(action);
      if (placed) limitPlaced = true;
    }
  }

  private canPlaceLimitNow(): boolean {
    if (this.pendings["LIMIT"]) return false;
    const now = this.now();
    const snapshotStale = this.lastPlacementOrdersVersion === this.ordersVersion;
    const inCooldown = now - this.lastLimitAttemptAt < GridEngine.LIMIT_COOLDOWN_MS;
    if (snapshotStale && inCooldown) return false;
    // 陈旧性守卫：下过单但订单流一直没有反映，且行情仍在推送 → 冻结新下单
    if (
      this.lastPlacementAt > 0 &&
      this.ordersFeedLastAt < this.lastPlacementAt &&
      now - this.lastPlacementAt > GridEngine.STALE_PLACEMENT_MS &&
      this.tickerLastAt > now - 10_000
    ) {
      if (now - this.lastStalenessLogAt > 30_000) {
        this.lastStalenessLogAt = now;
        this.log("warn", t("log.gridEngine.orderFeedStalled"));
      }
      return false;
    }
    return true;
  }

  private async placeGridOrder(
    action: Extract<GridPlanAction, { kind: "PLACE_ENTRY" | "PLACE_EXIT" }>
  ): Promise<boolean> {
    const state = this.state;
    if (!state) return false;
    const now = this.now();
    const isEntry = action.kind === "PLACE_ENTRY";
    const level = isEntry ? action.level : action.source;
    const target = isEntry ? undefined : action.target ?? undefined;
    const clientOrderId = isEntry
      ? makeEntryClientOrderId(state.gridVersion, action.level, now)
      : makeExitClientOrderId(state.gridVersion, Math.max(action.source, 0), Math.max(action.target ?? 0, 0), now);

    // write-ahead：先落 inflight 槽位再下单，消灭“交易所已接单本地未登记”的窗口
    state.inflight = {
      clientOrderId,
      intent: isEntry ? "ENTRY" : "EXIT",
      side: action.side,
      price: action.price,
      qty: action.qty,
      level,
      gridVersion: state.gridVersion,
      createdAt: now,
    };
    if (target != null) state.inflight.target = target;
    await this.persistNow();

    let placed: Order | undefined;
    const ordersVersionBeforePlace = this.ordersVersion;
    try {
      this.lastLimitAttemptAt = now;
      placed = await placeOrder(this.orderContext, {
        openOrders: this.openOrders,
        side: action.side,
        price: action.price,
        amount: action.qty,
        reduceOnly: isEntry ? false : this.config.useReduceOnlyForExit,
        qtyStep: this.config.qtyStep,
        skipDedupe: true,
        clientOrderId,
      });
    } catch (error) {
      this.log("error", t("log.gridEngine.placeFailed", { side: action.side, price: action.price, error: extractMessage(error) }));
    }
    state.inflight = null;

    if (placed?.orderId != null) {
      const orderId = String(placed.orderId);
      const record: OrderIntentRecord = {
        orderId,
        clientOrderId,
        intent: isEntry ? "ENTRY" : "EXIT",
        side: action.side,
        price: action.price,
        qty: action.qty,
        level,
        gridVersion: state.gridVersion,
        createdAt: now,
      };
      if (target != null) record.target = target;
      state.intents.set(orderId, record);
      const levelRuntime = state.levels[level];
      if (levelRuntime) {
        if (isEntry) {
          levelRuntime.phase = "entry_placed";
          levelRuntime.entryOrderId = orderId;
        } else {
          levelRuntime.phase = "exit_placed";
          levelRuntime.exitOrderId = orderId;
        }
      }
      this.lastPlacementAt = now;
      this.lastPlacementOrdersVersion = ordersVersionBeforePlace;
      await this.persistNow();
      return true;
    }
    await this.persistNow();
    return false;
  }

  /** 市价平仓 + maxCloseSlippagePct 滑点守卫 */
  private async guardedMarketClose(side: Side, qty: number, reason: string): Promise<boolean> {
    const eps = qtyEpsilon(this.config);
    if (qty <= eps) return true;
    const mark = this.position.markPrice;
    const depthBid = Number(this.depthSnapshot?.bids?.[0]?.[0]);
    const depthAsk = Number(this.depthSnapshot?.asks?.[0]?.[0]);
    const closeSidePrice = side === "SELL" ? depthBid : depthAsk;
    const limitPct = this.config.maxCloseSlippagePct;
    if (
      mark != null &&
      Number.isFinite(mark) &&
      mark > 0 &&
      Number.isFinite(closeSidePrice) &&
      limitPct > 0
    ) {
      const pctDiff = Math.abs(closeSidePrice - mark) / mark;
      if (pctDiff > limitPct) {
        this.log(
          "warn",
          t("log.gridEngine.closeSlippageBlocked", {
            reason,
            close: closeSidePrice,
            mark,
            pct: (pctDiff * 100).toFixed(2),
            limit: (limitPct * 100).toFixed(2),
          })
        );
        return false;
      }
    }
    try {
      await marketClose(this.orderContext, {
        openOrders: this.openOrders,
        side: side,
        quantity: qty,
        guard: {
          markPrice: mark,
          expectedPrice: Number.isFinite(closeSidePrice) ? closeSidePrice : null,
          maxPct: limitPct > 0 ? limitPct : undefined,
        },
        qtyStep: this.config.qtyStep
      });
      this.log("close", t("log.gridEngine.closed", { side, qty, reason }));
      return true;
    } catch (error) {
      this.log("error", t("log.gridEngine.closeFailed", { reason, error: extractMessage(error) }));
      return false;
    } finally {
      unlockOperating(this.locks, this.timers, this.pendings, "MARKET");
    }
  }

  // -----------------------------------------------------------------------
  // 智能移格：cancelling → closing → rebuilding，每步幂等、phase 持久化
  // -----------------------------------------------------------------------

  private async runShiftStep(price: number): Promise<void> {
    const state = this.state;
    if (!state?.shift) return;
    const step = planShiftStep(state, this.logicSettings(), {
      activeOrderCount:
        this.activeGridLimitOrders().length + (this.findLiveExchangeStop() ? 1 : 0),
      positionAmt: this.position.positionAmt,
      price,
    });
    if (step.kind === "CANCEL_ALL") {
      try {
        await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
        state.exchangeStop = null;
        this.log("order", t("log.gridEngine.shiftCancelRequested"));
      } catch (err) {
        this.log("error", t("log.gridEngine.shiftCancelFailed", { error: extractMessage(err) }));
      }
    } else if (step.kind === "CLOSE_POSITION") {
      // 平仓单已提交但仓位回报未到时不重复提交
      const awaitingFill =
        this.shiftCloseAccountVersion === this.accountVersion &&
        this.now() - this.shiftCloseAt < 10_000;
      if (!awaitingFill) {
        const done = await this.guardedMarketClose(step.side, step.qty, t("log.gridEngine.shiftCloseReason"));
        if (done) {
          this.shiftCloseAccountVersion = this.accountVersion;
          this.shiftCloseAt = this.now();
        } else {
          this.log("info", t("log.gridEngine.shiftCloseDeferred"));
        }
      }
    } else if (step.kind === "REBUILD") {
      applyRebuild(state, this.logicSettings(), step.anchor);
      this.log(
        "info",
        t("log.gridEngine.shiftDone", {
          anchor: step.anchor,
          lower: state.lowerPrice.toFixed(4),
          upper: state.upperPrice.toFixed(4),
          gridVersion: state.gridVersion,
        })
      );
    }
    this.lastUpdated = this.now();
    await this.persistNow();
  }

  // -----------------------------------------------------------------------
  // 止损层④：交易所侧 STOP_MARKET 兜底
  // -----------------------------------------------------------------------

  private findLiveExchangeStop(): Order | null {
    const state = this.state;
    if (!state?.exchangeStop) return null;
    const match = this.openOrders.find(
      (order) =>
        String(order.orderId) === state.exchangeStop!.orderId &&
        !FINAL_STATUSES.has(String(order.status || "").toUpperCase())
    );
    return match ?? null;
  }

  private async syncExchangeStop(price: number): Promise<void> {
    const state = this.state;
    if (!state) return;
    if (!this.config.exchangeStopEnabled) return;
    if (!(this.exchange.supportsTriggerOrders?.() ?? false)) return;
    const now = this.now();
    if (now - this.lastStopSyncAt < GridEngine.STOP_SYNC_INTERVAL_MS) return;

    const desired = desiredExchangeStop(state, this.logicSettings(), this.position.positionAmt);
    const existing = state.exchangeStop;
    const live = this.findLiveExchangeStop();

    if (!desired) {
      if (existing) {
        this.lastStopSyncAt = now;
        if (live) {
          try {
            await this.exchange.cancelOrder({ symbol: this.config.symbol, orderId: existing.orderId });
            this.log("order", t("log.gridEngine.stopCancelledFlat"));
          } catch (err) {
            if (!isUnknownOrderError(err)) {
              this.log("error", t("log.gridEngine.stopCancelFailed", { error: extractMessage(err) }));
            }
          }
        }
        state.exchangeStop = null;
        this.schedulePersist();
      }
      return;
    }

    const sideChanged = existing != null && existing.side !== desired.side;
    const priceMoved =
      existing != null && Math.abs(existing.stopPrice - desired.stopPrice) > this.config.priceTick;
    const liveMissing =
      existing != null && live == null && now - this.stopPlacedAt > 15_000;
    if (existing && live && !sideChanged && !priceMoved) return;
    if (existing && !live && !liveMissing) return;

    this.lastStopSyncAt = now;
    if (existing && live) {
      try {
        await this.exchange.cancelOrder({ symbol: this.config.symbol, orderId: existing.orderId });
      } catch (err) {
        if (!isUnknownOrderError(err)) {
          this.log("error", t("log.gridEngine.stopCancelStaleFailed", { error: extractMessage(err) }));
          return;
        }
      }
    }
    state.exchangeStop = null;

    const lastPrice = Number(this.tickerSnapshot?.lastPrice);
    try {
      const placed = await placeStopLossOrder(this.orderContext, {
        openOrders: this.openOrders,
        side: desired.side,
        stopPrice: desired.stopPrice,
        quantity: Math.abs(this.position.positionAmt),
        lastPrice: Number.isFinite(lastPrice) ? lastPrice : price,
        guard: undefined,
        priceTick: this.config.priceTick,
        qtyStep: this.config.qtyStep
      });
      if (placed?.orderId != null) {
        state.exchangeStop = {
          orderId: String(placed.orderId),
          side: desired.side,
          stopPrice: desired.stopPrice,
        };
        this.stopPlacedAt = now;
        this.schedulePersist();
      }
    } catch (err) {
      this.log("error", t("log.gridEngine.stopPlaceFailed", { error: extractMessage(err) }));
    }
  }

  // -----------------------------------------------------------------------
  // 止损层①执行 / 重启
  // -----------------------------------------------------------------------

  private async haltGrid(reason: string): Promise<void> {
    const state = this.state;
    this.stopReason = reason;
    this.log("warn", t("log.gridEngine.haltStarting", { reason }));
    try {
      await this.exchange.cancelAllOrders({ symbol: this.config.symbol });
      this.log("order", t("log.gridEngine.allCancelled"));
    } catch (error) {
      this.log("error", t("log.gridEngine.cancelAllFailed", { error: extractMessage(error) }));
    }
    if (state) state.exchangeStop = null;
    const qty = this.position.positionAmt;
    if (Math.abs(qty) > EPSILON) {
      const closed = await this.guardedMarketClose(qty > 0 ? "SELL" : "BUY", Math.abs(qty), reason);
      if (!closed) {
        // 滑点守卫暂缓：保持 running，下个 tick 重新触发层①重试
        this.log("warn", t("log.gridEngine.stopCloseDeferred"));
        return;
      }
    }
    this.running = false;
    this.lastUpdated = this.now();
    if (state) {
      for (const level of state.levels) {
        level.phase = "idle";
        level.holdQty = 0;
        delete level.entryOrderId;
        delete level.exitOrderId;
      }
      state.intents.clear();
      state.awaiting.clear();
      state.inflight = null;
      state.shift = null;
      state.prevActiveIds = new Set();
      state.seenOrderIds = new Set();
      state.uncoveredSince = null;
      state.shiftCandidateSince = null;
    }
    this.desiredOrders = [];
    this.uncoveredQty = 0;
    if (!this.skipPersistence) {
      try {
        await clearGridState(this.config.symbol);
      } catch {
        // ignore
      }
    }
    if (!this.config.autoRestart) {
      this.stop();
    }
  }

  private async tryRestart(): Promise<void> {
    if (!this.config.autoRestart || !this.configValid) return;
    if (!this.isReady()) return;
    if (this.config.restartTriggerPct <= 0) return;
    const price = this.getReferencePrice();
    if (price == null || !Number.isFinite(price)) return;
    const lower = this.state?.lowerPrice ?? this.config.lowerPrice;
    const upper = this.state?.upperPrice ?? this.config.upperPrice;
    const lowerGuard = lower * (1 + this.config.restartTriggerPct);
    const upperGuard = upper * (1 - this.config.restartTriggerPct);
    if (price < lowerGuard || price > upperGuard) return;
    const nextVersion = (this.state?.gridVersion ?? 0) + 1;
    const settings = { ...this.logicSettings(), lowerPrice: lower, upperPrice: upper };
    this.state = createInitialState(settings, price, nextVersion);
    this.running = true;
    this.stopReason = null;
    this.initDone = true;
    this.log("info", t("log.gridEngine.resumed", { gridVersion: nextVersion }));
    await this.persistNow();
    this.start();
  }

  // -----------------------------------------------------------------------
  // Persistence
  // -----------------------------------------------------------------------

  private schedulePersist(): void {
    if (this.skipPersistence) return;
    if (this.savePending) return;
    this.savePending = true;
    setTimeout(() => {
      this.savePending = false;
      void this.persistNow();
    }, 500);
  }

  private async persistNow(): Promise<void> {
    if (this.skipPersistence) return;
    const state = this.state;
    if (!state) return;
    try {
      await saveGridState(toStored(state, this.stateMeta(), this.now()));
    } catch (err) {
      this.log("error", t("log.gridEngine.saveStateFailed", { error: extractMessage(err) }));
    }
  }

  // -----------------------------------------------------------------------
  // Snapshot
  // -----------------------------------------------------------------------

  private buildSnapshot(): GridEngineSnapshot {
    const reference = this.getReferencePrice();
    const tickerLast = Number(this.tickerSnapshot?.lastPrice);
    const lastPrice = Number.isFinite(tickerLast) ? tickerLast : reference;
    const state = this.state;
    const activeIds = new Set(this.activeGridLimitOrders().map((order) => String(order.orderId)));

    const gridLines: GridLineSnapshot[] = (state?.levels ?? []).map((level) => ({
      level: level.index,
      price: level.price,
      side: level.entrySide ?? "-",
      role:
        level.entrySide === "BUY" ? "entry-buy" : level.entrySide === "SELL" ? "entry-sell" : "none",
      state: level.phase,
      hasOrder:
        (level.entryOrderId != null && activeIds.has(level.entryOrderId)) ||
        (level.exitOrderId != null && activeIds.has(level.exitOrderId)),
      holdQty: level.holdQty,
    }));

    return {
      ready: this.isReady() && this.running && this.state != null,
      symbol: this.config.symbol,
      lowerPrice: state?.lowerPrice ?? this.config.lowerPrice,
      upperPrice: state?.upperPrice ?? this.config.upperPrice,
      gridVersion: state?.gridVersion ?? 0,
      anchorPrice: state?.anchorPrice ?? null,
      shiftPhase: state?.shift?.phase ?? null,
      lastPrice,
      midPrice: reference,
      gridLines,
      desiredOrders: this.desiredOrders.slice(),
      openOrders: this.activeGridLimitOrders(),
      position: this.position,
      running: this.running,
      stopReason: this.running ? null : this.stopReason,
      direction: this.config.direction,
      stopProtection: {
        uncoveredQty: this.uncoveredQty,
        exchangeStop: state?.exchangeStop ?? null,
      },
      tradeLog: this.tradeLog.all().slice(),
      feedStatus: { ...this.feedStatus },
      lastUpdated: this.lastUpdated,
    };
  }

  private emitUpdate(): void {
    this.events.emit("update", this.buildSnapshot());
  }
}
