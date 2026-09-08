import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Download, 
  Search, 
  Printer, 
  Edit3, 
  Eye, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  RotateCcw, 
  Play 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const REGISTER_STORAGE_KEY = 'bg_os_spec_reports_register';

export default function SpecReportRegister({ 
  currentSpec, 
  onLoadSpec, 
  onNewGeneration, 
  onOpenPreview, 
  onPrint 
}) {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load registered reports from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REGISTER_STORAGE_KEY);
      if (saved) {
        setReports(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load spec register:', e);
    }
  }, []);

  const saveToStorage = (updatedList) => {
    setReports(updatedList);
    localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Save current active specification into Register
  const handleSaveCurrentToRegister = () => {
    if (!currentSpec.projectData.projNo && !currentSpec.projectData.projDesc) {
      addToast('Cannot Save Empty Spec', 'Please fill in Project No. or Description before saving to register.', 'warning');
      return;
    }

    const newReport = {
      id: `SPEC-${Date.now().toString().slice(-6)}`,
      dinNo: currentSpec.projectData.dinNo || 'DIN-2026-001',
      projNo: currentSpec.projectData.projNo || 'PRJ-UNNAMED',
      projDesc: currentSpec.projectData.projDesc || 'Coating Specification Sheet',
      custName: currentSpec.projectData.custName || 'Confidential Client',
      preparedBy: currentSpec.projectData.preparedBy || 'Coating Specialist',
      date: new Date().toISOString().split('T')[0],
      status: 'Approved', // Draft, Under Review, Approved, Rejected
      revision: currentSpec.projectData.revision || 'Rev. 0',
      data: JSON.parse(JSON.stringify(currentSpec))
    };

    const updated = [newReport, ...reports.filter(r => r.projNo !== newReport.projNo)];
    saveToStorage(updated);
    addToast('Registered Successfully', `Saved ${newReport.projNo} to Report Register.`, 'success');
  };

  // Delete from register
  const handleDeleteReport = (id) => {
    if (window.confirm('Delete this registered specification?')) {
      const updated = reports.filter(r => r.id !== id);
      saveToStorage(updated);
      addToast('Deleted', 'Specification removed from register.', 'info');
    }
  };

  // Duplicate / Copy
  const handleCopyReport = (report) => {
    const cloned = JSON.parse(JSON.stringify(report));
    cloned.id = `SPEC-${Date.now().toString().slice(-6)}`;
    cloned.projNo = `${cloned.projNo}_COPY`;
    cloned.status = 'Draft';
    cloned.date = new Date().toISOString().split('T')[0];
    const updated = [cloned, ...reports];
    saveToStorage(updated);
    addToast('Duplicated', `Created duplicate record ${cloned.projNo}`, 'success');
  };

  // Export register to CSV
  const handleExportCSV = () => {
    if (reports.length === 0) {
      addToast('Register Empty', 'No records to export.', 'warning');
      return;
    }

    const headers = ['Sr', 'Doc ID', 'DIN No', 'Project No', 'Project Description', 'Customer', 'Prepared By', 'Date', 'Status', 'Revision'];
    const rows = reports.map((r, i) => [
      i + 1,
      `"${r.id}"`,
      `"${r.dinNo}"`,
      `"${r.projNo}"`,
      `"${r.projDesc}"`,
      `"${r.custName}"`,
      `"${r.preparedBy}"`,
      `"${r.date}"`,
      `"${r.status}"`,
      `"${r.revision}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Specification_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Register Exported', 'Downloaded specification register CSV.', 'success');
  };

  // Filtered reports
  const filtered = reports.filter(r => {
    const matchesSearch = 
      (r.projNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.projDesc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.custName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.dinNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.preparedBy || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalCount = reports.length;
  const draftCount = reports.filter(r => r.status === 'Draft').length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const underReviewCount = reports.filter(r => r.status === 'Under Review').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Output &amp; Register
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Coating Specification Report Register
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized document register for all generated project specifications, revision tracking, status approvals, and batch exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSaveCurrentToRegister}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Current to Register</span>
          </button>

          <button
            type="button"
            onClick={onNewGeneration}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Generation</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Dashboard Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Total Specs</span>
            <span className="text-xl font-black font-mono text-slate-900">{totalCount}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-[#D97706]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Draft Records</span>
            <span className="text-xl font-black font-mono text-[#D97706]">{draftCount}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Approved</span>
            <span className="text-xl font-black font-mono text-emerald-700">{approvedCount}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Under Review</span>
            <span className="text-xl font-black font-mono text-sky-700">{underReviewCount}</span>
          </div>
        </div>
      </div>

      {/* Main Table Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by project no, client, description, or engineer..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
            </select>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Register Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[10.5px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">Sr.</th>
                <th className="p-3 w-28">Project No.</th>
                <th className="p-3 w-28">DIN No.</th>
                <th className="p-3 min-w-[200px]">Project Description</th>
                <th className="p-3 min-w-[140px]">Customer</th>
                <th className="p-3 w-28">Date</th>
                <th className="p-3 w-24 text-center">Status</th>
                <th className="p-3 w-20 text-center">Revision</th>
                <th className="p-3 text-center min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-mono text-xs">
                    {reports.length === 0 
                      ? 'No specification records registered yet. Click "Save Current to Register" above.' 
                      : 'No records matching your search/filter.'}
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-2.5 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{item.projNo}</td>
                    <td className="p-2.5 font-mono text-slate-600">{item.dinNo}</td>
                    <td className="p-2.5 font-medium text-slate-800">{item.projDesc}</td>
                    <td className="p-2.5 text-slate-700">{item.custName}</td>
                    <td className="p-2.5 font-mono text-slate-500">{item.date}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-600">{item.revision}</td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (onLoadSpec && item.data) onLoadSpec(item.data);
                            addToast('Spec Loaded', `Loaded ${item.projNo} into active workspace.`, 'success');
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#D97706] hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Edit / Load into Form"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenPreview && item.data) onOpenPreview(item.data);
                          }}
                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer"
                          title="Preview Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyReport(item)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                          title="Duplicate / Copy Record"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Record"
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
