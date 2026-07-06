# Reference Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add FAA source citations to every fact in the app, plus four new reference modules: Airspace Authorization, chart/airport decoder expansion, FAA Library, and Field Awareness.

**Architecture:** A central `src/data/sources.js` registry of FAA documents; every data record gains a `src` field built with a validating helper `S(doc, ref)`. A shared `SourceDrawer` atom renders citations everywhere. New sections follow the existing pattern: data module → component → register in `theme.js` SECTIONS → route in `App.jsx` VIEWS → flatten into `searchIndex.js`.

**Tech Stack:** Vite 8 + React 19, zero runtime deps beyond React. Vitest (devDependency only) for data-invariant tests. oxlint for linting.

**Spec:** `docs/superpowers/specs/2026-07-06-reference-layer-design.md`

## Global Constraints

- Zero runtime dependencies beyond `react` / `react-dom`. Vitest is a devDependency only.
- All styling inline, using tokens from `src/theme.js` (`T`, `CAT`, `mono`). No CSS files, no Tailwind.
- Plain JavaScript + JSX. No TypeScript.
- Hash routing only (`#/section/entryId`), no router library.
- Citation rule: `src.doc` must be a key in `SOURCES` (the `S()` helper throws at import time if not). `ref` only when believed correct — Task 11 verifies every ref against the actual FAA text and demotes wrong ones to a bare document citation. `src: null` = deliberate "practice guidance, not regulation."
- Every task ends with `npm run lint` and `npm test` passing (and `npm run build` where stated).
- Work happens on branch `reference-layer` (created in Task 1).
- Outbound links always `target="_blank" rel="noopener noreferrer"`.

---

### Task 1: Branch, Vitest, and the SOURCES registry

**Files:**
- Modify: `package.json` (add vitest + test script)
- Create: `src/data/sources.js`
- Test: `src/data/sources.test.js`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `SOURCES` — object keyed by doc id, each value `{ title, url, group, use, lastChecked }`; `GROUPS` — ordered array of group names; `S(doc, ref)` — returns `{ doc }` or `{ doc, ref }`, **throws** `Error("Unknown source doc: <doc>")` if `doc` is not a `SOURCES` key. Every later task uses `S()` to build `src` fields.

- [ ] **Step 1: Create branch and install vitest**

```bash
cd /Users/andraewilliams/107Certified
git checkout -b reference-layer
npm install -D vitest
```

- [ ] **Step 2: Add test script to package.json**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 3: Write the failing test**

Create `src/data/sources.test.js`:

```js
import { describe, it, expect } from "vitest";
import { SOURCES, GROUPS, S } from "./sources.js";

describe("SOURCES registry", () => {
  it("every entry is complete and well-formed", () => {
    expect(Object.keys(SOURCES).length).toBeGreaterThanOrEqual(16);
    for (const [key, s] of Object.entries(SOURCES)) {
      expect(s.title, key).toBeTruthy();
      expect(s.url, key).toMatch(/^https:\/\//);
      expect(GROUPS, key).toContain(s.group);
      expect(s.use, key).toBeTruthy();
      expect(s.lastChecked, key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("S() builds refs and rejects unknown docs", () => {
    expect(S("PART107", "§107.29")).toEqual({ doc: "PART107", ref: "§107.29" });
    expect(S("AWC")).toEqual({ doc: "AWC" });
    expect(() => S("NOPE")).toThrow(/Unknown source doc/);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./sources.js`.

- [ ] **Step 5: Implement `src/data/sources.js`**

```js
// ── FAA SOURCE REGISTRY — every citation in the app resolves here ──
// { title, url, group, use, lastChecked }
// The Library section renders straight from this object.

export const GROUPS = ["Rules", "Airspace tools", "Weather", "Charts & handbooks"];

export const SOURCES = {
  PART107: { title: "14 CFR Part 107 — Small UAS Rule", group: "Rules",
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107",
    use: "The regulation itself — every 107.x citation, current text.", lastChecked: "2026-07-06" },
  PART89:  { title: "14 CFR Part 89 — Remote Identification", group: "Rules",
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-89",
    use: "Remote ID: standard, broadcast module, FRIA rules.", lastChecked: "2026-07-06" },
  PART48:  { title: "14 CFR Part 48 — Drone Registration", group: "Rules",
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-48",
    use: "Registering the aircraft: who, when, marking requirements.", lastChecked: "2026-07-06" },
  AC107:   { title: "AC 107-2A — Small UAS Advisory Circular", group: "Rules",
    url: "https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_107-2A.pdf",
    use: "The FAA's own plain-English guidance on meeting Part 107.", lastChecked: "2026-07-06" },
  ACS:     { title: "UAS Airman Certification Standards (FAA-S-ACS-10)", group: "Rules",
    url: "https://www.faa.gov/training_testing/testing/acs",
    use: "Exactly what the knowledge test can ask.", lastChecked: "2026-07-06" },
  BDP:     { title: "FAA — Become a Part 107 Drone Pilot", group: "Rules",
    url: "https://www.faa.gov/uas/commercial_operators/become_a_drone_pilot",
    use: "The official certification steps: IACRA, FTN, PSI, 8710-13.", lastChecked: "2026-07-06" },
  UASFM:   { title: "FAA UAS Facility Maps", group: "Airspace tools",
    url: "https://www.faa.gov/uas/commercial_operators/uas_facility_maps",
    use: "Grid ceilings near airports — what LAANC can pre-approve.", lastChecked: "2026-07-06" },
  LAANC:   { title: "FAA — Part 107 Airspace Authorizations (LAANC)", group: "Airspace tools",
    url: "https://www.faa.gov/uas/commercial_operators/part_107_airspace_authorizations",
    use: "How to get into controlled airspace: LAANC vs DroneZone.", lastChecked: "2026-07-06" },
  TFR:     { title: "FAA Temporary Flight Restrictions", group: "Airspace tools",
    url: "https://tfr.faa.gov",
    use: "Active TFRs — check before every flight.", lastChecked: "2026-07-06" },
  B4UFLY:  { title: "FAA B4UFLY (approved apps)", group: "Airspace tools",
    url: "https://www.faa.gov/uas/getting_started/b4ufly",
    use: "Free situational-awareness apps the FAA endorses.", lastChecked: "2026-07-06" },
  WCIF:    { title: "FAA — Where Can I Fly?", group: "Airspace tools",
    url: "https://www.faa.gov/uas/getting_started/where_can_i_fly",
    use: "The FAA's own answer to the question, with all the caveats.", lastChecked: "2026-07-06" },
  AWC:     { title: "Aviation Weather Center", group: "Weather",
    url: "https://aviationweather.gov",
    use: "METARs, TAFs, AIRMETs/SIGMETs — the official weather source.", lastChecked: "2026-07-06" },
  CUG:     { title: "FAA Aeronautical Chart Users' Guide", group: "Charts & handbooks",
    url: "https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/aero_guide/",
    use: "What every sectional symbol, line, and number means.", lastChecked: "2026-07-06" },
  CS:      { title: "FAA Chart Supplement", group: "Charts & handbooks",
    url: "https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/",
    use: "Full airport detail the sectional can't fit — issued every 56 days.", lastChecked: "2026-07-06" },
  AIM:     { title: "Aeronautical Information Manual", group: "Charts & handbooks",
    url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/",
    use: "How the airspace system actually operates: patterns, radio, NOTAMs.", lastChecked: "2026-07-06" },
  PHAK:    { title: "Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25)", group: "Charts & handbooks",
    url: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak",
    use: "The theory: aerodynamics, weather, performance, ADM.", lastChecked: "2026-07-06" },
};

// Citation builder — loud failure on a typo'd doc key, at import time.
export const S = (doc, ref) => {
  if (!SOURCES[doc]) throw new Error(`Unknown source doc: ${doc}`);
  return ref ? { doc, ref } : { doc };
};
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test`
Expected: PASS (2 tests).

