import { useState } from "react";
import { T, CAT, SECTIONS, mono } from "../theme.js";
import { search } from "../data/searchIndex.js";
import { Tag } from "./atoms.jsx";

function Result({ r }) {
  const sec = SECTIONS.find((s) => s.id === r.section);
  return (
    <a href={`#/${r.section}/${r.id}`} style={{ display: "block", textDecoration: "none",
      background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8,
      padding: "10px 12px", marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>{r.title}</span>
        <Tag cat={r.cat} />
      </div>
      <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.45, marginTop: 3,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {r.body}</div>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: CAT[sec.cat].c, marginTop: 5 }}>
        {sec.glyph} {sec.title.toUpperCase()} →</div>
    </a>
  );
}

export default function Home() {
  const [q, setQ] = useState("");
  const results = search(q);
  const searching = q.trim().length >= 2;

  return (
    <>
      <header style={{ padding: "20px 4px 6px" }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: T.dim, letterSpacing: 2 }}>
          FAA · REMOTE PILOT · sUAS · FIELD MANUAL</div>
        <h1 style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, margin: "4px 0 2px",
          letterSpacing: 1, color: T.text }}>
          PART 107 <span style={{ color: T.magenta }}>//</span> 10-SECOND ANSWERS</h1>
        <div style={{ fontSize: 12.5, color: T.dim }}>Confused? Search it. Tap it. Fly (or don't).</div>
      </header>

      <div style={{ position: "sticky", top: 0, background: T.ink, zIndex: 5, padding: "12px 0 8px" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: night, LAANC, ceiling, 400…"
          autoFocus enterKeyHint="search"
          style={{ width: "100%", boxSizing: "border-box", background: T.panel,
            border: `1px solid ${searching ? T.blue : T.line}`, borderRadius: 8,
            padding: "12px 14px", fontSize: 15, color: T.text, fontFamily: mono, outline: "none" }} />
      </div>

      {searching ? (
        <div>
          <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: 1.5, color: T.dim, margin: "6px 0 10px" }}>
            {results.length ? `${results.length} ANSWER${results.length > 1 ? "S" : ""}` : "NO MATCHES — TRY 'twilight', 'stall', 'class e'"}</div>
          {results.map((r) => <Result key={r.id} r={r} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingTop: 6 }}>
          {SECTIONS.map((s) => {
            const c = CAT[s.cat].c;
            return (
              <a key={s.id} href={`#/${s.id}`} style={{ textDecoration: "none", background: T.panel,
                border: `1px solid ${c}33`, borderTop: `2px solid ${c}`, borderRadius: 8,
                padding: "12px 12px 11px", minHeight: 74 }}>
                <div style={{ fontFamily: mono, fontSize: 15, color: c, marginBottom: 5 }}>{s.glyph}</div>
                <div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.5,
                  color: T.text, marginBottom: 4 }}>{s.title.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.4 }}>{s.blurb}</div>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
