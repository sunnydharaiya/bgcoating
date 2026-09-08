// src/tools/inspection/InspectionWatermarkControl.jsx
import React from 'react';
import { 
  Stamp, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Sliders
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DEFAULT_WATERMARK = {
  enabled: false,
  text: 'CONFIDENTIAL QA/QC DOSSIER',
  opacity: 8, // percentage 3 - 30
  angle: -30  // degrees -60 to 0
};

export default function InspectionWatermarkControl({
  watermarkSettings = DEFAULT_WATERMARK,
  onUpdateWatermark
}) {
  const { addToast } = useToast();
  const wm = watermarkSettings || DEFAULT_WATERMARK;

  const update = (patch) => {
    onUpdateWatermark({ ...wm, ...patch });
  };

  const handleApplyPreset = (presetText) => {
    update({ text: presetText, enabled: true });
    addToast('Watermark Preset Applied', `Set watermark text to "${presetText}".`, 'success');
  };

  const handleReset = () => {
    onUpdateWatermark(DEFAULT_WATERMARK);
    addToast('Watermark Reset', 'Reverted to default watermark configuration.', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono font-bold uppercase">
              Security PRO
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Live Diagonal Watermark Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Render dynamic security diagonal watermarks across all printed and exported inspection dossiers.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
          
          {/* Master Enable Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Watermark Overlay Status</span>
              <span className="text-[11px] text-slate-500">
                {wm.enabled ? 'Watermark is active on reports' : 'Watermark is disabled (Clean output)'}
              </span>
            </div>

            <button
              onClick={() => update({ enabled: !wm.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                wm.enabled ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  wm.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Watermark Text Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Custom Watermark Text
            </label>
            <input
              type="text"
              value={wm.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="e.g. CONFIDENTIAL QA/QC DOSSIER"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 font-mono font-bold uppercase bg-slate-50/50"
            />
          </div>

          {/* Presets */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
              Quick 1-Click Text Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'CONFIDENTIAL',
                'DRAFT COPY',
                'CLIENT QC REVIEW',
                'APPROVED FOR COATING',
                'FINAL TPI INSPECTION',
                'BG GROUP OFFICIAL'
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-[10.5px] font-mono font-semibold transition cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Watermark Opacity</span>
              <span className="font-mono text-amber-600">{wm.opacity}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              value={wm.opacity}
              onChange={(e) => update({ opacity: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>Subtle (3%)</span>
              <span>Prominent (30%)</span>
            </div>
          </div>

          {/* Angle Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Diagonal Rotation Angle</span>
              <span className="font-mono text-amber-600">{wm.angle}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="0"
              value={wm.angle}
              onChange={(e) => update({ angle: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>-60°</span>
              <span>-30° (Standard)</span>
              <span>0° (Horizontal)</span>
            </div>
          </div>

        </div>

        {/* Live A4 Preview Canvas */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              Live Interactive A4 Sheet Canvas Preview
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {wm.enabled ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>

          {/* Canvas Sheet */}
          <div className="relative my-4 aspect-1/1.4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-6 overflow-hidden flex flex-col justify-between shadow-inner">
            
            {/* Watermark Diagonal Overlay */}
            {wm.enabled && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-20"
                style={{ opacity: (wm.opacity || 8) / 100 }}
              >
                <div 
                  className="text-slate-900 font-black text-2xl sm:text-3xl uppercase tracking-widest text-center whitespace-nowrap"
                  style={{ transform: `rotate(${wm.angle || -30}deg)` }}
                >
                  {wm.text || 'CONFIDENTIAL'}
                </div>
              </div>
            )}

            {/* Simulated Sheet Content */}
            <div className="space-y-3 opacity-60">
              <div className="h-4 bg-slate-300 rounded w-1/3" />
              <div className="h-2 bg-slate-200 rounded w-full" />
              <div className="h-2 bg-slate-200 rounded w-5/6" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="space-y-2 opacity-60 pt-4">
              <div className="h-16 bg-slate-200 rounded w-full" />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="h-8 bg-slate-200 rounded" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono">
            Watermark is dynamically embedded during print output and PDF export.
          </p>
        </div>

      </div>

    </div>
  );
}
