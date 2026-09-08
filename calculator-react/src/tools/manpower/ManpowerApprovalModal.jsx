import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ManpowerApprovalModal({
  isOpen,
  onClose,
  state,
  metrics,
  onConfirmApproval
}) {
  if (!isOpen) return null;

  const {
    grandTotal,
    costPerM2,
    area,
    completionPct,
    formatCur,
    formatNum
  } = metrics;

  const issues = [];
  if (!state.estNo?.trim()) issues.push('Estimation Number is empty');
  if (!state.projectName?.trim()) issues.push('Project Name is empty');
  if (!state.customer?.trim()) issues.push('Customer Name is empty');
  if (area <= 0) issues.push('Surface Area is 0 m²');
  if (grandTotal <= 0) issues.push('Grand Total is 0 — please verify cost inputs');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#180900] via-[#2A1205] to-[#180900] text-white px-6 py-4 flex items-center justify-between border-b border-[#E8700A]/30">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#F5911F]" />
            <h3 className="text-base font-bold">Validate &amp; Approve Estimation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Estimation No.:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{state.estNo || '—'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Project Name:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{state.projectName || '—'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Customer:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{state.customer || '—'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Surface Area:</span>
              <span className="font-mono font-bold text-[#E8700A]">{formatNum(area, 0)} m²</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Grand Total:</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{formatCur(grandTotal)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Per m² Cost:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCur(costPerM2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Readiness Score:</span>
              <span className="font-mono font-bold text-amber-500">{completionPct}%</span>
            </div>
          </div>

          {/* Checklist alert */}
          {issues.length > 0 ? (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Recommended to complete before approval ({issues.length} items):</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-700 dark:text-amber-300 pl-1">
                {issues.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>All essential engineering fields are completed. Ready for commercial approval.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmApproval}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Approved &amp; Save</span>
          </button>
        </div>

      </div>
    </div>
  );
}
