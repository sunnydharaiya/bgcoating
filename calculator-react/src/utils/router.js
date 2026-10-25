// Router helper to map clean URL paths to Page & SubTool states and vice-versa

export const TOOL_URL_MAP = {
  // Paint Suite (7 Tools)
  'sp-pc': '/coating-calculator/paint/wft-range',
  'wft_range': '/coating-calculator/paint/wft-range',
  'sp-dft': '/coating-calculator/paint/dft',
  'dft': '/coating-calculator/paint/dft',
  'sp-cov': '/coating-calculator/paint/coverage',
  'coverage': '/coating-calculator/paint/coverage',
  'sp-cons': '/coating-calculator/paint/consumption',
  'paint_consumption': '/coating-calculator/paint/consumption',
  'sp-bl': '/coating-calculator/paint/blast-loss',
  'blasting_loss': '/coating-calculator/paint/blast-loss',
  'sp-mx': '/coating-calculator/paint/mixing-ratio',
  'mixing_ratio': '/coating-calculator/paint/mixing-ratio',
  'sp-cost': '/coating-calculator/paint/cost-per-area',
  'cost_per_area': '/coating-calculator/paint/cost-per-area',

  // Surface Area Suite (6 Tools)
  'sa-pipe': '/coating-calculator/area/pipe-spool',
  'pipe_spool': '/coating-calculator/area/pipe-spool',
  'spool_area': '/coating-calculator/area/pipe-spool',
  'sa-tank': '/coating-calculator/area/tank-shell',
  'tank_shell': '/coating-calculator/area/tank-shell',
  'tank_roof': '/coating-calculator/area/tank-roof',
  'spherical_tank': '/coating-calculator/area/spherical-tank',
  'sa-wws': '/coating-calculator/area/structural-steel',
  'structural_steel': '/coating-calculator/area/structural-steel',
  'sa-plate': '/coating-calculator/area/flat-plate',
  'flat_plate': '/coating-calculator/area/flat-plate',
  'sa-de': '/coating-calculator/area/dished-end',
  'dished_end': '/coating-calculator/area/dished-end',
  'sa-vessel': '/coating-calculator/area/vessel-equipment',
  'vessel_area': '/coating-calculator/area/vessel-equipment',

  // Abrasives & Salt (3 Tools)
  'ab-garnet': '/coating-calculator/abrasive/garnet',
  'garnet': '/coating-calculator/abrasive/garnet',
  'abrasive_garnet': '/coating-calculator/abrasive/garnet',
  'ab-cslag': '/coating-calculator/abrasive/copper-slag',
  'copper_slag': '/coating-calculator/abrasive/copper-slag',
  'abrasive_copper_slag': '/coating-calculator/abrasive/copper-slag',
  'abrasive_media': '/coating-calculator/abrasive/garnet',
  'nozzle_air': '/coating-calculator/abrasive/nozzle-air',
  'salt-main': '/coating-calculator/salt/iso-8502-9',
  'salt_test_tool': '/coating-calculator/salt/iso-8502-9',

  // Executive PRO Suite (28 Modules organized in 12 sections)
  // Section 1: Volume Solids
  'vs-tds': '/coating-calculator/pro/vs-tds',
  'vs_tds': '/coating-calculator/pro/vs-tds',
  'volume_solids_verify': '/coating-calculator/pro/vs-tds',
  'volume_solids': '/coating-calculator/pro/vs-tds',
  'vs-den': '/coating-calculator/pro/vs-den',
  'vs_den': '/coating-calculator/pro/vs-den',
  'volume_solids_density': '/coating-calculator/pro/vs-den',
  'vs-lab': '/coating-calculator/pro/vs-lab',
  'vs_lab': '/coating-calculator/pro/vs-lab',
  'volume_solids_lab': '/coating-calculator/pro/vs-lab',

  // Section 2: Paint Reconciliation
  'pro-recon': '/coating-calculator/pro/paint-reconciliation',
  'pro_recon': '/coating-calculator/pro/paint-reconciliation',
  'paint_reconciliation': '/coating-calculator/pro/paint-reconciliation',

  // Section 3: Coating Life Cycle Cost (LCC)
  'pro-lcc': '/coating-calculator/pro/life-cycle-cost',
  'pro_lcc': '/coating-calculator/pro/life-cycle-cost',
  'lifecycle_cost': '/coating-calculator/pro/life-cycle-cost',

  // Section 4: Abrasive Size & Blast Profile
  'pro-abp': '/coating-calculator/pro/blast-profile',
  'pro_abp': '/coating-calculator/pro/blast-profile',
  'blast_profile': '/coating-calculator/pro/blast-profile',

  // Section 5: Abrasive Recycling Calculator
  'pro-arc': '/coating-calculator/pro/abrasive-recycling',
  'pro_arc': '/coating-calculator/pro/abrasive-recycling',
  'abrasive_recycling': '/coating-calculator/pro/abrasive-recycling',

  // Section 6: Dust Collector Capacity
  'pro-dcc': '/coating-calculator/pro/dust-collector',
  'pro_dcc': '/coating-calculator/pro/dust-collector',
  'dust_collector': '/coating-calculator/pro/dust-collector',

  // Section 7: Surface Area & Weight
  'pro-saw': '/coating-calculator/pro/structure-boq',
  'pro_saw': '/coating-calculator/pro/structure-boq',
  'structure_boq': '/coating-calculator/pro/structure-boq',
  'surface_area_weight': '/coating-calculator/pro/structure-boq',

  // Section 8: Inspection & QA/QC
  'qa-pa2': '/coating-calculator/pro/dft-sspc-pa2',
  'qa_pa2': '/coating-calculator/pro/dft-sspc-pa2',
  'dft_sspc_pa2': '/coating-calculator/pro/dft-sspc-pa2',
  'sspc_pa2': '/coating-calculator/pro/dft-sspc-pa2',
  'dft-sspc-pa2': '/coating-calculator/pro/dft-sspc-pa2',
  'sspc-pa2': '/coating-calculator/pro/dft-sspc-pa2',
  'qa-iso': '/coating-calculator/pro/dft-iso-19840',
  'qa_iso': '/coating-calculator/pro/dft-iso-19840',
  'dft_iso_19840': '/coating-calculator/pro/dft-iso-19840',
  'iso_19840': '/coating-calculator/pro/dft-iso-19840',
  'dft-iso-19840': '/coating-calculator/pro/dft-iso-19840',
  'iso-19840': '/coating-calculator/pro/dft-iso-19840',
  'qa-hol': '/coating-calculator/pro/holiday-voltage',
  'qa_hol': '/coating-calculator/pro/holiday-voltage',
  'holiday_voltage': '/coating-calculator/pro/holiday-voltage',
  'holiday-voltage': '/coating-calculator/pro/holiday-voltage',
  'holiday': '/coating-calculator/pro/holiday-voltage',

  // Section 9: Corrosion Engineering
  'ce-rate': '/coating-calculator/pro/corrosion-rate',
  'ce_rate': '/coating-calculator/pro/corrosion-rate',
  'corrosion_rate': '/coating-calculator/pro/corrosion-rate',
  'corrosion-rate': '/coating-calculator/pro/corrosion-rate',
  'ce-life': '/coating-calculator/pro/coating-life-durability',
  'ce_life': '/coating-calculator/pro/coating-life-durability',
  'coating_life': '/coating-calculator/pro/coating-life-durability',
  'coating-life': '/coating-calculator/pro/coating-life-durability',
  'coating_life_durability': '/coating-calculator/pro/coating-life-durability',
  'coating-life-durability': '/coating-calculator/pro/coating-life-durability',

  // Section 10: Thermal Spray Aluminium (TSA)
  'tsa-wire': '/coating-calculator/pro/tsa-wire-consumption',
  'tsa_wire': '/coating-calculator/pro/tsa-wire-consumption',
  'tsa_wire_consumption': '/coating-calculator/pro/tsa-wire-consumption',
  'tsa-wire-consumption': '/coating-calculator/pro/tsa-wire-consumption',
  'tsa-cov': '/coating-calculator/pro/tsa-area-coverage',
  'tsa_cov': '/coating-calculator/pro/tsa-area-coverage',
  'tsa_area_coverage': '/coating-calculator/pro/tsa-area-coverage',
  'tsa-area-coverage': '/coating-calculator/pro/tsa-area-coverage',
  'tsa-eff': '/coating-calculator/pro/tsa-deposition-efficiency',
  'tsa_eff': '/coating-calculator/pro/tsa-deposition-efficiency',
  'tsa_deposition': '/coating-calculator/pro/tsa-deposition-efficiency',
  'tsa-deposition-efficiency': '/coating-calculator/pro/tsa-deposition-efficiency',
  'tsa-thk': '/coating-calculator/pro/tsa-thickness-verification',
  'tsa_thk': '/coating-calculator/pro/tsa-thickness-verification',
  'tsa_thickness': '/coating-calculator/pro/tsa-thickness-verification',
  'tsa_thickness_verify': '/coating-calculator/pro/tsa-thickness-verification',
  'tsa-thickness-verification': '/coating-calculator/pro/tsa-thickness-verification',
  'tsa-prod': '/coating-calculator/pro/tsa-productivity',
  'tsa_prod': '/coating-calculator/pro/tsa-productivity',
  'tsa_productivity': '/coating-calculator/pro/tsa-productivity',
  'tsa-productivity': '/coating-calculator/pro/tsa-productivity',
  'tsa-cost': '/coating-calculator/pro/tsa-cost',
  'tsa_cost': '/coating-calculator/pro/tsa-cost',
  'tsa_sealer_calc': '/coating-calculator/pro/tsa-sealer-calc',
  'tsa_sealer_cal': '/coating-calculator/pro/tsa-sealer-calc',
  'tsa_mandrel_eval': '/coating-calculator/pro/tsa-mandrel-eval',
  'tsa_adhesion_matrix': '/coating-calculator/pro/tsa-adhesion-matrix',
  'tsa_suite': '/coating-calculator/pro/tsa-wire-consumption',
  'tsa_thermal_spray': '/coating-calculator/pro/tsa-wire-consumption',

  // Section 11: Passive Fire Protection (PFP)
  'pfp-mat': '/coating-calculator/pro/pfp-material',
  'pfp_mat': '/coating-calculator/pro/pfp-material',
  'pfp_material': '/coating-calculator/pro/pfp-material',
  'pfp-material': '/coating-calculator/pro/pfp-material',
  'pfp-thk': '/coating-calculator/pro/pfp-thickness',
  'pfp_thk': '/coating-calculator/pro/pfp-thickness',
  'pfp_thickness': '/coating-calculator/pro/pfp-thickness',
  'pfp-thickness': '/coating-calculator/pro/pfp-thickness',
  'pfp_dft_matrix': '/coating-calculator/pro/pfp-thickness',
  'pfp-den': '/coating-calculator/pro/pfp-density',
  'pfp_den': '/coating-calculator/pro/pfp-density',
  'pfp_density': '/coating-calculator/pro/pfp-density',
  'pfp-density': '/coating-calculator/pro/pfp-density',
  'pfp-mesh': '/coating-calculator/pro/pfp-mesh-quantity',
  'pfp_mesh': '/coating-calculator/pro/pfp-mesh-quantity',
  'pfp_mesh_qty': '/coating-calculator/pro/pfp-mesh-quantity',
  'pfp-mesh-quantity': '/coating-calculator/pro/pfp-mesh-quantity',
  'pfp_reinforce_mesh': '/coating-calculator/pro/pfp-mesh-quantity',
  'pfp-cost': '/coating-calculator/pro/pfp-cost',
  'pfp_cost': '/coating-calculator/pro/pfp-cost',
  'pfp-rep': '/coating-calculator/pro/pfp-repair-quantity',
  'pfp_rep': '/coating-calculator/pro/pfp-repair-quantity',
  'pfp_repair': '/coating-calculator/pro/pfp-repair-quantity',
  'pfp-repair-quantity': '/coating-calculator/pro/pfp-repair-quantity',
  'pfp_hp_a_calc': '/coating-calculator/pro/pfp-hp-a-calc',
  'pfp_volume_quote': '/coating-calculator/pro/pfp-volume-quote',
  'pfp_intumescent': '/coating-calculator/pro/pfp-material',
  'pfp_suite': '/coating-calculator/pro/pfp-material',

  // Section 12: Bid Tab & Comparison
  'bid-proc': '/coating-calculator/pro/paint-procurement',
  'bid_proc': '/coating-calculator/pro/paint-procurement',
  'paint_procurement': '/coating-calculator/pro/paint-procurement',
  'paint-procurement': '/coating-calculator/pro/paint-procurement',
  'procurement_suite': '/coating-calculator/pro/paint-procurement',
  'bid-comp': '/coating-calculator/pro/bid-comparison',
  'bid_comp': '/coating-calculator/pro/bid-comparison',
  'bid_comparison': '/coating-calculator/pro/bid-comparison',
  'bid-comparison': '/coating-calculator/pro/bid-comparison',
  'contractor_bid_builder': '/coating-calculator/pro/contractor-bid-builder',
  'batch_ticket_generator': '/coating-calculator/pro/batch-ticket-generator',
  'executive_cost_summary': '/coating-calculator/pro/executive-cost-summary',
};

