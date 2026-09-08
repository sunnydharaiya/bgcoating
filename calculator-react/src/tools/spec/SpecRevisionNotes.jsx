import React from 'react';
import { 
  History, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  FileText 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecRevisionNotes({ 
  iRows, 
  setIRows, 
  genNotes, 
  setGenNotes, 
  onNext 
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleAddRow = () => {
    const newRow = {
      revNo: `R${iRows.length}`,
      date: new Date().toISOString().split('T')[0],
      desc: '',
      prep: '',
      rev: '',
      appr: ''
    };
    setIRows([...iRows, newRow]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...iRows];
    updated[index][field] = value;
    setIRows(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = iRows.filter((_, i) => i !== index);
    setIRows(updated);
  };

  const handleValidate = () => {
    addToast('Revisions & Notes Saved', 'Revision history and technical notes recorded.', 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setIRows([]);
    setGenNotes('');
    addToast('Section Reset', 'Revisions and notes cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section I · N
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Revision History &amp; General Notes
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formal document revision tracking, signatory sign-off log (Prepared / Reviewed / Approved), and contractor site execution notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('spec_reading')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Guideline</span>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        
        {/* Section I: Revision Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Document Revision Control ({iRows.length} {iRows.length === 1 ? 'Revision' : 'Revisions'})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Revision Row</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse min-w-[750px]">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[10.5px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 w-20">Rev No.</th>
                  <th className="p-3 w-28">Date</th>
                  <th className="p-3 min-w-[200px]">Revision Details</th>
                  <th className="p-3 w-36">Prepared By</th>
                  <th className="p-3 w-36">Reviewed By</th>
                  <th className="p-3 w-36">Approved By</th>
                  <th className="p-3 w-10 text-center">×</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {iRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400 font-mono text-xs">
                      No revision rows added. Click <strong className="text-[#D97706]">+ Add Revision Row</strong> above.
                    </td>
                  </tr>
                ) : (
                  iRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.revNo}
                          onChange={e => handleUpdateRow(idx, 'revNo', e.target.value)}
                          placeholder="R0"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="date"
                          value={row.date}
                          onChange={e => handleUpdateRow(idx, 'date', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={row.desc}
                          onChange={e => handleUpdateRow(idx, 'desc', e.target.value)}
                          placeholder="e.g. Issued for Client Review / Approval"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={row.prep}
                          onChange={e => handleUpdateRow(idx, 'prep', e.target.value)}
                          placeholder="Name / Sign"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={row.rev}
                          onChange={e => handleUpdateRow(idx, 'rev', e.target.value)}
                          placeholder="Name / Sign"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={row.appr}
                          onChange={e => handleUpdateRow(idx, 'appr', e.target.value)}
                          placeholder="Name / Sign"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete revision"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section N: General Notes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <label className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
              General Notes, Contractual Instructions &amp; Deviations
            </label>
          </div>
          <textarea
            rows={4}
            value={genNotes}
            onChange={e => setGenNotes(e.target.value)}
            placeholder="Special site conditions, contractor qualifications (SSPC C7/C12), ambient climate limitations, dew point Delta limits (≥ 3°C), surface preparation salt limits (≤ 20 mg/m²), stripe coating protocols..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Save Revisions &amp; Notes</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Revisions</span>
          </button>
        </div>

      </div>

    </div>
  );
}
