import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ContractorManagementPage() {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const contractors = [
    {
      id: 'VEN-BG-101',
      name: 'L&T Hydrocarbon Engineering Ltd.',
      tier: 'Tier 1 Prime',
      status: 'Active / Approved',
      safetyScore: '99.2%',
      qualityCompliance: '98.5%',
      certifiedWorkforce: 48,
      activeSites: 'Hazira Offshore Yard, Mumbai High, Kochi Refinery',
      isoCerts: 'ISO 9001, ISO 14001, ISO 45001, AMPP QP-1'
    },
    {
      id: 'VEN-BG-102',
      name: 'Afcons Infrastructure Marine Coating Div.',
      tier: 'Tier 1 Prime',
      status: 'Active / Approved',
      safetyScore: '97.8%',
      qualityCompliance: '96.4%',
      certifiedWorkforce: 34,
      activeSites: 'Mundra Port Tank Farm, Dahej Jetty',
      isoCerts: 'ISO 9001, ISO 45001, FROSIO Certified Applicator'
    },
    {
      id: 'VEN-BG-103',
      name: 'Gujarat Petrochem Protective Services',
      tier: 'Tier 2 Approved',
      status: 'Active / Approved',
      safetyScore: '95.1%',
      qualityCompliance: '94.0%',
      certifiedWorkforce: 18,
      activeSites: 'Vadodara Chemical Plant, Surat Terminal',
      isoCerts: 'ISO 9001, SSPC Member'
    },
    {
      id: 'VEN-BG-104',
      name: 'Apex Corrosion Control & TSA Systems',
      tier: 'Tier 2 Approved',
      status: 'Under Annual Audit',
      safetyScore: '93.5%',
      qualityCompliance: '92.1%',
      certifiedWorkforce: 12,
      activeSites: 'Jamnagar Flare Header Spools',
      isoCerts: 'ISO 9001'
    }
  ];

  const filteredContractors = contractors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || c.tier.toLowerCase().includes(filterTier.toLowerCase());
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Management Module 11 · Contractor Management (CMS)
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Coating Contractor Management &amp; Prequalification
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Vendor prequalification directory, certified operator rosters (OQR/PQR/TSA), safety indices, and site contract allocations.
          </p>
        </div>

        <button
          onClick={() => addToast('Prequalification Initiated', 'Vendor onboarding form opened.', 'info')}
          className="px-4 py-2 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 text-white font-bold font-rajdhani uppercase tracking-wider rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Prequalify New Contractor</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-1">
          <span className="text-[10px] font-mono text-[#7E8B99] uppercase tracking-wider block font-bold">Approved Contractors</span>
          <div className="text-3xl font-extrabold text-[#1B222C] font-rajdhani">24</div>
          <p className="text-xs text-[#2E7D32] font-mono font-bold">✓ 18 Active on Site</p>
        </div>

        <div className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-1">
          <span className="text-[10px] font-mono text-[#7E8B99] uppercase tracking-wider block font-bold">Certified Workforce</span>
          <div className="text-3xl font-extrabold text-[#1B222C] font-rajdhani">312</div>
          <p className="text-xs text-[#E87B1E] font-mono font-bold">Blasters, Painters &amp; TSA</p>
        </div>

        <div className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-1">
          <span className="text-[10px] font-mono text-[#7E8B99] uppercase tracking-wider block font-bold">Avg Quality Compliance</span>
          <div className="text-3xl font-extrabold text-[#1B222C] font-rajdhani">96.8%</div>
          <p className="text-xs text-[#2E7D32] font-mono font-bold">SSPC-PA 2 Verified</p>
        </div>

        <div className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-1">
          <span className="text-[10px] font-mono text-[#7E8B99] uppercase tracking-wider block font-bold">Site Safety Index</span>
          <div className="text-3xl font-extrabold text-[#1B222C] font-rajdhani">98.4%</div>
          <p className="text-xs text-[#2E7D32] font-mono font-bold">Zero Lost-Time Incidents</p>
        </div>
      </div>

      {/* Contractors Table View */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E8EC] pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wider">Registered Vendor Directory</h3>
            <p className="text-xs text-[#7E8B99] font-sans">Prequalified industrial painting &amp; blasting contractors.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search contractor or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#FFF9EE] border border-[#E6B878] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#8B3A00] placeholder-[#8B3A00]/50 w-52 focus:outline-none focus:ring-2 focus:ring-[#E87B1E] font-mono"
              />
            </div>

            <select
              value={filterTier}
              onChange={e => setFilterTier(e.target.value)}
              className="bg-[#F7F8FA] border border-[#D8DEE5] text-[#4E5B6A] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="tier 1">Tier 1 Prime</option>
              <option value="tier 2">Tier 2 Approved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Vendor Code</th>
                <th>Contractor Name</th>
                <th>Prequal Tier</th>
                <th>Safety Index</th>
                <th>Quality Compliance</th>
                <th>Qualified Crew</th>
                <th>Active Sites</th>
              </tr>
            </thead>
            <tbody>
              {filteredContractors.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-[#E87B1E]">{c.id}</td>
                  <td className="font-bold text-[#1B222C]">{c.name}</td>
                  <td>
                    <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                      {c.tier}
                    </span>
                  </td>
                  <td className="font-mono font-bold text-[#2E7D32]">{c.safetyScore}</td>
                  <td className="font-mono font-bold text-[#1B222C]">{c.qualityCompliance}</td>
                  <td className="font-mono text-[#4E5B6A]">{c.certifiedWorkforce} Operators</td>
                  <td className="text-[#4E5B6A] text-[11px] max-w-xs truncate">{c.activeSites}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
