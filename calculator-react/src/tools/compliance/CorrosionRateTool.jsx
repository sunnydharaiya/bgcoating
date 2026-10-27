import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

function crrCls(cr) {
  if (cr < 0.05) return { t: 'Excellent', iv: 5, bg: '#E8F5E9', bd: 'rgba(46,125,50,.35)', c1: '#1B5E20', c2: '#2E7D32', ic: '🏆' };
  if (cr <= 0.10) return { t: 'Low', iv: 5, bg: '#E8F5E9', bd: 'rgba(46,125,50,.35)', c1: '#1B5E20', c2: '#2E7D32', ic: '✅' };
  if (cr <= 0.50) return { t: 'Moderate', iv: 3, bg: '#E3F2FD', bd: 'rgba(21,101,192,.35)', c1: '#0D47A1', c2: '#1565C0', ic: '🔵' };
  if (cr <= 1.00) return { t: 'High', iv: 1, bg: '#FFF8E1', bd: 'rgba(245,127,23,.4)', c1: '#8B4500', c2: '#B26A00', ic: '⚠️' };
  return { t: 'Severe', iv: 0.5, bg: '#FFEBEE', bd: 'rgba(211,47,47,.35)', c1: '#B71C1C', c2: '#C62828', ic: '❌' };
}

