// src/tools/contractor/ContractorDailyProgressModal.jsx
import React, { useState } from 'react';
import { X, ClipboardList, Check } from 'lucide-react';

export default function ContractorDailyProgressModal({
  isOpen,
  onClose,
  projects = [],
  sites = [],
  onSave
}) {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [prepArea, setPrepArea] = useState(100);
  const [coatArea, setCoatArea] = useState(100);
  const [hours, setHours] = useState(8);
  const [manpower, setManpower] = useState(2);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProj = projects.find(p => p.id === projectId) || projects[0];
    const selectedSite = sites.find(s => s.id === siteId) || sites[0];

    const newLog = {
      id: 'LOG-' + Date.now(),
      date,
      action: 'Daily progress logged',
      details: `${coatArea} m² painting/coating • ${selectedProj?.code || 'PRJ'} • ${selectedProj?.client || 'Client'} • ${hours}.0 / Hours`,
      site: selectedSite?.name || 'Main Site',
      type: 'progress'
    };

    onSave(newLog, {
      projectId,
      siteId,
      date,
      prepArea: Number(prepArea),
      coatArea: Number(coatArea),
      hours: Number(hours),
      manpower: Number(manpower)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F7941D] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Log Daily Progress (DPR)</h3>
              <p className="text-[11px] text-slate-500">Record site surface prep, coating area &amp; manpower hours.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Project</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.client}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Site</label>
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Surface Prep (m²)</label>
              <input
                type="number"
                min="0"
                value={prepArea}
                onChange={e => setPrepArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Coating Area (m²)</label>
              <input
                type="number"
                min="0"
                value={coatArea}
                onChange={e => setCoatArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Workforce Present</label>
              <input
                type="number"
                min="1"
                value={manpower}
                onChange={e => setManpower(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Shift Hours</label>
              <input
                type="number"
                min="1"
                max="24"
                value={hours}
                onChange={e => setHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Remarks / Shift Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Completed blasting on spool A4 per SSPC-SP 10 / Sa 2.5..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
              <span>Save Progress</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
