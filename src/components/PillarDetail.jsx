import { T, CAT, mono } from "../theme.js";
import { conceptKey, criterionKey } from "../data/pillars.js";
import { Tag, SectionLabel, Fact, Hi, MasteryRing } from "./atoms.jsx";

export default function PillarDetail({ pillar, st, toggle, pct, onBack }) {
  const c = CAT[pillar.id].c;
  return (
    <div>
      <button onClick={onBack} style={{ fontFamily: mono, fontSize: 12, letterSpacing: 1,
        background: "none", border: "none", color: T.dim, cursor: "pointer",
        padding: "14px 0 10px" }}>← PILLARS</button>

      <div style={{ display: "flex", gap: 14, alignItems: "center", background: T.panel,
        borderRadius: 8, borderLeft: `3px ${pillar.id === "CHART" ? "dashed" : "solid"} ${c}`,
        padding: 14, marginBottom: 4 }}>
        <MasteryRing pct={pct(pillar)} color={c} size={62} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{pillar.name}</span>
            <Tag cat={pillar.id} />
          </div>
          <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5 }}>{pillar.essence}</div>
        </div>
      </div>

      <SectionLabel color={T.amber}>▸ HARD NUMBERS — know these cold</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 6 }}>
        {pillar.hardNumbers.map((n, i) => (
          <div key={i} style={{ background: T.panel2, border: `1px solid ${T.amber}33`,
            borderRadius: 6, padding: "8px 10px" }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.5, color: T.dim,
              textTransform: "uppercase", marginBottom: 3, lineHeight: 1.4 }}>{n.f}</div>
            <div style={{ fontSize: 12, lineHeight: 1.45 }}><Hi text={n.b} base={T.text} /></div>
          </div>
        ))}
      </div>

      {pillar.subtopics.map((s, si) => (
        <div key={si}>
          <SectionLabel color={c}>▸ {s.title.toUpperCase()}</SectionLabel>
          {s.concepts.map((text, ci) => {
            const k = conceptKey(pillar.id, si, ci);
            return <Fact key={k} text={text} color={c} checked={!!st.concepts[k]}
              onToggle={() => toggle("concepts", k)} />;
          })}
        </div>
      ))}

      <SectionLabel color={T.green}>▸ YOU UNDERSTAND THIS WHEN YOU CAN…</SectionLabel>
      {pillar.mastery.map((text, i) => {
        const k = criterionKey(pillar.id, i);
        const checked = !!st.criteria[k];
        return (
          <label key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start",
            fontSize: 13, color: checked ? T.green : T.text, cursor: "pointer",
            marginBottom: 8, lineHeight: 1.45 }}>
            <input type="checkbox" checked={checked} onChange={() => toggle("criteria", k)}
              style={{ accentColor: T.green, marginTop: 2, flexShrink: 0 }} />
            {text}
          </label>
        );
      })}
    </div>
  );
}
