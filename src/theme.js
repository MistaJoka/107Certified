// ── DESIGN TOKENS ─ "sectional chart at night" ────────────────────
export const T = {
  ink: "#0D141F", panel: "#161F2D", panel2: "#1C2736",
  line: "#2A3648", text: "#E9EEF5", dim: "#8593A6",
  magenta: "#E056A9", blue: "#5A96DB", amber: "#E8B04B",
  green: "#5BCB8E", red: "#E06060", purple: "#9A86D9",
};

export const CAT = {
  REG:   { c: T.amber,   label: "REG" },
  CHART: { c: T.magenta, label: "CHART" },
  WX:    { c: T.blue,    label: "WX" },
  LOAD:  { c: T.purple,  label: "LOAD" },
  OPS:   { c: T.green,   label: "OPS" },
};

export const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

// ── SECTION REGISTRY ─ every view reachable from home + search ─────
export const SECTIONS = [
  { id: "numbers",     title: "Hard Numbers",       cat: "REG",   glyph: "#",
    blurb: "400 ft · 100 mph · 3 SM · 55 lb · 10 days · 24 mo" },
  { id: "canifly",     title: "Can I Fly?",         cat: "REG",   glyph: "?",
    blurb: "Yes/no decision trees for the calls you actually make" },
  { id: "airspace",    title: "Airspace Decoder",   cat: "CHART", glyph: "◎",
    blurb: "Tap a chart symbol → class, ceiling, authorization" },
  { id: "weather",     title: "Weather Decoder",    cat: "WX",    glyph: "☁",
    blurb: "Tap a raw METAR / TAF apart, token by token" },
  { id: "night",       title: "Night Ops",          cat: "REG",   glyph: "☾",
    blurb: "Civil twilight, lights, illusions, dark adaptation" },
  { id: "airport",     title: "Airport Ops",        cat: "OPS",   glyph: "⌖",
    blurb: "Runways, pattern legs, CTAF, hold-short lines" },
  { id: "remoteid",    title: "Remote ID",          cat: "REG",   glyph: "((•))",
    blurb: "Standard · broadcast module · FRIA" },
  { id: "oop",         title: "Ops Over People",    cat: "REG",   glyph: "⚉",
    blurb: "Category 1–4 matrix — what each allows" },
  { id: "rightofway",  title: "Rules of the Air",   cat: "REG",   glyph: "✈",
    blurb: "Right-of-way, careless ops, VO duties, waivers" },
  { id: "emergency",   title: "Emergency / Accident", cat: "OPS", glyph: "▲",
    blurb: "What to do, when to report, what counts" },
  { id: "cert",        title: "Certification Path", cat: "REG",   glyph: "➤",
    blurb: "IACRA → FTN → PSI exam → Form 8710-13" },
  { id: "performance", title: "Loading & Performance", cat: "LOAD", glyph: "∆",
    blurb: "Forces, stall / AoA, load factor, density altitude" },
  { id: "mind",        title: "Pilot Mind",         cat: "OPS",   glyph: "◉",
    blurb: "MAIIR, DECIDE, PAVE, IMSAFE, physiology" },
  { id: "maintenance", title: "Maintenance",        cat: "OPS",   glyph: "⚙",
    blurb: "Preflight, batteries, firmware, logs" },
];
