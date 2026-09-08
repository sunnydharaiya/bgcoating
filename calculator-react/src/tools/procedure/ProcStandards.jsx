import React, { useState } from 'react';
import { PROC_STANDARDS_LIB } from '../../data/procedureDatabase';

export default function ProcStandards({ state, onChange, onNext, onPrev, onReset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');

  const selected = new Set(state.selectedStandards || []);

  const toggleStandard = (code) => {
    const updated = new Set(selected);
    if (updated.has(code)) {
      updated.delete(code);
    } else {
      updated.add(code);
    }
    onChange({ selectedStandards: Array.from(updated) });
  };

  const selectAll = () => {
    onChange({ selectedStandards: PROC_STANDARDS_LIB.map((s) => s.code) });
  };

  const clearAll = () => {
    onChange({ selectedStandards: [] });
  };

  const filteredStandards = PROC_STANDARDS_LIB.filter((s) => {
    const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase()) || s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterCat === 'ALL') return matchesSearch;
    if (filterCat === 'ISO') return matchesSearch && s.code.startsWith('ISO');
    if (filterCat === 'ASTM') return matchesSearch && s.code.startsWith('ASTM');
    if (filterCat === 'SSPC') return matchesSearch && (s.code.includes('SSPC') || s.code.includes('AMPP') || s.code.includes('NACE'));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 04</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Reference Coating Standards</h2>
          <p className="text-xs text-gray-500">Industry standards, testing methods, cleanliness grades, profile measurements, and environmental codes.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            {selected.size} Standards Selected
          </span>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search code or keywords (e.g. 8501, salt, SSPC, adhesion)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs p-2 border border-gray-300 rounded-lg w-full md:w-72 focus:border-red-600 focus:outline-none"
          />
          <div className="flex gap-1">
            {['ALL', 'ISO', 'ASTM', 'SSPC'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`text-xs px-2.5 py-1.5 rounded font-bold transition ${
                  filterCat === cat
                    ? 'bg-red-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-red-700 hover:text-red-800 font-semibold px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-700 font-semibold px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Standards Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {filteredStandards.map((std, idx) => {
          const isSelected = selected.has(std.code);
          return (
            <div
              key={idx}
              onClick={() => toggleStandard(std.code)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-start gap-3 ${
                isSelected
                  ? 'border-red-600 bg-red-50/40 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${isSelected ? 'text-red-700' : 'text-gray-800'}`}>
                    {std.code}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{std.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('reference-docs')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Reference Docs
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={() => onNext('exclusions')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Exclusions →
          </button>
        </div>
      </div>
    </div>
  );
}
