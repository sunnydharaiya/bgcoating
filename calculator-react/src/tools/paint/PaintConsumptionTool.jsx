import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcPaintConsumption, formatNum } from '../../utils/calculations';

export default function PaintConsumptionTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [paintName, setPaintName] = useState('');
  const [area, setArea] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [loss, setLoss] = useState('30');
  const [coats, setCoats] = useState('1');
  const [copied, setCopied] = useState(false);

  const res = (area && dft && vs) ? calcPaintConsumption(area, dft, vs, loss, coats || 1) : null;

  const handleCalculate = () => {
    if (!area || !dft || !vs) {
      addToast('Missing Required Inputs', 'Please enter Surface Area, Specified DFT, and Volume Solids.', 'warning');
      return;
    }
    addToast('Calculated Paint Demand', 'Paint consumption and packaging requirement computed.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setArea('');
    setDft('');
    setVs('');
    setLoss('30');
    setCoats('1');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Consumption Calculation
${paintName ? `Paint Product: ${paintName}\n` : ''}Area: ${area} m² | DFT: ${dft} µm | VS: ${vs}% | Loss: ${loss}% | Coats: ${coats}
--------------------------------------
Theoretical Litres: ${formatNum(res.totalTheoLiters, 1)} L
Practical Total Paint Required: ${formatNum(res.totalPractLiters, 1)} L (${Math.ceil(res.totalPractLiters / 20)} × 20L Drums)
Loss Volume: ${formatNum(res.lossLiters, 1)} L`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Paint consumption calculation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool P-4
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Paint Consumption Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Estimate total liquid paint volume (Litres &amp; Drum counts) required for coating a structure based on area, thickness, and application loss factor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('paint_consumption')}
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
              Job Scope &amp; Film Thickness
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
                placeholder="e.g. High Build Epoxy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Surface Area (m²)
              </label>
              <input
                type="number"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 1200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specified DFT (µm)
              </label>
              <input
                type="number"
                value={dft}
                onChange={e => setDft(e.target.value)}
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
                Number of Coats
              </label>
              <input
                type="number"
                value={coats}
                onChange={e => setCoats(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="1"
              />
            </div>

            {/* Application Loss Slider */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Application Loss Factor</label>
                <span className="font-mono font-bold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{loss}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={loss}
                onChange={e => setLoss(Number(e.target.value))}
                className="w-full accent-[#F7941D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Shop/Roller)</span>
                <span>25–35% (Airless Spray)</span>
                <span>50%+ (Windy Site/Lattice)</span>
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
              <span>Calculate Paint Demand</span>
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
              Formula: <code>Litres = (Area m² × DFT µm) ÷ (VS% × 10 × (1 - Loss% ÷ 100))</code>.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Total Paint Volume Requirement
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                Procurement
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Practical Paint Requirement ({loss}% Loss)</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {res ? `${formatNum(res.totalPractLiters, 1)} L` : '—'}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Order Recommendation: {res ? `${Math.ceil(res.totalPractLiters / 20)} × 20L Drums` : '—'}
              </p>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Theoretical Paint</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.totalTheoLiters, 1)} L` : '—'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Estimated Loss</span>
                <span className="text-base font-bold text-rose-600 font-mono">
                  {res ? `+${formatNum(res.lossLiters, 1)} L` : '—'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
