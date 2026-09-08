import React from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  RefreshCw, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  MessageSquare 
} from 'lucide-react';
import { PAINT_DB } from '../../data/specDatabase';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecManufacturers({ 
  hRows, 
  setHRows, 
  fRows, 
  otherColName, 
  setOtherColName, 
  other2ColName, 
  setOther2ColName, 
  specialComment, 
  setSpecialComment, 
  onNext 
}) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleAddRow = () => {
    const newRow = {
      gen: '',
      int: '',
      jot: '',
      asn: '',
      cbl: '',
      hmp: '',
      sgm: '',
      oth1: '',
      oth2: ''
    };
    setHRows([...hRows, newRow]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...hRows];
    updated[index][field] = value;
    setHRows(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = hRows.filter((_, i) => i !== index);
    setHRows(updated);
  };

  // Sync from Section F
  const handleSyncFromF = () => {
    const usedGenerics = new Set();
    fRows.forEach(r => {
      if (r.primer && r.primer !== 'NA') usedGenerics.add(r.primer);
      if (r.intermediate && r.intermediate !== 'NA') usedGenerics.add(r.intermediate);
      if (r.finish && r.finish !== 'NA') usedGenerics.add(r.finish);
    });

    if (usedGenerics.size === 0) {
      addToast('No Paints in Section F', 'Please specify paint products in Section F first.', 'warning');
      return;
    }

    const newHRows = [];
    usedGenerics.forEach(genName => {
      const match = PAINT_DB.find(p => p.gen.toLowerCase() === genName.toLowerCase());
      if (match) {
        newHRows.push({
          gen: match.gen,
          int: match.prods.int || '',
          jot: match.prods.jot || '',
          asn: match.prods.asn || '',
          cbl: match.prods.cbl || '',
          hmp: match.prods.hmp || '',
          sgm: match.prods.sgm || '',
          oth1: '',
          oth2: ''
        });
      } else {
        newHRows.push({
          gen: genName,
          int: '',
          jot: '',
          asn: '',
          cbl: '',
          hmp: '',
          sgm: '',
          oth1: '',
          oth2: ''
        });
      }
    });

    setHRows(newHRows);
    addToast('Synced from Section F', `Mapped ${newHRows.length} generic paint types to approved manufacturer equivalents.`, 'success');
  };

  const handleValidate = () => {
    if (hRows.length === 0) {
      addToast('No Manufacturer Rows', 'Please add or sync manufacturer product rows.', 'warning');
      return;
    }
    addToast('Manufacturers Validated', `${hRows.length} paint manufacturer equivalents saved.`, 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setHRows([]);
    setSpecialComment('');
    addToast('Matrix Reset', 'Approved manufacturer matrix cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section H
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Approved Primer &amp; Paint Manufacturers Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Product equivalence table across global paint manufacturers (AkzoNobel, Jotun, Asian Paints/PPG, Carboline, Hempel, Sigma) linked to Section F generic selections.
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

      {/* Main Table Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-violet-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Manufacturer Equivalence Schedule ({hRows.length} {hRows.length === 1 ? 'Row' : 'Rows'})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncFromF}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>↻ Sync from Section F</span>
            </button>

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Custom Row</span>
            </button>
          </div>
        </div>

        {/* Scrollable Manufacturer Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[10.5px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3 min-w-[170px]">Generic Paint Type</th>
                <th className="p-3 min-w-[140px]">AkzoNobel / Inter</th>
                <th className="p-3 min-w-[140px]">Jotun</th>
                <th className="p-3 min-w-[140px]">Asian Paints / PPG</th>
                <th className="p-3 min-w-[140px]">Carboline</th>
                <th className="p-3 min-w-[140px]">Hempel</th>
                <th className="p-3 min-w-[140px]">Sigma (PPG)</th>
                <th className="p-3 min-w-[120px]">
                  <input
                    type="text"
                    value={otherColName}
                    onChange={e => setOtherColName(e.target.value)}
                    placeholder="Other 1"
                    className="w-full bg-transparent border-b border-dashed border-slate-400 focus:border-[#F7941D] text-[10.5px] font-mono font-bold uppercase text-slate-700 outline-none pb-0.5"
                    title="Click to customize column name"
                  />
                </th>
                <th className="p-3 min-w-[120px]">
                  <input
                    type="text"
                    value={other2ColName}
                    onChange={e => setOther2ColName(e.target.value)}
                    placeholder="Other 2"
                    className="w-full bg-transparent border-b border-dashed border-slate-400 focus:border-[#F7941D] text-[10.5px] font-mono font-bold uppercase text-slate-700 outline-none pb-0.5"
                    title="Click to customize column name"
                  />
                </th>
                <th className="p-3 w-10 text-center">×</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400 font-mono text-xs">
                    No manufacturer rows mapped yet. Click <strong className="text-emerald-700">↻ Sync from Section F</strong> or <strong className="text-[#D97706]">+ Add Custom Row</strong> above.
                  </td>
                </tr>
              ) : (
                hRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="p-2 text-center font-mono text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* Generic Paint Type */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.gen}
                        onChange={e => handleUpdateRow(idx, 'gen', e.target.value)}
                        placeholder="e.g. Inorganic Zinc Silicate"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* AkzoNobel */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.int}
                        onChange={e => handleUpdateRow(idx, 'int', e.target.value)}
                        placeholder="Interzinc 22"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Jotun */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.jot}
                        onChange={e => handleUpdateRow(idx, 'jot', e.target.value)}
                        placeholder="Resist 78 / 86"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Asian Paints / PPG */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.asn}
                        onChange={e => handleUpdateRow(idx, 'asn', e.target.value)}
                        placeholder="Zincsil 100"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Carboline */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.cbl}
                        onChange={e => handleUpdateRow(idx, 'cbl', e.target.value)}
                        placeholder="Carbozinc 11"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Hempel */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.hmp}
                        onChange={e => handleUpdateRow(idx, 'hmp', e.target.value)}
                        placeholder="Hempadur Zinc 17360"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Sigma PPG */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.sgm}
                        onChange={e => handleUpdateRow(idx, 'sgm', e.target.value)}
                        placeholder="SigmaZinc 109"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Other 1 */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.oth1}
                        onChange={e => handleUpdateRow(idx, 'oth1', e.target.value)}
                        placeholder="Product"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Other 2 */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.oth2}
                        onChange={e => handleUpdateRow(idx, 'oth2', e.target.value)}
                        placeholder="Product"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Remove */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete row"
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

        {/* Specialized Coating Justification Comment Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-600" />
            <label className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
              Specialized Material &amp; Alternate Manufacturer Justifications
            </label>
          </div>
          <textarea
            rows={3}
            value={specialComment}
            onChange={e => setSpecialComment(e.target.value)}
            placeholder="e.g. In case of client single-source approved list deviation, technical equivalence certificate and pre-qualification test records shall be submitted for approval..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
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
            <span>Verify Manufacturer Matrix</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Matrix</span>
          </button>
        </div>

      </div>

    </div>
  );
}
