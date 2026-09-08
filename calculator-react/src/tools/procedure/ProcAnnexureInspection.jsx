import React from 'react';
import { PROC_INSTRUMENTS_DEFAULT } from '../../data/procedureDatabase';

export default function ProcAnnexureInspection({ state, onChange, onNext, onPrev, onReset }) {
  const handleItemChange = (idx, key, val) => {
    const updated = [...(state.inspectionInstruments || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange({ inspectionInstruments: updated });
  };

  const addInstrument = () => {
    const updated = [
      ...(state.inspectionInstruments || []),
      { activity: '', instr: '', std: '', accept: '' }
    ];
    onChange({ inspectionInstruments: updated });
  };

  const deleteInstrument = (idx) => {
    const updated = (state.inspectionInstruments || []).filter((_, i) => i !== idx);
    onChange({ inspectionInstruments: updated });
  };

  const restoreDefaults = () => {
    onChange({ inspectionInstruments: [...PROC_INSTRUMENTS_DEFAULT] });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Annexure II</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Inspection Instruments & Quality Matrix</h2>
          <p className="text-xs text-gray-500">Master schedule of testing instruments, calibration standards, inspection parameters, and acceptance limits.</p>
        </div>
        <button
          type="button"
          onClick={restoreDefaults}
          className="text-xs text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold transition"
        >
          Reset to Standard Matrix
        </button>
      </div>

      {/* Instruments Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Inspection Instruments & Methods Table
          </h3>
          <button
            type="button"
            onClick={addInstrument}
            className="text-xs text-red-700 hover:text-red-800 font-semibold"
          >
            + Add Inspection Activity
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left w-12">#</th>
                <th className="py-2.5 px-3 text-left w-52">Activity / Inspection Parameter *</th>
                <th className="py-2.5 px-3 text-left w-64">Instrument / Equipment Model *</th>
                <th className="py-2.5 px-3 text-left w-44">Reference Standard</th>
                <th className="py-2.5 px-3 text-left">Acceptance Criteria</th>
                <th className="py-2.5 px-2 text-center w-10">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(state.inspectionInstruments || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.activity || ''}
                      onChange={(e) => handleItemChange(idx, 'activity', e.target.value)}
                      placeholder="e.g. Surface Temperature"
                      className="w-full border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.instr || ''}
                      onChange={(e) => handleItemChange(idx, 'instr', e.target.value)}
                      placeholder="e.g. Digital Dew Point Meter"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.std || ''}
                      onChange={(e) => handleItemChange(idx, 'std', e.target.value)}
                      placeholder="e.g. ISO 8502-4"
                      className="w-full border border-gray-300 rounded px-2 py-1 font-mono"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.accept || ''}
                      onChange={(e) => handleItemChange(idx, 'accept', e.target.value)}
                      placeholder="e.g. Steel Temp >= DP + 3°C"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteInstrument(idx)}
                      className="text-gray-400 hover:text-red-600 font-bold"
                      title="Delete activity"
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
          onClick={() => onPrev('annexure-coating')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Annexure-I Coating Systems
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
            onClick={() => onNext('preview')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Complete Procedure & Preview Document →
          </button>
        </div>
      </div>
    </div>
  );
}
