import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function StructureWeightTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [structureName, setStructureName] = useState('');
  const [tonnage, setTonnage] = useState('');
  const [structureType, setStructureType] = useState('medium');
  const [customRate, setCustomRate] = useState('25');
  const [copied, setCopied] = useState(false);

  const rates = {
    ultralight: { name: 'Ultra Light Fabrication (<25 kg/m)', rate: 35, desc: 'Purlins, light trusses, walkways, handrails' },
    light: { name: 'Light Structural Steel (25–45 kg/m)', rate: 30, desc: 'Secondary framing, bracing, pipe racks' },
    medium: { name: 'Medium Structural Steel (45–80 kg/m)', rate: 25, desc: 'Primary beams, portal frames, process platforms' },
    heavy: { name: 'Heavy Structural Steel (80–150 kg/m)', rate: 20, desc: 'Heavy mill columns, crane girders, offshore topsides' },
    ultraheavy: { name: 'Ultra Heavy Sections (>150 kg/m)', rate: 15, desc: 'Major bridge girders, heavy built-up box columns' },
    custom: { name: 'Custom Defined Tonnage Rate', rate: Number(customRate || 0), desc: 'User-specified m² per metric tonne' }
  };

  const selectedRate = structureType === 'custom' ? Number(customRate || 0) : rates[structureType].rate;
  const estimatedArea = tonnage ? Number(tonnage) * selectedRate : null;

  const handleCalculate = () => {
    if (!tonnage) {
      addToast('Missing Required Inputs', 'Please enter Total Structural Steel Weight.', 'warning');
      return;
    }
    addToast('Calculated Structural Area', 'Weight-wise surface area computed.', 'success');
  };

  const handleReset = () => {
    setStructureName('');
    setTonnage('');
    setStructureType('medium');
    setCustomRate('25');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!estimatedArea) {
      addToast('No Calculation', 'Please enter steel tonnage first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Structure Weight-Wise Area Calculation
${structureName ? `Structure / BOQ Ref: ${structureName}\n` : ''}Tonnage: ${tonnage} Metric Tonnes | Structure: ${rates[structureType].name}
Rate: ${selectedRate} m²/MT
--------------------------------------
Estimated Paintable Surface Area: ${formatNum(estimatedArea, 1)} m²`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Structural area estimate copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool A-3
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Structural Steel Weight-Wise Area (m²/MT)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rapidly convert total steel tonnage (MT) into paintable surface area using industrial classification rules of thumb.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('structural_steel')}
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
              Tonnage &amp; Member Category
            </h2>
            <Calculator className="w-4 h-4 text-[#F7941D]" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Structure Name / BOQ Reference <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={structureName}
                onChange={e => setStructureName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Pipe Rack Modules PR-01 to PR-04"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Structural Steel Weight (Metric Tonnes / MT)
              </label>
              <input
                type="number"
                value={tonnage}
                onChange={e => setTonnage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 150"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Structure Member Classification
              </label>
              <select
                value={structureType}
                onChange={e => setStructureType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                <option value="ultralight">Ultra Light Structure (35 m² / MT)</option>
                <option value="light">Light Structure (30 m² / MT)</option>
                <option value="medium">Medium Structure (25 m² / MT — Typical)</option>
                <option value="heavy">Heavy Structure (20 m² / MT)</option>
                <option value="ultraheavy">Ultra Heavy Structure (15 m² / MT)</option>
                <option value="custom">Custom Specified Rate</option>
              </select>
            </div>

            {structureType === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Custom Area Rate (m² per MT)
                </label>
                <input
                  type="number"
                  value={customRate}
                  onChange={e => setCustomRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="e.g. 25"
                />
              </div>
            )}
          </div>

          {/* Form Actions: Calculate & Reset */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Calculate Structure Area</span>
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
              {rates[structureType].desc}. Tonnage-to-area factors are industry standard reference norms for structural budgeting.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Estimated Coated Surface
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {selectedRate} m²/MT
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total Paintable Surface Area</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatNum(estimatedArea, 1)} m²
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                For {tonnage} MT of {rates[structureType].name.split(' (')[0]}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Steel Weight</span>
                <span className="text-base font-bold text-slate-800 font-mono">{tonnage} MT</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">Area in Sq. Ft</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {formatNum(estimatedArea * 10.7639, 0)} sq.ft
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
