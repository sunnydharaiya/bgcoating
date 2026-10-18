import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Bookmark,
  Award
} from 'lucide-react';

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Standards' },
    { id: 'surface_prep', label: 'Surface Preparation' },
    { id: 'coating_systems', label: 'Paint Systems & ISO 12944' },
    { id: 'qa_inspection', label: 'QA/QC & Inspection' },
    { id: 'safety', label: 'Safety & Environment' }
  ];

  const standardsList = [
    { 
      code: 'ISO 12944-5:2018', 
      cat: 'coating_systems',
      title: 'Paints and Varnishes — Corrosion Protection of Steel Structures by Protective Paint Systems', 
      desc: 'Global benchmark standard defining environmental corrosivity classifications (C1 to CX, Im1 to Im4) and durability life regimes (Low, Medium, High, Very High >25 years).',
      tags: ['ISO 12944', 'Corrosivity', 'Durability', 'Paint Systems']
    },
    { 
      code: 'ISO 8501-1:2007', 
      cat: 'surface_prep',
      title: 'Preparation of Steel Substrates Before Application of Paints — Visual Assessment of Surface Cleanliness', 
      desc: 'Standard visual pictorial standards for initial rust grades (A, B, C, D) and blast-cleaning grades (Sa 1, Sa 2, Sa 2.5, Sa 3, St 2, St 3).',
      tags: ['ISO 8501', 'Sa 2.5', 'Sa 3.0', 'Visual Blast']
    },
    { 
      code: 'SSPC-PA 2 / AMPP', 
      cat: 'qa_inspection',
      title: 'Procedure for Determining Conformance to Dry Coating Thickness Requirements', 
      desc: 'Gage calibration protocols, spot measurement definitions (5 spots per 10 m² area), and 80/120% acceptance tolerance rules across 5 restriction levels.',
      tags: ['SSPC-PA 2', 'DFT', 'Magnetic Gage', 'AMPP']
    },
    { 
      code: 'ISO 19840:2012', 
      cat: 'qa_inspection',
      title: 'Measurement and Acceptance Criteria for DFT on Rough Blast-Cleaned Surfaces', 
      desc: 'Defines nominal thickness (NDFT), profile Correction Values (CV: 10, 25, 40 µm subtraction), and the 80/20 non-destructive measurement rule.',
      tags: ['ISO 19840', 'NDFT', 'Correction Value CV', '80/20 Rule']
    },
    { 
      code: 'ISO 8502-9 / 8502-6', 
      cat: 'surface_prep',
      title: 'Field Method for the Conductometric Determination of Water-Soluble Salts (Bresle Method)', 
      desc: 'Extraction of non-visible soluble chloride and sulfate surface salts using flexible adhesive Bresle patches with temperature conductivity correction factor.',
      tags: ['Bresle Method', 'Salt Contamination', 'Conductivity', 'mg/m²']
    },
    { 
      code: 'NACE SP0188 / ASTM G62', 
      cat: 'qa_inspection',
      title: 'Discontinuity (Holiday) Testing of New Protective Coatings on Conductive Substrates', 
      desc: 'High-voltage spark and low-voltage wet-sponge dielectric pinhole inspection rules for tanks, pipelines, and submerged structures.',
      tags: ['Holiday Test', 'NACE SP0188', 'Spark Voltage', 'ASTM G62']
    },
    { 
      code: 'ASTM D4541 / ISO 4624', 
      cat: 'qa_inspection',
      title: 'Standard Test Method for Pull-Off Strength of Coatings Using Portable Adhesion Testers', 
      desc: 'Tensile dolly adhesion pull-off testing (hydraulic / mechanical) assessing cohesive and adhesive interfacial failure modes (MPa / psi).',
      tags: ['Adhesion', 'Pull-Off', 'ASTM D4541', 'Dolly Test']
    },
    { 
      code: 'ISO 2063:2015', 
      cat: 'coating_systems',
      title: 'Thermal Spraying — Metallic and Other Inorganic Coatings — Zinc, Aluminium and Their Alloys', 
      desc: 'Engineering standards for Twin-Wire Arc Spray (TWAS) pure Aluminium (Al 99.5%) and Zinc-Aluminium (85:15) thermal spray coatings.',
      tags: ['TSA', 'Thermal Spray', 'ISO 2063', 'Aluminium']
    }
  ];

  const filtered = standardsList.filter(s => {
    const matchCat = activeCategory === 'all' || s.cat === activeCategory;
    const matchSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 w-full pb-12 animate-in fade-in duration-200 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              Module 03 · Knowledge Base
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Coating Standards &amp; Technical Reference Library
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Official ISO, AMPP / NACE, SSPC, ASTM, and NORSOK coating frameworks, surface preparation rules, and inspection benchmarks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search standards (e.g. ISO 12944)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-[#FFF9EE] border border-[#E6B878] text-[#8B3A00] placeholder-[#8B3A00]/50 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E87B1E]"
          />
        </div>
      </div>

      {/* External Portal Links matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href="https://bgcoating.com/#blog" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] hover:shadow-md p-5 rounded-2xl shadow-[0_2px_8px_rgba(20,24,32,0.06)] transition group space-y-2"
        >
          <div className="p-2.5 rounded-xl bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] w-fit group-hover:scale-105 transition">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wider group-hover:text-[#E87B1E] transition">Coating Articles &amp; Insights</h3>
          <p className="text-xs text-[#7E8B99] leading-relaxed">Technical articles on surface preparation, coating systems, and field inspection practices from the BG blog.</p>
          <span className="text-xs font-bold text-[#E87B1E] flex items-center gap-1 pt-1 font-mono">
            Read on bgcoating.com <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </a>

        <a 
          href="https://bgcoating.com/#standards" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] hover:shadow-md p-5 rounded-2xl shadow-[0_2px_8px_rgba(20,24,32,0.06)] transition group space-y-2"
        >
          <div className="p-2.5 rounded-xl bg-[#EAF6EB] text-[#2E7D32] border border-[#84C98A] w-fit group-hover:scale-105 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wider group-hover:text-[#2E7D32] transition">Standards We Work To</h3>
          <p className="text-xs text-[#7E8B99] leading-relaxed">How AMPP, NACE, SSPC, ASTM, and ISO frameworks shape our procedures and this platform's calculation engines.</p>
          <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 pt-1 font-mono">
            View Standards <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </a>

        <a 
          href="https://bgcoating.com/#services" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white border border-[#D8DEE5] hover:border-[#F3D2A0] hover:shadow-md p-5 rounded-2xl shadow-[0_2px_8px_rgba(20,24,32,0.06)] transition group space-y-2"
        >
          <div className="p-2.5 rounded-xl bg-[#F0F4F8] text-[#1B222C] border border-[#D8DEE5] w-fit group-hover:scale-105 transition">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wider group-hover:text-[#9E1B1E] transition">BG Group Services</h3>
          <p className="text-xs text-[#7E8B99] leading-relaxed">Consultancy, inspection, third-party QA/QC audits, and applicator qualification services behind the platform.</p>
          <span className="text-xs font-bold text-[#9E1B1E] flex items-center gap-1 pt-1 font-mono">
            Explore Services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </a>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                : 'bg-white text-[#4E5B6A] hover:bg-[#F7F8FA] border border-[#D8DEE5]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Standards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-[#D8DEE5] rounded-2xl p-5 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-3 hover:border-[#F3D2A0] transition"
          >
            <div className="flex items-center justify-between">
              <span className="bg-[#FFF4E3] text-[#E87B1E] font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border border-[#F3D2A0]">
                {s.code}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            </div>

            <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani leading-snug">{s.title}</h3>
            <p className="text-xs text-[#7E8B99] leading-relaxed font-sans">{s.desc}</p>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#E6E8EC]">
              {s.tags.map((t, ti) => (
                <span key={ti} className="bg-[#F7F8FA] text-[#4E5B6A] text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border border-[#D8DEE5]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
