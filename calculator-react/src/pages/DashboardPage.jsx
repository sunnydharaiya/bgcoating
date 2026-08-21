import React, { useState } from 'react';
import { 
  Calculator, 
  FileCode2, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  History, 
  Building2, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  Layers,
  Wrench,
  Clock
} from 'lucide-react';

export default function DashboardPage({ setActivePage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const metricCards = [
    { title: 'Project Estimations', value: '1,280', subtitle: 'Saved in project history', change: '+12% this week', icon: Calculator, color: 'amber' },
    { title: 'Standards Library', value: '45+', subtitle: 'ISO 12944, NACE, SSPC, ASTM', change: 'Fully Updated', icon: BookOpen, color: 'sky' },
    { title: 'Paint Spec Catalog', value: '120+', subtitle: 'Jotun, Hempel, International', change: '8 Manufacturers', icon: Layers, color: 'emerald' },
    { title: 'System Compliance', value: 'Verified', subtitle: 'NACE / AMPP Level 3 Aligned', change: 'ISO 12944 C5-I', icon: ShieldCheck, color: 'purple' }
  ];

  const recentCalculations = [
    { id: 'CALC-9041', project: 'Surat Refinery Storage Tank T-102', type: 'Tank Shell', inputs: 'Dia 15.0m × H 12.0m', area: '565.49 m²', paint: '144.37 L', date: '2026-08-19 18:42', status: 'Logged' },
    { id: 'CALC-9040', project: 'Hazira Petrochemical Pipe Spools', type: 'Pipe Spool', inputs: 'OD 323.9mm × L 6.0m (10 Qty)', area: '61.05 m²', paint: '15.60 L', date: '2026-08-19 17:15', status: 'Logged' },
    { id: 'CALC-9039', project: 'Dahej Plant Structural Steelwork', type: 'Abrasive Blasting', inputs: 'Area 500 m² (Garnet Grit)', area: '500.00 m²', paint: '9.00 MT Media', date: '2026-08-19 15:30', status: 'Logged' },
    { id: 'CALC-9038', project: 'Jamnagar Export Pipeline Header', type: 'Tank Roof', inputs: 'Conical Roof Dia 15.0m', area: '190.33 m²', paint: '48.60 L', date: '2026-08-19 14:10', status: 'Logged' },
    { id: 'CALC-9037', project: 'Vadodara Chemical Storage Vessel', type: 'Tank Shell', inputs: 'Dia 8.5m × H 9.0m', area: '240.33 m²', paint: '61.40 L', date: '2026-08-19 11:25', status: 'Logged' }
  ];

  const filteredLogs = recentCalculations.filter(c => {
    const matchesSearch = c.project.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || c.type.toLowerCase().replace(' ', '_') === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Top Workspace Greeting & Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#F7941D]/20 border border-[#F7941D]/40 text-[#F7941D] text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BG CoatingOS™ — White Enterprise Workspace</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Good day, Prakash Ramavat <span className="text-slate-400 font-normal text-lg">· Principal Consultant</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Industrial surface preparation, corrosion assessment & coating estimation workspace. Calculate tank shells, roofs, pipe spools, and blast media consumption aligned with ISO 12944 & NACE/AMPP standards.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <button
              onClick={() => setActivePage('coating-calculator')}
              className="bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Estimation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('specification-reading')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Decode Specification</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="w-4 h-4 text-[#F7941D]" />
                </div>
                <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {m.change}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">{m.title}</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{m.value}</div>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">{m.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Workspace Module Launchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          onClick={() => setActivePage('coating-calculator')}
          className="bg-white hover:border-[#F7941D] border border-slate-200 p-6 rounded-2xl cursor-pointer transition shadow-xs space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="bg-amber-50 text-[#F7941D] p-3 rounded-xl border border-amber-100 group-hover:scale-105 transition">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Core Tool</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#F7941D] transition">Coating Quantity & Area Calculator</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Calculate exact surface area in m²/ft², theoretical liters, and practical paint volume considering loss factors.</p>
          </div>
          <div className="text-xs font-bold text-[#F7941D] flex items-center gap-1">
            <span>Launch Estimator</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActivePage('specification-reading')}
          className="bg-white hover:border-[#F7941D] border border-slate-200 p-6 rounded-2xl cursor-pointer transition shadow-xs space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100 group-hover:scale-105 transition">
              <FileCode2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Decoder</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#F7941D] transition">Coating Specification Decoder</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Decode complex paint system specification sheets into structured surface prep and coat stack guidelines.</p>
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span>Open Decoder</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActivePage('knowledge')}
          className="bg-white hover:border-[#F7941D] border border-slate-200 p-6 rounded-2xl cursor-pointer transition shadow-xs space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="bg-sky-50 text-sky-600 p-3 rounded-xl border border-sky-100 group-hover:scale-105 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Library</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#F7941D] transition">Standards & Reference Library</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Access SSPC-VIS 1 visual standards, ISO 8501-1 blast grades, and NACE inspection protocols.</p>
          </div>
          <div className="text-xs font-bold text-sky-600 flex items-center gap-1">
            <span>Browse Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. Recent Calculations Activity Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        
        {/* Table Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Estimation Audit Logs</h3>
            <p className="text-xs text-slate-500">Real-time log of project calculation requests and engineering metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search project or ID..."
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 w-48 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <select
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">All Tool Types</option>
              <option value="tank_shell">Tank Shell</option>
              <option value="tank_roof">Tank Roof</option>
              <option value="pipe_spool">Pipe Spool</option>
              <option value="abrasive_blasting">Abrasive Blasting</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">Log ID</th>
                <th className="p-3 font-semibold">Project / Asset Name</th>
                <th className="p-3 font-semibold">Tool Type</th>
                <th className="p-3 font-semibold">Input Parameters</th>
                <th className="p-3 font-semibold">Surface Area</th>
                <th className="p-3 font-semibold">Practical Liters</th>
                <th className="p-3 font-semibold">Logged At</th>
                <th className="p-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-[#F7941D]">{row.id}</td>
                    <td className="p-3 font-bold text-slate-900">{row.project}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono">
                        {row.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 text-[11px]">{row.inputs}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{row.area}</td>
                    <td className="p-3 font-mono font-bold text-amber-700">{row.paint}</td>
                    <td className="p-3 font-mono text-slate-500 text-[11px]">{row.date}</td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => setActivePage('coating-calculator')}
                        className="text-[#F7941D] hover:text-[#D97706] font-bold text-xs inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-slate-400 font-mono text-xs">
                    No matching calculation logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
