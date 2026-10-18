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
    <div id="section-cost-matrix" className="space-y-6">
      {/* Header Card (Clean Light Theme matching media_1792173809775_e8eaea16.png) */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#E6E8EC] shadow-[0_2px_12px_rgba(20,24,32,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF5EA] text-[#D97706] border border-[#FDE3C7] shadow-2xs">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">05. Unit-Rate Estimation Table &amp; Commercial Schedule</h2>
              <p className="text-xs text-[#64748B]">Itemized rate analysis across blasting, paint materials, abrasive media, labour, and commercial margins.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenPaintCalc}
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition border border-purple-200 shadow-2xs cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              Paint Rate Helper
            </button>

            <button
              type="button"
              onClick={onOpenAbrCalc}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition border border-blue-200 shadow-2xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              Abrasive Rate Helper
            </button>

            <button
              type="button"
              onClick={onRebuildRows}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#D97706] text-xs font-semibold flex items-center gap-1.5 transition border border-[#FDE3C7] shadow-2xs cursor-pointer"
              title="Sync coating generics & surface area from Section F"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync from Section F
            </button>
          </div>
        </div>

        {/* Commercial Cost Table */}
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#475569] font-mono uppercase text-[10px] border-b border-[#E2E8F0]">
                <th className="py-2.5 px-3 w-12 text-center">Sr.</th>
                <th className="py-2.5 px-3 min-w-[280px]">Cost Component / Description</th>
                <th className="py-2.5 px-3 w-32 text-right">Unit Rate ({currencyObj.sym}/m²)</th>
                <th className="py-2.5 px-3 w-32 text-right">Area (m²)</th>
                <th className="py-2.5 px-3 w-36 text-right">Total Amount ({currencyObj.sym})</th>
                <th className="py-2.5 px-2 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {estRows.map((row, idx) => {
                // Category Header Row
                if (row.type === 'cat') {
                  const catAnchorMap = {
                    'blast': 'section-est-input',
                    'rawpaint': 'section-paint-cost',
                    'rawabr': 'section-est-progress',
                    'app': 'section-paint-cost',
                    'misc': 'section-misc-cost',
                    'markup': 'section-validate'
                  };
                  const rowAnchor = catAnchorMap[row.cat] || undefined;
                  return (
                    <tr key={idx} id={rowAnchor} className="bg-gradient-to-r from-[#FFF7ED] via-[#FFF1E0] to-[#FFEDD5] border-t-2 border-[#F97316] border-b border-[#FED7AA]">
                      <td colSpan="6" className="py-2 px-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#C2410C] uppercase tracking-wider text-xs">
                            {row.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddCustomRow(idx, row.cat || 'custom')}
                            className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-[#C2410C] border border-[#FDBA74] text-[10px] font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
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
                    <tr key={idx} className="bg-[#FFFBEB] font-bold border-b border-[#FDE68A]">
                      <td colSpan="4" className="py-2 px-3 text-right text-[#78350F]">
                        {row.label}:
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[#047857] text-sm">
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
                    <tr key={idx} className="hover:bg-[#FFFDF9] transition border-b border-[#F1F5F9]">
                      <td className="py-2 px-3 text-center font-mono text-slate-400">•</td>
                      <td className="py-2 px-3 text-[#334155] font-medium">{row.label}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <input
                            type="number"
                            value={row.pct || ''}
                            onChange={(e) => handleUpdateRow(idx, 'pct', e.target.value)}
                            placeholder="10"
                            className="w-20 px-2 py-1 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-right font-mono text-[#0F172A] focus:outline-none"
                          />
                          <span className="text-[#64748B] font-bold">%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400 font-mono">
                        Direct Cost Ref
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[#047857] font-semibold">
                        {currencyObj.sym} {markupAmount.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-center"></td>
                    </tr>
                  );
                }

                // Grand Total Row
                if (row.type === 'grand') {
                  return (
                    <tr key={idx} className="bg-gradient-to-r from-[#1B222C] to-[#2E3846] border-t-2 border-[#F97316] font-extrabold text-white">
                      <td colSpan="4" className="py-3 px-3 text-right text-[#FDBA74] text-sm uppercase tracking-wider">
                        {row.label}:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-white text-base md:text-lg font-bold">
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
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition border-b border-[#F1F5F9]">
                    <td className="py-2 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    
                    {/* Description */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.desc || ''}
                        onChange={(e) => handleUpdateRow(idx, 'desc', e.target.value)}
                        placeholder="Cost item description"
                        className="w-full px-2.5 py-1 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none"
                      />
                    </td>

                    {/* Unit Rate */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={row.rate !== undefined ? row.rate : ''}
                        onChange={(e) => handleUpdateRow(idx, 'rate', e.target.value)}
                        placeholder="0.00"
                        className="w-28 px-2 py-1 bg-white border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-right font-mono text-[#0F172A] focus:outline-none"
                      />
                    </td>

                    {/* Surface Area */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={row.area !== undefined ? row.area : ''}
                        onChange={(e) => handleUpdateRow(idx, 'area', e.target.value)}
                        placeholder="0"
                        className="w-28 px-2 py-1 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] rounded text-xs text-right font-mono text-[#D97706] font-semibold focus:outline-none"
                      />
                    </td>

                    {/* Total Amount */}
                    <td className="py-2 px-3 text-right font-mono text-[#0F172A] font-semibold">
                      {currencyObj.sym} {total.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Delete Action (if not mandatory system row) */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition cursor-pointer"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs">
          <div className="text-center p-2 bg-white rounded-lg border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Direct Costs</span>
            <span className="text-sm font-bold font-mono text-[#1E293B]">
              {currencyObj.sym} {metrics.directCostTotal?.toLocaleString(currencyObj.loc, { maximumFractionDigits: 0 }) || '0'}
            </span>
          </div>

          <div className="text-center p-2 bg-white rounded-lg border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Markups &amp; Margins</span>
            <span className="text-sm font-bold font-mono text-[#D97706]">
              {currencyObj.sym} {metrics.markupsTotal?.toLocaleString(currencyObj.loc, { maximumFractionDigits: 0 }) || '0'}
            </span>
          </div>

          <div className="text-center p-2 bg-[#FFF7ED] rounded-lg border border-[#FFEDD5]">
            <span className="text-[10px] text-[#C2410C] font-semibold uppercase block">Cost / m²</span>
            <span className="text-sm font-bold font-mono text-[#059669]">
              {currencyObj.sym} {metrics.costPerM2Formatted || '0'}
            </span>
          </div>

          <div className="text-center p-2 bg-[#ECFDF5] rounded-lg border border-[#A7F3D0]">
            <span className="text-[10px] text-[#065F46] font-semibold uppercase block">Total Value</span>
            <span className="text-sm font-bold font-mono text-[#065F46]">
              {currencyObj.sym} {metrics.grandTotalFormatted || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Action Bottom Toolbar */}
      {onNavigatePrev && onNavigateNext && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onNavigatePrev}
            className="px-4 py-2 rounded-lg bg-white hover:bg-[#F8FAFC] text-slate-700 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back: Section F Coating Design</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold flex items-center gap-2 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Rates
            </button>

            <button
              onClick={onNavigateNext}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#E8700A] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-105 transition cursor-pointer"
            >
              <span>Next: Revision History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
