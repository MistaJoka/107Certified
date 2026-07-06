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
      {(CARD_SECTIONS.performance || []).map((c) => (
        <Reveal key={c.id} {...c} open={focusId === c.id} />
      ))}
    </div>
  );
}
