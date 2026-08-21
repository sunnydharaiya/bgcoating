import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Paintbrush, 
  SquareDot, 
  Flame, 
  TestTube, 
  Crown, 
  FileCode2, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  X
} from 'lucide-react';

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  activeSubTool, 
  setActiveSubTool,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) {
  // Main Coating Calculator Menu expansion state
  const [calcMenuOpen, setCalcMenuOpen] = useState(true);

  // Group expansion state under Coating Calculator
  const [openGroups, setOpenGroups] = useState({
    paint_suite: true,
    surface_area: false,
    abrasives: false,
    salt_test: false,
    executive_pro: false,
  });

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleMainCalcClick = () => {
    setActivePage('coating-calculator');
    setActiveSubTool('hub');
    setCalcMenuOpen(true);
    setMobileSidebarOpen(false); // Close mobile drawer on selection
  };

  const handleSubItemClick = (toolId) => {
    setActivePage('coating-calculator');
    setActiveSubTool(toolId);
    setMobileSidebarOpen(false); // Close mobile drawer on selection
  };

  const handlePageClick = (pageId) => {
    setActivePage(pageId);
    setMobileSidebarOpen(false); // Close mobile drawer on selection
  };

  const calcCategories = [
    {
      key: 'paint_suite',
      title: 'Paint Suite',
      badge: '7',
      icon: Paintbrush,
      items: [
        { id: 'coverage', label: 'Coverage' },
        { id: 'wft_range', label: 'WFT Range' },
        { id: 'dft', label: 'DFT' },
        { id: 'paint_consumption', label: 'Paint Consumption' },
        { id: 'blasting_loss', label: 'Blasting Loss' },
        { id: 'mixing_ratio', label: 'Mixing Ratio' },
        { id: 'cost_per_area', label: 'Cost per Area' },
      ]
    },
    {
      key: 'surface_area',
      title: 'Surface Area',
      badge: '6',
      icon: SquareDot,
      items: [
        { id: 'tank_shell', label: 'Tank Shell' },
        { id: 'tank_roof', label: 'Tank Roof' },
        { id: 'pipe_spool', label: 'Pipe Spool' },
        { id: 'structural_steel', label: 'Structural Steel' },
        { id: 'spherical_tank', label: 'Spherical Tank' },
        { id: 'flat_plate', label: 'Flat Plate' },
      ]
    },
    {
      key: 'abrasives',
      title: 'Abrasives',
      badge: '2',
      icon: Flame,
      items: [
        { id: 'abrasive_media', label: 'Abrasives' },
        { id: 'nozzle_air', label: 'Nozzle Air' },
      ]
    },
    {
      key: 'salt_test',
      title: 'Salt Test',
      badge: '1',
      icon: TestTube,
      items: [
        { id: 'salt_test_tool', label: 'Salt Test' },
      ]
    },
    {
      key: 'executive_pro',
      title: 'Executive PRO',
      badge: '28',
      icon: Crown,
      items: [
        { id: 'project_scope', label: 'Project Scope & Info' },
        { id: 'general_req', label: 'General Requirements' },
        { id: 'temp_design', label: 'Operating Temp Spec' },
        { id: 'env_conditions', label: 'Environmental Category' },
        { id: 'surface_prep_pro', label: 'Surface Preparation Spec' },
        { id: 'coating_system_pro', label: 'Coating System Design' },
        { id: 'primer_spec', label: 'Primer Coat Spec' },
        { id: 'intermediate_spec', label: 'Intermediate Coat Spec' },
        { id: 'topcoat_spec', label: 'Topcoat Spec' },
        { id: 'paint_testing_pro', label: 'Paint Testing Requirements' },
        { id: 'approved_paints', label: 'Approved Paints & Primers' },
        { id: 'dft_range_matrix', label: 'System DFT Matrix' },
        { id: 'wft_check_pro', label: 'WFT Verification' },
        { id: 'blasting_media_pro', label: 'Blast Media Spec' },
        { id: 'salt_limit_pro', label: 'Salt Limit Audit' },
        { id: 'dew_point_psychro', label: 'Psychrometric Dew Point' },
        { id: 'dehumidification_pro', label: 'Dehumidification Control' },
        { id: 'tank_lining_pro', label: 'Internal Tank Lining' },
        { id: 'pipe_coating_pro', label: 'External Pipe Coating' },
        { id: 'tsa_thermal_spray', label: 'TSA Thermal Spray' },
        { id: 'pfp_intumescent', label: 'PFP Intumescent' },
        { id: 'fre_insulation', label: 'FRE Insulation' },
        { id: 'revision_history', label: 'Revision History Log' },
        { id: 'general_notes', label: 'General Notes & Comments' },
        { id: 'report_register', label: 'Report Register' },
        { id: 'spec_preview', label: 'Specification Preview' },
        { id: 'pro_print', label: 'PDF Export & Print' },
        { id: 'company_branding', label: 'Company Branding & Logo' },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#F7941D] text-slate-950 font-extrabold px-2 py-1 rounded text-xs tracking-wider uppercase font-mono shadow">
            BG GROUP
          </div>
          <div className="text-[10px] font-mono leading-tight text-slate-300">
            <span className="block font-bold text-white uppercase">Coating</span>
            <span className="block text-slate-400">Consultants</span>
          </div>
        </div>

        {/* Mobile Close X Button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden p-1 text-slate-400 hover:text-white rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        
        {/* 1. Dashboard Link */}
        <button
          onClick={() => handlePageClick('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
            activePage === 'dashboard'
              ? 'bg-[#F7941D]/20 text-white border border-[#F7941D]/40 font-bold shadow-inner'
              : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#F7941D]" />
          <span>Dashboard</span>
        </button>

        {/* 2. Main Coating Calculator Accordion Menu Header */}
        <div>
          <button
            onClick={handleMainCalcClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition ${
              activePage === 'coating-calculator' && activeSubTool === 'hub'
                ? 'bg-[#F7941D] text-slate-950 shadow font-extrabold'
                : activePage === 'coating-calculator'
                ? 'bg-[#F7941D]/20 text-white border border-[#F7941D]/30 font-bold'
                : 'text-slate-200 hover:bg-slate-700/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calculator className={`w-4 h-4 ${activePage === 'coating-calculator' && activeSubTool === 'hub' ? 'text-slate-950' : 'text-[#F7941D]'}`} />
              <span>Coating Calculator</span>
            </div>
            {calcMenuOpen ? (
              <ChevronDown className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-70" />
            )}
          </button>

          {/* Collapsible Groups under Coating Calculator */}
          {calcMenuOpen && (
            <div className="pl-2 pt-2 space-y-2">
              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest px-2 py-0.5">
                PAINT CALCULATORS
              </div>

              {calcCategories.map((cat) => {
                const Icon = cat.icon;
                const isOpen = openGroups[cat.key];

                return (
                  <div key={cat.key} className="space-y-1">
                    
                    {/* Category Header */}
                    <button
                      onClick={() => toggleGroup(cat.key)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700/40 hover:text-white transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#F7941D]" />
                        <span>{cat.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700/80 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center">
                          {cat.badge}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                        )}
                      </div>
                    </button>

                    {/* Sub-Items Pages List */}
                    {isOpen && (
                      <div className="pl-4 space-y-0.5 border-l border-slate-700/60 ml-4">
                        {cat.items.map((item) => {
                          const isSelected = activePage === 'coating-calculator' && activeSubTool === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSubItemClick(item.id)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition relative font-medium ${
                                isSelected
                                  ? 'bg-[#F7941D] text-slate-950 font-bold shadow-sm'
                                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute left-1 top-2 w-1.5 h-1.5 bg-slate-950 rounded-full"></span>
                              )}
                              <span className={isSelected ? 'pl-2' : ''}>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* 3. Specification Reading Link */}
        <button
          onClick={() => handlePageClick('specification-reading')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
            activePage === 'specification-reading'
              ? 'bg-[#F7941D]/20 text-white border border-[#F7941D]/40 font-bold shadow-inner'
              : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-emerald-400" />
          <span>Specification Reading</span>
        </button>

        {/* 4. Knowledge Base Link */}
        <button
          onClick={() => handlePageClick('knowledge')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
            activePage === 'knowledge'
              ? 'bg-[#F7941D]/20 text-white border border-[#F7941D]/40 font-bold shadow-inner'
              : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Knowledge Base</span>
        </button>

        {/* 5. Profile & Settings Link */}
        <button
          onClick={() => handlePageClick('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
            activePage === 'settings'
              ? 'bg-[#F7941D]/20 text-white border border-[#F7941D]/40 font-bold shadow-inner'
              : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

      </div>

      {/* Sidebar Footer User Section */}
      <div className="p-3 border-t border-slate-700/50 bg-[#22262E] space-y-2">
        <button 
          onClick={() => handlePageClick('support')}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition"
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#F7941D]/20 text-[#F7941D] p-1.5 rounded-lg">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block font-bold text-xs text-white">Help & FAQ</span>
              <span className="block text-[10px] text-slate-400 font-mono">Search guides & answers</span>
            </div>
          </div>
        </button>

        <div className="flex items-center justify-between px-2 pt-1 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#F7941D] text-slate-950 font-bold flex items-center justify-center text-[10px]">
              U
            </div>
            <div>
              <span className="block font-bold text-slate-200">User</span>
              <span className="block text-[9px] text-[#F7941D] font-mono uppercase font-bold">FREE PLAN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Docked (Visible on >= md screens) */}
      <aside className="hidden md:flex w-64 bg-[#2B303A] text-slate-200 flex-col min-h-screen border-r border-slate-700/50 shrink-0 shadow-lg select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Overlay Drawer (Visible when mobileSidebarOpen is true on < md screens) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Sliding Drawer Container */}
          <aside className="relative z-10 w-72 max-w-[85vw] bg-[#2B303A] text-slate-200 flex flex-col h-full shadow-2xl border-r border-slate-700/80 select-none">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
