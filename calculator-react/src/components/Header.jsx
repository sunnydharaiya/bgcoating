import React, { useState } from 'react';
import { 
  PanelLeft, 
  Menu, 
  Globe, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  Eye, 
  Save, 
  Check, 
  ClipboardList, 
  RotateCcw, 
  FileText,
  Minus,
  Plus,
  Search,
  Bell,
  ClipboardCheck
} from 'lucide-react';

export default function Header({ 
  activePage, 
  activeSubTool, 
  setActivePage,
  setActiveSubTool,
  setMobileSidebarOpen,
  onOpenHelp,
  onOpenUpgrade,
  onHeaderAction
}) {
  const [zoomLevel, setZoomLevel] = useState(96);
  const [lang, setLang] = useState('English');

  const handleZoomChange = (delta) => {
    setZoomLevel(prev => {
      const next = Math.min(120, Math.max(80, prev + delta));
      document.documentElement.style.zoom = `${next}%`;
      return next;
    });
  };

  const isHome = activePage === 'dashboard';
  const isCalc = activePage === 'coating-calculator' || activePage === 'calc';
  const isSpec = activePage === 'specification-reading' || activePage === 'design';
  const isManpower = activePage === 'manpower-estimation';
  const isBlaster = activePage === 'blaster-qualification' || activePage === 'blaster';
  const isPainter = activePage === 'painter-qualification' || activePage === 'painter';
  const isTsa = activePage === 'tsa-qualification' || activePage === 'tsa';
  const isInspection = activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection' || activePage === 'inspection';
  const isContractor = activePage === 'contractor-management' || activePage === 'contractor';
  const isProcedure = activePage === 'coating-procedure' || activePage === 'procedure';
  const isDarkSuite = isManpower || isBlaster || isPainter || isTsa || isInspection;
  const [guideOpen, setGuideOpen] = useState(false);

  // Authenticated user initial
  const userInitial = (() => {
    try {
      const raw = localStorage.getItem('bg_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.name) return parsed.name.charAt(0).toUpperCase();
      }
    } catch (e) {}
    return 'U';
  })();

  // Module Titles mapping for Breadcrumbs & Right Title
  const moduleInfo = {
    'unit-rate-estimation': {
      crumb: 'QUICK UNIT-RATE ESTIMATION',
      title: 'Quick Unit Rate Estimation'
    },
    'cost-estimation': {
      crumb: 'QUICK UNIT-RATE ESTIMATION',
      title: 'Quick Unit Rate Estimation'
    },
    'specification-reading': {
      crumb: 'COATING SPECIFICATION READING',
      title: 'Coating Specification Reading'
    },
    'design': {
      crumb: 'COATING SPECIFICATION READING',
      title: 'Coating Specification Reading'
    },
    'coating-procedure': {
      crumb: 'COATING PROCEDURE (ITP)',
      title: 'Coating Procedure'
    },
    'procedure': {
      crumb: 'COATING PROCEDURE (ITP)',
      title: 'Coating Procedure'
    },
    'coating-calculator': {
      crumb: 'COATING CALCULATOR SUITE',
      title: 'Coating Calculator'
    },
    'calc': {
      crumb: 'COATING CALCULATOR SUITE',
      title: 'Coating Calculator'
    },
    'manpower-estimation': {
      crumb: 'MANPOWER PROJECT ESTIMATOR',
      title: 'Manpower Project Estimator'
    },
    'blaster-qualification': {
      crumb: 'BLASTER QUALIFICATION (OQR)',
      title: 'Blaster Qualification'
    },
    'painter-qualification': {
      crumb: 'PAINTER QUALIFICATION (PQR)',
      title: 'Painter Qualification'
    },
    'tsa-qualification': {
      crumb: 'TSA QUALIFICATION',
      title: 'TSA Qualification'
    },
    'inspection-reporting': {
      crumb: 'INSPECTION REPORTING (CIR)',
      title: 'Inspection Reporting'
    },
    'knowledge': {
      crumb: 'STANDARDS REFERENCE LIBRARY',
      title: 'Knowledge Base'
    },
    'support': {
      crumb: 'TECHNICAL SUPPORT DESK',
      title: 'Technical Support'
    },
    'settings': {
      crumb: 'PROFILE & SETTINGS',
      title: 'Settings'
    }
  };

  const currentMod = moduleInfo[activePage] || {
    crumb: activePage?.toUpperCase().replace('-', ' ') || 'ENGINEERING MODULE',
    title: 'Engineering Module'
  };

  const handleActionClick = (actionName) => {
    if (onHeaderAction) {
      onHeaderAction(actionName);
    } else {
      // Dispatch custom window event that pages can listen to
      window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: actionName, page: activePage } }));
    }
  };

  const procSectionNames = {
    'hub': 'Home',
    'home': 'Home',
    'cover-revision': 'Cover & Revision',
    'scope': 'Scope',
    'reference-docs': 'Reference Documents',
    'standards': 'Reference Standards',
    'exclusions': 'Blasting / Coating Exclusion',
    'safety': 'Safety Requirements',
    'surface-prep': 'Surface Preparation',
    'coating-app': 'Coating Application',
    'repair-plan': 'Coating Repair',
    'manufacturers': 'Approved Manufacturers',
    'attachments': 'Annexures',
    'annexure-coating': 'Coating Systems (A-1)',
    'annexure-inspection': 'Inspection Instruments (A-2)',
    'register': 'Procedure Register',
    'project-master': 'Project Master List',
    'preview': 'Preview',
    'report': 'Print / PDF',
    'company-details': 'Company Details',
    'watermark': 'Watermark'
  };

  const procGuideChips = [
    { id: 'cover-revision', name: 'Cover & Revision', done: 12, total: 12, status: 'done' },
    { id: 'scope', name: 'Scope', done: 5, total: 10, status: 'part' },
    { id: 'reference-docs', name: 'Reference Documents', done: 2, total: 3, status: 'part' },
    { id: 'standards', name: 'Reference Standards', done: 10, total: 11, status: 'part' },
    { id: 'exclusions', name: 'Blasting / Exclusion', done: 13, total: 14, status: 'part' },
    { id: 'safety', name: 'Safety Requirements', done: 39, total: 40, status: 'part' },
    { id: 'surface-prep', name: 'Surface Preparation', done: 59, total: 62, status: 'part' },
    { id: 'coating-app', name: 'Coating Application', done: 55, total: 57, status: 'part' },
    { id: 'repair-plan', name: 'Coating Repair', done: 15, total: 15, status: 'done' },
    { id: 'attachments', name: 'Annexures', done: 8, total: 8, status: 'done' },
    { id: 'annexure-coating', name: 'Coating Systems', done: 73, total: 79, status: 'part' },
    { id: 'annexure-inspection', name: 'Inspection Instruments', done: 42, total: 52, status: 'part' }
  ];

  if (isProcedure) {
    const currentSectionName = procSectionNames[activeSubTool] || (activeSubTool ? activeSubTool.replace('-', ' ') : 'Overview');
    const isProcedureHome = !activeSubTool || activeSubTool === 'hub' || activeSubTool === 'home';
    const procProgressPct = 92;
    const completedSectionsCount = 2;
    const pendingSectionsCount = 10;
    const totalFieldsCount = 363;
    const completedFieldsCount = 333;
    const procStatus = 'IN PROGRESS';

    return (
      <header className="bg-white border-b border-[#E6E8EC] sticky top-0 z-30 select-none shadow-xs">
        {/* ROW 1: BREADCRUMBS & BADGE (Matches media_1791472985773_f56bf798.png) */}
        <div className="h-12 md:h-13 px-4 md:px-6 flex items-center justify-between border-b border-[#F0F2F5]">
          {/* LEFT: BREADCRUMBS */}
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <button
              onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#7E8B99] font-medium">
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#F7941D] text-xs font-semibold text-slate-700 hover:text-[#F7941D] flex items-center gap-1 shadow-2xs transition cursor-pointer"
              >
                <span>Home</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />

              <button
                onClick={() => setActiveSubTool ? setActiveSubTool('hub') : setActivePage('coating-procedure')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer ${
                  isProcedureHome
                    ? 'bg-[#FFF5EA] border-[#FDE3C7] text-[#D97706] font-bold'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#F7941D] text-slate-700 hover:text-[#F7941D]'
                }`}
              >
                <span>Painting Procedure</span>
              </button>

              {!isProcedureHome && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
                  <span className="bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] font-bold text-xs px-2.5 py-1 rounded-lg shadow-2xs whitespace-nowrap">
                    {currentSectionName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: BADGE WITH ICON */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700">
              <ClipboardCheck className="w-4 h-4 text-[#F7941D]" />
              <span>Painting Procedure</span>
            </div>
          </div>
        </div>

        {/* ROW 2: PROGRESS STRIP & ACTIONS (Matches screenshot & ref-2.html) */}
        <div className="proc-progress-strip">
          <div className="proc-ps-left">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-xs font-medium text-[#475569] shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[#94A3B8]" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#475569] focus:outline-none cursor-pointer pr-1"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Spanish">Español</option>
                <option value="Arabic">العربية</option>
              </select>
            </div>

            {/* Circular Progress Ring */}
            <div 
              className="proc-ps-ring" 
              style={{ background: `conic-gradient(#D96B1C ${procProgressPct * 3.6}deg, #EBDFCB ${procProgressPct * 3.6}deg)` }}
            >
              <span>{procProgressPct}%</span>
            </div>

            {/* Progress Track & Counts */}
            <div className="proc-ps-track-wrap">
              <div className="proc-ps-label-row">
                <span className="proc-ps-title">PROCEDURE PREPARATION PROGRESS</span>
                <span className="proc-ps-counts">
                  <b>{completedSectionsCount}</b> sections complete · <b>{pendingSectionsCount}</b> pending
                </span>
              </div>
              <div className="proc-ps-track">
                <div className="proc-ps-fill" style={{ width: `${procProgressPct}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="proc-ps-right">
            {/* Live System Pill */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF8F0] border border-[#BCE3C9] text-xs font-semibold text-[#1E9E50]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E50] animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-wider">LIVE SYSTEM</span>
            </div>

            {/* Preview */}
            <button
              onClick={() => handleActionClick('preview')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Preview Procedure Dossier"
            >
              <Eye className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={() => handleActionClick('save-draft')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Save Draft to Procedure Register"
            >
              <Save className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* Validate */}
            <button
              onClick={() => handleActionClick('validate')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-[#16A34A] border border-[#E2E8F0] hover:border-emerald-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Validate and Sign-off"
            >
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Validate</span>
            </button>

            {/* Register */}
            <button
              onClick={() => handleActionClick('register')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Open Procedure Register"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Register</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => handleActionClick('reset')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-[#475569] hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Reset All Procedure Fields"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Status Pill */}
            <span className="proc-ps-status" data-st={procStatus.toLowerCase().replace(' ', '-')}>
              {procStatus}
            </span>

            {/* Completion Guide Toggle Button */}
            <button
              onClick={() => setGuideOpen(prev => !prev)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FBF1E2] border border-[#E3D2B8] text-[#8B0E16] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Toggle Section Completion Guide"
            >
              <span>☰ Completion Guide</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${guideOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* ROW 3: COMPLETION GUIDE PANEL (Expands when guideOpen) */}
        {guideOpen && (
          <div className="proc-guide-panel animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="proc-gp-head">
              <span>🧭 Completion Guide — what is done, what is pending, what is required before approval</span>
              <span className="proc-gp-summary">
                {completedFieldsCount}/{totalFieldsCount} fields complete · {totalFieldsCount - completedFieldsCount} remaining · {pendingSectionsCount} section(s) required before approval
              </span>
            </div>

            <div className="proc-gp-chips">
              {procGuideChips.map(chip => (
                <span
                  key={chip.id}
                  onClick={() => {
                    if (setActiveSubTool) setActiveSubTool(chip.id);
                    setGuideOpen(false);
                  }}
                  className={`proc-gp-chip ${chip.status}`}
                  title={`${chip.done}/${chip.total} fields complete`}
                >
                  <span className="dot"></span>
                  <span>{chip.name}</span>
                  <b>{chip.done}/{chip.total}</b>
                </span>
              ))}
            </div>

            <div className="proc-gp-note">
              Fields marked <span className="text-red-600 font-bold">*</span> are mandatory. Enter <b>NA</b> where not applicable — the field will then count as completed.
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={`h-14 md:h-15 ${isDarkSuite ? 'bg-[#181E29] border-b border-[#262F40]' : 'bg-white border-b border-[#E6E8EC]'} px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none`}>
      
      {/* LEFT SECTION */}
      {isHome ? (
        /* Mode 1: Platform / Dashboard Header */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
            aria-label="Toggle Navigation"
            title="Toggle Navigation"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-[#7E8B99] font-medium truncate">
            COMPLETE COATING &amp; CORROSION MANAGEMENT ECOSYSTEM
          </span>
        </div>
      ) : isBlaster ? (
        /* Mode 4: Blaster Qualification Header (Matches media_1791304029525.png) */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#262F40] text-slate-300 hover:text-white bg-[#202736] transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-bold text-white tracking-wide leading-tight uppercase font-mono">
              BG GROUP • COATING • CONSULTANT
            </h1>
            <span className="text-[9px] md:text-[10px] text-[#8F9CAE] font-medium leading-tight uppercase tracking-wider font-mono">
              OPERATOR QUALIFICATION • DIGITAL REPORTING SYSTEM
            </span>
          </div>
        </div>
      ) : isPainter ? (
        /* Mode 5: Spray Painter Qualification Header (Matches media_1791304046270.png) */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#262F40] text-slate-300 hover:text-white bg-[#202736] transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-bold text-white tracking-wide leading-tight uppercase font-mono">
              BG GROUP OF PAINT &amp; COATING CONSULTANT
            </h1>
            <span className="text-[9px] md:text-[10px] text-[#8F9CAE] font-medium leading-tight uppercase tracking-wider font-mono">
              SPRAY PAINTER QUALIFICATION • DIGITAL REPORTING SYSTEM
            </span>
          </div>
        </div>
      ) : isTsa ? (
        /* Mode 6: TSA Operator Qualification Header (Matches media_1791305324466.png) */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#262F40] text-slate-300 hover:text-white bg-[#202736] transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-bold text-white tracking-wide leading-tight uppercase font-mono">
              BG GROUP OF PAINT &amp; COATING CONSULTANT
            </h1>
            <span className="text-[9px] md:text-[10px] text-[#8F9CAE] font-medium leading-tight uppercase tracking-wider font-mono">
              TSA OPERATOR QUALIFICATION · TWIN WIRE ARC · DIGITAL REPORTING SYSTEM
            </span>
          </div>
        </div>
      ) : isInspection ? (
        /* Mode 7: Coating Inspection Header (Matches media_1791305330443.png) */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#262F40] text-slate-300 hover:text-white bg-[#202736] transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-bold text-white tracking-wide leading-tight uppercase font-mono">
              BG GROUP
            </h1>
            <span className="text-[9px] md:text-[10px] text-[#8F9CAE] font-medium leading-tight uppercase tracking-wider font-mono">
              OF PAINT AND COATING CONSULTANT
            </span>
          </div>
        </div>
      ) : isManpower ? (
        /* Mode 3: Manpower Suite Header (Matches media_1791302836632.png) */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#262F40] text-slate-300 hover:text-white bg-[#202736] transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-[15px] font-bold text-white tracking-tight leading-tight">
              Painting Project Estimation
            </h1>
            <span className="text-[10px] md:text-[11px] text-[#8F9CAE] font-medium leading-tight">
              Manpower Based • Industrial Cost Estimation
            </span>
          </div>
        </div>
      ) : isContractor ? (
        /* Mode 8: Coating Contractor Management Header (Matches media_1791306666911.png) */
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
              Home
            </h1>
            <span className="text-[10px] md:text-[11px] text-slate-400 font-mono leading-tight">
              BG Group Digital Platform
            </span>
          </div>
        </div>
      ) : isCalc ? (
        /* Mode: Coating Calculator Header Left (Matches Screenshot 1) */
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#F7941D] text-xs font-semibold text-slate-700 hover:text-[#F7941D] flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] rounded-full px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap shadow-2xs">
            Coating Calculator
          </div>
        </div>
      ) : isSpec ? (
        /* Mode: Specification Reading Header Left (Matches Screenshot 2) */
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#F7941D] text-xs font-semibold text-slate-700 hover:text-[#F7941D] flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] rounded-full px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap shadow-2xs">
            Coating Specification Reading
          </div>
        </div>
      ) : (
        /* Mode 2: Inner Engineering Module Header (e.g. Quick Unit Rate) */
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-[#7E8B99] font-medium">
            <button
              onClick={() => setActivePage('dashboard')}
              className="text-[#64748B] hover:text-[#D97706] font-mono text-[10px] md:text-[11px] uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
            >
              <span>HOME</span>
              <ChevronRight className="w-3 h-3 text-[#CBD5E1]" />
            </button>

            <span className="bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] font-mono font-bold text-[10px] md:text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap">
              {currentMod.crumb} &gt;
            </span>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-xs font-medium text-[#475569] shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-[#94A3B8]" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#475569] focus:outline-none cursor-pointer pr-1"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
            </select>
          </div>
        </div>
      )}

      {/* CENTER SEARCH (Only on Contractor mode matching media_1791306666911.png) */}
      {isContractor && (
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employees, projects, sites..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-[#F7941D] transition"
            />
          </div>
        </div>
      )}

      {/* CENTER ACTIONS FOR SPECIFICATION READING (Matches Screenshot 2) */}
      {isSpec && (
        <div className="hidden lg:flex items-center gap-1.5 mx-auto">
          <button
            onClick={() => handleActionClick('start-extraction')}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <span>✨</span>
            <span>Start Extraction</span>
          </button>
          <button
            onClick={() => handleActionClick('preview')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => handleActionClick('save-draft')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleActionClick('validate')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-[#16A34A] border border-[#E2E8F0] hover:border-emerald-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
          >
            <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Validate</span>
          </button>
          <button
            onClick={() => handleActionClick('register')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Register</span>
          </button>
          <button
            onClick={() => handleActionClick('reset')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-[#475569] hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* RIGHT SECTION */}
      {isContractor ? (
        /* Mode 8: Contractor Right Actions (Matches media_1791306666911.png) */
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <button
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D94F26] to-[#F7941D] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              GC
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="text-xs font-bold text-slate-800 block">Gaurav C.</span>
              <span className="text-[10px] text-slate-400 font-mono block">Planner / Admin</span>
            </div>
          </div>
        </div>
      ) : isHome ? (
        /* Mode 1: Platform Right Actions */
        <div className="flex items-center gap-3 shrink-0 ml-3">
          
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-lg text-xs font-mono text-[#64748B]">
            <button 
              onClick={() => handleZoomChange(-4)}
              className="hover:text-[#1B222C] transition cursor-pointer p-0.5"
              title="Zoom out"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-semibold w-7 text-center">{zoomLevel}%</span>
            <button 
              onClick={() => handleZoomChange(4)}
              className="hover:text-[#1B222C] transition cursor-pointer p-0.5"
              title="Zoom in"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Free Plan Pill */}
          <div className="bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] font-mono font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
            <span>FREE PLAN</span>
          </div>

          {/* Upgrade Button */}
          <button
            onClick={onOpenUpgrade}
            className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:opacity-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(247,148,29,0.3)] transition flex items-center gap-1 cursor-pointer"
          >
            <span>Upgrade</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* User Avatar */}
          <div 
            onClick={() => setActivePage('settings')}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer hover:opacity-90 transition font-mono"
            title="User Profile & Settings"
          >
            {userInitial}
          </div>

        </div>
      ) : isDarkSuite ? (
        /* Mode 3: Dark Suite Right Actions (Manpower / Blaster / Painter) */
        <div className="flex items-center gap-2 md:gap-2.5 shrink-0 ml-3">
          
          {/* Live System Badge: Amber/Brown Glow */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#382013] border border-[#7C4019] text-[#F7941D] text-[10px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D] animate-pulse"></span>
            <span>LIVE SYSTEM</span>
          </div>

          {/* Action Buttons Strip */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => handleActionClick('preview')}
              className="px-2.5 py-1 rounded-lg bg-[#202736] hover:bg-[#283244] text-[#CBD5E1] hover:text-white border border-[#2F394D] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => handleActionClick('save-draft')}
              className="px-2.5 py-1 rounded-lg bg-[#202736] hover:bg-[#283244] text-[#CBD5E1] hover:text-white border border-[#2F394D] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Save Draft</span>
            </button>

            {/* Validate Button (Omitted on Inspection per media_1791305330443.png; Green for Painter, Orange for Blaster/TSA/Manpower) */}
            {!isInspection && (
              isPainter ? (
                <button
                  onClick={() => handleActionClick('validate')}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  <span>Validate</span>
                </button>
              ) : (
                <button
                  onClick={() => handleActionClick('validate')}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#D94F26] to-[#E8700A] hover:brightness-110 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  <span>Validate</span>
                </button>
              )
            )}

            <button
              onClick={() => handleActionClick('register')}
              className="px-2.5 py-1 rounded-lg bg-[#202736] hover:bg-[#283244] text-[#CBD5E1] hover:text-white border border-[#2F394D] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Register</span>
            </button>

            <button
              onClick={() => handleActionClick('reset')}
              className="px-2.5 py-1 rounded-lg bg-[#202736] hover:bg-[#283244] text-[#CBD5E1] hover:text-rose-400 border border-[#2F394D] hover:border-rose-900/50 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      ) : isCalc ? (
        /* Mode: Coating Calculator Right Title (Matches Screenshot 1) */
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF5EA] text-[#F7941D] flex items-center justify-center font-bold text-sm shadow-2xs">
              📐
            </div>
            <span className="font-bold text-sm md:text-[15px] text-slate-900 whitespace-nowrap font-rajdhani tracking-wide">
              BG Coating Calculator
            </span>
          </div>
        </div>
      ) : isSpec ? (
        /* Mode: Specification Reading Right Title (Matches Screenshot 2) */
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => handleActionClick('preview')}
              className="px-2 py-1 rounded-lg bg-white border border-[#E2E8F0] text-xs shadow-2xs"
              title="Preview"
            >
              👁
            </button>
            <button
              onClick={() => handleActionClick('validate')}
              className="px-2 py-1 rounded-lg bg-white border border-[#E2E8F0] text-emerald-600 text-xs shadow-2xs"
              title="Validate"
            >
              ✓
            </button>
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-[#E6E8EC]">
            <div className="w-7 h-7 rounded-lg bg-[#FFF5EA] text-[#F7941D] flex items-center justify-center font-bold text-sm shadow-2xs">
              📋
            </div>
            <span className="font-bold text-sm md:text-[15px] text-slate-900 whitespace-nowrap font-rajdhani tracking-wide">
              Coating Specification Reading
            </span>
          </div>
        </div>
      ) : (
        /* Mode 2: Inner Module Right Actions */
        <div className="flex items-center gap-2 md:gap-2.5 shrink-0 ml-3">
          
          {/* Live System Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#ECFDF5] border border-[#D1FAE5] text-[#16A34A] text-[10px] font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>LIVE SYSTEM</span>
          </div>

          {/* Action Buttons Strip */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => handleActionClick('preview')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => handleActionClick('save-draft')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleActionClick('validate')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Validate</span>
            </button>

            <button
              onClick={() => handleActionClick('register')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Register</span>
            </button>

            <button
              onClick={() => handleActionClick('reset')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-[#475569] hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Reset</span>
            </button>
          </div>

          {/* Module Title on Right */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E6E8EC]">
            <div className="w-6 h-6 rounded-md bg-[#FFF5EA] text-[#F7941D] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs md:text-sm text-[#1B222C] whitespace-nowrap">
              {currentMod.title}
            </span>
          </div>

        </div>
      )}
    </header>
  );
}
