// ==========================================================================
// BG CoatingOS™ — Master Engineering Database for 03. Coating Procedure
// Aligned with ISO, ASTM, SSPC/AMPP, NACE, and Global EPC Standards
// ==========================================================================

export const PROC_STANDARDS_LIB = [
  { code: "ISO 8501-1", desc: "Preparation of steel substrates – Visual assessment of surface cleanliness (Sa grades)" },
  { code: "ISO 8501-3", desc: "Preparation grades of welds, edges, and surface imperfections (P1/P2/P3)" },
  { code: "ISO 8501-4", desc: "Initial surface conditions and flash rust grades for water jetting" },
  { code: "ISO 8502 Series", desc: "Tests for assessment of surface cleanliness prior to coating application" },
  { code: "ISO 8502-3", desc: "Assessment of dust on steel surfaces (pressure-sensitive tape method, Class 0-5)" },
  { code: "ISO 8502-4", desc: "Guidance on estimation of dew point to prevent condensation (Steel Temp > DP + 3°C)" },
  { code: "ISO 8502-6", desc: "Bresle method for extraction of soluble salts for analysis" },
  { code: "ISO 8502-9", desc: "Conductometric field determination of water-soluble salts" },
  { code: "ISO 8503 Series", desc: "Surface roughness characteristics of blast-cleaned steel (Surface profile comparators)" },
  { code: "ISO 8504 Series", desc: "Surface preparation methods – General principles and overview" },
  { code: "ISO 11126 Series", desc: "Specifications for non-metallic blast-cleaning abrasives (Garnet, Copper Slag, etc.)" },
  { code: "ISO 11127-6", desc: "Water-soluble contaminants in non-metallic abrasives by conductivity measurement" },
  { code: "ISO 12944 Series", desc: "Paints & varnishes – Corrosion protection of steel structures by protective paint systems (C1 to CX)" },
  { code: "ISO 19840", desc: "Measurement of dry film thickness (DFT) on rough surfaces (80/20 rule)" },
  { code: "ISO 2409", desc: "Paints and varnishes – Cross-cut test for assessment of coating adhesion" },
  { code: "ISO 4624", desc: "Paints and varnishes – Pull-off test for determination of adhesion strength (MPa)" },
  { code: "ISO 2808", desc: "Paints and varnishes – Determination of wet and dry film thickness" },
  { code: "ISO 14001", desc: "Environmental management systems – Requirements with guidance for use" },
  { code: "ISO 45001", desc: "Occupational health and safety management systems" },
  { code: "ASTM D4417", desc: "Standard test methods for field measurement of surface profile of blast-cleaned steel" },
  { code: "ASTM D4414", desc: "Standard practice for measurement of wet film thickness (WFT) of organic coatings" },
  { code: "ASTM D4285", desc: "Standard test method for indicating oil or water in compressed air (Blotter Test)" },
  { code: "ASTM D4541", desc: "Standard test method for pull-off strength of coatings using portable adhesion testers" },
  { code: "ASTM D3359", desc: "Standard test methods for measuring adhesion by tape test (Cross-cut / X-cut)" },
  { code: "ASTM D7091", desc: "Standard practice for non-destructive measurement of dry film thickness (magnetic / eddy current)" },
  { code: "ASTM D5162", desc: "Standard practice for discontinuity (holiday) testing of non-conductive protective coatings" },
  { code: "ASTM D4752", desc: "Standard test method for measuring MEK resistance of ethyl silicate (IOZ) coatings" },
  { code: "ASTM D3363", desc: "Standard test method for film hardness by pencil test" },
  { code: "ASTM E337", desc: "Standard test method for measuring humidity using psychrometric principles" },
  { code: "ASTM D4940", desc: "Conductimetric analysis of water-soluble ionic contamination of blast abrasives" },
  { code: "SSPC-PA2", desc: "Procedure for determining conformance to dry coating thickness requirements (Levels 1 to 5)" },
  { code: "SSPC-SP1 / AMPP-SP1", desc: "Solvent cleaning – removal of oil, grease, dirt, and chemical contaminants" },
  { code: "SSPC-SP2", desc: "Hand tool cleaning of steel substrates (ISO St 2)" },
  { code: "SSPC-SP3", desc: "Power tool cleaning of steel substrates (ISO St 3)" },
  { code: "SSPC-SP5 / AMPP-SP5", desc: "White metal blast cleaning – complete removal of all visible contaminants (ISO Sa 3)" },
  { code: "SSPC-SP6 / AMPP-SP6", desc: "Commercial blast cleaning (ISO Sa 2)" },
  { code: "SSPC-SP7 / AMPP-SP7", desc: "Brush-off blast cleaning (ISO Sa 1)" },
  { code: "SSPC-SP10 / AMPP-SP10", desc: "Near-white metal blast cleaning – 95% clean bare metal (ISO Sa 2½)" },
  { code: "SSPC-SP11", desc: "Power tool cleaning to bare metal with min. 25 micron anchor profile" },
  { code: "SSPC-SP12 / NACE No.5", desc: "Surface preparation and cleaning of metals by high-pressure water jetting" },
  { code: "SSPC-SP14 / NACE No.8", desc: "Industrial blast cleaning" },
  { code: "SSPC-SP16", desc: "Brush-off blast cleaning of galvanized steel, stainless steels and non-ferrous alloys" },
  { code: "SSPC Guide 15", desc: "Field methods for surface preparation and salt retrieval of contaminated steel substrates" },
  { code: "AMPP SP0188", desc: "Discontinuity (holiday) testing of new protective coatings on conductive substrates" },
  { code: "OSHA Regulations", desc: "Occupational Safety and Health Administration – workplace safety regulations" },
  { code: "NFPA Standards", desc: "National Fire Protection Association – fire & explosion safety standards" },
  { code: "IEC / ATEX", desc: "Equipment intended for use in explosive atmospheres" },
  { code: "REACH Regulations", desc: "Registration, Evaluation, Authorisation and Restriction of Chemicals" },
  { code: "Manufacturer PDS/TDS/MSDS", desc: "Technical, application, and safety data sheets provided by coating manufacturers" }
];

