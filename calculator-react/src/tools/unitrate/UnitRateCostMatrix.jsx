import React from 'react';
import { 
  Coins, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  Scale, 
  DollarSign,
  Layers
} from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRateCostMatrix({ 
  formData, 
  onUpdateField, 
  onRebuildRows, 
  onOpenPaintCalc, 
  onOpenAbrCalc, 
  onNavigateNext, 
  onNavigatePrev, 
  onReset,
  metrics = {}
}) {
  const estRows = formData.estRows || [];
  const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

  const handleUpdateRow = (index, field, value) => {
    const updated = [...estRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdateField('estRows', updated);
  };

  const handleAddCustomRow = (catIndex, catKey) => {
    const updated = [...estRows];
    const newRow = {
      type: 'row',
      desc: 'Custom Cost Item',
      rate: 0,
      area: metrics.totalArea || 0,
      src: 'custom',
      cat: catKey
    };
    // Insert before the subtotal of this category
    updated.splice(catIndex + 1, 0, newRow);
    onUpdateField('estRows', updated);
  };

  const handleRemoveRow = (index) => {
    const updated = estRows.filter((_, i) => i !== index);
    onUpdateField('estRows', updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">05. Unit-Rate Estimation Table &amp; Commercial Schedule</h2>
              <p className="text-xs text-slate-400">Itemized rate analysis across blasting, paint materials, abrasive media, labour, and commercial margins.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenPaintCalc}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition border border-purple-500/30"
            >
              <Scale className="w-3.5 h-3.5" />
              Paint Rate Helper
            </button>

            <button
              type="button"
              onClick={onOpenAbrCalc}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition border border-blue-500/30"
            >
              <Layers className="w-3.5 h-3.5" />
              Abrasive Rate Helper
            </button>

            <button
              type="button"
              onClick={onRebuildRows}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition border border-amber-500/30"
              title="Sync coating generics & surface area from Section F"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync from Section F
            </button>
          </div>
        </div>

        {/* Commercial Cost Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-700">
                <th className="py-2.5 px-3 w-12 text-center">Sr.</th>
                <th className="py-2.5 px-3 min-w-[280px]">Cost Component / Description</th>
                <th className="py-2.5 px-3 w-32 text-right">Unit Rate ({currencyObj.sym}/m²)</th>
                <th className="py-2.5 px-3 w-32 text-right">Area (m²)</th>
                <th className="py-2.5 px-3 w-36 text-right">Total Amount ({currencyObj.sym})</th>
                <th className="py-2.5 px-2 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {estRows.map((row, idx) => {
                // Category Header Row
                if (row.type === 'cat') {
                  return (
                    <tr key={idx} className="bg-slate-800/90 border-t-2 border-slate-700">
                      <td colSpan="6" className="py-2 px-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 uppercase tracking-wider text-xs">
                            {row.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddCustomRow(idx, row.cat || 'custom')}
                            className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3 h-3" />
                            Add Line Item
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Subtotal Row
                if (row.type === 'subtot') {
                  const subAmount = metrics.subtotals?.[row.cat] || row._sum || 0;
                  return (
                    <tr key={idx} className="bg-slate-950/60 font-bold border-b border-slate-700/80">
                      <td colSpan="4" className="py-2 px-3 text-right text-slate-300">
                        {row.label}:
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400 text-sm">
                        {currencyObj.sym} {subAmount.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-center"></td>
                    </tr>
                  );
                }

                // Markup Row (Overhead / Profit / Contingency)
                if (row.type === 'markup') {
                  const markupPct = parseFloat(row.pct) || 0;
                  const directSub = metrics.directCostTotal || 0;
                  const markupAmount = directSub * (markupPct / 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3 text-center font-mono text-slate-500">•</td>
                      <td className="py-2 px-3 text-slate-200">{row.label}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <input
                            type="number"
                            value={row.pct || ''}
                            onChange={(e) => handleUpdateRow(idx, 'pct', e.target.value)}
                            placeholder="10"
                            className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-right font-mono text-white focus:outline-none"
                          />
                          <span className="text-slate-400 font-bold">%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        Direct Cost Ref
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400 font-semibold">
                        {currencyObj.sym} {markupAmount.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-center"></td>
                    </tr>
                  );
                }

                // Grand Total Row
                if (row.type === 'grand') {
                  return (
                    <tr key={idx} className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border-t-2 border-amber-500 font-extrabold">
                      <td colSpan="4" className="py-3 px-3 text-right text-amber-300 text-sm uppercase tracking-wider">
                        {row.label}:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-white text-base font-bold">
                        {currencyObj.sym} {metrics.grandTotalFormatted || '0.00'}
                      </td>
                      <td className="py-3 px-2 text-center"></td>
                    </tr>
                  );
                }

                // Regular Item Row
                const rate = parseFloat(row.rate) || 0;
                const area = parseFloat(row.area) || 0;
                const total = rate * area;

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    
                    {/* Description */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.desc || ''}
                        onChange={(e) => handleUpdateRow(idx, 'desc', e.target.value)}
                        placeholder="Cost item description"
                        className="w-full px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </td>

                    {/* Unit Rate */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={row.rate !== undefined ? row.rate : ''}
                        onChange={(e) => handleUpdateRow(idx, 'rate', e.target.value)}
                        placeholder="0.00"
                        className="w-28 px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-right font-mono text-white focus:outline-none"
                      />
                    </td>

                    {/* Surface Area */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={row.area !== undefined ? row.area : ''}
                        onChange={(e) => handleUpdateRow(idx, 'area', e.target.value)}
                        placeholder="0"
                        className="w-28 px-2 py-1 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded text-xs text-right font-mono text-amber-400 focus:outline-none"
                      />
                    </td>

                    {/* Total Amount */}
                    <td className="py-2 px-3 text-right font-mono text-slate-200 font-semibold">
                      {currencyObj.sym} {total.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Delete Action (if not mandatory system row) */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Commercial Take-off KPI Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-center p-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Direct Costs</span>
            <span className="text-sm font-bold font-mono text-white">
              {currencyObj.sym} {metrics.directCostTotal?.toLocaleString(currencyObj.loc, { maximumFractionDigits: 0 }) || '0'}
            </span>
          </div>

          <div className="text-center p-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Markups &amp; Margins</span>
            <span className="text-sm font-bold font-mono text-amber-400">
              {currencyObj.sym} {metrics.markupsTotal?.toLocaleString(currencyObj.loc, { maximumFractionDigits: 0 }) || '0'}
            </span>
          </div>

          <div className="text-center p-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cost / m²</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {currencyObj.sym} {metrics.costPerM2Formatted || '0'}
            </span>
          </div>

          <div className="text-center p-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Value</span>
            <span className="text-sm font-bold font-mono text-white">
              {currencyObj.sym} {metrics.grandTotalFormatted || '0'}
            </span>
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
          <span>Back: Section F Coating Design</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Rates
          </button>

          <button
            onClick={onNavigateNext}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-95 transition"
          >
            <span>Next: Revision History</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
