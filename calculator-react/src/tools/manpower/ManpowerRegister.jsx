import React, { useState, useMemo } from 'react';
import {
  HardHat,
  Search,
  Download,
  Plus,
  Printer,
  Edit,
  Eye,
  Copy,
  Trash2,
  FilterX,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Coins
} from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/manpowerDatabase';

export default function ManpowerRegister({
  reports = [],
  onLoadReport,
  onPrintReport,
  onPreviewReport,
  onCopyReport,
  onDeleteReport,
  onNewEstimation
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estNo: '',
    proj: '',
    cust: '',
    area: '',
    grand: '',
    pm2: '',
    status: '',
    saved: ''
  });

  const handleFilterChange = (col, val) => {
    setFilters(prev => ({ ...prev, [col]: val.toLowerCase() }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      estNo: '',
      proj: '',
      cust: '',
      area: '',
      grand: '',
      pm2: '',
      status: '',
      saved: ''
    });
  };

  // KPIs
  const totalCount = reports.length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const draftCount = reports.filter(r => r.status !== 'Approved').length;
  const combinedValue = reports.reduce((sum, r) => sum + (r.grand || 0), 0);

  // Filtered List
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const q = searchTerm.trim().toLowerCase();
      if (q) {
        const hay = [
          r.estNo,
          r.proj,
          r.cust,
          r.area,
          r.grand,
          r.pm2,
          r.status,
          r.savedAt
        ].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (filters.estNo && !(r.estNo || '').toLowerCase().includes(filters.estNo)) return false;
      if (filters.proj && !(r.proj || '').toLowerCase().includes(filters.proj)) return false;
      if (filters.cust && !(r.cust || '').toLowerCase().includes(filters.cust)) return false;
      if (filters.area && !String(r.area || '').includes(filters.area)) return false;
      if (filters.grand && !String(r.grand || '').includes(filters.grand)) return false;
      if (filters.pm2 && !String(r.pm2 || '').includes(filters.pm2)) return false;
      if (filters.status && !(r.status || '').toLowerCase().includes(filters.status)) return false;
      if (filters.saved && !(r.savedAt || '').toLowerCase().includes(filters.saved)) return false;

      return true;
    });
  }, [reports, searchTerm, filters]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredReports.length) return;
    const headers = ['Sr', 'Estimation No', 'Project Name', 'Customer', 'Area (m2)', 'Grand Total', 'Cost per m2', 'Status', 'Date Saved'];
    const rows = filteredReports.map((r, i) => [
      i + 1,
      `"${r.estNo || ''}"`,
      `"${r.proj || ''}"`,
      `"${r.cust || ''}"`,
      r.area || 0,
      r.grand || 0,
      (r.pm2 || 0).toFixed(2),
      r.status || 'Draft',
      `"${r.savedAt ? new Date(r.savedAt).toLocaleString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Manpower_Estimation_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E8700A]">
            <span>Module 08 · Enterprise Register</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Estimation Report Register &amp; Database Archive
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical project quotations, status revision tracking, one-click spreadsheet export, and duplicate template workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewEstimation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#F5911F] to-[#E8700A] hover:brightness-110 text-white text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Estimation</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">Total Saved</span>
          <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
            {totalCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Quotations in archive</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Approved</span>
          <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {approvedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Commercial approvals</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Drafts</span>
          <div className="text-xl font-mono font-black text-amber-600 dark:text-amber-400 mt-1">
            {draftCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Work-in-progress</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Combined Value</span>
          <div className="text-xl font-mono font-black text-blue-600 dark:text-blue-400 mt-1 truncate">
            ₹ {Number(combinedValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pipeline quotation total</div>
        </div>
      </div>

      {/* Register Table with Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        
        {/* Search Bar & Clear Filter */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project, client, est no..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-bold">
                <th className="py-2.5 px-2 text-center w-10">Sr.</th>
                <th className="py-2.5 px-3">Est No.</th>
                <th className="py-2.5 px-3">Project Name</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3 text-right">Area (m²)</th>
                <th className="py-2.5 px-3 text-right">Grand Total</th>
                <th className="py-2.5 px-3 text-right">Cost / m²</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Date Saved</th>
                <th className="py-2.5 px-2 text-center" title="Print">🖨</th>
                <th className="py-2.5 px-2 text-center" title="Edit">✎</th>
                <th className="py-2.5 px-2 text-center" title="Preview">👁</th>
                <th className="py-2.5 px-2 text-center" title="Copy">⧉</th>
                <th className="py-2.5 px-2 text-center" title="Delete">✕</th>
              </tr>

              {/* Column Filter Row */}
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30">
                <th className="p-1"></th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.estNo}
                    onChange={(e) => handleFilterChange('estNo', e.target.value)}
                    placeholder="Filter…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.proj}
                    onChange={(e) => handleFilterChange('proj', e.target.value)}
                    placeholder="Filter…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.cust}
                    onChange={(e) => handleFilterChange('cust', e.target.value)}
                    placeholder="Filter…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    placeholder="Area…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] text-right"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.grand}
                    onChange={(e) => handleFilterChange('grand', e.target.value)}
                    placeholder="Total…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] text-right"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.pm2}
                    onChange={(e) => handleFilterChange('pm2', e.target.value)}
                    placeholder="/m²…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] text-right"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    placeholder="Status…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] text-center"
                  />
                </th>
                <th className="p-1">
                  <input
                    type="text"
                    value={filters.saved}
                    onChange={(e) => handleFilterChange('saved', e.target.value)}
                    placeholder="Date…"
                    className="w-full px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]"
                  />
                </th>
                <th colSpan={5} className="p-1"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-10 text-center text-slate-400 text-xs italic">
                    {reports.length === 0
                      ? 'No saved estimations yet. Fill out the estimation sheets and click "Save Draft" or "Validate & Approve".'
                      : 'No records match your active search filters.'}
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, idx) => {
                  const curConf = CURRENCY_CONFIG[r.currency] || CURRENCY_CONFIG.INR;
                  const isApproved = r.status === 'Approved';

                  return (
                    <tr key={r.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-2 text-center font-bold text-[#E8700A]">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{r.estNo || '—'}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{r.proj || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.cust || '—'}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{Number(r.area || 0).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-orange-600 dark:text-orange-400">
                        {curConf.sym} {Number(r.grand || 0).toLocaleString(curConf.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {curConf.sym} {Number(r.pm2 || 0).toLocaleString(curConf.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {isApproved ? '✓ Approved' : '✎ Draft'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[10px]">
                        {r.savedAt ? new Date(r.savedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => onPrintReport(r)}
                          className="p-1 rounded text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                          title="Print Dossier"
                        >
                          🖨
                        </button>
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => onLoadReport(r)}
                          className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                          title="Edit / Load"
                        >
                          ✎
                        </button>
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => onPreviewReport(r)}
                          className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                          title="Preview Dossier"
                        >
                          👁
                        </button>
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => onCopyReport(r)}
                          className="p-1 rounded text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition cursor-pointer"
                          title="Duplicate Copy"
                        >
                          ⧉
                        </button>
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button
                          onClick={() => onDeleteReport(r.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete"
                        >
                          ✕
                        </button>
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
