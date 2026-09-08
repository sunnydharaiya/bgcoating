import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, ShieldAlert, Activity, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function CorrosionRateTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Asset & Inspection Record
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [tagId, setTagId] = useState('');

  const [initialThkMm, setInitialThkMm] = useState(''); // mm nominal
  const [currentThkMm, setCurrentThkMm] = useState(''); // mm measured
  const [exposureYears, setExposureYears] = useState(''); // years
  const [minAllowableMm, setMinAllowableMm] = useState(''); // mm Tmin
  const [copied, setCopied] = useState(false);

  // Calculations
  const hasInputs = initialThkMm && currentThkMm && exposureYears;
  const metalLossMm = hasInputs ? Math.max(0, Number(initialThkMm) - Number(currentThkMm)) : 0;
  const rateMmPerYear = hasInputs && Number(exposureYears) > 0 ? metalLossMm / Number(exposureYears) : 0;
  const rateMpy = rateMmPerYear * 39.3701; // mm/yr to mils per year (mpy)

  // Remaining asset life
  const remainingCorrosionAllowanceMm = (currentThkMm && minAllowableMm) ? Math.max(0, Number(currentThkMm) - Number(minAllowableMm)) : 0;
  const remainingLifeYears = rateMmPerYear > 0 ? remainingCorrosionAllowanceMm / rateMmPerYear : (hasInputs ? 99 : 0);

  // Corrosion severity classification (NACE / API 570)
  const getCategory = (mpy) => {
    if (!hasInputs) return { name: '—', color: 'text-slate-500 bg-slate-50 border-slate-200' };
    if (mpy < 1.0) return { name: 'Low / Negligible (<1 mpy)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (mpy <= 5.0) return { name: 'Moderate (1–5 mpy)', color: 'text-[#D97706] bg-amber-50 border-amber-200' };
    if (mpy <= 10.0) return { name: 'High (5–10 mpy)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { name: 'Severe (>10 mpy — Immediate Action Required)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const category = getCategory(rateMpy);

  const handleOpenGuideline = () => {
    openGuideline('ce-rate');
  };

  const handleCalculate = () => {
    if (!initialThkMm || !currentThkMm || !exposureYears) {
      addToast('Missing Required Inputs', 'Please enter Initial Thickness, Current Measured Thickness, and Exposure Duration.', 'warning');
      return;
    }
    addToast('Calculated Corrosion Rate', 'Metal loss and remaining asset life evaluated.', 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setTagId('');
    setInitialThkMm('');
    setCurrentThkMm('');
    setExposureYears('');
    setMinAllowableMm('');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!hasInputs) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Corrosion Rate & Asset Integrity Assessment
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${tagId ? `Asset/Tag ID: ${tagId}\n` : ''}Initial Thickness: ${initialThkMm} mm | Current Measured: ${currentThkMm} mm | Exposure: ${exposureYears} Years
--------------------------------------
Metal Loss: ${formatNum(metalLossMm, 2)} mm
Corrosion Rate: ${formatNum(rateMmPerYear, 3)} mm/year (${formatNum(rateMpy, 2)} mpy)
Severity Class: ${category.name}
Remaining Corrosion Allowance: ${formatNum(remainingCorrosionAllowanceMm, 2)} mm (T_min: ${minAllowableMm || '—'} mm)
Estimated Remaining Safe Asset Life: ${formatNum(remainingLifeYears, 1)} Years`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Corrosion rate report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-CE-1 · API 570
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Corrosion Rate &amp; Metal Loss Prediction
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate corrosion rates (mpy &amp; mm/year), wall thinning, and forecast remaining safe operational asset life before reaching minimum allowable wall thickness (T_min).
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
          
          {/* Section A: Asset & Inspection Record */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Asset &amp; Inspection Record
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
                  placeholder="e.g. Jetty Line Corrosion Survey"
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
                  placeholder="e.g. Shell LNG"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Asset / Tag ID <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={tagId}
                  onChange={e => setTagId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 14&quot;-PL-602-CS"
                />
              </div>
            </div>
          </div>

          {/* Section B: Thickness History */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · Ultrasonic Thickness (UT) Measurements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Initial / Nominal Thickness (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={initialThkMm}
                  onChange={e => setInitialThkMm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 12.0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Measured Thickness (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentThkMm}
                  onChange={e => setCurrentThkMm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 10.2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Exposure Service Duration (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={exposureYears}
                  onChange={e => setExposureYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 6"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Allowable Wall T_min (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={minAllowableMm}
                  onChange={e => setMinAllowableMm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 6.0"
                />
              </div>
            </div>

            {/* Form Actions: Calculate & Reset */}
            <div className="flex gap-2.5 pt-4">
              <button
                type="button"
                onClick={handleCalculate}
                className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Calculate Corrosion Rate</span>
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
                Corrosion Rate &amp; Remaining Life
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>API 570 Norm</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Calculated Annual Metal Loss Rate</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatNum(rateMpy, 2)} mpy
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                {formatNum(rateMmPerYear, 3)} mm/year ({category.name.split(' (')[0]})
              </p>
            </div>

            {/* Remaining Life Banner */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-800">Forecast Remaining Life</span>
                <span className="text-xs text-slate-600 block">Until T_min ({minAllowableMm} mm) reached</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-800 font-mono">
                  {formatNum(remainingLifeYears, 1)} Years
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Total Wall Thinning</span>
                <span className="text-base font-bold text-rose-600 font-mono">{formatNum(metalLossMm, 2)} mm</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Corrosion Allowance Left</span>
                <span className="text-base font-bold text-slate-800 font-mono">{formatNum(remainingCorrosionAllowanceMm, 2)} mm</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
