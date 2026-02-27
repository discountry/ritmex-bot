export type SwingDirection = "long" | "short" | "both";

export interface SwingLogicConfig {
  direction: SwingDirection;
  rsiHigh: number; // e.g. 70
  rsiLow: number; // e.g. 30
}

export interface SwingState {
  prevRsi: number | null;
  armedShortEntry: boolean;
  armedShortExit: boolean;
  armedLongEntry: boolean;
  armedLongExit: boolean;
}

export type SwingAction =
  | { type: "OPEN_SHORT"; reason: string }
  | { type: "OPEN_LONG"; reason: string }
  | { type: "CLOSE_POSITION"; reason: string };

export interface SwingStepInput {
  rsi: number | null;
  positionAmt: number;
  pnl: number;
}

export function createInitialSwingState(): SwingState {
  return {
    prevRsi: null,
    armedShortEntry: false,
    armedShortExit: false,
    armedLongEntry: false,
    armedLongExit: false,
  };
}

const EPS = 1e-8;

function crossUp(prev: number | null, next: number, threshold: number): boolean {
  if (prev == null) return false;
  return prev <= threshold && next > threshold;
}

function crossDown(prev: number | null, next: number, threshold: number): boolean {
  if (prev == null) return false;
  return prev >= threshold && next < threshold;
}

export function stepSwing(
  state: SwingState,
  config: SwingLogicConfig,
  input: SwingStepInput
): { nextState: SwingState; actions: SwingAction[] } {
  const nextState: SwingState = { ...state };
  const actions: SwingAction[] = [];

  const rsi = input.rsi;
  const hasRsi = typeof rsi === "number" && Number.isFinite(rsi);
  const prevRsi = nextState.prevRsi;

  const direction = config.direction;
  const allowLong = direction === "long" || direction === "both";
  const allowShort = direction === "short" || direction === "both";

  const positionAmt = Number(input.positionAmt);
  const pnl = Number(input.pnl);
  const isFlat = !Number.isFinite(positionAmt) || Math.abs(positionAmt) <= EPS;
  const isLong = Number.isFinite(positionAmt) && positionAmt > EPS;
  const isShort = Number.isFinite(positionAmt) && positionAmt < -EPS;

  // If RSI is missing/invalid, avoid mutating state.
  if (!hasRsi) {
    return { nextState, actions };
  }

  // Keep prevRsi updated once we have a valid reading.
  nextState.prevRsi = rsi;

  if (isFlat) {
    // When flat, exit arms are irrelevant.
    nextState.armedShortExit = false;
    nextState.armedLongExit = false;

    if (!allowShort) {
      nextState.armedShortEntry = false;
    } else {
      if (crossUp(prevRsi, rsi, config.rsiHigh)) {
        nextState.armedShortEntry = true;
      }
      if (nextState.armedShortEntry && crossDown(prevRsi, rsi, config.rsiHigh)) {
        actions.push({ type: "OPEN_SHORT", reason: "RSI armed above high, then crossed below high" });
        nextState.armedShortEntry = false;
        // Avoid impossible dual-entries.
        nextState.armedLongEntry = false;
      }
    }

    if (!allowLong) {
      nextState.armedLongEntry = false;
    } else {
      if (crossDown(prevRsi, rsi, config.rsiLow)) {
        nextState.armedLongEntry = true;
      }
      if (nextState.armedLongEntry && crossUp(prevRsi, rsi, config.rsiLow)) {
        actions.push({ type: "OPEN_LONG", reason: "RSI armed below low, then crossed above low" });
        nextState.armedLongEntry = false;
        nextState.armedShortEntry = false;
      }
    }

    if (actions.length > 1) {
      // Defensive: avoid opening both directions in one step.
      return { nextState: { ...nextState, armedShortEntry: false, armedLongEntry: false }, actions: [] };
    }

    return { nextState, actions };
  }

  // When exposed, entry arms are irrelevant (strategy does not pyramid).
  nextState.armedShortEntry = false;
  nextState.armedLongEntry = false;

  // Exits are always allowed (even if direction config changes) to avoid trapping positions.
  if (isShort) {
    nextState.armedLongExit = false;
    if (crossDown(prevRsi, rsi, config.rsiLow)) {
      nextState.armedShortExit = true;
    }
    if (nextState.armedShortExit && crossUp(prevRsi, rsi, config.rsiLow) && pnl > 0) {
      actions.push({ type: "CLOSE_POSITION", reason: "RSI exit armed below low, then crossed above low with profit" });
      nextState.armedShortExit = false;
    }
    return { nextState, actions };
  }

  if (isLong) {
    nextState.armedShortExit = false;
    if (crossUp(prevRsi, rsi, config.rsiHigh)) {
      nextState.armedLongExit = true;
    }
    if (nextState.armedLongExit && crossDown(prevRsi, rsi, config.rsiHigh) && pnl > 0) {
      actions.push({ type: "CLOSE_POSITION", reason: "RSI exit armed above high, then crossed below high with profit" });
      nextState.armedLongExit = false;
    }
    return { nextState, actions };
  }

  return { nextState, actions };
}