export const PROC_EXCLUSIONS_LIB = [
  { item: "Austenitic stainless steel (non-insulated)", desc: "Not to be blasted or painted unless specifically required by specification" },
  { item: "Non-ferrous materials (Aluminium, Cu-Ni, Monel, Inconel)", desc: "Generally excluded from carbon steel coating application" },
  { item: "Plastics / rubber-lined / pre-coated surfaces", desc: "Shall be masked and protected to avoid mechanical or solvent damage" },
  { item: "Machined and precision surfaces", desc: "Masking required to prevent abrasive profile or coating deposit" },
  { item: "Gasket seating faces / flange facings", desc: "Shall be kept completely free from coating to maintain joint sealing" },
  { item: "Threaded parts (bolts, studs, nuts)", desc: "Coating not permitted on threads unless specific dry-film lubricant is approved" },
  { item: "Instrument connections / impulse lines", desc: "Shall be protected during blasting and painting" },
  { item: "Nameplates / identification tags / barcode plates", desc: "Shall remain visible, legible, and uncoated" },
  { item: "Galvanized surfaces", desc: "Not to be blast cleaned or coated unless specific duplex system is approved" },
  { item: "Earthing / grounding lugs & studs", desc: "Shall remain free of paint for electrical grounding continuity" },
  { item: "Moving parts / rotating interfaces / valve stems", desc: "Prevent coating interference with operational mechanical tolerances" },
  { item: "Internal surfaces (unless in lining scope)", desc: "Shall be protected from blast media ingress and paint overspray" },
  { item: "Glass surfaces / sight glasses / level gauges", desc: "Shall be properly masked with heavy-duty shields" }
];

export const PROC_REF_DOCS_LIB = [
  "Customer Mechanical Data Sheet & Rev.",
  "Applicable Project Specifications & Rev.",
  "Project Painting Specification",
  "Inspection & Test Plan (ITP)",
  "Approved Coating System Data Sheet",
  "Material Requisition (MR)",
  "Vendor Engineering Data Sheet",
  "Paint Manufacturer Technical Data Sheet (TDS)",
  "Paint Manufacturer Safety Data Sheet (SDS/MSDS)",
  "Project Quality Plan (PQP)",
  "EPC Coating Standard Specifications",
  "Site Safety & Environmental Guidelines",
  "Abrasive Manufacturer Prequalification Certificate",
  "Coating Repair Procedure Guidelines"
];

export const PROC_SAFETY_CATS = [
  {
    title: "General Safety Requirements",
    items: [
      "Mixing and handling of coating materials shall be carried out in safe and adequately ventilated areas free from ignition sources.",
      "Personnel involved in blasting and painting activities shall be certified/trained and equipped with approved Personal Protective Equipment (PPE).",
      "All equipment shall be inspected and maintained in safe operating condition prior to commencement of work."
    ],
    refs: "OSHA Regulations, ISO 45001, Manufacturer SDS"
  },
  {
    title: "Blasting Safety & Media Control",
    items: [
      "Abrasives used for blasting shall not contain hazardous materials; free silica content shall strictly be ≤ 1.0%.",
      "Blasting equipment shall be fitted with pneumatic or electronic dead man control triggers.",
      "The complete blasting circuit, including nozzle, hoses, operators, and workpieces, shall be electrically grounded to earth."
    ],
    refs: "SSPC-SP5 / SP10, OSHA Abrasive Blasting Standards, ISO 11126"
  },
  {
    title: "Coating Material Restrictions & Toxicology",
    items: [
      "Coatings containing toxic heavy metals (lead, arsenic, cadmium, mercury, hexavalent chromium) shall not be used.",
      "Coal tar and asbestos-modified products are prohibited unless explicitly permitted by client under strict safety protocols.",
      "All coating materials and thinners shall comply with local VOC and environmental regulations."
    ],
    refs: "ISO 12944, REACH Regulations, Local Environmental Laws"
  },
  {
    title: "Electrical & Static Earthing",
    items: [
      "All electrical power equipment, compressors, and spray pumps shall be grounded to prevent static sparking.",
      "Electrical equipment inside blast rooms or spray booths shall be ATEX / IECEx explosion-proof certified.",
      "Spray gun metallic tips and hose conductive braids shall maintain continuity to earth."
    ],
    refs: "NFPA 33, IEC/ATEX Requirements, OSHA 1910.107"
  },
  {
    title: "Confined Space & Forced Ventilation",
    items: [
      "Adequate positive forced ventilation and dust extraction shall be provided in confined tanks or vessels.",
      "Ventilation systems shall maintain solvent vapor concentration strictly below 10% of the Lower Explosive Limit (LEL).",
      "Continuous air monitoring for Oxygen (19.5% - 23.5%), LEL, and Toxic Gases (H2S, CO) shall be maintained.",
      "Ventilation shall remain active during application and the entire curing duration."
    ],
    refs: "OSHA 1910.146 Confined Space, NFPA 91, Manufacturer TDS/SDS"
  },
  {
    title: "Work at Height & Scaffolding",
    items: [
      "Scaffolding and access platforms shall be green-tagged and inspected by certified scaffolding inspectors.",
      "Full-body safety harnesses with double lanyards and shock absorbers shall be worn 100% tied-off above 1.8m."
    ],
    refs: "OSHA 1926 Subpart M, Local Scaffolding Codes"
  }
];

