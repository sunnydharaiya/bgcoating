import React from 'react';
import {
  FileSpreadsheet,
  Layers,
  Flame,
  Paintbrush,
  Users,
  HardHat,
  Gauge,
  Printer,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Building2,
  Lock
} from 'lucide-react';

export default function ManpowerHub({ state, metrics, onNavigate, onApplyPreset }) {
  const {
    grandTotal,
    costPerM2,
    blastTotal,
    paintTotal,
    rawTotal,
    area,
    completionPct,
    formatCur,
    formatNum
  } = metrics;

  const industryPresets = [
    {
      title: 'Oil & Gas Storage Tank (20,000 m²)',
      desc: '3-Coat System: Zinc Silicate (75µm) + Epoxy MIO (125µm) + Aliphatic PU (60µm)',
      preset: {
        projectName: 'LPG / Crude Storage Tank Farm',
        customer: 'PetroChem Global Corp',
        location: 'Coastal Terminal Facility',
        area: 20000,
        tonnage: 450,
        months: 6,
        wdays: 26,
        shifts: 1,
        blastOutput: 55,
        paintOutput: 35,
        pCoats: 3,
        rawRows: [
          { name: 'Inorganic Zinc Silicate Primer', dft: 75, vs: 75, thinner: 5, loss: 25, paintPrice: 500, thinnerPrice: 150 },
          { name: 'Epoxy MIO Intermediate', dft: 125, vs: 80, thinner: 5, loss: 25, paintPrice: 400, thinnerPrice: 150 },
          { name: 'Polyurethane (Aliphatic PU)', dft: 60, vs: 60, thinner: 8, loss: 30, paintPrice: 650, thinnerPrice: 150 }
        ]
      }
    },
    {
      title: 'Marine Offshore Topsides (12,000 m²)',
      desc: 'Heavy C5-M Spec: Zinc Rich Epoxy + High Build Glass Flake + Polysiloxane',
      preset: {
        projectName: 'Offshore Wellhead Platform Rig 04',
        customer: 'Marine Energy Consortium',
        location: 'Offshore Basin Sector 7',
        area: 12000,
        tonnage: 850,
        months: 4,
        wdays: 26,
        shifts: 2,
        blastOutput: 45,
        paintOutput: 25,
        pCoats: 3,
        rawRows: [
          { name: 'Organic Zinc Rich Epoxy Primer', dft: 75, vs: 65, thinner: 5, loss: 25, paintPrice: 480, thinnerPrice: 150 },
          { name: 'Epoxy Glass Flake', dft: 300, vs: 90, thinner: 0, loss: 20, paintPrice: 650, thinnerPrice: 160 },
          { name: 'Polysiloxane (CUI Defense)', dft: 75, vs: 75, thinner: 5, loss: 20, paintPrice: 890, thinnerPrice: 180 }
        ]
      }
    },
    {
      title: 'Structural Steel Fabrication (30,000 m²)',
      desc: 'Shop Fabrication 2-Coat: Zinc Phosphate Primer + Epoxy High Build',
      preset: {
        projectName: 'Industrial Warehouse Steel Structure',
        customer: 'Steel Infrastructure Ltd',
        location: 'Fabrication Yard B',
        area: 30000,
        tonnage: 1200,
        months: 8,
        wdays: 26,
        shifts: 1,
        blastOutput: 70,
        paintOutput: 45,
        pCoats: 2,
        rawRows: [
          { name: 'Epoxy Zinc Phosphate Primer', dft: 60, vs: 65, thinner: 5, loss: 25, paintPrice: 420, thinnerPrice: 150 },
          { name: 'Epoxy High Build', dft: 125, vs: 85, thinner: 5, loss: 20, paintPrice: 450, thinnerPrice: 150 }
        ]
      }
    }
  ];

  const tools = [
    {
      id: 'project-info',
      title: '01. Project Information & Schedule',
      desc: 'Define scope, MOC, surface prep grade, schedule duration, shifts, output capacity, and tonnage take-off.',
      icon: Building2,
      color: 'from-amber-500/20 to-orange-500/20 text-orange-400 border-orange-500/30'
    },
    {
      id: 'blasting',
      title: '02. Blasting Cost Engine (A/B/C/D)',
      desc: 'Consumables (Grit/Diesel/PPE), Crew Labor, Equipment Hire (Compressor/Hopper), and Subcontractor Margin.',
      icon: Flame,
      color: 'from-red-500/20 to-amber-500/20 text-red-400 border-red-500/30'
    },
    {
      id: 'painting',
      title: '03. Paint Application Cost (A/B/C/D)',
      desc: 'Pass-by-pass spray painter crew, airless spray equipment, inspector, and indirect charges.',
      icon: Paintbrush,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'raw-material',
      title: '04. Paint Raw Material & QRef Library',
      desc: 'Theoretical & Practical spreading rate, DFT, Volume Solids, Thinner%, Loss%, with 18 common paint system presets.',
      icon: Layers,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'worker-ctc',
      title: '05. Individual Worker CTC Engine',
      desc: 'Fully loaded monthly liability: Wage, Overtime, PF (12.16%), Bonus (8.33%), Leave, PPE, and Camp costs.',
      icon: Users,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'abrasive-diesel',
      title: '06. Abrasive & Diesel Dynamics',
      desc: 'Surface scale condition matrix (Zero, Mild, Heavy, Very Heavy) for Garnet and Copper Slag media.',
      icon: Gauge,
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30'
    },
    {
      id: 'summary',
      title: '07. Front Page Consolidated Summary',
      desc: 'Complete project cost summary, surface finish comparison (Sa3 / Sa2.5 / Sa2 / Sweep), and validate/approval.',
      icon: FileSpreadsheet,
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30'
    },
    {
      id: 'register',
      title: '08. Report Register & Archive',
      desc: 'Local database snapshot persistence, search, column filters, edit/load, duplicate, and Excel export.',
      icon: HardHat,
      color: 'from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30'
    },
    {
      id: 'preview',
      title: '09. A4 Dossier Preview & Print',
      desc: 'MNC-grade 2-page quotation dossier with infographic dashboard, per-coat breakdown, and watermark protection.',
      icon: Printer,
      color: 'from-amber-600/20 to-orange-600/20 text-amber-300 border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#180900] via-[#381605] to-[#120500] border-2 border-[#E8700A]/40 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#E8700A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8700A]/20 border border-[#E8700A]/40 text-[#F5911F] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Module 05 · Enterprise Coating Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Painting Project Estimation <span className="text-[#F5911F]">— Manpower Based</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Industrial surface preparation and coating cost estimation engine. Computes fully-loaded crew rates, A/B/C/D category bifurcation, abrasive consumption grids, diesel fuel dynamics, and generates executive submission dossiers.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-black/40 border border-[#E8700A]/40 rounded-xl p-4 min-w-[220px] shrink-0 space-y-2 shadow-inner">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Grand Total</div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#F5911F]">
              {formatCur(grandTotal)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-slate-300">
              <span>Per m² Cost:</span>
              <span className="font-mono font-bold text-white">{formatCur(costPerM2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Completion:</span>
              <span className="font-mono font-bold text-emerald-400">{completionPct}%</span>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-xs font-bold text-[#F5911F] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            1-Click Industry Templates (Instant Sizing)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {industryPresets.map((ip, idx) => (
              <button
                key={idx}
                onClick={() => onApplyPreset(ip.preset)}
                className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E8700A]/50 transition duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#F5911F] transition flex items-center justify-between">
                    <span>{ip.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {ip.desc}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-amber-300/80">
                  Load Template →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Module Sections Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#E8700A]" />
          Estimation Sheets &amp; Engineering Engines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => onNavigate(t.id)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-[#E8700A]/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-lg border bg-gradient-to-br ${t.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E8700A] group-hover:translate-x-1 transition" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#E8700A] transition">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#E8700A]">
                  <span>Open Sheet</span>
                  <span className="font-mono">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
