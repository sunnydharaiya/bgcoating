import React from 'react';
import { PROC_BLAST_QUALITIES, PROC_BLAST_CHECKPOINTS } from '../../data/procedureDatabase';

export default function ProcSurfacePrep({ state, onChange, onNext, onPrev, onReset }) {
  const updateField = (field, val) => {
    onChange({ [field]: val });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 07</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Surface Preparation & Inspection</h2>
          <p className="text-xs text-gray-500">SSPC-SP1 solvent degreasing, abrasive blast cleaning grades, profile roughness, salt extraction, and blotter tests.</p>
        </div>
      </div>

      {/* Surface Prep Parameters Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Core Blast Cleaning & Cleanliness Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Surface Prep Method *</label>
            <select
              value={state.surfacePrepMethod || 'Near-White Blast Cleaning'}
              onChange={(e) => updateField('surfacePrepMethod', e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-red-600 focus:outline-none bg-white"
            >
              {PROC_BLAST_QUALITIES.map((q, i) => (
                <option key={i} value={q.method}>{q.method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Cleanliness Standard *</label>
            <input
              type="text"
              placeholder="e.g. ISO 8501-1 Sa 2½ / SSPC-SP10"
              value={state.surfacePrepStd || ''}
              onChange={(e) => updateField('surfacePrepStd', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-bold text-red-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Abrasive Media Type</label>
            <input
              type="text"
              placeholder="e.g. Copper Slag / Garnet Grit (Mesh 20/40)"
              value={state.abrasiveType || ''}
              onChange={(e) => updateField('abrasiveType', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Anchor Profile Min (µm) *</label>
            <input
              type="number"
              placeholder="50"
              value={state.profileMin || ''}
              onChange={(e) => updateField('profileMin', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Anchor Profile Max (µm) *</label>
            <input
              type="number"
              placeholder="75"
              value={state.profileMax || ''}
              onChange={(e) => updateField('profileMax', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Max Soluble Salt (mg/m²) *</label>
            <input
              type="number"
              placeholder="20"
              value={state.saltLimit || ''}
              onChange={(e) => updateField('saltLimit', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Max Holding Time (Hours)</label>
            <input
              type="number"
              placeholder="4"
              value={state.holdingTimeHours || ''}
              onChange={(e) => updateField('holdingTimeHours', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Surface Preparation Quality Control Checkpoints Matrix */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Surface Preparation Quality Checkpoints (ITP Standard Table)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left w-12">#</th>
                <th className="py-2.5 px-3 text-left w-52">Inspection Parameter</th>
                <th className="py-2.5 px-3 text-left w-44">Test Method / Standard</th>
                <th className="py-2.5 px-3 text-left w-48">Inspection Frequency</th>
                <th className="py-2.5 px-3 text-left">Acceptance Criteria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {PROC_BLAST_CHECKPOINTS.map((cp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                  <td className="p-2 font-semibold text-gray-800">{cp.desc}</td>
                  <td className="p-2 font-mono text-gray-600">{cp.method}</td>
                  <td className="p-2 text-gray-600">{cp.freq}</td>
                  <td className="p-2 text-gray-700">{cp.accept}</td>
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
          onClick={() => onPrev('safety')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Safety
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
            onClick={() => onNext('coating-app')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Coating Application →
          </button>
        </div>
      </div>
    </div>
  );
}
