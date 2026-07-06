import { T, CAT, mono } from "../theme.js";
import { PILLARS, pillarCounts } from "../data/pillars.js";
import { Tag, MasteryRing } from "./atoms.jsx";

export default function PillarCards({ pct, onOpen }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {PILLARS.map((p) => {
        const c = CAT[p.id].c;
        const { concepts, criteria } = pillarCounts(p);
        return (
          <button key={p.id} onClick={() => onOpen(p.id)} style={{ display: "flex", gap: 14,
            alignItems: "center", textAlign: "left", background: T.panel, border: "none",
            borderLeft: `3px ${p.id === "CHART" ? "dashed" : "solid"} ${c}`,
            borderRadius: 8, padding: "14px 14px", cursor: "pointer", color: T.text }}>
            <MasteryRing pct={pct(p)} color={c} />
            <span style={{ flex: 1 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</span>
                <Tag cat={p.id} />
              </span>
              <span style={{ display: "block", fontSize: 12.5, color: T.dim, lineHeight: 1.45 }}>{p.essence}</span>
              <span style={{ display: "block", fontFamily: mono, fontSize: 10, color: T.dim,
                letterSpacing: 1, marginTop: 6 }}>
                {concepts} CONCEPTS · {criteria} MASTERY CHECKS</span>
            </span>
            <span style={{ fontFamily: mono, color: c, fontSize: 16 }}>›</span>
          </button>
        );
      })}
    </div>
  );
}
