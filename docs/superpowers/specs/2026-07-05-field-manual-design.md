# 107Certified: Visual FAA Part 107 Field Manual — Design

**Date:** 2026-07-05
**Goal:** Convert the pillar-checklist app into an interactive visual reference/cheatsheet.
The test of success: *"If I'm confused, I open the app and get the answer visually in 10 seconds."*

## Boundary

This is a **legal study/reference cockpit** — rules, scenarios, diagrams, quick answers.
It is **not** an FAA exam answer dump: no quiz bank, no real test questions, no multiple-choice drills.

## What stays

- Vite + React, zero runtime dependencies beyond React
- "Sectional chart at night" theme (`src/theme.js`), pillar color coding (REG/CHART/WX/LOAD/OPS)
- Every fact currently in `src/data/pillars.js` — rehomed into section data modules

## What goes

- Mastery checkboxes, progress %, `useMastery` localStorage state
- CARDS/MAP pillar navigation (`PillarCards`, `PillarMap`, `PillarDetail`)

## UX model

**Home = global search bar + section grid.** Typing filters a flat index of every fact,
number, diagram, and decision tree; results deep-link into their section. Sections open
as full-screen views with a back link. Hash routing (`#/hard-numbers` etc.) so browser
back and deep links work — no router dependency.

## Sections

Priority interactive sections (rich, custom UI):

1. **Hard Numbers** — big-type number cards (400 ft, 100 mph, 3 SM, 55 lb, 10 days, 24 mo…), grouped, searchable
2. **Can I Fly?** — step-through yes/no decision trees: controlled airspace, over 400 ft, over people, night, moving vehicle, accident reporting
3. **Airspace Decoder** — interactive SVG sectional legend: tap a ring/symbol → class, ceiling, authorization answer
4. **Weather Decoder** — annotated raw METAR + TAF: tap any token → plain-English meaning; ceiling rule and cloud-clearance diagram

Answer-card sections (shared `CardSection` component — question → tap-to-reveal answer + rule):

5. **Night Ops** — civil twilight, lights, illusions, dark adaptation (with twilight timeline diagram)
6. **Airport Ops** — runway numbers/compass, pattern legs diagram, CTAF, hold-short, markings
7. **Remote ID** — standard / broadcast module / FRIA
8. **Ops Over People** — Category 1–4 visual matrix
9. **Emergency / Accident** — what to do, when/what to report
10. **Certification Path** — IACRA → FTN → PSI → 8710-13 stepper, costs, currency
11. **Performance & Loading** — forces, stall/AoA, load factor, density altitude
12. **Pilot Mind** — MAIIR, DECIDE, PAVE, IMSAFE, physiology
13. **Maintenance** — preflight, batteries, firmware, logs

## Architecture

```
src/
  theme.js            (kept, extended with section registry)
  data/
    hardNumbers.js    grouped number cards + keywords
    trees.js          decision tree nodes {q, yes, no, answer}
    airspace.js       decoder entries: symbol id + reveal text
    weather.js        METAR/TAF token arrays + wx theory cards
    cards.js          answer-card content for sections 5–13
    searchIndex.js    flattens all of the above into search records
  components/
    atoms.jsx         shared UI bits (kept/adapted)
    diagrams.jsx      SVGs: sectional rings, cloud clearance, runway compass,
                      pattern legs, twilight timeline
    Home.jsx          search bar + results + section grid
    HardNumbers.jsx   CanIFly.jsx   AirspaceDecoder.jsx   WeatherDecoder.jsx
    CardSection.jsx   generic tap-to-reveal answer-card list
  App.jsx             hash router: '' → Home, '#/x' → section
```

Each search record: `{ id, section, title, body, keywords }`. Search is substring +
keyword match over lowercased fields, ranked title-hit > keyword-hit > body-hit.
Example: "night" → Night Ops section, civil twilight card, anti-collision light number,
night illusions card.

## Error handling / edge cases

- Unknown hash → Home
- Empty search → section grid; no results → "no matches" hint
- All state is per-view React state; nothing persisted (localStorage key from the
  old mastery UX is abandoned, harmless)

## Testing

Manual verification via dev-server preview: search deep-links, each section renders,
tree walkthroughs reach answers, decoder taps reveal, back navigation works.
