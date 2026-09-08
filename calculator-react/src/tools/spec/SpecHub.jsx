import React from 'react';
import { 
  FileCode2, 
  Layers, 
  Thermometer, 
  ShieldCheck, 
  Palette, 
  FlaskConical, 
  Building2, 
  History, 
  FileSpreadsheet, 
  ArrowRight, 
  BookOpen, 
  Printer, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { STANDARD_PRESETS } from '../../data/specDatabase';
import { useGuideline } from '../../context/GuidelineContext';
import { useToast } from '../../context/ToastContext';

export default function SpecHub({ onSelectSection, onApplyPreset, specData }) {
  const { openGuideline } = useGuideline();
  const { addToast } = useToast();

  const sections = [
    {
      id: 'scope',
      pill: 'A · B',
      title: 'Project Information & Scope',
      desc: 'Project No, DIN No, Client, Specification references and Company Scope Matrix (Painting, Insulation, PFP, TSA, Galvanizing, Pickling).',
      icon: Layers,
      color: 'amber'
    },
    {
      id: 'environment',
      pill: 'Section C',
      title: 'General Requirements & Corrosivity',
      desc: 'ISO 12944-2 corrosivity category (C1 to CX, Im1 to Im4), environmental conditions, cyclic service, and substrate MOC.',
      icon: ShieldCheck,
      color: 'emerald'
    },
    {
      id: 'temperatures',
      pill: 'Section D',
      title: 'Operating & Design Temperatures',
      desc: 'Component-wise temperature data, refractory lining skin temperature evaluation, and component scope assignment.',
      icon: Thermometer,
      color: 'rose'
    },
    {
      id: 'special_systems',
      pill: 'Section E',
      title: 'Special Systems (Insulation, PFP, TSA, HDG)',
      desc: 'Detailed specifications for thermal insulation, passive fire protection, metallizing (TSA), galvanizing, and chemical pickling.',
      icon: FlaskConical,
      color: 'indigo'
    },
    {
      id: 'coating_design',
      pill: 'Section F',
      title: 'Coating System Design & Multi-Coat Build',
      desc: 'Surface preparation standard, blast profile (Rz), Primer/Intermediate/Finish DFTs, surface areas, and live paint volume takeoff.',
      icon: Palette,
      color: 'sky'
    },
    {
      id: 'testing_qc',
      pill: 'Section G',
      title: 'Paint Testing & QC Requirements',
      desc: 'Laboratory testing requirements, batch test certificates (TC), applicable test standards, and annexure attachments.',
      icon: FlaskConical,
      color: 'amber'
    },
    {
      id: 'manufacturers',
      pill: 'Section H',
      title: 'Approved Paint Manufacturers Matrix',
      desc: 'Auto-linked manufacturer product matrix across AkzoNobel, Jotun, Asian Paints/PPG, Carboline, Hempel, Sigma/PPG, and specialized comments.',
      icon: Building2,
      color: 'violet'
    },
    {
      id: 'revisions_notes',
      pill: 'Section I · N',
      title: 'Revision History & General Notes',
      desc: 'Formal revision log (Prepared/Reviewed/Approved), site deviations, contractual instructions, and technical notes.',
      icon: History,
      color: 'slate'
    },
    {
      id: 'report',
      pill: 'Dossier',
      title: 'Executive Specification Dossier',
      desc: 'Comprehensive printable engineering report, compliance evaluation, automated risk analysis, and official sign-off certificate.',
      icon: FileSpreadsheet,
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-[#D97706] border border-amber-200 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Module 02
            </span>
            <span className="text-xs font-mono text-slate-400">BG CoatingOS™ Engineering Standard</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Coating Specification Reading &amp; System Design
          </h1>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
            Standardized engineering input collection, multi-coat build design, approved manufacturer matching, and automated MNC-grade printable specification dossier generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => openGuideline('spec_reading')}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Specification Guideline</span>
          </button>
          <button
            onClick={() => onSelectSection('report')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F7941D] to-[#A50021] hover:from-[#E8700A] hover:to-[#8B0018] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>View Full Report Dossier</span>
          </button>
        </div>
      </div>

      {/* 9 Modular Sections Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            📋 Specification Design Sections (9 Interactive Modules)
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Click any section to edit parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className="bg-white border border-slate-200 hover:border-[#F7941D] hover:shadow-md p-5 rounded-3xl transition group cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold font-mono uppercase tracking-wider group-hover:bg-amber-100 group-hover:text-[#D97706] transition">
                      {sec.pill}
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F7941D] border border-amber-100 group-hover:scale-110 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#F7941D] transition">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#F7941D]">
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Presets Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F7941D]" />
              <span>Standard Specification Templates (1-Click Auto-Load)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Load internationally recognized specification build schedules into your draft with one click.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#D97706] bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            Quick Presets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STANDARD_PRESETS.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-slate-50 hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 rounded-2xl transition flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-wider block">
                  {p.env} Environment
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{p.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-3 font-mono">{p.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onApplyPreset(p);
                  addToast('Preset Applied', `Loaded ${p.title} into coating system design.`, 'success');
                }}
                className="w-full py-2 px-3 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-300 hover:border-slate-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Apply Preset</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
