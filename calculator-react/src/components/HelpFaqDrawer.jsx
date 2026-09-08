import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  X, 
  ChevronDown, 
  Sparkles, 
  BookOpen, 
  ArrowUpRight, 
  Calculator, 
  ShieldCheck, 
  Flame, 
  Scale, 
  Coins, 
  Activity, 
  Layers 
} from 'lucide-react';

export default function HelpFaqDrawer({ isOpen, onClose, onSelectPage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = [
    'All',
    'General & Export',
    'Paint Calculations',
    'Surface Area',
    'Abrasives & Blasting',
    'QA/QC & Standards',
    'Corrosion & LCC',
    'Specialized (TSA/PFP)',
    'Procurement'
  ];

  const faqItems = [
    {
      category: 'General & Export',
      q: 'How do I export calculation reports as formatted PDFs or Excel sheets?',
      a: 'Click "Print Report" or "Copy" in the top action bar of any tool. Reports are styled with official BG Group header branding, structured engineering data tables, standard references, and timestamped audit logs ready for client submittals and QA documentation.',
      tags: ['Export', 'PDF', 'Report', 'Print'],
      toolLink: null
    },
    {
      category: 'General & Export',
      q: 'Can I use BG CoatingOS™ calculations for official contractor submittals?',
      a: 'Yes. All algorithms follow established AMPP / NACE, SSPC, ASTM, and ISO standards with full mathematical transparency. Section A project and client headers allow you to stamp each report with asset numbers, gauge serials, and inspector credentials.',
      tags: ['Submittal', 'Compliance', 'Audit', 'ISO 9001'],
      toolLink: null
    },
    {
      category: 'Paint Calculations',
      q: 'How does Volume Solids (VS%) affect paint consumption and cost?',
      a: 'Volume Solids (ASTM D2697) is the percentage of dry film remaining after solvent evaporation. A 60% VS paint yields 6.0 m²/L at 100 µm DFT theoretical, whereas an 80% VS paint yields 8.0 m²/L. Higher volume solids drastically reduces the liquid litres required, thinning demand, VOC emissions, and shipping weight.',
      tags: ['Volume Solids', 'ASTM D2697', 'Consumption', 'Coverage'],
      toolId: 'volume_solids_verify'
    },
    {
      category: 'Paint Calculations',
      q: 'What is the exact mathematical relationship between WFT, DFT, and Thinner%?',
      a: 'WFT (Wet Film Thickness) = [DFT × (100 + Thinner%)] ÷ Volume Solids%. When thinner is added on-site (e.g., 10%), the painter must measure a proportionally thicker wet film using a wet-film comb to achieve the specified dry film thickness after drying.',
      tags: ['WFT', 'DFT', 'Thinner', 'Comb'],
      toolId: 'wft_range'
    },
    {
      category: 'Paint Calculations',
      q: 'What is Blasting Dead Volume (Rz Profile Absorption)?',
      a: 'When steel is abrasive blast cleaned to Sa 2.5 / Sa 3, the surface profile creates microscopic peaks and valleys. The liquid paint required to fill the profile below the magnetic peak plane is "dead volume" (typically 0.5 × Rz in µm per m²). Our Blasting Loss tool accounts for this extra paint demand before computing regular overspray loss.',
      tags: ['Dead Volume', 'Rz', 'Surface Profile', 'Loss'],
      toolId: 'blasting_loss'
    },
    {
      category: 'Paint Calculations',
      q: 'How is Practical Coverage calculated from Theoretical Coverage?',
      a: 'Theoretical Coverage (m²/L) = (Volume Solids% × 10) ÷ DFT (µm). Practical Coverage = Theoretical Coverage × (1 - Loss Factor%). Field application loss factors range from 15% (brush/roller in shop) to 40%+ (complex pipe racks with airless spray in windy conditions).',
      tags: ['Coverage', 'Loss Factor', 'Theoretical', 'Practical'],
      toolId: 'coverage'
    },
    {
      category: 'Paint Calculations',
      q: 'How are multi-pack mixing ratios and pot life managed?',
      a: 'Two-pack and three-pack systems require strict volumetric ratios (e.g. 4:1 Base:Hardener). BG CoatingOS calculates exact component quantities, required thinner dilution (5%–15%), induction sweat-in time, and pot life limits based on ambient temperatures.',
      tags: ['Mixing Ratio', 'Pot Life', 'Hardener', 'Base'],
      toolId: 'mixing_ratio'
    },
    {
      category: 'Surface Area',
      q: 'How do I determine Pipe Surface Area per standard ASME NB/NPS?',
      a: 'External pipe area is Area (m²) = π × OD (m) × Length (m) × Quantity. BG CoatingOS incorporates a complete standard dimensional database for ASME B36.10M / B36.19M carbon and stainless steel pipes from 1/2" NB (21.3 mm OD) to 48" NB (1219 mm OD).',
      tags: ['Pipe Area', 'ASME B36.10', 'Spool', 'Diameter'],
      toolId: 'pipe_spool'
    },
    {
      category: 'Surface Area',
      q: 'What formulas are used for Dished End surface area take-offs?',
      a: 'For 2:1 Semi-Ellipsoidal heads: Area ≈ 1.084 × D². For Hemispherical heads: Area = 2πR² ≈ 1.571 × D². For ASME Torispherical / Flanged & Dished: Area ≈ 0.929 × D², where D is the vessel outer diameter.',
      tags: ['Dished End', 'Ellipsoidal', 'Torispherical', 'Head'],
      toolId: 'dished_end'
    },
    {
      category: 'Surface Area',
      q: 'How are storage tank shell, roof, and bottom plate areas calculated?',
      a: 'Shell Area = π × D × H. Cone Roof Area = (π × D / 2) × √(R² + H_cone²). Flat bottom plate incorporates the annular ring overhang. Internal floating roofs and wind girders can also be added.',
      tags: ['Storage Tank', 'Shell', 'Cone Roof', 'Bottom Plate'],
      toolId: 'tank_shell'
    },
    {
      category: 'Abrasives & Blasting',
      q: 'How does Garnet compare with Copper Slag in blasting consumption?',
      a: 'Garnet (density ~4.1 g/cm³, Mohs 7.5–8.0) is a high-productivity mineral that blasts at ~12–18 kg/m² with low dust generation and high recyclability (typically 5–6 cycles). Copper slag (density ~3.5 g/cm³, Mohs 6.5–7.0) is an expendable abrasive with higher breakdown (~28–38 kg/m²) and single-use disposal.',
      tags: ['Garnet', 'Copper Slag', 'Consumption', 'Abrasive'],
      toolId: 'garnet_copper_slag'
    },
    {
      category: 'Abrasives & Blasting',
      q: 'How is Surface Anchor Profile (Rz) predicted from nozzle pressure and grit size?',
      a: 'Anchor profile Rz depends directly on abrasive grain mesh size, nozzle blasting pressure (typically 6.5 to 7.5 bar / 90–110 psi), impingement angle, and substrate hardness. Fine mesh (80 Mesh) yields 35–55 µm, Medium (30/60 Mesh) yields 50–75 µm, and Coarse (20/40 Mesh) yields 75–100+ µm.',
      tags: ['Blast Profile', 'Rz', 'Anchor Pattern', 'Mesh Grade'],
      toolId: 'blast_profile'
    },
    {
      category: 'Abrasives & Blasting',
      q: 'How is blast room dust collector CFM capacity sized?',
      a: 'Per ACGIH industrial ventilation guidelines, dust collector exhaust airflow must maintain a minimum cross-draft velocity of 100 FPM (0.5 m/s) across the blast room cross-section, plus 60 to 100 Air Changes per Hour (ACH) for rapid operator visibility.',
      tags: ['Dust Collector', 'CFM', 'ACGIH', 'Ventilation'],
      toolId: 'dust_collector'
    },
    {
      category: 'QA/QC & Standards',
      q: 'How does the SSPC-PA 2 Acceptance Criteria work (80/120 & 80/150 rules)?',
      a: 'Under SSPC-PA 2, 5 spot measurements are taken per 10 m² area. The Average of all Spot Measurements must be ≥ Specified Target DFT. Individual spot readings must not be less than 80% of specified DFT. Under Level 3 (standard), no spot may exceed 120% of specified DFT (or 150% under Level 4).',
      tags: ['SSPC-PA 2', 'DFT Conformance', '80/120 Rule', 'Level 3'],
      toolId: 'dft_sspc_pa2'
    },
    {
      category: 'QA/QC & Standards',
      q: 'How is ISO 19840 DFT evaluation different from SSPC-PA 2?',
      a: 'ISO 19840 requires subtracting an Apparent Profile Correction Value (CV) (10 µm for fine, 25 µm for medium, 40 µm for coarse profile) from magnetic gauge readings if calibrated on smooth steel. The arithmetic mean must be ≥ NDFT, no individual reading may be < (NDFT - CV), and no reading may exceed the maximum limit.',
      tags: ['ISO 19840', 'Correction Value CV', 'NDFT', 'Inspection'],
      toolId: 'dft_iso_19840'
    },
    {
      category: 'QA/QC & Standards',
      q: 'How is Holiday Spark Testing Voltage calculated per NACE SP0188 & ASTM G62?',
      a: 'For thick film coatings (> 500 µm / 20 mils): Voltage V = 525 × √t(mils) or V = 100 × √t(µm). For thin films (≤ 500 µm), high-voltage spark testing can cause dielectric puncture; low-voltage wet-sponge testing (67.5V–90V DC) is mandated per ASTM D5162 Type I.',
      tags: ['Holiday Test', 'Spark Voltage', 'NACE SP0188', 'ASTM G62'],
      toolId: 'holiday_voltage'
    },
    {
      category: 'QA/QC & Standards',
      q: 'How does the Bresle Patch Soluble Salt Test calculate surface chloride density?',
      a: 'Per ISO 8502-9, conductivity (µS/cm) of extracted deionized water is converted into surface salt density (mg/m²): Salts = c × (γ - γ0) × (V / A), normalized to 25°C with a 2%/°C temperature coefficient. Marine specs typically mandate ≤ 50 mg/m² (IMO PSPC) or ≤ 20 mg/m² (offshore).',
      tags: ['Bresle Test', 'ISO 8502-9', 'Salt Contamination', 'Conductivity'],
      toolId: 'salt_test_tool'
    },
    {
      category: 'Corrosion & LCC',
      q: 'How is Corrosion Rate (mpy & mm/yr) and Remaining Life calculated?',
      a: 'Per API 570 / API 653: Corrosion Rate (mm/yr) = (t_initial - t_actual) ÷ Service Years. Remaining Life (Years) = (t_actual - t_minimum allowable) ÷ Corrosion Rate. This identifies exact replacement intervals before pressure containment is breached.',
      tags: ['Corrosion Rate', 'API 570', 'Remaining Life', 'Wall Thickness'],
      toolId: 'corrosion_rate'
    },
    {
      category: 'Corrosion & LCC',
      q: 'What is 25-Year Life Cycle Costing (LCC) and Net Present Value (NPV)?',
      a: 'LCC calculates total cost of ownership: NPV = Initial CapEx + ∑ [OpEx_t ÷ (1 + r)^t], discounting scheduled touch-up maintenance (e.g. Year 8) and major recoat events (e.g. Year 16) to present cash value. Premium high-durability systems frequently deliver 40%+ lifecycle savings over 25 years despite higher initial CapEx.',
      tags: ['Life Cycle Cost', 'NPV', 'LCC', 'Asset TCO'],
      toolId: 'life_cycle_cost'
    },
    {
      category: 'Specialized (TSA/PFP)',
      q: 'How is Thermal Spray Aluminium (TSA) wire demand calculated?',
      a: 'Per ISO 2063, Pure Aluminium (Al 99.5%, density 2.70 g/cm³) or Zinc-Aluminium (Zn-Al 85:15, density 5.80 g/cm³) wire mass is computed as: Theoretical Mass (kg) = Area (m²) × [DFT (µm) / 1000] × Density. Actual wire requirement accounts for Twin-Wire Arc deposition efficiency (typically 65%–75%).',
      tags: ['TSA', 'Thermal Spray', 'ISO 2063', 'Wire Arc'],
      toolId: 'tsa_wire'
    },
    {
      category: 'Specialized (TSA/PFP)',
      q: 'How is Passive Fire Protection (PFP) epoxy intumescent material sized?',
      a: 'Per UL 1709 / BS 476, target thickness (typically 6.0 mm to 14.0 mm for 60 to 120 min hydrocarbon pool fire) is multiplied by steel surface area and cured compound density (1.00–1.10 kg/L). Carbon-fiber reinforcement mesh area is computed with 15% lap allowance.',
      tags: ['PFP', 'Fireproofing', 'UL 1709', 'Intumescent'],
      toolId: 'pfp_material'
    },
    {
      category: 'Procurement',
      q: 'How does Paint Procurement Kit Matching prevent factory drum waste?',
      a: 'Industrial coatings are supplied in fixed commercial packaging (e.g., 20L base drums and 4L/5L hardener pails for 4:1 / 5:1 mix ratios). BG CoatingOS calculates exact discrete drum and pail counts, matching complete kit ratios and calculating remaining surplus volume.',
      tags: ['Procurement', 'Packaging', 'Drums', 'Tendering'],
      toolId: 'paint_procurement'
    }
  ];

  const suggestedTags = ['WFT / DFT', 'Volume Solids', 'Dead Volume', 'SSPC-PA 2', 'ISO 19840', 'Bresle Salt', 'TSA', 'PFP', 'LCC'];

  const filteredFaqs = faqItems.filter(item => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = !searchTerm || 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const handleOpenTool = (toolId) => {
    if (onSelectPage && toolId) {
      onSelectPage('coating-calculator', toolId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <aside className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-[#F7941D] border border-amber-200">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">Help &amp; Knowledge Base</h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {faqItems.length} FAQs
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">BG CoatingOS™ Engineering Q&amp;A Hub</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tag Chips */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search — WFT, Volume Solids, SSPC-PA 2, dead volume, salt test, TSA..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-[10px] whitespace-nowrap font-mono px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-[#F7941D] text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-[#D97706]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {suggestedTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag === searchTerm ? '' : tag)}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-md transition cursor-pointer ${
                  searchTerm.toLowerCase() === tag.toLowerCase()
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-[#D97706]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto opacity-40 text-[#F7941D]" />
              <p className="text-xs">No matching topics found for "{searchTerm}".</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCat('All');
                }}
                className="text-xs text-[#F7941D] font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-slate-50/70 border border-slate-200 rounded-2xl p-4 open:bg-amber-50/30 open:border-amber-200/80 transition shadow-2xs"
              >
                <summary className="flex items-start justify-between cursor-pointer list-none text-xs font-bold text-slate-800 group-open:text-[#D97706] gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                      {faq.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-open:text-amber-950 block leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition shrink-0 mt-1" />
                </summary>

                <div className="text-xs text-slate-600 mt-3 pt-2.5 border-t border-slate-200/70 leading-relaxed font-sans space-y-3">
                  <p>{faq.a}</p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1">
                      {faq.tags && faq.tags.map((t, ti) => (
                        <span key={ti} className="text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {faq.toolId && (
                      <button
                        onClick={() => handleOpenTool(faq.toolId)}
                        className="text-[11px] font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-2xs"
                      >
                        <Calculator className="w-3 h-3" />
                        <span>Launch Tool</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </details>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
            <span>NACE / AMPP Level 3 Knowledge Basis</span>
          </div>

          <button
            onClick={() => {
              if (onSelectPage) onSelectPage('support');
              onClose();
            }}
            className="font-bold text-[#F7941D] hover:text-[#D97706] flex items-center gap-1 cursor-pointer"
          >
            <span>Consult BG Experts →</span>
          </button>
        </div>

      </aside>
    </div>
  );
}
