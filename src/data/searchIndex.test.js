import { describe, it, expect } from "vitest";
import { search } from "./searchIndex.js";

describe("global search — performance calculators", () => {
  it("finds the load-factor calculator and routes it to #/performance", () => {
    const hits = search("load factor");
    expect(hits.some((r) => r.id === "perf-loadfactor" && r.section === "performance")).toBe(true);
  });

  it("finds the density-altitude calculator and routes it to #/performance", () => {
    const hits = search("density altitude");
    expect(hits.some((r) => r.id === "perf-da" && r.section === "performance")).toBe(true);
  });

  it("returns nothing when a term matches no record (AND semantics)", () => {
    expect(search("zzzznotarealterm")).toEqual([]);
  });
});
