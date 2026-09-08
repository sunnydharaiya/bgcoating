import React from 'react';

export default function MetricCard({ title, value, unit, subtitle, accentColor = 'amber', icon: Icon }) {
  return (
    <div className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(20,24,32,0.06)] hover:shadow-md transition-all space-y-2 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4E5B6A] block">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-[#FFF4E3] text-[#E87B1E] flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-extrabold text-[#1B222C] font-rajdhani">
          {value}
        </span>
        {unit && <span className="text-[#E87B1E] font-bold text-xs font-mono">{unit}</span>}
      </div>
      {subtitle && <p className="text-[11px] text-[#7E8B99] leading-tight">{subtitle}</p>}
    </div>
  );
}
