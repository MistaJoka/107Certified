import { T, mono } from "../theme.js";
import { CARD_SECTIONS, OOP_MATRIX, OOP_CARDS, CERT_STEPS } from "../data/cards.js";
import { TwilightSVG, RunwayCompassSVG, PatternLegsSVG } from "./diagrams.jsx";
import { SectionLabel, Reveal, Panel, Hi, useFocusFlash, SourceDrawer } from "./atoms.jsx";

const cardList = (cards, focusId) =>
  cards.map((c) => <Reveal key={c.id} {...c} open={focusId === c.id} />);

// diagrams shown above specific sections' cards
const TOPS = {
  night: () => <Panel><TwilightSVG /></Panel>,
  airport: () => <><Panel><RunwayCompassSVG /></Panel><Panel><PatternLegsSVG /></Panel></>,
};

function OOPMatrix() {
  const colors = { 1: T.green, 2: T.blue, 3: T.amber, 4: T.purple };
  return OOP_MATRIX.map((m) => {
    const c = colors[m.cat];
    return (
      <div key={m.cat} id={`oop-cat${m.cat}`} style={{ display: "flex", gap: 12, background: T.panel,
        border: `1px solid ${c}33`, borderLeft: `3px solid ${c}`, borderRadius: 8,
        padding: "12px 13px", marginBottom: 8 }}>
        <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: c, lineHeight: 1 }}>{m.cat}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>
            <Hi text={m.req} base={T.text} /></div>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.5, marginBottom: 5,
            color: m.assembly === "NEVER" ? T.red : T.amber }}>
            OPEN-AIR ASSEMBLY: {m.assembly.toUpperCase()}</div>
          <div style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.45 }}>{m.note}</div>
          <SourceDrawer src={m.src} />
        </div>
      </div>
    );
  });
}

function CertPath() {
  return CERT_STEPS.map((s, i) => (
    <div key={s.id} id={s.id} style={{ display: "flex", gap: 12, marginBottom: 0 }}>
      {/* rail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 30, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${T.amber}`,
          color: T.amber, fontFamily: mono, fontSize: 13, fontWeight: 700, display: "flex",
          alignItems: "center", justifyContent: "center", background: T.panel, zIndex: 1 }}>{s.step}</div>
        {i < CERT_STEPS.length - 1 &&
          <div style={{ width: 2, flex: 1, background: T.line, margin: "2px 0" }} />}
      </div>
      <div style={{ paddingBottom: 16, flex: 1 }}>
        <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          color: T.text, margin: "4px 0 4px" }}>{s.title}</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}><Hi text={s.detail} base={T.dim} /></div>
        <SourceDrawer src={s.src} />
      </div>
    </div>
  ));
}

export default function CardSection({ sectionId, focusId }) {
  useFocusFlash(focusId);
  const Top = TOPS[sectionId];

  if (sectionId === "oop") return (
    <>
      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, padding: "10px 2px 4px" }}>
        No category, no exception → nobody under the aircraft. 107.39.</div>
      <SectionLabel>THE FOUR CATEGORIES</SectionLabel>
      <OOPMatrix />
      <SectionLabel>THE EXCEPTIONS & TRAPS</SectionLabel>
      {cardList(OOP_CARDS, focusId)}
    </>
  );

  if (sectionId === "cert") return (
    <>
      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, padding: "10px 2px 14px" }}>
        Zero to certificated remote pilot, in order.</div>
      <CertPath />
    </>
  );

  return (
    <div style={{ paddingTop: 10 }}>
      {Top && <Top />}
      {cardList(CARD_SECTIONS[sectionId] || [], focusId)}
    </div>
  );
}
