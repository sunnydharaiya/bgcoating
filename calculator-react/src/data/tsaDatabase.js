/**
 * BG GROUP — TSA (Thermal Spray Aluminium) Operator Qualification Database & Math Engine
 * Twin Wire Arc / Thermal Spray Digital Management System
 * Reference Standards: NACE No.12 / AWS C2.23M / SSPC-CS 23.00, AWS C2.16 / C2.16M, ISO 2063-2, SSPC-PA 2, ASTM D4541
 */

// 12 Practical Assessment Elements for Thermal Spray Operators (AWS C2.23M / ISO 2063-2)
export const TSA_CHECKLIST_ELEMENTS = [
  "Knowledge of TSA process principles, corrosion protection mechanism, and TSA system components",
  "Ability to identify and verify TSA equipment components, wire feed system, power source, air supply, and spray gun setup",
  "Understanding of surface preparation requirements including SSPC-SP10/SP5, anchor profile requirements (minimum 65 µm sharp angular profile), and surface cleanliness standards",
  "Ability to verify environmental conditions including air temperature, steel temperature, relative humidity, dew point, and holding period requirements before spraying",
  "Ability to setup, calibrate, operate, and troubleshoot Arc Spray/TSA equipment according to approved procedure and manufacturer's recommendations",
  "Demonstrate correct spray gun manipulation including spray angle, stand-off distance, travel speed, overlap pattern, and crossing pass technique",
  "Ability to achieve specified TSA coating thickness through multiple crossing passes while avoiding excessive build-up, shadowing, and thin areas",
  "Understanding of TSA coating acceptance criteria including uniform appearance, absence of blistering, cracks, delamination, exposed steel, and loose particles",
  "Knowledge and practical use of coating inspection instruments including DFT gauge, surface profile gauge, dew point meter, and visual inspection tools",
  "Awareness of TSA qualification tests including Bend Test, Pull-Off Adhesion Test (ASTM D4541), Companion Coupon evaluation, and repair procedures",
  "Knowledge of sealer application requirements, sealing time limitations, compatibility requirements, and TSA repair methodology",
  "Demonstrates safe working practices including handling of compressed air systems, electrical equipment, wire materials, dust/fume exposure control, PPE usage, and worksite safety compliance"
];

// 10 Thermal Spray Material Details Default Rows (PDF Page 2)
export const TSA_MAT_DEFAULTS = [
  { desc: "Wire Material Description", detail: "Thermal Spray Aluminum (TSA)" },
  { desc: "Material Specification",    detail: "AWS C2.25 / ISO 14919 / Project Specification" },
  { desc: "Material Grade",            detail: "Aluminum 99.5% Minimum Purity" },
  { desc: "Material Designation",      detail: "Al 99.5 / EC Grade Aluminum" },
  { desc: "Manufacturer Name",         detail: "Castolin Eutectic / Metallisation Ltd" },
  { desc: "Manufacturer Country",      detail: "United Kingdom / Germany" },
  { desc: "Batch / Lot Number",        detail: "TSA-AL-2026-B8841" },
  { desc: "Wire Diameter",             detail: "2.3 mm (Also 1.6 mm / 3.17 mm)" },
  { desc: "Certificate Number",        detail: "MTC-AL995-2026-904" },
  { desc: "Purity (%)",                detail: "≥ 99.5% Al" }
];

// 9 Thermal Spray Application Parameters Default Rows (PDF Page 7)
export const TSA_APP_DEFAULTS = [
  { param: "Arc Voltage Verification",            record: "28 – 34 V (Measured at Arc Head: 31.5 V)" },
  { param: "Arc Current Verification",            record: "180 – 240 A (Steady operating current: 215 A)" },
  { param: "Atomizing Air Pressure Verification", record: "5.5 – 6.5 Bar (Dry instrument air: 6.0 Bar)" },
  { param: "Wire Feed Rate Verification",         record: "5.2 – 6.8 m/min (Calibrated twin-drive: 6.0 m/min)" },
  { param: "Spray Distance Verification",         record: "150 – 200 mm Gun-to-Substrate Standoff" },
  { param: "Spray Angle Verification",            record: "85° – 90° Perpendicular Spray Angle Maintained" },
  { param: "Cross-Hatch Spray Pattern Verification", record: "50% Overlap with 90° Cross-Hatch Passes" },
  { param: "Coating Visual Appearance",           record: "Uniform, fine metallic texture; zero spattering, cracks, or blistering" },
  { param: "Uncoated Area Inspection",            record: "100% Coverage; zero shadowing behind flanges and stiffeners" }
];

