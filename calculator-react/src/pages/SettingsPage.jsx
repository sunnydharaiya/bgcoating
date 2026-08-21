import React, { useState } from 'react';
import { Settings, Save, User, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Prakash Ramavat',
    email: 'inquiry.bggroup@gmail.com',
    company: 'BG Group Of Paint & Coating Consultant',
    unitSystem: 'metric',
    defaultLossPct: 30
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 flex items-center gap-4">
        <div className="bg-[#F7941D]/20 text-[#F7941D] p-3 rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Consultant Profile & Workspace Preferences</h2>
          <p className="text-xs text-slate-400">Configure default unit system, calculation loss defaults, and consultant profile.</p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 p-3 rounded-xl text-xs font-mono">
          ✓ Preferences saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name:</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address:</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Company / Organization:</label>
            <input
              type="text"
              value={profile.company}
              onChange={e => setProfile({ ...profile, company: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Default Unit System:</label>
            <select
              value={profile.unitSystem}
              onChange={e => setProfile({ ...profile, unitSystem: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            >
              <option value="metric">Metric (Meters, Liters, Microns µm, kg)</option>
              <option value="imperial">Imperial (Feet, US Gallons, Mils, Lbs)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
}
