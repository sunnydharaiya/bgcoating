import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

function vsSanity(vsCalc) {
  if (vsCalc > 100) return 'Calculated Volume Solids exceeds 100% — please re-check the input values.';
  if (vsCalc <= 0) return 'Calculated Volume Solids is zero or negative — please re-check the input values.';
  return null;
}

function vsClass(x) {
  if (x > 90) return 'Solvent Free Coating';
  if (x >= 80) return 'Ultra High Solids';
  if (x >= 70) return 'High Solids';
  if (x >= 60) return 'Medium High Solids';
  if (x >= 50) return 'Conventional Industrial';
  if (x >= 35) return 'Low Solids';
  return 'Very Low Solids';
}

function vsRec(x) {
  if (x > 80) return 'Excellent coating efficiency. Low VOC emissions. High DFT achievable per coat. Recommended for offshore, marine, immersion service, storage tanks and heavy-duty industrial environments.';
  if (x >= 60) return 'Suitable for most industrial protective coating applications. Good balance between application properties and performance.';
  if (x >= 50) return 'Conventional industrial grade — acceptable for general atmospheric service. For severe exposures, evaluate high-solids alternatives.';
  return 'Higher solvent content — increased paint consumption and higher VOC emissions. Consider evaluating high-solids alternatives for improved productivity and reduced lifecycle cost.';
}

function vsStatus(calc, pub) {
  if (!pub || pub <= 0) return null;
  const diff = Math.abs(calc - pub);
  const dev = (diff / pub) * 100;
  let st, bg, bd, c1, c2, ic;
  if (diff < 2) {
    st = 'PASS';
    bg = '#E8F5E9';
    bd = 'rgba(46,125,50,.35)';
    c1 = '#1B5E20';
    c2 = '#2E7D32';
    ic = '✅';
  } else if (diff <= 5) {
    st = 'REVIEW';
    bg = '#FFF8E1';
    bd = 'rgba(245,127,23,.4)';
    c1 = '#8B4500';
    c2 = '#B26A00';
    ic = '⚠️';
  } else {
    st = 'FAIL';
    bg = '#FFEBEE';
    bd = 'rgba(211,47,47,.35)';
    c1 = '#B71C1C';
    c2 = '#C62828';
    ic = '❌';
  }
  return { diff, dev, status: st, bg, bd, c1, c2, ic };
}

