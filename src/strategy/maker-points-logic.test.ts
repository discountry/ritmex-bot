import { describe, expect, it } from "vitest";
import { buildBpsTargets } from "./maker-points-logic";

describe("maker points target builder", () => {
  it("builds fixed bps targets per enabled band", () => {
    const targets = buildBpsTargets({
      band0To10: true,
      band10To30: true,
      band30To100: true,
    });
    expect(targets).toEqual([9, 29, 99]);
  });

  it("skips disabled bands", () => {
    const targets = buildBpsTargets({
      band0To10: true,
      band10To30: false,
      band30To100: true,
    });
    expect(targets).toEqual([9, 99]);
  });
});
