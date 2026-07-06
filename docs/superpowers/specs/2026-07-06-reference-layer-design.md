# 107Certified: Reference Layer — Design

**Date:** 2026-07-06
**Goal:** Add the "real pilot reference" layer to the field manual: authorization answers,
richer chart decoding, full FAA source attribution, and field-awareness guidance.
The app stays a static, offline, zero-dependency reference — no live data, no user state.

## Scope

In scope (this phase):

1. Central FAA source registry + citation retrofit of **every** existing fact
2. Authorization section (UAS Facility Map grid, LAANC/DroneZone flow, TFRs, NOTAM decoder)
3. Chart & airport decoder expansion (airport data block, MEF, obstacles)
4. FAA Library section (rendered from the registry)
5. Field Awareness section (local law / privacy / property / law-enforcement script)

Out of scope (future phases): live METAR/TFR data, LAANC provider integrations,
Remote ID wallet, flight/battery/maintenance logs, mission planner, Simple/Pro modes.

## 1. Source registry & citations (cross-cutting)

New `src/data/sources.js` exporting `SOURCES`, keyed by short id:

| Key       | Document                                             |
| --------- | ---------------------------------------------------- |
| `PART107` | 14 CFR Part 107 (eCFR)                               |
| `AC107`   | AC 107-2A, Small UAS                                 |
| `PART89`  | 14 CFR Part 89 / FAA Remote ID page                  |
| `UASFM`   | FAA UAS Facility Maps page                           |
| `LAANC`   | FAA Part 107 Airspace Authorizations page            |
| `TFR`     | FAA TFR page (tfr.faa.gov + UAS TFR guidance)        |
| `B4UFLY`  | FAA B4UFLY page                                      |
| `CUG`     | FAA Aeronautical Chart Users' Guide                  |
| `CS`      | FAA Chart Supplement (d-CS digital products page)    |
| `AWC`     | Aviation Weather Center                              |
| `ACS`     | FAA UAS Airman Certification Standards               |
| `WCIF`    | FAA "Where Can I Fly?" page                          |
| `AIM`     | Aeronautical Information Manual                      |

Each entry: `{ title, url, group, use, lastChecked }` where `group` ∈
Rules / Airspace tools / Weather / Charts and `use` is a one-line "when you'd open this."

**Citation schema.** Every data record in `hardNumbers.js`, `cards.js`, `trees.js`
(answer nodes), `airspace.js`, `weather.js`, and all new data files gains:

```js
src: { doc: 'PART107', ref: '§107.29' }   // ref optional
```

Rules:

- `doc` must be a key in `SOURCES` (build-time check via a small assertion in
  `searchIndex.js` so a typo fails the build loudly, not silently).
- `ref` only when verified against the actual document text. If a precise section
  can't be verified, cite the parent document with no ref. **No guessed refs.**
- Practice-guidance cards with no FAA source (parts of Field Awareness) use
  `src: null` and render a "Practice guidance — not regulation" badge instead.

**UI.** New `SourceDrawer` atom in `atoms.jsx`: a muted "Source ▸" line at the foot of
a card / revealed answer / tree answer node. Tap → document title, ref, outbound link,
`lastChecked` date. Used by `CardSection`, `HardNumbers`, `CanIFly` answers, and both
decoders.

## 2. Authorization section — `#/authorization`

New `Authorization.jsx` + `data/authorization.js`. Four stacked blocks:

**a. Facility map grid (interactive SVG, in `diagrams.jsx`).** Stylized airport with a
3×4 UASFM grid overlay, squares labeled 0/100/200/400. Tap a square →
panel with: what the ceiling means, LAANC approval likelihood, whether further
coordination is needed (esp. the 0 grid: "not impossible — coordination required"),
and what to tell a client about feasibility/lead time. Persistent caveat line:
*"Facility maps show where the FAA can pre-authorize — the map itself is not an authorization."*

**b. LAANC vs FAADroneZone flow.** Small static decision diagram:
at/below grid value → LAANC near-real-time · above grid value / 0 grid → further
coordination (apply well ahead; ~72+ hours) · airport not LAANC-enabled → FAADroneZone.

