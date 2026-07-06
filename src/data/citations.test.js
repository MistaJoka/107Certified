import { describe, it, expect } from "vitest";
import { SOURCES } from "./sources.js";
import { ALL_NUMBERS } from "./hardNumbers.js";
import { TREES } from "./trees.js";
import { CARD_SECTIONS, OOP_MATRIX, OOP_CARDS, CERT_STEPS } from "./cards.js";

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

describe("citation coverage — cards", () => {
  it("all card sections", () => {
    for (const [name, cards] of Object.entries(CARD_SECTIONS)) checkSrc(cards, name);
  });
  it("oop matrix + cards + cert steps", () => {
    checkSrc(OOP_MATRIX, "oopMatrix");
    checkSrc(OOP_CARDS, "oopCards");
    checkSrc(CERT_STEPS, "certSteps");
  });
});
