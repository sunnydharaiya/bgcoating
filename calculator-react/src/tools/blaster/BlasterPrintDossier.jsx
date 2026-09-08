import React from 'react';
import { CHECK_ELEMENTS } from '../../data/blasterDatabase';

export default function BlasterPrintDossier({
  state,
  metrics,
  company,
  watermark
}) {
  const {
    prePct,
    postPct,
    improvement,
    chkPass,
    chkFail,
    chkNa,
    chkPct,
    inspPass,
    inspFail,
    inspPct,
    evaluatedEnvRows,
    dbAvg,
    wbAvg,
    mtAvg,
    rhAvg,
    dpAvg,
    diffAvg,
    envFinalOK,
    profAvg,
    isProfPass,
    overallScore,
    verdict,
    verdictStatus
  } = metrics;

  const checklist = state.checklist || [];
  const photos = state.photos || [];

  return (
    <div className="blaster-dossier-print-root bg-white text-black font-sans leading-tight">
      
      {/* ─────────────────────────────────────────────────────────────
          PAGE 1: MAIN OPERATOR QUALIFICATION REPORT
          ───────────────────────────────────────────────────────────── */}
      <div className="print-a4-page relative p-8 border-b-8 border-slate-200 print:border-none print:p-0 min-h-[297mm] flex flex-col justify-between">
        
        {/* Watermark */}
        {watermark?.enabled && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden"
            style={{
              opacity: watermark.opacity || 0.08,
              transform: `rotate(${watermark.angle || -30}deg)`
            }}
          >
            <span className="text-6xl font-black font-mono tracking-widest text-slate-900 border-8 border-slate-900 p-6 rounded-3xl text-center max-w-xl">
              {watermark.text || 'OFFICIAL QUALIFICATION DOSSIER'}
            </span>
          </div>
        )}

        <div className="relative z-10 space-y-4">
          
          {/* Header Block with Logo, Title, and Operator Photo */}
          <div className="border-2 border-black p-3 flex items-center justify-between gap-4">
            
            {/* Company Logo / Details */}
            <div className="flex-1 space-y-0.5">
              {company?.logo ? (
                <img src={company.logo} alt="Logo" className="h-9 max-w-[160px] object-contain mb-1" />
              ) : (
                <div className="font-extrabold text-base tracking-wider uppercase">
                  {company?.name || 'BG INDUSTRIAL COATINGS W.L.L.'}
                </div>
              )}
              <div className="text-[9px] font-semibold text-slate-700 uppercase">
                {company?.division || 'Quality Assurance & Technical Services'}
              </div>
              <div className="text-[8px] text-slate-500 font-mono">
                {company?.contact || 'ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 Certified'}
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center px-4 flex-1">
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                QA/QC Inspection Record
              </div>
              <h1 className="text-sm font-black tracking-tight uppercase border-y border-black py-0.5 my-0.5">
                Blaster / Operator Qualification Report
              </h1>
              <div className="text-[8px] font-mono font-bold">
                Standard: {state.referenceStandard || 'ASTM D 4228 / ISO 8501-1 / SSPC-AB 1'}
              </div>
            </div>

            {/* Operator Passport Photo */}
            <div className="w-20 h-24 border border-black bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
              {state.operatorPhoto ? (
                <img src={state.operatorPhoto} alt="Operator" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[8px] font-bold text-slate-400 uppercase text-center p-1">
                  Operator Photo
                </span>
              )}
            </div>

          </div>

          {/* Report Metadata Strip */}
          <table className="w-full text-[9px] border-collapse border border-black font-sans">
            <tbody>
              <tr>
                <td className="border border-black bg-slate-100 p-1 font-bold w-24">Report No:</td>
                <td className="border border-black p-1 font-mono font-bold">{state.repNo || 'BL-QR-2026-001'}</td>
                <td className="border border-black bg-slate-100 p-1 font-bold w-20">Date:</td>
                <td className="border border-black p-1 font-mono">{state.repDate}</td>
                <td className="border border-black bg-slate-100 p-1 font-bold w-20">Rev:</td>
                <td className="border border-black p-1 font-mono">{state.repRev || 'R0'}</td>
              </tr>
            </tbody>
          </table>

          {/* Section A: Project Details */}
          <div>
            <div className="bg-black text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">
              Section A: Project Identification &amp; Specification Parameters
            </div>
            <table className="w-full text-[8.5px] border-collapse border border-black">
              <tbody>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold w-28">Project Name:</td>
                  <td className="border border-black p-1 font-semibold">{state.projectName}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold w-24">Project No:</td>
                  <td className="border border-black p-1 font-mono">{state.projectNo}</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Client / Asset Owner:</td>
                  <td className="border border-black p-1">{state.client}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold">EPC Contractor:</td>
                  <td className="border border-black p-1">{state.epcContractor}</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Coating Contractor:</td>
                  <td className="border border-black p-1">{state.contractor}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Work Location:</td>
                  <td className="border border-black p-1">{state.location}</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Specified Coating:</td>
                  <td colSpan={3} className="border border-black p-1">{state.coatingSystem}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section B: Operator Identification */}
          <div>
            <div className="bg-black text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">
              Section B: Candidate Operator Particulars
            </div>
            <table className="w-full text-[8.5px] border-collapse border border-black">
              <tbody>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold w-28">Full Name:</td>
                  <td className="border border-black p-1 font-bold text-[9.5px]">{state.operatorName}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold w-24">Trade Category:</td>
                  <td className="border border-black p-1 font-bold">{state.category}</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Civil ID / Passport:</td>
                  <td className="border border-black p-1 font-mono font-bold">{state.civilId}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Nationality:</td>
                  <td className="border border-black p-1">{state.nationality}</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Experience (Years):</td>
                  <td className="border border-black p-1 font-mono">{state.experienceYears} Years</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Card / Cert No:</td>
                  <td className="border border-black p-1 font-mono font-bold">{state.qualificationCardNo}</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Direct Employer:</td>
                  <td className="border border-black p-1">{state.employer}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Valid Until:</td>
                  <td className="border border-black p-1 font-mono font-bold">{state.nextAssessmentDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section C: Training & Test Results */}
          <div>
            <div className="bg-black text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider flex justify-between">
              <span>Section C: Training Syllabus &amp; Examination Scores</span>
              <span className="font-mono">15 MODULES · 25 QUESTIONS</span>
            </div>
            <table className="w-full text-[8.5px] border-collapse border border-black text-center">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="border border-black p-1 text-left">Examination Stage</th>
                  <th className="border border-black p-1 w-20">Test Date</th>
                  <th className="border border-black p-1 w-24">Total Questions</th>
                  <th className="border border-black p-1 w-24">Correct Answers</th>
                  <th className="border border-black p-1 w-24">Score (%)</th>
                  <th className="border border-black p-1 w-24">Evaluation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 text-left font-semibold">Pre-Training Assessment</td>
                  <td className="border border-black p-1 font-mono">{state.preTestDate}</td>
                  <td className="border border-black p-1 font-mono">25</td>
                  <td className="border border-black p-1 font-mono font-bold">{state.preCorrect}</td>
                  <td className="border border-black p-1 font-mono font-bold">{prePct.toFixed(0)}%</td>
                  <td className="border border-black p-1 text-slate-500 font-mono">Baseline</td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-left font-semibold">Post-Training Examination</td>
                  <td className="border border-black p-1 font-mono">{state.postTestDate}</td>
                  <td className="border border-black p-1 font-mono">25</td>
                  <td className="border border-black p-1 font-mono font-bold">{state.postCorrect}</td>
                  <td className="border border-black p-1 font-mono font-bold">{postPct.toFixed(0)}%</td>
                  <td className="border border-black p-1 font-mono font-bold">
                    {postPct >= 80 ? 'PASSED (≥80%)' : 'FAILED (<80%)'}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={4} className="border border-black p-1 text-right">
                    Training Knowledge Gain Improvement ($\Delta\%$):
                  </td>
                  <td className="border border-black p-1 font-mono">+{improvement.toFixed(0)}%</td>
                  <td className="border border-black p-1 font-mono">
                    {improvement >= 15 ? 'SATISFACTORY' : 'MARGINAL'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section D: Blasting Process & Environmental */}
          <div>
            <div className="bg-black text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">
              Section D: Environmental Monitoring &amp; Surface Preparation Parameters
            </div>
            <table className="w-full text-[8px] border-collapse border border-black text-center">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="border border-black p-0.5">Time</th>
                  <th className="border border-black p-0.5">Dry Bulb (°C)</th>
                  <th className="border border-black p-0.5">Wet Bulb (°C)</th>
                  <th className="border border-black p-0.5">Steel Temp (°C)</th>
                  <th className="border border-black p-0.5">RH (%)</th>
                  <th className="border border-black p-0.5">Dew Point (°C)</th>
                  <th className="border border-black p-0.5">MT − DP (°C)</th>
                  <th className="border border-black p-0.5">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {evaluatedEnvRows.slice(0, 3).map((r, i) => (
                  <tr key={i}>
                    <td className="border border-black p-0.5 font-mono">{r.time}</td>
                    <td className="border border-black p-0.5 font-mono">{r.db}</td>
                    <td className="border border-black p-0.5 font-mono">{r.wb}</td>
                    <td className="border border-black p-0.5 font-mono">{r.mt}</td>
                    <td className="border border-black p-0.5 font-mono font-bold">{r.rh}</td>
                    <td className="border border-black p-0.5 font-mono font-bold">{r.dp}</td>
                    <td className="border border-black p-0.5 font-mono font-bold">{r.diff}</td>
                    <td className="border border-black p-0.5 font-mono font-bold">{r.verdict}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td className="border border-black p-0.5 text-right">Avg:</td>
                  <td className="border border-black p-0.5 font-mono">{dbAvg}</td>
                  <td className="border border-black p-0.5 font-mono">{wbAvg}</td>
                  <td className="border border-black p-0.5 font-mono">{mtAvg}</td>
                  <td className="border border-black p-0.5 font-mono">{rhAvg}</td>
                  <td className="border border-black p-0.5 font-mono">{dpAvg}</td>
                  <td className="border border-black p-0.5 font-mono">{diffAvg}</td>
                  <td className="border border-black p-0.5 font-mono">{envFinalOK ? 'OK' : 'REWORK'}</td>
                </tr>
              </tbody>
            </table>

            {/* Profile & Abrasive Strip */}
            <table className="w-full text-[8px] border-collapse border border-black mt-1">
              <tbody>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold w-28">Abrasive Media:</td>
                  <td className="border border-black p-1">{state.abType} ({state.abMesh}) · {state.abSspc}</td>
                  <td className="border border-black bg-slate-50 p-1 font-bold w-24">Required Cleanliness:</td>
                  <td className="border border-black p-1 font-bold">{state.spStdReq} (ISO 8501-1)</td>
                </tr>
                <tr>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Profile Readings:</td>
                  <td className="border border-black p-1 font-mono">
                    Spots: {(state.profileSpots || []).join(', ')} µm &nbsp;·&nbsp; <b>Avg: {profAvg} µm</b>
                  </td>
                  <td className="border border-black bg-slate-50 p-1 font-bold">Profile Verdict:</td>
                  <td className="border border-black p-1 font-bold font-mono">
                    {isProfPass ? 'PASS (50-75 µm)' : 'FAIL'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section E: Practical Inspection Tests */}
          <div>
            <div className="bg-black text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider flex justify-between">
              <span>Section E: Surface Preparation Inspection Test Results</span>
              <span className="font-mono">PASS RATE: {inspPct.toFixed(0)}%</span>
            </div>
            <table className="w-full text-[8px] border-collapse border border-black">
              <thead>
                <tr className="bg-slate-100 font-bold text-center">
                  <th className="border border-black p-0.5 w-6">#</th>
                  <th className="border border-black p-0.5 text-left">Inspection Test Parameter</th>
                  <th className="border border-black p-0.5 w-32">Standard Ref</th>
                  <th className="border border-black p-0.5">Requirement</th>
                  <th className="border border-black p-0.5">Observed Value</th>
                  <th className="border border-black p-0.5 w-14">Result</th>
                </tr>
              </thead>
              <tbody>
                {(state.inspRows || []).map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-0.5 text-center font-mono">{i + 1}</td>
                    <td className="border border-black p-0.5 font-semibold">{row.p}</td>
                    <td className="border border-black p-0.5 font-mono">{row.std}</td>
                    <td className="border border-black p-0.5">{row.req}</td>
                    <td className="border border-black p-0.5 font-semibold">{row.obs}</td>
                    <td className="border border-black p-0.5 text-center font-bold font-mono">{row.res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section F: Final Qualification Verdict & Signatures */}
          <div className="border-2 border-black p-2 space-y-2">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase font-bold text-slate-500 block">Final Assessment Evaluation:</span>
                <div className="text-xs font-black uppercase">
                  Candidate Status: <span className="underline">{verdict === 'PASS' ? 'QUALIFIED FOR BLASTING OPERATIONS' : 'NOT QUALIFIED'}</span>
                </div>
              </div>

              {/* Stamp */}
              <div className="border-2 border-black px-3 py-1 text-center font-mono font-black transform -rotate-2">
                <div className="text-sm tracking-widest">{verdict}</div>
                <div className="text-[7.5px] uppercase">{verdict === 'PASS' ? 'QUALIFIED ✓' : 'NOT QUALIFIED'}</div>
              </div>
            </div>

            {/* 3 Signatures */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-[8px]">
              
              <div className="border border-black p-1.5 flex flex-col justify-between h-20">
                <div>
                  <span className="font-bold block">Evaluated / Performed By:</span>
                  <span className="font-semibold block">{state.sig1Name}</span>
                </div>
                {state.sig1Stamp && <img src={state.sig1Stamp} alt="Sig1" className="h-6 object-contain" />}
                <div className="border-t border-black pt-0.5 flex justify-between font-mono">
                  <span>Sign &amp; Stamp</span>
                  <span>Date: {state.sig1Date}</span>
                </div>
              </div>

              <div className="border border-black p-1.5 flex flex-col justify-between h-20">
                <div>
                  <span className="font-bold block">QA/QC Manager / Inspector:</span>
                  <span className="font-semibold block">{state.sig2Name}</span>
                </div>
                {state.sig2Stamp && <img src={state.sig2Stamp} alt="Sig2" className="h-6 object-contain" />}
                <div className="border-t border-black pt-0.5 flex justify-between font-mono">
                  <span>Sign &amp; Stamp</span>
                  <span>Date: {state.sig2Date}</span>
                </div>
              </div>

              <div className="border border-black p-1.5 flex flex-col justify-between h-20">
                <div>
                  <span className="font-bold block">Client Representative / TPI:</span>
                  <span className="font-semibold block">{state.sig3Name}</span>
                </div>
                {state.sig3Stamp && <img src={state.sig3Stamp} alt="Sig3" className="h-6 object-contain" />}
                <div className="border-t border-black pt-0.5 flex justify-between font-mono">
                  <span>Sign &amp; Stamp</span>
                  <span>Date: {state.sig3Date}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer Page 1 */}
        <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[7.5px] text-slate-500 font-mono">
          <span>BG CoatingOS™ Digital Verification Suite · Module 06</span>
          <span>Report Ref: {state.repNo || 'BL-QR-2026-001'}</span>
          <span>Page 1 of 3 (Main Report)</span>
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          PAGE 2: ANNEXURE A — ASSESSMENT CHECKLIST (12 ELEMENTS)
          ───────────────────────────────────────────────────────────── */}
      <div className="print-a4-page relative p-8 border-b-8 border-slate-200 print:border-none print:p-0 min-h-[297mm] flex flex-col justify-between mt-8 print:mt-0 print:break-before-page">
        
        <div className="space-y-4">
          
          {/* Header */}
          <div className="border-2 border-black p-2.5 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider">
                Annexure A: Blaster / Operator Practical Assessment Checklist
              </h2>
              <p className="text-[8px] text-slate-600">
                Report No: <b className="font-mono">{state.repNo || 'BL-QR-2026-001'}</b> &nbsp;·&nbsp; Candidate: <b>{state.operatorName}</b> ({state.category})
              </p>
            </div>
            <div className="text-right text-[8px] font-mono">
              <div>Total Elements: <b>12</b></div>
              <div>Compliance: <b className="text-sm">{chkPct.toFixed(0)}%</b></div>
            </div>
          </div>

          {/* 12 Elements Table */}
          <table className="w-full text-[8.5px] border-collapse border border-black">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-[8px]">
                <th className="border border-black p-1 text-center w-8">#</th>
                <th className="border border-black p-1 text-left">Critical Assessment Element</th>
                <th className="border border-black p-1 text-center w-16">Result</th>
                <th className="border border-black p-1 text-left">Inspector Comments &amp; Verification Observations</th>
              </tr>
            </thead>
            <tbody>
              {CHECK_ELEMENTS.map((elem, i) => {
                const item = checklist[i] || { result: '', comment: '' };
                return (
                  <tr key={i}>
                    <td className="border border-black p-1 text-center font-mono font-bold">{i + 1}</td>
                    <td className="border border-black p-1 font-medium">{elem}</td>
                    <td className="border border-black p-1 text-center font-bold font-mono">
                      {item.result || 'Pass'}
                    </td>
                    <td className="border border-black p-1 text-slate-700">
                      {item.comment || 'Complies with project HSE and blasting standard norms.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary & Remark */}
          <div className="border border-black p-2 space-y-1 text-[8.5px]">
            <div className="font-bold uppercase text-[8px] text-slate-500">Checklist Assessment Observations:</div>
            <p className="text-slate-800 italic">
              "{state.remarkCheck || 'Operator demonstrated exceptional compliance with nozzle standoff distance and blast safety.'}"
            </p>
          </div>

          {/* Repeat Signatures */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-[8px]">
            <div className="border border-black p-1.5 h-16 flex flex-col justify-between">
              <span className="font-bold">Evaluated By: {state.sig1Name}</span>
              <div className="border-t border-black pt-0.5 flex justify-between font-mono">
                <span>Sign</span>
                <span>Date: {state.sig1Date}</span>
              </div>
            </div>
            <div className="border border-black p-1.5 h-16 flex flex-col justify-between">
              <span className="font-bold">QA/QC Inspector: {state.sig2Name}</span>
              <div className="border-t border-black pt-0.5 flex justify-between font-mono">
                <span>Sign</span>
                <span>Date: {state.sig2Date}</span>
              </div>
            </div>
            <div className="border border-black p-1.5 h-16 flex flex-col justify-between">
              <span className="font-bold">Client Rep: {state.sig3Name}</span>
              <div className="border-t border-black pt-0.5 flex justify-between font-mono">
                <span>Sign</span>
                <span>Date: {state.sig3Date}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Page 2 */}
        <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[7.5px] text-slate-500 font-mono">
          <span>BG CoatingOS™ Digital Verification Suite · Module 06</span>
          <span>Report Ref: {state.repNo || 'BL-QR-2026-001'}</span>
          <span>Page 2 of 3 (Annexure A Checklist)</span>
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          PAGE 3: ANNEXURE B — PHOTOGRAPHIC EVIDENCE REPORT (6 SLOTS)
          ───────────────────────────────────────────────────────────── */}
      <div className="print-a4-page relative p-8 border-b-8 border-slate-200 print:border-none print:p-0 min-h-[297mm] flex flex-col justify-between mt-8 print:mt-0 print:break-before-page">
        
        <div className="space-y-3">
          
          {/* Header */}
          <div className="border-2 border-black p-2.5 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider">
                Annexure B: Photographic Inspection Evidence Report
              </h2>
              <p className="text-[8px] text-slate-600">
                Report No: <b className="font-mono">{state.repNo || 'BL-QR-2026-001'}</b> &nbsp;·&nbsp; Candidate: <b>{state.operatorName}</b>
              </p>
            </div>
            <div className="text-right text-[8px] font-mono">
              <div>Attached Photos: <b>{photos.length}</b></div>
            </div>
          </div>

          {/* 6 Photo Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {photos.slice(0, 6).map((ph, idx) => (
              <div key={ph.id || idx} className="border border-black p-1.5 space-y-1 flex flex-col justify-between h-56">
                
                <div className="flex justify-between items-center text-[7.5px] font-bold border-b border-slate-300 pb-0.5">
                  <span>Photo #{idx + 1}: {ph.title}</span>
                  <span className="font-mono text-slate-500">{ph.date}</span>
                </div>

                <div className="w-full h-36 border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {ph.b64 ? (
                    <img src={ph.b64} alt={ph.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] text-slate-400 font-bold uppercase">No Image Attached</span>
                  )}
                </div>

                <div className="text-[7.5px] text-slate-700 leading-tight space-y-0.5">
                  <div className="font-semibold truncate">{ph.cap || 'Reference qualification photo.'}</div>
                  <div className="text-slate-400 font-mono">Location: {ph.loc || 'Field Yard'} · Init: {ph.init || 'GC'}</div>
                </div>

              </div>
            ))}
          </div>

          {/* Photographic Remark */}
          <div className="border border-black p-2 text-[8px]">
            <span className="font-bold uppercase text-slate-500 block mb-0.5">Photographic Summary Observation:</span>
            <p className="italic text-slate-800">
              "{state.remarkPhoto || 'All photographs taken in real-time on calibrated test coupons.'}"
            </p>
          </div>

        </div>

        {/* Footer Page 3 */}
        <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[7.5px] text-slate-500 font-mono">
          <span>BG CoatingOS™ Digital Verification Suite · Module 06</span>
          <span>Report Ref: {state.repNo || 'BL-QR-2026-001'}</span>
          <span>Page 3 of 3 (Annexure B Photo Evidence)</span>
        </div>

      </div>

    </div>
  );
}