export const PROC_SURFPREP_CATS = [
  {
    title: "Surface Condition Assessment & Pre-Treatment",
    items: [
      "Visual assessment of initial steel condition according to ISO 8501-1 / SSPC VIS-1 to identify Rust Grade (A, B, C, or D).",
      "All oil, grease, cutting fluids, and soluble contaminants shall be removed prior to blasting via SSPC-SP1 Solvent Cleaning.",
      "Solvent wipe using clean lint-free rags with approved fast-evaporating solvent; rags shall be replaced frequently."
    ]
  },
  {
    title: "Edge Preparation & Weld Dressing",
    items: [
      "All weld spatter, slag, flux residue, sharp edges, and laminations shall be ground smooth in accordance with ISO 8501-3 Grade P2 or P3.",
      "All sharp 90° edges on structural members and stiffeners shall be radiused / rounded to minimum 2 mm radius."
    ]
  },
  {
    title: "Abrasive Blast Cleaning Process",
    items: [
      "Blast cleaning shall be carried out to achieve specified cleanliness (Sa 2½ / Sa 3 / SSPC-SP10 / SSPC-SP5).",
      "Surface profile shall be sharp and angular with depth within the specified range (e.g. 50–75 µm).",
      "Dust level shall be assessed per ISO 8502-3 and shall not exceed Class 2.",
      "Maximum water-soluble salt level shall not exceed 20 mg/m² (2 µg/cm²) per ISO 8502-9."
    ]
  },
  {
    title: "Compressed Air Quality & Blotter Test",
    items: [
      "Compressed air shall be free of oil and moisture. Daily blotter test per ASTM D4285 using clean white absorbent collector for 1 minute."
    ]
  }
];

export const PROC_BLAST_QUALITIES = [
  { method: "Solvent Cleaning", def: "SSPC-SP1 / AMPP-SP1 – Pre-cleaning to remove oil, grease, dirt, and salts using clean solvents or alkaline wash." },
  { method: "Hand Tool Cleaning", def: "SSPC-SP2 / ISO 8501-1 St 2 – Mechanical scrape/wire brush to remove loose rust and mill scale." },
  { method: "Power Tool Cleaning", def: "SSPC-SP3 / ISO 8501-1 St 3 – Powered rotary wire brush / disc sanding to pronounced metallic sheen." },
  { method: "Power Tool to Bare Metal", def: "SSPC-SP11 – Bare metallic surface with minimum 25 µm surface profile." },
  { method: "White Metal Blast", def: "SSPC-SP5 / NACE No.1 / ISO Sa 3 – Complete 100% removal of all visible rust, mill scale, and oxides." },
  { method: "Near-White Blast Cleaning", def: "SSPC-SP10 / NACE No.2 / ISO Sa 2½ – 95% clean bare metal; max 5% light shadow per unit area." },
  { method: "Commercial Blast Cleaning", def: "SSPC-SP6 / NACE No.3 / ISO Sa 2 – 66% clean bare metal; max 33% staining per unit area." },
  { method: "Brush-Off Blast Cleaning", def: "SSPC-SP7 / NACE No.4 / ISO Sa 1 – Light blast to sweep loose scale and roughen existing coating." }
];

export const PROC_BLAST_CHECKPOINTS = [
  { desc: "Environmental Conditions", method: "ISO 8502-4 / ASTM E337", freq: "Before shift & every 2 hours", accept: "Steel Temp ≥ Dew Point + 3°C; RH ≤ 85%" },
  { desc: "Air Pressure at Nozzle", method: "Hypodermic Needle Gauge", freq: "Start of shift & periodically", accept: "90 – 100 PSI at blast nozzle" },
  { desc: "Air Cleanliness (Blotter)", method: "ASTM D4285", freq: "Start of shift & every 4 hours", accept: "No visible oil or moisture on blotter" },
  { desc: "Abrasive Contamination / Conductivity", method: "ISO 11127-6 / ASTM D4940", freq: "Each batch / Daily", accept: "Conductivity ≤ 150 µS/cm; oil-free" },
  { desc: "Surface Cleanliness", method: "ISO 8501-1 / SSPC VIS-1", freq: "100% visual inspection", accept: "ISO Sa 2½ (SSPC-SP10) or specified" },
  { desc: "Surface Profile (Roughness)", method: "ASTM D4417 Method C / ISO 8503", freq: "1 reading per 10 m²", accept: "50 – 75 µm angular (or per TDS)" },
  { desc: "Dust Level Test", method: "ISO 8502-3", freq: "Random checks per shift", accept: "Maximum Class 2 / Quantity 2" },
  { desc: "Soluble Salt Contamination", method: "ISO 8502-6 & 9 (Bresle)", freq: "1 test per 50 m²", accept: "≤ 20 mg/m² (marine) / ≤ 50 mg/m² (mild)" }
];

