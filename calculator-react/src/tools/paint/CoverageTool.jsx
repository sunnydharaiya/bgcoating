import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, RotateCcw, BookOpen, Play } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcCoverage, formatNum } from '../../utils/calculations';

export default function CoverageTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [paintName, setPaintName] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [loss, setLoss] = useState('20');
  const [area, setArea] = useState('');
  const [coats, setCoats] = useState('1');
  const [copied, setCopied] = useState(false);

  const res = (vs && dft) ? calcCoverage(vs, dft, loss, area || 0, coats || 1) : null;

  const handleCalculate = () => {
    if (!vs || !dft) {
      addToast('Missing Required Inputs', 'Please enter Specified DFT and Volume Solids.', 'warning');
      return;
    }
    addToast('Calculated Coverage', 'Spreading rates computed successfully.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setDft('');
    setVs('');
    setLoss('20');
    setArea('');
    setCoats('1');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Coverage Calculation
Paint Name: ${paintName || 'N/A'}
VS: ${vs}% | Specified DFT: ${dft} µm | Loss Factor: ${loss}%
Project Area: ${area || 'N/A'} m² (${coats} coats)
--------------------------------------------------
Theoretical Spread Rate: ${formatNum(res.theoCoverage, 2)} m²/L (${formatNum(res.theoSqFtGal, 1)} sq ft/gal)
Practical Spread Rate: ${formatNum(res.practCoverage, 2)} m²/L
Total Paint Volume Required: ${res.totalLiters ? `${formatNum(res.totalLiters, 1)} Litres` : 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Coverage calculation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool P-3
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Paint Coverage (Spreading Rate)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theoretical &amp; Practical Spread Rate (m²/L, sq ft/gal) and project paint volume estimator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('coverage')}
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
            <span>{copied ? 'Copied' : 'Share Text'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Coating Specifications
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Specified DFT (µm)
                </label>
                <input
                  type="number"
                  value={dft}
                  onChange={e => setDft(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 75"
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
                  placeholder="e.g. 75"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            {/* Application Loss Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Application Loss Factor (%)
                </label>
                <span className="text-xs font-mono font-extrabold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {loss}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={loss}
                onChange={e => setLoss(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F7941D]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0% Brush/Roller</span>
                <span>15–25% Airless Spray</span>
                <span>30–50% Conv. Spray</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Paint Name / TDS Reference <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={paintName}
                onChange={e => setPaintName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Interzinc 52 / Sigmacover 456"
              />
            </div>

            {/* Optional Project Quantity Estimator Divider */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                ▸ Optional Project Quantity Estimator
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Surface Area (m²)
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 500"
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
                    min="1"
                  />
                </div>
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
              <span>Calculate Coverage</span>
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
              Formula: <code>TC (m²/L) = (VS% × 10) ÷ Specified DFT (µm)</code>. Practical Spread Rate: <code>PS = TC × (1 - Loss%)</code>.
            </span>
          </div>
        </div>

        {/* Right Output Verdict Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Coverage Calculation Result
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                Verified Model
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Theoretical Spread Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {res ? formatNum(res.theoCoverage, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">m²/L</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  ({res ? formatNum(res.theoSqFtGal, 1) : '—'} sq ft/US gal)
                </span>
              </div>

              <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-2xs space-y-1 bg-amber-50/30">
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">
                  Practical Spread Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#D97706]">
                    {res ? formatNum(res.practCoverage, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-amber-700 font-mono">m²/L</span>
                </div>
                <span className="text-[10px] text-amber-600/80 font-mono block">
                  At {loss}% Application Loss
                </span>
              </div>
            </div>

            {/* Project Volume Card if Area provided */}
            {area && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Total Paint Volume ({area} m² · {coats} coat{coats > 1 ? 's' : ''})
                  </span>
                  <span className="text-[10px] font-mono text-[#F7941D] uppercase">
                    Procurement Qty
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {res ? formatNum(res.totalLiters, 1) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-400 font-mono">Litres</span>
                  <span className="text-xs text-slate-400 ml-auto font-mono">
                    ≈ {res ? Math.ceil(res.totalLiters / 20) : 0} drums (20L)
                  </span>
                </div>
              </div>
            )}

            {/* Input Data Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block text-[11px] font-mono uppercase tracking-wider">
                📝 Provided Input Summary
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between"><span>Paint:</span><b className="text-slate-900">{paintName || 'N/A'}</b></div>
                <div className="flex justify-between"><span>Specified DFT:</span><b className="text-slate-900">{dft} µm</b></div>
                <div className="flex justify-between"><span>Volume Solids:</span><b className="text-slate-900">{vs}%</b></div>
                <div className="flex justify-between"><span>Application Loss:</span><b className="text-amber-700">{loss}%</b></div>
                <div className="flex justify-between"><span>Project Area:</span><b className="text-slate-900">{area} m²</b></div>
                <div className="flex justify-between"><span>Coats:</span><b className="text-slate-900">{coats}</b></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
