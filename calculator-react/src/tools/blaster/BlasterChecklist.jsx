import React from 'react';
import { CHECK_ELEMENTS } from '../../data/blasterDatabase';

export default function BlasterChecklist({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const { chkPass = 0, chkFail = 0, chkPend = 12, chkPct = 0 } = metrics;
  const list = state.checklist || [];

  const handleResultChange = (index, result) => {
    const updated = [...list];
    if (!updated[index]) {
      updated[index] = { result: '', comment: '' };
    }
    updated[index] = { ...updated[index], result };
    onChange('checklist', updated);
  };

  const handleCommentChange = (index, comment) => {
    const updated = [...list];
    if (!updated[index]) {
      updated[index] = { result: '', comment: '' };
    }
    updated[index] = { ...updated[index], comment };
    onChange('checklist', updated);
  };

  return (
    <div className="sheet act" id="sh-checklist">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">BLASTER / OPERATOR ASSESSMENT CHECKLIST</div>
          <div className="xl-corp-s">12 Critical Assessment Elements · Pass / Fail / N.A. with auto-calculated compliance %</div>
        </div>
      </div>

      <div className="compl-bar" id="check-compl">
        <div className="compl-item">
          <div className="compl-dot g"></div>
          <span className="compl-lbl">Pass:</span>
          <span className="compl-val" id="check-pass">{chkPass}</span>
        </div>
        <div className="compl-item">
          <div className="compl-dot r"></div>
          <span className="compl-lbl">Fail:</span>
          <span className="compl-val" id="check-fail">{chkFail}</span>
        </div>
        <div className="compl-item">
          <div className="compl-dot y"></div>
          <span className="compl-lbl">Pending:</span>
          <span className="compl-val" id="check-pend">{chkPend}</span>
        </div>
        <div className="compl-pct" id="check-pct" style={{ color: chkPct === 100 ? 'var(--gr)' : 'var(--o1)' }}>
          {Math.round(chkPct)}% COMPLIANT
        </div>
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
            {CHECK_ELEMENTS.map((elem, idx) => {
              const currentRes = list[idx]?.result || '';
              const currentComm = list[idx]?.comment || '';
              return (
                <tr key={idx}>
                  <td><b>{idx + 1}</b></td>
                  <td className="txt-l">{elem}</td>
                  <td>
                    <select 
                      className="check-result" 
                      value={currentRes} 
                      onChange={(e) => handleResultChange(idx, e.target.value)}
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
                      value={currentComm} 
                      onChange={(e) => handleCommentChange(idx, e.target.value)} 
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
          onClick={() => onNavigate('blasting')}
        >
          Next: Blasting Process →
        </button>
      </div>
    </div>
  );
}
