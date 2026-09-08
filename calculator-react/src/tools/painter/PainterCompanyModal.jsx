// src/tools/painter/PainterCompanyModal.jsx
import React, { useRef } from 'react';
import { X, Building2, Upload, Trash2, Check, Sparkles } from 'lucide-react';

export default function PainterCompanyModal({
  isOpen,
  onClose,
  company,
  onChange
}) {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange('logo', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2A3340] to-[#1E2530] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#E87B1E]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider font-rajdhani">
                Company Details &amp; Technical Branding
              </h3>
              <p className="text-[11px] text-slate-300">
                Customise corporate header, logo, and contact info in A4 Print Dossiers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Logo Upload Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Company Logo (Replaces default BG emblem in print output)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {company?.logo ? (
                  <img src={company.logo} alt="Company Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image</span>
                </button>
                {company?.logo && (
                  <button
                    type="button"
                    onClick={() => onChange('logo', null)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Logo</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Company / Consultancy Name
            </label>
            <input
              type="text"
              value={company?.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none font-bold"
              placeholder="e.g. BG Group of Paint & Coating Consultant"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={company?.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="e.g. Corrosion Management · Surface Treatment · Coating Engineering Destination"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={company?.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
                placeholder="support@bgcoating.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Website
              </label>
              <input
                type="text"
                value={company?.web || ''}
                onChange={(e) => onChange('web', e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
                placeholder="www.bgcoating.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Contact Phone / Helpline
            </label>
            <input
              type="text"
              value={company?.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:border-[#E87B1E] outline-none"
              placeholder="+91 99258 10408"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#E87B1E] hover:bg-[#F39322] transition shadow cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save &amp; Apply Branding</span>
          </button>
        </div>

      </div>
    </div>
  );
}
