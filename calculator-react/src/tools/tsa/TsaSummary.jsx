import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Printer, 
  User, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Building, 
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function TsaSummary({
  formData,
  evaluation,
  onNavigate
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const verdict = evaluation?.verdict || 'PENDING';
  const overall = (evaluation?.overall || 0).toFixed(1);
  const chk = evaluation?.chk || { pass: 0, fail: 0, na: 0, pct: 0 };
  const dft = evaluation?.dft || { valid: 0, ok: 0, pct: 0, finalOK: false };
  const insp = evaluation?.insp || { pass: 0, fail: 0, na: 0, pct: 0 };
  const env = evaluation?.env || { valid: 0, ok: 0, pct: 0, finalOK: true };

  const name = formData?.['f-name'] || 'Operator Name';
  const cat = formData?.['f-category'] || 'TSA Operator';
  const civ = formData?.['f-civil'] || '—';
  const exp = formData?.['f-exp'] || '—';
  const proj = formData?.['f-proj'] || 'Project';
  const employer = formData?.['f-employer'] || 'Employer';
  const qdate = formData?.['f-qual-date'] || '—';
  const ndate = formData?.['f-next-date'] || '—';

  // Dynamic executive narrative text
  const verdictWord = verdict === 'PASS' 
    ? 'successfully qualified for Twin-Wire Arc Thermal Spray Aluminium application' 
    : verdict === 'FAIL' 
    ? 'not qualified at this trial attempt' 
    : 'currently under qualification evaluation';

  const execNarrative = `This report documents the practical qualification assessment of ${name} as a ${cat} on the ${proj}. The operator (${exp} years of relevant thermal spray and coating experience, employer: ${employer}) was evaluated through on-site assessment of Twin-Wire Arc spray equipment setup, White Metal Sa 3.0 surface preparation, application parameters, bend test coupon qualification, 9.4 MPa pull-off adhesion testing, and finish sealer acceptance. The practical assessment checklist compliance reached ${chk.pct.toFixed(0)}%, and the on-site inspection test pass rate was ${insp.pct.toFixed(0)}%. Based on the weighted 4-tier evaluation criteria (overall score ${overall}%), the operator is ${verdictWord}.`;

  const handleCopySummary = () => {
    const summaryText = `BG GROUP · TSA OPERATOR QUALIFICATION REPORT
-----------------------------------------------------------
Report No: ${formData?.['f-rep-no'] || 'DRAFT'}
Date: ${formData?.['f-rep-date'] || qdate}
Operator: ${name} (${cat})
Civil ID: ${civ} | Experience: ${exp} Years
Employer: ${employer} | Project: ${proj}
-----------------------------------------------------------
Overall Qualification Score: ${overall}%
Final Verdict: ${verdict === 'PASS' ? 'QUALIFIED FOR TWIN-WIRE ARC TSA SPRAYING' : verdict === 'FAIL' ? 'NOT QUALIFIED — RETEST REQUIRED' : 'IN PROGRESS'}
Certificate Validity: ${qdate} to ${ndate}
-----------------------------------------------------------
Key Evaluation Findings:
- Checklist Compliance (35%): ${chk.pct.toFixed(0)}% (${chk.pass}/${chk.pass + chk.fail} Items)
- DFT Compliance (30%): ${dft.pct.toFixed(0)}% (${dft.ok}/${dft.valid} Spots in 80%-120% Spec)
- Process Tests (20%): ${insp.pct.toFixed(0)}% (${insp.pass}/${insp.pass + insp.fail} Tests)
- Environmental Conditions (15%): ${env.ok}/${env.valid} Hourly Readings OK
-----------------------------------------------------------
${execNarrative}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    addToast('Summary Copied', 'Executive summary text copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Operator Executive Summary Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Portrait Photo */}
          <div className="w-28 h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-[#E87B1E]/40 shrink-0 shadow-md flex items-center justify-center">
            {formData?.['op-photo'] ? (
              <img
                src={formData['op-photo']}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FDF1E6] dark:bg-[#E87B1E]/20 text-[#E87B1E]">
                {cat}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Civil ID: {civ}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {name}
            </h2>

            <p className="text-xs text-slate-500 max-w-xl">
              Employer: <b>{employer}</b> · Project: <b>{proj}</b> · Experience: <b>{exp} Years</b>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#E87B1E]" />
                <span><b>Qualified On:</b> {qdate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span><b>Valid Until:</b> {ndate}</span>
              </div>
            </div>
          </div>

          {/* Overall Verdict Badge */}
          <div className="flex flex-col items-center md:items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <span className="text-[10px] uppercase font-bold text-slate-400">Overall Score</span>
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {overall}%
            </span>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm ${
              verdict === 'PASS'
                ? 'bg-emerald-500 text-white'
                : verdict === 'FAIL'
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-white'
            }`}>
              {verdict === 'PASS' ? 'QUALIFIED ✓' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS'}
            </span>
          </div>

        </div>
      </div>

      {/* Auto-Compiled Executive Narrative */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#E87B1E]" />
            <span>Executive Qualification Summary Narrative</span>
          </h3>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#E87B1E]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {execNarrative}
        </div>
      </div>

      {/* Quantitative Findings Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Checklist (35%)
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block font-mono">
            {chk.pct.toFixed(0)}%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{chk.pass} / 12 Pass</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            DFT Compliance (30%)
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block font-mono">
            {dft.pct.toFixed(0)}%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{dft.ok} / {dft.valid} Spots OK</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Process Tests (20%)
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block font-mono">
            {insp.pct.toFixed(0)}%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{insp.pass} Pass / 0 Fail</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Environment (15%)
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block font-mono">
            {env.pct.toFixed(0)}%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{env.ok} / {env.valid} Readings OK</span>
        </div>
      </div>

      {/* Formal Conclusion & Validity Block */}
      <div className={`rounded-3xl p-6 border ${
        verdict === 'PASS'
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
          : verdict === 'FAIL'
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30 text-rose-900 dark:text-rose-200'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30 text-amber-900 dark:text-amber-200'
      }`}>
        <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
          {verdict === 'PASS' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
          <span>{verdict === 'PASS' ? 'Official Qualification Granted' : verdict === 'FAIL' ? 'Qualification Not Granted' : 'Assessment In Progress'}</span>
        </h4>
        <p className="text-xs sm:text-sm leading-relaxed">
          {verdict === 'PASS' ? (
            `Based on comprehensive on-site practical assessment in accordance with AWS C2.23M, ISO 2063-2, and SSPC-CS 23.00, ${name} has met all technical and quality benchmarks for Twin-Wire Arc Thermal Spray Aluminium application. The qualification certificate is officially issued with validity through ${ndate}, subject to satisfactory ongoing field audit compliance.`
          ) : verdict === 'FAIL' ? (
            `Based on the evaluation outcomes, ${name} has not met one or more critical qualification criteria at this attempt. It is recommended that the operator undergo additional hands-on thermal spray training followed by formal re-assessment after a minimum 14-day interval.`
          ) : (
            `The qualification dossier for ${name} is currently in progress. Please ensure all 12 checklist competency elements and stage DFT spot measurements are logged before final sign-off.`
          )}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs">
            <b>Issued By:</b> {formData?.['sig2-name'] || 'BG Group Lead QC Inspector'}
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('preview')}
            className="px-4 py-2 rounded-xl bg-[#E87B1E] text-white font-bold text-xs shadow-xs hover:bg-[#9E1B1E] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Printable A4 Dossier</span>
          </button>
        </div>
      </div>

    </div>
  );
}
