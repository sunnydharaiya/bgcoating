import React from 'react';
import {
  Users,
  Coins,
  ShieldCheck,
  Building,
  HeartPulse,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { WORKER_CATEGORY_OPTIONS } from '../../data/manpowerDatabase';

export default function ManpowerWorkerCTC({ state, onChange, metrics, onNavigate }) {
  const {
    workerBasic,
    workerOT,
    workerLeave,
    workerGovLib,
    workerMisc,
    workerProfit,
    workerTotalMonthlyCTC,
    formatCur
  } = metrics;

  const worker = state.worker || {};

  const handleWorkerChange = (field, value) => {
    onChange('worker', { ...worker, [field]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header & Monthly CTC Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
              <span>Module 05 · Labor Economics</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Individual Worker Monthly CTC Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Calculates fully loaded employer liability per tradesman: statutory PF (12.16%), annual bonus (8.33%), paid leave accrual, room accommodation, transportation, and medical coverage.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1F4E79] to-[#0D47A1] text-white p-3.5 rounded-xl shadow-md min-w-[220px] shrink-0">
            <div className="text-[10px] uppercase font-bold text-blue-200">Total Monthly CTC / Worker</div>
            <div className="text-xl font-mono font-black">{formatCur(workerTotalMonthlyCTC)}</div>
            <div className="text-[11px] font-mono text-blue-200 mt-0.5">
              Daily Wage: {formatCur(worker.wage || 487)} / day
            </div>
          </div>
        </div>

        {/* 6 Output KPI Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase">1. Basic Wage</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatCur(workerBasic)}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase">2. Overtime</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatCur(workerOT)}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase">3. Govt / PF / Bonus</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatCur(workerGovLib)}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase">4. Misc Camp/Travel</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatCur(workerMisc)}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase">5. Leave Accrual</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatCur(workerLeave)}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">6. Profit Margin</span>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCur(workerProfit)}</div>
          </div>
        </div>
      </div>

      {/* Input Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Wage & Overtime */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Users className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Worker Category &amp; Daily Wage Rate
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Worker Designation
              </label>
              <select
                value={worker.category || 'Helper'}
                onChange={(e) => handleWorkerChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              >
                {WORKER_CATEGORY_OPTIONS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Wage (Per 8-hr Shift)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={worker.wage ?? 487}
                onChange={(e) => handleWorkerChange('wage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Working Days / Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={worker.days ?? 26}
                onChange={(e) => handleWorkerChange('days', parseFloat(e.target.value) || 26)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Overtime Hours / Day
              </label>
              <input
                type="number"
                min="0"
                max="12"
                step="any"
                value={worker.otHr ?? 4}
                onChange={(e) => handleWorkerChange('otHr', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                OT Multiplier Factor
              </label>
              <select
                value={worker.otMul ?? 1.5}
                onChange={(e) => handleWorkerChange('otMul', parseFloat(e.target.value) || 1.5)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value="1.0">1.0× (Standard Single Rate)</option>
                <option value="1.5">1.5× (150% Overtime Rate)</option>
                <option value="2.0">2.0× (Double Time Rate)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subcontractor Margin %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={worker.pm ?? 10}
                onChange={(e) => handleWorkerChange('pm', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-[#E8700A]"
              />
            </div>
          </div>
        </div>

        {/* Statutory Liabilities & Camp Living */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Statutory Liabilities &amp; Camp Allowances
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Provident Fund (PF %)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="any"
                value={worker.pf ?? 12.16}
                onChange={(e) => handleWorkerChange('pf', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Annual Bonus %
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="any"
                value={worker.bonus ?? 8.33}
                onChange={(e) => handleWorkerChange('bonus', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Insurance (Monthly)
              </label>
              <input
                type="number"
                min="0"
                value={worker.ins ?? 400}
                onChange={(e) => handleWorkerChange('ins', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Room Accommodation / Mo
              </label>
              <input
                type="number"
                min="0"
                value={worker.room ?? 2000}
                onChange={(e) => handleWorkerChange('room', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Local Transportation / Mo
              </label>
              <input
                type="number"
                min="0"
                value={worker.travel ?? 2000}
                onChange={(e) => handleWorkerChange('travel', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Medical &amp; PPE / Mo
              </label>
              <input
                type="number"
                min="0"
                value={(worker.med ?? 100) + (worker.ppe ?? 150)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  handleWorkerChange('med', Math.round(val * 0.4));
                  handleWorkerChange('ppe', Math.round(val * 0.6));
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Step 5 of 7 Completed · Monthly Worker CTC: <span className="font-mono font-bold text-[#F5911F]">{formatCur(workerTotalMonthlyCTC)}</span>
        </div>
        <button
          onClick={() => onNavigate('abrasive-diesel')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>Next: Abrasive &amp; Diesel Dynamics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
