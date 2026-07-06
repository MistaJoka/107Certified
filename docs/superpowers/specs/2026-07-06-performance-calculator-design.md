# 107Certified: Interactive Performance Calculators — Design

**Date:** 2026-07-06
**Goal:** Turn the static "Loading & Performance" module into an interactive exam-prep
tool by adding two calculators — **Load Factor & Stall Speed** and **Density Altitude** —
above the existing 7 `LOAD` reference cards. The app stays static, offline, and
zero-dependency: the calculators are pure client-side math, no user state persisted.

## Scope

In scope:

1. New `Performance.jsx` view replacing the generic `CardSection` for `#/performance`
2. New `data/performance.js` — pure calculation functions + the density-altitude
   scenario table + all display strings
3. Load Factor calculator: hybrid input (preset chips + slider), live outputs
4. Density Altitude calculator: scenario chips, per-scenario readout
5. New `performance.test.js` covering the math and the scenario table
6. Two new search records (one per calculator) in `searchIndex.js`
7. `App.jsx` route swap: `performance` → `Performance` view

Out of scope (YAGNI): humidity as a quantitative input, weight & balance / CG math,
real-drone endurance or payload tools, a free slider for density altitude, any new
home-screen tile or 18th module, component-render tests.

## 1. Placement & architecture

"Loading & Performance" currently routes through the shared `CardSection` component
(via `SECTIONS` + the `VIEWS` fallback in `App.jsx`). It graduates to its own view:

- New `src/components/Performance.jsx`, registered in `VIEWS` in `App.jsx` alongside
  `numbers`, `airspace`, etc.
- The view renders, top to bottom: **Load Factor calculator → Density Altitude
  calculator → the existing 7 `LOAD` cards**. The cards reuse the same `Reveal` list
  the generic `CardSection` builds from `CARD_SECTIONS.performance` — nothing is lost,
  and `focusId` deep-linking into those cards still works.
- The home tile, glyph (`∆`), title, and `cat: "LOAD"` are unchanged.

All math lives as **pure functions in `src/data/performance.js`**, so the component only
renders and the logic is unit-testable in isolation. This closes one of the
"no logic tests" hardening gaps identified in the module review.

## 2. Load Factor & Stall Speed calculator

A single continuous input (bank angle), so it gets the **full hybrid**:

- **Preset chips:** `[30° · 45° · 60°]` — the exam-classic values. Tapping one sets the
  angle and highlights the chip.
- **Slider:** `0–80°`, integer steps. Chip and slider are two views of one state; moving
  either updates both.

**Outputs (live):**

- `loadFactor(deg) = 1 / cos(deg)` — rendered as a big mono value in the `LOAD` color,
  e.g. `2.0 G` at 60°.
- `stallMultiplier(deg) = Math.sqrt(loadFactor(deg))` — e.g. `×1.41` at 60°.

**Readout:**

- One-line static *why*: "Steeper bank → the wing must make more lift → higher effective
  weight → stall speed climbs."
- Exam-tip strip (the accent-bordered `rule` idiom): *"60° bank = 2 G = stall speed up
  ~41%. That's the number the test asks for."*
