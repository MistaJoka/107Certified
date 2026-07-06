import { useState, useCallback } from "react";
import { PILLARS, conceptKey, criterionKey, pillarCounts } from "../data/pillars.js";

const KEY = "part107-pillars-v1";
const EMPTY = { concepts: {}, criteria: {} };

const load = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) }; }
  catch { return EMPTY; }
};

export function useMastery() {
  const [st, setSt] = useState(load);

  const toggle = useCallback((bucket, key) => setSt((p) => {
    const n = { ...p, [bucket]: { ...p[bucket], [key]: !p[bucket][key] } };
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch (e) { console.error(e); }
    return n;
  }), []);

  // fraction mastered per pillar (concepts + criteria combined)
  const pct = useCallback((pillar) => {
    const { total } = pillarCounts(pillar);
    let done = 0;
    pillar.subtopics.forEach((s, si) => s.concepts.forEach((_, ci) => {
      if (st.concepts[conceptKey(pillar.id, si, ci)]) done++;
    }));
    pillar.mastery.forEach((_, i) => { if (st.criteria[criterionKey(pillar.id, i)]) done++; });
    return total ? done / total : 0;
  }, [st]);

  const overall = useCallback(() => {
    const totals = PILLARS.reduce((a, p) => a + pillarCounts(p).total, 0);
    const done = PILLARS.reduce((a, p) => a + Math.round(pct(p) * pillarCounts(p).total), 0);
    return totals ? done / totals : 0;
  }, [pct]);

  return { st, toggle, pct, overall };
}
