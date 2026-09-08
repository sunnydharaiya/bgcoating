import React from 'react';

export default function ProcWatermarkControl({ watermarkSettings, onChange, onReset }) {
  const updateField = (key, val) => {
    onChange({ ...watermarkSettings, [key]: val });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Pro Suite</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Watermark Suite Pro Configuration</h2>
          <p className="text-xs text-gray-500">Customize document security watermark text, opacity, angle, and live A4 preview layer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Watermark Parameters
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={watermarkSettings?.enabled ?? true}
                onChange={(e) => updateField('enabled', e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-gray-800">Enable Watermark</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Watermark Text</label>
            <input
              type="text"
              value={watermarkSettings?.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="e.g. BG COATING & CORROSION / CONFIDENTIAL"
              className="w-full text-xs p-2.5 border border-gray-300 rounded font-bold uppercase tracking-wider text-gray-800 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Watermark Opacity</span>
              <span className="font-mono">{Math.round((watermarkSettings?.opacity ?? 0.08) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.30"
              step="0.01"
              value={watermarkSettings?.opacity ?? 0.08}
              onChange={(e) => updateField('opacity', parseFloat(e.target.value))}
              className="w-full accent-red-700"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Rotation Angle</span>
              <span className="font-mono">{watermarkSettings?.rotation ?? -30}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={watermarkSettings?.rotation ?? -30}
              onChange={(e) => updateField('rotation', parseInt(e.target.value, 10))}
              className="w-full accent-red-700"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ text: 'CONFIDENTIAL', opacity: 0.08, rotation: -30, enabled: true })}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded"
            >
              Preset: Confidential
            </button>
            <button
              type="button"
              onClick={() => onChange({ text: 'DRAFT COPY', opacity: 0.10, rotation: -45, enabled: true })}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded"
            >
              Preset: Draft Copy
            </button>
            <button
              type="button"
              onClick={() => onChange({ text: 'FOR CLIENT REVIEW', opacity: 0.08, rotation: -30, enabled: true })}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded"
            >
              Preset: Client Review
            </button>
          </div>
        </div>

        {/* Live A4 Sheet Preview Canvas */}
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center shadow-inner">
          <div className="text-[10px] text-gray-400 font-mono uppercase mb-3">Live Watermark Sheet Preview</div>
          <div className="w-56 h-80 bg-white rounded shadow-2xl relative overflow-hidden flex items-center justify-center p-4 border border-gray-300">
            {watermarkSettings?.enabled !== false && (
              <div
                style={{
                  opacity: watermarkSettings?.opacity ?? 0.08,
                  transform: `rotate(${watermarkSettings?.rotation ?? -30}deg)`
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-center"
              >
                <span className="text-xl font-black text-gray-900 tracking-wider uppercase whitespace-nowrap">
                  {watermarkSettings?.text || 'BG COATING & CORROSION'}
                </span>
              </div>
            )}
            <div className="space-y-2 opacity-30 w-full pointer-events-none">
              <div className="h-3 bg-red-800 rounded w-1/3"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-4/5"></div>
              <div className="h-2 bg-gray-300 rounded w-2/3"></div>
              <div className="h-10 border border-gray-300 rounded mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
