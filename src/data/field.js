// ── FIELD AWARENESS — FAA-legal is not the whole story ─────────────
// src: null = deliberate practice guidance, rendered with a badge.
import { S } from "./sources.js";

export const FIELD_BANNER =
  "FAA legal ≠ socially safe ≠ client-safe ≠ location-approved. The FAA owns the AIR — the ground under you belongs to somebody else.";

export const FIELD_CARDS = [
  { id: "fd-approval", cat: "OPS", q: "The FAA cleared me — can anyone still stop me?",
    a: "In the air, no — airspace is exclusively federal. But cities, counties, states, parks, and property owners CAN regulate where you take off, land, and stand. Most drone confrontations are about the ground, not the sky.",
    rule: "FAA: pilots are responsible for knowing where it is safe AND allowed to fly.",
    kw: "faa approval local police stop legal ground takeoff landing", src: S("WCIF") },
  { id: "fd-local", cat: "OPS", q: "Do local drone laws exist?",
    a: "Yes — takeoff/landing bans in city parks, noise and nuisance rules, state privacy and critical-infrastructure statutes. Search '[city] drone ordinance' before a paid job; screenshot what you find.",
    rule: "A local cop enforcing a park rule doesn't care that airspace is federal — and on the ground, they're right.",
    kw: "local ordinance city state law park rule takeoff", src: null },
  { id: "fd-nps", cat: "OPS", q: "National and state parks?",
    a: "National Park Service: launching, landing, or operating FROM park land is banned (36 CFR 1.5 closures) — flying over from outside is an FAA matter but rangers can cite the ground activity. State/county parks vary — many require permits.",
    rule: "The scenic shot is usually legal from OUTSIDE the boundary. Plan the launch point, not just the frame.",
    kw: "national park nps state park ban launch land permit", src: null },
  { id: "fd-property", cat: "OPS", q: "Private property under my flight path?",
    a: "Overflight is FAA turf, but standing on someone's land to fly is trespassing, and repeated low passes can be nuisance or harassment under state law. Get WRITTEN permission for the launch site — and tell neighbors when the camera will be up.",
    rule: "A permission text message has ended more disputes than any regulation quote.",
    kw: "private property trespass permission launch site neighbors", src: null },
  { id: "fd-privacy", cat: "OPS", q: "Camera etiquette that keeps you out of trouble?",
    a: "Don't hover at windows, don't track people who haven't consented, announce the flight when practical, and honor 'please don't film me.' Legal exposure aside — one viral 'creepy drone' clip costs more business than any shot earns.",
    rule: "Fly like everyone below assumes the camera is recording. It probably is.",
    kw: "privacy camera filming people etiquette consent window", src: null },
  { id: "fd-police", cat: "OPS", q: "Someone official (or angry) approaches mid-flight — the script?",
    a: "1) 'Give me 30 seconds to land safely' — then land. 2) Stay calm, don't argue airspace law. 3) Show your certificate, registration, and authorization. 4) If it's police and they insist: comply, document, contest LATER — never mid-flight.",
    rule: "The PIC's first job is the aircraft. A rolling argument with a live drone overhead is how accidents happen.",
    kw: "police law enforcement approached script land calm show", src: null },
  { id: "fd-show", cat: "REG", q: "What must I actually show, and to whom?",
    a: "Your remote pilot certificate and ID to the FAA, NTSB, TSA, or law enforcement ON REQUEST — that part is regulation. Registration must be available too. Airspace authorizations and waivers: keep them accessible (screenshot works).",
    rule: "107.7 — present certificate and registration upon request.",
    kw: "show certificate registration request law enforcement 107.7 documents", src: S("PART107", "§107.7") },
  { id: "fd-b4ufly", cat: "OPS", q: "Fastest way to check a spot before I commit?",
    a: "An FAA-approved B4UFLY app (Aloft, Airspace Link, AutoPylot, Avision, UASidekick) shows airspace, TFRs, and advisories in one screen. It's situational awareness — NOT an authorization.",
    rule: "Check the app, then get LAANC if the airspace needs it. Two different steps.",
    kw: "b4ufly app check spot aloft airspace link advisory", src: S("B4UFLY") },
];
