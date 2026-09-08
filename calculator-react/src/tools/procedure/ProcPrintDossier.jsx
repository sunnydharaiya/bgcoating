import React from 'react';

export default function ProcPrintDossier({ state, companyProfile, watermarkSettings }) {
  const compName = companyProfile?.name || 'BG COATING & CORROSION ENGINEERING';
  const compAddress = companyProfile?.address || 'Industrial Zone, Engineering Hub';
  const compContact = companyProfile?.contact || 'info@bgcoating.com | www.bgcoating.com';
  const compLogo = companyProfile?.logo || null;

  const wmText = watermarkSettings?.text || compName;
  const wmOpacity = watermarkSettings?.opacity ?? 0.08;
  const wmRotation = watermarkSettings?.rotation ?? -30;
  const showWatermark = watermarkSettings?.enabled ?? true;

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:p-0 print:bg-white text-gray-900 font-sans">
      {/* Floating Screen Print Bar (hidden in print) */}
      <div className="max-w-[210mm] mx-auto mb-6 bg-[#1E2530] text-white p-4 rounded-xl shadow-lg flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <span className="text-amber-400">🖨️</span> Print Technical Procedure Dossier
          </h2>
          <p className="text-xs text-gray-300">Generated client-ready engineering procedure specification formatted for A4 physical print and PDF export.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow-md transition"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      {/* A4 Document Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none print:w-full border border-gray-200 print:border-none relative">
        
        {/* Repeating Dynamic Watermark Layer */}
        {showWatermark && (
          <div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden print:absolute"
            style={{
              opacity: wmOpacity,
              transform: `rotate(${wmRotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <span className="text-6xl md:text-7xl font-black tracking-widest text-gray-900 uppercase select-none text-center whitespace-nowrap">
              {wmText}
            </span>
          </div>
        )}

        {/* ================= PAGE 1: FORMAL COVER SHEET ================= */}
        <div className="min-h-[297mm] p-12 flex flex-col justify-between border-b-2 border-gray-200 print:border-none print:break-after-page relative bg-white">
          
          {/* Header Brand */}
          <div className="flex items-center justify-between border-b-2 border-red-700 pb-4">
            <div className="flex items-center gap-3">
              {compLogo ? (
                <img src={compLogo} alt="Logo" className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  BG
                </div>
              )}
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-gray-900 uppercase">{compName}</h1>
                <p className="text-[10px] text-gray-500">{compAddress} · {compContact}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded">
                {state.docNo || 'DOC-PROC-001'}
              </span>
              <div className="text-[10px] text-gray-500 font-mono mt-1">Rev: {state.revNo || '0'}</div>
            </div>
          </div>

          {/* Title Box */}
          <div className="my-auto py-12 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              TECHNICAL METHOD STATEMENT & SPECIFICATION
            </span>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight max-w-xl mx-auto leading-tight">
              {state.docTitle || 'Painting Procedure & Coating Specification'}
            </h2>
            <div className="w-24 h-1 bg-red-700 mx-auto rounded-full mt-3"></div>
            
            <div className="max-w-lg mx-auto bg-gray-50 border border-gray-200 rounded-xl p-6 text-left space-y-3 mt-8">
              <div className="grid grid-cols-3 text-xs">
                <span className="text-gray-500 font-semibold">Project Name:</span>
                <span className="col-span-2 font-bold text-gray-900">{state.projectName || '—'}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-gray-500 font-semibold">Client / Owner:</span>
                <span className="col-span-2 font-bold text-gray-900">{state.clientName || '—'}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-gray-500 font-semibold">Contractor:</span>
                <span className="col-span-2 font-bold text-gray-900">{state.contractorName || compName}</span>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-gray-500 font-semibold">Battery Limit:</span>
                <span className="col-span-2 font-semibold text-gray-700">{state.shopSite || 'Shop & Field'}</span>
              </div>
            </div>
          </div>

          {/* Signatures Block */}
          <div className="border border-gray-300 rounded-lg overflow-hidden text-xs">
            <div className="bg-[#1E2530] text-white py-2 px-3 font-bold text-[11px] uppercase tracking-wider">
              Document Authorization & Approvals
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-300 bg-white">
              <div className="p-3 space-y-6">
                <div className="text-[10px] uppercase font-bold text-gray-500">Prepared By (QA/QC)</div>
                <div className="font-bold text-gray-900">{state.preparedBy || '—'}</div>
                <div className="text-[10px] text-gray-400 border-t border-gray-200 pt-1">Sign & Date</div>
              </div>
              <div className="p-3 space-y-6">
                <div className="text-[10px] uppercase font-bold text-gray-500">Reviewed By (Lead QC)</div>
                <div className="font-bold text-gray-900">{state.reviewedBy || '—'}</div>
                <div className="text-[10px] text-gray-400 border-t border-gray-200 pt-1">Sign & Date</div>
              </div>
              <div className="p-3 space-y-6">
                <div className="text-[10px] uppercase font-bold text-gray-500">Approved By (Client)</div>
                <div className="font-bold text-gray-900">{state.approvedBy || '—'}</div>
                <div className="text-[10px] text-gray-400 border-t border-gray-200 pt-1">Sign & Date</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAGE 2: TABLE OF CONTENTS & SECTIONS ================= */}
        <div className="min-h-[297mm] p-12 space-y-8 border-b-2 border-gray-200 print:border-none print:break-after-page bg-white">
          
          {/* Running Header */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-gray-200 pb-2">
            <span>{state.docTitle || 'Painting Procedure'}</span>
            <span className="font-mono">{state.docNo} | Rev {state.revNo}</span>
          </div>

          {/* Section 1: Revision Control */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              1.0 Revision Control History
            </h3>
            <table className="w-full text-[11px] border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-1 px-2 text-left w-12">Rev</th>
                  <th className="py-1 px-2 text-left w-24">Date</th>
                  <th className="py-1 px-2 text-left">Description</th>
                  <th className="py-1 px-2 text-center w-20">Prep</th>
                  <th className="py-1 px-2 text-center w-20">Chk</th>
                  <th className="py-1 px-2 text-center w-20">App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(state.revisionHistory || []).map((r, i) => (
                  <tr key={i}>
                    <td className="p-1.5 font-bold font-mono text-center">{r.rev}</td>
                    <td className="p-1.5">{r.date}</td>
                    <td className="p-1.5">{r.desc}</td>
                    <td className="p-1.5 text-center">{r.prep}</td>
                    <td className="p-1.5 text-center">{r.chk}</td>
                    <td className="p-1.5 text-center">{r.app}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Scope */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              2.0 Purpose & Scope of Work
            </h3>
            <p className="text-xs text-gray-800 leading-relaxed">{state.purpose}</p>
            <p className="text-xs text-gray-700 mt-2"><strong>Substrates in Scope:</strong> {state.scopeSubstrates}</p>
          </div>

          {/* Section 3: Reference Documents */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              3.0 Project Reference Documents
            </h3>
            <table className="w-full text-[11px] border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-1 px-2 text-left w-8">#</th>
                  <th className="py-1 px-2 text-left">Document Title</th>
                  <th className="py-1 px-2 text-left w-36">Document No</th>
                  <th className="py-1 px-2 text-center w-12">Rev</th>
                  <th className="py-1 px-2 text-left w-24">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(state.refDocs || []).map((d, i) => (
                  <tr key={i}>
                    <td className="p-1.5 text-center font-mono">{i + 1}</td>
                    <td className="p-1.5 font-semibold text-gray-800">{d.title}</td>
                    <td className="p-1.5 font-mono">{d.docNo || '—'}</td>
                    <td className="p-1.5 text-center">{d.rev || '0'}</td>
                    <td className="p-1.5">{d.source || 'Project'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Standards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              4.0 Applicable Coating Standards
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(state.selectedStandards || []).map((code, i) => (
                <span key={i} className="text-[10px] font-mono font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-300">
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PAGE 3: TECHNICAL METHODOLOGY ================= */}
        <div className="min-h-[297mm] p-12 space-y-6 border-b-2 border-gray-200 print:border-none print:break-after-page bg-white">
          
          {/* Running Header */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-gray-200 pb-2">
            <span>{state.docTitle || 'Painting Procedure'}</span>
            <span className="font-mono">{state.docNo} | Rev {state.revNo}</span>
          </div>

          {/* Section 5: Exclusions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              5.0 Blasting & Coating Exclusions
            </h3>
            <table className="w-full text-[11px] border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-1 px-2 text-left w-52">Excluded Component</th>
                  <th className="py-1 px-2 text-left">Protection Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(state.exclusions || []).slice(0, 8).map((ex, i) => (
                  <tr key={i}>
                    <td className="p-1.5 font-bold text-gray-800">{ex.item}</td>
                    <td className="p-1.5 text-gray-600">{ex.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 6: Safety */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              6.0 Health, Safety & Environmental (HSE) Requirements
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              <li>Abrasive media free silica content ≤ 1.0%; dead-man control valves fitted to all blast nozzles.</li>
              <li>Explosion-proof ATEX lighting and continuous forced ventilation in confined spaces maintaining solvent &lt; 10% LEL.</li>
              <li>100% electrical grounding of blast pots, compressors, spray pumps, and hoses to dissipate static charge.</li>
            </ul>
          </div>

          {/* Section 7: Surface Prep */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              7.0 Surface Preparation Technical Parameters
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded border border-gray-200">
              <div><strong>Method:</strong> {state.surfacePrepMethod}</div>
              <div><strong>Standard:</strong> {state.surfacePrepStd}</div>
              <div><strong>Profile Depth:</strong> {state.profileMin} – {state.profileMax} µm</div>
              <div><strong>Max Soluble Salt:</strong> ≤ {state.saltLimit} mg/m²</div>
              <div><strong>Abrasive Type:</strong> {state.abrasiveType}</div>
              <div><strong>Max Holding Time:</strong> {state.holdingTimeHours} Hours</div>
            </div>
          </div>

          {/* Section 8: Application */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              8.0 Coating Application & Environmental Envelope
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded border border-gray-200">
              <div><strong>Ambient Temp:</strong> {state.tempMin}°C to {state.tempMax}°C</div>
              <div><strong>Max Relative Humidity:</strong> ≤ {state.rhMax}%</div>
              <div><strong>Dew Point Delta:</strong> Steel Temp ≥ DP + {state.dewPointDelta}°C</div>
              <div><strong>Application Method:</strong> {state.appMethodPrimary}</div>
              <div><strong>DFT Conformance:</strong> {state.dftStandard}</div>
              <div><strong>Stripe Coating:</strong> {state.stripeCoatMethod}</div>
            </div>
          </div>

          {/* Section 9: Repair */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 pb-1 border-b border-red-700 mb-2">
              9.0 Coating Defect Repair Procedure
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Defective areas prepared to bare metal (ISO Sa 2½ or SSPC-SP11). Sound coating feathered to {state.featheringWidth}. {state.repairAdhesionReq}.
            </p>
          </div>
        </div>

        {/* ================= PAGE 4: ANNEXURE I COATING SYSTEMS ================= */}
        <div className="min-h-[297mm] p-12 space-y-6 border-b-2 border-gray-200 print:border-none print:break-after-page bg-white">
          
          {/* Running Header */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-gray-200 pb-2">
            <span>ANNEXURE I · COATING SYSTEMS SCHEDULE</span>
            <span className="font-mono">{state.docNo} | Rev {state.revNo}</span>
          </div>

          <h3 className="text-sm font-extrabold uppercase tracking-wider text-red-700 pb-1 border-b-2 border-red-700">
            Annexure-I: Coating Systems Specification
          </h3>

          {(state.coatingSystems || []).map((sys, sIdx) => (
            <div key={sIdx} className="border border-gray-300 rounded-lg overflow-hidden text-xs">
              <div className="bg-[#1E2530] text-white p-2.5 flex justify-between items-center font-bold">
                <span>{sys.systemId} — {sys.serviceDesc}</span>
                <span className="text-amber-400 font-mono">Total Nom DFT: {sys.totalDftNom} µm</span>
              </div>
              <div className="p-2 bg-gray-50 border-b border-gray-200 text-[11px] grid grid-cols-2 gap-2">
                <div><strong>Surface Prep:</strong> {sys.surfacePrep}</div>
                <div><strong>Substrate:</strong> {sys.substrate} ({sys.operatingTemp})</div>
              </div>
              <table className="w-full text-[11px]">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-1.5 px-2 text-center w-10">Coat</th>
                    <th className="py-1.5 px-2 text-left">Generic Paint Type</th>
                    <th className="py-1.5 px-2 text-center w-16">Min DFT</th>
                    <th className="py-1.5 px-2 text-center w-16">Nom DFT</th>
                    <th className="py-1.5 px-2 text-center w-16">Max DFT</th>
                    <th className="py-1.5 px-2 text-left w-32">Thinner</th>
                    <th className="py-1.5 px-2 text-left w-24">Min Recoat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(sys.coats || []).map((c, cIdx) => (
                    <tr key={cIdx}>
                      <td className="p-1.5 text-center font-bold text-red-700">{c.coatNo}</td>
                      <td className="p-1.5 font-semibold text-gray-800">{c.genericType}</td>
                      <td className="p-1.5 text-center font-mono">{c.dftMin} µm</td>
                      <td className="p-1.5 text-center font-mono font-bold text-red-700">{c.dftNom} µm</td>
                      <td className="p-1.5 text-center font-mono">{c.dftMax} µm</td>
                      <td className="p-1.5">{c.thinner}</td>
                      <td className="p-1.5">{c.recoatMin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Section 10 Approved Manufacturers */}
          <div className="pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
              Approved Coating Manufacturers:
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {(state.selectedManufacturers || []).map((mfr, i) => (
                <span key={i} className="px-2.5 py-1 bg-gray-100 border border-gray-300 font-semibold rounded text-gray-800">
                  {mfr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PAGE 5: ANNEXURE II INSPECTION INSTRUMENTS ================= */}
        <div className="min-h-[297mm] p-12 space-y-6 bg-white">
          
          {/* Running Header */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-gray-200 pb-2">
            <span>ANNEXURE II · INSPECTION INSTRUMENTS MATRIX</span>
            <span className="font-mono">{state.docNo} | Rev {state.revNo}</span>
          </div>

          <h3 className="text-sm font-extrabold uppercase tracking-wider text-red-700 pb-1 border-b-2 border-red-700">
            Annexure-II: Inspection Instruments & Test Matrix
          </h3>

          <table className="w-full text-[11px] border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-1.5 px-2 text-center w-8">#</th>
                <th className="py-1.5 px-2 text-left w-48">Activity / Parameter</th>
                <th className="py-1.5 px-2 text-left w-52">Testing Instrument</th>
                <th className="py-1.5 px-2 text-left w-36">Test Standard</th>
                <th className="py-1.5 px-2 text-left">Acceptance Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(state.inspectionInstruments || []).map((row, i) => (
                <tr key={i}>
                  <td className="p-1.5 text-center font-mono font-bold text-gray-400">{i + 1}</td>
                  <td className="p-1.5 font-semibold text-gray-800">{row.activity}</td>
                  <td className="p-1.5 text-gray-700">{row.instr}</td>
                  <td className="p-1.5 font-mono text-gray-600">{row.std}</td>
                  <td className="p-1.5 text-gray-700">{row.accept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
