import React, { useState } from 'react';
import {
  X,
  Printer,
  ZoomIn,
  ZoomOut,
  Building2,
  Shield,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import BlasterPrintDossier from './BlasterPrintDossier';

export default function BlasterPreviewModal({
  isOpen,
  onClose,
  state,
  metrics,
  company,
  watermark,
  onOpenCompany,
  onOpenWatermark
}) {
  if (!isOpen) return null;

  const [zoom, setZoom] = useState(100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-md flex flex-col justify-between overflow-hidden print:p-0">
      
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 print:hidden shadow-xl z-[2001]">
        
        {/* Left: Title & Page Count */}
        <div className="flex items-center gap-3 text-white">
          <span className="p-1.5 rounded-lg bg-[#E8700A] text-white">
            <Printer className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">
              A4 Qualification Dossier Preview
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              3-Page Formal Print Record · {state.operatorName} ({state.category})
            </span>
          </div>
        </div>

        {/* Center: Zoom & Branding Controls */}
        <div className="flex items-center gap-2">
          
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setZoom(Math.max(zoom - 15, 60))}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-slate-200">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(zoom + 15, 140))}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenCompany}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#E8700A]" />
            <span className="hidden sm:inline">Branding</span>
          </button>

          <button
            onClick={onOpenWatermark}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#E8700A]" />
            <span className="hidden sm:inline">Watermark</span>
          </button>

        </div>

        {/* Right: Print Trigger & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#F5911F] to-[#E8700A] text-white text-xs font-bold shadow-lg hover:shadow-[#E8700A]/30 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier (PDF)</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center print:p-0 print:overflow-visible">
        <div
          className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-200 print:shadow-none print:rounded-none print:max-w-none print:w-auto"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <BlasterPrintDossier
            state={state}
            metrics={metrics}
            company={company}
            watermark={watermark}
          />
        </div>
      </div>

    </div>
  );
}
