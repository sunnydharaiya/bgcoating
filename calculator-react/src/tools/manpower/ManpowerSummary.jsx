import React from 'react';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  Printer,
  Eye,
  TrendingUp,
  Building2,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function ManpowerSummary({
  state,
  metrics,
  onSaveReport,
  onOpenApproval,
  onOpenPreview,
  onNavigate
}) {
  const {
    grandTotal,
    costPerM2,
    blastTotal,
    blastPM2,
    paintTotal,
    paintPM2,
    rawTotal,
    rawPM2,
    rawCoats,
    area,
    coats,
    sa3Rate,
    sa25Rate,
    sa2Rate,
    sweepRate,
    currencyObj,
    formatCur,
    formatNum
  } = metrics;

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
            <span>Module 07 · Commercial Executive Rollup</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Front Page Consolidated Summary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official executive quotation rollup combining surface prep blasting, multi-coat application, and raw material formulation costs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSaveReport('Draft')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={onOpenApproval}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validate &amp; Approve</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Dossier</span>
          </button>
        </div>
      </div>

      {/* Project Reference Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Project Commercial Identification
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Estimation No.</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {state.estNo || '—'}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Project Name</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {state.projectName || '—'}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Customer</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {state.customer || '—'}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Surface Area</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-[#E8700A] mt-0.5">
              {formatNum(area, 0)} m²
            </div>
          </div>
        </div>
      </div>

      {/* Official Cost Summary Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Consolidated Commercial Cost Summary
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#E8700A]">
            Currency: {currencyObj.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold">
                <th className="py-2.5 px-3 text-center w-12">Sr.</th>
                <th className="py-2.5 px-4">Component Description</th>
                <th className="py-2.5 px-3 text-center">Coats</th>
                <th className="py-2.5 px-3 text-right">Area (m²)</th>
                <th className="py-2.5 px-3 text-right">Per m² Rate</th>
                <th className="py-2.5 px-4 text-right">Total Cost ({currencyObj.sym})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 text-center font-bold text-[#E8700A]">1</td>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Blasting Cost <span className="text-[10px] font-mono font-normal text-slate-400 ml-1.5">[Abrasive, Crew, Equipment, Overheads]</span>
                </td>
                <td className="py-3 px-3 text-center text-slate-400 font-mono">—</td>
                <td className="py-3 px-3 text-right font-mono">{formatNum(area, 0)}</td>
                <td className="py-3 px-3 text-right font-mono font-medium">{formatCur(blastPM2)}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{formatCur(blastTotal)}</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 text-center font-bold text-[#E8700A]">2</td>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Paint Application <span className="text-[10px] font-mono font-normal text-slate-400 ml-1.5">[Painter Crew, Spray Pumps, Safety]</span>
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">{coats}</td>
                <td className="py-3 px-3 text-right font-mono">{formatNum(area, 0)}</td>
                <td className="py-3 px-3 text-right font-mono font-medium">{formatCur(paintPM2)}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{formatCur(paintTotal)}</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 text-center font-bold text-[#E8700A]">3</td>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  Paint Raw Material <span className="text-[10px] font-mono font-normal text-slate-400 ml-1.5">[Coat Formulations &amp; Thinner Dead Vol]</span>
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-purple-600 dark:text-purple-400">{rawCoats}</td>
                <td className="py-3 px-3 text-right font-mono">{formatNum(area, 0)}</td>
                <td className="py-3 px-3 text-right font-mono font-medium">{formatCur(rawPM2)}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{formatCur(rawTotal)}</td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-gradient-to-r from-[#0F4D14]/90 to-[#1B5E20]/90 text-white font-bold">
                <td colSpan={3} className="py-3.5 px-4 uppercase tracking-wider text-xs">
                  Grand Total Project Quotation
                </td>
                <td className="py-3.5 px-3 text-right font-mono">{formatNum(area, 0)} m²</td>
                <td className="py-3.5 px-3 text-right font-mono text-sm">{formatCur(costPerM2)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-base font-black text-white">{formatCur(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Surface Finish Sensitivity Comparison */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Surface Finish Commercial Sensitivity Analysis
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-500">Sa 3 (White Metal · 1.15×)</span>
            <div className="text-sm sm:text-base font-mono font-black text-red-600 dark:text-red-400 mt-1">
              {formatCur(sa3Rate)} <span className="text-[10px] text-slate-400 font-normal">/ m²</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Total: {formatCur(sa3Rate * area)}
            </div>
          </div>

          <div className="p-3 rounded-lg border-2 border-[#E8700A] bg-orange-50/50 dark:bg-orange-950/20">
            <span className="text-[10px] uppercase font-bold text-[#E8700A]">Sa 2.5 (Near White · Baseline)</span>
            <div className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white mt-1">
              {formatCur(sa25Rate)} <span className="text-[10px] text-slate-400 font-normal">/ m²</span>
            </div>
            <div className="text-[10px] text-[#E8700A] font-mono font-bold mt-1">
              Total: {formatCur(grandTotal)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-500">Sa 2 (Commercial · 0.55×)</span>
            <div className="text-sm sm:text-base font-mono font-black text-blue-600 dark:text-blue-400 mt-1">
              {formatCur(sa2Rate)} <span className="text-[10px] text-slate-400 font-normal">/ m²</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Total: {formatCur(sa2Rate * area)}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-500">Sweep Blast (Brush · 0.45×)</span>
            <div className="text-sm sm:text-base font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCur(sweepRate)} <span className="text-[10px] text-slate-400 font-normal">/ m²</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Total: {formatCur(sweepRate * area)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Output Action Rail */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Ready to save records or submit corporate dossier
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <span>Go to Register</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <span>Open Print Dossier</span>
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
