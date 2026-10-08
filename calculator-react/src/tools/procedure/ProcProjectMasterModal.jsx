import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Trash2, FolderKanban } from 'lucide-react';

const PROJECT_MASTER_KEY = 'bg_os_procedure_project_master';

const DEFAULT_PROJECTS = [
  {
    id: 'pm-1',
    projectName: 'Hydrocarbon Refinery Expansion Phase-II',
    clientName: 'National Petroleum Corp.',
    projectNum: 'NPC-REF-2026-08',
    docNo: 'BG-PROC-PIP-001',
    tag: 'Process Piping & Spools',
    location: 'Dahej Petrochemical Complex, Gujarat',
    createdAt: '2026-08-15'
  },
  {
    id: 'pm-2',
    projectName: 'Offshore Wellhead Topside Module Structural Coating',
    clientName: 'Global Energy Exploration Ltd.',
    projectNum: 'GEE-OFF-7701',
    docNo: 'BG-PROC-OFF-002',
    tag: 'Structural Steel & Splash Zone',
    location: 'Mumbai High Offshore Basin',
    createdAt: '2026-09-02'
  }
];

export default function ProcProjectMasterModal({ isOpen, onClose, onSelectProject }) {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(PROJECT_MASTER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch (e) {
      return DEFAULT_PROJECTS;
    }
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    projectNum: '',
    docNo: '',
    tag: '',
    location: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROJECT_MASTER_KEY, JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  if (!isOpen) return null;

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) return;

    const newProject = {
      id: 'pm-' + Date.now(),
      ...form,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setProjects([newProject, ...projects]);
    setShowCreateForm(false);
    setForm({
      projectName: '',
      clientName: '',
      projectNum: '',
      docNo: '',
      tag: '',
      location: ''
    });
  };

  const handleDeleteProject = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this project from Master List?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSelect = (proj) => {
    if (onSelectProject) {
      onSelectProject(proj);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2B303A] to-[#1E2530] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg border border-amber-500/30">
              🗂
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide flex items-center gap-2">
                Project Master List
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  PRO
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                Select a permanent project to auto-fill procedure metadata and customer specs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">
            {projects.length} Registered Project(s) in Master Database
          </span>
          <button
            type="button"
            onClick={() => setShowCreateForm(prev => !prev)}
            className="px-3 py-1.5 bg-[#8B0E16] hover:bg-[#6E0C12] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showCreateForm ? 'Cancel Creation' : '➕ Create New Project'}</span>
          </button>
        </div>

        {/* Create Form Drawer */}
        {showCreateForm && (
          <form onSubmit={handleCreateProject} className="p-6 bg-[#FFF9F2] border-b border-amber-200 space-y-4">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Project Registration Form
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LNG Storage Terminal Tanks Coating"
                  value={form.projectName}
                  onChange={e => setForm({ ...form, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#F7941D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer / Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bharat Petroleum Corp. Ltd."
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#F7941D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Project Number / Code</label>
                <input
                  type="text"
                  placeholder="e.g. BPCL-LNG-2026-44"
                  value={form.projectNum}
                  onChange={e => setForm({ ...form, projectNum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#F7941D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Number</label>
                <input
                  type="text"
                  placeholder="e.g. BG-PROC-TNK-003"
                  value={form.docNo}
                  onChange={e => setForm({ ...form, docNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#F7941D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Equipment / Area Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Cryogenic Tank Shell & Roof"
                  value={form.tag}
                  onChange={e => setForm({ ...form, tag: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#F7941D]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Location / Site Facility</label>
                <input
                  type="text"
                  placeholder="e.g. Kochi Terminal, Kerala"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#F7941D]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#F7941D] hover:bg-[#D97706] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs"
              >
                Save to Master
              </button>
            </div>
          </form>
        )}

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => handleSelect(proj)}
              className="p-4 border border-gray-200 hover:border-[#F7941D] rounded-xl bg-white hover:bg-[#FFF9F2] transition cursor-pointer flex items-center justify-between group shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 group-hover:text-[#8B0E16]">
                    {proj.projectName}
                  </span>
                  {proj.projectNum && (
                    <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
                      {proj.projectNum}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{proj.clientName || 'General Client'}</span>
                  <span>·</span>
                  <span className="text-gray-500 font-mono">{proj.docNo || 'No Doc #'}</span>
                  {proj.tag && (
                    <>
                      <span>·</span>
                      <span className="text-[#8B0E16] font-medium">{proj.tag}</span>
                    </>
                  )}
                </div>
                {proj.location && (
                  <div className="text-[11px] text-gray-400">
                    📍 {proj.location}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect(proj)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#F7941D] to-[#8B0E16] hover:opacity-95 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Auto-fill Procedure</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteProject(proj.id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title="Delete from Master"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
