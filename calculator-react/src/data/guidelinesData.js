// ────────────────────────────────────────────────────────────────────────────────
// BG COATINGOS™ — COMPLETE TECHNICAL GUIDELINE SYSTEM
// Verbatim extracted from reference specification engine
// ────────────────────────────────────────────────────────────────────────────────

export const GUIDELINES_DATA = {
  // ──────────────────────────────────────────────────────────────────────────────
  // EXECUTIVE PRO & SPECIALIZED MODULES (28 PRO Tools)
  // ──────────────────────────────────────────────────────────────────────────────
  'vs-tds': {
    title: 'Volume Solids — TDS Verification',
    about: 'Cross-checks the paint manufacturer’s Technical Data Sheet (TDS) for internal consistency. Every TDS publishes DFT, theoretical coverage and volume solids — these three are mathematically linked by VS% = (DFT × Coverage) ÷ 10. If they do not reconcile, either the TDS has an error or the coverage is quoted at a different DFT. Use this before approving any product data sheet, during bid evaluation, and when preparing consumption estimates.',
    f: [
      ['DFT (from TDS)', 'Enter the dry film thickness at which the manufacturer quotes the theoretical coverage — always read them as a pair from the same TDS line.', 'Unit: µm · Accepted: > 0 · Example: 125 µm', 'All three TDS values must refer to the same film build; mixing DFT from one line with coverage from another gives a false failure.'],
      ['Theoretical Coverage', 'Enter the theoretical spreading rate printed on the TDS (no losses).', 'Unit: m²/L · Accepted: > 0 · Example: 5.6 m²/L', 'Theoretical coverage assumes zero loss — never use practical/site coverage here or the calculated VS will be far too low.'],
      ['Published Volume Solids', 'Optional — the VS% printed on the TDS. Leave blank to simply calculate VS from DFT × coverage.', 'Unit: % · Accepted: 1–100 · Example: 70%', 'Entering it activates the PASS / REVIEW / FAIL verification against your calculated value.'],
      ['Product Name', 'Optional identification for the report.', 'Text · Example: High-Build Epoxy Mastic', 'Keeps the printed/shared report traceable to the exact product and batch of documents reviewed.']
    ],
    out: [
      ['Calculated Volume Solids', 'VS derived from DFT × Coverage ÷ 10 — what the TDS numbers really imply.'],
      ['Difference / Deviation', 'Gap between calculated and published VS. < ±2% PASS · 2–5% REVIEW (ask the manufacturer to clarify) · > 5% FAIL (reject or obtain corrected TDS).'],
      ['Classification', 'Solvent-free > 90% · Ultra-high 80–90 · High 70–80 · Medium-high 60–70 · Conventional 50–60 · Low < 50.']
    ],
    tips: [
      'Always take DFT and coverage from the same row of the TDS.',
      'A REVIEW result is common when coverage is rounded — request the exact figure.',
      'For 2-pack products verify VS is quoted for the mixed product, not the base alone.'
    ],
    refs: 'ASTM D2697 · ISO 3233 · manufacturer TDS'
  },

  'vs-den': {
    title: 'Volume Solids — Density Method',
    about: 'Calculates volume solids the way paint manufacturers do — from weight solids and the ratio of wet to dry film density (VS = WS% × Wet ÷ Dry). Use it when the TDS gives weight solids but not volume solids, or to verify a supplier’s claimed VS from basic laboratory density data.',
    f: [
      ['Weight Solids', 'Non-volatile matter by weight from the TDS or ASTM D2369 test.', 'Unit: % · Accepted: 1–100 · Example: 80%', 'Weight solids alone overstates the useful film — dense pigments weigh a lot but the film is built by volume.'],
      ['Wet Paint Density', 'Density of the mixed liquid paint (ASTM D1475 weight-per-gallon cup).', 'Unit: kg/L · Accepted: 0.8–2.5 typical · Example: 1.60', 'Converts the weight fraction into a volume fraction.'],
      ['Dry Film Density', 'Density of the fully cured film (from lab measurement or manufacturer data).', 'Unit: kg/L · Accepted: > wet density is unusual for solvent-borne — typically 1.2–2.2 · Example: 1.80', 'The denominator of the conversion; an inflated dry density understates VS.'],
      ['Published Volume Solids', 'Optional TDS value to verify against.', 'Unit: % · Example: 71%', 'Activates PASS/REVIEW/FAIL verification exactly as in the TDS method.']
    ],
    out: [
      ['Calculated VS', 'WS × Wet ÷ Dry. Example: 0.80 × 1.60 ÷ 1.80 = 71.1%.'],
      ['Status', '< ±2% PASS · 2–5% REVIEW · > 5% FAIL against the published value.']
    ],
    tips: [
      'Measure wet density on the fully mixed product at 23 °C.',
      'If VS calculates above 100%, one of the densities is wrong — usually dry film density measured with voids.'
    ],
    refs: 'ASTM D1475 · ASTM D2369 · ASTM D2697'
  },

  'vs-lab': {
    title: 'Volume Solids — Laboratory (ASTM D2697 / ISO 3233)',
    about: 'The referee method. A weighed film is applied to a dish, dried/cured, and the dry film volume is measured (displacement). Volume solids = dry film volume ÷ wet paint volume × 100. Use this to settle disputes, qualify new suppliers, or audit batch consistency.',
    f: [
      ['Weight of Empty Dish', 'Tare weight of the clean, dry test dish/disc.', 'Unit: g · 3-decimal balance recommended · Example: 25.000 g', 'Every subsequent weight is relative to this tare — record it carefully.'],
      ['Dish + Wet Paint', 'Weight immediately after applying the wet paint sample.', 'Unit: g · Must exceed empty dish · Example: 30.000 g', 'Gives the wet paint weight (step 1).'],
      ['Dish + Dry Film', 'Weight after full cure/drying per the standard’s schedule.', 'Unit: g · Must be ≥ empty dish and ≤ dish+wet · Example: 29.000 g', 'Gives the dry film weight; also yields weight solids (NV%) as a bonus check.'],
      ['Wet Paint Density', 'Mixed paint density (ASTM D1475).', 'Unit: kg/L (= g/cm³) · Example: 1.60', 'Converts wet weight to wet volume (g ÷ g/cm³ = cm³).'],
      ['Measured Dry Film Volume', 'Dry film volume from displacement per D2697/ISO 3233.', 'Unit: cm³ · Example: 2.200 cm³', 'This measured volume is what makes the lab method authoritative.'],
      ['Published VS', 'Optional TDS value for the PASS/REVIEW/FAIL comparison.', 'Unit: % · Example: 70%', 'Verification against the manufacturer claim.']
    ],
    out: [
      ['Volume Solids (Lab)', 'Dry volume ÷ wet volume × 100 — the definitive figure.'],
      ['Weight Solids (NV%)', 'Dry weight ÷ wet weight × 100 — cross-check against ASTM D2369/TDS.'],
      ['Dry Film Density', 'Derived dry weight ÷ dry volume — sanity-check against typical 1.2–2.2 kg/L.']
    ],
    tips: [
      'Cure fully before the dry weighing — retained solvent inflates VS.',
      'Run duplicates; D2697 repeatability is about ±1–2%.',
      'Guard rails: the calculator rejects dry weight > wet weight automatically.'
    ],
    refs: 'ASTM D2697 · ISO 3233 · ASTM D1475 · ASTM D2369'
  },

  'pro-recon': {
    title: 'Paint Reconciliation',
    about: 'Closes the loop between what the job SHOULD have used and what it ACTUALLY used. It computes the practical paint requirement from area, DFT, VS and loss factor, then reconciles it against store records (issued, returned, unused, rejected, spillage) to reveal savings or excess, with financial impact and root-cause guidance. Run it per coat, per structure, or at project close-out.',
    f: [
      ['Project Information (A)', 'Project, client, contractor, manufacturer, product, coat number, report date — all optional identifiers.', 'Text / date', 'Makes the reconciliation report an auditable QA/QC document.'],
      ['Surface Area Painted', 'Actual area coated in the period being reconciled.', 'Unit: m² · Example: 2500', 'The basis of the theoretical requirement — use measured/verified area, not tender area.'],
      ['Specified DFT', 'The DFT for this coat per the paint specification.', 'Unit: µm · Example: 125', 'Requirement scales linearly with DFT.'],
      ['Volume Solids', 'From the product TDS (verify with the Volume Solids calculators!).', 'Unit: % · Example: 70', 'Determines theoretical coverage: VS × 10 ÷ DFT.'],
      ['Loss Factor', 'Expected total application loss — overspray, container residue, wastage.', 'Unit: % · Default 15 · Ref: brush/roller 5–10 · airless on structure 20–30 · spray on pipe/lattice 30–50', 'Converts theoretical to practical requirement — the fair baseline for judging consumption.'],
      ['Material Issue Details (C)', 'Opening stock, received, issued to site, returned, unused in containers, rejected, spillage, thinner. Total Available auto-calculates.', 'Unit: L · litres per store records', 'Actual consumption = Issued − Returned − Unused; losses = Spillage + Rejected. Accurate store logs are the backbone of reconciliation.'],
      ['Density & Cost (D–E)', 'Optional: density converts litres to kg; ₹/L prices the variance.', 'kg/L · ₹/L', 'Turns the litre variance into weight for records and money for management.']
    ],
    out: [
      ['Variance & Variance %', 'Total actual minus practical requirement. ±0–5% Excellent · 5–10% Acceptable · 10–15% Review · > 15% Investigate.'],
      ['Saving vs Excess', 'Negative variance = saving — but the calculator reminds you to verify DFT was achieved (under-consumption may mean under-application).'],
      ['Root Cause list', 'Appears automatically above 10% excess — 15 typical causes from profile to pot life.'],
      ['Charts', 'Material flow strip, theoretical-vs-actual bars, and the issued-paint pie (consumed/returned/unused/wastage).']
    ],
    tips: [
      'Reconcile coat-by-coat; mixing coats hides which product overran.',
      'Returned and unused paint must be measured, not guessed.',
      'Large savings deserve as much scrutiny as large excesses.'
    ],
    refs: 'ISO 12944 · ISO 19840 · SSPC-PA Guide · ASTM D3276 / D4414 · AMPP GPP'
  },

  'pro-lcc': {
    title: 'Coating Life Cycle Cost (LCC)',
    about: 'Total Cost of Ownership over the asset design life: initial application + inspections + routine maintenance + repairs + recoating campaigns + shutdown/optional costs — annualised and per m², with optional NPV discounting. The core message: the cheapest coating today is rarely the cheapest over 25 years.',
    f: [
      ['Environment (ISO 12944)', 'Select the corrosivity category — C1 to CX, or Im1–Im4 for immersion.', 'Dropdown', 'Documents the exposure basis of the expected coating life you enter.'],
      ['Surface Area / Design Life / Coating Life', 'Asset area, how long the asset must serve, and how long the coating system realistically lasts in that environment.', 'm² · years · years · Example: 5000 / 25 / 15', 'Design ÷ coating life drives the number of recoating campaigns — the single biggest LCC lever.'],
      ['Recoating Cycles', 'Leave blank for auto (⌈Design ÷ Coating life⌉ − 1) or type a manual value.', 'Integer ≥ 0', 'Override when a partial life extension or planned demolition changes the campaign count.'],
      ['Initial Cost components (C)', 'Paint, surface prep, labour, equipment, scaffolding, initial QA, other — enter what applies.', '₹ · at least one required', 'The year-0 investment; high-solids systems typically cost more here and win later.'],
      ['Maintenance Details (D)', 'Interval (years) and cost for inspections, routine maintenance and repairs; cost per major recoat.', 'years + ₹ per event', 'Event counts = ⌊Design life ÷ interval⌋; recoats also trigger the shutdown cost.'],
      ['Economic Factors (E)', 'Inflation, discount and escalation rates — set Discount > 0 to enable NPV.', '%/yr · optional', 'NPV discounts every future event at its actual year — the finance-grade comparison.'],
      ['Optional Costs (F)', 'Shutdown ₹ per recoat event, access, waste disposal, environmental compliance, safety.', '₹', 'Production loss during recoating often dwarfs the paint cost — include it for honest comparisons.']
    ],
    out: [
      ['Total LCC / Annual / per m²', 'The three management numbers; classification by coating life (Premium > 25 yr … Economy < 5 yr).'],
      ['Charts', 'Cost pie, cumulative year-by-year timeline, and the 4-lane maintenance schedule (inspection/maintenance/repair/recoat dots).'],
      ['Comparative Analysis', 'Calculate System A, click “Add to Comparison”, repeat for B and C — the lowest total LCC is crowned Best Value 🏆.']
    ],
    tips: [
      'Compare systems on identical design life and environment.',
      'Include shutdown cost — it decides most refinery/offshore comparisons.',
      'Use the comparison table in bid meetings; it speaks for itself.'
    ],
    refs: 'ISO 12944 · ISO 55000 · NORSOK M-501 · API RP 652/651 · API 653 · SSPC'
  },

  'pro-abp': {
    title: 'Abrasive Size & Blast Profile',
    about: 'Predicts the anchor profile you will achieve from abrasive type + grade + operating parameters, before you blast. The database midpoint profile is adjusted by seven transparent factors (pressure, nozzle size & type, stand-off, angle, surface condition, steel hardness). Use it to select the right grit for a specified profile and to troubleshoot profiles that come out wrong.',
    f: [
      ['Abrasive Type & Grade', 'Choose the media, then the grade — the dropdown shows each grade’s typical profile and particle size. Mix mode opens separate grit and shot grades plus a mix ratio.', 'Dropdowns · Example: Steel Grit G25 (50–70 µm)', 'Particle size is the dominant profile driver; the built-in database is editable in the code.'],
      ['Mix Ratio (mix only)', '% of grit in a grit+shot working mix.', '% · Default 70', 'Profile is the weighted average — more grit = sharper, deeper profile.'],
      ['Blast Pressure', 'Pressure AT THE NOZZLE (not the compressor gauge).', 'bar · Ref 7.0 · Accepted 2–12 · ±3%/bar effect', 'Every 0.1 bar lost in hoses costs productivity and profile; the calculator warns when outside the grade’s recommended window.'],
      ['Nozzle Diameter & Type', 'Bore in mm and Venturi vs Straight.', 'mm · Ref 9.5 · Venturi +5% profile', 'Venturi nozzles accelerate media ~ +10% velocity; worn nozzles behave like larger bores at lower pressure.'],
      ['Stand-off Distance', 'Nozzle-to-surface distance.', 'mm · Ref 450 · Accepted 100–1200', 'Beyond ~450 mm particle energy decays and profile drops (up to −15%+).'],
      ['Blast Angle', 'Angle between the blast stream and the surface.', '° · Ref 90 · Accepted 30–90', 'Oblique blasting cuts peak profile by up to 35% — a common cause of “low profile” findings on lattice steel.'],
      ['Surface Condition & Hardness', 'New / rusted / old coating, and steel hardness class.', 'Dropdowns', 'Pitted rusted steel reads higher; hard steels (> 300 HB) take ~15% less profile from the same media.'],
      ['Target Profile Min/Max', 'Optional — the profile band from your coating specification.', 'µm · Example: 50–75', 'Enables the Too-Low / Too-High warnings AND the automatic alternative-grade recommendation.']
    ],
    out: [
      ['Expected Profile & band', 'Adjusted midpoint with min–max band, classified (Very Fine … Very Coarse) plus the ISO 8503 comparator segment.'],
      ['Master Chart', 'All 35 grades across 5 abrasive families as range bars, your grade highlighted, your adjusted value marked in black.'],
      ['Downstream numbers', 'Recommended DFT (≥ 1.5× profile), ISO 19840 correction (+10/25/40 µm), dead-volume paint demand, consumption kg/m², productivity m²/hr, achievable Sa grade.']
    ],
    tips: [
      'Always verify on site with replica tape or stylus per ASTM D4417 / ISO 8503-5.',
      'If profile misses the target, change GRADE first, pressure second.',
      'Recycled steel grit rounds off over time — working-mix profile drifts down.'
    ],
    refs: 'ISO 8501 · ISO 8503 · ASTM D4417 · SSPC-SP series · AMPP/NACE'
  },

  'pro-arc': {
    title: 'Abrasive Recycling',
    about: 'Measures the health of a recyclable-abrasive operation: recovery rate, recycling efficiency, reusable quantity, fresh makeup, waste and cost saving — benchmarked against an editable database of expected values per abrasive (steel media hundreds of cycles; slags essentially expendable). Run it per shift, per week, or per blast-room audit.',
    f: [
      ['Abrasive Type', 'Select from 11 media types.', 'Dropdown', 'Every warning is benchmark-relative: 40% breakdown is normal for copper slag but a crisis for steel grit.'],
      ['Recycling Cycles', 'How many recovery/reuse cycles the charge has completed.', 'Integer · optional', 'Compared against the typical recycling life in the database.'],
      ['Fresh Abrasive Charged', 'Total fresh media put into the system in the period.', 'kg · Example: 2000', 'The mass-balance denominator.'],
      ['Recovered Abrasive', 'Media collected by the recovery system (floor, elevator, separator).', 'kg · must be ≤ fresh charged', 'Recovery ÷ charged = recovery rate; the guard rejects impossible balances.'],
      ['Waste & Dust Collected', 'Weighed skip/waste and dust-collector discharge.', 'kg · Defaults 0', 'Waste% flags housekeeping and media breakdown; dust > 5% of charge triggers the fines/filter warning.'],
      ['Rejection %', 'Fraction of RECOVERED media rejected by the classifier (fines, contamination).', '% of recovered · Example: 3', 'Reusable = recovered − rejected; efficiency = reusable ÷ recovered.'],
      ['Cost & Area', 'Optional ₹/kg and blasted m².', '₹/kg · m²', 'Prices the saving vs expendable use and gives kg/m² consumption.']
    ],
    out: [
      ['Recycling Efficiency', '> 95 Excellent · 90–95 Very Good · 80–90 Good · 70–80 Fair · < 70 Poor (investigate).'],
      ['Fresh Makeup', 'Charged − reusable — what you must buy to hold the operating mix.'],
      ['Charts', 'Mass-balance flow strip, fresh-charge pie (reusable/rejected/waste/dust/unaccounted) and actual-vs-benchmark bars.'],
      ['Unaccounted Loss', 'Mass not recovered or weighed — embedded, floor loss, carry-out. Chase it; it is money.']
    ],
    tips: [
      'Weigh, do not estimate — especially returns and dust drums.',
      'High rejection on steel media usually means over-pressure or worn separator air-wash.',
      'Track efficiency weekly; a slow downward trend predicts separator maintenance.'
    ],
    refs: 'ISO 11124 · ISO 11126 · ISO 8504 · AMPP/SSPC blasting practice'
  },

  'pro-dcc': {
    title: 'Dust Collector Capacity',
    about: 'Sizes the dust collection system for a blast room from three simultaneous design bases — air changes per hour, cross-draft face velocity, and nozzle/compressor air discharge — takes the greatest, adds a safety factor, then selects filter area, fan motor and a standard collector model from the built-in database. Use it for new facilities and for auditing rooms with visibility problems.',
    f: [
      ['Room L × W × H', 'Internal blast room dimensions.', 'm · Example: 12 × 6 × 5', 'Volume drives the ACH basis; W × H is the cross-draft face for the velocity basis.'],
      ['Nozzles & Diameter', 'Count and bore of blast nozzles operating simultaneously.', 'nos + mm dropdown (6–12.5 mm with CFM shown)', 'Each nozzle discharges compressed air into the room that the collector must extract (pressure-corrected from 7-bar values).'],
      ['Compressor Capacity', 'Total compressed air available.', 'CFM · optional', 'If delivery exceeds the room-ventilation requirement the calculator warns and upsizes the collector.'],
      ['Face Velocity', 'Design cross-draft velocity across the room.', 'm/min · Default 20 · Typical 18–25 (ACGIH)', 'Usually the governing basis — it keeps the operator’s visibility corridor clear.'],
      ['Air Changes per Hour', 'Ventilation rate basis.', 'ACH · Default 45 · Typical 30–60', 'The traditional sizing rule; checked in parallel with face velocity.'],
      ['Dust Loading / Filter System', 'Expected g/m³ and Pulse Jet / Reverse Air / Shaker.', 'g/m³ · dropdown', 'Loading > 10 g/m³ derates the air-to-cloth ratio (more filter area) and recommends pulse-jet.'],
      ['Safety Factor & Static Pressure', 'Capacity margin and system resistance for fan sizing.', '% Default 15 · mmWG Default 150', 'SP × airflow ÷ fan efficiency sizes the motor, rounded to the next standard HP/kW.']
    ],
    out: [
      ['Recommended Capacity', 'Governing basis + safety factor, in CFM and m³/hr, with the basis named.'],
      ['Model Ladder', 'Nine standard BG-DC models; undersized greyed, the suggested unit highlighted — >110% Excellent · 100–110 Recommended · 90–100 Acceptable · <90 Undersized.'],
      ['Filter Area & Motor', 'From the A/C ratio of your cleaning system and the fan-power calculation.']
    ],
    tips: [
      'Measure face velocity with an anemometer at the working plane after installation.',
      'Never balance a big compressor against a small collector — visibility and OSHA exposure both suffer.',
      'High-dust jobs (old coatings, slags): choose pulse-jet and generous filter area.'
    ],
    refs: 'ACGIH Industrial Ventilation Manual · OSHA 29 CFR 1910 · NFPA · ISO 11124/11126'
  },

  'pro-saw': {
    title: 'Surface Area & Weight',
    about: 'The estimator’s take-off tool: pick any structural section from the database (m²/m and kg/m built in) or use exact formulas for pipe, flat, plate, round, square and custom geometry — then get paintable area, tonnage, weight-to-area ratio, paint, abrasive and full surface-treatment cost, and build a multi-item BOQ.',
    f: [
      ['Section Type', 'SHS, RHS, angles, channels, UB/UC from the database; Pipe/Flat/Plate/Round/Square by formula; Custom for vessels & specials.', 'Dropdown — fields change per type', 'Database entries show m²/m · kg/m right in the size dropdown; formula items use ρ = 7850 kg/m³.'],
      ['Section Size / Dimensions', 'Database: pick the size. Pipe: OD + wall. Flat: width + thickness. Plate: length × width × thickness. Bars: diameter/side. Custom: your own m²/m and kg/m.', 'mm / m as labelled', 'Pipe weight = (OD − t) × t × 0.02466 — the exact standard formula, no table typos.'],
      ['Length & Quantity', 'Member length and number of identical members.', 'm · nos', 'Totals scale directly; for plate, “length” means plate length in metres.'],
      ['Paint System & Rates (C)', 'Optional: system text, total DFT, practical coverage m²/L, abrasive kg/m², ₹/L, blasting ₹/m², painting ₹/m².', 'As labelled', 'Converts the take-off into paint litres, abrasive tonnes and a complete surface-treatment cost.']
    ],
    out: [
      ['Area · Weight · Ratio', 'Paintable m², kg and MT, and kg/m² — > 150 heavy (workshop/automation advice) · < 60 lightweight (estimate paint by m², never by tonne).'],
      ['Project BOQ', '“Add This Item to BOQ” accumulates members into a take-off table with totals and an overall Σ kg/m².']
    ],
    tips: [
      'Structural steel averages 20–28 m²/tonne for typical rolled sections — sanity-check your totals.',
      'Add stripe-coat and complexity allowances after the geometric take-off.',
      'Use Custom for dished ends, cones and equipment using vendor data.'
    ],
    refs: 'AISC · IS 808 · EN 10025 · AS/NZS sections · ISO 12944 estimating practice'
  },

  'qa-pa2': {
    title: 'DFT Acceptance — SSPC-PA 2',
    about: 'Formal DFT acceptance to SSPC-PA 2: each SPOT (average of 3 gauge readings) must fall between 80% and the specified maximum (default 120%) of the specified DFT, and the AREA AVERAGE of the spots must meet the specified DFT. Evaluate one area, then accumulate areas A, B, C… into an overall project acceptance.',
    f: [
      ['Inspection Area', 'Name of the area being evaluated (SSPC-PA 2 areas of ~10 m² / 100 ft²).', 'Text · Example: Area A — Shell Course 3', 'Keeps multi-area projects organised in the project table.'],
      ['Specified DFT', 'The DFT from the coating specification for this coat/system.', 'µm · Example: 250', 'Sets the 80% minimum, the max %, and the average criterion.'],
      ['Max Spot Limit', 'Upper spot limit as % of specified.', '% · Default 120 · change only if the spec permits', 'Some specs allow 150% or restrict to Level 1–5 per PA 2 — enter what YOUR spec says.'],
      ['Spot Measurements', 'Each spot value = the average of 3 gauge readings within a 4 cm circle. Enter comma/space separated.', 'µm · minimum 2, 5 recommended per area · Example: 245, 260, 255, 270, 248', 'The calculator flags every out-of-band spot and computes the average criterion.']
    ],
    out: [
      ['PASS / FAIL with reasons', 'Exactly which rule failed: low spots, high spots, or average below spec.'],
      ['Spot Chart', 'Every reading as a green/red bar against dashed MIN / MAX / SPEC / AVG lines.'],
      ['Project Acceptance', 'Add each area; one failing area fails the overall project verdict — as the standard intends.']
    ],
    tips: [
      'Verify gauge calibration and take base-metal readings (BMR) on the blasted substrate first.',
      'A single low spot fails the area even when the average passes — that is the point of PA 2.',
      'Record spot locations for repair mapping.'
    ],
    refs: 'SSPC-PA 2 / AMPP · ISO 12944'
  },

  'qa-iso': {
    title: 'DFT Acceptance — ISO 19840',
    about: 'European acceptance logic: gauge readings over blast-cleaned steel are compensated by a Correction Value (CV) for the surface profile. Individual readings must be ≥ (NDFT − CV); the arithmetic mean must be ≥ NDFT; readings should not exceed the maximum (default guidance 3 × NDFT).',
    f: [
      ['Specified DFT (NDFT)', 'Nominal dry film thickness from the specification.', 'µm · Example: 300', 'The average criterion and the base for the maximum.'],
      ['Correction Value (CV)', 'Profile compensation — fine +10 µm · medium +25 µm · coarse +40 µm (ISO 19840 guidance), or per your project spec/instrument.', 'µm · required · Example: 20', 'Gauges read into the profile peaks; CV restores a fair minimum. Enter YOUR project’s value.'],
      ['Maximum DFT', 'Optional upper limit; blank applies the 3 × NDFT default guidance.', 'µm', 'Overthick films crack, solvent-entrap and waste money.'],
      ['Measured Readings', 'Individual gauge readings, comma/space separated.', 'µm · minimum 2 · Example: 295, 302, 310, 315, 298', 'Every reading is checked against (NDFT − CV) and the maximum.']
    ],
    out: [
      ['PASS / FAIL with reasons', 'Minimum-reading, average and maximum criteria reported separately.'],
      ['Readings Chart', 'Bars against dashed MIN (NDFT − CV), SPEC, MAX and AVG lines.']
    ],
    tips: [
      'Match CV to the measured profile class from your ASTM D4417 / ISO 8503 records.',
      'ISO 19840 also defines sampling density per area — follow the spec for how many readings.',
      'Do not mix PA 2 spot logic with ISO 19840 individual-reading logic on the same contract.'
    ],
    refs: 'ISO 19840 · ISO 12944 · ISO 8503'
  },

  'qa-hol': {
    title: 'Holiday Detection Voltage',
    about: 'Sets the correct high-voltage spark test voltage for a coating/lining from its DFT, by two recognised routes: the ASTM G62 formula V = 525 × √t(mils) and the NACE/AMPP SP0188 lookup table (interpolated). Both are always shown so the inspector can apply whichever the project specifies.',
    f: [
      ['Coating Type', 'FBE, epoxy, coal tar epoxy, glass flake, rubber lining, PU, tank lining, pipeline coating.', 'Dropdown', 'Documented on the report; manufacturer data sheets may override generic voltages.'],
      ['DFT', 'Total dry film thickness of the coating/lining to be tested.', 'µm · Example: 1500 (≈ 59 mil)', 'Test voltage scales with the square root of thickness — the whole calculation hangs on this number.'],
      ['Preferred Method', 'ASTM G62 formula or SP0188 table.', 'Dropdown', 'Use the method named in your specification; the other is shown alongside for comparison.']
    ],
    out: [
      ['Recommended Voltage', 'Selected-method value in kV and V, with both methods side by side and the difference visible.'],
      ['Voltage-vs-DFT Chart', 'Both curves 100–3500 µm with your operating point marked.'],
      ['Thin-film Guard', '≤ 500 µm triggers the ASTM D5162 Type I low-voltage wet-sponge advisory (9–90 V) — HV sparking can damage thin films.']
    ],
    tips: [
      'Never exceed the coating manufacturer’s maximum test voltage.',
      'Calibrate the detector before use; travel ≤ 0.3 m/s; mark, repair and RETEST every holiday.',
      'Ensure the coating is fully cured — solvent-wet films give false holidays and can be damaged.'
    ],
    refs: 'ASTM D5162 · ASTM G62 · NACE/AMPP SP0188'
  },

  'ce-rate': {
    title: 'Corrosion Rate',
    about: 'Computes corrosion rate by the weight-loss coupon method (ASTM G1/G31/G102: CR mm/y = 87.6 × W(mg) ÷ (D × A × T hours)) or the thickness-loss method (UT survey: (t₀ − t) ÷ years), classifies severity, and — with current and minimum-required thickness — gives API-style remaining life and inspection interval.',
    f: [
      ['Method', 'Weight Loss (coupons) or Thickness Loss (UT/CML data).', 'Dropdown — fields switch', 'Coupons measure environment aggressivity; UT measures the real component.'],
      ['Weight-loss inputs', 'Initial & final coupon weight, exposure time (hours/days/years), exposed area, metal density.', 'g · time+unit · cm² · g/cm³ (steel 7.85)', 'Clean coupons per ASTM G1 before final weighing; area must be the full exposed area.'],
      ['Thickness-loss inputs', 'Initial thickness, current thickness, years between surveys.', 'mm · mm · years', 'Use averaged CML readings; the guard rejects current > initial.'],
      ['Current Wall & t-min', 'Optional pair enabling remaining life = (t − t·min) ÷ CR.', 'mm · from API 570/510/653 calc or piping class', 't-min comes from the pressure-design/retirement calculation, not a guess.']
    ],
    out: [
      ['CR in mm/yr and mpy', 'Severity: <0.05 Excellent · 0.05–0.10 Low · 0.10–0.50 Moderate · 0.50–1.0 High · >1.0 Severe.'],
      ['Remaining Life & Interval', 'RL and inspection interval = half remaining life, capped by severity; “at/below t-min” raises the retire/repair alarm.'],
      ['Recommendation', 'Severity-matched, including an API 579 FFS prompt above 1 mm/yr.']
    ],
    tips: [
      'Weight loss below 5 mg is inside balance noise — extend exposure.',
      'Trend at least three UT surveys before trusting a rate.',
      'Localized pitting needs pit-depth assessment, not average CR.'
    ],
    refs: 'ASTM G1 · G31 · G102 · NACE SP0775 · API 570 / 510 / 653 · API 579'
  },

  'ce-life': {
    title: 'Coating Life Prediction',
    about: 'Predicts remaining coating life from age, design life and CONDITION. ISO 4628 inspection findings (rust %, blistering, cracking, flaking, chalking), adhesion, holiday results and maintenance history build a transparent 0–100 Health Index; the index maps to a condition factor (Excellent 100% … Critical 25%) that adjusts the nominal remaining life and predicts the recoating year.',
    f: [
      ['Environment & System', 'ISO 12944 category, coating system, total DFT.', 'Dropdown · text · µm', 'Context for the design-life claim and for the report.'],
      ['Year Applied / Design Life / Age', 'When the system was applied, its expected life, and current age (blank = auto from year applied).', 'year · years · years', 'If a MAJOR RECOAT was done, date the age from the recoat year — the calculator reminds you.'],
      ['Rusting %', 'Rusted fraction of the area (ISO 4628-3; Ri scale equivalents: Ri1 ≈ 0.05% … Ri5 ≈ 40–50%).', '% · Example: 0.3', 'The strongest single predictor of end-of-life; deductions rise steeply with rust.'],
      ['Blistering / Cracking / Flaking / Chalking', 'ISO 4628-2/-4/-5/-6 ratings 0 (none) to 5 (severe).', 'Dropdowns', 'Each defect deducts from the Health Index (film-breaking defects weigh double chalking).'],
      ['Adhesion & Holiday', 'ASTM D4541/D3359 result and optional holiday test.', 'Pass / Marginal / Fail', 'Adhesion failure (−25) usually condemns the system regardless of appearance.'],
      ['Maintenance History', 'Repairs, touch-ups, major recoat flag.', 'counts · Yes/No', 'Frequent patching is itself a symptom — capped deductions apply.']
    ],
    out: [
      ['Health Index & Condition', '90–100 Excellent · 75–90 Good · 60–75 Fair · 40–60 Poor · <40 Critical — every deduction is listed.'],
      ['Adjusted Remaining Life', 'Nominal remaining × condition factor; estimated recoat year and next inspection due.'],
      ['Visuals', 'Health gauge and the Applied → Today → Recoat → Design-end timeline.']
    ],
    tips: [
      'Rate defects on the worst representative area, per ISO 4628 photographic standards.',
      'Beyond design life + Fair or worse = start budgeting the recoat now.',
      'Re-run yearly; the trend matters more than any single score.'
    ],
    refs: 'ISO 4628 series · ISO 12944-9 · AMPP · NORSOK M-501 · API RP 652/651'
  },

  'tsa-wire': {
    title: 'TSA Wire Consumption',
    about: 'Aluminium wire needed to achieve a specified TSA thickness: coating volume × density gives theoretical weight; dividing by deposition efficiency gives real wire demand; an optional loss % gives the procurement figure — plus the wire length for spool ordering.',
    f: [
      ['Surface Area', 'Area to receive TSA.', 'm² · Example: 100', 'Linear driver of consumption.'],
      ['Specified TSA Thickness', 'From spec — typically 200–250 µm sealed, up to 350 µm+ for risers/splash zone.', 'µm · Example: 250', 'Volume = area × thickness.'],
      ['Wire Diameter', '1.6–4.8 mm (3/32″ = 2.3 mm is the arc-spray workhorse).', 'Dropdown', 'Only affects the wire-LENGTH estimate for spool counts — not the weight.'],
      ['Aluminium Density', '2.70 g/cm³ for 1050/1350 grade wire per ISO 14919.', 'g/cm³ · Default 2.70', 'Al-5Mg wire is ~2.66; adjust if specified.'],
      ['Deposition Efficiency', 'Fraction of sprayed wire that becomes coating.', '% · Default 65 · Typical arc-spray 60–70', 'The dominant real-world factor — measure yours with the Deposition Efficiency calculator.'],
      ['Material Loss', 'Extra contingency for spool ends, tests, rework.', '% · Default 0 · Typical 5–10', 'Applied on top of the DE-corrected demand to give procurement.']
    ],
    out: [
      ['Actual Wire Required', 'Theoretical ÷ DE — e.g. 100 m² @ 250 µm @ 65% = 103.8 kg.'],
      ['Wire per m² & Length', 'Handy site metrics — ~1.04 kg/m² and ≈ 9.3 km of 2.3 mm wire in the example.']
    ],
    tips: [
      'Order by procurement quantity, not theoretical weight.',
      'Confirm wire grade (ISO 14919) matches the spec before ordering.'
    ],
    refs: 'ISO 2063-1/-2 · AMPP/NACE SP0198 · SSPC-CS 23.00 · AWS C2.18 · ISO 14919'
  },

  'tsa-cov': {
    title: 'TSA Area Coverage',
    about: 'The inverse of wire consumption: how many m² your existing wire stock can coat at a given thickness and deposition efficiency — with remaining wire or shortfall against a required area.',
    f: [
      ['Available Wire', 'Stock on hand or allocated to the job.', 'kg · Example: 500', 'The supply side of the balance.'],
      ['TSA Thickness & DE', 'Specified thickness and realistic deposition efficiency.', 'µm · % · Example: 250 / 65', 'Together they set kg/m² (≈ 1.04 at 250 µm/65%).'],
      ['Required Area', 'Optional — the area you must complete.', 'm²', 'Enables Remaining Wire, the SHORTFALL alarm, and utilization %.']
    ],
    out: [
      ['Total Coverage', '500 kg → ≈ 482 m² in the reference example.'],
      ['Remaining / Shortfall', 'Positive = spare stock after the job; negative = order more before mobilising.']
    ],
    tips: [
      'Use your MEASURED site DE, not the brochure value.',
      'Keep 5–10% of stock as contingency for repairs and QC panels.'
    ],
    refs: 'ISO 2063 · SP0198'
  },

  'tsa-eff': {
    title: 'TSA Deposition Efficiency',
    about: 'The single most important TSA production KPI: deposited coating weight ÷ wire consumed × 100. Everything not deposited is overspray, fume and bounce-off — pure cost. Measure it on test panels or by mass balance on real work.',
    f: [
      ['Wire Consumed', 'Wire weight fed through the gun in the trial (weigh spools before/after).', 'kg · Example: 120', 'Denominator — include only wire actually sprayed.'],
      ['Coating Deposited', 'Weight gained by the workpiece/panels.', 'kg · must be ≤ consumed · Example: 78', 'Numerator; the guard rejects impossible values.']
    ],
    out: [
      ['Efficiency & Rating', '> 70 Excellent · 60–70 Good · 50–60 Average · < 50 Poor, on a colour gauge.'],
      ['Improvement Guidance', 'Band-specific: stand-off 125–200 mm, angle ≥ 45° (ideally 90°), atomising pressure, contact-tip wear, feed-vs-current calibration, edge overspray, operator technique.']
    ],
    tips: [
      'Complex lattice geometry legitimately runs 10–15 points below flat-panel DE.',
      'Re-measure after any parameter or wire-batch change.'
    ],
    refs: 'ISO 2063 · AWS C2.18 · AMPP thermal-spray practice'
  },

  'tsa-thk': {
    title: 'TSA Thickness Verification',
    about: 'Back-calculates the mass-average TSA thickness from deposited weight, area and density — a production-control cross-check on gauge readings, and a QA tool when weight records exist but access for gauging is limited.',
    f: [
      ['Surface Area', 'Area over which the weight was deposited.', 'm² · Example: 50', 'Averaging basis.'],
      ['Deposited Weight', 'Coating weight (workpiece gain or DE × wire used).', 'kg · Example: 33.75', 'With area and density this fixes the average thickness.'],
      ['Density', '2.70 g/cm³ default; sprayed TSA with porosity is effectively ~2.4–2.6 — adjust if your procedure specifies.', 'g/cm³', 'Lower effective density raises the computed thickness.'],
      ['Specified Thickness', 'Optional — enables deviation % and PASS/FAIL (calculated ≥ specified).', 'µm · Example: 250', 'TSA acceptance is minimum-based; local verification still needs a gauge.']
    ],
    out: [
      ['Calculated Thickness', '33.75 kg / 50 m² / 2.70 = exactly 250 µm in the reference example.'],
      ['Status', 'PASS/FAIL vs specified with the reminder to confirm LOCAL DFT per ISO 2063-2 / SSPC-PA 2.']
    ],
    tips: [
      'Mass-average hides thin edges and shadows — always gauge critical locations.',
      'Track kg-per-m² per shift; drift signals DE or thickness drift.'
    ],
    refs: 'ISO 2063-2 · SSPC-PA 2'
  },

  'tsa-prod': {
    title: 'TSA Productivity',
    about: 'Production metrics from completed work: m²/hr overall, kg/hr wire rate, m² per operator-hour, and projected daily output — for planning, manning and progress claims.',
    f: [
      ['Area Completed & Hours', 'Measured TSA area and the working hours consumed.', 'm² · hrs · Example: 120 / 8', 'Overall rate = area ÷ hours (15 m²/hr in the example).'],
      ['Operators', 'Spray operators working in parallel.', 'nos', 'Per-operator rate is the fair benchmark between crews.'],
      ['Wire Used & Shift Length', 'Optional wire kg (gives kg/hr) and shift hours for the daily projection.', 'kg · hrs Default 8', 'kg/hr also cross-checks thickness: kg/hr ÷ m²/hr ≈ kg/m².']
    ],
    out: [
      ['Productivity set', 'm²/hr · kg/hr · m²/operator/hr · m²/day.']
    ],
    tips: [
      'Typical arc-spray on prepared structural steel: 8–15 m²/hr per gun at 200–250 µm.',
      'Include masking/QC time if you want claimable rates; exclude it for pure spray benchmarking.'
    ],
    refs: 'AMPP/SSPC production practice'
  },

  'tsa-cost': {
    title: 'TSA Cost',
    about: 'Complete TSA application cost: wire material + labour + equipment + consumables (gas, grit, PPE) + sealer, with optional overhead % — giving total, ₹/m² and procurement quantity, plus a cost-breakdown pie.',
    f: [
      ['Surface Area', 'Job area for the ₹/m² denominator.', 'm² · Example: 100', 'Everything is normalised per m² for benchmarking and quoting.'],
      ['Wire kg & ₹/kg', 'Consumption (from the Wire calculator) and current wire price.', 'kg · ₹/kg', 'Material is typically 40–60% of TSA cost.'],
      ['Labour / Equipment / Consumables / Sealer', 'Enter the applicable lump sums.', '₹ each · defaults 0', 'Sealer (silicone/epoxy) is mandatory in most offshore specs — do not omit it.'],
      ['Overhead', 'Optional % on the subtotal.', '% · Default 0', 'Site overheads, supervision, QA documentation.']
    ],
    out: [
      ['Total & ₹/m²', 'Reference example: ₹1,60,000 → ₹1,600/m².'],
      ['Procurement Quantity', 'Wire + 5% contingency.']
    ],
    tips: [
      'Benchmark: complete TSA (prep + spray + seal) commonly runs 3–6× the cost of a premium paint system — justified by 20+ year maintenance-free life.',
      'Quote sealer and QC as separate line items for transparency.'
    ],
    refs: 'ISO 2063 · SP0198 · project commercial practice'
  },

  'pfp-mat': {
    title: 'PFP Material Consumption',
    about: 'Material take-off for passive fireproofing: area × thickness × wet density (or × manufacturer YIELD in kg/mm/m², which overrides density when entered) + wastage = procurement, with cost and ₹/m².',
    f: [
      ['Surface Area', 'Steel surface area to be fireproofed (use the Surface Area & Weight calculator for the take-off).', 'm² · Example: 500', 'Direct multiplier.'],
      ['Required Thickness', 'From the fire-rating assessment / PFP Thickness calculator.', 'mm · Example: 8', 'Direct multiplier.'],
      ['Material Density', 'Wet applied density from the product data sheet.', 'kg/m³ · cementitious 240–1600 · epoxy intumescent ~1000', 'Used when no yield is entered.'],
      ['Material Yield', 'Manufacturer’s kg per mm per m² — OVERRIDES density when filled.', 'kg/mm/m² · Example: 0.9', 'Vendor yields already include product-specific behaviour; prefer them when published.'],
      ['Wastage & Cost', 'Application wastage % and optional ₹/kg.', '% Default 10 · ₹/kg', 'Spray-applied cementitious wastage is real — 10–20% on open structure.']
    ],
    out: [
      ['Procurement kg / MT', 'Net + wastage — e.g. 500 m² × 8 mm × 1000 kg/m³ + 10% = 4,400 kg.'],
      ['kg/m² & ₹/m²', 'Consumption rate and unit cost for benchmarking.']
    ],
    tips: [
      'Epoxy intumescent is bought in kits — convert kg to kits by kit yield at the end.',
      'Add primer and mesh separately (dedicated calculators in this section).'
    ],
    refs: 'UL 1709 · ASTM E119 · EN 13381 · API 2218 · manufacturer data'
  },

  'pfp-thk': {
    title: 'PFP Thickness — Fire Rating',
    about: 'Estimates required PFP thickness from fire rating, steel section factor (Hp/A), critical steel temperature and material type. A base table (editable, cementitious @ Hp/A 180 / 538 °C) is adjusted by three transparent factors; an applied thickness gives PASS/FAIL. ALWAYS confirm against the manufacturer’s certified UL/EN 13381 listed tables — this tool is for estimation and checking, not certification.',
    f: [
      ['Fire Rating', 'Required protection duration.', '30–240 min dropdown · base: 30→8 · 60→16 · 90→24 · 120→32 · 180→45 · 240→60 mm', 'The primary driver from the fire-hazard assessment (e.g. API 2218 fire-scenario envelope).'],
      ['Section Factor Hp/A', 'Heated perimeter ÷ cross-section area of the steel member.', 'm⁻¹ · Ref 180 · light angles 250–400, heavy columns 50–120', 'Lighter sections heat faster and need MORE thickness (√(Hp/A ÷ 180) scaling).'],
      ['Critical Steel Temperature', 'Failure temperature basis.', '°C · Default 538 (UL 1709/ASTM) · structural often 400–620 per design', 'Lower critical temperature → more insulation (538 ÷ T scaling, clamped).'],
      ['Material Type', 'Cementitious ×1.0 · lightweight/vermiculite ×1.15 · epoxy intumescent ×0.5 · subliming ×0.85.', 'Dropdown', 'Intumescents work by swelling — far thinner installed films for the same rating.'],
      ['Applied Thickness', 'Optional — the installed or proposed thickness.', 'mm', 'Gives the PASS/FAIL compliance verdict.']
    ],
    out: [
      ['Required Thickness', 'Base × three factors, with each factor shown in the detail table.'],
      ['Rating Chart', 'All six ratings at YOUR parameters, selection highlighted.']
    ],
    tips: [
      'Hp/A tables are published per section size — use the fabricator’s data.',
      'Hydrocarbon (UL 1709) and cellulosic (ASTM E119/ISO 834) curves are NOT interchangeable ratings.',
      'Certified listing beats any calculation — always.'
    ],
    refs: 'UL 1709 · ASTM E119 · EN 13381 · BS 476 · ISO 834 · API 2218'
  },

  'pfp-den': {
    title: 'PFP Density Verification',
    about: 'Field QC per ASTM E605: an in-place sample is cut, measured and weighed; density = weight ÷ volume, compared to the manufacturer’s specified minimum. Density below spec means the sprayed material will not deliver its tested fire performance.',
    f: [
      ['Sample Weight', 'Oven-condition weight of the displacement/cut sample.', 'g · Example: 285', 'Numerator.'],
      ['Sample Volume', 'Measured volume per E605 (displacement or dimensioned cut).', 'cm³ · Example: 300', 'Denominator — g/cm³ converts to kg/m³ automatically.'],
      ['Specified Density', 'Manufacturer’s listed minimum density.', 'kg/m³ · Example: 900', 'The acceptance basis from the certified listing.']
    ],
    out: [
      ['Actual Density & Verdict', '≥ 100% of specified PASS · 90–100% REVIEW (resample per E605) · < 90% FAIL (reject area, investigate mix/application, reapply).'],
      ['Gauge', 'Position against the 90/100% bands.']
    ],
    tips: [
      'Take samples at the E605 frequency in your ITP (typically per floor/bay or per shift).',
      'Low density usually traces to over-watered mix or excessive air — check the pump and nozzle first.'
    ],
    refs: 'ASTM E605 · ASTM E736 · UL listings'
  },

  'pfp-mesh': {
    title: 'Mesh Quantity',
    about: 'Reinforcement mesh take-off for cementitious/epoxy PFP: area + overlap % + wastage % → procurement m², roll count (rounded up to whole rolls), utilization and cost.',
    f: [
      ['Surface Area', 'Area receiving mesh reinforcement.', 'm² · Example: 500', 'Base quantity.'],
      ['Roll Width & Length', 'Mesh roll dimensions from the supplier.', 'm · Defaults 1.0 × 50', 'Roll area sets the pack size for rounding.'],
      ['Overlap', 'Edge overlap between adjacent strips.', '% · Default 10 (≈ 50–100 mm laps)', 'Laps are mandatory for continuity — never net them out.'],
      ['Wastage', 'Cutting loss around profiles, nozzles, brackets.', '% · Default 10', 'Complex congested steel can reach 20%+.'],
      ['Cost per Roll', 'Optional ₹/roll.', '₹', 'Prices the roll count.']
    ],
    out: [
      ['Rolls & Procurement', 'e.g. 500 m² → 605 m² → 13 rolls of 50 m², 93% utilization, spare shown.']
    ],
    tips: [
      'Order whole rolls only; part-rolls do not exist on site.',
      'Pin/fix mesh per the manufacturer’s listed detail — mesh position affects the fire test validity.'
    ],
    refs: 'Manufacturer listed systems · UL/EN 13381 assessments'
  },

  'pfp-cost': {
    title: 'PFP Cost',
    about: 'Complete PFP project cost across nine heads — material, labour, equipment, scaffolding, mesh, primer, topcoat, inspection, overheads % — with total, ₹/m², material share and a full percentage breakdown table and pie.',
    f: [
      ['Surface Area', 'For the ₹/m² denominator.', 'm²', 'The benchmarking basis.'],
      ['Cost Heads', 'Enter every applicable lump sum: material, labour, equipment, scaffolding, mesh, primer, topcoat, inspection.', '₹ each · at least one required', 'Primer and topcoat are part of most listed intumescent systems — include them.'],
      ['Overheads', '% on the subtotal.', '% · Default 0', 'Supervision, QA/QC documentation, site establishment.']
    ],
    out: [
      ['Total · ₹/m² · shares', 'Every head shown with amount AND percentage; pie chart for presentations.']
    ],
    tips: [
      'Scaffolding often rivals material cost on elevated pipe racks — never omit it.',
      'Benchmark ₹/m² separately for cementitious vs intumescent; they are different markets.'
    ],
    refs: 'Project commercial practice · API 2218 scoping'
  },

  'pfp-rep': {
    title: 'PFP Repair Quantity',
    about: 'Maintenance estimation for damaged fireproofing: repair material from damaged area × thickness × density (or yield) + wastage, repair % of the total system with a severity gauge, and root-cause guidance — including the corrosion-under-fireproofing (CUF) investigation prompt for major damage.',
    f: [
      ['Total PFP Area', 'The full fireproofed area of the system/unit.', 'm² · optional but recommended', 'Enables repair % and the severity verdict.'],
      ['Damaged Area', 'Measured damaged/removed area.', 'm² · Example: 35', 'The repair take-off basis; guard rejects damaged > total.'],
      ['Repair Thickness / Density / Yield', 'Reinstatement thickness and material data (yield overrides density).', 'mm · kg/m³ · kg/mm/m²', 'Same material logic as the Material calculator.'],
      ['Wastage & Cost', 'Repair wastage (higher than new work) and optional ₹/kg.', '% Default 15 · ₹/kg', 'Small-batch repair work wastes more — 15–25% is realistic.']
    ],
    out: [
      ['Repair kg & Cost', 'Net + wastage procurement.'],
      ['Severity', '< 5% Minor (spot repairs) · 5–15% Moderate (campaign) · > 15% Major (root-cause: impact, water ingress, CUF, thermal cycling — survey per API 2218).']
    ],
    tips: [
      'Always inspect the steel under damaged PFP for CUF before patching over it.',
      'Feather edges and verify adhesion of surrounding PFP (bond test) before reinstatement.'
    ],
    refs: 'API 2218 · manufacturer repair procedures · ASTM E736 (bond)'
  },

  'bid-proc': {
    title: 'Paint Procurement Quantity',
    about: 'Multi-coat procurement: for each active coat (Primer, Intermediate, Finish, Stripe) the calculator runs theoretical → practical coverage → paint → procurement → whole containers → cost, then totals the system. Stripe coat uses its own % of area.',
    f: [
      ['Surface Area', 'Total area for the full system.', 'm² · Example: 5000', 'Common basis for all coats.'],
      ['Transfer Efficiency', 'Fraction of atomised paint reaching the surface.', '% · Default 100 (fold losses into Loss instead) · airless 70–90 if used separately', 'Use EITHER TE or a bigger loss factor — not double-counted; the formula multiplies both.'],
      ['Application Loss', 'General loss factor.', '% · Default 15 · structure 20–30, pipe/lattice 30–50', 'Converts theoretical to practical coverage.'],
      ['Procurement Reserve', 'Contingency stock on top of the requirement.', '% · Default 5', 'Covers repairs, QC panels, and batch-matching.'],
      ['Per-coat rows', 'DFT (0 skips the coat), VS%, unit price, packing size; Stripe adds its area %.', 'µm · % · ₹/L · pack dropdown · stripe default 15%', 'Each coat is calculated independently — different products, prices and packs.']
    ],
    out: [
      ['Detail Table', 'Coat · DFT · VS · area · practical m²/L · paint L · procurement L · pack · PACKS · cost, with totals.'],
      ['Containers', 'Rounded UP per coat — you cannot buy 38.6 pails.']
    ],
    tips: [
      'Stripe coat at 10–15% of area is standard for edges/welds on structural work.',
      'Procure per coat and per batch — do not pool different products into one number.'
    ],
    refs: 'ISO 12944 · NORSOK M-501 · AMPP/SSPC · project paint specification'
  },

  'bid-comp': {
    title: 'Multi-Manufacturer Bid Comparison',
    about: 'A professional bid tab for up to 10 paint offers. Each bid’s paint quantity auto-computes from DFT/VS/area/loss (or enter it directly), then bids are scored on two axes — Technical (compliance 50% + service life 25% + volume solids 15% + low VOC 10%, normalised across the field) and Commercial (low ₹/m² 60% + low lifecycle ₹/yr 40%) — combined at your chosen weighting. Badges, ranked cards, an 18-row table and an 8-panel chart dashboard make the recommendation defensible in front of any committee.',
    f: [
      ['Common Basis (A)', 'Surface area, application loss and the Technical:Commercial weighting (60:40 QCBS default; 70:30, 50:50, 40:60 selectable).', 'm² · % · dropdown', 'Every bid is normalised to the SAME area and loss — the only fair comparison.'],
      ['Manufacturer & Product', 'Pick from the major makers or Custom with your own name; duplicates auto-rename.', 'Dropdown + text', 'Identity for cards, table columns and charts.'],
      ['DFT & Volume Solids', 'Total system DFT and system-average VS from the offer.', 'µm · % · Example: 250 / 70', 'Together with area and loss they auto-compute the paint quantity — high VS quietly wins on litres.'],
      ['Unit Price & Quantity', '₹/L quoted; quantity blank = auto, or type the bidder’s own litres.', '₹/L · L', 'Total = quantity × price; ₹/m² is the headline commercial metric.'],
      ['VOC / Life / Compliance / Warranty', 'g/L, expected years in your environment, % compliance vs your spec, warranty years.', 'As labelled', 'These four drive the technical score; compliance is YOUR technical evaluation, entered honestly.'],
      ['Packing / Drying / Application', 'Pack size (container count), recoat window text, application method text.', 'Dropdown · text', 'Logistics and programme information carried into the table.']
    ],
    out: [
      ['Ranked KPI Cards', 'Sorted by overall score; the winner gets the gold card and 🏆 RECOMMENDED badge; other badges: 🥇 Best Technical · 💰 Lowest Cost · ⭐ Best Value · 🌱 Lowest VOC · ⏳ Longest Life.'],
      ['Comparison Table', '18 parameters, best-in-row ✓ in green, winner’s column highlighted.'],
      ['Chart Dashboard', 'Overall score, total cost, ₹/m², quantity, VOC, life, lifecycle ₹/yr, technical score — hover any bar for values.'],
      ['Recommendation Narrative', 'Why the winner won, with quantity, packs, totals and the reminder to verify submittals and commercial terms before award.']
    ],
    tips: [
      'Fill Section A first — Add Bid refuses without a surface area.',
      'Change the weighting AFTER adding bids to stress-test the ranking.',
      'Scores are relative to the field: adding or removing a bid re-normalises everything.'
    ],
    refs: 'ISO 12944 · NORSOK M-501 · AMPP/SSPC · QCBS evaluation practice'
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // CORE PAINT SUITE (7 Tools)
  // ──────────────────────────────────────────────────────────────────────────────
  'wft_range': {
    title: 'WFT Range Calculator (Tolerance Band)',
    about: 'Computes the required Wet Film Thickness (WFT) range corresponding to a specified Dry Film Thickness (DFT), paint Volume Solids (VS%), and allowable solvent Thinner addition. Provides min, nominal, and max wet film gauge targets for spray operators.',
    f: [
      ['Specified DFT (Nominal)', 'Target dry film thickness specified in the project paint schedule.', 'Unit: µm · Example: 125 µm', 'Primary engineering target for corrosion protection life.'],
      ['Volume Solids (VS%)', 'Non-volatile volume percentage from manufacturer TDS.', 'Unit: % · Range: 10–100% · Example: 70%', 'Controls shrinkage ratio between wet liquid and cured film.'],
      ['Thinner Addition (%)', 'Solvent reduction volume added to paint for atomization.', 'Unit: % · Range: 0–30% · Example: 5%', 'Dilutes solids and increases required wet thickness.'],
      ['Tolerance Band (±%)', 'Allowable shop/field application variance.', 'Unit: % · Default: ±10% · Range: 5–25%', 'Defines lower and upper wet gage acceptance limits.']
    ],
    out: [
      ['Nominal WFT', 'WFT = (DFT / VS%) × (100 + Thinner%)'],
      ['WFT Minimum', 'Lower wet limit below which cured DFT will fail inspection.'],
      ['WFT Maximum', 'Upper wet limit above which runs, sags, or solvent entrapment occur.']
    ],
    tips: [
      'Measure WFT immediately upon spray application before volatile solvent flashes off.',
      'Use a clean notched comb gage per ASTM D4414 held perpendicular to the substrate.'
    ],
    refs: 'ASTM D4414 · ISO 2808 · SSPC-PA 2'
  },

  'dft': {
    title: 'DFT Calculator (Cured Thickness)',
    about: 'Calculates the resulting Dry Film Thickness (DFT) from measured Wet Film Thickness (WFT), paint Volume Solids (VS%), and Thinner dilution percentage. Use to verify wet application quality.',
    f: [
      ['Measured WFT', 'Actual wet thickness measured with comb gauge.', 'Unit: µm · Example: 200 µm', 'Direct measurement during coating application.'],
      ['Volume Solids (VS%)', 'Non-volatile volume percentage from TDS.', 'Unit: % · Range: 10–100% · Example: 65%', 'Determines solid film build.'],
      ['Thinner Addition (%)', 'Thinner mixed into paint.', 'Unit: % · Range: 0–30% · Example: 10%', 'Corrects for solvent evaporation loss.']
    ],
    out: [
      ['Calculated DFT', 'DFT = WFT × (VS% / 100) / (1 + Thinner% / 100)'],
      ['Specification Check', 'Verifies if calculated cured film will meet contract DFT.']
    ],
    tips: [
      'Always use volume solids of mixed product for 2-pack epoxies and polyurethanes.',
      'Account for roughness compensation on abrasive blasted steel per ISO 19840.'
    ],
    refs: 'ISO 2808 · ASTM D7091 · SSPC-PA 2'
  },

  'coverage': {
    title: 'Paint Coverage & Spreading Rate',
    about: 'Calculates theoretical and practical spreading rates (m²/L) and total paint material demand based on surface area, specified DFT, volume solids, and application loss factor.',
    f: [
      ['Surface Area', 'Total substrate area to be coated.', 'Unit: m² · Example: 1500 m²', 'Direct project quantity basis.'],
      ['Specified DFT', 'Target dry thickness per coat.', 'Unit: µm · Example: 100 µm', 'Determines volume requirement.'],
      ['Volume Solids', 'Product Volume Solids % from TDS.', 'Unit: % · Example: 75%', 'Theoretical spreading rate = (VS% × 10) / DFT.'],
      ['Loss Factor', 'Application overspray, transfer efficiency, and can residue loss.', 'Unit: % · Range: 0–60% · Ref: Brush 10%, Airless Flat 25%, Lattice 45%', 'Converts theoretical to practical site coverage.']
    ],
    out: [
      ['Theoretical Spreading Rate', 'm²/L at 0% loss: (VS% × 10) / DFT.'],
      ['Practical Spreading Rate', 'Theoretical × ((100 − Loss%) / 100).'],
      ['Total Litres Required', 'Area / Practical Spreading Rate.']
    ],
    tips: [
      'Structural steel and open piping exhibit higher loss factors than tank shells.',
      'Always add 5–10% contingency for quality test patches and touch-ups.'
    ],
    refs: 'ISO 12944-5 · ASTM D3276 · SSPC Good Painting Practice'
  },

  'paint_consumption': {
    title: 'Paint Consumption Multi-Coat Estimator',
    about: 'Estimates total project paint volume and container counts across multiple coats (Primer, Intermediate, Topcoat) including application losses and packaging units.',
    f: [
      ['Surface Area', 'Total job surface area.', 'Unit: m² · Example: 2500 m²', 'Base take-off area.'],
      ['Coats Definition', 'DFT, VS%, and loss factor per coat layer.', 'µm / % / %', 'Independent calculation per coat.'],
      ['Pack Size', 'Standard paint drum/pail volume.', 'Unit: Litres · Common: 4L, 20L, 200L', 'Rounds procurement to whole containers.']
    ],
    out: [
      ['Volume per Coat', 'Litres required per individual coat.'],
      ['Total System Volume', 'Sum of all coats.'],
      ['Number of Drums', 'Ceiling of (Litres / Pack Size).']
    ],
    tips: [
      'Procure complete batch quantities to prevent color and gloss variation on finish coats.',
      'Keep base and hardener kits paired; never mix different batch lots without authorization.'
    ],
    refs: 'ISO 12944 · SSPC-PA Guide'
  },

  'blasting_loss': {
    title: 'Blasting Dead Volume Loss (Surface Profile)',
    about: 'Calculates the volume of extra primer required to fill the anchor profile valleys created by abrasive blasting (surface profile Rz / Ry5).',
    f: [
      ['Surface Area', 'Blasted steel area.', 'Unit: m² · Example: 1000 m²', 'Substrate area.'],
      ['Surface Profile (Rz)', 'Peak-to-valley roughness height.', 'Unit: µm · Example: 75 µm', 'Valley depth requiring primer filling.'],
      ['Profile Correction Factor', 'Effective filling constant based on abrasive type.', 'Default: 0.5 for grit, 0.7 for shot', 'Dead volume factor per ISO 19840.']
    ],
    out: [
      ['Dead Volume Paint', 'Litres consumed filling valleys = (Area × Rz × Factor) / (VS% × 10).'],
      ['Effective Extra DFT', 'Additional wet film applied that does not contribute to measured peak DFT.']
    ],
    tips: [
      'Coarse grit blasting (Rz > 85 µm) requires substantial extra primer.',
      'Surface profile consumes 0.03 to 0.07 L/m² of high-solids primer.'
    ],
    refs: 'ISO 19840 · ISO 8503 · ASTM D4417'
  },

  'mixing_ratio': {
    title: 'Paint Mixing Ratio & Thinner Reducer',
    about: 'Calculates exact Base (Part A), Hardener/Activator (Part B), and Thinner solvent quantities for 2-component and 3-component industrial coating systems.',
    f: [
      ['Total Batch Volume', 'Target volume of mixed paint needed.', 'Unit: Litres · Example: 20 L', 'Mixed liquid volume.'],
      ['Mix Ratio (A : B)', 'Manufacturer stoichiometric ratio by volume.', 'Example: 4:1 or 3:1', 'Specified in product TDS.'],
      ['Thinner Reduction (%)', 'Allowable thinning percentage.', 'Unit: % · Example: 10%', 'Added to mixed A+B volume.']
    ],
    out: [
      ['Part A Base Volume', 'Exact volume of Component A.'],
      ['Part B Hardener Volume', 'Exact volume of Component B.'],
      ['Thinner Volume', 'Exact volume of reducer solvent.']
    ],
    tips: [
      'Mix Part A and Part B thoroughly before adding thinner reducer.',
      'Respect induction time (sweat-in) and pot life limits at ambient temperature.'
    ],
    refs: 'ASTM D3276 · SSPC Paint Specifications'
  },

  'cost_per_area': {
    title: 'Paint Cost Per Area (₹/m²)',
    about: 'Computes direct material cost per square meter based on paint unit price, theoretical coverage, specified DFT, volume solids, and site losses.',
    f: [
      ['Paint Price (₹/L)', 'Purchase cost per litre.', 'Currency · Example: ₹450/L', 'Material unit rate.'],
      ['Specified DFT', 'Target dry film thickness.', 'Unit: µm · Example: 150 µm', 'Film thickness.'],
      ['Volume Solids', 'Product VS percentage.', 'Unit: % · Example: 80%', 'Coverage driver.'],
      ['Loss Factor', 'Application wastage %.', 'Unit: % · Example: 20%', 'Material efficiency.']
    ],
    out: [
      ['Material Cost per m²', '₹ / m² = (Paint Price / Practical Coverage).'],
      ['Total Material Cost', 'Cost per m² × Total Project Area.']
    ],
    tips: [
      'High-solids paints often have a higher ₹/L but lower ₹/m² due to superior coverage.',
      'Evaluate tenders on cost per applied m², never on unit price per container.'
    ],
    refs: 'ISO 12944 · AMPP Cost of Corrosion Studies'
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // SURFACE AREA SUITE (6 Tools)
  // ──────────────────────────────────────────────────────────────────────────────
  'pipe_spool': {
    title: 'Pipe Spool Surface Area & Volume',
    about: 'Calculates external and internal paintable surface area and internal volume for standard NPS piping and custom diameter spools per ASME B36.10M.',
    f: [
      ['Pipe NPS / OD', 'Nominal Pipe Size lookup (1/2" to 48") or custom Outer Diameter (mm).', 'mm · Example: 8" (219.1 mm)', 'Sets circumference π × OD.'],
      ['Pipe Length', 'Total spool length or pipeline run.', 'Unit: meters · Example: 250 m', 'Linear length multiplier.'],
      ['Scope of Coating', 'External only, Internal lining only, or Both sides.', 'Toggle', 'External = π × OD × L; Internal = π × ID × L.']
    ],
    out: [
      ['Total Surface Area (m²)', 'External / Internal / Combined area.'],
      ['Internal Volume (m³ / L)', 'Volumetric capacity of pipe bore.']
    ],
    tips: [
      'Add 10–15% area allowance for flanges, valves, and spool support attachments.',
      'Ensure pipe wall thickness schedule is deducted when calculating internal lining area.'
    ],
    refs: 'ASME B36.10M · ISO 12944'
  },

  'tank_shell': {
    title: 'Storage Tank Surface Area (API 650)',
    about: 'Calculates surface area for vertical cylindrical storage tanks including shell walls, flat/conical bottoms, and cone/dome roofs.',
    f: [
      ['Tank Diameter', 'Inside or nominal shell diameter.', 'Unit: m · Example: 20 m', 'Tank diameter.'],
      ['Tank Height', 'Shell course height.', 'Unit: m · Example: 14 m', 'Shell height.'],
      ['Roof Type', 'Conical, Dome, Floating, or Flat roof geometry.', 'Dropdown', 'Calculates exact geometric surface.']
    ],
    out: [
      ['Shell Area', 'π × Diameter × Height.'],
      ['Roof & Floor Area', 'Geometric area of tank heads.'],
      ['Total Internal & External Area', 'Complete coating take-off.']
    ],
    tips: [
      'Include wind girders, stairways, and roof rafters in secondary take-off sheets.',
      'Internal bottom plates require 5–10% extra area for lap-welded plate joints.'
    ],
    refs: 'API 650 · API 652 · AWWA D100'
  },

  'structural_steel': {
    title: 'Structural Steel Weight-Wise Area Take-Off',
    about: 'Estimates structural steel surface area from total tonnage and section category (Heavy, Medium, Light, Lattice) using standard m²/MT surface ratios.',
    f: [
      ['Steel Tonnage', 'Total weight of structural steel.', 'Unit: Metric Tonnes (MT) · Example: 150 MT', 'Weight basis.'],
      ['Section Category', 'Heavy rolled columns (15–20 m²/MT), Beams (22–28 m²/MT), Light channels (30–40 m²/MT), Lattice pipe trusses (45–60 m²/MT).', 'Dropdown', 'Empirical surface-to-weight ratio.']
    ],
    out: [
      ['Estimated Surface Area (m²)', 'Tonnage × Specific Ratio.'],
      ['Paint & Abrasive Estimate', 'Direct material requirements derived from area.']
    ],
    tips: [
      'Complex truss and lattice structures consume up to 50% more paint in overspray.',
      'Use exact section sizes from structural drawings whenever detailed BOQ is available.'
    ],
    refs: 'AISC Design Guide · IS 808 · ISO 12944'
  },

  'flat_plate': {
    title: 'Flat Plate Surface Area & Steel Weight',
    about: 'Computes total surface area (single or both sides) and steel mass for flat rectangular or custom plate geometry.',
    f: [
      ['Length & Width', 'Plate dimensions.', 'Unit: m · Example: 6.0 m × 2.5 m', 'Plane geometry.'],
      ['Thickness', 'Plate gauge.', 'Unit: mm · Example: 12 mm', 'Mass density calculation (7850 kg/m³).'],
      ['Sides to Coat', 'Top only, Bottom only, or Both sides.', 'Toggle', 'Area multiplier.']
    ],
    out: [
      ['Coatable Area (m²)', 'Length × Width × (1 or 2).'],
      ['Plate Mass (kg / MT)', 'Area × Thickness × 7.85 kg/m²/mm.']
    ],
    tips: [
      'Account for edge striping (perimeter × thickness) on heavy plate (>25mm).'
    ],
    refs: 'EN 10025 · ASTM A36'
  },

  'dished_end': {
    title: 'Dished End Surface Area (Torispherical / Ellipsoidal)',
    about: 'Computes exact surface area for pressure vessel heads (2:1 Ellipsoidal, ASME Torispherical / Klöpper, Hemispherical, Conical).',
    f: [
      ['Head Diameter (OD)', 'Outside vessel diameter.', 'Unit: mm or m · Example: 3000 mm', 'Head diameter.'],
      ['Head Type', '2:1 Semi-Ellipsoidal, Torispherical (ASME F&D), Hemispherical, Flat.', 'Dropdown', 'Exact geometric formula constant.'],
      ['Straight Flange (SF)', 'Cylindrical skirt extension height.', 'Unit: mm · Example: 50 mm', 'Adds π × D × SF area.']
    ],
    out: [
      ['Dished End Area (m²)', 'Geometric dish area + Straight Flange.'],
      ['Internal Volumetric Capacity', 'Head volume in m³ and Litres.']
    ],
    tips: [
      '2:1 Ellipsoidal factor is approximately 1.084 × D².',
      'Hemispherical factor is exactly 2 × π × R² (1.57 × D²).'
    ],
    refs: 'ASME Section VIII Div 1 · DIN 28011'
  },

  'vessel_area': {
    title: 'Vessel & Equipment Surface Area',
    about: 'Complete vertical/horizontal pressure vessel take-off: cylindrical shell + 2 dished ends + nozzle attachments + saddle supports.',
    f: [
      ['Shell OD & Tan-to-Tan Length', 'Vessel cylinder diameter and straight length.', 'm · Example: 2.4 m OD × 8.0 m T-T', 'Cylindrical shell body.'],
      ['End Closures', 'Top/Bottom or Left/Right head geometry.', 'Dropdown (2:1 Ellipsoidal / Torispherical)', 'End closure areas.'],
      ['Nozzles & Attachments', 'Number of manways, nozzles, and saddles.', 'Counts', 'Applies standard attachment allowances.']
    ],
    out: [
      ['Total External Area (m²)', 'Shell + Heads + Attachments.'],
      ['Total Internal Lining Area (m²)', 'Inside surface area.']
    ],
    tips: [
      'Add 15% allowance for internal vessel internals (baffles, trays, demisters).'
    ],
    refs: 'ASME Section VIII · API 510'
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // ABRASIVES & SALT SUITE (3 Tools)
  // ──────────────────────────────────────────────────────────────────────────────
  'abrasive_media': {
    title: 'Abrasive Consumption Matrix (Garnet & Copper Slag)',
    about: '4×4 engineering matrix calculating exact abrasive media tonnage and 25kg/50kg bag packaging across initial rust conditions (Zero/Flash Rust to Very Heavy Scale) and blast cleanliness standards (Light Sweep to ISO 8501-1 Sa 3).',
    f: [
      ['Abrasive Type', 'Almandine Garnet (80 Mesh / 30/60 Mesh) or Copper Slag.', 'Radio / Tab', 'Garnet base rate 10–25 kg/m²; Copper slag 15–35 kg/m².'],
      ['Surface Condition', 'Flash rust, Mild scale (<25µm), Heavy scale (<90µm), Very heavy pitted scale.', 'Table rows', 'Determines breakdown scale multiplier (0.50× to 3.00×).'],
      ['Blast Standard', 'Light Sweep (Sa 1), Commercial (Sa 2), Near-White (Sa 2.5), White Metal (Sa 3).', 'Table columns', 'Target cleanliness standard.'],
      ['Surface Area', 'Area to be blast cleaned in each condition cell.', 'Unit: m²', 'Calculates exact kg = Area × Base Rate × Scale Factor.']
    ],
    out: [
      ['Total Abrasive Required', 'Total kilograms and Metric Tonnes (MT).'],
      ['Packaging Breakdown', 'Exact count of 25 kg bags, 50 kg bags, and 1 MT Jumbo bags.']
    ],
    tips: [
      'Maintain nozzle blast pressure at 7 bar (100 psi) at the nozzle for maximum productivity.',
      'Garnet provides 2.5× faster cutting and 1/3 the consumption volume of expendable slags.'
    ],
    refs: 'ISO 8501-1 · ISO 11126 · SSPC-SP 10 / NACE No. 2'
  },

  'blast_profile': {
    title: 'Abrasive Size vs. Blast Profile Prediction',
    about: 'Predicts achievable anchor surface profile height (Rz in µm) based on abrasive media type, mesh sieve size, blast pressure, nozzle angle, and steel hardness.',
    f: [
      ['Abrasive Type & Grade', 'Steel Grit, Steel Shot, Garnet, Copper Slag, Aluminium Oxide.', 'Dropdown', 'Particle size and angularity driver.'],
      ['Blast Pressure', 'Pressure measured with hypodermic needle gage at the nozzle.', 'Unit: bar / psi · Ref: 7 bar (100 psi)', 'Pressure increases profile ~3% per bar.'],
      ['Nozzle Stand-Off & Angle', 'Distance (mm) and angle (degrees) to substrate.', 'Ref: 450 mm @ 90°', 'Oblique blasting (<45°) reduces anchor profile depth.']
    ],
    out: [
      ['Predicted Profile Height (Rz)', 'Estimated roughness range in micrometers (µm).'],
      ['ISO 8503 Surface Comparator Grade', 'Fine, Medium, or Coarse profile band.'],
      ['Recommended Minimum Primer DFT', 'Specifies required primer thickness (≥1.5× profile).']
    ],
    tips: [
      'Verify blast profile on site using Testex replica tape per ASTM D4417 Method C.',
      'Excessive profile (>100 µm) with thin primer (<50 µm) causes pinpoint rust spotting on peaks.'
    ],
    refs: 'ISO 8503-1/-5 · ASTM D4417 · NACE SP0287'
  },

  'salt_test_tool': {
    title: 'Soluble Salt Contamination Test (ISO 8502-9 Bresle)',
    about: 'Evaluates surface ionic chloride and salt contamination on blast-cleaned steel using Bresle patch extraction conductivity per ISO 8502-6 and ISO 8502-9 with temperature correction.',
    f: [
      ['Extraction Solution Volume', 'Volume of deionized water injected into patch.', 'Unit: mL · Standard: 3.0 mL', 'ISO 8502-6 standard extraction volume.'],
      ['Patch Test Area', 'Surface area bounded by Bresle patch.', 'Standard: 1250 mm² (12.5 cm²)', 'Standard A-1250 patch size.'],
      ['Measured Conductivity', 'Raw conductivity of extracted test liquid.', 'Unit: µS/cm · Measured with calibrated meter', 'Conductivity of solution with dissolved salts.'],
      ['Water Blank Conductivity', 'Conductivity of pure deionized water before injection.', 'Unit: µS/cm · Must be <5 µS/cm', 'Subtracted from test reading for baseline.'],
      ['Test Temperature', 'Liquid sample temperature during conductivity reading.', 'Unit: °C · Range: 0–80 °C', 'Applies ISO 8502-9 temperature correction factor.']
    ],
    out: [
      ['Salt Density (mg/m² & µg/cm²)', 'Total soluble salts = c × (Cond_sample − Cond_blank) × (Vol / Area).'],
      ['ISO 8502-9 Compliance Verdict', 'PASS / FAIL against specified project limit (e.g. <30 mg/m² for immersion, <50 mg/m² for atmospheric).']
    ],
    tips: [
      'Rub patch firmly for 10–15 seconds and let solution dissolve salts for at least 90 seconds.',
      'High salt contamination causes osmotic blistering and premature coating disbondment in service.'
    ],
    refs: 'ISO 8502-6 · ISO 8502-9 · SSPC-Guide 15 · NACE SP0508'
  }
};
