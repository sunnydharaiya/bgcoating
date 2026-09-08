// src/data/inspectionDatabase.js
/**
 * BG GROUP — COATING INSPECTION, ADHESION TEST & PHOTO REPORTING DIGITAL SYSTEM
 * Industrial Standards: ISO 8501-1, ISO 8502-3/4/6/9, ISO 8503-1/4, ISO 19840, ISO 2808, ISO 4624, ISO 2409,
 * SSPC-PA 2, SSPC-SP 5/10/6/7, ASTM D4417, ASTM D4414, ASTM D7091, ASTM D3359, ASTM D4541, ASTM D5162, NACE / AMPP.
 */

// 1. Coating Inspection Stages
export const INSPECTION_STAGES = [
  { id: 's1', name: 'Blasting & Priming (B&P)', code: 'B&P', stageTitle: 'BLASTING & PRIMING INSPECTION REPORT' },
  { id: 's2', name: '1st Intermediate / Finish Coat', code: '1st Coat', stageTitle: '1ST INTERMEDIATE / FINISH COAT INSPECTION REPORT' },
  { id: 's3', name: '2nd Intermediate / Finish Coat', code: '2nd Coat', stageTitle: '2ND INTERMEDIATE / FINISH COAT INSPECTION REPORT' },
  { id: 's4', name: '3rd Finish / Topcoat', code: '3rd Coat', stageTitle: '3RD FINISH / TOPCOAT INSPECTION REPORT' }
];

