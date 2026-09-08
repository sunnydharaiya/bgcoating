// src/tools/inspection/InspectionCompanyDetailsModal.jsx
import React, { useState } from 'react';
import { 
  Building2, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DEFAULT_BG_COMPANY = {
  name: 'BG GROUP INDUSTRIAL COATINGS LTD.',
  tagline: 'Surface Engineering, Protective Coating Inspection & QA/QC Digital Systems',
  address: 'Plot No. 44, Industrial Area, Sector-4, Gujarat, India',
  phone: '+91 98765 43210',
  email: 'qc@bgcoating.com',
  website: 'www.bgcoating.com',
  logo: null
};

export default function InspectionCompanyDetailsModal({
  isOpen,
  onClose,
  companyProfile,
  onSaveProfile
}) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState(companyProfile || DEFAULT_BG_COMPANY);

  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('Logo Too Large', 'Please upload a logo image under 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, logo: event.target.result }));
      addToast('Logo Uploaded', 'Custom corporate logo preview updated.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = () => {
    setFormData(DEFAULT_BG_COMPANY);
    addToast('Branding Reset', 'Reverted to default BG Group corporate details.', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    addToast('Branding Saved', 'Corporate header updated across all inspection dossiers.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Corporate Branding &amp; Company Details (PRO)
              </h3>
              <p className="text-xs text-slate-500">
                Customize corporate logo, company title, contact, and header for print reports.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Logo Uploader */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-300" />
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-slate-800 block">
                Company Header Logo
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition">
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {formData.logo && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                    className="px-2.5 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                PNG, JPG or SVG with transparent background recommended (Max 2MB).
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Company Name / Heading
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 font-bold text-slate-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
              Registered Office Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Official Phone / Contact
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50/50 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to BG Group Default
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Branding
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
