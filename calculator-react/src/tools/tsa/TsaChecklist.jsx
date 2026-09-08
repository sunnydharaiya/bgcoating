import React from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  RotateCcw, 
  Sparkles,
  Info
} from 'lucide-react';
import { TSA_CHECKLIST_ELEMENTS } from '../../data/tsaDatabase';

export default function TsaChecklist({
  formData,
  onChange,
  evaluation
}) {
  const checklist = formData?.checklist || TSA_CHECKLIST_ELEMENTS.map(() => ({ result: 'Pass', comment: '' }));
  const chk = evaluation?.chk || { pass: 0, fail: 0, na: 0, pend: 0, pct: 0 };

  const handleUpdateItem = (index, field, value) => {
    const updated = checklist.map((item, i) => {
      if (i === index) return { ...item, [field]: value };
      return item;
    });
    onChange?.('checklist', updated);
  };

  const handleSetAll = (resultValue) => {
    const updated = checklist.map((item) => ({ ...item, result: resultValue }));
    onChange?.('checklist', updated);
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset all 12 checklist items to un-evaluated pending state?')) {
      const updated = checklist.map((item) => ({ ...item, result: '' }));
      onChange?.('checklist', updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Stats Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#E87B1E]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Practical Assessment Checklist (AWS C2.23M)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 02 · 12 Core competency elements for Twin-Wire Arc Thermal Spray Aluminium application.
          </p>
        </div>

        {/* Live Score Strip */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pass</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {chk.pass}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fail</span>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">
              {chk.fail}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">N.A.</span>
            <span className="text-base font-extrabold text-slate-500 font-mono">
              {chk.na}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="text-center pl-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
            <span className={`text-base font-extrabold font-mono ${
              chk.pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {chk.pct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-4 rounded-2xl border border-[#E87B1E]/20">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-[#E87B1E]" />
          <span>Quick Evaluation Shortcuts:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSetAll('Pass')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Set All Pass</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetAll('Fail')}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700 transition flex items-center gap-1 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Set All Fail</span>
          </button>
          <button
            type="button"
            onClick={handleResetChecklist}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pending</span>
          </button>
        </div>
      </div>

      {/* 12 Assessment Elements Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3 w-7/12">Assessment Element Description</th>
                <th className="p-3 text-center w-36">Evaluation</th>
                <th className="p-3">Assessor Remarks / Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TSA_CHECKLIST_ELEMENTS.map((elem, idx) => {
                const item = checklist[idx] || { result: '', comment: '' };
                const res = item.result;

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {elem}
                    </td>
                    <td className="p-3 text-center">
                      <select
                        value={res}
                        onChange={(e) => handleUpdateItem(idx, 'result', e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-xl font-bold text-xs border outline-none cursor-pointer transition ${
                          res === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700'
                            : res === 'Fail'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-700'
                            : res === 'NA'
                            ? 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        <option value="">⌛ Pending</option>
                        <option value="Pass">Pass ✓</option>
                        <option value="Fail">Fail ✕</option>
                        <option value="NA">N.A. —</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.comment || ''}
                        onChange={(e) => handleUpdateItem(idx, 'comment', e.target.value)}
                        placeholder="Optional note / observation"
                        className="w-full bg-transparent px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#E87B1E] outline-none text-slate-800 dark:text-slate-100"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* General Checklist Remarks */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Evaluator Summary Assessment & General Comments
          </label>
          <textarea
            rows={3}
            value={formData?.['f-remark-check'] || ''}
            onChange={(e) => onChange?.('f-remark-check', e.target.value)}
            placeholder="Document overall practical observation of operator technique, gun handling, crossing passes, and safety adherence..."
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs focus:border-[#E87B1E] outline-none leading-relaxed"
          />
        </div>
      </div>

    </div>
  );
}
