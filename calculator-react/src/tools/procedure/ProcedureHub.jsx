import React from 'react';
import { PROC_PRESETS } from '../../data/procedureDatabase';

export default function ProcedureHub({ state, onNavigate, onApplyPreset, onReset }) {
  const sections = [
    { id: 'cover-revision', num: '01', title: 'Cover Sheet & Revision Control', desc: 'Procedure identity, project names, signatories & revision history' },
    { id: 'scope', num: '02', title: 'Scope of Work', desc: 'Project purpose, substrates, shop vs field application limits' },
    { id: 'reference-docs', num: '03', title: 'Project Reference Documents', desc: 'Client painting specs, ITPs, datasheets & quality plans' },
    { id: 'standards', num: '04', title: 'Reference Coating Standards', desc: 'ISO, ASTM, SSPC/AMPP, NACE & OSHA engineering codes' },
    { id: 'exclusions', num: '05', title: 'Blasting & Coating Exclusions', desc: 'Surfaces, components, machined faces & tags not to be coated' },
    { id: 'safety', num: '06', title: 'Safety Requirements & HSE', desc: 'Personal protective equipment, ventilation, static grounding & gas testing' },
    { id: 'surface-prep', num: '07', title: 'Surface Preparation & Inspection', desc: 'SSPC-SP1 solvent wipe, Sa 2½ / Sa 3 blast profile, soluble salts & blotter test' },
    { id: 'coating-app', num: '08', title: 'Coating Application & Curing', desc: 'Mixing ratio, stripe coating, airless spraying, WFT & DFT acceptance' },
    { id: 'repair-plan', num: '09', title: 'Repair Plan & Adhesion', desc: 'Feathering sound coating, spot blasting, recoat windows & pull-off tests' },
    { id: 'manufacturers', num: '10', title: 'Approved Paint Manufacturers', desc: 'Approved vendor product matrix across international paint brands' },
    { id: 'attachments', num: '11', title: 'Attachments & Annexures III–VIII', desc: 'Document attachments, test certificates, TDS and sketches' },
    { id: 'annexure-coating', num: 'A-I', title: 'Annexure-I: Coating Systems', desc: 'Multi-coat schedule (Primer, Midcoat, Topcoat DFT & thinners)' },
    { id: 'annexure-inspection', num: 'A-II', title: 'Annexure-II: Inspection Matrix', desc: 'Instruments, test standards, calibration & frequency schedule' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1E2530] via-[#2A1812] to-[#3A1A12] border-l-4 border-amber-500 rounded-xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Engineering Suite · Module 03
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Coating Procedure Generator</h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Professional EPC-grade Painting Procedure Specification (PPS) and Method Statement builder with multi-coat matrix, standards selector, and client-ready A4 technical dossier export.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('cover-revision')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-xs rounded-lg shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Start New Procedure →
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-lg transition"
            >
              Procedure Register
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Industry Standard Presets */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <span className="text-amber-500 text-base">⚡</span> 1-Click Industry Standard Procedure Presets
            </h3>
            <p className="text-xs text-gray-500">Instantly populate complete procedure parameters, standards, coating systems, and inspection criteria.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PROC_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              className="border border-gray-200 hover:border-amber-500 hover:shadow-md bg-gray-50/50 hover:bg-amber-50/30 rounded-lg p-4 cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {preset.docNo}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-amber-600">Apply Preset →</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 group-hover:text-amber-700 mt-1">{preset.name}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{preset.purpose}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-400">
                <span>{preset.coatingSystems[0]?.coats.length || 3} Coats Build</span>
                <span className="font-semibold text-gray-600">{preset.coatingSystems[0]?.totalDftNom} µm DFT</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 13 Section Workflow Navigation Grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-red-700">📑</span> Procedure Specification Sections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className="border border-gray-200 hover:border-red-700 hover:shadow-sm bg-white hover:bg-red-50/20 rounded-lg p-3.5 cursor-pointer transition flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-700 to-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {sec.num}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-800 group-hover:text-red-700 truncate">{sec.title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
