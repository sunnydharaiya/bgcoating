# CoatingOS Module Architecture & Implementation Blueprint

> **Reference Standard:** Coating Calculator & Specification Reading Modules  
> **Timezone Standard:** Indian Standard Time (`Asia/Kolkata` / UTC+05:30)  
> **Routing Standard:** Unified Browser URL Synchronization (`router.js` + Django Fallback)

---

## 1. Architectural Principles Established

Every tool in CoatingOS adheres to this standardized architecture:

```
[User Interface (React SPA)] 
    │── Keystroke (Section Input) ──> [Debounced Auto-Save (800ms)] ──> [/records/draft/ (Active Draft)]
    │── Explicit Action (Calculate / Register) ──> [/records/ (Saved Register Records)]
    │── Navigation (Sidebar / Buttons) ──> [router.js (SPEC_URL_MAP / TOOL_URL_MAP)] ──> [Browser Address Bar URL]
```

---

## 2. Module 1: Coating Calculator (`/coating-calculator`)

### A. Behavior & Calculation Pattern
- **Explicit Calculation Trigger:** Removed premature auto-calculation on every keystroke. Outputs are computed only when the user explicitly clicks the **"Calculate"** button.
- **Automatic Calculation Logging:** Whenever **"Calculate"** is clicked, inputs, calculated results, parameters, and metadata are logged to the backend and cached locally.
- **Coverage:** Implemented across all 4 suites:
  1. **Paint Suite:** WFT Range, DFT, Theoretical & Practical Coverage, Consumption, Blasting Loss, Mixing Ratio, Cost per Area.
  2. **Surface Area Suite:** Pipe Spools, Tanks (Shell, Roof, Spherical), Structural Steel, Flat Plates, Dished Ends, Vessels.
  3. **Abrasive & Salt Suite:** Garnet, Copper Slag, Nozzle Air, ISO 8502-9 Salt Test.
  4. **Executive PRO Suite:** 28 advanced technical modules (Volume Solids, Reconciliation, LCC, Blast Profile, Dust Collector, SSPC-PA2, ISO 19840, etc.).

### B. Backend Persistence (`coating_calculator` Django App)
- **Model:** `CalculatorLog` in `backend/coating_calculator/models.py`
  - Fields: `user` (nullable for guests), `tool_id`, `tool_name`, `category`, `project_name`, `client_name`, `inputs` (JSON), `results` (JSON), `notes`, `ip_address`, `user_agent`, `created_at` (IST), `updated_at` (IST).
- **REST Endpoints:**
  - `GET /api/v1/modules/calculator/logs/` (filtered by authenticated user or guest IP)
  - `POST /api/v1/modules/calculator/logs/` (log calculation)
  - `POST /api/v1/modules/calculator/logs/claim-guest-logs/` (claims guest session calculations upon login)
- **Service Layer:** `calculatorService.js` with `bg_calc_logs` local fallback.

---

## 3. Module 2: Specification Reading (`/specification-reading`)

### A. Comprehensive Form & Debounced Auto-Save
- **8 Engineering Sections:**
  - **A & B:** Project Scope & Applicable Standards
  - **C:** General Environmental Requirements & Service Classification
  - **D:** Operating & Design Temperatures (Component, Operating Temp, Design Temp, Surface Selection, 5-column Y/N/NA toggles, Callout badges)
  - **E:** Insulation, Fireproofing, TSA, Galvanizing, Pickling
  - **F:** Coating System Design (Coats, DFT, Area, Wastage %, Paint Volume, Rates, Costs)
  - **G:** Testing & QC Criteria
  - **H:** Approved Primer & Paint Manufacturers
  - **I:** Revision History & Engineering Notes
- **Debounced Auto-Save (800ms):**
  - Any keystroke across any section triggers an 800ms debounce.
  - Automatically updates the single working draft in the database via `POST /api/v1/modules/specification-reading/records/draft/` and local storage `bg_os_spec_reading_draft`.
  - Displays live auto-save status indicator in the top and bottom toolbars (*Saving...* / *Saved*).
  - **Global Reset:** Clears all 8 sections and purges the active draft both remotely and locally.

### B. Backend Persistence (`specification_reading` Django App)
- **Model:** `SpecificationRecord` in `backend/specification_reading/models.py`
  - Fields: `user`, `spec_id`, `din_no`, `proj_no`, `proj_desc`, `cust_name`, `prepared_by`, `status` (`Draft` / `Approved` / `Rejected`), `revision`, `is_active_draft` (bool), `data` (full nested JSON of all 8 sections), `notes`, `ip_address`, `user_agent`, `created_at`, `updated_at`.
- **REST Endpoints:**
  - `GET /api/v1/modules/specification-reading/records/` (lists saved reports and registered drafts)
  - `POST /api/v1/modules/specification-reading/records/` (creates / saves specification report)
  - `GET /api/v1/modules/specification-reading/records/draft/` (retrieves active working draft)
  - `POST /api/v1/modules/specification-reading/records/draft/` (upserts active working draft)
  - `DELETE /api/v1/modules/specification-reading/records/draft/` (purges active working draft)
  - `POST /api/v1/modules/specification-reading/records/claim-guest-specs/` (claims guest specs on login)
