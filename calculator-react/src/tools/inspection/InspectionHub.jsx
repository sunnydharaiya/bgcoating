// src/tools/inspection/InspectionHub.jsx
import React from 'react';
import { 
  FileCheck2, 
  Layers, 
  ThermometerSun, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  History, 
  FileSpreadsheet, 
  Printer, 
  Building2, 
  ArrowRight,
  Zap,
  Hammer,
  Maximize2
} from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../data/inspectionDatabase';

export default function InspectionHub({
  state,
  onNavigate,
  onApplyPreset,
  onOpenCompany,
  onOpenPreview
}) {
  // Compute high-level summary KPIs
  const stagesCount = Object.keys(state.stages || {}).length;
  
  // Weather compliance check across all stages
  let totalMonitoredHours = 0;
  let passedHours = 0;
  Object.values(state.stages || {}).forEach(stage => {
    (stage.weatherSlots || []).forEach(slot => {
      if (slot.dryC && slot.wetC) {
        totalMonitoredHours++;
        // Check simple logic
        const dry = parseFloat(slot.dryC);
        const wet = parseFloat(slot.wetC);
        const metal = parseFloat(slot.metalC);
        if (!isNaN(dry) && !isNaN(wet)) {
          // simplified dew point check
          const Ew = 6.112 * Math.exp((17.502 * wet) / (240.97 + wet));
          const Ed = 6.112 * Math.exp((17.502 * dry) / (240.97 + dry));
          const E = Ew - 0.00066 * (1 + 0.00115 * wet) * 1013.25 * (dry - wet);
          const rh = (E / Ed) * 100;
          const logE = Math.log(Math.max(0.001, E) / 6.112);
          const dp = (240.97 * logE) / (17.502 - logE);
          const diff = metal - dp;
          if (rh <= 85.0 && (isNaN(metal) || diff >= 3.0)) {
            passedHours++;
          }
        }
      }
    });
  });

  const weatherCompliancePct = totalMonitoredHours > 0 
    ? Math.round((passedHours / totalMonitoredHours) * 100) 
    : 100;

  // Active defects count
  const openDefects = (state.reworkLog || []).filter(r => r.status !== 'Closed').length;

  // Adhesion pull-off average
  const dollies = state.pullOffAdhesion?.dollies || [];
  const meanPullOff = dollies.length > 0
    ? (dollies.reduce((sum, d) => sum + (parseFloat(d.pressureMpa) || 0), 0) / dollies.length).toFixed(1)
    : '0.0';

  const isPullOffPass = parseFloat(meanPullOff) >= (state.pullOffAdhesion?.specifiedTargetMpa || 8.0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Hero Executive Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Digital QA/QC System · ISO 8501-1 & SSPC-PA 2 Standard
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Coating Inspection, Adhesion &amp; Photo Reporting
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Industrial digital QA/QC recording suite for surface preparation, 24-hour psychrometric weather tracking, multi-coat DFT distributions, ASTM D4541 hydraulic pull-off adhesion, and photo evidence reporting.
            </p>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('s1')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                Start Blasting &amp; Priming (s1)
              </button>
              <button
                onClick={() => onNavigate('pull')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Pull-Off Adhesion
              </button>
              <button
                onClick={() => onNavigate('photo')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-sky-400" />
                Photo Report
              </button>
              <button
                onClick={onOpenPreview}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                Preview Dossier
              </button>
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0 lg:w-80">
            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Weather Compliance</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {weatherCompliancePct}%
              </div>
              <span className="text-[10px] text-slate-400">ΔT ≥ 3°C &amp; RH ≤ 85%</span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Mean Adhesion</span>
              <div className={`text-2xl font-black font-mono mt-0.5 ${isPullOffPass ? 'text-amber-400' : 'text-red-400'}`}>
                {meanPullOff} <span className="text-xs font-normal">MPa</span>
              </div>
              <span className="text-[10px] text-slate-400">Target: ≥ {state.pullOffAdhesion?.specifiedTargetMpa || 8} MPa</span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Inspection Stages</span>
              <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">
                {stagesCount} <span className="text-xs font-normal">Active</span>
              </div>
              <span className="text-[10px] text-slate-400">s1, s2, s3, s4</span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Open Defect NCRs</span>
              <div className={`text-2xl font-black font-mono mt-0.5 ${openDefects > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                {openDefects}
              </div>
              <span className="text-[10px] text-slate-400">Rework Register</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 1-Click Industry Presets Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              1-Click Industry Coating System Presets
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Instantly load standardized industrial specs &amp; paint systems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INDUSTRY_PRESETS.map((preset) => (
            <div 
              key={preset.id}
              className="group border border-slate-200 hover:border-amber-400 rounded-2xl p-4 transition-all duration-200 hover:shadow-md bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {preset.systemNDFT} µm NDFT
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {Object.keys(preset.stages).length} Stages
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-amber-600 transition">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => onApplyPreset(preset)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 group-hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply Preset Specs
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Section Grid Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Inspection Workspaces &amp; Analytical Suites
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Click to navigate directly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Blasting & Priming (s1) */}
          <div 
            onClick={() => onNavigate('s1')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition">
                  <Hammer className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  STAGE s1
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-amber-600 transition">
                01. Blasting &amp; Priming (B&amp;P)
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Surface profile ($R_z$), Sa 2.5 cleanliness, dust tape, Bresle salt test, 24-hr weather monitoring, and primer SSPC-PA 2 DFT spot grid.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Open Stage Sheet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 1st Intermediate Coat (s2) */}
          <div 
            onClick={() => onNavigate('s2')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  STAGE s2
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-orange-600 transition">
                02. 1st Intermediate / Finish Coat
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Inter-coat window verification, epoxy MIO application parameters, WFT checks, batch expiry tracking, and cumulative DFT build-up.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
              <span>Open Stage Sheet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 2nd & 3rd Coat Stages (s3 / s4) */}
          <div 
            onClick={() => onNavigate('s3')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-105 transition">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  STAGE s3 / s4
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-sky-600 transition">
                03. 2nd &amp; 3rd Topcoat Stages
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Aliphatic polyurethane UV finish, high-voltage spark / holiday testing (NACE SP0188), gloss verification, and final multi-point sign-off.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
              <span>Open Stage Sheet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: 5-Column Photographic Report */}
          <div 
            onClick={() => onNavigate('photo')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-sky-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-105 transition">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  EVIDENCE
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-sky-600 transition">
                04. Photographic Evidence Grid
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                5-Column high-definition photographic report with automatic thumbnail resizing (≤50KB), lightbox modal zoom, comments, and verdicts.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
              <span>Open Photo Grid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Pull-Off Adhesion Suite */}
          <div 
            onClick={() => onNavigate('pull')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-emerald-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ASTM D4541
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-emerald-600 transition">
                05. Pull-Off Adhesion Test Report
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Hydraulic dolly adhesion recording (20mm/50mm), tensile strength (MPa &amp; psi), failure mode breakdown (% cohesive/adhesive), and conclusion matrix.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Open Pull-Off Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Cross-Cut Adhesion Suite */}
          <div 
            onClick={() => onNavigate('cross')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-violet-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 group-hover:scale-105 transition">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                  ASTM D3359
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-violet-600 transition">
                06. Cross-Cut Tape Adhesion Report
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Cross-hatch lattice blade tape test (1mm/2mm/3mm spacing), ISO 2409 / ASTM D3359 rating classification (0B–5B), and flaking percentage.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600">
              <span>Open Cross-Cut Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: Rework & NCR Register (PRO) */}
          <div 
            onClick={() => onNavigate('rwkreg')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-orange-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  PRO WORKFLOW
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-orange-600 transition">
                07. Non-Conformance &amp; Rework Register
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Track defects (runs, low DFT, pinholes, blisters), root causes, before/after photo evidence, and full lifecycle sign-off (Open → Rectified → Closed).
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
              <span>Open Rework Log</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 8: Executive Analytics Dashboard (PRO) */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  ANALYTICS PRO
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition">
                08. Executive Performance Center
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Visual compliance analytics, pass/fail trends, psychrometric condition tracking, DFT distributions, and defect frequency breakdown.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>View BI Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 9: Report Register & Output */}
          <div 
            onClick={() => onNavigate('report_register')}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-slate-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-105 transition">
                  <History className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  STORAGE
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-slate-900 transition">
                09. Inspection Reports Register
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage saved inspections in localStorage, search &amp; filter by stage, duplicate records, export to CSV/Excel, and generate print dossiers.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Open Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
