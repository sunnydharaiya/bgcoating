import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { ABRASIVE_DB } from '../../utils/standardsDatabase';
import { formatNum } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function BlastProfileTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // A · Project Info
  const [proj, setProj] = useState('Jetty Piping Package');
  const [cli, setCli] = useState('Adani Ports');
  const [str, setStr] = useState('Pipe Rack PR-03');

  // B · Abrasive Selection
  const [type, setType] = useState('Steel Grit');
  const [grade, setGrade] = useState('G16');
  const [grade2, setGrade2] = useState('S280');
  const [mixGrit, setMixGrit] = useState('70');

  // C · Operating Parameters
  const [pressure, setPressure] = useState('7');
  const [nozzle, setNozzle] = useState('9.5');
  const [ntype, setNtype] = useState('Venturi');
  const [standoff, setStandoff] = useState('450');
  const [angle, setAngle] = useState('90');
  const [surface, setSurface] = useState('New Steel');
  const [hardness, setHardness] = useState('Standard (< 200 HB)');

  // D · Target Profile
  const [targetMin, setTargetMin] = useState('50');
  const [targetMax, setTargetMax] = useState('75');

  const [res, setRes] = useState(null);

  const isMix = type === 'Steel Grit + Steel Shot Mix';

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    if (newType === 'Steel Grit') setGrade('G16');
    else if (newType === 'Steel Shot') setGrade('S280');
    else if (newType === 'Garnet') setGrade('30/60 Mesh');
    else if (newType === 'Copper Slag') setGrade('0.5–1.5 mm');
    else if (newType === 'Coal Slag') setGrade('0.5–1.5 mm');
  };

  const handleCalculate = () => {
    const prVal = parseFloat(pressure);
    const nozVal = parseFloat(nozzle);
    const soVal = parseFloat(standoff);
    const angVal = parseFloat(angle);

    if (!prVal || !nozVal || !soVal || !angVal) {
      addToast('Missing Required Inputs', 'Please fill Pressure, Nozzle Diameter, Stand-off, and Blast Angle.', 'warning');
      return;
    }

    let pRange, d1, gradeLbl, prRec, consRange, saStd, coatDb;
    if (isMix) {
      const mix = Math.min(100, Math.max(0, parseFloat(mixGrit) || 70)) / 100;
      const dg = ABRASIVE_DB['Steel Grit']?.grades[grade];
      const ds = ABRASIVE_DB['Steel Shot']?.grades[grade2];
      if (!dg || !ds) {
        addToast('Selection Error', 'Select valid grit and shot grades.', 'warning');
        return;
      }
      pRange = [dg.p[0] * mix + ds.p[0] * (1 - mix), dg.p[1] * mix + ds.p[1] * (1 - mix)];
      prRec = [Math.min(dg.pr[0], ds.pr[0]), Math.max(dg.pr[1], ds.pr[1])];
      consRange = [dg.cons[0] * mix + ds.cons[0] * (1 - mix), dg.cons[1] * mix + ds.cons[1] * (1 - mix)];
      saStd = dg.sa;
      coatDb = dg.coat;
      gradeLbl = `${grade} + ${grade2} (${Math.round(mix * 100)}/${Math.round((1 - mix) * 100)})`;
    } else {
      d1 = ABRASIVE_DB[type]?.grades[grade];
      if (!d1) {
        addToast('Selection Error', 'Select an abrasive grade.', 'warning');
        return;
      }
      pRange = [d1.p[0], d1.p[1]];
      prRec = d1.pr;
      consRange = d1.cons;
      saStd = d1.sa;
      coatDb = d1.coat;
      gradeLbl = grade;
    }

    const base = (pRange[0] + pRange[1]) / 2;

    // Adjustment factors
    const fPr = Math.max(0.8, Math.min(1.2, 1 + (prVal - 7) * 0.03));
    const fNoz = Math.max(0.95, Math.min(1.08, 1 + (nozVal - 9.5) * 0.008));
    const fNt = ntype === 'Venturi' ? 1.05 : 0.95;
    const fSo = Math.max(0.75, Math.min(1.08, 1 - (soVal - 450) / 450 * 0.15));
    const fAng = Math.max(0.7, Math.min(1, 1 - (90 - angVal) / 90 * 0.35));
    const fSurf = surface === 'Rusted Steel' ? 1.05 : surface === 'Old Coating' ? 0.95 : 1;
    const fHard = hardness.includes('Very Hard') ? 0.85 : hardness.includes('Hard') ? 0.92 : 1;

    const F = fPr * fNoz * fNt * fSo * fAng * fSurf * fHard;

    const expectedProfile = base * F;
    const minProf = pRange[0] * F;
    const maxProf = pRange[1] * F;

    // ISO 8503 comparator grade
    const isoComp = expectedProfile < 50 ? 'Fine (G / S)' : expectedProfile <= 85 ? 'Medium (G / S)' : 'Coarse (G / S)';

    // Dead volume paint loss
    const deadVol = Math.round(expectedProfile * 0.5);

    // Profile correction value for ISO 19840
    const cv = expectedProfile < 60 ? 10 : expectedProfile <= 100 ? 25 : 40;

    // Recommended DFT Range (min 3x profile)
    const minDft = Math.round(expectedProfile * 3);
    const maxDft = Math.round(expectedProfile * 5);

    // Productivity & Consumption
    const avgCons = ((consRange[0] + consRange[1]) / 2).toFixed(1);
    const avgProd = (18 * (nozVal / 9.5) * (prVal / 7)).toFixed(1);

    // Target Check
    const tMin = parseFloat(targetMin);
    const tMax = parseFloat(targetMax);
    let targetVerdict = null;
    if (tMin && tMax) {
      if (expectedProfile >= tMin && expectedProfile <= tMax) {
        targetVerdict = { pass: true, label: `✅ Within Target (${tMin}–${tMax} µm)`, color: '#2E7D32', bg: '#E8F5E9' };
      } else if (expectedProfile < tMin) {
        targetVerdict = { pass: false, label: `⚠️ Below Target (${formatNum(expectedProfile, 0)} µm vs min ${tMin} µm)`, color: '#8B4500', bg: '#FFF8E1' };
      } else {
        targetVerdict = { pass: false, label: `❌ Exceeds Target (${formatNum(expectedProfile, 0)} µm vs max ${tMax} µm)`, color: '#C62828', bg: '#FFEBEE' };
      }
    }

    setRes({
      expectedProfile,
      minProf,
      maxProf,
      isoComp,
      deadVol,
      cv,
      minDft,
      maxDft,
      avgCons,
      avgProd,
      targetVerdict,
      gradeLbl,
      saStd,
      coatDb,
      recy: ABRASIVE_DB[type]?.recy || 'Expendable (1× pass)',
      factors: [
        { label: 'Pressure Factor', val: fPr.toFixed(3) },
        { label: 'Nozzle Type Factor', val: fNt.toFixed(2) },
        { label: 'Stand-off Factor', val: fSo.toFixed(3) },
        { label: 'Angle Factor', val: fAng.toFixed(3) },
        { label: 'Substrate Factor', val: fHard.toFixed(2) }
      ]
    });
    addToast('Profile Predicted', 'Blast profile anchor pattern computed.', 'success');

    // Auto-save to calculation audit log
    autoLogCalculation({
      tool_id: 'pro-abp',
      tool_name: 'Abrasive Size & Blast Profile Prediction',
      category: 'pro',
      inputs: {
        project: proj,
        client: cli,
        structure: str,
        abrasive_type: type,
        abrasive_grade: grade,
        mix_grit_pct: isMix ? mixGrit : null,
        blast_pressure_bar: prVal,
        nozzle_dia_mm: nozVal,
        nozzle_type: ntype,
        standoff_distance_mm: soVal,
        blast_angle_deg: angVal,
        substrate_condition: surface,
        substrate_hardness: hardness,
        target_profile_min_um: parseFloat(targetMin) || 0,
        target_profile_max_um: parseFloat(targetMax) || 0
      },
      results: {
        predicted_profile_um: expectedProfile,
        profile_range_min_um: minProf,
        profile_range_max_um: maxProf,
        iso_comparator: isoComp,
        dead_volume_loss_l_m2: deadVol,
        target_verdict: targetVerdict ? targetVerdict.label : 'N/A'
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (log && (log.tool_id === 'pro-abp' || log.tool_id === 'blast_profile' || log.tool_id === 'pro_abp' || log.tool_id === 'blasting_media_pro')) {
        if (log.inputs) {
          if (log.inputs.project !== undefined) setProj(log.inputs.project);
          if (log.inputs.client !== undefined) setCli(log.inputs.client);
          if (log.inputs.structure !== undefined) setStr(log.inputs.structure);
          if (log.inputs.abrasive_type !== undefined) setType(log.inputs.abrasive_type);
          if (log.inputs.abrasive_grade !== undefined) setGrade(log.inputs.abrasive_grade);
          if (log.inputs.mix_grit_pct !== undefined && log.inputs.mix_grit_pct !== null) setMixGrit(String(log.inputs.mix_grit_pct));
          if (log.inputs.blast_pressure_bar !== undefined) setPressure(String(log.inputs.blast_pressure_bar));
          if (log.inputs.nozzle_dia_mm !== undefined) setNozzle(String(log.inputs.nozzle_dia_mm));
          if (log.inputs.nozzle_type !== undefined) setNtype(log.inputs.nozzle_type);
          if (log.inputs.standoff_distance_mm !== undefined) setStandoff(String(log.inputs.standoff_distance_mm));
          if (log.inputs.blast_angle_deg !== undefined) setAngle(String(log.inputs.blast_angle_deg));
          if (log.inputs.substrate_condition !== undefined) setSurface(log.inputs.substrate_condition);
          if (log.inputs.substrate_hardness !== undefined) setHardness(log.inputs.substrate_hardness);
          if (log.inputs.target_profile_min_um !== undefined) setTargetMin(String(log.inputs.target_profile_min_um));
          if (log.inputs.target_profile_max_um !== undefined) setTargetMax(String(log.inputs.target_profile_max_um));
        }
        if (log.results) {
          setRes({
            expectedProfile: log.results.predicted_profile_um,
            minProf: log.results.profile_range_min_um,
            maxProf: log.results.profile_range_max_um,
            isoComp: log.results.iso_comparator,
            deadVol: log.results.dead_volume_loss_l_m2,
            cv: 0,
            minDft: 0,
            maxDft: 0,
            avgCons: 0,
            avgProd: 0,
            targetVerdict: { pass: true, label: log.results.target_verdict || 'Target Achieved', color: '#1B5E20', bg: '#E8F5E9' },
            gradeLbl: log.inputs?.abrasive_grade || '',
            saStd: 'Sa 2.5',
            coatDb: null,
            recy: 'Recyclable',
            factors: []
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
    setGrade('G16');
    setGrade2('S280');
    setMixGrit('70');
    setPressure('7');
    setNozzle('9.5');
    setNtype('Venturi');
    setStandoff('450');
    setAngle('90');
    setSurface('New Steel');
    setHardness('Standard (< 200 HB)');
    setTargetMin('50');
    setTargetMax('75');
    setRes(null);
    addToast('Form Reset', 'Parameters have been cleared.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Abrasive Size & Blast Profile Analysis
Project: ${proj || '—'} | Structure: ${str || '—'}
Abrasive: ${type} (${res.gradeLbl}) @ ${pressure} bar (Nozzle: Ø${nozzle} mm ${ntype})
--------------------------------------------------
Expected Anchor Profile: ${formatNum(res.expectedProfile, 0)} µm (${formatNum(res.minProf, 0)}–${formatNum(res.maxProf, 0)} µm)
ISO 8503 Comparator Grade: ${res.isoComp}
Recommended Minimum DFT: ${res.minDft}–${res.maxDft} µm
Dead Volume Paint Loss: ~${res.deadVol} µm
ISO 19840 Correction Value: +${res.cv} µm
Estimated Consumption: ${res.avgCons} kg/m² | Productivity: ${res.avgProd} m²/hr`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'Blast profile summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="pro-abp">
      <div className="ch">
        <div className="ci">🪨</div>
        <div>
          <div className="ct">Abrasive Size &amp; Blast Profile Calculator</div>
          <div className="cs">Predict achievable anchor profile from abrasive type, grade, pressure &amp; operating parameters — ISO 8503 / ASTM D4417</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('pro-abp')}>📖 Guideline</button>
        <div className="ctag">PRO · ABP-1</div>
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
                  id="abp-proj" 
                  placeholder="e.g. Jetty Piping Package" 
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
                  id="abp-cli" 
                  placeholder="e.g. Adani Ports" 
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
                  id="abp-str" 
                  placeholder="e.g. Pipe Rack PR-03" 
                  value={str} 
                  onChange={(e) => setStr(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Abrasive Selection
          </div>
          <div className="g2">
            <div className="field">
              <label>Abrasive Type</label>
              <div className="iw">
                <select 
                  id="abp-type" 
                  value={type} 
                  onChange={handleTypeChange}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Steel Grit</option>
                  <option>Steel Shot</option>
                  <option>Steel Grit + Steel Shot Mix</option>
                  <option>Garnet</option>
                  <option>Copper Slag</option>
                  <option>Coal Slag</option>
                </select>
              </div>
            </div>

            <div className="field" id="abp-f-grade">
              <label>Abrasive Grade / Mesh Size</label>
              <div className="iw">
                <select 
                  id="abp-grade" 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  {type === 'Steel Grit' && (
                    <>
                      <option value="G10">G10 — 100–150 µm (2.0–2.8 mm)</option>
                      <option value="G12">G12 — 85–125 µm (1.7–2.4 mm)</option>
                      <option value="G14">G14 — 75–100 µm (1.4–2.0 mm)</option>
                      <option value="G16">G16 — 70–90 µm (1.2–1.7 mm)</option>
                      <option value="G18">G18 — 60–80 µm (1.0–1.4 mm)</option>
                      <option value="G25">G25 — 50–70 µm (0.7–1.2 mm)</option>
                      <option value="G40">G40 — 40–60 µm (0.4–0.7 mm)</option>
                      <option value="G50">G50 — 30–50 µm (0.3–0.4 mm)</option>
                      <option value="G80">G80 — 20–40 µm (0.2–0.3 mm)</option>
                    </>
                  )}
                  {type === 'Steel Shot' && (
                    <>
                      <option value="S780">S780 — 90–120 µm (2.0 mm)</option>
                      <option value="S660">S660 — 75–105 µm (1.7 mm)</option>
                      <option value="S550">S550 — 65–90 µm (1.4 mm)</option>
                      <option value="S390">S390 — 55–75 µm (1.0 mm)</option>
                      <option value="S330">S330 — 45–65 µm (0.8 mm)</option>
                      <option value="S280">S280 — 40–55 µm (0.7 mm)</option>
                      <option value="S230">S230 — 35–45 µm (0.6 mm)</option>
                      <option value="S170">S170 — 25–35 µm (0.4 mm)</option>
                    </>
                  )}
                  {type === 'Garnet' && (
                    <>
                      <option value="12/24 Mesh">12/24 Mesh — 75–110 µm (1.0–1.7 mm)</option>
                      <option value="20/40 Mesh">20/40 Mesh — 60–90 µm (0.5–1.0 mm)</option>
                      <option value="30/60 Mesh">30/60 Mesh — 50–75 µm (0.25–0.6 mm)</option>
                      <option value="80 Mesh">80 Mesh — 35–55 µm (0.18–0.35 mm)</option>
                      <option value="120 Mesh">120 Mesh — 20–35 µm (0.10–0.25 mm)</option>
                    </>
                  )}
                  {(type === 'Copper Slag' || type === 'Coal Slag') && (
                    <>
                      <option value="1.0–2.5 mm">1.0–2.5 mm — 75–115 µm (Coarse)</option>
                      <option value="0.5–1.5 mm">0.5–1.5 mm — 55–85 µm (Medium)</option>
                      <option value="0.2–1.0 mm">0.2–1.0 mm — 35–55 µm (Fine)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {isMix && (
              <>
                <div className="field" id="abp-f-grade2">
                  <label>Shot Grade (for Mix)</label>
                  <div className="iw">
                    <select 
                      id="abp-grade2" 
                      value={grade2} 
                      onChange={(e) => setGrade2(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="S390">S390 — 1.0 mm</option>
                      <option value="S330">S330 — 0.8 mm</option>
                      <option value="S280">S280 — 0.7 mm</option>
                      <option value="S230">S230 — 0.6 mm</option>
                    </select>
                  </div>
                </div>

                <div className="field" id="abp-f-mix">
                  <label>Mix Ratio — Grit Share <span className="lh">%</span></label>
                  <div className="iw">
                    <input 
                      type="number" 
                      id="abp-mix" 
                      value={mixGrit} 
                      min="0" 
                      max="100" 
                      step="5" 
                      onChange={(e) => setMixGrit(e.target.value)} 
                    />
                    <span className="uu">% grit</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section C */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Operating Parameters
          </div>
          <div className="g2">
            <div className="field">
              <label>Blast Pressure <span className="lh">bar at nozzle</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="abp-pr" 
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
              <label>Nozzle Diameter <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="abp-noz" 
                  value={nozzle} 
                  min="4" 
                  max="19" 
                  step="any" 
                  onChange={(e) => setNozzle(e.target.value)} 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Nozzle Type</label>
              <div className="iw">
                <select 
                  id="abp-ntype" 
                  value={ntype} 
                  onChange={(e) => setNtype(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Venturi</option>
                  <option>Straight</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Stand-off Distance <span className="lh">mm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="abp-so" 
                  value={standoff} 
                  min="100" 
                  max="1200" 
                  step="any" 
                  onChange={(e) => setStandoff(e.target.value)} 
                />
                <span className="uu">mm</span>
              </div>
            </div>

            <div className="field">
              <label>Blast Angle <span className="lh">° to surface</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="abp-ang" 
                  value={angle} 
                  min="30" 
                  max="90" 
                  step="any" 
                  onChange={(e) => setAngle(e.target.value)} 
                />
                <span className="uu">°</span>
              </div>
            </div>

            <div className="field">
              <label>Surface Condition</label>
              <div className="iw">
                <select 
                  id="abp-surf" 
                  value={surface} 
                  onChange={(e) => setSurface(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>New Steel</option>
                  <option>Rusted Steel</option>
                  <option>Old Coating</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Steel Hardness <span className="lh">optional</span></label>
              <div className="iw">
                <select 
                  id="abp-hard" 
                  value={hardness} 
                  onChange={(e) => setHardness(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option>Standard (&lt; 200 HB)</option>
                  <option>Hard (200–300 HB)</option>
                  <option>Very Hard (&gt; 300 HB)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section D */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            D · Specified Target Profile (optional — enables warnings)
          </div>
          <div className="g2">
            <div className="field">
              <label>Target Profile — Min <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="abp-tmin" 
                  placeholder="e.g. 50" 
                  value={targetMin} 
                  onChange={(e) => setTargetMin(e.target.value)} 
                />
                <span className="uu">µm</span>
              </div>
            </div>

            <div className="field">
              <label>Target Profile — Max <span className="lh">µm</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="abp-tmax" 
                  placeholder="e.g. 75" 
                  value={targetMax} 
                  onChange={(e) => setTargetMax(e.target.value)} 
                />
                <span className="uu">µm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Predict Blast Profile</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {res && (
          <div className="res show" id="r-abp">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Predicted Blast Profile</div>

              {res.targetVerdict && (
                <div style={{ background: res.targetVerdict.bg, border: `1.5px solid ${res.targetVerdict.color}40`, borderRadius: 'var(--r)', padding: '12px 16px', textAlign: 'center', marginBottom: '10px' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '18px', fontWeight: 700, color: res.targetVerdict.color }}>
                    {res.targetVerdict.label}
                  </div>
                </div>
              )}

              {/* Primary Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Expected Surface Profile</div>
                  <div>
                    <span className="tv" id="abp-r">{formatNum(res.expectedProfile, 0)}</span>
                    <span className="tu">µm</span>
                  </div>
                  <div className="tn" id="abp-rrange">{formatNum(res.minProf, 0)}–{formatNum(res.maxProf, 0)} µm typical</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Classification</div>
                  <div>
                    <span className="tv" style={{ fontSize: '22px' }} id="abp-rcls">{res.isoComp}</span>
                  </div>
                  <div className="tn" id="abp-riso">ISO 8503-1 Comparator</div>
                </div>

                <div className="tile ti">
                  <div className="tl">Abrasive Consumption</div>
                  <div>
                    <span className="tv" id="abp-rcons">{res.avgCons}</span>
                    <span className="tu">kg/m²</span>
                  </div>
                  <div className="tn" id="abp-rrecy">{res.recy}</div>
                </div>

                <div className="tile tg">
                  <div className="tl">Blasting Productivity</div>
                  <div>
                    <span className="tv" id="abp-rprod">{res.avgProd}</span>
                    <span className="tu">m²/hr</span>
                  </div>
                  <div className="tn" id="abp-rsa">{res.saStd}</div>
                </div>
              </div>

              {/* Secondary Tiles */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Recommended DFT Range</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{res.minDft}–{res.maxDft} µm</div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>ISO 19840 Profile Correction (add to DFT)</div>
                  <div className="tv" style={{ fontSize: '19px' }}>+{res.cv} µm</div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Extra Paint due to Profile (dead volume)</div>
                  <div className="tv" style={{ fontSize: '19px' }}>~{res.deadVol} µm</div>
                </div>
              </div>

              {/* Adjustment Factors */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>
                  Adjustment Factors Applied
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {res.factors.map((f, i) => (
                    <div key={i} style={{ background: '#F1F5F9', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', color: '#475569' }}>
                      <strong>{f.label}:</strong> {f.val}
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Blast Profile Analysis Summary</div>
                <div className="dr"><span className="dk">Abrasive</span><span className="dv">{type} ({res.gradeLbl})</span></div>
                <div className="dr"><span className="dk">Pressure &amp; Nozzle</span><span className="dv">{pressure} bar · Ø{nozzle} mm ({ntype})</span></div>
                <div className="dr"><span className="dk">Angle &amp; Stand-off</span><span className="dv">{angle}° · {standoff} mm</span></div>
                <div className="dr"><span className="dk">Substrate Hardness</span><span className="dv">{hardness}</span></div>
                <div className="dr"><span className="dk">Compatible Paint Type</span><span className="dv">{res.coatDb}</span></div>
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> ISO 8501 (Cleanliness) · ISO 8503 (Profile) · ASTM D4417 · SSPC-SP Series · AMPP/NACE Surface Prep Guidelines. <strong>Note:</strong> Predicted values are engineering estimates — always verify profile on site with replica tape or stylus gauge per ASTM D4417 / ISO 8503-5.
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-share" onClick={handleShare}>📤 Share Text</button>
              <button className="btn-print" onClick={handlePrint}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting blast profile report...', 'info')}>
                📊 Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
