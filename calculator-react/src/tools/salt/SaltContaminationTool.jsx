import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, ShieldCheck, AlertTriangle, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcBresleSalt, formatNum } from '../../utils/calculations';

export default function SaltContaminationTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [instrument, setInstrument] = useState('');
  const [projectName, setProjectName] = useState('');
  const [blank, setBlank] = useState(''); // µS/cm
  const [sample, setSample] = useState(''); // µS/cm
  const [waterVol, setWaterVol] = useState('3.0'); // ml
  const [temp, setTemp] = useState('25'); // °C
  const [limit, setLimit] = useState('20'); // mg/m²
  const [copied, setCopied] = useState(false);

  const res = (sample !== '' && blank !== '') ? calcBresleSalt(blank, sample, waterVol || 3.0, temp || 25, limit || 20) : null;

  const handleCalculate = () => {
    if (sample === '' || blank === '') {
      addToast('Missing Required Inputs', 'Please enter Sample Conductivity and DI Water Blank.', 'warning');
      return;
    }
    addToast('Calculated Salt Contamination', 'Bresle ISO 8502-9 test evaluation complete.', 'success');
  };

  const handleReset = () => {
    setInstrument('');
    setProjectName('');
    setBlank('');
    setSample('');
    setWaterVol('3.0');
    setTemp('25');
    setLimit('20');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter conductivity readings first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Salt Contamination Test (ISO 8502-9 Bresle Method)
${projectName ? `Project: ${projectName}\n` : ''}${instrument ? `Instrument: ${instrument}\n` : ''}Sample Reading: ${sample} µS/cm | Deionized Water Blank: ${blank} µm/cm
Steel Temperature: ${temp}°C (fT factor: ${formatNum(res.ft, 3)}) | Water: ${waterVol} ml
--------------------------------------
Measured Surface Salt Density: ${formatNum(res.saltMgM2, 1)} mg/m² (${formatNum(res.saltUgCm2, 2)} µg/cm²)
Specified Maximum Limit: ${limit} mg/m²
Acceptance Status: ${res.isPass ? 'PASS (Conforming)' : 'FAIL (Exceeds Limit — Re-washing Required)'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Salt contamination report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool SC-1 · ISO 8502-9
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Salt Contamination Test (Bresle Patch Method)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Conduct ISO 8502-6/9 soluble salt testing with automatic temperature correction (0°C–80°C) and pass/fail evaluation against project criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('salt_test_tool')}
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
              Bresle Conductivity Readings
            </h2>
            <Calculator className="w-4 h-4 text-[#F7941D]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Instrument <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={instrument}
                onChange={e => setInstrument(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Horiba B-771"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Project Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Tank Farm Project"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Surface Sample Conductivity (µS/cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={sample}
                onChange={e => setSample(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 24.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Deionized Water Blank (µS/cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={blank}
                onChange={e => setBlank(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 2.0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Steel Substrate Temperature (°C)
              </label>
              <input
                type="number"
                value={temp}
                onChange={e => setTemp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Injected Water Volume (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={waterVol}
                onChange={e => setWaterVol(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="3.0"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specified Maximum Salt Limit (mg/m²)
              </label>
              <input
                type="number"
                value={limit}
                onChange={e => setLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="20"
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
              <span>Evaluate Salt Content</span>
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
              Standard ISO 8502-9 test patch area is 12.5 cm². Temperature normalization factor $f_T$ adjusts to 25°C standard baseline.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`border-2 rounded-3xl p-6 shadow-sm space-y-5 transition-all duration-300 ${
            res && res.isPass 
              ? 'bg-gradient-to-br from-white to-emerald-50/30 border-emerald-300' 
              : 'bg-gradient-to-br from-white to-rose-50/30 border-rose-300'
          }`}>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-500">
                Test Verdict (ISO 8502-9)
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                res && res.isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {res && res.isPass ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{res && res.isPass ? 'PASS · Conforming' : 'FAIL · Non-Conforming'}</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Surface Salt Density (Corrected @ 25°C)</span>
              <div className={`text-4xl md:text-5xl font-black font-mono mt-1 ${
                res && res.isPass ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {res ? `${formatNum(res.saltMgM2, 1)} mg/m²` : '—'}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Equivalent to {res ? `${formatNum(res.saltUgCm2, 2)} µg/cm²` : '—'} (Limit: {limit} mg/m²)
              </p>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Net Conductivity (Δσ)</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.rawDiff, 1)} µS/cm` : '—'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Temp Factor (fT @ {temp}°C)</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? formatNum(res.ft, 3) : '—'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
