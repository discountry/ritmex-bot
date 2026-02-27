import { describe, expect, it } from "vitest";

import { isUnknownOrderError } from "./errors";

describe("isUnknownOrderError", () => {
  it("matches Nado digest-not-found by code", () => {
    const err = Object.assign(
      new Error("2020: Order with the provided digest (0xdeadbeef) could not be found."),
      { code: 2020 }
    );
    expect(isUnknownOrderError(err)).toBe(true);
  });

  it("matches Nado digest-not-found by message", () => {
    const err = new Error("Order with the provided digest (0xdeadbeef) could not be found.");
    expect(isUnknownOrderError(err)).toBe(true);
  });

  it("does not match unrelated errors", () => {
    expect(isUnknownOrderError(new Error("insufficient balance"))).toBe(false);
  });
});

