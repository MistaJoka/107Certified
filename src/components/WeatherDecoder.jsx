import { T } from "../theme.js";
import { METAR_TOKENS, TAF_TOKENS, WX_CARDS } from "../data/weather.js";
import { CloudClearanceSVG } from "./diagrams.jsx";
import { SectionLabel, Reveal, Panel, TokenStrip, useFocusFlash } from "./atoms.jsx";

export default function WeatherDecoder({ focusId }) {
  useFocusFlash(focusId);
  return (
    <>
      <SectionLabel color={T.magenta}>METAR — WHAT'S HAPPENING NOW (HOURLY OBSERVATION)</SectionLabel>
      <TokenStrip tokens={METAR_TOKENS} prefix="metar" color={T.magenta} />

      <SectionLabel color={T.blue}>TAF — THE FORECAST (24–30 HR, AIRPORT ±5 SM)</SectionLabel>
      <TokenStrip tokens={TAF_TOKENS} prefix="taf" color={T.blue} />

      <SectionLabel>YOUR MINIMUMS — 107.51</SectionLabel>
      <Panel><CloudClearanceSVG /></Panel>

      <SectionLabel>QUICK ANSWERS</SectionLabel>
      {WX_CARDS.map((c) => (
        <Reveal key={c.id} {...c} open={focusId === c.id} />
      ))}
    </>
  );
}
