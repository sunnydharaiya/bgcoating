import React from 'react';
import { 
  User, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  Calendar,
  Building,
  Sparkles
} from 'lucide-react';

export default function TsaDashboard({
  formData,
  evaluation,
  onNavigate
}) {
  const verdict = evaluation?.verdict || 'PENDING';
  const overall = (evaluation?.overall || 0).toFixed(1);
  const chk = evaluation?.chk || { pass: 0, fail: 0, na: 0, pend: 12, pct: 0 };
  const dft = evaluation?.dft || { valid: 0, ok: 0, pct: 0, byStage: {} };
  const insp = evaluation?.insp || { pass: 0, fail: 0, na: 0, pct: 0 };
  const env = evaluation?.env || { valid: 0, ok: 0, pct: 0, finalOK: true };

  // Donut metrics for Checklist (12 items)
  const totalItems = 12;
  const passDash = (chk.pass / totalItems) * 263.9;
  const failDash = (chk.fail / totalItems) * 263.9;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Operator Portrait & Master Status Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Operator Portrait Photo */}
          <div className="relative w-28 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 border-2 border-[#E87B1E]/40 shrink-0 shadow-md flex items-center justify-center">
            {formData?.['op-photo'] ? (
              <img
                src={formData['op-photo']}
                alt={formData['f-name'] || 'Operator'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-2 text-slate-400">
                <User className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider block">No Photo</span>
              </div>
            )}
            <div className="absolute top-1.5 right-1.5">
              <span className={`w-3 h-3 rounded-full block border-2 border-white dark:border-slate-900 ${
                verdict === 'PASS' ? 'bg-emerald-500' : verdict === 'FAIL' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
            </div>
          </div>

          {/* Operator Details & Qualification Profile */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FDF1E6] dark:bg-[#E87B1E]/20 text-[#E87B1E] border border-[#E87B1E]/30">
                {formData?.['f-category'] || 'TSA Operator'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Civil ID: {formData?.['f-civil'] || '—'}
              </span>
              <span className="text-xs text-slate-400">
                · {formData?.['f-exp'] || '—'} Years Experience
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {formData?.['f-name'] || 'Operator Full Name'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate"><b>Project:</b> {formData?.['f-proj'] || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate"><b>Employer:</b> {formData?.['f-employer'] || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span><b>Next Due:</b> {formData?.['f-next-date'] || '—'}</span>
              </div>
            </div>
          </div>

          {/* Master Qualification Verdict Emblem */}
          <div className="flex flex-col items-center md:items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Overall Score
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {overall}%
            </div>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-sm ${
              verdict === 'PASS'
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : verdict === 'FAIL'
                ? 'bg-rose-500 text-white shadow-rose-500/20'
                : 'bg-amber-500 text-white shadow-amber-500/20'
            }`}>
              {verdict === 'PASS' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : verdict === 'FAIL' ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              <span>{verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'REJECTED' : 'EVALUATION PENDING'}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              Threshold: ≥ 80.0% & 0 Fails
            </span>
          </div>

        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Checklist (35%) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Checklist (35%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              chk.pct >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-600'
            }`}>
              {chk.pct >= 80 ? 'PASS' : 'FAIL'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 font-mono">
            {chk.pass} <span className="text-sm text-slate-400 font-normal">/ {totalItems}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${chk.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>{chk.pct.toFixed(0)}% Compliant</span>
            <span>{chk.fail} Fails</span>
          </div>
        </div>

        {/* KPI 2: DFT Compliance (30%) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DFT Compliance (30%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              dft.pct >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-600'
            }`}>
              {dft.pct >= 80 ? 'IN SPEC' : 'OUT'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 font-mono">
            {dft.ok} <span className="text-sm text-slate-400 font-normal">/ {dft.valid}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#E87B1E] h-full rounded-full transition-all duration-500"
              style={{ width: `${dft.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>{dft.pct.toFixed(0)}% in 80-120%</span>
            <span>SSPC PA-2</span>
          </div>
        </div>

        {/* KPI 3: Inspection Tests (20%) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Process Tests (20%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              insp.pct >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-600'
            }`}>
              {insp.pct >= 80 ? 'PASS' : 'FAIL'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 font-mono">
            {insp.pass} <span className="text-sm text-slate-400 font-normal">/ {insp.pass + insp.fail + insp.na}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${insp.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>{insp.pct.toFixed(0)}% Pass Rate</span>
            <span>{insp.fail} Fails</span>
          </div>
        </div>

        {/* KPI 4: Environmental (15%) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Environment (15%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              env.finalOK ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-600'
            }`}>
              {env.finalOK ? 'OK' : 'HOLD'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 font-mono">
            {env.ok} <span className="text-sm text-slate-400 font-normal">/ {env.valid || 0}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${env.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>RH ≤ 85%</span>
            <span>MT − DP ≥ 3°C</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts & Donut Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart: Practical Checklist Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center justify-between">
            <span>Checklist Competency Breakdown</span>
            <span className="text-xs text-slate-400 font-mono">{totalItems} Total</span>
          </h3>

          <div className="flex items-center justify-center gap-6 my-4">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-emerald-500 fill-none transition-all duration-500"
                  strokeWidth="12"
                  strokeDasharray={`${passDash} ${263.9 - passDash}`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-rose-500 fill-none transition-all duration-500"
                  strokeWidth="12"
                  strokeDasharray={`${failDash} ${263.9 - failDash}`}
                  strokeDashoffset={-passDash}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                  {chk.pct.toFixed(0)}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Pass</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-500 block shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Pass: <b>{chk.pass}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-rose-500 block shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Fail: <b>{chk.fail}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-300 dark:bg-slate-700 block shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">N.A. / Pend: <b>{chk.na + chk.pend}</b></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate?.('checklist')}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#E87B1E] hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Review 12 Assessment Elements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Coat Stage Overview Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E87B1E]" />
              <span>Coating Stages Inspection Grid</span>
            </h3>
            <span className="text-xs text-slate-400">
              AWS C2.23M Multi-Stage Traceability
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { sid: 's1', label: '01. Blasting + TSA', desc: 'Twin Wire Arc 99.5% Al', spec: '300–500 µm' },
              { sid: 's2', label: '02. 1st Coat / Sealer', desc: 'Silicone Aluminum Sealer', spec: '15–25 µm' },
              { sid: 's3', label: '03. 2nd Coat', desc: 'Intermediate Epoxy (Opt.)', spec: '100–150 µm' },
              { sid: 's4', label: '04. 3rd Coat', desc: 'Polyurethane Topcoat (Opt.)', spec: '40–50 µm' }
            ].map((stage) => {
              const stageData = formData?.coatStages?.[stage.sid];
              const dftRes = dft.byStage?.[stage.sid];
              const testCount = (stageData?.tests || []).length;
              const hasMfr = Boolean(stageData?.mfr && stageData?.product);

              return (
                <div
                  key={stage.sid}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#E87B1E]">
                      {stageData?.dftSpecMin ? `${stageData.dftSpecMin}–${stageData.dftSpecMax} µm` : stage.spec}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="truncate">
                      <b>Generic:</b> {stageData?.generic || stage.desc}
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Tests: <b>{testCount}</b></span>
                      <span>Avg DFT: <b>{!isNaN(dftRes?.grandAvg) ? `${dftRes.grandAvg.toFixed(1)} µm` : '—'}</b></span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate?.(stage.sid)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-[#E87B1E] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Stage</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
