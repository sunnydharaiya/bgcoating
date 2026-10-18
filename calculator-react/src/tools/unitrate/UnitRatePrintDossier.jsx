import React from 'react';
import { Printer, ArrowLeft, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CURRENCY_CONFIG } from '../../data/unitRateDatabase';

export default function UnitRatePrintDossier({ 
  formData, 
  metrics = {}, 
  companyInfo = {}, 
  watermark = {}, 
  onBack 
}) {
  const currencyObj = CURRENCY_CONFIG[formData.currency] || CURRENCY_CONFIG.INR;

  const handlePrint = () => {
    window.print();
  };

  const estRows = formData.estRows || [];
  const revisions = formData.revisions || [];
  const latestRev = revisions[revisions.length - 1] || { rev: '0', date: '' };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-[#E6E8EC] flex items-center justify-between shadow-2xs">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Estimation Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            A4 EPC Client Quotation Sheet • {formData.estNo || 'Draft'}
          </span>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Commercial Quotation</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="relative mx-auto bg-white text-slate-900 shadow-2xl p-8 sm:p-12 max-w-4xl rounded-lg font-sans border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Dynamic Watermark Layer */}
        {watermark?.enabled && (
          <div 
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0 select-none print:block"
            style={{ opacity: watermark.opacity || 0.08 }}
          >
            <span 
              className="text-7xl md:text-8xl font-extrabold uppercase text-slate-900 tracking-widest whitespace-nowrap"
              style={{ transform: `rotate(${watermark.rotation || -30}deg)` }}
            >
              {watermark.text || 'CONFIDENTIAL COMMERCIAL QUOTATION'}
            </span>
          </div>
        )}

        <div className="relative z-10 space-y-6 text-[13px] leading-relaxed">
          
          {/* Header & Company Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  {companyInfo.companyName || 'BG COATING & CORROSION ENGINEERING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {companyInfo.address || 'Industrial Zone, Marine & Offshore Division'}
              </p>
              <p className="text-[11px] text-slate-500">
                Email: {companyInfo.email || 'commercial@bgcoating.com'} • Tel: {companyInfo.phone || '+91 22 8899 0011'}
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 font-bold font-mono text-xs rounded border border-amber-300 uppercase">
                Commercial Unit-Rate Quotation
              </span>
              <div className="text-xs font-mono font-bold text-slate-900 pt-1">
                Ref: {formData.estNo || 'EST-2026-001'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Rev: {latestRev.rev} • Date: {formData.date || new Date().toISOString().slice(0, 10)}
              </div>
            </div>
          </div>

          {/* Project Summary Box */}
          <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-300 rounded">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Client / Customer</span>
              <span className="font-bold text-slate-900 text-sm">{formData.customer || '—'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Project Title</span>
              <span className="font-bold text-slate-900 text-sm">{formData.projectName || '—'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Project Location</span>
              <span className="text-slate-700">{formData.location || '—'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Estimator / Contact</span>
              <span className="text-slate-700">{formData.estimator || '—'}</span>
            </div>
          </div>

          {/* Section 1: Scope of Work Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              1. Project Scope &amp; Battery Limits
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Surface Prep &amp; Painting:</span>
                <span className="font-bold">{formData.scope?.surfPaint || 'YES'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Thermal Insulation:</span>
                <span className="font-bold">{formData.scope?.insulation || 'NA'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Passive Fireproofing:</span>
                <span className="font-bold">{formData.scope?.fireproof || 'NA'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Special Treatment (TSA):</span>
                <span className="font-bold">{formData.scope?.special || 'NA'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Hot Dip Galvanizing:</span>
                <span className="font-bold">{formData.scope?.galv || 'NA'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Pickling &amp; Passivation:</span>
                <span className="font-bold">{formData.scope?.pickling || 'NA'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Coating System Specifications (Section F) */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              2. Coating System Build &amp; Surface Area Schedule
            </h3>
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300 text-[11px]">
                  <th className="py-1.5 px-2 border-r border-slate-300">#</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Coating For</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Surf. Prep</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Primer Coat</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Inter. Coat</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Finish Coat</th>
                  <th className="py-1.5 px-2 text-right">Area (m²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(formData.fRows || []).map((f, idx) => (
                  <tr key={idx}>
                    <td className="py-1 px-2 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                    <td className="py-1 px-2 border-r border-slate-300 font-medium">{f.coatFor}</td>
                    <td className="py-1 px-2 border-r border-slate-300">{f.surfPrep}</td>
                    <td className="py-1 px-2 border-r border-slate-300">{f.primer} ({f.primerDft}µm)</td>
                    <td className="py-1 px-2 border-r border-slate-300">{f.inter} {f.interDft !== 'NA' ? `(${f.interDft}µm)` : ''}</td>
                    <td className="py-1 px-2 border-r border-slate-300">{f.finish} {f.finishDft !== 'NA' ? `(${f.finishDft}µm)` : ''}</td>
                    <td className="py-1 px-2 text-right font-mono font-bold">{parseFloat(f.area || 0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Commercial Unit-Rate Breakdown Schedule */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              3. Commercial Unit-Rate &amp; Price Breakdown ({currencyObj.name})
            </h3>
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300 text-[11px]">
                  <th className="py-1.5 px-2 w-10 text-center border-r border-slate-300">Sr.</th>
                  <th className="py-1.5 px-2 border-r border-slate-300">Cost Item Description</th>
                  <th className="py-1.5 px-2 w-28 text-right border-r border-slate-300">Unit Rate ({currencyObj.sym}/m²)</th>
                  <th className="py-1.5 px-2 w-24 text-right border-r border-slate-300">Area (m²)</th>
                  <th className="py-1.5 px-2 w-32 text-right">Total ({currencyObj.sym})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {estRows.map((row, idx) => {
                  if (row.type === 'cat') {
                    return (
                      <tr key={idx} className="bg-slate-100 font-bold">
                        <td colSpan="5" className="py-1 px-2 text-slate-900 uppercase text-[11px]">
                          {row.label}
                        </td>
                      </tr>
                    );
                  }

                  if (row.type === 'subtot') {
                    const subAmount = metrics.subtotals?.[row.cat] || row._sum || 0;
                    return (
                      <tr key={idx} className="bg-slate-50 font-bold">
                        <td colSpan="4" className="py-1 px-2 text-right border-r border-slate-300">
                          {row.label}:
                        </td>
                        <td className="py-1 px-2 text-right font-mono">
                          {currencyObj.sym} {subAmount.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  }

                  if (row.type === 'markup') {
                    const markupPct = parseFloat(row.pct) || 0;
                    const directSub = metrics.directCostTotal || 0;
                    const markupAmount = directSub * (markupPct / 100);
                    return (
                      <tr key={idx}>
                        <td className="py-1 px-2 text-center border-r border-slate-300 font-mono">•</td>
                        <td className="py-1 px-2 border-r border-slate-300">{row.label}</td>
                        <td className="py-1 px-2 text-right border-r border-slate-300 font-mono">{markupPct}%</td>
                        <td className="py-1 px-2 text-right border-r border-slate-300 font-mono">Direct Ref</td>
                        <td className="py-1 px-2 text-right font-mono font-semibold">
                          {currencyObj.sym} {markupAmount.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  }

                  if (row.type === 'grand') {
                    return (
                      <tr key={idx} className="bg-slate-900 text-white font-extrabold text-xs">
                        <td colSpan="4" className="py-2 px-2 text-right uppercase tracking-wider">
                          {row.label}:
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-sm">
                          {currencyObj.sym} {metrics.grandTotalFormatted || '0.00'}
                        </td>
                      </tr>
                    );
                  }

                  const rate = parseFloat(row.rate) || 0;
                  const area = parseFloat(row.area) || 0;
                  const total = rate * area;

                  return (
                    <tr key={idx}>
                      <td className="py-1 px-2 text-center font-mono border-r border-slate-300">{idx + 1}</td>
                      <td className="py-1 px-2 border-r border-slate-300">{row.desc}</td>
                      <td className="py-1 px-2 text-right font-mono border-r border-slate-300">{rate.toFixed(2)}</td>
                      <td className="py-1 px-2 text-right font-mono border-r border-slate-300">{area.toFixed(1)}</td>
                      <td className="py-1 px-2 text-right font-mono">
                        {currencyObj.sym} {total.toLocaleString(currencyObj.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Unit Rate Commercial Summary Box */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-900 block uppercase">Composite All-Inclusive Unit Rate</span>
              <span className="text-xl font-extrabold font-mono text-slate-900">
                {currencyObj.sym} {metrics.costPerM2Formatted || '0'} / m²
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-amber-900 block uppercase">Total Contract Value</span>
              <span className="text-xl font-extrabold font-mono text-slate-900">
                {currencyObj.sym} {metrics.grandTotalFormatted || '0'}
              </span>
            </div>
          </div>

          {/* Sign-off Signature Blocks */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-8">
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Prepared By</span>
              <div className="border-b border-slate-400 pb-1">
                <span className="font-semibold">{formData.estimator || 'Estimation Engineer'}</span>
              </div>
            </div>

            <div className="space-y-8">
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Checked &amp; Verified</span>
              <div className="border-b border-slate-400 pb-1">
                <span className="font-semibold">{formData.checkedBy || 'Commercial Manager'}</span>
              </div>
            </div>

            <div className="space-y-8">
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Client Acceptance</span>
              <div className="border-b border-slate-400 pb-1">
                <span className="font-semibold">{formData.customer || 'Authorised Signatory'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
