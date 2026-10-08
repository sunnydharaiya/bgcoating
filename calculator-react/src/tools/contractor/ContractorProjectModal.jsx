// src/tools/contractor/ContractorProjectModal.jsx
import React, { useState } from 'react';
import { X, FolderPlus, Check } from 'lucide-react';

export default function ContractorProjectModal({
  isOpen,
  onClose,
  sites = [],
  onSave
}) {
  const [code, setCode] = useState('DM-CC-S2');
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [totalArea, setTotalArea] = useState(10000);
  const [targetEndDate, setTargetEndDate] = useState('2026-12-31');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj = {
      id: 'PRJ-' + String(Date.now()).slice(-4),
      code: code.trim(),
      name: name.trim(),
      client: client.trim() || 'Client',
      site: sites.find(s => s.id === siteId)?.name || 'Hazira Yard',
      status: 'Active',
      startDate: new Date().toISOString().slice(0, 10),
      targetEndDate,
      totalArea: Number(totalArea),
      completedPrep: 0,
      completedCoat: 0,
      activeDpr: true
    };

    onSave(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Create New Project</h3>
              <p className="text-[11px] text-slate-500">Initiate coating project, client allocation &amp; target surface area.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Project Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Client Name</label>
              <input
                type="text"
                required
                placeholder="e.g. L&T / ONGC"
                value={client}
                onChange={e => setClient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Project Description / Scope</label>
            <input
              type="text"
              required
              placeholder="e.g. Pipe Spool Blasting & High-Temp TSA"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Site Location</label>
              <select
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Area (m²)</label>
              <input
                type="number"
                min="100"
                value={totalArea}
                onChange={e => setTotalArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Completion Date</label>
            <input
              type="date"
              value={targetEndDate}
              onChange={e => setTargetEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white text-xs font-bold hover:brightness-110 shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
