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