export const PROC_PAINT_CHECKPOINTS = [
  { desc: "Paint Material Batch & Expiry", method: "PDS / TDS / Batch Certificate", freq: "Each batch prior to mixing", accept: "Valid shelf life; approved batch certificate" },
  { desc: "Storage Temperature", method: "Digital Thermometer", freq: "Daily in paint store", accept: "Within 5°C – 35°C (per TDS)" },
  { desc: "Mixing Ratio & Induction", method: "TDS / Calibrated Measuring Cup", freq: "Each mix", accept: "Exact Base to Curing Agent ratio; full induction time observed" },
  { desc: "Pot Life Compliance", method: "Timer / Temperature Log", freq: "Continuous", accept: "Applied within allowable pot life at current ambient temp" },
  { desc: "Environmental Parameters", method: "Sling / Digital Dew Point Meter", freq: "Before & every 2 hrs during application", accept: "Steel Temp ≥ DP + 3°C; RH ≤ 85%" },
  { desc: "Stripe Coating", method: "Visual Inspection (Brush)", freq: "Prior to full spray coat", accept: "100% complete coverage on welds, edges, bolt holes" },
  { desc: "Wet Film Thickness (WFT)", method: "ASTM D4414 (Comb Gauge)", freq: "During spray application", accept: "WFT = Specified DFT / (Volume Solids % / 100)" },
  { desc: "Dry Film Thickness (DFT)", method: "SSPC-PA2 / ISO 19840", freq: "Each coat after curing", accept: "80-120% of nominal specified thickness" },
  { desc: "Visual Coating Quality", method: "ISO 8501 / Visual Inspection", freq: "100% surface area", accept: "Free of runs, sags, dry spray, pinholes, orange peel" },
  { desc: "Intercoat Recoat Window", method: "TDS & Application Log", freq: "Between coats", accept: "Within minimum and maximum recoat intervals" },
  { desc: "Holiday Detection (if specified)", method: "NACE SP0188 / ASTM D5162", freq: "100% lining / immersed areas", accept: "Zero spark / Zero pinhole defect" },
  { desc: "Adhesion Strength (Pull-Off)", method: "ISO 4624 / ASTM D4541", freq: "Test coupons / Project ITP", accept: "≥ 5.0 MPa (Epoxy) / ≥ 3.0 MPa (Alkyd)" }
];

export const PROC_MANUFACTURERS = [
  "AkzoNobel (International Paint)",
  "Jotun",
  "Hempel",
  "PPG Industries",
  "Sherwin-Williams",
  "Carboline",
  "Asian Paints",
  "Sigma Coatings",
  "Kansai Paint",
  "Axalta Coating Systems",
  "Berger Paints"
];

export const PROC_COAT_APP_CATS = [
  {
    title: "Coating Material Control & Mixing",
    items: [
      "All paints shall be stored in dry, covered, flame-proof ventilated stores within 5°C to 35°C.",
      "Multi-component systems shall be power-mixed with explosion-proof agitator until uniform consistency is achieved.",
      "Thinning shall only use manufacturer recommended thinner and shall strictly not exceed TDS limit (typically ≤ 5-10%).",
      "Paints exceeding pot life shall be disposed of immediately."
    ]
  },
  {
    title: "Application Sequence & Stripe Coating",
    items: [
      "Primer shall be applied within holding time (typically ≤ 4 hours) of blast cleaning before flash rust occurs.",
      "Stripe coat by brush on all weld seams, corners, edges, bolts, and crevices prior to each full spray coat.",
      "Airless spray tip size (e.g. 0.017\" - 0.021\") and fluid pressure (2000 - 3000 PSI) adjusted per product TDS.",
      "Maintain cross-spray technique (50% overlap per stroke) to achieve uniform wet film thickness."
    ]
  },
  {
    title: "Curing & Recoat Windows",
    items: [
      "Strictly observe minimum and maximum recoat intervals per manufacturer temperature curves.",
      "If maximum recoat window is exceeded, the surface must be lightly abraded / sweep blasted to restore mechanical key."
    ]
  }
];

export const PROC_REPAIR_PARAS = [
  "All defective or damaged coating areas identified during inspection, testing, handling, or erection shall be repaired promptly in accordance with this approved procedure.",
  "Prior to repair, the damaged area shall be inspected to classify severity: superficial topcoat damage vs bare steel substrate exposure.",
  "Areas exposed to bare metal shall be re-prepared by localized abrasive blasting (Sa 2½) or power tool cleaning to bare metal (SSPC-SP11) with min. 25 µm profile.",
  "Sound coating edges surrounding the repair area shall be feathered over a minimum width of 50 mm to produce a smooth, tapered transition without sharp steps.",
  "Repair coating build shall strictly follow the original coating specification layers (Primer, Intermediate, Topcoat) with compatible thinners.",
  "Each repaired layer shall be inspected for WFT, DFT, and visual quality before applying subsequent coats."
];

export const PROC_ANNEXURES_DEFAULT = [
  { id: "I", name: "Coating Systems Schedule", attached: true, mandatory: true },
  { id: "II", name: "Inspection Instruments & Testing Matrix", attached: true, mandatory: true },
  { id: "III", name: "Coating Sketch & Color Scheme", attached: false, mandatory: false },
  { id: "IV", name: "Sample Blasting & Painting QC Report Format", attached: false, mandatory: false },
  { id: "V", name: "Sample Paint Batch Test Certificates (TC)", attached: false, mandatory: false },
  { id: "VI", name: "Paint Manufacturer Technical Data Sheets (TDS)", attached: false, mandatory: false },
  { id: "VII", name: "Applicator & Inspector Prequalification Certificates", attached: false, mandatory: false },
  { id: "VIII", name: "Client Correspondence & Deviations / Concessions", attached: false, mandatory: false }
];

