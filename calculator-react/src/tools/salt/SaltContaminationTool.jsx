import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatNum } from '../../utils/calculations';

const SALT_TEMP = {
  0: 5.6, 5: 18.7, 10: 29.1, 15: 37.4, 20: 44.3, 25: 50,
  30: 54.8, 35: 58.8, 40: 62.4, 45: 65.4, 50: 68.0, 55: 70.3,
  60: 72.4, 65: 74.2, 70: 75.8, 75: 77.3, 80: 78.6
};

export default function SaltContaminationTool() {
  const { addToast } = useToast();
  const [instrument, setInstrument] = useState('Horiba');
  const [projectName, setProjectName] = useState('Tank Farm Project');
  const [blank, setBlank] = useState('1');
  const [waterVol, setWaterVol] = useState('3');
  const [surf, setSurf] = useState('25');
  const [limit, setLimit] = useState('20');
  const [temp, setTemp] = useState('25');

  const [calculated, setCalculated] = useState(false);
  const [res, setRes] = useState(null);

  const handleCalculate = () => {
    const blankVal = parseFloat(blank) || 0;
    const surfVal = parseFloat(surf);
    const wqVal = parseFloat(waterVol) || 3;
    const limVal = parseFloat(limit) || 20;
    const tempVal = parseInt(temp, 10) || 25;

    if (isNaN(surfVal)) {
      addToast('Missing Required Inputs', 'Please fill Surface Conductivity.', 'warning');
      return;
    }

    const net = Math.max(0, surfVal - blankVal);
    const factor = 1.12 * (wqVal / 3);
    const saltMeas = net * factor;
    const tf = 50 / (SALT_TEMP[tempVal] || 50);
    const salt25 = saltMeas * tf;
    const isPass = salt25 <= limVal;

    const above = tempVal > 25;
    const at = tempVal === 25;
    const dir = at 
      ? 'unchanged (test already at the 25°C reference)'
      : above 
        ? 'reduced (test above 25°C reads high, so referencing to 25°C lowers it)'
        : 'increased (test below 25°C reads low, so referencing to 25°C raises it)';

    setRes({
      instrument: instrument || '—',
      projectName: projectName || '—',
      blankVal,
      surfVal,
      wqVal,
      limVal,
      tempVal,
      net,
      factor,
      saltMeas,
      tf,
      salt25,
      isPass,
      dir
    });
    setCalculated(true);
    addToast('Calculation Complete', 'Salt contamination test evaluated.', 'success');
  };

  const handleReset = () => {
    setInstrument('');
    setProjectName('');
    setBlank('');
    setWaterVol('3');
    setSurf('');
    setLimit('20');
    setTemp('25');
    setCalculated(false);
    setRes(null);
    addToast('Form Reset', 'Parameters have been cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Salt Contamination Test (ISO 8502-9)
Instrument: ${res.instrument}
Project: ${res.projectName}
Blank: ${res.blankVal} µS/cm | Surface: ${res.surfVal} µS/cm | DM Water: ${res.wqVal} ml
Temperature: ${res.tempVal}°C | Limit: ${res.limVal} mg/m²
------------------------------------
Verdict: ${res.isPass ? 'PASS — Acceptable' : 'FAIL — Exceeds Limit'}
Measured Salt (at ${res.tempVal}°C): ${formatNum(res.saltMeas, 2)} mg/m² (${formatNum(res.saltMeas / 10, 3)} µg/cm²)
Corrected Salt @ 25°C Ref: ${formatNum(res.salt25, 2)} mg/m² (${formatNum(res.salt25 / 10, 3)} µg/cm²)
Net Conductivity: ${formatNum(res.net, 2)} µS/cm
Temp Correction Factor: ${formatNum(res.tf, 4)}`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Summary copied for sharing.', 'success');
  };

  return (
    <div className="sub-sec card active" id="salt-main">
      <div className="ch">
        <div className="ci">🧂</div>
        <div>
          <div className="ct">Online Salt Contamination Test</div>
          <div className="cs">ISO 8502-9 · Temperature Correction · Pass/Fail Verdict</div>
        </div>
        <div className="ctag">ISO 8502-9</div>
      </div>

      <div className="cb">
        <div className="input-section">
          <div className="g2">
            <div className="field">
              <label>Instrument <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="sc-inst" 
                  placeholder="e.g. Horiba" 
                  value={instrument} 
                  onChange={(e) => setInstrument(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Project Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="sc-proj" 
                  placeholder="e.g. Tank Farm Project" 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Blank Conductivity <span className="lh">µS/cm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="sc-blank" 
                  placeholder="e.g. 1" 
                  step="0.1" 
                  value={blank} 
                  onChange={(e) => setBlank(e.target.value)} 
                />
                <span className="uu">µS/cm</span>
              </div>
            </div>

            <div className="field">
              <label>DM Water Volume <span className="lh">ml</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="sc-wq" 
                  placeholder="3" 
                  step="0.5" 
                  value={waterVol} 
                  onChange={(e) => setWaterVol(e.target.value)} 
                />
                <span className="uu">ml</span>
              </div>
            </div>

            <div className="field">
              <label>Surface Conductivity <span className="lh">µS/cm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="sc-surf" 
                  placeholder="e.g. 25" 
                  step="0.1" 
                  value={surf} 
                  onChange={(e) => setSurf(e.target.value)} 
                />
                <span className="uu">µS/cm</span>
              </div>
            </div>

            <div className="field">
              <label>Acceptable Limit <span className="lh">mg/m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="sc-lim" 
                  placeholder="20" 
                  value={limit} 
                  onChange={(e) => setLimit(e.target.value)} 
                />
                <span className="uu">mg/m²</span>
              </div>
            </div>

            <div className="field">
              <label>Steel Temperature</label>
              <div className="iw">
                <select 
                  id="sc-temp" 
                  value={temp} 
                  onChange={(e) => setTemp(e.target.value)}
                >
                  <option value="0">0°C</option>
                  <option value="5">5°C</option>
                  <option value="10">10°C</option>
                  <option value="15">15°C</option>
                  <option value="20">20°C</option>
                  <option value="25">25°C (Reference)</option>
                  <option value="30">30°C</option>
                  <option value="35">35°C</option>
                  <option value="40">40°C</option>
                  <option value="45">45°C</option>
                  <option value="50">50°C</option>
                  <option value="55">55°C</option>
                  <option value="60">60°C</option>
                  <option value="65">65°C</option>
                  <option value="70">70°C</option>
                  <option value="75">75°C</option>
                  <option value="80">80°C</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Salt Contamination</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {calculated && res && (
          <div className="res show" id="r-salt">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Salt Result</div>

              <div id="salt-verdict">
                <div className={res.isPass ? 'salt-pass' : 'salt-fail'}>
                  <div className="salt-vl" style={{ color: res.isPass ? '#1B5E20' : '#B71C1C' }}>
                    {res.isPass ? '✅ PASS — Acceptable' : '❌ FAIL — Exceeds Limit'}
                  </div>
                  <div className="salt-vv" style={{ color: res.isPass ? '#2E7D32' : '#C62828' }}>
                    {formatNum(res.salt25, 1)} mg/m² (at 25°C ref) vs Limit {res.limVal} mg/m²
                  </div>
                </div>
              </div>

              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Measured (at test temp.)</div>
                  <div>
                    <span className="tv" id="sc-r25">{formatNum(res.saltMeas, 2)}</span>
                    <span className="tu">mg/m²</span>
                  </div>
                </div>
                <div className="tile tg">
                  <div className="tl">Corrected @ 25°C Ref ✓</div>
                  <div>
                    <span className="tv" id="sc-rtc">{formatNum(res.salt25, 2)}</span>
                    <span className="tu">mg/m²</span>
                  </div>
                </div>
                <div className="tile ti">
                  <div className="tl">Measured (µg/cm²)</div>
                  <div>
                    <span className="tv" id="sc-r25u">{formatNum(res.saltMeas / 10, 3)}</span>
                    <span className="tu">µg/cm²</span>
                  </div>
                </div>
                <div className="tile ts">
                  <div className="tl">Corrected (µg/cm²) ✓</div>
                  <div>
                    <span className="tv" id="sc-rtcu">{formatNum(res.salt25 / 10, 3)}</span>
                    <span className="tu">µg/cm²</span>
                  </div>
                </div>
              </div>

              {/* Engineering Calculation Breakdown */}
              <div id="sc-working">
                <div className="sc-calc">
                  <div className="sc-calc-h">
                    <span>🧮</span> Engineering Calculation — ISO 8502-9 (step by step)
                  </div>
                  <div className="sc-calc-b">
                    <div className="scw-row">
                      <span className="scw-k">1 · Net conductivity</span>
                      <span className="scw-v">
                        {res.surfVal} − {res.blankVal} = <b>{formatNum(res.net, 2)} µS/cm</b>
                      </span>
                    </div>
                    <div className="scw-note">
                      Surface conductivity minus blank (background) conductivity.
                    </div>

                    <div className="scw-row">
                      <span className="scw-k">2 · Extraction / area factor</span>
                      <span className="scw-v">
                        1.12 × ({res.wqVal} ÷ 3) = <b>{formatNum(res.factor, 3)}</b>
                      </span>
                    </div>
                    <div className="scw-note">
                      1.12 mg/m² per µS/cm baseline, scaled by DM-water volume ({res.wqVal} ml vs 3 ml Bresle standard).
                    </div>

                    <div className="scw-row">
                      <span className="scw-k">3 · Measured salt @ {res.tempVal}°C</span>
                      <span className="scw-v">
                        {formatNum(res.net, 2)} × {formatNum(res.factor, 3)} = <b>{formatNum(res.saltMeas, 2)} mg/m²</b>
                      </span>
                    </div>
                    <div className="scw-note">
                      This is the value at the actual test temperature (before referencing to 25°C).
                    </div>

                    <div className="scw-row">
                      <span className="scw-k">4 · Temperature correction factor</span>
                      <span className="scw-v">
                        50 ÷ {SALT_TEMP[res.tempVal] || 50} = <b>{formatNum(res.tf, 4)}</b>
                      </span>
                    </div>
                    <div className="scw-note">
                      Reference solution conductivity rises with temperature (25°C → 50; {res.tempVal}°C → {SALT_TEMP[res.tempVal] || 50}). Dividing by this ratio converts the reading to the 25°C reference.
                    </div>

                    <div className="scw-row hl">
                      <span className="scw-k">5 · Corrected salt @ 25°C reference</span>
                      <span className="scw-v">
                        {formatNum(res.saltMeas, 2)} × {formatNum(res.tf, 4)} = <b>{formatNum(res.salt25, 2)} mg/m²</b>
                      </span>
                    </div>
                    <div className="scw-note">
                      Value is {res.dir}.
                    </div>

                    <div className={`scw-row res ${res.isPass ? 'ok' : 'no'}`}>
                      <span className="scw-k">6 · Acceptance check</span>
                      <span className="scw-v">
                        <b>{formatNum(res.salt25, 2)} mg/m²</b> vs limit {res.limVal} mg/m² → <b>{res.isPass ? 'PASS' : 'FAIL'}</b>
                      </span>
                    </div>

                    <div className="scw-why">
                      <b>Why correct for temperature?</b> The Bresle extract’s conductivity is influenced by the temperature at which the test is performed. To comply with ISO 8502-9, the measured value is converted to the equivalent value at the standard reference temperature of 25°C.
                    </div>
                  </div>
                </div>
              </div>

              <div className="input-summary">
                <div className="input-summary-label">📝 Input Data (Provided by User)</div>
                <div className="dr"><span className="dk">Instrument</span><span className="dv" id="sc-rinst">{res.instrument}</span></div>
                <div className="dr"><span className="dk">Project</span><span className="dv" id="sc-rproj">{res.projectName}</span></div>
                <div className="dr"><span className="dk">Blank Conductivity</span><span className="dv" id="sc-rblank">{res.blankVal} µS/cm</span></div>
                <div className="dr"><span className="dk">Surface Conductivity</span><span className="dv" id="sc-rsurf">{res.surfVal} µS/cm</span></div>
                <div className="dr"><span className="dk">DM Water Volume</span><span className="dv" id="sc-rwq">{res.wqVal} ml</span></div>
                <div className="dr"><span className="dk">Steel Temperature</span><span className="dv" id="sc-rtemp">{res.tempVal}°C</span></div>
                <div className="dr"><span className="dk">Net Conductivity</span><span className="dv" id="sc-rnet">{formatNum(res.net, 3)} µS/cm</span></div>
                <div className="dr"><span className="dk">Temp Factor</span><span className="dv" id="sc-rtf">{formatNum(res.tf, 4)}</span></div>
                <div className="dr"><span className="dk">Limit</span><span className="dv" id="sc-rlim">{res.limVal} mg/m²</span></div>
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
