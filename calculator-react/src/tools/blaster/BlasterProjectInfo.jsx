import React, { useRef } from 'react';
import {
  Building2,
  Camera,
  Upload,
  Trash2,
  User,
  ArrowRight,
  ShieldCheck,
  Save,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export default function BlasterProjectInfo({
  state,
  onChange,
  metrics,
  onNavigate
}) {
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('operatorPhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    onChange('operatorPhoto', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#E8700A] font-bold">
            Section 01 · Step 1 of 8
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Project &amp; Operator Identification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Capture project context, specification standards, and operator biographical identity with photograph.
          </p>
        </div>

        <button
          onClick={() => onNavigate('train')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <span>Next: Training &amp; Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Operator Photograph Upload Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#E8700A]" />
          <span>Operator Photograph (Required for ID Card &amp; Print Dossier)</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
          
          {/* Photo Preview / Slot */}
          <div className="relative w-32 h-40 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
            {state.operatorPhoto ? (
              <img
                src={state.operatorPhoto}
                alt="Operator"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center text-slate-400">
                <User className="w-10 h-10 stroke-1 mb-1 text-slate-300 dark:text-slate-600" />
                <span className="text-[10px] font-bold uppercase">No Photo</span>
              </div>
            )}

            {state.operatorPhoto && (
              <button
                onClick={handleRemovePhoto}
                className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white shadow-xs transition cursor-pointer"
                title="Remove Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Photo Guidelines & Actions */}
          <div className="flex-1 space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">📌 Photograph Guidelines:</span>
              <p className="text-[11.5px] text-slate-500">
                Upload a recent passport-style portrait photograph of the operator (JPG / PNG).
                The photograph will appear in the printed report header, qualification certificate, and ID card dossier.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photograph</span>
              </button>

              {state.operatorPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Section A: Project Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#E8700A]" />
          <span>Project &amp; Specification Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Report Number
            </label>
            <input
              type="text"
              value={state.repNo || 'Auto-generated on Save / Validate'}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-[#E8700A] cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Report Date
            </label>
            <input
              type="date"
              value={state.repDate}
              onChange={(e) => onChange('repDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Number / Ref
            </label>
            <input
              type="text"
              value={state.projectNo}
              onChange={(e) => onChange('projectNo', e.target.value)}
              placeholder="e.g. NFS-Q-2026"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Project Name
            </label>
            <input
              type="text"
              value={state.projectName}
              onChange={(e) => onChange('projectName', e.target.value)}
              placeholder="e.g. NFS Qatar Gas Complex Expansion"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Client / Asset Owner
            </label>
            <input
              type="text"
              value={state.client}
              onChange={(e) => onChange('client', e.target.value)}
              placeholder="e.g. QatarEnergy LNG"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              EPC Main Contractor
            </label>
            <input
              type="text"
              value={state.epcContractor}
              onChange={(e) => onChange('epcContractor', e.target.value)}
              placeholder="e.g. CTJV"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Painting / Coating Contractor
            </label>
            <input
              type="text"
              value={state.contractor}
              onChange={(e) => onChange('contractor', e.target.value)}
              placeholder="e.g. BG Industrial Coatings W.L.L."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Work Location / Yard
            </label>
            <input
              type="text"
              value={state.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g. Ras Laffan Yard Bay 4"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Governing Standards
            </label>
            <input
              type="text"
              value={state.referenceStandard}
              onChange={(e) => onChange('referenceStandard', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Specified Protective Coating System
            </label>
            <input
              type="text"
              value={state.coatingSystem}
              onChange={(e) => onChange('coatingSystem', e.target.value)}
              placeholder="e.g. Zinc Ethyl Silicate + Epoxy + Polyurethane"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

        </div>
      </div>

      {/* Section B: Operator / Blaster Identification */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-[#E8700A]" />
          <span>Operator / Blaster Identification</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              required
              value={state.operatorName}
              onChange={(e) => onChange('operatorName', e.target.value)}
              placeholder="e.g. Rajesh M. Patel"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Trade Category
            </label>
            <select
              value={state.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            >
              <option>Blaster</option>
              <option>Painter</option>
              <option>Spray Operator</option>
              <option>Roller/Brush Operator</option>
              <option>Coating Inspector</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Civil ID / Passport No.
            </label>
            <input
              type="text"
              value={state.civilId}
              onChange={(e) => onChange('civilId', e.target.value)}
              placeholder="e.g. 284051209341"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nationality
            </label>
            <input
              type="text"
              value={state.nationality}
              onChange={(e) => onChange('nationality', e.target.value)}
              placeholder="e.g. INDIAN / FILIPINO / NEPALI"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date of Birth
            </label>
            <input
              type="date"
              value={state.dob}
              onChange={(e) => onChange('dob', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Relevant Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={state.experienceYears}
              onChange={(e) => onChange('experienceYears', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Direct Employer
            </label>
            <input
              type="text"
              value={state.employer}
              onChange={(e) => onChange('employer', e.target.value)}
              placeholder="e.g. BG Industrial Coatings W.L.L."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Qualification Card / Certificate No.
            </label>
            <input
              type="text"
              value={state.qualificationCardNo}
              onChange={(e) => onChange('qualificationCardNo', e.target.value)}
              placeholder="e.g. BG-QC-BL-2026-084"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Next Re-Assessment Due Date
            </label>
            <input
              type="date"
              value={state.nextAssessmentDate}
              onChange={(e) => onChange('nextAssessmentDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E8700A] focus:outline-hidden"
            />
          </div>

        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => onNavigate('train')}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#E8700A] hover:bg-[#F5911F] text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <span>Proceed to 02. Training &amp; Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
