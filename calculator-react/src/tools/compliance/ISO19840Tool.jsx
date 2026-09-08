import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, ShieldCheck, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function ISO19840Tool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & Setup
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');

  const [ndft, setNdft] = useState(''); // Nominal Dry Film Thickness
  const [cv, setCv] = useState(25); // Correction value based on profile: Fine 10, Medium 25, Coarse 40 µm
  const [maxDft, setMaxDft] = useState(''); // 3 × NDFT default or custom
  const [readingsText, setReadingsText] = useState('');
  const [copied, setCopied] = useState(false);

  // Parse readings
  const readings = readingsText
    .split(/[\s,;]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x) && x > 0);

  const minAcceptableIndividual = ndft ? Number(ndft) - Number(cv) : 0; // (NDFT - CV)
  const effectiveMaxDft = maxDft ? Number(maxDft) : (ndft ? Number(ndft) * 3 : 0);
  const averageDft = readings.length > 0 ? readings.reduce((a, b) => a + b, 0) / readings.length : 0;
  const minReading = readings.length > 0 ? Math.min(...readings) : 0;
  const maxReading = readings.length > 0 ? Math.max(...readings) : 0;

  // ISO 19840 80/20 Rule criteria:
  const failLowCount = readings.filter(x => x < minAcceptableIndividual).length;
  const failHighCount = effectiveMaxDft > 0 ? readings.filter(x => x > effectiveMaxDft).length : 0;
  const isAvgOk = ndft ? averageDft >= Number(ndft) : false;
  const isPass = ndft && isAvgOk && failLowCount === 0 && failHighCount === 0 && readings.length >= 2;

  const handleOpenGuideline = () => {
    openGuideline('qa-iso');
  };

  const handleCalculate = () => {
    if (!ndft || readings.length === 0) {
      addToast('Missing Required Inputs', 'Please enter Specified NDFT and gage readings.', 'warning');
      return;
    }
    addToast('Evaluated ISO 19840 Compliance', isPass ? 'Readings satisfy ISO 19840 criteria.' : 'Readings fail ISO 19840 criteria.', isPass ? 'success' : 'warning');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setNdft('');
    setCv(25);
    setMaxDft('');
    setReadingsText('');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!ndft || readings.length === 0) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — ISO 19840 DFT Acceptance Report
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}Specified NDFT: ${ndft} µm | Correction Value (CV): ${cv} µm | Minimum (NDFT-CV): ${minAcceptableIndividual} µm
Individual Readings (${readings.length}): ${readings.join(', ')} µm
--------------------------------------
Average DFT: ${formatNum(averageDft, 1)} µm (Specified ≥ ${ndft} µm)
Min / Max Reading: ${formatNum(minReading, 0)} / ${formatNum(maxReading, 0)} µm
ISO 19840 Acceptance Verdict: ${isPass ? 'PASS (Fully Conforming)' : 'FAIL (Non-Conforming)'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'ISO 19840 report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-QA-2 · ISO 19840
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              DFT Acceptance &amp; Correction (ISO 19840)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validate dry film thickness measurements against ISO 19840 criteria with surface profile Correction Value (CV) subtraction and 80/20 compliance rule.
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
          
          {/* Section A: Project & Setup */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Setup Information
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
                  placeholder="e.g. Offshore Structure Module-B"
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
                  placeholder="e.g. TotalEnergies"
                />
              </div>
            </div>
          </div>

          {/* Section B: Parameters */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · ISO 19840 Specification &amp; CV Setup
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Specified NDFT (µm)</label>
                  <input
                    type="number"
                    value={ndft}
                    onChange={e => setNdft(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Correction CV (µm)</label>
                  <select
                    value={cv}
                    onChange={e => setCv(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  >
                    <option value={10}>10 µm (Fine Profile)</option>
                    <option value={25}>25 µm (Medium Profile)</option>
                    <option value={40}>40 µm (Coarse Profile)</option>
                    <option value={0}>0 µm (Direct Zero Cal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Limit (µm)</label>
                  <input
                    type="number"
                    value={maxDft}
                    onChange={e => setMaxDft(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Individual Gage Readings (µm)
                </label>
                <textarea
                  rows={3}
                  value={readingsText}
                  onChange={e => setReadingsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 185, 210, 195, 220, 205..."
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {readings.length} readings entered. Minimum acceptable reading: (NDFT - CV) = {minAcceptableIndividual} µm.
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
                <span>Evaluate ISO 19840 Compliance</span>
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
                ISO 19840 mandates: Mean ≥ {ndft || 'NDFT'} µm, and every reading ≥ {minAcceptableIndividual} µm with no readings exceeding {effectiveMaxDft || '3×NDFT'} µm.
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
                ISO 19840 Acceptance Verdict
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
              <span className="text-xs text-slate-400 font-mono">Arithmetic Average DFT</span>
              <div className={`text-4xl md:text-5xl font-black font-mono mt-1 ${
                isPass ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {formatNum(averageDft, 1)} µm
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Specified NDFT: {ndft} µm (Min Individual Threshold: {minAcceptableIndividual} µm)
              </p>
            </div>

            {/* Detailed Readings Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Lowest Reading</span>
                <span className={`text-base font-bold font-mono ${minReading < minAcceptableIndividual ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatNum(minReading, 0)} µm {minReading < minAcceptableIndividual ? '✗ (<Min)' : '✓'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Highest Reading</span>
                <span className={`text-base font-bold font-mono ${maxReading > Number(maxDft) ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatNum(maxReading, 0)} µm {maxReading > Number(maxDft) ? '✗ (>Max)' : '✓'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
