import React, { useState } from 'react';
import { FileCode2, CheckCircle2 } from 'lucide-react';

export default function SpecificationReadingPage() {
  const [specInput, setSpecInput] = useState('');
  const [decoded, setDecoded] = useState(null);

  const handleDecode = () => {
    setDecoded({
      surfacePrep: 'SSPC-SP 10 / NACE No. 2 (Near-White Blast Cleaning)',
      profile: '50 – 75 microns (2.0 – 3.0 mils) Angular Profile',
      primerCoat: 'Inorganic Zinc Silicate Primer @ 75 µm DFT',
      intermediateCoat: 'High Build Polyamide Epoxy Intermediate @ 125 µm DFT',
      finishCoat: 'Aliphatic Polyurethane Topcoat @ 50 µm DFT',
      totalDFT: '250 µm (10.0 mils) Total System Dry Film Thickness',
      compliance: 'ISO 12944-5 Category C5-Industrial / High Durability (>15 Years)'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FileCode2 className="w-6 h-6 text-[#F7941D]" />
          <div>
            <h2 className="text-lg font-bold text-white">Coating Specification Decoder Engine</h2>
            <p className="text-xs text-slate-400">Paste raw paint specs or engineering notes to decode coat stacks and standards.</p>
          </div>
        </div>

        <textarea
          rows={4}
          placeholder="Paste paint specification text (e.g. 'Apply 1 coat IOZ @ 75um, 1 coat Epoxy @ 125um, 1 coat PU @ 50um for refinery storage tank shell')..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
          value={specInput}
          onChange={e => setSpecInput(e.target.value)}
        ></textarea>

        <button
          onClick={handleDecode}
          className="bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow"
        >
          🔍 Decode Specification Stack
        </button>
      </div>

      {decoded && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Decoded Paint Specification Stack
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Surface Preparation</span>
              <strong className="text-xs text-white font-bold">{decoded.surfacePrep}</strong>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Surface Profile Target</span>
              <strong className="text-xs text-white font-bold">{decoded.profile}</strong>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Primer Coat</span>
              <strong className="text-xs text-[#F7941D] font-bold">{decoded.primerCoat}</strong>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Intermediate Coat</span>
              <strong className="text-xs text-sky-400 font-bold">{decoded.intermediateCoat}</strong>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Finish / Topcoat</span>
              <strong className="text-xs text-emerald-400 font-bold">{decoded.finishCoat}</strong>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Compliance Framework</span>
              <strong className="text-xs text-purple-400 font-bold">{decoded.compliance}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
