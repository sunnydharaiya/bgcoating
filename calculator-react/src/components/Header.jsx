import React, { useState } from 'react';
import { 
  Home,
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
  Minus,
  Plus,
  Search,
  ClipboardCheck,
  LogIn,
  HelpCircle
} from 'lucide-react';

export default function Header({ 
  activePage, 
  activeSubTool, 
  setActivePage,
  setActiveSubTool,
  setMobileSidebarOpen,
  onOpenHelp,
  onOpenUpgrade,
  onHeaderAction,
  isLoggedIn,
  onOpenAuthModal
}) {
  const [zoomLevel, setZoomLevel] = useState(96);
  const [lang, setLang] = useState('English');
  const [guideOpen, setGuideOpen] = useState(false);

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
  const isUnitRate = activePage === 'unit-rate-estimation' || activePage === 'cost-estimation';
  const isBlaster = activePage === 'blaster-qualification' || activePage === 'blaster';
  const isPainter = activePage === 'painter-qualification' || activePage === 'painter' || activePage === 'spray-painter-qualification' || activePage === 'spray-painter';
  const isTsa = activePage === 'tsa-qualification' || activePage === 'tsa';
  const isInspection = activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection' || activePage === 'inspection';
  const isContractor = activePage === 'contractor-management' || activePage === 'contractor';
  const isProcedure = activePage === 'coating-procedure' || activePage === 'procedure';
  const isDarkSuite = isManpower || isBlaster || isPainter || isTsa || isInspection;

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

  // Module Titles mapping for Breadcrumbs & Hierarchy
  const moduleInfo = {
    'unit-rate-estimation': {
      crumb: 'Quick Unit-Rate Estimation',
      title: 'Quick Unit-Rate Estimation'
    },
    'cost-estimation': {
      crumb: 'Quick Unit-Rate Estimation',
      title: 'Quick Unit-Rate Estimation'
    },
    'specification-reading': {
      crumb: 'Coating Specification Reading',
      title: 'Coating Specification Reading'
    },
    'design': {
      crumb: 'Coating Specification Reading',
      title: 'Coating Specification Reading'
    },
    'coating-procedure': {
      crumb: 'Coating Procedure (ITP)',
      title: 'Coating Procedure'
    },
    'procedure': {
      crumb: 'Coating Procedure (ITP)',
      title: 'Coating Procedure'
    },
    'coating-calculator': {
      crumb: 'Coating Calculator Suite',
      title: 'Coating Calculator'
    },
    'calc': {
      crumb: 'Coating Calculator Suite',
      title: 'Coating Calculator'
    },
    'manpower-estimation': {
      crumb: 'Manpower Project Estimator',
      title: 'Manpower Project Estimator'
    },
    'blaster-qualification': {
      crumb: 'Blaster Qualification',
      title: 'Blaster Qualification'
    },
    'blaster': {
      crumb: 'Blaster Qualification',
      title: 'Blaster Qualification'
    },
    'painter-qualification': {
      crumb: 'Spray Painter Qualification',
      title: 'Spray Painter Qualification'
    },
    'spray-painter-qualification': {
      crumb: 'Spray Painter Qualification',
      title: 'Spray Painter Qualification'
    },
    'spray-painter': {
      crumb: 'Spray Painter Qualification',
      title: 'Spray Painter Qualification'
    },
    'painter': {
      crumb: 'Spray Painter Qualification',
      title: 'Spray Painter Qualification'
    },
    'tsa-qualification': {
      crumb: 'TSA Qualification',
      title: 'TSA Qualification'
    },
    'tsa': {
      crumb: 'TSA Qualification',
      title: 'TSA Qualification'
    },
    'inspection-reporting': {
      crumb: 'Inspection Reporting',
      title: 'Inspection Reporting'
    },
    'qa-qc-inspection': {
      crumb: 'Inspection Reporting',
      title: 'Inspection Reporting'
    },
    'inspection': {
      crumb: 'Inspection Reporting',
      title: 'Inspection Reporting'
    },
    'contractor-management': {
      crumb: 'Contractor Management',
      title: 'Contractor Management'
    },
    'contractor': {
      crumb: 'Contractor Management',
      title: 'Contractor Management'
    },
    'academy-lms': {
      crumb: 'Training & Certification',
      title: 'Training & Certification'
    },
    'knowledge': {
      crumb: 'Knowledge Base',
      title: 'Knowledge Base'
    },
    'support': {
      crumb: 'Technical Support',
      title: 'Technical Support'
    },
    'settings': {
      crumb: 'Settings & Profile',
      title: 'Settings & Profile'
    }
  };

  const currentMod = moduleInfo[activePage] || {
    crumb: activePage ? activePage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Engineering Module',
    title: activePage ? activePage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Engineering Module'
  };

  const handleActionClick = (actionName) => {
    if (onHeaderAction) {
      onHeaderAction(actionName);
    } else {
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

  const getSubToolTitle = (page, subTool) => {
    if (!subTool || subTool === 'hub' || subTool === 'home' || subTool === 'overview') return null;
    if (procSectionNames[subTool]) return procSectionNames[subTool];

    const knownSubTools = {
      'project-info': '01. Project Info',
      'scope': '02. Scope',
      'blasting': '02. Blasting Cost',
      'painting': '03. Paint Application',
      'raw-material': '04. Raw Material',
      'worker-ctc': '05. Worker CTC',
      'abrasive-diesel': '06. Abrasive & Diesel',
      'summary': '07. Cost Summary',
      'register': 'Register',
      'report-register': 'Report Register',
      'report_register': 'Report Register',
      'report': 'Print Report',
      'preview': 'Preview Dossier',
      'xlprint': 'Print Quotation',
      'cost-matrix': '05. Unit-Rate Table',
      'revisions': '06. Revisions',
      'section-d': '03. Temp Data',
      'section-f': '04. Coating Design',
      'info': '01. Project & Specs',
      'checklist': '02. Checklist',
      'train': 'Training & Test',
      's1': 'Blasting & Priming',
      's2': '1st Coat',
      's3': '2nd Coat',
      's4': '3rd Coat',
      'photo': 'Photographic Report',
      'verdict': 'Verdict & Sign-off'
    };

    if (knownSubTools[subTool]) return knownSubTools[subTool];

    return subTool
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const subToolLabel = getSubToolTitle(activePage, activeSubTool);

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

  // ════════════════════════════════════════════════════════════════════════════
  // MODE: COATING PROCEDURE (Dedicated 2-Row Workflow Header)
  // ════════════════════════════════════════════════════════════════════════════
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
      <header className="bg-white border-b border-[#E6E8EC] sticky top-0 z-30 select-none shadow-2xs">
        {/* ROW 1: CLEAN BREADCRUMBS & UNIVERSAL USER CONTROLS */}
        <div className="h-12 md:h-13 px-4 md:px-6 flex items-center justify-between border-b border-[#F0F2F5]">
          {/* LEFT: BREADCRUMBS */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg border border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white transition cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#7E8B99] font-medium min-w-0">
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-600 hover:text-[#D97706] hover:bg-slate-100 flex items-center gap-1 transition cursor-pointer shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />

              <button
                onClick={() => setActiveSubTool ? setActiveSubTool('hub') : setActivePage('coating-procedure')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer shrink-0 ${
                  isProcedureHome
                    ? 'bg-[#FFF5EA] border-[#FDE3C7] text-[#D97706] font-bold'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#F7941D] text-slate-700 hover:text-[#F7941D]'
                }`}
              >
                <span>Painting Procedure</span>
              </button>

              {!isProcedureHome && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                  <span className="bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] font-bold text-xs px-2.5 py-1 rounded-lg shadow-2xs whitespace-nowrap truncate max-w-[200px]">
                    {currentSectionName}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* RIGHT: UNIVERSAL ZOOM & PROFILE CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
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

            {!isLoggedIn ? (
              <button
                onClick={onOpenAuthModal}
                className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:opacity-95 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenUpgrade}
                  className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:opacity-95 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <span className="hidden sm:inline">Upgrade</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <div 
                  onClick={() => setActivePage('settings')}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer hover:opacity-90 transition font-mono"
                  title="User Profile & Settings"
                >
                  {userInitial}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: PROGRESS STRIP & ACTIONS */}
        <div className="proc-progress-strip">
          <div className="proc-ps-left">
            <div className="hidden md:flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-xs font-medium text-[#475569] shadow-2xs shrink-0">
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

            <div 
              className="proc-ps-ring shrink-0" 
              style={{ background: `conic-gradient(#D96B1C ${procProgressPct * 3.6}deg, #EBDFCB ${procProgressPct * 3.6}deg)` }}
            >
              <span>{procProgressPct}%</span>
            </div>

            <div className="proc-ps-track-wrap hidden md:block min-w-0">
              <div className="proc-ps-label-row">
                <span className="proc-ps-title truncate">PROCEDURE PREPARATION PROGRESS</span>
                <span className="proc-ps-counts truncate">
                  <b>{completedSectionsCount}</b> sections complete · <b>{pendingSectionsCount}</b> pending
                </span>
              </div>
              <div className="proc-ps-track">
                <div className="proc-ps-fill" style={{ width: `${procProgressPct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="proc-ps-right">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF8F0] border border-[#BCE3C9] text-xs font-semibold text-[#1E9E50] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E50] animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-wider">LIVE SYSTEM</span>
            </div>

            <button
              onClick={() => handleActionClick('preview')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs shrink-0"
              title="Preview Procedure Dossier"
            >
              <Eye className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              onClick={() => handleActionClick('save-draft')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs shrink-0"
              title="Save Draft to Procedure Register"
            >
              <Save className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            <button
              onClick={() => handleActionClick('validate')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-[#16A34A] border border-[#E2E8F0] hover:border-emerald-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs shrink-0"
              title="Validate and Sign-off"
            >
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="hidden sm:inline">Validate</span>
            </button>

            <button
              onClick={() => handleActionClick('register')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1B222C] border border-[#E2E8F0] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs shrink-0"
              title="Open Procedure Register"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Register</span>
            </button>

            <button
              onClick={() => handleActionClick('reset')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-[#475569] hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs shrink-0"
              title="Reset All Procedure Fields"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <span className="proc-ps-status hidden sm:inline-block shrink-0" data-st={procStatus.toLowerCase().replace(' ', '-')}>
              {procStatus}
            </span>

            <button
              onClick={() => setGuideOpen(prev => !prev)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FBF1E2] border border-[#E3D2B8] text-[#8B0E16] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0"
              title="Toggle Section Completion Guide"
            >
              <span>☰ <span className="hidden sm:inline">Completion </span>Guide</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${guideOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* ROW 3: COMPLETION GUIDE PANEL */}
        {guideOpen && (
          <div className="proc-guide-panel animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="proc-gp-head">
              <span>🧭 Completion Guide — what is done, what is pending, what is required before approval</span>
              <span className="proc-gp-summary">
                {completedFieldsCount}/{totalFieldsCount} fields complete · {totalFieldsCount - completedFieldsCount} remaining
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
              Fields marked <span className="text-red-600 font-bold">*</span> are mandatory. Enter <b>NA</b> where not applicable.
            </div>
          </div>
        )}
      </header>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // UNIVERSAL UNIFIED GLOBAL HEADER (All Modules & Pages)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <header className={`h-14 md:h-15 ${
      isDarkSuite 
        ? 'bg-[#141A24] border-b border-[#242E3E] text-white' 
        : 'bg-white border-b border-[#E6E8EC] text-slate-800'
    } px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-2xs transition-colors duration-150`}>
      
      {/* LEFT SECTION: BREADCRUMBS & NAVIGATION */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(prev => !prev)}
          className={`md:hidden p-1.5 rounded-lg border transition cursor-pointer ${
            isDarkSuite 
              ? 'border-[#262F40] text-slate-300 hover:text-white bg-[#202736]' 
              : 'border-[#E6E8EC] text-[#4E5B6A] hover:border-[#F7941D] hover:text-[#F7941D] bg-white'
          }`}
          aria-label="Toggle Navigation"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Clean Breadcrumb Hierarchy */}
        {isHome ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF5EA] text-[#F7941D] flex items-center justify-center font-bold text-xs shadow-2xs">
              <Home className="w-3.5 h-3.5 text-[#F7941D]" />
            </div>
            <span className="font-bold text-xs md:text-sm text-slate-800 tracking-wide uppercase font-mono">
              Dashboard Overview
            </span>
          </div>
        ) : (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium min-w-0 flex-wrap sm:flex-nowrap">
            {/* Home Breadcrumb Link */}
            <button
              onClick={() => setActivePage('dashboard')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                isDarkSuite
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-[#D97706] hover:bg-slate-100'
              }`}
              title="Return to Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDarkSuite ? 'text-slate-600' : 'text-slate-300'}`} />

            {/* Active Module Name */}
            <button
              onClick={() => {
                if (activeSubTool && activeSubTool !== 'hub') {
                  setActiveSubTool('hub');
                } else {
                  setActivePage(activePage);
                }
              }}
              className={`px-2.5 py-0.5 rounded-md text-xs font-bold font-mono uppercase tracking-wide truncate max-w-[200px] sm:max-w-[320px] transition cursor-pointer ${
                isDarkSuite
                  ? 'bg-[#202736] border border-[#2D3748] text-amber-400 hover:text-white'
                  : 'bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706] hover:bg-[#FEE9C7]'
              }`}
              title={currentMod.title}
            >
              {currentMod.title}
            </button>

            {/* Sub-tool / Section breadcrumb when active */}
            {subToolLabel && (
              <>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 hidden sm:inline ${isDarkSuite ? 'text-slate-600' : 'text-slate-300'}`} />
                <span className={`hidden sm:inline px-2 py-0.5 rounded-md text-[11px] font-mono truncate max-w-[200px] ${
                  isDarkSuite 
                    ? 'text-slate-300 bg-slate-800/80 border border-slate-700' 
                    : 'text-slate-600 bg-slate-100 border border-slate-200'
                }`}>
                  {subToolLabel}
                </span>
              </>
            )}
          </nav>
        )}
      </div>

      {/* CENTER SECTION */}
      {isContractor ? (
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
      ) : (
        <div className="flex-1" />
      )}

      {/* RIGHT SECTION: UNIVERSAL CONTROLS */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
        
        {/* Universal Zoom Controls */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-mono ${
          isDarkSuite
            ? 'bg-[#202736] border border-[#2D3748] text-slate-300'
            : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]'
        }`}>
          <button 
            onClick={() => handleZoomChange(-4)}
            className={`transition cursor-pointer p-0.5 ${isDarkSuite ? 'hover:text-white' : 'hover:text-[#1B222C]'}`}
            title="Zoom out"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-semibold w-7 text-center">{zoomLevel}%</span>
          <button 
            onClick={() => handleZoomChange(4)}
            className={`transition cursor-pointer p-0.5 ${isDarkSuite ? 'hover:text-white' : 'hover:text-[#1B222C]'}`}
            title="Zoom in"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Help FAQ Drawer Trigger */}
        <button
          onClick={onOpenHelp}
          className={`p-1.5 rounded-lg border transition cursor-pointer hidden sm:flex items-center justify-center ${
            isDarkSuite
              ? 'border-[#2D3748] bg-[#202736] text-slate-400 hover:text-white hover:border-slate-500'
              : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
          title="Help &amp; Knowledge FAQ"
          aria-label="Help &amp; FAQ"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* User Account Controls */}
        {!isLoggedIn ? (
          <button
            onClick={onOpenAuthModal}
            className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:opacity-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* Free Plan / Pro Pill */}
            <div className={`font-mono font-bold text-[10px] px-2.5 py-1 rounded-full hidden sm:flex items-center gap-1.5 ${
              isDarkSuite
                ? 'bg-[#382013] border border-[#7C4019] text-[#F7941D]'
                : 'bg-[#FFF5EA] border border-[#FDE3C7] text-[#D97706]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
              <span>FREE PLAN</span>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={onOpenUpgrade}
              className="bg-gradient-to-r from-[#F7941D] to-[#E8700A] hover:opacity-95 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Upgrade to Pro Plan"
            >
              <span className="hidden sm:inline">Upgrade</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* User Avatar */}
            <div 
              onClick={() => setActivePage('settings')}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer hover:opacity-90 transition font-mono"
              title="User Profile &amp; Settings"
            >
              {userInitial}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
