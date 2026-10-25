import React from 'react';

export default function BlasterVerdictApproval({
  state,
  onChange,
  metrics,
  onNavigate,
  onSaveDraft,
  onApprove,
  onReset
}) {
  const {
    postPct = 0,
    improvement = 0,
    chkPct = 0,
    chkFail = 0,
    inspPct = 0,
    inspFail = 0,
    envFinalOK = false,
    evaluatedEnvRows = [],
    overallScore = 0,
    verdict = 'PEND'
  } = metrics || {};

  const vClass = verdict === 'PASS' ? 'pass' : verdict === 'FAIL' ? 'fail' : 'pending';
  const vText = verdict === 'PASS' ? 'PASS' : verdict === 'FAIL' ? 'FAIL' : 'PEND';
  const vSubText = verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'NOT QUALIFIED' : 'IN PROGRESS';

  // Criteria Verification
  const c1Met = postPct >= 80;
  const c2Met = improvement >= 15;
  const c3Met = chkPct >= 80 && chkFail === 0;
  const c4Met = inspPct >= 80 && inspFail === 0;
  const validEnvCount = evaluatedEnvRows.filter(r => r.rh !== '—').length;
  const okEnvCount = evaluatedEnvRows.filter(r => r.ok).length;
  const c5Met = validEnvCount > 0 ? (okEnvCount === validEnvCount && envFinalOK) : true;

  const handleStampUpload = (sigNum, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(`sig${sigNum}Stamp`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveStamp = (sigNum, e) => {
    e.stopPropagation();
    onChange(`sig${sigNum}Stamp`, '');
  };

  return (
    <div className="sheet act" id="sh-verdict">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">QUALIFICATION VERDICT &amp; APPROVAL</div>
          <div className="xl-corp-s">Auto-evaluated final verdict · Operator-photo certificate · Multi-signatory approval workflow</div>
        </div>
      </div>

      {/* VERDICT RUBBER STAMP & METRICS BANNER */}
      <div className={`verdict-w ${vClass}`} id="verdict-w">
        <div className={`verdict-stamp ${vClass}`} id="verdict-stamp">
          <div className="verdict-stamp-t">QUALIFICATION</div>
          <div className="verdict-stamp-v" id="verdict-text">{vText}</div>
          <div className="verdict-stamp-s" id="verdict-sub-stamp">{vSubText}</div>
        </div>

        <div className="verdict-body">
          <div className="verdict-h">Final Qualification Verdict</div>
          <div className="verdict-name" id="v-name">{state.operatorName || '—'}</div>
          <div className="verdict-sub" id="v-sub">
            {state.category || 'Blaster'} · Civil ID {state.civilId || '—'} · {state.experienceYears || '—'} years experience
          </div>
          <div className="verdict-metrics">
            <div className="verdict-metric">
              <div className="verdict-metric-l">Post Test</div>
              <div className="verdict-metric-v" id="v-post">{postPct}%</div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Improvement</div>
              <div className={`verdict-metric-v ${improvement >= 15 ? 'green' : 'red'}`} id="v-imp">
                {improvement >= 0 ? `+${improvement}%` : `${improvement}%`}
              </div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Checklist</div>
              <div className="verdict-metric-v" id="v-chk">{chkPct}%</div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Inspection</div>
              <div className="verdict-metric-v" id="v-insp">{inspPct}%</div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Overall Score</div>
              <div className="verdict-metric-v" id="v-overall">{overallScore.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="verdict-qr" id="v-op-photo-w">
          {state.operatorPhoto ? (
            <img src={state.operatorPhoto} alt="Operator" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--txt3)', textAlign: 'center', padding: '8px' }}>
              <div style={{ fontSize: '30px', color: 'var(--bdr2)' }}>👤</div>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', color: 'var(--txt3)' }}>Operator<br />Photo</div>
              <div style={{ fontSize: '8.5px', color: 'var(--txt3)', marginTop: '3px', fontStyle: 'italic' }}>Upload from<br />Project &amp; Operator</div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 0: QUALIFICATION CRITERIA AUTO-EVALUATION */}
      <div className="xl-sec-h" id="sec-verdict-0"><span className="ic">📋</span>Qualification Criteria Auto-Evaluation</div>
      <div className="xl-tbl-w">
        <table className="xl-tbl">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th style={{ textAlign: 'left', paddingLeft: '12px' }}>Criterion</th>
              <th>Weight</th>
              <th>Threshold</th>
              <th>Achieved</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="crit-tbody">
            <tr>
              <td><b>1</b></td>
              <td className="txt-l">Post-Test Score (After Training)</td>
              <td>30%</td>
              <td>≥ 80%</td>
              <td><b>{postPct}%</b></td>
              <td>
                <span className={`pf-badge ${c1Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c1Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td><b>2</b></td>
              <td className="txt-l">Improvement Index (Pre → Post)</td>
              <td>10%</td>
              <td>≥ 15%</td>
              <td><b>{improvement >= 0 ? `+${improvement}%` : `${improvement}%`}</b></td>
              <td>
                <span className={`pf-badge ${c2Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c2Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td><b>3</b></td>
              <td className="txt-l">Assessment Checklist Compliance</td>
              <td>25%</td>
              <td>≥ 80% &amp; 0 fail</td>
              <td><b>{chkPct}%</b></td>
              <td>
                <span className={`pf-badge ${c3Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c3Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td><b>4</b></td>
              <td className="txt-l">Process Inspection Pass Rate</td>
              <td>25%</td>
              <td>≥ 80% &amp; 0 fail</td>
              <td><b>{inspPct}%</b></td>
              <td>
                <span className={`pf-badge ${c4Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c4Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td><b>5</b></td>
              <td className="txt-l">Environmental Conditions</td>
              <td>10%</td>
              <td>RH≤85, MT−DP≥3</td>
              <td><b>{validEnvCount > 0 ? `${okEnvCount}/${validEnvCount} OK` : '1/1 OK'}</b></td>
              <td>
                <span className={`pf-badge ${c5Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c5Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr style={{ background: 'linear-gradient(180deg,#F4E5C7,#E9D7B0)', fontWeight: 700 }}>
              <td colSpan="2" className="txt-l" style={{ fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)', fontSize: '13px' }}>OVERALL WEIGHTED SCORE</td>
              <td colSpan="2"></td>
              <td style={{ fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)', fontSize: '15px' }}>{overallScore.toFixed(1)}%</td>
              <td>
                <span className={`pf-badge ${verdict === 'PASS' ? 'pf-pass' : verdict === 'FAIL' ? 'pf-fail' : 'pf-pending'}`}>
                  {verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'FAILED' : 'PENDING'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* EXAMINER REMARK */}
      <div className="remark-box">
        <div className="remark-l">🏁 Final Examiner Remark</div>
        <textarea
          className="remark-t"
          id="f-remark-final"
          value={state.remarkFinal || ''}
          onChange={(e) => onChange('remarkFinal', e.target.value)}
          placeholder="Enter final qualification verdict remarks and certification recommendations..."
        ></textarea>
      </div>

      {/* SECTION 1: AUTHORIZATION & SIGNATURE */}
      <div className="xl-sec-h" id="sec-verdict-1"><span className="ic">✍️</span>Authorization &amp; Signature</div>
      <div className="sig-grid">
        {/* SIGNATORY 1: Performed By */}
        <div className="sig-box">
          <div className="sig-box-h">Performed By (Site Team)</div>
          <div className="sig-line">
            <span className="sig-signed" id="sig1-disp">{state.sig1Name || '_______'}</span>
          </div>
          <div className="sig-meta">
            <input
              type="text"
              id="sig1-name"
              value={state.sig1Name || ''}
              placeholder="Name"
              onChange={(e) => onChange('sig1Name', e.target.value)}
            />
            <input
              type="date"
              id="sig1-date"
              value={state.sig1Date || ''}
              onChange={(e) => onChange('sig1Date', e.target.value)}
            />
          </div>
          <div
            className={`sig-stamp-area ${state.sig1Stamp ? 'has-stamp' : ''}`}
            id="sig1-stamp-area"
            tabIndex={0}
            onClick={() => document.getElementById('sig1-stamp-input')?.click()}
            style={{ height: '80px', marginTop: '8px' }}
          >
            {state.sig1Stamp ? (
              <>
                <img src={state.sig1Stamp} alt="Stamp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <button className="sig-stamp-rm" type="button" onClick={(e) => handleRemoveStamp(1, e)}>✕</button>
              </>
            ) : (
              <>
                <div className="sa-ic" style={{ fontSize: '18px' }}>🔖</div>
                <div className="sa-l">Stamp / Sign</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="sig1-stamp-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleStampUpload(1, e)}
          />
        </div>

        {/* SIGNATORY 2: QA/QC Inspector */}
        <div className="sig-box">
          <div className="sig-box-h">QA/QC Inspector</div>
          <div className="sig-line">
            <span className="sig-signed" id="sig2-disp">{state.sig2Name || '_______'}</span>
          </div>
          <div className="sig-meta">
            <input
              type="text"
              id="sig2-name"
              value={state.sig2Name || ''}
              placeholder="Name"
              onChange={(e) => onChange('sig2Name', e.target.value)}
            />
            <input
              type="date"
              id="sig2-date"
              value={state.sig2Date || ''}
              onChange={(e) => onChange('sig2Date', e.target.value)}
            />
          </div>
          <div
            className={`sig-stamp-area ${state.sig2Stamp ? 'has-stamp' : ''}`}
            id="sig2-stamp-area"
            tabIndex={0}
            onClick={() => document.getElementById('sig2-stamp-input')?.click()}
            style={{ height: '80px', marginTop: '8px' }}
          >
            {state.sig2Stamp ? (
              <>
                <img src={state.sig2Stamp} alt="Stamp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <button className="sig-stamp-rm" type="button" onClick={(e) => handleRemoveStamp(2, e)}>✕</button>
              </>
            ) : (
              <>
                <div className="sa-ic" style={{ fontSize: '18px' }}>🔖</div>
                <div className="sa-l">Stamp / Sign</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="sig2-stamp-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleStampUpload(2, e)}
          />
        </div>

        {/* SIGNATORY 3: Client Approval */}
        <div className="sig-box">
          <div className="sig-box-h">Client Approval</div>
          <div className="sig-line">
            <span className="sig-signed" id="sig3-disp">{state.sig3Name || '_______'}</span>
          </div>
          <div className="sig-meta">
            <input
              type="text"
              id="sig3-name"
              value={state.sig3Name || ''}
              placeholder="Client Representative"
              onChange={(e) => onChange('sig3Name', e.target.value)}
            />
            <input
              type="date"
              id="sig3-date"
              value={state.sig3Date || ''}
              onChange={(e) => onChange('sig3Date', e.target.value)}
            />
          </div>
          <div
            className={`sig-stamp-area ${state.sig3Stamp ? 'has-stamp' : ''}`}
            id="sig3-stamp-area"
            tabIndex={0}
            onClick={() => document.getElementById('sig3-stamp-input')?.click()}
            style={{ height: '80px', marginTop: '8px' }}
          >
            {state.sig3Stamp ? (
              <>
                <img src={state.sig3Stamp} alt="Stamp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <button className="sig-stamp-rm" type="button" onClick={(e) => handleRemoveStamp(3, e)}>✕</button>
              </>
            ) : (
              <>
                <div className="sa-ic" style={{ fontSize: '18px' }}>🔖</div>
                <div className="sa-l">Stamp / Sign</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="sig3-stamp-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleStampUpload(3, e)}
          />
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onApprove}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button type="button" className="btn nx" onClick={() => onNavigate('reports')}>Next: Report Register →</button>
      </div>
    </div>
  );
}