- **Service Layer:** `specificationService.js` with `bg_os_spec_reports_register` local fallback.

### C. Saved Reports Register (`/specification-reading/register`)
- **Dashboard KPI Cards:** Total Records, Draft Records, Approved Records, Rejected Records, Total Design Sheets.
- **Table Operations:**
  - **Edit (✎):** Hydrates all 8 sections into the form editor, sets browser URL to `/specification-reading`, and displays confirmation toast.
  - **View (👁):** Mounts `SpecPreviewModal` with read-only formal dossier, 50%–150% zoom controls, and live watermark toggle.
  - **Print (🖨):** Opens full printable A4 report view with corporate header, solid slate section banners, and document metadata.
  - **Copy (📋):** Duplicates record with `_COPY` suffix, sets status to `Draft`, assigns unique specification ID, and persists to database.
  - **Delete (✕):** Prompts confirmation, executes backend DELETE call, and removes record from state and local storage.
  - **Export Excel:** Generates formatted CSV download.
  - **Sample Demonstration Record (💡):** 1-click button loads a realistic specification (`PRJ-4029-REFINERY` for Saudi Aramco / Saipem EPC) into the register for immediate testing.

### D. Dynamic Watermark & Security Control (`/specification-reading/watermark`)
- **Interactive Controls:** Toggle ON/OFF, custom watermark text, 5 quick presets, 4 corporate color swatches (Terracotta `#C62828`, Amber `#D97706`, Crimson `#9E1B1E`, Slate `#475569`), opacity slider (3% to 35%), rotation angle slider (-60° to 0°).
- **Dynamic Propagation:** Real-time SVG background pattern (`url("data:image/svg+xml...")`) updates dynamically in the simulated A4 canvas, the full dossier view, and the preview modal.

---

## 4. URL & Routing Standards

### A. Routing Map (`router.js`)
Clean frontend routes mapped bidirectionally:

| Module / View | Clean URL Path | SubTool State |
| :--- | :--- | :--- |
| Specification Form | `/specification-reading` | `hub` / `form` |
| Saved Reports Register | `/specification-reading/register` | `register` / `report-register` |
| Printable Dossier | `/specification-reading/report` | `report` / `print` |
| Watermark Control | `/specification-reading/watermark` | `watermark` |
| Company Branding | `/specification-reading/company-details` | `company_details` |
| Coating Calculator | `/coating-calculator` | `hub` |
| Specific Calc Tool | `/coating-calculator/paint/wft-range` | `wft_range` / `sp-pc` |

### B. URL Synchronization in Components
- When switching internal tabs, components call `onNavigateSubSection(subTool)` which invokes `navigate('module-slug', subTool)`.
- Updates `window.history.pushState` to ensure bookmarking, page reload, and sharing direct links work out-of-the-box.
- Backend Django URLs use `re_path(r'^(?:calculator/)?.*module-slug.*', views.spa_view)` so direct browser requests or page refreshes on sub-routes never throw 404.

---

## 4. Module 3: Coating Procedure (`/coating-procedure`)

### A. Sub-Tool Sections & Architecture
- **11 Engineering Procedure Sections + 2 Annexures:**
  - **1. Cover & Revision:** Document Number, Rev, Document Title, Project Name, Client, Contractor, Facility Location, Prepared/Reviewed/Approved by, Revision History.
  - **2. Scope:** Substrate types, purpose, shop vs field, equipment tags.
  - **3. Reference Documents:** Client mechanical data sheets, ITP, painting specifications, TDS/SDS.
  - **4. Reference Standards:** ISO 8501, ISO 8502, ISO 8503, ISO 12944, ISO 19840, SSPC-PA2, SSPC-SP, ASTM D4417, ASTM D4541, etc.
  - **5. Exclusions:** Masking, non-ferrous alloys, stainless steel, flange faces, instrument lines, earthing lugs.
  - **6. Safety & HSE:** Confined space protocols, ventilation, gas monitoring, PPE, abrasive toxicity limits.
  - **7. Surface Preparation:** Blasting method, abrasive type, profile range (µm), soluble salt limits, dust classification, blotter test frequency, holding time.
  - **8. Coating Application:** Environmental limits (substrate temp, ambient temp, RH%, dew point delta), application equipment, stripe coating rules, WFT checking, DFT standard.
  - **9. Repair Plan:** Defect rectification, feathering width taper (50 mm), adhesion verification.
  - **10. Approved Manufacturers:** AkzoNobel (International Paint), Jotun, Hempel, PPG Industries, Sherwin-Williams, Carboline.
  - **11. Attachments & Annexures:** Annexure I (Coating Systems Schedule), Annexure II (Inspection Instruments Matrix).
  - **Report & Preview:** Controlled A4 Engineering Dossier with customizable watermarks and corporate branding profile.

### B. Backend Persistence (`coating_procedure` Django App)
- **Model:** `ProcedureRecord` in `backend/coating_procedure/models.py`
  - Fields: `user` (nullable), `doc_no`, `rev_no`, `doc_title`, `project_name`, `client_name`, `contractor_name`, `facility_location`, `equipment_tag`, `project_number`, `site_location`, `prepared_by`, `status`, `revision`, `is_active_draft`, `data` (JSON), `notes`, `ip_address`, `user_agent`, `created_at` (IST), `updated_at` (IST).
