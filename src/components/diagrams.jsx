import { T, mono } from "../theme.js";

// ── LEGEND TILE — mini sectional-chart swatches for the decoder ────
export function LegendTile({ sym }) {
  const grid = (
    <>
      {[30, 60, 90].map((x) => <line key={"v" + x} x1={x} y1="0" x2={x} y2="80" stroke={T.line} strokeWidth="0.5" />)}
      {[27, 54].map((y) => <line key={"h" + y} x1="0" y1={y} x2="120" y2={y} stroke={T.line} strokeWidth="0.5" />)}
    </>
  );
  const ring = (stroke, dash, extra) => (
    <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
      {grid}
      <circle cx="60" cy="40" r="28" fill="none" stroke={stroke} strokeWidth="2.5" strokeDasharray={dash} />
      {extra}
    </svg>
  );
  const airport = (c) => (
    <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
      {grid}
      <circle cx="60" cy="40" r="12" fill="none" stroke={c} strokeWidth="2.5" />
      <line x1="50" y1="40" x2="70" y2="40" stroke={c} strokeWidth="3.5" />
    </svg>
  );
  switch (sym) {
    case "solid-blue":     return ring(T.blue, "none");
    case "solid-magenta":  return ring(T.magenta, "none");
    case "dashed-blue":    return ring(T.blue, "6 4");
    case "dashed-magenta": return ring(T.magenta, "6 4");
    case "shaded-magenta": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        {grid}
        <defs>
          <radialGradient id="vig">
            <stop offset="55%" stopColor={T.magenta} stopOpacity="0" />
            <stop offset="72%" stopColor={T.magenta} stopOpacity="0.55" />
            <stop offset="100%" stopColor={T.magenta} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="40" r="36" fill="url(#vig)" />
      </svg>);
    case "plain": return <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>{grid}</svg>;
    case "ceiling": return ring(T.blue, "none",
      <text x="60" y="45" textAnchor="middle" fill={T.blue} style={{ font: `bold 14px ${mono}` }}>40</text>);
    case "airport-blue":    return airport(T.blue);
    case "airport-magenta": return airport(T.magenta);
    case "prohibited": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        {grid}
        <rect x="35" y="18" width="50" height="44" fill={T.blue + "22"} stroke={T.blue} strokeWidth="2" />
        {[42, 50, 58, 66, 74].map((x) => <line key={x} x1={x} y1="20" x2={x - 6} y2="60" stroke={T.blue} strokeWidth="1" />)}
        <text x="60" y="74" textAnchor="middle" fill={T.blue} style={{ font: `bold 9px ${mono}` }}>P-56</text>
      </svg>);
    case "mtr": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        {grid}
        <line x1="8" y1="58" x2="112" y2="22" stroke={T.dim} strokeWidth="2" />
        <text x="60" y="32" textAnchor="middle" fill={T.dim} style={{ font: `bold 10px ${mono}` }}>VR1234</text>
      </svg>);
    case "mef": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        {grid}
        <text x="52" y="52" textAnchor="middle" fill={T.blue} style={{ font: `bold 26px ${mono}` }}>3</text>
        <text x="68" y="40" textAnchor="middle" fill={T.blue} style={{ font: `bold 15px ${mono}` }}>2</text>
        <path d="M 92 60 l 6 -12 l -4 2 l 5 -10" fill="none" stroke={T.amber} strokeWidth="1.6" />
        <text x="95" y="72" textAnchor="middle" fill={T.text} style={{ font: `bold 8px ${mono}` }}>1049</text>
        <text x="95" y="79" textAnchor="middle" fill={T.dim} style={{ font: `8px ${mono}` }}>(305)</text>
      </svg>);
    case "latlong": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        {grid}
        <line x1="0" y1="46" x2="120" y2="46" stroke={T.text} strokeWidth="1.2" />
        {Array.from({ length: 14 }, (_, i) => 8 + i * 8).map((x, i) => (
          <line key={x} x1={x} y1={i % 5 === 0 ? 39 : 42} x2={x} y2="46" stroke={T.text} strokeWidth="1" />
        ))}
        <line x1="88" y1="0" x2="88" y2="80" stroke={T.text} strokeWidth="1.2" />
        <text x="8" y="34" fill={T.text} style={{ font: `bold 10px ${mono}` }}>38°</text>
        <text x="94" y="72" fill={T.dim} style={{ font: `9px ${mono}` }}>30'</text>
      </svg>);
    case "stack": return (
      <svg viewBox="0 0 120 80" style={{ width: "100%", display: "block" }}>
        <rect x="0" y="4" width="120" height="22" fill={T.purple + "33"} />
        <rect x="0" y="26" width="120" height="34" fill={T.blue + "22"} />
        <rect x="0" y="60" width="120" height="16" fill={T.green + "22"} />
        <line x1="0" y1="26" x2="120" y2="26" stroke={T.purple} strokeWidth="1" />
        <line x1="0" y1="60" x2="120" y2="60" stroke={T.green} strokeWidth="1" />
        <text x="6" y="19" fill={T.purple} style={{ font: `bold 10px ${mono}` }}>A 18,000</text>
        <text x="6" y="46" fill={T.blue} style={{ font: `bold 10px ${mono}` }}>E</text>
        <text x="6" y="73" fill={T.green} style={{ font: `bold 10px ${mono}` }}>G ← you</text>
      </svg>);
    default: return null;
  }
}

