import React from 'react';
import { TRAINING_TOPICS } from '../../data/painterDatabase';

export default function PainterTrainingTest({
  formData = {},
  onChange,
  evaluation = {},
  onNavigate,
  onSaveDraft,
  onValidate,
  onReset
}) {
  const {
    pre = 0,
    post = 0,
    prePct = 0,
    postPct = 0,
    imp = 0
  } = evaluation;

  const handleField = (field, val) => {
    onChange(field, val);
  };

  return (
    <div className="sheet act" id="sh-train">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">TRAINING TOPICS COVERED &amp; ASSESSMENT TEST RESULTS</div>
          <div className="xl-corp-s">15 Training Modules · Pre/Post Test Comparison · Auto-Calculated Improvement Index</div>
        </div>
      </div>

      {/* Training Topics */}
      <div className="xl-sec-h" id="sec-train-0">
        <span className="ic">📚</span>Training Topics Covered During Program
        <span className="num">15 MODULES</span>
      </div>
      <div className="topic-grid" id="topic-grid">
        {TRAINING_TOPICS.map((topic, idx) => (
          <div key={idx} className="topic-card">
            <div className="topic-num">{idx + 1}</div>
            <div className="topic-txt">{topic}</div>
          </div>
        ))}
      </div>

      {/* Examination / Assessment Test Results */}
      <div className="xl-sec-h" id="sec-train-1">
        <span className="ic">🧠</span>Examination / Assessment Test Results
        <span className="num">45 QUESTIONS · 80% PASS</span>
      </div>
      <div className="test-result-w">
        {/* Pre-Test Card */}
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
                value={formData['f-pre-date'] || ''} 
                onChange={(e) => handleField('f-pre-date', e.target.value)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Total Questions</div>
            <div className="test-card-row-v">45</div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Correct Answers</div>
            <div className="test-card-row-v">
              <input 
                type="number" 
                id="f-pre-correct" 
                min={0} 
                max={45} 
                value={formData['f-pre-correct'] ?? ''} 
                placeholder="0" 
                onChange={(e) => handleField('f-pre-correct', e.target.value)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Achievement</div>
            <div className="test-card-row-v" id="f-pre-pct-row">{prePct}%</div>
          </div>
          <div className="test-pct-bar">
            <div className="test-pct-fill" id="f-pre-bar" style={{ width: `${prePct}%` }}></div>
          </div>
          <div className={`test-pct-out ${prePct >= 80 ? 'green' : 'red'}`} id="f-pre-out">{prePct}%</div>
        </div>

        {/* Post-Test Card */}
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
                value={formData['f-post-date'] || ''} 
                onChange={(e) => handleField('f-post-date', e.target.value)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Total Questions</div>
            <div className="test-card-row-v">45</div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Correct Answers</div>
            <div className="test-card-row-v">
              <input 
                type="number" 
                id="f-post-correct" 
                min={0} 
                max={45} 
                value={formData['f-post-correct'] ?? ''} 
                placeholder="0" 
                onChange={(e) => handleField('f-post-correct', e.target.value)} 
              />
            </div>
          </div>
          <div className="test-card-row">
            <div className="test-card-row-l">Achievement</div>
            <div className="test-card-row-v" id="f-post-pct-row">{postPct}%</div>
          </div>
          <div className="test-pct-bar">
            <div className="test-pct-fill" id="f-post-bar" style={{ width: `${postPct}%` }}></div>
          </div>
          <div className={`test-pct-out ${postPct >= 80 ? 'green' : 'red'}`} id="f-post-out">{postPct}%</div>
        </div>
      </div>

      {/* Improvement Index */}
      <div className="improve-row">
        <div className="improve-l">
          <span className="improve-arrow" id="improve-arrow" style={{ color: imp >= 0 ? 'var(--gs)' : 'var(--gr)' }}>↑</span>
          IMPROVEMENT INDEX
        </div>
        <div className="improve-v" id="improve-val" style={{ color: imp >= 0 ? 'var(--gs)' : 'var(--gr)' }}>
          {imp >= 0 ? `+${imp}%` : `${imp}%`}
        </div>
      </div>

      <div className="remark-box">
        <div className="remark-l">💬 Examiner Remark</div>
        <textarea 
          className="remark-t" 
          id="f-remark-train" 
          value={formData['f-remark-train'] || ''} 
          onChange={(e) => handleField('f-remark-train', e.target.value)} 
          placeholder="Examiner comments regarding test results, theoretical grasp and domain understanding..."
        />
      </div>

      <div className="btn-row btn-row-std">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidate}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button type="button" className="btn nx" onClick={() => onNavigate && onNavigate('checklist')}>Next: Assessment Checklist →</button>
      </div>
    </div>
  );
}
