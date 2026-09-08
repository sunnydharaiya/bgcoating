import React from 'react';
import { 
  Layers, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle 
} from 'lucide-react';
import { SCOPE_DEFS } from '../../data/unitRateDatabase';

export default function UnitRateScope({ 
  formData, 
  onUpdateField, 
  onNavigateNext, 
  onNavigatePrev, 
  onReset 
}) {
  const scopeState = formData.scope || {};

  const handleSetScope = (key, value) => {
    onUpdateField('scope', {
      ...scopeState,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">02. Company Scope Matrix</h2>
              <p className="text-xs text-slate-400">Define the execution battery limits across surface treatment and specialty trade disciplines.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
            Section 02
          </span>
        </div>

        {/* Interactive Scope Toggle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SCOPE_DEFS.map((s) => {
            const currentVal = scopeState[s.key] || 'NA';

            return (
              <div 
                key={s.key}
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between gap-3 transition hover:border-slate-600"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{s.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                </div>

                {/* 3-Way Selector Pills */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSetScope(s.key, 'YES')}
                    className={`py-1.5 rounded-md text-xs font-bold transition ${
                      currentVal === 'YES'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetScope(s.key, 'NO')}
                    className={`py-1.5 rounded-md text-xs font-bold transition ${
                      currentVal === 'NO'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    NO
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetScope(s.key, 'NA')}
                    className={`py-1.5 rounded-md text-xs font-bold transition ${
                      currentVal === 'NA'
                        ? 'bg-slate-700 text-slate-200 shadow-md'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    N/A
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Action Bottom Toolbar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onNavigatePrev}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Project Info</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Scope
          </button>

          <button
            onClick={onNavigateNext}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-95 transition"
          >
            <span>Next: Section D Temp Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