// 2. Standard Dropdown Selection Options
export const SELECT_OPTIONS = {
  surfaceCleanliness: [
    "ISO 8501-1 (Sa 2½ - Near White Metal)",
    "ISO 8501-1 (Sa 3 - White Metal)",
    "ISO 8501-1 (Sa 2 - Commercial Blast)",
    "ISO 8501-1 (Sa 1 - Light Blast)",
    "SSPC-SP 5 / NACE 1 / AMPP SP 5 (White Metal)",
    "SSPC-SP 10 / NACE 2 / AMPP SP 10 (Near-White)",
    "SSPC-SP 6 / NACE 3 / AMPP SP 6 (Commercial)",
    "SSPC-SP 7 / NACE 4 / AMPP SP 7 (Brush-Off)",
    "ISO 8501-1 (St 3 - Power Tool Clean)",
    "ISO 8501-1 (St 2 - Hand Tool Clean)"
  ],
  surfaceProfile: [
    "ASTM D4417 Method B (Surface Profile Gauge)",
    "ASTM D4417 Method C (Replica Tape Press-O-Film)",
    "ASTM D4417 Method A (Visual / Comparator)",
    "ISO 8503-4 (Stylus Instrument / Replica Tape)",
    "ISO 8503-1 / 2 (Surface Profile Comparator)",
    "NACE SP0287 / AMPP SP0287"
  ],
  dustContamination: [
    "ISO 8502-3 Rating [Class 1 - Quantity 1]",
    "ISO 8502-3 Rating [Class 2 - Quantity 2]",
    "ISO 8502-3 Rating [Class 3 - Quantity 3]",
    "ISO 8502-3 Rating [Class 0 - No Dust Visible]"
  ],
  saltContamination: [
    "ISO 8502-6 / ISO 8502-9 (Bresle Patch Method)",
    "ISO 8502-6 (Bresle Extraction Conductivity)",
    "SSPC Guide 15 (Field Methods for Soluble Salts)",
    "NACE SP0508 / AMPP SP0508"
  ],
  oilGreaseTest: [
    "ASTM D4285 (Compressed Air Blotter Test)",
    "Solvent Rub Test (SSPC-SP 1)",
    "UV Fluorescent Inspection"
  ],
  wftMethod: [
    "ASTM D4414 (Comb / Notch Gauge)",
    "ISO 2808 Method 1A (Comb Gauge)",
    "ISO 2808 Method 1B (Wheel Gauge)",
    "SSPC-PA 2 Appendix"
  ],
  dftMethod: [
    "SSPC-PA 2 (Level 3 Standard Measurement)",
    "ISO 19840 (Measurement & Acceptance Criteria)",
    "ISO 2808 Method 6A (Magnetic / Eddy Current)",
    "ASTM D7091 (Dry Film Measurement)",
    "ASTM D6132 (Ultrasonic DFT Measurement for Concrete/Composites)"
  ],
  adhesionMethod: [
    "ASTM D4541 (Pull-Off Adhesion Hydraulic / Mechanical)",
    "ISO 4624 (Pull-Off Strength Test)",
    "ASTM D3359 Method B (Cross-Cut Tape Test ≤ 125 µm)",
    "ASTM D3359 Method A (X-Cut Tape Test > 125 µm)",
    "ISO 2409 (Cross-Cut Test)"
  ],
  holidayMethod: [
    "NACE SP0188 (Discontinuity / Holiday Testing of New Protective Coatings)",
    "ASTM D5162 (High Voltage Spark Testing)",
    "ASTM D5162 (Low Voltage Wet Sponge Testing)",
    "ISO 29601 (Corrosion Protection - High Voltage)"
  ],
  cureHardness: [
    "ASTM D4752 (MEK Rub Test for Zinc Silicate Primer)",
    "ASTM D5402 (Solvent Rub Resistance of Organic Coatings)",
    "ASTM D3363 (Pencil Hardness Test)",
    "ASTM D2240 (Shore D Durometer Hardness)"
  ],
  abrasiveTypes: [
    "Garnet GMA 30/60 Mesh",
    "Garnet GMA 80 Mesh",
    "Copper Slag (0.2 - 2.8 mm)",
    "Steel Grit G40 / G50",
    "Steel Shots S280 / S330",
    "Aluminium Oxide (Fused Alumina)",
    "Chilled Iron Grit",
    "Glass Beads (Satin Finish)",
    "Platinum Grit"
  ],
  applicationMethods: [
    "AIRLESS SPRAY",
    "Conventional Air Spray",
    "Air-Assisted Airless Spray",
    "Brush Application",
    "Roller Application",
    "Plural Component Spray",
    "HVLP (High Volume Low Pressure)"
  ],
  manufacturers: [
    "AkzoNobel (International Paint)",
    "Jotun",
    "Hempel",
    "PPG Industries / Sigma Coatings",
    "Sherwin-Williams",
    "Asian Paints Ltd",
    "Berger Paints India Ltd",
    "Kansai Nerolac Paints Ltd",
    "Carboline Company",
    "JSW Paints Ltd",
    "Nippon Paint",
    "Shalimar Paints Ltd",
    "Tnemec",
    "OTHERS"
  ],
  genericTypes: [
    "Inorganic Zinc Silicate Primer",
    "Organic Zinc Rich Epoxy Primer",
    "Epoxy Zinc Phosphate Primer",
    "Red Oxide Primer",
    "Epoxy High Build MIO",
    "Surface Tolerant Epoxy",
    "Epoxy Glass Flake",
    "Epoxy Phenolic / Novolac",
    "Aliphatic Polyurethane (PU)",
    "Acrylic Polyurethane",
    "Polysiloxane",
    "High Temperature Silicone Aluminium",
    "Thermal Spray Aluminium (TSA)",
    "Solventless Epoxy Lining",
    "Intumescent Epoxy PFP"
  ],
  reworkDefects: [
    { code: "RWK-01", name: "Low DFT (< 80% Specified NDFT)", severity: "high", icon: "📉" },
    { code: "RWK-02", name: "High DFT (> 120% Maximum Allowable)", severity: "medium", icon: "📈" },
    { code: "RWK-03", name: "Holidays / Pinholes / Discontinuities", severity: "high", icon: "⚡" },
    { code: "RWK-04", name: "Runs, Sags & Curtaining", severity: "medium", icon: "💧" },
    { code: "RWK-05", name: "Blistering / Osmotic Pockets", severity: "high", icon: "🫧" },
    { code: "RWK-06", name: "Delamination / Inter-coat Adhesion Failure", severity: "high", icon: "🧱" },
    { code: "RWK-07", name: "Dust / Abrasive Particle Contamination", severity: "low", icon: "🌪️" },
    { code: "RWK-08", name: "Orange Peel / Excessive Texture", severity: "low", icon: "🍊" },
    { code: "RWK-09", name: "Dry Spray / Overspray Fallout", severity: "low", icon: "💨" },
    { code: "RWK-10", name: "Under-cured / Inadequate Induction or Drying", severity: "high", icon: "⏳" },
    { code: "RWK-11", name: "Flash Rusting Before Primer Application", severity: "high", icon: "🟧" },
    { code: "RWK-12", name: "Color / Gloss / Shade Non-Uniformity", severity: "low", icon: "🎨" },
    { code: "RWK-13", name: "Inadequate Stripe Coating on Welds/Edges", severity: "medium", icon: "🖌️" }
  ]
};

