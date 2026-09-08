// src/tools/painter/PainterHub.jsx
import React from 'react';
import { 
  ShieldCheck, 
  Paintbrush, 
  Layers, 
  FileText, 
  CheckSquare, 
  Camera, 
  Award, 
  FileSpreadsheet, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Activity,
  Sliders,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PAINTER_PRESETS } from '../../data/painterDatabase';

export default function PainterHub({
  onNavigate,
  onApplyPreset,
  reports = [],
  evaluation
}) {
  const { overall = 0, verdict = 'PENDING' } = evaluation || {};

  const totalReports = reports.length;
  const draftReports = reports.filter(r => r.status === 'Draft').length;
  const approvedReports = reports.filter(r => r.status === 'Approved').length;
  const passCount = reports.filter(r => r.verdict === 'PASS').length;
  const passRate = totalReports > 0 ? Math.round((passCount / totalReports) * 100) : 100;

  const cards = [
    {
      id: 'info',
      step: '01',
      title: 'Project & Painter Information',
      desc: 'Operator passport photo upload, project metadata, civil ID, and Coating System table specification.',
      icon: Paintbrush,
      badge: 'Step 1'
    },
    {
      id: 'train',
      step: '02',
      title: 'Training & Assessment Test',
      desc: '15-topic syllabus, 45-question Pre & Post test scores, and auto-calculated Improvement Index (Δ%).',
      icon: Layers,
      badge: 'Step 2'
    },
    {
      id: 'checklist',
      step: '03',
      title: 'Practical Assessment Checklist',
      desc: '13 critical assessment elements covering spray gun setup, pot life, stripe coating, and defect detection.',
      icon: CheckSquare,
      badge: 'Step 3'
    },
    {
      id: 's1',
      step: '04',
      title: 'Blasting & Primer Stage (s1)',
      desc: 'Substrate visual inspection, inorganic/organic zinc primer application, batch expiry check, and 4-mini-table DFT matrix.',
      icon: Sliders,
      badge: 'Baseline'
    },
    {
      id: 's2',
      step: '05',
      title: '1st Intermediate / Finish (s2)',
      desc: 'Epoxy intermediate coat, overcoating interval timing calculation, batch traceability, and cumulative DFT verification.',
      icon: Layers,
      badge: 'Stage 2'
    },
    {
      id: 's3',
      step: '06',
      title: '2nd Intermediate / Finish (s3)',
      desc: 'High-build epoxy layer, environmental psychrometric snapshot, inspection testing, and 24-spot DFT measurements.',
      icon: Layers,
      badge: 'Stage 3'
    },
    {
      id: 's4',
      step: '07',
      title: '3rd Finish Topcoat (s4)',
      desc: 'Polyurethane / acrylic topcoat, shade RAL verification, pot life monitoring, and final aesthetic finish inspection.',
      icon: Paintbrush,
      badge: 'Topcoat'
    },
    {
      id: 'photo',
      step: '08',
      title: 'Photographic Evidence Report',
      desc: '10-photo structured evidence grid with location tags, inspector initials, captions, and lightbox zoom.',
      icon: Camera,
      badge: 'Evidence'
    },
    {
      id: 'verdict',
      step: '09',
      title: 'Verdict & Signatory Approval',
      desc: 'Official qualification rubber-stamp, 6-tier criteria evaluation matrix, and 3 digital signatory stamp uploads.',
      icon: Award,
      badge: 'Final Sign-off'
    },
    {
      id: 'register',
      step: '10',
      title: 'Master Qualification Register',
      desc: 'Database of saved operator reports, multi-column search, stage sequence validation, and Excel/CSV export.',
      icon: FileSpreadsheet,
      badge: 'Register'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E2530] via-[#2A3340] to-[#14181F] text-white p-6 md:p-8 border border-slate-700 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E87B1E]/20 to-[#9E1B1E]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E87B1E]/20 border border-[#E87B1E]/40 text-[#F8C078] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F39322]" />
            Industrial Coating Applicator Standard · ASTM D 4228 / SSPC PA-2
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black font-rajdhani tracking-wide text-white leading-tight">
            Spray Painter Qualification Report <span className="text-[#F39322]">Management System</span>
          </h1>
          
          <p className="text-sm text-slate-300 leading-relaxed">
            Standardized end-to-end digital qualification workflow for industrial spray painting operators.
            Covers theoretical examinations (45 Qs), 13-point practical checklists, multi-coat application records (Primer, 1st, 2nd, 3rd coats),
            overcoating intervals, 4-mini-table DFT matrices (Plane, Pipe, T-Beam, Flange), photographic evidence, and official 3-signature approval.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Records</span>
              <div className="text-xl font-black font-mono text-white mt-0.5">{totalReports}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Drafts / In-Progress</span>
              <div className="text-xl font-black font-mono text-amber-400 mt-0.5">{draftReports}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Approved Reports</span>
              <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">{approvedReports}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Qualification Pass Rate</span>
              <div className="text-xl font-black font-mono text-[#F8C078] mt-0.5">{passRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* One-Click Industrial Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E87B1E]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              One-Click Industry Qualification Presets
            </h2>
          </div>
          <span className="text-xs text-slate-500">Auto-fills Coating System specifications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAINTER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-[#E87B1E]/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {preset.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{preset.standards}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#9E1B1E] transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {preset.description}
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                  Substrate: <span className="text-slate-700 font-medium">{preset.substrate}</span>
                </div>
              </div>

              <button
                onClick={() => onApplyPreset(preset)}
                className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:from-[#F39322] hover:to-[#A50021] transition shadow-xs cursor-pointer"
              >
                <span>Apply This Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section Jump Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E87B1E]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
              Qualification Workflow Steps
            </h2>
          </div>
          <span className="text-xs text-slate-500">Jump directly to any section</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate('painter-qualification', card.id)}
                className="text-left bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-[#E87B1E]/70 transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E87B1E]/10 to-[#9E1B1E]/10 text-[#9E1B1E] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#E87B1E]">{card.step}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#9E1B1E] transition-colors truncate">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {card.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