- **REST Endpoints:**
  - `GET /api/v1/modules/coating-procedure/records/` (user filtered or guest IP)
  - `POST /api/v1/modules/coating-procedure/records/` (save/register procedure)
  - `GET /api/v1/modules/coating-procedure/records/draft/` (fetch active draft)
  - `POST /api/v1/modules/coating-procedure/records/draft/` (auto-save active draft)
  - `DELETE /api/v1/modules/coating-procedure/records/draft/` (clear draft on reset)
  - `POST /api/v1/modules/coating-procedure/records/claim-guest-procedures/` (claim guest procedures after login)
- **Service Layer:** `procedureService.js` extending `BaseApiService` with `bg_os_procedure_records` and `bg_os_procedure_draft` local fallback.

### C. Saved Procedures Register (`/coating-procedure/register`)
- **KPI Metrics Strip:** Total Procedures, Draft Status, Approved Procedures, Total Coating Systems.
- **Search & Filters:** Search by Doc No, Project, Client, Contractor, Equipment Tag, or Engineer; Status filter buttons (`ALL`, `Draft`, `Approved`).
- **Complete Row Actions:**
  - **View:** Read-only preview modal (`ProcPreviewModal`).
  - **Edit:** Hydrates active form and navigates to Cover & Rev.
  - **Print:** Opens printable A4 engineering dossier (`ProcPrintDossier`).
  - **Copy:** Clones record via backend API.
  - **Delete:** Permanently removes procedure from database.
  - **Export CSV:** Exports full register spreadsheet.
  - **Sample Aramco Record:** 1-click loading of standard ISO 12944 / Aramco offshore specification (`PRJ-PROC-ARAMCO-01`).

---

## 5. Module 4: Quick Unit-Rate Estimation (`/unit-rate-estimation` / `/cost-estimation`)

### A. Sub-Tool Sections & Commercial Architecture
- **6 Commercial Take-off Sections + Standalone Views:**
  - **1. Project Information (`project-info`):** Estimate / Quotation Ref (`EST-REF-2026-001`), Project Name, Customer, Enquiry Ref, Location, Lead Estimator, Checked By, Date, Currency selector (10 global currencies: INR ₹, USD $, EUR €, AED, SAR, GBP £, SGD, QAR, OMR, KWD), Paint Application Loss Factor % (default 30%).
  - **2. Scope Matrix (`scope`):** 6 major industrial work scopes (Surface Preparation & Painting, Thermal & Cold Insulation, Passive Fire Protection, Special Treatment TSA/FRP/FBE, Hot Dip Galvanizing, Pickling & Passivation), Project Specification Documents list.
  - **3. Section D — Operating Conditions & Substrates (`section-d`):** Equipment & piping component rows, operating & design temperatures, surface selection (External / Internal / Both), 5-column Y/N/NA toggles (Painting, Galvanizing, TSA, Insulation, Fireproofing).
  - **4. Section F — Coating Systems Design (`section-f`):** Multi-tier paint systems schedule (Primer, Intermediate, Topcoat) with DFT, Volume Solids %, Unit Price per Liter, and Surface Area (m²). Includes **"Sync from Section D"** 1-click bridge.
  - **5. Cost Matrix (`cost-matrix`):** Complete commercial rate breakdown covering 6 cost centers:
    1. Blasting & Surface Preparation Cost
    2. Raw Material Cost (Paint & Primers)
    3. Raw Material Cost (Abrasive Media — Garnet / Slag consumption rates)
    4. Paint Application & Direct Labour Cost
    5. Equipment, Power, Access Scaffolding & Consumables
    6. Commercial Markups & Margin (Overhead %, Contingency %, Profit %)
    - Includes **"Rebuild from Section F"** automated cost engine.
  - **6. Revisions & Approvals (`revisions`):** Tender revision log (Rev 0, 1, 2...), scope alteration descriptions, prepared, checked, and commercial director sign-offs.
  - **Commercial Quotation Dossier & Print View (`report-view` / `report` / `xlprint`):** Full corporate tender proposal with interactive watermark, dynamic company header, direct cost breakdown, and unit rate summary.

### B. Backend Persistence (`unit_rate_estimation` Django App)
- **Model:** `UnitRateRecord` in `backend/unit_rate_estimation/models.py`
  - Fields: `user` (nullable), `est_no`, `project_name`, `customer`, `currency`, `location`, `estimator`, `total_area`, `grand_total`, `cost_per_m2`, `status`, `revision`, `is_active_draft`, `data` (JSON), `notes`, `ip_address`, `user_agent`, `created_at` (IST), `updated_at` (IST).
- **REST Endpoints:**
  - `GET /api/v1/modules/unit-rate-estimation/records/` (user-filtered or guest IP, defaults to `is_active_draft=False`)
  - `POST /api/v1/modules/unit-rate-estimation/records/` (save/register completed tender quotation)
  - `GET /api/v1/modules/unit-rate-estimation/records/draft/` (retrieve active working draft)
  - `POST /api/v1/modules/unit-rate-estimation/records/draft/` (auto-save active working draft)
  - `DELETE /api/v1/modules/unit-rate-estimation/records/draft/` (clear draft on reset/new take-off)
  - `POST /api/v1/modules/unit-rate-estimation/records/claim-guest-estimates/` (attach guest estimates upon user login)
