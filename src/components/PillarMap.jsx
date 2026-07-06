import { T, CAT, mono } from "../theme.js";
import { PILLARS } from "../data/pillars.js";

// constellation layout — pillar node positions in the 480x540 chart
const POS = {
  REG:   [240, 105],
  CHART: [96, 250],
  WX:    [384, 250],
  LOAD:  [140, 430],
  OPS:   [340, 430],
};
const CENTER = [240, 268];
const NODE_R = 30;
const BRANCH = 58;

function branchAngles(pillar) {
  const [px, py] = POS[pillar.id];
  const base = Math.atan2(py - CENTER[1], px - CENTER[0]); // away from center
  const n = pillar.subtopics.length;
  if (n === 1) return [base];
  const spread = Math.min(2.6, n * 0.75); // radians
  return pillar.subtopics.map((_, i) => base - spread / 2 + (spread * i) / (n - 1));
}

export default function PillarMap({ pct, onOpen }) {
  return (
    <svg viewBox="-70 0 620 558" role="img" aria-label="Part 107 pillar map"
      style={{ width: "100%", background: T.panel2, borderRadius: 8, border: `1px solid ${T.line}` }}>
      {/* grid ticks — chart texture */}
      {[0, 80, 160, 240, 320, 400, 480].map((x) => (
        <line key={"v" + x} x1={x} y1="0" x2={x} y2="558" stroke={T.line} strokeWidth="0.5" />))}
      {[90, 180, 270, 360, 450].map((y) => (
        <line key={"h" + y} x1="-70" y1={y} x2="550" y2={y} stroke={T.line} strokeWidth="0.5" />))}

      {/* constellation links between pillars */}
      {[["REG", "CHART"], ["REG", "WX"], ["CHART", "LOAD"], ["WX", "OPS"], ["LOAD", "OPS"], ["CHART", "WX"]].map(([a, b]) => (
        <line key={a + b} x1={POS[a][0]} y1={POS[a][1]} x2={POS[b][0]} y2={POS[b][1]}
          stroke={T.line} strokeWidth="1" strokeDasharray="3 5" />
      ))}

      {PILLARS.map((p) => {
        const [px, py] = POS[p.id];
        const c = CAT[p.id].c;
        const fill = pct(p);
        const angles = branchAngles(p);
        return (
          <g key={p.id} onClick={() => onOpen(p.id)} style={{ cursor: "pointer" }}>
            {/* subtopic branches */}
            {p.subtopics.map((s, i) => {
              const a = angles[i];
              const bx = px + Math.cos(a) * (NODE_R + BRANCH);
              const by = py + Math.sin(a) * (NODE_R + BRANCH);
              const cos = Math.cos(a);
              const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
              const dx = anchor === "start" ? 6 : anchor === "end" ? -6 : 0;
              const dy = anchor === "middle" ? (Math.sin(a) > 0 ? 13 : -8) : 4;
              return (
                <g key={i}>
                  <line x1={px + Math.cos(a) * NODE_R} y1={py + Math.sin(a) * NODE_R}
                    x2={bx} y2={by} stroke={c + "77"} strokeWidth="1.2" />
                  <circle cx={bx} cy={by} r="3.5" fill={T.panel2} stroke={c} strokeWidth="1.5" />
                  <text x={bx + dx} y={by + dy} textAnchor={anchor} fill={T.dim}
                    style={{ font: `9px ${mono}`, letterSpacing: 0.5 }}>{s.short}</text>
                </g>
              );
            })}
            {/* pillar node — inner fill grows with mastery */}
            <circle cx={px} cy={py} r={NODE_R} fill={T.ink}
              stroke={c} strokeWidth="2" strokeDasharray={p.id === "CHART" ? "6 4" : "none"} />
            {fill > 0 && <circle cx={px} cy={py} r={NODE_R * Math.sqrt(fill)} fill={c + "40"} />}
            <text x={px} y={py - 2} textAnchor="middle" fill={c}
              style={{ font: `bold 13px ${mono}`, letterSpacing: 1 }}>{p.id}</text>
            <text x={px} y={py + 13} textAnchor="middle" fill={fill > 0 ? c : T.dim}
              style={{ font: `10px ${mono}` }}>{Math.round(fill * 100)}%</text>
          </g>
        );
      })}

      <text x="240" y="548" textAnchor="middle" fill={T.dim}
        style={{ font: `9px ${mono}`, letterSpacing: 2 }}>TAP A PILLAR TO OPEN IT</text>
    </svg>
  );
}
