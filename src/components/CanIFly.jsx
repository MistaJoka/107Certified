import { useEffect, useState } from "react";
import { T, CAT, mono } from "../theme.js";
import { TREES } from "../data/trees.js";
import { Badge, Tag, Hi, useFocusFlash } from "./atoms.jsx";

function Walker({ tree }) {
  const [path, setPath] = useState([]);            // [{key, ans}]
  const key = path.length ? tree.nodes[path[path.length - 1].key][path[path.length - 1].ans] : tree.start;
  const node = tree.nodes[key];
  const c = CAT[tree.cat].c;
  useEffect(() => { setPath([]); }, [tree]);

  const answer = (ans) => setPath([...path, { key, ans }]);
  const isLeaf = !!node.verdict;

  return (
    <div style={{ background: T.panel2, borderRadius: "0 0 8px 8px", padding: "14px 14px 16px",
      borderTop: `1px solid ${T.line}` }}>
      {/* breadcrumb of answered steps */}
      {path.map(({ key: k, ans }) => (
        <div key={k} style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 7,
          fontSize: 12, color: T.dim, lineHeight: 1.4 }}>
          <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, flexShrink: 0,
            color: ans === "yes" ? T.green : T.red }}>{ans.toUpperCase()}</span>
          <span>{tree.nodes[k].q}</span>
        </div>
      ))}

      {isLeaf ? (
        <div>
          <Badge v={node.verdict} />
          <div style={{ fontSize: 14, lineHeight: 1.55, margin: "10px 0" }}>
            <Hi text={node.text} base={T.text} /></div>
          <div style={{ fontFamily: mono, fontSize: 11.5, lineHeight: 1.5, color: c,
            background: c + "12", borderLeft: `2px solid ${c}`, padding: "6px 9px",
            borderRadius: "0 4px 4px 0" }}><Hi text={node.rule} base={c} /></div>
          <button onClick={() => setPath([])} style={{ marginTop: 12, fontFamily: mono, fontSize: 11,
            letterSpacing: 1, color: T.dim, background: "none", border: `1px solid ${T.line}`,
            borderRadius: 6, padding: "7px 12px", cursor: "pointer" }}>↺ START OVER</button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45, marginBottom: 6 }}>{node.q}</div>
          {node.help && <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, marginBottom: 10 }}>{node.help}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {["yes", "no"].map((a) => (
              <button key={a} onClick={() => answer(a)} style={{ flex: 1, fontFamily: mono, fontSize: 13,
                fontWeight: 700, letterSpacing: 1, padding: "11px 0", borderRadius: 6, cursor: "pointer",
                border: `1px solid ${a === "yes" ? T.green : T.red}55`,
                background: (a === "yes" ? T.green : T.red) + "15",
                color: a === "yes" ? T.green : T.red }}>{a.toUpperCase()}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CanIFly({ focusId }) {
  const [openId, setOpenId] = useState(focusId || null);
  useFocusFlash(focusId);
  return (
    <>
      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, padding: "10px 2px 12px" }}>
        Answer yes/no. Every verdict cites the rule — this decides the flight, not the exam.</div>
      {TREES.map((t) => (
        <div key={t.id} id={t.id} style={{ marginBottom: 8, borderRadius: 8,
          border: `1px solid ${openId === t.id ? CAT[t.cat].c + "55" : T.line}` }}>
          <button onClick={() => setOpenId(openId === t.id ? null : t.id)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: 10, background: T.panel, border: "none", cursor: "pointer",
              padding: "13px 14px", borderRadius: openId === t.id ? "8px 8px 0 0" : 8 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: T.text, textAlign: "left" }}>{t.title}</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <Tag cat={t.cat} />
              <span style={{ fontFamily: mono, fontSize: 12, color: T.dim }}>{openId === t.id ? "▾" : "▸"}</span>
            </span>
          </button>
          {openId === t.id && <Walker tree={t} />}
        </div>
      ))}
    </>
  );
}
