// BG CoatingOS™ — Coating Specification Reading Master Engineering Database

export const SCOPE_ITEMS = [
  { key: 'painting', name: 'Surface Preparation & Painting', icon: '🛠️', def: 'YES' },
  { key: 'insulation', name: 'Insulation', icon: '🧥', def: 'NO' },
  { key: 'fireproof', name: 'Fire Proofing', icon: '🔥', def: 'NO' },
  { key: 'tsa', name: 'Special Treatment (TSA / FRE / FRP)', icon: '⚡', def: 'NA' },
  { key: 'galv', name: 'Galvanizing', icon: '🔩', def: 'NO' },
  { key: 'pickling', name: 'Pickling & Passivation', icon: '🧪', def: 'NO' },
];

export const COMPONENT_LIST = [
  'Vessel Shell',
  'Cylinder Shell',
  'Channel Head',
  'Process Pipeline',
  'Top Spool',
  'Bottom Spool',
  'Nozzle Necks & Flanges',
  'Support Skirt / Saddle',
  'Structural Steel Frame',
  'Access Platform / Grating',
  'Davit Arm & Pipe',
  'Insulation Support Ring',
  'Hot Box Ring',
  'External Attachments',
  'Dished Head Top',
  'Dished Head Bottom',
  'Storage Tank Shell',
  'Storage Tank Roof',
  'Others'
];

export const SURFACE_PREP_LIST = [
  'SA 1 of ISO 8501-1 (Light Brush-Off)',
  'SA 2 of ISO 8501-1 (Thorough Blast)',
  'SA 2.5 of ISO 8501-1 (Near White Metal — Very Thorough)',
  'SA 3 of ISO 8501-1 (White Metal Blast)',
  'SSPC-SP 1 (Solvent Cleaning / Degreasing)',
  'SSPC-SP 2 (Hand Tool Cleaning)',
  'SSPC-SP 3 (Power Tool Cleaning)',
  'SSPC-SP 5 (White Metal Blast Cleaning)',
  'SSPC-SP 6 (Commercial Blast Cleaning)',
  'SSPC-SP 10 (Near-White Metal Blast Cleaning)',
  'SSPC-SP 11 (Power Tool Cleaning to Bare Metal)',
  'SSPC-SP 16 (Brush-Off Blast for Non-Ferrous & Stainless)',
  'NACE No. 1 / SSPC-SP 5 (White Metal)',
  'NACE No. 2 / SSPC-SP 10 (Near White Metal)',
  'NACE No. 3 / SSPC-SP 6 (Commercial Blast)',
  'ISO 8504-2 (Abrasive Blast Cleaning)',
  'NA'
];

export const PAINT_TYPES = [
  'NA',
  'Inorganic Zinc Silicate Primer',
  'Organic Zinc Rich Epoxy Primer',
  'Epoxy Zinc Phosphate Primer',
  'Red Oxide Primer',
  'Epoxy High Build',
  'Epoxy MIO (Micaceous Iron Oxide)',
  'Epoxy Glass Flake',
  'Epoxy Phenolic / Novolac',
  'Polyurethane (Aliphatic PU)',
  'Acrylic Polyurethane',
  'Multipolymeric Matrix / TiO2 Based (CUI Resistant)',
  'Polysiloxane (Ultra High Durability)',
  'High Temperature Silicone Aluminum',
  'Acrylic Finish',
  'Fusion Bonded Epoxy (FBE)',
  'Coal Tar Epoxy',
  'Thermal Spray Aluminum (TSA)',
  'Intumescent Fireproof Coating (Epoxy PFP)',
  'Insulation Coating',
  'FRE / FRP Lining',
  'Special Coating'
];

