import { describe, expect, it } from "vitest";

import { isOrderActiveStatus } from "./order-status";

describe("isOrderActiveStatus", () => {
  it("treats empty status as active", () => {
    expect(isOrderActiveStatus(undefined)).toBe(true);
    expect(isOrderActiveStatus("")).toBe(true);
    expect(isOrderActiveStatus("   ")).toBe(true);
  });

  it("treats typical active statuses as active", () => {
    expect(isOrderActiveStatus("NEW")).toBe(true);
    expect(isOrderActiveStatus("PARTIALLY_FILLED")).toBe(true);
    expect(isOrderActiveStatus("waiting_price")).toBe(true);
  });

  it("treats final/non-open statuses as inactive", () => {
    expect(isOrderActiveStatus("FILLED")).toBe(false);
    expect(isOrderActiveStatus("CANCELED")).toBe(false);
    expect(isOrderActiveStatus("CANCELLED")).toBe(false);
    expect(isOrderActiveStatus("REJECTED")).toBe(false);
    expect(isOrderActiveStatus("EXPIRED")).toBe(false);
    expect(isOrderActiveStatus("TRIGGERED")).toBe(false);
    expect(isOrderActiveStatus("CLOSED")).toBe(false);
    expect(isOrderActiveStatus("closed_by_user")).toBe(false);
  });
});

