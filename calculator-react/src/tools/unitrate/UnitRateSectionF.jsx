import React from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  DollarSign,
  Layers,
  Scale
} from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRateSectionF({ 
  formData, 
  onUpdateField, 
  onOpenPaintCalc,
  onNavigateNext, 
  onNavigatePrev, 
  onReset 
}) {
  const fRows = formData.fRows || [];
  const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

  const handleAddRow = () => {
    const newRow = {
      coatFor: '',
      surfPrep: 'ISO Sa 2½ (SSPC-SP10)',
      profile: '50-75 µm',
      primer: '',
      primerDft: '75',
      primerVs: 65,
      primerPrice: '',
      inter: 'NA',
      interDft: 'NA',
      interVs: 75,
      interPrice: '',
      finish: 'NA',
      finishDft: 'NA',
      finishVs: 60,
      finishPrice: '',
      area: ''
    };
    onUpdateField('fRows', [...fRows, newRow]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...fRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdateField('fRows', updated);
  };

  const handleRemoveRow = (index) => {
    const updated = fRows.filter((_, i) => i !== index);
    onUpdateField('fRows', updated.length ? updated : []);
  };

  // Roll-up summary
  let totalArea = 0;
  const paintQuantities = {};

  fRows.forEach(row => {
    const a = parseFloat(row.area) || 0;
    totalArea += a;

    // Primer roll-up
    if (row.primer && row.primer !== 'NA' && row.primer.trim()) {
      const name = row.primer.trim();
      const dft = parseFloat(row.primerDft) || 75;
      const vs = parseFloat(row.primerVs) || 65;
      const tc = vs > 0 && dft > 0 ? (vs * 10) / dft : 1;
      const ps = tc * (1 - (formData.lossFactor || 30) / 100);
      const ltrPerM2 = ps > 0 ? 1 / ps : 0;
      const totalLtr = ltrPerM2 * a;
      
      paintQuantities[name] = paintQuantities[name] || { area: 0, liters: 0 };
      paintQuantities[name].area += a;
      paintQuantities[name].liters += totalLtr;
    }

    // Inter roll-up
    if (row.inter && row.inter !== 'NA' && row.inter.trim()) {
      const name = row.inter.trim();
      const dft = parseFloat(row.interDft) || 125;
      const vs = parseFloat(row.interVs) || 75;
      const tc = vs > 0 && dft > 0 ? (vs * 10) / dft : 1;
      const ps = tc * (1 - (formData.lossFactor || 30) / 100);
      const ltrPerM2 = ps > 0 ? 1 / ps : 0;
      const totalLtr = ltrPerM2 * a;
      
      paintQuantities[name] = paintQuantities[name] || { area: 0, liters: 0 };
      paintQuantities[name].area += a;
      paintQuantities[name].liters += totalLtr;
    }

    // Finish roll-up
    if (row.finish && row.finish !== 'NA' && row.finish.trim()) {
      const name = row.finish.trim();
      const dft = parseFloat(row.finishDft) || 50;
      const vs = parseFloat(row.finishVs) || 60;
      const tc = vs > 0 && dft > 0 ? (vs * 10) / dft : 1;
      const ps = tc * (1 - (formData.lossFactor || 30) / 100);
      const ltrPerM2 = ps > 0 ? 1 / ps : 0;
      const totalLtr = ltrPerM2 * a;
      
      paintQuantities[name] = paintQuantities[name] || { area: 0, liters: 0 };
      paintQuantities[name].area += a;
      paintQuantities[name].liters += totalLtr;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">04. Section F — Coating System Design &amp; Paint Build</h2>
              <p className="text-xs text-slate-400">Configure multi-coat paint specifications (Primer, Intermediate, Finish), DFT (µm), and surface area (m²).</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPaintCalc}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition border border-purple-500/30"
            >
              <Scale className="w-3.5 h-3.5" />
              Spread Rate Helper
            </button>

            <button
              type="button"
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition border border-amber-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Coating System Row
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-700">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[150px]">Coating For</th>
                <th className="py-2.5 px-3 min-w-[120px]">Surf. Prep</th>
                <th className="py-2.5 px-3 w-24">Profile</th>
                <th className="py-2.5 px-3 min-w-[140px]">Primer Coat</th>
                <th className="py-2.5 px-2 w-16 text-center">DFT (µm)</th>
                <th className="py-2.5 px-3 min-w-[140px]">Intermediate Coat</th>
                <th className="py-2.5 px-2 w-16 text-center">DFT (µm)</th>
                <th className="py-2.5 px-3 min-w-[140px]">Finish Coat</th>
                <th className="py-2.5 px-2 w-16 text-center">DFT (µm)</th>
                <th className="py-2.5 px-3 w-24 text-right">Area (m²)</th>
                <th className="py-2.5 px-2 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fRows.length === 0 ? (
                <tr>
                  <td colSpan="12" className="py-8 text-center text-slate-500 italic text-xs">
                    No coating systems configured. Add Section D components with Painting=YES and click <strong className="text-blue-400">Sync to Section F</strong> or <strong className="text-amber-400">+ Add Coating System Row</strong>.
                  </td>
                </tr>
              ) : (
                fRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-mono text-slate-500 text-center">{idx + 1}</td>
                    
                    {/* Coating For */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.coatFor || ''}
                        onChange={(e) => handleUpdateRow(idx, 'coatFor', e.target.value)}
                        placeholder="e.g. Shell of External"
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Surface Prep */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.surfPrep || ''}
                        onChange={(e) => handleUpdateRow(idx, 'surfPrep', e.target.value)}
                        placeholder="ISO Sa 2½"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Profile */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.profile || ''}
                        onChange={(e) => handleUpdateRow(idx, 'profile', e.target.value)}
                        placeholder="50-75 µm"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Primer */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.primer || ''}
                        onChange={(e) => handleUpdateRow(idx, 'primer', e.target.value)}
                        placeholder="e.g. Zinc Rich Epoxy"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        value={row.primerDft || ''}
                        onChange={(e) => handleUpdateRow(idx, 'primerDft', e.target.value)}
                        placeholder="75"
                        className="w-full px-1 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-center font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Intermediate */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.inter || ''}
                        onChange={(e) => handleUpdateRow(idx, 'inter', e.target.value)}
                        placeholder="e.g. Epoxy High Build MIO / NA"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="text"
                        value={row.interDft || ''}
                        onChange={(e) => handleUpdateRow(idx, 'interDft', e.target.value)}
                        placeholder="125"
                        className="w-full px-1 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-center font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Finish */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.finish || ''}
                        onChange={(e) => handleUpdateRow(idx, 'finish', e.target.value)}
                        placeholder="e.g. Aliphatic Polyurethane / NA"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="text"
                        value={row.finishDft || ''}
                        onChange={(e) => handleUpdateRow(idx, 'finishDft', e.target.value)}
                        placeholder="50"
                        className="w-full px-1 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-center font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Area */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={row.area || ''}
                        onChange={(e) => handleUpdateRow(idx, 'area', e.target.value)}
                        placeholder="1000"
                        className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-right font-mono text-amber-400 placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Delete */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded transition"
                        title="Remove Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Live Area & Material Roll-up Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Total Surface Area Take-off
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-amber-400">{totalArea.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-semibold">m² Total Substrate Area</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Estimated Paint Generic Quantities (Est. Litres)
            </h4>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {Object.keys(paintQuantities).length === 0 ? (
                <span className="text-xs text-slate-500 italic">No paint coats defined</span>
              ) : (
                Object.entries(paintQuantities).map(([pName, data]) => (
                  <div key={pName} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 truncate max-w-[200px]">{pName}:</span>
                    <span className="text-emerald-400 font-bold">{data.liters.toFixed(1)} L ({data.area.toFixed(0)} m²)</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dual Action Bottom Toolbar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onNavigatePrev}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Section D Temp Data</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Section F
          </button>

          <button
            onClick={onNavigateNext}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-95 transition"
          >
            <span>Next: Unit-Rate Table</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
