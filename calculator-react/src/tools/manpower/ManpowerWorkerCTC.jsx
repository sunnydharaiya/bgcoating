import React, { useState } from 'react';
import {
  Users,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WORKER_CATEGORY_OPTIONS } from '../../data/manpowerDatabase';

export default function ManpowerWorkerCTC({ state, onChange, metrics, onNavigate }) {
  const {
    workerBasic = 0,
    workerOT = 0,
    workerLeave = 0,
    workerGovLib = 0,
    workerMisc = 0,
    workerProfit = 0,
    workerTotalMonthlyCTC = 0,
    formatCur = (v) => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
  } = (metrics || {});

  const worker = state.worker || {};

  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);

  const handleWorkerChange = (field, value) => {
    onChange('worker', { ...worker, [field]: value });
  };

  return (
    <div className="space-y-4">
      
      {/* MODULE 5 BANNER (Matches 5.png) */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 5 · MANPOWER COST ENGINE
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Individual Worker CTC Calculator
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          Calculate fully-loaded monthly cost per worker including Basic, OT, PF (12.16%), Bonus (8.33%), Leave, Insurance, PPE, Room Rent, Travel, Medical and Profit margin.
        </p>
      </div>

      {/* SECTION 1: Worker Details & Wage */}
      <div id="section-worker-details" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Worker Details &amp; Wage
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Daily wage, OT hours, government liabilities
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              WORKER
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
            
            {/* Row 1: Worker Name, Category, Wage / Day */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  WORKER NAME
                </label>
                <input
                  type="text"
                  value={worker.name || ''}
                  onChange={(e) => handleWorkerChange('name', e.target.value)}
                  placeholder="e.g. XYZ"
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  CATEGORY
                </label>
                <select
                  value={worker.category || 'Helper'}
                  onChange={(e) => handleWorkerChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs"
                >
                  {WORKER_CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.id || opt} value={opt.id || opt}>
                      {opt.label || opt.id || opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    WAGE / DAY
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹</span>
                </div>
                <input
                  type="number"
                  value={worker.wage ?? 500}
                  onChange={(e) => handleWorkerChange('wage', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Row 2: Working Days, OT Hours, OT Multiplier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    WORKING DAYS / MONTH
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">d</span>
                </div>
                <input
                  type="number"
                  value={worker.days ?? 26}
                  onChange={(e) => handleWorkerChange('days', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    OT HOURS / DAY
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">hrs</span>
                </div>
                <input
                  type="number"
                  value={worker.otHr ?? 2}
                  onChange={(e) => handleWorkerChange('otHr', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    OT MULTIPLIER (1.5 / 2)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">x</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={worker.otMul ?? 2}
                  onChange={(e) => handleWorkerChange('otMul', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Row 3: PF, Bonus, Insurance, Profit */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    PF % OF BASIC
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">%</span>
                </div>
                <input
                  type="number"
                  value={worker.pf ?? 12.16}
                  onChange={(e) => handleWorkerChange('pf', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    BONUS % OF BASIC
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">%</span>
                </div>
                <input
                  type="number"
                  value={worker.bonus ?? 8.33}
                  onChange={(e) => handleWorkerChange('bonus', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    INSURANCE / MONTH
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">₹</span>
                </div>
                <input
                  type="number"
                  value={worker.ins ?? 250}
                  onChange={(e) => handleWorkerChange('ins', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    PROFIT %
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">%</span>
                </div>
                <input
                  type="number"
                  value={worker.pm ?? 10}
                  onChange={(e) => handleWorkerChange('pm', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Row 4: Room Rent, Travel, Medical, PPE */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  ROOM RENT / MONTH
                </label>
                <input
                  type="number"
                  value={worker.room ?? 1500}
                  onChange={(e) => handleWorkerChange('room', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  LOCAL TRAVEL / MONTH
                </label>
                <input
                  type="number"
                  value={worker.travel ?? 600}
                  onChange={(e) => handleWorkerChange('travel', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  MEDICAL / MONTH
                </label>
                <input
                  type="number"
                  value={worker.med ?? 300}
                  onChange={(e) => handleWorkerChange('med', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  PPE / MONTH
                </label>
                <input
                  type="number"
                  value={worker.ppe ?? 400}
                  onChange={(e) => handleWorkerChange('ppe', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs font-mono"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 2: Manpower CTC Output */}
      <div id="section-ctc-output" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenB(!openB)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Manpower CTC Output
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Fully loaded monthly cost calculation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              RESULT
            </span>
            {openB ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openB && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-3.5">
            
            {/* 4 Cards: Basic, Overtime, Govt Liabilities, Misc Cost */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  BASIC SALARY
                </span>
                <div className="text-lg font-black font-mono text-[#C23A1B]">
                  ₹{formatCur(workerBasic)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Wage × Days
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  OVERTIME
                </span>
                <div className="text-lg font-black font-mono text-slate-900">
                  ₹{formatCur(workerOT)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Days × OT × Mult × Wage/8
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  GOVT. LIABILITIES
                </span>
                <div className="text-lg font-black font-mono text-[#0066CC]">
                  ₹{formatCur(workerGovLib)}
                </div>
                <div className="text-[10px] font-mono text-blue-600 font-bold">
                  PF + Bonus + Leave + Ins.
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  MISC COST
                </span>
                <div className="text-lg font-black font-mono text-emerald-700">
                  ₹{formatCur(workerMisc)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Room+Travel+Med+PPE
                </div>
              </div>
            </div>

            {/* 2 Cards: Profit Margin, Leave Provision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  PROFIT MARGIN
                </span>
                <div className="text-lg font-black font-mono text-slate-900">
                  ₹{formatCur(workerProfit)}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-orange-200 bg-white space-y-0.5 shadow-2xs">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  LEAVE PROVISION
                </span>
                <div className="text-lg font-black font-mono text-[#C23A1B]">
                  ₹{formatCur(workerLeave)}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Wage × 1.33
                </div>
              </div>
            </div>

            {/* Total Monthly CTC Highlight Card */}
            <div className="p-5 rounded-xl bg-[#FFEAD5] border-2 border-[#F5C296] text-center space-y-1.5 shadow-md">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#A82B12]">
                TOTAL MONTHLY CTC
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#C23A1B]">
                ₹{formatCur(workerTotalMonthlyCTC)}
              </div>
              <div className="text-xs font-mono font-bold text-slate-700">
                Per worker · Including all liabilities, costs and profit
              </div>
            </div>

          </div>
        )}
      </div>

      {/* BRANDED FOOTER (Matches 5.png) */}
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
