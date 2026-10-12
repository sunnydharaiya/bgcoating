import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcPaintConsumption, formatNum } from '../../utils/calculations';

export default function PaintConsumptionTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [area, setArea] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [loss, setLoss] = useState('20');
  const [hasCalculated, setHasCalculated] = useState(false);

  const res = (area && dft && vs) ? calcPaintConsumption(area, dft, vs, loss, 1) : null;

  const handleCalculate = () => {
    if (!area || !dft || !vs) {
      addToast('Missing Required Inputs', 'Please enter Surface Area, Specified DFT, and Volume Solids.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Consumption', 'Paint volume required computed successfully.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setArea('');
    setDft('');
    setVs('');
    setLoss('20');
    setHasCalculated(false);
    addToast('Form Reset', 'All input parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) {
      addToast('No Calculation', 'Please calculate first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Consumption (P-4)
Paint Name: ${paintName || 'N/A'}
Surface Area: ${area} m² | DFT: ${dft} µm | Volume Solids: ${vs}% | Loss: ${loss}%
--------------------------------------------------
Practical Paint Required: ${formatNum(res.totalPractLiters, 1)} Litres
Theoretical Paint Required: ${formatNum(res.totalTheoLiters, 1)} Litres`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sp-cons">
      {/* Card Header (Screenshot 4) */}
      <div className="ch">
        <div className="ci">🧪</div>
        <div>
          <div className="ct">Paint Consumption</div>
          <div className="cs">Total litres for surface area at given DFT</div>
        </div>
        <div className="ctag">P-4</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Surface Area <span className="lh">m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cons-a" 
                  value={area} 
                  onChange={e => setArea(e.target.value)} 
                  placeholder="e.g. 1000" 
                />
                <span className="uu">m²</span>
              </div>
            </div>
            <div className="field">
              <label>DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cons-d" 
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
                  id="cons-v" 
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
                id="cons-sld" 
                min="0" 
                max="60" 
                step="1" 
                value={loss} 
                onChange={e => setLoss(e.target.value)} 
                style={{ '--pct': `${(loss / 60) * 100}%` }}
              />
              <span className="sv" id="cons-sv">{loss}%</span>
            </div>
          </div>

          <div className="field">
            <label>Paint Name <span className="lh">optional</span></label>
            <div className="iw">
              <input 
                type="text" 
                id="cons-nm" 
                value={paintName} 
                onChange={e => setPaintName(e.target.value)} 
                placeholder="e.g. High Build Epoxy" 
              />
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Consumption
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {(hasCalculated || res) && (
          <div className="res" id="r-cons" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Consumption Result</span>
              </div>

              <div className="tls t1">
                <div className="tile tp">
                  <div className="tl">Paint Required (Practical)</div>
                  <div>
                    <span className="tv" id="cons-r">{res ? formatNum(res.totalPractLiters, 1) : '—'}</span>
                    <span className="tu">Litres</span>
                  </div>
                  <div className="tn">With {loss}% Loss Applied</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Theoretical Paint Required</div>
                  <div>
                    <span className="tv" id="cons-rt">{res ? formatNum(res.totalTheoLiters, 1) : '—'}</span>
                    <span className="tu">Litres</span>
                  </div>
                  <div className="tn">At 100% Transfer Efficiency</div>
                </div>
              </div>

              {/* User Input Data Summary */}
              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr">
                  <span className="dk">Paint Name</span>
                  <span className="dv">{paintName || '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Surface Area</span>
                  <span className="dv">{area ? `${area} m²` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">DFT</span>
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
