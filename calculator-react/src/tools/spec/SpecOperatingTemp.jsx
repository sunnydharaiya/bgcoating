import React from 'react';
import { 
  Thermometer, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  AlertTriangle, 
  Flame 
} from 'lucide-react';
import { COMPONENT_LIST } from '../../data/specDatabase';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecOperatingTemp({ dRows, setDRows, onNext }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleAddRow = () => {
    const newRow = {
      component: '',
      opTemp: '',
      designTemp: '',
      painting: 'YES',
      galv: 'NO',
      tsa: 'NA',
      insulation: 'NO',
      fireproof: 'NO',
      surface: 'External'
    };
    setDRows([...dRows, newRow]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...dRows];
    updated[index][field] = value;
    setDRows(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = dRows.filter((_, i) => i !== index);
    setDRows(updated);
  };

  const handleValidate = () => {
    if (dRows.length === 0) {
      addToast('No Components Added', 'Please add at least one component temperature row.', 'warning');
      return;
    }
    const missing = dRows.some(r => !r.component || r.opTemp === '' || r.designTemp === '');
    if (missing) {
      addToast('Incomplete Rows', 'Please fill in Component Name, Operating Temp, and Design Temp for all rows.', 'warning');
      return;
    }
    addToast('Temperature Matrix Validated', `${dRows.length} component temperature rows saved.`, 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setDRows([]);
    addToast('Matrix Cleared', 'All component temperature rows have been removed.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section D
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Operating &amp; Design Temperature Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Component-wise operating and design temperatures, discipline scope checkboxes, and painting surface assignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('spec_reading')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Temperature Guideline</span>
          </button>
        </div>
      </div>

      {/* Critical Engineering Warnings Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[11px] text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Operating vs. Design Temperature</span>
          </div>
          <p className="leading-relaxed">
            Both must be defined accurately, as coating specifications may specify paint systems based on either operating or maximum design excursion temperature.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[11px] text-[#D97706]">
            <Flame className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Refractory-Lined Equipment Skin Temp</span>
          </div>
          <p className="leading-relaxed">
            For refractory-lined internal equipment (e.g. reactors, furnaces), external metal skin temperature shall be entered in the Design Temp column.
          </p>
        </div>
      </div>

      {/* Main Table Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-rose-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Equipment Component Schedule ({dRows.length} {dRows.length === 1 ? 'Row' : 'Rows'})
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Component Row</span>
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[10.5px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3 min-w-[160px]">Component / Surface</th>
                <th className="p-3 w-28 text-center">Op. Temp (°C)</th>
                <th className="p-3 w-28 text-center">Design Temp (°C)</th>
                <th className="p-3 w-20 text-center">Painting</th>
                <th className="p-3 w-24 text-center">Galvanizing</th>
                <th className="p-3 w-24 text-center">TSA / FRP</th>
                <th className="p-3 w-24 text-center">Insulation</th>
                <th className="p-3 w-24 text-center">Fireproofing</th>
                <th className="p-3 min-w-[120px] text-center">Surface Scope</th>
                <th className="p-3 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400 font-mono text-xs">
                    No components added yet. Click <strong className="text-[#D97706]">+ Add Component Row</strong> above to begin.
                  </td>
                </tr>
              ) : (
                dRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="p-2 text-center font-mono text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* Component Name */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.component}
                        onChange={e => handleUpdateRow(idx, 'component', e.target.value)}
                        placeholder="e.g. Vessel Shell / Skirt"
                        list={`comp-list-${idx}`}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                      <datalist id={`comp-list-${idx}`}>
                        {COMPONENT_LIST.map((c, i) => (
                          <option key={i} value={c} />
                        ))}
                      </datalist>
                    </td>

                    {/* Operating Temp */}
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.opTemp}
                        onChange={e => handleUpdateRow(idx, 'opTemp', e.target.value)}
                        placeholder="e.g. 65"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Design Temp */}
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.designTemp}
                        onChange={e => handleUpdateRow(idx, 'designTemp', e.target.value)}
                        placeholder="e.g. 95"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                      />
                    </td>

                    {/* Painting YES/NO */}
                    <td className="p-2 text-center">
                      <select
                        value={row.painting}
                        onChange={e => handleUpdateRow(idx, 'painting', e.target.value)}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          row.painting === 'YES' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </td>

                    {/* Galvanizing YES/NO */}
                    <td className="p-2 text-center">
                      <select
                        value={row.galv}
                        onChange={e => handleUpdateRow(idx, 'galv', e.target.value)}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          row.galv === 'YES' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </td>

                    {/* TSA/FRP */}
                    <td className="p-2 text-center">
                      <select
                        value={row.tsa}
                        onChange={e => handleUpdateRow(idx, 'tsa', e.target.value)}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          row.tsa === 'YES' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                        <option value="NA">NA</option>
                      </select>
                    </td>

                    {/* Insulation */}
                    <td className="p-2 text-center">
                      <select
                        value={row.insulation}
                        onChange={e => handleUpdateRow(idx, 'insulation', e.target.value)}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          row.insulation === 'YES' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </td>

                    {/* Fireproofing */}
                    <td className="p-2 text-center">
                      <select
                        value={row.fireproof}
                        onChange={e => handleUpdateRow(idx, 'fireproof', e.target.value)}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          row.fireproof === 'YES' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </td>

                    {/* Painting Surface */}
                    <td className="p-2 text-center">
                      <select
                        value={row.surface}
                        onChange={e => handleUpdateRow(idx, 'surface', e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-800"
                      >
                        <option value="External">External</option>
                        <option value="Internal">Internal</option>
                        <option value="Both">Both (Int + Ext)</option>
                      </select>
                    </td>

                    {/* Remove Action */}
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

        {/* Actions Bar */}
        <div className="flex gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Validate Temperature Matrix</span>
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
