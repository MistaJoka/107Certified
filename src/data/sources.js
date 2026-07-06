// ── FAA SOURCE REGISTRY — every citation in the app resolves here ──
// { title, url, group, use, lastChecked }
// The Library section renders straight from this object.

export const GROUPS = ["Rules", "Airspace tools", "Weather", "Charts & handbooks"];

export const SOURCES = {
  PART107: { title: "14 CFR Part 107 — Small UAS Rule", group: "Rules",
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107",
    use: "The regulation itself — every 107.x citation, current text.", lastChecked: "2026-07-06" },
  PART89:  { title: "14 CFR Part 89 — Remote Identification", group: "Rules",
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-89",
    use: "Remote ID: standard, broadcast module, FRIA rules.", lastChecked: "2026-07-06" },
  PART48:  { title: "14 CFR Part 48 — Drone Registration", group: "Rules",
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-48",
    use: "Registering the aircraft: who, when, marking requirements.", lastChecked: "2026-07-06" },
  AC107:   { title: "AC 107-2A — Small UAS Advisory Circular", group: "Rules",
    url: "https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_107-2A.pdf",
    use: "The FAA's own plain-English guidance on meeting Part 107.", lastChecked: "2026-07-06" },
  ACS:     { title: "UAS Airman Certification Standards (FAA-S-ACS-10)", group: "Rules",
    url: "https://www.faa.gov/training_testing/testing/acs",
    use: "Exactly what the knowledge test can ask.", lastChecked: "2026-07-06" },
  BDP:     { title: "FAA — Become a Part 107 Drone Pilot", group: "Rules",
    url: "https://www.faa.gov/uas/commercial_operators/become_a_drone_pilot",
    use: "The official certification steps: IACRA, FTN, PSI, 8710-13.", lastChecked: "2026-07-06" },
  UASFM:   { title: "FAA UAS Facility Maps", group: "Airspace tools",
    url: "https://www.faa.gov/uas/commercial_operators/uas_facility_maps",
    use: "Grid ceilings near airports — what LAANC can pre-approve.", lastChecked: "2026-07-06" },
  LAANC:   { title: "FAA — Part 107 Airspace Authorizations (LAANC)", group: "Airspace tools",
    url: "https://www.faa.gov/uas/commercial_operators/part_107_airspace_authorizations",
    use: "How to get into controlled airspace: LAANC vs DroneZone.", lastChecked: "2026-07-06" },
  TFR:     { title: "FAA Temporary Flight Restrictions", group: "Airspace tools",
    url: "https://tfr.faa.gov",
    use: "Active TFRs — check before every flight.", lastChecked: "2026-07-06" },
  B4UFLY:  { title: "FAA B4UFLY (approved apps)", group: "Airspace tools",
    url: "https://www.faa.gov/uas/getting_started/b4ufly",
    use: "Free situational-awareness apps the FAA endorses.", lastChecked: "2026-07-06" },
  WCIF:    { title: "FAA — Where Can I Fly?", group: "Airspace tools",
    url: "https://www.faa.gov/uas/getting_started/where_can_i_fly",
    use: "The FAA's own answer to the question, with all the caveats.", lastChecked: "2026-07-06" },
  AWC:     { title: "Aviation Weather Center", group: "Weather",
    url: "https://aviationweather.gov",
    use: "METARs, TAFs, AIRMETs/SIGMETs — the official weather source.", lastChecked: "2026-07-06" },
  CUG:     { title: "FAA Aeronautical Chart Users' Guide", group: "Charts & handbooks",
    url: "https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/aero_guide/",
    use: "What every sectional symbol, line, and number means.", lastChecked: "2026-07-06" },
  CS:      { title: "FAA Chart Supplement", group: "Charts & handbooks",
    url: "https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/dafd/",
    use: "Full airport detail the sectional can't fit — issued every 56 days.", lastChecked: "2026-07-06" },
  AIM:     { title: "Aeronautical Information Manual", group: "Charts & handbooks",
    url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/",
    use: "How the airspace system actually operates: patterns, radio, NOTAMs.", lastChecked: "2026-07-06" },
  PHAK:    { title: "Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25)", group: "Charts & handbooks",
    url: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak",
    use: "The theory: aerodynamics, weather, performance, ADM.", lastChecked: "2026-07-06" },
};

// Citation builder — loud failure on a typo'd doc key, at import time.
export const S = (doc, ref) => {
  if (!SOURCES[doc]) throw new Error(`Unknown source doc: ${doc}`);
  return ref ? { doc, ref } : { doc };
};
