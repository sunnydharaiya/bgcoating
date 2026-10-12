import React, { useState, useEffect } from 'react';
import {
  Home,
  Calculator,
  FileText,
  ClipboardCheck,
  Coins,
  Building2,
  HelpCircle,
  MoreVertical,
  X,
  Eye,
  Printer,
  Shield,
  Layers,
  Thermometer,
  Flame,
  Palette,
  FlaskConical,
  History,
  CheckCircle2,
  Sparkles,
  SquareDot,
  Users,
  HardHat,
  BarChart3,
  Globe,
  Phone,
  LayoutDashboard,
  Paintbrush,
  FileSpreadsheet,
  Droplets,
  ChevronRight,
  ChevronDown,
  FileCheck2,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Folder,
  Boxes,
  TrendingUp,
  Package,
  Hammer,
  GraduationCap,
  Settings,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  activeSubTool,
  setActiveSubTool,
  onNavigate,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  isLoggedIn,
  onOpenAuthModal
}) {
  const [estimationExpanded, setEstimationExpanded] = useState(false);
  const [docExpanded, setDocExpanded] = useState(false);
  const [trainingExpanded, setTrainingExpanded] = useState(false);

  // Read authenticated user state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { name: 'User', role: 'FREE PLAN', email: '' };
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const stored = localStorage.getItem('bg_user');
        if (stored) setCurrentUser(JSON.parse(stored));
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

  const handleNav = (page, subTool = 'hub') => {
    if (onNavigate) {
      onNavigate(page, subTool);
    } else {
      setActivePage(page);
      if (subTool && setActiveSubTool) setActiveSubTool(subTool);
    }
    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
  };

  // Unit Rate Sections
  const unitRateSections = [
    { id: 'project-info', label: 'Project Information' },
    { id: 'scope', label: 'Company Scope' },
    { id: 'section-d', label: 'Operating & Design Temperature' },
    { id: 'section-f', label: 'Coating System Design' },
    { id: 'cost-matrix', label: 'Unit-Rate Estimation Table' },
    { id: 'est-input', label: 'Estimation Input', target: 'cost-matrix' },
    { id: 'est-progress', label: 'Estimation Progress', target: 'cost-matrix' },
    { id: 'paint-cost', label: 'Paint Application Cost', target: 'cost-matrix' },
    { id: 'misc-cost', label: 'Miscellaneous Cost', target: 'cost-matrix' },
    { id: 'revisions', label: 'Revision History' },
    { id: 'validate', label: 'Validate / Save Draft', target: 'cost-matrix' }
  ];

  // Manpower Estimation Sections (Matches media_1791302836632.png)
  const manpowerSections = [
    { id: 'project-info', label: 'Project Information', icon: FileText },
    { id: 'blasting', label: 'Blasting Cost', icon: Flame },
    { id: 'painting', label: 'Paint Application', icon: Paintbrush },
    { id: 'raw-material', label: 'Paint Raw Material', icon: Layers },
    { id: 'summary', label: 'Front Page Summary', icon: FileSpreadsheet },
    { id: 'validate', label: 'Validate / Save Draft', icon: CheckCircle2, isAction: true },
    { id: 'worker-ctc', label: 'Reference: Manpower CTC', icon: Users }
  ];

  // Blaster Qualification Sections (Matches media_1791304029525.png)
  const blasterSections = [
    { id: 'info', label: 'Project & Operator' },
    { id: 'train', label: 'Training & Test' },
    { id: 'checklist', label: 'Assessment Checklist', badge: '0%' },
    { id: 'blasting', label: 'Blasting Process' },
    { id: 'photo', label: 'Photographic Report', badge: '0%' },
    { id: 'verdict', label: 'Verdict & Approval' }
  ];

  // Spray Painter Qualification Sections (Matches media_1791304046270.png)
  const painterSections = [
    { id: 'info', label: 'Project & Painter' },
    { id: 'train', label: 'Training' },
    { id: 'checklist', label: 'Assessment Checklist', badge: '0%' },
    { id: 's1', label: 'Blasting & Priming' },
    { id: 's2', label: '1st Coat' },
    { id: 's3', label: '2nd Coat' },
    { id: 's4', label: '3rd Coat' },
    { id: 'photo', label: 'Photographic Report', badge: '0%' },
    { id: 'verdict', label: 'Verdict & Approval' }
  ];

  // TSA Qualification Sections (Matches media_1791305324466.png)
  const tsaSections = [
    { id: 'project-info', label: 'Project & TSA Operator', hasChevron: true },
    { id: 'checklist', label: 'Assessment Checklist', badge: '0%' },
    { id: 's1', label: 'Blasting & Thermal Spray', hasChevron: true },
    { id: 's2', label: '1st Coat', hasChevron: true },
    { id: 's3', label: '2nd Coat', hasChevron: true },
    { id: 's4', label: '3rd Coat', hasChevron: true },
    { id: 'photo-report', label: 'Photographic Report', badge: '0%' }
  ];

  // Spec Reading Sections
  const specSections = [
    { id: 'scope', label: 'Project Scope (A & B)' },
    { id: 'environment', label: 'Environment & Corrosivity (C)' },
    { id: 'temperatures', label: 'Operating Temperatures (D)' },
    { id: 'special_systems', label: 'Special Systems (E)' },
    { id: 'coating_design', label: 'Coating System Design (F)' },
    { id: 'testing_qc', label: 'Testing & QC Requirements (G)' },
    { id: 'manufacturers', label: 'Approved Manufacturers (H)' },
    { id: 'revisions_notes', label: 'Revision Notes (I/N)' }
  ];

  // Procedure Sections
  const procSections = [
    { id: 'cover-revision', label: 'Cover & Revisions' },
    { id: 'scope', label: 'Scope of Work' },
    { id: 'ref-docs', label: 'Reference Documents' },
    { id: 'standards', label: 'Applicable Standards' },
    { id: 'exclusions', label: 'Project Exclusions' },
    { id: 'safety', label: 'Safety & Environmental' },
    { id: 'surface-prep', label: 'Surface Preparation' },
    { id: 'coating-app', label: 'Coating Application' },
    { id: 'repair-plan', label: 'Repair Plan' },
    { id: 'manufacturers', label: 'Approved Manufacturers' },
    { id: 'annexure-coating', label: 'Annexure - Coating System' },
    { id: 'annexure-inspection', label: 'Annexure - Inspection Plan' }
  ];

  // Coating Calculator Categories (All 44 Tools: 16 Standard + 28 PRO)
  const calcTools = [
    // Paint Suite (7 Tools)
    { id: 'wft_range', label: 'WFT Range Calculator' },
    { id: 'dft', label: 'DFT Calculator' },
    { id: 'coverage', label: 'Paint Coverage' },
    { id: 'paint_consumption', label: 'Paint Consumption' },
    { id: 'blasting_loss', label: 'Blasting Dead Volume Loss' },
    { id: 'mixing_ratio', label: 'Mixing Ratio & Thinner' },
    { id: 'cost_per_area', label: 'Cost Per Area' },

    // Surface Area Suite (6 Tools)
    { id: 'sa-pipe', label: 'Pipe Spool Area' },
    { id: 'sa-tank', label: 'Storage Tank Area' },
    { id: 'sa-wws', label: 'Structure Weight Area' },
    { id: 'sa-plate', label: 'Flat Plate Area' },
    { id: 'sa-de', label: 'Dished End Area' },
    { id: 'sa-vessel', label: 'Vessel & Equipment Area' },

    // Abrasives & Salt (3 Tools)
    { id: 'ab-garnet', label: 'Garnet Abrasive Consumption' },
    { id: 'ab-cslag', label: 'Copper Slag Consumption' },
    { id: 'salt-main', label: 'Bresle Salt Test' },

    // Executive PRO Suite (28 Tools across 12 Sections)
    { id: 'vs-tds', label: 'VS · TDS Verification' },
    { id: 'vs-den', label: 'VS · Density Verification' },
    { id: 'vs-lab', label: 'VS · Lab ASTM D2697' },
    { id: 'pro-recon', label: 'Paint Reconciliation' },
    { id: 'pro-lcc', label: 'Coating Life Cycle Cost (LCC)' },
    { id: 'pro-abp', label: 'Abrasive Size & Blast Profile' },
    { id: 'pro-arc', label: 'Abrasive Recycling' },
    { id: 'pro-dcc', label: 'Dust Collector Capacity' },
    { id: 'pro-saw', label: 'Surface Area & Steel Weight' },
    { id: 'qa-pa2', label: 'DFT Compliance — SSPC-PA 2' },
    { id: 'qa-iso', label: 'DFT Compliance — ISO 19840' },
    { id: 'qa-hol', label: 'Holiday Test Voltage' },
    { id: 'ce-rate', label: 'Corrosion Rate' },
    { id: 'ce-life', label: 'Coating Life Prediction' },
    { id: 'tsa-wire', label: 'TSA Wire Consumption' },
    { id: 'tsa-cov', label: 'TSA Area Coverage' },
    { id: 'tsa-eff', label: 'TSA Deposition Efficiency' },
    { id: 'tsa-thk', label: 'TSA Thickness Verification' },
    { id: 'tsa-prod', label: 'TSA Productivity' },
    { id: 'tsa-cost', label: 'TSA Cost Estimation' },
    { id: 'pfp-mat', label: 'PFP Material Consumption' },
    { id: 'pfp-thk', label: 'PFP Thickness (Fire Rating)' },
    { id: 'pfp-den', label: 'PFP Density Verification' },
    { id: 'pfp-mesh', label: 'PFP Reinforcement Mesh' },
    { id: 'pfp-cost', label: 'PFP Cost Breakdown' },
    { id: 'pfp-rep', label: 'PFP Repair Quantity' },
    { id: 'bid-proc', label: 'Paint Procurement Quantity' },
    { id: 'bid-comp', label: 'Multi-Manufacturer Bid Comparison' }
  ];

  return (
    <>
      {/* Desktop Sidebar Rail */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#181E29] border-r border-[#262F40] shrink-0 select-none shadow-md z-30">
        
        {/* BRAND HEADER */}
        <div 
          onClick={() => handleNav('dashboard')} 
          className="p-4 border-b border-white/[0.08] cursor-pointer hover:bg-white/[0.02] transition"
        >
          {isHome ? (
            /* Mode 1: Platform Branding (Screenshots 1 & 2) */
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-white text-[15px] tracking-tight block">
                  BG CoatingOS™
                </span>
                <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#F7941D] uppercase block">
                  PLATFORM
                </span>
              </div>
            </div>
          ) : isManpower ? (
            /* Mode 3: Manpower Suite Branding (Matches media_1791302836632.png) */
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white text-[14px] tracking-wide block">
                    BG GROUP
                  </span>
                  <span className="text-[9px] font-bold tracking-wider text-[#F7941D] uppercase block">
                    COATING CONSULTANT
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight pt-1">
                Manpower-based painting project estimation &amp; reporting platform.
              </p>
            </div>
          ) : (isBlaster || isPainter || isTsa || isInspection || isContractor) ? (
            /* Mode 4: Dark Suite Branding (Matches media_1791304029525, media_1791304046270, media_1791305324466, media_1791305330443, media_1791306666911) */
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-white text-[14px] tracking-wide block">
                  BG GROUP
                </span>
                <span className="text-[9px] font-bold tracking-wider text-[#F7941D] uppercase block">
                  PAINT &amp; COATING CONSULTANT
                </span>
              </div>
            </div>
          ) : isCalc ? (
            /* Mode: Coating Calculator Suite Branding (Screenshot 1 / calc_side.html) */
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-white text-[14px] tracking-wide block">
                  <span className="text-[#F7941D]">BG</span> GROUP
                </span>
                <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase block">
                  COATING CONSULTANTS
                </span>
              </div>
            </div>
          ) : isProcedure ? (
            /* Mode: Painting Procedure Branding (Matches media_1791472985773_f56bf798.png) */
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white text-[14px] tracking-wide block font-mono">
                    <span className="text-[#F7941D]">BG</span> CoatingOS™
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-[#F7941D] uppercase block font-mono">
                    PLATFORM
                  </span>
                </div>
              </div>
            </div>
          ) : isSpec ? (
            /* Mode: Coating Specification Reading Branding (Screenshot 2 / design_side.html) */
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white text-[14px] tracking-wide block">
                    <span className="text-[#F7941D]">BG</span> GROUP
                  </span>
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase block">
                    COATING CONSULTANTS
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight pt-1">
                Paint &amp; Coating Specification Reading, validation &amp; reporting platform.
              </p>
            </div>
          ) : (
            /* Mode 2: Unit-Rate / Engineering Suite Branding (Screenshot 3) */
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white text-[14px] tracking-wide block">
                    BG GROUP
                  </span>
                  <span className="text-[9px] font-bold tracking-wider text-[#F7941D] uppercase block">
                    COATING CONSULTANT
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight pt-1">
                Quick unit-rate estimation, validation &amp; reporting platform
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          
          {isHome ? (
            /* ========================================================
               PLATFORM NAVIGATION (When on Home / Dashboard)
               Matches media_1791308020542.png Organogram Structure
               ======================================================== */
            <div className="space-y-4">
              <div>
                <div className="px-3 mb-2 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  MAIN NAVIGATION
                </div>

                <nav className="space-y-1">
                  {/* Home (Active) */}
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#2D2319] border border-[#5E4226] text-white font-medium text-[13px] shadow-xs cursor-pointer transition"
                  >
                    <Home className="w-4 h-4 text-[#F7941D] shrink-0" />
                    <span>Home</span>
                  </button>

                  {/* Module 1: Coating Calculator */}
                  <button
                    onClick={() => handleNav('coating-calculator')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] text-[13px] font-medium cursor-pointer transition"
                  >
                    <Calculator className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">Coating Calculator</span>
                  </button>

                  {/* Module 2: Specification Reading */}
                  <button
                    onClick={() => handleNav('specification-reading')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] text-[13px] font-medium cursor-pointer transition"
                  >
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">Specification Reading</span>
                  </button>

                  {/* Module 3: Coating Procedure */}
                  <button
                    onClick={() => handleNav('coating-procedure')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] text-[13px] font-medium cursor-pointer transition"
                  >
                    <ClipboardCheck className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">Coating Procedure</span>
                  </button>

                  {/* Module 4: Estimation (Expandable / Multi-Tool) */}
                  <div>
                    <button
                      onClick={() => setEstimationExpanded(prev => !prev)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition ${
                        estimationExpanded ? 'text-white bg-white/[0.06]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Coins className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">Estimation</span>
                      </div>
                      {estimationExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {estimationExpanded && (
                      <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
                        <button
                          onClick={() => handleNav('unit-rate-estimation')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          Quick Unit-Rate Estimation
                        </button>
                        <button
                          onClick={() => handleNav('manpower-estimation')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          Painting Project Estimation (Manpower)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Module 5: Documentation / Report (Expandable) */}
                  <div>
                    <button
                      onClick={() => setDocExpanded(prev => !prev)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition ${
                        docExpanded ? 'text-white bg-white/[0.06]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileSpreadsheet className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">Documentation / Report</span>
                      </div>
                      {docExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {docExpanded && (
                      <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
                        <button
                          onClick={() => handleNav('inspection-reporting', 'hub')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          Coating Inspection &amp; Reporting
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Module 6: Contractor Management */}
                  <button
                    onClick={() => handleNav('contractor-management', 'hub')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] text-[13px] font-medium cursor-pointer transition"
                  >
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">Contractor Management</span>
                  </button>

                  {/* Module 7: Training & Certification (Expandable) */}
                  <div>
                    <button
                      onClick={() => setTrainingExpanded(prev => !prev)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition ${
                        trainingExpanded ? 'text-white bg-white/[0.06]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">Training &amp; Certification</span>
                      </div>
                      {trainingExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {trainingExpanded && (
                      <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
                        <button
                          onClick={() => handleNav('blaster', 'hub')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          Blaster Qualification
                        </button>
                        <button
                          onClick={() => handleNav('painter', 'hub')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          Painter Qualification
                        </button>
                        <button
                          onClick={() => handleNav('tsa', 'hub')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          TSA Operator Qualification
                        </button>
                        <button
                          onClick={() => handleNav('academy-lms')}
                          className="w-full text-left py-1.5 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer truncate"
                        >
                          Training Academy (LMS)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Module 8: AI Assistant */}
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('bg_open_ai_modal'));
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] text-[13px] font-medium cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate">AI Assistant</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      AI
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          ) : isManpower ? (
            /* ========================================================
               MANPOWER MODULE NAVIGATION (Matches media_1791302836632.png)
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Section Banner: Reddish Orange */}
              <button
                onClick={() => handleNav('manpower-estimation', 'hub')}
                className="w-full bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-xs cursor-pointer text-left"
              >
                <FileText className="w-4 h-4 text-white shrink-0" />
                <span className="font-semibold text-xs text-white truncate">
                  Estimation — Manpower Based
                </span>
              </button>

              {/* GROUP 1: ESTIMATION SECTIONS */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  ESTIMATION SECTIONS
                </div>

                <nav className="space-y-0.5">
                  {manpowerSections.map((sec) => {
                    const isActive = activeSubTool === sec.id;
                    const Icon = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          if (sec.id === 'validate') {
                            window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'validate' } }));
                          } else {
                            handleNav('manpower-estimation', sec.id);
                          }
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{sec.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-600">•</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 2: REGISTER & OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  REGISTER &amp; OUTPUT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('manpower-estimation', 'register')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Report Register</span>
                  </button>

                  <button
                    onClick={() => handleNav('manpower-estimation', 'hub')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dashboard</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('manpower-estimation', 'preview')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleNav('manpower-estimation', 'report')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span>Print</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 3: CONFIGURATION */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  CONFIGURATION
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('manpower-estimation', 'company-details')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Company Details</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('manpower-estimation', 'watermark')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-slate-400" />
                      <span>Watermark</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          ) : isBlaster ? (
            /* ========================================================
               BLASTER MODULE NAVIGATION (Matches media_1791304029525.png)
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Home Banner: Reddish Orange */}
              <button
                onClick={() => handleNav('blaster', 'hub')}
                className="w-full bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white rounded-xl px-3.5 py-2 flex items-center justify-between shadow-xs cursor-pointer text-left font-semibold text-xs"
              >
                <span>Home</span>
                <span className="text-white/80 text-xs">—</span>
              </button>

              {/* GROUP 1: BLASTER / OPERATOR QUALIFICATION */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  BLASTER / OPERATOR QUALIFICATION
                </div>

                <nav className="space-y-0.5">
                  {blasterSections.map((sec) => {
                    const isActive = activeSubTool === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('blaster', sec.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        {sec.badge ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {sec.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 2: REGISTERS */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  REGISTERS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('blaster', 'register')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'register'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Report Register</span>
                  </button>
                </nav>
              </div>

              {/* GROUP 3: OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  OUTPUT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('blaster', 'preview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'preview'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleNav('blaster', 'report')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Print Report</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 4: BRANDING */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  BRANDING
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('blaster', 'company-details')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'company-details'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Company Details</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                        PRO
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('blaster', 'watermark')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'watermark'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Watermark Removal</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          ) : isPainter ? (
            /* ========================================================
               PAINTER MODULE NAVIGATION (Matches media_1791304046270.png)
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Section Banner: Orange gradient Home button */}
              <button
                onClick={() => handleNav('painter', 'hub')}
                className="w-full bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white rounded-xl px-3.5 py-2 flex items-center justify-between shadow-xs cursor-pointer text-left font-semibold text-xs"
              >
                <span>Home</span>
                <span className="text-white/80 text-xs">—</span>
              </button>

              {/* GROUP 1: SPRAY PAINTER QUALIFICATION */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  SPRAY PAINTER QUALIFICATION
                </div>

                <nav className="space-y-0.5">
                  {painterSections.map((sec) => {
                    const isActive = activeSubTool === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('painter', sec.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        {sec.badge ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {sec.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 2: REGISTERS */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  REGISTERS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('painter', 'register')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'register'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Report Register</span>
                  </button>
                </nav>
              </div>

              {/* GROUP 3: OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  OUTPUT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('painter', 'preview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'preview'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleNav('painter', 'report')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Print Report</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 4: BRANDING */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  BRANDING
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('painter', 'company-details')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'company-details'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Company Details</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                        PRO
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('painter', 'watermark')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'watermark'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Watermark Removal</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          ) : isTsa ? (
            /* ========================================================
               TSA MODULE NAVIGATION (Matches media_1791305324466.png)
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Section Banner: Orange gradient Home button */}
              <button
                onClick={() => handleNav('tsa', 'hub')}
                className="w-full bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white rounded-xl px-3.5 py-2 flex items-center justify-between shadow-xs cursor-pointer text-left font-semibold text-xs"
              >
                <span>Home</span>
                <span className="text-white/80 text-xs">—</span>
              </button>

              {/* GROUP 1: TSA OPERATOR QUALIFICATION */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  TSA OPERATOR QUALIFICATION
                </div>

                <nav className="space-y-0.5">
                  {tsaSections.map((sec) => {
                    const isActive = activeSubTool === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('tsa', sec.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        {sec.badge ? (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                            {sec.badge}
                          </span>
                        ) : sec.hasChevron ? (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 2: REGISTERS */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  REGISTERS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('tsa', 'register')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'register'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Report Register</span>
                  </button>
                </nav>
              </div>

              {/* GROUP 3: OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  OUTPUT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('tsa', 'preview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'preview'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleNav('tsa', 'report')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Print Report</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 4: BRANDING */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  BRANDING
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('tsa', 'company-details')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'company-details'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Company Details</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                        PRO
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('tsa', 'watermark')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'watermark'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Watermark Removal</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                        PRO
                      </span>
                      <span className="text-slate-500 text-xs">—</span>
                    </div>
                  </button>
                </nav>
              </div>

            </div>
          ) : isInspection ? (
            /* ========================================================
               COATING INSPECTION NAVIGATION (Matches media_1791305330443.png)
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Home Banner: Inspection — Home */}
              <button
                onClick={() => handleNav('inspection-reporting', 'hub')}
                className={`w-full ${activeSubTool === 'hub' ? 'bg-[#2A231C] border border-[#5E4226] text-white shadow-xs' : 'text-slate-300 hover:bg-white/[0.04]'} rounded-xl px-3 py-2 flex items-center gap-2.5 cursor-pointer text-left font-semibold text-xs transition`}
              >
                <div className="w-4 h-4 rounded bg-[#E8700A]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-[#F7941D]" />
                </div>
                <span className="truncate">Inspection — Home</span>
              </button>

              {/* GROUP 1: COATING / PAINTING REPORT */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  COATING / PAINTING REPORT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('inspection-reporting', 's1')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      (activeSubTool === 's1' || activeSubTool === 's2' || activeSubTool === 's3' || activeSubTool === 's4' || activeSubTool === 'coating')
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>Coating Report</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#F7941D]" />
                  </button>
                </nav>
              </div>

              {/* GROUP 2: ADHESION TEST */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  ADHESION TEST
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('inspection-reporting', 'pull')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      (activeSubTool === 'pull' || activeSubTool === 'cross' || activeSubTool === 'adhesion')
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>Adhesion Test</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#F7941D]" />
                  </button>
                </nav>
              </div>

              {/* GROUP 3: REFERENCES & STANDARDS */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  REFERENCES &amp; STANDARDS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('inspection-reporting', 'std')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      (activeSubTool === 'std' || activeSubTool === 'refp' || activeSubTool === 'refc')
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      <span>References</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#F7941D]" />
                  </button>
                </nav>
              </div>

              {/* GROUP 4: REGISTERS */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  REGISTERS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('inspection-reporting', 'report_register')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report_register' || activeSubTool === 'register'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
                      <span>Report Register</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('inspection-reporting', 'rwkreg')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'rwkreg'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Rework Register</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 5: OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  OUTPUT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('inspection-reporting', 'preview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'preview'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>Preview</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('inspection-reporting', 'report')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report' || activeSubTool === 'print'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Print</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('inspection-reporting', 'dashboard')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'dashboard'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dashboard</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 6: BRANDING */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  BRANDING
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('inspection-reporting', 'company-details')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'company-details' || activeSubTool === 'company'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Company Details</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('inspection-reporting', 'master')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'master'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Master List</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('inspection-reporting', 'watermark')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'watermark'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span>Watermark Removal</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          ) : isContractor ? (
            /* ========================================================
               COATING CONTRACTOR MANAGEMENT NAVIGATION
               Matches media_1791306666911.png
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Home / Landing Banner */}
              <button
                onClick={() => handleNav('contractor-management', 'hub')}
                className={`w-full ${
                  activeSubTool === 'hub' || !activeSubTool
                    ? 'bg-[#2A231C] border border-[#5E4226] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                } rounded-xl px-3 py-2 flex items-center gap-2.5 cursor-pointer text-left font-semibold text-xs transition`}
              >
                <div className="w-4 h-4 rounded bg-[#E8700A]/20 flex items-center justify-center shrink-0">
                  <Home className="w-3 h-3 text-[#F7941D]" />
                </div>
                <span className="truncate">Home / Landing</span>
              </button>

              {/* GROUP 1: DAILY OPERATIONS */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  DAILY OPERATIONS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('contractor-management', 'daily-progress')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'daily-progress'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
                      <span>Daily Progress Update</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('contractor-management', 'stock-update')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'stock-update'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Boxes className="w-3.5 h-3.5 text-[#F7941D]" />
                      <span>Monthly Stock Update</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* GROUP 2: MASTER & SETUP */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  MASTER &amp; SETUP
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('contractor-management', 'master-data')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'master-data' || activeSubTool === 'master'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-amber-500" />
                      <span>Master Data</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </nav>
              </div>

              {/* GROUP 3: ANALYTICS */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  ANALYTICS
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('contractor-management', 'executive-dashboard')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'executive-dashboard'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Executive Dashboard</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('contractor-management', 'daily-dashboard')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'daily-dashboard'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Daily Progress Dashboard</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('contractor-management', 'stock-dashboard')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'stock-dashboard'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-sky-400" />
                      <span>Stock / Inventory Dashboard</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* GROUP 4: REFERENCES & ADMIN */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[#E89A3C] uppercase tracking-widest">
                  REFERENCES &amp; ADMIN
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('knowledge')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      <span>Coating References</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleNav('specification-reading')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <Hammer className="w-3.5 h-3.5 text-slate-400" />
                    <span>Surface Treatment</span>
                  </button>

                  <button
                    onClick={() => handleNav('coating-calculator')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>UOM Library</span>
                  </button>

                  <button
                    onClick={() => handleNav('knowledge')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Standards (AMPP/NACE/SSPC)</span>
                  </button>

                  <button
                    onClick={() => handleNav('contractor-management', 'settings')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Boxes className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Backup / Restore</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('contractor-management', 'company')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Company &amp; Branding</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          ) : isCalc ? (
            /* ========================================================
               COATING CALCULATOR NAVIGATION (Matches Screenshot 1 / calc_side.html)
               ======================================================== */
            <div className="space-y-4">
              {/* Dashboard Link */}
              <button
                onClick={() => handleNav('coating-calculator', 'hub')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                  !activeSubTool || activeSubTool === 'hub'
                    ? 'text-white bg-[#F7941D]/20 border border-[#F7941D]/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-sm">🏠</span>
                <span>Dashboard</span>
              </button>

              {/* SECTION: PAINT CALCULATORS */}
              <div>
                <div className="px-3 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  PAINT CALCULATORS
                </div>
                <button
                  onClick={() => handleNav('coating-calculator', 'sp-cov')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><span>🖌️</span> Paint Suite</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">7</span>
                </button>
                <nav className="space-y-0.5 mt-0.5">
                  {[
                    { id: 'sp-cov', label: 'Coverage' },
                    { id: 'sp-pc', label: 'WFT Range' },
                    { id: 'sp-dft', label: 'DFT' },
                    { id: 'sp-cons', label: 'Paint Consumption' },
                    { id: 'sp-bl', label: 'Blasting Loss' },
                    { id: 'sp-mx', label: 'Mixing Ratio' },
                    { id: 'sp-cost', label: 'Cost per Area' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav('coating-calculator', item.id)}
                      className={`w-full text-left pl-8 pr-3 py-1 rounded-lg text-xs transition cursor-pointer block ${
                        activeSubTool === item.id
                          ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* SECTION: SURFACE AREA */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  SURFACE AREA
                </div>
                <button
                  onClick={() => handleNav('coating-calculator', 'sa-pipe')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><span>📐</span> Surface Area</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">6</span>
                </button>
                <nav className="space-y-0.5 mt-0.5">
                  {[
                    { id: 'sa-pipe', label: 'Pipe' },
                    { id: 'sa-tank', label: 'Tank' },
                    { id: 'sa-wws', label: 'Structure' },
                    { id: 'sa-plate', label: 'Plate' },
                    { id: 'sa-de', label: 'Dished End' },
                    { id: 'sa-vessel', label: 'Vessel' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav('coating-calculator', item.id)}
                      className={`w-full text-left pl-8 pr-3 py-1 rounded-lg text-xs transition cursor-pointer block ${
                        activeSubTool === item.id
                          ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* SECTION: ABRASIVE CONSUMPTION */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  ABRASIVE CONSUMPTION
                </div>
                <button
                  onClick={() => handleNav('coating-calculator', 'ab-garnet')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><span>💎</span> Abrasives</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">2</span>
                </button>
                <nav className="space-y-0.5 mt-0.5">
                  {[
                    { id: 'ab-garnet', label: 'Garnet' },
                    { id: 'ab-cslag', label: 'Copper Slag' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav('coating-calculator', item.id)}
                      className={`w-full text-left pl-8 pr-3 py-1 rounded-lg text-xs transition cursor-pointer block ${
                        activeSubTool === item.id
                          ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* SECTION: SALT TEST */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  SALT TEST
                </div>
                <button
                  onClick={() => handleNav('coating-calculator', 'salt-main')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><span>🧂</span> Salt Test</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">1</span>
                </button>
                <nav className="space-y-0.5 mt-0.5">
                  <button
                    onClick={() => handleNav('coating-calculator', 'salt-main')}
                    className={`w-full text-left pl-8 pr-3 py-1 rounded-lg text-xs transition cursor-pointer block ${
                      activeSubTool === 'salt-main'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    Bresle Salt Test
                  </button>
                </nav>
              </div>

              {/* SECTION: EXECUTIVE COATING CALCULATION - PRO */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  EXECUTIVE COATING CALCULATION – PRO
                </div>
                <button
                  onClick={() => handleNav('coating-calculator', 'vs-tds')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>👑</span> Executive PRO
                    {!isUserPro && (
                      <span className="text-[10px] text-amber-400 font-mono">🔒</span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D] font-bold">28</span>
                </button>
                
                <div className="space-y-2 mt-1">
                  {[
                    {
                      group: '1. Volume Solids Calculator',
                      items: [
                        { id: 'vs-tds', label: 'Volume Solids — TDS' },
                        { id: 'vs-den', label: 'Volume Solids — Density' },
                        { id: 'vs-lab', label: 'Volume Solids — Lab D2697' }
                      ]
                    },
                    {
                      group: '2. Paint Reconciliation Calculator',
                      items: [
                        { id: 'pro-recon', label: 'Theoretical vs Actual' }
                      ]
                    },
                    {
                      group: '3. Coating Life Cycle Cost (LCC)',
                      items: [
                        { id: 'pro-lcc', label: 'Total Cost of Ownership' }
                      ]
                    },
                    {
                      group: '4. Abrasive Size & Blast Profile',
                      items: [
                        { id: 'pro-abp', label: 'Profile Prediction & Chart' }
                      ]
                    },
                    {
                      group: '5. Abrasive Recycling Calculator',
                      items: [
                        { id: 'pro-arc', label: 'Recovery & Recycling Efficiency' }
                      ]
                    },
                    {
                      group: '6. Dust Collector Capacity',
                      items: [
                        { id: 'pro-dcc', label: 'CFM · Filter Area · Model' }
                      ]
                    },
                    {
                      group: '7. Surface Area & Weight',
                      items: [
                        { id: 'pro-saw', label: 'Sections · Steel Weight · BOQ' }
                      ]
                    },
                    {
                      group: '8. Inspection & QA/QC',
                      items: [
                        { id: 'qa-pa2', label: 'DFT Acceptance — SSPC-PA 2' },
                        { id: 'qa-iso', label: 'DFT Acceptance — ISO 19840' },
                        { id: 'qa-hol', label: 'Holiday Test Voltage' }
                      ]
                    },
                    {
                      group: '9. Corrosion Engineering',
                      items: [
                        { id: 'ce-rate', label: 'Corrosion Rate' },
                        { id: 'ce-life', label: 'Coating Life Prediction' }
                      ]
                    },
                    {
                      group: '10. Thermal Spray Aluminium (TSA)',
                      items: [
                        { id: 'tsa-wire', label: 'Wire Consumption' },
                        { id: 'tsa-cov', label: 'Area Coverage' },
                        { id: 'tsa-eff', label: 'Deposition Efficiency' },
                        { id: 'tsa-thk', label: 'Thickness Verification' },
                        { id: 'tsa-prod', label: 'Productivity' },
                        { id: 'tsa-cost', label: 'TSA Cost' }
                      ]
                    },
                    {
                      group: '11. Passive Fire Protection (PFP)',
                      items: [
                        { id: 'pfp-mat', label: 'PFP Material' },
                        { id: 'pfp-thk', label: 'PFP Thickness (Fire Rating)' },
                        { id: 'pfp-den', label: 'PFP Density' },
                        { id: 'pfp-mesh', label: 'Mesh Quantity' },
                        { id: 'pfp-cost', label: 'PFP Cost' },
                        { id: 'pfp-rep', label: 'Repair Quantity' }
                      ]
                    },
                    {
                      group: '12. Bid Tab & Comparison',
                      items: [
                        { id: 'bid-proc', label: 'Paint Procurement Quantity' },
                        { id: 'bid-comp', label: 'Multi-Manufacturer Bid Comparison' }
                      ]
                    }
                  ].map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-0.5">
                      <div className="text-[9.5px] font-bold text-[#F7941D]/90 tracking-wide px-3 pt-1">
                        {sec.group}
                      </div>
                      {sec.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNav('coating-calculator', item.id)}
                          className={`w-full text-left pl-8 pr-3 py-1 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                            activeSubTool === item.id
                              ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {!isUserPro && (
                            <span className="text-[9px] text-amber-500/80 font-mono shrink-0 ml-1">🔒</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isSpec ? (
            /* ========================================================
               COATING SPECIFICATION READING NAVIGATION (Matches Screenshot 2 / design_side.html)
               ======================================================== */
            <div className="space-y-4">
              {/* Home Link */}
              <button
                onClick={() => handleNav('specification-reading', 'hub')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                  !activeSubTool || activeSubTool === 'hub'
                    ? 'text-white bg-[#F7941D]/20 border border-[#F7941D]/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-sm">🏠</span>
                <span className="truncate">Coating Specification Reading</span>
              </button>

              {/* GROUP 1: PROJECT SECTIONS */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  PROJECT SECTIONS
                </div>
                <nav className="space-y-0.5">
                  {[
                    { id: 'scope', label: 'Project Information & Scope' },
                    { id: 'environment', label: 'General Requirements' },
                    { id: 'temperatures', label: 'Operating & Design Temperature' },
                    { id: 'special_systems', label: 'Others Details' },
                    { id: 'coating_design', label: 'Coating System Design' },
                    { id: 'testing_qc', label: 'Paint Testing Requirements' },
                    { id: 'manufacturers', label: 'Approved Primer & Paint' },
                    { id: 'revisions_notes', label: 'Revision History' },
                    { id: 'notes', label: 'General Notes & Comments', target: 'notes' },
                    { id: 'validate', label: 'Validate / Save Draft', target: 'validate' }
                  ].map((sec) => {
                    const isActive = activeSubTool === sec.id || (sec.target && activeSubTool === sec.target);
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('specification-reading', sec.target || sec.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 2: REGISTER & OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  REGISTER &amp; OUTPUT
                </div>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('specification-reading', 'report_register')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report_register' || activeSubTool === 'register'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📊</span>
                      <span>Report Register</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('specification-reading', 'preview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'preview'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">👁</span>
                      <span>Preview</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('specification-reading', 'report')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report' || activeSubTool === 'print'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🖨</span>
                      <span>Print</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 3: CONFIGURATION */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  CONFIGURATION
                </div>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('specification-reading', 'company_details')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'company_details' || activeSubTool === 'company'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🏢</span>
                      <span>Company Details</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('specification-reading', 'watermark')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'watermark'
                        ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💧</span>
                      <span>Watermark</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>
            </div>
          ) : isProcedure ? (
            /* ========================================================
               PAINTING PROCEDURE NAVIGATION (Matches media_1791472985773_f56bf798.png / ref-2.html)
               ======================================================== */
            <div className="space-y-4">
              {/* Painting Procedure Home Link */}
              <button
                onClick={() => handleNav('coating-procedure', 'hub')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                  !activeSubTool || activeSubTool === 'hub' || activeSubTool === 'home'
                    ? 'text-white bg-[#F7941D]/20 border border-[#F7941D]/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-[#F7941D] shrink-0" />
                <span className="truncate">Painting Procedure</span>
              </button>

              {/* GROUP 1: PROCEDURE SECTIONS */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  PROCEDURE SECTIONS
                </div>
                <nav className="space-y-0.5">
                  {[
                    { id: 'cover-revision', num: '1', label: 'Cover & Revision' },
                    { id: 'scope', num: '2', label: 'Scope' },
                    { id: 'reference-docs', num: '3', label: 'Reference Documents' },
                    { id: 'standards', num: '4', label: 'Reference Standards' },
                    { id: 'exclusions', num: '5', label: 'Blasting / Coating Exclusion' },
                    { id: 'safety', num: '6', label: 'Safety Requirements' },
                    { id: 'surface-prep', num: '7', label: 'Surface Preparation' },
                    { id: 'coating-app', num: '8', label: 'Coating Application' },
                    { id: 'repair-plan', num: '9', label: 'Coating Repair' },
                    { id: 'manufacturers', num: '10', label: 'Approved Manufacturers' },
                    { id: 'attachments', num: '11', label: 'Annexures', hasDot: 'green' }
                  ].map((sec) => {
                    const isActive = activeSubTool === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('coating-procedure', sec.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between group ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-4 text-center font-mono text-[11px] ${isActive ? 'text-[#F7941D] font-bold' : 'text-slate-500'}`}>
                            {sec.num}
                          </span>
                          <span className="truncate">{sec.label}</span>
                        </div>
                        {sec.hasDot && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 2: ANNEXURE MODULES */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  ANNEXURE MODULES
                </div>
                <nav className="space-y-0.5">
                  {[
                    { id: 'annexure-coating', num: 'A-1', label: 'Coating Systems', hasDot: 'orange' },
                    { id: 'annexure-inspection', num: 'A-2', label: 'Inspection Instruments', hasDot: 'orange' }
                  ].map((sec) => {
                    const isActive = activeSubTool === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('coating-procedure', sec.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between group ${
                          isActive
                            ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-6 text-center font-mono text-[11px] ${isActive ? 'text-[#F7941D] font-bold' : 'text-slate-500'}`}>
                            {sec.num}
                          </span>
                          <span className="truncate">{sec.label}</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* GROUP 3: REGISTERS */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  REGISTERS
                </div>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('coating-procedure', 'register')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'register'
                        ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📂</span>
                      <span>Procedure Register</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNav('coating-procedure', 'project-master')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'project-master'
                        ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🗂</span>
                      <span>Project Master List</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded font-mono">PRO</span>
                      <span className="text-[10px] bg-white/10 text-slate-300 font-mono px-1 rounded">1</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* GROUP 4: OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  OUTPUT
                </div>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('coating-procedure', 'preview')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'preview'
                        ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">👁</span>
                      <span>Preview</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNav('coating-procedure', 'report')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'report' || activeSubTool === 'print'
                        ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🖨</span>
                      <span>Print / PDF</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded font-mono">PRO</span>
                  </button>
                </nav>
              </div>

              {/* GROUP 5: BRANDING */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  BRANDING
                </div>
                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav('coating-procedure', 'company-details')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'company-details'
                        ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🏢</span>
                      <span>Company Details</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded font-mono">PRO</span>
                  </button>
                  <button
                    onClick={() => handleNav('coating-procedure', 'watermark')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      activeSubTool === 'watermark'
                        ? 'text-white font-bold bg-[#F7941D]/20 border-l-2 border-[#F7941D]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💧</span>
                      <span>Watermark</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded font-mono">PRO</span>
                  </button>
                </nav>
              </div>
            </div>
          ) : (
            /* ========================================================
               INNER MODULE NAVIGATION (e.g. Quick Unit Rate / Other)
               Matches Screenshot 3
               ======================================================== */
            <div className="space-y-4">
              
              {/* Active Section Banner Pill */}
              <div className="bg-[#2A231C] border border-[#5E4226] text-white rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-xs">
                <FileText className="w-4 h-4 text-[#F7941D] shrink-0" />
                <span className="font-semibold text-xs text-white truncate">
                  {activePage === 'unit-rate-estimation' && 'Estimation — Quick Unit Rate'}
                  {activePage === 'specification-reading' && 'Coating Specification Reading'}
                  {activePage === 'coating-procedure' && 'Coating Procedure (ITP)'}
                  {activePage === 'coating-calculator' && 'Coating Calculator Suite'}
                  {!['unit-rate-estimation', 'specification-reading', 'coating-procedure', 'coating-calculator'].includes(activePage) && activePage.toUpperCase()}
                </span>
              </div>

              {/* GROUP 1: PROJECT SECTIONS */}
              <div>
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  PROJECT SECTIONS
                </div>

                <nav className="space-y-0.5">
                  {activePage === 'unit-rate-estimation' && (
                    unitRateSections.map((sec) => {
                      const isActive = activeSubTool === sec.id || (sec.target && activeSubTool === sec.target);
                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleNav('unit-rate-estimation', sec.target || sec.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="truncate">{sec.label}</span>
                        </button>
                      );
                    })
                  )}

                  {activePage === 'specification-reading' && (
                    specSections.map((sec) => {
                      const isActive = activeSubTool === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleNav('specification-reading', sec.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="truncate">{sec.label}</span>
                        </button>
                      );
                    })
                  )}

                  {activePage === 'coating-procedure' && (
                    procSections.map((sec) => {
                      const isActive = activeSubTool === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleNav('coating-procedure', sec.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="truncate">{sec.label}</span>
                        </button>
                      );
                    })
                  )}

                  {activePage === 'coating-calculator' && (
                    calcTools.map((sec) => {
                      const isActive = activeSubTool === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleNav('coating-calculator', sec.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'text-white font-bold bg-[#F7941D]/15 border-l-2 border-[#F7941D]'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="truncate">{sec.label}</span>
                        </button>
                      );
                    })
                  )}
                </nav>
              </div>

              {/* GROUP 2: REGISTER & OUTPUT */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  REGISTER &amp; OUTPUT
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav(activePage, 'register')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Report Register</span>
                  </button>

                  <button
                    onClick={() => handleNav(activePage, 'preview')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleNav(activePage, 'report')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span>Print</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

              {/* GROUP 3: CONFIGURATION */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  CONFIGURATION
                </div>

                <nav className="space-y-0.5">
                  <button
                    onClick={() => handleNav(activePage, 'company-details')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Company Details</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav(activePage, 'watermark')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>Watermark</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#F7941D]">
                      PRO
                    </span>
                  </button>
                </nav>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM SECTION */}
        <div className="p-3 border-t border-white/[0.08] space-y-2 shrink-0">
          
          {/* Help & FAQ Button (Only on Home / Platform mode) */}
          {isHome ? (
            <button
              onClick={() => handleNav('knowledge')}
              className="w-full bg-[#222834] border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Help &amp; FAQ</span>
            </button>
          ) : isManpower ? (
            /* Bottom links matching media_1791302836632.png */
            <div className="space-y-1 text-[11px] text-slate-400 font-mono py-1">
              <a href="https://bgcoating.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#F7941D] transition">
                <Globe className="w-3 h-3 text-slate-500" />
                <span>bgcoating.com</span>
              </a>
              <a href="tel:+919925810408" className="flex items-center gap-2 hover:text-[#F7941D] transition">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>+91 99258 10408</span>
              </a>
            </div>
          ) : (isBlaster || isPainter || isTsa) ? (
            /* Bottom powered by matching media_1791304029525.png, media_1791304046270.png & media_1791305324466.png */
            <div className="py-1 text-center">
              <span className="text-[8px] text-slate-500 block uppercase tracking-wider font-mono">Powered by</span>
              <span className="text-[9px] text-[#C48866] font-medium block">BG Group of Paint and Coating Consultant</span>
            </div>
          ) : isInspection ? (
            /* Bottom evaluation notes matching media_1791305330443.png */
            <div className="py-1 px-1 text-[9px] text-slate-400 leading-tight">
              <span className="block text-slate-400 font-normal">Evaluation build - <span className="text-slate-300 font-medium">Print &amp; Company Details enabled</span></span>
              <span className="block text-[8px] text-[#F7941D] font-mono mt-0.5 font-semibold">PRO features unlocked for review</span>
            </div>
          ) : isContractor ? (
            /* Bottom footer matching media_1791306666911.png */
            <div className="py-1 text-center">
              <span className="text-[9px] text-slate-500 font-mono block">v2.0.42 • BG Group © 2026</span>
            </div>
          ) : (isCalc || isSpec) ? (
            /* Bottom links matching Screenshot 1 & 2 / ref.html */
            <div className="space-y-1 text-[11px] text-slate-400 font-mono py-1">
              <a href="https://bgcoating.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#F7941D] transition">
                <Globe className="w-3 h-3 text-slate-500" />
                <span>bgcoating.com</span>
              </a>
              <a href="tel:+919925810408" className="flex items-center gap-2 hover:text-[#F7941D] transition">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>+91 99258 10408</span>
              </a>
            </div>
          ) : null}

          {/* User Profile Card / Sign In Action Card */}
          {!isLoggedIn ? (
            <button
              onClick={onOpenAuthModal}
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
                    {(currentUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="leading-tight truncate">
                  <span className="font-bold text-white text-[12px] flex items-center gap-1 truncate">
                    <span className="truncate">{currentUser.name || 'User'}</span>
                    {isUserPro && <span className="text-[10px] text-amber-400">👑</span>}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#F7941D] uppercase block truncate">
                    {isUserPro ? 'EXECUTIVE PRO' : (currentUser.role || 'FREE PLAN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={() => handleNav('settings')}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer transition"
                  title="Account & Workspace Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Sign out of your workspace?')) {
                      localStorage.removeItem('bg_auth_logged_in');
                      window.dispatchEvent(new CustomEvent('bg_logout'));
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer transition"
                  title="Sign Out / Switch Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <aside className="fixed inset-y-0 left-0 w-72 h-full bg-[#181E29] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-3 border-b border-white/[0.08]">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">Navigation</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Inner content replicated for mobile */}
            <div className="flex-1 overflow-y-auto p-3">
              {isCalc ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-white/[0.04] transition"
                  >
                    <span>←</span>
                    <span>All Platform Modules</span>
                  </button>
                  <button
                    onClick={() => handleNav('coating-calculator', 'hub')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                      !activeSubTool || activeSubTool === 'hub' ? 'bg-[#F7941D]/20 text-white font-bold border border-[#F7941D]/40' : 'text-slate-300'
                    }`}
                  >
                    <span>🏠</span>
                    <span>Dashboard</span>
                  </button>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="px-2 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase">Paint Suite (7)</div>
                    {[
                      { id: 'sp-cov', label: 'Coverage' },
                      { id: 'sp-pc', label: 'WFT Range' },
                      { id: 'sp-dft', label: 'DFT' },
                      { id: 'sp-cons', label: 'Paint Consumption' },
                      { id: 'sp-bl', label: 'Blasting Loss' },
                      { id: 'sp-mx', label: 'Mixing Ratio' },
                      { id: 'sp-cost', label: 'Cost per Area' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleNav('coating-calculator', item.id)}
                        className={`w-full text-left px-3 py-1 text-xs rounded block ${
                          activeSubTool === item.id ? 'text-white font-bold bg-[#F7941D]/15' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="px-2 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase">Surface Area (6)</div>
                    {[
                      { id: 'sa-pipe', label: 'Pipe' },
                      { id: 'sa-tank', label: 'Tank' },
                      { id: 'sa-wws', label: 'Structure' },
                      { id: 'sa-plate', label: 'Plate' },
                      { id: 'sa-de', label: 'Dished End' },
                      { id: 'sa-vessel', label: 'Vessel' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleNav('coating-calculator', item.id)}
                        className={`w-full text-left px-3 py-1 text-xs rounded block ${
                          activeSubTool === item.id ? 'text-white font-bold bg-[#F7941D]/15' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : isSpec ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-white/[0.04] transition"
                  >
                    <span>←</span>
                    <span>All Platform Modules</span>
                  </button>
                  <button
                    onClick={() => handleNav('specification-reading', 'hub')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                      !activeSubTool || activeSubTool === 'hub' ? 'bg-[#F7941D]/20 text-white font-bold border border-[#F7941D]/40' : 'text-slate-300'
                    }`}
                  >
                    <span>🏠</span>
                    <span>Specification Hub</span>
                  </button>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="px-2 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase">Project Sections</div>
                    {[
                      { id: 'scope', label: 'Project Information & Scope' },
                      { id: 'environment', label: 'General Requirements' },
                      { id: 'temperatures', label: 'Operating & Design Temperature' },
                      { id: 'special_systems', label: 'Others Details' },
                      { id: 'coating_design', label: 'Coating System Design' },
                      { id: 'testing_qc', label: 'Paint Testing Requirements' },
                      { id: 'manufacturers', label: 'Approved Primer & Paint' },
                      { id: 'revisions_notes', label: 'Revision History' },
                      { id: 'notes', label: 'General Notes & Comments', target: 'notes' },
                      { id: 'validate', label: 'Validate / Save Draft', target: 'validate' }
                    ].map(sec => (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('specification-reading', sec.target || sec.id)}
                        className={`w-full text-left px-3 py-1 text-xs rounded block ${
                          activeSubTool === sec.id ? 'text-white font-bold bg-[#F7941D]/15' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : isProcedure ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-white/[0.04] transition"
                  >
                    <span>←</span>
                    <span>All Platform Modules</span>
                  </button>
                  <button
                    onClick={() => handleNav('coating-procedure', 'hub')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                      !activeSubTool || activeSubTool === 'hub' || activeSubTool === 'home' ? 'bg-[#F7941D]/20 text-white font-bold border border-[#F7941D]/40' : 'text-slate-300'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-[#F7941D]" />
                    <span>Painting Procedure</span>
                  </button>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="px-2 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase">Procedure Sections</div>
                    {[
                      { id: 'cover-revision', num: '1', label: 'Cover & Revision' },
                      { id: 'scope', num: '2', label: 'Scope' },
                      { id: 'reference-docs', num: '3', label: 'Reference Documents' },
                      { id: 'standards', num: '4', label: 'Reference Standards' },
                      { id: 'exclusions', num: '5', label: 'Blasting / Coating Exclusion' },
                      { id: 'safety', num: '6', label: 'Safety Requirements' },
                      { id: 'surface-prep', num: '7', label: 'Surface Preparation' },
                      { id: 'coating-app', num: '8', label: 'Coating Application' },
                      { id: 'repair-plan', num: '9', label: 'Coating Repair' },
                      { id: 'manufacturers', num: '10', label: 'Approved Manufacturers' },
                      { id: 'attachments', num: '11', label: 'Annexures' }
                    ].map(sec => (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('coating-procedure', sec.id)}
                        className={`w-full text-left px-3 py-1 text-xs rounded block ${
                          activeSubTool === sec.id ? 'text-white font-bold bg-[#F7941D]/15' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sec.num}. {sec.label}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="px-2 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase">Annexure Modules</div>
                    {[
                      { id: 'annexure-coating', num: 'A-1', label: 'Coating Systems' },
                      { id: 'annexure-inspection', num: 'A-2', label: 'Inspection Instruments' }
                    ].map(sec => (
                      <button
                        key={sec.id}
                        onClick={() => handleNav('coating-procedure', sec.id)}
                        className={`w-full text-left px-3 py-1 text-xs rounded block ${
                          activeSubTool === sec.id ? 'text-white font-bold bg-[#F7941D]/15' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sec.num} {sec.label}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="px-2 mb-1 text-[9px] font-mono font-bold text-slate-400 uppercase">Registers & Output</div>
                    <button
                      onClick={() => handleNav('coating-procedure', 'register')}
                      className={`w-full text-left px-3 py-1 text-xs rounded block ${
                        activeSubTool === 'register' ? 'text-white font-bold bg-[#F7941D]/15' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Procedure Register
                    </button>
                    <button
                      onClick={() => handleNav('coating-procedure', 'preview')}
                      className="w-full text-left px-3 py-1 text-xs rounded block text-slate-400 hover:text-white"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleNav('coating-procedure', 'report')}
                      className="w-full text-left px-3 py-1 text-xs rounded block text-slate-400 hover:text-white"
                    >
                      Print / PDF [PRO]
                    </button>
                  </div>
                </div>
              ) : (
                <nav className="space-y-1">
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white font-medium text-xs bg-[#2D2319] border border-[#5E4226]"
                  >
                    <Home className="w-4 h-4 text-[#F7941D]" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => handleNav('coating-calculator')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <Calculator className="w-4 h-4 text-blue-400" />
                    <span>Coating Calculator</span>
                  </button>
                  <button
                    onClick={() => handleNav('specification-reading')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Specification Reading</span>
                  </button>
                  <button
                    onClick={() => handleNav('coating-procedure')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                    <span>Coating Procedure</span>
                  </button>
                  <button
                    onClick={() => handleNav('unit-rate-estimation')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <Coins className="w-4 h-4 text-indigo-400" />
                      <span>Estimation</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => handleNav('inspection-reporting', 'hub')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <span>Documentation / Report</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => handleNav('contractor-management', 'hub')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>Contractor Management</span>
                  </button>
                  <button
                    onClick={() => handleNav('blaster', 'hub')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-rose-400" />
                      <span>Training &amp; Certification</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => {
                      handleNav('dashboard');
                      setTimeout(() => window.dispatchEvent(new CustomEvent('bg_open_ai_modal')), 150);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 text-xs hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>AI Assistant</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      AI
                    </span>
                  </button>
                </nav>
              )}
            </div>

            {/* Mobile Bottom User / Sign In Action Card */}
            <div className="p-3 border-t border-white/[0.08] bg-[#141923] shrink-0">
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#F7941D]/15 to-[#8B0E16]/15 border border-[#F7941D]/30 text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white flex items-center justify-center text-xs">
                      <LogIn className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-white text-xs block">Sign In / Register</span>
                      <span className="text-[10px] text-slate-400 block">Unlock Workspace</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F7941D] to-[#8B0E16] text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                      {(currentUser.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="leading-tight truncate">
                      <span className="font-bold text-white text-xs block truncate">{currentUser.name || 'User'}</span>
                      <span className="text-[9px] text-[#F7941D] font-mono font-bold block">{isUserPro ? 'EXECUTIVE PRO' : (currentUser.role || 'FREE PLAN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Sign out of your workspace?')) {
                        localStorage.removeItem('bg_auth_logged_in');
                        window.dispatchEvent(new CustomEvent('bg_logout'));
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
