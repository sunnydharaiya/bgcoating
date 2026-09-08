import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Calculator, 
  Info, 
  BookOpen, 
  Shield, 
  ShieldCheck, 
  Play, 
  RotateCcw,
  Flame,
  Layers,
  Box,
  Scale,
  Clock,
  Coins,
  Wrench,
  Grid
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

export default function PFPSuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Active Sub-Tab: 'mat' | 'thk' | 'den' | 'mesh' | 'cost' | 'rep'
  const [currentTab, setCurrentTab] = useState('mat');

  useEffect(() => {
    if (activeSubTool === 'pfp-thk' || activeSubTool === 'pfp_thk' || activeSubTool === 'pfp_thickness' || activeSubTool === 'pfp_hp_a_calc' || activeSubTool === 'pfp_dft_matrix') setCurrentTab('thk');
    else if (activeSubTool === 'pfp-den' || activeSubTool === 'pfp_den' || activeSubTool === 'pfp_density') setCurrentTab('den');
    else if (activeSubTool === 'pfp-mesh' || activeSubTool === 'pfp_mesh' || activeSubTool === 'pfp_mesh_qty' || activeSubTool === 'pfp_reinforce_mesh') setCurrentTab('mesh');
    else if (activeSubTool === 'pfp-cost' || activeSubTool === 'pfp_cost') setCurrentTab('cost');
    else if (activeSubTool === 'pfp-rep' || activeSubTool === 'pfp_rep' || activeSubTool === 'pfp_repair') setCurrentTab('rep');
    else setCurrentTab('mat');
  }, [activeSubTool]);

  const handleTabSwitch = (tabKey, toolId) => {
    setCurrentTab(tabKey);
    if (onSubToolChange) onSubToolChange(toolId);
  };

  // ----------------------------------------------------
  // Tool 1: 11.1 PFP Material Consumption
  // ----------------------------------------------------
  const [matArea, setMatArea] = useState('250'); // m²
  const [matDftMm, setMatDftMm] = useState('6.5'); // mm
  const [matVsPct, setMatVsPct] = useState('100'); // %
  const [matLossPct, setMatLossPct] = useState('15'); // %
  const [matDensityKgM3, setMatDensityKgM3] = useState('1000'); // kg/m³
  const [matKitSizeL, setMatKitSizeL] = useState('20'); // L
  const [matPricePerL, setMatPricePerL] = useState('1850'); // ₹/L

  const matTheoVolL = (Number(matArea) || 0) * (Number(matDftMm) || 0); // L
  const matActualVolL = Number(matVsPct) > 0 ? (matTheoVolL / (Number(matVsPct) / 100)) * (1 + (Number(matLossPct) || 0) / 100) : 0;
  const matTotalWeightKg = matActualVolL * ((Number(matDensityKgM3) || 1000) / 1000);
  const matKitsCount = Number(matKitSizeL) > 0 ? Math.ceil(matActualVolL / Number(matKitSizeL)) : 0;
  const matTotalCost = matActualVolL * (Number(matPricePerL) || 0);
  const matCostPerM2 = Number(matArea) > 0 ? matTotalCost / Number(matArea) : 0;

  // ----------------------------------------------------
  // Tool 2: 11.2 PFP Thickness (Fire Rating & Hp/A)
  // ----------------------------------------------------
  const [profileType, setProfileType] = useState('I-Beam / Column (Universal Beam)');
  const [exposureSides, setExposureSides] = useState('4'); // 3 or 4 sides
  const [depthD, setDepthD] = useState('300'); // mm
  const [widthB, setWidthB] = useState('150'); // mm
  const [webTw, setWebTw] = useState('7.1'); // mm
  const [flangeTf, setFlangeTf] = useState('10.7'); // mm
  const [fireRatingMin, setFireRatingMin] = useState('60'); // 30, 60, 90, 120 min
  const [critTempC, setCritTempC] = useState('500'); // 400, 500, 550, 620 °C

  // Cross-sectional Area A in mm²
  const areaA = (2 * Number(widthB) * Number(flangeTf)) + ((Number(depthD) - 2 * Number(flangeTf)) * Number(webTw));
  // Heated Perimeter Hp in mm
  const heatedPerimeterHp = exposureSides === '4'
    ? (4 * Number(widthB) + 2 * Number(depthD) - 2 * Number(webTw))
    : (3 * Number(widthB) + 2 * Number(depthD) - Number(webTw));

  // Hp/A ratio in m⁻¹
  const hpOverA = areaA > 0 ? ((heatedPerimeterHp / areaA) * 1000) : 0;
  // A/V is identical to Hp/A in SI units
  const aOverV = hpOverA;

  // Estimated DFT Matrix based on Hp/A and Fire Rating
  const estimatedDftMm = Math.min(18.0, Math.max(1.5, ((hpOverA / 100) * (Number(fireRatingMin) / 60) * (550 / Number(critTempC)) * 2.8)));

  // ----------------------------------------------------
  // Tool 3: 11.3 PFP Density Verification (ASTM E605)
  // ----------------------------------------------------
  const [denWeightAirG, setDenWeightAirG] = useState('125.4'); // grams
  const [denWeightWaterG, setDenWeightWaterG] = useState('24.2'); // grams
  const [denSpecKgM3, setDenSpecKgM3] = useState('1000'); // kg/m³
  const [denTolerancePct, setDenTolerancePct] = useState('10'); // %

  const denDisplacedVolCm3 = (Number(denWeightAirG) || 0) - (Number(denWeightWaterG) || 0);
  const denMeasuredKgM3 = denDisplacedVolCm3 > 0 ? ((Number(denWeightAirG) || 0) / denDisplacedVolCm3) * 1000 : 0;
  const denMinAllowed = (Number(denSpecKgM3) || 1000) * (1 - (Number(denTolerancePct) || 10) / 100);
  const denMaxAllowed = (Number(denSpecKgM3) || 1000) * (1 + (Number(denTolerancePct) || 10) / 100);
  const isDenPass = denMeasuredKgM3 >= denMinAllowed && denMeasuredKgM3 <= denMaxAllowed;
  const denDevPct = Number(denSpecKgM3) > 0 ? ((denMeasuredKgM3 - Number(denSpecKgM3)) / Number(denSpecKgM3)) * 100 : 0;

  // ----------------------------------------------------
  // Tool 4: 11.4 PFP Reinforcement Mesh Quantity
  // ----------------------------------------------------
  const [meshArea, setMeshArea] = useState('250'); // m²
  const [meshOverlapPct, setMeshOverlapPct] = useState('15'); // %
  const [meshWrapPct, setMeshWrapPct] = useState('10'); // % corner wrap
  const [meshRollSizeM2, setMeshRollSizeM2] = useState('50'); // m²/roll
  const [meshPricePerM2, setMeshPricePerM2] = useState('120'); // ₹/m²

  const meshTotalAreaReqM2 = (Number(meshArea) || 0) * (1 + ((Number(meshOverlapPct) || 0) + (Number(meshWrapPct) || 0)) / 100);
  const meshRollsCount = Number(meshRollSizeM2) > 0 ? Math.ceil(meshTotalAreaReqM2 / Number(meshRollSizeM2)) : 0;
  const meshTotalCost = meshTotalAreaReqM2 * (Number(meshPricePerM2) || 0);

  // ----------------------------------------------------
  // Tool 5: 11.5 PFP Cost Breakdown Across 9 Heads
  // ----------------------------------------------------
  const [costAreaPfp, setCostAreaPfp] = useState('250'); // m²
  const [costH1Primer, setCostH1Primer] = useState('35000'); // ₹
  const [costH2Basecoat, setCostH2Basecoat] = useState('320000'); // ₹
  const [costH3Mesh, setCostH3Mesh] = useState('36000'); // ₹
  const [costH4Topcoat, setCostH4Topcoat] = useState('45000'); // ₹
  const [costH5SurfacePrep, setCostH5SurfacePrep] = useState('55000'); // ₹
  const [costH6Labour, setCostH6Labour] = useState('95000'); // ₹
  const [costH7Equipment, setCostH7Equipment] = useState('60000'); // ₹
  const [costH8Testing, setCostH8Testing] = useState('25000'); // ₹
  const [costH9MarginPct, setCostH9MarginPct] = useState('15'); // %

  const costDirectSum = (Number(costH1Primer) || 0) + (Number(costH2Basecoat) || 0) + (Number(costH3Mesh) || 0) +
    (Number(costH4Topcoat) || 0) + (Number(costH5SurfacePrep) || 0) + (Number(costH6Labour) || 0) +
    (Number(costH7Equipment) || 0) + (Number(costH8Testing) || 0);
  const costGrandTotalPfp = costDirectSum * (1 + (Number(costH9MarginPct) || 0) / 100);
  const costPerM2GrandPfp = Number(costAreaPfp) > 0 ? costGrandTotalPfp / Number(costAreaPfp) : 0;

  // ----------------------------------------------------
  // Tool 6: 11.6 PFP Repair Quantity & CUF Check
  // ----------------------------------------------------
  const [repTotalArea, setRepTotalArea] = useState('250'); // m²
  const [repDefectArea, setRepDefectArea] = useState('6.5'); // m²
  const [repDepthMm, setRepDepthMm] = useState('6.5'); // mm
  const [repCostPerM2, setRepCostPerM2] = useState('3500'); // ₹/m²

  const repCufPct = Number(repTotalArea) > 0 ? ((Number(repDefectArea) || 0) / Number(repTotalArea)) * 100 : 0;
  const isRepPermissible = repCufPct <= 5.0; // Under 5% spot repair is standard permissible
  const repMaterialVolL = (Number(repDefectArea) || 0) * (Number(repDepthMm) || 0) * 1.25; // with 25% feathering loss
  const repTotalCostEst = (Number(repDefectArea) || 0) * (Number(repCostPerM2) || 0);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = '';
    if (currentTab === 'mat') {
      text = `BG CoatingOS™ — 11.1 PFP Material Consumption\nArea: ${matArea} m² | DFT: ${matDftMm} mm | VS: ${matVsPct}%\nActual Volume Reqd: ${formatNum(matActualVolL, 1)} L (${matKitsCount} x ${matKitSizeL}L kits)\nTotal Weight: ${formatNum(matTotalWeightKg, 1)} kg | Total Cost: ${formatCur(matTotalCost)} (${formatCur(matCostPerM2)}/m²)`;
    } else if (currentTab === 'thk') {
      text = `BG CoatingOS™ — 11.2 PFP Thickness (Fire Rating & Hp/A)\nProfile: ${profileType} (${exposureSides} sides)\nSection Factor Hp/A: ${formatNum(hpOverA, 1)} m⁻¹ | Rating: ${fireRatingMin} min @ ${critTempC}°C\nRecommended DFT: ${formatNum(estimatedDftMm, 2)} mm`;
    } else if (currentTab === 'den') {
      text = `BG CoatingOS™ — 11.3 PFP Density Verification (ASTM E605)\nMeasured Density: ${formatNum(denMeasuredKgM3, 1)} kg/m³ vs Specified: ${denSpecKgM3} kg/m³\nDeviation: ${formatNum(denDevPct, 1)}% | Verdict: ${isDenPass ? 'PASS' : 'FAIL'}`;
    } else if (currentTab === 'mesh') {
      text = `BG CoatingOS™ — 11.4 PFP Reinforcement Mesh Quantity\nArea: ${meshArea} m² | Total Mesh Reqd: ${formatNum(meshTotalAreaReqM2, 1)} m² (${meshRollsCount} rolls)\nTotal Mesh Cost: ${formatCur(meshTotalCost)}`;
    } else if (currentTab === 'cost') {
      text = `BG CoatingOS™ — 11.5 PFP Cost Breakdown (9 Heads)\nArea: ${costAreaPfp} m² | Grand Total: ${formatCur(costGrandTotalPfp)} (${formatCur(costPerM2GrandPfp)}/m²)\nDirect Subtotal: ${formatCur(costDirectSum)} | Margin: ${costH9MarginPct}%`;
    } else {
      text = `BG CoatingOS™ — 11.6 PFP Repair Quantity & CUF Check\nDefect Area: ${repDefectArea} m² of ${repTotalArea} m² (CUF: ${formatNum(repCufPct, 2)}%)\nRepair Volume: ${formatNum(repMaterialVolL, 1)} L | Estimated Cost: ${formatCur(repTotalCostEst)} | Status: ${isRepPermissible ? 'PERMISSIBLE' : 'EXCEEDS THRESHOLD'}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'PFP calculation report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs = [
    { id: 'mat', toolId: 'pfp-mat', label: '11.1 Material Take-Off', icon: Box },
    { id: 'thk', toolId: 'pfp-thk', label: '11.2 Thickness & Hp/A', icon: Flame },
    { id: 'den', toolId: 'pfp-den', label: '11.3 Density Verify', icon: Scale },
    { id: 'mesh', toolId: 'pfp-mesh', label: '11.4 Reinforce Mesh', icon: Grid },
    { id: 'cost', toolId: 'pfp-cost', label: '11.5 9-Head Costing', icon: Coins },
    { id: 'rep', toolId: 'pfp-rep', label: '11.6 Repair & CUF', icon: Wrench },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Suite Header */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section 11 · UL 1709 / BS 476 / ISO 834 / ASTM E119
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Passive Fire Protection (PFP) Engineering Suite
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Structural epoxy intumescent &amp; cementitious fireproofing calculations (Hp/A section factor, DFT matrix, volume take-off, reinforcement mesh, 9-head turnkey costing &amp; repair CUF).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline(currentTab === 'mat' ? 'pfp-mat' : currentTab === 'thk' ? 'pfp-thk' : currentTab === 'den' ? 'pfp-den' : currentTab === 'mesh' ? 'pfp-mesh' : currentTab === 'cost' ? 'pfp-cost' : 'pfp-rep')}
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
      {/* 11.1 PFP Material Consumption Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'mat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Material Volume Parameters
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Surface Area (m²)</label>
                  <input
                    type="number"
                    value={matArea}
                    onChange={e => setMatArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target PFP DFT (mm)</label>
                  <input
                    type="number"
                    value={matDftMm}
                    onChange={e => setMatDftMm(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume Solids (%)</label>
                  <input
                    type="number"
                    value={matVsPct}
                    onChange={e => setMatVsPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loss Factor (%)</label>
                  <input
                    type="number"
                    value={matLossPct}
                    onChange={e => setMatLossPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Density (kg/m³)</label>
                  <input
                    type="number"
                    value={matDensityKgM3}
                    onChange={e => setMatDensityKgM3(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kit Packing Size (Litres)</label>
                  <input
                    type="number"
                    value={matKitSizeL}
                    onChange={e => setMatKitSizeL(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price per Litre (₹/L)</label>
                  <input
                    type="number"
                    value={matPricePerL}
                    onChange={e => setMatPricePerL(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-rose-50/30 border-2 border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <span className="text-xs font-mono font-bold text-rose-700 uppercase">PFP Volume Required</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">100% Epoxy</span>
            </div>

            <div className="bg-white border border-rose-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Actual Liquid Volume Demand</span>
              <div className="text-4xl font-black text-rose-600 font-mono mt-1">
                {formatNum(matActualVolL, 1)} Litres
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Packaging: {matKitsCount} Kits ({matKitSizeL}L each) · Total Weight: {formatNum(matTotalWeightKg, 1)} kg
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Estimated Cost</span>
                <span className="text-sm font-bold text-emerald-700 font-mono">{formatCur(matTotalCost)}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Material Rate / m²</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatCur(matCostPerM2)}/m²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 11.2 PFP Thickness & Hp/A Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'thk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Section Geometry &amp; Fire Rating
            </h2>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Structural Profile Type</label>
                <select
                  value={profileType}
                  onChange={e => setProfileType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option>I-Beam / Column (Universal Beam)</option>
                  <option>H-Section / Heavy Column</option>
                  <option>Rectangular Hollow Section (RHS / SHS)</option>
                  <option>Circular Hollow Section (CHS Pipe)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exposure Sides</label>
                  <select
                    value={exposureSides}
                    onChange={e => setExposureSides(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  >
                    <option value="4">4-Sided (Free Standing Column)</option>
                    <option value="3">3-Sided (Beam with Slab Top)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fire Rating (Minutes)</label>
                  <select
                    value={fireRatingMin}
                    onChange={e => setFireRatingMin(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  >
                    <option value="30">30 Minutes (R30)</option>
                    <option value="60">60 Minutes (R60 / 1-Hour)</option>
                    <option value="90">90 Minutes (R90 / 1.5-Hour)</option>
                    <option value="120">120 Minutes (R120 / 2-Hour)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Depth D (mm)</label>
                  <input
                    type="number"
                    value={depthD}
                    onChange={e => setDepthD(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Width B (mm)</label>
                  <input
                    type="number"
                    value={widthB}
                    onChange={e => setWidthB(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Web tw (mm)</label>
                  <input
                    type="number"
                    value={webTw}
                    onChange={e => setWebTw(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Flange tf (mm)</label>
                  <input
                    type="number"
                    value={flangeTf}
                    onChange={e => setFlangeTf(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Critical Temp (°C)</label>
                  <select
                    value={critTempC}
                    onChange={e => setCritTempC(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  >
                    <option value="400">400°C (High Load / Hydrocarbon)</option>
                    <option value="500">500°C (Standard Columns)</option>
                    <option value="550">550°C (Standard Beams)</option>
                    <option value="620">620°C (Lightly Loaded)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-mono font-bold text-[#D97706] uppercase">Section Factor &amp; DFT</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">BS 476 Part 21</span>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Calculated Section Factor (Hp/A or A/V)</span>
              <div className="text-4xl font-black text-[#D97706] font-mono mt-1">
                {formatNum(hpOverA, 1)} m⁻¹
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Heated Perimeter Hp: {formatNum(heatedPerimeterHp, 0)} mm · Section Area A: {formatNum(areaA, 0)} mm²
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Recommended PFP Intumescent DFT</span>
              <span className="text-2xl font-black text-rose-600 font-mono">{formatNum(estimatedDftMm, 2)} mm ({formatNum(estimatedDftMm * 1000, 0)} µm)</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 11.3 PFP Density Verification Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'den' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              ASTM E605 Gravimetric Density Parameters
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specimen Mass in Air (g)</label>
                  <input
                    type="number"
                    value={denWeightAirG}
                    onChange={e => setDenWeightAirG(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specimen Mass in Water (g)</label>
                  <input
                    type="number"
                    value={denWeightWaterG}
                    onChange={e => setDenWeightWaterG(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal TDS Density (kg/m³)</label>
                  <input
                    type="number"
                    value={denSpecKgM3}
                    onChange={e => setDenSpecKgM3(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tolerance Band (±%)</label>
                  <input
                    type="number"
                    value={denTolerancePct}
                    onChange={e => setDenTolerancePct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase">Cured Density Result</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isDenPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {isDenPass ? 'COMPLIANT ✓' : 'NON-COMPLIANT ✗'}
              </span>
            </div>

            <div className="bg-white border border-blue-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Measured In-Situ Density</span>
              <div className={`text-4xl font-black font-mono mt-1 ${isDenPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatNum(denMeasuredKgM3, 1)} kg/m³
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                TDS: {denSpecKgM3} kg/m³ · Permissible: {formatNum(denMinAllowed, 0)} – {formatNum(denMaxAllowed, 0)} kg/m³
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 11.4 PFP Reinforcement Mesh Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'mesh' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Mesh Take-Off Parameters
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Structure Area (m²)</label>
                  <input
                    type="number"
                    value={meshArea}
                    onChange={e => setMeshArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overlap (%)</label>
                  <input
                    type="number"
                    value={meshOverlapPct}
                    onChange={e => setMeshOverlapPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corner Wrap (%)</label>
                  <input
                    type="number"
                    value={meshWrapPct}
                    onChange={e => setMeshWrapPct(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll Area (m²/roll)</label>
                  <input
                    type="number"
                    value={meshRollSizeM2}
                    onChange={e => setMeshRollSizeM2(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price per m² (₹/m²)</label>
                  <input
                    type="number"
                    value={meshPricePerM2}
                    onChange={e => setMeshPricePerM2(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase">Reinforcement Mesh Reqd</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono">Carbon/Glass Mesh</span>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total Mesh Demand</span>
              <div className="text-4xl font-black text-purple-600 font-mono mt-1">
                {formatNum(meshTotalAreaReqM2, 1)} m²
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Order Quantity: {meshRollsCount} Rolls ({meshRollSizeM2} m² each)
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Estimated Mesh Budget</span>
              <span className="text-lg font-bold text-emerald-700 font-mono">{formatCur(meshTotalCost)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 11.5 PFP Cost Breakdown Across 9 Heads Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              9-Head PFP Commercial Breakdown (₹)
            </h2>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scope Area (m²)</label>
                  <input type="number" value={costAreaPfp} onChange={e => setCostAreaPfp(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">1. Primer (₹)</label>
                  <input type="number" value={costH1Primer} onChange={e => setCostH1Primer(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. Basecoat PFP (₹)</label>
                  <input type="number" value={costH2Basecoat} onChange={e => setCostH2Basecoat(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">3. Mesh (₹)</label>
                  <input type="number" value={costH3Mesh} onChange={e => setCostH3Mesh(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4. Topcoat (₹)</label>
                  <input type="number" value={costH4Topcoat} onChange={e => setCostH4Topcoat(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">5. Blast Prep (₹)</label>
                  <input type="number" value={costH5SurfacePrep} onChange={e => setCostH5SurfacePrep(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">6. Labour (₹)</label>
                  <input type="number" value={costH6Labour} onChange={e => setCostH6Labour(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">7. Equipment (₹)</label>
                  <input type="number" value={costH7Equipment} onChange={e => setCostH7Equipment(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">8. Fire Test (₹)</label>
                  <input type="number" value={costH8Testing} onChange={e => setCostH8Testing(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">9. Contractor Overhead &amp; Margin (%)</label>
                <input type="number" value={costH9MarginPct} onChange={e => setCostH9MarginPct(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-mono font-bold text-[#D97706] uppercase">Turnkey PFP Budget</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">Lump Sum</span>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total Commercial Proposal</span>
              <div className="text-3xl md:text-4xl font-black text-[#D97706] font-mono mt-1">
                {formatCur(costGrandTotalPfp)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Unit Rate: {formatCur(costPerM2GrandPfp)} / m²
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Direct Costs Subtotal</span>
              <span className="text-sm font-bold text-slate-800 font-mono">{formatCur(costDirectSum)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 11.6 PFP Repair Quantity & CUF Check Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'rep' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Defect &amp; CUF Parameters
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Inspected Area (m²)</label>
                  <input
                    type="number"
                    value={repTotalArea}
                    onChange={e => setRepTotalArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Damaged / Defect Area (m²)</label>
                  <input
                    type="number"
                    value={repDefectArea}
                    onChange={e => setRepDefectArea(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Repair Depth (mm)</label>
                  <input
                    type="number"
                    value={repDepthMm}
                    onChange={e => setRepDepthMm(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Repair Rate (₹/m²)</label>
                  <input
                    type="number"
                    value={repCostPerM2}
                    onChange={e => setRepCostPerM2(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase">CUF Assessment</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isRepPermissible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {isRepPermissible ? 'SPOT REPAIR PERMISSIBLE ✓' : 'STRUCTURAL RE-APPLICATION REQUIRED ✗'}
              </span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Capacity Utilization Factor (CUF)</span>
              <div className={`text-4xl font-black font-mono mt-1 ${isRepPermissible ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatNum(repCufPct, 2)}%
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Repair Volume Reqd: {formatNum(repMaterialVolL, 1)} Litres · Estimated Cost: {formatCur(repTotalCostEst)}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
