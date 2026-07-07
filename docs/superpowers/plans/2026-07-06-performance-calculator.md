# Performance Calculators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the static "Loading & Performance" module into an interactive exam-prep tool with two calculators — Load Factor & Stall Speed, and Density Altitude — above the existing 7 reference cards.

**Architecture:** All math and copy live as pure exports in a new `src/data/performance.js` (unit-tested in isolation). A new `src/components/Performance.jsx` view renders the two calculators, then reuses the existing `Reveal` card list for the 7 `LOAD` cards below. `App.jsx` swaps the `performance` route from the generic `CardSection` to the new view. Two records are added to the global search index so the calculators are searchable and deep-linkable.

**Tech Stack:** React 19 (function components, hooks, inline styles), Vite 8, Vitest 4, oxlint. No new dependencies.

## Global Constraints

- Static, offline, zero-dependency: no new npm packages, no network calls, no persisted user state.
- Mobile-first: the app renders inside a `max-width: 560px` column.
- Design tokens only — import colors from `src/theme.js` (`T`, `CAT`); never hardcode hex.
- `LOAD` category color is `T.purple` (`CAT.LOAD.c`). Use it for all calculator accents.
- Every calculator readout ends with a `SourceDrawer`; both calculators cite `S("PHAK")` — `PHAK` already exists in `SOURCES`, add no new source.
- Monospace font is the `mono` export from `theme.js`.
- Tests use Vitest (`import { describe, it, expect } from "vitest"`); run with `npm test`.
- Commit after each task with a `feat:`/`test:` message ending the body with the repo's `Co-Authored-By` trailer.

---

### Task 1: Performance math & data module

**Files:**
- Create: `src/data/performance.js`
- Test: `src/data/performance.test.js`

**Interfaces:**
- Consumes: `S` from `src/data/sources.js`.
- Produces:
  - `loadFactor(deg: number) => number` — `1 / cos(deg°)`
  - `stallMultiplier(deg: number) => number` — `sqrt(loadFactor(deg))`
  - `BANK_PRESETS: number[]` = `[30, 45, 60]`
  - `BANK_MIN = 0`, `BANK_MAX = 80`
  - `LOADFACTOR_ID = "perf-loadfactor"`, `DA_ID = "perf-da"` (deep-link anchors shared by view + search)
  - `LOAD_COPY: { why: string, tip: string, src }`
  - `DA_SCENARIOS: { id, label, conditions, daBand, hit, src }[]`
  - `DA_TIP: string`

- [ ] **Step 1: Write the failing test**

