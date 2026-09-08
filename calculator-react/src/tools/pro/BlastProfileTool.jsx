import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Layers, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { ABRASIVE_DB } from '../../utils/standardsDatabase';
import { formatNum } from '../../utils/calculations';

export default function BlastProfileTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A: Project & Substrate
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [structure, setStructure] = useState('');
  const [steelHardness, setSteelHardness] = useState('');

  const [mediaType, setMediaType] = useState('Steel Grit');
  const [grade, setGrade] = useState('G25');
  const [pressure, setPressure] = useState(''); // bar
  const [copied, setCopied] = useState(false);

  const mediaInfo = ABRASIVE_DB[mediaType];
  const gradeInfo = mediaInfo?.grades[grade] || { p: [50, 70], pr: [5.5, 7.0], cons: [0.7, 1.5], sa: 'Sa 2½', coat: 'Epoxy primer' };

  // Pressure adjustment multiplier: +/- 5% per 0.5 bar deviation from 7 bar
  const effectivePressure = pressure ? Number(pressure) : 7.0;
  const pressureFactor = 1 + (effectivePressure - 7.0) * 0.1;
  const adjMinProfile = Math.round(gradeInfo.p[0] * pressureFactor);
  const adjMaxProfile = Math.round(gradeInfo.p[1] * pressureFactor);

  const handleOpenGuideline = () => {
    openGuideline('pro-abp');
  };

  const handleCalculate = () => {
    if (!pressure) {
      addToast('Missing Required Inputs', 'Please enter Nozzle Pressure (bar).', 'warning');
      return;
    }
    addToast('Calculated Blast Profile', 'Expected anchor profile (Rz) evaluated.', 'success');
  };

  const handleReset = () => {
    setProjectName('');
    setClient('');
    setStructure('');
    setSteelHardness('');
    setMediaType('Steel Grit');
    setGrade('G25');
    setPressure('');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!pressure) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Abrasive Blast Profile Analysis
${projectName ? `Project: ${projectName}\n` : ''}${client ? `Client: ${client}\n` : ''}${structure ? `Structure: ${structure}\n` : ''}Abrasive: ${mediaType} (Grade ${grade}) | Blast Pressure: ${pressure} bar
Hardness: ${mediaInfo?.hard} | Density: ${mediaInfo?.den} | Recyclability: ${mediaInfo?.recy}
--------------------------------------
Expected Surface Profile (Rz): ${adjMinProfile} – ${adjMaxProfile} µm
Standard Cleanliness Achieved: ${gradeInfo.sa}
Recommended Coating Types: ${gradeInfo.coat}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Blast profile analysis copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-ABP-1 · ISO 8503
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Abrasive Size vs. Blast Profile (Rz)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Correlate abrasive media grade, particle size, and blasting pressure to resulting surface anchor profile (Rz µm) and coating system compatibility.
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
          
          {/* Section A: Project & Substrate */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                A · Project &amp; Substrate Information
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
                  placeholder="e.g. Jetty Piping Package"
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
                  placeholder="e.g. Adani Ports"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Structure / Equipment <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={structure}
                  onChange={e => setStructure(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Pipe Rack PR-03"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Steel Hardness <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={steelHardness}
                  onChange={e => setSteelHardness(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. Grade A / 160 HB"
                />
              </div>
            </div>
          </div>

          {/* Section B: Abrasive Media Selection */}
          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              B · Abrasive Media Selection
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Abrasive Media Type</label>
                <select
                  value={mediaType}
                  onChange={e => {
                    setMediaType(e.target.value);
                    const firstGrade = Object.keys(ABRASIVE_DB[e.target.value]?.grades || {})[0];
                    setGrade(firstGrade);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                >
                  {Object.keys(ABRASIVE_DB).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Media Mesh / Size Grade</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  >
                    {Object.keys(mediaInfo?.grades || {}).map(g => (
                      <option key={g} value={g}>{g} ({mediaInfo.grades[g].size})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nozzle Pressure (bar)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pressure}
                    onChange={e => setPressure(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="e.g. 7.0"
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
                  <span>Calculate Anchor Profile</span>
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Media Characteristics:</span>
                <div className="text-xs text-slate-700 font-mono">
                  Hardness: <strong>{mediaInfo?.hard}</strong> · Density: <strong>{mediaInfo?.den}</strong> · Life: <strong>{mediaInfo?.recy}</strong>
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
                Surface Anchor Profile
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {gradeInfo.sa}
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Resulting Surface Profile (Rz)</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {adjMinProfile} – {adjMaxProfile} µm
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                At {pressure} bar blast pressure with {grade} {mediaType}
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Recommended Coating Compatibility:</span>
              <p className="text-xs font-bold text-slate-800 font-sans">{gradeInfo.coat}</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
