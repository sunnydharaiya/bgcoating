import React from 'react';
import { X, Shield, Eye, Sparkles } from 'lucide-react';

export default function BlasterWatermarkControl({
  isOpen,
  onClose,
  watermark,
  onChange
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#E8700A]/10 text-[#E8700A]">
              <Shield className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Document Security Watermark
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Enable Print Watermark</span>
            <input
              type="checkbox"
              checked={watermark.enabled}
              onChange={(e) => onChange('enabled', e.target.checked)}
              className="w-4 h-4 text-[#E8700A] rounded focus:ring-[#E8700A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase">Watermark Text</label>
            <input
              type="text"
              value={watermark.text}
              onChange={(e) => onChange('text', e.target.value)}
              placeholder="e.g. OFFICIAL QUALIFICATION DOSSIER"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10.5px] font-bold text-slate-500 uppercase">
              <span>Opacity</span>
              <span className="font-mono">{Math.round(watermark.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.25"
              step="0.01"
              value={watermark.opacity}
              onChange={(e) => onChange('opacity', parseFloat(e.target.value))}
              className="w-full accent-[#E8700A]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10.5px] font-bold text-slate-500 uppercase">
              <span>Angle (Degrees)</span>
              <span className="font-mono">{watermark.angle}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={watermark.angle}
              onChange={(e) => onChange('angle', parseInt(e.target.value))}
              className="w-full accent-[#E8700A]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E8700A] text-white text-xs font-bold hover:bg-[#F5911F] cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
