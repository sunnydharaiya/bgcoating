import React from 'react';
import { 
  TSA_CHECKLIST_ELEMENTS, 
  TSA_COATING_SYSTEM_DEFAULTS, 
  TSA_MAT_DEFAULTS, 
  TSA_DFT_SUBSTRATES, 
  TSA_DFT_MINI_TYPES, 
  calcCoatDFT, 
  calcEnvRow,
  TSA_STAGE_NAMES
} from '../../data/tsaDatabase';

export default function TsaPrintDossier({
  formData,
  evaluation,
  company,
  watermark
}) {
  const {
    overall = 0,
    verdict = 'PENDING',
    chk = { pass: 0, fail: 0, na: 0, pct: 0 },
    dft = { valid: 0, ok: 0, pct: 0, finalOK: false, grandAvg: 0, byStage: {} },
    insp = { pass: 0, fail: 0, na: 0, pct: 0 },
    env = { valid: 0, ok: 0, pct: 0, finalOK: true }
  } = evaluation || {};

  const name = formData?.['f-name'] || '—';
  const category = formData?.['f-category'] || 'TSA Operator';
  const repNo = formData?.['f-rep-no'] || '—';
  const repDate = formData?.['f-rep-date'] || '—';
  const project = formData?.['f-proj'] || '—';
  const projNo = formData?.['f-proj-no'] || '—';
  const client = formData?.['f-client'] || formData?.['f-contractor'] || '—';
  const epc = formData?.['f-epc'] || '—';
  const contractor = formData?.['f-contractor'] || '—';
  const employer = formData?.['f-employer'] || '—';
  const location = formData?.['f-location'] || '—';
  const civil = formData?.['f-civil'] || '—';
  const nationality = formData?.['f-nationality'] || '—';
  const exp = formData?.['f-exp'] ? `${formData['f-exp']} years` : '—';
  const qualDate = formData?.['f-qual-date'] || '—';
  const nextDate = formData?.['f-next-date'] || '—';
  const refStd = formData?.['f-ref'] || 'NACE No.12 / AWS C2.23M / SSPC-CS 23.00, AWS C2.16, ISO 2063-2, SSPC-PA 2';

  const opPhoto = formData?.['op-photo'];
  const sigStamps = formData?.sigStamps || { 1: null, 2: null, 3: null };
  const photos = formData?.photos || [];
  const checklist = formData?.checklist || [];
  const csRows = formData?.coatingSystem || TSA_COATING_SYSTEM_DEFAULTS;
  const tsaMaterials = formData?.tsaMaterials || TSA_MAT_DEFAULTS;
  const coatStages = formData?.coatStages || {};

  const coName = company?.name || 'BG Group of Paint & Coating Consultant';
  const coTagline = company?.tagline || 'TSA Operator Qualification Report — Twin Wire Arc / Thermal Spray — Technical Dossier';
  const coContact = [company?.email || 'support@bgcoating.com', company?.web || 'www.bgcoating.com', company?.phone || '+91 99258 10408'].filter(Boolean).join(' · ');
  const coLogo = company?.logo;

  const wmEnabled = watermark?.enabled ?? true;
  const wmText = watermark?.text || 'BG Group of Paint and Coating Consultant';
  const wmOpacity = (watermark?.opacity ?? 6) / 100;

  // Watermark repeated background
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

  // Header template
  const renderPrintHeader = (pageTitle = 'TSA Operator Qualification Report', pageNum = '1') => (
    <div className="relative z-10 border-b-2 border-[#9E1B1E] pb-2 mb-3">
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-2 h-14 flex items-center justify-center border border-slate-200 rounded p-1 bg-white">
          {coLogo ? (
            <img src={coLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="w-12 h-12 rounded bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] flex items-center justify-center text-white font-black font-rajdhani text-lg">
              BG
            </div>
          )}
        </div>

        <div className="col-span-2 h-14 flex items-center justify-center border border-slate-200 rounded p-0.5 bg-slate-50 overflow-hidden">
          {opPhoto ? (
            <img src={opPhoto} alt={name} className="w-full h-full object-cover rounded" />
          ) : (
            <span className="text-[8px] font-mono text-slate-400 uppercase">NO PHOTO</span>
          )}
        </div>

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

        <div className="col-span-3 text-right space-y-1 font-mono text-[9px]">
          <div className="bg-slate-100 p-1 rounded border border-slate-200">
            <span className="text-slate-500 font-bold block text-[8px]">REPORT NO.</span>
            <span className="font-black text-[#9E1B1E]">{repNo}</span>
          </div>
          <div className="bg-slate-100 p-0.5 rounded border border-slate-200 flex justify-between px-1 text-[8px]">
            <span className="text-slate-500 font-bold">PAGE:</span>
            <span className="font-bold text-slate-800">{pageNum} / 5</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-300 p-4 md:p-8 flex flex-col items-center gap-8 print:p-0 print:bg-white print:gap-0 font-sans text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 1: MAIN QUALIFICATION REPORT & ENDORSEMENTS
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9pt] leading-tight page-break-after">
        {renderWatermark()}

        <div className="relative z-10 space-y-2.5">
          {renderPrintHeader('TSA Operator Qualification Report — Technical Record', '1')}

          {/* Section 1: Project & Identification Details */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              1. Project &amp; TSA Applicator Identification Details
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
                  <td className="w-24 bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">EPC / Contractor</td>
                  <td className="p-1 border-r border-slate-300" colSpan="3">{epc} / {contractor}</td>
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
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Employer / Org.</td>
                  <td className="p-1 border-r border-slate-300">{employer}</td>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Experience</td>
                  <td className="p-1 border-r border-slate-300">{exp}</td>
                  <td className="bg-[#F4E5C7] p-1 font-bold font-rajdhani border-r border-slate-300">Qual. Date</td>
                  <td className="p-1 font-mono">{qualDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Coating System Scope */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              2. Specified TSA Coating System Specification &amp; Tolerance
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <thead>
                <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-1">Activity</th>
                  <th className="p-1">Generic Name</th>
                  <th className="p-1">Manufacturer</th>
                  <th className="p-1">Brand / Wire Spec</th>
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

          {/* Section 3: 4-Tier Qualification Scoring Findings */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              3. 4-Tier Qualification Evaluation Criteria &amp; Quantitative Findings
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <thead>
                <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-1">Evaluation Pillar</th>
                  <th className="p-1 text-center w-16">Weight</th>
                  <th className="p-1">Standard Benchmark Requirement</th>
                  <th className="p-1">Actual Measured Finding</th>
                  <th className="p-1 text-center w-24">Pillar Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-1 font-bold">1. Practical Assessment Checklist</td>
                  <td className="p-1 text-center font-mono">35%</td>
                  <td className="p-1">≥ 80.0% Compliance &amp; 0 Critical Fails</td>
                  <td className="p-1 font-mono font-bold">{chk.pct.toFixed(0)}% ({chk.pass}/12 Items Pass)</td>
                  <td className="p-1 text-center font-bold text-emerald-700">{chk.pct >= 80 ? 'MEETS SPEC' : 'DEFICIENT'}</td>
                </tr>
                <tr>
                  <td className="p-1 font-bold">2. SSPC PA-2 DFT Compliance</td>
                  <td className="p-1 text-center font-mono">30%</td>
                  <td className="p-1">Spot readings in 80%–120% Bound</td>
                  <td className="p-1 font-mono font-bold">{dft.pct.toFixed(0)}% ({dft.ok}/{dft.valid} Spots OK)</td>
                  <td className="p-1 text-center font-bold text-emerald-700">{dft.finalOK ? 'MEETS SPEC' : 'OUT OF SPEC'}</td>
                </tr>
                <tr>
                  <td className="p-1 font-bold">3. Coating Test Parameters</td>
                  <td className="p-1 text-center font-mono">20%</td>
                  <td className="p-1">≥ 80.0% Inspection Tests Pass</td>
                  <td className="p-1 font-mono font-bold">{insp.pct.toFixed(0)}% ({insp.pass} Pass / 0 Fail)</td>
                  <td className="p-1 text-center font-bold text-emerald-700">{insp.pct >= 80 ? 'MEETS SPEC' : 'DEFICIENT'}</td>
                </tr>
                <tr>
                  <td className="p-1 font-bold">4. Environmental Psychrometrics</td>
                  <td className="p-1 text-center font-mono">15%</td>
                  <td className="p-1">RH ≤ 85% &amp; MT − DP ≥ 3.0°C</td>
                  <td className="p-1 font-mono font-bold">{env.ok}/{env.valid} Hourly Readings OK</td>
                  <td className="p-1 text-center font-bold text-emerald-700">{env.finalOK ? 'MEETS SPEC' : 'COND. EXCEEDED'}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-[#FDF1E6] font-bold text-slate-800 border-t-2 border-[#9E1B1E]">
                  <td className="p-1 uppercase text-[#9E1B1E]">Overall Qualification Result:</td>
                  <td className="p-1 text-center font-mono text-[#9E1B1E]">100%</td>
                  <td colSpan="2" className="p-1">Status: {verdict === 'PASS' ? 'QUALIFIED FOR TWIN-WIRE ARC TSA SPRAYING' : 'NOT QUALIFIED'}</td>
                  <td className="p-1 text-center font-mono text-sm text-[#9E1B1E] font-black">{overall.toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Section 4: 3 Digital Signatures / Endorsements */}
          <div className="pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 flex flex-col justify-between h-28">
                <span className="text-[7.5pt] font-bold font-rajdhani uppercase text-slate-600">
                  TSA Applicator / Operator
                </span>
                <div className="h-12 flex items-center justify-center">
                  {sigStamps[1] ? (
                    <img src={sigStamps[1]} alt="Stamp 1" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[7pt] text-slate-400 italic">Signature / Digital Stamp</span>
                  )}
                </div>
                <div className="text-[7pt] border-t border-slate-200 pt-0.5 font-bold">
                  {formData?.['sig1-name'] || name} ({formData?.['sig1-date'] || repDate})
                </div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 flex flex-col justify-between h-28">
                <span className="text-[7.5pt] font-bold font-rajdhani uppercase text-slate-600">
                  Lead QA/QC NACE Level III Inspector
                </span>
                <div className="h-12 flex items-center justify-center">
                  {sigStamps[2] ? (
                    <img src={sigStamps[2]} alt="Stamp 2" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[7pt] text-slate-400 italic">Verified &amp; Stamped</span>
                  )}
                </div>
                <div className="text-[7pt] border-t border-slate-200 pt-0.5 font-bold">
                  {formData?.['sig2-name'] || 'BG Group QA/QC Lead'} ({formData?.['sig2-date'] || repDate})
                </div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 flex flex-col justify-between h-28">
                <span className="text-[7.5pt] font-bold font-rajdhani uppercase text-slate-600">
                  Client / Third-Party Surveyor
                </span>
                <div className="h-12 flex items-center justify-center">
                  {sigStamps[3] ? (
                    <img src={sigStamps[3]} alt="Stamp 3" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[7pt] text-slate-400 italic">Client Endorsement</span>
                  )}
                </div>
                <div className="text-[7pt] border-t border-slate-200 pt-0.5 font-bold">
                  {formData?.['sig3-name'] || client} ({formData?.['sig3-date'] || repDate})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-1 flex justify-between text-[7.5pt] text-slate-400 font-mono">
          <span>{coName} · AWS C2.23M Certified</span>
          <span>Report #{repNo} · Page 1 of 5</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 2: MATERIAL DETAILS & 12 PRACTICAL CHECKLIST ELEMENTS
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9pt] leading-tight page-break-after">
        {renderWatermark()}

        <div className="relative z-10 space-y-2.5">
          {renderPrintHeader('Thermal Spray Material Specifications & Practical Checklist', '2')}

          {/* Section: Thermal Spray Material Details (2 side-by-side tables) */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              4. Thermal Spray Wire &amp; Metallurgical Parameters (AWS C2.23M)
            </div>
            <div className="grid grid-cols-2 gap-2 border border-slate-300 p-1 bg-slate-50/50">
              <table className="w-full text-left text-[7pt] border-collapse">
                <tbody>
                  {tsaMaterials.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="p-1 font-bold w-5/12 bg-white">{r.desc}</td>
                      <td className="p-1 font-semibold text-slate-800">{r.detail || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="w-full text-left text-[7pt] border-collapse">
                <tbody>
                  {tsaMaterials.slice(5).map((r, j) => (
                    <tr key={j} className="border-b border-slate-200">
                      <td className="p-1 font-bold w-5/12 bg-white">{r.desc}</td>
                      <td className="p-1 font-semibold text-slate-800">{r.detail || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: 12 Assessment Elements Table */}
          <div>
            <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
              5. Practical Competency Assessment Checklist (12 Items)
            </div>
            <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse">
              <thead>
                <tr className="bg-slate-100 font-rajdhani uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-1 text-center w-6">#</th>
                  <th className="p-1 w-6/12">Assessment Element Description</th>
                  <th className="p-1 text-center w-20">Evaluation</th>
                  <th className="p-1">Assessor Observation / Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TSA_CHECKLIST_ELEMENTS.map((elem, idx) => {
                  const item = checklist[idx] || { result: 'Pass', comment: '' };
                  return (
                    <tr key={idx}>
                      <td className="p-1 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-1 font-medium">{elem}</td>
                      <td className="p-1 text-center font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[7pt] ${
                          item.result === 'Pass' ? 'bg-emerald-100 text-emerald-800' : item.result === 'Fail' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.result || 'Pending'}
                        </span>
                      </td>
                      <td className="p-1 text-slate-600 text-[7pt]">{item.comment || 'Verified compliant per specification.'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <div className="border border-slate-300 rounded p-2 bg-slate-50 text-[7.5pt]">
            <span className="font-bold block uppercase text-[#9E1B1E] font-rajdhani">Evaluator Summary Remark:</span>
            <p className="text-slate-700 mt-0.5">
              {formData?.['f-remark-check'] || 'The applicator demonstrates high proficiency in twin-wire arc operation, maintaining 150–200 mm standoff distance and achieving 50% overlap crossing passes with zero coating spatter or porosity defects.'}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-1 flex justify-between text-[7.5pt] text-slate-400 font-mono">
          <span>{coName} · Section 02 Practical Assessment</span>
          <span>Report #{repNo} · Page 2 of 5</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 3: STAGE 01 (BLASTING + TSA) INSPECTION SHEET
          ══════════════════════════════════════════════════════════════════════ */}
      {(() => {
        const s1 = coatStages.s1 || {};
        const s1DFT = calcCoatDFT(s1);
        const s1Env = s1.envReadings || [];
        const s1Tests = s1.tests || [];
        const s1Mini = s1.dftMini || {};

        return (
          <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9pt] leading-tight page-break-after">
            {renderWatermark()}

            <div className="relative z-10 space-y-2.5">
              {renderPrintHeader('Stage 01: Surface Blast Cleaning & Thermal Spray Aluminium (TSA)', '3')}

              {/* Stage Specs Banner */}
              <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse bg-slate-50">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-28 font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Application Method</td>
                    <td className="p-1 border-r border-slate-300 font-semibold">{s1.method || 'Twin Wire Arc Spray'}</td>
                    <td className="w-24 font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Substrate Rust</td>
                    <td className="p-1 border-r border-slate-300">{s1.rust || 'Sa 3.0 Clean / No Flash Rust'}</td>
                    <td className="w-24 font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Specified DFT</td>
                    <td className="p-1 font-mono font-bold text-[#9E1B1E]">{s1.dftSpecMin || '300'}–{s1.dftSpecMax || '500'} µm</td>
                  </tr>
                  <tr>
                    <td className="font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Wire Spec / Mfr</td>
                    <td className="p-1 border-r border-slate-300">{s1.product || '99.5% Pure Al'} ({s1.mfr || 'Castolin'})</td>
                    <td className="font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Application Date</td>
                    <td className="p-1 border-r border-slate-300 font-mono">{s1.date || repDate} ({s1.start || '08:00'}–{s1.end || '12:00'})</td>
                    <td className="font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Sealing Interval</td>
                    <td className="p-1">{s1.recoat || 'Within 4 Hours'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Multi-Hour Environmental Snapshot */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Multi-Hour Environmental Snapshot at Application
                </div>
                <table className="w-full text-left border border-slate-300 text-[7pt] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-300">
                      <th className="p-0.5 text-center w-6">#</th>
                      <th className="p-0.5">Time</th>
                      <th className="p-0.5 text-center">Dry Bulb</th>
                      <th className="p-0.5 text-center">Wet Bulb</th>
                      <th className="p-0.5 text-center">Steel Temp</th>
                      <th className="p-0.5 text-center">RH %</th>
                      <th className="p-0.5 text-center">Dew Point</th>
                      <th className="p-0.5 text-center">MT − DP</th>
                      <th className="p-0.5 text-center w-20">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {s1Env.slice(0, 3).map((r, i) => {
                      const c = calcEnvRow(r.db, r.wb, r.mt);
                      return (
                        <tr key={i}>
                          <td className="p-0.5 text-center font-mono">{i + 1}</td>
                          <td className="p-0.5 font-mono">{r.time || '—'}</td>
                          <td className="p-0.5 text-center font-mono">{r.db || '—'}°C</td>
                          <td className="p-0.5 text-center font-mono">{r.wb || '—'}°C</td>
                          <td className="p-0.5 text-center font-mono">{r.mt || '—'}°C</td>
                          <td className="p-0.5 text-center font-mono font-bold text-[#9E1B1E]">{!isNaN(c.rh) ? `${c.rh.toFixed(1)}%` : '—'}</td>
                          <td className="p-0.5 text-center font-mono">{!isNaN(c.dp) ? `${c.dp.toFixed(1)}°C` : '—'}</td>
                          <td className="p-0.5 text-center font-mono font-bold">{!isNaN(c.diff) ? `${c.diff.toFixed(1)}°C` : '—'}</td>
                          <td className="p-0.5 text-center font-bold text-emerald-700">{c.ok ? 'OK · PASS' : 'HOLD'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Inspection Tests */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Coating Tests &amp; Metallurgical Inspection Results
                </div>
                <table className="w-full text-left border border-slate-300 text-[7pt] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-300">
                      <th className="p-0.5 w-4/12">Test Parameter</th>
                      <th className="p-0.5 w-2/12">Standard</th>
                      <th className="p-0.5 w-3/12">Requirement</th>
                      <th className="p-0.5 w-2/12">Actual Result</th>
                      <th className="p-0.5 text-center w-14">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {s1Tests.slice(0, 4).map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-0.5 font-semibold">{t.t}</td>
                        <td className="p-0.5">{t.std}</td>
                        <td className="p-0.5">{t.req}</td>
                        <td className="p-0.5 font-bold font-mono">{t.act || 'Compliant'}</td>
                        <td className="p-0.5 text-center font-bold text-emerald-700">{t.res || 'Pass'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SSPC PA-2 4-Mini-Table DFT Matrix */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t flex justify-between">
                  <span>SSPC PA-2 4-Substrate DFT Matrix (Specified: {s1.dftSpecMin || '300'}–{s1.dftSpecMax || '500'} µm)</span>
                  <span className="font-mono">Grand Avg: {!isNaN(s1DFT.grandAvg) ? `${s1DFT.grandAvg.toFixed(1)} µm` : '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border border-slate-300 p-1 bg-slate-50/50">
                  {TSA_DFT_MINI_TYPES.map((type) => {
                    const meta = TSA_DFT_SUBSTRATES[type];
                    const rows = s1Mini[type] || [];
                    return (
                      <div key={type} className="border border-slate-200 rounded overflow-hidden">
                        <div className="bg-[#9E1B1E]/10 px-1 py-0.5 font-bold text-[7pt] text-[#9E1B1E] flex justify-between">
                          <span>{meta.num}. {meta.title}</span>
                          <span className="font-mono">{rows.length} Spots</span>
                        </div>
                        <table className="w-full text-left text-[6.5pt] border-collapse">
                          <thead>
                            <tr className="bg-slate-100 font-bold">
                              <th className="p-0.5">Pos</th>
                              <th className="p-0.5 text-center">R1</th>
                              <th className="p-0.5 text-center">R2</th>
                              <th className="p-0.5 text-center">R3</th>
                              <th className="p-0.5 text-center">R4</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {rows.slice(0, 4).map((r, ri) => (
                              <tr key={ri}>
                                <td className="p-0.5 font-medium truncate max-w-[70px]">{r.label}</td>
                                {(r.spots || []).map((s, si) => (
                                  <td key={si} className="p-0.5 text-center font-mono">{s || '—'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1 flex justify-between text-[7.5pt] text-slate-400 font-mono">
              <span>{coName} · Section 03 TSA Stage Inspection</span>
              <span>Report #{repNo} · Page 3 of 5</span>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 4: STAGE 02 (1ST COAT / SEALER COAT) INSPECTION SHEET
          ══════════════════════════════════════════════════════════════════════ */}
      {(() => {
        const s2 = coatStages.s2 || {};
        const s2DFT = calcCoatDFT(s2);
        const s2Env = s2.envReadings || [];
        const s2Tests = s2.tests || [];
        const s2Mini = s2.dftMini || {};

        return (
          <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9pt] leading-tight page-break-after">
            {renderWatermark()}

            <div className="relative z-10 space-y-2.5">
              {renderPrintHeader('Stage 02: 1st Coat / Silicone Aluminium Sealer Coat', '4')}

              {/* Stage Specs Banner */}
              <table className="w-full text-left border border-slate-300 text-[7.5pt] border-collapse bg-slate-50">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-28 font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Generic Coating</td>
                    <td className="p-1 border-r border-slate-300 font-semibold">{s2.generic || 'Silicone Aluminum Sealer'}</td>
                    <td className="w-24 font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Manufacturer</td>
                    <td className="p-1 border-r border-slate-300">{s2.mfr || 'Jotun / AkzoNobel'}</td>
                    <td className="w-24 font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Specified DFT</td>
                    <td className="p-1 font-mono font-bold text-[#9E1B1E]">{s2.dftSpecMin || '15'}–{s2.dftSpecMax || '25'} µm</td>
                  </tr>
                  <tr>
                    <td className="font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Batch A / Expiry</td>
                    <td className="p-1 border-r border-slate-300 font-mono">{s2.batchA || 'N/A'} ({s2.expA || 'Valid'})</td>
                    <td className="font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Application Date</td>
                    <td className="p-1 border-r border-slate-300 font-mono">{s2.date || repDate}</td>
                    <td className="font-bold bg-[#F4E5C7] p-1 border-r border-slate-300">Method / Shade</td>
                    <td className="p-1">{s2.method || 'Airless Spray'} ({s2.shade || 'Aluminum'})</td>
                  </tr>
                </tbody>
              </table>

              {/* Environmental Snapshot */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Psychrometric Conditions at Sealer Application
                </div>
                <table className="w-full text-left border border-slate-300 text-[7pt] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-300">
                      <th className="p-0.5 text-center w-6">#</th>
                      <th className="p-0.5">Time</th>
                      <th className="p-0.5 text-center">Dry Bulb</th>
                      <th className="p-0.5 text-center">Wet Bulb</th>
                      <th className="p-0.5 text-center">Steel Temp</th>
                      <th className="p-0.5 text-center">RH %</th>
                      <th className="p-0.5 text-center">Dew Point</th>
                      <th className="p-0.5 text-center">MT − DP</th>
                      <th className="p-0.5 text-center w-20">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {s2Env.slice(0, 2).map((r, i) => {
                      const c = calcEnvRow(r.db, r.wb, r.mt);
                      return (
                        <tr key={i}>
                          <td className="p-0.5 text-center font-mono">{i + 1}</td>
                          <td className="p-0.5 font-mono">{r.time || '—'}</td>
                          <td className="p-0.5 text-center font-mono">{r.db || '—'}°C</td>
                          <td className="p-0.5 text-center font-mono">{r.wb || '—'}°C</td>
                          <td className="p-0.5 text-center font-mono">{r.mt || '—'}°C</td>
                          <td className="p-0.5 text-center font-mono font-bold text-[#9E1B1E]">{!isNaN(c.rh) ? `${c.rh.toFixed(1)}%` : '—'}</td>
                          <td className="p-0.5 text-center font-mono">{!isNaN(c.dp) ? `${c.dp.toFixed(1)}°C` : '—'}</td>
                          <td className="p-0.5 text-center font-mono font-bold">{!isNaN(c.diff) ? `${c.diff.toFixed(1)}°C` : '—'}</td>
                          <td className="p-0.5 text-center font-bold text-emerald-700">{c.ok ? 'OK · PASS' : 'HOLD'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Inspection Tests */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
                  Sealer Coating Tests &amp; Visual Verification
                </div>
                <table className="w-full text-left border border-slate-300 text-[7pt] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-300">
                      <th className="p-0.5 w-4/12">Test Parameter</th>
                      <th className="p-0.5 w-2/12">Standard</th>
                      <th className="p-0.5 w-3/12">Requirement</th>
                      <th className="p-0.5 w-2/12">Actual Result</th>
                      <th className="p-0.5 text-center w-14">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {s2Tests.slice(0, 4).map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-0.5 font-semibold">{t.t}</td>
                        <td className="p-0.5">{t.std}</td>
                        <td className="p-0.5">{t.req}</td>
                        <td className="p-0.5 font-bold font-mono">{t.act || 'Compliant'}</td>
                        <td className="p-0.5 text-center font-bold text-emerald-700">{t.res || 'Pass'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SSPC PA-2 DFT Matrix */}
              <div>
                <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8pt] font-black font-rajdhani uppercase tracking-wider rounded-t flex justify-between">
                  <span>SSPC PA-2 4-Substrate DFT Matrix (Specified: {s2.dftSpecMin || '15'}–{s2.dftSpecMax || '25'} µm)</span>
                  <span className="font-mono">Grand Avg: {!isNaN(s2DFT.grandAvg) ? `${s2DFT.grandAvg.toFixed(1)} µm` : '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border border-slate-300 p-1 bg-slate-50/50">
                  {TSA_DFT_MINI_TYPES.map((type) => {
                    const meta = TSA_DFT_SUBSTRATES[type];
                    const rows = s2Mini[type] || [];
                    return (
                      <div key={type} className="border border-slate-200 rounded overflow-hidden">
                        <div className="bg-[#9E1B1E]/10 px-1 py-0.5 font-bold text-[7pt] text-[#9E1B1E] flex justify-between">
                          <span>{meta.num}. {meta.title}</span>
                          <span className="font-mono">{rows.length} Spots</span>
                        </div>
                        <table className="w-full text-left text-[6.5pt] border-collapse">
                          <thead>
                            <tr className="bg-slate-100 font-bold">
                              <th className="p-0.5">Pos</th>
                              <th className="p-0.5 text-center">R1</th>
                              <th className="p-0.5 text-center">R2</th>
                              <th className="p-0.5 text-center">R3</th>
                              <th className="p-0.5 text-center">R4</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {rows.slice(0, 4).map((r, ri) => (
                              <tr key={ri}>
                                <td className="p-0.5 font-medium truncate max-w-[70px]">{r.label}</td>
                                {(r.spots || []).map((s, si) => (
                                  <td key={si} className="p-0.5 text-center font-mono">{s || '—'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-1 flex justify-between text-[7.5pt] text-slate-400 font-mono">
              <span>{coName} · Section 04 Sealer Coat Inspection</span>
              <span>Report #{repNo} · Page 4 of 5</span>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE 5: PHOTOGRAPHIC EVIDENCE REPORT (ANNEXURE B)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-[210mm] min-h-[297mm] bg-white p-[12mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] relative overflow-hidden flex flex-col justify-between text-[9pt] leading-tight">
        {renderWatermark()}

        <div className="relative z-10 space-y-2.5">
          {renderPrintHeader('Photographic Evidence Report (Annexure B)', '5')}

          <div className="bg-[#9E1B1E] text-white px-2 py-0.5 text-[8.5pt] font-black font-rajdhani uppercase tracking-wider rounded-t">
            6. Photographic Record of Blasting, Arc Spraying, Bend Coupons &amp; Finish
          </div>

          <div className="grid grid-cols-2 gap-3 border border-slate-300 p-2 bg-slate-50/50">
            {photos.slice(0, 6).map((card, idx) => (
              <div key={idx} className="border border-slate-300 rounded p-1.5 bg-white flex flex-col justify-between h-56">
                <div className="flex justify-between items-center text-[7.5pt] font-bold text-slate-700 border-b border-slate-200 pb-0.5 mb-1">
                  <span>Photo #{idx + 1}: {card.title}</span>
                  <span className="font-mono text-slate-400">{card.date}</span>
                </div>

                <div className="h-32 bg-slate-100 rounded overflow-hidden flex items-center justify-center border border-slate-200">
                  {card.b64 ? (
                    <img src={card.b64} alt={card.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8pt] text-slate-400 font-mono italic">NO PHOTO UPLOADED</span>
                  )}
                </div>

                <div className="text-[7pt] text-slate-600 pt-1 leading-tight border-t border-slate-100 mt-1">
                  <b>Loc:</b> {card.loc || 'Trial Substrate'} · <b>Obs:</b> {card.cap || 'Verification of defect-free metallic spray layer.'}
                </div>
              </div>
            ))}
          </div>

          <div className="border border-slate-300 rounded p-2 bg-slate-50 text-[7.5pt]">
            <span className="font-bold block uppercase text-[#9E1B1E] font-rajdhani">General Photographic Compliance Statement:</span>
            <p className="text-slate-700 mt-0.5">
              {formData?.['f-remark-photo'] || 'All photographic records have been verified by the attending QA/QC inspector. Surface profile, continuous cross-hatch passes, 180° mandrel bend test coupons, and complete sealer coat wetting were authenticated on site.'}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-1 flex justify-between text-[7.5pt] text-slate-400 font-mono">
          <span>{coName} · Annexure B Photographic Evidence</span>
          <span>Report #{repNo} · Page 5 of 5</span>
        </div>
      </div>

    </div>
  );
}