- [ ] **Step 7: Lint and commit**

```bash
npm run lint
git add package.json package-lock.json src/data/sources.js src/data/sources.test.js
git commit -m "feat: FAA source registry with validating citation builder"
```

---

### Task 2: SourceDrawer atom + Reveal integration + shared TokenStrip

**Files:**
- Modify: `src/components/atoms.jsx` (add `SourceDrawer`, add `TokenStrip`, extend `Reveal`)
- Modify: `src/components/WeatherDecoder.jsx` (drop its local `TokenStrip`, import the shared one)

**Interfaces:**
- Consumes: `SOURCES` from `src/data/sources.js`.
- Produces: `SourceDrawer({ src })` — renders nothing when `src === undefined`; a "PRACTICE GUIDANCE" badge when `src === null`; a tap-to-open citation drawer otherwise. `TokenStrip({ tokens, prefix, color, src })` — the tap-a-token panel formerly private to WeatherDecoder, now with an optional `src` citation at the bottom. `Reveal` now accepts an optional `src` prop and renders `SourceDrawer` inside the open state.

- [ ] **Step 1: Add SourceDrawer to `atoms.jsx`**

Add to imports at the top of `src/components/atoms.jsx`:

```js
import { SOURCES } from "../data/sources.js";
```

Append at the end of the file:

```jsx
// citation drawer — src: {doc, ref?} | null (practice guidance) | undefined (hidden)
export function SourceDrawer({ src }) {
  const [open, setOpen] = useState(false);
  if (src === undefined) return null;
  if (src === null) return (
    <div style={{ marginTop: 9, fontFamily: mono, fontSize: 9.5, letterSpacing: 1.2,
      color: T.dim, border: `1px dashed ${T.line}`, borderRadius: 4,
      padding: "3px 7px", display: "inline-block" }}>
      PRACTICE GUIDANCE — NOT REGULATION</div>
  );
  const d = SOURCES[src.doc];
  return (
    <div style={{ marginTop: 9 }} onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none",
        padding: 0, cursor: "pointer", fontFamily: mono, fontSize: 10,
        letterSpacing: 1.2, color: T.dim }}>
        SOURCE {src.ref ? `· ${src.ref} ` : ""}{open ? "▾" : "▸"}</button>
      {open && (
        <div style={{ marginTop: 6, fontSize: 11.5, lineHeight: 1.5, color: T.dim,
          borderLeft: `2px solid ${T.line}`, paddingLeft: 8 }}>
          <a href={d.url} target="_blank" rel="noopener noreferrer"
            style={{ color: T.blue, textDecoration: "none" }}>{d.title} ↗</a>
          {src.ref && <span> · {src.ref}</span>}
          <div style={{ fontFamily: mono, fontSize: 9.5, marginTop: 2 }}>
            last checked {d.lastChecked}</div>
        </div>
      )}
    </div>
  );
}
```

Note the `e.stopPropagation()` — `SourceDrawer` lives inside `Reveal`, whose whole card toggles on click.

- [ ] **Step 2: Wire SourceDrawer into Reveal**

In `Reveal` (same file), change the signature and the open block:

```jsx
export function Reveal({ id, cat, q, a, rule, src, open: forceOpen }) {
```

and inside `{open && (...)}`, after the `rule` div, add:

```jsx
          <SourceDrawer src={src} />
```

(Data records spread into `Reveal` via `{...c}`, so once records carry `src`, it flows automatically.)

- [ ] **Step 3: Move TokenStrip into atoms.jsx**

Cut the entire `TokenStrip` function out of `src/components/WeatherDecoder.jsx` and add it to `atoms.jsx` (exported), extended with an optional `src`:

```jsx
// tap-a-token decoder strip (METAR, TAF, NOTAM, airport data block)
export function TokenStrip({ tokens, prefix, color, src }) {
  const [sel, setSel] = useState(null);
  return (
    <Panel style={{ padding: "13px 14px 14px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
        {tokens.map((tk, i) => {
          const active = sel === i;
          return (
            <button key={i} id={`${prefix}-${i}`} onClick={() => setSel(active ? null : i)}
              style={{ fontFamily: mono, fontSize: 13.5, fontWeight: 700, letterSpacing: 0.5,
                color: active ? T.ink : color, cursor: "pointer", borderRadius: 5,
                background: active ? color : color + "14",
                border: `1px solid ${color}${active ? "" : "44"}`, padding: "6px 8px" }}>{tk.t}</button>
          );
        })}
      </div>
      {sel !== null ? (
        <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: 1.5, color, marginBottom: 5 }}>
            {tokens[sel].label.toUpperCase()}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>
            <Hi text={tokens[sel].m} base={T.text} /></div>
        </div>
      ) : (
        <div style={{ fontSize: 11.5, color: T.dim, marginTop: 6 }}>tap any token ↑</div>
      )}
      <SourceDrawer src={src} />
    </Panel>
  );
}
```

`Panel` and `Hi` are already defined in `atoms.jsx` above this point — `TokenStrip` and `SourceDrawer` must be appended AFTER `Panel` in the file.

- [ ] **Step 4: Update WeatherDecoder imports**

In `src/components/WeatherDecoder.jsx`: remove the now-unused `useState` import and the local `TokenStrip`; import the shared one:

```js
import { T, mono } from "../theme.js";
import { METAR_TOKENS, TAF_TOKENS, WX_CARDS } from "../data/weather.js";
import { CloudClearanceSVG } from "./diagrams.jsx";
import { SectionLabel, Reveal, Panel, TokenStrip, useFocusFlash } from "./atoms.jsx";
```

