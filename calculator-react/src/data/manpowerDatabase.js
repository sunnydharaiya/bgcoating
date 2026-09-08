// Master Database and Engineering Calculations for Manpower-Based Painting Project Estimation
// Aligned with BG Group Enterprise Engineering Standards & Reference HTML 05

export const CURRENCY_CONFIG = {
  INR: { sym: '₹', name: 'Indian Rupee (₹)', loc: 'en-IN' },
  USD: { sym: '$', name: 'US Dollar ($)', loc: 'en-US' },
  EUR: { sym: '€', name: 'Euro (€)', loc: 'de-DE' },
  AED: { sym: 'AED ', name: 'UAE Dirham (AED)', loc: 'en-AE' },
  SAR: { sym: 'SAR ', name: 'Saudi Riyal (SAR)', loc: 'en-SA' },
  GBP: { sym: '£', name: 'British Pound (£)', loc: 'en-GB' },
};

export const MOC_OPTIONS = [
  { id: 'CS', label: 'CS — Carbon Steel' },
  { id: 'LAS', label: 'LAS — Low Alloy Steel' },
  { id: 'SS', label: 'SS — Stainless Steel' },
  { id: 'DSS', label: 'Duplex SS' },
  { id: 'Aluminium', label: 'Aluminium' },
];

export const SURFACE_PREP_OPTIONS = [
  { id: 'Sa3', label: 'Sa3 / NACE1 / SP5 (White Metal)' },
  { id: 'Sa2.5', label: 'Sa 2.5 / NACE2 / SP10 (Near White)' },
  { id: 'Sa2', label: 'Sa 2 / NACE3 / SP6 (Commercial)' },
  { id: 'Sweep', label: 'Sweep Blasting / Light Brush' },
  { id: 'Power Tool', label: 'Power Tool / SP3 (St 3)' },
];

export const STRUCTURE_OPTIONS = [
  { id: 'UltraLight', label: 'Ultra Light Structural' },
  { id: 'Light', label: 'Light Fabrication' },
  { id: 'Medium', label: 'Medium Structural / Piping' },
  { id: 'Heavy', label: 'Heavy Equipment & Girders' },
  { id: 'UltraHeavy', label: 'Ultra Heavy Vessels & Tanks' },
];

export const ABRASIVE_MEDIA_OPTIONS = [
  { id: 'copperslag', label: 'Copper Slag (Grit)' },
  { id: 'garnet', label: 'Almandine Garnet (80/120 Mesh)' },
];

export const WORKER_CATEGORY_OPTIONS = [
  { id: 'Helper', label: 'Helper / Manual Laborer' },
  { id: 'Blaster', label: 'Certified Blaster' },
  { id: 'Painter', label: 'Airless Spray Painter' },
  { id: 'Supervisor', label: 'Coating Supervisor' },
  { id: 'Site Incharge', label: 'Site Incharge / Engineer' },
  { id: 'NACE Inspector', label: 'NACE / AMPP Coating Inspector' },
];

