import React, { useState } from 'react';
import {
  Paintbrush,
  Users,
  Wrench,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  RotateCcw
} from 'lucide-react';

export default function ManpowerPaintingCost({
  state,
  onChange,
  metrics,
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const {
    paintTotal = 0,
    paintPM2 = 0,
    pA_items = [], pA_total = 0, pA_tot = 0,
    pB_items = [], pB_total = 0, pB_tot = 0,
    pC_items = [], pC_total = 0, pC_tot = 0,
    pD_items = [], pD_total = 0, pD_tot = 0,
    area = 0,
    coats = 1,
    formatCur = (v) => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    formatNum = (v, d = 0) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
  } = (metrics || {});

  // Accordion toggle states
  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);
  const [openC, setOpenC] = useState(true);
  const [openD, setOpenD] = useState(true);
  const [openSummary, setOpenSummary] = useState(true);

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-4">
      
      {/* MODULE 3 BANNER */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 3 · PAINT APPLICATION
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Paint Application — A/B/C/D Cost Engine ({coats} Coat Multi-Pass)
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          Spray painter labor, brush touch-up helpers, airless pump depreciation, full PPE respirator masks, and multi-pass setup dynamics.
        </p>
      </div>

      {/* SECTION 1: Painting Variables */}
      <div id="section-painting-variables" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Paintbrush className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Painting Variables
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Coats, application consumables &amp; diesel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(pA_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(pA_total)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION A
            </span>
            {openA ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openA && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  APPLICATION NUMBER OF COATS
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={state.pCoats ?? coats}
                  onChange={(e) => handleFieldChange('pCoats', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    DIESEL RATE (₹/L)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹/L</span>
                </div>
                <input
                  type="number"
                  value={state.pDieselRate ?? 92}
                  onChange={(e) => handleFieldChange('pDieselRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    DIESEL CONSUMPTION (L/M² PER COAT)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">L/m²</span>
                </div>
                <input
                  type="number"
                  step="0.02"
                  value={state.pDieselL ?? 0.12}
                  onChange={(e) => handleFieldChange('pDieselL', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PPE &amp; RESPIRATOR MASKS (₹/DAY)
                </label>
                <input
                  type="number"
                  value={state.pPPE ?? 120}
                  onChange={(e) => handleFieldChange('pPPE', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  MASKING TAPE &amp; PAPER (₹/SHIFT)
                </label>
                <input
                  type="number"
                  value={state.pMask ?? 400}
                  onChange={(e) => handleFieldChange('pMask', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  MISC APPLICATION CONSUMABLES (₹/SHIFT)
                </label>
                <input
                  type="number"
                  value={state.pCons ?? 350}
                  onChange={(e) => handleFieldChange('pCons', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Manpower Setup & Rates */}
      <div id="section-painting-crew" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenB(!openB)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Painting Manpower Setup &amp; Rates
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Spray painter, helper and touch-up crew salaries
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(pB_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(pB_total)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION B
            </span>
            {openB ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openB && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            <div className="overflow-x-auto rounded-lg border border-orange-200 shadow-2xs bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FFEAD5] text-[#5A240A] text-[10px] font-mono font-bold uppercase tracking-wider border-b border-orange-200">
                  <tr>
                    <th className="py-2.5 px-3">MANPOWER ROLE / DESIGNATION</th>
                    <th className="py-2.5 px-3 text-center">HEADCOUNT / SHIFT</th>
                    <th className="py-2.5 px-3 text-right">MONTHLY CTC (₹)</th>
                    <th className="py-2.5 px-3 text-right">TOTAL PER SHIFT (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Painting Supervisor</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.pSupNo ?? 1}
                        onChange={(e) => handleFieldChange('pSupNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.pSupRate ?? 32000}
                        onChange={(e) => handleFieldChange('pSupRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.pSupRate ?? 32000) * (state.pSupNo ?? 1)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Airless Spray Painter</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.pSpNo ?? 2}
                        onChange={(e) => handleFieldChange('pSpNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.pSpRate ?? 28000}
                        onChange={(e) => handleFieldChange('pSpRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.pSpRate ?? 28000) * (state.pSpNo ?? 2)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Painting Helper</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.pHpNo ?? 3}
                        onChange={(e) => handleFieldChange('pHpNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.pHpRate ?? 18000}
                        onChange={(e) => handleFieldChange('pHpRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.pHpRate ?? 18000) * (state.pHpNo ?? 3)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Painting Site Incharge</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.pSiNo ?? 0.5}
                        step="0.5"
                        onChange={(e) => handleFieldChange('pSiNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.pSiRate ?? 45000}
                        onChange={(e) => handleFieldChange('pSiRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.pSiRate ?? 45000) * (state.pSiNo ?? 0.5)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Coating Inspector (NACE/AMPP)</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.pNcNo ?? 0.5}
                        step="0.5"
                        onChange={(e) => handleFieldChange('pNcNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.pNcRate ?? 35000}
                        onChange={(e) => handleFieldChange('pNcRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.pNcRate ?? 35000) * (state.pNcNo ?? 0.5)) / (state.workingDays || 26))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Equipment & Spray Setup */}
      <div className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenC(!openC)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Equipment &amp; Spray Setup
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Airless spray pumps, agitators, DFT gauges
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(pC_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(pC_total)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION C
            </span>
            {openC ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openC && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  AIRLESS SPRAY PUMP HIRE (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.pPump ?? 25000}
                  onChange={(e) => handleFieldChange('pPump', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  DFT GAUGES &amp; QC INSTRUMENTS (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.pInst ?? 4500}
                  onChange={(e) => handleFieldChange('pInst', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SPRAY TIPS, HOSES &amp; GUNS (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.pIdle ?? 3500}
                  onChange={(e) => handleFieldChange('pIdle', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Profit & Overheads */}
      <div id="section-painting-profit" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenD(!openD)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Profit &amp; Overheads
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Site administration, mob-demob and contractor margins
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(pD_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(pD_total)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SECTION D
            </span>
            {openD ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openD && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  OFFICE / STORE COST (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.pOffice ?? 8000}
                  onChange={(e) => handleFieldChange('pOffice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  ADMIN / LOCAL EXPENSES (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.pAdmin ?? 7000}
                  onChange={(e) => handleFieldChange('pAdmin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  MOB / DEMOB (₹ TOTAL)
                </label>
                <input
                  type="number"
                  value={state.pMob ?? 15000}
                  onChange={(e) => handleFieldChange('pMob', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SUB-CONTRACTOR OVERHEAD %
                </label>
                <input
                  type="number"
                  value={state.pOH ?? 10}
                  onChange={(e) => handleFieldChange('pOH', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SUB-CONTRACTOR PROFIT %
                </label>
                <input
                  type="number"
                  value={state.pProfit ?? 15}
                  onChange={(e) => handleFieldChange('pProfit', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: Painting Cost Summary — A/B/C/D Engine */}
      <div id="section-painting-summary" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenSummary(!openSummary)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Painting Cost Summary — A/B/C/D Engine
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Auto-computed from inputs above ({coats} Coats)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SUMMARY
            </span>
            {openSummary ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openSummary && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            
            {/* A - CONSUMABLE COST */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>A - APPLICATION CONSUMABLES</span>
                <span className="text-amber-200 font-bold">₹{formatCur(pA_total)} / m²</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-[#FFF5EB] text-[#5A240A] text-[10px] font-mono font-bold uppercase border-b border-orange-200">
                  <tr>
                    <th className="py-1.5 px-3 text-left">DESCRIPTION</th>
                    <th className="py-1.5 px-3 text-right">PER SQ.M.</th>
                    <th className="py-1.5 px-3 text-right">TOTAL COST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {pA_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area * coats)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Consumables Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(pA_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(pA_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* B - LABOR / MANPOWER COST */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>B - LABOR / MANPOWER COST</span>
                <span className="text-amber-200 font-bold">₹{formatCur(pB_total)} / m²</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-[#FFF5EB] text-[#5A240A] text-[10px] font-mono font-bold uppercase border-b border-orange-200">
                  <tr>
                    <th className="py-1.5 px-3 text-left">DESCRIPTION</th>
                    <th className="py-1.5 px-3 text-right">PER SQ.M.</th>
                    <th className="py-1.5 px-3 text-right">TOTAL COST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {pB_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area * coats)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Labor Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(pB_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(pB_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C - EQUIPMENT CHARGES */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>C - EQUIPMENT &amp; SPRAY SETUP</span>
                <span className="text-amber-200 font-bold">₹{formatCur(pC_total)} / m²</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-[#FFF5EB] text-[#5A240A] text-[10px] font-mono font-bold uppercase border-b border-orange-200">
                  <tr>
                    <th className="py-1.5 px-3 text-left">DESCRIPTION</th>
                    <th className="py-1.5 px-3 text-right">PER SQ.M.</th>
                    <th className="py-1.5 px-3 text-right">TOTAL COST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {pC_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area * coats)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Equipment Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(pC_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(pC_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* D - PROFIT & OVERHEADS */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>D - PROFIT &amp; OVERHEADS</span>
                <span className="text-amber-200 font-bold">₹{formatCur(pD_total)} / m²</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-[#FFF5EB] text-[#5A240A] text-[10px] font-mono font-bold uppercase border-b border-orange-200">
                  <tr>
                    <th className="py-1.5 px-3 text-left">DESCRIPTION</th>
                    <th className="py-1.5 px-3 text-right">PER SQ.M.</th>
                    <th className="py-1.5 px-3 text-right">TOTAL COST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {pD_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area * coats)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Profit &amp; Overhead Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(pD_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(pD_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Highlight Total Card */}
            <div className="p-4 rounded-xl bg-[#FFEAD5] border border-[#F5C296] text-center space-y-1 shadow-2xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A82B12]">
                TOTAL PAINT APPLICATION COST
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#C23A1B]">
                ₹{formatCur(paintTotal)}
              </div>
              <div className="text-xs font-mono font-bold text-slate-700">
                ₹{formatCur(paintPM2)} / m² ({coats} Coats)
              </div>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER ACTIONS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-2 rounded-lg bg-[#3F2B68] hover:bg-[#342356] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={onValidate}
            className="px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>VALIDATE / APPROVAL</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-lg bg-[#FFF5F5] hover:bg-[#FEECEC] border border-rose-300 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('raw-material')}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E85D22] to-[#CB3A14] hover:brightness-110 text-white text-xs font-black tracking-wider flex items-center gap-2 transition shadow-sm cursor-pointer uppercase font-mono"
        >
          <span>NEXT : RAW MATERIAL →</span>
        </button>
      </div>

      {/* BRANDED FOOTER */}
      <div className="bg-[#2B0E10] text-[#D8BDBE] rounded-xl p-4 sm:p-5 border-t-2 border-[#5C1E23] flex flex-col items-center justify-center text-center space-y-1.5 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide font-mono">
            BG GROUP <span className="text-xs font-normal text-rose-200">of Paint and Coating Consultant</span>
          </span>
        </div>
        <div className="text-[11px] text-rose-200/90 font-medium">
          Industrial Cost Estimation · Surface Protection · Coating Engineering
        </div>
        <div className="text-[10px] text-rose-300/60 font-mono flex flex-wrap justify-center gap-x-2">
          <span>E 103, Akash Echo Point, Bhimrad, Surat - 395007, Gujarat, India</span>
          <span>|</span>
          <span>+91 98258 10408</span>
          <span>|</span>
          <span>support@bgcoating.com</span>
          <span>|</span>
          <span>www.bgcoating.com</span>
        </div>
      </div>

    </div>
  );
}
