// src/tools/inspection/InspectionReportRegister.jsx
import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Copy, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Save, 
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const INSPECTION_STORAGE_KEY = 'bg_os_inspection_reports_register';

export default function InspectionReportRegister({
  currentState,
  onLoadReport,
  onOpenPreview
}) {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load registered reports from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(INSPECTION_STORAGE_KEY);
      if (raw) {
        setReports(JSON.parse(raw));
      } else {
        // Seed with starter sample inspection if empty
        const initial = [
          {
            id: 'CIR-BG-2026-0841',
            date: '2026-08-29',
            projectNo: 'PRJ-2026-MUNDRA-T104',
            projectName: 'Mundra LNG Storage Tank T-104 External Protection',
            customer: 'Adani Total LNG / IOCL',
            inspector: 'Prakash Ramavat',
            status: 'Approved',
            savedAt: new Date().toISOString(),
            data: currentState
          }
        ];
        setReports(initial);
        localStorage.setItem(INSPECTION_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (err) {
      console.error('Error loading inspection register:', err);
    }
  }, []);

  const saveToStorage = (updated) => {
    setReports(updated);
    localStorage.setItem(INSPECTION_STORAGE_KEY, JSON.stringify(updated));
  };

  // Save current workspace as new report
  const handleSaveCurrentWorkspace = () => {
    const reportNo = currentState.reportNo || currentState.stages?.s1?.reportNo || `CIR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const projectName = currentState.projectName || currentState.stages?.s1?.projectName || 'Industrial Coating Project';
    const customer = currentState.customer || currentState.stages?.s1?.customer || 'Client QC Department';
    const date = currentState.date || currentState.stages?.s1?.date || new Date().toISOString().split('T')[0];

    const newEntry = {
      id: reportNo,
      date,
      projectNo: currentState.projectNo || currentState.stages?.s1?.projectNo || 'PRJ-2026',
      projectName,
      customer,
      inspector: currentState.stages?.s1?.signApplicator?.name || 'Prakash Ramavat',
      status: 'Approved',
      savedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(currentState))
    };

    const next = [newEntry, ...reports];
    saveToStorage(next);
    addToast('Inspection Registered', `Report ${newEntry.id} saved to persistent register.`, 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete inspection record ${id} from register?`)) {
      const next = reports.filter(r => r.id !== id);
      saveToStorage(next);
      addToast('Report Deleted', `Record ${id} removed.`, 'info');
    }
  };

  const handleDuplicate = (report) => {
    const dupId = `${report.id}-COPY`;
    const dup = {
      ...report,
      id: dupId,
      savedAt: new Date().toISOString()
    };
    const next = [dup, ...reports];
    saveToStorage(next);
    addToast('Report Duplicated', `Created duplicate record ${dupId}.`, 'success');
  };

  const handleLoad = (report) => {
    if (report.data) {
      onLoadReport(report.data);
      addToast('Workspace Loaded', `Inspection report ${report.id} loaded into workspace.`, 'success');
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (!reports.length) return;
    const headers = ['Report No', 'Date', 'Project Code', 'Project Name', 'Client', 'Inspector', 'Status', 'Saved At'];
    const rows = reports.map(r => [
      `"${r.id}"`,
      `"${r.date}"`,
      `"${r.projectNo}"`,
      `"${r.projectName.replace(/"/g, '""')}"`,
      `"${r.customer.replace(/"/g, '""')}"`,
      `"${r.inspector}"`,
      `"${r.status}"`,
      `"${r.savedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BG_Coating_Inspection_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Register Exported', 'CSV register downloaded successfully.', 'success');
  };

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      (r.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.customer || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.inspector || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-mono font-bold uppercase">
              Database Register
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Coating Inspection Reports Register
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived QA/QC inspection dossiers, multi-stage records, and compliance records stored in browser localStorage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleSaveCurrentWorkspace}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Current Workspace
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Total Reports</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{reports.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-500 block">Approved Dossiers</span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
            {reports.filter(r => r.status === 'Approved').length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">Draft / In Review</span>
          <div className="text-2xl font-black font-mono text-amber-600 mt-1">
            {reports.filter(r => r.status === 'Draft' || r.status === 'In Review').length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-red-500 block">Non-Compliant</span>
          <div className="text-2xl font-black font-mono text-red-600 mt-1">
            {reports.filter(r => r.status === 'Rejected').length}
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Report No, Project Name, Customer, Inspector..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/60"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 overflow-x-auto">
          {['ALL', 'Approved', 'Draft', 'In Review', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Reports Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-xs">
        <table className="w-full text-xs text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4 w-44">Report Number</th>
              <th className="py-3 px-3 w-28">Date</th>
              <th className="py-3 px-4">Project &amp; Structure</th>
              <th className="py-3 px-4 w-48">Customer / Client</th>
              <th className="py-3 px-3 w-36">Inspector</th>
              <th className="py-3 px-3 w-28 text-center">Status</th>
              <th className="py-3 px-4 w-36 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  {r.id}
                </td>
                <td className="py-3 px-3 text-slate-500 font-mono">
                  {r.date}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800">{r.projectName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{r.projectNo}</div>
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium">
                  {r.customer}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {r.inspector}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                    r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    r.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                    r.status === 'In Review' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleLoad(r)}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer"
                      title="Load into Workspace"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        handleLoad(r);
                        onOpenPreview();
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Preview Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(r)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
          <div className="py-12 text-center text-slate-400 space-y-1">
            <History className="w-7 h-7 mx-auto mb-1 text-slate-300" />
            <div className="text-xs font-bold text-slate-700">No Inspection Reports Found</div>
            <p className="text-[11px]">Save the current workspace or adjust search filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
