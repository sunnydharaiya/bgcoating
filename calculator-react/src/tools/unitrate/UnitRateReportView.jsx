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
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Executive Financial Report &amp; Rate Analysis</h2>
              <p className="text-xs text-slate-400">
                {formData.projectName || 'Coating Project'} • {formData.customer || 'Client'} • Rev {formData.revisions?.[formData.revisions.length - 1]?.rev || '0'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPreview}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-600"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Preview Quotation
            </button>
            <button
              onClick={onOpenPrint}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Technical Dossier
            </button>
          </div>
        </div>

        {/* 4 Commercial Highlight Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Total Commercial Value</span>
            <span className="text-2xl font-extrabold font-mono text-white">
              {currencyObj.sym} {metrics.grandTotalFormatted || '0'}
            </span>
            <span className="text-[11px] text-slate-500 block">Gross project contract estimate</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Unit Rate per m²</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">
              {currencyObj.sym} {metrics.costPerM2Formatted || '0'}
            </span>
            <span className="text-[11px] text-slate-500 block">All-inclusive composite unit rate</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Total Surface Area</span>
            <span className="text-2xl font-extrabold font-mono text-amber-400">
              {totalArea.toFixed(1)} m²
            </span>
            <span className="text-[11px] text-slate-500 block">Across {formData.fRows?.length || 0} coating systems</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Material Cost Share</span>
            <span className="text-2xl font-extrabold font-mono text-purple-400">
              {getPct(paintCost + abrCost)}%
            </span>
            <span className="text-[11px] text-slate-500 block">Paint &amp; abrasive media share</span>
          </div>
        </div>

        {/* Cost Breakdown Progress Bars */}
        <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Commercial Cost Structure &amp; Share Distribution
          </h3>

          <div className="space-y-3">
            {components.map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${comp.color}`} />
                    <span className="text-slate-300 font-medium">{comp.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">
                      {currencyObj.sym} {comp.value.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-amber-400 font-bold w-12 text-right">{comp.pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
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
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Coating Systems Take-off Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono text-[10px] border-b border-slate-800">
                  <th className="py-2 px-3">System / Component</th>
                  <th className="py-2 px-3">Surface Prep</th>
                  <th className="py-2 px-3">Primer</th>
                  <th className="py-2 px-3">Intermediate</th>
                  <th className="py-2 px-3">Topcoat</th>
                  <th className="py-2 px-3 text-right">Area (m²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {(formData.fRows || []).map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-semibold text-white">{f.coatFor || '—'}</td>
                    <td className="py-2 px-3">{f.surfPrep || 'Sa 2½'}</td>
                    <td className="py-2 px-3">{f.primer || '—'} ({f.primerDft || 0}µm)</td>
                    <td className="py-2 px-3">{f.inter || 'NA'} {f.interDft && f.interDft !== 'NA' ? `(${f.interDft}µm)` : ''}</td>
                    <td className="py-2 px-3">{f.finish || 'NA'} {f.finishDft && f.finishDft !== 'NA' ? `(${f.finishDft}µm)` : ''}</td>
                    <td className="py-2 px-3 text-right font-mono text-amber-400">{parseFloat(f.area || 0).toFixed(1)}</td>
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
