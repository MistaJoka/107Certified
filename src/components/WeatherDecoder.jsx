import { useState } from "react";
import { T, mono } from "../theme.js";
import { METAR_TOKENS, TAF_TOKENS, WX_CARDS } from "../data/weather.js";
import { CloudClearanceSVG } from "./diagrams.jsx";
import { SectionLabel, Reveal, Panel, Hi, useFocusFlash } from "./atoms.jsx";

function TokenStrip({ tokens, prefix, color }) {
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
    </Panel>
  );
}

export default function WeatherDecoder({ focusId }) {
  useFocusFlash(focusId);
  return (
    <>
      <SectionLabel color={T.magenta}>METAR — WHAT'S HAPPENING NOW (HOURLY OBSERVATION)</SectionLabel>
      <TokenStrip tokens={METAR_TOKENS} prefix="metar" color={T.magenta} />

      <SectionLabel color={T.blue}>TAF — THE FORECAST (24–30 HR, AIRPORT ±5 SM)</SectionLabel>
      <TokenStrip tokens={TAF_TOKENS} prefix="taf" color={T.blue} />

      <SectionLabel>YOUR MINIMUMS — 107.51</SectionLabel>
      <Panel><CloudClearanceSVG /></Panel>

      <SectionLabel>QUICK ANSWERS</SectionLabel>
      {WX_CARDS.map((c) => (
        <Reveal key={c.id} {...c} open={focusId === c.id} />
      ))}
    </>
  );
}
