// src/data/painterDatabase.js
/**
 * BG GROUP — SPRAY PAINTER / OPERATOR QUALIFICATION DATABASE & CALCULATION ENGINE
 * Industrial Standards: ASTM D 4228, SSPC PA-2, ASTM D 7091, ASTM D 3359, ASTM D 4541,
 * ASTM D 5162, ASTM D 4414, ISO 8501-1, ISO 19840, ISO 2808, NACE / AMPP.
 */

// 15 Spray Painter Industrial Training Topics
export const TRAINING_TOPICS = [
  "Coating System Basics — function of primer, intermediate & topcoat in a multi-coat system.",
  "Reading Paint Technical Data Sheet (TDS) — WFT, DFT, pot life, recoat / overcoating interval.",
  "Paint Storage & Handling — temperature, ventilation, shelf-life management, batch traceability.",
  "Paint Mixing Procedures — single-component vs. 2-component (Part A + Part B) mixing, induction time.",
  "Thinner Selection & Ratio Control — manufacturer-approved thinners, compatibility, viscosity impact.",
  "Spray Equipment Setup — airless pump ratio, tip size, fluid pressure, atomisation, fan width.",
  "Spray Technique — distance (200–300 mm), 50% overlap, perpendicular motion, stroke speed, ladder pattern.",
  "Stripe Coating for Edges & Welds — brush application before each spray coat for full edge coverage.",
  "Wet Film Thickness (WFT) Measurement — comb / notch gauge per ASTM D 4414 / ISO 2808.",
  "Dry Film Thickness (DFT) Measurement — magnetic / electronic gauge per ASTM D 7091 / SSPC PA-2 / ISO 19840.",
  "Coating Defect Identification — runs, sags, holidays, overspray, blistering, orange peel, pinholes.",
  "Holiday Testing — wet-sponge (low-voltage) or high-voltage DC test for coating continuity.",
  "Adhesion Testing — Cross-cut (ASTM D 3359) and Pull-off (ASTM D 4541) techniques.",
  "Qualification Plate Execution — applying the full paint system to ASTM D 4228 test plate.",
  "Inspection Documentation — recording WFT, DFT, pot life, defects, repairs & approvals."
];

// 13 Spray Painter Assessment Checklist Elements
export const CHECK_ELEMENTS = [
  "Presentable knowledge on painting equipment & supporting safety devices",
  "Effect of surface profile & cleanliness on subsequent coating performance",
  "Understand how wind, air & metal temperature, relative humidity, dew point & surface contaminants affect coating performance",
  "Knowledge of pot life of the coating system being used",
  "Setup, maintain & troubleshoot the coating application equipment, establishing correct nozzle pressure & correct spray patterns",
  "Safe handling of thinners & other chemicals (flammable, toxic, MSDS awareness)",
  "Proper use of materials & techniques for mixing 2-component (Part A + Part B) paints",
  "Proper hand-signaling techniques (painter ↔ pot tender communication)",
  "Use Wet Film Thickness (WFT) & Dry Film Thickness (DFT) gauges correctly",
  "Recognize & correct coating defects (runs, sags, holidays, overspray, orange peel, pinholes)",
  "Knowledge about DFT measurement standards — ASTM D 7091 / SSPC PA-2 / ISO 19840",
  "Knowledge of conducting Holiday Test (wet sponge / high-voltage DC)",
  "Aware of health & safety aspects of the application, hazards, risks, control measures & appropriate PPE"
];

// Coat Stages IDs & Names
export const COAT_SIDS = ['s1', 's2', 's3', 's4'];

export const COAT_STAGE_NAMES = {
  s1: 'Blasting + Primer',
  s2: '1st Intermediate / Finish',
  s3: '2nd Intermediate / Finish',
  s4: '3rd Intermediate / Finish'
};

export const PAINT_GENERIC_OPTIONS = [
  "Inorganic Zinc Silicate Primer",
  "Organic Zinc Rich Epoxy Primer",
  "Epoxy Zinc Phosphate Primer",
  "Red Oxide Primer",
  "Epoxy High Build",
  "Epoxy MIO (Micaceous Iron Oxide)",
  "Epoxy Glass Flake",
  "Epoxy Phenolic",
  "Polyurethane (Aliphatic PU)",
  "Acrylic Polyurethane",
  "Polysiloxane",
  "High Temperature Silicone Aluminum",
  "Acrylic Finish",
  "Fusion Bonded Epoxy (FBE)",
  "Coal Tar Epoxy",
  "Thermal Spray Aluminum (TSA)",
  "Intumescent Fireproof Coating"
];

