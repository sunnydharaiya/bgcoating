import React from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Save,
  Check,
  Eye,
  Camera,
  Activity,
  Layers,
  Thermometer,
  Clock
} from 'lucide-react';

export default function BlasterFreezeBar({
  state,
  metrics,
  onReset,
  onNavigate,
  activeTab
}) {
  const { totalProgress, stepCompletions, verdict, verdictBadgeClass } = metrics;

  const chips = [
    { id: 'info', label: 'Project & Operator', pct: stepCompletions.info },
    { id: 'train', label: 'Training & Test', pct: stepCompletions.train },
    { id: 'checklist', label: 'Checklist', pct: stepCompletions.checklist },
    { id: 'blasting', label: 'Blasting Process', pct: stepCompletions.blasting },
    { id: 'photo', label: 'Photo Report', pct: stepCompletions.photo },
    { id: 'verdict', label: 'Verdict & Approval', pct: stepCompletions.verdict },
  ];

  // SVG Circle parameters
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalProgress / 100) * circumference;

  return (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-[#E8700A] shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Title, Progress Bar, & Section Chips */}
        <div className="flex-1 min-w-0 w-full md:w-auto">
          
          {/* Progress Header Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#E8700A]/10 text-[#E8700A]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Operator Qualification Workflow
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Verdict Indicator Tag */}
              <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider ${
                verdict === 'PASS' 
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40' 
                  : verdict === 'FAIL'
                  ? 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/40'
                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
              }`}>
                {verdict === 'PASS' ? '✓ QUALIFIED' : verdict === 'FAIL' ? '✗ NOT MET' : '⏳ IN PROGRESS'}
              </span>

              {/* Active Tab Pill */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 uppercase">
                <Clock className="w-3 h-3 text-[#E8700A]" />
                <span>{activeTab?.toUpperCase() || 'HUB'}</span>
              </span>
            </div>
          </div>

          {/* Continuous Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#F5911F] via-[#E8700A] to-[#B83400] transition-all duration-500 shadow-sm"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          {/* Section Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {chips.map((c) => {
              const isDone = c.pct >= 100;
              const isActive = activeTab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onNavigate(c.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#E8700A] text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`text-[9px] font-mono px-1 rounded-full ${
                    isActive ? 'bg-white/30 text-white' : isDone ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {c.pct}%
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right: SVG Completion Donut & Quick Reset */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Donut Chart */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 70 70">
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                strokeWidth="6"
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-[#E8700A] fill-none transition-all duration-500"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[12px] font-black text-slate-900 dark:text-white font-mono leading-none">
                {totalProgress}%
              </span>
              <span className="text-[7.5px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Done
              </span>
            </div>
          </div>

          {/* Reset Action Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-900 transition cursor-pointer"
            title="Reset All Qualification Fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>

        </div>

      </div>
    </div>
  );
}
