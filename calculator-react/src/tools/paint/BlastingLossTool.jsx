import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcBlastingLoss, formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function BlastingLossTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [area, setArea] = useState('');
  const [rz, setRz] = useState('');
  const [vs, setVs] = useState('');
  const [res, setRes] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const handleRestore = (e) => {
      if (e?.detail?.tool_id === 'sp-bl' && e.detail.inputs) {
        const inp = e.detail.inputs;
        const a = inp.area ? String(inp.area).replace(/[^\d.]/g, '') : '';
        const r = inp.roughnessRz ? String(inp.roughnessRz).replace(/[^\d.]/g, '') : '';
        const v = inp.vsPercent ? String(inp.vsPercent).replace(/[^\d.]/g, '') : '';
        if (a) setArea(a);
        if (r) setRz(r);
        if (v) setVs(v);
        if (inp.paintName && inp.paintName !== 'Unspecified') setPaintName(inp.paintName);
        if (a && r && v) {
          const computed = calcBlastingLoss(a, r, v);
          setRes(computed);
          setHasCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleCalculate = () => {
    if (!area || !rz || !vs) {
      addToast('Missing Required Inputs', 'Please enter Surface Area, Roughness Rz, and Volume Solids.', 'warning');
      return;
    }
    const computed = calcBlastingLoss(area, rz, vs);
    setRes(computed);
    setHasCalculated(true);
    addToast('Calculated Blast Loss', 'Dead volume loss computed successfully.', 'success');

    autoLogCalculation({
      tool_id: 'sp-bl',
      tool_name: 'Blasting Dead Volume Loss',
      category: 'paint',
      inputs: {
        paintName: paintName || 'Unspecified',
        area: `${area} m²`,
        roughnessRz: `${rz} µm`,
        vsPercent: `${vs}%`,
      },
      results: {
        deadVolumeLiters: `${formatNum(computed.deadVolumeLiters, 1)} L`,
        dvc: `${formatNum(computed.dvc || 0.5, 2)}`,
        per100m2: `${formatNum((computed.deadVolumeLiters / (parseFloat(area) || 1)) * 100, 1)} L`,
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = () => {
    setPaintName('');
    setArea('');
    setRz('');
    setVs('');
    setRes(null);
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
    const text = `BG CoatingOS™ — Paint Loss Due to Blasting Roughness (P-5)
Paint Name: ${paintName || 'N/A'}
Surface Area: ${area} m² | Roughness Rz: ${rz} µm | Volume Solids: ${vs}%
--------------------------------------------------
Dead Volume Paint Loss: ${formatNum(res.deadVolumeLiters, 1)} Litres
Dead Volume Coefficient: ${formatNum(res.dvc || 0.5, 2)}
Loss Per 100 m²: ${formatNum((res.deadVolumeLiters / (parseFloat(area) || 1)) * 100, 1)} L`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sp-bl">
      {/* Card Header (Screenshot 5) */}
      <div className="ch">
        <div className="ci">💥</div>
        <div>
          <div className="ct">Dead Volume Blasting Loss</div>
          <div className="cs">Paint needed to fill surface profile before forming film</div>
        </div>
        <div className="ctag">P-5</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g3">
            <div className="field">
              <label>Surface Area <span className="lh">m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="bl-a" 
                  value={area} 
                  onChange={e => { setArea(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 500" 
                  min="0.1" 
                />
                <span className="uu">m²</span>
              </div>
            </div>

            <div className="field">
              <label>Surface Roughness (Rz) <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="bl-rz" 
                  value={rz} 
                  onChange={e => { setRz(e.target.value); setHasCalculated(false); }} 
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
                  id="bl-vs" 
                  value={vs} 
                  onChange={e => { setVs(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 60" 
                  min="1" 
                  max="100" 
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Paint Name <span className="lh">optional</span></label>
            <div className="iw">
              <input 
                type="text" 
                id="bl-nm" 
                value={paintName} 
                onChange={e => { setPaintName(e.target.value); }} 
                placeholder="e.g. Zinc Silicate Primer" 
              />
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Dead Volume Loss
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {hasCalculated && res && (
          <div className="res" id="r-bl" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Blast Loss Result</span>
              </div>

              <div className="tls t1">
                <div className="tile tp">
                  <div className="tl">Paint Loss (Dead Volume)</div>
                  <div>
                    <span className="tv" id="bl-r">{formatNum(res.deadVolumeLiters, 1)}</span>
                    <span className="tu">Litres</span>
                  </div>
                </div>
              </div>

              <div className="tls">
                <div className="tile ts">
                  <div className="tl">DVC Coefficient</div>
                  <div>
                    <span className="tv" id="bl-dvc">{formatNum(res.dvc || 0.5, 2)}</span>
                  </div>
                </div>
                <div className="tile ti">
                  <div className="tl">Per 100 m²</div>
                  <div>
                    <span className="tv" id="bl-p100">
                      {area ? formatNum((res.deadVolumeLiters / parseFloat(area)) * 100, 1) : '—'}
                    </span>
                    <span className="tu">L</span>
                  </div>
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
                  <span className="dk">Roughness Rz</span>
                  <span className="dv">{rz ? `${rz} µm` : '—'}</span>
                </div>
                <div className="dr">
                  <span className="dk">Volume Solids</span>
                  <span className="dv">{vs ? `${vs}%` : '—'}</span>
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
