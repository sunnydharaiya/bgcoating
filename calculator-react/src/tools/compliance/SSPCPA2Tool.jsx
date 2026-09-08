import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, ShieldCheck, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function SSPCPA2Tool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & Inspection Scope
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [inspector, setInspector] = useState('');
  const [gaugeSn, setGaugeSn] = useState('');
  const [calDate, setCalDate] = useState('');

  const [specDft, setSpecDft] = useState('');
  const [maxPct, setMaxPct] = useState(120); // 120% default SSPC-PA 2 level 3
  const [spotReadingsText, setSpotReadingsText] = useState('');
  const [copied, setCopied] = useState(false);

  // Parse spot measurements
  const spots = spotReadingsText
    .split(/[\s,;]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x) && x > 0);

  const minAllowed = specDft ? Number(specDft) * 0.8 : 0;
  const maxAllowed = specDft ? Number(specDft) * (Number(maxPct) / 100) : 0;

  const averageDft = spots.length > 0 ? spots.reduce((a, b) => a + b, 0) / spots.length : 0;
  const minSpot = spots.length > 0 ? Math.min(...spots) : 0;
  const maxSpot = spots.length > 0 ? Math.max(...spots) : 0;

  const failLowCount = spots.filter(x => x < minAllowed).length;
  const failHighCount = spots.filter(x => x > maxAllowed).length;
  const isAvgOk = specDft ? averageDft >= Number(specDft) : false;
  const isPass = specDft && isAvgOk && failLowCount === 0 && failHighCount === 0 && spots.length >= 2;

  const handleOpenGuideline = () => {
    openGuideline('qa-pa2');
  };

  const handleCalculate = () => {
    if (!specDft || spots.length === 0) {
      addToast('Missing Required Inputs', 'Please enter Specified Target DFT and spot readings.', 'warning');
      return;
    }
    addToast('Evaluated SSPC-PA 2 Compliance', isPass ? 'Spot readings satisfy SSPC-PA 2.' : 'Readings fail SSPC-PA 2 criteria.', isPass ? 'success' : 'warning');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setInspector('');
    setGaugeSn('');
    setCalDate('');
    setSpecDft('');
    setMaxPct(120);
    setSpotReadingsText('');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!specDft || spots.length === 0) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — SSPC-PA 2 DFT Compliance Report
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${inspector ? `Inspector: ${inspector}\n` : ''}${gaugeSn ? `Gauge S/N: ${gaugeSn}\n` : ''}Specified DFT: ${specDft} µm | Max Limit: ${maxPct}% (${formatNum(maxAllowed, 0)} µm) | Min 80%: ${formatNum(minAllowed, 0)} µm
Spot Readings (${spots.length}): ${spots.join(', ')} µm
--------------------------------------
Area Average DFT: ${formatNum(averageDft, 1)} µm (Specified ≥ ${specDft} µm)
Min / Max Spot: ${formatNum(minSpot, 0)} / ${formatNum(maxSpot, 0)} µm
SSPC-PA 2 Acceptance Verdict: ${isPass ? 'PASS (Fully Conforming)' : 'FAIL (Non-Conforming)'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'SSPC-PA 2 compliance report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-QA-1 · SSPC-PA 2
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              DFT Compliance &amp; Acceptance (SSPC-PA 2)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate spot DFT measurements against SSPC-PA 2 80/120 rules, spot minimums, maximum threshold limits, and area averages.
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
          
          {/* Section A: Project & Inspection Scope */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Inspection Scope
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
                  placeholder="e.g. Flare Header Painting"
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
                  placeholder="e.g. HPCL-Mittal Pipelines"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Inspector Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={inspector}
                  onChange={e => setInspector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. NACE CIP Level 2 #12345"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gauge Serial No <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={gaugeSn}
                  onChange={e => setGaugeSn(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Elcometer 456 #SN-9821"
                />
              </div>
            </div>
          </div>

          {/* Section B: SSPC-PA 2 Criteria */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · SSPC-PA 2 Specification &amp; Spot Measurements
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Specified Target DFT (µm)
                  </label>
                  <input
                    type="number"
                    value={specDft}
                    onChange={e => setSpecDft(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 250"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    SSPC-PA 2 Max Spot Limit (%)
                  </label>
                  <select
                    value={maxPct}
                    onChange={e => setMaxPct(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  >
                    <option value={120}>Level 3: 120% Max (Standard)</option>
                    <option value={110}>Level 2: 110% Max (Tight)</option>
                    <option value={150}>Level 4: 150% Max (High Build)</option>
                    <option value={100}>Level 1: 100% Max (Spec Limit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Spot Measurements (µm, comma or space separated)
                </label>
                <textarea
                  rows={3}
                  value={spotReadingsText}
                  onChange={e => setSpotReadingsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 240, 260, 255, 230, 270"
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {spots.length} spot measurements entered (Minimum 5 spots recommended per 10 m² area).
                </span>
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
                <span>Evaluate PA-2 Compliance</span>
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

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-500 flex items-start gap-2 mt-4">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Rules: Spot readings must be between <strong>{formatNum(minAllowed, 0)} µm (80%)</strong> and <strong>{formatNum(maxAllowed, 0)} µm ({maxPct}%)</strong>, and Area Average must be ≥ <strong>{specDft || '0'} µm</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`border-2 rounded-3xl p-6 shadow-sm space-y-5 transition-all duration-300 ${
            isPass 
              ? 'bg-gradient-to-br from-white to-emerald-50/30 border-emerald-300' 
              : 'bg-gradient-to-br from-white to-rose-50/30 border-rose-300'
          }`}>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-500">
                SSPC-PA 2 Acceptance Verdict
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isPass ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{isPass ? 'PASS · Fully Conforming' : 'FAIL · Non-Conforming'}</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Area Average Dry Film Thickness</span>
              <div className={`text-4xl md:text-5xl font-black font-mono mt-1 ${
                isPass ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {formatNum(averageDft, 1)} µm
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Specified: {specDft} µm (Allowable Range: {formatNum(minAllowed, 0)}–{formatNum(maxAllowed, 0)} µm)
              </p>
            </div>

            {/* Detailed Readings Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Lowest Spot</span>
                <span className={`text-base font-bold font-mono ${minSpot < minAllowed ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatNum(minSpot, 0)} µm {minSpot < minAllowed ? '✗ (<80%)' : '✓'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Highest Spot</span>
                <span className={`text-base font-bold font-mono ${maxSpot > maxAllowed ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatNum(maxSpot, 0)} µm {maxSpot > maxAllowed ? '✗ (>Max)' : '✓'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
