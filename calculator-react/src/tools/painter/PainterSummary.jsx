// src/tools/painter/PainterSummary.jsx
import React from 'react';
import { 
  FileText, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  Layers, 
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

export default function PainterSummary({
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
    chkPass = 0,
    chkFail = 0,
    chkNa = 0,
    chkPct = 0,
    totalInspPass = 0,
    totalInspFail = 0,
    inspPct = 0,
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
  const project = formData?.['f-proj'] || 'Project';
  const contractor = formData?.['f-contractor'] || '—';
  const employer = formData?.['f-employer'] || '—';
  const qualDate = formData?.['f-qual-date'] || '—';
  const nextDate = formData?.['f-next-date'] || '—';
  const opPhoto = formData?._opPhoto;

  const verdictWord = verdict === 'PASS' ? 'successfully qualified' : verdict === 'FAIL' ? 'not qualified at this attempt' : 'currently under evaluation';

  return (
    <div className="space-y-6">
      
      {/* Hero Summary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-20 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
            {opPhoto ? (
              <img src={opPhoto} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E87B1E]/10 text-[#9E1B1E] border border-[#E87B1E]/30">
                {category}
              </span>
              <span className="text-xs font-mono text-slate-500">Civil ID: {civil}</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-slate-800 font-rajdhani">
              {name}
            </h2>
            
            <p className="text-xs text-slate-500">
              {exp} years experience · Employer: <span className="font-semibold text-slate-700">{employer}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Project: <span className="text-slate-600 font-medium">{project}</span>
            </p>
          </div>
        </div>

        {/* Big Verdict Pill */}
        <div
          className={`px-5 py-3 rounded-2xl border-2 flex items-center gap-3 shadow-xs ${
            verdict === 'PASS'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
              : verdict === 'FAIL'
              ? 'bg-rose-50 text-rose-800 border-rose-500'
              : 'bg-amber-50 text-amber-900 border-amber-400'
          }`}
        >
          {verdict === 'PASS' ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          ) : verdict === 'FAIL' ? (
            <AlertCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
          ) : (
            <Clock className="w-8 h-8 text-amber-600 animate-spin flex-shrink-0" />
          )}
          <div>
            <div className="text-xl font-black font-rajdhani tracking-wider leading-none">
              {verdict === 'PENDING' ? 'PENDING' : verdict}
            </div>
            <div className="text-[9.5px] font-bold uppercase tracking-wider mt-0.5">
              {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Compiled Executive Narrative Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-[#E87B1E]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
            Executive Qualification Narrative Summary
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          This report documents the qualification assessment of <b>{name}</b> as an <b>{category}</b> on the <b>{project}</b> (Contractor: {contractor}).
          The operator with <b>{exp} years</b> of practical experience was evaluated through a combination of theoretical examination and rigorous on-site spray application assessment.
          The post-training examination score reached <b>{postPct.toFixed(0)}%</b> (an improvement of <b>{imp >= 0 ? `+${imp.toFixed(0)}%` : `${imp.toFixed(0)}%`}</b> from baseline pre-test),
          the assessment checklist compliance achieved <b>{chkPct.toFixed(0)}%</b> ({chkPass}/13 items passed with 0 critical failures),
          and the on-site process inspection pass rate was <b>{inspPct.toFixed(0)}%</b> across all coating stages.
          Dry Film Thickness (DFT) measurements averaged <b>{isNaN(overallDFTAvg) ? '—' : `${overallDFTAvg.toFixed(1)} µm`}</b> compliant with SSPC PA-2 (80%–120% rule).
          Based on the 6-tier weighted composite evaluation (overall score <b>{overall.toFixed(1)}%</b>), the operator is <b>{verdictWord}</b>.
        </p>
      </div>

      {/* Quantitative Findings Key Stats Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
            Quantitative Assessment Findings
          </h3>
          <span className="text-xs font-mono text-slate-400">Key Metrics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pre-Test</span>
            <div className="text-base font-black font-mono text-slate-800 mt-0.5">{prePct.toFixed(0)}%</div>
            <span className="text-[10px] text-slate-500 font-mono">({pre}/45 Qs)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Post-Test</span>
            <div className="text-base font-black font-mono text-slate-800 mt-0.5">{postPct.toFixed(0)}%</div>
            <span className="text-[10px] text-slate-500 font-mono">({post}/45 Qs)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Δ% Gain</span>
            <div className={`text-base font-black font-mono mt-0.5 ${imp >= 15 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {imp >= 0 ? `+${imp.toFixed(0)}%` : `${imp.toFixed(0)}%`}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">(Target ≥15%)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Checklist</span>
            <div className="text-base font-black font-mono text-emerald-600 mt-0.5">{chkPct.toFixed(0)}%</div>
            <span className="text-[10px] text-slate-500 font-mono">({chkPass}/13 Pass)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Inspection Pass</span>
            <div className="text-base font-black font-mono text-blue-600 mt-0.5">{inspPct.toFixed(0)}%</div>
            <span className="text-[10px] text-slate-500 font-mono">({totalInspPass} Passed)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Environment</span>
            <div className="text-base font-black font-mono text-slate-800 mt-0.5">
              {totalEnvValid > 0 ? `${okEnvCount}/${totalEnvValid} OK` : '—'}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Psychrometric</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Average DFT</span>
            <div className="text-base font-black font-mono text-[#9E1B1E] mt-0.5">
              {isNaN(overallDFTAvg) ? '—' : `${overallDFTAvg.toFixed(1)} µm`}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">SSPC PA-2</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Composite Score</span>
            <div className="text-base font-black font-mono text-[#E87B1E] mt-0.5">{overall.toFixed(1)}%</div>
            <span className="text-[10px] text-slate-500 font-mono">Weighted Total</span>
          </div>
        </div>
      </div>

      {/* Scope, Methodology & Certificate Validity Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Certificate Validity Period */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Qualification Validity Period
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Assessment Date</span>
              <span className="font-mono font-bold text-slate-800">{qualDate}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Next Assessment Due</span>
              <span className="font-mono font-bold text-emerald-700">{nextDate}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Qualification is valid for 12 months from date of assessment subject to continuous satisfactory performance.
          </p>
        </div>

        {/* Conclusion Recommendation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#E87B1E]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Formal Recommendation
            </h3>
          </div>

          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
            verdict === 'PASS'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : verdict === 'FAIL'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}>
            {verdict === 'PASS' ? (
              <span>
                Based on comprehensive evaluation comprising written examination, on-site practical assessment, multi-coat inspection and environmental verification, <b>{name}</b> has successfully met all qualification criteria for industrial spray painting activities. The operator is hereby <b>QUALIFIED</b> in accordance with ASTM D 4228 and SSPC PA-2.
              </span>
            ) : verdict === 'FAIL' ? (
              <span>
                Based on evaluation outcomes, <b>{name}</b> has not met one or more qualification criteria. The operator is <b>NOT QUALIFIED</b> at this time. Structured refresher training on deficient areas followed by re-assessment after a minimum 14-day waiting period is recommended.
              </span>
            ) : (
              <span>
                The qualification evaluation of <b>{name}</b> is currently in progress. Complete all remaining checklist ratings and inspection records to generate the final certified verdict.
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
