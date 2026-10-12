import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

export default function PipeAreaTool() {
  const { addToast } = useToast();
  const [itemName, setItemName] = useState('');
  const [lengthMm, setLengthMm] = useState('');
  const [insideDiaMm, setInsideDiaMm] = useState('');
  const [thicknessMm, setThicknessMm] = useState('');
  const [qty, setQty] = useState('1');
  const [hasCalculated, setHasCalculated] = useState(false);

  // Calculations from dimensions in mm
  const L = parseFloat(lengthMm) || 0;
  const ID = parseFloat(insideDiaMm) || 0;
  const T = parseFloat(thicknessMm) || 0;
  const Q = parseFloat(qty) || 1;
  const OD = ID + 2 * T;

  // Areas in m²: π * D(m) * L(m) * Q
  const insideArea = (Math.PI * (ID / 1000) * (L / 1000)) * Q;
  const outsideArea = (Math.PI * (OD / 1000) * (L / 1000)) * Q;
  const combinedArea = insideArea + outsideArea;
  // Ends area: 2 * π * ((OD/2)^2 - (ID/2)^2) in m² * Q
  const endsArea = (2 * Math.PI * (Math.pow(OD / 2000, 2) - Math.pow(ID / 2000, 2))) * Q;

  const handleCalculate = () => {
    if (!lengthMm || !insideDiaMm || !thicknessMm) {
      addToast('Missing Required Inputs', 'Please enter Pipe Length, Inside Diameter, and Thickness in mm.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Pipe Area', 'Inside, outside, and total areas computed successfully.', 'success');
  };

  const handleReset = () => {
    setItemName('');
    setLengthMm('');
    setInsideDiaMm('');
    setThicknessMm('');
    setQty('1');
    setHasCalculated(false);
    addToast('Form Reset', 'All input parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!hasCalculated) {
      addToast('No Calculation', 'Please calculate first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Pipe Surface Area (A-1)
Item: ${itemName || 'Pipe'} | Qty: ${Q}
Length: ${L} mm | Inside Dia: ${ID} mm | Thickness: ${T} mm | Outside Dia: ${OD} mm
--------------------------------------------------
Inside Area (Total): ${formatNum(insideArea, 2)} m²
Outside Area (Total): ${formatNum(outsideArea, 2)} m²
In + Out Combined: ${formatNum(combinedArea, 2)} m²
Thickness Ends: ${formatNum(endsArea, 3)} m²`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-pipe">
      {/* Card Header (Screenshot 8) */}
      <div className="ch">
        <div className="ci">🔩</div>
        <div>
          <div className="ct">Pipe Surface Area Calculator</div>
          <div className="cs">Inside, outside and thickness face areas</div>
        </div>
        <div className="ctag">A-1</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Pipe Length <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pp-l" 
                  value={lengthMm} 
                  onChange={e => setLengthMm(e.target.value)} 
                  placeholder="e.g. 5000" 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Inside Diameter <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pp-id" 
                  value={insideDiaMm} 
                  onChange={e => setInsideDiaMm(e.target.value)} 
                  placeholder="e.g. 4500" 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Thickness <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pp-t" 
                  value={thicknessMm} 
                  onChange={e => setThicknessMm(e.target.value)} 
                  placeholder="e.g. 75" 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity <span className="lh">nos.</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pp-q" 
                  value={qty} 
                  onChange={e => setQty(e.target.value)} 
                  placeholder="1" 
                  min="1" 
                />
                <span className="uu">nos</span>
              </div>
            </div>

            <div className="field">
              <label>Item Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="pp-nm" 
                  value={itemName} 
                  onChange={e => setItemName(e.target.value)} 
                  placeholder="e.g. Carbon Steel Pipe" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Area
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {hasCalculated && (
          <div className="res" id="r-pipe" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Pipe Area Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Inside Area (Total)</div>
                  <div>
                    <span className="tv" id="pp-ria">{formatNum(insideArea, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile ts">
                  <div className="tl">Outside Area (Total)</div>
                  <div>
                    <span className="tv" id="pp-roa">{formatNum(outsideArea, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile ti">
                  <div className="tl">In + Out Combined</div>
                  <div>
                    <span className="tv" id="pp-rtot">{formatNum(combinedArea, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tg">
                  <div className="tl">Thickness Ends</div>
                  <div>
                    <span className="tv" id="pp-rte">{formatNum(endsArea, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
              </div>

              {/* User Input Data Summary */}
              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr">
                  <span className="dk">Item Name</span>
                  <span className="dv" id="pp-rnm">{itemName || '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Inside Dia</span>
                  <span className="dv" id="pp-rid">{insideDiaMm} mm</span>
                </div>
                <div className="dr">
                  <span className="dk">Outside Dia</span>
                  <span className="dv" id="pp-rod">{OD} mm</span>
                </div>
                <div className="dr">
                  <span className="dk">Pipe Length</span>
                  <span className="dv" id="pp-rl">{lengthMm} mm</span>
                </div>
                <div className="dr">
                  <span className="dk">Thickness</span>
                  <span className="dv" id="pp-rt">{thicknessMm} mm</span>
                </div>
                <div className="dr">
                  <span className="dk">Quantity</span>
                  <span className="dv" id="pp-rq">{qty} nos</span>
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