export const PAINT_MFR_OPTIONS = [
  "AkzoNobel (International Paint)",
  "Jotun",
  "Hempel",
  "PPG Industries",
  "Sherwin-Williams",
  "Asian Paints",
  "Sigma Coatings",
  "Berger Paints",
  "Kansai Nerolac",
  "Carboline",
  "Tnemec",
  "OTHERS"
];

// Default 2-Coat Starter System
export const COATING_SYSTEM_DEFAULTS = [
  { act: "Primer Coat", generic: "Inorganic Zinc Silicate Primer", mfr: "Jotun", brand: "Resist 86", coats: "1", min: "65", max: "75", shade: "Manufacturer Standard" },
  { act: "Finish Coat", generic: "Polyurethane (Aliphatic PU)", mfr: "Jotun", brand: "Hardtop AX", coats: "1", min: "40", max: "50", shade: "RAL 9010 (Pure White)" }
];

// Extended 4-Coat System Preset
export const COATING_SYSTEM_FULL = [
  { act: "Primer Coat", generic: "Inorganic Zinc Silicate Primer", mfr: "Jotun", brand: "Resist 86", coats: "1", min: "65", max: "75", shade: "Manufacturer Standard" },
  { act: "1st Intermediate", generic: "Epoxy Zinc Phosphate Primer", mfr: "Jotun", brand: "Penguard Primer", coats: "1", min: "80", max: "100", shade: "Buff / Grey" },
  { act: "2nd Intermediate", generic: "Epoxy High Build", mfr: "Jotun", brand: "Jotamastic 90", coats: "1", min: "100", max: "150", shade: "Off-White" },
  { act: "3rd Finish Coat", generic: "Polyurethane (Aliphatic PU)", mfr: "Jotun", brand: "Hardtop AX", coats: "1", min: "40", max: "50", shade: "RAL 9010 (Pure White)" }
];

// Per-Coat Inspection Test Catalog (11 Tests)
export const COAT_TEST_CATALOG = [
  { ic: "🔍", t: "Blasting Surface Visual", std: "ISO 8501-1 · SSPC-VIS 1", req: "SA 2.5 — Near-White Metal Finish" },
  { ic: "💧", t: "Wet Film Thickness (WFT) Measurement", std: "ASTM D 4414 / ISO 2808", req: "Per coating system (WFT = DFT ÷ Volume Solids)" },
  { ic: "📐", t: "Dry Film Thickness (DFT) Measurement", std: "ASTM D 7091 / SSPC PA-2", req: "See specified DFT bounds · 80%-120% rule" },
  { ic: "🔪", t: "Coating Adhesion — Cross-Cut", std: "ASTM D 3359 (Cross-Cut)", req: "Rating 4A / 4B or better" },
  { ic: "⬇️", t: "Coating Adhesion — Pull-Off", std: "ASTM D 4541 (Pull-Off)", req: "≥ 5 MPa typical" },
  { ic: "⚡", t: "Holiday / Pinhole Test (Wet Sponge)", std: "ASTM D 5162 Method A", req: "Zero holidays · DFT < 500 µm" },
  { ic: "⚡", t: "Holiday / Pinhole Test (High Voltage)", std: "ASTM D 5162 Method B / NACE SP0188", req: "Zero holidays · DFT ≥ 500 µm" },
  { ic: "👁", t: "Visual Inspection (Defect-Free)", std: "ASTM D 3276", req: "Free of runs, sags, holidays, orange peel, pinholes" },
  { ic: "⏱", t: "Pot Life / Induction Time Check", std: "Paint TDS", req: "Within manufacturer's stated pot life" },
  { ic: "🪣", t: "Mixing Ratio Verification (Part A:B)", std: "Paint TDS", req: "As per TDS (e.g. 4 : 1 by volume)" },
  { ic: "🎨", t: "Surface Profile / Anchor Pattern", std: "ASTM D 4417 Method A / B / C", req: "40-75 µm (or as per spec)" }
];

