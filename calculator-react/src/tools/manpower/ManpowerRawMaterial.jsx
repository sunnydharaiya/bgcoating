import React from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  BookmarkPlus
} from 'lucide-react';
import { QREF_PAINTS } from '../../data/manpowerDatabase';

export default function ManpowerRawMaterial({ state, onChange, metrics, onNavigate }) {
  const {
    rawCalculatedRows,
    rawTotal,
    rawPM2,
    rawCoats,
    area,
    formatCur,
    formatNum
  } = metrics;

  const handleRowChange = (index, field, value) => {
    const updated = [...(state.rawRows || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange('rawRows', updated);
  };

  const handleAddRow = (preset = null) => {
    const defaultRow = preset || {
      name: `Coat ${(state.rawRows?.length || 0) + 1} Paint`,
      dft: 100,
      vs: 75,
      thinner: 5,
      loss: 25,
      paintPrice: 450,
      thinnerPrice: 150
    };
    onChange('rawRows', [...(state.rawRows || []), defaultRow]);
  };

  const handleDeleteRow = (index) => {
    const updated = (state.rawRows || []).filter((_, idx) => idx !== index);
    onChange('rawRows', updated);
  };

  const handleApplyQRef = (qref) => {
    // Fill first empty row or append new row
    const rows = [...(state.rawRows || [])];
    const emptyIndex = rows.findIndex(r => !r.dft || !r.name || r.name.startsWith('Coat '));
    const newEntry = {
      name: qref.name,
      dft: qref.dft,
      vs: qref.vs,
      thinner: qref.thinner ?? 5,
      loss: qref.loss,
      paintPrice: qref.paintPrice ?? 450,
      thinnerPrice: qref.thinnerPrice ?? 150
    };

    if (emptyIndex >= 0) {
      rows[emptyIndex] = newEntry;
      onChange('rawRows', rows);
    } else {
      onChange('rawRows', [...rows, newEntry]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header & Subtotal Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
              <span>Module 04 · Material Formulation Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Paint Raw Material &amp; Spreading Dynamics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Coat-by-coat calculation of theoretical &amp; practical spreading rate, volume solids percentage, dead volume thinner allowance, and application losses.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#E8700A] to-[#F5911F] text-white p-3.5 rounded-xl shadow-md min-w-[200px] shrink-0">
            <div className="text-[10px] uppercase font-bold text-orange-950">Raw Material Subtotal</div>
            <div className="text-xl font-mono font-black">{formatCur(rawTotal)}</div>
            <div className="text-[11px] font-mono text-orange-950/80 font-bold mt-0.5">
              {formatCur(rawPM2)} / m² ({rawCoats} Active Coats)
            </div>
          </div>
        </div>
      </div>

      {/* Coat-by-Coat Calculator Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E8700A]" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Coat-by-Coat Paint &amp; Thinner Calculator
            </h3>
          </div>
          <button
            onClick={() => handleAddRow()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8700A]/10 hover:bg-[#E8700A]/20 text-[#E8700A] text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coat</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-2.5 px-2 text-center w-10">#</th>
                <th className="py-2.5 px-3 min-w-[180px]">Paint Product Name</th>
                <th className="py-2.5 px-2 text-center">DFT (µm)</th>
                <th className="py-2.5 px-2 text-center">VS %</th>
                <th className="py-2.5 px-2 text-center">Thinner %</th>
                <th className="py-2.5 px-2 text-center">Loss %</th>
                <th className="py-2.5 px-2 text-right">Paint Price/L</th>
                <th className="py-2.5 px-2 text-right">Thinner/L</th>
                <th className="py-2.5 px-2 text-right font-mono text-slate-500">TC (m²/L)</th>
                <th className="py-2.5 px-2 text-right font-mono text-slate-500">PS (m²/L)</th>
                <th className="py-2.5 px-2 text-right font-mono text-slate-500">Paint (L)</th>
                <th className="py-2.5 px-2 text-right font-mono text-slate-500">Thinner (L)</th>
                <th className="py-2.5 px-3 text-right font-bold text-orange-600 dark:text-orange-400">Coat Total</th>
                <th className="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-400">/ m²</th>
                <th className="py-2.5 px-2 text-center w-10">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rawCalculatedRows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-2 text-center font-bold text-[#E8700A]">{idx + 1}</td>
                  
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={r.name || ''}
                      onChange={(e) => handleRowChange(idx, 'name', e.target.value)}
                      placeholder="Paint Name"
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      min="0"
                      value={r.dft ?? ''}
                      onChange={(e) => handleRowChange(idx, 'dft', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono text-xs"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={r.vs ?? ''}
                      onChange={(e) => handleRowChange(idx, 'vs', parseFloat(e.target.value) || 0)}
                      className="w-14 px-1.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono text-xs"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={r.thinner ?? ''}
                      onChange={(e) => handleRowChange(idx, 'thinner', parseFloat(e.target.value) || 0)}
                      className="w-14 px-1.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono text-xs"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={r.loss ?? ''}
                      onChange={(e) => handleRowChange(idx, 'loss', parseFloat(e.target.value) || 0)}
                      className="w-14 px-1.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono text-xs"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-right">
                    <input
                      type="number"
                      min="0"
                      value={r.paintPrice ?? ''}
                      onChange={(e) => handleRowChange(idx, 'paintPrice', parseFloat(e.target.value) || 0)}
                      className="w-20 px-1.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-right">
                    <input
                      type="number"
                      min="0"
                      value={r.thinnerPrice ?? ''}
                      onChange={(e) => handleRowChange(idx, 'thinnerPrice', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-right font-mono text-xs"
                    />
                  </td>

                  {/* Calculated metrics */}
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{formatNum(r.tc, 2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{formatNum(r.ps, 2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">{formatNum(r.pq, 1)} L</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{formatNum(r.tq, 1)} L</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600 dark:text-orange-400">{formatCur(r.cost)}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-400">{formatCur(r.pm2)}</td>

                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(idx)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                      title="Delete Coat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Reference Common Paint Systems */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <BookmarkPlus className="w-4 h-4 text-[#E8700A]" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            18 Standard Industrial Coating Systems (1-Click Auto-Fill)
          </h3>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold z-10">
              <tr>
                <th className="py-2 px-3">System Name</th>
                <th className="py-2 px-3 text-center">Typical VS %</th>
                <th className="py-2 px-3 text-center">Typical DFT (µm)</th>
                <th className="py-2 px-3 text-center">Loss Allowance %</th>
                <th className="py-2 px-3 text-right">Reference Paint Price</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {QREF_PAINTS.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="py-2 px-3 text-center font-mono">{p.vs}%</td>
                  <td className="py-2 px-3 text-center font-mono">{p.dft} µm</td>
                  <td className="py-2 px-3 text-center font-mono">{p.loss}%</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {formatCur(p.paintPrice)} / L
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleApplyQRef(p)}
                      className="px-2.5 py-1 rounded bg-[#E8700A] hover:bg-[#F5911F] text-white font-bold text-[10px] transition cursor-pointer"
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

      {/* Navigation Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Step 4 of 7 Completed · Total Raw Material: <span className="font-mono font-bold text-[#F5911F]">{formatCur(rawTotal)}</span>
        </div>
        <button
          onClick={() => onNavigate('worker-ctc')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>Next: Individual Worker CTC</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