// 18 Industrial Standard Paint Presets
export const QREF_PAINTS = [
  { name: 'Inorganic Zinc Silicate Primer', vs: 75, dft: 75, loss: 20, thinner: 5, paintPrice: 500, thinnerPrice: 150 },
  { name: 'Organic Zinc Rich Epoxy Primer', vs: 65, dft: 75, loss: 25, thinner: 5, paintPrice: 480, thinnerPrice: 150 },
  { name: 'Epoxy Zinc Phosphate Primer', vs: 65, dft: 60, loss: 25, thinner: 5, paintPrice: 420, thinnerPrice: 150 },
  { name: 'Red Oxide Primer', vs: 50, dft: 50, loss: 20, thinner: 5, paintPrice: 320, thinnerPrice: 130 },
  { name: 'Epoxy High Build', vs: 85, dft: 125, loss: 20, thinner: 5, paintPrice: 450, thinnerPrice: 150 },
  { name: 'Epoxy MIO (Micaceous Iron Oxide)', vs: 80, dft: 100, loss: 20, thinner: 5, paintPrice: 400, thinnerPrice: 150 },
  { name: 'Epoxy Glass Flake', vs: 90, dft: 300, loss: 20, thinner: 0, paintPrice: 650, thinnerPrice: 160 },
  { name: 'Epoxy Phenolic (Tank Lining)', vs: 70, dft: 100, loss: 25, thinner: 5, paintPrice: 580, thinnerPrice: 160 },
  { name: 'Polyurethane (Aliphatic PU)', vs: 60, dft: 50, loss: 25, thinner: 8, paintPrice: 650, thinnerPrice: 150 },
  { name: 'Acrylic Polyurethane', vs: 55, dft: 50, loss: 25, thinner: 8, paintPrice: 590, thinnerPrice: 150 },
  { name: 'Multipolymeric Matrix Coating / TiO2 Based', vs: 70, dft: 100, loss: 20, thinner: 5, paintPrice: 750, thinnerPrice: 180 },
  { name: 'Polysiloxane (CUI Defense)', vs: 75, dft: 75, loss: 20, thinner: 5, paintPrice: 890, thinnerPrice: 180 },
  { name: 'High Temperature Silicone Aluminum', vs: 35, dft: 25, loss: 30, thinner: 10, paintPrice: 720, thinnerPrice: 160 },
  { name: 'Acrylic Finish', vs: 45, dft: 40, loss: 20, thinner: 5, paintPrice: 380, thinnerPrice: 140 },
  { name: 'Fusion Bonded Epoxy (FBE)', vs: 100, dft: 350, loss: 15, thinner: 0, paintPrice: 520, thinnerPrice: 0 },
  { name: 'Coal Tar Epoxy', vs: 70, dft: 200, loss: 25, thinner: 5, paintPrice: 350, thinnerPrice: 140 },
  { name: 'Thermal Spray Aluminum (TSA)', vs: 100, dft: 200, loss: 30, thinner: 0, paintPrice: 950, thinnerPrice: 0 },
  { name: 'Intumescent Fireproof Coating', vs: 70, dft: 1000, loss: 25, thinner: 5, paintPrice: 850, thinnerPrice: 170 },
];

export const ABR_ROWS = [
  'Zero Scale only Flash Rust',
  'Mild Scale / New Steel / Thin Coating (<25 µm)',
  'Heavy Scale / Heat Treated / Coating (<90 µm)',
  'Very Heavy Scale / Multi-Heat / Thick Coating (>90 µm)'
];

export const ABR_COLS = ['Sweep', 'Commercial', 'SA 2.5', 'SA 3'];

export const ABR_RATES = {
  garnet: [
    [6.5, 9.5, 13.0, 16.5],
    [null, 11.0, 14.5, 18.0],
    [null, null, 17.5, 21.0],
    [null, null, 21.0, 26.0]
  ],
  copperslag: [
    [10.0, 15.0, 20.0, 25.0],
    [null, 18.0, 24.0, 30.0],
    [null, null, 28.0, 35.0],
    [null, null, 35.0, 42.0]
  ]
};

