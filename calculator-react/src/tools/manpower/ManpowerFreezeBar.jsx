import React from 'react';
import { RotateCcw, Save, Eye } from 'lucide-react';

export default function ManpowerFreezeBar({ state, metrics, onReset, onSaveDraft, onPreview }) {
  const {
    completionPct = 0,
    grandTotal = 0,
    costPerM2 = 0,
    blastTotal = 0,
    paintTotal = 0,
    paintPM2 = 0,
    rawTotal = 0,
    area = 0,
    tonnage = 0,
    blastOut = 0,
    dailyTarget = 0,
    totalDays = 0,
    reqBlastDays = 0,
    totalAbrTon = 0,
    totalAbrCost = 0,
    totalDieselL = 0,
    totalDieselCost = 0,
    currencyObj = { sym: '₹', loc: 'en-IN' },
    formatCur,
    formatNum = (v, d = 0) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
  } = (metrics || {});

  let stageLabel = 'PROJECT SETUP';
  if (completionPct >= 85) stageLabel = 'ESTIMATION COMPLETE';
  else if (completionPct >= 55) stageLabel = 'COSTING IN PROGRESS';
  else if (completionPct >= 25) stageLabel = 'INPUTS DEFINED';

  return (
    <div className="w-full bg-[#1F0D06] border border-[#4E2213] rounded-xl shadow-xl p-3 text-white space-y-2.5 select-none">
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#3E1A0D]">
        
        {/* Left Title & Auto-Calculated Pill */}
        <div className="flex items-center gap-2">
          {/* Multi-color mini-badge matching 1.png */}
          <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-emerald-500 via-amber-400 to-rose-500 shrink-0" />
          <span className="font-mono font-black text-xs uppercase tracking-wider text-white">
            ESTIMATION PROGRESS
          </span>
          <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border border-[#F5911F]/60 bg-[#F5911F]/15 text-[#F5911F] tracking-tight">
            @ AUTO-CALCULATED · REFERENCE
          </span>
        </div>

        {/* Right Status Badges & Reset Button */}
        <div className="flex items-center gap-2">
          <span className="border border-[#F5911F] bg-[#3B1909] text-[#F5911F] font-mono font-black text-[10px] px-2.5 py-0.5 rounded-sm uppercase tracking-wide">
            {stageLabel}
          </span>
          
          <div className="flex flex-col items-center justify-center px-2 py-0.5 rounded-sm bg-[#150702] border border-[#4E2213] text-center leading-none">
            <span className="text-[10px] font-mono font-black text-white">
              {completionPct}%
            </span>
            <span className="text-[7px] font-mono text-slate-400 uppercase">
              COMPLETE
            </span>
          </div>

          <button
            onClick={onReset}
            title="Reset estimation inputs"
            className="flex items-center gap-1 px-2.5 py-1 rounded-sm border border-[#F5911F]/70 bg-[#2D1409] hover:bg-[#3D1A0C] text-[10px] font-mono font-bold text-[#F5911F] hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5 text-[#F5911F]" />
            <span>RESET</span>
          </button>

          {onSaveDraft && (
            <button
              onClick={onSaveDraft}
              title="Save estimation draft"
              className="flex items-center gap-1 px-2.5 py-1 rounded-sm border border-[#F5911F]/70 bg-[#2D1409] hover:bg-[#3D1A0C] text-[10px] font-mono font-bold text-[#F5911F] hover:text-white transition cursor-pointer"
            >
              <Save className="w-2.5 h-2.5 text-[#F5911F]" />
              <span className="hidden sm:inline">SAVE</span>
            </button>
          )}

          {onPreview && (
            <button
              onClick={onPreview}
              title="Preview estimation dossier"
              className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-gradient-to-r from-[#F5911F] to-[#E8700A] text-white text-[10px] font-mono font-bold shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              <Eye className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">PREVIEW</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Track Line */}
      <div className="h-1 w-full bg-[#35160A] rounded-full overflow-hidden -mt-1">
        <div 
          className="h-full bg-gradient-to-r from-[#F5911F] to-[#E8700A] transition-all duration-300"
          style={{ width: `${Math.max(completionPct, 2)}%` }}
        />
      </div>

      {/* Row 1: QUANTUM & SCHEDULE + DIESEL CONSUMPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-2.5 items-end">
        
        {/* Left 6 Cards: QUANTUM & SCHEDULE */}
        <div className="lg:col-span-6 space-y-1">
          <div className="text-[9px] font-mono font-bold text-[#F5911F] uppercase tracking-wider">
            QUANTUM &amp; SCHEDULE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
            
            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                TOTAL QUANTUM
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(area, 0)} <span className="text-[9px] font-normal text-slate-400">m²</span>
              </span>
            </div>

            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                TOTAL QUANTUM
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(tonnage, 0)} <span className="text-[9px] font-normal text-slate-400">MT</span>
              </span>
            </div>

            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                BLAST OUTPUT CAP.
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(blastOut, 0)} <span className="text-[9px] font-normal text-slate-400">m²/shift</span>
              </span>
            </div>

            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                BLAST TARGET CAP.
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(dailyTarget, 1)} <span className="text-[9px] font-normal text-slate-400">m²/day</span>
              </span>
            </div>

            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                PROJECT SCHEDULE
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(totalDays, 0)} <span className="text-[9px] font-normal text-slate-400">days</span>
              </span>
            </div>

            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                REQUIRED SCHEDULE
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(reqBlastDays, 1)} <span className="text-[9px] font-normal text-slate-400">days</span>
              </span>
            </div>

          </div>
        </div>

        {/* Right Subcard: DIESEL CONSUMPTION */}
        <div className="lg:col-span-2 space-y-1">
          <div className="text-[9px] font-mono font-bold text-[#F5911F] uppercase tracking-wider">
            DIESEL CONSUMPTION
          </div>
          <div className="bg-[#24120A] border border-[#9A501F] rounded-md p-2 flex items-center justify-between min-h-[46px]">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight">
                TOTAL DIESEL CONSUMPTION
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(totalDieselL, 1)} <span className="text-[9px] font-normal text-slate-400">L</span>
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight">
                TOTAL DIESEL COST
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {currencyObj.sym}{formatNum(totalDieselCost, 0)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: COMMERCIAL SUMMARY + ABRASIVE CONSUMPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-2.5 items-end">
        
        {/* Left 6 Cards: COMMERCIAL SUMMARY */}
        <div className="lg:col-span-6 space-y-1">
          <div className="text-[9px] font-mono font-bold text-[#F5911F] uppercase tracking-wider">
            COMMERCIAL SUMMARY
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
            
            {/* Card 1: TOTAL COST (Vibrant Emerald Green) */}
            <div className="bg-[#136C2B] border border-[#22C55E] rounded-md p-2 flex flex-col justify-between min-h-[46px] shadow-xs">
              <span className="text-[8px] font-mono font-bold text-emerald-100 uppercase tracking-tight truncate">
                TOTAL COST
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-white mt-0.5 truncate" title={formatCur ? formatCur(grandTotal) : grandTotal}>
                {currencyObj.sym}{formatNum(grandTotal, 0)}
              </span>
            </div>

            {/* Card 2: TOTAL COST / M² (Vibrant Emerald Green) */}
            <div className="bg-[#136C2B] border border-[#22C55E] rounded-md p-2 flex flex-col justify-between min-h-[46px] shadow-xs">
              <span className="text-[8px] font-mono font-bold text-emerald-100 uppercase tracking-tight truncate">
                TOTAL COST / M²
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-white mt-0.5">
                {costPerM2 > 0 ? `${currencyObj.sym}${formatNum(costPerM2, 0)}` : '—'}
              </span>
            </div>

            {/* Card 3: BLASTING TOTAL COST */}
            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                BLASTING TOTAL COST
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5 truncate" title={formatCur ? formatCur(blastTotal) : blastTotal}>
                {currencyObj.sym}{formatNum(blastTotal, 0)}
              </span>
            </div>

            {/* Card 4: PAINT APR. COST */}
            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                PAINT APR. COST
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5 truncate" title={formatCur ? formatCur(paintTotal) : paintTotal}>
                {currencyObj.sym}{formatNum(paintTotal, 0)}
              </span>
            </div>

            {/* Card 5: PAINT APR. COST / M² */}
            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                PAINT APR. COST / M²
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {paintPM2 > 0 ? `${currencyObj.sym}${formatNum(paintPM2, 0)}` : '—'}
              </span>
            </div>

            {/* Card 6: PAINT RAW MAT. COST */}
            <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex flex-col justify-between min-h-[46px]">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">
                PAINT RAW MAT. COST
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5 truncate" title={formatCur ? formatCur(rawTotal) : rawTotal}>
                {currencyObj.sym}{formatNum(rawTotal, 0)}
              </span>
            </div>

          </div>
        </div>

        {/* Right Subcard: ABRASIVE CONSUMPTION */}
        <div className="lg:col-span-2 space-y-1">
          <div className="text-[9px] font-mono font-bold text-[#F5911F] uppercase tracking-wider">
            ABRASIVE CONSUMPTION
          </div>
          <div className="bg-[#24120A] border border-[#552718] rounded-md p-2 flex items-center justify-between min-h-[46px]">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight">
                TOTAL ABRASIVE CONSUMPTION
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {formatNum(totalAbrTon, 2)} <span className="text-[9px] font-normal text-slate-400">Ton</span>
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight">
                TOTAL ABRASIVE COST
              </span>
              <span className="text-xs font-mono font-black text-amber-300 mt-0.5">
                {currencyObj.sym}{formatNum(totalAbrCost, 0)}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
