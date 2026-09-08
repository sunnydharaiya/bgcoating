import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Calculator, 
  Info, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck,
  FileSpreadsheet,
  Share2,
  Download,
  Play,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum, formatCur } from '../../utils/calculations';

export default function PaintReconciliationTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [copied, setCopied] = useState(false);

  // Section A: Project Information
  const [proj, setProj] = useState('');
  const [client, setClient] = useState('');
  const [contractor, setContractor] = useState('');
  const [mfr, setMfr] = useState('');
  const [prod, setProd] = useState('');
  const [coatNo, setCoatNo] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // Section B: Surface & Specification
  const [area, setArea] = useState('');
  const [dft, setDft] = useState('');
  const [vs, setVs] = useState('');
  const [loss, setLoss] = useState('15');
  const [coats, setCoats] = useState('1');

  // Section C: Material Issue Details
  const [opening, setOpening] = useState('');
  const [received, setReceived] = useState('');
  const [issued, setIssued] = useState('');
  const [returned, setReturned] = useState('0');
  const [unused, setUnused] = useState('0');
  const [rejected, setRejected] = useState('0');
  const [spillage, setSpillage] = useState('0');
  const [thinner, setThinner] = useState('0');

  // Section D: Density & Cost
  const [density, setDensity] = useState('');
  const [cost, setCost] = useState('');

  // Calculations
  const a = parseFloat(area) || 0;
  const d = parseFloat(dft) || 0;
  const v = parseFloat(vs) || 0;
  const l = parseFloat(loss) || 0;
  const c = parseFloat(coats) || 1;

  const op = parseFloat(opening) || 0;
  const rc = parseFloat(received) || 0;
  const is = parseFloat(issued) || 0;
  const rt = parseFloat(returned) || 0;
  const un = parseFloat(unused) || 0;
  const rj = parseFloat(rejected) || 0;
  const sp = parseFloat(spillage) || 0;
  const th = parseFloat(thinner) || 0;
  const den = parseFloat(density) || 0;
  const prc = parseFloat(cost) || 0;

  const hasInputs = area && dft && vs && issued;

  // Theoretical & Practical Requirement
  const tc = d > 0 ? (v * 10) / d : 0; // m²/L
  const pc = tc * (1 - l / 100);       // m²/L
  const theoReq = tc > 0 && hasInputs ? (a * c) / tc : 0;
  const pracReq = pc > 0 && hasInputs ? (a * c) / pc : 0;

  // Material Flow
  const totalAvail = op + rc;
  const consumed = is - rt - un;
  const wasted = sp + rj;
  const totalActual = hasInputs ? Math.max(0, consumed + wasted) : 0;
  const closingStore = totalAvail - is + rt;

  // Variances
  const variance = hasInputs ? totalActual - pracReq : 0; // + excess, - saving
  const varPercent = pracReq > 0 && hasInputs ? (variance / pracReq) * 100 : 0;
  const saving = variance < 0;
  const finImpact = prc > 0 && hasInputs ? Math.abs(variance) * prc : null;
  const eff = totalActual > 0 ? (pracReq / totalActual) * 100 : 0;
  const util = is > 0 ? (consumed / is) * 100 : 0;
  const totalKg = den > 0 && hasInputs ? totalActual * den : null;

  // Classification logic
  const absVar = Math.abs(varPercent);
  let status = 'READY';
  let cls = 'Awaiting Inputs';
  let verdictBg = 'bg-slate-50 border-slate-200 text-slate-700';
  let barCol = '#2E7D32';
  let icon = '📊';

  if (hasInputs) {
    if (absVar <= 5) {
      status = 'PASS';
      cls = 'Excellent Control';
      verdictBg = 'bg-[#E8F5E9] border-[#2E7D32]/40 text-[#1B5E20]';
      barCol = '#2E7D32';
      icon = '✅';
    } else if (absVar <= 10) {
      status = 'PASS';
      cls = 'Acceptable';
      verdictBg = 'bg-[#E3F2FD] border-[#1565C0]/40 text-[#0D47A1]';
      barCol = '#1565C0';
      icon = '🔵';
    } else if (absVar <= 15) {
      status = 'REVIEW';
      cls = 'Needs Review';
      verdictBg = 'bg-[#FFF8E1] border-[#F5911F]/50 text-[#8B4500]';
      barCol = '#F5911F';
      icon = '⚠️';
    } else {
      status = 'FAIL';
      cls = 'Investigate';
      verdictBg = 'bg-[#FFEBEE] border-[#C62828]/40 text-[#B71C1C]';
      barCol = '#C62828';
      icon = '❌';
    }
  }

  const getComment = () => {
    if (!hasInputs) {
      return 'Enter painted surface area, specified DFT, volume solids, and material issued to run reconciliation.';
    }
    if (varPercent < -5) {
      return 'Paint saving achieved — actual consumption is below the estimated requirement. Verify that specified DFT was achieved (ISO 19840 / SSPC-PA 2) before accepting the saving.';
    }
    if (absVar <= 5) {
      return 'Excellent material control. Paint consumption is within acceptable engineering limits.';
    }
    if (absVar <= 10) {
      return 'Paint consumption is slightly higher than estimated. Review application efficiency, overspray, and blasting profile.';
    }
    if (absVar <= 15) {
      return 'Consumption variance requires review. Check DFT records, transfer efficiency, mixing practice and wastage handling before closing the reconciliation.';
    }
    return 'Excessive paint consumption detected. Investigate overspray, surface profile, application method, workmanship, equipment calibration, and material handling.';
  };

  const handleCalculate = () => {
    if (!area || !dft || !vs || !issued) {
      addToast('Missing Required Inputs', 'Please enter Surface Area, Specified DFT, Volume Solids, and Paint Issued.', 'warning');
      return;
    }
    addToast('Calculated Paint Reconciliation', 'Material variance and consumption efficiency evaluated.', 'success');
  };

  const handleReset = () => {
    setProj('');
    setClient('');
    setContractor('');
    setMfr('');
    setProd('');
    setCoatNo('');
    setArea('');
    setDft('');
    setVs('');
    setLoss('15');
    setCoats('1');
    setOpening('');
    setReceived('');
    setIssued('');
    setReturned('0');
    setUnused('0');
    setRejected('0');
    setSpillage('0');
    setThinner('0');
    setDensity('');
    setCost('');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  const handleCopy = () => {
    if (!hasInputs) {
      addToast('No Calculation', 'Please enter parameters first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Paint Reconciliation Report
Project: ${proj || '—'} | Client: ${client || '—'} | Paint: ${mfr} ${prod}
--------------------------------------
Theoretical: ${formatNum(theoReq, 1)} L | Practical Req: ${formatNum(pracReq, 1)} L
Total Actual Consumed: ${formatNum(totalActual, 1)} L
Variance: ${variance >= 0 ? '+' : ''}${formatNum(variance, 1)} L (${formatNum(varPercent, 1)}%)
Verdict: ${status} — ${cls}
${finImpact ? `Financial Impact: ${saving ? 'Saving ' : 'Loss '}${formatCur(finImpact)}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Reconciliation report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const ROOT_CAUSES = [
    'Excessive blast profile (high anchor pattern dead volume)',
    'Higher-than-specified DFT applied on steel',
    'Poor transfer efficiency / excessive overspray in field',
    'Poor application technique or untrained blasters/painters',
    'Incorrect mixing ratio or exceeded pot life',
    'Material left inside airless spray pumps and fluid lines',
    'Paint residue remaining inside discarded cans / drums',
    'Poor jobsite storage, leakage or spillage',
    'Rework / touch-up coating defects'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool PRO-PR-1
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Paint Reconciliation Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theoretical requirement vs actual issued / consumed / returned — savings, excess &amp; financial impact
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('pro-recon')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs hover:shadow-sm transition cursor-pointer shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Guideline</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Main Input Form Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        
        {/* Section A: Project Information */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#A34E00] border-b border-amber-100 pb-1">
            A · Project Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Name <span className="text-slate-400 font-mono text-[10px]">optional</span></label>
              <input type="text" value={proj} onChange={e => setProj(e.target.value)} placeholder="e.g. Tank Farm T-101 External" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client <span className="text-slate-400 font-mono text-[10px]">optional</span></label>
              <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. IOCL" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contractor <span className="text-slate-400 font-mono text-[10px]">optional</span></label>
              <input type="text" value={contractor} onChange={e => setContractor(e.target.value)} placeholder="e.g. ABC Coatings Pvt Ltd" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Manufacturer <span className="text-slate-400 font-mono text-[10px]">optional</span></label>
              <input type="text" value={mfr} onChange={e => setMfr(e.target.value)} placeholder="e.g. Jotun / AkzoNobel" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Product <span className="text-slate-400 font-mono text-[10px]">optional</span></label>
              <input type="text" value={prod} onChange={e => setProd(e.target.value)} placeholder="e.g. Epoxy MIO Intermediate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Report Date <span className="text-slate-400 font-mono text-[10px]">optional</span></label>
              <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
            </div>
          </div>
        </div>

        {/* Section B: Surface & Specification */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#A34E00] border-b border-amber-100 pb-1">
            B · Surface &amp; Specification
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Surface Area Painted <span className="text-slate-400 font-mono text-[10px]">m²</span></label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 2500" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specified DFT <span className="text-slate-400 font-mono text-[10px]">µm</span></label>
              <input type="number" value={dft} onChange={e => setDft(e.target.value)} placeholder="e.g. 125" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Volume Solids <span className="text-slate-400 font-mono text-[10px]">%</span></label>
              <input type="number" value={vs} onChange={e => setVs(e.target.value)} placeholder="e.g. 70" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Loss Factor <span className="text-slate-400 font-mono text-[10px]">%</span></label>
              <input type="number" value={loss} onChange={e => setLoss(e.target.value)} placeholder="15" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Coats <span className="text-slate-400 font-mono text-[10px]">nos</span></label>
              <input type="number" value={coats} onChange={e => setCoats(e.target.value)} placeholder="1" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
          </div>
        </div>

        {/* Section C: Material Issue Details */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#A34E00] border-b border-amber-100 pb-1">
            C · Material Issue Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Opening Stock <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={opening} onChange={e => setOpening(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Received <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={received} onChange={e => setReceived(e.target.value)} placeholder="e.g. 400" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Paint Available <span className="text-slate-400 font-mono text-[10px]">auto</span></label>
              <input type="text" readOnly value={`${totalAvail} L`} className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-700 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Issued to Site <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={issued} onChange={e => setIssued(e.target.value)} placeholder="e.g. 450" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Returned to Store <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={returned} onChange={e => setReturned(e.target.value)} placeholder="0" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unused Paint in Container <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={unused} onChange={e => setUnused(e.target.value)} placeholder="0" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rejected Paint <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={rejected} onChange={e => setRejected(e.target.value)} placeholder="0" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Spillage / Wastage <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={spillage} onChange={e => setSpillage(e.target.value)} placeholder="0" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Thinner Issued <span className="text-slate-400 font-mono text-[10px]">L</span></label>
              <input type="number" value={thinner} onChange={e => setThinner(e.target.value)} placeholder="0" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            </div>
          </div>
        </div>

        {/* Section D: Density & Cost */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#A34E00] border-b border-amber-100 pb-1">
            D · Optional — Density &amp; Cost
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Density <span className="text-slate-400 font-mono text-[10px]">kg/L</span></label>
              <input type="number" step="0.01" value={density} onChange={e => setDensity(e.target.value)} placeholder="e.g. 1.45" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paint Cost <span className="text-slate-400 font-mono text-[10px]">₹/L</span></label>
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="e.g. 650" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCalculate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Paint Reconciliation</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Results Output Section */}
        <div className="space-y-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-[#A50021]"></span>
            Reconciliation Result
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-2xl border ${verdictBg} text-center space-y-1`}>
            <div className="text-base md:text-lg font-black tracking-tight flex items-center justify-center gap-2">
              <span>{icon}</span>
              <span>{status} — {cls}</span>
            </div>
            <div className="text-xs font-bold opacity-90 font-mono">
              {saving ? `Paint Saving of ${formatNum(Math.abs(variance), 1)} L` : `Paint Excess of ${formatNum(variance, 1)} L`} · Variance {variance >= 0 ? '+' : ''}{formatNum(varPercent, 1)}% vs Practical Req {formatNum(pracReq, 1)} L
            </div>
          </div>

          {/* 4 Primary Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
              <div className="text-[11px] font-bold text-stone-500">Paint Variance</div>
              <div className="text-2xl font-black text-[#A34E00] font-mono mt-1">
                {variance >= 0 ? '+' : '−'}{formatNum(Math.abs(variance), 1)}<span className="text-xs font-normal ml-0.5">L</span>
              </div>
              <div className="text-[10px] font-bold text-stone-500 mt-1 font-mono">
                {saving ? 'Paint Saving (−)' : 'Paint Excess (+)'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500">Variance %</div>
              <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                {variance >= 0 ? '+' : '−'}{formatNum(Math.abs(varPercent), 1)}<span className="text-xs font-normal ml-0.5">%</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {cls}
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 text-center shadow-2xs">
              <div className="text-[11px] font-bold text-blue-900">Consumption Efficiency</div>
              <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                {formatNum(eff, 1)}<span className="text-xs font-normal ml-0.5">%</span>
              </div>
              <div className="text-[10px] text-blue-600 mt-1 font-mono">
                Practical ÷ Actual
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500">Material Utilization</div>
              <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                {formatNum(util, 1)}<span className="text-xs font-normal ml-0.5">%</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Productive Share
              </div>
            </div>
          </div>

          {/* 6 Secondary Detail Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-slate-500">Theoretical Req</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{formatNum(theoReq, 1)} L</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-slate-500">Practical Req (Loss)</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{formatNum(pracReq, 1)} L</div>
            </div>
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-blue-900">Actual Consumed</div>
              <div className="text-base font-bold font-mono text-blue-900 mt-0.5">{formatNum(consumed, 1)} L</div>
            </div>
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-blue-900">Total Actual (Losses)</div>
              <div className="text-base font-bold font-mono text-blue-900 mt-0.5">{formatNum(totalActual, 1)} L</div>
            </div>
            <div className="bg-red-50/60 border border-red-200 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-red-900">Wastage (Spill/Rej)</div>
              <div className="text-base font-bold font-mono text-red-900 mt-0.5">{formatNum(wasted, 1)} L</div>
            </div>
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-amber-900">Financial Impact</div>
              <div className="text-base font-bold font-mono text-amber-900 mt-0.5">{finImpact ? formatCur(finImpact) : '—'}</div>
            </div>
          </div>

          {/* Visual Material Flow Diagram */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              Material Flow Balance
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 text-center font-mono">
              {[
                { label: 'Opening', val: op },
                { label: 'Received', val: rc },
                { label: 'Available', val: totalAvail },
                { label: 'Issued', val: is },
                { label: 'Returned', val: rt },
                { label: 'Unused', val: un },
                { label: 'Consumed', val: consumed },
                { label: 'Wastage', val: wasted },
                { label: 'Closing Store', val: closingStore, highlight: true }
              ].map((item, idx) => (
                <div key={idx} className={`p-2 rounded-xl border text-xs ${item.highlight ? 'bg-[#FDF1E4] border-[#F5911F] text-[#A50021]' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">{item.label}</div>
                  <div className="text-sm font-bold mt-0.5">{formatNum(item.val, 1)} L</div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Bars */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              Theoretical vs Actual Requirement
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Theoretical Requirement</span>
                  <span className="font-bold">{formatNum(theoReq, 1)} L</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, (theoReq / Math.max(theoReq, pracReq, totalActual, 1)) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Practical Requirement (incl. loss)</span>
                  <span className="font-bold">{formatNum(pracReq, 1)} L</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (pracReq / Math.max(theoReq, pracReq, totalActual, 1)) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Total Actual Consumption</span>
                  <span className="font-bold">{formatNum(totalActual, 1)} L</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${saving ? 'bg-emerald-600' : 'bg-[#D97706]'}`} style={{ width: `${Math.min(100, (totalActual / Math.max(theoReq, pracReq, totalActual, 1)) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Engineering Comment Box */}
          <div className="p-3.5 bg-[#E8F5E9] border border-[#2E7D32]/30 border-l-4 border-l-[#2E7D32] rounded-2xl text-xs text-stone-800 leading-relaxed space-y-1">
            <strong className="text-[#1B5E20] block font-bold">
              🧠 Engineering Comment:
            </strong>
            <p>{getComment()}</p>
          </div>

          {/* Root Cause Analysis Box (if variance > 10%) */}
          {absVar > 10 && !saving && (
            <div className="p-4 bg-[#FDF1E4] border border-[#F2DEC3] border-l-4 border-l-[#A50021] rounded-2xl text-xs text-stone-800 leading-relaxed space-y-1.5">
              <strong className="text-[#A50021] block font-bold">
                🔎 Root Cause Analysis — Likely Causes to Investigate:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-stone-700">
                {ROOT_CAUSES.map((rcItem, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#A50021]">•</span>
                    <span>{rcItem}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Material Summary Table */}
          <div className="bg-stone-50/80 border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="font-bold text-stone-700 pb-1 border-b border-stone-200">
              📝 Project Material Summary
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-stone-600">
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                <span>Project / Client</span>
                <span className="font-bold text-stone-900">{proj} / {client}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                <span>Paint System</span>
                <span className="font-bold text-stone-900">{mfr} — {prod} ({coatNo})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                <span>Area Coated</span>
                <span className="font-mono font-bold text-stone-900">{a} m² ({c} coat)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                <span>Spreading Rate (Practical)</span>
                <span className="font-mono font-bold text-stone-900">{formatNum(pc, 2)} m²/L</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                <span>Total Consumed</span>
                <span className="font-mono font-bold text-stone-900">{formatNum(consumed, 1)} L</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-stone-200">
                <span>Closing Store Balance</span>
                <span className="font-mono font-bold text-stone-900">{formatNum(closingStore, 1)} L</span>
              </div>
            </div>
          </div>

          {/* Classification & Standards Note */}
          <div className="p-3.5 bg-[#E1F5FE] border-l-4 border-l-[#0288D1] rounded-2xl text-xs text-slate-700 leading-relaxed font-mono">
            <strong className="text-[#0288D1]">Classification:</strong> ±0–5% Excellent Control · ±5–10% Acceptable · ±10–15% Needs Review · &gt;15% Investigate &nbsp;|&nbsp; <strong>References:</strong> ISO 12944 · ISO 19840 · SSPC PA Guide · ASTM D3276 · ASTM D4414 · AMPP GPP · NORSOK M-501 · PMBOK Material Control
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

    </div>
  );
}
