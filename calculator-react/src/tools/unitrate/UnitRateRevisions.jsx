import React from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Eye, 
  Printer 
} from 'lucide-react';

export default function UnitRateRevisions({ 
  formData, 
  onUpdateField, 
  onNavigatePrev, 
  onOpenPreview, 
  onOpenPrint, 
  onReset 
}) {
  const revisions = formData.revisions || [];

  const handleAddRev = () => {
    const nextRevNum = revisions.length.toString();
    const newRev = {
      rev: nextRevNum,
      date: new Date().toISOString().slice(0, 10),
      desc: 'Commercial estimation update & review',
      prep: formData.estimator || '',
      chk: formData.checkedBy || '',
      app: ''
    };
    onUpdateField('revisions', [...revisions, newRev]);
  };

  const handleUpdateRev = (index, field, value) => {
    const updated = [...revisions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdateField('revisions', updated);
  };

  const handleRemoveRev = (index) => {
    const updated = revisions.filter((_, i) => i !== index);
    onUpdateField('revisions', updated.length ? updated : [
      { rev: '0', date: '', desc: 'Initial Estimation Take-off', prep: '', chk: '', app: '' }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">06. Estimation Revision History &amp; Sign-off Records</h2>
              <p className="text-xs text-slate-400">Track commercial quotation revisions, changes, and verification sign-offs.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddRev}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition border border-amber-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Revision Entry
          </button>
        </div>

        {/* Dynamic Revision Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-700">
                <th className="py-2.5 px-3 w-14 text-center">Rev</th>
                <th className="py-2.5 px-3 w-32">Date</th>
                <th className="py-2.5 px-3 min-w-[200px]">Description of Revision</th>
                <th className="py-2.5 px-3 w-32">Prepared By</th>
                <th className="py-2.5 px-3 w-32">Checked By</th>
                <th className="py-2.5 px-3 w-32">Approved By</th>
                <th className="py-2.5 px-2 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {revisions.map((rev, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-2 px-3 text-center">
                    <input
                      type="text"
                      value={rev.rev || ''}
                      onChange={(e) => handleUpdateRev(idx, 'rev', e.target.value)}
                      className="w-10 px-1 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-center font-mono font-bold text-amber-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="date"
                      value={rev.date || ''}
                      onChange={(e) => handleUpdateRev(idx, 'date', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.desc || ''}
                      onChange={(e) => handleUpdateRev(idx, 'desc', e.target.value)}
                      placeholder="e.g. Initial tender estimation issue"
                      className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.prep || ''}
                      onChange={(e) => handleUpdateRev(idx, 'prep', e.target.value)}
                      placeholder="Estimator"
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.chk || ''}
                      onChange={(e) => handleUpdateRev(idx, 'chk', e.target.value)}
                      placeholder="Checker"
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.app || ''}
                      onChange={(e) => handleUpdateRev(idx, 'app', e.target.value)}
                      placeholder="Approver"
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    {revisions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRev(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition"
                        title="Delete Revision"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Action Bottom Toolbar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onNavigatePrev}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Unit-Rate Table</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={onOpenPreview}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-600"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Preview Modal
          </button>

          <button
            onClick={onOpenPrint}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-95 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
