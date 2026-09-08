import React from 'react';
import { 
  Calculator, 
  Coins, 
  Layers, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Flame, 
  Eye, 
  Printer, 
  FolderArchive,
  BarChart3
} from 'lucide-react';
import { UNIT_RATE_PRESETS, CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRateHub({ 
  formData, 
  onUpdateForm, 
  onNavigateSubTool, 
  onOpenPreview, 
  onOpenPrint,
  completionPct = 0,
  metrics = {}
}) {
  const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

  const handleApplyPreset = (preset) => {
    onUpdateForm(prev => ({
      ...prev,
      estNo: preset.estNo,
      projectName: preset.projectName,
      customer: preset.customer,
      location: preset.location,
      estimator: preset.estimator,
      currency: preset.currency,
      scope: { ...preset.scope },
      specs: [...preset.specs],
      dRows: JSON.parse(JSON.stringify(preset.dRows)),
      fRows: JSON.parse(JSON.stringify(preset.fRows))
    }));
    onNavigateSubTool('project-info');
  };

  const sections = [
    {
      id: 'project-info',
      title: '01. Project Information',
      desc: 'Project ID, client details, estimator credentials, specs & reference documents.',
      icon: Building2,
      badge: formData.projectName ? 'Defined' : 'Required',
      badgeColor: formData.projectName ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'scope',
      title: '02. Company Scope Matrix',
      desc: 'Execution boundaries across blasting, painting, insulation, fireproofing & special treatments.',
      icon: Layers,
      badge: 'Interactive',
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    {
      id: 'section-d',
      title: '03. Operating & Design Temp Data',
      desc: 'Process equipment, design temperatures, substrate alloy matrix and surface split.',
      icon: Flame,
      badge: `${formData.dRows?.length || 0} Components`,
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'section-f',
      title: '04. Coating System Design',
      desc: 'Paint coats build (Primer, Intermediate, Topcoat), VS%, DFT, and live spread rate sync.',
      icon: Calculator,
      badge: `${formData.fRows?.length || 0} Systems`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'cost-matrix',
      title: '05. Unit-Rate Estimation Table',
      desc: 'Itemized cost schedule: Blasting, Paint Material, Abrasives, Labour, Overheads & Margin.',
      icon: Coins,
      badge: `${currencyObj.sym} ${metrics.grandTotalFormatted || '0'}`,
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'revisions',
      title: '06. Revision History',
      desc: 'Engineering revision logs, sign-offs, dates, and verification records.',
      icon: FileText,
      badge: `Rev ${formData.revisions?.[formData.revisions.length - 1]?.rev || '0'}`,
      badgeColor: 'bg-slate-500/20 text-slate-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Donut Completion & Live Financial Metrics */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2E1408] via-[#3D1C0C] to-[#3A1608] p-6 rounded-2xl border border-[#E87B1E]/40 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#E87B1E]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F8C078] text-xs font-semibold font-mono uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F39322]" />
              Module 04 • Commercial &amp; Engineering Suite
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-rajdhani text-white tracking-wide uppercase">
              Quick Unit-Rate Estimation Suite
            </h1>
            <p className="text-xs md:text-sm text-white/75 max-w-2xl leading-relaxed">
              High-accuracy commercial unit-rate estimation engine with automated theoretical &amp; practical spread rates, abrasive media consumption, and comprehensive EPC commercial quotation dossiers.
            </p>
          </div>

          {/* KPI Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3 bg-black/40 border border-white/15 rounded-xl text-center">
              <span className="text-[10px] text-white/60 font-semibold uppercase block">Total Area</span>
              <span className="text-lg font-bold font-mono text-[#F8C078]">{metrics.totalArea?.toFixed(1) || '0.0'} m²</span>
            </div>
            <div className="p-3 bg-black/40 border border-white/15 rounded-xl text-center">
              <span className="text-[10px] text-white/60 font-semibold uppercase block">Cost / m²</span>
              <span className="text-lg font-bold font-mono text-[#4ADE80]">
                {currencyObj.sym} {metrics.costPerM2Formatted || '0'}
              </span>
            </div>
            <div className="p-3 bg-black/40 border border-white/15 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-white/60 font-semibold uppercase block">Grand Total Value</span>
              <span className="text-lg font-bold font-rajdhani text-white">
                {currencyObj.sym} {metrics.grandTotalFormatted || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Quick Strip */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="font-semibold text-white">Project Readiness:</span>
            <div className="w-32 bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#E87B1E] to-[#4ADE80] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[#F8C078]">{completionPct}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateSubTool('report-view')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              Financial Report
            </button>
            <button
              onClick={onOpenPreview}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Preview Modal
            </button>
            <button
              onClick={onOpenPrint}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white text-xs font-bold font-rajdhani uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:opacity-90 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Quotation
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Industry Standard Estimation Presets */}
      <div className="bg-white p-5 rounded-2xl border border-[#D8DEE5] shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <h2 className="text-sm font-bold font-rajdhani text-[#1B222C] uppercase tracking-wider">
              1-Click Industry Standard Estimation Presets
            </h2>
          </div>
          <span className="text-xs text-[#7E8B99]">Load sample BOQ &amp; commercial schedules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {UNIT_RATE_PRESETS.map((preset) => (
            <div 
              key={preset.id}
              className="p-4 rounded-xl bg-[#FAFBFC] hover:bg-[#FFF4E3]/40 border border-[#D8DEE5] hover:border-[#F3D2A0] transition duration-200 flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[#1B222C] group-hover:text-[#9E1B1E] transition">
                    {preset.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF4E3] text-[#A41E22] border border-[#F3D2A0] font-bold">
                    {preset.currency}
                  </span>
                </div>
                <p className="text-xs text-[#4E5B6A] line-clamp-2">
                  {preset.customer} • {preset.projectName}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-[#7E8B99] font-mono">
                  <span>{preset.dRows.length} Components</span>
                  <span>•</span>
                  <span>{preset.fRows.length} Coating Systems</span>
                </div>
              </div>

              <button
                onClick={() => handleApplyPreset(preset)}
                className="w-full py-2 px-3 rounded-lg bg-[#FFF4E3] hover:bg-[#FEE9C7] text-[#9E1B1E] font-semibold text-xs flex items-center justify-center gap-1.5 transition border border-[#F3D2A0] cursor-pointer"
              >
                <span>Apply Preset &amp; Start Estimation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Core Estimation Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              onClick={() => onNavigateSubTool(sec.id)}
              className="p-5 rounded-2xl bg-white hover:bg-[#FAFBFC] border border-[#D8DEE5] hover:border-[#F3D2A0] transition duration-200 cursor-pointer flex flex-col justify-between group shadow-[0_2px_8px_rgba(20,24,32,0.06)] hover:shadow-[0_6px_18px_rgba(20,24,32,0.08)]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4E3] border border-[#F3D2A0] flex items-center justify-center text-[#D97706] group-hover:bg-[#FEE9C7] transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F7F8FA] border border-[#CBD5E1] text-[#4E5B6A]">
                    {sec.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold font-rajdhani text-[#1B222C] group-hover:text-[#9E1B1E] transition mb-1 text-base">
                  {sec.title}
                </h3>
                <p className="text-xs text-[#4E5B6A] leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6E8EC] flex items-center justify-between text-xs text-[#D97706] font-semibold">
                <span>Configure Section</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