(`Hi` was only used by the local TokenStrip — remove it from this file's imports if now unused.)

- [ ] **Step 5: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all pass; app builds.

- [ ] **Step 6: Commit**

```bash
git add src/components/atoms.jsx src/components/WeatherDecoder.jsx
git commit -m "feat: SourceDrawer citation atom; shared TokenStrip with source support"
```

---

### Task 3: Citation retrofit — hardNumbers.js and trees.js

**Files:**
- Modify: `src/data/hardNumbers.js`, `src/data/trees.js`
- Test: `src/data/citations.test.js` (created here, extended in Tasks 4–5)

**Interfaces:**
- Consumes: `S` from `./sources.js`.
- Produces: every record in `ALL_NUMBERS` has `src`; every **leaf** node (has `verdict`) in every `TREES[i].nodes` has `src`.

- [ ] **Step 1: Write the failing test**

Create `src/data/citations.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `src` is `undefined` on hard-number records.

- [ ] **Step 3: Retrofit hardNumbers.js**

Add at the top: `import { S } from "./sources.js";`
Add a `src` field to each item, per this table:

| id | src |
|---|---|
| n-alt | `S("PART107", "§107.51(b)")` |
| n-spd | `S("PART107", "§107.51(a)")` |
| n-wt | `S("PART107", "§107.3")` |
| n-vlos | `S("PART107", "§107.31")` |
| n-vis | `S("PART107", "§107.51(c)")` |
| n-cloud | `S("PART107", "§107.51(d)")` |
| n-ts | `S("AC107")` |
| n-accident | `S("PART107", "§107.9")` |
| n-recurrent | `S("PART107", "§107.65")` |
| n-address | `S("PART107", "§107.77")` |
| n-reg | `S("PART48")` |
| n-bac | `S("PART107", "§107.27")` |
| n-dark | `S("PHAK")` |
| n-test | `S("PART107", "§107.73")` |
| n-temp | `S("PART107")` |
| n-age | `S("PART107", "§107.61")` |
| n-efloor | `S("CUG")` |
| n-stadium | `S("TFR")` |
| n-light | `S("PART107", "§107.29")` |
| n-twilight | `S("PART107", "§107.29")` |
| n-load | `S("PHAK")` |
| n-vhf | `S("AIM")` |
| n-rwy | `S("AIM")` |

Example (first item):

```js
      { id: "n-alt", value: "400 ft", label: "Max altitude (AGL)", cat: "REG",
        detail: "Higher only within a 400 ft radius of a structure — then up to 400 ft above its top.",
        kw: "altitude ceiling structure tower inspection agl",
        src: S("PART107", "§107.51(b)") },
```

- [ ] **Step 4: Retrofit trees.js leaf nodes**

Add at the top: `import { S } from "./sources.js";`
Add `src` to every node that has a `verdict`, per this table:

| tree → leaf | src |
|---|---|
| t-airspace → fly_clear | `S("PART107", "§107.41")` |
| t-airspace → no_auth | `S("PART107", "§107.41")` |
| t-airspace → no_tfr | `S("TFR")` |
| t-400 → fly_struct | `S("PART107", "§107.51(b)")` |
| t-400 → no_alt | `S("PART107", "§107.51(b)")` |
| t-oop → fly_part | `S("PART107", "§107.39")` |
| t-oop → fly_cat | `S("PART107", "Subpart D")` |
| t-oop → fly_assembly | `S("PART89")` |
| t-oop → no_cat | `S("PART107", "§107.39")` |
| t-oop → no_cat3 | `S("PART107", "§107.145")` |
| t-night → fly_night | `S("PART107", "§107.29")` |
| t-night → no_light | `S("PART107", "§107.29")` |
| t-night → no_current | `S("PART107", "§107.65")` |
| t-vehicle → fly_veh | `S("PART107", "§107.25")` |
| t-vehicle → no_pop | `S("PART107", "§107.25")` |
| t-vehicle → no_hire | `S("PART107", "§107.25")` |
| t-accident → report | `S("PART107", "§107.9")` |
| t-accident → no_report | `S("PART107", "§107.9")` |
| t-wx → fly_wx | `S("PART107", "§107.51")` |
| t-wx → no_vis | `S("PART107", "§107.51(c)")` |
| t-wx → no_cloud | `S("PART107", "§107.51(d)")` |
| t-wx → no_ts | `S("PHAK")` |

Example:

```js
      fly_clear: { verdict: "FLY",
        text: "Airspace is clear. Stay under 400 ft AGL, keep VLOS, and preflight per 107.49.",
        rule: "B/C/D + E-surface = ask (LAANC). G = go.",
        src: S("PART107", "§107.41") },
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
npm run lint
git add src/data/hardNumbers.js src/data/trees.js src/data/citations.test.js
git commit -m "feat: FAA citations on hard numbers and decision-tree verdicts"
```

---

### Task 4: Citation retrofit — cards.js

**Files:**
- Modify: `src/data/cards.js`
- Test: `src/data/citations.test.js` (extend)

**Interfaces:**
- Consumes: `S` from `./sources.js`.
- Produces: every record in every `CARD_SECTIONS` array, `OOP_MATRIX`, `OOP_CARDS`, and `CERT_STEPS` has `src`.

- [ ] **Step 1: Extend the test (failing)**

Add to `src/data/citations.test.js`:

```js
import { CARD_SECTIONS, OOP_MATRIX, OOP_CARDS, CERT_STEPS } from "./cards.js";

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
```

Run: `npm test` — Expected: new tests FAIL.

- [ ] **Step 2: Retrofit cards.js**

Add at the top: `import { S } from "./sources.js";`
Add `src` per this table:

| id | src |
|---|---|
| ni-when, ni-light | `S("PART107", "§107.29")` |
| ni-waiver | `S("PART107", "§107.65")` |
| ni-autokinesis, ni-adapt, ni-rods | `S("PHAK")` |
| ap-runway, ap-pattern, ap-ctaf, ap-hold, ap-wind, ap-displaced, ap-phonetic | `S("AIM")` |
| ap-supplement | `S("CS")` |
| rid-ways, rid-module, rid-fria, rid-oop | `S("PART89")` |
| em-deviate | `S("PART107", "§107.21")` |
| em-report | `S("PART107", "§107.9")` |
| em-lostlink | `S("PART107", "§107.49")` |
| em-people, em-battery | `S("AC107")` |
| pf-forces, pf-stall, pf-load, pf-drag, pf-axes, pf-cg, pf-da | `S("PHAK")` |
| md-maiir, md-decide, md-pave, md-stress, md-hyper | `S("PHAK")` |
| md-imsafe | `S("PART107", "§107.17")` |
| md-alcohol | `S("PART107", "§107.27")` |
| md-crm | `S("AC107")` |
| ro-yield | `S("PART107", "§107.37")` |
| ro-scan | `S("AIM")` |
| ro-careless | `S("PART107", "§107.23")` |
| ro-safe | `S("PART107", "§107.15")` |
| ro-vo | `S("PART107", "§107.33")` |
| ro-waiver | `S("PART107", "§107.200")` |
| mt-schedule, mt-battery, mt-firmware | `S("AC107")` |
| mt-preflight | `S("PART107", "§107.49")` |
| OOP_MATRIX cat 1 | `S("PART107", "§107.110")` |
| OOP_MATRIX cat 2 | `S("PART107", "§107.115")` |
| OOP_MATRIX cat 3 | `S("PART107", "§107.125")` |
| OOP_MATRIX cat 4 | `S("PART107", "§107.140")` |
| oop-exempt | `S("PART107", "§107.39")` |
| oop-sustained | `S("AC107")` |
| ct-1, ct-2, ct-3, ct-4 | `S("BDP")` |
| ct-5 | `S("PART48")` |
| ct-6 | `S("PART107", "§107.65")` |

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test` — Expected: PASS.

- [ ] **Step 4: Commit**

```bash
npm run lint
git add src/data/cards.js src/data/citations.test.js
git commit -m "feat: FAA citations across all answer cards, OOP matrix, cert path"
```

---

### Task 5: Citation retrofit — airspace.js and weather.js

**Files:**
- Modify: `src/data/airspace.js`, `src/data/weather.js`
- Test: `src/data/citations.test.js` (extend)

**Interfaces:**
- Consumes: `S` from `./sources.js`.
- Produces: every record in `AIRSPACE_ITEMS` and `WX_CARDS` has `src`. New exports from `weather.js`: `METAR_SRC` and `TAF_SRC` (both `S("AWC")`) — strip-level citations for the token panels (individual tokens are parts of one example observation, cited once at panel level).

- [ ] **Step 1: Extend the test (failing)**

Add to `src/data/citations.test.js`:

```js
import { AIRSPACE_ITEMS } from "./airspace.js";
import { WX_CARDS, METAR_SRC, TAF_SRC } from "./weather.js";

describe("citation coverage — decoders", () => {
  it("airspace items", () => checkSrc(AIRSPACE_ITEMS, "airspace"));
  it("weather cards + strip sources", () => {
    checkSrc(WX_CARDS, "wxCards");
    expect(SOURCES[METAR_SRC.doc]).toBeTruthy();
    expect(SOURCES[TAF_SRC.doc]).toBeTruthy();
  });
});
```

Run: `npm test` — Expected: new tests FAIL.

- [ ] **Step 2: Retrofit airspace.js**

Add at the top: `import { S } from "./sources.js";`
Add `src` per this table:

| id | src |
|---|---|
| as-b, as-c, as-d, as-esfc | `S("PART107", "§107.41")` |
| as-e700, as-g, as-ceil, as-blueap, as-magap, as-latlong, as-mef | `S("CUG")` |
| as-p, as-stack, as-mtr | `S("AIM")` |

- [ ] **Step 3: Retrofit weather.js**

Add at the top: `import { S } from "./sources.js";`
Add after the token arrays:

```js
export const METAR_SRC = S("AWC");
export const TAF_SRC = S("AWC");
```

Add `src` to `WX_CARDS` per this table:

| id | src |
|---|---|
| wx-sources, wx-airmet | `S("AWC")` |
| wx-ceiling, wx-stable, wx-ts, wx-fog, wx-da, wx-fronts, wx-ice, wx-shear | `S("PHAK")` |

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npm run lint
git add src/data/airspace.js src/data/weather.js src/data/citations.test.js
git commit -m "feat: FAA citations on airspace decoder and weather content"
```

---

### Task 6: Render citations everywhere

**Files:**
- Modify: `src/components/HardNumbers.jsx`, `src/components/CanIFly.jsx`, `src/components/AirspaceDecoder.jsx`, `src/components/WeatherDecoder.jsx`, `src/components/CardSection.jsx`

**Interfaces:**
- Consumes: `SourceDrawer`, `TokenStrip` from `atoms.jsx`; `src` fields from Tasks 3–5; `METAR_SRC`/`TAF_SRC` from `weather.js`.
- Produces: every fact view in the app shows a source drawer. (`Reveal`-based cards already work via Task 2.)

- [ ] **Step 1: HardNumbers.jsx** — import `SourceDrawer` from `./atoms.jsx`; inside the number-card div, after the detail `<div>`, add:

```jsx
                  <SourceDrawer src={n.src} />
```

- [ ] **Step 2: CanIFly.jsx** — import `SourceDrawer`; in `Walker`, in the leaf branch after the `rule` div, add:

```jsx
          <SourceDrawer src={node.src} />
```

- [ ] **Step 3: AirspaceDecoder.jsx** — import `SourceDrawer`; in the sticky detail panel, after the `detail` div, add:

```jsx
          <SourceDrawer src={open.src} />
```

- [ ] **Step 4: WeatherDecoder.jsx** — pass strip sources:

```jsx
      <TokenStrip tokens={METAR_TOKENS} prefix="metar" color={T.magenta} src={METAR_SRC} />
      ...
      <TokenStrip tokens={TAF_TOKENS} prefix="taf" color={T.blue} src={TAF_SRC} />
```

(add `METAR_SRC, TAF_SRC` to the weather.js import).

- [ ] **Step 5: CardSection.jsx** — import `SourceDrawer`; add drawers to the two non-Reveal renderers:
  - In `OOPMatrix`, inside the flex-1 div after the `note` div: `<SourceDrawer src={m.src} />`
  - In `CertPath`, after the detail div: `<SourceDrawer src={s.src} />`

- [ ] **Step 6: Verify in the browser**

Run: `npm run lint && npm test && npm run build`
Then start the dev server (`.claude/launch.json` name: create if missing with `{"name": "dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 5173}`) and confirm: a Hard Numbers card, a Can I Fly verdict, an airspace symbol panel, the METAR strip, an OOP matrix row, and a cert step all show "SOURCE ▸" and open with a working FAA link.

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "feat: source drawers rendered across all fact views"
```

---

### Task 7: Airspace Authorization section

**Files:**
- Create: `src/data/authorization.js`, `src/components/Authorization.jsx`
- Modify: `src/theme.js`, `src/App.jsx`, `src/data/searchIndex.js`
- Test: `src/data/citations.test.js` (extend)

**Interfaces:**
- Consumes: `S`; `TokenStrip`, `Reveal`, `Panel`, `SectionLabel`, `SourceDrawer`, `Badge`, `useFocusFlash` from `atoms.jsx`.
- Produces: data exports `GRID_CELLS` (array of `{ v, airport? }`), `GRID_DETAILS` (object keyed by altitude value: `{ meaning, laanc, coordination, client, src }`), `LAANC_FLOW` (array of `{ cond, action, tone }`, plus `LAANC_SRC`), `TFR_CARDS` (Reveal-shaped), `NOTAM_TOKENS` + `NOTAM_SRC`. Section id `"authorization"`.

- [ ] **Step 1: Create `src/data/authorization.js`**

```js
// ── AIRSPACE AUTHORIZATION — facility maps, LAANC, TFRs, NOTAMs ────
import { S } from "./sources.js";

// Illustrative UASFM grid (NOT a real airport — values are the lesson).
export const GRID_CELLS = [
  { v: 400 }, { v: 300 }, { v: 200 }, { v: 400 },
  { v: 300 }, { v: 100 }, { v: 0, airport: true }, { v: 200 },
  { v: 400 }, { v: 200 }, { v: 100 }, { v: 400 },
];

export const GRID_DETAILS = {
  0: { meaning: "The FAA will not pre-authorize ANY altitude in this square — it sits on final approach or over the field itself.",
    laanc: "No instant LAANC approval at any altitude.",
    coordination: "Not impossible: file a LAANC Further Coordination request or apply on FAADroneZone. Manual FAA review — apply up to 90 days ahead, never same-day.",
    client: "Tell a client: flying here needs FAA lead time measured in weeks, not hours. Quote accordingly.",
    src: S("UASFM") },
  100: { meaning: "Pre-approved ceiling is 100 ft AGL — close to the approach/departure paths.",
    laanc: "LAANC auto-approves at or below 100 ft, usually in seconds.",
    coordination: "Need higher? Further Coordination request — manual review, up to 90 days ahead.",
    client: "Most roof/real-estate work fits under 100 ft. Above it, plan lead time.",
    src: S("UASFM") },
  200: { meaning: "Pre-approved ceiling is 200 ft AGL.",
    laanc: "LAANC auto-approves at or below 200 ft.",
    coordination: "Above 200 ft: Further Coordination — not instant.",
    client: "Covers almost all commercial photography and inspection work.",
    src: S("UASFM") },
  300: { meaning: "Pre-approved ceiling is 300 ft AGL — farther from the runways.",
    laanc: "LAANC auto-approves at or below 300 ft.",
    coordination: "Above 300 ft: Further Coordination.",
    client: "Effectively unrestricted for typical sUAS missions.",
    src: S("UASFM") },
  400: { meaning: "Pre-approved up to the full Part 107 ceiling of 400 ft AGL.",
    laanc: "LAANC auto-approves to 400 ft — the grid is not the limit, 107.51 is.",
    coordination: "None needed below 400 ft. Above 400 ft you're into waiver territory regardless of the grid.",
    client: "Only the airspace class itself (and TFRs) stand between you and the job.",
    src: S("UASFM") },
};

export const GRID_CAVEAT =
  "Facility maps show where the FAA CAN pre-authorize — the map itself is not an authorization. You still need LAANC or DroneZone approval in controlled airspace.";

export const LAANC_SRC = S("LAANC");
export const LAANC_FLOW = [
  { cond: "At or below the grid ceiling", tone: "GO",
    action: "LAANC via an approved app (Aloft, Airspace Link, AutoPylot…) — near-real-time approval, often seconds." },
  { cond: "Above the grid ceiling, or a 0 grid", tone: "AUTH",
    action: "LAANC Further Coordination request — manual FAA review, submit up to 90 days ahead. No instant answer." },
  { cond: "Airport not LAANC-enabled", tone: "AUTH",
    action: "Apply on FAADroneZone instead. Same outcome, slower pipeline." },
];

export const TFR_CARDS = [
  { id: "tfr-what", cat: "CHART", q: "What is a TFR?",
    a: "A Temporary Flight Restriction — airspace closed for a limited time by NOTAM: disasters, wildfires, VIP movement, security events, space operations. It overrides every other permission you have.",
    rule: "Check tfr.faa.gov (or your LAANC app) before EVERY flight.",
    kw: "tfr temporary flight restriction notam check", src: S("TFR") },
  { id: "tfr-stadium", cat: "CHART", q: "The stadium TFR — the numbers?",
    a: "3 NM radius, up to 3,000 ft AGL, from 1 hour before to 1 hour after: MLB, NFL, NCAA Division I football, and major motor speedway events.",
    rule: "It's a STANDING TFR — it exists even if your app doesn't draw it.",
    kw: "stadium sporting event 3 nm 3000 mlb nfl nascar", src: S("TFR") },
  { id: "tfr-disaster", cat: "CHART", q: "Disaster and emergency TFRs?",
    a: "Wildfires, hurricanes, crash sites — flying a drone into one interferes with response aircraft and is the fastest way to a federal enforcement action.",
    rule: "'If you fly, we can't.' Emergency responders ground their aircraft when a drone appears.",
    kw: "disaster wildfire hurricane emergency response interference", src: S("TFR") },
  { id: "tfr-vip", cat: "CHART", q: "VIP / security TFRs?",
    a: "Presidential movement creates 10 NM / 30 NM rings on short notice. National-security TFRs (Washington DC FRZ/SFRA) are permanent in all but name.",
    rule: "VIP TFRs move with the VIP — yesterday's clear sky is today's violation.",
    kw: "vip presidential security dc frz sfra 30 nm", src: S("TFR") },
];

// Fake-but-realistic crane NOTAM, tap-apart style
export const NOTAM_SRC = S("AIM");
export const NOTAM_TOKENS = [
  { t: "!JAX", label: "Accountability", m: "The '!' starts a NOTAM; JAX = the FAA office accountable for it." },
  { t: "07/012", label: "NOTAM number", m: "12th NOTAM issued in July. Cited when you talk to FSS or ATC about it." },
  { t: "CRG", label: "Location", m: "The affected facility — Jacksonville Executive at Craig (CRG)." },
  { t: "OBST", label: "Keyword", m: "What kind of NOTAM: OBST obstacle · AIRSPACE · RWY runway · TWY taxiway · SVC services · ODP/SID procedures." },
  { t: "CRANE", label: "Subject", m: "The thing itself — here, a construction crane." },
  { t: "301213N0812319W", label: "Position", m: "30°12'13\"N 081°23'19\"W — degrees, minutes, seconds, mashed together." },
  { t: "(0.4NM SE APCH END RWY 32)", label: "Plain-ish English", m: "0.4 nautical miles southeast of the approach end of runway 32 — right where traffic descends." },
  { t: "145FT (120FT AGL)", label: "Height", m: "Top at 145 ft MSL, which is 120 ft above the ground. Compare AGL to YOUR altitude — you fly AGL." },
  { t: "FLAGGED AND LGTD", label: "Marking", m: "Flagged by day, lighted at night. 'UNLGTD' in a NOTAM is the scary one." },
  { t: "2607061200-2608062359", label: "When", m: "Effective from 2026-07-06 12:00 Z to 2026-08-06 23:59 Z. Format: YYMMDDHHMM, always UTC." },
];
```

- [ ] **Step 2: Create `src/components/Authorization.jsx`**

```jsx
import { useState } from "react";
import { T, mono } from "../theme.js";
import { GRID_CELLS, GRID_DETAILS, GRID_CAVEAT, LAANC_FLOW, LAANC_SRC, TFR_CARDS,
  NOTAM_TOKENS, NOTAM_SRC } from "../data/authorization.js";
import { SectionLabel, Reveal, Panel, Hi, Badge, TokenStrip, SourceDrawer,
  useFocusFlash } from "./atoms.jsx";

const GRID_COLORS = { 0: T.red, 100: T.amber, 200: T.amber, 300: T.blue, 400: T.green };

function FacilityGrid() {
  const [sel, setSel] = useState(null);
  const d = sel === null ? null : GRID_DETAILS[sel];
  return (
    <Panel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
        {GRID_CELLS.map((cell, i) => {
          const c = GRID_COLORS[cell.v];
          const active = sel === cell.v;
          const firstOfValue = GRID_CELLS.findIndex((x) => x.v === cell.v) === i;
          return (
            <button key={i} id={firstOfValue ? `auth-grid-${cell.v}` : undefined}
              onClick={() => setSel(active ? null : cell.v)}
              style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, cursor: "pointer",
                padding: "14px 0", borderRadius: 4, color: active ? T.ink : c,
                background: active ? c : c + "16", border: `1px solid ${c}55` }}>
              {cell.airport ? `✈ ${cell.v}` : cell.v}
            </button>
          );
        })}
      </div>
      {d ? (
        <div style={{ marginTop: 12, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 8 }}>
            <Hi text={d.meaning} base={T.text} /></div>
          {[["LAANC", d.laanc], ["ABOVE THE GRID", d.coordination], ["CLIENT MATH", d.client]]
            .map(([label, text]) => (
            <div key={label} style={{ marginBottom: 7 }}>
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: 1.5, color: T.dim }}>{label}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: T.text }}>
                <Hi text={text} base={T.text} /></div>
            </div>
          ))}
          <SourceDrawer src={d.src} />
        </div>
      ) : (
        <div style={{ fontSize: 11.5, color: T.dim, marginTop: 8 }}>tap a grid value ↑</div>
      )}
      <div style={{ marginTop: 10, fontFamily: mono, fontSize: 10.5, lineHeight: 1.5,
        color: T.amber, background: T.amber + "12", borderLeft: `2px solid ${T.amber}`,
        padding: "6px 9px", borderRadius: "0 4px 4px 0" }}>{GRID_CAVEAT}</div>
    </Panel>
  );
}