export const PAINT_DB = [
  {
    gen: 'Inorganic Zinc Silicate Primer',
    prods: {
      int: 'Interzinc 22 / 52',
      jot: 'Resist 78 / 86',
      asn: 'Zincsil 100',
      cbl: 'Carbozinc 11',
      hmp: 'Hempadur Zinc 17360',
      sgm: 'SigmaZinc 109 HS'
    }
  },
  {
    gen: 'Organic Zinc Rich Epoxy Primer',
    prods: {
      int: 'Interzinc 52 / 72',
      jot: 'Barrier 77 / 80',
      asn: 'Amercoat 68HS',
      cbl: 'Carbozinc 859',
      hmp: 'Hempadur Zinc 17360',
      sgm: 'SigmaZinc 109'
    }
  },
  {
    gen: 'Epoxy Zinc Phosphate Primer',
    prods: {
      int: 'Intergard 251',
      jot: 'Penguard Primer',
      asn: 'Amerlock 2',
      cbl: 'Carbomastic 15',
      hmp: 'Hempadur 45141',
      sgm: 'SigmaCover 280'
    }
  },
  {
    gen: 'Red Oxide Primer',
    prods: {
      int: 'Interprime 198',
      jot: 'Pilot Primer',
      asn: 'GP Red Oxide',
      cbl: 'Carboquick 200',
      hmp: 'Hempain Primer',
      sgm: 'Sigma Prime 200'
    }
  },
  {
    gen: 'Epoxy High Build',
    prods: {
      int: 'Intergard 475HS',
      jot: 'Jotamastic 90',
      asn: 'Amerlock 400',
      cbl: 'Carbomastic 615',
      hmp: 'Hempadur 45751',
      sgm: 'SigmaCover 456'
    }
  },
  {
    gen: 'Epoxy MIO (Micaceous Iron Oxide)',
    prods: {
      int: 'Intergard 475MIO',
      jot: 'Penguard Midcoat MIO',
      asn: 'Amerlock 400 MIO',
      cbl: 'Carbomastic 15 MIO',
      hmp: 'Hempadur MIO',
      sgm: 'SigmaCover MIO'
    }
  },
  {
    gen: 'Epoxy Glass Flake',
    prods: {
      int: 'Interzone 954',
      jot: 'Baltoflake / Marathon',
      asn: 'Amercoat 385',
      cbl: 'Carboguard 635 GF',
      hmp: 'Hempadur GF',
      sgm: 'SigmaShield 880 GF'
    }
  },
  {
    gen: 'Epoxy Phenolic / Novolac',
    prods: {
      int: 'Interline 850 / 984',
      jot: 'Tankguard Storage',
      asn: 'Amercoat 90 / Novoguard',
      cbl: 'Plasite 7122 / 4500',
      hmp: 'Hempadur 35560',
      sgm: 'SigmaTank 880'
    }
  },
  {
    gen: 'Polyurethane (Aliphatic PU)',
    prods: {
      int: 'Interthane 990',
      jot: 'Hardtop XP / CA',
      asn: 'PSX 700',
      cbl: 'Carbothane 134HG',
      hmp: 'Hempathane HS 55610',
      sgm: 'SigmaDur 550'
    }
  },
  {
    gen: 'Acrylic Polyurethane',
    prods: {
      int: 'Interthane 870',
      jot: 'Hardtop AX',
      asn: 'PSX 700 (alt)',
      cbl: 'Carbothane 133',
      hmp: 'Hempathane Topcoat',
      sgm: 'SigmaDur 520'
    }
  },
  {
    gen: 'Multipolymeric Matrix / TiO2 Based (CUI Resistant)',
    prods: {
      int: 'Interbond 1202 UPC',
      jot: 'Jotatemp 1000',
      asn: 'Hi-Temp 1027',
      cbl: 'Thermaline Heat Shield',
      hmp: 'Versiline CUI 56990',
      sgm: 'Hi-Temp 1027'
    }
  },
  {
    gen: 'Polysiloxane (Ultra High Durability)',
    prods: {
      int: 'Interfine 979',
      jot: 'Hardtop Pro / PSX',
      asn: 'PSX 700 / 1001',
      cbl: 'Carboxane 2000',
      hmp: 'Hempadur Avantguard',
      sgm: 'SigmaDur 550 PSX'
    }
  },
  {
    gen: 'High Temperature Silicone Aluminum',
    prods: {
      int: 'Intertherm 50 / 751',
      jot: 'Solvalitt Alu',
      asn: 'Heat Resisting Alu',
      cbl: 'Thermaline 4700',
      hmp: 'Hempasil Silicone',
      sgm: 'SigmaTherm 500'
    }
  },
  {
    gen: 'Acrylic Finish',
    prods: {
      int: 'Intercryl 525',
      jot: 'Pilot II',
      asn: 'GP Acrylic Finish',
      cbl: 'Carboquick 200',
      hmp: 'Hempatex',
      sgm: 'SigmaFast 20'
    }
  },
  {
    gen: 'Fusion Bonded Epoxy (FBE)',
    prods: {
      int: 'Interline FBE',
      jot: 'Jotun FBE Powder',
      asn: 'Nap-Gard FBE',
      cbl: 'Pipe Coating FBE',
      hmp: 'Hempadur FBE',
      sgm: 'Sigma FBE'
    }
  },
  {
    gen: 'Coal Tar Epoxy',
    prods: {
      int: 'Intertuf 262',
      jot: 'Jotun CTE 100',
      asn: 'Amercoat 78',
      cbl: 'Bitumastic 300M',
      hmp: 'Hempadur CTE',
      sgm: 'SigmaCover Tar'
    }
  },
  {
    gen: 'Thermal Spray Aluminum (TSA)',
    prods: {
      int: 'TSA 99.5% Al Wire + Silicone Sealer',
      jot: 'TSA Wire + Jotatemp Sealer',
      asn: 'TSA 1050 Wire + Sealer',
      cbl: 'TSA Thermal Spray System',
      hmp: 'TSA Metallizing + Sealer',
      sgm: 'TSA Standard System'
    }
  },
  {
    gen: 'Intumescent Fireproof Coating (Epoxy PFP)',
    prods: {
      int: 'Chartek 7 / 1709 / 2218',
      jot: 'Jotachar JF750 / 1709',
      asn: 'Pitt-Char XP / Steelguard',
      cbl: 'Thermo-Lag 3000',
      hmp: 'Hempacore One',
      sgm: 'Steelguard 801 / 851'
    }
  }
];

