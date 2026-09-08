// src/tools/painter/PainterDashboard.jsx
import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  User, 
  Building2, 
  Briefcase, 
  Award,
  Layers,
  Activity,
  Sliders,
  Paintbrush
} from 'lucide-react';
import { COAT_SIDS, COAT_STAGE_NAMES } from '../../data/painterDatabase';

export default function PainterDashboard({
  formData,
  evaluation,
  onNavigate
}) {
  const {
    pre = 0,
    post = 0,
    prePct = 0,
    postPct = 0,
    imp = 0,
    meetsPost = false,
    chkPass = 0,
    chkFail = 0,
    chkPend = 0,
    chkPct = 0,
    totalInspPass = 0,
    totalInspFail = 0,
    inspPct = 0,
    overallDFTAvg = NaN,
    dftSpotsOK = 0,
    dftSpotsValid = 0,
    overall = 0,
    verdict = 'PENDING'
  } = evaluation || {};

  const name = formData?.['f-name'] || '—';
  const category = formData?.['f-category'] || 'Airless Spray Painter';
  const civilId = formData?.['f-civil'] || '—';
  const experience = formData?.['f-exp'] ? `${formData['f-exp']} years` : '—';
  const project = formData?.['f-proj'] || '—';
  const contractor = formData?.['f-contractor'] || '—';
  const opPhoto = formData?._opPhoto;

  // Donut chart calculations for 13 checklist items (circumference = 2 * PI * 42 = 263.89)
  const totalItems = 13;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const passLength = (chkPass / totalItems) * circ;
  const failLength = (chkFail / totalItems) * circ;

  return (
    <div className="space-y-6">
      
      {/* Operator Identity Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Operator Photo Avatar */}
          <div className="w-20 h-24 rounded-xl border-2 border-dashed border-[#E87B1E]/40 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
            {opPhoto ? (
              <img src={opPhoto} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <User className="w-8 h-8 text-slate-300" />
                <span className="text-[8px] font-bold mt-1 uppercase">No Photo</span>
              </div>
            )}
          </div>

          {/* Biographical Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E87B1E]/10 text-[#9E1B1E] border border-[#E87B1E]/30">
                {category}
              </span>
              <span className="text-[11px] font-mono text-slate-500">ID: {civilId}</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-slate-800 font-rajdhani leading-none">
              {name}
            </h2>
            
            <p className="text-xs text-slate-500">
              Exp: <span className="font-semibold text-slate-700">{experience}</span> · Project: <span className="font-semibold text-slate-700">{project}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Contractor: <span className="text-slate-600">{contractor}</span>
            </p>
          </div>
        </div>

        {/* Real-time Verdict Seal */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Composite Qualification Score
            </span>
            <div className="text-3xl font-black font-mono text-slate-800 mt-0.5">
              {overall.toFixed(1)}%
            </div>
          </div>

          <div
            className={`px-4 py-2.5 rounded-xl border-2 flex flex-col items-center justify-center min-w-[120px] shadow-sm ${
              verdict === 'PASS'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                : verdict === 'FAIL'
                ? 'bg-rose-50 text-rose-700 border-rose-500'
                : 'bg-amber-50 text-amber-800 border-amber-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-black font-rajdhani text-lg leading-tight">
              {verdict === 'PASS' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : verdict === 'FAIL' ? (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 animate-spin" />
              )}
              <span>{verdict === 'PENDING' ? 'PEND' : verdict}</span>
            </div>
            <span className="text-[8.5px] font-bold uppercase tracking-wider mt-0.5">
              {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Knowledge Improvement Index */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E]" />
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Knowledge Gain (Δ%)</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                imp >= 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {imp >= 0 ? `+${imp.toFixed(0)}%` : `${imp.toFixed(0)}%`}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-800">
              {imp >= 0 ? `+${imp.toFixed(0)}%` : `${imp.toFixed(0)}%`}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Pre: <span className="font-mono font-bold text-slate-700">{pre}/45 ({prePct.toFixed(0)}%)</span> → Post: <span className="font-mono font-bold text-slate-700">{post}/45 ({postPct.toFixed(0)}%)</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${meetsPost ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${postPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Target: ≥80% Post</span>
              <span className={meetsPost ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {meetsPost ? 'Target Met' : 'Below Target'}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Assessment Checklist Compliance */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Checklist Compliance</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                {chkPass}/13
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-800">
              {chkPct.toFixed(0)}%
            </div>
            <div className="text-xs text-slate-500 mt-1 flex gap-2 font-mono">
              <span className="text-emerald-600 font-bold">{chkPass} Pass</span>
              <span className="text-rose-600 font-bold">{chkFail} Fail</span>
              <span className="text-amber-600 font-bold">{chkPend} Pend</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${chkPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Target: 100% (0 Fails)</span>
              <span className={chkFail === 0 && chkPct >= 80 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {chkFail === 0 && chkPct >= 80 ? 'Compliant' : 'Non-Compliant'}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Multi-Coat Inspection Pass Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Inspection Pass Rate</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                {totalInspPass} Passed
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-800">
              {inspPct.toFixed(0)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Coating tests across s1–s4: <span className="font-mono font-bold text-slate-700">{totalInspPass} Pass / {totalInspFail} Fail</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${inspPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Standard: ≥80%</span>
              <span className={inspPct >= 80 && totalInspFail === 0 ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'}>
                {inspPct >= 80 && totalInspFail === 0 ? 'Quality OK' : 'Issues Found'}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: DFT SSPC PA-2 Measurement Compliance */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9E1B1E] to-[#E87B1E]" />
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">DFT Compliance</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                SSPC PA-2
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-800">
              {isNaN(overallDFTAvg) ? '—' : `${overallDFTAvg.toFixed(1)} µm`}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Spots in 80%–120%: <span className="font-mono font-bold text-slate-700">{dftSpotsOK}/{dftSpotsValid || 0}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#9E1B1E] transition-all duration-500"
                style={{ width: `${dftSpotsValid > 0 ? (dftSpotsOK / dftSpotsValid) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Tolerance: 80%–120%</span>
              <span className={dftSpotsOK === dftSpotsValid && dftSpotsValid > 0 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                {dftSpotsOK === dftSpotsValid && dftSpotsValid > 0 ? 'All In Range' : 'Check Outliers'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid: Bar Chart + SVG Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pre vs Post Examination Score Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                Pre-Test vs Post-Test Examination Scores
              </h3>
              <p className="text-xs text-slate-500">45-question theoretical assessment comparison</p>
            </div>
            <button
              onClick={() => onNavigate('painter-qualification', 'train')}
              className="text-xs font-bold text-[#E87B1E] hover:underline cursor-pointer"
            >
              Edit Scores →
            </button>
          </div>

          <div className="h-44 flex items-end justify-around gap-6 pt-6 pb-2 px-6 bg-slate-50 rounded-xl border border-slate-100 relative">
            {/* 80% Passing Threshold Line */}
            <div className="absolute left-4 right-4 top-[20%] border-b border-dashed border-rose-400 flex items-center justify-end">
              <span className="text-[9px] font-mono font-bold text-rose-600 bg-white/90 px-1 -mt-3.5 rounded">
                80% Pass Threshold
              </span>
            </div>

            {/* Pre-Test Bar */}
            <div className="flex flex-col items-center gap-2 w-24 h-full justify-end z-10">
              <span className="text-xs font-mono font-bold text-slate-600">{prePct.toFixed(0)}%</span>
              <div
                className="w-full bg-slate-400 rounded-t-lg transition-all duration-500 hover:bg-slate-500"
                style={{ height: `${prePct}%` }}
              />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Pre-Test</span>
            </div>

            {/* Post-Test Bar */}
            <div className="flex flex-col items-center gap-2 w-24 h-full justify-end z-10">
              <span className="text-xs font-mono font-bold text-[#E87B1E]">{postPct.toFixed(0)}%</span>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  meetsPost
                    ? 'bg-gradient-to-t from-[#E87B1E] to-[#9E1B1E]'
                    : 'bg-rose-500'
                }`}
                style={{ height: `${postPct}%` }}
              />
              <span className="text-[11px] font-bold text-[#9E1B1E] uppercase">Post-Test</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span>Knowledge Gain Improvement:</span>
            <span className={`font-bold ${imp >= 15 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {imp >= 0 ? `+${imp.toFixed(0)}% (Target ≥15%)` : `${imp.toFixed(0)}%`}
            </span>
          </div>
        </div>

        {/* 13-Element Checklist Compliance Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                13 Practical Checklist Elements Status
              </h3>
              <p className="text-xs text-slate-500">Breakdown of evaluator observation ratings</p>
            </div>
            <button
              onClick={() => onNavigate('painter-qualification', 'checklist')}
              className="text-xs font-bold text-[#E87B1E] hover:underline cursor-pointer"
            >
              View Checklist →
            </button>
          </div>

          <div className="flex items-center justify-around gap-6 h-44 bg-slate-50 rounded-xl border border-slate-100 p-4">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="text-slate-200 stroke-current"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Pass Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="text-emerald-500 stroke-current transition-all duration-500"
                  strokeWidth="10"
                  strokeDasharray={`${passLength} ${circ - passLength}`}
                  strokeDashoffset="0"
                  fill="none"
                />
                {/* Fail Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="text-rose-500 stroke-current transition-all duration-500"
                  strokeWidth="10"
                  strokeDasharray={`${failLength} ${circ - failLength}`}
                  strokeDashoffset={-passLength}
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black font-mono text-slate-800">
                  {chkPct.toFixed(0)}%
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Compliant</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Passed: <b className="font-mono text-slate-800">{chkPass}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-600">Failed: <b className="font-mono text-slate-800">{chkFail}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-slate-600">Pending: <b className="font-mono text-slate-800">{chkPend}</b></span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span>Critical Failure Rule:</span>
            <span className="font-bold text-slate-700">0 Failures Allowed</span>
          </div>
        </div>

      </div>

      {/* Multi-Coat Stage Navigation Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
            Coating Application Stages (s1 to s4)
          </h3>
          <span className="text-xs text-slate-500">Multi-coat inspection records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COAT_SIDS.map((sid, idx) => {
            const cs = formData?._coatSheets?.[sid] || {};
            const cd = formData?._coatDFT?.[sid] || {};
            const stageName = COAT_STAGE_NAMES[sid];

            return (
              <button
                key={sid}
                onClick={() => onNavigate('painter-qualification', sid)}
                className="text-left bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-[#E87B1E] hover:bg-white transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#E87B1E]">Stage 0{idx + 4}</span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {sid.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#9E1B1E] transition-colors truncate">
                  {stageName}
                </h4>
                <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                  <div className="truncate">Product: <span className="text-slate-700 font-medium">{cs.product || '—'}</span></div>
                  <div>DFT Spec: <span className="font-mono text-slate-700">{cd.min || '—'}–{cd.max || '—'} µm</span></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
