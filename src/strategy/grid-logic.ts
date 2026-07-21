// 网格纯逻辑：无 I/O、无 Date.now、无 adapter 引用。所有时间通过参数传入。
// 引擎每 tick 调 planTick(state, settings, input) 得到 actions，由引擎负责执行。

export type Side = "BUY" | "SELL";
export type GridTradeMode = "long" | "short" | "neutral";
export type LevelPhase = "idle" | "entry_placed" | "holding" | "exit_placed";
export type OrderIntentKind = "ENTRY" | "EXIT";
export type ShiftPhase = "cancelling" | "closing" | "rebuilding";

/** EXIT intent 的 level 为该值时表示孤儿平仓单（不属于任何网格线） */
export const ORPHAN_LEVEL = -1;

const PRICE_EPS = 1e-8;
const AWAITING_TIMEOUT_MS = 8_000;
/** 下单成功但订单流从未出现该订单的判定超时 */
const NEVER_SEEN_TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Settings / State / Input
// ---------------------------------------------------------------------------

export interface GridLogicSettings {
  direction: GridTradeMode;
  lowerPrice: number;
  upperPrice: number;
  gridLevels: number;
  orderSize: number;
  maxPositionSize: number;
  priceTick: number;
  qtyStep: number;
  stopLossPct: number;
  uncoveredGraceMs: number;
  shiftEnabled: boolean;
  shiftTriggerPct: number;
  shiftRangePct: number;
  shiftConfirmMs: number;
}

export interface OrderIntentRecord {
  orderId: string;
  clientOrderId?: string;
  intent: OrderIntentKind;
  side: Side;
  price: string;
  qty: number;
  /** ENTRY: 开仓线；EXIT: 源线（ORPHAN_LEVEL 表示孤儿平仓） */
  level: number;
  /** EXIT: 目标线 */
  target?: number;
  gridVersion: number;
  createdAt: number;
}

export interface LevelRuntime {
  index: number;
  price: number;
  /** null = 该线不开仓（long 顶线 / short 底线 / neutral 边界外） */
  entrySide: Side | null;
  /** 平仓目标 = 相邻线 */
  exitTarget: number | null;
  phase: LevelPhase;
  entryOrderId?: string;
  exitOrderId?: string;
  holdQty: number;
}

export interface AwaitingInfo {
  intent: OrderIntentKind;
  level: number;
  side: Side;
  qty: number;
  posAtStart: number;
  accountVersionAtStart: number;
  ts: number;
}

export interface InflightRecord {
  clientOrderId: string;
  intent: OrderIntentKind;
  side: Side;
  price: string;
  qty: number;
  level: number;
  target?: number;
  gridVersion: number;
  createdAt: number;
}

export interface ExchangeStopState {
  orderId: string;
  side: Side;
  stopPrice: number;
}

export interface GridLogicState {
  gridVersion: number;
  anchorPrice: number;
  lowerPrice: number;
  upperPrice: number;
  levels: LevelRuntime[];
  intents: Map<string, OrderIntentRecord>;
  awaiting: Map<number, AwaitingInfo>;
  inflight: InflightRecord | null;
  shift: { phase: ShiftPhase; targetAnchor: number; startedAt: number } | null;
  exchangeStop: ExchangeStopState | null;
  /** 运行时字段（不持久化） */
  prevActiveIds: Set<string>;
  seenOrderIds: Set<string>;
  shiftCandidateSince: number | null;
  uncoveredSince: number | null;
}

export interface OrderView {
  orderId: string;
  clientOrderId?: string;
  side: Side;
  price: number;
  status: string;
  executedQty: number;
  origQty: number;
  type: string;
}

export interface GridTickInput {
  now: number;
  price: number;
  positionAmt: number;
  entryPrice: number;
  accountVersion: number;
  /** 本 symbol 的活跃限价单（不含交易所兜底止损单） */
  activeOrders: OrderView[];
  /** 本 symbol 的全部订单快照（含终态，用于消失分类） */
  allOrders: OrderView[];
}

export type GridPlanAction =
  | { kind: "PLACE_ENTRY"; level: number; side: Side; price: string; qty: number }
  | {
      kind: "PLACE_EXIT";
      source: number;
      target: number | null;
      side: Side;
      price: string;
      qty: number;
    }
  | { kind: "MARKET_CLOSE"; side: Side; qty: number; reason: string }
  | { kind: "HALT"; reason: string }
  | { kind: "BEGIN_SHIFT"; targetAnchor: number };

export interface GridPlanResult {
  actions: GridPlanAction[];
  events: string[];
  stateChanged: boolean;
  /** 层②审计得到的未覆盖仓位（供快照展示） */
  uncoveredQty: number;
}

// ---------------------------------------------------------------------------
// 持久化 schema（v2）。文件读写在 grid-storage.ts。
// ---------------------------------------------------------------------------

export interface StoredLevelV2 {
  phase: LevelPhase;
  entryOrderId?: string;
  exitOrderId?: string;
  exitTarget?: number | null;
  holdQty: number;
}

