import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

function recClass(ap) {
  if (ap <= 5) return { cls: 'Excellent Control', st: 'PASS', ic: '✅', bg: '#E8F5E9', bd: 'rgba(46,125,50,.35)', c1: '#1B5E20', c2: '#2E7D32', bar: '#2E7D32' };
  if (ap <= 10) return { cls: 'Acceptable', st: 'PASS', ic: '🔵', bg: '#E3F2FD', bd: 'rgba(21,101,192,.35)', c1: '#0D47A1', c2: '#1565C0', bar: '#1565C0' };
  if (ap <= 15) return { cls: 'Needs Review', st: 'REVIEW', ic: '⚠️', bg: '#FFF8E1', bd: 'rgba(245,127,23,.4)', c1: '#8B4500', c2: '#B26A00', bar: '#E8700A' };
  return { cls: 'Investigate', st: 'FAIL', ic: '❌', bg: '#FFEBEE', bd: 'rgba(211,47,47,.35)', c1: '#B71C1C', c2: '#C62828', bar: '#C62828' };
}

function recComment(vp) {
  const ap = Math.abs(vp);
  if (vp < -5) return 'Paint saving achieved — actual consumption is below the estimated requirement. Verify that specified DFT was achieved (ISO 19840 / SSPC-PA 2) before accepting the saving.';
  if (ap <= 5) return 'Excellent material control. Paint consumption is within acceptable engineering limits.';
  if (ap <= 10) return 'Paint consumption is slightly higher than estimated. Review application efficiency, overspray, and blasting profile.';
  if (ap <= 15) return 'Consumption variance requires review. Check DFT records, transfer efficiency, mixing practices, and environmental conditions.';
  return 'Significant variance detected (>15%). Initiate a formal audit of DFT logs, batch mixing records, container empty weights, and site spillage reports immediately.';
}

