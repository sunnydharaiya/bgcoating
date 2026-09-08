// src/tools/inspection/InspectionPreviewModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2,
  Maximize2
} from 'lucide-react';
import InspectionReportView from './InspectionReportView';

export default function InspectionPreviewModal({
  isOpen,
  onClose,
  state,
  companyProfile,
  watermarkSettings
}) {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col justify-between p-2 md:p-6 overflow-hidden animate-in fade-in">
      
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-4 max-w-5xl mx-auto w-full z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase">
            A4 Print Preview
          </span>
          <span className="text-xs font-bold text-slate-200 hidden sm:inline">
            Daily Coating Inspection Dossier (CIR)
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center text-slate-200">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Official PDF
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Zoomable Sheet Canvas */}
      <div className="flex-1 overflow-auto my-3 flex justify-center items-start p-2">
        <div 
          style={{ 
            transform: `scale(${zoomLevel / 100})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="shadow-2xl rounded-sm"
        >
          <InspectionReportView
            state={state}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        </div>
      </div>

    </div>
  );
}
