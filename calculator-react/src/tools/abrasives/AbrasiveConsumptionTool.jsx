import React, { useState, useEffect } from 'react';
import { Sparkles, Printer, Copy, Check, Calculator, Info, Gem, Disc, RotateCcw, BookOpen, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';
import { formatNum } from '../../utils/calculations';

export default function AbrasiveConsumptionTool({ activeSubTool, onSubToolChange }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();
  
  // Active media: garnet vs copper_slag
  const [activeMedia, setActiveMedia] = useState(
    activeSubTool === 'copper_slag' || activeSubTool === 'abrasive_copper_slag' ? 'copper_slag' : 'garnet'
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeSubTool === 'copper_slag' || activeSubTool === 'abrasive_copper_slag') {
      setActiveMedia('copper_slag');
    } else if (activeSubTool === 'garnet' || activeSubTool === 'abrasive_garnet') {
      setActiveMedia('garnet');
    }
  }, [activeSubTool]);

  const handleMediaSwitch = (media) => {
    setActiveMedia(media);
    if (onSubToolChange) {
      onSubToolChange(media);
    }
  };

  // 4x4 Multi-Cell Matrix Areas (m²)
  const [garnetCells, setGarnetCells] = useState({
    g00: '', g01: '', g02: '', g03: '',
    g11: '', g12: '', g13: '',
    g22: '', g23: '',
    g32: '', g33: ''
  });

  const [slagCells, setSlagCells] = useState({
    cs00: '', cs01: '', cs02: '', cs03: '',
    cs11: '', cs12: '', cs13: '',
    cs22: '', cs23: '',
    cs32: '', cs33: ''
  });

  // Rates in kg/m² @ 7 kg/cm² pressure (Venturi Nozzle)
  const garnetRates = {
    g00: 4.5, g01: 8.0, g02: 11.5, g03: 15.0,
    g11: 10.5, g12: 14.5, g13: 19.0,
    g22: 19.5, g23: 25.0,
    g32: 25.0, g33: 32.0
  };

  const slagRates = {
    cs00: 9.0, cs01: 16.0, cs02: 23.0, cs03: 30.0,
    cs11: 21.0, cs12: 29.0, cs13: 38.0,
    cs22: 39.0, cs23: 50.0,
    cs32: 50.0, cs33: 64.0
  };

  const currentCells = activeMedia === 'garnet' ? garnetCells : slagCells;
  const currentRates = activeMedia === 'garnet' ? garnetRates : slagRates;

  const handleCellChange = (id, val) => {
    if (activeMedia === 'garnet') {
      setGarnetCells(prev => ({ ...prev, [id]: val }));
    } else {
      setSlagCells(prev => ({ ...prev, [id]: val }));
    }
  };

  const handleCalculate = () => {
    const hasValue = Object.values(currentCells).some(v => parseFloat(v) > 0);
    if (!hasValue) {
      addToast('Missing Matrix Inputs', 'Please enter blasted area (m²) in at least one matrix cell.', 'warning');
      return;
    }
    addToast('Calculated Abrasive Demand', 'Total abrasive tonnage and rates calculated.', 'success');
  };

  const handleReset = () => {
    if (activeMedia === 'garnet') {
      setGarnetCells({
        g00: '', g01: '', g02: '', g03: '',
        g11: '', g12: '', g13: '',
        g22: '', g23: '',
        g32: '', g33: ''
      });
    } else {
      setSlagCells({
        cs00: '', cs01: '', cs02: '', cs03: '',
        cs11: '', cs12: '', cs13: '',
        cs22: '', cs23: '',
        cs32: '', cs33: ''
      });
    }
    addToast('Form Reset', 'Matrix cells cleared.', 'info');
  };

  // Compute breakdown and totals
  let totalArea = 0;
  let totalKg = 0;
  const breakdowns = [];

  const cellLabels = {
    g00: 'Zero Scale · Sweep (Sa 1)',
    g01: 'Zero Scale · Commercial (Sa 2.0)',
    g02: 'Zero Scale · Sa 2.5 Near-White',
    g03: 'Zero Scale · Sa 3.0 White Metal',
    g11: 'Light Rust/Pits · Commercial (Sa 2.0)',
    g12: 'Light Rust/Pits · Sa 2.5 Near-White',
    g13: 'Light Rust/Pits · Sa 3.0 White Metal',
    g22: 'Heavy Rust/Mill Scale · Sa 2.5',
    g23: 'Heavy Rust/Mill Scale · Sa 3.0',
    g32: 'Pitted/Severe Scale · Sa 2.5',
    g33: 'Pitted/Severe Scale · Sa 3.0',

    cs00: 'Zero Scale · Sweep (Sa 1)',
    cs01: 'Zero Scale · Commercial (Sa 2.0)',
    cs02: 'Zero Scale · Sa 2.5 Near-White',
    cs03: 'Zero Scale · Sa 3.0 White Metal',
    cs11: 'Light Rust/Pits · Commercial (Sa 2.0)',
    cs12: 'Light Rust/Pits · Sa 2.5 Near-White',
    cs13: 'Light Rust/Pits · Sa 3.0 White Metal',
    cs22: 'Heavy Rust/Mill Scale · Sa 2.5',
    cs23: 'Heavy Rust/Mill Scale · Sa 3.0',
    cs32: 'Pitted/Severe Scale · Sa 2.5',
    cs33: 'Pitted/Severe Scale · Sa 3.0'
  };

  Object.entries(currentCells).forEach(([id, val]) => {
    const areaVal = parseFloat(val) || 0;
    if (areaVal > 0) {
      const rate = currentRates[id] || 0;
      const kg = areaVal * rate;
      totalArea += areaVal;
      totalKg += kg;
      breakdowns.push({
        id,
        label: cellLabels[id] || id,
        area: areaVal,
        rate,
        kg
      });
    }
  });

  const totalMt = totalKg / 1000;
  const avgRate = totalArea > 0 ? totalKg / totalArea : 0;

  const handleCopy = () => {
    const text = `BG CoatingOS™ — ${activeMedia === 'garnet' ? 'Garnet' : 'Copper Slag'} Abrasive Consumption
Total Surface Area: ${formatNum(totalArea, 1)} m²
Total Abrasive Required: ${formatNum(totalKg, 0)} kg (${formatNum(totalMt, 2)} MT)
Average Blasting Rate: ${formatNum(avgRate, 1)} kg/m²`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to Clipboard', 'Abrasive calculation report copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tool Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              {activeMedia === 'garnet' ? 'Tool A-1 · Garnet' : 'Tool A-2 · Copper Slag'}
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              {activeMedia === 'garnet' ? 'Garnet Abrasive Consumption' : 'Copper Slag Abrasive Consumption'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            4x4 Steel Initial Rust Condition (Grade A/B/C/D) vs. Cleanliness Standard (Sa 1 / Sa 2 / Sa 2.5 / Sa 3) Matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGuideline('abrasive_media')}
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

      {/* Media Switcher Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl max-w-md">
        <button
          onClick={() => handleMediaSwitch('garnet')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeMedia === 'garnet'
              ? 'bg-white text-[#D97706] shadow-xs border border-amber-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Gem className="w-3.5 h-3.5" />
          <span>Garnet Sand (80 Mesh / 30-60)</span>
        </button>

        <button
          onClick={() => handleMediaSwitch('copper_slag')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeMedia === 'copper_slag'
              ? 'bg-white text-[#9E1B1E] shadow-xs border border-red-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Copper Slag (Expendable)</span>
        </button>
      </div>

      {/* 4x4 Blast Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Matrix Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Blasting Area Matrix (m²)
              </h2>
              <p className="text-[11px] text-slate-400">
                Enter surface area (m²) into the matching Steel Condition &amp; Cleanliness standard.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Matrix</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-600">
                  <th className="p-2.5 font-bold">Initial Steel Condition (ISO 8501-1)</th>
                  <th className="p-2.5 text-center">Sa 1 (Sweep)</th>
                  <th className="p-2.5 text-center">Sa 2.0 (Commercial)</th>
                  <th className="p-2.5 text-center text-[#D97706]">Sa 2.5 (Near-White)</th>
                  <th className="p-2.5 text-center text-[#9E1B1E]">Sa 3.0 (White Metal)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Grade A: Zero Scale */}
                <tr>
                  <td className="p-2.5 font-medium text-slate-800">
                    <span className="font-bold block">Grade A</span>
                    <span className="text-[10px] text-slate-400">Zero scale, intact mill scale</span>
                  </td>
                  {['00', '01', '02', '03'].map(col => {
                    const key = activeMedia === 'garnet' ? `g${col}` : `cs${col}`;
                    return (
                      <td key={col} className="p-2 text-center">
                        <div className="relative inline-block w-20 sm:w-24">
                          <input
                            type="number"
                            placeholder="m²"
                            value={currentCells[key]}
                            onChange={e => handleCellChange(key, e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                          />
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                            {currentRates[key]} kg/m²
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Grade B: Light Rust */}
                <tr>
                  <td className="p-2.5 font-medium text-slate-800">
                    <span className="font-bold block">Grade B</span>
                    <span className="text-[10px] text-slate-400">Light rust &amp; flaking scale</span>
                  </td>
                  <td className="p-2 text-center text-slate-300 font-mono text-[10px]">—</td>
                  {['11', '12', '13'].map(col => {
                    const key = activeMedia === 'garnet' ? `g${col}` : `cs${col}`;
                    return (
                      <td key={col} className="p-2 text-center">
                        <div className="relative inline-block w-20 sm:w-24">
                          <input
                            type="number"
                            placeholder="m²"
                            value={currentCells[key]}
                            onChange={e => handleCellChange(key, e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                          />
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                            {currentRates[key]} kg/m²
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Grade C: Heavy Rust */}
                <tr>
                  <td className="p-2.5 font-medium text-slate-800">
                    <span className="font-bold block">Grade C</span>
                    <span className="text-[10px] text-slate-400">Heavy mill scale &amp; rust</span>
                  </td>
                  <td className="p-2 text-center text-slate-300 font-mono text-[10px]">—</td>
                  <td className="p-2 text-center text-slate-300 font-mono text-[10px]">—</td>
                  {['22', '23'].map(col => {
                    const key = activeMedia === 'garnet' ? `g${col}` : `cs${col}`;
                    return (
                      <td key={col} className="p-2 text-center">
                        <div className="relative inline-block w-20 sm:w-24">
                          <input
                            type="number"
                            placeholder="m²"
                            value={currentCells[key]}
                            onChange={e => handleCellChange(key, e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                          />
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                            {currentRates[key]} kg/m²
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Grade D: Pitted Rust */}
                <tr>
                  <td className="p-2.5 font-medium text-slate-800">
                    <span className="font-bold block">Grade D</span>
                    <span className="text-[10px] text-slate-400">Severe pitting &amp; extensive rust</span>
                  </td>
                  <td className="p-2 text-center text-slate-300 font-mono text-[10px]">—</td>
                  <td className="p-2 text-center text-slate-300 font-mono text-[10px]">—</td>
                  {['32', '33'].map(col => {
                    const key = activeMedia === 'garnet' ? `g${col}` : `cs${col}`;
                    return (
                      <td key={col} className="p-2 text-center">
                        <div className="relative inline-block w-20 sm:w-24">
                          <input
                            type="number"
                            placeholder="m²"
                            value={currentCells[key]}
                            onChange={e => handleCellChange(key, e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
                          />
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                            {currentRates[key]} kg/m²
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>

          {/* Form Actions: Calculate & Reset */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculate Abrasive Demand</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Matrix</span>
            </button>
          </div>
        </div>

        {/* Output Metrics Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider">
                Total Abrasive Demand
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                {activeMedia === 'garnet' ? 'Garnet' : 'Copper Slag'}
              </span>
            </div>

            {/* Total Metric Highlight */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-xs text-slate-400 font-mono">Total Consumption (kg)</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 font-mono mt-1 text-[#D97706]">
                {formatNum(totalKg, 0)}
                <span className="text-sm text-slate-400 ml-1 font-normal">kg</span>
              </div>
              <div className="text-xs font-bold text-[#9E1B1E] font-mono mt-1">
                ≈ {formatNum(totalMt, 2)} Metric Tonnes
              </div>
            </div>

            {/* Key Summary Rows */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Surface Area</span>
                <span className="font-mono font-bold text-slate-800">{formatNum(totalArea, 1)} m²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Average Consumption Rate</span>
                <span className="font-mono font-bold text-slate-800">{formatNum(avgRate, 1)} kg/m²</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Recommended Operating P</span>
                <span className="font-mono font-bold text-slate-800">7.0 bar (100 psi)</span>
              </div>
            </div>

            {/* Breakdown List */}
            {breakdowns.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-amber-100">
                <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block">
                  Matrix Breakdown
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px]">
                  {breakdowns.map((b, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 text-slate-600">
                      <span className="truncate max-w-[150px]">{b.label}</span>
                      <span className="font-mono font-bold text-slate-900">{formatNum(b.kg, 0)} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
