import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Award, TrendingDown, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

export default function LifeCycleCostTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & Asset Info
  const [projectName, setProjectName] = useState('');
  const [assetName, setAssetName] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [systemName, setSystemName] = useState('');

  const [area, setArea] = useState('');
  const [initialCostM2, setInitialCostM2] = useState(''); // ₹/m²
  const [firstMaintenanceYr, setFirstMaintenanceYr] = useState('');
  const [maintenanceCostPct, setMaintenanceCostPct] = useState(''); // % of initial cost
  const [majorRecoatYr, setMajorRecoatYr] = useState('');
  const [recoatCostPct, setRecoatCostPct] = useState('85'); // % of initial cost
  const [discountRate, setDiscountRate] = useState('6'); // % annual discount rate for NPV
  const [copied, setCopied] = useState(false);

  // 25-Year Cash Flow & NPV Calculations
  const hasInputs = area && initialCostM2;
  const initialCapex = hasInputs ? Number(area) * Number(initialCostM2) : 0;
  
  // Maintenance Event at year X:
  const maintCost = hasInputs && maintenanceCostPct ? initialCapex * (Number(maintenanceCostPct) / 100) : 0;
  const npvMaint = firstMaintenanceYr && maintCost ? maintCost / Math.pow(1 + Number(discountRate || 6) / 100, Number(firstMaintenanceYr)) : 0;

  // Major Recoat Event at year Y:
  const recoatCost = hasInputs && recoatCostPct ? initialCapex * (Number(recoatCostPct) / 100) : 0;
  const npvRecoat = majorRecoatYr && recoatCost ? recoatCost / Math.pow(1 + Number(discountRate || 6) / 100, Number(majorRecoatYr)) : 0;

  // Total 25-Year Undiscounted Total vs NPV Total
  const totalUndiscounted = initialCapex + maintCost + recoatCost;
  const totalNPV = initialCapex + npvMaint + npvRecoat;
  const annualizedLccM2 = hasInputs && totalNPV > 0 ? totalNPV / (Number(area) * 25) : 0;

  const handleOpenGuideline = () => {
    openGuideline('pro-lcc');
  };

  const handleCalculate = () => {
    if (!area || !initialCostM2) {
      addToast('Missing Required Inputs', 'Please enter Asset Surface Area and Initial CapEx Rate.', 'warning');
      return;
    }
    addToast('Calculated Life Cycle Cost', '25-Year NPV and Cash Flow schedule evaluated.', 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setAssetName('');
    setClient('');
    setLocation('');
    setSystemName('');
    setArea('');
    setInitialCostM2('');
    setFirstMaintenanceYr('');
    setMaintenanceCostPct('');
    setMajorRecoatYr('');
    setRecoatCostPct('85');
    setDiscountRate('6');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!hasInputs) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — 25-Year Life Cycle Cost (LCC) Analysis
${projectName ? `Project: ${projectName}\n` : ''}${assetName ? `Asset: ${assetName}\n` : ''}${client ? `Client: ${client}\n` : ''}${location ? `Location: ${location}\n` : ''}${systemName ? `Coating System: ${systemName}\n` : ''}Area: ${area} m² | Initial CapEx: ${formatCur(initialCapex)} (${formatCur(initialCostM2)}/m²)
First Maintenance @ Yr ${firstMaintenanceYr || '—'} (${maintenanceCostPct || 0}%): ${formatCur(maintCost)}
Major Recoat @ Yr ${majorRecoatYr || '—'} (${recoatCostPct}%): ${formatCur(recoatCost)}
Discount Rate: ${discountRate}%
--------------------------------------
Total 25-Year Undiscounted Cost: ${formatCur(totalUndiscounted)}
Total 25-Year Net Present Value (NPV): ${formatCur(totalNPV)}
Annualized Equivalent Cost: ${formatCur(annualizedLccM2)} / m² / year`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Life cycle cost analysis copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-LCC-1 · NACE RP0272
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              25-Year Coating Life Cycle Cost (LCC) &amp; NPV
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compute total cost of ownership (TCO) across 25 years with Net Present Value (NPV) discounting for initial painting, touch-up maintenance, and major recoats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenGuideline}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Guideline</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
          
          {/* Section A: Project & Asset Info */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Asset Identification
              </h2>
              <Calculator className="w-4 h-4 text-[#F7941D]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Project Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Crude Tank Farm Phase-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Asset Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Tank T-201 External Shell"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Client <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. ONGC"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Location <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Hazira, Gujarat"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Coating System Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={systemName}
                  onChange={e => setSystemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Zn Silicate + Epoxy + PU"
                />
              </div>
            </div>
          </div>

          {/* Section B: 25-Year Asset Maintenance Profile */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · 25-Year Asset Maintenance Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Asset Surface Area (m²)</label>
                <input
                  type="number"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Initial CapEx Rate (₹/m²)</label>
                <input
                  type="number"
                  value={initialCostM2}
                  onChange={e => setInitialCostM2(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 650"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">1st Touch-up Maintenance (Year)</label>
                <input
                  type="number"
                  value={firstMaintenanceYr}
                  onChange={e => setFirstMaintenanceYr(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Touch-up Cost (% of Initial)</label>
                <input
                  type="number"
                  value={maintenanceCostPct}
                  onChange={e => setMaintenanceCostPct(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Major Recoat Event (Year)</label>
                <input
                  type="number"
                  value={majorRecoatYr}
                  onChange={e => setMajorRecoatYr(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 16"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Discount Rate (% NPV)</label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={e => setDiscountRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 6"
                />
              </div>
            </div>

            {/* Form Actions: Calculate & Reset */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCalculate}
                className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Calculate Life Cycle Cost</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                25-Year Net Present Value (NPV)
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Asset TCO</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total 25-Year NPV Discounted Cost</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatCur(totalNPV)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Equivalent to {formatCur(annualizedLccM2)} / m² / year across 25 years
              </p>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 font-mono block">Initial CapEx</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{formatCur(initialCapex)}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 font-mono block">Yr {firstMaintenanceYr} (NPV)</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{formatCur(npvMaint)}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[9px] text-slate-400 font-mono block">Yr {majorRecoatYr} (NPV)</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{formatCur(npvRecoat)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
