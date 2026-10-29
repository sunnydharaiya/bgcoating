import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Download,
  Printer,
  Edit,
  Eye,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Sparkles
} from 'lucide-react';

export default function ManpowerRegister({
  reports = [],
  onLoadReport,
  onPrintReport,
  onPreviewReport,
  onCopyReport,
  onDeleteReport,
  onNewEstimation,
  onSaveActiveEstimation,
  onLoadSampleRecord
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

  const [openA, setOpenA] = useState(true);

  const handleFilterChange = (col, val) => {
    setFilters(prev => ({ ...prev, [col]: val.toLowerCase() }));
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

  const formatCur = (v) => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const formatNum = (v, d = 0) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="space-y-4">
      
      {/* MODULE 8 BANNER (Matches 6.png) */}
      <div className="bg-gradient-to-r from-[#C23A1B] via-[#B83216] to-[#A82B12] text-white p-4 rounded-xl shadow-md border border-[#D94F26]/60">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
          MODULE 8 · RECORDS
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
          Estimation Report — Saved Records
        </h2>
        <p className="text-xs text-rose-100/90 mt-1">
          All saved estimations are stored locally with a full data snapshot — for history tracking and future Dashboard analytics. Use Save to Report on the Front Page Summary to add the current estimation here.
        </p>
      </div>

      {/* SECTION: Saved Estimations */}
      <div className="rounded-xl overflow-hidden border border-[#F5C296] shadow-2xs">
        <button
          type="button"
          onClick={() => setOpenA(!openA)}
          className="w-full bg-[#FFEAD5] hover:bg-[#FFE3C8] transition px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E8700A]/15 text-[#D94F26]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#351907]">
                Saved Estimations
              </div>
              <div className="text-[11px] text-[#7A5B46]">
                History &amp; records
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#4A170B] text-white border border-[#300E06]">
              TOTAL RECORDS {totalCount}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EA580C] text-white border border-orange-600">
              DRAFTS {draftCount}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#16A34A] text-white border border-green-600">
              APPROVED {approvedCount}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0284C7] text-white border border-blue-600">
              COMBINED VALUE ₹{formatCur(combinedValue)}
            </span>
            {openA ? (
              <ChevronUp className="w-4 h-4 text-orange-800 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-orange-800 ml-1" />
            )}
          </div>
        </button>

        {openA && (
          <div className="bg-[#FFFDFB] p-4 sm:p-5 space-y-4">
            
            {/* Primary Action Callout Box */}
            <div className="p-3.5 rounded-xl border border-orange-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="text-xs font-bold font-mono text-[#A82B12] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-[#E8700A]" />
                  <span>REPORT REGISTER — PRIMARY ACTIONS</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Start a new estimation, or export the full register to Excel/CSV. Use the table below to search, filter, edit, view, print, copy or delete records.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onSaveActiveEstimation && (
                  <button
                    type="button"
                    onClick={onSaveActiveEstimation}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer uppercase font-mono"
                    title="Save active estimation into register"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE ACTIVE ESTIMATION</span>
                  </button>
                )}

                {onLoadSampleRecord && (
                  <button
                    type="button"
                    onClick={onLoadSampleRecord}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer uppercase font-mono"
                    title="Load standard 20,000 m² refinery manpower estimation sample"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SAMPLE REFINERY RECORD</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onNewEstimation}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E85D22] to-[#CB3A14] hover:brightness-110 text-white text-xs font-black tracking-wider flex items-center gap-1.5 transition shadow-sm cursor-pointer uppercase font-mono"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ NEW GENERATION</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer uppercase font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT EXCEL</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Estimation No, Project, Customer, Status, Date, Prepared By..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-orange-200/90 bg-white text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5911F] transition shadow-2xs"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-orange-200 shadow-2xs bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FFEAD5] text-[#5A240A] text-[10px] font-mono font-bold uppercase tracking-wider border-b border-orange-200">
                  <tr>
                    <th className="py-2 px-2 text-center">SR.</th>
                    <th className="py-2 px-2.5">ESTIMATION NO.</th>
                    <th className="py-2 px-2.5">PROJECT</th>
                    <th className="py-2 px-2.5">CUSTOMER</th>
                    <th className="py-2 px-2 text-right">AREA (M²)</th>
                    <th className="py-2 px-2 text-right">GRAND TOTAL</th>
                    <th className="py-2 px-2 text-right">PER M²</th>
                    <th className="py-2 px-2 text-center">STATUS</th>
                    <th className="py-2 px-2 text-center">SAVED ON</th>
                    <th className="py-2 px-1.5 text-center">PRINT</th>
                    <th className="py-2 px-1.5 text-center">EDIT</th>
                    <th className="py-2 px-1.5 text-center">VIEW</th>
                    <th className="py-2 px-1.5 text-center">COPY</th>
                    <th className="py-2 px-1.5 text-center">DELETE</th>
                  </tr>
                  
                  {/* Filter Inputs Row */}
                  <tr className="bg-[#FFF8F2] border-b border-orange-100 font-normal">
                    <th className="p-1"></th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.estNo}
                        onChange={(e) => handleFilterChange('estNo', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.proj}
                        onChange={(e) => handleFilterChange('proj', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters.cust}
                        onChange={(e) => handleFilterChange('cust', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Area..."
                        value={filters.area}
                        onChange={(e) => handleFilterChange('area', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white text-right"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Total..."
                        value={filters.grand}
                        onChange={(e) => handleFilterChange('grand', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white text-right"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="/m²..."
                        value={filters.pm2}
                        onChange={(e) => handleFilterChange('pm2', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white text-right"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Status..."
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white text-center"
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        placeholder="Date..."
                        value={filters.saved}
                        onChange={(e) => handleFilterChange('saved', e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[10px] rounded border border-orange-200 bg-white text-center"
                      />
                    </th>
                    <th colSpan={5} className="p-1"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 font-medium text-slate-800">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center text-xs text-slate-500 italic">
                        <div className="max-w-md mx-auto space-y-3">
                          <p className="font-semibold text-slate-600">No saved estimations found in database register.</p>
                          <div className="flex items-center justify-center gap-3">
                            {onLoadSampleRecord && (
                              <button
                                type="button"
                                onClick={onLoadSampleRecord}
                                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer font-mono"
                              >
                                💡 Load 20,000 m² Sample Refinery Record
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={onNewEstimation}
                              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-sm cursor-pointer font-mono"
                            >
                              + Start New Estimation
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((rec, idx) => (
                      <tr key={rec.id || idx} className="hover:bg-orange-50/50">
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2.5 font-mono font-semibold text-slate-900">
                          {rec.estNo}
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-slate-900 truncate max-w-[140px]">
                          {rec.proj}
                        </td>
                        <td className="py-2 px-2.5 text-slate-700 truncate max-w-[120px]">
                          {rec.cust}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-[#0066CC]">
                          {formatNum(rec.area, 0)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-black text-[#C23A1B]">
                          ₹{formatCur(rec.grand)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-semibold text-slate-700">
                          ₹{formatCur(rec.pm2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            rec.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {rec.status || 'Draft'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center text-[10px] font-mono text-slate-500">
                          {rec.savedAt ? new Date(rec.savedAt).toLocaleDateString() : '—'}
                        </td>
                        
                        {/* Action Buttons */}
                        <td className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => onPrintReport(rec)}
                            title="Print"
                            className="p-1 rounded hover:bg-orange-100 text-slate-600 hover:text-[#C23A1B] transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => onLoadReport(rec)}
                            title="Edit"
                            className="p-1 rounded hover:bg-orange-100 text-slate-600 hover:text-[#C23A1B] transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => onPreviewReport(rec)}
                            title="View"
                            className="p-1 rounded hover:bg-orange-100 text-slate-600 hover:text-[#C23A1B] transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => onCopyReport(rec)}
                            title="Copy"
                            className="p-1 rounded hover:bg-orange-100 text-slate-600 hover:text-[#C23A1B] transition cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => onDeleteReport(rec.id)}
                            title="Delete"
                            className="p-1 rounded hover:bg-rose-100 text-rose-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

      {/* BRANDED FOOTER (Matches 6.png) */}
      <div className="bg-[#2B0E10] text-[#D8BDBE] rounded-xl p-4 sm:p-5 border-t-2 border-[#5C1E23] flex flex-col items-center justify-center text-center space-y-1.5 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
            <img src="/logo-2.png" alt="BG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide font-mono">
            BG GROUP <span className="text-xs font-normal text-rose-200">of Paint and Coating Consultant</span>
          </span>
        </div>
        <div className="text-[11px] text-rose-200/90 font-medium">
          Industrial Cost Estimation · Surface Protection · Coating Engineering
        </div>
        <div className="text-[10px] text-rose-300/60 font-mono flex flex-wrap justify-center gap-x-2">
          <span>E 103, Akash Echo Point, Bhimrad, Surat - 395007, Gujarat, India</span>
          <span>|</span>
          <span>+91 98258 10408</span>
          <span>|</span>
          <span>support@bgcoating.com</span>
          <span>|</span>
          <span>www.bgcoating.com</span>
        </div>
      </div>

    </div>
  );
}
