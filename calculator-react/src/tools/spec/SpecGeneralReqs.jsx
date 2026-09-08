import React from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  Sun, 
  Wind, 
  AlertTriangle 
} from 'lucide-react';
import { CORROSIVITY_ENVIRONMENTS } from '../../data/specDatabase';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecGeneralReqs({ envData, setEnvData, onNext }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const selectedEnv = CORROSIVITY_ENVIRONMENTS.find(e => e.id === envData.envCategory) || CORROSIVITY_ENVIRONMENTS[5];

  const handleValidate = () => {
    if (!envData.envCategory) {
      addToast('Missing Required Input', 'Please select an Environmental Corrosivity Category (ISO 12944-2).', 'warning');
      return;
    }
    addToast('Environment Profile Saved', 'General requirements and corrosivity category recorded.', 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setEnvData({
      envCategory: '',
      transpCond: '',
      validReq: '',
      moc: '',
      cyclicService: 'NO',
      cyclicDesc: '',
      designLife: 'H'
    });
    addToast('Section Reset', 'General requirements cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section C
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              General Requirements &amp; Operating Environment
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Atmospheric &amp; immersion corrosivity category (ISO 12944-2), cyclic service conditions, design durability, and substrate metallurgy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('iso_12944')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 ISO 12944 Guideline</span>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Environmental &amp; Substrate Parameters</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">* Mandatory</span>
        </div>

        {/* Corrosivity Dropdown & Live Environmental Callout */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            A1 — Atmospheric / Immersion Corrosivity Category (ISO 12944-2) <span className="text-rose-500 font-mono">*</span>
          </label>
          <select
            value={envData.envCategory}
            onChange={e => setEnvData({ ...envData, envCategory: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
          >
            <option value="">— Select environment category —</option>
            {CORROSIVITY_ENVIRONMENTS.map(env => (
              <option key={env.id} value={env.id}>
                {env.name} — {env.ext}
              </option>
            ))}
          </select>

          {/* Live ISO 12944 Corrosivity Callout */}
          {envData.envCategory && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  ISO 12944-2 Profile: {selectedEnv.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  1st-Yr Steel Loss: {selectedEnv.massLoss}
                </span>
              </div>
              <p className="text-xs text-emerald-900 font-sans leading-relaxed">
                {selectedEnv.ext}
              </p>
            </div>
          )}
        </div>

        {/* 2-Col Grid: Transportation & Validation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              A2 — Transportation / Storage / Packing Requirement
            </label>
            <input
              type="text"
              value={envData.transpCond}
              onChange={e => setEnvData({ ...envData, transpCond: e.target.value })}
              placeholder="e.g. Ocean Shipping / Sea Fastening / Seaworthy Export Packing"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              A3 — Specification Validation / Prequalification Standard
            </label>
            <input
              type="text"
              value={envData.validReq}
              onChange={e => setEnvData({ ...envData, validReq: e.target.value })}
              placeholder="e.g. NORSOK M-501 System 1 / ISO 12944-6 Laboratory Test"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>
        </div>

        {/* 2-Col Grid: Substrate Metallurgy & Target Design Life */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              A4 — Material of Construction (Substrate MOC)
            </label>
            <input
              type="text"
              value={envData.moc}
              onChange={e => setEnvData({ ...envData, moc: e.target.value })}
              placeholder="e.g. Carbon Steel (ASTM A516 Gr. 70 / A106 Gr. B) / 316L SS"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Coating Durability Range (ISO 12944-1)
            </label>
            <select
              value={envData.designLife}
              onChange={e => setEnvData({ ...envData, designLife: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            >
              <option value="L">Low (L) — Less than 7 Years</option>
              <option value="M">Medium (M) — 7 to 15 Years</option>
              <option value="H">High (H) — 15 to 25 Years (Industry Standard Target)</option>
              <option value="VH">Very High (VH) — Greater than 25 Years</option>
            </select>
          </div>
        </div>

        {/* Cyclic Service Evaluation Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">A5 — Cyclic / Thermal / Sour Service</span>
              <span className="text-[11px] text-slate-400">Specify whether equipment undergoes temperature cycling or H2S / H2 sour exposure.</span>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
              {['YES', 'NO'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setEnvData({ ...envData, cyclicService: v })}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                    envData.cyclicService === v
                      ? v === 'YES'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-slate-700 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {envData.cyclicService === 'YES' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cyclic / Sour Service Description
              </label>
              <input
                type="text"
                value={envData.cyclicDesc}
                onChange={e => setEnvData({ ...envData, cyclicDesc: e.target.value })}
                placeholder="e.g. Thermal Cycling 20°C to 180°C + H2S wet sour gas environment"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
          )}
        </div>

        {/* Form Actions Bar */}
        <div className="flex gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Save Environmental Profile</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Section</span>
          </button>
        </div>

      </div>

    </div>
  );
}
