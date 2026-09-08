import React from 'react';
import { 
  Flame, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw,
  Sliders
} from 'lucide-react';

export default function UnitRateSectionD({ 
  formData, 
  onUpdateField, 
  onSyncSectionF,
  onNavigateNext, 
  onNavigatePrev, 
  onReset 
}) {
  const dRows = formData.dRows || [];

  const handleAddRow = () => {
    const newRow = {
      comp: '',
      opT: '',
      desT: '',
      painting: 'YES',
      galv: 'NO',
      tsa: 'NA',
      ins: 'NO',
      fp: 'NO',
      surface: 'External'
    };
    onUpdateField('dRows', [...dRows, newRow]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...dRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdateField('dRows', updated);
  };

  const handleRemoveRow = (index) => {
    const updated = dRows.filter((_, i) => i !== index);
    onUpdateField('dRows', updated.length ? updated : []);
  };

  const renderYnoToggle = (index, field, currentValue) => {
    const val = currentValue || 'NA';
    return (
      <div className="inline-flex rounded-md p-0.5 bg-slate-950/80 border border-slate-700">
        {['YES', 'NO', 'NA'].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleUpdateRow(index, field, opt)}
            className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition ${
              val === opt
                ? opt === 'YES'
                  ? 'bg-emerald-600 text-white'
                  : opt === 'NO'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {opt === 'YES' ? 'Y' : opt === 'NO' ? 'N' : 'NA'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">03. Section D — Operating &amp; Design Temperature Data</h2>
              <p className="text-xs text-slate-400">Specify process tags, operating &amp; design temperatures (°C), and applied surface treatments.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSyncSectionF}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition border border-blue-500/30"
              title="Push rows with Painting=YES to Section F"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync to Section F
            </button>

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition border border-amber-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component Row
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-700">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[160px]">Component / Tag No.</th>
                <th className="py-2.5 px-3 w-28 text-center">Op. Temp (°C)</th>
                <th className="py-2.5 px-3 w-28 text-center">Des. Temp (°C)</th>
                <th className="py-2.5 px-3 w-24 text-center">Painting</th>
                <th className="py-2.5 px-3 w-24 text-center">Galvanizing</th>
                <th className="py-2.5 px-3 w-24 text-center">TSA</th>
                <th className="py-2.5 px-3 w-24 text-center">Insulation</th>
                <th className="py-2.5 px-3 w-24 text-center">Fireproofing</th>
                <th className="py-2.5 px-3 w-28 text-center">Surface Split</th>
                <th className="py-2.5 px-2 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dRows.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-500 italic text-xs">
                    No equipment or component rows added. Click <strong className="text-amber-400">+ Add Component Row</strong> above to begin.
                  </td>
                </tr>
              ) : (
                dRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-mono text-slate-500 text-center">{idx + 1}</td>
                    
                    {/* Component Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.comp || ''}
                        onChange={(e) => handleUpdateRow(idx, 'comp', e.target.value)}
                        placeholder="e.g. Shell / Pipe Spools"
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Operating Temp */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={row.opT || ''}
                        onChange={(e) => handleUpdateRow(idx, 'opT', e.target.value)}
                        placeholder="e.g. 80"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-center font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Design Temp */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={row.desT || ''}
                        onChange={(e) => handleUpdateRow(idx, 'desT', e.target.value)}
                        placeholder="e.g. 120"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-center font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Treatment Toggles */}
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'painting', row.painting)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'galv', row.galv)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'tsa', row.tsa)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'ins', row.ins)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'fp', row.fp)}</td>

                    {/* Surface Split */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={row.surface || 'External'}
                        onChange={(e) => handleUpdateRow(idx, 'surface', e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white focus:outline-none"
                      >
                        <option value="External">External</option>
                        <option value="Internal">Internal</option>
                        <option value="Both">Both (Ext + Int)</option>
                      </select>
                    </td>

                    {/* Delete Action */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded transition"
                        title="Remove Row"
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

      {/* Dual Action Bottom Toolbar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onNavigatePrev}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Company Scope</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Section D
          </button>

          <button
            onClick={onNavigateNext}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-95 transition"
          >
            <span>Next: Section F Coating Design</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