export const COAT_DEFAULT_SETS = {
  s1: [0, 1, 2, 9, 8],  // Blasting Visual + WFT + DFT + Mixing Ratio + Pot Life
  s2: [1, 2, 9, 8],     // WFT + DFT + Mixing Ratio + Pot Life
  s3: [1, 2, 9, 8],     // WFT + DFT + Mixing Ratio + Pot Life
  s4: [1, 2, 7, 8]      // WFT + DFT + Visual + Pot Life
};

// 4-Mini-Table DFT Matrix Metadata
export const DFT_MINI_TYPES = ['plane', 'pipe', 'tbeam', 'flange'];

export const DFT_MINI_META = {
  plane: { num: '1', title: 'Plane Surface DFT in Microns', labels: ['Raw 1', 'Raw 2', 'Raw 3', 'Raw 4'] },
  pipe: { num: '4', title: '6" Diameter Pipe DFT in Microns', labels: ['Orientation 1', 'Orientation 2', 'Orientation 3', 'Orientation 4'] },
  tbeam: { num: '2', title: '6" Deep T-Beam DFT in Microns', labels: ['Side 1', 'Side 2', 'Side 3', 'Side 4', 'Side 5', 'Side 6', 'Side 7', 'Side 8'] },
  flange: { num: '3', title: '12" Wide Flange DFT in Microns', labels: ['Side 1', 'Side 2', 'Side 3', 'Side 4', 'Side 5', 'Side 6', 'Side 7', 'Side 8'] }
};

// 10 Photographic Presets
export const PHOTO_PRESETS = [
  { title: "Surface Condition (Pre-Coating)", loc: "Substrate · before application · Sa 2½" },
  { title: "Paint Mixing & Pot Life Check", loc: "2-component mixing · Part A + Part B" },
  { title: "Stripe Coating (Edges & Welds)", loc: "Brush application before spraying" },
  { title: "Primer Coat Application", loc: "1st coat — airless / air spray" },
  { title: "Wet Film Thickness (WFT) Measurement", loc: "WFT gauge reading during application" },
  { title: "Intermediate Coat Application", loc: "2nd coat — after recoat interval" },
  { title: "Topcoat Application", loc: "3rd coat — finish coat" },
  { title: "Dry Film Thickness (DFT) Measurement", loc: "DFT gauge per SSPC PA-2 · 80%-120%" },
  { title: "Cross-Cut Adhesion Test", loc: "ASTM D 3359 · post-cure check" },
  { title: "Holiday Test (Wet Sponge / HV)", loc: "Coating continuity verification" }
];

// Workflow definitions
export const WORKFLOW = ["info", "train", "checklist", "s1", "s2", "s3", "s4", "photo", "verdict"];
export const WF_LABELS = ["01. Project & Painter", "02. Training & Test", "03. Assessment Checklist", "04. Blasting & Primer", "05. 1st Coat", "06. 2nd Coat", "07. 3rd Coat", "08. Photo Report", "09. Verdict & Sign"];

