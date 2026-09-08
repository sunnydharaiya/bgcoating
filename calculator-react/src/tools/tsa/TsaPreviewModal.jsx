import React, { useState } from 'react';
import { X, Printer, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import TsaPrintDossier from './TsaPrintDossier';

export default function TsaPreviewModal({
  isOpen,
  onClose,
  formData,
  evaluation,
  company,
  watermark,
  onPrint
}) {
  if (!isOpen) return null;

  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 60));
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Floating Control Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-20 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] flex items-center justify-center text-white font-black font-rajdhani text-sm">
            BG
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-rajdhani uppercase tracking-wider">
              A4 TSA Qualification Dossier Preview
            </h3>
            <p className="text-[11px] text-slate-400">
              {formData?.['f-rep-no'] || 'DRAFT'} · {formData?.['f-name'] || 'Operator'}
            </p>
          </div>
        </div>

        {/* Zoom & Print Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-xs font-bold text-slate-300 min-w-[50px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:from-[#F39322] hover:to-[#A50021] transition shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier (A4)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Printable Scroll Body */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 flex justify-center items-start bg-slate-800">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150"
        >
          <TsaPrintDossier
            formData={formData}
            evaluation={evaluation}
            company={company}
            watermark={watermark}
          />
        </div>
      </div>

    </div>
  );
}
