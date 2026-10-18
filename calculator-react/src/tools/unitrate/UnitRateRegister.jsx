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
      <div className="bg-white p-5 rounded-2xl border border-[#E6E8EC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Commercial Unit-Rate Quotation Register</h2>
              <p className="text-xs text-slate-500">Centralized register of tender estimates, unit-rate take-offs, and commercial approvals.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={onNewEstimation}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Estimation
            </button>
          </div>
        </div>

        {/* 4 KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total Quotations</span>
            <span className="text-xl font-bold font-mono text-slate-800">{totalCount}</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Draft Take-offs</span>
            <span className="text-xl font-bold font-mono text-amber-600">{draftCount}</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Approved Tender Estimates</span>
            <span className="text-xl font-bold font-mono text-emerald-600">{approvedCount}</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Combined Value</span>
            <span className="text-xl font-bold font-mono text-indigo-600">
              ₹ {totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E8EC] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Est No, project, client..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#CBD5E1] focus:border-orange-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Draft', 'Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                statusFilter === status
                  ? 'bg-orange-500 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Register Records Table */}
      <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-500 font-bold text-[10px] uppercase border-b border-[#E2E8F0]">
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
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 italic text-xs">
                    No estimation records found. Click <strong className="text-orange-600">New Estimation</strong> to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((record, idx) => {
                  const curr = CURRENCY_CONFIG[record.currency] || CURRENCY_CONFIG.INR;
                  return (
                    <tr key={record.id || idx} className="hover:bg-orange-50/30 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-center">{idx + 1}</td>
                      
                      <td className="py-2.5 px-3 font-mono font-bold text-orange-600">
                        {record.estNo || 'EST-DRAFT'}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 truncate max-w-[220px]">
                          {record.projectName || 'Untitled Project'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                          {record.customer || 'No Customer'}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {(record.totalArea || 0).toFixed(1)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-semibold">
                        {curr.sym} {(record.costPerM2 || 0).toFixed(2)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 font-bold">
                        {curr.sym} {(record.grandTotal || 0).toLocaleString(curr.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          record.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {record.status || 'Draft'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onLoadRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-slate-100 rounded transition"
                            title="Edit & Load"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPreviewRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPrintRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded transition"
                            title="Print Quotation"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded transition"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition"
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