- **Service Layer:** `unitRateService.js` extending `BaseApiService` with `bg_os_unitrate_records` and `bg_os_unitrate_draft` offline fallbacks.

### C. Commercial Quotation Register (`/unit-rate-estimation/register`)
- **Executive KPI Dashboard:** Total Quotations, Draft Take-offs, Approved Tender Estimates, Combined Portfolio Value.
- **Search & Filters:** Search by Estimate Ref, Project Name, Customer, Location, or Estimator; Filter by Status (`ALL`, `Draft`, `Approved`).
- **Complete Row Actions:**
  - **View (👁):** Read-only preview modal (`UnitRatePreviewModal`) computing live metrics without missing numbers.
  - **Edit (✎):** Hydrates entire quotation state into the editor and opens `project-info`.
  - **Print (🖨):** Opens printable commercial tender dossier (`UnitRatePrintDossier`).
  - **Copy (📋):** Clones record as draft with `-COPY` suffix.
  - **Delete (✕):** Permanently removes quotation from database and register.
  - **Export CSV:** Downloads formatted commercial register spreadsheet.
  - **Sample Refinery Record (💡):** 1-click button loads standard petrochemical expansion package (`EST-REF-2026-001`, ₹3,850,000, 7,500 m²) directly into the database.

---

## 6. Module 5: Manpower-Based Painting Project Estimation (`/manpower-estimation`)

### A. Sub-Tool Sections & Production Sizing Architecture
- **8 Core Engineering Modules + Overview Hub & Register:**
  - **1. Overview Hub (`hub`) & Dashboard (`dashboard`):** High-level summary, schedule targets, blasting setups vs painting setups gauge, and 1-click industry templates.
  - **2. Project Information (`project-info`):** Estimation Ref (`EST-MP-2026-001`), Project Name, Customer, Site Location, Metallurgy (Carbon Steel, Low Alloy Steel, Stainless Steel, Duplex, Aluminum), Surface Cleanliness (Sa 3, Sa 2.5, Sa 2, Sweep, Power Tool), Cyclic/CUI Service flag, Fireproofing flag, Structural Type (Light, Medium, Heavy, Ultra Heavy), Total Surface Area ($m^2$), Steel Tonnage, Project Execution Duration (months, working days/month, shift count, daily production targets).
  - **3. Blasting Cost Center (`blasting-cost` / `blasting`):** Abrasive media selection (Copper Slag vs Garnet), abrasive consumption rate (kg/$m^2$), diesel compressor fuel consumption (L/$m^2$), consumable allowances, supervisor, blaster, and helper gang allocation headcount and monthly wages, blasting equipment rentals, site office/admin, mobilization, and commercial overhead/profit markups.
  - **4. Paint Application Cost Center (`paint-application` / `painting`):** Multi-coat spray painter gang sizing, supervisor headcount, helper crew, airless spray pump rentals, masking and environmental protection, diesel power, access scaffolding, and subcontractor markups.
  - **5. Paint Raw Material Engine (`paint-raw-material` / `raw-material`):** Multi-tier paint schedules (Primer, Intermediate, High Build, Topcoat) with DFT, Volume Solids %, Thinner %, Loss Factor %, Paint Price per Liter, Thinner Price per Liter, Theoretical vs Practical Coverage, and Total Consumption (Liters).
  - **6. Worker CTC Engine (`worker-ctc`):** Comprehensive statutory labor burden builder (Basic Wage, Overtime hours & multiplier, Provident Fund 12.16%, Statutory Bonus 8.33%, Insurance, Camp/Room, Travel, PPE & Medical allowances, Subcontractor Margin).
  - **7. Abrasive & Diesel Logistics (`abrasive-diesel`):** Bulk tonnage requirement calculations, recycling reuse factor, total diesel consumption, and delivery logistics.
  - **8. Cost Summary & Front Page (`summary`):** Complete project commercial rollup with direct blasting cost, direct painting cost, raw material total, grand total, cost per $m^2$, and automated qualification for Sa 3, Sa 2.5, Sa 2, and Sweep blast differential rates.
  - **Top Sticky Freeze Dashboard Bar:** Persistent live ribbon displaying Project Area ($m^2$), Required Blasting Days, Required Painting Days, Daily Target ($m^2$/day), Combined Blasting Total, Combined Painting Total, Raw Material Total, Grand Project Total, and Unit Rate per $m^2$.
  - **Controlled A4 Engineering Dossier & Print View (`report` / `preview`):** Full corporate proposal with interactive watermark, dynamic company header, crew composition breakdown, and cost distribution donut chart.

### B. Backend Persistence (`manpower_estimation` Django App)
- **Model:** `ManpowerRecord` in `backend/manpower_estimation/models.py`
  - Fields: `user` (nullable), `est_no`, `project_name`, `customer`, `location`, `currency`, `total_area`, `tonnage`, `blasting_total`, `painting_total`, `raw_material_total`, `grand_total`, `cost_per_m2`, `status`, `revision`, `is_active_draft`, `data` (JSON), `notes`, `ip_address`, `user_agent`, `created_at` (IST), `updated_at` (IST).
