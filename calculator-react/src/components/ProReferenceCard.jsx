import React from 'react';

export default function ProReferenceCard() {
  return (
    <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-4 animate-in fade-in duration-200">
      
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4E3] text-[#E87B1E] flex items-center justify-center text-xl shrink-0">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#1B222C] font-rajdhani">
                Reference Standards &amp; Smart Classification
              </h3>
              <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
                REF
              </span>
            </div>
            <p className="text-xs text-[#7E8B99] mt-0.5 font-sans">
              Standards basis for coating calculation &amp; engineering verification
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        
        {/* Primary Standards */}
        <div className="p-4 bg-[#FFF9EE] border border-[#F2DEC3] rounded-2xl text-xs text-stone-700 leading-loose">
          <strong className="text-[#A34E00] font-bold block mb-1">Primary Standards</strong>
          • ASTM D2697 — Volume Nonvolatile Matter of Coatings<br />
          • ISO 3233 — % Volume of Non-Volatile Matter<br />
          • ASTM D2369 — Volatile Content<br />
          • ASTM D1475 — Density of Liquid Coatings<br />
          <strong className="text-[#A34E00] font-bold block mt-2 mb-1">Engineering References</strong>
          • ISO 12944 · SSPC PA Guide · AMPP Good Painting Practice · NORSOK M-501 · ISO 19840 · ISO 2063
        </div>

        {/* Volume Solids Classification */}
        <div className="p-4 bg-[#EAF6EB] border border-[#C8E6C9] rounded-2xl text-xs text-stone-700 leading-loose">
          <strong className="text-[#2E7D32] font-bold block mb-1">Volume Solids Classification</strong>
          • &gt; 90% — Solvent Free Coating<br />
          • 80–90% — Ultra High Solids<br />
          • 70–80% — High Solids<br />
          • 60–70% — Medium High Solids<br />
          • 50–60% — Conventional Industrial<br />
          • 35–50% — Low Solids<br />
          • &lt; 35% — Very Low Solids
        </div>

      </div>

      {/* Note Alert */}
      <div className="p-3.5 bg-[#E1F5FE] border-l-4 border-l-[#0288D1] rounded-2xl text-xs text-slate-700 leading-relaxed font-mono">
        <strong className="text-[#0288D1]">Note:</strong> This module provides engineering verification and consistency checks using internationally accepted coating equations. It does not replace ASTM / ISO laboratory testing.
      </div>

      {/* PRO Roadmap Banner */}
      <div className="p-4 bg-[#FDF1E4] border border-[#F2DEC3] border-l-4 border-l-[#F5911F] rounded-2xl text-xs text-stone-700 leading-relaxed space-y-1.5">
        <strong className="text-[#A50021] block font-bold">
          🚀 PRO Roadmap — Upcoming Verification Modules:
        </strong>
        <p>
          VOC Calculator · Weight Solids Calculator · PVC (Pigment Volume Concentration) · CPVC (Critical PVC) · Density Calculator · Spreading Rate Verification · WFT / DFT Verification · Transfer Efficiency Calculator
        </p>
        <span className="text-[11px] text-stone-500 block">
          The PRO architecture is modular — each new calculator plugs into this section, building toward a complete Paint Formulation &amp; Coating Engineering Verification Suite.
        </span>
      </div>

    </div>
  );
}
