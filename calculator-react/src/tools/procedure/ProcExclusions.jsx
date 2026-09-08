import React from 'react';
import { PROC_EXCLUSIONS_LIB } from '../../data/procedureDatabase';

export default function ProcExclusions({ state, onChange, onNext, onPrev, onReset }) {
  const handleItemChange = (idx, key, val) => {
    const updated = [...(state.exclusions || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange({ exclusions: updated });
  };

  const addRow = () => {
    const updated = [
      ...(state.exclusions || []),
      { item: '', desc: 'Shall be properly masked and protected from blasting & paint overspray' }
    ];
    onChange({ exclusions: updated });
  };

  const deleteRow = (idx) => {
    const updated = (state.exclusions || []).filter((_, i) => i !== idx);
    onChange({ exclusions: updated });
  };

  const restoreDefaults = () => {
    onChange({ exclusions: [...PROC_EXCLUSIONS_LIB] });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 05</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Blasting & Coating Exclusions</h2>
          <p className="text-xs text-gray-500">List of non-ferrous materials, machined surfaces, flange faces, nameplates, and sensitive components excluded from coating.</p>
        </div>
        <button
          type="button"
          onClick={restoreDefaults}
          className="text-xs text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold transition"
        >
          Reset to Standard Library
        </button>
      </div>

      {/* Exclusions Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Exclusion Matrix & Protection Measures
          </h3>
          <button
            type="button"
            onClick={addRow}
            className="text-xs text-red-700 hover:text-red-800 font-semibold flex items-center gap-1"
          >
            + Add Exclusion Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left w-12">#</th>
                <th className="py-2.5 px-3 text-left w-72">Material / Component Excluded *</th>
                <th className="py-2.5 px-3 text-left">Protection / Masking Requirement *</th>
                <th className="py-2.5 px-2 text-center w-12">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(state.exclusions || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.item || ''}
                      onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                      placeholder="e.g. Gasket seating faces"
                      className="w-full border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.desc || ''}
                      onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                      placeholder="e.g. Masked with heavy-duty blind flange or tape"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(idx)}
                      className="text-gray-400 hover:text-red-600 font-bold"
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
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
          onClick={() => onPrev('standards')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Standards
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
            onClick={() => onNext('safety')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Safety & HSE →
          </button>
        </div>
      </div>
    </div>
  );
}
