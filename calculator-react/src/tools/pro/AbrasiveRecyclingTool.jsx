import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

const RECYCLE_DB = {
  'Steel Grit': { life: '150–200+', rec: 95, brk: 1.0, cons: '0.5–2', den: '~4.3 (bulk)', hard: '55–65 HRC', rating: '★★★★★ Excellent' },
  'Steel Shot': { life: '200–300+', rec: 96, brk: 0.7, cons: '0.3–1.5', den: '~4.5 (bulk)', hard: '40–50 HRC', rating: '★★★★★ Excellent' },
  'Steel Grit + Steel Shot Mix': { life: '150–250', rec: 95, brk: 0.9, cons: '0.4–1.8', den: '~4.4 (bulk)', hard: '40–65 HRC', rating: '★★★★★ Excellent' },
  'Garnet': { life: '3–5', rec: 80, brk: 15, cons: '6–15', den: '~2.3 (bulk)', hard: '7.5–8 Mohs', rating: '★★★ Good' },
  'Copper Slag': { life: '1–2', rec: 60, brk: 35, cons: '15–35', den: '~1.8 (bulk)', hard: '6–7 Mohs', rating: '★ Expendable' },
  'Coal Slag': { life: '1', rec: 50, brk: 45, cons: '12–30', den: '~1.4 (bulk)', hard: '6–7 Mohs', rating: '★ Expendable' },
  'Aluminium Oxide': { life: '6–12', rec: 85, brk: 10, cons: '3–8', den: '~1.8 (bulk)', hard: '9 Mohs', rating: '★★★★ Very Good' },
  'Glass Beads': { life: '8–15', rec: 82, brk: 12, cons: '2–6', den: '~1.5 (bulk)', hard: '6–7 Mohs', rating: '★★★ Good' },
  'Ceramic Beads': { life: '20–30', rec: 90, brk: 5, cons: '1–3', den: '~2.3 (bulk)', hard: '60 HRC', rating: '★★★★ Very Good' },
  'Stainless Steel Grit': { life: '150–200+', rec: 95, brk: 1.0, cons: '0.5–2', den: '~4.3 (bulk)', hard: '55–65 HRC', rating: '★★★★★ Excellent' },
  'Other': { life: '5–10', rec: 75, brk: 15, cons: '5–15', den: 'Variable', hard: 'Variable', rating: '★★ Moderate' }
};

function arcCls(eff) {
  if (eff >= 95) return { t: 'Excellent Recycling Efficiency', ic: '✅', bg: '#E8F5E9', bd: 'rgba(46,125,50,.35)', c1: '#1B5E20', c2: '#2E7D32' };
  if (eff >= 85) return { t: 'Good Recycling Efficiency', ic: '🔵', bg: '#E3F2FD', bd: 'rgba(21,101,192,.35)', c1: '#0D47A1', c2: '#1565C0' };
  if (eff >= 70) return { t: 'Moderate Efficiency — Review Air Wash / Sieve', ic: '⚠️', bg: '#FFF8E1', bd: 'rgba(245,127,23,.4)', c1: '#8B4500', c2: '#B26A00' };
  return { t: 'Low Efficiency — High Abrasive Breakdown / Loss', ic: '❌', bg: '#FFEBEE', bd: 'rgba(211,47,47,.35)', c1: '#B71C1C', c2: '#C62828' };
}

