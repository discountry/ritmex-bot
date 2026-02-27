import { describe, expect, it } from "vitest";

import { scaleQuantityWithMinimum, scaledToDecimalString, decimalToScaled } from "../../src/exchanges/lighter/decimal";

describe("scaleQuantityWithMinimum", () => {
  it("raises tiny positive quantities to the minimum step", () => {
    const scaled = scaleQuantityWithMinimum(0.00001, 4);
    expect(scaled).toBe(1n);
    expect(scaledToDecimalString(scaled, 4)).toBe("0.0001");
  });

  it("raises tiny negative quantities to the negative minimum step", () => {
    const scaled = scaleQuantityWithMinimum(-0.00001, 4);
    expect(scaled).toBe(-1n);
    expect(scaledToDecimalString(scaled, 4)).toBe("-0.0001");
  });

  it("keeps zero quantities at zero", () => {
    const scaled = scaleQuantityWithMinimum(0, 4);
    expect(scaled).toBe(0n);
  });

  it("preserves values already aligned to the step", () => {
    const aligned = scaleQuantityWithMinimum(0.0002, 4);
    expect(aligned).toBe(decimalToScaled(0.0002, 4));
  });
});
