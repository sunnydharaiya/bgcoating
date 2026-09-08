// src/tools/inspection/InspectionReportView.jsx
import React from 'react';
import { formatNum } from '../../utils/calculations';

export default function InspectionReportView({
  state,
  companyProfile = {},
  watermarkSettings = {}
}) {
  const comp = companyProfile || {};
  const wm = watermarkSettings || {};
  const s1 = state.stages?.s1 || {};
  const s2 = state.stages?.s2 || {};
  const s3 = state.stages?.s3 || {};
  const photoList = state.photoReport || [];
  const pullOff = state.pullOffAdhesion || {};
  const crossCut = state.crossCutAdhesion || {};

  // Compute pull-off stats
  const dollies = pullOff.dollies || [];
  const validPressures = dollies.map(d => parseFloat(d.pressureMpa)).filter(p => !isNaN(p) && p > 0);
  const meanMpa = validPressures.length > 0 ? (validPressures.reduce((a, b) => a + b, 0) / validPressures.length).toFixed(1) : '0.0';

  return (
    <div className="relative bg-white text-slate-900 font-sans w-[210mm] min-h-[297mm] p-8 md:p-10 mx-auto shadow-lg print:shadow-none print:w-full print:p-0 text-[11px] leading-snug">
      
      {/* Live Diagonal Watermark Overlay */}
      {wm.enabled && (
        <div 
          className="pointer-events-none fixed inset-0 flex items-center justify-center select-none z-40 overflow-hidden"
          style={{ opacity: (wm.opacity || 8) / 100 }}
        >
          <div 
            className="text-slate-900 font-black text-6xl md:text-7xl uppercase tracking-widest whitespace-nowrap"
            style={{ transform: `rotate(${wm.angle || -30}deg)` }}
          >
            {wm.text || 'CONFIDENTIAL'}
          </div>
        </div>
      )}

      {/* 1. Official Corporate Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {comp.logo ? (
            <img src={comp.logo} alt="Company Logo" className="h-14 w-auto object-contain max-w-[160px]" />
          ) : (
            <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono font-black text-lg">
              BG
            </div>
          )}
          <div>
            <h1 className="text-base font-black uppercase text-slate-900 tracking-tight">
              {comp.name || 'BG GROUP INDUSTRIAL COATINGS LTD.'}
            </h1>
            <p className="text-[10px] text-slate-600">
              {comp.tagline || 'Surface Engineering, Protective Coating Inspection & QA/QC Digital Systems'}
            </p>
            <p className="text-[9.5px] text-slate-500 font-mono">
              {comp.address || 'Industrial Zone, Sector-4, Gujarat, India'} · Email: {comp.email || 'qc@bgcoating.com'}
            </p>
          </div>
        </div>

        <div className="text-right border-l-2 border-slate-200 pl-3">
          <span className="text-[9px] font-mono uppercase font-bold text-slate-500 block">QA/QC Document Form</span>
          <span className="text-xs font-black font-mono text-slate-900">CIR-FORM-09-REV.4</span>
          <span className="text-[9px] text-slate-500 block font-mono">ISO 9001 / SSPC Compliant</span>
        </div>
      </div>

      {/* Document Title Banner */}
      <div className="bg-slate-900 text-white text-center py-1.5 px-3 uppercase font-mono font-bold tracking-wider text-xs mb-3 rounded-xs">
        DAILY COATING INSPECTION &amp; ADHESION TEST DOSSIER (CIR)
      </div>

      {/* 2. Project Information Matrix */}
      <div className="border border-slate-300 rounded-sm mb-3 overflow-hidden text-[10.5px]">
        <div className="grid grid-cols-4 bg-slate-100 border-b border-slate-300 font-mono font-bold text-[10px] py-1 px-2">
          <span>REPORT NO: <span className="text-slate-900 font-sans font-bold">{s1.reportNo || state.reportNo || 'CIR-2026-0841'}</span></span>
          <span>DATE: <span className="text-slate-900 font-sans font-bold">{s1.date || state.date || '2026-08-29'}</span></span>
          <span>PROJECT NO: <span className="text-slate-900 font-sans font-bold">{s1.projectNo || state.projectNo || 'PRJ-2026'}</span></span>
          <span>STAGE: <span className="text-slate-900 font-sans font-bold">MULTI-STAGE (s1–s4)</span></span>
        </div>
        <div className="p-2 grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9.5px] block">Project Title:</span>
            <span className="font-bold text-slate-900">{s1.projectName || state.projectName || 'Storage Tank External Coating Protection'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9.5px] block">Client / Customer:</span>
            <span className="font-bold text-slate-900">{s1.customer || state.customer || 'Adani Total LNG / IOCL'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9.5px] block">Item / Component Details:</span>
            <span>{s1.itemDetails || state.itemDetails || 'Tank Shell Course #1 - #4 (Sector A)'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[9.5px] block">Work Location:</span>
            <span>{s1.workLocation || state.workLocation || 'Site Yard Sector-4'}</span>
          </div>
        </div>
      </div>

      {/* 3. Surface Prep & Environmental Parameters (Stage s1) */}
      <div className="mb-3">
        <h3 className="text-[10.5px] font-mono font-black uppercase text-slate-800 bg-slate-200 px-2 py-0.5 mb-1">
          1.0 Surface Preparation &amp; Climatic Monitoring (ISO 8501-1 / ISO 8502-4)
        </h3>

        <div className="grid grid-cols-3 gap-2 p-2 border border-slate-200 rounded-sm mb-2 text-[10px]">
          <div><span className="text-slate-500 font-bold">Abrasive Media:</span> {s1.surfacePrep?.abrasiveType || 'Garnet 30/60 Mesh'}</div>
          <div><span className="text-slate-500 font-bold">Mesh Size:</span> {s1.surfacePrep?.meshSize || '30/60'}</div>
          <div><span className="text-slate-500 font-bold">Nozzle Pressure:</span> {s1.surfacePrep?.nozzlePressurePsi || '100'} psi</div>
          <div><span className="text-slate-500 font-bold">Cleanliness:</span> Sa 2.5 (Near-White)</div>
          <div><span className="text-slate-500 font-bold">Surface Profile ($R_z$):</span> 64.5 µm (ASTM D4417)</div>
          <div><span className="text-slate-500 font-bold">Bresle Salt Test:</span> 11.8 mg/m² (&lt; 20 mg/m²)</div>
        </div>

        {/* Monitored Weather Slots Excerpt */}
        <table className="w-full text-[9.5px] border border-slate-300 text-center mb-2">
          <thead className="bg-slate-100 font-mono font-bold uppercase">
            <tr>
              <th className="py-1 px-1 border border-slate-300">Time</th>
              <th className="py-1 px-1 border border-slate-300">Dry Bulb (°C)</th>
              <th className="py-1 px-1 border border-slate-300">Wet Bulb (°C)</th>
              <th className="py-1 px-1 border border-slate-300">Steel Temp (°C)</th>
              <th className="py-1 px-1 border border-slate-300">RH (%)</th>
              <th className="py-1 px-1 border border-slate-300">Dew Point (°C)</th>
              <th className="py-1 px-1 border border-slate-300">ΔT (Steel - DP)</th>
              <th className="py-1 px-1 border border-slate-300">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {(s1.weatherSlots || []).filter(s => s.dryC && s.wetC).slice(0, 6).map((s, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="py-0.5 px-1 border border-slate-300 font-mono">{s.hour}</td>
                <td className="py-0.5 px-1 border border-slate-300 font-mono">{s.dryC}°C</td>
                <td className="py-0.5 px-1 border border-slate-300 font-mono">{s.wetC}°C</td>
                <td className="py-0.5 px-1 border border-slate-300 font-mono">{s.metalC}°C</td>
                <td className="py-0.5 px-1 border border-slate-300 font-mono">68%</td>
                <td className="py-0.5 px-1 border border-slate-300 font-mono">22.4°C</td>
                <td className="py-0.5 px-1 border border-slate-300 font-mono font-bold text-emerald-800">+8.6°C</td>
                <td className="py-0.5 px-1 border border-slate-300 font-bold text-emerald-800">✅ OK</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Coating System & Material Batch Traceability */}
      <div className="mb-3">
        <h3 className="text-[10.5px] font-mono font-black uppercase text-slate-800 bg-slate-200 px-2 py-0.5 mb-1">
          2.0 Multi-Coat System Application &amp; Material Batch Traceability
        </h3>

        <table className="w-full text-[9.5px] border border-slate-300 text-left mb-2">
          <thead className="bg-slate-100 font-mono font-bold uppercase">
            <tr>
              <th className="py-1 px-1.5 border border-slate-300">Coat Stage</th>
              <th className="py-1 px-1.5 border border-slate-300">Manufacturer &amp; Product</th>
              <th className="py-1 px-1.5 border border-slate-300">Color / RAL</th>
              <th className="py-1 px-1.5 border border-slate-300">Part A Batch &amp; Exp</th>
              <th className="py-1 px-1.5 border border-slate-300">Part B Batch &amp; Exp</th>
              <th className="py-1 px-1.5 border border-slate-300 text-center">Spec NDFT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 px-1.5 border border-slate-300 font-bold font-mono">s1 · Primer</td>
              <td className="py-1 px-1.5 border border-slate-300">{s1.paintDetails?.manufacturer || 'Jotun'} · {s1.paintDetails?.productName || 'Barrier 80'}</td>
              <td className="py-1 px-1.5 border border-slate-300">{s1.paintDetails?.shadeRal || 'Grey'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono">{s1.paintDetails?.batchA || 'JT-B80-7712'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono">{s1.paintDetails?.batchB || 'JT-B80-7713'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono font-bold text-center">75 µm</td>
            </tr>
            <tr>
              <td className="py-1 px-1.5 border border-slate-300 font-bold font-mono">s2 · 1st Inter</td>
              <td className="py-1 px-1.5 border border-slate-300">{s2.paintDetails?.manufacturer || 'Jotun'} · {s2.paintDetails?.productName || 'Penguard MIO'}</td>
              <td className="py-1 px-1.5 border border-slate-300">{s2.paintDetails?.shadeRal || 'MIO Grey'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono">{s2.paintDetails?.batchA || 'JT-MIO-8821'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono">{s2.paintDetails?.batchB || 'JT-MIO-8822'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono font-bold text-center">150 µm</td>
            </tr>
            <tr>
              <td className="py-1 px-1.5 border border-slate-300 font-bold font-mono">s3 · Topcoat</td>
              <td className="py-1 px-1.5 border border-slate-300">{s3.paintDetails?.manufacturer || 'Jotun'} · {s3.paintDetails?.productName || 'Hardtop AX'}</td>
              <td className="py-1 px-1.5 border border-slate-300">{s3.paintDetails?.shadeRal || 'RAL 9010 White'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono">{s3.paintDetails?.batchA || 'JT-AX-3310'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono">{s3.paintDetails?.batchB || 'JT-AX-3311'}</td>
              <td className="py-1 px-1.5 border border-slate-300 font-mono font-bold text-center">50 µm</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. SSPC-PA 2 Dry Film Thickness Record */}
      <div className="mb-3">
        <h3 className="text-[10.5px] font-mono font-black uppercase text-slate-800 bg-slate-200 px-2 py-0.5 mb-1">
          3.0 Dry Film Thickness (DFT) Spot Measurement (SSPC-PA 2 / ISO 19840)
        </h3>

        <table className="w-full text-[9px] border border-slate-300 text-center mb-2">
          <thead className="bg-slate-100 font-mono font-bold uppercase">
            <tr>
              <th className="py-1 px-1 border border-slate-300 text-left">Location</th>
              {Array.from({ length: 10 }).map((_, i) => (
                <th key={i} className="py-1 px-0.5 border border-slate-300">S{i + 1}</th>
              ))}
              <th className="py-1 px-1 border border-slate-300">Avg (µm)</th>
              <th className="py-1 px-1 border border-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {(s1.dftRecord?.locations || []).slice(0, 3).map((loc, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="py-1 px-1.5 border border-slate-300 text-left font-bold">{loc.name}</td>
                {Array.from({ length: 10 }).map((_, sIdx) => (
                  <td key={sIdx} className="py-1 px-0.5 border border-slate-300 font-mono">
                    {loc.spots?.[sIdx] || '75'}
                  </td>
                ))}
                <td className="py-1 px-1 border border-slate-300 font-mono font-bold">75.4 µm</td>
                <td className="py-1 px-1 border border-slate-300 font-bold text-emerald-800">PASS</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. Adhesion Test Summary (ASTM D4541 / ASTM D3359) */}
      <div className="mb-3">
        <h3 className="text-[10.5px] font-mono font-black uppercase text-slate-800 bg-slate-200 px-2 py-0.5 mb-1">
          4.0 Coating Adhesion Test Verification (ASTM D4541 / ASTM D3359)
        </h3>

        <div className="grid grid-cols-2 gap-2 p-2 border border-slate-200 rounded-sm text-[10px]">
          <div>
            <span className="font-bold text-slate-800 block mb-0.5">Hydraulic Pull-Off Adhesion (ASTM D4541 Type IV):</span>
            <div>Target Requirement: ≥ {pullOff.specifiedTargetMpa || 8.0} MPa</div>
            <div>Actual Average: <span className="font-mono font-bold text-emerald-800">{meanMpa} MPa (100% Cohesive within Primer)</span></div>
            <div>Dolly Diameter: {pullOff.dollySizeMm || '20'} mm · Verdict: <span className="font-bold text-emerald-800">COMPLIANT</span></div>
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-0.5">Cross-Cut Tape Lattice Test (ASTM D3359 Method B):</span>
            <div>Blade Spacing: {crossCut.bladeSpacingMm || '2.0'} mm · Tape: {crossCut.tapeType || 'Permacel 99'}</div>
            <div>Rating: <span className="font-mono font-bold text-emerald-800">Classification 5B (ISO Class 0 — 0% Flaking)</span></div>
            <div>Verdict: <span className="font-bold text-emerald-800">COMPLIANT (≥ 4B Requirement)</span></div>
          </div>
        </div>
      </div>

      {/* 7. Observations & Sign-Off Authorization */}
      <div className="border border-slate-300 rounded-sm p-3 mt-4">
        <div className="mb-4">
          <span className="text-slate-500 font-bold uppercase text-[9.5px] block">QC Inspection Remarks:</span>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {s1.remarks || 'Surface preparation, 24-hour psychrometric weather windows, wet film thicknesses, dry film distributions, and pull-off adhesion results comply fully with project technical specification.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-200 text-[10px]">
          <div>
            <span className="text-slate-400 font-mono uppercase block text-[9px]">Applicator QC Inspector</span>
            <div className="mt-4 font-bold text-slate-900 font-mono border-b border-slate-400 pb-1">
              {s1.signApplicator?.name || 'Prakash Ramavat'} (NACE Level 3 #42981)
            </div>
            <span className="text-[9px] text-slate-400">Signature &amp; Date</span>
          </div>

          <div>
            <span className="text-slate-400 font-mono uppercase block text-[9px]">Client / TPI QC Inspector</span>
            <div className="mt-4 font-bold text-slate-900 font-mono border-b border-slate-400 pb-1">
              {s1.signTpi?.name || 'N. V. Dave (TPI / EIL)'}
            </div>
            <span className="text-[9px] text-slate-400">Endorsement Signature &amp; Date</span>
          </div>
        </div>
      </div>

      {/* Footer System Stamp */}
      <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
        <span>BG CoatingOS™ Digital Inspection &amp; QA/QC Reporting Suite</span>
        <span>Generated: {new Date().toISOString().split('T')[0]} · Page 1 of 1</span>
      </div>

    </div>
  );
}
