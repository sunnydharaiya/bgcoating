import React, { useState, useEffect } from 'react';
import {
  Home,
  Calculator,
  FileText,
  ClipboardCheck,
  Coins,
  FileSpreadsheet,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  LogIn,
  LogOut,
  Settings,
  Globe,
  X,
  ArrowLeft,
  ShieldCheck,
  Award,
  Flame,
  Layers,
  Scale,
  Wrench,
  CheckCircle2,
  Droplets,
  Activity,
  FileCheck,
  Eye,
  Printer,
  Stamp,
  Users,
  FolderKanban,
  Box,
  Camera,
  AlertTriangle,
  Lock,
  Clock,
  BarChart3,
  CalendarDays,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { clearAuth } from '../utils/api';

export default function Sidebar({
  activePage,
  setActivePage,
  activeSubTool,
  setActiveSubTool,
  onNavigate,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  isLoggedIn,
  onOpenAuthModal,
  onOpenHelp
}) {
  // Navigation helper
  const handleNav = (page, subTool = 'hub') => {
    if (onNavigate) {
      onNavigate(page, subTool);
    } else if (setActivePage) {
      setActivePage(page);
      if (subTool && setActiveSubTool) setActiveSubTool(subTool);
    }
    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
  };

  // Detect active module
  const isHome = activePage === 'dashboard' || !activePage;
  const isCalc = activePage === 'coating-calculator' || activePage === 'calc';
  const isSpec = activePage === 'specification-reading' || activePage === 'design';
  const isProcedure = activePage === 'coating-procedure' || activePage === 'procedure';
  const isUnitRate = activePage === 'unit-rate-estimation' || activePage === 'cost-estimation';
  const isManpower = activePage === 'manpower-estimation';
  const isInspection = activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection' || activePage === 'inspection';
  const isPainter = activePage === 'painter-qualification' || activePage === 'painter' || activePage === 'spray-painter-qualification' || activePage === 'spray-painter';
  const isBlaster = activePage === 'blaster-qualification' || activePage === 'blaster';
  const isTsa = activePage === 'tsa-qualification' || activePage === 'tsa';
  const isContractor = activePage === 'contractor-management' || activePage === 'contractor';

  const isEstimationGroup = isUnitRate || isManpower;
  const isDocGroup = isInspection || isPainter || isBlaster || isTsa;

  // Accordion states
  const [estimationExpanded, setEstimationExpanded] = useState(() => isEstimationGroup);
  const [docExpanded, setDocExpanded] = useState(() => isDocGroup);
  const [proSuiteExpanded, setProSuiteExpanded] = useState(true);

  // Inspection Adhesion Sub-menu toggle
  const isAdhesionSubActive = ['pull-off', 'pull-off-adhesion', 'pull', 'cross-cut', 'cross-cut-adhesion', 'cross'].includes(activeSubTool);
  const [adhesionExpanded, setAdhesionExpanded] = useState(true);

  useEffect(() => {
    if (isAdhesionSubActive) setAdhesionExpanded(true);
  }, [isAdhesionSubActive]);

  useEffect(() => {
    if (isEstimationGroup) setEstimationExpanded(true);
    if (isDocGroup) setDocExpanded(true);
  }, [isEstimationGroup, isDocGroup]);

  // Read authenticated user state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { name: 'User', role: 'FREE PLAN', email: '' };
  });

  useEffect(() => {
    const handleUserUpdate = (e) => {
      try {
        if (e?.detail) {
          setCurrentUser(e.detail);
        } else {
          const stored = localStorage.getItem('bg_user');
          if (stored) setCurrentUser(JSON.parse(stored));
        }
      } catch (e) {}
    };
    window.addEventListener('bg_user_updated', handleUserUpdate);
    return () => window.removeEventListener('bg_user_updated', handleUserUpdate);
  }, []);

  const isUserPro = Boolean(
    currentUser?.is_pro || 
    currentUser?.profile?.is_pro || 
    currentUser?.is_superuser
  );

  // Helper to check if a sub-tool is currently active
  const isSubActive = (id, aliases = []) => {
    if (activeSubTool === id) return true;
    if (Array.isArray(aliases) && aliases.includes(activeSubTool)) return true;
    return false;
  };

  // Reusable Sub-Item Button Component
  const NavSubButton = ({ id, label, icon: Icon, aliases = [], badge, isProLocked = false }) => {
    const active = isSubActive(id, aliases);
    const isProBadge = badge === 'PRO';
    return (
      <button
        type="button"
        onClick={() => handleNav(activePage, id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
          active
            ? 'bg-[#2D2319] border border-[#5E4226] text-white shadow-xs font-semibold'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && (
            <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#F7941D]' : 'text-slate-400'}`} />
          )}
          <span className="truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isProLocked && !isUserPro && (
            <span className="text-[10px] text-amber-400">🔒</span>
          )}
          {badge && (
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isProBadge 
                ? 'bg-amber-500/20 text-[#F7941D] font-bold' 
                : 'bg-white/[0.06] text-slate-400'
            }`}>
              {badge}
            </span>
          )}
        </div>
      </button>
    );
  };

  // Context Header Banner (Shown at top of module sidebar)
  const ModuleHeader = ({ title, subtitle, icon: Icon, badge, hubId = 'hub' }) => (
    <div className="mb-3 space-y-2">
      {/* Back to All Modules Button */}
      <button
        type="button"
        onClick={() => handleNav('dashboard')}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#F7941D] hover:text-white bg-[#F7941D]/10 hover:bg-[#F7941D]/20 border border-[#F7941D]/25 transition cursor-pointer group"
      >
        <div className="flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Modules</span>
        </div>
        <span className="text-[9px] font-mono uppercase text-slate-400 group-hover:text-slate-200">
          Dashboard
        </span>
      </button>

      {/* Module Title Card */}
      <div 
        onClick={() => handleNav(activePage, hubId)}
        className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white/[0.07] transition"
        title="Go to module hub overview"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#2D2319] border border-[#5E4226] text-[#F7941D] flex items-center justify-center shrink-0">
            {Icon && <Icon className="w-3.5 h-3.5" />}
          </div>
          <div className="min-w-0 leading-tight">
            <h4 className="text-xs font-bold text-white truncate">{title}</h4>
            {subtitle && <p className="text-[9px] text-slate-400 font-mono truncate">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-[#F7941D] border border-amber-500/25 shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  );

  // Section Category Title
  const SectionHeader = ({ label, count }) => (
    <div className="px-2 pt-3 pb-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
      <span>{label}</span>
      {count && <span className="text-slate-500 font-mono">({count})</span>}
    </div>
  );

  // ========================================================
  // 1. COATING CALCULATOR SIDEBAR
  // ========================================================
  const renderCalculatorSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Coating Calculator" 
        subtitle="Engineering Solvers" 
        icon={Calculator} 
        badge="36 Tools" 
      />

      {/* Overview Hub Button */}
      <NavSubButton 
        id="hub" 
        label="Calculator Hub" 
        icon={Layers} 
        aliases={['home', 'dashboard']} 
      />

      {/* 1. Paint Suite */}
      <SectionHeader label="Paint Suite" count="7" />
      <NavSubButton id="sp-pc" label="WFT Range" icon={Calculator} aliases={['wft_range', 'wft-range']} />
      <NavSubButton id="sp-dft" label="Dry Film Thickness (DFT)" icon={Scale} aliases={['dft']} />
      <NavSubButton id="sp-cov" label="Paint Coverage (m²/L)" icon={Layers} aliases={['coverage']} />
      <NavSubButton id="sp-cons" label="Paint Consumption" icon={Droplets} aliases={['paint_consumption', 'consumption']} />
      <NavSubButton id="sp-bl" label="Blast Dead Volume Loss" icon={Flame} aliases={['blasting_loss', 'blast-loss']} />
      <NavSubButton id="sp-mx" label="Mixing Ratio & Thinner" icon={Activity} aliases={['mixing_ratio', 'mixing-ratio']} />
      <NavSubButton id="sp-cost" label="Paint Cost Per Area" icon={Coins} aliases={['cost_per_area', 'cost-per-area']} />

      {/* 2. Surface Area Suite */}
      <SectionHeader label="Surface Area Suite" count="6" />
      <NavSubButton id="sa-pipe" label="Pipe Spool Area" icon={Box} aliases={['pipe_spool', 'pipe-spool']} />
      <NavSubButton id="sa-tank" label="Storage Tank Area" icon={Box} aliases={['tank_shell', 'tank-shell', 'tank_roof']} />
      <NavSubButton id="sa-wws" label="Structural Steel BOQ" icon={Scale} aliases={['structural_steel', 'structural-steel']} />
      <NavSubButton id="sa-plate" label="Flat Plate Area" icon={Layers} aliases={['flat_plate', 'flat-plate']} />
      <NavSubButton id="sa-de" label="Dished Ends Area" icon={Box} aliases={['dished_end', 'dished-end']} />
      <NavSubButton id="sa-vessel" label="Process Vessel Area" icon={Building2} aliases={['vessel_area', 'vessel-equipment']} />

      {/* 3. Abrasives & Salt */}
      <SectionHeader label="Abrasives & Salt" count="3" />
      <NavSubButton id="ab-garnet" label="Garnet Blasting" icon={Flame} aliases={['garnet', 'abrasive_garnet']} />
      <NavSubButton id="ab-cslag" label="Copper Slag Blasting" icon={Layers} aliases={['copper_slag', 'copper-slag']} />
      <NavSubButton id="salt-main" label="Bresle Salt Test (ISO 8502)" icon={FileCheck} aliases={['salt_test_tool', 'iso-8502-9']} />

      {/* 4. Executive PRO Suite (Collapsible) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setProSuiteExpanded(prev => !prev)}
          className="w-full flex items-center justify-between px-2 py-1.5 text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest hover:text-amber-300 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span>👑 Executive PRO Suite</span>
            <span className="text-slate-500 font-mono">(20+)</span>
          </div>
          {proSuiteExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        {proSuiteExpanded && (
          <div className="mt-1 space-y-0.5 pl-1.5 border-l border-amber-500/20 ml-2">
            <NavSubButton id="vs-tds" label="Volume Solids · TDS" aliases={['vs_tds', 'volume_solids']} isProLocked />
            <NavSubButton id="vs-den" label="Volume Solids · Density" aliases={['vs_den']} isProLocked />
            <NavSubButton id="vs-lab" label="Volume Solids · Lab ASTM" aliases={['vs_lab']} isProLocked />
            <NavSubButton id="pro-recon" label="Paint Reconciliation" aliases={['paint_reconciliation', 'paint-reconciliation']} isProLocked />
            <NavSubButton id="pro-lcc" label="30-Yr Life Cycle Cost (LCC)" aliases={['life_cycle_cost', 'life-cycle-cost']} isProLocked />
            <NavSubButton id="pro-abp" label="Blast Profile Depth (Rz)" aliases={['blast_profile', 'blast-profile']} isProLocked />
            <NavSubButton id="pro-arc" label="Abrasive Recycling" aliases={['abrasive_recycling', 'abrasive-recycling']} isProLocked />
            <NavSubButton id="pro-dcc" label="Dust Collector Capacity" aliases={['dust_collector', 'dust-collector']} isProLocked />
            <NavSubButton id="pro-saw" label="Structure BOQ & Weight" aliases={['structure_boq', 'structure-boq']} isProLocked />
            <NavSubButton id="qa-pa2" label="SSPC-PA 2 Conformance" aliases={['sspc_pa2', 'dft-sspc-pa2']} isProLocked />
            <NavSubButton id="qa-iso" label="ISO 19840 Conformance" aliases={['iso_19840', 'dft-iso-19840']} isProLocked />
            <NavSubButton id="qa-hol" label="Holiday Detector Voltage" aliases={['holiday_voltage', 'holiday-voltage']} isProLocked />
            <NavSubButton id="ce-rate" label="Corrosion Rate (ISO 12944)" aliases={['corrosion_rate', 'corrosion-rate']} isProLocked />
            <NavSubButton id="ce-life" label="Coating Durability Life" aliases={['coating_life', 'coating-life-durability']} isProLocked />
            <NavSubButton id="tsa-wire" label="TSA Thermal Spray Suite" aliases={['tsa_wire', 'tsa-wire-consumption']} isProLocked />
            <NavSubButton id="pfp-mat" label="PFP Passive Fire Suite" aliases={['pfp_mat', 'pfp-material']} isProLocked />
            <NavSubButton id="bid-proc" label="Paint Procurement Qty" aliases={['paint_procurement', 'paint-procurement']} isProLocked />
            <NavSubButton id="bid-comp" label="Bid Comparison Matrix" aliases={['bid_comp', 'bid-comparison']} isProLocked />
          </div>
        )}
      </div>
    </div>
  );

  // ========================================================
  // 2. SPECIFICATION READING SIDEBAR
  // ========================================================
  const renderSpecificationSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Specification Reading" 
        subtitle="EPC Spec Review" 
        icon={FileText} 
        badge="8 Sections" 
        hubId="scope"
      />

      <SectionHeader label="Specification Sections" count="8" />
      <NavSubButton id="scope" label="Sec A & B: Scope & Project Info" icon={FileText} aliases={['secAB', 'project-info']} />
      <NavSubButton id="environment" label="Sec C: Environmental Limits" icon={Activity} aliases={['secC', 'general-requirements']} />
      <NavSubButton id="temperatures" label="Sec D: Operating Temp Table" icon={Flame} aliases={['secD', 'temp']} />
      <NavSubButton id="special-details" label="Sec E: Special Technical Details" icon={Wrench} aliases={['secE']} />
      <NavSubButton id="coating-system" label="Sec F: Coating System Design" icon={Layers} aliases={['secF', 'systems']} />
      <NavSubButton id="testing-qc" label="Sec G: Testing & QC Criteria" icon={CheckCircle2} aliases={['secG', 'qc']} />
      <NavSubButton id="manufacturers" label="Sec H: Approved Manufacturers" icon={Building2} aliases={['secH', 'brands']} />

      <SectionHeader label="Outputs & Records" />
      <NavSubButton id="report-register" label="Saved Reports Register" icon={FolderKanban} aliases={['register', 'report_register']} />
      <NavSubButton id="preview" label="Dossier Print Preview" icon={Eye} />
      <NavSubButton id="report" label="Formal Report View" icon={Printer} aliases={['print']} />
      <NavSubButton id="watermark" label="Watermark Controls" icon={Stamp} />
      <NavSubButton id="company-details" label="Company Branding" icon={Building2} aliases={['company']} />
    </div>
  );

  // ========================================================
  // 3. COATING PROCEDURE SIDEBAR
  // ========================================================
  const renderProcedureSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Coating Procedure" 
        subtitle="Method Statement & ITP" 
        icon={ClipboardCheck} 
        badge="12 Sections" 
        hubId="hub"
      />

      <NavSubButton id="hub" label="Procedure Hub Overview" icon={Layers} aliases={['home']} />
      <NavSubButton id="cover-revision" label="Cover & Revisions" icon={FileText} aliases={['cover_revision']} />

      <SectionHeader label="Method Statement" count="10" />
      <NavSubButton id="scope" label="01. Scope of Work" icon={FileText} />
      <NavSubButton id="reference-docs" label="02. Reference Documents" icon={FileText} aliases={['reference_docs']} />
      <NavSubButton id="standards" label="03. Governing Standards" icon={Scale} />
      <NavSubButton id="exclusions" label="04. Exclusions & Masking" icon={AlertTriangle} />
      <NavSubButton id="safety" label="05. HSE & Safety Plan" icon={ShieldCheck} />
      <NavSubButton id="surface-prep" label="06. Surface Preparation" icon={Flame} aliases={['surface_prep']} />
      <NavSubButton id="coating-app" label="07. Coating Application" icon={Layers} aliases={['coating_app']} />
      <NavSubButton id="repair-plan" label="08. Touch-up & Repair Plan" icon={Wrench} aliases={['repair_plan']} />
      <NavSubButton id="manufacturers" label="09. Approved Paint Brands" icon={Building2} />
      <NavSubButton id="attachments" label="10. Technical Attachments" icon={FolderKanban} />

      <SectionHeader label="Quality Annexures" />
      <NavSubButton id="annexure-coating" label="Annexure A-1: Coating Schedule" icon={FileSpreadsheet} aliases={['annexure_coating']} />
      <NavSubButton id="annexure-inspection" label="Annexure A-2: ITP Matrix" icon={CheckCircle2} aliases={['annexure_inspection']} />

      <SectionHeader label="Outputs & Records" />
      <NavSubButton id="register" label="Saved Procedures Register" icon={FolderKanban} />
      <NavSubButton id="preview" label="Dossier Preview" icon={Eye} />
      <NavSubButton id="report" label="Print Submittal Dossier" icon={Printer} aliases={['print']} />
      <NavSubButton id="watermark" label="Watermark Controls" icon={Stamp} />
      <NavSubButton id="company-details" label="Company Branding" icon={Building2} aliases={['company_details']} />
    </div>
  );

  // ========================================================
  // 4. UNIT RATE ESTIMATION SIDEBAR
  // ========================================================
  const renderUnitRateSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Unit Rate Estimation" 
        subtitle="Schedule of Rates (SOR)" 
        icon={Coins} 
        badge="Quick Bid" 
        hubId="hub"
      />

      <NavSubButton id="hub" label="Estimation Overview" icon={Layers} aliases={['dashboard']} />
      <NavSubButton id="project-info" label="01. Project Information" icon={Building2} aliases={['project_info']} />
      <NavSubButton id="scope" label="02. Commercial Scope" icon={FileText} />
      <NavSubButton id="section-d" label="03. Parameters (Sec D)" icon={Flame} aliases={['section_d']} />
      <NavSubButton id="section-f" label="04. Coating Systems (Sec F)" icon={Layers} aliases={['section_f']} />
      <NavSubButton id="cost-matrix" label="05. Schedule of Rates Table" icon={FileSpreadsheet} aliases={['cost_matrix', 'table']} />
      <NavSubButton id="revisions" label="06. Revision History" icon={Clock} />

      <SectionHeader label="Outputs & Records" />
      <NavSubButton id="report-view" label="Executive Commercial Report" icon={BarChart3} />
      <NavSubButton id="register" label="Saved Bid Register" icon={FolderKanban} aliases={['report-register']} />
      <NavSubButton id="preview" label="Quotation Preview" icon={Eye} />
      <NavSubButton id="xlprint" label="Print Commercial Proposal" icon={Printer} aliases={['report', 'print']} />
      <NavSubButton id="watermark" label="Watermark Controls" icon={Stamp} />
      <NavSubButton id="company-details" label="Company Details" icon={Building2} aliases={['company_details']} />

      {/* Switch to Manpower Estimator */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => handleNav('manpower-estimation', 'dashboard')}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Switch to Manpower Estimator</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );

  // ========================================================
  // 5. MANPOWER ESTIMATION SIDEBAR
  // ========================================================
  const renderManpowerSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Manpower Estimator" 
        subtitle="Industrial Project Costing" 
        icon={Users} 
        badge="Full CTC" 
        hubId="dashboard"
      />

      <NavSubButton id="dashboard" label="Project Scope & Duration" icon={Layers} aliases={['hub']} />
      <NavSubButton id="project-info" label="Project & Client Details" icon={Building2} aliases={['project_info']} />
      <NavSubButton id="worker-ctc" label="Worker CTC & Wages" icon={Users} aliases={['worker_ctc']} />
      <NavSubButton id="blasting-cost" label="Blasting Operations & Diesel" icon={Flame} aliases={['blasting_cost']} />
      <NavSubButton id="paint-application" label="Painting Operations & Pumps" icon={Layers} aliases={['paint_application']} />
      <NavSubButton id="paint-raw-material" label="Direct Paint Materials" icon={Droplets} aliases={['raw-material', 'raw_material']} />
      <NavSubButton id="abrasive-diesel" label="Abrasives & Diesel Logistics" icon={Box} aliases={['abrasive_diesel']} />
      <NavSubButton id="front-page-summary" label="Executive Cost Summary" icon={Coins} aliases={['summary']} />

      <SectionHeader label="Outputs & Records" />
      <NavSubButton id="report-register" label="Saved Estimates Register" icon={FolderKanban} aliases={['register']} />
      <NavSubButton id="preview" label="Proposal Print Preview" icon={Eye} />
      <NavSubButton id="report" label="Client Proposal Dossier" icon={Printer} aliases={['print', 'xlprint']} />
      <NavSubButton id="watermark" label="Watermark Controls" icon={Stamp} />
      <NavSubButton id="company-details" label="Company Branding" icon={Building2} aliases={['company_details']} />

      {/* Switch to Unit Rate Estimator */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => handleNav('unit-rate-estimation', 'hub')}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Switch to Unit Rate Estimator</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );

  // ========================================================
  // 6. INSPECTION REPORTING (CIR) SIDEBAR (Matches Screenshot 3)
  // ========================================================
  const renderInspectionSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Coating Inspection" 
        subtitle="Daily Quality Log (CIR)" 
        icon={ShieldCheck} 
        badge="Daily Log" 
        hubId="hub"
      />

      {/* Header Home button */}
      <NavSubButton 
        id="hub" 
        label="Inspection — Home" 
        icon={Home} 
        aliases={['home', 'dashboard']} 
      />

      {/* COATING / PAINTING REPORT */}
      <SectionHeader label="COATING / PAINTING REPORT" />
      <NavSubButton 
        id="coating-report" 
        label="Coating Report" 
        icon={FileCheck} 
        aliases={['stage', 's1', 'stage-s1', 'stage_s1', 's2', 'stage-s2', 's3', 'stage-s3', 's4', 'stage-s4']} 
      />

      {/* ADHESION TEST Collapsible Group */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setAdhesionExpanded(prev => !prev)}
          className="w-full flex items-center justify-between px-2 py-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest hover:text-white transition cursor-pointer"
        >
          <span>ADHESION TEST</span>
          {adhesionExpanded ? (
            <ChevronDown className="w-3 h-3 text-slate-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-slate-400" />
          )}
        </button>
        {adhesionExpanded && (
          <div className="space-y-1 pl-1 pt-1">
            <NavSubButton 
              id="pull-off-adhesion" 
              label="Pull-Off Report" 
              icon={Scale} 
              aliases={['pull-off', 'pull', 'pull_off_adhesion']} 
            />
            <NavSubButton 
              id="cross-cut-adhesion" 
              label="Cross-Cut Report" 
              icon={SlidersHorizontal} 
              aliases={['cross-cut', 'cross', 'cross_cut_adhesion']} 
            />
          </div>
        )}
      </div>

      {/* REFERENCES & STANDARDS */}
      <SectionHeader label="REFERENCES & STANDARDS" />
      <NavSubButton 
        id="standards" 
        label="References" 
        icon={BookOpen} 
        aliases={['reference-standards', 'reference_standards', 'std', 'refp', 'refc']} 
      />

      {/* REGISTERS */}
      <SectionHeader label="REGISTERS" />
      <NavSubButton 
        id="report-register" 
        label="Report Register" 
        icon={FolderKanban} 
        aliases={['register', 'reports', 'report_register']} 
      />
      <NavSubButton 
        id="rework-register" 
        label="Rework Register" 
        icon={AlertTriangle} 
        aliases={['rework', 'rework_register', 'rwkreg']} 
        badge="PRO" 
        isProLocked={true} 
      />

      {/* OUTPUT */}
      <SectionHeader label="OUTPUT" />
      <NavSubButton 
        id="preview" 
        label="Preview" 
        icon={Eye} 
        aliases={['summary']} 
      />
      <NavSubButton 
        id="print" 
        label="Print" 
        icon={Printer} 
        aliases={['report', 'xlprint']} 
        badge="PRO" 
        isProLocked={true} 
      />
      <NavSubButton 
        id="dashboard" 
        label="Dashboard" 
        icon={BarChart3} 
        badge="PRO" 
        isProLocked={true} 
      />

      {/* BRANDING */}
      <SectionHeader label="BRANDING" />
      <NavSubButton 
        id="company-details" 
        label="Company Details" 
        icon={Building2} 
        aliases={['company', 'company_details']} 
        badge="PRO" 
        isProLocked={true} 
      />
      <NavSubButton 
        id="master-list" 
        label="Master List" 
        icon={Layers} 
        aliases={['master', 'master-systems', 'master_systems', 'master_list']} 
        badge="PRO" 
        isProLocked={true} 
      />
      <NavSubButton 
        id="watermark" 
        label="Watermark Removal" 
        icon={Stamp} 
        badge="PRO" 
        isProLocked={true} 
      />
    </div>
  );

  // ========================================================
  // 7. SPRAY PAINTER QUALIFICATION SIDEBAR (Matches Screenshot 1)
  // ========================================================
  const renderPainterSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Painter Qualification" 
        subtitle="Spray Painter PQR" 
        icon={Award} 
        badge="PQR" 
        hubId="hub"
      />

      {/* Header Home button */}
      <NavSubButton 
        id="hub" 
        label="Home" 
        icon={Home} 
        aliases={['home', 'dashboard']} 
      />

      {/* SPRAY PAINTER QUALIFICATION */}
      <SectionHeader label="SPRAY PAINTER QUALIFICATION" />
      <NavSubButton 
        id="project-operator" 
        label="Project & Painter" 
        icon={Users} 
        aliases={['info', 'project-info', 'project_info', 'project_operator']} 
      />
      <NavSubButton 
        id="training-test" 
        label="Training" 
        icon={FileText} 
        aliases={['train', 'training_test']} 
      />
      <NavSubButton 
        id="checklist" 
        label="Assessment Checklist" 
        icon={CheckCircle2} 
        badge="0%" 
      />
      <NavSubButton 
        id="coat-stage-s1" 
        label="Blasting & Priming" 
        icon={Droplets} 
        aliases={['s1', 'coat_stage_s1']} 
      />
      <NavSubButton 
        id="coat-stage-s2" 
        label="1st Coat" 
        icon={Layers} 
        aliases={['s2', 'coat_stage_s2']} 
      />
      <NavSubButton 
        id="coat-stage-s3" 
        label="2nd Coat" 
        icon={Layers} 
        aliases={['s3', 'coat_stage_s3']} 
      />
      <NavSubButton 
        id="coat-stage-s4" 
        label="3rd Coat" 
        icon={Layers} 
        aliases={['s4', 'coat_stage_s4']} 
      />
      <NavSubButton 
        id="photo-report" 
        label="Photographic Report" 
        icon={Camera} 
        badge="0%" 
        aliases={['photo', 'photo_report']} 
      />
      <NavSubButton 
        id="verdict-approval" 
        label="Verdict & Approval" 
        icon={Award} 
        aliases={['verdict', 'verdict_approval']} 
      />

      {/* REGISTERS */}
      <SectionHeader label="REGISTERS" />
      <NavSubButton 
        id="report-register" 
        label="Report Register" 
        icon={FolderKanban} 
        aliases={['register', 'reports', 'saved-reports', 'saved_reports']} 
      />

      {/* OUTPUT */}
      <SectionHeader label="OUTPUT" />
      <NavSubButton 
        id="preview" 
        label="Preview" 
        icon={Eye} 
        aliases={['summary']} 
      />
      <NavSubButton 
        id="print" 
        label="Print Report" 
        icon={Printer} 
        aliases={['report']} 
        badge="PRO" 
        isProLocked={true} 
      />

      {/* BRANDING */}
      <SectionHeader label="BRANDING" />
      <NavSubButton 
        id="company-details" 
        label="Company Details" 
        icon={Building2} 
        aliases={['company', 'company_details']} 
        badge="PRO" 
        isProLocked={true} 
      />
      <NavSubButton 
        id="watermark" 
        label="Watermark Removal" 
        icon={Stamp} 
        badge="PRO" 
        isProLocked={true} 
      />
    </div>
  );

  // ========================================================
  // 8. TSA OPERATOR QUALIFICATION SIDEBAR (Matches Screenshot 2)
  // ========================================================
  const renderTsaSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="TSA Qualification" 
        subtitle="Thermal Spray Operator" 
        icon={Sparkles} 
        badge="TSA" 
        hubId="hub"
      />

      {/* Header Home button */}
      <NavSubButton 
        id="hub" 
        label="Home" 
        icon={Home} 
        aliases={['home', 'dashboard']} 
      />

      {/* TSA OPERATOR QUALIFICATION */}
      <SectionHeader label="TSA OPERATOR QUALIFICATION" />
      <NavSubButton 
        id="project-operator" 
        label="Project & TSA Operator" 
        icon={Users} 
        aliases={['info', 'project-info', 'project_info', 'project_operator']} 
      />
      <NavSubButton 
        id="checklist" 
        label="Assessment Checklist" 
        icon={CheckCircle2} 
        badge="0%" 
      />
      <NavSubButton 
        id="coat-stage-s1" 
        label="Blasting + Thermal Spray" 
        icon={Droplets} 
        aliases={['s1', 'coat_stage_s1']} 
      />
      <NavSubButton 
        id="coat-stage-s2" 
        label="1st Coat" 
        icon={Layers} 
        aliases={['s2', 'coat_stage_s2']} 
      />
      <NavSubButton 
        id="coat-stage-s3" 
        label="2nd Coat" 
        icon={Layers} 
        aliases={['s3', 'coat_stage_s3']} 
      />
      <NavSubButton 
        id="coat-stage-s4" 
        label="3rd Coat" 
        icon={Layers} 
        aliases={['s4', 'coat_stage_s4']} 
      />
      <NavSubButton 
        id="photo-report" 
        label="Photographic Report" 
        icon={Camera} 
        aliases={['photo', 'photo_report']} 
      />
      <NavSubButton 
        id="verdict-approval" 
        label="Verdict & Approval" 
        icon={Award} 
        aliases={['verdict', 'verdict_approval']} 
      />

      {/* REGISTERS */}
      <SectionHeader label="REGISTERS" />
      <NavSubButton 
        id="report-register" 
        label="Report Register" 
        icon={FolderKanban} 
        aliases={['register', 'reports', 'saved-reports', 'saved_reports']} 
      />

      {/* OUTPUT */}
      <SectionHeader label="OUTPUT" />
      <NavSubButton 
        id="preview" 
        label="Preview" 
        icon={Eye} 
        aliases={['summary']} 
      />
      <NavSubButton 
        id="print" 
        label="Print Report" 
        icon={Printer} 
        aliases={['report']} 
        badge="PRO" 
        isProLocked={true} 
      />

      {/* BRANDING */}
      <SectionHeader label="BRANDING" />
      <NavSubButton 
        id="company-details" 
        label="Company Details" 
        icon={Building2} 
        aliases={['company', 'company_details']} 
        badge="PRO" 
        isProLocked={true} 
      />
      <NavSubButton 
        id="watermark" 
        label="Watermark Removal" 
        icon={Stamp} 
        badge="PRO" 
        isProLocked={true} 
      />
    </div>
  );

  // ========================================================
  // 9. BLASTER / OPERATOR QUALIFICATION SIDEBAR (Matches Screenshot 4)
  // ========================================================
  const renderBlasterSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Blaster Qualification" 
        subtitle="Blaster Operator BQR" 
        icon={Flame} 
        badge="BQR" 
        hubId="hub"
      />

      {/* Header Home button */}
      <NavSubButton 
        id="hub" 
        label="Home" 
        icon={Home} 
        aliases={['home', 'dashboard']} 
      />

      {/* BLASTER / OPERATOR QUALIFICATION */}
      <SectionHeader label="BLASTER / OPERATOR QUALIFICATION" />
      <NavSubButton 
        id="project-operator" 
        label="Project & Operator" 
        icon={Users} 
        aliases={['info', 'project-info', 'project_info', 'project_operator']} 
      />
      <NavSubButton 
        id="training-test" 
        label="Training & Test" 
        icon={FileText} 
        aliases={['train', 'training_test']} 
      />
      <NavSubButton 
        id="checklist" 
        label="Assessment Checklist" 
        icon={CheckCircle2} 
        badge="0%" 
      />
      <NavSubButton 
        id="blasting-process" 
        label="Blasting Process" 
        icon={Flame} 
        aliases={['blasting', 'process', 'blasting_process']} 
      />
      <NavSubButton 
        id="photo-report" 
        label="Photographic Report" 
        icon={Camera} 
        badge="0%" 
        aliases={['photo', 'photo_report']} 
      />
      <NavSubButton 
        id="verdict-approval" 
        label="Verdict & Approval" 
        icon={Award} 
        aliases={['verdict', 'verdict_approval']} 
      />

      {/* REGISTERS */}
      <SectionHeader label="REGISTERS" />
      <NavSubButton 
        id="report-register" 
        label="Report Register" 
        icon={FolderKanban} 
        aliases={['register', 'reports', 'saved-reports', 'saved_reports']} 
      />

      {/* OUTPUT */}
      <SectionHeader label="OUTPUT" />
      <NavSubButton 
        id="preview" 
        label="Preview" 
        icon={Eye} 
        aliases={['summary']} 
      />
      <NavSubButton 
        id="print" 
        label="Print Report" 
        icon={Printer} 
        aliases={['report']} 
        badge="PRO" 
        isProLocked={true} 
      />

      {/* BRANDING */}
      <SectionHeader label="BRANDING" />
      <NavSubButton 
        id="company-details" 
        label="Company Details" 
        icon={Building2} 
        aliases={['company', 'company_details']} 
        badge="PRO" 
        isProLocked={true} 
      />
      <NavSubButton 
        id="watermark" 
        label="Watermark Removal" 
        icon={Stamp} 
        badge="PRO" 
        isProLocked={true} 
      />
    </div>
  );

  // ========================================================
  // 8. CONTRACTOR MANAGEMENT SIDEBAR
  // ========================================================
  const renderContractorSidebar = () => (
    <div className="space-y-1">
      <ModuleHeader 
        title="Contractor Hub" 
        subtitle="Operations Management" 
        icon={Building2} 
        badge="PRO" 
        hubId="hub"
      />

      <NavSubButton id="hub" label="Master Operations Overview" icon={Layers} />
      <NavSubButton id="projects" label="Active Projects & Sites" icon={FolderKanban} />
      <NavSubButton id="employees" label="Blaster & Painter Workforce" icon={Users} />
      <NavSubButton id="stock" label="Paint & Abrasive Inventory" icon={Box} />
      <NavSubButton id="daily-progress" label="Daily Progress Reports (DPR)" icon={CalendarDays} />
      <NavSubButton id="analytics" label="Productivity & Analytics" icon={BarChart3} />
    </div>
  );

  // ========================================================
  // 9. GLOBAL / DEFAULT MAIN NAVIGATION
  // ========================================================
  const renderGlobalNav = () => (
    <div className="space-y-4">
      <div>
        <div className="px-3 mb-2 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          MAIN MODULES
        </div>

        <nav className="space-y-1">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
              isHome
                ? 'bg-[#2D2319] border border-[#5E4226] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Home className={`w-4 h-4 shrink-0 ${isHome ? 'text-[#F7941D]' : 'text-slate-400'}`} />
            <span>Home</span>
          </button>

          {/* 2. Coating Calculator */}
          <button
            type="button"
            onClick={() => handleNav('coating-calculator', 'hub')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
              isCalc
                ? 'bg-[#2D2319] border border-[#5E4226] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Calculator className={`w-4 h-4 shrink-0 ${isCalc ? 'text-[#F7941D]' : 'text-slate-400'}`} />
              <span className="truncate">Coating Calculator</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 shrink-0">
              36
            </span>
          </button>

          {/* 3. Specification Reading */}
          <button
            type="button"
            onClick={() => handleNav('specification-reading', 'scope')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
              isSpec
                ? 'bg-[#2D2319] border border-[#5E4226] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <FileText className={`w-4 h-4 shrink-0 ${isSpec ? 'text-[#F7941D]' : 'text-slate-400'}`} />
              <span className="truncate">Specification Reading</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 shrink-0">
              8 Sec
            </span>
          </button>

          {/* 4. Coating Procedure */}
          <button
            type="button"
            onClick={() => handleNav('coating-procedure', 'hub')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
              isProcedure
                ? 'bg-[#2D2319] border border-[#5E4226] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <ClipboardCheck className={`w-4 h-4 shrink-0 ${isProcedure ? 'text-[#F7941D]' : 'text-slate-400'}`} />
              <span className="truncate">Coating Procedure</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 shrink-0">
              ITP
            </span>
          </button>

          {/* 5. Estimation (Expandable) */}
          <div>
            <button
              type="button"
              onClick={() => setEstimationExpanded(prev => !prev)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition ${
                estimationExpanded || isEstimationGroup
                  ? 'text-white bg-white/[0.06]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Coins className={`w-4 h-4 shrink-0 ${isEstimationGroup ? 'text-[#F7941D]' : 'text-slate-400'}`} />
                <span className="truncate">Estimation</span>
              </div>
              {estimationExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {estimationExpanded && (
              <div className="mt-1 pl-9 pr-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleNav('unit-rate-estimation', 'hub')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition cursor-pointer truncate ${
                    isUnitRate
                      ? 'text-[#F7941D] font-semibold bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Unit-Rate Estimation
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('manpower-estimation', 'dashboard')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition cursor-pointer truncate ${
                    isManpower
                      ? 'text-[#F7941D] font-semibold bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Manpower Project Estimator
                </button>
              </div>
            )}
          </div>

          {/* 6. Reports & Documentation (Expandable) */}
          <div>
            <button
              type="button"
              onClick={() => setDocExpanded(prev => !prev)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition ${
                docExpanded || isDocGroup
                  ? 'text-white bg-white/[0.06]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <FileSpreadsheet className={`w-4 h-4 shrink-0 ${isDocGroup ? 'text-[#F7941D]' : 'text-slate-400'}`} />
                <span className="truncate">Reports &amp; Documentation</span>
              </div>
              {docExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {docExpanded && (
              <div className="mt-1 pl-9 pr-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleNav('inspection-reporting', 'hub')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition cursor-pointer truncate ${
                    isInspection
                      ? 'text-[#F7941D] font-semibold bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Daily Coating Inspection (CIR)
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('painter-qualification', 'dashboard')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition cursor-pointer truncate ${
                    isPainter
                      ? 'text-[#F7941D] font-semibold bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Spray Painter Qualification (PQR)
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('blaster-qualification', 'dashboard')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition cursor-pointer truncate ${
                    isBlaster
                      ? 'text-[#F7941D] font-semibold bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Blaster Qualification (BQR)
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('tsa-qualification', 'dashboard')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition cursor-pointer truncate ${
                    isTsa
                      ? 'text-[#F7941D] font-semibold bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  TSA Operator Qualification
                </button>
              </div>
            )}
          </div>

          {/* 7. Contractor Management */}
          <button
            type="button"
            onClick={() => handleNav('contractor-management', 'hub')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition cursor-pointer ${
              isContractor
                ? 'bg-[#2D2319] border border-[#5E4226] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Building2 className={`w-4 h-4 shrink-0 ${isContractor ? 'text-[#F7941D]' : 'text-slate-400'}`} />
              <span className="truncate">Contractor Management</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-[#F7941D] shrink-0">
              PRO
            </span>
          </button>

          {/* 8. Training & Certification (Disabled) */}
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 opacity-60 cursor-not-allowed select-none bg-white/[0.02] border border-transparent"
            title="Training & Certification module is disabled"
          >
            <div className="flex items-center gap-3 truncate">
              <GraduationCap className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="truncate">Training &amp; Certification</span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08] tracking-wider">
              Disabled
            </span>
          </button>

          {/* 9. AI Assistant */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('bg_open_ai_modal'));
              if (setMobileSidebarOpen) setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] text-[13px] font-medium cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>AI Assistant</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
              AI
            </span>
          </button>
        </nav>
      </div>
    </div>
  );

  // Dynamic Navigation Router
  const renderNavItems = () => {
    if (isCalc) return renderCalculatorSidebar();
    if (isSpec) return renderSpecificationSidebar();
    if (isProcedure) return renderProcedureSidebar();
    if (isUnitRate) return renderUnitRateSidebar();
    if (isManpower) return renderManpowerSidebar();
    if (isInspection) return renderInspectionSidebar();
    if (isPainter) return renderPainterSidebar();
    if (isTsa) return renderTsaSidebar();
    if (isBlaster) return renderBlasterSidebar();
    if (isContractor) return renderContractorSidebar();
    return renderGlobalNav();
  };

  // Shared Footer Content
  const renderFooter = () => (
    <div className="p-3 border-t border-white/[0.08] space-y-2 shrink-0 bg-[#131822]">
      {/* Help & FAQ Button */}
      <button
        type="button"
        onClick={() => {
          if (onOpenHelp) onOpenHelp();
          else handleNav('knowledge');
          if (setMobileSidebarOpen) setMobileSidebarOpen(false);
        }}
        className="w-full bg-[#222834] border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Help &amp; FAQ</span>
      </button>

      {/* User Profile / Sign In Action Card */}
      {!isLoggedIn ? (
        <button
          type="button"
          onClick={() => {
            if (onOpenAuthModal) onOpenAuthModal();
            if (setMobileSidebarOpen) setMobileSidebarOpen(false);
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-[#F7941D]/15 to-[#8B0E16]/15 border border-[#F7941D]/30 hover:border-[#F7941D] text-white transition group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white flex items-center justify-center text-xs shadow-xs shrink-0">
              <LogIn className="w-3.5 h-3.5" />
            </div>
            <div className="text-left truncate">
              <span className="font-bold text-white text-[12px] block group-hover:text-[#F7941D] transition truncate">
                Sign In / Register
              </span>
              <span className="text-[9px] text-slate-400 block truncate">
                Unlock All Calculations
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F7941D] transition shrink-0" />
        </button>
      ) : (
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentUser?.avatar_url || currentUser?.avatar || currentUser?.profile?.avatar_url ? (
              <img
                src={currentUser?.avatar_url || currentUser?.avatar || currentUser?.profile?.avatar_url}
                alt={currentUser.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-amber-400/50 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white font-bold flex items-center justify-center text-xs shadow-2xs font-mono shrink-0">
                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="leading-tight truncate">
              <span className="font-bold text-white text-[12px] flex items-center gap-1 truncate">
                <span className="truncate">{currentUser?.name || 'User'}</span>
                {isUserPro && (
                  <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-500/20 text-[#F7941D] shrink-0">
                    PRO
                  </span>
                )}
              </span>
              <span className="text-[9px] text-slate-400 block truncate font-mono">
                {isUserPro ? 'PRO LICENSE' : 'FREE PLAN'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button 
              type="button"
              onClick={() => handleNav('settings')}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer transition"
              title="Account Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onClick={() => {
                if (window.confirm('Sign out of your workspace?')) {
                  clearAuth();
                }
              }}
              className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Website & Version Stamp */}
      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
        <a 
          href="https://bgcoating.com" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-[#F7941D] transition flex items-center gap-1"
        >
          <Globe className="w-3 h-3 text-slate-500" />
          <span>bgcoating.com</span>
        </a>
        <span>v2.0.42</span>
      </div>
    </div>
  );

  return (
    <>
      {/* ========================================================
          1. DESKTOP SIDEBAR RAIL (Pinned, Never Overlaps Content)
          ======================================================== */}
      <aside className="hidden md:flex flex-col w-[264px] h-screen max-h-screen fixed left-0 top-0 bottom-0 shrink-0 select-none shadow-md z-30 bg-[#131822] border-r border-white/[0.08] overflow-hidden">
        
        {/* BRAND HEADER */}
        <div 
          onClick={() => handleNav('dashboard')}
          className="p-4 border-b border-white/[0.08] cursor-pointer hover:bg-white/[0.02] transition shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
              <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-white text-base block font-rajdhani tracking-wide">
                BG CoatingOS™
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#F7941D] uppercase block">
                CORROSION SUITE
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Contextual Navigation List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-800 overscroll-contain">
          {renderNavItems()}
        </div>

        {/* FOOTER */}
        <div className="shrink-0">
          {renderFooter()}
        </div>

      </aside>

      {/* ========================================================
          2. MOBILE DRAWER OVERLAY
          ======================================================== */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Sidebar */}
          <aside className="relative flex flex-col w-[280px] max-w-[85vw] h-full max-h-full bg-[#131822] border-r border-white/[0.08] shadow-2xl z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-white/[0.08] shrink-0">
              <div 
                onClick={() => handleNav('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                  <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white text-sm block">BG CoatingOS™</span>
                  <span className="text-[8px] font-mono font-bold tracking-widest text-[#F7941D] uppercase block">PLATFORM</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] cursor-pointer transition"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-800 overscroll-contain">
              {renderNavItems()}
            </div>

            {/* Drawer Footer */}
            <div className="shrink-0">
              {renderFooter()}
            </div>

          </aside>
        </div>
      )}
    </>
  );
}