export const SPEC_URL_MAP = {
  'hub': '/specification-reading',
  'scope': '/specification-reading/scope',
  'environment': '/specification-reading/environment',
  'temperatures': '/specification-reading/temperatures',
  'special_systems': '/specification-reading/special-systems',
  'coating_design': '/specification-reading/coating-system',
  'testing_qc': '/specification-reading/testing-qc',
  'manufacturers': '/specification-reading/manufacturers',
  'revisions_notes': '/specification-reading/revisions-notes',
  'report_register': '/specification-reading/register',
  'register': '/specification-reading/register',
  'report': '/specification-reading/report',
  'print': '/specification-reading/report',
  'preview': '/specification-reading/preview',
  'watermark': '/specification-reading/watermark',
  'company_details': '/specification-reading/company-details',
  'company': '/specification-reading/company-details',
};

export const PROC_URL_MAP = {
  'hub': '/coating-procedure',
  'cover-revision': '/coating-procedure/cover-revision',
  'cover_revision': '/coating-procedure/cover-revision',
  'scope': '/coating-procedure/scope',
  'reference-docs': '/coating-procedure/reference-docs',
  'reference_docs': '/coating-procedure/reference-docs',
  'standards': '/coating-procedure/standards',
  'exclusions': '/coating-procedure/exclusions',
  'safety': '/coating-procedure/safety',
  'surface-prep': '/coating-procedure/surface-prep',
  'surface_prep': '/coating-procedure/surface-prep',
  'coating-app': '/coating-procedure/coating-app',
  'coating_app': '/coating-procedure/coating-app',
  'repair-plan': '/coating-procedure/repair-plan',
  'repair_plan': '/coating-procedure/repair-plan',
  'manufacturers': '/coating-procedure/manufacturers',
  'attachments': '/coating-procedure/attachments',
  'annexure-coating': '/coating-procedure/annexure-coating',
  'annexure_coating': '/coating-procedure/annexure-coating',
  'annexure-inspection': '/coating-procedure/annexure-inspection',
  'annexure_inspection': '/coating-procedure/annexure-inspection',
  'register': '/coating-procedure/register',
  'report': '/coating-procedure/report',
  'print': '/coating-procedure/report',
  'preview': '/coating-procedure/preview',
  'watermark': '/coating-procedure/watermark',
  'company-details': '/coating-procedure/company-details',
  'company_details': '/coating-procedure/company-details',
};

