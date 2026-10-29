import React, { useState, useEffect } from 'react';
import { 
  Stamp, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Sparkles, 
  Check, 
  Palette,
  Layers,
  FileText
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const WATERMARK_STORAGE_KEY = 'bg_watermark_settings';

export const DEFAULT_WATERMARK = {
  enabled: true,
  opacity: 10, // 3 to 35%
  rotation: -30, // -60 to 0 deg
  text: 'BG GROUP OF PAINT & COATING CONSULTANT',
  color: '#C62828' // Default corporate terracotta
};

const WATERMARK_PRESETS = [
  'BG GROUP OF PAINT & COATING CONSULTANT',
  'CONFIDENTIAL — CLIENT USE ONLY',
  'DRAFT — FOR TECHNICAL REVIEW ONLY',
  'APPROVED FOR ESTIMATION & TENDER',
  'PRELIMINARY — NOT FOR CONSTRUCTION'
];

const WATERMARK_COLORS = [
  { name: 'Terracotta', hex: '#C62828', label: 'Corporate' },
  { name: 'Amber', hex: '#D97706', label: 'Tender' },
  { name: 'Crimson', hex: '#9E1B1E', label: 'Official' },
  { name: 'Slate', hex: '#475569', label: 'Technical' }
];

export default function SpecWatermarkControl({ watermarkSettings = DEFAULT_WATERMARK, setWatermarkSettings }) {
  const { addToast } = useToast();

  const current = {
    ...DEFAULT_WATERMARK,
    ...watermarkSettings
  };

  const handleToggle = () => {
    setWatermarkSettings(prev => {
      const updated = { ...prev, enabled: !prev.enabled };
      localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    addToast('Watermark Toggled', `Watermark is now ${!current.enabled ? 'ON' : 'OFF'}.`, 'info');
  };

  const handleUpdate = (field, value) => {
    setWatermarkSettings(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleReset = () => {
    setWatermarkSettings(DEFAULT_WATERMARK);
    localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(DEFAULT_WATERMARK));
    addToast('Watermark Reset', 'Restored default watermark parameters.', 'info');
  };

  // Generate SVG repeating diagonal watermark pattern in real-time
  const watermarkSvg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='210'><text x='50%' y='50%' fill='${encodeURIComponent(current.color || '#C62828')}' fill-opacity='${(current.opacity || 10) / 100}' font-size='12' font-family='Arial, sans-serif' font-weight='bold' text-anchor='middle' transform='rotate(${current.rotation || -30} 210 105)'>${encodeURIComponent(current.text || 'BG GROUP')}</text></svg>")`;

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#9E1B1E] border border-[#F3D2A0] px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Configuration
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wide">
              Watermark &amp; Security Control
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
              • LIVE DYNAMIC
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-sans">
            Real-time control over the repeating corporate watermark printed across all Preview, Print &amp; PDF specification dossiers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 bg-white hover:bg-[#F7F8FA] text-[#4E5B6A] border border-[#D8DEE5] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-[#F0E6DD] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#E87B1E]" />
              <h2 className="text-xs font-bold text-[#1B222C] uppercase tracking-wider font-rajdhani">
                Watermark Parameters
              </h2>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
              current.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {current.enabled ? 'ACTIVE' : 'DISABLED'}
            </span>
          </div>

          {/* Master Toggle Card */}
          <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#F0E6DD] flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#1B222C] block font-sans">Repeating Diagonal Watermark</span>
              <span className="text-[11px] text-[#64748B] font-sans">
                {current.enabled ? 'Visible across all Preview & Print sheets' : 'Watermark hidden on output'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                current.enabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                current.enabled ? 'right-0.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Watermark Text Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1B222C] font-sans">Watermark Text</label>
              <span className="text-[10px] font-mono text-[#94A3B8]">Uppercase recommended</span>
            </div>
            <input
              type="text"
              value={current.text}
              onChange={e => handleUpdate('text', e.target.value)}
              placeholder="e.g. BG GROUP OF PAINT & COATING CONSULTANT"
              className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold text-[#1B222C] focus:outline-none focus:border-[#E87B1E] focus:ring-1 focus:ring-[#E87B1E]"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase font-mono">Quick Preset Text</label>
            <div className="flex flex-wrap gap-1.5">
              {WATERMARK_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUpdate('text', preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                    current.text === preset 
                      ? 'bg-[#FFF4E3] text-[#9E1B1E] border-[#F3D2A0] font-bold' 
                      : 'bg-white text-[#4E5B6A] border-[#D8DEE5] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase font-mono">Watermark Color</label>
            <div className="grid grid-cols-4 gap-2">
              {WATERMARK_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleUpdate('color', c.hex)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    current.color === c.hex 
                      ? 'border-[#1B222C] ring-2 ring-[#E87B1E]/30 bg-[#FFFDF9]' 
                      : 'border-[#D8DEE5] bg-white hover:bg-[#F7F8FA]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full shadow-2xs border border-black/10" style={{ backgroundColor: c.hex }} />
                  <span className="text-[9.5px] font-mono font-bold text-[#1B222C]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-sans">
              <label className="font-bold text-[#1B222C]">Opacity / Prominence</label>
              <span className="font-mono font-bold text-[#E87B1E]">{current.opacity}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="35"
              value={current.opacity}
              onChange={e => handleUpdate('opacity', Number(e.target.value))}
              className="w-full accent-[#E87B1E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
              <span>3% (Subtle)</span>
              <span>10% (Standard)</span>
              <span>35% (Prominent)</span>
            </div>
          </div>

          {/* Rotation Angle Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-sans">
              <label className="font-bold text-[#1B222C]">Rotation Angle</label>
              <span className="font-mono font-bold text-[#E87B1E]">{current.rotation}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="0"
              value={current.rotation}
              onChange={e => handleUpdate('rotation', Number(e.target.value))}
              className="w-full accent-[#E87B1E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
              <span>-60° (Steep)</span>
              <span>-30° (Standard)</span>
              <span>0° (Horizontal)</span>
            </div>
          </div>

          {/* Pro info box */}
          <div className="p-3 bg-[#FFF4E3] border border-[#F3D2A0] rounded-xl text-xs text-[#9E1B1E] space-y-1 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[10px] text-[#E87B1E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Synchronized Watermark</span>
            </div>
            <p className="text-[11px] text-[#4E5B6A]">
              Changes apply dynamically to both the Preview Modal and the official Print Dossier without requiring a page refresh.
            </p>
          </div>

        </div>

        {/* Right Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="flex items-center justify-between border-b border-[#F0E6DD] pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#E87B1E]" />
              <h2 className="text-xs font-bold text-[#1B222C] uppercase tracking-wider font-rajdhani">
                Live Sheet Watermark Canvas (Simulated Dossier Page)
              </h2>
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Dynamic Real-Time Render</span>
          </div>

          {/* Interactive A4 Sheet Canvas with Repeating Watermark */}
          <div className="p-6 bg-[#F8FAFC] rounded-xl flex items-center justify-center min-h-[440px] overflow-hidden border border-[#E2E8F0]">
            <div 
              className="w-full max-w-md aspect-[1/1.38] bg-white rounded-lg shadow-md p-6 relative overflow-hidden border border-[#CBD5E1] flex flex-col justify-between select-none"
              style={{
                backgroundImage: current.enabled ? watermarkSvg : 'none',
                backgroundRepeat: 'repeat'
              }}
            >
              {/* Header Wireframe */}
              <div className="relative z-10 border-b border-slate-300 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 border border-black flex items-center justify-center font-bold text-xs font-rajdhani bg-white">
                    BG
                  </div>
                  <div className="flex-1 text-center pr-8">
                    <div className="h-2.5 w-3/4 mx-auto bg-slate-900 rounded-xs mb-1"></div>
                    <div className="h-1.5 w-1/2 mx-auto bg-slate-400 rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* Body Wireframe Tables */}
              <div className="relative z-10 space-y-2 py-2">
                <div className="h-3 bg-[#1E293B] rounded-xs w-full"></div>
                <div className="space-y-1 p-1 border border-slate-300 rounded-xs bg-white/70">
                  <div className="h-2 bg-slate-200 rounded-xs w-full"></div>
                  <div className="h-2 bg-slate-200 rounded-xs w-5/6"></div>
                  <div className="h-2 bg-slate-200 rounded-xs w-4/6"></div>
                </div>

                <div className="h-3 bg-[#1E293B] rounded-xs w-full mt-2"></div>
                <div className="grid grid-cols-4 gap-1 p-1 border border-slate-300 rounded-xs bg-white/70">
                  <div className="h-5 bg-slate-100 border border-slate-200 rounded-xs"></div>
                  <div className="h-5 bg-slate-100 border border-slate-200 rounded-xs"></div>
                  <div className="h-5 bg-slate-100 border border-slate-200 rounded-xs"></div>
                  <div className="h-5 bg-slate-100 border border-slate-200 rounded-xs"></div>
                </div>

                <div className="h-3 bg-[#1E293B] rounded-xs w-full mt-2"></div>
                <div className="space-y-1 p-1 border border-slate-300 rounded-xs bg-white/70">
                  <div className="h-2 bg-slate-200 rounded-xs w-full"></div>
                  <div className="h-2 bg-slate-200 rounded-xs w-3/4"></div>
                </div>
              </div>

              {/* Footer Wireframe */}
              <div className="relative z-10 border-t border-slate-300 pt-2 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                <span>DOC: SPEC-PRJ-2026 • STATUS: DRAFT</span>
                <span>PAGE 1 OF 1</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-[#64748B] font-mono">
            Pattern size: 420x210px • Font: Arial Bold • Angle: {current.rotation}° • Opacity: {current.opacity}%
          </div>
        </div>

      </div>
    </div>
  );
}
