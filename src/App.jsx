import { useState } from "react";
import { T, mono } from "./theme.js";
import { PILLARS } from "./data/pillars.js";
import { useMastery } from "./hooks/useMastery.js";
import Header from "./components/Header.jsx";
import PillarCards from "./components/PillarCards.jsx";
import PillarMap from "./components/PillarMap.jsx";
import PillarDetail from "./components/PillarDetail.jsx";

export default function App() {
  const [pillarId, setPillarId] = useState(null);
  const [mode, setMode] = useState("CARDS");
  const { st, toggle, pct, overall } = useMastery();
  const pillar = PILLARS.find((p) => p.id === pillarId);

  return (
    <div style={{ background: T.ink, minHeight: "100vh", color: T.text,
      fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 560,
      margin: "0 auto", padding: "0 12px 80px" }}>
      {pillar ? (
        <PillarDetail pillar={pillar} st={st} toggle={toggle} pct={pct}
          onBack={() => setPillarId(null)} />
      ) : (
        <>
          <Header overall={overall()} />
          <nav style={{ display: "flex", gap: 6, padding: "12px 0", position: "sticky",
            top: 0, background: T.ink, zIndex: 5 }}>
            {["CARDS", "MAP"].map((t) => (
              <button key={t} onClick={() => setMode(t)} style={{ flex: 1, fontFamily: mono,
                fontSize: 12, letterSpacing: 1, padding: "10px 0", borderRadius: 6, cursor: "pointer",
                border: `1px solid ${mode === t ? T.blue : T.line}`,
                background: mode === t ? T.blue + "22" : T.panel,
                color: mode === t ? T.blue : T.dim }}>{t}</button>
            ))}
          </nav>
          {mode === "CARDS"
            ? <PillarCards pct={pct} onOpen={setPillarId} />
            : <PillarMap pct={pct} onOpen={setPillarId} />}
        </>
      )}
    </div>
  );
}
