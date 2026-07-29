import { describe, expect, it } from "vitest";
import { t } from "../i18n";
import {
  ORPHAN_LEVEL,
  applyRebuild,
  assignRoles,
  auditExitCoverage,
  beginShift,
  capEntryQty,
  checkPriceStop,
  classifyDisappearance,
  computeLevelPrices,
  createInitialState,
  desiredExchangeStop,
  fromStored,
  isCompatibleStoredState,
  makeEntryClientOrderId,
  makeExitClientOrderId,
  parseClientOrderId,
  planOrders,
  planShiftStep,
  planTick,
  processOrderSnapshot,
  reconcile,
  resolveAwaiting,
  shouldShift,
  toStored,
  type GridLogicSettings,
  type GridLogicState,
  type GridTickInput,
  type OrderIntentRecord,
  type OrderView,
  type StateMeta,
} from "./grid-logic";

const settings: GridLogicSettings = {
  direction: "neutral",
  lowerPrice: 100,
  upperPrice: 200,
  gridLevels: 5,
  orderSize: 0.1,
  maxPositionSize: 0.4,
  priceTick: 0.1,
  qtyStep: 0.001,
  stopLossPct: 0.01,
  uncoveredGraceMs: 5000,
  shiftEnabled: false,
  shiftTriggerPct: 0.05,
  shiftRangePct: 0.05,
  shiftConfirmMs: 3000,
};

const meta: StateMeta = {
  symbol: "BTCUSDT",
  exchangeId: "aster",
  direction: "neutral",
  orderSize: 0.1,
  maxPositionSize: 0.4,
  gridLevels: 5,
  gridMode: "geometric",
};

function makeInput(overrides: Partial<GridTickInput> = {}): GridTickInput {
  return {
    now: 10_000,
    price: 141.4,
    positionAmt: 0,
    entryPrice: 0,
    accountVersion: 1,
    activeOrders: [],
    allOrders: [],
    ...overrides,
  };
}

function makeOrder(overrides: Partial<OrderView> = {}): OrderView {
  return {
    orderId: "o-1",
    side: "BUY",
    price: 118.9,
    status: "NEW",
    executedQty: 0,
    origQty: 0.1,
    type: "LIMIT",
    ...overrides,
  };
}

function registerIntent(state: GridLogicState, intent: OrderIntentRecord): void {
  state.intents.set(intent.orderId, intent);
  const level = state.levels[intent.level];
  if (!level) return;
  if (intent.intent === "ENTRY") {
    level.phase = "entry_placed";
    level.entryOrderId = intent.orderId;
  } else {
    level.phase = "exit_placed";
    level.exitOrderId = intent.orderId;
    if (level.holdQty <= 0) level.holdQty = intent.qty;
  }
}

function entryIntent(state: GridLogicState, level: number, orderId: string): OrderIntentRecord {
  const l = state.levels[level]!;
  return {
    orderId,
    intent: "ENTRY",
    side: l.entrySide!,
    price: l.price.toFixed(1),
    qty: 0.1,
    level,
    gridVersion: state.gridVersion,
    createdAt: 0,
  };
}

function exitIntent(state: GridLogicState, source: number, orderId: string): OrderIntentRecord {
  const l = state.levels[source]!;
  const target = l.exitTarget!;
  return {
    orderId,
    intent: "EXIT",
    side: l.entrySide === "BUY" ? "SELL" : "BUY",
    price: state.levels[target]!.price.toFixed(1),
    qty: 0.1,
    level: source,
    target,
    gridVersion: state.gridVersion,
    createdAt: 0,
  };
}

// ---------------------------------------------------------------------------
// 网格价位与角色分配
// ---------------------------------------------------------------------------

describe("computeLevelPrices", () => {
  it("builds geometric levels pinned at both bounds", () => {
    const prices = computeLevelPrices(100, 200, 5, 0.1);
    expect(prices).toHaveLength(5);
    expect(prices[0]).toBe(100);
    expect(prices[4]).toBe(200);
    expect(prices[2]).toBeCloseTo(141.4, 1);
    for (let i = 1; i < prices.length; i += 1) {
      expect(prices[i]!).toBeGreaterThan(prices[i - 1]!);
    }
  });

  it("returns empty for invalid params", () => {
    expect(computeLevelPrices(0, 200, 5, 0.1)).toEqual([]);
    expect(computeLevelPrices(200, 100, 5, 0.1)).toEqual([]);
    expect(computeLevelPrices(100, 200, 1, 0.1)).toEqual([]);
  });
});

describe("assignRoles", () => {
  const prices = computeLevelPrices(100, 200, 5, 0.1);

  it("long: all lines except top are BUY with exit at i+1", () => {
    const roles = assignRoles(prices, "long", 150);
    for (let i = 0; i < 4; i += 1) {
      expect(roles[i]).toEqual({ entrySide: "BUY", exitTarget: i + 1 });
    }
    expect(roles[4]).toEqual({ entrySide: null, exitTarget: null });
  });

  it("short: all lines except bottom are SELL with exit at i-1", () => {
    const roles = assignRoles(prices, "short", 150);
    expect(roles[0]).toEqual({ entrySide: null, exitTarget: null });
    for (let i = 1; i < 5; i += 1) {
      expect(roles[i]).toEqual({ entrySide: "SELL", exitTarget: i - 1 });
    }
  });

  it("neutral: BUY below anchor, SELL above", () => {
    const roles = assignRoles(prices, "neutral", 141.4);
    expect(roles[0]).toEqual({ entrySide: "BUY", exitTarget: 1 });
    expect(roles[1]).toEqual({ entrySide: "BUY", exitTarget: 2 });
    expect(roles[2]).toEqual({ entrySide: "BUY", exitTarget: 3 }); // 等于锚定价归买侧
    expect(roles[3]).toEqual({ entrySide: "SELL", exitTarget: 2 });
    expect(roles[4]).toEqual({ entrySide: "SELL", exitTarget: 3 });
  });

  it("neutral: anchor above range makes the top line non-entry", () => {
    const roles = assignRoles(prices, "neutral", 500);
    expect(roles[4]).toEqual({ entrySide: null, exitTarget: null });
    expect(roles[3]).toEqual({ entrySide: "BUY", exitTarget: 4 });
  });

  it("neutral: anchor below range makes the bottom line non-entry", () => {
    const roles = assignRoles(prices, "neutral", 50);
    expect(roles[0]).toEqual({ entrySide: null, exitTarget: null });
    expect(roles[1]).toEqual({ entrySide: "SELL", exitTarget: 0 });
  });
});