function LaancFlow() {
  return (
    <Panel>
      {LAANC_FLOW.map((s, i) => (
        <div key={i} id={`laanc-${i}`} style={{ display: "flex", gap: 10, alignItems: "flex-start",
          padding: "8px 0", borderTop: i ? `1px dashed ${T.line}` : "none" }}>
          <Badge v={s.tone} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              color: T.text, marginBottom: 3 }}>{s.cond.toUpperCase()}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: T.dim }}>
              <Hi text={s.action} base={T.dim} /></div>
          </div>
        </div>
      ))}
      <SourceDrawer src={LAANC_SRC} />
    </Panel>
  );
}

export default function Authorization({ focusId }) {
  useFocusFlash(focusId);
  return (
    <>
      <SectionLabel color={T.magenta}>UAS FACILITY MAP — WHAT THE GRID NUMBERS MEAN</SectionLabel>
      <FacilityGrid />
      <SectionLabel color={T.blue}>WHICH DOOR DO I KNOCK ON?</SectionLabel>
      <LaancFlow />
      <SectionLabel color={T.red}>TFRs — THE OVERRIDE LAYER</SectionLabel>
      {TFR_CARDS.map((c) => <Reveal key={c.id} {...c} open={focusId === c.id} />)}
      <SectionLabel color={T.amber}>NOTAM — TAP IT APART</SectionLabel>
      <TokenStrip tokens={NOTAM_TOKENS} prefix="notam" color={T.amber} src={NOTAM_SRC} />
    </>
  );
}
```

- [ ] **Step 3: Register the section**

`src/theme.js` — insert into `SECTIONS` right after the `airspace` entry:

```js
  { id: "authorization", title: "Airspace Authorization", cat: "CHART", glyph: "⌗",
    blurb: "Facility map grids · LAANC · TFRs · NOTAM decoder" },
