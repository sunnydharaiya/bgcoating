import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

function clpHealth(hi) {
  if (hi >= 90) return { t: 'Excellent', fac: 1.00, col: '#2E7D32', rec: 'The coating system is performing as expected. Continue routine inspection in accordance with the maintenance plan.', insp: 3 };
  if (hi >= 75) return { t: 'Good', fac: 0.90, col: '#1565C0', rec: 'Minor localized repairs may be required. Continue periodic inspection and preventive maintenance.', insp: 2 };
  if (hi >= 60) return { t: 'Fair', fac: 0.75, col: '#E8700A', rec: 'Plan maintenance painting or localized repairs to prevent accelerated deterioration.', insp: 1 };
  if (hi >= 40) return { t: 'Poor', fac: 0.50, col: '#C62828', rec: 'Significant coating degradation detected. Major maintenance painting should be scheduled within the next maintenance cycle.', insp: 1 };
  return { t: 'Critical', fac: 0.25, col: '#8B0000', rec: 'Coating system has reached the end of its effective service life. Complete surface preparation and recoating are recommended to prevent substrate corrosion.', insp: 0.5 };
}

export default function CoatingLifePredictionTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Section A
  const [proj, setProj] = useState('');
  const [str, setStr] = useState('');
  const [env, setEnv] = useState('C3');
  const [sys, setSys] = useState('Zn Epoxy + MIO + PU');
  const [dft, setDft] = useState('280');
  const [yr, setYr] = useState('2018');
  const [dl, setDl] = useState('20');
  const [ageInput, setAgeInput] = useState('');

  // Section B
  const [rust, setRust] = useState('0');
  const [bli, setBli] = useState('0');
  const [crk, setCrk] = useState('0');
  const [flk, setFlk] = useState('0');
  const [chk, setChk] = useState('0');
  const [adh, setAdh] = useState('Pass');
  const [holi, setHoli] = useState('Not Tested');

  // Section C
  const [rep, setRep] = useState('0');
  const [tch, setTch] = useState('0');
  const [mrc, setMrc] = useState('No');

  const [hasCalculated, setHasCalculated] = useState(true);

  const nowY = new Date().getFullYear();
  const dlVal = parseFloat(dl) || 0;
  const yrVal = parseFloat(yr);

  let currentAge = parseFloat(ageInput);
  if (isNaN(currentAge)) {
    currentAge = !isNaN(yrVal) ? Math.max(0, nowY - yrVal) : 0;
  }

  const remaining = Math.max(0, dlVal - currentAge);

  // Health index calculations
  const rustVal = parseFloat(rust) || 0;
  const bliVal = parseInt(bli) || 0;
  const crkVal = parseInt(crk) || 0;
  const flkVal = parseInt(flk) || 0;
  const chkVal = parseInt(chk) || 0;
  const repVal = parseFloat(rep) || 0;
  const tchVal = parseFloat(tch) || 0;
  const isMajorRecoat = mrc === 'Yes';

  let hi = 100;
  const ded = [];

  const dRust = rustVal <= 0 ? 0 : rustVal <= 0.05 ? 3 : rustVal <= 0.5 ? 8 : rustVal <= 1 ? 15 : rustVal <= 8 ? 30 : 45;
  if (dRust) { hi -= dRust; ded.push(`Rusting ${rustVal}% −${dRust}`); }
  if (bliVal) { hi -= bliVal * 4; ded.push(`Blistering ${bliVal} −${bliVal * 4}`); }
  if (crkVal) { hi -= crkVal * 4; ded.push(`Cracking ${crkVal} −${crkVal * 4}`); }
  if (flkVal) { hi -= flkVal * 4; ded.push(`Flaking ${flkVal} −${flkVal * 4}`); }
  if (chkVal) { hi -= chkVal * 2; ded.push(`Chalking ${chkVal} −${chkVal * 2}`); }
  if (adh === 'Marginal') { hi -= 10; ded.push('Adhesion marginal −10'); }
  if (adh === 'Fail') { hi -= 25; ded.push('Adhesion FAIL −25'); }
  if (holi === 'Fail') { hi -= 10; ded.push('Holiday FAIL −10'); }

  const dRep = Math.min(10, repVal * 1);
  if (dRep) { hi -= dRep; ded.push(`${repVal} repairs −${dRep}`); }
  const dTch = Math.min(5, tchVal * 0.5);
  if (dTch) { hi -= dTch; ded.push(`${tchVal} touch-ups −${formatNum(dTch, 1)}`); }

  hi = Math.max(0, Math.min(100, hi));
  const h = clpHealth(hi);
  const adjRL = remaining * h.fac;
  const recoatY = Math.round(nowY + adjRL);
  const nextInsp = nowY + Math.min(h.insp, Math.max(0.5, adjRL / 2));
  const overAge = remaining <= 0;

  // Timeline geometry
  const startY = !isNaN(yrVal) ? yrVal : Math.round(nowY - currentAge);
  const endY = Math.max(startY + dlVal, recoatY) + 1;
  const span = endY - startY || 1;
  const X = y => Math.min(100, Math.max(0, ((y - startY) / span) * 100));

  const handleCalculate = () => {
    if (!dlVal) {
      addToast('Missing Input', 'Enter Design Life.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Life Prediction Calculated', `Health Index: ${formatNum(hi, 0)}% (${h.t})`, 'success');
  };

  const handleReset = () => {
    setProj('');
    setStr('');
    setEnv('C3');
    setSys('Zn Epoxy + MIO + PU');
    setDft('280');
    setYr('2018');
    setDl('20');
    setAgeInput('');
    setRust('0');
    setBli('0');
    setCrk('0');
    setFlk('0');
    setChk('0');
    setAdh('Pass');
    setHoli('Not Tested');
    setRep('0');
    setTch('0');
    setMrc('No');
    setHasCalculated(false);
    addToast('Reset', 'Form cleared.', 'info');
  };

  const handleExportCSV = () => {
    const rows = [
      ['Project Name', proj || '—'],
      ['Structure Name', str || '—'],
      ['Environment', env],
      ['Coating System', sys],
      ['Total DFT (µm)', dft || '—'],
      ['Year Applied', yr || '—'],
      ['Design Life (years)', dlVal],
      ['Current Age (years)', formatNum(currentAge, 1)],
      ['Coating Health Index (%)', formatNum(hi, 0)],
      ['Condition Classification', h.t],
      ['Condition Factor', `${formatNum(h.fac * 100, 0)}%`],
      ['Adjusted Remaining Life (years)', formatNum(adjRL, 1)],
      ['Estimated Recoating Year', recoatY],
      ['Next Inspection Due', `≈ ${formatNum(nextInsp, 1)}`],
      ['Deductions', ded.join('; ') || 'None']
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Coating_Life_Prediction_${proj || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', 'Exported to CSV.', 'success');
  };

  return (
    <div className="sub-sec card active" id="ce-life">
      <div className="ch">
        <div className="ci">🩺</div>
        <div>
          <div className="ct">Coating Life Prediction Calculator</div>
          <div className="cs">Health index from ISO 4628 findings · condition factor · adjusted remaining life · recoat year</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('ce-life')}>📖 Guideline</button>
        <div className="ctag">PRO · CE-2</div>
      </div>

      <div className="cb">
        <div className="input-section">
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', marginBottom: '8px' }}>
            A · Project &amp; Coating Information
          </div>
          <div className="g2">
            <div className="field">
              <label>Project Name <span className="lh">optional</span></label>
              <div className="iw">
                <input
                  type="text"
                  value={proj}
                  onChange={e => setProj(e.target.value)}
                  placeholder="e.g. Offshore Deck Module M-2"
                />
              </div>
            </div>
            <div className="field">
              <label>Structure Name <span className="lh">optional</span></label>
              <div className="iw">
                <input
                  type="text"
                  value={str}
                  onChange={e => setStr(e.target.value)}
                  placeholder="e.g. Main Deck Plating"
                />
              </div>
            </div>
            <div className="field">
              <label>Environment (ISO 12944)</label>
              <div className="iw">
                <select
                  value={env}
                  onChange={e => setEnv(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>C1</option>
                  <option>C2</option>
                  <option>C3</option>
                  <option>C4</option>
                  <option>C5</option>
                  <option>CX</option>
                  <option>Im1</option>
                  <option>Im2</option>
                  <option>Im3</option>
                  <option>Im4</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Coating System <span className="lh">optional</span></label>
              <div className="iw">
                <input
                  type="text"
                  value={sys}
                  onChange={e => setSys(e.target.value)}
                  placeholder="e.g. Zn Epoxy + MIO + PU"
                />
              </div>
            </div>
            <div className="field">
              <label>Total DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={dft}
                  onChange={e => setDft(e.target.value)}
                  placeholder="e.g. 280"
                  min="0"
                  step="any"
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Year Applied</label>
              <div className="iw">
                <input
                  type="number"
                  value={yr}
                  onChange={e => setYr(e.target.value)}
                  placeholder="e.g. 2018"
                  min="1950"
                  max="2100"
                  step="1"
                />
                <span className="uu">yr</span>
              </div>
            </div>
            <div className="field">
              <label>Design Life <span className="lh">years</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={dl}
                  onChange={e => setDl(e.target.value)}
                  placeholder="e.g. 20"
                  min="1"
                  step="any"
                />
                <span className="uu">yrs</span>
              </div>
            </div>
            <div className="field">
              <label>Current Age <span className="lh">years · blank = auto from year applied</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={ageInput}
                  onChange={e => setAgeInput(e.target.value)}
                  placeholder="Auto"
                  min="0"
                  step="any"
                />
                <span className="uu">yrs</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Inspection Findings (ISO 4628)
          </div>
          <div className="g2">
            <div className="field">
              <label>Rusting <span className="lh">% of area · ISO 4628-3</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={rust}
                  onChange={e => setRust(e.target.value)}
                  min="0"
                  max="100"
                  step="any"
                />
                <span className="uu">%</span>
              </div>
            </div>
            <div className="field">
              <label>Blistering <span className="lh">ISO 4628-2 · 0 = none</span></label>
              <div className="iw">
                <select
                  value={bli}
                  onChange={e => setBli(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="0">0 — None</option>
                  <option value="1">1 — Very slight</option>
                  <option value="2">2 — Slight</option>
                  <option value="3">3 — Moderate</option>
                  <option value="4">4 — Considerable</option>
                  <option value="5">5 — Dense/Severe</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Cracking <span className="lh">ISO 4628-4</span></label>
              <div className="iw">
                <select
                  value={crk}
                  onChange={e => setCrk(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="0">0 — None</option>
                  <option value="1">1 — Very slight</option>
                  <option value="2">2 — Slight</option>
                  <option value="3">3 — Moderate</option>
                  <option value="4">4 — Considerable</option>
                  <option value="5">5 — Severe</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Flaking <span className="lh">ISO 4628-5</span></label>
              <div className="iw">
                <select
                  value={flk}
                  onChange={e => setFlk(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="0">0 — None</option>
                  <option value="1">1 — Very slight</option>
                  <option value="2">2 — Slight</option>
                  <option value="3">3 — Moderate</option>
                  <option value="4">4 — Considerable</option>
                  <option value="5">5 — Severe</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Chalking <span className="lh">ISO 4628-6</span></label>
              <div className="iw">
                <select
                  value={chk}
                  onChange={e => setChk(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="0">0 — None</option>
                  <option value="1">1 — Very slight</option>
                  <option value="2">2 — Slight</option>
                  <option value="3">3 — Moderate</option>
                  <option value="4">4 — Considerable</option>
                  <option value="5">5 — Severe</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Adhesion Result <span className="lh">ASTM D4541 / D3359</span></label>
              <div className="iw">
                <select
                  value={adh}
                  onChange={e => setAdh(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Pass</option>
                  <option>Marginal</option>
                  <option>Fail</option>
                  <option>Not Tested</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Holiday Test <span className="lh">optional</span></label>
              <div className="iw">
                <select
                  value={holi}
                  onChange={e => setHoli(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Not Tested</option>
                  <option>Pass</option>
                  <option>Fail</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Maintenance History
          </div>
          <div className="g2">
            <div className="field">
              <label>Number of Repairs</label>
              <div className="iw">
                <input
                  type="number"
                  value={rep}
                  onChange={e => setRep(e.target.value)}
                  min="0"
                  step="1"
                />
                <span className="uu">nos</span>
              </div>
            </div>
            <div className="field">
              <label>Number of Touch-ups</label>
              <div className="iw">
                <input
                  type="number"
                  value={tch}
                  onChange={e => setTch(e.target.value)}
                  min="0"
                  step="1"
                />
                <span className="uu">nos</span>
              </div>
            </div>
            <div className="field">
              <label>Major Recoating Performed?</label>
              <div className="iw">
                <select
                  value={mrc}
                  onChange={e => setMrc(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Predict Coating Life</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {hasCalculated && dlVal > 0 && (
          <div className="res" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Coating Life Prediction Result</div>

              {/* Verdict Banner */}
              <div style={{
                background: hi >= 75 ? '#E8F5E9' : hi >= 60 ? '#FFF8E1' : '#FFEBEE',
                border: `1.5px solid ${h.col}55`,
                borderRadius: 'var(--r)',
                padding: '13px 16px',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '19px',
                  fontWeight: 700,
                  color: h.col
                }}>
                  🩺 Health Index {formatNum(hi, 0)}% — {h.t} {overAge ? ' · BEYOND DESIGN LIFE' : ''}
                </div>
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: h.col,
                  marginTop: '3px'
                }}>
                  Age {formatNum(currentAge, 1)} of {dlVal} yrs ({env}) · Adjusted remaining life {formatNum(adjRL, 1)} yrs (× {formatNum(h.fac * 100, 0)}% condition factor) · Est. recoat {recoatY}
                </div>
              </div>

              {/* Primary Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Adjusted Remaining Life</div>
                  <div><span className="tv">{formatNum(adjRL, 1)}</span><span className="tu">yrs</span></div>
                  <div className="tn">{formatNum(remaining, 1)} yrs nominal × {formatNum(h.fac * 100, 0)}% ({h.t})</div>
                </div>
                <div className="tile ts">
                  <div className="tl">Coating Health Index</div>
                  <div><span className="tv">{formatNum(hi, 0)}</span><span className="tu">%</span></div>
                  <div className="tn">{h.t}{isMajorRecoat ? ' · after major recoat' : ''}</div>
                </div>
                <div className="tile ti">
                  <div className="tl">Design / Age / Remaining</div>
                  <div><span className="tv" style={{ fontSize: '22px' }}>{dlVal} / {formatNum(currentAge, 1)} / {formatNum(remaining, 1)}</span></div>
                  <div className="tn">years</div>
                </div>
                <div className="tile tg">
                  <div className="tl">Estimated Recoating Year</div>
                  <div><span className="tv">{recoatY}</span></div>
                  <div className="tn">Next inspection due ≈ {formatNum(nextInsp, 1)} ({hi < 40 ? 'immediate action' : 'per condition'})</div>
                </div>
              </div>

              {/* Health Index Gauge */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Coating Health Index
                </div>
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(90deg,#8B0000 0%,#C62828 40%,#E8700A 60%,#1565C0 75%,#2E7D32 90%,#1B5E20 100%)',
                  height: '22px',
                  borderRadius: '20px',
                  border: '1px solid var(--bdr)'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${hi}%`,
                    top: '-5px',
                    bottom: '-5px',
                    width: '4px',
                    background: '#111',
                    borderRadius: '2px',
                    transform: 'translateX(-50%)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: `${hi}%`,
                    top: '-24px',
                    transform: 'translateX(-50%)',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--txt)'
                  }}>
                    {formatNum(hi, 0)}%
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--txt3)', marginTop: '3px' }}>
                  <span>0 Critical</span><span>40 Poor</span><span>60 Fair</span><span>75 Good</span><span>90 Excellent</span><span>100</span>
                </div>
                {ded.length > 0 ? (
                  <div style={{ fontSize: '10.5px', color: 'var(--txt3)', marginTop: '5px' }}>
                    Deductions: {ded.join(' · ')}
                  </div>
                ) : (
                  <div style={{ fontSize: '10.5px', color: '#2E7D32', marginTop: '5px' }}>
                    No defects recorded — full health.
                  </div>
                )}
              </div>

              {/* Service Life Timeline */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Service Life Timeline
                </div>
                <div style={{ position: 'relative', height: '26px', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '20px' }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: `${X(nowY)}%`,
                    top: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg,#66BB6A,${h.col})`,
                    borderRadius: '20px 0 0 20px',
                    opacity: 0.75
                  }} />
                  <div title="Applied" style={{ position: 'absolute', left: `${X(startY)}%`, top: '-4px', bottom: '-4px', width: '3px', background: '#1565C0' }} />
                  <div title="Today" style={{ position: 'absolute', left: `${X(nowY)}%`, top: '-4px', bottom: '-4px', width: '3px', background: '#111' }} />
                  <div title="Predicted recoat" style={{ position: 'absolute', left: `${X(recoatY)}%`, top: '-4px', bottom: '-4px', width: '3px', background: '#C62828' }} />
                  <div title="Design end" style={{ position: 'absolute', left: `${X(startY + dlVal)}%`, top: '-4px', bottom: '-4px', width: '3px', background: '#B26A00' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'var(--txt2)', marginTop: '3px' }}>
                  <span>🔵 Applied {startY}</span>
                  <span>⬛ Today {nowY}</span>
                  <span>🟥 Recoat ≈ {recoatY}</span>
                  <span>🟧 Design end {startY + dlVal}</span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div style={{
                marginTop: '12px',
                padding: '11px 14px',
                background: '#FDF1E4',
                border: '1px solid var(--bdr2)',
                borderLeft: `3px solid ${h.col}`,
                borderRadius: 'var(--r)',
                fontSize: '12px',
                color: 'var(--txt2)',
                lineHeight: 1.7
              }}>
                <strong style={{ color: h.col }}>🛠 Recommended Maintenance Action — {h.t}:</strong> {h.rec}
                {overAge && ' The coating is beyond its nominal design life — prioritise condition-based planning.'}
              </div>

              {/* Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Coating Condition Summary</div>
                <div className="dr"><span className="dk">Project / Structure</span><span className="dv">{(proj || '—') + ' — ' + (str || '—')}</span></div>
                <div className="dr"><span className="dk">Environment</span><span className="dv">{env}</span></div>
                <div className="dr"><span className="dk">Coating System</span><span className="dv">{sys + (dft ? ` · ${dft} µm` : '')}</span></div>
                <div className="dr"><span className="dk">Year Applied / Age</span><span className="dv">{(yr || '—') + ' / ' + formatNum(currentAge, 1) + ' yrs'}</span></div>
                <div className="dr"><span className="dk">Design Life</span><span className="dv">{dlVal} yrs</span></div>
                <div className="dr"><span className="dk">Nominal Remaining</span><span className="dv">{formatNum(remaining, 1)} yrs</span></div>
                <div className="dr"><span className="dk">Findings</span><span className="dv">{`Rust ${rustVal}% · Bli ${bliVal} · Crk ${crkVal} · Flk ${flkVal} · Chk ${chkVal} · Adhesion ${adh} · Holiday ${holi}`}</span></div>
                <div className="dr"><span className="dk">History</span><span className="dv">{`${repVal} repairs · ${tchVal} touch-ups · Major recoat: ${mrc}`}</span></div>
                <div className="dr"><span className="dk">Coating Health Index</span><span className="dv" style={{ fontWeight: 700, color: h.col }}>{formatNum(hi, 0)}% — {h.t}</span></div>
                <div className="dr"><span className="dk">Condition Factor</span><span className="dv">{formatNum(h.fac * 100, 0)}%</span></div>
                <div className="dr"><span className="dk">Adjusted Remaining Life</span><span className="dv">{formatNum(adjRL, 1)} yrs</span></div>
                <div className="dr"><span className="dk">Next Inspection Due</span><span className="dv">≈ {formatNum(nextInsp, 1)}</span></div>
                <div className="dr"><span className="dk">Estimated Recoating Year</span><span className="dv">{recoatY}</span></div>
              </div>

              {/* Classification & References */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>Health Classification:</strong> 90–100% Excellent · 75–90% Good · 60–75% Fair · 40–60% Poor · &lt;40% Critical &nbsp;|&nbsp; <strong>References:</strong> ISO 12944-1/-9 · ISO 4628 · AMPP · NORSOK M-501 · API RP 652 / RP 651
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
              <button className="btn-share" onClick={() => {
                const text = `Coating Life Prediction: Health Index ${formatNum(hi, 0)}% (${h.t}) | Adj. Remaining: ${formatNum(adjRL, 1)} yrs | Recoat Year: ${recoatY}`;
                navigator.clipboard?.writeText(text);
                addToast('Copied', 'Summary copied to clipboard.', 'success');
              }}>📤 Share Text</button>
              <button className="btn-print" onClick={handleExportCSV}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={handleExportCSV}>📊 Excel Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
