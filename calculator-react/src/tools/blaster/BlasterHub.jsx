import React from 'react';
import {
  Award,
  Sparkles,
  Layers,
  Thermometer,
  Camera,
  CheckCircle2,
  FileSpreadsheet,
  HardHat,
  Printer,
  ShieldCheck,
  Building2,
  TrendingUp,
  Flame,
  ArrowRight,
  BookOpen,
  UserCheck
} from 'lucide-react';

export default function BlasterHub({
  state,
  metrics,
  reports = [],
  onNavigate,
  onApplyPreset,
  onNewGeneration
}) {
  const { totalProgress, verdict, overallScore, stepCompletions } = metrics;

  const totalCount = reports.length || 1;
  const draftCount = reports.filter(r => r.status === 'Draft').length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length || 1;
  const passCount = reports.filter(r => r.verdict === 'PASS').length || 1;

  const templates = [
    {
      title: 'Offshore Topsides Blaster',
      desc: 'ISO 8501 Sa 2.5 Near-White with Garnet 30/60 media on heavy wall process piping.',
      category: 'Blaster',
      refStd: 'ASTM D4228, ISO 8501-1, SSPC-AB 1',
      spMethod: 'Abrasive Blasting',
      abType: 'Garnet',
      abMesh: 'GMA 30/60 Mesh',
      spProfReq: '50-75 µm',
      spStdReq: 'SA 2.5',
      coatingSystem: 'Zinc Ethyl Silicate Primer + High Build Epoxy + Aliphatic Polyurethane'
    },
    {
      title: 'Storage Tank Abrasive Operator',
      desc: 'High-throughput internal storage tank lining preparation with Copper Slag.',
      category: 'Blaster',
      refStd: 'API 650, ISO 8501-1, SSPC VIS 1',
      spMethod: 'Abrasive Blasting',
      abType: 'Copper Slag',
      abMesh: 'G14 Slag',
      spProfReq: '60-85 µm',
      spStdReq: 'SA 2.5',
      coatingSystem: 'Glass Flake Vinyl Ester / 100% Volume Solids Novolac Epoxy'
    },
    {
      title: 'Structural Steel Blast Technician',
      desc: 'Severe industrial atmospheric structural steelwork using recyclable Steel Grit.',
      category: 'Blaster',
      refStd: 'ISO 12944-5 C5-M, ISO 8501-1 Sa 3',
      spMethod: 'Abrasive Blasting',
      abType: 'Steel Grit / Shot',
      abMesh: 'GL-25 / G40',
      spProfReq: '75-100 µm',
      spStdReq: 'SA 3',
      coatingSystem: 'Hot Dip Galvanizing / Thermal Spray Aluminum (TSA) + Sealer'
    }
  ];

  const sections = [
    { id: 'dashboard', title: 'Analytics Dashboard', desc: 'Real-time KPI metrics, pre vs post training chart, and compliance donut.', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { id: 'info', title: '01. Project & Operator', desc: 'Operator photograph, identification particulars, client and EPC metadata.', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { id: 'train', title: '02. Training & Test', desc: '15 training modules, 25-question Pre/Post assessment, and improvement index.', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { id: 'checklist', title: '03. Assessment Checklist', desc: '12 critical skill evaluation points with Pass/Fail/NA scoring logic.', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { id: 'blasting', title: '04. Blasting Process', desc: 'Environmental Dew Point monitoring, surface profile averaging, and inspection tests.', icon: Thermometer, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { id: 'photo', title: '05. Photo Report', desc: '6-slot photographic evidence report with location, date, and inspector initial tags.', icon: Camera, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
    { id: 'verdict', title: '06. Verdict & Approval', desc: 'Weighted score calculation, rubber stamp verdict, and 3-signatory authorization.', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
    { id: 'summary', title: '07. Executive Summary', desc: 'Auto-compiled narrative summary, scope, key findings, and recommendations.', icon: FileSpreadsheet, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30' },
    { id: 'register', title: '08. Reports Register', desc: 'Historical qualification registry with search, column filter, and CSV/Excel export.', icon: HardHat, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#180900] via-[#2E1408] to-[#180900] text-white p-6 sm:p-8 border border-[#E8700A]/40 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#F5911F]/15 to-transparent blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8700A]/20 border border-[#E8700A]/40 text-[#F5911F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Management System · Module 06</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-rajdhani">
            Blaster / Operator Qualification &amp; <span className="text-[#F5911F]">Digital Reporting</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Enterprise-grade qualification platform with real-time compliance logic (ISO 8501 / SSPC / NACE / AMPP),
            psychrometric dew-point analysis, 5-point replica tape profile measurement, Pre/Post test delta,
            and MNC-grade 3-page printable dossiers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('info')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5911F] to-[#E8700A] text-white text-xs font-bold shadow-lg hover:shadow-[#E8700A]/30 transition cursor-pointer"
            >
              <span>🚀 Start New Qualification</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-[#F5911F]" />
              <span>View Analytics Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('register')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition cursor-pointer"
            >
              <HardHat className="w-4 h-4 text-[#F5911F]" />
              <span>Open Reports Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Reports</div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">{totalCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Saved qualification records</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Draft Reports</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">{draftCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Work-in-progress evaluations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Approved Reports</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Validated &amp; signed dossiers</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Pass Rate</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
            {totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 100}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Meeting all ISO/SSPC criteria</div>
        </div>

      </div>

      {/* 1-Click Industry Qualification Templates */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E8700A]" />
              <span>1-Click Industry Qualification Presets</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auto-fill standard blasting abrasive media, profile targets, and coating specification setups.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tpl, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#E8700A] transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#E8700A]/10 text-[#E8700A]">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{tpl.abType}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tpl.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tpl.desc}</p>
                <div className="text-[10.5px] font-mono text-slate-600 dark:text-slate-300 pt-1">
                  Req: <span className="font-bold text-[#E8700A]">{tpl.spStdReq}</span> · Target: <span className="font-bold">{tpl.spProfReq}</span>
                </div>
              </div>

              <button
                onClick={() => onApplyPreset(tpl)}
                className="w-full py-1.5 rounded-lg border border-[#E8700A] text-[#E8700A] hover:bg-[#E8700A] hover:text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Load Preset Setup
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Module Sections Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#E8700A]" />
          <span>Qualification Sections &amp; Tools</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#E8700A] hover:shadow-md transition cursor-pointer flex items-start gap-3.5 group"
              >
                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#E8700A] transition truncate">
                      {s.title}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