export default function VolumeSolidsSuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Mode: 'tds' | 'den' | 'lab'
  const [mode, setMode] = useState('tds');

  useEffect(() => {
    if (activeSubTool === 'vs-den' || activeSubTool === 'vs_den' || activeSubTool === 'volume_solids_density') {
      setMode('den');
    } else if (activeSubTool === 'vs-lab' || activeSubTool === 'vs_lab' || activeSubTool === 'volume_solids_lab') {
      setMode('lab');
    } else {
      setMode('tds');
    }
  }, [activeSubTool]);

  // Method 1: TDS Verification
  const [vstDft, setVstDft] = useState('125');
  const [vstCov, setVstCov] = useState('5.6');
  const [vstPub, setVstPub] = useState('70');
  const [vstNm, setVstNm] = useState('High-Build Epoxy');
  const [vstRes, setVstRes] = useState(null);

  // Method 2: Density Verification
  const [vsdWs, setVsdWs] = useState('80');
  const [vsdWd, setVsdWd] = useState('1.60');
  const [vsdDd, setVsdDd] = useState('1.80');
  const [vsdPub, setVsdPub] = useState('71');
  const [vsdNm, setVsdNm] = useState('Solvent-Free Epoxy');
  const [vsdRes, setVsdRes] = useState(null);

  // Method 3: Lab Verification
  const [vslWe, setVslWe] = useState('25.000');
  const [vslWw, setVslWw] = useState('30.000');
  const [vslWd, setVslWd] = useState('29.000');
  const [vslDen, setVslDen] = useState('1.60');
  const [vslDv, setVslDv] = useState('2.200');
  const [vslPub, setVslPub] = useState('70');
  const [vslNm, setVslNm] = useState('Batch 4521 — Epoxy MIO');
  const [vslRes, setVslRes] = useState(null);

  // Calculate TDS
  const calcVST = () => {
    const dft = parseFloat(vstDft);
    const cov = parseFloat(vstCov);
    const pub = parseFloat(vstPub) || 0;

    if (!dft || !cov) {
      addToast('Missing Required Inputs', 'Please fill DFT and Theoretical Coverage.', 'warning');
      return;
    }

    const vsC = (dft * cov) / 10;
    const err = vsSanity(vsC);
    if (err) {
      addToast('Sanity Error', err, 'error');
      return;
    }

    const st = vsStatus(vsC, pub);
    setVstRes({
      vsC,
      cls: vsClass(vsC),
      rec: vsRec(vsC),
      pub,
      diff: st ? st.diff : null,
      dev: st ? st.dev : null,
      status: st,
      dft,
      cov,
      name: vstNm || '—'
    });
    addToast('Verified Volume Solids', 'Method 1 (TDS) verification calculated.', 'success');
  };

  const rstVST = () => {
    setVstDft('');
    setVstCov('');
    setVstPub('');
    setVstNm('');
    setVstRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  // Calculate Density
  const calcVSD = () => {
    const ws = parseFloat(vsdWs);
    const wd = parseFloat(vsdWd);
    const dd = parseFloat(vsdDd);
    const pub = parseFloat(vsdPub) || 0;

    if (!ws || !wd || !dd) {
      addToast('Missing Required Inputs', 'Please fill Weight Solids, Wet Density and Dry Film Density.', 'warning');
      return;
    }

    const vsC = (ws * wd) / dd;
    const err = vsSanity(vsC);
    if (err) {
      addToast('Sanity Error', err, 'error');
      return;
    }

    const st = vsStatus(vsC, pub);
    setVsdRes({
      vsC,
      cls: vsClass(vsC),
      rec: vsRec(vsC),
      pub,
      diff: st ? st.diff : null,
      dev: st ? st.dev : null,
      status: st,
      ws,
      wd,
      dd,
      name: vsdNm || '—'
    });
    addToast('Calculated Volume Solids', 'Method 2 (Density) verification calculated.', 'success');
  };

  const rstVSD = () => {
    setVsdWs('');
    setVsdWd('');
    setVsdDd('');
    setVsdPub('');
    setVsdNm('');
    setVsdRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  // Calculate Lab
  const calcVSL = () => {
    const we = parseFloat(vslWe);
    const ww = parseFloat(vslWw);
    const wd = parseFloat(vslWd);
    const den = parseFloat(vslDen);
    const dv = parseFloat(vslDv);
    const pub = parseFloat(vslPub) || 0;

    if (isNaN(ww) || isNaN(wd) || !den || !dv) {
      addToast('Missing Required Inputs', 'Please fill Dish+Wet, Dish+Dry, Wet Density and Dry Film Volume.', 'warning');
      return;
    }

    const wetW = ww - we;
    const dryW = wd - we;

    if (wetW <= 0) {
      addToast('Invalid Weights', 'Dish + Wet Paint must be greater than Empty Dish weight.', 'error');
      return;
    }
    if (dryW < 0) {
      addToast('Invalid Weights', 'Dish + Dry Film cannot be less than Empty Dish weight.', 'error');
      return;
    }
    if (dryW > wetW) {
      addToast('Invalid Weights', 'Dry Film weight cannot exceed Wet Paint weight.', 'error');
      return;
    }

    const nv = (dryW / wetW) * 100;
    const wetVol = wetW / den;
    const vsC = (dv / wetVol) * 100;

    const err = vsSanity(vsC);
    if (err) {
      addToast('Sanity Error', err, 'error');
      return;
    }

    const dryDen = dv > 0 ? dryW / dv : 0;
    const st = vsStatus(vsC, pub);

    setVslRes({
      vsC,
      cls: vsClass(vsC),
      rec: vsRec(vsC),
      nv,
      wetVol,
      dryDen,
      pub,
      diff: st ? st.diff : null,
      dev: st ? st.dev : null,
      status: st,
      we,
      ww,
      wd,
      wetW,
      dryW,
      den,
      dv,
      name: vslNm || '—'
    });
    addToast('Calculated Laboratory VS', 'Method 3 (ASTM D2697 / ISO 3233) calculated.', 'success');
  };

  const rstVSL = () => {
    setVslWe('');
    setVslWw('');
    setVslWd('');
    setVslDen('');
    setVslDv('');
    setVslPub('');
    setVslNm('');
    setVslRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (title, text) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${title} report copied.`, 'success');
  };

  return (
    <>
      {/* METHOD 1 — TDS VERIFICATION */}
      {mode === 'tds' && (
        <div className="sub-sec card active" id="vs-tds">
          <div className="ch">
            <div className="ci">📋</div>
            <div>
              <div className="ct">Method 1 — TDS Verification</div>
              <div className="cs">Cross-check the manufacturer's Product Data Sheet: VS% = DFT × Coverage ÷ 10</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('volume_solids_tds')}>📖 Guideline</button>
            <div className="ctag">PRO · VS-1</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>DFT (from TDS) <span className="lh">µm</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vst-dft" 
                      placeholder="e.g. 125" 
                      min="0" 
                      value={vstDft} 
                      onChange={(e) => setVstDft(e.target.value)} 
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>

                <div className="field">
                  <label>Theoretical Coverage <span className="lh">m²/L</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vst-cov" 
                      placeholder="e.g. 5.6" 
                      min="0" 
                      step="any" 
                      value={vstCov} 
                      onChange={(e) => setVstCov(e.target.value)} 
                    />
                    <span className="uu">m²/L</span>
                  </div>
                </div>

                <div className="field">
                  <label>Published Volume Solids <span className="lh">% · optional</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vst-pub" 
                      placeholder="e.g. 70" 
                      min="0" 
                      max="100" 
                      step="any" 
                      value={vstPub} 
                      onChange={(e) => setVstPub(e.target.value)} 
                    />
                    <span className="uu">%</span>
                  </div>
                </div>

                <div className="field">
                  <label>Product Name <span className="lh">optional</span></label>
                  <div className="iw">
                    <input 
                      type="text" 
                      id="vst-nm" 
                      placeholder="e.g. High-Build Epoxy" 
                      value={vstNm} 
                      onChange={(e) => setVstNm(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--in-lbl)' }}>Formula:</strong> Volume Solids (%) = ( DFT × Theoretical Coverage ) ÷ 10 &nbsp;·&nbsp; Example: 125 µm × 5.6 m²/L ÷ 10 = <strong>70%</strong>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={calcVST}>▶ Verify Volume Solids</button>
              <button className="btn-reset" onClick={rstVST}>↺ Reset</button>
            </div>

            {vstRes && (
              <div className="res show" id="r-vst">
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Volume Solids Result</div>

                  {vstRes.status && (
                    <div style={{ background: vstRes.status.bg, border: `1.5px solid ${vstRes.status.bd}`, borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '19px', fontWeight: 700, color: vstRes.status.c1 }}>
                        {vstRes.status.ic} {vstRes.status.status} — {vstRes.status.status === 'PASS' ? 'TDS Value Verified' : vstRes.status.status === 'REVIEW' ? 'Deviation 2–5% — Review with Manufacturer' : 'Deviation > 5% — Discrepancy Flagged'}
                      </div>
                      <div style={{ fontSize: '12px', color: vstRes.status.c2, marginTop: '3px' }}>
                        Calculated {formatNum(vstRes.vsC, 1)}% vs Published {formatNum(vstRes.pub, 1)}% &nbsp;·&nbsp; Difference: {formatNum(vstRes.diff, 1)}% &nbsp;·&nbsp; Deviation: {formatNum(vstRes.dev, 1)}%
                      </div>
                    </div>
                  )}

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Calculated Volume Solids</div>
                      <div>
                        <span className="tv" id="vst-r">{formatNum(vstRes.vsC, 1)}</span>
                        <span className="tu">%</span>
                      </div>
                      <div className="tn" id="vst-cls">{vstRes.cls}</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Published VS (TDS)</div>
                      <div>
                        <span className="tv" id="vst-rpub">{vstRes.pub ? formatNum(vstRes.pub, 1) : '—'}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Difference</div>
                      <div>
                        <span className="tv" id="vst-rdiff">{vstRes.diff !== null ? formatNum(vstRes.diff, 1) : '—'}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Deviation</div>
                      <div>
                        <span className="tv" id="vst-rdev">{vstRes.dev !== null ? formatNum(vstRes.dev, 1) : '—'}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="input-summary">
                    <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                    <div className="dr"><span className="dk">Product Name</span><span className="dv" id="vst-rnm">{vstRes.name}</span></div>
                    <div className="dr"><span className="dk">DFT</span><span className="dv" id="vst-rdft">{vstRes.dft} µm</span></div>
                    <div className="dr"><span className="dk">Theoretical Coverage</span><span className="dv" id="vst-rcov">{vstRes.cov} m²/L</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '11px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderLeft: '3px solid var(--brand-orange)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.7 }}>
                    <strong style={{ color: 'var(--brand-crimson)' }}>🛠 Smart Engineering Recommendation — {vstRes.cls}:</strong><br />
                    {vstRes.rec}
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>Validation Criteria:</strong> Difference &lt; ±2% → <strong>PASS</strong> · 2–5% → <strong>REVIEW</strong> · &gt; 5% → <strong>FAIL</strong>. Engineering verification only — not a substitute for ASTM D2697 / ISO 3233 laboratory testing.
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
                  <button 
                    className="btn-share" 
                    onClick={() => handleShare('TDS Volume Solids', `BG CoatingOS™ — Volume Solids TDS Verification\nProduct: ${vstRes.name}\nDFT: ${vstRes.dft} µm | Coverage: ${vstRes.cov} m²/L\nCalculated VS: ${formatNum(vstRes.vsC, 1)}% (${vstRes.cls})\nStatus: ${vstRes.status ? vstRes.status.status : 'N/A'}`)}
                  >
                    📤 Share Text
                  </button>
                  <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting VS report to Excel...', 'info')}>
                    📊 Excel Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* METHOD 2 — DENSITY VERIFICATION */}
      {mode === 'den' && (
        <div className="sub-sec card active" id="vs-den">
          <div className="ch">
            <div className="ci">⚖️</div>
            <div>
              <div className="ct">Method 2 — Density Verification</div>
              <div className="cs">Paint-manufacturing method: VS = Weight Solids × Wet Density ÷ Dry Film Density</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('volume_solids_density')}>📖 Guideline</button>
            <div className="ctag">PRO · VS-2</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Weight Solids <span className="lh">%</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsd-ws" 
                      placeholder="e.g. 80" 
                      min="0" 
                      max="100" 
                      step="any" 
                      value={vsdWs} 
                      onChange={(e) => setVsdWs(e.target.value)} 
                    />
                    <span className="uu">%</span>
                  </div>
                </div>

                <div className="field">
                  <label>Wet Paint Density <span className="lh">kg/L · ASTM D1475</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsd-wd" 
                      placeholder="e.g. 1.60" 
                      min="0" 
                      step="any" 
                      value={vsdWd} 
                      onChange={(e) => setVsdWd(e.target.value)} 
                    />
                    <span className="uu">kg/L</span>
                  </div>
                </div>

                <div className="field">
                  <label>Dry Film Density <span className="lh">kg/L</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsd-dd" 
                      placeholder="e.g. 1.80" 
                      min="0" 
                      step="any" 
                      value={vsdDd} 
                      onChange={(e) => setVsdDd(e.target.value)} 
                    />
                    <span className="uu">kg/L</span>
                  </div>
                </div>

                <div className="field">
                  <label>Published Volume Solids <span className="lh">% · optional</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsd-pub" 
                      placeholder="e.g. 71" 
                      min="0" 
                      max="100" 
                      step="any" 
                      value={vsdPub} 
                      onChange={(e) => setVsdPub(e.target.value)} 
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>

              <div className="field" style={{ marginTop: '10px' }}>
                <label>Product Name <span className="lh">optional</span></label>
                <div className="iw">
                  <input 
                    type="text" 
                    id="vsd-nm" 
                    placeholder="e.g. Solvent-Free Epoxy" 
                    value={vsdNm} 
                    onChange={(e) => setVsdNm(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--in-lbl)' }}>Formula:</strong> VS% = Weight Solids × ( Wet Density ÷ Dry Film Density ) &nbsp;·&nbsp; Example: 0.80 × 1.60 ÷ 1.80 = <strong>71.1%</strong>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={calcVSD}>▶ Calculate Volume Solids</button>
              <button className="btn-reset" onClick={rstVSD}>↺ Reset</button>
            </div>

            {vsdRes && (
              <div className="res show" id="r-vsd">
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Volume Solids Result</div>

                  {vsdRes.status && (
                    <div style={{ background: vsdRes.status.bg, border: `1.5px solid ${vsdRes.status.bd}`, borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '19px', fontWeight: 700, color: vsdRes.status.c1 }}>
                        {vsdRes.status.ic} {vsdRes.status.status} — {vsdRes.status.status === 'PASS' ? 'Density Method Verified' : vsdRes.status.status === 'REVIEW' ? 'Deviation 2–5% — Review Parameters' : 'Deviation > 5% — Discrepancy Flagged'}
                      </div>
                      <div style={{ fontSize: '12px', color: vsdRes.status.c2, marginTop: '3px' }}>
                        Calculated {formatNum(vsdRes.vsC, 1)}% vs Published {formatNum(vsdRes.pub, 1)}% &nbsp;·&nbsp; Difference: {formatNum(vsdRes.diff, 1)}% &nbsp;·&nbsp; Deviation: {formatNum(vsdRes.dev, 1)}%
                      </div>
                    </div>
                  )}

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Calculated Volume Solids</div>
                      <div>
                        <span className="tv" id="vsd-r">{formatNum(vsdRes.vsC, 1)}</span>
                        <span className="tu">%</span>
                      </div>
                      <div className="tn" id="vsd-cls">{vsdRes.cls}</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Published VS (TDS)</div>
                      <div>
                        <span className="tv" id="vsd-rpub">{vsdRes.pub ? formatNum(vsdRes.pub, 1) : '—'}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Difference</div>
                      <div>
                        <span className="tv" id="vsd-rdiff">{vsdRes.diff !== null ? formatNum(vsdRes.diff, 1) : '—'}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Deviation</div>
                      <div>
                        <span className="tv" id="vsd-rdev">{vsdRes.dev !== null ? formatNum(vsdRes.dev, 1) : '—'}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="input-summary">
                    <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                    <div className="dr"><span className="dk">Product Name</span><span className="dv" id="vsd-rnm">{vsdRes.name}</span></div>
                    <div className="dr"><span className="dk">Weight Solids</span><span className="dv" id="vsd-rws">{vsdRes.ws}%</span></div>
                    <div className="dr"><span className="dk">Wet Density</span><span className="dv" id="vsd-rwd">{vsdRes.wd} kg/L</span></div>
                    <div className="dr"><span className="dk">Dry Film Density</span><span className="dv" id="vsd-rdd">{vsdRes.dd} kg/L</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '11px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderLeft: '3px solid var(--brand-orange)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.7 }}>
                    <strong style={{ color: 'var(--brand-crimson)' }}>🛠 Smart Engineering Recommendation — {vsdRes.cls}:</strong><br />
                    {vsdRes.rec}
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
                  <button 
                    className="btn-share" 
                    onClick={() => handleShare('Density Volume Solids', `BG CoatingOS™ — Volume Solids Density Verification\nProduct: ${vsdRes.name}\nWS: ${vsdRes.ws}% | Wet Density: ${vsdRes.wd} kg/L | Dry Density: ${vsdRes.dd} kg/L\nCalculated VS: ${formatNum(vsdRes.vsC, 1)}% (${vsdRes.cls})`)}
                  >
                    📤 Share Text
                  </button>
                  <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting VS report to Excel...', 'info')}>
                    📊 Excel Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* METHOD 3 — LABORATORY VERIFICATION */}
      {mode === 'lab' && (
        <div className="sub-sec card active" id="vs-lab">
          <div className="ch">
            <div className="ci">🧫</div>
            <div>
              <div className="ct">Method 3 — Laboratory Verification</div>
              <div className="cs">ASTM D2697 / ISO 3233 — most accurate: gravimetric weights + measured dry film volume</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('volume_solids_lab')}>📖 Guideline</button>
            <div className="ctag">PRO · VS-3</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Weight of Empty Dish <span className="lh">g</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsl-we" 
                      placeholder="e.g. 25.000" 
                      min="0" 
                      step="any" 
                      value={vslWe} 
                      onChange={(e) => setVslWe(e.target.value)} 
                    />
                    <span className="uu">g</span>
                  </div>
                </div>

                <div className="field">
                  <label>Dish + Wet Paint <span className="lh">g</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsl-ww" 
                      placeholder="e.g. 30.000" 
                      min="0" 
                      step="any" 
                      value={vslWw} 
                      onChange={(e) => setVslWw(e.target.value)} 
                    />
                    <span className="uu">g</span>
                  </div>
                </div>

                <div className="field">
                  <label>Dish + Dry Film <span className="lh">g · after full cure</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsl-wd" 
                      placeholder="e.g. 29.000" 
                      min="0" 
                      step="any" 
                      value={vslWd} 
                      onChange={(e) => setVslWd(e.target.value)} 
                    />
                    <span className="uu">g</span>
                  </div>
                </div>

                <div className="field">
                  <label>Wet Paint Density <span className="lh">kg/L · ASTM D1475</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsl-den" 
                      placeholder="e.g. 1.60" 
                      min="0" 
                      step="any" 
                      value={vslDen} 
                      onChange={(e) => setVslDen(e.target.value)} 
                    />
                    <span className="uu">kg/L</span>
                  </div>
                </div>

                <div className="field">
                  <label>Measured Dry Film Volume <span className="lh">cm³ · D2697/ISO 3233</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsl-dv" 
                      placeholder="e.g. 2.200" 
                      min="0" 
                      step="any" 
                      value={vslDv} 
                      onChange={(e) => setVslDv(e.target.value)} 
                    />
                    <span className="uu">cm³</span>
                  </div>
                </div>

                <div className="field">
                  <label>Published Volume Solids <span className="lh">% · optional</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="vsl-pub" 
                      placeholder="e.g. 70" 
                      min="0" 
                      max="100" 
                      step="any" 
                      value={vslPub} 
                      onChange={(e) => setVslPub(e.target.value)} 
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>

              <div className="field" style={{ marginTop: '10px' }}>
                <label>Product / Lab Reference <span className="lh">optional</span></label>
                <div className="iw">
                  <input 
                    type="text" 
                    id="vsl-nm" 
                    placeholder="e.g. Batch 4521 — Epoxy MIO" 
                    value={vslNm} 
                    onChange={(e) => setVslNm(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--in-lbl)' }}>Calculation Steps:</strong><br />
                ① Wet Wt = (Dish+Wet) − Dish &nbsp;·&nbsp;
                ② Dry Wt = (Dish+Dry) − Dish &nbsp;·&nbsp;
                ③ Non-Volatile % = Dry ÷ Wet × 100 &nbsp;·&nbsp;
                ④ Wet Volume = Wet Wt ÷ Density &nbsp;·&nbsp;
                ⑤ <strong>VS% = Dry Film Volume ÷ Wet Volume × 100</strong>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={calcVSL}>▶ Calculate Volume Solids (Lab)</button>
              <button className="btn-reset" onClick={rstVSL}>↺ Reset</button>
            </div>

            {vslRes && (
              <div className="res show" id="r-vsl">
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Laboratory Volume Solids Result</div>

                  {vslRes.status && (
                    <div style={{ background: vslRes.status.bg, border: `1.5px solid ${vslRes.status.bd}`, borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '19px', fontWeight: 700, color: vslRes.status.c1 }}>
                        {vslRes.status.ic} {vslRes.status.status} — {vslRes.status.status === 'PASS' ? 'Laboratory VS Verified' : vslRes.status.status === 'REVIEW' ? 'Deviation 2–5% — Review with Lab' : 'Deviation > 5% — Discrepancy Flagged'}
                      </div>
                      <div style={{ fontSize: '12px', color: vslRes.status.c2, marginTop: '3px' }}>
                        Calculated {formatNum(vslRes.vsC, 1)}% vs Published {formatNum(vslRes.pub, 1)}% &nbsp;·&nbsp; Difference: {formatNum(vslRes.diff, 1)}% &nbsp;·&nbsp; Deviation: {formatNum(vslRes.dev, 1)}%
                      </div>
                    </div>
                  )}

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Volume Solids (Lab)</div>
                      <div>
                        <span className="tv" id="vsl-r">{formatNum(vslRes.vsC, 1)}</span>
                        <span className="tu">%</span>
                      </div>
                      <div className="tn" id="vsl-cls">{vslRes.cls}</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Weight Solids (NV%)</div>
                      <div>
                        <span className="tv" id="vsl-rnv">{formatNum(vslRes.nv, 1)}</span>
                        <span className="tu">%</span>
                      </div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Wet Paint Volume</div>
                      <div>
                        <span className="tv" id="vsl-rwv">{formatNum(vslRes.wetVol, 3)}</span>
                        <span className="tu">cm³</span>
                      </div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Dry Film Density</div>
                      <div>
                        <span className="tv" id="vsl-rdd">{formatNum(vslRes.dryDen, 3)}</span>
                        <span className="tu">kg/L</span>
                      </div>
                    </div>
                  </div>

                  <div className="input-summary">
                    <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                    <div className="dr"><span className="dk">Product / Lab Ref</span><span className="dv" id="vsl-rnm">{vslRes.name}</span></div>
                    <div className="dr"><span className="dk">Empty Dish</span><span className="dv" id="vsl-rwe">{formatNum(vslRes.we, 3)} g</span></div>
                    <div className="dr"><span className="dk">Dish + Wet Paint</span><span className="dv" id="vsl-rww">{formatNum(vslRes.ww, 3)} g</span></div>
                    <div className="dr"><span className="dk">Dish + Dry Film</span><span className="dv" id="vsl-rwdd">{formatNum(vslRes.wd, 3)} g</span></div>
                    <div className="dr"><span className="dk">Wet Paint Weight</span><span className="dv" id="vsl-rwetw">{formatNum(vslRes.wetW, 3)} g</span></div>
                    <div className="dr"><span className="dk">Dry Film Weight</span><span className="dv" id="vsl-rdryw">{formatNum(vslRes.dryW, 3)} g</span></div>
                    <div className="dr"><span className="dk">Wet Density</span><span className="dv" id="vsl-rden">{vslRes.den} kg/L</span></div>
                    <div className="dr"><span className="dk">Dry Film Volume (Measured)</span><span className="dv" id="vsl-rdv">{vslRes.dv} cm³</span></div>
                    <div className="dr"><span className="dk">Published VS (TDS)</span><span className="dv" id="vsl-rpub">{vslRes.pub ? `${vslRes.pub}%` : '—'}</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '11px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderLeft: '3px solid var(--brand-orange)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.7 }}>
                    <strong style={{ color: 'var(--brand-crimson)' }}>🛠 Smart Engineering Recommendation — {vslRes.cls}:</strong><br />
                    {vslRes.rec}
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
                  <button 
                    className="btn-share" 
                    onClick={() => handleShare('Lab Volume Solids', `BG CoatingOS™ — Volume Solids ASTM D2697 / ISO 3233 Laboratory Verification\nProduct: ${vslRes.name}\nCalculated Lab VS: ${formatNum(vslRes.vsC, 1)}% (${vslRes.cls})\nNV%: ${formatNum(vslRes.nv, 1)}% | Dry Density: ${formatNum(vslRes.dryDen, 3)} kg/L`)}
                  >
                    📤 Share Text
                  </button>
                  <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting VS report to Excel...', 'info')}>
                    📊 Excel Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
