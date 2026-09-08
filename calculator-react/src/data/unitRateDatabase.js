// ==========================================================================
// BG CoatingOS™ — Master Engineering & Commercial Database for 04. Quick Unit-Rate Estimation
// Multi-Currency, Spread Rate Engines, Abrasive Rates & Estimation Presets
// ==========================================================================

export const CURRENCY_CONFIG = {
  INR: { sym: '₹', name: 'INR', loc: 'en-IN', label: 'Indian Rupee (₹)' },
  USD: { sym: '$', name: 'USD', loc: 'en-US', label: 'US Dollar ($)' },
  EUR: { sym: '€', name: 'EUR', loc: 'de-DE', label: 'Euro (€)' },
  AED: { sym: 'AED ', name: 'AED', loc: 'en-AE', label: 'UAE Dirham (AED)' },
  SAR: { sym: 'SAR ', name: 'SAR', loc: 'en-SA', label: 'Saudi Riyal (SAR)' },
  GBP: { sym: '£', name: 'GBP', loc: 'en-GB', label: 'British Pound (£)' },
  SGD: { sym: 'S$ ', name: 'SGD', loc: 'en-SG', label: 'Singapore Dollar (S$)' },
  QAR: { sym: 'QAR ', name: 'QAR', loc: 'en-QA', label: 'Qatari Riyal (QAR)' },
  OMR: { sym: 'OMR ', name: 'OMR', loc: 'en-OM', label: 'Omani Rial (OMR)' },
  KWD: { sym: 'KWD ', name: 'KWD', loc: 'en-KW', label: 'Kuwaiti Dinar (KWD)' }
};

export const SCOPE_DEFS = [
  { key: 'surfPaint', icon: '🛠️', title: 'Surface Preparation & Painting', sub: 'Abrasive Blasting + Protective Coating' },
  { key: 'insulation', icon: '🧊', title: 'Thermal & Cold Insulation', sub: 'Mineral wool, PIR, Cellular Glass jacket' },
  { key: 'fireproof', icon: '🔥', title: 'Passive Fire Protection (PFP)', sub: 'Intumescent epoxy / Cementitious' },
  { key: 'special', icon: '⭐', title: 'Special Treatment', sub: 'Thermal Spray Aluminium (TSA) / FRP / FBE' },
  { key: 'galv', icon: '⚙️', title: 'Hot Dip Galvanizing', sub: 'Galvanizing & Duplex System' },
  { key: 'pickling', icon: '🧪', title: 'Pickling & Passivation', sub: 'Chemical cleaning for Stainless Steel' }
];

export const ABRASIVE_CONSUMPTION_RATES = {
  garnet: [
    { grade: 'New Steel Plate / Structure (Sa 2½)', kgPerM2: 12.5, desc: 'Virgin Garnet 30/60 mesh' },
    { grade: 'Heavy Pitted Steel / Rust Grade D (Sa 2½)', kgPerM2: 18.0, desc: 'Virgin Garnet 20/40 mesh' },
    { grade: 'White Metal Blast (Sa 3)', kgPerM2: 22.5, desc: 'Virgin Garnet 20/40 mesh' },
    { grade: 'Sweep / Brush-off Blast (Sa 1)', kgPerM2: 6.0, desc: 'Light sweep blast' }
  ],
  copper_slag: [
    { grade: 'New Steel Plate / Structure (Sa 2½)', kgPerM2: 18.0, desc: 'Disposable Copper Slag Grit' },
    { grade: 'Heavy Pitted Steel / Rust Grade D (Sa 2½)', kgPerM2: 25.0, desc: 'Heavy Copper Slag Grit' },
    { grade: 'White Metal Blast (Sa 3)', kgPerM2: 32.0, desc: 'Coarse Copper Slag Grit' },
    { grade: 'Sweep / Brush-off Blast (Sa 1)', kgPerM2: 9.0, desc: 'Light sweep blast' }
  ]
};

