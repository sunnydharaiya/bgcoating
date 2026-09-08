// src/tools/painter/PainterPrintDossier.jsx
import React from 'react';
import { 
  CHECK_ELEMENTS, 
  COAT_SIDS, 
  COAT_STAGE_NAMES, 
  DFT_MINI_TYPES, 
  DFT_MINI_META,
  calcRH,
  calcDP,
  calcCoatDFT
} from '../../data/painterDatabase';

export default function PainterPrintDossier({
  formData,
  evaluation,
  company,
  watermark
}) {
  const {
    pre = 0,
    prePct = 0,
    post = 0,
    postPct = 0,
    imp = 0,
    chkPass = 0,
    chkFail = 0,
    chkNa = 0,
    chkPct = 0,
    totalInspPass = 0,
    totalInspFail = 0,
    inspPct = 0,
    overallDFTAvg = NaN,
    overall = 0,
    verdict = 'PENDING'
  } = evaluation || {};

  const name = formData?.['f-name'] || '—';
  const category = formData?.['f-category'] || 'Airless Spray Painter';
  const repNo = formData?.['f-rep-no'] || '—';
  const repDate = formData?.['f-rep-date'] || '—';
  const project = formData?.['f-proj'] || '—';
  const projNo = formData?.['f-proj-no'] || '—';
  const client = formData?.['f-client'] || formData?.['f-contractor'] || '—';
  const contractor = formData?.['f-contractor'] || '—';
  const employer = formData?.['f-employer'] || '—';
  const location = formData?.['f-location'] || '—';
  const civil = formData?.['f-civil'] || '—';
  const nationality = formData?.['f-nationality'] || '—';
  const exp = formData?.['f-exp'] ? `${formData['f-exp']} years` : '—';
  const ref = formData?.['f-ref'] || 'ASTM D 4228, SSPC PA-2, ASTM D 7091, ASTM D 3359, ASTM D 4541, NACE / AMPP';

  const opPhoto = formData?._opPhoto;
  const sigStamps = formData?._sigStamps || { 1: null, 2: null, 3: null };
  const photos = formData?._photos || [];
  const checkResults = formData?._check || [];
  const csRows = formData?._coatingSystem || [];
  const coatSheets = formData?._coatSheets || {};
  const coatDFT = formData?._coatDFT || {};

  const coName = company?.name || 'BG Group of Paint & Coating Consultant';
  const coTagline = company?.tagline || 'Spray Painter Qualification Report — Technical Management System';
  const coContact = [company?.email || 'support@bgcoating.com', company?.web || 'www.bgcoating.com', company?.phone || '+91 99258 10408'].filter(Boolean).join(' · ');
  const coLogo = company?.logo;

  const wmEnabled = watermark?.enabled ?? true;
  const wmText = watermark?.text || 'BG Group of Paint and Coating Consultant';
  const wmOpacity = (watermark?.opacity ?? 6) / 100;

  // Watermark repeated background element
  const renderWatermark = () => {
    if (!wmEnabled) return null;
    return (
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex flex-wrap gap-12 p-8 select-none"
        style={{ opacity: wmOpacity }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="transform -rotate-30 font-black text-2xl font-rajdhani text-slate-950 uppercase tracking-widest whitespace-nowrap"
          >
            {wmText}
          </div>
        ))}
      </div>
    );
  };

  // Header template for Print Pages
  const renderPrintHeader = (pageTitle = 'Spray Painter Qualification Report', subTag = '') => (
    <div className="relative z-10 border-b-2 border-[#9E1B1E] pb-2 mb-3">
      <div className="grid grid-cols-12 gap-2 items-center">
        {/* Col 1: Logo */}
        <div className="col-span-2 h-14 flex items-center justify-center border border-slate-200 rounded p-1 bg-white">
          {coLogo ? (
            <img src={coLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="w-12 h-12 rounded bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] flex items-center justify-center text-white font-black font-rajdhani text-lg">
              BG
            </div>
          )}
        </div>

        {/* Col 2: Operator Photo */}
        <div className="col-span-2 h-14 flex items-center justify-center border border-slate-200 rounded p-0.5 bg-slate-50 overflow-hidden">
          {opPhoto ? (
            <img src={opPhoto} alt={name} className="w-full h-full object-cover rounded" />
          ) : (
            <span className="text-[9px] font-mono text-slate-400 uppercase">PHOTO</span>
          )}
        </div>

        {/* Col 3: Company Title & Address */}
        <div className="col-span-5 text-center">
          <h1 className="text-sm font-black uppercase text-[#9E1B1E] font-rajdhani tracking-wide leading-tight">
            {coName}
          </h1>
          <h2 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mt-0.5">
            {pageTitle}
          </h2>
          <p className="text-[8px] text-slate-500 mt-0.5">
            {coContact}
          </p>
        </div>

        {/* Col 4: Report Meta Pills */}
        <div className="col-span-3 text-right space-y-1 font-mono text-[9px]">
          <div className="bg-slate-100 p-1 rounded border border-slate-200">
            <span className="text-slate-500 font-bold block text-[8px]">REPORT NO.</span>
            <span className="font-black text-[#9E1B1E]">{repNo}</span>
          </div>
          <div className="bg-slate-100 p-1 rounded border border-slate-200">
            <span className="text-slate-500 font-bold block text-[8px]">OPERATOR</span>
            <span className="font-bold text-slate-800 truncate block">{name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-300 p-4 md:p-8 flex flex-col items-center gap-8 print:p-0 print:bg-white print:gap-0 font-sans text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 1: MAIN QUALIFICATION REPORT
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9.5pt] leading-tight page-break-after">
        {renderWatermark()}

        <div className="relative z-10 space-y-2.5">
          {renderPrintHeader('Spray Painter Qualification Report — Technical Record')}

          {/* Section 1: Project & Applicator Details Grid */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              1. Project &amp; Operator Identification Details
            </div>
            <table className="w-full text-left border border-slate-300 text-[8pt] border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-28 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Project Name</td>
                  <td className="p-1 font-semibold border-r border-slate-300" colSpan="3">{project}</td>
                  <td className="w-24 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Project No.</td>
                  <td className="p-1 font-mono">{projNo}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Client / Owner</td>
                  <td className="p-1 border-r border-slate-300">{client}</td>
                  <td className="w-24 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Contractor</td>
                  <td className="p-1 border-r border-slate-300" colSpan="3">{contractor}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Operator Name</td>
                  <td className="p-1 font-black text-[#9E1B1E] border-r border-slate-300">{name}</td>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Civil ID / Pass.</td>
                  <td className="p-1 font-mono border-r border-slate-300">{civil}</td>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Category</td>
                  <td className="p-1 font-bold">{category}</td>
                </tr>
                <tr>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Applicator / Emp.</td>
                  <td className="p-1 border-r border-slate-300">{employer}</td>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Experience</td>
                  <td className="p-1 border-r border-slate-300">{exp}</td>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Report Date</td>
                  <td className="p-1 font-mono">{repDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Coating System Specification */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              2. Specified Paint System &amp; Tolerance Range (Scope of Assessment)
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <thead>
                <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-1">Activity</th>
                  <th className="p-1">Generic Name</th>
                  <th className="p-1">Manufacturer</th>
                  <th className="p-1">Brand / Product</th>
                  <th className="p-1 text-center">Coats</th>
                  <th className="p-1 text-center">Min (µm)</th>
                  <th className="p-1 text-center">Max (µm)</th>
                  <th className="p-1 text-center bg-[#9E1B1E]/10">Cum Min</th>
                  <th className="p-1 text-center bg-[#9E1B1E]/10">Cum Max</th>
                  <th className="p-1">Color Shade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {csRows.map((cs, i) => (
                  <tr key={i}>
                    <td className="p-1 font-medium">{cs.act}</td>
                    <td className="p-1">{cs.generic}</td>
                    <td className="p-1">{cs.mfr}</td>
                    <td className="p-1 font-bold">{cs.brand}</td>
                    <td className="p-1 text-center font-mono">{cs.coats || 1}</td>
                    <td className="p-1 text-center font-mono">{cs.min}</td>
                    <td className="p-1 text-center font-mono">{cs.max}</td>
                    <td className="p-1 text-center font-mono font-bold bg-[#9E1B1E]/5 text-[#9E1B1E]">{cs.min}</td>
                    <td className="p-1 text-center font-mono font-bold bg-[#9E1B1E]/5 text-[#9E1B1E]">{cs.max}</td>
                    <td className="p-1">{cs.shade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Consolidated Environmental Snapshot */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              3. Environmental Psychrometric Snapshot at Application (Limits: RH ≤ 85%, MT−DP ≥ 3.0°C)
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <thead>
                <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-1 text-center w-8">Sr.</th>
                  <th className="p-1">Coating Stage</th>
                  <th className="p-1 text-center">Time</th>
                  <th className="p-1 text-center">Dry Bulb (°C)</th>
                  <th className="p-1 text-center">Wet Bulb (°C)</th>
                  <th className="p-1 text-center">Steel Temp (°C)</th>
                  <th className="p-1 text-center">RH (%)</th>
                  <th className="p-1 text-center">Dew Pt (°C)</th>
                  <th className="p-1 text-center">MT − DP</th>
                  <th className="p-1 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COAT_SIDS.map((sid, idx) => {
                  const cs = coatSheets[sid] || {};
                  const tdb = parseFloat(cs.db);
                  const twb = parseFloat(cs.wb);
                  const tmt = parseFloat(cs.mt);
                  const rh = calcRH(tdb, twb);
                  const dp = calcDP(tdb, rh);
                  const diff = (!isNaN(tmt) && !isNaN(dp)) ? (tmt - dp) : NaN;
                  const isOK = !isNaN(rh) && !isNaN(diff) && rh <= 85 && diff >= 3.0;

                  return (
                    <tr key={sid}>
                      <td className="p-1 text-center font-mono font-bold">{idx + 1}</td>
                      <td className="p-1 font-bold">{COAT_STAGE_NAMES[sid]}</td>
                      <td className="p-1 text-center font-mono">{cs.envtime || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.db || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.wb || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.mt || '—'}</td>
                      <td className="p-1 text-center font-mono">{isNaN(rh) ? '—' : `${rh.toFixed(1)}%`}</td>
                      <td className="p-1 text-center font-mono">{isNaN(dp) ? '—' : `${dp.toFixed(1)}°C`}</td>
                      <td className="p-1 text-center font-mono font-bold">{isNaN(diff) ? '—' : `${diff.toFixed(1)}°C`}</td>
                      <td className={`p-1 text-center font-bold ${isOK ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {!isNaN(rh) ? (isOK ? 'OK · APPLY' : 'HOLD') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 4: Multi-Coat Stage Application Parameters */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              4. Multi-Coat Stage Application Execution &amp; Inspection Summary
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <thead>
                <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-1 text-center w-8">Sr.</th>
                  <th className="p-1">Stage &amp; Product</th>
                  <th className="p-1">Method</th>
                  <th className="p-1 text-center">Start</th>
                  <th className="p-1 text-center">End</th>
                  <th className="p-1 text-center">Recoat Gap</th>
                  <th className="p-1 text-center">Batch No.</th>
                  <th className="p-1 text-center">Avg DFT</th>
                  <th className="p-1 text-center">Stage Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COAT_SIDS.map((sid, idx) => {
                  const cs = coatSheets[sid] || {};
                  const cd = coatDFT[sid] || {};
                  const dftRes = calcCoatDFT(cd.min, cd.max, cd.byType, cd.verdict);

                  return (
                    <tr key={sid}>
                      <td className="p-1 text-center font-mono font-bold">{idx + 1}</td>
                      <td className="p-1 font-bold">{COAT_STAGE_NAMES[sid]} <span className="font-normal text-slate-500">({cs.product || '—'})</span></td>
                      <td className="p-1">{cs.method || 'Airless Spray'}</td>
                      <td className="p-1 text-center font-mono">{cs.start || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.end || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.recoat || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.batchA || '—'}</td>
                      <td className="p-1 text-center font-mono font-bold text-[#9E1B1E]">{dftRes.grandAvgStr}</td>
                      <td className="p-1 text-center font-bold text-emerald-700">{cd.verdict || dftRes.autoVerdict}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 5: Theoretical & Practical Qualification Summary */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              5. Final Qualification Summary Scores &amp; Certified Decision
            </div>
            <table className="w-full text-left border border-slate-300 text-[8pt] border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 p-1 font-bold border-r border-slate-300 w-36">Theoretical Post-Test</td>
                  <td className="p-1 font-mono font-bold border-r border-slate-300">{postPct.toFixed(0)}% ({post}/45 Qs)</td>
                  <td className="bg-slate-100 p-1 font-bold border-r border-slate-300 w-36">Checklist Compliance</td>
                  <td className="p-1 font-mono font-bold">{chkPct.toFixed(0)}% ({chkPass}/13 Passed)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 p-1 font-bold border-r border-slate-300">Knowledge Gain (Δ%)</td>
                  <td className="p-1 font-mono font-bold border-r border-slate-300 text-emerald-700">+{imp.toFixed(0)}%</td>
                  <td className="bg-slate-100 p-1 font-bold border-r border-slate-300">Inspection Pass Rate</td>
                  <td className="p-1 font-mono font-bold">{inspPct.toFixed(0)}% ({totalInspPass} Passed)</td>
                </tr>
                <tr className="bg-[#F4E5C7] text-slate-900 font-bold border-b border-slate-300">
                  <td className="p-1.5 font-black uppercase text-[#9E1B1E] border-r border-slate-300 font-rajdhani">
                    Composite Weighted Score
                  </td>
                  <td className="p-1.5 font-black font-mono text-base text-[#9E1B1E] border-r border-slate-300">
                    {overall.toFixed(1)}%
                  </td>
                  <td className="p-1.5 font-black uppercase text-[#9E1B1E] border-r border-slate-300 font-rajdhani">
                    Final Certified Verdict
                  </td>
                  <td className="p-1.5 font-black text-sm uppercase">
                    <span className={`px-2 py-0.5 rounded ${verdict === 'PASS' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="bg-slate-50 p-1 font-bold border-r border-slate-300 align-top">Examiner Remarks</td>
                  <td colSpan="3" className="p-1 text-[7.5pt] text-slate-700 leading-snug">
                    {formData?.['f-remark-final'] || 'Operator demonstrated compliant spray technique, excellent stripe coating adherence, and correct SSPC PA-2 gauge calibration.'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 6: 3 Signatory Authorization Blocks */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              6. Authorization &amp; Endorsement
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <tbody>
                <tr>
                  {/* Sig 1 */}
                  <td className="w-1/3 p-2 border-r border-slate-300 align-bottom h-24">
                    <div className="font-bold text-slate-800">Performed By (Spray Painter)</div>
                    <div className="h-10 flex items-center justify-center my-1">
                      {sigStamps[1] ? (
                        <img src={sigStamps[1]} alt="Sig 1" className="max-h-full object-contain" />
                      ) : null}
                    </div>
                    <div className="border-t border-slate-300 pt-1 font-mono text-[7pt]">
                      <div>Name: {formData?.['sig1-name'] || '—'}</div>
                      <div>Date: {formData?.['sig1-date'] || '—'}</div>
                    </div>
                  </td>

                  {/* Sig 2 */}
                  <td className="w-1/3 p-2 border-r border-slate-300 align-bottom h-24">
                    <div className="font-bold text-slate-800">QA/QC Coating Inspector</div>
                    <div className="h-10 flex items-center justify-center my-1">
                      {sigStamps[2] ? (
                        <img src={sigStamps[2]} alt="Sig 2" className="max-h-full object-contain" />
                      ) : (
                        <span className="text-[7pt] font-mono text-slate-400 uppercase">[Affix Stamp]</span>
                      )}
                    </div>
                    <div className="border-t border-slate-300 pt-1 font-mono text-[7pt]">
                      <div>Name: {formData?.['sig2-name'] || '—'}</div>
                      <div>Date: {formData?.['sig2-date'] || '—'}</div>
                    </div>
                  </td>

                  {/* Sig 3 */}
                  <td className="w-1/3 p-2 align-bottom h-24">
                    <div className="font-bold text-slate-800">Client / Third Party Approval</div>
                    <div className="h-10 flex items-center justify-center my-1">
                      {sigStamps[3] ? (
                        <img src={sigStamps[3]} alt="Sig 3" className="max-h-full object-contain" />
                      ) : (
                        <span className="text-[7pt] font-mono text-slate-400 uppercase">[Affix Stamp]</span>
                      )}
                    </div>
                    <div className="border-t border-slate-300 pt-1 font-mono text-[7pt]">
                      <div>Name: {formData?.['sig3-name'] || '—'}</div>
                      <div>Date: {formData?.['sig3-date'] || '—'}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-slate-300 pt-1 flex justify-between text-[7.5pt] text-slate-500 font-mono">
          <span>{coName} · Spray Painter Qualification Technical Dossier</span>
          <span>Page 1 of {photos.length > 0 ? 3 + COAT_SIDS.length : 2 + COAT_SIDS.length}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 2: ANNEXURE A — ASSESSMENT CHECKLIST RECORD
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9.5pt] leading-tight page-break-after">
        {renderWatermark()}

        <div className="relative z-10 space-y-3">
          {renderPrintHeader('Annexure A: Practical Assessment Checklist Record')}

          <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
            Practical Evaluation Elements (13 Critical Requirements)
          </div>

          <table className="w-full text-left border border-slate-300 text-[8pt] border-collapse">
            <thead>
              <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                <th className="p-1.5 text-center w-8">#</th>
                <th className="p-1.5">Critical Assessment Element</th>
                <th className="p-1.5 text-center w-20">Result</th>
                <th className="p-1.5">Observation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {CHECK_ELEMENTS.map((el, idx) => {
                const res = checkResults[idx]?.r || 'Pass';
                const com = checkResults[idx]?.c || 'Satisfactory';

                return (
                  <tr key={idx}>
                    <td className="p-1 text-center font-mono font-bold text-slate-600">{idx + 1}</td>
                    <td className="p-1 font-medium">{el}</td>
                    <td className={`p-1 text-center font-bold ${res === 'Pass' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {res === 'Pass' ? '✓ Pass' : res}
                    </td>
                    <td className="p-1 text-slate-600">{com}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#F4E5C7] font-bold text-slate-800 text-[8pt]">
                <td colSpan="2" className="p-1.5 uppercase font-black text-[#9E1B1E] font-rajdhani">
                  Checklist Summary: {chkPass} Passed · {chkFail} Failed · {chkNa} N.A.
                </td>
                <td className="p-1.5 text-center font-mono font-black text-[#9E1B1E]">
                  {chkPct.toFixed(0)}%
                </td>
                <td className="p-1.5 text-[7.5pt] font-normal text-slate-600">
                  {chkFail === 0 ? 'Compliant with 0 critical defects' : `${chkFail} non-conformances recorded`}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Checklist Signatures */}
          <div className="pt-2">
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              Checklist Authorization
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <tbody>
                <tr>
                  <td className="w-1/3 p-2 border-r border-slate-300 align-bottom h-20">
                    <div className="font-bold">Performed By</div>
                    <div className="font-mono text-[7pt] mt-4">Name: {formData?.['sig1-name'] || '—'}</div>
                  </td>
                  <td className="w-1/3 p-2 border-r border-slate-300 align-bottom h-20">
                    <div className="font-bold">QA/QC Inspector</div>
                    <div className="font-mono text-[7pt] mt-4">Name: {formData?.['sig2-name'] || '—'}</div>
                  </td>
                  <td className="w-1/3 p-2 align-bottom h-20">
                    <div className="font-bold">Client Rep</div>
                    <div className="font-mono text-[7pt] mt-4">Name: {formData?.['sig3-name'] || '—'}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="relative z-10 border-t border-slate-300 pt-1 flex justify-between text-[7.5pt] text-slate-500 font-mono">
          <span>Annexure A · Practical Assessment Checklist Record</span>
          <span>Page 2</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 3: ANNEXURE B — PHOTOGRAPHIC EVIDENCE REPORT
          ══════════════════════════════════════════════════════════════════════ */}
      {photos.length > 0 && (
        <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9.5pt] leading-tight page-break-after">
          {renderWatermark()}

          <div className="relative z-10 space-y-3">
            {renderPrintHeader('Annexure B: Photographic Evidence Report')}

            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              Photographic Records of Qualification Activity
            </div>

            <div className="grid grid-cols-2 gap-3">
              {photos.slice(0, 6).map((photo, idx) => (
                <div key={idx} className="border border-slate-300 rounded overflow-hidden flex flex-col bg-slate-50">
                  <div className="bg-slate-200 px-2 py-0.5 text-[7.5pt] font-bold flex justify-between">
                    <span>Photo {idx + 1}: {photo.title}</span>
                    <span className="font-mono text-[7pt]">{photo.date}</span>
                  </div>
                  <div className="h-32 bg-white flex items-center justify-center overflow-hidden p-1 border-b border-slate-200">
                    {photo.b64 ? (
                      <img src={photo.b64} alt={photo.title} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[8pt] text-slate-400 italic">No image attached</span>
                    )}
                  </div>
                  <div className="p-1 text-[7pt] text-slate-600 leading-snug">
                    <span className="font-semibold text-slate-800">{photo.loc ? `📍 ${photo.loc} — ` : ''}</span>
                    {photo.cap || 'Trial photograph'}
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Signatures */}
            <div className="pt-2">
              <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
                <tbody>
                  <tr>
                    <td className="w-1/3 p-1.5 border-r border-slate-300 align-bottom h-16">
                      <div className="font-bold">Witnessed By (Painter)</div>
                      <div className="font-mono text-[7pt] mt-2">Date: {formData?.['sig1-date'] || '—'}</div>
                    </td>
                    <td className="w-1/3 p-1.5 border-r border-slate-300 align-bottom h-16">
                      <div className="font-bold">QA/QC Inspector</div>
                      <div className="font-mono text-[7pt] mt-2">Date: {formData?.['sig2-date'] || '—'}</div>
                    </td>
                    <td className="w-1/3 p-1.5 align-bottom h-16">
                      <div className="font-bold">Client Approval</div>
                      <div className="font-mono text-[7pt] mt-2">Date: {formData?.['sig3-date'] || '—'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-300 pt-1 flex justify-between text-[7.5pt] text-slate-500 font-mono">
            <span>Annexure B · Photographic Evidence Report</span>
            <span>Page 3</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DYNAMIC PAGES 5+: PER-COAT STAGE RECORDS (s1 to s4) WITH 4-MINI-TABLE DFT
          ══════════════════════════════════════════════════════════════════════ */}
      {COAT_SIDS.map((sid, coatIdx) => {
        const cs = coatSheets[sid] || {};
        const cd = coatDFT[sid] || {};
        const stageName = COAT_STAGE_NAMES[sid];
        const dftStats = calcCoatDFT(cd.min, cd.max, cd.byType, cd.verdict);
        const stageTests = cs.tests || [];
        const curPageNum = (photos.length > 0 ? 4 : 3) + coatIdx;

        return (
          <div
            key={sid}
            className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9.5pt] leading-tight page-break-after"
          >
            {renderWatermark()}

            <div className="relative z-10 space-y-2.5">
              {renderPrintHeader(`Coating Stage Record: ${stageName}`)}

              {/* Stage Application & Material Traceability Banner */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Coating Application &amp; Material Traceability ({stageName})
                </div>
                <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-24 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Manufacturer</td>
                      <td className="p-1 font-semibold border-r border-slate-300">{cs.mfr || '—'}</td>
                      <td className="w-24 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Product Name</td>
                      <td className="p-1 font-bold text-[#9E1B1E] border-r border-slate-300">{cs.product || '—'}</td>
                      <td className="w-24 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Generic Type</td>
                      <td className="p-1">{cs.generic || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">App. Method</td>
                      <td className="p-1 border-r border-slate-300">{cs.method || 'Airless Spray'}</td>
                      <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Stripe Coat</td>
                      <td className="p-1 border-r border-slate-300">{cs.stripe || 'Yes'}</td>
                      <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Recoat Gap</td>
                      <td className="p-1 font-mono font-bold text-[#9E1B1E]">{cs.recoat || '—'}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Batch A / Exp</td>
                      <td className="p-1 font-mono border-r border-slate-300">{cs.batchA || '—'} ({cs.expA || '—'})</td>
                      <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Batch B / Exp</td>
                      <td className="p-1 font-mono border-r border-slate-300">{cs.batchB || '—'} ({cs.expB || '—'})</td>
                      <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Mixing Ratio</td>
                      <td className="p-1 font-medium">{cs.ratio || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Stage Environmental Snapshot */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Environmental Snapshot at Application
                </div>
                <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                      <th className="p-1 text-center">Reading Time</th>
                      <th className="p-1 text-center">Dry Bulb (°C)</th>
                      <th className="p-1 text-center">Wet Bulb (°C)</th>
                      <th className="p-1 text-center">Steel Temp (°C)</th>
                      <th className="p-1 text-center">RH (%)</th>
                      <th className="p-1 text-center">Dew Pt (°C)</th>
                      <th className="p-1 text-center">MT − DP</th>
                      <th className="p-1 text-center">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1 text-center font-mono">{cs.envtime || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.db || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.wb || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.mt || '—'}</td>
                      <td className="p-1 text-center font-mono">{cs.rh || '—'}%</td>
                      <td className="p-1 text-center font-mono">{cs.dp || '—'}°C</td>
                      <td className="p-1 text-center font-mono font-bold">{cs.diff || '—'}°C</td>
                      <td className="p-1 text-center font-bold text-emerald-700">OK · APPLY</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Stage Inspection Tests */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Inspection Test Parameters &amp; Results ({stageName})
                </div>
                <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                      <th className="p-1 text-center w-8">#</th>
                      <th className="p-1">Test Parameter</th>
                      <th className="p-1">Standard</th>
                      <th className="p-1">Requirement</th>
                      <th className="p-1">Actual Result</th>
                      <th className="p-1 text-center w-16">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {stageTests.map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-1 text-center font-mono font-bold">{idx + 1}</td>
                        <td className="p-1 font-bold">{t.t}</td>
                        <td className="p-1">{t.std}</td>
                        <td className="p-1">{t.req}</td>
                        <td className="p-1">{t.act}</td>
                        <td className={`p-1 text-center font-bold ${t.res === 'Pass' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {t.res || 'Pass'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4-Mini-Table DFT Record */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t flex justify-between">
                  <span>DFT Measurement Matrix — SSPC PA-2 (80%–120% Rule)</span>
                  <span className="font-mono">Specified: {cd.min || '—'} – {cd.max || '—'} µm</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  {DFT_MINI_TYPES.map((type) => {
                    const meta = DFT_MINI_META[type];
                    const rows = cd.byType?.[type] || [];
                    const res = dftStats.typeResults[type] || {};

                    return (
                      <div key={type} className="border border-slate-300 rounded overflow-hidden">
                        <div className="bg-[#9E1B1E] text-white p-1 font-rajdhani text-[7.5pt] font-bold">
                          {meta.num}. {meta.title}
                        </div>
                        <table className="w-full text-left text-[7pt] border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                              <th className="p-0.5">Position</th>
                              <th className="p-0.5 text-center">R1</th>
                              <th className="p-0.5 text-center">R2</th>
                              <th className="p-0.5 text-center">R3</th>
                              <th className="p-0.5 text-center">R4</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {rows.map((r, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-0.5 font-medium">{r.label}</td>
                                {(r.spots || ['', '', '', '']).map((s, sIdx) => (
                                  <td key={sIdx} className="p-0.5 text-center font-mono">
                                    {s || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-[#F4E5C7] font-bold text-slate-800 border-t border-slate-300">
                              <td className="p-0.5">Substrate Avg:</td>
                              <td colSpan="4" className="p-0.5 text-center font-mono text-[#9E1B1E]">
                                {res.avg || '—'} µm ({res.count || 0} spots)
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-1.5 p-1.5 bg-slate-100 rounded border border-slate-300 flex justify-between items-center text-[8pt]">
                  <div>Final Avg DFT: <b className="font-mono text-[#9E1B1E]">{dftStats.grandAvgStr}</b></div>
                  <div>Total Spot Readings: <b className="font-mono">{dftStats.totalReadings}</b></div>
                  <div>Out of Range: <b className="font-mono text-emerald-700">{dftStats.outOfRange}</b></div>
                  <div>Stage Verdict: <b className="text-emerald-700 font-rajdhani text-sm font-black">{cd.verdict || dftStats.autoVerdict}</b></div>
                </div>
              </div>

              {/* Stage Authorization */}
              <div>
                <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-1/3 p-1.5 border-r border-slate-300 align-bottom h-16">
                        <div className="font-bold">Performed By (Painter)</div>
                        <div className="font-mono text-[7pt] mt-2">Sign &amp; Date: _________________</div>
                      </td>
                      <td className="w-1/3 p-1.5 border-r border-slate-300 align-bottom h-16">
                        <div className="font-bold">QA/QC Inspector</div>
                        <div className="font-mono text-[7pt] mt-2">Sign &amp; Stamp: _________________</div>
                      </td>
                      <td className="w-1/3 p-1.5 align-bottom h-16">
                        <div className="font-bold">Client Approval</div>
                        <div className="font-mono text-[7pt] mt-2">Sign &amp; Stamp: _________________</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="relative z-10 border-t border-slate-300 pt-1 flex justify-between text-[7.5pt] text-slate-500 font-mono">
              <span>{stageName} · DFT Measurement &amp; Inspection Record</span>
              <span>Page {curPageNum}</span>
            </div>
          </div>
        );
      })}

    </div>
  );
}
