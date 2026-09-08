import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Calculator, 
  Info, 
  BookOpen, 
  RotateCcw,
  Play,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function VolumeSolidsSuite({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [subTab, setSubTab] = useState('tds'); // 'tds' | 'density' | 'lab'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeSubTool === 'vs-den' || activeSubTool === 'volume_solids_density') {
      setSubTab('density');
    } else if (activeSubTool === 'vs-lab' || activeSubTool === 'volume_solids_lab') {
      setSubTab('lab');
    } else {
      setSubTab('tds');
    }
  }, [activeSubTool]);

  // Method 1: TDS Verification
  const [vstDft, setVstDft] = useState('');
  const [vstCov, setVstCov] = useState('');
  const [vstPub, setVstPub] = useState('');
  const [vstNm, setVstNm] = useState('');

  // Method 2: Density Verification
  const [vsdWs, setVsdWs] = useState('');
  const [vsdWd, setVsdWd] = useState('');
  const [vsdDd, setVsdDd] = useState('');
  const [vsdPub, setVsdPub] = useState('');
  const [vsdNm, setVsdNm] = useState('');

  // Method 3: Laboratory Verification (ASTM D2697 / ISO 3233)
  const [vslWe, setVslWe] = useState('');
  const [vslWw, setVslWw] = useState('');
  const [vslWd, setVslWd] = useState('');
  const [vslDen, setVslDen] = useState('');
  const [vslDv, setVslDv] = useState('');
  const [vslPub, setVslPub] = useState('');
  const [vslNm, setVslNm] = useState('');

  // Classification Helpers
  const getVsClass = (vs) => {
    if (vs > 90) return 'Solvent Free Coating';
    if (vs >= 80) return 'Ultra High Solids';
    if (vs >= 70) return 'High Solids';
    if (vs >= 60) return 'Medium High Solids';
    if (vs >= 50) return 'Conventional Industrial';
    if (vs >= 35) return 'Low Solids';
    return 'Very Low Solids';
  };

  const getVsRec = (vs) => {
    if (vs > 80) return 'Excellent coating efficiency. Low VOC emissions. High DFT achievable per coat. Recommended for offshore, marine, immersion service, storage tanks and heavy-duty industrial environments.';
    if (vs >= 60) return 'Suitable for most industrial protective coating applications. Good balance between application properties and performance.';
    if (vs >= 50) return 'Conventional industrial grade — acceptable for general atmospheric service. For severe exposures, evaluate high-solids alternatives.';
    return 'Higher solvent content — increased paint consumption and higher VOC emissions. Consider evaluating high-solids alternatives for improved productivity and reduced lifecycle cost.';
  };

  const getVsStatus = (calc, pub) => {
    if (!pub || pub <= 0) return null;
    const diff = Math.abs(calc - pub);
    const dev = (diff / pub) * 100;
    let st = 'PASS';
    let bg = 'bg-emerald-50 border-emerald-300 text-emerald-950';
    let badgeBg = 'bg-emerald-100 text-emerald-800';
    let ic = '✅';
    let text = 'TDS Value Verified';

    if (diff < 2) {
      st = 'PASS';
      bg = 'bg-[#E8F5E9] border-[#2E7D32]/40 text-[#1B5E20]';
      badgeBg = 'bg-emerald-100 text-emerald-800';
      ic = '✅';
      text = 'TDS Value Verified (Within ±2% Tolerance)';
    } else if (diff <= 5) {
      st = 'REVIEW';
      bg = 'bg-[#FFF8E1] border-[#F5911F]/50 text-[#8B4500]';
      badgeBg = 'bg-amber-100 text-amber-900';
      ic = '⚠️';
      text = 'Deviation 2–5% — Review with Manufacturer';
    } else {
      st = 'FAIL';
      bg = 'bg-[#FFEBEE] border-[#C62828]/40 text-[#B71C1C]';
      badgeBg = 'bg-red-100 text-red-900';
      ic = '❌';
      text = 'Deviation >5% — Reject / Investigate Formulation';
    }
    return { diff, dev, st, bg, badgeBg, ic, text };
  };

  // Calculations
  // Method 1: TDS Verification: VS% = DFT × Coverage ÷ 10
  const dft1 = parseFloat(vstDft) || 0;
  const cov1 = parseFloat(vstCov) || 0;
  const pub1 = parseFloat(vstPub) || 0;
  const vsCalc1 = vstDft && vstCov ? (dft1 * cov1) / 10 : 0;
  const status1 = vsCalc1 > 0 ? getVsStatus(vsCalc1, pub1) : null;

  // Method 2: Density Verification: VS% = Weight Solids × ( Wet Density ÷ Dry Density )
  const ws2 = parseFloat(vsdWs) || 0;
  const wd2 = parseFloat(vsdWd) || 0;
  const dd2 = parseFloat(vsdDd) || 0;
  const pub2 = parseFloat(vsdPub) || 0;
  const vsCalc2 = vsdWs && vsdWd && dd2 > 0 ? ws2 * (wd2 / dd2) : 0;
  const status2 = vsCalc2 > 0 ? getVsStatus(vsCalc2, pub2) : null;

  // Method 3: Laboratory Verification (ASTM D2697 / ISO 3233)
  const we3 = parseFloat(vslWe) || 0;
  const ww3 = parseFloat(vslWw) || 0;
  const wd3 = parseFloat(vslWd) || 0;
  const den3 = parseFloat(vslDen) || 0;
  const dv3 = parseFloat(vslDv) || 0;
  const pub3 = parseFloat(vslPub) || 0;

  const wetW3 = ww3 - we3;
  const dryW3 = wd3 - we3;
  const nv3 = wetW3 > 0 ? (dryW3 / wetW3) * 100 : 0;
  const wetVol3 = den3 > 0 ? wetW3 / den3 : 0;
  const vsCalc3 = vslDv && wetVol3 > 0 ? (dv3 / wetVol3) * 100 : 0;
  const dryDen3 = dv3 > 0 ? dryW3 / dv3 : 0;
  const status3 = vsCalc3 > 0 ? getVsStatus(vsCalc3, pub3) : null;

  const handleOpenGuideline = () => {
    if (subTab === 'tds') openGuideline('vs-tds');
    else if (subTab === 'density') openGuideline('vs-den');
    else openGuideline('vs-lab');
  };

  const handleCalculate = (method) => {
    if (method === 'tds') {
      if (!vstDft || !vstCov) {
        addToast('Missing Required Inputs', 'Please enter Specified DFT and Theoretical Coverage.', 'warning');
        return;
      }
      addToast('Calculated Volume Solids (TDS)', 'Volume solids computed from TDS values.', 'success');
    } else if (method === 'density') {
      if (!vsdWs || !vsdWd || !vsdDd) {
        addToast('Missing Required Inputs', 'Please enter Weight Solids, Wet Density, and Dry Film Density.', 'warning');
        return;
      }
      addToast('Calculated Volume Solids (Density)', 'Volume solids computed via density ratio.', 'success');
    } else {
      if (!vslWe || !vslWw || !vslWd || !vslDen || !vslDv) {
        addToast('Missing Required Inputs', 'Please enter all gravimetric and volumetric lab weights.', 'warning');
        return;
      }
      addToast('Calculated Volume Solids (Lab)', 'Volume solids gravimetrically verified.', 'success');
    }
  };

  const handleReset = (method) => {
    if (method === 'tds') {
      setVstDft('');
      setVstCov('');
      setVstPub('');
      setVstNm('');
    } else if (method === 'density') {
      setVsdWs('');
      setVsdWd('');
      setVsdDd('');
      setVsdPub('');
      setVsdNm('');
    } else {
      setVslWe('');
      setVslWw('');
      setVslWd('');
      setVslDen('');
      setVslDv('');
      setVslPub('');
      setVslNm('');
    }
    addToast('Form Reset', 'Form fields have been cleared.', 'info');
  };

  const handleCopy = () => {
    let summary = '';
    if (subTab === 'tds') {
      if (!vstDft || !vstCov) {
        addToast('No Calculation', 'Please enter parameters first.', 'warning');
        return;
      }
      summary = `Method 1 (TDS Verification): Calculated VS: ${formatNum(vsCalc1, 1)}% | Published TDS: ${vstPub || '—'}% | Status: ${status1?.st || 'N/A'}`;
    } else if (subTab === 'density') {
      if (!vsdWs || !vsdWd || !vsdDd) {
        addToast('No Calculation', 'Please enter parameters first.', 'warning');
        return;
      }
      summary = `Method 2 (Density Verification): Calculated VS: ${formatNum(vsCalc2, 1)}% | Published TDS: ${vsdPub || '—'}% | Status: ${status2?.st || 'N/A'}`;
    } else {
      if (!vslWe || !vslWw || !vslWd || !vslDen || !vslDv) {
        addToast('No Calculation', 'Please enter parameters first.', 'warning');
        return;
      }
      summary = `Method 3 (ASTM D2697 Lab): Calculated VS: ${formatNum(vsCalc3, 1)}% | NV% (Weight Solids): ${formatNum(nv3, 1)}% | Status: ${status3?.st || 'N/A'}`;
    }

    navigator.clipboard.writeText(`BG CoatingOS™ — Volume Solids Verification\n${summary}`);
    setCopied(true);
    addToast('Copied to Clipboard', 'Volume solids report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Subnav Method Selector Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          onClick={() => setSubTab('tds')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            subTab === 'tds' 
              ? 'bg-gradient-to-r from-[#F5911F] to-[#A50021] text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <span>📋</span>
          <span>Method 1 — TDS Verification</span>
        </button>

        <button
          onClick={() => setSubTab('density')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            subTab === 'density' 
              ? 'bg-gradient-to-r from-[#F5911F] to-[#A50021] text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <span>⚖️</span>
          <span>Method 2 — Density Verification</span>
        </button>

        <button
          onClick={() => setSubTab('lab')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            subTab === 'lab' 
              ? 'bg-gradient-to-r from-[#F5911F] to-[#A50021] text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <span>🧫</span>
          <span>Method 3 — Laboratory Verification</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* METHOD 1: TDS VERIFICATION METHOD                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'tds' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0">
                📋
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-extrabold text-slate-900">
                    Method 1 — TDS Verification
                  </h2>
                  <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
                    PRO · VS-1
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cross-check the manufacturer's Product Data Sheet: VS% = DFT × Coverage ÷ 10
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenGuideline}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 Guideline</span>
            </button>
          </div>

          {/* Form Inputs Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  DFT (from TDS) <span className="text-slate-400 font-mono text-[10px] ml-1">µm</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={vstDft}
                    onChange={e => setVstDft(e.target.value)}
                    placeholder="e.g. 125"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">µm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Theoretical Coverage <span className="text-slate-400 font-mono text-[10px] ml-1">m²/L</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={vstCov}
                    onChange={e => setVstCov(e.target.value)}
                    placeholder="e.g. 5.6"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">m²/L</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Published Volume Solids <span className="text-slate-400 font-mono text-[10px] ml-1">% · optional</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={vstPub}
                    onChange={e => setVstPub(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Product Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={vstNm}
                  onChange={e => setVstNm(e.target.value)}
                  placeholder="e.g. High-Build Epoxy"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                />
              </div>

            </div>

            {/* Formula Callout Banner */}
            <div className="p-3 bg-[#FFF9EE] border border-dashed border-[#F2DEC3] rounded-2xl text-xs text-stone-700 leading-relaxed font-mono">
              <strong className="text-[#A34E00]">Formula:</strong> Volume Solids (%) = ( DFT × Theoretical Coverage ) ÷ 10 &nbsp;·&nbsp; Example: 125 µm × 5.6 m²/L ÷ 10 = <strong>70%</strong>
            </div>

            {/* Action Button Row */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleCalculate('tds')}
                className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Verify Volume Solids</span>
              </button>
              <button
                type="button"
                onClick={() => handleReset('tds')}
                className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Results Output Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#A50021]"></span>
              Volume Solids Result
            </div>

            {/* Live Verdict Banner */}
            {status1 && (
              <div className={`p-4 rounded-2xl border ${status1.bg} text-center space-y-1`}>
                <div className="text-base md:text-lg font-black tracking-tight flex items-center justify-center gap-2">
                  <span>{status1.ic}</span>
                  <span>{status1.st} — {status1.text}</span>
                </div>
                <div className="text-xs font-bold opacity-90 font-mono">
                  Calculated {formatNum(vsCalc1, 1)}% vs Published {formatNum(pub1, 1)}% · Δ {formatNum(status1.diff, 1)}% ({formatNum(status1.dev, 1)}% deviation)
                </div>
              </div>
            )}

            {/* 4 Output Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-stone-500">Calculated Volume Solids</div>
                <div className="text-2xl font-black text-[#A34E00] font-mono mt-1">
                  {formatNum(vsCalc1, 1)}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] font-bold text-stone-500 mt-1 font-mono">
                  {getVsClass(vsCalc1)}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500">Published VS (TDS)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {pub1 > 0 ? formatNum(pub1, 1) : '—'}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Specified in TDS
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-blue-900">Difference</div>
                <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                  {status1 ? `${formatNum(status1.diff, 1)}` : '—'}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-blue-600 mt-1 font-mono">
                  Absolute Variance
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500">Deviation</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {status1 ? `${formatNum(status1.dev, 1)}` : '—'}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Percentage of TDS
                </div>
              </div>
            </div>

            {/* Input Summary Box */}
            <div className="bg-stone-50/70 border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-stone-700 pb-1 border-b border-stone-200">
                📝 Input Data (Provided by User)
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200 text-stone-600">
                <span>Product Name</span>
                <span className="font-bold text-stone-900">{vstNm || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200 text-stone-600">
                <span>DFT</span>
                <span className="font-mono font-bold text-stone-900">{vstDft} µm</span>
              </div>
              <div className="flex justify-between py-1 text-stone-600">
                <span>Theoretical Coverage</span>
                <span className="font-mono font-bold text-stone-900">{vstCov} m²/L</span>
              </div>
            </div>

            {/* Smart Recommendation Box */}
            <div className="p-3.5 bg-[#FDF1E4] border border-[#F2DEC3] border-l-4 border-l-[#F5911F] rounded-2xl text-xs text-stone-800 leading-relaxed space-y-1">
              <strong className="text-[#A50021] block">
                🛠 Smart Engineering Recommendation — {getVsClass(vsCalc1)}:
              </strong>
              <p>{getVsRec(vsCalc1)}</p>
            </div>

            {/* Validation Criteria Alert */}
            <div className="p-3.5 bg-[#E1F5FE] border-l-4 border-l-[#0288D1] rounded-2xl text-xs text-slate-700 leading-relaxed font-mono">
              <strong className="text-[#0288D1]">Validation Criteria:</strong> Difference &lt; ±2% → <strong>PASS</strong> · 2–5% → <strong>REVIEW</strong> · &gt; 5% → <strong>FAIL</strong>. Engineering verification only — not a substitute for ASTM D2697 / ISO 3233 laboratory testing.
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>🖨 Print PDF</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>📤 Share Text</span>
              </button>
              <button
                onClick={() => addToast('Excel Export', 'CSV report prepared for download.', 'info')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>📊 Excel Report</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* METHOD 2: DENSITY VERIFICATION METHOD                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'density' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl shrink-0">
                ⚖️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-extrabold text-slate-900">
                    Method 2 — Density Verification
                  </h2>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
                    PRO · VS-2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paint-manufacturing method: VS = Weight Solids × Wet Density ÷ Dry Film Density
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenGuideline}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 Guideline</span>
            </button>
          </div>

          {/* Form Inputs Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Weight Solids <span className="text-slate-400 font-mono text-[10px] ml-1">%</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={vsdWs}
                    onChange={e => setVsdWs(e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Wet Paint Density <span className="text-slate-400 font-mono text-[10px] ml-1">kg/L · ASTM D1475</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={vsdWd}
                    onChange={e => setVsdWd(e.target.value)}
                    placeholder="e.g. 1.60"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">kg/L</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dry Film Density <span className="text-slate-400 font-mono text-[10px] ml-1">kg/L</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={vsdDd}
                    onChange={e => setVsdDd(e.target.value)}
                    placeholder="e.g. 1.80"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">kg/L</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Published Volume Solids <span className="text-slate-400 font-mono text-[10px] ml-1">% · optional</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={vsdPub}
                    onChange={e => setVsdPub(e.target.value)}
                    placeholder="e.g. 71"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Product Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={vsdNm}
                  onChange={e => setVsdNm(e.target.value)}
                  placeholder="e.g. Solvent-Free Epoxy"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                />
              </div>

            </div>

            {/* Formula Callout Banner */}
            <div className="p-3 bg-[#FFF9EE] border border-dashed border-[#F2DEC3] rounded-2xl text-xs text-stone-700 leading-relaxed font-mono">
              <strong className="text-[#A34E00]">Formula:</strong> VS% = Weight Solids × ( Wet Density ÷ Dry Film Density ) &nbsp;·&nbsp; Example: 0.80 × 1.60 ÷ 1.80 = <strong>71.1%</strong>
            </div>

            {/* Action Button Row */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleCalculate('density')}
                className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Calculate Volume Solids</span>
              </button>
              <button
                type="button"
                onClick={() => handleReset('density')}
                className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Results Output Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#A50021]"></span>
              Volume Solids Result
            </div>

            {/* Live Verdict Banner */}
            {status2 && (
              <div className={`p-4 rounded-2xl border ${status2.bg} text-center space-y-1`}>
                <div className="text-base md:text-lg font-black tracking-tight flex items-center justify-center gap-2">
                  <span>{status2.ic}</span>
                  <span>{status2.st} — {status2.text}</span>
                </div>
                <div className="text-xs font-bold opacity-90 font-mono">
                  Calculated {formatNum(vsCalc2, 1)}% vs Published {formatNum(pub2, 1)}% · Δ {formatNum(status2.diff, 1)}% ({formatNum(status2.dev, 1)}% deviation)
                </div>
              </div>
            )}

            {/* 4 Output Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-stone-500">Calculated Volume Solids</div>
                <div className="text-2xl font-black text-[#A34E00] font-mono mt-1">
                  {formatNum(vsCalc2, 1)}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] font-bold text-stone-500 mt-1 font-mono">
                  {getVsClass(vsCalc2)}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500">Published VS (TDS)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {pub2 > 0 ? formatNum(pub2, 1) : '—'}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Specified in TDS
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-blue-900">Difference</div>
                <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                  {status2 ? `${formatNum(status2.diff, 1)}` : '—'}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-blue-600 mt-1 font-mono">
                  Absolute Variance
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500">Deviation</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {status2 ? `${formatNum(status2.dev, 1)}` : '—'}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Percentage of TDS
                </div>
              </div>
            </div>

            {/* Input Summary Box */}
            <div className="bg-stone-50/70 border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-stone-700 pb-1 border-b border-stone-200">
                📝 Input Data (Provided by User)
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200 text-stone-600">
                <span>Product Name</span>
                <span className="font-bold text-stone-900">{vsdNm || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200 text-stone-600">
                <span>Weight Solids</span>
                <span className="font-mono font-bold text-stone-900">{vsdWs}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200 text-stone-600">
                <span>Wet Density</span>
                <span className="font-mono font-bold text-stone-900">{vsdWd} kg/L</span>
              </div>
              <div className="flex justify-between py-1 text-stone-600">
                <span>Dry Film Density</span>
                <span className="font-mono font-bold text-stone-900">{vsdDd} kg/L</span>
              </div>
            </div>

            {/* Smart Recommendation Box */}
            <div className="p-3.5 bg-[#FDF1E4] border border-[#F2DEC3] border-l-4 border-l-[#F5911F] rounded-2xl text-xs text-stone-800 leading-relaxed space-y-1">
              <strong className="text-[#A50021] block">
                🛠 Smart Engineering Recommendation — {getVsClass(vsCalc2)}:
              </strong>
              <p>{getVsRec(vsCalc2)}</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>🖨 Print PDF</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>📤 Share Text</span>
              </button>
              <button
                onClick={() => addToast('Excel Export', 'CSV report prepared for download.', 'info')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>📊 Excel Report</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* METHOD 3: LABORATORY VERIFICATION (ASTM D2697 / ISO 3233)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'lab' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                🧫
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-extrabold text-slate-900">
                    Method 3 — Laboratory Verification
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
                    PRO · VS-3
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ASTM D2697 / ISO 3233 — most accurate: gravimetric weights + measured dry film volume
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenGuideline}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 Guideline</span>
            </button>
          </div>

          {/* Form Inputs Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Weight of Empty Dish <span className="text-slate-400 font-mono text-[10px] ml-1">g</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    value={vslWe}
                    onChange={e => setVslWe(e.target.value)}
                    placeholder="e.g. 25.000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">g</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dish + Wet Paint <span className="text-slate-400 font-mono text-[10px] ml-1">g</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    value={vslWw}
                    onChange={e => setVslWw(e.target.value)}
                    placeholder="e.g. 30.000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">g</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dish + Dry Film <span className="text-slate-400 font-mono text-[10px] ml-1">g · after cure</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    value={vslWd}
                    onChange={e => setVslWd(e.target.value)}
                    placeholder="e.g. 29.000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">g</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Wet Paint Density <span className="text-slate-400 font-mono text-[10px] ml-1">kg/L · ASTM D1475</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={vslDen}
                    onChange={e => setVslDen(e.target.value)}
                    placeholder="e.g. 1.60"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">kg/L</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Measured Dry Film Volume <span className="text-slate-400 font-mono text-[10px] ml-1">cm³ · D2697</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    value={vslDv}
                    onChange={e => setVslDv(e.target.value)}
                    placeholder="e.g. 2.200"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">cm³</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Published Volume Solids <span className="text-slate-400 font-mono text-[10px] ml-1">% · optional</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={vslPub}
                    onChange={e => setVslPub(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">%</span>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Product / Lab Reference <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
                </label>
                <input
                  type="text"
                  value={vslNm}
                  onChange={e => setVslNm(e.target.value)}
                  placeholder="e.g. Batch 4521 — Epoxy MIO"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                />
              </div>

            </div>

            {/* Calculation Steps Callout */}
            <div className="p-3.5 bg-[#FFF9EE] border border-dashed border-[#F2DEC3] rounded-2xl text-xs text-stone-700 leading-relaxed font-mono">
              <strong className="text-[#A34E00] block mb-1">Calculation Steps:</strong>
              ① Wet Wt = (Dish+Wet) − Dish &nbsp;·&nbsp;
              ② Dry Wt = (Dish+Dry) − Dish &nbsp;·&nbsp;
              ③ Non-Volatile % = Dry ÷ Wet × 100 &nbsp;·&nbsp;
              ④ Wet Volume = Wet Wt ÷ Density &nbsp;·&nbsp;
              ⑤ <strong>VS% = Dry Film Volume ÷ Wet Volume × 100</strong>
            </div>

            {/* Action Button Row */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleCalculate('lab')}
                className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Calculate Volume Solids (Lab)</span>
              </button>
              <button
                type="button"
                onClick={() => handleReset('lab')}
                className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Results Output Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#A50021]"></span>
              Laboratory Volume Solids Result
            </div>

            {/* Live Verdict Banner */}
            {status3 && (
              <div className={`p-4 rounded-2xl border ${status3.bg} text-center space-y-1`}>
                <div className="text-base md:text-lg font-black tracking-tight flex items-center justify-center gap-2">
                  <span>{status3.ic}</span>
                  <span>{status3.st} — {status3.text}</span>
                </div>
                <div className="text-xs font-bold opacity-90 font-mono">
                  Calculated {formatNum(vsCalc3, 1)}% vs Published {formatNum(pub3, 1)}% · Δ {formatNum(status3.diff, 1)}% ({formatNum(status3.dev, 1)}% deviation)
                </div>
              </div>
            )}

            {/* 4 Output Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-stone-500">Volume Solids (Lab)</div>
                <div className="text-2xl font-black text-[#A34E00] font-mono mt-1">
                  {formatNum(vsCalc3, 1)}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] font-bold text-stone-500 mt-1 font-mono">
                  {getVsClass(vsCalc3)}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500">Weight Solids (NV%)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {formatNum(nv3, 1)}<span className="text-xs font-normal ml-0.5">%</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Non-Volatile Matter
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-blue-900">Wet Paint Volume</div>
                <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                  {formatNum(wetVol3, 3)}<span className="text-xs font-normal ml-0.5">cm³</span>
                </div>
                <div className="text-[10px] text-blue-600 mt-1 font-mono">
                  Wet Mass ÷ Density
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500">Dry Film Density</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {formatNum(dryDen3, 3)}<span className="text-xs font-normal ml-0.5">kg/L</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Derived Gravimetric
                </div>
              </div>
            </div>

            {/* Input Summary Box */}
            <div className="bg-stone-50/70 border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-stone-700 pb-1 border-b border-stone-200">
                📝 Input Data (Provided by User)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-stone-600">
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Product / Lab Ref</span>
                  <span className="font-bold text-stone-900">{vslNm || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Empty Dish</span>
                  <span className="font-mono font-bold text-stone-900">{vslWe} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Dish + Wet Paint</span>
                  <span className="font-mono font-bold text-stone-900">{vslWw} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Dish + Dry Film</span>
                  <span className="font-mono font-bold text-stone-900">{vslWd} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Wet Paint Weight</span>
                  <span className="font-mono font-bold text-stone-900">{formatNum(wetW3, 3)} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Dry Film Weight</span>
                  <span className="font-mono font-bold text-stone-900">{formatNum(dryW3, 3)} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Wet Density</span>
                  <span className="font-mono font-bold text-stone-900">{vslDen} kg/L</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                  <span>Dry Film Volume (Measured)</span>
                  <span className="font-mono font-bold text-stone-900">{vslDv} cm³</span>
                </div>
              </div>
            </div>

            {/* Smart Recommendation Box */}
            <div className="p-3.5 bg-[#FDF1E4] border border-[#F2DEC3] border-l-4 border-l-[#F5911F] rounded-2xl text-xs text-stone-800 leading-relaxed space-y-1">
              <strong className="text-[#A50021] block">
                🛠 Smart Engineering Recommendation — {getVsClass(vsCalc3)}:
              </strong>
              <p>{getVsRec(vsCalc3)}</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>🖨 Print PDF</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>📤 Share Text</span>
              </button>
              <button
                onClick={() => addToast('Excel Export', 'CSV report prepared for download.', 'info')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>📊 Excel Report</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