// 3. 1-Click Industry Presets
export const INDUSTRY_PRESETS = [
  {
    id: 'offshore_c5m',
    title: 'Offshore Marine C5-M / CX 3-Coat System',
    description: 'ISO 12944-5 High Durability System for Marine & Offshore Structures',
    systemNDFT: 320,
    stages: {
      s1: {
        stageName: 'Blasting & Priming',
        abrasive: 'Garnet GMA 30/60 Mesh',
        mesh: '30/60 Mesh',
        cleanliness: 'ISO 8501-1 (Sa 2½ - Near White Metal)',
        cleanlinessReq: 'Sa 2.5 min, free of oil & mill scale',
        profile: 'ASTM D4417 Method B (Surface Profile Gauge)',
        profileReq: '50 – 75 µm anchor pattern',
        saltReq: '< 20 mg/m² (Bresle method)',
        paintMfr: 'Jotun',
        paintName: 'Barrier 80 (Zinc Rich Epoxy)',
        ral: 'Grey (Mfr Std)',
        batchA: 'JT-B80-7712',
        batchB: 'JT-B80-7713',
        expA: '2027-08-30',
        expB: '2027-08-30',
        dftMin: 60,
        dftMax: 80,
        area: 120,
        paintConsumed: 22
      },
      s2: {
        stageName: '1st Intermediate Coat',
        paintMfr: 'Jotun',
        paintName: 'Penguard MIO (Epoxy MIO High Build)',
        ral: 'MIO Grey',
        batchA: 'JT-PMIO-4421',
        batchB: 'JT-PMIO-4422',
        expA: '2027-08-30',
        expB: '2027-08-30',
        dftMin: 140,
        dftMax: 180,
        area: 120,
        paintConsumed: 38
      },
      s3: {
        stageName: '2nd / Topcoat Finish',
        paintMfr: 'Jotun',
        paintName: 'Hardtop AX (Aliphatic Acrylic Polyurethane)',
        ral: 'RAL 9010 (Pure White)',
        batchA: 'JT-HTAX-9910',
        batchB: 'JT-HTAX-9911',
        expA: '2027-08-30',
        expB: '2027-08-30',
        dftMin: 50,
        dftMax: 70,
        area: 120,
        paintConsumed: 18
      }
    }
  },
  {
    id: 'tank_internal',
    title: 'Crude Oil Storage Tank Internal Lining (2-Coat Epoxy Novolac)',
    description: 'High chemical and immersion resistance per NACE SP0198 / API 652',
    systemNDFT: 300,
    stages: {
      s1: {
        stageName: 'Blasting & Priming',
        abrasive: 'Garnet GMA 30/60 Mesh',
        mesh: '30/60 Mesh',
        cleanliness: 'ISO 8501-1 (Sa 3 - White Metal)',
        cleanlinessReq: 'Sa 3.0 100% white metal',
        profile: 'ASTM D4417 Method C (Replica Tape Press-O-Film)',
        profileReq: '75 – 100 µm profile',
        saltReq: '< 10 mg/m²',
        paintMfr: 'AkzoNobel (International Paint)',
        paintName: 'Interline 850 (Epoxy Novolac Tank Lining)',
        ral: 'Light Grey',
        batchA: 'AKZ-850-101',
        batchB: 'AKZ-850-102',
        expA: '2027-06-30',
        expB: '2027-06-30',
        dftMin: 125,
        dftMax: 175,
        area: 250,
        paintConsumed: 65
      },
      s2: {
        stageName: '1st Intermediate / Final Lining',
        paintMfr: 'AkzoNobel (International Paint)',
        paintName: 'Interline 850 (Epoxy Novolac Tank Lining)',
        ral: 'White',
        batchA: 'AKZ-850-201',
        batchB: 'AKZ-850-202',
        expA: '2027-06-30',
        expB: '2027-06-30',
        dftMin: 125,
        dftMax: 175,
        area: 250,
        paintConsumed: 62
      }
    }
  },
  {
    id: 'structural_steel_c4',
    title: 'Industrial Plant Structural Steel C4 Industrial',
    description: 'Inorganic Zinc Silicate + Epoxy High Build + Polyurethane Finish',
    systemNDFT: 275,
    stages: {
      s1: {
        stageName: 'Blasting & Priming',
        abrasive: 'Copper Slag (0.2 - 2.8 mm)',
        mesh: 'G40 Mesh',
        cleanliness: 'ISO 8501-1 (Sa 2½ - Near White Metal)',
        cleanlinessReq: 'Sa 2.5 Near-White',
        profile: 'ASTM D4417 Method B (Surface Profile Gauge)',
        profileReq: '50 – 75 µm anchor pattern',
        saltReq: '< 30 mg/m²',
        paintMfr: 'Asian Paints Ltd',
        paintName: 'Apcodur Zinc Silicate Primer',
        ral: 'Grey',
        batchA: 'AP-ZSP-5501',
        batchB: 'AP-ZSP-5502',
        expA: '2027-05-15',
        expB: '2027-05-15',
        dftMin: 65,
        dftMax: 75,
        area: 180,
        paintConsumed: 32
      },
      s2: {
        stageName: '1st Intermediate Coat',
        paintMfr: 'Asian Paints Ltd',
        paintName: 'Apcodur High Build Epoxy MIO',
        ral: 'Dark Grey',
        batchA: 'AP-MIO-7701',
        batchB: 'AP-MIO-7702',
        expA: '2027-05-15',
        expB: '2027-05-15',
        dftMin: 125,
        dftMax: 160,
        area: 180,
        paintConsumed: 45
      },
      s3: {
        stageName: '2nd / Topcoat Finish',
        paintMfr: 'Asian Paints Ltd',
        paintName: 'Apcocthane PU Finish',
        ral: 'RAL 5015 (Sky Blue)',
        batchA: 'AP-PU-9901',
        batchB: 'AP-PU-9902',
        expA: '2027-05-15',
        expB: '2027-05-15',
        dftMin: 45,
        dftMax: 60,
        area: 180,
        paintConsumed: 20
      }
    }
  }
];