export const PROC_INSTRUMENTS_DEFAULT = [
  { activity: "Ambient & Surface Temperature", instr: "Digital Hygrometer / Whirling Psychrometer", std: "ISO 8502-4 / ASTM E337", accept: "Steel Temp ≥ DP + 3°C; RH ≤ 85%" },
  { activity: "Blast Air Cleanliness", instr: "Absorbent White Blotter Paper", std: "ASTM D4285", accept: "No visible oil or moisture (1 min exposure)" },
  { activity: "Blast Nozzle Pressure", instr: "Hypodermic Needle Pressure Gauge", std: "SSPC", accept: "90 – 100 PSI at nozzle" },
  { activity: "Surface Cleanliness Assessment", instr: "ISO 8501-1 Pictorial Standards / SSPC VIS-1", std: "ISO 8501-1", accept: "Grade Sa 2½ (Near-white bare metal)" },
  { activity: "Surface Profile Depth", instr: "Testex Press-O-Film Tape & Micrometer / Digital Profile Gauge", std: "ASTM D4417 Method C", accept: "50 – 75 µm (or per specification)" },
  { activity: "Dust Contamination", instr: "Pressure Sensitive Tape & Comparator Chart", std: "ISO 8502-3", accept: "Maximum Class 2 / Size 2" },
  { activity: "Soluble Salt Contamination", instr: "Bresle Patch & Digital Conductivity Meter", std: "ISO 8502-6 & ISO 8502-9", accept: "≤ 20 mg/m² (0.02 g/m²)" },
  { activity: "Wet Film Thickness (WFT)", instr: "Stainless Steel Hexagonal Comb Gauge", std: "ASTM D4414", accept: "Target calculated WFT ± 10%" },
  { activity: "Dry Film Thickness (DFT)", instr: "Type 2 Digital Magnetic Induction Gauge (Calibrated on shims)", std: "SSPC-PA2 / ISO 19840", accept: "80 - 120% of Nominal Specified DFT" },
  { activity: "Coating Adhesion Test", instr: "Hydraulic Pull-off Adhesion Tester (Dolly)", std: "ISO 4624 / ASTM D4541", accept: "≥ 5.0 MPa (Cohesive / Adhesive substrate mode)" },
  { activity: "Holiday Discontinuity Test", instr: "High Voltage Spark Tester / Low Voltage Wet Sponge", std: "NACE SP0188 / ASTM D5162", accept: "Zero holiday sparks at specified test voltage" }
];

export const PROC_PAINT_PRODUCTS_MATRIX = {
  "Inorganic Zinc Silicate Primer": {
    "AkzoNobel (International Paint)": "Interzinc 22 / Interzinc 52",
    "Jotun": "Resist 78 / Resist 86",
    "Hempel": "Galvosil 15700 / Hempadur Zinc 17360",
    "PPG Industries": "Dimetcote 9 / Dimetcote 21-5",
    "Sherwin-Williams": "Zinc Clad II / Zinc Clad XI",
    "Carboline": "Carbozinc 11",
    "Asian Paints": "Apcozinc 200",
    "Sigma Coatings": "SigmaZinc 109 HS",
    "Kansai Paint": "Galva GZ-15",
    "Axalta Coating Systems": "Imron Inorganic Zinc",
    "Berger Paints": "Epilux Zinc Silicate"
  },
  "Organic Zinc Rich Epoxy Primer": {
    "AkzoNobel (International Paint)": "Interzinc 52 / Interzinc 315",
    "Jotun": "Barrier 77 / Barrier 80",
    "Hempel": "Hempadur Zinc 15360",
    "PPG Industries": "Amercoat 68 HS",
    "Sherwin-Williams": "Zinc Clad III HS",
    "Carboline": "Carbozinc 859",
    "Asian Paints": "Apcozinc 308",
    "Sigma Coatings": "SigmaZinc 102 HS",
    "Kansai Paint": "Epomarine ZR-2000",
    "Axalta Coating Systems": "Imron Zinc Rich Epoxy",
    "Berger Paints": "Epilux 78 Zinc Rich"
  },
  "Epoxy Zinc Phosphate Primer": {
    "AkzoNobel (International Paint)": "Intergard 251 / Intergard 269",
    "Jotun": "Penguard Primer / Jotamastic 90",
    "Hempel": "Hempadur 15553 / 45141",
    "PPG Industries": "Amerlock 2 / Amercoat 71",
    "Sherwin-Williams": "Macropoxy 646",
    "Carboline": "Carboguard 893",
    "Asian Paints": "Apcoshield 285",
    "Sigma Coatings": "SigmaCover 280",
    "Kansai Paint": "Epomarine 2000",
    "Axalta Coating Systems": "Imron Epoxy ZP",
    "Berger Paints": "Epilux 4 ZP Primer"
  },
  "Epoxy High Build MIO": {
    "AkzoNobel (International Paint)": "Intergard 475HS MIO",
    "Jotun": "Penguard MIO / Jotamastic 87 MIO",
    "Hempel": "Hempadur MIO 47140",
    "PPG Industries": "Amerlock 400 MIO / Sigmacover 456 MIO",
    "Sherwin-Williams": "Macropoxy MIO",
    "Carboline": "Carbomastic 15 MIO",
    "Asian Paints": "Apcoshield 6000 MIO",
    "Sigma Coatings": "SigmaCover 456 MIO",
    "Kansai Paint": "Epomarine MIO",
    "Axalta Coating Systems": "Imron Epoxy MIO",
    "Berger Paints": "Epilux 610 MIO"
  },
  "Epoxy High Build / Intermediate": {
    "AkzoNobel (International Paint)": "Intergard 475HS",
    "Jotun": "Jotamastic 90 / Penguard Midcoat",
    "Hempel": "Hempadur Mastic 45881",
    "PPG Industries": "Amerlock 400",
    "Sherwin-Williams": "Macropoxy 646",
    "Carboline": "Carboguard 890",
    "Asian Paints": "Apcoshield 6000",
    "Sigma Coatings": "SigmaCover 456",
    "Kansai Paint": "Epomarine HB 5000",
    "Axalta Coating Systems": "Imron Industrial Epoxy",
    "Berger Paints": "Epilux 610 HB"
  },
  "Aliphatic Polyurethane Topcoat": {
    "AkzoNobel (International Paint)": "Interthane 990",
    "Jotun": "Hardtop XP / Hardtop AX",
    "Hempel": "Hempathane HS 55610 / Topcoat 55210",
    "PPG Industries": "Amercoat 450H / PSX 700",
    "Sherwin-Williams": "Acrolon 218 HS",
    "Carboline": "Carbothane 134 HG",
    "Asian Paints": "Apcothane 800",
    "Sigma Coatings": "SigmaDur 550",
    "Kansai Paint": "Marine Urethane MU-500",
    "Axalta Coating Systems": "Imron 2.8 HG",
    "Berger Paints": "Luxol Hi-Gloss PU"
  },
  "Polysiloxane Ultra-Weatherable Finish": {
    "AkzoNobel (International Paint)": "Interfine 979 / Interfine 878",
    "Jotun": "Jotashield Extreme",
    "Hempel": "Hempaxane Light 55030",
    "PPG Industries": "PSX 700 / PSX 805",
    "Sherwin-Williams": "Sher-Loxane 800",
    "Carboline": "Carboxane 2000",
    "Asian Paints": "Apcosil 1000",
    "Sigma Coatings": "SigmaDur 550 PSX",
    "Kansai Paint": "Siloxane PS-800",
    "Axalta Coating Systems": "Imron Polysiloxane",
    "Berger Paints": "Berger Siloxane"
  },
  "High Temperature Silicone Aluminum": {
    "AkzoNobel (International Paint)": "Intertherm 50",
    "Jotun": "Solvalitt / Solvalitt Midtherm",
    "Hempel": "Silicone Aluminum 56910",
    "PPG Industries": "HiTemp 1027",
    "Sherwin-Williams": "Heat-Flex Hi-Temp 1200",
    "Carboline": "Thermaline 4900",
    "Asian Paints": "Apcotherm HR-500",
    "Sigma Coatings": "SigmaTherm 500",
    "Kansai Paint": "Silver Heat HR-600",
    "Axalta Coating Systems": "Imron HT Silicone",
    "Berger Paints": "Heat Resisting HR-500"
  },
  "Epoxy Glass Flake Heavy Duty": {
    "AkzoNobel (International Paint)": "Interzone 954",
    "Jotun": "Marathon 500 / Jotamastic 87 GF",
    "Hempel": "Hempadur Multi-Strength 35530",
    "PPG Industries": "SigmaShield 880 GF",
    "Sherwin-Williams": "Dura-Plate 6100",
    "Carboline": "Carboguard 635 GF",
    "Asian Paints": "Apcoshield 880 GF",
    "Sigma Coatings": "SigmaShield 880 GF",
    "Kansai Paint": "Epomarine GF",
    "Axalta Coating Systems": "Imron Heavy Duty GF",
    "Berger Paints": "Epilux Glass Flake"
  },
  "Epoxy Phenolic Tank Lining": {
    "AkzoNobel (International Paint)": "Interline 850 / Interline 228",
    "Jotun": "Tankguard Storage / Tankguard Special",
    "Hempel": "Hempadur 85671 / 35560",
    "PPG Industries": "Amercoat 90 / Phenicon HS",
    "Sherwin-Williams": "Nova-Plate UHS",
    "Carboline": "Plasite 7122 / Phenoline 187",
    "Asian Paints": "Tankguard EP 850",
    "Sigma Coatings": "SigmaTank 880",
    "Kansai Paint": "Tankcoat EP",
    "Axalta Coating Systems": "Imron Tank Lining",
    "Berger Paints": "Phenolic Lining EP-PH"
  }
};

