import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, BookOpen, Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { calcTankArea, formatNum } from '../../utils/calculations';

export default function TankAreaTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [itemName, setItemName] = useState('');
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [roofType, setRoofType] = useState('conical');
  const [roofSlope, setRoofSlope] = useState('15');
  const [copied, setCopied] = useState(false);

  const res = (diameter && height) ? calcTankArea(diameter, height, roofType, roofSlope || 15) : null;

  const handleCalculate = () => {
    if (!diameter || !height) {
      addToast('Missing Required Inputs', 'Please enter Tank Diameter and Shell Height.', 'warning');
      return;
    }
    addToast('Calculated Tank Area', 'Shell, roof, and bottom areas computed.', 'success');
  };

  const handleReset = () => {
    setItemName('');
    setDiameter('');
    setHeight('');
    setRoofType('conical');
    setRoofSlope('15');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Storage Tank Area Calculation
${itemName ? `Item Name: ${itemName}\n` : ''}Diameter: ${diameter} m | Height: ${height} m | Roof: ${roofType} (${roofSlope}°)
--------------------------------------
Shell Surface Area: ${formatNum(res.shellOutside, 2)} m²
Roof Surface Area: ${formatNum(res.roofArea, 2)} m²
Bottom Internal Area: ${formatNum(res.bottomArea, 2)} m²
Total External Coating Area: ${formatNum(res.totalExternal, 2)} m²
Total Internal Lining Area: ${formatNum(res.totalInternal, 2)} m²
Grand Total Surface Area: ${formatNum(res.grandTotal, 2)} m²`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Tank area calculation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool A-2
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Storage Tank Surface Area Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate external and internal surface areas for cylindrical vertical storage tanks (Shell, Conical/Dome Roof, Bottom plates).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('tank_shell')}
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
              Tank Dimensions &amp; Roof Geometry
            </h2>
            <Calculator className="w-4 h-4 text-[#F7941D]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Item Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Storage Tank T-101"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tank Internal Diameter (metres)
              </label>
              <input
                type="number"
                value={diameter}
                onChange={e => setDiameter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tank Shell Height (metres)
              </label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Roof Configuration
              </label>
              <select
                value={roofType}
                onChange={e => setRoofType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                <option value="conical">Conical Roof (Standard)</option>
                <option value="dome">Dome / Curved Roof</option>
                <option value="flat">Flat Roof / Open Top</option>
                <option value="floating">Floating Roof Tank</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Roof Slope Angle (Degrees)
              </label>
              <input
                type="number"
                value={roofSlope}
                onChange={e => setRoofSlope(e.target.value)}
                disabled={roofType !== 'conical'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] disabled:opacity-50"
                placeholder="15"
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
              <span>Calculate Tank Area</span>
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
              Shell Area: <code>π × D × H</code>. Roof slope correction applied for conical heads per API 650.
            </span>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Tank Coating Areas
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                API 650 Norms
              </span>
            </div>

            {/* Target Output Highlight Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total External Coating Area (Shell + Roof)</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {res ? `${formatNum(res.totalExternal, 1)} m²` : '—'}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Shell: {res ? `${formatNum(res.shellOutside, 1)} m²` : '—'} | Roof: {res ? `${formatNum(res.roofArea, 1)} m²` : '—'}
              </p>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Internal Lining Area</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.totalInternal, 1)} m²` : '—'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Grand Total Area (All Faces)</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {res ? `${formatNum(res.grandTotal, 1)} m²` : '—'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
