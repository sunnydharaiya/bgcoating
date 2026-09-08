// src/tools/painter/PainterVerdictApproval.jsx
import React, { useRef } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  FileCheck2, 
  UserCheck, 
  Building2 
} from 'lucide-react';

export default function PainterVerdictApproval({
  formData,
  onChange,
  evaluation,
  onOpenApprovalModal,
  onStampUpload,
  onStampRemove
}) {
  const {
    postPct = 0,
    imp = 0,
    chkPct = 0,
    chkFail = 0,
    inspPct = 0,
    totalInspFail = 0,
    dftSpotsOK = 0,
    dftSpotsValid = 0,
    overallDFTAvg = NaN,
    totalEnvValid = 0,
    okEnvCount = 0,
    overall = 0,
    verdict = 'PENDING'
  } = evaluation || {};

  const name = formData?.['f-name'] || 'Operator';
  const category = formData?.['f-category'] || 'Airless Spray Painter';
  const civil = formData?.['f-civil'] || '—';
  const exp = formData?.['f-exp'] || '—';

  const sigStamps = formData?._sigStamps || { 1: null, 2: null, 3: null };

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  // 6-Tier Evaluation Matrix Data
  const dftCompliant = dftSpotsValid === 0 || (dftSpotsOK === dftSpotsValid && !isNaN(overallDFTAvg));
  const envCompliant = totalEnvValid === 0 || okEnvCount === totalEnvValid;

  const criteriaRows = [
    {
      name: 'Post-Test Theoretical Examination',
      weight: '25%',
      threshold: '≥ 80%',
      actual: `${postPct.toFixed(0)}%`,
      passed: postPct >= 80
    },
    {
      name: 'Knowledge Gain Improvement Index (Δ%)',
      weight: '10%',
      threshold: '≥ 15%',
      actual: `${imp >= 0 ? '+' : ''}${imp.toFixed(0)}%`,
      passed: imp >= 15
    },
    {
      name: 'Practical Assessment Checklist Compliance',
      weight: '20%',
      threshold: '≥ 80% & 0 Fails',
      actual: `${chkPct.toFixed(0)}% (${chkFail} Fails)`,
      passed: chkPct >= 80 && chkFail === 0
    },
    {
      name: 'DFT SSPC PA-2 Measurement Compliance',
      weight: '20%',
      threshold: '80%–120% Band & 0 Outliers',
      actual: dftSpotsValid === 0 ? '—' : `${dftSpotsOK}/${dftSpotsValid} Spots In Range (${isNaN(overallDFTAvg) ? '—' : overallDFTAvg.toFixed(1)} µm)`,
      passed: dftCompliant
    },
    {
      name: 'Multi-Coat Process Inspection Pass Rate',
      weight: '15%',
      threshold: '≥ 80% & 0 Fails',
      actual: `${inspPct.toFixed(0)}% (${totalInspFail} Fails)`,
      passed: inspPct >= 80 && totalInspFail === 0
    },
    {
      name: 'Environmental Psychrometric Parameters',
      weight: '10%',
      threshold: 'RH ≤ 85%, MT − DP ≥ 3.0°C',
      actual: totalEnvValid === 0 ? '—' : `${okEnvCount}/${totalEnvValid} Readings OK`,
      passed: envCompliant
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Official Verdict Header Stamp Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E87B1E]/10 text-[#9E1B1E] border border-[#E87B1E]/30 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#F39322]" />
            Official Qualification Verdict
          </div>

          <h2 className="text-2xl font-black text-slate-800 font-rajdhani">
            {name} — <span className="text-[#E87B1E]">{category}</span>
          </h2>
          
          <p className="text-xs text-slate-500">
            Civil ID: <span className="font-mono font-bold text-slate-700">{civil}</span> · Experience: <span className="font-bold text-slate-700">{exp} years</span> · Project: <span className="font-bold text-slate-700">{formData?.['f-proj'] || '—'}</span>
          </p>
        </div>

        {/* Rubber Stamp Emblem Badge */}
        <div
          className={`border-4 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[190px] transform -rotate-1 shadow-md transition-all ${
            verdict === 'PASS'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
              : verdict === 'FAIL'
              ? 'border-rose-600 bg-rose-50 text-rose-800'
              : 'border-amber-500 bg-amber-50 text-amber-900'
          }`}
        >
          <div className="text-2xl font-black font-rajdhani tracking-widest uppercase flex items-center gap-2">
            {verdict === 'PASS' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : verdict === 'FAIL' ? (
              <AlertCircle className="w-6 h-6 text-rose-600" />
            ) : (
              <Clock className="w-6 h-6 text-amber-600 animate-spin" />
            )}
            <span>{verdict === 'PENDING' ? 'PENDING' : verdict}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1 border-t border-current pt-1 w-full text-center">
            {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
          </span>
          <span className="text-[9px] font-mono text-slate-500 mt-1">
            Score: {overall.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 6-Tier Criteria Evaluation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              6-Tier Qualification Criteria Matrix (Weights &amp; Evaluation)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Weight: 100%</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white font-rajdhani uppercase text-[11px] tracking-wider">
                <th className="p-2.5 text-center w-12">#</th>
                <th className="p-2.5">Evaluation Parameter</th>
                <th className="p-2.5 text-center w-20">Weight</th>
                <th className="p-2.5 text-center w-36">Required Threshold</th>
                <th className="p-2.5 text-center w-48">Actual Recorded Score</th>
                <th className="p-2.5 text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {criteriaRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/30 transition">
                  <td className="p-2.5 text-center font-mono font-bold text-slate-600">
                    0{idx + 1}
                  </td>
                  <td className="p-2.5 font-medium text-slate-800">
                    {row.name}
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-600">
                    {row.weight}
                  </td>
                  <td className="p-2.5 text-center font-mono text-slate-600">
                    {row.threshold}
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-800">
                    {row.actual}
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        row.passed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.passed ? 'MET ✓' : 'NOT MET'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-amber-100 to-amber-50 font-bold text-slate-800 font-rajdhani text-sm border-t-2 border-[#E87B1E]">
                <td colSpan="2" className="p-3 uppercase font-black text-[#9E1B1E]">
                  Overall Weighted Composite Score
                </td>
                <td className="p-3 text-center font-mono font-black">100%</td>
                <td className="p-3 text-center font-mono font-bold">≥ 80.0%</td>
                <td className="p-3 text-center font-mono font-black text-lg text-[#9E1B1E]">
                  {overall.toFixed(1)}%
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                      verdict === 'PASS'
                        ? 'bg-emerald-600 text-white'
                        : verdict === 'FAIL'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-slate-900'
                    }`}
                  >
                    {verdict}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3 Signatory Authorization Blocks */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Signatory Authorization &amp; Digital Stamps
            </h3>
          </div>
          <span className="text-xs text-slate-500">3-party endorsement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Signatory 1: Evaluated By (Painter) */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-rajdhani block mb-2">
                1. Performed By (Spray Painter)
              </span>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Name &amp; Designation
                  </label>
                  <input
                    type="text"
                    value={formData?.['sig1-name'] || ''}
                    onChange={(e) => handleInputChange('sig1-name', e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded p-2 focus:border-[#E87B1E] outline-none"
                    placeholder="Mohammad Tariq / Spray Painter"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData?.['sig1-date'] || ''}
                    onChange={(e) => handleInputChange('sig1-date', e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded p-2 focus:border-[#E87B1E] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stamp Box */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Signature / Stamp
              </label>
              <div className="h-20 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center relative overflow-hidden group">
                {sigStamps[1] ? (
                  <>
                    <img src={sigStamps[1]} alt="Stamp 1" className="h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => onStampRemove(1)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer text-center text-slate-400 hover:text-slate-600 transition p-2">
                    <Upload className="w-5 h-5 mx-auto mb-0.5" />
                    <span className="text-[10px] font-bold uppercase">Affix Stamp</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onStampUpload(1, e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Signatory 2: QA/QC Inspector */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-rajdhani block mb-2">
                2. QA/QC Coating Inspector
              </span>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Name &amp; Certification (NACE/AMPP/BGAS)
                  </label>
                  <input
                    type="text"
                    value={formData?.['sig2-name'] || ''}
                    onChange={(e) => handleInputChange('sig2-name', e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded p-2 focus:border-[#E87B1E] outline-none"
                    placeholder="Rajesh Patel / QC Inspector (NACE L3 #48291)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData?.['sig2-date'] || ''}
                    onChange={(e) => handleInputChange('sig2-date', e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded p-2 focus:border-[#E87B1E] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stamp Box */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                QC Inspector Stamp &amp; Seal
              </label>
              <div className="h-20 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center relative overflow-hidden group">
                {sigStamps[2] ? (
                  <>
                    <img src={sigStamps[2]} alt="Stamp 2" className="h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => onStampRemove(2)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer text-center text-slate-400 hover:text-slate-600 transition p-2">
                    <Upload className="w-5 h-5 mx-auto mb-0.5" />
                    <span className="text-[10px] font-bold uppercase">Affix Inspector Stamp</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onStampUpload(2, e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Signatory 3: Client Representative */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-rajdhani block mb-2">
                3. Client / Third Party Approval
              </span>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Name &amp; Client Organization
                  </label>
                  <input
                    type="text"
                    value={formData?.['sig3-name'] || ''}
                    onChange={(e) => handleInputChange('sig3-name', e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded p-2 focus:border-[#E87B1E] outline-none"
                    placeholder="David Miller / Client Rep (Lead Marine Engineer)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData?.['sig3-date'] || ''}
                    onChange={(e) => handleInputChange('sig3-date', e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded p-2 focus:border-[#E87B1E] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stamp Box */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Client Stamp &amp; Endorsement
              </label>
              <div className="h-20 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center relative overflow-hidden group">
                {sigStamps[3] ? (
                  <>
                    <img src={sigStamps[3]} alt="Stamp 3" className="h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => onStampRemove(3)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer text-center text-slate-400 hover:text-slate-600 transition p-2">
                    <Upload className="w-5 h-5 mx-auto mb-0.5" />
                    <span className="text-[10px] font-bold uppercase">Affix Client Stamp</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onStampUpload(3, e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Final Qualification Remarks & Certification Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Final Qualification Summary Remarks &amp; Limitations
          </label>
          <textarea
            rows={3}
            value={formData?.['f-remark-final'] || ''}
            onChange={(e) => handleInputChange('f-remark-final', e.target.value)}
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
            placeholder="Document any conditional scopes, certified equipment types, or required refresher periods..."
          />
        </div>

        {/* Validate & Sign-Off Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onOpenApprovalModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-md transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>✓ Validate &amp; Approve Qualification Dossier</span>
          </button>
        </div>
      </div>

    </div>
  );
}
