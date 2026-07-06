import { T, CAT, mono } from "../theme.js";
import { NUMBER_GROUPS } from "../data/hardNumbers.js";
import { SectionLabel, Hi, useFocusFlash } from "./atoms.jsx";

export default function HardNumbers({ focusId }) {
  useFocusFlash(focusId);
  return (
    <>
      {NUMBER_GROUPS.map((g) => (
        <div key={g.group}>
          <SectionLabel>{g.group.toUpperCase()}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {g.items.map((n) => {
              const c = CAT[n.cat].c;
              return (
                <div key={n.id} id={n.id} style={{ background: T.panel, borderRadius: 8,
                  border: `1px solid ${c}33`, padding: "12px 12px 11px",
                  gridColumn: n.detail.length > 110 ? "1 / -1" : "auto" }}>
                  <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: c,
                    letterSpacing: 0.5, lineHeight: 1.1 }}>{n.value}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.5, color: T.text,
                    fontWeight: 700, margin: "5px 0 4px", textTransform: "uppercase" }}>{n.label}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                    <Hi text={n.detail} base={T.dim} /></div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
