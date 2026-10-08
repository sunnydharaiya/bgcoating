import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  User, 
  Building2, 
  Phone, 
  Award, 
  Sliders, 
  Crown, 
  Check, 
  Camera, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { addToast } = useToast();

  const [profile, setProfile] = useState({
    name: 'Prakash Ramavat',
    email: 'inquiry.bggroup@gmail.com',
    mobile: '9925810408',
    countryCode: '+91',
    designation: 'Senior Coating Inspector & Consultant',
    department: 'QA / QC & Protective Coatings',
    empId: 'BG-1042',
    username: 'p.ramavat',
    doj: '2020-01-15',
    role: 'Coating Inspector',
    company: 'BG Group of Paint & Coating Consultants',
    bu: 'Industrial & Marine Protective Coatings',
    officeLocation: 'Surat, Gujarat',
    branch: 'West Zone',
    website: 'https://bgcoating.com',
    altMobile: '+91 98765 43210',
    altEmail: 'consultant@bgcoating.com',
    address: 'Akash Echo Point, E103, Bhimrad',
    city: 'Surat',
    state: 'Gujarat',
    country: 'India',
    zip: '395007',
    experienceYears: 16,
    discipline: 'Corrosion / Materials',
    expertise: 'TSA Thermal Spray, FBE, Internal Tank Linings, Epoxy Intumescent PFP',
    defaultDashboard: 'coating-calculator',
    unitSystem: 'Metric (SI)',
    language: 'English',
    theme: 'Light',
    timeZone: 'Asia/Kolkata (GMT+5:30)',
    dateFormat: 'DD/MM/YYYY'
  });

  const [certs, setCerts] = useState(['AMPP', 'NACE', 'FROSIO', 'BGAS']);
  const [preferredStandards, setPreferredStandards] = useState(['ISO', 'ASTM', 'SSPC', 'NACE']);
  const [saved, setSaved] = useState(false);

  const toggleCert = (cert) => {
    setCerts(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const toggleStandard = (std) => {
    setPreferredStandards(prev => 
      prev.includes(std) ? prev.filter(s => s !== std) : [...prev, std]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    addToast('Profile Updated', 'All workspace settings and preferences saved successfully.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Module 05 · Profile &amp; Preferences
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Professional Profile &amp; Settings
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Personalize your professional identity, measurement units, standards preferences, and consultant credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Identity Strip Card matching reference */}
        <div className="bg-white border border-[#D8DEE5] rounded-2xl p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col sm:flex-row items-start gap-6">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] text-white font-black text-2xl flex items-center justify-center shadow-md font-mono">
              {profile.name.charAt(0)}
            </div>
            <button
              type="button"
              className="px-3 py-1.5 bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#F7941D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Work Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#F7941D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.countryCode}
                  onChange={e => setProfile({ ...profile, countryCode: e.target.value })}
                  className="w-16 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-center text-slate-900 outline-none"
                />
                <input
                  type="tel"
                  required
                  value={profile.mobile}
                  onChange={e => setProfile({ ...profile, mobile: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#F7941D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role / Access Level</label>
              <select
                value={profile.role}
                onChange={e => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#F7941D] outline-none"
              >
                <option>Coating Inspector</option>
                <option>QA/QC Engineer</option>
                <option>Corrosion Consultant</option>
                <option>Estimator / Planner</option>
                <option>Project Manager</option>
                <option>Asset Owner</option>
                <option>Contractor</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Collapsible Details Sections */}
        <div className="space-y-4">
          
          {/* Section: Personal & Company Details */}
          <details open className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xs open:ring-1 open:ring-slate-300">
            <summary className="font-extrabold text-sm text-slate-900 cursor-pointer flex items-center justify-between list-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-[#F7941D]">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Company &amp; Organization Details</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={e => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Unit</label>
                <input
                  type="text"
                  value={profile.bu}
                  onChange={e => setProfile({ ...profile, bu: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Office Location</label>
                <input
                  type="text"
                  value={profile.officeLocation}
                  onChange={e => setProfile({ ...profile, officeLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                <input
                  type="text"
                  value={profile.website}
                  onChange={e => setProfile({ ...profile, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </details>

          {/* Section: Professional Certifications & Standards */}
          <details open className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xs open:ring-1 open:ring-slate-300">
            <summary className="font-extrabold text-sm text-slate-900 cursor-pointer flex items-center justify-between list-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Award className="w-4 h-4" />
                </div>
                <span>Professional Qualifications &amp; Preferred Standards</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>

            <div className="space-y-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Professional Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {['AMPP', 'NACE', 'FROSIO', 'BGAS', 'ICorr', 'API', 'CSWIP'].map(cert => {
                    const isSelected = certs.includes(cert);
                    return (
                      <button
                        type="button"
                        key={cert}
                        onClick={() => toggleCert(cert)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                          isSelected 
                            ? 'bg-[#F7941D] text-slate-950 shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Preferred Standards Frameworks</label>
                <div className="flex flex-wrap gap-2">
                  {['ISO', 'ASTM', 'SSPC', 'NACE', 'ASME', 'API', 'NORSOK'].map(std => {
                    const isSelected = preferredStandards.includes(std);
                    return (
                      <button
                        type="button"
                        key={std}
                        onClick={() => toggleStandard(std)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                          isSelected 
                            ? 'bg-slate-900 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{std}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>

          {/* Section: Workspace Unit Preferences */}
          <details open className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xs open:ring-1 open:ring-slate-300">
            <summary className="font-extrabold text-sm text-slate-900 cursor-pointer flex items-center justify-between list-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                  <Sliders className="w-4 h-4" />
                </div>
                <span>Workspace Unit System &amp; Defaults</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit System</label>
                <select
                  value={profile.unitSystem}
                  onChange={e => setProfile({ ...profile, unitSystem: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                >
                  <option>Metric (SI) — m², Liters, µm, kg</option>
                  <option>Imperial (US) — sq ft, Gallons, Mils, Lbs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Zone</label>
                <input
                  type="text"
                  value={profile.timeZone}
                  onChange={e => setProfile({ ...profile, timeZone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date Format</label>
                <select
                  value={profile.dateFormat}
                  onChange={e => setProfile({ ...profile, dateFormat: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                >
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </details>

        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D8DEE5]">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 text-white font-bold font-rajdhani uppercase tracking-wider rounded-xl text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Sign out of your BG CoatingOS workspace?')) {
                  localStorage.removeItem('bg_auth_logged_in');
                  window.dispatchEvent(new CustomEvent('bg_logout'));
                }
              }}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold font-rajdhani uppercase tracking-wider rounded-xl text-xs transition shadow-2xs flex items-center gap-2 cursor-pointer"
              title="Sign out and return to Login portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>

          {saved && (
            <span className="text-xs font-bold text-[#2E7D32] font-mono flex items-center gap-1">
              <Check className="w-4 h-4" /> All preferences saved locally
            </span>
          )}
        </div>

      </form>

    </div>
  );
}
