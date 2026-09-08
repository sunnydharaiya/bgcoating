import React from 'react';

export default function ProcScope({ state, onChange, onNext, onPrev, onReset }) {
  const updateField = (field, val) => {
    onChange({ [field]: val });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 02</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Scope of Work & Objectives</h2>
          <p className="text-xs text-gray-500">Definition of technical objectives, surface substrates, application boundaries, and equipment items.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            2.1 Technical Purpose & Objectives *
          </label>
          <textarea
            rows="3"
            placeholder="e.g. This procedure defines the mandatory technical requirements for surface preparation, coating application, quality inspection, and repair of protective paint systems on external carbon steel surfaces..."
            value={state.purpose || ''}
            onChange={(e) => updateField('purpose', e.target.value)}
            className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            2.2 Substrates & Equipment in Scope *
          </label>
          <textarea
            rows="2"
            placeholder="e.g. Carbon Steel Structural Beams, Columns, Process Piping Spools (2'' to 36''), Flanges, Valves, Vessels, Storage Tanks"
            value={state.scopeSubstrates || ''}
            onChange={(e) => updateField('scopeSubstrates', e.target.value)}
            className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              2.3 Execution Battery Limit (Shop vs Site)
            </label>
            <select
              value={state.shopSite || 'Shop & Field'}
              onChange={(e) => updateField('shopSite', e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none bg-white"
            >
              <option value="Shop Blast & Primer + Field Finish">Shop Blast & Primer + Field Finish</option>
              <option value="Complete Shop Application (100% Shop)">Complete Shop Application (100% Shop)</option>
              <option value="Complete Field / Site Application (100% Site)">Complete Field / Site Application (100% Site)</option>
              <option value="Shop & Field">Shop & Field Execution</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              2.4 Equipment / Item Tag Numbers (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. V-101, E-204A/B, TK-301, Piping Line Class A1A"
              value={state.scopeTags || ''}
              onChange={(e) => updateField('scopeTags', e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('cover-revision')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Cover Sheet
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
            onClick={() => onNext('reference-docs')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Reference Documents →
          </button>
        </div>
      </div>
    </div>
  );
}
