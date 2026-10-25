// src/tools/painter/PainterVerdictApproval.jsx
import React, { useRef } from 'react';

export default function PainterVerdictApproval({
  formData,
  onChange,
  evaluation,
  onOpenApprovalModal,
  onStampUpload,
  onStampRemove,
  onSaveDraft,
  onValidateApprove,
  onReset,
  onNavigate
}) {
  const {
    prePct = 0,
    postPct = 0,
    imp = 0,
    chkPct = 0,
    chkFail = 0,
    inspPct = 0,
    totalInspFail = 0,
    dftSpotsOK = 0,
    dftSpotsValid = 0,
    overallDFTAvg = NaN,
    totalEnvValid = 0,
    okEnvCount = 0,
    overall = 0,
    verdict = 'PENDING'
  } = evaluation || {};

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  const name = formData?.['f-name'] || 'Operator';
  const category = formData?.['f-category'] || 'Spray Painter';
  const civil = formData?.['f-civil'] || '—';
  const exp = formData?.['f-exp'] || '0';
  const opPhoto = formData?._opPhoto;

  const sigStamps = formData?._sigStamps || { 1: null, 2: null, 3: null };

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  // 6 Criteria calculation matching painterDatabase logic
  const c1Met = postPct >= 80;
  const c2Met = imp >= 15;
  const c3Met = chkPct >= 80 && chkFail === 0;
  const c4Met = dftSpotsValid === 0 || (dftSpotsOK === dftSpotsValid && !isNaN(overallDFTAvg));
  const c5Met = inspPct >= 80 && totalInspFail === 0;
  const c6Met = totalEnvValid === 0 || okEnvCount === totalEnvValid;

  const verdictClass = verdict === 'PASS' ? 'approved' : verdict === 'FAIL' ? 'fail' : 'pending';
  const stampText = verdict === 'PASS' ? 'PASS' : verdict === 'FAIL' ? 'FAIL' : 'PEND';
  const stampSub = verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'REJECTED' : 'IN PROGRESS';

  return (
    <div className="sheet" id="sh-verdict">
      {/* Corporate Header */}
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">QUALIFICATION VERDICT &amp; APPROVAL</div>
          <div className="xl-corp-s">
            Auto-evaluated final verdict · Operator-photo certificate · Multi-signatory approval workflow
          </div>
        </div>
      </div>

      {/* Big Verdict Hero Widget */}
      <div className={`verdict-w ${verdictClass}`} id="verdict-w">
        <div className={`verdict-stamp ${verdictClass}`} id="verdict-stamp">
          <div className="verdict-stamp-t">QUALIFICATION</div>
          <div className="verdict-stamp-v" id="verdict-text">{stampText}</div>
          <div className="verdict-stamp-s" id="verdict-sub-stamp">{stampSub}</div>
        </div>

        <div className="verdict-body">
          <div className="verdict-h">Final Qualification Verdict</div>
          <div className="verdict-name" id="v-name">{name}</div>
          <div className="verdict-sub" id="v-sub">
            {category} · Civil ID {civil} · {exp} years experience
          </div>
          <div className="verdict-metrics">
            <div className="verdict-metric">
              <div className="verdict-metric-l">Post Test</div>
              <div className="verdict-metric-v" id="v-post">{postPct.toFixed(0)}%</div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Improvement</div>
              <div
                className={`verdict-metric-v ${imp < 0 ? 'red' : ''}`}
                id="v-imp"
              >
                {imp >= 0 ? '+' : ''}{imp.toFixed(0)}%
              </div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Checklist</div>
              <div className="verdict-metric-v" id="v-chk">{chkPct.toFixed(0)}%</div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Inspection</div>
              <div className="verdict-metric-v" id="v-insp">{inspPct.toFixed(0)}%</div>
            </div>
            <div className="verdict-metric">
              <div className="verdict-metric-l">Overall Score</div>
              <div className="verdict-metric-v" id="v-overall">{overall.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="verdict-qr" id="v-op-photo-w">
          {opPhoto ? (
            <img
              src={opPhoto}
              alt="Operator"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--txt3)',
              textAlign: 'center',
              padding: '8px'
            }}>
              <div style={{ fontSize: '30px', color: 'var(--bdr2)' }}>👤</div>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', color: 'var(--txt3)' }}>
                Operator<br />Photo
              </div>
              <div style={{ fontSize: '8.5px', color: 'var(--txt3)', marginTop: '3px', fontStyle: 'italic' }}>
                Upload from<br />Project &amp; Operator
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Criteria Auto-Evaluation Table */}
      <div className="xl-sec-h" id="sec-verdict-0">
        <span className="ic">📋</span>Qualification Criteria Auto-Evaluation
      </div>
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
              <td style={{ textAlign: 'center' }}><b>1</b></td>
              <td className="txt-l">Post-Test Score (After Training)</td>
              <td style={{ textAlign: 'center' }}>25%</td>
              <td style={{ textAlign: 'center' }}>≥ 80%</td>
              <td style={{ textAlign: 'center' }}><b>{postPct.toFixed(0)}%</b></td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${c1Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c1Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ textAlign: 'center' }}><b>2</b></td>
              <td className="txt-l">Improvement Index (Pre → Post)</td>
              <td style={{ textAlign: 'center' }}>10%</td>
              <td style={{ textAlign: 'center' }}>≥ 15%</td>
              <td style={{ textAlign: 'center' }}><b>{imp >= 0 ? '+' : ''}{imp.toFixed(0)}%</b></td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${c2Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c2Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ textAlign: 'center' }}><b>3</b></td>
              <td className="txt-l">Assessment Checklist Compliance</td>
              <td style={{ textAlign: 'center' }}>20%</td>
              <td style={{ textAlign: 'center' }}>≥ 80% &amp; 0 fail</td>
              <td style={{ textAlign: 'center' }}><b>{chkPct.toFixed(0)}%</b></td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${c3Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c3Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ textAlign: 'center' }}><b>4</b></td>
              <td className="txt-l">DFT Compliance (SSPC PA-2)</td>
              <td style={{ textAlign: 'center' }}>20%</td>
              <td style={{ textAlign: 'center' }}>≥ 90% spots in 80%-120% range</td>
              <td style={{ textAlign: 'center' }}>
                <b>{dftSpotsValid === 0 ? '—' : `${dftSpotsOK}/${dftSpotsValid}`}</b>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${c4Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c4Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ textAlign: 'center' }}><b>5</b></td>
              <td className="txt-l">Process Inspection Pass Rate</td>
              <td style={{ textAlign: 'center' }}>15%</td>
              <td style={{ textAlign: 'center' }}>≥ 80% &amp; 0 fail</td>
              <td style={{ textAlign: 'center' }}><b>{inspPct.toFixed(0)}%</b></td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${c5Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c5Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ textAlign: 'center' }}><b>6</b></td>
              <td className="txt-l">Environmental Conditions</td>
              <td style={{ textAlign: 'center' }}>10%</td>
              <td style={{ textAlign: 'center' }}>RH≤85%, MT−DP≥3°C</td>
              <td style={{ textAlign: 'center' }}>
                <b>{totalEnvValid === 0 ? '—' : `${okEnvCount}/${totalEnvValid} OK`}</b>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${c6Met ? 'pf-pass' : 'pf-fail'}`}>
                  {c6Met ? 'MET' : 'NOT MET'}
                </span>
              </td>
            </tr>

            <tr style={{ background: 'linear-gradient(180deg,#F4E5C7,#E9D7B0)', fontWeight: 700 }}>
              <td colSpan="2" className="txt-l" style={{ fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)', fontSize: '13px' }}>
                OVERALL WEIGHTED SCORE
              </td>
              <td colSpan="2" style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)' }}>100%</td>
              <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', color: 'var(--o1)', fontSize: '15px' }}>
                {overall.toFixed(1)}%
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`pf-badge ${verdict === 'PASS' ? 'pf-pass' : verdict === 'FAIL' ? 'pf-fail' : 'pf-pending'}`}>
                  {verdict === 'PASS' ? 'QUALIFIED' : verdict === 'FAIL' ? 'REJECTED' : 'PENDING'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Remark Box */}
      <div className="remark-box" style={{ marginTop: '14px' }}>
        <div className="remark-l">🏁 Final Examiner Remark</div>
        <textarea
          className="remark-t"
          id="f-remark-final"
          rows={3}
          placeholder="Official examiner summary, certificate issuance approval, re-test prerequisites, or comments..."
          value={formData?.['f-remark-final'] || formData?.remarkFinal || ''}
          onChange={(e) => {
            onChange('f-remark-final', e.target.value);
            onChange('remarkFinal', e.target.value);
          }}
        />
      </div>

      {/* Authorization & Signature Section */}
      <div className="xl-sec-h" id="sec-verdict-1">
        <span className="ic">✍️</span>Authorization &amp; Signature
      </div>
      <div className="sig-grid">
        {/* Signature 1: Site Team */}
        <div className="sig-box">
          <div className="sig-box-h">Performed By (Site Team)</div>
          <div className="sig-line">
            <span className="sig-signed" id="sig1-disp">
              {formData?.['sig1-name'] || '_______'}
            </span>
          </div>
          <div className="sig-meta">
            <input
              type="text"
              id="sig1-name"
              placeholder="Name"
              value={formData?.['sig1-name'] || ''}
              onChange={(e) => handleInputChange('sig1-name', e.target.value)}
            />
            <input
              type="date"
              id="sig1-date"
              value={formData?.['sig1-date'] || ''}
              onChange={(e) => handleInputChange('sig1-date', e.target.value)}
            />
          </div>
          <div
            className="sig-stamp-area"
            id="sig1-stamp-area"
            tabIndex={0}
            onClick={() => fileInputRef1.current?.click()}
            style={{ height: '80px', marginTop: '8px', position: 'relative' }}
          >
            {sigStamps[1] ? (
              <>
                <img
                  src={sigStamps[1]}
                  alt="Site Team Stamp"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
                <button
                  className="sig-stamp-rm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onStampRemove) onStampRemove(1);
                  }}
                  title="Remove Stamp"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <div className="sa-ic" style={{ fontSize: '18px' }}>🔖</div>
                <div className="sa-l">Stamp</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="sig1-stamp-input"
            ref={fileInputRef1}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => onStampUpload && onStampUpload(1, e)}
          />
        </div>

        {/* Signature 2: QA/QC Inspector */}
        <div className="sig-box">
          <div className="sig-box-h">QA/QC Inspector</div>
          <div className="sig-line">
            <span className="sig-signed" id="sig2-disp">
              {formData?.['sig2-name'] || '_______'}
            </span>
          </div>
          <div className="sig-meta">
            <input
              type="text"
              id="sig2-name"
              placeholder="Name"
              value={formData?.['sig2-name'] || ''}
              onChange={(e) => handleInputChange('sig2-name', e.target.value)}
            />
            <input
              type="date"
              id="sig2-date"
              value={formData?.['sig2-date'] || ''}
              onChange={(e) => handleInputChange('sig2-date', e.target.value)}
            />
          </div>
          <div
            className="sig-stamp-area"
            id="sig2-stamp-area"
            tabIndex={0}
            onClick={() => fileInputRef2.current?.click()}
            style={{ height: '80px', marginTop: '8px', position: 'relative' }}
          >
            {sigStamps[2] ? (
              <>
                <img
                  src={sigStamps[2]}
                  alt="QA/QC Stamp"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
                <button
                  className="sig-stamp-rm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onStampRemove) onStampRemove(2);
                  }}
                  title="Remove Stamp"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <div className="sa-ic" style={{ fontSize: '18px' }}>🔖</div>
                <div className="sa-l">Stamp</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="sig2-stamp-input"
            ref={fileInputRef2}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => onStampUpload && onStampUpload(2, e)}
          />
        </div>

        {/* Signature 3: Client Approval */}
        <div className="sig-box">
          <div className="sig-box-h">Client Approval</div>
          <div className="sig-line">
            <span className="sig-signed" id="sig3-disp">
              {formData?.['sig3-name'] || '_______'}
            </span>
          </div>
          <div className="sig-meta">
            <input
              type="text"
              id="sig3-name"
              placeholder="Client Representative"
              value={formData?.['sig3-name'] || ''}
              onChange={(e) => handleInputChange('sig3-name', e.target.value)}
            />
            <input
              type="date"
              id="sig3-date"
              value={formData?.['sig3-date'] || ''}
              onChange={(e) => handleInputChange('sig3-date', e.target.value)}
            />
          </div>
          <div
            className="sig-stamp-area"
            id="sig3-stamp-area"
            tabIndex={0}
            onClick={() => fileInputRef3.current?.click()}
            style={{ height: '80px', marginTop: '8px', position: 'relative' }}
          >
            {sigStamps[3] ? (
              <>
                <img
                  src={sigStamps[3]}
                  alt="Client Stamp"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
                <button
                  className="sig-stamp-rm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onStampRemove) onStampRemove(3);
                  }}
                  title="Remove Stamp"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <div className="sa-ic" style={{ fontSize: '18px' }}>🔖</div>
                <div className="sa-l">Stamp</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="sig3-stamp-input"
            ref={fileInputRef3}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => onStampUpload && onStampUpload(3, e)}
          />
        </div>
      </div>

      {/* Standard Button Row */}
      <div className="btn-row btn-row-std">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidateApprove}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button
          type="button"
          className="btn nx"
          onClick={() => onNavigate && onNavigate('painter', 'register')}
        >
          Next: Report Register →
        </button>
      </div>
    </div>
  );
}
