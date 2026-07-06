// ── AIRSPACE AUTHORIZATION — facility maps, LAANC, TFRs, NOTAMs ────
import { S } from "./sources.js";

// Illustrative UASFM grid (NOT a real airport — values are the lesson).
export const GRID_CELLS = [
  { v: 400 }, { v: 300 }, { v: 200 }, { v: 400 },
  { v: 300 }, { v: 100 }, { v: 0, airport: true }, { v: 200 },
  { v: 400 }, { v: 200 }, { v: 100 }, { v: 400 },
];

export const GRID_DETAILS = {
  0: { meaning: "The FAA will not pre-authorize ANY altitude in this square — it sits on final approach or over the field itself.",
    laanc: "No instant LAANC approval at any altitude.",
    coordination: "Not impossible: file a LAANC Further Coordination request or apply on FAADroneZone. Manual FAA review — apply up to 90 days ahead, never same-day.",
    client: "Tell a client: flying here needs FAA lead time measured in weeks, not hours. Quote accordingly.",
    src: S("UASFM") },
  100: { meaning: "Pre-approved ceiling is 100 ft AGL — close to the approach/departure paths.",
    laanc: "LAANC auto-approves at or below 100 ft, usually in seconds.",
    coordination: "Need higher? Further Coordination request — manual review, up to 90 days ahead.",
    client: "Most roof/real-estate work fits under 100 ft. Above it, plan lead time.",
    src: S("UASFM") },
  200: { meaning: "Pre-approved ceiling is 200 ft AGL.",
    laanc: "LAANC auto-approves at or below 200 ft.",
    coordination: "Above 200 ft: Further Coordination — not instant.",
    client: "Covers almost all commercial photography and inspection work.",
    src: S("UASFM") },
  300: { meaning: "Pre-approved ceiling is 300 ft AGL — farther from the runways.",
    laanc: "LAANC auto-approves at or below 300 ft.",
    coordination: "Above 300 ft: Further Coordination.",
    client: "Effectively unrestricted for typical sUAS missions.",
    src: S("UASFM") },
  400: { meaning: "Pre-approved up to the full Part 107 ceiling of 400 ft AGL.",
    laanc: "LAANC auto-approves to 400 ft — the grid is not the limit, 107.51 is.",
    coordination: "None needed below 400 ft. Above 400 ft you're into waiver territory regardless of the grid.",
    client: "Only the airspace class itself (and TFRs) stand between you and the job.",
    src: S("UASFM") },
};

export const GRID_CAVEAT =
  "Facility maps show where the FAA CAN pre-authorize — the map itself is not an authorization. You still need LAANC or DroneZone approval in controlled airspace. This grid is illustrative — check the live FAA UAS Facility Map for your actual location before planning or quoting a job.";

export const LAANC_SRC = S("LAANC");
export const LAANC_FLOW = [
  { cond: "At or below the grid ceiling", tone: "GO",
    action: "LAANC via an approved app (Aloft, Airspace Link, AutoPylot…) — near-real-time approval, often seconds." },
  { cond: "Above the grid ceiling, or a 0 grid", tone: "AUTH",
    action: "LAANC Further Coordination request — manual FAA review, submit up to 90 days ahead. No instant answer." },
  { cond: "Airport not LAANC-enabled", tone: "AUTH",
    action: "Apply on FAADroneZone instead. Same outcome, slower pipeline." },
];

export const TFR_CARDS = [
  { id: "tfr-what", cat: "CHART", q: "What is a TFR?",
    a: "A Temporary Flight Restriction — airspace closed for a limited time by NOTAM: disasters, wildfires, VIP movement, security events, space operations. It overrides every other permission you have.",
    rule: "Check tfr.faa.gov (or your LAANC app) before EVERY flight.",
    kw: "tfr temporary flight restriction notam check", src: S("TFR") },
  { id: "tfr-stadium", cat: "CHART", q: "The stadium TFR — the numbers?",
    a: "3 NM radius, up to 3,000 ft AGL, from 1 hour before to 1 hour after: MLB, NFL, NCAA Division I football, and major motor speedway events.",
    rule: "It's a STANDING TFR — it exists even if your app doesn't draw it.",
    kw: "stadium sporting event 3 nm 3000 mlb nfl nascar", src: S("TFR") },
  { id: "tfr-disaster", cat: "CHART", q: "Disaster and emergency TFRs?",
    a: "Wildfires, hurricanes, crash sites — flying a drone into one interferes with response aircraft and is the fastest way to a federal enforcement action.",
    rule: "'If you fly, we can't.' Emergency responders ground their aircraft when a drone appears.",
    kw: "disaster wildfire hurricane emergency response interference", src: S("TFR") },
  { id: "tfr-vip", cat: "CHART", q: "VIP / security TFRs?",
    a: "Presidential movement creates 10 NM / 30 NM rings on short notice. National-security TFRs (Washington DC FRZ/SFRA) are permanent in all but name.",
    rule: "VIP TFRs move with the VIP — yesterday's clear sky is today's violation.",
    kw: "vip presidential security dc frz sfra 30 nm", src: S("TFR") },
];

// Fake-but-realistic crane NOTAM, tap-apart style
export const NOTAM_SRC = S("AIM");
export const NOTAM_TOKENS = [
  { t: "!JAX", label: "Accountability", m: "The '!' starts a NOTAM; JAX = the FAA office accountable for it." },
  { t: "07/012", label: "NOTAM number", m: "12th NOTAM issued in July. Cited when you talk to FSS or ATC about it." },
  { t: "CRG", label: "Location", m: "The affected facility — Jacksonville Executive at Craig (CRG)." },
  { t: "OBST", label: "Keyword", m: "What kind of NOTAM: OBST obstacle · AIRSPACE · RWY runway · TWY taxiway · SVC services · ODP/SID procedures." },
  { t: "CRANE", label: "Subject", m: "The thing itself — here, a construction crane." },
  { t: "301213N0812319W", label: "Position", m: "30°12'13\"N 081°23'19\"W — degrees, minutes, seconds, mashed together." },
  { t: "(0.4NM SE APCH END RWY 32)", label: "Plain-ish English", m: "0.4 nautical miles southeast of the approach end of runway 32 — right where traffic descends." },
  { t: "145FT (120FT AGL)", label: "Height", m: "Top at 145 ft MSL, which is 120 ft above the ground. Compare AGL to YOUR altitude — you fly AGL." },
  { t: "FLAGGED AND LGTD", label: "Marking", m: "Flagged by day, lighted at night. 'UNLGTD' in a NOTAM is the scary one." },
  { t: "2607061200-2608062359", label: "When", m: "Effective from 2026-07-06 12:00 Z to 2026-08-06 23:59 Z. Format: YYMMDDHHMM, always UTC." },
];
