import React, { useState } from 'react';
import { X, Building2, Save, Check } from 'lucide-react';

export default function UnitRateCompanyModal({ 
  isOpen, 
  onClose, 
  companyInfo = {}, 
  onSaveCompanyInfo 
}) {
  const [localInfo, setLocalInfo] = useState({
    companyName: companyInfo.companyName || 'BG COATING & CORROSION ENGINEERING',
    address: companyInfo.address || 'Industrial Zone, Marine & Offshore Division',
    email: companyInfo.email || 'commercial@bgcoating.com',
    phone: companyInfo.phone || '+91 22 8899 0011',
    website: companyInfo.website || 'www.bgcoating.com',
    taxId: companyInfo.taxId || 'GSTIN / VAT: 27AABCB1234F1Z9'
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setLocalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveCompanyInfo(localInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Company Profile &amp; Letterhead Branding (Pro)</h3>
              <p className="text-xs text-slate-400">Customizes organization credentials printed on commercial quotation sheets.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Company / Organization Legal Name</label>
            <input
              type="text"
              value={localInfo.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g. BG Coating & Corrosion Engineering"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Corporate Address / Yard Location</label>
            <input
              type="text"
              value={localInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Sector 18, Industrial Area"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official Email</label>
              <input
                type="text"
                value={localInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="commercial@bgcoating.com"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Phone / Landline</label>
              <input
                type="text"
                value={localInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 22 8899 0011"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Company Website</label>
              <input
                type="text"
                value={localInfo.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="www.bgcoating.com"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tax / VAT / GSTIN Number</label>
              <input
                type="text"
                value={localInfo.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
                placeholder="GSTIN / VAT ID"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F7941D] to-[#A50021] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition"
          >
            <Check className="w-4 h-4" />
            <span>Save Company Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
