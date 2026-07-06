import { T, mono } from "../theme.js";

export default function Header({ overall }) {
  return (
    <header style={{ padding: "20px 4px 14px", borderBottom: `1px dashed ${T.magenta}66` }}>
      <div style={{ fontFamily: mono, fontSize: 11, color: T.dim, letterSpacing: 2 }}>
        FAA · REMOTE PILOT · sUAS · 5 PILLARS</div>
      <h1 style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, margin: "4px 0 8px", letterSpacing: 1, color: T.text }}>
        PART 107 <span style={{ color: T.magenta }}>//</span> CORE PILLARS
      </h1>
      <div style={{ display: "flex", gap: 14, fontFamily: mono, fontSize: 11, color: T.dim }}>
        <span>MASTERED <b style={{ color: T.green }}>{Math.round(overall * 100)}%</b></span>
        <span>EXAM GATE <b style={{ color: T.amber }}>70%</b></span>
        <span>FEE <b style={{ color: T.text }}>$175</b></span>
      </div>
      <div style={{ height: 4, background: T.panel, borderRadius: 2, marginTop: 10 }}>
        <div style={{ height: 4, width: `${overall * 100}%`, background: T.green, borderRadius: 2, transition: "width .3s" }} />
      </div>
    </header>
  );
}
