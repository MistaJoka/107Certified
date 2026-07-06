import { describe, it, expect } from "vitest";
import { SOURCES, GROUPS, S } from "./sources.js";

describe("SOURCES registry", () => {
  it("every entry is complete and well-formed", () => {
    expect(Object.keys(SOURCES).length).toBeGreaterThanOrEqual(16);
    for (const [key, s] of Object.entries(SOURCES)) {
      expect(s.title, key).toBeTruthy();
      expect(s.url, key).toMatch(/^https:\/\//);
      expect(GROUPS, key).toContain(s.group);
      expect(s.use, key).toBeTruthy();
      expect(s.lastChecked, key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("S() builds refs and rejects unknown docs", () => {
    expect(S("PART107", "§107.29")).toEqual({ doc: "PART107", ref: "§107.29" });
    expect(S("AWC")).toEqual({ doc: "AWC" });
    expect(() => S("NOPE")).toThrow(/Unknown source doc/);
  });
});