- **REST Endpoints:**
  - `GET /api/v1/modules/manpower-estimation/records/` (user-filtered or guest IP, defaults to `is_active_draft=False`)
  - `POST /api/v1/modules/manpower-estimation/records/` (save/register completed manpower estimation)
  - `GET /api/v1/modules/manpower-estimation/records/draft/` (retrieve active working draft)
  - `POST /api/v1/modules/manpower-estimation/records/draft/` (auto-save active working draft)
  - `DELETE /api/v1/modules/manpower-estimation/records/draft/` (clear draft on reset)
  - `POST /api/v1/modules/manpower-estimation/records/claim-guest-plans/` (attach guest estimations upon user login)
- **Service Layer:** `manpowerService.js` extending `BaseApiService` with `bg_os_manpower_records` and `bg_os_manpower_draft` offline fallbacks.

### C. Saved Estimations Register (`/manpower-estimation/register`)
- **Executive KPI Dashboard:** Total Records, Draft Status, Approved Estimations, Combined Portfolio Value.
- **Search & Column Filters:** Search by Estimation No, Project Name, Customer, Area, Grand Total, Cost per $m^2$, Status, or Date.
- **Complete Row Actions:**
  - **View (👁):** Read-only preview modal (`ManpowerPreviewModal`) computing live metrics without missing numbers.
  - **Edit (✎):** Hydrates entire quotation state into the editor and opens `summary`.
  - **Print (🖨):** Opens printable commercial tender dossier (`ManpowerPrintDossier`).
  - **Copy (📋):** Clones record as draft with `-COPY` suffix.
  - **Delete (✕):** Permanently removes quotation from database and register.
  - **Export CSV:** Downloads formatted commercial register spreadsheet.
  - **Sample Refinery Record (💡):** 1-click button loads standard 20,000 $m^2$ petrochemical package (`EST-MP-2026-001`, ₹7,500,000) directly into the database.

---

## 7. Module 6: Blaster / Operator Qualification (`/blaster-qualification`)

### A. Sub-Tool Sections & Qualification Workflow
- **8 Core Technical Modules + Overview Hub & Register:**
  - **1. Hub (`hub`) & Dashboard (`dashboard`):** Qualification workflow guide, evaluation KPIs, standard card generator, and ISO 8501-1 / ASTM D4228 compliance trackers.
  - **2. Project & Operator Information (`project-operator` / `info`):** Report Reference (`BL-QR-2026-RAJESH-001`), Qualification Card No (`BG-QC-BL-2026-084`), Category (`Blaster` / `Pot Tender`), Civil ID / QID, Operator Full Name, Nationality, Date of Birth, Experience Years, Employer, Project Name (`NFS Qatar Gas Complex Expansion`), Client (`QatarEnergy LNG`), EPC Contractor (`Chiyoda Technip Joint Venture`), Location (`Ras Laffan Industrial City`), Reference Standards (`ASTM D 4228, SSPC, NACE, ISO 8501`), Coating System, and Operator Photo upload.
  - **3. Training & Assessment Test (`training-test` / `train`):** Pre-Training Test vs Post-Training Test scores (evaluated against 25 standardized industrial questions), test dates, percentage improvement calculation, and trainer evaluation notes.
  - **4. 12 Practical Competency Checklist Elements (`checklist`):** Pre-start equipment inspection, safety relief valves, anchor pattern vs DFT correlation, abrasive media characteristics, grounding clamps, hand signals, blotter test (ASTM D4285), nozzle pressure hypodermic needle test (PSI), ISO 8501-1 pictorial cleanliness standard, Testex replica tape profile reading, ISO 8502-3 dust tape test, overlap sweep technique, and PPE compliance. Pass/Fail evaluation per item with assessor observations.
  - **5. Blasting Process & Environmental Verification (`blasting-process` / `blasting`):** Environmental conditions logging (Dry Bulb, Wet Bulb, Steel Temp, Relative Humidity %, Dew Point), Surface preparation method (`Abrasive Blasting`), Surface cleanliness standard achieved (`Sa 2.5`), Anchor profile spot readings (5 replica tape locations, average calculated), Abrasive media specs (Garnet, Copper Slag, Steel Grit, Mesh Size, Manufacturer, Batch No, Test Certificate No), and Inspection Process Tests (Visual, Profile, Dust, Compressed Air Blotter).
  - **6. Photo Evidence Report (`photo-report` / `photo`):** Multi-photo gallery documenting Pre-blast condition, Blasting operation in progress, Post-blast surface cleanliness, Profile measurement gauge, Blotter test white paper, and Operator card portrait.
  - **7. Verdict, Signatures & Approval (`verdict-approval` / `verdict`):** Final qualification verdict (`PASS` / `FAIL`), Qualification Certificate Card issuance, Assessor signature, NACE/AMPP Level 3 badge details, Approver signature, Client QA/QC approval stamp, and validity expiration (1 year).
  - **8. Summary & Performance Evaluation (`summary`):** Comprehensive executive scorecard detailing practical checklist score (60%), written exam score (40%), final composite score %, and qualification status.
  - **Controlled A4 Qualification Dossier & Print View (`report` / `preview`):** Official bilingual/standard qualification certificate and complete multi-page audit dossier with dynamic company branding and security watermark.

