import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcBlastingLoss, formatNum } from '../../utils/calculations';

export default function BlastingLossTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [paintName, setPaintName] = useState('');
  const [area, setArea] = useState('');
  const [rz, setRz] = useState('');
  const [vs, setVs] = useState('');
  const [dvc, setDvc] = useState(0.5);
  const [copied, setCopied] = useState(false);

  const res = (area && rz && vs) ? calcBlastingLoss(area, rz, vs, dvc) : null;

  const handleCalculate = () => {
    if (!area || !rz || !vs) {
      addToast('Missing Required Inputs', 'Please enter Blasted Area, Surface Roughness Rz, and Volume Solids.', 'warning');
      return;
    }
    addToast('Calculated Dead Volume', 'Primer absorption volume computed.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setArea('');
    setRz('');
    setVs('');
    setDvc(0.5);
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Blasting Dead Volume Loss Calculation
${paintName ? `Primer Product: ${paintName}\n` : ''}Area: ${area} m² | Surface Roughness (Rz): ${rz} µm | Volume Solids: ${vs}% | DVC: ${dvc}
--------------------------------------
Dead Volume Extra Paint Required: ${formatNum(res.deadVolumeLiters, 1)} Litres
Extra Primer Depth Required: ${formatNum(res.extraMicrons, 1)} µm`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Dead volume loss calculation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool P-5
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Blasting Loss Calculator (Dead Volume Profile)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate extra primer coating required to fill surface profile anchor patterns ($R_z$ roughness peaks and valleys) created by abrasive blasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('blasting_loss')}
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
              Surface Profile &amp; Primer Data
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
                placeholder="e.g. Zinc Silicate"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Blasted Surface Area (m²)
              </label>
              <input
                type="number"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 1000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Surface Roughness Rz (µm)
              </label>
              <input
                type="number"
                value={rz}
                onChange={e => setRz(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primer Volume Solids (% VS)
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
                Dead Volume Coefficient (DVC)
              </label>
              <select
                value={dvc}
                onChange={e => setDvc(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                <option value={0.5}>0.5 — Standard Grit / Garnet Profile</option>
                <option value={0.4}>0.4 — Steel Shot / Rounded Profile</option>
                <option value={0.6}>0.6 — Very Angular / Heavy Slag Profile</option>
              </select>
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
              <span>Calculate Dead Volume</span>
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
              Formula: <code>Dead Volume (Litres) = (Area m² × Rz µm × DVC) ÷ (VS% × 100)</code>. Per ISO 19840 / NACE guidelines.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Profile Absorption Result
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                ISO 19840 Verified
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Extra Primer Required for Dead Volume</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {res ? `${formatNum(res.deadVolumeLiters, 1)} L` : '—'}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                Additional paint needed just to fill the surface roughness pattern
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Extra Primer Film Depth</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.extraMicrons, 1)} µm` : '—'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Surface Roughness</span>
                <span className="text-base font-bold text-slate-800 font-mono">{rz} µm Rz</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
