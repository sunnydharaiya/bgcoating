import React from 'react';
import { ChevronRight, Home, Menu, Sparkles } from 'lucide-react';

export default function Header({ activePage, activeSubTool, setMobileSidebarOpen }) {
  const toolTitles = {
    hub: 'Dashboard Hub',
    wft_range: 'WFT Range',
    dft: 'DFT',
    coverage: 'Coverage',
    paint_consumption: 'Paint Consumption',
    blasting_loss: 'Blasting Loss',
    mixing_ratio: 'Mixing Ratio',
    cost_per_area: 'Cost per Area',
    tank_shell: 'Storage Tank Shell',
    tank_roof: 'Storage Tank Roof',
    pipe_spool: 'Pipe Spool System',
    structural_steel: 'Structural Steel',
    spherical_tank: 'Spherical Vessel',
    flat_plate: 'Flat Plate Area',
    abrasive_media: 'Abrasive Blasting',
    nozzle_air: 'Nozzle Air & CFM',
    salt_test_tool: 'Salt Contamination Test',
    pro_estimator: 'Executive PRO Estimator',
  };

  const categoryNames = {
    hub: 'Coating Calculator',
    wft_range: 'Paint Calculators',
    dft: 'Paint Calculators',
    coverage: 'Paint Calculators',
    paint_consumption: 'Paint Calculators',
    blasting_loss: 'Paint Calculators',
    mixing_ratio: 'Paint Calculators',
    cost_per_area: 'Paint Calculators',
    tank_shell: 'Surface Area',
    tank_roof: 'Surface Area',
    pipe_spool: 'Surface Area',
    structural_steel: 'Surface Area',
    spherical_tank: 'Surface Area',
    flat_plate: 'Surface Area',
    abrasive_media: 'Abrasive Consumption',
    nozzle_air: 'Abrasive Consumption',
    salt_test_tool: 'Salt Test',
    pro_estimator: 'Executive PRO',
  };

  const currentToolTitle = toolTitles[activeSubTool] || 'Dashboard Hub';
  const currentCategory = categoryNames[activeSubTool] || 'Coating Calculator';

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
      
      {/* Mobile Hamburger Button + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        {/* Breadcrumb Navigation Bar */}
        <div className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-slate-500 font-medium overflow-x-auto">
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-slate-700 font-bold whitespace-nowrap">
            <Home className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-500" />
            <span>Home</span>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />

          <span className="whitespace-nowrap hidden sm:inline">{currentCategory}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 hidden sm:inline" />

          <span className="bg-[#F7941D]/15 text-[#D97706] border border-[#F7941D]/30 px-2 py-0.5 rounded-lg font-extrabold font-mono whitespace-nowrap">
            → {currentToolTitle}
          </span>
        </div>
      </div>

      {/* Right System Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="bg-[#F7941D]/10 text-[#D97706] border border-[#F7941D]/30 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
          <span className="hidden sm:inline">BG Coating Calculator</span>
          <span className="sm:hidden">BGOS</span>
        </div>
      </div>

    </header>
  );
}
