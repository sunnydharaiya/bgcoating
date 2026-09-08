import React from 'react';
import { PROC_REPAIR_PARAS } from '../../data/procedureDatabase';

export default function ProcRepairPlan({ state, onChange, onNext, onPrev, onReset }) {
  const updateField = (field, val) => {
    onChange({ [field]: val });
  };

  const handleParaChange = (idx, val) => {
    const updated = [...(state.repairParas || [])];
    updated[idx] = val;
    onChange({ repairParas: updated });
  };

  const addPara = () => {
    const updated = [...(state.repairParas || []), ''];
    onChange({ repairParas: updated });
  };

  const deletePara = (idx) => {
    const updated = (state.repairParas || []).filter((_, i) => i !== idx);
    onChange({ repairParas: updated });
  };

  const restoreDefaults = () => {
    onChange({ repairParas: [...PROC_REPAIR_PARAS] });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 09</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Coating Repair Plan & Defect Rectification</h2>
          <p className="text-xs text-gray-500">Method statement for coating defect repair, edge feathering, spot abrasive blasting, and adhesion testing.</p>
        </div>
        <button
          type="button"
          onClick={restoreDefaults}
          className="text-xs text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold transition"
        >
          Reset to Standard Clauses
        </button>
      </div>

      {/* Repair Technical Parameters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Key Repair Criteria
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Sound Coating Feathering Width *</label>
            <input
              type="text"
              placeholder="e.g. 50 mm minimum smooth tapered overlap"
              value={state.featheringWidth || ''}
              onChange={(e) => updateField('featheringWidth', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Repair Adhesion Acceptance (Pull-off)</label>
            <input
              type="text"
              placeholder="e.g. ASTM D4541 min 5.0 MPa (Epoxy system) on coupon"
              value={state.repairAdhesionReq || ''}
              onChange={(e) => updateField('repairAdhesionReq', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-semibold text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Repair Procedural Clauses */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Repair Method Statement Clauses
          </h3>
          <button
            type="button"
            onClick={addPara}
            className="text-xs text-red-700 hover:text-red-800 font-semibold"
          >
            + Add Repair Clause
          </button>
        </div>

        <div className="space-y-3">
          {(state.repairParas || []).map((para, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs font-mono font-bold text-gray-400 mt-2">{idx + 1}.</span>
              <textarea
                rows="2"
                value={para}
                onChange={(e) => handleParaChange(idx, e.target.value)}
                placeholder="Enter repair clause..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => deletePara(idx)}
                className="text-gray-400 hover:text-red-600 font-bold p-1 text-base mt-1"
                title="Delete clause"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('coating-app')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Coating Application
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
            onClick={() => onNext('manufacturers')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Approved Manufacturers →
          </button>
        </div>
      </div>
    </div>
  );
}