Create `src/data/performance.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- performance`
Expected: FAIL — `Failed to resolve import "./performance.js"` (module doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/data/performance.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- performance`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/data/performance.js src/data/performance.test.js
git commit -m "$(cat <<'EOF'
feat: performance math + density-altitude data, unit-tested

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Search records for both calculators

**Files:**
- Modify: `src/data/searchIndex.js` (add imports + two `add(...)` records)
- Test: `src/data/searchIndex.test.js` (new)

**Interfaces:**
- Consumes: `LOADFACTOR_ID`, `DA_ID`, `LOAD_COPY` from `src/data/performance.js`; `search`, `RECORDS` from `src/data/searchIndex.js`.
- Produces: two search records with `section: "performance"` and ids `perf-loadfactor` / `perf-da`.

- [ ] **Step 1: Write the failing test**

Create `src/data/searchIndex.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- searchIndex`
Expected: FAIL — the first two assertions fail (`.some(...)` is `false`; no performance records exist yet). The third passes.

- [ ] **Step 3: Add the records**

In `src/data/searchIndex.js`, add this import alongside the existing data imports near the top (after the `FIELD_CARDS` import line):

```js
import { LOADFACTOR_ID, DA_ID, LOAD_COPY } from "./performance.js";
```

Then, immediately before the `export function search(query)` declaration, add:

```js
add({ id: LOADFACTOR_ID, section: "performance", cat: "LOAD",
  title: "Load factor & stall speed vs bank angle",
  body: `${LOAD_COPY.why} ${LOAD_COPY.tip}`,
  kw: "load factor stall speed bank angle 60 degrees 2 g turn accelerated" });
add({ id: DA_ID, section: "performance", cat: "LOAD",
  title: "Density altitude — performance",
  body: "High, hot, and humid raises density altitude: longer takeoff, reduced climb and thrust in thin air.",
  kw: "density altitude high hot humid performance takeoff climb thin air" });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- searchIndex`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/data/searchIndex.js src/data/searchIndex.test.js
git commit -m "$(cat <<'EOF'
feat: index performance calculators in global search

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Performance view + route swap

**Files:**
- Create: `src/components/Performance.jsx`
- Modify: `src/App.jsx:13` (import + `VIEWS` entry)

**Interfaces:**
- Consumes: everything from `src/data/performance.js`; `CARD_SECTIONS` from `src/data/cards.js`; `SectionLabel`, `Panel`, `Reveal`, `Hi`, `SourceDrawer`, `useFocusFlash` from `src/components/atoms.jsx`; `T`, `CAT`, `mono` from `src/theme.js`.
- Produces: default-exported `Performance({ sectionId, focusId })` React component registered in `VIEWS` under key `performance`.

- [ ] **Step 1: Create the component**

Create `src/components/Performance.jsx`:

```jsx
import { useState } from "react";
import { T, CAT, mono } from "../theme.js";
import { CARD_SECTIONS } from "../data/cards.js";
import {
  loadFactor, stallMultiplier, BANK_PRESETS, BANK_MIN, BANK_MAX,
  LOAD_COPY, DA_SCENARIOS, DA_TIP, LOADFACTOR_ID, DA_ID,
} from "../data/performance.js";
import { SectionLabel, Panel, Reveal, Hi, SourceDrawer, useFocusFlash } from "./atoms.jsx";

const LOAD_C = CAT.LOAD.c;

const Chip = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{ fontFamily: mono, fontSize: 13, fontWeight: 700,
    letterSpacing: 0.5, cursor: "pointer", borderRadius: 6, padding: "8px 12px",
    color: active ? T.ink : LOAD_C, background: active ? LOAD_C : LOAD_C + "16",
    border: `1px solid ${LOAD_C}${active ? "" : "55"}` }}>{label}</button>
);

const Stat = ({ value, label }) => (
  <div>
    <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 700, color: LOAD_C, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: T.dim, marginTop: 3 }}>{label}</div>
  </div>
);

const TipStrip = ({ text }) => (
  <div style={{ marginTop: 8, fontFamily: mono, fontSize: 11.5, lineHeight: 1.5,
    color: LOAD_C, background: LOAD_C + "12", borderLeft: `2px solid ${LOAD_C}`,
    padding: "6px 9px", borderRadius: "0 4px 4px 0" }}>
    <Hi text={text} base={LOAD_C} /></div>
);

function LoadFactorCalc() {
  const [deg, setDeg] = useState(60);
  return (
    <Panel>
      <div id={LOADFACTOR_ID} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {BANK_PRESETS.map((p) => (
          <Chip key={p} label={`${p}°`} active={deg === p} onClick={() => setDeg(p)} />
        ))}
      </div>
      <input type="range" min={BANK_MIN} max={BANK_MAX} value={deg}
        onChange={(e) => setDeg(Number(e.target.value))} aria-label="Bank angle"
        style={{ width: "100%", accentColor: LOAD_C }} />
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 1, color: T.dim, margin: "2px 0 12px" }}>
        BANK {deg}°</div>
      <div style={{ display: "flex", gap: 28 }}>
        <Stat value={`${loadFactor(deg).toFixed(1)} G`} label="LOAD FACTOR" />
        <Stat value={`×${stallMultiplier(deg).toFixed(2)}`} label="STALL SPEED" />
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.55, color: T.dim, marginTop: 12 }}>{LOAD_COPY.why}</div>
      <TipStrip text={LOAD_COPY.tip} />
      <SourceDrawer src={LOAD_COPY.src} />
    </Panel>
  );
}

