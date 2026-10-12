import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { calcCostPerArea, formatNum } from '../../utils/calculations';

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
  const [hasCalculated, setHasCalculated] = useState(false);

  const res = (area && dft && vs && paintPrice)
    ? calcCostPerArea(area, dft, vs, loss, paintPrice, thinner || 0, thinnerPrice || 0)
    : null;

  const handleCalculate = () => {
    if (!area || !dft || !vs || !paintPrice) {
      addToast('Missing Required Inputs', 'Please enter Surface Area, DFT, Volume Solids, and Paint Price.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Cost', 'Material cost and unit rate computed successfully.', 'success');
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
    const text = `BG CoatingOS™ — Paint Cost Per Area (P-7)
Paint Name: ${paintName || 'N/A'}
Surface Area: ${area} m² | DFT: ${dft} µm | VS: ${vs}% | Price: ₹${paintPrice}/L
--------------------------------------------------
Cost Per m²: ₹${formatNum(res.costPerSqM, 2)} / m²
Total Paint Material Cost: ₹${formatNum(res.totalCost, 0)}
Total Paint Volume: ${formatNum(res.totalPaintLiters, 1)} L`;

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
          <div className="cs">Full project costing with thinner</div>
        </div>
        <div className="ctag">P-7</div>
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
                  id="cost-a" 
                  value={area} 
                  onChange={e => setArea(e.target.value)} 
                  placeholder="e.g. 335" 
                />
                <span className="uu">m²</span>
              </div>
            </div>
            <div className="field">
              <label>DFT <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-d" 
                  value={dft} 
                  onChange={e => setDft(e.target.value)} 
                  placeholder="e.g. 285" 
                />
                <span className="uu">µm</span>
              </div>
            </div>
            <div className="field">
              <label>Volume Solids <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-v" 
                  value={vs} 
                  onChange={e => setVs(e.target.value)} 
                  placeholder="e.g. 74" 
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
                  id="cost-th" 
                  value={thinner} 
                  onChange={e => setThinner(e.target.value)} 
                  placeholder="e.g. 23" 
                  min="0" 
                />
                <span className="uu">%</span>
              </div>
            </div>
            <div className="field">
              <label>Loss <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-ls" 
                  value={loss} 
                  onChange={e => setLoss(e.target.value)} 
                  placeholder="e.g. 47" 
                  min="0" 
                />
                <span className="uu">%</span>
              </div>
            </div>
            <div className="field">
              <label>Paint Price <span className="lh">₹/L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-pp" 
                  value={paintPrice} 
                  onChange={e => setPaintPrice(e.target.value)} 
                  placeholder="e.g. 387" 
                />
                <span className="uu">₹</span>
              </div>
            </div>
            <div className="field">
              <label>Thinner Price <span className="lh">₹/L</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="cost-tp" 
                  value={thinnerPrice} 
                  onChange={e => setThinnerPrice(e.target.value)} 
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
                  onChange={e => setPaintName(e.target.value)} 
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
        {(hasCalculated || res) && (
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
                    <span className="tv" id="cost-r">{res ? formatNum(res.costPerSqM, 2) : '—'}</span>
                    <span className="tu">₹/m²</span>
                  </div>
                  <div className="tn">Material Unit Rate</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Total Material Cost</div>
                  <div>
                    <span className="tv" id="cost-rtot">{res ? `₹ ${formatNum(res.totalCost, 0)}` : '—'}</span>
                  </div>
                  <div className="tn">Paint + Thinner Included</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Total Paint Volume</div>
                  <div>
                    <span className="tv">{res ? formatNum(res.totalPaintLiters, 1) : '—'}</span>
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
