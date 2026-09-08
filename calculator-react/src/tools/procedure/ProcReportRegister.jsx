import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'bg_os_procedure_records';

export default function ProcReportRegister({ onLoadRecord, onNewProcedure }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRecords(saved);
    } catch (e) {
      setRecords([]);
    }
  }, []);

  const saveRecords = (newRecords) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
    } catch (e) {}
  };

  const deleteRecord = (id) => {
    if (!window.confirm('Delete this procedure record from register?')) return;
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  const duplicateRecord = (rec) => {
    const copy = {
      ...rec,
      id: Date.now().toString(),
      docNo: `${rec.docNo}-COPY`,
      createdAt: new Date().toISOString()
    };
    saveRecords([copy, ...records]);
  };

  const exportCSV = () => {
    if (!records.length) {
      alert('No records to export');
      return;
    }
    const headers = ['Doc No', 'Rev', 'Project', 'Client', 'Status', 'Date', 'Total DFT'];
    const rows = records.map((r) => [
      `"${r.docNo || ''}"`,
      `"${r.revNo || ''}"`,
      `"${r.projectName || ''}"`,
      `"${r.clientName || ''}"`,
      `"${r.status || 'Draft'}"`,
      `"${r.createdAt?.slice(0, 10) || ''}"`,
      `"${r.coatingSystems?.[0]?.totalDftNom || ''}"`
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Coating_Procedure_Register_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = records.filter((r) => {
    const matchesSearch =
      (r.docNo || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.clientName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (r.status || 'Draft') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = records.length;
  const draftCount = records.filter((r) => (r.status || 'Draft') === 'Draft').length;
  const approvedCount = records.filter((r) => r.status === 'Approved').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-l-4 border-red-700 rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">Register</span>
          <h2 className="text-base font-bold text-gray-900 mt-1">Procedure Document Register</h2>
          <p className="text-xs text-gray-500">Centralized log of generated Coating Specifications, Revision history, Status and CSV export.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="text-xs text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 font-semibold px-3 py-1.5 rounded transition flex items-center gap-1"
          >
            📥 Export CSV
          </button>
          <button
            type="button"
            onClick={onNewProcedure}
            className="text-xs text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 font-bold px-3.5 py-1.5 rounded shadow transition"
          >
            + New Procedure
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-base">
            📁
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Total Procedures</span>
            <div className="text-lg font-bold text-gray-900">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-base">
            📝
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Draft Procedures</span>
            <div className="text-lg font-bold text-amber-600">{draftCount}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 font-bold flex items-center justify-center text-base">
            ✅
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Approved Procedures</span>
            <div className="text-lg font-bold text-green-700">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by Document Number, Project or Client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs p-2 border border-gray-300 rounded-lg w-full md:w-80 focus:border-red-600 focus:outline-none"
        />

        <div className="flex gap-1.5">
          {['ALL', 'Draft', 'Approved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === st
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Register Records Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#1E2530] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Document Number</th>
                <th className="py-3 px-3 text-center w-16">Rev</th>
                <th className="py-3 px-4 text-left">Project Name</th>
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-3 text-center w-24">Status</th>
                <th className="py-3 px-4 text-left w-32">Date</th>
                <th className="py-3 px-4 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No procedure records found in register.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-red-700">
                      {rec.docNo || 'UNTITLED-DOC'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-700">
                      {rec.revNo || '0'}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {rec.projectName || '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {rec.clientName || '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          rec.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {rec.createdAt?.slice(0, 10) || '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onLoadRecord(rec)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded transition"
                      >
                        Load / Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateRecord(rec)}
                        className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord(rec.id)}
                        className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
