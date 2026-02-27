import { describe, expect, it } from "vitest";
import { roundQtyDownToStep, roundDownToTick, decimalsOf } from "../../src/utils/math";

describe("utils/math precision", () => {
  it("keeps quantity intact when it matches the step exactly", () => {
    expect(roundQtyDownToStep(0.01, 0.00001)).toBe(0.01);
    expect(roundQtyDownToStep(0.01, 0.001)).toBe(0.01);
  });

  it("floors quantity to the nearest valid step without precision loss", () => {
    expect(roundQtyDownToStep(1.23456789, 0.001)).toBe(1.234);
    expect(roundQtyDownToStep(0.00009, 0.00005)).toBe(0.00005);
  });

  it("rounds prices down respecting tick size", () => {
    expect(roundDownToTick(20345.123456, 0.001)).toBe(20345.123);
    expect(roundDownToTick(1.00000009, 0.00001)).toBe(1);
  });

  it("detects decimal places for powers of ten", () => {
    expect(decimalsOf(0.00000001)).toBe(8);
    expect(decimalsOf(0.25)).toBe(2);
    expect(decimalsOf(1)).toBe(0);
  });
});