export const CORROSIVITY_ENVIRONMENTS = [
  { id: 'C1', name: 'C1 — Very Low', ext: 'Heated buildings with clean atmospheres (offices, schools, hotels)', massLoss: '< 10 g/m² (≤ 1.3 µm/yr)' },
  { id: 'C2', name: 'C2 — Low', ext: 'Unheated buildings, rural areas with low pollution', massLoss: '10–200 g/m² (1.3–25 µm/yr)' },
  { id: 'C3', name: 'C3 — Medium', ext: 'Urban & industrial atmospheres, moderate SO2; coastal low salinity', massLoss: '200–400 g/m² (25–50 µm/yr)' },
  { id: 'C4', name: 'C4 — High', ext: 'Industrial areas and coastal areas with moderate salt exposure', massLoss: '400–650 g/m² (50–80 µm/yr)' },
  { id: 'C5', name: 'C5 — Very High', ext: 'Aggressive industrial environments and marine areas with high salinity', massLoss: '650–1500 g/m² (80–200 µm/yr)' },
  { id: 'CX', name: 'CX — Extreme', ext: 'Offshore platforms with high salinity, extreme tropical/marine exposure', massLoss: '> 1500 g/m² (> 200 µm/yr)' },
  { id: 'Im1', name: 'Im1 — Immersion', ext: 'Freshwater installations (river works, hydro plants)', massLoss: 'Immersion Category' },
  { id: 'Im2', name: 'Im2 — Immersion', ext: 'Sea or brackish water installations (harbours, jetties, locks)', massLoss: 'High Salinity Immersion' },
  { id: 'Im3', name: 'Im3 — Soil Immersion', ext: 'Buried pipelines, underground tanks, steel piling', massLoss: 'Soil Aggressiveness' },
  { id: 'Im4', name: 'Im4 — Immersion with CP', ext: 'Sea/brackish water with active Cathodic Protection', massLoss: 'CP Compatible' }
];

export const INSULATION_TYPES = [
  'Mineral Wool / Rockwool',
  'Calcium Silicate',
  'Cellular Glass (Foamglas)',
  'Glass Wool',
  'Aerogel Pyrogel / Cryogel',
  'Polyurethane Foam (PUF)',
  'Polyisocyanurate (PIR)',
  'Expanded Perlite',
  'Ceramic Fiber Blanket',
  'Microporous Insulation',
  'Vacuum Insulation Panel (VIP)',
  'Others (specify)'
];

export const FIREPROOFING_TYPES = [
  'Epoxy Intumescent (Chartek 7 / Jotachar JF750)',
  'Thin Film Intumescent (Acrylic / Water-Based)',
  'Lightweight Cementitious (Fendolite MII / Pyrocrete 241)',
  'Dense Concrete Encasement',
  'Vermiculite Cementitious',
  'Magnesium Oxychloride Board',
  'Subliming PFP Compound',
  'Mineral Wool Fire Blanket / Board',
  'Calcium Silicate Fire Board',
  'Others (specify)'
];