// 19 Comprehensive TSA & Coating Tests Catalog (PDF Page 11)
export const TSA_TEST_CATALOG = [
  { ic:"🔍", t:"Surface Cleanliness Visual Inspection",                std:"ISO 8501-1",                                req:"SA 3 / SA 2.5 (White Metal / Near-White Metal)" },
  { ic:"🧼", t:"Surface Contamination Check (Oil & Grease)",            std:"SSPC-SP1",                                  req:"Surface completely free from hydrocarbons" },
  { ic:"💨", t:"Compressed Air Cleanliness Test (Blotter)",            std:"ASTM D4285",                                req:"No visible oil or moisture contamination" },
  { ic:"🧪", t:"Soluble Salt Contamination Test (Bresle)",             std:"ISO 8502-6 / ISO 8502-9",                   req:"≤ 20 mg/m² (≤ 2 µg/cm²)" },
  { ic:"🌫", t:"Surface Dust Test on blasted surface",                 std:"ISO 8502-3",                                req:"Rating 2 or better · Class 1" },
  { ic:"📏", t:"Surface Profile Measurement (Anchor Pattern)",         std:"ASTM D4417 / AMPP RP0287",                  req:"Minimum 65 µm (2.5 mils) sharp angular profile" },
  { ic:"📐", t:"Coating Thickness (DFT) Measurement",                   std:"SSPC-PA 2 / ISO 19840",                     req:"As specified (e.g. 250–350 µm / 300–500 µm)" },
  { ic:"📊", t:"DFT Uniformity Assessment",                              std:"SSPC-PA 2",                                 req:"Within project tolerance (80%–120% rule)" },
  { ic:"↩️", t:"Bend Test Coupon Qualification (180° Mandrel)",         std:"AWS C2.23M Section 6.5",                    req:"No lifting, spalling, or macro-cracking" },
  { ic:"⬇️", t:"Adhesion Test (Pull-Off Tensile Adhesion)",             std:"ASTM D4541 / ISO 4624",                     req:"≥ 6.9 MPa (1000 psi) for Pure Al TSA" },
  { ic:"🔪", t:"Cut Test (Knife Lattice Test)",                         std:"AWS C2.23M / ISO 2063-2",                   req:"No peeling, flaking or delamination" },
  { ic:"👁", t:"Coating Finish Inspection",                              std:"AWS C2.23M / NACE No.12",                   req:"Uniform finish; no blisters, loose particles or cracks" },
  { ic:"🔬", t:"Porosity Assessment (Microstructural Metallography)",   std:"Metallographic Examination",                req:"Within specification limit (typically ≤ 8%)" },
  { ic:"📎", t:"Companion Coupon Verification",                          std:"Project Specification",                     req:"Identical substrate & spray cycle coupon tested" },
  { ic:"🟫", t:"Rust Bloom Inspection",                                  std:"AWS C2.23M",                                req:"Zero rust bloom permitted before sealing" },
  { ic:"🔨", t:"Dull Chisel / Hammer Adhesion Test",                     std:"AWS C2.23M Cut Test",                       req:"No flaking or delamination along chiselled line" },
  { ic:"📏", t:"Wet Film Thickness (WFT) Measurement",                  std:"ASTM D4414 / ISO 2808",                     req:"As per sealer TDS (typically 25–40 µm WFT)" },
  { ic:"📐", t:"Dry Film Thickness (DFT) for Sealer Coat",              std:"ASTM D7091 / SSPC-PA 2",                    req:"15 – 25 µm dry sealer film" },
  { ic:"⚗️",  t:"Mixing Ratio Verification (Part A-B)",                   std:"Paint TDS",                                  req:"Per manufacturer specification" },
  { ic:"⏱️",  t:"Pot Life / Induction Time Check",                        std:"Paint TDS",                                  req:"Within specified working pot life at ambient temp" }
];

export const TSA_DEFAULT_STAGE_TEST_INDICES = {
  s1: [0, 7, 8, 9, 11, 12], // Cleanliness, DFT Uniformity, Bend Test, Pull-Off, Finish Inspection, Porosity
  s2: [16, 17, 18, 19],     // WFT, DFT, Mixing Ratio, Pot Life
  s3: [16, 17, 18, 19],
  s4: [16, 17, 18, 19]
};

export const TSA_STAGE_NAMES = {
  s1: 'Blasting + Thermal Spray (TSA)',
  s2: '1st Coat / Sealer Coat',
  s3: '2nd Coat (Intermediate)',
  s4: '3rd Coat (Topcoat)'
};