export const INITIAL_MANPOWER_STATE = {
  // Project Info
  estNo: '',
  projectName: '',
  customer: '',
  location: '',
  moc: 'CS',
  surfacePrep: 'Sa2.5',
  cyclic: 'No',
  fireproof: 'No',
  structure: 'Light',
  
  // Scale & Schedule
  tonnage: '',
  area: 20000,
  currency: 'INR',
  months: 12,
  wdays: 26,
  hdays: 0,
  shifts: 1,
  blastOutput: 50, // m²/shift
  paintOutput: 30, // m²/shift
  reuse: 2, // Abrasive reuse factor

  // Blasting Variables
  bMedia: 'copperslag',
  bAbrKg: 15,
  bAbrRate: 3.5,
  bDieselL: 0.8,
  bDieselRate: 84,
  bPPE: 500,
  bIns: 800,
  bCons: 4000,
  bIdle: 15,

  // Blasting Manpower (Per setup salary / count)
  bSupRate: 40000, bSupNo: 1,
  bBlRate: 33000,  bBlNo: 1,
  bHpRate: 25000,  bHpNo: 3,
  bSiRate: 60000,  bSiNo: 1,
  bNcRate: 80000,  bNcNo: 0,

  // Blasting Equipment
  bComp: 50000,
  bHop: 10000,
  bAc: 5000,
  bHood: 10000,
  bInst: 15000,
  bPump: 15000,

  // Blasting Profit & Overheads
  bOffice: 50000,
  bAdmin: 25000,
  bMob: 40000,
  bOH: 2,
  bProfit: 15,

  // Painting Variables
  pCoats: 2,
  pPPE: 500,
  pIns: 800,
  pDieselL: 0,
  pDieselRate: 84,
  pMask: 10000,
  pInst: 15000,
  pPump: 15000,
  pCons: 4000,
  pIdle: 15,
  pComp: 0,

  // Painting Manpower
  pSupRate: 40000, pSupNo: 2,
  pSpRate: 33000,  pSpNo: 0,
  pHpRate: 25000,  pHpNo: 13,
  pSiRate: 60000,  pSiNo: 0,
  pNcRate: 80000,  pNcNo: 0,

  // Painting Profit & Overheads
  pOffice: 0,
  pAdmin: 0,
  pMob: 0,
  pOH: 0,
  pProfit: 10,

  // Paint Raw Material Coats
  rawRows: [
    { name: 'Inorganic Zinc Silicate Primer', dft: 75, vs: 75, thinner: 5, loss: 30, paintPrice: 500, thinnerPrice: 150 },
    { name: 'Epoxy MIO Intermediate', dft: 125, vs: 80, thinner: 5, loss: 30, paintPrice: 400, thinnerPrice: 150 },
    { name: 'Epoxy High Build', dft: 125, vs: 80, thinner: 5, loss: 30, paintPrice: 420, thinnerPrice: 150 },
    { name: 'Polyurethane Topcoat', dft: 60, vs: 60, thinner: 8, loss: 35, paintPrice: 650, thinnerPrice: 150 }
  ],

  // Worker CTC Calculator
  worker: {
    name: 'Worker 1',
    category: 'Helper',
    wage: 487,
    days: 26,
    otHr: 4,
    otMul: 1.5,
    pf: 12.16,
    bonus: 8.33,
    ins: 400,
    pm: 10,
    room: 2000,
    travel: 2000,
    med: 100,
    ppe: 150
  },

  // Abrasive Grid Selection
  abrGridType: 'copperslag',
  abrGridValues: {
    '0-0': 1000,
    '1-2': 1000
  },

  revisions: [
    { no: 'R0', date: new Date().toISOString().split('T')[0], details: 'Initial Take-off & Manpower Sizing', prep: 'BG Estimator', rev: 'Lead Engineer', appr: 'Commercial Head' }
  ]
};

