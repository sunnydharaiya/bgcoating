import React, { useState } from 'react';
import ProcPrintDossier from './ProcPrintDossier';

export default function ProcPreviewModal({ state, companyProfile, watermarkSettings, onClose, onPrint }) {
  const [zoom, setZoom] = useState(90);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-5xl bg-[#1E2530] text-white p-3.5 rounded-t-xl shadow-2xl flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold text-sm">👁️ Technical Procedure Document Preview</span>
          <span className="text-xs font-mono text-gray-300">
            {state.docNo || 'UNTITLED-DOC'} (Rev {state.revNo || '0'})
          </span>
        </div>

        {/* Zoom Controls & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-800 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="px-2 py-1 hover:bg-gray-700 rounded font-bold"
            >
              -
            </button>
            <span className="px-2 font-mono">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="px-2 py-1 hover:bg-gray-700 rounded font-bold"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-lg shadow transition"
          >
            🖨️ Print / PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold px-2 py-1 rounded"
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Scrollable Document Canvas */}
      <div className="w-full max-w-5xl flex-1 overflow-auto bg-gray-900/60 p-6 rounded-b-xl flex justify-center">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease'
          }}
          className="w-[210mm] shadow-2xl"
        >
          <ProcPrintDossier
            state={state}
            companyProfile={companyProfile}
            watermarkSettings={watermarkSettings}
          />
        </div>
      </div>
    </div>
  );
}