export const UNITRATE_URL_MAP = {
  'hub': '/unit-rate-estimation',
  'dashboard': '/unit-rate-estimation',
  'project-info': '/unit-rate-estimation/project-info',
  'project_info': '/unit-rate-estimation/project-info',
  'scope': '/unit-rate-estimation/scope',
  'section-d': '/unit-rate-estimation/section-d',
  'section_d': '/unit-rate-estimation/section-d',
  'section-f': '/unit-rate-estimation/section-f',
  'section_f': '/unit-rate-estimation/section-f',
  'cost-matrix': '/unit-rate-estimation/cost-matrix',
  'cost_matrix': '/unit-rate-estimation/cost-matrix',
  'table': '/unit-rate-estimation/cost-matrix',
  'est-input': '/unit-rate-estimation/cost-matrix',
  'est-progress': '/unit-rate-estimation/cost-matrix',
  'paint-cost': '/unit-rate-estimation/cost-matrix',
  'misc-cost': '/unit-rate-estimation/cost-matrix',
  'revisions': '/unit-rate-estimation/revisions',
  'validate': '/unit-rate-estimation/cost-matrix',
  'report-view': '/unit-rate-estimation/report-view',
  'register': '/unit-rate-estimation/register',
  'report-register': '/unit-rate-estimation/register',
  'preview': '/unit-rate-estimation/preview',
  'report': '/unit-rate-estimation/report',
  'print': '/unit-rate-estimation/report',
  'xlprint': '/unit-rate-estimation/report',
  'company-details': '/unit-rate-estimation/company-details',
  'company_details': '/unit-rate-estimation/company-details',
  'watermark': '/unit-rate-estimation/watermark',
};

