import React from 'react';
import { PROC_SAFETY_CATS } from '../../data/procedureDatabase';

export default function ProcSafety({ state, onChange, onNext, onPrev, onReset }) {
  const handleCatChange = (catIdx, field, val) => {
    const updated = [...(state.safetyCategories || [])];
    updated[catIdx] = { ...updated[catIdx], [field]: val };
    onChange({ safetyCategories: updated });
  };

  const handleItemChange = (catIdx, itemIdx, val) => {
    const updated = [...(state.safetyCategories || [])];
    const items = [...updated[catIdx].items];
    items[itemIdx] = val;
    updated[catIdx] = { ...updated[catIdx], items };
    onChange({ safetyCategories: updated });
  };

  const addItem = (catIdx) => {
    const updated = [...(state.safetyCategories || [])];
    const items = [...updated[catIdx].items, ''];
    updated[catIdx] = { ...updated[catIdx], items };
    onChange({ safetyCategories: updated });
  };

  const deleteItem = (catIdx, itemIdx) => {
    const updated = [...(state.safetyCategories || [])];
    const items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
    updated[catIdx] = { ...updated[catIdx], items };
    onChange({ safetyCategories: updated });
  };

  const restoreDefaults = () => {
    onChange({ safetyCategories: [...PROC_SAFETY_CATS] });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 06</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Safety Requirements & HSE Protocols</h2>
          <p className="text-xs text-gray-500">Hazard mitigation, PPE matrix, static grounding, forced ventilation and confined space protocols.</p>
        </div>
        <button
          type="button"
          onClick={restoreDefaults}
          className="text-xs text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold transition"
        >
          Reset to Standard HSE Library
        </button>
      </div>

      {/* Safety Categories */}
      <div className="space-y-4">
        {(state.safetyCategories || []).map((cat, catIdx) => (
          <div key={catIdx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <input
                type="text"
                value={cat.title || ''}
                onChange={(e) => handleCatChange(catIdx, 'title', e.target.value)}
                className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-transparent focus:border-red-600 focus:outline-none w-2/3"
              />
              <span className="text-[10px] text-gray-400 font-mono">
                {cat.refs ? `Ref: ${cat.refs}` : ''}
              </span>
            </div>

            <div className="space-y-2">
              {(cat.items || []).map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 font-mono mt-1.5">•</span>
                  <textarea
                    rows="2"
                    value={item}
                    onChange={(e) => handleItemChange(catIdx, itemIdx, e.target.value)}
                    placeholder="Enter HSE clause / requirement..."
                    className="w-full text-xs p-2 border border-gray-200 rounded focus:border-red-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => deleteItem(catIdx, itemIdx)}
                    className="text-gray-400 hover:text-red-600 font-bold p-1 text-sm"
                    title="Delete item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addItem(catIdx)}
              className="text-[11px] text-red-700 hover:text-red-800 font-semibold pt-1 block"
            >
              + Add Safety Requirement Item
            </button>
          </div>
        ))}
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('exclusions')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Exclusions
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
            onClick={() => onNext('surface-prep')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Surface Preparation →
          </button>
        </div>
      </div>
    </div>
  );
}
