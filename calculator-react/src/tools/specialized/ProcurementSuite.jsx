import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Calculator, 
  Info, 
  BookOpen, 
  PackageCheck, 
  Scale, 
  Play, 
  RotateCcw,
  FileCheck2,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Coins,
  ShieldCheck,
  Trophy,
  ShoppingCart
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

export default function ProcurementSuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  // Active Sub-Tab: 'proc' | 'comp' | 'bid' | 'ticket'
  const [currentTab, setCurrentTab] = useState('proc');

  useEffect(() => {
    if (activeSubTool === 'bid-comp' || activeSubTool === 'bid_comp' || activeSubTool === 'bid_comparison') setCurrentTab('comp');
    else if (activeSubTool === 'contractor_bid_builder') setCurrentTab('bid');
    else if (activeSubTool === 'batch_ticket_generator') setCurrentTab('ticket');
    else setCurrentTab('proc');
  }, [activeSubTool]);

  const handleTabSwitch = (tabKey, toolId) => {
    setCurrentTab(tabKey);
    if (onSubToolChange) onSubToolChange(toolId);
  };

  // ----------------------------------------------------
  // Tool 1: 12.1 Multi-Coat Paint Procurement Quantity
  // ----------------------------------------------------
  const [procArea, setProcArea] = useState('5000'); // m²
  const [primerName, setPrimerName] = useState('Zinc Rich Epoxy Primer');
  const [primerDft, setPrimerDft] = useState('75'); // µm
  const [primerVs, setPrimerVs] = useState('65'); // %
  const [primerLoss, setPrimerLoss] = useState('30'); // %
  const [primerPrice, setPrimerPrice] = useState('650'); // ₹/L
  const [primerPack, setPrimerPack] = useState('20'); // L

  const [midName, setMidName] = useState('High Build Epoxy MIO');
  const [midDft, setMidDft] = useState('150'); // µm
  const [midVs, setMidVs] = useState('80'); // %
  const [midLoss, setMidLoss] = useState('25'); // %
  const [midPrice, setMidPrice] = useState('520'); // ₹/L
  const [midPack, setMidPack] = useState('20'); // L

  const [topName, setTopName] = useState('Aliphatic Polyurethane Topcoat');
  const [topDft, setTopDft] = useState('50'); // µm
  const [topVs, setTopVs] = useState('55'); // %
  const [topLoss, setTopLoss] = useState('35'); // %
  const [topPrice, setTopPrice] = useState('780'); // ₹/L
  const [topPack, setTopPack] = useState('20'); // L

  // Calculations for Coat 1
  const primerTheoVol = Number(primerVs) > 0 ? ((Number(procArea) * Number(primerDft)) / (Number(primerVs) * 10)) : 0;
  const primerPracVol = primerTheoVol * (1 + (Number(primerLoss) || 0) / 100);
  const primerKits = Number(primerPack) > 0 ? Math.ceil(primerPracVol / Number(primerPack)) : 0;
  const primerOrderVol = primerKits * (Number(primerPack) || 20);
  const primerCost = primerOrderVol * (Number(primerPrice) || 0);

  // Calculations for Coat 2
  const midTheoVol = Number(midVs) > 0 ? ((Number(procArea) * Number(midDft)) / (Number(midVs) * 10)) : 0;
  const midPracVol = midTheoVol * (1 + (Number(midLoss) || 0) / 100);
  const midKits = Number(midPack) > 0 ? Math.ceil(midPracVol / Number(midPack)) : 0;
  const midOrderVol = midKits * (Number(midPack) || 20);
  const midCost = midOrderVol * (Number(midPrice) || 0);

  // Calculations for Coat 3
  const topTheoVol = Number(topVs) > 0 ? ((Number(procArea) * Number(topDft)) / (Number(topVs) * 10)) : 0;
  const topPracVol = topTheoVol * (1 + (Number(topLoss) || 0) / 100);
  const topKits = Number(topPack) > 0 ? Math.ceil(topPracVol / Number(topPack)) : 0;
  const topOrderVol = topKits * (Number(topPack) || 20);
  const topCost = topOrderVol * (Number(topPrice) || 0);

  const grandOrderVolumeL = primerOrderVol + midOrderVol + topOrderVol;
  const grandProcurementCost = primerCost + midCost + topCost;
  const grandCostPerM2 = Number(procArea) > 0 ? grandProcurementCost / Number(procArea) : 0;

  // ----------------------------------------------------
  // Tool 2: 12.2 Commercial Bid Comparison (QCBS Scoring)
  // ----------------------------------------------------
  const [techWeightPct, setTechWeightPct] = useState('70'); // %
  const [commWeightPct, setCommWeightPct] = useState('30'); // %

  const [m1Name, setM1Name] = useState('Manufacturer A (AkzoNobel / Intl)');
  const [m1TechScore, setM1TechScore] = useState('94');
  const [m1Price, setM1Price] = useState('2450000'); // ₹

  const [m2Name, setM2Name] = useState('Manufacturer B (Jotun Paints)');
  const [m2TechScore, setM2TechScore] = useState('91');
  const [m2Price, setM2Price] = useState('2280000'); // ₹

  const [m3Name, setM3Name] = useState('Manufacturer C (Hempel Coating)');
  const [m3TechScore, setM3TechScore] = useState('88');
  const [m3Price, setM3Price] = useState('2150000'); // ₹

  const [m4Name, setM4Name] = useState('Manufacturer D (Berger Protecton)');
  const [m4TechScore, setM4TechScore] = useState('82');
  const [m4Price, setM4Price] = useState('1980000'); // ₹

  const minPrice = Math.min(Number(m1Price) || Infinity, Number(m2Price) || Infinity, Number(m3Price) || Infinity, Number(m4Price) || Infinity);

  const calcQcbs = (techScore, price) => {
    const p = Number(price) || 1;
    const ts = Number(techScore) || 0;
    const fs = (minPrice / p) * 100;
    const qcbs = (ts * (Number(techWeightPct) / 100)) + (fs * (Number(commWeightPct) / 100));
    return { fs, qcbs };
  };

  const m1Res = calcQcbs(m1TechScore, m1Price);
  const m2Res = calcQcbs(m2TechScore, m2Price);
  const m3Res = calcQcbs(m3TechScore, m3Price);
  const m4Res = calcQcbs(m4TechScore, m4Price);

  const contenders = [
    { name: m1Name, tech: m1TechScore, price: m1Price, fs: m1Res.fs, qcbs: m1Res.qcbs },
    { name: m2Name, tech: m2TechScore, price: m2Price, fs: m2Res.fs, qcbs: m2Res.qcbs },
    { name: m3Name, tech: m3TechScore, price: m3Price, fs: m3Res.fs, qcbs: m3Res.qcbs },
    { name: m4Name, tech: m4TechScore, price: m4Price, fs: m4Res.fs, qcbs: m4Res.qcbs },
  ].sort((a, b) => b.qcbs - a.qcbs);

  // ----------------------------------------------------
  // Tool 3: Commercial Bid Builder
  // ----------------------------------------------------
  const [bidArea, setBidArea] = useState('12000');
  const [blastingCostM2, setBlastingCostM2] = useState('180');
  const [primerCostM2, setPrimerCostM2] = useState('145');
  const [midCostM2, setMidCostM2] = useState('210');
  const [topCostM2, setTopCostM2] = useState('165');
  const [scaffoldingLabourM2, setScaffoldingLabourM2] = useState('120');
  const [qaQcInspectorM2, setQaQcInspectorM2] = useState('25');
  const [profitMarginPct, setProfitMarginPct] = useState('18');

  const directMaterialCostM2 = Number(blastingCostM2) + Number(primerCostM2) + Number(midCostM2) + Number(topCostM2);
  const directLabourCostM2 = Number(scaffoldingLabourM2) + Number(qaQcInspectorM2);
  const totalDirectCostM2 = directMaterialCostM2 + directLabourCostM2;
  const quoteRateM2 = totalDirectCostM2 * (1 + Number(profitMarginPct) / 100);
  const grandBidTotal = quoteRateM2 * Number(bidArea);

  // ----------------------------------------------------
  // Tool 4: Batch Ticket Generator
  // ----------------------------------------------------
  const [batchNo, setBatchNo] = useState('B-2026-0819');
  const [productCode, setProductCode] = useState('Interseal 670HS');
  const [potLifeMin, setPotLifeMin] = useState('90');
  const [mixRatioVol, setMixRatioVol] = useState('4:1 (Base:Hardener)');
  const [viscositySec, setViscositySec] = useState('45');
  const [inspectionResult, setInspectionResult] = useState('RELEASED');

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = '';
    if (currentTab === 'proc') {
      text = `BG CoatingOS™ — 12.1 Multi-Coat Paint Procurement\nArea: ${procArea} m²\n1. ${primerName}: ${primerOrderVol} L (${primerKits} kits) = ${formatCur(primerCost)}\n2. ${midName}: ${midOrderVol} L (${midKits} kits) = ${formatCur(midCost)}\n3. ${topName}: ${topOrderVol} L (${topKits} kits) = ${formatCur(topCost)}\nTotal Order Volume: ${formatNum(grandOrderVolumeL, 0)} L | Total Cost: ${formatCur(grandProcurementCost)} (${formatCur(grandCostPerM2)}/m²)`;
    } else if (currentTab === 'comp') {
      text = `BG CoatingOS™ — 12.2 Multi-Manufacturer QCBS Comparison\nWeightage: Technical ${techWeightPct}% | Commercial ${commWeightPct}%\nWinner (Rank 1): ${contenders[0].name} with Score: ${formatNum(contenders[0].qcbs, 2)}/100 (Quote: ${formatCur(contenders[0].price)})`;
    } else if (currentTab === 'bid') {
      text = `BG CoatingOS™ — Commercial Bid Builder\nArea: ${bidArea} m² | Rate: ${formatCur(quoteRateM2)}/m² | Grand Total: ${formatCur(grandBidTotal)}\nDirect Cost: ${formatCur(totalDirectCostM2)}/m² | Margin: ${profitMarginPct}%`;
    } else {
      text = `BG CoatingOS™ — Batch Inspection Ticket\nBatch: ${batchNo} | Product: ${productCode} | Ratio: ${mixRatioVol} | Status: ${inspectionResult}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Procurement & Bid calculation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs = [
    { id: 'proc', toolId: 'bid-proc', label: '12.1 Multi-Coat Procurement', icon: ShoppingCart },
    { id: 'comp', toolId: 'bid-comp', label: '12.2 Tender QCBS Comparison', icon: Trophy },
    { id: 'bid', toolId: 'contractor_bid_builder', label: 'Contractor Bid Builder', icon: Coins },
    { id: 'ticket', toolId: 'batch_ticket_generator', label: 'Batch QA Ticket', icon: FileCheck2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      
      {/* Top Suite Header */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section 12 · QCBS Procurement &amp; Commercial Tender
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Paint Procurement &amp; Tender Bid Comparison Suite
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Multi-coat paint matrix procurement take-off, drum kit packing, commercial tender rate builder &amp; Quality-Cost-Based (QCBS) vendor evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline(currentTab === 'proc' ? 'bid-proc' : currentTab === 'comp' ? 'bid-comp' : 'bid-proc')}
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
      {/* 12.1 Multi-Coat Paint Procurement Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'proc' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Multi-Coat System Parameters
              </h2>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700">Scope Area (m²):</label>
                <input
                  type="number"
                  value={procArea}
                  onChange={e => setProcArea(e.target.value)}
                  className="w-32 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-xs"
                />
              </div>
            </div>

            {/* Coat 1: Primer */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Coat 1: {primerName}
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  Demand: {formatNum(primerOrderVol, 0)} L ({primerKits} x {primerPack}L drums) · {formatCur(primerCost)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">DFT (µm)</label>
                  <input type="number" value={primerDft} onChange={e => setPrimerDft(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Volume Solids (%)</label>
                  <input type="number" value={primerVs} onChange={e => setPrimerVs(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Loss Factor (%)</label>
                  <input type="number" value={primerLoss} onChange={e => setPrimerLoss(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Drum Pack (L)</label>
                  <input type="number" value={primerPack} onChange={e => setPrimerPack(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Price (₹/L)</label>
                  <input type="number" value={primerPrice} onChange={e => setPrimerPrice(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
              </div>
            </div>

            {/* Coat 2: Intermediate */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Coat 2: {midName}
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  Demand: {formatNum(midOrderVol, 0)} L ({midKits} x {midPack}L drums) · {formatCur(midCost)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">DFT (µm)</label>
                  <input type="number" value={midDft} onChange={e => setMidDft(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Volume Solids (%)</label>
                  <input type="number" value={midVs} onChange={e => setMidVs(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Loss Factor (%)</label>
                  <input type="number" value={midLoss} onChange={e => setMidLoss(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Drum Pack (L)</label>
                  <input type="number" value={midPack} onChange={e => setMidPack(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Price (₹/L)</label>
                  <input type="number" value={midPrice} onChange={e => setMidPrice(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
              </div>
            </div>

            {/* Coat 3: Topcoat */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Coat 3: {topName}
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  Demand: {formatNum(topOrderVol, 0)} L ({topKits} x {topPack}L drums) · {formatCur(topCost)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">DFT (µm)</label>
                  <input type="number" value={topDft} onChange={e => setTopDft(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Volume Solids (%)</label>
                  <input type="number" value={topVs} onChange={e => setTopVs(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Loss Factor (%)</label>
                  <input type="number" value={topLoss} onChange={e => setTopLoss(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Drum Pack (L)</label>
                  <input type="number" value={topPack} onChange={e => setTopPack(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Price (₹/L)</label>
                  <input type="number" value={topPrice} onChange={e => setTopPrice(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
              </div>
            </div>
          </div>

          {/* Grand Summary */}
          <div className="bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase">Procurement PO Summary</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">3-Coat System</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
                <span className="text-xs text-slate-400 font-mono">Total Order Volume</span>
                <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                  {formatNum(grandOrderVolumeL, 0)} L
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  {primerKits + midKits + topKits} Total Drums across all coats
                </p>
              </div>

              <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
                <span className="text-xs text-slate-400 font-mono">Grand Material Cost</span>
                <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
                  {formatCur(grandProcurementCost)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Ex-Factory Net Price
                </p>
              </div>

              <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
                <span className="text-xs text-slate-400 font-mono">Paint Cost / m²</span>
                <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                  {formatCur(grandCostPerM2)} / m²
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Based on {procArea} m² scope
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 12.2 Multi-Manufacturer QCBS Comparison Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'comp' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Tender QCBS Weightage Configuration
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Technical (%):</span>
                  <input
                    type="number"
                    value={techWeightPct}
                    onChange={e => {
                      setTechWeightPct(e.target.value);
                      setCommWeightPct(String(100 - Number(e.target.value)));
                    }}
                    className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-center"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Commercial (%):</span>
                  <input
                    type="number"
                    value={commWeightPct}
                    disabled
                    className="w-16 px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-center text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Manufacturer Entries Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input type="text" value={m1Name} onChange={e => setM1Name(e.target.value)} className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Tech Score (/100)</label>
                    <input type="number" value={m1TechScore} onChange={e => setM1TechScore(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Quote (₹)</label>
                    <input type="number" value={m1Price} onChange={e => setM1Price(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input type="text" value={m2Name} onChange={e => setM2Name(e.target.value)} className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Tech Score (/100)</label>
                    <input type="number" value={m2TechScore} onChange={e => setM2TechScore(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Quote (₹)</label>
                    <input type="number" value={m2Price} onChange={e => setM2Price(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input type="text" value={m3Name} onChange={e => setM3Name(e.target.value)} className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Tech Score (/100)</label>
                    <input type="number" value={m3TechScore} onChange={e => setM3TechScore(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Quote (₹)</label>
                    <input type="number" value={m3Price} onChange={e => setM3Price(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input type="text" value={m4Name} onChange={e => setM4Name(e.target.value)} className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Tech Score (/100)</label>
                    <input type="number" value={m4TechScore} onChange={e => setM4TechScore(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Quote (₹)</label>
                    <input type="number" value={m4Price} onChange={e => setM4Price(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QCBS Ranking Card */}
          <div className="bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-mono font-bold text-[#D97706] uppercase">QCBS Evaluation Ranking</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">Tender Recommendation</span>
            </div>

            <div className="space-y-2.5">
              {contenders.map((c, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl flex items-center justify-between ${
                    idx === 0
                      ? 'bg-amber-100/60 border-2 border-amber-300 font-bold'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? 'bg-[#D97706] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs text-slate-900 block font-bold">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Quote: {formatCur(c.price)} · Tech: {c.tech}/100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-base font-black font-mono ${idx === 0 ? 'text-[#D97706]' : 'text-slate-700'}`}>
                      {formatNum(c.qcbs, 2)} pts
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">Fin Score: {formatNum(c.fs, 1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Contractor Bid Builder Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'bid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Commercial Cost Heads (₹/m²)
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tender Scope Area (m²)</label>
                <input type="number" value={bidArea} onChange={e => setBidArea(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Blasting prep (₹/m²)</label>
                  <input type="number" value={blastingCostM2} onChange={e => setBlastingCostM2(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Primer Paint (₹/m²)</label>
                  <input type="number" value={primerCostM2} onChange={e => setPrimerCostM2(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Intermediate (₹/m²)</label>
                  <input type="number" value={midCostM2} onChange={e => setMidCostM2(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Topcoat (₹/m²)</label>
                  <input type="number" value={topCostM2} onChange={e => setTopCostM2(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Labour (₹/m²)</label>
                  <input type="number" value={scaffoldingLabourM2} onChange={e => setScaffoldingLabourM2(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">QA/QC (₹/m²)</label>
                  <input type="number" value={qaQcInspectorM2} onChange={e => setQaQcInspectorM2(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Margin (%)</label>
                  <input type="number" value={profitMarginPct} onChange={e => setProfitMarginPct(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase">Commercial Proposal Quote</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">Turnkey Rate</span>
            </div>

            <div className="bg-white border border-blue-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Grand Tender Bid Value</span>
              <div className="text-4xl font-black text-blue-600 font-mono mt-1">
                {formatCur(grandBidTotal)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                Unit Quote Rate: {formatCur(quoteRateM2)} / m²
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Direct Material Rate</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatCur(directMaterialCostM2)}/m²</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Direct Labour &amp; QA</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatCur(directLabourCostM2)}/m²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Batch Inspection Ticket Content */}
      {/* ---------------------------------------------------- */}
      {currentTab === 'ticket' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
              Batch QA Ticket Parameters
            </h2>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                  <input type="text" value={batchNo} onChange={e => setBatchNo(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Code</label>
                  <input type="text" value={productCode} onChange={e => setProductCode(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pot Life @ 30°C (min)</label>
                  <input type="number" value={potLifeMin} onChange={e => setPotLifeMin(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Viscosity (sec)</label>
                  <input type="number" value={viscositySec} onChange={e => setViscositySec(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mix Ratio</label>
                <input type="text" value={mixRatioVol} onChange={e => setMixRatioVol(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">QA Release Status</label>
                <select value={inspectionResult} onChange={e => setInspectionResult(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                  <option value="RELEASED">RELEASED FOR APPLICATION ✓</option>
                  <option value="QUARANTINED">QUARANTINED / HOLD ⚠️</option>
                  <option value="REJECTED">REJECTED ✗</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase">QA Release Card</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">{inspectionResult}</span>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Paint Batch Identifier</span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                {batchNo}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono font-bold">
                {productCode} · {mixRatioVol}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Pot Life</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{potLifeMin} Minutes</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Viscosity</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{viscositySec} s (Ford 4)</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