// ── CLOUD CLEARANCE — 500 below / 2,000 horizontal ─────────────────
export function CloudClearanceSVG() {
  return (
    <svg viewBox="0 0 340 170" style={{ width: "100%", display: "block" }} role="img"
      aria-label="cloud clearance diagram">
      {/* cloud */}
      <g fill={T.panel2} stroke={T.blue} strokeWidth="1.5">
        <ellipse cx="105" cy="38" rx="58" ry="17" />
        <ellipse cx="72" cy="30" rx="26" ry="13" />
        <ellipse cx="132" cy="28" rx="30" ry="14" />
      </g>
      {/* vertical 500 ft */}
      <line x1="105" y1="58" x2="105" y2="110" stroke={T.amber} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="112" y="88" fill={T.amber} style={{ font: `bold 12px ${mono}` }}>500 ft below</text>
      {/* drone */}
      <g transform="translate(105 122)">
        <line x1="-14" y1="0" x2="14" y2="0" stroke={T.green} strokeWidth="2.5" />
        <circle cx="-14" cy="0" r="5" fill="none" stroke={T.green} strokeWidth="2" />
        <circle cx="14" cy="0" r="5" fill="none" stroke={T.green} strokeWidth="2" />
      </g>
      {/* horizontal 2000 ft to a second cloud */}
      <line x1="130" y1="122" x2="268" y2="122" stroke={T.amber} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="150" y="114" fill={T.amber} style={{ font: `bold 12px ${mono}` }}>2,000 ft horizontal</text>
      <g fill={T.panel2} stroke={T.blue} strokeWidth="1.5">
        <ellipse cx="298" cy="122" rx="34" ry="14" />
        <ellipse cx="282" cy="112" rx="18" ry="10" />
      </g>
      <text x="10" y="160" fill={T.dim} style={{ font: `10px ${mono}` }}>107.51 — and 3 SM flight visibility</text>
    </svg>
  );
}

// ── RUNWAY COMPASS — runway 27 = 270° magnetic ─────────────────────
export function RunwayCompassSVG() {
  const cx = 85, cy = 85, r = 66;
  const pts = [["N", 0], ["E", 90], ["S", 180], ["W", 270]];
  return (
    <svg viewBox="0 0 340 170" style={{ width: "100%", display: "block" }} role="img"
      aria-label="runway heading compass">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.line} strokeWidth="1.5" />
      {pts.map(([l, deg]) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return <text key={l} x={cx + Math.cos(a) * (r - 13)} y={cy + Math.sin(a) * (r - 13) + 4}
          textAnchor="middle" fill={T.dim} style={{ font: `bold 11px ${mono}` }}>{l}</text>;
      })}
      {/* runway strip pointing west (270°) */}
      <g transform={`rotate(0 ${cx} ${cy})`}>
        <rect x={cx - 56} y={cy - 9} width="112" height="18" fill={T.panel2} stroke={T.text} strokeWidth="1.2" />
        <line x1={cx - 44} y1={cy} x2={cx + 44} y2={cy} stroke={T.dim} strokeWidth="1" strokeDasharray="6 5" />
        <text x={cx - 38} y={cy + 4} fill={T.text} style={{ font: `bold 10px ${mono}` }}>27</text>
        <text x={cx + 27} y={cy + 4} fill={T.text} style={{ font: `bold 10px ${mono}` }}>9</text>
      </g>
      <line x1={cx - 66} y1={cy} x2={cx - 84} y2={cy} stroke={T.amber} strokeWidth="2" markerEnd="none" />
      <text x="178" y="62" fill={T.text} style={{ font: `13px ${mono}` }}>Runway 27 → 270°</text>
      <text x="178" y="82" fill={T.dim} style={{ font: `11px ${mono}` }}>number = heading ÷ 10</text>
      <text x="178" y="108" fill={T.text} style={{ font: `13px ${mono}` }}>Opposite end: 9</text>
      <text x="178" y="128" fill={T.dim} style={{ font: `11px ${mono}` }}>differs by 18 (180°)</text>
    </svg>
  );
}

