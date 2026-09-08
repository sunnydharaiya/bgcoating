// src/tools/painter/PainterApprovalModal.jsx
import React from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';

export default function PainterApprovalModal({
  isOpen,
  onClose,
  onConfirmApprove,
  formData,
  evaluation
}) {
  if (!isOpen) return null;

  const {
    meetsPost = false,
    meetsImp = false,
    chkFail = 0,
    chkPct = 0,
    totalInspFail = 0,
    inspPct = 0,
    dftSpotsOK = 0,
    dftSpotsValid = 0,
    totalEnvValid = 0,
    okEnvCount = 0,
    overall = 0,
    verdict = 'PENDING'
  } = evaluation || {};

  const name = formData?.['f-name'] || 'Operator';
  const category = formData?.['f-category'] || 'Airless Spray Painter';
  const civil = formData?.['f-civil'] || '—';

  const isEligible = verdict === 'PASS';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider font-rajdhani">
                Validate &amp; Approve Qualification Dossier
              </h3>
              <p className="text-[11px] text-slate-300">
                Audit pre-validation check prior to official lock and issuance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Checklist Items */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800">
              {name} · <span className="text-[#E87B1E]">{category}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Civil ID: {civil} · Score: {overall.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-700">1. Post-Test Examination (≥80%)</span>
              <span className={`font-mono font-bold ${meetsPost ? 'text-emerald-600' : 'text-rose-600'}`}>
                {meetsPost ? 'Passed ✓' : 'Failed ✗'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-700">2. Knowledge Gain Improvement (≥15%)</span>
              <span className={`font-mono font-bold ${meetsImp ? 'text-emerald-600' : 'text-amber-600'}`}>
                {meetsImp ? 'Met ✓' : 'Below Target'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-700">3. Assessment Checklist (0 Fails)</span>
              <span className={`font-mono font-bold ${chkFail === 0 && chkPct >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {chkFail === 0 && chkPct >= 80 ? 'Compliant ✓' : `${chkFail} Fails ✗`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-700">4. Process Inspection Tests (0 Fails)</span>
              <span className={`font-mono font-bold ${totalInspFail === 0 && inspPct >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalInspFail === 0 && inspPct >= 80 ? 'Passed ✓' : `${totalInspFail} Fails ✗`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-700">5. DFT Measurement (SSPC PA-2 Compliance)</span>
              <span className={`font-mono font-bold ${dftSpotsOK === dftSpotsValid && dftSpotsValid > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {dftSpotsOK === dftSpotsValid && dftSpotsValid > 0 ? '100% In Tolerance ✓' : `${dftSpotsOK}/${dftSpotsValid} In Range`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-700">6. Environmental Parameters (RH ≤ 85%)</span>
              <span className={`font-mono font-bold ${totalEnvValid === 0 || okEnvCount === totalEnvValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalEnvValid === 0 || okEnvCount === totalEnvValid ? 'Compliant ✓' : 'Hold Required ✗'}
              </span>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              isEligible
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {isEligible ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  All qualification criteria successfully satisfied. Clicking approve will mark this qualification report as <b>Approved</b> in the register.
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>
                  One or more parameters do not satisfy qualification thresholds. Approving now will record a formal <b>FAIL / DEFICIENCY</b> status.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirmApprove(isEligible ? 'Approved' : 'Draft');
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition cursor-pointer ${
              isEligible
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600'
            }`}
          >
            {isEligible ? '✓ Confirm & Issue Approved Dossier' : 'Save Record with Deficiencies'}
          </button>
        </div>

      </div>
    </div>
  );
}
