import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Stamp, 
  Eye, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SCOPE_ITEMS } from '../../data/specDatabase';
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
  watermarkSettings,
  hideToolbar = false
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showWatermark, setShowWatermark] = useState(watermarkSettings?.enabled ?? true);

  // Synchronize watermark toggle when parent watermarkSettings.enabled updates
  useEffect(() => {
    if (watermarkSettings?.enabled !== undefined) {
      setShowWatermark(watermarkSettings.enabled);
    }
  }, [watermarkSettings?.enabled]);

  const activeCompany = companyProfile || {
    name: 'BG GROUP OF PAINT & COATING CONSULTANTS',
    address: 'B 304, Akash Indra Point, Bhestan, Surat - 395023, Gujarat, India',
    phone: '+91 98256 10408',
    website: 'bgcoating.com',
    tagline: 'Industrial Protective Coatings & Corrosion Engineering Division',
    logo: null
  };

  // Derive Company Scope YES and NO / NA lists
  const yesScopeList = SCOPE_ITEMS.filter(s => scope[s.key] === 'YES').map(s => s.name);
  const noNaScopeList = SCOPE_ITEMS.filter(s => scope[s.key] !== 'YES').map(s => s.name);

  // Dynamic repeating diagonal watermark SVG pattern
  const wmColor = watermarkSettings?.color || '#C62828';
  const wmOpacity = (watermarkSettings?.opacity !== undefined ? watermarkSettings.opacity : 10) / 100;
  const wmRotation = watermarkSettings?.rotation !== undefined ? watermarkSettings.rotation : -30;
  const watermarkText = watermarkSettings?.text || activeCompany.name || 'BG GROUP OF PAINT & COATING CONSULTANT';
  const watermarkSvg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='480' height='240'><text x='50%' y='50%' fill='${encodeURIComponent(wmColor)}' fill-opacity='${wmOpacity}' font-size='12' font-family='Arial, sans-serif' font-weight='bold' text-anchor='middle' transform='rotate(${wmRotation} 240 120)'>${encodeURIComponent(watermarkText)}</text></svg>")`;
  const isWatermarkActive = showWatermark && (watermarkSettings?.enabled ?? true);

  const currentDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

  // Copy Full Text Dossier
  const handleCopyReport = () => {
    let reportText = `========================================================================\n`;
    reportText += `${activeCompany.name}\n`;
    reportText += `SURFACE TREATMENT & COATING — COATING SPECIFICATION READING\n`;
    reportText += `Status: ${projectData.status || 'Draft'} • Revision: ${projectData.revision || 'R0'}\n`;
    reportText += `========================================================================\n\n`;
    reportText += `Project No: ${projectData.projNo || '—'}\n`;
    reportText += `Design Input No: ${projectData.dinNo || '—'}\n`;
    reportText += `Project Description: ${projectData.projDesc || '—'}\n`;
    reportText += `Customer: ${projectData.custName || '—'}\n`;
    reportText += `Prepared By: ${projectData.preparedBy || '—'}\n`;
    reportText += `Applicable Specs: ${specs.filter(Boolean).join(', ') || '—'}\n\n`;

    reportText += `Scope YES: ${yesScopeList.join(', ') || 'None'}\n`;
    reportText += `Scope NO/NA: ${noNaScopeList.join(', ') || 'None'}\n\n`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    addToast('Dossier Copied', 'Specification dossier copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON
  const handleDownloadJson = () => {
    const fullSpecJson = {
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
      genNotes,
      metadata: {
        exportDate: new Date().toISOString(),
        company: activeCompany.name
      }
    };

    const blob = new Blob([JSON.stringify(fullSpecJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Spec_${projectData.projNo || 'Draft'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Spec Exported', 'Specification JSON downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-200">
      
      {/* Top Floating Control Toolbar (Hidden during Print or Modal) */}
      {!hideToolbar && (
        <div className="bg-white border border-[#D8DEE5] rounded-xl px-4 py-3 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#E87B1E] bg-[#FFF4E3] border border-[#F3D2A0] px-2 py-0.5 rounded-md uppercase">
              Official Sheet
            </span>
            <span className="text-xs font-bold text-[#1B222C] font-rajdhani uppercase">
              Coating Specification Reading Dossier
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWatermark(!showWatermark)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                showWatermark ? 'bg-[#FFF4E3] text-[#9E1B1E] border-[#F3D2A0]' : 'bg-white text-[#4E5B6A] border-[#D8DEE5]'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>{showWatermark ? 'Watermark: ON' : 'Watermark: OFF'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReport}
              className="px-3 py-1.5 bg-white hover:bg-[#F7F8FA] text-[#1B222C] border border-[#D8DEE5] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#7E8B99]" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-white hover:bg-[#F7F8FA] text-[#1B222C] border border-[#D8DEE5] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#7E8B99]" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white rounded-lg text-xs font-bold font-rajdhani uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════
          FORMAL PRINT / PREVIEW DOSSIER CANVAS (Matches Image 2 Exactly)
          ════════════════════════════════════════════════════════════════════════════ */}
      <div 
        className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-4 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full"
        style={{
          backgroundImage: isWatermarkActive ? watermarkSvg : 'none',
          backgroundRepeat: 'repeat'
        }}
      >
        {/* Header Block */}
        <div className="relative z-10 pb-3 border-b-2 border-slate-900">
          <div className="flex items-start justify-between gap-4">
            {/* BG Logo on Left */}
            <div className="w-11 h-11 border border-black flex items-center justify-center font-bold text-base font-rajdhani flex-shrink-0 bg-white">
              {activeCompany.logo ? (
                <img src={activeCompany.logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                <span>BG</span>
              )}
            </div>

            {/* Title & Contact in Center */}
            <div className="text-center flex-1 pr-11">
              <h1 className="text-sm sm:text-base font-bold text-[#0F172A] uppercase tracking-wider font-sans">
                {activeCompany.name}
              </h1>
              <p className="text-[9.5px] sm:text-[10px] text-[#475569] mt-0.5 font-sans leading-tight">
                {activeCompany.address} • {activeCompany.phone} • {activeCompany.website}
              </p>
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A] uppercase tracking-wider mt-2.5 font-rajdhani">
                SURFACE TREATMENT &amp; COATING — COATING SPECIFICATION READING
              </h2>
              <p className="text-[10.5px] text-[#64748B] italic mt-0.5 font-sans">
                Status: {projectData.status || 'Draft'} • Revision: {projectData.revision || 'R0'}
              </p>
            </div>
          </div>
        </div>

        {/* ════ SECTION 1: A - B — PROJECT INFORMATION & SCOPE ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            A - B — PROJECT INFORMATION &amp; SCOPE
          </div>
          <table className="w-full text-[11px] border-collapse border border-[#94A3B8]">
            <tbody>
              <tr className="border-b border-[#CBD5E1]">
                <td className="w-[18%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Project No.</td>
                <td className="w-[32%] p-1.5 border-r border-[#CBD5E1] font-mono">{projectData.projNo || '—'}</td>
                <td className="w-[20%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Design Input No.</td>
                <td className="w-[30%] p-1.5 font-mono">{projectData.dinNo || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Project Description</td>
                <td colSpan="3" className="p-1.5">{projectData.projDesc || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Customer</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{projectData.custName || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Prepared By</td>
                <td className="p-1.5">{projectData.preparedBy || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Applicable Specification(s)</td>
                <td colSpan="3" className="p-1.5">{specs.filter(Boolean).join(' | ') || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Scope Description</td>
                <td colSpan="3" className="p-1.5">{projectData.scopeDesc || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Company Scope — YES</td>
                <td colSpan="3" className="p-1.5 font-medium text-emerald-800">
                  {yesScopeList.length > 0 ? yesScopeList.join(', ') : 'None'}
                </td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Company Scope — NO / NA</td>
                <td colSpan="3" className="p-1.5 text-slate-600">
                  {noNaScopeList.length > 0 ? noNaScopeList.join(', ') : 'None'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 2: C — GENERAL REQUIREMENTS ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            C — GENERAL REQUIREMENTS
          </div>
          <table className="w-full text-[11px] border-collapse border border-[#94A3B8]">
            <tbody>
              <tr className="border-b border-[#CBD5E1]">
                <td className="w-[20%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">A1 Environment</td>
                <td className="w-[30%] p-1.5 border-r border-[#CBD5E1]">{envData.a1Env || envData.envCategory || '—'}</td>
                <td className="w-[25%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Reference</td>
                <td className="w-[25%] p-1.5">{envData.envRef || envData.reference || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">A2 Transportation</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{envData.transport || envData.a2Trans || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">A3 Voyage Duration</td>
                <td className="p-1.5">{envData.voyage || envData.a3Voyage || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">A4 Paint Validation</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{envData.paintValid || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">5c.1 Painting Req'd in D2/BEP/PEP?</td>
                <td className="p-1.5 font-semibold">{envData.paintReq || 'NA'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">5c.2 MOC</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{envData.moc || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">5c.3 Cyclic Service</td>
                <td className="p-1.5 font-semibold">{envData.cyclic || envData.cyclicService || 'NA'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 3: D — OPERATING & DESIGN TEMPERATURE DATA ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            D — OPERATING &amp; DESIGN TEMPERATURE DATA
          </div>
          <table className="w-full text-[10.5px] border-collapse border border-[#94A3B8]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[9.5px] font-bold uppercase text-[#334155]">
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-8">#</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">COMPONENT / SURFACE</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-24">OP. TEMP. (°C)</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-24">DESIGN TEMP. (°C)</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-18">PAINTING</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-20">GALVANIZING</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-24">TSA / FRE / FRP</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-20">INSULATION</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-22">FIRE PROOFING</th>
                <th className="p-1.5 text-center w-24">PAINTING SURFACE</th>
              </tr>
            </thead>
            <tbody>
              {dRows.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-2.5 text-center italic text-slate-400">
                    — No component rows defined —
                  </td>
                </tr>
              ) : (
                dRows.map((r, i) => (
                  <tr key={i} className="border-b border-[#CBD5E1]">
                    <td className="p-1.5 text-center font-bold font-mono border-r border-[#CBD5E1]">{`4.${i + 1}`}</td>
                    <td className="p-1.5 font-medium border-r border-[#CBD5E1]">{r.component || '—'}</td>
                    <td className="p-1.5 text-center font-mono border-r border-[#CBD5E1]">{r.opTemp || '—'}</td>
                    <td className="p-1.5 text-center font-mono border-r border-[#CBD5E1]">{r.designTemp || '—'}</td>
                    <td className="p-1.5 text-center font-bold border-r border-[#CBD5E1]">{r.painting || 'NA'}</td>
                    <td className="p-1.5 text-center font-bold border-r border-[#CBD5E1]">{r.galv || 'NA'}</td>
                    <td className="p-1.5 text-center font-bold border-r border-[#CBD5E1]">{r.tsa || 'NA'}</td>
                    <td className="p-1.5 text-center font-bold border-r border-[#CBD5E1]">{r.insulation || 'NA'}</td>
                    <td className="p-1.5 text-center font-bold border-r border-[#CBD5E1]">{r.fireproof || 'NA'}</td>
                    <td className="p-1.5 text-center">{r.surface || r.paintSurface || 'External'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 4: E — INSULATION / FIREPROOFING / TSA-FRE-FRP / GALVANIZING / PICKLING ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            E — INSULATION / FIREPROOFING / TSA-FRE-FRP / GALVANIZING / PICKLING
          </div>
          <table className="w-full text-[11px] border-collapse border border-[#94A3B8]">
            <tbody>
              <tr className="border-b border-[#CBD5E1]">
                <td className="w-[20%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Insulation Thk.</td>
                <td className="w-[30%] p-1.5 border-r border-[#CBD5E1]">{specialData.insThk || '—'}</td>
                <td className="w-[20%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Insulation Type</td>
                <td className="w-[30%] p-1.5">{specialData.insType || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Insulation Description</td>
                <td colSpan="3" className="p-1.5">{specialData.insDesc || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Fireproofing Thk.</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{specialData.fpThk || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Fireproofing Type</td>
                <td className="p-1.5">{specialData.fpType || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Fireproofing Description</td>
                <td colSpan="3" className="p-1.5">{specialData.fpDesc || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">TSA/FRE/FRP Thk.</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{specialData.tsaThk || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">TSA/FRE/FRP Type</td>
                <td className="p-1.5">{specialData.tsaType || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">TSA Description</td>
                <td colSpan="3" className="p-1.5">{specialData.tsaDesc || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Galvanizing Thk.</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{specialData.galvThk || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Galvanizing Type</td>
                <td className="p-1.5">{specialData.galvType || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Galv. Description</td>
                <td colSpan="3" className="p-1.5">{specialData.galvDesc || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Pickling Spec.</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{specialData.pickThk || specialData.pickSpec || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Pickling Type</td>
                <td className="p-1.5">{specialData.pickType || '—'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Pickling Description</td>
                <td colSpan="3" className="p-1.5">{specialData.pickDesc || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 5: F — COATING SYSTEM DESIGN ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            F — COATING SYSTEM DESIGN
          </div>
          <table className="w-full text-[10px] border-collapse border border-[#94A3B8]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[9px] font-bold uppercase text-[#334155]">
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-7">#</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">COATING SYSTEM FOR</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">SURFACE PREPARATION</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-18">PROFILE (µM)</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">PRIMER PAINT</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-16">DFT (µM)</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">INTERMEDIATE</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-16">DFT (µM)</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">FINISH</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-16">DFT (µM)</th>
                <th className="p-1.5 text-center w-16">AREA (M²)</th>
              </tr>
            </thead>
            <tbody>
              {fRows.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-2.5 text-center italic text-slate-400">
                    — No coating systems defined —
                  </td>
                </tr>
              ) : (
                fRows.map((r, i) => (
                  <tr key={i} className="border-b border-[#CBD5E1]">
                    <td className="p-1 text-center font-bold font-mono border-r border-[#CBD5E1]">{i + 1}</td>
                    <td className="p-1 font-semibold border-r border-[#CBD5E1]">{r.systemFor || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.surfacePrep || '—'}</td>
                    <td className="p-1 text-center font-mono border-r border-[#CBD5E1]">{r.profile || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.primer || '—'}</td>
                    <td className="p-1 text-center font-mono border-r border-[#CBD5E1]">{r.primerDft || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.intermediate || '—'}</td>
                    <td className="p-1 text-center font-mono border-r border-[#CBD5E1]">{r.intermediateDft || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.finish || '—'}</td>
                    <td className="p-1 text-center font-mono border-r border-[#CBD5E1]">{r.finishDft || '—'}</td>
                    <td className="p-1 text-center font-mono">{r.area || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 6: G — PAINT TESTING REQUIREMENTS ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            G — PAINT TESTING REQUIREMENTS
          </div>
          <table className="w-full text-[11px] border-collapse border border-[#94A3B8]">
            <tbody>
              <tr className="border-b border-[#CBD5E1]">
                <td className="w-[20%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Laboratory</td>
                <td className="w-[30%] p-1.5 border-r border-[#CBD5E1]">{qcData.labReq || '—'}</td>
                <td className="w-[20%] p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Testing Certificate</td>
                <td className="w-[30%] p-1.5">{qcData.testCert || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Applicable Standard</td>
                <td className="p-1.5 border-r border-[#CBD5E1]">{qcData.appStd || '—'}</td>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Applicable for Paint System</td>
                <td className="p-1.5">{qcData.appSystem || '—'}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Test Remarks</td>
                <td colSpan="3" className="p-1.5">{qcData.testRem || '—'}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold bg-[#F8FAFC] border-r border-[#CBD5E1]">Files Attached</td>
                <td colSpan="3" className="p-1.5">{(qcData.files?.length || 0)} file(s)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 7: H — APPROVED PRIMER & PAINT MANUFACTURERS ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            H — APPROVED PRIMER &amp; PAINT MANUFACTURERS
          </div>
          <table className="w-full text-[10px] border-collapse border border-[#94A3B8]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[9px] font-bold uppercase text-[#334155]">
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">GENERIC TYPE</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">INTERNATIONAL / AKZO</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">JOTUN</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">ASIAN PAINTS / PPG</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">CARBOLINE</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">HEMPEL</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">SIGMA (PPG)</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">{otherColName || 'OTHER'}</th>
                <th className="p-1.5 text-left">{other2ColName || 'OTHER 2'}</th>
              </tr>
            </thead>
            <tbody>
              {hRows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-2.5 text-center italic text-slate-400">
                    — No manufacturer rows defined —
                  </td>
                </tr>
              ) : (
                hRows.map((r, i) => (
                  <tr key={i} className="border-b border-[#CBD5E1]">
                    <td className="p-1 font-semibold border-r border-[#CBD5E1]">{r.generic || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.akzo || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.jotun || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.asian || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.carboline || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.hempel || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.sigma || '—'}</td>
                    <td className="p-1 border-r border-[#CBD5E1]">{r.other || '—'}</td>
                    <td className="p-1">{r.other2 || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ════ SECTION 8: I — REVISION HISTORY ════ */}
        <div className="space-y-1 relative z-10">
          <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
            I — REVISION HISTORY
          </div>
          <table className="w-full text-[10.5px] border-collapse border border-[#94A3B8]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[9.5px] font-bold uppercase text-[#334155]">
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-20">REV. NO.</th>
                <th className="p-1.5 text-center border-r border-[#CBD5E1] w-24">DATE</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1]">REVISION DETAILS</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1] w-28">PREPARED BY</th>
                <th className="p-1.5 text-left border-r border-[#CBD5E1] w-28">REVIEWED BY</th>
                <th className="p-1.5 text-left w-28">APPROVED BY</th>
              </tr>
            </thead>
            <tbody>
              {iRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2.5 text-center italic text-slate-400">
                    — No revisions defined —
                  </td>
                </tr>
              ) : (
                iRows.map((r, i) => (
                  <tr key={i} className="border-b border-[#CBD5E1]">
                    <td className="p-1.5 text-center font-bold font-mono border-r border-[#CBD5E1]">{r.revNo || `Rev ${i}`}</td>
                    <td className="p-1.5 text-center font-mono border-r border-[#CBD5E1]">{r.date || '—'}</td>
                    <td className="p-1.5 border-r border-[#CBD5E1]">{r.details || '—'}</td>
                    <td className="p-1.5 border-r border-[#CBD5E1]">{r.prep || '—'}</td>
                    <td className="p-1.5 border-r border-[#CBD5E1]">{r.rev || '—'}</td>
                    <td className="p-1.5">{r.app || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* General Notes if present */}
        {genNotes && (
          <div className="space-y-1 relative z-10">
            <div className="bg-[#1E293B] text-white px-2.5 py-1 text-[11px] font-bold font-rajdhani uppercase tracking-wider">
              GENERAL NOTES &amp; ADDITIONAL COMMENTS
            </div>
            <div className="p-2.5 text-[11px] text-slate-700 border border-[#94A3B8] bg-[#F8FAFC] whitespace-pre-line leading-relaxed">
              {genNotes}
            </div>
          </div>
        )}

        {/* Document Footer */}
        <div className="relative z-10 pt-3 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-1 text-[9.5px] sm:text-[10px] text-slate-500 font-mono">
          <div>
            Document: {projectData.projNo || '—'} • Status: {projectData.status || 'Draft'} • Rev: {projectData.revision || 'R0'}
          </div>
          <div>
            Generated: {currentDateStr}, {currentTimeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