export const TSA_TYPES = [
  'Thermal Spray Aluminum (TSA 99.5% Al per ISO 2063 / NACE SP0198)',
  'Thermal Spray Zinc (TSZ 99.9% Zn)',
  'Thermal Spray 85/15 Zinc-Aluminum Alloy (TSZA)',
  'Fiberglass Reinforced Epoxy (FRE Lining)',
  'Fiberglass Reinforced Plastic (FRP Lining)',
  'Glass Flake Vinyl Ester Heavy Lining',
  'High-Build Phenolic Novolac Lining',
  'Fluoropolymer Lining (PTFE / ETFE / PVDF)',
  'Rubber Lining (Hard / Soft Ebonite)',
  'Others (specify)'
];

export const GALVANIZING_TYPES = [
  'Hot-Dip Galvanizing (HDG) — ASTM A123 (Structural Steel & Plates)',
  'Hot-Dip Galvanizing — ASTM A153 / F2329 (Fasteners & Hardware)',
  'Continuous Sheet Galvanizing — ASTM A653 / ISO 3575',
  'Mechanical Galvanizing — ASTM B695',
  'Electroplated Zinc — ASTM B633',
  'Sherardizing (Thermal Diffusion) — ASTM A1059 / BS EN 13811',
  'Zinc Metallizing (Zinc Thermal Spray)',
  'Others (specify)'
];

export const PICKLING_TYPES = [
  'Chemical Acid Pickling (HF + HNO3) per ASTM A380',
  'Citric Acid Passivation per ASTM A967',
  'Nitric Acid Passivation per ASTM A967 / QQ-P-35',
  'Sulphuric Acid Pickling with Neutralization',
  'Hydrochloric Acid Tank Pickling',
  'Electropolishing (High Purity Stainless)',
  'Pickling Paste / Gel (Weld Seams & Heat Affected Zones)',
  'Others (specify)'
];

export const STANDARD_PRESETS = [
  {
    id: 'iso_12944_c5_cx',
    title: 'ISO 12944-5 — C5/CX Offshore Marine (3-Coat System)',
    desc: 'Zinc Primer (60µm) + Epoxy MIO (200µm) + Aliphatic PU (60µm) = 320µm DFT',
    env: 'CX',
    durability: 'H',
    surfacePrep: 'SA 2.5 of ISO 8501-1 (Near White Metal — Very Thorough)',
    profile: '50–75',
    primer: 'Inorganic Zinc Silicate Primer',
    primerDft: 60,
    intermediate: 'Epoxy MIO (Micaceous Iron Oxide)',
    intermediateDft: 200,
    finish: 'Polyurethane (Aliphatic PU)',
    finishDft: 60
  },
  {
    id: 'norsok_m501_sys1',
    title: 'NORSOK M-501 System 1 — Carbon Steel ≤ 120°C',
    desc: 'Zinc Epoxy (60µm) + Epoxy (200µm) + Polyurethane (60µm) = 320µm DFT with pre-qualification test',
    env: 'CX',
    durability: 'VH',
    surfacePrep: 'SA 2.5 of ISO 8501-1 (Near White Metal — Very Thorough)',
    profile: '50–85',
    primer: 'Organic Zinc Rich Epoxy Primer',
    primerDft: 60,
    intermediate: 'Epoxy High Build',
    intermediateDft: 200,
    finish: 'Polyurethane (Aliphatic PU)',
    finishDft: 60
  },
  {
    id: 'aramco_apcs_1b',
    title: 'Saudi Aramco SAES-H-001 APCS-1B — Severe Offshore',
    desc: 'Zinc Silicate (65–100µm) + Polyamide Epoxy (125–175µm) + Aliphatic PU (50–75µm)',
    env: 'C5',
    durability: 'H',
    surfacePrep: 'SA 3 of ISO 8501-1 (White Metal Blast)',
    profile: '40–65',
    primer: 'Inorganic Zinc Silicate Primer',
    primerDft: 75,
    intermediate: 'Epoxy High Build',
    intermediateDft: 150,
    finish: 'Polyurethane (Aliphatic PU)',
    finishDft: 65
  },
  {
    id: 'cui_high_temp',
    title: 'NACE SP0198 System CS-6 — CUI Insulation (-45°C to 540°C)',
    desc: 'Multipolymeric Matrix / Inert Flake Copolymer (2 × 100µm = 200µm DFT)',
    env: 'C5',
    durability: 'VH',
    surfacePrep: 'SA 2.5 of ISO 8501-1 (Near White Metal — Very Thorough)',
    profile: '35–50',
    primer: 'Multipolymeric Matrix / TiO2 Based (CUI Resistant)',
    primerDft: 100,
    intermediate: 'Multipolymeric Matrix / TiO2 Based (CUI Resistant)',
    intermediateDft: 100,
    finish: 'NA',
    finishDft: 0
  }
];
