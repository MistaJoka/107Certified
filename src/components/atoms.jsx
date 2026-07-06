import { useEffect, useState } from "react";
import { T, CAT, mono } from "../theme.js";
import { SOURCES } from "../data/sources.js";

export const Tag = ({ cat }) => (
  <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: CAT[cat].c,
    border: `1px solid ${CAT[cat].c}55`, padding: "2px 6px", borderRadius: 3 }}>{CAT[cat].label}</span>
);

export const SectionLabel = ({ children, color = T.dim }) => (
  <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1.5, color, margin: "14px 0 8px" }}>{children}</div>
);

// highlight regs (107.x) + numbers with units — the exam currency
const NUM_RE = /(107\.\d+|\d[\d,]*(?:\.\d+)?(?:\s?(?:ft|SM|NM|mph|kt|lbs?|hrs?|min|fpm|MHz|days?|months?|AGL|MSL|°C|°F|%))?)/g;
export const Hi = ({ text, base }) => (
  <>{text.split(NUM_RE).map((p, i) => i % 2 === 1
    ? <b key={i} style={{ color: T.amber, fontFamily: mono, fontSize: 12.5, fontWeight: 700 }}>{p}</b>
    : <span key={i} style={{ color: base }}>{p}</span>)}</>
);

// verdict badge for trees + airspace decoder
const VERDICT = {
  FLY:     { c: T.green,   label: "✓ FLY" },
  GO:      { c: T.green,   label: "✓ FLY FREE" },
  NO:      { c: T.red,     label: "✕ DO NOT FLY" },
  NEVER:   { c: T.red,     label: "✕ NEVER" },
  AUTH:    { c: T.amber,   label: "⚠ AUTHORIZATION" },
  CAUTION: { c: T.amber,   label: "⚠ CAUTION" },
  INFO:    { c: T.blue,    label: "ℹ DECODE" },
};
export const Badge = ({ v }) => {
  const b = VERDICT[v] || VERDICT.INFO;
  return <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1,
    color: b.c, border: `1px solid ${b.c}66`, background: b.c + "18",
    padding: "3px 8px", borderRadius: 4 }}>{b.label}</span>;
};

// back header for section views
export function BackBar({ title, cat, glyph }) {
  const c = cat ? CAT[cat].c : T.dim;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0 10px",
      position: "sticky", top: 0, background: T.ink, zIndex: 5, borderBottom: `1px dashed ${c}44` }}>
      <a href="#/" style={{ fontFamily: mono, fontSize: 12, color: T.dim, textDecoration: "none",
        border: `1px solid ${T.line}`, borderRadius: 6, padding: "6px 10px", flexShrink: 0 }}>← 107</a>
      <span style={{ fontFamily: mono, fontSize: 15, color: c }}>{glyph}</span>
      <h2 style={{ fontFamily: mono, fontSize: 16, fontWeight: 700, letterSpacing: 1, margin: 0, color: T.text }}>
        {title}</h2>
    </div>
  );
}

// scroll-to + flash a deep-linked card (from search results)
export function useFocusFlash(focusId) {
  useEffect(() => {
    if (!focusId) return;
    const el = document.getElementById(focusId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.transition = "box-shadow .3s";
    el.style.boxShadow = `0 0 0 2px ${T.amber}`;
    const t = setTimeout(() => { el.style.boxShadow = "none"; }, 2000);
    return () => clearTimeout(t);
  }, [focusId]);
}

// answer card: question up front, tap to reveal answer + rule
export function Reveal({ id, cat, q, a, rule, src, open: forceOpen }) {
  const [open, setOpen] = useState(!!forceOpen);
  const c = CAT[cat].c;
  return (
    <div id={id} onClick={() => setOpen(!open)} style={{ background: T.panel,
      border: `1px solid ${open ? c + "66" : T.line}`, borderRadius: 8,
      padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>{q}</div>
        <span style={{ fontFamily: mono, fontSize: 12, color: open ? c : T.dim, flexShrink: 0 }}>
          {open ? "▾" : "▸"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.55 }}><Hi text={a} base={T.text} /></div>
          {rule && <div style={{ marginTop: 8, fontFamily: mono, fontSize: 11.5, lineHeight: 1.5,
            color: c, background: c + "12", borderLeft: `2px solid ${c}`,
            padding: "6px 9px", borderRadius: "0 4px 4px 0" }}>
            <Hi text={rule} base={c} /></div>}
          <SourceDrawer src={src} />
        </div>
      )}
    </div>
  );
}

// generic panel wrapper
export const Panel = ({ children, style }) => (
  <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8,
    padding: "12px 14px", marginBottom: 8, ...style }}>{children}</div>
);

// tap-a-token decoder strip (METAR, TAF, NOTAM, airport data block)
export function TokenStrip({ tokens, prefix, color, src }) {
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
      <SourceDrawer src={src} />
    </Panel>
  );
}

// citation drawer — src: {doc, ref?} | null (practice guidance) | undefined (hidden)
export function SourceDrawer({ src }) {
  const [open, setOpen] = useState(false);
  if (src === undefined) return null;
  if (src === null) return (
    <div style={{ marginTop: 9, fontFamily: mono, fontSize: 9.5, letterSpacing: 1.2,
      color: T.dim, border: `1px dashed ${T.line}`, borderRadius: 4,
      padding: "3px 7px", display: "inline-block" }}>
      PRACTICE GUIDANCE — NOT REGULATION</div>
  );
  const d = SOURCES[src.doc];
  if (!d) return null;
  return (
    <div style={{ marginTop: 9 }} onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none",
        padding: 0, cursor: "pointer", fontFamily: mono, fontSize: 10,
        letterSpacing: 1.2, color: T.dim }}>
        SOURCE {src.ref ? `· ${src.ref} ` : ""}{open ? "▾" : "▸"}</button>
      {open && (
        <div style={{ marginTop: 6, fontSize: 11.5, lineHeight: 1.5, color: T.dim,
          borderLeft: `2px solid ${T.line}`, paddingLeft: 8 }}>
          <a href={d.url} target="_blank" rel="noopener noreferrer"
            style={{ color: T.blue, textDecoration: "none" }}>{d.title} ↗</a>
          {src.ref && <span> · {src.ref}</span>}
          <div style={{ fontFamily: mono, fontSize: 9.5, marginTop: 2 }}>
            last checked {d.lastChecked}</div>
        </div>
      )}
    </div>
  );
}