// 4. Psychrometric & Weather Calculation Functions
/**
 * Calculates psychrometric weather values:
 * @param {number} dryC - Dry Bulb Temperature in °C
 * @param {number} wetC - Wet Bulb Temperature in °C
 * @param {number} metalC - Steel Surface Temperature in °C
 * @returns {object} { rhPct, dewPointC, diffC, isOk, reason }
 */
export function calculatePsychrometrics(dryC, wetC, metalC) {
  const dry = parseFloat(dryC);
  const wet = parseFloat(wetC);
  const metal = parseFloat(metalC);

  if (isNaN(dry) || isNaN(wet)) {
    return { rhPct: null, dewPointC: null, diffC: null, isOk: null, reason: 'Pending Readings' };
  }

  // Atmospheric pressure standard hPa
  const P = 1013.25;

  // Saturation vapor pressures (Magnus-Tetens)
  const Ew = 6.112 * Math.exp((17.502 * wet) / (240.97 + wet));
  const Ed = 6.112 * Math.exp((17.502 * dry) / (240.97 + dry));

  // Actual vapor pressure with psychrometer coefficient
  const A = 0.00066 * (1 + 0.00115 * wet);
  const E = Math.max(0.001, Ew - A * P * (dry - wet));

  // Relative Humidity (%)
  let rh = (E / Ed) * 100;
  rh = Math.max(1, Math.min(100, rh));

  // Dew Point Temperature (°C)
  const logE = Math.log(E / 6.112);
  const dp = (240.97 * logE) / (17.502 - logE);

  // Metal Temperature Margin ΔT = T_metal - T_dewpoint
  let diff = null;
  let isOk = false;
  let reason = '';

  if (!isNaN(metal)) {
    diff = metal - dp;
    const isRhOk = rh <= 85.0;
    const isDiffOk = diff >= 3.0;

    if (isRhOk && isDiffOk) {
      isOk = true;
      reason = 'Compliant: RH ≤ 85% & ΔT ≥ 3.0°C';
    } else {
      isOk = false;
      const issues = [];
      if (!isRhOk) issues.push(`High RH (${rh.toFixed(1)}% > 85%)`);
      if (!isDiffOk) issues.push(`Low ΔT (${diff.toFixed(1)}°C < 3.0°C)`);
      reason = `Non-Compliant: ${issues.join(', ')}`;
    }
  } else {
    isOk = rh <= 85.0;
    reason = isOk ? 'RH OK (Steel Temp Missing)' : `High RH (${rh.toFixed(1)}% > 85%)`;
  }

  return {
    rhPct: Number(rh.toFixed(1)),
    dewPointC: Number(dp.toFixed(1)),
    diffC: diff !== null ? Number(diff.toFixed(1)) : null,
    isOk,
    reason
  };
}

// 5. Initial Sample 24-Hour Weather Table Data
export function createDefaultWeatherSlots(baseDry = 28, baseWet = 22, baseMetal = 30) {
  return Array.from({ length: 24 }, (_, i) => {
    // Generate active daytime monitored slots (08:00 - 18:00)
    const isMonitored = i >= 8 && i <= 18;
    const dry = isMonitored ? baseDry + (i % 4) * 0.5 : '';
    const wet = isMonitored ? baseWet + (i % 3) * 0.4 : '';
    const metal = isMonitored ? baseMetal + (i % 5) * 0.6 : '';

    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      dryC: dry !== '' ? String(dry) : '',
      wetC: wet !== '' ? String(wet) : '',
      metalC: metal !== '' ? String(metal) : ''
    };
  });
}

