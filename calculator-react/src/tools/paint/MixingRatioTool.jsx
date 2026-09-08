import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcMixingRatio, formatNum } from '../../utils/calculations';

export default function MixingRatioTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [paintName, setPaintName] = useState('');
  const [totalL, setTotalL] = useState('');
  const [ratioA, setRatioA] = useState('4');
  const [ratioB, setRatioB] = useState('1');
  const [thinner, setThinner] = useState('0');
  const [copied, setCopied] = useState(false);

  const res = (totalL && ratioA && ratioB) ? calcMixingRatio(totalL, ratioA, ratioB, thinner || 0) : null;
  const pctA = (ratioA && ratioB) ? (Number(ratioA) / (Number(ratioA) + Number(ratioB))) * 100 : 80;
  const pctB = 100 - pctA;

  const handleCalculate = () => {
    if (!totalL || !ratioA || !ratioB) {
      addToast('Missing Required Inputs', 'Please enter Total Batch Volume and Component Ratios.', 'warning');
      return;
    }
    addToast('Calculated Mixing Proportions', 'Base, hardener, and thinner quantities ready.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setTotalL('');
    setRatioA('4');
    setRatioB('1');
    setThinner('0');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Mixing Ratio Calculation
${paintName ? `Paint Product: ${paintName}\n` : ''}Ratio: ${ratioA} : ${ratioB} (Part A : Part B) | Total Base Mix: ${totalL} L | Thinner: ${thinner}%
--------------------------------------
Part A (Base): ${formatNum(res.partAVolume, 2)} Litres
Part B (Hardener): ${formatNum(res.partBVolume, 2)} Litres
Thinner Volume: ${formatNum(res.thinnerVolume, 2)} Litres
Total Ready Mixed Paint: ${formatNum(res.totalMixVolume, 2)} Litres`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Mixing ratio breakdown copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool P-6
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Paint Mixing Ratio &amp; Thinner Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate exact volumes of Part A (Base/Resin), Part B (Hardener/Curing Agent), and Thinner with interactive visual fluid ratio indicator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('mixing_ratio')}
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
              Batch Preparation Parameters
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
                placeholder="e.g. Polyurethane Topcoat"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Base Batch Volume Required (Litres A+B)
              </label>
              <input
                type="number"
                value={totalL}
                onChange={e => setTotalL(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Part A Ratio (Base)
                </label>
                <input
                  type="number"
                  value={ratioA}
                  onChange={e => setRatioA(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Part B Ratio (Hardener)
                </label>
                <input
                  type="number"
                  value={ratioB}
                  onChange={e => setRatioB(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Thinner Added (% by volume)
              </label>
              <input
                type="number"
                value={thinner}
                onChange={e => setThinner(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="0"
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
              <span>Calculate Mix Volumes</span>
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
              Always mix Part A and Part B thoroughly before adding thinner. Observe manufacturer pot-life limitations at ambient temperature.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Batch Breakdown &amp; Ratio Bar
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {ratioA}:{ratioB} System
              </span>
            </div>

            {/* Visual Fluid Ratio Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-700">
                <span className="text-amber-600">Part A: {formatNum(pctA, 1)}%</span>
                <span className="text-rose-700">Part B: {formatNum(pctB, 1)}%</span>
              </div>
              <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200 shadow-inner">
                <div 
                  style={{ width: `${pctA}%` }} 
                  className="bg-gradient-to-r from-amber-400 to-[#F7941D] transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white font-mono"
                >
                  Part A
                </div>
                <div 
                  style={{ width: `${pctB}%` }} 
                  className="bg-gradient-to-r from-rose-600 to-[#A41E22] transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white font-mono"
                >
                  Part B
                </div>
              </div>
            </div>

            {/* Output Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono block">Part A (Base/Resin)</span>
                <div className="text-2xl font-black text-[#D97706] font-mono mt-1">
                  {res ? `${formatNum(res.partAVolume, 2)} L` : '—'}
                </div>
              </div>

              <div className="p-4 bg-white border border-rose-200 rounded-2xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono block">Part B (Hardener)</span>
                <div className="text-2xl font-black text-rose-700 font-mono mt-1">
                  {res ? `${formatNum(res.partBVolume, 2)} L` : '—'}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Thinner Volume ({thinner}%)</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.thinnerVolume, 2)} L` : '—'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Total Mix Ready-to-Spray</span>
                <span className="text-base font-bold text-emerald-700 font-mono">
                  {res ? `${formatNum(res.totalMixVolume, 2)} L` : '—'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
