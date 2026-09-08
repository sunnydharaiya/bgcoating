import React from 'react';
import {
  Gauge,
  Flame,
  Fuel,
  Info,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  ABR_ROWS,
  ABR_COLS,
  ABR_RATES
} from '../../data/manpowerDatabase';

export default function ManpowerAbrasiveDiesel({ state, onChange, metrics, onNavigate }) {
  const {
    totalAbrKg,
    totalAbrTon,
    totalAbrCost,
    totalDieselL,
    totalDieselCost,
    area,
    formatCur,
    formatNum
  } = metrics;

  const abrType = state.abrGridType || 'copperslag';
  const abrValues = state.abrGridValues || {};

  const handleSetAbrType = (type) => {
    onChange('abrGridType', type);
  };

  const handleGridCellChange = (ri, ci, val) => {
    const key = `${ri}-${ci}`;
    onChange('abrGridValues', { ...abrValues, [key]: val });
  };

  const rates = ABR_RATES[abrType] || ABR_RATES.copperslag;
  const avgDieselPerM2 = area > 0 ? totalDieselL / area : 0;

  return (
    <div className="space-y-6">
      
      {/* Intro Header & Summary Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
              <span>Module 06 · Fuel &amp; Media Engineering</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Abrasive Media &amp; Diesel Fuel Dynamics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ISO 8501-1 blast cleanliness standard abrasive consumption rates based on initial mill scale and rust grade rust degradation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-gradient-to-br from-[#8D6E63] to-[#4E342E] text-white p-3 rounded-xl shadow-md min-w-[140px]">
              <div className="text-[10px] uppercase font-bold text-amber-200">Abrasive Cost</div>
              <div className="text-base font-mono font-black">{formatCur(totalAbrCost)}</div>
              <div className="text-[10px] font-mono text-amber-200 mt-0.5">{formatNum(totalAbrTon, 2)} MT</div>
            </div>

            <div className="bg-gradient-to-br from-[#546E7A] to-[#263238] text-white p-3 rounded-xl shadow-md min-w-[140px]">
              <div className="text-[10px] uppercase font-bold text-cyan-200">Diesel Fuel Cost</div>
              <div className="text-base font-mono font-black">{formatCur(totalDieselCost)}</div>
              <div className="text-[10px] font-mono text-cyan-200 mt-0.5">{formatNum(totalDieselL, 1)} Liters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Abrasive Consumption Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Abrasive Consumption Matrix (kg / m²)
            </h3>
          </div>

          {/* Garnet vs Copper Slag Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => handleSetAbrType('copperslag')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                abrType === 'copperslag'
                  ? 'bg-[#E8700A] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Copper Slag (Grit)
            </button>
            <button
              onClick={() => handleSetAbrType('garnet')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                abrType === 'garnet'
                  ? 'bg-[#E8700A] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Almandine Garnet
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold">
                <th className="py-2.5 px-3">Surface Condition / Initial Scale</th>
                {ABR_COLS.map((col, idx) => (
                  <th key={idx} className="py-2.5 px-3 text-center">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ABR_ROWS.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    {row}
                  </td>
                  {ABR_COLS.map((_, ci) => {
                    const norm = rates[ri][ci];
                    const key = `${ri}-${ci}`;
                    if (norm === null) {
                      return (
                        <td key={ci} className="py-2.5 px-3 text-center text-slate-400 font-mono text-[10px]">
                          N/A
                        </td>
                      );
                    }
                    return (
                      <td key={ci} className="py-2.5 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={abrValues[key] ?? ''}
                            onChange={(e) => handleGridCellChange(ri, ci, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold text-xs"
                          />
                          <span className="text-[9px] text-slate-500 font-mono">
                            Norm: {norm} kg/m²
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diesel Fuel Dynamics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Fuel className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Diesel Fuel Consumption Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase">Blasting Compressor Fuel</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {formatNum(state.bDieselL * area, 1)} <span className="text-xs text-slate-400 font-normal">Liters</span>
            </div>
            <div className="text-xs font-mono text-[#E8700A]">
              {formatCur((state.bDieselL * area) * (state.bDieselRate || 84))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase">Paint Application Fuel</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {formatNum((state.pDieselL || 0) * area * (state.pCoats || 1), 1)} <span className="text-xs text-slate-400 font-normal">Liters</span>
            </div>
            <div className="text-xs font-mono text-[#E8700A]">
              {formatCur(((state.pDieselL || 0) * area * (state.pCoats || 1)) * (state.pDieselRate || 84))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase">Average Diesel Rate / m²</span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {formatNum(avgDieselPerM2, 2)} <span className="text-xs text-slate-400 font-normal">L / m²</span>
            </div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              Total Liters: {formatNum(totalDieselL, 1)} L
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Step 6 of 7 Completed · Ready for Front Page Consolidated Summary
        </div>
        <button
          onClick={() => onNavigate('summary')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>Next: Front Page Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
