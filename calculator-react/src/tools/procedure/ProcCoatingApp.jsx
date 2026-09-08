import React from 'react';
import { PROC_PAINT_CHECKPOINTS } from '../../data/procedureDatabase';

export default function ProcCoatingApp({ state, onChange, onNext, onPrev, onReset }) {
  const updateField = (field, val) => {
    onChange({ [field]: val });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 08</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Coating Application & Curing Regime</h2>
          <p className="text-xs text-gray-500">Environmental climatic envelopes, power mixing, stripe coating, airless spray technique, and WFT/DFT quality control.</p>
        </div>
      </div>

      {/* Environmental Climatic Envelope */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Environmental Application Envelope
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Min Ambient Temp (°C) *</label>
            <input
              type="number"
              placeholder="10"
              value={state.tempMin || ''}
              onChange={(e) => updateField('tempMin', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Max Ambient Temp (°C) *</label>
            <input
              type="number"
              placeholder="45"
              value={state.tempMax || ''}
              onChange={(e) => updateField('tempMax', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Max Relative Humidity (%) *</label>
            <input
              type="number"
              placeholder="85"
              value={state.rhMax || ''}
              onChange={(e) => updateField('rhMax', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Min Dew Point Margin (°C) *</label>
            <input
              type="number"
              step="0.5"
              placeholder="3.0"
              value={state.dewPointDelta || ''}
              onChange={(e) => updateField('dewPointDelta', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-mono font-bold text-red-700"
            />
          </div>
        </div>
      </div>

      {/* Application Methodology */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Application Methodology & Quality Protocols
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Application Method</label>
            <select
              value={state.appMethodPrimary || 'Airless Spray'}
              onChange={(e) => updateField('appMethodPrimary', e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-red-600 focus:outline-none bg-white"
            >
              <option value="Airless Spray">Airless Spray (Tip 0.017" - 0.021", 2000-3000 PSI)</option>
              <option value="Conventional Air Spray">Conventional Air Spray</option>
              <option value="Brush & Roller (Touch-up only)">Brush & Roller (Touch-up only)</option>
              <option value="Plural Component Spray">Plural Component Spray (Hot Airless)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">DFT Conformance Standard</label>
            <input
              type="text"
              placeholder="e.g. SSPC-PA2 Level 3 / ISO 19840 80/20 Rule"
              value={state.dftStandard || ''}
              onChange={(e) => updateField('dftStandard', e.target.value)}
              className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none font-semibold text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Stripe Coating Protocol</label>
          <input
            type="text"
            placeholder="e.g. Brush application on 100% weld seams, edges, corners, bolt assemblies before each full coat"
            value={state.stripeCoatMethod || ''}
            onChange={(e) => updateField('stripeCoatMethod', e.target.value)}
            className="w-full text-xs p-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Painting Quality Checkpoints Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Painting Quality Inspection & Test Matrix (ITP)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left w-12">#</th>
                <th className="py-2.5 px-3 text-left w-48">Inspection Parameter</th>
                <th className="py-2.5 px-3 text-left w-40">Test Standard</th>
                <th className="py-2.5 px-3 text-left w-44">Frequency</th>
                <th className="py-2.5 px-3 text-left">Acceptance Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {PROC_PAINT_CHECKPOINTS.map((cp, idx) => (
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
          onClick={() => onPrev('surface-prep')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Surface Prep
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
            onClick={() => onNext('repair-plan')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Repair Plan →
          </button>
        </div>
      </div>
    </div>
  );
}