export default function PaintReconciliationTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // A · Project Info
  const [proj, setProj] = useState('Tank Farm T-101 External');
  const [client, setClient] = useState('IOCL');
  const [contractor, setContractor] = useState('ABC Coatings Pvt Ltd');
  const [mfr, setMfr] = useState('Jotun / AkzoNobel');
  const [prod, setProd] = useState('Epoxy MIO Intermediate');
  const [coatNo, setCoatNo] = useState('2nd Coat');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // B · Surface & Specification
  const [area, setArea] = useState('2500');
  const [dft, setDft] = useState('125');
  const [vs, setVs] = useState('70');
  const [loss, setLoss] = useState('15');
  const [coats, setCoats] = useState('1');

  // C · Material Issue Details
  const [openStock, setOpenStock] = useState('100');
  const [received, setReceived] = useState('400');
  const [issued, setIssued] = useState('450');
  const [returned, setReturned] = useState('0');
  const [unused, setUnused] = useState('0');
  const [rejected, setRejected] = useState('0');
  const [spillage, setSpillage] = useState('0');
  const [thinner, setThinner] = useState('0');

  // D · Density & Cost
  const [density, setDensity] = useState('1.45');
  const [cost, setCost] = useState('650');

  const [res, setRes] = useState(null);

  // Dynamic available paint
  const totalAvailable = (parseFloat(openStock) || 0) + (parseFloat(received) || 0);

  const handleCalculate = () => {
    const areaVal = parseFloat(area);
    const dftVal = parseFloat(dft);
    const vsVal = parseFloat(vs);
    const lossVal = parseFloat(loss) || 0;
    const coatsVal = parseInt(coats, 10) || 1;

    const issVal = parseFloat(issued);
    const retVal = parseFloat(returned) || 0;
    const unuVal = parseFloat(unused) || 0;
    const rejVal = parseFloat(rejected) || 0;
    const splVal = parseFloat(spillage) || 0;
    const thnVal = parseFloat(thinner) || 0;
    const denVal = parseFloat(density) || 0;
    const costVal = parseFloat(cost) || 0;

    if (!areaVal || !dftVal || !vsVal) {
      addToast('Missing Required Inputs', 'Please fill Surface Area, Specified DFT and Volume Solids.', 'warning');
      return;
    }
    if (isNaN(issVal)) {
      addToast('Missing Required Inputs', 'Please fill Paint Issued to Site.', 'warning');
      return;
    }

    const tc = (vsVal * 10) / dftVal;
    const pc = (tc * (100 - lossVal)) / 100;
    const theoReq = (areaVal * coatsVal) / tc;
    const pracReq = (areaVal * coatsVal) / pc;

    const consumed = issVal - retVal - unuVal;
    if (consumed < 0) {
      addToast('Logic Error', 'Returned + Unused paint cannot exceed Paint Issued.', 'error');
      return;
    }

    const wasted = splVal + rejVal;
    const totalActual = consumed + wasted;

    const variance = totalActual - pracReq;
    const varp = (variance / pracReq) * 100;
    const fin = costVal > 0 ? variance * costVal : null;
    const eff = totalActual > 0 ? (pracReq / totalActual) * 100 : 0;
    const util = issVal > 0 ? (consumed / issVal) * 100 : 0;
    const closing = totalAvailable - issVal + retVal;
    const kg = denVal > 0 ? totalActual * denVal : null;

    const g = recClass(Math.abs(varp));
    const saving = variance < 0;

    setRes({
      tc,
      pc,
      theoReq,
      pracReq,
      consumed,
      wasted,
      totalActual,
      variance,
      varp,
      fin,
      eff,
      util,
      closing,
      kg,
      g,
      saving,
      areaVal,
      dftVal,
      vsVal,
      lossVal,
      coatsVal,
      issVal,
      retVal,
      unuVal,
      rejVal,
      splVal,
      thnVal,
      denVal,
      costVal,
      proj,
      client,
      contractor,
      mfr,
      prod,
      coatNo,
      reportDate
    });
    addToast('Reconciliation Complete', 'Material variance and KPIs computed.', 'success');
  };

  const handleReset = () => {
    setProj('');
    setClient('');
    setContractor('');
    setMfr('');
    setProd('');
    setCoatNo('');
    setArea('');
    setDft('');
    setVs('');
    setLoss('15');
    setCoats('1');
    setOpenStock('');
    setReceived('');
    setIssued('');
    setReturned('0');
    setUnused('0');
    setRejected('0');
    setSpillage('0');
    setThinner('0');
    setDensity('');
    setCost('');
    setRes(null);
    addToast('Form Reset', 'Parameters have been cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Paint Reconciliation Report
Project: ${res.proj || '—'} | Product: ${res.prod || '—'}
Area: ${res.areaVal} m² | Specified DFT: ${res.dftVal} µm | VS: ${res.vsVal}%
--------------------------------------------------
Theoretical Requirement: ${formatNum(res.theoReq, 1)} L
Practical Requirement (incl. loss): ${formatNum(res.pracReq, 1)} L
Actual Paint Consumed: ${formatNum(res.consumed, 1)} L
Total Actual (incl. waste): ${formatNum(res.totalActual, 1)} L
Variance: ${res.variance >= 0 ? '+' : ''}${formatNum(res.variance, 1)} L (${res.varp >= 0 ? '+' : ''}${formatNum(res.varp, 1)}%)
Classification: ${res.g.cls} (${res.g.st})
Consumption Efficiency: ${formatNum(res.eff, 1)}%
Material Utilization: ${formatNum(res.util, 1)}%
${res.fin !== null ? `Financial Impact: ${formatCur(res.fin)}` : ''}`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Reconciliation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="pro-recon">
      <div className="ch">
        <div className="ci">📊</div>
        <div>
          <div className="ct">Paint Reconciliation Calculator</div>
          <div className="cs">Theoretical requirement vs actual issued / consumed / returned — savings, excess &amp; financial impact</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('paint_reconciliation')}>📖 Guideline</button>
        <div className="ctag">PRO · PR-1</div>
      </div>

      <div className="cb">
        <div className="input-section">
          {/* Section A */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', marginBottom: '8px' }}>
            A · Project Information
          </div>
          <div className="g2">
            <div className="field">
              <label>Project Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-proj" 
                  placeholder="e.g. Tank Farm T-101 External" 
                  value={proj} 
                  onChange={(e) => setProj(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Client <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-cli" 
                  placeholder="e.g. IOCL" 
                  value={client} 
                  onChange={(e) => setClient(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Contractor <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-con" 
                  placeholder="e.g. ABC Coatings Pvt Ltd" 
                  value={contractor} 
                  onChange={(e) => setContractor(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Paint Manufacturer <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-mfr" 
                  placeholder="e.g. Jotun / AkzoNobel" 
                  value={mfr} 
                  onChange={(e) => setMfr(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Paint Product <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-prod" 
                  placeholder="e.g. Epoxy MIO Intermediate" 
                  value={prod} 
                  onChange={(e) => setProd(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Coat Number <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-coatno" 
                  placeholder="e.g. 2nd Coat" 
                  value={coatNo} 
                  onChange={(e) => setCoatNo(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Report Date <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="date" 
                  id="rec-date" 
                  value={reportDate} 
                  onChange={(e) => setReportDate(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Surface &amp; Specification
          </div>
          <div className="g2">
            <div className="field">
              <label>Surface Area Painted <span className="lh">m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-area" 
                  placeholder="e.g. 2500" 
                  min="0" 
                  step="any" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)} 
                />
                <span className="uu">m²</span>
              </div>
            </div>

            <div className="field">
              <label>Specified DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-dft" 
                  placeholder="e.g. 125" 
                  min="0" 
                  step="any" 
                  value={dft} 
                  onChange={(e) => setDft(e.target.value)} 
                />
                <span className="uu">µm</span>
              </div>
            </div>

            <div className="field">
              <label>Volume Solids <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-vs" 
                  placeholder="e.g. 70" 
                  min="1" 
                  max="100" 
                  step="any" 
                  value={vs} 
                  onChange={(e) => setVs(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Loss Factor <span className="lh">% · default 15</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-loss" 
                  placeholder="15" 
                  value={loss} 
                  min="0" 
                  max="90" 
                  step="any" 
                  onChange={(e) => setLoss(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Number of Coats <span className="lh">for this reconciliation</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-coats" 
                  placeholder="1" 
                  value={coats} 
                  min="1" 
                  step="1" 
                  onChange={(e) => setCoats(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Material Issue Details
          </div>
          <div className="g2">
            <div className="field">
              <label>Opening Stock <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-open" 
                  placeholder="e.g. 100" 
                  min="0" 
                  step="any" 
                  value={openStock} 
                  onChange={(e) => setOpenStock(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Paint Received <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-rcv" 
                  placeholder="e.g. 400" 
                  min="0" 
                  step="any" 
                  value={received} 
                  onChange={(e) => setReceived(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Total Paint Available <span className="lh">auto</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="rec-avail" 
                  value={totalAvailable ? `${totalAvailable} L` : '—'} 
                  readOnly 
                  style={{ background: 'var(--bg2)', color: 'var(--txt2)', fontWeight: 700 }} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Paint Issued to Site <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-iss" 
                  placeholder="e.g. 450" 
                  min="0" 
                  step="any" 
                  value={issued} 
                  onChange={(e) => setIssued(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Paint Returned to Store <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-ret" 
                  placeholder="0" 
                  value={returned} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setReturned(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Unused Paint in Container <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-unu" 
                  placeholder="0" 
                  value={unused} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setUnused(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Rejected Paint <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-rej" 
                  placeholder="0" 
                  value={rejected} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setRejected(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Spillage / Wastage <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-spl" 
                  placeholder="0" 
                  value={spillage} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setSpillage(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>

            <div className="field">
              <label>Thinner Issued <span className="lh">L · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-thn" 
                  placeholder="0" 
                  value={thinner} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setThinner(e.target.value)} 
                />
                <span className="uu">L</span>
              </div>
            </div>
          </div>

          {/* Section D */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            D · Optional — Density &amp; Cost
          </div>
          <div className="g2">
            <div className="field">
              <label>Paint Density <span className="lh">kg/L · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-den" 
                  placeholder="e.g. 1.45" 
                  min="0" 
                  step="any" 
                  value={density} 
                  onChange={(e) => setDensity(e.target.value)} 
                />
                <span className="uu">kg/L</span>
              </div>
            </div>

            <div className="field">
              <label>Paint Cost <span className="lh">₹/L · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="rec-cost" 
                  placeholder="e.g. 650" 
                  min="0" 
                  step="any" 
                  value={cost} 
                  onChange={(e) => setCost(e.target.value)} 
                />
                <span className="uu">₹/L</span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Run Paint Reconciliation</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {res && (
          <div className="res show" id="r-rec">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Reconciliation Result</div>

              {/* Verdict Banner */}
              <div style={{ background: res.g.bg, border: `1.5px solid ${res.g.bd}`, borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '19px', fontWeight: 700, color: res.g.c1 }}>
                  {res.g.ic} {res.g.st} — {res.g.cls}
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: res.g.c2, marginTop: '3px' }}>
                  {res.saving ? `Paint Saving of ${formatNum(Math.abs(res.variance), 1)} L` : `Paint Excess of ${formatNum(res.variance, 1)} L`}
                  {' · '}Variance {res.varp >= 0 ? '+' : ''}{formatNum(res.varp, 1)}% vs Practical Requirement {formatNum(res.pracReq, 1)} L
                </div>
              </div>

              {/* Primary 4 Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Paint Variance</div>
                  <div>
                    <span className="tv" id="rec-rvar">{res.variance >= 0 ? '+' : '−'}{formatNum(Math.abs(res.variance), 1)}</span>
                    <span className="tu">L</span>
                  </div>
                  <div className="tn" id="rec-rvarn">{res.saving ? 'Paint Saving (−)' : 'Paint Excess (+)'}</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Variance</div>
                  <div>
                    <span className="tv" id="rec-rvarp">{res.varp >= 0 ? '+' : '−'}{formatNum(Math.abs(res.varp), 1)}</span>
                    <span className="tu">%</span>
                  </div>
                  <div className="tn" id="rec-rcls">{res.g.cls}</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Consumption Efficiency</div>
                  <div>
                    <span className="tv" id="rec-reff">{formatNum(res.eff, 1)}</span>
                    <span className="tu">%</span>
                  </div>
                </div>

                <div className="tile tg">
                  <div className="tl">Material Utilization</div>
                  <div>
                    <span className="tv" id="rec-rutil">{formatNum(res.util, 1)}</span>
                    <span className="tu">%</span>
                  </div>
                </div>
              </div>

              {/* Secondary 6 Tiles */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Theoretical Requirement</div>
                  <div className="tv" style={{ fontSize: '22px' }}>{formatNum(res.theoReq, 1)}<span className="tu">L</span></div>
                </div>

                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Practical Requirement (incl. loss)</div>
                  <div className="tv" style={{ fontSize: '22px' }}>{formatNum(res.pracReq, 1)}<span className="tu">L</span></div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Actual Paint Consumed</div>
                  <div className="tv" style={{ fontSize: '22px' }}>{formatNum(res.consumed, 1)}<span className="tu">L</span></div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Total Actual (incl. losses)</div>
                  <div className="tv" style={{ fontSize: '22px' }}>{formatNum(res.totalActual, 1)}<span className="tu">L</span></div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Paint Wasted (Spillage+Rejected)</div>
                  <div className="tv" style={{ fontSize: '22px' }}>{formatNum(res.wasted, 1)}<span className="tu">L</span></div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Financial Impact</div>
                  <div className="tv" style={{ fontSize: '22px' }}>
                    {res.fin !== null ? (res.fin >= 0 ? `+${formatCur(res.fin)}` : `−${formatCur(Math.abs(res.fin))}`) : '—'}
                  </div>
                </div>
              </div>

              {/* Material Flow Diagram */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Material Flow
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                  <div style={{ flex: 1, minWidth: '120px', background: '#F1F5F9', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #64748B' }}>
                    <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>1 · AVAILABLE</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>{totalAvailable} L</div>
                    <div style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '2px' }}>Opening + Received</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px', background: '#EFF6FF', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #3B82F6' }}>
                    <div style={{ fontSize: '9px', color: '#3B82F6', fontWeight: 600 }}>2 · ISSUED</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1E3A8A', marginTop: '2px' }}>{res.issVal} L</div>
                    <div style={{ fontSize: '9.5px', color: '#60A5FA', marginTop: '2px' }}>Issued to Site</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px', background: '#ECFDF5', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                    <div style={{ fontSize: '9px', color: '#10B981', fontWeight: 600 }}>3 · CONSUMED</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#064E3B', marginTop: '2px' }}>{res.consumed} L</div>
                    <div style={{ fontSize: '9.5px', color: '#34D399', marginTop: '2px' }}>Applied on Steel</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px', background: '#FEF2F2', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #EF4444' }}>
                    <div style={{ fontSize: '9px', color: '#EF4444', fontWeight: 600 }}>4 · WASTED / REJ</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#7F1D1D', marginTop: '2px' }}>{res.wasted} L</div>
                    <div style={{ fontSize: '9.5px', color: '#F87171', marginTop: '2px' }}>Spill + Reject</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px', background: '#FFFBEB', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #F59E0B' }}>
                    <div style={{ fontSize: '9px', color: '#F59E0B', fontWeight: 600 }}>5 · STORE CLOSING</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#78350F', marginTop: '2px' }}>{res.closing} L</div>
                    <div style={{ fontSize: '9.5px', color: '#FBBF24', marginTop: '2px' }}>Store Balance</div>
                  </div>
                </div>
              </div>

              {/* Engineering Recommendation Box */}
              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderLeft: '3px solid var(--brand-orange)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.65 }}>
                <strong style={{ color: 'var(--brand-crimson)' }}>🛠 Engineering Recommendation — {res.g.cls}:</strong><br />
                {recComment(res.varp)}
              </div>

              {/* Input Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Project Material Summary</div>
                <div className="dr"><span className="dk">Project</span><span className="dv">{res.proj || '—'}</span></div>
                <div className="dr"><span className="dk">Client / Contractor</span><span className="dv">{res.client || '—'} / {res.contractor || '—'}</span></div>
                <div className="dr"><span className="dk">Product / Coat</span><span className="dv">{res.prod || '—'} ({res.coatNo || '—'})</span></div>
                <div className="dr"><span className="dk">Surface Area Painted</span><span className="dv">{res.areaVal.toLocaleString()} m²</span></div>
                <div className="dr"><span className="dk">Specified DFT / VS%</span><span className="dv">{res.dftVal} µm / {res.vsVal}%</span></div>
                <div className="dr"><span className="dk">Practical Requirement</span><span className="dv">{formatNum(res.pracReq, 1)} L</span></div>
                <div className="dr"><span className="dk">Actual Applied + Wasted</span><span className="dv">{formatNum(res.totalActual, 1)} L</span></div>
                {res.kg !== null && (
                  <div className="dr"><span className="dk">Total Paint Weight (at {res.denVal} kg/L)</span><span className="dv">{formatNum(res.kg, 1)} kg</span></div>
                )}
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>Classification:</strong> ±0–5% Excellent Control · ±5–10% Acceptable · ±10–15% Needs Review · &gt;15% Investigate &nbsp;|&nbsp; <strong>References:</strong> ISO 12944 · ISO 19840 · SSPC PA Guide · ASTM D3276 · ASTM D4414 · AMPP GPP · NORSOK M-501 · PMBOK Material Control
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-share" onClick={handleShare}>📤 Share Text</button>
              <button className="btn-print" onClick={handlePrint}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Generating reconciliation report...', 'info')}>
                📊 Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