export const DEFAULT_EST_ROWS = [
  { type: 'cat', label: '1. BLASTING & SURFACE PREPARATION COST' },
  { type: 'row', desc: 'Plate & Structural Steel Blasting (ISO Sa 2½)', rate: 120, area: 0, src: 'prep', cat: 'blast' },
  { type: 'row', desc: 'Pipe Spool Final Blasting (Shop)', rate: 140, area: 0, src: 'prep', cat: 'blast' },
  { type: 'row', desc: 'Sweep / Brush-off Blasting (Galv / Duplex)', rate: 60, area: 0, src: 'prep', cat: 'blast' },
  { type: 'row', desc: 'Internal Vessel / Tank Shell Blasting (Sa 3)', rate: 180, area: 0, src: 'prep', cat: 'blast' },
  { type: 'row', desc: 'Tube ID / Internal Pipe Blasting', rate: 220, area: 0, src: 'prep', cat: 'blast' },
  { type: 'subtot', label: 'Sub-Total Blasting', cat: 'blast' },

  { type: 'cat', label: '2. RAW MATERIAL COST (PAINT & PRIMERS)' },
  { type: 'subtot', label: 'Sub-Total Raw Material (Paint)', cat: 'rawpaint' },

  { type: 'cat', label: '3. RAW MATERIAL COST (ABRASIVE MEDIA)' },
  { type: 'row', desc: 'Abrasive Media Cost (Garnet / Copper Slag)', rate: 90, area: 0, src: 'prep', cat: 'rawabr' },
  { type: 'subtot', label: 'Sub-Total Raw Material (Abrasive)', cat: 'rawabr' },

  { type: 'cat', label: '4. PAINT APPLICATION & LABOUR COST' },
  { type: 'subtot', label: 'Sub-Total Paint Application', cat: 'app' },

  { type: 'cat', label: '5. EQUIPMENT, POWER & CONSUMABLES' },
  { type: 'row', desc: 'Scaffolding & Access Platforms', rate: 45, area: 0, src: 'prep', cat: 'misc' },
  { type: 'row', desc: 'Diesel, Compressed Air & Generator Power', rate: 55, area: 0, src: 'prep', cat: 'misc' },
  { type: 'row', desc: 'Job Covering & Masking Protection', rate: 25, area: 0, src: 'prep', cat: 'misc' },
  { type: 'row', desc: 'Consumables (Masking Tape, Solvents, PPE, Rollers)', rate: 20, area: 0, src: 'prep', cat: 'misc' },
  { type: 'row', desc: 'Third Party QA/QC Inspection & Testing', rate: 15, area: 0, src: 'prep', cat: 'misc' },
  { type: 'subtot', label: 'Sub-Total Equipment & Consumables', cat: 'misc' },

  { type: 'cat', label: '6. COMMERCIAL MARKUPS & MARGIN' },
  { type: 'markup', label: 'Overhead & Administration Markup (%)', pct: 10, cat: 'overhead' },
  { type: 'markup', label: 'Unforeseen Contingency Margin (%)', pct: 5, cat: 'contingency' },
  { type: 'markup', label: 'Contractor Profit Margin (%)', pct: 15, cat: 'profit' },
  { type: 'subtot', label: 'Sub-Total Markups & Margin', cat: 'markup' },

  { type: 'grand', label: 'GRAND TOTAL — ESTIMATED PROJECT COMMERCIAL VALUE' }
];