// Industry Standard Presets for Hub
export const PAINTER_PRESETS = [
  {
    id: 'offshore',
    title: 'Offshore Splash Zone & Topsides Coating',
    category: 'Offshore & Marine',
    substrate: 'Structural Carbon Steel — Sa 2.5',
    standards: 'ISO 12944-C5M / NORSOK M-501 Sys 1',
    description: 'Heavy duty 3-coat marine system: Zinc Silicate primer (75µm) + High Build Epoxy MIO (150µm) + Polyurethane finish (50µm).',
    coatingSystem: [
      { act: "Primer Coat", generic: "Inorganic Zinc Silicate Primer", mfr: "Jotun", brand: "Resist 86", coats: "1", min: "65", max: "75", shade: "Standard Grey" },
      { act: "1st Intermediate", generic: "Epoxy MIO (Micaceous Iron Oxide)", mfr: "Jotun", brand: "Penguard MIO", coats: "1", min: "125", max: "150", shade: "Grey MIO" },
      { act: "2nd Finish Coat", generic: "Polyurethane (Aliphatic PU)", mfr: "Jotun", brand: "Hardtop AX", coats: "1", min: "40", max: "50", shade: "RAL 9010 (White)" }
    ]
  },
  {
    id: 'storage_tank',
    title: 'Storage Tank External & Piping Coating',
    category: 'Oil & Gas Onshore',
    substrate: 'Carbon Steel Plate & Pipework — Sa 2.5',
    standards: 'SSPC PA-2 / ASTM D 4228 / ISO 12944-C4',
    description: 'Standard 2-coat industrial specification: Epoxy Zinc Phosphate Primer (80µm) + Aliphatic Polyurethane Topcoat (50µm).',
    coatingSystem: [
      { act: "Primer Coat", generic: "Epoxy Zinc Phosphate Primer", mfr: "Hempel", brand: "Hempadur 17360", coats: "1", min: "80", max: "100", shade: "Buff" },
      { act: "Finish Coat", generic: "Polyurethane (Aliphatic PU)", mfr: "Hempel", brand: "Hempathane Topcoat 55210", coats: "1", min: "40", max: "50", shade: "RAL 7035 (Light Grey)" }
    ]
  },
  {
    id: 'structural_steel',
    title: 'Infrastructure Structural Steel & Bridges',
    category: 'Infrastructure & Bridges',
    substrate: 'Beams, Girders & Flanges — Sa 2.5',
    standards: 'ASTM D 4228 / SSPC Paint 20 / ISO 12944-C3',
    description: 'Fast-cure structural system: Zinc Rich Epoxy Primer (70µm) + Epoxy Intermediate (100µm) + Acrylic Polyurethane (40µm).',
    coatingSystem: [
      { act: "Primer Coat", generic: "Organic Zinc Rich Epoxy Primer", mfr: "AkzoNobel", brand: "Interzinc 52", coats: "1", min: "60", max: "75", shade: "Grey" },
      { act: "Intermediate Coat", generic: "Epoxy High Build", mfr: "AkzoNobel", brand: "Intergard 475HS", coats: "1", min: "100", max: "125", shade: "Off-White" },
      { act: "Finish Coat", generic: "Acrylic Polyurethane", mfr: "AkzoNobel", brand: "Interthane 990", coats: "1", min: "40", max: "50", shade: "RAL 5015 (Blue)" }
    ]
  }
];

// Psychrometric Calculations (Magnus formula)
export function calcRH(tdb, twb) {
  if (isNaN(tdb) || isNaN(twb) || tdb === null || twb === null) return NaN;
  const es = (T) => 6.112 * Math.exp((17.67 * T) / (T + 243.5));
  const e_wb = es(twb) - 0.000662 * 1013.25 * (tdb - twb);
  let rh = (100 * e_wb) / es(tdb);
  if (rh < 0) rh = 0;
  if (rh > 100) rh = 100;
  return rh;
}

export function calcDP(tdb, rh) {
  if (isNaN(tdb) || isNaN(rh) || rh <= 0 || rh === null) return NaN;
  const a = 17.67, b = 243.5;
  const alpha = Math.log(rh / 100) + (a * tdb) / (b + tdb);
  return (b * alpha) / (a - alpha);
}

// Compute Overcoating Interval in hours and minutes
export function computeOvercoatInterval(prevDate, prevEnd, curDate, curStart) {
  if (!prevDate || !prevEnd || !curDate || !curStart) return '';
  const prevDT = new Date(`${prevDate}T${prevEnd}:00`);
  const curDT = new Date(`${curDate}T${curStart}:00`);
  if (isNaN(prevDT.getTime()) || isNaN(curDT.getTime())) return '';
  const diffMs = curDT.getTime() - prevDT.getTime();
  if (diffMs < 0) return '⚠ Start is before previous coat completion';
  const totalMin = Math.round(diffMs / 60000);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return mins === 0 ? `${hrs} hrs` : `${hrs} hrs ${mins} min`;
}

