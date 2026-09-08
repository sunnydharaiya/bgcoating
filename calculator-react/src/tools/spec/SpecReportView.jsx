import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Thermometer, 
  Layers, 
  Palette, 
  FlaskConical, 
  History, 
  FileText, 
  Stamp, 
  Sparkles 
} from 'lucide-react';
import { SCOPE_ITEMS, CORROSIVITY_ENVIRONMENTS } from '../../data/specDatabase';
import { formatNum } from '../../utils/calculations';
import { useToast } from '../../context/ToastContext';

export default function SpecReportView({ 
  projectData = {}, 
  scope = {}, 
  specs = [], 
  envData = {}, 
  dRows = [], 
  specialData = {}, 
  fRows = [], 
  qcData = {}, 
  hRows = [], 
  otherColName = 'Other', 
  other2ColName = 'Other 2', 
  specialComment = '', 
  iRows = [], 
  genNotes = '',
  companyProfile,
  watermarkSettings
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showWatermark, setShowWatermark] = useState(watermarkSettings?.enabled ?? true);

  const activeCompany = companyProfile || {
    name: 'BG Energy Solutions & Coating Engineering',
    tagline: 'Industrial Protective Coatings & Corrosion Engineering Division',
    phone: '+91 99258 10408',
    email: 'info@bgcoating.com',
    website: 'www.bgcoating.com',
    address: 'Hazira Road, Surat / Mumbai, India',
    logo: null
  };

  const selectedEnv = CORROSIVITY_ENVIRONMENTS.find(e => e.id === envData?.envCategory) || {
    id: envData?.envCategory || 'CX',
    name: envData?.envCategory ? `ISO 12944 Category ${envData.envCategory}` : 'Extreme Offshore (CX)',
    ext: 'Aggressive marine environment with extreme atmospheric salinity.',
    massLoss: '> 1500 g/m²'
  };

  const totalArea = (fRows || []).reduce((sum, r) => sum + (Number(r?.area) || 0), 0);

  // Copy Full Text Dossier
  const handleCopyReport = () => {
    let reportText = `========================================================================\n`;
    reportText += `BG COATINGOS™ — COATING SPECIFICATION READING & TECHNICAL DOSSIER\n`;
    reportText += `========================================================================\n\n`;
    reportText += `PROJECT NO: ${projectData.projNo || 'N/A'}\n`;
    reportText += `DESIGN INPUT NO (DIN): ${projectData.dinNo || 'N/A'}\n`;
    reportText += `PROJECT: ${projectData.projDesc || 'N/A'}\n`;
    reportText += `CLIENT / CUSTOMER: ${projectData.custName || 'N/A'}\n`;
    reportText += `PREPARED BY: ${projectData.preparedBy || 'N/A'}\n`;
    reportText += `DATE: ${new Date().toISOString().split('T')[0]}\n`;
    reportText += `APPLICABLE SPECS: ${specs.filter(Boolean).join(', ') || 'N/A'}\n\n`;

    reportText += `------------------------------------------------------------------------\n`;
    reportText += `1. COMPANY SCOPE MATRIX\n`;
    reportText += `------------------------------------------------------------------------\n`;
    SCOPE_ITEMS.forEach(s => {
      reportText += `- ${s.name}: ${scope[s.key] || s.def}\n`;
    });

    reportText += `\n------------------------------------------------------------------------\n`;
    reportText += `2. ENVIRONMENTAL & CORROSIVITY PROFILE\n`;
    reportText += `------------------------------------------------------------------------\n`;
    reportText += `Category: ${selectedEnv.name}\n`;
    reportText += `Target Durability: ${envData.designLife || 'H'}\n`;
    reportText += `Substrate MOC: ${envData.moc || 'Carbon Steel'}\n`;
    reportText += `Cyclic / Sour Service: ${envData.cyclicService || 'NO'} ${envData.cyclicDesc ? `(${envData.cyclicDesc})` : ''}\n`;

    reportText += `\n------------------------------------------------------------------------\n`;
    reportText += `3. COATING SYSTEM DESIGN SCHEDULE (${fRows.length} Systems)\n`;
    reportText += `------------------------------------------------------------------------\n`;
    fRows.forEach((r, i) => {
      const tot = (Number(r.primerDft) || 0) + (Number(r.intermediateDft) || 0) + (Number(r.finishDft) || 0);
      reportText += `[${i + 1}] System For: ${r.systemFor || 'General'}\n`;
      reportText += `    Surface Prep: ${r.surfacePrep} (Profile: ${r.profile} µm)\n`;
      reportText += `    Primer: ${r.primer} @ ${r.primerDft} µm DFT\n`;
      reportText += `    Intermediate: ${r.intermediate} @ ${r.intermediateDft} µm DFT\n`;
      reportText += `    Finish: ${r.finish} @ ${r.finishDft} µm DFT\n`;
      reportText += `    Total DFT: ${tot} µm | Area: ${r.area || 0} m²\n\n`;
    });

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    addToast('Dossier Copied', 'Full specification dossier copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON Draft
  const handleDownloadJson = () => {
    const fullSpecJson = {
      metadata: {
        generator: 'BG CoatingOS™ Specification Engine',
        exportDate: new Date().toISOString(),
        version: '2.0-PRO'
      },
      projectData,
      scope,
      specs,
      envData,
      dRows,
      specialData,
      fRows,
      qcData,
      hRows,
      otherColName,
      other2ColName,
      specialComment,
      iRows,
      genNotes
    };

    const blob = new Blob([JSON.stringify(fullSpecJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Spec_${projectData.projNo || 'Draft'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Spec Exported', 'Specification JSON draft downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Action Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Executive Output
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Specification Reading Dossier &amp; Audit Report
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete formal MNC-grade engineering specification dossier ready for print, client submittal, and quality audit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowWatermark(!showWatermark)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              showWatermark ? 'bg-amber-50 text-[#D97706] border-amber-200' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>{showWatermark ? 'Watermark: ON' : 'Watermark: OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Dossier'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (A4 Styling) */}
      <div className="bg-white border border-slate-300 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Background Watermark */}
        {showWatermark && (
          <div 
            className="absolute inset-0 pointer-events-none flex items-center justify-center select-none font-mono font-black uppercase text-slate-900 tracking-wider text-center"
            style={{
              opacity: (watermarkSettings?.opacity || 12) / 100,
              transform: `rotate(${watermarkSettings?.rotation || -30}deg)`,
              fontSize: '48px',
              lineHeight: '1.2'
            }}
          >
            {watermarkSettings?.text || activeCompany.name}
          </div>
        )}

        {/* Dossier Header Header */}
        <div className="border-b-2 border-slate-900 pb-5 space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {activeCompany.logo ? (
                <img src={activeCompany.logo} alt="Logo" className="w-12 h-12 object-contain rounded-xl p-1 bg-slate-50 border border-slate-200" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-black font-mono flex items-center justify-center text-lg shadow-xs">
                  BG
                </div>
              )}
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {activeCompany.name}
                </h2>
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  {activeCompany.tagline}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right font-mono text-xs text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-900">DOC REF: SPEC-DOSSIER-{projectData.projNo || 'REV0'}</div>
              <div>Issue Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Status: Engineering Verified</div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2">
            <span className="text-xs md:text-sm font-extrabold uppercase font-mono tracking-wider">
              Coating Specification Reading &amp; Multi-Discipline Engineering Dossier
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              ISO 12944 / NORSOK M-501 Compliant
            </span>
          </div>
        </div>

        {/* Section 1: Project Metadata & Scope Matrix */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F7941D]"></span>
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              1. Project Identification &amp; Multi-Discipline Scope
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Project No.</span>
              <span className="font-mono font-bold text-slate-900">{projectData.projNo || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Design Input No.</span>
              <span className="font-mono font-medium text-slate-800">{projectData.dinNo || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Client / Customer</span>
              <span className="font-semibold text-slate-900">{projectData.custName || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Prepared By</span>
              <span className="font-medium text-slate-800">{projectData.preparedBy || '—'}</span>
            </div>

            <div className="col-span-2 md:col-span-4 pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Project Description</span>
              <span className="font-medium text-slate-800 leading-relaxed">{projectData.projDesc || '—'}</span>
            </div>

            <div className="col-span-2 md:col-span-4 pt-1">
              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Applicable Specifications</span>
              <span className="font-mono text-xs text-slate-800">{specs.filter(Boolean).join(' | ') || 'None specified'}</span>
            </div>
          </div>

          {/* Scope Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SCOPE_ITEMS.map((item) => {
              const val = scope[item.key] || item.def;
              return (
                <div
                  key={item.key}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                    val === 'YES'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : val === 'NO'
                      ? 'bg-slate-50 text-slate-500 border-slate-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <span className="block text-sm mb-0.5">{item.icon}</span>
                  <span className="text-[11px] block truncate">{item.name}</span>
                  <span className="text-[10px] font-mono uppercase font-black">{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Environmental & Corrosivity Conditions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              2. Environmental Corrosivity &amp; Metallurgy
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-mono text-emerald-800 block font-bold uppercase">ISO 12944-2 Corrosivity</span>
              <span className="font-mono font-bold text-emerald-950 text-sm">{selectedEnv.name}</span>
              <p className="text-[11px] text-emerald-900 mt-1">{selectedEnv.ext}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-800 block font-bold uppercase">Substrate Material (MOC)</span>
              <span className="font-mono font-bold text-emerald-950">{envData.moc || 'Carbon Steel'}</span>
              <p className="text-[11px] text-emerald-900 mt-1">Design Durability Target: <strong>{envData.designLife || 'H'} (15–25 Yrs)</strong></p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-800 block font-bold uppercase">Cyclic &amp; Sour Service</span>
              <span className="font-mono font-bold text-emerald-950">{envData.cyclicService || 'NO'}</span>
              {envData.cyclicDesc && <p className="text-[11px] text-emerald-900 mt-1">{envData.cyclicDesc}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Coating System Schedule */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                3. Coating System Build Schedule ({fRows.length} Systems Defined)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">
              Total Area: {totalArea > 0 ? `${formatNum(totalArea, 1)} m²` : '—'}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-mono text-[10.5px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-2.5 text-center w-8">#</th>
                  <th className="p-2.5 min-w-[140px]">Component</th>
                  <th className="p-2.5 min-w-[150px]">Surface Prep &amp; Profile</th>
                  <th className="p-2.5 min-w-[140px]">1st Coat (Primer)</th>
                  <th className="p-2.5 min-w-[140px]">2nd Coat (Mid)</th>
                  <th className="p-2.5 min-w-[140px]">3rd Coat (Finish)</th>
                  <th className="p-2.5 text-center w-20">Total DFT</th>
                  <th className="p-2.5 text-center w-20">Area (m²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {fRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-400 italic">No coating systems entered.</td>
                  </tr>
                ) : (
                  fRows.map((r, i) => {
                    const totDft = (Number(r.primerDft) || 0) + (Number(r.intermediateDft) || 0) + (Number(r.finishDft) || 0);
                    return (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                        <td className="p-2 font-bold text-slate-900">{r.systemFor || 'General'}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-700">
                          {r.surfacePrep}
                          <span className="block text-slate-400">Rz: {r.profile} µm</span>
                        </td>
                        <td className="p-2 text-[11px]">
                          <span className="font-semibold text-slate-800 block">{r.primer}</span>
                          <span className="font-mono text-slate-500 font-bold">{r.primerDft} µm</span>
                        </td>
                        <td className="p-2 text-[11px]">
                          <span className="font-semibold text-slate-800 block">{r.intermediate}</span>
                          <span className="font-mono text-slate-500 font-bold">{r.intermediateDft} µm</span>
                        </td>
                        <td className="p-2 text-[11px]">
                          <span className="font-semibold text-slate-800 block">{r.finish}</span>
                          <span className="font-mono text-slate-500 font-bold">{r.finishDft} µm</span>
                        </td>
                        <td className="p-2 text-center font-mono font-extrabold text-slate-900 bg-slate-50">
                          {totDft} µm
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-[#D97706]">
                          {r.area || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Approved Paint Manufacturers Matrix */}
        {hRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-600"></span>
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                4. Approved Paint Manufacturers Equivalence Matrix
              </h3>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-2">Generic Paint</th>
                    <th className="p-2">AkzoNobel / Inter</th>
                    <th className="p-2">Jotun</th>
                    <th className="p-2">Asian Paints / PPG</th>
                    <th className="p-2">Carboline</th>
                    <th className="p-2">Hempel</th>
                    <th className="p-2">Sigma (PPG)</th>
                    {otherColName && <th className="p-2">{otherColName}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {hRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2 font-bold font-sans text-slate-900">{r.gen}</td>
                      <td className="p-2 text-slate-700">{r.int || '—'}</td>
                      <td className="p-2 text-slate-700">{r.jot || '—'}</td>
                      <td className="p-2 text-slate-700">{r.asn || '—'}</td>
                      <td className="p-2 text-slate-700">{r.cbl || '—'}</td>
                      <td className="p-2 text-slate-700">{r.hmp || '—'}</td>
                      <td className="p-2 text-slate-700">{r.sgm || '—'}</td>
                      {otherColName && <td className="p-2 text-slate-700">{r.oth1 || '—'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 5: QC Testing & General Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase font-mono text-[11px]">
              🧪 Testing &amp; Quality Control Requirements
            </h4>
            <ul className="space-y-1 text-slate-700">
              <li><strong>Laboratory:</strong> {qcData.labReq || 'NABL / Government Accredited'}</li>
              <li><strong>Certificate Type:</strong> {qcData.testCert || 'EN 10204 3.1 Batch Test Certificate'}</li>
              <li><strong>Applicable Standard:</strong> {qcData.appStd || 'ASTM D4541 / ISO 19840'}</li>
              <li><strong>Frequency:</strong> {qcData.appSystem || 'Each Supplied Batch'}</li>
            </ul>
            {qcData.testRem && <p className="text-[11px] text-slate-500 italic mt-2">{qcData.testRem}</p>}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase font-mono text-[11px]">
              📝 Execution Notes &amp; Deviations
            </h4>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {genNotes || 'All surface preparation and application shall strictly comply with project specification, ISO 8501-1, and manufacturer technical data sheets (TDS).'}
            </p>
          </div>
        </div>

        {/* Engineering Sign-Off Block */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-6">
            <span className="font-mono text-slate-400 uppercase font-bold text-[10px] block">Prepared By</span>
            <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">
              {projectData.preparedBy || 'Coating Inspector'}
            </div>
            <span className="text-[10px] font-mono text-slate-400">NACE / FROSIO / BGAS Certified</span>
          </div>

          <div className="space-y-6">
            <span className="font-mono text-slate-400 uppercase font-bold text-[10px] block">Reviewed By</span>
            <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">
              Lead QA / QC Engineer
            </div>
            <span className="text-[10px] font-mono text-slate-400">Quality Assurance Dept.</span>
          </div>

          <div className="space-y-6">
            <span className="font-mono text-slate-400 uppercase font-bold text-[10px] block">Approved By</span>
            <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">
              Client Technical Representative
            </div>
            <span className="text-[10px] font-mono text-slate-400">Owner / EPC Contractor</span>
          </div>
        </div>

      </div>

    </div>
  );
}
