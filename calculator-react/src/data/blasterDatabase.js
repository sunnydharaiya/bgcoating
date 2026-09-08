/**
 * Blaster / Operator Qualification Report — Core Database & Calculation Engine
 * Reference: 06. BG Group _ Blaster_Operator Qualification Report — Digital Management System.html
 * Standards: ISO 8501-1, ISO 8502-3, SSPC-AB 1/3, SSPC VIS 1, ASTM D4285, ASTM D4417, ASTM D4228, NACE / AMPP
 */

export const TRAINING_TOPICS = [
  "Introduction to Surface Preparation Standards — SSPC, NACE, ISO requirements.",
  "Understanding Blast Profiles — Anchor pattern, surface roughness, and importance.",
  "Abrasive Selection — Type, size, cleanliness, and hardness based on coating system.",
  "Blast Equipment Setup — Air compressor, hoses, moisture traps, and safety valves.",
  "Air Quality Checks — Moisture content, oil content, and air pressure control.",
  "Nozzle Selection & Inspection — Bore size, wear checks, and fitment.",
  "Blasting Angles & Technique — Distance, overlap, sweep speed, and coverage.",
  "Safety in Blasting Operations — PPE, safe distances, confined space entry.",
  "Dust Control Methods — Ventilation, vacuum recovery, and wet blasting.",
  "Surface Cleanliness Inspection — Visual (ISO 8501), dust tape test (ISO 8502-3).",
  "Environmental Conditions — Dew point, humidity, steel temperature checks.",
  "Profile Measurement — Replica tape (Testex), stylus gauge techniques.",
  "Qualification Plate Execution — Blasting & preparing sample plate to standard.",
  "Post-Blast Cleaning — Compressed air, vacuum, brushing for dust removal.",
  "Documentation & Reporting — Recording blast parameters, environmental readings."
];

export const CHECK_ELEMENTS = [
  "Presentable knowledge on blasting equipment & supporting safety devices",
  "Effect of surface profile & cleanliness on subsequent coating performance",
  "Knowledge of different types of abrasives (mineral, slag, metallic)",
  "Setup abrasive blasting equipment including grounding, nozzle size & hose assembly",
  "Hand signaling techniques (blaster ↔ pot tender communication)",
  "Capable to carry out the Blotter test (compressed air contamination) and acceptance criteria",
  "Capable to understand and measure blasting hose pressure",
  "Capable to verify surface cleanliness as per pictorial standard ISO 8501-1",
  "Basic understanding & capable to measure the surface profile",
  "Basic understanding & capable to measure the dust level (ISO 8502-3)",
  "Capable to carry out abrasive blast cleaning on the given plate",
  "Aware of health & safety aspects, hazards, risks, control measures & appropriate PPE"
];

export const ABRASIVE_MAP = {
  "Copper Slag": { cls: "Mineral / Slag", sspc: "SSPC-AB 1", iso: "ISO 11126-3" },
  "Steel Grit / Shot": { cls: "Metallic Abrasive", sspc: "SSPC-AB 3", iso: "ISO 11124-1 to 11124-4" },
  "Garnet": { cls: "Mineral Abrasive", sspc: "SSPC-AB 1", iso: "ISO 11126-10" },
  "Aluminum Oxide": { cls: "Synthetic Abrasive", sspc: "SSPC-AB 1", iso: "ISO 11126-7" },
  "Silica Sand": { cls: "Mineral (Restricted)", sspc: "Not Permitted (OSHA)", iso: "ISO 11126-4" },
  "Others": { cls: "Other", sspc: "As Applicable", iso: "As Applicable" }
};

export const INSP_CATALOG = [
  { ic: "👁", t: "Visual Surface Cleanliness Inspection", std: "ISO 8501-1 (Sa 2½)", req: "Near-White Blast Cleaning" },
  { ic: "📏", t: "Surface Profile (Anchor Pattern) Measurement", std: "ASTM D4417 Method A/C", req: "40–75 µm (typical)" },
  { ic: "🌫", t: "Dust Contamination Test (Tape Test)", std: "ISO 8502-3", req: "Rating 2 max · Class 1 or better" },
  { ic: "💧", t: "Soluble Salt Contamination / Surface Conductivity", std: "ISO 8502-6 (Bresle) · ISO 8502-9", req: "≤ 20 mg/m² (typical)" },
  { ic: "🛢", t: "Surface Oil & Grease Contamination Test", std: "SSPC-SP 1", req: "Free from oil / grease" },
  { ic: "⚗", t: "Surface pH Test", std: "ASTM D4262", req: "pH 5–9" },
  { ic: "🔬", t: "Surface Roughness Comparator Check", std: "ASTM D4417 Method B (Medium G)", req: "As per coating system spec" },
  { ic: "⚡", t: "Abrasive Cleanliness / Conductivity Test", std: "ASTM D4940", req: "≤ 1000 µS/cm" },
  { ic: "💨", t: "Compressed Air Cleanliness (Blotter Test)", std: "ASTM D4285", req: "No visible oil / moisture / water" },
  { ic: "💧", t: "Water Quality Test (Wet Blasting / Hydrotest)", std: "ASTM D1293", req: "Potable / Free of contaminants" },
  { ic: "🎨", t: "Blasting Visual Inspection", std: "SSPC VIS 1", req: "Sa 2½ — Near White Metal Finish" }
];