function DensityAltCalc() {
  const [sel, setSel] = useState(0);
  const s = DA_SCENARIOS[sel];
  return (
    <Panel>
      <div id={DA_ID} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {DA_SCENARIOS.map((sc, i) => (
          <Chip key={sc.id} label={sc.label} active={sel === i} onClick={() => setSel(i)} />
        ))}
      </div>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 1, color: T.dim, marginBottom: 6 }}>
        {s.conditions.toUpperCase()}</div>
      <Stat value={s.daBand} label="DENSITY ALTITUDE" />
      <div style={{ fontSize: 12.5, lineHeight: 1.55, color: T.text, marginTop: 10 }}>
        <Hi text={s.hit} base={T.text} /></div>
      <TipStrip text={DA_TIP} />
      <SourceDrawer src={s.src} />
    </Panel>
  );
}

export default function Performance({ focusId }) {
  useFocusFlash(focusId);
  return (
    <div style={{ paddingTop: 10 }}>
      <SectionLabel color={LOAD_C}>LOAD FACTOR & STALL SPEED — TILT THE BANK</SectionLabel>
      <LoadFactorCalc />
      <SectionLabel color={LOAD_C}>DENSITY ALTITUDE — PICK THE DAY</SectionLabel>
      <DensityAltCalc />
      <SectionLabel>THE THEORY</SectionLabel>
      {CARD_SECTIONS.performance.map((c) => (
        <Reveal key={c.id} {...c} open={focusId === c.id} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Register the route**

In `src/App.jsx`, add the import after the other component imports (near line 10):

```jsx
import Performance from "./components/Performance.jsx";
```

Then update the `VIEWS` map (currently line 13) to include `performance`:

```jsx
const VIEWS = { numbers: HardNumbers, canifly: CanIFly, airspace: AirspaceDecoder,
  weather: WeatherDecoder, authorization: Authorization, performance: Performance, library: Library };
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: lint reports no errors; Vite build completes with no errors.

- [ ] **Step 4: Browser smoke test**

Run: `npm run dev`, open the app, then verify:
- Home → tap "Loading & Performance" tile → the two calculators render above a "THE THEORY" heading with the 7 reference cards below.
- Load Factor: tapping `30° / 45° / 60°` chips and dragging the slider both update `LOAD FACTOR` and `STALL SPEED` live; `60°` shows `2.0 G` and `×1.41`.
- Density Altitude: tapping `Standard day / Hot summer field / High & hot` switches the `DENSITY ALTITUDE` band and the performance-hit text.
- Both `SOURCE ▸` drawers open to the Pilot's Handbook link.
- The 7 reference cards still expand on tap.
- Home search "load factor" → tap result → lands on the module with the load-factor calculator flashed; "density altitude" → flashes the DA calculator.

- [ ] **Step 5: Commit**

```bash
git add src/components/Performance.jsx src/App.jsx
git commit -m "$(cat <<'EOF'
feat: interactive Performance view with load-factor + density-altitude calculators

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Notes for the implementer

- The `performance` route previously fell through `App.jsx`'s `VIEWS[section.id] || CardSection` to the generic `CardSection`, which rendered `CARD_SECTIONS.performance`. After Task 3 the new view renders those same cards itself, so nothing is lost and deep-links into individual cards still work.
- `Hi` highlights numbers-with-units; the `60°`, `2 G`, and `~41%` in the tip strips render as amber mono automatically — expected, not a bug.
- Keep the slider `max` at `BANK_MAX` (80). Do not raise it to 90 — `1/cos(90°)` is infinite.
