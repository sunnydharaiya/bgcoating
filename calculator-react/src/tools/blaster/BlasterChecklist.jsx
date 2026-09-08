import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  CheckCheck,
  FileText
} from 'lucide-react';
import { CHECK_ELEMENTS } from '../../data/blasterDatabase';

export default function BlasterChecklist({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const { chkPass, chkFail, chkNa, chkPend, chkPct, isChkPass } = metrics;
  const list = state.checklist || [];

  const handleResultChange = (index, result) => {
    const updated = [...list];
    if (!updated[index]) {
      updated[index] = { result: '', comment: '' };
    }
    updated[index] = { ...updated[index], result };
    onChange('checklist', updated);
  };

  const handleCommentChange = (index, comment) => {
    const updated = [...list];
    if (!updated[index]) {
      updated[index] = { result: '', comment: '' };
    }
    updated[index] = { ...updated[index], comment };
    onChange('checklist', updated);
  };

  const handleSetAllPass = () => {
    const updated = CHECK_ELEMENTS.map((_, i) => ({
      result: 'Pass',
      comment: list[i]?.comment || 'Complies with project HSE and blasting standard requirements.'
    }));
    onChange('checklist', updated);
  };

  const handleResetAll = () => {
    const updated = CHECK_ELEMENTS.map(() => ({
      result: '',
      comment: ''
    }));
    onChange('checklist', updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 03 · Step 3 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Blaster / Operator Assessment Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            12 Critical Assessment Elements · Pass / Fail / N.A. with auto-calculated compliance percentage.
          </p>
        </div>

        <button
          onClick={() => onNavigate('blasting')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <span>Next: Blasting Process</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Compliance Summary Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Passed:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{chkPass}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-500">Failed:</span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">{chkFail}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="text-slate-500">N.A.:</span>
            <span className="font-mono font-bold text-slate-600 dark:text-slate-400 text-sm">{chkNa}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-500">Pending:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{chkPend}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSetAllPass}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Set All Pass</span>
            </button>

            <button
              onClick={handleResetAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className={`px-4 py-1.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider ${
            isChkPass ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800'
          }`}>
            {chkPct.toFixed(0)}% COMPLIANT
          </div>
        </div>
      </div>

      {/* 12 Elements Checklist Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">Assessment Skill Element</th>
                <th className="py-3 px-3 text-center w-36">Result</th>
                <th className="py-3 px-4">Inspector Comments / Field Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {CHECK_ELEMENTS.map((elementText, i) => {
                const item = list[i] || { result: '', comment: '' };
                const res = item.result;
                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                      {i + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      {elementText}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <select
                        value={res}
                        onChange={(e) => handleResultChange(i, e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden transition ${
                          res === 'Pass'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : res === 'Fail'
                            ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                            : res === 'NA'
                            ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        <option value="">— Select —</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="NA">N.A.</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.comment || ''}
                        onChange={(e) => handleCommentChange(i, e.target.value)}
                        placeholder="Optional inspector remark..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Checklist Remark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E8700A]" />
          <span>Overall Assessment Checklist Summary Remark</span>
        </label>
        <textarea
          rows={3}
          value={state.remarkCheck}
          onChange={(e) => onChange('remarkCheck', e.target.value)}
          placeholder="Record final observations on operator dexterity, safety compliance, and blasting technique..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
        />
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => onNavigate('blasting')}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <span>Proceed to 04. Blasting Process</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
