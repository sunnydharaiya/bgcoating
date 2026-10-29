import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText,
  Stamp
} from 'lucide-react';
import SpecReportView from './SpecReportView';

export default function SpecPreviewModal({ 
  isOpen, 
  onClose, 
  specData, 
  companyProfile, 
  watermarkSettings 
}) {
  const [zoom, setZoom] = useState(100);
  const [localWatermarkEnabled, setLocalWatermarkEnabled] = useState(watermarkSettings?.enabled ?? true);

  useEffect(() => {
    if (watermarkSettings?.enabled !== undefined) {
      setLocalWatermarkEnabled(watermarkSettings.enabled);
    }
  }, [watermarkSettings?.enabled]);

  if (!isOpen || !specData) return null;

  const activeCompany = companyProfile || {
    name: 'BG GROUP OF PAINT & COATING CONSULTANTS',
    address: 'B 304, Akash Indra Point, Bhestan, Surat - 395023, Gujarat, India',
    phone: '+91 98256 10408',
    website: 'bgcoating.com'
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex flex-col justify-between p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Top Floating Modal Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-2xl max-w-5xl w-full mx-auto mb-3 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white font-rajdhani uppercase tracking-wide">
              Official Dossier Preview (Read-Only)
            </h3>
            <span className="text-[10.5px] font-mono text-slate-400">
              {activeCompany.name}
            </span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setZoom(prev => Math.max(50, prev - 10))}
            className="p-1 text-slate-300 hover:text-white rounded transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-amber-400 font-bold px-1.5">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom(prev => Math.min(150, prev + 10))}
            className="p-1 text-slate-300 hover:text-white rounded transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(100)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Watermark Toggle */}
          <button
            type="button"
            onClick={() => setLocalWatermarkEnabled(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              localWatermarkEnabled ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Watermark Visibility in Preview"
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>{localWatermarkEnabled ? 'Watermark: ON' : 'Watermark: OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white rounded-xl text-xs font-bold font-rajdhani uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Official PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Zoomable Canvas Area */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-2">
        <div 
          className="w-full max-w-5xl transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <SpecReportView 
            {...specData}
            companyProfile={companyProfile}
            watermarkSettings={{
              ...(watermarkSettings || {}),
              enabled: localWatermarkEnabled
            }}
            hideToolbar={true}
          />
        </div>
      </div>
    </div>
  );
}
