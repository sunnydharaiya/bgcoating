import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  DollarSign, 
  Layers, 
  FileText, 
  Printer, 
  Eye, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRateReportView({ 
  formData, 
  metrics = {}, 
  onOpenPreview, 
  onOpenPrint, 
  onNavigateSubTool 
}) {
  const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

  const totalArea = metrics.totalArea || 0;
  const grandTotal = metrics.grandTotal || 0;
  const directCost = metrics.directCostTotal || 0;
  const markups = metrics.markupsTotal || 0;

  // Breakdown percentages
  const blastCost = metrics.subtotals?.blast || 0;
  const paintCost = metrics.subtotals?.rawpaint || 0;
  const abrCost = metrics.subtotals?.rawabr || 0;
  const appCost = metrics.subtotals?.app || 0;
  const miscCost = metrics.subtotals?.misc || 0;

  const getPct = (val) => (grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0.0');

  const components = [
    { label: 'Blasting & Surface Prep', value: blastCost, pct: getPct(blastCost), color: 'bg-amber-500', barColor: '#F59E0B' },
    { label: 'Raw Material Paint', value: paintCost, pct: getPct(paintCost), color: 'bg-purple-500', barColor: '#A855F7' },
    { label: 'Raw Material Abrasives', value: abrCost, pct: getPct(abrCost), color: 'bg-blue-500', barColor: '#3B82F6' },
    { label: 'Paint Application & Labour', value: appCost, pct: getPct(appCost), color: 'bg-emerald-500', barColor: '#10B981' },
    { label: 'Equipment & Consumables', value: miscCost, pct: getPct(miscCost), color: 'bg-rose-500', barColor: '#F43F5E' },
    { label: 'Commercial Markups & Margin', value: markups, pct: getPct(markups), color: 'bg-indigo-500', barColor: '#6366F1' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6E8EC] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Executive Financial Report &amp; Rate Analysis</h2>
              <p className="text-xs text-slate-500">
                {formData.projectName || 'Coating Project'} • {formData.customer || 'Client'} • Rev {formData.revisions?.[formData.revisions.length - 1]?.rev || '0'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPreview}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-orange-500" />
              Preview Quotation
            </button>
            <button
              onClick={onOpenPrint}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Technical Dossier
            </button>
          </div>
        </div>

        {/* 4 Commercial Highlight Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-500 block">Total Commercial Value</span>
            <span className="text-2xl font-extrabold font-mono text-slate-900">
              {currencyObj.sym} {metrics.grandTotalFormatted || '0'}
            </span>
            <span className="text-[11px] text-slate-400 block">Gross project contract estimate</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-500 block">Unit Rate per m²</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-600">
              {currencyObj.sym} {metrics.costPerM2Formatted || '0'}
            </span>
            <span className="text-[11px] text-slate-400 block">All-inclusive composite unit rate</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-500 block">Total Surface Area</span>
            <span className="text-2xl font-extrabold font-mono text-orange-600">
              {totalArea.toFixed(1)} m²
            </span>
            <span className="text-[11px] text-slate-400 block">Across {formData.fRows?.length || 0} coating systems</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-500 block">Material Cost Share</span>
            <span className="text-2xl font-extrabold font-mono text-indigo-600">
              {getPct(paintCost + abrCost)}%
            </span>
            <span className="text-[11px] text-slate-400 block">Paint &amp; abrasive media share</span>
          </div>
        </div>

        {/* Cost Breakdown Progress Bars */}
        <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Commercial Cost Structure &amp; Share Distribution
          </h3>

          <div className="space-y-3">
            {components.map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${comp.color}`} />
                    <span className="text-slate-700 font-medium">{comp.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500">
                      {currencyObj.sym} {comp.value.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-orange-600 font-bold w-12 text-right">{comp.pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${comp.color} transition-all duration-500`}
                    style={{ width: `${comp.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coating Systems Schedule Summary Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Coating Systems Take-off Summary
          </h3>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-slate-500 font-bold text-[10px] uppercase border-b border-[#E2E8F0]">
                  <th className="py-2.5 px-3">System / Component</th>
                  <th className="py-2.5 px-3">Surface Prep</th>
                  <th className="py-2.5 px-3">Primer</th>
                  <th className="py-2.5 px-3">Intermediate</th>
                  <th className="py-2.5 px-3">Topcoat</th>
                  <th className="py-2.5 px-3 text-right">Area (m²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-slate-600 bg-white">
                {(formData.fRows || []).map((f, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{f.coatFor || '—'}</td>
                    <td className="py-2.5 px-3">{f.surfPrep || 'Sa 2½'}</td>
                    <td className="py-2.5 px-3">{f.primer || '—'} ({f.primerDft || 0}µm)</td>
                    <td className="py-2.5 px-3">{f.inter || 'NA'} {f.interDft && f.interDft !== 'NA' ? `(${f.interDft}µm)` : ''}</td>
                    <td className="py-2.5 px-3">{f.finish || 'NA'} {f.finishDft && f.finishDft !== 'NA' ? `(${f.finishDft}µm)` : ''}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-orange-600 font-semibold">{parseFloat(f.area || 0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
