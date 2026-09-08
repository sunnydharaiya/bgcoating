import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileCheck } from 'lucide-react';

export default function BlasterApprovalModal({
  isOpen,
  onClose,
  state,
  metrics,
  onConfirmApprove
}) {
  if (!isOpen) return null;

  const {
    postPct,
    improvement,
    chkPct,
    chkFail,
    inspPct,
    inspFail,
    envFinalOK,
    isProfPass,
    overallScore,
    verdict,
    photoCount
  } = metrics;

  const checks = [
    { label: 'Operator Identification & Photograph Attached', ok: Boolean(state.operatorName && state.civilId && state.operatorPhoto) },
    { label: 'Post-Training Examination Score ≥ 80%', ok: postPct >= 80 },
    { label: 'Assessment Checklist Compliance ≥ 80% & 0 Fails', ok: chkPct >= 80 && chkFail === 0 },
    { label: 'Practical Inspection Tests Pass Rate ≥ 80% & 0 Fails', ok: inspPct >= 80 && inspFail === 0 },
    { label: 'Environmental Conditions & Surface Profile Verified', ok: envFinalOK && isProfPass },
    { label: 'Minimum 3 Evidence Photos Attached', ok: photoCount >= 3 }
  ];

  const allPassed = checks.every(c => c.ok);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Operator Qualification Sign-off Verification
              </h3>
              <p className="text-xs text-slate-500">
                Confirm all technical evaluation criteria prior to generating locked report dossier.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Operator</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{state.operatorName || '—'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Verdict</span>
              <span className={`text-sm font-black font-mono uppercase ${
                verdict === 'PASS' ? 'text-emerald-600' : verdict === 'FAIL' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {verdict} ({overallScore.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Pre-Validation Checklist:</span>
            {checks.map((chk, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">{chk.label}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  chk.ok ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {chk.ok ? 'OK ✓' : 'INCOMPLETE'}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirmApprove();
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Confirm &amp; Lock Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
}
