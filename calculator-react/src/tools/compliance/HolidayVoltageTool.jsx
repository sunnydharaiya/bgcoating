import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Zap, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function HolidayVoltageTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & Material
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [coatingType, setCoatingType] = useState('');

  const [dft, setDft] = useState(''); // microns
  const [method, setMethod] = useState('g62'); // 'g62' | 'sp0188'
  const [copied, setCopied] = useState(false);

  const mils = dft ? Number(dft) / 25.4 : 0;

  // ASTM G62: V = 525 * sqrt(mils)
  const vG62 = mils > 0 ? 525 * Math.sqrt(mils) : 0;
  const kvG62 = vG62 / 1000;

  // NACE SP0188 Table lookup / interpolation
  const holTable = (d) => {
    if (!d || d <= 0) return 0;
    const table = [[250, 1.5], [500, 2.5], [1000, 3.5], [1500, 4.5], [2000, 5.5], [3000, 7.0]];
    if (d <= table[0][0]) return table[0][1] * Math.max(0.4, d / table[0][0]);
    if (d >= table[table.length - 1][0]) {
      const [d1, v1] = table[table.length - 2];
      const [d2, v2] = table[table.length - 1];
      return v2 + (d - d2) * (v2 - v1) / (d2 - d1);
    }
    for (let i = 0; i < table.length - 1; i++) {
      if (d >= table[i][0] && d <= table[i + 1][0]) {
        const [d1, v1] = table[i];
        const [d2, v2] = table[i + 1];
        return v1 + (d - d1) * (v2 - v1) / (d2 - d1);
      }
    }
    return 2.5;
  };

  const kvSp0188 = holTable(Number(dft || 0));
  const recommendedKv = method === 'g62' ? kvG62 : kvSp0188;
  const isThinFilm = dft && Number(dft) <= 500 && Number(dft) > 0;

  const handleOpenGuideline = () => {
    openGuideline('qa-hol');
  };

  const handleCalculate = () => {
    if (!dft) {
      addToast('Missing Required Inputs', 'Please enter Total Dry Film Thickness (DFT).', 'warning');
      return;
    }
    addToast('Calculated Test Voltage', 'Holiday test voltage computed.', 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setCoatingType('');
    setDft('');
    setMethod('g62');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!dft) {
      addToast('No Calculation', 'Please enter DFT first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Holiday Detection Voltage Report
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${coatingType ? `Coating Type: ${coatingType}\n` : ''}Coating DFT: ${dft} µm (${formatNum(mils, 1)} mils) | Standard: ${method === 'g62' ? 'ASTM G62 Formula' : 'NACE SP0188 Table'}
--------------------------------------
Recommended Test Voltage: ${formatNum(recommendedKv, 2)} kV (${formatNum(recommendedKv * 1000, 0)} Volts)
ASTM G62 Calc: ${formatNum(kvG62, 2)} kV | NACE SP0188 Calc: ${formatNum(kvSp0188, 2)} kV
Test Type: ${isThinFilm ? 'Consider Low-Voltage Wet Sponge (<=500 um)' : 'High-Voltage Spark Detector'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Holiday voltage report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-QA-3 · NACE SP0188 / ASTM G62
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Holiday Spark Test Voltage Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Determine high-voltage dielectric spark testing settings to detect pinholes without puncturing or burning the protective coating film.
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
          
          {/* Section A: Project & Material */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Material Information
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
                  placeholder="e.g. Tank Bottom Lining Package"
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
                  placeholder="e.g. Nayara Energy"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Coating Generic Type <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={coatingType}
                  onChange={e => setCoatingType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Solvent-free High Build Epoxy"
                />
              </div>
            </div>
          </div>

          {/* Section B: Holiday Voltage Setup */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · Film Thickness &amp; Testing Standard
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Total Dry Film Thickness (DFT in µm)
                </label>
                <input
                  type="number"
                  value={dft}
                  onChange={e => setDft(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 500"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Equivalent to {formatNum(mils, 1)} mils (thousandths of an inch).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Testing Standard / Method
                </label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                >
                  <option value="g62">ASTM G62 (V = 525 × √t(mils) Formula)</option>
                  <option value="sp0188">NACE SP0188 (Table Interpolation Method)</option>
                </select>
              </div>

              {/* Form Actions: Calculate & Reset */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Calculate Voltage</span>
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

              {isThinFilm && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-xs text-[#D97706]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Thin Film Warning (≤ 500 µm):</strong> High-voltage spark testing can cause dielectric burn-through. Consider ASTM D5162 Type I low-voltage wet-sponge testing (9V–90V).
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Recommended Test Voltage
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Dielectric Test</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Calibrated Spark Voltage</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatNum(recommendedKv, 2)} kV
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                {formatNum(recommendedKv * 1000, 0)} Volts DC ({method === 'g62' ? 'ASTM G62' : 'NACE SP0188'})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">ASTM G62 Calc</span>
                <span className="text-base font-bold text-slate-800 font-mono">{formatNum(kvG62, 2)} kV</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">NACE SP0188 Calc</span>
                <span className="text-base font-bold text-slate-800 font-mono">{formatNum(kvSp0188, 2)} kV</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