```

`src/App.jsx` — import and register:

```js
import Authorization from "./components/Authorization.jsx";
```
```js
const VIEWS = { numbers: HardNumbers, canifly: CanIFly, airspace: AirspaceDecoder,
  weather: WeatherDecoder, authorization: Authorization };
```

- [ ] **Step 4: Index for search**

In `src/data/searchIndex.js`, add the import and records:

```js
import { GRID_DETAILS, LAANC_FLOW, TFR_CARDS, NOTAM_TOKENS } from "./authorization.js";
```
```js
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
```

- [ ] **Step 5: Extend citations test (failing first)**

Add to `src/data/citations.test.js`:

```js
import { GRID_DETAILS as AUTH_GRID, TFR_CARDS, NOTAM_SRC, LAANC_SRC } from "./authorization.js";

describe("citation coverage — authorization", () => {
  it("grid, tfr, strips", () => {
    checkSrc(Object.values(AUTH_GRID), "authGrid");
    checkSrc(TFR_CARDS, "tfrCards");
    expect(SOURCES[NOTAM_SRC.doc]).toBeTruthy();
    expect(SOURCES[LAANC_SRC.doc]).toBeTruthy();
  });
});
```

(Write the test before Step 1 if executing strictly TDD; the data file makes it pass.)

- [ ] **Step 6: Verify**

Run: `npm run lint && npm test && npm run build`
Browser: `#/authorization` renders; tapping grid squares, flow rows, TFR cards, NOTAM tokens all work; searching "notam" and "facility map" from Home deep-links into the section.

