import React from 'react';
import { 
  Layers, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft 
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
    <div id="section-scope" className="space-y-6">
      {/* Header Card (Clean Light Theme matching media_1792173809775_e8eaea16.png) */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#E6E8EC] shadow-[0_2px_12px_rgba(20,24,32,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF5EA] text-[#D97706] border border-[#FDE3C7] shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">02. Company Scope Matrix</h2>
              <p className="text-xs text-[#64748B]">Define the execution battery limits across surface treatment and specialty trade disciplines.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF5EA] text-[#D97706] font-bold border border-[#FDE3C7]">
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
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between gap-3 transition hover:border-[#CBD5E1]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B] leading-snug">{s.title}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{s.sub}</p>
                  </div>
                </div>

                {/* 3-Way Selector Pills */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => handleSetScope(s.key, 'YES')}
                    className={`py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      currentVal === 'YES'
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetScope(s.key, 'NO')}
                    className={`py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      currentVal === 'NO'
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    NO
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetScope(s.key, 'NA')}
                    className={`py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      currentVal === 'NA'
                        ? 'bg-[#64748B] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
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
      {onNavigatePrev && onNavigateNext && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onNavigatePrev}
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#F8FAFC] text-slate-700 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back: Project Info</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Scope
            </button>

            <button
              onClick={onNavigateNext}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#E8700A] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-105 transition cursor-pointer"
            >
              <span>Next: Section D Temp Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