// Single Coat DFT Matrix Calculator (4-Mini-Tables)
export function calcCoatDFT(minV, maxV, byType, userVerdict = '') {
  const min = parseFloat(minV);
  const max = parseFloat(maxV);
  const low80 = !isNaN(min) ? min * 0.8 : NaN;
  const high120 = !isNaN(max) ? max * 1.2 : NaN;

  let grandSpots = [];
  let grandTotal = 0;
  let grandOut = 0;
  let spotsValid = 0;
  let spotsOK = 0;
  const typeResults = {};

  DFT_MINI_TYPES.forEach(type => {
    const rows = (byType && byType[type]) || [];
    const typeSpots = [];
    rows.forEach(r => {
      (r.spots || []).forEach(val => {
        const v = parseFloat(val);
        if (!isNaN(v)) {
          typeSpots.push(v);
          grandTotal++;
          if (!isNaN(low80) && !isNaN(high120)) {
            spotsValid++;
            if (v >= low80 && v <= high120) {
              spotsOK++;
            } else {
              grandOut++;
            }
          }
        }
      });
    });
    const avg = typeSpots.length ? typeSpots.reduce((a, b) => a + b, 0) / typeSpots.length : NaN;
    typeResults[type] = {
      avg: isNaN(avg) ? '—' : avg.toFixed(1),
      count: typeSpots.length
    };
    grandSpots = grandSpots.concat(typeSpots);
  });

  const grandAvg = grandSpots.length ? grandSpots.reduce((a, b) => a + b, 0) / grandSpots.length : NaN;

  let autoVerdict = '—';
  let overallInRange = false;
  if (!isNaN(grandAvg) && !isNaN(min) && !isNaN(max)) {
    if (grandAvg >= min && grandAvg <= max && grandOut === 0) {
      autoVerdict = 'PASS';
      overallInRange = true;
    } else if (grandAvg >= low80 && grandAvg <= high120) {
      autoVerdict = 'REWORK';
    } else {
      autoVerdict = 'FAIL';
    }
  }

  const finalVerdict = userVerdict || autoVerdict;

  return {
    grandAvg: isNaN(grandAvg) ? NaN : grandAvg,
    grandAvgStr: isNaN(grandAvg) ? '—' : `${grandAvg.toFixed(1)} µm`,
    totalReadings: grandTotal,
    outOfRange: grandOut,
    spotsValid,
    spotsOK,
    low80: isNaN(low80) ? '' : low80.toFixed(1),
    high120: isNaN(high120) ? '' : high120.toFixed(1),
    typeResults,
    autoVerdict,
    finalVerdict,
    overallInRange: userVerdict === 'Pass' ? true : overallInRange
  };
}

