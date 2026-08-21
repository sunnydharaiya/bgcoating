import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';

export default function KnowledgePage() {
  const standards = [
    { code: 'ISO 12944-5', title: 'Protective Paint Systems', desc: 'Classification of environments (C1 to CX) and coating durability categories (>15 to >25 years).' },
    { code: 'SSPC-VIS 1', title: 'Visual Standard for Abrasive Blast Cleaned Steel', desc: 'Reference photographs for White Metal (SP 5), Near-White (SP 10), Commercial (SP 6), and Brush-Off (SP 7).' },
    { code: 'NACE SP0188', title: 'Discontinuity (Holiday) Testing', desc: 'Low-voltage wet sponge and high-voltage spark testing protocols for protective coatings on conductive substrates.' },
    { code: 'ASTM D4541', title: 'Pull-Off Strength of Coatings', desc: 'Standard test method for pull-off strength of coatings using portable adhesion testers.' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 flex items-center gap-4">
        <div className="bg-[#F7941D]/20 text-[#F7941D] p-3 rounded-xl">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Coating Standards & Knowledge Base</h2>
          <p className="text-xs text-slate-400">International ISO, NACE, AMPP, SSPC, and ASTM protective coating reference protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standards.map((s, idx) => (
          <div key={idx} className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-[#F7941D]/20 text-[#F7941D] font-mono text-xs font-bold px-2.5 py-1 rounded">
                {s.code}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">{s.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
