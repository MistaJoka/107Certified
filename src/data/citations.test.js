import { describe, it, expect } from "vitest";
import { SOURCES } from "./sources.js";
import { ALL_NUMBERS } from "./hardNumbers.js";
import { TREES } from "./trees.js";

const checkSrc = (records, name) => {
  for (const r of records) {
    expect(r.src, `${name}:${r.id || r.t || JSON.stringify(r).slice(0, 40)}`).not.toBe(undefined);
    if (r.src !== null) expect(SOURCES[r.src.doc], `${name} bad doc`).toBeTruthy();
  }
};

describe("citation coverage", () => {
  it("hard numbers", () => checkSrc(ALL_NUMBERS, "hardNumbers"));
  it("decision tree leaves", () => {
    for (const t of TREES)
      checkSrc(Object.values(t.nodes).filter((n) => n.verdict), `trees:${t.id}`);
  });
});
