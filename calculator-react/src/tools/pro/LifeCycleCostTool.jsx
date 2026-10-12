import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

function lccClass(cl) {
  if (cl >= 25) return 'Very High Durability (VH · >25 yrs)';
  if (cl >= 15) return 'High Durability (H · 15–25 yrs)';
  if (cl >= 7) return 'Medium Durability (M · 7–15 yrs)';
  return 'Low Durability (L · <7 yrs)';
}

export default function LifeCycleCostTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // A · Project Info
  const [proj, setProj] = useState('Crude Tank Farm Phase-2');
  const [asset, setAsset] = useState('Tank T-201 External Shell');
  const [client, setClient] = useState('ONGC');
  const [loc, setLoc] = useState('Hazira, Gujarat');
  const [env, setEnv] = useState('C5 — Very High (Industrial / Marine)');
  const [sys, setSys] = useState('Zn Silicate + Epoxy + PU');

  // B · Asset Details
  const [area, setArea] = useState('5000');
  const [dl, setDl] = useState('25');
  const [cl, setCl] = useState('15');
  const [rcyc, setRcyc] = useState('');

  // C · Initial Coating Cost
  const [cPaint, setCPaint] = useState('400000');
  const [cPrep, setCPrep] = useState('250000');
  const [cLab, setCLab] = useState('200000');
  const [cEqp, setCEqp] = useState('0');
  const [cScf, setCScf] = useState('0');
  const [cIns, setCIns] = useState('0');
  const [cOth, setCOth] = useState('0');

  // D · Maintenance Details
  const [insi, setInsi] = useState('2');
  const [insc, setInsc] = useState('25000');
  const [rmi, setRmi] = useState('5');
  const [rmc, setRmc] = useState('150000');
  const [rpi, setRpi] = useState('8');
  const [rpc, setRpc] = useState('300000');
  const [recc, setRecc] = useState('900000');

  // E · Economic Factors
  const [inf, setInf] = useState('0');
  const [dis, setDis] = useState('6');
  const [esc, setEsc] = useState('0');

  // F · Optional Cost Elements
  const [shut, setShut] = useState('0');
  const [acc, setAcc] = useState('0');
  const [wst, setWst] = useState('0');
  const [env2, setEnv2] = useState('0');
  const [saf, setSaf] = useState('0');

  // Comparison State
  const [comparisonList, setComparisonList] = useState([]);
  const [res, setRes] = useState(null);

  const handleCalculate = () => {
    const areaVal = parseFloat(area);
    const dlVal = parseFloat(dl);
    const clVal = parseFloat(cl);

    if (!areaVal || !dlVal || !clVal) {
      addToast('Missing Required Inputs', 'Please fill Surface Area, Design Life and Expected Service Life.', 'warning');
      return;
    }

    const ini = (parseFloat(cPaint) || 0) + (parseFloat(cPrep) || 0) + (parseFloat(cLab) || 0) + 
                (parseFloat(cEqp) || 0) + (parseFloat(cScf) || 0) + (parseFloat(cIns) || 0) + (parseFloat(cOth) || 0);

    if (ini <= 0) {
      addToast('Missing Cost', 'Please enter at least one Initial Coating Cost component.', 'warning');
      return;
    }

    const insiVal = parseFloat(insi) || 0;
    const inscVal = parseFloat(insc) || 0;
    const rmiVal = parseFloat(rmi) || 0;
    const rmcVal = parseFloat(rmc) || 0;
    const rpiVal = parseFloat(rpi) || 0;
    const rpcVal = parseFloat(rpc) || 0;
    const reccVal = parseFloat(recc) || 0;

    const nIns = insiVal > 0 ? Math.floor(dlVal / insiVal) : 0;
    const nRm = rmiVal > 0 ? Math.floor(dlVal / rmiVal) : 0;
    const nRp = rpiVal > 0 ? Math.floor(dlVal / rpiVal) : 0;
    const nRec = rcyc !== '' ? Math.max(0, parseInt(rcyc, 10) || 0) : Math.max(0, Math.ceil(dlVal / clVal) - 1);

    const cInsTot = nIns * inscVal;
    const cRmTot = nRm * rmcVal;
    const cRpTot = nRp * rpcVal;
    const cRecTot = nRec * reccVal;

    const shutTot = (parseFloat(shut) || 0) * nRec;
    const dispTot = (parseFloat(wst) || 0) + (parseFloat(env2) || 0);
    const otherTot = (parseFloat(acc) || 0) + (parseFloat(saf) || 0);

    const lcc = ini + cInsTot + cRmTot + cRpTot + cRecTot + shutTot + dispTot + otherTot;
    const ann = lcc / dlVal;
    const perM2 = lcc / areaVal;

    // Discounted NPV
    const infVal = parseFloat(inf) || 0;
    const disVal = parseFloat(dis) || 0;
    const escVal = parseFloat(esc) || 0;
    const grow = (infVal + escVal) / 100;
    const drate = disVal / 100;

    let npv = null;
    if (drate > 0) {
      const pv = (base, t) => base * Math.pow(1 + grow, t) / Math.pow(1 + drate, t);
      npv = ini + dispTot + otherTot;
      if (insiVal > 0) {
        for (let t = insiVal; t <= dlVal; t += insiVal) npv += pv(inscVal, t);
      }
      if (rmiVal > 0) {
        for (let t = rmiVal; t <= dlVal; t += rmiVal) npv += pv(rmcVal, t);
      }
      if (rpiVal > 0) {
        for (let t = rpiVal; t <= dlVal; t += rpiVal) npv += pv(rpcVal, t);
      }
      if (nRec > 0) {
        for (let i = 1; i <= nRec; i++) {
          const t = Math.min(i * clVal, dlVal - 0.01);
          npv += pv(reccVal + (parseFloat(shut) || 0), t);
        }
      }
    }

    const cls = lccClass(clVal);
    const isLong = clVal >= 20;
    const isMed = clVal >= 10 && clVal < 20;
    const g = isLong 
      ? { bg: '#E8F5E9', bd: 'rgba(46,125,50,.35)', c1: '#1B5E20', c2: '#2E7D32', ic: '🏆' }
      : isMed 
        ? { bg: '#E3F2FD', bd: 'rgba(21,101,192,.35)', c1: '#0D47A1', c2: '#1565C0', ic: '🔵' }
        : { bg: '#FFF8E1', bd: 'rgba(245,127,23,.4)', c1: '#8B4500', c2: '#B26A00', ic: '⚠️' };

    setRes({
      areaVal,
      dlVal,
      clVal,
      ini,
      nIns,
      nRm,
      nRp,
      nRec,
      cInsTot,
      cRmTot,
      cRpTot,
      cRecTot,
      shutTot,
      dispTot,
      otherTot,
      lcc,
      ann,
      perM2,
      npv,
      cls,
      g,
      sys: sys || 'Coating System',
      proj,
      asset
    });
    addToast('Life Cycle Cost Evaluated', 'Total ownership cost and NPV calculated.', 'success');
  };

  const handleReset = () => {
    setProj('');
    setAsset('');
    setClient('');
    setLoc('');
    setEnv('');
    setSys('');
    setArea('');
    setDl('25');
    setCl('15');
    setRcyc('');
    setCPaint('');
    setCPrep('');
    setCLab('');
    setCEqp('0');
    setCScf('0');
    setCIns('0');
    setCOth('0');
    setInsi('2');
    setInsc('25000');
    setRmi('5');
    setRmc('150000');
    setRpi('8');
    setRpc('300000');
    setRecc('900000');
    setInf('0');
    setDis('6');
    setEsc('0');
    setShut('0');
    setAcc('0');
    setWst('0');
    setEnv2('0');
    setSaf('0');
    setRes(null);
    addToast('Form Reset', 'Parameters cleared.', 'info');
  };

  const addCompare = () => {
    if (!res) {
      addToast('No Result', 'Please calculate a system first.', 'warning');
      return;
    }
    if (comparisonList.length >= 3) {
      addToast('Comparison Full', 'Maximum 3 systems can be compared.', 'info');
      return;
    }
    setComparisonList(prev => [...prev, { ...res, name: res.sys }]);
    addToast('System Added', `${res.sys} added to comparison table.`, 'success');
  };

  const clearCompare = () => {
    setComparisonList([]);
    addToast('Comparison Cleared', 'Table reset.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!res) return;
    const text = `BG CoatingOS™ — Life Cycle Cost Analysis
System: ${res.sys} | Asset: ${res.asset}
Area: ${res.areaVal} m² | Design Life: ${res.dlVal} yrs | Service Life: ${res.clVal} yrs
--------------------------------------------------
Total Life Cycle Cost: ${formatCur(res.lcc)}
Annualized Cost: ${formatCur(res.ann)}/yr
LCC per m²: ${formatCur(res.perM2)}/m²
${res.npv !== null ? `NPV (Discounted): ${formatCur(res.npv)}` : ''}
Initial Capex: ${formatCur(res.ini)}
Recoating Cost (${res.nRec} cycles): ${formatCur(res.cRecTot)}`;

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', 'LCC summary copied.', 'success');
  };

  return (
    <div className="sub-sec card active" id="pro-lcc">
      <div className="ch">
        <div className="ci">💹</div>
        <div>
          <div className="ct">Coating Life Cycle Cost (LCC) Calculator</div>
          <div className="cs">Total Cost of Ownership over asset design life — initial + inspection + maintenance + repair + recoating</div>
        </div>
        <button className="gd-btn" onClick={() => openGuideline('pro-lcc')}>📖 Guideline</button>
        <div className="ctag">PRO · LCC-1</div>
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
                  id="lcc-proj" 
                  placeholder="e.g. Crude Tank Farm Phase-2" 
                  value={proj} 
                  onChange={(e) => setProj(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Asset Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="lcc-asset" 
                  placeholder="e.g. Tank T-201 External Shell" 
                  value={asset} 
                  onChange={(e) => setAsset(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Client <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="lcc-cli" 
                  placeholder="e.g. ONGC" 
                  value={client} 
                  onChange={(e) => setClient(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Location <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="lcc-loc" 
                  placeholder="e.g. Hazira, Gujarat" 
                  value={loc} 
                  onChange={(e) => setLoc(e.target.value)} 
                />
              </div>
            </div>

            <div className="field">
              <label>Environment (ISO 12944) <span className="lh">C1–CX / Im1–Im4</span></label>
              <div className="iw">
                <select 
                  id="lcc-env" 
                  value={env} 
                  onChange={(e) => setEnv(e.target.value)} 
                  style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                >
                  <option value="">— Select —</option>
                  <option>C1 — Very Low (Heated interiors)</option>
                  <option>C2 — Low (Rural)</option>
                  <option>C3 — Medium (Urban / Industrial)</option>
                  <option>C4 — High (Industrial / Coastal)</option>
                  <option>C5 — Very High (Industrial / Marine)</option>
                  <option>CX — Extreme (Offshore / Tropical)</option>
                  <option>Im1 — Fresh Water Immersion</option>
                  <option>Im2 — Sea / Brackish Water Immersion</option>
                  <option>Im3 — Buried Soil</option>
                  <option>Im4 — Cathodic Protection Immersion</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Coating System Name <span className="lh">optional</span></label>
              <div className="iw">
                <input 
                  type="text" 
                  id="lcc-sys" 
                  placeholder="e.g. Zn Silicate + Epoxy + PU" 
                  value={sys} 
                  onChange={(e) => setSys(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            B · Asset Details
          </div>
          <div className="g2">
            <div className="field">
              <label>Surface Area <span className="lh">m²</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-area" 
                  placeholder="e.g. 5000" 
                  min="0" 
                  step="any" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)} 
                />
                <span className="uu">m²</span>
              </div>
            </div>

            <div className="field">
              <label>Design Life of Asset <span className="lh">years</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-dl" 
                  placeholder="e.g. 25" 
                  min="1" 
                  step="any" 
                  value={dl} 
                  onChange={(e) => setDl(e.target.value)} 
                />
                <span className="uu">yrs</span>
              </div>
            </div>

            <div className="field">
              <label>Expected Coating Service Life <span className="lh">years</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-cl" 
                  placeholder="e.g. 15" 
                  min="1" 
                  step="any" 
                  value={cl} 
                  onChange={(e) => setCl(e.target.value)} 
                />
                <span className="uu">yrs</span>
              </div>
            </div>

            <div className="field">
              <label>Recoating Cycles <span className="lh">blank = auto</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-rcyc" 
                  placeholder="Auto" 
                  min="0" 
                  step="1" 
                  value={rcyc} 
                  onChange={(e) => setRcyc(e.target.value)} 
                />
                <span className="uu">nos</span>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            C · Initial Coating Cost (₹)
          </div>
          <div className="g2">
            <div className="field">
              <label>Paint Material Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-cpaint" 
                  placeholder="e.g. 400000" 
                  min="0" 
                  step="any" 
                  value={cPaint} 
                  onChange={(e) => setCPaint(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Surface Preparation Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-cprep" 
                  placeholder="e.g. 250000" 
                  min="0" 
                  step="any" 
                  value={cPrep} 
                  onChange={(e) => setCPrep(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Labour Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-clab" 
                  placeholder="e.g. 200000" 
                  min="0" 
                  step="any" 
                  value={cLab} 
                  onChange={(e) => setCLab(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Equipment Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-ceqp" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={cEqp} 
                  onChange={(e) => setCEqp(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Scaffolding Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-cscf" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={cScf} 
                  onChange={(e) => setCScf(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Inspection Cost (initial QA/QC)</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-cins" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={cIns} 
                  onChange={(e) => setCIns(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Other Costs</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-coth" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={cOth} 
                  onChange={(e) => setCOth(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>
          </div>

          {/* Section D */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            D · Maintenance Details
          </div>
          <div className="g2">
            <div className="field">
              <label>Inspection Interval <span className="lh">years</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-insi" 
                  placeholder="e.g. 2" 
                  min="0" 
                  step="any" 
                  value={insi} 
                  onChange={(e) => setInsi(e.target.value)} 
                />
                <span className="uu">yrs</span>
              </div>
            </div>

            <div className="field">
              <label>Inspection Cost per Visit</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-insc" 
                  placeholder="e.g. 25000" 
                  min="0" 
                  step="any" 
                  value={insc} 
                  onChange={(e) => setInsc(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Routine Maintenance Interval <span className="lh">years</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-rmi" 
                  placeholder="e.g. 5" 
                  min="0" 
                  step="any" 
                  value={rmi} 
                  onChange={(e) => setRmi(e.target.value)} 
                />
                <span className="uu">yrs</span>
              </div>
            </div>

            <div className="field">
              <label>Routine Maintenance Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-rmc" 
                  placeholder="e.g. 150000" 
                  min="0" 
                  step="any" 
                  value={rmc} 
                  onChange={(e) => setRmc(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Repair Interval <span className="lh">years</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-rpi" 
                  placeholder="e.g. 8" 
                  min="0" 
                  step="any" 
                  value={rpi} 
                  onChange={(e) => setRpi(e.target.value)} 
                />
                <span className="uu">yrs</span>
              </div>
            </div>

            <div className="field">
              <label>Repair Cost per Event</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-rpc" 
                  placeholder="e.g. 300000" 
                  min="0" 
                  step="any" 
                  value={rpc} 
                  onChange={(e) => setRpc(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Major Recoating Cost <span className="lh">per event</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-recc" 
                  placeholder="e.g. 900000" 
                  min="0" 
                  step="any" 
                  value={recc} 
                  onChange={(e) => setRecc(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>
          </div>

          {/* Section E */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            E · Economic Factors (optional)
          </div>
          <div className="g2">
            <div className="field">
              <label>Inflation Rate <span className="lh">%/yr</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-inf" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={inf} 
                  onChange={(e) => setInf(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Discount Rate <span className="lh">%/yr · enables NPV</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-dis" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={dis} 
                  onChange={(e) => setDis(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>

            <div className="field">
              <label>Escalation Rate <span className="lh">%/yr</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-esc" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={esc} 
                  onChange={(e) => setEsc(e.target.value)} 
                />
                <span className="uu">%</span>
              </div>
            </div>
          </div>

          {/* Section F */}
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--in-lbl)', margin: '14px 0 8px' }}>
            F · Optional Cost Elements (₹)
          </div>
          <div className="g2">
            <div className="field">
              <label>Production Shutdown Cost <span className="lh">per recoat event</span></label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-shut" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={shut} 
                  onChange={(e) => setShut(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Access Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-acc" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={acc} 
                  onChange={(e) => setAcc(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Waste Disposal Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-wst" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={wst} 
                  onChange={(e) => setWst(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Environmental Compliance Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-env2" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={env2} 
                  onChange={(e) => setEnv2(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>

            <div className="field">
              <label>Safety Management Cost</label>
              <div className="iw">
                <input 
                  type="number" 
                  id="lcc-saf" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  value={saf} 
                  onChange={(e) => setSaf(e.target.value)} 
                />
                <span className="uu">₹</span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={handleCalculate}>▶ Calculate Life Cycle Cost</button>
          <button className="btn-reset" onClick={handleReset}>↺ Reset</button>
        </div>

        {res && (
          <div className="res show" id="r-lcc">
            <div className="output-section">
              <div className="rh"><span className="pd"></span>Life Cycle Cost Result</div>

              {/* Verdict Banner */}
              <div style={{ background: res.g.bg, border: `1.5px solid ${res.g.bd}`, borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '19px', fontWeight: 700, color: res.g.c1 }}>
                  {res.g.ic} {res.cls}
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: res.g.c2, marginTop: '3px' }}>
                  Total LCC: {formatCur(res.lcc)} over {res.dlVal} Years &nbsp;·&nbsp; Annualized: {formatCur(res.ann)}/yr &nbsp;·&nbsp; ₹{formatNum(res.perM2, 1)}/m²
                </div>
              </div>

              {/* Primary 4 Tiles */}
              <div className="tls">
                <div className="tile tp">
                  <div className="tl">Total Life Cycle Cost</div>
                  <div><span className="tv" id="lcc-rlcc">{formatCur(res.lcc)}</span></div>
                  <div className="tn" id="lcc-rcls">{res.cls}</div>
                </div>

                <div className="tile ts">
                  <div className="tl">Annual Coating Cost</div>
                  <div>
                    <span className="tv" id="lcc-rann">{formatCur(res.ann)}</span>
                    <span className="tu">/yr</span>
                  </div>
                </div>

                <div className="tile ti">
                  <div className="tl">LCC per m²</div>
                  <div>
                    <span className="tv" id="lcc-rm2">{formatCur(res.perM2)}</span>
                    <span className="tu">/m²</span>
                  </div>
                </div>

                <div className="tile tg">
                  <div className="tl">NPV (Discounted)</div>
                  <div>
                    <span className="tv" id="lcc-rnpv">{res.npv !== null ? formatCur(res.npv) : '—'}</span>
                  </div>
                  <div className="tn" id="lcc-rnpvn">{res.npv !== null ? `@ ${dis}% discount rate` : 'Rate = 0%'}</div>
                </div>
              </div>

              {/* Secondary 6 Tiles */}
              <div className="tls">
                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Initial Coating Cost</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{formatCur(res.ini)}</div>
                </div>

                <div className="tile ts" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Inspections ({res.nIns} cycles)</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{formatCur(res.cInsTot)}</div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Routine Maint. ({res.nRm} cycles)</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{formatCur(res.cRmTot)}</div>
                </div>

                <div className="tile ti" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Repairs ({res.nRp} events)</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{formatCur(res.cRpTot)}</div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Recoating ({res.nRec} cycles)</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{formatCur(res.cRecTot)}</div>
                </div>

                <div className="tile tg" style={{ marginBottom: 0 }}>
                  <div className="tl" style={{ fontSize: '9px' }}>Shutdown + Optional Costs</div>
                  <div className="tv" style={{ fontSize: '19px' }}>{formatCur(res.shutTot + res.dispTot + res.otherTot)}</div>
                </div>
              </div>

              {/* Comparative Analysis */}
              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#FDF1E4', border: '1px solid var(--bdr2)', borderRadius: 'var(--r)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--brand-crimson)', flex: 1 }}>
                    ⚖️ Comparative Analysis — up to 3 systems
                  </div>
                  <button className="btn" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={addCompare}>
                    ➕ Add This System to Comparison
                  </button>
                  <button className="btn-reset" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={clearCompare}>
                    🗑 Clear
                  </button>
                </div>

                <div id="lcc-compare" style={{ marginTop: '10px' }}>
                  {comparisonList.length === 0 ? (
                    <div style={{ fontSize: '11.5px', color: 'var(--txt3)' }}>
                      No systems added yet. Calculate a coating system above, then click “Add This System to Comparison”. Repeat with different inputs for System B / C.
                    </div>
                  ) : (
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left', marginTop: '8px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid var(--bdr)' }}>
                          <th style={{ padding: '6px' }}>System Name</th>
                          <th style={{ padding: '6px' }}>Initial CapEx</th>
                          <th style={{ padding: '6px' }}>Total LCC</th>
                          <th style={{ padding: '6px' }}>LCC / m²</th>
                          <th style={{ padding: '6px' }}>NPV (Discounted)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonList.map((c, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--bdr2)' }}>
                            <td style={{ padding: '6px', fontWeight: 700 }}>{c.name}</td>
                            <td style={{ padding: '6px' }}>{formatCur(c.ini)}</td>
                            <td style={{ padding: '6px', fontWeight: 700, color: 'var(--o1)' }}>{formatCur(c.lcc)}</td>
                            <td style={{ padding: '6px' }}>{formatCur(c.perM2)}</td>
                            <td style={{ padding: '6px' }}>{c.npv !== null ? formatCur(c.npv) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Input Summary */}
              <div className="input-summary" style={{ marginTop: '14px' }}>
                <div className="input-summary-label">📝 Life Cycle Cost Analysis Summary</div>
                <div className="dr"><span className="dk">Asset / Project</span><span className="dv">{res.asset} ({res.proj})</span></div>
                <div className="dr"><span className="dk">Coating System</span><span className="dv">{res.sys}</span></div>
                <div className="dr"><span className="dk">Surface Area / Design Life</span><span className="dv">{res.areaVal.toLocaleString()} m² / {res.dlVal} yrs</span></div>
                <div className="dr"><span className="dk">Coating Service Life / Recoats</span><span className="dv">{res.clVal} yrs / {res.nRec} cycles</span></div>
                <div className="dr"><span className="dk">Total LCC (Undiscounted)</span><span className="dv">{formatCur(res.lcc)}</span></div>
                {res.npv !== null && (
                  <div className="dr"><span className="dk">Net Present Value (NPV @ {dis}%)</span><span className="dv">{formatCur(res.npv)}</span></div>
                )}
              </div>

              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                <strong style={{ color: 'var(--gi)' }}>References:</strong> ISO 12944 · ISO 55000 (Asset Management) · AMPP Guidelines · NORSOK M-501 · API RP 652 / RP 651 / API 653 · SSPC Guides · Whole Life Cost / LCC / TCO principles. <strong>Note:</strong> The lowest initial coating cost is not always the lowest total ownership cost.
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
              <button className="btn-share" onClick={handleShare}>📤 Share Text</button>
              <button className="btn-print" onClick={handlePrint}>⬇ Export Excel (CSV)</button>
              <button className="btn-print xls-btn" onClick={() => addToast('Excel Export', 'Exporting LCC schedule...', 'info')}>
                📊 Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