export const PROC_PAINT_GENERICS = Object.keys(PROC_PAINT_PRODUCTS_MATRIX);

// Pre-populated Industry Standard Coating Procedure Presets (1-Click Fill)
export const PROC_PRESETS = [
  {
    id: "refinery_piping",
    name: "Refinery External Piping & Structural (ISO 12944 C5-High)",
    docNo: "BG-PROC-PIP-001",
    revNo: "0",
    project: "Hydrocarbon Refinery Expansion Project Phase-II",
    client: "Global Petroleum Energy Corp.",
    contractor: "BG Engineering Solutions Pvt Ltd",
    purpose: "This procedure establishes technical requirements for abrasive blast cleaning and application of 3-coat high-durability epoxy/polyurethane protective coating systems on external carbon steel process piping and structural steel.",
    scopeSubstrates: "Carbon Steel Structural Shapes, External Process Pipe spools (2\" to 36\"), Pipe Supports, Valves, and Fittings",
    shopSite: "Shop Blast & Prime (Shop) + Intermediate & Topcoat (Field / Site Erection)",
    tempMin: "10",
    tempMax: "45",
    rhMax: "85",
    dewPointDelta: "3.0",
    surfacePrepMethod: "Near-White Blast Cleaning",
    surfacePrepStd: "ISO 8501-1 Sa 2½ / SSPC-SP10",
    abrasiveType: "Copper Slag / Garnet Grit (Mesh 20/40)",
    profileMin: "50",
    profileMax: "75",
    saltLimit: "20",
    dustClass: "Class 2",
    selectedStandards: ["ISO 8501-1", "ISO 8501-3", "ISO 8502-3", "ISO 8502-4", "ISO 8502-9", "ISO 12944 Series", "ISO 19840", "SSPC-PA2", "SSPC-SP1 / AMPP-SP1", "SSPC-SP10 / AMPP-SP10", "ASTM D4417", "ASTM D4285", "ASTM D4541"],
    selectedManufacturers: ["AkzoNobel (International Paint)", "Jotun", "Hempel", "PPG Industries"],
    coatingSystems: [
      {
        systemId: "SYS-01",
        serviceDesc: "External Atmospheric Carbon Steel (-20°C to 120°C) – Severe Marine / Chemical C5-High",
        surfacePrep: "Abrasive blast to ISO Sa 2½ (SSPC-SP10), Angular profile 50-75 µm",
        coats: [
          { coatNo: 1, genericType: "Organic Zinc Rich Epoxy Primer", dftMin: 60, dftNom: 75, dftMax: 90, thinner: "Epoxy Thinner (max 5%)", recoatMin: "4 hrs @ 25°C", recoatMax: "30 days" },
          { coatNo: 2, genericType: "Epoxy High Build MIO", dftMin: 150, dftNom: 175, dftMax: 200, thinner: "Epoxy Thinner (max 5%)", recoatMin: "6 hrs @ 25°C", recoatMax: "14 days" },
          { coatNo: 3, genericType: "Aliphatic Polyurethane Topcoat", dftMin: 50, dftNom: 60, dftMax: 75, thinner: "PU Thinner (max 5%)", recoatMin: "8 hrs @ 25°C", recoatMax: "N/A" }
        ],
        totalDftNom: 310
      }
    ]
  },
  {
    id: "offshore_splashzone",
    name: "Offshore Platform Splashzone & Jacket Legs (ISO 12944 CX / NORSOK M-501)",
    docNo: "BG-PROC-OFF-002",
    revNo: "A",
    project: "Deepwater Offshore Platform Development Package",
    client: "National Marine Exploration Ltd.",
    contractor: "BG Coating & Corrosion Solutions",
    purpose: "Procedure for surface preparation and high-build glass flake reinforced epoxy barrier coating for marine splashzone, tidal immersion, and heavy wave impact zones.",
    scopeSubstrates: "Heavy Carbon Steel Tubular Legs, Boat Landing Members, Caissons, Bracings",
    shopSite: "Fabrication Yard (Covered Blast & Paint Hall)",
    tempMin: "12",
    tempMax: "40",
    rhMax: "80",
    dewPointDelta: "3.0",
    surfacePrepMethod: "White Metal Blast Cleaning",
    surfacePrepStd: "ISO 8501-1 Sa 3 / SSPC-SP5",
    abrasiveType: "Aluminum Oxide / Garnet 20/40 (Heavy Angular)",
    profileMin: "75",
    profileMax: "100",
    saltLimit: "20",
    dustClass: "Class 1",
    selectedStandards: ["ISO 8501-1", "ISO 8501-3", "ISO 8502-3", "ISO 8502-9", "ISO 12944 Series", "ISO 19840", "ISO 4624", "SSPC-SP5 / AMPP-SP5", "ASTM D4417", "ASTM D4541", "AMPP SP0188"],
    selectedManufacturers: ["AkzoNobel (International Paint)", "Jotun", "Carboline", "PPG Industries"],
    coatingSystems: [
      {
        systemId: "SYS-SPLASH",
        serviceDesc: "Offshore Marine Splashzone & Tidal Immersion (NORSOK M-501 System 7B)",
        surfacePrep: "White Metal Blast ISO Sa 3, Angular profile 75-100 µm, Salt < 20 mg/m²",
        coats: [
          { coatNo: 1, genericType: "Epoxy Glass Flake Heavy Duty", dftMin: 300, dftNom: 350, dftMax: 400, thinner: "Zero thinner (hot spray) / max 3%", recoatMin: "4 hrs @ 25°C", recoatMax: "48 hrs" },
          { coatNo: 2, genericType: "Epoxy Glass Flake Heavy Duty", dftMin: 300, dftNom: 350, dftMax: 400, thinner: "Zero thinner / max 3%", recoatMin: "4 hrs @ 25°C", recoatMax: "48 hrs" },
          { coatNo: 3, genericType: "Aliphatic Polyurethane Topcoat", dftMin: 50, dftNom: 60, dftMax: 75, thinner: "PU Thinner", recoatMin: "6 hrs @ 25°C", recoatMax: "N/A" }
        ],
        totalDftNom: 760
      }
    ]
  },
  {
    id: "tank_internal_lining",
    name: "Crude Oil & Chemical Storage Tank Internal Lining",
    docNo: "BG-PROC-TNK-003",
    revNo: "0",
    project: "Terminal Storage Tank Farm Refurbishment",
    client: "Apex Energy Logistics",
    contractor: "BG Industrial Coating Corp",
    purpose: "Specification and procedure for internal abrasive blasting, soluble salt decontamination, and 2-coat epoxy phenolic lining for aggressive crude oil and produced water storage tanks.",
    scopeSubstrates: "Internal Tank Bottom Plates, Annular Rings, Shell Course 1-3, Sump Well",
    shopSite: "Field Erection (Inside Confined Space Tank Shell)",
    tempMin: "15",
    tempMax: "38",
    rhMax: "75",
    dewPointDelta: "4.0",
    surfacePrepMethod: "White Metal Blast Cleaning",
    surfacePrepStd: "ISO 8501-1 Sa 3 / SSPC-SP5",
    abrasiveType: "Virgin Garnet Grit 30/60 mesh",
    profileMin: "60",
    profileMax: "85",
    saltLimit: "15",
    dustClass: "Class 1",
    selectedStandards: ["ISO 8501-1", "ISO 8501-3", "ISO 8502-3", "ISO 8502-6", "ISO 8502-9", "ISO 19840", "SSPC-SP5 / AMPP-SP5", "ASTM D4417", "ASTM D5162", "ASTM D4752"],
    selectedManufacturers: ["Jotun", "AkzoNobel (International Paint)", "Hempel", "Carboline"],
    coatingSystems: [
      {
        systemId: "SYS-TANK-LINING",
        serviceDesc: "Crude Oil & Produced Water Tank Bottom & 1st Shell Course Internal Immersion (Up to 90°C)",
        surfacePrep: "White Metal Blast Sa 3, Angular anchor 65-85 µm, Soluble salt < 15 mg/m²",
        coats: [
          { coatNo: 1, genericType: "Epoxy Phenolic Tank Lining", dftMin: 150, dftNom: 175, dftMax: 200, thinner: "TDS Approved Phenolic Thinner (max 5%)", recoatMin: "8 hrs @ 25°C", recoatMax: "21 days" },
          { coatNo: 2, genericType: "Epoxy Phenolic Tank Lining", dftMin: 150, dftNom: 175, dftMax: 200, thinner: "TDS Approved Phenolic Thinner (max 5%)", recoatMin: "12 hrs @ 25°C", recoatMax: "Full cure 10 days" }
        ],
        totalDftNom: 350
      }
    ]
  }
];

