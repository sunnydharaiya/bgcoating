import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcWFTRange, formatNum } from '../../utils/calculations';

export default function WFTRangeTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [paintName, setPaintName] = useState('');
  const [minDft, setMinDft] = useState('');
  const [maxDft, setMaxDft] = useState('');
  const [vs, setVs] = useState('');
  const [thinner, setThinner] = useState('0');
  const [copied, setCopied] = useState(false);

  const res = (minDft && maxDft && vs) ? calcWFTRange(minDft, maxDft, vs, thinner) : null;

  const handleCalculate = () => {
    if (!minDft || !maxDft || !vs) {
      addToast('Missing Required Inputs', 'Please enter Min DFT, Max DFT, and Volume Solids.', 'warning');
      return;
    }
    addToast('Calculated WFT Range', 'Wet film thickness targets computed.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setMinDft('');
    setMaxDft('');
    setVs('');
    setThinner('0');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — WFT Range Calculation
${paintName ? `Paint Product: ${paintName}\n` : ''}Min DFT: ${minDft} µm | Max DFT: ${maxDft} µm
Volume Solids: ${vs}% | Thinner: ${thinner}%
--------------------------------------
Result: ${formatNum(res.minWft, 1)} µm to ${formatNum(res.maxWft, 1)} µm WFT Target`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool P-1
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              WFT Range Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate the required Wet Film Thickness (WFT) range from specified Minimum and Maximum Dry Film Thickness (DFT).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('wft_range')}
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
              Coating System Parameters
            </h2>
            <Calculator className="w-4 h-4 text-[#F7941D]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Paint Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={paintName}
                onChange={e => setPaintName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Inorganic Zinc Silicate"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Minimum Specified DFT (µm)
              </label>
              <input
                type="number"
                value={minDft}
                onChange={e => setMinDft(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Maximum Specified DFT (µm)
              </label>
              <input
                type="number"
                value={maxDft}
                onChange={e => setMaxDft(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Volume Solids (% VS)
              </label>
              <input
                type="number"
                value={vs}
                onChange={e => setVs(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 65"
              />
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
              <span>Calculate WFT Range</span>
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
              Formula: <code>WFT = DFT × (100 + Thinner%) ÷ Volume Solids%</code>. Always verify against the manufacturer's Technical Data Sheet (TDS).
            </span>
          </div>
        </div>

        {/* Right Output Verdict Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Calculated Inspector Target
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                Verified Formula
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Recommended WFT Range</span>
              <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {res ? `${formatNum(res.minWft, 0)} – ${formatNum(res.maxWft, 0)} µm` : '—'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {res ? `Target wet film thickness to achieve ${minDft}–${maxDft} µm dry film` : 'Enter DFT and solids above to compute'}
              </p>
            </div>

            {/* Detailed Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Minimum WFT</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.minWft, 1)} µm` : '—'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Maximum WFT</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.maxWft, 1)} µm` : '—'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
