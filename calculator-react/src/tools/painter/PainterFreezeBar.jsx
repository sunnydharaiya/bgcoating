// src/tools/painter/PainterFreezeBar.jsx
import React from 'react';
import { RotateCcw, Award, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { WORKFLOW, WF_LABELS } from '../../data/painterDatabase';

export default function PainterFreezeBar({
  currentSubTool,
  onNavigate,
  onReset,
  evaluation,
  formData
}) {
  const { stageProgress = {}, overallProgress = 0, verdict = 'PENDING' } = evaluation || {};

  // Stage mapping for 9 workflow stages
  const stageMap = {
    info: 1,
    train: 2,
    checklist: 3,
    s1: 4,
    s2: 5,
    s3: 6,
    s4: 7,
    photo: 8,
    verdict: 9
  };

  const currentStageNum = stageMap[currentSubTool] || (currentSubTool === 'hub' ? 'OVERVIEW' : 1);

  // SVG Circular Donut calculations (radius 28, stroke-dasharray = 2 * PI * 28 = 175.93)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-[#E87B1E] shadow-md px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Overall Completion Donut + Title & Stage Badge */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          {/* Animated Donut Gauge */}
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-slate-200 stroke-current"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-[#E87B1E] stroke-current transition-all duration-500 ease-out"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-black text-slate-800 font-mono leading-none">
                {overallProgress}%
              </span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                Prog
              </span>
            </div>
          </div>

          {/* Workflow Stage Label & Status */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 font-rajdhani truncate">
                Spray Painter Qualification Report
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#E87B1E]/10 text-[#9E1B1E] border border-[#E87B1E]/30 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87B1E] animate-pulse" />
                STAGE {currentStageNum} OF 9
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Operator: <span className="font-semibold text-slate-700">{formData?.['f-name'] || 'Unassigned'}</span> · Report: <span className="font-mono text-slate-600">{formData?.['f-rep-no'] || 'Draft'}</span>
            </p>
          </div>
        </div>

        {/* Right: Section Navigation Chips + Verdict + Reset */}
        <div className="flex flex-wrap items-center gap-1.5 justify-end w-full md:w-auto">
          {WORKFLOW.map((secKey, idx) => {
            const isCurrent = currentSubTool === secKey;
            const pct = stageProgress[secKey] || 0;
            const isComplete = pct >= 100;

            return (
              <button
                key={secKey}
                onClick={() => onNavigate('painter-qualification', secKey)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs scale-102 ring-2 ring-[#E87B1E]/30'
                    : isComplete
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
                title={WF_LABELS[idx]}
              >
                <span className="truncate max-w-[85px] md:max-w-none">
                  {secKey === 'info' ? '01. Info' :
                   secKey === 'train' ? '02. Train' :
                   secKey === 'checklist' ? '03. Checklist' :
                   secKey === 's1' ? '04. B&P' :
                   secKey === 's2' ? '05. 1st' :
                   secKey === 's3' ? '06. 2nd' :
                   secKey === 's4' ? '07. 3rd' :
                   secKey === 'photo' ? '08. Photo' : '09. Verdict'}
                </span>
                <span
                  className={`text-[9px] font-mono px-1 rounded-full ${
                    isCurrent
                      ? 'bg-white/25 text-white'
                      : isComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {pct}%
                </span>
              </button>
            );
          })}

          {/* Quick Verdict Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black tracking-wider uppercase border ml-1 ${
              verdict === 'PASS'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                : verdict === 'FAIL'
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {verdict === 'PASS' ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : verdict === 'FAIL' ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3 animate-spin" />
            )}
            <span>{verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'FAIL' : 'PENDING'}</span>
          </div>

          {/* Reset Working Draft Action */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer ml-1"
            title="Reset to initial blank report"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
}