// ---------------------------------------------------------------------------
// clientOrderId
// ---------------------------------------------------------------------------

describe("clientOrderId", () => {
  it("round-trips versioned ENTRY/EXIT ids", () => {
    const e = makeEntryClientOrderId(3, 2, 0x1234);
    expect(parseClientOrderId(e)).toEqual({ intent: "ENTRY", gridVersion: 3, level: 2 });
    const x = makeExitClientOrderId(3, 1, 2, 0x1234);
    expect(parseClientOrderId(x)).toEqual({ intent: "EXIT", gridVersion: 3, level: 1, target: 2 });
  });

  it("parses legacy unversioned ids", () => {
    expect(parseClientOrderId("grid-E-2-abc")).toEqual({ intent: "ENTRY", gridVersion: null, level: 2 });
    expect(parseClientOrderId("grid-X-1-2-abc")).toEqual({
      intent: "EXIT",
      gridVersion: null,
      level: 1,
      target: 2,
    });
  });

  it("rejects foreign ids", () => {
    expect(parseClientOrderId("x-1234")).toBeNull();
    expect(parseClientOrderId("")).toBeNull();
    expect(parseClientOrderId(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 挂单规划：每线一单、模式方向
// ---------------------------------------------------------------------------

describe("planOrders", () => {
  it("neutral mode places BUY entries below price and SELL above", () => {
    const state = createInitialState(settings, 141.4);
    const actions = planOrders(state, settings, makeInput({ price: 141.4 }));
    const entries = actions.filter((a) => a.kind === "PLACE_ENTRY");
    for (const entry of entries) {
      if (entry.kind !== "PLACE_ENTRY") continue;
      if (entry.side === "BUY") expect(Number(entry.price)).toBeLessThan(141.4);
      else expect(Number(entry.price)).toBeGreaterThan(141.4);
    }
    expect(entries.some((a) => a.kind === "PLACE_ENTRY" && a.side === "BUY")).toBe(true);
    expect(entries.some((a) => a.kind === "PLACE_ENTRY" && a.side === "SELL")).toBe(true);
  });

  it("long mode never emits SELL entries", () => {
    const longSettings = { ...settings, direction: "long" as const };
    const state = createInitialState(longSettings, 141.4);
    const actions = planOrders(state, longSettings, makeInput({ price: 141.4 }));
    expect(actions.every((a) => a.kind !== "PLACE_ENTRY" || a.side === "BUY")).toBe(true);
    expect(actions.some((a) => a.kind === "PLACE_ENTRY")).toBe(true);
  });

  it("short mode never emits BUY entries", () => {
    const shortSettings = { ...settings, direction: "short" as const };
    const state = createInitialState(shortSettings, 141.4);
    const actions = planOrders(state, shortSettings, makeInput({ price: 141.4 }));
    expect(actions.every((a) => a.kind !== "PLACE_ENTRY" || a.side === "SELL")).toBe(true);
    expect(actions.some((a) => a.kind === "PLACE_ENTRY")).toBe(true);
  });

  it("skips ENTRY for levels in entry_placed/holding/exit_placed/awaiting", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[0]!.phase = "entry_placed";
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    state.levels[3]!.phase = "exit_placed";
    state.awaiting.set(4, {
      intent: "ENTRY",
      level: 4,
      side: "SELL",
      qty: 0.1,
      posAtStart: 0,
      accountVersionAtStart: 1,
      ts: 0,
    });
    const actions = planOrders(state, settings, makeInput({ price: 141.4, positionAmt: 0.1 }));
    const entryLevels = actions
      .filter((a) => a.kind === "PLACE_ENTRY")
      .map((a) => (a.kind === "PLACE_ENTRY" ? a.level : -99));
    expect(entryLevels).not.toContain(0);
    expect(entryLevels).not.toContain(1);
    expect(entryLevels).not.toContain(3);
    expect(entryLevels).not.toContain(4);
  });

  it("pairs exits with the adjacent line", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    const actions = planOrders(state, settings, makeInput({ price: 130, positionAmt: 0.1 }));
    const exit = actions.find((a) => a.kind === "PLACE_EXIT");
    expect(exit).toBeTruthy();
    if (exit?.kind === "PLACE_EXIT") {
      expect(exit.source).toBe(1);
      expect(exit.target).toBe(2);
      expect(exit.side).toBe("SELL");
      expect(Number(exit.price)).toBeCloseTo(state.levels[2]!.price, 6);
      expect(exit.qty).toBeCloseTo(0.1, 9);
    }
  });

  it("short holding exits at the adjacent lower line", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[3]!.phase = "holding";
    state.levels[3]!.holdQty = 0.1;
    const actions = planOrders(state, settings, makeInput({ price: 175, positionAmt: -0.1 }));
    const exit = actions.find((a) => a.kind === "PLACE_EXIT");
    expect(exit).toBeTruthy();
    if (exit?.kind === "PLACE_EXIT") {
      expect(exit.source).toBe(3);
      expect(exit.target).toBe(2);
      expect(exit.side).toBe("BUY");
    }
  });

  it("caps exit qty by remaining position budget", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[0]!.phase = "holding";
    state.levels[0]!.holdQty = 0.1;
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    // 实际仓位只有 0.1：只允许一条线挂出 EXIT
    const actions = planOrders(state, settings, makeInput({ price: 130, positionAmt: 0.1 }));
    const exits = actions.filter((a) => a.kind === "PLACE_EXIT");
    const totalExit = exits.reduce((acc, a) => acc + (a.kind === "PLACE_EXIT" ? a.qty : 0), 0);
    expect(totalExit).toBeCloseTo(0.1, 9);
  });

  it("allows a level ENTRY to coexist with an adjacent line's EXIT at the same price", () => {
    const state = createInitialState(settings, 141.4);
    // 线 2 持仓、EXIT 目标 3；线 3 自身的 SELL 开仓不受影响（向上穿越 = 平多 + 开空）
    state.levels[2]!.phase = "exit_placed";
    state.levels[2]!.holdQty = 0.1;
    registerIntent(state, exitIntent(state, 2, "x-1"));
    const actions = planOrders(state, settings, makeInput({ price: 150, positionAmt: 0.1 }));
    const entryAt3 = actions.find((a) => a.kind === "PLACE_ENTRY" && a.level === 3);
    expect(entryAt3).toBeTruthy();
    const entryAt4 = actions.find((a) => a.kind === "PLACE_ENTRY" && a.level === 4);
    expect(entryAt4).toBeTruthy();
  });
});

describe("capEntryQty", () => {
  it("subtracts same-direction net position and in-flight entries", () => {
    const state = createInitialState(settings, 141.4);
    registerIntent(state, entryIntent(state, 0, "e-0")); // BUY 在途 0.1
    // maxPositionSize 0.4，净多 0.2，在途 0.1 → 剩余 0.1
    expect(capEntryQty(state, settings, "BUY", 0.2, 0.1)).toBeCloseTo(0.1, 9);
    // 再叠一个在途后剩余为 0
    registerIntent(state, entryIntent(state, 1, "e-1"));
    expect(capEntryQty(state, settings, "BUY", 0.2, 0.1)).toBeCloseTo(0, 9);
  });

  it("neutral constrains each side independently", () => {
    const state = createInitialState(settings, 141.4);
    // 净空 0.4 打满 SELL 侧，但 BUY 侧不受影响
    expect(capEntryQty(state, settings, "SELL", -0.4, 0.1)).toBeCloseTo(0, 9);
    expect(capEntryQty(state, settings, "BUY", -0.4, 0.1)).toBeCloseTo(0.1, 9);
  });

  it("counts inflight write-ahead slot", () => {
    const state = createInitialState(settings, 141.4);
    state.inflight = {
      clientOrderId: "grid-1-E-0-a",
      intent: "ENTRY",
      side: "BUY",
      price: "100.0",
      qty: 0.35,
      level: 0,
      gridVersion: 1,
      createdAt: 0,
    };
    expect(capEntryQty(state, settings, "BUY", 0, 0.1)).toBeCloseTo(0.05, 9);
  });
});

// ---------------------------------------------------------------------------
// 生命周期与消失分类
// ---------------------------------------------------------------------------

describe("order lifecycle", () => {
  it("classifies disappearance by final status", () => {
    expect(classifyDisappearance(makeOrder({ status: "FILLED", executedQty: 0.1 })).cls).toBe("filled");
    expect(classifyDisappearance(makeOrder({ status: "NEW", executedQty: 0.05 })).cls).toBe("filled");
    expect(classifyDisappearance(makeOrder({ status: "CANCELED" })).cls).toBe("canceled");
    expect(classifyDisappearance(makeOrder({ status: "EXPIRED" })).cls).toBe("canceled");
    expect(classifyDisappearance(undefined).cls).toBe("unknown");
  });

  it("walks idle → entry_placed → holding → exit_placed → idle", () => {
    const state = createInitialState(settings, 141.4);
    const level = 1;
    // entry_placed
    registerIntent(state, entryIntent(state, level, "e-1"));
    expect(state.levels[level]!.phase).toBe("entry_placed");
    // 出现在活跃单里
    const active = makeOrder({ orderId: "e-1", price: state.levels[level]!.price });
    processOrderSnapshot(state, makeInput({ activeOrders: [active], allOrders: [active] }));
    // 消失且 FILLED → holding
    const filled = { ...active, status: "FILLED", executedQty: 0.1 };
    processOrderSnapshot(state, makeInput({ activeOrders: [], allOrders: [filled] }));
    expect(state.levels[level]!.phase).toBe("holding");
    expect(state.levels[level]!.holdQty).toBeCloseTo(0.1, 9);
    // exit_placed
    registerIntent(state, exitIntent(state, level, "x-1"));
    expect(state.levels[level]!.phase).toBe("exit_placed");
    const exitActive = makeOrder({
      orderId: "x-1",
      side: "SELL",
      price: state.levels[2]!.price,
    });
    processOrderSnapshot(state, makeInput({ activeOrders: [exitActive], allOrders: [exitActive] }));
    // EXIT 成交 → idle 释放
    const exitFilled = { ...exitActive, status: "FILLED", executedQty: 0.1 };
    processOrderSnapshot(state, makeInput({ activeOrders: [], allOrders: [exitFilled] }));
    expect(state.levels[level]!.phase).toBe("idle");
    expect(state.levels[level]!.holdQty).toBe(0);
  });

  it("ENTRY canceled returns the level to idle", () => {
    const state = createInitialState(settings, 141.4);
    registerIntent(state, entryIntent(state, 1, "e-1"));
    const active = makeOrder({ orderId: "e-1", price: state.levels[1]!.price });
    processOrderSnapshot(state, makeInput({ activeOrders: [active], allOrders: [active] }));
    const canceled = { ...active, status: "CANCELED" };
    processOrderSnapshot(state, makeInput({ activeOrders: [], allOrders: [canceled] }));
    expect(state.levels[1]!.phase).toBe("idle");
  });

  it("EXIT canceled reverts the source level to holding", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    registerIntent(state, exitIntent(state, 1, "x-1"));
    const active = makeOrder({ orderId: "x-1", side: "SELL", price: state.levels[2]!.price });
    processOrderSnapshot(state, makeInput({ activeOrders: [active], allOrders: [active] }));
    const canceled = { ...active, status: "CANCELED" };
    processOrderSnapshot(state, makeInput({ activeOrders: [], allOrders: [canceled] }));
    expect(state.levels[1]!.phase).toBe("holding");
    expect(state.levels[1]!.holdQty).toBeCloseTo(0.1, 9);
  });

  it("unknown disappearance defers to awaiting and blocks re-entry", () => {
    const state = createInitialState(settings, 141.4);
    registerIntent(state, entryIntent(state, 1, "e-1"));
    const active = makeOrder({ orderId: "e-1", price: state.levels[1]!.price });
    processOrderSnapshot(state, makeInput({ activeOrders: [active], allOrders: [active] }));
    // 消失且无记录 → awaiting
    processOrderSnapshot(state, makeInput({ activeOrders: [], allOrders: [] }));
    expect(state.awaiting.has(1)).toBe(true);
    const actions = planOrders(state, settings, makeInput({ price: 141.4 }));
    expect(actions.some((a) => a.kind === "PLACE_ENTRY" && a.level === 1)).toBe(false);
  });

  it("does not re-place ENTRY across repeated price crossings while holding", () => {
    const state = createInitialState(settings, 141.4);
    const level = 1;
    registerIntent(state, entryIntent(state, level, "e-1"));
    const active = makeOrder({ orderId: "e-1", price: state.levels[level]!.price });
    processOrderSnapshot(state, makeInput({ activeOrders: [active], allOrders: [active] }));
    const filled = { ...active, status: "FILLED", executedQty: 0.1 };
    processOrderSnapshot(state, makeInput({ activeOrders: [], allOrders: [filled] }));
    // 价格来回穿越该线，线仍 holding → 永不再出 ENTRY
    for (const price of [110, 130, 110, 130, 110]) {
      const actions = planOrders(state, settings, makeInput({ price, positionAmt: 0.1 }));
      expect(actions.some((a) => a.kind === "PLACE_ENTRY" && a.level === level)).toBe(false);
    }
    // EXIT 成交释放后才重新开放
    state.levels[level]!.phase = "idle";
    state.levels[level]!.holdQty = 0;
    const actions = planOrders(state, settings, makeInput({ price: 130, positionAmt: 0 }));
    expect(actions.some((a) => a.kind === "PLACE_ENTRY" && a.level === level)).toBe(true);
  });

  it("treats registered-but-never-seen orders as disappeared after timeout", () => {
    const state = createInitialState(settings, 141.4);
    registerIntent(state, { ...entryIntent(state, 1, "e-1"), createdAt: 1000 });
    // 16s 后订单流仍无此单 → unknown → awaiting
    processOrderSnapshot(state, makeInput({ now: 17_001, activeOrders: [], allOrders: [] }));
    expect(state.intents.has("e-1")).toBe(false);
    expect(state.awaiting.has(1)).toBe(true);
  });
});

describe("resolveAwaiting", () => {
  function seedAwaitingEntry(state: GridLogicState): void {
    state.levels[1]!.phase = "entry_placed";
    state.awaiting.set(1, {
      intent: "ENTRY",
      level: 1,
      side: "BUY",
      qty: 0.1,
      posAtStart: 0,
      accountVersionAtStart: 1,
      ts: 10_000,
    });
  }

  it("position increase resolves awaiting ENTRY as filled", () => {
    const state = createInitialState(settings, 141.4);
    seedAwaitingEntry(state);
    resolveAwaiting(state, makeInput({ now: 11_000, accountVersion: 2, positionAmt: 0.1 }));
    expect(state.levels[1]!.phase).toBe("holding");
    expect(state.levels[1]!.holdQty).toBeCloseTo(0.1, 9);
    expect(state.awaiting.size).toBe(0);
  });

  it("unchanged position after account update resolves as canceled", () => {
    const state = createInitialState(settings, 141.4);
    seedAwaitingEntry(state);
    resolveAwaiting(state, makeInput({ now: 11_000, accountVersion: 2, positionAmt: 0 }));
    expect(state.levels[1]!.phase).toBe("idle");
    expect(state.awaiting.size).toBe(0);
  });

  it("position decrease resolves awaiting EXIT as filled", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[1]!.phase = "exit_placed";
    state.levels[1]!.holdQty = 0.1;
    state.awaiting.set(1, {
      intent: "EXIT",
      level: 1,
      side: "SELL",
      qty: 0.1,
      posAtStart: 0.1,
      accountVersionAtStart: 1,
      ts: 10_000,
    });
    resolveAwaiting(state, makeInput({ now: 11_000, accountVersion: 2, positionAmt: 0 }));
    expect(state.levels[1]!.phase).toBe("idle");
    expect(state.awaiting.size).toBe(0);
  });

  it("timeout without account update resolves as canceled", () => {
    const state = createInitialState(settings, 141.4);
    seedAwaitingEntry(state);
    resolveAwaiting(state, makeInput({ now: 19_000, accountVersion: 1, positionAmt: 0 }));
    expect(state.levels[1]!.phase).toBe("idle");
    expect(state.awaiting.size).toBe(0);
  });

  it("keeps awaiting while neither timeout nor account movement", () => {
    const state = createInitialState(settings, 141.4);
    seedAwaitingEntry(state);
    resolveAwaiting(state, makeInput({ now: 12_000, accountVersion: 1, positionAmt: 0 }));
    expect(state.awaiting.size).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 止损层①②④
// ---------------------------------------------------------------------------

describe("checkPriceStop", () => {
  it("triggers below lower and above upper thresholds", () => {
    const state = createInitialState(settings, 141.4);
    expect(checkPriceStop(state, settings, 98.9)).toBe(
      t("log.grid.belowLowerBound", { pct: "1.10" })
    );
    expect(checkPriceStop(state, settings, 202.1)).toBe(
      t("log.grid.aboveUpperBound", { pct: "1.05" })
    );
    expect(checkPriceStop(state, settings, 150)).toBeNull();
    expect(checkPriceStop(state, settings, 99.5)).toBeNull(); // 1% 容忍内
  });

  it("uses live state bounds after a shift", () => {
    const shiftSettings = { ...settings, shiftEnabled: true };
    const state = createInitialState(shiftSettings, 141.4);
    applyRebuild(state, shiftSettings, 300);
    expect(checkPriceStop(state, shiftSettings, 150)).not.toBeNull();
    expect(checkPriceStop(state, shiftSettings, 300)).toBeNull();
  });
});

describe("auditExitCoverage", () => {
  it("waits for grace period before acting", () => {
    const state = createInitialState(settings, 141.4);
    const input = makeInput({ now: 10_000, price: 141.4, positionAmt: 0.15, entryPrice: 140 });
    const first = auditExitCoverage(state, settings, input);
    expect(first.uncoveredQty).toBeCloseTo(0.15, 9);
    expect(first.action).toBeNull();
    const second = auditExitCoverage(state, settings, { ...input, now: 12_000 });
    expect(second.action).toBeNull();
    const third = auditExitCoverage(state, settings, { ...input, now: 15_100 });
    expect(third.action).not.toBeNull();
    expect(third.action!.kind).toBe("PLACE_EXIT");
    if (third.action!.kind === "PLACE_EXIT") {
      expect(third.action!.source).toBe(ORPHAN_LEVEL);
      expect(third.action!.side).toBe("SELL");
      expect(Number(third.action!.price)).toBeGreaterThan(140);
    }
  });

  it("counts holding levels and active exits as covered", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    const audit = auditExitCoverage(
      state,
      settings,
      makeInput({ positionAmt: 0.1, entryPrice: 118 })
    );
    expect(audit.uncoveredQty).toBe(0);
    expect(state.uncoveredSince).toBeNull();
  });

  it("market-closes uncovered qty when price is out of range", () => {
    const state = createInitialState(settings, 141.4);
    state.uncoveredSince = 1000;
    const audit = auditExitCoverage(
      state,
      settings,
      makeInput({ now: 10_000, price: 99, positionAmt: 0.15, entryPrice: 150 })
    );
    expect(audit.action).not.toBeNull();
    expect(audit.action!.kind).toBe("MARKET_CLOSE");
    if (audit.action!.kind === "MARKET_CLOSE") {
      expect(audit.action!.side).toBe("SELL");
      expect(audit.action!.qty).toBeCloseTo(0.15, 9);
    }
  });

  it("market-closes when floating loss exceeds stopLossPct", () => {
    const state = createInitialState(settings, 141.4);
    state.uncoveredSince = 1000;
    const audit = auditExitCoverage(
      state,
      settings,
      makeInput({ now: 10_000, price: 140, positionAmt: 0.15, entryPrice: 160 })
    );
    expect(audit.action!.kind).toBe("MARKET_CLOSE");
  });

  it("short uncovered places BUY orphan exit below entry", () => {
    const state = createInitialState(settings, 141.4);
    state.uncoveredSince = 1000;
    const audit = auditExitCoverage(
      state,
      settings,
      makeInput({ now: 10_000, price: 160, positionAmt: -0.15, entryPrice: 160.5 })
    );
    expect(audit.action!.kind).toBe("PLACE_EXIT");
    if (audit.action!.kind === "PLACE_EXIT") {
      expect(audit.action!.side).toBe("BUY");
      expect(Number(audit.action!.price)).toBeLessThan(160);
    }
  });
});

describe("desiredExchangeStop", () => {
  it("returns SELL stop below lower for net long, BUY stop above upper for net short", () => {
    const state = createInitialState(settings, 141.4);
    expect(desiredExchangeStop(state, settings, 0.1)).toEqual({ side: "SELL", stopPrice: 99 });
    expect(desiredExchangeStop(state, settings, -0.1)).toEqual({ side: "BUY", stopPrice: 202 });
    expect(desiredExchangeStop(state, settings, 0)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 移格
// ---------------------------------------------------------------------------

describe("shift", () => {
  const shiftSettings = { ...settings, shiftEnabled: true };

  it("shouldShift debounces the trigger", () => {
    const state = createInitialState(shiftSettings, 141.4);
    // 偏离 >5%
    expect(shouldShift(state, shiftSettings, 150, 1000)).toBe(false); // 开始计时
    expect(shouldShift(state, shiftSettings, 150, 2000)).toBe(false); // 未满 3s
    expect(shouldShift(state, shiftSettings, 150, 4001)).toBe(true); // 满 3s
  });

  it("shouldShift resets when price returns inside threshold", () => {
    const state = createInitialState(shiftSettings, 141.4);
    shouldShift(state, shiftSettings, 150, 1000);
    expect(shouldShift(state, shiftSettings, 142, 2000)).toBe(false);
    expect(state.shiftCandidateSince).toBeNull();
    // 再次越限需重新计时
    expect(shouldShift(state, shiftSettings, 150, 3000)).toBe(false);
    expect(shouldShift(state, shiftSettings, 150, 6001)).toBe(true);
  });

  it("shouldShift is disabled when shift already active or disabled", () => {
    const state = createInitialState(shiftSettings, 141.4);
    beginShift(state, 150, 0);
    expect(shouldShift(state, shiftSettings, 150, 99_999)).toBe(false);
    const state2 = createInitialState(settings, 141.4);
    expect(shouldShift(state2, settings, 150, 0)).toBe(false);
    expect(shouldShift(state2, settings, 150, 99_999)).toBe(false);
  });

  it("planShiftStep walks cancelling → closing → rebuilding idempotently", () => {
    const state = createInitialState(shiftSettings, 141.4);
    beginShift(state, 150, 0);
    // cancelling：有挂单先撤
    expect(planShiftStep(state, shiftSettings, { activeOrderCount: 2, positionAmt: 0.1, price: 150 })).toEqual({
      kind: "CANCEL_ALL",
    });
    expect(state.shift!.phase).toBe("cancelling");
    // 挂单清空 → 进入 closing
    expect(planShiftStep(state, shiftSettings, { activeOrderCount: 0, positionAmt: 0.1, price: 150 })).toEqual({
      kind: "WAIT",
    });
    expect(state.shift!.phase).toBe("closing");
    // closing：有仓先平
    expect(planShiftStep(state, shiftSettings, { activeOrderCount: 0, positionAmt: 0.1, price: 150 })).toEqual({
      kind: "CLOSE_POSITION",
      side: "SELL",
      qty: 0.1,
    });
    // 仓位清零 → rebuilding
    expect(planShiftStep(state, shiftSettings, { activeOrderCount: 0, positionAmt: 0, price: 150 })).toEqual({
      kind: "WAIT",
    });
    expect(state.shift!.phase).toBe("rebuilding");
    expect(planShiftStep(state, shiftSettings, { activeOrderCount: 0, positionAmt: 0, price: 150 })).toEqual({
      kind: "REBUILD",
      anchor: 150,
    });
  });

  it("resumes from a persisted phase (crash recovery)", () => {
    const state = createInitialState(shiftSettings, 141.4);
    state.shift = { phase: "closing", targetAnchor: 150, startedAt: 0 };
    const step = planShiftStep(state, shiftSettings, { activeOrderCount: 0, positionAmt: -0.2, price: 149 });
    expect(step).toEqual({ kind: "CLOSE_POSITION", side: "BUY", qty: 0.2 });
  });

  it("applyRebuild recenters the grid and bumps gridVersion", () => {
    const state = createInitialState(shiftSettings, 141.4);
    state.levels[1]!.phase = "holding";
    state.intents.set("x", entryIntent(state, 1, "x"));
    beginShift(state, 150, 0);
    applyRebuild(state, shiftSettings, 150);
    expect(state.gridVersion).toBe(2);
    expect(state.anchorPrice).toBe(150);
    expect(state.lowerPrice).toBeCloseTo(142.5, 6);
    expect(state.upperPrice).toBeCloseTo(157.5, 6);
    expect(state.shift).toBeNull();
    expect(state.intents.size).toBe(0);
    expect(state.levels.every((l) => l.phase === "idle" && l.holdQty === 0)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// planTick 组合
// ---------------------------------------------------------------------------

describe("planTick", () => {
  it("halts on price stop when shift is disabled", () => {
    const state = createInitialState(settings, 141.4);
    const result = planTick(state, settings, makeInput({ price: 95 }));
    expect(result.actions[0]!.kind).toBe("HALT");
  });

  it("prefers BEGIN_SHIFT over HALT when shift is enabled", () => {
    const shiftSettings = { ...settings, shiftEnabled: true };
    const state = createInitialState(shiftSettings, 141.4);
    const result = planTick(state, shiftSettings, makeInput({ price: 95 }));
    expect(result.actions[0]!.kind).toBe("BEGIN_SHIFT");
    expect(state.shift).not.toBeNull();
  });

  it("halts on price stop when a shift is already in progress", () => {
    const shiftSettings = { ...settings, shiftEnabled: true };
    const state = createInitialState(shiftSettings, 141.4);
    beginShift(state, 95, 0);
    const result = planTick(state, shiftSettings, makeInput({ price: 95 }));
    expect(result.actions[0]!.kind).toBe("HALT");
  });

  it("emits entries in idle market conditions", () => {
    const state = createInitialState(settings, 141.4);
    const result = planTick(state, settings, makeInput({ price: 141.4 }));
    expect(result.actions.some((a) => a.kind === "PLACE_ENTRY")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// reconcile
// ---------------------------------------------------------------------------

describe("reconcile", () => {
  it("keeps orders matched by orderId and rebinds levels", () => {
    const state = createInitialState(settings, 141.4);
    registerIntent(state, entryIntent(state, 1, "e-1"));
    // 模拟重启：phase 会被重置再由挂单重建
    const order = makeOrder({ orderId: "e-1", price: state.levels[1]!.price });
    const result = reconcile(state, settings, {
      activeOrders: [order],
      positionAmt: 0,
      price: 141.4,
      now: 10_000,
    });
    expect(result.cancelOrderIds).toEqual([]);
    expect(state.levels[1]!.phase).toBe("entry_placed");
    expect(state.levels[1]!.entryOrderId).toBe("e-1");
    expect(state.intents.has("e-1")).toBe(true);
  });

  it("rebinds by clientOrderId when orderId is unknown", () => {
    const state = createInitialState(settings, 141.4);
    const order = makeOrder({
      orderId: "new-77",
      clientOrderId: makeEntryClientOrderId(1, 1, 999),
      price: state.levels[1]!.price,
    });
    const result = reconcile(state, settings, {
      activeOrders: [order],
      positionAmt: 0,
      price: 141.4,
      now: 10_000,
    });
    expect(result.cancelOrderIds).toEqual([]);
    expect(state.levels[1]!.phase).toBe("entry_placed");
    expect(state.intents.get("new-77")!.intent).toBe("ENTRY");
  });

  it("cancels stale gridVersion orders", () => {
    const state = createInitialState(settings, 141.4);
    state.gridVersion = 3;
    const order = makeOrder({
      orderId: "old-1",
      clientOrderId: makeEntryClientOrderId(2, 1, 999),
      price: state.levels[1]!.price,
    });
    const result = reconcile(state, settings, {
      activeOrders: [order],
      positionAmt: 0,
      price: 141.4,
      now: 10_000,
    });
    expect(result.cancelOrderIds).toContain("old-1");
  });

  it("falls back to side+price matching and prefers EXIT on ambiguity", () => {
    const state = createInitialState(settings, 141.4);
    // 线 2 holding，其 exit 目标 3(SELL@159.5)；一张无 cid 的 SELL@159.5 应判为 EXIT 而非线 3 的 ENTRY
    state.levels[2]!.phase = "holding";
    state.levels[2]!.holdQty = 0.1;
    const order = makeOrder({ orderId: "anon-1", side: "SELL", price: state.levels[3]!.price });
    const result = reconcile(state, settings, {
      activeOrders: [order],
      positionAmt: 0.1,
      price: 150,
      now: 10_000,
    });
    expect(result.cancelOrderIds).toEqual([]);
    expect(state.levels[2]!.phase).toBe("exit_placed");
    expect(state.intents.get("anon-1")!.intent).toBe("EXIT");
    expect(state.intents.get("anon-1")!.level).toBe(2);
  });

  it("adopts price-aligned entries without cid", () => {
    const state = createInitialState(settings, 141.4);
    const order = makeOrder({ orderId: "anon-2", side: "BUY", price: state.levels[0]!.price });
    reconcile(state, settings, { activeOrders: [order], positionAmt: 0, price: 141.4, now: 10_000 });
    expect(state.levels[0]!.phase).toBe("entry_placed");
    expect(state.intents.get("anon-2")!.intent).toBe("ENTRY");
  });

  it("adopts closing-side strangers as orphan EXIT and cancels the rest", () => {
    const state = createInitialState(settings, 141.4);
    const closer = makeOrder({ orderId: "s-1", side: "SELL", price: 155.5 });
    const noise = makeOrder({ orderId: "s-2", side: "BUY", price: 133.3 });
    const result = reconcile(state, settings, {
      activeOrders: [closer, noise],
      positionAmt: 0.2,
      price: 150,
      now: 10_000,
    });
    expect(state.intents.get("s-1")!.level).toBe(ORPHAN_LEVEL);
    expect(result.cancelOrderIds).toContain("s-2");
  });

  it("claims inflight slot by clientOrderId", () => {
    const state = createInitialState(settings, 141.4);
    state.inflight = {
      clientOrderId: "grid-1-E-1-ff",
      intent: "ENTRY",
      side: "BUY",
      price: state.levels[1]!.price.toFixed(1),
      qty: 0.1,
      level: 1,
      gridVersion: 1,
      createdAt: 9000,
    };
    const order = makeOrder({
      orderId: "srv-9",
      clientOrderId: "grid-1-E-1-ff",
      price: state.levels[1]!.price,
    });
    reconcile(state, settings, { activeOrders: [order], positionAmt: 0, price: 141.4, now: 10_000 });
    expect(state.inflight).toBeNull();
    expect(state.levels[1]!.phase).toBe("entry_placed");
    expect(state.intents.get("srv-9")).toBeTruthy();
  });

  it("clears inflight when no matching order exists", () => {
    const state = createInitialState(settings, 141.4);
    state.inflight = {
      clientOrderId: "grid-1-E-1-ff",
      intent: "ENTRY",
      side: "BUY",
      price: "118.9",
      qty: 0.1,
      level: 1,
      gridVersion: 1,
      createdAt: 9000,
    };
    reconcile(state, settings, { activeOrders: [], positionAmt: 0, price: 141.4, now: 10_000 });
    expect(state.inflight).toBeNull();
  });

  it("allocates position surplus to nearest idle lines, residue becomes orphan", () => {
    const state = createInitialState(settings, 141.4);
    // 实际净多 0.25，但没有任何线 holding → 归档到最近 BUY 线（每线 ≤ 0.1），残余 0.05
    const result = reconcile(state, settings, {
      activeOrders: [],
      positionAmt: 0.25,
      price: 141.4,
      now: 10_000,
    });
    const holding = state.levels.filter((l) => l.phase === "holding");
    expect(holding.length).toBe(3);
    const total = holding.reduce((acc, l) => acc + l.holdQty, 0);
    expect(total).toBeCloseTo(0.25, 9);
    expect(result.orphanQty).toBe(0);
  });

  it("reports orphan when position exceeds line capacity", () => {
    const state = createInitialState(settings, 141.4);
    // neutral 下 BUY 线只有 3 条（0/1/2），容量 0.3；净多 0.5 → 残余 0.2
    const result = reconcile(state, settings, {
      activeOrders: [],
      positionAmt: 0.5,
      price: 141.4,
      now: 10_000,
    });
    expect(result.orphanQty).toBeCloseTo(0.2, 9);
    expect(state.uncoveredSince).not.toBeNull();
  });

  it("releases holds when actual position is below expectation", () => {
    const state = createInitialState(settings, 141.4);
    state.levels[0]!.phase = "holding";
    state.levels[0]!.holdQty = 0.1;
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    // 实际仓位 0.1 → 释放 exit 目标价离现价最近的线 1（其 EXIT 最可能已成交），保留线 0
    reconcile(state, settings, { activeOrders: [], positionAmt: 0.1, price: 141.4, now: 10_000 });
    const holding = state.levels.filter((l) => l.phase === "holding");
    expect(holding).toHaveLength(1);
    expect(holding[0]!.index).toBe(0);
    expect(state.levels[1]!.phase).toBe("idle");
  });

  it("restores from v1-migrated stored state and reconciles", () => {
    // v1 迁移：filled→holding，无 intents，靠价档兜底重建
    const stored = {
      schemaVersion: 2 as const,
      symbol: "BTCUSDT",
      exchangeId: "",
      gridVersion: 1,
      anchorPrice: null,
      lowerPrice: 100,
      upperPrice: 200,
      gridLevels: 5,
      orderSize: 0.1,
      maxPositionSize: 0.4,
      direction: "both",
      gridMode: "geometric",
      levels: { "1": { phase: "holding" as const, exitTarget: 2, holdQty: 0.1 } },
      intents: [],
      updatedAt: 0,
    };
    expect(isCompatibleStoredState(stored, meta)).toBe(true);
    const state = fromStored(stored, settings, 141.4);
    expect(state.anchorPrice).toBe(141.4);
    expect(state.levels[1]!.phase).toBe("holding");
    const exitOrder = makeOrder({ orderId: "leg-1", side: "SELL", price: state.levels[2]!.price });
    reconcile(state, settings, {
      activeOrders: [exitOrder],
      positionAmt: 0.1,
      price: 141.4,
      now: 10_000,
    });
    expect(state.levels[1]!.phase).toBe("exit_placed");
    expect(state.intents.get("leg-1")!.intent).toBe("EXIT");
  });
});

// ---------------------------------------------------------------------------
// 持久化转换
// ---------------------------------------------------------------------------

describe("stored state round-trip", () => {
  it("toStored → fromStored preserves phases, intents, shift and stop", () => {
    const state = createInitialState(settings, 141.4);
    state.gridVersion = 4;
    state.levels[1]!.phase = "holding";
    state.levels[1]!.holdQty = 0.1;
    registerIntent(state, exitIntent(state, 1, "x-5"));
    state.shift = { phase: "closing", targetAnchor: 155, startedAt: 123 };
    state.exchangeStop = { orderId: "st-1", side: "SELL", stopPrice: 99 };
    const stored = toStored(state, meta, 999);
    expect(stored.schemaVersion).toBe(2);
    expect(stored.gridVersion).toBe(4);
    const revived = fromStored(stored, settings, 0);
    expect(revived.gridVersion).toBe(4);
    expect(revived.anchorPrice).toBeCloseTo(141.4, 6);
    expect(revived.levels[1]!.phase).toBe("exit_placed");
    expect(revived.levels[1]!.holdQty).toBeCloseTo(0.1, 9);
    expect(revived.intents.get("x-5")!.target).toBe(2);
    expect(revived.shift).toEqual({ phase: "closing", targetAnchor: 155, startedAt: 123 });
    expect(revived.exchangeStop).toEqual({ orderId: "st-1", side: "SELL", stopPrice: 99 });
  });

  it("isCompatibleStoredState rejects fingerprint mismatches", () => {
    const state = createInitialState(settings, 141.4);
    const stored = toStored(state, meta, 0);
    expect(isCompatibleStoredState(stored, meta)).toBe(true);
    expect(isCompatibleStoredState(stored, { ...meta, direction: "long" })).toBe(false);
    expect(isCompatibleStoredState(stored, { ...meta, orderSize: 0.2 })).toBe(false);
    expect(isCompatibleStoredState(stored, { ...meta, gridLevels: 6 })).toBe(false);
    expect(isCompatibleStoredState(stored, { ...meta, symbol: "ETHUSDT" })).toBe(false);
    expect(isCompatibleStoredState(stored, { ...meta, exchangeId: "grvt" })).toBe(false);
  });

  it("stored bounds win over settings (post-shift restart)", () => {
    const shiftSettings = { ...settings, shiftEnabled: true };
    const state = createInitialState(shiftSettings, 141.4);
    applyRebuild(state, shiftSettings, 300);
    const stored = toStored(state, meta, 0);
    const revived = fromStored(stored, shiftSettings, 300);
    expect(revived.lowerPrice).toBeCloseTo(285, 6);
    expect(revived.upperPrice).toBeCloseTo(315, 6);
    expect(revived.gridVersion).toBe(2);
  });
});
