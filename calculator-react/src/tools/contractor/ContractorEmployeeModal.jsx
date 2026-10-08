// src/tools/contractor/ContractorEmployeeModal.jsx
import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

export default function ContractorEmployeeModal({
  isOpen,
  onClose,
  sites = [],
  onSave
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Blaster / Operator');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [dailyWage, setDailyWage] = useState(900);
  const [qualification, setQualification] = useState('OQR Certified');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEmp = {
      id: 'EMP-' + String(Date.now()).slice(-4),
      name: name.trim(),
      role,
      site: sites.find(s => s.id === siteId)?.name || 'Hazira Yard',
      dailyWage: Number(dailyWage),
      monthlyCtc: Number(dailyWage) * 26,
      status: 'Active',
      qualification
    };

    onSave(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#F7941D] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Add Workforce Member</h3>
              <p className="text-[11px] text-slate-500">Register operators, blasters, painters &amp; site staff.</p>
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
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Mukesh Solanki"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Trade / Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                <option value="Lead Blaster">Lead Blaster</option>
                <option value="Spray Painter">Spray Painter</option>
                <option value="TSA Operator">TSA Operator</option>
                <option value="QC Inspector">QC Inspector</option>
                <option value="Site Supervisor">Site Supervisor</option>
                <option value="Helper">Helper / Labour</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Assigned Site</label>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Daily Wage (₹/day)</label>
              <input
                type="number"
                min="300"
                value={dailyWage}
                onChange={e => setDailyWage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Qualification / Cert</label>
              <input
                type="text"
                placeholder="e.g. OQR Level 2"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
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
              <span>Add Employee</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
