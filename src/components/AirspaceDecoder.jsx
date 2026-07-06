import { useState } from "react";
import { T, mono } from "../theme.js";
import { MANTRA, AIRSPACE_ITEMS, DATABLOCK_TOKENS, DATABLOCK_SRC } from "../data/airspace.js";
import { LegendTile } from "./diagrams.jsx";
import { Badge, Hi, useFocusFlash, SourceDrawer, SectionLabel, TokenStrip } from "./atoms.jsx";

export default function AirspaceDecoder({ focusId }) {
  const [openId, setOpenId] = useState(focusId || null);
  useFocusFlash(focusId);
  const open = AIRSPACE_ITEMS.find((a) => a.id === openId);

  return (
    <>
      <div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.5,
        color: T.green, background: T.green + "12", border: `1px solid ${T.green}44`,
        borderRadius: 8, padding: "10px 12px", margin: "10px 0 6px", lineHeight: 1.5 }}>
        {MANTRA}</div>
      <div style={{ fontSize: 12, color: T.dim, padding: "0 2px 10px" }}>
        Tap the symbol you're looking at on the sectional.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {AIRSPACE_ITEMS.map((a) => {
          const active = openId === a.id;
          return (
            <button key={a.id} id={a.id} onClick={() => setOpenId(active ? null : a.id)}
              style={{ background: T.panel, border: `1px solid ${active ? T.amber : T.line}`,
                borderRadius: 8, padding: 0, cursor: "pointer", overflow: "hidden" }}>
              <LegendTile sym={a.sym} />
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: 0.3, lineHeight: 1.3,
                color: active ? T.amber : T.dim, padding: "6px 4px 8px" }}>{a.title}</div>
            </button>
          );
        })}
      </div>

      <SectionLabel color={T.blue}>AIRPORT DATA BLOCK — TAP IT APART</SectionLabel>
      <TokenStrip tokens={DATABLOCK_TOKENS} prefix="datablock" color={T.blue} src={DATABLOCK_SRC} />

      {open && (
        <div style={{ position: "sticky", bottom: 12, marginTop: 12, background: T.panel2,
          border: `1px solid ${T.amber}55`, borderRadius: 10, padding: "13px 14px",
          boxShadow: "0 8px 24px #00000088" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <Badge v={open.verdict} />
            <button onClick={() => setOpenId(null)} style={{ background: "none", border: "none",
              color: T.dim, fontFamily: mono, fontSize: 14, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.45, margin: "8px 0 6px" }}>
            <Hi text={open.answer} base={T.text} /></div>
          <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
            <Hi text={open.detail} base={T.dim} /></div>
          <SourceDrawer src={open.src} />
        </div>
      )}
    </>
  );
}
