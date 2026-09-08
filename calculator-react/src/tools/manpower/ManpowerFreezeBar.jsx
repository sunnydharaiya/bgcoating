import React from 'react';
import { RotateCcw, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function ManpowerFreezeBar({ state, metrics, onReset }) {
  const {
    completionPct,
    grandTotal,
    costPerM2,
    blastTotal,
    paintTotal,
    paintPM2,
    rawTotal,
    area,
    tonnage,
    blastOut,
    dailyTarget,
    totalDays,
    reqBlastDays,
    totalAbrTon,
    totalAbrCost,
    totalDieselL,
    totalDieselCost,
    formatCur,
    formatNum
  } = metrics;

  // Donut chart stroke math (radius 29, circumference = 2 * PI * 29 ~= 182.2)
  const circumference = 182.2;
  const strokeDash = `${((completionPct / 100) * circumference).toFixed(1)} ${circumference}`;

  let stageLabel = 'Project Setup';
  if (completionPct >= 85) stageLabel = 'Estimation Complete';
  else if (completionPct >= 55) stageLabel = 'Costing in Progress';
  else if (completionPct >= 25) stageLabel = 'Inputs Being Defined';

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-[#180900] via-[#2A1205] to-[#180900] text-white border-b-2 border-[#E8700A]/40 shadow-xl px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-3 justify-between">
        
        {/* Left: Progress Gauge + Project Identity */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-between lg:justify-start">
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r="29"
                fill="none"
                stroke="#442211"
                strokeWidth="6"
              />
              <circle
                cx="35"
                cy="35"
                r="29"
                fill="none"
                stroke="url(#donutGrad)"
                strokeWidth="6"
                strokeDasharray={strokeDash}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5911F" />
                  <stop offset="100%" stopColor="#E8700A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono font-black text-[#F5911F] leading-none">
                {completionPct}%
              </span>
            </div>
          </div>

          <div className="flex flex-col min-w-[120px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F5911F]">
                {stageLabel}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
              {state.projectName || 'Untitled Estimation'}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
              {state.customer || 'Customer not set'}
            </div>
          </div>

          {/* Quick Clear Button */}
          <button
            onClick={onReset}
            title="Reset form fields to blank"
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Center & Right: Dual Metric Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
          
          {/* Tile 1: Grand Total */}
          <div className="bg-gradient-to-br from-[#0F4D14]/90 to-[#1B5E20]/90 border border-emerald-500/40 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-emerald-200 uppercase tracking-tight">Grand Total</span>
            <span className="text-xs sm:text-sm font-mono font-black text-white truncate" title={formatCur(grandTotal)}>
              {formatCur(grandTotal)}
            </span>
          </div>

          {/* Tile 2: Per m² Cost */}
          <div className="bg-gradient-to-br from-[#1565C0]/90 to-[#0D47A1]/90 border border-blue-500/40 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-blue-200 uppercase tracking-tight">Cost / m²</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-white truncate">
              {formatCur(costPerM2)}
            </span>
          </div>

          {/* Tile 3: Blasting Cost */}
          <div className="bg-white/5 border border-[#E8700A]/30 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#F5911F] uppercase tracking-tight">Blasting Cost</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 truncate" title={formatCur(blastTotal)}>
              {formatCur(blastTotal)}
            </span>
          </div>

          {/* Tile 4: Paint App Cost */}
          <div className="bg-white/5 border border-[#E8700A]/30 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#F5911F] uppercase tracking-tight">Paint App Cost</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 truncate" title={formatCur(paintTotal)}>
              {formatCur(paintTotal)}
            </span>
          </div>

          {/* Tile 5: Paint Raw Mat */}
          <div className="bg-white/5 border border-[#E8700A]/30 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#F5911F] uppercase tracking-tight">Paint Raw Mat</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 truncate" title={formatCur(rawTotal)}>
              {formatCur(rawTotal)}
            </span>
          </div>

          {/* Tile 6: Surface Area */}
          <div className="bg-white/5 border border-white/10 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Surface Area</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 truncate">
              {formatNum(area, 0)} <span className="text-[9px] text-slate-400">m²</span>
            </span>
          </div>

          {/* Tile 7: Abrasive Metric */}
          <div className="bg-white/5 border border-white/10 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Abrasive Qty</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-300 truncate">
              {formatNum(totalAbrTon, 2)} <span className="text-[9px] text-slate-400">Ton</span>
            </span>
          </div>

          {/* Tile 8: Schedule Duration */}
          <div className="bg-white/5 border border-white/10 rounded p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Total Days</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 truncate">
              {formatNum(totalDays, 0)} <span className="text-[9px] text-slate-400">Days</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
