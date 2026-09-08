import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Save, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const COMPANY_STORAGE_KEY = 'bg_company_profile';

export const DEFAULT_BG_COMPANY = {
  name: 'BG GROUP OF PAINT & COATING CONSULTANT',
  tagline: 'Surface Treatment & Coating · Specification Reading · Digital Engineering System',
  phone: '+91 99258 10408',
  email: 'info@bgcoating.com',
  website: 'www.bgcoating.com',
  address: 'Hazira Road, Surat / Mumbai, India',
  logo: null
};

export default function SpecCompanyDetailsModal({ isOpen, onClose, onSaveCompany }) {
  const { addToast } = useToast();

  const [company, setCompany] = useState(DEFAULT_BG_COMPANY);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (saved) {
        setCompany(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load company profile:', e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCompany(prev => ({ ...prev, logo: reader.result }));
      addToast('Logo Uploaded', 'Custom company logo loaded for report headers.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCompany(prev => ({ ...prev, logo: null }));
  };

  const handleSave = () => {
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));
    if (onSaveCompany) onSaveCompany(company);
    addToast('Company Details Saved', 'Custom company branding will be applied to Preview & Print reports.', 'success');
    onClose();
  };

  const handleResetToDefault = () => {
    setCompany(DEFAULT_BG_COMPANY);
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(DEFAULT_BG_COMPANY));
    if (onSaveCompany) onSaveCompany(DEFAULT_BG_COMPANY);
    addToast('Reset to Default', 'Restored BG Group default branding.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-[#F7941D] border border-amber-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Company Details &amp; Report Branding
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-wider">
                  ★ Pro Feature
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Branding details that appear in generated Preview &amp; Print reports.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <p>
              Your custom company details appear <b>in the Preview &amp; Print reports</b>. BG CoatingOS™ branding remains across the software UI. Leave blank or reset to restore default BG Group header.
            </p>
          </div>

          {/* Logo Upload Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
              {company.logo ? (
                <img src={company.logo} alt="Company Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-[10px] font-mono text-slate-400 text-center px-2">No Custom Logo</span>
              )}
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-800 block">Custom Company Logo</span>
              <p className="text-[11px] text-slate-400 font-sans">
                PNG / JPG with transparent or white background. Replaces default logo mark in report header.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {company.logo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Company Name</label>
              <input
                type="text"
                value={company.name}
                onChange={e => setCompany({ ...company, name: e.target.value })}
                placeholder="e.g. ABC Engineering & Inspection Services Pvt. Ltd."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Tagline / Business Scope</label>
              <input
                type="text"
                value={company.tagline}
                onChange={e => setCompany({ ...company, tagline: e.target.value })}
                placeholder="e.g. Corrosion Prevention · Surface Treatment · Third-Party Inspection"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={company.phone}
                onChange={e => setCompany({ ...company, phone: e.target.value })}
                placeholder="e.g. +91 99258 10408"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={company.email}
                onChange={e => setCompany({ ...company, email: e.target.value })}
                placeholder="e.g. contact@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Website</label>
              <input
                type="text"
                value={company.website}
                onChange={e => setCompany({ ...company, website: e.target.value })}
                placeholder="e.g. www.company.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Address / Headquarters</label>
              <input
                type="text"
                value={company.address}
                onChange={e => setCompany({ ...company, address: e.target.value })}
                placeholder="e.g. Mumbai / Houston / Dubai"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to BG Group</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Details</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
