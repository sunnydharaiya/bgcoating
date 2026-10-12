import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

const HOL_TABLE = [
  [250, 1.5],
  [500, 2.5],
  [1000, 3.5],
  [1500, 4.5],
  [2000, 5.5],
  [3000, 7.0]
];

function holTableLookup(dft) {
  if (!dft || dft <= 0) return 0;
  const t = HOL_TABLE;
  if (dft <= t[0][0]) return t[0][1] * dft / t[0][0] < 0.5 ? 0.5 : t[0][1] * Math.max(0.4, dft / t[0][0]);
  if (dft >= t[t.length - 1][0]) {
    const [d1, v1] = t[t.length - 2];
    const [d2, v2] = t[t.length - 1];
    return v2 + (dft - d2) * (v2 - v1) / (d2 - d1);
  }
  for (let i = 0; i < t.length - 1; i++) {
    if (dft >= t[i][0] && dft <= t[i + 1][0]) {
      const [d1, v1] = t[i];
      const [d2, v2] = t[i + 1];
      return v1 + (dft - d1) * (v2 - v1) / (d2 - d1);
    }
  }
  return t[0][1];
}

export default function HolidayVoltageTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [proj, setProj] = useState('');
  const [coatingType, setCoatingType] = useState('Epoxy');
  const [dft, setDft] = useState('1500');
  const [method, setMethod] = useState('ASTM G62 — Formula (V = 525 × √t mils)');
  const [hasCalculated, setHasCalculated] = useState(true);

  const dftVal = parseFloat(dft) || 0;
  const useG62 = method.includes('G62');
  const mils = dftVal > 0 ? dftVal / 25.4 : 0;
  const vG62 = mils > 0 ? 525 * Math.sqrt(mils) : 0;
  const kvG62 = vG62 / 1000;
  const kvTab = holTableLookup(dftVal);
  const kvSel = useG62 ? kvG62 : kvTab;
  const lowV = dftVal <= 500 && dftVal > 0;

  const handleCalculate = () => {
    if (!dftVal) {
      addToast('Missing Input', 'Enter DFT in microns.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Test Voltage', `Recommended: ${formatNum(kvSel, 1)} kV`, 'success');
  };

  const handleReset = () => {
    setProj('');
    setCoatingType('Fusion Bonded Epoxy');
    setDft('');
    setMethod('ASTM G62 — Formula (V = 525 × √t mils)');
    setHasCalculated(false);
    addToast('Reset', 'Form cleared.', 'info');
  };

  const handleExportCSV = () => {
    if (!dftVal) {
      addToast('No Data', 'Enter DFT first.', 'warning');
      return;
    }
    const rows = [
      ['Project Name', proj || '—'],
      ['Coating Type', coatingType],
      ['Specified DFT (µm)', dftVal],
      ['Thickness (mils)', formatNum(mils, 1)],
      ['Preferred Method', method],
      ['Recommended Test Voltage (kV)', formatNum(kvSel, 2)],
      ['ASTM G62 Formula Voltage (kV)', formatNum(kvG62, 2)],
      ['NACE SP0188 Table Voltage (kV)', formatNum(kvTab, 2)]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Holiday_Voltage_${proj || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', 'Exported to CSV.', 'success');
  };

  // Generate SVG curve points 100–3500 µm
  const pts = [];
  for (let d = 100; d <= 3500; d += 100) pts.push(d);
  const maxKv = Math.max(525 * Math.sqrt(3500 / 25.4) / 1000, holTableLookup(3500), kvSel) * 1.1 || 10;
  const X = d => ((d - 100) / (3500 - 100)) * 100;
  const Y = k => 100 - (k / maxKv) * 100;

  const pathG62 = pts.map(d => `${X(d).toFixed(1)},${Y(525 * Math.sqrt(d / 25.4) / 1000).toFixed(1)}`).join(' ');
  const pathTab = pts.map(d => `${X(d).toFixed(1)},${Y(holTableLookup(d)).toFixed(1)}`).join(' ');
  const curX = X(Math.min(3500, Math.max(100, dftVal))).toFixed(1);
  const curY = Y(kvSel).toFixed(1);

  return (
    <div className="sub-sec card active" id="qa-hol">
      <div className="ch">
        <div className="ci">⚡</div>
        <div>
          <div className="ct">Holiday Detection Voltage Calculator</div>
          <div className="cs">High-voltage spark test — ASTM G62 formula &amp; NACE/AMPP SP0188 lookup</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('qa-hol')}>📖 Guideline</button>
        <div className="ctag">PRO · QA-3</div>
      </div>

      <div className="cb">
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Project Name <span className="lh">optional</span></label>
              <div className="iw">
                <input
                  type="text"
                  value={proj}
                  onChange={e => setProj(e.target.value)}
                  placeholder="e.g. Tank Internal Lining"
                />
              </div>
            </div>
            <div className="field">
              <label>Coating Type</label>
              <div className="iw">
                <select
                  value={coatingType}
                  onChange={e => setCoatingType(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Fusion Bonded Epoxy</option>
                  <option>Epoxy</option>
                  <option>Coal Tar Epoxy</option>
                  <option>Glass Flake</option>
                  <option>Rubber Lining</option>
                  <option>Polyurethane</option>
                  <option>Internal Tank Lining</option>
                  <option>Pipeline Coating</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={dft}
                  onChange={e => setDft(e.target.value)}
                  placeholder="e.g. 1500"
                  min="1"
                  step="any"
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Preferred Method</label>
              <div className="iw">
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>ASTM G62 — Formula (V = 525 × √t mils)</option>
                  <option>NACE / AMPP SP0188 — Lookup Table</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Test Voltage</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {hasCalculated && dftVal > 0 && (
          <div className="res" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Holiday Test Voltage Result</div>

              {/* Verdict Banner */}
              <div style={{
                background: '#E8F5E9',
                border: '1.5px solid rgba(46,125,50,.35)',
                borderRadius: 'var(--r)',
                padding: '13px 16px',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '19px',
                  fontWeight: 700,
                  color: '#1B5E20'
                }}>
                  ⚡ Recommended Test Voltage ≈ {formatNum(kvSel, 1)} kV ({formatNum(kvSel * 1000, 0)} V)
                </div>
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#2E7D32',
                  marginTop: '3px'
                }}>
                  {coatingType} · {dftVal} µm ({formatNum(mils, 1)} mil) · Method: {useG62 ? 'ASTM G62 formula' : 'NACE/AMPP SP0188 table'}
                </div>
              </div>

              {/* Primary KPI Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Recommended Test Voltage</div>
                  <div><span className="tv">{formatNum(kvSel, 1)}</span><span className="tu">kV</span></div>
                  <div className="tn">{(useG62 ? 'ASTM G62 selected' : 'SP0188 table selected') + ' — round to instrument setting'}</div>
                </div>
                <div className="tile ts">
                  <div className="tl">ASTM G62 Formula</div>
                  <div><span className="tv" style={{ fontSize: '22px' }}>{formatNum(kvG62, 2)} kV</span></div>
                  <div className="tn">V = 525 × √{formatNum(mils, 1)} = {formatNum(vG62, 0)} V</div>
                </div>
                <div className="tile ti">
                  <div className="tl">SP0188 Table Value</div>
                  <div><span className="tv" style={{ fontSize: '22px' }}>{formatNum(kvTab, 2)} kV</span></div>
                  <div className="tn">Interpolated from lookup table</div>
                </div>
                <div className="tile tg">
                  <div className="tl">Thickness</div>
                  <div><span className="tv">{formatNum(mils, 1)}</span><span className="tu">mil</span></div>
                  <div className="tn">{dftVal} µm ÷ 25.4</div>
                </div>
              </div>

              {/* Voltage vs DFT Chart */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Voltage vs DFT — both methods, your point marked
                </div>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: '10px' }}>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '150px', display: 'block' }}>
                    <polyline fill="none" stroke="#1565C0" strokeWidth="2" points={pathG62} />
                    <polyline fill="none" stroke="#B26A00" strokeWidth="2" points={pathTab} />
                    <circle cx={curX} cy={curY} r="2.6" fill="#A50021" stroke="#fff" strokeWidth="1" />
                  </svg>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '10.5px', color: 'var(--txt2)', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span><span style={{ display: 'inline-block', width: '14px', height: '3px', background: '#1565C0', verticalAlign: 'middle', marginRight: '5px' }}></span>ASTM G62 formula</span>
                    <span><span style={{ display: 'inline-block', width: '14px', height: '3px', background: '#B26A00', verticalAlign: 'middle', marginRight: '5px' }}></span>SP0188 lookup</span>
                    <span>● Your selection ({dftVal} µm → {formatNum(kvSel, 1)} kV)</span>
                    <span style={{ color: 'var(--txt3)' }}>X: 100–3500 µm · Y: 0–{formatNum(maxKv, 1)} kV</span>
                  </div>
                </div>
              </div>

              {/* Optional Thin Film Notice */}
              {lowV && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FFF9EE', border: '1px solid #FFE082', borderRadius: 'var(--r)', fontSize: '12px', color: '#5D4037' }}>
                  ⚠️ <strong>Thin film detected (≤ 500 µm):</strong> High voltage spark testing may burn through thin coatings. Per ASTM D5162 Type I and NACE SP0188, low-voltage wet sponge testing (67.5 V or 9–90 V) is typically recommended instead of high-voltage spark testing.
                </div>
              )}

              {/* Test Parameters Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Test Parameters Summary</div>
                <div className="dr"><span className="dk">Project</span><span className="dv">{proj || '—'}</span></div>
                <div className="dr"><span className="dk">Coating Type</span><span className="dv">{coatingType}</span></div>
                <div className="dr"><span className="dk">Specified DFT</span><span className="dv">{dftVal} µm ({formatNum(mils, 1)} mil)</span></div>
                <div className="dr"><span className="dk">Method Selected</span><span className="dv">{method}</span></div>
                <div className="dr"><span className="dk">Recommended Voltage</span><span className="dv" style={{ fontWeight: 700, color: 'var(--brand-crimson)' }}>{formatNum(kvSel, 2)} kV ({formatNum(kvSel * 1000, 0)} V)</span></div>
                <div className="dr"><span className="dk">ASTM G62 Calculation</span><span className="dv">{formatNum(kvG62, 2)} kV</span></div>
                <div className="dr"><span className="dk">NACE SP0188 Lookup</span><span className="dv">{formatNum(kvTab, 2)} kV</span></div>
              </div>

              {/* References Callout */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> ASTM D5162 · ASTM G62 · NACE/AMPP SP0188. Always confirm the test voltage against the coating manufacturer's data sheet and project specification before testing. For DFT ≤ 500 µm consider low-voltage wet-sponge testing (ASTM D5162 Type I, typically 9–90 V).
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
              <button className="btn-share" onClick={() => {
                const text = `Holiday Voltage: ${formatNum(kvSel, 1)} kV for ${dftVal}µm ${coatingType} (${method})`;
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
