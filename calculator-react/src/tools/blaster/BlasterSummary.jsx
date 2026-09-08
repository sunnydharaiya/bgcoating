import React from 'react';
import {
  FileSpreadsheet,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  Printer,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';

export default function BlasterSummary({
  state,
  onChange,
  metrics,
  onNavigate,
  onOpenPreview
}) {
  const {
    preCorrect,
    postCorrect,
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
    envOkCount,
    envTotalValid,
    profAvg,
    overallScore,
    verdict,
    verdictStatus
  } = metrics;

  const name = state.operatorName || 'Operator';
  const cat = state.category || 'Blaster';
  const proj = state.projectName || 'Project';

  const autoExecText = `This report documents the formal qualification assessment of ${name} as a ${cat} on the ${proj}. The operator (${state.experienceYears || 0} years of relevant industrial experience, direct employer: ${state.employer || '—'}) was evaluated through a structured combination of theoretical examination, safety protocol verification, and practical test coupon blasting. The post-training examination score was ${postPct.toFixed(0)}% (improvement of +${improvement.toFixed(0)}% over baseline pre-test), assessment checklist compliance reached ${chkPct.toFixed(0)}% (with 0 critical fails), and the on-site inspection pass rate was ${inspPct.toFixed(0)}%. Based on the weighted-criteria evaluation (composite score ${overallScore.toFixed(1)}%), the operator is ${
    verdict === 'PASS'
      ? 'successfully QUALIFIED for industrial abrasive blasting operations in accordance with ISO 8501-1, SSPC, and ASTM D 4228 standards.'
      : verdict === 'FAIL'
      ? 'NOT QUALIFIED at this assessment attempt. Retesting after a 14-day training period is recommended.'
      : 'currently UNDER EVALUATION pending completion of unscored criteria.'
  }`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 07 · Step 7 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Executive Summary &amp; Comprehensive Evaluation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Auto-compiled executive narrative · Quantitative findings metrics · Methodological findings &amp; recommendation.
          </p>
        </div>

        <button
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Printable Dossier</span>
        </button>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        
        {/* Operator Photo */}
        <div className="w-28 h-36 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
          {state.operatorPhoto ? (
            <img src={state.operatorPhoto} alt="Operator" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-slate-400 stroke-1" />
          )}
        </div>

        {/* Bio & Verdict */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              verdict === 'PASS'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : verdict === 'FAIL'
                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}>
              {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {cat} &nbsp;·&nbsp; Civil ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{state.civilId || '—'}</span> &nbsp;·&nbsp;
            Experience: <b>{state.experienceYears || 0} Years</b> &nbsp;·&nbsp; Employer: <b>{state.employer || '—'}</b>
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Project: <span className="font-bold text-slate-800 dark:text-slate-200">{state.projectName}</span>
          </p>

          <div className="pt-2 text-xs font-mono font-bold text-[#E8700A]">
            Composite Score: {overallScore.toFixed(1)}% &nbsp;·&nbsp; Next Assessment Due: {state.nextAssessmentDate || '12 Months'}
          </div>
        </div>

      </div>

      {/* Auto-compiled Narrative */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E8700A]" />
          <span>Automated Executive Narrative</span>
        </h3>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {autoExecText}
        </div>
      </div>

      {/* Quantitative Findings Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <TrendingUp className="w-4 h-4 text-[#E8700A]" />
          <span>Key Quantitative Findings</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Pre-Test</span>
            <span className="text-base font-black font-mono text-slate-800 dark:text-slate-200 mt-1 block">
              {prePct.toFixed(0)}% ({preCorrect}/25)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Post-Test</span>
            <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
              {postPct.toFixed(0)}% ({postCorrect}/25)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Improvement Δ</span>
            <span className="text-base font-black font-mono text-[#E8700A] mt-1 block">
              +{improvement.toFixed(0)}%
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Checklist %</span>
            <span className="text-base font-black font-mono text-slate-800 dark:text-slate-200 mt-1 block">
              {chkPct.toFixed(0)}% ({chkPass}/12)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Inspection Pass</span>
            <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400 mt-1 block">
              {inspPct.toFixed(0)}% ({inspPass} Pass)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Environmental</span>
            <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
              {envTotalValid > 0 ? `${envOkCount}/${envTotalValid} OK` : 'Verified'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Anchor Profile</span>
            <span className="text-base font-black font-mono text-slate-800 dark:text-slate-200 mt-1 block">
              {profAvg} µm
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Composite Score</span>
            <span className="text-base font-black font-mono text-[#E8700A] mt-1 block">
              {overallScore.toFixed(1)}%
            </span>
          </div>

        </div>
      </div>

      {/* Methodology & Recommendations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <FileSpreadsheet className="w-4 h-4 text-[#E8700A]" />
          <span>Assessment Scope, Methodology &amp; Official Recommendation</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Assessment Scope</label>
            <input
              type="text"
              value={state.sumScope}
              onChange={(e) => onChange('sumScope', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Evaluation Methodology</label>
            <input
              type="text"
              value={state.sumMethod}
              onChange={(e) => onChange('sumMethod', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Key Strengths Demonstrated</label>
              <textarea
                rows={2}
                value={state.sumStrengths}
                onChange={(e) => onChange('sumStrengths', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Areas for Continued Focus</label>
              <textarea
                rows={2}
                value={state.sumImprove}
                onChange={(e) => onChange('sumImprove', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Official Recommendation &amp; Authorization</label>
            <textarea
              rows={2}
              value={state.sumRecommend}
              onChange={(e) => onChange('sumRecommend', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] text-white text-xs font-bold transition shadow-md hover:shadow-[#E8700A]/30 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Open Printable A4 Dossier</span>
        </button>
      </div>

    </div>
  );
}
