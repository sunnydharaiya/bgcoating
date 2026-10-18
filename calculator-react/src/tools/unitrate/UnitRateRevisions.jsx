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
      <div className="bg-white p-5 rounded-2xl border border-[#E6E8EC] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">06. Estimation Revision History &amp; Sign-off Records</h2>
              <p className="text-xs text-slate-500">Track commercial quotation revisions, changes, and verification sign-offs.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddRev}
            className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold flex items-center gap-1.5 transition border border-orange-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Revision Entry
          </button>
        </div>

        {/* Dynamic Revision Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10px] border-b border-[#E2E8F0]">
                <th className="py-2.5 px-3 w-14 text-center">Rev</th>
                <th className="py-2.5 px-3 w-32">Date</th>
                <th className="py-2.5 px-3 min-w-[200px]">Description of Revision</th>
                <th className="py-2.5 px-3 w-32">Prepared By</th>
                <th className="py-2.5 px-3 w-32">Checked By</th>
                <th className="py-2.5 px-3 w-32">Approved By</th>
                <th className="py-2.5 px-2 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {revisions.map((rev, idx) => (
                <tr key={idx} className="hover:bg-orange-50/30 transition">
                  <td className="py-2 px-3 text-center">
                    <input
                      type="text"
                      value={rev.rev || ''}
                      onChange={(e) => handleUpdateRev(idx, 'rev', e.target.value)}
                      className="w-10 px-1 py-1 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded text-xs text-center font-mono font-bold text-orange-600 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="date"
                      value={rev.date || ''}
                      onChange={(e) => handleUpdateRev(idx, 'date', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded text-xs text-slate-800 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.desc || ''}
                      onChange={(e) => handleUpdateRev(idx, 'desc', e.target.value)}
                      placeholder="e.g. Initial tender estimation issue"
                      className="w-full px-2.5 py-1 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.prep || ''}
                      onChange={(e) => handleUpdateRev(idx, 'prep', e.target.value)}
                      placeholder="Estimator"
                      className="w-full px-2 py-1 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.chk || ''}
                      onChange={(e) => handleUpdateRev(idx, 'chk', e.target.value)}
                      placeholder="Checker"
                      className="w-full px-2 py-1 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rev.app || ''}
                      onChange={(e) => handleUpdateRev(idx, 'app', e.target.value)}
                      placeholder="Approver"
                      className="w-full px-2 py-1 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </td>

                  <td className="py-2 px-2 text-center">
                    {revisions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRev(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition"
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
          className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Unit-Rate Table</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition border border-slate-200 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={onOpenPreview}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            Preview Modal
          </button>

          <button
            onClick={onOpenPrint}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