// Master Qualification Evaluator
export function calculatePainterQualification(formData) {
  const data = formData || {};

  // 1. Knowledge Tests (45 questions)
  const pre = parseInt(data['f-pre-correct']) || 0;
  const post = parseInt(data['f-post-correct']) || 0;
  const prePct = Math.min(Math.max((pre / 45) * 100, 0), 100);
  const postPct = Math.min(Math.max((post / 45) * 100, 0), 100);
  const imp = postPct - prePct;

  // 2. Assessment Checklist (13 elements)
  const checkResults = data._check || [];
  let chkPass = 0, chkFail = 0, chkNa = 0, chkPend = 0;
  CHECK_ELEMENTS.forEach((_, idx) => {
    const item = checkResults[idx] || {};
    if (item.r === 'Pass') chkPass++;
    else if (item.r === 'Fail') chkFail++;
    else if (item.r === 'NA') chkNa++;
    else chkPend++;
  });
  const chkEvaluated = chkPass + chkFail;
  const chkPct = chkEvaluated > 0 ? (chkPass / chkEvaluated) * 100 : (chkPass > 0 ? 100 : 0);

  // 3. Environmental & Multi-Coat Aggregations
  let totalEnvValid = 0;
  let okEnvCount = 0;
  let totalInspPass = 0;
  let totalInspFail = 0;
  let totalInspNa = 0;
  let totalInspPend = 0;

  // DFT across all 4 coats
  let dftTotalReadings = 0;
  let dftOutOfRange = 0;
  let dftSpotsValid = 0;
  let dftSpotsOK = 0;
  let dftWeightedAvgNumer = 0;
  let dftWeightedAvgDenom = 0;
  let allDftInRange = true;
  let anyCoatHasDFT = false;

  const coatSheets = data._coatSheets || {};
  const coatDFT = data._coatDFT || {};

  COAT_SIDS.forEach(sid => {
    const cs = coatSheets[sid] || {};
    const tdb = parseFloat(cs.db);
    const twb = parseFloat(cs.wb);
    const tmt = parseFloat(cs.mt);
    const rh = calcRH(tdb, twb);
    const dp = calcDP(tdb, rh);
    const diff = (!isNaN(tmt) && !isNaN(dp)) ? (tmt - dp) : NaN;

    if (!isNaN(rh) && !isNaN(diff)) {
      totalEnvValid++;
      if (rh <= 85 && diff >= 3.0) {
        okEnvCount++;
      }
    }

    // Per-coat tests
    const tests = cs.tests || [];
    tests.forEach(t => {
      if (t.res === 'Pass') totalInspPass++;
      else if (t.res === 'Fail') totalInspFail++;
      else if (t.res === 'NA') totalInspNa++;
      else totalInspPend++;
    });

    // Per-coat DFT
    const cd = coatDFT[sid] || {};
    const r = calcCoatDFT(cd.min, cd.max, cd.byType, cd.verdict);
    if (r.totalReadings > 0) {
      anyCoatHasDFT = true;
      dftTotalReadings += r.totalReadings;
      dftOutOfRange += r.outOfRange;
      dftSpotsValid += r.spotsValid;
      dftSpotsOK += r.spotsOK;
      if (!isNaN(r.grandAvg)) {
        dftWeightedAvgNumer += r.grandAvg * r.totalReadings;
        dftWeightedAvgDenom += r.totalReadings;
      }
      if (!r.overallInRange) allDftInRange = false;
    }
  });

  const inspEvaluated = totalInspPass + totalInspFail;
  const inspPct = inspEvaluated > 0 ? (totalInspPass / inspEvaluated) * 100 : (totalInspPass > 0 ? 100 : 0);
  const overallDFTAvg = dftWeightedAvgDenom > 0 ? (dftWeightedAvgNumer / dftWeightedAvgDenom) : NaN;
  const dftScore = dftSpotsValid > 0 ? (dftSpotsOK / dftSpotsValid) * 100 : 0;
  const envScore = totalEnvValid > 0 ? (okEnvCount / totalEnvValid) * 100 : 0;

  // 4. Overall Weighted Score Formula
  // Post-Test 25%, Improvement 10%, Checklist 20%, DFT Compliance 20%, Inspection 15%, Environmental 10%
  const overall = (
    0.25 * postPct +
    0.10 * Math.min(Math.max(imp, 0), 100) +
    0.20 * chkPct +
    0.20 * dftScore +
    0.15 * inspPct +
    0.10 * envScore
  );

  // 5. Verdict Decision Logic
  const meetsPost = postPct >= 80;
  const meetsImp = imp >= 15;
  const meetsChk = chkPct >= 80 && chkFail === 0;
  const meetsInsp = inspPct >= 80 && totalInspFail === 0;
  const meetsEnv = totalEnvValid === 0 || (okEnvCount === totalEnvValid && totalEnvValid > 0);
  const meetsDFT = dftSpotsValid === 0 || (dftSpotsOK === dftSpotsValid && allDftInRange && anyCoatHasDFT);

  const hasPending = chkPend > 0 || (checkResults.length < 13);
  let verdict = 'PENDING';
  if (hasPending) {
    verdict = 'PENDING';
  } else if (meetsPost && meetsChk && meetsInsp && meetsEnv && meetsDFT && overall >= 80) {
    verdict = 'PASS';
  } else {
    verdict = 'FAIL';
  }

  // 6. Section Progresses
  const nameFilled = !!(data['f-name'] && data['f-civil'] && data['f-proj']);
  const photoCount = (data._photos || []).filter(p => !!p.b64).length;

  function coatProgress(sid) {
    const cs = coatSheets[sid] || {};
    const mfr = (cs.mfr || '').trim();
    const prod = (cs.product || '').trim();
    const testsCount = (cs.tests || []).length;
    const cd = coatDFT[sid] || {};
    let dftHasData = false;
    DFT_MINI_TYPES.forEach(type => {
      const rows = (cd.byType && cd.byType[type]) || [];
      rows.forEach(r => {
        if ((r.spots || []).some(v => (v || '').toString().trim() !== '')) {
          dftHasData = true;
        }
      });
    });
    const score = (mfr ? 1 : 0) + (prod ? 1 : 0) + (testsCount > 0 ? 1 : 0) + (dftHasData ? 1 : 0);
    if (score === 4) return 100;
    if (score >= 2) return 75;
    if (score >= 1) return 50;
    return 0;
  }

  const stageProgress = {
    info: nameFilled ? 100 : 50,
    train: postPct > 0 ? 100 : (prePct > 0 ? 50 : 0),
    checklist: Math.round(chkPct),
    s1: coatProgress('s1'),
    s2: coatProgress('s2'),
    s3: coatProgress('s3'),
    s4: coatProgress('s4'),
    photo: photoCount >= 3 ? 100 : (photoCount > 0 ? 50 : 0),
    verdict: verdict !== 'PENDING' ? 100 : 50
  };

  const stageValues = Object.values(stageProgress);
  const overallProgress = Math.round(stageValues.reduce((a, b) => a + b, 0) / stageValues.length);

  return {
    pre,
    post,
    prePct,
    postPct,
    imp,
    meetsPost,
    meetsImp,
    chkPass,
    chkFail,
    chkNa,
    chkPend,
    chkPct,
    meetsChk,
    totalInspPass,
    totalInspFail,
    totalInspNa,
    totalInspPend,
    inspPct,
    meetsInsp,
    totalEnvValid,
    okEnvCount,
    meetsEnv,
    dftTotalReadings,
    dftOutOfRange,
    dftSpotsValid,
    dftSpotsOK,
    overallDFTAvg,
    meetsDFT,
    overall,
    verdict,
    stageProgress,
    overallProgress
  };
}

