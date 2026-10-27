// src/components/CalculationLogDrawer.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  Download, 
  Trash2, 
  Search, 
  Layers, 
  ArrowRight, 
  Clock, 
  Check, 
  Copy,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { calculatorService } from '../services/calculatorService';
import { useToast } from '../context/ToastContext';

export default function CalculationLogDrawer({ isOpen, onClose, onRestoreTool }) {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await calculatorService.getLogs();
      setLogs(data);
    } catch (e) {
      console.warn('Failed to load calculation logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this calculation log?')) return;
    try {
      await calculatorService.deleteLog(id);
      setLogs(prev => prev.filter(x => x.id !== id));
      addToast('Log Deleted', 'Calculation log removed.', 'info');
    } catch (err) {
      addToast('Error', 'Failed to delete calculation log.', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!logs.length) return;
    if (!window.confirm('Clear all calculation logs from this device?')) return;
    try {
      await calculatorService.clearLogs();
      setLogs([]);
      addToast('Logs Cleared', 'All calculation logs have been cleared.', 'info');
    } catch (err) {
      addToast('Error', 'Failed to clear logs.', 'error');
    }
  };

  const handleExportCsv = () => {
    if (!filteredLogs.length) {
      addToast('No Data', 'No calculation logs available to export.', 'warning');
      return;
    }
    calculatorService.exportLogsAsCsv(filteredLogs);
    addToast('CSV Exported', 'Calculation audit log downloaded successfully.', 'success');
  };

  const handleCopySummary = (log, e) => {
    e.stopPropagation();
    const inputEntries = Object.entries(log.inputs || {})
      .map(([k, v]) => `  • ${k}: ${v}`)
      .join('\n');
    const resultEntries = Object.entries(log.results || {})
      .map(([k, v]) => `  • ${k}: ${v}`)
      .join('\n');

    const text = `BG CoatingOS™ — Calculation Audit Log
Tool: ${log.tool_name} (${log.tool_id})
Project: ${log.project_name || 'General Project'}
Date: ${new Date(log.created_at).toLocaleString()}
--------------------------------------------------
INPUTS:
${inputEntries || '  None'}
--------------------------------------------------
RESULTS:
${resultEntries || '  None'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('Copied', 'Calculation summary copied to clipboard.', 'success');
  };

  const handleRestore = (log) => {
    if (onRestoreTool) {
      onRestoreTool(log);
      onClose();
      addToast('Calculation Restored', `Loaded ${log.tool_name} parameters.`, 'success');
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.tool_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.tool_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.project_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.client_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F7941D] to-[#E87B1E] flex items-center justify-center text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold font-rajdhani text-lg uppercase tracking-wide">
                  Calculation Audit Logs
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/30">
                  {logs.length} Records
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                History &amp; persistent form states for CoatingOS calculations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Action Buttons */}
        <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by tool, project or client..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#E87B1E]"
              />
            </div>
            <button
              onClick={handleExportCsv}
              disabled={!filteredLogs.length}
              className="px-3 py-1.5 text-xs font-bold font-rajdhani uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={handleClearAll}
              disabled={!logs.length}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-40"
              title="Clear All History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'paint', label: 'Paint' },
              { id: 'area', label: 'Surface Area' },
              { id: 'abrasive', label: 'Abrasives' },
              { id: 'salt', label: 'Salt' },
              { id: 'pro', label: 'Executive PRO' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-rajdhani uppercase transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#E87B1E] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logs List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <div className="w-6 h-6 border-2 border-[#E87B1E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading audit logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 font-rajdhani uppercase">
                {searchTerm ? 'No Matching Calculation Logs' : 'No Saved Calculations Yet'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {searchTerm 
                  ? 'Try searching with different keywords.' 
                  : 'Whenever you calculate in any tool, click "Save to Log" to save your parameters, formulas, and results here.'}
              </p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                onClick={() => handleRestore(log)}
                className="group p-3.5 bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-[#E87B1E] rounded-xl shadow-xs transition cursor-pointer relative"
              >
                {/* Top Row: Tool Name + Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {log.tool_id}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-[#E87B1E] transition">
                      {log.tool_name}
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Project / Client Tag */}
                {log.project_name && (
                  <div className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center gap-1">
                    <span>📁 Project:</span>
                    <span className="text-slate-800">{log.project_name}</span>
                    {log.client_name && <span className="text-slate-400">({log.client_name})</span>}
                  </div>
                )}

                {/* Key Inputs / Results Preview */}
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inputs:</span>
                    <div className="space-y-0.5 mt-0.5 text-slate-700 font-mono text-[10.5px]">
                      {Object.entries(log.inputs || {}).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-slate-500">{k}:</span> {String(v)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#E87B1E] uppercase tracking-wider block">Results:</span>
                    <div className="space-y-0.5 mt-0.5 font-bold font-mono text-[10.5px] text-slate-900">
                      {Object.entries(log.results || {}).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-slate-500 font-normal">{k}:</span> {String(v)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Footbar */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopySummary(log, e)}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition p-1 hover:bg-slate-100 rounded"
                      title="Copy Summary"
                    >
                      {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === log.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(log.id, e)}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition p-1 hover:bg-red-50 rounded"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-[#E87B1E] group-hover:translate-x-0.5 transition flex items-center gap-1 font-rajdhani uppercase">
                    Restore to Tool <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-sans">
          BG CoatingOS™ · Logs synced automatically with Django Backend &amp; Local Storage
        </div>
      </div>
    </div>
  );
}
