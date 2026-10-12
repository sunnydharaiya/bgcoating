import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function ISO19840Tool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [proj, setProj] = useState('');
  const [cli, setCli] = useState('');
  const [spec, setSpec] = useState('300');
  const [cv, setCv] = useState('20');
  const [maxDft, setMaxDft] = useState('');
  const [readingsText, setReadingsText] = useState('295, 302, 310, 315, 298');
  const [hasEvaluated, setHasEvaluated] = useState(true);

  // Parse readings
  const reads = readingsText
    .split(/[\s,;]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x) && x > 0);

  const specVal = parseFloat(spec) || 0;
  const cvVal = parseFloat(cv) || 0;
  const maxIn = parseFloat(maxDft);
  const maxA = maxIn > 0 ? maxIn : (specVal > 0 ? specVal * 3 : 0);
  const minA = specVal - cvVal;

  const avg = reads.length > 0 ? reads.reduce((a, b) => a + b, 0) / reads.length : 0;
  const lo = reads.length > 0 ? Math.min(...reads) : 0;
  const hi = reads.length > 0 ? Math.max(...reads) : 0;

  const failLow = reads.filter(x => x < minA).length;
  const failHigh = reads.filter(x => x > maxA).length;
  const avgOk = specVal > 0 && avg >= specVal;
  const isPass = specVal > 0 && reads.length >= 2 && avgOk && failLow === 0 && failHigh === 0;

  const why = [];
  if (!avgOk && specVal > 0) why.push(`Average ${formatNum(avg, 1)} µm < NDFT ${specVal} µm`);
  if (failLow > 0) why.push(`${failLow} reading(s) below (NDFT − CV) = ${formatNum(minA, 0)} µm`);
  if (failHigh > 0) why.push(`${failHigh} reading(s) above maximum ${formatNum(maxA, 0)} µm`);

  const handleEvaluate = () => {
    if (!specVal) {
      addToast('Missing Input', 'Enter Specified DFT (NDFT).', 'warning');
      return;
    }
    if (cv === '') {
      addToast('Missing Input', 'Enter the Correction Value (CV).', 'warning');
      return;
    }
    if (reads.length < 2) {
      addToast('Insufficient Readings', 'Enter at least 2 DFT readings.', 'warning');
      return;
    }
    setHasEvaluated(true);
    addToast(
      'ISO 19840 Evaluated',
      isPass ? `Conforms to ISO 19840 (${formatNum(avg, 1)} µm avg).` : `Non-conforming: ${why.join(' · ')}`,
      isPass ? 'success' : 'warning'
    );
  };

  const handleReset = () => {
    setProj('');
    setCli('');
    setSpec('');
    setCv('25');
    setMaxDft('');
    setReadingsText('');
    setHasEvaluated(false);
    addToast('Reset', 'Form cleared.', 'info');
  };

  const handleExportCSV = () => {
    if (reads.length === 0) {
      addToast('No Data', 'Please enter readings first.', 'warning');
      return;
    }
    const rows = [
      ['Project Name', proj || '—'],
      ['Client', cli || '—'],
      ['Specified NDFT (µm)', specVal],
      ['Correction Value CV (µm)', cvVal],
      ['Min Acceptable NDFT - CV (µm)', minA],
      ['Max Allowed (µm)', maxA],
      ['Average DFT (µm)', formatNum(avg, 1)],
      ['Lowest Reading (µm)', formatNum(lo, 0)],
      ['Highest Reading (µm)', formatNum(hi, 0)],
      ['ISO 19840 Status', isPass ? 'PASS' : 'FAIL'],
      [''],
      ['Readings (µm)', reads.join(', ')]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ISO19840_Inspection_${proj || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', 'Exported to CSV.', 'success');
  };

  const chartMax = Math.max(...(reads.length ? reads : [0]), maxA || 0, specVal || 0) * 1.15 || 100;

  return (
    <div className="sub-sec card active" id="qa-iso">
      <div className="ch">
        <div className="ci">📐</div>
        <div>
          <div className="ct">DFT Acceptance Calculator — ISO 19840</div>
          <div className="cs">Correction value (CV) for surface profile · individual readings · average vs NDFT</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('qa-iso')}>📖 Guideline</button>
        <div className="ctag">PRO · QA-2</div>
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
                  placeholder="e.g. Jetty Piping"
                />
              </div>
            </div>
            <div className="field">
              <label>Client <span className="lh">optional</span></label>
              <div className="iw">
                <input
                  type="text"
                  value={cli}
                  onChange={e => setCli(e.target.value)}
                  placeholder="e.g. Reliance"
                />
              </div>
            </div>
            <div className="field">
              <label>Specified DFT (NDFT) <span className="lh">µm</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={spec}
                  onChange={e => setSpec(e.target.value)}
                  placeholder="e.g. 300"
                  min="1"
                  step="any"
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Correction Value (CV) <span className="lh">µm · ISO 19840: fine 10 · medium 25 · coarse 40</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={cv}
                  onChange={e => setCv(e.target.value)}
                  placeholder="e.g. 20"
                  min="0"
                  step="any"
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Maximum DFT <span className="lh">µm · optional (ISO default ≤ 3 × NDFT)</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={maxDft}
                  onChange={e => setMaxDft(e.target.value)}
                  placeholder="blank = 3 × NDFT"
                  min="0"
                  step="any"
                />
                <span className="uu">µm</span>
              </div>
            </div>
          </div>

          <div className="field" style={{ marginTop: '10px' }}>
            <label>Measured DFT Readings <span className="lh">µm · comma / space separated</span></label>
            <div className="iw">
              <input
                type="text"
                value={readingsText}
                onChange={e => setReadingsText(e.target.value)}
                placeholder="e.g. 295, 302, 310, 315, 298"
              />
            </div>
          </div>

          <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)' }}>
            <strong style={{ color: 'var(--in-lbl)' }}>ISO 19840 Criteria:</strong> Individual readings ≥ (NDFT − CV) · Arithmetic mean ≥ NDFT · Readings should not exceed the specified maximum (default guidance 3 × NDFT). Note: gauge readings are taken over the blast profile; CV compensates for profile influence.
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleEvaluate}>▶ Evaluate (ISO 19840)</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {hasEvaluated && specVal > 0 && reads.length > 0 && (
          <div className="res" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh"><span className="pd"></span>ISO 19840 Acceptance Result</div>

              {/* Verdict Banner */}
              <div style={{
                background: isPass ? '#E8F5E9' : '#FFEBEE',
                border: `1.5px solid ${isPass ? 'rgba(46,125,50,.35)' : 'rgba(211,47,47,.35)'}`,
                borderRadius: 'var(--r)',
                padding: '13px 16px',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '19px',
                  fontWeight: 700,
                  color: isPass ? '#1B5E20' : '#B71C1C'
                }}>
                  {isPass ? '✅ PASS' : '❌ FAIL'} — ISO 19840
                </div>
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: isPass ? '#2E7D32' : '#C62828',
                  marginTop: '3px'
                }}>
                  {isPass
                    ? `Average ${formatNum(avg, 1)} µm ≥ NDFT ${specVal} µm · all ${reads.length} readings ≥ ${formatNum(minA, 0)} µm (CV ${cvVal} µm applied)`
                    : why.join(' · ')}
                </div>
              </div>

              {/* Primary KPI Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Average DFT</div>
                  <div><span className="tv">{formatNum(avg, 1)}</span><span className="tu">µm</span></div>
                  <div className="tn">{avgOk ? `≥ NDFT ${specVal} µm ✓` : 'BELOW NDFT ✗'}</div>
                </div>
                <div className="tile ts">
                  <div className="tl">Minimum Acceptable</div>
                  <div><span className="tv">{formatNum(minA, 0)}</span><span className="tu">µm</span></div>
                  <div className="tn">NDFT {specVal} − CV {cvVal}</div>
                </div>
                <div className="tile ti">
                  <div className="tl">Lowest Reading</div>
                  <div><span className="tv">{formatNum(lo, 0)}</span><span className="tu">µm</span></div>
                  <div className="tn">{lo >= minA ? '≥ minimum ✓' : 'Below minimum ✗'}</div>
                </div>
                <div className="tile tg">
                  <div className="tl">Highest Reading</div>
                  <div><span className="tv">{formatNum(hi, 0)}</span><span className="tu">µm</span></div>
                  <div className="tn">{hi <= maxA ? `≤ max ${formatNum(maxA, 0)} µm ✓` : 'Above maximum ✗'}</div>
                </div>
              </div>

              {/* Readings vs Limits Chart */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Readings vs Limits
                </div>
                <div style={{
                  position: 'relative',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: '3px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--bdr)',
                  borderRadius: 'var(--r)',
                  padding: '10px 8px 4px'
                }}>
                  {reads.map((v, i) => {
                    const bad = (v < minA) || (maxA > 0 && v > maxA);
                    return (
                      <div key={i} title={`Reading ${i + 1}: ${v} µm`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '2px', zIndex: 1 }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: bad ? '#C62828' : 'var(--txt2)' }}>
                          {formatNum(v, 0)}
                        </div>
                        <div style={{
                          width: '70%',
                          maxWidth: '34px',
                          height: `${(v / chartMax) * 100}%`,
                          background: bad ? 'linear-gradient(180deg,#EF5350,#C62828)' : 'linear-gradient(180deg,#66BB6A,#2E7D32)',
                          borderRadius: '4px 4px 0 0'
                        }} />
                        <div style={{ fontSize: '8.5px', color: 'var(--txt3)' }}>{i + 1}</div>
                      </div>
                    );
                  })}

                  {/* Limit Lines */}
                  {minA > 0 && (
                    <div style={{ position: 'absolute', left: 0, right: 0, top: `${100 - (minA / chartMax) * 100}%`, borderTop: '2px dashed #C62828', zIndex: 2 }}>
                      <span style={{ position: 'absolute', right: '2px', top: '-14px', fontSize: '9px', fontWeight: 700, color: '#C62828', background: 'var(--bg2)', padding: '0 3px' }}>
                        MIN {formatNum(minA, 0)}
                      </span>
                    </div>
                  )}
                  {maxA > 0 && (
                    <div style={{ position: 'absolute', left: 0, right: 0, top: `${100 - (maxA / chartMax) * 100}%`, borderTop: '2px dashed #B26A00', zIndex: 2 }}>
                      <span style={{ position: 'absolute', right: '2px', top: '-14px', fontSize: '9px', fontWeight: 700, color: '#B26A00', background: 'var(--bg2)', padding: '0 3px' }}>
                        MAX {formatNum(maxA, 0)}
                      </span>
                    </div>
                  )}
                  {specVal > 0 && (
                    <div style={{ position: 'absolute', left: 0, right: 0, top: `${100 - (specVal / chartMax) * 100}%`, borderTop: '2px dashed #1565C0', zIndex: 2 }}>
                      <span style={{ position: 'absolute', right: '55px', top: '-14px', fontSize: '9px', fontWeight: 700, color: '#1565C0', background: 'var(--bg2)', padding: '0 3px' }}>
                        NDFT {formatNum(specVal, 0)}
                      </span>
                    </div>
                  )}
                  {avg > 0 && (
                    <div style={{ position: 'absolute', left: 0, right: 0, top: `${100 - (avg / chartMax) * 100}%`, borderTop: '2px dashed #2E7D32', zIndex: 2 }}>
                      <span style={{ position: 'absolute', right: '115px', top: '-14px', fontSize: '9px', fontWeight: 700, color: '#2E7D32', background: 'var(--bg2)', padding: '0 3px' }}>
                        AVG {formatNum(avg, 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inspection Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Inspection Summary</div>
                <div className="dr"><span className="dk">Project</span><span className="dv">{proj || '—'}</span></div>
                <div className="dr"><span className="dk">Client</span><span className="dv">{cli || '—'}</span></div>
                <div className="dr"><span className="dk">Specified DFT (NDFT)</span><span className="dv">{specVal} µm</span></div>
                <div className="dr"><span className="dk">Correction Value (CV)</span><span className="dv">{cvVal} µm</span></div>
                <div className="dr"><span className="dk">Minimum Acceptable</span><span className="dv">{formatNum(minA, 0)} µm</span></div>
                <div className="dr"><span className="dk">Maximum</span><span className="dv">{formatNum(maxA, 0)} µm {maxIn > 0 ? '(specified)' : '(3 × NDFT default)'}</span></div>
                <div className="dr"><span className="dk">Readings ({reads.length})</span><span className="dv">{reads.join(', ')} µm</span></div>
                <div className="dr"><span className="dk">Average</span><span className="dv">{formatNum(avg, 1)} µm</span></div>
                <div className="dr"><span className="dk">Lowest / Highest</span><span className="dv">{formatNum(lo, 0)} / {formatNum(hi, 0)} µm</span></div>
                <div className="dr"><span className="dk">Status</span><span className="dv" style={{ fontWeight: 700, color: isPass ? '#1B5E20' : '#B71C1C' }}>{isPass ? 'PASS' : `FAIL — ${why.join('; ')}`}</span></div>
              </div>

              {/* References Callout */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> ISO 19840 · ISO 12944. Correction Value depends on surface profile / measuring instrument and shall be entered per project specification (typical: fine +10 µm · medium +25 µm · coarse +40 µm).
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
              <button className="btn-share" onClick={() => {
                const text = `ISO 19840 Compliance: ${isPass ? 'PASS' : 'FAIL'} | NDFT: ${specVal}µm | CV: ${cvVal}µm | Avg: ${formatNum(avg, 1)}µm`;
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
