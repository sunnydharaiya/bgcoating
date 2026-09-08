import React from 'react';
import { 
  FlaskConical, 
  RotateCcw, 
  Play, 
  Info, 
  BookOpen, 
  Flame, 
  Layers, 
  Wrench, 
  Shield 
} from 'lucide-react';
import { 
  INSULATION_TYPES, 
  FIREPROOFING_TYPES, 
  TSA_TYPES, 
  GALVANIZING_TYPES, 
  PICKLING_TYPES 
} from '../../data/specDatabase';
import { useToast } from '../../context/ToastContext';
import { useGuideline } from '../../context/GuidelineContext';

export default function SpecSpecialDetails({ specialData, setSpecialData, onNext }) {
  const { addToast } = useToast();
  const { openGuideline } = useGuideline();

  const handleValidate = () => {
    addToast('Special Systems Validated', 'Insulation, PFP, TSA, Galvanizing, and Pickling details saved.', 'success');
    if (onNext) onNext();
  };

  const handleReset = () => {
    setSpecialData({
      insThk: '',
      insType: '',
      insDesc: '',
      fpThk: '',
      fpType: '',
      fpDesc: '',
      tsaThk: '',
      tsaType: '',
      tsaDesc: '',
      galvThk: '',
      galvType: '',
      galvDesc: '',
      pickThk: '',
      pickType: '',
      pickDesc: ''
    });
    addToast('Section Reset', 'All special system details have been cleared.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Section E
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
              Insulation / Fireproofing / TSA · FRP / Galvanizing / Pickling
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engineering parameters, thicknesses, generic types, and execution standards for non-paint protective disciplines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGuideline('spec_reading')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Guideline</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        
        {/* 1. Insulation Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <span className="text-base">🧥</span>
            <h3 className="text-xs font-bold text-[#D97706] uppercase tracking-wider font-mono">
              1. Thermal Insulation Specification
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Insulation Thickness</label>
              <input
                type="text"
                value={specialData.insThk}
                onChange={e => setSpecialData({ ...specialData, insThk: e.target.value })}
                placeholder="e.g. 100 mm (Shell) / 50 mm (Piping)"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Insulation Type</label>
              <input
                type="text"
                value={specialData.insType}
                onChange={e => setSpecialData({ ...specialData, insType: e.target.value })}
                placeholder="Select or type..."
                list="ins-types-list"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
              <datalist id="ins-types-list">
                {INSULATION_TYPES.map((t, i) => <option key={i} value={t} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Insulation Description / Brand</label>
              <input
                type="text"
                value={specialData.insDesc}
                onChange={e => setSpecialData({ ...specialData, insDesc: e.target.value })}
                placeholder="e.g. Hydrophobic rockwool + 0.8mm SS 316 cladding"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Fireproofing Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <span className="text-base">🔥</span>
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono">
              2. Passive Fire Protection (PFP) Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Fireproofing Thickness / Rating</label>
              <input
                type="text"
                value={specialData.fpThk}
                onChange={e => setSpecialData({ ...specialData, fpThk: e.target.value })}
                placeholder="e.g. 18 mm / 2-Hour Hydrocarbon Pool Fire (UL 1709)"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Type of Fireproofing</label>
              <input
                type="text"
                value={specialData.fpType}
                onChange={e => setSpecialData({ ...specialData, fpType: e.target.value })}
                placeholder="Select or type..."
                list="fp-types-list"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
              <datalist id="fp-types-list">
                {FIREPROOFING_TYPES.map((t, i) => <option key={i} value={t} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">PFP System Details / Mesh</label>
              <input
                type="text"
                value={specialData.fpDesc}
                onChange={e => setSpecialData({ ...specialData, fpDesc: e.target.value })}
                placeholder="e.g. Chartek 7 with carbon fiber HK-1 mesh reinforcement"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. TSA / FRE / FRP Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <span className="text-base">⚡</span>
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">
              3. TSA / FRP / FRE Special Coating Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Thickness (µm / mm)</label>
              <input
                type="text"
                value={specialData.tsaThk}
                onChange={e => setSpecialData({ ...specialData, tsaThk: e.target.value })}
                placeholder="e.g. TSA 250–300 µm + Silicone Sealer 25 µm"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Special System Type</label>
              <input
                type="text"
                value={specialData.tsaType}
                onChange={e => setSpecialData({ ...specialData, tsaType: e.target.value })}
                placeholder="Select or type..."
                list="tsa-types-list"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
              <datalist id="tsa-types-list">
                {TSA_TYPES.map((t, i) => <option key={i} value={t} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sealer / Build-Up Description</label>
              <input
                type="text"
                value={specialData.tsaDesc}
                onChange={e => setSpecialData({ ...specialData, tsaDesc: e.target.value })}
                placeholder="e.g. Twin-wire arc spray 99.5% Al per ISO 2063 Class A"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Galvanizing Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <span className="text-base">🔩</span>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              4. Galvanizing (HDG) Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Galvanizing Thickness / Coating Mass</label>
              <input
                type="text"
                value={specialData.galvThk}
                onChange={e => setSpecialData({ ...specialData, galvThk: e.target.value })}
                placeholder="e.g. 85 µm minimum (600 g/m²) per ASTM A123"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Galvanizing Type</label>
              <input
                type="text"
                value={specialData.galvType}
                onChange={e => setSpecialData({ ...specialData, galvType: e.target.value })}
                placeholder="Select or type..."
                list="galv-types-list"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
              <datalist id="galv-types-list">
                {GALVANIZING_TYPES.map((t, i) => <option key={i} value={t} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Post-Galvanizing / Passivation</label>
              <input
                type="text"
                value={specialData.galvDesc}
                onChange={e => setSpecialData({ ...specialData, galvDesc: e.target.value })}
                placeholder="e.g. Chromate quenching / phosphating before topcoating"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. Pickling & Passivation Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <span className="text-base">🧪</span>
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              5. Chemical Pickling &amp; Passivation Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Process Specification</label>
              <input
                type="text"
                value={specialData.pickThk}
                onChange={e => setSpecialData({ ...specialData, pickThk: e.target.value })}
                placeholder="e.g. ASTM A380 / ASTM A967 Citric Acid"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickling &amp; Passivation Type</label>
              <input
                type="text"
                value={specialData.pickType}
                onChange={e => setSpecialData({ ...specialData, pickType: e.target.value })}
                placeholder="Select or type..."
                list="pick-types-list"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
              <datalist id="pick-types-list">
                {PICKLING_TYPES.map((t, i) => <option key={i} value={t} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Testing &amp; Neutralization Details</label>
              <input
                type="text"
                value={specialData.pickDesc}
                onChange={e => setSpecialData({ ...specialData, pickDesc: e.target.value })}
                placeholder="e.g. Water-break free test & Ferroxyl test verification"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#F7941D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleValidate}
            className="flex-[2] py-3 px-4 bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Validate Special Systems</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-[#A50021] border border-[#A50021]/30 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition hover:border-[#A50021] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Details</span>
          </button>
        </div>

      </div>

    </div>
  );
}
