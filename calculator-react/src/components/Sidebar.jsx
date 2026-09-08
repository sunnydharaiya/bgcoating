import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calculator,
  Paintbrush,
  SquareDot,
  Flame,
  TestTube,
  Crown,
  FileCode2,
  FileText,
  BookOpen,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  FileCheck,
  Coins,
  Users,
  Award,
  ClipboardCheck,
  GraduationCap,
  Building2,
  HardHat,
  ShieldCheck,
  FolderKanban,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  activeSubTool,
  setActiveSubTool,
  onNavigate,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) {
  // Main Menu expansion states: only open the dropdown matching the active page
  const [calcMenuOpen, setCalcMenuOpen] = useState(activePage === 'coating-calculator' || activePage === 'calc');
  const [specMenuOpen, setSpecMenuOpen] = useState(activePage === 'specification-reading' || activePage === 'design');
  const [procMenuOpen, setProcMenuOpen] = useState(activePage === 'coating-procedure' || activePage === 'procedure');
  const [costMenuOpen, setCostMenuOpen] = useState(activePage === 'unit-rate-estimation' || activePage === 'cost-estimation');
  const [manpowerMenuOpen, setManpowerMenuOpen] = useState(activePage === 'manpower-estimation');
  const [blasterMenuOpen, setBlasterMenuOpen] = useState(activePage === 'blaster-qualification' || activePage === 'blaster');
  const [painterMenuOpen, setPainterMenuOpen] = useState(activePage === 'painter-qualification' || activePage === 'painter');
  const [tsaMenuOpen, setTsaMenuOpen] = useState(activePage === 'tsa-qualification' || activePage === 'tsa');
  const [inspectionMenuOpen, setInspectionMenuOpen] = useState(activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection');

  // When activePage changes, open ONLY the active page's dropdown and close all others
  useEffect(() => {
    setCalcMenuOpen(activePage === 'coating-calculator' || activePage === 'calc');
    setSpecMenuOpen(activePage === 'specification-reading' || activePage === 'design');
    setProcMenuOpen(activePage === 'coating-procedure' || activePage === 'procedure');
    setCostMenuOpen(activePage === 'unit-rate-estimation' || activePage === 'cost-estimation');
    setManpowerMenuOpen(activePage === 'manpower-estimation');
    setBlasterMenuOpen(activePage === 'blaster-qualification' || activePage === 'blaster');
    setPainterMenuOpen(activePage === 'painter-qualification' || activePage === 'painter');
    setTsaMenuOpen(activePage === 'tsa-qualification' || activePage === 'tsa');
    setInspectionMenuOpen(activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection');
  }, [activePage]);

  // Group expansion state under Coating Calculator
  const [openGroups, setOpenGroups] = useState({
    paint_suite: true,
    surface_area: false,
    abrasives: false,
    salt_test: false,
    executive_pro: true,
  });

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleNav = (page, subTool = 'hub') => {
    if (onNavigate) {
      onNavigate(page, subTool);
    } else {
      if (page === 'coating-calculator') {
        setActivePage(page);
        if (subTool) setActiveSubTool(subTool);
      } else {
        setActivePage(page);
      }
    }
    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
  };

  const handlePageClick = (page) => {
    handleNav(page, 'hub');
  };

  const handleMainCalcClick = () => {
    setCalcMenuOpen(prev => !prev);
    handleNav('coating-calculator', 'hub');
  };

  const handleSubItemClick = (toolId) => {
    handleNav('coating-calculator', toolId);
  };

  const handleMainSpecClick = () => {
    setSpecMenuOpen(prev => !prev);
    handleNav('specification-reading', 'hub');
  };

  const handleSpecSubItemClick = (subSecId) => {
    handleNav('specification-reading', subSecId);
  };

  const handleMainProcClick = () => {
    setProcMenuOpen(prev => !prev);
    handleNav('coating-procedure', 'hub');
  };

  const handleProcSubItemClick = (subSecId) => {
    handleNav('coating-procedure', subSecId);
  };

  const handleMainCostClick = () => {
    setCostMenuOpen(prev => !prev);
    handleNav('unit-rate-estimation', 'hub');
  };

  const handleCostSubItemClick = (subSecId) => {
    handleNav('unit-rate-estimation', subSecId);
  };

  const handleMainManpowerClick = () => {
    setManpowerMenuOpen(prev => !prev);
    handleNav('manpower-estimation', 'hub');
  };

  const handleManpowerSubItemClick = (subSecId) => {
    handleNav('manpower-estimation', subSecId);
  };

  const handleMainBlasterClick = () => {
    setBlasterMenuOpen(prev => !prev);
    handleNav('blaster-qualification', 'hub');
  };

  const handleBlasterSubItemClick = (subSecId) => {
    handleNav('blaster-qualification', subSecId);
  };

  const handleMainPainterClick = () => {
    setPainterMenuOpen(prev => !prev);
    handleNav('painter-qualification', 'hub');
  };

  const handlePainterSubItemClick = (subSecId) => {
    handleNav('painter-qualification', subSecId);
  };

  const handleMainTsaClick = () => {
    setTsaMenuOpen(prev => !prev);
    handleNav('tsa-qualification', 'hub');
  };

  const handleTsaSubItemClick = (subSecId) => {
    handleNav('tsa-qualification', subSecId);
  };

  const handleMainInspectionClick = () => {
    setInspectionMenuOpen(prev => !prev);
    handleNav('inspection-reporting', 'hub');
  };

  const handleInspectionSubItemClick = (subSecId) => {
    handleNav('inspection-reporting', subSecId);
  };

  const handleMainAcademyClick = () => {
    handleNav('academy-lms', 'hub');
  };

  const handleMainContractorClick = () => {
    handleNav('contractor-management', 'hub');
  };

  // Coating Calculator Categories (Exact 1:1 match with Reference 02 HTML)
  const calcCategories = [
    {
      key: 'paint_suite',
      title: 'Paint Suite (7)',
      badge: 'Paint',
      icon: Paintbrush,
      items: [
        { id: 'sp-pc', label: 'WFT Range' },
        { id: 'sp-dft', label: 'DFT' },
        { id: 'sp-cov', label: 'Coverage' },
        { id: 'sp-cons', label: 'Paint Consumption' },
        { id: 'sp-bl', label: 'Blasting Loss' },
        { id: 'sp-mx', label: 'Mixing Ratio' },
        { id: 'sp-cost', label: 'Cost per Area' }
      ]
    },
    {
      key: 'surface_area',
      title: 'Surface Area (6)',
      badge: 'Area',
      icon: SquareDot,
      items: [
        { id: 'sa-pipe', label: 'Pipe' },
        { id: 'sa-tank', label: 'Tank' },
        { id: 'sa-wws', label: 'Structure' },
        { id: 'sa-plate', label: 'Plate' },
        { id: 'sa-de', label: 'Dished End' },
        { id: 'sa-vessel', label: 'Vessel' }
      ]
    },
    {
      key: 'abrasives',
      title: 'Abrasive Consumption (2)',
      badge: 'Media',
      icon: Flame,
      items: [
        { id: 'ab-garnet', label: 'Garnet' },
        { id: 'ab-cslag', label: 'Copper Slag' }
      ]
    },
    {
      key: 'salt_test',
      title: 'Salt Test (1)',
      badge: 'Salt',
      icon: TestTube,
      items: [
        { id: 'salt-main', label: 'Bresle Salt Test' }
      ]
    },
    {
      key: 'executive_pro',
      title: 'Executive Coating Calculation – PRO (28)',
      badge: '28 PRO',
      icon: Crown,
      isPro: true,
      sections: [
        {
          numTitle: '1. Volume Solids Calculator',
          items: [
            { id: 'vs-tds', label: 'Volume Solids — TDS' },
            { id: 'vs-den', label: 'Volume Solids — Density' },
            { id: 'vs-lab', label: 'Volume Solids — Lab D2697' }
          ]
        },
        {
          numTitle: '2. Paint Reconciliation Calculator',
          items: [
            { id: 'pro-recon', label: 'Theoretical vs Actual' }
          ]
        },
        {
          numTitle: '3. Coating Life Cycle Cost (LCC)',
          items: [
            { id: 'pro-lcc', label: 'Total Cost of Ownership' }
          ]
        },
        {
          numTitle: '4. Abrasive Size & Blast Profile',
          items: [
            { id: 'pro-abp', label: 'Profile Prediction & Chart' }
          ]
        },
        {
          numTitle: '5. Abrasive Recycling Calculator',
          items: [
            { id: 'pro-arc', label: 'Recovery & Recycling Efficiency' }
          ]
        },
        {
          numTitle: '6. Dust Collector Capacity',
          items: [
            { id: 'pro-dcc', label: 'CFM · Filter Area · Model' }
          ]
        },
        {
          numTitle: '7. Surface Area & Weight',
          items: [
            { id: 'pro-saw', label: 'Sections · Steel Weight · BOQ' }
          ]
        },
        {
          numTitle: '8. Inspection & QA/QC',
          items: [
            { id: 'qa-pa2', label: 'DFT Acceptance — SSPC-PA 2' },
            { id: 'qa-iso', label: 'DFT Acceptance — ISO 19840' },
            { id: 'qa-hol', label: 'Holiday Test Voltage' }
          ]
        },
        {
          numTitle: '9. Corrosion Engineering',
          items: [
            { id: 'ce-rate', label: 'Corrosion Rate' },
            { id: 'ce-life', label: 'Coating Life Prediction' }
          ]
        },
        {
          numTitle: '10. Thermal Spray Aluminium (TSA)',
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
          numTitle: '11. Passive Fire Protection (PFP)',
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
          numTitle: '12. Bid Tab & Comparison',
          items: [
            { id: 'bid-proc', label: 'Paint Procurement Quantity' },
            { id: 'bid-comp', label: 'Multi-Manufacturer Bid Comparison' }
          ]
        }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#2B303A] bg-gradient-to-b from-[#343A45] via-[#2B303A] to-[#22262E] text-slate-200">
      
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-[#343A45] border-b border-white/10 shadow-xs sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-2.png" 
            alt="BG Group" 
            className="w-9 h-9 flex-none rounded-[10px] bg-white p-[2px] object-contain shadow-xs" 
          />
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-['Sora',sans-serif] text-[0.92rem] font-bold text-white tracking-normal leading-[1.15] whitespace-nowrap">
              BG CoatingOS™
            </span>
            <span className="text-[0.62rem] tracking-[0.18em] text-[#F7941D] uppercase font-mono font-semibold whitespace-nowrap">
              Workspace
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden p-1 text-slate-400 hover:text-white rounded cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">

        {/* WORKSPACE MODULES GROUP */}
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Workspace Modules
          </div>

          <nav className="space-y-0.5">
            {/* Dashboard / Workspace Home */}
            <button
              onClick={() => handlePageClick('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'dashboard'
                ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400 flex-none" />
              <span className="truncate">Dashboard Home</span>
            </button>

            {/* 01. Coating Calculator (Hierarchical Hub) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainCalcClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'coating-calculator'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Calculator className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">01. Coating Calculator</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    44
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${calcMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {/* Sub-groups Accordion under 01. Coating Calculator */}
              {calcMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1 mt-1">

                  {calcCategories.map(cat => {
                    const Icon = cat.icon;
                    const isOpen = openGroups[cat.key];

                    return (
                      <div key={cat.key} className="space-y-0.5">
                        {/* Group Header Button */}
                        <button
                          onClick={() => toggleGroup(cat.key)}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${cat.isPro
                            ? 'text-amber-300 hover:bg-white/[0.06] hover:text-amber-200'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3.5 h-3.5 flex-none ${cat.isPro ? 'text-amber-400' : 'text-slate-400'}`} />
                            <span className="truncate">{cat.title}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-none">
                            <span className="text-[9px] font-mono px-1 rounded bg-white/10 text-slate-300">
                              {cat.badge}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {isOpen ? '▾' : '▸'}
                            </span>
                          </div>
                        </button>

                        {/* Group Sub-Items */}
                        {isOpen && (
                          <div className="space-y-0.5 pl-2">
                            {/* Standard list */}
                            {cat.items && cat.items.map((item, idx) => {
                              const isSubActive = activePage === 'coating-calculator' && (
                                activeSubTool === item.id ||
                                activeSubTool === item.id.replace(/-/g, '_') ||
                                (item.id === 'sp-pc' && activeSubTool === 'wft_range') ||
                                (item.id === 'sp-dft' && activeSubTool === 'dft') ||
                                (item.id === 'sp-cov' && activeSubTool === 'coverage') ||
                                (item.id === 'sp-cons' && activeSubTool === 'paint_consumption') ||
                                (item.id === 'sp-bl' && activeSubTool === 'blasting_loss') ||
                                (item.id === 'sp-mx' && activeSubTool === 'mixing_ratio') ||
                                (item.id === 'sp-cost' && activeSubTool === 'cost_per_area') ||
                                (item.id === 'sa-pipe' && (activeSubTool === 'pipe_spool' || activeSubTool === 'spool_area')) ||
                                (item.id === 'sa-tank' && (activeSubTool === 'tank_shell' || activeSubTool === 'tank_roof' || activeSubTool === 'spherical_tank')) ||
                                (item.id === 'sa-wws' && activeSubTool === 'structural_steel') ||
                                (item.id === 'sa-plate' && activeSubTool === 'flat_plate') ||
                                (item.id === 'sa-de' && activeSubTool === 'dished_end') ||
                                (item.id === 'sa-vessel' && activeSubTool === 'vessel_area') ||
                                (item.id === 'ab-garnet' && (activeSubTool === 'garnet' || activeSubTool === 'abrasive_garnet')) ||
                                (item.id === 'ab-cslag' && (activeSubTool === 'copper_slag' || activeSubTool === 'abrasive_copper_slag')) ||
                                (item.id === 'salt-main' && activeSubTool === 'salt_test_tool')
                              );
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleSubItemClick(item.id)}
                                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                                    ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                                    : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                                    }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                                  <span className="truncate">{item.label}</span>
                                </button>
                              );
                            })}

                            {/* PRO suite sections */}
                            {cat.sections && cat.sections.map((sec, sIdx) => (
                              <div key={sIdx} className="space-y-0.5 mt-1.5 first:mt-0">
                                <div className="text-[9.5px] font-bold text-[#F7941D]/90 uppercase tracking-wide px-2 pt-2 pb-0.5 font-mono">
                                  {sec.numTitle}
                                </div>
                                {sec.items.map((item, idx) => {
                                  const isSubActive = activePage === 'coating-calculator' && (
                                    activeSubTool === item.id ||
                                    activeSubTool === item.id.replace(/-/g, '_') ||
                                    (item.id === 'vs-tds' && activeSubTool === 'volume_solids_verify') ||
                                    (item.id === 'vs-den' && activeSubTool === 'volume_solids_density') ||
                                    (item.id === 'vs-lab' && activeSubTool === 'volume_solids_lab') ||
                                    (item.id === 'pro-recon' && activeSubTool === 'paint_reconciliation') ||
                                    (item.id === 'pro-lcc' && activeSubTool === 'lifecycle_cost') ||
                                    (item.id === 'pro-abp' && activeSubTool === 'blast_profile') ||
                                    (item.id === 'pro-arc' && activeSubTool === 'abrasive_recycling') ||
                                    (item.id === 'pro-dcc' && activeSubTool === 'dust_collector') ||
                                    (item.id === 'pro-saw' && activeSubTool === 'structure_boq') ||
                                    (item.id === 'qa-pa2' && (activeSubTool === 'dft_sspc_pa2' || activeSubTool === 'sspc_pa2')) ||
                                    (item.id === 'qa-iso' && (activeSubTool === 'dft_iso_19840' || activeSubTool === 'iso_19840')) ||
                                    (item.id === 'qa-hol' && activeSubTool === 'holiday_voltage') ||
                                    (item.id === 'ce-rate' && activeSubTool === 'corrosion_rate') ||
                                    (item.id === 'ce-life' && (activeSubTool === 'coating_life' || activeSubTool === 'coating_life_durability')) ||
                                    (item.id === 'tsa-wire' && activeSubTool === 'tsa_wire_consumption') ||
                                    (item.id === 'tsa-cov' && activeSubTool === 'tsa_area_coverage') ||
                                    (item.id === 'tsa-eff' && activeSubTool === 'tsa_deposition') ||
                                    (item.id === 'tsa-thk' && activeSubTool === 'tsa_thickness_verify') ||
                                    (item.id === 'tsa-prod' && activeSubTool === 'tsa_productivity') ||
                                    (item.id === 'tsa-cost' && activeSubTool === 'tsa_cost') ||
                                    (item.id === 'pfp-mat' && activeSubTool === 'pfp_material') ||
                                    (item.id === 'pfp-thk' && (activeSubTool === 'pfp_thickness' || activeSubTool === 'pfp_dft_matrix')) ||
                                    (item.id === 'pfp-den' && activeSubTool === 'pfp_density') ||
                                    (item.id === 'pfp-mesh' && (activeSubTool === 'pfp_mesh_qty' || activeSubTool === 'pfp_reinforce_mesh')) ||
                                    (item.id === 'pfp-cost' && activeSubTool === 'pfp_cost') ||
                                    (item.id === 'pfp-rep' && activeSubTool === 'pfp_repair') ||
                                    (item.id === 'bid-proc' && activeSubTool === 'paint_procurement') ||
                                    (item.id === 'bid-comp' && (activeSubTool === 'bid_comparison' || activeSubTool === 'contractor_bid_builder'))
                                  );
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleSubItemClick(item.id)}
                                      className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                                        ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                                        }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                                      <span className="truncate">{item.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              )}
            </div>

            {/* 02. Coating Specification Reading (MNC Engine) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainSpecClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'specification-reading'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileCode2 className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">02. Spec Reading Engine</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    9
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${specMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {specMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Project Sections */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Project Sections
                    </div>
                    {[
                      { id: 'hub', label: 'Hub Overview' },
                      { id: 'scope', label: 'A/B. Project Scope' },
                      { id: 'environment', label: 'C. General Reqs' },
                      { id: 'temperatures', label: 'D. Operating Temp' },
                      { id: 'special_systems', label: 'E. Special Details' },
                      { id: 'coating_design', label: 'F. Coating Systems' },
                      { id: 'testing_qc', label: 'G. Testing & QC' },
                      { id: 'manufacturers', label: 'H. Manufacturers' },
                      { id: 'revisions_notes', label: 'I/N. Revisions & Notes' }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'specification-reading' && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSpecSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'report_register', label: 'Report Register' },
                      { id: 'preview', label: 'Preview' },
                      { id: 'report', label: 'Print Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'specification-reading' && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSpecSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company_details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'specification-reading' && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSpecSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 03. Coating Procedure (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainProcClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'coating-procedure'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">03. Coating Procedure</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    13
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${procMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {procMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Procedure Sections */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Procedure Sections
                    </div>
                    {[
                      { id: 'hub', label: 'Hub Overview' },
                      { id: 'cover-revision', label: '01. Cover & Revision' },
                      { id: 'scope', label: '02. Scope of Work' },
                      { id: 'reference-docs', label: '03. Reference Docs' },
                      { id: 'standards', label: '04. Standards' },
                      { id: 'exclusions', label: '05. Exclusions' },
                      { id: 'safety', label: '06. Safety & HSE' },
                      { id: 'surface-prep', label: '07. Surface Prep' },
                      { id: 'coating-app', label: '08. Application' },
                      { id: 'repair-plan', label: '09. Repair Plan' },
                      { id: 'manufacturers', label: '10. Manufacturers' },
                      { id: 'attachments', label: '11. Attachments' },
                      { id: 'annexure-coating', label: 'A-I Coating Systems' },
                      { id: 'annexure-inspection', label: 'A-II Inspection Matrix' }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'coating-procedure' && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleProcSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'register', label: 'Procedure Register' },
                      { id: 'preview', label: 'Preview Document' },
                      { id: 'report', label: 'Print Technical Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'coating-procedure' && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleProcSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'coating-procedure' && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleProcSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 04. Quick Unit-Rate Estimation (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainCostClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'unit-rate-estimation' || activePage === 'cost-estimation'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Coins className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">04. Unit-Rate Estimation</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    6
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${costMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {costMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Estimation Sections */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Estimation Inputs
                    </div>
                    {[
                      { id: 'hub', label: 'Hub Overview' },
                      { id: 'project-info', label: '01. Project Information' },
                      { id: 'scope', label: '02. Company Scope' },
                      { id: 'section-d', label: '03. Section D Temp Data' },
                      { id: 'section-f', label: '04. Coating Systems' },
                      { id: 'cost-matrix', label: '05. Unit-Rate Table' },
                      { id: 'revisions', label: '06. Revision History' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'unit-rate-estimation' || activePage === 'cost-estimation') && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleCostSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'register', label: 'Quotation Register' },
                      { id: 'report-view', label: 'Executive Report' },
                      { id: 'preview', label: 'Preview Quotation' },
                      { id: 'xlprint', label: 'Print Quotation Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'unit-rate-estimation' || activePage === 'cost-estimation') && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleCostSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'unit-rate-estimation' || activePage === 'cost-estimation') && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleCostSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 05. Manpower Estimation (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainManpowerClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'manpower-estimation'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <HardHat className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">05. Manpower Estimation</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    8
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${manpowerMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {manpowerMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Estimation Sections */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Estimation Inputs
                    </div>
                    {[
                      { id: 'hub', label: 'Hub Overview' },
                      { id: 'project-info', label: '01. Project Info' },
                      { id: 'blasting', label: '02. Blasting Cost' },
                      { id: 'painting', label: '03. Paint Application' },
                      { id: 'raw-material', label: '04. Raw Material' },
                      { id: 'worker-ctc', label: '05. Worker CTC' },
                      { id: 'abrasive-diesel', label: '06. Abrasive & Diesel' },
                      { id: 'summary', label: '07. Cost Summary' }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'manpower-estimation' && (activeSubTool === item.id || (activeSubTool === 'hub' && item.id === 'hub'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleManpowerSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'register', label: 'Estimation Register' },
                      { id: 'preview', label: 'Preview Dossier' },
                      { id: 'report', label: 'Print Technical Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'manpower-estimation' && (activeSubTool === item.id || (activeSubTool === 'report' && item.id === 'report'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleManpowerSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = activePage === 'manpower-estimation' && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleManpowerSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 06. Blaster Qualification (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainBlasterClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'blaster-qualification' || activePage === 'blaster'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">06. Blaster Qualification</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    8
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${blasterMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {blasterMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Qualification Workflow */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Qualification Workflow
                    </div>
                    {[
                      { id: 'hub', label: 'Hub & Overview' },
                      { id: 'dashboard', label: 'Analytics Dashboard' },
                      { id: 'info', label: '01. Project & Operator' },
                      { id: 'train', label: '02. Training & Test' },
                      { id: 'checklist', label: '03. Assessment Checklist' },
                      { id: 'blasting', label: '04. Blasting Process' },
                      { id: 'photo', label: '05. Photo Evidence' },
                      { id: 'verdict', label: '06. Verdict & Sign' },
                      { id: 'summary', label: '07. Executive Summary' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'blaster-qualification' || activePage === 'blaster') && (activeSubTool === item.id || (activeSubTool === 'hub' && item.id === 'hub'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleBlasterSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'register', label: 'Reports Register' },
                      { id: 'preview', label: 'Preview Dossier' },
                      { id: 'report', label: 'Print Technical Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'blaster-qualification' || activePage === 'blaster') && (activeSubTool === item.id || (activeSubTool === 'report' && item.id === 'report'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleBlasterSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'blaster-qualification' || activePage === 'blaster') && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleBlasterSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 07. Spray Painter Qualification (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainPainterClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'painter-qualification' || activePage === 'painter'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Paintbrush className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">07. Painter Qualification</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    12
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${painterMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {painterMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Qualification Workflow */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Qualification Workflow
                    </div>
                    {[
                      { id: 'hub', label: 'Hub & Overview' },
                      { id: 'dashboard', label: 'Analytics Dashboard' },
                      { id: 'project-info', label: '01. Project & Coating Spec' },
                      { id: 'training-test', label: '02. Training & Exam' },
                      { id: 'checklist', label: '03. Assessment Checklist' },
                      { id: 'coat-stage-s1', label: '04. Blasting & Primer (s1)' },
                      { id: 'coat-stage-s2', label: '05. 1st Intermediate (s2)' },
                      { id: 'coat-stage-s3', label: '06. 2nd Intermediate (s3)' },
                      { id: 'coat-stage-s4', label: '07. 3rd Finish Topcoat (s4)' },
                      { id: 'photo-report', label: '08. Photographic Evidence' },
                      { id: 'verdict-approval', label: '09. Verdict & Endorsement' },
                      { id: 'summary', label: '10. Executive Summary' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'painter-qualification' || activePage === 'painter') && (activeSubTool === item.id || (activeSubTool === 'hub' && item.id === 'hub'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePainterSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'register', label: 'Reports Register' },
                      { id: 'preview', label: 'Preview Dossier' },
                      { id: 'report', label: 'Print Technical Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'painter-qualification' || activePage === 'painter') && (activeSubTool === item.id || (activeSubTool === 'report' && item.id === 'report'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePainterSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'painter-qualification' || activePage === 'painter') && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePainterSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 08. TSA Operator Qualification (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainTsaClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'tsa-qualification' || activePage === 'tsa'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Flame className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">08. TSA Qualification</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    11
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${tsaMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {tsaMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Qualification Workflow */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Qualification Workflow
                    </div>
                    {[
                      { id: 'hub', label: 'Hub & Overview' },
                      { id: 'dashboard', label: 'Analytics Dashboard' },
                      { id: 'project-info', label: '01. Project & Spec Scope' },
                      { id: 'checklist', label: '02. Assessment Checklist' },
                      { id: 'coat-stage-s1', label: '03. Blasting & TSA (s1)' },
                      { id: 'coat-stage-s2', label: '04. 1st / Sealer Coat (s2)' },
                      { id: 'coat-stage-s3', label: '05. 2nd Coat (s3)' },
                      { id: 'coat-stage-s4', label: '06. 3rd Coat (s4)' },
                      { id: 'photo-report', label: '07. Photo Evidence' },
                      { id: 'verdict-approval', label: '08. Verdict & Sign-Off' },
                      { id: 'summary', label: '09. Executive Summary' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'tsa-qualification' || activePage === 'tsa') && (activeSubTool === item.id || (activeSubTool === 'hub' && item.id === 'hub'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleTsaSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Register & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Register &amp; Output
                    </div>
                    {[
                      { id: 'register', label: 'Reports Register' },
                      { id: 'preview', label: 'Preview Dossier' },
                      { id: 'report', label: 'Print Technical Dossier', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'tsa-qualification' || activePage === 'tsa') && (activeSubTool === item.id || (activeSubTool === 'report' && item.id === 'report'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleTsaSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'tsa-qualification' || activePage === 'tsa') && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleTsaSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 09. Coating Inspection & Reporting (Hierarchical Suite) */}
            <div className="space-y-0.5">
              <button
                onClick={handleMainInspectionClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection'
                  ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ClipboardCheck className="w-4 h-4 text-amber-400 flex-none" />
                  <span className="truncate">09. Coating Inspection</span>
                </div>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    14
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${inspectionMenuOpen ? 'rotate-0' : '-rotate-90'}`} />
                </div>
              </button>

              {inspectionMenuOpen && (
                <div className="pl-2.5 ml-2 border-l border-white/10 space-y-1.5 mt-1">
                  {/* Category 1: Coating Report Stages */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Coating Report Stages
                    </div>
                    {[
                      { id: 'hub', label: 'Hub & Overview' },
                      { id: 's1', label: '01. Blasting & Priming (s1)' },
                      { id: 's2', label: '02. 1st Intermediate (s2)' },
                      { id: 's3', label: '03. 2nd Intermediate (s3)' },
                      { id: 's4', label: '04. 3rd Finish Coat (s4)' },
                      { id: 'photo', label: '05. Photo Evidence Grid' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection') && (activeSubTool === item.id || (activeSubTool === 'hub' && item.id === 'hub'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleInspectionSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 2: Adhesion Testing */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Adhesion Testing
                    </div>
                    {[
                      { id: 'pull', label: 'Pull-Off Adhesion (D4541)' },
                      { id: 'cross', label: 'Cross-Cut Adhesion (D3359)' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection') && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleInspectionSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-emerald-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 3: Standards & References */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Standards &amp; References
                    </div>
                    {[
                      { id: 'refp', label: 'Pull-Off Reference Guide' },
                      { id: 'refc', label: 'Cross-Cut Matrix' },
                      { id: 'std', label: 'Standards Library' }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection') && activeSubTool === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleInspectionSubItemClick(item.id)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 4: Registers & Output */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Registers &amp; Output
                    </div>
                    {[
                      { id: 'report_register', label: 'Inspection Register' },
                      { id: 'rwkreg', label: 'Rework Register (NCR)', isPro: true },
                      { id: 'preview', label: 'Preview Dossier' },
                      { id: 'report', label: 'Print Technical Dossier', isPro: true },
                      { id: 'dashboard', label: 'Analytics Dashboard', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection') && (activeSubTool === item.id || (activeSubTool === 'report' && item.id === 'report'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleInspectionSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-amber-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.isPro && (
                            <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Pro
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Category 5: Configuration */}
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 py-0.5">
                      Configuration
                    </div>
                    {[
                      { id: 'company-details', label: 'Company Details', isPro: true },
                      { id: 'master', label: 'Master Systems', isPro: true },
                      { id: 'watermark', label: 'Watermark Pro', isPro: true }
                    ].map((item, idx) => {
                      const isSubActive = (activePage === 'inspection-reporting' || activePage === 'qa-qc-inspection') && (activeSubTool === item.id || activeSubTool === item.id.replace('-', '_'));
                      return (
                        <button
                          key={idx}
                          onClick={() => handleInspectionSubItemClick(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${isSubActive
                            ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-none ${isSubActive ? 'bg-[#F7941D]' : 'bg-violet-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Pro
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 10. Digital Coating Academy LMS */}
            <button
              onClick={() => handlePageClick('academy-lms')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'academy-lms'
                ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <GraduationCap className="w-4 h-4 text-amber-400 flex-none" />
                <span className="truncate">10. Academy LMS</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-bold flex-none">
                LMS
              </span>
            </button>

            {/* 11. Contractor Management Directory (CMS) */}
            <button
              onClick={() => handlePageClick('contractor-management')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${activePage === 'contractor-management'
                ? 'bg-[#F7941D]/15 text-white font-bold border-l-2 border-[#F7941D]'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Building2 className="w-4 h-4 text-amber-400 flex-none" />
                <span className="truncate">11. Contractor Directory</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex-none">
                CMS
              </span>
            </button>

          </nav>
        </div>

        {/* SYSTEM & RESOURCES GROUP */}
        <div className="pt-2 border-t border-white/10">
          <div className="px-2 mb-1.5 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Resources &amp; Support
          </div>

          <nav className="space-y-0.5">
            {/* Standards Knowledge Base */}
            <button
              onClick={() => handlePageClick('knowledge')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition duration-150 cursor-pointer ${activePage === 'knowledge'
                ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <BookOpen className="w-4 h-4 text-slate-400 flex-none" />
              <span className="truncate">Standards Library</span>
            </button>

            {/* Support Desk */}
            <button
              onClick={() => handlePageClick('support')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition duration-150 cursor-pointer ${activePage === 'support'
                ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400 flex-none" />
              <span className="truncate">Help &amp; Support Desk</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handlePageClick('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition duration-150 cursor-pointer ${activePage === 'settings'
                ? 'bg-[#F7941D]/15 text-white font-semibold border-l-2 border-[#F7941D]'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <Settings className="w-4 h-4 text-slate-400 flex-none" />
              <span className="truncate">Settings &amp; Profile</span>
            </button>
          </nav>
        </div>

      </div>

      {/* Footer Profile & Contact */}
      <div className="p-3 border-t border-white/10 bg-[#22262E] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="leading-tight">
          <span className="block font-bold text-white font-mono text-[11px]">BG CoatingOS™</span>
          <span className="text-[10px] text-slate-400 font-mono">v2.4 Enterprise</span>
        </div>
        <div className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
          PRO UNLOCKED
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Always visible on md+, fixed to screen height) */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#2B303A] border-r border-slate-800 shrink-0 select-none shadow-md z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <aside className="fixed inset-y-0 left-0 w-72 h-full bg-[#2B303A] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
