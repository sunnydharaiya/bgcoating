// src/tools/painter/PainterWatermarkControl.jsx
import React from 'react';
import { X, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function PainterWatermarkControl({
  isOpen,
  onClose,
  watermark,
  onChange
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider font-rajdhani">
                Watermark Security Controls (PRO)
              </h3>
              <p className="text-[11px] text-slate-300">
                Customise document background security watermark in Technical Dossiers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Watermark Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-slate-800">Enable Watermark Layer</div>
              <div className="text-[11px] text-slate-500">Render repeated diagonal security text on print pages</div>
            </div>
            <input
              type="checkbox"
              checked={watermark?.enabled ?? true}
              onChange={(e) => onChange('enabled', e.target.checked)}
              className="w-4 h-4 text-[#E87B1E] rounded focus:ring-[#E87B1E] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermark?.text || 'BG Group of Paint and Coating Consultant'}
              onChange={(e) => onChange('text', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-medium"
              placeholder="e.g. CONFIDENTIAL / QUALIFIED APPLICATOR"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Watermark Opacity
              </label>
              <span className="font-mono text-slate-600 font-bold">
                {watermark?.opacity ?? 6}%
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={watermark?.opacity ?? 6}
              onChange={(e) => onChange('opacity', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E87B1E]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#E87B1E] hover:bg-[#F39322] transition shadow cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Watermark</span>
          </button>
        </div>

      </div>
    </div>
  );
}
