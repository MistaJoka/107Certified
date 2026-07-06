// ── GLOBAL SEARCH — one flat index over every fact in the app ──────
import { ALL_NUMBERS } from "./hardNumbers.js";
import { TREES } from "./trees.js";
import { AIRSPACE_ITEMS, DATABLOCK_TOKENS } from "./airspace.js";
import { METAR_TOKENS, TAF_TOKENS, WX_CARDS } from "./weather.js";
import { CARD_SECTIONS, OOP_MATRIX, OOP_CARDS, CERT_STEPS } from "./cards.js";
import { GRID_DETAILS, LAANC_FLOW, TFR_CARDS, NOTAM_TOKENS } from "./authorization.js";
import { FIELD_CARDS } from "./field.js";
import { SOURCES } from "./sources.js";
import { LOADFACTOR_ID, DA_ID, LOAD_COPY } from "./performance.js";

// record: { id, section, cat, title, body, kw }
export const RECORDS = [];
const add = (r) => RECORDS.push({ kw: "", ...r });

ALL_NUMBERS.forEach((n) =>
  add({ id: n.id, section: "numbers", cat: n.cat, title: `${n.value} — ${n.label}`, body: n.detail, kw: n.kw }));

TREES.forEach((t) => {
  const qs = Object.values(t.nodes).map((n) => n.q || n.text).join(" ");
  add({ id: t.id, section: "canifly", cat: t.cat, title: t.title, body: qs, kw: t.kw });
});

AIRSPACE_ITEMS.forEach((a) =>
  add({ id: a.id, section: "airspace", cat: "CHART", title: `${a.title} — ${a.answer}`, body: a.detail, kw: a.kw }));
DATABLOCK_TOKENS.forEach((tk, i) =>
  add({ id: `datablock-${i}`, section: "airspace", cat: "CHART",
    title: `Data block ${tk.t} — ${tk.label}`, body: tk.m,
    kw: "airport data block sectional decode ctaf elevation" }));

METAR_TOKENS.forEach((tk, i) =>
  add({ id: `metar-${i}`, section: "weather", cat: "WX", title: `METAR ${tk.t} — ${tk.label}`, body: tk.m, kw: "metar decode" }));
TAF_TOKENS.forEach((tk, i) =>
  add({ id: `taf-${i}`, section: "weather", cat: "WX", title: `TAF ${tk.t} — ${tk.label}`, body: tk.m, kw: "taf forecast decode" }));
WX_CARDS.forEach((c) =>
  add({ id: c.id, section: "weather", cat: c.cat, title: c.q, body: `${c.a} ${c.rule || ""}`, kw: c.kw }));

Object.entries(CARD_SECTIONS).forEach(([section, cards]) =>
  cards.forEach((c) =>
    add({ id: c.id, section, cat: c.cat, title: c.q, body: `${c.a} ${c.rule || ""}`, kw: c.kw })));

OOP_MATRIX.forEach((m) =>
  add({ id: `oop-cat${m.cat}`, section: "oop", cat: "REG", title: `Category ${m.cat} — over people`,
    body: `${m.req}. Open-air assemblies: ${m.assembly}. ${m.note}`, kw: m.kw }));
OOP_CARDS.forEach((c) =>
  add({ id: c.id, section: "oop", cat: c.cat, title: c.q, body: `${c.a} ${c.rule || ""}`, kw: c.kw }));

CERT_STEPS.forEach((s) =>
  add({ id: s.id, section: "cert", cat: "REG", title: `Step ${s.step}: ${s.title}`, body: s.detail, kw: s.kw }));

Object.entries(SOURCES).forEach(([key, s]) =>
  add({ id: `lib-${key.toLowerCase()}`, section: "library", cat: "REG",
    title: s.title, body: s.use, kw: "faa official source document library reference" }));

Object.entries(GRID_DETAILS).forEach(([v, d]) =>
  add({ id: `auth-grid-${v}`, section: "authorization", cat: "CHART",
    title: `Facility map grid "${v}" — what it means`,
    body: `${d.meaning} ${d.laanc} ${d.coordination}`,
    kw: "uas facility map grid ceiling laanc altitude zero" }));
LAANC_FLOW.forEach((s, i) =>
  add({ id: `laanc-${i}`, section: "authorization", cat: "CHART",
    title: `Authorization: ${s.cond}`, body: s.action,
    kw: "laanc dronezone further coordination authorization instant" }));
TFR_CARDS.forEach((c) =>
  add({ id: c.id, section: "authorization", cat: c.cat, title: c.q,
    body: `${c.a} ${c.rule || ""}`, kw: c.kw }));
NOTAM_TOKENS.forEach((tk, i) =>
  add({ id: `notam-${i}`, section: "authorization", cat: "CHART",
    title: `NOTAM ${tk.t} — ${tk.label}`, body: tk.m, kw: "notam decode read" }));

FIELD_CARDS.forEach((c) =>
  add({ id: c.id, section: "field", cat: c.cat, title: c.q,
    body: `${c.a} ${c.rule || ""}`, kw: c.kw }));

add({ id: LOADFACTOR_ID, section: "performance", cat: "LOAD",
  title: "Load factor & stall speed vs bank angle",
  body: `${LOAD_COPY.why} ${LOAD_COPY.tip}`,
  kw: "load factor stall speed bank angle 60 degrees 2 g turn accelerated" });
add({ id: DA_ID, section: "performance", cat: "LOAD",
  title: "Density altitude — performance",
  body: "High, hot, and humid raises density altitude: longer takeoff, reduced climb and thrust in thin air.",
  kw: "density altitude high hot humid performance takeoff climb thin air" });

export function search(query) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  return RECORDS.map((r) => {
    const title = r.title.toLowerCase(), body = r.body.toLowerCase(), kw = r.kw.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (title.includes(t)) score += 3;
      else if (kw.includes(t)) score += 2;
      else if (body.includes(t)) score += 1;
      else return null;                      // AND semantics — every term must hit
    }
    return { ...r, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 30);
}