export interface StoredGridStateV2 {
  schemaVersion: 2;
  symbol: string;
  exchangeId: string;
  gridVersion: number;
  /** null = v1 迁移而来，无锚定价，首个行情价补齐 */
  anchorPrice: number | null;
  lowerPrice: number;
  upperPrice: number;
  gridLevels: number;
  orderSize: number;
  maxPositionSize: number;
  direction: string;
  gridMode: string;
  levels: Record<string, StoredLevelV2>;
  intents: OrderIntentRecord[];
  inflight?: InflightRecord | null;
  shift?: { phase: ShiftPhase; targetAnchor: number; startedAt: number } | null;
  exchangeStop?: ExchangeStopState | null;
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// 基础工具
// ---------------------------------------------------------------------------

export function qtyEpsilon(settings: Pick<GridLogicSettings, "qtyStep">): number {
  return Math.max(settings.qtyStep / 2, 1e-9);
}

function priceDecimalsOf(tick: number): number {
  if (!Number.isFinite(tick) || tick <= 0) return 2;
  const text = tick.toString();
  if (text.includes("e") || text.includes("E")) {
    const abs = Math.abs(Math.log10(tick));
    return Math.min(Math.ceil(abs), 12);
  }
  const dot = text.indexOf(".");
  return dot < 0 ? 0 : text.length - dot - 1;
}

export function formatPrice(price: number, priceTick: number): string {
  if (!Number.isFinite(price)) return "0";
  return price.toFixed(priceDecimalsOf(priceTick));
}

export function computeLevelPrices(
  lowerPrice: number,
  upperPrice: number,
  count: number,
  priceTick: number
): number[] {
  if (!(lowerPrice > 0) || !(upperPrice > lowerPrice) || !Number.isFinite(count) || count < 2) {
    return [];
  }
  const decimals = priceDecimalsOf(priceTick);
  const ratio = Math.pow(upperPrice / lowerPrice, 1 / (count - 1));
  const levels: number[] = [];
  for (let i = 0; i < count; i += 1) {
    levels.push(Number((lowerPrice * Math.pow(ratio, i)).toFixed(decimals)));
  }
  levels[0] = Number(lowerPrice.toFixed(decimals));
  levels[levels.length - 1] = Number(upperPrice.toFixed(decimals));
  return levels;
}

export interface LevelRole {
  entrySide: Side | null;
  exitTarget: number | null;
}

/** 三模式角色分配：平仓目标恒为相邻线 */
export function assignRoles(
  prices: number[],
  direction: GridTradeMode,
  anchorPrice: number
): LevelRole[] {
  return prices.map((price, i) => {
    const hasUp = i + 1 < prices.length;
    const hasDown = i > 0;
    if (direction === "long") {
      return hasUp
        ? { entrySide: "BUY" as Side, exitTarget: i + 1 }
        : { entrySide: null, exitTarget: null };
    }
    if (direction === "short") {
      return hasDown
        ? { entrySide: "SELL" as Side, exitTarget: i - 1 }
        : { entrySide: null, exitTarget: null };
    }
    // neutral：锚定价下方（含）挂多、上方挂空
    if (price <= anchorPrice + PRICE_EPS) {
      return hasUp
        ? { entrySide: "BUY" as Side, exitTarget: i + 1 }
        : { entrySide: null, exitTarget: null };
    }
    return hasDown
      ? { entrySide: "SELL" as Side, exitTarget: i - 1 }
      : { entrySide: null, exitTarget: null };
  });
}

function buildLevels(
  prices: number[],
  direction: GridTradeMode,
  anchorPrice: number
): LevelRuntime[] {
  const roles = assignRoles(prices, direction, anchorPrice);
  return prices.map((price, index) => ({
    index,
    price,
    entrySide: roles[index]!.entrySide,
    exitTarget: roles[index]!.exitTarget,
    phase: "idle" as LevelPhase,
    holdQty: 0,
  }));
}

export function clampPrice(price: number, lowerPrice: number, upperPrice: number): number {
  return Math.min(Math.max(price, lowerPrice), upperPrice);
}

export function createInitialState(
  settings: GridLogicSettings,
  anchorPrice: number,
  gridVersion = 1
): GridLogicState {
  const anchor = clampPrice(anchorPrice, settings.lowerPrice, settings.upperPrice);
  const prices = computeLevelPrices(
    settings.lowerPrice,
    settings.upperPrice,
    settings.gridLevels,
    settings.priceTick
  );
  return {
    gridVersion,
    anchorPrice: anchor,
    lowerPrice: settings.lowerPrice,
    upperPrice: settings.upperPrice,
    levels: buildLevels(prices, settings.direction, anchor),
    intents: new Map(),
    awaiting: new Map(),
    inflight: null,
    shift: null,
    exchangeStop: null,
    prevActiveIds: new Set(),
    seenOrderIds: new Set(),
    shiftCandidateSince: null,
    uncoveredSince: null,
  };
}

// ---------------------------------------------------------------------------
// clientOrderId 编解码（gridVersion 用于识别移格后旧格残留单）
// ---------------------------------------------------------------------------

const CID_PREFIX = "grid";

export function makeEntryClientOrderId(gridVersion: number, level: number, now: number): string {
  return `${CID_PREFIX}-${gridVersion}-E-${level}-${now.toString(16)}`;
}

export function makeExitClientOrderId(
  gridVersion: number,
  source: number,
  target: number,
  now: number
): string {
  return `${CID_PREFIX}-${gridVersion}-X-${source}-${target}-${now.toString(16)}`;
}

export interface ParsedClientOrderId {
  intent: OrderIntentKind;
  /** null = 旧版编码（无 gridVersion） */
  gridVersion: number | null;
  level: number;
  target?: number;
}

export function parseClientOrderId(cid: string | undefined | null): ParsedClientOrderId | null {
  if (!cid || !cid.startsWith(`${CID_PREFIX}-`)) return null;
  const parts = cid.split("-");
  // 新版：grid-{v}-E-{level}-{ts} / grid-{v}-X-{src}-{tgt}-{ts}
  const version = Number(parts[1]);
  if (Number.isFinite(version) && (parts[2] === "E" || parts[2] === "X")) {
    if (parts[2] === "E" && parts.length >= 4) {
      const level = Number(parts[3]);
      if (!Number.isFinite(level)) return null;
      return { intent: "ENTRY", gridVersion: version, level };
    }
    if (parts[2] === "X" && parts.length >= 5) {
      const source = Number(parts[3]);
      const target = Number(parts[4]);
      if (!Number.isFinite(source) || !Number.isFinite(target)) return null;
      return { intent: "EXIT", gridVersion: version, level: source, target };
    }
    return null;
  }
  // 旧版：grid-E-{level}-{ts} / grid-X-{src}-{tgt}-{ts}
  if (parts[1] === "E" && parts.length >= 3) {
    const level = Number(parts[2]);
    if (!Number.isFinite(level)) return null;
    return { intent: "ENTRY", gridVersion: null, level };
  }
  if (parts[1] === "X" && parts.length >= 4) {
    const source = Number(parts[2]);
    const target = Number(parts[3]);
    if (!Number.isFinite(source) || !Number.isFinite(target)) return null;
    return { intent: "EXIT", gridVersion: null, level: source, target };
  }
  return null;
}

// ---------------------------------------------------------------------------
// 订单消失分类 + awaiting 裁决
// ---------------------------------------------------------------------------

const FINAL_CANCEL_STATUSES = new Set(["CANCELED", "CANCELLED", "EXPIRED", "REJECTED"]);

export type DisappearClass = "filled" | "canceled" | "unknown";

export function classifyDisappearance(record: OrderView | undefined): {
  cls: DisappearClass;
  executedQty: number;
} {
  if (!record) return { cls: "unknown", executedQty: 0 };
  const status = String(record.status || "").toUpperCase();
  const executed = Number(record.executedQty || 0);
  if (status === "FILLED" || executed > PRICE_EPS) {
    return { cls: "filled", executedQty: executed };
  }
  if (FINAL_CANCEL_STATUSES.has(status)) {
    return { cls: "canceled", executedQty: 0 };
  }
  return { cls: "unknown", executedQty: 0 };
}

function applyFilled(
  state: GridLogicState,
  intent: OrderIntentRecord,
  executedQty: number,
  events: string[]
): void {
  const qty = executedQty > PRICE_EPS ? executedQty : intent.qty;
  if (intent.intent === "ENTRY") {
    const level = state.levels[intent.level];
    if (level) {
      level.phase = "holding";
      level.holdQty = qty;
      delete level.entryOrderId;
      events.push(`ENTRY 成交: ${intent.side} @ ${intent.price} (线 ${intent.level})`);
    }
  } else {
    if (intent.level === ORPHAN_LEVEL) {
      events.push(`孤儿 EXIT 成交: ${intent.side} @ ${intent.price}`);
      return;
    }
    const level = state.levels[intent.level];
    if (level) {
      level.phase = "idle";
      level.holdQty = 0;
      delete level.exitOrderId;
      events.push(`EXIT 成交: ${intent.side} @ ${intent.price} (释放线 ${intent.level})`);
    }
  }
}

function applyCanceled(state: GridLogicState, intent: OrderIntentRecord, events: string[]): void {
  if (intent.intent === "ENTRY") {
    const level = state.levels[intent.level];
    if (level && level.phase === "entry_placed") {
      level.phase = "idle";
      delete level.entryOrderId;
    }
    events.push(`ENTRY 撤销: ${intent.side} @ ${intent.price} (线 ${intent.level})`);
  } else {
    if (intent.level === ORPHAN_LEVEL) return;
    const level = state.levels[intent.level];
    if (level && level.phase === "exit_placed") {
      level.phase = "holding";
      delete level.exitOrderId;
    }
    events.push(`EXIT 撤销: ${intent.side} @ ${intent.price} (线 ${intent.level})`);
  }
}

function setAwaiting(state: GridLogicState, intent: OrderIntentRecord, input: GridTickInput): void {
  state.awaiting.set(intent.level, {
    intent: intent.intent,
    level: intent.level,
    side: intent.side,
    qty: intent.qty,
    posAtStart: input.positionAmt,
    accountVersionAtStart: input.accountVersion,
    ts: input.now,
  });
}

/** 处理订单快照：检测消失订单并按 filled/canceled/unknown 三分支迁移线状态 */
export function processOrderSnapshot(
  state: GridLogicState,
  input: GridTickInput
): { events: string[]; changed: boolean } {
  const events: string[] = [];
  let changed = false;
  const currIds = new Set<string>();
  for (const order of input.activeOrders) {
    currIds.add(order.orderId);
    if (state.intents.has(order.orderId)) state.seenOrderIds.add(order.orderId);
  }
  const allById = new Map<string, OrderView>();
  for (const order of input.allOrders) allById.set(order.orderId, order);

  const disappeared: string[] = [];
  for (const id of state.prevActiveIds) {
    if (!currIds.has(id)) disappeared.push(id);
  }
  // 已登记但订单流从未出现且超时的订单，一并进入判定
  for (const [id, intent] of state.intents) {
    if (currIds.has(id) || state.seenOrderIds.has(id)) continue;
    if (input.now - intent.createdAt > NEVER_SEEN_TIMEOUT_MS && !disappeared.includes(id)) {
      disappeared.push(id);
    }
  }

  for (const id of disappeared) {
    const intent = state.intents.get(id);
    if (!intent) continue;
    const { cls, executedQty } = classifyDisappearance(allById.get(id));
    if (cls === "filled") {
      applyFilled(state, intent, executedQty, events);
    } else if (cls === "canceled") {
      applyCanceled(state, intent, events);
    } else {
      setAwaiting(state, intent, input);
      events.push(`订单消失待判定: ${intent.intent} ${intent.side} @ ${intent.price}`);
    }
    state.intents.delete(id);
    state.seenOrderIds.delete(id);
    changed = true;
  }

  state.prevActiveIds = currIds;
  return { events, changed };
}

/** awaiting 裁决：按账户仓位差三分支（增→ENTRY 成交 / 减→EXIT 成交 / 不变→撤销），超时按撤销处理 */
export function resolveAwaiting(
  state: GridLogicState,
  input: GridTickInput
): { events: string[]; changed: boolean } {
  const events: string[] = [];
  let changed = false;
  for (const [key, info] of Array.from(state.awaiting.entries())) {
    const timedOut = input.now - info.ts > AWAITING_TIMEOUT_MS;
    const accountAdvanced = input.accountVersion > info.accountVersionAtStart;
    if (!timedOut && !accountAdvanced) continue;

    const delta = input.positionAmt - info.posAtStart;
    const expectedSign = info.side === "BUY" ? 1 : -1;
    const movedAsExpected = delta * expectedSign > PRICE_EPS;

    const pseudoIntent: OrderIntentRecord = {
      orderId: "",
      intent: info.intent,
      side: info.side,
      price: "?",
      qty: info.qty,
      level: info.level,
      gridVersion: state.gridVersion,
      createdAt: info.ts,
    };
    if (accountAdvanced && movedAsExpected) {
      applyFilled(state, pseudoIntent, Math.min(Math.abs(delta), info.qty), events);
    } else if (accountAdvanced || timedOut) {
      applyCanceled(state, pseudoIntent, events);
    } else {
      continue;
    }
    state.awaiting.delete(key);
    changed = true;
  }
  return { events, changed };
}

// ---------------------------------------------------------------------------
// 数量约束
// ---------------------------------------------------------------------------

/** remain = maxPositionSize − |同方向净仓| − Σ(同方向活跃 ENTRY 未成交量)，neutral 按两侧分别约束 */
export function capEntryQty(
  state: GridLogicState,
  settings: GridLogicSettings,
  side: Side,
  positionAmt: number,
  desiredQty: number
): number {
  const sameDirNet = side === "BUY" ? Math.max(positionAmt, 0) : Math.max(-positionAmt, 0);
  let inflightEntry = 0;
  for (const intent of state.intents.values()) {
    if (intent.intent === "ENTRY" && intent.side === side) inflightEntry += intent.qty;
  }
  if (state.inflight && state.inflight.intent === "ENTRY" && state.inflight.side === side) {
    inflightEntry += state.inflight.qty;
  }
  const remain = Math.max(settings.maxPositionSize - sameDirNet - inflightEntry, 0);
  return Math.min(desiredQty, remain);
}

function sumActiveExitQty(state: GridLogicState, side: Side): number {
  let total = 0;
  for (const intent of state.intents.values()) {
    if (intent.intent === "EXIT" && intent.side === side) total += intent.qty;
  }
  if (state.inflight && state.inflight.intent === "EXIT" && state.inflight.side === side) {
    total += state.inflight.qty;
  }
  return total;
}

// ---------------------------------------------------------------------------
// 挂单规划（每线一单不变量在此保证）
// ---------------------------------------------------------------------------

export function planOrders(
  state: GridLogicState,
  settings: GridLogicSettings,
  input: GridTickInput
): GridPlanAction[] {
  const actions: GridPlanAction[] = [];
  const eps = qtyEpsilon(settings);
  const halfTick = settings.priceTick / 2;
  const absPos = Math.abs(input.positionAmt);

  // 1) EXIT 优先：holding 线补挂平仓单，配对目标 = 相邻线
  let exitBudgetSell = Math.max(absPos * (input.positionAmt > 0 ? 1 : 0) - sumActiveExitQty(state, "SELL"), 0);
  let exitBudgetBuy = Math.max(absPos * (input.positionAmt < 0 ? 1 : 0) - sumActiveExitQty(state, "BUY"), 0);
  for (const level of state.levels) {
    if (level.phase !== "holding") continue;
    if (state.awaiting.has(level.index)) continue;
    if (level.entrySide == null || level.exitTarget == null) continue;
    const target = state.levels[level.exitTarget];
    if (!target) continue;
    const exitSide: Side = level.entrySide === "BUY" ? "SELL" : "BUY";
    const budget = exitSide === "SELL" ? exitBudgetSell : exitBudgetBuy;
    const qty = Math.min(level.holdQty, budget);
    if (qty <= eps) continue;
    if (exitSide === "SELL") exitBudgetSell -= qty;
    else exitBudgetBuy -= qty;
    actions.push({
      kind: "PLACE_EXIT",
      source: level.index,
      target: level.exitTarget,
      side: exitSide,
      price: formatPrice(target.price, settings.priceTick),
      qty,
    });
  }

  // 2) ENTRY：仅 idle 且无 awaiting 的线；价格反复穿越期间 holding/exit_placed 线对 ENTRY 关闭。
  //    同一价位允许本线 ENTRY 与相邻线的 EXIT 并存（中性网格向上穿越 = 平多 + 开空）。
  const entryCandidates: Array<{ level: LevelRuntime; distance: number }> = [];
  for (const level of state.levels) {
    if (level.entrySide == null) continue;
    if (level.phase !== "idle") continue;
    if (state.awaiting.has(level.index)) continue;
    if (level.entrySide === "BUY") {
      if (level.price >= input.price - halfTick) continue;
    } else {
      if (level.price <= input.price + halfTick) continue;
    }
    entryCandidates.push({ level, distance: Math.abs(level.price - input.price) });
  }
  entryCandidates.sort((a, b) => a.distance - b.distance);
  for (const { level } of entryCandidates) {
    const side = level.entrySide!;
    const qty = capEntryQty(state, settings, side, input.positionAmt, settings.orderSize);
    if (qty <= eps) continue;
    actions.push({
      kind: "PLACE_ENTRY",
      level: level.index,
      side,
      price: formatPrice(level.price, settings.priceTick),
      qty,
    });
  }
  return actions;
}

// ---------------------------------------------------------------------------
// 止损层①：价格越界
// ---------------------------------------------------------------------------

export function checkPriceStop(
  state: GridLogicState,
  settings: GridLogicSettings,
  price: number
): string | null {
  if (settings.stopLossPct <= 0) return null;
  const lowerTrigger = state.lowerPrice * (1 - settings.stopLossPct);
  const upperTrigger = state.upperPrice * (1 + settings.stopLossPct);
  if (price <= lowerTrigger) {
    return `价格跌破网格下边界 ${((1 - price / state.lowerPrice) * 100).toFixed(2)}%`;
  }
  if (price >= upperTrigger) {
    return `价格突破网格上边界 ${((price / state.upperPrice - 1) * 100).toFixed(2)}%`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// 止损层②：持仓覆盖审计
// ---------------------------------------------------------------------------

export interface CoverageAudit {
  uncoveredQty: number;
  action: GridPlanAction | null;
  events: string[];
}

export function auditExitCoverage(
  state: GridLogicState,
  settings: GridLogicSettings,
  input: GridTickInput
): CoverageAudit {
  const eps = qtyEpsilon(settings);
  const pos = input.positionAmt;
  if (Math.abs(pos) <= eps) {
    state.uncoveredSince = null;
    return { uncoveredQty: 0, action: null, events: [] };
  }
  const exitSide: Side = pos > 0 ? "SELL" : "BUY";
  const entrySide: Side = pos > 0 ? "BUY" : "SELL";
  const coveredByOrders = sumActiveExitQty(state, exitSide);
  let plannedCover = 0;
  for (const level of state.levels) {
    if (level.phase !== "holding") continue;
    if (level.entrySide !== entrySide) continue;
    plannedCover += level.holdQty;
  }
  const uncovered = Math.abs(pos) - coveredByOrders - plannedCover;
  if (uncovered <= eps) {
    state.uncoveredSince = null;
    return { uncoveredQty: 0, action: null, events: [] };
  }
  if (state.uncoveredSince == null) {
    state.uncoveredSince = input.now;
    return { uncoveredQty: uncovered, action: null, events: [] };
  }
  if (input.now - state.uncoveredSince < settings.uncoveredGraceMs) {
    return { uncoveredQty: uncovered, action: null, events: [] };
  }

  const events: string[] = [];
  const outOfRange = input.price < state.lowerPrice || input.price > state.upperPrice;
  const entry = input.entryPrice;
  let deepLoss = false;
  if (settings.stopLossPct > 0 && Number.isFinite(entry) && entry > 0) {
    const lossPct = pos > 0 ? (entry - input.price) / entry : (input.price - entry) / entry;
    deepLoss = lossPct > settings.stopLossPct;
  }
  state.uncoveredSince = input.now;
  if (outOfRange || deepLoss) {
    events.push(
      `覆盖审计: 未覆盖 ${uncovered.toFixed(6)} 且${outOfRange ? "价格已出区间" : "浮亏超限"}，市价平仓`
    );
    return {
      uncoveredQty: uncovered,
      action: { kind: "MARKET_CLOSE", side: exitSide, qty: uncovered, reason: "覆盖审计止损" },
      events,
    };
  }
  // 最近可盈利线补挂孤儿 EXIT
  const targetPrice = findNearestProfitableExitPrice(state, pos > 0 ? "long" : "short", entry, input.price);
  events.push(`覆盖审计: 未覆盖 ${uncovered.toFixed(6)}，补挂平仓单 @ ${targetPrice}`);
  return {
    uncoveredQty: uncovered,
    action: {
      kind: "PLACE_EXIT",
      source: ORPHAN_LEVEL,
      target: null,
      side: exitSide,
      price: formatPrice(targetPrice, settings.priceTick),
      qty: uncovered,
    },
    events,
  };
}

function findNearestProfitableExitPrice(
  state: GridLogicState,
  direction: "long" | "short",
  entryPrice: number,
  price: number
): number {
  const ref = Number.isFinite(entryPrice) && entryPrice > 0 ? entryPrice : price;
  if (direction === "long") {
    for (const level of state.levels) {
      if (level.price > ref + PRICE_EPS && level.price > price + PRICE_EPS) return level.price;
    }
    return state.upperPrice;
  }
  for (let i = state.levels.length - 1; i >= 0; i -= 1) {
    const level = state.levels[i]!;
    if (level.price < ref - PRICE_EPS && level.price < price - PRICE_EPS) return level.price;
  }
  return state.lowerPrice;
}

// ---------------------------------------------------------------------------
// 止损层④：交易所侧 STOP_MARKET 兜底
// ---------------------------------------------------------------------------

export function desiredExchangeStop(
  state: GridLogicState,
  settings: GridLogicSettings,
  positionAmt: number
): { side: Side; stopPrice: number } | null {
  if (settings.stopLossPct <= 0) return null;
  const eps = qtyEpsilon(settings);
  if (positionAmt > eps) {
    return { side: "SELL", stopPrice: state.lowerPrice * (1 - settings.stopLossPct) };
  }
  if (positionAmt < -eps) {
    return { side: "BUY", stopPrice: state.upperPrice * (1 + settings.stopLossPct) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// 智能移格
// ---------------------------------------------------------------------------

/** 触发去抖：偏离超阈值持续 confirmMs 才触发 */
export function shouldShift(
  state: GridLogicState,
  settings: GridLogicSettings,
  price: number,
  now: number
): boolean {
  if (!settings.shiftEnabled || state.shift) return false;
  if (!(state.anchorPrice > 0)) return false;
  const deviation = Math.abs(price / state.anchorPrice - 1);
  if (deviation < settings.shiftTriggerPct) {
    state.shiftCandidateSince = null;
    return false;
  }
  if (state.shiftCandidateSince == null) {
    state.shiftCandidateSince = now;
    return false;
  }
  return now - state.shiftCandidateSince >= settings.shiftConfirmMs;
}

export function beginShift(state: GridLogicState, targetAnchor: number, now: number): void {
  state.shift = { phase: "cancelling", targetAnchor, startedAt: now };
  state.shiftCandidateSince = null;
}

export type ShiftStep =
  | { kind: "CANCEL_ALL" }
  | { kind: "CLOSE_POSITION"; side: Side; qty: number }
  | { kind: "REBUILD"; anchor: number }
  | { kind: "WAIT" };

export interface ShiftStepInput {
  activeOrderCount: number;
  positionAmt: number;
  price: number;
}

/** 三阶段幂等推进：每步先确认前置条件再前进，崩溃后从持久化 phase 续跑 */
export function planShiftStep(
  state: GridLogicState,
  settings: GridLogicSettings,
  input: ShiftStepInput
): ShiftStep {
  if (!state.shift) return { kind: "WAIT" };
  const eps = qtyEpsilon(settings);
  if (state.shift.phase === "cancelling") {
    if (input.activeOrderCount > 0) return { kind: "CANCEL_ALL" };
    state.shift.phase = "closing";
    return { kind: "WAIT" };
  }
  if (state.shift.phase === "closing") {
    if (Math.abs(input.positionAmt) > eps) {
      return {
        kind: "CLOSE_POSITION",
        side: input.positionAmt > 0 ? "SELL" : "BUY",
        qty: Math.abs(input.positionAmt),
      };
    }
    state.shift.phase = "rebuilding";
    return { kind: "WAIT" };
  }
  const anchor = Number.isFinite(input.price) && input.price > 0 ? input.price : state.shift.targetAnchor;
  return { kind: "REBUILD", anchor };
}

/** 以新锚定价重建网格：gridVersion+1、全线重置、清 intents/awaiting */
export function applyRebuild(
  state: GridLogicState,
  settings: GridLogicSettings,
  anchor: number
): void {
  const lower = anchor * (1 - settings.shiftRangePct);
  const upper = anchor * (1 + settings.shiftRangePct);
  const prices = computeLevelPrices(lower, upper, settings.gridLevels, settings.priceTick);
  state.gridVersion += 1;
  state.anchorPrice = anchor;
  state.lowerPrice = lower;
  state.upperPrice = upper;
  state.levels = buildLevels(prices, settings.direction, anchor);
  state.intents = new Map();
  state.awaiting = new Map();
  state.inflight = null;
  state.shift = null;
  state.exchangeStop = null;
  state.prevActiveIds = new Set();
  state.seenOrderIds = new Set();
  state.shiftCandidateSince = null;
  state.uncoveredSince = null;
}

// ---------------------------------------------------------------------------
// planTick：单 tick 决策组合
// ---------------------------------------------------------------------------

export function planTick(
  state: GridLogicState,
  settings: GridLogicSettings,
  input: GridTickInput
): GridPlanResult {
  const actions: GridPlanAction[] = [];
  const events: string[] = [];
  let stateChanged = false;

  const snap = processOrderSnapshot(state, input);
  events.push(...snap.events);
  stateChanged = stateChanged || snap.changed;

  const await_ = resolveAwaiting(state, input);
  events.push(...await_.events);
  stateChanged = stateChanged || await_.changed;

  // 层①：价格越界。移格开启时优先移格，层①兜移格禁用/失败场景
  const stopReason = checkPriceStop(state, settings, input.price);
  if (stopReason) {
    if (settings.shiftEnabled && !state.shift) {
      beginShift(state, input.price, input.now);
      actions.push({ kind: "BEGIN_SHIFT", targetAnchor: input.price });
      events.push(`价格越界，启动移格: ${stopReason}`);
      return { actions, events, stateChanged: true, uncoveredQty: 0 };
    }
    actions.push({ kind: "HALT", reason: stopReason });
    return { actions, events, stateChanged, uncoveredQty: 0 };
  }

  // 移格触发（去抖）
  if (shouldShift(state, settings, input.price, input.now)) {
    beginShift(state, input.price, input.now);
    actions.push({ kind: "BEGIN_SHIFT", targetAnchor: input.price });
    events.push(`价格偏离锚定价超阈值，启动移格 (anchor=${state.anchorPrice} → ${input.price})`);
    return { actions, events, stateChanged: true, uncoveredQty: 0 };
  }

  // 层②：持仓覆盖审计
  const audit = auditExitCoverage(state, settings, input);
  events.push(...audit.events);
  if (audit.action) {
    actions.push(audit.action);
  }

  // 常规挂单
  actions.push(...planOrders(state, settings, input));

  return { actions, events, stateChanged, uncoveredQty: audit.uncoveredQty };
}

// ---------------------------------------------------------------------------
// 三方对账（磁盘 intents ↔ 交易所挂单 ↔ 仓位）
// ---------------------------------------------------------------------------

export interface ReconcileInput {
  activeOrders: OrderView[];
  positionAmt: number;
  price: number | null;
  now: number;
}

export interface ReconcileResult {
  cancelOrderIds: string[];
  /** 无法归档到任何线的残余仓位（带符号），交由层②/③处置 */
  orphanQty: number;
  adopted: number;
  events: string[];
}

function findLevelByPrice(state: GridLogicState, price: number, halfTick: number): number | null {
  for (const level of state.levels) {
    if (Math.abs(level.price - price) <= halfTick + PRICE_EPS) return level.index;
  }
  return null;
}

export function reconcile(
  state: GridLogicState,
  settings: GridLogicSettings,
  input: ReconcileInput
): ReconcileResult {
  const events: string[] = [];
  const cancelOrderIds: string[] = [];
  const halfTick = settings.priceTick / 2;
  const eps = qtyEpsilon(settings);
  const oldIntents = state.intents;
  const newIntents = new Map<string, OrderIntentRecord>();

  // 先清空各线的订单绑定，凭当前挂单重建
  for (const level of state.levels) {
    if (level.phase === "entry_placed") level.phase = "idle";
    if (level.phase === "exit_placed") level.phase = "holding";
    delete level.entryOrderId;
    delete level.exitOrderId;
  }

  const adoptEntry = (order: OrderView, levelIdx: number, intent: OrderIntentRecord): boolean => {
    const level = state.levels[levelIdx];
    if (!level || level.entrySide !== order.side) return false;
    if (level.phase !== "idle") return false;
    level.phase = "entry_placed";
    level.entryOrderId = order.orderId;
    newIntents.set(order.orderId, intent);
    return true;
  };
  const adoptExit = (order: OrderView, sourceIdx: number, intent: OrderIntentRecord): boolean => {
    if (sourceIdx === ORPHAN_LEVEL) {
      newIntents.set(order.orderId, intent);
      return true;
    }
    const level = state.levels[sourceIdx];
    if (!level || level.entrySide == null) return false;
    const expectedSide: Side = level.entrySide === "BUY" ? "SELL" : "BUY";
    if (expectedSide !== order.side) return false;
    if (level.phase !== "holding") return false;
    level.phase = "exit_placed";
    level.exitOrderId = order.orderId;
    if (level.holdQty <= eps) level.holdQty = Math.max(order.origQty - order.executedQty, 0);
    newIntents.set(order.orderId, intent);
    return true;
  };

  // 绑定失败的兜底：平仓方向的单收编为孤儿 EXIT（保住覆盖），否则撤销
  const fallbackAdopt = (order: OrderView, remaining: number): void => {
    const closingSide: Side | null =
      input.positionAmt > eps ? "SELL" : input.positionAmt < -eps ? "BUY" : null;
    if (closingSide && order.side === closingSide) {
      newIntents.set(order.orderId, {
        orderId: order.orderId,
        clientOrderId: order.clientOrderId,
        intent: "EXIT",
        side: order.side,
        price: formatPrice(order.price, settings.priceTick),
        qty: remaining,
        level: ORPHAN_LEVEL,
        gridVersion: state.gridVersion,
        createdAt: input.now,
      });
      events.push(`收编平仓方向挂单为孤儿 EXIT: ${order.side} @ ${order.price}`);
      return;
    }
    cancelOrderIds.push(order.orderId);
    events.push(`撤销无法归属的挂单: ${order.side} @ ${order.price}`);
  };

  for (const order of input.activeOrders) {
    const remaining = Math.max(order.origQty - order.executedQty, 0);
    // 1) orderId 命中磁盘 intents
    const known = oldIntents.get(order.orderId);
    if (known && known.gridVersion === state.gridVersion) {
      const intent: OrderIntentRecord = { ...known, qty: remaining > eps ? remaining : known.qty };
      const ok =
        known.intent === "ENTRY"
          ? adoptEntry(order, known.level, intent)
          : adoptExit(order, known.level, intent);
      if (ok) continue;
      fallbackAdopt(order, remaining);
      continue;
    }
    // 2) inflight write-ahead 槽位归属
    if (
      state.inflight &&
      (order.clientOrderId === state.inflight.clientOrderId ||
        (order.side === state.inflight.side &&
          Math.abs(order.price - Number(state.inflight.price)) <= halfTick + PRICE_EPS))
    ) {
      const rec = state.inflight;
      const intent: OrderIntentRecord = {
        orderId: order.orderId,
        clientOrderId: order.clientOrderId,
        intent: rec.intent,
        side: rec.side,
        price: rec.price,
        qty: remaining > eps ? remaining : rec.qty,
        level: rec.level,
        gridVersion: rec.gridVersion,
        createdAt: rec.createdAt,
      };
      if (rec.target != null) intent.target = rec.target;
      const ok =
        rec.intent === "ENTRY" ? adoptEntry(order, rec.level, intent) : adoptExit(order, rec.level, intent);
      state.inflight = null;
      if (ok) {
        events.push(`inflight 归属确认: ${rec.intent} ${rec.side} @ ${rec.price}`);
        continue;
      }
      fallbackAdopt(order, remaining);
      continue;
    }
    // 3) clientOrderId 解析
    const parsed = parseClientOrderId(order.clientOrderId);
    if (parsed) {
      if (parsed.gridVersion != null && parsed.gridVersion !== state.gridVersion) {
        cancelOrderIds.push(order.orderId);
        events.push(`撤销过期网格版本挂单: ${order.clientOrderId}`);
        continue;
      }
      const intent: OrderIntentRecord = {
        orderId: order.orderId,
        clientOrderId: order.clientOrderId,
        intent: parsed.intent,
        side: order.side,
        price: formatPrice(order.price, settings.priceTick),
        qty: remaining,
        level: parsed.level,
        gridVersion: state.gridVersion,
        createdAt: input.now,
      };
      if (parsed.target != null) intent.target = parsed.target;
      const ok =
        parsed.intent === "ENTRY"
          ? adoptEntry(order, parsed.level, intent)
          : adoptExit(order, parsed.level, intent);
      if (ok) continue;
      fallbackAdopt(order, remaining);
      continue;
    }
    // 4) side+price 对齐档位兜底；歧义优先判 EXIT
    const levelIdx = findLevelByPrice(state, order.price, halfTick);
    if (levelIdx != null) {
      let matched = false;
      for (const level of state.levels) {
        if (level.exitTarget !== levelIdx) continue;
        if (level.entrySide == null) continue;
        const expectedSide: Side = level.entrySide === "BUY" ? "SELL" : "BUY";
        if (expectedSide !== order.side) continue;
        if (level.phase !== "holding") continue;
        const intent: OrderIntentRecord = {
          orderId: order.orderId,
          clientOrderId: order.clientOrderId,
          intent: "EXIT",
          side: order.side,
          price: formatPrice(order.price, settings.priceTick),
          qty: remaining,
          level: level.index,
          target: levelIdx,
          gridVersion: state.gridVersion,
          createdAt: input.now,
        };
        if (adoptExit(order, level.index, intent)) {
          matched = true;
          break;
        }
      }
      if (matched) continue;
      const level = state.levels[levelIdx];
      if (level && level.entrySide === order.side && level.phase === "idle") {
        const intent: OrderIntentRecord = {
          orderId: order.orderId,
          clientOrderId: order.clientOrderId,
          intent: "ENTRY",
          side: order.side,
          price: formatPrice(order.price, settings.priceTick),
          qty: remaining,
          level: levelIdx,
          gridVersion: state.gridVersion,
          createdAt: input.now,
        };
        if (adoptEntry(order, levelIdx, intent)) continue;
      }
    }
    // 5) 三无匹配
    fallbackAdopt(order, remaining);
  }

  state.inflight = null;
  state.intents = newIntents;
  state.awaiting = new Map();
  state.prevActiveIds = new Set(newIntents.keys());
  state.seenOrderIds = new Set(newIntents.keys());

  // 仓位对账：diff = 实际净仓 − 各线持仓合计，归档到最近线（每线 ≤ orderSize）
  let expectedNet = 0;
  for (const level of state.levels) {
    if (level.phase !== "holding" && level.phase !== "exit_placed") continue;
    if (level.entrySide === "BUY") expectedNet += level.holdQty;
    else if (level.entrySide === "SELL") expectedNet -= level.holdQty;
  }
  let diff = input.positionAmt - expectedNet;
  const refPrice = input.price ?? state.anchorPrice;

  const releaseHolds = (entrySide: Side, amount: number): number => {
    // 仓位少于预期：优先释放 exit 目标价离现价最近的线（最可能已被成交）
    let remaining = amount;
    const held = state.levels
      .filter((l) => (l.phase === "holding" || l.phase === "exit_placed") && l.entrySide === entrySide)
      .sort((a, b) => {
        const pa = a.exitTarget != null ? state.levels[a.exitTarget]!.price : a.price;
        const pb = b.exitTarget != null ? state.levels[b.exitTarget]!.price : b.price;
        return Math.abs(pa - refPrice) - Math.abs(pb - refPrice);
      });
    for (const level of held) {
      if (remaining <= eps) break;
      const take = Math.min(level.holdQty, remaining);
      level.holdQty -= take;
      remaining -= take;
      if (level.holdQty <= eps) {
        if (level.exitOrderId) {
          cancelOrderIds.push(level.exitOrderId);
          newIntents.delete(level.exitOrderId);
        }
        level.phase = "idle";
        level.holdQty = 0;
        delete level.exitOrderId;
      }
    }
    return remaining;
  };
  const assignHolds = (entrySide: Side, amount: number): number => {
    let remaining = amount;
    const idle = state.levels
      .filter((l) => l.phase === "idle" && l.entrySide === entrySide)
      .sort((a, b) => Math.abs(a.price - refPrice) - Math.abs(b.price - refPrice));
    for (const level of idle) {
      if (remaining <= eps) break;
      const take = Math.min(settings.orderSize, remaining);
      level.phase = "holding";
      level.holdQty = take;
      remaining -= take;
    }
    return remaining;
  };

  if (diff > eps) {
    let remaining = releaseHolds("SELL", diff);
    remaining = assignHolds("BUY", remaining);
    diff = remaining;
  } else if (diff < -eps) {
    let remaining = releaseHolds("BUY", -diff);
    remaining = assignHolds("SELL", remaining);
    diff = -remaining;
  } else {
    diff = 0;
  }
  if (Math.abs(diff) > eps) {
    events.push(`对账残余孤儿仓位: ${diff.toFixed(6)}`);
    // 立即进入层②处置（跳过宽限期）
    state.uncoveredSince = input.now - 86_400_000;
  }

  return { cancelOrderIds, orphanQty: Math.abs(diff) > eps ? diff : 0, adopted: newIntents.size, events };
}

// ---------------------------------------------------------------------------
// 持久化转换
// ---------------------------------------------------------------------------

export interface StateMeta {
  symbol: string;
  exchangeId: string;
  direction: GridTradeMode;
  orderSize: number;
  maxPositionSize: number;
  gridLevels: number;
  gridMode: string;
}

export function toStored(state: GridLogicState, meta: StateMeta, now: number): StoredGridStateV2 {
  const levels: Record<string, StoredLevelV2> = {};
  for (const level of state.levels) {
    if (level.phase === "idle") continue;
    const entry: StoredLevelV2 = {
      phase: level.phase,
      exitTarget: level.exitTarget,
      holdQty: level.holdQty,
    };
    if (level.entryOrderId) entry.entryOrderId = level.entryOrderId;
    if (level.exitOrderId) entry.exitOrderId = level.exitOrderId;
    levels[String(level.index)] = entry;
  }
  return {
    schemaVersion: 2,
    symbol: meta.symbol,
    exchangeId: meta.exchangeId,
    gridVersion: state.gridVersion,
    anchorPrice: state.anchorPrice,
    lowerPrice: state.lowerPrice,
    upperPrice: state.upperPrice,
    gridLevels: meta.gridLevels,
    orderSize: meta.orderSize,
    maxPositionSize: meta.maxPositionSize,
    direction: meta.direction,
    gridMode: meta.gridMode,
    levels,
    intents: Array.from(state.intents.values()),
    inflight: state.inflight,
    shift: state.shift,
    exchangeStop: state.exchangeStop,
    updatedAt: now,
  };
}

/** config 指纹一致才允许恢复；边界以磁盘为准（移格后与 env 不同） */
export function isCompatibleStoredState(stored: StoredGridStateV2, meta: StateMeta): boolean {
  if (stored.symbol !== meta.symbol) return false;
  if (stored.exchangeId && meta.exchangeId && stored.exchangeId !== meta.exchangeId) return false;
  const storedDirection = stored.direction === "both" ? "neutral" : stored.direction;
  if (storedDirection !== meta.direction) return false;
  if (Math.abs(stored.orderSize - meta.orderSize) > 1e-12) return false;
  if (stored.gridLevels !== meta.gridLevels) return false;
  if (stored.gridMode && stored.gridMode !== meta.gridMode) return false;
  return true;
}

export function fromStored(
  stored: StoredGridStateV2,
  settings: GridLogicSettings,
  fallbackAnchor: number
): GridLogicState {
  const lower = stored.lowerPrice > 0 ? stored.lowerPrice : settings.lowerPrice;
  const upper = stored.upperPrice > lower ? stored.upperPrice : settings.upperPrice;
  const anchor = clampPrice(
    stored.anchorPrice != null && stored.anchorPrice > 0 ? stored.anchorPrice : fallbackAnchor,
    lower,
    upper
  );
  const prices = computeLevelPrices(lower, upper, settings.gridLevels, settings.priceTick);
  const state: GridLogicState = {
    gridVersion: stored.gridVersion > 0 ? stored.gridVersion : 1,
    anchorPrice: anchor,
    lowerPrice: lower,
    upperPrice: upper,
    levels: buildLevels(prices, settings.direction, anchor),
    intents: new Map(),
    awaiting: new Map(),
    inflight: stored.inflight ?? null,
    shift: stored.shift ?? null,
    exchangeStop: stored.exchangeStop ?? null,
    prevActiveIds: new Set(),
    seenOrderIds: new Set(),
    shiftCandidateSince: null,
    uncoveredSince: null,
  };
  for (const [key, info] of Object.entries(stored.levels ?? {})) {
    const idx = Number(key);
    const level = state.levels[idx];
    if (!level || !Number.isFinite(idx)) continue;
    level.phase = info.phase;
    level.holdQty = Number.isFinite(info.holdQty) ? info.holdQty : 0;
    if (info.entryOrderId) level.entryOrderId = info.entryOrderId;
    if (info.exitOrderId) level.exitOrderId = info.exitOrderId;
  }
  for (const intent of stored.intents ?? []) {
    if (!intent || !intent.orderId) continue;
    state.intents.set(String(intent.orderId), { ...intent, orderId: String(intent.orderId) });
  }
  state.prevActiveIds = new Set(state.intents.keys());
  return state;
}
