// src/tools/painter/PainterChecklist.jsx
import React from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  Info
} from 'lucide-react';
import { CHECK_ELEMENTS } from '../../data/painterDatabase';

export default function PainterChecklist({
  formData,
  onChange,
  evaluation
}) {
  const {
    chkPass = 0,
    chkFail = 0,
    chkNa = 0,
    chkPend = 0,
    chkPct = 0
  } = evaluation || {};

  const checkResults = formData?._check || [];

  const handleResultChange = (index, value) => {
    const updated = [...checkResults];
    updated[index] = { ...updated[index], r: value };
    onChange('_check', updated);
  };

  const handleCommentChange = (index, value) => {
    const updated = [...checkResults];
    updated[index] = { ...updated[index], c: value };
    onChange('_check', updated);
  };

  const handleSetAll = (val) => {
    const updated = CHECK_ELEMENTS.map((_, i) => ({
      r: val,
      c: checkResults[i]?.c || (val === 'Pass' ? 'Satisfactory' : '')
    }));
    onChange('_check', updated);
  };

  const handleResetChecklist = () => {
    const updated = CHECK_ELEMENTS.map(() => ({ r: '', c: '' }));
    onChange('_check', updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Assessment Checklist Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        
        {/* Header & Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                Section 03: Practical Assessment Checklist (13 Elements)
              </h3>
              <p className="text-xs text-slate-500">
                Evaluation of equipment handling, pot life, spray application technique, and defect recognition
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSetAll('Pass')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Set All Pass</span>
            </button>
            <button
              type="button"
              onClick={handleResetChecklist}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Status KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Passed</span>
            <div className="text-lg font-black font-mono text-emerald-600">{chkPass}</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Failed</span>
            <div className="text-lg font-black font-mono text-rose-600">{chkFail}</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">N.A.</span>
            <div className="text-lg font-black font-mono text-slate-600">{chkNa}</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Compliance</span>
            <div className={`text-lg font-black font-mono ${chkPct >= 80 && chkFail === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {chkPct.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* 13-Element Checklist Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white font-rajdhani uppercase text-[11px] tracking-wider">
                <th className="p-2.5 text-center w-12">Sr.</th>
                <th className="p-2.5">Critical Evaluation Criteria</th>
                <th className="p-2.5 text-center w-36">Result</th>
                <th className="p-2.5">Inspector Comment / Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {CHECK_ELEMENTS.map((element, idx) => {
                const cur = checkResults[idx] || {};
                const res = cur.r || '';
                const comment = cur.c || '';

                return (
                  <tr key={idx} className="hover:bg-amber-50/40 transition">
                    <td className="p-2.5 text-center font-mono font-bold text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="p-2.5 text-slate-800 font-medium leading-relaxed">
                      {element}
                    </td>
                    <td className="p-2.5 text-center">
                      <select
                        value={res}
                        onChange={(e) => handleResultChange(idx, e.target.value)}
                        className={`w-full text-xs font-bold rounded-lg p-2 border outline-none transition ${
                          res === 'Pass'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : res === 'Fail'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : res === 'NA'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-white text-slate-400 border-slate-300'
                        }`}
                      >
                        <option value="">— Select —</option>
                        <option value="Pass">✓ Pass</option>
                        <option value="Fail">✗ Fail</option>
                        <option value="NA">N.A. (Not Applicable)</option>
                      </select>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => handleCommentChange(idx, e.target.value)}
                        className="w-full text-xs text-slate-700 bg-transparent border-b border-transparent focus:border-[#E87B1E] outline-none"
                        placeholder="Optional remarks on technique or equipment handling..."
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* General Checklist Remarks */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            General Practical Assessment Summary &amp; Recommendations
          </label>
          <textarea
            value={formData?.['f-remark-check'] || ''}
            onChange={(e) => onChange('f-remark-check', e.target.value)}
            rows={3}
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
            placeholder="Record overall evaluation observations on spray technique, safety compliance, spray pattern uniformity..."
          />
        </div>
      </div>

    </div>
  );
}