- [ ] **Step 7: Commit**

```bash
git add src/data/authorization.js src/components/Authorization.jsx src/theme.js src/App.jsx src/data/searchIndex.js src/data/citations.test.js
git commit -m "feat: Airspace Authorization section — facility grid, LAANC flow, TFRs, NOTAM decoder"
```

---

### Task 8: Chart & airport decoder expansion

**Files:**
- Modify: `src/data/airspace.js` (add `DATABLOCK_TOKENS`, `DATABLOCK_SRC`, one new `AIRSPACE_ITEMS` entry)
- Modify: `src/components/diagrams.jsx` (LegendTile `"obstacle"` case)
- Modify: `src/components/AirspaceDecoder.jsx` (render data-block TokenStrip)
- Test: `src/data/citations.test.js` (already covers `AIRSPACE_ITEMS`; extend for `DATABLOCK_SRC`)

**Interfaces:**
- Consumes: `S`, `TokenStrip`.
- Produces: `DATABLOCK_TOKENS` (TokenStrip-shaped `{ t, label, m }`), `DATABLOCK_SRC`.

- [ ] **Step 1: Add data to `airspace.js`**

New airspace item appended to `AIRSPACE_ITEMS`:

```js
  { id: "as-obst", sym: "obstacle", title: "Obstacle symbols", verdict: "INFO",
    answer: "Upside-down 'V' = obstacle. With a lightning-bolt tip = lighted. Double = group of obstacles.",
    detail: "Bold number = top in ft MSL; (parens) = height AGL. Towers over 1,000 ft AGL get the taller symbol — guy wires extend far beyond what you see.",
    kw: "obstacle tower guy wires lighted msl agl symbol", src: S("CUG") },
```

New exports at the bottom:

```js
// ── AIRPORT DATA BLOCK — the text next to the airport symbol ───────
export const DATABLOCK_SRC = S("CUG");
export const DATABLOCK_TOKENS = [
  { t: "CHESTER", label: "Name", m: "Airport name. The identifier follows in parentheses on some charts." },
  { t: "CT - 118.3", label: "Tower", m: "CT = control tower, on 118.3 MHz. When the tower is the CTAF after hours, a star follows the frequency." },
  { t: "✱", label: "Part-time star", m: "The star means PART-TIME — tower or lighting doesn't run 24/7. Hours live in the Chart Supplement." },
  { t: "L", label: "Lighting", m: "Runway lights operate sunset to sunrise. ✱L = part-time or pilot-activated lighting." },
  { t: "62", label: "Elevation", m: "Field elevation: 62 ft MSL. This is the number that converts chart MSL altitudes to your AGL world." },
  { t: "50", label: "Runway length", m: "Longest runway in hundreds of feet — 50 = 5,000 ft." },
  { t: "122.95", label: "UNICOM", m: "UNICOM frequency. At non-towered fields this is often also the CTAF — monitor it for traffic." },
  { t: "RP 27", label: "Right pattern", m: "RP = RIGHT traffic pattern for runway 27 (left is standard). Manned traffic turns where you might not expect." },
];
```

- [ ] **Step 2: Add the LegendTile case**

In `diagrams.jsx`, inside the `switch (sym)`, add before `default`:

```jsx
    case "obstacle": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        {grid}
        <path d="M 38 62 l 8 -26 l 8 26" fill="none" stroke={T.blue} strokeWidth="2" />
        <path d="M 78 62 l 7 -34 l 7 34" fill="none" stroke={T.blue} strokeWidth="2" />
        <path d="M 85 28 l 3 -7 l -4 3 l 3 -8" fill="none" stroke={T.amber} strokeWidth="1.6" />
        <text x="46" y="74" textAnchor="middle" fill={T.text} style={{ font: `bold 8px ${mono}` }}>724</text>
        <text x="85" y="74" textAnchor="middle" fill={T.dim} style={{ font: `8px ${mono}` }}>(1049)</text>
      </svg>);
```

- [ ] **Step 3: Render the data block decoder**

In `AirspaceDecoder.jsx`: import `SectionLabel`, `TokenStrip` from `./atoms.jsx` and `DATABLOCK_TOKENS, DATABLOCK_SRC` from `../data/airspace.js`. After the closing of the symbol grid `<div>` (before the sticky `open` panel), add:

```jsx
      <SectionLabel color={T.blue}>AIRPORT DATA BLOCK — TAP IT APART</SectionLabel>
      <TokenStrip tokens={DATABLOCK_TOKENS} prefix="datablock" color={T.blue} src={DATABLOCK_SRC} />
```

- [ ] **Step 4: Index for search**

In `searchIndex.js` (the `AIRSPACE_ITEMS` block already picks up `as-obst` automatically), add:

