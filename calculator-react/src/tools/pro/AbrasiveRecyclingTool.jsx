import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, RefreshCw, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { RECYCLE_DB } from '../../utils/standardsDatabase';
import { formatNum } from '../../utils/calculations';

export default function AbrasiveRecyclingTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & System
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [structure, setStructure] = useState('');
  const [abrasiveCost, setAbrasiveCost] = useState('');
  const [blastedArea, setBlastedArea] = useState('');

  const [media, setMedia] = useState('Steel Grit');
  const [initialChargeKg, setInitialChargeKg] = useState('');
  const [passes, setPasses] = useState('');
  const [customBreakdown, setCustomBreakdown] = useState('1.0'); // % breakdown per pass
  const [copied, setCopied] = useState(false);

  const mediaInfo = RECYCLE_DB[media] || RECYCLE_DB['Steel Grit'];
  const breakdownPct = media === 'Custom' ? Number(customBreakdown || 1.0) : mediaInfo.brk;

  // Mass balance calculations
  const hasInputs = initialChargeKg && passes;
  const retainedFraction = hasInputs ? Math.pow(1 - breakdownPct / 100, Number(passes)) : 0;
  const remainingReusableKg = hasInputs ? Number(initialChargeKg) * retainedFraction : 0;
  const totalFinesLossKg = hasInputs ? Number(initialChargeKg) - remainingReusableKg : 0;
  const makeupRequiredKg = totalFinesLossKg;

  const handleOpenGuideline = () => {
    openGuideline('pro-arc');
  };

  const handleCalculate = () => {
    if (!initialChargeKg || !passes) {
      addToast('Missing Required Inputs', 'Please enter Initial Hopper Charge and Number of Blast Cycles.', 'warning');
      return;
    }
    addToast('Calculated Recycling Performance', 'Working mix balance and fines loss computed.', 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setStructure('');
    setAbrasiveCost('');
    setBlastedArea('');
    setMedia('Steel Grit');
    setInitialChargeKg('');
    setPasses('');
    setCustomBreakdown('1.0');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!hasInputs) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Abrasive Recycling Performance
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${structure ? `Structure: ${structure}\n` : ''}Media: ${media} (${mediaInfo.life} cycles) | Initial Charge: ${initialChargeKg} kg | Cycles: ${passes} passes
Breakdown Rate: ${breakdownPct}% per pass
--------------------------------------
Reusable Media Remaining: ${formatNum(remainingReusableKg, 0)} kg (${formatNum(retainedFraction * 100, 1)}%)
Total Fines / Dust Waste: ${formatNum(totalFinesLossKg, 0)} kg
Fresh Makeup Abrasive Required: ${formatNum(makeupRequiredKg, 0)} kg`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Abrasive recycling report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-ARC-1
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Abrasive Multi-Pass Recycling Performance
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate media breakdown loss, fines extraction, reusable mass fraction, and fresh makeup additions across multi-cycle blast operations.
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
          
          {/* Section A: Project & System */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Blasting System
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
                  placeholder="e.g. Blast Room #2 Weekly Review"
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
                  placeholder="e.g. L&T Heavy Engineering"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Structure / Equipment <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={structure}
                  onChange={e => setStructure(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Pressure Vessel V-301"
                />
              </div>
            </div>
          </div>

          {/* Section B: Recycling Parameters */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · Recycling Parameters
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Abrasive Media</label>
                <select
                  value={media}
                  onChange={e => setMedia(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                >
                  {Object.keys(RECYCLE_DB).map(m => (
                    <option key={m} value={m}>{m} ({RECYCLE_DB[m].rating})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Initial Hopper Charge (kg)</label>
                  <input
                    type="number"
                    value={initialChargeKg}
                    onChange={e => setInitialChargeKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 5000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Blast Cycles / Passes</label>
                  <input
                    type="number"
                    value={passes}
                    onChange={e => setPasses(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 10"
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
                  <span>Calculate Recycling</span>
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Media Benchmark:</span>
                <div className="text-slate-700 font-mono">
                  Typical Life: <strong>{mediaInfo.life} cycles</strong> · Breakdown: <strong>{mediaInfo.brk}% / cycle</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Working Mix Balance
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{passes} Cycles</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Fresh Makeup Abrasive Required</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatNum(makeupRequiredKg, 0)} kg
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                To replenish {formatNum(totalFinesLossKg, 0)} kg of dust/fines extracted after {passes} cycles
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Reusable Retained Media</span>
                <span className="text-base font-bold text-emerald-700 font-mono">
                  {formatNum(remainingReusableKg, 0)} kg ({formatNum(retainedFraction * 100, 1)}%)
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Dust / Fines Discarded</span>
                <span className="text-base font-bold text-rose-600 font-mono">
                  {formatNum(totalFinesLossKg, 0)} kg
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
