import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Building2, 
  Stamp, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { SCOPE_ITEMS, CORROSIVITY_ENVIRONMENTS } from '../../data/specDatabase';
import { formatNum } from '../../utils/calculations';

export default function SpecPreviewModal({ 
  isOpen, 
  onClose, 
  specData, 
  companyProfile, 
  watermarkSettings 
}) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !specData) return null;

  const { 
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
    genNotes = '' 
  } = specData;

  const selectedEnv = CORROSIVITY_ENVIRONMENTS.find(e => e.id === envData?.envCategory) || {
    id: envData?.envCategory || 'CX',
    name: envData?.envCategory ? `ISO 12944 Category ${envData.envCategory}` : 'Extreme Offshore (CX)',
    ext: 'Aggressive marine environment with extreme atmospheric salinity.',
    massLoss: '> 1500 g/m²'
  };

  const totalArea = (fRows || []).reduce((sum, r) => sum + (Number(r?.area) || 0), 0);

  const activeCompany = companyProfile || {
    name: 'BG GROUP OF PAINT & COATING CONSULTANT',
    tagline: 'Surface Treatment & Coating · Specification Reading · Digital Engineering System',
    phone: '+91 99258 10408',
    email: 'info@bgcoating.com',
    website: 'www.bgcoating.com',
    address: 'Hazira Road, Surat / Mumbai, India',
    logo: null
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col justify-between p-2 md:p-6 animate-in fade-in duration-200">
      
      {/* Top Floating Action Bar */}
      <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xl max-w-5xl w-full mx-auto mb-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs md:text-sm font-bold text-white">
              Technical Specification Preview (Read-Only)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {activeCompany.name}
            </span>
          </div>
        </div>

        {/* Center Zoom Controls */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setZoom(prev => Math.max(60, prev - 10))}
            className="p-1 text-slate-300 hover:text-white rounded transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-amber-400 font-bold px-1.5">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom(prev => Math.min(150, prev + 10))}
            className="p-1 text-slate-300 hover:text-white rounded transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(100)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Canvas Area */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-2">
        <div 
          className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl max-w-4xl w-full border border-slate-300 relative overflow-hidden space-y-6 transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          
          {/* Background Watermark */}
          {watermarkSettings?.enabled && (
            <div 
              className="absolute inset-0 pointer-events-none flex items-center justify-center text-center font-mono font-black uppercase text-slate-900 tracking-wider transition-all duration-150 select-none"
              style={{
                opacity: (watermarkSettings.opacity || 12) / 100,
                transform: `rotate(${watermarkSettings.rotation || -30}deg)`,
                fontSize: '48px',
                lineHeight: '1.2'
              }}
            >
              {watermarkSettings.text || activeCompany.name}
            </div>
          )}

          {/* Dossier Header */}
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
                <div className="font-bold text-slate-900">DOC: SPEC-{projectData.projNo || 'REV0'}</div>
                <div>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <div className="text-[10px] text-emerald-700 font-bold uppercase">Status: Official Technical Release</div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-xs md:text-sm font-extrabold uppercase font-mono tracking-wider">
                Engineering Coating Specification Datasheet
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                ISO 12944 / NORSOK M-501 Verified
              </span>
            </div>
          </div>

          {/* Project Details & Scope */}
          <div className="space-y-3 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Project No.</span>
                <span className="font-mono font-bold text-slate-900">{projectData.projNo || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">DIN No.</span>
                <span className="font-mono font-medium text-slate-800">{projectData.dinNo || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Client / Customer</span>
                <span className="font-semibold text-slate-900">{projectData.custName || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Prepared By</span>
                <span className="font-medium text-slate-800">{projectData.preparedBy || '—'}</span>
              </div>

              <div className="col-span-2 md:col-span-4 pt-1 border-t border-slate-200/60">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Project Description</span>
                <span className="font-medium text-slate-800">{projectData.projDesc || '—'}</span>
              </div>
            </div>

            {/* Scope Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {SCOPE_ITEMS.map((item) => {
                const val = scope[item.key] || item.def;
                return (
                  <div
                    key={item.key}
                    className={`p-2 rounded-xl border text-center text-xs font-bold ${
                      val === 'YES'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : val === 'NO'
                        ? 'bg-slate-50 text-slate-500 border-slate-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <span className="block text-sm">{item.icon}</span>
                    <span className="text-[10px] block truncate">{item.name}</span>
                    <span className="text-[10px] font-mono font-black uppercase">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environmental Corrosivity Profile */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs relative z-10">
            <div>
              <span className="text-[10px] font-mono text-emerald-800 block font-bold uppercase">Corrosivity Category</span>
              <span className="font-mono font-bold text-emerald-950">{selectedEnv.name}</span>
              <p className="text-[11px] text-emerald-900 mt-0.5">{selectedEnv.ext}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-800 block font-bold uppercase">Substrate Metallurgy</span>
              <span className="font-mono font-bold text-emerald-950">{envData.moc || 'Carbon Steel'}</span>
              <p className="text-[11px] text-emerald-900 mt-0.5">Durability: {envData.designLife || 'H'} (15–25 Yrs)</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-800 block font-bold uppercase">Cyclic &amp; Sour Service</span>
              <span className="font-mono font-bold text-emerald-950">{envData.cyclicService || 'NO'}</span>
              {envData.cyclicDesc && <p className="text-[11px] text-emerald-900 mt-0.5">{envData.cyclicDesc}</p>}
            </div>
          </div>

          {/* Coating System Schedule */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Coating System Build Schedule ({fRows.length} Systems)
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700">
                Total Area: {totalArea > 0 ? `${formatNum(totalArea, 1)} m²` : '—'}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-center w-8">#</th>
                    <th className="p-2 min-w-[130px]">Component</th>
                    <th className="p-2 min-w-[140px]">Surface Prep</th>
                    <th className="p-2 min-w-[130px]">Primer Coat</th>
                    <th className="p-2 min-w-[130px]">Intermediate</th>
                    <th className="p-2 min-w-[130px]">Finish Coat</th>
                    <th className="p-2 text-center w-20">Total DFT</th>
                    <th className="p-2 text-center w-20">Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {fRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-3 text-center text-slate-400 italic">No coating systems entered.</td>
                    </tr>
                  ) : (
                    fRows.map((r, i) => {
                      const totDft = (Number(r.primerDft) || 0) + (Number(r.intermediateDft) || 0) + (Number(r.finishDft) || 0);
                      return (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center font-mono font-bold text-slate-400">{i + 1}</td>
                          <td className="p-2 font-bold text-slate-900">{r.systemFor || 'General'}</td>
                          <td className="p-2 font-mono text-[11px] text-slate-700">{r.surfacePrep} (Rz: {r.profile}µm)</td>
                          <td className="p-2 text-[11px]">{r.primer} @ <strong>{r.primerDft}µm</strong></td>
                          <td className="p-2 text-[11px]">{r.intermediate} @ <strong>{r.intermediateDft}µm</strong></td>
                          <td className="p-2 text-[11px]">{r.finish} @ <strong>{r.finishDft}µm</strong></td>
                          <td className="p-2 text-center font-mono font-extrabold text-slate-900 bg-slate-50">{totDft} µm</td>
                          <td className="p-2 text-center font-mono font-bold text-[#D97706]">{r.area ? `${r.area} m²` : '—'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approved Manufacturers Matrix */}
          {hRows.length > 0 && (
            <div className="space-y-2 relative z-10">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-1">
                Approved Manufacturers Equivalence Schedule
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-mono text-[9.5px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2">Generic Paint</th>
                      <th className="p-2">AkzoNobel</th>
                      <th className="p-2">Jotun</th>
                      <th className="p-2">Asian Paints / PPG</th>
                      <th className="p-2">Carboline</th>
                      <th className="p-2">Hempel</th>
                      <th className="p-2">Sigma (PPG)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[10.5px]">
                    {hRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-1.5 font-bold font-sans text-slate-900">{r.gen}</td>
                        <td className="p-1.5 text-slate-700">{r.int || '—'}</td>
                        <td className="p-1.5 text-slate-700">{r.jot || '—'}</td>
                        <td className="p-1.5 text-slate-700">{r.asn || '—'}</td>
                        <td className="p-1.5 text-slate-700">{r.cbl || '—'}</td>
                        <td className="p-1.5 text-slate-700">{r.hmp || '—'}</td>
                        <td className="p-1.5 text-slate-700">{r.sgm || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sign-off Blocks */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs relative z-10">
            <div className="space-y-4">
              <span className="font-mono text-slate-400 uppercase font-bold text-[9.5px] block">Prepared By</span>
              <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">{projectData.preparedBy || 'Coating Inspector'}</div>
              <span className="text-[9.5px] font-mono text-slate-400">NACE / FROSIO Level 3</span>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-slate-400 uppercase font-bold text-[9.5px] block">Reviewed By</span>
              <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">Quality Assurance Dept.</div>
              <span className="text-[9.5px] font-mono text-slate-400">Lead QA / QC Engineer</span>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-slate-400 uppercase font-bold text-[9.5px] block">Approved By</span>
              <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">Client Representative</div>
              <span className="text-[9.5px] font-mono text-slate-400">Owner / EPC Contractor</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