export const MANPOWER_URL_MAP = {
  'hub': '/manpower-estimation',
  'dashboard': '/manpower-estimation/dashboard',
  'project-info': '/manpower-estimation/project-info',
  'project_info': '/manpower-estimation/project-info',
  'blasting': '/manpower-estimation/blasting-cost',
  'blasting-cost': '/manpower-estimation/blasting-cost',
  'blasting_cost': '/manpower-estimation/blasting-cost',
  'painting': '/manpower-estimation/paint-application',
  'paint-application': '/manpower-estimation/paint-application',
  'paint_application': '/manpower-estimation/paint-application',
  'raw-material': '/manpower-estimation/paint-raw-material',
  'paint-raw-material': '/manpower-estimation/paint-raw-material',
  'raw_material': '/manpower-estimation/paint-raw-material',
  'worker-ctc': '/manpower-estimation/worker-ctc',
  'worker_ctc': '/manpower-estimation/worker-ctc',
  'abrasive-diesel': '/manpower-estimation/abrasive-diesel',
  'abrasive_diesel': '/manpower-estimation/abrasive-diesel',
  'summary': '/manpower-estimation/summary',
  'front-page-summary': '/manpower-estimation/summary',
  'register': '/manpower-estimation/register',
  'report-register': '/manpower-estimation/register',
  'report': '/manpower-estimation/report',
  'print': '/manpower-estimation/report',
  'preview': '/manpower-estimation/preview',
  'watermark': '/manpower-estimation/watermark',
  'company-details': '/manpower-estimation/company-details',
  'company_details': '/manpower-estimation/company-details',
};

