import { describe, it, expect } from "vitest";
import { SOURCES } from "./sources.js";
import { ALL_NUMBERS } from "./hardNumbers.js";
import { TREES } from "./trees.js";
import { CARD_SECTIONS, OOP_MATRIX, OOP_CARDS, CERT_STEPS } from "./cards.js";
import { AIRSPACE_ITEMS, DATABLOCK_SRC } from "./airspace.js";
import { WX_CARDS, METAR_SRC, TAF_SRC } from "./weather.js";
import { GRID_DETAILS as AUTH_GRID, TFR_CARDS, NOTAM_SRC, LAANC_SRC } from "./authorization.js";
import { FIELD_CARDS } from "./field.js";
import { RECORDS } from "./searchIndex.js";
import { SECTIONS } from "../theme.js";

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

describe("citation coverage — decoders", () => {
  it("airspace items", () => {
    checkSrc(AIRSPACE_ITEMS, "airspace");
    expect(SOURCES[DATABLOCK_SRC.doc]).toBeTruthy();
  });
  it("weather cards + strip sources", () => {
    checkSrc(WX_CARDS, "wxCards");
    expect(SOURCES[METAR_SRC.doc]).toBeTruthy();
    expect(SOURCES[TAF_SRC.doc]).toBeTruthy();
  });
});

describe("citation coverage — authorization", () => {
  it("grid, tfr, strips", () => {
    checkSrc(Object.values(AUTH_GRID), "authGrid");
    checkSrc(TFR_CARDS, "tfrCards");
    expect(SOURCES[NOTAM_SRC.doc]).toBeTruthy();
    expect(SOURCES[LAANC_SRC.doc]).toBeTruthy();
  });
});

describe("citation coverage — field awareness", () => {
  it("field cards have src or explicit null", () => checkSrc(FIELD_CARDS, "field"));
});

describe("search index invariants", () => {
  it("record ids are unique", () => {
    const ids = RECORDS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("every record's section is registered", () => {
    const known = new Set(SECTIONS.map((s) => s.id));
    for (const r of RECORDS) expect(known.has(r.section), r.id).toBe(true);
  });
});
