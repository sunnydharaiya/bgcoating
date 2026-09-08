import React from 'react';

export default function SubNavTabs({ tabs, activeTab, onTabChange, className = '' }) {
  return (
    <div className={`bg-white border border-[#D8DEE5] rounded-xl p-1.5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex items-center gap-1.5 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id, t.toolId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                : 'text-[#4E5B6A] hover:bg-[#F7F8FA] hover:text-[#1B222C]'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7E8B99]'}`} />}
            <span>{t.label}</span>
            {t.badge && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0]'
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
