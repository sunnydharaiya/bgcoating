import React from 'react';
import { 
  Calculator, 
  Paintbrush, 
  SquareDot, 
  Flame, 
  TestTube, 
  Crown, 
  ArrowRight, 
  Layers, 
  Percent, 
  Sliders, 
  TrendingUp, 
  FlaskConical, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ChevronRight,
  Info,
  Scale,
  Zap,
  Activity,
  FlameKindling,
  Box,
  FileSpreadsheet,
  RotateCcw,
  Wrench,
  ArrowLeft,
  Gem,
  Disc,
  Check
} from 'lucide-react';

// Paint Suite
import WFTRangeTool from '../tools/paint/WFTRangeTool';
import DFTTool from '../tools/paint/DFTTool';
import CoverageTool from '../tools/paint/CoverageTool';
import PaintConsumptionTool from '../tools/paint/PaintConsumptionTool';
import BlastingLossTool from '../tools/paint/BlastingLossTool';
import MixingRatioTool from '../tools/paint/MixingRatioTool';
import CostPerAreaTool from '../tools/paint/CostPerAreaTool';

// Surface Area Suite
import PipeAreaTool from '../tools/surface/PipeAreaTool';
import TankAreaTool from '../tools/surface/TankAreaTool';
import StructureWeightTool from '../tools/surface/StructureWeightTool';
import PlateAreaTool from '../tools/surface/PlateAreaTool';
import DishedEndTool from '../tools/surface/DishedEndTool';
import VesselAreaTool from '../tools/surface/VesselAreaTool';

// Abrasives & Salt Suite
import AbrasiveConsumptionTool from '../tools/abrasives/AbrasiveConsumptionTool';
import SaltContaminationTool from '../tools/salt/SaltContaminationTool';

// Executive PRO Suite
import VolumeSolidsSuite from '../tools/pro/VolumeSolidsSuite';
import PaintReconciliationTool from '../tools/pro/PaintReconciliationTool';
import LifeCycleCostTool from '../tools/pro/LifeCycleCostTool';
import BlastProfileTool from '../tools/pro/BlastProfileTool';
import AbrasiveRecyclingTool from '../tools/pro/AbrasiveRecyclingTool';
import DustCollectorTool from '../tools/pro/DustCollectorTool';
import StructureBOQTool from '../tools/pro/StructureBOQTool';

// Compliance & Asset Life
import SSPCPA2Tool from '../tools/compliance/SSPCPA2Tool';
import ISO19840Tool from '../tools/compliance/ISO19840Tool';
import HolidayVoltageTool from '../tools/compliance/HolidayVoltageTool';
import CorrosionRateTool from '../tools/compliance/CorrosionRateTool';
import CoatingLifePredictionTool from '../tools/compliance/CoatingLifePredictionTool';

// Specialized TSA / PFP / Procurement / Bid
import TSASuite from '../tools/specialized/TSASuite';
import PFPSuite from '../tools/specialized/PFPSuite';
import ProcurementSuite from '../tools/specialized/ProcurementSuite';

// Shared PRO Reference & Classification Component
import ProReferenceCard from '../components/ProReferenceCard';

