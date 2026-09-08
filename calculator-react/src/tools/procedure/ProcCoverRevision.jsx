import React from 'react';

export default function ProcCoverRevision({ state, onChange, onNext, onReset }) {
  const updateField = (field, val) => {
    onChange({ [field]: val });
  };

  const handleRevChange = (idx, key, val) => {
    const updated = [...(state.revisionHistory || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange({ revisionHistory: updated });
  };

  const addRevRow = () => {
    const nextRev = String(state.revisionHistory?.length || 0);
    const updated = [
      ...(state.revisionHistory || []),
      { rev: nextRev, date: new Date().toISOString().slice(0, 10), desc: 'Revised per Client Comments', prep: state.preparedBy || '', chk: state.reviewedBy || '', app: state.approvedBy || '' }
    ];
    onChange({ revisionHistory: updated });
  };

  const deleteRevRow = (idx) => {
    if ((state.revisionHistory || []).length <= 1) return;
    const updated = (state.revisionHistory || []).filter((_, i) => i !== idx);
    onChange({ revisionHistory: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Section 01</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Procedure Identity & Revision Control</h2>
          <p className="text-xs text-gray-500">Document metadata, customer project identity, quality signatories and revision history tracking.</p>
        </div>
      </div>

      {/* Main Form Cards */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Document Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Document Number *</label>
            <input
              type="text"
              placeholder="e.g. BG-PROC-PIP-001"
              value={state.docNo || ''}
              onChange={(e) => updateField('docNo', e.target.value)}
              className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Current Revision *</label>
            <input
              type="text"
              placeholder="e.g. 0 or Rev-A"
              value={state.revNo || ''}
              onChange={(e) => updateField('revNo', e.target.value)}
              className="w-full text-xs font-mono font-bold text-red-700 px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Painting Procedure & Coating Specification"
              value={state.docTitle || ''}
              onChange={(e) => updateField('docTitle', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Project Name *</label>
            <input
              type="text"
              placeholder="e.g. Hydrocarbon Refinery Expansion Phase-II"
              value={state.projectName || ''}
              onChange={(e) => updateField('projectName', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Client / Owner Name *</label>
            <input
              type="text"
              placeholder="e.g. National Petroleum Corp."
              value={state.clientName || ''}
              onChange={(e) => updateField('clientName', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Contractor / Applicator</label>
            <input
              type="text"
              placeholder="e.g. BG Engineering Solutions Pvt Ltd"
              value={state.contractorName || ''}
              onChange={(e) => updateField('contractorName', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Quality Signatories */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100">
          Document Verification & Signatories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Prepared By (QA/QC Engineer)</label>
            <input
              type="text"
              placeholder="e.g. John Doe (NACE/AMPP Level 2)"
              value={state.preparedBy || ''}
              onChange={(e) => updateField('preparedBy', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Reviewed / Checked By (QC Lead)</label>
            <input
              type="text"
              placeholder="e.g. Robert Smith (NACE/AMPP Level 3)"
              value={state.reviewedBy || ''}
              onChange={(e) => updateField('reviewedBy', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Approved By (Project Manager / Client)</label>
            <input
              type="text"
              placeholder="e.g. David Williams"
              value={state.approvedBy || ''}
              onChange={(e) => updateField('approvedBy', e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Revision History Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Revision Control History
          </h3>
          <button
            type="button"
            onClick={addRevRow}
            className="text-xs text-red-700 hover:text-red-800 font-semibold flex items-center gap-1"
          >
            + Add Revision Record
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-2 px-3 text-left w-16">Rev</th>
                <th className="py-2 px-3 text-left w-28">Date</th>
                <th className="py-2 px-3 text-left">Description of Revision</th>
                <th className="py-2 px-3 text-left w-28">Prepared</th>
                <th className="py-2 px-3 text-left w-28">Checked</th>
                <th className="py-2 px-3 text-left w-28">Approved</th>
                <th className="py-2 px-2 text-center w-10">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(state.revisionHistory || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.rev || ''}
                      onChange={(e) => handleRevChange(idx, 'rev', e.target.value)}
                      className="w-full font-mono font-bold text-center border border-gray-300 rounded px-1.5 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={row.date || ''}
                      onChange={(e) => handleRevChange(idx, 'date', e.target.value)}
                      className="w-full border border-gray-300 rounded px-1.5 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.desc || ''}
                      onChange={(e) => handleRevChange(idx, 'desc', e.target.value)}
                      placeholder="e.g. Issued for Approval"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.prep || ''}
                      onChange={(e) => handleRevChange(idx, 'prep', e.target.value)}
                      className="w-full border border-gray-300 rounded px-1.5 py-1 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.chk || ''}
                      onChange={(e) => handleRevChange(idx, 'chk', e.target.value)}
                      className="w-full border border-gray-300 rounded px-1.5 py-1 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.app || ''}
                      onChange={(e) => handleRevChange(idx, 'app', e.target.value)}
                      className="w-full border border-gray-300 rounded px-1.5 py-1 text-center"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRevRow(idx)}
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
          onClick={onReset}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          ↺ Reset Section
        </button>
        <button
          type="button"
          onClick={() => onNext('scope')}
          className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
        >
          Save & Next: Scope of Work →
        </button>
      </div>
    </div>
  );
}
