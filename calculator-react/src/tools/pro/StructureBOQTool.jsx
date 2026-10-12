import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { SAW_SECTIONS_DB } from '../../utils/standardsDatabase';
import { formatNum, formatCur } from '../../utils/calculations';

export default function StructureBOQTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // A · Project Info
  const [proj, setProj] = useState('Boiler Structure Unit-2');
  const [cli, setCli] = useState('Thermax');
  const [str, setStr] = useState('Main Pipe Rack');
  const [dwg, setDwg] = useState('STR-101 Rev 2');

  // B · Section Selection
  const [secType, setSecType] = useState('SHS');
  const [secSize, setSecSize] = useState('100 × 100 × 5.0');
  const [pipeOd, setPipeOd] = useState('168.3');
  const [pipeWall, setPipeWall] = useState('6');
  const [flatWid, setFlatWid] = useState('100');
  const [flatThk, setFlatThk] = useState('10');
  const [barDia, setBarDia] = useState('25');
  const [plateWidth, setPlateWidth] = useState('1.5');
  const [customSa, setCustomSa] = useState('0.85');
  const [customWt, setCustomWt] = useState('45');
  const [len, setLen] = useState('12');
  const [qty, setQty] = useState('1');

  // C · Paint System & Rates
  const [sysName, setSysName] = useState('ZnSil 75 + Epoxy 125 + PU 50');
  const [dft, setDft] = useState('250');
  const [cov, setCov] = useState('4.5');
  const [abr, setAbr] = useState('12');
  const [pc, setPc] = useState('650');
  const [br, setBr] = useState('120');
  const [ptr, setPtr] = useState('90');

  // BOQ Items
  const [boqList, setBoqList] = useState([]);
  const [res, setRes] = useState(null);

  const calculateUnit = () => {
    if (SAW_SECTIONS_DB[secType]) {
      const d = SAW_SECTIONS_DB[secType][secSize];
      if (!d) return null;
      return { sa: d[0], wt: d[1], desc: `${secType} ${secSize}` };
    }
    if (secType === 'PIPE') {
      const od = parseFloat(pipeOd);
      const tk = parseFloat(pipeWall);
      if (!tk || tk >= od / 2) return null;
      return { sa: (Math.PI * od) / 1000, wt: (od - tk) * tk * 0.02466, desc: `Pipe Ø${od} × ${tk} mm` };
    }
    if (secType === 'FLAT') {
      const w2 = parseFloat(flatWid);
      const tk = parseFloat(flatThk);
      if (!w2 || !tk) return null;
      return { sa: (2 * (w2 + tk)) / 1000, wt: w2 * tk * 0.00785, desc: `Flat ${w2} × ${tk} mm` };
    }
    if (secType === 'RND') {
      const d2 = parseFloat(barDia);
      if (!d2) return null;
      return { sa: (Math.PI * d2) / 1000, wt: 0.006165 * d2 * d2, desc: `Round Bar Ø${d2} mm` };
    }
    if (secType === 'SQR') {
      const d2 = parseFloat(barDia);
      if (!d2) return null;
      return { sa: (4 * d2) / 1000, wt: 0.00785 * d2 * d2, desc: `Square Bar ${d2} × ${d2} mm` };
    }
    if (secType === 'CUSTOM') {
      const cSa = parseFloat(customSa);
      const cWt = parseFloat(customWt);
      if (!cSa || !cWt) return null;
      return { sa: cSa, wt: cWt, desc: `Custom Geometry (${cSa} m²/m · ${cWt} kg/m)` };
    }
    return null;
  };

  const handleCalculate = () => {
    const lenVal = parseFloat(len);
    const qtyVal = parseInt(qty, 10) || 1;

    let sa = 0, wt = 0, desc = '';
    if (secType === 'PLATE') {
      const pw = parseFloat(plateWidth);
      const tk = parseFloat(flatThk);
      if (!lenVal || !pw || !tk) {
        addToast('Missing Required Inputs', 'Enter plate length, width and thickness.', 'warning');
        return;
      }
      sa = (2 * lenVal * pw + (2 * (lenVal + pw) * tk) / 1000) * qtyVal;
      wt = lenVal * pw * tk * 7.85 * qtyVal;
      desc = `Plate ${lenVal} × ${pw} m × ${tk} mm`;
    } else {
      const u = calculateUnit();
      if (!u) {
        addToast('Invalid Section', 'Please verify section parameters.', 'warning');
        return;
      }
      if (!lenVal) {
        addToast('Missing Required Inputs', 'Enter member length in metres.', 'warning');
        return;
      }
      sa = u.sa * lenVal * qtyVal;
      wt = u.wt * lenVal * qtyVal;
      desc = `${u.desc} × ${lenVal} m`;
    }

    const mt = wt / 1000;
    const wa = sa > 0 ? wt / sa : 0;

    const covVal = parseFloat(cov) || 0;
    const abrVal = parseFloat(abr) || 0;
    const pcVal = parseFloat(pc) || 0;
    const brVal = parseFloat(br) || 0;
    const ptrVal = parseFloat(ptr) || 0;

    const paintL = covVal > 0 ? sa / covVal : null;
    const abrKg = abrVal > 0 ? sa * abrVal : null;
    const paintCost = (paintL !== null && pcVal > 0) ? paintL * pcVal : null;
    const blastCost = brVal > 0 ? sa * brVal : null;
    const paintingCost = ptrVal > 0 ? sa * ptrVal : null;
    const totalCost = (paintCost || 0) + (blastCost || 0) + (paintingCost || 0);

    const recs = [];
    if (wa > 150) recs.push(`Heavy steel structure (${formatNum(wa, 0)} kg/m²). Suitable for workshop blasting and automated handling.`);
    if (wa > 0 && wa < 60) recs.push(`Lightweight fabrication (${formatNum(wa, 0)} kg/m²). High surface area per tonne — estimate paint by m², not MT.`);
    if (sa > 1000) recs.push(`High surface area (${formatNum(sa, 0)} m²). Bulk procurement of paint and abrasives recommended.`);
    if (!recs.length) recs.push(`Standard fabrication profile. Weight-to-area ratio ${formatNum(wa, 1)} kg/m² typical of structural steelwork.`);

    setRes({
      sa,
      wt,
      mt,
      wa,
      paintL,
      abrKg,
      paintCost,
      blastCost,
      paintingCost,
      totalCost,
      desc,
      lenVal,
      qtyVal,
      recs
    });
    addToast('Calculation Complete', 'Member surface area and steel weight calculated.', 'success');
  };

  const handleAddToBOQ = () => {
    if (!res) {
      addToast('Calculate First', 'Please click "Calculate Single Item" first.', 'warning');
      return;
    }
    setBoqList(prev => [...prev, { ...res, id: Date.now() }]);
    addToast('Added to BOQ', `${res.desc} (${res.qtyVal} nos) added to project take-off.`, 'success');
  };

  const handleClearBOQ = () => {
    setBoqList([]);
    addToast('BOQ Cleared', 'All line items removed.', 'info');
  };

  const handleReset = () => {
    setProj('');
    setCli('');
    setStr('');
    setDwg('');
    setSecType('SHS');
    setSecSize('100 × 100 × 5.0');
    setLen('12');
    setQty('1');
    setRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const boqTotalSa = boqList.reduce((acc, it) => acc + it.sa, 0);
  const boqTotalWt = boqList.reduce((acc, it) => acc + it.wt, 0);
  const boqTotalCost = boqList.reduce((acc, it) => acc + it.totalCost, 0);

  return (
    <div className="sub-sec card active" id="pro-saw">
      <div className="ch">
        <div className="ci">🏗️</div>
        <div>
          <div className="ct">Structure Surface Area &amp; Weight Calculator</div>
          <div className="cs">Steel sections database + formulas — area · weight · paint · abrasive · treatment cost · BOQ</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('pro-saw')}>📖 Guideline</button>
        <div className="ctag">PRO · SAW-1</div>
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
                  id="saw-proj" 
                  placeholder="e.g. Boiler Structure Unit-2" 
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
                  id="saw-cli" 
                  placeholder="e.g. Thermax" 
                  value={cli} 
                  onChange={(e) => setCli(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Structure Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="saw-str" 
                  placeholder="e.g. Main Pipe Rack" 
                  value={str} 
                  onChange={(e) => setStr(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Drawing Number <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="saw-dwg" 
                  placeholder="e.g. STR-101 Rev 2" 
                  value={dwg} 
                  onChange={(e) => setDwg(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Section Selection
          </div>
          <div className="g2">
            <div className="field">
              <label>Section Type</label>
              <div className="iw">
                <select 
                  id="saw-type" 
                  value={secType} 
                  onChange={(e) => setSecType(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="SHS">SHS — Square Hollow Section</option>
                  <option value="RHS">RHS — Rectangular Hollow Section</option>
                  <option value="EA">Angle — Equal</option>
                  <option value="UA">Angle — Unequal</option>
                  <option value="PFC">Channel (PFC)</option>
                  <option value="UB">Universal Beam / I-Beam (UB)</option>
                  <option value="UC">Universal Column / H-Beam (UC)</option>
                  <option value="PIPE">Pipe / CHS (formula)</option>
                  <option value="FLAT">Flat Bar (formula)</option>
                  <option value="PLATE">Plate (formula)</option>
                  <option value="RND">Round Bar (formula)</option>
                  <option value="SQR">Square Bar (formula)</option>
                  <option value="CUSTOM">Custom Geometry (enter m²/m &amp; kg/m)</option>
                </select>
              </div>
            </div>

            {SAW_SECTIONS_DB[secType] && (
              <div className="field" id="saw-f-size">
                <label>Section Size <span className="lh">database: m²/m · kg/m</span></label>
                <div className="iw">
                  <select 
                    id="saw-size" 
                    value={secSize} 
                    onChange={(e) => setSecSize(e.target.value)}
                    style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                  >
                    {Object.entries(SAW_SECTIONS_DB[secType]).map(([sz, val]) => (
                      <option key={sz} value={sz}>
                        {sz} — {val[0]} m²/m · {val[1]} kg/m
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {secType === 'PIPE' && (
              <>
                <div className="field">
                  <label>Pipe Outside Diameter <span className="lh">mm</span></label>
                  <div className="iw">
                    <input type="number" value={pipeOd} onChange={(e) => setPipeOd(e.target.value)} /><span className="uu">mm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wall Thickness <span className="lh">mm</span></label>
                  <div className="iw">
                    <input type="number" value={pipeWall} onChange={(e) => setPipeWall(e.target.value)} /><span className="uu">mm</span>
                  </div>
                </div>
              </>
            )}

            {secType === 'PLATE' && (
              <div className="field">
                <label>Plate Width <span className="lh">m</span></label>
                <div className="iw">
                  <input type="number" value={plateWidth} onChange={(e) => setPlateWidth(e.target.value)} /><span className="uu">m</span>
                </div>
              </div>
            )}

            {(secType === 'FLAT' || secType === 'PLATE') && (
              <div className="field">
                <label>Thickness <span className="lh">mm</span></label>
                <div className="iw">
                  <input type="number" value={flatThk} onChange={(e) => setFlatThk(e.target.value)} /><span className="uu">mm</span>
                </div>
              </div>
            )}

            <div className="field">
              <label>Length <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="saw-len" 
                  placeholder="e.g. 12" 
                  value={len} 
                  onChange={(e) => setLen(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity <span className="lh">nos</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="saw-qty" 
                  value={qty} 
                  min="1" 
                  onChange={(e) => setQty(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Paint System &amp; Rates (optional)
          </div>
          <div className="g2">
            <div className="field">
              <label>Paint System</label>
              <div className="iw">
                <input type="text" id="saw-sys" value={sysName} onChange={(e) => setSysName(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Paint Coverage <span className="lh">m²/L</span></label>
              <div className="iw">
                <input type="number" id="saw-cov" value={cov} onChange={(e) => setCov(e.target.value)} /><span className="uu">m²/L</span>
              </div>
            </div>

            <div className="field">
              <label>Abrasive Consumption <span className="lh">kg/m²</span></label>
              <div className="iw">
                <input type="number" id="saw-abr" value={abr} onChange={(e) => setAbr(e.target.value)} /><span className="uu">kg/m²</span>
              </div>
            </div>

            <div className="field">
              <label>Paint Cost <span className="lh">₹/L</span></label>
              <div className="iw">
                <input type="number" id="saw-pc" value={pc} onChange={(e) => setPc(e.target.value)} /><span className="uu">₹/L</span>
              </div>
            </div>

            <div className="field">
              <label>Blasting Rate <span className="lh">₹/m²</span></label>
              <div className="iw">
                <input type="number" id="saw-br" value={br} onChange={(e) => setBr(e.target.value)} /><span className="uu">₹/m²</span>
              </div>
            </div>

            <div className="field">
              <label>Painting Rate <span className="lh">₹/m²</span></label>
              <div className="iw">
                <input type="number" id="saw-ptr" value={ptr} onChange={(e) => setPtr(e.target.value)} /><span className="uu">₹/m²</span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Single Item</button>
          <button className="btn" style={{ background: 'var(--brand-crimson)' }} onClick={handleAddToBOQ}>➕ Add to BOQ</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {res && (
          <div className="res show" id="r-saw">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Structure Take-Off Result</div>

              {/* Primary Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Total Surface Area</div>
                  <div>
                    <span className="tv" id="saw-rsa">{formatNum(res.sa, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                  <div className="tn" id="saw-rsan">{res.desc}</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Total Steel Weight</div>
                  <div>
                    <span className="tv" id="saw-rwt">{formatNum(res.wt, 1)}</span>
                    <span className="tu">kg</span>
                  </div>
                  <div className="tn" id="saw-rwtn">{formatNum(res.mt, 2)} Metric Tonnes</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Weight-to-Area Ratio</div>
                  <div>
                    <span className="tv" id="saw-rwa">{formatNum(res.wa, 1)}</span>
                    <span className="tu">kg/m²</span>
                  </div>
                  <div className="tn" id="saw-rwan">Fabrication norm</div>
                </div>

                <div className="tile tg">
                  <div className="tl">Est. Treatment Cost</div>
                  <div>
                    <span className="tv" id="saw-rcost">{formatCur(res.totalCost)}</span>
                  </div>
                  <div className="tn" id="saw-rcostn">Blast + Paint + Material</div>
                </div>
              </div>

              {/* Secondary Tiles */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Estimated Paint Volume</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{res.paintL ? `${formatNum(res.paintL, 1)} L` : '—'}</div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Estimated Abrasive Requirement</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{res.abrKg ? `${formatNum(res.abrKg, 0)} kg` : '—'}</div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Surface Treatment / Tonne</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{res.mt > 0 ? formatCur(res.totalCost / res.mt) : '—'}</div>
                </div>
              </div>

              {/* BOQ Table */}
              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderRadius: 'var(--r)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--brand-crimson)' }}>
                    📋 Project Bill of Quantities (BOQ Take-Off) — {boqList.length} Items
                  </div>
                  <button className="btn-reset" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={handleClearBOQ}>
                    🗑 Clear BOQ
                  </button>
                </div>

                {boqList.length > 0 ? (
                  <div style={{ overflowX: 'auto', marginTop: '10px' }}>
                    <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid var(--bdr)' }}>
                          <th style={{ padding: '6px' }}>Item</th>
                          <th style={{ padding: '6px' }}>Qty</th>
                          <th style={{ padding: '6px' }}>Area (m²)</th>
                          <th style={{ padding: '6px' }}>Weight (kg)</th>
                          <th style={{ padding: '6px' }}>Cost (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boqList.map((item, idx) => (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--bdr2)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>{item.desc}</td>
                            <td style={{ padding: '6px' }}>{item.qtyVal}</td>
                            <td style={{ padding: '6px' }}>{formatNum(item.sa, 2)}</td>
                            <td style={{ padding: '6px' }}>{formatNum(item.wt, 1)}</td>
                            <td style={{ padding: '6px' }}>{formatCur(item.totalCost)}</td>
                          </tr>
                        ))}
                        <tr style={{ background: '#FFF3E0', fontWeight: 700 }}>
                          <td style={{ padding: '8px 6px' }}>TOTAL PROJECT TAKE-OFF</td>
                          <td style={{ padding: '8px 6px' }}>{boqList.reduce((acc, it) => acc + it.qtyVal, 0)} nos</td>
                          <td style={{ padding: '8px 6px' }}>{formatNum(boqTotalSa, 2)} m²</td>
                          <td style={{ padding: '8px 6px' }}>{formatNum(boqTotalWt, 1)} kg ({(boqTotalWt / 1000).toFixed(2)} MT)</td>
                          <td style={{ padding: '8px 6px', color: 'var(--brand-crimson)' }}>{formatCur(boqTotalCost)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ fontSize: '11.5px', color: 'var(--txt3)', marginTop: '8px' }}>
                    No members in BOQ. Calculate members above and click "➕ Add to BOQ" to compile the structural take-off.
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#F1F8E9', border: '1px solid #C8E6C9', borderRadius: 'var(--r)', fontSize: '12px', color: '#2E7D32', lineHeight: 1.6 }}>
                <strong>🛠 Engineering Recommendation:</strong><br />
                {res.recs.join(' ')}
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-print" onClick={handlePrint}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Generating structural BOQ...', 'info')}>
                📊 Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