// Stage Sequence Validator across reports for a project
export function validateStageSequence(projNo, reports) {
  const projReports = (reports || []).filter(r => (r.projNo || '') === (projNo || '') && r.status === 'Approved');
  let hasS1 = false, hasS2 = false, hasS3 = false, hasS4 = false;
  projReports.forEach(r => {
    if (r.stagesFilled) {
      if (r.stagesFilled.s1) hasS1 = true;
      if (r.stagesFilled.s2) hasS2 = true;
      if (r.stagesFilled.s3) hasS3 = true;
      if (r.stagesFilled.s4) hasS4 = true;
    }
  });
  const parts = [];
  let ok = true;
  if (hasS1) parts.push('B&P');
  if (hasS2) { parts.push('1st'); if (!hasS1) ok = false; }
  if (hasS3) { parts.push('2nd'); if (!hasS1 || !hasS2) ok = false; }
  if (hasS4) { parts.push('3rd'); if (!hasS1 || !hasS2 || !hasS3) ok = false; }
  if (parts.length === 0) return { text: '—', ok: true, empty: true };
  return { text: parts.join(' + '), ok, empty: false };
}

// Initial Empty Working Draft State
export function getInitialPainterState() {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Initialize Coat Sheets
  const initialCoatSheets = {};
  COAT_SIDS.forEach(sid => {
    initialCoatSheets[sid] = {
      method: 'Airless Spray',
      stripe: 'Yes · Brush applied on welds & edges',
      rust: 'No (Sa 2.5 substrate)',
      start: '09:00',
      end: '11:30',
      date: today,
      recoat: sid === 's1' ? '—' : '16 hrs (Min recoat met)',
      mfr: 'Jotun',
      product: sid === 's1' ? 'Resist 86' : 'Hardtop AX',
      shade: sid === 's1' ? 'Standard Grey' : 'RAL 9010',
      generic: sid === 's1' ? 'Inorganic Zinc Silicate Primer' : 'Polyurethane (Aliphatic PU)',
      batchA: 'A-9921',
      expA: nextYear,
      batchB: 'B-8832',
      expB: nextYear,
      batchC: 'N/A',
      expC: '',
      ratio: '4 : 1 by volume',
      dftspec: sid === 's1' ? '65 – 75 µm' : '105 – 125 µm',
      db: '28.5',
      wb: '22.0',
      mt: '32.0',
      envtime: '09:15',
      tests: (COAT_DEFAULT_SETS[sid] || []).map(idx => {
        const item = COAT_TEST_CATALOG[idx];
        return {
          t: item.t,
          std: item.std,
          req: item.req,
          act: idx === 0 ? 'Sa 2.5 Cleanliness Confirmed' : idx === 1 ? '110 µm WFT uniform' : idx === 2 ? 'Within specified tolerance' : 'Compliant',
          res: 'Pass'
        };
      })
    };
  });

  // Initialize Coat DFT mini matrices
  const initialCoatDFT = {};
  COAT_SIDS.forEach(sid => {
    const byType = {};
    DFT_MINI_TYPES.forEach(type => {
      byType[type] = DFT_MINI_META[type].labels.map(lbl => ({
        label: lbl,
        spots: sid === 's1' ? ['70', '72', '68', '74'] : ['115', '118', '112', '120']
      }));
    });
    initialCoatDFT[sid] = {
      min: sid === 's1' ? '65' : '105',
      max: sid === 's1' ? '75' : '125',
      byType,
      verdict: 'Pass'
    };
  });

  return {
    'f-rep-no': `SP-QR-${today.replace(/-/g, '')}-OP-001`,
    'f-rep-date': today,
    'f-name': 'Mohammad Tariq',
    'f-category': 'Airless Spray Painter',
    'f-civil': 'CID-8829471',
    'f-nationality': 'Indian',
    'f-dob': '1992-05-14',
    'f-exp': '6',
    'f-qual-date': today,
    'f-next-date': nextYear,
    'f-proj': 'Offshore Topsides Gas Flare Platform',
    'f-proj-no': 'PRJ-2026-FLARE-09',
    'f-client': 'Aramco / Offshore Energy Corp',
    'f-contractor': 'BG Engineering & Contracting Ltd',
    'f-employer': 'Industrial Coatings Marine Div',
    'f-location': 'Fabrication Yard 4 · Blast & Paint Bay',
    'f-ref': 'ASTM D 4228, SSPC PA-2, ASTM D 7091, ASTM D 3359, ASTM D 4541, NACE / AMPP',
    'f-remarks-proj': 'Trial execution conducted on standard ASTM D 4228 mock-up test plate with beams, pipes and flanges.',
    'cs-surf-prep': 'Abrasive Blast Cleaning Sa 2.5 (Near White Metal) · Surface Profile 50–75 µm',
    'f-pre-date': today,
    'f-pre-correct': '38',
    'f-post-date': today,
    'f-post-correct': '43',
    'f-remark-train': 'Operator demonstrated strong knowledge of airless spray equipment, atomisation pressure, pot life and multi-substrate SSPC PA-2 DFT measuring procedures.',
    'f-remark-check': 'All 13 practical checklist elements verified satisfactory with excellent spray gun technique and stripe coating diligence.',
    'f-remark-final': 'Operator has successfully passed all theoretical, practical, environmental, multi-stage application, and adhesion assessment criteria. Highly recommended for offshore application certification.',
    'sig1-name': 'Mohammad Tariq / Spray Painter',
    'sig1-date': today,
    'sig2-name': 'Rajesh Patel / QA/QC Coating Inspector (NACE Level 3 #48291)',
    'sig2-date': today,
    'sig3-name': 'David Miller / Client Representative (Lead Marine Engineer)',
    'sig3-date': today,
    _check: CHECK_ELEMENTS.map(() => ({ r: 'Pass', c: 'Satisfactory' })),
    _coatingSystem: COATING_SYSTEM_DEFAULTS,
    _coatSheets: initialCoatSheets,
    _coatDFT: initialCoatDFT,
    _photos: PHOTO_PRESETS.slice(0, 6).map((preset, idx) => ({
      id: idx + 1,
      b64: '',
      title: preset.title,
      loc: preset.loc,
      date: today,
      init: 'RP',
      cap: `Photographic evidence of ${preset.title.toLowerCase()} captured during qualification trial.`
    })),
    _opPhoto: null,
    _sigStamps: { 1: null, 2: null, 3: null },
    _coLogo: null
  };
}

export const INITIAL_PAINTER_STATE = getInitialPainterState();