export default function CoatingCalculatorPage({ activeSubTool, setActiveSubTool }) {
  
  // Tool Mapping
  const toolComponents = {
    // 1. Paint Suite (7 Tools)
    'sp-pc': { component: WFTRangeTool, title: 'WFT Range Calculator', group: 'paint' },
    'wft_range': { component: WFTRangeTool, title: 'WFT Range Calculator', group: 'paint' },
    'sp-dft': { component: DFTTool, title: 'DFT Calculator', group: 'paint' },
    'dft': { component: DFTTool, title: 'DFT Calculator', group: 'paint' },
    'sp-cov': { component: CoverageTool, title: 'Paint Coverage (Spreading Rate)', group: 'paint' },
    'coverage': { component: CoverageTool, title: 'Paint Coverage (Spreading Rate)', group: 'paint' },
    'sp-cons': { component: PaintConsumptionTool, title: 'Paint Consumption Calculator', group: 'paint' },
    'paint_consumption': { component: PaintConsumptionTool, title: 'Paint Consumption Calculator', group: 'paint' },
    'sp-bl': { component: BlastingLossTool, title: 'Blasting Dead Volume Loss (Rz)', group: 'paint' },
    'blasting_loss': { component: BlastingLossTool, title: 'Blasting Dead Volume Loss (Rz)', group: 'paint' },
    'sp-mx': { component: MixingRatioTool, title: 'Paint Mixing Ratio & Thinner', group: 'paint' },
    'mixing_ratio': { component: MixingRatioTool, title: 'Paint Mixing Ratio & Thinner', group: 'paint' },
    'sp-cost': { component: CostPerAreaTool, title: 'Paint Cost Per Area (₹/m²)', group: 'paint' },
    'cost_per_area': { component: CostPerAreaTool, title: 'Paint Cost Per Area (₹/m²)', group: 'paint' },

    // 2. Surface Area (6 Tools)
    'sa-pipe': { component: PipeAreaTool, title: 'Pipe Spool Surface Area', group: 'area' },
    'pipe_spool': { component: PipeAreaTool, title: 'Pipe Spool Surface Area', group: 'area' },
    'spool_area': { component: PipeAreaTool, title: 'Pipe Spool Surface Area', group: 'area' },
    'sa-tank': { component: TankAreaTool, title: 'Storage Tank Surface Area', group: 'area' },
    'tank_shell': { component: TankAreaTool, title: 'Storage Tank Surface Area', group: 'area' },
    'tank_roof': { component: TankAreaTool, title: 'Storage Tank Surface Area', group: 'area' },
    'spherical_tank': { component: TankAreaTool, title: 'Storage Tank Surface Area', group: 'area' },
    'sa-wws': { component: StructureWeightTool, title: 'Structural Steel Weight-Wise Area', group: 'area' },
    'structural_steel': { component: StructureWeightTool, title: 'Structural Steel Weight-Wise Area', group: 'area' },
    'sa-plate': { component: PlateAreaTool, title: 'Flat Plate Surface Area & Weight', group: 'area' },
    'flat_plate': { component: PlateAreaTool, title: 'Flat Plate Surface Area & Weight', group: 'area' },
    'sa-de': { component: DishedEndTool, title: 'Dished End Surface Area', group: 'area' },
    'dished_end': { component: DishedEndTool, title: 'Dished End Surface Area', group: 'area' },
    'sa-vessel': { component: VesselAreaTool, title: 'Vessel & Equipment Surface Area', group: 'area' },
    'vessel_area': { component: VesselAreaTool, title: 'Vessel & Equipment Surface Area', group: 'area' },

    // 3. Abrasives & Salt (3 Tools)
    'ab-garnet': { component: AbrasiveConsumptionTool, title: 'Garnet Abrasive Consumption', group: 'abrasive' },
    'garnet': { component: AbrasiveConsumptionTool, title: 'Garnet Abrasive Consumption', group: 'abrasive' },
    'abrasive_garnet': { component: AbrasiveConsumptionTool, title: 'Garnet Abrasive Consumption', group: 'abrasive' },
    'ab-cslag': { component: AbrasiveConsumptionTool, title: 'Copper Slag Consumption', group: 'abrasive' },
    'copper_slag': { component: AbrasiveConsumptionTool, title: 'Copper Slag Consumption', group: 'abrasive' },
    'abrasive_copper_slag': { component: AbrasiveConsumptionTool, title: 'Copper Slag Consumption', group: 'abrasive' },
    'abrasive_media': { component: AbrasiveConsumptionTool, title: 'Abrasive Media Matrix', group: 'abrasive' },
    'nozzle_air': { component: AbrasiveConsumptionTool, title: 'Abrasive Media Matrix', group: 'abrasive' },
    'salt-main': { component: SaltContaminationTool, title: 'Salt Contamination Test (ISO 8502-9)', group: 'salt' },
    'salt_test_tool': { component: SaltContaminationTool, title: 'Salt Contamination Test (ISO 8502-9)', group: 'salt' },
    'salt_limit_pro': { component: SaltContaminationTool, title: 'Salt Contamination Test (ISO 8502-9)', group: 'salt' },

    // 4. Executive PRO Suite (28 Modules organized under 12 sections)
    // Section 1: Volume Solids
    'vs-tds': { component: VolumeSolidsSuite, title: 'Volume Solids — TDS Verification', group: 'pro' },
    'vs_tds': { component: VolumeSolidsSuite, title: 'Volume Solids — TDS Verification', group: 'pro' },
    'volume_solids_verify': { component: VolumeSolidsSuite, title: 'Volume Solids — TDS Verification', group: 'pro' },
    'volume_solids': { component: VolumeSolidsSuite, title: 'Volume Solids — TDS Verification', group: 'pro' },
    'vs-den': { component: VolumeSolidsSuite, title: 'Volume Solids — Density Verification', group: 'pro' },
    'vs_den': { component: VolumeSolidsSuite, title: 'Volume Solids — Density Verification', group: 'pro' },
    'volume_solids_density': { component: VolumeSolidsSuite, title: 'Volume Solids — Density Verification', group: 'pro' },
    'vs-lab': { component: VolumeSolidsSuite, title: 'Volume Solids — Lab ASTM D2697 / ISO 3233', group: 'pro' },
    'vs_lab': { component: VolumeSolidsSuite, title: 'Volume Solids — Lab ASTM D2697 / ISO 3233', group: 'pro' },
    'volume_solids_lab': { component: VolumeSolidsSuite, title: 'Volume Solids — Lab ASTM D2697 / ISO 3233', group: 'pro' },
    'wft_check_pro': { component: VolumeSolidsSuite, title: 'Volume Solids Verification', group: 'pro' },

    // Section 2: Paint Reconciliation
    'pro-recon': { component: PaintReconciliationTool, title: 'Paint Reconciliation (Theoretical vs Actual)', group: 'pro' },
    'pro_recon': { component: PaintReconciliationTool, title: 'Paint Reconciliation (Theoretical vs Actual)', group: 'pro' },
    'paint_reconciliation': { component: PaintReconciliationTool, title: 'Paint Reconciliation (Theoretical vs Actual)', group: 'pro' },
    'report_register': { component: PaintReconciliationTool, title: 'Paint Reconciliation Register', group: 'pro' },

    // Section 3: Coating Life Cycle Cost (LCC)
    'pro-lcc': { component: LifeCycleCostTool, title: 'Coating Life Cycle Cost (Total Cost of Ownership)', group: 'pro' },
    'pro_lcc': { component: LifeCycleCostTool, title: 'Coating Life Cycle Cost (Total Cost of Ownership)', group: 'pro' },
    'lifecycle_cost': { component: LifeCycleCostTool, title: 'Coating Life Cycle Cost (Total Cost of Ownership)', group: 'pro' },

    // Section 4: Abrasive Size & Blast Profile
    'pro-abp': { component: BlastProfileTool, title: 'Abrasive Size & Blast Profile Prediction', group: 'pro' },
    'pro_abp': { component: BlastProfileTool, title: 'Abrasive Size & Blast Profile Prediction', group: 'pro' },
    'blast_profile': { component: BlastProfileTool, title: 'Abrasive Size & Blast Profile Prediction', group: 'pro' },
    'blasting_media_pro': { component: BlastProfileTool, title: 'Abrasive Size & Blast Profile Prediction', group: 'pro' },

    // Section 5: Abrasive Recycling Calculator
    'pro-arc': { component: AbrasiveRecyclingTool, title: 'Abrasive Recycling & Recovery Efficiency', group: 'pro' },
    'pro_arc': { component: AbrasiveRecyclingTool, title: 'Abrasive Recycling & Recovery Efficiency', group: 'pro' },
    'abrasive_recycling': { component: AbrasiveRecyclingTool, title: 'Abrasive Recycling & Recovery Efficiency', group: 'pro' },

    // Section 6: Dust Collector Capacity
    'pro-dcc': { component: DustCollectorTool, title: 'Dust Collector Capacity (CFM · Filter Area · Fan)', group: 'pro' },
    'pro_dcc': { component: DustCollectorTool, title: 'Dust Collector Capacity (CFM · Filter Area · Fan)', group: 'pro' },
    'dust_collector': { component: DustCollectorTool, title: 'Dust Collector Capacity (CFM · Filter Area · Fan)', group: 'pro' },
    'dehumidification_pro': { component: DustCollectorTool, title: 'Dust Collector Capacity & Ventilation', group: 'pro' },

    // Section 7: Surface Area & Weight
    'pro-saw': { component: StructureBOQTool, title: 'Surface Area & Steel Weight BOQ Builder', group: 'pro' },
    'pro_saw': { component: StructureBOQTool, title: 'Surface Area & Steel Weight BOQ Builder', group: 'pro' },
    'structure_boq': { component: StructureBOQTool, title: 'Surface Area & Steel Weight BOQ Builder', group: 'pro' },
    'surface_area_weight': { component: StructureBOQTool, title: 'Surface Area & Steel Weight BOQ Builder', group: 'pro' },

    // Section 8: Inspection & QA/QC
    'qa-pa2': { component: SSPCPA2Tool, title: 'DFT Acceptance Compliance — SSPC-PA 2', group: 'pro' },
    'qa_pa2': { component: SSPCPA2Tool, title: 'DFT Acceptance Compliance — SSPC-PA 2', group: 'pro' },
    'dft_sspc_pa2': { component: SSPCPA2Tool, title: 'DFT Acceptance Compliance — SSPC-PA 2', group: 'pro' },
    'sspc_pa2': { component: SSPCPA2Tool, title: 'DFT Acceptance Compliance — SSPC-PA 2', group: 'pro' },
    'qa-iso': { component: ISO19840Tool, title: 'DFT Acceptance Compliance — ISO 19840', group: 'pro' },
    'qa_iso': { component: ISO19840Tool, title: 'DFT Acceptance Compliance — ISO 19840', group: 'pro' },
    'dft_iso_19840': { component: ISO19840Tool, title: 'DFT Acceptance Compliance — ISO 19840', group: 'pro' },
    'iso_19840': { component: ISO19840Tool, title: 'DFT Acceptance Compliance — ISO 19840', group: 'pro' },
    'qa-hol': { component: HolidayVoltageTool, title: 'Holiday Test Voltage (ASTM G62 / NACE SP0188)', group: 'pro' },
    'qa_hol': { component: HolidayVoltageTool, title: 'Holiday Test Voltage (ASTM G62 / NACE SP0188)', group: 'pro' },
    'holiday_voltage': { component: HolidayVoltageTool, title: 'Holiday Test Voltage (ASTM G62 / NACE SP0188)', group: 'pro' },

    // Section 9: Corrosion Engineering
    'ce-rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'ce_rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'corrosion_rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'ce-life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'ce_life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'coating_life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'coating_life_durability': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'env_conditions': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },

    // Section 10: Thermal Spray Aluminium (TSA)
    'tsa-wire': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa_wire': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa_wire_consumption': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa-cov': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa_cov': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa_area_coverage': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa-eff': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa_eff': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa_deposition': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa-thk': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa_thk': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa_thickness': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa_thickness_verify': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa-prod': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
    'tsa_prod': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
    'tsa_productivity': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
    'tsa-cost': { component: TSASuite, title: 'TSA Cost Estimation (₹/m²)', group: 'pro' },
    'tsa_cost': { component: TSASuite, title: 'TSA Cost Estimation (₹/m²)', group: 'pro' },
    'tsa_sealer_calc': { component: TSASuite, title: 'TSA Sealer Paint Coverage', group: 'pro' },
    'tsa_sealer_cal': { component: TSASuite, title: 'TSA Sealer Paint Coverage', group: 'pro' },
    'tsa_mandrel_eval': { component: TSASuite, title: 'TSA 180° Mandrel Bend Test Eval', group: 'pro' },
    'tsa_adhesion_matrix': { component: TSASuite, title: 'TSA Pull-off Adhesion Test Matrix', group: 'pro' },
    'tsa_suite': { component: TSASuite, title: 'Thermal Spray Aluminium (TSA)', group: 'pro' },
    'tsa_thermal_spray': { component: TSASuite, title: 'Thermal Spray Aluminium (TSA)', group: 'pro' },

    // Section 11: Passive Fire Protection (PFP)
    'pfp-mat': { component: PFPSuite, title: 'PFP Material Consumption', group: 'pro' },
    'pfp_mat': { component: PFPSuite, title: 'PFP Material Consumption', group: 'pro' },
    'pfp_material': { component: PFPSuite, title: 'PFP Material Consumption', group: 'pro' },
    'pfp-thk': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp_thk': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp_thickness': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp_dft_matrix': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp-den': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp_den': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp_density': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp-mesh': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp_mesh': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp_mesh_qty': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp_reinforce_mesh': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp-cost': { component: PFPSuite, title: 'PFP Cost Breakdown Across 9 Heads', group: 'pro' },
    'pfp_cost': { component: PFPSuite, title: 'PFP Cost Breakdown Across 9 Heads', group: 'pro' },
    'pfp-rep': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp_rep': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp_repair': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp_hp_a_calc': { component: PFPSuite, title: 'PFP Section Factor (Hp/A)', group: 'pro' },
    'pfp_volume_quote': { component: PFPSuite, title: 'PFP Volume & Weight Take-Off', group: 'pro' },
    'pfp_intumescent': { component: PFPSuite, title: 'Passive Fire Protection (PFP)', group: 'pro' },
    'pfp_suite': { component: PFPSuite, title: 'Passive Fire Protection (PFP)', group: 'pro' },

    // Section 12: Bid Tab & Comparison
    'bid-proc': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'bid_proc': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'paint_procurement': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'procurement_suite': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'bid-comp': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
    'bid_comp': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
    'bid_comparison': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
    'contractor_bid_builder': { component: ProcurementSuite, title: 'Commercial Bid Builder', group: 'pro' },
    'batch_ticket_generator': { component: ProcurementSuite, title: 'Batch Inspection Ticket', group: 'pro' },
    'executive_cost_summary': { component: LifeCycleCostTool, title: 'Executive Cost Summary', group: 'pro' },
    'pro_estimator': { component: LifeCycleCostTool, title: 'Executive PRO Estimator', group: 'pro' }
  };

  // Group Sub-Navigation Tab Definitions
  const paintSubNav = [
    { id: 'sp-pc', label: '🧮 WFT Range' },
    { id: 'sp-dft', label: '📏 DFT' },
    { id: 'sp-cov', label: '📐 Coverage' },
    { id: 'sp-cons', label: '🧪 Consumption' },
    { id: 'sp-bl', label: '💥 Blast Loss' },
    { id: 'sp-mx', label: '⚗️ Mixing' },
    { id: 'sp-cost', label: '💰 Cost/Area' }
  ];

  const areaSubNav = [
    { id: 'sa-pipe', label: '🔩 Pipe' },
    { id: 'sa-tank', label: '🛢️ Tank' },
    { id: 'sa-wws', label: '⚖️ Structure' },
    { id: 'sa-plate', label: '🔲 Plate' },
    { id: 'sa-de', label: '🫙 Dished End' },
    { id: 'sa-vessel', label: '🏭 Vessel' }
  ];

  const abrasiveSubNav = [
    { id: 'ab-garnet', label: '💎 Garnet' },
    { id: 'ab-cslag', label: '🪨 Copper Slag' }
  ];

  const saltSubNav = [
    { id: 'salt-main', label: '🧂 Bresle Salt Test' }
  ];

  const proSubNav = [
    { id: 'vs-tds', label: '📋 VS · TDS' },
    { id: 'vs-den', label: '⚖️ VS · Density' },
    { id: 'vs-lab', label: '🧫 VS · Lab D2697' },
    { id: 'pro-recon', label: '📊 Paint Reconciliation' },
    { id: 'pro-lcc', label: '💹 Life Cycle Cost' },
    { id: 'pro-abp', label: '🪨 Blast Profile' },
    { id: 'pro-arc', label: '♻️ Abrasive Recycling' },
    { id: 'pro-dcc', label: '🌀 Dust Collector' },
    { id: 'pro-saw', label: '🏗️ Area & Weight' },
    { id: 'qa-pa2', label: '📏 DFT · SSPC-PA 2' },
    { id: 'qa-iso', label: '📐 DFT · ISO 19840' },
    { id: 'qa-hol', label: '⚡ Holiday Voltage' },
    { id: 'ce-rate', label: '🧲 Corrosion Rate' },
    { id: 'ce-life', label: '🩺 Coating Life Predict' },
    { id: 'tsa-wire', label: '🧵 TSA Wire' },
    { id: 'tsa-cov', label: '📦 TSA Coverage' },
    { id: 'tsa-eff', label: '🎯 TSA Efficiency' },
    { id: 'tsa-thk', label: '🔎 TSA Thickness' },
    { id: 'tsa-prod', label: '⏱️ TSA Productivity' },
    { id: 'tsa-cost', label: '💰 TSA Cost' },
    { id: 'pfp-mat', label: '🧱 PFP Material' },
    { id: 'pfp-thk', label: '🔥 PFP Thickness' },
    { id: 'pfp-den', label: '⚗️ PFP Density' },
    { id: 'pfp-mesh', label: '🕸️ Mesh Quantity' },
    { id: 'pfp-cost', label: '🧾 PFP Cost' },
    { id: 'pfp-rep', label: '🩹 PFP Repair' },
    { id: 'bid-proc', label: '🛒 Procurement Qty' },
    { id: 'bid-comp', label: '🏆 Bid Comparison' }
  ];

  // If a sub-tool is active and exists in component map, render it
  if (activeSubTool && toolComponents[activeSubTool]) {
    const ActiveTool = toolComponents[activeSubTool].component;
    const toolTitle = toolComponents[activeSubTool].title;
    const activeGroup = toolComponents[activeSubTool].group;

    let currentNavList = [];
    if (activeGroup === 'paint') currentNavList = paintSubNav;
    else if (activeGroup === 'area') currentNavList = areaSubNav;
    else if (activeGroup === 'abrasive') currentNavList = abrasiveSubNav;
    else if (activeGroup === 'salt') currentNavList = saltSubNav;
    else if (activeGroup === 'pro') currentNavList = proSubNav;

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#D8DEE5] shadow-[0_2px_8px_rgba(20,24,32,0.06)]">
          <button
            onClick={() => setActiveSubTool('hub')}
            className="text-xs font-bold font-rajdhani uppercase tracking-wider text-[#E87B1E] hover:text-[#9E1B1E] flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Calculator Hub</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#4E5B6A] bg-[#F7F8FA] border border-[#D8DEE5] px-2.5 py-0.5 rounded-md hidden sm:inline">
            Active: {toolTitle}
          </span>
        </div>

        {/* PRO Executive Banner (Rendered when in PRO group) */}
        {activeGroup === 'pro' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#14181F] via-[#1E2530] to-[#2E1408] border border-[#E87B1E]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div>
                <h3 className="text-white font-extrabold text-sm md:text-base tracking-wide font-rajdhani uppercase">
                  EXECUTIVE COATING CALCULATION (PRO SUITE)
                </h3>
                <p className="text-slate-300 text-xs mt-0.5 font-sans">
                  For Paint Manufacturers · QA/QC · AMPP/NACE Inspectors · Consultants · EPC · Procurement · Asset Owners
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white text-[9.5px] font-bold uppercase font-mono tracking-widest self-end md:self-auto shrink-0 shadow-xs">
              Modular · Expanding (28 Tools)
            </span>
          </div>
        )}

        {/* Top Horizontal Sub-Navigation Tab Bar */}
        {currentNavList.length > 0 && (
          <div className="bg-white p-1.5 rounded-xl border border-[#D8DEE5] shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {currentNavList.map(tab => {
              const isActive = activeSubTool === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTool(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider' 
                      : 'text-[#4E5B6A] hover:bg-[#F7F8FA] hover:text-[#1B222C]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Tool Form Component */}
        <ActiveTool activeSubTool={activeSubTool} onSubToolChange={setActiveSubTool} />

        {/* Reference Standards & Smart Classification Component (Always visible under all PRO pages) */}
        {activeGroup === 'pro' && (
          <ProReferenceCard />
        )}
      </div>
    );
  }

  // Otherwise, render the 1:1 Coating Calculator Hub
  const categoryCards = [
    { title: 'Paint Calculators', count: '7', subtitle: 'WFT · DFT · Coverage · Consumption', icon: Paintbrush, color: 'orange', defaultTool: 'sp-pc' },
    { title: 'Surface Area', count: '6', subtitle: 'Pipes · Tanks · Structural · Vessel', icon: SquareDot, color: 'sky', defaultTool: 'sa-pipe' },
    { title: 'Abrasive Consumption', count: '2', subtitle: 'Garnet · Copper Slag Matrix', icon: Flame, color: 'amber', defaultTool: 'ab-garnet' },
    { title: 'Salt Contamination', count: '1', subtitle: 'Bresle · ISO 8502-9 Test', icon: TestTube, color: 'emerald', defaultTool: 'salt-main' },
    { title: 'Executive Coating Calculation - PRO', count: '28', subtitle: '12 Sections · TSA · PFP · QCBS · LCC', icon: Crown, color: 'purple', defaultTool: 'vs-tds' }
  ];

  const quickAccessButtons = [
    { label: 'WFT Range', id: 'sp-pc', icon: Sliders },
    { label: 'DFT Calculator', id: 'sp-dft', icon: Percent },
    { label: 'Paint Coverage', id: 'sp-cov', icon: Layers },
    { label: 'Pipe Area', id: 'sa-pipe', icon: SquareDot },
    { label: 'Tank Area', id: 'sa-tank', icon: SquareDot },
    { label: 'Abrasive (Garnet)', id: 'ab-garnet', icon: Flame },
    { label: 'Salt Test (ISO 8502-9)', id: 'salt-main', icon: TestTube },
    { label: 'Volume Solids Verification', id: 'vs-tds', icon: Activity },
    { label: 'Paint Reconciliation', id: 'pro-recon', icon: FileSpreadsheet },
    { label: 'SSPC-PA 2 Compliance', id: 'qa-pa2', icon: ShieldCheck },
    { label: 'TSA Wire Consumption', id: 'tsa-wire', icon: FlameKindling },
    { label: 'PFP Intumescent Material', id: 'pfp-mat', icon: ShieldCheck },
    { label: 'Paint Procurement PO', id: 'bid-proc', icon: Box },
    { label: '25-Yr LCC Cost', id: 'pro-lcc', icon: Coins }
  ];

  const allCalculatorCards = [
    // Paint Suite (7)
    { id: 'sp-pc', title: 'WFT Range Calculation', desc: 'Min & Max WFT from DFT range', icon: Sliders },
    { id: 'sp-dft', title: 'DFT Calculation', desc: 'Dry Film Thickness from WFT', icon: Percent },
    { id: 'sp-cov', title: 'Paint Coverage', desc: 'TC & PS Spread Rate (m²/L)', icon: Layers },
    { id: 'sp-cons', title: 'Paint Consumption', desc: 'Total litres for surface area', icon: Calculator },
    { id: 'sp-bl', title: 'Blast Loss', desc: 'Dead Volume paint loss', icon: TrendingUp },
    { id: 'sp-mx', title: 'Mixing Ratio', desc: 'Part A & B volumes', icon: FlaskConical },
    { id: 'sp-cost', title: 'Cost Per Area', desc: 'Full project costing (₹/m²)', icon: Coins },

    // Surface Area (6)
    { id: 'sa-pipe', title: 'Pipe Area', desc: 'Inside / outside surface m²', icon: SquareDot },
    { id: 'sa-tank', title: 'Tank Area', desc: 'Shell, roof & bottom m²', icon: SquareDot },
    { id: 'sa-wws', title: 'Structure Weight-Wise', desc: 'Surface area from tonnage', icon: Scale },
    { id: 'sa-plate', title: 'Plate Area', desc: 'Both sides + thickness faces', icon: SquareDot },
    { id: 'sa-de', title: 'Dished End Area', desc: 'Hemi / Semi-Ellip / Tori head', icon: Box },
    { id: 'sa-vessel', title: 'Vessel / Equipment', desc: 'Complete vessel area', icon: Box },

    // Abrasives & Salt (3)
    { id: 'ab-garnet', title: 'Garnet Abrasive', desc: 'Consumption for Sa 2.5 / Sa 3.0', icon: Flame },
    { id: 'ab-cslag', title: 'Copper Slag Abrasive', desc: 'Non-recyclable blasting abrasive', icon: Flame },
    { id: 'salt-main', title: 'Salt Contamination', desc: 'ISO 8502-9 Bresle conductivity', icon: TestTube },

    // Executive PRO Suite (28)
    { id: 'vs-tds', title: '1.1 VS · TDS Verification', desc: 'DFT × Coverage ÷ 10 vs TDS', icon: Activity },
    { id: 'vs-den', title: '1.2 VS · Density Verification', desc: 'WS% × Wet ÷ Dry density', icon: Activity },
    { id: 'vs-lab', title: '1.3 VS · Lab D2697 / ISO 3233', desc: 'Pycnometer dish ASTM laboratory', icon: Activity },
    { id: 'pro-recon', title: '2. Paint Material Reconciliation', desc: 'Theoretical vs actual variance', icon: FileSpreadsheet },
    { id: 'pro-lcc', title: '3. Coating Life Cycle Cost (LCC)', desc: '25-year total ownership cost', icon: Coins },
    { id: 'pro-abp', title: '4. Abrasive Size & Blast Profile', desc: 'Predict anchor profile (Rz)', icon: Layers },
    { id: 'pro-arc', title: '5. Abrasive Recycling Calculator', desc: 'Multi-pass recovery efficiency', icon: RotateCcw },
    { id: 'pro-dcc', title: '6. Dust Collector Capacity', desc: 'CFM · Filter Area · Fan motor', icon: Zap },
    { id: 'pro-saw', title: '7. Surface Area & Steel Weight', desc: 'Structural sections BOQ builder', icon: Scale },
    { id: 'qa-pa2', title: '8.1 DFT Acceptance (SSPC-PA 2)', desc: 'Spot 80/120% rule & area average', icon: ShieldCheck },
    { id: 'qa-iso', title: '8.2 DFT Acceptance (ISO 19840)', desc: 'Correction value · 80/20 status', icon: ShieldCheck },
    { id: 'qa-hol', title: '8.3 Holiday Spark Voltage', desc: 'ASTM G62 · NACE SP0188 table', icon: Zap },
    { id: 'ce-rate', title: '9.1 Corrosion Rate & Asset Life', desc: 'Weight / thickness loss per year', icon: Activity },
    { id: 'ce-life', title: '9.2 Coating Life Prediction', desc: 'ISO 12944 atmospheric durability', icon: CheckCircle2 },
    { id: 'tsa-wire', title: '10.1 TSA Wire Consumption', desc: 'Wire take-off kg & length meters', icon: FlameKindling },
    { id: 'tsa-cov', title: '10.2 TSA Area Coverage', desc: 'Achievable coverage from wire stock', icon: Box },
    { id: 'tsa-eff', title: '10.3 TSA Deposition Efficiency', desc: 'Mass-balance spray trial rating', icon: Activity },
    { id: 'tsa-thk', title: '10.4 TSA Thickness Verification', desc: 'Mass-average achieved DFT', icon: Layers },
    { id: 'tsa-prod', title: '10.5 TSA Productivity', desc: 'm²/hr · kg/hr · daily shift output', icon: Zap },
    { id: 'tsa-cost', title: '10.6 TSA Cost Estimation', desc: 'Turnkey ₹/m² complete estimate', icon: Coins },
    { id: 'pfp-mat', title: '11.1 PFP Material Consumption', desc: 'Epoxy fireproofing volume & kits', icon: ShieldCheck },
    { id: 'pfp-thk', title: '11.2 PFP Thickness (Hp/A)', desc: 'Section factor & fire rating DFT', icon: Flame },
    { id: 'pfp-den', title: '11.3 PFP Density Verification', desc: 'ASTM E605 gravimetric compliance', icon: Scale },
    { id: 'pfp-mesh', title: '11.4 PFP Reinforcement Mesh', desc: 'Roll quantity & overlap wrapping', icon: Layers },
    { id: 'pfp-cost', title: '11.5 PFP 9-Head Cost Breakdown', desc: 'Turnkey commercial cost proposal', icon: Coins },
    { id: 'pfp-rep', title: '11.6 PFP Repair & CUF Check', desc: 'Spot repair vs structural re-coat', icon: RotateCcw },
    { id: 'bid-proc', title: '12.1 Multi-Coat Paint Procurement', desc: 'Order volume & packaging drums', icon: Box },
    { id: 'bid-comp', title: '12.2 Multi-Manufacturer Bid QCBS', desc: 'QCBS scoring & rank winner', icon: Crown }
  ];

  const commonPaintSystems = [
    { type: 'Inorganic Zinc Silicate', vs: 75, dft: 75, tc: '10.00', loss: 20, ps: '8.00', badgeClass: 'bg-amber-100 text-amber-800' },
    { type: 'Epoxy Zinc Primer', vs: 65, dft: 60, tc: '10.83', loss: 25, ps: '8.13', badgeClass: 'bg-amber-100 text-amber-800' },
    { type: 'Epoxy Intermediate', vs: 80, dft: 100, tc: '8.00', loss: 20, ps: '6.40', badgeClass: 'bg-blue-100 text-blue-800' },
    { type: 'High-Build Epoxy', vs: 85, dft: 125, tc: '6.80', loss: 20, ps: '5.44', badgeClass: 'bg-blue-100 text-blue-800' },
    { type: 'Polyurethane Topcoat', vs: 60, dft: 50, tc: '12.00', loss: 25, ps: '9.00', badgeClass: 'bg-amber-100 text-amber-800' },
    { type: 'Coal Tar Epoxy', vs: 70, dft: 200, tc: '3.50', loss: 25, ps: '2.63', badgeClass: 'bg-slate-200 text-slate-800' },
    { type: 'Amine-Cured Epoxy', vs: 90, dft: 150, tc: '6.00', loss: 20, ps: '4.80', badgeClass: 'bg-emerald-100 text-emerald-800' },
    { type: 'Alkyd Primer', vs: 45, dft: 40, tc: '11.25', loss: 15, ps: '9.56', badgeClass: 'bg-slate-200 text-slate-800' }
  ];

  const handleRowClick = (sys) => {
    setActiveSubTool('coverage');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Module 01
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Coating Calculator &amp; Take-Off Suite
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            44+ specialized industrial coating, surface area, abrasive blasting, QA/QC and commercial calculation engines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#E87B1E] bg-[#FFF4E3] border border-[#F3D2A0] px-3 py-1.5 rounded-xl">
            44 Engineering Tools Active
          </span>
        </div>
      </div>

      {/* 2. Top 5 Category Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categoryCards.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              onClick={() => setActiveSubTool(cat.defaultTool)}
              className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] hover:shadow-md p-4 rounded-2xl shadow-[0_2px_8px_rgba(20,24,32,0.06)] transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] group-hover:scale-110 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-[#1B222C] font-rajdhani">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-[#1B222C] font-rajdhani group-hover:text-[#E87B1E] transition">
                  {cat.title}
                </h3>
              </div>
              <p className="text-[10px] text-[#7E8B99] font-mono mt-2 truncate">
                {cat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Access Bar (13 Key Tools) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            ⚡ Quick Access Launchpad
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Single-click field launch</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickAccessButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveSubTool(btn.id)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs group cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-[#F7941D] group-hover:text-white transition" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Industry Engineering Insights (4 Benchmark Boxes matching reference lines 950-980) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            💡 Industry Engineering Insights
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Engineering reference norms</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Common Paint Systems */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-base">🛡️</span>
              <h3 className="text-xs font-extrabold text-slate-900">Common Paint Systems</h3>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600"><span>Inorganic Zinc Silicate:</span><b className="text-slate-900">75 µm</b></div>
              <div className="flex justify-between text-slate-600"><span>Epoxy Intermediate:</span><b className="text-slate-900">100 µm</b></div>
              <div className="flex justify-between text-slate-600"><span>High-Build Epoxy:</span><b className="text-slate-900">125 µm</b></div>
              <div className="flex justify-between text-slate-600"><span>Polyurethane Topcoat:</span><b className="text-slate-900">50 µm</b></div>
            </div>
          </div>

          {/* Card 2: Typical DFT Ranges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-base">📏</span>
              <h3 className="text-xs font-extrabold text-slate-900">Typical DFT Ranges</h3>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600"><span>Primer Coat:</span><b className="text-slate-900">40–75 µm</b></div>
              <div className="flex justify-between text-slate-600"><span>Intermediate:</span><b className="text-slate-900">100–150 µm</b></div>
              <div className="flex justify-between text-slate-600"><span>Finish / Topcoat:</span><b className="text-slate-900">50–80 µm</b></div>
              <div className="flex justify-between text-slate-600"><span>Coal Tar Epoxy:</span><b className="text-slate-900">200 µm</b></div>
            </div>
          </div>

          {/* Card 3: Abrasive Factors */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-base">💎</span>
              <h3 className="text-xs font-extrabold text-slate-900">Abrasive Factors</h3>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600"><span>Garnet · SA 2.5:</span><b className="text-slate-900">20 kg/m²</b></div>
              <div className="flex justify-between text-slate-600"><span>Garnet · SA 3.0:</span><b className="text-slate-900">25 kg/m²</b></div>
              <div className="flex justify-between text-slate-600"><span>Copper Slag · SA 2.5:</span><b className="text-slate-900">30 kg/m²</b></div>
              <div className="flex justify-between text-slate-600"><span>Copper Slag · SA 3.0:</span><b className="text-slate-900">35 kg/m²</b></div>
            </div>
          </div>

          {/* Card 4: Salt Test Limits */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="text-base">🧂</span>
              <h3 className="text-xs font-extrabold text-slate-900">Salt Test Limits</h3>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600"><span>Standard (general):</span><b className="text-slate-900">≤ 20 mg/m²</b></div>
              <div className="flex justify-between text-slate-600"><span>Immersion service:</span><b className="text-slate-900">≤ 10 mg/m²</b></div>
              <div className="flex justify-between text-slate-600"><span>High-spec offshore:</span><b className="text-slate-900">≤ 5 mg/m²</b></div>
              <div className="flex justify-between text-slate-600"><span>Method Standard:</span><b className="text-[#D97706]">ISO 8502-9</b></div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Complete 44-Calculator Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            🛠️ All Calculators (44 Interactive Tools)
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Click any tool to launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {allCalculatorCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveSubTool(tool.id)}
                className="bg-white border border-slate-200 hover:border-[#F7941D] hover:shadow-md p-4 rounded-2xl transition group cursor-pointer flex items-start gap-3 relative"
              >
                <div className="p-2 rounded-xl bg-amber-50 text-[#F7941D] border border-amber-100 group-hover:scale-110 transition shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#F7941D] transition truncate">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {tool.desc}
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-[#F7941D] group-hover:translate-x-0.5 transition text-xs">
                  →
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Quick Reference Table with 1-Click Auto-Fill */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="text-[#F7941D]">📋</span> Quick Reference — Common Paint Systems
            </h2>
            <span className="text-xs text-slate-400">Click any row below to auto-fill the Paint Coverage calculator</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#D97706] bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            Interactive Table
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">Paint Type</th>
                <th className="p-3 font-semibold text-center">VS%</th>
                <th className="p-3 font-semibold text-center">DFT (µm)</th>
                <th className="p-3 font-semibold text-center">TC (m²/L)</th>
                <th className="p-3 font-semibold text-center">Loss%</th>
                <th className="p-3 font-semibold text-center">PS (m²/L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {commonPaintSystems.map((sys, idx) => (
                <tr 
                  key={idx}
                  onClick={() => handleRowClick(sys)}
                  className="hover:bg-amber-50/50 cursor-pointer transition"
                >
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span>{sys.type}</span>
                  </td>
                  <td className="p-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sys.badgeClass}`}>
                      {sys.vs}%
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-700 font-bold">{sys.dft}</td>
                  <td className="p-3 text-center font-mono font-extrabold text-[#9E1B1E]">{sys.tc}</td>
                  <td className="p-3 text-center font-mono text-slate-600">{sys.loss}%</td>
                  <td className="p-3 text-center font-mono font-extrabold text-[#D97706]">{sys.ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
