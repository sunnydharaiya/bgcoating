import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

export default function TankAreaTool() {
  const { addToast } = useToast();
  const [itemName, setItemName] = useState('');
  const [heightM, setHeightM] = useState('');
  const [insideDiaM, setInsideDiaM] = useState('');
  const [thicknessMm, setThicknessMm] = useState('');
  const [qty, setQty] = useState('1');
  const [hasCalculated, setHasCalculated] = useState(false);

  const H = parseFloat(heightM) || 0;
  const ID = parseFloat(insideDiaM) || 0;
  const T = (parseFloat(thicknessMm) || 0) / 1000;
  const Q = parseFloat(qty) || 1;
  const OD = ID + 2 * T;

  // Shell Inside Area: π * ID * H * Q
  const shellInside = Math.PI * ID * H * Q;
  // Shell Outside Area: π * OD * H * Q
  const shellOutside = Math.PI * OD * H * Q;
  // Roof / Bottom circle area (flat disc approximation)
  const roofInside = Math.PI * Math.pow(ID / 2, 2) * Q;
  const roofOutside = Math.PI * Math.pow(OD / 2, 2) * Q;
  const bottomInside = roofInside;
  const bottomOutside = roofOutside;

  const totalInside = shellInside + roofInside + bottomInside;
  const totalOutside = shellOutside + roofOutside + bottomOutside;
  const totalArea = totalInside + totalOutside;

  const handleCalculate = () => {
    if (!heightM || !insideDiaM || !thicknessMm) {
      addToast('Missing Required Inputs', 'Please enter Tank Height, Inside Diameter, and Thickness.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Tank Area', 'Total shell, roof, and bottom areas computed successfully.', 'success');
  };

  const handleReset = () => {
    setItemName('');
    setHeightM('');
    setInsideDiaM('');
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
    const text = `BG CoatingOS™ — Tank Surface Area (A-2)
Item: ${itemName || 'Storage Tank'} | Qty: ${Q}
Height: ${H} m | Inside Dia: ${ID} m | Thickness: ${thicknessMm} mm
--------------------------------------------------
Total Inside + Outside Area: ${formatNum(totalArea, 2)} m²
Shell Inside: ${formatNum(shellInside, 2)} m² | Shell Outside: ${formatNum(shellOutside, 2)} m²
Roof Inside: ${formatNum(roofInside, 2)} m² | Roof Outside: ${formatNum(roofOutside, 2)} m²`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-tank">
      {/* Card Header (Screenshot 9) */}
      <div className="ch">
        <div className="ci">🛢️</div>
        <div>
          <div className="ct">Tank Surface Area Calculator</div>
          <div className="cs">Shell, roof, bottom inside &amp; outside areas</div>
        </div>
        <div className="ctag">A-2</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Tank Height <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="tk-h" 
                  value={heightM} 
                  onChange={e => setHeightM(e.target.value)} 
                  placeholder="e.g. 18" 
                  step="0.01" 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Inside Diameter <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="tk-id" 
                  value={insideDiaM} 
                  onChange={e => setInsideDiaM(e.target.value)} 
                  placeholder="e.g. 15" 
                  step="0.01" 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Thickness <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="tk-t" 
                  value={thicknessMm} 
                  onChange={e => setThicknessMm(e.target.value)} 
                  placeholder="e.g. 45" 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity <span className="lh">nos.</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="tk-q" 
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
                  id="tk-nm" 
                  value={itemName} 
                  onChange={e => setItemName(e.target.value)} 
                  placeholder="e.g. Storage Tank" 
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
          <div className="res" id="r-tank" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Tank Area Result</span>
              </div>

              <div className="tls t1">
                <div className="tile tp">
                  <div className="tl">Total Inside + Outside Area</div>
                  <div>
                    <span className="tv" id="tk-rtot">{formatNum(totalArea, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
              </div>

              <div className="tls">
                <div className="tile ts">
                  <div className="tl">Shell Inside</div>
                  <div>
                    <span className="tv" id="tk-rsi">{formatNum(shellInside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile ti">
                  <div className="tl">Shell Outside</div>
                  <div>
                    <span className="tv" id="tk-rso">{formatNum(shellOutside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tg">
                  <div className="tl">Roof Outside</div>
                  <div>
                    <span className="tv">{formatNum(roofOutside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tp">
                  <div className="tl">Bottom Outside</div>
                  <div>
                    <span className="tv">{formatNum(bottomOutside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
              </div>

              {/* User Input Data Summary */}
              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr">
                  <span className="dk">Item Name</span>
                  <span className="dv">{itemName || '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Tank Height</span>
                  <span className="dv">{heightM} m</span>
                </div>
                <div className="dr">
                  <span className="dk">Inside Diameter</span>
                  <span className="dv">{insideDiaM} m</span>
                </div>
                <div className="dr">
                  <span className="dk">Thickness</span>
                  <span className="dv">{thicknessMm} mm</span>
                </div>
                <div className="dr">
                  <span className="dk">Quantity</span>
                  <span className="dv">{qty} nos</span>
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