export const INSP_STANDARD_SET = [0, 1, 2, 10, 8];

export const INITIAL_BLASTER_STATE = {
  id: '',
  repNo: '',
  repDate: new Date().toISOString().split('T')[0],
  repRev: 'R0',
  projectName: 'NFS Qatar Gas Complex Expansion',
  projectNo: 'NFS-Q-2026',
  client: 'QatarEnergy LNG',
  epcContractor: 'Chiyoda Technip Joint Venture (CTJV)',
  contractor: 'BG Industrial Coatings & Corrosion Protection W.L.L.',
  location: 'Ras Laffan Industrial City, Fabrication Yard Bay 4',
  referenceStandard: 'ASTM D 4228, SSPC, NACE, ISO 8501',
  coatingSystem: 'Zinc Ethyl Silicate Primer + High Build Epoxy + Aliphatic Polyurethane Topcoat',

  // Operator Particulars
  operatorName: 'Rajesh M. Patel',
  category: 'Blaster',
  civilId: '284051209341',
  nationality: 'INDIAN',
  dob: '1988-05-14',
  experienceYears: 6.5,
  employer: 'BG Industrial Coatings W.L.L.',
  qualificationCardNo: 'BG-QC-BL-2026-084',
  qualificationDate: new Date().toISOString().split('T')[0],
  nextAssessmentDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  operatorPhoto: '',

  // Training & Assessment Test
  preTestDate: new Date().toISOString().split('T')[0],
  preCorrect: 16,
  postTestDate: new Date().toISOString().split('T')[0],
  postCorrect: 23,
  remarkTrain: 'Operator showed rapid learning progression with thorough grasp of blast safety and nozzle control.',

  // 12 Checklist Elements
  checklist: [
    { result: 'Pass', comment: 'Demonstrated complete pre-start safety checklist and pressure relief valve check.' },
    { result: 'Pass', comment: 'Understands anchor pattern height vs prime coat dry film thickness requirement.' },
    { result: 'Pass', comment: 'Well versed in mineral garnet vs copper slag characteristics.' },
    { result: 'Pass', comment: 'Equipped with static grounding clamp, whip checks, and long venturi #7 nozzle.' },
    { result: 'Pass', comment: 'Clear hand signals verified with blast pot tender.' },
    { result: 'Pass', comment: 'Blotter test conducted as per ASTM D4285 (no oil or moisture residue).' },
    { result: 'Pass', comment: 'Hypodermic needle gauge verified 95 PSI at nozzle tip.' },
    { result: 'Pass', comment: 'Cleanliness verified against ISO 8501-1 pictorial standards.' },
    { result: 'Pass', comment: 'Demonstrated accurate replica tape reading technique.' },
    { result: 'Pass', comment: 'Dust tape test performed and verified Class 1 rating.' },
    { result: 'Pass', comment: 'Executed smooth 50% overlap sweeping technique on coupon.' },
    { result: 'Pass', comment: 'Air-fed blast helmet, carbon filter, leather gloves, and ear defenders worn.' }
  ],
  remarkCheck: 'Excellent practical adherence to HSE norms and correct nozzle standoff distance (350–450 mm).',

  // Blasting Process - Environmental
  envItemNo: '1',
  envItem: 'Test panel as per ASTM D 4228',
  envCond: 'A',
  envRhLimit: 85,
  envRows: [
    { time: '1000', db: '32.0', wb: '25.0', mt: '34.0' },
    { time: '1100', db: '33.5', wb: '25.8', mt: '35.5' },
    { time: '1200', db: '34.2', wb: '26.0', mt: '36.8' }
  ],

  // Blasting Process - Surface Prep
  spMethod: 'Abrasive Blasting',
  spRef: 'ITEM 01',
  spCond: 'A',
  spStart: '1030 HRS',
  spEnd: '1115 HRS',
  spStdReq: 'SA 2.5',
  spStdAct: 'SA 2.5',
  spProfReq: '50-75 µm',
  profileSpots: [62, 68, 65, 71, 64],

  // Blasting Process - Abrasive Media
  abType: 'Garnet',
  abClass: 'Mineral Abrasive',
  abSspc: 'SSPC-AB 1',
  abIso: 'ISO 11126-10',
  abMesh: 'GMA 30/60 Mesh',
  abMfr: 'GMA Garnet Middle East FZE',
  abBatch: 'GMA-ME-2026-B849',
  abTc: 'MTC-GMA-99214',
  abDate: new Date().toISOString().split('T')[0],

  // Inspection Process Tests
  inspRows: [
    { p: 'Visual Surface Cleanliness Inspection', std: 'ISO 8501-1 (Sa 2½)', req: 'Near-White Blast Cleaning', obs: 'SA 2.5 (Clean, uniform finish)', res: 'Pass' },
    { p: 'Surface Profile (Anchor Pattern) Measurement', std: 'ASTM D4417 Method A/C', req: '50–75 µm', obs: '66.0 µm Average', res: 'Pass' },
    { p: 'Dust Contamination Test (Tape Test)', std: 'ISO 8502-3', req: 'Rating 2 max · Class 1 or better', obs: 'Class 1 (Clean)', res: 'Pass' },
    { p: 'Blasting Visual Inspection', std: 'SSPC VIS 1', req: 'Sa 2½ — Near White Metal Finish', obs: 'Sa 2.5 Satisfied', res: 'Pass' },
    { p: 'Compressed Air Cleanliness (Blotter Test)', std: 'ASTM D4285', req: 'No visible oil / moisture / water', obs: 'Zero oil / water discoloration', res: 'Pass' }
  ],
  remarkInsp: 'Surface profile and cleanliness fully conform to project specification requirements.',

  // Photos Evidence
  photos: [
    { id: 1, title: 'Pre-Blast Surface Condition', loc: 'Test panel · before blast', date: new Date().toISOString().split('T')[0], init: 'GC', cap: 'Reference photograph showing initial substrate condition prior to blast cleaning.', b64: '' },
    { id: 2, title: 'Blasting in Progress', loc: 'Blast Chamber Bay 4', date: new Date().toISOString().split('T')[0], init: 'GC', cap: 'Operator wearing air-fed respiratory hood performing blast execution on 12mm coupon.', b64: '' },
    { id: 3, title: 'Post-Blast Cleanliness (Sa 2½)', loc: 'Test panel · after blast', date: new Date().toISOString().split('T')[0], init: 'GC', cap: 'Near-white metal finish achieved with uniform anchor pattern profile across plate surface.', b64: '' },
    { id: 4, title: 'Surface Profile Measurement', loc: 'Replica tape reading', date: new Date().toISOString().split('T')[0], init: 'GC', cap: 'Testex X-Coarse replica tape measurement showing 66.0 µm peak-to-valley anchor profile.', b64: '' }
  ],
  remarkPhoto: 'Photographic evidence recorded in field test chamber with calibrated measuring devices.',

  // Executive Summary Narratives
  sumExecManual: '',
  sumScope: 'Qualification of operator for high-pressure dry abrasive blasting operations on carbon steel process vessels, piping spools, and structural steel modules.',
  sumMethod: 'Structured assessment combining written theoretical examination, equipment pre-flight verification, safety review, environmental monitoring, test coupon blasting, and quality verification.',
  sumStrengths: 'Excellent nozzle angle and traverse speed consistency. Highly attentive to equipment grounding and deadman switch operation.',
  sumImprove: 'Continue periodic checks of air compressor moisture drain traps during extended high-humidity morning shifts.',
  sumRecommend: 'Recommended for unconditional qualification on offshore top-deck modules and refinery pipe racks.',

  // Signatures
  sig1Name: 'Gaurav Changawala',
  sig1Date: new Date().toISOString().split('T')[0],
  sig1Stamp: '',
  sig2Name: 'S. N. Murthy (NACE Level III #48102)',
  sig2Date: new Date().toISOString().split('T')[0],
  sig2Stamp: '',
  sig3Name: 'Eng. Khalid Al-Mansoor',
  sig3Date: new Date().toISOString().split('T')[0],
  sig3Stamp: '',

  remarkFinal: 'Operator Rajesh M. Patel has achieved full compliance across theoretical, practical, HSE, and inspection domains.'
};

