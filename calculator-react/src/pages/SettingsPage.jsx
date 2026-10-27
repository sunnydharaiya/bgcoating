import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  MapPin,
  Briefcase,
  FileCheck2,
  Globe,
  Upload,
  Trash2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { fetchUserProfile, updateUserProfile, getStoredUser, uploadAvatar, clearAuth } from '../utils/api';

const AVATAR_PRESETS = [
  { label: 'QA Inspector', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { label: 'Corrosion Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { label: 'Coatings Specialist', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { label: 'Safety Officer', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
];

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
    dateFormat: 'DD/MM/YYYY',
    authProvider: 'email',
    avatarUrl: '',
  });

  const [certs, setCerts] = useState(['AMPP', 'NACE', 'FROSIO', 'BGAS']);
  const [preferredStandards, setPreferredStandards] = useState(['ISO', 'ASTM', 'SSPC', 'NACE']);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Avatar Management State
  const fileInputRef = useRef(null);
  const [avatarDrawerOpen, setAvatarDrawerOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Fetch current user profile from Django REST backend
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          const prof = userData.profile || {};
          setProfile(prev => ({
            ...prev,
            name: userData.full_name || userData.username || prev.name,
            email: userData.email || prev.email,
            mobile: prof.mobile || prev.mobile,
            countryCode: prof.country_code || prev.countryCode,
            designation: prof.designation || prev.designation,
            department: prof.department || prev.department,
            empId: prof.emp_id || prev.empId,
            username: userData.username || prev.username,
            role: prof.role || prev.role,
            company: prof.company || prev.company,
            bu: prof.bu || prev.bu,
            officeLocation: prof.office_location || prev.officeLocation,
            branch: prof.branch || prev.branch,
            website: prof.website || prev.website,
            altMobile: prof.alt_mobile || prev.altMobile,
            altEmail: prof.alt_email || prev.altEmail,
            address: prof.address || prev.address,
            city: prof.city || prev.city,
            state: prof.state || prev.state,
            country: prof.country || prev.country,
            zip: prof.zip_code || prev.zip,
            experienceYears: prof.experience_years !== undefined ? prof.experience_years : prev.experienceYears,
            discipline: prof.discipline || prev.discipline,
            expertise: prof.expertise || prev.expertise,
            defaultDashboard: prof.default_dashboard || prev.defaultDashboard,
            unitSystem: prof.unit_system || prev.unitSystem,
            language: prof.language || prev.language,
            theme: prof.theme || prev.theme,
            timeZone: prof.time_zone || prev.timeZone,
            dateFormat: prof.date_format || prev.dateFormat,
            authProvider: prof.auth_provider || prev.authProvider,
            avatarUrl: prof.avatar_url || userData.avatar || prev.avatarUrl,
          }));

          if (Array.isArray(prof.certifications) && prof.certifications.length > 0) {
            setCerts(prof.certifications);
          }
          if (Array.isArray(prof.preferred_standards) && prof.preferred_standards.length > 0) {
            setPreferredStandards(prof.preferred_standards);
          }
        }
      } catch (err) {
        // Fallback to locally stored user
        const stored = getStoredUser();
        if (stored) {
          setProfile(prev => ({
            ...prev,
            name: stored.name || prev.name,
            email: stored.email || prev.email,
            role: stored.role || prev.role,
            company: stored.company || prev.company,
            authProvider: stored.provider || prev.authProvider,
            avatarUrl: stored.avatar || stored.avatar_url || stored.profile?.avatar_url || prev.avatarUrl,
            ...(stored.profile || {})
          }));
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

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

  // Avatar Management Actions
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large', 'Please select an image smaller than 5MB.', 'error');
      return;
    }
    setAvatarLoading(true);
    try {
      const res = await uploadAvatar(file);
      setProfile(prev => ({ ...prev, avatarUrl: res.avatar_url }));
      addToast('Avatar Updated', 'Profile photo uploaded successfully.', 'success');
      setAvatarDrawerOpen(false);
      window.dispatchEvent(new CustomEvent('bg_user_updated'));
    } catch (err) {
      addToast('Upload Failed', err.message, 'error');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = async (url) => {
    setAvatarLoading(true);
    try {
      const res = await uploadAvatar(url);
      setProfile(prev => ({ ...prev, avatarUrl: res.avatar_url }));
      addToast('Avatar Updated', 'Preset avatar selected.', 'success');
      setAvatarDrawerOpen(false);
      window.dispatchEvent(new CustomEvent('bg_user_updated'));
    } catch (err) {
      addToast('Update Failed', err.message, 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleApplyCustomUrl = async () => {
    if (!customAvatarUrl.trim()) return;
    setAvatarLoading(true);
    try {
      const res = await uploadAvatar(customAvatarUrl.trim());
      setProfile(prev => ({ ...prev, avatarUrl: res.avatar_url }));
      addToast('Avatar Updated', 'Custom avatar image URL saved.', 'success');
      setAvatarDrawerOpen(false);
      setCustomAvatarUrl('');
      window.dispatchEvent(new CustomEvent('bg_user_updated'));
    } catch (err) {
      addToast('Update Failed', err.message, 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    try {
      await uploadAvatar(null, 'remove');
      setProfile(prev => ({ ...prev, avatarUrl: '' }));
      addToast('Avatar Removed', 'Reverted back to name initial.', 'success');
      setAvatarDrawerOpen(false);
      window.dispatchEvent(new CustomEvent('bg_user_updated'));
    } catch (err) {
      addToast('Action Failed', err.message, 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Submit profile updates to Django REST backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        country_code: profile.countryCode,
        designation: profile.designation,
        department: profile.department,
        emp_id: profile.empId,
        role: profile.role,
        company: profile.company,
        bu: profile.bu,
        office_location: profile.officeLocation,
        branch: profile.branch,
        website: profile.website,
        alt_mobile: profile.altMobile,
        alt_email: profile.altEmail,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        zip_code: profile.zip,
        avatar_url: profile.avatarUrl,
        experience_years: parseInt(profile.experienceYears, 10) || 0,
        discipline: profile.discipline,
        expertise: profile.expertise,
        default_dashboard: profile.defaultDashboard,
        unit_system: profile.unitSystem,
        language: profile.language,
        theme: profile.theme,
        time_zone: profile.timeZone,
        date_format: profile.dateFormat,
        certifications: certs,
        preferred_standards: preferredStandards,
      };

      await updateUserProfile(payload);
      setSaved(true);
      addToast('Profile Updated', 'All workspace settings and preferences saved to the database.', 'success');
      setTimeout(() => setSaved(false), 3000);
      window.dispatchEvent(new CustomEvent('bg_user_updated'));
    } catch (err) {
      addToast('Update Failed', err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-12 animate-in fade-in duration-200 font-sans">
      
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

        {profile.authProvider && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 font-mono">Auth:</span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
              profile.authProvider === 'google' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {profile.authProvider === 'google' ? 'Google OAuth' : 'Email / Password'}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Identity Strip Card */}
        <div className="bg-white border border-[#D8DEE5] rounded-2xl p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col sm:flex-row items-start gap-6">
          <div className="flex flex-col items-center gap-3 shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E87B1E] to-[#9E1B1E] text-white font-black text-2xl flex items-center justify-center shadow-md font-mono shrink-0">
                {(profile.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setAvatarDrawerOpen(prev => !prev)}
              disabled={avatarLoading}
              className="px-3 py-1.5 bg-[#F7F8FA] hover:bg-[#FFF4E3] text-[#4E5B6A] hover:text-[#9E1B1E] border border-[#D8DEE5] rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{avatarLoading ? 'Updating...' : 'Change Photo'}</span>
            </button>
          </div>

          <div className="flex-1 w-full space-y-4">
            {/* Avatar Selector Drawer */}
            {avatarDrawerOpen && (
              <div className="w-full bg-[#FAFBFC] border border-[#D8DEE5] rounded-xl p-4 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-[#D8DEE5] pb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#E87B1E]" />
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                      Choose Profile Photo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAvatarDrawerOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Action 1: Upload from local device */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white text-xs font-bold rounded-lg shadow-2xs hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device (PNG/JPG)</span>
                  </button>

                  {profile.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={avatarLoading}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                {/* Action 2: Professional Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    Or choose a consultant avatar:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        disabled={avatarLoading}
                        className="p-2 bg-white hover:bg-[#FFF4E3] border border-slate-200 hover:border-amber-400 rounded-xl transition flex flex-col items-center gap-1.5 text-center cursor-pointer group"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 group-hover:border-amber-500 shadow-2xs"
                        />
                        <span className="text-[10px] font-semibold text-slate-700 group-hover:text-amber-900 leading-tight">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action 3: Image URL input */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    Or paste direct image URL:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={customAvatarUrl}
                      onChange={e => setCustomAvatarUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 outline-none focus:ring-1 focus:ring-[#F7941D]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      disabled={avatarLoading || !customAvatarUrl.trim()}
                      className="px-3.5 py-2 bg-[#1B222C] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer disabled:opacity-40"
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={profile.designation}
                onChange={e => setProfile({ ...profile, designation: e.target.value })}
                placeholder="Senior Coating Inspector & Consultant"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={e => setProfile({ ...profile, department: e.target.value })}
                placeholder="QA / QC & Protective Coatings"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID / Inspector Reg No.</label>
              <input
                type="text"
                value={profile.empId}
                onChange={e => setProfile({ ...profile, empId: e.target.value })}
                placeholder="BG-1042"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

        {/* 2. Collapsible Details Sections */}
        <div className="space-y-4">
          
          {/* Section: Company & Organization Details */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
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
                  placeholder="Industrial & Marine Protective Coatings"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Office Location</label>
                <input
                  type="text"
                  value={profile.officeLocation}
                  onChange={e => setProfile({ ...profile, officeLocation: e.target.value })}
                  placeholder="Surat, Gujarat"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Zone</label>
                <input
                  type="text"
                  value={profile.branch}
                  onChange={e => setProfile({ ...profile, branch: e.target.value })}
                  placeholder="West Zone"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                <input
                  type="text"
                  value={profile.website}
                  onChange={e => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://bgcoating.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </details>

          {/* Section: Contact & Location Details */}
          <details open className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xs open:ring-1 open:ring-slate-300">
            <summary className="font-extrabold text-sm text-slate-900 cursor-pointer flex items-center justify-between list-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Contact &amp; Location Details</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alternate Mobile</label>
                <input
                  type="text"
                  value={profile.altMobile}
                  onChange={e => setProfile({ ...profile, altMobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alternate Email</label>
                <input
                  type="email"
                  value={profile.altEmail}
                  onChange={e => setProfile({ ...profile, altEmail: e.target.value })}
                  placeholder="consultant@bgcoating.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Akash Echo Point, E103, Bhimrad"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={e => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={e => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={e => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal / Zip Code</label>
                <input
                  type="text"
                  value={profile.zip}
                  onChange={e => setProfile({ ...profile, zip: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </details>

          {/* Section: Professional Qualifications & Standards */}
          <details open className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xs open:ring-1 open:ring-slate-300">
            <summary className="font-extrabold text-sm text-slate-900 cursor-pointer flex items-center justify-between list-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Award className="w-4 h-4" />
                </div>
                <span>Professional Qualifications &amp; Technical Domain</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>

            <div className="space-y-4 mt-5 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={profile.experienceYears}
                    onChange={e => setProfile({ ...profile, experienceYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Engineering Discipline</label>
                  <input
                    type="text"
                    value={profile.discipline}
                    onChange={e => setProfile({ ...profile, discipline: e.target.value })}
                    placeholder="Corrosion / Materials"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Expertise Summary</label>
                  <input
                    type="text"
                    value={profile.expertise}
                    onChange={e => setProfile({ ...profile, expertise: e.target.value })}
                    placeholder="TSA Thermal Spray, FBE, Tank Linings, PFP"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

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
                  <option>Metric (SI)</option>
                  <option>Imperial (US)</option>
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
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:opacity-90 disabled:opacity-50 text-white font-bold font-rajdhani uppercase tracking-wider rounded-xl text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Sign out of your BG CoatingOS workspace?')) {
                  clearAuth();
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
            <span className="text-xs font-bold text-[#2E7D32] font-mono flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> All preferences saved to database
            </span>
          )}
        </div>

      </form>

    </div>
  );
}