export default function AbrasiveRecyclingTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // A · Project Info
  const [proj, setProj] = useState('Blast Room #2 Weekly Review');
  const [cli, setCli] = useState('L&T Heavy Engineering');
  const [str, setStr] = useState('Pressure Vessel V-301');

  // B · Abrasive Details
  const [type, setType] = useState('Steel Grit');
  const [cycles, setCycles] = useState('25');

  // C · Operating Inputs
  const [fresh, setFresh] = useState('2000');
  const [recov, setRecov] = useState('1850');
  const [waste, setWaste] = useState('0');
  const [dust, setDust] = useState('0');
  const [rej, setRej] = useState('3');
  const [cost, setCost] = useState('45');
  const [area, setArea] = useState('500');

  const [res, setRes] = useState(null);

  const handleCalculate = () => {
    const freshVal = parseFloat(fresh);
    const recovVal = parseFloat(recov);
    const wasteVal = parseFloat(waste) || 0;
    const dustVal = parseFloat(dust) || 0;
    const rejVal = parseFloat(rej) || 0;
    const costVal = parseFloat(cost) || 0;
    const areaVal = parseFloat(area) || 0;
    const cycVal = parseInt(cycles, 10) || 0;

    if (!freshVal || isNaN(recovVal)) {
      addToast('Missing Required Inputs', 'Please fill Fresh Abrasive Charged and Recovered Abrasive.', 'warning');
      return;
    }
    if (recovVal > freshVal) {
      addToast('Mass Balance Error', 'Recovered abrasive cannot exceed Fresh abrasive charged.', 'error');
      return;
    }
    if (recovVal + wasteVal + dustVal > freshVal * 1.001) {
      addToast('Mass Balance Error', 'Recovered + Waste + Dust exceeds Fresh charged.', 'error');
      return;
    }

    const recovRate = (recovVal / freshVal) * 100;
    const rejected = (recovVal * rejVal) / 100;
    const reusable = recovVal - rejected;
    const eff = recovVal > 0 ? (reusable / recovVal) * 100 : 0;
    const makeup = freshVal - reusable;
    const wasteKg = wasteVal + dustVal;
    const wastePct = (wasteKg / freshVal) * 100;
    const cons = areaVal > 0 ? makeup / areaVal : null;
    const freshCost = costVal > 0 ? makeup * costVal : null;
    const saving = costVal > 0 ? reusable * costVal : null;
    const unacc = Math.max(0, freshVal - recovVal - wasteKg);

    const db = RECYCLE_DB[type] || RECYCLE_DB['Other'];
    const g = arcCls(eff);

    setRes({
      freshVal,
      recovVal,
      wasteVal,
      dustVal,
      rejVal,
      costVal,
      areaVal,
      cycVal,
      recovRate,
      rejected,
      reusable,
      eff,
      makeup,
      wasteKg,
      wastePct,
      cons,
      freshCost,
      saving,
      unacc,
      db,
      g,
      type
    });
    addToast('Calculation Complete', 'Abrasive recycling efficiency and mass balance computed.', 'success');

    // Auto-save to calculation audit log
    autoLogCalculation({
      tool_id: 'pro-arc',
      tool_name: 'Abrasive Recycling & Recovery Efficiency',
      category: 'pro',
      inputs: {
        project: proj,
        client: cli,
        structure: str,
        abrasive_type: type,
        recycle_cycles: cycVal,
        fresh_abrasive_loaded_kg: freshVal,
        abrasive_recovered_kg: recovVal,
        waste_fines_kg: wasteVal,
        dust_collector_fines_kg: dustVal,
        screen_reject_pct: rejVal,
        abrasive_cost_inr_kg: costVal,
        blasted_surface_area_m2: areaVal
      },
      results: {
        recovery_rate_pct: recovRate,
        reusable_abrasive_kg: reusable,
        recycling_efficiency_pct: eff,
        makeup_abrasive_needed_kg: makeup,
        makeup_consumption_kg_m2: cons,
        cost_savings_inr: saving,
        classification: g.t
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (log && (log.tool_id === 'pro-arc' || log.tool_id === 'abrasive_recycling' || log.tool_id === 'pro_arc')) {
        if (log.inputs) {
          if (log.inputs.project !== undefined) setProj(log.inputs.project);
          if (log.inputs.client !== undefined) setCli(log.inputs.client);
          if (log.inputs.structure !== undefined) setStr(log.inputs.structure);
          if (log.inputs.abrasive_type !== undefined) setType(log.inputs.abrasive_type);
          if (log.inputs.recycle_cycles !== undefined) setCycles(String(log.inputs.recycle_cycles));
          if (log.inputs.fresh_abrasive_loaded_kg !== undefined) setFresh(String(log.inputs.fresh_abrasive_loaded_kg));
          if (log.inputs.abrasive_recovered_kg !== undefined) setRecov(String(log.inputs.abrasive_recovered_kg));
          if (log.inputs.waste_fines_kg !== undefined) setWaste(String(log.inputs.waste_fines_kg));
          if (log.inputs.dust_collector_fines_kg !== undefined) setDust(String(log.inputs.dust_collector_fines_kg));
          if (log.inputs.screen_reject_pct !== undefined) setRej(String(log.inputs.screen_reject_pct));
          if (log.inputs.abrasive_cost_inr_kg !== undefined) setCost(String(log.inputs.abrasive_cost_inr_kg));
          if (log.inputs.blasted_surface_area_m2 !== undefined) setArea(String(log.inputs.blasted_surface_area_m2));
        }
        if (log.results) {
          const eff = log.results.recycling_efficiency_pct || 0;
          const g = arcCls(eff);
          setRes({
            freshVal: log.inputs?.fresh_abrasive_loaded_kg,
            recovVal: log.inputs?.abrasive_recovered_kg,
            wasteVal: log.inputs?.waste_fines_kg,
            dustVal: log.inputs?.dust_collector_fines_kg,
            rejVal: log.inputs?.screen_reject_pct,
            costVal: log.inputs?.abrasive_cost_inr_kg,
            areaVal: log.inputs?.blasted_surface_area_m2,
            cycVal: log.inputs?.recycle_cycles,
            recovRate: log.results.recovery_rate_pct,
            rejected: 0,
            reusable: log.results.reusable_abrasive_kg,
            eff,
            makeup: log.results.makeup_abrasive_needed_kg,
            wasteKg: 0,
            wastePct: 0,
            cons: log.results.makeup_consumption_kg_m2,
            freshCost: 0,
            saving: log.results.cost_savings_inr,
            unacc: 0,
            db: RECYCLE_DB[log.inputs?.abrasive_type] || RECYCLE_DB['Other'],
            g,
            type: log.inputs?.abrasive_type || 'Steel Grit'
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
    setStr('');
    setType('Steel Grit');
    setCycles('25');
    setFresh('2000');
    setRecov('1850');
    setWaste('0');
    setDust('0');
    setRej('3');
    setCost('45');
    setArea('500');
    setRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Abrasive Recycling Performance
Abrasive: ${res.type} | Cycles: ${res.cycVal}
Fresh Charged: ${res.freshVal} kg | Recovered: ${res.recovVal} kg | Reusable: ${formatNum(res.reusable, 1)} kg
--------------------------------------------------
Recycling Efficiency: ${formatNum(res.eff, 1)}% (${res.g.t})
Recovery Rate: ${formatNum(res.recovRate, 1)}%
Fresh Makeup Required: ${formatNum(res.makeup, 1)} kg
Waste + Dust: ${formatNum(res.wasteKg, 1)} kg (${formatNum(res.wastePct, 1)}%)
${res.saving !== null ? `Cost Saving vs Single-Use: ${formatCur(res.saving)}` : ''}`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="pro-arc">
      <div className="ch">
        <div className="ci">♻️</div>
        <div>
          <div className="ct">Abrasive Recycling Calculator</div>
          <div className="cs">Recovery rate · recycling efficiency · reusable quantity · waste generation · fresh makeup — ISO 11124 / ISO 11126</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('pro-arc')}>📖 Guideline</button>
        <div className="ctag">PRO · ARC-1</div>
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
                  id="arc-proj" 
                  placeholder="e.g. Blast Room #2 Weekly Review" 
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
                  id="arc-cli" 
                  placeholder="e.g. L&amp;T Heavy Engineering" 
                  value={cli} 
                  onChange={(e) => setCli(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Structure / Equipment <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="arc-str" 
                  placeholder="e.g. Pressure Vessel V-301" 
                  value={str} 
                  onChange={(e) => setStr(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Abrasive Details
          </div>
          <div className="g2">
            <div className="field">
              <label>Abrasive Type</label>
              <div className="iw">
                <select 
                  id="arc-type" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Steel Grit</option>
                  <option>Steel Shot</option>
                  <option>Steel Grit + Steel Shot Mix</option>
                  <option>Garnet</option>
                  <option>Copper Slag</option>
                  <option>Coal Slag</option>
                  <option>Aluminium Oxide</option>
                  <option>Glass Beads</option>
                  <option>Ceramic Beads</option>
                  <option>Stainless Steel Grit</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Number of Recycling Cycles <span className="lh">completed so far</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-cyc" 
                  placeholder="e.g. 25" 
                  min="0" 
                  step="1" 
                  value={cycles} 
                  onChange={(e) => setCycles(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Operating Inputs
          </div>
          <div className="g2">
            <div className="field">
              <label>Total Fresh Abrasive Charged <span className="lh">kg</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-fresh" 
                  placeholder="e.g. 2000" 
                  min="0" 
                  step="any" 
                  value={fresh} 
                  onChange={(e) => setFresh(e.target.value)} 
                />
                <span className="uu">kg</span>
              </div>
            </div>

            <div className="field">
              <label>Total Recovered Abrasive <span className="lh">kg</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-recov" 
                  placeholder="e.g. 1850" 
                  min="0" 
                  step="any" 
                  value={recov} 
                  onChange={(e) => setRecov(e.target.value)} 
                />
                <span className="uu">kg</span>
              </div>
            </div>

            <div className="field">
              <label>Waste Collected <span className="lh">kg</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-waste" 
                  placeholder="0" 
                  value={waste} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setWaste(e.target.value)} 
                />
                <span className="uu">kg</span>
              </div>
            </div>

            <div className="field">
              <label>Dust Collected <span className="lh">kg</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-dust" 
                  placeholder="0" 
                  value={dust} 
                  min="0" 
                  step="any" 
                  onChange={(e) => setDust(e.target.value)} 
                />
                <span className="uu">kg</span>
              </div>
            </div>

            <div className="field">
              <label>Rejection Percentage <span className="lh">% of recovered</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-rej" 
                  placeholder="e.g. 3" 
                  value={rej} 
                  min="0" 
                  max="100" 
                  step="any" 
                  onChange={(e) => setRej(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Abrasive Cost <span className="lh">₹/kg · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-cost" 
                  placeholder="e.g. 45" 
                  min="0" 
                  step="any" 
                  value={cost} 
                  onChange={(e) => setCost(e.target.value)} 
                />
                <span className="uu">₹/kg</span>
              </div>
            </div>

            <div className="field">
              <label>Surface Area Blasted <span className="lh">m² · optional</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="arc-area" 
                  placeholder="e.g. 500" 
                  min="0" 
                  step="any" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)} 
                />
                <span className="uu">m²</span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Recycling Performance</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {res && (
          <div className="res show" id="r-arc">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Recycling Performance Result</div>

              {/* Verdict Banner */}
              <div style={{ background: res.g.bg, border: `1.5px solid ${res.g.bd}`, borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '19px', fontWeight: 700, color: res.g.c1 }}>
                  {res.g.ic} Recycling Efficiency {formatNum(res.eff, 1)}% — {res.g.t}
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: res.g.c2, marginTop: '3px' }}>
                  Recovery Rate: {formatNum(res.recovRate, 1)}% &nbsp;·&nbsp; Reusable Abrasive: {formatNum(res.reusable, 1)} kg &nbsp;·&nbsp; Fresh Makeup: {formatNum(res.makeup, 1)} kg
                </div>
              </div>

              {/* Primary Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Recycling Efficiency</div>
                  <div>
                    <span className="tv" id="arc-reff">{formatNum(res.eff, 1)}</span>
                    <span className="tu">%</span>
                  </div>
                  <div className="tn" id="arc-rcls">{res.db.rating}</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Recovery Rate</div>
                  <div>
                    <span className="tv" id="arc-rrec">{formatNum(res.recovRate, 1)}</span>
                    <span className="tu">%</span>
                  </div>
                  <div className="tn" id="arc-rrecx">{formatNum(res.recovVal, 0)} kg / {formatNum(res.freshVal, 0)} kg</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Waste Percentage</div>
                  <div>
                    <span className="tv" id="arc-rwstp">{formatNum(res.wastePct, 1)}</span>
                    <span className="tu">%</span>
                  </div>
                  <div className="tn" id="arc-rwstn">{formatNum(res.wasteKg, 0)} kg total waste</div>
                </div>

                <div className="tile tg">
                  <div className="tl">Fresh Makeup Required</div>
                  <div>
                    <span className="tv" id="arc-rmk">{formatNum(res.makeup, 1)}</span>
                    <span className="tu">kg</span>
                  </div>
                  <div className="tn" id="arc-rmkn">To restore full charge</div>
                </div>
              </div>

              {/* Secondary Breakdown */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Fresh Charged</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{formatNum(res.freshVal, 0)}<span className="tu">kg</span></div>
                </div>

                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Recovered</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{formatNum(res.recovVal, 0)}<span className="tu">kg</span></div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Reusable</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{formatNum(res.reusable, 1)}<span className="tu">kg</span></div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Rejected</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{formatNum(res.rejected, 1)}<span className="tu">kg</span></div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Waste + Dust</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{formatNum(res.wasteKg, 1)}<span className="tu">kg</span></div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Consumption</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{res.cons !== null ? `${formatNum(res.cons, 2)} kg/m²` : '—'}</div>
                </div>
              </div>

              {/* Financial Savings Tiles */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Fresh Abrasive Cost (Makeup)</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{res.freshCost !== null ? formatCur(res.freshCost) : '—'}</div>
                </div>

                <div className="tile tp" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Estimated Cost Saving vs Expendable Use</div>
                  <div className="tv" style={{ fontSize: '20px' }}>{res.saving !== null ? formatCur(res.saving) : '—'}</div>
                </div>
              </div>

              {/* Mass Balance Flow */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Abrasive Mass Balance
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                  <div style={{ flex: 1, minWidth: '110px', background: '#F1F5F9', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #64748B' }}>
                    <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>1 · CHARGED</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>{res.freshVal} kg</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '110px', background: '#EFF6FF', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #3B82F6' }}>
                    <div style={{ fontSize: '9px', color: '#3B82F6', fontWeight: 600 }}>2 · RECOVERED</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1E3A8A', marginTop: '2px' }}>{res.recovVal} kg</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '110px', background: '#ECFDF5', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                    <div style={{ fontSize: '9px', color: '#10B981', fontWeight: 600 }}>3 · REUSABLE</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#064E3B', marginTop: '2px' }}>{formatNum(res.reusable, 1)} kg</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '110px', background: '#FEF2F2', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #EF4444' }}>
                    <div style={{ fontSize: '9px', color: '#EF4444', fontWeight: 600 }}>4 · REJECT / DUST</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#7F1D1D', marginTop: '2px' }}>{formatNum(res.wasteKg + res.rejected, 1)} kg</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '110px', background: '#FFFBEB', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #F59E0B' }}>
                    <div style={{ fontSize: '9px', color: '#F59E0B', fontWeight: 600 }}>5 · MAKEUP</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#78350F', marginTop: '2px' }}>{formatNum(res.makeup, 1)} kg</div>
                  </div>
                </div>
              </div>

              {/* Input Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Abrasive Recycling Summary</div>
                <div className="dr"><span className="dk">Abrasive Type</span><span className="dv">{res.type} ({res.db.rating})</span></div>
                <div className="dr"><span className="dk">Expected Recyclability</span><span className="dv">{res.db.life} Cycles (Breakdown ~{res.db.brk}%/pass)</span></div>
                <div className="dr"><span className="dk">Current Cycles Run</span><span className="dv">{res.cycVal} Cycles</span></div>
                <div className="dr"><span className="dk">Bulk Density / Hardness</span><span className="dv">{res.db.den} · {res.db.hard}</span></div>
                <div className="dr"><span className="dk">Net Consumption</span><span className="dv">{res.cons !== null ? `${formatNum(res.cons, 2)} kg/m²` : '—'}</span></div>
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> ISO 11124 (Metallic Abrasives) · ISO 11126 (Non-Metallic Abrasives) · SSPC-AB 1 / AB 2 / AB 3 · AMPP Standards. Always monitor operating mix grain size distribution per ASTM D4570 / ISO 11125-2.
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-share" onClick={handleShare}>📤 Share Text</button>
              <button className="btn-print" onClick={handlePrint}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting recycling performance...', 'info')}>
                📊 Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
