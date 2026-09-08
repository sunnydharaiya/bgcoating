import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Calculator, 
  Info, 
  BookOpen, 
  Flame, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle,
  FlaskConical,
  TrendingUp,
  Coins,
  Scale,
  Clock,
  Box
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

export default function TSASuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Active Sub-Tab: 'wire' | 'cov' | 'eff' | 'thk' | 'prod' | 'cost' | 'sealer' | 'mandrel' | 'adhesion'
  const [currentTab, setCurrentTab] = useState('wire');

  useEffect(() => {
    if (activeSubTool === 'tsa-cov' || activeSubTool === 'tsa_cov' || activeSubTool === 'tsa_area_coverage') setCurrentTab('cov');
    else if (activeSubTool === 'tsa-eff' || activeSubTool === 'tsa_eff' || activeSubTool === 'tsa_deposition') setCurrentTab('eff');
    else if (activeSubTool === 'tsa-thk' || activeSubTool === 'tsa_thk' || activeSubTool === 'tsa_thickness' || activeSubTool === 'tsa_thickness_verify') setCurrentTab('thk');
    else if (activeSubTool === 'tsa-prod' || activeSubTool === 'tsa_prod' || activeSubTool === 'tsa_productivity') setCurrentTab('prod');
    else if (activeSubTool === 'tsa-cost' || activeSubTool === 'tsa_cost') setCurrentTab('cost');
    else if (activeSubTool === 'tsa_sealer_calc' || activeSubTool === 'tsa_sealer_cal') setCurrentTab('sealer');
    else if (activeSubTool === 'tsa_mandrel_eval') setCurrentTab('mandrel');
    else if (activeSubTool === 'tsa_adhesion_matrix') setCurrentTab('adhesion');
    else setCurrentTab('wire');
  }, [activeSubTool]);

  const handleTabSwitch = (tabKey, toolId) => {
    setCurrentTab(tabKey);
    if (onSubToolChange) onSubToolChange(toolId);
  };

  // ----------------------------------------------------
  // Tool 1: 1.1 TSA Wire Consumption States
  // ----------------------------------------------------
  const [area, setArea] = useState('100'); // m²
  const [dft, setDft] = useState('250'); // µm
  const [wireType, setWireType] = useState('Al995'); // 'Al995' | 'ZnAl8515' | 'Al5Mg'
  const [transferEff, setTransferEff] = useState('65'); // %
  const [materialLossPct, setMaterialLossPct] = useState('5'); // % contingency
  const [wireDia, setWireDia] = useState('2.3'); // mm
  const [wireCostPerKg, setWireCostPerKg] = useState('420'); // ₹/kg

  const wireDensity = wireType === 'Al995' ? 2.70 : wireType === 'Al5Mg' ? 2.66 : 5.80; // g/cm³
  const theoMassKg = (Number(area) || 0) * ((Number(dft) || 0) / 1000) * wireDensity;
  const actualWireKg = Number(transferEff) > 0 ? theoMassKg / (Number(transferEff) / 100) : 0;
  const procurementWireKg = actualWireKg * (1 + (Number(materialLossPct) || 0) / 100);
  const wireRadiusCm = (Number(wireDia) || 2.3) / 20; // cm
  const wireCrossSecArea = Math.PI * Math.pow(wireRadiusCm, 2); // cm²
  const wireLengthMeters = (actualWireKg * 1000) / (wireCrossSecArea * wireDensity * 100);
  const totalWireCost = (Number(wireCostPerKg) || 0) * procurementWireKg;
  const costPerM2 = Number(area) > 0 ? totalWireCost / Number(area) : 0;

  // ----------------------------------------------------
  // Tool 2: 1.2 TSA Area Coverage States
  // ----------------------------------------------------
  const [availWireKg, setAvailWireKg] = useState('500'); // kg
  const [covDft, setCovDft] = useState('250'); // µm
  const [covEff, setCovEff] = useState('65'); // %
  const [covDensity, setCovDensity] = useState('2.70'); // g/cm³
  const [covReqArea, setCovReqArea] = useState('450'); // m²

  const kgPerM2Req = Number(covEff) > 0 ? ((Number(covDft) || 0) / 1000 * (Number(covDensity) || 2.70)) / (Number(covEff) / 100) : 0;
  const totalAchievableArea = kgPerM2Req > 0 ? (Number(availWireKg) || 0) / kgPerM2Req : 0;
  const reqTotalWire = (Number(covReqArea) || 0) * kgPerM2Req;
  const wireBalanceKg = (Number(availWireKg) || 0) - reqTotalWire;

  // ----------------------------------------------------
  // Tool 3: 1.3 TSA Deposition Efficiency States
  // ----------------------------------------------------
  const [effWireConsumed, setEffWireConsumed] = useState('120'); // kg
  const [effCoatingDeposited, setEffCoatingDeposited] = useState('78'); // kg

  const calculatedEff = Number(effWireConsumed) > 0 ? ((Number(effCoatingDeposited) || 0) / Number(effWireConsumed)) * 100 : 0;
  const effRating = calculatedEff >= 70 ? 'Excellent' : calculatedEff >= 60 ? 'Good' : calculatedEff >= 50 ? 'Average' : 'Poor';
  const effRatingColor = calculatedEff >= 70 ? 'text-emerald-600' : calculatedEff >= 60 ? 'text-blue-600' : calculatedEff >= 50 ? 'text-amber-600' : 'text-rose-600';
  const effWastageKg = Math.max(0, (Number(effWireConsumed) || 0) - (Number(effCoatingDeposited) || 0));

  // ----------------------------------------------------
  // Tool 4: 1.4 TSA Thickness Verification States
  // ----------------------------------------------------
  const [thkArea, setThkArea] = useState('50'); // m²
  const [thkDepWeight, setThkDepWeight] = useState('33.75'); // kg
  const [thkDensity, setThkDensity] = useState('2.70'); // g/cm³
  const [thkSpecified, setThkSpecified] = useState('250'); // µm

  const calculatedThkUm = (Number(thkArea) > 0 && Number(thkDensity) > 0)
    ? ((Number(thkDepWeight) || 0) / (Number(thkArea) * Number(thkDensity))) * 1000
    : 0;
  const isThkPass = calculatedThkUm >= (Number(thkSpecified) || 0);
  const thkDeviationPct = Number(thkSpecified) > 0 ? ((calculatedThkUm - Number(thkSpecified)) / Number(thkSpecified)) * 100 : 0;

  // ----------------------------------------------------
  // Tool 5: 1.5 TSA Productivity States
  // ----------------------------------------------------
  const [prodArea, setProdArea] = useState('120'); // m²
  const [prodHours, setProdHours] = useState('8'); // hrs
  const [prodOperators, setProdOperators] = useState('2'); // nos
  const [prodWireUsed, setProdWireUsed] = useState('125'); // kg
  const [prodShiftHours, setProdShiftHours] = useState('8'); // hrs

  const m2PerHourOverall = Number(prodHours) > 0 ? (Number(prodArea) || 0) / Number(prodHours) : 0;
  const kgPerHourWire = Number(prodHours) > 0 ? (Number(prodWireUsed) || 0) / Number(prodHours) : 0;
  const m2PerOpHour = Number(prodOperators) > 0 ? m2PerHourOverall / Number(prodOperators) : 0;
  const dailyOutputM2 = m2PerHourOverall * (Number(prodShiftHours) || 8);

  // ----------------------------------------------------
  // Tool 6: 1.6 TSA Cost Estimation States
  // ----------------------------------------------------
  const [costArea, setCostArea] = useState('100'); // m²
  const [costWireKg, setCostWireKg] = useState('104'); // kg
  const [costWireRate, setCostWireRate] = useState('420'); // ₹/kg
  const [costLabour, setCostLabour] = useState('45000'); // ₹
  const [costEquipment, setCostEquipment] = useState('35000'); // ₹
  const [costConsumables, setCostConsumables] = useState('20000'); // ₹ (gas, grit)
  const [costSealer, setCostSealer] = useState('15000'); // ₹
  const [costOverheadPct, setCostOverheadPct] = useState('10'); // %

  const costDirectMaterial = (Number(costWireKg) || 0) * (Number(costWireRate) || 0);
  const costDirectSubtotal = costDirectMaterial + (Number(costLabour) || 0) + (Number(costEquipment) || 0) + (Number(costConsumables) || 0) + (Number(costSealer) || 0);
  const costTotalGrand = costDirectSubtotal * (1 + (Number(costOverheadPct) || 0) / 100);
  const costGrandPerM2 = Number(costArea) > 0 ? costTotalGrand / Number(costArea) : 0;

  // ----------------------------------------------------
  // Tool 7: Sealer Paint Coverage States
  // ----------------------------------------------------
  const [sealerType, setSealerType] = useState('Silicone Aluminum (High Temp 540°C)');
  const [sealerArea, setSealerArea] = useState('500');
  const [sealerVsPct, setSealerVsPct] = useState('28');
  const [sealerDft, setSealerDft] = useState('30');
  const [porosityAbsorption, setPorosityAbsorption] = useState('25');
  const [thinnerDilutionPct, setThinnerDilutionPct] = useState('15');
  const [sealerPricePerLitre, setSealerPricePerLitre] = useState('850');

  const theoSealerSpread = Number(sealerDft) > 0 ? (Number(sealerVsPct) * 10) / Number(sealerDft) : 0;
  const grossLossFactor = 1 + (Number(porosityAbsorption) / 100);
  const reqSealerLitres = theoSealerSpread > 0 ? (Number(sealerArea) / theoSealerSpread) * grossLossFactor : 0;
  const reqThinnerLitres = reqSealerLitres * (Number(thinnerDilutionPct) / 100);
  const totalSealerCost = reqSealerLitres * (Number(sealerPricePerLitre) || 0);

  // ----------------------------------------------------
  // Tool 8: 180° Mandrel Bend Test States
  // ----------------------------------------------------
  const [mandrelDiameter, setMandrelDiameter] = useState('12.7');
  const [panelThickness, setPanelThickness] = useState('1.25');
  const [tsaThicknessTested, setTsaThicknessTested] = useState('280');
  const [crackingVisual, setCrackingVisual] = useState('micro_cracks');
  const [tapeAdhesionPull, setTapeAdhesionPull] = useState('pass');

  const isMandrelPass = crackingVisual !== 'flaking_spall' && tapeAdhesionPull === 'pass';

  // ----------------------------------------------------
  // Tool 9: Pull-off Adhesion Matrix States
  // ----------------------------------------------------
  const [testStandard, setTestStandard] = useState('ISO 2063 / ASTM D4541');
  const [dollySize, setDollySize] = useState('20');
  const [dollyD1, setDollyD1] = useState('9.4');
  const [dollyD2, setDollyD2] = useState('8.8');
  const [dollyD3, setDollyD3] = useState('10.2');
  const [failureMode, setFailureMode] = useState('Substrate-TSA Cohesive (>85% within TSA)');
  const [minReqAdhesion, setMinReqAdhesion] = useState('7.0');

  const avgAdhesion = ((parseFloat(dollyD1) || 0) + (parseFloat(dollyD2) || 0) + (parseFloat(dollyD3) || 0)) / 3;
  const isAdhesionPass = avgAdhesion >= (parseFloat(minReqAdhesion) || 7.0) && (parseFloat(dollyD1) >= 6.0 && parseFloat(dollyD2) >= 6.0 && parseFloat(dollyD3) >= 6.0);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = '';
    if (currentTab === 'wire') {
      text = `BG CoatingOS™ — 10.1 TSA Wire Consumption\nAlloy: ${wireType} | Area: ${area} m² | DFT: ${dft} µm | DE: ${transferEff}%\nActual Wire Required: ${formatNum(actualWireKg, 1)} kg | Procurement: ${formatNum(procurementWireKg, 1)} kg\nEstimated Wire Length: ${formatNum(wireLengthMeters, 0)} m | Total Cost: ${formatCur(totalWireCost)} (${formatCur(costPerM2)}/m²)`;
    } else if (currentTab === 'cov') {
      text = `BG CoatingOS™ — 10.2 TSA Area Coverage\nAvailable Wire: ${availWireKg} kg @ ${covDft} µm & ${covEff}% DE\nTotal Achievable Coverage: ${formatNum(totalAchievableArea, 1)} m²\nRequired Area: ${covReqArea} m² | Wire Balance: ${formatNum(wireBalanceKg, 1)} kg`;
    } else if (currentTab === 'eff') {
      text = `BG CoatingOS™ — 10.3 TSA Deposition Efficiency\nWire Consumed: ${effWireConsumed} kg | Coating Deposited: ${effCoatingDeposited} kg\nCalculated Efficiency: ${formatNum(calculatedEff, 1)}% (${effRating}) | Waste Mass: ${formatNum(effWastageKg, 1)} kg`;
    } else if (currentTab === 'thk') {
      text = `BG CoatingOS™ — 10.4 TSA Thickness Verification\nArea: ${thkArea} m² | Deposited Weight: ${thkDepWeight} kg\nCalculated Thickness: ${formatNum(calculatedThkUm, 1)} µm vs Target ${thkSpecified} µm (${isThkPass ? 'PASS' : 'FAIL'})`;
    } else if (currentTab === 'prod') {
      text = `BG CoatingOS™ — 10.5 TSA Productivity\nCompleted: ${prodArea} m² in ${prodHours} hrs with ${prodOperators} operators\nRates: ${formatNum(m2PerHourOverall, 1)} m²/hr | ${formatNum(kgPerHourWire, 1)} kg/hr | Daily (${prodShiftHours}h): ${formatNum(dailyOutputM2, 1)} m²/day`;
    } else if (currentTab === 'cost') {
      text = `BG CoatingOS™ — 10.6 TSA Cost Estimation\nArea: ${costArea} m² | Total Cost: ${formatCur(costTotalGrand)} (${formatCur(costGrandPerM2)}/m²)\nDirect Subtotal: ${formatCur(costDirectSubtotal)} | Wire Share: ${formatCur(costDirectMaterial)}`;
    } else if (currentTab === 'sealer') {
      text = `BG CoatingOS™ — TSA Penetrating Sealer Coverage\nSealer: ${sealerType} | Area: ${sealerArea} m² | Reqd: ${formatNum(reqSealerLitres, 1)} L | Cost: ${formatCur(totalSealerCost)}`;
    } else if (currentTab === 'mandrel') {
      text = `BG CoatingOS™ — TSA 180° Mandrel Bend Test\nMandrel: ${mandrelDiameter} mm | Panel: ${panelThickness} mm | Verdict: ${isMandrelPass ? 'PASS' : 'FAIL'}`;
    } else {
      text = `BG CoatingOS™ — TSA Pull-off Adhesion Test\nReadings: ${dollyD1}, ${dollyD2}, ${dollyD3} MPa (Avg: ${formatNum(avgAdhesion, 2)} MPa) | Verdict: ${isAdhesionPass ? 'PASS' : 'FAIL'}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'TSA calculation report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs = [
    { id: 'wire', toolId: 'tsa-wire', label: '10.1 Wire Consumption', icon: Flame },
    { id: 'cov', toolId: 'tsa-cov', label: '10.2 Area Coverage', icon: Box },
    { id: 'eff', toolId: 'tsa-eff', label: '10.3 Deposition Efficiency', icon: Gauge },
    { id: 'thk', toolId: 'tsa-thk', label: '10.4 Thickness Verify', icon: Layers },
    { id: 'prod', toolId: 'tsa-prod', label: '10.5 Productivity', icon: Clock },
    { id: 'cost', toolId: 'tsa-cost', label: '10.6 TSA Cost', icon: Coins },
    { id: 'sealer', toolId: 'tsa_sealer_calc', label: 'Sealer Paint', icon: FlaskConical },
    { id: 'mandrel', toolId: 'tsa_mandrel_eval', label: '180° Bend Test', icon: ShieldCheck },
    { id: 'adhesion', toolId: 'tsa_adhesion_matrix', label: 'Adhesion Matrix', icon: Scale },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Suite Header */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section 10 · ISO 2063 / NACE SP0198 / AWS C2.18
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Thermal Spray Aluminium (TSA) Engineering Suite
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Complete technical calculation suite for Twin-Wire Arc Spray (TWAS) Aluminium &amp; Zn-Al (Wire take-off, coverage, deposition efficiency, thickness verify, productivity &amp; full costing).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline(currentTab === 'wire' ? 'tsa-wire' : currentTab === 'cov' ? 'tsa-cov' : currentTab === 'eff' ? 'tsa-eff' : currentTab === 'thk' ? 'tsa-thk' : currentTab === 'prod' ? 'tsa-prod' : currentTab === 'cost' ? 'tsa-cost' : 'tsa-wire')}
            className="px-3 py-1.5 rounded-lg bg-[#FFF4E3] hover:bg-[#FEE9C7] text-[#9E1B1E] border border-[#F3D2A0] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E87B1E]" />
            <span>📖 Guideline</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#E87B1E]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 text-white text-xs font-bold font-rajdhani uppercase tracking-wider transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Internal Tool Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-white border border-[#D8DEE5] rounded-xl shadow-[0_2px_8px_rgba(20,24,32,0.06)]">
        {navTabs.map(t => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabSwitch(t.id, t.toolId)}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                  : 'text-[#4E5B6A] hover:bg-[#F7F8FA] hover:text-[#1B222C]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7E8B99]'}`} />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 10.1 TSA Wire Consumption Tool Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'wire' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Wire Consumption Parameters
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alloy Wire Composition (ISO 14919)</label>
                <select
                  value={wireType}
                  onChange={e => setWireType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                >
                  <option value="Al995">Pure Aluminium Al 99.5% (Density 2.70 g/cm³ — ISO 14919 / AWS C2.25)</option>
                  <option value="Al5Mg">Aluminium-Magnesium Al-5Mg (Density 2.66 g/cm³)</option>
                  <option value="ZnAl8515">Zinc-Aluminium 85:15 Alloy (Density 5.80 g/cm³)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Surface Area (m²)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target TSA DFT (µm)</label>
                  <input
                    type="number"
                    value={dft}
                    onChange={e => setDft(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deposition Eff (%)</label>
                  <input
                    type="number"
                    value={transferEff}
                    onChange={e => setTransferEff(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material Loss (%)</label>
                  <input
                    type="number"
                    value={materialLossPct}
                    onChange={e => setMaterialLossPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wire Dia (mm)</label>
                  <select
                    value={wireDia}
                    onChange={e => setWireDia(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  >
                    <option value="1.6">1.6 mm (1/16″)</option>
                    <option value="2.0">2.0 mm</option>
                    <option value="2.3">2.3 mm (3/32″)</option>
                    <option value="3.2">3.2 mm (1/8″)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wire Unit Rate (₹/kg)</label>
                <input
                  type="number"
                  value={wireCostPerKg}
                  onChange={e => setWireCostPerKg(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-mono font-bold text-[#D97706] uppercase">TSA Demand Summary</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">ISO 2063-1</span>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Procurement Wire Quantity</span>
              <div className="text-4xl font-black text-[#D97706] font-mono mt-1">
                {formatNum(procurementWireKg, 1)} kg
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Actual Spray Demand: {formatNum(actualWireKg, 1)} kg · Net Deposited: {formatNum(theoMassKg, 1)} kg
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Estimated Wire Length</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatNum(wireLengthMeters, 0)} Meters</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Wire Cost / m²</span>
                <span className="text-sm font-bold text-emerald-700 font-mono">{formatCur(costPerM2)}/m²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10.2 TSA Area Coverage Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'cov' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Stock &amp; Coverage Inputs
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Wire (kg)</label>
                  <input
                    type="number"
                    value={availWireKg}
                    onChange={e => setAvailWireKg(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target DFT (µm)</label>
                  <input
                    type="number"
                    value={covDft}
                    onChange={e => setCovDft(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deposition Eff (%)</label>
                  <input
                    type="number"
                    value={covEff}
                    onChange={e => setCovEff(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Density (g/cm³)</label>
                  <input
                    type="number"
                    value={covDensity}
                    onChange={e => setCovDensity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Project Scope Area (m²)</label>
                <input
                  type="number"
                  value={covReqArea}
                  onChange={e => setCovReqArea(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-sky-50/30 border-2 border-sky-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase">Coverage Result</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${wireBalanceKg >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {wireBalanceKg >= 0 ? 'SURPLUS' : 'SHORTFALL'}
              </span>
            </div>

            <div className="bg-white border border-sky-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Achievable Surface Area</span>
              <div className="text-4xl font-black text-sky-600 font-mono mt-1">
                {formatNum(totalAchievableArea, 1)} m²
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Consumption Rate: {formatNum(kgPerM2Req, 2)} kg/m²
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Required Wire</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatNum(reqTotalWire, 1)} kg</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">{wireBalanceKg >= 0 ? 'Surplus Wire' : 'Shortfall Wire'}</span>
                <span className={`text-sm font-bold font-mono ${wireBalanceKg >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatNum(Math.abs(wireBalanceKg), 1)} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10.3 TSA Deposition Efficiency Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'eff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Trial Mass Balance Inputs
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wire Consumed (kg)</label>
                  <input
                    type="number"
                    value={effWireConsumed}
                    onChange={e => setEffWireConsumed(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coating Deposited (kg)</label>
                  <input
                    type="number"
                    value={effCoatingDeposited}
                    onChange={e => setEffCoatingDeposited(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase">Deposition Efficiency</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 ${effRatingColor}`}>
                {effRating}
              </span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Measured Deposition Efficiency</span>
              <div className={`text-4xl font-black font-mono mt-1 ${effRatingColor}`}>
                {formatNum(calculatedEff, 1)}%
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Overspray Loss / Waste Mass: {formatNum(effWastageKg, 1)} kg
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10.4 TSA Thickness Verification Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'thk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Mass-Average Thickness Inputs
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Surface Area (m²)</label>
                  <input
                    type="number"
                    value={thkArea}
                    onChange={e => setThkArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deposited Weight (kg)</label>
                  <input
                    type="number"
                    value={thkDepWeight}
                    onChange={e => setThkDepWeight(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alloy Density (g/cm³)</label>
                  <input
                    type="number"
                    value={thkDensity}
                    onChange={e => setThkDensity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specified DFT (µm)</label>
                  <input
                    type="number"
                    value={thkSpecified}
                    onChange={e => setThkSpecified(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase">Calculated Thickness</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isThkPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {isThkPass ? 'PASS ✓' : 'FAIL ✗'}
              </span>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Mass-Average Achieved DFT</span>
              <div className={`text-4xl font-black font-mono mt-1 ${isThkPass ? 'text-purple-600' : 'text-rose-600'}`}>
                {formatNum(calculatedThkUm, 1)} µm
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Specified: {thkSpecified} µm · Deviation: {formatNum(thkDeviationPct, 1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10.5 TSA Productivity Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'prod' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Productivity Parameters
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Completed Area (m²)</label>
                  <input
                    type="number"
                    value={prodArea}
                    onChange={e => setProdArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Working Hours (hrs)</label>
                  <input
                    type="number"
                    value={prodHours}
                    onChange={e => setProdHours(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operators</label>
                  <input
                    type="number"
                    value={prodOperators}
                    onChange={e => setProdOperators(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wire Used (kg)</label>
                  <input
                    type="number"
                    value={prodWireUsed}
                    onChange={e => setProdWireUsed(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Hours</label>
                  <input
                    type="number"
                    value={prodShiftHours}
                    onChange={e => setProdShiftHours(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase">Productivity Metrics</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">Real-Time</span>
            </div>

            <div className="bg-white border border-blue-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Overall Application Rate</span>
              <div className="text-4xl font-black text-blue-600 font-mono mt-1">
                {formatNum(m2PerHourOverall, 1)} m²/hr
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Per Operator: {formatNum(m2PerOpHour, 1)} m²/op·hr · Wire Rate: {formatNum(kgPerHourWire, 1)} kg/hr
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Projected Output per {prodShiftHours}h Shift</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{formatNum(dailyOutputM2, 1)} m²/day</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10.6 TSA Cost Estimation Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Cost Elements (₹)
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area (m²)</label>
                  <input
                    type="number"
                    value={costArea}
                    onChange={e => setCostArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wire (kg)</label>
                  <input
                    type="number"
                    value={costWireKg}
                    onChange={e => setCostWireKg(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (₹/kg)</label>
                  <input
                    type="number"
                    value={costWireRate}
                    onChange={e => setCostWireRate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Labour (₹)</label>
                  <input
                    type="number"
                    value={costLabour}
                    onChange={e => setCostLabour(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Equipment (₹)</label>
                  <input
                    type="number"
                    value={costEquipment}
                    onChange={e => setCostEquipment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consumables (₹)</label>
                  <input
                    type="number"
                    value={costConsumables}
                    onChange={e => setCostConsumables(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sealer (₹)</label>
                  <input
                    type="number"
                    value={costSealer}
                    onChange={e => setCostSealer(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overhead (%)</label>
                  <input
                    type="number"
                    value={costOverheadPct}
                    onChange={e => setCostOverheadPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-mono font-bold text-[#D97706] uppercase">TSA Cost Summary</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">Turnkey</span>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total Project Estimate</span>
              <div className="text-4xl font-black text-[#D97706] font-mono mt-1">
                {formatCur(costTotalGrand)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Unit Rate: {formatCur(costGrandPerM2)} / m²
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Direct Subtotal</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatCur(costDirectSubtotal)}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Wire Material Share</span>
                <span className="text-sm font-bold text-emerald-700 font-mono">{formatCur(costDirectMaterial)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Sealer Paint Coverage Tool Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'sealer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              TSA Penetrating Sealer Specification
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sealer Chemistry Type</label>
                <select
                  value={sealerType}
                  onChange={e => setSealerType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option>Silicone Aluminum (High Temp 540°C)</option>
                  <option>Low Viscosity Epoxy Sealer (Atmospheric / CUI)</option>
                  <option>Vinyl Ester Mist-Coat Sealer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coating Area (m²)</label>
                  <input
                    type="number"
                    value={sealerArea}
                    onChange={e => setSealerArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sealer Volume Solids (%)</label>
                  <input
                    type="number"
                    value={sealerVsPct}
                    onChange={e => setSealerVsPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Sealer DFT (µm)</label>
                  <input
                    type="number"
                    value={sealerDft}
                    onChange={e => setSealerDft(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TSA Porosity Soak-in Loss (%)</label>
                  <input
                    type="number"
                    value={porosityAbsorption}
                    onChange={e => setPorosityAbsorption(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thinner Addition Ratio (%)</label>
                  <input
                    type="number"
                    value={thinnerDilutionPct}
                    onChange={e => setThinnerDilutionPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sealer Price (₹/Litre)</label>
                  <input
                    type="number"
                    value={sealerPricePerLitre}
                    onChange={e => setSealerPricePerLitre(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase">Sealer Demand Results</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">ISO 2063 Mist Coat</span>
            </div>

            <div className="bg-white border border-blue-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Net Sealer Liquid Volume Required</span>
              <div className="text-4xl font-black text-blue-600 font-mono mt-1">
                {formatNum(reqSealerLitres, 1)} Litres
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Spreading Rate: {formatNum(theoSealerSpread, 1)} m²/L · Thinner: {formatNum(reqThinnerLitres, 1)} L
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Packaging (20L Drums)</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{Math.ceil(reqSealerLitres / 20)} Drums</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Estimated Material Cost</span>
                <span className="text-sm font-bold text-emerald-700 font-mono">{formatCur(totalSealerCost)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 180° Mandrel Bend Test Eval Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'mandrel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              ASTM D522 / ISO 2063 Bend Test Parameters
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cylindrical Mandrel Diameter</label>
                  <select
                    value={mandrelDiameter}
                    onChange={e => setMandrelDiameter(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="12.7">12.7 mm (0.50 inch — Standard)</option>
                    <option value="6.35">6.35 mm (0.25 inch — Extreme)</option>
                    <option value="25.4">25.4 mm (1.00 inch)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Test Panel Thickness (mm)</label>
                  <input
                    type="number"
                    value={panelThickness}
                    onChange={e => setPanelThickness(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TSA Coating DFT Tested (µm)</label>
                  <input
                    type="number"
                    value={tsaThicknessTested}
                    onChange={e => setTsaThicknessTested(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bend Angle (°)</label>
                  <input
                    type="number"
                    value="180"
                    disabled
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Visual Surface Observation after 180° Bend</label>
                <select
                  value={crackingVisual}
                  onChange={e => setCrackingVisual(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="micro_cracks">Micro-cracks visible only under 10x magnification (Acceptable)</option>
                  <option value="no_cracks">No visible cracks or fissures (Excellent Ductility)</option>
                  <option value="flaking_spall">Gross flaking, spallation or peeling from substrate (FAIL)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duct Tape Adhesion Pull over Bend</label>
                <select
                  value={tapeAdhesionPull}
                  onChange={e => setTapeAdhesionPull(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="pass">PASS: No metal flakes or particles lifted by adhesive tape</option>
                  <option value="fail">FAIL: Metal flakes pulled off by adhesive tape</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase">Flexibility Compliance</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isMandrelPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {isMandrelPass ? 'ACCEPTABLE ✓' : 'REJECTED ✗'}
              </span>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Mandrel Bend Verdict</span>
              <div className={`text-2xl md:text-3xl font-black font-mono mt-1 ${isMandrelPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isMandrelPass ? 'PASSES ISO 2063-2' : 'FLAKING / SPALLATION DETECTED'}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                {isMandrelPass ? 'Coating demonstrates sound metallurgical bond and ductility' : 'Adhesion failure or excessive oxide embrittlement present'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Pull-off Adhesion Matrix Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'adhesion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Adhesion Test Parameters
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dolly Diameter</label>
                  <select
                    value={dollySize}
                    onChange={e => setDollySize(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="20">20 mm (Standard Hydraulic)</option>
                    <option value="14">14 mm (High Strength Substrate)</option>
                    <option value="50">50 mm (Low Tensile)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Acceptance (MPa)</label>
                  <input
                    type="number"
                    value={minReqAdhesion}
                    onChange={e => setMinReqAdhesion(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dolly #1 (MPa)</label>
                  <input
                    type="number"
                    value={dollyD1}
                    onChange={e => setDollyD1(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dolly #2 (MPa)</label>
                  <input
                    type="number"
                    value={dollyD2}
                    onChange={e => setDollyD2(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dolly #3 (MPa)</label>
                  <input
                    type="number"
                    value={dollyD3}
                    onChange={e => setDollyD3(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Failure Mode Classification</label>
                <select
                  value={failureMode}
                  onChange={e => setFailureMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option>Substrate-TSA Cohesive (&gt;85% within TSA coating matrix)</option>
                  <option>Adhesive Failure at Steel-TSA Interface (Substrate peel)</option>
                  <option>Glue / Epoxy Failure to Dolly (&gt;50% Glue failure — Inconclusive Re-test)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase">Adhesion Result</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isAdhesionPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {isAdhesionPass ? 'COMPLIANT ✓' : 'NON-COMPLIANT ✗'}
              </span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Average Tensile Adhesion Strength</span>
              <div className={`text-4xl font-black font-mono mt-1 ${isAdhesionPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatNum(avgAdhesion, 2)} MPa
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                {formatNum(avgAdhesion * 145.038, 0)} PSI · Target: ≥ {minReqAdhesion} MPa (ISO 2063)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Lowest Single Dolly</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{Math.min(parseFloat(dollyD1) || 0, parseFloat(dollyD2) || 0, parseFloat(dollyD3) || 0).toFixed(1)} MPa</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Failure Mode Result</span>
                <span className="text-xs font-bold text-slate-700 truncate block">{failureMode.split('(')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
