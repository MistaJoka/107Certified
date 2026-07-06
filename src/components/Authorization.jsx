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
