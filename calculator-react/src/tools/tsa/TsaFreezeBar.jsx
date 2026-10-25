import React from 'react';
import { 
  Flame, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function TsaFreezeBar({
  currentSubTool = 'hub',
  evaluation,
  formData,
  onNavigate,
  onReset
}) {
  const completion = Math.min(100, Math.max(0, Math.round(evaluation?.completionPct || 0)));
  const verdict = evaluation?.verdict || 'PENDING';
  const overall = (evaluation?.overall || 0).toFixed(1);

  const STAGES = [
    { id: 'info', label: '01. Info & TSA Specs', progress: evaluation?.stageProgress?.info || 0 },
    { id: 'checklist', label: '02. Checklist', progress: evaluation?.stageProgress?.checklist || 0 },
    { id: 's1', label: '03. Blasting + TSA', progress: evaluation?.stageProgress?.s1 || 0 },
    { id: 's2', label: '04. Sealer Coat', progress: evaluation?.stageProgress?.s2 || 0 },
    { id: 's3', label: '05. 2nd Coat', progress: evaluation?.stageProgress?.s3 || 0 },
    { id: 's4', label: '06. 3rd Coat', progress: evaluation?.stageProgress?.s4 || 0 },
    { id: 'photo', label: '07. Photo Report', progress: evaluation?.stageProgress?.photo || 0 },
    { id: 'verdict', label: '08. Verdict & Sign', progress: evaluation?.stageProgress?.verdict || 0 }
  ];

  // SVG Donut metrics
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  return (
    <div className="sticky top-14 md:top-15 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-3.5 transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Tool Title & Stage Indicator */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#9E1B1E] via-[#E87B1E] to-[#F39322] flex items-center justify-center text-white shadow-md shadow-[#E87B1E]/20 shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FDF1E6] dark:bg-[#E87B1E]/10 text-[#E87B1E] border border-[#E87B1E]/20 uppercase tracking-wider">
                Module 08 · Twin Wire Arc
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                {formData?.['f-rep-no'] || 'DRAFT-IN-PROGRESS'}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-snug">
              <span>TSA Operator Qualification</span>
              <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                ({formData?.['f-name'] || 'Operator'})
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Stage Progress Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {STAGES.map((s) => {
            const isActive = currentSubTool === s.id || (currentSubTool === 'project-info' && s.id === 'info') || (currentSubTool?.startsWith('coat-stage') && currentSubTool.includes(s.id));
            const isDone = s.progress >= 100;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate?.(s.id === 'info' ? 'project-info' : s.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {Math.round(s.progress)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: SVG Donut, Overall Score & Reset Action */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100 dark:border-slate-800">
          
          {/* Animated Donut */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700 fill-none"
                strokeWidth="5"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-[#E87B1E] fill-none transition-all duration-500 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                {completion}%
              </span>
            </div>
          </div>

          {/* Live Verdict Pill */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Score: {overall}%
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-xs ${
                verdict === 'PASS'
                  ? 'bg-emerald-500 text-white'
                  : verdict === 'FAIL'
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {verdict === 'PASS' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : verdict === 'FAIL' ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                <span>{verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'FAIL' : 'IN PROGRESS'}</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              AWS C2.23M / ISO 2063-2
            </span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Reset All Qualification Fields"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
