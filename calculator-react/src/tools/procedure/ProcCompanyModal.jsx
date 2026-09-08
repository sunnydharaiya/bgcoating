import React, { useState } from 'react';

export default function ProcCompanyModal({ companyProfile, onSave, onClose }) {
  const [profile, setProfile] = useState({
    name: companyProfile?.name || 'BG COATING & CORROSION ENGINEERING',
    tagline: companyProfile?.tagline || 'Industrial Surface Protection Solutions',
    address: companyProfile?.address || 'Industrial Area Phase-II, Engineering District',
    contact: companyProfile?.contact || 'info@bgcoating.com | +91 98765 43210',
    website: companyProfile?.website || 'www.bgcoating.com',
    logo: companyProfile?.logo || ''
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile((prev) => ({ ...prev, logo: ev.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setProfile((prev) => ({ ...prev, logo: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#1E2530] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">🏢 Company Details</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
              Pro Branding
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Company / Organization Name *</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded font-bold text-gray-800 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Corporate Tagline / Subtitle</label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded text-gray-700 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Contact Email / Phone</label>
              <input
                type="text"
                value={profile.contact}
                onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-gray-700 focus:border-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Website URL</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-gray-700 focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Facility / Registered Address</label>
            <textarea
              rows="2"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded text-gray-700 focus:border-red-600 focus:outline-none"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Corporate Logo (PNG/JPG, max 2MB)</label>
            <div className="flex items-center gap-3">
              {profile.logo ? (
                <div className="relative border border-gray-300 p-1 rounded bg-gray-50">
                  <img src={profile.logo} alt="Logo" className="w-12 h-12 object-contain" />
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              )}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 rounded-lg shadow transition"
            >
              Save Company Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
