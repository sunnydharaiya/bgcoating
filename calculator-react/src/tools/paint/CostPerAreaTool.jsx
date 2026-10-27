import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcCostPerArea, formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function CostPerAreaTool() {
  const { addToast } = useToast();
  const [paintName, setPaintName] = useState('');
  const [area, setArea] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [thinner, setThinner] = useState('0');
  const [loss, setLoss] = useState('20');
  const [paintPrice, setPaintPrice] = useState('');
  const [thinnerPrice, setThinnerPrice] = useState('');
  const [res, setRes] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const handleRestore = (e) => {
      if (e?.detail?.tool_id === 'sp-cost' && e.detail.inputs) {
        const inp = e.detail.inputs;
        const a = inp.area ? String(inp.area).replace(/[^\d.]/g, '') : '';
        const d = inp.dft ? String(inp.dft).replace(/[^\d.]/g, '') : '';
        const v = inp.vsPercent ? String(inp.vsPercent).replace(/[^\d.]/g, '') : '';
        const th = inp.thinnerPercent ? String(inp.thinnerPercent).replace(/[^\d.]/g, '') : '0';
        const l = inp.lossPercent ? String(inp.lossPercent).replace(/[^\d.]/g, '') : '20';
        const pp = inp.paintPrice ? String(inp.paintPrice).replace(/[^\d.]/g, '') : '';
        const tp = inp.thinnerPrice ? String(inp.thinnerPrice).replace(/[^\d.]/g, '') : '';

        if (a) setArea(a);
        if (d) setDft(d);
        if (v) setVs(v);
        if (th) setThinner(th);
        if (l) setLoss(l);
        if (pp) setPaintPrice(pp);
        if (tp) setThinnerPrice(tp);
        if (inp.paintName && inp.paintName !== 'Unspecified') setPaintName(inp.paintName);

        if (a && d && v && pp) {
          const computed = calcCostPerArea(a, d, v, l, pp, th || 0, tp || 0);
          setRes(computed);
          setHasCalculated(true);
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleCalculate = () => {
    if (!area || !dft || !vs || !paintPrice) {
      addToast('Missing Required Inputs', 'Please enter Surface Area, DFT, Volume Solids, and Paint Price.', 'warning');
      return;
    }
    const computed = calcCostPerArea(area, dft, vs, loss, paintPrice, thinner || 0, thinnerPrice || 0);
    setRes(computed);
    setHasCalculated(true);
    addToast('Calculated Cost', 'Material cost and unit rate computed successfully.', 'success');

    autoLogCalculation({
      tool_id: 'sp-cost',
      tool_name: 'Paint Cost Per Area',
      category: 'paint',
      inputs: {
        paintName: paintName || 'Unspecified',
        area: `${area} m²`,
        dft: `${dft} µm`,
        vsPercent: `${vs}%`,
        paintPrice: `₹${paintPrice}/L`,
        thinnerPercent: `${thinner || 0}%`,
        lossPercent: `${loss}%`,
      },
      results: {
        costPerSqM: `₹${formatNum(computed.costPerSqM, 2)}/m²`,
        totalPaintCost: `₹${formatNum(computed.totalPaintCost, 2)}`,
        totalPaintLiters: `${formatNum(computed.totalPaintLiters, 1)} L`,
      },
      notes: 'Auto-logged on calculation'
    });
  };

  const handleReset = () => {
    setPaintName('');
    setArea('');
    setDft('');
    setVs('');
    setThinner('0');
    setLoss('20');
    setPaintPrice('');
    setThinnerPrice('');
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
    const text = `BG CoatingOS™ — Paint Cost per m² (P-7)
Paint Name: ${paintName || 'N/A'}
Area: ${area} m² | Specified DFT: ${dft} µm | Volume Solids: ${vs}%
Paint Price: ₹${paintPrice}/L | Loss: ${loss}%
--------------------------------------------------
Cost per m²: ₹${formatNum(res.costPerSqM, 2)}
Total Material Cost: ₹${formatNum(res.totalPaintCost, 2)}
Total Paint Required: ${formatNum(res.totalPaintLiters, 1)} Litres`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sp-cost">
      {/* Card Header (Screenshot 7) */}
      <div className="ch">
        <div className="ci">💰</div>
        <div>
          <div className="ct">Paint Cost Per Area</div>
          <div className="cs">Material cost per m² and total project coating budget</div>
        </div>
        <div className="ctag">P-7</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div className="g4">
            <div className="field">
              <label>Surface Area <span className="lh">m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-a" 
                  value={area} 
                  onChange={e => { setArea(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 500" 
                  min="0.1" 
                />
                <span className="uu">m²</span>
              </div>
            </div>

            <div className="field">
              <label>Specified DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-dft" 
                  value={dft} 
                  onChange={e => { setDft(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 100" 
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
                  id="cost-vs" 
                  value={vs} 
                  onChange={e => { setVs(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 60" 
                  min="1" 
                  max="100" 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Loss Factor <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-loss" 
                  value={loss} 
                  onChange={e => { setLoss(e.target.value); setHasCalculated(false); }} 
                  placeholder="20" 
                  min="0" 
                  max="80" 
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          <div className="g4">
            <div className="field">
              <label>Paint Price <span className="lh">₹/L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-pp" 
                  value={paintPrice} 
                  onChange={e => { setPaintPrice(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 450" 
                  min="1" 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Thinner Added <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-th" 
                  value={thinner} 
                  onChange={e => { setThinner(e.target.value); setHasCalculated(false); }} 
                  placeholder="0" 
                  min="0" 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Thinner Price <span className="lh">₹/L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-tp" 
                  value={thinnerPrice} 
                  onChange={e => { setThinnerPrice(e.target.value); setHasCalculated(false); }} 
                  placeholder="e.g. 113" 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Paint Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="cost-nm" 
                  value={paintName} 
                  onChange={e => { setPaintName(e.target.value); }} 
                  placeholder="e.g. Zinc Phosphate Epoxy" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="btn-row">
          <button type="button" className="btn" onClick={handleCalculate}>
            ▶ Calculate Full Cost
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Calculated Results Section */}
        {hasCalculated && res && (
          <div className="res" id="r-cost" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Cost Calculation Result</span>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Cost Per m²</div>
                  <div>
                    <span className="tv" id="cost-r">{formatNum(res.costPerSqM, 2)}</span>
                    <span className="tu">₹/m²</span>
                  </div>
                  <div className="tn">Material Unit Rate</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Total Material Cost</div>
                  <div>
                    <span className="tv" id="cost-rtot">{formatNum(res.totalPaintCost, 2)}</span>
                    <span className="tu">₹</span>
                  </div>
                  <div className="tn">Entire Project Scope</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Total Paint Volume</div>
                  <div>
                    <span className="tv">{formatNum(res.totalPaintLiters, 1)}</span>
                    <span className="tu">Litres</span>
                  </div>
                  <div className="tn">Over {area} m²</div>
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
                  <span className="dk">Paint Price</span>
                  <span className="dv">{paintPrice ? `₹ ${paintPrice}/L` : '—'}</span>
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
