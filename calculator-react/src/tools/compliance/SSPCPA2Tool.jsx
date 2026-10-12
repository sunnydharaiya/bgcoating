import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function SSPCPA2Tool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Inputs
  const [proj, setProj] = useState('');
  const [cli, setCli] = useState('');
  const [str, setStr] = useState('');
  const [area, setArea] = useState('Area A');
  const [spec, setSpec] = useState('250');
  const [maxp, setMaxp] = useState('120');
  const [spotsText, setSpotsText] = useState('245, 260, 255, 270, 248');

  // Multi-area project state
  const [projectAreas, setProjectAreas] = useState([]);
  const [lastEvaluated, setLastEvaluated] = useState(null);
  const [hasEvaluated, setHasEvaluated] = useState(true);

  // Parse spots
  const spots = spotsText
    .split(/[\s,;]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x) && x > 0);

  const specVal = parseFloat(spec) || 0;
  const maxpVal = parseFloat(maxp) || 120;
  const minA = specVal * 0.8;
  const maxA = specVal * maxpVal / 100;

  const avg = spots.length > 0 ? spots.reduce((a, b) => a + b, 0) / spots.length : 0;
  const lo = spots.length > 0 ? Math.min(...spots) : 0;
  const hi = spots.length > 0 ? Math.max(...spots) : 0;

  const failLow = spots.filter(x => x < minA).length;
  const failHigh = spots.filter(x => x > maxA).length;
  const avgOk = specVal > 0 && avg >= specVal;
  const isPass = specVal > 0 && spots.length >= 2 && avgOk && failLow === 0 && failHigh === 0;

  const why = [];
  if (!avgOk && specVal > 0) why.push(`Average ${formatNum(avg, 1)} µm < specified ${specVal} µm`);
  if (failLow > 0) why.push(`${failLow} spot(s) below 80% minimum (${formatNum(minA, 0)} µm)`);
  if (failHigh > 0) why.push(`${failHigh} spot(s) above ${maxpVal}% maximum (${formatNum(maxA, 0)} µm)`);

  const handleEvaluate = () => {
    if (!specVal) {
      addToast('Missing Input', 'Enter Specified DFT.', 'warning');
      return;
    }
    if (spots.length < 2) {
      addToast('Insufficient Readings', 'Enter at least 2 spot measurements (5 recommended per SSPC-PA 2).', 'warning');
      return;
    }
    setHasEvaluated(true);
    setLastEvaluated({
      area: area.trim() || `Area ${String.fromCharCode(65 + projectAreas.length)}`,
      spec: specVal,
      n: spots.length,
      avg,
      lo,
      hi,
      ok: isPass
    });
    addToast(
      'SSPC-PA 2 Evaluated',
      isPass ? `Area conforms to SSPC-PA 2 (${formatNum(avg, 1)} µm avg).` : `Area non-conforming: ${why.join(' · ')}`,
      isPass ? 'success' : 'warning'
    );
  };

  const handleReset = () => {
    setProj('');
    setCli('');
    setStr('');
    setArea('');
    setSpec('');
    setMaxp('120');
    setSpotsText('');
    setLastEvaluated(null);
    setHasEvaluated(false);
    addToast('Reset', 'Form cleared.', 'info');
  };

  const handleAddArea = () => {
    const areaToPush = lastEvaluated || {
      area: area.trim() || `Area ${String.fromCharCode(65 + projectAreas.length)}`,
      spec: specVal,
      n: spots.length,
      avg,
      lo,
      hi,
      ok: isPass
    };
    if (!areaToPush.spec || areaToPush.n < 2) {
      addToast('Cannot Add', 'Evaluate an area with valid readings first.', 'warning');
      return;
    }
    setProjectAreas(prev => [...prev, areaToPush]);
    addToast('Area Added', `Project now has ${projectAreas.length + 1} inspection area(s).`, 'success');
  };

  const handleClearProject = () => {
    setProjectAreas([]);
    addToast('Cleared', 'Project areas cleared.', 'info');
  };

  const handleDownloadExcel = () => {
    if (projectAreas.length === 0 && !hasEvaluated) {
      addToast('No Data', 'No inspection areas to export.', 'warning');
      return;
    }
    const rows = [
      ['Project Name', proj || '—'],
      ['Client', cli || '—'],
      ['Structure', str || '—'],
      [''],
      ['Area', 'Spec DFT (µm)', 'Spots Count', 'Avg DFT (µm)', 'Low (µm)', 'High (µm)', 'SSPC-PA 2 Status']
    ];
    const dataToExport = projectAreas.length > 0 ? projectAreas : [{
      area: area || 'Area A',
      spec: specVal,
      n: spots.length,
      avg,
      lo,
      hi,
      ok: isPass
    }];
    dataToExport.forEach(r => {
      rows.push([r.area, r.spec, r.n, formatNum(r.avg, 1), formatNum(r.lo, 0), formatNum(r.hi, 0), r.ok ? 'PASS' : 'FAIL']);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSPC_PA2_Inspection_${proj || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', 'Project inspection areas exported to CSV.', 'success');
  };

  const allProjectOk = projectAreas.length > 0 && projectAreas.every(x => x.ok);

  // Chart setup
  const chartMax = Math.max(...(spots.length ? spots : [0]), maxA || 0, specVal || 0) * 1.15 || 100;

  return (
    <div className="sub-sec card active" id="qa-pa2">
      <div className="ch">
        <div className="ci">📏</div>
        <div>
          <div className="ct">DFT Acceptance Calculator — SSPC-PA 2</div>
          <div className="cs">Spot measurements · 80% / 120% rule · area average · multi-area project acceptance</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('qa-pa2')}>📖 Guideline</button>
        <div className="ctag">PRO · QA-1</div>
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
                  placeholder="e.g. Tank T-101"
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
                  placeholder="e.g. HPCL"
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
                  placeholder="e.g. Shell Course 3"
                />
              </div>
            </div>
            <div className="field">
              <label>Inspection Area <span className="lh">e.g. Area A</span></label>
              <div className="iw">
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="Area A"
                />
              </div>
            </div>
            <div className="field">
              <label>Specified DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={spec}
                  onChange={e => setSpec(e.target.value)}
                  placeholder="e.g. 250"
                  min="1"
                  step="any"
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Max Spot Limit <span className="lh">% of spec · default 120</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={maxp}
                  onChange={e => setMaxp(e.target.value)}
                  min="100"
                  step="any"
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          <div className="field" style={{ marginTop: '10px' }}>
            <label>Spot Measurements <span className="lh">µm · each spot = avg of 3 gauge readings · comma / space separated</span></label>
            <div className="iw">
              <input
                type="text"
                value={spotsText}
                onChange={e => setSpotsText(e.target.value)}
                placeholder="e.g. 245, 260, 255, 270, 248"
              />
            </div>
          </div>

          <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)' }}>
            <strong style={{ color: 'var(--in-lbl)' }}>SSPC-PA 2 Criteria:</strong> No spot &lt; 80% of specified DFT · No spot &gt; 120% (unless specification permits) · Average of spots ≥ Specified DFT (minimum 5 spots per ~10 m² area recommended)
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleEvaluate}>▶ Evaluate Area (SSPC-PA 2)</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {hasEvaluated && specVal > 0 && spots.length > 0 && (
          <div className="res" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh"><span className="pd"></span>SSPC-PA 2 Acceptance Result</div>

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
                  {isPass ? '✅ PASS' : '❌ FAIL'} — {area || 'Area'} per SSPC-PA 2
                </div>
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: isPass ? '#2E7D32' : '#C62828',
                  marginTop: '3px'
                }}>
                  {isPass
                    ? `Average ${formatNum(avg, 1)} µm ≥ ${specVal} µm · all ${spots.length} spots within ${formatNum(minA, 0)}–${formatNum(maxA, 0)} µm`
                    : why.join(' · ')}
                </div>
              </div>

              {/* Primary KPI Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Area Average DFT</div>
                  <div><span className="tv">{formatNum(avg, 1)}</span><span className="tu">µm</span></div>
                  <div className="tn">{avgOk ? `≥ specified ${specVal} µm ✓` : `BELOW specified ${specVal} µm ✗`}</div>
                </div>
                <div className="tile ts">
                  <div className="tl">Min / Max Allowed</div>
                  <div><span className="tv" style={{ fontSize: '22px' }}>{formatNum(minA, 0)} / {formatNum(maxA, 0)}</span><span className="tu">µm</span></div>
                  <div className="tn">80% / max % of specified</div>
                </div>
                <div className="tile ti">
                  <div className="tl">Lowest Spot</div>
                  <div><span className="tv">{formatNum(lo, 0)}</span><span className="tu">µm</span></div>
                  <div className="tn">{lo >= minA ? 'Above 80% minimum ✓' : 'Below minimum ✗'}</div>
                </div>
                <div className="tile tg">
                  <div className="tl">Highest Spot</div>
                  <div><span className="tv">{formatNum(hi, 0)}</span><span className="tu">µm</span></div>
                  <div className="tn">{hi <= maxA ? `Within ${maxpVal}% maximum ✓` : 'Above maximum ✗'}</div>
                </div>
              </div>

              {/* Spot Readings vs Limits Chart */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Spot Readings vs Limits
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
                  {spots.map((v, i) => {
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
                        SPEC {formatNum(specVal, 0)}
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

              {/* Project Acceptance Multi-Area Section */}
              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderRadius: 'var(--r)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--brand-crimson)', flex: 1 }}>
                    🗂 Project Acceptance — multiple areas (A, B, C…)
                  </div>
                  <button className="btn" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={handleAddArea}>
                    ➕ Add This Area to Project
                  </button>
                  <button className="btn-reset" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={handleClearProject}>
                    🗑 Clear
                  </button>
                  <button className="btn-print" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={handleDownloadExcel}>
                    ⬇ Download Excel
                  </button>
                </div>

                <div style={{ marginTop: '10px' }}>
                  {projectAreas.length === 0 ? (
                    <div style={{ fontSize: '11.5px', color: 'var(--txt3)' }}>
                      No areas added yet. Evaluate each inspection area (A, B, C…) and add it here for the overall project acceptance.
                    </div>
                  ) : (
                    <div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', background: 'var(--bg3)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '7px 10px', textAlign: 'left', background: 'var(--bg4)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--in-lbl)' }}>Area</th>
                              <th style={{ padding: '7px 10px', textAlign: 'right', background: 'var(--bg4)', fontSize: '10px', color: 'var(--in-lbl)' }}>Spec µm</th>
                              <th style={{ padding: '7px 10px', textAlign: 'right', background: 'var(--bg4)', fontSize: '10px', color: 'var(--in-lbl)' }}>Spots</th>
                              <th style={{ padding: '7px 10px', textAlign: 'right', background: 'var(--bg4)', fontSize: '10px', color: 'var(--in-lbl)' }}>Avg µm</th>
                              <th style={{ padding: '7px 10px', textAlign: 'right', background: 'var(--bg4)', fontSize: '10px', color: 'var(--in-lbl)' }}>Low / High</th>
                              <th style={{ padding: '7px 10px', textAlign: 'center', background: 'var(--bg4)', fontSize: '10px', color: 'var(--in-lbl)' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectAreas.map((x, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--bdr)', fontWeight: 600 }}>{x.area}</td>
                                <td style={{ padding: '6px 10px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{x.spec}</td>
                                <td style={{ padding: '6px 10px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{x.n}</td>
                                <td style={{ padding: '6px 10px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{formatNum(x.avg, 1)}</td>
                                <td style={{ padding: '6px 10px', textAlign: 'right', borderBottom: '1px solid var(--bdr)' }}>{formatNum(x.lo, 0)} / {formatNum(x.hi, 0)}</td>
                                <td style={{ padding: '6px 10px', textAlign: 'center', borderBottom: '1px solid var(--bdr)', fontWeight: 800, color: x.ok ? '#1B5E20' : '#B71C1C' }}>
                                  {x.ok ? 'PASS' : 'FAIL'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{
                        marginTop: '8px',
                        padding: '9px 12px',
                        borderRadius: 'var(--r)',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: allProjectOk ? '#E8F5E9' : '#FFEBEE',
                        color: allProjectOk ? '#1B5E20' : '#B71C1C',
                        border: `1px solid ${allProjectOk ? 'rgba(46,125,50,.3)' : 'rgba(211,47,47,.3)'}`
                      }}>
                        {allProjectOk
                          ? `✅ OVERALL PROJECT ACCEPTANCE: PASS — all ${projectAreas.length} area(s) conform to SSPC-PA 2`
                          : `❌ OVERALL PROJECT ACCEPTANCE: FAIL — ${projectAreas.filter(x => !x.ok).length} of ${projectAreas.length} area(s) non-conforming`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Inspection Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Inspection Summary</div>
                <div className="dr"><span className="dk">Project</span><span className="dv">{proj || '—'}</span></div>
                <div className="dr"><span className="dk">Client</span><span className="dv">{cli || '—'}</span></div>
                <div className="dr"><span className="dk">Structure</span><span className="dv">{str || '—'}</span></div>
                <div className="dr"><span className="dk">Inspection Area</span><span className="dv">{area || 'Area A'}</span></div>
                <div className="dr"><span className="dk">Specified DFT</span><span className="dv">{specVal} µm</span></div>
                <div className="dr"><span className="dk">Spots ({spots.length})</span><span className="dv">{spots.join(', ')} µm</span></div>
                <div className="dr"><span className="dk">Minimum Allowed (80%)</span><span className="dv">{formatNum(minA, 0)} µm</span></div>
                <div className="dr"><span className="dk">Maximum Allowed ({maxpVal}%)</span><span className="dv">{formatNum(maxA, 0)} µm</span></div>
                <div className="dr"><span className="dk">Area Average</span><span className="dv">{formatNum(avg, 1)} µm</span></div>
                <div className="dr"><span className="dk">Lowest / Highest Spot</span><span className="dv">{formatNum(lo, 0)} / {formatNum(hi, 0)} µm</span></div>
                <div className="dr"><span className="dk">Status</span><span className="dv" style={{ fontWeight: 700, color: isPass ? '#1B5E20' : '#B71C1C' }}>{isPass ? 'PASS' : `FAIL — ${why.join('; ')}`}</span></div>
              </div>

              {/* References Callout */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> SSPC-PA 2 / AMPP SSPC-PA 2 · ISO 12944. Gauge calibration and base-metal-reading adjustment per SSPC-PA 2 Appendix; number of spots per area as specified.
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
              <button className="btn-share" onClick={() => {
                const text = `SSPC-PA 2 Compliance: ${isPass ? 'PASS' : 'FAIL'} | Spec: ${specVal}µm | Avg: ${formatNum(avg, 1)}µm | Range: ${formatNum(lo, 0)}-${formatNum(hi, 0)}µm`;
                navigator.clipboard?.writeText(text);
                addToast('Copied', 'Summary copied to clipboard.', 'success');
              }}>📤 Share Text</button>
              <button className="btn-print" onClick={handleDownloadExcel}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={handleDownloadExcel}>📊 Excel Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
