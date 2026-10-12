import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

export default function VesselAreaTool() {
  const { addToast } = useToast();
  const [shellLen, setShellLen] = useState('30');
  const [shellDia, setShellDia] = useState('4.9');
  const [shellThk, setShellThk] = useState('75');
  const [qty, setQty] = useState('1');
  const [skirtLen, setSkirtLen] = useState('10');
  const [skirtDia, setSkirtDia] = useState('5');
  const [skirtThk, setSkirtThk] = useState('25');
  const [extraExt, setExtraExt] = useState('10');
  const [extraInt, setExtraInt] = useState('15');
  const [extraSkirt, setExtraSkirt] = useState('15');
  const [itemName, setItemName] = useState('Reactor Vessel');

  const [calculated, setCalculated] = useState(false);
  const [res, setRes] = useState(null);

  const handleCalculate = () => {
    const SL = parseFloat(shellLen);
    const SD = parseFloat(shellDia);
    const STmm = parseFloat(shellThk);
    const ST = STmm / 1000;
    const Q = parseInt(qty, 10) || 1;
    const SKL = parseFloat(skirtLen) || 0;
    const SKD = parseFloat(skirtDia) || 0;
    const SKT = (parseFloat(skirtThk) || 0) / 1000;
    const EE = (parseFloat(extraExt) || 0) / 100;
    const EI = (parseFloat(extraInt) || 0) / 100;
    const ESK = (parseFloat(extraSkirt) || 0) / 100;

    if (!SL || !SD || !STmm) {
      addToast('Missing Required Inputs', 'Please fill Shell Length, Diameter and Thickness.', 'warning');
      return;
    }

    const SOD = SD + 2 * ST;
    const shI = Math.PI * SD * SL * Q;
    const shO = Math.PI * SOD * SL * Q;
    const deI = (Math.PI / 2) * SD * SD * 2 * Q;
    const deO = (Math.PI / 2) * SOD * SOD * 2 * Q;
    const pbI = (shI + deI) * (1 + EI);
    const pbO = (shO + deO) * (1 + EE);
    const skI = (SKL && SKD) ? Math.PI * SKD * SKL * Q * (1 + ESK) : 0;
    const skO = (SKL && SKD) ? Math.PI * (SKD + 2 * SKT) * SKL * Q * (1 + ESK) : 0;
    const total = pbI + pbO + skI + skO;

    setRes({
      total,
      pbI,
      pbO,
      skI,
      skO,
      name: itemName || '—',
      dim: `${SL} m × ${SD} m × ${STmm} mm`,
      q: Q
    });
    setCalculated(true);
    addToast('Calculation Complete', 'Vessel surface area calculated.', 'success');
  };

  const handleReset = () => {
    setShellLen('');
    setShellDia('');
    setShellThk('');
    setQty('1');
    setSkirtLen('');
    setSkirtDia('');
    setSkirtThk('');
    setExtraExt('10');
    setExtraInt('15');
    setExtraSkirt('15');
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
    const text = `BG CoatingOS™ — Vessel / Equipment Surface Area
Item Name: ${res.name}
Shell L × ID × T: ${res.dim}
Quantity: ${res.q}
------------------------------------
Entire Vessel Surface Area: ${formatNum(res.total, 3)} m²
Pressure Boundary (In): ${formatNum(res.pbI, 3)} m²
Pressure Boundary (Out): ${formatNum(res.pbO, 3)} m²
Skirt Inside: ${formatNum(res.skI, 3)} m²
Skirt Outside: ${formatNum(res.skO, 3)} m²`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Summary copied for sharing.', 'success');
  };

  return (
    <div className="sub-sec card active" id="sa-vessel">
      <div className="ch">
        <div className="ci">🏭</div>
        <div>
          <div className="ct">Vessel / Equipment Surface Area</div>
          <div className="cs">Complete vessel — shell, dished ends, skirt + extras</div>
        </div>
        <div className="ctag">A-6</div>
      </div>

      <div className="cb">
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Shell Length <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-sl" 
                  placeholder="e.g. 30" 
                  step="0.01" 
                  value={shellLen} 
                  onChange={(e) => setShellLen(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Shell Inside Dia <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-sd" 
                  placeholder="e.g. 4.9" 
                  step="0.01" 
                  value={shellDia} 
                  onChange={(e) => setShellDia(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Shell Thickness <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-st" 
                  placeholder="e.g. 75" 
                  value={shellThk} 
                  onChange={(e) => setShellThk(e.target.value)} 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Quantity <span className="lh">nos.</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-q" 
                  placeholder="1" 
                  min="1" 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>

            <div className="field">
              <label>Skirt Length <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-skl" 
                  placeholder="e.g. 10" 
                  step="0.01" 
                  value={skirtLen} 
                  onChange={(e) => setSkirtLen(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Skirt Inside Dia <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-skd" 
                  placeholder="e.g. 5" 
                  step="0.01" 
                  value={skirtDia} 
                  onChange={(e) => setSkirtDia(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Skirt Thickness <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-skt" 
                  placeholder="e.g. 25" 
                  value={skirtThk} 
                  onChange={(e) => setSkirtThk(e.target.value)} 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Extra External <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-ee" 
                  value={extraExt} 
                  onChange={(e) => setExtraExt(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Extra Internal <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-ei" 
                  value={extraInt} 
                  onChange={(e) => setExtraInt(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Extra Skirt <span className="lh">%</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="vs-esk" 
                  value={extraSkirt} 
                  onChange={(e) => setExtraSkirt(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Item Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="vs-nm" 
                  placeholder="e.g. Reactor Vessel" 
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
          <div className="res show" id="r-vessel">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Vessel Result</div>
              <div className="tls t1">
                <div className="tile tp">
                  <div className="tl">Entire Vessel Surface Area</div>
                  <div>
                    <span className="tv" id="vs-rtot">{formatNum(res.total, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
              </div>

              <div className="tls">
                <div className="tile ts">
                  <div className="tl">Pressure Boundary (In)</div>
                  <div>
                    <span className="tv" id="vs-rpbi">{formatNum(res.pbI, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
                <div className="tile ti">
                  <div className="tl">Pressure Boundary (Out)</div>
                  <div>
                    <span className="tv" id="vs-rpbo">{formatNum(res.pbO, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
                <div className="tile tg">
                  <div className="tl">Skirt Inside</div>
                  <div>
                    <span className="tv" id="vs-rski">{formatNum(res.skI, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
                <div className="tile tp">
                  <div className="tl">Skirt Outside</div>
                  <div>
                    <span className="tv" id="vs-rsko">{formatNum(res.skO, 3)}</span>
                    <span className="tu">m²</span>
                  </div>
                </div>
              </div>

              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr"><span className="dk">Item Name</span><span className="dv" id="vs-rnm">{res.name}</span></div>
                <div className="dr"><span className="dk">Shell L × ID × T</span><span className="dv" id="vs-rdim">{res.dim}</span></div>
                <div className="dr"><span className="dk">Quantity</span><span className="dv" id="vs-rq">{res.q}</span></div>
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
