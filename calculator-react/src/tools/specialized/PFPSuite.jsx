import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

const PFP_THK_DB = { '30': 8, '60': 16, '90': 24, '120': 32, '180': 45, '240': 60 };

function pftCalcThk(fr, hpa, tc, mf) {
  const base = PFP_THK_DB[String(fr)] || 32;
  const fS = Math.max(0.7, Math.min(1.4, Math.pow(hpa / 180, 0.5)));
  const fT = Math.max(0.8, Math.min(1.3, 538 / tc));
  return base * fS * fT * mf;
}

export default function PFPSuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const [currentTab, setCurrentTab] = useState('mat');

  useEffect(() => {
    if (activeSubTool === 'pfp-thk' || activeSubTool === 'pfp_thk' || activeSubTool === 'pfp_thickness' || activeSubTool === 'pfp_hp_a_calc' || activeSubTool === 'pfp_dft_matrix') setCurrentTab('thk');
    else if (activeSubTool === 'pfp-den' || activeSubTool === 'pfp_den' || activeSubTool === 'pfp_density') setCurrentTab('den');
    else if (activeSubTool === 'pfp-mesh' || activeSubTool === 'pfp_mesh' || activeSubTool === 'pfp_mesh_qty' || activeSubTool === 'pfp_reinforce_mesh') setCurrentTab('mesh');
    else if (activeSubTool === 'pfp-cost' || activeSubTool === 'pfp_cost') setCurrentTab('cost');
    else if (activeSubTool === 'pfp-rep' || activeSubTool === 'pfp_rep' || activeSubTool === 'pfp_repair') setCurrentTab('rep');
    else setCurrentTab('mat');
  }, [activeSubTool]);

  const handleTabSwitch = (tabKey, toolId) => {
    setCurrentTab(tabKey);
    if (onSubToolChange) onSubToolChange(toolId);
  };

  // ----------------------------------------------------
  // PFP-1 : Material Consumption
  // ----------------------------------------------------
  const [pfmProj, setPfmProj] = useState('');
  const [pfmStr, setPfmStr] = useState('');
  const [pfmMat, setPfmMat] = useState('Epoxy Intumescent XYZ-100');
  const [pfmArea, setPfmArea] = useState('500');
  const [pfmT, setPfmT] = useState('8');
  const [pfmDen, setPfmDen] = useState('1000');
  const [pfmYld, setPfmYld] = useState('');
  const [pfmWst, setPfmWst] = useState('10');
  const [pfmCost, setPfmCost] = useState('350');
  const [hasPfmCalculated, setHasPfmCalculated] = useState(true);

  const pfmAVal = parseFloat(pfmArea) || 0;
  const pfmTVal = parseFloat(pfmT) || 0;
  const pfmDenVal = parseFloat(pfmDen) || 0;
  const pfmYldVal = parseFloat(pfmYld) || 0;
  const pfmWstVal = parseFloat(pfmWst) || 10;
  const pfmCostVal = parseFloat(pfmCost) || 0;

  const pfmNet = pfmYldVal > 0 ? pfmAVal * pfmTVal * pfmYldVal : pfmAVal * (pfmTVal / 1000) * pfmDenVal;
  const pfmWaste = (pfmNet * pfmWstVal) / 100;
  const pfmProc = pfmNet + pfmWaste;
  const pfmTotCost = pfmCostVal > 0 ? pfmProc * pfmCostVal : null;
  const pfmPerM2c = (pfmTotCost !== null && pfmAVal > 0) ? pfmTotCost / pfmAVal : null;

  // Pie for PFM
  const pfmTotal = pfmNet + pfmWaste || 1;
  const pfmNetPct = (pfmNet / pfmTotal) * 100;
  const pfmWastePct = (pfmWaste / pfmTotal) * 100;

  // ----------------------------------------------------
  // PFP-2 : Thickness (Fire Rating)
  // ----------------------------------------------------
  const [pftFr, setPftFr] = useState('120');
  const [pftHpa, setPftHpa] = useState('180');
  const [pftTc, setPftTc] = useState('538');
  const [pftMt, setPftMt] = useState('0.5'); // Epoxy Intumescent default
  const [pftApp, setPftApp] = useState('34');
  const [hasPftCalculated, setHasPftCalculated] = useState(true);

  const pftFrVal = parseInt(pftFr) || 120;
  const pftHpaVal = parseFloat(pftHpa) || 180;
  const pftTcVal = parseFloat(pftTc) || 538;
  const pftMfVal = parseFloat(pftMt) || 0.5;
  const pftAppVal = parseFloat(pftApp) || 0;

  const pftReq = pftCalcThk(pftFrVal, pftHpaVal, pftTcVal, pftMfVal);
  let pftOk = null;
  if (pftAppVal > 0) pftOk = pftAppVal >= pftReq;

  const pftRatings = [30, 60, 90, 120, 180, 240];
  const pftVals = pftRatings.map(r => pftCalcThk(r, pftHpaVal, pftTcVal, pftMfVal));
  const pftMaxVal = Math.max(...pftVals) * 1.1 || 50;

  // ----------------------------------------------------
  // PFP-3 : Density
  // ----------------------------------------------------
  const [pfdId, setPfdId] = useState('Column C-12 East Face');
  const [pfdW, setPfdW] = useState('285');
  const [pfdV, setPfdV] = useState('300');
  const [pfdSpec, setPfdSpec] = useState('900');
  const [hasPfdCalculated, setHasPfdCalculated] = useState(true);

  const pfdWVal = parseFloat(pfdW) || 0;
  const pfdVVal = parseFloat(pfdV) || 0;
  const pfdSpecVal = parseFloat(pfdSpec) || 900;

  const pfdAct = pfdVVal > 0 ? (pfdWVal / pfdVVal) * 1000 : 0;
  const pfdPct = pfdSpecVal > 0 ? (pfdAct / pfdSpecVal) * 100 : 0;
  const pfdDiff = pfdPct - 100;
  const pfdOk = pfdPct >= 100 ? 'PASS' : (pfdPct >= 90 ? 'REVIEW' : 'FAIL');
  const pfdTone = pfdOk === 'PASS' ? 'ok' : (pfdOk === 'REVIEW' ? 'warn' : 'fail');

  // ----------------------------------------------------
  // PFP-4 : Mesh Quantity
  // ----------------------------------------------------
  const [mshArea, setMshArea] = useState('500');
  const [mshW, setMshW] = useState('1.0');
  const [mshL, setMshL] = useState('50');
  const [mshOv, setMshOv] = useState('10');
  const [mshWst, setMshWst] = useState('10');
  const [mshCost, setMshCost] = useState('2500');
  const [hasMshCalculated, setHasMshCalculated] = useState(true);

  const mshAVal = parseFloat(mshArea) || 0;
  const mshWVal = parseFloat(mshW) || 1.0;
  const mshLVal = parseFloat(mshL) || 50;
  const mshOvVal = parseFloat(mshOv) || 10;
  const mshWstVal = parseFloat(mshWst) || 10;
  const mshCostVal = parseFloat(mshCost) || 0;

  const mshRollA = mshWVal * mshLVal;
  const mshOvA = (mshAVal * mshOvVal) / 100;
  const mshNet = mshAVal + mshOvA;
  const mshProc = mshNet * (1 + mshWstVal / 100);
  const mshRolls = mshRollA > 0 ? Math.ceil(mshProc / mshRollA) : 0;
  const mshUtil = (mshRolls > 0 && mshRollA > 0) ? (mshProc / (mshRolls * mshRollA)) * 100 : 0;
  const mshTotCost = mshCostVal > 0 ? mshRolls * mshCostVal : null;

  // ----------------------------------------------------
  // PFP-5 : Cost
  // ----------------------------------------------------
  const [pfcArea, setPfcArea] = useState('500');
  const [pfcMat, setPfcMat] = useState('1500000');
  const [pfcLab, setPfcLab] = useState('450000');
  const [pfcEqp, setPfcEqp] = useState('250000');
  const [pfcScf, setPfcScf] = useState('180000');
  const [pfcMsh, setPfcMsh] = useState('75000');
  const [pfcPri, setPfcPri] = useState('120000');
  const [pfcTop, setPfcTop] = useState('150000');
  const [pfcIns, setPfcIns] = useState('80000');
  const [pfcOh, setPfcOh] = useState('10');
  const [hasPfcCalculated, setHasPfcCalculated] = useState(true);

  const pfcAVal = parseFloat(pfcArea) || 0;
  const pfcHeads = [
    ['Material', parseFloat(pfcMat) || 0, '#2E7D32'],
    ['Labour', parseFloat(pfcLab) || 0, '#1565C0'],
    ['Equipment', parseFloat(pfcEqp) || 0, '#8E24AA'],
    ['Scaffolding', parseFloat(pfcScf) || 0, '#00838F'],
    ['Mesh', parseFloat(pfcMsh) || 0, '#B26A00'],
    ['Primer', parseFloat(pfcPri) || 0, '#6D4C41'],
    ['Topcoat', parseFloat(pfcTop) || 0, '#455A64'],
    ['Inspection', parseFloat(pfcIns) || 0, '#AD1457']
  ];
  const pfcSub = pfcHeads.reduce((acc, h) => acc + h[1], 0);
  const pfcOhVal = parseFloat(pfcOh) || 0;
  const pfcOhAmt = (pfcSub * pfcOhVal) / 100;
  const pfcTot = pfcSub + pfcOhAmt;
  const pfcPerM2 = pfcAVal > 0 ? pfcTot / pfcAVal : 0;
  const pfcMatShare = pfcTot > 0 ? (pfcHeads[0][1] / pfcTot) * 100 : 0;

  const pfcParts = pfcHeads.map(h => [h[0], h[1], h[2], formatCur(h[1])]);
  if (pfcOhAmt > 0) pfcParts.push(['Overheads', pfcOhAmt, '#C62828', formatCur(pfcOhAmt)]);
  const pfcPtot = pfcParts.reduce((acc, x) => acc + x[1], 0) || 1;
  let pfcAcc = 0;
  const pfcStops = [];
  pfcParts.forEach(x => {
    const p0 = (pfcAcc / pfcPtot) * 100;
    pfcAcc += x[1];
    pfcStops.push(`${x[2]} ${p0}% ${(pfcAcc / pfcPtot) * 100}%`);
  });

  // ----------------------------------------------------
  // PFP-6 : Repair Quantity
  // ----------------------------------------------------
  const [pfrLoc, setPfrLoc] = useState('Pipe Rack Level 2 North');
  const [pfrTot, setPfrTot] = useState('500');
  const [pfrDmg, setPfrDmg] = useState('35');
  const [pfrT, setPfrT] = useState('8');
  const [pfrDen, setPfrDen] = useState('1000');
  const [pfrYld, setPfrYld] = useState('');
  const [pfrWst, setPfrWst] = useState('15');
  const [pfrCost, setPfrCost] = useState('350');
  const [hasPfrCalculated, setHasPfrCalculated] = useState(true);

  const pfrTotVal = parseFloat(pfrTot) || 0;
  const pfrDmgVal = parseFloat(pfrDmg) || 0;
  const pfrTVal = parseFloat(pfrT) || 0;
  const pfrDenVal = parseFloat(pfrDen) || 0;
  const pfrYldVal = parseFloat(pfrYld) || 0;
  const pfrWstVal = parseFloat(pfrWst) || 15;
  const pfrCostVal = parseFloat(pfrCost) || 0;

  const pfrNet = pfrYldVal > 0 ? pfrDmgVal * pfrTVal * pfrYldVal : pfrDmgVal * (pfrTVal / 1000) * pfrDenVal;
  const pfrProc = pfrNet * (1 + pfrWstVal / 100);
  const pfrRepPct = pfrTotVal > 0 ? (pfrDmgVal / pfrTotVal) * 100 : null;
  const pfrRemain = pfrTotVal > 0 ? Math.max(0, pfrTotVal - pfrDmgVal) : null;
  const pfrTotCost = pfrCostVal > 0 ? pfrProc * pfrCostVal : null;
  const pfrSev = pfrRepPct === null ? null : (pfrRepPct < 5 ? ['Minor', 'ok', '✅'] : (pfrRepPct <= 15 ? ['Moderate — plan campaign repair', 'warn', '⚠️'] : ['Major — investigate root cause', 'fail', '❌']));

  return (
    <div className="space-y-4">
      {/* Sub Navigation Bar matching exact pills */}
      <div className="subnav">
        <button
          className={`snb ${currentTab === 'mat' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('mat', 'pfp_material')}
        >
          🧱 PFP-1: Material Consumption
        </button>
        <button
          className={`snb ${currentTab === 'thk' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('thk', 'pfp_thickness')}
        >
          🔥 PFP-2: Fire Rating Thickness
        </button>
        <button
          className={`snb ${currentTab === 'den' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('den', 'pfp_density')}
        >
          ⚗️ PFP-3: Density Verification
        </button>
        <button
          className={`snb ${currentTab === 'mesh' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('mesh', 'pfp_mesh_qty')}
        >
          🕸️ PFP-4: Mesh Quantity
        </button>
        <button
          className={`snb ${currentTab === 'cost' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('cost', 'pfp_cost')}
        >
          🧾 PFP-5: Project Cost
        </button>
        <button
          className={`snb ${currentTab === 'rep' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('rep', 'pfp_repair')}
        >
          🩹 PFP-6: Repair Quantity
        </button>
      </div>

      {/* ── PFP-1 : Material Consumption ── */}
      {currentTab === 'mat' && (
        <div className="sub-sec card active" id="pfp-mat">
          <div className="ch">
            <div className="ci">🧱</div>
            <div>
              <div className="ct">PFP Material Consumption Calculator</div>
              <div className="cs">Area × thickness × density (or yield) + wastage — UL 1709 · ASTM E119 · EN 13381</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('pfp-mat')}>📖 Guideline</button>
            <div className="ctag">PRO · PFP-1</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Project <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={pfmProj}
                      onChange={e => setPfmProj(e.target.value)}
                      placeholder="e.g. LPG Sphere Legs"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Structure <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={pfmStr}
                      onChange={e => setPfmStr(e.target.value)}
                      placeholder="e.g. Support Columns"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>PFP Material <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={pfmMat}
                      onChange={e => setPfmMat(e.target.value)}
                      placeholder="e.g. Epoxy Intumescent XYZ-100"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfmArea}
                      onChange={e => setPfmArea(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Required Thickness <span className="lh">mm</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfmT}
                      onChange={e => setPfmT(e.target.value)}
                      placeholder="e.g. 8"
                      min="0"
                      step="any"
                    />
                    <span className="uu">mm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Density <span className="lh">kg/m³ · wet applied</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfmDen}
                      onChange={e => setPfmDen(e.target.value)}
                      placeholder="e.g. 1000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg/m³</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Yield <span className="lh">kg/mm/m² · optional — overrides density</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfmYld}
                      onChange={e => setPfmYld(e.target.value)}
                      placeholder="blank = use density"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wastage <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfmWst}
                      onChange={e => setPfmWst(e.target.value)}
                      min="0"
                      max="60"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Cost <span className="lh">₹/kg · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfmCost}
                      onChange={e => setPfmCost(e.target.value)}
                      placeholder="e.g. 350"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => { setHasPfmCalculated(true); addToast('PFP Material Calculated', `${formatNum(pfmProc, 0)} kg required.`, 'success'); }}>
                ▶ Calculate PFP Material
              </button>
              <button className="btn-reset" onClick={() => {
                setPfmProj(''); setPfmStr(''); setPfmMat(''); setPfmArea(''); setPfmT(''); setPfmDen('1000'); setPfmYld(''); setPfmWst('10'); setPfmCost(''); setHasPfmCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasPfmCalculated && pfmAVal > 0 && pfmTVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>PFP Material Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      🧱 PFP Material ≈ {formatNum(pfmProc, 0)} kg ({formatNum(pfmProc / 1000, 2)} MT) for {formatNum(pfmAVal, 0)} m² @ {pfmTVal} mm
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      Net {formatNum(pfmNet, 0)} kg + {pfmWstVal}% wastage
                      {pfmYldVal > 0 ? ` · yield basis ${pfmYldVal} kg/mm/m²` : ` · density basis ${pfmDenVal} kg/m³`}
                      {pfmTotCost !== null ? ` · ${formatCur(pfmTotCost)} (${formatCur(pfmPerM2c)}/m²)` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Total Procurement Quantity</div>
                      <div><span className="tv">{formatNum(pfmProc, 0)}</span><span className="tu">kg</span></div>
                      <div className="tn">{formatNum(pfmProc / 1000, 2)} MT incl. wastage</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Material Required (Net)</div>
                      <div><span className="tv">{formatNum(pfmNet, 0)}</span><span className="tu">kg</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Wastage Quantity</div>
                      <div><span className="tv">{formatNum(pfmWaste, 0)}</span><span className="tu">kg</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Cost / m²</div>
                      <div><span className="tv">{pfmPerM2c === null ? '—' : formatCur(pfmPerM2c)}</span></div>
                      <div className="tn">{pfmTotCost === null ? 'Enter ₹/kg to estimate' : `Total ${formatCur(pfmTotCost)}`}</div>
                    </div>
                  </div>

                  {/* Material vs Wastage Pie */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>Material vs Wastage</div>
                      <div style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        background: `conic-gradient(#2E7D32 0% ${pfmNetPct}%, #C62828 ${pfmNetPct}% 100%)`,
                        boxShadow: 'var(--sh)'
                      }} />
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--txt2)', lineHeight: 2 }}>
                      <div><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#2E7D32', marginRight: '7px' }} />Net Material: <strong>{formatNum(pfmNet, 0)} kg</strong> ({formatNum(pfmNetPct, 1)}%)</div>
                      <div><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#C62828', marginRight: '7px' }} />Wastage: <strong>{formatNum(pfmWaste, 0)} kg</strong> ({formatNum(pfmWastePct, 1)}%)</div>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Detail Table</div>
                    <div className="dr"><span className="dk">Project / Structure</span><span className="dv">{(pfmProj || '—') + ' — ' + (pfmStr || '—')}</span></div>
                    <div className="dr"><span className="dk">PFP Material</span><span className="dv">{pfmMat || '—'}</span></div>
                    <div className="dr"><span className="dk">Surface Area</span><span className="dv">{formatNum(pfmAVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Thickness</span><span className="dv">{pfmTVal} mm</span></div>
                    <div className="dr"><span className="dk">Density / Yield</span><span className="dv">{(pfmDenVal ? `${pfmDenVal} kg/m³` : '—') + ' / ' + (pfmYldVal ? `${pfmYldVal} kg/mm/m²` : '—')}</span></div>
                    <div className="dr"><span className="dk">Net Material</span><span className="dv">{formatNum(pfmNet, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Wastage ({pfmWstVal}%)</span><span className="dv">{formatNum(pfmWaste, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Total Procurement</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(pfmProc, 1)} kg ({formatNum(pfmProc / 1000, 3)} MT)</span></div>
                    <div className="dr"><span className="dk">Consumption Rate</span><span className="dv">{formatNum(pfmProc / pfmAVal, 2)} kg/m²</span></div>
                    <div className="dr"><span className="dk">Material Cost</span><span className="dv">{pfmTotCost === null ? '—' : formatCur(pfmTotCost)}</span></div>
                    <div className="dr"><span className="dk">Cost / m²</span><span className="dv">{pfmPerM2c === null ? '—' : formatCur(pfmPerM2c)}</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>References:</strong> UL 1709 · ASTM E119 · EN 13381 · BS 476 · ISO 834 · API 2218 · Project Specification
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`PFP Procurement: ${formatNum(pfmProc, 0)} kg for ${pfmAVal} m² @ ${pfmTVal} mm.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PFP-2 : Thickness (Fire Rating) ── */}
      {currentTab === 'thk' && (
        <div className="sub-sec card active" id="pfp-thk">
          <div className="ch">
            <div className="ci">🔥</div>
            <div>
              <div className="ct">PFP Thickness Calculator — Fire Rating</div>
              <div className="cs">Required thickness from fire rating · section factor Hp/A · critical steel temperature</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('pfp-thk')}>📖 Guideline</button>
            <div className="ctag">PRO · PFP-2</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Fire Rating</label>
                  <div className="iw">
                    <select
                      value={pftFr}
                      onChange={e => setPftFr(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="90">90 Minutes</option>
                      <option value="120">120 Minutes</option>
                      <option value="180">180 Minutes</option>
                      <option value="240">240 Minutes</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Steel Section Factor <span className="lh">Hp/A (m⁻¹) or W/D basis · ref. 180</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pftHpa}
                      onChange={e => setPftHpa(e.target.value)}
                      min="30"
                      max="400"
                      step="any"
                    />
                    <span className="uu">m⁻¹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Critical Steel Temperature <span className="lh">°C · UL 1709 base 538</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pftTc}
                      onChange={e => setPftTc(e.target.value)}
                      min="300"
                      max="750"
                      step="any"
                    />
                    <span className="uu">°C</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Type</label>
                  <div className="iw">
                    <select
                      value={pftMt}
                      onChange={e => setPftMt(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="1.0">Cementitious (dense)</option>
                      <option value="1.15">Lightweight Cementitious / Vermiculite</option>
                      <option value="0.5">Epoxy Intumescent</option>
                      <option value="0.85">Subliming / Ablative</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Applied / Proposed Thickness <span className="lh">mm · optional — compliance check</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pftApp}
                      onChange={e => setPftApp(e.target.value)}
                      placeholder="e.g. 34"
                      min="0"
                      step="any"
                    />
                    <span className="uu">mm</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFF9EE', border: '1px dashed var(--in-bdr)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--in-lbl)' }}>Note:</strong> Base thickness table (editable database, cementitious @ Hp/A 180, 538 °C) is adjusted for section factor, critical temperature and material type. Final thickness shall always be confirmed against the manufacturer's certified/listed thickness tables (UL / EN 13381 assessment) for the actual section.
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => { setHasPftCalculated(true); addToast('Thickness Calculated', `Required: ${formatNum(pftReq, 1)} mm`, 'success'); }}>
                ▶ Determine Required Thickness
              </button>
              <button className="btn-reset" onClick={() => {
                setPftFr('120'); setPftHpa('180'); setPftTc('538'); setPftMt('0.5'); setPftApp(''); setHasPftCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasPftCalculated && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Required Thickness Result</div>

                  <div style={{
                    background: pftOk === null ? '#E8F5E9' : (pftOk ? '#E8F5E9' : '#FFEBEE'),
                    border: `1.5px solid ${pftOk === null ? 'rgba(46,125,50,.35)' : (pftOk ? 'rgba(46,125,50,.35)' : 'rgba(211,47,47,.35)')}`,
                    borderRadius: 'var(--r)',
                    padding: '13px 16px',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '19px',
                      fontWeight: 700,
                      color: pftOk === null ? '#1B5E20' : (pftOk ? '#1B5E20' : '#B71C1C')
                    }}>
                      {pftOk === null ? '🔥' : (pftOk ? '✅' : '❌')} Required Thickness ≈ {formatNum(pftReq, 1)} mm — {pftFrVal} min {pftOk === null ? '' : (pftOk ? ' · Applied ' + pftAppVal + ' mm COMPLIES' : ' · Applied ' + pftAppVal + ' mm NON-COMPLIANT')}
                    </div>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: pftOk === null ? '#2E7D32' : (pftOk ? '#2E7D32' : '#C62828'),
                      marginTop: '3px'
                    }}>
                      Base {PFP_THK_DB[String(pftFrVal)]} mm × section factor (Hp/A {pftHpaVal}) × temp ({pftTcVal} °C) × material factor {pftMfVal} — verify against certified listing
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Required Thickness</div>
                      <div><span className="tv">{formatNum(pftReq, 1)}</span><span className="tu">mm</span></div>
                      <div className="tn">adjusted from base {PFP_THK_DB[String(pftFrVal)]} mm</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Fire Rating</div>
                      <div><span className="tv">{pftFrVal}</span><span className="tu">min</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Section Factor / Crit. Temp</div>
                      <div><span className="tv" style={{ fontSize: '22px' }}>Hp/A {pftHpaVal} · {pftTcVal} °C</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Compliance Status</div>
                      <div><span className="tv" style={{ fontSize: '22px', color: pftOk === null ? 'var(--txt)' : (pftOk ? '#1B5E20' : '#B71C1C') }}>{pftOk === null ? '—' : (pftOk ? 'PASS' : 'FAIL')}</span></div>
                      <div className="tn">{pftOk === null ? 'Enter applied thickness' : `applied ${pftAppVal} mm vs required ${formatNum(pftReq, 1)} mm`}</div>
                    </div>
                  </div>

                  {/* Rating vs Thickness Chart */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                      Fire Rating vs Required Thickness (your parameters)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '130px', background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: '10px' }}>
                      {pftRatings.map((r, i) => {
                        const isCur = r === pftFrVal;
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '3px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: isCur ? 'var(--brand-crimson)' : 'var(--txt2)' }}>
                              {formatNum(pftVals[i], 0)} mm
                            </div>
                            <div style={{
                              width: '70%',
                              maxWidth: '44px',
                              height: `${(pftVals[i] / pftMaxVal) * 100}%`,
                              background: isCur ? 'linear-gradient(180deg,var(--brand-gold),var(--brand-crimson))' : 'linear-gradient(180deg,#FF8A65,#BF360C)',
                              borderRadius: '5px 5px 0 0',
                              opacity: isCur ? 1 : 0.55
                            }} />
                            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--txt3)' }}>{r} min</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Detail Table</div>
                    <div className="dr"><span className="dk">Fire Rating</span><span className="dv">{pftFrVal} minutes</span></div>
                    <div className="dr"><span className="dk">Section Factor</span><span className="dv">{pftHpaVal} m⁻¹</span></div>
                    <div className="dr"><span className="dk">Critical Steel Temperature</span><span className="dv">{pftTcVal} °C</span></div>
                    <div className="dr"><span className="dk">Base Thickness (DB)</span><span className="dv">{PFP_THK_DB[String(pftFrVal)]} mm</span></div>
                    <div className="dr"><span className="dk">Required Thickness</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(pftReq, 1)} mm</span></div>
                    <div className="dr"><span className="dk">Applied Thickness</span><span className="dv">{pftAppVal > 0 ? `${pftAppVal} mm` : '—'}</span></div>
                    <div className="dr"><span className="dk">Compliance</span><span className="dv" style={{ fontWeight: 800, color: pftOk === null ? 'var(--txt)' : (pftOk ? '#1B5E20' : '#B71C1C') }}>{pftOk === null ? '—' : (pftOk ? 'PASS' : 'FAIL')}</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>References:</strong> UL 1709 · ASTM E119 · BS 476 · EN 13381 · ISO 834 · API 2218
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`Required PFP Thickness: ${formatNum(pftReq, 1)} mm for ${pftFrVal} min.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PFP-3 : Density ── */}
      {currentTab === 'den' && (
        <div className="sub-sec card active" id="pfp-den">
          <div className="ch">
            <div className="ci">⚗️</div>
            <div>
              <div className="ct">PFP Density Calculator</div>
              <div className="cs">Applied density vs manufacturer specification — ASTM E605 / E736</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('pfp-den')}>📖 Guideline</button>
            <div className="ctag">PRO · PFP-3</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Sample ID <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={pfdId}
                      onChange={e => setPfdId(e.target.value)}
                      placeholder="e.g. Column C-12 East Face"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Sample Weight <span className="lh">g</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfdW}
                      onChange={e => setPfdW(e.target.value)}
                      placeholder="e.g. 285"
                      min="0"
                      step="any"
                    />
                    <span className="uu">g</span>
                  </div>
                </div>
                <div className="field">
                  <label>Sample Volume <span className="lh">cm³</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfdV}
                      onChange={e => setPfdV(e.target.value)}
                      placeholder="e.g. 300"
                      min="0"
                      step="any"
                    />
                    <span className="uu">cm³</span>
                  </div>
                </div>
                <div className="field">
                  <label>Specified Density <span className="lh">kg/m³ · manufacturer minimum</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfdSpec}
                      onChange={e => setPfdSpec(e.target.value)}
                      placeholder="e.g. 900"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg/m³</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => { setHasPfdCalculated(true); addToast('Density Verified', `Density: ${formatNum(pfdAct, 0)} kg/m³ (${pfdOk})`, 'success'); }}>
                ▶ Verify Density
              </button>
              <button className="btn-reset" onClick={() => { setPfdId(''); setPfdW(''); setPfdV(''); setPfdSpec('900'); setHasPfdCalculated(false); }}>↺ Reset</button>
            </div>

            {hasPfdCalculated && pfdWVal > 0 && pfdVVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Density Verification Result</div>

                  <div style={{
                    background: pfdTone === 'ok' ? '#E8F5E9' : (pfdTone === 'warn' ? '#FFF8E1' : '#FFEBEE'),
                    border: `1.5px solid ${pfdTone === 'ok' ? 'rgba(46,125,50,.35)' : (pfdTone === 'warn' ? 'rgba(245,127,23,.4)' : 'rgba(211,47,47,.35)')}`,
                    borderRadius: 'var(--r)',
                    padding: '13px 16px',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '19px',
                      fontWeight: 700,
                      color: pfdTone === 'ok' ? '#1B5E20' : (pfdTone === 'warn' ? '#8B4500' : '#B71C1C')
                    }}>
                      {pfdTone === 'ok' ? '✅' : (pfdTone === 'warn' ? '⚠️' : '❌')} Applied Density {formatNum(pfdAct, 0)} kg/m³ — {pfdOk}
                    </div>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: pfdTone === 'ok' ? '#2E7D32' : (pfdTone === 'warn' ? '#B26A00' : '#C62828'),
                      marginTop: '3px'
                    }}>
                      {formatNum(pfdPct, 1)}% of specified {pfdSpecVal} kg/m³ ({pfdDiff >= 0 ? '+' : ''}{formatNum(pfdDiff, 1)}%) — ASTM E605 field density
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Actual Density</div>
                      <div><span className="tv">{formatNum(pfdAct, 0)}</span><span className="tu">kg/m³</span></div>
                      <div className="tn">{formatNum(pfdWVal, 1)} g ÷ {formatNum(pfdVVal, 1)} cm³</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Specified Density</div>
                      <div><span className="tv">{formatNum(pfdSpecVal, 0)}</span><span className="tu">kg/m³</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Difference</div>
                      <div><span className="tv">{pfdDiff >= 0 ? '+' : ''}{formatNum(pfdDiff, 1)}</span><span className="tu">%</span></div>
                      <div className="tn">{pfdOk}</div>
                    </div>
                  </div>

                  {/* Gauge */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ position: 'relative', background: `linear-gradient(90deg,#C62828 0%,#C62828 ${(90 / 130) * 100}%,#E8700A ${(100 / 130) * 100}%,#2E7D32 ${(100 / 130) * 100}%,#2E7D32 100%)`, height: '20px', borderRadius: '20px', border: '1px solid var(--bdr)' }}>
                      <div style={{ position: 'absolute', left: `${Math.min(100, (pfdPct / 130) * 100)}%`, top: '-5px', bottom: '-5px', width: '4px', background: '#111', borderRadius: '2px', transform: 'translateX(-50%)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--txt3)', marginTop: '3px' }}>
                      <span>0</span><span>90% REVIEW</span><span>100% PASS</span><span>130%</span>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Detail Table</div>
                    <div className="dr"><span className="dk">Sample</span><span className="dv">{pfdId || '—'}</span></div>
                    <div className="dr"><span className="dk">Weight</span><span className="dv">{formatNum(pfdWVal, 1)} g</span></div>
                    <div className="dr"><span className="dk">Volume</span><span className="dv">{formatNum(pfdVVal, 1)} cm³</span></div>
                    <div className="dr"><span className="dk">Actual Density</span><span className="dv">{formatNum(pfdAct, 1)} kg/m³</span></div>
                    <div className="dr"><span className="dk">Specified Density</span><span className="dv">{pfdSpecVal} kg/m³</span></div>
                    <div className="dr"><span className="dk">Difference</span><span className="dv">{pfdDiff >= 0 ? '+' : ''}{formatNum(pfdDiff, 1)}%</span></div>
                    <div className="dr"><span className="dk">Result</span><span className="dv" style={{ fontWeight: 800, color: pfdTone === 'ok' ? '#1B5E20' : '#B71C1C' }}>{pfdOk}</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>Acceptance:</strong> ≥ 100% of specified = PASS · 90–100% = REVIEW · &lt; 90% = FAIL &nbsp;|&nbsp; ASTM E605 · ASTM E736 · UL Guidelines
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`PFP Density: ${formatNum(pfdAct, 0)} kg/m³ (${pfdOk}).`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PFP-4 : Mesh Quantity ── */}
      {currentTab === 'mesh' && (
        <div className="sub-sec card active" id="pfp-mesh">
          <div className="ch">
            <div className="ci">🕸️</div>
            <div>
              <div className="ct">Mesh Quantity Calculator</div>
              <div className="cs">Reinforcement mesh for cementitious / epoxy PFP — rolls, overlap &amp; procurement</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('pfp-mesh')}>📖 Guideline</button>
            <div className="ctag">PRO · PFP-4</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Surface Area to Reinforce <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={mshArea}
                      onChange={e => setMshArea(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Mesh Roll Width <span className="lh">m</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={mshW}
                      onChange={e => setMshW(e.target.value)}
                      min="0.1"
                      step="any"
                    />
                    <span className="uu">m</span>
                  </div>
                </div>
                <div className="field">
                  <label>Mesh Roll Length <span className="lh">m</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={mshL}
                      onChange={e => setMshL(e.target.value)}
                      min="1"
                      step="any"
                    />
                    <span className="uu">m</span>
                  </div>
                </div>
                <div className="field">
                  <label>Overlap <span className="lh">% · typical 10</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={mshOv}
                      onChange={e => setMshOv(e.target.value)}
                      min="0"
                      max="50"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wastage <span className="lh">% · cutting &amp; profiles</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={mshWst}
                      onChange={e => setMshWst(e.target.value)}
                      min="0"
                      max="60"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Mesh Cost <span className="lh">₹/roll · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={mshCost}
                      onChange={e => setMshCost(e.target.value)}
                      placeholder="e.g. 2500"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => { setHasMshCalculated(true); addToast('Mesh Calculated', `${mshRolls} rolls required.`, 'success'); }}>
                ▶ Calculate Mesh Quantity
              </button>
              <button className="btn-reset" onClick={() => { setMshArea(''); setMshW('1.0'); setMshL('50'); setMshOv('10'); setMshWst('10'); setMshCost(''); setHasMshCalculated(false); }}>↺ Reset</button>
            </div>

            {hasMshCalculated && mshAVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Mesh Quantity Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      🕸️ {mshRolls} Rolls Required ({formatNum(mshRolls * mshRollA, 0)} m² supplied) for {formatNum(mshAVal, 0)} m²
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      Net + {mshOvVal}% overlap = {formatNum(mshNet, 0)} m² · +{mshWstVal}% wastage = {formatNum(mshProc, 0)} m² · roll {mshWVal} × {mshLVal} m = {formatNum(mshRollA, 0)} m²{mshTotCost !== null ? ` · ${formatCur(mshTotCost)}` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Rolls Required</div>
                      <div><span className="tv">{mshRolls}</span><span className="tu">rolls</span></div>
                      <div className="tn">{mshWVal} m × {mshLVal} m rolls{mshTotCost !== null ? ` · ${formatCur(mshTotCost)}` : ''}</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Mesh Quantity (Procurement)</div>
                      <div><span className="tv">{formatNum(mshProc, 0)}</span><span className="tu">m²</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Overlap Area</div>
                      <div><span className="tv">{formatNum(mshOvA, 1)}</span><span className="tu">m²</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Mesh Utilization</div>
                      <div><span className="tv">{formatNum(mshUtil, 1)}</span><span className="tu">%</span></div>
                      <div className="tn">last roll spare {formatNum(mshRolls * mshRollA - mshProc, 1)} m²</div>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Detail Table</div>
                    <div className="dr"><span className="dk">Surface Area</span><span className="dv">{formatNum(mshAVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Roll Size</span><span className="dv">{mshWVal} × {mshLVal} m = {formatNum(mshRollA, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Overlap ({mshOvVal}%)</span><span className="dv">{formatNum(mshOvA, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Net Requirement</span><span className="dv">{formatNum(mshNet, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Wastage ({mshWstVal}%)</span><span className="dv">{formatNum(mshProc - mshNet, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Procurement Quantity</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(mshProc, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Rolls Required</span><span className="dv">{mshRolls} rolls</span></div>
                    <div className="dr"><span className="dk">Mesh Utilization</span><span className="dv">{formatNum(mshUtil, 1)}%</span></div>
                    <div className="dr"><span className="dk">Cost</span><span className="dv">{mshTotCost === null ? '—' : `${mshRolls} × ${formatCur(mshCostVal)} = ${formatCur(mshTotCost)}`}</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`PFP Mesh: ${mshRolls} rolls (${formatNum(mshProc, 0)} m²).`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PFP-5 : Cost ── */}
      {currentTab === 'cost' && (
        <div className="sub-sec card active" id="pfp-cost">
          <div className="ch">
            <div className="ci">🧾</div>
            <div>
              <div className="ct">PFP Cost Calculator</div>
              <div className="cs">Complete PFP project cost — material to inspection · ₹/m²</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('pfp-cost')}>📖 Guideline</button>
            <div className="ctag">PRO · PFP-5</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcArea}
                      onChange={e => setPfcArea(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Cost <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcMat}
                      onChange={e => setPfcMat(e.target.value)}
                      placeholder="e.g. 1500000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Labour <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcLab}
                      onChange={e => setPfcLab(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Equipment <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcEqp}
                      onChange={e => setPfcEqp(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Scaffolding <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcScf}
                      onChange={e => setPfcScf(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Mesh <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcMsh}
                      onChange={e => setPfcMsh(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Primer <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcPri}
                      onChange={e => setPfcPri(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Topcoat <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcTop}
                      onChange={e => setPfcTop(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Inspection <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcIns}
                      onChange={e => setPfcIns(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Overheads <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfcOh}
                      onChange={e => setPfcOh(e.target.value)}
                      min="0"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => { setHasPfcCalculated(true); addToast('Cost Calculated', `Total: ${formatCur(pfcTot)}`, 'success'); }}>
                ▶ Calculate PFP Cost
              </button>
              <button className="btn-reset" onClick={() => {
                setPfcArea(''); setPfcMat('0'); setPfcLab('0'); setPfcEqp('0'); setPfcScf('0'); setPfcMsh('0'); setPfcPri('0'); setPfcTop('0'); setPfcIns('0'); setPfcOh('0'); setHasPfcCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasPfcCalculated && pfcAVal > 0 && pfcTot > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>PFP Cost Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      🧾 Total PFP Cost {formatCur(pfcTot)} — {formatCur(pfcPerM2)} / m²
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      Sub-total {formatCur(pfcSub)}{pfcOhVal > 0 ? ` + ${pfcOhVal}% overheads ${formatCur(pfcOhAmt)}` : ''} over {formatNum(pfcAVal, 0)} m²
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Total Project Cost</div>
                      <div><span className="tv">{formatCur(pfcTot)}</span></div>
                      <div className="tn">{pfcOhVal > 0 ? `incl. ${pfcOhVal}% overheads` : 'no overheads applied'}</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Cost per m²</div>
                      <div><span className="tv">{formatCur(pfcPerM2)}</span><span className="tu">/m²</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Material Share</div>
                      <div><span className="tv">{formatNum(pfcMatShare, 1)}</span><span className="tu">%</span></div>
                    </div>
                  </div>

                  {/* Distribution Pie */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>Cost Distribution</div>
                      <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${pfcStops.join(',')})`, boxShadow: 'var(--sh)' }} />
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--txt2)', lineHeight: 2 }}>
                      {pfcParts.filter(x => x[1] > 0).map((x, idx) => (
                        <div key={idx}>
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: x[2], marginRight: '7px' }} />
                          {x[0]}: <strong>{x[3]}</strong> ({formatNum((x[1] / pfcPtot) * 100, 1)}%)
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Detail Table — Cost Head · Amount · %</div>
                    {pfcParts.filter(x => x[1] > 0).map((x, idx) => (
                      <div className="dr" key={idx}><span className="dk">{x[0]}</span><span className="dv">{x[3]} ({formatNum((x[1] / pfcPtot) * 100, 1)}%)</span></div>
                    ))}
                    <div className="dr"><span className="dk">TOTAL PROJECT COST</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatCur(pfcTot)} (100%)</span></div>
                    <div className="dr"><span className="dk">Cost per m²</span><span className="dv">{formatCur(pfcPerM2)}</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`Total PFP Cost: ${formatCur(pfcTot)} (${formatCur(pfcPerM2)}/m²).`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PFP-6 : Repair Quantity ── */}
      {currentTab === 'rep' && (
        <div className="sub-sec card active" id="pfp-rep">
          <div className="ch">
            <div className="ci">🩹</div>
            <div>
              <div className="ct">PFP Repair Quantity Calculator</div>
              <div className="cs">Repair material from damaged area &amp; repair thickness — maintenance estimation</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('pfp-rep')}>📖 Guideline</button>
            <div className="ctag">PRO · PFP-6</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Repair Location <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={pfrLoc}
                      onChange={e => setPfrLoc(e.target.value)}
                      placeholder="e.g. Pipe Rack Level 2 North"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Total PFP Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrTot}
                      onChange={e => setPfrTot(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Damaged Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrDmg}
                      onChange={e => setPfrDmg(e.target.value)}
                      placeholder="e.g. 35"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Repair Thickness <span className="lh">mm</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrT}
                      onChange={e => setPfrT(e.target.value)}
                      placeholder="e.g. 8"
                      min="0"
                      step="any"
                    />
                    <span className="uu">mm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Density <span className="lh">kg/m³</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrDen}
                      onChange={e => setPfrDen(e.target.value)}
                      placeholder="e.g. 1000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg/m³</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Yield <span className="lh">kg/mm/m² · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrYld}
                      onChange={e => setPfrYld(e.target.value)}
                      placeholder="blank = use density"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wastage <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrWst}
                      onChange={e => setPfrWst(e.target.value)}
                      min="0"
                      max="60"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Cost <span className="lh">₹/kg · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={pfrCost}
                      onChange={e => setPfrCost(e.target.value)}
                      placeholder="e.g. 350"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => { setHasPfrCalculated(true); addToast('Repair Calculated', `${formatNum(pfrProc, 0)} kg required.`, 'success'); }}>
                ▶ Calculate Repair Quantity
              </button>
              <button className="btn-reset" onClick={() => {
                setPfrLoc(''); setPfrTot(''); setPfrDmg(''); setPfrT(''); setPfrDen('1000'); setPfrYld(''); setPfrWst('15'); setPfrCost(''); setHasPfrCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasPfrCalculated && pfrDmgVal > 0 && pfrTVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Repair Quantity Result</div>

                  <div style={{
                    background: pfrSev ? (pfrSev[1] === 'warn' ? '#FFF8E1' : pfrSev[1] === 'fail' ? '#FFEBEE' : '#E8F5E9') : '#E8F5E9',
                    border: `1.5px solid ${pfrSev ? (pfrSev[1] === 'warn' ? 'rgba(245,127,23,.4)' : pfrSev[1] === 'fail' ? 'rgba(211,47,47,.35)' : 'rgba(46,125,50,.35)') : 'rgba(46,125,50,.35)'}`,
                    borderRadius: 'var(--r)',
                    padding: '13px 16px',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '19px',
                      fontWeight: 700,
                      color: pfrSev ? (pfrSev[1] === 'warn' ? '#8B4500' : pfrSev[1] === 'fail' ? '#B71C1C' : '#1B5E20') : '#1B5E20'
                    }}>
                      {pfrSev ? pfrSev[2] : '🩹'} Repair Material ≈ {formatNum(pfrProc, 0)} kg for {formatNum(pfrDmgVal, 1)} m² @ {pfrTVal} mm{pfrRepPct !== null ? ` (${formatNum(pfrRepPct, 1)}% of PFP damaged)` : ''}
                    </div>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: pfrSev ? (pfrSev[1] === 'warn' ? '#B26A00' : pfrSev[1] === 'fail' ? '#C62828' : '#2E7D32') : '#2E7D32',
                      marginTop: '3px'
                    }}>
                      Net {formatNum(pfrNet, 0)} kg + {pfrWstVal}% wastage{pfrTotCost !== null ? ` · ${formatCur(pfrTotCost)}` : ''}{pfrSev ? ` · ${pfrSev[0]}` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Repair Material (Procurement)</div>
                      <div><span className="tv">{formatNum(pfrProc, 0)}</span><span className="tu">kg</span></div>
                      <div className="tn">net {formatNum(pfrNet, 0)} kg + {pfrWstVal}% wastage</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Repair Percentage</div>
                      <div><span className="tv">{pfrRepPct === null ? '—' : formatNum(pfrRepPct, 1)}</span><span className="tu">%</span></div>
                      <div className="tn">{pfrSev ? pfrSev[0] : 'Enter total area'}</div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Material Cost</div>
                      <div><span className="tv" style={{ fontSize: '22px' }}>{pfrTotCost === null ? '—' : formatCur(pfrTotCost)}</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Remaining Intact PFP</div>
                      <div><span className="tv">{pfrRemain === null ? '—' : formatNum(pfrRemain, 1)}</span><span className="tu">m²</span></div>
                      <div className="tn">{pfrRemain === null ? 'Enter total area' : `${formatNum(100 - pfrRepPct, 1)}% intact`}</div>
                    </div>
                  </div>

                  {/* Gauge */}
                  {pfrRepPct !== null && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ position: 'relative', background: 'linear-gradient(90deg,#2E7D32 0%,#2E7D32 5%,#E8700A 15%,#C62828 30%,#C62828 100%)', height: '20px', borderRadius: '20px', border: '1px solid var(--bdr)' }}>
                        <div style={{ position: 'absolute', left: `${Math.min(100, (pfrRepPct / 30) * 100)}%`, top: '-5px', bottom: '-5px', width: '4px', background: '#111', borderRadius: '2px', transform: 'translateX(-50%)' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--txt3)', marginTop: '3px' }}>
                        <span>0% Minor</span><span>5%</span><span>15% Review</span><span>&gt;30% Major</span>
                      </div>
                    </div>
                  )}

                  {pfrSev && (
                    <div style={{ marginTop: '12px', padding: '11px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderLeft: '3px solid var(--brand-orange)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--brand-crimson)' }}>🛠 Recommendation:</strong>{' '}
                      {pfrRepPct < 5
                        ? 'Minor localized damage. Carry out spot repairs per manufacturer repair procedure — feather edges, prime exposed steel, and reinstate to original thickness with compatible material.'
                        : pfrRepPct <= 15
                          ? 'Moderate damage extent. Plan a campaign repair with scaffolding/access optimization; verify substrate condition and adhesion of surrounding PFP before patching (bond/pull-off test).'
                          : 'Major damage — investigate root cause (mechanical impact, water ingress, CUF/corrosion under fireproofing, thermal cycling) before repairing. Consider survey of the full system per API 2218 and engineering assessment for replacement vs repair.'}
                    </div>
                  )}

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Detail Table</div>
                    <div className="dr"><span className="dk">Repair Location</span><span className="dv">{pfrLoc || '—'}</span></div>
                    <div className="dr"><span className="dk">Total PFP Area</span><span className="dv">{pfrTotVal > 0 ? `${formatNum(pfrTotVal, 1)} m²` : '—'}</span></div>
                    <div className="dr"><span className="dk">Damaged Area</span><span className="dv">{formatNum(pfrDmgVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Repair Thickness</span><span className="dv">{pfrTVal} mm</span></div>
                    <div className="dr"><span className="dk">Density / Yield</span><span className="dv">{(pfrDenVal ? `${pfrDenVal} kg/m³` : '—') + ' / ' + (pfrYldVal ? `${pfrYldVal} kg/mm/m²` : '—')}</span></div>
                    <div className="dr"><span className="dk">Net Repair Material</span><span className="dv">{formatNum(pfrNet, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Wastage ({pfrWstVal}%)</span><span className="dv">{formatNum(pfrProc - pfrNet, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Procurement</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatNum(pfrProc, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Repair Percentage</span><span className="dv">{pfrRepPct === null ? '—' : `${formatNum(pfrRepPct, 1)}%`}</span></div>
                    <div className="dr"><span className="dk">Remaining Intact PFP</span><span className="dv">{pfrRemain === null ? '—' : `${formatNum(pfrRemain, 1)} m²`}</span></div>
                    <div className="dr"><span className="dk">Material Cost</span><span className="dv">{pfrTotCost === null ? '—' : formatCur(pfrTotCost)}</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`PFP Repair Material: ${formatNum(pfrProc, 0)} kg for ${pfrDmgVal} m² @ ${pfrTVal} mm.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
