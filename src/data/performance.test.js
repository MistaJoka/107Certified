import { describe, it, expect } from "vitest";
import { loadFactor, stallMultiplier, DA_SCENARIOS, BANK_MIN, BANK_MAX } from "./performance.js";
import { SOURCES } from "./sources.js";

const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

describe("load factor math", () => {
  it("is 1 G wings-level and 2 G at 60° bank", () => {
    expect(loadFactor(0)).toBe(1);
    expect(near(loadFactor(60), 2.0)).toBe(true);
    expect(near(loadFactor(45), 1.414)).toBe(true);
  });

  it("stall multiplier is the square root of load factor", () => {
    expect(stallMultiplier(0)).toBe(1);
    expect(near(stallMultiplier(60), 1.414)).toBe(true);
  });

  it("increases monotonically from BANK_MIN to BANK_MAX", () => {
    let prev = -Infinity;
    for (let d = BANK_MIN; d <= BANK_MAX; d++) {
      const n = loadFactor(d);
      expect(n).toBeGreaterThan(prev);
      prev = n;
    }
  });
});

describe("density altitude scenarios", () => {
  it("every scenario is complete and cites a real source", () => {
    expect(DA_SCENARIOS.length).toBeGreaterThanOrEqual(3);
    for (const s of DA_SCENARIOS) {
      expect(s.label, s.id).toBeTruthy();
      expect(s.conditions, s.id).toBeTruthy();
      expect(s.daBand, s.id).toBeTruthy();
      expect(s.hit, s.id).toBeTruthy();
      expect(SOURCES[s.src.doc], s.id).toBeTruthy();
    }
  });
});