export const TSA_DFT_SUBSTRATES = {
  plane: { num: 1, title: 'Plane Surface', labels: ['Raw 1', 'Raw 2', 'Raw 3', 'Raw 4'] },
  pipe: { num: 2, title: '6" Diameter Pipe', labels: ['Orientation 1', 'Orientation 2', 'Orientation 3', 'Orientation 4'] },
  tbeam: { num: 3, title: '6" Deep T-Beam', labels: ['Side 1', 'Side 2', 'Side 3', 'Side 4', 'Side 5', 'Side 6', 'Side 7', 'Side 8'] },
  flange: { num: 4, title: '12" Wide Flange', labels: ['Side 1', 'Side 2', 'Side 3', 'Side 4', 'Side 5', 'Side 6', 'Side 7', 'Side 8'] }
};

export const TSA_DFT_MINI_TYPES = ['plane', 'pipe', 'tbeam', 'flange'];

export const TSA_COATING_SYSTEM_DEFAULTS = [
  { act: "Thermal Spray", generic: "Thermal Spray Aluminium (TSA)", brand: "N/A (99.5% Al Wire)", mfr: "N/A", coats: "1", min: "300", max: "500", shade: "Metallic Silver" },
  { act: "Sealer Coat", generic: "High Temperature Silicone Aluminum", brand: "Intertherm 50", mfr: "AkzoNobel (International Paint)", coats: "1", min: "15", max: "25", shade: "Aluminum" }
];

export const TSA_PHOTO_PRESETS = [
  { title: "Substrate Surface Preparation (Sa 3.0)", loc: "Substrate after White Metal Grit Blast · Profile 75 µm" },
  { title: "Twin Wire Arc Equipment Setup", loc: "Arc 140 Power Source, Air Compressor & Wire Feed System" },
  { title: "Companion Coupon & Bend Test Panel", loc: "1.5 mm Mild Steel Coupon sprayed simultaneously" },
  { title: "Thermal Spray Application (Crossing Passes)", loc: "Operator maintaining 175 mm stand-off & 90° spray angle" },
  { title: "Pull-Off Adhesion Test (ASTM D4541)", loc: "Dolly pull-off test recording ≥ 8.5 MPa on companion plate" },
  { title: "Sealer Coat Application (Intertherm 50)", loc: "High-temperature silicone aluminium sealer applied within 2 hrs" }
];

export const TSA_PRESETS = [
  {
    id: 'offshore_flare',
    title: 'Offshore High-Temp Flare Riser & Splash Zone',
    category: 'TSA Operator',
    spec: 'NORSOK M-501 System 2B / NACE No.12 / ISO 2063',
    surfPrep: 'SSPC-SP5 / NACE No.1 · White Metal Blast Cleaning · Profile: 75–100 µm Angular',
    system: [
      { act: "Thermal Spray", generic: "Thermal Spray Aluminium (TSA)", brand: "Castolin ARC 140 Wire", mfr: "Castolin Eutectic", coats: "1", min: "300", max: "450", shade: "Metallic Silver" },
      { act: "Sealer Coat", generic: "High Temperature Silicone Aluminum", brand: "Intertherm 50", mfr: "AkzoNobel", coats: "1", min: "15", max: "25", shade: "Aluminum" }
    ]
  },
  {
    id: 'cui_piping',
    title: 'Refinery Under-Insulation (CUI) Piping',
    category: 'Thermal Spray Operator',
    spec: 'NACE SP0198 / AWS C2.23M / ISO 2063-2',
    surfPrep: 'SSPC-SP10 / NACE No.2 · Near-White Blast · Profile: 65–90 µm Angular Grit',
    system: [
      { act: "Thermal Spray", generic: "Thermal Spray Aluminium (TSA)", brand: "Metallisation 99.5% Al", mfr: "Metallisation Ltd", coats: "1", min: "250", max: "350", shade: "Metallic Grey" },
      { act: "Sealer Coat", generic: "Silicone Aluminium Sealer", brand: "Resist 86", mfr: "Jotun", coats: "1", min: "20", max: "30", shade: "Aluminum" }
    ]
  },
  {
    id: 'subsea_jumper',
    title: 'Deepwater Subsea Spool & Manifold Piping',
    category: 'Twin Wire Arc Operator',
    spec: 'DNV-RP-F106 / ISO 2063-1 / ASTM D4541',
    surfPrep: 'ISO 8501-1 Sa 3 · White Metal Finish · Profile: 75–100 µm Chilled Iron Grit',
    system: [
      { act: "Thermal Spray", generic: "Thermal Spray Aluminium (TSA)", brand: "Alloy 1100 99.5% Al", mfr: "Praxair TAFA", coats: "1", min: "350", max: "500", shade: "Metallic Silver" },
      { act: "Sealer Coat", generic: "Penetrating Epoxy Tie Coat", brand: "Carboguard 893", mfr: "Carboline", coats: "1", min: "25", max: "40", shade: "Light Grey" }
    ]
  }
];

