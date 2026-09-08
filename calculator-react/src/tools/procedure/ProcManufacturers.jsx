import React from 'react';
import { PROC_MANUFACTURERS, PROC_PAINT_PRODUCTS_MATRIX, PROC_PAINT_GENERICS } from '../../data/procedureDatabase';

export default function ProcManufacturers({ state, onChange, onNext, onPrev, onReset }) {
  const selectedMfrs = new Set(state.selectedManufacturers || []);

  const toggleMfr = (mfr) => {
    const updated = new Set(selectedMfrs);
    if (updated.has(mfr)) {
      if (updated.size > 1) updated.delete(mfr);
    } else {
      updated.add(mfr);
    }
    onChange({ selectedManufacturers: Array.from(updated) });
  };

  const selectAll = () => {
    onChange({ selectedManufacturers: [...PROC_MANUFACTURERS] });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 10</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Approved Paint Manufacturers & Products</h2>
          <p className="text-xs text-gray-500">Approved vendor list and cross-brand generic paint equivalent matrix.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            {selectedMfrs.size} Brands Selected
          </span>
        </div>
      </div>

      {/* Manufacturer Selector Pills */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Select Approved Paint Manufacturers
          </h3>
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-red-700 hover:text-red-800 font-semibold"
          >
            Select All
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROC_MANUFACTURERS.map((mfr, i) => {
            const isSelected = selectedMfrs.has(mfr);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleMfr(mfr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span>{mfr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paint Products Matrix Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Generic Paint Cross-Reference Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left w-52 sticky left-0 bg-[#1E2530] z-10">Generic Paint Type</th>
                {Array.from(selectedMfrs).map((mfr, idx) => (
                  <th key={idx} className="py-2.5 px-3 text-left min-w-44 whitespace-nowrap">
                    {mfr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {PROC_PAINT_GENERICS.map((gen, gIdx) => (
                <tr key={gIdx} className="hover:bg-gray-50">
                  <td className="p-2 font-bold text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                    {gen}
                  </td>
                  {Array.from(selectedMfrs).map((mfr, mIdx) => {
                    const prod = PROC_PAINT_PRODUCTS_MATRIX[gen]?.[mfr] || 'Equivalent as approved by Engineer';
                    return (
                      <td key={mIdx} className="p-2 text-gray-700 font-mono text-[11px]">
                        {prod}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('repair-plan')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Repair Plan
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={() => onNext('attachments')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Attachments →
          </button>
        </div>
      </div>
    </div>
  );
}
