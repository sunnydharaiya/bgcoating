import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function TankAreaTool() {
  const { addToast } = useToast();
  const [itemName, setItemName] = useState('');
  const [heightM, setHeightM] = useState('');
  const [insideDiaM, setInsideDiaM] = useState('');
  const [thicknessMm, setThicknessMm] = useState('');
  const [qty, setQty] = useState('1');
  const [calcResult, setCalcResult] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const handleRestore = (e) => {
      if (e?.detail?.tool_id === 'sa-tank' && e.detail.inputs) {
        const inp = e.detail.inputs;
        const h = inp.heightM ? String(inp.heightM).replace(/[^\d.]/g, '') : '';
        const id = inp.insideDiaM ? String(inp.insideDiaM).replace(/[^\d.]/g, '') : '';
        const th = inp.thicknessMm ? String(inp.thicknessMm).replace(/[^\d.]/g, '') : '';
        const q = inp.qty ? String(inp.qty).replace(/[^\d.]/g, '') : '1';
        if (h) setHeightM(h);
        if (id) setInsideDiaM(id);
        if (th) setThicknessMm(th);
        if (q) setQty(q);
        if (inp.itemName) setItemName(inp.itemName);

        if (h && id && th) {
          const H = parseFloat(h) || 0;
          const ID = parseFloat(id) || 0;
          const T = (parseFloat(th) || 0) / 1000;
          const Q = parseFloat(q) || 1;
          const OD = ID + 2 * T;
          const shellInside = Math.PI * ID * H * Q;
          const shellOutside = Math.PI * OD * H * Q;
          const roofInside = Math.PI * Math.pow(ID / 2, 2) * Q;
          const roofOutside = Math.PI * Math.pow(OD / 2, 2) * Q;
          const bottomInside = roofInside;
          const bottomOutside = roofOutside;
          const totalInside = shellInside + roofInside + bottomInside;
          const totalOutside = shellOutside + roofOutside + bottomOutside;
          const totalArea = totalInside + totalOutside;

          setCalcResult({
            H, ID, OD, T, Q,
            shellInside, shellOutside, roofInside, roofOutside,
            bottomInside, bottomOutside, totalInside, totalOutside, totalArea
          });
          setHasCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleCalculate = () => {
    if (!heightM || !insideDiaM || !thicknessMm) {
      addToast('Missing Required Inputs', 'Please enter Tank Height, Inside Diameter, and Thickness.', 'warning');
      return;
    }

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

    const computed = {
      H, ID, OD, T, Q,
      shellInside, shellOutside, roofInside, roofOutside,
      bottomInside, bottomOutside, totalInside, totalOutside, totalArea
    };
    setCalcResult(computed);
    setHasCalculated(true);
    addToast('Calculated Tank Area', 'Total shell, roof, and bottom areas computed successfully.', 'success');

    // Auto-log to history & database
    autoLogCalculation({
      tool_id: 'sa-tank',
      tool_name: 'Tank Area Calculation',
      category: 'area',
      inputs: {
        itemName: itemName || 'Storage Tank',
        heightM: `${heightM} m`,
        insideDiaM: `${insideDiaM} m`,
        thicknessMm: `${thicknessMm} mm`,
        qty: `${qty} nos`,
      },
      results: {
        shellInside: `${formatNum(shellInside, 2)} m²`,
        shellOutside: `${formatNum(shellOutside, 2)} m²`,
        roofInside: `${formatNum(roofInside, 2)} m²`,
        totalInside: `${formatNum(totalInside, 2)} m²`,
        totalOutside: `${formatNum(totalOutside, 2)} m²`,
        totalArea: `${formatNum(totalArea, 2)} m²`,
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = () => {
    setItemName('');
    setHeightM('');
    setInsideDiaM('');
    setThicknessMm('');
    setQty('1');
    setCalcResult(null);
    setHasCalculated(false);
    addToast('Form Reset', 'All input parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!calcResult) {
      addToast('No Calculation', 'Please calculate first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Tank Surface Area (A-2)
Item: ${itemName || 'Storage Tank'} | Qty: ${calcResult.Q}
Height: ${calcResult.H} m | Inside Dia: ${calcResult.ID} m | Thickness: ${thicknessMm} mm
--------------------------------------------------
Total Inside + Outside Area: ${formatNum(calcResult.totalArea, 2)} m²
Shell Inside: ${formatNum(calcResult.shellInside, 2)} m² | Shell Outside: ${formatNum(calcResult.shellOutside, 2)} m²
Roof Inside: ${formatNum(calcResult.roofInside, 2)} m² | Bottom Inside: ${formatNum(calcResult.bottomInside, 2)} m²`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-tank">
      {/* Card Header (Screenshot 3) */}
      <div className="ch">
        <div className="ci">🛢️</div>
        <div>
          <div className="ct">Storage Tank Area</div>
          <div className="cs">Shell, roof &amp; bottom surface area (inside &amp; outside)</div>
        </div>
        <div className="ctag">A-2</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="field">
            <label>Item Name <span className="lh">optional</span></label>
            <div className="iw">
              <input 
                type="text" 
                value={itemName} 
                onChange={e => { setItemName(e.target.value); }} 
                placeholder="e.g. Condensate Storage Tank TK-101" 
              />
            </div>
          </div>

          <div className="g2">
            <div className="field">
              <label>Tank Height (H) <span className="lh">meters</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  value={heightM} 
                  onChange={e => { setHeightM(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 10.0" 
                  min="0.1" 
                  step="0.1" 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Inside Diameter (ID) <span className="lh">meters</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  value={insideDiaM} 
                  onChange={e => { setInsideDiaM(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 12.0" 
                  min="0.1" 
                  step="0.1" 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Shell Plate Thickness <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  value={thicknessMm} 
                  onChange={e => { setThicknessMm(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 10" 
                  min="1" 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity of Tanks <span className="lh">nos</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  value={qty} 
                  onChange={e => { setQty(e.target.value); setHasCalculated(false); }} 
                  placeholder="1" 
                  min="1" 
                />
                <span className="uu">nos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Tank Area
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {hasCalculated && calcResult && (
          <div className="res" id="r-tank" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Tank Area Results Summary</span>
              </div>

              {/* Total Combined Area Hero Tile */}
              <div className="tls" style={{ marginBottom: '12px' }}>
                <div className="tile tp" style={{ gridColumn: 'span 2' }}>
                  <div className="tl">Total Surface Area (Inside + Outside)</div>
                  <div>
                    <span className="tv" style={{ fontSize: '26px' }}>{formatNum(calcResult.totalArea, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                  <div className="tn">Complete tank inner + outer painting surface</div>
                </div>
              </div>

              {/* Breakdown Tiles */}
              <div className="tls" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                <div className="tile tp">
                  <div className="tl">Shell Inside</div>
                  <div>
                    <span className="tv">{formatNum(calcResult.shellInside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tp">
                  <div className="tl">Shell Outside</div>
                  <div>
                    <span className="tv">{formatNum(calcResult.shellOutside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile ts">
                  <div className="tl">Roof Inside</div>
                  <div>
                    <span className="tv">{formatNum(calcResult.roofInside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile ts">
                  <div className="tl">Roof Outside</div>
                  <div>
                    <span className="tv">{formatNum(calcResult.roofOutside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tp">
                  <div className="tl">Bottom Inside</div>
                  <div>
                    <span className="tv">{formatNum(calcResult.bottomInside, 2)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>

                <div className="tile tp">
                  <div className="tl">Bottom Outside</div>
                  <div>
                    <span className="tv">{formatNum(calcResult.bottomOutside, 2)}</span>
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