### B. Backend Persistence (`blaster_qualification` Django App)
- **Model:** `BlasterRecord` in `backend/blaster_qualification/models.py`
  - Fields: `user` (nullable), `rep_no`, `operator_name`, `category`, `civil_id`, `project_name`, `client`, `contractor`, `location`, `qualification_card_no`, `qualification_date`, `next_assessment_date`, `overall_score`, `verdict` (`PASS`, `FAIL`, `PENDING`), `status` (`Draft`, `Approved`), `revision`, `is_active_draft` (bool), `data` (full JSON state), `notes`, `ip_address`, `user_agent`, `created_at` (IST), `updated_at` (IST).
- **REST Endpoints:**
  - `GET /api/v1/modules/blaster-qualification/records/` (user or guest IP filtered, default `is_active_draft=False`)
  - `POST /api/v1/modules/blaster-qualification/records/` (save/register approved qualification dossier)
  - `GET /api/v1/modules/blaster-qualification/records/draft/` (retrieve active working draft)
  - `POST /api/v1/modules/blaster-qualification/records/draft/` (auto-save active working draft)
  - `DELETE /api/v1/modules/blaster-qualification/records/draft/` (clear draft on reset)
  - `POST /api/v1/modules/blaster-qualification/records/claim-guest-reports/` (claims guest session dossiers on login)
- **Service Layer:** `blasterService.js` extending `BaseApiService` with `bgcoating.blaster.reports.v1` and `bg_blaster_draft` offline fallbacks.

### C. Saved Qualification Dossier Register (`/blaster-qualification/register`)
- **KPI Dashboard Cards:** Total Records, Draft Dossiers, Approved Dossiers, Passed Operators, Failed Operators.
- **Search & Column Filters:** Search by Report No, Operator Name, Civil ID, Card No, Project, Client, Verdict, or Status.
- **Complete Row Actions:**
  - **View (👁):** Read-only preview modal (`BlasterPreviewModal`) evaluating test scores and checklist metrics dynamically without mutating the user's active draft.
  - **Edit (✎):** Hydrates qualification dossier into the form editor and navigates to `/blaster-qualification/project-operator`.
  - **Print (🖨):** Opens full printable qualification dossier (`BlasterPrintDossier`).
  - **Copy (📋):** Clones record as draft with `-COPY` suffix.
  - **Delete (✕):** Prompts confirmation and removes record from database and local storage.
  - **Export CSV:** Downloads formatted qualification log spreadsheet.
  - **Sample Qualification Dossier (💡):** 1-click button seeds and loads standard QatarEnergy benchmark dossier (`BL-QR-2026-RAJESH-001`, Rajesh M. Patel, Score 96.0%, PASS).

---

## 8. Module 7: Spray Painter / Applicator Qualification (`/painter-qualification` / `/painter`)

