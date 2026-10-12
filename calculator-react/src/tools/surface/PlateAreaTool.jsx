import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

export default function PlateAreaTool() {
  const { addToast } = useToast();
  const [itemName, setItemName] = useState('');
  const [lengthM, setLengthM] = useState('');
  const [widthM, setWidthM] = useState('');
  const [thicknessMm, setThicknessMm] = useState('');
  const [qty, setQty] = useState('1');
  const [hasCalculated, setHasCalculated] = useState(false);

  const L = parseFloat(lengthM) || 0;
  const W = parseFloat(widthM) || 0;
  const T = (parseFloat(thicknessMm) || 0) / 1000;
  const Q = parseFloat(qty) || 1;

  const oneSide = L * W * Q;
  const bothSides = 2 * oneSide;
  const edgesArea = 2 * (L + W) * T * Q;
  const totalArea = bothSides + edgesArea;

  const handleCalculate = () => {
    if (!lengthM || !widthM) {
      addToast('Missing Required Inputs', 'Please enter Plate Length and Width.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Plate Area', 'Single, both sides, and edge areas computed successfully.', 'success');
  };

  const handleReset = () => {
    setItemName('');
    setLengthM('');
    setWidthM('');
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
    const text = `BG CoatingOS™ — Plate Surface Area (A-4)
Item: ${itemName || 'Plate'} | Qty: ${Q}
Length: ${L} m | Width: ${W} m | Thickness: ${thicknessMm || 0} mm
--------------------------------------------------
Total Surface Area: ${formatNum(totalArea, 2)} m²
One Side: ${formatNum(oneSide, 2)} m² | Both Sides: ${formatNum(bothSides, 2)} m²
Edge Faces: ${formatNum(edgesArea, 3)} m²`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-plate">
      {/* Card Header (Screenshot 11) */}
      <div className="ch">
        <div className="ci">🔲</div>
        <div>
          <div className="ct">Plate Surface Area Calculator</div>
          <div className="cs">Both sides + 4 thickness faces for plate quantities</div>
        </div>
        <div className="ctag">A-4</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Length <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pl-l" 
                  value={lengthM} 
                  onChange={e => setLengthM(e.target.value)} 
                  placeholder="e.g. 15" 
                  step="0.01" 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Width <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pl-w" 
                  value={widthM} 
                  onChange={e => setWidthM(e.target.value)} 
                  placeholder="e.g. 5" 
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
                  id="pl-t" 
                  value={thicknessMm} 
                  onChange={e => setThicknessMm(e.target.value)} 
                  placeholder="e.g. 215" 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity <span className="lh">nos.</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="pl-q" 
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
                  id="pl-nm" 
                  value={itemName} 
                  onChange={e => setItemName(e.target.value)} 
                  placeholder="e.g. SS Plate" 
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
          <div className="res" id="r-plate" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Plate Area Result</span>
              </div>

              <div className="tls t1">
                <div className="tile tp">
                  <div className="tl">Total Surface Area</div>
                  <div>
                    <span className="tv" id="pl-rtot">{formatNum(totalArea, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                  <div className="tn">Both sides + edge faces included</div>
                </div>
              </div>

              <div className="tls">
                <div className="tile ts">
                  <div className="tl">One Side</div>
                  <div>
                    <span className="tv" id="pl-r1">{formatNum(oneSide, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile ti">
                  <div className="tl">Both Sides</div>
                  <div>
                    <span className="tv">{formatNum(bothSides, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tg">
                  <div className="tl">Thickness Edges</div>
                  <div>
                    <span className="tv">{formatNum(edgesArea, 3)}</span>
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
                  <span className="dk">Length</span>
                  <span className="dv">{lengthM} m</span>
                </div>
                <div className="dr">
                  <span className="dk">Width</span>
                  <span className="dv">{widthM} m</span>
                </div>
                <div className="dr">
                  <span className="dk">Thickness</span>
                  <span className="dv">{thicknessMm ? `${thicknessMm} mm` : '0 mm'}</span>
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
