import { describe, expect, it } from "vitest";

import {
  normalizeAreaName,
  normalizeKosName,
  normalizeWhitespace,
} from "../lib/kos/normalize-text";

describe("kos text normalization", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeWhitespace("  wisma   putri   melati  ")).toBe(
      "wisma putri melati",
    );
  });

  it("normalizes kos names to clean title case", () => {
    expect(normalizeKosName("wisma yolandaa")).toBe("Wisma Yolandaa");
    expect(normalizeKosName("  wisma   putri   melati  ")).toBe(
      "Wisma Putri Melati",
    );
    expect(normalizeKosName("KOS bu rini")).toBe("Kos Bu Rini");
  });

  it("handles hyphenated names", () => {
    expect(normalizeKosName("kost al-fatih")).toBe("Kost Al-Fatih");
    expect(normalizeKosName("putri-ayu")).toBe("Putri-Ayu");
  });

  it("preserves known acronyms and numbers", () => {
    expect(normalizeKosName("wisma bni vip")).toBe("Wisma BNI VIP");
    expect(normalizeKosName("kos ft unsoed 2")).toBe("Kos FT UNSOED 2");
  });

  it("keeps roman numerals readable", () => {
    expect(normalizeKosName("wisma melati iii")).toBe("Wisma Melati III");
  });

  it("normalizes optional area names", () => {
    expect(normalizeAreaName("  balter   kalimanah ")).toBe("Balter Kalimanah");
    expect(normalizeAreaName("   ")).toBeNull();
    expect(normalizeAreaName(null)).toBeNull();
  });
});
