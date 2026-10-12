import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcMixingRatio, formatNum } from '../../utils/calculations';

export default function MixingRatioTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [ratioA, setRatioA] = useState('4');
  const [ratioB, setRatioB] = useState('1');
  const [totalVol, setTotalVol] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const res = (ratioA && ratioB && totalVol) ? calcMixingRatio(ratioA, ratioB, totalVol) : null;

  const handleCalculate = () => {
    if (!ratioA || !ratioB || !totalVol) {
      addToast('Missing Required Inputs', 'Please enter Ratio A, Ratio B, and Total Volume.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Mixing Ratio', 'Volumes of Part A and B computed successfully.', 'success');
  };

  const handleReset = () => {
    setPaintName('');
    setRatioA('4');
    setRatioB('1');
    setTotalVol('');
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
    const text = `BG CoatingOS™ — Paint Mixing Ratio (P-6)
Paint Name: ${paintName || 'N/A'}
Ratio: ${ratioA} : ${ratioB} | Total Volume: ${totalVol} Litres
--------------------------------------------------
Volume Part A: ${formatNum(res.volA, 2)} L
Volume Part B: ${formatNum(res.volB, 2)} L`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  const pctA = (res && (parseFloat(ratioA) + parseFloat(ratioB)) > 0)
    ? Math.round((parseFloat(ratioA) / (parseFloat(ratioA) + parseFloat(ratioB))) * 100)
    : 80;

  return (
    <div className="sub-sec card active" id="sp-mx">
      {/* Card Header (Screenshot 6) */}
      <div className="ch">
        <div className="ci">⚗️</div>
        <div>
          <div className="ct">Paint Mixing Ratio</div>
          <div className="cs">Exact Part A &amp; B volumes from any ratio</div>
        </div>
        <div className="ctag">P-6</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Ratio A <span className="lh">parts</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="mx-a" 
                  value={ratioA} 
                  onChange={e => setRatioA(e.target.value)} 
                  placeholder="e.g. 4" 
                  min="0.01" 
                  step="any" 
                />
              </div>
            </div>
            <div className="field">
              <label>Ratio B <span className="lh">parts</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="mx-b" 
                  value={ratioB} 
                  onChange={e => setRatioB(e.target.value)} 
                  placeholder="e.g. 1" 
                  min="0.01" 
                  step="any" 
                />
              </div>
            </div>
            <div className="field">
              <label>Total Volume <span className="lh">L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="mx-tot" 
                  value={totalVol} 
                  onChange={e => setTotalVol(e.target.value)} 
                  placeholder="e.g. 20" 
                />
                <span className="uu">L</span>
              </div>
            </div>
            <div className="field">
              <label>Paint Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="mx-nm" 
                  value={paintName} 
                  onChange={e => setPaintName(e.target.value)} 
                  placeholder="e.g. Polyurethane Topcoat" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Volumes
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {(hasCalculated || res) && (
          <div className="res" id="r-mx" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Mixing Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Volume Part A</div>
                  <div>
                    <span className="tv" id="mx-ra">{res ? formatNum(res.volA, 2) : '—'}</span>
                    <span className="tu">L</span>
                  </div>
                </div>
                <div className="tile ts">
                  <div className="tl">Volume Part B</div>
                  <div>
                    <span className="tv" id="mx-rb">{res ? formatNum(res.volB, 2) : '—'}</span>
                    <span className="tu">L</span>
                  </div>
                </div>
              </div>

              {/* Mixing Ratio Visual Bar */}
              <div className="mbar" style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', margin: '14px 0', border: '1px solid var(--bdr)' }}>
                <div className="mba" id="mba" style={{ width: `${pctA}%`, background: 'var(--brand-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                  Part A ({pctA}%)
                </div>
                <div className="mbb" id="mbb" style={{ width: `${100 - pctA}%`, background: 'var(--brand-crimson)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                  Part B ({100 - pctA}%)
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
                  <span className="dk">Ratio A : B</span>
                  <span className="dv">{ratioA} : {ratioB}</span>
                </div>
                <div className="dr">
                  <span className="dk">Total Volume</span>
                  <span className="dv">{totalVol ? `${totalVol} L` : '—'}</span>
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
