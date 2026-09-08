import React from 'react';
import {
  Paintbrush,
  Users,
  Wrench,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ManpowerPaintingCost({ state, onChange, metrics, onNavigate }) {
  const {
    paintTotal,
    paintPM2,
    pA_items, pA_total, pA_tot,
    pB_items, pB_total, pB_tot,
    pC_items, pC_total,
    pD_items, pD_total, pD_tot,
    area,
    coats,
    formatCur,
    formatNum
  } = metrics;

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  const totalCoatingArea = area * coats;

  return (
    <div className="space-y-6">
      
      {/* Intro Header & Section Cost Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
              <span>Module 03 · Application Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Paint Application Cost Engine ({coats} Coat Multi-Pass)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Spray painter labor, brush touch-up helpers, airless pump depreciation, full PPE respirator masks, and multi-pass setup dynamics.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#E8700A] to-[#F5911F] text-white p-3.5 rounded-xl shadow-md min-w-[200px] shrink-0">
            <div className="text-[10px] uppercase font-bold text-orange-950">Application Subtotal</div>
            <div className="text-xl font-mono font-black">{formatCur(paintTotal)}</div>
            <div className="text-[11px] font-mono text-orange-950/80 font-bold mt-0.5">
              {formatCur(paintPM2)} / m² ({coats} Coats)
            </div>
          </div>
        </div>

        {/* 3 Grouped Category Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
            <span className="text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase">Painting Variables (A + C)</span>
            <div className="text-sm font-mono font-black text-orange-600 dark:text-orange-400">{formatCur(pA_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur((pA_total + pC_total) * coats)} / m²</div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
            <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">Painting Manpower (B)</span>
            <div className="text-sm font-mono font-black text-blue-600 dark:text-blue-400">{formatCur(pB_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur(pB_total * coats)} / m²</div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Profit &amp; Overheads (D)</span>
            <div className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{formatCur(pD_tot)}</div>
            <div className="text-[10px] text-slate-500 font-mono">{formatCur(pD_total * coats)} / m²</div>
          </div>
        </div>
      </div>

      {/* 1. Painting Variables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              1. Application Parameters &amp; Consumables
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Number of Coats:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={state.pCoats ?? 2}
              onChange={(e) => handleFieldChange('pCoats', parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 rounded border-2 border-[#E8700A] bg-white dark:bg-slate-800 text-center font-mono font-black text-xs text-[#E8700A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              PPE / Workmen / Month
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.pPPE ?? 500}
              onChange={(e) => handleFieldChange('pPPE', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
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
              value={state.pIns ?? 800}
              onChange={(e) => handleFieldChange('pIns', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Painter Mask &amp; Respirator
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.pMask ?? 10000}
              onChange={(e) => handleFieldChange('pMask', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
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
              value={state.pCons ?? 4000}
              onChange={(e) => handleFieldChange('pCons', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
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
              value={state.pDieselL ?? 0}
              onChange={(e) => handleFieldChange('pDieselL', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
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
              value={state.pDieselRate ?? 84}
              onChange={(e) => handleFieldChange('pDieselRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Inspection Instruments / Setup
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.pInst ?? 15000}
              onChange={(e) => handleFieldChange('pInst', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Airless Pump &amp; Accessories
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={state.pPump ?? 15000}
              onChange={(e) => handleFieldChange('pPump', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Painting Manpower Crew Setup */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              2. Painting Crew Manpower &amp; Rates (Per Setup)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Idling %:</span>
            <input
              type="number"
              min="0"
              max="50"
              value={state.pIdle ?? 15}
              onChange={(e) => handleFieldChange('pIdle', parseFloat(e.target.value) || 0)}
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
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Painting Supervisor</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.pSupRate ?? 40000}
                    onChange={(e) => handleFieldChange('pSupRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.pSupNo ?? 2}
                    onChange={(e) => handleFieldChange('pSupNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Airless Spray Painter</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.pSpRate ?? 33000}
                    onChange={(e) => handleFieldChange('pSpRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.pSpNo ?? 0}
                    onChange={(e) => handleFieldChange('pSpNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Helper / Brush Painter</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.pHpRate ?? 25000}
                    onChange={(e) => handleFieldChange('pHpRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.pHpNo ?? 13}
                    onChange={(e) => handleFieldChange('pHpNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Site Incharge</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.pSiRate ?? 60000}
                    onChange={(e) => handleFieldChange('pSiRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.pSiNo ?? 0}
                    onChange={(e) => handleFieldChange('pSiNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">NACE Inspector</td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    value={state.pNcRate ?? 80000}
                    onChange={(e) => handleFieldChange('pNcRate', parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="0"
                    value={state.pNcNo ?? 0}
                    onChange={(e) => handleFieldChange('pNcNo', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Profit & Overheads */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Coins className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            3. Profit &amp; Overheads
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">Office / Store Cost</label>
            <input
              type="number"
              value={state.pOffice ?? 0}
              onChange={(e) => handleFieldChange('pOffice', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">Admin / Local</label>
            <input
              type="number"
              value={state.pAdmin ?? 0}
              onChange={(e) => handleFieldChange('pAdmin', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">Mob - Demob</label>
            <input
              type="number"
              value={state.pMob ?? 0}
              onChange={(e) => handleFieldChange('pMob', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">Subcontractor Overhead %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={state.pOH ?? 0}
              onChange={(e) => handleFieldChange('pOH', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">Subcontractor Profit %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={state.pProfit ?? 10}
              onChange={(e) => handleFieldChange('pProfit', parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-[#E8700A]"
            />
          </div>
        </div>
      </div>

      {/* 4. Cost Breakdown Tables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            4. Paint Application Cost Summary ({coats} Coats · {formatNum(totalCoatingArea, 0)} m² Total Pass)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category A & C */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-600 dark:text-orange-400 flex justify-between">
              <span>Category A: Consumables &amp; Safety</span>
              <span>Subtotal: {formatCur(pA_total * totalCoatingArea)}</span>
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pA_items.map((it, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">{it.n}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCur(it.pm * coats)} / m²</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCur(it.pm * totalCoatingArea)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category B */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 flex justify-between">
              <span>Category B: Application Labor</span>
              <span>Subtotal: {formatCur(pB_tot)}</span>
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pB_items.map((it, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">{it.n}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCur(it.pm * coats)} / m²</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCur(it.pm * totalCoatingArea)}</td>
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
          Step 3 of 7 Completed · Total Application: <span className="font-mono font-bold text-[#F5911F]">{formatCur(paintTotal)}</span>
        </div>
        <button
          onClick={() => onNavigate('raw-material')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>Next: Paint Raw Material Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
