// src/tools/painter/PainterTrainingTest.jsx
import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { TRAINING_TOPICS } from '../../data/painterDatabase';

export default function PainterTrainingTest({
  formData,
  onChange,
  evaluation
}) {
  const {
    pre = 0,
    post = 0,
    prePct = 0,
    postPct = 0,
    imp = 0,
    meetsPost = false,
    meetsImp = false
  } = evaluation || {};

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      
      {/* 15 Training Syllabus Topics Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                Section 02: Spray Painter Industrial Training Syllabus (15 Core Topics)
              </h3>
              <p className="text-xs text-slate-500">Comprehensive syllabus administered prior to practical &amp; theoretical qualification</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">15 Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRAINING_TOPICS.map((topic, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-3 hover:border-[#E87B1E]/60 hover:bg-white transition"
            >
              <div className="w-7 h-7 rounded-lg bg-[#9E1B1E] text-white flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 shadow-xs">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-700 leading-snug font-medium">
                {topic}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre & Post Test Examination Scoring Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-rajdhani">
                Theoretical Examination Evaluation (45 Questions)
              </h3>
              <p className="text-xs text-slate-500">Standardized 45-question multiple choice examination with minimum 80% passing threshold</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Passing: ≥80% (36/45)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Pre-Test Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-rajdhani">
                Pre-Training Examination
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Baseline
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData?.['f-pre-date'] || ''}
                  onChange={(e) => handleInputChange('f-pre-date', e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:border-[#E87B1E] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Correct (/45) *
                </label>
                <input
                  type="number"
                  value={formData?.['f-pre-correct'] || ''}
                  onChange={(e) => handleInputChange('f-pre-correct', e.target.value)}
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:border-[#E87B1E] outline-none"
                  min="0"
                  max="45"
                  placeholder="38"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Pre-Test Score:</span>
              <span className="text-lg font-black font-mono text-slate-800">
                {prePct.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-slate-500 h-full transition-all duration-500"
                style={{ width: `${prePct}%` }}
              />
            </div>
          </div>

          {/* Post-Test Card */}
          <div className="bg-amber-50/50 rounded-xl border border-[#E87B1E]/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#9E1B1E] font-rajdhani">
                Post-Training Examination *
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  meetsPost ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {meetsPost ? 'PASS (≥80%)' : 'FAIL (<80%)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData?.['f-post-date'] || ''}
                  onChange={(e) => handleInputChange('f-post-date', e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:border-[#E87B1E] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Correct (/45) *
                </label>
                <input
                  type="number"
                  value={formData?.['f-post-correct'] || ''}
                  onChange={(e) => handleInputChange('f-post-correct', e.target.value)}
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:border-[#E87B1E] outline-none"
                  min="0"
                  max="45"
                  placeholder="43"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#E87B1E]/20 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Post-Test Score:</span>
              <span className={`text-lg font-black font-mono ${meetsPost ? 'text-emerald-600' : 'text-rose-600'}`}>
                {postPct.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${meetsPost ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${postPct}%` }}
              />
            </div>
          </div>

          {/* Knowledge Gain (Delta) Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-rajdhani">
                Knowledge Gain (Δ%)
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  meetsImp ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                Target ≥15%
              </span>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="text-center">
                <div className={`text-3xl font-black font-mono ${imp >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {imp >= 0 ? `+${imp.toFixed(0)}%` : `${imp.toFixed(0)}%`}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Improvement Delta
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 text-center">
              {imp >= 30 ? '⭐ Outstanding Knowledge Retention' :
               imp >= 15 ? '✓ Satisfactory Knowledge Improvement' :
               imp >= 0 ? '⚠ Marginal Improvement' : '✗ Knowledge Regressed'}
            </div>
          </div>

        </div>

        {/* Examiner Observation Remarks */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Examiner Notes &amp; Observations on Theoretical Assessment
          </label>
          <textarea
            value={formData?.['f-remark-train'] || ''}
            onChange={(e) => handleInputChange('f-remark-train', e.target.value)}
            rows={3}
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
            placeholder="Document any strengths, specific knowledge deficiencies, or areas requiring coaching..."
          />
        </div>
      </div>

    </div>
  );
}