export const UNIT_RATE_PRESETS = [
  {
    id: 'refinery_piping_package',
    name: 'Refinery Process Piping & Structures Package (C5-High)',
    estNo: 'EST-REF-2026-001',
    projectName: 'Petrochemical Expansion Phase-II Package',
    customer: 'National Refining & Petrochemicals Corp.',
    location: 'Coastal Industrial Complex',
    estimator: 'Senior Estimation Engineer',
    currency: 'INR',
    scope: { surfPaint: 'YES', insulation: 'NO', fireproof: 'NO', special: 'NO', galv: 'NO', pickling: 'NA' },
    specs: ['DEP-30.48.00.31-Gen (Coating of Steel Structures)', 'ISO 12944 Category C5-High Specification'],
    dRows: [
      { comp: 'Pipe Spools 6" - 24"', opT: '80', desT: '120', painting: 'YES', galv: 'NO', tsa: 'NA', ins: 'NO', fp: 'NO', surface: 'External' },
      { comp: 'Structural Pipe Racks & Beams', opT: '40', desT: '60', painting: 'YES', galv: 'NO', tsa: 'NA', ins: 'NO', fp: 'NO', surface: 'External' },
      { comp: 'Pressure Vessel Shell', opT: '95', desT: '150', painting: 'YES', galv: 'NO', tsa: 'NA', ins: 'NO', fp: 'NO', surface: 'Both' }
    ],
    fRows: [
      {
        coatFor: 'Pipe Spools 6" - 24" of External',
        surfPrep: 'ISO Sa 2½ (SSPC-SP10)',
        profile: '50-75 µm',
        primer: 'Zinc Rich Epoxy Primer',
        primerDft: '75',
        primerVs: 65,
        primerPrice: 450,
        inter: 'Epoxy High Build MIO',
        interDft: '150',
        interVs: 75,
        interPrice: 380,
        finish: 'Aliphatic Polyurethane Topcoat',
        finishDft: '50',
        finishVs: 60,
        finishPrice: 520,
        area: '2500'
      },
      {
        coatFor: 'Structural Pipe Racks & Beams of External',
        surfPrep: 'ISO Sa 2½ (SSPC-SP10)',
        profile: '50-75 µm',
        primer: 'Zinc Rich Epoxy Primer',
        primerDft: '75',
        primerVs: 65,
        primerPrice: 450,
        inter: 'Epoxy High Build MIO',
        interDft: '125',
        interVs: 75,
        interPrice: 380,
        finish: 'Aliphatic Polyurethane Topcoat',
        finishDft: '50',
        finishVs: 60,
        finishPrice: 520,
        area: '3800'
      },
      {
        coatFor: 'Pressure Vessel Shell of External',
        surfPrep: 'ISO Sa 2½ (SSPC-SP10)',
        profile: '50-75 µm',
        primer: 'Inorganic Zinc Silicate Primer',
        primerDft: '75',
        primerVs: 62,
        primerPrice: 480,
        inter: 'Epoxy High Build MIO',
        interDft: '150',
        interVs: 75,
        interPrice: 380,
        finish: 'Aliphatic Polyurethane Topcoat',
        finishDft: '50',
        finishVs: 60,
        finishPrice: 520,
        area: '1200'
      }
    ]
  },
  {
    id: 'offshore_jacket_package',
    name: 'Offshore Platform Marine Splashzone & Jacket (USD)',
    estNo: 'EST-OFF-2026-002',
    projectName: 'Deepwater Jacket & Topsides Fabrication',
    customer: 'Offshore Petroleum Exploration Co.',
    location: 'Deepwater Marine Yard',
    estimator: 'Commercial Tender Lead',
    currency: 'USD',
    scope: { surfPaint: 'YES', insulation: 'NO', fireproof: 'YES', special: 'YES', galv: 'NO', pickling: 'NA' },
    specs: ['NORSOK M-501 System 1 & System 7B', 'ISO 12944 Category CX Extreme Marine'],
    dRows: [
      { comp: 'Jacket Tubular Legs', opT: '25', desT: '50', painting: 'YES', galv: 'NO', tsa: 'NA', ins: 'NO', fp: 'NO', surface: 'External' },
      { comp: 'Splashzone Tubulars', opT: '30', desT: '60', painting: 'YES', galv: 'NO', tsa: 'YES', ins: 'NO', fp: 'NO', surface: 'External' }
    ],
    fRows: [
      {
        coatFor: 'Jacket Tubular Legs of External',
        surfPrep: 'ISO Sa 3 (SSPC-SP5)',
        profile: '75-100 µm',
        primer: 'Zinc Rich Epoxy Primer',
        primerDft: '75',
        primerVs: 65,
        primerPrice: 12.5,
        inter: 'Epoxy Glass Flake Heavy Duty',
        interDft: '300',
        interVs: 85,
        interPrice: 15.0,
        finish: 'Aliphatic Polyurethane Topcoat',
        finishDft: '50',
        finishVs: 60,
        finishPrice: 18.0,
        area: '5000'
      },
      {
        coatFor: 'Splashzone Tubulars of External',
        surfPrep: 'ISO Sa 3 (SSPC-SP5)',
        profile: '75-100 µm',
        primer: 'Epoxy Glass Flake Heavy Duty',
        primerDft: '400',
        primerVs: 85,
        primerPrice: 15.0,
        inter: 'Epoxy Glass Flake Heavy Duty',
        interDft: '400',
        interVs: 85,
        interPrice: 15.0,
        finish: 'Aliphatic Polyurethane Topcoat',
        finishDft: '60',
        finishVs: 60,
        finishPrice: 18.0,
        area: '1800'
      }
    ]
  }
];

export const INITIAL_UNITRATE_STATE = {
  // Section 1: Project Information
  estNo: '',
  projectName: '',
  customer: '',
  refNo: '',
  location: '',
  estimator: '',
  checkedBy: '',
  date: '',
  currency: 'INR',
  lossFactor: 30, // Default paint application loss %

  // Section 2: Scope Matrix
  scope: {
    surfPaint: 'YES',
    insulation: 'NA',
    fireproof: 'NA',
    special: 'NA',
    galv: 'NA',
    pickling: 'NA'
  },
  specs: [''],

  // Section 3: Section D — Temperature & Area Rows
  dRows: [
    { comp: 'Process Piping Spools', opT: '60', desT: '100', painting: 'YES', galv: 'NO', tsa: 'NA', ins: 'NO', fp: 'NO', surface: 'External' }
  ],

  // Section 4: Section F — Coating Systems Design
  fRows: [
    {
      coatFor: 'Process Piping Spools of External',
      surfPrep: 'ISO Sa 2½ (SSPC-SP10)',
      profile: '50-75 µm',
      primer: 'Zinc Rich Epoxy Primer',
      primerDft: '75',
      primerVs: 65,
      primerPrice: 450,
      inter: 'Epoxy High Build MIO',
      interDft: '125',
      interVs: 75,
      interPrice: 380,
      finish: 'Aliphatic Polyurethane Topcoat',
      finishDft: '50',
      finishVs: 60,
      finishPrice: 520,
      area: '1000'
    }
  ],

  // Section 5: Unit-Rate Estimation Table Rows
  estRows: JSON.parse(JSON.stringify(DEFAULT_EST_ROWS)),

  // Section 6: Revision History
  revisions: [
    { rev: '0', date: '', desc: 'Initial Estimation Take-off', prep: '', chk: '', app: '' }
  ],

  // Metadata
  draftId: null,
  status: 'Draft'
};
