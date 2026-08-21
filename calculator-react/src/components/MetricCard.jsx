import React from 'react';

export default function MetricCard({ title, value, unit, subtitle, accentColor = 'amber' }) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
      <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">{title}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white">{value}</span>
        {unit && <span className="text-amber-400 font-bold text-sm">{unit}</span>}
      </div>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
