import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  FileCode2, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Building2, 
  Search, 
  ExternalLink,
  Layers,
  FileCheck,
  Coins,
  Users,
  Award,
  Paintbrush,
  Flame,
  ClipboardCheck,
  GraduationCap,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sliders,
  Maximize2
} from 'lucide-react';

export default function DashboardPage({ setActivePage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const heroSlides = [
    {
      id: 'blast-setup',
      title: 'Industrial Surface Preparation & Abrasive Blast Setup',
      category: 'Surface Prep · ISO 8501-1 SA 2½',
      subtitle: 'Compressed air delivery, hypodermic nozzle pressure check, and GMA garnet media recovery systems.',
      image: '/01__Main_BLAST-SETUP-image.jpg',
      badge: 'Standard: ISO 8501-1',
      metric: 'Rz 65–85 µm',
      targetModule: 'coating-calculator'
    },
    {
      id: 'refinery-vessel',
      title: 'Storage Tank Shell & Internal Vessel Lining',
      category: 'Refinery & Petrochem · Asset Integrity',
      subtitle: 'High-build solvent-free amine-cured epoxy lining engineered for aggressive hydrocarbon immersion.',
      image: '/R2_1_Refinery_Vessel.jpg',
      badge: 'ISO 12944 Im2 / Im4',
      metric: 'DFT 450 µm',
      targetModule: 'specification-reading'
    },
    {
      id: 'structural-jacket',
      title: 'Offshore Platform Jacket & Heavy Structural Steel Protection',
      category: 'Marine / Offshore · Atmospheric CX',
      subtitle: 'Inorganic zinc silicate primer + high-build epoxy intermediate + aliphatic polyurethane topcoat.',
      image: '/Front_Page.jpg',
      badge: '25-Yr Durability (VH)',
      metric: '3-Coat System',
      targetModule: 'coating-procedure'
    },
    {
      id: 'blast-booth',
      title: 'Automated Blasting & Spray Coating Enclosure',
      category: 'Shop Painting Facility · Environmental Control',
      subtitle: 'Continuous abrasive classification, dust extraction ventilation, and climate-controlled drying.',
      image: '/R2___1_Blasting_and_Painting_Booth.jpg',
      badge: 'Controlled Environment',
      metric: 'RH < 80% · Dew Pt +3°C',
      targetModule: 'manpower-estimation'
    },
    {
      id: 'inspection-survey',
      title: 'Coating Survey & Adhesion Verification (CIR)',
      category: 'QA / QC Field Testing · ASTM D4541 / D3359',
      subtitle: 'SSPC-PA 2 90/10 gauge rule verification, Bresle salt contamination, and hydraulic pull-off testing.',
      image: '/01__Coating_Survey_and_Corrosion_Assessment-transformed.png',
      badge: 'AMPP / FROSIO Level 3',
      metric: 'Adhesion > 14 MPa',
      targetModule: 'inspection-reporting'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const metricCards = [
    { title: 'Project Estimations', value: '1,420', subtitle: 'Saved in project history', change: '+18% this month', icon: Calculator, color: 'amber' },
    { title: 'Certified Operators', value: '312', subtitle: 'Blasters, Painters & TSA', change: 'OQR / PQR Active', icon: Award, color: 'orange' },
    { title: 'Standards Library', value: '45+', subtitle: 'ISO 12944, NACE, SSPC, ASTM', change: 'Fully Verified', icon: BookOpen, color: 'sky' },
    { title: 'Approved Contractors', value: '24', subtitle: 'Prequalified Tier 1/2', change: 'CMS Active', icon: Building2, color: 'emerald' }
  ];

  const recentCalculations = [
    { id: 'CALC-9045', project: 'Mundra LNG Tank Farm Coating', type: 'Tank Shell', inputs: 'Dia 24.0m × H 15.0m', area: '1,130.97 m²', paint: '288.75 L', date: '2026-08-29 19:40', status: 'Approved' },
    { id: 'CALC-9044', project: 'FPSO Turret Process Piping Spools', type: 'Pipe Spool', inputs: 'OD 323.9mm × L 12.0m (25 Qty)', area: '305.25 m²', paint: '78.10 L', date: '2026-08-29 18:15', status: 'Logged' },
    { id: 'CALC-9043', project: 'Dahej Petrochemical Heavy Beams', type: 'Structural Steel', inputs: 'Tonnage 450 MT (Med Norm)', area: '11,250.00 m²', paint: '2,880.00 L', date: '2026-08-29 15:30', status: 'Logged' },
    { id: 'CALC-9042', project: 'Hazira Offshore Platform Jacket', type: 'Abrasive Blasting', inputs: 'Area 2,400 m² (Garnet GMA)', area: '2,400.00 m²', paint: '43.20 MT Media', date: '2026-08-29 14:10', status: 'Logged' },
    { id: 'CALC-9041', project: 'Surat Refinery Storage Tank T-102', type: 'Tank Roof', inputs: 'Conical Roof Dia 18.0m', area: '274.07 m²', paint: '70.10 L', date: '2026-08-29 11:25', status: 'Logged' }
  ];

  const filteredLogs = recentCalculations.filter(c => {
    const matchesSearch = c.project.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || c.type.toLowerCase().replace(' ', '_') === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const coreModules = [
    {
      id: 'coating-calculator',
      title: 'Coating Calculator Suite',
      tag: '44+ Tools',
      desc: 'Surface area take-off, paint & abrasive volume, WFT/DFT, dead volume loss, TSA, PFP, and life cycle cost.',
      icon: Calculator,
      color: 'text-[#F7941D] bg-amber-50 border-amber-100',
      action: 'Launch Calculator Hub'
    },
    {
      id: 'specification-reading',
      title: 'Specification Reading Engine',
      tag: 'MNC Spec Sheet',
      desc: 'MNC-grade coating design input sheets, multi-coat paint stack builder, ISO 12944 corrosivity, and client A4 export.',
      icon: FileCode2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      action: 'Open Spec Engine'
    },
    {
      id: 'coating-procedure',
      title: 'Coating Procedure (ITP)',
      tag: 'Method Statement',
      desc: 'Surface preparation & painting method statements, environmental control gates, and Inspection & Test Plans (ITP).',
      icon: FileCheck,
      color: 'text-[#D97706] bg-orange-50 border-orange-100',
      action: 'Author Procedure'
    },
    {
      id: 'unit-rate-estimation',
      title: 'Quick Unit-Rate Estimation',
      tag: 'Commercial Bid',
      desc: 'Calculate all-inclusive per-square-metre contractor unit rates incorporating surface prep, paint stacks, access, and margins.',
      icon: Coins,
      color: 'text-amber-700 bg-amber-50 border-amber-100',
      action: 'Open Unit-Rate Bid'
    },
    {
      id: 'manpower-estimation',
      title: 'Manpower Project Estimator',
      tag: 'Crew & Machinery',
      desc: 'Blasting and painting daily productivity, crew sizing, shift schedules, air compressor rentals, and manpower budgets.',
      icon: Users,
      color: 'text-purple-700 bg-purple-50 border-purple-100',
      action: 'Calculate Workforce'
    },
    {
      id: 'blaster-qualification',
      title: 'Blaster Qualification (OQR)',
      tag: 'ISO 8501 / 8503',
      desc: 'Operator testing, hypodermic nozzle pressure check, surface profile Rz evaluation, and certificate generation.',
      icon: Award,
      color: 'text-orange-600 bg-orange-50 border-orange-100',
      action: 'Evaluate Blaster'
    },
    {
      id: 'painter-qualification',
      title: 'Painter Qualification (PQR)',
      tag: 'SSPC-PA 2',
      desc: 'Airless spray painter evaluation, SSPC-PA 2 DFT distribution, cross-cut & pull-off adhesion testing, and PQR cards.',
      icon: Paintbrush,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      action: 'Evaluate Painter'
    },
    {
      id: 'tsa-qualification',
      title: 'TSA Operator Qualification',
      tag: 'ISO 2063 / NORSOK',
      desc: 'Twin-Wire Arc thermal spray operator qualification, 180° mandrel bend test, and ASTM D4541 adhesion evaluation.',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      action: 'Evaluate TSA Operator'
    },
    {
      id: 'inspection-reporting',
      title: 'Inspection & Adhesion (CIR)',
      tag: 'Daily Report',
      desc: 'Daily psychrometric logs, multi-coat DFT distributions, ASTM D4541 hydraulic pull-off adhesion, and A4 CIR export.',
      icon: ClipboardCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      action: 'Log Daily CIR'
    },
    {
      id: 'academy-lms',
      title: 'Digital Coating Academy LMS',
      tag: 'LMS Academy',
      desc: 'Accredited training curricula, exam simulators for NACE/AMPP CIP & FROSIO, and student certification.',
      icon: GraduationCap,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      action: 'Enter Academy'
    },
    {
      id: 'contractor-management',
      title: 'Contractor Directory (CMS)',
      tag: 'Vendor CMS',
      desc: 'Prequalification directory, vendor safety indices, certified workforce roster, and site allocation management.',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      action: 'Manage Contractors'
    },
    {
      id: 'knowledge',
      title: 'Standards Reference Library',
      tag: 'ISO / NACE',
      desc: 'Access SSPC-VIS 1 visual standards, ISO 8501-1 blast grades, SSPC-PA 2 gauge rules, and NACE inspection protocols.',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      action: 'Browse Library'
    }
  ];

  const slide = heroSlides[currentSlide];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* 1. Top Workspace Greeting & Header Card */}
      <div className="bg-gradient-to-r from-[#14181F] via-[#1E2530] to-[#14181F] border border-[#2A3340] border-b-3 border-b-[#E87B1E] rounded-2xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#FFF4E3]/15 border border-[#F3D2A0]/30 text-[#F39322] text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E87B1E]" />
              <span>BG CoatingOS™ — Digital Workspace for Coating Professionals</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight font-rajdhani tracking-wide">
              Good day, Prakash Ramavat <span className="text-slate-400 font-normal text-base md:text-lg">· Principal Consultant</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Unified surface treatment, protective coatings, corrosion engineering, QA/QC qualification, and commercial estimation operating system aligned with ISO 12944, SSPC, ASTM, and NACE/AMPP frameworks.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <button
              onClick={() => setActivePage('coating-calculator')}
              className="bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] hover:from-[#F39322] hover:to-[#E87B1E] text-white font-rajdhani font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Estimation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('specification-reading')}
              className="bg-[#1E2530] hover:bg-[#2A3340] text-white font-rajdhani font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider border border-[#39455A] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>Spec Design Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Operations & Project Showcase Image Carousel (Refined & Seamless) */}
      <div 
        className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-md group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Main Slide Presentation Container */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img 
            src={slide.image} 
            alt={slide.title}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100 group-hover:scale-105"
          />

          {/* Deep Contrast Multi-Stop Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Top Pill Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#F7941D] text-slate-950 font-mono font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-xs">
                {slide.badge}
              </span>
              <span className="hidden sm:inline-block bg-slate-900/80 backdrop-blur-xs text-slate-200 border border-white/15 font-mono text-[10px] px-2.5 py-1 rounded-full">
                {slide.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                {slide.metric}
              </span>
              <button
                onClick={() => setIsAutoPlaying(prev => !prev)}
                className="p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-300 border border-white/10 transition cursor-pointer"
                title={isAutoPlaying ? "Pause Carousel" : "Play Carousel"}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Captions & Quick Launch CTA */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
            <div className="space-y-1.5 max-w-2xl">
              <h3 className="text-lg md:text-2xl font-bold text-white leading-tight font-['Sora',sans-serif] drop-shadow-sm">
                {slide.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-xl leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            <button
              onClick={() => setActivePage(slide.targetModule)}
              className="self-start md:self-auto bg-white hover:bg-amber-50 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-md cursor-pointer shrink-0 font-mono"
            >
              <span>Explore Module</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F7941D]" />
            </button>
          </div>

          {/* Previous Slide Button */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 cursor-pointer shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 cursor-pointer shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Bottom Navigation Dots & Indicators */}
        <div className="bg-slate-900/90 border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            Featured Operations Showcase ({currentSlide + 1} / {heroSlides.length})
          </div>

          <div className="flex items-center gap-1.5">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-6 bg-[#F7941D]' 
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Key Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="w-4 h-4 text-[#F7941D]" />
                </div>
                <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {m.change}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">{m.title}</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5 font-['Sora',sans-serif]">{m.value}</div>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">{m.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* 4. Workspace Module Launchers Grid (All 11 Modules) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8DEE5] pb-2">
          <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wider flex items-center gap-2">
            <span className="text-[#E87B1E] font-mono">|</span> CoatingOS Digital Workspace Modules
          </h3>
          <span className="text-[10px] text-[#7E8B99] font-mono">11 Live Production Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.id}
                onClick={() => setActivePage(mod.id)}
                className="bg-white hover:border-[#F3D2A0] border border-[#D8DEE5] p-6 rounded-2xl cursor-pointer transition shadow-[0_2px_8px_rgba(20,24,32,0.06)] hover:shadow-md space-y-4 group hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border group-hover:scale-105 transition ${mod.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md font-bold">
                    {mod.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1B222C] font-rajdhani group-hover:text-[#E87B1E] transition">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[#7E8B99] mt-1 leading-relaxed font-sans">
                    {mod.desc}
                  </p>
                </div>
                <div className="text-xs font-bold text-[#E87B1E] flex items-center gap-1 font-mono">
                  <span>{mod.action}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Calculations Activity Audit Log Table */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E8EC] pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#1B222C] font-rajdhani uppercase tracking-wider">Recent Estimation Activity Logs</h3>
            <p className="text-xs text-[#7E8B99] font-sans">Real-time log of project calculation requests and engineering metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search project or ID..."
                className="bg-[#FFF9EE] border border-[#E6B878] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#8B3A00] placeholder-[#8B3A00]/50 w-48 focus:outline-none focus:ring-2 focus:ring-[#E87B1E] font-mono"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bg-[#F7F8FA] border border-[#D8DEE5] text-[#4E5B6A] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">All Tool Types</option>
              <option value="tank_shell">Tank Shell</option>
              <option value="tank_roof">Tank Roof</option>
              <option value="pipe_spool">Pipe Spool</option>
              <option value="structural_steel">Structural Steel</option>
              <option value="abrasive_blasting">Abrasive Blasting</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Project / Asset Name</th>
                <th>Tool Type</th>
                <th>Input Parameters</th>
                <th>Surface Area</th>
                <th>Practical Liters</th>
                <th>Logged At</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((row) => (
                  <tr key={row.id}>
                    <td className="font-mono font-bold text-[#E87B1E]">{row.id}</td>
                    <td className="font-bold text-[#1B222C]">{row.project}</td>
                    <td>
                      <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                        {row.type}
                      </span>
                    </td>
                    <td className="font-mono text-[#4E5B6A] text-[11px]">{row.inputs}</td>
                    <td className="font-mono font-bold text-[#1B222C]">{row.area}</td>
                    <td className="font-mono font-bold text-[#E87B1E]">{row.paint}</td>
                    <td className="font-mono text-[#7E8B99] text-[11px]">{row.date}</td>
                    <td className="text-right">
                      <button 
                        onClick={() => setActivePage('coating-calculator')}
                        className="text-[#E87B1E] hover:text-[#9E1B1E] font-bold text-xs inline-flex items-center gap-1 cursor-pointer font-rajdhani uppercase tracking-wider"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-[#7E8B99] font-mono text-xs">
                    No matching calculation logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
