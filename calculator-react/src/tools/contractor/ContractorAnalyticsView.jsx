// src/tools/contractor/ContractorAnalyticsView.jsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Gauge, 
  Calendar, 
  Users, 
  Package, 
  Layers, 
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function ContractorAnalyticsView({
  state,
  kpis,
  initialTab = 'executive'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-16 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#F7941D] rounded-full"></span>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              Contractor Analytics &amp; Operations BI
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Executive metrics, daily progress summaries, multi-site productivity, and stock trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('executive')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'executive'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
          <span>Executive Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#F7941D]" />
          <span>Daily Progress Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'stock'
              ? 'bg-[#181E29] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-sky-400" />
          <span>Stock / Inventory Dashboard</span>
        </button>
      </div>

      {/* Analytics Content */}
      {activeTab === 'executive' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Contracted Area</span>
            <div className="text-2xl font-extrabold text-slate-800 font-mono">45,100 m²</div>
            <p className="text-xs text-emerald-600 font-semibold font-mono">3 Active Projects</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Protected Surface (MTD)</span>
            <div className="text-2xl font-extrabold text-slate-800 font-mono">6,750 m²</div>
            <p className="text-xs text-[#F7941D] font-semibold font-mono">Blasted &amp; Coated</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Monthly Manpower CTC</span>
            <div className="text-2xl font-extrabold text-slate-800 font-mono">₹{kpis.monthlyCtc.toLocaleString()}</div>
            <p className="text-xs text-slate-500 font-mono">2 Allocated Personnel</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Safety &amp; Zero Lost Time</span>
            <div className="text-2xl font-extrabold text-slate-800 font-mono">100%</div>
            <p className="text-xs text-emerald-600 font-mono font-bold">✓ Zero Incidents</p>
          </div>
        </div>
      )}

      {activeTab === 'daily' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Daily Production Logged Across Sites</h3>
          <div className="overflow-x-auto">
            <table className="enterprise-table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Site</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.dailyLogs.map(l => (
                  <tr key={l.id}>
                    <td className="font-mono text-slate-500">{l.date}</td>
                    <td className="font-bold text-slate-800">{l.action}</td>
                    <td className="font-mono text-xs">{l.details}</td>
                    <td className="text-slate-600">{l.site}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold">
                        Logged
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Consumables &amp; Material Movement</h3>
          <div className="overflow-x-auto">
            <table className="enterprise-table w-full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Movement Details</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.stockTransactions.map(t => (
                  <tr key={t.id}>
                    <td className="font-bold text-slate-800">{t.item}</td>
                    <td className="font-mono text-slate-600">{t.note}</td>
                    <td className="font-mono text-slate-500">{t.date}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-mono font-bold">
                        Recorded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
