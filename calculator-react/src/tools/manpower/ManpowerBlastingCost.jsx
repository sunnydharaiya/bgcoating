import React from 'react';
import {
  Flame,
  Users,
  Wrench,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { ABRASIVE_MEDIA_OPTIONS } from '../../data/manpowerDatabase';

export default function ManpowerBlastingCost({ state, onChange, metrics, onNavigate }) {
  const {
    blastTotal,
    blastPM2,
    bA_items, bA_total, bA_tot,
    bB_items, bB_total, bB_tot,
    bC_items, bC_total, bC_tot,
    bD_items, bD_total, bD_tot,
    area,
    formatCur,
    formatNum
  } = metrics;

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header & Section Cost Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
              <span>Module 02 · Surface Prep Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Blasting Cost Engine (A / B / C / D Sizing)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete calculation of abrasive media, diesel fuel, crew manpower salaries, equipment depreciation/hire, and subcontractor margins.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#B83400] to-[#E8700A] text-white p-3.5 rounded-xl shadow-md min-w-[200px] shrink-0">
            <div className="text-[10px] uppercase font-bold text-orange-200">Blasting Subtotal</div>
            <div className="text-xl font-mono font-black">{formatCur(blastTotal)}</div>
            <div className="text-[11px] font-mono text-orange-100 mt-0.5">
              {formatCur(blastPM2)} / m²
            </div>
          </div>
        </div>

        {/* 4 Category Summary Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
            <span className="text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase">Cat A: Consumables</span>
            <div className="text-sm font-mono font-black text-orange-600 dark:text-orange-400">{formatCur(bA_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur(bA_total)} / m²</div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
            <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">Cat B: Labor Crew</span>
            <div className="text-sm font-mono font-black text-blue-600 dark:text-blue-400">{formatCur(bB_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur(bB_total)} / m²</div>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
            <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase">Cat C: Equipment</span>
            <div className="text-sm font-mono font-black text-purple-600 dark:text-purple-400">{formatCur(bC_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur(bC_total)} / m²</div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Cat D: Margin / OH</span>
            <div className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{formatCur(bD_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur(bD_total)} / m²</div>
          </div>
        </div>
      </div>

      {/* 1. Blasting Variables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Flame className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            1. Blasting Variables (Media, Fuel &amp; Consumables)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Abrasive Media
            </label>
            <select
              value={state.bMedia || 'copperslag'}
              onChange={(e) => handleFieldChange('bMedia', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              {ABRASIVE_MEDIA_OPTIONS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Abrasive Rate (kg / m²)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bAbrKg ?? 15}
              onChange={(e) => handleFieldChange('bAbrKg', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Abrasive Cost (Per kg)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bAbrRate ?? 3.5}
              onChange={(e) => handleFieldChange('bAbrRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Diesel Consumption (L / m²)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bDieselL ?? 0.8}
              onChange={(e) => handleFieldChange('bDieselL', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Diesel Rate (Per L)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bDieselRate ?? 84}
              onChange={(e) => handleFieldChange('bDieselRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              PPE / Workmen / Month
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bPPE ?? 500}
              onChange={(e) => handleFieldChange('bPPE', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Insurance &amp; Medical / Mo
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bIns ?? 800}
              onChange={(e) => handleFieldChange('bIns', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Consumables / Month
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.bCons ?? 4000}
              onChange={(e) => handleFieldChange('bCons', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Manpower Crew Setup & Salaries */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              2. Blasting Crew Manpower &amp; Rates (Per Setup)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Idling %:</span>
            <input
              type="number"
              min="0"
              max="50"
              value={state.bIdle ?? 15}
              onChange={(e) => handleFieldChange('bIdle', parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white text-center"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-2.5 px-3">Role / Designation</th>
                <th className="py-2.5 px-3 text-right">Monthly Rate / Salary</th>
                <th className="py-2.5 px-3 text-center">Nos / Setup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Supervisor</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.bSupRate ?? 40000}
                    onChange={(e) => handleFieldChange('bSupRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.bSupNo ?? 1}
                    onChange={(e) => handleFieldChange('bSupNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Blaster</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.bBlRate ?? 33000}
                    onChange={(e) => handleFieldChange('bBlRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.bBlNo ?? 1}
                    onChange={(e) => handleFieldChange('bBlNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Helper</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.bHpRate ?? 25000}
                    onChange={(e) => handleFieldChange('bHpRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.bHpNo ?? 3}
                    onChange={(e) => handleFieldChange('bHpNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Site Incharge</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.bSiRate ?? 60000}
                    onChange={(e) => handleFieldChange('bSiRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.bSiNo ?? 1}
                    onChange={(e) => handleFieldChange('bSiNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">NACE Inspector</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.bNcRate ?? 80000}
                    onChange={(e) => handleFieldChange('bNcRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.bNcNo ?? 0}
                    onChange={(e) => handleFieldChange('bNcNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Equipment & Overheads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Equipment */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Wrench className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              3. Equipment Charges (Monthly / Setup)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Compressor Hire</label>
              <input
                type="number"
                value={state.bComp ?? 50000}
                onChange={(e) => handleFieldChange('bComp', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Hopper, Hoses, Nozzles</label>
              <input
                type="number"
                value={state.bHop ?? 10000}
                onChange={(e) => handleFieldChange('bHop', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">After Cooler Assembly</label>
              <input
                type="number"
                value={state.bAc ?? 5000}
                onChange={(e) => handleFieldChange('bAc', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Blasting Hood Assembly</label>
              <input
                type="number"
                value={state.bHood ?? 10000}
                onChange={(e) => handleFieldChange('bHood', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Inspection Instruments</label>
              <input
                type="number"
                value={state.bInst ?? 15000}
                onChange={(e) => handleFieldChange('bInst', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Airless Pump &amp; Accessories</label>
              <input
                type="number"
                value={state.bPump ?? 15000}
                onChange={(e) => handleFieldChange('bPump', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Profit & Overheads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Coins className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              4. One-Time Charges &amp; Subcontractor Margin
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Office / Store Cost</label>
              <input
                type="number"
                value={state.bOffice ?? 50000}
                onChange={(e) => handleFieldChange('bOffice', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Admin / Local Issue</label>
              <input
                type="number"
                value={state.bAdmin ?? 25000}
                onChange={(e) => handleFieldChange('bAdmin', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Mob - Demob</label>
              <input
                type="number"
                value={state.bMob ?? 40000}
                onChange={(e) => handleFieldChange('bMob', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">Sub-Contractor Overhead %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={state.bOH ?? 2}
                onChange={(e) => handleFieldChange('bOH', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-slate-600 dark:text-slate-400">Sub-Contractor Profit %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={state.bProfit ?? 15}
                onChange={(e) => handleFieldChange('bProfit', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-[#E8700A]"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Cost Summary Category Tables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            5. Blasting Cost Breakdown Summary (Categories A · B · C · D)
          </h3>
          <span className="text-xs font-mono font-bold text-[#E8700A]">
            Total Area: {formatNum(area, 0)} m²
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Category A */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-600 dark:text-orange-400 flex justify-between">
              <span>Category A: Consumables</span>
              <span>Subtotal: {formatCur(bA_tot)}</span>
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bA_items.map((it, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">{it.n}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCur(it.pm)} / m²</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCur(it.pm * area)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category B */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 flex justify-between">
              <span>Category B: Labor</span>
              <span>Subtotal: {formatCur(bB_tot)}</span>
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bB_items.map((it, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">{it.n}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCur(it.pm)} / m²</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCur(it.pm * area)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category C */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 flex justify-between">
              <span>Category C: Equipment</span>
              <span>Subtotal: {formatCur(bC_tot)}</span>
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bC_items.map((it, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">{it.n}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCur(it.pm)} / m²</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCur(it.pm * area)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category D */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex justify-between">
              <span>Category D: Profit &amp; Overheads</span>
              <span>Subtotal: {formatCur(bD_tot)}</span>
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bD_items.map((it, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">{it.n}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCur(it.pm)} / m²</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCur(it.pm * area)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Navigation Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Step 2 of 7 Completed · Total Blasting: <span className="font-mono font-bold text-[#F5911F]">{formatCur(blastTotal)}</span>
        </div>
        <button
          onClick={() => onNavigate('painting')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>Next: Paint Application Cost</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
