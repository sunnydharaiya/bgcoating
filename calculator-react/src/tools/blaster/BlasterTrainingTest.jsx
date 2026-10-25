import React from 'react';
import { TRAINING_TOPICS } from '../../data/blasterDatabase';

export default function BlasterTrainingTest({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const { preCorrect = 0, postCorrect = 0, prePct = 0, postPct = 0, improvement = 0 } = metrics;

  return (
    <div className="sheet act" id="sh-train">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">TRAINING TOPICS COVERED &amp; ASSESSMENT TEST RESULTS</div>
          <div className="xl-corp-s">15 Training Modules · Pre/Post Test Comparison · Auto-Calculated Improvement Index</div>
        </div>
      </div>

      <div className="xl-sec-h" id="sec-train-0">
        <span className="ic">📚</span>Training Topics Covered During Program<span className="num">15 MODULES</span>
      </div>
      <div className="topic-grid" id="topic-grid">
        {TRAINING_TOPICS.map((topic, i) => (
          <div key={i} className="topic-card">
            <div className="topic-num">{i + 1}</div>
            <div className="topic-txt">{topic}</div>
          </div>
        ))}
      </div>

      <div className="xl-sec-h" id="sec-train-1">
        <span className="ic">🧠</span>Examination / Assessment Test Results<span className="num">25 QUESTIONS · 80% PASS</span>
      </div>
      <div className="test-result-w">
        <div className="test-card pre">
          <div className="test-card-h">
            <div className="ic">📝</div>
            <div className="test-card-t">
              <div className="test-card-t1">Pre-Test</div>
              <div className="test-card-t2">Before training program begins</div>
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Test Date</div>
            <div className="test-card-row-v">
              <input 
                type="date" 
                id="f-pre-date" 
                value={state.preTestDate || ''} 
                onChange={(e) => onChange('preTestDate', e.target.value)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Total Questions</div>
            <div className="test-card-row-v">25</div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Correct Answers</div>
            <div className="test-card-row-v">
              <input 
                type="number" 
                id="f-pre-correct" 
                min="0" 
                max="25" 
                value={state.preTestCorrect ?? 0} 
                onChange={(e) => onChange('preTestCorrect', parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Achievement</div>
            <div className="test-card-row-v" id="f-pre-pct-row">{Math.round(prePct)}%</div>
          </div>
          <div className="test-pct-bar">
            <div className="test-pct-fill" id="f-pre-bar" style={{ width: `${Math.min(100, Math.max(0, prePct))}%` }}></div>
          </div>
          <div className={`test-pct-out ${prePct >= 80 ? 'green' : 'red'}`} id="f-pre-out">
            {Math.round(prePct)}%
          </div>
        </div>

        <div className="test-card post">
          <div className="test-card-h">
            <div className="ic">🎓</div>
            <div className="test-card-t">
              <div className="test-card-t1">Post-Test</div>
              <div className="test-card-t2">After completion of training</div>
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Test Date</div>
            <div className="test-card-row-v">
              <input 
                type="date" 
                id="f-post-date" 
                value={state.postTestDate || ''} 
                onChange={(e) => onChange('postTestDate', e.target.value)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Total Questions</div>
            <div className="test-card-row-v">25</div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Correct Answers</div>
            <div className="test-card-row-v">
              <input 
                type="number" 
                id="f-post-correct" 
                min="0" 
                max="25" 
                value={state.postTestCorrect ?? 0} 
                onChange={(e) => onChange('postTestCorrect', parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Achievement</div>
            <div className="test-card-row-v" id="f-post-pct-row">{Math.round(postPct)}%</div>
          </div>
          <div className="test-pct-bar">
            <div className="test-pct-fill" id="f-post-bar" style={{ width: `${Math.min(100, Math.max(0, postPct))}%` }}></div>
          </div>
          <div className={`test-pct-out ${postPct >= 80 ? 'green' : 'red'}`} id="f-post-out">
            {Math.round(postPct)}%
          </div>
        </div>
      </div>

      <div className="improve-row">
        <div className="improve-l">
          <span className="improve-arrow" id="improve-arrow" style={{ color: improvement >= 15 ? 'var(--gr)' : 'var(--gs)' }}>
            {improvement >= 0 ? '↑' : '↓'}
          </span>
          IMPROVEMENT INDEX
        </div>
        <div className="improve-v" id="improve-val" style={{ color: improvement >= 15 ? 'var(--gr)' : 'var(--gs)' }}>
          {improvement >= 0 ? `+${Math.round(improvement)}%` : `${Math.round(improvement)}%`}
        </div>
      </div>

      <div className="remark-box">
        <div className="remark-l">💬 Examiner Remark</div>
        <textarea 
          className="remark-t" 
          id="f-remark-train" 
          placeholder="Enter remarks regarding training comprehension, engagement, and post-test assessment results..." 
          value={state.remarkTrain || ''} 
          onChange={(e) => onChange('remarkTrain', e.target.value)} 
        />
      </div>

      <div className="btn-row">
        <button 
          type="button" 
          className="btn btn-save" 
          onClick={() => window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'draft' } }))}
        >
          💾 Save Draft
        </button>
        <button 
          type="button" 
          className="btn" 
          style={{ background: 'linear-gradient(135deg,var(--o2),var(--o1))', color: '#fff' }} 
          onClick={() => window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'validate' } }))}
        >
          ✓ Validate &amp; Approve
        </button>
        <button 
          type="button" 
          className="btn btn-reset" 
          onClick={() => window.dispatchEvent(new CustomEvent('bg_header_action', { detail: { action: 'reset' } }))}
        >
          ↺ Reset
        </button>
        <button 
          type="button" 
          className="btn" 
          style={{ background: 'linear-gradient(135deg,var(--o3),var(--o2))', color: '#fff' }} 
          onClick={() => onNavigate('checklist')}
        >
          Next: Assessment Checklist →
        </button>
      </div>
    </div>
  );
}
