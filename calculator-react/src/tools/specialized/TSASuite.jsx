import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';
import { autoLogCalculation } from '../../services/calculatorService';

export default function TSASuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Active Sub-Tab: 'wire' | 'cov' | 'eff' | 'thk' | 'prod' | 'cost'
  const [currentTab, setCurrentTab] = useState('wire');

  useEffect(() => {
    if (activeSubTool === 'tsa-cov' || activeSubTool === 'tsa_cov' || activeSubTool === 'tsa_area_coverage') setCurrentTab('cov');
    else if (activeSubTool === 'tsa-eff' || activeSubTool === 'tsa_eff' || activeSubTool === 'tsa_deposition') setCurrentTab('eff');
    else if (activeSubTool === 'tsa-thk' || activeSubTool === 'tsa_thk' || activeSubTool === 'tsa_thickness' || activeSubTool === 'tsa_thickness_verify') setCurrentTab('thk');
    else if (activeSubTool === 'tsa-prod' || activeSubTool === 'tsa_prod' || activeSubTool === 'tsa_productivity') setCurrentTab('prod');
    else if (activeSubTool === 'tsa-cost' || activeSubTool === 'tsa_cost') setCurrentTab('cost');
    else setCurrentTab('wire');
  }, [activeSubTool]);

  const handleTabSwitch = (tabKey, toolId) => {
    setCurrentTab(tabKey);
    if (onSubToolChange) onSubToolChange(toolId);
  };

  // ----------------------------------------------------
  // TSA-1: Wire Consumption
  // ----------------------------------------------------
  const [tswProj, setTswProj] = useState('');
  const [tswArea, setTswArea] = useState('100');
  const [tswT, setTswT] = useState('250');
  const [tswD, setTswD] = useState('2.3');
  const [tswDen, setTswDen] = useState('2.70');
  const [tswDe, setTswDe] = useState('65');
  const [tswLoss, setTswLoss] = useState('0');
  const [hasTswCalculated, setHasTswCalculated] = useState(false);

  const tswAVal = parseFloat(tswArea) || 0;
  const tswTVal = parseFloat(tswT) || 0;
  const tswDenVal = parseFloat(tswDen) || 2.7;
  const tswDeVal = parseFloat(tswDe) || 65;
  const tswLossVal = parseFloat(tswLoss) || 0;
  const tswWd = parseFloat(tswD) || 2.3;

  const tswVolM3 = tswAVal * tswTVal * 1e-6;
  const tswTheo = tswVolM3 * tswDenVal * 1000;
  const tswActual = tswDeVal > 0 ? tswTheo / (tswDeVal / 100) : 0;
  const tswProc = tswActual * (1 + tswLossVal / 100);
  const tswPerM2 = tswAVal > 0 ? tswActual / tswAVal : 0;
  const tswKgPerM = tswDenVal * 1000 * Math.PI * Math.pow(tswWd / 2000, 2);
  const tswLenM = tswKgPerM > 0 ? tswActual / tswKgPerM : 0;

  // ----------------------------------------------------
  // TSA-2: Area Coverage
  // ----------------------------------------------------
  const [tscW, setTscW] = useState('500');
  const [tscT, setTscT] = useState('250');
  const [tscDe, setTscDe] = useState('65');
  const [tscDen, setTscDen] = useState('2.70');
  const [tscReq, setTscReq] = useState('300');
  const [hasTscCalculated, setHasTscCalculated] = useState(false);

  const tscWVal = parseFloat(tscW) || 0;
  const tscTVal = parseFloat(tscT) || 0;
  const tscDeVal = parseFloat(tscDe) || 65;
  const tscDenVal = parseFloat(tscDen) || 2.7;
  const tscReqVal = parseFloat(tscReq) || 0;

  const tscPerM2 = tscDeVal > 0 ? (tscTVal * 1e-6 * tscDenVal * 1000) / (tscDeVal / 100) : 0;
  const tscCov = tscPerM2 > 0 ? tscWVal / tscPerM2 : 0;
  let tscRem = null;
  let tscUt = null;
  if (tscReqVal > 0) {
    const used = tscReqVal * tscPerM2;
    tscRem = tscWVal - used;
    tscUt = tscWVal > 0 ? Math.min(100, (used / tscWVal) * 100) : 0;
  }

  // ----------------------------------------------------
  // TSA-3: Deposition Efficiency
  // ----------------------------------------------------
  const [tseW, setTseW] = useState('120');
  const [tseD, setTseD] = useState('78');
  const [hasTseCalculated, setHasTseCalculated] = useState(false);

  const tseWVal = parseFloat(tseW) || 0;
  const tseDVal = parseFloat(tseD) || 0;
  const tseEff = tseWVal > 0 ? (tseDVal / tseWVal) * 100 : 0;
  const tseLoss = Math.max(0, tseWVal - tseDVal);
  const tseRating = tseEff > 70 ? ['Excellent', 'ok', '🏆'] : tseEff >= 60 ? ['Good', 'ok', '✅'] : tseEff >= 50 ? ['Average', 'warn', '⚠️'] : ['Poor', 'fail', '❌'];

  // ----------------------------------------------------
  // TSA-4: Thickness
  // ----------------------------------------------------
  const [tstA, setTstA] = useState('50');
  const [tstW, setTstW] = useState('33.75');
  const [tstDen, setTstDen] = useState('2.70');
  const [tstSpec, setTstSpec] = useState('250');
  const [hasTstCalculated, setHasTstCalculated] = useState(false);

  const tstAVal = parseFloat(tstA) || 0;
  const tstWVal = parseFloat(tstW) || 0;
  const tstDenVal = parseFloat(tstDen) || 2.7;
  const tstSpecVal = parseFloat(tstSpec) || 0;

  const tstThk = (tstAVal > 0 && tstDenVal > 0) ? (tstWVal / (tstDenVal * 1000 * tstAVal)) * 1e6 : 0;
  let tstDev = null;
  let tstOk = null;
  if (tstSpecVal > 0) {
    tstDev = ((tstThk - tstSpecVal) / tstSpecVal) * 100;
    tstOk = tstThk >= tstSpecVal;
  }

  // ----------------------------------------------------
  // TSA-5: Productivity
  // ----------------------------------------------------
  const [tspA, setTspA] = useState('120');
  const [tspH, setTspH] = useState('8');
  const [tspN, setTspN] = useState('1');
  const [tspW, setTspW] = useState('130');
  const [tspSh, setTspSh] = useState('8');
  const [hasTspCalculated, setHasTspCalculated] = useState(false);

  const tspAVal = parseFloat(tspA) || 0;
  const tspHVal = parseFloat(tspH) || 0;
  const tspNVal = parseFloat(tspN) || 1;
  const tspWVal = parseFloat(tspW) || 0;
  const tspShVal = parseFloat(tspSh) || 8;

  const tspProd = tspHVal > 0 ? tspAVal / tspHVal : 0;
  const tspWr = (tspHVal > 0 && tspWVal > 0) ? tspWVal / tspHVal : null;
  const tspOp = (tspHVal > 0 && tspNVal > 0) ? tspAVal / (tspNVal * tspHVal) : 0;
  const tspDaily = tspProd * tspShVal;

  // ----------------------------------------------------
  // TSA-6: Cost
  // ----------------------------------------------------
  const [tskA, setTskA] = useState('100');
  const [tskW, setTskW] = useState('100');
  const [tskWc, setTskWc] = useState('850');
  const [tskL, setTskL] = useState('30000');
  const [tskE, setTskE] = useState('20000');
  const [tskC, setTskC] = useState('10000');
  const [tskS, setTskS] = useState('15000');
  const [tskOh, setTskOh] = useState('0');
  const [hasTskCalculated, setHasTskCalculated] = useState(false);

  const tskAVal = parseFloat(tskA) || 0;
  const tskWVal = parseFloat(tskW) || 0;
  const tskWcVal = parseFloat(tskWc) || 0;
  const tskLVal = parseFloat(tskL) || 0;
  const tskEVal = parseFloat(tskE) || 0;
  const tskCVal = parseFloat(tskC) || 0;
  const tskSVal = parseFloat(tskS) || 0;
  const tskOhVal = parseFloat(tskOh) || 0;

  const tskMat = tskWVal * tskWcVal;
  const tskSub = tskMat + tskLVal + tskEVal + tskCVal + tskSVal;
  const tskOhAmt = (tskSub * tskOhVal) / 100;
  const tskTot = tskSub + tskOhAmt;
  const tskPerM2 = tskAVal > 0 ? tskTot / tskAVal : 0;
  const tskProc = tskWVal * 1.05;

  const tskParts = [
    ['Wire (Material)', tskMat, '#2E7D32'],
    ['Labour', tskLVal, '#1565C0'],
    ['Equipment', tskEVal, '#8E24AA'],
    ['Consumables', tskCVal, '#B26A00'],
    ['Sealer', tskSVal, '#455A64'],
    ['Overhead', tskOhAmt, '#C62828']
  ];
  const tskPtot = tskParts.reduce((x, y) => x + y[1], 0) || 1;
  let tskAcc = 0;
  const tskStops = [];
  tskParts.forEach(x => {
    const p0 = (tskAcc / tskPtot) * 100;
    tskAcc += x[1];
    tskStops.push(`${x[2]} ${p0}% ${(tskAcc / tskPtot) * 100}%`);
  });

  const handleCalcTsw = () => {
    if (!tswAVal || !tswTVal) {
      addToast('Missing Required Inputs', 'Please fill Surface Area and Specified TSA Thickness.', 'warning');
      return;
    }
    setHasTswCalculated(true);
    addToast('Wire Calculated', `${formatNum(tswActual, 1)} kg wire required.`, 'success');
    autoLogCalculation({
      tool_id: 'tsa-wire',
      tool_name: 'TSA Wire Consumption',
      category: 'specialized',
      inputs: {
        project: tswProj,
        surface_area_m2: tswAVal,
        specified_thickness_um: tswTVal,
        wire_diameter_mm: tswWd,
        metal_density_g_cm3: tswDenVal,
        deposition_efficiency_pct: tswDeVal,
        contingency_loss_pct: tswLossVal
      },
      results: {
        theoretical_wire_kg: tswTheo,
        actual_wire_required_kg: tswActual,
        procurement_wire_kg: tswProc,
        consumption_per_m2_kg: tswPerM2,
        wire_length_meters: tswLenM
      }
    });
  };

  const handleCalcTsc = () => {
    if (!tscWVal || !tscTVal) {
      addToast('Missing Required Inputs', 'Please fill Wire Stock and Specified Thickness.', 'warning');
      return;
    }
    setHasTscCalculated(true);
    addToast('Coverage Calculated', `Coverage: ${formatNum(tscCov, 0)} m²`, 'success');
    autoLogCalculation({
      tool_id: 'tsa-cov',
      tool_name: 'TSA Area Coverage',
      category: 'specialized',
      inputs: {
        wire_stock_kg: tscWVal,
        specified_thickness_um: tscTVal,
        deposition_efficiency_pct: tscDeVal,
        metal_density_g_cm3: tscDenVal,
        required_surface_area_m2: tscReqVal
      },
      results: {
        total_achievable_coverage_m2: tscCov,
        consumption_rate_kg_m2: tscPerM2,
        surplus_or_shortfall_kg: tscRem,
        stock_utilization_pct: tscUt
      }
    });
  };

  const handleCalcTse = () => {
    if (!tseWVal || !tseDVal) {
      addToast('Missing Required Inputs', 'Please fill Wire Consumed and Coating Deposited.', 'warning');
      return;
    }
    setHasTseCalculated(true);
    addToast('Efficiency Calculated', `DE: ${formatNum(tseEff, 1)}% (${tseRating[0]})`, 'success');
    autoLogCalculation({
      tool_id: 'tsa-eff',
      tool_name: 'TSA Deposition Efficiency',
      category: 'specialized',
      inputs: {
        wire_consumed_kg: tseWVal,
        coating_deposited_kg: tseDVal
      },
      results: {
        deposition_efficiency_pct: tseEff,
        overspray_loss_kg: tseLoss,
        efficiency_rating: tseRating[0]
      }
    });
  };

  const handleCalcTst = () => {
    if (!tstAVal || !tstWVal) {
      addToast('Missing Required Inputs', 'Please fill Surface Area and Deposited Metal Weight.', 'warning');
      return;
    }
    setHasTstCalculated(true);
    addToast('Thickness Calculated', `Thickness: ${formatNum(tstThk, 0)} µm`, 'success');
    autoLogCalculation({
      tool_id: 'tsa-thk',
      tool_name: 'TSA Thickness Verification',
      category: 'specialized',
      inputs: {
        surface_area_m2: tstAVal,
        deposited_metal_weight_kg: tstWVal,
        metal_density_g_cm3: tstDenVal,
        specified_thickness_um: tstSpecVal
      },
      results: {
        calculated_thickness_um: tstThk,
        thickness_deviation_pct: tstDev,
        specification_status: tstOk ? 'PASS' : 'FAIL'
      }
    });
  };

  const handleCalcTsp = () => {
    if (!tspAVal || !tspHVal) {
      addToast('Missing Required Inputs', 'Please fill Surface Area and Arc-on Hours.', 'warning');
      return;
    }
    setHasTspCalculated(true);
    addToast('Productivity Calculated', `${formatNum(tspProd, 1)} m²/hr`, 'success');
    autoLogCalculation({
      tool_id: 'tsa-prod',
      tool_name: 'TSA Productivity',
      category: 'specialized',
      inputs: {
        surface_area_sprayed_m2: tspAVal,
        actual_spray_hours: tspHVal,
        number_of_spray_guns: tspNVal,
        wire_consumed_kg: tspWVal,
        shift_duration_hours: tspShVal
      },
      results: {
        productivity_m2_hr: tspProd,
        deposition_rate_kg_hr: tspWr,
        operator_productivity_m2_gun_hr: tspOp,
        daily_shift_output_m2: tspDaily
      }
    });
  };

  const handleCalcTsk = () => {
    if (!tskAVal || !tskWVal || !tskWcVal) {
      addToast('Missing Required Inputs', 'Please fill Surface Area, Wire Required and Wire Unit Rate.', 'warning');
      return;
    }
    setHasTskCalculated(true);
    addToast('Cost Calculated', `Total: ${formatCur(tskTot)}`, 'success');
    autoLogCalculation({
      tool_id: 'tsa-cost',
      tool_name: 'TSA Cost Estimation',
      category: 'specialized',
      inputs: {
        surface_area_m2: tskAVal,
        wire_quantity_kg: tskWVal,
        wire_rate_per_kg: tskWcVal,
        labor_cost: tskLVal,
        equipment_cost: tskEVal,
        consumables_cost: tskCVal,
        surface_prep_cost: tskSVal,
        overhead_margin_pct: tskOhVal
      },
      results: {
        total_project_cost: tskTot,
        unit_rate_per_m2: tskPerM2
      }
    });
  };

  useEffect(() => {
    const handleRestore = (e) => {
      const log = e?.detail;
      if (!log) return;
      if (['tsa-wire', 'tsa_wire', 'tsa_wire_consumption', 'tsa-wire-consumption'].includes(log.tool_id)) {
        setCurrentTab('wire');
        if (log.inputs) {
          if (log.inputs.project !== undefined) setTswProj(log.inputs.project);
          if (log.inputs.surface_area_m2 !== undefined) setTswArea(String(log.inputs.surface_area_m2));
          if (log.inputs.specified_thickness_um !== undefined) setTswT(String(log.inputs.specified_thickness_um));
          if (log.inputs.wire_diameter_mm !== undefined) setTswD(String(log.inputs.wire_diameter_mm));
          if (log.inputs.metal_density_g_cm3 !== undefined) setTswDen(String(log.inputs.metal_density_g_cm3));
          if (log.inputs.deposition_efficiency_pct !== undefined) setTswDe(String(log.inputs.deposition_efficiency_pct));
          if (log.inputs.contingency_loss_pct !== undefined) setTswLoss(String(log.inputs.contingency_loss_pct));
        }
        setHasTswCalculated(true);
      } else if (['tsa-cov', 'tsa_cov', 'tsa_area_coverage', 'tsa-area-coverage'].includes(log.tool_id)) {
        setCurrentTab('cov');
        if (log.inputs) {
          if (log.inputs.wire_stock_kg !== undefined) setTscW(String(log.inputs.wire_stock_kg));
          if (log.inputs.specified_thickness_um !== undefined) setTscT(String(log.inputs.specified_thickness_um));
          if (log.inputs.deposition_efficiency_pct !== undefined) setTscDe(String(log.inputs.deposition_efficiency_pct));
          if (log.inputs.metal_density_g_cm3 !== undefined) setTscDen(String(log.inputs.metal_density_g_cm3));
          if (log.inputs.required_surface_area_m2 !== undefined) setTscReq(String(log.inputs.required_surface_area_m2));
        }
        setHasTscCalculated(true);
      } else if (['tsa-eff', 'tsa_eff', 'tsa_deposition', 'tsa-deposition-efficiency'].includes(log.tool_id)) {
        setCurrentTab('eff');
        if (log.inputs) {
          if (log.inputs.wire_consumed_kg !== undefined) setTseW(String(log.inputs.wire_consumed_kg));
          if (log.inputs.coating_deposited_kg !== undefined) setTseD(String(log.inputs.coating_deposited_kg));
        }
        setHasTseCalculated(true);
      } else if (['tsa-thk', 'tsa_thk', 'tsa_thickness', 'tsa_thickness_verify', 'tsa-thickness-verification'].includes(log.tool_id)) {
        setCurrentTab('thk');
        if (log.inputs) {
          if (log.inputs.surface_area_m2 !== undefined) setTstA(String(log.inputs.surface_area_m2));
          if (log.inputs.deposited_metal_weight_kg !== undefined) setTstW(String(log.inputs.deposited_metal_weight_kg));
          if (log.inputs.metal_density_g_cm3 !== undefined) setTstDen(String(log.inputs.metal_density_g_cm3));
          if (log.inputs.specified_thickness_um !== undefined) setTstSpec(String(log.inputs.specified_thickness_um));
        }
        setHasTstCalculated(true);
      } else if (['tsa-prod', 'tsa_prod', 'tsa_productivity', 'tsa-productivity'].includes(log.tool_id)) {
        setCurrentTab('prod');
        if (log.inputs) {
          if (log.inputs.surface_area_sprayed_m2 !== undefined) setTspA(String(log.inputs.surface_area_sprayed_m2));
          if (log.inputs.actual_spray_hours !== undefined) setTspH(String(log.inputs.actual_spray_hours));
          if (log.inputs.number_of_spray_guns !== undefined) setTspN(String(log.inputs.number_of_spray_guns));
          if (log.inputs.wire_consumed_kg !== undefined) setTspW(String(log.inputs.wire_consumed_kg));
          if (log.inputs.shift_duration_hours !== undefined) setTspSh(String(log.inputs.shift_duration_hours));
        }
        setHasTspCalculated(true);
      } else if (['tsa-cost', 'tsa_cost'].includes(log.tool_id)) {
        setCurrentTab('cost');
        if (log.inputs) {
          if (log.inputs.surface_area_m2 !== undefined) setTskA(String(log.inputs.surface_area_m2));
          if (log.inputs.wire_quantity_kg !== undefined) setTskW(String(log.inputs.wire_quantity_kg));
          if (log.inputs.wire_rate_per_kg !== undefined) setTskWc(String(log.inputs.wire_rate_per_kg));
          if (log.inputs.labor_cost !== undefined) setTskL(String(log.inputs.labor_cost));
          if (log.inputs.equipment_cost !== undefined) setTskE(String(log.inputs.equipment_cost));
          if (log.inputs.consumables_cost !== undefined) setTskC(String(log.inputs.consumables_cost));
          if (log.inputs.surface_prep_cost !== undefined) setTskS(String(log.inputs.surface_prep_cost));
          if (log.inputs.overhead_margin_pct !== undefined) setTskOh(String(log.inputs.overhead_margin_pct));
        }
        setHasTskCalculated(true);
      }
    };
    window.addEventListener('bg_restore_calculation', handleRestore);
    return () => window.removeEventListener('bg_restore_calculation', handleRestore);
  }, []);

  return (
    <div className="space-y-4">
      {/* Sub Navigation Bar matching exact pills */}
      <div className="subnav">
        <button
          className={`snb ${currentTab === 'wire' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('wire', 'tsa_wire_consumption')}
        >
          🧵 TSA-1: Wire Consumption
        </button>
        <button
          className={`snb ${currentTab === 'cov' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('cov', 'tsa_area_coverage')}
        >
          📦 TSA-2: Area Coverage
        </button>
        <button
          className={`snb ${currentTab === 'eff' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('eff', 'tsa_deposition')}
        >
          🎯 TSA-3: Deposition Efficiency
        </button>
        <button
          className={`snb ${currentTab === 'thk' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('thk', 'tsa_thickness')}
        >
          🔎 TSA-4: Thickness
        </button>
        <button
          className={`snb ${currentTab === 'prod' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('prod', 'tsa_productivity')}
        >
          ⏱️ TSA-5: Productivity
        </button>
        <button
          className={`snb ${currentTab === 'cost' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('cost', 'tsa_cost')}
        >
          💰 TSA-6: Cost Estimation
        </button>
      </div>

      {/* ── TSA-1 : Wire Consumption ── */}
      {currentTab === 'wire' && (
        <div className="sub-sec card active" id="tsa-wire">
          <div className="ch">
            <div className="ci">🧵</div>
            <div>
              <div className="ct">TSA Wire Consumption Calculator</div>
              <div className="cs">Aluminium wire required for specified thickness — ISO 2063 · SSPC-CS 23.00 · AWS C2.18</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('tsa-wire')}>📖 Guideline</button>
            <div className="ctag">PRO · TSA-1</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Project <span className="lh">optional</span></label>
                  <div className="iw">
                    <input
                      type="text"
                      value={tswProj}
                      onChange={e => setTswProj(e.target.value)}
                      placeholder="e.g. Flare Boom TSA"
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tswArea}
                      onChange={e => setTswArea(e.target.value)}
                      placeholder="e.g. 100"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Specified TSA Thickness <span className="lh">µm</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tswT}
                      onChange={e => setTswT(e.target.value)}
                      placeholder="e.g. 250"
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wire Diameter <span className="lh">mm · for length estimate</span></label>
                  <div className="iw">
                    <select
                      value={tswD}
                      onChange={e => setTswD(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', outline: 'none' }}
                    >
                      <option value="1.6">1.6 mm</option>
                      <option value="2.0">2.0 mm</option>
                      <option value="2.3">2.3 mm (3/32")</option>
                      <option value="3.2">3.2 mm (1/8")</option>
                      <option value="4.8">4.8 mm (3/16")</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Aluminium Density <span className="lh">g/cm³</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tswDen}
                      onChange={e => setTswDen(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">g/cm³</span>
                  </div>
                </div>
                <div className="field">
                  <label>Deposition Efficiency <span className="lh">% · typical 60–70</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tswDe}
                      onChange={e => setTswDe(e.target.value)}
                      min="10"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Material Loss / Contingency <span className="lh">% · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tswLoss}
                      onChange={e => setTswLoss(e.target.value)}
                      min="0"
                      max="50"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcTsw}>
                ▶ Calculate Wire Consumption
              </button>
              <button className="btn-reset" onClick={() => {
                setTswProj(''); setTswArea(''); setTswT(''); setTswD('2.3'); setTswDen('2.70'); setTswDe('65'); setTswLoss('0'); setHasTswCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasTswCalculated && tswAVal > 0 && tswTVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Wire Consumption Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      🧵 Wire Required ≈ {formatNum(tswActual, 1)} kg for {formatNum(tswAVal, 0)} m² @ {tswTVal} µm
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      Theoretical {formatNum(tswTheo, 1)} kg ÷ {tswDeVal}% DE · Procurement {formatNum(tswProc, 1)} kg{tswLossVal > 0 ? ` (incl. ${tswLossVal}% loss)` : ''} · ≈ {formatNum(tswLenM / 1000, 1)} km of {tswWd} mm wire
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Actual Wire Required</div>
                      <div><span className="tv">{formatNum(tswActual, 1)}</span><span className="tu">kg</span></div>
                      <div className="tn">Theoretical ÷ {tswDeVal}% deposition efficiency</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Theoretical Al Weight</div>
                      <div><span className="tv">{formatNum(tswTheo, 1)}</span><span className="tu">kg</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Coating Volume</div>
                      <div><span className="tv">{formatNum(tswVolM3 * 1000, 1)}</span><span className="tu">L</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Procurement Quantity</div>
                      <div><span className="tv">{formatNum(tswProc, 1)}</span><span className="tu">kg</span></div>
                      <div className="tn">{tswLossVal > 0 ? `incl. ${tswLossVal}% material loss` : 'no loss factor applied'}</div>
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile ts" style={{ marginBottom: 0 }}>
                      <div className="tl" style={{ fontSize: '9px' }}>Wire per m²</div>
                      <div className="tv" style={{ fontSize: '20px' }}>{formatNum(tswPerM2, 3)} kg/m²</div>
                    </div>
                    <div className="tile tg" style={{ marginBottom: 0 }}>
                      <div className="tl" style={{ fontSize: '9px' }}>Estimated Wire Length</div>
                      <div className="tv" style={{ fontSize: '20px' }}>{formatNum(tswLenM, 0)} m ({formatNum(tswLenM / 1000, 2)} km) of {tswWd} mm</div>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Project</span><span className="dv">{tswProj || '—'}</span></div>
                    <div className="dr"><span className="dk">Surface Area</span><span className="dv">{formatNum(tswAVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Specified Thickness</span><span className="dv">{tswTVal} µm</span></div>
                    <div className="dr"><span className="dk">Density</span><span className="dv">{tswDenVal} g/cm³</span></div>
                    <div className="dr"><span className="dk">Deposition Efficiency</span><span className="dv">{tswDeVal}%</span></div>
                    <div className="dr"><span className="dk">Coating Volume</span><span className="dv">{formatNum(tswVolM3 * 1000, 1)} L</span></div>
                    <div className="dr"><span className="dk">Theoretical Al Weight</span><span className="dv">{formatNum(tswTheo, 2)} kg</span></div>
                    <div className="dr"><span className="dk">Actual Wire Consumption</span><span className="dv">{formatNum(tswActual, 2)} kg</span></div>
                    <div className="dr"><span className="dk">Material Loss</span><span className="dv">{tswLossVal}% → {formatNum(tswProc - tswActual, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Procurement Quantity</span><span className="dv">{formatNum(tswProc, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Wire Length ({tswWd} mm)</span><span className="dv">{formatNum(tswLenM, 0)} m</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>References:</strong> ISO 2063-1/-2 · AMPP/NACE SP0198 · SSPC-CS 23.00 · AWS C2.18 · ISO 14919 (wire)
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`TSA Wire Required: ${formatNum(tswActual, 1)} kg for ${tswAVal} m² @ ${tswTVal} µm.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TSA-2 : Area Coverage ── */}
      {currentTab === 'cov' && (
        <div className="sub-sec card active" id="tsa-cov">
          <div className="ch">
            <div className="ci">📦</div>
            <div>
              <div className="ct">TSA Area Coverage Calculator</div>
              <div className="cs">Maximum area achievable from available wire stock</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('tsa-cov')}>📖 Guideline</button>
            <div className="ctag">PRO · TSA-2</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Available Wire Quantity <span className="lh">kg</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tscW}
                      onChange={e => setTscW(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>TSA Thickness <span className="lh">µm</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tscT}
                      onChange={e => setTscT(e.target.value)}
                      placeholder="e.g. 250"
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
                <div className="field">
                  <label>Deposition Efficiency <span className="lh">%</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tscDe}
                      onChange={e => setTscDe(e.target.value)}
                      min="10"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
                <div className="field">
                  <label>Aluminium Density <span className="lh">g/cm³</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tscDen}
                      onChange={e => setTscDen(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">g/cm³</span>
                  </div>
                </div>
                <div className="field">
                  <label>Required Area <span className="lh">m² · optional — for remaining wire</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tscReq}
                      onChange={e => setTscReq(e.target.value)}
                      placeholder="e.g. 300"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcTsc}>
                ▶ Calculate Coverage
              </button>
              <button className="btn-reset" onClick={() => {
                setTscW(''); setTscT(''); setTscDe('65'); setTscDen('2.70'); setTscReq(''); setHasTscCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasTscCalculated && tscWVal > 0 && tscTVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Coverage Result</div>

                  <div style={{
                    background: (tscReqVal > 0 && tscRem < 0) ? '#FFEBEE' : '#E8F5E9',
                    border: `1.5px solid ${(tscReqVal > 0 && tscRem < 0) ? 'rgba(211,47,47,.35)' : 'rgba(46,125,50,.35)'}`,
                    borderRadius: 'var(--r)',
                    padding: '13px 16px',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: (tscReqVal > 0 && tscRem < 0) ? '#B71C1C' : '#1B5E20' }}>
                      📦 Coverage ≈ {formatNum(tscCov, 0)} m² from {formatNum(tscWVal, 0)} kg wire @ {tscTVal} µm
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: (tscReqVal > 0 && tscRem < 0) ? '#C62828' : '#2E7D32', marginTop: '3px' }}>
                      {formatNum(tscPerM2, 3)} kg/m² at {tscDeVal}% DE
                      {tscReqVal > 0 ? (tscRem >= 0 ? ` · Required ${formatNum(tscReqVal, 0)} m² leaves ${formatNum(tscRem, 1)} kg spare` : ` · SHORT by ${formatNum(-tscRem, 1)} kg for ${formatNum(tscReqVal, 0)} m²`) : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Total Coverage Area</div>
                      <div><span className="tv">{formatNum(tscCov, 0)}</span><span className="tu">m²</span></div>
                      <div className="tn">at {tscTVal} µm · {tscDeVal}% DE</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Wire Consumption per m²</div>
                      <div><span className="tv">{formatNum(tscPerM2, 3)}</span><span className="tu">kg/m²</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Remaining Wire</div>
                      <div><span className="tv">{tscRem === null ? '—' : formatNum(tscRem, 1)}</span><span className="tu">kg</span></div>
                      <div className="tn">{tscRem === null ? 'Enter required area' : (tscRem >= 0 ? `after coating ${formatNum(tscReqVal, 0)} m²` : 'SHORTFALL — order more wire')}</div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Material Utilization</div>
                      <div><span className="tv">{tscUt === null ? '—' : formatNum(tscUt, 1)}</span><span className="tu">%</span></div>
                      <div className="tn">{tscUt === null ? 'Enter required area' : 'of available stock used'}</div>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Available Wire</span><span className="dv">{formatNum(tscWVal, 1)} kg</span></div>
                    <div className="dr"><span className="dk">TSA Thickness</span><span className="dv">{tscTVal} µm</span></div>
                    <div className="dr"><span className="dk">Deposition Efficiency</span><span className="dv">{tscDeVal}%</span></div>
                    <div className="dr"><span className="dk">Density</span><span className="dv">{tscDenVal} g/cm³</span></div>
                    <div className="dr"><span className="dk">Wire per m²</span><span className="dv">{formatNum(tscPerM2, 3)} kg/m²</span></div>
                    <div className="dr"><span className="dk">Total Coverage Area</span><span className="dv">{formatNum(tscCov, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Required Area</span><span className="dv">{tscReqVal > 0 ? `${formatNum(tscReqVal, 0)} m²` : '—'}</span></div>
                    <div className="dr"><span className="dk">Remaining Wire</span><span className="dv">{tscRem === null ? '—' : `${formatNum(tscRem, 1)} kg`}</span></div>
                    <div className="dr"><span className="dk">Material Utilization</span><span className="dv">{tscUt === null ? '—' : `${formatNum(tscUt, 1)}%`}</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`TSA Coverage: ${formatNum(tscCov, 0)} m² from ${tscWVal} kg wire @ ${tscTVal} µm.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TSA-3 : Deposition Efficiency ── */}
      {currentTab === 'eff' && (
        <div className="sub-sec card active" id="tsa-eff">
          <div className="ch">
            <div className="ci">🎯</div>
            <div>
              <div className="ct">TSA Deposition Efficiency Calculator</div>
              <div className="cs">Key TSA performance indicator — deposited ÷ consumed × 100</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('tsa-eff')}>📖 Guideline</button>
            <div className="ctag">PRO · TSA-3</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Wire Consumed <span className="lh">kg</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tseW}
                      onChange={e => setTseW(e.target.value)}
                      placeholder="e.g. 120"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Coating Weight Deposited <span className="lh">kg</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tseD}
                      onChange={e => setTseD(e.target.value)}
                      placeholder="e.g. 78"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcTse}>
                ▶ Calculate Efficiency
              </button>
              <button className="btn-reset" onClick={() => { setTseW(''); setTseD(''); setHasTseCalculated(false); }}>↺ Reset</button>
            </div>

            {hasTseCalculated && tseWVal > 0 && tseDVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Deposition Efficiency Result</div>

                  <div style={{
                    background: tseRating[1] === 'warn' ? '#FFF8E1' : tseRating[1] === 'fail' ? '#FFEBEE' : '#E8F5E9',
                    border: `1.5px solid ${tseRating[1] === 'warn' ? 'rgba(245,127,23,.4)' : tseRating[1] === 'fail' ? 'rgba(211,47,47,.35)' : 'rgba(46,125,50,.35)'}`,
                    borderRadius: 'var(--r)',
                    padding: '13px 16px',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '19px',
                      fontWeight: 700,
                      color: tseRating[1] === 'warn' ? '#8B4500' : tseRating[1] === 'fail' ? '#B71C1C' : '#1B5E20'
                    }}>
                      {tseRating[2]} Deposition Efficiency {formatNum(tseEff, 1)}% — {tseRating[0]}
                    </div>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: tseRating[1] === 'warn' ? '#B26A00' : tseRating[1] === 'fail' ? '#C62828' : '#2E7D32',
                      marginTop: '3px'
                    }}>
                      {formatNum(tseDVal, 1)} kg deposited of {formatNum(tseWVal, 1)} kg consumed · {formatNum(tseLoss, 1)} kg lost ({formatNum(100 - tseEff, 1)}%)
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Deposition Efficiency</div>
                      <div><span className="tv">{formatNum(tseEff, 1)}</span><span className="tu">%</span></div>
                      <div className="tn">{tseRating[0]} performance</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Material Loss</div>
                      <div><span className="tv">{formatNum(tseLoss, 1)}</span><span className="tu">kg</span></div>
                      <div className="tn">{formatNum(100 - tseEff, 1)}% overspray / fume / bounce-off</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <div style={{ position: 'relative', background: 'linear-gradient(90deg,#C62828 0%,#C62828 50%,#E8700A 60%,#1565C0 70%,#2E7D32 100%)', height: '20px', borderRadius: '20px', border: '1px solid var(--bdr)' }}>
                      <div style={{ position: 'absolute', left: `${Math.min(100, tseEff)}%`, top: '-5px', bottom: '-5px', width: '4px', background: '#111', borderRadius: '2px', transform: 'translateX(-50%)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--txt3)', marginTop: '3px' }}>
                      <span>0 Poor</span><span>50 Average</span><span>60 Good</span><span>70 Excellent</span><span>100%</span>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Wire Consumed</span><span className="dv">{formatNum(tseWVal, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Coating Deposited</span><span className="dv">{formatNum(tseDVal, 1)} kg</span></div>
                    <div className="dr"><span className="dk">Deposition Efficiency</span><span className="dv">{formatNum(tseEff, 1)}%</span></div>
                    <div className="dr"><span className="dk">Material Loss</span><span className="dv">{formatNum(tseLoss, 1)} kg ({formatNum(100 - tseEff, 1)}%)</span></div>
                    <div className="dr"><span className="dk">Performance Rating</span><span className="dv">{tseRating[0]}</span></div>
                  </div>

                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E1F5FE', borderRadius: 'var(--r)', borderLeft: '3px solid var(--gi)', fontSize: '11.5px', color: 'var(--txt2)' }}>
                    <strong style={{ color: 'var(--gi)' }}>Rating:</strong> &gt;70% Excellent · 60–70% Good · 50–60% Average · &lt;50% Poor &nbsp;|&nbsp; ISO 2063 · AWS C2.18 · AMPP Good Thermal Spray Practice
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`TSA Deposition Efficiency: ${formatNum(tseEff, 1)}% (${tseRating[0]}).`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TSA-4 : Thickness ── */}
      {currentTab === 'thk' && (
        <div className="sub-sec card active" id="tsa-thk">
          <div className="ch">
            <div className="ci">🔎</div>
            <div>
              <div className="ct">TSA Thickness Calculator</div>
              <div className="cs">Achieved thickness from deposited weight — production control &amp; QA verification</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('tsa-thk')}>📖 Guideline</button>
            <div className="ctag">PRO · TSA-4</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tstA}
                      onChange={e => setTstA(e.target.value)}
                      placeholder="e.g. 50"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Deposited Aluminium Weight <span className="lh">kg</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tstW}
                      onChange={e => setTstW(e.target.value)}
                      placeholder="e.g. 33.75"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Aluminium Density <span className="lh">g/cm³</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tstDen}
                      onChange={e => setTstDen(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <span className="uu">g/cm³</span>
                  </div>
                </div>
                <div className="field">
                  <label>Specified Thickness <span className="lh">µm · optional — for pass/fail</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tstSpec}
                      onChange={e => setTstSpec(e.target.value)}
                      placeholder="e.g. 250"
                      min="0"
                      step="any"
                    />
                    <span className="uu">µm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcTst}>
                ▶ Calculate Thickness
              </button>
              <button className="btn-reset" onClick={() => { setTstA(''); setTstW(''); setTstDen('2.70'); setTstSpec(''); setHasTstCalculated(false); }}>↺ Reset</button>
            </div>

            {hasTstCalculated && tstAVal > 0 && tstWVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Thickness Verification Result</div>

                  <div style={{
                    background: tstOk === null ? '#E8F5E9' : (tstOk ? '#E8F5E9' : '#FFEBEE'),
                    border: `1.5px solid ${tstOk === null ? 'rgba(46,125,50,.35)' : (tstOk ? 'rgba(46,125,50,.35)' : 'rgba(211,47,47,.35)')}`,
                    borderRadius: 'var(--r)',
                    padding: '13px 16px',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '19px',
                      fontWeight: 700,
                      color: tstOk === null ? '#1B5E20' : (tstOk ? '#1B5E20' : '#B71C1C')
                    }}>
                      {tstOk === null ? '🔎' : (tstOk ? '✅' : '❌')} Achieved Thickness ≈ {formatNum(tstThk, 0)} µm{tstOk === null ? '' : (tstOk ? ' — PASS' : ' — FAIL (below specified)')}
                    </div>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: tstOk === null ? '#2E7D32' : (tstOk ? '#2E7D32' : '#C62828'),
                      marginTop: '3px'
                    }}>
                      {formatNum(tstWVal, 2)} kg over {formatNum(tstAVal, 1)} m² @ {tstDenVal} g/cm³{tstSpecVal > 0 ? ` · Specified ${tstSpecVal} µm · Deviation ${tstDev >= 0 ? '+' : ''}${formatNum(tstDev, 1)}%` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Calculated TSA Thickness</div>
                      <div><span className="tv">{formatNum(tstThk, 0)}</span><span className="tu">µm</span></div>
                      <div className="tn">from deposited weight (mass-average)</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Thickness Deviation</div>
                      <div><span className="tv">{tstDev === null ? '—' : `${tstDev >= 0 ? '+' : ''}${formatNum(tstDev, 1)}`}</span><span className="tu">%</span></div>
                      <div className="tn">{tstSpecVal > 0 ? `vs specified ${tstSpecVal} µm — ${tstOk ? 'PASS' : 'FAIL'}` : 'Enter specified thickness'}</div>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Surface Area</span><span className="dv">{formatNum(tstAVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Deposited Weight</span><span className="dv">{formatNum(tstWVal, 2)} kg</span></div>
                    <div className="dr"><span className="dk">Density</span><span className="dv">{tstDenVal} g/cm³</span></div>
                    <div className="dr"><span className="dk">Calculated Thickness</span><span className="dv">{formatNum(tstThk, 1)} µm</span></div>
                    <div className="dr"><span className="dk">Specified Thickness</span><span className="dv">{tstSpecVal > 0 ? `${tstSpecVal} µm` : '—'}</span></div>
                    <div className="dr"><span className="dk">Deviation</span><span className="dv">{tstDev === null ? '—' : `${tstDev >= 0 ? '+' : ''}${formatNum(tstDev, 1)}%`}</span></div>
                    <div className="dr"><span className="dk">Status</span><span className="dv">{tstOk === null ? '—' : (tstOk ? 'PASS' : 'FAIL — verify with magnetic gauge per ISO 2063-2')}</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`Achieved TSA Thickness: ${formatNum(tstThk, 0)} µm.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TSA-5 : Productivity ── */}
      {currentTab === 'prod' && (
        <div className="sub-sec card active" id="tsa-prod">
          <div className="ch">
            <div className="ci">⏱️</div>
            <div>
              <div className="ct">TSA Productivity Calculator</div>
              <div className="cs">Production efficiency — m²/hr · kg/hr · per operator · daily output</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('tsa-prod')}>📖 Guideline</button>
            <div className="ctag">PRO · TSA-5</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Surface Area Completed <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tspA}
                      onChange={e => setTspA(e.target.value)}
                      placeholder="e.g. 120"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Working Hours</label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tspH}
                      onChange={e => setTspH(e.target.value)}
                      placeholder="e.g. 8"
                      min="0"
                      step="any"
                    />
                    <span className="uu">hrs</span>
                  </div>
                </div>
                <div className="field">
                  <label>Number of Operators</label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tspN}
                      onChange={e => setTspN(e.target.value)}
                      min="1"
                      step="1"
                    />
                    <span className="uu">nos</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wire Consumption <span className="lh">kg · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tspW}
                      onChange={e => setTspW(e.target.value)}
                      placeholder="e.g. 130"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Shift Length <span className="lh">hrs · for daily output</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tspSh}
                      onChange={e => setTspSh(e.target.value)}
                      min="1"
                      max="24"
                      step="any"
                    />
                    <span className="uu">hrs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcTsp}>
                ▶ Calculate Productivity
              </button>
              <button className="btn-reset" onClick={() => { setTspA(''); setTspH(''); setTspN('1'); setTspW(''); setTspSh('8'); setHasTspCalculated(false); }}>↺ Reset</button>
            </div>

            {hasTspCalculated && tspAVal > 0 && tspHVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>Productivity Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      ⏱️ Productivity {formatNum(tspProd, 1)} m²/hr — {formatNum(tspDaily, 0)} m² per {tspShVal}-hr day
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      {tspNVal} operator(s) · {formatNum(tspOp, 2)} m²/operator/hr{tspWr !== null ? ` · wire rate ${formatNum(tspWr, 1)} kg/hr` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Productivity</div>
                      <div><span className="tv">{formatNum(tspProd, 1)}</span><span className="tu">m²/hr</span></div>
                      <div className="tn">{formatNum(tspAVal, 0)} m² in {tspHVal} hrs</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Wire Consumption Rate</div>
                      <div><span className="tv">{tspWr === null ? '—' : formatNum(tspWr, 1)}</span><span className="tu">kg/hr</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Operator Productivity</div>
                      <div><span className="tv">{formatNum(tspOp, 2)}</span><span className="tu">m²/op/hr</span></div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Estimated Daily Output</div>
                      <div><span className="tv">{formatNum(tspDaily, 0)}</span><span className="tu">m²/day</span></div>
                      <div className="tn">at {tspShVal} hr/shift</div>
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Area Completed</span><span className="dv">{formatNum(tspAVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Working Hours</span><span className="dv">{tspHVal} hrs</span></div>
                    <div className="dr"><span className="dk">Operators</span><span className="dv">{tspNVal}</span></div>
                    <div className="dr"><span className="dk">Wire Used</span><span className="dv">{tspWVal > 0 ? `${formatNum(tspWVal, 1)} kg` : '—'}</span></div>
                    <div className="dr"><span className="dk">Productivity</span><span className="dv">{formatNum(tspProd, 2)} m²/hr</span></div>
                    <div className="dr"><span className="dk">Wire Consumption Rate</span><span className="dv">{tspWr === null ? '—' : `${formatNum(tspWr, 2)} kg/hr`}</span></div>
                    <div className="dr"><span className="dk">Operator Productivity</span><span className="dv">{formatNum(tspOp, 2)} m²/operator/hr</span></div>
                    <div className="dr"><span className="dk">Estimated Daily Output</span><span className="dv">{formatNum(tspDaily, 0)} m² ({tspShVal} hr shift)</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`TSA Productivity: ${formatNum(tspProd, 1)} m²/hr.`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TSA-6 : Cost ── */}
      {currentTab === 'cost' && (
        <div className="sub-sec card active" id="tsa-cost">
          <div className="ch">
            <div className="ci">💰</div>
            <div>
              <div className="ct">TSA Cost Calculator</div>
              <div className="cs">Total TSA application cost &amp; ₹/m² — budgeting and estimation</div>
            </div>
            <button className="gd-btn" onClick={() => openGuideline('tsa-cost')}>📖 Guideline</button>
            <div className="ctag">PRO · TSA-6</div>
          </div>
          <div className="cb">
            <div className="input-section">
              <div className="g2">
                <div className="field">
                  <label>Surface Area <span className="lh">m²</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskA}
                      onChange={e => setTskA(e.target.value)}
                      placeholder="e.g. 100"
                      min="0"
                      step="any"
                    />
                    <span className="uu">m²</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wire Consumption <span className="lh">kg</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskW}
                      onChange={e => setTskW(e.target.value)}
                      placeholder="e.g. 100"
                      min="0"
                      step="any"
                    />
                    <span className="uu">kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Wire Cost <span className="lh">₹/kg</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskWc}
                      onChange={e => setTskWc(e.target.value)}
                      placeholder="e.g. 850"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹/kg</span>
                  </div>
                </div>
                <div className="field">
                  <label>Labour Cost <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskL}
                      onChange={e => setTskL(e.target.value)}
                      placeholder="e.g. 30000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Equipment Cost <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskE}
                      onChange={e => setTskE(e.target.value)}
                      placeholder="e.g. 20000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Consumable Cost <span className="lh">₹ · gas, grit, PPE</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskC}
                      onChange={e => setTskC(e.target.value)}
                      placeholder="e.g. 10000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Sealer Cost <span className="lh">₹</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskS}
                      onChange={e => setTskS(e.target.value)}
                      placeholder="e.g. 15000"
                      min="0"
                      step="any"
                    />
                    <span className="uu">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label>Overhead <span className="lh">% · optional</span></label>
                  <div className="iw">
                    <input
                      type="number"
                      value={tskOh}
                      onChange={e => setTskOh(e.target.value)}
                      min="0"
                      max="100"
                      step="any"
                    />
                    <span className="uu">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleCalcTsk}>
                ▶ Calculate TSA Cost
              </button>
              <button className="btn-reset" onClick={() => {
                setTskA(''); setTskW(''); setTskWc(''); setTskL('0'); setTskE('0'); setTskC('0'); setTskS('0'); setTskOh('0'); setHasTskCalculated(false);
              }}>↺ Reset</button>
            </div>

            {hasTskCalculated && tskAVal > 0 && tskWVal > 0 && tskWcVal > 0 && (
              <div className="res" style={{ display: 'block' }}>
                <div className="output-section">
                  <div className="rh"><span className="pd"></span>TSA Cost Result</div>

                  <div style={{ background: '#E8F5E9', border: '1.5px solid rgba(46,125,50,.35)', borderRadius: 'var(--r)', padding: '13px 16px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: '#1B5E20' }}>
                      💰 Total TSA Cost {formatCur(tskTot)} — {formatCur(tskPerM2)} / m²
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2E7D32', marginTop: '3px' }}>
                      Material {formatCur(tskMat)} ({formatNum((tskMat / tskTot) * 100, 0)}%) · Labour {formatCur(tskLVal)} · Equipment {formatCur(tskEVal)} · Consumables {formatCur(tskCVal)} · Sealer {formatCur(tskSVal)}{tskOhVal > 0 ? ` · OH ${tskOhVal}% = ${formatCur(tskOhAmt)}` : ''}
                    </div>
                  </div>

                  <div className="tls">
                    <div className="tile tp">
                      <div className="tl">Total Project Cost</div>
                      <div><span className="tv">{formatCur(tskTot)}</span></div>
                      <div className="tn">{tskOhVal > 0 ? `incl. ${tskOhVal}% overhead` : 'no overhead applied'}</div>
                    </div>
                    <div className="tile ts">
                      <div className="tl">Cost per m²</div>
                      <div><span className="tv">{formatCur(tskPerM2)}</span><span className="tu">/m²</span></div>
                    </div>
                    <div className="tile ti">
                      <div className="tl">Material (Wire) Cost</div>
                      <div><span className="tv" style={{ fontSize: '22px' }}>{formatCur(tskMat)}</span></div>
                      <div className="tn">{formatNum(tskWVal, 0)} kg × {formatCur(tskWcVal)}/kg</div>
                    </div>
                    <div className="tile tg">
                      <div className="tl">Procurement Quantity</div>
                      <div><span className="tv">{formatNum(tskProc, 1)}</span><span className="tu">kg</span></div>
                      <div className="tn">incl. 5% contingency</div>
                    </div>
                  </div>

                  {/* Cost Breakdown Visual */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: '6px' }}>Cost Breakdown</div>
                      <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${tskStops.join(',')})`, boxShadow: 'var(--sh)' }} />
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--txt2)', lineHeight: 2 }}>
                      {tskParts.filter(x => x[1] > 0).map((x, idx) => (
                        <div key={idx}>
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: x[2], marginRight: '7px' }} />
                          {x[0]}: <strong>{formatCur(x[1])}</strong> ({formatNum((x[1] / tskPtot) * 100, 1)}%)
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="input-summary" style={{ marginTop: '14px' }}>
                    <div className="input-summary-label">📝 Summary</div>
                    <div className="dr"><span className="dk">Surface Area</span><span className="dv">{formatNum(tskAVal, 1)} m²</span></div>
                    <div className="dr"><span className="dk">Wire</span><span className="dv">{formatNum(tskWVal, 1)} kg × {formatCur(tskWcVal)}/kg = {formatCur(tskMat)}</span></div>
                    <div className="dr"><span className="dk">Labour</span><span className="dv">{formatCur(tskLVal)}</span></div>
                    <div className="dr"><span className="dk">Equipment</span><span className="dv">{formatCur(tskEVal)}</span></div>
                    <div className="dr"><span className="dk">Consumables</span><span className="dv">{formatCur(tskCVal)}</span></div>
                    <div className="dr"><span className="dk">Sealer</span><span className="dv">{formatCur(tskSVal)}</span></div>
                    <div className="dr"><span className="dk">Overhead</span><span className="dv">{tskOhVal}% = {formatCur(tskOhAmt)}</span></div>
                    <div className="dr"><span className="dk">TOTAL PROJECT COST</span><span className="dv" style={{ fontWeight: 800, color: 'var(--brand-crimson)' }}>{formatCur(tskTot)}</span></div>
                    <div className="dr"><span className="dk">Cost per m²</span><span className="dv">{formatCur(tskPerM2)}</span></div>
                    <div className="dr"><span className="dk">Procurement Quantity (+5%)</span><span className="dv">{formatNum(tskProc, 1)} kg</span></div>
                  </div>
                </div>

                <div className="action-bar">
                  <button className="btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                  <button className="btn-share" onClick={() => {
                    navigator.clipboard?.writeText(`Total TSA Cost: ${formatCur(tskTot)} (${formatCur(tskPerM2)}/m²).`);
                    addToast('Copied', 'Summary copied.', 'success');
                  }}>📤 Share Text</button>
                  <button className="btn-print" onClick={() => addToast('Export', 'CSV Exported.', 'success')}>⬇ Export Excel (CSV)</button>
                  <button className="btn-print xls-btn">📊 Excel Report</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