export const BLASTER_URL_MAP = {
  'hub': '/blaster-qualification',
  'dashboard': '/blaster-qualification/dashboard',
  'info': '/blaster-qualification/project-operator',
  'project-operator': '/blaster-qualification/project-operator',
  'project_operator': '/blaster-qualification/project-operator',
  'train': '/blaster-qualification/training-test',
  'training-test': '/blaster-qualification/training-test',
  'training_test': '/blaster-qualification/training-test',
  'checklist': '/blaster-qualification/checklist',
  'blasting': '/blaster-qualification/blasting-process',
  'blasting-process': '/blaster-qualification/blasting-process',
  'blasting_process': '/blaster-qualification/blasting-process',
  'photo': '/blaster-qualification/photo-report',
  'photo-report': '/blaster-qualification/photo-report',
  'photo_report': '/blaster-qualification/photo-report',
  'verdict': '/blaster-qualification/verdict-approval',
  'verdict-approval': '/blaster-qualification/verdict-approval',
  'verdict_approval': '/blaster-qualification/verdict-approval',
  'summary': '/blaster-qualification/summary',
  'register': '/blaster-qualification/register',
  'preview': '/blaster-qualification/preview',
  'watermark': '/blaster-qualification/watermark',
  'company-details': '/blaster-qualification/company-details',
  'company_details': '/blaster-qualification/company-details',
};

export const PAINTER_URL_MAP = {
  'hub': '/painter-qualification',
  'dashboard': '/painter-qualification/dashboard',
  'info': '/painter-qualification/project-operator',
  'project-info': '/painter-qualification/project-operator',
  'project_info': '/painter-qualification/project-operator',
  'train': '/painter-qualification/training-test',
  'training-test': '/painter-qualification/training-test',
  'training_test': '/painter-qualification/training-test',
  'checklist': '/painter-qualification/checklist',
  's1': '/painter-qualification/coat-stage-s1',
  'coat-stage-s1': '/painter-qualification/coat-stage-s1',
  'coat_stage_s1': '/painter-qualification/coat-stage-s1',
  's2': '/painter-qualification/coat-stage-s2',
  'coat-stage-s2': '/painter-qualification/coat-stage-s2',
  'coat_stage_s2': '/painter-qualification/coat-stage-s2',
  's3': '/painter-qualification/coat-stage-s3',
  'coat-stage-s3': '/painter-qualification/coat-stage-s3',
  'coat_stage_s3': '/painter-qualification/coat-stage-s3',
  's4': '/painter-qualification/coat-stage-s4',
  'coat-stage-s4': '/painter-qualification/coat-stage-s4',
  'coat_stage_s4': '/painter-qualification/coat-stage-s4',
  'photo': '/painter-qualification/photo-report',
  'photo-report': '/painter-qualification/photo-report',
  'photo_report': '/painter-qualification/photo-report',
  'verdict': '/painter-qualification/verdict-approval',
  'verdict-approval': '/painter-qualification/verdict-approval',
  'verdict_approval': '/painter-qualification/verdict-approval',
  'summary': '/painter-qualification/summary',
  'register': '/painter-qualification/register',
  'preview': '/painter-qualification/preview',
  'watermark': '/painter-qualification/watermark',
  'company-details': '/painter-qualification/company-details',
  'company_details': '/painter-qualification/company-details',
};

export const TSA_URL_MAP = {
  'hub': '/tsa-qualification',
  'dashboard': '/tsa-qualification/dashboard',
  'project-info': '/tsa-qualification/project-info',
  'project_info': '/tsa-qualification/project-info',
  'info': '/tsa-qualification/project-info',
  'checklist': '/tsa-qualification/checklist',
  's1': '/tsa-qualification/coat-stage-s1',
  'coat-stage-s1': '/tsa-qualification/coat-stage-s1',
  'coat_stage_s1': '/tsa-qualification/coat-stage-s1',
  's2': '/tsa-qualification/coat-stage-s2',
  'coat-stage-s2': '/tsa-qualification/coat-stage-s2',
  'coat_stage_s2': '/tsa-qualification/coat-stage-s2',
  's3': '/tsa-qualification/coat-stage-s3',
  'coat-stage-s3': '/tsa-qualification/coat-stage-s3',
  'coat_stage_s3': '/tsa-qualification/coat-stage-s3',
  's4': '/tsa-qualification/coat-stage-s4',
  'coat-stage-s4': '/tsa-qualification/coat-stage-s4',
  'coat_stage_s4': '/tsa-qualification/coat-stage-s4',
  'photo': '/tsa-qualification/photo-report',
  'photo-report': '/tsa-qualification/photo-report',
  'photo_report': '/tsa-qualification/photo-report',
  'verdict': '/tsa-qualification/verdict-approval',
  'verdict-approval': '/tsa-qualification/verdict-approval',
  'verdict_approval': '/tsa-qualification/verdict-approval',
  'summary': '/tsa-qualification/summary',
  'register': '/tsa-qualification/register',
  'preview': '/tsa-qualification/preview',
  'watermark': '/tsa-qualification/watermark',
  'company-details': '/tsa-qualification/company-details',
  'company_details': '/tsa-qualification/company-details',
};

