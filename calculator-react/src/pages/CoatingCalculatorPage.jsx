import React, { useState } from 'react';
import WFTRangeTool from '../tools/WFTRangeTool';
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
  Wrench
} from 'lucide-react';

export default function CoatingCalculatorPage({ activeSubTool, setActiveSubTool }) {
  
  // If activeSubTool is 'wft_range', render WFTRangeTool
  if (activeSubTool === 'wft_range') {
    return (
      <div className="space-y-4">
        {/* Sub-tool Header bar with back to Hub button */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveSubTool('hub')}
            className="text-xs font-bold text-[#F7941D] hover:text-[#D97706] flex items-center gap-1.5"
          >
            <span>← Back to Calculator Hub</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-600">Tool: WFT Range Calculation</span>
        </div>

        <WFTRangeTool />
      </div>
    );
  }

  // If activeSubTool is 'hub' or null, render the 1:1 Coating Calculator Dashboard Hub from screenshot!
  const categoryCards = [
    { title: 'Paint Calculators', count: '7', subtitle: 'WFT · DFT · Coverage · Total', icon: Paintbrush, color: 'orange', groupKey: 'paint_suite' },
    { title: 'Surface Area', count: '6', subtitle: 'Pipes · Tanks · Structural · Plate', icon: SquareDot, color: 'sky', groupKey: 'surface_area' },
    { title: 'Abrasive Consumption', count: '2', subtitle: 'Garnet · Copper Slag', icon: Flame, color: 'amber', groupKey: 'abrasives' },
    { title: 'Salt Contamination', count: '1', subtitle: 'Bresle · ISO 8502-6', icon: TestTube, color: 'emerald', groupKey: 'salt_test' },
    { title: 'Executive Coating Calculation - PRO', count: '28', subtitle: '28 Intermediate System Calculators', icon: Crown, color: 'purple', groupKey: 'executive_pro' }
  ];

  const quickAccessButtons = [
    { label: 'Coverage', id: 'coverage', icon: Layers },
    { label: 'WFT Range', id: 'wft_range', icon: Sliders },
    { label: 'DFT', id: 'dft', icon: Percent },
    { label: 'Surface Area', id: 'tank_shell', icon: SquareDot },
    { label: 'Abrasive', id: 'abrasive_media', icon: Flame },
    { label: 'Salt Test', id: 'salt_test_tool', icon: TestTube },
    { label: 'Executive PRO', id: 'pro_estimator', icon: Crown },
  ];

  const allCalculatorCards = [
    { id: 'wft_range', title: 'WFT Range Calculator', desc: 'Min & Max WFT from DFT range', icon: Sliders },
    { id: 'dft', title: 'DFT Calculator', desc: 'Dry film thickness from WFT', icon: Percent },
    { id: 'coverage', title: 'Paint Coverage', desc: 'm² & sq ft spread rate per L', icon: Layers },
    { id: 'paint_consumption', title: 'Paint Consumption', desc: 'Total liters for surface area', icon: Calculator },
    { id: 'blasting_loss', title: 'Blasting Loss', desc: 'Dead volume profile paint loss', icon: TrendingUp },
    { id: 'mixing_ratio', title: 'Mixing Ratio', desc: 'Part A, Part B, Thinner', icon: FlaskConical },
    { id: 'cost_per_area', title: 'Cost Per Area', desc: 'Paint & project costing', icon: Coins },
    { id: 'pipe_spool', title: 'Pipe Area', desc: 'Multiple pipe spool calculator', icon: SquareDot },
    { id: 'tank_shell', title: 'Tank Area', desc: 'Storage tank shell & roof', icon: SquareDot },
    { id: 'structural_steel', title: 'Structural Weight/Area', desc: 'Beam area from section weight', icon: Scale },
    { id: 'flat_plate', title: 'Plate Area', desc: 'Flat plate & deck area', icon: SquareDot },
    { id: 'spool_area', title: 'Piping Spool Area', desc: 'Flange, valve & spool total', icon: SquareDot },
    { id: 'vessel_area', title: 'Vessel / Equipment', desc: 'Complex vessel surface area', icon: Box },
    { id: 'abrasive_media', title: 'Abrasive Consumption', desc: 'Garnet & Copper Slag kg', icon: Flame },
    { id: 'salt_test_tool', title: 'Salt Contamination', desc: 'Bresle method & conductivity', icon: TestTube },
    { id: 'volume_solids_verify', title: 'Volume Solids - Test Verify', desc: 'WFT / DFT ratio verification', icon: Activity },
    { id: 'volume_solids_density', title: 'Volume Solids - Density', desc: 'Density & W/V Ratio', icon: Scale },
    { id: 'volume_solids_lab', title: 'Volume Solids - Laboratory', desc: 'ASTM D2697 Test Standard', icon: FlaskConical },
    { id: 'paint_reconciliation', title: 'Paint Reconciliation', desc: 'Site actual vs theoretical consumption', icon: FileSpreadsheet },
    { id: 'lifecycle_cost', title: 'Coating Life Cycle Cost', desc: 'LCC 20-Year Maintenance Cost', icon: Coins },
    { id: 'abrasive_recycling', title: 'Abrasive Recycling', desc: 'Garnet multi-pass recycling savings', icon: RotateCcw },
    { id: 'dust_collector', title: 'Dust Collector Capacity', desc: 'Airflow CFM & Filter Sizing', icon: Zap },
    { id: 'surface_area_weight', title: 'Surface Area & Weight', desc: 'Tonnage vs area ratio', icon: Scale },
    { id: 'dft_sspc_pa2', title: 'DFT Compliance - SSPC PA 2', desc: 'Spot measurement gauge rules', icon: ShieldCheck },
    { id: 'dft_iso_19840', title: 'DFT Acceptance - ISO 19840', desc: '80/20 rule & max DFT limit', icon: ShieldCheck },
    { id: 'holiday_voltage', title: 'Holiday Test Voltage', desc: 'NACE SP0188 Spark test KV', icon: Zap },
    { id: 'corrosion_rate', title: 'Corrosion Rate', desc: 'mpy & mm/year metal loss', icon: Activity },
    { id: 'coating_life', title: 'Coating Life Prediction', desc: 'ISO 12944 Durability Years', icon: CheckCircle2 },
    { id: 'tsa_area_coverage', title: 'TSA Area Coverage', desc: 'Thermal spray aluminium m²/kg', icon: FlameKindling },
    { id: 'tsa_deposition', title: 'TSA Deposition Efficiency', desc: 'Wire spray transfer efficiency %', icon: FlameKindling },
    { id: 'pfp_material', title: 'PFP Material Consumption', desc: 'Passive fire protection epoxy kg', icon: ShieldCheck },
    { id: 'pfp_thickness', title: 'PFP Thickness & Fire Rating', desc: '30, 60, 90, 120 min rating', icon: ShieldCheck },
    { id: 'pfp_density', title: 'PFP Density Verification', desc: 'Target kg/m³ density check', icon: Scale },
    { id: 'mesh_qty', title: 'Mesh Quantity', desc: 'Reinforcement mesh m²', icon: Box },
    { id: 'pfp_repair', title: 'PFP Repair Quantity', desc: 'Patching area & volume', icon: Wrench },
    { id: 'paint_procurement', title: 'Paint Procurement Quantity', desc: 'Kit packing & drum count', icon: Box },
  ];

  const commonPaintSystems = [
    { type: 'Inorganic Zinc Silicate', vs: '75%', dft: '75 µm', wft: '100 µm', loss: '20%', practical: '7.50 m²/L' },
    { type: 'Epoxy Zinc Primer', vs: '65%', dft: '60 µm', wft: '92.3 µm', loss: '25%', practical: '8.13 m²/L' },
    { type: 'Epoxy Intermediate', vs: '80%', dft: '200 µm', wft: '250 µm', loss: '20%', practical: '3.20 m²/L' },
    { type: 'High-Build Epoxy', vs: '75%', dft: '125 µm', wft: '166.7 µm', loss: '20%', practical: '4.80 m²/L' },
    { type: 'Polyurethane Topcoat', vs: '65%', dft: '50 µm', wft: '76.9 µm', loss: '20%', practical: '9.00 m²/L' },
    { type: 'Coal Tar Epoxy', vs: '70%', dft: '200 µm', wft: '285.7 µm', loss: '25%', practical: '2.63 m²/L' },
    { type: 'Glass Flake Epoxy', vs: '85%', dft: '350 µm', wft: '411.8 µm', loss: '20%', practical: '1.94 m²/L' },
    { type: 'Alkyd Primer', vs: '50%', dft: '40 µm', wft: '80 µm', loss: '15%', practical: '10.63 m²/L' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* 1. Top Category Summary Cards (5 Cards with Top Accent Line & Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categoryCards.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div 
              key={idx} 
              onClick={() => setActiveSubTool(cat.groupKey === 'paint_suite' ? 'wft_range' : cat.groupKey)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden cursor-pointer hover:border-[#F7941D] hover:shadow-md transition group"
            >
              {/* Top Orange Accent Line matching screenshot */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F7941D]"></div>

              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-amber-50 text-[#F7941D] border border-amber-100 group-hover:scale-105 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900 group-hover:text-[#F7941D] transition">{cat.count}</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">{cat.title}</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">{cat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Quick Access Section (| Quick Access) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-[#F7941D] font-mono">|</span> Quick Access
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Most used calculators</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {quickAccessButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveSubTool(btn.id)}
                className="bg-white hover:bg-amber-50 hover:border-[#F7941D] border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 transition shadow-xs flex items-center gap-2.5 group"
              >
                <div className="p-1 rounded bg-amber-100 text-[#D97706] group-hover:bg-[#F7941D] group-hover:text-slate-950 transition">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Industry Insights Grid (| Industry Insights) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-[#F7941D] font-mono">|</span> Industry Insights
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Engineering benchmarks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Paintbrush className="w-4 h-4 text-[#F7941D]" />
              <span>Common Paint Systems</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Inorganic Zinc Silicate</span><b className="text-amber-700">75 µm</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Epoxy Intermediate</span><b className="text-amber-700">150 µm</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>High-Build Epoxy</span><b className="text-amber-700">125 µm</b></div>
              <div className="flex justify-between"><span>Polyurethane Topcoat</span><b className="text-amber-700">50 µm</b></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-[#F7941D]" />
              <span>Typical DFT Ranges</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Primer Coat</span><b className="text-slate-900">40 - 75 µm</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Intermediate</span><b className="text-slate-900">100 - 150 µm</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Topcoat</span><b className="text-slate-900">50 - 75 µm</b></div>
              <div className="flex justify-between"><span>Total System</span><b className="text-[#F7941D]">250 µm</b></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Flame className="w-4 h-4 text-[#F7941D]" />
              <span>Abrasive Rates</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Garnet SA 2.5</span><b className="text-slate-900">25 kg/m²</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Slag SA 2.5</span><b className="text-slate-900">30 kg/m²</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Garnet SA 3.0</span><b className="text-slate-900">35 kg/m²</b></div>
              <div className="flex justify-between"><span>Slag SA 3.0</span><b className="text-slate-900">38 kg/m²</b></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <TestTube className="w-4 h-4 text-[#F7941D]" />
              <span>Salt Test Limits</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Maximum Immersion</span><b className="text-emerald-600">&lt; 20 mg/m²</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Atmospheric Severe</span><b className="text-emerald-600">&lt; 30 mg/m²</b></div>
              <div className="flex justify-between border-b border-slate-100 pb-1"><span>Off Shore High Spec</span><b className="text-emerald-600">&lt; 50 mg/m²</b></div>
              <div className="flex justify-between"><span>Standard</span><b className="text-slate-900">ISO 8502-6</b></div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. All Calculators Grid (| All Calculators) matching screenshot */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-[#F7941D] font-mono">|</span> All Calculators
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Click any tool to launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allCalculatorCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveSubTool(card.id)}
                className="bg-white hover:border-[#F7941D] border border-slate-200 p-4 rounded-2xl cursor-pointer transition shadow-xs space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-50 text-[#F7941D] border border-slate-100 group-hover:bg-amber-50 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F7941D] group-hover:translate-x-0.5 transition" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#F7941D] transition leading-tight">{card.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 leading-tight">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Quick Reference — Common Paint Systems Table matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-[#F7941D] border border-amber-100">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Quick Reference — Common Paint Systems</h3>
              <p className="text-[10px] text-slate-500 font-mono">Standard theoretical & practical coverage benchmarks</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">ISO 12944 Normative</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">PAINT TYPE</th>
                <th className="p-3 font-semibold text-center">VS%</th>
                <th className="p-3 font-semibold text-center">DRY FILM</th>
                <th className="p-3 font-semibold text-center">WET FILM</th>
                <th className="p-3 font-semibold text-center">LOSS%</th>
                <th className="p-3 font-semibold text-right">PRACTICAL (m²/L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {commonPaintSystems.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-slate-900 font-sans text-xs">{row.type}</td>
                  <td className="p-3 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">{row.vs}</span></td>
                  <td className="p-3 text-center text-slate-800 font-bold">{row.dft}</td>
                  <td className="p-3 text-center text-amber-700 font-bold">{row.wft}</td>
                  <td className="p-3 text-center text-slate-500">{row.loss}</td>
                  <td className="p-3 text-right font-bold text-[#F7941D]">{row.practical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
