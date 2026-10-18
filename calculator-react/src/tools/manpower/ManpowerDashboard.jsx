import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Layers,
  ChevronRight,
  Eye,
  Printer,
  Sparkles,
  Download
} from 'lucide-react';

// 8-Point Blasting Starburst icon matching 1.png and 7.png
function BlastBurstIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function PaintBrushIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m14 16.5 1.5 1.5a2.12 2.12 0 0 0 3-3L8.5 5 4 4.5 4.5 9l10 7.5Z" />
      <path d="m14.5 11 2.5 2.5" />
    </svg>
  );
}

export default function ManpowerDashboard({
  state,
  metrics = {},
  reports = [],
  onNavigate
}) {
  const [selectedRecordId, setSelectedRecordId] = useState('live');

  // If a saved record is chosen, load its snapshot; otherwise use live metrics & state
  const selectedReport = selectedRecordId === 'live' 
    ? null 
    : reports.find(r => r.id === selectedRecordId || r.estNo === selectedRecordId);

  const activeData = selectedReport || state || {};
  const activeMetrics = selectedReport?.metrics || metrics || {};

  const {
    grandTotal = 0,
    costPerM2 = 0,
    blastTotal = 0,
    blastPM2 = 0,
    paintTotal = 0,
    paintPM2 = 0,
    rawTotal = 0,
    area = 0,
    tonnage = 0,
    totalAbrCost = 0,
    totalDieselCost = 0,
    currencyObj = { sym: '₹', loc: 'en-IN' },
    formatNum = (v, d = 0) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
  } = activeMetrics;

  const estNo = activeData.estNo || 'EST-2026-001';
  const projName = activeData.projName || activeData.name || '—';
  const customer = activeData.customer || '—';
  const status = selectedReport ? (selectedReport.status || 'Saved') : 'Live';

  // Grouped Costs:
  // Blasting Group = Blasting (manpower/machine) + Abrasive Cost
  const totalBlastingGroup = blastTotal + totalAbrCost;
  const totalBlastingPM2 = area > 0 ? totalBlastingGroup / area : 0;

  // Painting Group = Paint Application + Paint Raw Material
  const totalPaintingGroup = paintTotal + rawTotal;
  const totalPaintingPM2 = area > 0 ? totalPaintingGroup / area : 0;

  // Component breakdowns
  const blastVarCost = blastTotal * 0.45;
  const blastManpowerCost = blastTotal * 0.30;
  const blastEquipCost = blastTotal * 0.15;
  const blastProfitCost = blastTotal * 0.10;

  const paintVarCost = paintTotal * 0.50;
  const paintManpowerCost = paintTotal * 0.35;
  const paintProfitCost = paintTotal * 0.15;

  // Percent shares for visualization
  const safeGrand = grandTotal > 0 ? grandTotal : 1;
  const blastShare = ((blastTotal / safeGrand) * 100).toFixed(1);
  const abrShare = ((totalAbrCost / safeGrand) * 100).toFixed(1);
  const paintShare = ((paintTotal / safeGrand) * 100).toFixed(1);
  const rawShare = ((rawTotal / safeGrand) * 100).toFixed(1);

  // Donut slices calculations
  const blastAngle = (blastTotal / safeGrand) * 360;
  const abrAngle = (totalAbrCost / safeGrand) * 360;
  const paintAngle = (paintTotal / safeGrand) * 360;
  const rawAngle = (rawTotal / safeGrand) * 360;

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* 1. Header Banner: MODULE 10 · ANALYTICS */}
      <div className="bg-gradient-to-r from-[#85252B] via-[#6B1E23] to-[#85252B] text-white p-4 rounded-xl shadow-md border border-[#8C232A]">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 10 · ANALYTICS
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Estimation Dashboard
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          Interactive overview of your estimations. Review the current estimation or any saved record — with cost breakup visualization and section-wise analysis.
        </p>
      </div>

      {/* 2. Dashboard View Selector & Primary Metrics Card */}
      <div className="rounded-xl overflow-hidden border border-[#F5C296] bg-[#FFFBF7] shadow-xs space-y-4">
        
        {/* Header Bar */}
        <div className="bg-[#FFEAD5] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#F5C296]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Dashboard View
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Select estimation to review
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="bg-white border border-[#E8700A]/40 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#E8700A] cursor-pointer"
            >
              <option value="live">Current Estimation (live)</option>
              {reports.map((r, i) => (
                <option key={r.id || i} value={r.id || r.estNo}>
                  {r.estNo || `EST-${i + 1}`} • {r.projName || 'Project'} ({r.savedAt || r.date || 'Saved'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4">
          
          <div className="bg-white border border-rose-200/80 rounded-xl p-3 shadow-2xs">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">
              GRAND TOTAL
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#DC2626] mt-1 truncate">
              {currencyObj.sym}{formatNum(grandTotal, 0)}
            </div>
          </div>

          <div className="bg-white border border-orange-200/80 rounded-xl p-3 shadow-2xs">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">
              PER M² COST
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 mt-1 truncate">
              {costPerM2 > 0 ? `${currencyObj.sym}${formatNum(costPerM2, 0)}` : '—'}
            </div>
          </div>

          <div className="bg-white border border-sky-200/80 rounded-xl p-3 shadow-2xs">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">
              SURFACE AREA
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#0284C7] mt-1 truncate">
              {formatNum(area, 0)} <span className="text-xs font-normal text-slate-400">m²</span>
            </div>
          </div>

          <div className="bg-white border border-emerald-200/80 rounded-xl p-3 shadow-2xs">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">
              STATUS
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#16A34A] mt-1 truncate">
              {status}
            </div>
          </div>

        </div>

        {/* Estimation Identification Banner */}
        <div className="mx-4 mb-4 bg-gradient-to-r from-[#85252B] via-[#6B1E23] to-[#85252B] text-white p-3 rounded-xl shadow-xs">
          <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
            ESTIMATION
          </div>
          <div className="text-sm font-bold text-white mt-0.5">
            {estNo} • {projName}
          </div>
          <div className="text-xs text-rose-100/90 mt-0.5">
            Customer: <span className="font-semibold text-white">{customer}</span>
          </div>
        </div>

      </div>

      {/* 3. GROUPED COST TOTALS */}
      <div className="space-y-1">
        <div className="bg-[#85252B] text-white px-3 py-1.5 rounded-t-xl font-mono font-bold text-[10px] uppercase tracking-wider">
          GROUPED COST TOTALS
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-white border border-[#F5C296]/60 rounded-b-xl shadow-xs">
          
          {/* Left: Blasting Cost Total */}
          <div className="border border-orange-300/80 bg-[#FFFDF9] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <BlastBurstIcon className="w-4 h-4 text-[#EF4444]" />
              <span className="font-bold text-xs text-[#351907]">
                BLASTING COST TOTAL <span className="text-[10px] font-normal text-slate-500">[BLASTING + ABRASIVE]</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white border border-orange-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">
                  TOTAL COST
                </span>
                <span className="text-base font-mono font-black text-[#DC2626] block mt-0.5">
                  {currencyObj.sym}{formatNum(totalBlastingGroup, 0)}
                </span>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">
                  PER SQ.M. COST
                </span>
                <span className="text-base font-mono font-black text-slate-800 block mt-0.5">
                  {totalBlastingPM2 > 0 ? `${currencyObj.sym}${formatNum(totalBlastingPM2, 0)}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Painting Cost Total */}
          <div className="border border-sky-300/80 bg-[#F8FBFF] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <PaintBrushIcon className="w-4 h-4 text-[#0284C7]" />
              <span className="font-bold text-xs text-[#1E3A8A]">
                PAINTING COST TOTAL <span className="text-[10px] font-normal text-slate-500">[APPLICATION + RAW MATERIAL]</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white border border-sky-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">
                  TOTAL COST
                </span>
                <span className="text-base font-mono font-black text-[#0284C7] block mt-0.5">
                  {currencyObj.sym}{formatNum(totalPaintingGroup, 0)}
                </span>
              </div>
              <div className="bg-white border border-sky-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">
                  PER SQ.M. COST
                </span>
                <span className="text-base font-mono font-black text-slate-800 block mt-0.5">
                  {totalPaintingPM2 > 0 ? `${currencyObj.sym}${formatNum(totalPaintingPM2, 0)}` : '—'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. COMPONENT COST BREAKDOWN */}
      <div className="space-y-1">
        <div className="bg-[#85252B] text-white px-3 py-1.5 rounded-t-xl font-mono font-bold text-[10px] uppercase tracking-wider">
          COMPONENT COST BREAKDOWN
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-white border border-[#F5C296]/60 rounded-b-xl shadow-xs">
          
          {/* Left: Blasting Component Breakdown */}
          <div className="border border-orange-300/80 bg-[#FFFDF9] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <BlastBurstIcon className="w-4 h-4 text-[#EF4444]" />
              <span className="font-bold text-xs text-[#351907]">
                BLASTING COST TOTAL [BLASTING + ABRASIVE]
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-orange-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">TOTAL COST</span>
                <span className="text-sm font-mono font-black text-[#DC2626] block mt-0.5">
                  {currencyObj.sym}{formatNum(totalBlastingGroup, 0)}
                </span>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">PER SQ.M. COST</span>
                <span className="text-sm font-mono font-black text-slate-800 block mt-0.5">
                  {totalBlastingPM2 > 0 ? `${currencyObj.sym}${formatNum(totalBlastingPM2, 0)}` : '—'}
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-1 text-xs">
              <button 
                onClick={() => onNavigate && onNavigate('blasting')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Blasting Variables</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(blastVarCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('worker-ctc')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Manpower Setup &amp; Rates</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(blastManpowerCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('blasting')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Equipment &amp; Misc Charges</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(blastEquipCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('summary')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Profit, Misc &amp; Mob-Demob</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(blastProfitCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('abrasive-diesel')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-orange-100 hover:bg-orange-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Abrasive Cost</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(totalAbrCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Right: Painting Component Breakdown */}
          <div className="border border-sky-300/80 bg-[#F8FBFF] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <PaintBrushIcon className="w-4 h-4 text-[#0284C7]" />
              <span className="font-bold text-xs text-[#1E3A8A]">
                PAINTING COST TOTAL [APPLICATION + RAW MAT]
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-sky-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">TOTAL COST</span>
                <span className="text-sm font-mono font-black text-[#0284C7] block mt-0.5">
                  {currencyObj.sym}{formatNum(totalPaintingGroup, 0)}
                </span>
              </div>
              <div className="bg-white border border-sky-200 rounded-lg p-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">PER SQ.M. COST</span>
                <span className="text-sm font-mono font-black text-slate-800 block mt-0.5">
                  {totalPaintingPM2 > 0 ? `${currencyObj.sym}${formatNum(totalPaintingPM2, 0)}` : '—'}
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-1 text-xs">
              <button 
                onClick={() => onNavigate && onNavigate('painting')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-sky-100 hover:bg-sky-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Painting Variables</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(paintVarCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('worker-ctc')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-sky-100 hover:bg-sky-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Painting Manpower Setup</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(paintManpowerCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('summary')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-sky-100 hover:bg-sky-50/50 transition cursor-pointer"
              >
                <span className="font-semibold text-slate-700">Profit, Misc &amp; Mob-Demob</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{currencyObj.sym}{formatNum(paintProfitCost, 0)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 5. COST BREAKUP VISUALIZATION (Donut Chart matching 7.png) */}
      <div className="space-y-1">
        <div className="bg-[#85252B] text-white px-3 py-1.5 rounded-t-xl font-mono font-bold text-[10px] uppercase tracking-wider">
          COST BREAKUP VISUALIZATION
        </div>

        <div className="bg-white border border-[#F5C296]/60 rounded-b-xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-around gap-8">
          
          {/* Donut Chart SVG */}
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="14"
              />
              {/* Blasting slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#B93815"
                strokeWidth="14"
                strokeDasharray={`${(blastShare * 2.387).toFixed(1)} 239`}
                strokeDashoffset="0"
              />
              {/* Paint Application slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#F97316"
                strokeWidth="14"
                strokeDasharray={`${(paintShare * 2.387).toFixed(1)} 239`}
                strokeDashoffset={`-${(blastShare * 2.387).toFixed(1)}`}
              />
              {/* Paint Raw Material slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#EAB308"
                strokeWidth="14"
                strokeDasharray={`${(rawShare * 2.387).toFixed(1)} 239`}
                strokeDashoffset={`-${((Number(blastShare) + Number(paintShare)) * 2.387).toFixed(1)}`}
              />
              {/* Abrasive slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="14"
                strokeDasharray={`${(abrShare * 2.387).toFixed(1)} 239`}
                strokeDashoffset={`-${((Number(blastShare) + Number(paintShare) + Number(rawShare)) * 2.387).toFixed(1)}`}
              />
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">
                GRAND TOTAL
              </span>
              <span className="text-sm font-mono font-black text-slate-800 mt-0.5">
                {currencyObj.sym}{formatNum(grandTotal, 0)}
              </span>
            </div>
          </div>

          {/* Breakdown Legend Table */}
          <div className="w-full max-w-md space-y-2 text-xs">
            
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#B93815] shrink-0" />
                <span className="font-bold text-slate-700">Blasting</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="font-bold text-slate-900">{currencyObj.sym}{formatNum(blastTotal, 0)}</span>
                <span className="text-slate-500 w-12 text-right">{blastShare}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#F97316] shrink-0" />
                <span className="font-bold text-slate-700">Paint Application</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="font-bold text-slate-900">{currencyObj.sym}{formatNum(paintTotal, 0)}</span>
                <span className="text-slate-500 w-12 text-right">{paintShare}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#EAB308] shrink-0" />
                <span className="font-bold text-slate-700">Paint Raw Material</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="font-bold text-slate-900">{currencyObj.sym}{formatNum(rawTotal, 0)}</span>
                <span className="text-slate-500 w-12 text-right">{rawShare}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#06B6D4] shrink-0" />
                <span className="font-bold text-slate-700">Abrasive</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="font-bold text-slate-900">{currencyObj.sym}{formatNum(totalAbrCost, 0)}</span>
                <span className="text-slate-500 w-12 text-right">{abrShare}%</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 6. SECTION-WISE COST TABLE */}
      <div className="space-y-1">
        <div className="bg-[#85252B] text-white px-3 py-1.5 rounded-t-xl font-mono font-bold text-[10px] uppercase tracking-wider">
          SECTION-WISE COST
        </div>

        <div className="bg-white border border-[#F5C296]/60 rounded-b-xl overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FFEAD5]/80 text-[#351907] font-bold text-[10px] uppercase border-b border-[#F5C296]">
                <th className="py-2.5 px-3 w-12">SR.</th>
                <th className="py-2.5 px-3">COMPONENT</th>
                <th className="py-2.5 px-3 text-right">TOTAL COST</th>
                <th className="py-2.5 px-3 text-right">PER M²</th>
                <th className="py-2.5 px-3 text-right w-20">SHARE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Row 1: Blasting */}
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-2 px-3 font-mono text-slate-500">1</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#B93815] shrink-0" />
                    <span className="font-semibold text-slate-800">Blasting</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {currencyObj.sym}{formatNum(blastTotal, 0)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-700">
                  {blastPM2 > 0 ? `${currencyObj.sym}${formatNum(blastPM2, 0)}` : '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700">
                  {blastShare}%
                </td>
              </tr>

              {/* Row 2: Abrasive */}
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-2 px-3 font-mono text-slate-500">2</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#06B6D4] shrink-0" />
                    <span className="font-semibold text-slate-800">Abrasive</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {currencyObj.sym}{formatNum(totalAbrCost, 0)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-700">
                  {area > 0 && totalAbrCost > 0 ? `${currencyObj.sym}${formatNum(totalAbrCost / area, 0)}` : '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700">
                  {abrShare}%
                </td>
              </tr>

              {/* Row 3: Paint Application */}
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-2 px-3 font-mono text-slate-500">3</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#F97316] shrink-0" />
                    <span className="font-semibold text-slate-800">Paint Application</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {currencyObj.sym}{formatNum(paintTotal, 0)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-700">
                  {paintPM2 > 0 ? `${currencyObj.sym}${formatNum(paintPM2, 0)}` : '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700">
                  {paintShare}%
                </td>
              </tr>

              {/* Subrow: 1st Coat */}
              <tr className="bg-slate-50/40 text-slate-600">
                <td className="py-1.5 px-3"></td>
                <td className="py-1.5 px-3 pl-8 text-[11px] text-slate-500 italic">
                  ↳ 1st Coat — Coat 1
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-xs text-slate-600">
                  {currencyObj.sym}{formatNum(paintTotal, 0)}
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-xs text-slate-600">
                  {paintPM2 > 0 ? `${currencyObj.sym}${formatNum(paintPM2, 0)}` : '—'}
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-xs text-slate-600">
                  {paintShare}%
                </td>
              </tr>

              {/* Row 4: Paint Raw Material */}
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-2 px-3 font-mono text-slate-500">4</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#EAB308] shrink-0" />
                    <span className="font-semibold text-slate-800">Paint Raw Material</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {currencyObj.sym}{formatNum(rawTotal, 0)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-700">
                  {area > 0 && rawTotal > 0 ? `${currencyObj.sym}${formatNum(rawTotal / area, 0)}` : '—'}
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700">
                  {rawShare}%
                </td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-[#FFF8F2] font-bold border-t-2 border-[#F5C296]">
                <td className="py-3 px-3 font-mono text-slate-900" colSpan={2}>
                  GRAND TOTAL
                </td>
                <td className="py-3 px-3 text-right font-mono font-black text-base text-[#DC2626]">
                  {currencyObj.sym}{formatNum(grandTotal, 0)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  {costPerM2 > 0 ? `${currencyObj.sym}${formatNum(costPerM2, 0)}` : '—'}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  100%
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Branded Footer (Matches 1.png - 7.png) */}
      <footer className="mt-8 rounded-xl bg-[#200A05] border border-[#4A1A0B] p-5 text-center text-white shadow-md">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs">
            <img src="/logo-2.png" alt="BG Group" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
            <span className="text-[#E8700A]">BG GROUP</span> of Paint and Coating Consultant
          </span>
        </div>
        <p className="text-[10px] text-amber-200/80 uppercase font-mono tracking-wider mb-2">
          Industrial Cost Estimation · Surface Protection · Coating Engineering
        </p>
        <div className="text-[10px] text-slate-400 space-x-2 font-mono">
          <span>E 103, Akash Echo Point, Bhimrad, Surat — 395007, Gujarat, India</span>
          <span>|</span>
          <span className="text-amber-400 font-bold">+91 99258 10408</span>
          <span>|</span>
          <a href="mailto:support@bgcoating.com" className="text-amber-400 hover:underline">support@bgcoating.com</a>
          <span>|</span>
          <a href="https://bgcoating.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">www.bgcoating.com</a>
        </div>
      </footer>

    </div>
  );
}