// Clean Initial State Template
export const INITIAL_PROCEDURE_STATE = {
  // Section 1: Procedure Identity
  docNo: "",
  revNo: "",
  docTitle: "Painting Procedure & Coating Specification",
  projectName: "",
  clientName: "",
  contractorName: "",
  facilityLocation: "",
  preparedBy: "",
  reviewedBy: "",
  approvedBy: "",
  datePrepared: "",
  dateApproved: "",
  revisionHistory: [
    { rev: "A", date: "", desc: "Issued for Internal Review & Quality Check", prep: "", chk: "", app: "" },
    { rev: "0", date: "", desc: "Issued for Client Review and Approval", prep: "", chk: "", app: "" }
  ],

  // Section 2: Scope
  purpose: "",
  scopeSubstrates: "",
  shopSite: "Shop & Field",
  scopeTags: "",
  equipmentList: "",

  // Section 3: Project Reference Documents
  refDocs: [
    { id: 1, title: "Project Coating Specification", docNo: "", rev: "0", source: "Client" },
    { id: 2, title: "Inspection & Test Plan (ITP) for Painting", docNo: "", rev: "0", source: "Contractor" },
    { id: 3, title: "Paint Manufacturer Technical Data Sheets (TDS)", docNo: "", rev: "Current", source: "Vendor" }
  ],

  // Section 4: Reference Coating Standards
  selectedStandards: ["ISO 8501-1", "ISO 8501-3", "ISO 8502-3", "ISO 8502-4", "ISO 8502-9", "ISO 12944 Series", "ISO 19840", "SSPC-PA2", "SSPC-SP1 / AMPP-SP1", "SSPC-SP10 / AMPP-SP10", "ASTM D4417", "ASTM D4285", "ASTM D4541"],

  // Section 5: Blasting & Coating Exclusions
  exclusions: [...PROC_EXCLUSIONS_LIB],

  // Section 6: Safety Requirements & HSE
  safetyCategories: [...PROC_SAFETY_CATS],
  confinedSpaceReqs: "Continuous positive forced ventilation, explosion-proof extraction, multi-gas air monitoring (O2, LEL, H2S, CO), and full-body harnesses with retrieval lines.",

  // Section 7: Surface Preparation & Inspection
  surfacePrepMethod: "Near-White Blast Cleaning",
  surfacePrepStd: "ISO 8501-1 Sa 2½ / SSPC-SP10",
  abrasiveType: "Copper Slag / Garnet Grit",
  profileMin: "50",
  profileMax: "75",
  saltLimit: "20",
  dustClass: "Class 2",
  blotterFrequency: "Every 4 hours and start of each shift",
  holdingTimeHours: "4",

  // Section 8: Coating Application & Inspection
  tempMin: "10",
  tempMax: "45",
  rhMax: "85",
  dewPointDelta: "3.0",
  appMethodPrimary: "Airless Spray",
  stripeCoatMethod: "Brush application on all welds, edges, corners, and bolts",
  wftVerificationMethod: "ASTM D4414 stainless steel comb gauge during spray passes",
  dftStandard: "SSPC-PA2 Level 3 / ISO 19840 80/20 Rule",

  // Section 9: Repair Plan
  repairParas: [...PROC_REPAIR_PARAS],
  featheringWidth: "50 mm minimum taper",
  repairAdhesionReq: "Adhesion pull-off test ASTM D4541 minimum 5.0 MPa on test coupons",

  // Section 10: Approved Paint Manufacturers
  selectedManufacturers: ["AkzoNobel (International Paint)", "Jotun", "Hempel", "PPG Industries", "Sherwin-Williams", "Carboline"],

  // Section 11: Attachments & Annexures Links
  annexures: [...PROC_ANNEXURES_DEFAULT],

  // Annexure I: Coating Systems Schedule
  coatingSystems: [
    {
      systemId: "SYS-01",
      serviceDesc: "External Carbon Steel Piping & Structural – Marine & Industrial Atmospheric (ISO 12944 C5)",
      surfacePrep: "Near-White Blast Cleaning ISO Sa 2½ (SSPC-SP10), Profile 50–75 µm",
      substrate: "Carbon Steel",
      operatingTemp: "-20°C to 120°C",
      coats: [
        { coatNo: 1, genericType: "Organic Zinc Rich Epoxy Primer", dftMin: 60, dftNom: 75, dftMax: 90, thinner: "Approved Epoxy Thinner (max 5%)", recoatMin: "4 hrs @ 25°C", recoatMax: "30 days" },
        { coatNo: 2, genericType: "Epoxy High Build MIO", dftMin: 150, dftNom: 175, dftMax: 200, thinner: "Approved Epoxy Thinner (max 5%)", recoatMin: "6 hrs @ 25°C", recoatMax: "14 days" },
        { coatNo: 3, genericType: "Aliphatic Polyurethane Topcoat", dftMin: 50, dftNom: 60, dftMax: 75, thinner: "Approved PU Thinner (max 5%)", recoatMin: "8 hrs @ 25°C", recoatMax: "N/A" }
      ],
      totalDftNom: 310
    }
  ],

  // Annexure II: Inspection Instruments Matrix
  inspectionInstruments: [...PROC_INSTRUMENTS_DEFAULT]
};
