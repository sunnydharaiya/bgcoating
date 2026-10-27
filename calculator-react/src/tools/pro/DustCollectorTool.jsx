import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

const CFM2M3H = 1.699;
const NOZZLE_AIR_DB = {
  '6': { name: '6 mm (No.4)', cfm: [180, 220], pr: [6, 7.5] },
  '8': { name: '8 mm (No.5)', cfm: [300, 400], pr: [6, 7.5] },
  '9.5': { name: '9.5 mm (No.6)', cfm: [450, 550], pr: [6, 7.5] },
  '11': { name: '11 mm (No.7)', cfm: [600, 750], pr: [6, 7.5] },
  '12.5': { name: '12.5 mm (No.8)', cfm: [700, 900], pr: [6, 7.5] }
};
const A2C_DB = {
  'Pulse Jet': [1.0, 0.8, 1.2],
  'Reverse Air': [0.8, 0.6, 1.0],
  'Shaker Type': [0.7, 0.5, 0.9]
};
const STD_MOTORS = [
  [3, 2.2], [5, 3.7], [7.5, 5.5], [10, 7.5], [15, 11],
  [20, 15], [25, 18.5], [30, 22], [40, 30], [50, 37],
  [60, 45], [75, 55], [100, 75], [125, 90]
];

export default function DustCollectorTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // A · Project Info
  const [proj, setProj] = useState('New Blast Facility Phase-1');
  const [cli, setCli] = useState('Godrej Process Equipment');
  const [room, setRoom] = useState('Blast Room BR-01');

  // B · Blast Room Details
  const [len, setLen] = useState('12');
  const [wid, setWid] = useState('6');
  const [ht, setHt] = useState('5');

  // C · Operating Parameters
  const [nozzles, setNozzles] = useState('1');
  const [nozKey, setNozKey] = useState('9.5');
  const [comp, setComp] = useState('1100');
  const [pressure, setPressure] = useState('7');
  const [fv, setFv] = useState('20');
  const [ach, setAch] = useState('45');

  // D · Dust Collection Parameters
  const [dust, setDust] = useState('8');
  const [filterType, setFilterType] = useState('Pulse Jet');
  const [sf, setSf] = useState('15');
  const [staticPress, setStaticPress] = useState('150');

  const [res, setRes] = useState(null);

  const handleCalculate = () => {
    const L = parseFloat(len);
    const W = parseFloat(wid);
    const H = parseFloat(ht);

    if (!L || !W || !H) {
      addToast('Missing Required Inputs', 'Please fill Blast Room Length, Width and Height.', 'warning');
      return;
    }

    const n = parseInt(nozzles, 10) || 1;
    const compVal = parseFloat(comp) || 0;
    const prVal = parseFloat(pressure) || 7;
    const fvVal = parseFloat(fv);
    const achVal = parseFloat(ach);

    if (!fvVal || !achVal) {
      addToast('Missing Required Inputs', 'Please fill Face Velocity and Air Changes per Hour.', 'warning');
      return;
    }

    const dustVal = parseFloat(dust) || 0;
    const sfVal = parseFloat(sf) || 15;
    const spVal = parseFloat(staticPress) || 150;

    const vol = L * W * H;
    const qAchM3 = vol * achVal;
    const qAchC = qAchM3 / CFM2M3H;

    const qFvM3 = W * H * fvVal * 60;
    const qFvC = qFvM3 / CFM2M3H;

    const nd = NOZZLE_AIR_DB[nozKey] || NOZZLE_AIR_DB['9.5'];
    const pf = (prVal + 1) / 8;
    const perNoz = ((nd.cfm[0] + nd.cfm[1]) / 2) * pf;
    const qNozC = perNoz * n;
    const qNozBasisC = Math.max(qNozC, compVal);

    const reqC = Math.max(qAchC, qFvC, qNozBasisC);
    const gov = reqC === qAchC ? `Air Changes (${achVal} ACH)` : (reqC === qFvC ? `Face Velocity (${fvVal} m/min)` : 'Nozzle / Compressor Air');
    const finC = reqC * (1 + sfVal / 100);
    const finM3 = finC * CFM2M3H;

    const a2cArr = A2C_DB[filterType] || A2C_DB['Pulse Jet'];
    const a2c = dustVal > 10 ? a2cArr[1] : a2cArr[0];
    const fa = (finM3 / 60) / a2c;

    const dpPa = spVal * 9.81;
    const pKw = ((finM3 / 3600) * dpPa) / (0.65 * 0.9) / 1000;
    const mot = STD_MOTORS.find(m => m[1] >= pKw * 1.15) || STD_MOTORS[STD_MOTORS.length - 1];

    setRes({
      vol,
      reqC,
      finC,
      finM3,
      gov,
      fa,
      pKw,
      mot,
      L,
      W,
      H,
      n,
      nozKey,
      sfVal,
      spVal
    });
    addToast('Sizing Complete', 'Dust collector capacity and motor power calculated.', 'success');

    // Auto-save to calculation audit log
    autoLogCalculation({
      tool_id: 'pro-dcc',
      tool_name: 'Dust Collector Capacity',
      category: 'pro',
      inputs: {
        project: proj,
        client: cli,
        room,
        room_length_m: L,
        room_width_m: W,
        room_height_m: H,
        nozzles_count: n,
        nozzle_size_mm: nozKey,
        pressure_bar: parseFloat(pressure) || 0,
        cross_ventilation_fpm: parseFloat(fv) || 0,
        air_changes_per_hr: parseFloat(ach) || 0,
        filter_type: filterType,
        safety_factor_pct: sfVal,
        static_pressure_mm_wg: spVal
      },
      results: {
        room_volume_m3: vol,
        governing_criterion: gov,
        final_design_airflow_cfm: finC,
        final_design_airflow_m3_hr: finM3,
        filter_cloth_area_m2: fa,
        calculated_fan_power_kw: pKw,
        recommended_motor_hp: mot ? mot[0] : null,
        recommended_motor_kw: mot ? mot[1] : null
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (log && (log.tool_id === 'pro-dcc' || log.tool_id === 'dust_collector' || log.tool_id === 'pro_dcc' || log.tool_id === 'dehumidification_pro')) {
        if (log.inputs) {
          if (log.inputs.project !== undefined) setProj(log.inputs.project);
          if (log.inputs.client !== undefined) setCli(log.inputs.client);
          if (log.inputs.room !== undefined) setRoom(log.inputs.room);
          if (log.inputs.room_length_m !== undefined) setLen(String(log.inputs.room_length_m));
          if (log.inputs.room_width_m !== undefined) setWid(String(log.inputs.room_width_m));
          if (log.inputs.room_height_m !== undefined) setHt(String(log.inputs.room_height_m));
          if (log.inputs.nozzles_count !== undefined) setNozzles(String(log.inputs.nozzles_count));
          if (log.inputs.nozzle_size_mm !== undefined) setNozKey(String(log.inputs.nozzle_size_mm));
          if (log.inputs.pressure_bar !== undefined) setPressure(String(log.inputs.pressure_bar));
          if (log.inputs.cross_ventilation_fpm !== undefined) setFv(String(log.inputs.cross_ventilation_fpm));
          if (log.inputs.air_changes_per_hr !== undefined) setAch(String(log.inputs.air_changes_per_hr));
          if (log.inputs.filter_type !== undefined) setFilterType(log.inputs.filter_type);
          if (log.inputs.safety_factor_pct !== undefined) setSf(String(log.inputs.safety_factor_pct));
          if (log.inputs.static_pressure_mm_wg !== undefined) setStaticPress(String(log.inputs.static_pressure_mm_wg));
        }
        if (log.results) {
          setRes({
            vol: log.results.room_volume_m3,
            reqC: 0,
            finC: log.results.final_design_airflow_cfm,
            finM3: log.results.final_design_airflow_m3_hr,
            gov: log.results.governing_criterion,
            fa: log.results.filter_cloth_area_m2,
            pKw: log.results.calculated_fan_power_kw,
            mot: [log.results.recommended_motor_hp || 15, log.results.recommended_motor_kw || 11],
            L: log.inputs?.room_length_m,
            W: log.inputs?.room_width_m,
            H: log.inputs?.room_height_m,
            n: log.inputs?.nozzles_count || 1,
            nozKey: log.inputs?.nozzle_size_mm || '9.5',
            sfVal: log.inputs?.safety_factor_pct || 15,
            spVal: log.inputs?.static_pressure_mm_wg || 150
          });
        }
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  const handleReset = () => {
    setProj('');
    setCli('');
    setRoom('');
    setLen('12');
    setWid('6');
    setHt('5');
    setNozzles('1');
    setNozKey('9.5');
    setComp('1100');
    setPressure('7');
    setFv('20');
    setAch('45');
    setDust('8');
    setFilterType('Pulse Jet');
    setSf('15');
    setStaticPress('150');
    setRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Dust Collector Sizing Analysis
Blast Room: ${res.L} × ${res.W} × ${res.H} m (${res.vol} m³)
Nozzles: ${res.n} × Ø${res.nozKey} mm
--------------------------------------------------
Recommended Collector Capacity: ${Math.round(res.finC).toLocaleString()} CFM (${Math.round(res.finM3).toLocaleString()} m³/hr)
Governing Criteria: ${res.gov}
Recommended Filter Area: ${formatNum(res.fa, 1)} m²
Fan Motor Rating: ${res.mot[0]} HP (${res.mot[1]} kW)`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Dust collector sizing copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="pro-dcc">
      <div className="ch">
        <div className="ci">🌀</div>
        <div>
          <div className="ct">Dust Collector System Capacity Calculator</div>
          <div className="cs">Required airflow · filter area · fan motor · recommended collector model — ACGIH / OSHA / NFPA</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('pro-dcc')}>📖 Guideline</button>
        <div className="ctag">PRO · DCC-1</div>
      </div>

      <div className="cb">
        <div className="input-section">
          {/* Section A */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', marginBottom: '8px' }}>
            A · Project Information
          </div>
          <div className="g2">
            <div className="field">
              <label>Project Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="dcc-proj" 
                  placeholder="e.g. New Blast Facility Phase-1" 
                  value={proj} 
                  onChange={(e) => setProj(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Client <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="dcc-cli" 
                  placeholder="e.g. Godrej Process Equipment" 
                  value={cli} 
                  onChange={(e) => setCli(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Blast Room Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="dcc-room" 
                  placeholder="e.g. Blast Room BR-01" 
                  value={room} 
                  onChange={(e) => setRoom(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Blast Room Details
          </div>
          <div className="g2">
            <div className="field">
              <label>Blast Room Length <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-l" 
                  placeholder="e.g. 12" 
                  min="0" 
                  step="any" 
                  value={len} 
                  onChange={(e) => setLen(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Blast Room Width <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-w" 
                  placeholder="e.g. 6" 
                  min="0" 
                  step="any" 
                  value={wid} 
                  onChange={(e) => setWid(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>

            <div className="field">
              <label>Blast Room Height <span className="lh">m</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-h" 
                  placeholder="e.g. 5" 
                  min="0" 
                  step="any" 
                  value={ht} 
                  onChange={(e) => setHt(e.target.value)} 
                />
                <span className="uu">m</span>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Operating Parameters
          </div>
          <div className="g2">
            <div className="field">
              <label>Number of Blast Nozzles</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-n" 
                  value={nozzles} 
                  min="1" 
                  step="1" 
                  onChange={(e) => setNozzles(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>

            <div className="field">
              <label>Nozzle Diameter <span className="lh">mm</span></label>
              <div className="iw">
                <select 
                  id="dcc-noz" 
                  value={nozKey} 
                  onChange={(e) => setNozKey(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="6">6 mm (No.4) — ≈ 200 CFM</option>
                  <option value="8">8 mm (No.5) — ≈ 350 CFM</option>
                  <option value="9.5">9.5 mm (No.6) — ≈ 500 CFM</option>
                  <option value="11">11 mm (No.7) — ≈ 675 CFM</option>
                  <option value="12.5">12.5 mm (No.8) — ≈ 800 CFM</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Compressor Capacity <span className="lh">total CFM available</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-comp" 
                  placeholder="e.g. 1100" 
                  min="0" 
                  step="any" 
                  value={comp} 
                  onChange={(e) => setComp(e.target.value)} 
                />
                <span className="uu">CFM</span>
              </div>
            </div>

            <div className="field">
              <label>Blast Pressure <span className="lh">bar</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-pr" 
                  value={pressure} 
                  min="2" 
                  max="12" 
                  step="any" 
                  onChange={(e) => setPressure(e.target.value)} 
                />
                <span className="uu">bar</span>
              </div>
            </div>

            <div className="field">
              <label>Face Velocity <span className="lh">m/min · typ. 18–25</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-fv" 
                  value={fv} 
                  min="5" 
                  max="60" 
                  step="any" 
                  onChange={(e) => setFv(e.target.value)} 
                />
                <span className="uu">m/min</span>
              </div>
            </div>

            <div className="field">
              <label>Air Changes per Hour <span className="lh">typ. 30–60 ACH</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-ach" 
                  value={ach} 
                  min="5" 
                  max="120" 
                  step="any" 
                  onChange={(e) => setAch(e.target.value)} 
                />
                <span className="uu">ACH</span>
              </div>
            </div>
          </div>

          {/* Section D */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            D · Dust Collection Parameters
          </div>
          <div className="g2">
            <div className="field">
              <label>Dust Loading <span className="lh">g/m³ · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-dust" 
                  placeholder="e.g. 8" 
                  min="0" 
                  step="any" 
                  value={dust} 
                  onChange={(e) => setDust(e.target.value)} 
                />
                <span className="uu">g/m³</span>
              </div>
            </div>

            <div className="field">
              <label>Filter Cleaning System</label>
              <div className="iw">
                <select 
                  id="dcc-filt" 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Pulse Jet</option>
                  <option>Reverse Air</option>
                  <option>Shaker Type</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Safety Factor <span className="lh">% · typ. 10–20</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-sf" 
                  value={sf} 
                  min="0" 
                  max="50" 
                  step="any" 
                  onChange={(e) => setSf(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Est. System Static Pressure <span className="lh">mm WG · for fan sizing</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="dcc-sp" 
                  value={staticPress} 
                  min="50" 
                  max="400" 
                  step="any" 
                  onChange={(e) => setStaticPress(e.target.value)} 
                />
                <span className="uu">mmWG</span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Dust Collector Capacity</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {res && (
          <div className="res show" id="r-dcc">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Dust Collector Sizing Result</div>

              {/* Primary Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Recommended Collector Capacity</div>
                  <div>
                    <span className="tv" id="dcc-rcap">{Math.round(res.finC).toLocaleString()}</span>
                    <span className="tu">CFM</span>
                  </div>
                  <div className="tn" id="dcc-rcapm">{Math.round(res.finM3).toLocaleString()} m³/hr (incl. {res.sfVal}% SF)</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Required Airflow (before SF)</div>
                  <div>
                    <span className="tv" id="dcc-rreq">{Math.round(res.reqC).toLocaleString()}</span>
                    <span className="tu">CFM</span>
                  </div>
                  <div className="tn" id="dcc-rreqm">Governed by: {res.gov}</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Recommended Filter Area</div>
                  <div>
                    <span className="tv" id="dcc-rfa">{formatNum(res.fa, 1)}</span>
                    <span className="tu">m²</span>
                  </div>
                  <div className="tn" id="dcc-rfan">{filterType} media</div>
                </div>

                <div className="tile tg">
                  <div className="tl">Fan Motor Rating</div>
                  <div>
                    <span className="tv" id="dcc-rmot">{res.mot[0]} HP</span>
                  </div>
                  <div className="tn" id="dcc-rmotn">{res.mot[1]} kW motor @ {res.spVal} mmWG static</div>
                </div>
              </div>

              {/* Input Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Dust Collection Sizing Summary</div>
                <div className="dr"><span className="dk">Blast Room Enclosure</span><span className="dv">{res.L} × {res.W} × {res.H} m ({res.vol} m³)</span></div>
                <div className="dr"><span className="dk">Nozzle Configuration</span><span className="dv">{res.n} × Ø{res.nozKey} mm</span></div>
                <div className="dr"><span className="dk">Governing Ventilation Requirement</span><span className="dv">{res.gov}</span></div>
                <div className="dr"><span className="dk">Design Airflow (CFM / m³·h)</span><span className="dv">{Math.round(res.finC).toLocaleString()} CFM / {Math.round(res.finM3).toLocaleString()} m³/h</span></div>
                <div className="dr"><span className="dk">Air-to-Cloth Media Ratio</span><span className="dv">{filterType} ({formatNum(res.fa, 1)} m² cloth)</span></div>
                <div className="dr"><span className="dk">Blower Power Requirement</span><span className="dv">{res.mot[0]} HP ({res.mot[1]} kW)</span></div>
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> ACGIH Industrial Ventilation Manual · OSHA 29 CFR 1910.94 · NFPA 652 / 654 (Combustible Dusts) · Project Safety Specification.
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-share" onClick={handleShare}>📤 Share Text</button>
              <button className="btn-print" onClick={handlePrint}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting dust collector sizing...', 'info')}>
                📊 Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