**c. TFR cards.** Card list: what a TFR is, standing sporting-event TFR
(stadiums, 3 NM / 3,000 ft AGL, MLB/NFL/NCAA D1/major races), disaster/hazard TFRs,
VIP/security TFRs, where to check (tfr.faa.gov, LAANC apps), and "TFRs override
everything else — check before every flight."

**d. NOTAM decoder.** Annotated fake NOTAM in the exact interaction pattern of the
existing METAR decoder: raw NOTAM string, tap any token → plain-English meaning.
Covers: NOTAM id, location, keyword (AIRSPACE/OBST/RWY), effective times (UTC),
and a "how to read the alphabet soup" card.

## 3. Chart & airport decoder expansion

Extends `data/airspace.js`, `AirspaceDecoder.jsx`, `diagrams.jsx`:

**a. Airport data block decoder.** New annotated SVG of a realistic sectional data
block, e.g. `CHESTER (SNC) CT - 118.3 ✱L 62 122.95`. Tap each token → meaning:
airport name/identifier, control tower + part-time star, CTAF frequency,
lighting code (L, ✱L part-time), field elevation, UNICOM. Same tap-to-reveal pattern
as the existing sectional rings.

**b. New legend entries** appended to the existing decoder list: MEF quadrangle
figure (what it includes, why it's not a legal ceiling for drones), obstacle symbols
(lit vs unlit, below/above 1000 ft AGL, group obstacles), and private/restricted
airport markers.

## 4. FAA Library section — `#/library`

`Library.jsx` renders directly from `SOURCES` — zero duplicated content. Groups in
fixed order (Rules → Airspace tools → Weather → Charts), each doc as a row:
title, one-line `use`, outbound link icon, `lastChecked`. A short header explains:
"These are the official documents every answer in this app cites."

## 5. Field Awareness section — `#/field`

Uses existing `CardSection` with `data/field.js`. Content:

- Banner card: **"FAA legal ≠ socially safe ≠ client-safe ≠ location-approved"**
- Local ordinances & state drone laws (takeoff/landing restrictions vs airspace)
- Parks: national parks (NPS launch/land ban), state/local park permits
- Private property & privacy etiquette (camera courtesy, avoid hovering over homes)
- Law-enforcement interaction script (stay calm, land safely, show certificate +
  registration, don't argue jurisdiction on the street)
- "What to show if approached": Part 107 certificate, registration, authorization,
  Remote ID compliance
- No Drone Zone / "Where Can I Fly?" pointers

FAA-sourced cards cite `WCIF`/`B4UFLY`; the rest carry the practice-guidance badge.

## 6. Wiring: search, routing, theme

- `theme.js` section registry gains: Authorization, Library, Field Awareness
  (chart expansion lives inside the existing Airspace section).
- `searchIndex.js` flattens the new data files with the existing record shape
  `{ id, section, title, body, keywords }`; also indexes each SOURCES entry so
  searching "chart supplement" finds the library row.
- Hash routes `#/authorization`, `#/library`, `#/field` follow the existing pattern;
  unknown hash → Home (unchanged).

## Error handling / edge cases

- `src.doc` not found in `SOURCES` → dev-time assertion failure (loud, at import).
- `src: null` renders the practice-guidance badge, never an empty drawer.
- Outbound links: `target="_blank"` + `rel="noopener noreferrer"`.
- FAA URLs rot: registry centralization means a dead link is fixed in one place;
  `lastChecked` communicates staleness honestly.
- Facility-map grid values are **illustrative** (fake airport), labeled as such —
  real grid values must come from the FAA map; the panel says exactly that.

## Testing / verification

- **Citation verification pass before merge:** every `src` ref checked against the
  actual FAA document text (fan-out review, one reviewer per data file). Unverifiable
  ref → demoted to parent-document citation.
- `npm run lint` + `npm run build` clean.
- Browser smoke test: each new route renders, every tap target reveals, search finds
  new records, source drawers open with correct links, back navigation works.