export const INITIAL_TSA_STATE = {
  // Section 01: Project & Client Details
  'f-rep-no': '',
  'f-rep-date': new Date().toISOString().split('T')[0],
  'f-proj': 'NFS North Field South Offshore Project',
  'f-proj-no': 'NFS-QATAR-2026-TSA',
  'f-client': 'QatarEnergy LNG / TotalEnergies EP',
  'f-epc': 'McDermott International Ltd.',
  'f-contractor': 'BG Group Coating & Corrosion Engineering',
  'f-location': 'Ras Laffan Fabrication Yard / Offshore Topsides',
  'f-ref': 'NACE No.12 / AWS C2.23M / SSPC-CS 23.00, AWS C2.16 / C2.16M, ISO 2063-2, SSPC-PA 2',

  // Section 01: Operator Identification
  'f-name': 'Dharmesh V. Rathod',
  'f-category': 'TSA Operator',
  'f-civil': 'QID-882910482',
  'f-nationality': 'INDIAN',
  'f-dob': '1989-04-14',
  'f-exp': '8.5',
  'f-employer': 'BG Group Thermal Spray Division',
  'f-qual-date': new Date().toISOString().split('T')[0],
  'f-next-date': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  'op-photo': '',

  // Section 01: Surface Prep & Scope
  'cs-surf-prep': 'SSPC-SP5 / NACE No.1 · White Metal Blast Cleaning · Profile: 75–100 µm Angular (G-25 Chilled Iron Grit)',
  coatingSystem: JSON.parse(JSON.stringify(TSA_COATING_SYSTEM_DEFAULTS)),
  tsaMaterials: JSON.parse(JSON.stringify(TSA_MAT_DEFAULTS)),

  // Section 02: Assessment Checklist (12 elements)
  checklist: TSA_CHECKLIST_ELEMENTS.map(() => ({ result: 'Pass', comment: 'Demonstrated complete procedural compliance' })),
  'f-remark-check': 'Operator demonstrated excellent twin-wire arc gun manipulation and adherence to ISO 2063-2 / AWS C2.23M.',

  // Section 03 - 06: Coat Stages s1, s2, s3, s4
  coatStages: {
    s1: {
      method: 'Twin Wire Arc Thermal Spray (ARC 140 / 400A)',
      stripe: 'N/A (Full crossing pass coverage)',
      rust: 'No visible rusting / No flash rust',
      date: new Date().toISOString().split('T')[0],
      start: '08:30',
      end: '11:45',
      recoat: 'Within 4 Hours (Sealer mandatory before humidity exposure)',
      generic: 'Thermal Spray Aluminium (TSA)',
      mfr: 'N/A (Wire Process)',
      product: '99.5% Pure Aluminum Wire (2.3 mm)',
      shade: 'Metallic Silver',
      ratio: 'N/A',
      dftSpecMin: '300',
      dftSpecMax: '500',
      batchA: 'LOT-AL-2026-881',
      expA: '2028-12-31',
      batchB: 'N/A',
      expB: '',
      batchC: 'N/A',
      expC: '',
      envReadings: [
        { time: '08:30', db: 28.5, wb: 22.0, mt: 32.0 },
        { time: '10:00', db: 30.0, wb: 23.5, mt: 34.5 },
        { time: '11:30', db: 31.5, wb: 24.0, mt: 36.0 }
      ],
      appParams: JSON.parse(JSON.stringify(TSA_APP_DEFAULTS)),
      tests: [
        { t: "Surface Cleanliness Visual Inspection", std: "ISO 8501-1", req: "SA 3 / SA 2.5", act: "Sa 3.0 White Metal Cleanliness", res: "Pass" },
        { t: "Surface Profile Measurement (Anchor Pattern)", std: "ASTM D4417", req: "Minimum 65 µm angular", act: "82 µm Sharp Angular Profile", res: "Pass" },
        { t: "Bend Test Coupon Qualification (180° Mandrel)", std: "AWS C2.23M Section 6.5", req: "No lifting / No major crack", act: "Zero macro-cracking or spalling", res: "Pass" },
        { t: "Adhesion Test (Pull-Off Tensile Adhesion)", std: "ASTM D4541", req: "≥ 6.9 MPa for Aluminum TSA", act: "9.4 MPa (Substrate/Glue Failure)", res: "Pass" },
        { t: "Coating Finish Inspection", std: "AWS C2.23M", req: "No blisters, cracks or loose particles", act: "Uniform metallic finish; zero defect", res: "Pass" },
        { t: "Porosity Assessment (If Specified)", std: "Metallographic", req: "≤ 8% Porosity", act: "4.2% Porosity Verified", res: "Pass" }
      ],
      dftMini: {
        plane: [
          { label: 'Raw 1', spots: [360, 375, 365, 380] },
          { label: 'Raw 2', spots: [390, 410, 385, 395] },
          { label: 'Raw 3', spots: [370, 380, 375, 360] },
          { label: 'Raw 4', spots: [385, 390, 400, 375] }
        ],
        pipe: [
          { label: 'Orientation 1', spots: [350, 365, 370, 360] },
          { label: 'Orientation 2', spots: [380, 390, 375, 385] },
          { label: 'Orientation 3', spots: [365, 370, 380, 375] },
          { label: 'Orientation 4', spots: [390, 405, 395, 380] }
        ],
        tbeam: [
          { label: 'Side 1', spots: [370, 380, 365, 375] },
          { label: 'Side 2', spots: [360, 365, 370, 380] },
          { label: 'Side 3', spots: [385, 390, 375, 380] },
          { label: 'Side 4', spots: [395, 400, 385, 390] },
          { label: 'Side 5', spots: [375, 380, 370, 365] },
          { label: 'Side 6', spots: [380, 385, 390, 375] },
          { label: 'Side 7', spots: [365, 370, 375, 380] },
          { label: 'Side 8', spots: [390, 395, 400, 385] }
        ],
        flange: [
          { label: 'Side 1', spots: [375, 380, 385, 370] },
          { label: 'Side 2', spots: [360, 365, 370, 380] },
          { label: 'Side 3', spots: [390, 395, 400, 385] },
          { label: 'Side 4', spots: [380, 385, 375, 390] },
          { label: 'Side 5', spots: [365, 370, 380, 375] },
          { label: 'Side 6', spots: [385, 390, 395, 380] },
          { label: 'Side 7', spots: [370, 375, 380, 365] },
          { label: 'Side 8', spots: [395, 400, 390, 385] }
        ]
      },
      userVerdict: 'Pass'
    },
    s2: {
      method: 'Air Spray / Low-Pressure Mist Coat',
      stripe: 'Full mist coat penetration',
      rust: 'Zero rust on TSA base',
      date: new Date().toISOString().split('T')[0],
      start: '13:30',
      end: '14:45',
      recoat: '16 – 24 Hours at 25°C',
      generic: 'High Temperature Silicone Aluminum',
      mfr: 'AkzoNobel (International Paint)',
      product: 'Intertherm 50',
      shade: 'Aluminum',
      ratio: 'Single Component (Ready-to-Use)',
      dftSpecMin: '315',
      dftSpecMax: '525',
      batchA: 'LOT-IT50-99420',
      expA: '2027-06-30',
      batchB: 'N/A',
      expB: '',
      batchC: 'N/A',
      expC: '',
      envReadings: [
        { time: '13:30', db: 32.0, wb: 24.5, mt: 37.0 },
        { time: '14:30', db: 32.5, wb: 25.0, mt: 37.5 }
      ],
      appParams: JSON.parse(JSON.stringify(TSA_APP_DEFAULTS)),
      tests: [
        { t: "Wet Film Thickness (WFT) Measurement", std: "ASTM D4414", req: "30–50 µm WFT", act: "40 µm WFT uniform", res: "Pass" },
        { t: "Dry Film Thickness (DFT) for Sealer Coat", std: "SSPC-PA 2", req: "15–25 µm Sealer (Cum: 315–525 µm)", act: "395 µm Cumulative DFT", res: "Pass" },
        { t: "Mixing Ratio Verification (Part A-B)", std: "TDS", req: "Uniform agitation", act: "Thoroughly mixed with mechanical agitator", res: "Pass" },
        { t: "Pot Life / Induction Time Check", std: "TDS", req: "8 Hours at 25°C", act: "Applied within 1 hour of opening", res: "Pass" }
      ],
      dftMini: {
        plane: [
          { label: 'Raw 1', spots: [380, 395, 385, 400] },
          { label: 'Raw 2', spots: [410, 430, 405, 415] },
          { label: 'Raw 3', spots: [390, 400, 395, 380] },
          { label: 'Raw 4', spots: [405, 410, 420, 395] }
        ],
        pipe: [
          { label: 'Orientation 1', spots: [370, 385, 390, 380] },
          { label: 'Orientation 2', spots: [400, 410, 395, 405] },
          { label: 'Orientation 3', spots: [385, 390, 400, 395] },
          { label: 'Orientation 4', spots: [410, 425, 415, 400] }
        ],
        tbeam: [
          { label: 'Side 1', spots: [390, 400, 385, 395] },
          { label: 'Side 2', spots: [380, 385, 390, 400] },
          { label: 'Side 3', spots: [405, 410, 395, 400] },
          { label: 'Side 4', spots: [415, 420, 405, 410] },
          { label: 'Side 5', spots: [395, 400, 390, 385] },
          { label: 'Side 6', spots: [400, 405, 410, 395] },
          { label: 'Side 7', spots: [385, 390, 395, 400] },
          { label: 'Side 8', spots: [410, 415, 420, 405] }
        ],
        flange: [
          { label: 'Side 1', spots: [395, 400, 405, 390] },
          { label: 'Side 2', spots: [380, 385, 390, 400] },
          { label: 'Side 3', spots: [410, 415, 420, 405] },
          { label: 'Side 4', spots: [400, 405, 395, 410] },
          { label: 'Side 5', spots: [385, 390, 400, 395] },
          { label: 'Side 6', spots: [405, 410, 415, 400] },
          { label: 'Side 7', spots: [390, 395, 400, 385] },
          { label: 'Side 8', spots: [415, 420, 410, 405] }
        ]
      },
      userVerdict: 'Pass'
    },
    s3: {
      method: '',
      stripe: '',
      rust: '',
      date: '',
      start: '',
      end: '',
      recoat: '',
      generic: '',
      mfr: '',
      product: '',
      shade: '',
      ratio: '',
      dftSpecMin: '',
      dftSpecMax: '',
      batchA: '',
      expA: '',
      batchB: '',
      expB: '',
      batchC: '',
      expC: '',
      envReadings: [],
      appParams: JSON.parse(JSON.stringify(TSA_APP_DEFAULTS)),
      tests: [],
      dftMini: { plane: [], pipe: [], tbeam: [], flange: [] },
      userVerdict: ''
    },
    s4: {
      method: '',
      stripe: '',
      rust: '',
      date: '',
      start: '',
      end: '',
      recoat: '',
      generic: '',
      mfr: '',
      product: '',
      shade: '',
      ratio: '',
      dftSpecMin: '',
      dftSpecMax: '',
      batchA: '',
      expA: '',
      batchB: '',
      expB: '',
      batchC: '',
      expC: '',
      envReadings: [],
      appParams: JSON.parse(JSON.stringify(TSA_APP_DEFAULTS)),
      tests: [],
      dftMini: { plane: [], pipe: [], tbeam: [], flange: [] },
      userVerdict: ''
    }
  },

  // Section 07: Photo Report
  photos: TSA_PHOTO_PRESETS.map((p, i) => ({
    id: i + 1,
    title: p.title,
    loc: p.loc,
    date: new Date().toISOString().split('T')[0],
    init: 'DVR',
    cap: `Verification photograph recording ${p.title.toLowerCase()} for TSA operator qualification.`,
    b64: ''
  })),
  'f-remark-photo': 'Comprehensive photographic evidence attached showing surface prep, twin-wire arc spraying, bend test coupon, pull-off adhesion and sealer application.',

  // Section 08: Verdict & Approval Signatures
  'sig1-name': 'Dharmesh V. Rathod / TSA Specialist',
  'sig1-date': new Date().toISOString().split('T')[0],
  'sig2-name': 'Sunny Dharaiya / Lead NACE Level III Coating Inspector (Cert #48102)',
  'sig2-date': new Date().toISOString().split('T')[0],
  'sig3-name': 'Jean-Marc Dupont / Third Party Client Verification Surveyor',
  'sig3-date': new Date().toISOString().split('T')[0],
  sigStamps: { 1: null, 2: null, 3: null },

  // Section 09: Summary Narrative
  'f-sum-custom-notes': 'The operator exhibited master-level dexterity with Twin-Wire Arc Thermal Spray Aluminium application. Bend coupon and 9.4 MPa pull-off adhesion verify robust metallurgical mechanical bonding.'
};

