import { describe, expect, it } from "vitest";
import { computeBollingerBandwidth, getPosition, getSMA } from "../src/utils/strategy";
import type { AsterAccountSnapshot, AsterKline } from "../src/exchanges/types";

const mockSnapshot = (positions: Array<{ symbol: string; amt: number; entry: number; pnl: number }> = []): AsterAccountSnapshot => ({
  canTrade: true,
  canDeposit: true,
  canWithdraw: true,
  updateTime: Date.now(),
  totalWalletBalance: "0",
  totalUnrealizedProfit: "0",
  positions: positions.map((p) => ({
    symbol: p.symbol,
    positionAmt: String(p.amt),
    entryPrice: String(p.entry),
    unrealizedProfit: String(p.pnl),
    positionSide: "BOTH",
    updateTime: Date.now(),
  })),
  assets: [],
});

const mockKlines = (values: number[]): AsterKline[] =>
  values.map((value, index) => ({
    openTime: index,
    open: String(value),
    high: String(value),
    low: String(value),
    close: String(value),
    volume: "0",
    closeTime: index + 1,
    numberOfTrades: 0,
  }));

describe("strategy utils", () => {
  it("returns default position when snapshot missing", () => {
    expect(getPosition(null, "BTCUSDT")).toEqual({ positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null });
  });

  it("extracts position for symbol", () => {
    const snapshot = mockSnapshot([{ symbol: "BTCUSDT", amt: 1, entry: 100, pnl: 5 }]);
    expect(getPosition(snapshot, "BTCUSDT")).toEqual({ positionAmt: 1, entryPrice: 100, unrealizedProfit: 5, markPrice: null });
  });

  it("returns zero position when symbol not found", () => {
    const snapshot = mockSnapshot([{ symbol: "ETHUSDT", amt: 2, entry: 200, pnl: 10 }]);
    expect(getPosition(snapshot, "BTCUSDT")).toEqual({ positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null });
  });

  it("returns null when not enough klines", () => {
    expect(getSMA(mockKlines([1, 2, 3]), 5)).toBeNull();
  });

  it("computes SMA for latest closes", () => {
    const data = mockKlines(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(getSMA(data, 30)).toBe(15.5);
  });

  it("returns null Bollinger bandwidth when data insufficient", () => {
    const klines = mockKlines([100, 101, 102]);
    expect(computeBollingerBandwidth(klines, 20, 2)).toBeNull();
  });

  it("computes Bollinger bandwidth ratio", () => {
    const closes = [...Array(19).fill(100), 110];
    const klines = mockKlines(closes);
    const bandwidth = computeBollingerBandwidth(klines, 20, 2);
    expect(bandwidth).not.toBeNull();
    expect(bandwidth ?? 0).toBeCloseTo(0.0867443, 5);
  });
});