```js
import { DATABLOCK_TOKENS } from "./airspace.js";   // merge into the existing airspace import
```
```js
DATABLOCK_TOKENS.forEach((tk, i) =>
  add({ id: `datablock-${i}`, section: "airspace", cat: "CHART",
    title: `Data block ${tk.t} — ${tk.label}`, body: tk.m,
    kw: "airport data block sectional decode ctaf elevation" }));
```

- [ ] **Step 5: Extend test + verify**

In `citations.test.js`, add `DATABLOCK_SRC` to the existing `./airspace.js` import, and inside the existing "airspace items" test add:

```js
    expect(SOURCES[DATABLOCK_SRC.doc]).toBeTruthy();
```

Run: `npm run lint && npm test && npm run build` — all pass.
Browser: `#/airspace` shows the new obstacle tile and the data-block strip; searching "unicom" finds the data-block token.

- [ ] **Step 6: Commit**

```bash
git add src/data/airspace.js src/components/diagrams.jsx src/components/AirspaceDecoder.jsx src/data/searchIndex.js src/data/citations.test.js
git commit -m "feat: airport data block decoder + obstacle symbols in airspace section"
```

---

### Task 9: FAA Library section

**Files:**
- Create: `src/components/Library.jsx`
- Modify: `src/theme.js`, `src/App.jsx`, `src/data/searchIndex.js`

**Interfaces:**
- Consumes: `SOURCES`, `GROUPS` from `sources.js`.
- Produces: section id `"library"`; search records with ids `lib-<lowercased key>`.

- [ ] **Step 1: Create `src/components/Library.jsx`**

```jsx
import { T, mono } from "../theme.js";
import { SOURCES, GROUPS } from "../data/sources.js";
import { SectionLabel, useFocusFlash } from "./atoms.jsx";

export default function Library({ focusId }) {
  useFocusFlash(focusId);
  return (
    <>
      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, padding: "10px 2px 4px" }}>
        The official documents every answer in this app cites. Bookmark the ones you fly with.</div>
      {GROUPS.map((g) => (
        <div key={g}>
          <SectionLabel>{g.toUpperCase()}</SectionLabel>
          {Object.entries(SOURCES).filter(([, s]) => s.group === g).map(([key, s]) => (
            <a key={key} id={`lib-${key.toLowerCase()}`} href={s.url} target="_blank"
              rel="noopener noreferrer" style={{ display: "block", textDecoration: "none",
                background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8,
                padding: "11px 13px", marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8,
                alignItems: "baseline" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text,
                  lineHeight: 1.4 }}>{s.title}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: T.blue, flexShrink: 0 }}>↗</span>
              </div>
              <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.45, marginTop: 3 }}>{s.use}</div>
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: 1, color: T.dim,
                marginTop: 5 }}>CHECKED {s.lastChecked}</div>
            </a>
          ))}
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 2: Register + route + index**

`theme.js` — append to `SECTIONS` (last position, after `maintenance`):

```js
  { id: "library", title: "FAA Library", cat: "REG", glyph: "≡",
    blurb: "The official documents every answer here cites" },
```

`App.jsx` — `import Library from "./components/Library.jsx";` and add `library: Library` to `VIEWS`.

`searchIndex.js`:

```js
import { SOURCES } from "./sources.js";
```
```js
Object.entries(SOURCES).forEach(([key, s]) =>
  add({ id: `lib-${key.toLowerCase()}`, section: "library", cat: "REG",
    title: s.title, body: s.use, kw: "faa official source document library reference" }));
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm test && npm run build`
Browser: `#/library` renders four groups; every row opens the FAA page in a new tab; searching "chart supplement" surfaces the library row and deep-links with a flash.

- [ ] **Step 4: Commit**

```bash
git add src/components/Library.jsx src/theme.js src/App.jsx src/data/searchIndex.js
git commit -m "feat: FAA Library section rendered from the source registry"
```

---

### Task 10: Field Awareness section

**Files:**
- Create: `src/data/field.js`
- Modify: `src/components/CardSection.jsx`, `src/theme.js`, `src/data/searchIndex.js`
- Test: `src/data/citations.test.js` (extend)

**Interfaces:**
- Consumes: `S`; `CardSection`'s existing Reveal pipeline (`src: null` renders the practice-guidance badge via `SourceDrawer`).
- Produces: `FIELD_CARDS` (Reveal-shaped), `FIELD_BANNER` (string). Section id `"field"` routed through `CardSection` (no `VIEWS` entry needed — `App.jsx` falls back to `CardSection`).

- [ ] **Step 1: Extend citations test (failing)**

```js
import { FIELD_CARDS } from "./field.js";

describe("citation coverage — field awareness", () => {
  it("field cards have src or explicit null", () => checkSrc(FIELD_CARDS, "field"));
});
```

