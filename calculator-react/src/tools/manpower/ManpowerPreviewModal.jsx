import React, { useState } from 'react';
import { X, Printer, ZoomIn, ZoomOut, RotateCcw, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/manpowerDatabase';

export default function ManpowerPreviewModal({
  isOpen,
  onClose,
  state,
  metrics,
  company = {},
  watermark = {},
  onPrint
}) {
  if (!isOpen) return null;

  const [zoom, setZoom] = useState(100);

  const {
    grandTotal,
    costPerM2,
    blastTotal,
    blastPM2,
    paintTotal,
    paintPM2,
    rawTotal,
    rawPM2,
    totalAbrCost,
    totalAbrTon,
    area,
    coats,
    rawCalculatedRows,
    currencyObj,
    formatCur,
    formatNum
  } = metrics;

  const companyName = company.name || 'BG GROUP OF PAINT & COATINGS CONSULTANT';
  const companyTagline = company.tagline || 'ISO 9001:2015 Certified Corrosion Protection Specialists';

  // Component shares for Page 2 dashboard
  const blastShare = grandTotal > 0 ? (blastTotal / grandTotal) * 100 : 0;
  const abrShare = grandTotal > 0 ? (totalAbrCost / grandTotal) * 100 : 0;
  const paintAppShare = grandTotal > 0 ? (paintTotal / grandTotal) * 100 : 0;
  const paintRawShare = grandTotal > 0 ? (rawTotal / grandTotal) * 100 : 0;

  // Grouped Totals
  const totalBlastingGroup = blastTotal + totalAbrCost;
  const totalBlastingGroupPM2 = area > 0 ? totalBlastingGroup / area : 0;

  const totalPaintingGroup = paintTotal + rawTotal;
  const totalPaintingGroupPM2 = area > 0 ? totalPaintingGroup / area : 0;

  // Conic gradient stop calculations
  const stop1 = blastShare.toFixed(2);
  const stop2 = (blastShare + abrShare).toFixed(2);
  const stop3 = (blastShare + abrShare + paintAppShare).toFixed(2);
  const conicBg = `conic-gradient(#B83400 0% ${stop1}%, #546E7A ${stop1}% ${stop2}%, #E8700A ${stop2}% ${stop3}%, #F5911F ${stop3}% 100%)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F5911F]" />
            <div>
              <h3 className="text-sm font-bold text-white">Painting Project Estimation Dossier</h3>
              <span className="text-[10px] text-slate-400 font-mono">Quotation Review &amp; Print Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setZoom(prev => Math.max(60, prev - 10))}
                className="p-1 text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-slate-300 px-1">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(140, prev + 10))}
                className="p-1 text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1 text-slate-400 hover:text-white ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/60">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="w-[210mm] min-h-[297mm] transition-transform duration-150 space-y-8"
          >
            
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* PAGE 1: OFFICIAL COST SUMMARY WITH PER-COAT BIFURCATION */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="relative bg-white text-slate-900 p-8 sm:p-10 shadow-2xl rounded-sm border border-slate-200 min-h-[297mm] flex flex-col justify-between overflow-hidden">
              
              {/* Security Watermark */}
              {watermark?.enabled && (
                <div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden"
                  style={{ zIndex: 0 }}
                >
                  <span
                    className="font-mono font-black uppercase text-slate-900 tracking-widest text-center"
                    style={{
                      opacity: watermark.opacity || 0.08,
                      transform: `rotate(${watermark.angle || -30}deg)`,
                      fontSize: '5rem',
                      lineHeight: '1.2'
                    }}
                  >
                    {watermark.text || 'CONFIDENTIAL'}
                  </span>
                </div>
              )}

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <div className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                    {companyName}
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    Painting Project Estimation Report
                  </h1>
                  <div className="text-xs text-slate-500 mt-1">
                    Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · Ref Standard ISO 8501 / SSPC-SP10
                  </div>
                </div>

                {/* Project Details Grid */}
                <table className="w-full text-xs border-collapse border border-slate-400">
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 bg-slate-100 font-bold w-36">Estimation No.</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold">{state.estNo || 'EST-2026-27 - 01'}</td>
                      <td className="border border-slate-300 p-2 bg-slate-100 font-bold w-36">Project Name</td>
                      <td className="border border-slate-300 p-2 font-semibold">{state.projectName || 'Amine Absorber Column'}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 bg-slate-100 font-bold">Customer / Client</td>
                      <td className="border border-slate-300 p-2">{state.customer || 'ExxonMobil'}</td>
                      <td className="border border-slate-300 p-2 bg-slate-100 font-bold">Surface Area</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold">{formatNum(area, 0)} m²</td>
                    </tr>
                  </tbody>
                </table>

                {/* Section Header */}
                <div className="bg-[#1F4E79] text-white px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
                  Cost Summary &amp; Per-Coat Bifurcation
                </div>

                {/* Cost Table */}
                <table className="w-full text-xs border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 font-bold">
                      <th className="border border-slate-300 p-2 text-left w-12">Sr.</th>
                      <th className="border border-slate-300 p-2 text-left">Component</th>
                      <th className="border border-slate-300 p-2 text-right">Per m² ({currencyObj.sym})</th>
                      <th className="border border-slate-300 p-2 text-right">Total Cost ({currencyObj.sym})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 1. Blasting Cost */}
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold">1</td>
                      <td className="border border-slate-300 p-2 font-semibold">Blasting Cost (Labor, Equipment, Overheads)</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatCur(blastPM2)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">{formatCur(blastTotal)}</td>
                    </tr>

                    {/* 2. Abrasive Cost */}
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold">2</td>
                      <td className="border border-slate-300 p-2 font-semibold">Abrasive Media ({state.bMedia === 'garnet' ? 'Almandine Garnet' : 'Copper Slag Grit'})</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatCur(area > 0 ? totalAbrCost / area : 0)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">{formatCur(totalAbrCost)}</td>
                    </tr>

                    {/* 3. Paint Application */}
                    <tr className="font-bold bg-slate-50">
                      <td className="border border-slate-300 p-2">3</td>
                      <td className="border border-slate-300 p-2">Paint Application Cost ({coats} Coats)</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatCur(paintPM2)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatCur(paintTotal)}</td>
                    </tr>

                    {/* Per coat paint app sub-rows */}
                    {rawCalculatedRows.map((r, i) => (
                      <tr key={i} className="text-slate-600 bg-slate-50/50">
                        <td className="border border-slate-300 p-1.5"></td>
                        <td className="border border-slate-300 p-1.5 pl-6 italic text-[11px]">
                          ↳ {i + 1}st Coat — {r.name || `Coat ${i + 1}`}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono text-[11px]">
                          {formatCur(paintPM2 / Math.max(1, coats))}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono text-[11px]">
                          {formatCur(paintTotal / Math.max(1, coats))}
                        </td>
                      </tr>
                    ))}

                    {/* 4. Paint Raw Material */}
                    <tr className="font-bold bg-slate-50">
                      <td className="border border-slate-300 p-2">4</td>
                      <td className="border border-slate-300 p-2">Paint Raw Material Formulation Cost</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatCur(rawPM2)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatCur(rawTotal)}</td>
                    </tr>

                    {/* Per coat raw material sub-rows */}
                    {rawCalculatedRows.map((r, i) => (
                      <tr key={i} className="text-slate-600 bg-slate-50/50">
                        <td className="border border-slate-300 p-1.5"></td>
                        <td className="border border-slate-300 p-1.5 pl-6 italic text-[11px]">
                          ↳ {i + 1}st Coat — {r.name || `Coat ${i + 1}`} ({r.dft}µm DFT · {r.vs}% VS)
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono text-[11px]">
                          {formatCur(r.pm2)}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono text-[11px]">
                          {formatCur(r.cost)}
                        </td>
                      </tr>
                    ))}

                    {/* GRAND TOTAL ROW */}
                    <tr className="bg-[#0F4D14] text-white font-bold text-sm">
                      <td colSpan={2} className="border border-slate-900 p-2.5 uppercase tracking-wider">
                        GRAND TOTAL QUOTATION
                      </td>
                      <td className="border border-slate-900 p-2.5 text-right font-mono">{formatCur(costPerM2)}</td>
                      <td className="border border-slate-900 p-2.5 text-right font-mono font-black">{formatCur(grandTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Page 1 Footer */}
              <div className="relative z-10 pt-4 border-t border-slate-300 flex justify-between text-[10px] text-slate-500">
                <span>{companyName}</span>
                <span>Painting Project Estimation Report — Page 1</span>
              </div>
            </div>


            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* PAGE 2: INFOGRAPHIC DASHBOARD (FULL COLOR) */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="relative bg-[#FFF8F0] text-slate-900 p-8 sm:p-10 shadow-2xl rounded-sm border border-slate-300 min-h-[297mm] flex flex-col justify-between overflow-hidden">
              
              {/* Security Watermark */}
              {watermark?.enabled && (
                <div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden"
                  style={{ zIndex: 0 }}
                >
                  <span
                    className="font-mono font-black uppercase text-slate-900 tracking-widest text-center"
                    style={{
                      opacity: watermark.opacity || 0.08,
                      transform: `rotate(${watermark.angle || -30}deg)`,
                      fontSize: '5rem',
                      lineHeight: '1.2'
                    }}
                  >
                    {watermark.text || 'CONFIDENTIAL'}
                  </span>
                </div>
              )}

              <div className="relative z-10 space-y-4">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#180900] via-[#3D1C0C] to-[#521E08] text-white p-4 rounded-xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-[#B83400] text-lg font-mono">
                      BG
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5911F]">
                        {companyName}
                      </div>
                      <div className="text-lg font-bold">
                        Estimation <span className="text-[#F5911F]">Dashboard</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Estimation No.</div>
                    <div className="text-xs font-mono font-bold text-[#F5911F]">{state.estNo || 'EST-2026-27 - 01'}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                </div>

                {/* Sub Bar */}
                <div className="bg-gradient-to-r from-[#B83400] to-[#E8700A] text-white px-4 py-2 rounded-lg text-xs font-semibold flex justify-between shadow-xs">
                  <span><strong>PROJECT:</strong> {state.projectName || 'Amine Absorber Column'}</span>
                  <span><strong>CUSTOMER:</strong> {state.customer || 'ExxonMobil'}</span>
                  <span><strong>SURFACE AREA:</strong> {formatNum(area, 0)} m²</span>
                </div>

                {/* 4 Gradient KPI Cards */}
                <div className="grid grid-cols-4 gap-2.5">
                  <div className="bg-gradient-to-br from-[#0F4D14] to-[#2E7D32] text-white p-3 rounded-lg shadow-sm">
                    <div className="text-[9px] uppercase font-bold text-emerald-200">Grand Total</div>
                    <div className="text-sm font-mono font-black mt-0.5 truncate">{formatCur(grandTotal)}</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white p-3 rounded-lg shadow-sm">
                    <div className="text-[9px] uppercase font-bold text-blue-200">Per m² Cost</div>
                    <div className="text-sm font-mono font-black mt-0.5 truncate">{formatCur(costPerM2)}</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#F5911F] to-[#E8700A] text-white p-3 rounded-lg shadow-sm">
                    <div className="text-[9px] uppercase font-bold text-orange-950">Surface Area</div>
                    <div className="text-sm font-mono font-black mt-0.5 truncate">{formatNum(area, 0)} m²</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#FB8C00] to-[#EF6C00] text-white p-3 rounded-lg shadow-sm">
                    <div className="text-[9px] uppercase font-bold text-orange-950">Status</div>
                    <div className="text-sm font-mono font-black mt-0.5 uppercase">Live Offer</div>
                  </div>
                </div>

                {/* Grouped Cost Totals */}
                <div className="bg-white border border-[#E0C8A0] p-3 rounded-xl shadow-xs space-y-2">
                  <div className="bg-gradient-to-r from-[#B83400] to-[#E8700A] text-white px-3 py-1 text-[11px] font-bold rounded uppercase">
                    Grouped Cost Totals
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Blasting Total */}
                    <div className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] border border-[#B83400] p-2.5 rounded-lg space-y-1.5">
                      <div className="text-xs font-bold text-[#B83400] uppercase">
                        🔧 Blasting Cost Total [Blasting + Abrasive]
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded border border-[#B83400]/20">
                          <div className="text-[8px] uppercase text-slate-500 font-bold">Total Cost</div>
                          <div className="text-xs font-mono font-black text-[#B83400]">{formatCur(totalBlastingGroup)}</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#B83400]/20">
                          <div className="text-[8px] uppercase text-slate-500 font-bold">Per Sq.M. Cost</div>
                          <div className="text-xs font-mono font-black text-[#B83400]">{formatCur(totalBlastingGroupPM2)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Painting Total */}
                    <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] border border-[#0D47A1] p-2.5 rounded-lg space-y-1.5">
                      <div className="text-xs font-bold text-[#0D47A1] uppercase">
                        🖌️ Painting Cost Total [App + Raw Mat]
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded border border-[#0D47A1]/20">
                          <div className="text-[8px] uppercase text-slate-500 font-bold">Total Cost</div>
                          <div className="text-xs font-mono font-black text-[#0D47A1]">{formatCur(totalPaintingGroup)}</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#0D47A1]/20">
                          <div className="text-[8px] uppercase text-slate-500 font-bold">Per Sq.M. Cost</div>
                          <div className="text-xs font-mono font-black text-[#0D47A1]">{formatCur(totalPaintingGroupPM2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donut Chart & Legend Visualization */}
                <div className="bg-white border border-[#E0C8A0] p-4 rounded-xl shadow-xs flex items-center gap-6">
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-full shadow-md"
                      style={{ background: conicBg }}
                    />
                    <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Grand Total</span>
                      <span className="text-xs font-mono font-black text-[#B83400] leading-tight px-1">
                        {formatCur(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Legend Bars */}
                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#B83400]" />
                        <span className="font-semibold text-slate-800">Blasting Labor &amp; Equipment</span>
                      </div>
                      <span className="font-mono font-bold">{formatCur(blastTotal)}</span>
                      <span className="font-mono font-bold text-[#B83400] w-12 text-right">{blastShare.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#546E7A]" />
                        <span className="font-semibold text-slate-800">Abrasive Media</span>
                      </div>
                      <span className="font-mono font-bold">{formatCur(totalAbrCost)}</span>
                      <span className="font-mono font-bold text-[#546E7A] w-12 text-right">{abrShare.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#E8700A]" />
                        <span className="font-semibold text-slate-800">Paint Application</span>
                      </div>
                      <span className="font-mono font-bold">{formatCur(paintTotal)}</span>
                      <span className="font-mono font-bold text-[#E8700A] w-12 text-right">{paintAppShare.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#F5911F]" />
                        <span className="font-semibold text-slate-800">Paint Raw Material</span>
                      </div>
                      <span className="font-mono font-bold">{formatCur(rawTotal)}</span>
                      <span className="font-mono font-bold text-[#F5911F] w-12 text-right">{paintRawShare.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Section-Wise Cost Progress Table */}
                <div className="bg-white border border-[#E0C8A0] p-3 rounded-xl shadow-xs space-y-2">
                  <div className="bg-gradient-to-r from-[#B83400] to-[#E8700A] text-white px-3 py-1 text-[11px] font-bold rounded uppercase">
                    Section-Wise Cost Breakdown
                  </div>

                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-700 font-bold bg-slate-50">
                        <th className="p-2 text-left w-8">Sr.</th>
                        <th className="p-2 text-left">Component</th>
                        <th className="p-2 text-right">Total Cost</th>
                        <th className="p-2 text-right">Per m²</th>
                        <th className="p-2 text-right w-36">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-bold">1</td>
                        <td className="p-2 font-semibold">Blasting</td>
                        <td className="p-2 text-right font-mono font-bold">{formatCur(blastTotal)}</td>
                        <td className="p-2 text-right font-mono">{formatCur(blastPM2)}</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#B83400]" style={{ width: `${blastShare}%` }} />
                            </div>
                            <span className="font-mono font-bold text-[#B83400] w-10 text-right">{blastShare.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="p-2 font-bold">2</td>
                        <td className="p-2 font-semibold">Abrasive</td>
                        <td className="p-2 text-right font-mono font-bold">{formatCur(totalAbrCost)}</td>
                        <td className="p-2 text-right font-mono">{formatCur(area > 0 ? totalAbrCost / area : 0)}</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#546E7A]" style={{ width: `${abrShare}%` }} />
                            </div>
                            <span className="font-mono font-bold text-[#546E7A] w-10 text-right">{abrShare.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="p-2 font-bold">3</td>
                        <td className="p-2 font-semibold">Paint Application</td>
                        <td className="p-2 text-right font-mono font-bold">{formatCur(paintTotal)}</td>
                        <td className="p-2 text-right font-mono">{formatCur(paintPM2)}</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#E8700A]" style={{ width: `${paintAppShare}%` }} />
                            </div>
                            <span className="font-mono font-bold text-[#E8700A] w-10 text-right">{paintAppShare.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="p-2 font-bold">4</td>
                        <td className="p-2 font-semibold">Paint Raw Material</td>
                        <td className="p-2 text-right font-mono font-bold">{formatCur(rawTotal)}</td>
                        <td className="p-2 text-right font-mono">{formatCur(rawPM2)}</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#F5911F]" style={{ width: `${paintRawShare}%` }} />
                            </div>
                            <span className="font-mono font-bold text-[#F5911F] w-10 text-right">{paintRawShare.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Page 2 Footer */}
              <div className="relative z-10 mt-3 p-2 bg-[#1A0A02] text-white rounded-lg flex justify-between text-[9px]">
                <span className="text-slate-400">{companyName}</span>
                <span className="text-[#F5911F] font-bold">Painting Project Estimation Report · Page 2 (Dashboard)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