// ── PATTERN LEGS — standard left traffic ───────────────────────────
export function PatternLegsSVG() {
  const lbl = (x, y, t, c = T.text) =>
    <text x={x} y={y} textAnchor="middle" fill={c} style={{ font: `bold 10px ${mono}` }}>{t}</text>;
  return (
    <svg viewBox="0 0 340 190" style={{ width: "100%", display: "block" }} role="img"
      aria-label="left traffic pattern">
      {/* runway */}
      <rect x="120" y="132" width="120" height="16" fill={T.panel2} stroke={T.text} strokeWidth="1.2" />
      {lbl(133, 143, "27", T.text)}
      {/* pattern rectangle (left turns, flying west then around) */}
      <g fill="none" stroke={T.green} strokeWidth="2">
        <path d="M 132 140 L 60 140" markerEnd="url(#arr)" />          {/* upwind */}
        <path d="M 52 132 L 52 66" markerEnd="url(#arr)" />            {/* crosswind */}
        <path d="M 60 58 L 282 58" markerEnd="url(#arr)" />            {/* downwind */}
        <path d="M 290 66 L 290 132" markerEnd="url(#arr)" />          {/* base */}
        <path d="M 282 140 L 246 140" markerEnd="url(#arr)" />         {/* final */}
      </g>
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" fill={T.green} />
        </marker>
      </defs>
      {lbl(92, 128, "UPWIND", T.green)}
      {lbl(38, 100, "X-WIND", T.green)}
      {lbl(170, 48, "DOWNWIND", T.green)}
      {lbl(312, 100, "BASE", T.green)}
      {lbl(264, 156, "FINAL", T.amber)}
      <text x="10" y="180" fill={T.dim} style={{ font: `10px ${mono}` }}>
        Standard = LEFT turns · 'RP' on chart = right pattern · final = manned traffic descending</text>
    </svg>
  );
}

// ── TWILIGHT TIMELINE — when lights are required ───────────────────
export function TwilightSVG() {
  return (
    <svg viewBox="0 0 340 130" style={{ width: "100%", display: "block" }} role="img"
      aria-label="civil twilight timeline">
      {/* day / twilight / night bands */}
      <rect x="10" y="40" width="90" height="26" fill={T.amber + "33"} />
      <rect x="100" y="40" width="70" height="26" fill={T.purple + "44"} />
      <rect x="170" y="40" width="160" height="26" fill={T.panel2} />
      <text x="55" y="57" textAnchor="middle" fill={T.amber} style={{ font: `bold 10px ${mono}` }}>DAY</text>
      <text x="135" y="57" textAnchor="middle" fill={T.purple} style={{ font: `bold 10px ${mono}` }}>TWILIGHT</text>
      <text x="250" y="57" textAnchor="middle" fill={T.dim} style={{ font: `bold 10px ${mono}` }}>NIGHT</text>
      {/* markers */}
      <line x1="100" y1="30" x2="100" y2="76" stroke={T.amber} strokeWidth="1.5" />
      <text x="100" y="24" textAnchor="middle" fill={T.amber} style={{ font: `10px ${mono}` }}>sunset</text>
      <line x1="170" y1="30" x2="170" y2="76" stroke={T.purple} strokeWidth="1.5" />
      <text x="170" y="88" textAnchor="middle" fill={T.purple} style={{ font: `10px ${mono}` }}>+30 min</text>
      {/* light-required span */}
      <line x1="100" y1="104" x2="330" y2="104" stroke={T.red} strokeWidth="2.5" />
      <text x="104" y="118" fill={T.red} style={{ font: `bold 10px ${mono}` }}>
        ⚠ anti-collision light required (3 SM visible)</text>
    </svg>
  );
}