- `SourceDrawer` → `S("PHAK")` (Pilot's Handbook — aerodynamics / load factor).

**Edge behavior:** angle clamped to `[0, 80]`. At exactly 90° `cos` → 0 (infinite load
factor); the slider max of 80° avoids the singularity and a short note states that a
level, coordinated turn cannot reach 90° of bank without losing altitude.

## 3. Density Altitude calculator

Density altitude fuses elevation + temperature into one cold-low→hot-high axis. A free
slider would imply a precision the fused axis can't honestly deliver, so this calculator
is **scenario chips only** (no slider) — a deliberate departure from the hybrid pattern:

- **Scenario chips:** `[Standard day · Hot summer field · High & hot]`.
- Each scenario is a row in a table in `performance.js`:
  `{ id, label, conditions, daBand, hit, src }`.

**Readout (per selected scenario):**

- **DA band** — mono value, e.g. `≈ 0 ft`, `≈ 3,500 ft`, `≈ 8,000+ ft` (bands, not
  false-precision point values, since inputs are qualitative).
- **`conditions`** — the elevation/temperature that produce that band.
- **Performance hit** (`hit`) — plain language: longer takeoff roll, reduced climb rate,
  less propeller/rotor thrust in thinner air.
- Exam-tip strip: *"High + Hot + Humid = high density altitude = the aircraft performs
  as if it were at a higher altitude."*
- `SourceDrawer` → `S("PHAK")` (Pilot's Handbook — density altitude / performance).

Humidity is named only in the exam-tip text, never as an input.

## 4. Data shape (`src/data/performance.js`)

```js
export const loadFactor = (deg) => 1 / Math.cos(deg * Math.PI / 180);
export const stallMultiplier = (deg) => Math.sqrt(loadFactor(deg));

export const BANK_PRESETS = [30, 45, 60];
export const BANK_MIN = 0, BANK_MAX = 80;

export const LOAD_COPY = { why: "...", tip: "...", src: S("PHAK") };

export const DA_SCENARIOS = [
  { id: "da-standard", label: "Standard day", conditions: "Sea level, 15°C (ISA)",
    daBand: "≈ 0 ft", hit: "...", src: S("PHAK") },
  { id: "da-hot-field", label: "Hot summer field", conditions: "1,000 ft, 35°C",
    daBand: "≈ 3,500 ft", hit: "...", src: S("PHAK") },
  { id: "da-high-hot", label: "High & hot", conditions: "5,000 ft, 30°C",
    daBand: "≈ 8,000+ ft", hit: "...", src: S("PHAK") },
];
```

Exact `daBand` values will be computed once from the standard approximation
`DA ≈ PA + 120 × (OAT − ISA_temp)` (ISA_temp = 15 − 2 × altitude_thousands °C) and
frozen into the table as bands, with the arithmetic shown in a code comment so a
reviewer can re-derive them.

## 5. Wiring: search & routing

- `searchIndex.js` gains two records so the home search finds the calculators:
  - `{ id: "perf-loadfactor", section: "performance", cat: "LOAD",
       title: "Load factor & stall speed vs bank angle", body: "...",
       kw: "load factor stall speed bank angle 60 degrees 2 g" }`
  - `{ id: "perf-da", section: "performance", cat: "LOAD",
       title: "Density altitude — performance", body: "...",
       kw: "density altitude high hot humid performance takeoff climb" }`
  The `id`s double as `focusId` anchors: searching "load factor" → tapping the result
  routes to `#/performance/perf-loadfactor`, which the view uses (via `useFocusFlash`)
  to flash the relevant calculator.
- Routing is unchanged — `#/performance` already resolves; only the view behind it
  swaps from `CardSection` to `Performance`.

## Error handling / edge cases

- Bank angle clamped to `[0, 80]`; slider cannot reach the 90° `cos = 0` singularity.
- Density altitude bands are qualitative — labeled as approximations, never presented
  as an exact computed figure, so no false precision.
- Every `src` uses `S("PHAK")`, which already exists in `SOURCES` — no new registry
  entry, no risk of an unknown-doc build failure.
- `focusId` for a calculator that isn't present (bad hash) → no flash, view still
  renders normally (matches existing `useFocusFlash` behavior).

## Testing / verification

New `src/data/performance.test.js`:

- `loadFactor(0) === 1`; `loadFactor(60)` ≈ `2.0`; `loadFactor(45)` ≈ `1.414`
  (tolerance-based `Math.abs` comparisons).
- `stallMultiplier(0) === 1`; `stallMultiplier(60)` ≈ `1.414`.
- Monotonicity: `loadFactor` strictly increases across `0 → 80°`.
- `DA_SCENARIOS`: every row has a non-empty `label`, `conditions`, `daBand`, `hit`,
  and a `src.doc` that exists in `SOURCES` (mirrors the existing citation test).

Plus: `npm run lint` + `npm run build` clean, and a browser smoke test — chips and
slider update the load-factor readout live, scenario chips switch the DA readout,
both source drawers open, search finds both calculators and deep-links flash them,
and the 7 reference cards still render and open below.
