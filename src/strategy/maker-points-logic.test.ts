import { describe, expect, it } from "vitest";
import {
  bandRepriceToleranceBps,
  buildBandTargets,
  buildBpsTargets,
  makerPointsMultiplier,
  resolveSafeQuotePrice,
  shouldKeepQuote,
  signedDistanceBps,
} from "./maker-points-logic";

describe("maker points target builder", () => {
  it("uses the default bps per enabled band", () => {
    const targets = buildBpsTargets({
      band0To10: true,
      band10To30: true,
      band30To100: true,
    });
    expect(targets).toEqual([9, 29, 40]);
  });

  it("skips disabled bands", () => {
    const targets = buildBpsTargets({
      band0To10: true,
      band10To30: false,
      band30To100: true,
    });
    expect(targets).toEqual([9, 40]);
  });

  it("lets an explicit bps override the band default", () => {
    const targets = buildBandTargets({
      band0To10: true,
      band10To30: true,
      band30To100: true,
      band0To10Bps: 5,
      band30To100Bps: 60,
    });
    expect(targets).toEqual([
      { band: "0-10", bps: 5 },
      { band: "10-30", bps: 29 },
      { band: "30-100", bps: 60 },
    ]);
  });

  it("caps a configured bps at the zero-points cliff", () => {
    const targets = buildBpsTargets({
      band0To10: false,
      band10To30: false,
      band30To100: true,
      band30To100Bps: 250,
    });
    expect(targets).toEqual([100]);
  });
});

describe("maker points multiplier curve", () => {
  // 活动公布的样例点，用来锁住三段折线的系数
  it.each([
    [2, 0.88],
    [5, 0.7],
    [10, 0.4],
    [20, 0.2625],
    [50, 0.0893],
  ])("matches the published example at %i bps", (distance, expected) => {
    expect(makerPointsMultiplier(distance)).toBeCloseTo(expected, 4);
  });

  it("returns zero at and beyond the 100 bps cliff", () => {
    expect(makerPointsMultiplier(100)).toBe(0);
    expect(makerPointsMultiplier(101)).toBe(0);
  });

  it("ranks 40 bps far above the old 99 bps edge quote", () => {
    expect(makerPointsMultiplier(40)).toBeCloseTo(0.1071, 4);
    expect(makerPointsMultiplier(99)).toBeCloseTo(0.0018, 4);
  });
});

describe("safe quote price", () => {
  const base = { targetBps: 40, maxDistanceBps: 95 };

  it("picks the lower of mark/book for a buy", () => {
    // mark 低于 bid1 时以 mark 为基准更远离盘口
    const price = resolveSafeQuotePrice({ ...base, side: "BUY", markPrice: 90_000, bookPrice: 90_020 });
    expect(price).toBeCloseTo(90_000 * (1 - 0.004), 6);
  });

  it("picks the higher of mark/book for a sell", () => {
    const price = resolveSafeQuotePrice({ ...base, side: "SELL", markPrice: 90_050, bookPrice: 90_020 });
    expect(price).toBeCloseTo(90_050 * (1 + 0.004), 6);
  });

  it("falls back to the book when mark is unavailable", () => {
    const price = resolveSafeQuotePrice({ ...base, side: "BUY", markPrice: null, bookPrice: 90_000 });
    expect(price).toBeCloseTo(90_000 * (1 - 0.004), 6);
  });

  it("clamps a safer-but-worthless price back inside the cliff", () => {
    // bid1 已经砸到 mark 下方，照盘口算出的买价会被推过 100 bps 变成零积分
    const price = resolveSafeQuotePrice({
      side: "BUY",
      targetBps: 90,
      maxDistanceBps: 95,
      markPrice: 90_500,
      bookPrice: 90_000,
    });
    expect(signedDistanceBps("BUY", price!, 90_500)).toBeCloseTo(95, 6);
  });
});

describe("band reprice tolerance", () => {
  it("keeps the floor for near bands and scales up for far bands", () => {
    expect(bandRepriceToleranceBps(9, 3, 0.15)).toBeCloseTo(3, 6);
    expect(bandRepriceToleranceBps(40, 3, 0.15)).toBeCloseTo(6, 6);
  });
});

describe("sticky quote decision", () => {
  const base = { side: "BUY" as const, anchor: 90_000, targetBps: 40, toleranceBps: 6, maxDistanceBps: 95 };

  it("keeps a quote that drifted inside the tolerance", () => {
    // 89_650 距 mark 38.9 bps，仍在 40±6 内
    expect(shouldKeepQuote({ ...base, existingPrice: 89_650 })).toBe(true);
  });

  it("drops a quote that drifted outside the tolerance", () => {
    // 89_500 距 mark 55.6 bps
    expect(shouldKeepQuote({ ...base, existingPrice: 89_500 })).toBe(false);
  });

  it("drops a quote that crossed to the wrong side of mark", () => {
    expect(shouldKeepQuote({ ...base, existingPrice: 90_100 })).toBe(false);
  });

  it("drops a quote that fell out of the scoring range", () => {
    expect(shouldKeepQuote({ ...base, targetBps: 90, toleranceBps: 20, existingPrice: 89_100 })).toBe(false);
  });
});