// 6. Default Clean Inspection State Initializer
export function createInitialInspectionState() {
  return {
    reportNo: '',
    date: '',
    projectNo: '',
    itemDetails: '',
    workLocation: '',
    projectName: '',
    refDoc: '',
    customer: '',
    vendor: '',
    woNo: '',
    equipment: '',
    leadInspector: '',
    leadCert: '',
    tpiInspector: '',
    tpiAgency: '',

    // Stage Records: s1 (B&P), s2 (1st Coat), s3 (2nd Coat), s4 (3rd Coat)
    stages: {
      s1: {
        stageId: 's1',
        stageName: 'Blasting & Priming (B&P)',
        reportNo: '',
        date: '',
        projectNo: '',
        itemDetails: '',
        workLocation: '',
        projectName: '',
        refDoc: '',
        customer: '',
        vendor: '',
        woNo: '',
        equipment: '',
        stageTitle: 'Blasting & Priming',
        weatherSlots: createDefaultWeatherSlots(28.5, 21.0, 31.5),
        surfacePrep: {
          abrasiveType: 'Garnet GMA 30/60 Mesh',
          meshSize: '30/60 Mesh',
          nozzlePressurePsi: '100',
          compressorCfm: '375',
          blastingTimeSlot: '11:00',
          surfaceAreaM2: '120'
        },
        surfacePrepTests: [
          {
            id: 'sp_1',
            testName: 'Visual Surface Cleanliness',
            stdRef: 'ISO 8501-1 (Sa 2½ - Near White Metal)',
            req: 'Sa 2.5 Near-White Blast',
            actual: 'Sa 2.5 Achieved 100%',
            verdict: 'PASS'
          },
          {
            id: 'sp_2',
            testName: 'Surface Profile (Anchor Pattern)',
            stdRef: 'ASTM D4417 Method B (Surface Profile Gauge)',
            req: '50 – 75 µm anchor profile',
            actual: '64.5 µm (Mean of 10 spots)',
            verdict: 'PASS'
          },
          {
            id: 'sp_3',
            testName: 'Dust Contamination (Tape Test)',
            stdRef: 'ISO 8502-3 Rating [Class 1 - Quantity 1]',
            req: 'Class 1 / Quantity 1 maximum',
            actual: 'Class 1 Rating (Clean)',
            verdict: 'PASS'
          },
          {
            id: 'sp_4',
            testName: 'Soluble Salt Contamination',
            stdRef: 'ISO 8502-6 / ISO 8502-9 (Bresle Patch Method)',
            req: '< 20 mg/m² soluble chloride',
            actual: '11.8 mg/m²',
            verdict: 'PASS'
          }
        ],
        prepPhotos: [],
        coatingApp: {
          method: 'AIRLESS SPRAY',
          stripeCoat: 'YES',
          visibleRust: 'NO',
          coatingStartTime: '12:00',
          coatingEndTime: '14:00',
          appDate: ''
        },
        paintDetails: {
          manufacturer: 'Jotun',
          productName: 'Barrier 80 (Zinc Rich Epoxy)',
          shadeRal: 'Grey / Standard',
          batchA: 'JT-B80-7712',
          expA: '2027-08-30',
          statusA: 'OK',
          batchB: 'JT-B80-7713',
          expB: '2027-08-30',
          statusB: 'OK',
          batchC: '',
          expC: '',
          statusC: 'NA',
          consumedLitres: '24'
        },
        coatingTests: [
          {
            id: 'ct_1',
            testName: 'Wet Film Thickness (WFT)',
            stdRef: 'ASTM D4414 (Comb / Notch Gauge)',
            req: '110 – 140 µm WFT',
            actual: '125 µm measured during application',
            verdict: 'PASS'
          },
          {
            id: 'ct_2',
            testName: 'Dry Film Thickness (DFT)',
            stdRef: 'SSPC-PA 2 (Level 3 Standard Measurement)',
            req: 'NDFT 75 µm (60 – 90 µm bounds)',
            actual: '74.2 µm average',
            verdict: 'PASS'
          }
        ],
        coatingPhotos: [],
        dftRecord: {
          minDft: 60,
          maxDft: 90,
          inspectionAreaM2: 120,
          locations: [
            {
              id: 'loc_1',
              name: 'Shell Course #1 - North',
              spots: [72, 75, 78, 80, 74, 76, 73, 79, 77, 75]
            },
            {
              id: 'loc_2',
              name: 'Shell Course #1 - South',
              spots: [70, 74, 76, 78, 72, 75, 71, 77, 73, 76]
            }
          ]
        },
        remarks: 'Surface preparation inspected and accepted prior to primer application. WFT and DFT verified per SSPC-PA 2 Level 3.',
        signApplicator: { name: 'Prakash Ramavat', date: '', sign: 'P. Ramavat' },
        signTpi: { name: 'N. V. Dave (TPI / EIL)', date: '', sign: 'N.V. Dave' }
      },

      s2: {
        stageId: 's2',
        stageName: '1st Intermediate / Finish Coat',
        reportNo: '',
        date: '',
        projectNo: '',
        itemDetails: '',
        workLocation: '',
        projectName: '',
        refDoc: '',
        customer: '',
        vendor: '',
        woNo: '',
        equipment: '',
        stageTitle: '1st Intermediate Coat',
        weatherSlots: createDefaultWeatherSlots(29.0, 21.5, 32.0),
        coatingApp: {
          method: 'AIRLESS SPRAY',
          stripeCoat: 'YES',
          visibleRust: 'NO',
          coatingStartTime: '09:00',
          coatingEndTime: '12:00',
          appDate: ''
        },
        paintDetails: {
          manufacturer: 'Jotun',
          productName: 'Penguard MIO (Epoxy MIO High Build)',
          shadeRal: 'MIO Grey',
          batchA: 'JT-MIO-8821',
          expA: '2027-08-30',
          statusA: 'OK',
          batchB: 'JT-MIO-8822',
          expB: '2027-08-30',
          statusB: 'OK',
          batchC: '',
          expC: '',
          statusC: 'NA',
          consumedLitres: '42'
        },
        coatingTests: [
          {
            id: 'ct_s2_1',
            testName: 'Wet Film Thickness (WFT)',
            stdRef: 'ASTM D4414 (Comb / Notch Gauge)',
            req: '200 – 250 µm WFT',
            actual: '225 µm measured',
            verdict: 'PASS'
          },
          {
            id: 'ct_s2_2',
            testName: 'Dry Film Thickness (Cumulative DFT)',
            stdRef: 'SSPC-PA 2 (Level 3 Standard Measurement)',
            req: 'Cumulative 200 – 250 µm (Primer + Inter)',
            actual: '228.4 µm average',
            verdict: 'PASS'
          }
        ],
        coatingPhotos: [],
        dftRecord: {
          minDft: 200,
          maxDft: 250,
          inspectionAreaM2: 120,
          locations: [
            {
              id: 'loc_s2_1',
              name: 'Shell Course #1 - North',
              spots: [220, 225, 230, 228, 224, 232, 226, 235, 229, 227]
            },
            {
              id: 'loc_s2_2',
              name: 'Shell Course #1 - South',
              spots: [218, 222, 228, 230, 224, 226, 221, 234, 227, 225]
            }
          ]
        },
        remarks: '1st intermediate coat applied within recoat interval. Stripe coating applied to all weld seams.',
        signApplicator: { name: 'Prakash Ramavat', date: '', sign: 'P. Ramavat' },
        signTpi: { name: 'N. V. Dave (TPI / EIL)', date: '', sign: 'N.V. Dave' }
      },

      s3: {
        stageId: 's3',
        stageName: '2nd Intermediate / Finish Coat',
        reportNo: '',
        date: '',
        projectNo: '',
        itemDetails: '',
        workLocation: '',
        projectName: '',
        refDoc: '',
        customer: '',
        vendor: '',
        woNo: '',
        equipment: '',
        stageTitle: '2nd Intermediate / Topcoat',
        weatherSlots: createDefaultWeatherSlots(29.5, 22.0, 32.5),
        coatingApp: {
          method: 'AIRLESS SPRAY',
          stripeCoat: 'NO',
          visibleRust: 'NO',
          coatingStartTime: '10:00',
          coatingEndTime: '13:00',
          appDate: ''
        },
        paintDetails: {
          manufacturer: 'Jotun',
          productName: 'Hardtop AX (Aliphatic Acrylic Polyurethane)',
          shadeRal: 'RAL 9010 (Pure White)',
          batchA: 'JT-AX-3310',
          expA: '2027-09-15',
          statusA: 'OK',
          batchB: 'JT-AX-3311',
          expB: '2027-09-15',
          statusB: 'OK',
          batchC: '',
          expC: '',
          statusC: 'NA',
          consumedLitres: '20'
        },
        coatingTests: [
          {
            id: 'ct_s3_1',
            testName: 'Final Total System DFT',
            stdRef: 'SSPC-PA 2 / ISO 19840',
            req: 'Total System NDFT ≥ 320 µm',
            actual: '334.8 µm average',
            verdict: 'PASS'
          },
          {
            id: 'ct_s3_2',
            testName: 'Holiday Spark Testing',
            stdRef: 'NACE SP0188 (High Voltage Spark Test)',
            req: 'Zero holidays / pinholes @ 1.8 kV',
            actual: '100% surface tested — 0 holidays',
            verdict: 'PASS'
          }
        ],
        coatingPhotos: [],
        dftRecord: {
          minDft: 290,
          maxDft: 360,
          inspectionAreaM2: 120,
          locations: [
            {
              id: 'loc_s3_1',
              name: 'Shell Course #1 - North',
              spots: [325, 332, 340, 335, 328, 338, 330, 342, 336, 334]
            }
          ]
        },
        remarks: 'Topcoat application completed. Full curing achieved with uniform gloss and color match.',
        signApplicator: { name: 'Prakash Ramavat', date: '', sign: 'P. Ramavat' },
        signTpi: { name: 'N. V. Dave (TPI / EIL)', date: '', sign: 'N.V. Dave' }
      },

      s4: {
        stageId: 's4',
        stageName: '3rd Finish / Topcoat',
        reportNo: '',
        date: '',
        projectNo: '',
        itemDetails: '',
        workLocation: '',
        projectName: '',
        refDoc: '',
        customer: '',
        vendor: '',
        woNo: '',
        equipment: '',
        stageTitle: '3rd Finish / Topcoat',
        weatherSlots: createDefaultWeatherSlots(28.0, 21.0, 30.0),
        coatingApp: {
          method: 'AIRLESS SPRAY',
          stripeCoat: 'NO',
          visibleRust: 'NO',
          coatingStartTime: '',
          coatingEndTime: '',
          appDate: ''
        },
        paintDetails: {
          manufacturer: '',
          productName: '',
          shadeRal: '',
          batchA: '',
          expA: '',
          statusA: 'PENDING',
          batchB: '',
          expB: '',
          statusB: 'PENDING',
          batchC: '',
          expC: '',
          statusC: 'NA',
          consumedLitres: ''
        },
        coatingTests: [],
        coatingPhotos: [],
        dftRecord: {
          minDft: 0,
          maxDft: 0,
          inspectionAreaM2: 0,
          locations: []
        },
        remarks: '',
        signApplicator: { name: '', date: '', sign: '' },
        signTpi: { name: '', date: '', sign: '' }
      }
    },

    // 5-Column Photographic Report
    photoReport: [
      {
        id: 'ph_1',
        testName: 'Surface Cleanliness (Blasting Inspection)',
        stdRef: 'ISO 8501-1 (Sa 2½)',
        photos: [],
        comments: '100% near-white blast cleanliness verified before primer.',
        verdict: 'PASS'
      },
      {
        id: 'ph_2',
        testName: 'Surface Anchor Profile (Replica Tape)',
        stdRef: 'ASTM D4417 Method C',
        photos: [],
        comments: 'Profile gauge reads 68 µm anchor pattern on grit blasted steel.',
        verdict: 'PASS'
      },
      {
        id: 'ph_3',
        testName: 'Stripe Coating on Welds & Edges',
        stdRef: 'SSPC-PA 2 / Project Spec',
        photos: [],
        comments: 'Stripe coating by brush on all structural sharp edges and weld beads.',
        verdict: 'PASS'
      },
      {
        id: 'ph_4',
        testName: 'Wet Film Thickness (WFT) Verification',
        stdRef: 'ASTM D4414 Comb Gauge',
        photos: [],
        comments: 'WFT comb gauge check showing 225 µm wet thickness.',
        verdict: 'PASS'
      },
      {
        id: 'ph_5',
        testName: 'Dry Film Thickness (DFT) Spot Measurement',
        stdRef: 'SSPC-PA 2 / ISO 19840',
        photos: [],
        comments: 'Electronic Positector 6000 probe recording multi-point spot readings.',
        verdict: 'PASS'
      },
      {
        id: 'ph_6',
        testName: 'Pull-Off Adhesion Dolly Fracture Face',
        stdRef: 'ASTM D4541 Type IV Hydraulic',
        photos: [],
        comments: 'Dolly pull fracture displaying 100% cohesive failure at 12.4 MPa.',
        verdict: 'PASS'
      },
      {
        id: 'ph_7',
        testName: 'Cross-Cut Tape Lattice Test',
        stdRef: 'ASTM D3359 Method B',
        photos: [],
        comments: 'Cross-cut 6x6 lattice grid showing 0% flaking (Classification 5B).',
        verdict: 'PASS'
      },
      {
        id: 'ph_8',
        testName: 'High Voltage Holiday Spark Testing',
        stdRef: 'NACE SP0188',
        photos: [],
        comments: 'High voltage holiday detector sweeping tank shell @ 1.8 kV.',
        verdict: 'PASS'
      }
    ],

    // Pull-Off Adhesion Test Suite (ASTM D4541 / ISO 4624)
    pullOffAdhesion: {
      gaugeModel: 'DeFelsko PosiTest AT-A (Automatic Hydraulic)',
      dollySizeMm: '20',
      specifiedTargetMpa: 8.0,
      glueType: 'Araldite 2011 (2-Component Epoxy Adhesive)',
      cureTimeHrs: '24',
      substrateMoc: 'Carbon Steel SA 516 Gr.70 (12 mm thk)',
      dollies: [
        { id: 'd_1', loc: 'Tank Shell Course #1 - North', pressureMpa: 11.8, mode: '100% Cohesive within Primer A', gluePct: 0, verdict: 'PASS' },
        { id: 'd_2', loc: 'Tank Shell Course #1 - East', pressureMpa: 12.4, mode: '100% Cohesive within Primer A', gluePct: 0, verdict: 'PASS' },
        { id: 'd_3', loc: 'Tank Shell Course #1 - South', pressureMpa: 10.9, mode: '90% Cohesive A / 10% Adhesive A/B', gluePct: 0, verdict: 'PASS' },
        { id: 'd_4', loc: 'Tank Shell Course #1 - West', pressureMpa: 11.5, mode: '100% Cohesive within Primer A', gluePct: 0, verdict: 'PASS' }
      ],
      photos: []
    },

    // Cross-Cut Adhesion Test Suite (ASTM D3359 / ISO 2409)
    crossCutAdhesion: {
      cutterType: 'Cross-Hatch Multi-Blade Cutter (6-Blades)',
      bladeSpacingMm: '2.0',
      tapeType: 'Permacel 99 / Tesa 4651 Pressure-Sensitive Tape',
      specifiedMinRating: '4B (ISO Class 1)',
      cuts: [
        { id: 'cc_1', loc: 'Shell Course #1 - North', rating: '5B (ISO Class 0)', flakingPct: 0, desc: 'Edges of cuts are completely smooth; none of the squares of the lattice is detached.', verdict: 'PASS' },
        { id: 'cc_2', loc: 'Shell Course #1 - South', rating: '5B (ISO Class 0)', flakingPct: 0, desc: 'Edges of cuts are completely smooth; none of the squares of the lattice is detached.', verdict: 'PASS' },
        { id: 'cc_3', loc: 'Shell Course #1 - West', rating: '4B (ISO Class 1)', flakingPct: 3, desc: 'Small flakes of the coating are detached at intersections; less than 5% of area affected.', verdict: 'PASS' }
      ],
      photos: []
    },

    // Rework & Non-Conformance Log (PRO)
    reworkLog: [
      {
        id: 'NCR-2026-001',
        date: '2026-08-28',
        stage: 's1',
        stageName: 'Blasting & Priming',
        location: 'Tank Shell Course #1 - Weld Seam W-04',
        defectCode: 'RWK-01',
        defectName: 'Low DFT (< 80% Specified NDFT)',
        areaM2: 2.5,
        desc: 'DFT measured 45 µm on weld toe (Specified minimum is 60 µm).',
        rootCause: 'Manual spray shadow effect along irregular weld seam geometry.',
        correctiveAction: 'Feather edges with 80-mesh sandpaper, clean with solvent wipe, and apply touch-up stripe coat.',
        status: 'Closed',
        photosBefore: [],
        photosAfter: [],
        closeoutDate: '2026-08-29',
        inspector: 'Prakash Ramavat'
      },
      {
        id: 'NCR-2026-002',
        date: '2026-08-29',
        stage: 's2',
        stageName: '1st Intermediate Coat',
        location: 'Shell Course #1 - Bottom Chime Area',
        defectCode: 'RWK-04',
        defectName: 'Runs, Sags & Curtaining',
        areaM2: 0.8,
        desc: 'Localized paint sag along bottom chime plate vertical face.',
        rootCause: 'Excessive gun overlap and high fluid delivery pressure during manual spray.',
        correctiveAction: 'Allow paint to cure, scrape and sand smooth, clean and re-apply intermediate mist coat.',
        status: 'Rectified',
        photosBefore: [],
        photosAfter: [],
        closeoutDate: '',
        inspector: 'Prakash Ramavat'
      }
    ]
  };
}