export const INSPECTION_URL_MAP = {
  'hub': '/inspection-reporting',
  'info': '/inspection-reporting/project-operator',
  'project-operator': '/inspection-reporting/project-operator',
  'project_operator': '/inspection-reporting/project-operator',
  'train': '/inspection-reporting/training-test',
  'training-test': '/inspection-reporting/training-test',
  'training_test': '/inspection-reporting/training-test',
  'checklist': '/inspection-reporting/checklist',
  'blasting': '/inspection-reporting/blasting-process',
  'blasting-process': '/inspection-reporting/blasting-process',
  'blasting_process': '/inspection-reporting/blasting-process',
  'photo': '/inspection-reporting/photo-report',
  'photo-report': '/inspection-reporting/photo-report',
  'photo_report': '/inspection-reporting/photo-report',
  'verdict': '/inspection-reporting/verdict-approval',
  'verdict-approval': '/inspection-reporting/verdict-approval',
  'verdict_approval': '/inspection-reporting/verdict-approval',
  'summary': '/inspection-reporting/summary',
  'dashboard': '/inspection-reporting/dashboard',
  'register': '/inspection-reporting/register',
  'report_register': '/inspection-reporting/register',
  'preview': '/inspection-reporting/preview',
  'report': '/inspection-reporting/report',
  'print': '/inspection-reporting/report',
  'xlprint': '/inspection-reporting/report',
  'watermark': '/inspection-reporting/watermark',
  'company': '/inspection-reporting/company-details',
  'company-details': '/inspection-reporting/company-details',
  'company_details': '/inspection-reporting/company-details',
  's1': '/inspection-reporting/stage-s1',
  'stage-s1': '/inspection-reporting/stage-s1',
  'stage_s1': '/inspection-reporting/stage-s1',
  's2': '/inspection-reporting/stage-s2',
  'stage-s2': '/inspection-reporting/stage-s2',
  'stage_s2': '/inspection-reporting/stage-s2',
  's3': '/inspection-reporting/stage-s3',
  'stage-s3': '/inspection-reporting/stage-s3',
  'stage_s3': '/inspection-reporting/stage-s3',
  's4': '/inspection-reporting/stage-s4',
  'stage-s4': '/inspection-reporting/stage-s4',
  'stage_s4': '/inspection-reporting/stage-s4',
  'pull': '/inspection-reporting/pull-off-adhesion',
  'pull-off-adhesion': '/inspection-reporting/pull-off-adhesion',
  'pull_off_adhesion': '/inspection-reporting/pull-off-adhesion',
  'cross': '/inspection-reporting/cross-cut-adhesion',
  'cross-cut-adhesion': '/inspection-reporting/cross-cut-adhesion',
  'cross_cut_adhesion': '/inspection-reporting/cross-cut-adhesion',
  'std': '/inspection-reporting/standards',
  'standards': '/inspection-reporting/standards',
  'refp': '/inspection-reporting/pull-off-reference',
  'refc': '/inspection-reporting/cross-cut-reference',
  'rwkreg': '/inspection-reporting/rework-register',
  'rework-register': '/inspection-reporting/rework-register',
  'rework_register': '/inspection-reporting/rework-register',
  'master': '/inspection-reporting/master-systems',
  'master-systems': '/inspection-reporting/master-systems',
  'master_systems': '/inspection-reporting/master-systems',
};

export const PAGE_URL_MAP = {
  'dashboard': '/dashboard',
  'coating-calculator': '/coating-calculator',
  'specification-reading': '/specification-reading',
  'design': '/specification-reading',
  'coating-procedure': '/coating-procedure',
  'procedure': '/coating-procedure',
  'unit-rate-estimation': '/unit-rate-estimation',
  'cost-estimation': '/unit-rate-estimation',
  'manpower-estimation': '/manpower-estimation',
  'blaster-qualification': '/blaster-qualification',
  'blaster': '/blaster-qualification',
  'painter-qualification': '/painter-qualification',
  'spray-painter-qualification': '/painter-qualification',
  'spray-painter': '/painter-qualification',
  'painter': '/painter-qualification',
  'tsa-qualification': '/tsa-qualification',
  'tsa': '/tsa-qualification',
  'inspection-reporting': '/inspection-reporting',
  'academy-lms': '/academy-lms',
  'contractor-management': '/contractor-management',
  'knowledge': '/knowledge',
  'support': '/support',
  'settings': '/settings',
  'login': '/login',
  'auth': '/login',
};

