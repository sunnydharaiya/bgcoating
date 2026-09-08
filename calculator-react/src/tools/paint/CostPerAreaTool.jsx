import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcCostPerArea, formatNum, formatCur } from '../../utils/calculations';

export default function CostPerAreaTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [paintName, setPaintName] = useState('');
  const [area, setArea] = useState('');
  const [paintL, setPaintL] = useState('');
  const [paintPrice, setPaintPrice] = useState('');
  const [thinnerL, setThinnerL] = useState('');
  const [thinnerPrice, setThinnerPrice] = useState('');
  const [copied, setCopied] = useState(false);

  const res = (area && paintL && paintPrice) ? calcCostPerArea(area, paintL, paintPrice, thinnerL || 0, thinnerPrice || 0) : null;

  const handleCalculate = () => {
    if (!area || !paintL || !paintPrice) {
      addToast('Missing Required Inputs', 'Please enter Coated Area, Paint Quantity, and Paint Unit Price.', 'warning');
      return;
    }
    addToast('Calculated Cost Per Area', 'Material costing breakdown computed.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setArea('');
    setPaintL('');
    setPaintPrice('');
    setThinnerL('');
    setThinnerPrice('');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Cost Per Area Calculation
${paintName ? `Paint Product: ${paintName}\n` : ''}Area: ${area} m² | Paint: ${paintL}L @ ₹${paintPrice}/L | Thinner: ${thinnerL || 0}L @ ₹${thinnerPrice || 0}/L
--------------------------------------
Total Material Cost: ${formatCur(res.totalCost)}
Cost per Square Metre: ${formatCur(res.costPerSqM)} / m²
Cost per Square Foot: ${formatCur(res.costPerSqFt)} / sq.ft`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Cost per area breakdown copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool P-7
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Paint Cost Per Area Calculator (₹/m²)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Determine material coating cost per square metre (₹/m²) and square foot for commercial project budgeting and contractor tender estimation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('cost_per_area')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Material Quantities &amp; Unit Rates
            </h2>
            <Calculator className="w-4 h-4 text-[#F7941D]" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Paint Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={paintName}
                onChange={e => setPaintName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Zinc Phosphate Epoxy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Coated Area (m²)
              </label>
              <input
                type="number"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 850"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Total Paint Quantity (Litres)
                </label>
                <input
                  type="number"
                  value={paintL}
                  onChange={e => setPaintL(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 150"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Paint Unit Price (₹/Litre)
                </label>
                <input
                  type="number"
                  value={paintPrice}
                  onChange={e => setPaintPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 480"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Thinner Quantity (Litres)
                </label>
                <input
                  type="number"
                  value={thinnerL}
                  onChange={e => setThinnerL(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 15"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Thinner Unit Price (₹/Litre)
                </label>
                <input
                  type="number"
                  value={thinnerPrice}
                  onChange={e => setThinnerPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 180"
                />
              </div>
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
              <span>Calculate Cost / m²</span>
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

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Formula: <code>Cost/m² = ((Paint Litres × Rate) + (Thinner Litres × Rate)) ÷ Area m²</code>.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Unit Area Costing
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                Project Budget
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Material Cost Per Square Metre</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {res ? `${formatCur(res.costPerSqM)}` : '—'}
                <span className="text-xs text-slate-500 font-normal font-sans ml-1">/ m²</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Approx. {res ? `${formatCur(res.costPerSqFt)}` : '—'} / sq.ft
              </p>
            </div>

            {/* Detailed Cost Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Paint Cost</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? formatCur(res.paintCost) : '—'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Thinner Cost</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? formatCur(res.thinnerCost) : '—'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Total Material Expenditure</span>
              <span className="text-xl font-black text-slate-900 font-mono text-[#D97706]">
                {res ? formatCur(res.totalCost) : '—'}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
