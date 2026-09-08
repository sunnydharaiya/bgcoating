import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Upload, 
  Trash2, 
  Calendar, 
  User, 
  FileCheck,
  Building,
  Sparkles,
  Lock
} from 'lucide-react';

export default function TsaVerdictApproval({
  formData,
  onChange,
  evaluation,
  onOpenApprovalModal,
  onStampUpload,
  onStampRemove
}) {
  const verdict = evaluation?.verdict || 'PENDING';
  const overall = (evaluation?.overall || 0).toFixed(1);
  const chk = evaluation?.chk || { pass: 0, fail: 0, na: 0, pct: 0 };
  const dft = evaluation?.dft || { valid: 0, ok: 0, pct: 0, finalOK: false };
  const insp = evaluation?.insp || { pass: 0, fail: 0, na: 0, pct: 0 };
  const env = evaluation?.env || { valid: 0, ok: 0, pct: 0, finalOK: true };

  const isApproved = formData?.['f-status'] === 'Approved';

  const CRITERIA = [
    {
      name: 'Assessment Checklist Compliance',
      weight: '35%',
      req: '≥ 80.0% & 0 Critical Failures',
      actual: `${chk.pct.toFixed(0)}% (${chk.pass}/${chk.pass + chk.fail} Items)`,
      status: chk.pct >= 80 && chk.fail === 0
    },
    {
      name: 'DFT Compliance (SSPC PA-2)',
      weight: '30%',
      req: '≥ 90.0% Spots within 80%–120% Bound',
      actual: dft.valid > 0 ? `${dft.pct.toFixed(0)}% in spec (${dft.ok}/${dft.valid} spots)` : '— No DFT Readings',
      status: dft.finalOK
    },
    {
      name: 'Process Inspection Pass Rate',
      weight: '20%',
      req: '≥ 80.0% & 0 Inspection Test Fails',
      actual: `${insp.pct.toFixed(0)}% (${insp.pass}/${insp.pass + insp.fail} Tests)`,
      status: insp.pct >= 80 && insp.fail === 0
    },
    {
      name: 'Environmental Psychrometrics',
      weight: '15%',
      req: 'RH ≤ 85% & Steel Temp (MT) − DP ≥ 3.0°C',
      actual: env.valid > 0 ? `${env.ok}/${env.valid} Hourly Readings OK` : '— Valid Holding Period',
      status: env.finalOK
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Section: Rubber Stamp & Overall Verdict Emblem */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition-all ${
        verdict === 'PASS'
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30'
          : verdict === 'FAIL'
          ? 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/30'
          : 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Award className="w-4 h-4 text-[#E87B1E]" />
              <span>AWS C2.23M / ISO 2063-2 Official Qualification Verdict</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Operator: <span className="text-[#E87B1E]">{formData?.['f-name'] || 'Operator Name'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Civil ID: <b>{formData?.['f-civil'] || '—'}</b> · Category: <b>{formData?.['f-category'] || 'TSA Operator'}</b> · Experience: <b>{formData?.['f-exp'] || '—'} Years</b> · Project: <b>{formData?.['f-proj'] || '—'}</b>
            </p>
          </div>

          {/* Rubber Stamp Badge */}
          <div className={`relative px-8 py-5 rounded-3xl border-4 font-mono text-center rotate-[-2deg] shadow-xl ${
            verdict === 'PASS'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-emerald-500/20'
              : verdict === 'FAIL'
              ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 shadow-rose-500/20'
              : 'border-amber-600 bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shadow-amber-500/20'
          }`}>
            <div className="text-[10px] uppercase font-black tracking-widest opacity-80">
              BG GROUP VERIFICATION
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight my-0.5">
              {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
            </div>
            <div className="text-xs font-extrabold">
              SCORE: {overall}% · {verdict === 'PASS' ? 'AWS C2.23M COMPLIANT' : 'RETEST REQUIRED'}
            </div>
          </div>

        </div>
      </div>

      {/* 4-Tier Weighted Criteria Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-[#E87B1E]" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            4-Tier Qualification Evaluation Criteria Matrix
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3">Evaluation Pillar</th>
                <th className="p-3 text-center w-24">Weight</th>
                <th className="p-3">Qualification Requirement</th>
                <th className="p-3">Actual Achieved Finding</th>
                <th className="p-3 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {CRITERIA.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {c.name}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-[#E87B1E]">
                    {c.weight}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {c.req}
                  </td>
                  <td className="p-3 font-semibold font-mono text-slate-800 dark:text-slate-100">
                    {c.actual}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      c.status
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {c.status ? 'MEETS CRITERIA' : 'DEFICIENT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FDF1E6] dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 border-t-2 border-[#E87B1E]/40">
                <td className="p-3 text-[#E87B1E] uppercase">Total Weighted Score:</td>
                <td className="p-3 text-center font-mono text-[#E87B1E]">100%</td>
                <td colSpan={2} className="p-3">Qualifying Benchmark: Overall Score ≥ 80.0% with Zero Gating Fails</td>
                <td className="p-3 text-center font-mono text-base text-[#E87B1E] font-black">{overall}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3 Digital Signatures & Stamp Blocks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <FileCheck className="w-5 h-5 text-[#E87B1E]" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Signatory Endorsements & Digital Stamp Authorization
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Signatory 1: Operator / Specialist */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Signatory 01 · Performed By
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                TSA Operator / Specialist
              </span>
            </div>

            {/* Digital Stamp Area */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-2 group">
              {formData?.sigStamps?.[1] ? (
                <>
                  <img
                    src={formData.sigStamps[1]}
                    alt="Stamp 1"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onStampRemove?.(1)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Upload className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500">Upload Operator Stamp</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onStampUpload?.(1, e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={formData?.['sig1-name'] || ''}
                onChange={(e) => onChange?.('sig1-name', e.target.value)}
                placeholder="Name / Title"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
              />
              <input
                type="date"
                value={formData?.['sig1-date'] || ''}
                onChange={(e) => onChange?.('sig1-date', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>
          </div>

          {/* Signatory 2: Lead QA/QC Inspector */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Signatory 02 · Verified By
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                Lead NACE / AMPP Level III Inspector
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-2 group">
              {formData?.sigStamps?.[2] ? (
                <>
                  <img
                    src={formData.sigStamps[2]}
                    alt="Stamp 2"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onStampRemove?.(2)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Upload className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500">Upload QA/QC Stamp</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onStampUpload?.(2, e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={formData?.['sig2-name'] || ''}
                onChange={(e) => onChange?.('sig2-name', e.target.value)}
                placeholder="Name / NACE Cert #"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
              />
              <input
                type="date"
                value={formData?.['sig2-date'] || ''}
                onChange={(e) => onChange?.('sig2-date', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>
          </div>

          {/* Signatory 3: Client / Third-Party Surveyor */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Signatory 03 · Approved By
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                Client / Third-Party Surveyor
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-2 group">
              {formData?.sigStamps?.[3] ? (
                <>
                  <img
                    src={formData.sigStamps[3]}
                    alt="Stamp 3"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => onStampRemove?.(3)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Upload className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500">Upload Client Stamp</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onStampUpload?.(3, e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={formData?.['sig3-name'] || ''}
                onChange={(e) => onChange?.('sig3-name', e.target.value)}
                placeholder="Name / Organization"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
              />
              <input
                type="date"
                value={formData?.['sig3-date'] || ''}
                onChange={(e) => onChange?.('sig3-date', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Validate & Approve Action Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-700">
        <div>
          <h4 className="text-base font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E87B1E]" />
            <span>Official Report Issuance & Authorization</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Clicking Validate & Approve will officially stamp the report, generate the permanent Report No, and lock the record in the Master Register.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenApprovalModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white font-extrabold text-sm shadow-lg shadow-[#E87B1E]/30 hover:opacity-95 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>✓ Validate & Approve Dossier</span>
        </button>
      </div>

    </div>
  );
}
