// src/tools/painter/PainterRegister.jsx
import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Printer, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Layers,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { validateStageSequence } from '../../data/painterDatabase';

export default function PainterRegister({
  reports = [],
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onPrintReport,
  onExportCSV
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('savedAt');
  const [sortDir, setSortDir] = useState('desc');

  // Filter logic
  let filtered = reports.filter((r) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Draft' && r.status === 'Draft') ||
      (statusFilter === 'Approved' && r.status === 'Approved') ||
      (statusFilter === 'PASS' && r.verdict === 'PASS') ||
      (statusFilter === 'FAIL' && r.verdict === 'FAIL');

    if (!matchesStatus) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.repNo || '').toLowerCase().includes(term) ||
      (r.name || '').toLowerCase().includes(term) ||
      (r.civil || '').toLowerCase().includes(term) ||
      (r.proj || '').toLowerCase().includes(term) ||
      (r.projNo || '').toLowerCase().includes(term) ||
      (r.client || '').toLowerCase().includes(term) ||
      (r.contractor || '').toLowerCase().includes(term)
    );
  });

  // Sort logic
  filtered.sort((a, b) => {
    const valA = a[sortKey] || '';
    const valB = b[sortKey] || '';
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const total = reports.length;
  const draftCount = reports.filter(r => r.status === 'Draft').length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const passCount = reports.filter(r => r.verdict === 'PASS').length;
  const failCount = reports.filter(r => r.verdict === 'FAIL').length;

  return (
    <div className="space-y-6">
      
      {/* Master Register Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#E87B1E]" />
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Section 11: Master Qualification Reports Register
            </h2>
            <p className="text-xs text-slate-500">
              Audit trail, stage sequence validation, report duplication, and Excel/CSV data export
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'ALL', label: `All (${total})` },
              { id: 'Draft', label: `Drafts (${draftCount})` },
              { id: 'Approved', label: `Approved (${approvedCount})` },
              { id: 'PASS', label: `Passed (${passCount})` },
              { id: 'FAIL', label: `Failed (${failCount})` }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  statusFilter === chip.id
                    ? 'bg-[#E87B1E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports, operators, IDs..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E87B1E] outline-none"
            />
          </div>

        </div>

        {/* Master Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white font-rajdhani uppercase text-[11px] tracking-wider">
                <th className="p-2.5 text-center w-10">#</th>
                <th className="p-2.5 cursor-pointer hover:bg-slate-700/50" onClick={() => handleSort('repNo')}>
                  <div className="flex items-center gap-1">
                    <span>Report No.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-2.5 cursor-pointer hover:bg-slate-700/50" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Operator &amp; Civil ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-2.5">Project / Client</th>
                <th className="p-2.5 text-center">Stage Sequence</th>
                <th className="p-2.5 text-center">Verdict</th>
                <th className="p-2.5 text-center">Overall</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5">Inspector</th>
                <th className="p-2.5 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-400 italic">
                    No qualification records found matching the active filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const seq = validateStageSequence(r.projNo || '', reports);
                  const isPass = r.verdict === 'PASS';
                  const isFail = r.verdict === 'FAIL';

                  return (
                    <tr key={r.id || idx} className="hover:bg-amber-50/30 transition">
                      <td className="p-2.5 text-center font-mono font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-[#9E1B1E]">
                        {r.repNo || '—'}
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-800">{r.name || '—'}</div>
                        <div className="text-[10px] font-mono text-slate-400">ID: {r.civil || '—'}</div>
                      </td>
                      <td className="p-2.5 max-w-[180px] truncate">
                        <div className="font-medium text-slate-800 truncate">{r.proj || '—'}</div>
                        <div className="text-[10px] text-slate-400 truncate">{r.client || r.contractor || '—'}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          seq.empty ? 'bg-slate-100 text-slate-400' :
                          seq.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {seq.text}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800'
                              : isFail
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.verdict || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-800">
                        {r.overall ? `${r.overall.toFixed(1)}%` : '—'}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded ${
                            r.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {r.status || 'Draft'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600 truncate max-w-[120px]">
                        {(r.preparedBy || '—').split('/')[0].trim()}
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onLoadReport(r)}
                            className="p-1 text-slate-600 hover:text-[#E87B1E] hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Load / Edit Report"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateReport(r)}
                            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Duplicate as New Draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrintReport(r)}
                            className="p-1 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Print Technical Dossier"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteReport(r.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
