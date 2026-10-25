// src/tools/painter/PainterChecklist.jsx
import React from 'react';
import { CHECK_ELEMENTS } from '../../data/painterDatabase';

export default function PainterChecklist({
  formData,
  onChange,
  evaluation,
  onSaveDraft,
  onValidateApprove,
  onReset,
  onNavigate
}) {
  const {
    chkPass = 0,
    chkFail = 0,
    chkPend = 13,
    chkPct = 0
  } = evaluation || {};

  const checkResults = formData?._check || [];

  const handleResultChange = (index, value) => {
    const updated = [...checkResults];
    updated[index] = { ...updated[index], r: value };
    onChange('_check', updated);
  };

  const handleCommentChange = (index, value) => {
    const updated = [...checkResults];
    updated[index] = { ...updated[index], c: value };
    onChange('_check', updated);
  };

  const handleSetAll = (val) => {
    const updated = CHECK_ELEMENTS.map((_, i) => ({
      r: val,
      c: checkResults[i]?.c || (val === 'Pass' ? 'Satisfactory' : '')
    }));
    onChange('_check', updated);
  };

  const handleResetChecklist = () => {
    const updated = CHECK_ELEMENTS.map(() => ({ r: '', c: '' }));
    onChange('_check', updated);
  };

  return (
    <div className="sheet" id="sh-checklist">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">SPRAY PAINTER / PAINT APPLICATOR ASSESSMENT CHECKLIST</div>
          <div className="xl-corp-s">13 Critical Assessment Elements · Pass / Fail / N.A. with auto-calculated compliance %</div>
        </div>
      </div>

      <div className="compl-bar" id="check-compl">
        <div className="compl-item">
          <div className="compl-dot g" />
          <span className="compl-lbl">Pass:</span>
          <span className="compl-val" id="check-pass">{chkPass}</span>
        </div>
        <div className="compl-item">
          <div className="compl-dot r" />
          <span className="compl-lbl">Fail:</span>
          <span className="compl-val" id="check-fail">{chkFail}</span>
        </div>
        <div className="compl-item">
          <div className="compl-dot y" />
          <span className="compl-lbl">Pending:</span>
          <span className="compl-val" id="check-pend">{chkPend}</span>
        </div>
        <div
          className="compl-pct"
          id="check-pct"
          style={{ color: chkPct >= 80 && chkFail === 0 ? 'var(--gr)' : chkFail > 0 ? 'var(--rd)' : 'var(--gy)' }}
        >
          {chkPct}% COMPLIANT
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-save"
          onClick={() => handleSetAll('Pass')}
          title="Mark all 13 items as Pass"
        >
          ✓ Set All Pass
        </button>
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleResetChecklist}
          title="Reset all checklist items"
        >
          ↺ Reset Checklist
        </button>
      </div>

      <div className="xl-tbl-w">
        <table className="xl-tbl" id="check-tbl">
          <thead>
            <tr>
              <th style={{ width: '42px' }}>Step</th>
              <th style={{ width: 'auto', textAlign: 'left', paddingLeft: '12px' }}>Assessment Element</th>
              <th style={{ width: '130px' }}>Result</th>
              <th style={{ width: 'auto' }}>Comments</th>
            </tr>
          </thead>
          <tbody id="check-tbody">
            {CHECK_ELEMENTS.map((elem, i) => {
              const item = checkResults[i] || {};
              return (
                <tr key={i}>
                  <td style={{ textAlign: 'center' }}><b>{i + 1}</b></td>
                  <td className="txt-l" style={{ textAlign: 'left', paddingLeft: '12px' }}>{elem}</td>
                  <td>
                    <select
                      className="check-result txt-l-i"
                      value={item.r || ''}
                      onChange={(e) => handleResultChange(i, e.target.value)}
                    >
                      <option value="">— Select —</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="NA">N.A.</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="check-comment txt-l-i"
                      placeholder="Optional remark"
                      value={item.c || ''}
                      onChange={(e) => handleCommentChange(i, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="remark-box" style={{ marginTop: '14px' }}>
        <div className="remark-l">📌 Overall Checklist Remark</div>
        <textarea
          className="remark-t"
          id="f-remark-check"
          rows={3}
          placeholder="Enter overall checklist observations, strengths, or defects noted during practical evaluation..."
          value={formData?.['f-remark-check'] || formData?.remarkCheck || ''}
          onChange={(e) => {
            onChange('f-remark-check', e.target.value);
            onChange('remarkCheck', e.target.value);
          }}
        />
      </div>

      <div className="btn-row btn-row-std">
        <button type="button" className="btn sd" onClick={onSaveDraft}>💾 Save Draft</button>
        <button type="button" className="btn va" onClick={onValidateApprove}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn rs" onClick={onReset}>↺ Reset</button>
        <button
          type="button"
          className="btn nx"
          onClick={() => onNavigate && onNavigate('painter', 's1')}
        >
          Next: Blasting &amp; Priming →
        </button>
      </div>
    </div>
  );
}
