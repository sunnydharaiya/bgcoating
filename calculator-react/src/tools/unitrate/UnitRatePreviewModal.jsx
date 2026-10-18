import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Printer } from 'lucide-react';
import UnitRatePrintDossier from './UnitRatePrintDossier';

export default function UnitRatePreviewModal({ 
  isOpen, 
  onClose, 
  formData, 
  metrics = {}, 
  companyInfo = {}, 
  watermark = {}, 
  onOpenPrint 
}) {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E6E8EC] rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800">Commercial Quotation Preview (Read-Only)</span>
            <span className="text-xs text-slate-500 hidden sm:inline">• {formData.estNo || 'Draft'}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200 shadow-2xs">
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-500 hover:text-slate-800 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-700 w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-500 hover:text-slate-800 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 text-slate-500 hover:text-orange-600 rounded transition ml-1"
                title="Reset Zoom (100%)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onOpenPrint}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#F1F5F9] flex justify-center items-start">
          <div 
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full max-w-4xl"
          >
            <UnitRatePrintDossier
              formData={formData}
              metrics={metrics}
              companyInfo={companyInfo}
              watermark={watermark}
              onBack={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
