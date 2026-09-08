import React, { useState } from 'react';
import { PROC_REF_DOCS_LIB } from '../../data/procedureDatabase';

export default function ProcRefDocs({ state, onChange, onNext, onPrev, onReset }) {
  const [selectedLibraryDoc, setSelectedLibraryDoc] = useState('');

  const handleDocChange = (idx, key, val) => {
    const updated = [...(state.refDocs || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange({ refDocs: updated });
  };

  const addQuickDoc = (title) => {
    if (!title) return;
    const nextId = (state.refDocs?.length || 0) + 1;
    const updated = [
      ...(state.refDocs || []),
      { id: nextId, title, docNo: '', rev: '0', source: 'Project' }
    ];
    onChange({ refDocs: updated });
    setSelectedLibraryDoc('');
  };

  const addCustomDoc = () => {
    const nextId = (state.refDocs?.length || 0) + 1;
    const updated = [
      ...(state.refDocs || []),
      { id: nextId, title: '', docNo: '', rev: '0', source: 'Project' }
    ];
    onChange({ refDocs: updated });
  };

  const deleteDoc = (idx) => {
    const updated = (state.refDocs || []).filter((_, i) => i !== idx);
    onChange({ refDocs: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 03</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Project Reference Documents</h2>
          <p className="text-xs text-gray-500">Contractual painting specifications, engineering data sheets, client ITPs, and vendor documents.</p>
        </div>
      </div>

      {/* Quick Add Library Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-amber-50/40 border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">⚡ Quick Add From Library:</span>
          <select
            value={selectedLibraryDoc}
            onChange={(e) => {
              setSelectedLibraryDoc(e.target.value);
              addQuickDoc(e.target.value);
            }}
            className="text-xs border border-gray-300 rounded-lg p-2 bg-white flex-1 md:w-80 focus:border-red-600 focus:outline-none"
          >
            <option value="">-- Select standard reference document to insert --</option>
            {PROC_REF_DOCS_LIB.map((doc, i) => (
              <option key={i} value={doc}>{doc}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={addCustomDoc}
          className="text-xs font-bold text-red-700 hover:text-red-800 bg-red-100/60 hover:bg-red-100 px-3 py-2 rounded-lg transition"
        >
          + Add Custom Document
        </button>
      </div>

      {/* Reference Documents Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Document Schedule Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2.5 px-3 text-left w-12">#</th>
                <th className="py-2.5 px-3 text-left">Document Title / Description *</th>
                <th className="py-2.5 px-3 text-left w-48">Document No.</th>
                <th className="py-2.5 px-3 text-left w-20">Rev</th>
                <th className="py-2.5 px-3 text-left w-36">Issuing Source</th>
                <th className="py-2.5 px-2 text-center w-12">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(state.refDocs || []).map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={doc.title || ''}
                      onChange={(e) => handleDocChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Project Coating Specification"
                      className="w-full border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={doc.docNo || ''}
                      onChange={(e) => handleDocChange(idx, 'docNo', e.target.value)}
                      placeholder="e.g. SPEC-CORR-001"
                      className="w-full font-mono border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={doc.rev || ''}
                      onChange={(e) => handleDocChange(idx, 'rev', e.target.value)}
                      className="w-full text-center border border-gray-300 rounded px-1 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={doc.source || ''}
                      onChange={(e) => handleDocChange(idx, 'source', e.target.value)}
                      placeholder="e.g. Client / EPC / TDS"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteDoc(idx)}
                      className="text-gray-400 hover:text-red-600 font-bold"
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Action Footer Toolbar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onPrev('scope')}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ← Previous: Scope
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
            onClick={() => onNext('standards')}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
          >
            Save & Next: Reference Standards →
          </button>
        </div>
      </div>
    </div>
  );
}
