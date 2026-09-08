import React, { useState } from 'react';
import {
  HardHat,
  Search,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Copy,
  Edit,
  Printer,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function BlasterRegister({
  reports = [],
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onNewReport,
  onOpenPreview
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.repNo || '').toLowerCase().includes(term) ||
      (r.operatorName || '').toLowerCase().includes(term) ||
      (r.projectName || '').toLowerCase().includes(term) ||
      (r.client || '').toLowerCase().includes(term) ||
      (r.category || '').toLowerCase().includes(term);

    if (statusFilter === 'approved') return matchesSearch && r.status === 'Approved';
    if (statusFilter === 'draft') return matchesSearch && r.status === 'Draft';
    if (statusFilter === 'pass') return matchesSearch && r.verdict === 'PASS';
    if (statusFilter === 'fail') return matchesSearch && r.verdict === 'FAIL';
    return matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'Report No',
      'Date',
      'Operator Name',
      'Category',
      'Civil ID',
      'Project',
      'Client',
      'Pre-Test %',
      'Post-Test %',
      'Checklist %',
      'Inspection %',
      'Overall %',
      'Verdict',
      'Status'
    ];

    const rows = filteredReports.map((r) => [
      r.repNo || '',
      r.repDate || '',
      r.operatorName || '',
      r.category || '',
      r.civilId || '',
      r.projectName || '',
      r.client || '',
      r.prePct ? `${r.prePct.toFixed(0)}%` : '',
      r.postPct ? `${r.postPct.toFixed(0)}%` : '',
      r.chkPct ? `${r.chkPct.toFixed(0)}%` : '',
      r.inspPct ? `${r.inspPct.toFixed(0)}%` : '',
      r.overallScore ? `${r.overallScore.toFixed(1)}%` : '',
      r.verdict || '',
      r.status || 'Draft'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Blaster_Qualification_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 08 · Step 8 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Qualification Reports Master Register
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Historical database of qualification assessments · Multi-column filtering · CSV &amp; Excel export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Qualification</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search operator, project, report #..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Records', count: reports.length },
            { id: 'approved', label: 'Approved', count: reports.filter(r => r.status === 'Approved').length },
            { id: 'draft', label: 'Drafts', count: reports.filter(r => r.status === 'Draft').length },
            { id: 'pass', label: 'Passed', count: reports.filter(r => r.verdict === 'PASS').length },
            { id: 'fail', label: 'Failed', count: reports.filter(r => r.verdict === 'FAIL').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#E8700A] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1 rounded-full ${
                statusFilter === tab.id ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 text-center w-10">#</th>
                <th className="py-3 px-3">Report No.</th>
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3 text-center">Verdict</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                    No qualification reports match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep, idx) => (
                  <tr key={rep.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#E8700A]">
                      {rep.repNo || 'Draft'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {rep.operatorName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {rep.category || 'Blaster'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                      {rep.projectName}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {rep.overallScore ? `${rep.overallScore.toFixed(0)}%` : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        rep.verdict === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : rep.verdict === 'FAIL'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {rep.verdict || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {rep.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onLoadReport(rep)}
                          className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-[#E8700A] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Load / Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateReport(rep)}
                          className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { onLoadReport(rep); onOpenPreview(); }}
                          className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Print / View"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(rep.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
