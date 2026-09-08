import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Award,
  Calendar
} from 'lucide-react';

export default function TsaApprovalModal({
  isOpen,
  onClose,
  onConfirmApprove,
  formData,
  evaluation
}) {
  if (!isOpen) return null;

  const verdict = evaluation?.verdict || 'PENDING';
  const overall = (evaluation?.overall || 0).toFixed(1);
  const chk = evaluation?.chk || { pass: 0, fail: 0, na: 0, pend: 0, pct: 0 };
  const dft = evaluation?.dft || { valid: 0, ok: 0, pct: 0, finalOK: false };
  const insp = evaluation?.insp || { pass: 0, fail: 0, na: 0, pct: 0 };
  const env = evaluation?.env || { valid: 0, ok: 0, pct: 0, finalOK: true };

  const name = formData?.['f-name'] || 'Operator';
  const civ = formData?.['f-civil'] || '—';
  const proj = formData?.['f-proj'] || 'Project';

  const hasPending = chk.pend > 0;
  const isPass = verdict === 'PASS';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Validate & Issue Official Dossier</h3>
              <p className="text-xs text-slate-400">AWS C2.23M / ISO 2063-2 Official Authorization</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600 dark:text-slate-400">
          
          {/* Operator Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Civil ID: {civ} · Project: {proj}</div>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                isPass
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {verdict} · {overall}%
              </span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pre-Authorization Compliance Verification
            </span>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <span className="font-medium">12 Assessment Elements Evaluated</span>
                {hasPending ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {chk.pend} Pending Items
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Evaluated ({chk.pct.toFixed(0)}%)
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <span className="font-medium">DFT Compliance (SSPC PA-2 80%–120%)</span>
                {dft.finalOK ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Tolerance ({dft.pct.toFixed(0)}%)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Readings Out of Bound
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <span className="font-medium">Multi-Hour Environmental Psychrometrics</span>
                {env.finalOK ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    RH ≤ 85% & MT−DP ≥ 3°C OK
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Conditions Exceeded
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Legal Warning Notice */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Approving will generate the permanent qualification Report Number, stamp the digital endorsements, and mark this dossier as officially <b>Approved</b> in the Master Register.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmApprove?.();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white font-extrabold text-xs shadow-lg shadow-[#E87B1E]/30 hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Issue Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
}
