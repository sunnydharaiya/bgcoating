import React, { useState, useEffect } from 'react';
import { 
  FolderArchive, 
  Search, 
  Download, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Coins,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRateRegister({ 
  records = [], 
  onLoadRecord, 
  onDuplicateRecord, 
  onDeleteRecord, 
  onOpenPreviewRecord, 
  onOpenPrintRecord,
  onNewEstimation 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Stats calculation
  const totalCount = records.length;
  const draftCount = records.filter(r => (r.status || 'Draft') === 'Draft').length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;

  const totalValue = records.reduce((sum, r) => sum + (parseFloat(r.grandTotal) || 0), 0);

  // Filtered records
  const filtered = records.filter(r => {
    const matchesSearch = 
      (r.estNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.customer || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || (r.status || 'Draft') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (!records.length) return;
    const headers = ['Estimation No', 'Project Name', 'Customer', 'Currency', 'Total Area (m2)', 'Grand Total', 'Cost / m2', 'Status', 'Date'];
    const rows = records.map(r => [
      `"${r.estNo || ''}"`,
      `"${r.projectName || ''}"`,
      `"${r.customer || ''}"`,
      `"${r.currency || 'INR'}"`,
      `"${(r.totalArea || 0).toFixed(1)}"`,
      `"${(r.grandTotal || 0).toFixed(2)}"`,
      `"${(r.costPerM2 || 0).toFixed(2)}"`,
      `"${r.status || 'Draft'}"`,
      `"${r.date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BG_Unit_Rate_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Tiles */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Commercial Unit-Rate Quotation Register</h2>
              <p className="text-xs text-slate-400">Centralized register of tender estimates, unit-rate take-offs, and commercial approvals.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-600"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={onNewEstimation}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Estimation
            </button>
          </div>
        </div>

        {/* 4 KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Quotations</span>
            <span className="text-xl font-bold font-mono text-white">{totalCount}</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Draft Take-offs</span>
            <span className="text-xl font-bold font-mono text-amber-400">{draftCount}</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Approved Tender Estimates</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{approvedCount}</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Combined Value</span>
            <span className="text-xl font-bold font-mono text-purple-400">
              ₹ {totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Est No, project, client..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Draft', 'Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                statusFilter === status
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Register Records Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">Estimation Ref</th>
                <th className="py-3 px-3 min-w-[180px]">Project &amp; Client</th>
                <th className="py-3 px-3 text-right">Area (m²)</th>
                <th className="py-3 px-3 text-right">Unit Rate</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 italic text-xs">
                    No estimation records found. Click <strong className="text-amber-400">New Estimation</strong> to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((record, idx) => {
                  const curr = CURRENCY_CONFIG[record.currency] || CURRENCY_CONFIG.INR;
                  return (
                    <tr key={record.id || idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-center">{idx + 1}</td>
                      
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                        {record.estNo || 'EST-DRAFT'}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white truncate max-w-[220px]">
                          {record.projectName || 'Untitled Project'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          {record.customer || 'No Customer'}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                        {(record.totalArea || 0).toFixed(1)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold">
                        {curr.sym} {(record.costPerM2 || 0).toFixed(2)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-white font-bold">
                        {curr.sym} {(record.grandTotal || 0).toLocaleString(curr.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          record.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {record.status || 'Draft'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onLoadRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                            title="Edit & Load"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPreviewRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPrintRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition"
                            title="Print Quotation"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded transition"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition"
                            title="Delete"
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
