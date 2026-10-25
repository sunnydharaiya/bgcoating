import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Building2,
  Scale,
  Save,
  Check,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ManpowerSummary({
  state,
  metrics,
  onSaveReport,
  onOpenApproval,
  onOpenPreview,
  onNavigate,
  onReset
}) {
  const {
    grandTotal = 0,
    costPerM2 = 0,
    blastTotal = 0,
    blastPM2 = 0,
    paintTotal = 0,
    paintPM2 = 0,
    rawTotal = 0,
    rawPM2 = 0,
    rawCoats = 0,
    area = 0,
    coats = 1,
    sa3Rate = 0,
    sa25Rate = 0,
    sa2Rate = 0,
    sweepRate = 0,
    formatCur = (v) => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    formatNum = (v, d = 0) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
  } = (metrics || {});

  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);
  const [openC, setOpenC] = useState(true);

  return (
    <div className="space-y-4">
      
      {/* MODULE 7 BANNER (Matches 4.png) */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 7 · COMMERCIAL SUMMARY
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Project Front Page — Final Estimation
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          Consolidated commercial summary integrating all modules. Includes Blasting, Paint Application, Paint Raw Material (per coat), per m² rates and grand total.
        </p>
      </div>

      {/* SECTION 1: Project Reference */}
      <div id="section-project-reference" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Project Reference
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Pulled from Module 1
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              FRONT
            </span>
            {openA ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openA && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              <div className="p-3 rounded-lg border border-orange-200/90 bg-white space-y-1 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                  PROJECT NAME
                </span>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {state.projectName || '—'}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200/90 bg-white space-y-1 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                  CUSTOMER
                </span>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {state.customer || '—'}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200/90 bg-white space-y-1 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                  SURFACE AREA
                </span>
                <div className="text-sm font-bold font-mono text-[#0066CC]">
                  {formatNum(area, 0)} <span className="text-xs font-normal text-slate-600">m²</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Cost Summary Table */}
      <div id="section-cost-summary" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenB(!openB)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Cost Summary Table
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Sr.1 Blasting · Sr.2 Paint Application · Sr.3 Paint Raw Material
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              SUMMARY
            </span>
            {openB ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openB && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5">
            <div className="overflow-x-auto rounded-lg border border-orange-200 shadow-2xs bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FFEAD5] text-[#5A240A] text-[10px] font-mono font-bold uppercase tracking-wider border-b border-orange-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center">SR.</th>
                    <th className="py-2.5 px-3">DESCRIPTION</th>
                    <th className="py-2.5 px-3 text-center">COATS</th>
                    <th className="py-2.5 px-3 text-center">TOTAL M²</th>
                    <th className="py-2.5 px-3 text-right">PER M² COST</th>
                    <th className="py-2.5 px-3 text-right">TOTAL COST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">1</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span>Blasting Cost</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                        Blasting
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-slate-400">—</td>
                    <td className="py-2 px-3 text-center font-mono">{formatNum(area, 0)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(blastPM2)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#C23A1B]">₹{formatCur(blastTotal)}</td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">2</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span>Paint Application</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        Application
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{coats}</td>
                    <td className="py-2 px-3 text-center font-mono">{formatNum(area * coats, 0)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(paintPM2)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#C23A1B]">₹{formatCur(paintTotal)}</td>
                  </tr>

                  <tr className="hover:bg-orange-50/50">
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">3</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span>Paint Raw Material</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Material
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{rawCoats || coats}</td>
                    <td className="py-2 px-3 text-center font-mono">{formatNum(area, 0)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{formatCur(rawPM2)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#C23A1B]">₹{formatCur(rawTotal)}</td>
                  </tr>

                  {/* Summary Total Row */}
                  <tr className="bg-[#FFEAD5]/80 font-bold text-slate-900 border-t-2 border-orange-200">
                    <td colSpan={3} className="py-2.5 px-4 text-left font-mono uppercase tracking-wider text-xs">
                      PROJECT TOTAL
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {formatNum(area, 0)} m²
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      ₹{formatCur(costPerM2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700 text-sm">
                      ₹{formatCur(grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Surface Finish Comparison */}
      <div id="section-surface-finish" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenC(!openC)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Surface Finish Comparison
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Cost per m² across surface preparation grades
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              COMPARE
            </span>
            {openC ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openC && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-3.5">
            
            {/* Multiplier Info Bar */}
            <div className="p-2.5 rounded-lg bg-[#A82B12] text-white text-[11px] font-mono font-bold text-center tracking-tight shadow-2xs">
              MULTIPLIER PER EXCEL | SA3 = 1.15× SA2.5 | SA2 = 0.55× SA2.5 | Sweep = 0.45× SA2.5 (Industry standard ratio)
            </div>

            {/* 4 Rate Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  SA 3 RATE
                </span>
                <div className="text-lg font-black font-mono text-slate-900">
                  ₹{formatCur(sa3Rate)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Per m²
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  SA 2.5 RATE
                </span>
                <div className="text-lg font-black font-mono text-[#0066CC]">
                  ₹{formatCur(sa25Rate)}
                </div>
                <div className="text-[10px] font-mono text-blue-600 font-bold">
                  Reference
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  SA 2 RATE
                </span>
                <div className="text-lg font-black font-mono text-slate-900">
                  ₹{formatCur(sa2Rate)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Commercial
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  SWEEP RATE
                </span>
                <div className="text-lg font-black font-mono text-slate-900">
                  ₹{formatCur(sweepRate)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Brush-off
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* GRAND TOTAL HIGHLIGHT CARD (Matches 4.png) */}
      <div className="p-5 rounded-xl bg-[#FFEAD5] border-2 border-[#F5C296] text-center space-y-1.5 shadow-md">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#A82B12]">
          GRAND TOTAL — ALL-IN PROJECT COST
        </div>
        <div className="text-3xl sm:text-4xl font-black font-mono text-[#C23A1B]">
          ₹{formatCur(grandTotal)}
        </div>
        <div className="text-xs font-mono font-bold text-slate-700">
          ₹{formatCur(costPerM2)}/m² · {formatNum(area, 0)} m² · INR
        </div>
      </div>

      {/* FOOTER ACTIONS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSaveReport('Draft')}
            className="px-4 py-2 rounded-lg bg-[#3F2B68] hover:bg-[#342356] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={onOpenApproval}
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
          onClick={onOpenPreview}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E85D22] to-[#CB3A14] hover:brightness-110 text-white text-xs font-black tracking-wider flex items-center gap-2 transition shadow-sm cursor-pointer uppercase font-mono"
        >
          <span>NEXT : PREVIEW REPORT →</span>
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
