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
  Check,
  Lock
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
import { fetchUserProfile } from '../utils/api';
import CalculationLogDrawer from '../components/CalculationLogDrawer';
import { calculatorService } from '../services/calculatorService';

export default function CoatingCalculatorPage({ activeSubTool, setActiveSubTool }) {
  // Read authenticated user state
  const [currentUser, setCurrentUser] = React.useState(() => {
    if (localStorage.getItem('bg_auth_logged_in') !== 'true') return null;
    try {
      const stored = localStorage.getItem('bg_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [checkingPro, setCheckingPro] = React.useState(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = React.useState(false);
  const [logCount, setLogCount] = React.useState(0);

  const refreshLogCount = React.useCallback(async () => {
    try {
      const logs = await calculatorService.getLogs();
      setLogCount(logs?.length || 0);
    } catch (e) {}
  }, []);

  React.useEffect(() => {
    refreshLogCount();
    const handleLogSaved = () => refreshLogCount();
    window.addEventListener('bg_log_saved', handleLogSaved);
    return () => window.removeEventListener('bg_log_saved', handleLogSaved);
  }, [refreshLogCount]);

  const handleRestoreTool = (log) => {
    if (log?.tool_id) {
      setActiveSubTool(log.tool_id);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('bg_restore_calculation', { detail: log }));
      }, 120);
    }
  };

  const refreshUserStatus = React.useCallback(async () => {
    if (localStorage.getItem('bg_auth_logged_in') !== 'true') {
      setCurrentUser(null);
      return;
    }
    setCheckingPro(true);
    try {
      const refreshed = await fetchUserProfile();
      if (refreshed && localStorage.getItem('bg_auth_logged_in') === 'true') {
        setCurrentUser(refreshed);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.warn('Failed to refresh user profile:', e);
    } finally {
      setCheckingPro(false);
    }
  }, []);

  // 1. Listen for background user updates and logout within window
  React.useEffect(() => {
    const handleUserUpdate = (e) => {
      try {
        if (localStorage.getItem('bg_auth_logged_in') !== 'true') {
          setCurrentUser(null);
          return;
        }
        if (e?.detail) {
          setCurrentUser(e.detail);
        } else {
          const stored = localStorage.getItem('bg_user');
          if (stored) setCurrentUser(JSON.parse(stored));
          else setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };

    const handleLogout = () => {
      setCurrentUser(null);
    };

    window.addEventListener('bg_user_updated', handleUserUpdate);
    window.addEventListener('bg_logout', handleLogout);
    return () => {
      window.removeEventListener('bg_user_updated', handleUserUpdate);
      window.removeEventListener('bg_logout', handleLogout);
    };
  }, []);

  // 2. Refresh on mount to get live status from Django backend
  React.useEffect(() => {
    refreshUserStatus();
  }, [refreshUserStatus]);

  // 3. Auto-refresh when user switches back to this browser tab from Admin Panel
  React.useEffect(() => {
    const handleTabFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshUserStatus();
      }
    };
    document.addEventListener('visibilitychange', handleTabFocus);
    window.addEventListener('focus', handleTabFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleTabFocus);
      window.removeEventListener('focus', handleTabFocus);
    };
  }, [refreshUserStatus]);

  const isUserPro = Boolean(
    currentUser?.is_pro || 
    currentUser?.profile?.is_pro || 
    currentUser?.is_superuser
  );

  // 4. If user selects a Pro tool and is not yet marked Pro, auto-verify with server
  React.useEffect(() => {
    if (activeSubTool && !isUserPro) {
      refreshUserStatus();
    }
  }, [activeSubTool, isUserPro, refreshUserStatus]);

  // 5. 1-Minute Guest Preview Timer: If user is not logged in after 1 minute on Coating Calculator,
  // trigger static backdrop login modal to preserve their calculation audit logs.
  React.useEffect(() => {
    const isLogged = Boolean(
      localStorage.getItem('bg_auth_logged_in') === 'true' && currentUser
    );
    if (isLogged) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('bg_guest_calc_start');
        sessionStorage.removeItem('bg_guest_timer_done');
      }
      return;
    }

    // If 1-minute limit was already triggered for this guest session, keep compulsory modal open
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('bg_guest_timer_done') === 'true') {
      console.log('[CoatingCalculator] Guest preview already reached limit. Opening compulsory modal.');
      window.dispatchEvent(new CustomEvent('bg_open_auth_modal', { 
        detail: { isCompulsory: true } 
      }));
      return;
    }

    // Read or set session start time
    let startTime = 0;
    if (typeof sessionStorage !== 'undefined') {
      const storedStart = sessionStorage.getItem('bg_guest_calc_start');
      if (storedStart) {
        startTime = parseInt(storedStart, 10);
      }
      if (!startTime || isNaN(startTime)) {
        startTime = Date.now();
        sessionStorage.setItem('bg_guest_calc_start', startTime.toString());
      }
    } else {
      startTime = Date.now();
    }

    const ONE_MINUTE_MS = 60 * 1000;
    const elapsed = Date.now() - startTime;
    const remainingMs = Math.max(0, ONE_MINUTE_MS - elapsed);

    console.log(`[CoatingCalculator] Guest session detected. 1-minute preview timer running: ${Math.round(remainingMs / 1000)}s remaining.`);

    const timer = setTimeout(() => {
      const stillLogged = Boolean(
        localStorage.getItem('bg_auth_logged_in') === 'true'
      );
      if (!stillLogged) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('bg_guest_timer_done', 'true');
        }
        console.log('[CoatingCalculator] 1-minute guest preview limit reached. Triggering compulsory login modal.');
        window.dispatchEvent(new CustomEvent('bg_open_auth_modal', { 
          detail: { isCompulsory: true } 
        }));
      }
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [currentUser]);
  
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
    'holiday-voltage': { component: HolidayVoltageTool, title: 'Holiday Test Voltage (ASTM G62 / NACE SP0188)', group: 'pro' },
    'holiday': { component: HolidayVoltageTool, title: 'Holiday Test Voltage (ASTM G62 / NACE SP0188)', group: 'pro' },

    // Section 9: Corrosion Engineering
    'ce-rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'ce_rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'corrosion_rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'corrosion-rate': { component: CorrosionRateTool, title: 'Corrosion Rate & Remaining Asset Life', group: 'pro' },
    'ce-life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'ce_life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'coating_life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'coating-life': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'coating_life_durability': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'coating-life-durability': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },
    'env_conditions': { component: CoatingLifePredictionTool, title: 'Coating Life Prediction & Health Index', group: 'pro' },

    // Section 10: Thermal Spray Aluminium (TSA)
    'tsa-wire': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa_wire': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa_wire_consumption': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa-wire-consumption': { component: TSASuite, title: 'TSA Wire Consumption', group: 'pro' },
    'tsa-cov': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa_cov': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa_area_coverage': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa-area-coverage': { component: TSASuite, title: 'TSA Area Coverage', group: 'pro' },
    'tsa-eff': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa_eff': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa_deposition': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa-deposition-efficiency': { component: TSASuite, title: 'TSA Deposition Efficiency', group: 'pro' },
    'tsa-thk': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa_thk': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa_thickness': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa_thickness_verify': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa-thickness-verification': { component: TSASuite, title: 'TSA Thickness Verification', group: 'pro' },
    'tsa-prod': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
    'tsa_prod': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
    'tsa_productivity': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
    'tsa-productivity': { component: TSASuite, title: 'TSA Productivity (m²/hr & kg/hr)', group: 'pro' },
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
    'pfp-material': { component: PFPSuite, title: 'PFP Material Consumption', group: 'pro' },
    'pfp-thk': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp_thk': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp_thickness': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp-thickness': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp_dft_matrix': { component: PFPSuite, title: 'PFP Thickness (Fire Rating & Hp/A)', group: 'pro' },
    'pfp-den': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp_den': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp_density': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp-density': { component: PFPSuite, title: 'PFP Density Verification (ASTM E605)', group: 'pro' },
    'pfp-mesh': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp_mesh': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp_mesh_qty': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp-mesh-quantity': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp_reinforce_mesh': { component: PFPSuite, title: 'PFP Reinforcement Mesh Quantity', group: 'pro' },
    'pfp-cost': { component: PFPSuite, title: 'PFP Cost Breakdown Across 9 Heads', group: 'pro' },
    'pfp_cost': { component: PFPSuite, title: 'PFP Cost Breakdown Across 9 Heads', group: 'pro' },
    'pfp-rep': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp_rep': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp_repair': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp-repair': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp-repair-quantity': { component: PFPSuite, title: 'PFP Repair Quantity & CUF Check', group: 'pro' },
    'pfp_hp_a_calc': { component: PFPSuite, title: 'PFP Section Factor (Hp/A)', group: 'pro' },
    'pfp_volume_quote': { component: PFPSuite, title: 'PFP Volume & Weight Take-Off', group: 'pro' },
    'pfp_intumescent': { component: PFPSuite, title: 'Passive Fire Protection (PFP)', group: 'pro' },
    'pfp_suite': { component: PFPSuite, title: 'Passive Fire Protection (PFP)', group: 'pro' },

    // Section 12: Bid Tab & Comparison
    'bid-proc': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'bid_proc': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'paint_procurement': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'paint-procurement': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'procurement_suite': { component: ProcurementSuite, title: 'Paint Procurement Quantity (Multi-Coat Matrix)', group: 'pro' },
    'bid-comp': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
    'bid_comp': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
    'bid_comparison': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
    'bid-comparison': { component: ProcurementSuite, title: 'Multi-Manufacturer Bid Comparison (QCBS Scoring)', group: 'pro' },
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
          <div className="flex items-center gap-3">
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

          <button
            type="button"
            onClick={() => setIsLogDrawerOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Audit Logs</span>
            {logCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E87B1E] text-white font-mono font-bold">
                {logCount}
              </span>
            )}
          </button>
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
            {isUserPro ? (
              <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#E87B1E] text-white text-[9.5px] font-bold uppercase font-mono tracking-widest self-end md:self-auto shrink-0 shadow-xs flex items-center gap-1.5">
                <span>👑</span> PRO ACCESS ACTIVE
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9.5px] font-bold uppercase font-mono tracking-widest self-end md:self-auto shrink-0 shadow-xs flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" /> PRO MEMBERSHIP REQUIRED
              </span>
            )}
          </div>
        )}

        {/* Top Horizontal Sub-Navigation Tab Bar matching reference .subnav */}
        {currentNavList.length > 0 && (
          <div className="subnav">
            {currentNavList.map(tab => {
              const isActive = activeSubTool === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTool(tab.id)}
                  className={`snb ${isActive ? 'active' : ''}`}
                >
                  <span>{tab.label}</span>
                  {activeGroup === 'pro' && !isUserPro && (
                    <span className="ml-1 text-[9px] text-amber-400 font-mono">🔒</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* PRO Tool Access Check: Only active Pro users can view Pro tools */}
        {activeGroup === 'pro' && !isUserPro ? (
          <div className="bg-white rounded-3xl border border-amber-300/80 p-6 md:p-10 shadow-xl text-center max-w-2xl mx-auto my-6 animate-in zoom-in-95 duration-200">
            {/* Glowing Crown Lock Badge */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-[#F7941D] to-[#8B0E16] text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 mb-5">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span>👑 Executive Pro Module Locked</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 font-rajdhani uppercase tracking-tight">
              {toolTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
              This advanced engineering module is part of the <strong>Executive Coating Calculation PRO Suite</strong>. Access is restricted to users with active PRO membership.
            </p>

            {/* Account Status Card */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto">
              {currentUser ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Signed In Account:</span>
                    <span className="font-bold text-slate-900 font-mono">{currentUser.email || currentUser.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Membership Tier:</span>
                    <span className="font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                      Standard (Free)
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-[11px] leading-relaxed">
                    <p className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                      <span>💡</span> Administrator Approval Required
                    </p>
                    Ask your platform administrator to toggle <strong>PRO</strong> access for <strong>{currentUser.email || currentUser.username}</strong> in the admin panel. Once enabled, you can immediately access all 28 Executive PRO modules.
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 space-y-3">
                  <p className="text-slate-700 font-medium text-xs leading-relaxed">
                    You are currently browsing as a guest. Please sign in with an account that has PRO privileges enabled.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('bg_open_auth_modal'));
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F7941D] to-[#E87B1E] hover:from-[#E87B1E] hover:to-[#D97706] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    <span>Sign In with Google / Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={refreshUserStatus}
                disabled={checkingPro}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#E87B1E] hover:from-amber-600 hover:to-[#D97706] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <span>{checkingPro ? 'Checking Server Access...' : '🔄 Verify Pro Access Now'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTool('hub')}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Return to Calculator Hub
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTool('sp-pc')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Browse Standard Tools
              </button>
            </div>

            {/* Executive PRO Suite Features Overview */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-left">
              <p className="text-[11px] font-bold text-slate-500 uppercase font-mono tracking-wider mb-3 text-center">
                Executive PRO Suite Includes 28 Modules:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>DFT Acceptance — SSPC-PA 2 &amp; ISO 19840</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Theoretical vs Actual Paint Reconciliation</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Coating Life Cycle Cost (LCC) Analysis</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Passive Fire Protection (PFP) Material &amp; Hp/A</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Thermal Spray Aluminium (TSA) Calculations</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>QCBS Multi-Manufacturer Bid Comparison</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Active Tool Form Component */}
            <ActiveTool activeSubTool={activeSubTool} onSubToolChange={setActiveSubTool} />

            {/* Reference Standards & Smart Classification Component (Always visible under all PRO pages) */}
            {activeGroup === 'pro' && (
              <ProReferenceCard />
            )}
          </>
        )}

        {/* Calculation Audit Log Drawer */}
        <CalculationLogDrawer
          isOpen={isLogDrawerOpen}
          onClose={() => setIsLogDrawerOpen(false)}
          onRestoreTool={handleRestoreTool}
        />
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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Top KPI Summary Card & Calculation Logs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div 
          onClick={() => setActiveSubTool('vs-tds')}
          className="kpi max-w-xs cursor-pointer"
        >
          <div className="kpi-top">
            <div className="kpi-ico">👑</div>
            <span className="kpi-arr">→</span>
          </div>
          <div className="kpi-num">28</div>
          <div className="kpi-lbl">Executive Coating — PRO</div>
          <div className="kpi-sub">44 Engineering Calculation Engines Active</div>
        </div>

        <button
          type="button"
          onClick={() => setIsLogDrawerOpen(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white border border-amber-400/30 flex items-center gap-3.5 transition cursor-pointer shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F7941D] to-[#E87B1E] flex items-center justify-center text-white shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-rajdhani text-sm uppercase tracking-wide">
                Calculation Audit Logs
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/40">
                {logCount} Records
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              Review persistent audit history &amp; reload calculations
            </div>
          </div>
          <span className="text-amber-400 group-hover:translate-x-1 transition ml-1 font-bold">→</span>
        </button>
      </div>

      {/* 2. Quick Access */}
      <div>
        <div className="dash-sec">
          <span className="ds-bar"></span>
          <h2>Quick Access</h2>
          <span className="ds-d">Most-used calculators</span>
        </div>
        <div className="qa">
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('sp-cov')}>
            <div className="qa-ic">📐</div>
            <div>
              <div className="qa-tt">Coverage</div>
              <div className="qa-td">TC &amp; PS spread rate (m²/L)</div>
            </div>
          </div>
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('sp-pc')}>
            <div className="qa-ic">🧮</div>
            <div>
              <div className="qa-tt">WFT Range</div>
              <div className="qa-td">Min &amp; Max WFT from DFT</div>
            </div>
          </div>
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('sp-dft')}>
            <div className="qa-ic">📏</div>
            <div>
              <div className="qa-tt">DFT</div>
              <div className="qa-td">Dry film thickness from WFT</div>
            </div>
          </div>
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('sa-pipe')}>
            <div className="qa-ic">🔩</div>
            <div>
              <div className="qa-tt">Surface Area</div>
              <div className="qa-td">Pipe · Tank · Vessel m²</div>
            </div>
          </div>
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('ab-garnet')}>
            <div className="qa-ic">💎</div>
            <div>
              <div className="qa-tt">Abrasives</div>
              <div className="qa-td">Garnet &amp; Copper Slag (kg)</div>
            </div>
          </div>
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('salt-main')}>
            <div className="qa-ic">🧂</div>
            <div>
              <div className="qa-tt">Salt Test</div>
              <div className="qa-td">Bresle ISO 8502-9 + temp</div>
            </div>
          </div>
          <div className="qa-tile cursor-pointer" onClick={() => setActiveSubTool('vs-tds')}>
            <div className="qa-ic">👑</div>
            <div>
              <div className="qa-tt flex items-center gap-1.5">
                Executive PRO
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isUserPro ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                  {isUserPro ? 'PRO ACTIVE' : 'LOCKED 🔒'}
                </span>
              </div>
              <div className="qa-td">{isUserPro ? 'Volume Solids verification suite' : 'Pro membership required'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Industry Defaults / Insights */}
      <div>
        <div className="dash-sec">
          <span className="ds-bar"></span>
          <h2>Industry Defaults</h2>
          <span className="ds-d">Engineering reference norms</span>
        </div>
        <div className="ins">
          <div className="ins-card">
            <div className="ins-h">
              <div className="ins-ic">🛡️</div>
              <div className="ins-t">Common Paint Systems</div>
            </div>
            <div className="ins-row"><span className="ins-k">Inorganic Zinc Silicate</span><span className="ins-v">75 µm</span></div>
            <div className="ins-row"><span className="ins-k">Epoxy Intermediate</span><span className="ins-v">100 µm</span></div>
            <div className="ins-row"><span className="ins-k">High-Build Epoxy</span><span className="ins-v">125 µm</span></div>
            <div className="ins-row"><span className="ins-k">Polyurethane Topcoat</span><span className="ins-v">50 µm</span></div>
          </div>
          <div className="ins-card">
            <div className="ins-h">
              <div className="ins-ic">📏</div>
              <div className="ins-t">Typical DFT Ranges</div>
            </div>
            <div className="ins-row"><span className="ins-k">Primer Coat</span><span className="ins-v">40–75 µm</span></div>
            <div className="ins-row"><span className="ins-k">Intermediate</span><span className="ins-v">100–150 µm</span></div>
            <div className="ins-row"><span className="ins-k">Finish / Topcoat</span><span className="ins-v">50–80 µm</span></div>
            <div className="ins-row"><span className="ins-k">Coal Tar Epoxy</span><span className="ins-v">200 µm</span></div>
          </div>
          <div className="ins-card">
            <div className="ins-h">
              <div className="ins-ic">💎</div>
              <div className="ins-t">Abrasive Factors</div>
            </div>
            <div className="ins-row"><span className="ins-k">Garnet · SA 2.5</span><span className="ins-v">20 kg/m²</span></div>
            <div className="ins-row"><span className="ins-k">Garnet · SA 3.0</span><span className="ins-v">25 kg/m²</span></div>
            <div className="ins-row"><span className="ins-k">Copper Slag · SA 2.5</span><span className="ins-v">30 kg/m²</span></div>
            <div className="ins-row"><span className="ins-k">Copper Slag · SA 3.0</span><span className="ins-v">35 kg/m²</span></div>
          </div>
          <div className="ins-card">
            <div className="ins-h">
              <div className="ins-ic">🧂</div>
              <div className="ins-t">Salt Test Limits</div>
            </div>
            <div className="ins-row"><span className="ins-k">Standard (general)</span><span className="ins-v">≤ 20 mg/m²</span></div>
            <div className="ins-row"><span className="ins-k">Immersion service</span><span className="ins-v">≤ 10 mg/m²</span></div>
            <div className="ins-row"><span className="ins-k">High-spec offshore</span><span className="ins-v">≤ 5 mg/m²</span></div>
            <div className="ins-row"><span className="ins-k">Method Standard</span><span className="ins-v">ISO 8502-9</span></div>
          </div>
        </div>
      </div>

      {/* 4. All Calculators Grid */}
      <div>
        <div className="dash-sec">
          <span className="ds-bar"></span>
          <h2>All Calculators</h2>
          <span className="ds-d">Tap any tool to begin</span>
        </div>
        <div className="ov">
          {allCalculatorCards.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setActiveSubTool(tool.id)}
              className="ovc"
            >
              <span className="ovarr">→</span>
              {toolComponents[tool.id]?.group === 'pro' && (
                <span className={`absolute top-2.5 right-7 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                  isUserPro 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}>
                  {isUserPro ? '👑 PRO' : '🔒 PRO'}
                </span>
              )}
              <div className="ovic">
                {tool.id === 'sp-pc' && '🧮'}
                {tool.id === 'sp-dft' && '📏'}
                {tool.id === 'sp-cov' && '📐'}
                {tool.id === 'sp-cons' && '🧪'}
                {tool.id === 'sp-bl' && '💥'}
                {tool.id === 'sp-mx' && '⚗️'}
                {tool.id === 'sp-cost' && '💰'}
                {tool.id === 'sa-pipe' && '🔩'}
                {tool.id === 'sa-tank' && '🛢️'}
                {tool.id === 'sa-wws' && '⚖️'}
                {tool.id === 'sa-plate' && '🔲'}
                {tool.id === 'sa-de' && '🫙'}
                {tool.id === 'sa-vessel' && '🏭'}
                {tool.id === 'ab-garnet' && '💎'}
                {tool.id === 'ab-cslag' && '⛏️'}
                {tool.id === 'salt-main' && '🧂'}
                {tool.id.startsWith('vs') && '👑'}
                {tool.id === 'pro-recon' && '📊'}
                {tool.id === 'pro-lcc' && '🪙'}
                {tool.id === 'pro-abp' && '🔬'}
                {tool.id === 'pro-arc' && '♻️'}
                {tool.id === 'pro-dcc' && '🌪️'}
                {tool.id === 'pro-saw' && '🏗️'}
                {tool.id === 'qa-pa2' && '🛡️'}
                {tool.id === 'qa-iso' && '📜'}
                {tool.id === 'qa-hol' && '⚡'}
                {tool.id === 'ce-rate' && '⏱️'}
                {tool.id === 'ce-life' && '⏳'}
                {tool.id.startsWith('tsa') && '🔥'}
                {tool.id.startsWith('pfp') && '🧱'}
                {tool.id.startsWith('bid') && '💼'}
                {!['sp-pc', 'sp-dft', 'sp-cov', 'sp-cons', 'sp-bl', 'sp-mx', 'sp-cost', 'sa-pipe', 'sa-tank', 'sa-wws', 'sa-plate', 'sa-de', 'sa-vessel', 'ab-garnet', 'ab-cslag', 'salt-main', 'pro-recon', 'pro-lcc', 'pro-abp', 'pro-arc', 'pro-dcc', 'pro-saw', 'qa-pa2', 'qa-iso', 'qa-hol', 'ce-rate', 'ce-life'].includes(tool.id) && !tool.id.startsWith('vs') && !tool.id.startsWith('tsa') && !tool.id.startsWith('pfp') && !tool.id.startsWith('bid') && '🛠️'}
              </div>
              <div className="ovt">{tool.title}</div>
              <div className="ovd">{tool.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quick Reference Table with 1-Click Auto-Fill */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl shadow-[0_2px_8px_rgba(20,24,32,0.06)] overflow-hidden">
        <div className="bg-gradient-to-r from-[#FDF1E6] to-[#FAFBFC] p-4 border-b border-[#D8DEE5] flex items-center gap-3">
          <div className="text-xl">📋</div>
          <div>
            <div className="font-rajdhani text-base font-bold text-[#1B222C]">Quick Reference — Common Paint Systems</div>
            <div className="text-xs text-[#7E8B99]">Click any row below to auto-fill the Paint Coverage calculator</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF4E3]/60 text-slate-700 font-rajdhani text-xs uppercase tracking-wider border-b border-[#D8DEE5]">
              <tr>
                <th className="p-3 font-bold">Paint Type</th>
                <th className="p-3 font-bold text-center">VS%</th>
                <th className="p-3 font-bold text-center">DFT (µm)</th>
                <th className="p-3 font-bold text-center">TC (m²/L)</th>
                <th className="p-3 font-bold text-center">Loss%</th>
                <th className="p-3 font-bold text-center">PS (m²/L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {commonPaintSystems.map((sys, idx) => (
                <tr 
                  key={idx}
                  onClick={() => handleRowClick(sys)}
                  className="hover:bg-[#FFF4E6] cursor-pointer transition"
                >
                  <td className="p-3 font-semibold text-slate-900">
                    {sys.type}
                  </td>
                  <td className="p-3 text-center font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {sys.vs}%
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-700 font-semibold">{sys.dft}</td>
                  <td className="p-3 text-center font-mono font-bold text-[#9E1B1E]">{sys.tc}</td>
                  <td className="p-3 text-center font-mono text-slate-600">{sys.loss}%</td>
                  <td className="p-3 text-center font-mono font-bold text-[#E87B1E]">{sys.ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculation Audit Log Drawer */}
      <CalculationLogDrawer
        isOpen={isLogDrawerOpen}
        onClose={() => setIsLogDrawerOpen(false)}
        onRestoreTool={handleRestoreTool}
      />

      {/* 6. Dark Enterprise Footer matching Screenshot 1 & 2 */}
      <footer className="app-footer-dark">
        <div className="flex items-center gap-2">
          <img src="/logo-2.png" alt="BG Group" className="w-5 h-5 object-contain rounded bg-white p-0.5" />
          <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
            BG GROUP · DIGITAL WORKSPACE FOR COATING PROFESSIONALS
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-sans">
          Surat, Gujarat, India &nbsp;·&nbsp; <a href="https://bgcoating.com/" target="_blank" rel="noreferrer" className="text-[#F7941D] hover:underline">bgcoating.com</a> &nbsp;·&nbsp; <a href="tel:+919925810408" className="text-slate-300 hover:text-white">+91 99258 10408</a>
        </div>
      </footer>
    </div>
  );
}