// Parse current URL path to { page, subTool }
export function parseCurrentUrl() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

  // 0. Auth / Login Route
  if (path === '/login' || path === '/auth') {
    return { page: 'login', subTool: 'hub' };
  }

  // 1. Direct Page matches
  if (path === '' || path === '/' || path === '/dashboard') {
    return { page: 'dashboard', subTool: 'hub' };
  }

  // 2. Specification Reading Routes & Sub-Routes
  if (path === '/specification-reading' || path === '/design') {
    return { page: 'specification-reading', subTool: 'hub' };
  }
  if (path.startsWith('/specification-reading/')) {
    for (const [secId, url] of Object.entries(SPEC_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'specification-reading', subTool: secId };
      }
    }
    return { page: 'specification-reading', subTool: 'hub' };
  }

  // 3. Coating Procedure Routes & Sub-Routes
  if (path === '/coating-procedure' || path === '/procedure') {
    return { page: 'coating-procedure', subTool: 'hub' };
  }
  if (path.startsWith('/coating-procedure/')) {
    for (const [secId, url] of Object.entries(PROC_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'coating-procedure', subTool: secId };
      }
    }
    return { page: 'coating-procedure', subTool: 'hub' };
  }

  // 4. Quick Unit-Rate Estimation Routes & Sub-Routes
  if (path === '/unit-rate-estimation' || path === '/cost-estimation') {
    return { page: 'unit-rate-estimation', subTool: 'hub' };
  }
  if (path.startsWith('/unit-rate-estimation/')) {
    for (const [secId, url] of Object.entries(UNITRATE_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'unit-rate-estimation', subTool: secId };
      }
    }
    return { page: 'unit-rate-estimation', subTool: 'hub' };
  }

  // 5. Manpower-Based Painting Project Estimation Routes & Sub-Routes
  if (path === '/manpower-estimation') {
    return { page: 'manpower-estimation', subTool: 'hub' };
  }
  if (path.startsWith('/manpower-estimation/')) {
    for (const [secId, url] of Object.entries(MANPOWER_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'manpower-estimation', subTool: secId };
      }
    }
    return { page: 'manpower-estimation', subTool: 'hub' };
  }

  // 6. Blaster / Operator Qualification Routes & Sub-Routes
  if (path === '/blaster-qualification' || path === '/blaster') {
    return { page: 'blaster-qualification', subTool: 'hub' };
  }
  if (path.startsWith('/blaster-qualification/')) {
    for (const [secId, url] of Object.entries(BLASTER_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'blaster-qualification', subTool: secId };
      }
    }
    return { page: 'blaster-qualification', subTool: 'hub' };
  }

  // 7. Spray Painter Qualification Routes & Sub-Routes
  if (
    path === '/painter-qualification' || 
    path === '/painter' || 
    path === '/spray-painter-qualification' || 
    path === '/spray-painter'
  ) {
    return { page: 'painter-qualification', subTool: 'hub' };
  }
  if (
    path.startsWith('/painter-qualification/') || 
    path.startsWith('/spray-painter-qualification/') || 
    path.startsWith('/spray-painter/')
  ) {
    const cleanSub = path
      .replace('/painter-qualification/', '')
      .replace('/spray-painter-qualification/', '')
      .replace('/spray-painter/', '');
    for (const [secId, url] of Object.entries(PAINTER_URL_MAP)) {
      if (path === url.toLowerCase() || cleanSub === secId.toLowerCase() || url.toLowerCase().endsWith('/' + cleanSub)) {
        return { page: 'painter-qualification', subTool: secId };
      }
    }
    return { page: 'painter-qualification', subTool: cleanSub || 'hub' };
  }

  // 8. TSA Operator Qualification Routes & Sub-Routes
  if (path === '/tsa-qualification' || path === '/tsa') {
    return { page: 'tsa-qualification', subTool: 'hub' };
  }
  if (path.startsWith('/tsa-qualification/')) {
    for (const [secId, url] of Object.entries(TSA_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'tsa-qualification', subTool: secId };
      }
    }
    return { page: 'tsa-qualification', subTool: 'hub' };
  }

  // 9. Inspection Reporting Routes & Sub-Routes
  if (path === '/inspection-reporting' || path === '/qa-qc-inspection') {
    return { page: 'inspection-reporting', subTool: 'hub' };
  }
  if (path.startsWith('/inspection-reporting/')) {
    for (const [secId, url] of Object.entries(INSPECTION_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'inspection-reporting', subTool: secId };
      }
    }
    return { page: 'inspection-reporting', subTool: 'hub' };
  }

  if (path === '/academy-lms') {
    return { page: 'academy-lms', subTool: 'hub' };
  }
  if (path === '/contractor-management') {
    return { page: 'contractor-management', subTool: 'hub' };
  }
  if (path === '/knowledge') {
    return { page: 'knowledge', subTool: 'hub' };
  }
  if (path === '/support') {
    return { page: 'support', subTool: 'hub' };
  }
  if (path === '/settings') {
    return { page: 'settings', subTool: 'hub' };
  }

  // 10. Coating Calculator Sub-Tool match
  if (path.startsWith('/coating-calculator') || path.startsWith('/calc')) {
    // Exact match in TOOL_URL_MAP
    for (const [toolId, url] of Object.entries(TOOL_URL_MAP)) {
      if (path === url.toLowerCase()) {
        return { page: 'coating-calculator', subTool: toolId };
      }
    }

    // Fallback: extract trailing sub-slug and match intelligently
    const subSlug = path
      .replace(/^\/(coating-calculator|calc)(\/(paint|area|abrasive|salt|pro))?\/?/, '')
      .replace(/\/$/, '')
      .trim();

    if (subSlug && subSlug !== 'hub') {
      const slugCandidates = [
        subSlug,
        subSlug.replace(/-/g, '_'),
        subSlug.replace(/_/g, '-')
      ];

      for (const cand of slugCandidates) {
        if (TOOL_URL_MAP[cand]) return { page: 'coating-calculator', subTool: cand };
      }

      for (const [toolId, url] of Object.entries(TOOL_URL_MAP)) {
        const urlSlug = url.toLowerCase().split('/').pop();
        for (const cand of slugCandidates) {
          if (urlSlug === cand || urlSlug.startsWith(cand) || cand.startsWith(urlSlug)) {
            return { page: 'coating-calculator', subTool: toolId };
          }
        }
      }

      return { page: 'coating-calculator', subTool: subSlug };
    }

    return { page: 'coating-calculator', subTool: 'hub' };
  }

  // Default fallback to Coating Calculator Hub
  return { page: 'coating-calculator', subTool: 'hub' };
}

