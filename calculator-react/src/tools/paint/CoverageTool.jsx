import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcCoverage, formatNum } from '../../utils/calculations';

export default function CoverageTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [loss, setLoss] = useState('20');
  const [area, setArea] = useState('');
  const [coats, setCoats] = useState('1');
  const [hasCalculated, setHasCalculated] = useState(false);

  const res = (vs && dft) ? calcCoverage(vs, dft, loss, area || 0, coats || 1) : null;

  const handleCalculate = () => {
    if (!vs || !dft) {
      addToast('Missing Required Inputs', 'Please enter Specified DFT and Volume Solids.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Coverage', 'Spreading rates computed successfully.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setDft('');
    setVs('');
    setLoss('20');
    setArea('');
    setCoats('1');
    setHasCalculated(false);
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
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
          <div className="ct">Paint Coverage</div>
          <div className="cs">Theoretical &amp; Practical Spread Rate (m²/Litre)</div>
        </div>
        <div className="ctag">P-3</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-dft" 
                  value={dft} 
                  onChange={e => setDft(e.target.value)} 
                  placeholder="e.g. 125" 
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
                  onChange={e => setVs(e.target.value)} 
                  placeholder="e.g. 65" 
                  min="1" 
                  max="100" 
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Application Loss <span className="lh">%</span></label>
            <div className="sr">
              <input 
                type="range" 
                id="cov-sld" 
                min="0" 
                max="60" 
                step="1" 
                value={loss} 
                onChange={e => setLoss(e.target.value)} 
                style={{ '--pct': `${(loss / 60) * 100}%` }}
              />
              <span className="sv" id="cov-sv">{loss}%</span>
            </div>
            <div className="sh2">
              <span>0% brush</span>
              <span>15–25% airless</span>
              <span>30–50% spray</span>
            </div>
          </div>

          <div className="field">
            <label>Paint Name <span className="lh">optional</span></label>
            <div className="iw">
              <input 
                type="text" 
                id="cov-nm" 
                value={paintName} 
                onChange={e => setPaintName(e.target.value)} 
                placeholder="e.g. Interzinc 52" 
              />
            </div>
          </div>

          <div className="divider"></div>
          <div className="sep-l">▸ Optional Quantity Estimator</div>

          <div className="g2" style={{ gap: '10px' }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Area <span className="lh">m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-area" 
                  value={area} 
                  onChange={e => setArea(e.target.value)} 
                  placeholder="e.g. 500" 
                />
                <span className="uu">m²</span>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Coats</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cov-cts" 
                  value={coats} 
                  onChange={e => setCoats(e.target.value)} 
                  placeholder="1" 
                  min="1" 
                />
                <span className="uu">cts</span>
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
        {(hasCalculated || res) && (
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
                    <span className="tv" id="cov-rtc">{res ? formatNum(res.theoCoverage, 2) : '—'}</span>
                    <span className="tu">m²/L</span>
                  </div>
                  <div className="tn">100% Transfer Efficiency</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Practical Spread Rate</div>
                  <div>
                    <span className="tv" id="cov-rps">{res ? formatNum(res.practCoverage, 2) : '—'}</span>
                    <span className="tu">m²/L</span>
                  </div>
                  <div className="tn">With {loss}% Loss Applied</div>
                </div>

                {res && res.totalLiters && (
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