/**
 * Magnus Psychrometric Calculation Functions
 */
export function calcRH(tdb, twb) {
  if (isNaN(tdb) || isNaN(twb)) return NaN;
  const es = (T) => 6.112 * Math.exp((17.67 * T) / (T + 243.5));
  const e_wb = es(twb) - 0.000662 * 1013.25 * (tdb - twb);
  let rh = 100 * (e_wb / es(tdb));
  if (rh < 0) rh = 0;
  if (rh > 100) rh = 100;
  return rh;
}

export function calcDP(tdb, rh) {
  if (isNaN(tdb) || isNaN(rh) || rh <= 0) return NaN;
  const a = 17.67, b = 243.5;
  const alpha = Math.log(rh / 100) + (a * tdb) / (b + tdb);
  return (b * alpha) / (a - alpha);
}

export function calcEnvRow(db, wb, mt) {
  const d = parseFloat(db);
  const w = parseFloat(wb);
  const m = parseFloat(mt);
  if (isNaN(d) || isNaN(w) || isNaN(m)) {
    return { rh: NaN, dp: NaN, diff: NaN, ok: false, valid: false };
  }
  const rh = calcRH(d, w);
  const dp = calcDP(d, rh);
  const diff = m - dp;
  const ok = rh <= 85 && diff >= 3.0;
  return { rh, dp, diff, ok, valid: true };
}

