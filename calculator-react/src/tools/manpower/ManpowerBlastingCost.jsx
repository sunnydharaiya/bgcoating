import React, { useState } from 'react';
import {
  Flame,
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
import { ABRASIVE_MEDIA_OPTIONS } from '../../data/manpowerDatabase';

export default function ManpowerBlastingCost({
  state,
  onChange,
  metrics,
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const {
    blastTotal = 0,
    blastPM2 = 0,
    bA_items = [], bA_total = 0, bA_tot = 0,
    bB_items = [], bB_total = 0, bB_tot = 0,
    bC_items = [], bC_total = 0, bC_tot = 0,
    bD_items = [], bD_total = 0, bD_tot = 0,
    area = 0,
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
      
      {/* MODULE 2 BANNER (Matches 2.png) */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 2 · BLASTING COST
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Blasting Cost — A/B/C/D Cost Engine
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          First-day cost computation for Consumables, Manpower, Equipment and Profit categories. Defaults from BG Group standard norm — fully editable.
        </p>
      </div>

      {/* SECTION 1: Blasting Variables */}
      <div id="section-blasting-variables" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Blasting Variables
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Abrasive media, consumption rates, diesel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(bA_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(bA_total)}
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
              
              {/* Abrasive Media */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  ABRASIVE MEDIA
                </label>
                <select
                  value={state.bMedia || 'Copper Slag'}
                  onChange={(e) => handleFieldChange('bMedia', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs"
                >
                  {ABRASIVE_MEDIA_OPTIONS.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                  ))}
                </select>
              </div>

              {/* Abrasive Consumption */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    ABRASIVE RATE (₹/KG)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹/kg</span>
                </div>
                <input
                  type="number"
                  value={state.bAbrRate ?? 4.5}
                  onChange={(e) => handleFieldChange('bAbrRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              {/* Abrasive Consumption kg/m2 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    ABRASIVE CONSUMPTION (KG/M²)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">kg/m²</span>
                </div>
                <input
                  type="number"
                  value={state.bAbrKg ?? 28}
                  onChange={(e) => handleFieldChange('bAbrKg', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              {/* Diesel Rate */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    DIESEL RATE (₹/L)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹/L</span>
                </div>
                <input
                  type="number"
                  value={state.bDieselRate ?? 92}
                  onChange={(e) => handleFieldChange('bDieselRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              {/* Diesel Consumption L/m2 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    DIESEL CONSUMPTION (L/M²)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">L/m²</span>
                </div>
                <input
                  type="number"
                  step="0.05"
                  value={state.bDieselL ?? 0.85}
                  onChange={(e) => handleFieldChange('bDieselL', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              {/* PPE for Workmen */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    PPE FOR WORKMEN (PER DAY)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹/day</span>
                </div>
                <input
                  type="number"
                  value={state.bPPE ?? 150}
                  onChange={(e) => handleFieldChange('bPPE', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              {/* Consumables (Other) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    MISC CONSUMABLES (PER SHIFT)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹/shift</span>
                </div>
                <input
                  type="number"
                  value={state.bCons ?? 500}
                  onChange={(e) => handleFieldChange('bCons', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Manpower Setup & Rates */}
      <div id="section-blasting-crew" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
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
                Manpower Setup &amp; Rates
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Crew setup, counts and monthly salary
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(bB_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(bB_total)}
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
                    <td className="py-2 px-3 font-semibold text-slate-900">Supervisor</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.bSupNo ?? 1}
                        onChange={(e) => handleFieldChange('bSupNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.bSupRate ?? 32000}
                        onChange={(e) => handleFieldChange('bSupRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.bSupRate ?? 32000) * (state.bSupNo ?? 1)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Blaster</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.bBlNo ?? 2}
                        onChange={(e) => handleFieldChange('bBlNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.bBlRate ?? 26000}
                        onChange={(e) => handleFieldChange('bBlRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.bBlRate ?? 26000) * (state.bBlNo ?? 2)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Helper</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.bHpNo ?? 4}
                        onChange={(e) => handleFieldChange('bHpNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.bHpRate ?? 18000}
                        onChange={(e) => handleFieldChange('bHpRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.bHpRate ?? 18000) * (state.bHpNo ?? 4)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Site Incharge</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.bSiNo ?? 0.5}
                        step="0.5"
                        onChange={(e) => handleFieldChange('bSiNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.bSiRate ?? 45000}
                        onChange={(e) => handleFieldChange('bSiRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.bSiRate ?? 45000) * (state.bSiNo ?? 0.5)) / (state.workingDays || 26))}
                    </td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">QA/QC Inspector</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={state.bNcNo ?? 0.5}
                        step="0.5"
                        onChange={(e) => handleFieldChange('bNcNo', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={state.bNcRate ?? 35000}
                        onChange={(e) => handleFieldChange('bNcRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 text-right font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{formatCur(((state.bNcRate ?? 35000) * (state.bNcNo ?? 0.5)) / (state.workingDays || 26))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Equipment & Misc Charges */}
      <div id="section-blasting-equipment" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
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
                Equipment &amp; Misc Charges
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Compressor, hopper, transport, mobile
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(bC_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(bC_total)}
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
                  COMPRESSOR HIRE (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bComp ?? 65000}
                  onChange={(e) => handleFieldChange('bComp', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  HOPPER, HOSES, NOZZLES (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bHop ?? 15000}
                  onChange={(e) => handleFieldChange('bHop', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  AFTER-COOLER ASSEMBLY (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bAc ?? 8000}
                  onChange={(e) => handleFieldChange('bAc', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  BLASTING HOOD ASSEMBLY (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bHood ?? 6000}
                  onChange={(e) => handleFieldChange('bHood', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  INSPECTION INSTRUMENTS (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bInst ?? 5000}
                  onChange={(e) => handleFieldChange('bInst', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  DIESEL PUMP &amp; ACCESSORIES (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bPump ?? 4000}
                  onChange={(e) => handleFieldChange('bPump', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Profit, Misc & Mob-Demob */}
      <div id="section-blasting-profit" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
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
                Profit, Misc &amp; Mob-Demob
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Site office, admin and profit margins
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(bD_tot)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(bD_total)}
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
                  value={state.bOffice ?? 12000}
                  onChange={(e) => handleFieldChange('bOffice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  ADMIN / LOCAL EXPENSES (₹/MONTH)
                </label>
                <input
                  type="number"
                  value={state.bAdmin ?? 10000}
                  onChange={(e) => handleFieldChange('bAdmin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  MOB / DEMOB (₹ TOTAL)
                </label>
                <input
                  type="number"
                  value={state.bMob ?? 25000}
                  onChange={(e) => handleFieldChange('bMob', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SUB-CONTRACTOR OVERHEAD %
                </label>
                <input
                  type="number"
                  value={state.bOH ?? 10}
                  onChange={(e) => handleFieldChange('bOH', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  SUB-CONTRACTOR PROFIT %
                </label>
                <input
                  type="number"
                  value={state.bProfit ?? 15}
                  onChange={(e) => handleFieldChange('bProfit', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: Blasting Cost Summary — A/B/C/D Engine */}
      <div id="section-blasting-summary" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
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
                Blasting Cost Summary — A/B/C/D Engine
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Auto-computed from inputs above
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
                <span>A - CONSUMABLE COST</span>
                <span className="text-amber-200 font-bold">₹{formatCur(bA_total)} / m²</span>
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
                  {bA_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Consumable Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(bA_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(bA_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* B - LABOR / MANPOWER COST */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>B - LABOR / MANPOWER COST</span>
                <span className="text-amber-200 font-bold">₹{formatCur(bB_total)} / m²</span>
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
                  {bB_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Labor Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(bB_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(bB_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C - EQUIPMENT CHARGES */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>C - EQUIPMENT CHARGES</span>
                <span className="text-amber-200 font-bold">₹{formatCur(bC_total)} / m²</span>
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
                  {bC_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Equipment Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(bC_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(bC_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* D - PROFIT & MISC / LABOUR */}
            <div className="rounded-lg overflow-hidden border border-[#A82B12]/30 shadow-2xs">
              <div className="bg-[#8B1E14] text-white px-3 py-1.5 font-bold font-mono text-[11px] uppercase tracking-wider flex justify-between items-center">
                <span>D - PROFIT &amp; MISC / OVERHEADS</span>
                <span className="text-amber-200 font-bold">₹{formatCur(bD_total)} / m²</span>
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
                  {bD_items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-1.5 px-3 text-slate-900">{it.n}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-semibold">₹{formatCur(it.pm)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(it.pm * area)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFEAD5]/60 font-bold">
                    <td className="py-1.5 px-3 text-slate-900">Profit &amp; Overhead Subtotal</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700">₹{formatCur(bD_total)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-emerald-700 font-bold">₹{formatCur(bD_tot)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Highlight Total Card */}
            <div className="p-4 rounded-xl bg-[#FFEAD5] border border-[#F5C296] text-center space-y-1 shadow-2xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A82B12]">
                TOTAL BLASTING COST
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#C23A1B]">
                ₹{formatCur(blastTotal)}
              </div>
              <div className="text-xs font-mono font-bold text-slate-700">
                ₹{formatCur(blastPM2)} / m²
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
          onClick={() => onNavigate('painting')}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E85D22] to-[#CB3A14] hover:brightness-110 text-white text-xs font-black tracking-wider flex items-center gap-2 transition shadow-sm cursor-pointer uppercase font-mono"
        >
          <span>NEXT : PAINT APPLICATION →</span>
        </button>
      </div>

      {/* BRANDED FOOTER matching 1.png & 2.png */}
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
