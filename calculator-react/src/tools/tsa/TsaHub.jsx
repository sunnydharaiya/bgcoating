import React from 'react';
import { 
  Flame, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Layers, 
  Camera, 
  Award, 
  FileSpreadsheet, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  FolderOpen,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Zap
} from 'lucide-react';
import { TSA_PRESETS } from '../../data/tsaDatabase';

export default function TsaHub({
  reports = [],
  evaluation,
  onNavigate,
  onLoadPreset,
  onNewReport
}) {
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const passCount = reports.filter(r => r.verdict === 'PASS').length;
  const passRate = reports.length > 0 ? Math.round((passCount / reports.length) * 100) : 100;
  const avgScore = reports.length > 0
    ? (reports.reduce((acc, r) => acc + (r.overall || 0), 0) / reports.length).toFixed(1)
    : '98.5';

  const SECTIONS = [
    {
      id: 'project-info',
      title: '01. Project & Scope',
      desc: 'Operator portrait photo, project/client details, coating system table, and 10 Thermal Spray material specifications.',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      badge: `${Math.round(evaluation?.stageProgress?.info || 0)}% Complete`
    },
    {
      id: 'checklist',
      title: '02. Assessment Checklist',
      desc: '12 Practical Thermal Spray competency elements per AWS C2.23M / ISO 2063-2 standards.',
      icon: CheckSquare,
      color: 'from-blue-500 to-indigo-600',
      badge: `${Math.round(evaluation?.stageProgress?.checklist || 0)}% Pass`
    },
    {
      id: 's1',
      title: '03. Blasting + TSA',
      desc: 'Stage 1 Thermal Spray Aluminum record with multi-hour psychrometrics, 9 application parameters, 6 tests, and 4-mini-table DFT matrix.',
      icon: Flame,
      color: 'from-red-500 to-amber-600',
      badge: `${Math.round(evaluation?.stageProgress?.s1 || 0)}% Logged`
    },
    {
      id: 's2',
      title: '04. 1st Coat / Sealer',
      desc: 'High-temperature silicone aluminum or tie-coat sealer application, WFT/DFT inspection, and batch traceability.',
      icon: Layers,
      color: 'from-orange-500 to-amber-600',
      badge: `${Math.round(evaluation?.stageProgress?.s2 || 0)}% Logged`
    },
    {
      id: 's3',
      title: '05. 2nd Coat (Optional)',
      desc: 'Intermediate epoxy barrier coat stage with complete process parameters and SSPC PA-2 DFT spot matrix.',
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      badge: `${Math.round(evaluation?.stageProgress?.s3 || 0)}% Logged`
    },
    {
      id: 's4',
      title: '06. 3rd Coat (Topcoat)',
      desc: 'Finish polyurethane / polysiloxane topcoat stage with batch expiry verification and color shade verification.',
      icon: Layers,
      color: 'from-emerald-500 to-teal-600',
      badge: `${Math.round(evaluation?.stageProgress?.s4 || 0)}% Logged`
    },
    {
      id: 'photo',
      title: '07. Photo Report',
      desc: 'Evidence photographs with title tags, dates, location tags, captions, and lightbox inspection.',
      icon: Camera,
      color: 'from-purple-500 to-pink-600',
      badge: `${Math.round(evaluation?.stageProgress?.photo || 0)}% Uploaded`
    },
    {
      id: 'verdict',
      title: '08. Verdict & Approval',
      desc: '4-tier weighted evaluation matrix, rubber stamp emblem, and 3 digital signatory endorsement blocks.',
      icon: Award,
      color: 'from-emerald-500 to-green-600',
      badge: evaluation?.verdict || 'PENDING'
    },
    {
      id: 'summary',
      title: '09. Executive Summary',
      desc: 'Executive narrative, quantitative score breakdown, certificate validity, and clipboard export.',
      icon: FileSpreadsheet,
      color: 'from-slate-600 to-slate-800',
      badge: 'Auto-Compiled'
    },
    {
      id: 'register',
      title: '10. Master Register',
      desc: 'Saved qualification records repository with stage sequence verification, search, and CSV export.',
      icon: FolderOpen,
      color: 'from-blue-600 to-cyan-700',
      badge: `${reports.length} Records`
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14181F] via-[#2A3340] to-[#14181F] text-white p-6 sm:p-8 border border-slate-700/50 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#E87B1E]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E87B1E]/20 border border-[#E87B1E]/40 text-[#F39322] text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>AWS C2.23M · NACE No.12 · ISO 2063-2 · SSPC-CS 23.00</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            TSA Operator Qualification <span className="text-[#F39322]">Digital Hub</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Standardized digital qualification management system for Twin-Wire Arc Thermal Spray Aluminium (TSA) applicators, featuring multi-hour psychrometrics, 19-test coating inspection catalogs, and SSPC PA-2 4-mini-table DFT matrices.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onNavigate?.('project-info')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white font-bold text-sm shadow-lg shadow-[#E87B1E]/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Qualification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate?.('register')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>Report Register ({reports.length})</span>
            </button>
            <button
              onClick={() => onNavigate?.('preview')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
            <FolderOpen className="w-4 h-4 text-[#E87B1E]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 font-mono">
            {reports.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">In master register</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Reports</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {approvedCount}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Fully endorsed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {passRate}%
          </div>
          <span className="text-[11px] text-slate-500 font-medium">≥80.0% qualification</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-2 font-mono">
            {avgScore}%
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Weighted average</span>
        </div>
      </div>

      {/* 1-Click Industry Presets */}
      <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border border-[#E87B1E]/20 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E87B1E]" />
              <span>One-Click Industry TSA Presets</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select an offshore, refinery, or subsea specification template to prefill parameters and coating tables.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TSA_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-[#E87B1E] transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FDF1E6] dark:bg-[#E87B1E]/20 text-[#E87B1E]">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {preset.system.length} Coats
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mt-2 text-sm">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {preset.spec} · {preset.surfPrep}
                </p>
              </div>

              <button
                onClick={() => onLoadPreset?.(preset)}
                className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-[#E87B1E] group-hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Workflow Section Jump Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Qualification Workflow Sections
            </h2>
            <p className="text-xs text-slate-500">
              Progressive steps for capturing operator credentials, multi-hour spray trials, inspection results, and approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                onClick={() => onNavigate?.(sec.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-[#E87B1E]/60 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {sec.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mt-3 group-hover:text-[#E87B1E] transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#E87B1E]">
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