/**
 * Calculate DFT stats across 4 mini-tables for a coat stage
 */
export function calcCoatDFT(coat) {
  if (!coat) return { grandAvg: NaN, totalReadings: 0, outOfRange: 0, spotsValid: 0, spotsOK: 0, overallInRange: false };
  const minV = parseFloat(coat.dftSpecMin);
  const maxV = parseFloat(coat.dftSpecMax);
  const low80 = !isNaN(minV) ? minV * 0.8 : NaN;
  const high120 = !isNaN(maxV) ? maxV * 1.2 : NaN;

  let allSpots = [];
  let grandTotal = 0;
  let grandOut = 0;
  let spotsValid = 0;
  let spotsOK = 0;

  const mini = coat.dftMini || {};
  TSA_DFT_MINI_TYPES.forEach(type => {
    const rows = mini[type] || [];
    rows.forEach(r => {
      (r.spots || []).forEach(val => {
        const v = parseFloat(val);
        if (!isNaN(v)) {
          allSpots.push(v);
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
  });

  const grandAvg = allSpots.length ? allSpots.reduce((a, b) => a + b, 0) / allSpots.length : NaN;
  let autoVerdict = '—';
  let overallInRange = false;

  if (!isNaN(grandAvg) && !isNaN(minV) && !isNaN(maxV)) {
    if (grandAvg >= minV && grandAvg <= maxV && grandOut === 0) {
      autoVerdict = 'PASS';
      overallInRange = true;
    } else if (grandAvg >= low80 && grandAvg <= high120) {
      autoVerdict = 'REWORK';
    } else {
      autoVerdict = 'FAIL';
    }
  }

  if (coat.userVerdict === 'Pass') overallInRange = true;

  return {
    grandAvg,
    totalReadings: grandTotal,
    outOfRange: grandOut,
    spotsValid,
    spotsOK,
    overallInRange,
    autoVerdict,
    minV,
    maxV,
    low80,
    high120
  };
}

/**
 * Master TSA Qualification Evaluation Engine
 * Weights:
 * - Assessment Checklist Compliance: 35% (≥80% threshold, 0 fails)
 * - DFT Compliance (SSPC PA-2): 30% (Spot readings inside 80%–120% bound)
 * - Process Inspection Pass Rate: 20% (≥80% threshold, 0 fails)
 * - Environmental Conditions: 15% (RH ≤ 85%, MT − DP ≥ 3°C)
 * Total = 100%, Qualifying Score ≥ 80.0% with 0 Critical Defects.
 */
export function calculateTsaQualification(state) {
  if (!state) return { overall: 0, verdict: 'PENDING', stageProgress: {} };

  // 1. Checklist
  const checklist = state.checklist || [];
  let chkPass = 0, chkFail = 0, chkNa = 0, chkPend = 0;
  checklist.forEach(item => {
    if (item.result === 'Pass') chkPass++;
    else if (item.result === 'Fail') chkFail++;
    else if (item.result === 'NA') chkNa++;
    else chkPend++;
  });
  const chkEvaluated = chkPass + chkFail;
  const chkPct = chkEvaluated > 0 ? (chkPass / chkEvaluated) * 100 : (chkPass > 0 ? 100 : 0);

  // 2. Inspection Tests across s1..s4
  let inspPass = 0, inspFail = 0, inspNa = 0, inspPend = 0;
  ['s1', 's2', 's3', 's4'].forEach(sid => {
    const stage = state.coatStages?.[sid];
    (stage?.tests || []).forEach(t => {
      if (t.res === 'Pass') inspPass++;
      else if (t.res === 'Fail') inspFail++;
      else if (t.res === 'NA') inspNa++;
      else inspPend++;
    });
  });
  const inspEvaluated = inspPass + inspFail;
  const inspPct = inspEvaluated > 0 ? (inspPass / inspEvaluated) * 100 : (inspPass > 0 ? 100 : 0);

  // 3. Environmental Readings across s1..s4
  let envValid = 0, envOk = 0;
  ['s1', 's2', 's3', 's4'].forEach(sid => {
    const stage = state.coatStages?.[sid];
    (stage?.envReadings || []).forEach(r => {
      const res = calcEnvRow(r.db, r.wb, r.mt);
      if (res.valid) {
        envValid++;
        if (res.ok) envOk++;
      }
    });
  });
  const envPct = envValid > 0 ? (envOk / envValid) * 100 : 100;
  const envFinalOK = envValid === 0 || envOk === envValid;

  // 4. DFT Compliance across s1..s4
  let totalDftValid = 0, totalDftOk = 0;
  let allDftInRange = true;
  let anyCoatHasDft = false;
  const dftByStage = {};

  ['s1', 's2', 's3', 's4'].forEach(sid => {
    const stage = state.coatStages?.[sid];
    const res = calcCoatDFT(stage);
    dftByStage[sid] = res;
    if (res.totalReadings > 0) {
      anyCoatHasDft = true;
      totalDftValid += res.spotsValid;
      totalDftOk += res.spotsOK;
      if (!res.overallInRange) allDftInRange = false;
    }
  });

  const dftPct = totalDftValid > 0 ? (totalDftOk / totalDftValid) * 100 : (anyCoatHasDft ? 100 : 0);
  const dftFinalOK = !anyCoatHasDft || (totalDftOk === totalDftValid && allDftInRange);

  // 5. 4-Tier Overall Weighted Score
  // Checklist (35%) + DFT (30%) + Inspection (20%) + Environmental (15%) = 100%
  const overall = (0.35 * chkPct) + (0.30 * dftPct) + (0.20 * inspPct) + (0.15 * envPct);

  // 6. Master Qualification Verdict
  const meetsChk = chkPct >= 80 && chkFail === 0;
  const meetsInsp = inspPct >= 80 && inspFail === 0;
  const meetsEnv = envFinalOK;
  const meetsDft = dftFinalOK;
  const allMeet = meetsChk && meetsInsp && meetsEnv && meetsDft && overall >= 80.0;

  let verdict = 'PENDING';
  if (chkPend > 0) {
    verdict = 'PENDING';
  } else if (allMeet) {
    verdict = 'PASS';
  } else {
    verdict = 'FAIL';
  }

  // Stage Progress calculations for FreezeBar and Hub
  const hasInfo = Boolean(state['f-name'] && state['f-civil'] && state['f-proj']);
  const photoCount = (state.photos || []).filter(p => p.b64 || p.title).length;

  const getStageProgress = (sid) => {
    const s = state.coatStages?.[sid];
    if (!s) return 0;
    const hasMfr = Boolean(s.mfr && s.product);
    const hasEnv = (s.envReadings || []).length > 0;
    const hasDft = (dftByStage[sid]?.totalReadings || 0) > 0;
    const hasTests = (s.tests || []).length > 0;
    let score = (hasMfr ? 25 : 0) + (hasEnv ? 25 : 0) + (hasDft ? 25 : 0) + (hasTests ? 25 : 0);
    return score;
  };

  const stageProgress = {
    info: hasInfo ? 100 : (state['f-name'] ? 50 : 0),
    checklist: chkPct,
    s1: getStageProgress('s1'),
    s2: getStageProgress('s2'),
    s3: getStageProgress('s3'),
    s4: getStageProgress('s4'),
    photo: photoCount >= 3 ? 100 : (photoCount > 0 ? 50 : 0),
    verdict: verdict !== 'PENDING' ? 100 : 50
  };

  const stagesArray = Object.values(stageProgress);
  const completionPct = stagesArray.reduce((a, b) => a + b, 0) / stagesArray.length;

  return {
    overall,
    verdict,
    chk: { pass: chkPass, fail: chkFail, na: chkNa, pend: chkPend, pct: chkPct },
    insp: { pass: inspPass, fail: inspFail, na: inspNa, pend: inspPend, pct: inspPct },
    env: { valid: envValid, ok: envOk, pct: envPct, finalOK: envFinalOK },
    dft: { valid: totalDftValid, ok: totalDftOk, pct: dftPct, finalOK: dftFinalOK, byStage: dftByStage },
    stageProgress,
    completionPct
  };
}

export const calcTsaEvaluation = calculateTsaQualification;

/**
 * Validate Chronological Stage Sequence (e.g. Blasting+TSA -> 1st Coat -> 2nd Coat -> 3rd Coat)
 */
export function validateStageSequence(projNo, reports) {
  const approved = (reports || []).filter(r => (r.projNo || '') === (projNo || '') && r.status === 'Approved');
  let hasS1 = false, hasS2 = false, hasS3 = false, hasS4 = false;

  approved.forEach(r => {
    if (r.stagesFilled) {
      if (r.stagesFilled.s1) hasS1 = true;
      if (r.stagesFilled.s2) hasS2 = true;
      if (r.stagesFilled.s3) hasS3 = true;
      if (r.stagesFilled.s4) hasS4 = true;
    }
  });

  let parts = [];
  let ok = true;
  if (hasS1) parts.push('B&TSA');
  if (hasS2) { parts.push('1st'); if (!hasS1) ok = false; }
  if (hasS3) { parts.push('2nd'); if (!hasS1 || !hasS2) ok = false; }
  if (hasS4) { parts.push('3rd'); if (!hasS1 || !hasS2 || !hasS3) ok = false; }

  if (parts.length === 0) return { text: '—', ok: true, empty: true };
  return { text: parts.join(' + '), ok, empty: false };
}
