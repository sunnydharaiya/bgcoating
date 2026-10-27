import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { autoLogCalculation } from '../../services/calculatorService';

const G_BASE = [10, 15, 20, 25]; // Sweep, Commercial, SA 2.5, SA 3.0
const CS_BASE = [15, 20, 30, 35];
const G_SF = [0.70, 0.75, 1.35, 3.00]; // Zero, Mild, Heavy, Very Heavy
const CS_SF = [0.50, 0.75, 1.35, 3.00];

const ABR_MASK = [
  [true, true, true, true],
  [false, true, true, true],
  [false, false, true, true],
  [false, false, true, true]
];

const ABR_ROWS = [
  'Zero Scale / Flash Rust Only',
  'Mild Scale / New Steel / Thin Coating (<25 µm)',
  'Heavy Scale / 1× Heat Treated / Thin Coating (<90 µm)',
  'Very Heavy Scale / Multi Heat Treated / Thick Coating (>90 µm)'
];

const ABR_COLS = ['Sweep', 'Commercial', 'SA 2.5', 'SA 3.0'];

export default function AbrasiveConsumptionTool({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(
    activeSubTool === 'ab-cslag' || activeSubTool === 'copper_slag' || activeSubTool === 'abrasive_copper_slag' 
      ? 'cslag' 
      : 'garnet'
  );

  useEffect(() => {
    if (activeSubTool === 'ab-cslag' || activeSubTool === 'copper_slag' || activeSubTool === 'abrasive_copper_slag') {
      setActiveTab('cslag');
    } else if (activeSubTool === 'ab-garnet' || activeSubTool === 'garnet' || activeSubTool === 'abrasive_garnet') {
      setActiveTab('garnet');
    }
  }, [activeSubTool]);

  // Matrix inputs for Garnet (g00..g33)
  const [gInputs, setGInputs] = useState({});
  const [gRes, setGRes] = useState(null);

  // Matrix inputs for Copper Slag (cs00..cs33)
  const [csInputs, setCsInputs] = useState({});
  const [csRes, setCsRes] = useState(null);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (onSubToolChange) {
      onSubToolChange(tab === 'garnet' ? 'ab-garnet' : 'ab-cslag');
    }
  };

  const handleCellChange = (pfx, r, c, val) => {
    const key = `${pfx}${r}${c}`;
    if (pfx === 'g') {
      setGInputs(prev => ({ ...prev, [key]: val }));
    } else {
      setCsInputs(prev => ({ ...prev, [key]: val }));
    }
  };

  const calculate = (pfx) => {
    const isGarnet = pfx === 'g';
    const base = isGarnet ? G_BASE : CS_BASE;
    const sf = isGarnet ? G_SF : CS_SF;
    const inputs = isGarnet ? gInputs : csInputs;

    let grand = 0;
    let totalArea = 0;
    const rowTots = [0, 0, 0, 0];
    const colTots = [0, 0, 0, 0];
    const inputRows = [];

    ABR_ROWS.forEach((rname, ri) => {
      let rTot = 0;
      ABR_COLS.forEach((cname, ci) => {
        if (!ABR_MASK[ri][ci]) return;
        const key = `${pfx}${ri}${ci}`;
        const a = parseFloat(inputs[key]) || 0;
        if (a > 0) {
          const kg = a * base[ci] * sf[ri];
          rTot += kg;
          colTots[ci] += kg;
          totalArea += a;
          inputRows.push({
            name: `${rname.split('/')[0].trim()} — ${cname}`,
            area: a
          });
        }
      });
      rowTots[ri] = rTot;
      grand += rTot;
    });

    if (grand === 0) {
      addToast('Missing Matrix Inputs', 'Enter at least one area value (m²) in any applicable cell.', 'warning');
      return;
    }

    const rowBreakdowns = [];
    ABR_ROWS.forEach((r, i) => {
      if (rowTots[i] > 0) {
        rowBreakdowns.push({
          label: r.split('/')[0].trim(),
          kg: rowTots[i],
          type: 'ts'
        });
      }
    });

    const colBreakdowns = [];
    ABR_COLS.forEach((c, i) => {
      if (colTots[i] > 0) {
        colBreakdowns.push({
          label: `${c} (Total)`,
          kg: colTots[i],
          type: 'ti'
        });
      }
    });

    const resultData = {
      grand,
      totalArea,
      rowBreakdowns,
      colBreakdowns,
      inputRows
    };

    if (isGarnet) {
      setGRes(resultData);
    } else {
      setCsRes(resultData);
    }
    addToast('Calculated Demand', `Total ${isGarnet ? 'Garnet' : 'Copper Slag'} consumption calculated.`, 'success');

    autoLogCalculation({
      tool_id: isGarnet ? 'ab-garnet' : 'ab-cslag',
      tool_name: isGarnet ? 'Garnet Blasting Consumption' : 'Copper Slag Consumption',
      category: 'abrasive',
      inputs: {
        totalArea: `${totalArea} m²`,
        activeCells: inputRows.map(r => `${r.name}: ${r.area} m²`).join(', ')
      },
      results: {
        totalAbrasiveKg: `${grand.toFixed(1)} kg`,
        totalAbrasiveTons: `${(grand / 1000).toFixed(2)} MT`,
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = (pfx) => {
    if (pfx === 'g') {
      setGInputs({});
      setGRes(null);
    } else {
      setCsInputs({});
      setCsRes(null);
    }
    addToast('Reset Complete', 'Matrix values cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (label, res) => {
    if (!res) return;
    const lines = [
      `BG CoatingOS™ — ${label} Consumption`,
      `Total Required: ${Math.round(res.grand).toLocaleString()} kg (${(res.grand / 1000).toFixed(2)} MT)`,
      `Total Area Blasted: ${res.totalArea.toLocaleString()} m²`,
      '------------------------------------'
    ];
    res.inputRows.forEach(r => {
      lines.push(`${r.name}: ${r.area.toLocaleString()} m²`);
    });
    navigator.clipboard.writeText(lines.join('\n'));
    addToast('Copied to Clipboard', 'Summary copied for sharing.', 'success');
  };

  return (
    <div className="sub-sec card active" id="ab-main">
      <div className="ch">
        <div className="ci">💎</div>
        <div>
          <div className="ct">Abrasive Consumption Calculator</div>
          <div className="cs">@ 7 kg/cm² pressure · Venturi Nozzle · BG Group Rates</div>
        </div>
        <div className="ctag">ABR</div>
      </div>

      <div className="cb">
        {/* INNER TABS: Garnet / Copper Slag */}
        <div className="inner-tabs">
          <button 
            className={`inner-tab ${activeTab === 'garnet' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('garnet')}
          >
            💎 Garnet
          </button>
          <button 
            className={`inner-tab ${activeTab === 'cslag' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('cslag')}
          >
            ⚙️ Copper Slag
          </button>
        </div>

        {/* GARNET PANE */}
        {activeTab === 'garnet' && (
          <div className="inner-pane active" id="pane-ab-garnet">
            <div className="input-section">
              <div style={{ fontSize: '11px', color: 'var(--txt2)', marginBottom: '10px', background: '#FFF3E0', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid var(--o2)', lineHeight: 1.55 }}>
                <strong style={{ color: 'var(--o1)' }}>Garnet Consumption</strong> &nbsp;·&nbsp; <span style={{ color: 'var(--txt3)' }}>7 kg/cm² blast pressure · Venturi nozzle (BG Group standard)</span>
              </div>
              <div style={{ overflowX: 'auto', marginBottom: '6px' }}>
                <table className="abr-tbl" id="g-tbl">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Surface Condition / Scale</th>
                      <th>Sweep</th>
                      <th>Commercial</th>
                      <th>SA 2.5</th>
                      <th>SA 3.0</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ABR_ROWS.map((rname, ri) => (
                      <tr key={ri}>
                        <td className="rl">{rname}</td>
                        {ABR_COLS.map((cname, ci) => {
                          const isApplicable = ABR_MASK[ri][ci];
                          const key = `g${ri}${ci}`;
                          return (
                            <td key={ci}>
                              {isApplicable ? (
                                <input 
                                  type="number" 
                                  id={key} 
                                  placeholder="0" 
                                  min="0" 
                                  step="any"
                                  value={gInputs[key] || ''}
                                  onChange={(e) => handleCellChange('g', ri, ci, e.target.value)}
                                />
                              ) : (
                                <span className="abr-na">N/A</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--txt3)', padding: '4px 4px 0' }}>
                Enter the surface area (m²) in any applicable cell. Cells marked N/A are not applicable for that blast quality / scale combination.
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => calculate('g')}>▶ Calculate Garnet Consumption</button>
              <button className="btn-reset" onClick={() => handleReset('g')}>↺ Reset</button>
            </div>

            {gRes && (
              <div className="res show" id="r-garnet">
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Garnet Result</div>
                  <div className="tls t1">
                    <div className="tile tp">
                      <div className="tl">Total Garnet Required</div>
                      <div>
                        <span className="tv" id="g-tot">{Math.round(gRes.grand).toLocaleString()}</span>
                        <span className="tu">Kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="tls" id="g-break">
                    {gRes.rowBreakdowns.map((b, idx) => (
                      <div className={`tile ${b.type}`} key={`r-${idx}`} style={{ marginBottom: 0 }}>
                        <div className="tl" style={{ fontSize: '9px' }}>{b.label}</div>
                        <div className="tv" style={{ fontSize: '22px' }}>
                          {Math.round(b.kg).toLocaleString()}
                          <span className="tu">kg</span>
                        </div>
                      </div>
                    ))}
                    {gRes.colBreakdowns.map((b, idx) => (
                      <div className={`tile ${b.type}`} key={`c-${idx}`} style={{ marginBottom: 0 }}>
                        <div className="tl" style={{ fontSize: '9px' }}>{b.label}</div>
                        <div className="tv" style={{ fontSize: '22px' }}>
                          {Math.round(b.kg).toLocaleString()}
                          <span className="tu">kg</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="input-summary">
                    <div className="input-summary-label">📝 Input Data (Areas Provided by User in m²)</div>
                    <div id="g-inputs">
                      {gRes.inputRows.map((r, idx) => (
                        <div className="dr" key={idx}>
                          <span className="dk">{r.name}</span>
                          <span className="dv">{r.area.toLocaleString()} m²</span>
                        </div>
                      ))}
                      <div className="dr" style={{ borderTop: '1.5px dashed var(--in-bdr)', marginTop: '6px', paddingTop: '8px' }}>
                        <span className="dk"><strong>Total Surface Area</strong></span>
                        <span className="dv"><strong>{gRes.totalArea.toLocaleString()} m²</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => handleShare('Garnet', gRes)}>📤 Share Text</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COPPER SLAG PANE */}
        {activeTab === 'cslag' && (
          <div className="inner-pane active" id="pane-ab-cslag">
            <div className="input-section">
              <div style={{ fontSize: '11px', color: 'var(--txt2)', marginBottom: '10px', background: '#FFF3E0', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid var(--o2)', lineHeight: 1.55 }}>
                <strong style={{ color: 'var(--o1)' }}>Copper Slag Consumption</strong> &nbsp;·&nbsp; <span style={{ color: 'var(--txt3)' }}>7 kg/cm² blast pressure · Venturi nozzle (BG Group standard)</span>
              </div>
              <div style={{ overflowX: 'auto', marginBottom: '6px' }}>
                <table className="abr-tbl" id="cs-tbl">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Surface Condition / Scale</th>
                      <th>Sweep</th>
                      <th>Commercial</th>
                      <th>SA 2.5</th>
                      <th>SA 3.0</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ABR_ROWS.map((rname, ri) => (
                      <tr key={ri}>
                        <td className="rl">{rname}</td>
                        {ABR_COLS.map((cname, ci) => {
                          const isApplicable = ABR_MASK[ri][ci];
                          const key = `cs${ri}${ci}`;
                          return (
                            <td key={ci}>
                              {isApplicable ? (
                                <input 
                                  type="number" 
                                  id={key} 
                                  placeholder="0" 
                                  min="0" 
                                  step="any"
                                  value={csInputs[key] || ''}
                                  onChange={(e) => handleCellChange('cs', ri, ci, e.target.value)}
                                />
                              ) : (
                                <span className="abr-na">N/A</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--txt3)', padding: '4px 4px 0' }}>
                Enter the surface area (m²) in any applicable cell. Cells marked N/A are not applicable for that blast quality / scale combination.
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => calculate('cs')}>▶ Calculate Copper Slag Consumption</button>
              <button className="btn-reset" onClick={() => handleReset('cs')}>↺ Reset</button>
            </div>

            {csRes && (
              <div className="res show" id="r-cslag">
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Copper Slag Result</div>
                  <div className="tls t1">
                    <div className="tile tp">
                      <div className="tl">Total Copper Slag Required</div>
                      <div>
                        <span className="tv" id="cs-tot">{Math.round(csRes.grand).toLocaleString()}</span>
                        <span className="tu">Kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="tls" id="cs-break">
                    {csRes.rowBreakdowns.map((b, idx) => (
                      <div className={`tile ${b.type}`} key={`r-${idx}`} style={{ marginBottom: 0 }}>
                        <div className="tl" style={{ fontSize: '9px' }}>{b.label}</div>
                        <div className="tv" style={{ fontSize: '22px' }}>
                          {Math.round(b.kg).toLocaleString()}
                          <span className="tu">kg</span>
                        </div>
                      </div>
                    ))}
                    {csRes.colBreakdowns.map((b, idx) => (
                      <div className={`tile ${b.type}`} key={`c-${idx}`} style={{ marginBottom: 0 }}>
                        <div className="tl" style={{ fontSize: '9px' }}>{b.label}</div>
                        <div className="tv" style={{ fontSize: '22px' }}>
                          {Math.round(b.kg).toLocaleString()}
                          <span className="tu">kg</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="input-summary">
                    <div className="input-summary-label">📝 Input Data (Areas Provided by User in m²)</div>
                    <div id="cs-inputs">
                      {csRes.inputRows.map((r, idx) => (
                        <div className="dr" key={idx}>
                          <span className="dk">{r.name}</span>
                          <span className="dv">{r.area.toLocaleString()} m²</span>
                        </div>
                      ))}
                      <div className="dr" style={{ borderTop: '1.5px dashed var(--in-bdr)', marginTop: '6px', paddingTop: '8px' }}>
                        <span className="dk"><strong>Total Surface Area</strong></span>
                        <span className="dv"><strong>{csRes.totalArea.toLocaleString()} m²</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => handleShare('Copper Slag', csRes)}>📤 Share Text</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
