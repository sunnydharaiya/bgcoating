import React, { useState, useEffect } from 'react';
import { 
  Stamp, 
  RotateCcw, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Sliders, 
  Eye, 
  Play 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const WATERMARK_STORAGE_KEY = 'bg_watermark_settings';

export const DEFAULT_WATERMARK = {
  enabled: true,
  opacity: 12, // 3 to 30%
  rotation: -30, // -60 to 0 deg
  text: 'BG GROUP OF PAINT & COATING CONSULTANT'
};

export default function SpecWatermarkControl({ watermarkSettings, setWatermarkSettings }) {
  const { addToast } = useToast();

  const handleToggle = () => {
    setWatermarkSettings(prev => {
      const updated = { ...prev, enabled: !prev.enabled };
      localStorage.setItem(WATERMARK_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    addToast('Watermark Toggled', `Watermark is now ${!watermarkSettings.enabled ? 'ON' : 'OFF'}.`, 'info');
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Configuration
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Watermark &amp; Document Security Suite
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-[#D97706] text-[10px] font-mono font-bold uppercase">
              ★ Pro
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure the diagonal corporate watermark printed across all Preview, Print &amp; PDF specification dossiers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#F7941D]" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Watermark Controls
              </h2>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              watermarkSettings.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {watermarkSettings.enabled ? 'ACTIVE' : 'DISABLED'}
            </span>
          </div>

          {/* Master Toggle Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Diagonal Watermark</span>
              <span className="text-[11px] text-slate-500 font-sans">
                {watermarkSettings.enabled ? 'Visible on all Preview & Print pages' : 'Watermark hidden on output'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                watermarkSettings.enabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                watermarkSettings.enabled ? 'right-0.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Watermark Text Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Watermark Text</label>
              <span className="text-[10px] font-mono text-slate-400">Uppercase recommended</span>
            </div>
            <input
              type="text"
              value={watermarkSettings.text}
              onChange={e => handleUpdate('text', e.target.value)}
              placeholder="e.g. CONFIDENTIAL / COMPANY NAME"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">Transparency / Opacity</label>
              <span className="font-mono font-bold text-[#D97706]">{watermarkSettings.opacity}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              value={watermarkSettings.opacity}
              onChange={e => handleUpdate('opacity', Number(e.target.value))}
              className="w-full accent-[#F7941D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>3% (Subtle)</span>
              <span>15% (Standard)</span>
              <span>30% (Prominent)</span>
            </div>
          </div>

          {/* Rotation Angle Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">Rotation Angle (Diagonal)</label>
              <span className="font-mono font-bold text-[#D97706]">{watermarkSettings.rotation}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="0"
              value={watermarkSettings.rotation}
              onChange={e => handleUpdate('rotation', Number(e.target.value))}
              className="w-full accent-[#F7941D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>-60° (Steep)</span>
              <span>-30° (Standard)</span>
              <span>0° (Horizontal)</span>
            </div>
          </div>

          {/* Pro info */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-2xl text-xs text-amber-900 space-y-1 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[10px] text-[#D97706]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Watermark Engine</span>
            </div>
            <p className="text-[11px]">
              Watermark settings are automatically applied to the background layer of every page during A4 printing and PDF export.
            </p>
          </div>

        </div>

        {/* Right Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Live Sheet Watermark Preview
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Simulated A4 Paper</span>
          </div>

          {/* Interactive A4 Sheet Canvas */}
          <div className="p-6 bg-slate-100 rounded-2xl flex items-center justify-center min-h-[360px] overflow-hidden">
            <div className="w-full max-w-sm aspect-[1/1.35] bg-white rounded-xl shadow-md p-6 relative overflow-hidden border border-slate-200 flex flex-col justify-between select-none">
              
              {/* Simulated Watermark Behind Content */}
              {watermarkSettings.enabled && (
                <div 
                  className="absolute inset-0 pointer-events-none flex items-center justify-center text-center font-mono font-black uppercase text-slate-900 tracking-wider transition-all duration-150"
                  style={{
                    opacity: watermarkSettings.opacity / 100,
                    transform: `rotate(${watermarkSettings.rotation}deg)`,
                    fontSize: '18px',
                    lineHeight: '1.3'
                  }}
                >
                  {watermarkSettings.text || 'BG GROUP OF PAINT & COATING CONSULTANT'}
                </div>
              )}

              {/* Simulated Report Content Lines */}
              <div className="space-y-3 relative z-10 opacity-70">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="w-20 h-3 bg-slate-800 rounded"></div>
                  <div className="w-16 h-2 bg-slate-300 rounded"></div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-2 bg-slate-200 rounded"></div>
                  <div className="w-5/6 h-2 bg-slate-200 rounded"></div>
                  <div className="w-4/6 h-2 bg-slate-200 rounded"></div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-12 bg-slate-100 rounded border border-slate-200 p-1.5 space-y-1">
                    <div className="w-10 h-1.5 bg-slate-400 rounded"></div>
                    <div className="w-14 h-2 bg-slate-600 rounded"></div>
                  </div>
                  <div className="h-12 bg-slate-100 rounded border border-slate-200 p-1.5 space-y-1">
                    <div className="w-10 h-1.5 bg-slate-400 rounded"></div>
                    <div className="w-14 h-2 bg-slate-600 rounded"></div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="w-full h-2 bg-slate-200 rounded"></div>
                  <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                </div>
              </div>

              {/* Simulated Footer Sign-off */}
              <div className="pt-4 border-t border-slate-200 flex justify-between relative z-10 opacity-60">
                <div className="w-12 h-1 bg-slate-400 rounded"></div>
                <div className="w-12 h-1 bg-slate-400 rounded"></div>
                <div className="w-12 h-1 bg-slate-400 rounded"></div>
              </div>

            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-sans">
            Watermark is rendered in low opacity directly beneath document text, tables, and inspection signatures.
          </p>

        </div>

      </div>

    </div>
  );
}