export default function CorrosionRateTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [proj, setProj] = useState('');
  const [method, setMethod] = useState('W'); // 'W' for weight loss, 'T' for thickness loss

  // Weight loss inputs
  const [wi, setWi] = useState('152.500');
  const [wf, setWf] = useState('150.000');
  const [t, setT] = useState('1000');
  const [tu, setTu] = useState('Hours');
  const [area, setArea] = useState('100');
  const [density, setDensity] = useState('7.85');

  // Thickness loss inputs
  const [ti, setTi] = useState('12');
  const [tc, setTc] = useState('11');
  const [ty, setTy] = useState('5');

  // Remaining life inputs
  const [curThk, setCurThk] = useState('11.0');
  const [tmin, setTmin] = useState('8.5');

  const [hasCalculated, setHasCalculated] = useState(false);

  // Calculations
  let cr = 0;
  let lossTxt = '—';
  let lossN = '—';
  let curT = null;
  const inputs = [];

  const tminVal = parseFloat(tmin) || 0;

  if (method === 'W') {
    const wiVal = parseFloat(wi) || 0;
    const wfVal = parseFloat(wf) || 0;
    const tVal = parseFloat(t) || 0;
    const aVal = parseFloat(area) || 0;
    const dVal = parseFloat(density) || 0;

    if (wiVal > 0 && wfVal > 0 && tVal > 0 && aVal > 0 && dVal > 0 && wfVal <= wiVal) {
      const th = tu === 'Hours' ? tVal : (tu === 'Days' ? tVal * 24 : tVal * 8760);
      const Wmg = (wiVal - wfVal) * 1000;
      cr = (87.6 * Wmg) / (dVal * aVal * th);
      lossTxt = `${formatNum(Wmg, 0)} mg`;
      lossN = `${formatNum(wiVal - wfVal, 3)} g over ${tVal} ${tu.toLowerCase()} (${formatNum(th, 0)} hrs)`;
      curT = parseFloat(curThk) || null;
      inputs.push(
        ['Method', 'Weight Loss (ASTM G1/G31/G102)'],
        ['Initial Weight', `${formatNum(wiVal, 3)} g`],
        ['Final Weight', `${formatNum(wfVal, 3)} g`],
        ['Weight Loss', `${formatNum(Wmg, 0)} mg`],
        ['Exposure', `${tVal} ${tu} = ${formatNum(th, 0)} hrs`],
        ['Specimen Area', `${aVal} cm²`],
        ['Density', `${dVal} g/cm³`]
      );
    }
  } else {
    const tiVal = parseFloat(ti) || 0;
    const tcVal = parseFloat(tc) || 0;
    const tyVal = parseFloat(ty) || 0;

    if (tiVal > 0 && tcVal > 0 && tyVal > 0 && tcVal <= tiVal) {
      cr = (tiVal - tcVal) / tyVal;
      lossTxt = `${formatNum(tiVal - tcVal, 2)} mm`;
      lossN = `from ${tiVal} mm to ${tcVal} mm over ${tyVal} years`;
      curT = tcVal;
      inputs.push(
        ['Method', 'Thickness Loss (UT survey)'],
        ['Initial Thickness', `${tiVal} mm`],
        ['Current Thickness', `${tcVal} mm`],
        ['Metal Loss', `${formatNum(tiVal - tcVal, 2)} mm`],
        ['Exposure', `${tyVal} years`]
      );
    }
  }

  const mpy = cr * 39.37;
  let rl = null;
  let rlTxt = 'Enter current & minimum thickness';

  if (curT !== null && tminVal > 0 && cr > 0) {
    if (curT <= tminVal) {
      rl = 0;
      rlTxt = 'ALREADY AT/BELOW t-min — retire or repair';
    } else {
      rl = (curT - tminVal) / cr;
      rlTxt = `(${formatNum(curT, 1)} − ${formatNum(tminVal, 1)}) ÷ ${formatNum(cr, 3)} mm/yr`;
    }
  }

  const g = crrCls(cr);
  const ii = (rl !== null && rl > 0) ? Math.min(rl / 2, g.iv) : (g.t === 'Severe' ? 0.5 : g.iv);

  const rec = cr < 0.1
    ? 'Corrosion rate is low. Existing coating/protection system is performing satisfactorily. Continue routine inspection.'
    : cr <= 0.5
      ? 'Moderate corrosion rate. Trend the CML data, verify coating condition at next opportunity, and confirm corrosion allowance consumption against design.'
      : `High corrosion rate detected. Review coating condition, cathodic protection system, operating environment, and maintenance strategy.${cr > 1 ? ' Consider immediate fitness-for-service assessment (API 579) and interim mitigation.' : ''}`;

  const handleCalculate = () => {
    if (method === 'W') {
      const wiVal = parseFloat(wi) || 0;
      const wfVal = parseFloat(wf) || 0;
      if (!wiVal || !wfVal || !t || !area || !density) {
        addToast('Missing Inputs', 'Fill Initial/Final Weight, Exposure Time, Area and Density.', 'warning');
        return;
      }
      if (wfVal > wiVal) {
        addToast('Invalid Weights', 'Final weight cannot exceed initial weight.', 'warning');
        return;
      }
    } else {
      const tiVal = parseFloat(ti) || 0;
      const tcVal = parseFloat(tc) || 0;
      if (!tiVal || !tcVal || !ty) {
        addToast('Missing Inputs', 'Fill Initial Thickness, Current Thickness and Exposure Years.', 'warning');
        return;
      }
      if (tcVal > tiVal) {
        addToast('Invalid Thicknesses', 'Current thickness cannot exceed initial thickness.', 'warning');
        return;
      }
    }
    setHasCalculated(true);
    addToast('Corrosion Rate Calculated', `${formatNum(cr, 3)} mm/yr (${g.t})`, 'success');

    // Auto-save to calculation audit log
    autoLogCalculation({
      tool_id: 'ce-rate',
      tool_name: 'Corrosion Rate & Remaining Asset Life',
      category: 'compliance',
      inputs: {
        project: proj,
        evaluation_method: method === 'W' ? 'Weight Loss (ASTM G1)' : 'Thickness Loss / UT Gauging',
        initial_thickness_mm: method === 'T' ? parseFloat(ti) : null,
        current_thickness_mm: method === 'T' ? parseFloat(tc) : null,
        exposure_duration: method === 'W' ? `${t} ${tu}` : `${ty} years`,
        minimum_required_thickness_mm: tminVal
      },
      results: {
        corrosion_rate_mm_yr: cr,
        corrosion_rate_mpy: mpy,
        classification: g.t,
        remaining_life_years: rem,
        half_life_inspection_interval_yrs: inv
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (log && (log.tool_id === 'ce-rate' || log.tool_id === 'ce_rate' || log.tool_id === 'corrosion_rate' || log.tool_id === 'corrosion-rate')) {
        if (log.inputs) {
          if (log.inputs.project !== undefined) setProj(log.inputs.project);
          if (log.inputs.initial_thickness_mm !== undefined && log.inputs.initial_thickness_mm !== null) {
            setMethod('T');
            setTi(String(log.inputs.initial_thickness_mm));
          }
          if (log.inputs.current_thickness_mm !== undefined && log.inputs.current_thickness_mm !== null) setTc(String(log.inputs.current_thickness_mm));
          if (log.inputs.minimum_required_thickness_mm !== undefined) setTmin(String(log.inputs.minimum_required_thickness_mm));
        }
        setHasCalculated(true);
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleReset = () => {
    setProj('');
    setMethod('W');
    setWi('152.500');
    setWf('150.000');
    setT('1000');
    setTu('Hours');
    setArea('100');
    setDensity('7.85');
    setTi('12');
    setTc('11');
    setTy('5');
    setCurThk('11.0');
    setTmin('8.5');
    setHasCalculated(false);
    addToast('Reset', 'Form reset.', 'info');
  };

  const handleExportCSV = () => {
    if (!cr) {
      addToast('No Data', 'Calculate corrosion rate first.', 'warning');
      return;
    }
    const rows = [
      ['Project Name', proj || '—'],
      ...inputs,
      ['Corrosion Rate (mm/yr)', formatNum(cr, 3)],
      ['Corrosion Rate (mpy)', formatNum(mpy, 1)],
      ['Total Metal Loss', lossTxt],
      ['Severity', g.t],
      ['Current Thickness (mm)', curT !== null ? formatNum(curT, 2) : '—'],
      ['Minimum Thickness t-min (mm)', tminVal > 0 ? formatNum(tminVal, 2) : '—'],
      ['Estimated Remaining Life (years)', rl === null ? '—' : (rl <= 0 ? '0' : formatNum(rl, 1))],
      ['Recommended Inspection Interval (years)', formatNum(ii, 1)]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Corrosion_Rate_${proj || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Successful', 'Exported to CSV.', 'success');
  };

  return (
    <div className="sub-sec card active" id="ce-rate">
      <div className="ch">
        <div className="ci">🧲</div>
        <div>
          <div className="ct">Corrosion Rate Calculator</div>
          <div className="cs">Weight-loss (ASTM G1/G31/G102) &amp; thickness-loss methods · remaining life · inspection interval</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('ce-rate')}>📖 Guideline</button>
        <div className="ctag">PRO · CE-1</div>
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
                  placeholder='e.g. Crude Line 16" CML-04'
                />
              </div>
            </div>
            <div className="field">
              <label>Method</label>
              <div className="iw">
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="W">Weight Loss Method (ASTM G1 / G31 / G102)</option>
                  <option value="T">Thickness Loss Method (UT / API)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weight Loss Inputs */}
          {method === 'W' && (
            <div className="g2" style={{ marginTop: '10px' }}>
              <div className="field">
                <label>Initial Weight <span className="lh">g</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={wi}
                    onChange={e => setWi(e.target.value)}
                    placeholder="e.g. 152.500"
                    min="0"
                    step="any"
                  />
                  <span className="uu">g</span>
                </div>
              </div>
              <div className="field">
                <label>Final Weight <span className="lh">g</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={wf}
                    onChange={e => setWf(e.target.value)}
                    placeholder="e.g. 150.000"
                    min="0"
                    step="any"
                  />
                  <span className="uu">g</span>
                </div>
              </div>
              <div className="field">
                <label>Exposure Time</label>
                <div className="iw">
                  <input
                    type="number"
                    value={t}
                    onChange={e => setT(e.target.value)}
                    placeholder="e.g. 1000"
                    min="0"
                    step="any"
                  />
                  <span className="uu">
                    <select
                      value={tu}
                      onChange={e => setTu(e.target.value)}
                      style={{ border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option>Hours</option>
                      <option>Days</option>
                      <option>Years</option>
                    </select>
                  </span>
                </div>
              </div>
              <div className="field">
                <label>Specimen Area <span className="lh">cm²</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="e.g. 100"
                    min="0"
                    step="any"
                  />
                  <span className="uu">cm²</span>
                </div>
              </div>
              <div className="field">
                <label>Metal Density <span className="lh">g/cm³ · steel 7.85</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={density}
                    onChange={e => setDensity(e.target.value)}
                    min="0"
                    step="any"
                  />
                  <span className="uu">g/cm³</span>
                </div>
              </div>
            </div>
          )}

          {/* Thickness Loss Inputs */}
          {method === 'T' && (
            <div className="g2" style={{ marginTop: '10px' }}>
              <div className="field">
                <label>Initial Thickness <span className="lh">mm</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={ti}
                    onChange={e => setTi(e.target.value)}
                    placeholder="e.g. 12"
                    min="0"
                    step="any"
                  />
                  <span className="uu">mm</span>
                </div>
              </div>
              <div className="field">
                <label>Current Thickness <span className="lh">mm</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={tc}
                    onChange={e => setTc(e.target.value)}
                    placeholder="e.g. 11"
                    min="0"
                    step="any"
                  />
                  <span className="uu">mm</span>
                </div>
              </div>
              <div className="field">
                <label>Exposure Time <span className="lh">years</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={ty}
                    onChange={e => setTy(e.target.value)}
                    placeholder="e.g. 5"
                    min="0"
                    step="any"
                  />
                  <span className="uu">yrs</span>
                </div>
              </div>
            </div>
          )}

          {/* Remaining Life Section */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '12px 0 8px' }}>
            Remaining Life (optional — API 570 / 510 / 653)
          </div>
          <div className="g2">
            {method === 'W' && (
              <div className="field">
                <label>Current Wall Thickness <span className="lh">mm · for remaining life</span></label>
                <div className="iw">
                  <input
                    type="number"
                    value={curThk}
                    onChange={e => setCurThk(e.target.value)}
                    placeholder="e.g. 11.0"
                    min="0"
                    step="any"
                  />
                  <span className="uu">mm</span>
                </div>
              </div>
            )}
            <div className="field">
              <label>Minimum Required Thickness <span className="lh">mm · t-min / retirement</span></label>
              <div className="iw">
                <input
                  type="number"
                  value={tmin}
                  onChange={e => setTmin(e.target.value)}
                  placeholder="e.g. 8.5"
                  min="0"
                  step="any"
                />
                <span className="uu">mm</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)' }}>
            <strong style={{ color: 'var(--in-lbl)' }}>Formulas:</strong> Weight loss — CR (mm/y) = 87.6 × W(mg) ÷ (D × A × T hours) · Thickness loss — CR = (t₀ − t) ÷ years · Remaining Life = (t − t·min) ÷ CR · mpy = mm/y × 39.37
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Corrosion Rate</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {hasCalculated && cr > 0 && (
          <div className="res" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Corrosion Rate Result</div>

              {/* Verdict Banner */}
              <div style={{
                background: g.bg,
                border: `1.5px solid ${g.bd}`,
                borderRadius: 'var(--r)',
                padding: '13px 16px',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '19px',
                  fontWeight: 700,
                  color: g.c1
                }}>
                  {g.ic} Corrosion Rate {formatNum(cr, 3)} mm/yr ({formatNum(mpy, 1)} mpy) — {g.t}
                </div>
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: g.c2,
                  marginTop: '3px'
                }}>
                  Metal loss {lossTxt}
                  {rl !== null ? ` · Remaining life ${rl <= 0 ? '0 (AT t-min)' : `≈ ${formatNum(rl, 1)} yrs`}` : ''}
                  {' · Inspect within ' + formatNum(ii, 1) + ' yrs'}
                </div>
              </div>

              {/* Primary Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Corrosion Rate</div>
                  <div><span className="tv">{formatNum(cr, 3)}</span><span className="tu">mm/yr</span></div>
                  <div className="tn">{g.t} severity</div>
                </div>
                <div className="tile ts">
                  <div className="tl">Corrosion Rate (mpy)</div>
                  <div><span className="tv">{formatNum(mpy, 1)}</span><span className="tu">mpy</span></div>
                </div>
                <div className="tile ti">
                  <div className="tl">Total Metal Loss</div>
                  <div><span className="tv" style={{ fontSize: '22px' }}>{lossTxt}</span></div>
                  <div className="tn">{lossN}</div>
                </div>
                <div className="tile tg">
                  <div className="tl">Remaining Life</div>
                  <div><span className="tv">{rl === null ? '—' : (rl <= 0 ? '0' : formatNum(rl, 1))}</span><span className="tu">yrs</span></div>
                  <div className="tn">{rlTxt}</div>
                </div>
              </div>

              {/* Secondary Tiles */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Thickness Remaining</div>
                  <div className="tv" style={{ fontSize: '20px' }}>
                    {curT !== null ? `${formatNum(curT, 2)} mm${tminVal > 0 ? ` (t-min ${formatNum(tminVal, 2)} mm)` : ''}` : '—'}
                  </div>
                </div>
                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Recommended Inspection Interval</div>
                  <div className="tv" style={{ fontSize: '20px' }}>
                    {formatNum(ii, 1)} years{rl !== null && rl > 0 ? ' (½ remaining life, capped)' : ''}
                  </div>
                </div>
              </div>

              {/* Engineering Recommendation Box */}
              <div style={{
                marginTop: '12px',
                padding: '11px 14px',
                background: g.bg,
                border: `1px solid ${g.bd}`,
                borderLeft: `3px solid ${g.c2}`,
                borderRadius: 'var(--r)',
                fontSize: '12px',
                color: 'var(--txt2)',
                lineHeight: 1.7
              }}>
                <strong style={{ color: g.c1 }}>🛠 Engineering Recommendation:</strong> {rec}
              </div>

              {/* Analysis Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Corrosion Analysis Summary</div>
                <div className="dr"><span className="dk">Project</span><span className="dv">{proj || '—'}</span></div>
                {inputs.map(([k, v], idx) => (
                  <div className="dr" key={idx}><span className="dk">{k}</span><span className="dv">{v}</span></div>
                ))}
                <div className="dr"><span className="dk">Corrosion Rate</span><span className="dv">{formatNum(cr, 3)} mm/yr = {formatNum(mpy, 1)} mpy</span></div>
                <div className="dr"><span className="dk">Severity</span><span className="dv" style={{ fontWeight: 700, color: g.c1 }}>{g.t}</span></div>
                <div className="dr"><span className="dk">Current / Minimum Thickness</span><span className="dv">{(curT !== null ? formatNum(curT, 2) : '—')} / {(tminVal > 0 ? formatNum(tminVal, 2) : '—')} mm</span></div>
                <div className="dr"><span className="dk">Estimated Remaining Life</span><span className="dv">{rl === null ? '—' : (rl <= 0 ? '0 — at/below t-min' : `${formatNum(rl, 1)} years`)}</span></div>
                <div className="dr"><span className="dk">Recommended Inspection Interval</span><span className="dv">{formatNum(ii, 1)} years</span></div>
              </div>

              {/* Severity & References Callout */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>Severity:</strong> &lt;0.05 Excellent · 0.05–0.10 Low · 0.10–0.50 Moderate · 0.50–1.00 High · &gt;1.00 mm/yr Severe &nbsp;|&nbsp; <strong>References:</strong> ASTM G1 · G31 · G102 · NACE SP0775 · AMPP · API 570 / 510 / 653
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
              <button className="btn-share" onClick={() => {
                const text = `Corrosion Rate: ${formatNum(cr, 3)} mm/yr (${formatNum(mpy, 1)} mpy) — ${g.t} severity. Remaining life: ${rl !== null ? formatNum(rl, 1) : '—'} yrs.`;
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
