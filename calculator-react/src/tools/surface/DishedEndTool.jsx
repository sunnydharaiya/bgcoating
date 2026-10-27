import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function DishedEndTool() {
  const { addToast } = useToast();
  const [headType, setHeadType] = useState('semi');
  const [diameter, setDiameter] = useState('6');
  const [depth, setDepth] = useState('1');
  const [thickness, setThickness] = useState('350');
  const [qty, setQty] = useState('1');
  const [itemName, setItemName] = useState('Vessel Head');
  const [calculated, setCalculated] = useState(false);
  const [res, setRes] = useState(null);

  const handleCalculate = () => {
    const D = parseFloat(diameter);
    const H = parseFloat(depth) || 0;
    const Tmm = parseFloat(thickness);
    const Q = parseInt(qty, 10) || 1;

    if (!D || !Tmm) {
      addToast('Missing Required Inputs', 'Please enter Inside Diameter and Thickness.', 'warning');
      return;
    }

    const T = Tmm / 1000;
    const OD = D + 2 * T;
    let inA = 0;
    let outA = 0;

    if (headType === 'hemi') {
      inA = (Math.PI / 2) * D * D;
      outA = 2 * Math.PI * (OD / 2) * (OD / 2);
    } else if (headType === 'semi') {
      inA = 1.084 * D * D;
      outA = 1.084 * OD * OD;
    } else {
      const R = D / 2;
      const h = H || D / 4;
      inA = Math.PI * R * R * (1 + (h * h) / (R * R));
      outA = Math.PI * (R + T) * (R + T) * (1 + (h * h) / ((R + T) * (R + T)));
    }

    const tName = { hemi: 'Hemispherical', semi: 'Semi-Ellipsoidal', tori: 'Torispherical' }[headType];

    const resultObj = {
      inA: inA * Q,
      outA: outA * Q,
      typeLabel: tName,
      d: D,
      tmm: Tmm,
      q: Q,
      name: itemName || '—'
    };

    setRes(resultObj);
    setCalculated(true);
    addToast('Calculation Complete', 'Dished end surface area calculated.', 'success');

    // Auto-save to calculation audit log
    autoLogCalculation({
      tool_id: 'sa-de',
      tool_name: 'Dished End Surface Area',
      category: 'surface',
      inputs: {
        head_type: headType,
        inside_diameter_m: D,
        depth_m: H,
        thickness_mm: Tmm,
        quantity: Q,
        item_name: itemName
      },
      results: {
        inside_surface_area_m2: inA * Q,
        outside_surface_area_m2: outA * Q,
        head_type_label: tName
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (log && (log.tool_id === 'sa-de' || log.tool_id === 'dished_end')) {
        if (log.inputs) {
          if (log.inputs.head_type !== undefined) setHeadType(log.inputs.head_type);
          if (log.inputs.inside_diameter_m !== undefined) setDiameter(String(log.inputs.inside_diameter_m));
          if (log.inputs.depth_m !== undefined) setDepth(String(log.inputs.depth_m));
          if (log.inputs.thickness_mm !== undefined) setThickness(String(log.inputs.thickness_mm));
          if (log.inputs.quantity !== undefined) setQty(String(log.inputs.quantity));
          if (log.inputs.item_name !== undefined) setItemName(log.inputs.item_name);
        }
        if (log.results) {
          setRes({
            inA: log.results.inside_surface_area_m2,
            outA: log.results.outside_surface_area_m2,
            typeLabel: log.results.head_type_label,
            d: log.inputs?.inside_diameter_m,
            tmm: log.inputs?.thickness_mm,
            q: log.inputs?.quantity || 1,
            name: log.inputs?.item_name || '—'
          });
          setCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleReset = () => {
    setHeadType('semi');
    setDiameter('');
    setDepth('');
    setThickness('');
    setQty('1');
    setItemName('');
    setCalculated(false);
    setRes(null);
    addToast('Form Reset', 'Parameters have been cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Dished End Surface Area
Item Name: ${res.name}
Head Type: ${res.typeLabel}
Inside Diameter: ${res.d} m
Thickness: ${res.tmm} mm
Quantity: ${res.q}
------------------------------------
Inside Surface Area: ${formatNum(res.inA, 3)} m²
Outside Surface Area: ${formatNum(res.outA, 3)} m²`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Summary copied for sharing.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-de">
      <div className="ch">
        <div className="ci">🫙</div>
        <div>
          <div className="ct">Dished End Surface Area</div>
          <div className="cs">Hemispherical, Semi-Ellipsoidal &amp; Torispherical head area</div>
        </div>
        <div className="ctag">A-5</div>
      </div>

      <div className="cb">
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Head Type</label>
              <div className="iw">
                <select 
                  id="de-type" 
                  value={headType} 
                  onChange={(e) => setHeadType(e.target.value)}
                >
                  <option value="hemi">Hemispherical</option>
                  <option value="semi">Semi-Ellipsoidal</option>
                  <option value="tori">Torispherical</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Inside Diameter <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="de-d" 
                  placeholder="e.g. 6" 
                  step="0.01" 
                  value={diameter} 
                  onChange={(e) => setDiameter(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Depth/Height (Tori) <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="de-h" 
                  placeholder="e.g. 1" 
                  step="0.01" 
                  value={depth} 
                  onChange={(e) => setDepth(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Thickness <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="de-t" 
                  placeholder="e.g. 350" 
                  value={thickness} 
                  onChange={(e) => setThickness(e.target.value)} 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity <span className="lh">nos.</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="de-q" 
                  placeholder="1" 
                  min="1" 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>

            <div className="field">
              <label>Item Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="de-nm" 
                  placeholder="e.g. Vessel Head" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Area</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {calculated && res && (
          <div className="res show" id="r-de">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Dished End Result</div>
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Inside Surface Area</div>
                  <div>
                    <span className="tv" id="de-ria">{formatNum(res.inA, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
                <div className="tile ts">
                  <div className="tl">Outside Surface Area</div>
                  <div>
                    <span className="tv" id="de-roa">{formatNum(res.outA, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
              </div>

              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr"><span className="dk">Item Name</span><span className="dv" id="de-rnm">{res.name}</span></div>
                <div className="dr"><span className="dk">Head Type</span><span className="dv" id="de-rtype">{res.typeLabel}</span></div>
                <div className="dr"><span className="dk">Inside Dia</span><span className="dv" id="de-rd">{res.d} m</span></div>
                <div className="dr"><span className="dk">Thickness</span><span className="dv" id="de-rt">{res.tmm} mm</span></div>
                <div className="dr"><span className="dk">Quantity</span><span className="dv" id="de-rq">{res.q}</span></div>
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-share" onClick={handleShare}>📤 Share Text</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