### A. Sub-Tool Sections & Multi-Coat Qualification Architecture
- **8 Core Technical Modules + 4-Stage Multi-Coat Engine + Overview Hub & Register:**
  - **1. Hub (`hub`) & Dashboard (`dashboard`):** Qualification workflow status, 1-click industry templates (Offshore Splash Zone & Topsides NORSOK M-501 Sys 1, Storage Tank & Piping SSPC PA-2 / ISO 12944-C4, Infrastructure Structural Steel SSPC Paint 20 / ISO 12944-C3), standards tracker (ASTM D4228, SSPC PA-2, ASTM D4414, ASTM D7091, ASTM D3359, ASTM D4541, ASTM D5162, NACE/AMPP).
  - **2. Project & Operator Information (`project-operator` / `info`):** Report No (`SP-QR-2026-TARIQ-001`), Qualification Card No (`BG-QC-SP-2026-092`), Operator Full Name (`Mohammad Tariq`), Category (`Airless Spray Painter`), Civil ID (`CID-8829471`), Nationality, Date of Birth, Experience Years, Employer, Project Name (`Offshore Topsides Gas Flare Platform`), Project No (`PRJ-2026-FLARE-09`), Client (`Aramco / Offshore Energy Corp`), Contractor (`BG Engineering & Contracting Ltd`), Location (`Fabrication Yard 4 · Blast & Paint Bay`), Coating System selection (Primer, Intermediate, Topcoat) with **"Sync Coating System"** 1-click pusher to Stages S1–S4.
  - **3. Training & Assessment Test (`training-test` / `train`):** Pre-Training Test vs Post-Training Test scores (45 standardized industrial exam questions), test dates, percentage improvement calculation, and trainer evaluation notes.
  - **4. 13 Practical Competency Checklist Elements (`checklist`):** Equipment setup, pressure atomization, surface profile impact, environmental limits, pot life awareness, spray technique & 50% overlap, stripe coating for edges & welds, WFT comb measurement, DFT gauge operation (SSPC PA-2 80%-120% rule), coating defect identification & rectification (runs, sags, pinholes, orange peel), holiday testing (wet sponge / high voltage), and PPE compliance.
  - **5. 4-Stage Coat Application Sheets (`s1`, `s2`, `s3`, `s4`):**
    - **Stage 1 (s1):** Blasting surface prep visual (Sa 2.5), primer application, environmental readings (Dry Bulb, Wet Bulb, Steel Temp, Relative Humidity %, Dew Point Delta), paint batch traceability, mixing ratios, and 4-mini-table DFT matrix (Plane surface, 6" pipe, 6" T-beam, 12" wide flange).
    - **Stage 2 (s2):** 1st Intermediate / finish application, overcoating interval verification, environmental logging, stripe coating, and DFT spot readings.
    - **Stage 3 (s3):** 2nd Intermediate / finish application, recoat interval compliance, and DFT matrix.
    - **Stage 4 (s4):** 3rd Finish coat (Aliphatic PU / Polysiloxane), defect inspection, and cumulative DFT verification.
    - **Per-Coat Inspection Test Catalog:** 11 standardized tests (Blasting Visual, WFT, DFT, Cross-Cut Adhesion ASTM D3359, Pull-Off Adhesion ASTM D4541, Holiday Wet Sponge, Holiday High Voltage, Visual Defect Check, Pot Life, Mixing Ratio, Profile).
  - **6. Photo Evidence Report (`photo-report` / `photo`):** 10 photographic presets (Pre-blast substrate, Paint mixing & pot life, Stripe coating, Primer spray, WFT gauge check, Intermediate coat, Topcoat spray, DFT measurement, Cross-cut adhesion, Holiday test).
  - **7. Verdict, Signatures & Approval (`verdict-approval` / `verdict`):** Final composite score % computation (Post-Test 25%, Improvement 10%, Checklist 20%, DFT 20%, Inspection 15%, Environmental 10%), final qualification verdict (`PASS` / `FAIL`), Signatory 1 (Painter), Signatory 2 (QA/QC Inspector NACE Level 3), Signatory 3 (Client Representative), and digital stamp affixing.
  - **8. Summary & Performance Evaluation (`summary`):** Complete executive scorecard and digital qualification certificate.
  - **Controlled A4 Engineering Dossier & Print View (`preview` / `print`):** Full bilingual/standard qualification dossier with dynamic company branding and security watermark.

### B. Backend Persistence (`painter_qualification` Django App)
- **Model:** `PainterRecord` in `backend/painter_qualification/models.py`
  - Fields: `user` (nullable), `rep_no`, `operator_name`, `category`, `civil_id`, `project_name`, `client`, `contractor`, `location`, `qualification_card_no`, `qualification_date`, `next_assessment_date`, `overall_score`, `verdict` (`PASS`, `FAIL`, `PENDING`), `status` (`Draft`, `Approved`), `revision`, `is_active_draft` (bool), `data` (full JSON state), `notes`, `ip_address`, `user_agent`, `created_at` (IST), `updated_at` (IST).
- **REST Endpoints:**
  - `GET /api/v1/modules/painter-qualification/records/` (user or guest IP filtered, default `is_active_draft=False`)
  - `POST /api/v1/modules/painter-qualification/records/` (save/register approved qualification dossier)
  - `GET /api/v1/modules/painter-qualification/records/draft/` (retrieve active working draft)
  - `POST /api/v1/modules/painter-qualification/records/draft/` (auto-save active working draft)
  - `DELETE /api/v1/modules/painter-qualification/records/draft/` (clear draft on reset)
  - `POST /api/v1/modules/painter-qualification/records/claim-guest-reports/` (claims guest session dossiers on login)
- **Service Layer:** `painterService.js` extending `BaseApiService` with `bgcoating.spray.reports.v1` and `bg_painter_draft` offline fallbacks.

### C. Saved Qualification Dossier Register (`/painter-qualification/register`)
- **KPI Dashboard Cards:** Total Records, Draft Dossiers, Approved Dossiers, Passed Applicators, Failed Applicators, Sequence OK count, Sequence ERR count.
- **Search & Column Filters:** Search by Report No, Operator Name, Civil ID, Project, Client, Stage Sequence, Verdict, or Status.
- **Complete Row Actions:**
  - **View (👁):** Read-only preview modal (`PainterPreviewModal`) computing live metrics without mutating the working draft.
  - **Edit (✎):** Hydrates qualification dossier into the form editor and navigates to `/painter-qualification/project-operator`.
  - **Print (📄):** Opens full printable qualification dossier (`PainterPrintDossier`).
  - **Copy (📋):** Clones record as draft with `-COPY` suffix.
  - **Delete (🗑):** Prompts confirmation and removes record from database and local storage.
  - **Export CSV:** Downloads formatted qualification log spreadsheet.
  - **Save Active Report (💾):** 1-click button saves the working draft directly into the register.
  - **Sample Qualification Dossier (💡):** 1-click button loads benchmark offshore gas flare platform qualification dossier (`SP-QR-2026-TARIQ-001`, Mohammad Tariq, Score 95.5%, PASS).

---

## 9. Indian Timezone Standard (IST / UTC+05:30)

1. **Django Configuration (`backend/bgcoating_config/settings.py`):**
   ```python
   TIME_ZONE = 'Asia/Kolkata'
   USE_I18N = True
   USE_TZ = False  # Writes naive IST datetime directly into SQLite/PostgreSQL columns
   ```
2. **REST Framework Serializers:**
   ```python
   REST_FRAMEWORK = {
       'DATETIME_FORMAT': '%Y-%m-%d %H:%M:%S',
       'DATE_FORMAT': '%Y-%m-%d',
   }
   ```
3. **Frontend Date Generator:**
   ```javascript
   const getIndianDateString = () => {
     return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
   };
   ```
4. **Dossier & Print Timestamps:**
   ```javascript
   const currentDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
   const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
   ```

---

## 10. Sidebar Alignment & Modern Reconnection (4 Qualification & QA Modules)

### A. Diagnosis: Why the Sidebars Previously Differed from Reference Screenshots
1. **Generic Fallback Collapsing:** In `Sidebar.jsx`, `isPainter`, `isBlaster`, and `isTsa` were routed to a single unified stub `renderQualificationSidebar()` which had only 4 basic buttons (`dashboard`, `project-operator`, and short exam stubs), omitting the distinct engineering stages, photographic evidence logs, verdict sign-offs, output actions, and PRO branding blocks shown in the reference designs.
2. **Inspection Module Component Disconnect:** `InspectionReportingPage.jsx` had accidentally been importing and rendering `Blaster*` tools instead of the production-ready tools located in `calculator-react/src/tools/inspection/` (`InspectionHub`, `InspectionStage`, `InspectionPullOffAdhesion`, `InspectionCrossCutAdhesion`, `InspectionStandardsReference`, `InspectionPhotoReport`, `InspectionReportRegister`, `InspectionReworkRegister`, `InspectionDashboard`, etc.).
3. **SubTool Alias Incompatibilities:** Certain sidebar item IDs (e.g., `project-operator`, `training-test`, `blasting-process`, `coat-stage-s1`) did not have complete bi-directional alias mapping in `router.js` and in page view dispatch switches.

### B. Implementation Summary
1. **Dedicated Sidebar Renderers in `Sidebar.jsx`:**
   - `renderPainterSidebar()`: 100% matched to reference screenshot (Home, Project & Painter, Training, Assessment Checklist [0%], 4 Coating Stages S1–S4, Photographic Report [0%], Verdict & Approval, Registers, Preview, Print Report [PRO], Company Details [PRO], Watermark Removal [PRO]).
   - `renderTsaSidebar()`: 100% matched to reference screenshot (Home, Project & TSA Operator, Assessment Checklist [0%], Blasting + Thermal Spray, 1st Coat, 2nd Coat, 3rd Coat, Photographic Report, Verdict & Approval, Registers, Preview, Print Report [PRO], Company Details [PRO], Watermark Removal [PRO]).
   - `renderInspectionSidebar()`: 100% matched to reference screenshot (Inspection — Home, Coating Report, Collapsible ADHESION TEST [Pull-Off Report, Cross-Cut Report], References & Standards, Registers [Report Register, Rework Register [PRO]], Output [Preview, Print [PRO], Dashboard [PRO]], Branding [Company Details [PRO], Master List [PRO], Watermark Removal [PRO]]).
   - `renderBlasterSidebar()`: 100% matched to reference screenshot (Home, Project & Operator, Training & Test, Assessment Checklist [0%], Blasting Process, Photographic Report [0%], Verdict & Approval, Registers, Preview, Print Report [PRO], Company Details [PRO], Watermark Removal [PRO]).
2. **Full Router Synchronization (`router.js`):**
   - Added all aliases to `BLASTER_URL_MAP`, `PAINTER_URL_MAP`, `TSA_URL_MAP`, and `INSPECTION_URL_MAP` ensuring clean URLs and deep-linking back to the exact sub-tool view.
3. **Inspection Page Reconnection (`InspectionReportingPage.jsx`):**
   - Wired to `createInitialInspectionState()` from `data/inspectionDatabase.js`.
   - Wired to all 14 official inspection tools and modals.
   - Restored interactive multistage switching (`s1`, `s2`, `s3`, `s4`), pull-off adhesion testing, cross-cut classification, photographic documentation, rework register, live analytics dashboard, and dossier printing.
4. **Vite Build Verification:**
   - Executed `npm --prefix calculator-react run build` with zero errors (`✓ built in 7.18s`).

---

## 11. Template Checklist for Next Modules

When implementing the next module (e.g. `blaster-qualification`, `painter-qualification`, `ambient-conditions`, etc.), apply this exact pattern:

- [ ] **1. Django App:** Create/verify app with `Record` model (`user`, `identifier`, `status`, `data` JSON, `created_at`, `updated_at`).
- [ ] **2. ViewSet & Router:** Implement `ModelViewSet` with `/draft/` and `/claim-guest/` actions.
- [ ] **3. Service:** Create `moduleService.js` extending `BaseApiService` with local storage offline cache.
- [ ] **4. Routing:** Register clean paths in `router.js` (`MODULE_URL_MAP`) and Django `re_path`.
- [ ] **5. Form & Auto-Save:** Connect 800ms debounce auto-saving to `/records/draft/`.
- [ ] **6. Report Register:** Build Register view with KPI dashboard, column filters, and 5 actions (Edit, View, Print, Copy, Delete).
- [ ] **7. Modals at Root:** Mount Preview Modal, Validation Modal, and Branding Modal at the shared root of the component (no early-return blocks).
- [ ] **8. Timezone:** Enforce `Asia/Kolkata` for all database timestamps and display strings.
