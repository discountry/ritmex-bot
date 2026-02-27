import { describe, expect, it } from "vitest";
import { createInitialSwingState, stepSwing, type SwingLogicConfig } from "./swing-logic";

const baseConfig: SwingLogicConfig = {
  direction: "both",
  rsiHigh: 70,
  rsiLow: 30,
};

describe("swing logic", () => {
  it("arms short entry on RSI cross up 70, then opens on cross down 70", () => {
    let state = createInitialSwingState();

    // First observation sets prevRsi, no cross yet.
    ({ nextState: state } = stepSwing(state, { ...baseConfig, direction: "short" }, { rsi: 69, positionAmt: 0, pnl: 0 }));
    const a1 = stepSwing(state, { ...baseConfig, direction: "short" }, { rsi: 71, positionAmt: 0, pnl: 0 });
    expect(a1.actions).toEqual([]);
    expect(a1.nextState.armedShortEntry).toBe(true);
    state = a1.nextState;

    const a2 = stepSwing(state, { ...baseConfig, direction: "short" }, { rsi: 69, positionAmt: 0, pnl: 0 });
    expect(a2.actions.map((a) => a.type)).toEqual(["OPEN_SHORT"]);
    expect(a2.nextState.armedShortEntry).toBe(false);
  });

  it("arms long entry on RSI cross down 30, then opens on cross up 30", () => {
    let state = createInitialSwingState();
    ({ nextState: state } = stepSwing(state, { ...baseConfig, direction: "long" }, { rsi: 31, positionAmt: 0, pnl: 0 }));

    const a1 = stepSwing(state, { ...baseConfig, direction: "long" }, { rsi: 29, positionAmt: 0, pnl: 0 });
    expect(a1.actions).toEqual([]);
    expect(a1.nextState.armedLongEntry).toBe(true);
    state = a1.nextState;

    const a2 = stepSwing(state, { ...baseConfig, direction: "long" }, { rsi: 31, positionAmt: 0, pnl: 0 });
    expect(a2.actions.map((a) => a.type)).toEqual(["OPEN_LONG"]);
    expect(a2.nextState.armedLongEntry).toBe(false);
  });

  it("short exit requires profit: arms on cross down 30, closes on cross up 30 if pnl > 0", () => {
    let state = createInitialSwingState();
    ({ nextState: state } = stepSwing(state, baseConfig, { rsi: 31, positionAmt: -1, pnl: -1 }));

    const a1 = stepSwing(state, baseConfig, { rsi: 29, positionAmt: -1, pnl: -1 });
    expect(a1.actions).toEqual([]);
    expect(a1.nextState.armedShortExit).toBe(true);
    state = a1.nextState;

    const a2 = stepSwing(state, baseConfig, { rsi: 31, positionAmt: -1, pnl: 0 });
    expect(a2.actions).toEqual([]); // pnl not strictly positive
    expect(a2.nextState.armedShortExit).toBe(true);
    state = a2.nextState;

    const a3 = stepSwing(state, baseConfig, { rsi: 31, positionAmt: -1, pnl: 0.01 });
    // No cross (prev=31 -> 31), still armed.
    expect(a3.actions).toEqual([]);

    // Cross down then up to trigger close with profit
    const a4 = stepSwing(a3.nextState, baseConfig, { rsi: 29, positionAmt: -1, pnl: 0.01 });
    const a5 = stepSwing(a4.nextState, baseConfig, { rsi: 31, positionAmt: -1, pnl: 0.01 });
    expect(a5.actions.map((a) => a.type)).toEqual(["CLOSE_POSITION"]);
    expect(a5.nextState.armedShortExit).toBe(false);
  });

  it("long exit requires profit: arms on cross up 70, closes on cross down 70 if pnl > 0", () => {
    let state = createInitialSwingState();
    ({ nextState: state } = stepSwing(state, baseConfig, { rsi: 69, positionAmt: 1, pnl: 0 }));

    const a1 = stepSwing(state, baseConfig, { rsi: 71, positionAmt: 1, pnl: 0 });
    expect(a1.actions).toEqual([]);
    expect(a1.nextState.armedLongExit).toBe(true);
    state = a1.nextState;

    const a2 = stepSwing(state, baseConfig, { rsi: 69, positionAmt: 1, pnl: 0.01 });
    expect(a2.actions.map((a) => a.type)).toEqual(["CLOSE_POSITION"]);
    expect(a2.nextState.armedLongExit).toBe(false);
  });

  it("clears entry arms when a position is present", () => {
    let state = createInitialSwingState();
    ({ nextState: state } = stepSwing(state, baseConfig, { rsi: 69, positionAmt: 0, pnl: 0 }));

    // Arm short entry.
    state = stepSwing(state, baseConfig, { rsi: 71, positionAmt: 0, pnl: 0 }).nextState;
    expect(state.armedShortEntry).toBe(true);

    // Now position appears: entry arms should be reset.
    const next = stepSwing(state, baseConfig, { rsi: 71, positionAmt: -1, pnl: 0 });
    expect(next.nextState.armedShortEntry).toBe(false);
    expect(next.nextState.armedLongEntry).toBe(false);
  });
});

