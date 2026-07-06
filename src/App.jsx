import { useEffect, useState } from "react";
import { T, SECTIONS } from "./theme.js";
import Home from "./components/Home.jsx";
import HardNumbers from "./components/HardNumbers.jsx";
import CanIFly from "./components/CanIFly.jsx";
import AirspaceDecoder from "./components/AirspaceDecoder.jsx";
import WeatherDecoder from "./components/WeatherDecoder.jsx";
import Authorization from "./components/Authorization.jsx";
import CardSection from "./components/CardSection.jsx";
import { BackBar } from "./components/atoms.jsx";

const VIEWS = { numbers: HardNumbers, canifly: CanIFly, airspace: AirspaceDecoder,
  weather: WeatherDecoder, authorization: Authorization };

// "#/section/entryId" → { sectionId, focusId }
function parseHash() {
  const [sectionId, focusId] = window.location.hash.replace(/^#\/?/, "").split("/");
  return { sectionId: sectionId || null, focusId: focusId || null };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const section = SECTIONS.find((s) => s.id === route.sectionId);
  const View = section ? (VIEWS[section.id] || CardSection) : null;

  return (
    <div style={{ background: T.ink, minHeight: "100vh", color: T.text,
      fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 560,
      margin: "0 auto", padding: "0 12px 80px" }}>
      {section ? (
        <>
          <BackBar title={section.title.toUpperCase()} cat={section.cat} glyph={section.glyph} />
          <View sectionId={section.id} focusId={route.focusId} />
        </>
      ) : (
        <Home />
      )}
    </div>
  );
}
