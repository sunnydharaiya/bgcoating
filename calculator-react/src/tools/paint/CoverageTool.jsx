import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcCoverage, formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function CoverageTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [loss, setLoss] = useState('20');
  const [area, setArea] = useState('');
  const [coats, setCoats] = useState('1');
  const [res, setRes] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const handleRestore = (e) => {
      if (e?.detail?.tool_id === 'sp-cov' && e.detail.inputs) {
        const inp = e.detail.inputs;
        const d = inp.dft ? String(inp.dft).replace(/[^\d.]/g, '') : '';
        const v = inp.vsPercent ? String(inp.vsPercent).replace(/[^\d.]/g, '') : '';
        const l = inp.lossPercent ? String(inp.lossPercent).replace(/[^\d.]/g, '') : '20';
        const a = inp.projectArea ? String(inp.projectArea).replace(/[^\d.]/g, '') : '';
        const c = inp.coats ? String(inp.coats).replace(/[^\d.]/g, '') : '1';

        if (d) setDft(d);
        if (v) setVs(v);
        if (l) setLoss(l);
        if (a) setArea(a);
        if (c) setCoats(c);
        if (inp.paintName && inp.paintName !== 'Unspecified') setPaintName(inp.paintName);

        if (v && d) {
          const computed = calcCoverage(v, d, l, a || 0, c || 1);
          setRes(computed);
          setHasCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleCalculate = () => {
    if (!vs || !dft) {
      addToast('Missing Required Inputs', 'Please enter Specified DFT and Volume Solids.', 'warning');
      return;
    }
    const computed = calcCoverage(vs, dft, loss, area || 0, coats || 1);
    setRes(computed);
    setHasCalculated(true);
    addToast('Calculated Coverage', 'Spreading rates computed successfully.', 'success');

    autoLogCalculation({
      tool_id: 'sp-cov',
      tool_name: 'Paint Coverage Calculation',
      category: 'paint',
      inputs: {
        paintName: paintName || 'Unspecified',
        dft: `${dft} µm`,
        vsPercent: `${vs}%`,
        lossPercent: `${loss}%`,
        projectArea: area ? `${area} m²` : 'N/A',
        coats: `${coats} coat(s)`,
      },
      results: {
        theoCoverage: `${formatNum(computed.theoCoverage, 2)} m²/L`,
        practCoverage: `${formatNum(computed.practCoverage, 2)} m²/L`,
        totalLiters: computed.totalLiters ? `${formatNum(computed.totalLiters, 1)} L` : 'N/A',
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = () => {
    setPaintName('');
    setDft('');
    setVs('');
    setLoss('20');
    setArea('');
    setCoats('1');
    setRes(null);
    setHasCalculated(false);
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) {
      addToast('No Calculation', 'Please calculate first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Coverage (P-3)
Paint Name: ${paintName || 'N/A'}
Specified DFT: ${dft} µm | Volume Solids: ${vs}% | Loss Factor: ${loss}%
${area ? `Project Area: ${area} m² (${coats} coats)\n` : ''}--------------------------------------------------
Theoretical Spread Rate: ${formatNum(res.theoCoverage, 2)} m²/L
Practical Spread Rate: ${formatNum(res.practCoverage, 2)} m²/L
${res.totalLiters ? `Total Paint Required: ${formatNum(res.totalLiters, 1)} Litres` : ''}`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Coverage calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sp-cov">
      {/* Card Header (Screenshot 1) */}
      <div className="ch">
        <div className="ci">📐</div>
        <div>
          <div className="ct">Theoretical &amp; Practical Coverage</div>
          <div className="cs">Spread rate (m²/L) and total volume required</div>
        </div>
        <div className="ctag">P-3</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="field">
            <label>Paint Name <span className="lh">optional</span></label>
            <div className="iw">
              <input 
                type="text" 
                id="cov-nm" 
                value={paintName} 
                onChange={e => { setPaintName(e.target.value); }} 
                placeholder="e.g. Zinc-Rich Epoxy Primer" 
              />
            </div>
          </div>

          <div className="g3">
            <div className="field">
              <label>Specified DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-dft" 
                  value={dft} 
                  onChange={e => { setDft(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 75" 
                  min="1" 
                />
                <span className="uu">µm</span>
              </div>
            </div>

            <div className="field">
              <label>Volume Solids <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-vs" 
                  value={vs} 
                  onChange={e => { setVs(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 60" 
                  min="1" 
                  max="100" 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Loss Factor <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-loss" 
                  value={loss} 
                  onChange={e => { setLoss(e.target.value); setHasCalculated(false); }} 
                  placeholder="20" 
                  min="0" 
                  max="80" 
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          <div className="g2">
            <div className="field">
              <label>Project Area <span className="lh">m² · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-area" 
                  value={area} 
                  onChange={e => { setArea(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 1000" 
                  min="0" 
                />
                <span className="uu">m²</span>
              </div>
            </div>

            <div className="field">
              <label>Number of Coats <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-coats" 
                  value={coats} 
                  onChange={e => { setCoats(e.target.value); setHasCalculated(false); }} 
                  placeholder="1" 
                  min="1" 
                />
                <span className="uu">coats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Coverage
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section (Mint-Green Border & Top Badge) */}
        {hasCalculated && res && (
          <div className="res" id="r-cov" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Paint Coverage Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Theoretical Spread Rate</div>
                  <div>
                    <span className="tv" id="cov-rtc">{formatNum(res.theoCoverage, 2)}</span>
                    <span className="tu">m²/L</span>
                  </div>
                  <div className="tn">100% Transfer Efficiency</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Practical Spread Rate</div>
                  <div>
                    <span className="tv" id="cov-rps">{formatNum(res.practCoverage, 2)}</span>
                    <span className="tu">m²/L</span>
                  </div>
                  <div className="tn">With {loss}% Loss Applied</div>
                </div>

                {res.totalLiters && (
                  <div className="tile ti">
                    <div className="tl">Total Paint Volume</div>
                    <div>
                      <span className="tv">{formatNum(res.totalLiters, 1)}</span>
                      <span className="tu">Litres</span>
                    </div>
                    <div className="tn">{coats} Coat(s) over {area} m²</div>
                  </div>
                )}
              </div>

              {/* User Input Data Summary */}
              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr">
                  <span className="dk">Paint Name</span>
                  <span className="dv">{paintName || '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Specified DFT</span>
                  <span className="dv">{dft ? `${dft} µm` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Volume Solids</span>
                  <span className="dv">{vs ? `${vs}%` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Application Loss</span>
                  <span className="dv">{loss}%</span>
                </div>
                {area && (
                  <div className="dr">
                    <span className="dk">Area &amp; Coats</span>
                    <span className="dv">{area} m² × {coats} coat(s)</span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="action-bar">
                <button type="button" className="btn-print" onClick={handlePrint}>
                  🖨 Print PDF
                </button>
                <button type="button" className="btn-share" onClick={handleShare}>
                  📤 Share Text
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
