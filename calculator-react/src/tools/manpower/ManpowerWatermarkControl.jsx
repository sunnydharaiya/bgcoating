import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Check, RotateCcw } from 'lucide-react';

export default function ManpowerWatermarkControl({
  isOpen,
  onClose,
  watermark = {},
  onSave
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    enabled: watermark.enabled ?? false,
    text: watermark.text || 'CONFIDENTIAL OFFER',
    opacity: watermark.opacity ?? 0.08,
    angle: watermark.angle ?? -30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    setForm({
      enabled: true,
      text: 'CONFIDENTIAL OFFER',
      opacity: 0.08,
      angle: -30
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#180900] via-[#2A1205] to-[#180900] text-white px-6 py-4 flex items-center justify-between border-b border-[#E8700A]/30">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#F5911F]" />
            <h3 className="text-base font-bold">Watermark Pro Security Suite</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Toggle Enable */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Enable Document Watermark</div>
              <div className="text-[10px] text-slate-500">Stamp diagonal text on Print &amp; Preview Dossier</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E8700A]"></div>
            </label>
          </div>

          {/* Watermark Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Watermark Text Phrase
            </label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="e.g. DRAFT / CONFIDENTIAL / BG GROUP"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Opacity Transparency</span>
              <span className="font-mono text-[#E8700A]">{(form.opacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.30"
              step="0.01"
              value={form.opacity}
              onChange={(e) => setForm({ ...form, opacity: parseFloat(e.target.value) || 0.08 })}
              className="w-full accent-[#E8700A]"
            />
          </div>

          {/* Angle Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Rotation Angle</span>
              <span className="font-mono text-[#E8700A]">{form.angle}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={form.angle}
              onChange={(e) => setForm({ ...form, angle: parseInt(e.target.value) || -30 })}
              className="w-full accent-[#E8700A]"
            />
          </div>

          {/* Live Preview Miniature Box */}
          <div className="relative h-24 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center select-none">
            <div className="text-[10px] text-slate-400">Document Live Background Canvas</div>
            {form.enabled && (
              <div
                className="absolute inset-0 flex items-center justify-center font-mono font-black uppercase text-slate-900 dark:text-white text-lg tracking-widest pointer-events-none"
                style={{
                  opacity: form.opacity,
                  transform: `rotate(${form.angle}deg)`
                }}
              >
                {form.text || 'WATERMARK'}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
