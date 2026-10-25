import React, { useRef } from 'react';
import { X, Building2, Upload, Trash2, Save } from 'lucide-react';

export default function BlasterCompanyModal({
  isOpen,
  onClose,
  company,
  onChange
}) {
  if (!isOpen) return null;
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#E8700A]/10 text-[#E8700A]">
              <Building2 className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Corporate Branding &amp; Logo Settings
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase">Company Name</label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. BG Industrial Coatings W.L.L."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase">Division / Department</label>
            <input
              type="text"
              value={company.division}
              onChange={(e) => onChange('division', e.target.value)}
              placeholder="e.g. Quality Assurance & Technical Services"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase">Contact / Address Info</label>
            <input
              type="text"
              value={company.contact}
              onChange={(e) => onChange('contact', e.target.value)}
              placeholder="e.g. Tel: +974 4400 0000 | qc@bgcoating.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          {/* Logo Upload Box */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase">Company Logo (Printed in Header)</label>
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
              {company.logo ? (
                <img src={company.logo} alt="Logo" className="h-10 max-w-[140px] object-contain" />
              ) : (
                <span className="text-slate-400 text-xs italic">Default BG Coating logo</span>
              )}

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#E8700A] text-white text-xs font-bold hover:bg-[#F5911F] cursor-pointer"
                >
                  Upload Logo
                </button>
                {company.logo && (
                  <button
                    type="button"
                    onClick={() => onChange('logo', '')}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E8700A] text-white text-xs font-bold hover:bg-[#F5911F] cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
