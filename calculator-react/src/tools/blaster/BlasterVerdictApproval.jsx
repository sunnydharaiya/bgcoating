import React, { useRef } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  Save,
  Printer,
  Upload,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function BlasterVerdictApproval({
  state,
  onChange,
  metrics,
  onNavigate,
  onSaveDraft,
  onApprove,
  onOpenPreview
}) {
  const {
    postPct,
    improvement,
    chkPct,
    chkFail,
    inspPct,
    inspFail,
    envFinalOK,
    envTotalValid,
    isProfPass,
    overallScore,
    verdict,
    verdictStatus
  } = metrics;

  const sig1FileRef = useRef(null);
  const sig2FileRef = useRef(null);
  const sig3FileRef = useRef(null);

  const handleStampUpload = (sigNum, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(`sig${sigNum}Stamp`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveStamp = (sigNum) => {
    onChange(`sig${sigNum}Stamp`, '');
  };

  // Criteria Verification Statuses
  const c1Met = postPct >= 80;
  const c2Met = improvement >= 15;
  const c3Met = chkPct >= 80 && chkFail === 0;
  const c4Met = inspPct >= 80 && inspFail === 0;
  const c5Met = (envTotalValid === 0 || envFinalOK) && isProfPass;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 06 · Step 6 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Final Qualification Verdict &amp; Authorization Signatures
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated 5-tier evaluation matrix · Official qualification stamp · 3-signatory digital authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Validate &amp; Sign-off</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Rubber Stamp Card */}
      <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all ${
        verdict === 'PASS'
          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500'
          : verdict === 'FAIL'
          ? 'bg-red-50/70 dark:bg-red-950/30 border-red-500'
          : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Operator Bio Summary */}
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
              Official Assessment Decision
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {state.operatorName || 'Operator'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Trade: <b className="text-[#E8700A]">{state.category || 'Blaster'}</b> &nbsp;·&nbsp;
              Civil ID: <span className="font-mono font-bold">{state.civilId || '—'}</span> &nbsp;·&nbsp;
              Experience: <b>{state.experienceYears || 0} Years</b>
            </p>
            <div className="text-[11px] text-slate-500">
              Project: <span className="font-semibold text-slate-700 dark:text-slate-300">{state.projectName}</span>
            </div>
          </div>

          {/* Rubber Stamp Emblem */}
          <div className="shrink-0 flex flex-col items-center">
            <div className={`w-36 h-20 rounded-xl border-4 flex flex-col items-center justify-center p-2 transform -rotate-3 transition shadow-md font-mono ${
              verdict === 'PASS'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : verdict === 'FAIL'
                ? 'border-red-600 text-red-700 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
            }`}>
              <span className="text-2xl font-black tracking-widest">
                {verdict}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
              </span>
            </div>

            <span className="text-[10px] font-mono text-slate-400 mt-2">
              Weighted Score: <b className="text-slate-800 dark:text-slate-200">{overallScore.toFixed(1)}%</b>
            </span>
          </div>

        </div>
      </div>

      {/* 5-Tier Criteria Evaluation Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Award className="w-4 h-4 text-[#E8700A]" />
          <span>Automated Qualification Criteria Matrix (Weights &amp; Thresholds)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Evaluation Parameter</th>
                <th className="py-2.5 px-3 w-20 text-center">Weight</th>
                <th className="py-2.5 px-4">Acceptance Threshold</th>
                <th className="py-2.5 px-3 text-center">Actual Score</th>
                <th className="py-2.5 px-3 text-center w-24">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Criterion 1: Post-Test */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  1. Post-Training Examination
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">30%</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">≥ 80% (20 / 25 Questions)</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">{postPct.toFixed(0)}%</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    c1Met ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {c1Met ? 'PASS' : 'FAIL'}
                  </span>
                </td>
              </tr>

              {/* Criterion 2: Improvement */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  2. Training Knowledge Improvement ($\Delta\%$)
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">10%</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">≥ 15% Knowledge Gain</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">+{improvement.toFixed(0)}%</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    c2Met ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {c2Met ? 'PASS' : 'MARGINAL'}
                  </span>
                </td>
              </tr>

              {/* Criterion 3: Checklist */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  3. Assessment Checklist Compliance
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">25%</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">≥ 80% Compliant &amp; 0 Critical Fails</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">{chkPct.toFixed(0)}% ({chkFail} Fail)</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    c3Met ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {c3Met ? 'PASS' : 'FAIL'}
                  </span>
                </td>
              </tr>

              {/* Criterion 4: Inspection */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  4. Practical Process Inspection Pass Rate
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">25%</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">≥ 80% Pass Rate &amp; 0 Critical Fails</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">{inspPct.toFixed(0)}%</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    c4Met ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {c4Met ? 'PASS' : 'FAIL'}
                  </span>
                </td>
              </tr>

              {/* Criterion 5: Environmental & Profile */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  5. Environmental &amp; Anchor Profile Limits
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">10%</td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-mono">RH ≤ 85% &nbsp;·&nbsp; MT−DP ≥ 3°C &nbsp;·&nbsp; Profile OK</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">{envFinalOK ? 'OK' : 'VERIFIED'}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    c5Met ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                  }`}>
                    {c5Met ? 'PASS' : 'FAIL'}
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 3-Signatory Authorization Blocks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <ShieldCheck className="w-4 h-4 text-[#E8700A]" />
          <span>Formal Authorization &amp; Signatory Verification</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Signatory 1: Performed By */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8700A] block">
                01. Performed / Evaluated By
              </span>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Name &amp; Designation</label>
                <input
                  type="text"
                  value={state.sig1Name}
                  onChange={(e) => onChange('sig1Name', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Signing Date</label>
                <input
                  type="date"
                  value={state.sig1Date}
                  onChange={(e) => onChange('sig1Date', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            {/* Stamp Slot */}
            <div className="space-y-1.5 pt-2">
              <div className="relative w-full h-20 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                {state.sig1Stamp ? (
                  <>
                    <img src={state.sig1Stamp} alt="Stamp" className="max-h-full object-contain p-1" />
                    <button
                      onClick={() => handleRemoveStamp(1)}
                      className="absolute top-1 right-1 p-1 rounded bg-red-600 text-white text-[10px] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                    <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                    <span className="text-[10px] font-bold text-[#E8700A]">Upload Digital Stamp</span>
                    <input
                      ref={sig1FileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStampUpload(1, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Signatory 2: QA/QC Inspector */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                02. QA/QC Manager / Inspector
              </span>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Name &amp; Cert Ref</label>
                <input
                  type="text"
                  value={state.sig2Name}
                  onChange={(e) => onChange('sig2Name', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Signing Date</label>
                <input
                  type="date"
                  value={state.sig2Date}
                  onChange={(e) => onChange('sig2Date', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            {/* Stamp Slot */}
            <div className="space-y-1.5 pt-2">
              <div className="relative w-full h-20 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                {state.sig2Stamp ? (
                  <>
                    <img src={state.sig2Stamp} alt="Stamp" className="max-h-full object-contain p-1" />
                    <button
                      onClick={() => handleRemoveStamp(2)}
                      className="absolute top-1 right-1 p-1 rounded bg-red-600 text-white text-[10px] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                    <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                    <span className="text-[10px] font-bold text-emerald-600">Upload Digital Stamp</span>
                    <input
                      ref={sig2FileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStampUpload(2, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Signatory 3: Client Representative */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                03. Client Representative / TPI
              </span>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Name &amp; Organization</label>
                <input
                  type="text"
                  value={state.sig3Name}
                  onChange={(e) => onChange('sig3Name', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Signing Date</label>
                <input
                  type="date"
                  value={state.sig3Date}
                  onChange={(e) => onChange('sig3Date', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            {/* Stamp Slot */}
            <div className="space-y-1.5 pt-2">
              <div className="relative w-full h-20 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                {state.sig3Stamp ? (
                  <>
                    <img src={state.sig3Stamp} alt="Stamp" className="max-h-full object-contain p-1" />
                    <button
                      onClick={() => handleRemoveStamp(3)}
                      className="absolute top-1 right-1 p-1 rounded bg-red-600 text-white text-[10px] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                    <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                    <span className="text-[10px] font-bold text-blue-600">Upload Digital Stamp</span>
                    <input
                      ref={sig3FileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStampUpload(3, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Navigation & Preview */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate('summary')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
        >
          <span>View Executive Summary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] text-white text-xs font-bold transition shadow-md hover:shadow-[#E8700A]/30 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Printable A4 Dossier</span>
          </button>
        </div>
      </div>

    </div>
  );
}
