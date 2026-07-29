import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { t } from "../src/i18n";

const SRC = join(import.meta.dirname, "..", "src");
const I18N_FILE = join(SRC, "i18n", "index.ts");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** A string or template literal containing a CJK character. */
const CJK_IN_LITERAL = /["`][^"`\n]*[一-龥][^"`\n]*["`]/;

describe("i18n coverage", () => {
  it("keeps user-facing text out of source files", () => {
    // Chinese literals outside the translation table cannot be shown in English,
    // which is how the order log, grid events and defense alerts stayed
    // untranslatable for so long.
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      if (file === I18N_FILE) continue;
      if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, index) => {
        if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) return;
        if (CJK_IN_LITERAL.test(line)) {
          offenders.push(`${file.slice(SRC.length + 1)}:${index + 1}  ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it("gives every key both a zh and an en translation", () => {
    const source = readFileSync(I18N_FILE, "utf8");
    const table = source.slice(
      source.indexOf("const translations"),
      source.indexOf("const formatTemplate")
    );
    const keys = [...table.matchAll(/^ {2}"([\w.]+)":/gm)].map((m) => m[1]!);
    expect(keys.length).toBeGreaterThan(400);

    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
    expect(duplicates).toEqual([]);

    for (const key of keys) {
      expect(t(key, {}, "zh"), `${key} missing zh`).not.toBe(key);
      expect(t(key, {}, "en"), `${key} missing en`).not.toBe(key);
    }
  });

  it("substitutes placeholders in both languages", () => {
    expect(t("log.order.closePlaced", { side: "BUY" }, "zh")).toContain("BUY");
    expect(t("log.order.closePlaced", { side: "BUY" }, "en")).toContain("BUY");
    expect(t("log.order.closePlaced", { side: "BUY" }, "en")).not.toContain("{side}");
  });

  it("leaves an unknown placeholder visible rather than printing undefined", () => {
    expect(t("log.order.closePlaced", {}, "en")).toContain("{side}");
  });
});
