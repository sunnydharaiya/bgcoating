import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { QREF_PAINTS } from '../../data/manpowerDatabase';

export default function ManpowerRawMaterial({
  state,
  onChange,
  metrics,
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const {
    rawCalculatedRows = [],
    rawTotal = 0,
    rawPM2 = 0,
    rawCoats = 0,
    area = 0,
    formatCur = (v) => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    formatNum = (v, d = 0) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
  } = (metrics || {});

  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);

  const rawRows = state.rawRows && state.rawRows.length > 0
    ? state.rawRows
    : [
        { name: 'Coat 1 Paint', dft: 0, vs: 0, thinner: 0, loss: 0, paintPrice: 0, thinnerPrice: 0 },
        { name: 'Coat 2 Paint', dft: 0, vs: 0, thinner: 0, loss: 0, paintPrice: 0, thinnerPrice: 0 },
        { name: 'Coat 3 Paint', dft: 0, vs: 0, thinner: 0, loss: 0, paintPrice: 0, thinnerPrice: 0 },
        { name: 'Coat 4 Paint', dft: 0, vs: 0, thinner: 0, loss: 0, paintPrice: 0, thinnerPrice: 0 }
      ];

  const handleRowChange = (index, field, value) => {
    const updated = [...rawRows];
    updated[index] = { ...updated[index], [field]: value };
    onChange('rawRows', updated);
  };

  const handleAddRow = () => {
    const nextCoatNo = rawRows.length + 1;
    const newRow = {
      name: `Coat ${nextCoatNo} Paint`,
      dft: 0,
      vs: 0,
      thinner: 0,
      loss: 0,
      paintPrice: 0,
      thinnerPrice: 0
    };
    onChange('rawRows', [...rawRows, newRow]);
  };

  const handleDeleteRow = (index) => {
    if (rawRows.length <= 1) return;
    const updated = rawRows.filter((_, idx) => idx !== index);
    onChange('rawRows', updated);
  };

  const handleAutoFill = (preset) => {
    // Look for first unconfigured row, or append
    const updated = [...rawRows];
    const emptyIdx = updated.findIndex(r => !r.dft || r.dft === 0);
    const targetIdx = emptyIdx >= 0 ? emptyIdx : updated.length;
    
    const filledRow = {
      name: preset.name,
      dft: preset.dft,
      vs: preset.vs,
      thinner: preset.thinner || 5,
      loss: preset.loss || 20,
      paintPrice: preset.paintPrice || 450,
      thinnerPrice: preset.thinnerPrice || 150
    };

    if (emptyIdx >= 0) {
      updated[emptyIdx] = filledRow;
    } else {
      updated.push(filledRow);
    }
    onChange('rawRows', updated);
  };

  return (
    <div className="space-y-4">
      
      {/* MODULE 4 BANNER (Matches 3.png) */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 4 · PAINT RAW MATERIAL COST
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Per-Coat Paint &amp; Thinner Raw Material Cost
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          For each coat: enter Paint Name, DFT, Volume Solids%, Thinner%, Loss%, Paint &amp; Thinner Price. System calculates Theoretical Coverage (TC), Practical Spread (PS), Paint Qty, Thinner Qty and total cost per coat. Default 4 coats — add/remove as required.
        </p>
      </div>

      {/* SECTION 1: Coat-by-Coat Paint Cost Calculator */}
      <div id="section-coat-by-coat" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Coat-by-Coat Paint Cost Calculator
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                BG Group Formulas: TC = VS×10÷DFT | PS = TC-(TC×Loss÷100)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900">
              COATS
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900">
              SECTION COST ₹{formatCur(rawTotal)}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900">
              PER SQ.M. COST ₹{formatCur(rawPM2)}
            </span>
            {openA ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openA && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            
            <div className="overflow-x-auto rounded-lg border border-orange-200 shadow-2xs bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FFEAD5] text-[#5A240A] text-[10px] font-mono font-bold uppercase tracking-wider border-b border-orange-200">
                  <tr>
                    <th className="py-2 px-2 text-center">#</th>
                    <th className="py-2 px-3 min-w-[130px]">PAINT NAME</th>
                    <th className="py-2 px-2 text-center">DFT µM</th>
                    <th className="py-2 px-2 text-center">VS %</th>
                    <th className="py-2 px-2 text-center">THINNER %</th>
                    <th className="py-2 px-2 text-center">LOSS %</th>
                    <th className="py-2 px-2 text-center">PAINT PRICE /L</th>
                    <th className="py-2 px-2 text-center">THINNER PRICE /L</th>
                    <th className="py-2 px-2 text-right">TC (M²/L)</th>
                    <th className="py-2 px-2 text-right">PS (M²/L)</th>
                    <th className="py-2 px-2 text-right">PAINT QTY (L)</th>
                    <th className="py-2 px-2 text-right">THINNER QTY (L)</th>
                    <th className="py-2 px-2 text-right min-w-[100px]">COAT TOTAL COST</th>
                    <th className="py-2 px-2 text-right min-w-[70px]">COST / M²</th>
                    <th className="py-2 px-1 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {rawRows.map((row, idx) => {
                    const calc = rawCalculatedRows[idx] || {};
                    const hasData = row.dft > 0 && row.vs > 0;
                    
                    return (
                      <tr key={idx} className="hover:bg-orange-50/50">
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.name || ''}
                            onChange={(e) => handleRowChange(idx, 'name', e.target.value)}
                            placeholder={`Coat ${idx + 1} Paint`}
                            className="w-full px-2 py-1 text-xs font-semibold rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>
                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            value={row.dft ?? 0}
                            onChange={(e) => handleRowChange(idx, 'dft', parseFloat(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>
                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            value={row.vs ?? 0}
                            onChange={(e) => handleRowChange(idx, 'vs', parseFloat(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>
                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            value={row.thinner ?? 0}
                            onChange={(e) => handleRowChange(idx, 'thinner', parseFloat(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>
                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            value={row.loss ?? 0}
                            onChange={(e) => handleRowChange(idx, 'loss', parseFloat(e.target.value) || 0)}
                            className="w-14 px-1.5 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>
                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            value={row.paintPrice ?? 0}
                            onChange={(e) => handleRowChange(idx, 'paintPrice', parseFloat(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>
                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            value={row.thinnerPrice ?? 0}
                            onChange={(e) => handleRowChange(idx, 'thinnerPrice', parseFloat(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 text-center font-mono rounded border border-orange-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#F5911F]"
                          />
                        </td>

                        {/* Calculated fields */}
                        <td className="py-2 px-2 text-right font-mono text-slate-700">
                          {hasData ? formatNum(calc.tc, 2) : '—'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-700">
                          {hasData ? formatNum(calc.ps, 2) : '—'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-700">
                          {hasData ? formatNum(calc.paintQty, 1) : '—'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-700">
                          {hasData ? formatNum(calc.thinnerQty, 1) : '—'}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                          ₹{formatCur(calc.coatCost || 0)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-semibold text-slate-700">
                          ₹{formatCur(calc.costPerM2 || 0)}
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(idx)}
                            className="p-1 rounded hover:bg-rose-100 text-rose-500 transition cursor-pointer"
                            title="Remove coat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Summary Totals Row */}
                  <tr className="bg-[#FFEAD5]/80 font-bold text-slate-900 border-t-2 border-orange-200">
                    <td colSpan={12} className="py-2.5 px-4 text-right font-mono uppercase tracking-wider text-xs">
                      RAW MATERIAL TOTAL:
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-black text-emerald-700 text-sm">
                      ₹{formatCur(rawTotal)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-700">
                      ₹{formatCur(rawPM2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 text-[#C23A1B] text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Coat Row</span>
            </button>

          </div>
        )}
      </div>

      {/* SECTION 2: Quick Reference — Common Paint Systems */}
      <div id="section-quick-reference" className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenB(!openB)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Quick Reference — Common Paint Systems
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                Click any row to auto-fill a coat in the calculator above (values stay editable)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-orange-300/80 text-orange-900">
              REFERENCE
            </span>
            {openB ? (
              <ChevronUp className="w-4 h-4 text-orange-800" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800" />
            )}
          </div>
        </button>

        {openB && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5">
            <div className="overflow-x-auto rounded-lg border border-orange-200 shadow-2xs bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FFEAD5] text-[#5A240A] text-[10px] font-mono font-bold uppercase tracking-wider border-b border-orange-200">
                  <tr>
                    <th className="py-2.5 px-3">PAINT TYPE</th>
                    <th className="py-2.5 px-3 text-center">VS %</th>
                    <th className="py-2.5 px-3 text-center">DFT µM</th>
                    <th className="py-2.5 px-3 text-center">LOSS %</th>
                    <th className="py-2.5 px-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {QREF_PAINTS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-orange-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2 px-3 text-center font-mono">{item.vs}%</td>
                      <td className="py-2 px-3 text-center font-mono">{item.dft}</td>
                      <td className="py-2 px-3 text-center font-mono">{item.loss}%</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleAutoFill(item)}
                          className="px-2.5 py-1 rounded border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#C23A1B] text-[10px] font-mono font-bold transition cursor-pointer"
                        >
                          + Auto-fill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-2 rounded-lg bg-[#3F2B68] hover:bg-[#342356] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={onValidate}
            className="px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>VALIDATE / APPROVAL</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-lg bg-[#FFF5F5] hover:bg-[#FEECEC] border border-rose-300 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('summary')}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E85D22] to-[#CB3A14] hover:brightness-110 text-white text-xs font-black tracking-wider flex items-center gap-2 transition shadow-sm cursor-pointer uppercase font-mono"
        >
          <span>NEXT : FRONT PAGE SUMMARY →</span>
        </button>
      </div>

      {/* BRANDED FOOTER */}
      <div className="bg-[#2B0E10] text-[#D8BDBE] rounded-xl p-4 sm:p-5 border-t-2 border-[#5C1E23] flex flex-col items-center justify-center text-center space-y-1.5 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide font-mono">
            BG GROUP <span className="text-xs font-normal text-rose-200">of Paint and Coating Consultant</span>
          </span>
        </div>
        <div className="text-[11px] text-rose-200/90 font-medium">
          Industrial Cost Estimation · Surface Protection · Coating Engineering
        </div>
        <div className="text-[10px] text-rose-300/60 font-mono flex flex-wrap justify-center gap-x-2">
          <span>E 103, Akash Echo Point, Bhimrad, Surat - 395007, Gujarat, India</span>
          <span>|</span>
          <span>+91 98258 10408</span>
          <span>|</span>
          <span>support@bgcoating.com</span>
          <span>|</span>
          <span>www.bgcoating.com</span>
        </div>
      </div>

    </div>
  );
}