Run: `npm test` — Expected: FAIL (module doesn't exist).

- [ ] **Step 2: Create `src/data/field.js`**

```js
// ── FIELD AWARENESS — FAA-legal is not the whole story ─────────────
// src: null = deliberate practice guidance, rendered with a badge.
import { S } from "./sources.js";

export const FIELD_BANNER =
  "FAA legal ≠ socially safe ≠ client-safe ≠ location-approved. The FAA owns the AIR — the ground under you belongs to somebody else.";

export const FIELD_CARDS = [
  { id: "fd-approval", cat: "OPS", q: "The FAA cleared me — can anyone still stop me?",
    a: "In the air, no — airspace is exclusively federal. But cities, counties, states, parks, and property owners CAN regulate where you take off, land, and stand. Most drone confrontations are about the ground, not the sky.",
    rule: "FAA: pilots are responsible for knowing where it is safe AND allowed to fly.",
    kw: "faa approval local police stop legal ground takeoff landing", src: S("WCIF") },
  { id: "fd-local", cat: "OPS", q: "Do local drone laws exist?",
    a: "Yes — takeoff/landing bans in city parks, noise and nuisance rules, state privacy and critical-infrastructure statutes. Search '[city] drone ordinance' before a paid job; screenshot what you find.",
    rule: "A local cop enforcing a park rule doesn't care that airspace is federal — and on the ground, they're right.",
    kw: "local ordinance city state law park rule takeoff", src: null },
  { id: "fd-nps", cat: "OPS", q: "National and state parks?",
    a: "National Park Service: launching, landing, or operating FROM park land is banned (36 CFR 1.5 closures) — flying over from outside is an FAA matter but rangers can cite the ground activity. State/county parks vary — many require permits.",
    rule: "The scenic shot is usually legal from OUTSIDE the boundary. Plan the launch point, not just the frame.",
    kw: "national park nps state park ban launch land permit", src: null },
  { id: "fd-property", cat: "OPS", q: "Private property under my flight path?",
    a: "Overflight is FAA turf, but standing on someone's land to fly is trespassing, and repeated low passes can be nuisance or harassment under state law. Get WRITTEN permission for the launch site — and tell neighbors when the camera will be up.",
    rule: "A permission text message has ended more disputes than any regulation quote.",
    kw: "private property trespass permission launch site neighbors", src: null },
  { id: "fd-privacy", cat: "OPS", q: "Camera etiquette that keeps you out of trouble?",
    a: "Don't hover at windows, don't track people who haven't consented, announce the flight when practical, and honor 'please don't film me.' Legal exposure aside — one viral 'creepy drone' clip costs more business than any shot earns.",
    rule: "Fly like everyone below assumes the camera is recording. It probably is.",
    kw: "privacy camera filming people etiquette consent window", src: null },
  { id: "fd-police", cat: "OPS", q: "Someone official (or angry) approaches mid-flight — the script?",
    a: "1) 'Give me 30 seconds to land safely' — then land. 2) Stay calm, don't argue airspace law. 3) Show your certificate, registration, and authorization. 4) If it's police and they insist: comply, document, contest LATER — never mid-flight.",
    rule: "The PIC's first job is the aircraft. A rolling argument with a live drone overhead is how accidents happen.",
    kw: "police law enforcement approached script land calm show", src: null },
  { id: "fd-show", cat: "REG", q: "What must I actually show, and to whom?",
    a: "Your remote pilot certificate and ID to the FAA, NTSB, TSA, or law enforcement ON REQUEST — that part is regulation. Registration must be available too. Airspace authorizations and waivers: keep them accessible (screenshot works).",
    rule: "107.7 — present certificate and registration upon request.",
    kw: "show certificate registration request law enforcement 107.7 documents", src: S("PART107", "§107.7") },
  { id: "fd-b4ufly", cat: "OPS", q: "Fastest way to check a spot before I commit?",
    a: "An FAA-approved B4UFLY app (Aloft, Airspace Link, AutoPylot, Avision, UASidekick) shows airspace, TFRs, and advisories in one screen. It's situational awareness — NOT an authorization.",
    rule: "Check the app, then get LAANC if the airspace needs it. Two different steps.",
    kw: "b4ufly app check spot aloft airspace link advisory", src: S("B4UFLY") },
];
```

- [ ] **Step 3: Wire into CardSection**

In `CardSection.jsx`:

```js
import { FIELD_BANNER, FIELD_CARDS } from "../data/field.js";
```

Add a `field` branch before the final return (mirroring the `oop` pattern):

```jsx
  if (sectionId === "field") return (
    <>
      <div style={{ margin: "10px 0 4px", fontFamily: mono, fontSize: 11.5, lineHeight: 1.6,
        color: T.amber, background: T.amber + "12", border: `1px solid ${T.amber}44`,
        borderRadius: 8, padding: "10px 12px" }}>{FIELD_BANNER}</div>
      <SectionLabel>ON THE GROUND</SectionLabel>
      {cardList(FIELD_CARDS, focusId)}
    </>
  );
```

- [ ] **Step 4: Register + index**

`theme.js` — insert after the `rightofway` entry:

```js
  { id: "field", title: "Field Awareness", cat: "OPS", glyph: "⚑",
    blurb: "FAA-legal ≠ location-approved: local rules, privacy, police" },
```

(No `App.jsx` change — unknown VIEWS ids fall through to `CardSection`.)

`searchIndex.js`:

```js
import { FIELD_CARDS } from "./field.js";
```
```js
FIELD_CARDS.forEach((c) =>
  add({ id: c.id, section: "field", cat: c.cat, title: c.q,
    body: `${c.a} ${c.rule || ""}`, kw: c.kw }));
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npm test && npm run build` — pass.
Browser: `#/field` shows banner + cards; cards with `src: null` show the "PRACTICE GUIDANCE — NOT REGULATION" badge when opened; `fd-show` shows a real SOURCE drawer; search "police" deep-links.

- [ ] **Step 6: Commit**

```bash
git add src/data/field.js src/components/CardSection.jsx src/theme.js src/data/searchIndex.js src/data/citations.test.js
git commit -m "feat: Field Awareness section — local law, privacy, and the ground game"
```

---

### Task 11: Citation verification pass

**Files:**
- Modify (as needed): `src/data/hardNumbers.js`, `src/data/trees.js`, `src/data/cards.js`, `src/data/airspace.js`, `src/data/weather.js`, `src/data/authorization.js`, `src/data/field.js`, `src/data/sources.js`

This task verifies every `§` ref against the current eCFR text and every registry URL against the live page. **No guessed refs ship** — a ref that can't be confirmed is demoted to a bare document citation (drop `ref`).

- [ ] **Step 1: Verify Part 107 section refs against eCFR**

Fetch `https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107` (WebFetch or equivalent). For each ref below, confirm the section exists AND its subject matches the claim it backs. Unique refs to check:

§107.3 (definitions / 55 lb), §107.7 (present certificate on request), §107.9 (accident reporting, 10 days, $500), §107.15 (condition for safe operation), §107.17 (medical), §107.21 (in-flight emergency), §107.23 (careless/reckless, dropped objects), §107.25 (moving vehicle), §107.27 (alcohol/drugs), §107.29 (night/twilight lighting), §107.31 (VLOS), §107.33 (visual observer), §107.37 (right of way), §107.39 (over people), §107.41 (controlled airspace authorization), §107.49 (preflight), §107.51(a)–(d) (speed/altitude/visibility/clouds), §107.61 (eligibility, age 16), §107.65 (recurrent 24 mo), §107.71 (retest wait), §107.73 (knowledge areas), §107.77 (change of address), §107.110 / §107.115 / §107.125 / §107.140 (OOP Categories 1–4), §107.145 (open-air assemblies), §107.200 (waiver), Subpart D (ops over people).

Watch specifically: the exact section numbers for OOP Categories 2–4 and open-air assemblies (107.110–107.160 range is easy to mis-map), whether the knowledge-test card should cite §107.71 vs §107.73, and whether the address-change and temporary-certificate facts really live in Part 107 or in Part 61 — demote to `S("PART107")` if ambiguous.

- [ ] **Step 2: Verify registry URLs**

Fetch each of the 16 `SOURCES` URLs; confirm each returns the described page (not a 404/redirect to something else). Fix any moved URL. The AC 107-2A direct-PDF link is the most likely to have moved — if so, point it at the FAA Advisory Circular search page entry for AC 107-2A.

- [ ] **Step 3: Apply corrections**

For each wrong ref: fix it if the correct section is confirmed, otherwise drop `ref`. Update `lastChecked` to the verification date for every registry entry actually checked.

- [ ] **Step 4: Verify and commit**

Run: `npm run lint && npm test`
Commit:

```bash
git add src/data
git commit -m "chore: verify all FAA citations against current eCFR and FAA pages"
```

---

### Task 12: Final QA and wrap-up

- [ ] **Step 1: Full check**

```bash
npm run lint && npm test && npm run build
```

Expected: zero lint errors, all tests pass, build succeeds.

- [ ] **Step 2: Browser smoke test** (dev server + preview tools)

- Home: 17 section tiles render (14 original + Authorization, Field Awareness, Library).
- Search "laanc" → hits from trees, airspace, AND authorization; a grid result deep-links into `#/authorization` with flash.
- Search "chart supplement" → library row; "police" → field card; "unicom" → data-block token.
- Each new route (`#/authorization`, `#/library`, `#/field`) renders and Back returns Home.
- Source drawers: open one in every section type (number card, tree verdict, airspace panel, METAR strip, OOP row, cert step, TFR card, field card) — links open FAA pages in a new tab.
- `src: null` field cards show the practice-guidance badge.
- Unknown hash (`#/nope`) still lands on Home.

- [ ] **Step 3: Fix anything found, then final commit**

```bash
git add -A
git commit -m "chore: reference layer QA fixes"
```

- [ ] **Step 4: Finish the branch**

Use superpowers:finishing-a-development-branch — present merge/PR options for `reference-layer` → `main`.
