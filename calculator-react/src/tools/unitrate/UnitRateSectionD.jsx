import React from 'react';
import { 
  Flame, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw 
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
      opT: 60,
      desT: 85,
      paint: 'YES',
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
      <div className="inline-flex rounded-md p-0.5 bg-[#F1F5F9] border border-[#CBD5E1]">
        {['YES', 'NO', 'NA'].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleUpdateRow(index, field, opt)}
            className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
              val === opt
                ? opt === 'YES'
                  ? 'bg-[#059669] text-white shadow-2xs'
                  : opt === 'NO'
                    ? 'bg-[#E11D48] text-white shadow-2xs'
                    : 'bg-[#64748B] text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {opt === 'YES' ? 'Y' : opt === 'NO' ? 'N' : 'NA'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div id="section-section-d" className="space-y-6">
      {/* Header Card (Clean Light Theme matching media_1792173809775_e8eaea16.png) */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#E6E8EC] shadow-[0_2px_12px_rgba(20,24,32,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF5EA] text-[#D97706] border border-[#FDE3C7] shadow-2xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">03. Section D — Operating &amp; Design Temperature Data</h2>
              <p className="text-xs text-[#64748B]">Specify process tags, operating &amp; design temperatures (°C), and applied surface treatments.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSyncSectionF}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition border border-blue-200 shadow-2xs cursor-pointer"
              title="Push rows with Painting=YES to Section F"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync to Section F
            </button>

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-lg bg-[#FFF5EA] hover:bg-[#FFEBD4] text-[#D97706] text-xs font-semibold flex items-center gap-1.5 transition border border-[#FDE3C7] shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component Row
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#475569] font-mono uppercase text-[10px] border-b border-[#E2E8F0]">
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
            <tbody className="divide-y divide-[#F1F5F9]">
              {dRows.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400 italic text-xs">
                    No equipment or component rows added. Click <strong className="text-[#D97706]">+ Add Component Row</strong> above to begin.
                  </td>
                </tr>
              ) : (
                dRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-2 px-3 font-mono text-slate-400 text-center">{idx + 1}</td>
                    
                    {/* Component Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.comp || ''}
                        onChange={(e) => handleUpdateRow(idx, 'comp', e.target.value)}
                        placeholder="e.g. Shell / Pipe Spools"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none transition"
                      />
                    </td>

                    {/* Operating Temp */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={row.opT || ''}
                        onChange={(e) => handleUpdateRow(idx, 'opT', e.target.value)}
                        placeholder="60"
                        className="w-20 px-2 py-1 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-center font-mono text-[#0F172A] focus:outline-none transition"
                      />
                    </td>

                    {/* Design Temp */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        value={row.desT || ''}
                        onChange={(e) => handleUpdateRow(idx, 'desT', e.target.value)}
                        placeholder="85"
                        className="w-20 px-2 py-1 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-center font-mono text-[#0F172A] focus:outline-none transition"
                      />
                    </td>

                    {/* Toggles */}
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'paint', row.paint)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'galv', row.galv)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'tsa', row.tsa)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'ins', row.ins)}</td>
                    <td className="py-2 px-3 text-center">{renderYnoToggle(idx, 'fp', row.fp)}</td>

                    {/* Surface Split */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={row.surface || 'External'}
                        onChange={(e) => handleUpdateRow(idx, 'surface', e.target.value)}
                        className="px-2 py-1 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-[#0F172A] focus:outline-none cursor-pointer"
                      >
                        <option value="External">External</option>
                        <option value="Internal">Internal</option>
                        <option value="Both">Both</option>
                      </select>
                    </td>

                    {/* Remove Action */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition cursor-pointer"
                        title="Delete Row"
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
      {onNavigatePrev && onNavigateNext && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onNavigatePrev}
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#F8FAFC] text-slate-700 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back: Scope Matrix</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Section D
            </button>

            <button
              onClick={onNavigateNext}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#E8700A] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-105 transition cursor-pointer"
            >
              <span>Next: Section F Coating Design</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
