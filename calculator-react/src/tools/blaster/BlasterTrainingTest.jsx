import React from 'react';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { TRAINING_TOPICS } from '../../data/blasterDatabase';

export default function BlasterTrainingTest({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const { preCorrect, postCorrect, prePct, postPct, improvement, isPostPass } = metrics;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 02 · Step 2 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Training Syllabus &amp; Assessment Test Results
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            15 Industrial Training Modules · Pre/Post Test Comparison · Auto-Calculated Improvement Index ($\Delta\%$).
          </p>
        </div>

        <button
          onClick={() => onNavigate('checklist')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <span>Next: Assessment Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 15 Training Topics Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#E8700A]" />
            <span>Training Topics Covered During Program</span>
          </h3>
          <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            15 MODULES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRAINING_TOPICS.map((topic, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-[#E8700A]/10 text-[#E8700A] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {topic}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Examination / Assessment Test Scoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Pre-Test */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                📝
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Pre-Test Evaluation
                </h4>
                <span className="text-[10px] text-slate-400">Administered prior to training commencement</span>
              </div>
            </div>
            <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
              {prePct.toFixed(0)}%
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Test Date:</span>
              <input
                type="date"
                value={state.preTestDate}
                onChange={(e) => onChange('preTestDate', e.target.value)}
                className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Questions:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">25</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Correct Answers:</span>
              <input
                type="number"
                min="0"
                max="25"
                value={state.preCorrect}
                onChange={(e) => onChange('preCorrect', parseInt(e.target.value) || 0)}
                className="w-20 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-right text-xs focus:ring-2 focus:ring-[#E8700A]"
              />
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Pre-Training Achievement</span>
                <span className="font-mono">{prePct.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${prePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Post-Test */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                🎓
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Post-Test Evaluation
                </h4>
                <span className="text-[10px] text-slate-400">Post-training examination · 80% Min Pass</span>
              </div>
            </div>
            <span className={`text-sm font-black font-mono ${
              isPostPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {postPct.toFixed(0)}% ({isPostPass ? 'PASS' : 'FAIL'})
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Test Date:</span>
              <input
                type="date"
                value={state.postTestDate}
                onChange={(e) => onChange('postTestDate', e.target.value)}
                className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Questions:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">25</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-bold">Correct Answers:</span>
              <input
                type="number"
                min="0"
                max="25"
                value={state.postCorrect}
                onChange={(e) => onChange('postCorrect', parseInt(e.target.value) || 0)}
                className="w-20 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-right text-xs focus:ring-2 focus:ring-[#E8700A]"
              />
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Post-Training Achievement</span>
                <span className="font-mono">{postPct.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isPostPass ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${postPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Improvement Index Banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#E8700A]/10 text-[#E8700A]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Training Knowledge Improvement Index ($\Delta\%$)
            </div>
            <div className="text-[11px] text-slate-500">
              Calculation: Post-Test Score ({postPct.toFixed(0)}%) − Pre-Test Score ({prePct.toFixed(0)}%)
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-2xl font-black font-mono ${
            improvement >= 15 ? 'text-emerald-600 dark:text-emerald-400' : improvement >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {improvement >= 0 ? `+${improvement.toFixed(0)}%` : `${improvement.toFixed(0)}%`}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {improvement >= 30 ? 'Excellent' : improvement >= 15 ? 'Good Progress' : 'Marginal'}
          </span>
        </div>
      </div>

      {/* Examiner Remarks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E8700A]" />
          <span>Examiner Remarks &amp; Theoretical Observations</span>
        </label>
        <textarea
          rows={3}
          value={state.remarkTrain}
          onChange={(e) => onChange('remarkTrain', e.target.value)}
          placeholder="Record feedback on operator test responses, safety knowledge, and theoretical comprehension..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
        />
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => onNavigate('checklist')}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <span>Proceed to 03. Assessment Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
