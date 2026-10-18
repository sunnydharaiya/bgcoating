// src/tools/contractor/ContractorMasterDataView.jsx
import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Wrench, 
  Package, 
  Folder, 
  Plus, 
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

export default function ContractorMasterDataView({
  state,
  onOpenCreateProject,
  onOpenAddEmployee,
  onOpenStockUpdate
}) {
  const [activeTab, setActiveTab] = useState('projects');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 w-full pb-16 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#F7941D] rounded-full"></span>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              Master Data &amp; Site Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage projects, operating sites, qualified workforce rosters, machinery assets &amp; consumable inventories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'projects' && (
            <button
              onClick={onOpenCreateProject}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white text-xs font-bold hover:brightness-110 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          )}

          {activeTab === 'workforce' && (
            <button
              onClick={onOpenAddEmployee}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white text-xs font-bold hover:brightness-110 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
          )}

          {activeTab === 'consumables' && (
            <button
              onClick={onOpenStockUpdate}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white text-xs font-bold hover:brightness-110 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Update Stock</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-amber-500" />
          <span>Projects ({state.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sites')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'sites'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-pink-500" />
          <span>Sites ({state.sites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workforce')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'workforce'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-500" />
          <span>Workforce ({state.workforce.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consumables')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'consumables'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-sky-500" />
          <span>Consumables ({state.consumables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'assets'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-purple-500" />
          <span>Machinery Assets ({state.assets.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        {activeTab === 'projects' && (
          <div className="overflow-x-auto">
            <table className="enterprise-table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Site</th>
                  <th>Target Area</th>
                  <th>Surface Prep</th>
                  <th>Coated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.projects.map(p => (
                  <tr key={p.id}>
                    <td className="font-mono font-bold text-[#F7941D]">{p.code}</td>
                    <td className="font-bold text-slate-800">{p.name}</td>
                    <td>{p.client}</td>
                    <td className="text-slate-500">{p.site}</td>
                    <td className="font-mono font-bold">{p.totalArea.toLocaleString()} m²</td>
                    <td className="font-mono text-amber-600">{p.completedPrep.toLocaleString()} m²</td>
                    <td className="font-mono text-emerald-600">{p.completedCoat.toLocaleString()} m²</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {state.sites.map(s => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-pink-600">{s.id}</span>
                  <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold">
                    {s.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{s.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.city}, Gujarat</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workforce' && (
          <div className="overflow-x-auto">
            <table className="enterprise-table w-full">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Assigned Site</th>
                  <th>Daily Wage</th>
                  <th>Monthly CTC</th>
                  <th>Qualification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.workforce.map(w => (
                  <tr key={w.id}>
                    <td className="font-mono font-bold text-amber-600">{w.id}</td>
                    <td className="font-bold text-slate-800">{w.name}</td>
                    <td>{w.role}</td>
                    <td className="text-slate-500">{w.site}</td>
                    <td className="font-mono">₹{w.dailyWage}/day</td>
                    <td className="font-mono font-bold text-emerald-700">₹{w.monthlyCtc.toLocaleString()}</td>
                    <td className="font-mono text-slate-600">{w.qualification}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-semibold">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'consumables' && (
          <div className="overflow-x-auto">
            <table className="enterprise-table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Consumable Item</th>
                  <th>Type</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Operating Site</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.consumables.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold text-sky-600">{c.id}</td>
                    <td className="font-bold text-slate-800">{c.name}</td>
                    <td>{c.type}</td>
                    <td className="font-mono font-bold text-emerald-700">{c.currentStock} {c.unit}</td>
                    <td className="font-mono text-slate-500">{c.threshold} {c.unit}</td>
                    <td>{c.site}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="overflow-x-auto">
            <table className="enterprise-table w-full">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Equipment Name</th>
                  <th>Category</th>
                  <th>Serial Number</th>
                  <th>Site</th>
                  <th>Next Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.assets.map(a => (
                  <tr key={a.id}>
                    <td className="font-mono font-bold text-purple-600">{a.id}</td>
                    <td className="font-bold text-slate-800">{a.name}</td>
                    <td>{a.category}</td>
                    <td className="font-mono text-slate-600">{a.serialNo}</td>
                    <td>{a.site}</td>
                    <td className="font-mono text-slate-500">{a.nextService}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
