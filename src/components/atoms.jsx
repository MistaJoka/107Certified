import { T, CAT, mono } from "../theme.js";

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

// structured knowledge card: LEAD TERM — detail, numbers glowing
export function Fact({ text, color, checked, onToggle }) {
  const seps = [": ", " = ", " — "];
  let cut = -1, sep = "";
  for (const s of seps) {
    const i = text.indexOf(s);
    if (i > -1 && i < 42 && (cut === -1 || i < cut)) { cut = i; sep = s; }
  }
  const lead = cut > -1 ? text.slice(0, cut) : null;
  const rest = cut > -1 ? text.slice(cut + sep.length) : text;
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start",
      background: T.panel2, border: `1px solid ${checked ? T.line : color + "38"}`,
      borderRadius: 6, padding: "9px 10px", marginBottom: 6, cursor: "pointer",
      opacity: checked ? 0.55 : 1 }}>
      <input type="checkbox" checked={checked} onChange={onToggle}
        style={{ accentColor: color, marginTop: 3, flexShrink: 0 }} />
      <span style={{ lineHeight: 1.5 }}>
        {lead && <span style={{ display: "block", fontFamily: mono, fontSize: 11.5, fontWeight: 700,
          letterSpacing: 0.5, color, textTransform: "uppercase", marginBottom: 2 }}>{lead}</span>}
        <span style={{ fontSize: 13 }}>
          <Hi text={rest} base={checked ? T.dim : T.text} /></span>
      </span>
    </label>
  );
}

// SVG progress ring
export function MasteryRing({ pct, color, size = 54, stroke = 4, label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.line} strokeWidth={stroke} />
      {pct > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray .4s" }} />}
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
        fill={pct > 0 ? color : T.dim} style={{ font: `bold 12px ${mono}` }}>
        {label ?? Math.round(pct * 100) + "%"}</text>
    </svg>
  );
}