/**
 * Psychrometric Relative Humidity Calculation
 */
export function calcRH(tdb, twb) {
  if (isNaN(tdb) || isNaN(twb) || tdb === '' || twb === '') return NaN;
  const es = (T) => 6.112 * Math.exp((17.67 * T) / (T + 243.5));
  const e_wb = es(twb) - 0.000662 * 1013.25 * (tdb - twb);
  let rh = (100 * e_wb) / es(tdb);
  if (rh < 0) rh = 0;
  if (rh > 100) rh = 100;
  return rh;
}

/**
 * Magnus Formula Dew Point Calculation
 */
export function calcDP(tdb, rh) {
  if (isNaN(tdb) || isNaN(rh) || rh <= 0 || tdb === '') return NaN;
  const a = 17.67, b = 243.5;
  const alpha = Math.log(rh / 100) + (a * tdb) / (b + tdb);
  return (b * alpha) / (a - alpha);
}

/**
 * Master Qualification Evaluator
 */
export function calculateBlasterQualification(state) {
  const s = state || INITIAL_BLASTER_STATE;

  // 1. Environmental calculations
  const rhLimit = parseFloat(s.envRhLimit) || 85;
  const envRows = s.envRows || [];
  const dbs = [], wbs = [], mts = [];
  let envOkCount = 0, envTotalValid = 0;

  const evaluatedEnvRows = envRows.map((r, i) => {
    const tdb = parseFloat(r.db);
    const twb = parseFloat(r.wb);
    const tmt = parseFloat(r.mt);
    if (!isNaN(tdb)) dbs.push(tdb);
    if (!isNaN(twb)) wbs.push(twb);
    if (!isNaN(tmt)) mts.push(tmt);

    const rh = calcRH(tdb, twb);
    const dp = calcDP(tdb, rh);
    const diff = isNaN(tmt) || isNaN(dp) ? NaN : tmt - dp;

    let isOk = false;
    let verdict = '—';
    if (!isNaN(rh) && !isNaN(diff)) {
      envTotalValid++;
      isOk = rh <= rhLimit && diff >= 3.0;
      verdict = isOk ? 'OK' : 'NOK';
      if (isOk) envOkCount++;
    }

    return {
      ...r,
      sr: i + 1,
      rh: isNaN(rh) ? '—' : rh.toFixed(1),
      dp: isNaN(dp) ? '—' : dp.toFixed(1),
      diff: isNaN(diff) ? '—' : diff.toFixed(1),
      verdict,
      isOk
    };
  });

  const avgFn = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN);
  const dbAvg = avgFn(dbs);
  const wbAvg = avgFn(wbs);
  const mtAvg = avgFn(mts);
  const rhAvg = calcRH(dbAvg, wbAvg);
  const dpAvg = calcDP(dbAvg, rhAvg);
  const diffAvg = isNaN(mtAvg) || isNaN(dpAvg) ? NaN : mtAvg - dpAvg;
  const envFinalOK = envTotalValid > 0 && envOkCount === envTotalValid;

  // 2. Surface Profile Average
  const spots = s.profileSpots || [];
  const validSpots = spots.map(v => parseFloat(v)).filter(v => !isNaN(v));
  const profAvg = validSpots.length ? validSpots.reduce((a, b) => a + b, 0) / validSpots.length : NaN;
  const reqMatch = (s.spProfReq || '').match(/(\d+)\s*-\s*(\d+)/);
  let isProfPass = false;
  let profVerdictText = '—';
  if (reqMatch && !isNaN(profAvg)) {
    const lo = parseFloat(reqMatch[1]), hi = parseFloat(reqMatch[2]);
    isProfPass = profAvg >= lo && profAvg <= hi;
    profVerdictText = isProfPass ? 'PASS' : 'FAIL';
  } else if (!isNaN(profAvg)) {
    isProfPass = profAvg >= 40 && profAvg <= 85;
    profVerdictText = isProfPass ? 'PASS' : 'CHECK';
  }

  // 3. Pre & Post Test Scores
  const preCorrect = parseInt(s.preCorrect) || 0;
  const postCorrect = parseInt(s.postCorrect) || 0;
  const prePct = (preCorrect / 25) * 100;
  const postPct = (postCorrect / 25) * 100;
  const improvement = postPct - prePct;
  const isPostPass = postPct >= 80;

  // 4. Checklist Compliance
  const checklist = s.checklist || [];
  let chkPass = 0, chkFail = 0, chkNa = 0, chkPend = 0;
  checklist.forEach(item => {
    const res = item.result;
    if (res === 'Pass') chkPass++;
    else if (res === 'Fail') chkFail++;
    else if (res === 'NA') chkNa++;
    else chkPend++;
  });
  const chkEvaluated = chkPass + chkFail;
  const chkPct = chkEvaluated > 0 ? (chkPass / chkEvaluated) * 100 : 0;
  const isChkPass = chkPct >= 80 && chkFail === 0;

  // 5. Inspection Tests Pass Rate
  const inspRows = s.inspRows || [];
  let inspPass = 0, inspFail = 0, inspNa = 0, inspPend = 0;
  inspRows.forEach(item => {
    const res = item.res;
    if (res === 'Pass') inspPass++;
    else if (res === 'Fail') inspFail++;
    else if (res === 'NA') inspNa++;
    else inspPend++;
  });
  const inspEvaluated = inspPass + inspFail;
  const inspPct = inspEvaluated > 0 ? (inspPass / inspEvaluated) * 100 : 0;
  const isInspPass = inspPct >= 80 && inspFail === 0;

  // 6. Overall Weighted Score
  // Weights: Post-Test 30%, Improvement 10%, Checklist 25%, Inspection 25%, Environmental 10%
  const envScore = envTotalValid > 0 ? (envOkCount / envTotalValid) * 100 : 100;
  const impCapped = Math.min(Math.max(improvement, 0), 100);
  const overallScore = (0.30 * postPct) + (0.10 * impCapped) + (0.25 * chkPct) + (0.25 * inspPct) + (0.10 * envScore);

  // 7. Master Final Verdict Determination
  const hasPending = chkPend > 0 || (inspRows.length > 0 && inspPend > 0);
  const allCriteriaMet = isPostPass && isChkPass && isInspPass && (envTotalValid === 0 || envFinalOK);

  let verdict = 'PENDING';
  let verdictStatus = 'In Progress';
  let verdictBadgeClass = 'pending';
  if (hasPending) {
    verdict = 'PENDING';
    verdictStatus = 'In Progress';
    verdictBadgeClass = 'pending';
  } else if (allCriteriaMet) {
    verdict = 'PASS';
    verdictStatus = 'Qualified';
    verdictBadgeClass = 'pass';
  } else {
    verdict = 'FAIL';
    verdictStatus = 'Not Qualified';
    verdictBadgeClass = 'fail';
  }

  // 8. Progress Calculation for Workflow (6 steps)
  const isInfoDone = Boolean(s.operatorName && s.projectName && s.civilId);
  const isTrainDone = postCorrect > 0;
  const isChkDone = chkPend === 0 && checklist.length >= 12;
  const isBlastingDone = envTotalValid > 0 && !isNaN(profAvg) && inspRows.length > 0;
  const photoCount = (s.photos || []).filter(p => p.b64).length;
  const isPhotoDone = photoCount >= 3;
  const isVerdictDone = verdict !== 'PENDING';

  const stepCompletions = {
    info: isInfoDone ? 100 : 50,
    train: isTrainDone ? 100 : (preCorrect > 0 ? 50 : 0),
    checklist: Math.round(chkPct),
    blasting: isBlastingDone ? 100 : 50,
    photo: isPhotoDone ? 100 : (photoCount > 0 ? 50 : 0),
    verdict: isVerdictDone ? 100 : 50
  };

  const totalProgress = Math.round(
    (stepCompletions.info + stepCompletions.train + stepCompletions.checklist +
     stepCompletions.blasting + stepCompletions.photo + stepCompletions.verdict) / 6
  );

  return {
    // Environmental
    evaluatedEnvRows,
    dbAvg: isNaN(dbAvg) ? '—' : dbAvg.toFixed(1),
    wbAvg: isNaN(wbAvg) ? '—' : wbAvg.toFixed(1),
    mtAvg: isNaN(mtAvg) ? '—' : mtAvg.toFixed(1),
    rhAvg: isNaN(rhAvg) ? '—' : rhAvg.toFixed(1),
    dpAvg: isNaN(dpAvg) ? '—' : dpAvg.toFixed(1),
    diffAvg: isNaN(diffAvg) ? '—' : diffAvg.toFixed(1),
    envOkCount,
    envTotalValid,
    envFinalOK,

    // Profile
    profAvg: isNaN(profAvg) ? '—' : profAvg.toFixed(1),
    isProfPass,
    profVerdictText,

    // Tests
    preCorrect,
    postCorrect,
    prePct,
    postPct,
    improvement,
    isPostPass,

    // Checklist
    chkPass,
    chkFail,
    chkNa,
    chkPend,
    chkPct,
    isChkPass,

    // Inspection
    inspPass,
    inspFail,
    inspNa,
    inspPend,
    inspPct,
    isInspPass,

    // Scores & Verdict
    overallScore,
    verdict,
    verdictStatus,
    verdictBadgeClass,

    // Progress
    stepCompletions,
    totalProgress,
    photoCount
  };
}
