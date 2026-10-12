import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

export default function StructureWeightTool() {
  const { addToast } = useToast();
  const [ulT, setUlT] = useState('');
  const [ulR, setUlR] = useState('35');
  const [lT, setLT] = useState('');
  const [lR, setLR] = useState('30');
  const [mT, setMT] = useState('');
  const [mR, setMR] = useState('25');
  const [hT, setHT] = useState('');
  const [hR, setHR] = useState('20');
  const [uhT, setUhT] = useState('');
  const [uhR, setUhR] = useState('15');
  const [hasCalculated, setHasCalculated] = useState(false);

  const aUL = (parseFloat(ulT) || 0) * (parseFloat(ulR) || 35);
  const aL = (parseFloat(lT) || 0) * (parseFloat(lR) || 30);
  const aM = (parseFloat(mT) || 0) * (parseFloat(mR) || 25);
  const aH = (parseFloat(hT) || 0) * (parseFloat(hR) || 20);
  const aUH = (parseFloat(uhT) || 0) * (parseFloat(uhR) || 15);

  const totalTonnage = (parseFloat(ulT) || 0) + (parseFloat(lT) || 0) + (parseFloat(mT) || 0) + (parseFloat(hT) || 0) + (parseFloat(uhT) || 0);
  const totalArea = aUL + aL + aM + aH + aUH;
  const avgRate = totalTonnage > 0 ? totalArea / totalTonnage : 0;

  const handleCalculate = () => {
    if (totalTonnage <= 0) {
      addToast('Missing Required Inputs', 'Please enter tonnage for at least one structural category.', 'warning');
      return;
    }
    setHasCalculated(true);
    addToast('Calculated Area from Weight', 'Structural area take-off computed successfully.', 'success');
  };

  const handleReset = () => {
    setUlT('');
    setUlR('35');
    setLT('');
    setLR('30');
    setMT('');
    setMR('25');
    setHT('');
    setHR('20');
    setUhT('');
    setUhR('15');
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
    const text = `BG CoatingOS™ — Structure Weight-Wise Area (A-3)
Total Tonnage: ${formatNum(totalTonnage, 1)} Tonnes | Avg Rate: ${formatNum(avgRate, 1)} m²/tonne
--------------------------------------------------
Total Structural Area: ${formatNum(totalArea, 1)} m²
Ultra-Light: ${ulT || 0} t (${formatNum(aUL, 1)} m²)
Light: ${lT || 0} t (${formatNum(aL, 1)} m²)
Medium: ${mT || 0} t (${formatNum(aM, 1)} m²)
Heavy: ${hT || 0} t (${formatNum(aH, 1)} m²)
Ultra-Heavy: ${uhT || 0} t (${formatNum(aUH, 1)} m²)`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Calculation summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-wws">
      {/* Card Header (Screenshot 10) */}
      <div className="ch">
        <div className="ci">⚖️</div>
        <div>
          <div className="ct">Structure Weight-Wise Area</div>
          <div className="cs">Surface area estimation from tonnage (editable rates)</div>
        </div>
        <div className="ctag">A-3</div>
      </div>

      <div className="cb">
        {/* User Inputs Section (Orange Border & Top Badge) */}
        <div className="input-section">
          <div style={{ fontSize: '11px', color: 'var(--txt2)', marginBottom: '10px', background: '#FFF3E0', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid var(--o2)' }}>
            Standard Norms (Editable): UltraLight=35 · Light=30 · Medium=25 · Heavy=20 · UltraHeavy=15 m²/tonne
          </div>

          <div className="g3">
            <div className="field">
              <label>UL Tonnage <span className="lh">t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-ul" 
                  value={ulT} 
                  onChange={e => setUlT(e.target.value)} 
                  placeholder="e.g. 25" 
                />
                <span className="uu">t</span>
              </div>
            </div>
            <div className="field">
              <label>UL Rate <span className="lh">m²/t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-ulr" 
                  value={ulR} 
                  onChange={e => setUlR(e.target.value)} 
                />
                <span className="uu">m²/t</span>
              </div>
            </div>
            <div className="field"></div>

            <div className="field">
              <label>Light Tonnage <span className="lh">t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-l" 
                  value={lT} 
                  onChange={e => setLT(e.target.value)} 
                  placeholder="e.g. 50" 
                />
                <span className="uu">t</span>
              </div>
            </div>
            <div className="field">
              <label>Light Rate <span className="lh">m²/t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-lr" 
                  value={lR} 
                  onChange={e => setLR(e.target.value)} 
                />
                <span className="uu">m²/t</span>
              </div>
            </div>
            <div className="field"></div>

            <div className="field">
              <label>Medium Tonnage <span className="lh">t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-m" 
                  value={mT} 
                  onChange={e => setMT(e.target.value)} 
                  placeholder="e.g. 100" 
                />
                <span className="uu">t</span>
              </div>
            </div>
            <div className="field">
              <label>Medium Rate <span className="lh">m²/t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-mr" 
                  value={mR} 
                  onChange={e => setMR(e.target.value)} 
                />
                <span className="uu">m²/t</span>
              </div>
            </div>
            <div className="field"></div>

            <div className="field">
              <label>Heavy Tonnage <span className="lh">t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-h" 
                  value={hT} 
                  onChange={e => setHT(e.target.value)} 
                  placeholder="e.g. 150" 
                />
                <span className="uu">t</span>
              </div>
            </div>
            <div className="field">
              <label>Heavy Rate <span className="lh">m²/t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-hr" 
                  value={hR} 
                  onChange={e => setHR(e.target.value)} 
                />
                <span className="uu">m²/t</span>
              </div>
            </div>
            <div className="field"></div>

            <div className="field">
              <label>UH Tonnage <span className="lh">t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-uh" 
                  value={uhT} 
                  onChange={e => setUhT(e.target.value)} 
                  placeholder="e.g. 50" 
                />
                <span className="uu">t</span>
              </div>
            </div>
            <div className="field">
              <label>UH Rate <span className="lh">m²/t</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="ww-uhr" 
                  value={uhR} 
                  onChange={e => setUhR(e.target.value)} 
                />
                <span className="uu">m²/t</span>
              </div>
            </div>
            <div className="field"></div>
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
          <div className="res" id="r-wws" style={{ display: 'block' }}>
            <div className="output-section">
              <div className="rh">
                <span className="pd"></span>
                <span>Structural Area Result</span>
              </div>

              <div className="tls t1">
                <div className="tile tp">
                  <div className="tl">Total Structural Area</div>
                  <div>
                    <span className="tv" id="ww-rtot">{formatNum(totalArea, 1)}</span>
                    <span className="tu">m²</span>
                  </div>
                  <div className="tn">From {formatNum(totalTonnage, 1)} Total Tonnes</div>
                </div>
              </div>

              <div className="tls">
                <div className="tile ts">
                  <div className="tl">Average Norm Rate</div>
                  <div>
                    <span className="tv">{formatNum(avgRate, 1)}</span>
                    <span className="tu">m²/t</span>
                  </div>
                </div>
                <div className="tile ti">
                  <div className="tl">Total Tonnage</div>
                  <div>
                    <span className="tv">{formatNum(totalTonnage, 1)}</span>
                    <span className="tu">Tonnes</span>
                  </div>
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
