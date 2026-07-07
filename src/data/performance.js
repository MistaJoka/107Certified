// ── PERFORMANCE MATH — pure, exam-oriented, unit-tested ────────────
import { S } from "./sources.js";

// Load factor in a level, coordinated turn: n = 1 / cos(bank).
// Stall speed rises with the square root of load factor.
export const loadFactor = (deg) => 1 / Math.cos((deg * Math.PI) / 180);
export const stallMultiplier = (deg) => Math.sqrt(loadFactor(deg));

export const BANK_PRESETS = [30, 45, 60];
export const BANK_MIN = 0;
export const BANK_MAX = 80; // stop short of 90° where cos → 0 (infinite load factor)

// deep-link anchors — shared by the view (DOM ids) and the search index
export const LOADFACTOR_ID = "perf-loadfactor";
export const DA_ID = "perf-da";

export const LOAD_COPY = {
  why: "Steeper bank → the wing must make more lift → higher effective weight → stall speed climbs.",
  tip: "60° bank = 2 G = stall speed up ~41%. That's the number the test asks for.",
  src: S("PHAK"),
};

// Density altitude fuses elevation + temperature into one axis. Bands from the
// standard approximation  DA ≈ PA + 120 × (OAT − ISA),  ISA = 15 − 2×(alt/1000) °C:
//   sea level, 15°C → 0    + 120×(15−15) = 0     → ≈ 0 ft
//   1,000 ft,  35°C → 1000 + 120×(35−13) = 3,640 → ≈ 3,500 ft
//   5,000 ft,  30°C → 5000 + 120×(30−5)  = 8,000 → ≈ 8,000 ft
export const DA_SCENARIOS = [
  { id: "da-standard", label: "Standard day", conditions: "Sea level · 15°C (ISA)",
    daBand: "≈ 0 ft", hit: "Book performance — the reference every chart assumes.",
    src: S("PHAK") },
  { id: "da-hot-field", label: "Hot summer field", conditions: "1,000 ft · 35°C",
    daBand: "≈ 3,500 ft",
    hit: "Longer takeoff roll and weaker climb — the air is already 'higher' than the field.",
    src: S("PHAK") },
  { id: "da-high-hot", label: "High & hot", conditions: "5,000 ft · 30°C",
    daBand: "≈ 8,000+ ft",
    hit: "Sharply reduced climb and thrust; props and rotors bite thin air. The classic performance trap.",
    src: S("PHAK") },
];

export const DA_TIP =
  "High + Hot + Humid = high density altitude = the aircraft performs as if it were at a higher altitude.";
