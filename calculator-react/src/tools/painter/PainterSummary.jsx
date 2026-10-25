// src/tools/painter/PainterSummary.jsx
import React from 'react';

export default function PainterSummary({
  formData,
  evaluation,
  onNavigate,
  onSaveDraft,
  onValidateApprove,
  onChange
}) {
  const {
    pre = 0,
    post = 0,
    prePct = 0,
    postPct = 0,
    imp = 0,
    chkPass = 0,
    chkFail = 0,
    chkPct = 0,
    inspPct = 0,
    totalInspPass = 0,
    totalInspFail = 0,
    overallDFTAvg = NaN,
    totalEnvValid = 0,
    okEnvCount = 0,
    overall = 0,
    verdict = 'PENDING'
  } = evaluation || {};

  const name = formData?.['f-name'] || 'Operator';
  const category = formData?.['f-category'] || 'Spray Painter';
  const civil = formData?.['f-civil'] || '—';
  const exp = formData?.['f-exp'] || '0';
  const project = formData?.['f-proj'] || 'Project';
  const employer = formData?.['f-employer'] || '—';
  const qualDate = formData?.['f-qual-date'] || '—';
  const nextDate = formData?.['f-next-date'] || '—';
  const opPhoto = formData?._opPhoto;

  const verdictClass = verdict === 'PASS' ? 'approved' : verdict === 'FAIL' ? 'fail' : 'pending';
  const stampText = verdict === 'PASS' ? 'PASS' : verdict === 'FAIL' ? 'FAIL' : 'PEND';
  const stampSub = verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'REJECTED' : 'IN PROGRESS';

  const defaultExec = `This report documents the qualification assessment of ${name} as a ${category} on the ${project}. The operator (${exp} years of relevant experience, employer: ${employer}) was evaluated through a structured combination of written examination and on-site practical assessment. The post-training examination score was ${postPct.toFixed(0)}% (improvement of ${imp >= 0 ? '+' : ''}${imp.toFixed(0)}% from pre-test), the assessment checklist compliance reached ${chkPct.toFixed(0)}%, and the on-site inspection pass rate was ${inspPct.toFixed(0)}%. Based on the weighted-criteria evaluation (overall score ${overall.toFixed(1)}%), the operator is ${
    verdict === 'PASS'
      ? 'officially qualified and certified'
      : verdict === 'FAIL'
      ? 'not qualified at this attempt'
      : 'currently under evaluation'
  }.`;

  return (
    <div className="sheet" id="sh-summary">
      {/* Corporate Header */}
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">OPERATOR QUALIFICATION REPORT — EXECUTIVE SUMMARY</div>
          <div className="xl-corp-s">
            Comprehensive narrative summary of the operator qualification activity
          </div>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="sum-hero" id="sum-hero">
        <div className="sum-hero-grid">
          <div className="sum-photo-w" id="sum-photo-w">
            {opPhoto ? (
              <img
                src={opPhoto}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="sum-photo-w-empty">👤</div>
            )}
          </div>
          <div className="sum-hero-c">
            <div className="sum-hero-kick">
              <span className="hdot" />Operator Qualification Activity
            </div>
            <div className="sum-hero-name" id="sum-name">{name}</div>
            <div className="sum-hero-sub" id="sum-sub">
              {category} · Civil ID {civil} · {exp} years experience · Project: {project}
            </div>
          </div>
          <div className="sum-hero-r">
            <div className={`sum-hero-badge ${verdictClass}`} id="sum-badge">
              <div className="b1">QUALIFICATION</div>
              <div className="b2" id="sum-badge-v">{stampText}</div>
              <div className="b3" id="sum-badge-s">{stampSub}</div>
            </div>
            <div className="sum-hero-score">
              <div className="sum-hero-score-v" id="sum-hero-score">
                {overall.toFixed(1)}%
              </div>
              <div className="sum-hero-score-l">Overall Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <div className="sum-section">
        <div className="sum-section-h">
          <span className="ic">📄</span>1. Executive Summary
          <span className="num">AUTO-GENERATED</span>
        </div>
        <div className="sum-section-b">
          <div
            style={{ fontSize: '11.5px', color: 'var(--txt2)', lineHeight: 1.6, marginBottom: '8px' }}
            id="sum-exec-auto"
          >
            {defaultExec}
          </div>
          <textarea
            id="sum-exec"
            placeholder="Manual additions to the executive summary..."
            value={formData?.['sum-exec'] || ''}
            onChange={(e) => onChange && onChange('sum-exec', e.target.value)}
          />
        </div>
      </div>

      {/* 2 & 3. Scope & Methodology */}
      <div className="sum-grid-2">
        <div className="sum-section">
          <div className="sum-section-h"><span className="ic">🎯</span>2. Scope of Qualification</div>
          <div className="sum-section-b">
            <textarea
              id="sum-scope"
              rows={4}
              placeholder="Qualification scope covering airless spraying, surface preparation inspection, pot-life monitoring, and DFT measurement on complex structural configurations..."
              value={formData?.['sum-scope'] || ''}
              onChange={(e) => onChange && onChange('sum-scope', e.target.value)}
            />
          </div>
        </div>
        <div className="sum-section">
          <div className="sum-section-h"><span className="ic">🔬</span>3. Methodology</div>
          <div className="sum-section-b">
            <textarea
              id="sum-method"
              rows={4}
              placeholder="Structured theoretical assessment followed by hands-on practical trial on 5'-0 x 5'-0 test plate with simulated pipe, T-beam, and wide flange geometries per ASTM D4228..."
              value={formData?.['sum-method'] || ''}
              onChange={(e) => onChange && onChange('sum-method', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 4. Key Findings */}
      <div className="sum-section">
        <div className="sum-section-h"><span className="ic">📊</span>4. Key Findings &amp; Quantitative Results</div>
        <div className="sum-section-b">
          <div className="sum-grid-2">
            <div className="sum-stat-list">
              <div className="sum-stat-row">
                <div>Pre-Test Score</div>
                <div id="sf-pre">{prePct.toFixed(0)}% ({pre}/25)</div>
              </div>
              <div className="sum-stat-row">
                <div>Post-Test Score</div>
                <div id="sf-post">{postPct.toFixed(0)}% ({post}/25)</div>
              </div>
              <div className="sum-stat-row">
                <div>Improvement Index</div>
                <div id="sf-imp">{imp >= 0 ? '+' : ''}{imp.toFixed(0)}%</div>
              </div>
              <div className="sum-stat-row">
                <div>Checklist Compliance</div>
                <div id="sf-chk">{chkPct.toFixed(0)}% ({chkPass} Pass / {chkFail} Fail)</div>
              </div>
            </div>
            <div className="sum-stat-list">
              <div className="sum-stat-row">
                <div>Inspection Pass Rate</div>
                <div id="sf-insp">{inspPct.toFixed(0)}% ({totalInspPass} Pass / {totalInspFail} Fail)</div>
              </div>
              <div className="sum-stat-row">
                <div>Environmental Status</div>
                <div id="sf-env">
                  {totalEnvValid === 0 ? '— No Data —' : `${okEnvCount}/${totalEnvValid} Readings In-Spec`}
                </div>
              </div>
              <div className="sum-stat-row">
                <div>Overall DFT (Avg)</div>
                <div id="sf-prof">{!isNaN(overallDFTAvg) ? `${overallDFTAvg.toFixed(1)} µm` : '—'}</div>
              </div>
              <div className="sum-stat-row">
                <div>Overall Weighted Score</div>
                <div id="sf-overall">{overall.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Standards & References Applied */}
      <div className="sum-section">
        <div className="sum-section-h"><span className="ic">📚</span>5. Standards &amp; References Applied</div>
        <div className="sum-section-b">
          <ul className="sum-list">
            <li><strong>ASTM D 4228</strong> — Standard Practice for Qualification of Coating Applicators for Application of Coatings to Steel Surfaces.</li>
            <li><strong>ASTM D 4414</strong> — Standard Practice for Measurement of Wet Film Thickness by Notch Gages.</li>
            <li><strong>ASTM D 7091 / SSPC PA-2</strong> — Measurement of Dry Coating Thickness of Nonmagnetic Coatings Applied to Ferrous Metals (80%–120% rule).</li>
            <li><strong>ISO 8501-1 / SSPC-VIS 1</strong> — Preparation of steel substrates before application of paints — Visual assessment of surface cleanliness.</li>
            <li><strong>ISO 19840</strong> — Paints and varnishes — Corrosion protection of steel structures — Measurement of dry-film thickness on rough surfaces.</li>
            <li><strong>ASTM D 3359</strong> — Standard Test Methods for Rating Adhesion by Tape Test.</li>
            <li><strong>ASTM D 4541</strong> — Pull-Off Strength of Coatings Using Portable Adhesion Testers.</li>
            <li><strong>ISO 12944 Series</strong> — Paints and varnishes — Corrosion protection of steel structures by protective paint systems.</li>
          </ul>
        </div>
      </div>

      {/* 6 & 7. Strengths & Improvement Areas */}
      <div className="sum-grid-2">
        <div className="sum-section">
          <div className="sum-section-h"><span className="ic">💪</span>6. Operator Strengths</div>
          <div className="sum-section-b">
            <textarea
              id="sum-strengths"
              rows={3}
              placeholder="Exceptional gun distance consistency, uniform 50% overlap technique, thorough stripe coating on welds and bolt heads..."
              value={formData?.['sum-strengths'] || ''}
              onChange={(e) => onChange && onChange('sum-strengths', e.target.value)}
            />
          </div>
        </div>
        <div className="sum-section">
          <div className="sum-section-h"><span className="ic">📈</span>7. Areas for Continuous Improvement</div>
          <div className="sum-section-b">
            <textarea
              id="sum-improve"
              rows={3}
              placeholder="Recommended to improve trigger pacing when transitioning between pipe contours and flat flange planes..."
              value={formData?.['sum-improve'] || ''}
              onChange={(e) => onChange && onChange('sum-improve', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 8. Conclusion */}
      <div className="sum-section">
        <div className="sum-section-h"><span className="ic">🏁</span>8. Conclusion &amp; Recommendation</div>
        <div className="sum-section-b">
          <div className={`sum-conclusion ${verdictClass}`} id="sum-conclusion">
            <div className="sum-conclusion-t" id="sum-concl-t">
              {verdict === 'PASS'
                ? '✓ Qualification Approved'
                : verdict === 'FAIL'
                ? '✗ Qualification Rejected'
                : '⚠ Qualification Pending'}
            </div>
            <div id="sum-concl-body">
              {verdict === 'PASS'
                ? `Operator ${name} has demonstrated full compliance with ASTM D4228 and SSPC PA-2 requirements and is recommended for qualification certificate issuance.`
                : verdict === 'FAIL'
                ? `Operator ${name} has not met the threshold criteria for qualification. Remedial training is recommended prior to re-assessment.`
                : `The qualification of ${name} is currently in progress. The final verdict will be issued once all evaluation parameters are recorded.`}
            </div>
          </div>
          <textarea
            id="sum-recommend"
            rows={2}
            style={{ marginTop: '10px' }}
            placeholder="Additional recommendations to the client / project management..."
            value={formData?.['sum-recommend'] || ''}
            onChange={(e) => onChange && onChange('sum-recommend', e.target.value)}
          />
        </div>
      </div>

      {/* 9. Validity */}
      <div className="sum-section">
        <div className="sum-section-h"><span className="ic">📅</span>9. Qualification Validity</div>
        <div className="sum-section-b">
          <div className="sum-grid-2">
            <div className="sum-stat-list">
              <div className="sum-stat-row">
                <div>Qualification Date</div>
                <div id="sv-date">{qualDate || '—'}</div>
              </div>
              <div className="sum-stat-row">
                <div>Next Re-Assessment</div>
                <div id="sv-next">{nextDate || '—'}</div>
              </div>
            </div>
            <div className="sum-stat-list">
              <div className="sum-stat-row">
                <div>Valid For</div>
                <div>12 Months</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Button Row */}
      <div className="btn-row btn-row-std">
        <button type="button" className="btn btn-draft-std" onClick={onSaveDraft}>💾 Save as Draft</button>
        <button type="button" className="btn btn-validate-std" onClick={onValidateApprove}>✓ Validate &amp; Approve</button>
        <button
          type="button"
          className="btn btn-save"
          onClick={() => onNavigate && onNavigate('painter', 'register')}
        >
          Next: Report Register →
        </button>
      </div>
    </div>
  );
}