// Calculation Utilities
export function calculateManpowerEstimation(state) {
  const s = { ...INITIAL_MANPOWER_STATE, ...state };
  const currencyObj = CURRENCY_CONFIG[s.currency] || CURRENCY_CONFIG.INR;

  const area = parseFloat(s.area) || 0;
  const tonnage = parseFloat(s.tonnage) || 0;
  const months = Math.max(1, parseFloat(s.months) || 1);
  const wdays = Math.max(1, parseFloat(s.wdays) || 26);
  const hdays = parseFloat(s.hdays) || 0;
  const shifts = Math.max(1, parseFloat(s.shifts) || 1);
  const blastOut = Math.max(1, parseFloat(s.blastOutput) || 50);
  const paintOut = Math.max(1, parseFloat(s.paintOutput) || 30);
  const coats = Math.max(1, parseFloat(s.pCoats) || 1);

  // 1. Quantum & Schedule
  const holidayImpact = hdays * months;
  const totalDays = Math.max(1, (months * wdays) + holidayImpact);
  const reqBlastDays = (blastOut * shifts > 0 ? area / (blastOut * shifts) : 0) + holidayImpact;
  const reqPaintDays = (paintOut * shifts > 0 ? (area * coats) / (paintOut * shifts) : 0) + holidayImpact;
  const blastingSetups = Math.max(1, Math.ceil(reqBlastDays / totalDays));
  const paintingSetups = Math.max(1, Math.ceil(reqPaintDays / totalDays));
  const dailyTarget = totalDays > 0 ? area / totalDays : 0;

  // 2. Blasting Cost Engine (A/B/C/D)
  const bAbrKg = parseFloat(s.bAbrKg) || 0;
  const bAbrRate = parseFloat(s.bAbrRate) || 0;
  const bDieselL = parseFloat(s.bDieselL) || 0;
  const bDieselRate = parseFloat(s.bDieselRate) || 0;
  const bPPE = parseFloat(s.bPPE) || 0;
  const bIns = parseFloat(s.bIns) || 0;
  const bCons = parseFloat(s.bCons) || 0;
  const bIdle = parseFloat(s.bIdle) || 0;

  const bSupNo = parseFloat(s.bSupNo) || 0;
  const bBlNo = parseFloat(s.bBlNo) || 0;
  const bHpNo = parseFloat(s.bHpNo) || 0;
  const bSiNo = parseFloat(s.bSiNo) || 0;
  const bNcNo = parseFloat(s.bNcNo) || 0;
  const bTotalCrewPerSetup = bSupNo + bBlNo + bHpNo + bSiNo + bNcNo;

  const bSupRate = parseFloat(s.bSupRate) || 0;
  const bBlRate = parseFloat(s.bBlRate) || 0;
  const bHpRate = parseFloat(s.bHpRate) || 0;
  const bSiRate = parseFloat(s.bSiRate) || 0;
  const bNcRate = parseFloat(s.bNcRate) || 0;

  // A: Consumable items
  const bAbrCostPerM2 = bAbrKg * bAbrRate;
  const bDieselCostPerM2 = bDieselL * bDieselRate;
  const bPpeCostPerM2 = (bPPE * bTotalCrewPerSetup) / (wdays * blastOut);
  const bConsCostPerM2 = (bCons * shifts) / (wdays * blastOut);
  const bA_items = [
    { n: 'Blasting Abrasive Rate & Cost', pm: bAbrCostPerM2 },
    { n: 'Diesel Rate & Cost', pm: bDieselCostPerM2 },
    { n: 'PPE for Workmen', pm: bPpeCostPerM2 },
    { n: 'Consumable Items', pm: bConsCostPerM2 }
  ];
  const bA_total = bA_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  // B: Labor items
  const bMonthlyOutput = blastOut * shifts * wdays;
  const bSupPm = bMonthlyOutput > 0 ? (bSupRate * bSupNo) / bMonthlyOutput : 0;
  const bBlPm = bMonthlyOutput > 0 ? (bBlRate * bBlNo) / bMonthlyOutput : 0;
  const bHpPm = bMonthlyOutput > 0 ? (bHpRate * bHpNo) / bMonthlyOutput : 0;
  const bSiPm = bMonthlyOutput > 0 ? (bSiRate * bSiNo) / bMonthlyOutput : 0;
  const bNcPm = bMonthlyOutput > 0 ? (bNcRate * bNcNo) / bMonthlyOutput : 0;
  const bInsPm = (bIns * bTotalCrewPerSetup) / (wdays * blastOut);
  const bIdlePm = (bSupPm + bBlPm + bHpPm + bSiPm + bNcPm) * (bIdle / 100);
  const bB_items = [
    { n: 'Supervisor', pm: bSupPm },
    { n: 'Blaster', pm: bBlPm },
    { n: 'Helper', pm: bHpPm },
    { n: 'Site Incharge', pm: bSiPm },
    { n: 'NACE Inspector', pm: bNcPm },
    { n: 'Insurance/Medical', pm: bInsPm },
    { n: 'Idling % of Manpower', pm: bIdlePm }
  ];
  const bB_total = bB_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  // C: Equipment items
  const bComp = parseFloat(s.bComp) || 0;
  const bHop = parseFloat(s.bHop) || 0;
  const bAc = parseFloat(s.bAc) || 0;
  const bHood = parseFloat(s.bHood) || 0;
  const bInst = parseFloat(s.bInst) || 0;
  const bPump = parseFloat(s.bPump) || 0;

  const bCompPm = (bComp / wdays) * (blastingSetups / blastOut);
  const bHopPm = (bHop / wdays) * (blastingSetups / blastOut);
  const bAcPm = (bAc / wdays) * (blastingSetups / blastOut);
  const bHoodPm = (bHood / wdays) * (blastingSetups / blastOut);
  const bInstPm = (bInst / wdays) * (blastingSetups / blastOut);
  const bPumpPm = (bPump / wdays) * (blastingSetups / blastOut);
  const bC_items = [
    { n: 'Compressor Hire', pm: bCompPm },
    { n: 'Hopper, Hoses, Nozzles', pm: bHopPm },
    { n: 'After Cooler Assembly', pm: bAcPm },
    { n: 'Blasting Hood Assembly', pm: bHoodPm },
    { n: 'Inspection Instruments', pm: bInstPm },
    { n: 'Airless Pump & Accessories', pm: bPumpPm }
  ];
  const bC_total = bC_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  // D: Profit & Overheads
  const bOffice = parseFloat(s.bOffice) || 0;
  const bAdmin = parseFloat(s.bAdmin) || 0;
  const bMob = parseFloat(s.bMob) || 0;
  const bOH = parseFloat(s.bOH) || 0;
  const bProfit = parseFloat(s.bProfit) || 0;

  const bOfficePm = totalDays > 0 && blastOut > 0 ? (bOffice / totalDays / blastOut) * shifts : 0;
  const bAdminPm = totalDays > 0 && blastOut > 0 ? (bAdmin / totalDays / blastOut) * shifts : 0;
  const bMobPm = totalDays > 0 && blastOut > 0 ? (bMob / totalDays / blastOut) * shifts : 0;
  const bSubTot = bA_total + bB_total + bC_total + bOfficePm + bAdminPm + bMobPm;
  const bOhPm = bSubTot * (bOH / 100);
  const bProfitPm = (bSubTot + bOhPm) * (bProfit / 100);
  const bD_items = [
    { n: 'Office / Store Cost', pm: bOfficePm },
    { n: 'Admin / Local Issue', pm: bAdminPm },
    { n: 'Mob - Demob', pm: bMobPm },
    { n: 'Sub-Contractor Overhead', pm: bOhPm },
    { n: 'Sub-Contractor Profit', pm: bProfitPm }
  ];
  const bD_total = bD_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  const blastPM2 = bA_total + bB_total + bC_total + bD_total;
  const blastTotal = blastPM2 * area;

  // 3. Painting Cost Engine (A/B/C/D)
  const pPPE = parseFloat(s.pPPE) || 0;
  const pIns = parseFloat(s.pIns) || 0;
  const pDieselL = parseFloat(s.pDieselL) || 0;
  const pDieselRate = parseFloat(s.pDieselRate) || 0;
  const pMask = parseFloat(s.pMask) || 0;
  const pInst = parseFloat(s.pInst) || 0;
  const pPump = parseFloat(s.pPump) || 0;
  const pCons = parseFloat(s.pCons) || 0;
  const pIdle = parseFloat(s.pIdle) || 0;
  const pComp = parseFloat(s.pComp) || 0;

  const pSupNo = parseFloat(s.pSupNo) || 0;
  const pSpNo = parseFloat(s.pSpNo) || 0;
  const pHpNo = parseFloat(s.pHpNo) || 0;
  const pSiNo = parseFloat(s.pSiNo) || 0;
  const pNcNo = parseFloat(s.pNcNo) || 0;
  const pTotalCrewPerSetup = pSupNo + pSpNo + pHpNo + pSiNo + pNcNo;

  const pSupRate = parseFloat(s.pSupRate) || 0;
  const pSpRate = parseFloat(s.pSpRate) || 0;
  const pHpRate = parseFloat(s.pHpRate) || 0;
  const pSiRate = parseFloat(s.pSiRate) || 0;
  const pNcRate = parseFloat(s.pNcRate) || 0;

  // A: Consumables
  const pPpeCostPerM2 = (pPPE * pTotalCrewPerSetup) / (wdays * paintOut);
  const pMaskCostPerM2 = (pMask / wdays) * (paintingSetups / paintOut);
  const pDieselCostPerM2 = pDieselL * pDieselRate;
  const pConsCostPerM2 = (pCons / paintOut) * shifts / wdays;
  const pA_items = [
    { n: 'PPE for Workmen', pm: pPpeCostPerM2 },
    { n: 'Painter Mask & PPE', pm: pMaskCostPerM2 },
    { n: 'Diesel Rate & Cost', pm: pDieselCostPerM2 },
    { n: 'Consumable Items', pm: pConsCostPerM2 }
  ];
  const pA_total = pA_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  // B: Labor
  const pMonthlyOutput = paintOut * shifts * wdays;
  const pSupPm = pMonthlyOutput > 0 ? (pSupRate * pSupNo) / pMonthlyOutput : 0;
  const pSpPm = pMonthlyOutput > 0 ? (pSpRate * pSpNo) / pMonthlyOutput : 0;
  const pHpPm = pMonthlyOutput > 0 ? (pHpRate * pHpNo) / pMonthlyOutput : 0;
  const pSiPm = pMonthlyOutput > 0 ? (pSiRate * pSiNo) / pMonthlyOutput : 0;
  const pNcPm = pMonthlyOutput > 0 ? (pNcRate * pNcNo) / pMonthlyOutput : 0;
  const pInsPm = (pIns * pTotalCrewPerSetup) / (wdays * paintOut);
  const pIdlePm = (pSupPm + pSpPm + pHpPm + pSiPm + pNcPm) * (pIdle / 100);
  const pB_items = [
    { n: 'Supervisor', pm: pSupPm },
    { n: 'Spray Painter', pm: pSpPm },
    { n: 'Helper / Brush Painter', pm: pHpPm },
    { n: 'Site Incharge', pm: pSiPm },
    { n: 'NACE Inspector', pm: pNcPm },
    { n: 'Insurance/Medical', pm: pInsPm },
    { n: 'Idling %', pm: pIdlePm }
  ];
  const pB_total = pB_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  // C: Equipment
  const pCompPm = (pComp / wdays) * (paintingSetups / paintOut);
  const pInstPm = (pInst / wdays) * (paintingSetups / paintOut);
  const pPumpPm = (pPump / wdays) * (paintingSetups / paintOut);
  const pC_items = [
    { n: 'Compressor Hire', pm: pCompPm },
    { n: 'Inspection Instruments', pm: pInstPm },
    { n: 'Airless Pump & Accessories', pm: pPumpPm }
  ];
  const pC_total = pC_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  // D: Profit & Overheads
  const pOffice = parseFloat(s.pOffice) || 0;
  const pAdmin = parseFloat(s.pAdmin) || 0;
  const pMob = parseFloat(s.pMob) || 0;
  const pOH = parseFloat(s.pOH) || 0;
  const pProfit = parseFloat(s.pProfit) || 0;

  const pOfficePm = totalDays > 0 && paintOut > 0 ? (pOffice / totalDays / paintOut) * shifts : 0;
  const pAdminPm = totalDays > 0 && paintOut > 0 ? (pAdmin / totalDays / paintOut) * shifts : 0;
  const pMobPm = totalDays > 0 && paintOut > 0 ? (pMob / totalDays / paintOut) * shifts : 0;
  const pSubTot = pA_total + pB_total + pC_total + pOfficePm + pAdminPm + pMobPm;
  const pOhPm = pSubTot * (pOH / 100);
  const pProfitPm = (pSubTot + pOhPm) * (pProfit / 100);
  const pD_items = [
    { n: 'Office / Store Cost', pm: pOfficePm },
    { n: 'Admin / Local', pm: pAdminPm },
    { n: 'Mob - Demob', pm: pMobPm },
    { n: 'Sub-Contractor Overhead', pm: pOhPm },
    { n: 'Sub-Contractor Profit', pm: pProfitPm }
  ];
  const pD_total = pD_items.reduce((acc, it) => acc + (it.pm || 0), 0);

  const paintPerPassPM2 = pA_total + pB_total + pC_total + pD_total;
  const paintPM2 = paintPerPassPM2 * coats;
  const paintTotal = paintPM2 * area;

  // 4. Paint Raw Material Calculation
  let rawTotal = 0;
  let rawPM2 = 0;
  const rawCalculatedRows = (s.rawRows || []).map((r) => {
    const dft = parseFloat(r.dft) || 0;
    const vs = parseFloat(r.vs) || 0;
    const th = parseFloat(r.thinner) || 0;
    const loss = parseFloat(r.loss) || 0;
    const pp = parseFloat(r.paintPrice) || 0;
    const tp = parseFloat(r.thinnerPrice) || 0;

    if (dft <= 0 || vs <= 0 || area <= 0) {
      return {
        ...r,
        tc: 0,
        ps: 0,
        pq: 0,
        tq: 0,
        cost: 0,
        pm2: 0
      };
    }

    const tc = (vs * 10) / dft;
    const ps = tc - (tc * (loss / 100));
    const pq = ps > 0 ? area / ps : 0;
    const tq = pq * (th / 100);
    const cost = (pq * pp) + (tq * tp);
    const pm2 = area > 0 ? cost / area : 0;

    rawTotal += cost;
    rawPM2 += pm2;

    return {
      ...r,
      tc,
      ps,
      pq,
      tq,
      cost,
      pm2
    };
  });

  // 5. Abrasive and Diesel Rollup
  const abrKgPerM2 = bAbrKg;
  const totalAbrKg = abrKgPerM2 * area;
  const totalAbrTon = totalAbrKg / 1000;
  const totalAbrCost = totalAbrKg * bAbrRate;

  const blastDieselL = bDieselL * area;
  const blastDieselCost = blastDieselL * bDieselRate;
  const paintDieselL = pDieselL * area * coats;
  const paintDieselCost = paintDieselL * pDieselRate;
  const totalDieselL = blastDieselL + paintDieselL;
  const totalDieselCost = blastDieselCost + paintDieselCost;

  // 6. Worker CTC Calculation
  const w = s.worker || INITIAL_MANPOWER_STATE.worker;
  const wWage = parseFloat(w.wage) || 0;
  const wDays = parseFloat(w.days) || 26;
  const wOtHr = parseFloat(w.otHr) || 0;
  const wOtMul = parseFloat(w.otMul) || 1.5;
  const wPf = parseFloat(w.pf) || 0;
  const wBonus = parseFloat(w.bonus) || 0;
  const wIns = parseFloat(w.ins) || 0;
  const wPm = parseFloat(w.pm) || 0;
  const wRoom = parseFloat(w.room) || 0;
  const wTravel = parseFloat(w.travel) || 0;
  const wMed = parseFloat(w.med) || 0;
  const wPpe = parseFloat(w.ppe) || 0;

  const workerBasic = wWage * wDays;
  const workerOT = wDays * wOtHr * wOtMul * (wWage / 8);
  const workerLeave = wWage * 1.33;
  const workerGovLib = (workerBasic * (wPf / 100)) + (workerBasic * (wBonus / 100)) + workerLeave + wIns;
  const workerMisc = wRoom + wTravel + wMed + wPpe;
  const workerSubtotal = workerBasic + workerOT + workerGovLib + workerMisc;
  const workerProfit = workerSubtotal * (wPm / 100);
  const workerTotalMonthlyCTC = workerSubtotal + workerProfit;

  // 7. Grand Rollup & Surface Comparison
  const grandTotal = blastTotal + paintTotal + rawTotal;
  const costPerM2 = area > 0 ? grandTotal / area : 0;

  // Surface finish comparison relative to Sa 2.5
  const sa25Rate = costPerM2;
  const sa3Rate = sa25Rate * 1.15;
  const sa2Rate = sa25Rate * 0.55;
  const sweepRate = sa25Rate * 0.45;

  // Completion Percentage
  const checks = [
    !!(s.estNo && s.estNo.trim()),
    !!(s.projectName && s.projectName.trim()),
    !!(s.customer && s.customer.trim()),
    area > 0,
    months > 0,
    blastOut > 0,
    paintOut > 0,
    bAbrRate > 0,
    bSupRate > 0,
    bComp > 0,
    coats > 0,
    pSupRate > 0,
    rawTotal > 0,
    blastTotal > 0,
    paintTotal > 0
  ];
  const completionPct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return {
    area,
    tonnage,
    months,
    wdays,
    hdays,
    shifts,
    blastOut,
    paintOut,
    coats,
    totalDays,
    reqBlastDays,
    reqPaintDays,
    blastingSetups,
    paintingSetups,
    dailyTarget,

    // Blasting Breakdown
    bA_items, bA_total,
    bB_items, bB_total,
    bC_items, bC_total,
    bD_items, bD_total,
    blastPM2,
    blastTotal,
    bA_tot: bA_total * area,
    bB_tot: bB_total * area,
    bC_tot: bC_total * area,
    bD_tot: bD_total * area,

    // Painting Breakdown
    pA_items, pA_total,
    pB_items, pB_total,
    pC_items, pC_total,
    pD_items, pD_total,
    paintPM2,
    paintTotal,
    pA_tot: (pA_total + pC_total) * area * coats,
    pB_tot: pB_total * area * coats,
    pD_tot: pD_total * area * coats,

    // Raw Material
    rawCalculatedRows,
    rawTotal,
    rawPM2,
    rawCoats: rawCalculatedRows.filter(r => r.cost > 0).length,

    // Abrasive & Diesel
    totalAbrKg,
    totalAbrTon,
    totalAbrCost,
    totalDieselL,
    totalDieselCost,

    // Worker CTC
    workerBasic,
    workerOT,
    workerLeave,
    workerGovLib,
    workerMisc,
    workerProfit,
    workerTotalMonthlyCTC,

    // Grand Rollup
    grandTotal,
    costPerM2,
    sa3Rate,
    sa25Rate,
    sa2Rate,
    sweepRate,
    completionPct,

    // Formatted strings
    currencyObj,
    formatCur: (val) => `${currencyObj.sym} ${Number(val || 0).toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    formatNum: (val, d = 2) => Number(val || 0).toLocaleString(currencyObj.loc, { minimumFractionDigits: d, maximumFractionDigits: d })
  };
}
