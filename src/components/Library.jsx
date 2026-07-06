import { T, mono } from "../theme.js";
import { SOURCES, GROUPS } from "../data/sources.js";
import { SectionLabel, useFocusFlash } from "./atoms.jsx";

export default function Library({ focusId }) {
  useFocusFlash(focusId);
  return (
    <>
      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, padding: "10px 2px 4px" }}>
        The official documents every answer in this app cites. Bookmark the ones you fly with.</div>
      {GROUPS.map((g) => (
        <div key={g}>
          <SectionLabel>{g.toUpperCase()}</SectionLabel>
          {Object.entries(SOURCES).filter(([, s]) => s.group === g).map(([key, s]) => (
            <a key={key} id={`lib-${key.toLowerCase()}`} href={s.url} target="_blank"
              rel="noopener noreferrer" style={{ display: "block", textDecoration: "none",
                background: T.panel, border: `1px solid ${T.line}`, borderRadius: 8,
                padding: "11px 13px", marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8,
                alignItems: "baseline" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text,
                  lineHeight: 1.4 }}>{s.title}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: T.blue, flexShrink: 0 }}>↗</span>
              </div>
              <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.45, marginTop: 3 }}>{s.use}</div>
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: 1, color: T.dim,
                marginTop: 5 }}>CHECKED {s.lastChecked}</div>
            </a>
          ))}
        </div>
      ))}
    </>
  );
}
