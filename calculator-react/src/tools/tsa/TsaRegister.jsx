import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Download, 
  Plus, 
  Eye, 
  Printer, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { validateStageSequence } from '../../data/tsaDatabase';

export default function TsaRegister({
  reports = [],
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onPrintReport,
  onExportCSV,
  onNewReport
}) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('savedAt');
  const [sortDir, setSortDir] = useState('desc');

  // Stats
  const total = reports.length;
  const approved = reports.filter(r => r.status === 'Approved').length;
  const drafts = reports.filter(r => r.status === 'Draft').length;
  const passCount = reports.filter(r => r.verdict === 'PASS').length;
  const failCount = reports.filter(r => r.verdict === 'FAIL').length;

  // Filtered and searched reports
  let filtered = reports.filter(r => {
    if (filter === 'Approved') return r.status === 'Approved';
    if (filter === 'Draft') return r.status === 'Draft';
    if (filter === 'PASS') return r.verdict === 'PASS';
    if (filter === 'FAIL') return r.verdict === 'FAIL';
    return true;
  });

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => 
      (r.repNo || '').toLowerCase().includes(q) ||
      (r.name || '').toLowerCase().includes(q) ||
      (r.civil || '').toLowerCase().includes(q) ||
      (r.proj || '').toLowerCase().includes(q) ||
      (r.client || '').toLowerCase().includes(q) ||
      (r.contractor || '').toLowerCase().includes(q)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'savedAt' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#E87B1E]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              TSA Operator Qualification Master Register
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 10 · Centralized database of all generated, verified, and approved qualification dossiers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onNewReport}
            className="px-3.5 py-1.5 rounded-xl bg-[#E87B1E] text-white font-bold text-xs shadow-xs hover:bg-[#9E1B1E] transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Qualification</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Reports</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1 block">{total}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved</span>
          <span className="text-xl font-extrabold text-emerald-600 font-mono mt-1 block">{approved}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drafts</span>
          <span className="text-xl font-extrabold text-amber-600 font-mono mt-1 block">{drafts}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passed (≥80%)</span>
          <span className="text-xl font-extrabold text-blue-600 font-mono mt-1 block">{passCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Failed / Retest</span>
          <span className="text-xl font-extrabold text-rose-600 font-mono mt-1 block">{failCount}</span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Approved', 'Draft', 'PASS', 'FAIL'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === f
                  ? 'bg-[#E87B1E] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {f === 'all' ? 'All Records' : f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report #, operator, project..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#E87B1E]"
          />
        </div>
      </div>

      {/* Master Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FolderOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <span>No matching qualification records found in register.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 text-center w-10">#</th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort('repNo')}>
                    <div className="flex items-center gap-1">
                      <span>Report No</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Operator Details</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3">Project & Client</th>
                  <th className="p-3 text-center">Stage Sequence</th>
                  <th className="p-3 text-center cursor-pointer" onClick={() => handleSort('overall')}>
                    <div className="flex items-center justify-center gap-1">
                      <span>Verdict / Score</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Prepared By</th>
                  <th className="p-3 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((r, i) => {
                  const seq = validateStageSequence(r.projNo, reports);
                  return (
                    <tr key={r.id || i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                      <td className="p-3 font-mono font-bold text-[#E87B1E]">
                        {r.repNo || '—'}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{r.name}</div>
                        <div className="text-[10px] text-slate-400">Civil: {r.civil || '—'}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">{r.proj || '—'}</div>
                        <div className="text-[10px] text-slate-400">{r.client || r.contractor || '—'}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block font-mono text-[11px] font-bold ${
                          seq.empty ? 'text-slate-400' : seq.ok ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {seq.empty ? '—' : `${seq.ok ? '✓' : '✗'} ${seq.text}`}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          r.verdict === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : r.verdict === 'FAIL'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {r.verdict || 'PENDING'}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {r.overall ? `${r.overall.toFixed(1)}%` : '—'}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'Approved'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {r.status || 'Draft'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 text-xs">
                        {(r.preparedBy || '—').split('/')[0].trim()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onPrintReport?.(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#E87B1E] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Preview / Print A4 Dossier"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onLoadReport?.(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Load Report into Editor"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateReport?.(r)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Duplicate as New Draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteReport?.(r.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
