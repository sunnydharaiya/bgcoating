import React from 'react';
import { 
  Palette, 
  Plus, 
  Trash2, 
  RefreshCw, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  Layers, 
  Calculator 
} from 'lucide-react';
import { 
  SURFACE_PREP_LIST, 
  PAINT_TYPES 
} from '../../data/specDatabase';
import { formatNum } from '../../utils/calculations';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecCoatingDesign({ fRows, setFRows, dRows, onNext }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleAddRow = () => {
    const newRow = {
      systemFor: '',
      surfacePrep: 'SA 2.5 of ISO 8501-1 (Near White Metal — Very Thorough)',
      profile: '50–75',
      primer: 'Inorganic Zinc Silicate Primer',
      primerDft: 75,
      intermediate: 'Epoxy High Build',
      intermediateDft: 150,
      finish: 'Polyurethane (Aliphatic PU)',
      finishDft: 60,
      area: ''
    };
    setFRows([...fRows, newRow]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...fRows];
    updated[index][field] = value;
    setFRows(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = fRows.filter((_, i) => i !== index);
    setFRows(updated);
  };

  // Sync from Section D (Components where Painting === 'YES')
  const handleSyncFromD = () => {
    const paintingComponents = dRows.filter(r => r.painting === 'YES' && r.component);
    if (paintingComponents.length === 0) {
      addToast('No Painting Components Found', 'No components in Section D have Painting = YES.', 'warning');
      return;
    }

    const newFRows = paintingComponents.map(comp => ({
      systemFor: comp.component,
      surfacePrep: 'SA 2.5 of ISO 8501-1 (Near White Metal — Very Thorough)',
      profile: '50–75',
      primer: 'Inorganic Zinc Silicate Primer',
      primerDft: 75,
      intermediate: 'Epoxy High Build',
      intermediateDft: 150,
      finish: 'Polyurethane (Aliphatic PU)',
      finishDft: 60,
      area: ''
    }));

    setFRows(newFRows);
    addToast('Synced from Section D', `Imported ${newFRows.length} painting components.`, 'success');
  };

  // Area Calculations
  const totalCoatedArea = fRows.reduce((sum, r) => sum + (Number(r.area) || 0), 0);

  // Area by paint generic type
  const areaByPaintMap = {};
  fRows.forEach(r => {
    const a = Number(r.area) || 0;
    if (a > 0) {
      if (r.primer && r.primer !== 'NA') areaByPaintMap[r.primer] = (areaByPaintMap[r.primer] || 0) + a;
      if (r.intermediate && r.intermediate !== 'NA') areaByPaintMap[r.intermediate] = (areaByPaintMap[r.intermediate] || 0) + a;
      if (r.finish && r.finish !== 'NA') areaByPaintMap[r.finish] = (areaByPaintMap[r.finish] || 0) + a;
    }
  });

  const handleValidate = () => {
    if (fRows.length === 0) {
      addToast('No Coating Systems Defined', 'Please add at least one coating system row.', 'warning');
      return;
    }
    addToast('Coating Systems Validated', `${fRows.length} multi-coat systems recorded.`, 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setFRows([]);
    addToast('Table Reset', 'Coating system design table cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section F
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Coating System Design &amp; Multi-Coat Schedule
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Surface preparation cleanliness, anchor profile, Primer/Intermediate/Finish paint generic selection, DFT specifications, and area takeoffs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('iso_12944')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 ISO 12944-5 Paint Systems</span>
          </button>
        </div>
      </div>

      {/* Main Table Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-sky-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Coating System Build Schedule ({fRows.length} {fRows.length === 1 ? 'Row' : 'Rows'})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncFromD}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>↻ Sync from Section D</span>
            </button>

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Coating System</span>
            </button>
          </div>
        </div>

        {/* Scrollable Coating System Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[10.5px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-10">#</th>
                <th className="p-3 min-w-[150px]">Coating System For</th>
                <th className="p-3 min-w-[160px]">Surface Preparation</th>
                <th className="p-3 w-24 text-center">Profile (µm)</th>
                <th className="p-3 min-w-[150px]">Primer Paint</th>
                <th className="p-3 w-20 text-center">DFT (µm)</th>
                <th className="p-3 min-w-[150px]">Intermediate Paint</th>
                <th className="p-3 w-20 text-center">DFT (µm)</th>
                <th className="p-3 min-w-[150px]">Finish Paint</th>
                <th className="p-3 w-20 text-center">DFT (µm)</th>
                <th className="p-3 w-24 text-center">Total DFT</th>
                <th className="p-3 w-24 text-center">Area (m²)</th>
                <th className="p-3 text-center w-10">×</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-slate-400 font-mono text-xs">
                    No coating systems defined. Click <strong className="text-[#D97706]">+ Add Coating System</strong> or <strong className="text-emerald-700">↻ Sync from Section D</strong> above.
                  </td>
                </tr>
              ) : (
                fRows.map((row, idx) => {
                  const totalDft = (Number(row.primerDft) || 0) + (Number(row.intermediateDft) || 0) + (Number(row.finishDft) || 0);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="p-2 text-center font-mono text-slate-400 font-bold">
                        {idx + 1}
                      </td>

                      {/* System For */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.systemFor}
                          onChange={e => handleUpdateRow(idx, 'systemFor', e.target.value)}
                          placeholder="e.g. Vessel Shell Ext."
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      {/* Surface Prep */}
                      <td className="p-2">
                        <select
                          value={row.surfacePrep}
                          onChange={e => handleUpdateRow(idx, 'surfacePrep', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        >
                          {SURFACE_PREP_LIST.map((sp, i) => (
                            <option key={i} value={sp}>{sp}</option>
                          ))}
                        </select>
                      </td>

                      {/* Profile */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.profile}
                          onChange={e => handleUpdateRow(idx, 'profile', e.target.value)}
                          placeholder="50–75"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      {/* Primer Paint */}
                      <td className="p-2">
                        <select
                          value={row.primer}
                          onChange={e => handleUpdateRow(idx, 'primer', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        >
                          {PAINT_TYPES.map((pt, i) => (
                            <option key={i} value={pt}>{pt}</option>
                          ))}
                        </select>
                      </td>

                      {/* Primer DFT */}
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.primerDft}
                          onChange={e => handleUpdateRow(idx, 'primerDft', e.target.value)}
                          placeholder="75"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      {/* Intermediate Paint */}
                      <td className="p-2">
                        <select
                          value={row.intermediate}
                          onChange={e => handleUpdateRow(idx, 'intermediate', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        >
                          {PAINT_TYPES.map((pt, i) => (
                            <option key={i} value={pt}>{pt}</option>
                          ))}
                        </select>
                      </td>

                      {/* Intermediate DFT */}
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.intermediateDft}
                          onChange={e => handleUpdateRow(idx, 'intermediateDft', e.target.value)}
                          placeholder="150"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      {/* Finish Paint */}
                      <td className="p-2">
                        <select
                          value={row.finish}
                          onChange={e => handleUpdateRow(idx, 'finish', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        >
                          {PAINT_TYPES.map((pt, i) => (
                            <option key={i} value={pt}>{pt}</option>
                          ))}
                        </select>
                      </td>

                      {/* Finish DFT */}
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.finishDft}
                          onChange={e => handleUpdateRow(idx, 'finishDft', e.target.value)}
                          placeholder="60"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      {/* Total DFT */}
                      <td className="p-2 text-center font-mono font-extrabold text-slate-900 bg-slate-50/80">
                        {totalDft} µm
                      </td>

                      {/* Area */}
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.area}
                          onChange={e => handleUpdateRow(idx, 'area', e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-[#D97706] focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                        />
                      </td>

                      {/* Delete */}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Live Area Takeoff Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#F7941D]" />
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                📐 Coating System — Surface Area Summary
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#D97706] bg-white px-2.5 py-1 rounded-xl border border-amber-200">
              Total: {totalCoatedArea > 0 ? `${formatNum(totalCoatedArea, 1)} m²` : '—'}
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Area Breakdown by Generic Paint Item:
            </span>
            {Object.keys(areaByPaintMap).length === 0 ? (
              <p className="text-xs text-slate-400 italic font-mono">
                Enter surface area (m²) into rows above to view live area breakdown by paint product.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {Object.entries(areaByPaintMap).map(([paint, areaVal], i) => (
                  <div key={i} className="p-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate mr-2">{paint}</span>
                    <span className="font-mono font-bold text-slate-900 shrink-0">{formatNum(areaVal, 1)} m²</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Validate Coating Systems</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Table</span>
          </button>
        </div>

      </div>

    </div>
  );
}
