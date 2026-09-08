import React from 'react';
import {
  Building2,
  Calendar,
  Layers,
  Scale,
  Clock,
  ArrowRight,
  ShieldAlert,
  Coins,
  Check
} from 'lucide-react';
import {
  CURRENCY_CONFIG,
  MOC_OPTIONS,
  SURFACE_PREP_OPTIONS,
  STRUCTURE_OPTIONS
} from '../../data/manpowerDatabase';

export default function ManpowerProjectInfo({ state, onChange, metrics, onNavigate }) {
  const {
    totalDays,
    reqBlastDays,
    blastingSetups,
    dailyTarget,
    formatNum
  } = metrics;

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
          <span>Module 01 · Setup</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Project Information &amp; Scale Schedule
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure project metadata, substrate metallurgy, environmental service constraints, surface area quantum, and baseline shift productivity targets.
        </p>
      </div>

      {/* SECTION A: Project Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Section A · Project Identification
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Estimation No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.estNo || ''}
              onChange={(e) => handleFieldChange('estNo', e.target.value)}
              placeholder="e.g. EST-2026-27 - 01"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.projectName || ''}
              onChange={(e) => handleFieldChange('projectName', e.target.value)}
              placeholder="e.g. Amine Absorber Column"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer / Client <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.customer || ''}
              onChange={(e) => handleFieldChange('customer', e.target.value)}
              placeholder="e.g. ExxonMobil / Reliance"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Location / Site
            </label>
            <input
              type="text"
              value={state.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g. Hazira, Gujarat"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* SECTION B: Basic Requirements */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Section B · Substrate &amp; Service Classification
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Material of Construction (MOC)
            </label>
            <select
              value={state.moc || 'CS'}
              onChange={(e) => handleFieldChange('moc', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              {MOC_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Surface Preparation Standard
            </label>
            <select
              value={state.surfacePrep || 'Sa2.5'}
              onChange={(e) => handleFieldChange('surfacePrep', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              {SURFACE_PREP_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Structure Complexity
            </label>
            <select
              value={state.structure || 'Light'}
              onChange={(e) => handleFieldChange('structure', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              {STRUCTURE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cyclic Service (&gt;60°C)
            </label>
            <select
              value={state.cyclic || 'No'}
              onChange={(e) => handleFieldChange('cyclic', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              <option value="No">No — Constant / Ambient</option>
              <option value="Yes">Yes — Severe Thermal Cycling</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fireproofing Scope
            </label>
            <select
              value={state.fireproof || 'No'}
              onChange={(e) => handleFieldChange('fireproof', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              <option value="No">No Fireproofing</option>
              <option value="Yes">Yes — Intumescent / Cementitious</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION C: Scale & Schedule */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Section C · Project Quantum, Currency &amp; Schedule
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Surface Area (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.area ?? ''}
              onChange={(e) => handleFieldChange('area', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total Tonnage (MT)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.tonnage ?? ''}
              onChange={(e) => handleFieldChange('tonnage', e.target.value)}
              placeholder="e.g. 850"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Estimation Currency
            </label>
            <select
              value={state.currency || 'INR'}
              onChange={(e) => handleFieldChange('currency', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              {Object.entries(CURRENCY_CONFIG).map(([code, cur]) => (
                <option key={code} value={code}>{cur.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Duration (Months)
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={state.months ?? 1}
              onChange={(e) => handleFieldChange('months', parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Working Days / Mo
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={state.wdays ?? 26}
              onChange={(e) => handleFieldChange('wdays', parseFloat(e.target.value) || 26)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Holidays / Mo
            </label>
            <input
              type="number"
              min="0"
              max="15"
              value={state.hdays ?? 0}
              onChange={(e) => handleFieldChange('hdays', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Shifts / Day
            </label>
            <select
              value={state.shifts ?? 1}
              onChange={(e) => handleFieldChange('shifts', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              <option value="1">1 Shift (8-10 Hours)</option>
              <option value="2">2 Shifts (16 Hours)</option>
              <option value="3">3 Shifts (24 Hours Round Clock)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Blasting Output / Shift (m²)
            </label>
            <input
              type="number"
              min="1"
              value={state.blastOutput ?? 50}
              onChange={(e) => handleFieldChange('blastOutput', parseFloat(e.target.value) || 50)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Painting Output / Shift (m²)
            </label>
            <input
              type="number"
              min="1"
              value={state.paintOutput ?? 30}
              onChange={(e) => handleFieldChange('paintOutput', parseFloat(e.target.value) || 30)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Calculated KPI Output Cards */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Schedule Take-off &amp; Setup Sizing
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <div className="text-[10px] uppercase font-bold text-slate-500">Required Days</div>
              <div className="text-sm sm:text-base font-mono font-black text-amber-500 mt-0.5">
                {formatNum(reqBlastDays, 1)} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <div className="text-[10px] uppercase font-bold text-slate-500">Blasting Setups Needed</div>
              <div className="text-sm sm:text-base font-mono font-black text-blue-500 mt-0.5">
                {blastingSetups} <span className="text-xs font-normal text-slate-400">setups</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <div className="text-[10px] uppercase font-bold text-slate-500">Daily Output Target</div>
              <div className="text-sm sm:text-base font-mono font-black text-emerald-500 mt-0.5">
                {formatNum(dailyTarget, 1)} <span className="text-xs font-normal text-slate-400">m²/day</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <div className="text-[10px] uppercase font-bold text-slate-500">Total Project Days</div>
              <div className="text-sm sm:text-base font-mono font-black text-purple-500 mt-0.5">
                {formatNum(totalDays, 0)} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Next Sheet Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Step 1 of 7 Completed · Parameters ready for Blasting Cost Engine
        </div>
        <button
          onClick={() => onNavigate('blasting')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>Next: Blasting Cost Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
