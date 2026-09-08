import React from 'react';
import { CURRENCY_CONFIG } from '../../data/manpowerDatabase';

export default function ManpowerPrintDossier({
  state = {},
  metrics = {},
  company = {},
  watermark = {}
}) {
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
    totalDieselL,
    totalDieselCost,
    area,
    coats,
    rawCalculatedRows = [],
    currencyObj = CURRENCY_CONFIG.INR,
    formatCur = (v) => `₹ ${v}`,
    formatNum = (v) => String(v)
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

  const stop1 = blastShare.toFixed(2);
  const stop2 = (blastShare + abrShare).toFixed(2);
  const stop3 = (blastShare + abrShare + paintAppShare).toFixed(2);
  const conicBg = `conic-gradient(#B83400 0% ${stop1}%, #546E7A ${stop1}% ${stop2}%, #E8700A ${stop2}% ${stop3}%, #F5911F ${stop3}% 100%)`;

  return (
    <div id="manpower-print-dossier" className="hidden print:block print:w-full print:bg-white text-slate-900 font-sans">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 1: COST SUMMARY */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="print-page w-full min-h-[297mm] p-10 flex flex-col justify-between" style={{ pageBreakAfter: 'always' }}>
        <div className="space-y-6">
          
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-3">
            <div className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              {companyName}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Painting Project Estimation Report
            </h1>
            <div className="text-xs text-slate-600 mt-1">
              Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Project Details Grid */}
          <table className="w-full text-xs border-collapse border border-black">
            <tbody>
              <tr>
                <td className="border border-slate-400 p-2 bg-slate-100 font-bold w-36">Estimation No.</td>
                <td className="border border-slate-400 p-2 font-mono font-bold">{state.estNo || 'EST-2026-27 - 01'}</td>
                <td className="border border-slate-400 p-2 bg-slate-100 font-bold w-36">Project Name</td>
                <td className="border border-slate-400 p-2 font-semibold">{state.projectName || 'Amine Absorber Column'}</td>
              </tr>
              <tr>
                <td className="border border-slate-400 p-2 bg-slate-100 font-bold">Customer / Client</td>
                <td className="border border-slate-400 p-2">{state.customer || 'ExxonMobil'}</td>
                <td className="border border-slate-400 p-2 bg-slate-100 font-bold">Surface Area</td>
                <td className="border border-slate-400 p-2 font-mono font-bold">{formatNum(area, 0)} m²</td>
              </tr>
            </tbody>
          </table>

          {/* Section Header */}
          <div className="bg-[#1F4E79] text-white px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
            COST SUMMARY &amp; PER-COAT BIFURCATION
          </div>

          {/* Cost Table */}
          <table className="w-full text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold">
                <th className="border border-slate-400 p-2 text-left w-12">Sr.</th>
                <th className="border border-slate-400 p-2 text-left">Component</th>
                <th className="border border-slate-400 p-2 text-right">Per m² ({currencyObj.sym})</th>
                <th className="border border-slate-400 p-2 text-right">Total Cost ({currencyObj.sym})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-400 p-2 font-bold">1</td>
                <td className="border border-slate-400 p-2 font-semibold">Blasting Cost</td>
                <td className="border border-slate-400 p-2 text-right font-mono">{formatCur(blastPM2)}</td>
                <td className="border border-slate-400 p-2 text-right font-mono font-bold">{formatCur(blastTotal)}</td>
              </tr>

              <tr>
                <td className="border border-slate-400 p-2 font-bold">2</td>
                <td className="border border-slate-400 p-2 font-semibold">Abrasive Cost</td>
                <td className="border border-slate-400 p-2 text-right font-mono">{formatCur(area > 0 ? totalAbrCost / area : 0)}</td>
                <td className="border border-slate-400 p-2 text-right font-mono font-bold">{formatCur(totalAbrCost)}</td>
              </tr>

              <tr className="font-bold bg-slate-50">
                <td className="border border-slate-400 p-2">3</td>
                <td className="border border-slate-400 p-2">Paint Application Cost ({coats} Coats)</td>
                <td className="border border-slate-400 p-2 text-right font-mono">{formatCur(paintPM2)}</td>
                <td className="border border-slate-400 p-2 text-right font-mono">{formatCur(paintTotal)}</td>
              </tr>

              {rawCalculatedRows.map((r, i) => (
                <tr key={i} className="text-slate-600 bg-slate-50/50">
                  <td className="border border-slate-400 p-1.5"></td>
                  <td className="border border-slate-400 p-1.5 pl-6 italic text-[11px]">
                    ↳ {i + 1}st Coat — {r.name || `Coat ${i + 1}`}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-right font-mono text-[11px]">
                    {formatCur(paintPM2 / Math.max(1, coats))}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-right font-mono text-[11px]">
                    {formatCur(paintTotal / Math.max(1, coats))}
                  </td>
                </tr>
              ))}

              <tr className="font-bold bg-slate-50">
                <td className="border border-slate-400 p-2">4</td>
                <td className="border border-slate-400 p-2">Paint Raw Material Cost</td>
                <td className="border border-slate-400 p-2 text-right font-mono">{formatCur(rawPM2)}</td>
                <td className="border border-slate-400 p-2 text-right font-mono">{formatCur(rawTotal)}</td>
              </tr>

              {rawCalculatedRows.map((r, i) => (
                <tr key={i} className="text-slate-600 bg-slate-50/50">
                  <td className="border border-slate-400 p-1.5"></td>
                  <td className="border border-slate-400 p-1.5 pl-6 italic text-[11px]">
                    ↳ {i + 1}st Coat — {r.name || `Coat ${i + 1}`} ({r.dft}µm DFT · {r.vs}% VS)
                  </td>
                  <td className="border border-slate-400 p-1.5 text-right font-mono text-[11px]">
                    {formatCur(r.pm2)}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-right font-mono text-[11px]">
                    {formatCur(r.cost)}
                  </td>
                </tr>
              ))}

              {/* GRAND TOTAL ROW */}
              <tr className="bg-[#0F4D14] text-white font-bold text-sm">
                <td colSpan={2} className="border border-black p-2.5 uppercase tracking-wider">
                  GRAND TOTAL
                </td>
                <td className="border border-black p-2.5 text-right font-mono">{formatCur(costPerM2)}</td>
                <td className="border border-black p-2.5 text-right font-mono font-black">{formatCur(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Page 1 Footer */}
        <div className="pt-4 border-t border-slate-300 flex justify-between text-[10px] text-slate-600">
          <span>{companyName}</span>
          <span>Painting Project Estimation Report — Page 1</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 2: INFOGRAPHIC DASHBOARD */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="print-page w-full min-h-[297mm] p-10 bg-[#FFF8F0] flex flex-col justify-between" style={{ pageBreakAfter: 'always' }}>
        <div className="space-y-4">
          
          {/* Header */}
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
          <div className="bg-gradient-to-r from-[#B83400] to-[#E8700A] text-white px-4 py-2 rounded-lg text-xs font-semibold flex justify-between">
            <span><strong>PROJECT:</strong> {state.projectName || 'Amine Absorber Column'}</span>
            <span><strong>CUSTOMER:</strong> {state.customer || 'ExxonMobil'}</span>
            <span><strong>SURFACE AREA:</strong> {formatNum(area, 0)} m²</span>
          </div>

          {/* 4 Gradient KPI Cards */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-gradient-to-br from-[#0F4D14] to-[#2E7D32] text-white p-3 rounded-lg">
              <div className="text-[9px] uppercase font-bold text-emerald-200">Grand Total</div>
              <div className="text-sm font-mono font-black mt-0.5 truncate">{formatCur(grandTotal)}</div>
            </div>

            <div className="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white p-3 rounded-lg">
              <div className="text-[9px] uppercase font-bold text-blue-200">Per m² Cost</div>
              <div className="text-sm font-mono font-black mt-0.5 truncate">{formatCur(costPerM2)}</div>
            </div>

            <div className="bg-gradient-to-br from-[#F5911F] to-[#E8700A] text-white p-3 rounded-lg">
              <div className="text-[9px] uppercase font-bold text-orange-950">Surface Area</div>
              <div className="text-sm font-mono font-black mt-0.5 truncate">{formatNum(area, 0)} m²</div>
            </div>

            <div className="bg-gradient-to-br from-[#FB8C00] to-[#EF6C00] text-white p-3 rounded-lg">
              <div className="text-[9px] uppercase font-bold text-orange-950">Status</div>
              <div className="text-sm font-mono font-black mt-0.5 uppercase">Live Offer</div>
            </div>
          </div>

          {/* Grouped Cost Totals */}
          <div className="bg-white border border-[#E0C8A0] p-3 rounded-xl space-y-2">
            <div className="bg-gradient-to-r from-[#B83400] to-[#E8700A] text-white px-3 py-1 text-[11px] font-bold rounded uppercase">
              Grouped Cost Totals
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
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

          {/* Donut Chart Visualization */}
          <div className="bg-white border border-[#E0C8A0] p-4 rounded-xl flex items-center gap-6">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <div
                className="w-full h-full rounded-full shadow-md"
                style={{ background: conicBg }}
              />
              <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Grand Total</span>
                <span className="text-xs font-mono font-black text-[#B83400] leading-tight px-1">
                  {formatCur(grandTotal)}
                </span>
              </div>
            </div>

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
        </div>

        {/* Page 2 Footer */}
        <div className="mt-3 p-2 bg-[#1A0A02] text-white rounded-lg flex justify-between text-[9px]">
          <span className="text-slate-400">{companyName}</span>
          <span className="text-[#F5911F] font-bold">Painting Project Estimation Report · Page 2 (Dashboard)</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 3: ESTIMATION BASIS & INPUT PARAMETERS CLOSING SHEET */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="print-page w-full min-h-[297mm] p-10 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-3">
            <div className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              {companyName}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Estimation Basis &amp; Project Input Parameters
            </h2>
            <div className="text-xs text-slate-600 mt-1">
              Ref Standard ISO 12944 / NACE / SSPC / BG Engineering Norms
            </div>
          </div>

          {/* Basis Parameter Tables */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Blasting Basis */}
            <div className="border border-slate-400 rounded p-3 space-y-2">
              <div className="bg-slate-100 p-1 font-bold text-xs uppercase border-b border-slate-300">
                1. Surface Prep &amp; Blasting Basis
              </div>
              <div className="text-xs space-y-1 font-mono">
                <div className="flex justify-between"><span>Surface Prep Standard:</span><span className="font-bold">{state.surfacePrep || 'Sa 2.5'}</span></div>
                <div className="flex justify-between"><span>Substrate Metallurgy (MOC):</span><span className="font-bold">{state.moc || 'Carbon Steel'}</span></div>
                <div className="flex justify-between"><span>Abrasive Media Type:</span><span className="font-bold">{state.bMedia || 'Copper Slag'}</span></div>
                <div className="flex justify-between"><span>Abrasive Consumption Rate:</span><span className="font-bold">{state.bAbrKg || 15} kg/m²</span></div>
                <div className="flex justify-between"><span>Shift Productivity Target:</span><span className="font-bold">{state.blastOutput || 50} m²/shift</span></div>
                <div className="flex justify-between"><span>Idling Allowance:</span><span className="font-bold">{state.bIdle || 15}%</span></div>
              </div>
            </div>

            {/* Application Basis */}
            <div className="border border-slate-400 rounded p-3 space-y-2">
              <div className="bg-slate-100 p-1 font-bold text-xs uppercase border-b border-slate-300">
                2. Paint Application &amp; Crew Basis
              </div>
              <div className="text-xs space-y-1 font-mono">
                <div className="flex justify-between"><span>Total Number of Coats:</span><span className="font-bold">{coats} Passes</span></div>
                <div className="flex justify-between"><span>Painting Output Target:</span><span className="font-bold">{state.paintOutput || 30} m²/shift</span></div>
                <div className="flex justify-between"><span>Working Days / Month:</span><span className="font-bold">{state.wdays || 26} days</span></div>
                <div className="flex justify-between"><span>Daily Shifts:</span><span className="font-bold">{state.shifts || 1} Shift(s)</span></div>
                <div className="flex justify-between"><span>Subcontractor Overhead:</span><span className="font-bold">{state.pOH || 0}%</span></div>
                <div className="flex justify-between"><span>Subcontractor Profit:</span><span className="font-bold">{state.pProfit || 10}%</span></div>
              </div>
            </div>
          </div>

          {/* Revision History */}
          <div className="space-y-2">
            <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase">
              Revision &amp; Document Control Record
            </div>
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="border border-slate-400 p-1.5 text-center w-16">Rev No.</th>
                  <th className="border border-slate-400 p-1.5 text-center w-24">Date</th>
                  <th className="border border-slate-400 p-1.5 text-left">Description / Revision Scope</th>
                  <th className="border border-slate-400 p-1.5 text-center w-28">Prepared By</th>
                  <th className="border border-slate-400 p-1.5 text-center w-28">Approved By</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-bold font-mono">R0</td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono">{new Date().toLocaleDateString('en-IN')}</td>
                  <td className="border border-slate-400 p-1.5">Initial Detailed Take-Off &amp; Manpower Estimation</td>
                  <td className="border border-slate-400 p-1.5 text-center">BG Estimator</td>
                  <td className="border border-slate-400 p-1.5 text-center font-bold text-emerald-800">Commercial Head</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sign-off Authorization */}
          <div className="grid grid-cols-3 gap-6 pt-10">
            <div className="border-t-2 border-slate-900 pt-2 text-center text-xs">
              <div className="font-bold">Prepared By</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Lead Estimation Engineer</div>
            </div>

            <div className="border-t-2 border-slate-900 pt-2 text-center text-xs">
              <div className="font-bold">Verified By</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Technical &amp; QA Head</div>
            </div>

            <div className="border-t-2 border-slate-900 pt-2 text-center text-xs">
              <div className="font-bold">Authorized Signatory</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Commercial Director / Client</div>
            </div>
          </div>

        </div>

        {/* Page 3 Footer */}
        <div className="pt-4 border-t border-slate-300 flex justify-between text-[10px] text-slate-600">
          <span>{companyName} · {companyTagline}</span>
          <span>Painting Project Estimation Report — Page 3 (Basis)</span>
        </div>
      </div>

    </div>
  );
}
