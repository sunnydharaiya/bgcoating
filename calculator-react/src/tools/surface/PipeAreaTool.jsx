import React, { useState } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, RotateCcw, BookOpen, Play } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function PipeAreaTool() {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  const [itemName, setItemName] = useState('');
  const [nps, setNps] = useState('12');
  const [od, setOd] = useState('323.8'); // 12" pipe OD in mm
  const [length, setLength] = useState('');
  const [qty, setQty] = useState('1');
  const [surfaceType, setSurfaceType] = useState('external'); // 'external' | 'internal' | 'both'
  const [copied, setCopied] = useState(false);

  const npsList = [
    { label: 'Custom OD (Enter manually)', val: 'custom', od: 323.8 },
    { label: '1/2" NPS (21.3 mm)', val: '0.5', od: 21.3 },
    { label: '3/4" NPS (26.7 mm)', val: '0.75', od: 26.7 },
    { label: '1" NPS (33.4 mm)', val: '1', od: 33.4 },
    { label: '1.5" NPS (48.3 mm)', val: '1.5', od: 48.3 },
    { label: '2" NPS (60.3 mm)', val: '2', od: 60.3 },
    { label: '3" NPS (88.9 mm)', val: '3', od: 88.9 },
    { label: '4" NPS (114.3 mm)', val: '4', od: 114.3 },
    { label: '6" NPS (168.3 mm)', val: '6', od: 168.3 },
    { label: '8" NPS (219.1 mm)', val: '8', od: 219.1 },
    { label: '10" NPS (273.0 mm)', val: '10', od: 273.0 },
    { label: '12" NPS (323.8 mm)', val: '12', od: 323.8 },
    { label: '14" NPS (355.6 mm)', val: '14', od: 355.6 },
    { label: '16" NPS (406.4 mm)', val: '16', od: 406.4 },
    { label: '18" NPS (457.0 mm)', val: '18', od: 457.0 },
    { label: '20" NPS (508.0 mm)', val: '20', od: 508.0 },
    { label: '24" NPS (610.0 mm)', val: '24', od: 610.0 },
    { label: '30" NPS (762.0 mm)', val: '30', od: 762.0 },
    { label: '36" NPS (914.0 mm)', val: '36', od: 914.0 },
    { label: '48" NPS (1219.0 mm)', val: '48', od: 1219.0 }
  ];

  const handleNpsChange = (selectedNps) => {
    setNps(selectedNps);
    const item = npsList.find(n => n.val === selectedNps);
    if (item && item.val !== 'custom') {
      setOd(item.od);
    }
  };

  const handleCalculate = () => {
    if (!od || !length) {
      addToast('Missing Required Inputs', 'Please enter Pipe OD and Spool Length.', 'warning');
      return;
    }
    addToast('Calculated Pipe Area', 'Surface area take-off computed.', 'success');
  };

  const handleReset = () => {
    setItemName('');
    setNps('12');
    setOd('323.8');
    setLength('');
    setQty('1');
    setSurfaceType('external');
    addToast('Form Reset', 'All input parameters have been cleared.', 'info');
  };

  // Calculations
  const odM = Number(od || 0) / 1000;
  const singleExternalArea = Math.PI * odM * Number(length || 0);
  const singleInternalArea = Math.PI * (odM * 0.95) * Number(length || 0); // Approx assuming standard wall
  const totalExternal = singleExternalArea * Number(qty || 1);
  const totalInternal = singleInternalArea * Number(qty || 1);

  let activeArea = totalExternal;
  if (surfaceType === 'internal') activeArea = totalInternal;
  if (surfaceType === 'both') activeArea = totalExternal + totalInternal;

  const handleCopy = () => {
    if (!length) {
      addToast('No Calculation', 'Please enter spool length first.', 'warning');
      return;
    }
    const text = `BG CoatingOS™ — Pipe Spool Surface Area Calculation
${itemName ? `Item Name: ${itemName}\n` : ''}Pipe: ${nps === 'custom' ? 'Custom OD' : `${nps}" NPS`} (OD ${od} mm) | Length: ${length} m × ${qty} Nos.
Coating Scope: ${surfaceType.toUpperCase()}
--------------------------------------------------
External Surface Area: ${formatNum(totalExternal, 2)} m²
Internal Surface Area: ${formatNum(totalInternal, 2)} m²
Total Paintable Area: ${formatNum(activeArea, 2)} m²`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Pipe area calculation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Tool A-1
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Pipe Spool Surface Area Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate external, internal, or dual pipe surface areas with standard ASME B36.10M NPS library.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('pipe_spool')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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

      {/* Main Grid: Inputs + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Pipe Geometry &amp; Scope
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Optional Item Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Item Name <span className="text-slate-400 font-mono text-[10px] ml-1">optional</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                placeholder="e.g. Carbon Steel Pipe"
              />
            </div>

            {/* NPS Dropdown Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nominal Pipe Size (NPS / NB)
              </label>
              <select
                value={nps}
                onChange={e => handleNpsChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                {npsList.map(n => (
                  <option key={n.val} value={n.val}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pipe OD (mm)
                </label>
                <input
                  type="number"
                  value={od}
                  onChange={e => {
                    setOd(e.target.value);
                    setNps('custom');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="323.8"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Single Spool Length (metres)
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quantity (Number of Spools)
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Coating Application Scope
                </label>
                <select
                  value={surfaceType}
                  onChange={e => setSurfaceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                >
                  <option value="external">External Surface Only</option>
                  <option value="internal">Internal Lining Only</option>
                  <option value="both">Both External &amp; Internal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions: Calculate & Reset */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Calculate Pipe Area</span>
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

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Formula: <code>External Area = π × (OD/1000) × Length × Quantity</code>.
            </span>
          </div>
        </div>

        {/* Right Output Verdict Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Surface Area Results
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {qty} Spool{qty > 1 ? 's' : ''} ({Number(length) * Number(qty)} m Total Run)
              </span>
            </div>

            {/* Main Total Paintable Area Tile */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Total Paintable Area ({surfaceType.toUpperCase()})
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                  {formatNum(activeArea, 2)}
                </span>
                <span className="text-sm font-bold text-slate-400 font-mono">m²</span>
                <span className="text-xs text-slate-400 ml-auto font-mono">
                  ({formatNum(activeArea * 10.7639, 1)} sq ft)
                </span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Outside Coating Area
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-slate-900">
                    {formatNum(totalExternal, 2)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">m²</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Inside Lining Area
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-slate-900">
                    {formatNum(totalInternal, 2)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">m²</span>
                </div>
              </div>
            </div>

            {/* Input Data Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block text-[11px] font-mono uppercase tracking-wider">
                📝 Provided Geometry Summary
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between"><span>Nominal Size:</span><b className="text-slate-900">{nps === 'custom' ? 'Custom' : `${nps}" NPS`}</b></div>
                <div className="flex justify-between"><span>Outside Dia:</span><b className="text-slate-900">{od} mm</b></div>
                <div className="flex justify-between"><span>Spool Length:</span><b className="text-slate-900">{length} m</b></div>
                <div className="flex justify-between"><span>Quantity:</span><b className="text-slate-900">{qty} Nos</b></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
