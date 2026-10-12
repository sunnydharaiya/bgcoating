import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcDFT, formatNum } from '../../utils/calculations';

export default function DFTTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [wft, setWft] = useState('');
  const [vs, setVs] = useState('');
  const [thinner, setThinner] = useState('0');
  const [hasCalculated, setHasCalculated] = useState(false);

  const res = (wft && vs) ? calcDFT(wft, vs, thinner || 0) : null;

  const handleCalculate = () => {
    if (!wft || !vs) {
      addToast('Missing Required Inputs', 'Please enter Applied WFT and Volume Solids.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated DFT', 'Dry film thickness computed successfully.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setWft('');
    setVs('');
    setThinner('0');
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
    const text = `BG CoatingOS™ — DFT Calculation (P-2)
Paint Name: ${paintName || 'N/A'}
Applied WFT: ${wft} µm | Volume Solids: ${vs}% | Thinner: ${thinner}%
--------------------------------------------------
Calculated DFT: ${formatNum(res.dft, 1)} µm`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sp-dft">
      {/* Card Header (Screenshot 3) */}
      <div className="ch">
        <div className="ci">📏</div>
        <div>
          <div className="ct">DFT Calculation</div>
          <div className="cs">Dry Film Thickness from WFT &amp; Volume Solids</div>
        </div>
        <div className="ctag">P-2</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Applied WFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dft-wft" 
                  value={wft} 
                  onChange={e => setWft(e.target.value)} 
                  placeholder="e.g. 200" 
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Volume Solids <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dft-vs" 
                  value={vs} 
                  onChange={e => setVs(e.target.value)} 
                  placeholder="e.g. 60" 
                  min="1" 
                  max="100" 
                />
                <span className="uu">%</span>
              </div>
            </div>
            <div className="field">
              <label>Thinner <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dft-th" 
                  value={thinner} 
                  onChange={e => setThinner(e.target.value)} 
                  placeholder="0" 
                  min="0" 
                />
                <span className="uu">%</span>
              </div>
            </div>
            <div className="field">
              <label>Paint Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="dft-nm" 
                  value={paintName} 
                  onChange={e => setPaintName(e.target.value)} 
                  placeholder="e.g. Epoxy Intermediate" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate DFT
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {(hasCalculated || res) && (
          <div className="res" id="r-dft" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>DFT Calculation Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Calculated DFT</div>
                  <div>
                    <span className="tv" id="dft-rdft">{res ? formatNum(res.dft, 1) : '—'}</span>
                    <span className="tu">µm</span>
                  </div>
                  <div className="tn">From {wft} µm Applied WFT</div>
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
                  <span className="dk">Applied WFT</span>
                  <span className="dv">{wft ? `${wft} µm` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Volume Solids</span>
                  <span className="dv">{vs ? `${vs}%` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Thinner Added</span>
                  <span className="dv">{thinner}%</span>
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
