import React, { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export default function WFTRangeTool() {
  const [form, setForm] = useState({ minDft: 100, maxDft: 150, volumeSolids: 75, thinner: 0, paintName: 'Inorganic Zinc Silicate' });
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const minWft = (form.minDft * (100 + form.thinner)) / (form.volumeSolids || 1);
    const maxWft = (form.maxDft * (100 + form.thinner)) / (form.volumeSolids || 1);
    setResult({
      minWft: minWft.toFixed(1),
      maxWft: maxWft.toFixed(1),
      paintName: form.paintName
    });
  };

  const handleReset = () => {
    setForm({ minDft: 100, maxDft: 150, volumeSolids: 75, thinner: 0, paintName: '' });
    setResult(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-[#F7941D] p-3 rounded-2xl border border-amber-100 shadow-xs">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">WFT Range Calculation</h2>
            <p className="text-xs text-slate-500">Min & Max WFT from DFT range and Volume Solids %</p>
          </div>
        </div>
        <span className="bg-slate-100 text-slate-600 border border-slate-200 font-mono text-xs px-2.5 py-1 rounded-lg font-bold">P-1</span>
      </div>

      <div className="inline-flex items-center gap-2 bg-[#F7941D]/15 border border-[#F7941D]/40 text-[#D97706] font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
        <span>🔒 USER INPUTS - PLEASE FILL CORRECTLY</span>
      </div>

      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>MIN DFT</span><span className="text-[10px] text-amber-700 font-mono">µm</span>
            </label>
            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]" value={form.minDft} onChange={e => setForm({ ...form, minDft: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>MAX DFT</span><span className="text-[10px] text-amber-700 font-mono">µm</span>
            </label>
            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]" value={form.maxDft} onChange={e => setForm({ ...form, maxDft: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>VOLUME SOLIDS</span><span className="text-[10px] text-amber-700 font-mono">%</span>
            </label>
            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]" value={form.volumeSolids} onChange={e => setForm({ ...form, volumeSolids: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>THINNER</span><span className="text-[10px] text-amber-700 font-mono">%</span>
            </label>
            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]" value={form.thinner} onChange={e => setForm({ ...form, thinner: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>PAINT NAME</span><span className="text-[10px] text-slate-400 font-mono">optional</span>
          </label>
          <input type="text" placeholder="e.g. Inorganic Zinc Silicate" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]" value={form.paintName} onChange={e => setForm({ ...form, paintName: e.target.value })} />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="flex-1 bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-md">► Calculate WFT Range</button>
          <button type="button" onClick={handleReset} className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-xs flex items-center gap-2"><RotateCcw className="w-4 h-4 text-slate-500" />Reset</button>
        </div>
      </form>

      {result && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-[#F7941D] font-mono font-bold uppercase">Calculated WFT Range Output</span>
            <span className="text-[10px] text-slate-400 font-mono">{result.paintName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">MIN WFT REQUIRED</span>
              <span className="text-3xl font-extrabold text-white">{result.minWft} <span className="text-xs text-[#F7941D]">µm</span></span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">MAX WFT REQUIRED</span>
              <span className="text-3xl font-extrabold text-white">{result.maxWft} <span className="text-xs text-[#F7941D]">µm</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
