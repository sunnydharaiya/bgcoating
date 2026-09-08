import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Building2,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Clock
} from 'lucide-react';

export default function BlasterDashboard({
  state,
  metrics,
  onNavigate
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
    chkPend,
    chkPct,
    inspPass,
    inspFail,
    inspNa,
    inspPct,
    overallScore,
    verdict,
    verdictStatus
  } = metrics;

  // Donut SVG circumference math
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const totalCheck = 12;
  const passLength = (chkPass / totalCheck) * circumference;
  const failLength = (chkFail / totalCheck) * circumference;
  const pendingLength = circumference - passLength - failLength;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Analytics &amp; KPI Dashboard
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Operator Qualification Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance status, Pre/Post training score comparisons, and automated criteria evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
            <span className={`text-sm font-black font-mono uppercase ${
              verdict === 'PASS' ? 'text-emerald-600 dark:text-emerald-400' : verdict === 'FAIL' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {verdictStatus} ({overallScore.toFixed(1)}%)
            </span>
          </div>
          <button
            onClick={() => onNavigate('verdict')}
            className="px-3.5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Review Verdict
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Training Improvement */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Training Improvement</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              improvement >= 15 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {improvement >= 0 ? `+${improvement.toFixed(0)}%` : `${improvement.toFixed(0)}%`}
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {improvement >= 0 ? `+${improvement.toFixed(0)}` : improvement.toFixed(0)}
              <span className="text-sm text-slate-400 font-sans ml-1">%</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pre ({prePct.toFixed(0)}%) → Post ({postPct.toFixed(0)}%)</div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#E8700A] h-full" style={{ width: `${Math.min(Math.max(improvement, 0), 100)}%` }} />
          </div>
        </div>

        {/* KPI 2: Checklist Compliance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Checklist Compliance</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              chkPct >= 80 && chkFail === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
            }`}>
              {chkPct >= 80 && chkFail === 0 ? 'PASS' : 'REVIEW'}
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {chkPass}<span className="text-base text-slate-400 font-normal">/12</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{chkPct.toFixed(0)}% Compliant ({chkFail} Fail / {chkPend} Pending)</div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${chkPct}%` }} />
          </div>
        </div>

        {/* KPI 3: Inspection Tests */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inspection Pass Rate</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              inspPct >= 80 && inspFail === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {inspPct >= 80 && inspFail === 0 ? 'PASS' : 'REVIEW'}
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {inspPass}<span className="text-base text-slate-400 font-normal">/{inspPass + inspFail + inspNa}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{inspPct.toFixed(0)}% Surface Prep Pass Rate</div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${inspPct}%` }} />
          </div>
        </div>

        {/* KPI 4: Overall Qualification Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall Qualification</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              verdict === 'PASS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : verdict === 'FAIL' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {verdict}
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {overallScore.toFixed(0)}<span className="text-sm text-slate-400 font-sans ml-1">%</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Weighted Composite Score</div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${verdict === 'PASS' ? 'bg-emerald-500' : verdict === 'FAIL' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${overallScore}%` }} />
          </div>
        </div>

      </div>

      {/* Analytics Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pre vs Post Test Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#E8700A]" />
              <span>Pre vs Post Training Test Comparison</span>
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              25 QUESTIONS · 80% MIN TARGET
            </span>
          </div>

          <div className="h-56 flex items-end justify-around gap-6 pt-6 pb-2 px-4">
            
            {/* Bar 1: Pre-Test */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                {prePct.toFixed(0)}% ({preCorrect}/25)
              </span>
              <div className="w-full max-w-[80px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-40">
                <div
                  className="bg-gradient-to-t from-[#F5911F] to-[#FFD89D] w-full rounded-t-lg transition-all duration-700 shadow-sm"
                  style={{ height: `${prePct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                Pre-Test
              </span>
            </div>

            {/* Bar 2: Post-Test */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {postPct.toFixed(0)}% ({postCorrect}/25)
              </span>
              <div className="w-full max-w-[80px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-40">
                <div
                  className="bg-gradient-to-t from-[#1B5E20] to-[#43A047] w-full rounded-t-lg transition-all duration-700 shadow-sm"
                  style={{ height: `${postPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                Post-Test
              </span>
            </div>

            {/* Bar 3: Target Baseline */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                80% (20/25)
              </span>
              <div className="w-full max-w-[80px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-40">
                <div
                  className="bg-gradient-to-t from-blue-700 to-blue-400 w-full rounded-t-lg transition-all duration-700 shadow-sm opacity-60"
                  style={{ height: `80%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                Target Threshold
              </span>
            </div>

          </div>
        </div>

        {/* Right: 12-Element Checklist Status Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Assessment Checklist Status</span>
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              12 ELEMENTS
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="stroke-slate-200 dark:stroke-slate-800 fill-none" strokeWidth="12" />
                {/* Pass arc */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-emerald-500 fill-none transition-all duration-700"
                  strokeWidth="12"
                  strokeDasharray={`${passLength} ${circumference}`}
                  strokeDashoffset="0"
                />
                {/* Fail arc */}
                {chkFail > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-red-500 fill-none transition-all duration-700"
                    strokeWidth="12"
                    strokeDasharray={`${failLength} ${circumference}`}
                    strokeDashoffset={-passLength}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  {chkPct.toFixed(0)}%
                </span>
                <span className="text-[8px] uppercase font-bold text-slate-400 mt-1">
                  Compliant
                </span>
              </div>
            </div>

            {/* Status Breakdown Legend */}
            <div className="space-y-2.5 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">Passed</span>
                </div>
                <span className="font-bold font-mono text-emerald-800 dark:text-emerald-300">{chkPass} / 12</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-semibold text-red-900 dark:text-red-200">Failed</span>
                </div>
                <span className="font-bold font-mono text-red-800 dark:text-red-300">{chkFail} / 12</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-amber-900 dark:text-amber-200">Pending</span>
                </div>
                <span className="font-bold font-mono text-amber-800 dark:text-amber-300">{chkPend} / 12</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Operator Quick View Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E8700A]" />
            <span>Operator &amp; Project Summary</span>
          </h3>
          <button
            onClick={() => onNavigate('info')}
            className="text-xs font-bold text-[#E8700A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Edit Information</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Operator Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{state.operatorName || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Civil ID / Passport</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{state.civilId || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Project Name</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{state.projectName || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Coating Contractor</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{state.contractor || '—'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
