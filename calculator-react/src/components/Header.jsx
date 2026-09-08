import React from 'react';
import { ChevronRight, Home, Menu, Sparkles, HelpCircle } from 'lucide-react';

export default function Header({ 
  activePage, 
  activeSubTool, 
  setActivePage,
  setActiveSubTool,
  setMobileSidebarOpen,
  onOpenHelp,
  onOpenUpgrade
}) {
  const toolTitles = {
    hub: 'Dashboard Hub',
    wft_range: 'WFT Range Calculator',
    dft: 'DFT Calculator',
    coverage: 'Paint Coverage',
    paint_consumption: 'Paint Consumption',
    blasting_loss: 'Blasting Dead Volume Loss',
    mixing_ratio: 'Paint Mixing Ratio',
    cost_per_area: 'Cost per Area',
    pipe_spool: 'Pipe Spool Area',
    tank_shell: 'Storage Tank Area',
    structural_steel: 'Structure Weight-Wise Area',
    flat_plate: 'Flat Plate Area',
    dished_end: 'Dished End Area',
    vessel_area: 'Vessel & Equipment Area',
    abrasive_media: 'Abrasive Media Matrix',
    salt_test_tool: 'Salt Contamination Test (Bresle)',
    volume_solids: 'Volume Solids Suite (TDS/Lab)',
    paint_reconciliation: 'Paint Reconciliation Engine',
    lifecycle_cost: '25-Year Life Cycle Cost (LCC)',
    blast_profile: 'Abrasive vs. Blast Profile',
    abrasive_recycling: 'Abrasive Recycling Performance',
    dust_collector: 'Dust Collector Sizing',
    structure_boq: 'Structure Area & Weight BOQ',
    dft_sspc_pa2: 'DFT Compliance (SSPC-PA 2)',
    dft_iso_19840: 'DFT Acceptance (ISO 19840)',
    holiday_voltage: 'Holiday Spark Voltage',
    corrosion_rate: 'Corrosion Rate & Metal Loss',
    coating_life: 'Coating Durability (ISO 12944)',
    coating_life_durability: 'Coating Durability (ISO 12944)',
    tsa_suite: 'TSA Engineering Suite',
    tsa_wire_consumption: 'TSA Wire Consumption Calculator',
    tsa_sealer_calc: 'TSA Sealer Paint Coverage',
    tsa_mandrel_eval: 'TSA 180° Mandrel Bend Test Eval',
    tsa_adhesion_matrix: 'TSA Adhesion Test Matrix',
    pfp_suite: 'Passive Fire Protection (PFP)',
    pfp_hp_a_calc: 'PFP Section Factor (Hp/A)',
    pfp_dft_matrix: 'PFP Fire Rating DFT Matrix',
    pfp_volume_quote: 'PFP Volume & Weight Take-Off',
    pfp_reinforce_mesh: 'PFP Reinforcement Carbon Mesh',
    procurement_suite: 'Procurement & Bid Suite',
    contractor_bid_builder: 'Contractor Commercial Bid Builder',
    batch_ticket_generator: 'Batch Inspection Ticket Generator',
    executive_cost_summary: 'Executive Cost Summary'
  };

  const pageDisplayNames = {
    'dashboard': 'Home Dashboard',
    'coating-calculator': 'Coating Calculator',
    'calc': 'Coating Calculator',
    'specification-reading': 'Coating Specification Reading',
    'coating-procedure': 'Coating Procedure (ITP)',
    'unit-rate-estimation': 'Unit-Rate Estimation',
    'manpower-estimation': 'Manpower Project Estimator',
    'blaster-qualification': 'Blaster Qualification (OQR)',
    'painter-qualification': 'Painter Qualification (PQR)',
    'tsa-qualification': 'TSA Thermal Spray Qualification',
    'inspection-reporting': 'Inspection & Adhesion (CIR)',
    'academy-lms': 'Digital Coating Academy LMS',
    'contractor-management': 'Contractor Directory (CMS)',
    'knowledge': 'Knowledge Base & Standards',
    'support': 'Technical Support Desk',
    'settings': 'Profile & Preferences'
  };

  const isCalcPage = activePage === 'coating-calculator' || activePage === 'calc';
  const isSubToolActive = isCalcPage && activeSubTool && activeSubTool !== 'hub';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#E6E8EC] px-4 md:px-6 flex items-center justify-between shadow-[0_1px_6px_rgba(20,24,32,0.04)] sticky top-0 z-30">
      
      {/* Mobile Hamburger Button + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl bg-[#F7F8FA] text-[#4E5B6A] hover:bg-[#FFF4E3] hover:text-[#D97706] border border-[#E6E8EC] transition cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation Bar */}
        <nav className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-[#7E8B99] font-medium overflow-x-auto min-w-0">
          
          <button 
            onClick={() => {
              if (setActivePage) setActivePage('dashboard');
              if (setActiveSubTool) setActiveSubTool('hub');
            }}
            className="flex items-center gap-1.5 bg-[#F7F8FA] hover:bg-[#FFF4E3] hover:text-[#D97706] border border-[#E6E8EC] px-2.5 py-1 rounded-full text-[#1B222C] font-semibold font-mono uppercase tracking-wider text-[10px] md:text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            <Home className="w-3 h-3 text-[#7E8B99]" />
            <span>Home</span>
          </button>

          <ChevronRight className="w-3 h-3 text-[#CBD5E1] shrink-0" />

          {isCalcPage ? (
            <>
              <button
                onClick={() => {
                  if (setActivePage) setActivePage('coating-calculator');
                  if (setActiveSubTool) setActiveSubTool('hub');
                }}
                className={`whitespace-nowrap hover:text-[#D97706] font-mono text-[10px] md:text-[11px] uppercase tracking-wider transition cursor-pointer ${!isSubToolActive ? 'text-[#1B222C] font-bold' : 'text-[#7E8B99]'}`}
              >
                Coating Calculator
              </button>

              {isSubToolActive && (
                <>
                  <ChevronRight className="w-3 h-3 text-[#CBD5E1] shrink-0" />
                  <span className="bg-[#FFF4E3] text-[#A41E22] border border-[#F3D2A0] px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] md:text-[11px] tracking-wide whitespace-nowrap">
                    {toolTitles[activeSubTool] || activeSubTool}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="bg-[#FFF4E3] text-[#A41E22] border border-[#F3D2A0] px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] md:text-[11px] tracking-wide whitespace-nowrap">
              {pageDisplayNames[activePage] || activePage}
            </span>
          )}
        </nav>
      </div>

      {/* Right System Controls & Action Icons */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-xl bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#D97706] border border-[#E6E8EC] hover:border-[#F3D2A0] flex items-center justify-center transition cursor-pointer"
            title="Open Help & FAQ Knowledge Drawer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenUpgrade}
          className="bg-[#FFF4E3] hover:bg-[#FEE9C7] text-[#B05E00] border border-[#F3D2A0] hover:border-[#F7941D] px-3 py-1 rounded-full text-[10px] md:text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
          <span className="hidden sm:inline">Upgrade Pro</span>
          <span className="sm:hidden">PRO</span>
        </button>

      </div>

    </header>
  );
}
