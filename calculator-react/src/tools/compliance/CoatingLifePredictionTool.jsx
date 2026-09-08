import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, ShieldCheck, Sun, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function CoatingLifePredictionTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & System
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [structure, setStructure] = useState('');

  const [category, setCategory] = useState('C4');
  const [durability, setDurability] = useState('H'); // 'L' (<7y), 'M' (7-15y), 'H' (15-25y), 'VH' (>25y)
  const [copied, setCopied] = useState(false);

  const envData = {
    C1: { name: 'C1 — Very Low', ext: 'Heated buildings with clean atmospheres (offices, schools).', massLoss: '<10 g/m² · <1.3 µm/yr' },
    C2: { name: 'C2 — Low', ext: 'Atmospheres with low pollution; unheated storage depots.', massLoss: '10–200 g/m² · 1.3–25 µm/yr' },
    C3: { name: 'C3 — Medium', ext: 'Urban and industrial atmospheres, moderate SO2; coastal areas with low salinity.', massLoss: '200–400 g/m² · 25–50 µm/yr' },
    C4: { name: 'C4 — High', ext: 'Industrial areas and coastal areas with moderate salinity; chemical plants.', massLoss: '400–650 g/m² · 50–80 µm/yr' },
    C5: { name: 'C5 — Very High', ext: 'Industrial areas with high humidity and aggressive atmosphere; coastal/offshore with high salinity.', massLoss: '650–1500 g/m² · 80–200 µm/yr' },
    CX: { name: 'CX — Extreme', ext: 'Offshore splash zones, extreme marine salinity, industrial areas with extreme humidity.', massLoss: '>1500 g/m² · >200 µm/yr' }
  };

  const durData = {
    L: { name: 'Low (L)', years: '< 7 Years', dftReq: '120–160 µm (2 coats)' },
    M: { name: 'Medium (M)', years: '7 to 15 Years', dftReq: '160–240 µm (2–3 coats)' },
    H: { name: 'High (H)', years: '15 to 25 Years', dftReq: '240–320 µm (3 coats with Zinc primer)' },
    VH: { name: 'Very High (VH)', years: '> 25 Years', dftReq: '320–400+ µm (3–4 coats or TSA)' }
  };

  const currentEnv = envData[category];
  const currentDur = durData[durability];

  const handleOpenGuideline = () => {
    openGuideline('ce-life');
  };

  const handleCalculate = () => {
    addToast('Evaluated Durability Profile', `Corrosivity ${category} mapped to ${currentDur.name} durability.`, 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setStructure('');
    setCategory('C4');
    setDurability('H');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    const text = `BG CoatingOS™ — ISO 12944 Coating Durability Prediction
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${structure ? `Structure: ${structure}\n` : ''}Environment: ${currentEnv.name} | First-Year Steel Loss: ${currentEnv.massLoss}
Target Durability Regime: ${currentDur.name} (${currentDur.years})
--------------------------------------
Typical Specification Requirement: ${currentDur.dftReq}
Environment Description: ${currentEnv.ext}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Durability prediction copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-CE-2 · ISO 12944
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Coating Durability &amp; Corrosivity (ISO 12944)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Determine standard coating generic systems, film thicknesses, and time-to-first-major-maintenance based on ISO 12944-2 environmental corrosivity (C1 to CX).
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
                A · Project &amp; System Information
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
                  placeholder="e.g. Flare Bridge Refurbishment"
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
                  placeholder="e.g. Abu Dhabi National Oil Company"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Structure Type <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={structure}
                  onChange={e => setStructure(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Offshore Jacket Legs"
                />
              </div>
            </div>
          </div>

          {/* Section B: Corrosivity Category */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · Environmental Corrosivity Category &amp; Target
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Atmospheric Corrosivity Category (ISO 12944-2)
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                >
                  <option value="C1">C1 — Very Low (Internal, dry heated buildings)</option>
                  <option value="C2">C2 — Low (Rural atmospheres, unheated warehouses)</option>
                  <option value="C3">C3 — Medium (Urban / Light industrial, low salinity coastal)</option>
                  <option value="C4">C4 — High (Industrial, chemical plants, moderate coastal)</option>
                  <option value="C5">C5 — Very High (Marine coastal, offshore, aggressive industrial)</option>
                  <option value="CX">CX — Extreme (Offshore splash zones, extreme salinity)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Durability Regime (Time to 1st Major Maintenance)
                </label>
                <select
                  value={durability}
                  onChange={e => setDurability(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                >
                  <option value="L">Low (L) — Less than 7 Years</option>
                  <option value="M">Medium (M) — 7 to 15 Years</option>
                  <option value="H">High (H) — 15 to 25 Years (Standard Industry Target)</option>
                  <option value="VH">Very High (VH) — Greater than 25 Years</option>
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
                  <span>Evaluate Durability</span>
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
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Environment Profile:</span>
                <p className="text-slate-700 font-sans">{currentEnv.ext}</p>
                <p className="text-[10px] text-[#D97706] font-mono mt-1">1st-Year Bare Steel Loss: {currentEnv.massLoss}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Specification Recommendation
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 12944-5</span>
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Service Life Expectancy</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {currentDur.years}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Durability Category: {currentDur.name} in {currentEnv.name.split(' — ')[0]} Environment
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Recommended Paint System Build:</span>
              <p className="text-xs font-bold text-slate-800 font-sans">{currentDur.dftReq}</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