// Build URL string for given page and subTool
export function getUrlFor(page, subTool = 'hub') {
  if (page === 'coating-calculator' || page === 'calc') {
    if (subTool && subTool !== 'hub' && TOOL_URL_MAP[subTool]) {
      return TOOL_URL_MAP[subTool];
    }
    return '/coating-calculator';
  }

  if (page === 'specification-reading' || page === 'design') {
    if (subTool && subTool !== 'hub' && SPEC_URL_MAP[subTool]) {
      return SPEC_URL_MAP[subTool];
    }
    return '/specification-reading';
  }

  if (page === 'coating-procedure' || page === 'procedure') {
    if (subTool && subTool !== 'hub' && PROC_URL_MAP[subTool]) {
      return PROC_URL_MAP[subTool];
    }
    return '/coating-procedure';
  }

  if (page === 'unit-rate-estimation' || page === 'cost-estimation') {
    if (subTool && subTool !== 'hub' && UNITRATE_URL_MAP[subTool]) {
      return UNITRATE_URL_MAP[subTool];
    }
    return '/unit-rate-estimation';
  }

  if (page === 'manpower-estimation') {
    if (subTool && subTool !== 'hub' && MANPOWER_URL_MAP[subTool]) {
      return MANPOWER_URL_MAP[subTool];
    }
    return '/manpower-estimation';
  }

  if (page === 'blaster-qualification' || page === 'blaster') {
    if (subTool && subTool !== 'hub' && BLASTER_URL_MAP[subTool]) {
      return BLASTER_URL_MAP[subTool];
    }
    return '/blaster-qualification';
  }

  if (
    page === 'painter-qualification' || 
    page === 'painter' || 
    page === 'spray-painter-qualification' || 
    page === 'spray-painter'
  ) {
    if (subTool && subTool !== 'hub' && PAINTER_URL_MAP[subTool]) {
      return PAINTER_URL_MAP[subTool];
    }
    return '/painter-qualification';
  }

  if (page === 'tsa-qualification' || page === 'tsa') {
    if (subTool && subTool !== 'hub' && TSA_URL_MAP[subTool]) {
      return TSA_URL_MAP[subTool];
    }
    return '/tsa-qualification';
  }

  if (page === 'inspection-reporting' || page === 'qa-qc-inspection') {
    if (subTool && subTool !== 'hub' && INSPECTION_URL_MAP[subTool]) {
      return INSPECTION_URL_MAP[subTool];
    }
    return '/inspection-reporting';
  }

  return PAGE_URL_MAP[page] || `/${page}`;
}

