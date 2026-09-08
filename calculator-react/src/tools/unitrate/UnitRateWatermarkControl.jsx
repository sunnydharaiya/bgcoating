import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Check, RotateCcw } from 'lucide-react';

export default function UnitRateWatermarkControl({ 
  isOpen, 
  onClose, 
  watermark = {}, 
  onSaveWatermark 
}) {
  const [localWatermark, setLocalWatermark] = useState({
    enabled: watermark.enabled !== undefined ? watermark.enabled : true,
    text: watermark.text || 'CONFIDENTIAL COMMERCIAL QUOTATION',
    opacity: watermark.opacity !== undefined ? watermark.opacity : 0.08,
    rotation: watermark.rotation !== undefined ? watermark.rotation : -30
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setLocalWatermark(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveWatermark(localWatermark);
    onClose();
  };

  const handleReset = () => {
    setLocalWatermark({
      enabled: true,
      text: 'CONFIDENTIAL COMMERCIAL QUOTATION',
      opacity: 0.08,
      rotation: -30
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security Watermark Suite (Pro)</h3>
              <p className="text-xs text-slate-400">Apply tamper-proof background watermarks on commercial quotations.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Controls */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Toggle Enable */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
            <div>
              <span className="text-xs font-bold text-white block">Enable Document Watermark</span>
              <span className="text-[11px] text-slate-400">Render watermark on print and preview dossiers</span>
            </div>
            <input
              type="checkbox"
              checked={localWatermark.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Watermark Text */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Watermark Text Phrase</label>
            <input
              type="text"
              value={localWatermark.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="e.g. CONFIDENTIAL TENDER ESTIMATE"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Watermark Opacity</label>
              <span className="font-mono text-amber-400 font-bold">{Math.round(localWatermark.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.30"
              step="0.01"
              value={localWatermark.opacity}
              onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Rotation Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Rotation Angle</label>
              <span className="font-mono text-amber-400 font-bold">{localWatermark.rotation}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={localWatermark.rotation}
              onChange={(e) => handleChange('rotation', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Live Mini Sheet Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Live Preview Canvas</span>
            <div className="relative h-28 bg-white rounded border border-slate-300 flex items-center justify-center overflow-hidden">
              {localWatermark.enabled && (
                <span
                  className="font-extrabold text-lg text-slate-900 tracking-wider select-none uppercase pointer-events-none whitespace-nowrap"
                  style={{
                    opacity: localWatermark.opacity,
                    transform: `rotate(${localWatermark.rotation}deg)`
                  }}
                >
                  {localWatermark.text || 'WATERMARK PREVIEW'}
                </span>
              )}
              <div className="absolute inset-2 flex flex-col justify-between opacity-30 text-[8px] text-slate-700 pointer-events-none">
                <div className="border-b border-slate-300 pb-0.5 font-bold">COMMERCIAL QUOTATION SHEET</div>
                <div>Subtotal: 100,000.00 | Total: 125,000.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Watermark Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
